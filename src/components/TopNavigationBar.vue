<!--
  This component is used to organize links that go to various pages on the app.  It also contains a search bar for the
  general search.

  This component takes no props.
-->

<template>
  <div class="nav-bar">
    <div class="nav-bar-left">
      <div style="text-align: start;">
        <router-link to="/" style="font-size: larger">AMOS</router-link>
        <div style="font-size: smaller">Version: 2025-04-02</div>
      </div>
      &emsp;
      <input v-model="searchTerm" name="search-term" title="General search input field" type="text" @keyup.enter="go()">
      <BFormSelect v-model="searchType" :options="searchTypeOptions" size="sm"
                   style="width: auto; padding: 0 2em 0 0.5em;"/>
      <!-- width needs to be set to fix height issues for some reason -->
      <button @click="go()">Search</button>
    </div>
    <div class="nav-bar-right">
      &emsp;
      <BNavItemDropdown class="nav-dropdown" text="Lists">
        <BDropdownItem to="/analytical_qc_list">Analytical QC</BDropdownItem>
        <BDropdownItem to="/fact_sheet_list">Fact Sheets</BDropdownItem>
        <BDropdownItem to="/methods_list">Methods</BDropdownItem>
      </BNavItemDropdown>
      &emsp;
      <BNavItemDropdown class="nav-dropdown" text="Additional Searches">
        <BDropdownItem to="/batch_search">Batch Search</BDropdownItem>
        <BDropdownItem to="/classyfire_search">ClassyFire Search</BDropdownItem>
        <BDropdownItem to="/partial_identifier_search">Formula, Mass, & Partial Identifier Search</BDropdownItem>
        <BDropdownItem to="/mass_spectrum_search">Mass Spectrum Search</BDropdownItem>
        <BDropdownItem to="/similar_structure_search">Similar Structure Search</BDropdownItem>
      </BNavItemDropdown>
      &emsp;
      <BNavItemDropdown v-if="store.internalDeployment" class="nav-dropdown" text="INTERPRET NTA">
        <BDropdownItem to="/nta_home">NTA Home</BDropdownItem>
        <BDropdownItem to="/ms1_nta/submit">MS1 Job Submission</BDropdownItem>
      </BNavItemDropdown>
      &emsp;
      <BNavItemDropdown class="nav-dropdown" text="Other Pages">
        <BDropdownItem to="/functional_class_visualization">Functional Class Visualization</BDropdownItem>
        <BDropdownItem to="/mass_spectrum_comparison">Mass Spectrum Comparison</BDropdownItem>
        <BDropdownItem to="/soil_ternary_plot">Soil Ternary Plot</BDropdownItem>
      </BNavItemDropdown>
      &emsp;
      <BNavItemDropdown class="nav-dropdown" text="About">
        <BDropdownItem to="/about">About this App</BDropdownItem>
        <BDropdownItem to="/contact">Contact Info</BDropdownItem>
        <BDropdownItem to="/data_sources">Data Sources</BDropdownItem>
        <BDropdownItem v-if="store.internalDeployment" to="/related_applications">Related Applications</BDropdownItem>
        <BDropdownItem to="/release_notes">Release Notes</BDropdownItem>
      </BNavItemDropdown>
      &emsp;
      <button @click="store.showHeaderAndFooter = !store.showHeaderAndFooter">Toggle Header/Footer</button>
    </div>
  </div>
</template>

<script>
import {BDropdownItem, BFormSelect, BNavItemDropdown} from 'bootstrap-vue-next'

import {store} from "@/assets/store.js"

export default {
  data() {
    return {
      store,
      searchTerm: "",
      searchType: "substances",
      searchTypeOptions: [
        {value: "substances", text: "Substance"},
        {value: "ids", text: "Record ID"}
      ]
    };
  },
  methods: {
    go() {
      this.searchTerm = this.searchTerm.trim()
      if (this.searchType === "substances") {
        this.$router.push(`/search/${this.searchTerm}`)
      } else {
        this.$router.push(`/record_id_search/${encodeURI(this.searchTerm)}`)
      }
    }
  },
  components: {BNavItemDropdown, BDropdownItem, BFormSelect}
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

.nav-bar a {
  color: white;
  text-decoration: none;
}

.nav-bar a:hover {
  color: white;
  text-decoration: underline;
}

.nav-dropdown {
  background: #0e6993;
  display: flex;
  float: left;
  color: white;
}

.nav-dropdown a {
  color: black;
}

.nav-dropdown a:hover {
  color: black;
  text-decoration: none
}

.search-type-selector {
  background-color: #0e6993;
  color: white;
}
</style>