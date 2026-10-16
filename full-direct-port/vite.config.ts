import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    // 8081 so this build can run next to the polished version on 8080.
    port: 8081,
    strictPort: true,
    host: true,
    allowedHosts: true,
  },
  preview: {
    port: 8081,
    strictPort: true,
    host: true,
    allowedHosts: true,
  },
})
