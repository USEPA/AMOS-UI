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
      <li><b>Monographs</b> that detail the results of an in-depth analysis.  These often contain multiple spectra of varying types, but only a few compounds at most.</li>
      <li>Analytical <b>methods</b> which document full testing procedures for one or more (potentially a couple hundred) compounds.</li>
    </ul>
    <p>The primary functions of this app are as follows:</p>
    <ul>
      <li>Performing general searches on all three categories of records for specfic compounds, and displaying information about those records -- this is what the "Search" field at the top left is used for.  Searching can be done by DTXSID, CAS registry number, InChIKey, or compound names.</li>
      <li>Viewing lists of monographs and methods in the database, along with displaying their PDFs and the compounds associated with them.</li>
      <li>Searching for all methods that cover a compound similar to one being searched.  This uses EPA calculations for the similarity between two compounds and returns all methods containing at least one compound of sufficient similarity (similarity level is currently hardcoded on the Flask backend).  Searching can be done by DTXSID, CAS registry number, InChIKey, or compound names.</li>
      <li>Batch searching compounds by DTXSID, and returning basic information for all records.</li>
    </ul>
    <br />
    <br />
    <p>This app was last updated on 2023-03-08.</p>
    <!-- In theory, the below is a functional toggle switch that might be useful, but we'll see if it's what we'll use down the line.
      <label class="toggle-switch">
      <input type="checkbox" class="toggle-switch-input" checked>
      <span class="toggle-slider"></span>
    </label> -->
  </div>
</template>

<script>
  export default {
    data() {
      return {
        x: true
      }
    }
  }
</script>

<style>
  .toggle-switch {
    position: fixed;
    width: 34px;
    height: 19px;
  }

  .toggle-switch-input { 
    opacity: 0;
    width: 0;
    height: 0;
  }

  .toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 1rem;
    background-color: lightgray;
    transition: .3s;
  }

  .toggle-slider::before {
    position: absolute;
    content: "";
    height: 15px;
    width: 15px;
    left: 2px;
    bottom: 2px;
    border-radius: 50%;
    background-color: white;
    transition: .3s;
  }

  .toggle-switch-input:checked + .toggle-slider::before {
    transform: translateX(15px);
  }

  .toggle-switch-input:checked + .toggle-slider {
    background-color: cornflowerblue;
  }
</style>