<!--
  This is a simple about page for the app, intended to contain a more complete description of its data and functionality than the front page.

  There are no URL route or query parameters associated with this page.
-->

<template>
  <div class="About">
    <h1>About</h1>
    <p>This web app is designed to perform searches on and allow examination of a collection of publicly available data from several sources, all of which are focused on mass spectra and other chemical analyses. This app was written using Vue 3 and Bootstrap on the front end, with a Flask-based Python API accessing a PostgreSQL database behind the scenes.</p>
    <p>The database contains a mixture of data that can be divided into three categories.</p>
    <ul>
      <li><b>Mass spectra</b> of various types (including GC, LC, Raman, and IR spectra, among others).</li>
      <li>Analytical <b>methods</b> which document full testing procedures for one or more (potentially a couple hundred) compounds.</li>
      <li><b>Fact sheets</b> which are supplemental documents of various kinds that cover one or a few compounds.  These range from brief, relatively non-technical overviews of a compound to monographs that detail multiple experimental spectra.</li>
    </ul>
    <p>The primary functions of this app are as follows:</p>
    <ul>
      <li>Performing general searches on all three categories of records for specfic compounds, and displaying information about those records -- this is what the "Search" field at the top left is used for.  Searching can be done by DTXSID, CAS registry number, InChIKey, or compound names.</li>
      <li>Viewing lists of fact sheets and methods in the database, along with displaying their PDFs and the compounds associated with them.</li>
      <li>Searching for all methods that cover a compound similar to one being searched.  This uses EPA calculations for the similarity between two compounds and returns all methods containing at least one compound of sufficient similarity (similarity level is currently hardcoded on the Flask backend).  Searching can be done by DTXSID, CAS registry number, InChIKey, or compound names.</li>
      <li>Batch searching compounds by DTXSID, and returning basic information for all records.</li>
    </ul>
    <p>The contents of the database are as follows:</p>
    <ul>
      <li>Spectra: 210,140 in database and 600,248 externally linked</li>
      <li>Fact Sheets: 3699 in database</li>
      <li>Methods: 4166 in database</li>
      <li>Unique sources: 149</li>
      <li>Substances appearing in at least one record: 164,037</li>
    </ul>
    <br />
    <p>Below is a chart detailing the breakdown of the methods currently in the database.  Click on a circle to zoom in and see more detail; click outside it to move to a higher level.</p>
    <MethodsBubbleChart />
    <br />
    <p>This app was last updated on 2023-11-01.</p>
  </div>
</template>

<script>
  import MethodsBubbleChart from '@/components/MethodsBubbleChart.vue'

  export default {
    data() {
      return {
        x: true
      }
    },
    components: {MethodsBubbleChart}
  }
</script>

<style>

</style>