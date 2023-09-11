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
      <div v-if="results.length > 0">
        Search found {{ results.length }} spectra covering {{ unique_substances }} substances.
        <ag-grid-vue
          class="ag-theme-balham"
          style="height:400px; width:100%"
          v-if="results.length > 0"
          :columnDefs="columnDefs"
          :rowData="results"
          rowSelection="single"
          @row-selected="onRowSelected"
          @first-data-rendered="onGridReady"
          suppressAggFuncInHeader="true"
          :autoGroupColumnDef="autoGroupColumnDef"
        ></ag-grid-vue>
        <div style="display: block;">
          <div id="graph" ref="graph" style="display: flex;"></div>
          <div v-if="any_row_selected">
            <button @click="show_modal.table = true">Show Points</button>
            <button v-if="spectrum_metadata" @click="show_modal.metadata = true">Spectrum Info</button>
          </div>
        </div>
      </div>
      <p v-else>No results available.</p>
    </div>
  </div>
  <!-- Modal window that displays the spectrum in an AG Grid table.-->
  <b-modal v-model="show_modal.table">
    <ag-grid-vue
      class="ag-theme-balham"
      style="height:600px; width:100%"
      :columnDefs="column_defs"
      :rowData="spectrumAsRows(selected_spectrum)"
      rowSelection="single"
    ></ag-grid-vue>
    <button @click="copySpectrum()">Copy to Clipboard</button>
  </b-modal>

  <!-- Modal window that displays the metadata associated with the spectrum, using the spectrum_metadata field from the database. -->
  <b-modal v-model="show_modal.metadata" ref="metadata_modal">
    <h5 v-if="spectrum_metadata && spectrum_metadata.Chromatography">Chromatography Info:</h5>
    <ul v-if="spectrum_metadata && spectrum_metadata.Chromatography" style="list-style-type: none;" ref="metadata_modal">
      <li v-for="c in Object.entries(spectrum_metadata.Chromatography)"><strong>{{c[0]}}:</strong> {{c[1]}}</li>
    </ul>
    <br />
    <h5 v-if="spectrum_metadata && spectrum_metadata.Spectrometry">Spectrometry Info:</h5>
    <ul v-if="spectrum_metadata && spectrum_metadata.Spectrometry" style="list-style-type: none;">
      <li v-for="s in Object.entries(spectrum_metadata.Spectrometry)"><strong>{{s[0]}}:</strong> {{s[1]}}</li>
    </ul>
    <button @click="copyMetadata()">Copy to Clipboard</button>
  </b-modal>
  <b-alert variant="warning" dismissible v-model="error_messages.invalidFormat">There are issues with the contents of the user spectrum -- please check to ensure it is correct.</b-alert>
</template>

<script>
  import axios from 'axios'
  import Dygraph from 'dygraphs';
  import { validateSpectrumInput } from '@/assets/common_functions'
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
        mass_target: 194,
        mass_error: 0.1,
        error_type: "error_da",
        methodology: "LC/MS",
        results: [],
        unique_substances: 0,
        user_spectrum_string: "53.84601 0.040218\n59.7077 0.039517\n69.04531 0.269281\n71.112045 0.036707\n83.06077 0.233345\n110.071434 2.046293\n111.055466 0.068346\n123.04299 0.058855\n124.86625 0.049269\n132.70123 0.047547\n138.06598 34.97314\n151.09726 0.06952\n156.07649 0.046879\n180.06517 0.067487\n181.07085 0.058521\n195.08736 100",
        user_spectrum_array: [],
        show_plot: false,
        BACKEND_LOCATION,
        error_messages: {invalidFormat: false},
        substance_mapping: {},
        show_modal: {metadata: false, table: false},
        any_row_selected: false,
        spectrum_metadata: {},
        selected_spectrum: [],
        columnDefs: [
          {field: 'dtxsid', hide: true, headerName: "Substance", width: 300, rowGroup: true, cellRenderer: params => {
            return `${params.value} (${this.substance_mapping[params.value]})`
          }},
          {field: 'similarity', headerName: "Similarity", width: 100, sort: "desc", aggFunc: 'max', cellRenderer:'agGroupCellRenderer', cellRendererParams: {
            innerRenderer: params => {return params.value.toFixed(4)}
          }},
          {field: 'description', headerName: 'Description', flex: 1},
          {field: 'internal_id', headerName: 'Internal ID', hide: true}
        ],
        autoGroupColumnDef: {headerName: 'DTXSID (Name)', width: 300, sortable: true},
        column_defs: [
          {field:'m/z', headerName:'m/z', flex: 1, sortable: true},
          {field:'intensity', headerName:'Peak Intensity', flex: 1, sortable: true}
        ]
      }
    },
    methods: {
      async spectrum_search() {
        this.user_spectrum_string = this.user_spectrum_string.trim()
        if (validateSpectrumInput(this.user_spectrum_string) === false) {
          this.error_messages.invalidFormat = true
          return;
        }
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
        this.user_spectrum_array = this.user_spectrum_string.split("\n").map(x => x.split(" ").map(y => Number(y)))
        const response = await axios.post(
          `${this.BACKEND_LOCATION}/spectrum_similarity_search/`,
          {upper_mass_limit: upper_mass_limit, lower_mass_limit: lower_mass_limit, methodology: this.methodology, spectrum: this.user_spectrum_array}
        )
        this.results = response.data.results
        this.unique_substances = response.data.unique_substances
        this.substance_mapping = response.data.substance_mapping
      },
      onGridReady(params) {
        this.gridApi = params.api
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
          this.selected_spectrum = event.data.spectrum
          this.spectrum_metadata = event.data.spectrum_metadata
          this.any_row_selected = true
        } else {
          this.show_plot = false
        }
      },
      spectrumAsRows(selected_spectrum) {
        return selected_spectrum.map(function(x){return {"m/z":x[0], "intensity":x[1]}})
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