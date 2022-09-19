<template>
  <div class="home">
    <h1>Home Page</h1>
    <div class="about-this-app">
      <h3>About this app</h3>
      <p>This app will perform searches on a collection of publicly available data from several sources, and return a mixture of mass spectra, monographs, and methods concerning the searched compound.  Searches can be made on compound name, InChIKey, CAS number, or DTXSID.</p>
      <p>The database contains a mixture of data consisting of mass spectra, monograph reports, and writeups of analytical methods.  The search will return records of all three types, however certain ones can be hidden by default using the checkboxes below the search bar.</p>
      <div>
        <input id="big-search-bar" name="big-search-bar" placeholder="Search name, InChIKey, DTXSID, or CASRN..." size="60" v-model="bigBarSearchTerm">
        <button @click="go_big_bar()">Search</button>
      </div>
      <div>
        <input type="checkbox" id="methods-check" v-model="methods">
        <label for="methods-check">Methods</label> &emsp;
        <input type="checkbox" id="mongraph-check" v-model="monographs">
        <label for="monograph-check">Monographs</label> &emsp;
        <input type="checkbox" id="spectra-check" v-model="spectra">
        <label for="spectra-check">Spectra</label>
      </div>
    </div>
  </div>
</template>

<script>

  import axios from 'axios';

  export default {
    methods: {
      go_big_bar() {
        const inchikeyRegex = /^([A-Z]{14})-[A-Z]{8}[SN][A-Z]-[A-Z]$/
        var matchResult = this.bigBarSearchTerm.match(inchikeyRegex)
        if (matchResult) {
          this.$router.push({
            path: `/find_inchikeys/${this.bigBarSearchTerm}`,
            query: {methods: this.methods, monographs: this.monographs, spectra: this.spectra}
          })
          
        } else {
          this.go_to_search_page()
        }
      },
      go_to_search_page() {
        this.$router.push({
          path: `/search/${this.bigBarSearchTerm}`,
          query: {methods: this.methods, monographs: this.monographs, spectra: this.spectra}
        })
      }
    },
    data() {
      return {
        methods: true,
        monographs: true,
        spectra: true
      }
    }
  }
</script>
