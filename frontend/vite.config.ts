import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({mode}) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        plugins: [react()],
        server: {
            watch: {
                usePolling: true,
            },
            host: '0.0.0.0',
            port: 5173,
            proxy: {
                '/': {
                    target: env.VITE_API_TARGET || 'http://app:3000',
                    changeOrigin: true
                }
            }
        },
    }
})
