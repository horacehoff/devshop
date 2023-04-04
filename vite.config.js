import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
    build: {
        target: 'esnext',
        minify: 'terser',
        terserOptions: {
            compress: {
                keep_infinity: true,
                pure_getters: true,
                passes: 100,
                drop_console: false,
                drop_debugger: false,
                unsafe: true,
                unsafe_arrows: true,
                unsafe_comps: true,
                unsafe_Function: true,
                unsafe_math: true,
                unsafe_methods: true,
                unsafe_proto: true,
                unsafe_regexp: true,
                unsafe_undefined: true,
                warnings: true,
            },
            mangle: {
                properties: {
                    regex: /^_/,

                },
            },
            output: {
                comments: false,
                beautify: false,
            },
        }
    }
})
