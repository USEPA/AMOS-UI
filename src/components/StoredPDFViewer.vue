<!--
  This comoponent is for displaying the PDF for a method or monograph (or, possibly in the future, a spectrum) along
  with two possible views for the compound(s) that the document references.

  This component takes two props:
  - internalID, a string that matches the internal ID of a PDF document in the database
  - recordType, a string that should have a value of either "method" or "monograph", which is sent to the Flask backend
    for determining which table contains the PDF
-->

<template>
  <div>
    <div class="results-header">
      <h2 v-if="pdf_name">{{pdf_name}}</h2>
      <p v-if="has_associated_spectra && displayAdditionalInfo">This method has spectra associated with it.  Click <router-link :to="`/method_with_spectra/method/${internalID}`">here</router-link> to view.</p>
      <ul v-if="metadata_rows" style="list-style-type: none;">
        <li v-for="r in Object.entries(metadata_rows)"><strong>{{r[0]}}:</strong> {{r[1]}}</li>
      </ul>
    </div>
    <div class="tab-bar">
      <a :class="viewer_mode == 'PDF' ? 'active' : ''" @click="updateTab('PDF')">PDF Viewer</a>
      <a :class="viewer_mode == 'CompoundGrid' ? 'active' : ''" @click="updateTab('CompoundGrid')">Compounds ({{ compound_list.length }}) (grid)</a>
      <a :class="viewer_mode == 'CompoundTable' ? 'active' : ''" @click="updateTab('CompoundTable')">Compounds ({{ compound_list.length }}) (table)</a>
    </div>

    <iframe v-if="viewer_mode == 'PDF'" class="pdf-viewer-box" :src="`${target_pdf_url}`" type="application/pdf"></iframe>

    <div class="compound-grid" v-else-if="viewer_mode == 'CompoundGrid'">
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
</template>

<script>
  import axios from 'axios'

  import '@/assets/style.css'
  import '@/assets/search_results.css'
  import { BACKEND_LOCATION, COMPTOX_PAGE_URL, IMAGE_BY_DTXSID_API } from '@/assets/store'

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
        viewer_mode: "PDF",
        compound_list: [],
        has_associated_spectra: false,
        BACKEND_LOCATION,
        COMPTOX_PAGE_URL,
        IMAGE_BY_DTXSID_API,
        column_defs: [
          {field:'image', headerName:'Structure', autoHeight: true, width: 100, cellRenderer: (params) => {
            var image = document.createElement('img');
            image.src = this.IMAGE_BY_DTXSID_API + params.data.dtxsid;
            image.style = "width:70px;height:70px;padding-top:2px;padding-bottom:2px;";
            return image;
          }},
          {field: 'dtxsid', headerName: 'DTXSID', width: 120, cellRenderer: params => {
            return "<a href='" + this.COMPTOX_PAGE_URL + params.data.dtxsid + "' target='_blank'>" + params.data.dtxsid + "</a>"
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
    props: {internalID: String, recordType: String, displayAdditionalInfo: Boolean},
    watch: {
      internalID(){
        this.metadata_rows = {}
        this.pdf_name = ""
        this.loadPDF()
        this.findDTXSIDs()
      }
    },
    async created() {
      this.loadPDF()
      this.findDTXSIDs()
    },

    methods: {
      async loadPDF(){
        this.target_pdf_url = encodeURI(`${this.BACKEND_LOCATION}/get_pdf/${this.recordType}/${this.internalID}`)
        const response = await axios.get(`${this.BACKEND_LOCATION}/get_pdf_metadata/${this.recordType}/${this.internalID}`)
        this.pdf_name = response.data.pdf_name
        this.metadata_rows = response.data.metadata_rows
        this.has_associated_spectra = response.data.has_associated_spectra
      },
      async findDTXSIDs(){
        const response = await axios.get(`${this.BACKEND_LOCATION}/find_dtxsids/${this.internalID}`)
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
  };
</script>

<style>
  .pdf-viewer-box{
    height: 90vh;
    width: 48vw;
    overflow: scroll;
  }

  .compound-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: left;
  }

  .ag-row .ag-cell {
    display: flex;
    align-items: center;
  }
</style>