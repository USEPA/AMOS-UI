<!--
  This page is a viewer for a fact sheet PDF and its accompanying substance list.  Functionally, it is
  essentially the StoredPDFDisplay component, split out across a full webpage.

  This page takes no query parameters and one URL route parameter, internal_id, which is the
  database ID of the fact sheet you are trying to view.
-->

<template>
    <div class="two-column-page">
      <div class="half-page-column">
        <div class="results-header" style="overflow: auto;">
          <h2 v-if="pdf_name">
            <a v-if="pdf_source_url" :href="pdf_source_url" target="_blank">{{pdf_name}}</a>
            <span v-else>{{pdf_name}}</span>
          </h2>
          <ul v-if="metadata_rows" style="list-style-type: none;">
            <li v-for="r in Object.entries(metadata_rows)"><strong>{{r[0]}}:</strong> {{r[1]}}</li>
          </ul>
        </div>
        <iframe class="pdf-viewer-box" :src="`${target_pdf_url}`" type="application/pdf"></iframe>
      </div>
      <div class="half-page-column">
        <div style="margin-bottom:3cm;"></div>
        <div class="tab-bar">
          <button :class="viewer_mode == 'SubstanceGrid' ? 'active' : ''" @click="updateTab('SubstanceGrid')">Substances ({{ substance_list.length }}) (grid)</button>
          <button :class="viewer_mode == 'SubstanceTable' ? 'active' : ''" @click="updateTab('SubstanceTable')">Substances ({{ substance_list.length }}) (table)</button>
        </div>
        <div v-if="viewer_mode == 'SubstanceGrid'">
          <button @click="downloadSubstanceGridInfo">Download Substance Info</button>
          <button @click="copySubstancesToClipboard">Copy DTXSID List</button>
          <div class="substance-grid">
            <div v-for="cl in substance_list">
              <SubstanceTile :substance_info="cl" />
            </div>
          </div>
        </div>
  
        <div v-else-if="viewer_mode == 'SubstanceTable'">
          <button @click="downloadSubstanceTableInfo">Download Substance Info</button>
          <button @click="copySubstancesToClipboard">Copy DTXSID List</button>
          <ag-grid-vue
            class="ag-theme-balham"
            style="height:550px; width:100%"
            :columnDefs="column_defs"
            :rowData="substance_list"
            rowSelection="single"
            @grid-ready="onGridReady"
            :suppressCopyRowsToClipboard="true"
          ></ag-grid-vue>
        </div>
        <p v-else>Illegal value for 'viewer_mode' selected.  Current value is {{viewer_mode}}.</p>
      </div>
    </div>
  </template>
  
  <script>
    import axios from 'axios'
  
    import '@/assets/style.css'
    import { imageLinkForSubstance } from '@/assets/common_functions'
    import { BACKEND_LOCATION, COMPTOX_PAGE_URL } from '@/assets/store'
    
    import SubstanceTile from '@/components/SubstanceTile.vue'
    
    import 'ag-grid-community/styles/ag-grid.css'
    import 'ag-grid-community/styles/ag-theme-balham.css'
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
          viewer_mode: "SubstanceGrid",
          substance_list: [],
          has_associated_spectra: false,
          BACKEND_LOCATION,
          COMPTOX_PAGE_URL,
          pdf_source_url: null,
          column_defs: [
            {field:'image', headerName:'Structure', autoHeight: true, width: 100, cellRenderer: (params) => {
              if (params.data.image_link) {
                var image = document.createElement('img');
                image.src = params.data.image_link
                image.style = "width:70px;height:70px;padding-top:2px;padding-bottom:2px;";
                image.alt = `Structure image for ${params.data.dtxsid}`
                return image;
              } else {
                var p = document.createElement('div')
                p.style = "width:70px;height:70px;padding-top:2px;padding-bottom:2px; text-align: center; line-height: 70px;";
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
          ]
        }
      },
  
      async created() {
        const response = await axios.get(`${this.BACKEND_LOCATION}/get_info_by_id/${this.$route.params.internal_id}`)
        if (response.data.result) {
          this.pdf_source_url = response.data.result.link
        }
        this.loadPDF()
        this.findDTXSIDs()
      },
  
      methods: {
        async loadPDF(){
          this.target_pdf_url = encodeURI(`${this.BACKEND_LOCATION}/get_pdf/fact sheet/${this.$route.params.internal_id}`)
          const response = await axios.get(`${this.BACKEND_LOCATION}/get_pdf_metadata/fact sheet/${this.$route.params.internal_id}`)
          this.pdf_name = response.data.pdf_name
          this.metadata_rows = response.data.metadata_rows
          this.has_associated_spectra = response.data.has_associated_spectra
        },
        async findDTXSIDs(){
          const response = await axios.get(`${this.BACKEND_LOCATION}/find_dtxsids/${this.$route.params.internal_id}`)
          this.substance_list = response.data.substance_list
          for (let i=0; i<this.substance_list.length; i++) {
            this.substance_list[i]["image_link"] = imageLinkForSubstance(this.substance_list[i].dtxsid, this.substance_list[i].image_in_comptox)
          }
        },
        updateTab(tabName) {
          this.viewer_mode = tabName
        },
        async downloadSubstanceGridInfo() {
          await axios.get(`${this.BACKEND_LOCATION}/get_substance_file_for_record/${this.$route.params.internal_id}`, {responseType: "blob"}).then(res => {
            let blob = new Blob([res.data], {type: res.headers['content-type']})
            let link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = `${this.$route.params.internal_id}_substance_list.xlsx`
            link.click()
          })
        },
        downloadSubstanceTableInfo() {
          this.gridApi.exportDataAsExcel({
            columnKeys: ["dtxsid", "casrn", "preferred_name"],
            fileName: `${this.$route.params.internal_id}_substance_list.xlsx`
          });
        },
        copySubstancesToClipboard() {
          const dtxsid_list_string = this.substance_list.map(x => x.dtxsid).join("\n")
          // NOTE: the preferred way to copy to clipboard is apparently "navigator.clipboard.writeText()" these days. I
          // can't get that to work in this app, though, since it apparently requires a secured connection and the
          // deployed version of this app doesn't have that.  So I'm sticking to this technically-depricated solution that
          // I pulled out of CompTox's code, since it apparently works there.
          const textarea = document.createElement('textarea')
          textarea.value = dtxsid_list_string
          document.body.appendChild(textarea)
          textarea.select()
          try {
            document.execCommand('copy')
          } catch (err) {
            console.log('Cannot copy: ' + err)
          }
          document.body.removeChild(textarea)
        },
        onGridReady(params) {
          this.gridApi = params.api;
          this.gridColumnApi = params.columnApi;
        }
      },
  
      components: { AgGridVue, SubstanceTile }
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
  
    .substance-grid {
      display: flex;
      flex-wrap: wrap;
      justify-content: left;
    }
  </style>