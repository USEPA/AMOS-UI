<template>
  <p v-if="exact_match">An exact match for the InChIKey "{{ searchedKey }}" was found.  However, several other InChIKeys with the same first block were discovered, if you were looking for one of those.  Click on the InChIKey to be directed to search results for that substance.</p>
  <p v-else>An exact match for the InChIKey "{{ searchedKey }}" was not found.  However, several other InChIKeys with the same first block were discovered, if you were looking for one of those.  Click on the InChIKey to be directed to search results for that substance.</p>
  <p>MATCHES: </p>
  <div class="compound-grid">
    <div v-for="s in substances">
      <CompoundTile :dtxsid="`${s.dtxsid}`" :preferred_name="`${s.preferred_name}`" />
      <p>{{s.jchem_inchikey}}</p>
      <p>{{ s.indigo_inchikey }}</p>
      <button @click="selectInchikey(s.dtxsid)">Select</button>
    </div>
  </div>
</template>

<script>
  import CompoundTile from '@/components/CompoundTile.vue'
  export default {

    data() {
      return {
        exact_match: false,
      }
    },
    created() {
      const jchem_inchikeys = this.substances.map(x => x.jchem_inchikey)
      const indigo_inchikeys = this.substances.map(x => x.indigo_inchikey)
      if (jchem_inchikeys.includes(this.searchedKey) || indigo_inchikeys.includes(this.searchedKey)) {
        this.exact_match = true
      }
    },
    methods: {
      selectInchikey(dtxsid) {
        this.$emit("inchikeySelected", dtxsid)
      }
    },
    props: {substances: Object, searchedKey: String},
    components: {CompoundTile}
  }
</script>

<style>
  .compound-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: left;
  }
</style>