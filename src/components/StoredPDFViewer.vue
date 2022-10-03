<template>
  <div>
    <div class="results-header">
      <h2 v-if="pdf_name">{{pdf_name}}</h2>
      <ul v-if="metadata_rows" style="list-style-type: none;">
        <li v-for="r in metadata_rows"><strong>{{r[0]}}:</strong> {{r[1]}}</li>
      </ul>
    </div>
    <div class="tab-bar">
      <a :class="viewerMode == 'PDF' ? 'active' : ''" @click="updateTab('PDF')">PDF Viewer</a>
      <a :class="viewerMode == 'CompoundGrid' ? 'active' : ''" @click="updateTab('CompoundGrid')">Compounds (grid)</a>
      <a :class="viewerMode == 'CompoundTable' ? 'active' : ''" @click="updateTab('CompoundTable')">Compounds (table)</a>
    </div>
    <iframe v-if="viewerMode == 'PDF'" class="monograph-box" :src="`${target_pdf_url}`" type="application/pdf"></iframe>
    <!--p v-else-if="viewerMode == 'CompoundGrid'">Compound grid view</p-->

    <div class="compound-grid" v-else-if="viewerMode == 'CompoundGrid'">
      <div v-for="cl in compoundList">
        <CompoundTile :dtxsid="`${cl.dtxsid}`" :preferred_name="`${cl.preferred_name}`" />
      </div>
    </div>

    <ag-grid-vue
      v-else-if="viewerMode == 'CompoundTable'"
      class="ag-theme-balham"
      style="height:500px; width:100%"
      :columnDefs="columnDefs"
      :rowData="compoundList"
      rowSelection="single"
    ></ag-grid-vue>
    <p v-else>Illegal value for 'viewerMode' selected.  Current value is {{viewerMode}}.</p>
  </div>
</template>

<script>
  import axios from 'axios';

  import '@/assets/search_results.css';

  import CompoundTile from '@/components/CompoundTile.vue';

  import '/node_modules/ag-grid-community/dist/styles/ag-grid.css';
  import '/node_modules/ag-grid-community/dist/styles/ag-theme-balham.css';
  import { AgGridVue } from "ag-grid-vue3";

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
        viewerMode: "PDF",
        compoundList: [],
        columnDefs: [
          {field: 'dtxsid', headerName: 'DTXSID'},
          {field: 'preferred_name', headerName:'Compound Name'}
        ]
      }
    },
    props: ['selectedRowData'],
    watch: {
      selectedRowData(){
        this.loadPDF()
      }
    },
    async created() {
      console.log(this.selectedRowData)
      this.loadPDF()
      this.findDTXSIDs()
    },

    methods: {
      async loadPDF(){
        this.target_pdf_url = encodeURI(`http://http://v2626umcth819.rtord.epa.gov:9415/get_pdf/${this.selectedRowData.source}/${this.selectedRowData.internal_id}`)
        const response = await axios.get(`http://http://v2626umcth819.rtord.epa.gov:9415/get_pdf_metadata/${this.selectedRowData.source}/${this.selectedRowData.internal_id}`)
        this.pdf_name = response.data.pdf_name
        this.pdf_metadata = response.data.pdf_metadata
        this.metadata_rows = response.data.metadata_rows
        console.log(response)
      },
      async findDTXSIDs(){
        const response = await axios.get(`http://http://v2626umcth819.rtord.epa.gov:9415/find_dtxsids/${this.selectedRowData.source}/${this.selectedRowData.internal_id}`)
        this.compoundList = response.data.chemical_ids
      },
      updateTab(tabName) {
        this.viewerMode = tabName
        console.log(tabName)
      }
    },
    components: { AgGridVue, CompoundTile }
  };
</script>

<style>
  .monograph-box{
    height: 90vh;
    width: 50vw;
    overflow: scroll;
  }

  .tab-bar {
    margin-bottom: 0px;
    display: flex;
    justify-content: space-around;
  }

  .tab-bar a{
    padding: 12px 24px;
    border: 1px solid #CCC;
  }

  .tab-bar a.active {
    background-color: #ccc;
  }

  .compound-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: left;
  }
</style>