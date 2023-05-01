<!--
  This page is a viewer for a method PDF and its accompanying compound list.  Functionally, it is
  essentially the StoredPDFViewer component, split out across a full webpage.

  This page takes no query parameters and one URL route parameter, internal_id, which is the
  database ID of the method you are trying to view.
-->

<template>
  <div class="two-column-page">
    <div class="half-page-column">
      <div class="results-header">
        <h2 v-if="pdf_name">{{pdf_name}}</h2>
        <p v-if="has_associated_spectra">This method has spectra associated with it.  Click <router-link :to="`/method_with_spectra/method/${$route.params.internal_id}`">here</router-link> to view.</p>
        <ul v-if="metadata_rows" style="list-style-type: none;">
          <li v-for="r in Object.entries(metadata_rows)"><strong>{{r[0]}}:</strong> {{r[1]}}</li>
        </ul>
      </div>
      <iframe class="pdf-viewer-box" :src="`${target_pdf_url}`" type="application/pdf"></iframe>
    </div>
    <div class="half-page-column">
      <div style="margin-bottom:3cm;"></div>
      <div class="tab-bar">
        <a :class="viewer_mode == 'CompoundGrid' ? 'active' : ''" @click="updateTab('CompoundGrid')">Compounds ({{ compound_list.length }}) (grid)</a>
        <a :class="viewer_mode == 'CompoundTable' ? 'active' : ''" @click="updateTab('CompoundTable')">Compounds ({{ compound_list.length }}) (table)</a>
      </div>
      <div class="compound-grid" v-if="viewer_mode == 'CompoundGrid'">
        <div v-for="cl in compound_list">
          <CompoundTile :dtxsid="`${cl.dtxsid}`" :preferred_name="`${cl.preferred_name}`" />
        </div>
      </div>

      <div v-else-if="viewer_mode == 'CompoundTable'">
        <button @click="downloadCompoundInfo">Download Compound Info</button>
        <ag-grid-vue
          class="ag-theme-balham"
          style="height:500px; width:100%"
          :columnDefs="column_defs"
          :rowData="compound_list"
          rowSelection="single"
          @grid-ready="onGridReady"
        ></ag-grid-vue>
      </div>
      <p v-else>Illegal value for 'viewer_mode' selected.  Current value is {{viewer_mode}}.</p>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  import '@/assets/style.css'
  import '@/assets/search_results.css'
  import { BACKEND_LOCATION } from '@/assets/store'
  
  import CompoundTile from '@/components/CompoundTile.vue'
  
  import '/node_modules/ag-grid-community/dist/styles/ag-grid.css'
  import '/node_modules/ag-grid-community/dist/styles/ag-theme-balham.css'
  import { AgGridVue } from "ag-grid-vue3"
  import 'ag-grid-enterprise'
  import { LicenseManager } from 'ag-grid-enterprise'
  LicenseManager.setLicenseKey('CompanyName=US EPA,LicensedGroup=Multi,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=5,LicensedProductionInstancesCount=0,AssetReference=AG-010288,ExpiryDate=3_December_2022_[v2]_MTY3MDAyNTYwMDAwMA==4abffeb82fbc0aaf1591b8b7841e6309')

  export default {
    data(){
      return {
        pdf_response: {},
        pdf_name: "",
        pdf_metadata: "",
        metadata_rows: {},
        viewer_mode: "CompoundGrid",
        compound_list: [],
        has_associated_spectra: false,
        BACKEND_LOCATION,
        column_defs: [
          {field:'image', headerName:'Structure', autoHeight: true, width: 100, cellRenderer: (params) => {
            var image = document.createElement('img');
            image.src = 'https://comptox.epa.gov/dashboard-api/ccdapp1/chemical-files/image/by-dtxsid/'+params.data.dtxsid;
            image.style = "width:70px;height:70px;padding-top:2px;padding-bottom:2px;";
            return image;
          }},
          {field: 'dtxsid', headerName: 'DTXSID', width: 120, cellRenderer: params => {
            return "<a href='https://comptox.epa.gov/dashboard/chemical/details/" + params.data.dtxsid + "' target='_blank'>" + params.data.dtxsid + "</a>"
          }},
          {field: 'links', headerName: 'Links', cellRenderer: params => {
            const link = document.createElement("a");
            link.href = this.$router.resolve(`/search/${params.data.dtxsid}`).href;
            link.innerText = "Search";
            link.addEventListener("click", e => {
              e.preventDefault();
              this.$router.push(`/search/${params.data.dtxsid}`);
            });
            return link;
          }},
          {field: 'casrn', headerName: 'CASRN', width: 90},
          {field: 'preferred_name', headerName:'Compound Name', flex: 1}
        ]
      }
    },

    async created() {
      this.loadPDF()
      this.findDTXSIDs()
    },

    methods: {
      async loadPDF(){
        this.target_pdf_url = encodeURI(`${this.BACKEND_LOCATION}/get_pdf/method/${this.$route.params.internal_id}`)
        const response = await axios.get(`${this.BACKEND_LOCATION}/get_pdf_metadata/method/${this.$route.params.internal_id}`)
        this.pdf_name = response.data.pdf_name
        this.metadata_rows = response.data.metadata_rows
        this.has_associated_spectra = response.data.has_associated_spectra
      },
      async findDTXSIDs(){
        const response = await axios.get(`${this.BACKEND_LOCATION}/find_dtxsids/${this.$route.params.internal_id}`)
        this.compound_list = response.data.compound_list
      },
      updateTab(tabName) {
        this.viewer_mode = tabName
      },
      downloadCompoundInfo() {
        this.gridApi.exportDataAsCsv({
          columnKeys: ["dtxsid", "casrn", "preferred_name"],
          fileName: this.internalID + "_compound_list.csv"
        });
      },
      onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
      }
    },

    components: { AgGridVue, CompoundTile }
  }
</script>

<style>
  .ag-row .ag-cell {
    display: flex;
    align-items: center;
  }

  .pdf-viewer-box{
    height: 90vh;
    width: 46vw;
    overflow: scroll;
  }

  .compound-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: left;
  }
</style>