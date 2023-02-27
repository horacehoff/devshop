import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  // add terser to build.target
    build: {
        target: 'esnext',
        minify: 'terser',
        terserOptions: {
            compress: {
                keep_infinity: true,
                pure_getters: true,
                passes: 100,
            },
            mangle: {
                properties: {
                    regex: /^_/,
                }
            }
        }
    }
})
