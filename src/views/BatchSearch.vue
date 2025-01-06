<!--
  This page is used for batch searching substances by DTXSID -- and only by DTXSID -- and returning information on the
  records in an Excel workbook.

  There are no URL route or query parameters associated with this page.
-->

<template>
  <p>
    This page allows for batch searching of information on substances by DTXSID.  DTXSIDs must be 
    separated in the text field below by newlines.  An Excel workbook will automatically attempt to
    download once the results have been retrieved from the database; the file contains information
    on the records, including links to their original sources, but does not contain the actual
    records themselves.
  </p>
  <p>If you have a list of substances with identifiers other than DTXSIDs, you can go <a href="https://comptox.epa.gov/dashboard/batch-search">here</a> to translate them to DTXSIDs.</p>
  <p>Note: if two or more searched DTXSIDs are present in the same record (e.g., if you're searching for multiple similar substances, and a method happens to cover more than one of them), that record will appear once for every searched DTXSID that appears in it.</p>
  <div style="display: flex; margin-top: 40px">
    <div class="batch-search-controls">
      <h5>DTXSID List</h5>
      <textarea type="text" class="batch-search-input" rows="10" columns="25" v-model="search_box"></textarea>
      <button @click="batch_search()" class="batch-search-button">Search</button>
    </div>
    <div class="batch-search-options" style="display: block">
      <h5>Search Options</h5>
      <div style="display: flex">
        <div class="option-sets">
          <strong>Record Types</strong>
          <br />
          <input type="checkbox" id="include-fact-sheets" v-model="record_types['Fact Sheet']" checked  :disabled="record_types.AnalyticalQCOnly">
          <label for="include-fact-sheets">Fact Sheets</label>
          <br />
          <input type="checkbox" id="include-methods" v-model="record_types.Method" checked :disabled="record_types.AnalyticalQCOnly">
          <label for="include-methods">Methods</label>
          <br />
          <input type="checkbox" id="include-spectra" v-model="record_types.Spectrum" checked :disabled="record_types.AnalyticalQCOnly">
          <label for="include-spectra">Spectra</label>
          <br />
          <br />
          <input type="checkbox" id="analytical-qc-only" v-model="record_types.AnalyticalQCOnly">
          <label for="analytical-qc-only">Analytical QC only</label>
        </div>
        <div class="option-sets">
          <strong>Methodologies</strong>
          <br />
          <input type="checkbox" id="methodologies-all" v-model="methodologies.all" checked>
          <label for="methodologies-all">All</label>
          <br />
          <input type="checkbox" id="methodologies-gcms" v-model="methodologies['GC/MS']" checked :disabled="methodologies.all">
          <label for="methodologies-gcms">GC/MS</label>
          <br />
          <input type="checkbox" id="methodologies-lcms" v-model="methodologies['LC/MS']" checked :disabled="methodologies.all">
          <label for="methodologies-lcms">LC/MS</label>
          <br />
          <input type="checkbox" id="methodologies-nmr" v-model="methodologies.NMR" checked :disabled="methodologies.all">
          <label for="methodologies-nmr">NMR</label>
        </div>
        <div class="option-sets">
          <strong>Substance Info</strong>
          <br />
          <input type="checkbox" id="include-classyfire" v-model="include_classyfire">
          <label for="include-classyfire"><span class="has-hover-text" title="Includes the top four levels of ClassyFire classifications with the substance information.">Include ClassyFire</span></label>
          <br />
          <input type="checkbox" id="include-source-counts" v-model="include_source_counts">
          <label for="include-source-counts"><span class="has-hover-text" title="Counts of the number of times a substance appears in sources not stored in AMOS.">Include source counts</span></label>
        </div>
        <div class="option-sets">
          <strong>Record Info</strong>
          <br />
          <input type="checkbox" id="record-info-ms-all" v-model="record_info.ms.all">
          <label for="record-info-ms-all"><span>All mass spectrum fields</span></label>
          <br />
          <input type="checkbox" id="record-info-ms-pos-neg" class="indented-checkbox" v-model="record_info.ms.rating" :disabled="record_info.ms.all">
          <label for="record-info-ms-pos-neg"><span>"Clean"/"Noisy" rating</span></label>
          <br />
          <input type="checkbox" id="record-info-ms-ion-mode" class="indented-checkbox" v-model="record_info.ms.ionization_mode" :disabled="record_info.ms.all">
          <label for="record-info-ms-ion-mode"><span>Ionization mode</span></label>
          <br />
          <input type="checkbox" id="record-info-ms-peak-count" class="indented-checkbox" v-model="record_info.ms.num_peaks" :disabled="record_info.ms.all">
          <label for="record-info-ms-peak-count"><span>Peak count</span></label>
          <br />
          <input type="checkbox" id="record-info-ms-spectral-entropy" class="indented-checkbox" v-model="record_info.ms.spectral_entropy" :disabled="record_info.ms.all">
          <label for="record-info-ms-spectral-entropy"><span>Spectral entropy</span></label>
        </div>
        <div class="option-sets">
          <strong>Other</strong>
          <br />
          <input type="checkbox" id="include-external-links" v-model="include_external_links" checked>
          <label for="include-external-links"><span class="has-hover-text" title="For some sources, AMOS only contains external links to data instead of the actual data.  These other sources may require logins or other information to access their data.">Include externally linked records</span></label>
          <br />
          <!-- <input type="checkbox" id="include-analyticalqc" v-model="include_analyticalqc">
          <label for="include-analyticalqc"><span class="has-hover-text" title="Some additional, project-specific information exists for records from Analytical QC.">Include additional Analytical QC info</span></label> -->
        </div>
      </div>
      <br />
      <div>
        <button @click="mass_select(true)" class="batch-search-button">Select All</button>
        <button @click="mass_select(false)" class="batch-search-button">Deselect All</button>
      </div>
    </div>
  </div>
  <BAlert variant="warning" dismissible v-model="status_boxes.show_empty_box_error">No substances were entered in the text box.</BAlert>
  <BAlert variant="warning" dismissible v-model="status_boxes.no_records_found">No records were found for the searched substances.</BAlert>
</template>

<script>
  import axios from 'axios'

  import { BAlert } from 'bootstrap-vue-next'

  import { timestampForFile } from '@/assets/common_functions'
  import { BACKEND_LOCATION } from '@/assets/store'
  import '@/assets/style.css'

  export default {
    data() {
      return {
        batch_search_params: {},
        include_classyfire: true,
        include_external_links: true,
        include_analyticalqc: false,
        include_source_counts: true,
        search_box: "",
        status_boxes: {
          show_empty_box_error: false,
          no_records_found: false
        },
        record_types: {"Fact Sheet": true, "Method": true, "Spectrum": true, "AnalyticalQCOnly": false},
        methodologies: {all: true, "GC/MS": true, "LC/MS": true, "NMR": true},
        record_info: {
          ms: {all: false, ionization_mode: false, rating: false, spectral_entropy: false, num_peaks: false}
        },
        BACKEND_LOCATION
      }
    },
    created() {
      const query_params = Object.keys(this.$route.query)
      if (query_params.includes("dtxsids")) {
        const dtxsid_list = this.$route.query.dtxsids.split(";")
        this.search_box = dtxsid_list.join("\n")
      }
    },
    methods: {
      async batch_search() {
        this.status_boxes.show_empty_box_error = false
        this.status_boxes.no_records_found = false
        if(this.search_box != ""){
          const search_terms = this.search_box.split("\n")
          const parameters = {
            additional_record_info: this.record_info,
            base_url: window.location.origin,
            dtxsids: search_terms,
            include_analyticalqc: this.include_analyticalqc,
            include_classyfire: this.include_classyfire,
            include_external_links: this.include_external_links,
            include_source_counts: this.include_source_counts,
            methodologies: this.methodologies,
            record_types: this.record_types
          }
          var endpoint = ""
          var filename = ""
          if (this.record_types.AnalyticalQCOnly == true) {
            endpoint = `${this.BACKEND_LOCATION}/analytical_qc_batch_search`
            filename = `analytical_qc_batch_search_${timestampForFile()}.xlsx`
          } else {
            endpoint = `${this.BACKEND_LOCATION}/batch_search`
            filename = `batch_search_${timestampForFile()}.xlsx`
          }
          await axios.post(endpoint, parameters, {responseType: "blob"}).then(res => {
            if (res.status == 204) {
              this.status_boxes.no_records_found = true
            } else {
              let blob = new Blob([res.data], {type: res.headers['content-type']})
              let link = document.createElement('a')
              link.href = window.URL.createObjectURL(blob)
              link.download = filename
              link.click()
            }
          })
          
        } else {
          this.status_boxes.show_empty_box_error = true
        }
      },
      mass_select(state) {
        this.include_classyfire = state
        this.include_external_links = state
        this.include_analyticalqc = state
        this.record_types = {"Fact Sheet": state, "Method": state, "Spectrum": state, "AnalyticalQCOnly": false}
        this.methodologies = {all: state, "GC/MS": state, "LC/MS": state, "NMR": state}
      }
    },
    components: {BAlert}
  }
</script>

<style>
  .batch-search-input {
    height: 200px;
  }

  .batch-search-button {
    width: 150px;
    margin: auto;
    text-align: center;
  }

  .batch-search-controls {
    height: 280px;
    width: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .batch-search-options {
    margin-left: 100px
  }

  .option-sets {
    margin-right: 50px
  }

  .indented-checkbox {
    margin-left: 12px
  }
</style>