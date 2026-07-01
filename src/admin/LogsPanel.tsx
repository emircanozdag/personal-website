import { useCallback, useEffect, useState } from "react";
import { adminApi, SessionDetail, SessionMeta } from "./adminApi";

const fmt = (ts: number) =>
    new Date(ts).toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" });

const TranscriptModal = ({
    sessionId,
    onClose,
    onDelete,
}: {
    sessionId: string;
    onClose: () => void;
    onDelete: () => void;
}) => {
    const [data, setData] = useState<SessionDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminApi.getSession(sessionId).then(setData).finally(() => setLoading(false));
    }, [sessionId]);

    const handleDelete = async () => {
        if (!confirm("Bu oturumu silmek istediğinizden emin misiniz?")) return;
        await adminApi.deleteSession(sessionId);
        onDelete();
    };

    return (
        <div className="adm-modal-overlay" onClick={onClose}>
            <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
                <div className="adm-modal-header">
                    <h3>
                        Transcript{" "}
                        <span className="adm-text-muted" style={{ fontWeight: 400 }}>
                            #{sessionId.slice(0, 8)}
                        </span>
                    </h3>
                    <div style={{ display: "flex", gap: 8 }}>
                        <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={handleDelete}>
                            Sil
                        </button>
                        <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={onClose}>
                            ✕ Kapat
                        </button>
                    </div>
                </div>
                <div className="adm-modal-body">
                    {loading && <div className="adm-loading">Yükleniyor…</div>}
                    {!loading && data && data.messages.length === 0 && (
                        <div className="adm-empty">Mesaj bulunamadı.</div>
                    )}
                    {!loading &&
                        data?.messages.map((m, i) => (
                            <div key={i} className={`adm-transcript-msg ${m.role}`}>
                                <div className="adm-role">
                                    {m.role === "user" ? "👤 Ziyaretçi" : "🤖 Bot"}
                                </div>
                                <div className="adm-content">{m.content}</div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

const LogsPanel = () => {
    const [sessions, setSessions] = useState<SessionMeta[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedSession, setSelectedSession] = useState<string | null>(null);

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const data = await adminApi.getLogs(page, 20, search);
            setSessions(data.sessions);
            setTotal(data.total);
            setPages(data.pages);
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => { fetchLogs(); }, [fetchLogs]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        setSearch(searchInput);
    };

    return (
        <div>
            <div className="adm-page-header">
                <h1>Sohbet Logları</h1>
                <p>Ziyaretçi sohbet geçmişi</p>
            </div>

            <div className="adm-card">
                <div className="adm-toolbar">
                    <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, flex: 1 }}>
                        <input
                            className="adm-search"
                            placeholder="Session ID veya mesaj ara…"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                        <button className="adm-btn adm-btn-secondary adm-btn-sm" type="submit">
                            Ara
                        </button>
                    </form>
                    <button
                        className="adm-btn adm-btn-secondary adm-btn-sm"
                        onClick={() => adminApi.exportLogs("json")}
                    >
                        ↓ JSON
                    </button>
                    <button
                        className="adm-btn adm-btn-secondary adm-btn-sm"
                        onClick={() => adminApi.exportLogs("csv")}
                    >
                        ↓ CSV
                    </button>
                </div>

                {loading ? (
                    <div className="adm-loading">Yükleniyor…</div>
                ) : sessions.length === 0 ? (
                    <div className="adm-empty">
                        {search ? "Arama sonucu bulunamadı." : "Henüz sohbet kaydı yok."}
                    </div>
                ) : (
                    <table className="adm-table">
                        <thead>
                            <tr>
                                <th>Session</th>
                                <th>İlk Mesaj</th>
                                <th>Son Aktif</th>
                                <th>Mesaj</th>
                                <th>Önizleme</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.map((s) => (
                                <tr key={s.sessionId}>
                                    <td>
                                        <span className="adm-tag">#{s.sessionId.slice(0, 8)}</span>
                                    </td>
                                    <td className="adm-text-muted">{fmt(s.firstSeen)}</td>
                                    <td className="adm-text-muted">{fmt(s.lastSeen)}</td>
                                    <td>{s.messageCount}</td>
                                    <td
                                        className="adm-text-muted"
                                        style={{ maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                                    >
                                        {s.preview || "—"}
                                    </td>
                                    <td>
                                        <button
                                            className="adm-btn adm-btn-ghost adm-btn-sm"
                                            onClick={() => setSelectedSession(s.sessionId)}
                                        >
                                            Görüntüle
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {pages > 1 && (
                    <div className="adm-pagination">
                        <span>
                            {total} kayıt · Sayfa {page}/{pages}
                        </span>
                        <button
                            className="adm-btn adm-btn-ghost adm-btn-sm"
                            disabled={page <= 1}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            ‹ Önceki
                        </button>
                        <button
                            className="adm-btn adm-btn-ghost adm-btn-sm"
                            disabled={page >= pages}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Sonraki ›
                        </button>
                    </div>
                )}
            </div>

            {selectedSession && (
                <TranscriptModal
                    sessionId={selectedSession}
                    onClose={() => setSelectedSession(null)}
                    onDelete={() => {
                        setSelectedSession(null);
                        fetchLogs();
                    }}
                />
            )}
        </div>
    );
};

export default LogsPanel;
