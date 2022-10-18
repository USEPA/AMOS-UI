<template>
  <div class="nav-bar">
    <div class="nav-bar-left">
      <label for="search-term">Search</label> &nbsp;
      <input @keyup.enter="go()" type="text" v-model="searchTerm" name="search-term">
      <button @click="go()">Search</button>
    </div>
    <div class="nav-bar-right">
      <router-link to="/">Home</router-link>
      &emsp;
      <router-link to="/monograph_list">Monograph List</router-link>
      &emsp;
      <router-link to="/similar_method_search">Similar Method Search</router-link>
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
      }
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
  }

  .nav-bar-right a{
    color: white;
    text-decoration: none;
  }
</style>