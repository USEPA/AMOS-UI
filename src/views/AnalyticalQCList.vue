<template>
  <p>This page lists records from the EPA's Analytical QC project.  There are approximately 40,000 records in total, so it will take a moment to load the full list.</p>
  <p>Double-click a row to open the corresponding document in a new tab.</p>
  <div class="button-array">
    <button @click="downloadCurrentTable">Download Table</button>
    <button @click="downloadSubstances">Download Substances</button>
  </div>
  <ag-grid-vue
    class="ag-theme-balham"
    style="height:800px; width:100%"
    :defaultColDef="default_column_def"
    :columnDefs="column_defs"
    :rowData="aqc_data"
    rowSelection="single"
    @row-double-clicked="onDoubleClick"
    @first-data-rendered="onGridReady"
    @row-selected="onRowSelected"
    @filter-changed="onFilterChanged"
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

  import '@/assets/style.css'
  import { getSubstanceImageLink, timestampForFile } from '@/assets/common_functions'
  import { ANALYTICAL_QC_CALLS, ANALYTICAL_QC_GRADES, BACKEND_LOCATION, COMPTOX_PAGE_URL } from '@/assets/store'

  export default {
    data() {
      return {
        ANALYTICAL_QC_CALLS,
        ANALYTICAL_QC_GRADES,
        aqc_data: [],
        BACKEND_LOCATION,
        COMPTOX_PAGE_URL,
        default_column_def: {resizable: true, filter: 'agTextColumnFilter', floatingFilter: true},
        column_defs: [
          {field: 'internal_id', headerName: "internal ID", hide: true},
          {field: 'dtxsid', headerName: 'DTXSID', width: 120, sortable: true, cellRenderer: params => {
            return "<a href='" + this.COMPTOX_PAGE_URL + params.data.dtxsid + "' target='_blank'>" + params.data.dtxsid + "</a>"
          }},
          {field: 'casrn', headerName: "CASRN", width: 110, sortable: true},
          {field: 'molecular_formula', headerName: "Formula", width: 110},
          {field: 'sample_id', headerName: "Sample ID", width: 110, sortable: true},
          {field: 'preferred_name', headerName: "Preferred Name", flex: 1, sortable: true},
          {field: 'study', headerName: "Source/Technique", width: 140, sortable: true, filter: 'agMultiColumnFilter'},
          {field: 'experiment_date', headerName: "Experiment Date", width: 140},
          {field: 'first_timepoint', headerName: "First Timepoint", width: 140, filter: 'agSetColumnFilter', sortable: true, cellRenderer: params => {
            const m = params.data.first_timepoint
            if (this.ANALYTICAL_QC_GRADES[m]) {
              return `<span class='has-hover-text' title='${this.ANALYTICAL_QC_GRADES[m]}'>${m}</span>`
            } else {
              return m
            }
          }},
          {field: 'last_timepoint', headerName: "Last Timepoint", width: 140, filter: 'agSetColumnFilter', sortable: true, cellRenderer: params => {
            const m = params.data.last_timepoint
            if (this.ANALYTICAL_QC_GRADES[m]) {
              return `<span class='has-hover-text' title='${this.ANALYTICAL_QC_GRADES[m]}'>${m}</span>`
            } else {
              return m
            }
          }},
          {field: 'stability_call', headerName: "Stability Call", width: 120, filter: 'agSetColumnFilter', sortable: true, cellRenderer: params => {
            const m = params.data.stability_call
            if (this.ANALYTICAL_QC_CALLS[m]) {
              return `<span class='has-hover-text' title='${this.ANALYTICAL_QC_CALLS[m]}'>${m}</span>`
            } else {
              return m
            }
          }},
          {field: 'annotation', headerName: "Annotation", flex: 1},
          {field: 'flags', headerName: "Flags", flex: 1}
        ]
      }
    },
    async created() {
      const response = await axios.get(`${this.BACKEND_LOCATION}/analytical_qc_list/`)
      this.aqc_data = response.data.results
    },
    methods: {
      onGridReady(params) {
        this.gridApi = params.api;
      },
      onRowSelected(event){
        1
      },
      onFilterChanged(params) {
        1
      },
      onDoubleClick(event) {
        window.open(`/view_spectrum_pdf/${event.data.internal_id}`)
      },
      downloadCurrentTable() {
        this.gridApi.exportDataAsExcel({
          fileName: `analytical_qc_${timestampForFile()}.xlsx`
        });
      },
      downloadSubstances() {
        var seen_dtxsids = []
        var rows_to_keep = []
        this.gridApi.forEachNodeAfterFilter( (rowNode, index) => {
          if (!seen_dtxsids.includes(rowNode.data.dtxsid)) {
            seen_dtxsids.push(rowNode.data.dtxsid)
            rows_to_keep.push(index)
          }
        })
        this.gridApi.exportDataAsExcel({
          fileName: `analytical_qc_substances_${timestampForFile()}.xlsx`,
          columnKeys: ["dtxsid", "casrn", "preferred_name"],
          shouldRowBeSkipped: params => {return !rows_to_keep.includes(params.node.rowIndex)}
        });
      }
    },
    components: { AgGridVue }
  }
</script>