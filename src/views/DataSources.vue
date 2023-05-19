<template>
  This page is meant to give descriptions of the various data sources combined in this application.  It is just a placeholder for now.
  <br /><br />
  <DataSourceDetails
    sourceName="MassBank Europe"
    category="Open Spectral Database"
    url="https://massbank.eu/MassBank/"
    sourceID="MassBank EU"
    substances="12256"
    spectra="81884"
  />
  <br />
</template>

<script>
  import DataSourceDetails from '@/components/DataSourceDetails.vue'

  export default {
    components: {DataSourceDetails}
  }
</script>