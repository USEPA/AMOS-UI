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
  <div v-if="status.job === 'Not found'">
    Job is either in progress or job ID does not exist.  If you were redirected to this page from the submission form, please wait, as running the job can take a while and it may be a few minutes before a status can be retrieved.
  </div>
  <div v-else-if="status.job === 'Processing'">
    Job is in progress.
  </div>
  <div v-else-if="status.job === 'Completed'">
    <p>Job completed successfully.</p>
    <p>Job start time: {{ job_start_time }}</p>
    <p>Use the buttons below to download the results or to load the results into the browser for use with visualizations.  Result files are stored in a zip file that may be tens of megabytes in size; downloading the file may take a moment.</p>
    <p>NOTE: Due to temporary issues, the "Load Results" and "Download Results File" buttons may not work and visualizations may be inaccessible.  Use the "Only Download" button to retrieve the file instead.</p>
    <div>
      <button @click="loadResultsFile($route.params.job_id)">Load Results</button>
      <button @click="downloadResults($route.params.job_id)">Download Results File (ZIP)</button>
      <button @click="downloadOnly($route.params.job_id)">Only Download (Temporary)</button>
    </div>
  </div>
  <div v-else-if="status.job == 'Error'">
    <p>There was an error in retrieving job information.</p>
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
      <label style="padding: 5px;"><input type="radio" v-model="selected_visualization" value="cv_scatterplot" @click="loadCVScatterplot">CV Scatterplot</label>
      <label style="padding: 5px;"><input type="radio" v-model="selected_visualization" value="decision_tree" @click="loadDecisionTree">Decision Tree</label>
      <label style="padding: 5px;"><input type="radio" v-model="selected_visualization" value="occurrence_heatmap" @click="loadOccurrenceHeatmap">Occurrence Heatmap</label>
      <label style="padding: 5px;"><input type="radio" v-model="selected_visualization" value="run_sequence_plots" @click="loadRunSequencePlots" :disabled="!has_run_sequence">Run Sequence Plot</label>
    </div>
    <div v-if="current_visualization=='cv_scatterplot'">
      <p v-if="status.loading_viz">Loading... <i class="mdi mdi-progress-clock mdi-spin"/></p>
      <img v-else :src="scatterplot_image_blob" />
    </div>
    <div v-else-if="current_visualization=='decision_tree'">
      <p v-if="status.loading_viz">Loading... <i class="mdi mdi-progress-clock mdi-spin"/></p>
      <DecisionTree v-else :parametersCSVString="csv_strings.parameters" :resultsCSVString="csv_strings.results" />
    </div>
    <div v-else-if="current_visualization=='occurrence_heatmap'">
      <p v-if="status.loading_viz">Loading... <i class="mdi mdi-progress-clock mdi-spin"/></p>
      <OccurrenceHeatmap v-else :workbook="excel_workbook" />
    </div>
    <div v-else-if="current_visualization=='run_sequence_plots'">
      <p v-if="status.loading_viz">Loading... <i class="mdi mdi-progress-clock mdi-spin"/></p>
      <RunSequencePlot v-else :workbook="excel_workbook" />
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import * as JSZip from 'jszip'
  import * as XLSX from 'xlsx'

  import DecisionTree from '@/components/DecisionTree.vue'
  import OccurrenceHeatmap from '@/components/OccurrenceHeatmap.vue'
  import RunSequencePlot from '@/components/RunSequencePlot.vue'
  import '@mdi/font/css/materialdesignicons.min.css';

  export default {
    data() {
      return {
        job_start_time: "",
        error_info: "",
        scatterplot_image_blob: null,
        zip_blob: null,
        selected_visualization: "none",
        current_visualization: "none",
        status: {job: "Not found", retrieving_file: false, file_retrieved: false, loading_viz: false},
        csv_strings: {parameters: "", results: ""},
        excel_workbook: null,
        has_run_sequence: false
      }
    },
    async created() {
      const timerFunc = (t) => new Promise(resolve => setTimeout(resolve, t))

      const status_url = "https://qed-dev.edap-cluster.com/nta/ms1/status/" + this.$route.params.job_id
      var response = await axios.get(status_url).catch((e) => {
        this.status.job = "Error"
        return
      })
      if (this.status.job == "Error") {
        return
      }
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

        const excel_array = await this.extractFileFromWorkbook(/xlsx/, "arrayBuffer")
        const workbook = XLSX.read(excel_array)
        if (workbook.SheetNames.includes("Run Sequence (pos)") || workbook.SheetNames.includes("Run Sequence (neg)")) {
          this.has_run_sequence = true
        }

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
      },
      async downloadOnly(job_id) {
        const res = await axios.get("https://qed-dev.edap-cluster.com/nta/ms1/api/output/" + job_id, {responseType: "blob", headers: {'x-api-key': 'tSCcCm8uzP4CVWm_Eshpx8DqBrhBS1xuGik1t9HD0X0'}})
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(res.data)
        link.download = `${job_id}.zip`
        link.click()
      },
      async extractFileFromWorkbook(file_regex, file_type="blob") {
        const zip = new JSZip()
        const zip_content = await zip.loadAsync(this.zip_blob)
        const target_filename = zip_content.file(file_regex)[0].name
        const target_file = await zip_content.file(target_filename).async(file_type)
        return target_file
      },
      async loadCVScatterplot() {
        this.status.loading_viz = true
        this.current_visualization = "cv_scatterplot"
        const scatterplot_blob = await this.extractFileFromWorkbook(/cv_scatterplot/)
        const urlCreator = window.URL || window.webkitURL
        this.scatterplot_image_blob = urlCreator.createObjectURL(scatterplot_blob)
        this.status.loading_viz = false
      },
      async loadDecisionTree() {
        this.status.loading_viz = true
        this.current_visualization = "decision_tree"
        const excel_array = await this.extractFileFromWorkbook(/xlsx/, "arrayBuffer")
        const workbook = XLSX.read(excel_array)

        const worksheet_names = workbook.SheetNames
        let target_worksheet = null
        if (!worksheet_names.includes("All Detection Statistics (Pos)")) {
          target_worksheet = workbook.Sheets["All Detection Statistics (Neg)"]
        } else if (!worksheet_names.includes("All Detection Statistics (Neg)")) {
          target_worksheet = workbook.Sheets["All Detection Statistics (Pos)"]
        } else {
          const positive_rows = XLSX.utils.sheet_to_json(workbook.Sheets["All Detection Statistics (Pos)"])
          const negative_rows = XLSX.utils.sheet_to_json(workbook.Sheets["All Detection Statistics (Neg)"])

          const all_rows = positive_rows.concat(negative_rows)
          target_worksheet = XLSX.utils.json_to_sheet(all_rows)
        }

        this.csv_strings.parameters = XLSX.utils.sheet_to_csv(workbook.Sheets["Analysis Parameters"])
        this.csv_strings.results = XLSX.utils.sheet_to_csv(target_worksheet)

        this.status.loading_viz = false
      },
      async loadOccurrenceHeatmap() {
        this.status.loading_viz = true
        this.current_visualization = "occurrence_heatmap"
        const excel_array = await this.extractFileFromWorkbook(/xlsx/, "arrayBuffer")
        this.excel_workbook = XLSX.read(excel_array)
        this.status.loading_viz = false
      },
      async loadRunSequencePlots() {
        this.status.loading_viz = true
        this.current_visualization = "run_sequence_plots"
        const excel_array = await this.extractFileFromWorkbook(/xlsx/, "arrayBuffer")
        this.excel_workbook = XLSX.read(excel_array)
        this.status.loading_viz = false
      }
    },
    components: { DecisionTree, OccurrenceHeatmap, RunSequencePlot }
  }
</script>