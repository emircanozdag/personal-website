import { lazy, Suspense, useEffect, useState } from "react";
import { adminApi } from "../admin/adminApi";
import LoginForm from "../admin/LoginForm";
import "../admin/Admin.css";

const AnalyticsPanel = lazy(() => import("../admin/AnalyticsPanel"));
const SettingsPanel = lazy(() => import("../admin/SettingsPanel"));
const LogsPanel = lazy(() => import("../admin/LogsPanel"));
const FaqPanel = lazy(() => import("../admin/FaqPanel"));
const MaintenancePanel = lazy(() => import("../admin/MaintenancePanel"));

type Tab = "analytics" | "settings" | "logs" | "faq" | "maintenance";

const NAV: { id: Tab; icon: string; label: string }[] = [
    { id: "analytics", icon: "📊", label: "Analytics" },
    { id: "settings", icon: "⚙️", label: "Bot Ayarları" },
    { id: "logs", icon: "💬", label: "Sohbet Logları" },
    { id: "faq", icon: "❓", label: "FAQ" },
    { id: "maintenance", icon: "🔧", label: "Bakım Modu" },
];

const Admin = () => {
    const [authed, setAuthed] = useState<boolean | null>(null); // null = checking
    const [tab, setTab] = useState<Tab>("analytics");
    const [loggingOut, setLoggingOut] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        // Override the global body { overflow: hidden } set by the main site's GSAP scroll
        const prev = document.body.style.overflow;
        document.body.style.overflow = "auto";
        document.documentElement.style.overflow = "auto";
        return () => {
            document.body.style.overflow = prev;
            document.documentElement.style.overflow = "";
        };
    }, []);

    useEffect(() => {
        adminApi.me()
            .then(() => setAuthed(true))
            .catch(() => setAuthed(false));
    }, []);

    const handleLogout = async () => {
        setLoggingOut(true);
        await adminApi.logout().catch(() => null);
        setAuthed(false);
        setLoggingOut(false);
    };

    if (authed === null) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#0a0a0f",
                    color: "#7a7a9a",
                    fontFamily: "system-ui",
                }}
            >
                Kontrol ediliyor…
            </div>
        );
    }

    if (!authed) {
        return <LoginForm onLogin={() => setAuthed(true)} />;
    }

    const closeOnNav = () => setSidebarOpen(false);

    return (
        <div className="adm-layout">
            {/* Mobile hamburger */}
            <button
                className={`adm-hamburger ${sidebarOpen ? "open" : ""}`}
                onClick={() => setSidebarOpen((v) => !v)}
                aria-label="Menüyü aç/kapat"
            >
                <span /><span /><span />
            </button>

            {/* Mobile overlay */}
            <div
                className={`adm-sidebar-overlay ${sidebarOpen ? "open" : ""}`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`adm-sidebar ${sidebarOpen ? "open" : ""}`}>
                <div className="adm-sidebar-logo">
                    <h2>
                        🛡️ Admin
                        <span className="adm-badge">Panel</span>
                    </h2>
                </div>

                <nav className="adm-nav">
                    {NAV.map((n) => (
                        <button
                            key={n.id}
                            className={`adm-nav-item ${tab === n.id ? "active" : ""}`}
                            onClick={() => { setTab(n.id); closeOnNav(); }}
                        >
                            <span className="adm-nav-icon">{n.icon}</span>
                            {n.label}
                        </button>
                    ))}
                </nav>

                <div className="adm-sidebar-footer">
                    <a href="/" className="adm-nav-item" onClick={closeOnNav}>
                        <span className="adm-nav-icon">🏠</span>
                        Siteye Dön
                    </a>
                    <button
                        className="adm-nav-item"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        style={{ color: "var(--adm-danger)" }}
                    >
                        <span className="adm-nav-icon">🚪</span>
                        {loggingOut ? "Çıkış yapılıyor…" : "Çıkış Yap"}
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="adm-main">
                <Suspense fallback={<div className="adm-loading">Yükleniyor…</div>}>
                    {tab === "analytics" && <AnalyticsPanel />}
                    {tab === "settings" && <SettingsPanel />}
                    {tab === "logs" && <LogsPanel />}
                    {tab === "faq" && <FaqPanel />}
                    {tab === "maintenance" && <MaintenancePanel />}
                </Suspense>
            </main>
        </div>
    );
};

export default Admin;
