import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: './',
  publicDir: 'public',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-tabs', '@radix-ui/react-select'],
          'vendor-utils': ['date-fns', 'framer-motion'],
          // Split feature chunks
          'feature-auth': ['./src/pages/auth-page.tsx', './src/hooks/use-auth.tsx'],
          'feature-home': ['./src/pages/Home.tsx', './src/components/HomePage'],
          'feature-admin': ['./src/pages/AdminElectionDashboard.tsx', './src/pages/AdminDashboard.tsx'],
        },
      },
    },
  },
  server: {
    port: 3050,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
}); 