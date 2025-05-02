<!--
  This page is for viewing an individual NMR spectrum.

  It takes one route parameter, the internal ID of the NMR spectrum.
-->

<template>
  <div class="two-column-page" v-if="spectrum_found">
    <div class="half-page-column">
      <p>Below is a plot of the selected NMR spectrum.  Use the mouse wheel to zoom in and out or double click to zoom in.  Hover over the plot with the mouse to see individual points; this may lag somewhat for larger spectra (64k points or so).  Intensities are scaled so that the maximum is 10.</p>
      <NMRSpectrumPlot :spectrum="spectrum" />
      <br />
      <div class="info-container">
        <p style="font-weight: bold;">Information</p>
        <ul style="list-style-type: none;">
          <li><strong>Nucleus:</strong> {{ nucleus }}</li>
          <li><strong>Frequency:</strong> {{ frequency }} MHz</li>
          <li><strong>Temperature:</strong> {{ temperature ? `${temperature} °C` : "Unknown" }}</li>
          <li><strong>Solvent:</strong> {{ solvent ? solvent : "Unknown" }}</li>
        </ul>
        <button @click="downloadNMRSpectrum">Download Spectrum</button>
      </div>
    </div>
    <div class="half-page-column">
      <h3>Substance Info</h3>
      <BasicSubstanceDisplay :substanceInfo="substance_info" />
      <br /> <br />
      <h3>Metadata</h3>
      <NMRSpectrumMetadata :spectrumMetadata="metadata" v-if="metadata" />
      <p v-else>No metadata available.</p>
    </div>
  </div>
  <div v-else class="padded-error-message">
    <br />
    <p>No NMR spectrum matching the given ID was found.</p>
  </div>
</template>

<script>
  import axios from 'axios';
  import * as d3 from "d3";

  import { BACKEND_LOCATION } from '@/assets/store.js'
  import BasicSubstanceDisplay from '@/components/BasicSubstanceDisplay.vue'
  import NMRSpectrumDisplay from '@/components/NMRSpectrumDisplay.vue'
  import NMRSpectrumMetadata from '@/components/NMRSpectrumMetadata.vue'
  import NMRSpectrumPlot from '@/components/NMRSpectrumPlot.vue'
  import '@/styles/main.css'

  export default {
    data() {
      return {
        BACKEND_LOCATION,
        spectrum: [],
        frequency: 0,
        nucleus: "",
        temperature: null,
        solvent: "",
        metadata: {},
        substance_info: {},
        spectrum_found: true
      }
    },
    async created() {
      const dtxsid_response = await axios.get(`${this.BACKEND_LOCATION}/find_dtxsids/${this.$route.params.internal_id}`)
      console.log(dtxsid_response)
      if (dtxsid_response.data.substance_list.length === 0) {
        this.spectrum_found = false
        return
      }
      const dtxsid = dtxsid_response.data.substance_list[0].dtxsid
      const substance_response = await axios.get(`${this.BACKEND_LOCATION}/get_substances_for_search_term/${dtxsid}`)
      this.substance_info = substance_response.data.substances

      const response = await axios.get(`${this.BACKEND_LOCATION}/get_nmr_spectrum/${this.$route.params.internal_id}`)
      const info = response.data

      const num_points = info.intensities.length
      const step = (info.last_x - info.first_x)/(num_points-1)
      var ppm = Array.from({length: num_points}, (_, i) => info.first_x + i*step)
      var spectrum_array = d3.zip(ppm, info.intensities)
      this.spectrum = spectrum_array.map(x => {
        return {ppm: x[0], intensity: x[1]}
      })

      this.frequency = info.frequency
      this.nucleus = info.nucleus
      this.temperature = info.temperature
      this.solvent = info.solvent
      this.metadata = info.spectrum_metadata
    },
    methods: {
      downloadNMRSpectrum() {
        const spectrum_string = "PPM Intensity\n" + this.spectrum.map(x => `${x.ppm} ${x.intensity}`).join("\n")
        var file = new Blob([spectrum_string], {type: "text/plain"})
        var a = document.createElement("a")
        a.setAttribute('download', true)
        a.href = window.URL.createObjectURL(file)
        a.download = "nmr spectrum.txt"
        a.click()
      }
    },
    components: {BasicSubstanceDisplay, NMRSpectrumDisplay, NMRSpectrumMetadata, NMRSpectrumPlot}
  }
</script>