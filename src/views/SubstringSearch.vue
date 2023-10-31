<template>
  <p>A substring search for "{{ $route.params.substring }}" returns {{info_list.length}} substances. Double-click on a row to search for that substance in a new tab.</p>
  <ag-grid-vue
    class="ag-theme-balham"
    style="height:600px; width:100%"
    :columnDefs="columnDefs"
    :rowData="info_list"
    rowSelection="single"
    @row-double-clicked="onDoubleClick"
    ></ag-grid-vue>
</template>

<script>
  import axios from 'axios'

  import '/node_modules/ag-grid-community/dist/styles/ag-grid.css'
  import '/node_modules/ag-grid-community/dist/styles/ag-theme-balham.css'
  import { AgGridVue } from "ag-grid-vue3"
  import 'ag-grid-enterprise'
  import { LicenseManager } from 'ag-grid-enterprise'
  LicenseManager.setLicenseKey('CompanyName=US EPA,LicensedGroup=Multi,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=5,LicensedProductionInstancesCount=0,AssetReference=AG-010288,ExpiryDate=3_December_2022_[v2]_MTY3MDAyNTYwMDAwMA==4abffeb82fbc0aaf1591b8b7841e6309')

  import { BACKEND_LOCATION, COMPTOX_PAGE_URL } from '@/assets/store'
  
  export default {
    data() {
      return {
        results: null,
        preferred_name_results: null,
        synonym_results: null,
        info_list: [],
        BACKEND_LOCATION,
        columnDefs: [
          {field: 'dtxsid', headerName: 'DTXSID'},
          {field: 'casrn', headerName: 'CASRN'},
          {field: 'preferred_name', headerName: 'Preferred Name', sortable: true, sort: 'asc', flex: 1},
          {field: 'synonyms', headerName: 'Synonym', flex: 1, wrapText: true, autoHeight: true, cellStyle: {'white-space': 'pre-line'}, cellRenderer: params => {
            return params.data.synonyms.join("\n")
          }},
        ]
      }
    },
    async created() {
      const response = await axios.get(`${this.BACKEND_LOCATION}/substring_search/${this.$route.params.substring}`)
      this.info_list = response.data.info_list
    },
    methods: {
      postSortRows(params) {
        1
      },
      onDoubleClick(event) {
        window.open(`/search/${event.data.dtxsid}`)
      }
    },
    components: {AgGridVue}
  }
</script>
