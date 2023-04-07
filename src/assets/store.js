import { reactive } from 'vue'

export const APP_MODE = import.meta.env.MODE
export const BACKEND_LOCATION = import.meta.env.VITE_FLASK_BACKEND_LOCATION

export const SOURCE_ABBREVIATION_MAPPING = {
    CDC: "U.S. Center for Disease Control",
    CFSRE: "Center for Forensic Science Research & Education",
    DTSC: "California Department of Toxic Substances Control",
    EPA: "U.S. Environmental Protection Agency",
    "EPA-ECM": "U.S. Environmental Protection Agency Environmental Chemistry Methods",
    FDA: "U.S. Food & Drug Administration",
    MDPI: "Multidisciplinary Digital Publishing Institute",
    SWG: "Scientific Working Group for the Analysis of Seized Drugs",
    USDA: "U.S. Department of Agriculture",
    USEPA: "U.S. Environmental Protection Agency",
    USGS: "U.S. Geological Survey"
}

export const store = reactive({
    showHeaderAndFooter: false,
})