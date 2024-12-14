import dotenv from 'dotenv';
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

dotenv.config();
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    define: {
        'process.env': process.env
    },
    server: {
        host: 'localhost', // Explicitly set host
        port: 5173,        // Same port as shown in your logs
        strictPort: true,  // Ensures Vite doesn’t switch ports
    },
})
