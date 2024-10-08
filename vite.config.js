import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react-swc';
import viteCompression from 'vite-plugin-compression';
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
      'react-icons',
      '@uiw/react-md-editor',
      'reactjs-popup',
      'react-helmet'
    ],
  },
  plugins: [
    react(),
    viteCompression({
      verbose: true,
      algorithm: "brotliCompress",
      compressionOptions: {
        level: 11,
        lgwin: 36
      }
    }),
    terser({
      compress: {
        passes: 1000,
        drop_console: true,
        drop_debugger: true
      },
      format: {
        comments: false,
        source_map: false,
      },
    })
  ],
  css: {
    transformer: "lightningcss"
  },
  build: {
    cssMinify: 'lightningcss',
    minify: 'terser',
    cssCodeSplit: true,
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true
      },
      format: {
        comments: false,
        source_map: false,
      },
    },
      modulePreload: {
          resolveDependencies(url, deps, context) {
            return deps.filter(item => !item.includes("markdown"));
          },
      },
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          main: ['react', 'react-dom', 'react-router-dom', 'react-helmet'],
          db: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
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
    plugins: [terser()],
  },
});