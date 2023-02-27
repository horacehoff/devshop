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
                drop_console: true,
                drop_debugger: true,
                unsafe: true,
                unsafe_arrows: true,
                unsafe_comps: true,
                unsafe_Function: true,
                unsafe_math: true,
                unsafe_methods: true,
                unsafe_proto: true,
                unsafe_regexp: true,
                unsafe_undefined: true,
                warnings: false,
            },
            mangle: {
                properties: {
                    regex: /^_/,
                }
            },
            output: {
                comments: false,
                beautify: false,
                indent_level: 2,
                quote_style: 1,
                wrap_iife: true,
            },
        }
    }
})
