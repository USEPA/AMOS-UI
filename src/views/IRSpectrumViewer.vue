<!--
  This page is for viewing an individual NMR spectrum.

  It takes one route parameter, the internal ID of the NMR spectrum.
-->

<template>
  <div class="two-column-page">
    <div class="half-page-column">
      <IRSpectrumDisplay :internalID="$route.params.internal_id" />
    </div>
    <div class="half-page-column">
      <h3>Substance Info</h3>
      <BasicSubstanceDisplay :substanceInfo="substance_info" />
    </div>
  </div>
</template>

<script>
  import axios from 'axios';

  import { BACKEND_LOCATION } from '@/assets/store'
  import '@/assets/style.css'
  import BasicSubstanceDisplay from '@/components/BasicSubstanceDisplay.vue'
  import IRSpectrumDisplay from '@/components/IRSpectrumDisplay.vue'

  export default {
    data() {
      return {
        BACKEND_LOCATION,
        substance_info: {}
      }
    },
    async created() {
      const dtxsid_response = await axios.get(`${this.BACKEND_LOCATION}/find_dtxsids/${this.$route.params.internal_id}`)
      const dtxsid = dtxsid_response.data.substance_list[0].dtxsid
      const substance_response = await axios.get(`${this.BACKEND_LOCATION}/get_substances_for_search_term/${dtxsid}`)
      this.substance_info = substance_response.data.substances
    },
    components: {BasicSubstanceDisplay, IRSpectrumDisplay}
  }
</script>