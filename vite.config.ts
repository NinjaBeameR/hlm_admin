import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        // Add timestamp to chunk names to prevent caching issues
        chunkFileNames: `assets/[name].[hash].${Date.now()}.js`,
        entryFileNames: `assets/[name].[hash].${Date.now()}.js`,
        assetFileNames: `assets/[name].[hash].${Date.now()}.[ext]`
      }
    }
  },
  define: {
    // Add build timestamp for debugging
    __BUILD_TIMESTAMP__: JSON.stringify(new Date().toISOString())
  }
});
