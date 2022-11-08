<template>
  <div class="wrap">
    <div class="monograph-box">
      <p></p>
      <div>
        <label for="search-dtxsid">DTXSID</label> &nbsp;
        <input @keyup.enter="methodSearch()" type="text" v-model="method_search_DTXSID" name="search-dtxsid">
        <button @click="methodSearch()">Method Search</button>
      </div>
      <p>The table below lists methods for compounds that are similar to {{ current_DTXSID }}.</p>
      <p>Bolded rows refer to methods which contain the chemical being searched.</p> 
      <p>Select a row in the table to view the method on the right half of the screen.</p> 
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
    <StoredPDFViewer style="width: 48vw;" v-if="any_method_selected" :selectedRowData="selected_row_data"/>
  </div>
</template>

<script>
  import axios from 'axios';

  import '/node_modules/ag-grid-community/dist/styles/ag-grid.css';
  import '/node_modules/ag-grid-community/dist/styles/ag-theme-balham.css';
  import { AgGridVue } from "ag-grid-vue3";
  import 'ag-grid-enterprise'
  import { LicenseManager } from 'ag-grid-enterprise'
  LicenseManager.setLicenseKey('CompanyName=US EPA,LicensedGroup=Multi,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=5,LicensedProductionInstancesCount=0,AssetReference=AG-010288,ExpiryDate=3_December_2022_[v2]_MTY3MDAyNTYwMDAwMA==4abffeb82fbc0aaf1591b8b7841e6309')

  import '@/assets/style.css'
  import StoredPDFViewer from '@/components/StoredPDFViewer.vue'
  import { BACKEND_LOCATION } from '@/assets/store';
  
  export default{
    data() {
      return {
        BACKEND_LOCATION,
        results: [],
        any_method_selected: false,
        selected_row_data: {},
        method_search_DTXSID: "",
        current_DTXSID: "",
        ids_to_method_names: "",
        current_method_shown_id: "",
        column_defs: [
          {field: "internal_id", rowGroup: true, hide: true, sortable: true, cellRenderer: params => {
            const title_text = this.ids_to_method_names[params.value] + " (" + params.node.allChildrenCount + ")";
            return `<span title='${title_text}'>${this.ids_to_method_names[params.value]}</span>`
          }},
          {field: "source", headerName: "Source", width: 90, suppressSizeToFit: true, sortable: true, aggFunc: 'first'},
          {field: "year_published", headerName: "Year", width: 70, suppressSizeToFit: true, sortable: true, aggFunc: 'first'},
          {field: "similarity", headerName: "Similarity", width: 95, suppressSizeToFit: true, sortable: true, aggFunc: 'max', cellRenderer:'agGroupCellRenderer', cellRendererParams: {
            innerRenderer: params => {return params.value.toFixed(2)}
          }},
          {field: "dtxsid", headerName: "Similar DTXSID", width: 125, suppressSizeToFit: true},
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
          const nameA = this.ids_to_method_names[valueA];
          const nameB = this.ids_to_method_names[valueB];
          return nameA == nameB ? 0 : nameA > nameB ? 1 : -1;
        }}
      }
    },
    async created() {
      1
    },
    components: {
      AgGridVue,
      StoredPDFViewer
    },
    methods: {
      async methodSearch() {
        this.any_method_selected = false
        this.method_search_DTXSID = this.method_search_DTXSID.trim()
        const path = `${this.BACKEND_LOCATION}/get_similar_methods/${this.method_search_DTXSID}`;
        const response = await axios.get(path)
        this.current_DTXSID = this.method_search_DTXSID
        this.results = response.data.results
        this.ids_to_method_names = response.data.ids_to_method_names
      },
      onGridReady(params) {
        1
      },
      onRowSelected(event){
        if (event.event){
          var new_method_id = "";
          var source = "";
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
    }
  }
</script>

<style>
.wrap{
  display: flex;
}

.monograph-box{
  /*height: 90vh;*/
  width: 48vw;
  /*overflow: scroll;*/
}

.method-has-chemical-match {
  font-weight: 700;
}
</style>