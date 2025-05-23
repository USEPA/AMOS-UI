<!--
  This page displays a list of all methods in the database, along with information useful for filtering them down.

  This page can accept some query parameters for pre-populating filters in the result table; a link containing these
  query parameters is generated by the "Copy Filters to Clipboard" button.
-->

<template>
  <div>
    <p>Below is a list of methods currently in the database.  Double-click on a row to display the method and its substances in another tab.  Cells in the table with a dashed underline have hovertext.</p>
    <div v-if="status.loading">
      <p>Loading methods...{{ method_info.length.toLocaleString() }} of {{ status.full_count.toLocaleString() }} retrieved.</p>
      <BProgress :value="method_info.length" :max="status.full_count" style="margin: 10px;"/>
      <br />
    </div>
    <div v-else>
      <p>{{method_info.length.toLocaleString()}} methods in total are present in the database; {{ filtered_record_count.toLocaleString() }} {{filtered_record_count == 1 ? "is" : "are"}} currently displayed, covering {{substance_count.toLocaleString()}} {{substance_count == 1 ? "substance" : "substances"}}.</p>
      <div>
        <label for="full-table-filter">Full Table Filter</label> &nbsp;
        <input type="text" v-model="full_table_filter" name="full-table-filter" @keyup="quickFilter(full_table_filter)">
        &nbsp;
        <help-icon style="vertical-align:middle;" tooltipText="The contents of this field act as a filter on all columns in the table, returning all results where the filter appears in any field." />
      </div>
      <div class="button-array">
        <button @click="saveFiltersAsURL">Copy Filters to Clipboard</button>
        <button @click="downloadCurrentTable">Download Table</button>
        <button @click="downloadSubstancesInMethods" :disabled="filtered_record_count==0">Download Substances</button>
        <button @click="resetFilters">Reset Filters</button>
      </div>
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
      :tooltipShowDelay="500"
      :suppressCopyRowsToClipboard="true"
      :animateRows="false"
    ></ag-grid-vue>
    <br />
    <p>Some usage notes:</p>
    <ul>
      <li>There are two fields in the table hidden by default -- an author and a publisher field.  Searches from the full-table search field will still include them, however.</li>
      <li>If you wish to hide or show columns, hover over a column name, click on the menu icon that appears on the right, and use the rightmost tab to toggle columns.</li>
    </ul>
  </div>
</template>

<script>
  import axios from 'axios'
  import { BProgress } from 'bootstrap-vue-next'

  import 'ag-grid-community/styles/ag-grid.css'
  import 'ag-grid-community/styles/ag-theme-balham.css'
  import { AgGridVue } from "ag-grid-vue3"
  import 'ag-grid-enterprise'
  import { LicenseManager } from 'ag-grid-enterprise'
  LicenseManager.setLicenseKey('CompanyName=US EPA,LicensedGroup=Multi,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=5,LicensedProductionInstancesCount=0,AssetReference=AG-010288,ExpiryDate=3_December_2022_[v2]_MTY3MDAyNTYwMDAwMA==4abffeb82fbc0aaf1591b8b7841e6309')

  import { filtersToURL, queryParamsToFilters, sourceAbbreviationTooltip, timestampForFile } from '@/assets/common_functions.js'
  import { BACKEND_LOCATION, ANALYTE_MAPPING, METHOD_DOCUMENT_TYPES, METHODOLOGY_MAPPING, SOURCE_ABBREVIATION_MAPPING } from '@/assets/store.js'
  import HelpIcon from '@/components/HelpIcon.vue'
  import '@/styles/main.css'

  export default {
    data() {
      return {
        ANALYTE_MAPPING,
        BACKEND_LOCATION,
        SOURCE_ABBREVIATION_MAPPING,
        METHODOLOGY_MAPPING,
        METHOD_DOCUMENT_TYPES,
        method_info: [],
        default_column_def: {resizable: true, filter: 'agTextColumnFilter', floatingFilter: true, filterParams: {maxNumConditions: 1}},
        full_table_filter: "",
        filtered_record_count: 0,
        substance_count: 0,
        status: {loading: true, loaded_count: 0, full_count: 0},
        NUMERIC_COLUMNS: ["year_published"],
        TEXT_COLUMNS: ["analyte", "author", "functional_classes", "document_type", "limitation", "matrix", "method_name", "method_number", "methodologies", "publisher", "source"],
        column_defs: [
          {field: "method_number", headerName: "Method #", width: 100},
          {field: "method_name", headerName: "Name", tooltipField: 'method_name', sortable: true, flex: 2.5, cellClass: 'fake-link'},
          {field: "year_published", headerName: "Year", width: 85, sortable: true, filter: 'agNumberColumnFilter'},
          {field: "methodologies", headerName: "Methodology", width: 115, sortable: true, cellRenderer: params => {
              if (params.data.methodologies) {
                const methodology_html = params.data.methodologies.map(m => {
                  if (this.METHODOLOGY_MAPPING[m] && this.METHODOLOGY_MAPPING[m].full_name) {
                    return `<span class='has-hover-text' title='${this.METHODOLOGY_MAPPING[m].full_name}'>${m}</span>`
                  } else {
                    return m
                  }
                })
                return methodology_html.join("; ")
              }
            }
          },
          {field: "source", headerName: "Source", width: 95, sortable: true, tooltipValueGetter: params => {
              return sourceAbbreviationTooltip(params.data.source)
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
                  return tooltipValue
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
          {field: "functional_classes", headerName: "Functional Classes", sortable: true, flex: 1, tooltipField: "functional_classes"},
          {field: "matrix", headerName: "Matrix", sortable: true, flex: 1, tooltipField: "matrix"},
          {field: "limit_of_detection", headerName: "LOD", tooltipField: "limit_of_detection", width: 80},
          {field: "limit_of_quantiation", headerName: "LOQ", tooltipField: "limit_of_quantiation", width: 80},
          {field: "document_type", headerName: "Type", width: 80, tooltipValueGetter: params => {
              if (this.METHOD_DOCUMENT_TYPES[params.data.document_type]) {
                return this.METHOD_DOCUMENT_TYPES[params.data.document_type]
              }
            }, cellClass: params => {
              if (this.METHOD_DOCUMENT_TYPES[params.data.document_type]) {
                return "has-hover-text"
              }
            }
          },
          {field: "count", headerName: "# Substances", width: 90, filter: 'agNumberColumnFilter', sortable: true, headerTooltip: "Number of substances in method."},
          {field: "author", headerName: "Author(s)", hide: true},
          {field: "publisher", headerName: "Publisher", hide: true},
          {field: "link", headerName: "Link", hide: true}
        ]
      }
    },
    async created() {
      const timerFunc = (t) => new Promise(resolve => setTimeout(resolve, t))

      const count_response = await axios.get(`${this.BACKEND_LOCATION}/record_type_count/methods`)
      const method_count = count_response.data.record_count
      this.status.full_count = method_count

      const BATCH_SIZE = 1000
      const num_pages = Math.ceil(method_count / BATCH_SIZE)

      for (let i = 0; i < num_pages; i++) {
        const batch_response = await axios.get(`${this.BACKEND_LOCATION}/method_pagination/${BATCH_SIZE}/${i*BATCH_SIZE}`)
        const batch_results = batch_response.data.results
        this.method_info = this.method_info.concat(batch_results)
      }
      // pause for half a second to make sure the last batch of data is properly loaded
      await timerFunc(500)
      this.status.loading = false
      this.gridApi.onFilterChanged();
    },
    methods: {
      onDoubleClick(event) {
        window.open(`view_method/${event.data.internal_id}`)
      },
      onGridReady(params) {
        this.gridApi = params.api;
        
        // load query parameters
        if (Object.keys(this.$route.query).includes("full_table")) {
          this.full_table_filter = this.$route.query["full_table"]
          this.gridApi.setGridOption('quickFilterText', this.full_table_filter)
        }
        const filter_object = queryParamsToFilters(this.$route.query, this.NUMERIC_COLUMNS, [], this.TEXT_COLUMNS)
        this.gridApi.setFilterModel(filter_object)

        this.gridApi.onFilterChanged();
      },
      saveFiltersAsURL() {
        const current_filters = this.gridApi.getFilterModel();
        var url = filtersToURL(window.location.origin + "/amos" + this.$route.path, current_filters)
        if (this.full_table_filter) {
          url = url + `full_table=${this.full_table_filter}`
        }

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
      async onFilterChanged(params) {
        this.filtered_record_count = this.gridApi.getDisplayedRowCount()
        const internal_id_list = Array(this.filtered_record_count).fill().map((_,idx) => this.gridApi.getDisplayedRowAtIndex(idx).data.internal_id)
        const count_response = await axios.post(`${this.BACKEND_LOCATION}/count_substances_in_ids/`, {internal_id_list: internal_id_list})
        this.substance_count = count_response.data.count
      },
      quickFilter(input) {
        this.gridApi.setGridOption('quickFilterText', input)
      },
      async downloadSubstancesInMethods() {
        const internal_id_list = Array(this.filtered_record_count).fill().map((_,idx) => this.gridApi.getDisplayedRowAtIndex(idx).data.internal_id)
        
        await axios.post(`${this.BACKEND_LOCATION}/substances_for_ids/`, {internal_id_list: internal_id_list}, {responseType: "blob"}).then(res => {
          let blob = new Blob([res.data], {type: res.headers['content-type']})
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = `method_list_substances_${timestampForFile()}.xlsx`
          link.click()
        })
      },
      downloadCurrentTable() {
        var visible_columns = this.gridApi.getAllDisplayedColumns().map(x => x.colId)
        visible_columns.push("link")
        this.gridApi.exportDataAsExcel({
          fileName: `method_list_${timestampForFile()}.xlsx`,
          columnKeys: visible_columns
        });
      },
      resetFilters() {
        this.gridApi.setFilterModel(null);
        this.full_table_filter = ""
        this.quickFilter("")
      },
    },
    components: {
      AgGridVue, BProgress, HelpIcon
    }
  }
</script>

<style>
  /* .progress-bar {
    background-color: #0e6993;
  } */
</style>