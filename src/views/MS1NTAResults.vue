<!--
  This page is for allowing the download of results from an MS1 NTA job.  The job submission page will redirect to this
  page once a job ID has been determined.  This page can also be reloaded later on, in order to re-download the results
  of a job completed days or months ago.

  It takes one URL parameter -- the job ID -- and no query parameters.

  Successful job to test: VGPFO4KJ
-->

<template>
  <h4>Status of job {{ $route.params.job_id }}</h4>
  <p>To access these results later, you can copy <router-link :to="`/ms1_nta/results/${$route.params.job_id}`" target="_blank">this link</router-link> to navigate back to this page.</p>
  <div v-if="status.job == 'Not found'">
    Job is either in progress or job ID does not exist.  If you were redirected to this page from the submission form, please wait, as running the job can take a while.
  </div>
  <div v-else-if="status.job == 'Processing'">
    Job is in progress.
  </div>
  <div v-else-if="status.job == 'Completed'">
    <p>Job completed successfully.</p>
    <p>Job start time: {{ job_start_time }}</p>
    <p>Use the buttons below to download the results or to load the results into the browser for use with visualizations.  Result files are stored in a zip file that may be several megabytes in size; downloading the file may take a moment.</p>
    <div>
      <button @click="loadResultsFile($route.params.job_id)">Load Results</button>
      <button @click="downloadResults($route.params.job_id)">Download Results File (ZIP)</button>
    </div>
  </div>
  <div v-else>
    <p>Job did not complete successfully.</p>
    <p>Job start time: {{ job_start_time }}</p>
    <p>Status: {{ status.job }}</p>
    <p>Additional information: {{ error_info }}</p>
  </div>
  <div v-if="status.retrieving_file">
    Results file is being retrieved -- files may be large, so this may take a moment...
  </div>
  <div v-if="status.file_retrieved">
    <div>
      <p>Select visualization to view:</p>
      <label><input type="radio" v-model="current_visualization" value="cv" @click="loadCVScatterplot">CV Scatterplot</label>
    </div>
    <div v-if="current_visualization=='cv'">
      <img :src="scatterplot_image_blob" />
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import * as JSZip from 'jszip'

  export default {
    data() {
      return {
        job_start_time: "",
        error_info: "",
        scatterplot_image_blob: null,
        zip_blob: null,
        excel_blob: null,
        current_visualization: "none",
        status: {job: "Not found", retrieving_file: false, file_retrieved: false}
      }
    },
    async created() {
      const timerFunc = (t) => new Promise(resolve => setTimeout(resolve, t))

      const status_url = "https://qed-dev.edap-cluster.com/nta/ms1/status/" + this.$route.params.job_id
      var response = await axios.get(status_url)
      while ((response.data.status == "Processing") || (response.data.status == "Not found")){
        console.log("Checking...")
        await timerFunc(5000)
        response = await axios.get(status_url)
      }
      
      this.job_start_time = response.data.start_time
      this.status.job = response.data.status
      this.error_info = response.data.error_info
    },
    methods: {
      async loadResultsFile(job_id) {
        this.status.retrieving_file = true
        const res = await axios.get("https://qed-dev.edap-cluster.com/nta/ms1/results/toxpi/" + job_id, {responseType: "blob"})
        this.zip_blob = res.data
        this.status.file_retrieved = true
        this.status.retrieving_file = false
      },
      async downloadResults(job_id) {
        if (!this.status.file_retrieved) {
          await this.loadResultsFile(job_id)
        }
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(this.zip_blob)
        link.download = `${job_id}.zip`
        link.click()

        // extract the Excel workbook that holds the results
        /* const zip = new JSZip()
        const zip_content = await zip.loadAsync(blob)
        const xlsx_filename = zip_content.file(/xlsx/)[0].name
        this.excel_blob = await zip_content.file(xlsx_filename).async("blob")

        let link2 = document.createElement('a')
        link2.href = window.URL.createObjectURL(this.excel_blob)
        link2.download = "excel_text.xlsx"
        link2.click() */
      },
      async loadCVScatterplot() {
        const zip = new JSZip()
        const zip_content = await zip.loadAsync(this.zip_blob)
        const scatterplot_filename = zip_content.file(/cv_scatterplot/)[0].name
        const scatterplot_blob = await zip_content.file(scatterplot_filename).async("blob")
        const urlCreator = window.URL || window.webkitURL
        this.scatterplot_image_blob = urlCreator.createObjectURL(scatterplot_blob)
      }
    }
  }
</script>