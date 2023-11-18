<!--
  This is the home page for the app.  Running a general search of the database can be done from here, but most other
  functionality should stay on other pages.

  There are no URL route or query parameters associated with this page.
-->

<template>
  <div class="home">
    <h1>Home Page</h1>
    <div class="about-this-app">
      <p>
        AMOS (Analytical Spectra & Open Methods) is a web application that combines analytical chemistry data from multiple sources and of multiple
        types into a searchable database.  Use the search bar below to run a general search for a single substance, or use the links in the navigation
        bar above to access other functionality.  This application is easier to use on larger screens/windows.
      </p>
      <p>For more information about this app, see the <router-link to="/about">about</router-link> page.</p>
      <div>
        <input @keyup.enter="go_big_bar()" id="big-search-bar" name="big-search-bar" placeholder="Search name, InChIKey, DTXSID, or CASRN..." size="60" v-model="bigBarSearchTerm">
        <button @click="go_big_bar()">Substance Search</button>
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
        <input type="checkbox" id="susbtring-search" v-model="substring_search">
        <label for="susbtring-search">Search by substring (name only)</label>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    methods: {
      go_big_bar() {
        const search_term = this.bigBarSearchTerm.trim()
        if (this.substring_search) {
          this.$router.push({path: `/substring_search/${search_term}`})
        }
        else {
          this.$router.push({
            path: `/search/${search_term}`,
            query: {initial_results_tab: this.initial_results_tab}
          })
        }
      }
    },
    data() {
      return {
        initial_results_tab: "all",
        substring_search: false
      }
    }
  }
</script>
