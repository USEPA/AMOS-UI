<template>
  <p>This page allows for batch searching of compounds by DTXSID.  DTXSIDs must be separated in the text field below by newlines.  If you have a list of compounds not identified by DTXSIDs, you can go <a href="https://comptox.epa.gov/dashboard/batch-search">here</a> to retrieve them.</p>
  <p>The results returned from this search are essentially the same ones that are returned on the compound search page.  A CSV will automatically attempt to download once the results have been retrieved from the database.</p>
  <div class="batch-search-controls">
    <textarea type="text" class="batch-search-input" rows="10" columns="25" v-model="search_box"></textarea>
    <button @click="batch_search()" class="batch-search-button">Search</button>
  </div>
  <b-alert variant="warning" dismissible v-model="status_boxes.show_empty_box_error">No compounds were entered in the text box.</b-alert>
  <b-alert variant="warning" dismissible v-model="status_boxes.show_no_results_error">No results were found for the compound(s) searched.</b-alert>
</template>

<script>
  import axios from 'axios'
  import { BACKEND_LOCATION } from '@/assets/store'

  export default {
    data() {
      return {
        batch_search_params: {},
        search_box: "",
        csv_string: "",
        status_boxes: {
          show_empty_box_error: false,
          show_no_results_error: false
        },
        BACKEND_LOCATION
      }
    },
    methods: {
      async batch_search() {
        this.status_boxes.show_empty_box_error = false
        this.status_boxes.show_no_results_error = false
        if(this.search_box != ""){
          const search_terms = this.search_box.split("\n")
          const response = await axios.post(`${this.BACKEND_LOCATION}/batch_search`, {dtxsids: search_terms})
          console.log(response.data.csv_string)
          if (response.data.csv_string != "") {
            const anchor = document.createElement('a')
            anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(response.data.csv_string);
            anchor.target = '_blank';
            anchor.download = 'batch_search.csv';
            anchor.click();
          } else {
            this.status_boxes.show_no_results_error = true
          }
          
        } else {
          this.status_boxes.show_empty_box_error = true
        }
      }
    }
  }
</script>

<style>
  .batch-search-input {
    height: 150px;
  }

  .batch-search-button {
    width: 150px;
    margin: auto;
    text-align: center;
  }

  .batch-search-controls {
    height: 200px;
    width: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>