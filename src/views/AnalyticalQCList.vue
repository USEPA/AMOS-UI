<!--
  This page is a list of records in AMOS's database associated with the Analytical QC project, which collected data on
  just under 10,000 substances of concern to the EPA.
-->

<template>
  <p>This page lists records from the EPA's Analytical QC project which provides access to gas chromatography-mass spectrometry (GC/MS), liquid chromatography-mass spectrometry (LC/MS), and nuclear magnetic resonance (NMR) data, most of which were measured to support the Tox21/ToxCast bioactivity screening campaigns.  For details regarding the measurement of data, see the publication <a href="https://pubs.acs.org/doi/10.1021/acs.chemrestox.4c00330">"Analytical Quality Evaluation of the Tox21 Compound Library".</a></p>
  <div v-if="status.loading">
    <p>Loading Analytical QC documents...{{ aqc_data.length.toLocaleString() }} of {{ status.full_count.toLocaleString() }} retrieved.</p>
    <BProgress :value="aqc_data.length" :max="status.full_count" style="margin: 10px;"/>
  </div>
  <div v-else>
    <details>
      <summary>Additional information</summary>
      <div style="margin: 10px">
        <p>Understanding a chemical's amenability to solubilization and stability in the vehicle chosen to solubilize the chemical informs on the chemical s applicability domain for <i>in vitro</i> screening. The Analytical QC methods applied here can detect if chemicals will be stable and detectable in solubilization at time points, or provide insight into possible degradation products. Substance-level calls summarize results from analytical quality control (QC) experiments across individual samples, whereas individual samples (hidden by default) may not always be subjected to the same analytical detection methods. Visit the <a href="https://cran.r-project.org/web/packages/tcpl/vignettes/Introduction_Appendices.html#analytical-qc-and-applicability-domain"><code>tcpl</code> library vignette's Analytical QC and Applicability Domain section</a> for more information on logic used to populate pass or caution determination and flags.</p>
        <p>Measurements are taken at two time points: T0 (a compound has just been taken out of the freezer) and T4 (a compound has been kept at room temperature for four months).</p>
        <p>The definitions of the grades are as follows:</p>
        <table class="analyticalqc-grades">
          <tr>
            <th>Label</th>
            <th>Grade</th>
            <th>Score</th>
            <th>Definition</th>
          </tr>
          <tr>
            <td class="score-2" rowspan="3">PASS</td>
            <td class="score-1">A</td>
            <td class="score-1">1</td>
            <td>MW confirmed, purity >90%</td>
          </tr>
          <tr>
            <td class="score-2">B</td>
            <td class="score-2" rowspan="2">2</td>
            <td>MW confirmed, purity 75-90%</td>
          </tr>
          <tr>
            <td class="score-2">I</td>
            <td>MW confirmed, two or more isomers detected, combined purity >75%</td>
          </tr>
          <tr>
            <td class="caution" rowspan="10">CAUTION</td>
            <td class="score-3">C</td>
            <td class="score-3" rowspan="3">3</td>
            <td>MW confirmed, purity 50-75%</td>
          </tr>
          <tr>
            <td class="score-3">M</td>
            <td>DEFINED MIXTURE Two or more components</td>
          </tr>
          <tr>
            <td class="score-3">Z</td>
            <td>MW confirmed, no purity info</td>
          </tr>
          <tr>
            <td class="score-4">Ac</td>
            <td class="score-4" rowspan="3">4</td>
            <td>MW confirmed, purity >90%, low concentration (5-30% of expected value)</td>
          </tr>
          <tr>
            <td class="score-4">Bc</td>
            <td>MW confirmed, purity 75-90%, low concentration (5-30% of expected value)</td>
          </tr>
          <tr>
            <td class="score-4">Cc</td>
            <td>MW confirmed, purity 50-75%, low concentration (5-30% of expected value)</td>
          </tr>
          <tr>
            <td class="score-5">D</td>
            <td class="score-5" rowspan="4">5</td>
            <td>MW confirmed, purity <50%</td>
          </tr>
          <tr>
            <td class="score-5">F</td>
            <td>Incorrect MW</td>
          </tr>
          <tr>
            <td class="score-5">Fc</td>
            <td>Very low concentration (<5% of expected value)</td>
          </tr>
          <tr>
            <td class="score-5">Fns</td>
            <td>No sample detected</td>
          </tr>
          <tr>
            <td class="ungraded" rowspan="2"></td>
            <td class="ungraded">U</td>
            <td class="ungraded"></td>
            <td>Ungraded</td>
          </tr>
          <tr>
            <td class="withdrawn">W</td>
            <td class="withdrawn"></td>
            <td>Sample withdrawn</td>
          </tr>
        </table>
      </div>
    </details>
    <br />
    <p> {{ aqc_data.length.toLocaleString() }} documents are present in the database; {{counts.visible_records.toLocaleString()}} {{counts.visible_records == 1 ? "is" : "are"}} currently displayed, covering {{counts.substances.toLocaleString()}} {{counts.substances == 1 ? "substance" : "substances"}} and {{counts.samples.toLocaleString()}} {{counts.samples == 1 ? "sample" : "samples"}}.</p>
  </div>
  <div class="button-array">
    <button @click="saveFiltersAsURL">Copy filters to clipboard</button>
    <button @click="downloadCurrentTable">Download Table</button>
    <button @click="downloadSubstances">Download Substances</button>
    <button @click="resetFilters">Reset Filters</button>
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
    :tooltipShowDelay="500"
    :suppressCopyRowsToClipboard="true"
  ></ag-grid-vue>
</template>

<script>
  import axios from 'axios'
  import { BProgress } from 'bootstrap-vue-next'

  import 'ag-grid-community/styles/ag-grid.css'
  import 'ag-grid-community/styles/ag-theme-balham.css'
  import { AgGridVue } from "ag-grid-vue3"
  import 'ag-grid-enterprise'
  import { LicenseManager } from 'ag-grid-enterprise'
  LicenseManager.setLicenseKey('CompanyName=US EPA,LicensedGroup=Multi,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=5,LicensedProductionInstancesCount=0,AssetReference=AG-010288,ExpiryDate=3_December_2022_[v2]_MTY3MDAyNTYwMDAwMA==4abffeb82fbc0aaf1591b8b7841e6309')

  import { filtersToURL, queryParamsToFilters, timestampForFile } from '@/assets/common_functions.js'
  import { ANALYTICAL_QC_CALLS, ANALYTICAL_QC_GRADES, BACKEND_LOCATION, COMPTOX_PAGE_URL } from '@/assets/store.js'
  import '@/styles/main.css'
  import '@mdi/font/css/materialdesignicons.min.css';

  export default {
    data() {
      return {
        ANALYTICAL_QC_CALLS,
        ANALYTICAL_QC_GRADES,
        aqc_data: [],
        BACKEND_LOCATION,
        COMPTOX_PAGE_URL,
        counts: {samples: 0, substances: 0, visible_records: 0},
        default_column_def: {resizable: true, filter: 'agTextColumnFilter', floatingFilter: true, sortable: true},
        status: {loading: true, full_count: 0},
        SET_FILTER_COLUMNS: ["study", "timepoint", "first_timepoint", "last_timepoint", "stability_call"],
        TEXT_FILTER_COLUMNS: ["internal_id", "dtxsid", "casrn", "molecular formula", "sample_id", "preferred_name", "experiment_date", "annotation", "flags"],
        column_defs: [
          {field: 'internal_id', headerName: "internal ID", hide: true},
          {field: 'dtxsid', headerName: 'DTXSID', width: 115, cellRenderer: params => {
            return "<a href='" + this.COMPTOX_PAGE_URL + params.data.dtxsid + "' target='_blank'>" + params.data.dtxsid + "</a>"
          }},
          {field: 'casrn', headerName: "CASRN", width: 100},
          {field: 'molecular_formula', headerName: "Formula", width: 110},
          {field: 'sample_id', headerName: "Sample ID", width: 110},
          {field: 'preferred_name', headerName: "Preferred Name", flex: 1, tooltipField: 'preferred_name'},
          {field: 'study', headerName: "Source/Technique", width: 140, filter: 'agSetColumnFilter'},
          {field: 'experiment_date', headerName: "Experiment Date", width: 140, hide: true},
          {field: 'timepoint', headerName: "Timepoint", width: 100, filter: 'agSetColumnFilter'},
          {field: 'first_timepoint', headerName: "First Timepoint", width: 140, filter: 'agSetColumnFilter', cellRenderer: params => {
            const m = params.data.first_timepoint
            if (this.ANALYTICAL_QC_GRADES[m]) {
              return `<span class='has-hover-text' title='${this.ANALYTICAL_QC_GRADES[m]}'>${m}</span>`
            } else {
              return m
            }
          }},
          {field: 'last_timepoint', headerName: "Last Timepoint", width: 140, filter: 'agSetColumnFilter', cellRenderer: params => {
            const m = params.data.last_timepoint
            if (this.ANALYTICAL_QC_GRADES[m]) {
              return `<span class='has-hover-text' title='${this.ANALYTICAL_QC_GRADES[m]}'>${m}</span>`
            } else {
              return m
            }
          }},
          {field: 'stability_call', headerName: "Stability Call", width: 120, filter: 'agSetColumnFilter', cellRenderer: params => {
            const m = params.data.stability_call
            if (this.ANALYTICAL_QC_CALLS[m]) {
              return `<span class='has-hover-text' title='${this.ANALYTICAL_QC_CALLS[m]}'>${m}</span>`
            } else {
              return m
            }
          }},
          {field: 'lcms_amen_pos_true', headerName: 'ESI+', width: 80},
          {field: 'lcms_amen_neg_true', headerName: 'ESI-', width: 80},
          {field: 'annotation', headerName: "Annotation", flex: 1, tooltipField: 'annotation'},
          {field: 'flags', headerName: "Substance Flags", flex: 1, tooltipField: 'flags', cellClass: {'text-wrap': 'wrap'}}
        ]
      }
    },
    async mounted() {
      const count_response = await axios.get(`${this.BACKEND_LOCATION}/record_type_count/analytical_qc`)
      const analytical_qc_count = count_response.data.record_count
      this.status.full_count = analytical_qc_count

      const BATCH_SIZE = 1000
      const num_pages = Math.ceil(analytical_qc_count / BATCH_SIZE)

      for (let i = 0; i < num_pages; i++) {
        const batch_response = await axios.get(`${this.BACKEND_LOCATION}/analytical_qc_pagination/${BATCH_SIZE}/${i*BATCH_SIZE}`)
        const batch_results = batch_response.data.results
        this.aqc_data = this.aqc_data.concat(batch_results)
      }
      this.status.loading = false
      this.gridApi.onFilterChanged();

      const query_params = Object.keys(this.$route.query)
      if (query_params.length == 0) {
        // filter NIST GCMS records out by default if no query parameters were passed
        var set_filter_values = this.gridApi.getFilterInstance("study").getValues()
        set_filter_values = set_filter_values.filter(x => x !== "NIST GCMS")
        this.gridApi.getFilterInstance("study").setModel({type: 'set', values: set_filter_values})
      } else {
        const filter_object = queryParamsToFilters(this.$route.query, [], this.SET_FILTER_COLUMNS, this.TEXT_FILTER_COLUMNS)
        this.gridApi.setFilterModel(filter_object)
      }
      this.gridApi.onFilterChanged();
      this.gridColumnApi.applyColumnState({state: [
        {colId: "preferred_name", sort: "asc", sortIndex: 0},
        {colId: "sample_id", sort: "asc", sortIndex: 1}
      ]})
    },
    methods: {
      onGridReady(params) {
        this.gridApi = params.api
        this.gridColumnApi = params.columnApi
        this.gridApi.onFilterChanged();
      },
      onRowSelected(event){
        1
      },
      onFilterChanged(params) {
        this.counts.visible_records = this.gridApi.getDisplayedRowCount()
        const dtxsids = Array(this.counts.visible_records).fill().map((_,idx) => this.gridApi.getDisplayedRowAtIndex(idx).data.dtxsid)
        const sample_ids = Array(this.counts.visible_records).fill().map((_,idx) => this.gridApi.getDisplayedRowAtIndex(idx).data.sample_id)
        this.counts.substances = new Set(dtxsids).size
        this.counts.samples =  new Set(sample_ids).size
      },
      onDoubleClick(event) {
        window.open(`view_spectrum_pdf/${event.data.internal_id}`)
      },
      downloadCurrentTable() {
        this.gridApi.exportDataAsExcel({
          fileName: `analytical_qc_${timestampForFile()}.xlsx`
        });
      },
      saveFiltersAsURL() {
        const all_filters = this.gridApi.getFilterModel();
        const base_url = window.location.origin + this.$route.path
        const url = filtersToURL(base_url, all_filters)
        
        // NOTE: the preferred way to copy to clipboard is apparently "navigator.clipboard.writeText()" these days. I
        // can't get that to work in this app, though, since it apparently requires a secured connection and the
        // deployed version of this app doesn't have that.  So I'm sticking to this technically-depricated solution that
        // I pulled out of CompTox's code, since it apparently works there.
        const textarea = document.createElement('textarea')
        textarea.value = encodeURI(url)
        document.body.appendChild(textarea)
        textarea.select()
        try {
          document.execCommand('copy')
        } catch (err) {
          console.log('Cannot copy: ' + err)
        }
        document.body.removeChild(textarea)
      },
      downloadSubstances() {
        var seen_dtxsids = []
        var rows_to_keep = []
        this.gridApi.forEachNodeAfterFilterAndSort( (rowNode, index) => {
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
      },
      resetFilters() {
        this.gridApi.setFilterModel(null);
      }
    },
    components: { AgGridVue, BProgress }
  }
</script>

<style>
  .ag-cell-wrap-text {
    word-break: normal
  }

  .ag-cell {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .analyticalqc-grades {
    border: 1px solid black;
    border-collapse: collapse;
  }

  .analyticalqc-grades th {
    border: 1px solid black;
    padding: 2px 10px;
    background-color: #FEFF99;
    text-align: center;
  }

  .analyticalqc-grades td {
    border: 1px solid black;
    padding: 2px 5px;
  }

  .score-1 {
    text-align: center;
    background-color: #00AF50;
  }

  .score-2 {
    text-align: center;
    background-color: #92D14F;
  }

  .score-3 {
    text-align: center;
    background-color: #FFFF00;
  }

  .score-4 {
    text-align: center;
    background-color: #FFC000;
  }

  .score-5 {
    text-align: center;
    background-color: #FE0000;
  }

  .caution {
    text-align: center;
    background-color: #FE9799;
  }

  .ungraded {
    text-align: center;
    background-color: #DADADA;
  }

  .withdrawn {
    text-align: center;
    background-color: #A7A7A7;
  }
</style>