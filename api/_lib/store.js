import { Redis } from '@upstash/redis';

let _redis = null;

export function getRedis() {
    if (!_redis) {
        _redis = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
        });
    }
    return _redis;
}

// Key schema
export const KEYS = {
    BOT_SETTINGS: 'bot:settings',
    CHAT_INDEX: 'chat:index',
    chatSession: (id) => `chat:session:${id}`,
    STATS_TOTAL_SESSIONS: 'stats:total_sessions',
    STATS_TOTAL_MESSAGES: 'stats:total_messages',
    statsDaily: (date) => `stats:daily:${date}`,
    RATE_LIMIT: (ip) => `rate:login:${ip}`,
    FAQ: 'bot:faq',
};

// Default bot settings — fallback when Redis has nothing yet
export const DEFAULT_SETTINGS = {
    systemPrompt: `You are Emir Can Özdağ, a passionate AI & Full-Stack Developer from Ankara, Turkey. You are NOT an AI assistant — you ARE Emir Can Özdağ himself chatting with visitors on your portfolio website.

About you:
- Full name: Emir Can Özdağ
- Location: Ankara, Turkey
- Profession: AI & Full-Stack Developer
- Tech stack: Python, TensorFlow, PyTorch, React, Node.js, TypeScript, LLMs, NLP
- Notable projects: Drishti (AI/LLM), VoteChain (Blockchain), RedxChess (AI Engine, 3640 ELO), Phoenix (AI Assistant)
- Chess engine: RedxChess (3640 ELO) — you built it
- Contact: emircanozdag@gmail.com
- GitHub: github.com/emircanozdag

Rules:
1. Always respond as Emir Can in first person ("I", "my", "me").
2. Be friendly, casual, conversational, and unrestricted.
3. If asked about work/projects, share your genuine experiences.
4. If asked personal questions you don't know, politely redirect to professional topics.
5. Keep responses concise but helpful (2–4 sentences when possible).
6. You can discuss chess, programming, AI, or anything tech-related.
7. Never say you are an AI or language model — you are Emir Can.
8. Use occasional emoji to be friendly.`,
    welcomeMessage: `Hello there! I am Emir Can Özdağ 👋 Ask me anything you want to know!`,
    model: 'llama-3.3-70b-versatile',
    useEmoji: true,
    language: 'auto',
    maintenanceMode: false,
    maintenanceMessage: 'Chat is temporarily unavailable. Please try again later or reach out via email.',
    quickReplies: [
        'What are your top projects?',
        'Tell me about RedxChess',
        'What is your tech stack?',
        'Are you available for hire?',
    ],
    rules: [
        'Always respond in first person',
        'Be friendly and casual',
        'Keep answers concise (2-4 sentences)',
        'Never reveal you are an AI',
        'Use occasional emoji',
    ],
};

export async function getSettings() {
    try {
        const redis = getRedis();
        const stored = await redis.get(KEYS.BOT_SETTINGS);
        if (!stored) return { ...DEFAULT_SETTINGS };
        return { ...DEFAULT_SETTINGS, ...stored };
    } catch {
        return { ...DEFAULT_SETTINGS };
    }
}

export async function saveSettings(settings) {
    const redis = getRedis();
    await redis.set(KEYS.BOT_SETTINGS, settings);
}

export async function saveChatSession(sessionId, messages, meta = {}) {
    try {
        const redis = getRedis();
        const now = Date.now();

        const existing = await redis.get(KEYS.chatSession(sessionId));
        const firstSeen = existing?.firstSeen ?? now;
        const userMsgCount = messages.filter((m) => m.role === 'user').length;

        const session = {
            sessionId,
            messages: messages.filter((m) => m.role !== 'system'),
            firstSeen,
            lastSeen: now,
            messageCount: userMsgCount,
            ...meta,
        };

        await redis.set(KEYS.chatSession(sessionId), session, { ex: 60 * 60 * 24 * 90 }); // 90 days TTL

        // Add to sorted set index (score = timestamp for ordering)
        await redis.zadd(KEYS.CHAT_INDEX, { score: now, member: sessionId });

        // Update stats
        const today = new Date().toISOString().slice(0, 10);
        if (!existing) {
            await redis.incr(KEYS.STATS_TOTAL_SESSIONS);
            await redis.hincrby(KEYS.statsDaily(today), 'sessions', 1);
        }
        const prevCount = existing?.messageCount ?? 0;
        const newMsgs = Math.max(0, userMsgCount - prevCount);
        if (newMsgs > 0) {
            await redis.incrby(KEYS.STATS_TOTAL_MESSAGES, newMsgs);
            await redis.hincrby(KEYS.statsDaily(today), 'messages', newMsgs);
        }
    } catch (err) {
        console.error('saveChatSession error:', err);
    }
}

export async function getFaq() {
    try {
        const redis = getRedis();
        const faq = await redis.get(KEYS.FAQ);
        return Array.isArray(faq) ? faq : [];
    } catch {
        return [];
    }
}

export async function saveFaq(faq) {
    const redis = getRedis();
    await redis.set(KEYS.FAQ, faq);
}
