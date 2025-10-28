import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";
import { env } from 'process';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  }
});
