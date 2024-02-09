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
    factSheets="181"
    methods="40"
  />
  <DataSourceDetails
    sourceName="Agilent"
    category="Vendor methods collection"
    url="https://www.agilent.com"
    sourceID="Agilent"
    substances="3723"
    methods="385"
    spectra="72"
  />
  <DataSourceDetails
    sourceName="Analytical QC"
    category="EPA-internal spectrum collection"
    url="https://ccte-cced-aqcv2.epa.gov/"
    sourceID="Analytical QC"
    substances="9305"
    spectra="39523"
  />
  <DataSourceDetails
    sourceName="Cayman Spectral Library"
    category="Open-access spectrum collection"
    url="https://www.caymanchem.com/forensics/publications/csl"
    sourceID="Cayman"
    substances="2203"
    spectra="2294"
  />
  <DataSourceDetails
    sourceName="Center for Forensic Science Research & Education"
    category="Open monographs collection"
    url="https://www.cfsre.org/nps-discovery/monographs"
    sourceID="CFSRE"
    substances="92"
    factSheets="82"
  />
  <DataSourceDetails
    sourceName="Centers for Disease Control and Prevention"
    category="Government methods collection"
    url="https://www.cdc.gov/index.htm"
    sourceID="CDC"
    substances="2399"
    factSheets="677"
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
    substances="722"
    methods="56"
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
    substances="3815"
    spectra="43596"
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
    substances="1427"
    methods="65"
  />
  <DataSourceDetails
    sourceName="MassBank Europe"
    category="Open-access spectral database"
    url="https://massbank.eu/MassBank/"
    sourceID="MassBank EU"
    substances="14273"
    spectra="109765"
  />
  <DataSourceDetails
    sourceName="MassBank of North America"
    category="Open-access spectral database"
    url="https://mona.fiehnlab.ucdavis.edu"
    sourceID="MoNA"
    substances="7228"
    spectra="49580"
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
    substances="893"
    methods="59"
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
    substances="3399"
    factSheets="479"
    spectra="3319"
  />
  <DataSourceDetails
    sourceName="SCIEX"
    category="Vendor methods collection"
    url="https://sciex.com/"
    sourceID="SCIEX"
    substances="708"
    methods="52"
  />
  <DataSourceDetails
    sourceName="Shimadzu"
    category="Vendor methods collection"
    url="https://www.shimadzu.com"
    sourceID="Shimadzu"
    substances="4229"
    methods="611"
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
    substances="3531"
    factSheets="1456"
    methods="1878"
    spectra="417"
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