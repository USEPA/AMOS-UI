<!--
  This comoponent is for displaying the PDF for a method or fact sheet (or, possibly in the future, a spectrum) along
  with two possible views for the substance(s) that the document references.

  This component takes two props:
  - internalID, a string that matches the internal ID of a PDF document in the database
  - recordType, a string that should have a value of either "method" or "fact sheet", which is sent to the Flask backend
    for determining which table contains the PDF
-->

<template>
  <div>
    <div class="results-header" style="overflow: auto;">
      <h2 v-if="pdf_name">{{pdf_name}}</h2>
      <p v-if="has_associated_spectra && displayAdditionalInfo">This method has spectra associated with it.  Click <router-link :to="`/method_with_spectra/method/${internalID}`">here</router-link> to view.</p>
      <ul v-if="metadata_rows" style="list-style-type: none;">
        <li v-for="r in Object.entries(metadata_rows)"><strong>{{r[0]}}:</strong> {{r[1]}}</li>
      </ul>
    </div>
    <div class="tab-bar">
      <a :class="viewer_mode == 'PDF' ? 'active' : ''" @click="updateTab('PDF')">PDF Viewer</a>
      <a :class="viewer_mode == 'SubstanceGrid' ? 'active' : ''" @click="updateTab('SubstanceGrid')">Substances ({{ substance_list.length }}) (grid)</a>
      <a :class="viewer_mode == 'SubstanceTable' ? 'active' : ''" @click="updateTab('SubstanceTable')">Substances ({{ substance_list.length }}) (table)</a>
    </div>

    <iframe v-if="viewer_mode == 'PDF'" class="pdf-viewer-box" :src="`${target_pdf_url}`" type="application/pdf"></iframe>

    <div v-else-if="viewer_mode == 'SubstanceGrid'">
      <button @click="downloadSubstanceGridInfo">Download Substance Info</button>
      <div class="substance-grid">
        <div v-for="cl in substance_list">
          <SubstanceTile v-if="highlightedSubstances.includes(cl.dtxsid)" :dtxsid="`${cl.dtxsid}`" :preferred_name="`${cl.preferred_name}`" highlight/>
          <SubstanceTile v-else :dtxsid="`${cl.dtxsid}`" :preferred_name="`${cl.preferred_name}`"/>
        </div>
      </div>
    </div>

    <div v-else-if="viewer_mode == 'SubstanceTable'">
      <button @click="downloadSubstanceTableInfo">Download Substance Info</button>
      <ag-grid-vue
        class="ag-theme-balham"
        style="height:550px; width:100%"
        :columnDefs="column_defs"
        :rowData="substance_list"
        rowSelection="single"
        @grid-ready="onGridReady"
        :rowClassRules="rowClassRules"
      ></ag-grid-vue>
    </div>
    <p v-else>Illegal value for 'viewer_mode' selected.  Current value is {{viewer_mode}}.</p>
  </div>
</template>

<script>
  import axios from 'axios'
  import { getSubstanceImageLink } from '@/assets/common_functions'

  import '@/assets/style.css'
  import { BACKEND_LOCATION, COMPTOX_PAGE_URL } from '@/assets/store'

  import SubstanceTile from '@/components/SubstanceTile.vue'

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
        substance_list: [],
        has_associated_spectra: false,
        BACKEND_LOCATION,
        COMPTOX_PAGE_URL,
        column_defs: [
          {field:'image', headerName:'Structure', autoHeight: true, width: 100, wrapText: true, cellRenderer: (params) => {
            if (params.data.image_link) {
              var image = document.createElement('img');
              image.src = params.data.image_link
              image.style = "width:70px;height:70px;padding-top:2px;padding-bottom:2px;";
              return image;
            } else {
              var p = document.createElement('div')
              p.style = "width:70px;height:70px;padding-top:2px;padding-bottom:2px;text-align: center; line-height: 70px;";
              p.innerText = "No structure."
              return p
            }
          }},
          {field: 'dtxsid', headerName: 'DTXSID', width: 120, cellRenderer: params => {
            return "<a href='" + this.COMPTOX_PAGE_URL + params.data.dtxsid + "' target='_blank'>" + params.data.dtxsid + "</a>"
          }},
          {field: 'links', headerName: 'Links', width: 90, cellRenderer: params => {
            const link = document.createElement("a");
            link.href = this.$router.resolve(`/search/${params.data.dtxsid}`).href;
            link.innerText = "Search";
            link.addEventListener("click", e => {
              e.preventDefault();
              this.$router.push(`/search/${params.data.dtxsid}`);
            });
            return link;
          }},
          {field: 'casrn', headerName: 'CASRN', width: 90, filter: 'agTextColumnFilter', floatingFilter: true},
          {field: 'preferred_name', headerName:'Substance Name', flex: 1, filter: 'agTextColumnFilter', floatingFilter: true}
        ],
        rowClassRules: {
          'substance-highlight': (params) => {return this.highlightedSubstances.includes(params.data.dtxsid)}
        }
      }
    },
    props: {internalID: String, recordType: String, displayAdditionalInfo: Boolean, highlightedSubstances: {type: Array, default: []}},
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
        this.substance_list = response.data.substance_list
        for (let i=0; i<this.substance_list.length; i++) {
          this.substance_list[i]["image_link"] = await getSubstanceImageLink(this.substance_list[i].dtxsid)
        }
      },
      updateTab(tabName) {
        this.viewer_mode = tabName
      },
      async downloadSubstanceGridInfo() {
        await axios.get(`${this.BACKEND_LOCATION}/get_substance_file_for_record/${this.internalID}`, {responseType: "blob"}).then(res => {
          let blob = new Blob([res.data], {type: res.headers['content-type']})
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = `${this.internalID}_substance_list.xlsx`
          link.click()
        })
      },
      downloadSubstanceTableInfo() {
        this.gridApi.exportDataAsExcel({
          columnKeys: ["dtxsid", "casrn", "preferred_name"],
          fileName: `${this.internalID}_substance_list.xlsx`
        });
      },
      onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
      }
    },
    components: { AgGridVue, SubstanceTile }
  };
</script>

<style>
  .pdf-viewer-box{
    height: 90vh;
    width: 48vw;
    overflow: scroll;
  }

  .substance-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: left;
  }

  .ag-row .ag-cell {
    display: flex;
    align-items: center;
  }
</style>