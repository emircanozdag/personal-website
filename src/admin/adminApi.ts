const BASE = '/api/admin';

async function request<T = unknown>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
        ...options,
    });

    if (res.status === 401) {
        window.location.href = '/admin';
        throw new Error('Unauthorized');
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
    return data as T;
}

export type BotSettings = {
    systemPrompt: string;
    welcomeMessage: string;
    model: string;
    useEmoji: boolean;
    language: string;
    maintenanceMode: boolean;
    maintenanceMessage: string;
    quickReplies: string[];
    rules: string[];
};

export type FaqItem = {
    id: string;
    question: string;
    answer: string;
};

export type SessionMeta = {
    sessionId: string;
    firstSeen: number;
    lastSeen: number;
    messageCount: number;
    preview: string;
};

export type SessionDetail = {
    sessionId: string;
    messages: { role: string; content: string }[];
    firstSeen: number;
    lastSeen: number;
    messageCount: number;
};

export type LogsResponse = {
    sessions: SessionMeta[];
    total: number;
    page: number;
    pages: number;
};

export type AnalyticsData = {
    totalSessions: number;
    totalMessages: number;
    activeSessions: number;
    daily: Record<string, { sessions: number; messages: number }>;
};

export const adminApi = {
    // Auth
    login: (password: string) =>
        request('/login', { method: 'POST', body: JSON.stringify({ password }) }),
    logout: () =>
        request('/logout', { method: 'POST' }),
    me: () =>
        request<{ ok: boolean }>('/me', { method: 'GET' }),

    // Settings
    getSettings: () =>
        request<BotSettings>('/settings'),
    saveSettings: (settings: Partial<BotSettings>) =>
        request<{ ok: boolean; settings: BotSettings }>('/settings', {
            method: 'PUT',
            body: JSON.stringify(settings),
        }),

    // Logs
    getLogs: (page = 1, limit = 20, search = '') =>
        request<LogsResponse>(`/logs?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`),
    getSession: (sessionId: string) =>
        request<SessionDetail>(`/logs?session=${sessionId}`),
    deleteSession: (sessionId: string) =>
        request(`/logs?session=${sessionId}`, { method: 'DELETE' }),
    exportLogs: (format: 'json' | 'csv') => {
        window.open(`${BASE}/logs?export=${format}`, '_blank');
    },

    // FAQ
    getFaq: () =>
        request<FaqItem[]>('/faq'),
    addFaq: (question: string, answer: string) =>
        request<FaqItem>('/faq', { method: 'POST', body: JSON.stringify({ question, answer }) }),
    deleteFaq: (id: string) =>
        request(`/faq?id=${id}`, { method: 'DELETE' }),
    reorderFaq: (faq: FaqItem[]) =>
        request('/faq', { method: 'PUT', body: JSON.stringify(faq) }),

    // Analytics
    getAnalytics: () =>
        request<AnalyticsData>('/analytics'),
};
