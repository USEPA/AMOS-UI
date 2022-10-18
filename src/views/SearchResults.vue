<template>
  <div class="full-results-page">
    <div class="search-results">
      <div class="results-header">
        <h1 v-if="still_searching" class="text-that-can-overflow">Searching for "{{$route.params.search_term}}"...</h1>
        <h1 v-else class="text-that-can-overflow">Search Results for "{{$route.params.search_term}}"</h1>
        <br/>
        <div class="chemical-box">
          <div class="chemical-image-highlight">
              <img class="chemical-image" :src="`https://comptox.epa.gov/dashboard-api/ccdapp1/chemical-files/image/by-dtxsid/${id_info.dtxsid}`"/>
          </div>
          <div class="chemical-info">
            <ul style="list-style-type: none;">
              <li><strong>(Preferred) Name:</strong> {{ id_info.preferred_name }} </li>
              <li><strong>DTXSID:</strong> <a :href="`https://comptox.epa.gov/dashboard/chemical/details/${id_info.dtxsid}`">{{ id_info.dtxsid }}</a> </li>
              <li><strong>CASRN:</strong> {{ id_info.casrn }} </li>
              <li><strong>InChIKey:</strong> {{ id_info.inchikey }} </li>
              <li><strong>Molecular Formula:</strong> {{ id_info.molecular_formula }} </li>
              <li><strong>Mass:</strong> {{ id_info.molecular_weight }} </li>
              <li>&nbsp;</li>
              <li><button v-if="!still_searching" @click="downloadResultsAsCSV">Download Results</button></li>
            </ul>
          </div>
        </div>
        <input type="checkbox" id="single-point-spectra" v-model="includeSinglePointSpectra" @change="updateCheckboxFilters">
        <label for="single-point-spectra">Include Single Point Spectra</label>
      </div>
      <div class="tab-bar">
        <a :class="resultTableViewMode == 'all' ? 'active' : ''" @click="updateTab('all')">All Results</a>
        <a :class="resultTableViewMode == 'spectrum' ? 'active' : ''" @click="updateTab('spectrum')">Spectra</a>
        <a :class="resultTableViewMode == 'monograph' ? 'active' : ''" @click="updateTab('monograph')">Monographs</a>
        <a :class="resultTableViewMode == 'method' ? 'active' : ''" @click="updateTab('method')">Methods</a>
      </div>
      <ag-grid-vue
        class="ag-theme-balham"
        style="height:600px; width:100%"
        v-if="results.length > 0"
        :columnDefs="columnDefs"
        :rowData="results"
        rowSelection="single"
        @first-data-rendered="onGridReady"
        @row-selected="onRowSelected"
        :isExternalFilterPresent="isExternalFilterPresent"
        :doesExternalFilterPass="doesExternalFilterPass"
      ></ag-grid-vue>
    </div>
    <div class="information-viewer">
      <p class="info-paragraph" v-if="view_type == 'none'">Click on a row in the table to the left to display either a spectrum (if available) or a PDF file in this space.</p>
      <SpectrumViewer v-else-if="view_type == 'Spectrum'" :selectedRowData="selectedRowData"/>
      <StoredPDFViewer v-else-if="view_type == 'PDF'" style="width: 50vw;" :selectedRowData="selectedRowData"/>
      <p class="info-paragraph" v-else>This database does not contain anything for this record.  Click the "External Link" text to be directed to the source.</p>
    </div>
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
  import '@/assets/search_results.css'
  import SpectrumViewer from '@/components/SpectrumViewer.vue'
  import StoredPDFViewer from '@/components/StoredPDFViewer.vue'
  import { BACKEND_LOCATION } from '@/assets/store';

  export default {
    data(){
      return {
        view_type: "none",
        selectedRowData: {},
        results: [],
        id_info: {},
        still_searching: true,
        BACKEND_LOCATION,
        includeSinglePointSpectra: true,
        resultTableViewMode: "all",
        columnDefs: [
          //{field: 'dtxsid', headerName: 'DTXSID'},
          //{field: 'name', headerName:'Compound Name'},
          //{field: 'cas_number', headerName:'CASRN'},
          //{field: 'inchikey', headerName: 'InChIKey'},
          {field: 'spectrum_type', headerName: 'Spectrum Type', sortable: true, sort: 'asc', filter: 'agSetColumnFilter', width: 170, suppressSizeToFit: true},
          {field: 'source', headerName: 'Source', sortable: true, width: 220, suppressSizeToFit: true, cellRenderer: params => {
            return "<a href='" + params.data.link + "' target='_blank'>" + params.data.source + "</a>";
          }},
          {field: 'record_type', headerName: 'Record Type', filter: 'agSetColumnFilter', width: 150, suppressSizeToFit: true,
            cellRenderer: params => {
              if (params.data.data_type !== null) {
                return params.data.record_type + " (<span class='fake-link'>" + params.data.data_type + "</span>)"
              } else {
                return params.data.record_type + " (<a href='" + params.data.link + "' target='_blank'>External Link</a>)"
              }
            }
          },
          {field: 'comment', headerName: 'Information',
            cellRenderer: params => {
              if (params.data.comment) {
                return '<span title="' + params.data.comment + '">' + params.data.comment + '</span>'
              } else {
                return "None"
              }
            }
          }
        ]
      };
    },
    methods: {
      onGridReady(params) {
        this.gridApi = params.api

        // Code to set filters on table generation -- keeping just in case it's useful later
        //const st_instance = this.gridApi.getFilterInstance('spectrum_type');
        //st_instance.setModel({values: ['GC-MS', 'LC-MS+', 'LC-MS-', 'LC-MS-Unknown']});

        var filters_to_use = []
        if (typeof(this.$route.query.monographs) === "string" && typeof(this.$route.query.monographs) === "string" && typeof(this.$route.query.spectra) === "string"){
          if (this.$route.query.methods === "true"){filters_to_use.push("Method")}
          if (this.$route.query.monographs === "true"){filters_to_use.push("Monograph")}
          if (this.$route.query.spectra === "true"){filters_to_use.push("Spectrum")}
          const rec_instance = this.gridApi.getFilterInstance('record_type');
          rec_instance.setModel({values: filters_to_use});
        }
        this.gridApi.onFilterChanged();   //regenerates the table with the filter settings
        this.gridApi.sizeColumnsToFit();
      },
      onRowSelected(event) {
        if (event.event){
          this.view_type = event.data.data_type
          if (event.data.data_type == "Spectrum"){
            this.selectedRowData = event.data
            console.log(this.selectedRowData)
          } else if (event.data.data_type == "PDF"){
            this.selectedRowData = event.data
            console.log(this.selectedRowData)
          }
        }
      },
      downloadResultsAsCSV() {
        let csv = "Spectrum Type,Source,Link,Record Type\n";
        this.results.forEach((row) =>{
          csv += [row.spectrum_type, row.source, row.link, row.record_type].join(",")
          csv += "\n"
        })
        const anchor = document.createElement('a');
        anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
        anchor.target = '_blank';
        anchor.download = 'nameYourFileHere.csv';
        anchor.click();
      },
      isExternalFilterPresent() {
        return true
      },
      doesExternalFilterPass(node) {
        console.log(node.data)

        let singlePointSpectrum = false
        if (node.data.comment) {
          if (!this.includeSinglePointSpectra & (node.data.comment.includes("# PEAKS=1;") | node.data.comment.endsWith("# PEAKS=1"))) {
            singlePointSpectrum = true
          }
        }

        // filter out result types based on selected 
        let correctResultType = true
        if (this.resultTableViewMode != "all") {
          if (node.data.record_type.toLowerCase() != this.resultTableViewMode) {
            correctResultType = false
          }
        }

        return (!singlePointSpectrum) & correctResultType;
      },
      updateCheckboxFilters() {
        console.log(this.includeSinglePointSpectra)
        this.gridApi.onFilterChanged()
      },
      updateTab(tabName) {
        this.resultTableViewMode = tabName
        this.gridApi.onFilterChanged()
      }
    },
    async created() {
      //const path = `http://v2626umcth819.rtord.epa.gov:9415/search/${this.$route.params.search_term}`;
      const path = `${this.BACKEND_LOCATION}/search/${this.$route.params.search_term}`;
      const response = await axios.get(path)
      this.results = response.data.results
      this.id_info = response.data.id_info
      this.still_searching = false
    },
    components: {
      AgGridVue,
      SpectrumViewer,
      StoredPDFViewer
    }
  }
</script>

<style>
.full-results-page {
  display: flex;
}

.search-results {
  width: 48vw;
}

.information-viewer {
  width: 48vw;
}

.info-paragraph {
  text-align: center;
  font-size: 20px;
}

.fake-link {
  color: #0000EE;
  text-decoration: underline;
}
</style>