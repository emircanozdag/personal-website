import { SignJWT, jwtVerify } from 'jose';
import { getRedis, KEYS } from './store.js';

const COOKIE_NAME = 'admin_token';
const TOKEN_EXPIRY = '7d';
const MAX_LOGIN_ATTEMPTS = 10;
const RATE_WINDOW_SECONDS = 60 * 15; // 15 minutes

function getSecret() {
    const secret = process.env.ADMIN_JWT_SECRET;
    if (!secret) throw new Error('ADMIN_JWT_SECRET not set');
    return new TextEncoder().encode(secret);
}

export async function signToken() {
    return new SignJWT({ sub: 'admin' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(TOKEN_EXPIRY)
        .sign(getSecret());
}

export async function verifyToken(token) {
    try {
        const { payload } = await jwtVerify(token, getSecret());
        return payload;
    } catch {
        return null;
    }
}

export function parseCookies(cookieHeader = '') {
    const cookies = {};
    for (const pair of cookieHeader.split(';')) {
        const [k, ...v] = pair.trim().split('=');
        if (k) cookies[k.trim()] = decodeURIComponent(v.join('='));
    }
    return cookies;
}

export function setAuthCookie(res, token) {
    const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
    res.setHeader(
        'Set-Cookie',
        `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}; Path=/`
    );
}

export function clearAuthCookie(res) {
    res.setHeader(
        'Set-Cookie',
        `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/`
    );
}

export async function requireAuth(req, res) {
    const cookies = parseCookies(req.headers.cookie);
    const token = cookies[COOKIE_NAME];
    if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return null;
    }
    const payload = await verifyToken(token);
    if (!payload) {
        clearAuthCookie(res);
        res.status(401).json({ error: 'Session expired' });
        return null;
    }
    return payload;
}

export async function checkRateLimit(ip) {
    try {
        const redis = getRedis();
        const key = KEYS.RATE_LIMIT(ip || 'unknown');
        const attempts = await redis.incr(key);
        if (attempts === 1) {
            await redis.expire(key, RATE_WINDOW_SECONDS);
        }
        return attempts <= MAX_LOGIN_ATTEMPTS;
    } catch {
        return true; // allow on error
    }
}

// Timing-safe string comparison to prevent timing attacks
export async function safeCompare(a, b) {
    const encoder = new TextEncoder();
    const aBytes = encoder.encode(a);
    const bBytes = encoder.encode(b);
    if (aBytes.length !== bBytes.length) {
        // Compare anyway to keep constant time
        let diff = 0;
        for (let i = 0; i < Math.max(aBytes.length, bBytes.length); i++) {
            diff |= (aBytes[i] ?? 0) ^ (bBytes[i] ?? 0);
        }
        return false;
    }
    let diff = 0;
    for (let i = 0; i < aBytes.length; i++) {
        diff |= aBytes[i] ^ bBytes[i];
    }
    return diff === 0;
}
