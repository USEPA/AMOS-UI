<!--
  This page is meant as a developer-only page for testing visualizations or other components before trying to integrate
  them into other code.  The last work was oriented towards getting the NTA metadata visualization working; this page
  showed the old version, while TestViz2 showed the rebuilt version.
-->

<template>
  <p>Hello there.</p>
  <p>These are paragraphs to check how something deals with arbitrary offsets.</p>
  <NTAMetadataVisualization v-if="showplot===true" :csvString="csvString"/>
</template>


<script>
  import NTAMetadataVisualization from '@/components/NTAMetadataVisualization.vue';
  
  export default {
    data() {
      return {
        json_data: {},
        csvString: "",
        showplot: false
      }
    },
    components: { NTAMetadataVisualization },
    async created() {
      const dataPath = "/src/short_test.csv";
      //const dataPath = "/src/data_with_MS2.csv";
      //const dataPath = "/src/data_without_MS2.csv";
      const response = await fetch(dataPath);
      this.csvString = await response.text();

      // access data from desired tracer detection sheet and write to json object
      //const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
      //this.workbook = workbook
      this.showplot = true
    }
  }
</script>