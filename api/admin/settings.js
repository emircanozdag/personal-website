import { requireAuth } from '../_lib/auth.js';
import { getSettings, saveSettings } from '../_lib/store.js';

export default async function handler(req, res) {
    const payload = await requireAuth(req, res);
    if (!payload) return;

    if (req.method === 'GET') {
        const settings = await getSettings();
        return res.status(200).json(settings);
    }

    if (req.method === 'PUT') {
        const current = await getSettings();
        const updated = { ...current, ...req.body };
        await saveSettings(updated);
        return res.status(200).json({ ok: true, settings: updated });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
