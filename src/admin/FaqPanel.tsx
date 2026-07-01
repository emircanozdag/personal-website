import { useEffect, useState } from "react";
import { adminApi, FaqItem } from "./adminApi";

const FaqPanel = () => {
    const [faq, setFaq] = useState<FaqItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState("");

    useEffect(() => {
        adminApi.getFaq().then(setFaq).finally(() => setLoading(false));
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim() || !answer.trim()) return;
        setSaving(true);
        try {
            const item = await adminApi.addFaq(question.trim(), answer.trim());
            setFaq((prev) => [...prev, item]);
            setQuestion("");
            setAnswer("");
            setStatus("Eklendi ✓");
            setTimeout(() => setStatus(""), 2500);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bu soru/cevabı silmek istiyor musunuz?")) return;
        await adminApi.deleteFaq(id);
        setFaq((prev) => prev.filter((f) => f.id !== id));
    };

    if (loading) return <div className="adm-loading">Yükleniyor…</div>;

    return (
        <div>
            <div className="adm-page-header">
                <h1>FAQ Yönetimi</h1>
                <p>Sık sorulan sorular — bot bu listeden sabit cevaplar verir</p>
            </div>

            {/* Add form */}
            <div className="adm-card">
                <div className="adm-card-title">➕ Yeni Soru/Cevap Ekle</div>
                <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div className="adm-field">
                        <label>Soru</label>
                        <input
                            className="adm-input"
                            placeholder="Ziyaretçinin sorabileceği soru"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />
                    </div>
                    <div className="adm-field">
                        <label>Cevap</label>
                        <textarea
                            className="adm-textarea"
                            rows={3}
                            placeholder="Botun vereceği cevap"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                        />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <button
                            className="adm-btn adm-btn-primary"
                            type="submit"
                            disabled={saving || !question.trim() || !answer.trim()}
                            style={{ width: "auto" }}
                        >
                            {saving ? "Ekleniyor…" : "Ekle"}
                        </button>
                        {status && <span className="adm-save-status">{status}</span>}
                    </div>
                </form>
            </div>

            {/* FAQ list */}
            <div>
                {faq.length === 0 && (
                    <div className="adm-empty">Henüz FAQ girişi yok. Yukarıdan ekleyin.</div>
                )}
                {faq.map((item) => (
                    <div key={item.id} className="adm-faq-item">
                        <div className="adm-faq-body">
                            <div className="adm-faq-q">❓ {item.question}</div>
                            <div className="adm-faq-a">→ {item.answer}</div>
                        </div>
                        <div className="adm-faq-actions">
                            <button
                                className="adm-btn adm-btn-danger adm-btn-sm"
                                onClick={() => handleDelete(item.id)}
                            >
                                Sil
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FaqPanel;
