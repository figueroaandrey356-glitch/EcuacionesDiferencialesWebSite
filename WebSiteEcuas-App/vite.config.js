import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Vercel sirve el sitio en la raíz; GitHub Pages en /<repo>/
  base: process.env.VERCEL ? '/' : '/EcuacionesDiferencialesWebSite/',
})
