import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.js'],
    env: {
      VITE_SUPABASE_URL: 'http://mock-url',
      VITE_SUPABASE_ANON_KEY: 'mock-key'
    }
  },
});
