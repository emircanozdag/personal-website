import * as Sentry from "@sentry/react";

// Sentry stays off unless a DSN is configured, so local dev and previews send nothing
export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    integrations: [Sentry.browserTracingIntegration()],
    // Sample a fraction of page loads for performance traces (Web Vitals, slow requests)
    tracesSampleRate: 0.2,
    tracePropagationTargets: [/^\/api\//],
    sendDefaultPii: false,
  });
}

export const ErrorBoundary = Sentry.ErrorBoundary;
