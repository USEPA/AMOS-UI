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
    <div v-else class="two-column-page">
      <div class="half-page-column">
        <StoredPDFDisplay style="width: 48vw;" :internalID="pdf_viewer_data.internal_id" recordType="method"/>
      </div>
      <div class="half-page-column">
        <p>This is a list of the {{ results.length }} spectra associated with this method, organized by substance identifier.  Double-click on a row to show the spectrum in a modal window.</p>
        <ag-grid-vue
            class="ag-theme-balham"
            style="height:600px; width:100%"
            :columnDefs="column_defs"
            :rowData="results"
            rowSelection="single"
            @row-selected="onRowSelected"
            @row-double-clicked="onDoubleClick"
            :suppressCopyRowsToClipboard="true"
          ></ag-grid-vue>
      </div>
    </div>
    <div>
      <b-modal scrollable size="lg" v-model="show_modal">
        <MassSpectrumDisplay :internalID="spectrum_internal_id"/>
      </b-modal>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import '@/assets/style.css'
  import { BACKEND_LOCATION } from '@/assets/store'

  import 'ag-grid-community/styles/ag-grid.css'
  import 'ag-grid-community/styles/ag-theme-balham.css'
  import { AgGridVue } from "ag-grid-vue3"
  import 'ag-grid-enterprise'
  import { LicenseManager } from 'ag-grid-enterprise'
  LicenseManager.setLicenseKey('CompanyName=US EPA,LicensedGroup=Multi,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=5,LicensedProductionInstancesCount=0,AssetReference=AG-010288,ExpiryDate=3_December_2022_[v2]_MTY3MDAyNTYwMDAwMA==4abffeb82fbc0aaf1591b8b7841e6309')
  
  import MassSpectrumDisplay from '@/components/MassSpectrumDisplay.vue'
  import StoredPDFDisplay from '@/components/StoredPDFDisplay.vue'

  export default {
    data(){
      return {
        search_type: "",
        pdf_viewer_data: {},
        show_modal: false,
        BACKEND_LOCATION,
        spectrum_internal_id: "",
        column_defs: [
          {field: 'dtxsid', headerName: 'DTXSID', sortable: true},
          {field: 'preferred_name', headerName: 'Substance Name', sortable: true, flex: 1},
        ]
      }
    },
    async created() {
      if ((this.$route.params.by_type != "method") & (this.$route.params.by_type != "spectrum")) {
        this.search_type = "invalid"
      } else {
        const response = await axios.get(`${this.BACKEND_LOCATION}/method_with_spectra/${this.$route.params.by_type}/${this.$route.params.internal_id}`)
        this.pdf_viewer_data = {"internal_id": response.data.method_id}
        this.results = response.data.info
      }
    },
    methods: {
      dummy() {
        1
      },
      onDoubleClick(event) {
        this.spectrum_internal_id = event.data.internal_id
        this.show_modal = true
      }
    },
    components: {AgGridVue, MassSpectrumDisplay, StoredPDFDisplay}
  }
</script>

<style>
  .full-results-page {
    display: flex;
    justify-content: space-between;
  }
</style>