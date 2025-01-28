<!--
  This is a simple about page for the app, intended to contain a more complete description of its data and functionality than the front page.

  There are no URL route or query parameters associated with this page.
-->

<template>
  <div class="About">
    <h1>About</h1>
    <p>This web application is designed to perform searches on and allow examination of a collection of publicly available experimental analytical chemistry data from several sources, most of which are focused on mass spectra. This app was written using Vue 3 and Bootstrap on the front end, with a Flask-based Python API accessing a PostgreSQL database behind the scenes.  A manual with details about the functioning of various pages is available <a href="https://work.epa.gov/ccte/amos-analytical-methods-and-open-spectral-database-help">here</a>.</p>
    <p>The database contains a mixture of data types that can be divided into three categories.</p>
    <ul>
      <li><b>Spectra</b> of various types.  These are primarily mass spectra, with smaller amounts of NMR and IR spectra.  Some spectra are stored as PDFs that may contain some supplemental information, and some others are merely linked to and not stored directly in this database.</li>
      <li><b>Analytical methods</b> that document full testing procedures for an analysis, including information like sample matrices, limits of detection, etc.  These usually cover several substances, but a few may cover as many as a few hundred.</li>
      <li><b>Fact sheets</b>, which are supplemental documents of various kinds.  These range from brief, relatively non-technical descriptions of a substance to monographs that detail multiple experimental spectra.</li>
    </ul>
    <p>The primary functions of this app are as follows:</p>
    <ul>
      <li>Performing general searches on all categories of records for specfic substances, and displaying information about those records.  Searching can be done by DTXSID, CAS registry number, InChIKey, or substance names.  Some searches can be done on partial identifiers, i.e., identifiers that aren't unique to one substance.</li>
      <li>Viewing lists of fact sheets and methods in the database, along with displaying the documents themselves and the substances associated with them.</li>
      <li>Searching for all methods and fact sheets that cover a substance similar to one being searched.  This uses EPA calculations for the similarity between two substances and returns all methods and fact sheets containing at least one substance of sufficient similarity (similarity level is currently hardcoded on the Flask backend).  Searching can be done by DTXSID, CAS registry number, InChIKey, or name.</li>
      <li>Batch searching substances by DTXSID, and returning basic information for those records.</li>
      <li>Comparing a user-submitted spectrum to other spectra in the database, given an analytical methodology (currently just GC/MS or LC/MS) and mass range.</li>
    </ul>
    <p>The records in this application contain:</p>
    <ul v-if="summary_retrieved">
      <li>Spectra in database: {{ internal_spectra["Total"].toLocaleString() }} spectra total, {{ internal_spectra["PDF"].toLocaleString() }} of which are stored as PDFs, covering {{ substances["Internal Spectrum"].toLocaleString() }} substances.  Among those that are not PDFs, there are:</li>
      <ul>
        <li>{{ internal_spectra["Mass"]["Total"].toLocaleString() }} mass spectra -- {{ breakdowns["Mass"] }} </li>
        <li>{{ internal_spectra["NMR"]["Total"].toLocaleString() }} NMR spectra -- {{ breakdowns["NMR"] }} </li>
        <li>{{ internal_spectra["IR"]["Total"].toLocaleString() }} IR spectra -- {{ breakdowns["IR"] }} </li>
      </ul>
      <li>Externally linked spectra: {{ external_spectra_count.toLocaleString() }} links for spectra of various kinds, covering {{ substances["External Spectrum"].toLocaleString() }} substances.</li>
      <li>Fact Sheets: {{ fact_sheet_count.toLocaleString() }} documents, covering {{ substances["Internal Fact Sheet"].toLocaleString() }} substances.</li>
      <li>Methods: {{ method_count.toLocaleString() }} documents, covering {{ substances["Internal Method"].toLocaleString() }} substances.</li>
      <li>Unique sources: {{ source_count.toLocaleString() }}</li>
      <li>Substances appearing in at least one record: {{ substances["Total"].toLocaleString() }}</li>
    </ul>
  </div>
</template>

<script>
  import axios from 'axios'

  import { BACKEND_LOCATION } from '@/assets/store.js'

  export default {
    data() {
      return {
        contents_search_done: false,
        summary_retrieved: false,
        external_spectra_count: 0,
        fact_sheet_count: 0,
        internal_spectra: {},
        method_count: 0,
        source_count: 0,
        substances: {},
        breakdowns: {},
        BACKEND_LOCATION
      }
    },
    async created() {
      const response = await axios.get(`${this.BACKEND_LOCATION}/database_summary/`)
      const result_info = response.data
      
      this.external_spectra_count = result_info["External Spectrum"]["Total"]
      this.fact_sheet_count = result_info["Fact Sheet"]["Total"]
      this.internal_spectra = result_info["Internal Spectrum"]
      this.method_count = result_info["Method"]["Total"]
      this.source_count = result_info["Sources"]["Total"]
      this.substances = result_info["Substances"]

      // MS breakdown
      const ms_types = Object.keys(this.internal_spectra["Mass"])
      var ms_breakdown = ""
      for (let k of ms_types) {
        if (!(["other", "Total"].includes(k))) {
          ms_breakdown += `${this.internal_spectra["Mass"][k].toLocaleString()} ${k}; `
        }
      }
      this.breakdowns["Mass"] = ms_breakdown + `${this.internal_spectra["Mass"]["other"].toLocaleString()} other`

      // NMR breakdown
      const nmr_types = Object.keys(this.internal_spectra["NMR"])
      var nmr_breakdown = ""
      for (let k of nmr_types) {
        if (!(["Total"].includes(k))) {
          nmr_breakdown += `${this.internal_spectra["NMR"][k].toLocaleString()} ${k}; `
        }
      }
      this.breakdowns["NMR"] = nmr_breakdown.substring(0, nmr_breakdown.length-2)

      // IR breakdown
      const ir_types = Object.keys(this.internal_spectra["IR"])
      var ir_breakdown = ""
      for (let k of ir_types) {
        if (!(["Total"].includes(k))) {
          ir_breakdown += `${this.internal_spectra["IR"][k].toLocaleString()} ${k}; `
        }
      }
      this.breakdowns["IR"] = ir_breakdown.substring(0, ir_breakdown.length-2)

      this.summary_retrieved = true
    }
  }
</script>