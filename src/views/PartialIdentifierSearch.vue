<template>
  This page runs searches for substances based on non-unique identifiers for a substance.  Searches can be done on three identifiers:
  <ul>
    <li>Substring of a substance name.  This will search for synonyms that contain the substring as well.</li>
    <li>First block of a substance's InChIKey.</li>
    <li>The exact molecular formula of a substance.</li>
  </ul>
  <div style="display: flex">
    <input @keyup.enter="runPartialSearch(search_term, search_type)" id="big-search-bar" name="big-search-bar" placeholder="Search..." size="60" v-model="search_term">
    <BFormSelect v-model="search_type" :options="search_type_options" size="sm" style="width: auto; padding: 0 2em 0 0.5em;"/>  <!-- width needs to be set to fix height issues for some reason -->
    <button @click="runPartialSearch(search_term, search_type)">Search</button>
  </div>
  <br />
  <p>{{ substances.length }} substances found; {{ filtered_record_count }} are currently displayed.</p>
  <ag-grid-vue
    class="ag-theme-balham"
    style="height:600px; width:100%"
    :defaultColDef="defaultColDef"
    :columnDefs="columnDefs"
    :rowData="substances"
    @grid-ready="onGridReady"
    @filter-changed="onFilterChanged"
    rowSelection="multiple"
    :suppressCopyRowsToClipboard="true"
  ></ag-grid-vue>
</template>

<script>
  import axios from 'axios'
  import {BFormSelect} from 'bootstrap-vue-next'

  import 'ag-grid-community/styles/ag-grid.css'
  import 'ag-grid-community/styles/ag-theme-balham.css'
  import { AgGridVue } from "ag-grid-vue3"
  import 'ag-grid-enterprise'
  import { LicenseManager } from 'ag-grid-enterprise'
  LicenseManager.setLicenseKey('CompanyName=US EPA,LicensedGroup=Multi,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=5,LicensedProductionInstancesCount=0,AssetReference=AG-010288,ExpiryDate=3_December_2022_[v2]_MTY3MDAyNTYwMDAwMA==4abffeb82fbc0aaf1591b8b7841e6309')

  import { imageLinkForSubstance } from '@/assets/common_functions'
  import { BACKEND_LOCATION, COMPTOX_PAGE_URL } from '@/assets/store'
  import RecordCountFilter from '@/components/RecordCountFilter.vue'

  export default {
    data() {
      return {
        BACKEND_LOCATION,
        COMPTOX_PAGE_URL,
        defaultColDef: {filter: 'agTextColumnFilter', floatingFilter: true, resizable: true},
        filtered_record_count: 0,
        search_term: "",
        search_type: "substring_search",
        search_type_options: [
          {value: "substring_search", text: "Name Substring"},
          {value: "inchikey_first_block_search", text: "InChIKey First Block"},
          {value: "formula_search", text: "Molecular Formula"}
        ],
        substances: [],
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
          {field: 'preferred_name', headerName: 'Preferred Name', sortable: true, sort: 'asc', flex: 1},
          {field: 'synonyms', headerName: 'Synonym', flex: 1, wrapText: true, autoHeight: true, hide: true, cellStyle: {'white-space': 'pre-line'}, cellRenderer: params => {
            return params.data.synonyms.join("\n")
          }},
          {field: 'monoisotopic_mass', headerName: 'Monoisotopic Mass', width: 150, filter: 'agNumberColumnFilter'},
          {field: 'molecular_formula', headerName: 'Formula', width: 120},
          {field: 'spectra', headerName: "Spectra", width: 110, sortable: true, filter: RecordCountFilter, filterParams: {record_name: "spectra"}, cellRenderer: params => {
            if (params.data.spectra > 0) {
              const link = document.createElement("a");
              link.href = this.$router.resolve(`/search/${params.data.dtxsid}?initial_results_tab=spectrum`).href;
              link.innerText = params.data.spectra;
              link.addEventListener("click", e => {
                e.preventDefault();
                window.open(`/search/${params.data.dtxsid}?initial_results_tab=spectrum`);
              });
              return link;
            } else {
              return 0
            }
          }},
          {field: 'methods', headerName: "Methods", width: 110, sortable: true, filter: RecordCountFilter, filterParams: {record_name: "methods"}, cellRenderer: params => {
            if (params.data.methods > 0) {
              const link = document.createElement("a");
              link.href = this.$router.resolve(`/search/${params.data.dtxsid}?initial_results_tab=method`).href;
              link.innerText = params.data.methods;
              link.addEventListener("click", e => {
                e.preventDefault();
                window.open(`/search/${params.data.dtxsid}?initial_results_tab=method`);
              });
              return link;
            } else {
              return 0
            }
          }},
          {field: 'fact_sheets', headerName: "Fact Sheets", width: 110, sortable: true, filter: RecordCountFilter, filterParams: {record_name: "fact sheets"}, cellRenderer: params => {
            if (params.data.fact_sheets > 0) {
              const link = document.createElement("a");
              link.href = this.$router.resolve(`/search/${params.data.dtxsid}?initial_results_tab=fact+sheet`).href;
              link.innerText = params.data.fact_sheets;
              link.addEventListener("click", e => {
                e.preventDefault();
                window.open(`/search/${params.data.dtxsid}?initial_results_tab=fact+sheet`);
              });
              return link;
            } else {
              return 0
            }
          }}
        ]
      }
    },
    async created()  {
      const query_params = Object.keys(this.$route.query)
      const search_types = this.search_type_options.map(x => x.value)
      for (const param of query_params) {
        console.log(param)
        console.log(search_types)
        if (search_types.includes(param)) {
          this.search_term = this.$route.query[param]
          this.search_type = param
          this.runPartialSearch(this.$route.query[param], param)
          break
        }
      }
    },
    methods: {
      async runPartialSearch(search_term, search_type) {
        const response = await axios.get(`${this.BACKEND_LOCATION}/${search_type}/${search_term}`)
        var substances = response.data.substances
        for (let i=0; i<substances.length; i++) {
          substances[i]["image_link"] = imageLinkForSubstance(substances[i].dtxsid, substances[i].image_in_comptox)
        }
        this.substances = substances
        
        this.gridColumnApi.setColumnsVisible(['synonyms'], search_type == "substring_search")
        this.gridApi.onFilterChanged()
      },
      onGridReady(params) {
        this.gridApi = params.api
        this.gridColumnApi = params.columnApi
        this.gridApi.onFilterChanged()

        this.gridColumnApi.applyColumnState({state: [
          {colId: "methods", sort: "desc", sortIndex: 0},
          {colId: "fact_sheets", sort: "desc", sortIndex: 1},
          {colId: "spectra", sort: "desc", sortIndex: 2}
        ]})
      },
      onFilterChanged(params) {
        this.filtered_record_count = this.gridApi.getDisplayedRowCount()
      }
    },
    components: {AgGridVue, BFormSelect, RecordCountFilter}
  }
</script>

<style>
  .ag-row .ag-cell {
    display: flex;
    align-items: center;
  }
</style>