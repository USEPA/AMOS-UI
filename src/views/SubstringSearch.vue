<!--
  This page displays results for a substring search, where a given substring is matched against the contents of the
  database (both preferred names and synonyms).

  This page takes one URL route parameter:
  - Substring, which is the substring being searched for 
-->

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

  import { getSubstanceImageLink } from '@/assets/common_functions'
  import { BACKEND_LOCATION, COMPTOX_PAGE_URL } from '@/assets/store'
  import '@/assets/style.css'
  
  export default {
    data() {
      return {
        results: null,
        preferred_name_results: null,
        synonym_results: null,
        info_list: [],
        BACKEND_LOCATION,
        columnDefs: [
          {field:'image', headerName:'Structure', autoHeight: true, width: 100, wrapText: true, cellRenderer: (params) => {
            if (params.data.image_link) {
              var image = document.createElement('img');
              image.src = params.data.image_link
              image.style = "width:70px;height:70px;padding-top:2px;padding-bottom:2px;";
              return image;
            } else {
              var p = document.createElement('div')
              p.style = "width:70px;height:70px;padding-top:2px;padding-bottom:2px;text-align: center; line-height: 70px;";
              p.innerText = "No structure."
              return p
            }
          }},
          {field: 'dtxsid', headerName: 'DTXSID', width: 140, cellClass: "fake-link"},
          {field: 'casrn', headerName: 'CASRN', width: 120},
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
      for (let i=0; i<this.info_list.length; i++) {
          this.info_list[i]["image_link"] = await getSubstanceImageLink(this.info_list[i].dtxsid)
        }
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

<style>
  .ag-row .ag-cell {
    display: flex;
    align-items: center;
  }
</style>