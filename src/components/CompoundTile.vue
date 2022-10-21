<template>
  <div class="compound-tile">
    <p style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;"><router-link :to="`/search/${preferred_name}`"> {{preferred_name}} </router-link> </p>
    <p><img v-bind:src="`https://comptox.epa.gov/dashboard-api/ccdapp1/chemical-files/image/by-dtxsid/${dtxsid}`" alt="No image found." style="display: block; margin-left: auto; margin-right: auto; width:150px; height:150px;" /> </p>
    <a :href="`https://comptox.epa.gov/dashboard/chemical/details/${dtxsid}`" target="_blank"> {{dtxsid}} ↗</a>
  </div>
</template>

<script>
  export default {
    props: ["dtxsid", "preferred_name"]
  }
</script>

<style>
  .compound-tile {
    width: 205px;
    height: 250px;
    border: 2px solid darkblue;
    box-sizing: border-box;
    position: relative;
  }
</style>