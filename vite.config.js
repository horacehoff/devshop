import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import { dependencies } from "./package.json";


const globalVendorPackages = ["react", "react-dom", "react-router-dom", "firebase"];
function renderChunks(deps) {
  let chunks = {};
  Object.keys(deps).forEach((key) => {
    if (globalVendorPackages.includes(key)) return;
    chunks[key] = [key];
  });
  return chunks;
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,
    rollupOptions: {
        output: {
            manualChunks: {
              vendor: globalVendorPackages,
                ...renderChunks(dependencies),
            }
        }
    }
  }
})
