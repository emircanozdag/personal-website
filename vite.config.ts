import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resolve, dirname } from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Dev-only adapter that mirrors Vercel's serverless function runtime for files
 * inside the local `api/` folder. Lets `vite dev` actually invoke `/api/*.js`
 * handlers (same code that Vercel ships to production), so `npm run dev`
 * remains a single command.
 *
 * Adds the Vercel-style sugar that the handlers rely on:
 *   - `req.body`             parsed JSON of the request body
 *   - `req.query`            parsed query-string
 *   - `res.status(code)`     chainable status setter
 *   - `res.json(data)`       send JSON response
 *   - `res.send(data)`       send text/JSON response
 */
const vercelApiDev = (envVars: Record<string, string>): Plugin => ({
  name: "vercel-api-dev",
  apply: "serve",
  configureServer(server) {
    Object.assign(process.env, envVars);

    server.middlewares.use(async (req, res, next) => {
      const url = req.url ?? "";
      if (!url.startsWith("/api/")) return next();

      const [pathname, search = ""] = url.split("?");
      const route = pathname.replace(/^\/api\//, "").replace(/\/$/, "");
      if (!route) return next();

      const handlerPath = resolve(__dirname, "api", `${route}.js`);
      if (!existsSync(handlerPath)) return next();

      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      const raw = Buffer.concat(chunks).toString("utf8");
      const reqAny = req as IncomingMessage & {
        body?: unknown;
        query?: Record<string, string>;
      };
      try {
        reqAny.body = raw ? JSON.parse(raw) : {};
      } catch {
        reqAny.body = raw;
      }
      reqAny.query = Object.fromEntries(new URLSearchParams(search));

      const resAny = res as ServerResponse & {
        status: (code: number) => typeof resAny;
        json: (data: unknown) => typeof resAny;
        send: (data: unknown) => typeof resAny;
      };
      resAny.status = (code: number) => {
        res.statusCode = code;
        return resAny;
      };
      resAny.json = (data: unknown) => {
        if (!res.getHeader("Content-Type")) {
          res.setHeader("Content-Type", "application/json");
        }
        res.end(JSON.stringify(data));
        return resAny;
      };
      resAny.send = (data: unknown) => {
        if (data && typeof data === "object") return resAny.json(data);
        res.end(typeof data === "string" ? data : String(data ?? ""));
        return resAny;
      };

      try {
        const mod = await import(
          /* @vite-ignore */ `${pathToFileURL(handlerPath).href}?t=${Date.now()}`
        );
        const handler = mod.default ?? mod.handler;
        if (typeof handler !== "function") {
          throw new Error(`No default export found in api/${route}.js`);
        }
        await handler(reqAny, resAny);
      } catch (err) {
        const error = err as Error;
        console.error(`[vercel-api-dev] ${route} error:`, error);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              error: "Internal Server Error",
              details: error.message,
            })
          );
        }
      }
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), vercelApiDev(env)],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            three: ["three", "three-stdlib"],
            "react-three": ["@react-three/fiber", "@react-three/drei"],
            gsap: ["gsap"],
            vendor: ["react", "react-dom", "react-router-dom"],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
    optimizeDeps: {
      include: ["three", "gsap", "lenis"],
    },
  };
});
