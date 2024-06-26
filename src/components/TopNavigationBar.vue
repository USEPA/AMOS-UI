<!--
  This component is used to organize links that go to various pages on the app.  It also contains a search bar for the
  general record search.

  This component takes no props.
-->

<template>
  <div class="nav-bar">
    <div class="nav-bar-left">
      <input @keyup.enter="go()" type="text" v-model="searchTerm" name="search-term" title="General search input field">
      <button @click="go()">Substance Search</button>
    </div>
    <div class="nav-bar-right">
      <router-link to="/" style="padding: 1px">Home</router-link>
      &emsp;
      <b-nav-item-dropdown text="Lists" class="nav-dropdown" style="background: #0e6993;">
        <b-dropdown-item to="/analytical_qc_list">Analytical QC</b-dropdown-item>
        <b-dropdown-item to="/fact_sheet_list">Fact Sheets</b-dropdown-item>
        <b-dropdown-item to="/methods_list">Methods</b-dropdown-item>
      </b-nav-item-dropdown>
      &emsp;
      <b-nav-item-dropdown text="Additional Searches" class="nav-dropdown">
        <b-dropdown-item to="/batch_search">Batch Search</b-dropdown-item>
        <b-dropdown-item to="/classification_search">Classification Search</b-dropdown-item>
        <b-dropdown-item to="/mass_spectrum_search">Mass Spectrum Search</b-dropdown-item>
        <b-dropdown-item to="/similar_method_search">Similar Method Search</b-dropdown-item>
      </b-nav-item-dropdown>
      &emsp;
      <b-nav-item-dropdown text="Other Pages" class="nav-dropdown">
        <b-dropdown-item to="/analyte_visualization">Analyte Visualization</b-dropdown-item>
        <b-dropdown-item to="/mass_spectrum_comparison">Mass Spectrum Comparison</b-dropdown-item>
      </b-nav-item-dropdown>
      &emsp;
      <b-nav-item-dropdown text="About" class="nav-dropdown">
        <b-dropdown-item to="/about">About this App</b-dropdown-item>
        <b-dropdown-item to="/contact">Contact Info</b-dropdown-item>
        <b-dropdown-item to="/data_sources">Data Sources</b-dropdown-item>
        <b-dropdown-item to="/related_applications">Related Applications</b-dropdown-item>
        <b-dropdown-item to="/release_notes">Release Notes</b-dropdown-item>
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
        this.$router.push(`/search/${this.searchTerm}`)
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
    line-height: 1;
    text-align: center;
    margin-bottom: 10px;
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