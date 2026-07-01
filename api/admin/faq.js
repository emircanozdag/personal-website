import { requireAuth } from '../_lib/auth.js';
import { getFaq, saveFaq } from '../_lib/store.js';

export default async function handler(req, res) {
    const payload = await requireAuth(req, res);
    if (!payload) return;

    if (req.method === 'GET') {
        return res.status(200).json(await getFaq());
    }

    // Full replace (ordered list)
    if (req.method === 'PUT') {
        const list = req.body;
        if (!Array.isArray(list)) return res.status(400).json({ error: 'Expected array' });
        await saveFaq(list);
        return res.status(200).json({ ok: true });
    }

    // Add single item
    if (req.method === 'POST') {
        const { question, answer } = req.body || {};
        if (!question || !answer) return res.status(400).json({ error: 'question and answer required' });
        const faq = await getFaq();
        const item = { id: Date.now().toString(), question, answer };
        faq.push(item);
        await saveFaq(faq);
        return res.status(201).json(item);
    }

    // Delete by id
    if (req.method === 'DELETE') {
        const { id } = req.query;
        if (!id) return res.status(400).json({ error: 'id required' });
        const faq = await getFaq();
        await saveFaq(faq.filter((f) => f.id !== id));
        return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
