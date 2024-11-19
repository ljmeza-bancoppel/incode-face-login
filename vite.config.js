import { defineConfig, loadEnv } from 'vite'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig(({ mode }) => {
  // Load the current env file (production in build case) located in the environment directory
  const env = loadEnv(mode, 'environment');

  return {
    server: {
      https: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
          ws: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        }
      },
    },
    plugins: [mkcert()],
    base: '/incode-face-login/',
    envDir: 'environment',
  }
})