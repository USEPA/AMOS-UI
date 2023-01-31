<!--
  This component is used to display a plot of spectrum stored in the database, along with some relevant information
  about it.

  This component takes two props:
  - selectedRowData, a JSON object that contains an internal_id field corresponding to a record in the database
  - displayAdditionalInfo, a boolean value that partially controls whether text indicating that the spectrum is
    assocated with a method is displayed
-->

<template>
  <div class="spectrum-display-container">
    <div class="results-header">
      <p>Below is a plot of the spectrum as intensities versus mass-to-charge ratios (m/z).  Click and drag over a section of the horizontal axis to zoom; double click to zoom back out.  Intensities are scaled so that the highest peak has a value of 100.</p>
    </div>
    <div class="graph-container">
      <div id="graph" ref="graph">graph_placeholder</div>
    </div>
    <div class="info-container">
      <p>Information</p>
      <ul style="list-style-type: none;">
        <li><strong>Number of Points:</strong> {{ spectrum.length }}</li>
        <li><strong>Spectral Entropy:</strong> {{ spectral_entropy ? spectral_entropy.toFixed(4) : "Undefined" }}</li>
        <li><strong>Normalized Entropy:</strong> {{ normalized_entropy ? normalized_entropy.toFixed(4) : "Undefined" }}</li>
        <li><strong>Rating:</strong> {{ spectrum.length == 1 ? "N/A" : (spectral_entropy <= 3.0 & normalized_entropy <= 0.8 ? "Clean" : "Noisy") }}</li>
        <li><strong>SPLASH:</strong> <a :href="`https://www.google.com/search?q=${splash}`">{{ splash }}</a></li>
        <li v-if="has_associated_method && displayAdditionalInfo">There's an associated method for this spectrum; click <router-link :to="`/method_with_spectra/spectrum/${selectedRowData.internal_id}`">here</router-link> to view.</li>
      </ul>
      <button @click="show_table_modal = true">Show Points</button>
    </div>
    <b-modal v-model="show_table_modal">
      <ag-grid-vue
        class="ag-theme-balham"
        style="height:600px; width:100%"
        :columnDefs="column_defs"
        :rowData="spectrumAsRows(spectrum)"
        rowSelection="single"
      ></ag-grid-vue>
    </b-modal>
  </div>
</template>

<script>
  import axios from 'axios';
  import Dygraph from 'dygraphs';
  
  import '@/assets/search_results.css'
  import { BACKEND_LOCATION } from '@/assets/store';

  import '/node_modules/ag-grid-community/dist/styles/ag-grid.css'
  import '/node_modules/ag-grid-community/dist/styles/ag-theme-balham.css'
  import { AgGridVue } from "ag-grid-vue3"
  import 'ag-grid-enterprise'
  import { LicenseManager } from 'ag-grid-enterprise'
  LicenseManager.setLicenseKey('CompanyName=US EPA,LicensedGroup=Multi,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=5,LicensedProductionInstancesCount=0,AssetReference=AG-010288,ExpiryDate=3_December_2022_[v2]_MTY3MDAyNTYwMDAwMA==4abffeb82fbc0aaf1591b8b7841e6309')
  

  export default {
    data(){
      return {
        spectrumString: "",
        spectrum: [],
        spectral_entropy: 0,
        normalized_entropy: 0,
        splash: "",
        has_associated_method: false,
        show_table_modal: false,
        BACKEND_LOCATION,
        column_defs: [
          {field:'m/z', headerName:'m/z', flex: 1, sortable: true},
          {field:'intensity', headerName:'Peak Intensity', flex: 1, sortable: true}
        ]
      }
    },
    props: {selectedRowData: Object, displayAdditionalInfo: Boolean},
    watch: {
      selectedRowData(){
        this.getSpectrumData()
      }
    },
    async created() {
      this.getSpectrumData()
    },
    methods: {
      dummyLog() {
        console.log(this.selectedRowData)
      },
      async getSpectrumData() {
        const path = `${this.BACKEND_LOCATION}/get_spectrum/${this.selectedRowData.internal_id}`
        const response = await axios.get(path)
        this.spectrum = response.data.spectrum
        this.spectral_entropy = response.data.spectral_entropy
        this.normalized_entropy = response.data.normalized_entropy
        this.splash = response.data.splash
        this.has_associated_method = response.data.has_associated_method
        if (this.spectrum.length == 1){
          const padded_spectrum = [[this.spectrum[0][0] - 1, 0], this.spectrum[0], [this.spectrum[0][0] + 1, 0]]
          const g = new Dygraph(document.getElementById("graph"), padded_spectrum, {
            plotter: this.barChartPlotter,
            includeZero: true,
            labels: ["m/z", "Relative Intensity"],
            title: "Mass Spectrum",
            xlabel: "m/z",
            ylabel: "Relative Intensity",
            width: 600,
            height: 400,
            xRangePad: 100
          })
        } else {
          const g = new Dygraph(document.getElementById("graph"), this.spectrum, {
            plotter: this.barChartPlotter,
            includeZero: true,
            labels: ["m/z", "Relative Intensity"],
            title: "Mass Spectrum",
            xlabel: "m/z",
            ylabel: "Relative Intensity",
            width: 600,
            height: 400,
            xRangePad: 10
          })
        }
      },
      barChartPlotter(e) {
        const ctx = e.drawingContext
        const {points} = e
        const yBottom = e.dygraph.toDomYCoord(0)
        const barWidth = 1

        // Do the actual plotting.
        for (let i = 0; i < points.length; i += 1) {
            const p = points[i]
            const centerX = p.canvasx

            // center of the bar
            ctx.fillRect(centerX - barWidth / 2, p.canvasy,
            barWidth, yBottom - p.canvasy)
            ctx.strokeRect(centerX - barWidth / 2, p.canvasy,
            barWidth, yBottom - p.canvasy)
        }
      },
      spectrumAsRows(spectrum) {
        return spectrum.map(function(x){return {"m/z":x[0], "intensity":x[1]}})
      }
    },
    components: {AgGridVue}
  };
</script>

<style>
.spectrum-display-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 100%
}

.info-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 18px
}

.graph-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dygraph-label {
  text-align: center;
}

.dygraph-title {
  font-weight: bold;
}

.dygraph-label {
  text-align: center;
}

.dygraph-ylabel {
  transform: rotate(-90deg);
  margin-left: 38px;
}

.dygraph-legend {
  float: right;
  margin-top: 22px;
}
</style>