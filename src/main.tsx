import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import { initSentry, ErrorBoundary } from "./monitoring/sentry";
import { reloadForNewBuild } from "./utils/chunkReload";

initSentry();

window.addEventListener("vite:preloadError", (event) => {
  event.preventDefault();
  reloadForNewBuild();
});
window.addEventListener("unhandledrejection", (event) => {
  const message = String(event.reason?.message ?? event.reason ?? "");
  if (/dynamically imported module|Importing a module script failed|error loading dynamically/i.test(message)) {
    reloadForNewBuild();
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <ErrorBoundary fallback={<p style={{ padding: 24 }}>Something went wrong. Please refresh.</p>}>
        <App />
      </ErrorBoundary>
    </HelmetProvider>
  </StrictMode>
);
