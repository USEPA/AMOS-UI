<template>
  <div class="wrap">
    <div class="monograph-box">
      <p></p>
      <div>
        <label for="search-dtxsid">DTXSID</label> &nbsp;
        <input @keyup.enter="methodSearch()" type="text" v-model="methodSearchDTXSID" name="search-dtxsid">
        <button @click="methodSearch()">Method Search</button>
      </div>
      <p>The table below lists methods for compounds that are similar to {{ currentDTXSID }}.</p>
      <div id="grid-theme-wrapper" class="modded-theme">
        <ag-grid-vue
          class="ag-theme-balham"
          style="height:600px; width:100%"
          :columnDefs="columnDefs"
          :rowData="results"
          rowSelection="single"
          @row-selected="onRowSelected"
        ></ag-grid-vue>
      </div>
    </div>
    <StoredPDFViewer style="width: 48vw;" v-if="anyMethodSelected" :selectedRowData="selectedRowData"/>
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
        anyMethodSelected: false,
        selectedRowData: {},
        methodSearchDTXSID: "",
        columnDefs: [
          {field: "method_name", headerName: "Method Name", cellClass: "text-that-can-overflow"},
          {field: "source", headerName: "Source", suppressSizeToFit: true},
          {field: "dtxsid", headerName: "Similar DTXSID", width: 125, suppressSizeToFit: true},
          {field: "year_published", headerName: "Year", width: 70, suppressSizeToFit: true},
          {field: "similarity", headerName: "Compound Similarity", width: 190, suppressSizeToFit: true, sortable: true, sort: "desc", cellRenderer: params => {return params.data.similarity.toFixed(3)}}
        ]
      }
    },
    created() {
      1
    },
    components: {
      AgGridVue,
      StoredPDFViewer
    },
    methods: {
      async methodSearch() {
        const path = `${this.BACKEND_LOCATION}/get_similar_methods/${this.methodSearchDTXSID}`;
        const response = await axios.get(path)
        this.currentDTXSID = this.methodSearchDTXSID
        this.results = response.data.results
      },
      onGridReady(params) {
        1
      },
      onRowSelected(event){
        if (event.event){
          console.log(event)
          this.selectedRowData = event.data
          this.anyMethodSelected = true
          this.target_pdf_url = `${this.BACKEND_LOCATION}/get_pdf/${event.data.source}/${event.data.internal_id}`
          console.log(this.target_pdf_url)
        }
      }
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
</style>