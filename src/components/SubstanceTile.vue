<!--
  This component is for displaying basic information on a single substance -- specifically, an image of the structure,
  the DTXSID, and the EPA-preferred name.

  This component takes two props:
  - dtxsid, the full DTXSID of the substance
  - preferred_name, the EPA-preferred name of the substance
-->

<template>
  <div :class="highlight ? 'substance-tile substance-highlight' : 'substance-tile'">
    <p style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;"><router-link :to="`/search/${preferred_name}`"> {{preferred_name}} </router-link> </p>
    <div style="display: block; margin-left: auto; margin-right: auto; width:150px; height:150px;">
      <img v-if="image_link" style="width:150px; height:150px;" :src="image_link"/>  
      <div v-else style="text-align: center; display: flex; align-items: center;">No structural representation was found for this substance.</div>
    </div>
    <a :href="`${COMPTOX_PAGE_URL}${dtxsid}`" target="_blank"> {{dtxsid}} ↗</a>
  </div>
</template>

<script>
  import { getSubstanceImageLink } from '@/assets/common_functions'
  import { COMPTOX_PAGE_URL } from '@/assets/store'

  import '@/assets/style.css'

  export default {
    data() {
      return {COMPTOX_PAGE_URL, image_link: ""}
    },
    async created() {
      this.image_link = await getSubstanceImageLink(this.dtxsid)
    },
    props: {dtxsid: String, preferred_name: String, highlight: Boolean}
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