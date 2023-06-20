<!--
  This is a simple component for a collapsible element that holds information on one of the data sources used in AMOS.

  This component can take eight props -- at least one of spectra, monographs, and methods should be passed, and all
  other props are expected to be present:
  - sourceName: the proper (i.e., unabbrieviated and official) name of the source.
  - category: a short description of the type of source that this is.  Currently not standardized.
  - url: the home page for the source.
  - sourceID: names used for the source in the database.  Typically this means the abbreviations or other shorthand used (such as "USEPA" instead of "U.S. Environmental Protection Agency").
  - substances: the number of unique substances that appear between all records in AMOS from this source.
  - spectra: the number of spectrum records in AMOS from this source.
  - monographs: the number of monographs in AMOS from this source.
  - methods: the number of methods in AMOS from this source.
-->

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