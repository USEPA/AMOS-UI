<!--
  This page runs a search for mass spectra in the database.  Potential spectra are filtered by a mass range for the
  substance and a methodology filter (GC/MS or LC/MS); individual spectra are then compared against the user spectrum
  and sorted by entropy similarity.

  This page does not take any URL route or query parameters.
-->
<template>
  <p>This page is for searching the database for mass spectra similar to a user-supplied one.  Currently, this is just being done by mass (with a margin of error) and the methodology of the spectrum.  The prepopulated values below are an example using a caffeine spectrum copied directly from the database.</p>
  <div class="two-column-page">
    <div class="half-page-column">
      <h5>Mass Information</h5>
      <div>
        Target Mass
        <MassRangeInput ref="massInput" />
        <div style="padding-top: 10px; padding-bottom: 10px;">
          Window for peak similarity <input type="number" min="0" max="25" v-model="similarity.window">
          &nbsp;
          <label><input type="radio" id="error_da" v-model="similarity.type" value="da">Da</label>
          &nbsp;
          <label><input type="radio" id="error_ppm" v-model="similarity.type" value="ppm">ppm</label>
        </div>
        <p>NOTE: The target mass and entropy similarity window ranges are constrained to 0.5 Da or 25 ppm, as appropriate.  Input values larger than these will be coerced to the maximum values.  Please use the neutral mass of the substance when searching.</p>
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
        <p>Note: This spectrum will be automatically rescaled to a maximum intensity of 100 in plots.</p>
        <textarea type="text" class="batch-search-input" style="width:250px;" rows="20" v-model="user_spectrum_string"></textarea>
      </div>
      <br />
      <button @click="spectrum_search">Search</button>
    </div>
    <div class="half-page-column">
      <div v-if="status.searching">
        <p style="font-size: larger">Searching... <i class="mdi mdi-progress-clock mdi-spin" /></p>
      </div>
      <div v-else-if="error_messages.invalidFormat">
        <BAlert variant="danger" v-model="error_messages.invalidFormat">
          There are issues with the contents of the user spectrum -- please check to ensure it is correct.  The spectrum should be in the following format:
          <ul>
            <li>There should be one peak per line.</li>
            <li>Each peak should consist of an m/z value and an intensity, in that order, separated by spaces or tabs (no commas, semicolons, etc.).</li>
            <li>No characters except for numbers, spaces, and periods should be present.</li>
          </ul>
        </BAlert>
      </div>
      <div v-else-if="!status.any_search_complete">
        <p></p>
      </div>
      <div v-else-if="results.length > 0">
        Minimum similarity to show: <input type="number" step="0.1" min="0.1" max="1" v-model="min_spectrum_similarity">
        <br />
        Search found {{ results.length }} spectra covering {{ unique_substances }} substances; {{ visible_info.spectra }} spectra covering {{ visible_info.substances }} substances are visible below.
        <ag-grid-vue
          class="ag-theme-balham"
          style="height:400px; width:100%"
          v-if="results.length > 0"
          :columnDefs="columnDefs"
          :rowData="results"
          rowSelection="single"
          @row-selected="onRowSelected"
          @first-data-rendered="onGridReady"
          @filter-changed="onFilterChanged"
          suppressAggFuncInHeader="true"
          :isExternalFilterPresent="isExternalFilterPresent"
          :doesExternalFilterPass="doesExternalFilterPass"
          :autoGroupColumnDef="autoGroupColumnDef"
          :suppressCopyRowsToClipboard="true"
          :animateRows="false"
        ></ag-grid-vue>
        <br />
        <div v-if="any_row_selected" style="display: flex; flex-direction: column; align-items: center">
          <DualMassSpectrumPlot style="display: flex;" :spectrum1="user_spectrum_array" :spectrum2="row_data.spectrum" spectrum1_name="User Spectrum" :spectrum2_name="row_data.dtxsid" :window_size="similarity.window" :window_type="similarity.type"/>
          <br />
          <p><strong>Source</strong>: <a :href="row_data.link" target="_blank">{{ row_data.source }}</a></p>
          <br />
          <div style="display: flex;">
            <button @click="show_modal.table = true">Show Points</button>
            <button v-if="row_data.spectrum_metadata" @click="show_modal.metadata = true">Spectrum Info</button>
          </div>
        </div>
      </div>
      <p v-else>No spectra matching the specified parameters were found.</p>
    </div>
  </div>
  <!-- Modal window that displays the spectrum in an AG Grid table.-->
  <BModal id="spectrum_table" v-model="show_modal.table">
    <ag-grid-vue
      class="ag-theme-balham"
      style="height:600px; width:100%"
      :columnDefs="spectrum_table_column_defs"
      :rowData="spectrumAsRows(row_data.spectrum)"
      rowSelection="single"
      :suppressCopyRowsToClipboard="true"
      :animateRows="false"
    ></ag-grid-vue>
    <button @click="copySpectrum()">Copy to Clipboard</button>
  </BModal>

  <!-- Modal window that displays the metadata associated with the spectrum, using the spectrum_metadata field from the database. -->
  <BModal v-if="row_data.spectrum_metadata" v-model="show_modal.metadata" ref="metadata_modal">
    <MassSpectrumMetadata :spectrumMetadata=row_data.spectrum_metadata />
  </BModal>
</template>

<script>
  import axios from 'axios'
  import { BAlert, BModal } from 'bootstrap-vue-next'
  
  import 'ag-grid-community/styles/ag-grid.css'
  import 'ag-grid-community/styles/ag-theme-balham.css'
  import { AgGridVue } from "ag-grid-vue3"
  import 'ag-grid-enterprise'
  import { LicenseManager } from 'ag-grid-enterprise'
  LicenseManager.setLicenseKey('CompanyName=US EPA,LicensedGroup=Multi,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=5,LicensedProductionInstancesCount=0,AssetReference=AG-010288,ExpiryDate=3_December_2022_[v2]_MTY3MDAyNTYwMDAwMA==4abffeb82fbc0aaf1591b8b7841e6309')
  
  import { rescaleSpectrum, validateSpectrumInput } from '@/assets/common_functions.js'
  import { BACKEND_LOCATION, COMPTOX_PAGE_URL } from '@/assets/store.js'
  import DualMassSpectrumPlot from '@/components/DualMassSpectrumPlot.vue'
  import MassRangeInput from '@/components/MassRangeInput.vue'
  import MassSpectrumMetadata from '@/components/MassSpectrumMetadata.vue'
  import '@/styles/main.css'
  import '@mdi/font/css/materialdesignicons.min.css';

  export default{
    data() {
      return {
        methodology: "LC/MS",
        min_spectrum_similarity: 0.1,
        results: [],
        unique_substances: 0,
        visible_info: {spectra: 0, substances: 0},
        user_spectrum_string: "53.84601 0.040218\n59.7077 0.039517\n69.04531 0.269281\n71.112045 0.036707\n83.06077 0.233345\n110.071434 2.046293\n111.055466 0.068346\n123.04299 0.058855\n124.86625 0.049269\n132.70123 0.047547\n138.06598 34.97314\n151.09726 0.06952\n156.07649 0.046879\n180.06517 0.067487\n181.07085 0.058521\n195.08736 100",
        user_spectrum_array: [],
        show_plot: false,
        BACKEND_LOCATION,
        COMPTOX_PAGE_URL,
        error_messages: {invalidFormat: false},
        substance_mapping: {},
        show_modal: {metadata: false, table: false},
        any_row_selected: false,
        row_data: {spectrum: [], spectrum_metadata: {}, dtxsid: "", source: "", link: ""},
        status: {searching: false, any_search_complete: false},
        similarity: {window: 0.05, type: "da"},
        columnDefs: [
          {field: 'dtxsid', hide: true, headerName: "Substance", width: 300, rowGroup: true, cellRenderer: params => {
            return "<a href='" + this.$router.resolve(`search/${params.value}`).href + "' target='_blank'>" + params.value + "</a> (" + this.substance_mapping[params.value] + ")"
          }},
          {field: 'similarity', headerName: "Similarity", width: 100, sort: "desc", aggFunc: 'max', cellRenderer:'agGroupCellRenderer', cellRendererParams: {
            innerRenderer: params => {if (params.value !== null){return params.value.toFixed(4)}}
          }},
          {field: 'description', headerName: 'Description', flex: 1},
          {field: 'internal_id', headerName: 'Internal ID', hide: true}
        ],
        autoGroupColumnDef: {headerName: 'DTXSID (Name)', width: 300, sortable: true},
        spectrum_table_column_defs: [
          {field:'m/z', headerName:'m/z', flex: 1, sortable: true},
          {field:'intensity', headerName:'Peak Intensity', flex: 1, sortable: true}
        ]
      }
    },
    watch: {
      min_spectrum_similarity(new_val, old_val){
        this.gridApi.onFilterChanged()
      }
    },
    methods: {
      async spectrum_search() {
        this.status.searching = true
        this.user_spectrum_string = this.user_spectrum_string.trim()
        if (validateSpectrumInput(this.user_spectrum_string) === false) {
          this.status.searching = false
          this.error_messages.invalidFormat = true
          return;
        }

        const [lower_mass_limit, upper_mass_limit] = this.$refs.massInput.calculateRange()
        this.user_spectrum_array = this.user_spectrum_string.split("\n").map(x => x.trim().split(/\s+/).map(y => Number(y)))
        this.user_spectrum_array = rescaleSpectrum(this.user_spectrum_array)
        const response = await axios.post(
          `${this.BACKEND_LOCATION}/mass_spectrum_similarity_search/`,
          {upper_mass_limit: upper_mass_limit, lower_mass_limit: lower_mass_limit, methodology: this.methodology, spectrum: this.user_spectrum_array, window: this.similarity.window, type: this.similarity.type}
        )
        this.results = response.data.results
        this.unique_substances = response.data.unique_substances
        this.substance_mapping = response.data.substance_mapping
        this.status.any_search_complete = true
        this.status.searching = false
      },
      onGridReady(params) {
        this.gridApi = params.api
        this.gridApi.onFilterChanged()
      },
      onRowSelected(event) {
        if(event.event) {
          this.row_data = event.data
          this.show_plot = true
          this.any_row_selected = true
        } else {
          this.show_plot = false
        }
      },
      onFilterChanged() {
        //this.visible_info.spectra = this.gridApi.getModel().rootNode.allChildrenCount
        var spectrum_count = 0
        this.gridApi.forEachNodeAfterFilter(x => {spectrum_count += x.childrenAfterFilter ? x.childrenAfterFilter.length : 0})
        this.visible_info.spectra = spectrum_count
        this.visible_info.substances = this.gridApi.getDisplayedRowCount()
      },
      isExternalFilterPresent() {
        return true
      }, 
      doesExternalFilterPass(node) {
        return node.data.similarity > this.min_spectrum_similarity
      },
      copySpectrum() {
        const spectrum_string = "m/z Intensity\n" + this.row_data.spectrum.map(x => `${x[0]} ${x[1]}`).join("\n");
        // NOTE: the preferred way to copy to clipboard is apparently "navigator.clipboard.writeText()" these days. I
        // can't get that to work in this app, though, since it apparently requires a secured connection and the
        // deployed version of this app doesn't have that.  So I'm sticking to this technically-depricated solution that
        // I pulled out of CompTox's code, since it apparently works there.
        const textarea = document.createElement('textarea')
        textarea.value = spectrum_string
        document.getElementById("spectrum_table").appendChild(textarea)
        textarea.select()
        try {
          document.execCommand('copy')
        } catch (err) {
          console.log('Cannot copy: ' + err)
        }
        document.getElementById("spectrum_table").removeChild(textarea)
      },
      spectrumAsRows(selected_spectrum) {
        return selected_spectrum.map(function(x){return {"m/z":x[0], "intensity":x[1]}})
      }
    },
    async mounted() {
      // Dunno why the wait is needed here and not in the partial identifier search...
      const timerFunc = (t) => new Promise(resolve => setTimeout(resolve, t))

      this.$refs.massInput.$data.mass_target = 194.1
      this.$refs.massInput.$data.mass_error_type = "da"
      await timerFunc(50)
      this.$refs.massInput.$data.mass_error = 0.1
    },
    components: {AgGridVue, BAlert, BModal, DualMassSpectrumPlot, MassRangeInput, MassSpectrumMetadata}
  }

</script>