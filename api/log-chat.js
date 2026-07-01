import { saveChatSession } from './_lib/store.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { sessionId, messages = [] } = req.body || {};

    const cleaned = Array.isArray(messages)
        ? messages.filter((m) => m && m.role !== 'system')
        : [];

    if (cleaned.length === 0) {
        return res.status(200).json({ ok: false, skipped: true });
    }

    // Persist to Redis
    const userAgent = req.headers['user-agent'] ?? '';
    await saveChatSession(sessionId, cleaned, { userAgent });

    // Also send via Resend email (original behaviour preserved)
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CHAT_LOG_TO;

    if (apiKey && to) {
        const transcript = cleaned
            .map((m) => `${m.role === 'user' ? 'Visitor' : 'Me'}: ${m.content}`)
            .join('\n\n');

        const shortId = sessionId ? String(sessionId).slice(0, 8) : 'session';

        try {
            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: process.env.CHAT_LOG_FROM || 'Portfolio Chat <onboarding@resend.dev>',
                    to,
                    subject: `New portfolio chat - ${shortId}`,
                    text: `Session: ${sessionId || 'unknown'}\nTime: ${new Date().toISOString()}\n\n${transcript}`,
                }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                console.error('Resend error:', data.message);
            }
        } catch (error) {
            console.error('log-chat email error:', error);
        }
    }

    return res.status(200).json({ ok: true });
}
