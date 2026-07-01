import { requireAuth } from '../_lib/auth.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    const payload = await requireAuth(req, res);
    if (!payload) return;
    return res.status(200).json({ ok: true, sub: payload.sub });
}
