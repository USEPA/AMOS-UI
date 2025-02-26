<!--
  This component is meant to be used as a modal dialog box when an InChIKey search returns multiple substances with the
  same first block.  It is essentially a list of information about the individual substances, and clicking on one of the
  information boxes will fire an event that the parent page can capture and act upon.  If there is an exact match to the
  searched InChIKey, that will be highlighted by moving it to the top of the result list.

  This component takes three props:
  - searched_key: the searched InChIKey.
  - substances: an object containing a list of substances from the database.  Individual elements should have the
  elements needed by the DisambiguationInfo component.
  - record_info: an object containing information on how many records of each type exist for each substance.  Keys to
  the top-level object are DTXSIDs, while the values are other dictionaries containing the result types.
-->

<template>
  <p v-if="exact_match">An exact match for the InChIKey "{{ searchedKey }}" was found.  However, several other InChIKeys with the same first block were discovered, if you were looking for one of those.  Click on the InChIKey to be directed to search results for that substance.</p>
  <p v-else>An exact match for the InChIKey "{{ searchedKey }}" was not found.  However, several other InChIKeys with the same first block were discovered, if you were looking for one of those.  Click on the InChIKey to be directed to search results for that substance.</p>
  <div style="display: flex; flex-direction: column;">
    <div style="display: flex; flex-direction: column;" v-if="exact_match">
      <h4>EXACT MATCH:</h4>
      <br />
      <DisambiguationInfo :substance_info="exact_match" :record_info="record_counts[exact_match.dtxsid]" @click="selectInchikey(exact_match.dtxsid)" />
      <br />
      <h4>PARTIAL MATCHES:</h4>
      <br />
    </div>
    <div class="substance-grid" v-for="s in non_exact_matches">
      <DisambiguationInfo :substance_info="s" :record_info="record_counts[s.dtxsid]" @click="selectInchikey(s.dtxsid)" />
    </div>
  </div>
</template>

<script>
  import { sortSubstancesByRecordCount } from '@/assets/common_functions.js'
  import DisambiguationInfo from '@/components/DisambiguationInfo.vue'

  export default {

    data() {
      return {
        substance_list: [],
        exact_match: null,
        non_exact_matches: null
      }
    },
    updated() {
      // this function seems to be needed (as opposed to the usual "created()" or something else) to properly get the
      // component to show the case where an exact match for the searched InChIKey exists
      this.substance_list = sortSubstancesByRecordCount(this.substances, this.record_counts)
      const jchem_inchikeys = this.substance_list.map(x => x.jchem_inchikey)
      const indigo_inchikeys = this.substance_list.map(x => x.indigo_inchikey)
      if (jchem_inchikeys.includes(this.searchedKey) || indigo_inchikeys.includes(this.searchedKey)) {
        const match_index = this.substance_list.findIndex(s => s.jchem_inchikey==this.searchedKey || s.indigo_inchikey==this.searchedKey)
        this.exact_match = this.substance_list.splice(match_index, 1)[0]
      }
      this.non_exact_matches = this.substance_list
    },
    methods: {
      selectInchikey(dtxsid) {
        this.$emit("inchikeySelected", dtxsid)
      }
    },
    props: {substances: Object, searchedKey: String, record_counts: Object},
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