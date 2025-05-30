import {reactive} from 'vue'

export const APP_MODE = import.meta.env.MODE
export const BACKEND_LOCATION = import.meta.env.VITE_FLASK_BACKEND_LOCATION
export const COMPTOX_PAGE_URL = import.meta.env.VITE_COMPTOX_PAGE_URL
export const IMAGE_BY_DTXSID_API = import.meta.env.VITE_IMAGE_BY_DTXSID_API
export const INTERNAL_DEPLOYMENT = import.meta.env.VITE_INTERNAL_DEPLOYMENT === "true"
export const INTERPRET_API_KEY = import.meta.env.VITE_INTERPRET_API_KEY

console.log({BACKEND_LOCATION, COMPTOX_PAGE_URL, IMAGE_BY_DTXSID_API, INTERNAL_DEPLOYMENT})

export const ANALYTE_MAPPING = {
    SVOCs: "Semi-volatile organic compounds",
    VOCs: "Volatile organic compounds",
    PCBs: "Polychlorinated biphenyls",
    PAHs: "Polycyclic aromatic hydrocarbons",
    PFAS: "Per- and polyfluoroalkyl substances"
}

export const SOURCE_ABBREVIATION_MAPPING = {
    'ACSOmega': {'full_name': 'ACS Omega', 'link': 'https://pubs.acs.org/journal/acsodf'},
    'ANL': {'full_name': 'Argonne National Laboratory', 'link': 'https://www.anl.gov/'},
    'APPRIL': {
        'link': 'https://ordspub.epa.gov/ords/pesticides/f?p=APPRIL_PUBLIC:2::::::',
        'full_name': 'Active Pesticide Product Registration Informational Listing'
    },
    'ARC': {'full_name': 'Agricultural Research Council', 'link': 'https://www.arc.agric.za/Pages/Home.aspx'},
    'ASTM': {'full_name': 'ASTM International', 'link': 'https://www.astm.org/'},
    'ATSDR': {'full_name': 'Agency for Toxic Substances and Diseas Registry', 'link': 'https://www.atsdr.cdc.gov/'},
    'Acta Chromatogr.': {
        'full_name': 'Acta Chromatographica',
        'link': 'https://akjournals.com/view/journals/1326/1326-overview.xml'
    },
    'Acta Pharmaceutica Sinica B': {'link': 'https://shop.elsevier.com/journals/acta-pharmaceutica-sinica-b/2211-3835'},
    'Acta Veterinaria Scandinavica': {'link': 'https://actavetscand.biomedcentral.com/articles/10.1186/s13028-018-0357-9'},
    'Adv. Pharma.': {'full_name': 'Advances in Pharmaceutics', 'link': 'https://www.hindawi.com/journals/jchem/'},
    'Agilent': {'link': 'https://www.agilent.com/'},
    'Am. Jnl. Anal. Chem.': {
        'full_name': 'American Journal of Analytical Chemistry',
        'link': 'www.scirp.org/journal/ajac'
    },
    'Anal. Bioanal. Chem.': {
        'full_name': 'Analytical and Bioanalytical Chemistry',
        'link': 'https://www.springer.com/journal/216'
    },
    'Anal. Chem.': {'full_name': 'Analytical Chemistry', 'link': 'https://pubs.acs.org/journal/ancham'},
    'Anal. Chim. Acta': {
        'full_name': 'Analytica Chimica Acta',
        'link': 'https://www.sciencedirect.com/journal/analytica-chimica-acta'
    },
    'Anal. Let.': {'full_name': 'Analytical Letters', 'link': 'https://www.tandfonline.com/journals/lanl20'},
    'Anal. Meth.': {
        'full_name': 'Analytical Methods',
        'link': 'https://www.rsc.org/journals-books-databases/about-journals/analytical-methods/'
    },
    'Anal. Sci.': {'full_name': 'Analytical Sciences', 'link': 'https://www.springer.com/journal/44211'},
    'Anal. Sci. Adv.': {
        'full_name': 'Analytical Science Advances',
        'link': 'https://chemistry-europe.onlinelibrary.wiley.com/hub/journal/26285452/overview'
    },
    'Antioxidants': {'link': 'https://www.mdpi.com/journal/antioxidants'},
    'BMC Research Notes': {'link': 'https://bmcresnotes.biomedcentral.com/'},
    'BMC Veterinary Research': {'link': 'https://bmcvetres.biomedcentral.com/articles/10.1186/s12917-019-1963-0'},
    'BRI': {'full_name': 'Biodiversity Research Institute', 'link': 'https://briwildlife.org/'},
    'BVL': {
        'full_name': 'German Federal Office of Consumer Protection and Food Safety',
        'link': 'https://www.bvl.bund.de/EN/Home/home_node.html'
    },
    'BfR': {
        'full_name': 'German Federal Institute for Risk Assessment',
        'link': 'https://www.bfr.bund.de/en/home.html'
    },
    'BioMed Res. Int.': {
        'full_name': 'BioMed Research International',
        'link': 'https://www.hindawi.com/journals/bmri/'
    },
    'BioProcessing Journal': {'link': 'https://www.bioprocessingjournal.com/'},
    'Biochimica et Biophysica Acta': {'link': 'https://www.elsevier.com/subject/biochemistry-genetics-and-molecular-biology/bba'},
    'Biomass and Bioenergy': {'link': 'https://www.sciencedirect.com/journal/biomass-and-bioenergy'},
    'Biomedical Chromatography': {'link': 'https://analyticalsciencejournals.onlinelibrary.wiley.com/journal/10990801'},
    'Bioresource Technology': {'link': 'https://www.sciencedirect.com/journal/bioresource-technology'},
    'Bruker': {'link': 'https://www.bruker.com/'},
    'Bull. Environ. Contam. Toxicol.': {
        'full_name': 'Bulletin of Environmental Contamination and Toxicology',
        'link': 'https://www.springer.com/journal/128'
    },
    'Bulletin of the Chemical Society of Ethiopia': {'link': 'https://www.ajol.info/index.php/bcse'},
    'CCAL': {
        'full_name': 'Cooperative Chemical Analytical Laboratory at Oregon State University',
        'link': 'https://ccal.oregonstate.edu/'
    },
    'CDC': {'full_name': 'Centers for Disease Control and Prevention', 'link': 'https://www.cdc.gov/'},
    'CEM': {'full_name': 'CEM Corporation', 'link': 'https://cem.com'},
    'CERCH': {'full_name': 'Center for Environmental and Community Health', 'link': 'https://cerch.berkeley.edu/home'},
    'CFSRE': {'link': 'https://www.cfsre.org/', 'full_name': 'Center for Forensic Science Research & Education'},
    'CIR': {'full_name': 'Cosmetic Ingredient Review', 'link': 'https://cir-reports.cir-safety.org/'},
    'CPSC': {'full_name': 'U.S. Consumer Product Safety Commision', 'link': 'https://www.cpsc.gov/'},
    'CSB': {'link': 'https://www.csb.gov/', 'full_name': 'U.S. Chemical Safety & Hazard Investigation Board'},
    'Cayman': {'link': 'https://www.caymanchem.com/forensics/publications/csl'},
    'Chem. Eur. J.': {
        'full_name': 'Chemistry: A European Journal',
        'link': 'https://chemistry-europe.onlinelibrary.wiley.com/journal/15213765'
    },
    'Chem. Res. Toxicol.': {
        'full_name': 'Chemical Research in Toxicology',
        'link': 'https://pubs.acs.org/journal/crtoec'
    },
    'Chemosensors': {'link': 'https://www.mdpi.com/journal/chemosensors'},
    'Chemosphere': {'link': 'https://www.sciencedirect.com/journal/chemosphere'},
    'Chinese Journal of Chromatography': {'link': 'https://www.chrom-china.com/EN/column/column21.shtml'},
    'Concawe': {'link': 'https://www.concawe.eu/who-are-we/'},
    'Corteva': {'link': 'https://www.corteva.com/'},
    'Czech J. Food Sci.': {
        'full_name': 'Czech Journal of Food Sciences',
        'link': 'https://cjfs.agriculturejournals.cz/'
    },
    'DEA': {'full_name': 'United States Drug Enforcement Agency', 'link': 'https://www.dea.gov/'},
    'DTSC': {'full_name': 'Department of Toxic Substances Control', 'link': 'https://dtsc.ca.gov/'},
    'DVA': {'full_name': 'Department of Veterans Affairs', 'link': 'https://www.pbm.va.gov/'},
    'Data in Brief': {'link': 'https://www.sciencedirect.com/journal/data-in-brief'},
    'DoD': {'full_name': 'United States Department of Defense', 'link': 'https://www.defense.gov/'},
    'Drug Test. Anal.': {
        'full_name': 'Drug Testing and Analysis',
        'link': 'https://analyticalsciencejournals.onlinelibrary.wiley.com/journal/19427611'
    },
    'ECCS': {
        'full_name': 'European Commission for Consumer Safety',
        'link': 'https://commission.europa.eu/business-economy-euro/doing-business-eu/eu-product-safety-and-labelling/product-safety/consumer-product-safety_en#:~:text=The%20Consumer%20Safety%20Network%20is,the%20main%20areas%20of%20discussion.'
    },
    'ECHA': {'link': 'https://echa.europa.eu/', 'full_name': 'European Chemicals Agency'},
    'EFSA': {'full_name': 'European Food Safety Authority', 'link': 'https://www.efsa.europa.eu/en'},
    'ENVA': {
        'full_name': 'UK Environment Agency',
        'link': 'https://www.gov.uk/government/organisations/environment-agency/about'
    },
    'ENVCAN': {
        'full_name': 'Environment and Climate Change Canada',
        'link': 'https://www.canada.ca/en/environment-climate-change.html'
    },
    'EPA-ECM': {
        'full_name': 'United States Environmental Protection Agency - Environmental Chemistry Methods',
        'link': 'https://www.epa.gov/pesticide-analytical-methods/environmental-chemistry-methods-ecm'
    },
    'EPA-OW': {
        'full_name': 'Environmental Protection Agency - Office of Water',
        'link': 'https://www.epa.gov/aboutepa/about-office-water'
    },
    'ERDC': {'full_name': 'Engineer Research and Development Center', 'link': 'https://www.erdc.usace.army.mil/'},
    'EURL': {
        'full_name': 'European Reference Laboratories',
        'link': 'https://www.eurl-pesticides.eu/docs/public/home.asp?LabID=500&Lang=EN'
    },
    'Ecotoxicology and Environmental Safety': {'link': 'https://www.sciencedirect.com/journal/ecotoxicology-and-environmental-safety'},
    'Elsevier: Encyclopedia of Environmental Health': {'link': 'https://shop.elsevier.com/books/encyclopedia-of-environmental-health/nriagu/978-0-444-63951-6'},
    'Emerg. Con.': {
        'full_name': 'Emerging Contaminants',
        'link': 'https://www.sciencedirect.com/journal/emerging-contaminants'
    },
    'Env. Poll.': {
        'full_name': 'Environmental Pollution',
        'link': 'https://www.sciencedirect.com/journal/environmental-pollution'
    },
    'Env. Sci. Proc. Imp.': {
        'full_name': 'Environmental Science Processes and Impacts',
        'link': 'https://www.rsc.org/journals-books-databases/about-journals/environmental-science-processes-impacts/'
    },
    'Environ Sci Pollut Res': {
        'full_name': 'Environmental Science and Pollution Research',
        'link': 'https://link.springer.com/journal/11356'
    },
    'Environ. Monit. Assess.': {
        'full_name': 'Environmental Monitoring and Assessment',
        'link': 'https://www.springer.com/journal/10661'
    },
    'Environ. Sci. Eur.': {'full_name': 'Environmental Sciences Europe', 'link': 'https://enveurope.springeropen.com/'},
    'Environ. Sci. Technol.': {
        'full_name': 'Environmental Science and Technology',
        'link': 'https://pubs.acs.org/journal/esthag'
    },
    'Environ. Toxicol. Chem.': {
        'full_name': 'Environmental Toxicology and Chemistry',
        'link': 'https://setac.onlinelibrary.wiley.com/journal/15528618'
    },
    'Environ. Sci. Technol. Lett.': {
        'full_name': 'Environmental Science and Technology Letters',
        'link': 'https://pubs.acs.org/journal/estlcu'
    },
    'Environmental Science': {'link': 'https://www.sciencedirect.com/journal/journal-of-environmental-sciences'},
    'Environmental Science & Technology': {'link': 'https://pubs.acs.org/journal/esthag'},
    'Environmental Technology': {'link': 'https://www.tandfonline.com/journals/tent20'},
    'Eurofins': {'full_name': 'Eurofins Scientific', 'link': 'https://www.eurofins.com/'},
    'European Journal of Pharmaceutical Sciences': {'link': 'https://www.sciencedirect.com/journal/european-journal-of-pharmaceutical-sciences'},
    'Exposure and Health': {'link': 'https://link.springer.com/journal/12403'},
    'FAO': {
        'link': 'https://www.fao.org/home/en',
        'full_name': 'Food & Agricultural Organization of the United Nations'
    },
    'FCRIS': {
        'full_name': 'Food Contaminant and Residue Information System',
        'link': 'https://www.iaea.org/resources/databases/food-contaminant-and-residue-information-system'
    },
    'FCT': {
        'full_name': 'Food Chemistry Toxicology',
        'link': 'https://www.sciencedirect.com/journal/food-and-chemical-toxicology'
    },
    'FDA': {'full_name': 'United States Food and Drug Administration', 'link': 'https://www.fda.gov/'},
    'Food Additives and Contaminants: Part A': {'link': 'https://www.tandfonline.com/journals/tfac20'},
    'Food Chem.': {'full_name': 'Food Chemistry', 'link': 'https://www.sciencedirect.com/journal/food-chemistry'},
    'Food Control': {'link': 'https://www.sciencedirect.com/journal/food-control'},
    'Food Sci. Biotechnol.': {
        'full_name': 'Food Science and Biotechnology',
        'link': 'https://link.springer.com/journal/10068'
    },
    'Foods': {'link': 'https://www.mdpi.com/journal/foods'},
    'Forensic Science International': {'link': 'https://www.sciencedirect.com/journal/forensic-science-international'},
    'Forensic Toxicology': {'link': 'https://link.springer.com/journal/11419'},
    'Fresenius J. Anal. Chem.': {'full_name': 'Fresenius Journal of Analytical Chemistry'},
    'Frontiers in Analytical Science': {'link': 'https://www.frontiersin.org/journals/analytical-science'},
    'Frontiers in Chemistry': {'link': 'https://www.frontiersin.org/journals/chemistry'},
    'GNPS': {
        'link': 'https://ccms-ucsd.github.io/GNPSDocumentation/gnpslibraries',
        'full_name': 'Global Natural Products Social Molecular Networking'
    },
    'Gembloux Agro-Bio Tech': {'link': 'https://www.gembloux.uliege.be/cms/c_4039827/en/gembloux-agro-bio-tech'},
    'Gerstel': {'link': 'https://gerstel.com/en'},
    'HALO': {'full_name': 'HALO Columns', 'link': 'https://halocolumns.com/about-us/'},
    'HERA': {
        'full_name': 'Human and Environmental Risk Assessments on ingredients of household cleaning products',
        'link': 'https://www.heraproject.com/'
    },
    'HESIS': {
        'full_name': 'California Department of Human Health: Hazard Evaluation System and Information Science',
        'link': 'https://www.cdph.ca.gov/Programs/CCDPHP/DEODC/OHB/HESIS/Pages/HESIS.aspx'
    },
    'HMDB': {'link': 'https://hmdb.ca', 'full_name': 'Human Metabolome Database'},
    'Health Canada': {'link': 'https://www.canada.ca/en/health-canada.html'},
    'Heliyon': {'link': 'https://www.sciencedirect.com/journal/heliyon'},
    'IARC': {'full_name': 'The International Agency for Research on Cancer', 'link': 'https://www.iarc.who.int/'},
    'ISO': {'full_name': 'International Organization for Standardization', 'link': 'https://www.iso.org/home.html'},
    'ISPA-CNR': {
        'full_name': 'Institute of Sciences of Food Production - Consiglio Nazional delle Ricerche',
        'link': 'https://www.cnr.it/en/institute/077/institute-of-sciences-of-food-production-ispa'
    },
    'Int. J. Environ. Res. Public Health': {
        'full_name': 'International Journal of Environmental Research and Public Health',
        'link': 'https://www.mdpi.com/journal/ijerph'
    },
    'Int. J. Anal. Chem.': {
        'full_name': 'International Journal of Analytical Chemistry',
        'link': 'https://www.hindawi.com/journals/ijac/'
    },
    'International Scholarly Research Notices': {'link': 'https://www.hindawi.com/journals/isrn/'},
    'Intertek': {'link': 'https://www.intertek.com/'},
    'J Anal, Methods Chem.': {'full_name': 'Journal of Analytical Methods in Chemistry'},
    'J Biomed. Biotechnol.': {'full_name': 'Journal of Biomedicine and Biotechnology'},
    'J. AOAC Int.': {'full_name': 'Journal of AOAC International', 'link': 'https://academic.oup.com/jaoac'},
    'J. Agric. Food Chem.': {
        'full_name': 'Journal of Agricultural and Food Chemistry',
        'link': 'https://pubs.acs.org/journal/jafcau'
    },
    'J. Am. Soc. Mass Spectrom.': {
        'full_name': 'Journal of the American Society for Mass Spectrometry',
        'link': 'https://en.wikipedia.org/wiki/American_Society_for_Mass_Spectrometry'
    },
    'J. Anal. Toxicol.': {'full_name': 'Journal of Analytical Toxicology'},
    'J. Chromatogr. A': {
        'full_name': 'Journal of Chromatography A',
        'link': 'https://www.sciencedirect.com/journal/journal-of-chromatography-a'
    },
    'J. Chromatogr. B': {
        'full_name': 'Journal of Chromatography B',
        'link': 'https://www.sciencedirect.com/journal/journal-of-chromatography-b'
    },
    'J. Chromatogr. Sep. Tech.': {
        'full_name': 'Journal of Chromatography and Separation Techniques',
        'link': 'https://www.longdom.org/chromatography-separation-techniques.html'
    },
    'J. Sep. Sci.': {
        'full_name': 'Journal of Separation Science',
        'link': 'https://analyticalsciencejournals.onlinelibrary.wiley.com/journal/16159314'
    },
    'JAAS': {'full_name': 'Journal of Analytical Atomic Spectrometry'},
    'JECFA': {
        'full_name': 'Joint FAO/WHO Expert Committee on Food Additives',
        'link': 'https://apps.who.int/food-additives-contaminants-jecfa-database/'
    },
    'JES': {
        'full_name': 'Journal of Environmental Sciences',
        'link': 'https://www.sciencedirect.com/journal/journal-of-environmental-sciences'
    },
    'JOEL': {'full_name': 'JOEL USA Inc.', 'link': 'https://www.jeolusa.com/'},
    'JoVE': {'full_name': 'Journal of Visuzalized Experiments', 'link': 'https://app.jove.com/journal'},
    'Journal of Apicultural Science': {'link': 'https://sciendo.com/journal/JAS?content-tab=aim-and-scope#journal-info-bar'},
    'Journal of Chemistry': {'link': 'https://www.hindawi.com/journals/jchem/'},
    'Journal of Environmental Science and Health, Part B': {'link': 'https://www.tandfonline.com/journals/lesb20'},
    'Journal of Ethnopharmacology': {'link': 'https://shop.elsevier.com/journals/journal-of-ethnopharmacology/0378-8741'},
    'Journal of Lipid Research': {'link': 'https://www.jlr.org/'},
    'Journal of Toxicology': {'link': 'https://www.hindawi.com/journals/jt/2013/329407/'},
    'Journal of Trace Elements in Medicine and Biology': {'link': 'https://shop.elsevier.com/journals/journal-of-trace-elements-in-medicine-and-biology/0946-672X'},
    'LECO': {'full_name': 'LECO  Corporation', 'link': 'https://www.leco.com/'},
    'MDPI': {'full_name': 'Multidisciplinary Digital Publishing Institute', 'link': 'https://www.mdpi.com/'},
    'Metabolites': {'link': 'https://www.mdpi.com/journal/metabolites'},
    'Methods': {'link': 'https://www.sciencedirect.com/journal/methods'},
    'Methods and Applications in Fluorescence': {'link': 'https://iopscience.iop.org/journal/2050-6120'},
    'Methods in Enzymology': {'link': 'https://www.elsevier.com/books-and-journals/book-series/methods-in-enzymology'},
    'MethodsX': {'link': 'https://www.sciencedirect.com/journal/methodsx'},
    'MnDOA': {'full_name': 'Minnesota Department of Agriculture', 'link': 'https://www.mda.state.mn.us/'},
    'MoNA': {'link': 'https://mona.fiehnlab.ucdavis.edu', 'full_name': 'MassBank of North America'},
    'Molecules': {'link': 'https://www.mdpi.com/journal/molecules'},
    'NEMI': {'full_name': 'National Environmental Methods Index', 'link': 'https://www.nemi.gov/home/'},
    'NICNAS': {
        'full_name': 'Australian National Industrial Chemicals Notification and Assessment Scheme',
        'link': 'https://www.australianchamber.com.au/our-policies/work-health-safety/nicnas/'
    },
    'NIOSH': {
        'full_name': 'The National Institute for Occupational Safety and Health',
        'link': 'https://www.cdc.gov/niosh/index.htm'
    },
    'NIST': {'full_name': 'National Institute of Standards and Techn ology', 'link': 'https://www.nist.gov/'},
    'NJDEP': {'full_name': 'New Jersey Department of Environmental Protection', 'link': 'https://dep.nj.gov/'},
    'NJDOH': {'link': 'http://www.nj.gov/health', 'full_name': 'New Jersey Department of Health'},
    'NMS Labs': {'link': 'https://www.nmslabs.com/', 'full_name': 'National Mediacal Services Labs'},
    'NP-MRD': {'link': 'https://np-mrd.org', 'full_name': 'Natural Products Magnetic Resonance Database'},
    'NPIC': {'link': 'https://www.npic.orst.edu', 'full_name': 'National Pesticide Information Center'},
    'NRC Canada': {'full_name': 'National Research Council of Canada', 'link': 'https://nrc.canada.ca/en'},
    'NREL': {'full_name': 'National Renewable Energy Laboratory', 'link': 'https://www.nrel.gov/'},
    'NRT': {'link': 'https://www.nrt.org/', 'full_name': 'U.S. National Response Team'},
    'NSCEP': {
        'full_name': 'National Service Center for Environmental Publications',
        'link': 'https://www.epa.gov/nscep'
    },
    'NTP': {'full_name': 'National Toxicology Program', 'link': 'https://ntp.niehs.nih.gov/'},
    'OECD': {
        'full_name': 'Organisation for Economic Co-operation and Development',
        'link': 'https://hpvchemicals.oecd.org/'
    },
    'OEHHA': {'full_name': 'California Environmental Protection Agency Office of Environmental Health Hazard Assessment'},
    'OSHA': {'full_name': 'Occupational Safety and Health Administration', 'link': 'https://www.osha.gov/'},
    'Open Access Library Journal': {'link': 'https://www.scirp.org/journal/oalibj/'},
    'PLOSOne': {'full_name': 'PLOS One'},
    'Perkin Elmer': {'link': 'https://content.perkinelmer.com/'},
    'PharmSciTech': {
        'full_name': 'AAPS PharmSciTech',
        'link': 'https://www.aaps.org/education-and-research/journals/aaps-pharmscitech'
    },
    'Pharmaceuticals': {'link': 'https://www.mdpi.com/journal/pharmaceuticals'},
    'Polycyclic Aromatic Compounds': {'link': 'https://www.tandfonline.com/journals/gpol20'},
    'Polymers': {'link': 'https://www.mdpi.com/journal/polymers'},
    'RSC Advances': {'link': 'https://www.rsc.org/journals-books-databases/about-journals/rsc-advances/'},
    'RTI': {'full_name': 'Research Triangle Institute', 'link': 'https://www.rti.org/'},
    'Restek': {'link': 'https://www.restek.com/?msclkid=fee1dbff753b1ac773d8be20c96214b0&utm_source=bing&utm_medium=cpc&utm_campaign=Restek%20Branding&utm_term=restek&utm_content=Branding'},
    'SCIEX': {'link': 'https://sciex.com/'},
    'SERDP': {
        'full_name': 'Strategic Environmental Research and Development Program',
        'link': 'https://serdp-estcp.org/'
    },
    'SGS AXYS': {'full_name': 'SGS AXYS Analytical Services', 'link': 'https://www.sgsaxys.com/'},
    'ST-MI': {'full_name': 'Michigan State'},
    'SWG': {
        'link': 'https://www.swgdrug.org',
        'full_name': 'Scientific Working Group for the Analysis of Seized Drugs'
    },
    'Saudi Journal of Biological Sciences': {'link': 'https://www.sciencedirect.com/journal/saudi-journal-of-biological-sciences'},
    'Scientific Reports': {'link': 'https://www.nature.com/srep/'},
    'Separation Science Plus': {'link': 'https://analyticalsciencejournals.onlinelibrary.wiley.com/journal/25731815'},
    'Separations': {'link': 'https://www.mdpi.com/journal/separations'},
    'Shimadzu': {'link': 'https://www.shimadzu.com/'},
    'SpectraLab': {'full_name': 'Spectralab Scientific Inc.', 'link': 'https://www.spectralabsci.com/'},
    'TDB': {'link': 'https://tdb.epa.gov/', 'full_name': 'Drinking Water Treatability Database'},
    'The MAK Collection for Occupational Health and Safety': {'link': 'https://onlinelibrary.wiley.com/doi/book/10.1002/3527600418?msockid=31e8271ae7f76d27082833dbe6e56c89'},
    'Thermo Fisher': {
        'full_name': 'Thermo Fisher Scientific Inc.',
        'link': 'https://www.thermofisher.com/us/en/home.html'
    },
    'Toxicol. Appl. Pharmacol.': {
        'full_name': 'Toxicology and Applied Pharmacology',
        'link': 'https://www.sciencedirect.com/journal/toxicology-and-applied-pharmacology'
    },
    'Toxicol. Sci.': {'full_name': 'Toxicological Sciences', 'link': 'https://academic.oup.com/toxsci'},
    'Toxicon': {'full_name': 'Toxicon', 'link': 'https://www.sciencedirect.com/journal/toxicon'},
    'Toxics': {'link': 'https://www.mdpi.com/journal/toxics'},
    'Toxins': {'link': 'https://www.mdpi.com/journal/toxins'},
    'TrAC': {
        'full_name': 'Trends in Analytical Chemistry',
        'link': 'https://www.sciencedirect.com/journal/trac-trends-in-analytical-chemistry'
    },
    'TrAC Trends in Analytical Chemistry': {'link': 'https://www.sciencedirect.com/journal/trac-trends-in-analytical-chemistry'},
    'Transportation Research Record': {'link': 'https://journals.sagepub.com/home/trr'},
    'UCT Inc': {'full_name': 'United Technologies Corporation'},
    'UNEP': {'full_name': 'United Nations Environment Program', 'link': 'https://www.unep.org/'},
    'USDA': {'full_name': 'United States Department of Agriculture', 'link': 'https://www.usda.gov/'},
    'USDOT': {'full_name': 'US Department of Transportation', 'link': 'https://www.transportation.gov/'},
    'USEPA': {'full_name': 'United States Environmental Protection Agency', 'link': 'https://www.epa.gov/'},
    'USGS': {'full_name': 'United States Geological Survery', 'link': 'https://www.usgs.gov/'},
    'Uganda National Bureau of Standards': {'link': 'https://www.unbs.go.ug/'},
    'Virginia Department of Forensic Science': {'link': 'https://dfs.virginia.gov/'},
    'WDNR': {'full_name': 'Wisconsin Department of Natural Resources', 'link': 'https://dnr.wisconsin.gov/'},
    'WHO': {'full_name': 'World Health Organization', 'link': 'https://www.who.int/'},
    'Waste Management': {'link': 'https://www.sciencedirect.com/journal/waste-management'},
    'Water': {'link': 'https://www.mdpi.com/journal/water'},
    'Water Research': {'link': 'https://www.sciencedirect.com/journal/water-research'},
    'Waters': {'link': 'https://www.waters.com/nextgen/us/en.html'},
    'Wil. Anal. Sci.': {'full_name': 'Wiley Analytical Science', 'link': 'https://analyticalscience.wiley.com/about'},
}

export const METHODOLOGY_MAPPING = {
    'AAS': {'full_name': 'Atomic absorption spectroscopy'},
    'AFS': {'full_name': 'Atomic flourescence spectrometry'},
    'ASV': {'full_name': 'Anodic stripping voltammetry'},
    'C-IC': {'full_name': 'Combustion ion chromatography', 'link': 'https://en.wikipedia.org/wiki/Ion_chromatography'},
    'Colorimetry': {'link': 'https://en.wikipedia.org/wiki/Colorimetry_(chemical_method)'},
    'CRDS': {
        'full_name': 'Cavity ring-down spectroscopy',
        'link': 'https://en.wikipedia.org/wiki/Cavity_ring-down_spectroscopy'
    },
    'CVAAS': {'full_name': 'Cold vapor atomic absorption spectroscopy'},
    'CVAFS': {'full_name': 'Cold vapor atomic fluorescence spectrometry'},
    'FAA': {'full_name': 'Flame atomic absorption'},
    'GC': {'full_name': 'Gas chromatography', 'link': 'https://en.wikipedia.org/wiki/Gas_chromatography'},
    'GC/AES': {'full_name': 'Gas chromatography with atomic emission spectrometry'},
    'GC/AFS': {'full_name': 'Gas chromatography with atomic fluorescence spectrometry'},
    'GC/AFD': {
        'full_name': 'Gas chromatography with an alkali flame ionization detector',
        'link': 'https://en.wikipedia.org/wiki/Flame_ionization_detector'
    },
    'GC/ECD': {
        'full_name': 'Gas chromatography with an electron capture detector',
        'link': 'https://en.wikipedia.org/wiki/Electron_capture_detector'
    },
    'GC/ELCD': {
        'full_name': 'Gas chromatography with an electrolytic conductivity detector',
        'link': 'https://en.wikipedia.org/wiki/Conductivity_(electrolytic)'
    },
    'GC/FID': {
        'full_name': 'Gas chromatography with a flame ionization detector',
        'link': 'https://en.wikipedia.org/wiki/Flame_ionization_detector'
    },
    'GC/FPD': {
        'full_name': 'Gas chromatography with a flame photometric detector',
        'link': 'https://en.wikipedia.org/wiki/Flame_detector'
    },
    'GC/HSD': {
        'full_name': 'Gas chromatography with a halogen selective detector',
        'link': 'https://en.wikipedia.org/wiki/Electron_capture_detector'
    },
    'GC/MS': {
        'full_name': ' Gas chromatography with mass spectrometry',
        'link': 'https://en.wikipedia.org/wiki/Gas_chromatography%E2%80%93mass_spectrometry'
    },
    'GC/NPD': {
        'full_name': 'Gas chromatography with a nitrogen-phosphorus detector',
        'link': 'https://en.wikipedia.org/wiki/Nitrogen%E2%80%93phosphorus_detector'
    },
    'GFAA': {
        'full_name': 'Graphite furnace atomic absorption',
        'link': 'https://en.wikipedia.org/wiki/Graphite_furnace_atomic_absorption'
    },
    'GFAAS': {'full_name': 'Graphite furnace atomic absorption spectroscopy'},
    'HPLC': {
        'full_name': 'High performance liquid chromatography',
        'link': 'https://en.wikipedia.org/wiki/High-performance_liquid_chromatography'
    },
    'HPLC/ELCD': {
        'full_name': 'High performance liquid chromatography with an electrolytic conductivity detector',
        'link': 'https://en.wikipedia.org/wiki/Conductivity_(electrolytic)'
    },
    'HPLC/FLD': {
        'full_name': 'High performance liquid chromatography with a fluorescence detector',
        'link': 'https://en.wikipedia.org/wiki/Fluorescence_spectroscopy'
    },
    'HPLC/MS': {
        'full_name': 'High performance liquid chromatography with mass spectrometry',
        'link': 'https://en.wikipedia.org/wiki/High-performance_liquid_chromatography'
    },
    'HPLC/PCD': {
        'full_name': 'High performance liquid chromatography with post column derivatization',
        'link': 'https://www.pickeringlabs.com/library/primers/about-post-column-hplc/'
    },
    'HPLC/UV': {
        'full_name': 'High performance liquid chromatography with an ultraviolet detector',
        'link': 'https://en.wikipedia.org/wiki/UV_detectors'
    },
    'IC': {'full_name': 'Ion chromatography', 'link': 'https://en.wikipedia.org/wiki/Ion_chromatography'},
    'IC/CD': {
        'full_name': 'Ion chromatography with a conductivity detector',
        'link': 'https://en.wikipedia.org/wiki/Ion_chromatography'
    },
    'IC-ED': {'full_name': 'Ion chromatography with electrochemical detection'},
    'ICP/MS': {'full_name': 'Inductively coupled plasma mass spectrometry'},
    'Immunoassay': {'link': 'https://en.wikipedia.org/wiki/Immunoassay'},
    'IR': {'full_name': 'Infrared spectroscopy'},
    'LC': {
        'full_name': 'Liquid chromatography',
        'link': 'https://en.wikipedia.org/wiki/High-performance_liquid_chromatography'
    },
    'LC-ACPI': {
        'full_name': 'Liquid chromatography with atmospheric-pressure chemical ionization',
        'link': 'https://en.wikipedia.org/wiki/Atmospheric-pressure_chemical_ionization'
    },
    'LC-ESI': {
        'full_name': 'Liquid chromatography with electrospray ionization',
        'link': 'https://en.wikipedia.org/wiki/Electrospray_ionization'
    },
    'LC/DAD': {
        'full_name': 'Liquid chromatography with a diode array detector',
        'link': 'https://www.labcompare.com/Chemical-Analysis-Equipment/510-HPLC-Photo-Diode-Array-Detector-HPLC-PDA-Detector/'
    },
    'LC/ELCD': {
        'full_name': 'Liquid chromatography with an electrolytic conductivity detector',
        'link': 'https://en.wikipedia.org/wiki/Conductivity_(electrolytic)'
    },
    'LC/FLD': {
        'full_name': 'Liquid chromatography with a fluorescence detector',
        'link': 'https://en.wikipedia.org/wiki/Fluorescence_spectroscopy'
    },
    'LC/MS': {
        'full_name': 'Liquid chromatography with mass spectrometry',
        'link': 'https://en.wikipedia.org/wiki/Liquid_chromatography%E2%80%93mass_spectrometry'
    },
    'LC/PDA': {
        'full_name': 'Liquid chromatography with a photodiode array detector',
        'link': 'https://www.labcompare.com/Chemical-Analysis-Equipment/510-HPLC-Photo-Diode-Array-Detector-HPLC-PDA-Detector/'
    },
    'LC/UV': {
        'full_name': 'Liquid chromatography with an ultraviolet detector',
        'link': 'https://en.wikipedia.org/wiki/UV_detectors'
    },
    'LC/VIS': {'full_name': 'Liquid chromatography with visible spectroscopy'},
    'MS': {'full_name': 'Mass spectrometry', 'link': 'https://en.wikipedia.org/wiki/Mass_spectrometry'},
    'PLM': {
        'full_name': 'Polarized light microscopy',
        'link': 'https://en.wikipedia.org/wiki/Polarized_light_microscopy'
    },
    'Purge-and-trap': {'link': 'https://www.teledynetekmar.com/prods/Pages/Purge-and-Trap-Overview.aspx'},
    'Spectrophotometry': {'link': 'https://en.wikipedia.org/wiki/Spectrophotometry'},
    'TDLAS': {
        'full_name': 'Tunable diode laser absorption spectroscopy',
        'link': 'https://en.wikipedia.org/wiki/Tunable_diode_laser_absorption_spectroscopy'
    },
    'UV/VIS': {
        'full_name': 'Ultraviolet and visible spectroscopy',
        'link': 'https://en.wikipedia.org/wiki/Ultraviolet%E2%80%93visible_spectroscopy'
    },
    'VIS': {
        'full_name': 'Visible spectroscopy',
        'link': 'https://en.wikipedia.org/wiki/Ultraviolet%E2%80%93visible_spectroscopy'
    },
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


export const METHOD_DOCUMENT_TYPES = {
    JNL: "Journal Article",
    MEV: "Method Evaluation",
    OTM: "Other Test Method",
    RGM: "Regulatory Method",
    SOP: "Standard Operating Procedure",
    SRM: "Standard Reference Method",
    VAN: "Vendor Application Note"
}


export const ELEMENTS = {
    Ac: "Actinium", Ag: "Silver", Al: "Aluminium", Am: "Americium", Ar: "Argon", As: "Arsenic", At: "Astatine",
    Au: "Gold", B: "Boron", Ba: "Barium", Be: "Beryllium", Bh: "Bohrium", Bi: "Bismuth", Bk: "Berkelium", Br: "Bromine",
    C: "Carbon", Ca: "Calcium", Cd: "Cadmium", Ce: "Cerium", Cf: "Californium", Cl: "Chlorine", Cm: "Curium",
    Cn: "Copernicium", Co: "Cobalt", Cr: "Chromium", Cs: "Caesium", Cu: "Copper", Db: "Dubnium", Ds: "Darmstadtium",
    Dy: "Dysprosium", Er: "Erbium", Es: "Einsteinium", Eu: "Europium", F: "Fluorine", Fe: "Iron", Fl: "Flerovium",
    Fm: "Fermium", Fr: "Francium", Ga: "Gallium", Gd: "Gadolinium", Ge: "Germanium", H: "Hydrogen", He: "Helium",
    Hf: "Hafnium", Hg: "Mercury", Ho: "Holmium", Hs: "Hassium", I: "Iodine", In: "Indium", Ir: "Iridium",
    K: "Potassium", Kr: "Krypton", La: "Lanthanum", Li: "Lithium", Lr: "Lawrencium", Lu: "Lutetium", Lv: "Livermorium",
    Mc: "Moscovium", Md: "Mendelevium", Mg: "Magnesium", Mn: "Manganese", Mo: "Molybdenum", Mt: "Meitnerium",
    N: "Nitrogen", Na: "Sodium", Nb: "Niobium", Nd: "Neodymium", Ne: "Neon", Nh: "Nihonium", Ni: "Nickel",
    No: "Nobelium", Np: "Neptunium", O: "Oxygen", Og: "Oganesson", Os: "Osmium", P: "Phosphorus", Pa: "Protactinium",
    Pb: "Lead", Pd: "Palladium", Pm: "Promethium", Po: "Polonium", Pr: "Praseodymium", Pt: "Platinum", Pu: "Plutonium",
    Ra: "Radium", Rb: "Rubidium", Re: "Rhenium", Rf: "Rutherfordium", Rg: "Roentgenium", Rh: "Rhodium", Rn: "Radon",
    Ru: "Ruthenium", S: "Sulfur", Sb: "Antimony", Sc: "Scandium", Se: "Selenium", Sg: "Seaborgium", Si: "Silicon",
    Sm: "Samarium", Sn: "Tin", Sr: "Strontium", Ta: "Tantalum", Tb: "Terbium", Tc: "Technetium", Te: "Tellurium",
    Th: "Thorium", Ti: "Titanium", Tl: "Thallium", Tm: "Thulium", Ts: "Tennessine", U: "Uranium", V: "Vanadium",
    W: "Tungsten", Xe: "Xenon", Y: "Yttrium", Yb: "Ytterbium", Zn: "Zinc", Zr: "Zirconium"
}


export const store = reactive({
    showHeaderAndFooter: false,
    internalDeployment: INTERNAL_DEPLOYMENT,
})