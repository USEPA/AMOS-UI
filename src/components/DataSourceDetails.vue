<template>
  <details>
    <summary>{{ sourceName }}</summary>
    <strong>Source Name:</strong> {{ sourceName }}
    <br />
    <strong>Category:</strong> {{ category }}
    <br />
    <strong>URL:</strong> {{ url }}
    <br />
    <strong>Data Source ID:</strong> {{ sourceID }}
    <br />
    <strong>Number of substances in data: </strong> {{ substances }}
    <br />
    <strong>Records in AMOS: </strong>
    <span v-if="spectra">{{ spectra }} spectra</span>
    <span v-if="spectra && (monographs || methods)">, </span>
    <span v-if="monographs">{{ monographs }} monographs</span>
    <span v-if="monographs && methods">, </span>
    <span v-if="methods">{{ methods }} methods</span>
  </details>
</template>

<script>
  export default {
    data() {
      return {
        x: true,
      }
    },
    props: {sourceName: String, category: String, url: String, sourceID: String, substances: Number, spectra: Number, monographs: Number, methods: Number}
  }
</script>