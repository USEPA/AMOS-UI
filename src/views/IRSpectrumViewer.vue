<!--
  This page is for viewing an individual IR spectrum.

  It takes one route parameter:
  - internal_id: The database ID of the IR spectrum of interest.
-->

<template>
  <div class="two-column-page" v-if="spectrum_found">
    <div class="half-page-column">
      <IRSpectrumDisplay :internalID="$route.params.internal_id" />
    </div>
    <div class="half-page-column">
      <h3>Substance Info</h3>
      <BasicSubstanceDisplay :substanceInfo="substance_info" />
    </div>
  </div>
  <div v-else class="padded-error-message">
    <br />
    <p>No IR spectrum matching the given ID was found.</p>
  </div>
</template>

<script>
  import axios from 'axios';

  import { BACKEND_LOCATION } from '@/assets/store.js'
  import BasicSubstanceDisplay from '@/components/BasicSubstanceDisplay.vue'
  import IRSpectrumDisplay from '@/components/IRSpectrumDisplay.vue'
  import '@/styles/main.css'

  export default {
    data() {
      return {
        BACKEND_LOCATION,
        substance_info: {},
        spectrum_found: true
      }
    },
    async created() {
      const dtxsid_response = await axios.get(`${this.BACKEND_LOCATION}/find_dtxsids/${this.$route.params.internal_id}`)
      if (dtxsid_response.data.substance_list.length === 0) {
        this.spectrum_found = false
        return
      }
      const dtxsid = dtxsid_response.data.substance_list[0].dtxsid
      const substance_response = await axios.get(`${this.BACKEND_LOCATION}/get_substances_for_search_term/${dtxsid}`)
      this.substance_info = substance_response.data.substances
    },
    components: {BasicSubstanceDisplay, IRSpectrumDisplay}
  }
</script>