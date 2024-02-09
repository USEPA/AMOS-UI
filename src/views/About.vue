<!--
  This is a simple about page for the app, intended to contain a more complete description of its data and functionality than the front page.

  There are no URL route or query parameters associated with this page.
-->

<template>
  <div class="About">
    <h1>About</h1>
    <p>This web application is designed to perform searches on and allow examination of a collection of publicly available analytical chemistry data from several sources, most of which are focused on mass spectra. This app was written using Vue 3 and Bootstrap on the front end, with a Flask-based Python API accessing a PostgreSQL database behind the scenes.</p>
    <p>The database contains a mixture of data types that can be divided into three categories.</p>
    <ul>
      <li><b>Spectra</b> of various types.  These are primarily mass spectra, mainly GC/MS and LC/MS, though some other types of spectra such as Raman or IR are linked to.</li>
      <li><b>Analytical methods</b> that document full testing procedures for an analysis, including information like sample matrices, limits of detection, etc.  These cover one or more substances -- typically several, but as many as a few hundred for a few documents.</li>
      <li><b>Fact sheets</b>, which are supplemental documents of various kinds.  These range from brief, relatively non-technical overviews of a substance to monographs that detail multiple experimental spectra.</li>
    </ul>
    <p>The primary functions of this app are as follows:</p>
    <ul>
      <li>Performing general searches on all categories of records for specfic substances, and displaying information about those records.  Searching can be done by DTXSID, CAS registry number, InChIKey, or substance names.  Substring searches can be done, but only on names.</li>
      <li>Viewing lists of fact sheets and methods in the database, along with displaying the documents themselves and the substances associated with them.</li>
      <li>Searching for all methods that cover a substance similar to one being searched.  This uses EPA calculations for the similarity between two substances and returns all methods containing at least one substance of sufficient similarity (similarity level is currently hardcoded on the Flask backend).  Searching can be done by DTXSID, CAS registry number, InChIKey, or name.</li>
      <li>Batch searching substances by DTXSID, and returning basic information for all records.</li>
      <li>Comparing a user-submitted spectrum to other spectra in the database, given an analyical methodology (currently just GC/MS or LC/MS) and mass range.</li>
    </ul>
    <p>The records in this application contain:</p>
    <ul v-if="summary_retrieved">
      <li>Spectra in database: {{ (result_info["Spectrum"]["Spectrum"] + result_info["Spectrum"]["PDF"]).toLocaleString() }} spectra in database ({{result_info["Spectrum"]["PDF"].toLocaleString()}} of which are PDFs), covering {{result_info["Substances"]["Internal Spectrum"].toLocaleString()}} substances</li>
      <li>Externally linked spectra: {{ result_info["Spectrum"]["External"].toLocaleString() }} external links, covering {{ result_info["Substances"]["External Spectrum"].toLocaleString()}} substances</li>
      <li>Fact Sheets: {{result_info["Fact Sheet"]["PDF"].toLocaleString()}} documents in database, covering {{ result_info["Substances"]["Internal Fact Sheet"].toLocaleString() }} substances</li>
      <li>Methods: {{result_info["Method"]["PDF"].toLocaleString()}} documents in database, covering {{result_info["Substances"]["Internal Method"].toLocaleString()}} substances</li>
      <li>Unique sources: {{result_info["Sources"]["Total"].toLocaleString()}}</li>
      <li>Substances appearing in at least one record: {{result_info["Substances"]["Total"].toLocaleString()}}</li>
    </ul>
  <br />
  <p>This app was last updated on 2024-02-09.</p>
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
        const response = await axios.get(`${this.BACKEND_LOCATION}/database_summary`)
        this.result_info = response.data
        this.summary_retrieved = true
      }
    },
    async created() {
      await this.getDatabaseStats()
    }
  }
</script>