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
      input: {
        client: path.resolve(import.meta.dirname, "client", "index.html"), // Ensure this path matches your project structure
        server: path.resolve(import.meta.dirname, "server", "index.ts") // Ensure this path matches your project structure
      },
      external: [] // Ensure no conflicting external entries
    }
  },
  ssr: {
    target: 'node',
    noExternal: [
      '@shared',
      '@assets',
      /^server\//,
      /^\..*\/server\//,
      'react', // Add React to ensure it's bundled
      'react-dom' // Add ReactDOM to ensure it's bundled
    ]
  }
});
