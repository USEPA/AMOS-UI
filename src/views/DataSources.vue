<!--
  This page is meant to list off the major data sources in the app.  Sources that add only one or a few methods to the
  database are excluded, as this page would become rather lengthy otherwise.

  This page takes no route or query parameters.
-->

<template>
  This page gives descriptions of the data sources that have large amounts of data stored in this application, including how many records from each source are in the database, and how many substances those records cover.  Sources with relatively few records are not listed here.
  <br /> <br />
  <div>
    <label for="full-table-filter">Full Table Filter</label> &nbsp;
    <input type="text" v-model="full_table_filter" name="full-table-filter" @keyup="quickFilter(full_table_filter)">
    &nbsp;
    <HelpIcon style="vertical-align:middle;" tooltipText="The contents of this field act as a filter on all columns in the table, returning all results where the filter appears in any field." />
  </div>
  <br />
  <ag-grid-vue
    class="ag-theme-balham"
    style="height:550px; width:100%"
    :defaultColDef="defaultColumnDef"
    :columnDefs="column_defs"
    :rowData="source_info"
    rowSelection="single"
    :suppressCopyRowsToClipboard="true"
    :animateRows="false"
    @grid-ready="onGridReady"
  ></ag-grid-vue>
</template>

<script>
  import axios from 'axios'

  import 'ag-grid-community/styles/ag-grid.css'
  import 'ag-grid-community/styles/ag-theme-balham.css'
  import { AgGridVue } from "ag-grid-vue3"
  import 'ag-grid-enterprise'
  import { LicenseManager } from 'ag-grid-enterprise'
  LicenseManager.setLicenseKey('CompanyName=US EPA,LicensedGroup=Multi,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=5,LicensedProductionInstancesCount=0,AssetReference=AG-010288,ExpiryDate=3_December_2022_[v2]_MTY3MDAyNTYwMDAwMA==4abffeb82fbc0aaf1591b8b7841e6309')
  
  import { BACKEND_LOCATION } from '@/assets/store.js'
  import DataSourceDetails from '@/components/DataSourceDetails.vue'
  import HelpIcon from '@/components/HelpIcon.vue'

  export default {
    data() {
      return {
        BACKEND_LOCATION,
        source_info: null,
        defaultColumnDef: {floatingFilter: true, sortable: true},
        full_table_filter: "",
        column_defs: [
          {field: 'full_name', headerName: 'Source Name', flex: 1.5, wrapText: true, sort: 'asc', filter: 'agTextColumnFilter', cellRenderer: params => {
            return "<a href='" + params.data.url + "' target='_blank'>" + params.data.full_name + "</a>"
          }},
          /*{field: 'source_ids', headerName: 'AMOS IDs', flex: 0.5},*/
          {field: 'category', headerName: 'Category', filter: 'agSetColumnFilter', flex: 1},
          {field: 'description', headerName: 'Description', flex: 1.5, wrapText: true, filter: 'agTextColumnFilter', autoHeight: true},
          {field: 'substances', headerName: '# Substances', width: 120, filter: 'agNumberColumnFilter', cellRenderer: params => {
            return params.data.substances.toLocaleString()
          }},
          {field: 'fact_sheets', headerName: '# Fact Sheets', width: 120, filter: 'agNumberColumnFilter', cellRenderer: params => {
            return params.data.fact_sheets.toLocaleString()
          }},
          {field: 'methods', headerName: '# Methods', width: 100, filter: 'agNumberColumnFilter', cellRenderer: params => {
            return params.data.methods.toLocaleString()
          }},
          {field: 'spectra', headerName: '# Spectra', width: 100, filter: 'agNumberColumnFilter', cellRenderer: params => {
            return params.data.spectra.toLocaleString()
          }},
        ]
      }
    },
    async created() {
      const response = await axios.get(`${this.BACKEND_LOCATION}/get_data_source_info/`)
      this.source_info = response.data
    },
    methods: {
      onGridReady(params) {
        this.gridApi = params.api;
      },
      quickFilter(input) {
        this.gridApi.setGridOption('quickFilterText', input)
      },
    },
    components: {AgGridVue, DataSourceDetails, HelpIcon}
  }
</script>

<style>
  .ag-row .ag-cell {
    display: flex;
    align-items: center;
    line-height: 130%;
    padding-top: 1em;
    padding-bottom: 1em;
    word-break: normal;
  }
</style>