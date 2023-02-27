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
              // compress more
                booleans_as_integers: true,
                collapse_vars: true,
                comparisons: true,
                computed_props: true,
                hoist_funs: true,
                hoist_props: true,
                hoist_vars: true,
                if_return: true,
                inline: true,
                join_vars: true,
                keep_fargs: false,
                keep_fnames: false,
                loops: true,
                negate_iife: false,
                properties: true,
                reduce_funcs: true,
                reduce_vars: true
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
