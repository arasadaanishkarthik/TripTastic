import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    // Raise the warning threshold — 600 kB is reasonable for a full-featured SPA
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Split large vendor libraries into separate chunks for better caching
        manualChunks: {
          // React core
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Animation libraries
          'vendor-animation': ['framer-motion', 'gsap', 'lenis', '@studio-freight/lenis'],
          // Map libraries (large — isolate them)
          'vendor-map': ['leaflet', 'react-leaflet'],
          // UI utilities
          'vendor-ui': ['lucide-react', 'clsx', 'tailwind-merge'],
        },
      },
    },
  },
});