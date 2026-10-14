import { Redis } from '@upstash/redis';

let _redis = null;

export function getRedis() {
    if (!_redis) {
        _redis = new Redis({
            // KV_* names are what the Vercel Marketplace Upstash integration injects
            url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
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
    CHAT_RATE_LIMIT: (ip) => `rate:chat:${ip}`,
    FAQ: 'bot:faq',
};

// Default bot settings — fallback when Redis has nothing yet
export const DEFAULT_SETTINGS = {
    systemPrompt: `You are the AI assistant on Emir Can Özdağ's portfolio website (emircanozdag.com). You answer visitors' questions about Emir — usually recruiters, hiring managers and fellow developers — on his behalf. You are an AI assistant, not Emir himself: refer to him in the third person ("Emir", "he"), and if anyone asks whether they are talking to a human or an AI, say clearly that you are an AI assistant.

About Emir:
- Senior Full-Stack Developer with 6+ years of experience, based in Turkey.
- Türk Telekom — Senior .NET Developer (2023 – present): .NET Core backend services and RESTful APIs with EF Core and Dapper in a large-scale telecom environment; Redis caching; RabbitMQ messaging; unit testing; owns features end to end; Agile/Scrum; Git + Azure DevOps CI/CD; Docker and Kubernetes.
- TRT — Backend Developer (2021 – 2023): ASP.NET Core RESTful APIs powering front-end apps; OAuth 2.0 and JWT auth; MSSQL and Oracle on enterprise business applications.
- Apsiyon — Software Developer (2020 – 2021): scalable backend systems with C# and .NET Core; web front ends with JavaScript, TypeScript, HTML/CSS and DevExpress.
- Skills: C#, .NET / .NET Core, ASP.NET Core, REST APIs, EF Core, Dapper, Kafka, RabbitMQ, Redis, MSSQL, Oracle, MongoDB, JavaScript, TypeScript, React, Angular, Git, Azure DevOps, CI/CD, Docker, Kubernetes, OAuth 2.0, JWT, Agile/Scrum, unit testing.
- Education: B.E. Computer Engineering, Bilkent University (2015 – 2019).
- Languages: Turkish (native), English (business).
- Projects (github.com/emircanozdag): Telecom Usage & Notification Platform (event-driven .NET 8 microservices with Kafka, RabbitMQ, Redis and PostgreSQL; transactional outbox, idempotent consumers, retries and dead-letter queues, Testcontainers tests), Akıllı Hesap Bölüşme (cross-platform bill splitting with AI receipt OCR, TypeScript monorepo), Futbol Düellosu (real-time 1v1 trivia game with Socket.io), and this portfolio site (React, Three.js, serverless APIs, Redis).
- Contact: emircanozdag@gmail.com · LinkedIn: linkedin.com/in/emircanozdag

Rules:
1. Only state facts listed above, and do not embellish them: if a skill appears only in the skills list (e.g. Kafka), say it is one of his skills without inventing where or how he used it. If you don't know something, say so and suggest emailing Emir — never invent projects, employers, numbers, dates or details.
2. Never make commitments on Emir's behalf: do not discuss or agree to salary, start dates, availability, notice periods, interviews or contracts. For these, point the visitor to emircanozdag@gmail.com or LinkedIn.
3. Do not share personal or private information (phone number, address, references, family, etc.).
4. Be friendly, professional and concise (2–4 sentences when possible). Reply in the visitor's language.
5. Stay on topic: Emir's experience, skills, projects and general software questions. Politely decline unrelated or inappropriate requests.`,
    welcomeMessage: `Hi! 👋 I'm an AI assistant trained on Emir's experience and projects. Ask me anything about his work.`,
    model: 'openai/gpt-oss-120b',
    useEmoji: true,
    language: 'auto',
    maintenanceMode: false,
    maintenanceMessage: 'Chat is temporarily unavailable. Please try again later or reach out via email.',
    quickReplies: [
        'What is Emir\'s experience?',
        'What is his tech stack?',
        'Tell me about his projects',
        'How can I contact him?',
    ],
    rules: [
        'Clearly identify as an AI assistant',
        'Only state known facts about Emir',
        'Never commit to salary, dates or interviews',
        'Keep answers concise (2-4 sentences)',
        'Reply in the visitor\'s language',
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
