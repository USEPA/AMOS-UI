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
      <router-link to="/similar_method_search">Similar Method Search</router-link> &emsp;
      <b-nav-item-dropdown text="Related Applications" class="nav-dropdown">
        <b-dropdown-item href="http://v2626umcth819.rtord.epa.gov:9414/" class="normal-text">Chemical Transformations Database</b-dropdown-item>
        <b-dropdown-item href="http://v2626umcth819.rtord.epa.gov:81/substances">Analytical QC</b-dropdown-item>
        <b-dropdown-item href="http://v2626umcth819.rtord.epa.gov:5173/">Spectral and Methods Database</b-dropdown-item>
        <b-dropdown-item href="http://v2626umcth819.rtord.epa.gov:9004/molmass_web.py">Molecular Mass Calculator</b-dropdown-item>
      </b-nav-item-dropdown>
      &emsp;
      <router-link to="/about">About this App</router-link>
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
        console.log(this.searchTerm)
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

  .nav-dropdown {
    background: #0e6993;
    display: flex;
    float: left;
    color: white;
  }

  .nav-dropdown a{
    color: black;
  }
</style>