<!--
  This page is meant to list off the major data sources in the app.  Sources that add only one or a few methods to the
  database are excluded, as this page would become rather lengthy otherwise.

  This page takes no route or query parameters.
-->

<template>
  This page is meant to give descriptions of many of the data sources combined in this application.  Some sources with few records (one or two dozen, or less) are not listed here.
  <br /><br />
  <DataSourceDetails
    sourceName="Agency for Toxic Substances and Disease Registry"
    category="Government methods collection"
    url="https://www.atsdr.cdc.gov"
    sourceID="ATSDR"
    substances="1033"
    factSheets="181"
    methods="40"
  />
  <DataSourceDetails
    sourceName="Agilent"
    category="Vendor methods collection"
    url="https://www.agilent.com"
    sourceID="Agilent"
    substances="3640"
    methods="356"
  />
  <DataSourceDetails
    sourceName="Analytical QC"
    category="EPA-internal spectrum collection"
    url="http://v2626umcth819.rtord.epa.gov:81/substances"
    sourceID="Analytical QC"
    substances="9305"
    spectra="9305"
  />
  <DataSourceDetails
    sourceName="Cayman Spectral Library"
    category="Open-access spectrum collection"
    url="https://www.caymanchem.com/forensics/publications/csl"
    sourceID="Cayman"
    substances="2171"
    spectra="2260"
  />
  <DataSourceDetails
    sourceName="Center for Forensic Science Research & Education"
    category="Open monographs collection"
    url="https://www.cfsre.org/nps-discovery/monographs"
    sourceID="CFSRE"
    substances="84"
    factSheets="74"
  />
  <DataSourceDetails
    sourceName="Centers for Disease Control and Prevention"
    category="Government methods collection"
    url="https://www.cdc.gov/index.htm"
    sourceID="CDC"
    substances="1867"
    factSheets="24"
    methods="25"
  />
  <DataSourceDetails
    sourceName="Drug Enforcement Administration"
    category="Government methods collection"
    url="https://www.dea.gov"
    sourceID="DEA"
    substances="18"
    methods="33"
  />
  <DataSourceDetails
    sourceName="European Union Reference Laboratories"
    category="Open-access methods collection"
    url="https://www.eurl-pesticides.eu"
    sourceID="EURL"
    substances="733"
    methods="58"
  />
  <DataSourceDetails
    sourceName="Global Natural Products Social Molecular Networking"
    category="Open-access spectrum libraries"
    url="https://gnps.ucsd.edu"
    sourceID="GNPS"
    substances="1930"
    spectra="7820"
  />
  <DataSourceDetails
    sourceName="Human Metabolome Database"
    category="Open-access spectrum collection"
    url="https://hmdb.ca/"
    sourceID="HMDB"
    substances="4819"
    spectra="53315"
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
    sourceName="MassBank Europe"
    category="Open-access spectral database"
    url="https://massbank.eu/MassBank/"
    sourceID="MassBank EU"
    substances="13379"
    spectra="89021"
  />
  <DataSourceDetails
    sourceName="MassBank of North America"
    category="Open-access spectral database"
    url="https://mona.fiehnlab.ucdavis.edu"
    sourceID="MoNA"
    substances="7203"
    spectra="48787"
  />
  <DataSourceDetails
    sourceName="National Environmental Methods Index"
    category="Government methods collection"
    url="https://www.nemi.gov/home"
    sourceID="NEMI"
    substances="1565"
    methods="124"
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
    substances="870"
    methods="51"
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
    sourceName="New Jersey Department of Health"
    category="Government fact sheet collection"
    url="https://www.nj.gov/health"
    sourceID="NJDOH"
    substances="1626"
    factSheets="1626"
  />
  <DataSourceDetails
    sourceName="Scientific Working Group for the Analysis of Seized Drugs"
    category="Open spectrum and monographs collection"
    url="https://www.swgdrug.org/"
    sourceID="SWG"
    substances="3397"
    factSheets="471"
    spectra="3319"
  />
  <DataSourceDetails
    sourceName="SCIEX"
    category="Vendor methods collection"
    url="https://sciex.com/"
    sourceID="SCIEX"
    substances="712"
    methods="54"
  />
  <DataSourceDetails
    sourceName="Shimadzu"
    category="Vendor methods collection"
    url="https://www.shimadzu.com"
    sourceID="Shimadzu"
    substances="2367"
    methods="342"
  />
  <DataSourceDetails
    sourceName="SpectraBase"
    category="Spectrum database (spectra are not open, metadata is)"
    url="https://spectrabase.com/"
    sourceID="SpectraBase"
    substances="149764"
    spectra="590943"
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
    sourceName="U.S. Environmental Protection Agency"
    category="Government methods collection"
    url="https://www.epa.gov/"
    sourceID="EPA, EPA MS Labs, EPA-ECM, EPA-OW, USEPA"
    substances="3292"
    factSheets="1049"
    methods="1864"
    spectra="470"
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
  <br />
</template>

<script>
  import DataSourceDetails from '@/components/DataSourceDetails.vue'

  export default {
    components: {DataSourceDetails}
  }
</script>