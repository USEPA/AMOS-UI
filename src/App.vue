<template>
  <div class="page">
    <EPAHeader v-if="store.showHeaderAndFooter"/>
    <top-navigation-bar/>
    <div class="container-null">
      <router-view :key="$route.path"></router-view>
    </div>
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
