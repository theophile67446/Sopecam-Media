import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [inspectAttr(), react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Vendor stable et cacheable, séparé du code applicatif
        // (forme fonction : capte aussi react-dom/client et scheduler)
        manualChunks(id: string) {
          if (/node_modules[\\/](react|react-dom|scheduler|react-router)[\\/]/.test(id)) {
            return 'react'
          }
        },
      },
    },
  },
});
