import { signToken, setAuthCookie, checkRateLimit, safeCompare } from '../_lib/auth.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';

    const allowed = await checkRateLimit(ip);
    if (!allowed) {
        return res.status(429).json({ error: 'Too many attempts. Try again in 15 minutes.' });
    }

    const { password } = req.body || {};
    if (!password) {
        return res.status(400).json({ error: 'Password required' });
    }

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
        return res.status(500).json({ error: 'Server misconfiguration' });
    }

    const valid = await safeCompare(password, adminPassword);
    if (!valid) {
        return res.status(401).json({ error: 'Invalid password' });
    }

    const token = await signToken();
    setAuthCookie(res, token);
    return res.status(200).json({ ok: true });
}
