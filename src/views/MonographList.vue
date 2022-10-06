<template>
  <div class="wrap">
    <div class="monograph-box">
      <p>This is a list of monographs available in the database.  All monographs currently originate from one of two sources:
      the <a href="https://www.swgdrug.org/monographs.htm">Scientific Working Group</a> and the <a href="https://www.npsdiscovery.org/reports/monographs/">Center for Forensic 
      Science Reserach & Education</a>.</p>
      <ag-grid-vue
        class="ag-theme-balham"
        style="height:800px; width:100%"
        :columnDefs="columnDefs"
        :rowData="monographInfo"
        rowSelection="single"
        @first-data-rendered="onGridReady"
        @row-selected="onRowSelected"
      ></ag-grid-vue>
    </div>
    <StoredPDFViewer style="width: 48vw;" v-if="anyMonographSelected" :selectedRowData="selectedRowData"/>
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

  import StoredPDFViewer from '@/components/StoredPDFViewer.vue'

  export default {
    data(){
      return {
        names: [],
        sourcePath: "",
        selectedRowData: {},
        monographInfo: [],
        anyMonographSelected: false,  // used to avoid having a box with an error pop up if nothing's been selected yet
        columnDefs: [
          {field: 'name', headerName: 'Monograph Name', sortable: true, filter: 'agTextColumnFilter', floatingFilter: true},
          {field: 'info_source', headerName: 'Source', sortable: true},
          {field: 'year_published', headerName: 'Year', sortable: true}
        ]
      }
    },

    async created() {
      const path = `http://localhost:5000/monograph_list`;
      const response = await axios.get(path)
      this.names = response.data.names
      this.sourcePath = response.data.source_path
      this.monographInfo = response.data.monograph_info
    },

    methods: {
      onGridReady(params) {
        1
      },
      onRowSelected(event){
        if (event.event){
          console.log(event)
          this.selectedRowData = event.data
          this.anyMonographSelected = true
        }
      }
    },

    components: {
      AgGridVue,
      StoredPDFViewer
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