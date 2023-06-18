import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react-swc';
import terser from "@rollup/plugin-terser";

export default defineConfig({
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
      'firebase/storage',
      'short-number',
      'reactjs-popup',
      'react-icons',
      '@uiw/react-md-editor'
    ],
  },
  plugins: [
    react(),
    terser({
      compress: {
        passes: 1000,
        drop_console: true,
      },
      format: {
        comments: false,
        source_map: false,
      },
    }),
  ],
  build: {
    cssMinify: 'terser',
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          main: ['react'],
          maindom: ['react-dom'],
          mainrouterdom: ['react-router-dom'],
          app: ['firebase/app'],
          auth: ['firebase/auth'],
          store: ['firebase/firestore'],
          storage: ['firebase/storage'],
          shortnum: ['short-number'],
          popup: ['reactjs-popup'],
          icons: ['react-icons'],
          markdown: ['@uiw/react-md-editor'],
        },
        compact: true,
        minifyInternalExports: true,
        sourcemap: false,
      },
      plugins: [terser()],
    },
  },
});
