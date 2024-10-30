<!--
  This page displays results for a substring search, where a given substring is matched against the contents of the
  database (both preferred names and synonyms).

  This page takes one URL route parameter:
  - Substring, which is the substring being searched for 
-->

<template>
  <div v-if="loaded">
    <p>Below is a list of substances which contain the substring "{{ $route.params.substring }}" in the preferred name and/or an EPA-recognized synonym.  Preferred names in italics are ones that do not contain the substring (i.e., only the synonyms do).  Double-click on a row to search for that substance in a new tab.</p>
    <p>{{info_list.length}} substances were found; {{ filtered_record_count }} are currently visible.  Use the checkboxes below to filter out any substance for which the database does not contain at least one:</p>
    <div style="display: flex;">
      <div>
        <input type="checkbox" id="has-methods" v-model="record_filters.has_methods" @change="updateCheckboxFilters">
        <label for="has-methods">Method</label>
      </div>
      &emsp;
      <div>
        <input type="checkbox" id="has-spectra" v-model="record_filters.has_spectra" @change="updateCheckboxFilters">
        <label for="has-spectra">Spectrum</label>
      </div>
      &emsp;
      <div>
        <input type="checkbox" id="has-fact-sheets" v-model="record_filters.has_fact_sheets" @change="updateCheckboxFilters">
        <label for="has-fact-sheets">Fact Sheet</label>
      </div>
      &emsp;
      <div>
        <input type="checkbox" id="has-any-record" v-model="record_filters.has_any_record" @change="updateCheckboxFilters">
        <label for="has-any-record">Record (any type)</label>
      </div>
    </div>
    <ag-grid-vue
      class="ag-theme-balham"
      style="height:600px; width:100%"
      :columnDefs="columnDefs"
      :rowData="info_list"
      rowSelection="single"
      @row-double-clicked="onDoubleClick"
      :isExternalFilterPresent="isExternalFilterPresent"
      :doesExternalFilterPass="doesExternalFilterPass"
      @grid-ready="onGridReady"
      @filter-changed="onFilterChanged"
      :suppressCopyRowsToClipboard="true"
    ></ag-grid-vue>
  </div>
  <p v-else>Searching -- this may take a few moments...</p>
</template>

<script>
  import axios from 'axios'

  import 'ag-grid-community/styles/ag-grid.css'
  import 'ag-grid-community/styles/ag-theme-balham.css'
  import { AgGridVue } from "ag-grid-vue3"
  import 'ag-grid-enterprise'
  import { LicenseManager } from 'ag-grid-enterprise'
  LicenseManager.setLicenseKey('CompanyName=US EPA,LicensedGroup=Multi,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=5,LicensedProductionInstancesCount=0,AssetReference=AG-010288,ExpiryDate=3_December_2022_[v2]_MTY3MDAyNTYwMDAwMA==4abffeb82fbc0aaf1591b8b7841e6309')

  import { imageLinkForSubstance } from '@/assets/common_functions'
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
        record_filters: {has_methods: true, has_spectra: true, has_fact_sheets: true, has_any_record: false},
        filtered_record_count: 0,
        loaded: false,
        columnDefs: [
          {field:'image', headerName:'Structure', autoHeight: true, width: 100, wrapText: true, cellRenderer: (params) => {
            if (params.data.image_link) {
              var image = document.createElement('img');
              image.src = params.data.image_link
              image.style = "width:70px;height:70px;padding-top:2px;padding-bottom:2px;";
              image.alt = `Structure image for ${params.data.dtxsid}`
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
          {field: 'preferred_name', headerName: 'Preferred Name', sortable: true, sort: 'asc', flex: 1, cellStyle: params => {
            if (!params.value.includes(this.$route.params.substring)) {
              return {'font-style': 'italic'}
            }
          }},
          {field: 'synonyms', headerName: 'Synonym', flex: 1, wrapText: true, autoHeight: true, cellStyle: {'white-space': 'pre-line'}, cellRenderer: params => {
            return params.data.synonyms.join("\n")
          }},
          {field: 'methods', headerName: 'Methods', width: 90},
          {field: 'spectra', headerName: 'Spectra', width: 85},
          {field: 'fact_sheets', headerName: 'Fact Sheets', width: 105}
        ]
      }
    },
    async created() {
      const response = await axios.get(`${this.BACKEND_LOCATION}/substring_search/${this.$route.params.substring}`)
      var match_info = response.data.substances
      for (let i=0; i<match_info.length; i++) {
        match_info[i]["image_link"] = imageLinkForSubstance(match_info[i].dtxsid, match_info[i].image_in_comptox)
      }
      this.info_list = match_info
      this.loaded = true
    },
    methods: {
      postSortRows(params) {
        1
      },
      onDoubleClick(event) {
        window.open(`/search/${event.data.dtxsid}`)
      },
      isExternalFilterPresent() {
        return true
      },
      doesExternalFilterPass(node) {
        // Controls the filtering of records in the table -- so far, this amounts to handling the
        // toggling of single point spectra and switching between record types.
        if (this.record_filters.has_methods && (node.data.methods == 0)) {
          return false
        }
        if (this.record_filters.has_spectra && (node.data.spectra == 0)) {
          return false
        }
        if (this.record_filters.has_fact_sheets && (node.data.fact_sheets == 0)) {
          return false
        }
        if (this.record_filters.has_any_record && ((node.data.methods + node.data.spectra + node.data.fact_sheets) == 0)) {
          return false
        }
        return true
      },
      updateCheckboxFilters() {
        this.gridApi.onFilterChanged()
      },
      onGridReady(params) {
        this.gridApi = params.api
        this.gridApi.onFilterChanged();
      },
      onFilterChanged(params) {
        this.filtered_record_count = this.gridApi.getDisplayedRowCount()
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