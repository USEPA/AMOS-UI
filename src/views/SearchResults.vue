<!--
  This page displays the records that correspond to a single searched compound in a table, and will display information
  about the searched compound and any record in the results that is selected.

  This page can take one URL route parameter and four optional query parameters.  The route parameter is:
  - search_term: the term searched for; can be either a compound name, an InChIKey, a CASRN, or a DTXSID
  The query parameters are:
  - methods, monographs, spectra: three parameters that toggle whether records of that type appear; if none are present,
    all records are displayed, otherwise it depends on which of those three appear with a value of 'true' in the query
    parameters
  - initial_row_selected: the internal ID of a record; if this parameter exists, the page will try to preselect this
    record's row once the table is loaded
-->

<template>
  <div class="two-column-page">
    <div class="half-page-column">
      <div class="results-header">
        <h1 v-if="still_searching" class="text-that-can-overflow">Searching for "{{$route.params.search_term}}"...</h1>
        <h1 v-else-if="!still_searching & no_compound_match">No compound match found.</h1>
        <div v-else>
          <h1 class="text-that-can-overflow">{{ results.length }} Results for "{{$route.params.search_term}}"</h1>
          <br/>
          <div class="chemical-box">
            <div class="chemical-image-highlight">
                <img class="chemical-image" :src="`https://comptox.epa.gov/dashboard-api/ccdapp1/chemical-files/image/by-dtxsid/${compound_info.dtxsid}`"/>
            </div>
            <div class="chemical-info">
              <ul style="list-style-type: none;">
                <li><strong>(Preferred) Name:</strong> {{ compound_info.preferred_name }} </li>
                <li><strong>DTXSID:</strong> <a :href="`https://comptox.epa.gov/dashboard/chemical/details/${compound_info.dtxsid}`">{{ compound_info.dtxsid }}</a> </li>
                <li><strong>CASRN:</strong> {{ compound_info.casrn }} </li>
                <li><strong>InChIKey:</strong> {{ compound_info.jchem_inchikey }} </li>
                <li><strong>Molecular Formula:</strong> {{ compound_info.molecular_formula }} </li>
                <li><strong>Mass:</strong> {{ compound_info.molecular_weight }} </li>
                <li>&nbsp;</li>
                <li><button v-if="!still_searching" @click="downloadResultsAsCSV">Download Results</button></li>
              </ul>
            </div>
          </div>
          <input type="checkbox" id="single-point-spectra" v-model="include_single_point_spectra" @change="updateCheckboxFilters">
          <label for="single-point-spectra">Display Single Point Spectra</label>
        </div>
      </div>
      <div v-if="!still_searching">
        <p v-if="no_compound_match">There is no compound in this database that matches the search term "{{$route.params.search_term}}" -- if something should be here, please check the search term for typos.</p>
        <p v-else-if="results.length==0">The search term "{{$route.params.search_term}}" matches a compound in the database; however, no data records were found.</p>
        <div v-else>
          <div class="tab-bar">
            <a :class="result_table_view_mode == 'all' ? 'active' : ''" @click="updateTab('all')">All Results ({{results.length}})</a>
            <a :class="determineTabBarClass('spectrum')" @click="updateTab('spectrum')">Spectra ({{record_type_counts.spectrum}})</a>
            <a :class="determineTabBarClass('monograph')" @click="updateTab('monograph')">Monographs ({{record_type_counts.monograph}})</a>
            <a :class="determineTabBarClass('method')" @click="updateTab('method')">Methods ({{record_type_counts.method}})</a>
          </div>
          <ag-grid-vue
            class="ag-theme-balham"
            style="height:600px; width:100%"
            v-if="results.length > 0"
            :columnDefs="columnDefs"
            :rowData="results"
            rowSelection="single"
            @first-data-rendered="onGridReady"
            @row-selected="onRowSelected"
            :isExternalFilterPresent="isExternalFilterPresent"
            :doesExternalFilterPass="doesExternalFilterPass"
          ></ag-grid-vue>
        </div>
      </div>
    </div>
    <div class="half-page-column">
      <p class="info-paragraph" v-if="view_type == 'none'">Click on a row in the table to the left to display either a spectrum (if available) or a PDF file in this space.</p>
      <SpectrumViewer v-else-if="view_type == 'Spectrum'" :internalID="selected_row_data.internal_id" displayAdditionalInfo/>
      <StoredPDFViewer v-else-if="view_type == 'PDF'" style="width: 50vw;" :internalID="selected_row_data.internal_id" :recordType="selected_row_data.record_type" displayAdditionalInfo/>
      <p class="info-paragraph" v-else>This database does not contain anything for this record.  Click the hyperlink in the "Record Type" column to be directed to the source.</p>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  import '/node_modules/ag-grid-community/dist/styles/ag-grid.css'
  import '/node_modules/ag-grid-community/dist/styles/ag-theme-balham.css'
  import { AgGridVue } from "ag-grid-vue3"
  import 'ag-grid-enterprise'
  import { LicenseManager } from 'ag-grid-enterprise'
  LicenseManager.setLicenseKey('CompanyName=US EPA,LicensedGroup=Multi,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=5,LicensedProductionInstancesCount=0,AssetReference=AG-010288,ExpiryDate=3_December_2022_[v2]_MTY3MDAyNTYwMDAwMA==4abffeb82fbc0aaf1591b8b7841e6309')

  import '@/assets/style.css'
  import '@/assets/search_results.css'
  import SpectrumViewer from '@/components/SpectrumViewer.vue'
  import StoredPDFViewer from '@/components/StoredPDFViewer.vue'
  import { BACKEND_LOCATION } from '@/assets/store'

  export default {
    data(){
      return {
        view_type: "none",
        selected_row_data: {},
        results: [],
        compound_info: {},
        still_searching: true,
        no_compound_match: false,
        tooltipShowDelay: 500,
        BACKEND_LOCATION,
        include_single_point_spectra: true,
        result_table_view_mode: "all",
        record_type_counts: {method: 0, monograph: 0, spectrum: 0},
        columnDefs: [
          {field: 'spectrum_types', headerName: 'Methodology', sortable: true, sort: 'asc', filter: 'agSetColumnFilter', width: 150, suppressSizeToFit: true},
          {field: 'source', headerName: 'Source', sortable: true, width: 110, suppressSizeToFit: true, cellRenderer: params => {
            // TODO: Will want a mapping for shorthands, rather than static cases like this.
            if (params.data.link === null) {
              return params.data.source
            } else if (params.data.source == "SWG") {
              return "<a href='" + params.data.link + "' target='_blank' title='Scientific Working Group' class='has-hover-text'>" + params.data.source + "</a>";
            } else if (params.data.source == "ECM") {
              return "<a href='" + params.data.link + "' target='_blank' title='Environmental Chemistry Methods' class='has-hover-text'>" + params.data.source + "</a>";
            } else {
              return "<a href='" + params.data.link + "' target='_blank'>" + params.data.source + "</a>";
            }
          }},
          {field: 'record_type', headerName: 'Record Type', filter: 'agSetColumnFilter', width: 110, suppressSizeToFit: true,
            cellRenderer: params => {
              if (params.data.data_type !== null) {
                return "<span class='fake-link'>" + params.data.record_type + "</span>"
              } else {
                return "<a href='" + params.data.link + "' target='_blank'>" + params.data.record_type + " Link</a>"
              }
            }
          },
          {field: 'description', headerName: 'Information', flex: 1, tooltipField: 'comment', cellRenderer: params =>{
            if (params.data.description === null) {
              return "No description available."
            } else {
              return params.data.description
            }
          }},
          {field: 'link', headerName: 'Link', hide: true}
        ]
      };
    },
    methods: {
      onGridReady(params) {
        this.gridApi = params.api

        // Code to set filters on table generation -- keeping just in case it's useful later
        //const st_instance = this.gridApi.getFilterInstance('spectrum_type');
        //st_instance.setModel({values: ['GC-MS', 'LC-MS+', 'LC-MS-', 'LC-MS-Unknown']});

        // TODO: there's gotta be a better way to handle the logic below, not sure it's even needed
        // with the tabs anymore...
        var filters_to_use = []
        if (typeof(this.$route.query.monographs) === "string" && typeof(this.$route.query.monographs) === "string" && typeof(this.$route.query.spectra) === "string"){
          if (this.$route.query.methods === "true"){filters_to_use.push("Method")}
          if (this.$route.query.monographs === "true"){filters_to_use.push("Monograph")}
          if (this.$route.query.spectra === "true"){filters_to_use.push("Spectrum")}
          const rec_instance = this.gridApi.getFilterInstance('record_type')
          rec_instance.setModel({values: filters_to_use})
        }
        if (typeof(this.$route.query.initial_row_selected) === "string") {
          this.gridApi.forEachNode(node => {
            if (node.data.internal_id === this.$route.query.initial_row_selected) {
              node.setSelected(true)
              // need to run this manually, even though the documentation says setSelected should trigger the row selected function
              this.onRowSelected({event: true, data: node.data})
            }
          })
        }
        this.gridApi.onFilterChanged()   //regenerates the table with the filter settings
        this.gridApi.sizeColumnsToFit()
      },
      onRowSelected(event) {
        // Row selection creates two events -- one for the selection, one for the deselection.  Only
        // the former has an "event" field inside it, so rely on that to filter the deselection
        // event out.
        if (event.event){
          this.view_type = event.data.data_type
          if (event.data.data_type == "Spectrum"){
            this.selected_row_data = event.data
          } else if (event.data.data_type == "PDF"){
            this.selected_row_data = event.data
          }
        }
      },
      downloadResultsAsCSV() {
        this.gridApi.exportDataAsCsv({
          columnKeys: ["methodology", "source", "link", "record_type", "description"],
          fileName: this.$route.params.search_term + "_results.csv",
          processCellCallback: cell => {
            // If a link is missing for a record, have it link back to the search page, with the record preselected
            if ((cell.column.colId === "link") & (cell.value === null)){
              return `${window.location.origin}/search/${this.$route.params.search_term}?initial_row_selected=${cell.node.data.internal_id}`
            } else {
              return cell.value
            }
          }
        });
      },
      isExternalFilterPresent() {
        return true
      },
      doesExternalFilterPass(node) {
        // Controls the filtering of records in the table -- so far, this amounts to handling the
        // toggling of single point spectra and switching between record types.
        let singlePointSpectrum = false
        if (node.data.description) {
          if (!this.include_single_point_spectra & (node.data.description.includes("# PEAKS=1;") | node.data.description.endsWith("# PEAKS=1"))) {
            console.log(node.data.description)
            singlePointSpectrum = true
          }
        }

        // filter out result types based on selected 
        let correctResultType = true
        if (this.result_table_view_mode != "all") {
          if (node.data.record_type.toLowerCase() != this.result_table_view_mode) {
            correctResultType = false
          }
        }

        return (!singlePointSpectrum) & correctResultType
      },
      updateCheckboxFilters() {
        this.gridApi.onFilterChanged()
      },
      updateTab(tabName) {
        this.result_table_view_mode = tabName
        this.gridApi.onFilterChanged()
      },
      determineTabBarClass(tab_label) {
        if (this.record_type_counts[tab_label] == 0) {
          return "disabled"
        } else if (this.result_table_view_mode == tab_label) {
          return "active"
        } else {
          return ""
        }
      }
    },
    async created() {
      const path = `${this.BACKEND_LOCATION}/search/${this.$route.params.search_term}`
      const response = await axios.get(path)
      this.still_searching = false
      if (response.data.no_compound_match === true) {
        this.no_compound_match = true
        console.log(`No compound match for "${this.$route.params.search_term}"`)
      } else {
        this.results = response.data.records
        this.compound_info = response.data.compound_info
        this.record_type_counts = response.data.record_type_counts
  
        if (this.$route.query.initial_results_tab) {
          const initial_tab = this.$route.query.initial_results_tab
          if (["spectrum", "monograph", "method"].includes(initial_tab.toLowerCase())) {
            this.result_table_view_mode = initial_tab
          }
        }
      }
    },
    components: {
      AgGridVue,
      SpectrumViewer,
      StoredPDFViewer
    }
  }
</script>

<style>
.info-paragraph {
  text-align: center;
  font-size: 20px;
}

.has-hover-text {
  text-decoration: underline dashed;
}

h1 {
  font-size: 2em;
}

</style>