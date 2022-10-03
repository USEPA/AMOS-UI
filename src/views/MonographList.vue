<template>
  This is a list of monographs available from the given source.
  <div class="wrap">
    <div class="monograph-box">
      <ag-grid-vue
          class="ag-theme-balham"
          style="height:800px; width:100%"
          :columnDefs="columnDefs"
          :rowData="monograph_info"
          rowSelection="single"
          @first-data-rendered="onGridReady"
          @row-selected="onRowSelected"
        ></ag-grid-vue>
    </div>
    <iframe class="monograph-box" :src="`${target_pdf_url}`" type="application/pdf"></iframe>
  </div>
</template>

<script>
  import axios from 'axios';
  
  //import '../../node_modules/ag-grid-community/dist/styles/ag-grid.css';
  //import '../../node_modules/ag-grid-community/dist/styles/ag-theme-balham.css';
  import '/node_modules/ag-grid-community/dist/styles/ag-grid.css';
  import '/node_modules/ag-grid-community/dist/styles/ag-theme-balham.css';
  import { AgGridVue } from "ag-grid-vue3";

  import 'ag-grid-enterprise'
  import { LicenseManager } from 'ag-grid-enterprise'
  LicenseManager.setLicenseKey('CompanyName=US EPA,LicensedGroup=Multi,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=5,LicensedProductionInstancesCount=0,AssetReference=AG-010288,ExpiryDate=3_December_2022_[v2]_MTY3MDAyNTYwMDAwMA==4abffeb82fbc0aaf1591b8b7841e6309')

  export default {
    data(){
      return {
        names: [],
        source_path: "",
        target_pdf_url: "",
        monograph_info: [],
        columnDefs: [
          {field: 'name', headerName: 'Monograph Name', sortable: true, filter: 'agTextColumnFilter', floatingFilter: true},
          {field: 'dtxsid', headerName: 'DTXSID'},
          {field: 'info_source', headerName: 'Source', sortable: true},
          {field: 'date', headerName: 'Date', sortable: true}
        ]
      }
    },

    async created() {
      const path = `http://http://v2626umcth819.rtord.epa.gov:9415/monograph_list`;
      const response = await axios.get(path)
      this.names = response.data.names
      this.source_path = response.data.source_path
      this.monograph_info = response.data.monograph_info
    },

    methods: {
      onGridReady(params) {
        1
      },
      onRowSelected(event){
        if (event.event){
          console.log(event)
          this.target_pdf_url = `http://http://v2626umcth819.rtord.epa.gov:9415/get_pdf/${event.data.record_source}/${event.data.filename}.pdf`
        }
      },
      loadMonograph(event){
        this.target_pdf_url = event.target.href
      }
    },

    components: {
      AgGridVue
    }
  }
</script>

<style>

.wrap{
  display: flex;
}

.monograph-box{
  height: 90vh;
  width: 50vw;
  overflow: scroll;
}

</style>