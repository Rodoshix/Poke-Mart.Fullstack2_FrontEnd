import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";
import { env } from 'process';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test:{
    globals: true,
    environment: "happy-dom",
    setupFiles: "./src/setupTests.js"
  },
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  server: {
    host: true,
    allowedHosts: ["localhost", "127.0.0.1", ".ngrok-free.dev"]
  }
});
