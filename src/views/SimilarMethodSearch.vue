<!--
  This page shows results for a method similarity search.  An individual substance is searched for (by name, DTXSID,
  CASRN, or InChIKey) and the search returns a list of all methods which contain either the searched substance or at
  least one substance that is sufficiently similar to the searched substance.

  This page takes no URL route or query parameters.
-->

<template>
  <div class="two-column-page">
    <div class="half-page-column">
      <p></p>
      <div>
        <label for="search-dtxsid">Substance Identifier</label> &nbsp;
        <input @keyup.enter="methodSearch(searched_substance)" type="text" size="30" v-model="searched_substance" name="search-dtxsid">
        <button @click="methodSearch(searched_substance)">Method Search</button>
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
      <p v-if="searching">Searching -- this may take 20-30 seconds...</p>
      <p v-else-if="!search_complete">This page allows for searching for methods that contain either a given chemical or other chemicals similar to it.  A name, InChIKey, CASRN, or DTXSID can be searched on.</p>
      <p v-else-if="!found_substance">"{{ current_substance }}" was not recognized as a known substance.</p>
      <p v-else-if="dtxsid_counts.length == 0">The substance "{{ current_substance }}" was recognized, however no methods containing it or similar substances for it were found.</p>
      <div v-else>
        <p>There are two tables below -- one lists all the methods containing a substance similar to {{ current_substance }}, while the other lists all similar substances found.  Clicking on a row will bring up the method or a comparison between the searched and selected substances, respectively.  Hover over a method or substance name to see the full name.  Methods in bold contain the searched substance.</p>
        <p>{{ dtxsid_counts.length }} distinct similar substances were found in  {{ Object.keys(ids_to_method_names).length }} methods.</p>
        <div class="tab-bar">
          <button :class="tab_viewer_mode == 'Methods' ? 'active': ''" @click="updateTab('Methods')">Methods</button>
          <button :class="tab_viewer_mode == 'Substances' ? 'active': ''" @click="updateTab('Substances')">Substances</button>
        </div>
        <div id="grid-theme-wrapper" class="modded-theme">
          <ag-grid-vue v-if="tab_viewer_mode == 'Methods'"
            class="ag-theme-balham"
            style="height:600px; width:100%"
            :columnDefs="result_column_defs"
            :rowData="results"
            :autoGroupColumnDef="autoGroupColumnDef"
            suppressAggFuncInHeader="true"
            rowSelection="single"
            @row-selected="methodsRowSelected"
            @grid-ready="onGridReady"
            :rowClassRules="methodsRowClassRules"
            :isExternalFilterPresent="isExternalFilterPresent"
            :doesExternalFilterPass="doesExternalFilterPass"
          ></ag-grid-vue>
          <ag-grid-vue v-if="tab_viewer_mode == 'Substances'"
            class="ag-theme-balham"
            style="height:600px; width:100%"
            :columnDefs="count_column_defs"
            :rowData="dtxsid_counts"
            rowSelection="single"
            @row-selected="substancesRowSelected"
            :getRowClass="getRowClass"
            ></ag-grid-vue>
        </div>
      </div>
    </div>
    <StoredPDFDisplay style="width: 48vw;" v-if="right_side_viewer_mode == 'Methods'" :internalID="selected_row_data.internal_id" recordType="method" :highlightedSubstances="highlighted_substances"/>
    <div class="half-page-column" v-else-if="right_side_viewer_mode == 'Substances'">
      <h4>Searched Substance:</h4>
      <div style="display: flex; justify-content: center;">
        <BasicSubstanceDisplay style="justify-content: left; width: 90%" :substanceInfo="substance_info.searched_substance" :classification="classyfire.searched_substance" />
      </div>
      <br />
      <h4>Selected Substance From Table:</h4>
      <div style="display: flex; justify-content: center;">
        <BasicSubstanceDisplay style="justify-content: left; width: 90%" :substanceInfo="substance_info.similar_substance" :classification="classyfire.similar_substance"/>
      </div>
    </div>
  </div>
  <b-modal size="xl" v-model="disambiguation.inchikey">
    <InchikeyDisambiguation :searchedKey="$route.params.search_term" :substances="possible_substances" @inchikeySelected="disambiguate"/>
  </b-modal>
  <b-modal size="xl" v-model="disambiguation.synonym">
    <SynonymDisambiguation :synonym="$route.params.search_term" :substances="possible_substances" @synonymSelected="disambiguate" />
  </b-modal>
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
  import BasicSubstanceDisplay from '@/components/BasicSubstanceDisplay.vue'
  import InchikeyDisambiguation from '@/components/InchikeyDisambiguation.vue'
  import StoredPDFDisplay from '@/components/StoredPDFDisplay.vue'
  import SynonymDisambiguation from '@/components/SynonymDisambiguation.vue'
  
  export default{
    data() {
      return {
        BACKEND_LOCATION,
        COMPTOX_PAGE_URL,
        results: null,
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
        current_method_shown_id: "",
        tab_viewer_mode: "Methods",
        right_side_viewer_mode: "N/A",
        substance_info: {searched_substance: {}, similar_substance: {}},
        highlighted_substances: [],
        min_similarity: 0.5,
        classyfire: {searched_substance: null, similar_substance: null},
        result_column_defs: [
          {field: "internal_id", rowGroup: true, hide: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true, cellRenderer: params => {
            const title_text = this.ids_to_method_names[params.value] + " (" + params.node.allChildrenCount + ")";
            return `<span title='${title_text}'>${this.ids_to_method_names[params.value]}</span>`
          }},
          {field: "source", headerName: "Source", width: 90, suppressSizeToFit: true, filter: 'agTextColumnFilter', floatingFilter: true, sortable: true, aggFunc: 'first'},
          {field: "methodology", headerName: "Methodology", width: 120, suppressSizeToFit: true, filter: 'agTextColumnFilter', floatingFilter: true, sortable: true, aggFunc: 'first'},
          {field: "year_published", headerName: "Year", width: 70, suppressSizeToFit: true, filter: 'agNumberColumnFilter', floatingFilter: true, sortable: true, aggFunc: 'first'},
          {field: "similarity", headerName: "Similarity", width: 95, suppressSizeToFit: true, sortable: true, sort: 'desc', aggFunc: 'max', cellRenderer:'agGroupCellRenderer', cellRendererParams: {
            innerRenderer: params => {return params.value.toFixed(2)}
          }},
          {field: "dtxsid", headerName: "Similar DTXSID", width: 125, suppressSizeToFit: true, sortable: true},
          {field: "substance_name", headerName: "Substance Name"}
        ],
        count_column_defs: [
          {field: "dtxsid", headerName: "DTXSID", sortable: true, width: 125},
          {field: "preferred_name", headerName: "Name", sortable: true, flex: 1, tooltipField: "preferred_name"},
          {field: "similarity", headerName: "Similarity", sortable: true, sort: 'desc', width: 110, cellRenderer: 
            params => {return params.data.similarity.toFixed(2)}
          },
          {field: "num_methods", headerName: "# Methods", sortable: true, width: 110},
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
        autoGroupColumnDef: {headerName: 'Method Name (# substances)', filter: true, width: 210, sortable: true, comparator: (valueA, valueB, nodeA, nodeB, isDescending) => {
          // Need to be able to sort the groups by method name, not internal id, so map them and then compare.
          const nameA = this.ids_to_method_names[valueA]
          const nameB = this.ids_to_method_names[valueB]
          return nameA == nameB ? 0 : nameA > nameB ? 1 : -1
        }}
      }
    },
    async created() {
      if (typeof(this.$route.query.search_term) === "string") {
        this.searched_substance = this.$route.query.search_term
        this.methodSearch(this.searched_substance)
      }
    },
    components: {
      AgGridVue,
      BasicSubstanceDisplay,
      InchikeyDisambiguation,
      StoredPDFDisplay,
      SynonymDisambiguation
    },
    watch: {
      min_similarity(new_sim, old_sim) {
        // when the minimum similarity changes, filter results as appropriate
        if (this.search_complete & this.found_substance & (this.results.length > 0)) {
          this.gridApi.onFilterChanged()
          this.updateHighlightedSubstances()
        }
      }
    },
    methods: {
      updateHighlightedSubstances() {
        this.highlighted_substances = this.dtxsid_counts.filter(x => x.similarity >= this.min_similarity).map(x => x.dtxsid)
      },
      async methodSearch(searched_substance) {
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
          if (response.data.ambiguity == "inchikey") {
            this.disambiguation.inchikey = true
          } else if (response.data.ambiguity == "synonym") {
            this.disambiguation.synonym = true
          }
        } else {
          this.substance_info.searched_substance = response.data.substances
          this.substance_info.searched_substance.image_link = await imageLinkForSubstance(response.data.substances.dtxsid, response.data.substances.image_in_comptox)
          const methods_response = await axios.get(`${this.BACKEND_LOCATION}/get_similar_methods/${response.data.substances.dtxsid}`)
          this.dtxsid_counts = methods_response.data.dtxsid_counts
          const classyfire_response = await axios.get(`${this.BACKEND_LOCATION}/get_classification_for_dtxsid/${response.data.substances.dtxsid}`)
          if ((classyfire_response.status == 200) & (classyfire_response.data.kingdom !== null)) {
            this.classyfire.searched_substance = classyfire_response.data
          } else {
            this.classyfire.searched_substance = null
          }
          this.updateHighlightedSubstances()
          this.current_substance = searched_substance.trim()  // should be whatever the user chooses
          this.found_substance = true
          this.results = methods_response.data.results
          this.ids_to_method_names = methods_response.data.ids_to_method_names
          this.searching = false
          this.search_complete = true
        }
      },
      onGridReady(params) {
        this.gridApi = params.api
        this.gridColumnApi = params.columnApi
      },
      methodsRowSelected(event) {
        if (event.event){
          var new_method_id = ""
          var source = ""
          // There are two possibilities: either a group header row has been slected, or not.  In the former case, the
          // event.data field will not exist, but it does exist in the latter case, so it's useful for distinguishing
          // the two.
          if (event.data) {
            new_method_id = event.data.internal_id
            source = event.data.source
          } else {
            new_method_id = event.node.key
            source = event.node.aggData.source
          }
          if (new_method_id != this.current_method_shown_id) {
            this.current_method_shown_id = new_method_id
            this.selected_row_data = {internal_id: new_method_id, source}
            this.right_side_viewer_mode = "Methods"
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
          this.right_side_viewer_mode = "Substances"
        }
      },
      disambiguate(dtxsid) {
        this.disambiguation.inchikey = false
        this.disambiguation.synonym = false
        this.methodSearch(dtxsid)
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