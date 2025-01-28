<!--
  This page is effectively a redirect/error catcher for searching by record ID.

  It takes one URL parameter, the ID of the record in question.
-->

<template>
  <br />
  <p v-if="!record_found">No record found for internal ID '{{ $route.params.internal_id }}'.</p>
  <p v-if="external_link">The record that you are attempting to view is only linked in AMOS -- the data itself is not contained in this database.  To view the record, go <a target="_blank" :href="external_link">here</a>.</p>
</template>

<script>
  import axios from 'axios';

  import { BACKEND_LOCATION } from '@/assets/store.js'

  export default {
    data() {
      return {
        BACKEND_LOCATION,
        external_link: null,
        record_found: true
      }
    },
    async created() {
      const internal_id = this.$route.params.internal_id
      const response = await axios.get(`${this.BACKEND_LOCATION}/record_id_search/${internal_id}`)
      const record_type = response.data.record_type
      if (record_type == "Fact Sheet") {
        this.$router.push(`/view_fact_sheet/${internal_id}`)
      } else if (record_type == "Method") {
        this.$router.push(`/view_method/${internal_id}`)
      } else if (record_type == "Spectrum") {
        const data_type = response.data.data_type
        if (data_type == "Mass Spectrum") {
          this.$router.push(`/view_mass_spectrum/${internal_id}`)
        } else if (data_type == "NMR Spectrum") {
          this.$router.push(`/view_nmr_spectrum/${internal_id}`)
        } else if (data_type == "PDF") {
          this.$router.push(`/view_spectrum_pdf/${internal_id}`)
        } else {
          this.external_link = response.data.link
        }
      } else {
        this.record_found = false
      }
    }
  }
</script>