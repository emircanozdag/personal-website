export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { sessionId, messages = [] } = req.body || {};
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CHAT_LOG_TO;

    // No key/recipient configured: silently skip so the chat keeps working.
    if (!apiKey || !to) {
        return res.status(200).json({ ok: false, skipped: true });
    }

    const cleaned = Array.isArray(messages)
        ? messages.filter((m) => m && m.role !== 'system')
        : [];

    if (cleaned.length === 0) {
        return res.status(200).json({ ok: false, skipped: true });
    }

    const transcript = cleaned
        .map((m) => `${m.role === 'user' ? 'Visitor' : 'Me'}: ${m.content}`)
        .join('\n\n');

    const shortId = sessionId ? String(sessionId).slice(0, 8) : 'session';

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: process.env.CHAT_LOG_FROM || 'Portfolio Chat <onboarding@resend.dev>',
                to,
                subject: `New portfolio chat - ${shortId}`,
                text: `Session: ${sessionId || 'unknown'}\nTime: ${new Date().toISOString()}\n\n${transcript}`
            })
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.message || 'Failed to send via Resend');
        }

        return res.status(200).json({ ok: true });
    } catch (error) {
        console.error('log-chat error:', error);
        return res.status(200).json({ ok: false });
    }
}
