

<template>
  This page runs searches for substances based on identifiers that can match more than one substance -- potentially many substances.  Searches can be done on four identifiers:
  <ul>
    <li>Substring of a substance name.  This will search for recognized synonyms that contain the substring as well.</li>
    <li>The first block of a substance's InChIKey.</li>
    <li>
      The exact molecular formula of a substance in <a href="https://en.wikipedia.org/wiki/Chemical_formula#Hill_system">Hill form</a>.
      <help-icon style="vertical-align:middle;" tooltipText="Hill form lists the number of carbon atoms, then the number of hydrogen atoms, then counts of all other atoms in alphabetical order, with single-letter abbreviations coming before two-letter ones that start with the same letter (e.g., 'B' before 'Be').  If no carbon is present, all atoms (including hydrogen) are listed alphabetically.  For example, C2H5Br, BrClH2Si, and H2O4S are in Hill form." />
    </li>
    <li>A range of (monoisotopic) molecular masses.</li>
  </ul>
  <div style="display: flex">
    <input v-if="search_type !== 'mass_range_search'" @keyup.enter="runPartialSearch" placeholder="Search..." size="60" v-model="search_term">
    <div v-else>
      <MassRangeInput ref="massInput"/>
      &nbsp;
    </div>
    <BFormSelect v-model="search_type" :options="search_type_options" size="sm" style="width: auto; padding: 0 2em 0 0.5em;"/>  <!-- width needs to be set to fix height issues for some reason -->
    <button @click="runPartialSearch">Search</button>
  </div>
  <p v-if="search_type === 'mass_range_search'">Note: the size of the window in the mass range search is constrained to 0.5 Da or 25 ppm, as appropriate.  Input values larger than these will be coerced to the maximum values.</p>
  <br />
  <input type="checkbox" id="multicomponent-substance-toggle" v-model="show_multicomponent_substances" @change="updateTableFilters">
  <label for="multicomponent-substance-toggle">Show multicomponent substances</label>
  <br />
  <div style="display: flex; flex-direction: row; justify-content: space-between">
    <div>
      <button @click="searchToURL">Copy Search to URL</button>
      <button @click="resetSearch">Reset Selection</button>
      <button @click="downloadSearchResults">Download Table</button>
    </div>
    <button @click="sendToBatchSearch">Send Selected Substances to Batch Search</button>
  </div>
  <p v-if="status.search_complete">{{ status.search_type }} search complete for {{ status.searched_term }}. {{ substances.length }} substances found; {{ filtered_record_count }} are currently displayed.</p>
  <p v-else-if="status.searching" style="font-size: larger">Searching... <i class="mdi mdi-progress-clock mdi-spin"></i></p>
  <p v-else>No search has been run.</p>
  <ag-grid-vue
    class="ag-theme-balham"
    style="height:600px; width:100%"
    :defaultColDef="defaultColDef"
    :columnDefs="columnDefs"
    :rowData="substances"
    @grid-ready="onGridReady"
    @filter-changed="onFilterChanged"
    @row-double-clicked="onDoubleClick"
    :isExternalFilterPresent="isExternalFilterPresent"
    :doesExternalFilterPass="doesExternalFilterPass"
    rowSelection="multiple"
    :suppressCopyRowsToClipboard="true"
  ></ag-grid-vue>
</template>

<script>
  import axios from 'axios'
  import { BFormSelect } from 'bootstrap-vue-next'

  import 'ag-grid-community/styles/ag-grid.css'
  import 'ag-grid-community/styles/ag-theme-balham.css'
  import { AgGridVue } from "ag-grid-vue3"
  import 'ag-grid-enterprise'
  import { LicenseManager } from 'ag-grid-enterprise'
  LicenseManager.setLicenseKey('CompanyName=US EPA,LicensedGroup=Multi,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=5,LicensedProductionInstancesCount=0,AssetReference=AG-010288,ExpiryDate=3_December_2022_[v2]_MTY3MDAyNTYwMDAwMA==4abffeb82fbc0aaf1591b8b7841e6309')

  import { imageLinkForSubstance } from '@/assets/common_functions.js'
  import { BACKEND_LOCATION, COMPTOX_PAGE_URL } from '@/assets/store.js'
  import HelpIcon from '@/components/HelpIcon.vue'
  import MassRangeInput from '@/components/MassRangeInput.vue'
  import MassTableFilter from '@/components/MassTableFilter.vue'
  import RecordCountFilter from '@/components/RecordCountFilter.vue'
  import '@mdi/font/css/materialdesignicons.min.css';

  export default {
    data() {
      return {
        querySearch: false,
        mass_search_override: null,
        BACKEND_LOCATION,
        COMPTOX_PAGE_URL,
        defaultColDef: {filter: 'agTextColumnFilter', floatingFilter: true, resizable: true},
        filtered_record_count: 0,
        mass_error: 5,
        mass_error_type: "ppm",
        mass_target: null,
        search_term: "",
        search_type: "substring_search",
        show_multicomponent_substances: false,
        search_type_options: [
          {value: "substring_search", text: "Name substring"},
          {value: "inchikey_first_block_search", text: "InChIKey first block"},
          {value: "formula_search", text: "Molecular formula"},
          {value: "mass_range_search", text: "Monoisotopic mass range"}
        ],
        substances: [],
        status: {search_complete: false, searching: false, searched_term: "", search_type: ""},
        columnDefs: [{field:'image', headerName:'Structure', checkboxSelection: true, headerCheckboxSelection: true, floatingFilter: false, autoHeight: true, width: 120, wrapText: true, cellRenderer: (params) => {
            if (params.data.image_link) {
              var image = document.createElement('img');
              image.src = params.data.image_link
              image.style = "width:70px;height:70px;padding-top:2px;padding-bottom:2px;";
              image.alt = `Structure image for ${params.data.dtxsid}`
              return image;
            } else {
              var p = document.createElement('div')
              p.style = "width:70px;height:70px;padding-top:2px;padding-bottom:2px;text-align: center; line-height: 70px;";
              p.innerText = "No structure."
              return p
            }
          }},
          {field: 'dtxsid', headerName: 'DTXSID', width: 115, cellRenderer: params => {
            return "<a href='" + this.COMPTOX_PAGE_URL + params.data.dtxsid + "' target='_blank'>" + params.data.dtxsid + "</a>"
          }},
          {field: 'casrn', headerName: 'CASRN', width: 120},
          {field: 'preferred_name', headerName: 'Preferred Name', sortable: true, sort: 'asc', flex: 1, cellStyle: params => {
            if (this.search_type === "substring_search" && !params.value.toLowerCase().includes(this.search_term.toLowerCase())) {
              return {'font-style': 'italic'}
            }
          }},
          {field: 'synonyms', headerName: 'Synonym', flex: 1, wrapText: true, autoHeight: true, hide: true, cellStyle: {'white-space': 'pre-line'}, cellRenderer: params => {
            return params.data.synonyms.join("\n")
          }},
          {field: 'monoisotopic_mass', headerName: 'Monoisotopic Mass', width: 150, sortable: true, filter: MassTableFilter},
          {field: 'molecular_formula', headerName: 'Formula', width: 120},
          {field: 'spectra', headerName: "Spectra", width: 110, sortable: true, filter: RecordCountFilter, filterParams: {record_name: "spectra"}, cellRenderer: params => {
            if (params.data.spectra > 0) {
              const link = document.createElement("a");
              link.href = this.$router.resolve(`search/${params.data.dtxsid}?initial_results_tab=spectrum`).href;
              link.innerText = params.data.spectra;
              link.addEventListener("click", e => {
                e.preventDefault();
                window.open(`search/${params.data.dtxsid}?initial_results_tab=spectrum`);
              });
              return link;
            } else {
              return 0
            }
          }},
          {field: 'methods', headerName: "Methods", width: 110, sortable: true, filter: RecordCountFilter, filterParams: {record_name: "methods"}, cellRenderer: params => {
            if (params.data.methods > 0) {
              const link = document.createElement("a");
              link.href = this.$router.resolve(`search/${params.data.dtxsid}?initial_results_tab=method`).href;
              link.innerText = params.data.methods;
              link.addEventListener("click", e => {
                e.preventDefault();
                window.open(`search/${params.data.dtxsid}?initial_results_tab=method`);
              });
              return link;
            } else {
              return 0
            }
          }},
          {field: 'fact_sheets', headerName: "Fact Sheets", width: 110, sortable: true, filter: RecordCountFilter, filterParams: {record_name: "fact sheets"}, cellRenderer: params => {
            if (params.data.fact_sheets > 0) {
              const link = document.createElement("a");
              link.href = this.$router.resolve(`search/${params.data.dtxsid}?initial_results_tab=fact+sheet`).href;
              link.innerText = params.data.fact_sheets;
              link.addEventListener("click", e => {
                e.preventDefault();
                window.open(`search/${params.data.dtxsid}?initial_results_tab=fact+sheet`);
              });
              return link;
            } else {
              return 0
            }
          }},
          {field: 'source_count', headerName: 'Sources', width: 100, sortable: true},
          {field: 'patent_count', headerName: 'Patents', width: 100, sortable: true},
          {field: 'literature_count', headerName: 'Articles', width: 100, sortable: true}
        ]
      }
    },
    created() {
      // if there are any query parameters in the URL, set up the appropriate search
      const query_params = Object.keys(this.$route.query)
      const search_types = this.search_type_options.map(x => x.value)
      for (const param of query_params) {
        if (search_types.includes(param)) {
          this.querySearch = true
          this.search_type = param
          if (param === "mass_range_search") {
            const mass_search_params = this.$route.query[param].split("_")
            this.mass_search_override = {
              mass_target: Number(mass_search_params[0]),
              mass_error: Number(mass_search_params[1]),
              mass_error_type: mass_search_params[2]
            }
          } else {
            this.search_term = this.$route.query[param]
          }
          break
        }
      }
    },
    async mounted() {
      // if there are query parameters in the URL, run the search; the mass range search requires some special handling
      if (this.querySearch) {
        if (this.search_type === "mass_range_search") {
          this.$refs.massInput.$data.mass_target = this.mass_search_override.mass_target
          this.$refs.massInput.$data.mass_error = this.mass_search_override.mass_error
          this.$refs.massInput.$data.mass_error_type = this.mass_search_override.mass_error_type
        }
        await this.runPartialSearch()
      }
    },
    methods: {
      async runPartialSearch() {
        this.status.searching = true
        this.status.search_complete = false

        var response = null
        if (this.search_type === "mass_range_search") {
          const [lower_limit, upper_limit] = this.$refs.massInput.calculateRange()
          if (lower_limit === null) {
            // add an error case later
          }
          response = await axios.post(`${this.BACKEND_LOCATION}/${this.search_type}/`, {upper_mass_limit: upper_limit, lower_mass_limit: lower_limit})
          this.status.searched_term = `${this.$refs.massInput.$data.mass_target} Da +/- ${this.$refs.massInput.$data.mass_error} ${this.$refs.massInput.$data.mass_error_type==='da' ? 'Da' : 'ppm'}`
        } else {
          response = await axios.get(`${this.BACKEND_LOCATION}/${this.search_type}/${this.search_term}`)
          this.status.searched_term = this.search_term
        }
        this.status.search_type = this.search_type_options.find(x => x["value"]===this.search_type)["text"]

        var substances = response.data.substances
        for (let i=0; i<substances.length; i++) {
          substances[i]["image_link"] = imageLinkForSubstance(substances[i].dtxsid, substances[i].image_in_comptox)
        }
        this.substances = substances
        
        this.gridColumnApi.setColumnsVisible(['synonyms'], this.search_type === "substring_search")
        if (this.search_type === "mass_range_search") {
          this.gridColumnApi.applyColumnState({state: [
            {colId: "spectra", sort: "desc", sortIndex: 0}
          ]})
      } else {
          this.gridColumnApi.applyColumnState({state: [
          {colId: "methods", sort: "desc", sortIndex: 0},
          {colId: "fact_sheets", sort: "desc", sortIndex: 1},
          {colId: "spectra", sort: "desc", sortIndex: 2}
        ]})
        }
        this.gridApi.onFilterChanged()
        this.status.search_complete = true
        this.status.searching = false
      },
      searchToURL() {
        var query_param = ""
        if (this.search_type === "mass_range_search") {
          query_param = `${this.$refs.massInput.$data.mass_target}_${this.$refs.massInput.$data.mass_error}_${this.$refs.massInput.$data.mass_error_type}`
        } else {
          query_param = `${this.search_term}`
        }
        const url = `${window.location.origin}${this.$route.path}?${this.search_type}=${query_param}`

        // NOTE: the preferred way to copy to clipboard is apparently "navigator.clipboard.writeText()" these days. I
        // can't get that to work in this app, though, since it apparently requires a secured connection and the
        // deployed version of this app doesn't have that.  So I'm sticking to this technically-depricated solution that
        // I pulled out of CompTox's code, since it apparently works there.
        const textarea = document.createElement('textarea')
        textarea.value = url
        document.body.appendChild(textarea)
        textarea.select()
        try {
          document.execCommand('copy')
        } catch (err) {
          console.log('Cannot copy: ' + err)
        }
        document.body.removeChild(textarea)
      },
      resetSearch() {
        this.search_term = ""
        this.mass_target = null
        this.mass_error = null
      },
      downloadSearchResults() {
        let visible_columns = this.gridColumnApi.getAllDisplayedColumns().map(x => x.colId)

        this.gridApi.exportDataAsExcel({
          fileName: `${this.search_type}.xlsx`,
          columnKeys: visible_columns.filter(c => c !== "image")
        })
      },
      onGridReady(params) {
        this.gridApi = params.api
        this.gridColumnApi = params.columnApi
        this.gridApi.onFilterChanged()
      },
      onFilterChanged(params) {
        this.filtered_record_count = this.gridApi.getDisplayedRowCount()
      },
      sendToBatchSearch() {
        const dtxsid_list = this.gridApi.getSelectedRows().map(node => node.dtxsid)
        const target_href = `batch_search?dtxsids=${dtxsid_list.join(";")}`
        window.open(target_href)
      },
      onDoubleClick(event) {
        window.open(`search/${event.data.dtxsid}`)
      },
      isExternalFilterPresent() {
        return true
      },
      doesExternalFilterPass(node) {
        if (!this.show_multicomponent_substances) {
          if ((node.data.smiles !== null) && node.data.smiles.includes(".")) {
            return false
          }
        }
        return true
      },
      updateTableFilters() {
        this.gridApi.onFilterChanged()
        this.updateRecordCounts()
      }
    },
    components: {AgGridVue, BFormSelect, HelpIcon, MassRangeInput, MassTableFilter, RecordCountFilter}
  }
</script>

<style>
  .ag-row .ag-cell {
    display: flex;
    align-items: center;
  }
</style>