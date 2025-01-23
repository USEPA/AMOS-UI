<!--
  This page is an adaptation/copy of the job submission page from the NTA WebApp, designed to allow the submission of
  jobs to the NTA application's backend.

  As of this writing, the code is currently hitting some enpoints for the original NTA web application as a pseudo-API;
  a more proper API is expected to follow in the future.

  There are no URL or query parameters associated with this page.
-->

<template>
  <table class="nostripe input_table">
    <thead><tr>
      <th scope="col">Input</th><th scope="col">Value</th>
    </tr></thead>
    <tbody>
      <tr>
        <th>Project name:</th>
        <td><textarea cols="30" rows="1" v-model="project_name"></textarea></td>
      </tr>
      <tr>
        <th>Run test files only (debugging):</th>
        <td><BFormSelect v-model="run_test_files" :options="yes_no_options" size="sm" style="width: auto;"/></td>
      </tr>
      <tr>
        <th>Positive mode file (csv):</th>
        <td><input type="file" id="pos_mode_file" accept=".csv" @change="loadFile($event, 'positive_mode')" :disabled="run_test_files=='yes'"></td>
      </tr>
      <tr>
        <th>Negative mode file (csv):</th>
        <td><input type="file" id="neg_mode_file" accept=".csv" @change="loadFile($event, 'negative_mode')" :disabled="run_test_files=='yes'"></td>
      </tr>
      <tr>
        <th>Positive mode adducts:</th>
        <td>
          <div id="id_pos_adducts" class="two">
            <div><label for="pos_adduct_0"><input type="checkbox" v-model="pos_adducts" value="Na" id="pos_adduct_0">[M+Na]+</label></div>
            <div><label for="pos_adduct_1"><input type="checkbox" v-model="pos_adducts" value="K" id="pos_adduct_1">[M+K]+</label></div>
            <div><label for="pos_adduct_2"><input type="checkbox" v-model="pos_adducts" value="NH4" id="pos_adduct_2">[M+NH<sub>4</sub>]+</label></div>
          </div>
        </td>
      </tr>
      <tr>
        <th>Negative mode adducts:</th>
        <td>
          <div id="id_neg_adducts" class="two">
            <div><label for="neg_adduct_0"><input type="checkbox" v-model="neg_adducts" value="Cl" id="neg_adduct_0">[M+Cl]-</label></div>
            <div><label for="neg_adduct_1"><input type="checkbox" v-model="neg_adducts" value="Br" id="neg_adduct_1">[M+Br]-</label></div>
            <div><label for="neg_adduct_2"><input type="checkbox" v-model="neg_adducts" value="HCO2" id="neg_adduct_2">[M+HCO<sub>2</sub>]-</label></div>
            <div><label for="neg_adduct_3"><input type="checkbox" v-model="neg_adducts" value="CH3CO2" id="neg_adduct_3">[M+CH<sub>3</sub>CO<sub>2</sub>]-</label></div>
            <div><label for="neg_adduct_4"><input type="checkbox" v-model="neg_adducts" value="CF3CO2" id="neg_adduct_4">[M+CF<sub>3</sub>CO<sub>2</sub>]-</label></div>
            <div><label for="neg_adduct_5"><input type="checkbox" v-model="neg_adducts" value="FA" id="neg_adduct_5">[M+FA]-</label></div>
          </div>
        </td>
      </tr>
      <tr>
        <th>Neutral losses (both modes):</th>
        <td>
          <div id="id_neutral_losses" class="two">
            <div><label for="neutral_loss_0"><input type="checkbox" v-model="neutral_losses" value="H2O" id="neutral_loss_0">[M-H<sub>2</sub>O]</label></div>
            <div><label for="neutral_loss_1"><input type="checkbox" v-model="neutral_losses" value="2H2O" id="neutral_loss_1">[M-2H<sub>2</sub>O]</label></div>
            <div><label for="neutral_loss_2"><input type="checkbox" v-model="neutral_losses" value="3H2O" id="neutral_loss_2">[M-3H<sub>2</sub>O]</label></div>
            <div><label for="neutral_loss_3"><input type="checkbox" v-model="neutral_losses" value="4H2O" id="neutral_loss_3">[M-4H<sub>2</sub>O]</label></div>
            <div><label for="neutral_loss_4"><input type="checkbox" v-model="neutral_losses" value="5H2O" id="neutral_loss_4">[M-5H<sub>2</sub>O]</label></div>
            <div><label for="neutral_loss_5"><input type="checkbox" v-model="neutral_losses" value="NH3" id="neutral_loss_5">[M-NH<sub>3</sub>]</label></div>
            <div><label for="neutral_loss_6"><input type="checkbox" v-model="neutral_losses" value="O" id="neutral_loss_6">[M+O]</label></div>
            <div><label for="neutral_loss_7"><input type="checkbox" v-model="neutral_losses" value="CO" id="neutral_loss_7">[M-CO]</label></div>
            <div><label for="neutral_loss_8"><input type="checkbox" v-model="neutral_losses" value="CO2" id="neutral_loss_8">[M-CO<sub>2</sub>]</label></div>
            <div><label for="neutral_loss_9"><input type="checkbox" v-model="neutral_losses" value="C2H4" id="neutral_loss_9">[M-C<sub>2</sub>H<sub>4</sub>]</label></div>
            <div><label for="neutral_loss_10"><input type="checkbox" v-model="neutral_losses" value="HFA" id="neutral_loss_10">[M+HFA]</label></div>
            <div><label for="neutral_loss_11"><input type="checkbox" v-model="neutral_losses" value="HAc" id="neutral_loss_11">[M+HAc]</label></div>
            <div><label for="neutral_loss_12"><input type="checkbox" v-model="neutral_losses" value="MeOH" id="neutral_loss_12">[M+MeOH]</label></div>
            <div><label for="neutral_loss_13"><input type="checkbox" v-model="neutral_losses" value="ACN" id="neutral_loss_13">[M+ACN]</label></div>
            <div><label for="neutral_loss_14"><input type="checkbox" v-model="neutral_losses" value="IsoProp" id="neutral_loss_14">[M+IsoProp]</label></div>
          </div>
        </td>
      </tr>
      <tr>
        <th>Adduct / duplicate mass accuracy units:</th>
        <td><BFormSelect v-model="mass_accuracy_units" :options="mass_unit_options" size="sm" style="width: auto;"/></td>
      </tr>
      <tr>
        <th>Adduct / duplicate mass accuracy:</th>
        <td><input type="number" step="any" v-model="mass_accuracy"></td>
      </tr>
      <tr>
        <th>Adduct / duplicate retention time accuracy (mins):</th>
        <td><input type="number" step="0.01" v-model="retention_time_accuracy"></td>
      </tr>
      <tr>
        <th>Run sequence positive mode file (csv; optional):</th>
        <td><input type="file" id="run_sequence_pos_file" accept=".csv" @change="loadFile($event, 'run_sequence_positive')" :disabled="run_test_files=='yes'"></td>
      </tr>
      <tr>
        <th>Run sequence negative mode file (csv; optional):</th>
        <td><input type="file" id="run_sequence_neg_file" accept=".csv" @change="loadFile($event, 'run_sequence_negative')" :disabled="run_test_files=='yes'"></td>
      </tr>
      <tr>
        <th>Tracer file (csv; optional):</th>
        <td><input type="file" id="tracer_file" accept=".csv" @change="loadFile($event, 'tracer')" :disabled="run_test_files=='yes'"></td>
      </tr>
      <tr>
        <th>Tracer mass accuracy units:</th>
        <td><BFormSelect v-model="tracer_mass_accuracy_units" :options="mass_unit_options" size="sm" style="width: auto;"/></td>
      </tr>
      <tr>
        <th>Tracer mass accuracy:</th>
        <td><input type="number" step="any" v-model="tracer_mass_accuracy"></td>
      </tr>
      <tr>
        <th>Tracer retention time accuracy (mins):</th>
        <td><input type="number" step="0.1" v-model="tracer_retention_time_accuracy"></td>
      </tr>
      <tr>
        <th>Tracer plot y-axis scaling:</th>
        <td><BFormSelect v-model="tracer_plot_yaxis" :options="tracer_plot_yaxis_options" size="sm" style="width: auto;"/></td>
      </tr>
      <tr>
        <th>Tracer plot trendlines shown:</th>
        <td><BFormSelect v-model="tracer_plot_trendline" :options="yes_no_options" size="sm" style="width: auto;"/></td>
      </tr>
      <tr>
        <th>Min replicate hits (%):</th>
        <td><div style="display: flex; align-items: center;">
          <input type="range" max="100" min="1" class="slider-bar" v-model="min_replicate_hits">&nbsp;{{ min_replicate_hits }}
        </div></td>
      </tr>
      <tr>
        <th>Min replicate hits in blanks (%):</th>
        <td><div style="display: flex; align-items: center;">
          <input type="range" max="100" min="1" class="slider-bar" v-model="min_replicate_hits_in_blanks">&nbsp;{{ min_replicate_hits_in_blanks }}
        </div></td>
      </tr>
      <tr>
        <th>Max replicate CV:</th>
        <td><input type="number" step="0.1" v-model="max_replicate_cv"></td>
      </tr>
      <tr>
        <th>MRL standard deviation multiplier:</th>
        <td><BFormSelect v-model="mrl_std_multiplier" :options="mrl_std_multiplier_options" size="sm" style="width: auto;"/></td>
      </tr>
      <tr>
        <th>Parent ion mass accuracy (ppm):</th>
        <td><div style="display: flex; align-items: center;">
          <input type="range" max="10" min="1" class="slider-bar" v-model="parent_ion_mass_accuracy">&nbsp;{{ parent_ion_mass_accuracy }}
        </div></td>
      </tr>
      <tr>
        <th>Discard features below this retention time (mins):</th>
        <td><input type="number" step="0.1"  id="id_minimum_rt" v-model="minimum_retention_time"></td>
      </tr>
      <tr>
        <th>Search DSSTox for possible structures:</th>
        <td><BFormSelect v-model="search_dsstox" :options="yes_no_options" size="sm" style="width: auto;"/></td>
      </tr>
      <tr>
        <th>Search Cheminformatics Hazard Module for toxicity data:</th>
        <td><BFormSelect v-model="search_hcd" :options="yes_no_options" size="sm" style="width: auto;"/></td>
      </tr>
      <tr>
        <th>Search DSSTox by:</th>
        <td><BFormSelect v-model="search_mode" :options="search_mode_options" size="sm" style="width: auto;"/></td>
      </tr>
    </tbody>
  </table>
  <div class="input-nav">
    <button @click="resetSettings">Reset Settings</button>
    <button @click="submitJob">Submit</button>
  </div>
</template>


<script>
  import axios from 'axios'

  import { BFormSelect } from 'bootstrap-vue-next'

  export default {
    data() {
      return {
        mass_unit_options: ["Da", "ppm"],
        mrl_std_multiplier_options: ['3', '5', '10'],
        search_mode_options: ['mass', 'formula'],
        tracer_plot_yaxis_options: ['linear', 'log'],
        yes_no_options: ['no', 'yes'],
        parent_ion_mass_accuracy: 5,
        min_replicate_hits: 66,
        min_replicate_hits_in_blanks: 60, //66,
        project_name: "gsj_test_browser", // "Example NTA",
        run_test_files: "no",
        mass_accuracy_units: "ppm",
        tracer_mass_accuracy_units: "ppm",
        tracer_plot_yaxis: "log",
        tracer_plot_trendline: "yes",
        mrl_std_multiplier: "3",
        search_dsstox: "no", // "yes",
        search_hcd: "no",
        search_mode: "mass",
        file_contents: {positive_mode: null, negative_mode: null, run_sequence_positive: null, run_sequence_negative: null, tracer: null},
        pos_adducts: ["Na", "K", "NH4"],
        neg_adducts: ["Cl", "Br", "HCO2", "CH3CO2", "CF3CO2"], //["Cl", "HCO2", "CH3CO2", "FA"],
        neutral_losses: ["H2O", "CO2"],
        mass_accuracy: 10,
        retention_time_accuracy: 0.05,
        tracer_mass_accuracy: 10, //5,
        tracer_retention_time_accuracy: 0.1,
        max_replicate_cv: 0.5, //0.8,
        minimum_retention_time: 0.5, //0.0,
      }
    },
    methods: {
      loadFile(event, file_input) {
        const file = event.target.files[0]
        let reader = new FileReader()
        reader.addEventListener("load", (event) => {
          this.file_contents[file_input] = reader.result
        })
        reader.readAsText(file)
      },
      async submitJob() {
        const payload_old = {
          project_name: "gsj_test_browser",
          datetime: this.getDateTime(),
          test_files: "no",
          pos_input: document.getElementById("pos_mode_file").files[0],
          neg_input: document.getElementById("neg_mode_file").files[0],
          pos_adducts: ["Na", "K", "NH4"],
          neg_adducts: ["Cl", "Br", "HCO2", "CH3CO2", "CF3CO2"],
          neutral_losses: ["H2O", "CO2"],
          mass_accuracy_units: "ppm",
          mass_accuracy: 10,
          rt_accuracy: 0.05,
          run_sequence_pos_file: document.getElementById("run_sequence_pos_file").files[0],
          run_sequence_neg_file: document.getElementById("run_sequence_neg_file").files[0],
          tracer_input: document.getElementById("tracer_file").files[0],
          mass_accuracy_units_tr: "ppm",
          mass_accuracy_tr: 10,
          rt_accuracy_tr: 0.5,
          tracer_plot_yaxis_format: "log",
          tracer_plot_trendline: "yes",
          min_replicate_hits: 66,
          min_replicate_hits_blanks: 60,
          max_replicate_cv: 0.5,
          mrl_std_multiplier: 3,
          parent_ion_mass_accuracy: 5,
          minimum_rt: 0.5,
          search_dsstox: "no",
          search_hcd: "no",
          search_mode: "mass"
        }
        const response = await axios.postForm("https://qed-dev.edap-cluster.com/nta/ms1/external/input/", payload_old)

        const job_id_regex = /Job ID: ([A-Za-z0-9]*)/
        const match = response.data.match(job_id_regex)
        const job_id = match[1]

        this.$router.push(`/ms1_nta/results/${job_id}`)
        
      },
      getDateTime() {
        var now     = new Date(); 
        var year    = now.getFullYear();
        var month   = now.getMonth()+1; 
        var day     = now.getDate();
        var hour    = now.getHours();
        var minute  = now.getMinutes();
        var second  = now.getSeconds(); 
        
        const ymd = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
        const hms = `${hour.toString().padStart(2, "0")}-${minute.toString().padStart(2, "0")}-${second.toString().padStart(2, "0")}`
        return ymd + " " + hms;
      },
      resetSettings() {
        this.parent_ion_mass_accuracy = 5
        this.min_replicate_hits = 66
        this.min_replicate_hits_in_blanks = 66
        this.project_name = "Example NTA"
        this.run_test_files = "no"
        this.mass_accuracy_units = "ppm"
        this.tracer_mass_accuracy_units = "ppm"
        this.tracer_plot_yaxis = "log"
        this.tracer_plot_trendline = "yes"
        this.mrl_std_multiplier = "3"
        this.search_dsstox = "yes"
        this.search_hcd = "no"
        this.top_result_only = "no"
        this.search_mode = "mass"
        this.file_contents = {positive_mode: null, negative_mode: null, run_sequence_positive: null, run_sequence_negative: null, tracer: null}
        this.pos_adducts = ["Na", "K", "NH4"]
        this.neg_adducts = ["Cl", "HCO2", "CH3CO2", "FA"]
        this.neutral_losses = ["H2O", "CO2"]
        this.mass_accuracy = 10
        this.retention_time_accuracy = 0.05
        this.tracer_mass_accuracy = 5
        this.tracer_retention_time_accuracy = 0.1
        this.max_replicate_cv = 0.8
        this.minimum_retention_time = 0.0

        // NOTE: unsure whether this is the best way to do this, but it's the only straightforward one I could find,
        // and it's not triggering any other issues that I can see.
        document.getElementById('pos_mode_file').value = null
        document.getElementById('neg_mode_file').value = null
        document.getElementById('run_sequence_pos_file').value = null
        document.getElementById('run_sequence_neg_file').value = null
        document.getElementById('tracer_file').value = null
      }
    },
    components: { BFormSelect }
  }
</script>


<style>
  .input_table {
    border: 1px solid black;
    border-collapse: collapse;
  }

  .input_table th {
    background-color: #f1f1f1;
    padding: 10px;
    border: 1px solid black;
    border-collapse: collapse;
  }

  .input_table td {
    padding: 10px;
    border: 1px solid black;
    border-collapse: collapse;
  }

  div.two > div {
    width: 50%;
    float: left;
    display: inline;
  }

  .slider-cell-content {
    display: flex;
    align-items: center;
  }

  .slider-bar {
    width: 200px;
  }

  .input-nav {
    display: flex;
    justify-content: space-between;
    padding: 10px;
  }

  .input-side {
    display: flex;
    align-items: center;
  }
</style>