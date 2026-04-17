import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { existsSync, renameSync } from "node:fs";
import { resolve } from "node:path";

export default defineConfig({
  base: "./",
  plugins: [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    react(),
    {
      name: "capacitor-index-rename",
      closeBundle() {
        const from = resolve("dist/capacitor/capacitor-index.html");
        const to = resolve("dist/capacitor/index.html");

        if (existsSync(from)) {
          renameSync(from, to);
        }
      },
    },
  ],
  build: {
    outDir: "dist/capacitor",
    emptyOutDir: true,
    rollupOptions: {
      input: "capacitor-index.html",
    },
  },
  resolve: {
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  server: {
    host: "::",
    port: 8080,
  },
});