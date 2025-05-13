<!--
  This component is meant to be used as a modal dialog box when a substance search returns multiple substances with the
  same synonym.  It is essentially a list of information about the individual substances, and clicking on one of the
  information boxes will fire an event that the parent page can capture and act upon.

  This component takes three props:
  - synonym: The searched synonym.  Required.
  - substances: An array of JSON objects, with each one containing information on a substance in the database.  See the
    DisambiguationInfo component for the necessary fields.  Required.
  - record_info: An object containing information on how many records of each type exist for each substance.  Keys to
    the top-level object are DTXSIDs, while the values are JSON objects containing the result types.
-->

<template>
  <p>The searched term "{{ synonym }}" is a synonym for multiple substances.  Click on a substance below to see its results in the database.</p>
  <div class="substance-grid" v-for="s in substance_list">
    <DisambiguationInfo :substance_info="s" :record_info="record_counts[s.dtxsid]" @click="selectSynonym(s.dtxsid)" />
  </div>
</template>
  
<script>
  import { sortSubstancesByRecordCount } from '@/assets/common_functions.js'
  import DisambiguationInfo from '@/components/DisambiguationInfo.vue'

  export default {
    data() {
      return {
        substance_list: [],
        x: false,
      }
    },
    updated() {
      this.substance_list = sortSubstancesByRecordCount(this.substances, this.record_counts)
    },
    methods: {
      selectSynonym(dtxsid) {
        this.$emit("synonymSelected", dtxsid)
      }
    },
    props: {substances: {type: Object, required: true}, synonym: {type: String, required: true}, record_counts: Object},
    components: {DisambiguationInfo}
  }
</script>

<style>
  .substance-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: left;
  }
</style>