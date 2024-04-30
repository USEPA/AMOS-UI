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
      &nbsp; &nbsp; &nbsp; ⮡  {{ subklass }}
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