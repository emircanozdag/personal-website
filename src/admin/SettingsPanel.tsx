import { useEffect, useState } from "react";
import { adminApi, BotSettings } from "./adminApi";

const MODELS = [
    { value: "llama-3.3-70b-versatile", label: "Llama 3.3 70B (Varsayılan)" },
    { value: "llama-3.1-8b-instant", label: "Llama 3.1 8B (Hızlı)" },
    { value: "llama3-70b-8192", label: "Llama3 70B 8K" },
    { value: "mixtral-8x7b-32768", label: "Mixtral 8x7B" },
    { value: "gemma2-9b-it", label: "Gemma2 9B" },
];

const LANGUAGES = [
    { value: "auto", label: "Otomatik (Ziyaretçi diline göre)" },
    { value: "en", label: "Sadece İngilizce" },
    { value: "tr", label: "Sadece Türkçe" },
];

const SettingsPanel = () => {
    const [settings, setSettings] = useState<BotSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState("");
    const [newQuickReply, setNewQuickReply] = useState("");
    const [newRule, setNewRule] = useState("");

    useEffect(() => {
        adminApi.getSettings().then(setSettings).finally(() => setLoading(false));
    }, []);

    const showStatus = (msg: string) => {
        setStatus(msg);
        setTimeout(() => setStatus(""), 2500);
    };

    const handleSave = async () => {
        if (!settings) return;
        setSaving(true);
        try {
            const res = await adminApi.saveSettings(settings);
            setSettings(res.settings);
            showStatus("Kaydedildi ✓");
        } catch {
            showStatus("Kayıt başarısız ✗");
        } finally {
            setSaving(false);
        }
    };

    const patch = (key: keyof BotSettings, value: unknown) => {
        setSettings((s) => s ? { ...s, [key]: value } : s);
    };

    const addQuickReply = () => {
        const val = newQuickReply.trim();
        if (!val || !settings) return;
        patch("quickReplies", [...(settings.quickReplies ?? []), val]);
        setNewQuickReply("");
    };

    const removeQuickReply = (idx: number) => {
        if (!settings) return;
        patch("quickReplies", settings.quickReplies.filter((_, i) => i !== idx));
    };

    const addRule = () => {
        const val = newRule.trim();
        if (!val || !settings) return;
        patch("rules", [...(settings.rules ?? []), val]);
        setNewRule("");
    };

    const removeRule = (idx: number) => {
        if (!settings) return;
        patch("rules", settings.rules.filter((_, i) => i !== idx));
    };

    if (loading) return <div className="adm-loading">Yükleniyor…</div>;
    if (!settings) return <div className="adm-empty">Ayarlar yüklenemedi.</div>;

    return (
        <div>
            <div className="adm-page-header">
                <h1>Bot Ayarları</h1>
                <p>System prompt, model, dil ve davranış kuralları</p>
            </div>

            {/* System Prompt */}
            <div className="adm-card">
                <div className="adm-card-title">🧠 System Prompt</div>
                <div className="adm-field">
                    <label>Botun kişiliğini ve kurallarını tanımlayan talimat</label>
                    <textarea
                        className="adm-textarea"
                        rows={16}
                        value={settings.systemPrompt}
                        onChange={(e) => patch("systemPrompt", e.target.value)}
                        spellCheck={false}
                    />
                </div>
            </div>

            {/* Welcome Message */}
            <div className="adm-card">
                <div className="adm-card-title">👋 Karşılama Mesajı</div>
                <div className="adm-field">
                    <label>Chat açıldığında ziyaretçiye gösterilen ilk mesaj</label>
                    <textarea
                        className="adm-textarea"
                        rows={2}
                        value={settings.welcomeMessage}
                        onChange={(e) => patch("welcomeMessage", e.target.value)}
                    />
                </div>
            </div>

            {/* Model & Language */}
            <div className="adm-card">
                <div className="adm-card-title">⚙️ Model ve Dil</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div className="adm-field">
                        <label>LLM Modeli</label>
                        <select
                            className="adm-select"
                            value={settings.model}
                            onChange={(e) => patch("model", e.target.value)}
                        >
                            {MODELS.map((m) => (
                                <option key={m.value} value={m.value}>
                                    {m.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="adm-field">
                        <label>Dil</label>
                        <select
                            className="adm-select"
                            value={settings.language}
                            onChange={(e) => patch("language", e.target.value)}
                        >
                            {LANGUAGES.map((l) => (
                                <option key={l.value} value={l.value}>
                                    {l.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div style={{ marginTop: 16 }}>
                    <div className="adm-toggle-row">
                        <div>
                            <div className="adm-toggle-label">Emoji Kullan</div>
                            <div className="adm-toggle-desc">Bot cevaplarında emoji kullanır</div>
                        </div>
                        <label className="adm-toggle">
                            <input
                                type="checkbox"
                                checked={settings.useEmoji}
                                onChange={(e) => patch("useEmoji", e.target.checked)}
                            />
                            <span className="adm-toggle-track" />
                        </label>
                    </div>
                </div>
            </div>

            {/* Quick Replies */}
            <div className="adm-card">
                <div className="adm-card-title">⚡ Hazır Sorular (Quick Replies)</div>
                <p style={{ fontSize: "0.83rem", color: "var(--adm-text-muted)", margin: "0 0 12px" }}>
                    Chat'te tıklanabilir chip'ler olarak gösterilir
                </p>
                <div className="adm-chip-list">
                    {settings.quickReplies.map((r, i) => (
                        <div key={i} className="adm-chip">
                            {r}
                            <button className="adm-chip-del" onClick={() => removeQuickReply(i)}>
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
                <div className="adm-add-row">
                    <input
                        className="adm-input"
                        placeholder="Yeni hazır soru…"
                        value={newQuickReply}
                        onChange={(e) => setNewQuickReply(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addQuickReply()}
                        style={{ flex: 1 }}
                    />
                    <button className="adm-btn adm-btn-secondary" onClick={addQuickReply}>
                        Ekle
                    </button>
                </div>
            </div>

            {/* Rules */}
            <div className="adm-card">
                <div className="adm-card-title">📋 Davranış Kuralları</div>
                <p style={{ fontSize: "0.83rem", color: "var(--adm-text-muted)", margin: "0 0 12px" }}>
                    System prompt'a ek olarak botun uyması gereken kısa kurallar
                </p>
                <div className="adm-chip-list">
                    {settings.rules.map((r, i) => (
                        <div key={i} className="adm-chip">
                            {r}
                            <button className="adm-chip-del" onClick={() => removeRule(i)}>
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
                <div className="adm-add-row">
                    <input
                        className="adm-input"
                        placeholder="Yeni kural…"
                        value={newRule}
                        onChange={(e) => setNewRule(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addRule()}
                        style={{ flex: 1 }}
                    />
                    <button className="adm-btn adm-btn-secondary" onClick={addRule}>
                        Ekle
                    </button>
                </div>
            </div>

            {/* Save bar */}
            <div className="adm-save-bar">
                {status && <span className="adm-save-status">{status}</span>}
                <button
                    className="adm-btn adm-btn-secondary"
                    onClick={() => {
                        setLoading(true);
                        adminApi.getSettings().then(setSettings).finally(() => setLoading(false));
                    }}
                >
                    Sıfırla
                </button>
                <button
                    className="adm-btn adm-btn-primary"
                    style={{ width: "auto" }}
                    disabled={saving}
                    onClick={handleSave}
                >
                    {saving ? "Kaydediliyor…" : "💾 Kaydet"}
                </button>
            </div>
        </div>
    );
};

export default SettingsPanel;
