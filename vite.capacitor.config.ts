import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: "./",
  plugins: [tailwindcss(), tsConfigPaths({ projects: ["./tsconfig.json"] }), react()],
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