import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
  },
  plugins: [react()],
  server: { port: 5173 },
  base: process.env.NODE_ENV === 'production' ? '/multimedia-multiverse/' : '/'
})
