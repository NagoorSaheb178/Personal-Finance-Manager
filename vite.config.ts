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
      input: {
        client: path.resolve(__dirname, "client", "index.html"), // Use __dirname for relative path
        server: path.resolve(__dirname, "server", "index.ts") // Use __dirname for relative path
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
