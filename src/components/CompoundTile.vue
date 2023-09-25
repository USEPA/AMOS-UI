<!--
  This component is for displaying basic information on a single compound -- specifically, an image of the structure,
  the DTXSID, and the EPA-preferred name.

  This component takes two props:
  - dtxsid, the full DTXSID of the compound
  - preferred_name, the EPA-preferred name of the compound
-->

<template>
  <div :class="highlight ? 'compound-tile substance-highlight' : 'compound-tile'">
    <p style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;"><router-link :to="`/search/${preferred_name}`"> {{preferred_name}} </router-link> </p>
    <div style="display: block; margin-left: auto; margin-right: auto; width:150px; height:150px;">
      <img v-if="has_image" style="width:150px; height:150px;" :src="`${IMAGE_BY_DTXSID_API}${dtxsid}`"/>  
      <div v-else style="text-align: center; display: flex; align-items: center;">No structural representation was found for this compound.</div>
    </div>
    <a :href="`${COMPTOX_PAGE_URL}${dtxsid}`" target="_blank"> {{dtxsid}} ↗</a>
  </div>
</template>

<script>
  import { doesImageExist } from '@/assets/common_functions'
  import { COMPTOX_PAGE_URL, IMAGE_BY_DTXSID_API } from '@/assets/store'

  import '@/assets/style.css'

  export default {
    data() {
      return {COMPTOX_PAGE_URL, IMAGE_BY_DTXSID_API, has_image: true}
    },
    async created() {
      this.has_image = await doesImageExist(this.dtxsid)
    },
    props: {dtxsid: String, preferred_name: String, highlight: Boolean}
  }
</script>

<style>
  .compound-tile {
    width: 205px;
    height: 240px;
    border: 2px solid darkblue;
    box-sizing: border-box;
    position: relative;
  }
</style>