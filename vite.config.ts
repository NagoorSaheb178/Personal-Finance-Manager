import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(import.meta.dirname, "client", "index.html"),
      external: [], // Keep empty for client-side build
      preserveEntrySignatures: 'strict' // Add this for better SSR compatibility
    }
  },
  ssr: {
    target: 'node',
    noExternal: [
      '@shared',
      '@assets',
      /^server\//,
      /^\..*\/server\//,
      'server/index.ts',
      'react', // Add React to ensure it's bundled
      'react-dom' // Add ReactDOM to ensure it's bundled
    ]
  }
});
