import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// Make config async to support top-level await
export default defineConfig(async () => {
  const isDev = process.env.NODE_ENV !== "production";
  const isReplit = process.env.REPL_ID !== undefined;

  // Conditionally load Replit Cartographer plugin
  const cartographerPlugin = isDev && isReplit
    ? [(await import("@replit/vite-plugin-cartographer")).cartographer()]
    : [];

  return {
    plugins: [
      react(),
      runtimeErrorOverlay(),
      themePlugin(),
      ...cartographerPlugin,
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },
    root: path.resolve(__dirname, "client"),
    build: {
      outDir: path.resolve(__dirname, "dist/public"),
      emptyOutDir: true,
      rollupOptions: {
        // Only build the client — remove server/index.ts to avoid "Could not resolve" error
        input: path.resolve(__dirname, "client", "index.html"),
        external: [],
      },
    },
    ssr: {
      target: "node",
      noExternal: [
        "@shared",
        "@assets",
        "react",
        "react-dom",
        /^server\//,
        /^\..*\/server\//,
      ],
    },
  };
});
