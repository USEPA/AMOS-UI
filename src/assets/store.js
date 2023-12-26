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

export const SOURCE_ABBREVIATION_MAPPING = {
    'Agilent': {'link': 'https://www.agilent.com/'},
    'AJAC': {'link': 'https://www.scirp.org/journal/ajac/', 'full_name': 'American Journal of Analytical Chemistry'},
    'ASTM': {'link': 'https://www.astm.org/', 'full_name': 'American Society for Testing and Materials'},
    'ATSDR': {'link': 'https://www.atsdr.cdc.gov', 'full_name': 'Agency for Toxic Substances and Disease Registry'},
    'CDC': {'link': 'https://www.cdc.gov/', 'full_name': 'U.S. Centers for Disease Control and Prevention'},
    'CFSRE': {'link': 'https://www.cfsre.org/', 'full_name': 'Center for Forensic Science Research & Education'},
    'CSB': {'link':'https://www.csb.gov/', 'full_name': 'U.S. Chemical Safety & Hazard Investigation Board'},
    'DEA': {'link': 'https://www.dea.gov/', 'full_name': 'U.S. Drug Enforcement Agency'},
    'DTSC': {'link': 'https://dtsc.ca.gov/', 'full_name': 'California Department of Toxic Substance Control'},
    'ECHA': {'link': 'https://echa.europa.eu/', 'full_name': 'European Chemicals Agency'},
    'EPA': {'link': 'https://www.epa.gov/', 'full_name': 'U.S. Environmental Protection Agency'},
    'EPA-ECM': {'link': 'https://www.epa.gov/pesticide-analytical-methods/environmental-chemistry-methods-ecm', 'full_name': 'U.S. Environmental Protection Agency Environmental Chemistry Methods'},
    'EPA-OW': {'link': 'https://www.epa.gov/aboutepa/about-office-water', 'full_name': "U.S. Environmental Protection Agency Office of Water"},
    'ERDC': {'link': 'https://erdc-library.erdc.dren.mil/jspui/', 'full_name': 'U.S. Army Engineer Research & Development Center'},
    'EURL': {'link': 'https://www.eurl-pesticides.eu/', 'full_name': 'European Union Reference Laboratories'},
    'Eurofins': {'link': 'https://www.eurofins.com/'},
    'FDA': {'link': 'https://www.fda.gov/', 'full_name': 'U.S. Food and Drug Administration'},
    'HHS': {'link': 'https://www.hhs.gov/', 'full_name': 'U.S. Department of Health and Human Services'},
    'Hindawi': {'link': 'https://www.hindawi.com/'},
    'ISO': {'link': 'https://www.iso.org/home.html', 'full_name': 'International Organization for Standardization'},
    'LECO': {'link': 'https://www.leco.com'},
    'MDPI': {'link': 'https://www.mdpi.com/', 'full_name': 'Multidisciplinary Digital Publishing Institute'},
    'NEMI': {'link': 'https://www.nemi.gov/home/', 'full_name': 'National Environmental Methods Index'},
    'NIOSH': {'link': 'https://www.cdc.gov.niosh/index.htm', 'full_name': 'National Institute for Occupational Safety and Health'},
    'NIST': {'link': 'https://www.nist.gov/', 'full_name': 'National Institute of Standards and Technology'},
    'NJDOH': {'link': 'http://www.nj.gov/health', 'full_name': 'New Jersey Department of Health'},
    'NMS Labs': {'link': 'https://www.nmslabs.com/', 'full_name': 'National Mediacal Services Labs'},
    'NPIC': {'link': 'https://www.npic.orst.edu', 'full_name': 'National Pesticide Information Center'},
    'NRT': {'link': 'https://www.nrt.org/', 'full_name': 'U.S. National Response Team'},
    'OSHA': {'link': 'https://www.osha.gov', 'full_name': 'Occupational Safety & Health Administration'},
    'SCIEX': {'link': 'https://sciex.com/'},
    'SERDP': {'link': 'https://serdp-estcp.org/', 'full_name': 'Strategic Environmental Research and Development Program'},
    'SGS': {'link': 'https://www.sgs.com/en'},
    'Springer Nature': {'link': 'https://www.springernature.com/gp'},
    'SWG': {'link': 'https://www.swgdrug.org', 'full_name': 'Scientific Working Group for the Analysis of Seized Drugs'},
    'TDB': {'link': 'https://tdb.epa.gov/', 'full_name': 'Drinking Water Treatability Database'},
    'Thermo Fisher': {'link': 'https://www.thermofisher.com/us/en/home.html'},
    'UNEP': {'link': 'https://www.unep.org', 'full_name': 'U.N. Environment Programme'},
    'USDA': {'link': 'https://www.usda.gov/', 'full_name': 'U.S. Department of Agriculture'},
    'USEPA': {'link': 'https://www.epa.gov/', 'full_name': 'U.S. Environmental Protection Agency'},
    'USGS': {'link': 'https://www.usgs.gov/', 'full_name': 'U.S. Geological Survey'}
}

export const METHODOLOGY_MAPPING = {
    'AAS': {'full_name': 'Atomic absorption spectroscopy'},
    'AFS': {'full_name': 'Atomic flourescence spectrometry'},
    'ASV': {'full_name': 'Anodic stripping voltammetry'},
    'C-IC': {'full_name': 'Combustion ion chromatography', 'link': 'https://en.wikipedia.org/wiki/Ion_chromatography'},
    'Colorimetry': {'link': 'https://en.wikipedia.org/wiki/Colorimetry_(chemical_method)'},
    'CRDS': {'full_name': 'Cavity ring-down spectroscopy', 'link': 'https://en.wikipedia.org/wiki/Cavity_ring-down_spectroscopy'},
    'CVAAS': {'full_name': 'Cold vapor atomic absorption spectroscopy'},
    'CVAFS': {'full_name': 'Cold vapor atomic fluorescence spectrometry'},
    'FAA': {'full_name': 'Flame atomic absorption'},
    'GC': {'full_name': 'Gas chromatography', 'link': 'https://en.wikipedia.org/wiki/Gas_chromatography'},
    'GC/AES': {'full_name': 'Gas chromatography with atomic emission spectrometry'},
    'GC/AFS': {'full_name': 'Gas chromatography with atomic fluorescence spectrometry'},
    'GC/AFD': {'full_name': 'Gas chromatography with an alkali flame ionization detector', 'link': 'https://en.wikipedia.org/wiki/Flame_ionization_detector'},
    'GC/ECD': {'full_name': 'Gas chromatography with an electron capture detector', 'link': 'https://en.wikipedia.org/wiki/Electron_capture_detector'},
    'GC/ELCD': {'full_name': 'Gas chromatography with an electrolytic conductivity detector', 'link': 'https://en.wikipedia.org/wiki/Conductivity_(electrolytic)'},
    'GC/FID': {'full_name': 'Gas chromatography with a flame ionization detector', 'link': 'https://en.wikipedia.org/wiki/Flame_ionization_detector'},
    'GC/FPD': {'full_name': 'Gas chromatography with a flame photometric detector', 'link': 'https://en.wikipedia.org/wiki/Flame_detector'},
    'GC/HSD': {'full_name': 'Gas chromatography with a halogen selective detector', 'link': 'https://en.wikipedia.org/wiki/Electron_capture_detector'},
    'GC/MS': {'full_name': ' Gas chromatography with mass spectrometry', 'link': 'https://en.wikipedia.org/wiki/Gas_chromatography%E2%80%93mass_spectrometry'},
    'GC/NPD': {'full_name': 'Gas chromatography with a nitrogen-phosphorus detector', 'link': 'https://en.wikipedia.org/wiki/Nitrogen%E2%80%93phosphorus_detector'},
    'GFAA': {'full_name': 'Graphite furnace atomic absorption', 'link': 'https://en.wikipedia.org/wiki/Graphite_furnace_atomic_absorption'},
    'GFAAS': {'full_name': 'Graphite furnace atomic absorption spectroscopy'},
    'HPLC': {'full_name': 'High performance liquid chromatography', 'link': 'https://en.wikipedia.org/wiki/High-performance_liquid_chromatography'},
    'HPLC/ELCD': {'full_name': 'High performance liquid chromatography with an electrolytic conductivity detector', 'link': 'https://en.wikipedia.org/wiki/Conductivity_(electrolytic)'},
    'HPLC/FLD': {'full_name': 'High performance liquid chromatography with a fluorescence detector', 'link': 'https://en.wikipedia.org/wiki/Fluorescence_spectroscopy'},
    'HPLC/MS': {'full_name': 'High performance liquid chromatography with mass spectrometry', 'link': 'https://en.wikipedia.org/wiki/High-performance_liquid_chromatography'},
    'HPLC/PCD': {'full_name': 'High performance liquid chromatography with post column derivatization', 'link': 'https://www.pickeringlabs.com/library/primers/about-post-column-hplc/'},
    'HPLC/UV': {'full_name': 'High performance liquid chromatography with an ultraviolet detector', 'link': 'https://en.wikipedia.org/wiki/UV_detectors'},
    'IC': {'full_name': 'Ion chromatography', 'link': 'https://en.wikipedia.org/wiki/Ion_chromatography'},
    'IC/CD': {'full_name': 'Ion chromatography with a conductivity detector', 'link': 'https://en.wikipedia.org/wiki/Ion_chromatography'},
    'IC-ED': {'full_name': 'Ion chromatography with electrochemical detection'},
    'ICP/MS': {'full_name': 'Inductively coupled plasma mass spectrometry'},
    'Immunoassay': {'link': 'https://en.wikipedia.org/wiki/Immunoassay'},
    'IR': {'full_name': 'Infrared spectroscopy'},
    'LC': {'full_name': 'Liquid chromatography', 'link': 'https://en.wikipedia.org/wiki/High-performance_liquid_chromatography'},
    'LC-ACPI': {'full_name': 'Liquid chromatography with atmospheric-pressure chemical ionization', 'link': 'https://en.wikipedia.org/wiki/Atmospheric-pressure_chemical_ionization'},
    'LC-ESI': {'full_name': 'Liquid chromatography with electrospray ionization', 'link': 'https://en.wikipedia.org/wiki/Electrospray_ionization'},
    'LC/DAD': {'full_name': 'Liquid chromatography with a diode array detector', 'link': 'https://www.labcompare.com/Chemical-Analysis-Equipment/510-HPLC-Photo-Diode-Array-Detector-HPLC-PDA-Detector/'},
    'LC/ELCD': {'full_name': 'Liquid chromatography with an electrolytic conductivity detector', 'link': 'https://en.wikipedia.org/wiki/Conductivity_(electrolytic)'},
    'LC/FLD': {'full_name': 'Liquid chromatography with a fluorescence detector', 'link': 'https://en.wikipedia.org/wiki/Fluorescence_spectroscopy'},
    'LC/MS': {'full_name': 'Liquid chromatography with mass spectrometry', 'link': 'https://en.wikipedia.org/wiki/Liquid_chromatography%E2%80%93mass_spectrometry'},
    'LC/PDA': {'full_name': 'Liquid chromatography with a photodiode array detector', 'link': 'https://www.labcompare.com/Chemical-Analysis-Equipment/510-HPLC-Photo-Diode-Array-Detector-HPLC-PDA-Detector/'},
    'LC/UV': {'full_name': 'Liquid chromatography with an ultraviolet detector', 'link': 'https://en.wikipedia.org/wiki/UV_detectors'},
    'LC/VIS': {'full_name': 'Liquid chromatography with visible spectroscopy'},
    'MS': {'full_name': 'Mass spectrometry', 'link': 'https://en.wikipedia.org/wiki/Mass_spectrometry'},
    'PLM': {'full_name': 'Polarized light microscopy', 'link': 'https://en.wikipedia.org/wiki/Polarized_light_microscopy'},
    'Purge-and-trap': {'link': 'https://www.teledynetekmar.com/prods/Pages/Purge-and-Trap-Overview.aspx'},
    'Spectrophotometry': {'link': 'https://en.wikipedia.org/wiki/Spectrophotometry'},
    'TDLAS': {'full_name': 'Tunable diode laser absorption spectroscopy', 'link': 'https://en.wikipedia.org/wiki/Tunable_diode_laser_absorption_spectroscopy'},
    'UV/VIS': {'full_name': 'Ultraviolet and visible spectroscopy', 'link': 'https://en.wikipedia.org/wiki/Ultraviolet%E2%80%93visible_spectroscopy'},
    'VIS': {'full_name': 'Visible spectroscopy', 'link': 'https://en.wikipedia.org/wiki/Ultraviolet%E2%80%93visible_spectroscopy'},
    'XRF': {'full_name': 'X-ray flourescence'}
}

export const ANALYTICAL_QC_GRADES = {
    A: "MW Confirmed, Purity >90%",
    Ac: "Purity > 90% CAUTION, Low Conc. 5-30% of expected value",
    B: "MW Confirmed, Purity 75-90%",
    Bc: "Purity 75-90% CAUTION, Low Conc. 5-30% of expected value",
    C: "MW Confirmed, Purity 50-75%",
    Cc: "Purity 50-75% CAUTION, Low Conc. 5-30% of expected value",
    D: "CAUTION Purity <50%",
    F: "CAUTION Incorrect MW. Biological Activity Unreliable",
    Fc: "CAUTION Very Low Conc. <5% of expected value. Biological Activity Unreliable",
    Fns: "CAUTION No Sample Detected. Biological Activity Unreliable",
    I: "ISOMERS Two or more isomers detected",
    M: "DEFINED MIXTURE Two or more components",
    ND: "Not Determined",
    U: "Unknown/Inconclusive",
    W: "Sample Withdrawn",
    Z: "MW Confirmed, No Purity Info"
}

export const ANALYTICAL_QC_CALLS = {
    L: "CAUTION: Physical loss",
    S: "Stable",
    T: "CAUTION: Chemical transformation",
    X: "CAUTION: Unstable, reason undetermined"
}

export const store = reactive({
    showHeaderAndFooter: false,
})