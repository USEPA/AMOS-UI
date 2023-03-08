<!--
  This page displays a list of all monographs in the database, as well as being able to display the monographs and
  associated compounds themselves.

  This page takes no URL route or query parameters.
-->

<template>
  <div class="two-column-page">
    <div class="half-page-column">
      <p>
        This is a list of {{monograph_info.length}} monographs available in the database. All monographs currently
        originate from four sources: the <a href="https://www.swgdrug.org/monographs.htm">Scientific Working 
        Group</a> (SWG), the <a href="https://www.npsdiscovery.org/reports/monographs/">Center for Forensic
        Science Research & Education</a> (CFRSE), <a href="https://www.nmslabs.com/">NMS Labs</a>, and the 
        <a href="https://www.kgi.edu/academics/schools/school-of-pharmacy-and-health-sciences/"> KGI School of
        Pharmacy and Health Sciences</a>.
      </p>
      <p>Select a row to view a monograph.</p>
      <ag-grid-vue
        class="ag-theme-balham"
        style="height:800px; width:100%"
        :columnDefs="column_defs"
        :rowData="monograph_info"
        rowSelection="single"
        @first-data-rendered="onGridReady"
        @row-selected="onRowSelected"
      ></ag-grid-vue>
    </div>
    <StoredPDFViewer style="width: 48vw;" v-if="any_monograph_selected" :internalID="selected_row_data.internal_id" recordType="monograph"/>
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
  import { BACKEND_LOCATION } from '@/assets/store'

  export default {
    data(){
      return {
        selected_row_data: {},
        monograph_info: null,
        any_monograph_selected: false,  // used to avoid having a box with an error pop up if nothing's been selected yet,
        BACKEND_LOCATION,
        column_defs: [
          {field: 'monograph_name', headerName: 'Monograph Name', sortable: true, filter: 'agTextColumnFilter', floatingFilter: true, sort: "asc", flex: 1},
          {field: 'sub_source', headerName: 'Source', sortable: true, width: 250},
          {field: 'year_published', headerName: 'Year', sortable: true, width: 70}
        ]
      }
    },

    async created() {
      const path = `${this.BACKEND_LOCATION}/monograph_list`
      const response = await axios.get(path)
      this.monograph_info = response.data.results
    },

    methods: {
      onGridReady(params) {
        1
      },
      onRowSelected(event){
        if (event.event){
          this.selected_row_data = event.data
          this.any_monograph_selected = true
          this.target_pdf_url = `${this.BACKEND_LOCATION}/get_pdf/monograph/${event.data.internal_id}`
        }
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