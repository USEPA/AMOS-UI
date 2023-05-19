<!--
  This page serves as a list of all methods contained in the database.  Currently, unlike the monographs, the table
  describing the methods fills the entire window, so the method cannot be displayed in the same window.  Double-clicking
  a row in the table will open the method's PDF in a new window.

  There are no URL route or query parameters associated with this page.
-->

<template>
  <div>
    <p>Below is a list of methods currently in the database.  Double-click on a row to display the method and its compounds in another tab.  Cells in the table with a dashed underline have hovertext, usually for expanding out abbreviations in the cell content (it will take a second or two for the hovertext to appear).</p>
    <p>{{method_info.length}} methods in total are present in the database; {{ filtered_record_count }} {{filtered_record_count == 1 ? "is" : "are"}} currently displayed.</p>
    <div>
      <label for="full-table-filter">Full Table Filter</label> &nbsp;
      <input type="text" v-model="full_table_filter" name="full-table-filter" @keyup="quickFilter(full_table_filter)">
      &nbsp;
      <help-icon style="vertical-align:middle;" tooltipText="The contents of this field act as a filter on all columns in the table, returning all results where the filter appears in any field." />
    </div>
    <div class="button-array">
      <button @click="saveFiltersAsURL">Copy filters to clipboard</button>
      <button @click="downloadCompoundsInMethods" :disabled="filtered_record_count==0">Download Compounds</button>
      <button @click="resetFilters">Reset Filters</button>
    </div>
    <ag-grid-vue
      class="ag-theme-balham"
      style="height:600px; width:100%"
      :defaultColDef="default_column_def"
      :columnDefs="column_defs"
      :rowData="method_info"
      @grid-ready="onGridReady"
      rowSelection="single"
      @row-double-clicked="onDoubleClick"
      @filter-changed="onFilterChanged"
    ></ag-grid-vue>
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
  import { BACKEND_LOCATION, ANALYTE_MAPPING, METHODOLOGY_MAPPING, SOURCE_ABBREVIATION_MAPPING } from '@/assets/store'
  import HelpIcon from '@/components/HelpIcon.vue'

  export default {
    data() {
      return {
        ANALYTE_MAPPING,
        BACKEND_LOCATION,
        SOURCE_ABBREVIATION_MAPPING,
        METHODOLOGY_MAPPING,
        method_info: null,    //starting this as null instead of an empty array means the loading overlay will trigger
        default_column_def: {resizable: true, filter: 'agTextColumnFilter', floatingFilter: true, filterParams: {maxNumConditions: 1}},
        full_table_filter: "",
        filtered_record_count: 0,
        column_defs: [
          {field: "method_number", headerName: "Method #"},
          {field: "method_name", headerName: "Name", tooltipField: 'method_name', sortable: true, flex: 1, cellClass: 'fake-link'},
          {field: "year_published", headerName: "Year", width: 90, sortable: true, filter: 'agNumberColumnFilter'},
          {field: "methodology", headerName: "Methodology", width: 115, sortable: true, tooltipValueGetter: params => {
              if (this.METHODOLOGY_MAPPING[params.data.methodology]) {
                return this.METHODOLOGY_MAPPING[params.data.methodology].full_name
              }
            }, cellClass: params => {
              if (this.METHODOLOGY_MAPPING[params.data.methodology] && this.METHODOLOGY_MAPPING[params.data.methodology].full_name) {
                return "has-hover-text"
              }
            }
          },
          {field: "source", headerName: "Source", width: 100, sortable: true, tooltipValueGetter: params => {
              if (this.SOURCE_ABBREVIATION_MAPPING[params.data.source]) {
                return this.SOURCE_ABBREVIATION_MAPPING[params.data.source].full_name
              }
            }, cellRenderer: params => {
              const src = params.data.source
              if (this.SOURCE_ABBREVIATION_MAPPING[src]) {
                const link = this.SOURCE_ABBREVIATION_MAPPING[src].link
                if (this.SOURCE_ABBREVIATION_MAPPING[src].full_name) {
                  return `<a href='${link}' target='_blank' class='has-hover-text'>${src}</a>`
                } else {
                  return `<a href='${link}' target='_blank'>${src}</a>`
                }
              } else {
                return params.data.source
              }
            }
          },
          {field: "analyte", headerName: "Analyte", sortable: true, flex: 1, tooltipValueGetter: params => {
              if (params.data.analyte) {
                var tooltipValue = params.data.analyte
                if (tooltipValue) {
                  for (const k of Object.keys(this.ANALYTE_MAPPING)) {
                    if (tooltipValue.includes(k)) {
                      tooltipValue = tooltipValue.replaceAll(k, this.ANALYTE_MAPPING[k])
                    }
                  }
                  if (tooltipValue != params.data.analyte) {
                    return tooltipValue
                  }
                }
              }
            }, cellClass: params => {
              if (params.data.analyte) {
                for (const k of Object.keys(this.ANALYTE_MAPPING)) {
                  if (params.data.analyte.includes(k)) {
                    return "has-hover-text"
                  }
                }
              }
            }
          },
          {field: "chemical_class", headerName: "Chemical Class", sortable: true, flex: 1},
          {field: "matrix", headerName: "Matrix", sortable: true, flex: 1.2},
          {field: "count", headerName: "# Compounds", width: 120, floatingFilter: false, sortable: true}
        ]
      }
    },
    async created() {
      const path = `${this.BACKEND_LOCATION}/method_list`
      const response = await axios.get(path)
      this.method_info = response.data.results
    },
    methods: {
      onDoubleClick(event) {
        window.open(`/view_method/${event.data.internal_id}`)
      },
      onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        for (const k of Object.keys(this.$route.query)) {
          if (k === "full_table") {
            this.full_table_filter = this.$route.query[k]
            this.gridApi.setQuickFilter(this.full_table_filter)
          } else {
            const filter_params = this.$route.query[k].split("_")
            this.gridApi.getFilterInstance(k).setModel({type: filter_params[0], filter: filter_params[1]})
          }
        }
        this.gridApi.onFilterChanged();
      },
      saveFiltersAsURL() {
        const current_filters = this.gridApi.getFilterModel();
        var url = window.location.origin + this.$route.path + "?"
        if (this.full_table_filter) {
          url = url + `full_table=${this.full_table_filter}&`
        }
        url = url + Object.keys(current_filters).map(x => `${x}=${current_filters[x].type}_${current_filters[x].filter}`).join("&")

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
      onFilterChanged(params) {
        this.filtered_record_count = this.gridApi.getDisplayedRowCount()
      },
      quickFilter(input) {
        this.gridApi.setQuickFilter(input)
      },
      async downloadCompoundsInMethods() {
        const internal_id_list = Array(this.filtered_record_count).fill().map((_,idx) => this.gridApi.getDisplayedRowAtIndex(idx).data.internal_id)
        const response = await axios.post(`${this.BACKEND_LOCATION}/compounds_for_ids/`, {internal_id_list: internal_id_list})

        const anchor = document.createElement('a')
        anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(response.data.csv_string);
        anchor.target = '_blank';
        anchor.download = 'method_list_compounds.csv';
        anchor.click();
      },
      resetFilters() {
        this.gridApi.setFilterModel(null);
        this.quickFilter("")
      }
    },
    components: {
      AgGridVue, HelpIcon
    }
  }
</script>

<style>
.button-array {
  margin: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>