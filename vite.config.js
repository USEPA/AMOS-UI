import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/amos/',
    plugins: [vue()],
    resolve: {
        alias: [
            {find: "@", replacement: "/src/"}
        ]
    },
    // disables an error message that appears randomly and for no known reason
    server: {
        hmr: {
            overlay: false
        }
    }
})
