<!--
  This page is for locating substances that are members of a ClassyFire classification (the first four levels, at
  least).

  This page accepts four URL query parameters -- sending a kingdom, superclass, class, and subclass will pre-start a
  search for that classification.  Note that all four parameters must be passed, otherwise the parameters will be
  ignored.
-->

<template>
  <p>Use the inputs below to specify a ClassyFire classification, and then use "Get Substances" to view a list of all available substances under that classification.</p>
  <div style="display: flex; flex-direction: row; justify-content: space-around">
    <div class="classyfire-input">
      <label for="kingdom"><strong>Kingdom</strong></label>
      <p>2 kingdoms available.</p>
      <input type="text" id="kingdom" list="kingdom-values" v-model="kingdom" :disabled="disabled.kingdom"/>
      <datalist id="kingdom-values">
        <option v-for="kingdom in kingdoms">{{ kingdom }}</option>
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
  <b-alert variant="warning" dismissible v-model="status_boxes.bad_query_params">{{ status_boxes.bad_params_message }}</b-alert>
  <b-alert variant="warning" dismissible v-model="status_boxes.incomplete_query_params">An incomplete set of classification levels was passed in the URL.</b-alert>
  <br />
  <!--
  <button @click="resetSelection">Reset Selection</button>
  <button @click="downloadSearchResults">Download Table</button>
  <button @click="sendToBatchSearch">Send Selected Substances to Batch Search</button>
  -->
  <div style="display: flex; flex-direction: row; justify-content: space-between">
    <div>
      <button @click="classificationToURL">Copy Classification to URL</button>
      <button @click="resetSelection">Reset Selection</button>
      <button @click="downloadSearchResults">Download Table</button>
    </div>
    <button @click="sendToBatchSearch">Send Selected Substances to Batch Search</button>
  </div>
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
    rowSelection="multiple"
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
  import RecordCountFilter from '@/components/RecordCountFilter.vue'

  export default {
    data() {
      return {
        BACKEND_LOCATION,
        COMPTOX_PAGE_URL,
        IMAGE_BY_DTXSID_API: "https://comptox.epa.gov/dashboard-api/ccdapp1/chemical-files/image/by-dtxsid/",
        kingdoms: ["Inorganic compounds", "Organic compounds"],
        klasses: [],
        subklasses: [],
        superklasses: [],
        kingdom: "",
        superklass: "",
        klass: "",
        subklass: "",
        substances: [],
        status_boxes: {bad_query_params: false, bad_params_message: "", incomplete_query_params: false},
        filtered_record_count: 0,
        state: {searching: false},
        disabled: {kingdom: false, superklass: true, klass: true, subklass: true},
        defaultColDef: {filter: 'agTextColumnFilter', floatingFilter: true, resizable: true},
        columnDefs: [
          {field:'image', headerName:'Structure', checkboxSelection: true, headerCheckboxSelection: true, floatingFilter: false, autoHeight: true, width: 120, wrapText: true, cellRenderer: (params) => {
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
          {field: 'spectra', headerName: "Spectra", width: 110, sortable: true, filter: RecordCountFilter, filterParams: {record_name: "spectra"}, cellRenderer: params => {
            if (params.data.spectra > 0) {
              const link = document.createElement("a");
              link.href = this.$router.resolve(`/search/${params.data.dtxsid}?initial_results_tab=spectrum`).href;
              link.innerText = params.data.spectra;
              link.addEventListener("click", e => {
                e.preventDefault();
                window.open(`/search/${params.data.dtxsid}?initial_results_tab=spectrum`);
              });
              return link;
            } else {
              return 0
            }
          }},
          {field: 'methods', headerName: "Methods", width: 110, sortable: true, filter: RecordCountFilter, filterParams: {record_name: "methods"}, cellRenderer: params => {
            if (params.data.methods > 0) {
              const link = document.createElement("a");
              link.href = this.$router.resolve(`/search/${params.data.dtxsid}?initial_results_tab=method`).href;
              link.innerText = params.data.methods;
              link.addEventListener("click", e => {
                e.preventDefault();
                window.open(`/search/${params.data.dtxsid}?initial_results_tab=method`);
              });
              return link;
            } else {
              return 0
            }
          }},
          {field: 'fact_sheets', headerName: "Fact Sheets", width: 110, sortable: true, filter: RecordCountFilter, filterParams: {record_name: "fact sheets"}, cellRenderer: params => {
            if (params.data.fact_sheets > 0) {
              const link = document.createElement("a");
              link.href = this.$router.resolve(`/search/${params.data.dtxsid}?initial_results_tab=fact+sheet`).href;
              link.innerText = params.data.fact_sheets;
              link.addEventListener("click", e => {
                e.preventDefault();
                window.open(`/search/${params.data.dtxsid}?initial_results_tab=fact+sheet`);
              });
              return link;
            } else {
              return 0
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
    async created() {
      const query_params = Object.keys(this.$route.query)
      fieldfiller: if (["kingdom", "superclass", "class", "subclass"].every(x => query_params.includes(x))) {
        /* this.kingdom = this.$route.query.kingdom
        this.superklass = this.$route.query.superclass
        this.klass = this.$route.query.class
        this.subklass = this.$route.query.subclass
        this.disabled.superklass = false
        this.disabled.klass = false
        this.disabled.subklass = false
        this.getSubstances() */
        this.kingdom = this.$route.query.kingdom
        if (!this.kingdoms.includes(this.$route.query.kingdom)) {
          this.status_boxes.bad_params_message = `Invalid kingdom '${this.$route.query.kingdom}'.`
          this.status_boxes.bad_query_params = true
          break fieldfiller
        }
        await this.getSuperklasses()
        this.superklass = this.$route.query.superclass
        if (!this.superklasses.includes(this.superklass)) {
          this.status_boxes.bad_params_message = `Invalid superclass '${this.superklass}' for kingdom '${this.kingdom}'.`
          this.status_boxes.bad_query_params = true
          break fieldfiller
        }
        await this.getKlasses()
        this.klass = this.$route.query.class
        if (!this.klasses.includes(this.klass)) {
          this.status_boxes.bad_params_message = `Invalid class '${this.klass}' for kingdom '${this.kingdom}', superclass '${this.superklass}'.`
          this.status_boxes.bad_query_params = true
          break fieldfiller
        }
        await this.getSubklasses()
        this.subklass = this.$route.query.subclass
        if (!this.subklasses.includes(this.subklass)) {
          this.status_boxes.bad_params_message = `Invalid subclass '${this.subklass}' for kingdom '${this.kingdom}', superclass '${this.superklass}', class '${this.klass}'.`
          this.status_boxes.bad_query_params = true
          break fieldfiller
        }
        await this.getSubstances()
      } else if (query_params.length > 0) { 
        this.status_boxes.incomplete_query_params = true
        console.log("Some query parameters are missing.")
      }
    },
    methods: {
      sendToBatchSearch() {
        const dtxsid_list = this.gridApi.getSelectedRows().map(node => node.dtxsid)
        const target_href = `/batch_search?dtxsids=${dtxsid_list.join(";")}`
        window.open(target_href)
      },
      classificationToURL() {
        const parameters = `kingdom=${this.kingdom}&superclass=${this.superklass}&class=${this.klass}&subclass=${this.subklass}`
        const url = `${window.location.origin}${this.$route.path}?${parameters}`

        // NOTE: the preferred way to copy to clipboard is apparently "navigator.clipboard.writeText()" these days. I
        // can't get that to work in this app, though, since it apparently requires a secured connection and the
        // deployed version of this app doesn't have that.  So I'm sticking to this technically-depricated solution that
        // I pulled out of CompTox's code, since it apparently works there.
        const textarea = document.createElement('textarea')
        textarea.value = url
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
        this.gridApi = params.api
        this.gridColumnApi = params.columnApi
        this.gridApi.onFilterChanged()

        this.gridColumnApi.applyColumnState({state: [
          {colId: "methods", sort: "desc", sortIndex: 0},
          {colId: "fact_sheets", sort: "desc", sortIndex: 1},
          {colId: "spectra", sort: "desc", sortIndex: 2}
        ]})
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
    components: {AgGridVue, RecordCountFilter}
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