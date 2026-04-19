import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        watch: {
            usePolling: true,
        },
        host: true,
        port: 5173,
        proxy: {
            '/api': 'http://app:3000',
            // '/auth': 'http://app:3000',
            // '/users': 'http://app:3000',
            // '/folders': 'http://app:3000',
            // '/flashcards': 'http://app:3000',
            // '/quizzes': 'http://app:3000',
            // '/quizzes-progress': 'http://app:3000',
            // '/saved-quizzes': 'http://app:3000',
        }
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, './src'),
        }
    }
})
