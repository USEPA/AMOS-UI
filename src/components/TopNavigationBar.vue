<!--
  This component is used to organize links that go to various pages on the app.  It also contains a search bar for the
  general record search.

  This component takes no props.
-->

<template>
  <div class="nav-bar">
    <div class="nav-bar-left">
      <input @keyup.enter="go()" type="text" v-model="searchTerm" name="search-term">
      <button @click="go()">Compound Search</button>
    </div>
    <div class="nav-bar-right">
      <router-link to="/">Home</router-link>
      &emsp;
      <b-nav-item-dropdown text="Lists" class="nav-dropdown" style="background: #0e6993;">
        <b-dropdown-item to="/monograph_list">Monographs</b-dropdown-item>
        <b-dropdown-item to="/methods_list">Methods</b-dropdown-item>
      </b-nav-item-dropdown>
      &emsp;
      <router-link to="/similar_method_search">Similar Method Search</router-link>
      &emsp;
      <router-link to="/batch_search">Batch Search</router-link>
      &emsp;
      <b-nav-item-dropdown text="Related Applications" class="nav-dropdown">
        <b-dropdown-item href="http://v2626umcth819.rtord.epa.gov:9414/" target="_blank" class="normal-text">Chemical Transformations Database</b-dropdown-item>
        <b-dropdown-item href="http://v2626umcth819.rtord.epa.gov:81/substances" target="_blank">Analytical QC</b-dropdown-item>
        <b-dropdown-item href="http://v2626umcth819.rtord.epa.gov:9004/molmass_web.py" target="_blank">Molecular Mass Calculator</b-dropdown-item>
        <b-dropdown-item href="https://aop-dev.rtpnc.epa.gov/nta-ui/nta.html" target="_blank">CFM-ID Spectral Search</b-dropdown-item>
        <b-dropdown-item href="https://comptox.epa.gov/dashboard/" target="_blank">CompTox Chemicals Dashboard</b-dropdown-item>
        <b-dropdown-item href="https://comptox.epa.gov/genra/" target="_blank">Generalized Read-Across (GenRA)</b-dropdown-item>
        <b-dropdown-item href="https://comptox.epa.gov/dashboard/chemical/pubmed-abstract-sifter/" target="_blank">Literature Abstract Sifter</b-dropdown-item>
        <b-dropdown-item href="https://www.epa.gov/chemical-research/cheminformatics" target="_blank">Cheminformatics PoC Modules</b-dropdown-item>
      </b-nav-item-dropdown>
      &emsp;
      <router-link to="/about">About this App</router-link>
      &emsp;
      <b-nav-item-dropdown text="Other Pages" class="nav-dropdown">
        <b-dropdown-item to="/spectrum_comparison">Spectrum Comparison</b-dropdown-item>
        <b-dropdown-item to="/spectrum_search">Spectrum Search</b-dropdown-item>
      </b-nav-item-dropdown>
      &emsp;
      <button @click="store.showHeaderAndFooter = !store.showHeaderAndFooter">Toggle Header/Footer</button>
    </div>
  </div>
</template>

<script>
  import {store} from "@/assets/store.js"

  export default {
    methods: {
      go() {
        this.searchTerm = this.searchTerm.trim()
        const inchikeyRegex = /^([A-Z]{14})-[A-Z]{8}[SN][A-Z]-[A-Z]$/
        var matchResult = this.searchTerm.match(inchikeyRegex)
        if (matchResult) {
          this.$router.push(`/find_inchikeys/${this.searchTerm}`)
        } else {
          this.$router.push(`/search/${this.searchTerm}`)
        }
      }
    },
    data() {
      return {
        store
      };
    }
}
</script>

<style>
  .nav-bar {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    background: #0e6993;
    color: white;
    font-family: Roboto;
    line-height: 1;
    text-align: center;
  }

  .nav-bar-right {
    display: flex;
    align-items: center;
  }

  .nav-bar-right a{
    color: white;
    text-decoration: none;
  }

  .nav-bar-right a:hover{
    color: white;
    text-decoration: underline;
  }

  .nav-dropdown {
    background: #0e6993;
    display: flex;
    float: left;
    color: white;
  }

  .nav-dropdown a{
    color: black;
  }

  .nav-dropdown a:hover{
    color: black;
    text-decoration: none
  }
</style>