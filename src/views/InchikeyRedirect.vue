<template>
  <div v-if="search_complete">
    <p v-if="exact_match">An exact match for the InChIKey "<router-link :to="`/search/${this.$route.params.inchikey}`">{{$route.params.inchikey}}</router-link>" was found.  However, several other InChIKeys with the same first block were discovered, if you were looking for one of those.</p>
    <p v-else>An exact match for the InChIKey "{{$route.params.inchikey}}" was not found.  However, several other InChIKeys with the same first block were discovered, if you were looking for one of those.</p>
    <ul>
      <li v-for="ui in unique_inchikeys"><router-link :to="`/search/${ui}`">{{ui}}</router-link></li>
  </ul>
  </div>
  <div v-else>
    <p>Checking for other InChIKeys matching the first block...</p>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    data() {
      return {
        inchikey_first_block: "",
        unique_inchikeys: [],
        exact_match: false,
        search_complete: false
      }
    },
    async created() {
      const response = await axios.get(`http://localhost:5000/find_inchikeys/${this.$route.params.inchikey}`)
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