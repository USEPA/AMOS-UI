<!--
  This page is used to display a method with associated spectra.  The page that results when accessing it by a method
  should appear the same as one that results when it is accessed by one of the method's spectra.

  This page has two URL route parameters and no query parameters.  The URL route parameters are:
  - by_type: either 'method' or 'spectrum'; a parameter passed to the Flask backend to know whether we're starting with
    a method that has spectra or a single spectrum that belongs to a method
  - internal_id: a string that is the internal ID of the record; it can be the ID of a method or a spectrum, so long as
    it's paired with the appropriate value of by_type
-->

<template>
  <div>
    <p v-if="search_type == 'invalid'">The search type {{ this.$route.params.by_type }} is invalid; it should be either "method" or "spectrum".</p>
    <div v-else class="full-results-page">
      <div class="half-page-column">
        <StoredPDFViewer style="width: 50vw;" :selectedRowData="pdf_viewer_data" recordType="method"/>
      </div>
      <div class="half-page-column">
        <p></p>
        <ag-grid-vue
            class="ag-theme-balham"
            style="height:600px; width:100%"
            :columnDefs="column_defs"
            :rowData="results"
            rowSelection="single"
            @row-selected="onRowSelected"
            @row-double-clicked="onDoubleClick"
          ></ag-grid-vue>
      </div>
    </div>
    <div>
      <b-modal scrollable size="lg" v-model="show_modal">
        <SpectrumViewer :selectedRowData="selected_row_data"/>
      </b-modal>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import { BACKEND_LOCATION } from '@/assets/store'

  import '/node_modules/ag-grid-community/dist/styles/ag-grid.css'
  import '/node_modules/ag-grid-community/dist/styles/ag-theme-balham.css'
  import { AgGridVue } from "ag-grid-vue3"
  import 'ag-grid-enterprise'
  import { LicenseManager } from 'ag-grid-enterprise'
  LicenseManager.setLicenseKey('CompanyName=US EPA,LicensedGroup=Multi,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=5,LicensedProductionInstancesCount=0,AssetReference=AG-010288,ExpiryDate=3_December_2022_[v2]_MTY3MDAyNTYwMDAwMA==4abffeb82fbc0aaf1591b8b7841e6309')
  
  import SpectrumViewer from '@/components/SpectrumViewer.vue'
  import StoredPDFViewer from '@/components/StoredPDFViewer.vue'

  export default {
    data(){
      return {
        search_type: "",
        pdf_viewer_data: {},
        show_modal: false,
        BACKEND_LOCATION,
        column_defs: [
          {field: 'dtxsid', headerName: 'DTXSID', sortable: true},
          {field: 'preferred_name', headerName: 'Compound Name', sortable: true, flex: 1},
        ]
      }
    },
    async created() {
      if ((this.$route.params.by_type != "method") & (this.$route.params.by_type != "spectrum")) {
        this.search_type = "invalid"
      } else {
        const response = await axios.get(`${this.BACKEND_LOCATION}/method_with_spectra/${this.$route.params.by_type}/${this.$route.params.internal_id}`)
        console.log(response.data)
        this.pdf_viewer_data = {"internal_id": response.data.method_id}
        this.results = response.data.info
      }
    },
    methods: {
      dummy() {
        1
      },
      onDoubleClick(event) {
        this.selected_row_data = {internal_id: event.data.internal_id}
        this.show_modal = true
      }
    },
    components: {AgGridVue, SpectrumViewer, StoredPDFViewer}
  }
</script>

<style>
  .full-results-page {
    display: flex;
    justify-content: space-between;
  }

  .half-page-column {
    width: 46vw;
  }
</style>