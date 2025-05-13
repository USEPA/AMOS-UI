<!--
  This is a very basic component to structure and display the first four levels of a ClassyFire classification.

  This component takes four props; all are required and all are Strings:
  - kingdom: The top-level classification.
  - superklass: The second level of the classification.
  - klass: The third level of the classification.
  - subklass: The fourth level of the classification.

  Note: The latter three levels of classifciation have their arguments spelled with a "k" to avoid possible name
  conflicts with the keyword "class"; displays of this information should spell superclass/class/subclass correctly.
-->

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