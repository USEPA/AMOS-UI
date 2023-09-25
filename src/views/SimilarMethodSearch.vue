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
        <input @keyup.enter="methodSearch(searched_compound)" type="text" size="30" v-model="searched_compound" name="search-dtxsid">
        <button @click="methodSearch(searched_compound)">Method Search</button>
      </div>
      <br />
      <p v-if="searching">Searching...</p>
      <p v-else-if="!search_complete">This page allows for searching for methods that contain either a given chemical or other chemicals similar to it.  A name, InChIKey, CASRN, or DTXSID can be searched on.</p>
      <p v-else-if="!found_compound">"{{ current_compound }}" was not recognized as a known substance.</p>
      <p v-else-if="dtxsid_counts.length == 0">The substance "{{ current_compound }}" was recognized, however no methods containing it or similar substances for it were found.</p>
      <div v-else>
        <p>The table below lists methods for compounds that are similar to "{{ current_compound }}".  {{ dtxsid_counts.length }} distinct substances of sufficient similarity were found in  {{ Object.keys(ids_to_method_names).length }} methods.</p>
        <p>There are two tables below -- one lists all the methods containing a compound similar to {{ current_compound }}, while the other lists all similar substances found.  Clicking on a row will bring up the method or a comparison between the searched and selected substances, respectively.  Hover over a method or substance name to see the full name.  Columns can be hidden by clicking on the menu icon seen when hovering over a column name.</p>
        <div class="tab-bar">
          <a :class="tab_viewer_mode == 'Methods' ? 'active': ''" @click="updateTab('Methods')">Methods</a>
          <a :class="tab_viewer_mode == 'Substances' ? 'active': ''" @click="updateTab('Substances')">Substances</a>
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
            :rowClassRules="methodsRowClassRules"
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
    <StoredPDFViewer style="width: 48vw;" v-if="right_side_viewer_mode == 'Methods'" :internalID="selected_row_data.internal_id" recordType="method" :highlightedCompounds="similar_substances"/>
    <div class="half-page-column" v-else-if="right_side_viewer_mode == 'Substances'">
      <h4>Searched Substance:</h4>
      <div style="display: flex; justify-content: center;">
        <div class="chemical-box" style="justify-content: left; width: 90%">
          <div class="chemical-image-highlight">
            <img v-if="1" class="chemical-image" :src="`${IMAGE_BY_DTXSID_API}${substance_info.searched_substance.dtxsid}`"/>  
            <div v-else style="text-align: center; display: flex; align-items: center;">No image was found for this compound.</div>
          </div>
          <div class="chemical-info">
            <ul style="list-style-type: none;">
              <li><strong>(Preferred) Name:</strong> {{ substance_info.searched_substance.preferred_name }} </li>
              <li><strong>DTXSID:</strong> <a :href="`${COMPTOX_PAGE_URL}${substance_info.searched_substance.dtxsid}`">{{ substance_info.searched_substance.dtxsid }}</a> </li>
              <li><strong>CASRN:</strong> {{ substance_info.searched_substance.casrn }} </li>
              <li><strong>InChIKey:</strong> {{ substance_info.searched_substance.indigo_inchikey ? substance_info.searched_substance.indigo_inchikey : substance_info.searched_substance.jchem_inchikey}} </li>
              <li><strong>Molecular Formula:</strong> {{ substance_info.searched_substance.molecular_formula }} </li>
              <li><strong>Mass:</strong> {{ substance_info.searched_substance.monoisotopic_mass }} </li>
            </ul>
          </div>
        </div>
      </div>
      <br />
      <h4>Selected Substance From Table:</h4>
      <div style="display: flex; justify-content: center;">
        <div class="chemical-box" style="justify-content: left; width: 90%">
          <div class="chemical-image-highlight">
            <img v-if="1" class="chemical-image" :src="`${IMAGE_BY_DTXSID_API}${substance_info.similar_substance.dtxsid}`"/>  
            <div v-else style="text-align: center; display: flex; align-items: center;">No image was found for this compound.</div>
          </div>
          <div class="chemical-info">
            <ul style="list-style-type: none;">
              <li><strong>(Preferred) Name:</strong> {{ substance_info.similar_substance.preferred_name }} </li>
              <li><strong>DTXSID:</strong> <a :href="`${COMPTOX_PAGE_URL}${substance_info.similar_substance.dtxsid}`">{{ substance_info.similar_substance.dtxsid }}</a> </li>
              <li><strong>CASRN:</strong> {{ substance_info.similar_substance.casrn }} </li>
              <li><strong>InChIKey:</strong> {{ substance_info.similar_substance.indigo_inchikey ? substance_info.similar_substance.indigo_inchikey : substance_info.similar_substance.jchem_inchikey}} </li>
              <li><strong>Molecular Formula:</strong> {{ substance_info.similar_substance.molecular_formula }} </li>
              <li><strong>Mass:</strong> {{ substance_info.similar_substance.monoisotopic_mass }} </li>
            </ul>
          </div>
        </div>
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
  import { BACKEND_LOCATION, COMPTOX_PAGE_URL, IMAGE_BY_DTXSID_API } from '@/assets/store'
  
  export default{
    data() {
      return {
        BACKEND_LOCATION,
        COMPTOX_PAGE_URL,
        IMAGE_BY_DTXSID_API,
        results: null,
        any_row_selected: false,
        searching: false,
        search_complete: false,
        found_compound: false,
        disambiguation: {inchikey: false, synonym: false},
        possible_substances: [],
        dtxsid_counts: [],
        selected_row_data: {},
        searched_compound: "",
        current_compound: "",
        ids_to_method_names: "",
        current_method_shown_id: "",
        tab_viewer_mode: "Methods",
        right_side_viewer_mode: "N/A",
        substance_info: {searched_substance: {}, similar_substance: {}},
        similar_substances: [],
        result_column_defs: [
          {field: "internal_id", rowGroup: true, hide: true, sortable: true, cellRenderer: params => {
            const title_text = this.ids_to_method_names[params.value] + " (" + params.node.allChildrenCount + ")";
            return `<span title='${title_text}'>${this.ids_to_method_names[params.value]}</span>`
          }},
          {field: "source", headerName: "Source", width: 90, suppressSizeToFit: true, sortable: true, aggFunc: 'first'},
          {field: "methodology", headerName: "Methodology", width: 120, suppressSizeToFit: true, sortable: true, aggFunc: 'first'},
          {field: "year_published", headerName: "Year", width: 70, suppressSizeToFit: true, sortable: true, aggFunc: 'first'},
          {field: "similarity", headerName: "Similarity", width: 95, suppressSizeToFit: true, sortable: true, sort: 'desc', aggFunc: 'max', cellRenderer:'agGroupCellRenderer', cellRendererParams: {
            innerRenderer: params => {return params.value.toFixed(2)}
          }},
          {field: "dtxsid", headerName: "Similar DTXSID", width: 125, suppressSizeToFit: true, sortable: true},
          {field: "compound_name", headerName: "Compound Name"}
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
        this.right_side_viewer_mode = "N/A"
        this.search_complete = false

        const response = await axios.get(`${this.BACKEND_LOCATION}/get_substances_for_search_term/${searched_compound.trim()}`)
        if (response.data.substances === null) {
          this.found_compound = false
          this.searching = false
          console.log("done, none")
        } else if (response.data.ambiguity) {
          this.possible_substances = response.data.substances
          if (response.data.ambiguity == "inchikey") {
            this.disambiguation.inchikey = true
          } else if (response.data.ambiguity == "synonym") {
            this.disambiguation.synonym = true
          }
        } else {
          this.substance_info.searched_substance = response.data.substances
          const methods_response = await axios.get(`${this.BACKEND_LOCATION}/get_similar_methods/${response.data.substances.dtxsid}`)
          console.log(methods_response)
          this.dtxsid_counts = methods_response.data.dtxsid_counts
          this.similar_substances = this.dtxsid_counts.map(x => x.dtxsid)
          this.current_compound = searched_compound.trim()  // should be whatever the user chooses
          this.found_compound = true
          this.results = methods_response.data.results
          this.ids_to_method_names = methods_response.data.ids_to_method_names
          this.searching = false
          this.search_complete = true
          console.log("done, some")
        }
      },
      onGridReady(params) {
        1
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
          const response = await axios.get(`${this.BACKEND_LOCATION}/get_substances_for_search_term/${event.data.dtxsid}`)
          this.substance_info.similar_substance = response.data.substances
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
      }
    }
  }
</script>

<style>
.emphasized-row {
  font-weight: 700;
}
</style>