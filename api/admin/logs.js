import { requireAuth } from '../_lib/auth.js';
import { getRedis, KEYS } from '../_lib/store.js';

export default async function handler(req, res) {
    const payload = await requireAuth(req, res);
    if (!payload) return;

    const redis = getRedis();

    // GET /api/admin/logs?page=1&limit=20&search=&session=<id>
    if (req.method === 'GET') {
        const { session, page = '1', limit = '20', search = '', export: doExport } = req.query;

        // Single session transcript
        if (session) {
            const data = await redis.get(KEYS.chatSession(session));
            if (!data) return res.status(404).json({ error: 'Session not found' });
            return res.status(200).json(data);
        }

        // Export all as JSON
        if (doExport === 'json' || doExport === 'csv') {
            const total = await redis.zcard(KEYS.CHAT_INDEX);
            const ids = await redis.zrange(KEYS.CHAT_INDEX, 0, total - 1, { rev: true });
            const sessions = await Promise.all(ids.map((id) => redis.get(KEYS.chatSession(id))));
            const valid = sessions.filter(Boolean);

            if (doExport === 'json') {
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Content-Disposition', 'attachment; filename="chat-logs.json"');
                return res.status(200).send(JSON.stringify(valid, null, 2));
            }

            // CSV
            const lines = ['Session ID,First Seen,Last Seen,Message Count,Preview'];
            for (const s of valid) {
                const preview = s.messages?.[0]?.content?.slice(0, 60).replace(/,/g, ' ') ?? '';
                lines.push(
                    `${s.sessionId},${new Date(s.firstSeen).toISOString()},${new Date(s.lastSeen).toISOString()},${s.messageCount},"${preview}"`
                );
            }
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="chat-logs.csv"');
            return res.status(200).send(lines.join('\n'));
        }

        // Paginated list
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
        const total = await redis.zcard(KEYS.CHAT_INDEX);
        const start = (pageNum - 1) * limitNum;
        const end = start + limitNum - 1;

        const ids = await redis.zrange(KEYS.CHAT_INDEX, start, end, { rev: true });
        const sessions = await Promise.all(ids.map((id) => redis.get(KEYS.chatSession(id))));
        let valid = sessions.filter(Boolean);

        if (search) {
            const q = search.toLowerCase();
            valid = valid.filter((s) =>
                s.sessionId?.includes(q) ||
                s.messages?.some((m) => m.content?.toLowerCase().includes(q))
            );
        }

        return res.status(200).json({
            sessions: valid.map((s) => ({
                sessionId: s.sessionId,
                firstSeen: s.firstSeen,
                lastSeen: s.lastSeen,
                messageCount: s.messageCount,
                preview: s.messages?.find((m) => m.role === 'user')?.content?.slice(0, 80) ?? '',
            })),
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
        });
    }

    // DELETE /api/admin/logs?session=<id>
    if (req.method === 'DELETE') {
        const { session } = req.query;
        if (!session) return res.status(400).json({ error: 'session required' });
        await redis.del(KEYS.chatSession(session));
        await redis.zrem(KEYS.CHAT_INDEX, session);
        return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
