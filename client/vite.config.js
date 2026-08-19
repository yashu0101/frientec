import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');

export default defineConfig({
  plugins: [react()],
  resolve: {
    // one pricing module, imported by both the studio and the API
    alias: { '@shared': path.join(root, 'shared') },
  },
  server: {
    port: 5173,
    // the API, the sample art and the self-contained premium sites all live
    // behind the Express server in dev
    proxy: {
      '/api': 'http://localhost:4000',
      '/img': 'http://localhost:4000',
      '/sites': 'http://localhost:4000',
    },
    fs: { allow: [root] },
  },
  build: { outDir: 'dist', emptyOutDir: true },
});
