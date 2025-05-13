<!--
  This component is used to display a plot of an NMR spectrum stored directly in the database (as opposed to a PDF),
  along with some supplemental information.

  This component takes one prop:
  - internalID: The database ID of the NMR spectrum in question.  Required.
-->

<template>
  <div class="spectrum-display-container">
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
      <div>
        <button @click="downloadNMRSpectrum">Download Spectrum</button>
        <button v-if="metadata" @click="show_metadata_modal = true">View Metadata</button>
      </div>
    </div>
    <BModal v-if="metadata" v-model="show_metadata_modal" ref="metadata_modal">
      <NMRSpectrumMetadata :spectrumMetadata=metadata />
    </BModal>
  </div>
</template>


<script>
  import axios from 'axios';
  import {BModal} from 'bootstrap-vue-next'

  import * as d3 from "d3";

  import '@/styles/main.css'
  import { BACKEND_LOCATION } from '@/assets/store.js';
  import NMRSpectrumMetadata from '@/components/NMRSpectrumMetadata.vue'
  import NMRSpectrumPlot from '@/components/NMRSpectrumPlot.vue';

  export default {
    data() {
      return {
        spectrum: [],
        frequency: 0,
        nucleus: "",
        temperature: null,
        solvent: "",
        metadata: {},
        show_metadata_modal: false,
        BACKEND_LOCATION
      }
    },
    props: {internalID: {type: String, required: true}},
    watch: {
      async internalID(){
        await this.getNMRSpectrum()
      }
    },
    async created() {
      await this.getNMRSpectrum()
    },
    methods: {
      async getNMRSpectrum() {
        const path = `${this.BACKEND_LOCATION}/get_nmr_spectrum/${this.internalID}`
        const response = await axios.get(path)
        const info = response.data

        this.frequency = info.frequency
        this.nucleus = info.nucleus
        this.temperature = info.temperature
        this.solvent = info.solvent
        this.metadata = info.spectrum_metadata

        const num_points = info.intensities.length
        const step = (info.last_x - info.first_x)/(num_points-1)
        var ppm = Array.from({length: num_points}, (_, i) => info.first_x + i*step)
        var spectrum_array = d3.zip(ppm, info.intensities)
        this.spectrum = spectrum_array.map(x => {
          return {ppm: x[0], intensity: x[1]}
        })
      },
      downloadNMRSpectrum() {
        const spectrum_string = "PPM Intensity\n" + this.spectrum.map(x => `${x.ppm} ${x.intensity}`).join("\n")
        var file = new Blob([spectrum_string], {type: "text/plain"})
        var a = document.createElement("a")
        a.setAttribute('download', true)
        a.href = window.URL.createObjectURL(file)
        a.download = "nmr spectrum.txt"
        a.click()
      },
    },
    components: {BModal, NMRSpectrumMetadata, NMRSpectrumPlot}
  }
</script>

<style>
  .spectrum-display-container {
    display: flex;
    justify-content: center;
    flex-direction: column;
    height: 100%
  }

  .graph-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .info-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 18px
  }
</style>