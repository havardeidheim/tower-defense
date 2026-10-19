import { defineConfig } from 'vitest/config'

export default defineConfig({
  base: './',
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    // 8082 so it can run next to the manual port (8080) and the direct port (8081).
    port: 8082,
    strictPort: true,
    host: true,
    allowedHosts: true,
  },
  preview: {
    port: 8082,
    strictPort: true,
    host: true,
    allowedHosts: true,
  },
  test: {
    root: '.',
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
})
