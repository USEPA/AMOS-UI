<!--
  This page is meant as a developer-only page for testing visualizations or other components before trying to integrate
  them into other code.  The last work was oriented towards getting the NTA metadata visualization working; this page
  showed the rebuilt version, while TestViz showed the original version.
-->

<template>
  <p>Hello there.</p>
  <p>These are paragraphs to check how something deals with arbitrary offsets.</p>
  <NTAMetadataVisualizationNew v-if="showplot===true" :csvString="csvString" />
</template>


<script>

  import XLSX from 'xlsx'

  import NTAMetadataVisualizationNew from '../components/NTAMetadataVisualizationNew.vue';
  
  export default {
    data() {
      return {
        json_data: {},
        csvString: "",
        showplot: false
      }
    },
    components: { NTAMetadataVisualizationNew },
    async created() {
      const response = await fetch("/src/short_test.csv");
      this.csvString = await response.text();

      // access data from desired tracer detection sheet and write to json object
      //const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
      //this.workbook = workbook
      this.showplot = true
    }
  }
</script>