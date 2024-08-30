<!--
  This component is used to organize links that go to various pages on the app.  It also contains a search bar for the
  general record search.

  This component takes no props.
-->

<template>
  <div class="nav-bar">
    <div class="nav-bar-left">
      <div style="text-align: start;">
        <router-link to="/" style="font-size: larger">AMOS</router-link>
        <div style="font-size: smaller">Version: 2024-08-30</div>
      </div>
      &emsp;
      <input @keyup.enter="go()" type="text" v-model="searchTerm" name="search-term" title="General search input field">
      <button @click="go()">Substance Search</button>
    </div>
    <div class="nav-bar-right">
      &emsp;
      <BNavItemDropdown text="Lists" class="nav-dropdown" style="background: #0e6993;">
        <BDropdownItem to="/analytical_qc_list">Analytical QC</BDropdownItem>
        <BDropdownItem to="/fact_sheet_list">Fact Sheets</BDropdownItem>
        <BDropdownItem to="/methods_list">Methods</BDropdownItem>
      </BNavItemDropdown>
      &emsp;
      <BNavItemDropdown text="Additional Searches" class="nav-dropdown">
        <BDropdownItem to="/batch_search">Batch Search</BDropdownItem>
        <BDropdownItem to="/classyfire_search">ClassyFire Search</BDropdownItem>
        <BDropdownItem to="/mass_spectrum_search">Mass Spectrum Search</BDropdownItem>
        <BDropdownItem to="/similar_structure_search">Similar Structure Search</BDropdownItem>
      </BNavItemDropdown>
      &emsp;
      <BNavItemDropdown text="Other Pages" class="nav-dropdown">
        <BDropdownItem to="/functional_class_visualization">Functional Class Visualization</BDropdownItem>
        <BDropdownItem to="/mass_spectrum_comparison">Mass Spectrum Comparison</BDropdownItem>
      </BNavItemDropdown>
      &emsp;
      <BNavItemDropdown text="About" class="nav-dropdown">
        <BDropdownItem to="/about">About this App</BDropdownItem>
        <BDropdownItem to="/contact">Contact Info</BDropdownItem>
        <BDropdownItem to="/data_sources">Data Sources</BDropdownItem>
        <BDropdownItem to="/related_applications">Related Applications</BDropdownItem>
        <BDropdownItem to="/release_notes">Release Notes</BDropdownItem>
      </BNavItemDropdown>
      &emsp;
      <button @click="store.showHeaderAndFooter = !store.showHeaderAndFooter">Toggle Header/Footer</button>
    </div>
  </div>
</template>

<script>
  import {BNavItemDropdown, BDropdownItem} from 'bootstrap-vue-next'

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
    },
    components: {BNavItemDropdown, BDropdownItem}
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

  .nav-bar-left {
    display: flex;
    align-items: center;
  }


  .nav-bar-right {
    display: flex;
    align-items: center;
  }

  .nav-bar a{
    color: white;
    text-decoration: none;
  }

  .nav-bar a:hover{
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