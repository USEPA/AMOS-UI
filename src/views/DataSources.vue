<!--
  This page is meant to list off the major data sources in the app.  Sources that add only one or a few methods to the
  database are excluded, as this page would become rather lengthy otherwise.

  This page takes no route or query parameters.
-->

<template>
  This page is meant to give descriptions of the more commonly appearing data sources combined in this application.  Sources with only a few records are not listed here.
  <br /><br />
  <DataSourceDetails
    sourceName="Agency for Toxic Substances and Disease Registry"
    category="Government methods collection"
    url="https://www.atsdr.cdc.gov"
    sourceID="ATSDR"
    substances="1033"
    factSheets="182"
    methods="40"
  />
  <DataSourceDetails
    sourceName="Agilent"
    category="Vendor methods collection"
    url="https://www.agilent.com"
    sourceID="Agilent"
    substances="3701"
    factSheets="2"
    methods="383"
    spectra="72"
  />
  <DataSourceDetails
    sourceName="Analytical QC"
    category="EPA-internal spectrum collection"
    url="https://ccte-cced-aqcv2.epa.gov/"
    sourceID="Analytical QC"
    substances="8828"
    spectra="36293"
  />
  <DataSourceDetails
    sourceName="Australian National Industrial Chemicals Notification and Assessment Scheme"
    category="Government fact sheet collection"
    url="https://www.australianchamber.com.au/our-policies/work-health-safety/nicnas/"
    sourceID="NICNAS"
    substances="6570"
    factSheets="3609"
  />
  <DataSourceDetails
    sourceName="Bruker"
    category="Vendor methods collection"
    url="https://www.bruker.com/"
    sourceID="Bruker"
    substances="635"
    methods="44"
  />
  <DataSourceDetails
    sourceName="California Environmental Protection Agency Office of Environmental Health Hazard Assessment"
    category="Open-access fact sheet collection"
    url="https://oehha.ca.gov/"
    sourceID="OEHHA"
    substances="110"
    factSheets="98"
  />
  <DataSourceDetails
    sourceName="Canadian Food Inspection Agency"
    category="Spectrum collection (not open, supplied to EPA)"
    url="https://inspection.canada.ca/eng/1297964599443/1297965645317"
    sourceID="Canadian Food Inspection Agency"
    substances="962"
    spectra="962"
  />
  <DataSourceDetails
    sourceName="Cayman Spectral Library"
    category="Open-access spectrum collection"
    url="https://www.caymanchem.com/forensics/publications/csl"
    sourceID="Cayman"
    substances="2286"
    spectra="2392"
  />
  <DataSourceDetails
    sourceName="Center for Forensic Science Research & Education"
    category="Open monographs collection"
    url="https://www.cfsre.org/nps-discovery/monographs"
    sourceID="CFSRE"
    substances="95"
    factSheets="84"
  />
  <DataSourceDetails
    sourceName="Cosmetic Ingredient Review"
    category="Open-access fact sheet collection"
    url="https://www.cir-safety.org/"
    sourceID="CIR"
    substances="2963"
    factSheets="535"
  />
  <DataSourceDetails
    sourceName="Czech Academy of Sciences"
    category="Open-access spectrum collection"
    url="https://chemrxiv.org/engage/chemrxiv/article-details/663ccc0a91aefa6ce19236c2"
    sourceID="Czech Academy of Sciences"
    substances="6271"
    spectra="410227"
  />
  <DataSourceDetails
    sourceName="Drinking Water Treatability Database"
    category="Open-access EPA fact sheet collection"
    url="https://tdb.epa.gov/"
    sourceID="TDB"
    substances="161"
    factSheets="72"
  />
  <DataSourceDetails
    sourceName="European Chemicals Agency"
    category="International fact sheet collection"
    url="https://echa.europa.eu/"
    sourceID="ECHA"
    substances="4943"
    factSheets="3577"
  />
  <DataSourceDetails
    sourceName="European Commission for Consumer Safety"
    category="International fact sheet collection"
    url="https://commission.europa.eu/business-economy-euro/doing-business-eu/eu-product-safety-and-labelling/product-safety/consumer-product-safety_en#:~:text=The%20Consumer%20Safety%20Network%20is,the%20main%20areas%20of%20discussion."
    sourceID="ECCS"
    substances="575"
    factSheets="248"
  />
  <DataSourceDetails
    sourceName="European Food Safety Authority"
    category="International fact sheet collection"
    url="https://www.efsa.europa.eu/en"
    sourceID="EFSA"
    substances="576"
    factSheets="604"
    methods="1"
  />
  <DataSourceDetails
    sourceName="European Union Reference Laboratories"
    category="Open-access methods collection"
    url="https://www.eurl-pesticides.eu"
    sourceID="EURL"
    substances="722"
    methods="55"
  />
  <DataSourceDetails
    sourceName="Food & Agricultural Organization of the United Nations"
    category="United Nations fact sheet collection"
    url="https://www.fao.org/home/en"
    sourceID="FAO"
    substances="349"
    factSheets="1395"
  />
  <DataSourceDetails
    sourceName="Food Contaminant and Residue Information System"
    category="International fact sheet collection"
    url="https://www.iaea.org/resources/databases/food-contaminant-and-residue-information-system"
    sourceID="FCRIS"
    substances="360"
    methods="101"
  />
  <DataSourceDetails
    sourceName="Global Natural Products Social Molecular Networking"
    category="Open-access spectrum libraries"
    url="https://gnps.ucsd.edu"
    sourceID="GNPS"
    substances="5656"
    spectra="21763"
  />
  <DataSourceDetails
    sourceName="Human Metabolome Database"
    category="Open-access spectrum collection"
    url="https://hmdb.ca/"
    sourceID="HMDB"
    substances="3936"
    spectra="45242"
  />
  <DataSourceDetails
    sourceName="The International Agency for Research on Cancer"
    category="International fact sheet & method collection"
    url="https://www.iarc.who.int/"
    sourceID="IARC"
    substances="2457"
    factSheets="113"
    methods="1"
  />
  <DataSourceDetails
    sourceName="Jozef Stefan Institute"
    category="Academic methods & spectra collection"
    url="https://www.ijs.si/ijsw/JSI"
    sourceID="Jozef Stefan Institute"
    substances="104"
    methods="1"
    spectra="5080"
  />
  <DataSourceDetails
    sourceName="LECO"
    category="Vendor methods collection"
    url="https://www.leco.com"
    sourceID="LECO"
    substances="1432"
    methods="66"
  />
  <DataSourceDetails
    sourceName="MassBank Europe"
    category="Open-access spectral database"
    url="https://massbank.eu/MassBank/"
    sourceID="MassBank EU"
    substances="14914"
    spectra="115792"
  />
  <DataSourceDetails
    sourceName="MassBank of North America"
    category="Open-access spectral database"
    url="https://mona.fiehnlab.ucdavis.edu"
    sourceID="MoNA"
    substances="5860"
    spectra="40175"
  />
  <DataSourceDetails
    sourceName="National Environmental Methods Index"
    category="Government methods collection"
    url="https://www.nemi.gov/home"
    sourceID="NEMI"
    substances="1565"
    methods="123"
  />
  <DataSourceDetails
    sourceName="National Institute for Occupational Safety and Health"
    category="Government methods collection"
    url="https://www.cdc.gov.niosh/index.htm"
    sourceID="NIOSH"
    substances="636"
    methods="372"
  />
  <DataSourceDetails
    sourceName="National Institute of Standards and Technology"
    category="Government methods collection"
    url="https://www.nist.gov/"
    sourceID="NIST, NIST PFAS"
    substances="905"
    methods="61"
    spectra="68"
  />
  <DataSourceDetails
    sourceName="National Pesticide Information Center"
    category="Open fact sheet collection"
    url="http://www.npic.orst.edu/"
    sourceID="NPIC"
    substances="54"
    factSheets="54"
  />
  <DataSourceDetails
    sourceName="Natural Products Magnetic Resonance Database"
    category="Open-access spectrum collection"
    url="https://np-mrd.org"
    sourceID="NP-MRD"
    substances="514"
    spectra="597"
  />
  <DataSourceDetails
    sourceName="New Jersey Department of Health"
    category="Government fact sheet collection"
    url="https://www.nj.gov/health"
    sourceID="NJDOH"
    substances="1626"
    factSheets="1626"
  />
  <DataSourceDetails
    sourceName="NMRShiftDB"
    category="NMR spectrum peak collection"
    url="http://nmrshiftdb.nmr.uni-koeln.de/"
    sourceID="NMRShiftDB"
    substances="15020"
    spectra="15125"
  />
  <DataSourceDetails
    sourceName="National Toxicology Program"
    category="Government fact sheet collection"
    url="https://ntp.niehs.nih.gov/"
    sourceID="NTP"
    substances="707"
    factSheets="571"
  />
  <DataSourceDetails
    sourceName="Organisation for Economic Co-operation and Development"
    category="International fact sheet collection"
    url="https://hpvchemicals.oecd.org/"
    sourceID="OECD"
    substances="1764"
    factSheets="1621"
  />
  <DataSourceDetails
    sourceName="Scientific Working Group for the Analysis of Seized Drugs"
    category="Open spectrum and monographs collection"
    url="https://www.swgdrug.org/"
    sourceID="SWG"
    substances="3441"
    factSheets="481"
    spectra="3358"
  />
  <DataSourceDetails
    sourceName="SCIEX"
    category="Vendor methods collection"
    url="https://sciex.com/"
    sourceID="SCIEX"
    substances="708"
    methods="53"
  />
  <DataSourceDetails
    sourceName="Shimadzu"
    category="Vendor methods collection"
    url="https://www.shimadzu.com"
    sourceID="Shimadzu"
    substances="5792"
    methods="1112"
  />
  <DataSourceDetails
    sourceName="SpectraBase"
    category="Spectrum database (spectra are not open, metadata is)"
    url="https://spectrabase.com/"
    sourceID="SpectraBase"
    substances="160442"
    spectra="638634"
  />
  <DataSourceDetails
    sourceName="UC Davis Fiehn Lab"
    category="Open-access spectrum collection"
    url="https://fiehnlab.ucdavis.edu/projects/vocbinbase"
    sourceID="UC Davis Fiehn Lab"
    substances="211"
    spectra="211"
  />
  <DataSourceDetails
    sourceName="U.S. Centers for Disease Control and Prevention"
    category="Government methods, fact sheets, and spectra"
    url="https://www.cdc.gov/index.htm"
    sourceID="CDC"
    substances="2707"
    factSheets="699"
    methods="25"
    spectra="804"
  />
  <DataSourceDetails
    sourceName="U.S. Department of Agriculture"
    category="Government methods collection"
    url="https://www.usda.gov/"
    sourceID="USDA"
    substances="351"
    factSheets="1"
    methods="41"
  />
  <DataSourceDetails
    sourceName="U.S. Department of Veterans Affairs"
    category="Government monograph collection"
    url="https://www.pbm.va.gov/"
    sourceID="DVA"
    substances="163"
    factSheets="175"
  />
  <DataSourceDetails
    sourceName="U.S. Drug Enforcement Administration"
    category="Government methods collection"
    url="https://www.dea.gov"
    sourceID="DEA"
    substances="252"
    factSheets="25"
    methods="33"
  />
  <DataSourceDetails
    sourceName="U.S. Environmental Protection Agency"
    category="Government methods collection"
    url="https://www.epa.gov/"
    sourceID="EPA, APPRIL, EPA MS Labs, EPA-ECM, EPA-OW, USEPA"
    substances="4304"
    factSheets="19903"
    methods="1897"
    spectra="537"
  />
  <DataSourceDetails
    sourceName="U.S. Geological Survey"
    category="Government methods collection"
    url="https://www.usgs.gov/"
    sourceID="USGS"
    substances="457"
    methods="11"
  />
  <DataSourceDetails
    sourceName="U.S. National Response Team"
    category="Open fact sheet collection"
    url="https://www.nrt.org"
    sourceID="NRT"
    substances="31"
    factSheets="20"
  />
  <DataSourceDetails
    sourceName="U.S. Occupational Safety & Health Administration"
    category="Government methods collection"
    url="https://www.osha.gov"
    sourceID="OSHA"
    substances="465"
    methods="327"
  />
  <DataSourceDetails
    sourceName="Waters"
    category="Vendor methods collection"
    url="https://www.waters.com/nextgen/us/en.html"
    sourceID="Waters"
    substances="1907"
    methods="262"
  />
  <DataSourceDetails
    sourceName="World Health Organization"
    category="International fact sheet collection"
    url="https://www.who.int"
    sourceID="WHO"
    substances="351"
    factSheets="286"
  />
  <br />
</template>

<script>
  import DataSourceDetails from '@/components/DataSourceDetails.vue'

  export default {
    components: {DataSourceDetails}
  }
</script>