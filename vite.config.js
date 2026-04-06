import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Change this to your GitHub repo name, e.g. '/nano-tumor-db'
const REPO_NAME = '/ai2tox-webtool'

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? REPO_NAME : '/',
})
