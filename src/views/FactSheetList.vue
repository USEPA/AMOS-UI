<!--
  This page displays a list of all fact sheets in the database, as well as being able to display the fact sheets
  themselves with their associated substances.

  This page takes no URL route or query parameters.
-->

<template>
  <div>
    <p>
      This is a list of fact sheets available in the database.  Select a row in the table to view the fact sheet on the right side of the page.
    </p>
    <div v-if="status.loading">Loading...</div>
    <p v-else>{{fact_sheet_info.length}} fact sheets in total are present in the database; {{ filtered_record_count }} {{filtered_record_count == 1 ? "is" : "are"}} currently displayed, covering {{substance_count}} {{filtered_record_count == 1 ? "substance" : "substances"}}.</p>
    <div style="padding-bottom: 10px;">
      <label for="full-table-filter">Full Table Filter</label> &nbsp;
      <input type="text" v-model="full_table_filter" name="full-table-filter" @keyup="quickFilter(full_table_filter)">
      &nbsp;
      <help-icon style="vertical-align:middle;" tooltipText="The contents of this field act as a filter on all columns in the table, returning all results where the filter appears in any field." />
    </div>
    <div>
      <label for="full-table-filter">Substance Filter</label> &nbsp;
      <input type="text" v-model="substance_identifier" name="full-table-filter">
      <button @click="filterBySubstance(substance_identifier)" :disabled="status.filter_by_substance==true">Filter</button>
      <button @click="clearSubstanceFilter" :disabled="status.filter_by_substance==false">Clear Filter</button>
    </div>
    <div class="button-array">
      <button @click="saveFiltersAsURL">Copy filters to clipboard</button>
      <button @click="downloadCurrentTable">Download Table</button>
      <button @click="downloadSubstancesInDocs" :disabled="filtered_record_count==0">Download Substances</button>
      <button @click="resetFilters">Reset Filters</button>
    </div>
    <ag-grid-vue
      class="ag-theme-balham"
      style="height:800px; width:100%"
      :defaultColDef="default_column_def"
      :columnDefs="column_defs"
      :rowData="fact_sheet_info"
      rowSelection="single"
      @first-data-rendered="onGridReady"
      @row-selected="onRowSelected"
      @filter-changed="onFilterChanged"
      @row-double-clicked="onDoubleClick"
      :isExternalFilterPresent="isExternalFilterPresent"
      :doesExternalFilterPass="doesExternalFilterPass"
      :tooltipShowDelay="400"
      :suppressCopyRowsToClipboard="true"
    ></ag-grid-vue>
    <b-modal size="xl" v-model="disambiguation.inchikey">
      <InchikeyDisambiguation :searchedKey="substance_identifier" :substances="possible_substances" :record_counts="record_counts_by_dtxsid" @inchikeySelected="disambiguate" />
    </b-modal>
    <b-modal size="xl" v-model="disambiguation.synonym">
      <SynonymDisambiguation :synonym="substance_identifier" :substances="possible_substances" :record_counts="record_counts_by_dtxsid" @synonymSelected="disambiguate" />
    </b-modal>
  </div>
</template>

<script>
  import axios from 'axios'
  
  import 'ag-grid-community/styles/ag-grid.css'
  import 'ag-grid-community/styles/ag-theme-balham.css'
  import { AgGridVue } from "ag-grid-vue3"
  import 'ag-grid-enterprise'
  import { LicenseManager } from 'ag-grid-enterprise'
  LicenseManager.setLicenseKey('CompanyName=US EPA,LicensedGroup=Multi,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=5,LicensedProductionInstancesCount=0,AssetReference=AG-010288,ExpiryDate=3_December_2022_[v2]_MTY3MDAyNTYwMDAwMA==4abffeb82fbc0aaf1591b8b7841e6309')

  import { filtersToURL, queryParamsToFilters, sourceAbbreviationTooltip, timestampForFile } from '@/assets/common_functions'
  import { BACKEND_LOCATION, SOURCE_ABBREVIATION_MAPPING } from '@/assets/store'
  import '@/assets/style.css'
  import InchikeyDisambiguation from '@/components/InchikeyDisambiguation.vue'
  import StoredPDFDisplay from '@/components/StoredPDFDisplay.vue'
  import SynonymDisambiguation from '@/components/SynonymDisambiguation.vue'
  import HelpIcon from '@/components/HelpIcon.vue'

  export default {
    data(){
      return {
        SOURCE_ABBREVIATION_MAPPING,
        selected_row_data: {},
        fact_sheet_info: null,
        any_fact_sheet_selected: false,  // used to avoid having a box with an error pop up if nothing's been selected yet,
        BACKEND_LOCATION,
        filtered_record_count: 0,
        full_table_filter: "",
        substance_identifier: "",
        default_column_def: {resizable: true},
        substance_count: 0,
        disambiguation: {inchikey: false, synonym: false},
        status: {loading: true, substance_searching: false, filter_by_substance: false},
        fact_sheets_with_substance: [],
        possible_substances: [],
        record_counts_by_dtxsid: {},
        NUMERIC_COLUMNS: [],
        TEXT_COLUMNS: ['analyte', 'document_type', 'fact_sheet_name', 'functional_classes', 'internal_id', 'source'],
        column_defs: [
          {field: 'internal_id', headerName: 'Doc ID', sortable: true, width: 80, comparator: (valA, valB, nodeA, nodeB, isDescending) => {
            return Number.parseInt(valA.substring(3)) - Number.parseInt(valB.substring(3))
          }},
          {field: 'fact_sheet_name', headerName: 'Fact Sheet Name', sortable: true, filter: 'agTextColumnFilter', floatingFilter: true, sort: "asc", flex: 1, tooltipField: 'fact_sheet_name'},
          {field: 'source', headerName: 'Source', sortable: true, filter: 'agTextColumnFilter', floatingFilter: true, width: 90, tooltipValueGetter: params => {
              return sourceAbbreviationTooltip(params.data.source)
            }, cellClass: params => {
              if (this.SOURCE_ABBREVIATION_MAPPING[params.data.source] && this.SOURCE_ABBREVIATION_MAPPING[params.data.source].full_name) {
                return "has-hover-text"
              }
            }
          },
          {field: 'document_type', headerName: 'Type', sortable: true, width: 90, filter: 'agTextColumnFilter', floatingFilter: true},
          {field: 'analyte', headerName: 'Analyte', sortable: true, flex: 1, filter: 'agTextColumnFilter', floatingFilter: true, cellRenderer: params => {
            if (params.data.count == 1){
              const link = document.createElement("a");
              link.href = this.$router.resolve(`/search/${params.data.dtxsid}`).href;
              link.innerText = params.data.analyte;
              link.addEventListener("click", e => {
                e.preventDefault();
                this.$router.push(`/search/${params.data.dtxsid}`);
              });
              return link;
            } else {
              return params.data.analyte
            }
          }},
          {field: 'functional_classes', headerName: 'Functional Classes', sortable: true, filter: 'agTextColumnFilter', floatingFilter: true},
          {field: 'link', headerName: 'Link', sortable: true, width: 70, cellRenderer: params => {
            return `<a href='${params.data.link}' target='_blank'>Link</a>`
          }}
        ]
      }
    },

    async created() {
      const path = `${this.BACKEND_LOCATION}/fact_sheet_list`
      const response = await axios.get(path)
      this.fact_sheet_info = response.data.results
      this.status.loading = false
    },

    methods: {
      onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        
        // load query parameters
        if (Object.keys(this.$route.query).includes("full_table")) {
          this.full_table_filter = this.$route.query["full_table"]
          this.gridApi.setQuickFilter(this.full_table_filter)
        }
        const filter_object = queryParamsToFilters(this.$route.query, this.NUMERIC_COLUMNS, [], this.TEXT_COLUMNS)
        this.gridApi.setFilterModel(filter_object)

        this.gridApi.onFilterChanged();
      },
      onRowSelected(event){
        if (event.event){
          this.selected_row_data = event.data
          this.any_fact_sheet_selected = true
          this.target_pdf_url = `${this.BACKEND_LOCATION}/get_pdf/fact sheet/${event.data.internal_id}`
        }
      },
      onDoubleClick(event) {
        window.open(`/view_fact_sheet/${event.data.internal_id}`)
      },
      async filterBySubstance(identifier) {
        const response = await axios.get(`${this.BACKEND_LOCATION}/get_substances_for_search_term/${identifier}`)
        // There are three possibilities: no search term found, search term found, search term is ambiguous (matches
        // multiple substances by synonym or first block of InChIKey).
        if (response.data.substances === null) {
          // No substance found.
          this.no_substance_match = true
          this.still_searching = false
        } else if (response.data.ambiguity) {
          // Search term is ambiguous.
          const ambiguity_type = response.data.ambiguity
          this.possible_substances = response.data.substances
          const dtxsids = this.possible_substances.map(ps => ps.dtxsid)
          this.record_counts_by_dtxsid = await axios.post(`${this.BACKEND_LOCATION}/record_counts_by_dtxsid/`, {dtxsids: dtxsids})
          this.record_counts_by_dtxsid = this.record_counts_by_dtxsid.data
          if (ambiguity_type == "inchikey") {
            this.disambiguation.inchikey = true
          } else if (ambiguity_type == "synonym") {
            this.disambiguation.synonym = true
          }
        } else {
          // Search term matches one substance.
          const fact_sheet_response = await axios.get(`${this.BACKEND_LOCATION}/fact_sheets_for_substance/${response.data.substances.dtxsid}`)
          this.fact_sheets_with_substance = fact_sheet_response.data.internal_ids
          this.status.filter_by_substance = true
          this.gridApi.onFilterChanged()
          console.log(fact_sheet_response)
        }
      },
      isExternalFilterPresent() {
        return this.status.filter_by_substance
      },
      doesExternalFilterPass(node) {
        // filter out result types based on selected tab
        if (this.fact_sheets_with_substance.includes(node.data.internal_id)) {
          return true
        } else {
          return false
        }
      },
      disambiguate(dtxsid) {
        this.disambiguation.inchikey = false
        this.disambiguation.synonym = false
        this.filterBySubstance(dtxsid)
      },
      clearSubstanceFilter() {
        this.status.filter_by_substance = false
        this.substance_identifier = ""
        this.gridApi.onFilterChanged()
      },
      saveFiltersAsURL() {
        const current_filters = this.gridApi.getFilterModel();
        var url = filtersToURL(window.location.origin + this.$route.path, current_filters)
        if (this.full_table_filter) {
          url = url + `full_table=${this.full_table_filter}`
        }

        // NOTE: the preferred way to copy to clipboard is apparently "navigator.clipboard.writeText()" these days. I
        // can't get that to work in this app, though, since it apparently requires a secured connection and the
        // deployed version of this app doesn't have that.  So I'm sticking to this technically-depricated solution that
        // I pulled out of CompTox's code, since it apparently works there.
        const textarea = document.createElement('textarea')
        textarea.value = url
        document.body.appendChild(textarea)
        textarea.select()
        try {
          document.execCommand('copy')
        } catch (err) {
          console.log('Cannot copy: ' + err)
        }
        document.body.removeChild(textarea)
      },
      async onFilterChanged(params) {
        this.filtered_record_count = this.gridApi.getDisplayedRowCount()
        const internal_id_list = Array(this.filtered_record_count).fill().map((_,idx) => this.gridApi.getDisplayedRowAtIndex(idx).data.internal_id)
        const count_response = await axios.post(`${this.BACKEND_LOCATION}/count_substances_in_ids/`, {internal_id_list: internal_id_list})
        this.substance_count = count_response.data.count
      },
      quickFilter(input) {
        this.gridApi.setQuickFilter(input)
      },
      async downloadSubstancesInDocs() {
        const internal_id_list = Array(this.filtered_record_count).fill().map((_,idx) => this.gridApi.getDisplayedRowAtIndex(idx).data.internal_id)
        
        await axios.post(`${this.BACKEND_LOCATION}/substances_for_ids/`, {internal_id_list: internal_id_list}, {responseType: "blob"}).then(res => {
          let blob = new Blob([res.data], {type: res.headers['content-type']})
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = `fact_sheet_list_substances_${timestampForFile()}.xlsx`
          link.click()
        })
      },
      resetFilters() {
        this.gridApi.setFilterModel(null);
        this.quickFilter("")
      },
      downloadCurrentTable() {
        var columns = this.gridColumnApi.getAllDisplayedColumns().map(x => x.colId)
        if (!columns.includes("link")) {
          columns.push("link")
        }
        this.gridApi.exportDataAsExcel({
          fileName: `fact_sheet_list_${timestampForFile()}.xlsx`,
          columnKeys: columns
        });
      }
    },

    components: {
      AgGridVue,
      HelpIcon,
      InchikeyDisambiguation,
      StoredPDFDisplay,
      SynonymDisambiguation
    }
  }
</script>

<style>

</style>