import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react-swc';
import terser from "@rollup/plugin-terser";

export default defineConfig({
  plugins: [
    react(),
    terser({
      compress: {
        passes: 10000,
        drop_console: true,
        toplevel: true
      },
      format: {
        comments: false,
      },
    }),
  ],
  build: {
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
          markdown: ['@uiw/react-md-editor/esm', '@uiw/react-md-editor/lib', '@uiw/react-md-editor/dist'],

        },
        compact: true,
        minifyInternalExports: true,
      },
      plugins: [terser()],
    },

  }
});