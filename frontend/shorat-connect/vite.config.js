import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "localhost",
    port: 5173,
    open: false,
   fs: {
    strict: true,
  },
  },
  preview: {
    port: 5173,
  },
  base: "/",
  optimizeDeps: {
    include: [],
  },
  build: {
    outDir: "dist",
  },
});
