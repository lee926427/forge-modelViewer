import { defineConfig, loadEnv } from 'vite'
import {URL, fileURLToPath} from "url"
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    resolve:{
      alias:{
        "@": fileURLToPath(new URL("./src", import.meta.url))
      }
    },
    plugins: [react()]
  });

