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
  <div v-if="status == 'Not found'">
    Job is either in progress or job ID does not exist.  If you were redirected to this page from the submission form, please wait, as running the job can take a while.
  </div>
  <div v-else-if="status == 'Processing'">
    Job is in progress.
  </div>
  <div v-else-if="status == 'Completed'">
    <p>Job completed successfully.</p>
    <p>Job start time: {{ job_start_time }}</p>
    <p>Use the button below to download the results.  Result files are stored in a zip file that may be several megabytes in size; downloading the file may take a moment.</p>
    <button @click="downloadResults($route.params.job_id)">Download Results</button>
  </div>
  <div v-else>
    <p>Job did not complete successfully.</p>
    <p>Job start time: {{ job_start_time }}</p>
    <p>Status: {{ status }}</p>
    <p>Additional information: {{ error_info }}</p>
  </div>
</template>

<script>
  import axios from 'axios'
  import * as JSZip from 'jszip'

  export default {
    data() {
      return {
        job_start_time: "",
        status: "Not found",
        error_info: "",
        excel_blob: null
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
      this.status = response.data.status
      this.error_info = response.data.error_info
    },
    methods: {
      async downloadResults(job_id) {
        const res = await axios.get("https://qed-dev.edap-cluster.com/nta/ms1/results/toxpi/" + job_id, {responseType: "blob"})
        
        let blob = new Blob([res.data], {type: res.headers['content-type']})
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = `${this.$route.params.job_id}.zip`
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
      }
    }
  }
</script>