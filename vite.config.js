import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // if (id.includes('react')) return 'vendor-react';
            if (id.includes('axios')) return 'vendor-axios';
            if (id.includes('chart.js')) return 'vendor-charts';
            return 'vendor'; // fallback
          }
        },
      },
    },
  },
  server: {
    allowedHosts: ['*','whole-generally-chamois.ngrok-free.app'] // ✅ Corrected
  }
})
