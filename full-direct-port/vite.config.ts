import { defineConfig } from 'vite'

// Tailscale MagicDNS names for this machine, so http://knurr:8081 works from the tailnet.
const allowedHosts = ['knurr', '.tail9900fa.ts.net']

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
    allowedHosts,
  },
  preview: {
    port: 8081,
    strictPort: true,
    host: true,
    allowedHosts,
  },
})
