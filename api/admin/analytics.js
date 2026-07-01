import { requireAuth } from '../_lib/auth.js';
import { getRedis, KEYS } from '../_lib/store.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    const payload = await requireAuth(req, res);
    if (!payload) return;

    const redis = getRedis();

    const [totalSessions, totalMessages, indexSize] = await Promise.all([
        redis.get(KEYS.STATS_TOTAL_SESSIONS),
        redis.get(KEYS.STATS_TOTAL_MESSAGES),
        redis.zcard(KEYS.CHAT_INDEX),
    ]);

    // Last 14 days daily stats
    const days = [];
    const daily = {};
    for (let i = 13; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        days.push(key);
    }

    const dailyData = await Promise.all(days.map((d) => redis.hgetall(KEYS.statsDaily(d))));
    for (let i = 0; i < days.length; i++) {
        daily[days[i]] = {
            sessions: parseInt(dailyData[i]?.sessions ?? 0),
            messages: parseInt(dailyData[i]?.messages ?? 0),
        };
    }

    return res.status(200).json({
        totalSessions: parseInt(totalSessions ?? 0),
        totalMessages: parseInt(totalMessages ?? 0),
        activeSessions: indexSize,
        daily,
    });
}
