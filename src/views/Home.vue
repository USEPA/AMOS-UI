<!--
  This is the home page for the app.  Running a general search of the database can be done from here, but most other
  functionality should stay on other pages.

  There are no URL route or query parameters associated with this page.
-->

<template>
  <div class="home">
    <h1>Home Page</h1>
    <div>
      <p>
        AMOS (Analytical Methods & Open Spectra) is a web application that combines analytical chemistry data from multiple sources and of multiple
        types into a searchable database.  Use the search bar below to run a general search for a single substance, or use the links in the navigation
        bar above to access other functionality.  This application is easier to use on larger screens/windows.
      </p>
      <p>
        The search bar below (as well as the one in the navigation bar at the top) can be used to perform a general search of the database for all
        records pertaining to a substance.
      </p>
      <div style="display: flex">
        <input @keyup.enter="go_big_bar()" id="big-search-bar" name="big-search-bar" :placeholder="searchType == 'substances' ? 'Search name, InChIKey, DTXSID, or CASRN...' : 'Search record ID...'" size="60" v-model="bigBarSearchTerm">
        <BFormSelect v-model="searchType" :options="searchTypeOptions" size="sm" style="width: auto; padding: 0 2em 0 0.5em;"/>  <!-- width needs to be set to fix height issues for some reason -->
        <button @click="go_big_bar()">Search</button>
      </div>
      <div>
        <label><input type="radio" id="all-tab" v-model="initial_results_tab" value="all">All</label>
        &emsp;
        <label><input type="radio" id="methods-tab" v-model="initial_results_tab" value="method">Methods</label>
        &emsp;
        <label><input type="radio" id="mongraph-tab" v-model="initial_results_tab" value="fact sheet">Fact Sheets</label>
        &emsp;
        <label><input type="radio" id="spectrum-tab" v-model="initial_results_tab" value="spectrum">Spectra</label>
      </div>
      <div>
        <input type="checkbox" id="substring-search" v-model="substring_search">
        <label for="substring-search">Search by substring (name search only)</label>
      </div>
      <br />
      <p>Several other searches and views of data exist, and can be accessed by the navigation bar at the top.  These include:</p>
      <ul>
        <li>Searching for substances belonging to <router-link to="/classyfire_search">a given ClassyFire classification</router-link>.</li>
        <li>Searching for substances based on <router-link to="/partial_identifier_search">partial identifiers</router-link> like molecular formula, mass range, name substring, and the first block of the InChIKey.</li>
        <li>Finding <router-link to="/mass_spectrum_search">mass spectra</router-link> similar to a user-submitted one.</li>
        <li>Getting a <router-link to="/batch_search">listing of all records</router-link> for a set of substances.</li>
        <li>Finding methods and fact sheets related to <router-link to="/similar_structure_search">a given substance or a structurally similar one</router-link>.</li>
        <li>An interactive visualization for examining <router-link to="/functional_class_visualization">the functional use classes</router-link> of substances in methods and fact sheets.</li>
        <li>Filterable detailed lists of all <router-link to="/fact_sheet_list">fact sheets</router-link> and <router-link to="/methods_list">methods</router-link> available in the database.</li>
      </ul>
      <p>
        For more information about this app, see the <router-link to="/about">about</router-link> page or
        <a href="https://work.epa.gov/ccte/amos-analytical-methods-and-open-spectral-database-help">the manual</a>.
      </p>
    </div>
  </div>
</template>

<script>
  import {BFormSelect} from 'bootstrap-vue-next'

  export default {
    methods: {
      go_big_bar() {
        const search_term = this.bigBarSearchTerm.trim()
        if (this.substring_search) {
          this.$router.push(`/partial_identifier_search?substring_search=${search_term}`)
        }
        else if (this.searchType == "substances") {
          this.$router.push({
            path: `/search/${search_term}`,
            query: {initial_results_tab: this.initial_results_tab}
          })
        } else {
          this.$router.push(`/record_id_search/${encodeURI(search_term)}`)
        }
      }
    },
    data() {
      return {
        initial_results_tab: "all",
        substring_search: false,
        searchType: "substances",
        searchTypeOptions: [
          {value: "substances", text: "Substance"},
          {value: "ids", text: "Record ID"}
        ]
      }
    },
    components: {BFormSelect}
  }
</script>
