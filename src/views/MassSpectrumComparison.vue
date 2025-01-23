<!--
  This page is used for loading a spectrum and displaying it.  The long-term intent is likely to involve comparisons
  with another spectrum in the database, but for now it just loads a spectrum supplied in a text box.

  There are no URL route or query parameters associated with this page.
-->

<template>
  <div>
    <p>This page visualizes and compares spectra.  Copy the spectra you want to visualize or compare into the text box(es), then use the buttons below to display them.  It should be in the form of space-delimited values for m/z and intensity, with one peak per line.  Input spectra are automatically rescaled to a maximum intensity of 100.</p>
    <div class="display-stuff">
      <div class="search-inputs" style="width: 44vw;">
        <div class="display-stuff">
          <div class="search-inputs">
            <h5>Spectrum #1</h5>
            <textarea type="text" class="batch-search-input" rows="15" columns="35" v-model="spectrum_box_1"></textarea>
          </div>
          <div v-if="dtxsid_mode" class="search-inputs" style="padding-left: 100px">
            <p>Database Spectra</p>
            <ag-grid-vue
              class="ag-theme-balham"
              style="height:486px; width:600px"
              :columnDefs="column_defs"
              :rowData="database_spectra"
              rowSelection="single"
              @row-selected="display_database_spectrum"
              @first-data-rendered="onGridReady"
              :suppressCopyRowsToClipboard="true"
            ></ag-grid-vue>
          </div>
          <div v-else class="search-inputs" style="padding-left: 100px">
            <h5>Spectrum #2</h5>
            <textarea type="text" class="batch-search-input" rows="15" columns="35" v-model="spectrum_box_2"></textarea>
          </div>
        </div>
        <br />
        <div style="align-items: left; width: 90%">
          <h5>Options</h5>
          Min peak height for comparison <input type="number" min="0" max="100" v-model="peak_threshold">%
          <br />
          <div style="padding-top: 10px;">
            Window for peak similarity <input type="number" min="0" max="25" v-model="similarity.window">
            &nbsp;
            <label><input type="radio" id="error_da" v-model="similarity.type" value="da">Da</label>
            &nbsp;
            <label><input type="radio" id="error_ppm" v-model="similarity.type" value="ppm">ppm</label>
            <br />
            NOTE: The size of the window in the mass range search is constrained to 0.5 Da or 25 ppm, as appropriate.  Input values larger than these will be coerced to the maximum values.
          </div>
        </div>
        <div class="button-array">
          <button @click="display_user_spectrum(spectrum_box_1, 'Spectrum #1')">Display Spectrum #1</button>
          <button v-if="dtxsid_mode" @click="display_database_spectrum()" style="margin-left:15px;margin-right:15px">Display Database Spectrum</button>
          <button v-else @click="display_user_spectrum(spectrum_box_2, 'Spectrum #2')" style="margin-left:15px;margin-right:15px">Display Spectrum #2</button>
          <button @click="display_both_spectra()">Display Both</button>
        </div>
      </div>
      <div class="info-container" style="padding-left: 100px; width: 44vw">
        <div v-if="spectrum_display == 'single'">
          <SingleMassSpectrumPlot :spectrum="spectrum1" :spectrum_name="plot_title" :peak_threshold="peak_threshold"/>
          <br />
          <p><strong>Spectral Entropy:</strong> {{ spectral_entropy.toFixed(4) }}</p>
        </div>
        <div v-else-if="spectrum_display == 'dual'">
          <DualMassSpectrumPlot :spectrum1="spectrum1" :spectrum2="spectrum2" :spectrum1_name="spectrum1_name" :spectrum2_name="spectrum2_name" :peak_threshold="peak_threshold" :window_size="similarity.window" :window_type="similarity.type"/>
          <br />
          <p><strong>Entropy Similarity:</strong> {{ entropy_similarity.toFixed(4) }}</p>
        </div>
      </div>
    </div>
    <BAlert variant="danger" v-model="error_messages.invalid_format" dismissible>
        There are issues with the contents of {{ error_messages.bad_spectrum_input_name }} -- please check to ensure it is correct.  The spectrum should be in the following format:
        <ul>
          <li>There should be one peak per line.</li>
          <li>Each peak should consist of an m/z value and an intensity, in that order, separated by spaces or tabs (no commas, semicolons, etc.).</li>
          <li>No characters except for numbers, spaces, and periods should be present.</li>
        </ul>
      </BAlert>
  </div>
</template>

<script>
  import axios from 'axios'
  import { BAlert } from 'bootstrap-vue-next'

  import 'ag-grid-community/styles/ag-grid.css'
  import 'ag-grid-community/styles/ag-theme-balham.css'
  import { AgGridVue } from "ag-grid-vue3"
  import 'ag-grid-enterprise'
  import { LicenseManager } from 'ag-grid-enterprise'
  LicenseManager.setLicenseKey('CompanyName=US EPA,LicensedGroup=Multi,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=5,LicensedProductionInstancesCount=0,AssetReference=AG-010288,ExpiryDate=3_December_2022_[v2]_MTY3MDAyNTYwMDAwMA==4abffeb82fbc0aaf1591b8b7841e6309')

  import { constrainNumber, rescaleSpectrum, validateSpectrumInput } from '@/assets/common_functions'
  import { BACKEND_LOCATION } from '@/assets/store';
  import DualMassSpectrumPlot from '@/components/DualMassSpectrumPlot.vue'
  import SingleMassSpectrumPlot from '@/components/SingleMassSpectrumPlot.vue'

  export default {
    data() {
      return {
        spectrum_box_1: "1 100\n3 100\n5 100",
        spectrum_box_2: "2 100\n4 100\n6 100",
        spectrum1: [],
        spectrum2: [],
        spectrum1_name: "",
        spectrum2_name: "",
        plot_title: "",
        spectral_entropy: 0,
        entropy_similarity: 0,
        peak_threshold: 5,
        spectrum_display: null,
        entropy_display: null,
        dtxsid_mode: false,
        dtxsids: [],
        database_spectra: [],
        substance_mapping: {},
        BACKEND_LOCATION,
        similarity: {window: 0.05, type: "da"},
        error_messages: {invalid_format: false, bad_spectrum_input_name: ""},
        column_defs: [
          {field: "dtxsid", headerName: "DTXSID", width: 140},
          {field: "name", headerName: "Name", width: 140, cellRenderer: params => {return this.substance_mapping[params.data.dtxsid]}},
          {field: "description", headerName: "Description", flex: 1}
        ]
      }
    },
    async created() {
      if (this.$route.query.dtxsids) {
        this.dtxsid_mode = true
        this.dtxsids = this.$route.query.dtxsids.split(",")
        const response = await axios.post(`${this.BACKEND_LOCATION}/mass_spectra_for_substances/`, {dtxsids: this.dtxsids})
        this.database_spectra = response.data.spectra
        this.substance_mapping = response.data.substance_mapping
        if (this.$route.query.spectrum) {
          this.spectrum_box_1 = this.$route.query.spectrum.replaceAll(":", " ").replaceAll(";", "\n")
        }
      }
    },
    methods: {
      async onRowSelected(event) {
        if (event.event) {
          this.display_database_spectrum()
        }
      },
      async display_user_spectrum(box_contents, box_name) {
        if (validateSpectrumInput(box_contents) === false) {
          this.error_messages.invalid_format = true
          this.error_messages.bad_spectrum_input_name = box_name
          return;
        }
        this.spectrum1 = box_contents.split("\n").map(x => x.trim().split(/\s+/).map(y => Number(y)))
        this.spectrum1 = rescaleSpectrum(this.spectrum1)
        this.plot_title = box_name
        this.spectral_entropy = await this.calculateSpectralEntropy(this.spectrum1)
        this.spectrum_display = "single"
      },
      async display_database_spectrum() {
        const selected_rows = this.gridApi.getSelectedRows()
        this.plot_title = "Database Spectrum"
        if (selected_rows.length > 0) {
          const row = selected_rows[0]
          this.spectrum1 = row.spectrum
          this.spectral_entropy = await this.calculateSpectralEntropy(this.spectrum1)
          this.spectrum_display = "single"
        } else {
          this.spectrum1 = []
        }
      },
      async display_both_spectra() {
        if (validateSpectrumInput(this.spectrum_box_1) === false) {

          this.error_messages.invalid_format = true
          this.error_messages.bad_spectrum_input_name = "Spectrum #1"
          return;
        }
        if (validateSpectrumInput(this.spectrum_box_2) === false) {
          this.error_messages.invalid_format = true
          this.error_messages.bad_spectrum_input_name = "Spectrum #1"
          return;
        }
        this.spectrum1 = this.spectrum_box_1.split("\n").map(x => x.trim().split(/\s+/).map(y => Number(y)))
        this.spectrum1 = rescaleSpectrum(this.spectrum1)
        this.plot_title = "Spectrum Comparison"
        if (this.dtxsid_mode) {
          this.spectrum2 = this.gridApi.getSelectedRows()[0].spectrum
          this.spectrum2 = rescaleSpectrum(this.spectrum2)
          this.spectrum1_name = "User Spectrum"
          this.spectrum2_name = "Database Spectrum"
        } else {
          this.spectrum2 = this.spectrum_box_2.split("\n").map(x => x.trim().split(/\s+/).map(y => Number(y)))
          this.spectrum2 = rescaleSpectrum(this.spectrum2)
          this.spectrum1_name = "Spectrum #1"
          this.spectrum2_name = "Spectrum #2"
        }
        const filtered_spectrum1 = this.spectrum1.filter(x => x[1] >= this.peak_threshold)
        const filtered_spectrum2 = this.spectrum2.filter(x => x[1] >= this.peak_threshold)
        this.entropy_similarity = await this.calculateEntropySimilarity(filtered_spectrum1, filtered_spectrum2)
        this.spectrum_display = "dual"
      },
      async calculateSpectralEntropy(spectrum) {
        // Calculates spectral entropy.
        // NOTE: This is currently not the same way that the spectral entropies stored in the database are calculated,
        // since a method of consolidating some peaks that isn't implemented here.
        const response = await axios.post(`${this.BACKEND_LOCATION}/spectral_entropy/`, {spectrum: spectrum})
        return response.data.entropy
      },
      async calculateEntropySimilarity(spectrum_1, spectrum_2) {
        if (this.similarity.type == "da") {
          this.similarity.window = constrainNumber(this.similarity.window, 0, 0.5)
        } else {
          this.similarity.window = constrainNumber(this.similarity.window, 0, 25)
        }
        const response = await axios.post(`${this.BACKEND_LOCATION}/entropy_similarity/`, {spectrum_1: spectrum_1, spectrum_2: spectrum_2, window: this.similarity.window, type: this.similarity.type})
        return response.data.similarity
      },
      onGridReady(params) {
        this.gridApi = params.api
      }
    },
    components: { AgGridVue, BAlert, DualMassSpectrumPlot, SingleMassSpectrumPlot }
  }
</script>

<style>
  .search-inputs {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .display-stuff {
    display: flex;
    flex-direction: row;
  }

  .info-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 18px
  }

  .button-array {
    margin: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
</style>