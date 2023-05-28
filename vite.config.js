// import {defineConfig} from 'vite';
// import react from '@vitejs/plugin-react-swc';
// import terser from "@rollup/plugin-terser";
//
// export default defineConfig({
//   plugins: [
//     react(),
//     terser({
//       compress: {
//         passes: 1000,
//         drop_console: true,
//         toplevel: true
//       },
//       format: {
//         comments: false,
//       },
//     }),
//   ],
//   build: {
//     minify: 'terser',
//     sourcemap: false,
//     rollupOptions: {
//       output: {
//         manualChunks: {
//           main: ['react'],
//           maindom: ['react-dom'],
//           mainrouterdom: ['react-router-dom'],
//           app: ['firebase/app'],
//           auth: ['firebase/auth'],
//           store: ['firebase/firestore'],
//           storage: ['firebase/storage'],
//           shortnum: ['short-number'],
//           popup: ['reactjs-popup'],
//           icons: ['react-icons'],
//           markdown: ['@uiw/react-md-editor'],
//         },
//         compact: true,
//         minifyInternalExports: true,
//       },
//       plugins: [terser()],
//     },
//   },
// });

import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react-swc';
import terser from "@rollup/plugin-terser"

export default defineConfig({
  plugins: [
    react(),
    terser({
      format: {
        comments: false,
      },
      compress: {
        passes: 10, // Adjust the number of compression passes as needed
        drop_console: true,
        toplevel: true,
      },
    }),
  ],
  build: {
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Split each dependency into separate chunks
            const packageName = id.match(/\/node_modules\/([^/]+)/)[1];
            return packageName.replace('@', '');
          }
        },
        compact: true,
        minifyInternalExports: true,
        entryFileNames: 'assets/[name]-[hash].js', // Customize output file names
        chunkFileNames: 'assets/[name]-[hash].js', // Customize chunk file names
      },
      plugins: [
        terser({
          format: {
            comments: false,
          },
          compress: {
            passes: 10, // Adjust the number of compression passes as needed
            drop_console: true,
            toplevel: true,
          },
        }),
      ],
    },
  },
});
