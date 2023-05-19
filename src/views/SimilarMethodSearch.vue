<!--
  This page shows results for a method similarity search.  An individual compound is searched for (by name, DTXSID,
  CASRN, or InChIKey) and the search returns a list of all methods which contain at least one compound that is
  sufficiently similar to the searched compound.

  This page takes no URL route or query parameters.
-->

<template>
  <div class="two-column-page">
    <div class="half-page-column">
      <p></p>
      <div>
        <label for="search-dtxsid">Compound Identifier</label> &nbsp;
        <input @keyup.enter="methodSearch(searched_compound)" type="text" v-model="searched_compound" name="search-dtxsid">
        <button @click="methodSearch(searched_compound)">Method Search</button>
      </div>
      <br />
      <p v-if="!searching & !search_complete">This page allows for searching for methods that contain either a given chemical or other chemicals similar to it.  A name, InChIKey, CASRN, or DTXSID can be searched on.</p>
      <p v-else-if="searching">Searching...</p>
      <p v-else-if="!found_compound">No compound match was found for "{{ current_compound }}".</p>
      <div v-else>
        <p>The table below lists methods for compounds that are similar to "{{ current_compound }}".</p>
        <p>Select a row in the table to view the method on the right half of the screen.  Bolded rows refer to methods which contain the chemical being searched.</p>
        <p>Hover over a method name to see the full text of it.  The number in parentheses at the end is the number of similar compounds found in the method (not necessarily the number of compounds present in the method).</p>
        <p>Columns can be hidden by clicking on the menu icon seen when hovering over a column name -- this brings up a menu where column visibility can be toggled.</p> 
        <div id="grid-theme-wrapper" class="modded-theme">
          <ag-grid-vue
            class="ag-theme-balham"
            style="height:600px; width:100%"
            :columnDefs="column_defs"
            :rowData="results"
            :autoGroupColumnDef="autoGroupColumnDef"
            suppressAggFuncInHeader="true"
            rowSelection="single"
            @row-selected="onRowSelected"
            :rowClassRules="rowClassRules"
          ></ag-grid-vue>
      </div>
      </div>
    </div>
    <StoredPDFViewer style="width: 48vw;" v-if="any_method_selected" :internalID="selected_row_data.internal_id" recordType="method"/>
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

  import '/node_modules/ag-grid-community/dist/styles/ag-grid.css'
  import '/node_modules/ag-grid-community/dist/styles/ag-theme-balham.css'
  import { AgGridVue } from "ag-grid-vue3"
  import 'ag-grid-enterprise'
  import { LicenseManager } from 'ag-grid-enterprise'
  LicenseManager.setLicenseKey('CompanyName=US EPA,LicensedGroup=Multi,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=5,LicensedProductionInstancesCount=0,AssetReference=AG-010288,ExpiryDate=3_December_2022_[v2]_MTY3MDAyNTYwMDAwMA==4abffeb82fbc0aaf1591b8b7841e6309')

  import '@/assets/style.css'
  import InchikeyDisambiguation from '@/components/InchikeyDisambiguation.vue'
  import StoredPDFViewer from '@/components/StoredPDFViewer.vue'
  import SynonymDisambiguation from '@/components/SynonymDisambiguation.vue'
  import { BACKEND_LOCATION } from '@/assets/store'
  
  export default{
    data() {
      return {
        BACKEND_LOCATION,
        results: null,
        any_method_selected: false,
        searching: false,
        search_complete: false,
        found_compound: false,
        disambiguation: {inchikey: false, synonym: false},
        possible_substances: [],
        selected_row_data: {},
        searched_compound: "",
        current_compound: "",
        ids_to_method_names: "",
        current_method_shown_id: "",
        column_defs: [
          {field: "internal_id", rowGroup: true, hide: true, sortable: true, cellRenderer: params => {
            const title_text = this.ids_to_method_names[params.value] + " (" + params.node.allChildrenCount + ")";
            return `<span title='${title_text}'>${this.ids_to_method_names[params.value]}</span>`
          }},
          {field: "source", headerName: "Source", width: 90, suppressSizeToFit: true, sortable: true, aggFunc: 'first'},
          {field: "methodology", headerName: "Methodology", width: 120, suppressSizeToFit: true, sortable: true, aggFunc: 'first'},
          {field: "year_published", headerName: "Year", width: 70, suppressSizeToFit: true, sortable: true, aggFunc: 'first'},
          {field: "similarity", headerName: "Similarity", width: 95, suppressSizeToFit: true, sortable: true, aggFunc: 'max', cellRenderer:'agGroupCellRenderer', cellRendererParams: {
            innerRenderer: params => {return params.value.toFixed(2)}
          }},
          {field: "dtxsid", headerName: "Similar DTXSID", width: 125, suppressSizeToFit: true, sortable: true},
          {field: "compound_name", headerName: "Compound Name"}
        ],
        rowClassRules: {
          "method-has-chemical-match": function(params) {
            if (params.data === undefined) {
              return params.node.allLeafChildren[0].data.has_searched_compound
            } else {
              return params.data.has_searched_compound
            }
          }
        },
        autoGroupColumnDef: {headerName: 'Method Name (# compounds)', width: 210, sortable: true, comparator: (valueA, valueB, nodeA, nodeB, isDescending) => {
          // Need to be able to sort the groups by method name, not internal id, so map them and then compare.
          const nameA = this.ids_to_method_names[valueA]
          const nameB = this.ids_to_method_names[valueB]
          return nameA == nameB ? 0 : nameA > nameB ? 1 : -1
        }}
      }
    },
    async created() {
      1
    },
    components: {
      AgGridVue,
      InchikeyDisambiguation,
      StoredPDFViewer,
      SynonymDisambiguation
    },
    methods: {
      async methodSearch(searched_compound) {
        // variable setup
        this.results = null
        this.searching = true
        this.any_method_selected = false
        this.search_complete = false
        //this.searched_compound = this.searched_compound.trim()

        const response = await axios.get(`${this.BACKEND_LOCATION}/get_substances_for_search_term/${searched_compound.trim()}`)

        if (response.data.substances === null) {
          this.found_compound = false
          this.searching = false
        } else if (response.data.ambiguity) {
          this.possible_substances = response.data.substances
          if (response.data.ambiguity == "inchikey") {
            this.disambiguation.inchikey = true
          } else if (response.data.ambiguity == "synonym") {
            this.disambiguation.synonym = true
          }
        } else {
          console.log(response.data.substances.dtxsid)
          const methods_response = await axios.get(`${this.BACKEND_LOCATION}/get_similar_methods/${response.data.substances.dtxsid}`)
          this.current_compound = searched_compound.trim()  // should be whatever the user chooses
          this.found_compound = true
          this.results = methods_response.data.results
          this.ids_to_method_names = methods_response.data.ids_to_method_names
          this.searching = false
          this.search_complete = true
        }
      },
      onGridReady(params) {
        1
      },
      onRowSelected(event) {
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
            this.any_method_selected = true
          }
        }
      },
      disambiguate(dtxsid) {
        console.log(dtxsid)
        this.disambiguation.inchikey = false
        this.disambiguation.synonym = false
        this.methodSearch(dtxsid)
      }
    }
  }
</script>

<style>
.method-has-chemical-match {
  font-weight: 700;
}
</style>