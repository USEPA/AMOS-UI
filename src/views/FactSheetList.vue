<!--
  This page displays a list of all fact sheets in the database, as well as being able to display the fact sheets and
  associated compounds themselves.

  This page takes no URL route or query parameters.
-->

<template>
  <div class="two-column-page">
    <div class="half-page-column">
      <p>
        This is a list of fact sheets available in the database.
      </p>
      <p>{{fact_sheet_info.length}} fact sheets in total are present in the database; {{ filtered_record_count }} {{filtered_record_count == 1 ? "is" : "are"}} currently displayed.</p>
      <div>
        <label for="full-table-filter">Full Table Filter</label> &nbsp;
        <input type="text" v-model="full_table_filter" name="full-table-filter" @keyup="quickFilter(full_table_filter)">
        &nbsp;
        <help-icon style="vertical-align:middle;" tooltipText="The contents of this field act as a filter on all columns in the table, returning all results where the filter appears in any field." />
      </div>
      <div class="button-array">
        <button @click="saveFiltersAsURL">Copy filters to clipboard</button>
        <button @click="downloadCurrentTable">Download Table</button>
        <button @click="downloadCompoundsInDocs" :disabled="filtered_record_count==0">Download Compounds</button>
        <button @click="resetFilters">Reset Filters</button>
      </div>
      <ag-grid-vue
        class="ag-theme-balham"
        style="height:800px; width:100%"
        :defaultColDef="default_column_def"
        :columnDefs="column_defs"
        :rowData="fact_sheet_info"
        rowSelection="single"
        @first-data-rendered="onGridReady"
        @row-selected="onRowSelected"
        @filter-changed="onFilterChanged"
      ></ag-grid-vue>
    </div>
    <StoredPDFViewer style="width: 48vw;" v-if="any_fact_sheet_selected" :internalID="selected_row_data.internal_id" recordType="fact sheet"/>
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
  import StoredPDFViewer from '@/components/StoredPDFViewer.vue'
  import { BACKEND_LOCATION, SOURCE_ABBREVIATION_MAPPING } from '@/assets/store'
  import HelpIcon from '@/components/HelpIcon.vue'

  export default {
    data(){
      return {
        SOURCE_ABBREVIATION_MAPPING,
        selected_row_data: {},
        fact_sheet_info: null,
        any_fact_sheet_selected: false,  // used to avoid having a box with an error pop up if nothing's been selected yet,
        BACKEND_LOCATION,
        filtered_record_count: 0,
        full_table_filter: "",
        default_column_def: {resizable: true},
        column_defs: [
          {field: 'internal_id', headerName: 'Doc ID', sortable: true, width: 80},
          {field: 'fact_sheet_name', headerName: 'Fact Sheet Name', sortable: true, filter: 'agTextColumnFilter', floatingFilter: true, sort: "asc", flex: 1},
          {field: 'source', headerName: 'Source', sortable: true, filter: 'agTextColumnFilter', floatingFilter: true, width: 90, tooltipValueGetter: params => {
              if (this.SOURCE_ABBREVIATION_MAPPING[params.data.source]) {
                return this.SOURCE_ABBREVIATION_MAPPING[params.data.source].full_name
              }
            }, cellClass: params => {
              if (this.SOURCE_ABBREVIATION_MAPPING[params.data.source] && this.SOURCE_ABBREVIATION_MAPPING[params.data.source].full_name) {
                return "has-hover-text"
              }
            }
          },
          {field: 'document_type', headerName: 'Type', sortable: true, width: 90},
          {field: 'analyte', headerName: 'Analyte', sortable: true, flex: 1, filter: 'agTextColumnFilter', floatingFilter: true},
          {field: 'link', headerName: 'Link', sortable: true, width: 70, cellRenderer: params => {
            return `<a href='${params.data.link}' target='_blank'>Link</a>`
          }}
        ]
      }
    },

    async created() {
      const path = `${this.BACKEND_LOCATION}/fact_sheet_list`
      const response = await axios.get(path)
      this.fact_sheet_info = response.data.results
    },

    methods: {
      onGridReady(params) {
        this.gridApi = params.api;
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
      onRowSelected(event){
        if (event.event){
          this.selected_row_data = event.data
          this.any_fact_sheet_selected = true
          this.target_pdf_url = `${this.BACKEND_LOCATION}/get_pdf/fact sheet/${event.data.internal_id}`
        }
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
      async downloadCompoundsInDocs() {
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
      },
      downloadCurrentTable() {
        this.gridApi.exportDataAsCsv({
          fileName: "fact_sheet_list.csv"
        });
      }
    },

    components: {
      AgGridVue,
      HelpIcon,
      StoredPDFViewer
    }
  }
</script>

<style>

</style>