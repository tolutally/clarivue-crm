import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '@components': resolve(__dirname, './components'),
      '@actions': resolve(__dirname, './actions'),
      '@types': resolve(__dirname, './types'),
      '@lib': resolve(__dirname, './lib'),
      '@quibakery/data': resolve(__dirname, './lib/quibakery-data.ts'),
      '@uibakery/data': resolve(__dirname, './lib/quibakery-data.ts'),
    },
  },
  server: {
    port: 5175,
    open: false,
  },
});
