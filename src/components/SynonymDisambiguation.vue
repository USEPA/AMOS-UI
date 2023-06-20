<!--
  This component is meant to be used as a modal dialog box when a compound search returns multiple compounds with the
  same synonym.  It is essentially a list of information about the individual compounds, and clicking on one of the
  information boxes will fire an event that the parent page can capture and act upon.

  This component takes three props:
  - synonym: the searched synonym.
  - substances: an object containing a list of compounds from the database.  Individual elements should have the
  elements needed by the Disambiguation component.
  - record_info: an object containing information on how many records of each type exist for each substance.  Keys to
  the top-level object are DTXSIDs, while the values are other dictionaries containing the result types.
-->

<template>
  <p>The searched term "{{ synonym }}" is a synonym for multiple substances.  Click on a substance below to see its results in the database.</p>
  <div class="compound-grid" v-for="s in substances">
    <DisambiguationInfo :substance_info="s" :record_info="record_counts[s.dtxsid]" @click="selectSynonym(s.dtxsid)" />
  </div>
</template>
  
<script>
  import CompoundTile from '@/components/CompoundTile.vue'
  import DisambiguationInfo from '@/components/DisambiguationInfo.vue'

  export default {
    data() {
      return {
        x: false,
      }
    },
    created() {
      1
    },
    methods: {
      selectSynonym(dtxsid) {
        this.$emit("synonymSelected", dtxsid)
      }
    },
    props: {substances: Object, synonym: String, record_counts: Object},
    components: {CompoundTile, DisambiguationInfo}
  }
</script>

<style>
  .compound-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: left;
  }
</style>