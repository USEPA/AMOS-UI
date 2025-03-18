<!--
  This page shows results for a structure similarity search.  An individual substance is searched for (by name, DTXSID,
  CASRN, or InChIKey) and the search returns all methods and fact sheets which contain either the searched substance or
  at least one substance that is sufficiently similar to the searched substance.

  This page takes no URL route or query parameters.
-->

<template>
  <div class="two-column-page">
    <div class="half-page-column">
      <p></p>
      <div>
        <label for="search-dtxsid">Substance Identifier</label> &nbsp;
        <input @keyup.enter="documentSearch(searched_substance)" type="text" size="30" v-model="searched_substance" name="search-dtxsid">
        <button @click="documentSearch(searched_substance)">Search</button>
      </div>
      <div style="margin-top: 10px">
        <label for="similarity-select">Filter minimum substance similarity</label> &nbsp;
        <select id="similarity-select" v-model="min_similarity" style="width: 300">
          <option :value="0.5">0.5</option>
          <option :value="0.6">0.6</option>
          <option :value="0.7">0.7</option>
          <option :value="0.8">0.8</option>
          <option :value="0.9">0.9</option>
          <option :value="1.0">1.0</option>
        </select>
      </div>
      <br />
      <p v-if="searching" style="font-size: larger">
        Searching -- this may take 20-30 seconds... <i class="mdi mdi-progress-clock mdi-spin"></i>
      </p>
      <p v-else-if="!search_complete">This page allows for searching for methods and fact sheets that contain either a given chemical or other chemicals similar to it.  A name, InChIKey, CASRN, or DTXSID can be searched on.</p>
      <p v-else-if="!found_substance">"{{ current_substance }}" was not recognized as a known substance.</p>
      <p v-else-if="dtxsid_counts.length == 0">The substance "{{ current_substance }}" was recognized, however no methods or fact sheets containing it or similar substances for it were found.</p>
      <div v-else>
        <div style="display: flex">
          <p>The tabbed area below has three tables with information related to {{ current_substance }} (structure pictured right) and similar substances -- one lists all relevant methods, one lists all relevant fact sheets, and the third lists all similar substances found.  Clicking on a row will bring up the method or a comparison between the searched and selected substances, respectively.  Hover over a method or substance name to see the full name.  Methods and fact sheets in bold contain the searched substance.</p>
          <div style="display: block; margin-left: auto; margin-right: auto; width:200px; height:200px;">
            <img v-if="substance_info.searched_substance.image_link" style="width:200px; height:200px;" :src="substance_info.searched_substance.image_link" :alt="`Structure image for ${substance_info.searched_substance.dtxsid}`"/>  
            <div v-else style="text-align: center; display: flex; align-items: center;">No structural representation was found for this substance.</div>
          </div>
        </div>
        <p>{{ dtxsid_counts.length }} distinct similar substances were found in  {{ Object.keys(ids_to_method_names).length }} methods and {{ Object.keys(ids_to_fact_sheet_names).length }} fact sheets.</p>
        <div class="tab-bar">
          <button :class="tab_viewer_mode == 'Methods' ? 'active': ''" @click="updateTab('Methods')">Methods</button>
          <button :class="tab_viewer_mode == 'Fact Sheets' ? 'active': ''" @click="updateTab('Fact Sheets')">Fact Sheets</button>
          <button :class="tab_viewer_mode == 'Substances' ? 'active': ''" @click="updateTab('Substances')">Substances</button>
        </div>
        <div id="grid-theme-wrapper">
          <ag-grid-vue v-if="tab_viewer_mode == 'Methods'"
            class="ag-theme-balham"
            style="height:600px; width:100%"
            :columnDefs="method_column_defs"
            :rowData="method_results"
            :autoGroupColumnDef="methodsGroupColumnDef"
            suppressAggFuncInHeader="true"
            rowSelection="single"
            @row-selected="documentRowSelected"
            @grid-ready="methodsGridReady"
            :rowClassRules="methodsRowClassRules"
            :isExternalFilterPresent="isExternalFilterPresent"
            :doesExternalFilterPass="doesExternalFilterPass"
            :suppressCopyRowsToClipboard="true"
            :defaultColDef="defaultColDef"
          ></ag-grid-vue>
          <ag-grid-vue v-if="tab_viewer_mode == 'Fact Sheets'"
            class="ag-theme-balham"
            style="height:600px; width:100%"
            :columnDefs="fact_sheet_column_defs"
            :rowData="fact_sheet_results"
            :autoGroupColumnDef="factSheetsGroupColumnDef"
            suppressAggFuncInHeader="true"
            rowSelection="single"
            @row-selected="documentRowSelected"
            @grid-ready="factSheetsGridReady"
            :rowClassRules="methodsRowClassRules"
            :isExternalFilterPresent="isExternalFilterPresent"
            :doesExternalFilterPass="doesExternalFilterPass"
            :suppressCopyRowsToClipboard="true"
            :defaultColDef="defaultColDef"
          ></ag-grid-vue>
          <ag-grid-vue v-if="tab_viewer_mode == 'Substances'"
            class="ag-theme-balham"
            style="height:600px; width:100%"
            :columnDefs="count_column_defs"
            :rowData="dtxsid_counts"
            rowSelection="single"
            @row-selected="substancesRowSelected"
            :getRowClass="getRowClass"
            :suppressCopyRowsToClipboard="true"
          ></ag-grid-vue>
        </div>
      </div>
    </div>
    <StoredPDFDisplay style="width: 48vw;" v-if="right_side_viewer_mode == 'Methods'" :internalID="selected_row_data.internal_id" recordType="method" :highlightedSubstances="highlighted_substances"/>
    <StoredPDFDisplay style="width: 48vw;" v-else-if="right_side_viewer_mode == 'Fact Sheets'" :internalID="selected_row_data.internal_id" recordType="fact sheet" :highlightedSubstances="highlighted_substances"/>
    <div class="half-page-column" v-else-if="right_side_viewer_mode == 'Substances'">
      <h4>Searched Substance:</h4>
      <div style="display: flex; justify-content: center;">
        <BasicSubstanceDisplay style="justify-content: left; width: 90%" :substanceInfo="substance_info.searched_substance" :classification="classyfire.searched_substance" :functionalUses="functional_uses.searched_substance" />
      </div>
      <br />
      <h4>Selected Substance From Table:</h4>
      <div style="display: flex; justify-content: center;">
        <BasicSubstanceDisplay style="justify-content: left; width: 90%" :substanceInfo="substance_info.similar_substance" :classification="classyfire.similar_substance" :functionalUses="functional_uses.similar_substance"/>
      </div>
    </div>
  </div>
  <BModal size="xl" v-model="disambiguation.inchikey">
    <InchikeyDisambiguation :searchedKey="$route.params.search_term" :substances="possible_substances" :record_counts="record_counts_by_dtxsid" @inchikeySelected="disambiguate"/>
  </BModal>
  <BModal size="xl" v-model="disambiguation.synonym">
    <SynonymDisambiguation :synonym="$route.params.search_term" :substances="possible_substances" :record_counts="record_counts_by_dtxsid" @synonymSelected="disambiguate" />
  </BModal>
</template>

<script>
  import axios from 'axios'
  import { BModal } from 'bootstrap-vue-next'

  import 'ag-grid-community/styles/ag-grid.css'
  import 'ag-grid-community/styles/ag-theme-balham.css'
  import { AgGridVue } from "ag-grid-vue3"
  import 'ag-grid-enterprise'
  import { LicenseManager } from 'ag-grid-enterprise'
  LicenseManager.setLicenseKey('CompanyName=US EPA,LicensedGroup=Multi,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=5,LicensedProductionInstancesCount=0,AssetReference=AG-010288,ExpiryDate=3_December_2022_[v2]_MTY3MDAyNTYwMDAwMA==4abffeb82fbc0aaf1591b8b7841e6309')

  import { imageLinkForSubstance } from '@/assets/common_functions.js'
  import { BACKEND_LOCATION, COMPTOX_PAGE_URL } from '@/assets/store.js'
  import BasicSubstanceDisplay from '@/components/BasicSubstanceDisplay.vue'
  import InchikeyDisambiguation from '@/components/InchikeyDisambiguation.vue'
  import StoredPDFDisplay from '@/components/StoredPDFDisplay.vue'
  import SynonymDisambiguation from '@/components/SynonymDisambiguation.vue'
  import '@/styles/main.css'
  import '@mdi/font/css/materialdesignicons.min.css';
  
  export default{
    data() {
      return {
        BACKEND_LOCATION,
        COMPTOX_PAGE_URL,
        method_results: null,
        fact_sheet_results: null,
        any_row_selected: false,
        searching: false,
        search_complete: false,
        found_substance: false,
        disambiguation: {inchikey: false, synonym: false},
        possible_substances: [],
        dtxsid_counts: [],
        selected_row_data: {},
        searched_substance: "",
        current_substance: "",
        ids_to_method_names: "",
        ids_to_fact_sheet_names: "",
        current_method_shown_id: "",
        tab_viewer_mode: "Methods",
        right_side_viewer_mode: "N/A",
        substance_info: {searched_substance: {}, similar_substance: {}},
        highlighted_substances: [],
        record_counts_by_dtxsid: {},
        min_similarity: 0.5,
        classyfire: {searched_substance: null, similar_substance: null},
        functional_uses: {searched_substance: null, similar_substance: null},
        defaultColDef: {filter: true, floatingFilter: true},
        method_column_defs: [
          {field: "internal_id", rowGroup: true, hide: true, filter: 'agTextColumnFilter', floatingFilter: true, cellRenderer: params => {
            const title_text = this.ids_to_method_names[params.value] + " (" + params.node.allChildrenCount + ")"
            return `<span title='${title_text}'>${this.ids_to_method_names[params.value]}</span>`
          }},
          {field: "source", headerName: "Source", width: 90, suppressSizeToFit: true, filter: 'agTextColumnFilter', sortable: true, aggFunc: 'first'},
          {field: "methodology", headerName: "Methodology", width: 120, suppressSizeToFit: true, filter: 'agTextColumnFilter', sortable: true, aggFunc: 'first'},
          {field: "year_published", headerName: "Year", width: 70, suppressSizeToFit: true, filter: 'agNumberColumnFilter', sortable: true, aggFunc: 'first'},
          {field: "similarity", headerName: "Similarity", width: 95, suppressSizeToFit: true, filter: false, sortable: true, sort: 'desc', aggFunc: 'max', cellRenderer:'agGroupCellRenderer', cellRendererParams: {
            innerRenderer: params => {return params.value.toFixed(2)}
          }},
          {field: "dtxsid", headerName: "Similar DTXSID", width: 125, suppressSizeToFit: true, filter: false},
          {field: "substance_name", headerName: "Substance Name", filter: false}
        ],
        fact_sheet_column_defs: [
          {field: "internal_id", rowGroup: true, hide: true, sortable: true, flex: 1, filter: 'agTextColumnFilter', floatingFilter: true, cellRenderer: params => {
            const title_text = this.ids_to_fact_sheet_names[params.value] + " (" + params.node.allChildrenCount + ")";
            return `<span title='${title_text}'>${this.ids_to_fact_sheet_names[params.value]}</span>`
          }},
          {field: "source", headerName: "Source", width: 90, suppressSizeToFit: true, filter: 'agTextColumnFilter', floatingFilter: true, sortable: true, aggFunc: 'first'},
          {field: "similarity", headerName: "Similarity", width: 95, suppressSizeToFit: true, filter: false, sortable: true, sort: 'desc', aggFunc: 'max', cellRenderer:'agGroupCellRenderer', cellRendererParams: {
            innerRenderer: params => {return params.value.toFixed(2)}
          }},
          {field: "dtxsid", headerName: "Similar DTXSID", width: 125, suppressSizeToFit: true, filter: false},
          {field: "substance_name", headerName: "Substance Name", filter: false}
        ],
        count_column_defs: [
          {field: "dtxsid", headerName: "DTXSID", sortable: true, width: 125},
          {field: "preferred_name", headerName: "Name", sortable: true, flex: 1, tooltipField: "preferred_name"},
          {field: "similarity", headerName: "Similarity", sortable: true, sort: 'desc', width: 110, cellRenderer: 
            params => {return params.data.similarity.toFixed(2)}
          },
          {field: "num_methods", headerName: "Methods", sortable: true, width: 100},
          {field: "num_fact_sheets", headerName: "Fact Sheets", sortable: true, width: 100}
        ],
        methodsRowClassRules: {
          "emphasized-row": function(params) {
            if (params.data === undefined) {
              return params.node.allLeafChildren[0].data.has_searched_substance
            } else {
              return params.data.has_searched_substance
            }
          }
        },
        methodsGroupColumnDef: {headerName: 'Method Name (# substances)', filter: 'agTextColumnFilter', width: 210, sortable: true,
          filterValueGetter: (params) => {return this.ids_to_method_names[params.data.internal_id]},
          comparator: (valueA, valueB, nodeA, nodeB, isDescending) => {
          // Need to be able to sort the groups by method name, not internal id, so map them and then compare.
            const nameA = this.ids_to_method_names[valueA]
            const nameB = this.ids_to_method_names[valueB]
            return nameA == nameB ? 0 : nameA > nameB ? 1 : -1
          }
        },
        factSheetsGroupColumnDef: {headerName: 'Fact Sheet Name (# substances)', filter: 'agTextColumnFilter', sortable: true,
          filterValueGetter: (params) => {return this.ids_to_fact_sheet_names[params.data.internal_id]},
          comparator: (valueA, valueB, nodeA, nodeB, isDescending) => {
            // Need to be able to sort the groups by method name, not internal id, so map them and then compare.
            const nameA = this.ids_to_fact_sheet_names[valueA]
            const nameB = this.ids_to_fact_sheet_names[valueB]
            return nameA == nameB ? 0 : nameA > nameB ? 1 : -1
          }
        } 
      }
    },
    async created() {
      if (typeof(this.$route.query.search_term) === "string") {
        this.searched_substance = this.$route.query.search_term
        this.documentSearch(this.searched_substance)
      }
    },
    components: {
      AgGridVue,
      BasicSubstanceDisplay,
      BModal,
      InchikeyDisambiguation,
      StoredPDFDisplay,
      SynonymDisambiguation
    },
    watch: {
      min_similarity(new_sim, old_sim) {
        // when the minimum similarity changes, filter results as appropriate
        if (this.search_complete & this.found_substance) {
          if ((this.tab_viewer_mode == "Methods") & this.method_results.length > 0) {
            this.methodsGridApi.onFilterChanged()
            this.updateHighlightedSubstances()
          }
          else if ((this.tab_viewer_mode == "Fact Sheets") & this.fact_sheet_results.length > 0)
          this.factSheetsGridApi.onFilterChanged()
          this.updateHighlightedSubstances()
        }
      }
    },
    methods: {
      updateHighlightedSubstances() {
        this.highlighted_substances = this.dtxsid_counts.filter(x => x.similarity >= this.min_similarity).map(x => x.dtxsid)
      },
      async documentSearch(searched_substance) {
        // variable setup
        this.results = null
        this.searching = true
        this.right_side_viewer_mode = "N/A"
        this.search_complete = false

        const response = await axios.get(`${this.BACKEND_LOCATION}/get_substances_for_search_term/${searched_substance.trim()}`)
        if (response.data.substances === null) {
          this.found_substance = false
          this.searching = false
        } else if (response.data.ambiguity) {
          this.possible_substances = response.data.substances
          const dtxsids = this.possible_substances.map(ps => ps.dtxsid)
          this.record_counts_by_dtxsid = await axios.post(`${this.BACKEND_LOCATION}/record_counts_by_dtxsid/`, {dtxsids: dtxsids})
          this.record_counts_by_dtxsid = this.record_counts_by_dtxsid.data
          if (response.data.ambiguity == "inchikey") {
            this.disambiguation.inchikey = true
          } else if (response.data.ambiguity == "synonym") {
            this.disambiguation.synonym = true
          }
        } else {
          this.substance_info.searched_substance = response.data.substances
          this.substance_info.searched_substance.image_link = await imageLinkForSubstance(response.data.substances.dtxsid, response.data.substances.image_in_comptox)
          const methods_response = await axios.get(`${this.BACKEND_LOCATION}/get_similar_structures/${response.data.substances.dtxsid}`)
          this.dtxsid_counts = methods_response.data.dtxsid_counts
          const classyfire_response = await axios.get(`${this.BACKEND_LOCATION}/get_classification_for_dtxsid/${response.data.substances.dtxsid}`)
          if ((classyfire_response.status == 200) & (classyfire_response.data.kingdom !== null)) {
            this.classyfire.searched_substance = classyfire_response.data
          } else {
            this.classyfire.searched_substance = null
          }

          const functional_use_response = await axios.get(`${this.BACKEND_LOCATION}/functional_uses_for_dtxsid/${response.data.substances.dtxsid}`)
          if (functional_use_response.data.functional_classes !== null) {
            this.functional_uses.searched_substance = functional_use_response.data.functional_classes.join(", ")
          } else {
            this.functional_uses.searched_substance = null
          }
          
          this.updateHighlightedSubstances()
          this.current_substance = searched_substance.trim()  // should be whatever the user chooses
          this.found_substance = true
          this.method_results = methods_response.data.method_results
          this.fact_sheet_results = methods_response.data.fact_sheet_results
          this.ids_to_method_names = methods_response.data.ids_to_method_names
          this.ids_to_fact_sheet_names = methods_response.data.ids_to_fact_sheet_names
          this.searching = false
          this.search_complete = true
        }
      },
      methodsGridReady(params) {
        this.methodsGridApi = params.api
        // this.methodsGridColumnApi = params.columnApi
      },
      factSheetsGridReady(params) {
        this.factSheetsGridApi = params.api
        // this.factSheetsridColumnApi = params.columnApi
      },
      documentRowSelected(event) {
        if (event.event){
          var new_doc_id = ""
          var source = ""
          // There are two possibilities: either a group header row has been slected, or not.  In the former case, the
          // event.data field will not exist, but it does exist in the latter case, so it's useful for distinguishing
          // the two.
          if (event.data) {
            new_doc_id = event.data.internal_id
            source = event.data.source
          } else {
            new_doc_id = event.node.key
            source = event.node.aggData.source
          }
          if (new_doc_id != this.current_method_shown_id) {
            this.current_method_shown_id = new_doc_id
            this.selected_row_data = {internal_id: new_doc_id, source}
            if (this.current_method_shown_id.substring(0,3) == "GJ-") {
              this.right_side_viewer_mode = "Methods"
            } else {
              this.right_side_viewer_mode = "Fact Sheets"
            }
          }
        }
      },
      async substancesRowSelected(event) {
        if (event.event) {
          const substance_response = await axios.get(`${this.BACKEND_LOCATION}/get_substances_for_search_term/${event.data.dtxsid}`)
          this.substance_info.similar_substance = substance_response.data.substances
          this.substance_info.similar_substance.image_link = imageLinkForSubstance(substance_response.data.substances.dtxsid, substance_response.data.substances.image_in_comptox)

          const classyfire_response = await axios.get(`${this.BACKEND_LOCATION}/get_classification_for_dtxsid/${substance_response.data.substances.dtxsid}`)
          if ((classyfire_response.status == 200) & (classyfire_response.data.kingdom !== null)) {
            this.classyfire.similar_substance = classyfire_response.data
          } else {
            this.classyfire.similar_substance = null
          }

          const functional_use_response = await axios.get(`${this.BACKEND_LOCATION}/functional_uses_for_dtxsid/${substance_response.data.substances.dtxsid}`)
          if (functional_use_response.data.functional_classes !== null) {
            this.functional_uses.similar_substance = functional_use_response.data.functional_classes.join(", ")
          } else {
            this.functional_uses.similar_substance = null
          }

          this.right_side_viewer_mode = "Substances"
        }
      },
      disambiguate(dtxsid) {
        this.disambiguation.inchikey = false
        this.disambiguation.synonym = false
        this.documentSearch(dtxsid)
      },
      updateTab(tab_name) {
        this.tab_viewer_mode = tab_name
      },
      getRowClass(params) {
        if (params.node.data.dtxsid == this.substance_info.searched_substance.dtxsid) {
          return "emphasized-row"
        }
      },
      isExternalFilterPresent() {
        return true
      },
      doesExternalFilterPass(node) {
        return node.data.similarity >= this.min_similarity
      }
    }
  }
</script>

<style>
.emphasized-row {
  font-weight: 700;
}
</style>