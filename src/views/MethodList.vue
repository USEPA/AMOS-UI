<template>
  <div>
    <p>Below is a list of all methods in the database.  Double-click on a row to open the method's PDF file in a new tab.</p>
    <ag-grid-vue
      class="ag-theme-balham"
      style="height:600px; width:100%"
      :defaultColDef="default_column_def"
      :columnDefs="column_defs"
      :rowData="results"
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

  import { BACKEND_LOCATION } from '@/assets/store'

  export default {
    data() {
      return {
        BACKEND_LOCATION,
        results: [],
        default_column_def: {resizable: true, filter: 'agTextColumnFilter', floatingFilter: true},
        column_defs: [
          {field: "method_number", headerName: "Method #"},
          {field: "method_name", headerName: "Name", tooltipField: 'method_name', sortable: true, flex: 1},
          {field: "year_published", headerName: "Year", width: 90, sortable: true},
          {field: "methodology", headerName: "Methodology", width: 115, sortable: true},
          {field: "source", headerName: "Source", width: 100, sortable: true},
          {field: "analyte", headerName: "Analyte", tooltipField: 'analyte', sortable: true, flex: 1},
          {field: "matrix", headerName: "Matrix", sortable: true, flex: 1}
        ]
      }
    },
    async created() {
      const path = `${this.BACKEND_LOCATION}/method_list`
      const response = await axios.get(path)
      this.results = response.data.results
    },
    methods: {
      onDoubleClick(event) {
        console.log(event)
        window.open(`${this.BACKEND_LOCATION}/get_pdf/method/${event.data.internal_id}`)
      }
    },
    components: {
      AgGridVue
    }
  }
</script>

<style>

</style>