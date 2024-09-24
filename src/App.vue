<template>
  <div class="page">
    <EPAHeader v-if="store.showHeaderAndFooter"/>
    <top-navigation-bar/>
    <div class="container-null">
      <router-view :key="$route.path"></router-view>
    </div>
    <br />
    <p><strong>DISCLAIMER: The Analytical Methods and Open Spectral database (AMOS) is a prototype tool which is using a compilation of information sourced from many sites, databases, and sources including U.S. Federal and state sources and international bodies that saves the user time by providing information in one location. The data are not reviewed by the EPA -- the user must apply judgment in use of the information.</strong></p>
    <br />
    <EPAFooter v-if="store.showHeaderAndFooter" />
  </div>
</template>

<script>
  import TopNavigationBar from "@/components/TopNavigationBar.vue"
  import EPAHeader from "@/components/EPAHeader.vue"
  import EPAFooter from "@/components/EPAFooter.vue"
  import {store} from "@/assets/store.js"
  
  export default {
    components: {TopNavigationBar, EPAHeader, EPAFooter},
    data() {
      return {
        store
      }
    }
  }
</script>

<style>
  #app {
    margin: 0 auto;
    padding: 1rem;
    font-weight: normal;
  }
</style>
