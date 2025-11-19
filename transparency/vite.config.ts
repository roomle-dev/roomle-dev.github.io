import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  // @ts-ignore -- vue pls
  plugins: [vue()],
  base: "/transparency/",
  optimizeDeps: {
    exclude: ['@roomle/web-sdk']
  }
})
