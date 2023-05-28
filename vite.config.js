import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react-swc';
import terser from "@rollup/plugin-terser";

export default defineConfig({
  plugins: [
    react(),
    terser({
      compress: {
        passes: 1000,
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
          markdown(id) {
            if (id.includes('@uiw/react-md-editor')) {
              const fileName = id.match(/\/([^/]+)$/)[1];
              return `markdown_${fileName}`;
            }
          },
        },
        compact: true,
        minifyInternalExports: true,
      },
      plugins: [terser()],
    },

  }
});