<!--
  This page is a temporary redirect for general InChIKey searches.  Specifically, there are instances where someone may
  be searching using an InChIKey, but the second block is different for some reason (non-standard key, isomers, etc.).
  When redirected to this page when running a general search by InChIKey, this will list all InChIKeys in the database
  that match the first block of the searched-for InChIKey.

  This page takes one URL route parameter, the InChIKey being searched for.  No query parameters are used.
-->

<template>
  <div v-if="search_complete">
    <p v-if="exact_match">An exact match for the InChIKey "<router-link :to="`/search/${this.$route.params.inchikey}`">{{$route.params.inchikey}}</router-link>" was found.  However, several other InChIKeys with the same first block were discovered, if you were looking for one of those.</p>
    <p v-else>An exact match for the InChIKey "{{$route.params.inchikey}}" was not found.  However, several other InChIKeys with the same first block were discovered, if you were looking for one of those.</p>
    <ul>
      <li v-for="ui in unique_inchikeys"><router-link :to="`/search/${ui.inchikey}`">{{ui.inchikey}}</router-link> ({{ui.preferred_name}})</li>
  </ul>
  </div>
  <div v-else>
    <p>Checking for other InChIKeys matching the first block...</p>
  </div>
</template>

<script>
  import axios from 'axios'
  import { BACKEND_LOCATION } from '@/assets/store'

  export default {
    data() {
      return {
        inchikey_first_block: "",
        unique_inchikeys: [],
        exact_match: false,
        search_complete: false,
        BACKEND_LOCATION
      }
    },
    async created() {
      /* TODO: Fix the logic two handle two cases better: (a) one InChIKey found that matches the
      first block, but doesn't match the full key, and (b) zero inchikeys found. */
      const response = await axios.get(`${this.BACKEND_LOCATION}/find_inchikeys/${this.$route.params.inchikey}`)
      this.search_complete = true
      if (response.data.unique_inchikeys.length == 1 & response.data.inchikey_present){
        this.$router.push({path: `/search/${this.$route.params.inchikey}`})
      } else if (response.data.unique_inchikeys.length > 1) {
        this.exact_match = response.data.inchikey_present
        this.unique_inchikeys = response.data.unique_inchikeys.filter(i => i !== this.$route.params.inchikey)
      } else {
        this.$router.push({path: `/search/${this.$route.params.inchikey}`})
      }
    }
  }
</script>