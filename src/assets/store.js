import { reactive } from 'vue'

export const APP_MODE = import.meta.env.MODE
export const BACKEND_LOCATION = import.meta.env.VITE_FLASK_BACKEND_LOCATION
export const COMPTOX_PAGE_URL = import.meta.env.VITE_COMPTOX_PAGE_URL
export const IMAGE_BY_DTXSID_API = import.meta.env.VITE_IMAGE_BY_DTXSID_API

export const ANALYTE_MAPPING = {
    SVOCs: "Semi-volatile organic compounds",
    VOCs: "Volatile organic compounds",
    PCBs: "Polychlorinated biphenyls",
    PAHs: "Polycyclic aromatic hydrocarbons",
    PFAS: "Per- and polyfluoroalkyl substances"
}

/*export const SOURCE_ABBREVIATION_MAPPING = {
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
    USGS: "U.S. Geological Survey",
}*/

export const SOURCE_ABBREVIATION_MAPPING = {
    'AJAC': {'link': 'https://www.scirp.org/journal/ajac/', 'full_name': 'American Journal of Analytical Chemistry'},
    'ASTM': {'link': 'https://www.astm.org/', 'full_name': 'American Society for Testing and Materials'},
    'Agilent': {'link': 'https://www.agilent.com/'},
    'CDC': {'link': 'https://www.cdc.gov/', 'full_name': 'U.S. Centers for Disease Control and Prevention'},
    'DTSC': {'link': 'https://dtsc.ca.gov/', 'full_name': 'California Department of Toxic Substance Control'},
    'EPA': {'link': 'https://www.epa.gov/', 'full_name': 'U.S. Environmental Protection Agency'},
    'EPA-ECM': {'link': 'https://www.epa.gov/pesticide-analytical-methods/environmental-chemistry-methods-ecm', 'full_name': 'U.S. Environmental Protection Agency Environmental Chemistry Methods'},
    'EPA-OW': {'link': 'https://www.epa.gov/aboutepa/about-office-water', 'full_name': "U.S. Environmental Protection Agency Office of Water"},
    'Eurofins': {'link': 'https://www.eurofins.com/'},
    'FDA': {'link': 'https://www.fda.gov/', 'full_name': 'U.S. Food and Drug Administration'},
    'HHS': {'link': 'https://www.hhs.gov/', 'full_name': 'U.S. Department of Health and Human Services'},
    'Hindawi': {'link': 'https://www.hindawi.com/'},
    'ISO': {'link': 'https://www.iso.org/home.html', 'full_name': 'International Organization for Standardization'},
    'MDPI': {'link': 'https://www.mdpi.com/', 'full_name': 'Multidisciplinary Digital Publishing Institute'},
    'NEMI': {'link': 'https://www.nemi.gov/home/', 'full_name': 'National Environmental Methods Index'},
    'NIST': {'link': 'https://www.nist.gov/', 'full_name': 'National Institute of Standards and Technology'},
    'SCIEX': {'link': 'https://sciex.com/'},
    'SGS': {'link': 'https://www.sgs.com/en'},
    'Springer Nature': {'link': 'https://www.springernature.com/gp'},
    'Thermo Fisher': {'link': 'https://www.thermofisher.com/us/en/home.html'},
    'USDA': {'link': 'https://www.usda.gov/', 'full_name': 'U.S. Department of Agriculture'},
    'USEPA': {'link': 'https://www.epa.gov/', 'full_name': 'U.S. Environmental Protection Agency'},
    'USGS': {'link': 'https://www.usgs.gov/', 'full_name': 'U.S. Geological Survey'}
}

export const METHODOLOGY_MAPPING = {
    'GC': {'full_name': 'Gas chromatography', 'link': 'https://en.wikipedia.org/wiki/Gas_chromatography'},
    'GC/AFD': {'full_name': 'Gas chromatography with an alkali flame ionization detector', 'link': 'https://en.wikipedia.org/wiki/Flame_ionization_detector'},
    'GC/ECD': {'full_name': 'Gas chromatography with an electron capture detector', 'link': 'https://en.wikipedia.org/wiki/Electron_capture_detector'},
    'GC/ELCD': {'full_name': 'Gas chromatography with an electrolytic conductivity detector', 'link': 'https://en.wikipedia.org/wiki/Conductivity_(electrolytic)'},
    'GC/FID': {'full_name': 'Gas chromatography with a flame ionization detector', 'link': 'https://en.wikipedia.org/wiki/Flame_ionization_detector'},
    'GC/FPD': {'full_name': 'Gas chromatography with a flame photometric detector', 'link': 'https://en.wikipedia.org/wiki/Flame_detector'},
    'GC/HSD': {'full_name': 'Gas chromatography with a halogen selective detector', 'link': 'https://en.wikipedia.org/wiki/Electron_capture_detector'},
    'GC/MS': {'full_name': ' Gas chromatography with mass spectrometry', 'link': 'https://en.wikipedia.org/wiki/Gas_chromatography%E2%80%93mass_spectrometry'},
    'GC/NPD': {'full_name': 'Gas chromatography with a nitrogen-phosphorus detector', 'link': 'https://en.wikipedia.org/wiki/Nitrogen%E2%80%93phosphorus_detector'},
    'GFAA': {'full_name': 'Graphite furnace atomic absorption', 'link': 'https://en.wikipedia.org/wiki/Graphite_furnace_atomic_absorption'},
    'HPLC': {'full_name': 'High performance liquid chromatography', 'link': 'https://en.wikipedia.org/wiki/High-performance_liquid_chromatography'},
    'HPLC/ELCD': {'full_name': 'High performance liquid chromatography with an electrolytic conductivity detector', 'link': 'https://en.wikipedia.org/wiki/Conductivity_(electrolytic)'},
    'HPLC/FLD': {'full_name': 'High performance liquid chromatography with a fluorescence detector', 'link': 'https://en.wikipedia.org/wiki/Fluorescence_spectroscopy'},
    'HPLC/MS': {'full_name': 'High performance liquid chromatography with mass spectrometry', 'link': 'https://en.wikipedia.org/wiki/High-performance_liquid_chromatography'},
    'HPLC/PCD': {'full_name': 'High performance liquid chromatography with post column derivatization', 'link': 'https://www.pickeringlabs.com/library/primers/about-post-column-hplc/'},
    'HPLC/UV': {'full_name': 'High performance liquid chromatography with an ultraviolet detector', 'link': 'https://en.wikipedia.org/wiki/UV_detectors'},
    'IC/CD': {'full_name': 'Ion chromatography with a conductivity detector', 'link': 'https://en.wikipedia.org/wiki/Ion_chromatography'},
    'Immunoassay': {'link': 'https://en.wikipedia.org/wiki/Immunoassay'},
    'LC': {'full_name': 'Liquid chromatography', 'link': 'https://en.wikipedia.org/wiki/High-performance_liquid_chromatography'},
    'LC-ACPI': {'full_name': 'Liquid chromatography with atmospheric-pressure chemical ionization', 'link': 'https://en.wikipedia.org/wiki/Atmospheric-pressure_chemical_ionization'},
    'LC-ESI': {'full_name': 'Liquid chromatography with electrospray ionization', 'link': 'https://en.wikipedia.org/wiki/Electrospray_ionization'},
    'LC/DAD': {'full_name': 'Liquid chromatography with a diode array detector', 'link': 'https://www.labcompare.com/Chemical-Analysis-Equipment/510-HPLC-Photo-Diode-Array-Detector-HPLC-PDA-Detector/'},
    'LC/ELCD': {'full_name': 'Liquid chromatography with an electrolytic conductivity detector', 'link': 'https://en.wikipedia.org/wiki/Conductivity_(electrolytic)'},
    'LC/MS': {'full_name': 'Liquid chromatography with mass spectrometry', 'link': 'https://en.wikipedia.org/wiki/Liquid_chromatography%E2%80%93mass_spectrometry'},
    'LC/PDA': {'full_name': 'Liquid chromatography with a photodiode array detector', 'link': 'https://www.labcompare.com/Chemical-Analysis-Equipment/510-HPLC-Photo-Diode-Array-Detector-HPLC-PDA-Detector/'},
    'LC/UV': {'full_name': 'Liquid chromatography with an ultraviolet detector', 'link': 'https://en.wikipedia.org/wiki/UV_detectors'},
    'MS': {'full_name': 'Mass spectrometry', 'link': 'https://en.wikipedia.org/wiki/Mass_spectrometry'},
    'Purge-and-trap': {'link': 'https://www.teledynetekmar.com/prods/Pages/Purge-and-Trap-Overview.aspx'},
    'Spectrophotometry': {'link': 'https://en.wikipedia.org/wiki/Spectrophotometry'}
}

export const store = reactive({
    showHeaderAndFooter: false,
})