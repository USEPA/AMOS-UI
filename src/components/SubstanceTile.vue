<!--
  This component is for displaying basic information on a single substance -- specifically, an image of the structure,
  the DTXSID, and the EPA-preferred name.

  This component takes two props:
  - dtxsid, the full DTXSID of the substance
  - preferred_name, the EPA-preferred name of the substance
-->

<template>
  <div :class="highlight ? 'substance-tile substance-highlight' : 'substance-tile'">
    <p style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;" :title="substance_info.preferred_name"><router-link :to="`/search/${substance_info.dtxsid}`" target="_blank"> {{substance_info.preferred_name}} </router-link> </p>
    <div style="display: block; margin-left: auto; margin-right: auto; width:150px; height:150px;">
      <img v-if="substance_info.image_link" style="width:150px; height:150px;" :src="substance_info.image_link" :alt="`Structure image for ${substance_info.dtxsid}`"/>  
      <div v-else style="text-align: center; display: flex; align-items: center;">No structural representation was found for this substance.</div>
    </div>
    <a :href="`${COMPTOX_PAGE_URL}${substance_info.dtxsid}`" target="_blank"> {{substance_info.dtxsid}} ↗</a>
  </div>
</template>

<script>
  import { imageLinkForSubstance } from '@/assets/common_functions.js'
  import { COMPTOX_PAGE_URL } from '@/assets/store.js'
  import '@/styles/main.css'

  export default {
    data() {
      return {COMPTOX_PAGE_URL, image_link: ""}
    },
    created() {
      this.image_link = imageLinkForSubstance(this.substance_info.dtxsid, this.substance_info.image_in_comptox)
    },
    watch: {
      dtxsid() {
        this.image_link = imageLinkForSubstance(this.substance_info.dtxsid, this.substance_info.image_in_comptox)
      }
    },
    props: {substance_info: Object, highlight: Boolean}
  }
</script>

<style>
  .substance-tile {
    width: 205px;
    height: 240px;
    border: 2px solid darkblue;
    box-sizing: border-box;
    position: relative;
  }
</style>