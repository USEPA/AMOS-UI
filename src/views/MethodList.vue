<!--
  This page serves as a list of all methods contained in the database.  Currently, unlike the monographs, the table
  describing the methods fills the entire window, so the method cannot be displayed in the same window.  Double-clicking
  a row in the table will open the method's PDF in a new window.

  There are no URL route or query parameters associated with this page.
-->

<template>
  <div>
    <p>Below is a list of all {{method_info.length}} methods currently in the database.  Double-click on a row to display the method and its compounds in another tab.</p>
    <ag-grid-vue
      class="ag-theme-balham"
      style="height:600px; width:100%"
      :defaultColDef="default_column_def"
      :columnDefs="column_defs"
      :rowData="method_info"
      rowSelection="single"
      @row-double-clicked="onDoubleClick"
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
  import { BACKEND_LOCATION } from '@/assets/store'

  export default {
    data() {
      return {
        BACKEND_LOCATION,
        method_info: null,    //starting this as null instead of an empty array means the loading overlay will trigger
        default_column_def: {resizable: true, filter: 'agTextColumnFilter', floatingFilter: true},
        column_defs: [
          {field: "method_number", headerName: "Method #"},
          {field: "method_name", headerName: "Name", tooltipField: 'method_name', sortable: true, flex: 1, cellClass: 'fake-link'},
          {field: "year_published", headerName: "Year", width: 90, sortable: true},
          {field: "methodology", headerName: "Methodology", width: 115, sortable: true},
          {field: "source", headerName: "Source", width: 100, sortable: true},
          {field: "analyte", headerName: "Analyte", tooltipField: 'analyte', sortable: true, flex: 1},
          {field: "matrix", headerName: "Matrix", sortable: true, flex: 1.2},
          {field: "count", headerName: "# Compounds", width: 120, floatingFilter: false}
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
      }
    },
    components: {
      AgGridVue
    }
  }
</script>

<style>

</style>