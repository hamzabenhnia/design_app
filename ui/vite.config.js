import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      // Enable Fast Refresh
      fastRefresh: true,
    })
  ],
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable for production
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 5173,
    host: true,
    open: true,
    hmr: {
      overlay: true, 
    },
    watch: {
      usePolling: true,
    },
  },
  // Optimize dependencies for faster HMR
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'redux', 'react-redux'],
  },
})