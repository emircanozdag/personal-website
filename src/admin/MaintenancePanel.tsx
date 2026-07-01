import { useEffect, useState } from "react";
import { adminApi, BotSettings } from "./adminApi";

const MaintenancePanel = () => {
    const [settings, setSettings] = useState<Partial<BotSettings>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState("");

    useEffect(() => {
        adminApi.getSettings().then(setSettings).finally(() => setLoading(false));
    }, []);

    const save = async (patch: Partial<BotSettings>) => {
        const next = { ...settings, ...patch };
        setSettings(next);
        setSaving(true);
        try {
            await adminApi.saveSettings(next);
            setStatus("Kaydedildi ✓");
            setTimeout(() => setStatus(""), 2500);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="adm-loading">Yükleniyor…</div>;

    const isOn = settings.maintenanceMode ?? false;

    return (
        <div>
            <div className="adm-page-header">
                <h1>Bakım Modu</h1>
                <p>Botu geçici olarak kapat ve özel mesaj göster</p>
            </div>

            {isOn && (
                <div className="adm-maintenance-banner">
                    ⚠️ Bakım modu aktif — Ziyaretçiler sohbet açamıyor.
                </div>
            )}

            <div className="adm-card">
                <div className="adm-toggle-row">
                    <div>
                        <div className="adm-toggle-label">Bakım Modunu Etkinleştir</div>
                        <div className="adm-toggle-desc">
                            Açık olduğunda chatbot mesajları yerine bakım mesajı gösterilir
                        </div>
                    </div>
                    <label className="adm-toggle">
                        <input
                            type="checkbox"
                            checked={isOn}
                            onChange={(e) => save({ maintenanceMode: e.target.checked })}
                        />
                        <span className="adm-toggle-track" />
                    </label>
                </div>

                <div className="adm-field" style={{ marginTop: 20 }}>
                    <label>Bakım Mesajı</label>
                    <textarea
                        className="adm-textarea"
                        rows={3}
                        value={settings.maintenanceMessage ?? ""}
                        onChange={(e) =>
                            setSettings((s) => ({ ...s, maintenanceMessage: e.target.value }))
                        }
                        onBlur={() =>
                            save({ maintenanceMessage: settings.maintenanceMessage })
                        }
                        placeholder="Ziyaretçilere gösterilecek mesaj"
                    />
                </div>

                <div className="adm-save-bar">
                    {status && <span className="adm-save-status">{status}</span>}
                    <button
                        className="adm-btn adm-btn-primary"
                        style={{ width: "auto" }}
                        disabled={saving}
                        onClick={() =>
                            save({
                                maintenanceMode: settings.maintenanceMode,
                                maintenanceMessage: settings.maintenanceMessage,
                            })
                        }
                    >
                        {saving ? "Kaydediliyor…" : "Kaydet"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MaintenancePanel;
