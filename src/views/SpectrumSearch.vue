<template>
  <p>This page is intended for searching the database for spectra.  Currently, this is just being done by mass (with a margin of error) and the methodology of the spectrum.</p>
  <div class="two-column-page">
    <div class="half-page-column">
      <h5>Mass Information</h5>
      <div>
        <input type="text" v-model.number="mass_target" name="search-dtxsid"> Da ± &nbsp;<input type="text" v-model.number="mass_error" name="search-dtxsid">
        &nbsp;
        <label><input type="radio" id="error_da" v-model="error_type" value="error_da">Da</label>
        &nbsp;
        <label><input type="radio" id="error_ppm" v-model="error_type" value="error_ppm">ppm</label>
        <p>WARNING: Wide mass intervals can severly slow down the app due to retrieving large spectra; there are currently no limits on what mass values can be collected, so be careful.</p>
      </div>
      <br />
      <div>
        <h5>Methodology</h5>
        <select v-model="methodology">
          <option value="GC/MS">GC/MS</option>
          <option value="LC/MS">LC/MS</option>
        </select>
      </div>
      <br />
      <div>
        <h5>User Spectrum</h5>
        <textarea type="text" class="batch-search-input" style="width:250px;" rows="12" v-model="user_spectrum_string"></textarea>
      </div>
      <br />
      <button @click="spectrum_search">Search</button>
    </div>
    <div class="half-page-column">
      Second column test.
      <ag-grid-vue
        class="ag-theme-balham"
        style="height:400px; width:100%"
        v-if="results.length > 0"
        :columnDefs="columnDefs"
        :rowData="results"
        rowSelection="single"
        @row-selected="onRowSelected"
        @first-data-rendered="onGridReady"
      ></ag-grid-vue>
      <p v-else>No results available.</p>
      <div id="graph" ref="graph"></div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import Dygraph from 'dygraphs';
  import { BACKEND_LOCATION } from '@/assets/store'

  import '/node_modules/ag-grid-community/dist/styles/ag-grid.css'
  import '/node_modules/ag-grid-community/dist/styles/ag-theme-balham.css'
  import { AgGridVue } from "ag-grid-vue3"
  import 'ag-grid-enterprise'
  import { LicenseManager } from 'ag-grid-enterprise'
  LicenseManager.setLicenseKey('CompanyName=US EPA,LicensedGroup=Multi,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=5,LicensedProductionInstancesCount=0,AssetReference=AG-010288,ExpiryDate=3_December_2022_[v2]_MTY3MDAyNTYwMDAwMA==4abffeb82fbc0aaf1591b8b7841e6309')

  import '@/assets/style.css'

  export default{
    data() {
      return {
        mass_target: 491,
        mass_error: 0.2,
        error_type: "error_da",
        methodology: "LC/MS",
        results: [],
        user_spectrum_string: "",
        user_spectrum_array: "",
        show_plot: false,
        BACKEND_LOCATION,
        columnDefs: [
          {field: 'dtxsid', headerName: 'DTXSID', width: 140},
          {field: 'dtxcid', headerName: 'DTXCID', width: 140},
          {field: 'similarity', headerName: "Similarity", width: 100, sort: "desc"},
          {field: 'description', headerName: 'Description', flex: 1},
          {field: 'internal_id', headerName: 'Internal ID', hide: true}
        ]
      }
    },
    methods: {
      async spectrum_search() {
        var lower_mass_limit = 0
        var upper_mass_limit = 0
        if (this.error_type == "error_da"){
          lower_mass_limit = this.mass_target - this.mass_error
          upper_mass_limit = this.mass_target + this.mass_error
        } else if (this.error_type == "error_ppm") {
          const mass_change = this.mass_target * this.mass_error / 1000000.0
          lower_mass_limit = this.mass_target - mass_change
          upper_mass_limit = this.mass_target + mass_change
        } else {
          console.log("Unknown value for error_type.")
        }
        const response = await axios.post(`${this.BACKEND_LOCATION}/spectrum_search/`, {upper_mass_limit: upper_mass_limit, lower_mass_limit: lower_mass_limit, methodology: this.methodology})
        this.user_spectrum_array = this.user_spectrum_string.split("\n").map(x => x.split(" ").map(y => Number(y)))
        
        this.results = response.data.results.map(x => {x.similarity = Number(this.calculateEntropySimilarity(this.user_spectrum_array, x.spectrum).toFixed(4)); return x})
      },
      onGridReady(params) {
        this.gridApi = params.api
      },
      calculateSpectralEntropy(a_spectrum) {
        // Calculates spectral entropy.
        // NOTE: This is currently not the same way that the spectral entropies stored in the database are calculated,
        // since that a method of consolidating some peaks that isn't implemented here.
        const total_intensity = a_spectrum.map(x => x[1]).reduce((a,b) => a+b, 0)
        const scaled_intensities = a_spectrum.map(x => x[1]/total_intensity)
        return scaled_intensities.map(x => -1*x*Math.log(x)).reduce((a,b) => a+b, 0)
      },
      calculateEntropySimilarity(spectrum_a, spectrum_b) {
        // Intended to calculate the entropy similarity, the formula for which I got from a paper sent to me by Tony.
        // There seem to be some differences in implementation compared to the paper, though, as I can get negative
        // values under certain circumstances.
        var combined_spectrum = []
        var idx_a = 0, idx_b = 0
        while ((idx_a < spectrum_a.length) | (idx_b < spectrum_b.length)) {
          if (idx_a == spectrum_a.length) {
            combined_spectrum.push(spectrum_b[idx_b])
            idx_b += 1
          } else if (idx_b == spectrum_b.length) {
            combined_spectrum.push(spectrum_a[idx_a])
            idx_a += 1
          } else if (spectrum_a[idx_a][0] == spectrum_b[idx_b][0]) {
            combined_spectrum.push([spectrum_a[idx_a][0], spectrum_a[idx_a][1] + spectrum_b[idx_b][1]])
            idx_a += 1
            idx_b += 1
          } else if (spectrum_a[idx_a][0] < spectrum_b[idx_b][0]) {
            combined_spectrum.push(spectrum_a[idx_a])
            idx_a += 1
          } else {
            combined_spectrum.push(spectrum_b[idx_b])
            idx_b += 1
          }
        }

        const sAB = this.calculateSpectralEntropy(combined_spectrum)
        const sA = this.calculateSpectralEntropy(spectrum_a)
        const sB = this.calculateSpectralEntropy(spectrum_b)
        return 1 - (2 * sAB - sA - sB)/Math.log(4)
      },
      display_both_spectra(stored_spectrum, dtxsid) {
        var spectrum = this.user_spectrum_array.map(x => [x[0],x[1],null]).concat(stored_spectrum.map(x => [x[0],null,x[1]]))
        spectrum.sort((a,b) => {
            // need to sort points by m/z because dygraph assumes the data is sorted on the independent variable
            if (a[0] > b[0]) {
                return 1
            } else if (a[0] < b[0]) {
                return -1
            } else {
                return 0
            }
        })
        
        if (spectrum.length == 1){
            const padded_spectrum = [[spectrum[0][0] - 1, 0], spectrum[0], [spectrum[0][0] + 1, 0]]
            const g = new Dygraph(document.getElementById("graph"), padded_spectrum, {
                plotter: this.barChartPlotter,
                includeZero: true,
                labels: ["m/z", "User Spectrum", dtxsid],
                title: "Combined Mass Spectra",
                xlabel: "m/z",
                ylabel: "Relative Intensity",
                width: 600,
                height: 400,
                xRangePad: 100
            })
        } else {
            const g = new Dygraph(document.getElementById("graph"), spectrum, {
                plotter: this.barChartPlotter,
                includeZero: true,
                labels: ["m/z", "User Spectrum", dtxsid],
                title: "Combined Mass Spectra",
                xlabel: "m/z",
                ylabel: "Relative Intensity",
                width: 600,
                height: 400,
                xRangePad: 10,
                series: {'User Spectrum':{color: "orange"}, [dtxsid]:{"color":"green"}}
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
      onRowSelected(event) {
        if(event.event) {
          this.show_plot = true
          this.display_both_spectra(event.data.spectrum, event.data.dtxsid)
          //console.log(event)
        } else {
          this.show_plot = false
        }
      }
    },
    components: {AgGridVue}
  }

</script>

<style>
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