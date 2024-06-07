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
          <input type="checkbox" id="include-fact-sheets" v-model="record_types['Fact Sheet']" checked>
          <label for="include-fact-sheets">Fact Sheets</label>
          <br />
          <input type="checkbox" id="include-methods" v-model="record_types.Method" checked>
          <label for="include-methods">Methods</label>
          <br />
          <input type="checkbox" id="include-spectra" v-model="record_types.Spectrum" checked>
          <label for="include-spectra">Spectra</label>
          <br />
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
          <strong>Other</strong>
          <br />
          <input type="checkbox" id="include-spectrabase" v-model="include_spectrabase" checked>
          <label for="include-spectrabase"><span class="has-hover-text" title="SpectraBase contains a lot of non-MS spectra, and their data requires an account, so it may not be desirable to include these results.">Include SpectraBase</span></label>
        </div>
      </div>
    </div>
  </div>
  <b-alert variant="warning" dismissible v-model="status_boxes.show_empty_box_error">No substances were entered in the text box.</b-alert>
  <b-alert variant="warning" dismissible v-model="status_boxes.no_records_found">No records were found for the searched substances.</b-alert>
</template>

<script>
  import axios from 'axios'

  import { timestampForFile } from '@/assets/common_functions'
  import { BACKEND_LOCATION } from '@/assets/store'
  import '@/assets/style.css'

  export default {
    data() {
      return {
        batch_search_params: {},
        include_spectrabase: true,
        search_box: "",
        status_boxes: {
          show_empty_box_error: false,
          no_records_found: false
        },
        record_types: {"Fact Sheet": true, "Method": true, "Spectrum": true},
        methodologies: {all: true, "GC/MS": true, "LC/MS": true, "NMR": true},
        BACKEND_LOCATION
      }
    },
    methods: {
      async batch_search() {
        this.status_boxes.show_empty_box_error = false
        this.status_boxes.no_records_found = false
        if(this.search_box != ""){
          const search_terms = this.search_box.split("\n")
          const parameters = {
            dtxsids: search_terms,
            base_url: window.location.origin,
            include_spectrabase: this.include_spectrabase,
            record_types: this.record_types,
            methodologies: this.methodologies
          }
          await axios.post(`${this.BACKEND_LOCATION}/batch_search`, parameters, {responseType: "blob"}).then(res => {
            if (res.status == 204) {
              this.status_boxes.no_records_found = true
            } else {
              let blob = new Blob([res.data], {type: res.headers['content-type']})
              let link = document.createElement('a')
              link.href = window.URL.createObjectURL(blob)
              link.download = `batch_search_${timestampForFile()}.xlsx`
              link.click()
            }
          })
          
        } else {
          this.status_boxes.show_empty_box_error = true
        }
      }
    }
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
</style>