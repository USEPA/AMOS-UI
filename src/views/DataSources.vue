<!--
  This page is meant to list off the major data sources in the app.  Sources that add only one or a few methods to the
  database are excluded, as this page would become rather lengthy otherwise.

  This page takes no route or query parameters.
-->

<template>
  This page is meant to give descriptions of the various data sources combined in this application.  It is just a placeholder for now.
  <br /><br />
  <DataSourceDetails 
    sourceName="Agilent"
    category="Vendor methods collection"
    url="https://www.agilent.com"
    sourceID="Agilent"
    substances="735"
    methods="58"
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
    sourceName="Center for Forensic Science Research & Education"
    category="Open monographs collection"
    url="https://www.cfsre.org/nps-discovery/monographs"
    sourceID="CFSRE"
    substances="148"
    monographs="138"
  />
  <DataSourceDetails 
    sourceName="Centers for Disease Control and Prevention"
    category="Government methods collection"
    url="http://v2626umcth819.rtord.epa.gov:81/substances"
    sourceID="CDC"
    substances="364"
    methods="25"
  />
  <DataSourceDetails 
    sourceName="Jozef Stefan Institute"
    category="Academic methods & spectra collection"
    url="https://www.ijs.si/ijsw/JSI"
    sourceID="Jozef Stefan Institute"
    substances="104"
    spectra="5080"
    methods="1"
  />
  <DataSourceDetails
    sourceName="MassBank Europe"
    category="Open-access spectral database"
    url="https://massbank.eu/MassBank/"
    sourceID="MassBank EU"
    substances="12256"
    spectra="81884"
  />
  <DataSourceDetails 
    sourceName="MassBank of North America"
    category="Open-access spectral database"
    url="https://mona.fiehnlab.ucdavis.edu"
    sourceID="MoNA"
    substances="8491"
    spectra="54744"
  />
  <DataSourceDetails 
    sourceName="National Environmental Methods Index"
    category="Government methods collection"
    url="https://www.nemi.gov/home"
    sourceID="NEMI"
    substances="698"
    methods="56"
  />
  <DataSourceDetails 
    sourceName="National Institute of Standards and Technology"
    category="Government methods collection"
    url="https://www.nist.gov/"
    sourceID="NIST"
    substances="573"
    methods="42"
  />
  <DataSourceDetails 
    sourceName="Scientific Working Group for the Analysis of Seized Drugs"
    category="Open spectrum and monographs collection"
    url="https://www.swgdrug.org/"
    sourceID="SWG"
    substances="3413"
    spectra="3276"
    monographs="515"
  />
  <DataSourceDetails
    sourceName="SCIEX"
    category="Vendor methods collection"
    url="https://sciex.com/"
    sourceID="SCIEX"
    substances="274"
    methods="15"
  />
  <DataSourceDetails 
    sourceName="SpectraBase"
    category="Spectrum database (spectra are not open, metadata is)"
    url="https://spectrabase.com/"
    sourceID="SpectraBase"
    substances="149675"
    spectra="590767"
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
    substances="847"
    methods="60"
  />
  <DataSourceDetails 
    sourceName="U.S. Geological Survey"
    category="Government methods collection"
    url="https://www.usgs.gov/"
    sourceID="USGS"
    substances="456"
    methods="10"
  />
  <br />
</template>

<script>
  import DataSourceDetails from '@/components/DataSourceDetails.vue'

  export default {
    components: {DataSourceDetails}
  }
</script>