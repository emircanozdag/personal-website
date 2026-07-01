import { getSettings } from './_lib/store.js';

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

    const { messages = [] } = req.body;

    // Build server-side system prompt from Redis settings
    const systemMessage = {
        role: 'system',
        content: settings.systemPrompt,
    };

    const history = [
        systemMessage,
        ...messages.filter((m) => m.role !== 'system'),
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
                model: settings.model || 'llama-3.3-70b-versatile',
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Failed to fetch from Groq');
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error('Groq API Error:', error);
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
