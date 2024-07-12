<!--
  This page is for viewing

  This page takes one URL route parameter:
  - Substring, which is the substring being searched for 
-->

<template>
  <p>Use the inputs below to specify a ClassyFire classification, and then use "Get Substances" to view a list of all available substances under that classification.</p>
  <div style="display: flex; flex-direction: row; justify-content: space-around">
    <div class="classyfire-input">
      <label for="kingdom"><strong>Kingdom</strong></label>
      <p>2 kingdoms available.</p>
      <input type="text" id="kingdom" list="kingdom-values" v-model="kingdom"/>
      <datalist id="kingdom-values">
        <option>Organic compounds</option>
        <option>Inorganic compounds</option>
      </datalist>
      <br />
      <button @click="getSuperklasses">Get Superclasses</button>
    </div>
    <div class="classyfire-input">
      <label for="superklass"><strong>Superclass</strong></label>
      <p v-if="disabled.superklass">&nbsp;</p>
      <p v-else>{{ superklasses.length }} superclasses available.</p>
      <input type="text" id="superklass" list="superklass-values" v-model="superklass" :disabled="disabled.superklass"/>
      <datalist id="superklass-values">
        <option v-for="superklass in superklasses">{{ superklass }}</option>
      </datalist>
      <br />
      <button @click="getKlasses">Get Classes</button>
    </div>
    <div class="classyfire-input">
      <label for="klass"><strong>Class</strong></label>
      <p v-if="disabled.klass">&nbsp;</p>
      <p v-else>{{ klasses.length }} classes available.</p>
      <input type="text" id="klass" list="klass-values" v-model="klass" :disabled="disabled.klass" />
      <datalist id="klass-values">
        <option v-for="klass in klasses">{{ klass }}</option>
      </datalist>
      <br />
      <button @click="getSubklasses">Get Subclasses</button>
    </div>
    <div class="classyfire-input">
      <label for="subklass"><strong>Subclass</strong></label>
      <p v-if="disabled.subklass">&nbsp;</p>
      <p v-else>{{ subklasses.length }} subclasses available.</p>
      <input type="text" id="subklass" list="subklass-values" v-model="subklass" :disabled="disabled.subklass" />
      <datalist id="subklass-values">
        <option v-for="subklass in subklasses">{{ subklass }}</option>
      </datalist>
      <br />
      <button @click="getSubstances">Get Substances</button>
    </div>
  </div>
  <br />
  <button @click="resetSelection">Reset Selection</button>
  <button @click="downloadSearchResults">Download Table</button>
  <br />
  <p v-if="state.searching">Searching -- this may take a moment...</p>
  <p v-else>{{ substances.length }} substances found; {{ filtered_record_count }} are currently displayed.</p>
  <ag-grid-vue
    class="ag-theme-balham"
    style="height:600px; width:100%"
    :defaultColDef="defaultColDef"
    :columnDefs="columnDefs"
    :rowData="substances"
    @grid-ready="onGridReady"
    @filter-changed="onFilterChanged"
    rowSelection="single"
    :suppressCopyRowsToClipboard="true"
  ></ag-grid-vue>
</template>

<script>
  import axios from 'axios'

  import 'ag-grid-community/styles/ag-grid.css'
  import 'ag-grid-community/styles/ag-theme-balham.css'
  import { AgGridVue } from "ag-grid-vue3"
  import 'ag-grid-enterprise'
  import { LicenseManager } from 'ag-grid-enterprise'
  LicenseManager.setLicenseKey('CompanyName=US EPA,LicensedGroup=Multi,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=5,LicensedProductionInstancesCount=0,AssetReference=AG-010288,ExpiryDate=3_December_2022_[v2]_MTY3MDAyNTYwMDAwMA==4abffeb82fbc0aaf1591b8b7841e6309')

  import { imageLinkForSubstance } from '@/assets/common_functions'
  import { BACKEND_LOCATION, COMPTOX_PAGE_URL } from '@/assets/store'

  export default {
    data() {
      return {
        BACKEND_LOCATION,
        COMPTOX_PAGE_URL,
        IMAGE_BY_DTXSID_API: "https://comptox.epa.gov/dashboard-api/ccdapp1/chemical-files/image/by-dtxsid/",
        klasses: [],
        subklasses: [],
        superklasses: [],
        kingdom: "",
        superklass: "",
        klass: "",
        subklass: "",
        substances: [],
        filtered_record_count: 0,
        state: {searching: false},
        disabled: {superklass: true, klass: true, subklass: true},
        defaultColDef: {filter: 'agTextColumnFilter', floatingFilter: true},
        columnDefs: [
          {field:'image', headerName:'Structure', floatingFilter: false, autoHeight: true, width: 100, wrapText: true, cellRenderer: (params) => {
            if (params.data.image_link) {
              var image = document.createElement('img');
              image.src = params.data.image_link
              image.style = "width:70px;height:70px;padding-top:2px;padding-bottom:2px;";
              image.alt = `Structure image for ${params.data.dtxsid}`
              return image;
            } else {
              var p = document.createElement('div')
              p.style = "width:70px;height:70px;padding-top:2px;padding-bottom:2px;text-align: center; line-height: 70px;";
              p.innerText = "No structure."
              return p
            }
          }},
          {field: 'dtxsid', headerName: 'DTXSID', width: 115, cellRenderer: params => {
            return "<a href='" + this.COMPTOX_PAGE_URL + params.data.dtxsid + "' target='_blank'>" + params.data.dtxsid + "</a>"
          }},
          {field: 'casrn', headerName: 'CASRN', width: 120},
          {field: 'preferred_name', headerName: 'Preferred Name', sortable: true, sort: 'asc', flex: 1},
          {field: 'monoisotopic_mass', headerName: 'Monoisotopic Mass', width: 150, filter: 'agNumberColumnFilter'},
          {field: 'molecular_formula', headerName: 'Formula', width: 120},
          {field: 'data_available', headerName: 'AMOS Data?', width: 120, filter: 'agSetColumnFilter', wrapText: true, cellRenderer: params => {
            if (params.data.data_available == "Yes") {
              const link = document.createElement("a")
              link.href = this.$router.resolve(`/search/${params.data.dtxsid}`).href
              link.innerText = "Yes"
              link.target = "_blank"
               link.addEventListener("click", e => {
                e.preventDefault()
                window.open(this.$router.resolve(`/search/${params.data.dtxsid}`).href)
              });
              return link
            } else {
              return "No"
            }
          }}
        ]
      }
    },
    watch: {
      kingdom() {
        1 //console.log(this.kingdom)
      }
    },
    created() {
      const query_params = Object.keys(this.$route.query)
      if (["kingdom", "superclass", "class", "subclass"].every(x => query_params.includes(x))) {
        this.kingdom = this.$route.query.kingdom
        this.superklass = this.$route.query.superclass
        this.klass = this.$route.query.class
        this.subklass = this.$route.query.subclass
        this.disabled.superklass = false
        this.disabled.klass = false
        this.disabled.subklass = false
        this.getSubstances()
      } else {
        // may just delete this case later on
        console.log("some missing")
      }
    },
    methods: {
      onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.gridApi.onFilterChanged()
      },
      async getSuperklasses() {
        const response = await axios.post(`${this.BACKEND_LOCATION}/next_level_classification/`, {kingdom: this.kingdom})
        this.superklasses = response.data.values
        this.disabled.superklass = false
        this.disabled.klass = true
        this.disabled.subklass = true
        this.superklass = ""
        this.klass = ""
        this.subklass = ""
      },
      async getKlasses() {
        const response = await axios.post(`${this.BACKEND_LOCATION}/next_level_classification/`, {kingdom: this.kingdom, superklass: this.superklass})
        this.klasses = response.data.values
        this.disabled.klass = false
        this.disabled.subklass = true
        this.klass = ""
        this.subklass = ""
      },
      async getSubklasses() {
        const response = await axios.post(`${this.BACKEND_LOCATION}/next_level_classification/`, {kingdom: this.kingdom, superklass: this.superklass, klass: this.klass})
        this.subklasses = response.data.values
        this.disabled.subklass = false
        this.subklass = ""
      },
      async getSubstances() {
        this.state.searching = true
        const response = await axios.post(`${this.BACKEND_LOCATION}/substances_for_classification/`, {kingdom: this.kingdom, superklass: this.superklass, klass: this.klass, subklass: this.subklass})
        var found_substances = response.data.substances
        for (let i=0; i<found_substances.length; i++) {
          found_substances[i]["image_link"] = imageLinkForSubstance(found_substances[i].dtxsid, found_substances[i].image_in_comptox)
          found_substances[i]["data_available"] = found_substances[i].count > 0 ? "Yes" : "No"
        }
        this.substances = found_substances
        this.state.searching = false
        this.gridApi.onFilterChanged()
      },
      resetSelection() {
        this.disabled.superklass = true
        this.disabled.klass = true
        this.disabled.subklass = true
        this.kingdom = ""
        this.superklass = ""
        this.klass = ""
        this.subklass = ""
      },
      onFilterChanged(params) {
        this.filtered_record_count = this.gridApi.getDisplayedRowCount()
      },
      downloadSearchResults() {
        this.gridApi.exportDataAsExcel({
          fileName: `classyfire_${this.kingdom}-${this.superklass}-${this.klass}-${this.subklass}.xlsx`,
          columnKeys: ['dtxsid', 'casrn', 'preferred_name', 'monoisotopic_mass', 'molecular_formula']
        })
      }
    },
    components: {AgGridVue}
  }
</script>


<style>
  .classyfire-input {
    width: 20%
  }

  .classyfire-input label {
    display: block;
    padding-bottom: 4px;
  }

  .classyfire-input input {
    width: 100%
  }

  .ag-row .ag-cell {
    display: flex;
    align-items: center;
  }
</style>