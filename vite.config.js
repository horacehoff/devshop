import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'terser',
    sourcemap: false,
    terserOptions: {
      compress: {
        passes: 100,
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          "main": ['react'],
          'maindom': ['react-dom'],
          'mainrouterdom': ['react-router-dom'],
          'app': ['firebase/app'],
          'auth': ['firebase/auth'],
          'store': ['firebase/firestore'],
          'storage': ['firebase/storage'],
          'codehighlight': ['react-syntax-highlighter'],
          'shortnum': ['short-number'],
        },
        compact: true,
        minifyInternalExports: true,


      }
    }
  }
})
