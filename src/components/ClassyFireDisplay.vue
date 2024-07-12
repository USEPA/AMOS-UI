<template>
  <details>
    <summary><strong>ClassyFire Classification</strong></summary>
    <div class="contents">
      {{ kingdom }}
      <br />
      &nbsp; ⮡  {{ superklass }}
      <br />
      &nbsp; &nbsp; ⮡  {{ klass }}
      <br />
      &nbsp; &nbsp; &nbsp; ⮡  <router-link :to="`/classyfire_search?kingdom=${kingdom}&superclass=${superklass}&class=${klass}&subclass=${subklass}`" target="_blank">{{ subklass }}</router-link>
    </div>
  </details>
</template>

<script>
  export default {
    data() {
      return {
        x: true,
      }
    },
    props: {kingdom: String, superklass: String, klass: String, subklass: String}
  }
</script>

<style>
  .contents {
    margin-left: 20px
  }
</style>