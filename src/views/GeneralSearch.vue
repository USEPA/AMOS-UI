<!--
  This page displays the records that correspond to a single searched substance in a table, and will display information
  about the searched substance and any record in the all_results that is selected.

  This page can take one URL route parameter and four optional query parameters.  The route parameter is:
  - search_term: the term searched for; can be either a name, an InChIKey, a CASRN, or a DTXSID
  The query parameters are:
  - initial_results_tab: preselects which record type tab is selected.  If not supplied, all all_results will be shown
  - initial_row_selected: the internal ID of a record; if this parameter exists, the page will try to preselect this
    record's row once the table is loaded
-->

<template>
  <div class="two-column-page">
    <div class="half-page-column">
      <div>
        <h1 v-if="still_searching" class="text-that-can-overflow">Searching for "{{$route.params.search_term}}"... <i class="mdi mdi-progress-clock mdi-spin"/></h1>
        <h1 v-else-if="!still_searching & no_substance_match">No substance match found.</h1>
        <div v-else>
          <h1 class="text-that-can-overflow">{{ result_count }} Results for "{{$route.params.search_term}}"</h1>
          <br/>
          <div class="chemical-box">
            <div class="chemical-image-highlight">
              <img v-if="image_link" class="chemical-image" :src="image_link" :alt="`Structure image for ${substance_info.dtxsid}`"/>  
              <div v-else style="text-align: center; display: flex; align-items: center;">No structural representation was found for this substance.</div>
            </div>
            <div class="chemical-info">
              <table style="margin-left: 30px;">
                <tr>
                  <td><button class="copy-button" title="Copy Name" @click="copyToClipboard(substance_info.preferred_name)">⎘</button></td>
                  <td><strong>(Preferred) Name:</strong> {{ substance_info.preferred_name }}</td>
                </tr>
                <tr>
                  <td><button class="copy-button" title="Copy DTXSID" @click="copyToClipboard(substance_info.dtxsid)">⎘</button></td>
                  <td><strong>DTXSID:</strong> <a :href="`${COMPTOX_PAGE_URL}${substance_info.dtxsid}`" target="_blank">{{ substance_info.dtxsid }}</a></td>
                </tr>
                <tr>
                  <td><button class="copy-button" title="Copy CASRN" @click="copyToClipboard(substance_info.casrn)">⎘</button></td>
                  <td><strong>CASRN:</strong> {{ substance_info.casrn }}</td>
                </tr>
                <tr>
                  <td><button class="copy-button" title="Copy InChIKey" @click="copyToClipboard(substance_info.indigo_inchikey ? substance_info.indigo_inchikey : substance_info.jchem_inchikey)">⎘</button></td>
                  <td><strong>InChIKey:</strong> <router-link :to="`/partial_identifier_search?inchikey_first_block_search=${displayed_inchikey.first_block}`" target="_blank">{{displayed_inchikey.first_block}}</router-link>{{displayed_inchikey.remainder}}</td>
                </tr>
                <tr>
                  <td></td>
                  <td><strong>Molecular Formula:</strong> {{ substance_info.molecular_formula }}</td>
                </tr>
                <tr>
                  <td></td>
                  <td><strong>Monoisotopic Mass:</strong> {{ substance_info.monoisotopic_mass }}</td>
                </tr>
                <tr v-if="classification">
                  <td></td>
                  <td><ClassyFireDisplay :kingdom="classification.kingdom" :superklass="classification.superklass" :klass="classification.klass" :subklass="classification.subklass" /></td>
                </tr>
                <tr v-if="additional_sources.length > 0">
                  <td></td>
                  <td>
                    <details>
                      <summary><strong>Additional Information Sources</strong></summary>
                      <ul>
                        <li v-for="s in additional_sources"><a :href="s.link" target="_blank">{{s.source_name}}</a></li>
                      </ul>
                    </details>
                  </td>
                </tr>
                <tr v-if="functional_uses">
                  <td></td>
                  <td>
                    <details>
                      <summary><strong>Functional Uses</strong></summary>
                      <div style="max-width: 400px;">{{ functional_uses }}</div>
                    </details>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div v-if="all_results.length > 0" style="display: flex; flex-direction: row;">
        <div style="width: 40%">
          <div>
            <input type="checkbox" id="single-point-spectra" v-model="result_filters.single_point_spectra" @change="updateCheckboxFilters">
            <label for="single-point-spectra">Include single-point spectra</label>
          </div>
          <div>
            <input type="checkbox" id="ms-ready" v-model="result_filters.ms_ready" @change="updateCheckboxFilters">
            <label for="ms-ready">Include MS-Ready methods</label>
            &nbsp;
            <help-icon style="vertical-align:middle;" tooltipText="MS-Ready refers to a standardization of substances by collapsing isomers, salts, isotopes, etc., into a single form, identifiable by having the same first block of their InChIKey.  Selecting this will include methods from substances with the same MS-Ready form." />
          </div>
          <div>
            <input type="checkbox" id="external_links" v-model="result_filters.external_links" @change="updateCheckboxFilters">
            <label for="external_links">Include external links</label>
          </div>
        </div>
        <div style="width: 60%; display: flex; align-items: center;">
          <button v-if="!still_searching" @click="downloadResultsAsExcel">Download Results</button>
        </div>
      </div>
      <div v-if="!still_searching">
        <p v-if="no_substance_match">There is no substance in this database that matches the search term "{{$route.params.search_term}}" -- if something should be here, please check the search term for typos.</p>
        <div v-else-if="all_results.length==0">
          <p>The search term "{{$route.params.search_term}}" matches a substance in the database; however, no data records were found.</p>
          <p>If you are looking for methods containing the searched substance, you can run a search for methods with similar structures <router-link :to="`/similar_structure_search?search_term=${$route.params.search_term}`">here</router-link>.</p>
        </div>
        <div v-else>
          <div class="tab-bar">
            <button :class="result_table_view_mode == 'all' ? 'active' : ''" @click="updateTab('all')">All Results ({{result_count}})</button>
            <button :class="determineTabBarClass('method')" @click="updateTab('method')">Methods ({{record_type_counts.method}})</button>
            <button :class="determineTabBarClass('spectrum')" @click="updateTab('spectrum')">Spectra ({{record_type_counts.spectrum}})</button>
            <button :class="determineTabBarClass('fact sheet')" @click="updateTab('fact sheet')">Fact Sheets ({{record_type_counts["fact sheet"]}})</button>
          </div>
          <ag-grid-vue
            class="ag-theme-balham"
            style="height:600px; width:100%"
            v-if="all_results.length > 0"
            :columnDefs="columnDefs"
            :rowData="all_results"
            rowSelection="single"
            @grid-ready="onGridReady"
            @row-selected="onRowSelected"
            :isExternalFilterPresent="isExternalFilterPresent"
            :doesExternalFilterPass="doesExternalFilterPass"
            :postSortRows="postSortRows"
            :suppressCopyRowsToClipboard="true"
          ></ag-grid-vue>
        </div>
      </div>
    </div>
    <div class="half-page-column">
      <p class="info-paragraph" v-if="view_type == 'none'">Click on a row in the table to the left to display either a spectrum (if available) or a PDF file in this space.</p>
      <MassSpectrumDisplay v-else-if="view_type == 'Mass Spectrum'" :internalID="selected_row_data.internal_id" displayAdditionalInfo />
      <NMRSpectrumDisplay v-else-if="view_type == 'NMR Spectrum'" :internalID="selected_row_data.internal_id" />
      <IRSpectrumDisplay v-else-if="view_type == 'IR Spectrum'" :internalID="selected_row_data.internal_id" />
      <StoredPDFDisplay v-else-if="view_type == 'PDF'" :internalID="selected_row_data.internal_id" :recordType="selected_row_data.record_type" displayAdditionalInfo/>
      <p class="info-paragraph" v-else>This database does not contain anything for this record.  Click the hyperlink in the "Record Type" column to be directed to the source.</p>
    </div>
    <BModal size="xl" v-model="disambiguation.inchikey">
      <InchikeyDisambiguation :searchedKey="$route.params.search_term" :substances="possible_substances" :record_counts="record_counts_by_dtxsid" @inchikeySelected="disambiguate" />
    </BModal>
    <BModal size="xl" v-model="disambiguation.synonym">
      <SynonymDisambiguation :synonym="$route.params.search_term" :substances="possible_substances" :record_counts="record_counts_by_dtxsid" @synonymSelected="disambiguate" />
    </BModal>
  </div>
</template>

<script>
  import axios from 'axios'
  import { BModal } from 'bootstrap-vue-next'

  import 'ag-grid-community/styles/ag-grid.css'
  import 'ag-grid-community/styles/ag-theme-balham.css'
  import { AgGridVue } from "ag-grid-vue3"
  import 'ag-grid-enterprise'
  import { LicenseManager } from 'ag-grid-enterprise'
  LicenseManager.setLicenseKey('CompanyName=US EPA,LicensedGroup=Multi,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=5,LicensedProductionInstancesCount=0,AssetReference=AG-010288,ExpiryDate=3_December_2022_[v2]_MTY3MDAyNTYwMDAwMA==4abffeb82fbc0aaf1591b8b7841e6309')

  import { imageLinkForSubstance, sourceAbbreviationTooltip } from '@/assets/common_functions.js'
  import { BACKEND_LOCATION, COMPTOX_PAGE_URL, METHOD_DOCUMENT_TYPES, SOURCE_ABBREVIATION_MAPPING } from '@/assets/store.js'
  import ClassyFireDisplay from '@/components/ClassyFireDisplay.vue'
  import HelpIcon from '@/components/HelpIcon.vue'
  import InchikeyDisambiguation from '@/components/InchikeyDisambiguation.vue'
  import IRSpectrumDisplay from '@/components/IRSpectrumDisplay.vue'
  import MassSpectrumDisplay from '@/components/MassSpectrumDisplay.vue'
  import NMRSpectrumDisplay from '@/components/NMRSpectrumDisplay.vue'
  import StoredPDFDisplay from '@/components/StoredPDFDisplay.vue'
  import SynonymDisambiguation from '@/components/SynonymDisambiguation.vue'
  import '@/styles/main.css'

  export default {
    data(){
      return {
        view_type: "none",
        disambiguation: {inchikey: false, synonym: false},
        possible_substances: [],
        selected_row_data: {},
        all_results: [],
        results: {substance: [], ms_ready: []},
        substance_info: {},
        record_counts_by_dtxsid: {},
        still_searching: true,
        no_substance_match: false,
        has_image: true,
        image_link: "",
        tooltipShowDelay: 500,
        BACKEND_LOCATION,
        COMPTOX_PAGE_URL,
        METHOD_DOCUMENT_TYPES,
        SOURCE_ABBREVIATION_MAPPING,
        result_table_view_mode: "all",
        result_count: 0,
        classification: null,
        functional_uses: null,
        record_type_counts: {method: 0, "fact sheet": 0, spectrum: 0},
        ms_ready_search_run: false,
        additional_sources: [],
        result_filters: {ms_ready: false, single_point_spectra: true, external_links: false},
        displayed_inchikey: {first_block: "", remainder: ""},
        columnDefs: [
          {field: 'methodologies', headerName: 'Methodology', sortable: true, sort: 'asc', filter: 'agTextColumnFilter', floatingFilter: true, width: 140, suppressSizeToFit: true},
          {field: 'source', headerName: 'Source', sortable: true, width: 110, suppressSizeToFit: true, filter: 'agTextColumnFilter', floatingFilter: true, cellRenderer: params => {
              if (params.data.link === null) {
                return params.data.source
              } else if (this.SOURCE_ABBREVIATION_MAPPING[params.data.source] && this.SOURCE_ABBREVIATION_MAPPING[params.data.source].full_name) {
                return "<a href='" + params.data.link + "' target='_blank' class='has-hover-text'>" + params.data.source + "</a>";
              } else {
                return "<a href='" + params.data.link + "' target='_blank'>" + params.data.source + "</a>";
              }
            }, tooltipValueGetter: params => {
              return sourceAbbreviationTooltip(params.data.source)
            }
          },
          {field: 'record_type', headerName: 'Record Type', width: 110, suppressSizeToFit: true,
            cellRenderer: params => {
              if (params.data.data_type !== null) {
                return "<span class='fake-link'>" + params.data.record_type + "</span>"
              } else {
                return "<a href='" + params.data.link + "' target='_blank'>" + params.data.record_type + " Link</a>"
              }
            }
          },
          {field: 'method_number', headerName: 'Method #', width: 110, suppressSizeToFit: true, hide: true, filter: 'agTextColumnFilter', floatingFilter: true},
          {field: 'method_type', headerName: 'Method Type', width: 120, suppressSizeToFit: true, hide: true, filter: 'agTextColumnFilter', floatingFilter: true, tooltipValueGetter: params => {
              if (this.METHOD_DOCUMENT_TYPES[params.data.method_type]) {
                return this.METHOD_DOCUMENT_TYPES[params.data.method_type]
              }
            }, cellClass: params => {
              if (this.METHOD_DOCUMENT_TYPES[params.data.method_type]) {
                return "has-hover-text"
              }
            }
          },
          {field: 'count', headerName: '# Substances', width: 90, suppressSizeToFit: true, sortable: true, filter: 'agNumberColumnFilter', floatingFilter: true, headerTooltip: "Number of substances in record."},
          {field: 'spectrum_rating', headerName: "Rating", width: 80, suppressSizeToFit: true, hide: true, filter: 'agTextColumnFilter'},
          {field: 'description', headerName: 'Information', sortable: true, flex: 1, filter: 'agTextColumnFilter', floatingFilter: true, cellRenderer: params =>{
              if (params.data.description === null) {
                return "No description available."
              } else {
                return params.data.description
              }
            }, tooltipValueGetter: params => {
              if (params.data.description === null) {
                return "No description available."
              } else {
                return params.data.description
              }
            }
          },
          {field: 'link', headerName: 'Link', hide: true}
        ]
      };
    },
    methods: {
      onGridReady(params) {
        this.gridApi = params.api
        this.gridColumnApi = params.columnApi
        
        // Sometimes we might want to pre-select a row when the all_results load; this logic takes care of it
        if (typeof(this.$route.query.initial_row_selected) === "string") {
          this.gridApi.forEachNode(node => {
            if (node.data.internal_id === this.$route.query.initial_row_selected) {
              node.setSelected(true)
              // need to run this manually, even though the documentation says setSelected should trigger onRowSelected
              this.onRowSelected({event: true, data: node.data})
            }
          })
        }

        if (typeof(this.$route.query.initial_results_tab) === "string") {
          this.updateTab(this.$route.query.initial_results_tab) 
        }
        this.gridApi.onFilterChanged()   //regenerates the table with the filter settings
        this.gridApi.sizeColumnsToFit()
        this.updateRecordCounts()
      },
      onRowSelected(event) {
        // Row selection creates two events -- one for the selection, one for the deselection.  Only
        // the former has an "event" field inside it, so rely on that to filter the deselection
        // event out.
        if (event.event){
          this.view_type = event.data.data_type
          if (event.data.data_type !== null){
            this.selected_row_data = event.data
          }
        }
      },
      downloadResultsAsExcel() {
        this.gridApi.exportDataAsExcel({
          columnKeys: ["methodology", "source", "link", "record_type", "description"],
          fileName: this.$route.params.search_term + "_results.xlsx",
          processCellCallback: cell => {
            // If a link is missing for a record, have it link back to the search page, with the record preselected
            if ((cell.column.colId === "link") & (cell.value === null)){
              return `${window.location.origin}/search/${this.$route.params.search_term}?initial_row_selected=${cell.node.data.internal_id}`
            } else {
              return cell.value
            }
          }
        });
      },
      isExternalFilterPresent() {
        return true
      },
      doesExternalFilterPass(node) {
        const pass_checkbox_filters = this.checkboxFilter(node)
        if (!pass_checkbox_filters) {
          return false
        }

        // filter out result types based on selected tab
        if (this.result_table_view_mode != "all") {
          return node.data.record_type.toLowerCase() == this.result_table_view_mode
        }

        return true
      },
      checkboxFilter(node) {
        if (!this.result_filters.single_point_spectra) {
          if (node.data.description && (node.data.description.includes("# PEAKS=1;") | node.data.description.endsWith("# PEAKS=1"))) {
            return false
          }
        }

        if (!this.result_filters.external_links && (!node.data.data_type)) {
          return false
        }

        if (node.data.ms_ready && !this.result_filters.ms_ready) {
          return false
        }

        return true
      },
      async updateCheckboxFilters() {
        if (this.result_filters.ms_ready && (this.ms_ready_search_run == false)) {
          await this.retrieve_ms_ready_methods()
          this.ms_ready_search_run = true
        }
        this.gridApi.onFilterChanged()
        this.updateRecordCounts()
      },
      updateRecordCounts() {
        var filtered_result_count = {method: 0, "fact sheet": 0, spectrum: 0}
        this.gridApi.forEachNode((rowNode, index) => {
          if (this.checkboxFilter(rowNode)){
            filtered_result_count[rowNode.data.record_type.toLowerCase()] += 1
          }
        })
        this.record_type_counts = filtered_result_count
        this.result_count = filtered_result_count["method"] + filtered_result_count["fact sheet"] + filtered_result_count["spectrum"]
      },
      updateTab(tabName) {
        this.result_table_view_mode = tabName
        if (tabName === "fact sheet"){
          this.gridColumnApi.setColumnsVisible(['count'], true)
          this.gridColumnApi.setColumnsVisible(['method_number', 'method_type', 'methodologies', 'record_type', 'spectrum_rating'], false)
          this.gridColumnApi.applyColumnState({state: [{colId: 'count', sort: 'asc'}]})
        } else if (tabName === "spectrum") {
          this.gridColumnApi.setColumnsVisible(['methodologies', 'spectrum_rating'], true)
          this.gridColumnApi.setColumnsVisible(['count', 'method_number', 'method_type', 'record_type'], false)
          this.gridColumnApi.applyColumnState({state: [{colId: 'count', sort: null}]})
        } else if (tabName === "method") {
          this.gridColumnApi.setColumnsVisible(['count', 'method_number', 'method_type', 'methodologies'], true)
          this.gridColumnApi.setColumnsVisible(['record_type', 'spectrum_rating'], false)
          this.gridColumnApi.applyColumnState({state: [{colId: 'count', sort: 'asc'}]})
          if (this.record_type_counts.method == 0) {
            this.gridApi.value.showLoadingOverlay()
          }
        } else {
          // "All" case
          this.gridColumnApi.setColumnsVisible(['count', 'methodologies', 'record_type'], true)
          this.gridColumnApi.setColumnsVisible(['method_number', 'method_type', 'spectrum_rating'], false)
          this.gridColumnApi.applyColumnState({state: [{colId: 'count', sort: null}]})
        }
        this.gridApi.onFilterChanged()
        this.gridApi.sizeColumnsToFit()
      },
      determineTabBarClass(tab_label) {
        if (this.record_type_counts[tab_label] == 0) {
          return "disabled"
        } else if (this.result_table_view_mode == tab_label) {
          return "active"
        } else {
          return ""
        }
      },
      disambiguate(dtxsid) {
        this.$router.push(`/search/${dtxsid}`)
      },
      postSortRows(params) {
        // Any node with a missing (null-valued) description will get booted to the end of the sorted list.
        let rowNodes = params.nodes
        let i = 0
        let n_elements = rowNodes.length
        while (i < n_elements) {
          const description = rowNodes[i].data.description
          if (description === null) {
            rowNodes.splice(rowNodes.length, 0, rowNodes.splice(i,1)[0])
            n_elements--
          } else {
            i++
          }
        }
      },
      async ms_ready_toggle() {
        if (this.result_filters.ms_ready) {
          if (this.ms_ready_search_run == false) {
            const response = await axios.get(`${this.BACKEND_LOCATION}/get_ms_ready_methods/${this.substance_info.jchem_inchikey}`)
            const main_ids = this.results.substance.map(x => x.internal_id)
            this.results.ms_ready = response.data.results.filter(x => !main_ids.includes(x.internal_id))
            this.ms_ready_search_run = true
          }
          this.all_results = this.results.substance.concat(this.results.ms_ready)
          this.record_type_counts.method = this.record_type_counts.method + this.results.ms_ready.length
        }
        else {
          this.all_results = this.results.substance
          this.record_type_counts.method = this.record_type_counts.method - this.results.ms_ready.length
        }
      },
      async retrieve_ms_ready_methods() {
        const response = await axios.get(`${this.BACKEND_LOCATION}/get_ms_ready_methods/${this.substance_info.jchem_inchikey}`)
        const main_ids = this.results.substance.map(x => x.internal_id)
        this.results.ms_ready = response.data.results.filter(x => !main_ids.includes(x.internal_id))
        this.all_results = this.results.substance.concat(this.results.ms_ready)
      },
      copyToClipboard(text) {
        // NOTE: the preferred way to copy to clipboard is apparently "navigator.clipboard.writeText()" these days. I
        // can't get that to work in this app, though, since it apparently requires a secured connection and the
        // deployed version of this app doesn't have that.  So I'm sticking to this technically-depricated solution that
        // I pulled out of CompTox's code, since it apparently works there.
        const textarea = document.createElement('textarea')
        textarea.value = text
        document.body.appendChild(textarea)
        textarea.select()
        try {
          document.execCommand('copy')
        } catch (err) {
          console.log('Cannot copy: ' + err)
        }
        document.body.removeChild(textarea)
      }
    },
    async created() {
      // Start by trying to get the DTXSID for the search term.
      const response = await axios.get(`${this.BACKEND_LOCATION}/get_substances_for_search_term/${this.$route.params.search_term}`)
      // There are three possibilities: no search term found, search term found, search term is ambiguous (matches
      // multiple substances by synonym or first block of InChIKey).
      if (response.data.substances === null) {
        // No substance found.
        this.no_substance_match = true
        this.still_searching = false
      } else if (response.data.ambiguity) {
        // Search term is ambiguous.
        const ambiguity_type = response.data.ambiguity
        this.possible_substances = response.data.substances
        const dtxsids = this.possible_substances.map(ps => ps.dtxsid)
        this.record_counts_by_dtxsid = await axios.post(`${this.BACKEND_LOCATION}/record_counts_by_dtxsid/`, {dtxsids: dtxsids})
        this.record_counts_by_dtxsid = this.record_counts_by_dtxsid.data
        if (ambiguity_type == "inchikey") {
          this.disambiguation.inchikey = true
        } else if (ambiguity_type == "synonym") {
          this.disambiguation.synonym = true
        }
      } else {
        // Search term matches one substance.
        const search_results = await axios.get(`${this.BACKEND_LOCATION}/search/${response.data.substances.dtxsid}`)
        const additional_source_results = await axios.get(`${this.BACKEND_LOCATION}/additional_sources_for_substance/${response.data.substances.dtxsid}`)
        const classyfire = await axios.get(`${this.BACKEND_LOCATION}/get_classification_for_dtxsid/${response.data.substances.dtxsid}`)
        if ((classyfire.status == 200) & (classyfire.data.kingdom !== null)) {
          this.classification = classyfire.data
        }
        const functional_use_response = await axios.get(`${this.BACKEND_LOCATION}/functional_uses_for_dtxsid/${response.data.substances.dtxsid}`)
        if (functional_use_response.data.functional_classes !== null) {
          this.functional_uses = functional_use_response.data.functional_classes.join(", ")
        } else {
          this.functional_uses = null
        }
        this.additional_sources = additional_source_results.data
        this.all_results = search_results.data.records
        this.results.substance = search_results.data.records
        this.substance_info = response.data.substances
        this.record_type_counts = search_results.data.record_type_counts
        this.image_link = imageLinkForSubstance(this.substance_info.dtxsid, this.substance_info.image_in_comptox)
        this.still_searching = false

        const inchikey = this.substance_info.indigo_inchikey ? this.substance_info.indigo_inchikey : this.substance_info.jchem_inchikey
        if (inchikey) {
          this.displayed_inchikey.first_block = inchikey.slice(0,14)
          this.displayed_inchikey.remainder = inchikey.slice(14)
        }
        
        // if no non-external links are available, then show the externally linked records by default
        if (!this.all_results.some(x => {return x.data_type})) {
          this.result_filters.external_links = true
        }
      }
    },
    components: {
      AgGridVue,
      BModal,
      ClassyFireDisplay,
      HelpIcon,
      InchikeyDisambiguation,
      IRSpectrumDisplay,
      MassSpectrumDisplay,
      NMRSpectrumDisplay,
      StoredPDFDisplay,
      SynonymDisambiguation
    }
  }
</script>

<style>
  .info-paragraph {
    text-align: center;
    font-size: 20px;
  }

  .has-hover-text {
    text-decoration: underline dashed;
  }

  h1 {
    font-size: 2em;
  }

  .copy-button {
    padding: 0px 5px 0px 0px;
    border: none;
    background: none;
  }
</style>