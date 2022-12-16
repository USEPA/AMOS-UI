<template>
  <div class="home">
    <h1>Home Page</h1>
    <div class="about-this-app">
      <p>The search will return records of all three types -- spectra, monographs, and methods.  The initial tab shown can be selected with the radio buttons below.</p>
      <div>
        <input @keyup.enter="go_big_bar()" id="big-search-bar" name="big-search-bar" placeholder="Search name, InChIKey, DTXSID, or CASRN..." size="60" v-model="bigBarSearchTerm">
        <button @click="go_big_bar()">Search</button>
      </div>
      <div>
        <label><input type="radio" id="all-tab" v-model="initial_results_tab" value="all">All</label>
        &emsp;
        <label><input type="radio" id="methods-tab" v-model="initial_results_tab" value="method">Methods</label>
        &emsp;
        <label><input type="radio" id="mongraph-tab" v-model="initial_results_tab" value="monograph">Monographs</label>
        &emsp;
        <label><input type="radio" id="spectrum-tab" v-model="initial_results_tab" value="spectrum">Spectra</label>
      </div>
    </div>
    <br />
    For more information about this app, see the <router-link to="/about">about</router-link> page.
  </div>
</template>

<script>
  export default {
    methods: {
      go_big_bar() {
        const search_term = this.bigBarSearchTerm.trim()
        const inchikeyRegex = /^([A-Z]{14})-[A-Z]{8}[SN][A-Z]-[A-Z]$/
        var matchResult = search_term.match(inchikeyRegex)
        if (matchResult) {
          this.$router.push({
            path: `/find_inchikeys/${search_term}`,
            query: {initial_results_tab: this.initial_results_tab}
          })
          
        } else {
          this.$router.push({
            path: `/search/${search_term}`,
            query: {initial_results_tab: this.initial_results_tab}
          })
        }
      }
    },
    data() {
      return {
        initial_results_tab: "all"
      }
    }
  }
</script>
