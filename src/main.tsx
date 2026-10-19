import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import { initSentry, ErrorBoundary } from "./monitoring/sentry";

initSentry();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <ErrorBoundary fallback={<p style={{ padding: 24 }}>Something went wrong. Please refresh.</p>}>
        <App />
      </ErrorBoundary>
    </HelmetProvider>
  </StrictMode>
);
