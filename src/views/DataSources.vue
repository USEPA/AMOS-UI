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
    substances="856"
    methods="40"
  />
  <DataSourceDetails
    sourceName="Agilent"
    category="Vendor methods collection"
    url="https://www.agilent.com"
    sourceID="Agilent"
    substances="2555"
    methods="244"
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
    substances="1757"
    spectra="1818"
  />
  <DataSourceDetails
    sourceName="Center for Forensic Science Research & Education"
    category="Open monographs collection"
    url="https://www.cfsre.org/nps-discovery/monographs"
    sourceID="CFSRE"
    substances="148"
    factSheets="138"
  />
  <DataSourceDetails
    sourceName="Centers for Disease Control and Prevention"
    category="Government methods collection"
    url="https://www.cdc.gov/index.htm"
    sourceID="CDC"
    substances="364"
    methods="25"
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
    substances="12313"
    spectra="82343"
  />
  <DataSourceDetails
    sourceName="MassBank of North America"
    category="Open-access spectral database"
    url="https://mona.fiehnlab.ucdavis.edu"
    sourceID="MoNA"
    substances="7156"
    spectra="48564"
  />
  <DataSourceDetails
    sourceName="National Environmental Methods Index"
    category="Government methods collection"
    url="https://www.nemi.gov/home"
    sourceID="NEMI"
    substances="1700"
    methods="151"
  />
  <DataSourceDetails
    sourceName="National Institute for Occupational Safety and Health"
    category="Government methods collection"
    url="https://www.cdc.gov.niosh/index.htm"
    sourceID="NIOSH"
    substances="295"
    methods="71"
  />
  <DataSourceDetails
    sourceName="National Institute of Standards and Technology"
    category="Government methods collection"
    url="https://www.nist.gov/"
    sourceID="NIST"
    substances="752"
    methods="50"
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
    sourceName="Scientific Working Group for the Analysis of Seized Drugs"
    category="Open spectrum and monographs collection"
    url="https://www.swgdrug.org/"
    sourceID="SWG"
    substances="3450"
    factSheets="515"
    spectra="3319"
  />
  <DataSourceDetails
    sourceName="SCIEX"
    category="Vendor methods collection"
    url="https://sciex.com/"
    sourceID="SCIEX"
    substances="639"
    methods="33"
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
    substances="366"
    methods="45"
  />
  <DataSourceDetails
    sourceName="U.S. Environmental Protection Agency"
    category="Government methods collection"
    url="https://www.epa.gov/"
    sourceID="USEPA"
    substances="983"
    methods="72"
  />
  <DataSourceDetails
    sourceName="U.S. Geological Survey"
    category="Government methods collection"
    url="https://www.usgs.gov/"
    sourceID="USGS"
    substances="457"
    methods="11"
  />
  <br />
</template>

<script>
  import DataSourceDetails from '@/components/DataSourceDetails.vue'

  export default {
    components: {DataSourceDetails}
  }
</script>