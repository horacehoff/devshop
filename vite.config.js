import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react-swc';
import viteCompression from 'vite-plugin-compression';

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
      'react-icons',
      '@uiw/react-md-editor',
      'reactjs-popup'
    ],
  },
  plugins: [
    react(),
    viteCompression({
      verbose: true,
      algorithm: "brotliCompress",
      deleteOriginFile: true,
      compressionOptions: {
        level: 11,
        lgwin: 50
      }
    })
  ],
  build: {
    cssMinify: 'lightningcss',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        keep_infinity: true,
        passes: 1000
      }
    },
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
          icons: ['react-icons'],
          markdown: ['@uiw/react-md-editor'],
          popups: ['reactjs-popup']
        },
        compact: true,
        minifyInternalExports: true,
        sourcemap: false,
      },
    },
  },
});
