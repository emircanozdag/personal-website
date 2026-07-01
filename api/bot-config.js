import { getSettings } from './_lib/store.js';

// Public endpoint — only exposes safe fields (no system prompt, no model)
export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');

    const settings = await getSettings();

    return res.status(200).json({
        welcomeMessage: settings.welcomeMessage,
        quickReplies: settings.quickReplies ?? [],
        maintenanceMode: settings.maintenanceMode ?? false,
        maintenanceMessage: settings.maintenanceMessage,
    });
}
