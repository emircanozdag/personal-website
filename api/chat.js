import { getSettings, getRedis, KEYS } from './_lib/store.js';

const CHAT_RATE_LIMIT = 20; // requests per window per IP
const CHAT_RATE_WINDOW_SECONDS = 60;
const MAX_MESSAGES = 30;
const MAX_CONTENT_LENGTH = 2000;

async function checkChatRateLimit(ip) {
    try {
        const redis = getRedis();
        const key = KEYS.CHAT_RATE_LIMIT(ip);
        // NX keeps the window fixed from the first request; one round trip instead of two
        const [count] = await redis
            .pipeline()
            .incr(key)
            .expire(key, CHAT_RATE_WINDOW_SECONDS, 'NX')
            .exec();
        return count <= CHAT_RATE_LIMIT;
    } catch {
        return true; // allow on Redis error so the chat stays usable
    }
}

function sanitizeMessages(messages) {
    if (!Array.isArray(messages) || messages.length === 0) return null;
    const clean = [];
    // Keep only the most recent turns so long conversations keep working
    for (const m of messages.slice(-MAX_MESSAGES)) {
        if (!m || (m.role !== 'user' && m.role !== 'assistant')) return null;
        if (typeof m.content !== 'string' || m.content.length > MAX_CONTENT_LENGTH) return null;
        clean.push({ role: m.role, content: m.content });
    }
    return clean;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey =
        process.env.GROQ_API_KEY ||
        process.env.API_KEY ||
        process.env.VITE_GROQ_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Server configuration error: Missing API Key' });
    }

    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
    if (!(await checkChatRateLimit(ip))) {
        return res.status(429).json({ error: 'Too many requests, please slow down.' });
    }

    const settings = await getSettings();

    // Maintenance mode — return friendly message instead of calling LLM
    if (settings.maintenanceMode) {
        return res.status(200).json({
            choices: [{
                message: {
                    role: 'assistant',
                    content: settings.maintenanceMessage,
                },
            }],
            maintenance: true,
        });
    }

    const messages = sanitizeMessages(req.body?.messages);
    if (!messages) {
        return res.status(400).json({ error: 'Invalid messages' });
    }

    // Build server-side system prompt from Redis settings
    const systemMessage = {
        role: 'system',
        content: settings.systemPrompt,
    };

    const history = [
        systemMessage,
        ...messages,
    ];

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: history,
                model: settings.model || 'openai/gpt-oss-120b',
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Failed to fetch from Groq');
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error('Groq API Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
