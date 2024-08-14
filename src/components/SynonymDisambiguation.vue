<!--
  This component is meant to be used as a modal dialog box when a substance search returns multiple substances with the
  same synonym.  It is essentially a list of information about the individual substances, and clicking on one of the
  information boxes will fire an event that the parent page can capture and act upon.

  This component takes three props:
  - synonym: the searched synonym.
  - substances: an object containing a list of substances from the database.  Individual elements should have the
  elements needed by the DisambiguationInfo component.
  - record_info: an object containing information on how many records of each type exist for each substance.  Keys to
  the top-level object are DTXSIDs, while the values are other dictionaries containing the result types.
-->

<template>
  <p>The searched term "{{ synonym }}" is a synonym for multiple substances.  Click on a substance below to see its results in the database.</p>
  <div class="substance-grid" v-for="s in substance_list">
    <DisambiguationInfo :substance_info="s" :record_info="record_counts[s.dtxsid]" @click="selectSynonym(s.dtxsid)" />
  </div>
</template>
  
<script>
  import { sortSubstancesByRecordCount } from '@/assets/common_functions'
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
    props: {substances: Object, synonym: String, record_counts: Object},
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