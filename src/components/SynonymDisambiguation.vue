<template>
  <p>The term "{{ synonym }}" is a synonym for multiple substances.  Click on a substance below to see its results in the database.</p>
  <p>MATCHES: </p>
  <div class="compound-grid">
    <div v-for="s in substances">
      <CompoundTile :dtxsid="`${s.dtxsid}`" :preferred_name="`${s.preferred_name}`" />
      <button @click="selectSynonym(s.dtxsid)">Select</button>
    </div>
  </div>
</template>
  
<script>
  import CompoundTile from '@/components/CompoundTile.vue'

  export default {
    data() {
      return {
        x: false,
      }
    },
    created() {
      1
    },
    methods: {
      selectSynonym(dtxsid) {
        this.$emit("synonymSelected", dtxsid)
      }
    },
    props: {substances: Object, synonym: String},
    components: {CompoundTile}
  }
</script>

<style>
  .compound-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: left;
  }
</style>