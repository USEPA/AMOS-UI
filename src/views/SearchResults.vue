<!--
  This page displays the records that correspond to a single searched substance in a table, and will display information
  about the searched substance and any record in the all_results that is selected.

  This page can take one URL route parameter and four optional query parameters.  The route parameter is:
  - search_term: the term searched for; can be either a name, an InChIKey, a CASRN, or a DTXSID
  The query parameters are:
  - initial_results_tab: preselects which record type tab is selected.  If not supplied, all all_results will be shown
  - initial_row_selected: the internal ID of a record; if this parameter exists, the page will try to preselect this
    record's row once the table is loaded
-->

<template>
  <div class="two-column-page">
    <div class="half-page-column">
      <div class="all_results-header">
        <h1 v-if="still_searching" class="text-that-can-overflow">Searching for "{{$route.params.search_term}}"...</h1>
        <h1 v-else-if="!still_searching & no_substance_match">No substance match found.</h1>
        <div v-else>
          <h1 class="text-that-can-overflow">{{ all_results.length }} Results for "{{$route.params.search_term}}"</h1>
          <br/>
          <div class="chemical-box">
            <div class="chemical-image-highlight">
              <img v-if="image_link" class="chemical-image" :src="image_link"/>  
              <div v-else style="text-align: center; display: flex; align-items: center;">No structural representation was found for this substance.</div>
            </div>
            <div class="chemical-info">
              <ul style="list-style-type: none;">
                <li><strong>(Preferred) Name:</strong> {{ substance_info.preferred_name }} </li>
                <li><strong>DTXSID:</strong> <a :href="`${COMPTOX_PAGE_URL}${substance_info.dtxsid}`">{{ substance_info.dtxsid }}</a> </li>
                <li><strong>CASRN:</strong> {{ substance_info.casrn }} </li>
                <li><strong>InChIKey:</strong> {{ substance_info.indigo_inchikey ? substance_info.indigo_inchikey : substance_info.jchem_inchikey}} </li>
                <li><strong>Molecular Formula:</strong> {{ substance_info.molecular_formula }} </li>
                <li><strong>Mass:</strong> {{ substance_info.monoisotopic_mass }} </li>
                <li>&nbsp;</li>
                <li><button v-if="!still_searching" @click="downloadResultsAsExcel">Download Results</button></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div v-if="all_results.length > 0">
        <div>
          <input type="checkbox" id="single-point-spectra" v-model="result_filters.single_point_spectra" @change="updateCheckboxFilters">
          <label for="single-point-spectra">Display Single Point Spectra</label>
        </div>
        <div>
          <input type="checkbox" id="ms-ready" v-model="result_filters.ms_ready" @change="ms_ready_toggle">
          <label for="ms-ready">Include MS-Ready methods</label>
          &nbsp;
          <help-icon style="vertical-align:middle;" tooltipText="MS-Ready refers to a standardization of substances by collapsing isomers, salts, isotopes, etc., into a single form, identifiable by having the same first block of their InChIKey.  Selecting this will include methods from substances with the same MS-Ready form." />
        </div>
        <div>
          <input type="checkbox" id="spectrabase" v-model="result_filters.spectrabase" @change="updateCheckboxFilters">
          <label for="spectrabase">Include Spectrabase</label>
        </div>
      </div>
      <div v-if="!still_searching">
        <p v-if="no_substance_match">There is no substance in this database that matches the search term "{{$route.params.search_term}}" -- if something should be here, please check the search term for typos.</p>
        <p v-else-if="all_results.length==0">The search term "{{$route.params.search_term}}" matches a substance in the database; however, no data records were found.</p>
        <div v-else>
          <div class="tab-bar">
            <a :class="result_table_view_mode == 'all' ? 'active' : ''" @click="updateTab('all')">All Results ({{all_results.length}})</a>
            <a :class="determineTabBarClass('method')" @click="updateTab('method')">Methods ({{record_type_counts.method}})</a>
            <a :class="determineTabBarClass('spectrum')" @click="updateTab('spectrum')">Spectra ({{record_type_counts.spectrum}})</a>
            <a :class="determineTabBarClass('fact sheet')" @click="updateTab('fact sheet')">Fact Sheets ({{record_type_counts["fact sheet"]}})</a>
          </div>
          <ag-grid-vue
            class="ag-theme-balham"
            style="height:600px; width:100%"
            v-if="all_results.length > 0"
            :columnDefs="columnDefs"
            :rowData="all_results"
            rowSelection="single"
            @first-data-rendered="onGridReady"
            @row-selected="onRowSelected"
            :isExternalFilterPresent="isExternalFilterPresent"
            :doesExternalFilterPass="doesExternalFilterPass"
            :postSortRows="postSortRows"
          ></ag-grid-vue>
        </div>
      </div>
    </div>
    <div class="half-page-column">
      <p class="info-paragraph" v-if="view_type == 'none'">Click on a row in the table to the left to display either a spectrum (if available) or a PDF file in this space.</p>
      <SpectrumViewer v-else-if="view_type == 'Spectrum'" :internalID="selected_row_data.internal_id" displayAdditionalInfo/>
      <StoredPDFViewer v-else-if="view_type == 'PDF'" :internalID="selected_row_data.internal_id" :recordType="selected_row_data.record_type" displayAdditionalInfo/>
      <p class="info-paragraph" v-else>This database does not contain anything for this record.  Click the hyperlink in the "Record Type" column to be directed to the source.</p>
    </div>
    <b-modal size="xl" v-model="disambiguation.inchikey">
      <InchikeyDisambiguation :searchedKey="$route.params.search_term" :substances="possible_substances" :record_counts="record_counts_by_dtxsid" @inchikeySelected="disambiguate" />
    </b-modal>
    <b-modal size="xl" v-model="disambiguation.synonym">
      <SynonymDisambiguation :synonym="$route.params.search_term" :substances="possible_substances" :record_counts="record_counts_by_dtxsid" @synonymSelected="disambiguate" />
    </b-modal>
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

  import { getSubstanceImageLink } from '@/assets/common_functions'
  import { BACKEND_LOCATION, COMPTOX_PAGE_URL, SOURCE_ABBREVIATION_MAPPING } from '@/assets/store'
  import '@/assets/style.css'
  import HelpIcon from '@/components/HelpIcon.vue'
  import InchikeyDisambiguation from '@/components/InchikeyDisambiguation.vue'
  import SpectrumViewer from '@/components/SpectrumViewer.vue'
  import StoredPDFViewer from '@/components/StoredPDFViewer.vue'
  import SynonymDisambiguation from '@/components/SynonymDisambiguation.vue'

  export default {
    data(){
      return {
        view_type: "none",
        ambiguity_type: "",
        disambiguation: {inchikey: false, synonym: false},
        possible_substances: [],
        selected_row_data: {},
        all_results: [],
        results: {substance: [], ms_ready: []},
        substance_info: {},
        record_counts_by_dtxsid: {},
        still_searching: true,
        no_substance_match: false,
        has_image: true,
        image_link: "",
        tooltipShowDelay: 500,
        BACKEND_LOCATION,
        COMPTOX_PAGE_URL,
        SOURCE_ABBREVIATION_MAPPING,
        result_table_view_mode: "all",
        record_type_counts: {method: 0, "fact sheet": 0, spectrum: 0},
        ms_ready_search_run: false,
        result_filters: {ms_ready: false, single_point_spectra: true, spectrabase: false},
        columnDefs: [
          {field: 'methodologies', headerName: 'Methodology', sortable: true, sort: 'asc', filter: 'agTextColumnFilter', floatingFilter: true, width: 140, suppressSizeToFit: true},
          {field: 'source', headerName: 'Source', sortable: true, width: 110, suppressSizeToFit: true, filter: 'agTextColumnFilter', floatingFilter: true, cellRenderer: params => {
              if (params.data.link === null) {
                return params.data.source
              } else if (this.SOURCE_ABBREVIATION_MAPPING[params.data.source] && this.SOURCE_ABBREVIATION_MAPPING[params.data.source].full_name) {
                // adding has-hover-text here is needed since URL formatting apparently overrides supplying has-hover-text via cellClass
                return "<a href='" + params.data.link + "' target='_blank' class='has-hover-text'>" + params.data.source + "</a>";
              } else {
                return "<a href='" + params.data.link + "' target='_blank'>" + params.data.source + "</a>";
              }
            }, cellClass: params => {
              if (this.SOURCE_ABBREVIATION_MAPPING[params.data.source] && this.SOURCE_ABBREVIATION_MAPPING[params.data.source].full_name) {
                return "has-hover-text"
              }
            }, tooltipValueGetter: params => {
              if (this.SOURCE_ABBREVIATION_MAPPING[params.data.source]) {
                return this.SOURCE_ABBREVIATION_MAPPING[params.data.source].full_name
              }
            }
          },
          {field: 'record_type', headerName: 'Record Type', width: 110, suppressSizeToFit: true,
            cellRenderer: params => {
              if (params.data.data_type !== null) {
                return "<span class='fake-link'>" + params.data.record_type + "</span>"
              } else {
                return "<a href='" + params.data.link + "' target='_blank'>" + params.data.record_type + " Link</a>"
              }
            }
          },
          {field: 'method_number', headerName: 'Method #', width: 110, hide: true},
          {field: 'method_type', headerName: 'Method Type', width: 120, hide: true},
          {field: 'count', headerName: '#', width: 35, sortable: true, headerTooltip: "Number of substances in record."},
          {field: 'description', headerName: 'Information', sortable: true, flex: 1, tooltipField: 'comment', filter: 'agTextColumnFilter', floatingFilter: true, cellRenderer: params =>{
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
        this.gridColumnApi = params.columnApi

        // Sometimes we might want to pre-select a row when the all_results load; this logic takes care of it
        if (typeof(this.$route.query.initial_row_selected) === "string") {
          this.gridApi.forEachNode(node => {
            if (node.data.internal_id === this.$route.query.initial_row_selected) {
              node.setSelected(true)
              // need to run this manually, even though the documentation says setSelected should trigger onRowSelected
              this.onRowSelected({event: true, data: node.data})
            }
          })
        }

        if (typeof(this.$route.query.initial_results_tab) === "string") {
          this.updateTab(this.$route.query.initial_results_tab) 
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
      downloadResultsAsExcel() {
        this.gridApi.exportDataAsExcel({
          columnKeys: ["methodology", "source", "link", "record_type", "description"],
          fileName: this.$route.params.search_term + "_results.xlsx",
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
        if (!this.result_filters.single_point_spectra) {
          if (node.data.description && (node.data.description.includes("# PEAKS=1;") | node.data.description.endsWith("# PEAKS=1"))) {
            return false
          }
        }

        if (!this.result_filters.spectrabase && (node.data.source == "SpectraBase")) {
          return false
        }

        // filter out result types based on selected tab
        if (this.result_table_view_mode != "all") {
          return node.data.record_type.toLowerCase() == this.result_table_view_mode
        }

        return true
      },
      updateCheckboxFilters() {
        this.gridApi.onFilterChanged()
      },
      updateTab(tabName) {
        this.result_table_view_mode = tabName
        if (tabName === "fact sheet"){
          this.gridColumnApi.setColumnVisible('methodologies', false)
          this.gridColumnApi.setColumnVisible('method_number', false)
          this.gridColumnApi.setColumnVisible('method_type', false)
          this.gridColumnApi.setColumnVisible('record_type', true)
        } else if (tabName === "spectrum") {
          this.gridColumnApi.setColumnVisible('methodologies', true)
          this.gridColumnApi.setColumnVisible('method_number', false)
          this.gridColumnApi.setColumnVisible('method_type', false)
          this.gridColumnApi.setColumnVisible('record_type', true)
        } else if (tabName === "method") {
          this.gridColumnApi.setColumnVisible('methodologies', true)
          this.gridColumnApi.setColumnVisible('method_number', true)
          this.gridColumnApi.setColumnVisible('method_type', true)
          this.gridColumnApi.setColumnVisible('record_type', false)
        } else {
          // "All" case
          this.gridColumnApi.setColumnVisible('methodologies', true)
          this.gridColumnApi.setColumnVisible('method_number', false)
          this.gridColumnApi.setColumnVisible('method_type', false)
          this.gridColumnApi.setColumnVisible('record_type', true)
        }
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
      },
      disambiguate(dtxsid) {
        this.$router.push(`/search/${dtxsid}`)
      },
      postSortRows(params) {
        // Any node with a missing (null-valued) description will get booted to the end of the sorted list.
        let rowNodes = params.nodes
        let i = 0
        let n_elements = rowNodes.length
        while (i < n_elements) {
          const description = rowNodes[i].data.description
          if (description === null) {
            rowNodes.splice(rowNodes.length, 0, rowNodes.splice(i,1)[0])
            n_elements--
          } else {
            i++
          }
        }
      },
      async ms_ready_toggle() {
        if (this.result_filters.ms_ready) {
          if (this.ms_ready_search_run == false) {
            const response = await axios.get(`${this.BACKEND_LOCATION}/get_ms_ready_methods/${this.substance_info.jchem_inchikey}`)
            const main_ids = this.results.substance.map(x => x.internal_id)
            this.results.ms_ready = response.data.results.filter(x => !main_ids.includes(x.internal_id))
            this.ms_ready_search_run = true
          }
          this.all_results = this.results.substance.concat(this.results.ms_ready)
          this.record_type_counts.method = this.record_type_counts.method + this.results.ms_ready.length
        }
        else {
          this.all_results = this.results.substance
          this.record_type_counts.method = this.record_type_counts.method - this.results.ms_ready.length
        }
      }
    },
    async created() {
      // Start by trying to get the DTXSID for the search term.
      const response = await axios.get(`${this.BACKEND_LOCATION}/get_substances_for_search_term/${this.$route.params.search_term}`)
      // There are three possibilities: no search term found, search term found, search term is ambiguous (matches multiple substances by synonym/InChIKey).
      if (response.data.substances === null) {
        // No substance found.
        this.no_substance_match = true
        this.still_searching = false
      } else if (response.data.ambiguity) {
        // Search term is ambiguous.
        this.ambiguity_type = response.data.ambiguity
        this.possible_substances = response.data.substances
        const dtxsids = this.possible_substances.map(ps => ps.dtxsid)
        this.record_counts_by_dtxsid = await axios.post(`${this.BACKEND_LOCATION}/record_counts_by_dtxsid/`, {dtxsids: dtxsids})
        this.record_counts_by_dtxsid = this.record_counts_by_dtxsid.data
        if (response.data.ambiguity == "inchikey") {
          this.disambiguation.inchikey = true
        } else if (response.data.ambiguity == "synonym") {
          this.disambiguation.synonym = true
        }
      } else {
        // Search term matches one substance.
        const search_results = await axios.get(`${this.BACKEND_LOCATION}/search/${response.data.substances.dtxsid}`)
        this.all_results = search_results.data.records
        this.results.substance = search_results.data.records
        this.substance_info = response.data.substances
        this.record_type_counts = search_results.data.record_type_counts
        this.image_link = await getSubstanceImageLink(this.substance_info.dtxsid)
        this.still_searching = false
      }
    },
    components: {
      AgGridVue,
      HelpIcon,
      InchikeyDisambiguation,
      SpectrumViewer,
      StoredPDFViewer,
      SynonymDisambiguation
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