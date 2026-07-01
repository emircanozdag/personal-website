import { useEffect, useState } from "react";
import { adminApi, AnalyticsData } from "./adminApi";

const AnalyticsPanel = () => {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminApi.getAnalytics().then(setData).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="adm-loading">Yükleniyor…</div>;
    if (!data) return <div className="adm-empty">Veri alınamadı.</div>;

    const days = Object.entries(data.daily).sort(([a], [b]) => a.localeCompare(b));
    const maxSessions = Math.max(1, ...days.map(([, d]) => d.sessions));
    const maxMessages = Math.max(1, ...days.map(([, d]) => d.messages));

    return (
        <div>
            <div className="adm-page-header">
                <h1>Analytics</h1>
                <p>Sohbet istatistikleri ve günlük aktivite</p>
            </div>

            <div className="adm-stats-row">
                <div className="adm-stat-card">
                    <div className="adm-stat-icon">💬</div>
                    <div className="adm-stat-label">Toplam Oturum</div>
                    <div className="adm-stat-value">{data.totalSessions.toLocaleString()}</div>
                </div>
                <div className="adm-stat-card">
                    <div className="adm-stat-icon">✉️</div>
                    <div className="adm-stat-label">Toplam Mesaj</div>
                    <div className="adm-stat-value">{data.totalMessages.toLocaleString()}</div>
                </div>
                <div className="adm-stat-card">
                    <div className="adm-stat-icon">🗂️</div>
                    <div className="adm-stat-label">Aktif Oturum</div>
                    <div className="adm-stat-value">{data.activeSessions.toLocaleString()}</div>
                </div>
                <div className="adm-stat-card">
                    <div className="adm-stat-icon">📊</div>
                    <div className="adm-stat-label">Ort. Mesaj/Oturum</div>
                    <div className="adm-stat-value">
                        {data.totalSessions > 0
                            ? (data.totalMessages / data.totalSessions).toFixed(1)
                            : "—"}
                    </div>
                </div>
            </div>

            <div className="adm-card">
                <div className="adm-card-title">📈 Son 14 Gün — Oturum</div>
                <div className="adm-chart-wrap">
                    <div className="adm-bar-chart">
                        {days.map(([date, d]) => (
                            <div key={date} className="adm-bar-col">
                                <div
                                    className="adm-bar"
                                    style={{ height: `${Math.round((d.sessions / maxSessions) * 100)}%` }}
                                    title={`${date}: ${d.sessions} oturum`}
                                />
                                <div className="adm-bar-label">{date.slice(5)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="adm-card">
                <div className="adm-card-title">✉️ Son 14 Gün — Mesaj</div>
                <div className="adm-chart-wrap">
                    <div className="adm-bar-chart">
                        {days.map(([date, d]) => (
                            <div key={date} className="adm-bar-col">
                                <div
                                    className="adm-bar"
                                    style={{ height: `${Math.round((d.messages / maxMessages) * 100)}%` }}
                                    title={`${date}: ${d.messages} mesaj`}
                                />
                                <div className="adm-bar-label">{date.slice(5)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPanel;
