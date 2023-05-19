<!--
  This component is for displaying basic information on a single compound -- specifically, an image of the structure,
  the DTXSID, and the EPA-preferred name.

  This component takes two props:
  - dtxsid, the full DTXSID of the compound
  - preferred_name, the EPA-preferred name of the compound
-->

<template>
  <div class="compound-tile">
    <p style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;"><router-link :to="`/search/${preferred_name}`"> {{preferred_name}} </router-link> </p>
    <div style="display: block; margin-left: auto; margin-right: auto; width:150px; height:150px;">
      <img v-if="has_image" style="width:150px; height:150px;" :src="`${IMAGE_BY_DTXSID_API}${dtxsid}`"/>  
      <div v-else style="text-align: center; display: flex; align-items: center;">No image was found for this compound.</div>
    </div>
    <a :href="`${COMPTOX_PAGE_URL}${dtxsid}`" target="_blank"> {{dtxsid}} ↗</a>
  </div>
</template>

<script>
  import axios from 'axios'
  import { COMPTOX_PAGE_URL, IMAGE_BY_DTXSID_API } from '@/assets/store'

  export default {
    data() {
      return {COMPTOX_PAGE_URL, IMAGE_BY_DTXSID_API, has_image: true}
    },
    async created() {
      const response2 = await axios.get(`${this.IMAGE_BY_DTXSID_API}${this.dtxsid}`)
      if (response2.data === "") {
        this.has_image = false
      }
    },
    props: ["dtxsid", "preferred_name"]
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