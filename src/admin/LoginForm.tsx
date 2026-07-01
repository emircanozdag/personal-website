import { useState } from "react";
import { adminApi } from "./adminApi";

interface Props {
    onLogin: () => void;
}

const LoginForm = ({ onLogin }: Props) => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await adminApi.login(password);
            onLogin();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="adm-login-page">
            <div className="adm-login-card">
                <div className="adm-login-logo">
                    <span className="adm-login-icon">🛡️</span>
                    <h1>Admin Panel</h1>
                    <p>Chatbot yönetim merkezi</p>
                </div>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div className="adm-field">
                        <label>Şifre</label>
                        <input
                            className="adm-input"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoFocus
                        />
                    </div>
                    {error && <div className="adm-error-msg">{error}</div>}
                    <button className="adm-btn adm-btn-primary" type="submit" disabled={loading || !password}>
                        {loading ? "Giriş yapılıyor…" : "Giriş Yap"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
