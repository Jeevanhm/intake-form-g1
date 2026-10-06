import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
const appBasePath = (process.env.APP_BASE_PATH ?? "").replace(/\/+$/, "");
const appBaseUrl = appBasePath ? `${appBasePath}/` : "/";

export default defineConfig(() => ({
  base: appBaseUrl,
  server: {
    host: "127.0.0.1",
    port: 8080,
    proxy: {
      [`${appBasePath}/api`]: {
        target: "http://127.0.0.1:3001",
        rewrite: (requestPath) =>
          appBasePath && requestPath.startsWith(`${appBasePath}/`)
            ? requestPath.slice(appBasePath.length)
            : requestPath,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
