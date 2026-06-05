import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = dirname(fileURLToPath(import.meta.url))

function copyPortfolioAssets() {
  return {
    name: 'copy-portfolio-assets',
    buildStart() {
      const assets = [
        ['../assets/new/skoda2.jpg', 'public/assets/portfolio/shkoda/skoda2.jpg'],
      ]
      for (const [src, dest] of assets) {
        const from = resolve(rootDir, src)
        const to = resolve(rootDir, dest)
        mkdirSync(dirname(to), { recursive: true })
        copyFileSync(from, to)
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), copyPortfolioAssets()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})
