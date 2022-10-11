import { reactive } from 'vue'

export const APP_MODE = import.meta.env.MODE
export const BACKEND_LOCATION = import.meta.env.VITE_FLASK_BACKEND_LOCATION

export const store = reactive({
    showHeaderAndFooter: false,
})