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
      <ag-grid-vue
        class="ag-theme-balham"
        style="height:800px; width:100%"
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

  export default {
    data(){
      return {
        SOURCE_ABBREVIATION_MAPPING,
        selected_row_data: {},
        fact_sheet_info: null,
        any_fact_sheet_selected: false,  // used to avoid having a box with an error pop up if nothing's been selected yet,
        BACKEND_LOCATION,
        filtered_record_count: 0,
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
        this.gridApi.onFilterChanged();
      },
      onRowSelected(event){
        if (event.event){
          this.selected_row_data = event.data
          this.any_fact_sheet_selected = true
          this.target_pdf_url = `${this.BACKEND_LOCATION}/get_pdf/fact sheet/${event.data.internal_id}`
        }
      },
      onFilterChanged(params) {
        this.filtered_record_count = this.gridApi.getDisplayedRowCount()
      }
    },

    components: {
      AgGridVue,
      StoredPDFViewer
    }
  }
</script>

<style>

</style>