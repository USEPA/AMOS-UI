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
      <li>Comparing a user-submitted spectrum to other spectra in the database, given an analyical methodology (currently just GC/MS or LC/MS) and mass range.</li>
    </ul>
    <p>The records in this application contain:</p>
    <ul v-if="summary_retrieved">
      <li>Spectra in database: {{ (result_info["Spectrum"]["Mass Spectrum"] + result_info["Spectrum"]["NMR Spectrum"] + result_info["Spectrum"]["IR Spectrum"]).toLocaleString() }} spectra in database ({{result_info["Spectrum"]["PDF"].toLocaleString()}} of which are PDFs), covering {{result_info["Substances"]["Internal Spectrum"].toLocaleString()}} substances</li>
      <ul>
        <li>{{ result_info["Spectrum"]["Mass Spectrum"].toLocaleString() }} mass spectra, either GC/MS or LC/MS</li>
        <li>{{ result_info["Spectrum"]["NMR Spectrum"].toLocaleString() }} NMR spectra, all 1D</li>
        <li>{{ result_info["Spectrum"]["IR Spectrum"].toLocaleString() }} IR spectra</li>
      </ul>
      <li>Externally linked spectra: {{ result_info["Spectrum"]["External"].toLocaleString() }} external links, covering {{ result_info["Substances"]["External Spectrum"].toLocaleString()}} substances</li>
      <li>Fact Sheets: {{result_info["Fact Sheet"]["PDF"].toLocaleString()}} documents in database, covering {{ result_info["Substances"]["Internal Fact Sheet"].toLocaleString() }} substances</li>
      <li>Methods: {{result_info["Method"]["PDF"].toLocaleString()}} documents in database, covering {{result_info["Substances"]["Internal Method"].toLocaleString()}} substances</li>
      <li>Unique sources: {{result_info["Sources"]["Total"].toLocaleString()}}</li>
      <li>Substances appearing in at least one record: {{result_info["Substances"]["Total"].toLocaleString()}}</li>
    </ul>
  </div>
</template>

<script>
  import axios from 'axios'

  import { BACKEND_LOCATION } from '@/assets/store'

  export default {
    data() {
      return {
        contents_search_done: false,
        summary_retrieved: false,
        source_count: 0,
        substances_appearing: 0,
        result_types: {},
        BACKEND_LOCATION
      }
    },
    methods: {
      async getDatabaseStats(){
        const response = await axios.get(`${this.BACKEND_LOCATION}/database_summary/`)
        this.result_info = response.data
        this.summary_retrieved = true
      }
    },
    async created() {
      await this.getDatabaseStats()
    }
  }
</script>