<!--
  This page is a list of EPA-built pplications which may be of interest to users of AMOS.
  
  This page takes no query or URL parameters.
-->

<template>
  <p>AMOS is one of a number of EPA applications that organize and show data on substances. Below are several more.</p>

  <template v-if="store.internalDeployment">
    <h5><a href="https://ccte-cced-aqcv2.epa.gov/" target="_blank">Analytical QC</a></h5>
    <p>A collection of experimental data and expert assessments on nearly 10,000 substances of interest to the Tox21
      project, a multi-agency research collaboration working on rapid and efficient analysis of the effects of
      human-made chemicals on human health. The PDF records of spectra are included in AMOS, but there is deeper
      information included in Analytical QC.</p>


    <h5><a href="https://aop-dev.rtpnc.epa.gov/nta-ui/nta.html" target="_blank">CFM-ID Spectral Search</a></h5>
    <p>A prototype application for performing non-targeted analysis on a user-supplied spectrum. It is similar to the
      spectrum search functionality in this application, and does augment its results with the experimental spectra in
      AMOS's database, but it incorporates in silico spectra.</p>


    <h5><a href="https://ccte-cced-chet.epa.gov/" target="_blank">Chemical Transformation Database</a></h5>
    <p>An application for tracking possible transformations of various chemicals prone to undergoing transformations in
      environmental and biological systems.</p>
  </template>

  <h5><a :href="cimUrl" target="_blank">Cheminformatics PoC Modules</a></h5>
  <p>A collection of smaller applications geared toward displaying and predicting hazard, safety, and ToxPrint chemotype
    information.</p>

  <template v-if="store.internalDeployment">
    <h5><a href="https://ccte-cced-chemster.epa.gov" target="_blank">ChemSTER (Chemical Space to Explorable
      Representations)</a></h5>
    <p>This application allows users to compare the characteristics of various EPA-based or user-supplied lists of
      substances.</p>
  </template>

  <h5><a href="https://comptox.epa.gov/dashboard/" target="_blank">CompTox Chemicals Dashboard</a></h5>
  <p>An EPA-built and -curated dashboard, containing a broad variety of data on over 1.2 million substances.</p>

  <h5><a href="https://comptox.epa.gov/genra/" target="_blank">GenRA (Generalized Read-Across)</a></h5>
  <p>An application for making algorithmic read-across-based predictions on substances.</p>

  <h5><a href="https://comptox.epa.gov/dashboard/chemical/pubmed-abstract-sifter/" target="_blank">Literature Abstract
    Sifter</a></h5>
  <p>A PubMed-focused search tool for quickly searching through abstracts to locate relevant documents.</p>

  <!--
    This is currently offline, so it's commented out, but it's supposed to be back up at some point.
    <h5><a href="unavailable" target="_blank">Molecular Mass Calculator</a></h5>
    <p>Online calculator for molecular masses.
  -->
</template>

<script>
import {store} from "../assets/store.js"

export default {
  data() {
    return {
      store: store,
    }
  },
  computed: {
    cimUrl() {
      return this.store.internalDeployment ?
          "https://ccte-cced-cheminformatics.epa.gov/" :
          "https://hcd.rtpnc.epa.gov/#/hazard";
    }
  },
}
</script>
