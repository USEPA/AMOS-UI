<!--
  This page is an adaptation/copy of the job submission page from the NTA WebApp, designed to allow the submission of
  jobs to the NTA application's backend.

  As of this writing, the code is currently hitting some enpoints for the original NTA web application as a pseudo-API;
  a more proper API is expected to follow in the future.

  There are no URL or query parameters associated with this page.
-->

<template>
  <table class="nostripe job-submission-input-table">
    <thead><tr>
      <th scope="col">Input</th><th scope="col">Value</th>
    </tr></thead>
    <tbody>
      <tr>
        <th>
          Project name:
          <HelpIcon tooltipText="Enter a unique name for each new NTA job run." />
          <div style="color: darkred;" v-if="errors.no_project_name"><br />Error: This field is required.</div>
        </th>
        <td><textarea cols="30" rows="1" v-model="project_name"></textarea></td>
      </tr>
      <tr>
        <th>
          Run test files only (debugging):
          <div style="color: darkred;" v-if="errors.no_input_file"><br />Error: If not running test files, a positive mode file, a negative mode file, or both must be submitted.</div>
        </th>
        <td><BFormSelect v-model="run_test_files" :options="yes_no_options" size="sm" style="width: auto;"/></td>
      </tr>
      <tr>
        <th>
          Positive mode file (csv):
          <HelpIcon tooltipText="Input file containing positive mode data where rows are features and columns are samples.  File type must be .csv." />
          <div style="color: darkred;" v-if="errors.no_input_file"><br />Error: If not running test files, a positive mode file, a negative mode file, or both must be submitted.</div>
        </th>
        <td><input type="file" id="pos_mode_file" accept=".csv" @change="loadFile($event, 'positive_mode')" :disabled="run_test_files=='yes'"></td>
      </tr>
      <tr>
        <th>
          Negative mode file (csv):
          <HelpIcon tooltipText="Input file containing negative mode data where rows are features and columns are samples.  File type must be .csv." />
          <div style="color: darkred;" v-if="errors.no_input_file"><br />Error: If not running test files, a positive mode file, a negative mode file, or both must be submitted.</div>
        </th>
        <td><input type="file" id="neg_mode_file" accept=".csv" @change="loadFile($event, 'negative_mode')" :disabled="run_test_files=='yes'"></td>
      </tr>
      <tr>
        <th>
          Input matrix non-detect value: <HelpIcon tooltipText="A number or character(s) representing NaNs in the input data." />
          <br /> (Up to 10 characters)</th>
        <td><input type="text" minlength="1" maxlength="10" v-model="na_value"></td>
      </tr>
      <tr>
        <th>
          Positive mode adducts:
          <HelpIcon tooltipText="Chemical adducts to be investigated as linkages between chemical features in the positive mode dataset." />
        </th>
        <td>
          <div id="id_pos_adducts" class="two">
            <div><label for="pos_adduct_0"><input type="checkbox" v-model="pos_adducts" value="Na" id="pos_adduct_0">[M+Na]+</label></div>
            <div><label for="pos_adduct_1"><input type="checkbox" v-model="pos_adducts" value="K" id="pos_adduct_1">[M+K]+</label></div>
            <div><label for="pos_adduct_2"><input type="checkbox" v-model="pos_adducts" value="NH4" id="pos_adduct_2">[M+NH<sub>4</sub>]+</label></div>
          </div>
        </td>
      </tr>
      <tr>
        <th>
          Negative mode adducts:
          <HelpIcon tooltipText="Chemical adducts to be investigated as linkages between chemical features in the negative mode dataset." />
        </th>
        <td>
          <div id="id_neg_adducts" class="two">
            <div><label for="neg_adduct_0"><input type="checkbox" v-model="neg_adducts" value="Cl" id="neg_adduct_0">[M+Cl]-</label></div>
            <div><label for="neg_adduct_1"><input type="checkbox" v-model="neg_adducts" value="Br" id="neg_adduct_1">[M+Br]-</label></div>
            <div><label for="neg_adduct_2"><input type="checkbox" v-model="neg_adducts" value="HCO2" id="neg_adduct_2">[M+HCO<sub>2</sub>]-</label></div>
            <div><label for="neg_adduct_3"><input type="checkbox" v-model="neg_adducts" value="CH3CO2" id="neg_adduct_3">[M+CH<sub>3</sub>CO<sub>2</sub>]-</label></div>
            <div><label for="neg_adduct_4"><input type="checkbox" v-model="neg_adducts" value="CF3CO2" id="neg_adduct_4">[M+CF<sub>3</sub>CO<sub>2</sub>]-</label></div>
          </div>
        </td>
      </tr>
      <tr>
        <th>
          Neutral losses & solvent modifiers (both modes):
          <HelpIcon tooltipText="Chemical adducts to be investigated as linkages between chemical features in the datasets for both modes." />
        </th>
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
            <div><label for="neutral_loss_10"><input type="checkbox" v-model="neutral_losses" value="CH2O2" id="neutral_loss_10">[M+CH<sub>2</sub>O<sub>2</sub>]</label></div>
            <div><label for="neutral_loss_11"><input type="checkbox" v-model="neutral_losses" value="CH3COOH" id="neutral_loss_11">[M+CH<sub>3</sub>COOH]</label></div>
            <div><label for="neutral_loss_12"><input type="checkbox" v-model="neutral_losses" value="CH3OH" id="neutral_loss_12">[M+CH<sub>3</sub>OH]</label></div>
            <div><label for="neutral_loss_13"><input type="checkbox" v-model="neutral_losses" value="CH3CN" id="neutral_loss_13">[M+CH<sub>3</sub>CN]</label></div>
            <div><label for="neutral_loss_14"><input type="checkbox" v-model="neutral_losses" value="(CH3)2CHOH" id="neutral_loss_14">[M+(CH<sub>3</sub>)<sub>2</sub>CHOH]</label></div>
          </div>
        </td>
      </tr>
      <tr>
        <th>
          Adduct / duplicate mass accuracy units:
          <HelpIcon tooltipText="Units of mass tolerance for adduct and duplicate feature identification." />
        </th>
        <td><BFormSelect v-model="mass_accuracy_units" :options="mass_unit_options" size="sm" style="width: auto;"/></td>
      </tr>
      <tr>
        <th>
          Adduct / duplicate mass accuracy:
          <HelpIcon tooltipText="The window of masses at which a feature can be considered an adduct or duplicate of another feature.  Numeric." />
        </th>
        <td><input type="number" step="any" v-model="mass_accuracy"></td>
      </tr>
      <tr>
        <th>
          Adduct / duplicate retention time accuracy (mins):
          <HelpIcon tooltipText="The window of retention times at which a feature can be considered an adduct or duplicate of another feature.  Numeric." />
        </th>
        <td><input type="number" step="0.01" v-model="retention_time_accuracy"></td>
      </tr>
      <tr>
        <th>
          Run sequence positive mode file (csv; optional):
          <HelpIcon tooltipText="Run sequence data for the positive mode." />
        </th>
        <td><input type="file" id="run_sequence_pos_file" accept=".csv" @change="loadFile($event, 'run_sequence_positive')" :disabled="run_test_files=='yes'"></td>
      </tr>
      <tr>
        <th>
          Run sequence negative mode file (csv; optional):
          <HelpIcon tooltipText="Run sequence data for the negative mode." />
        </th>
        <td><input type="file" id="run_sequence_neg_file" accept=".csv" @change="loadFile($event, 'run_sequence_negative')" :disabled="run_test_files=='yes'"></td>
      </tr>
      <tr>
        <th>
          Tracer file (csv; optional):
          <HelpIcon tooltipText="Information on chemical features added to the study samples in known quantities." />
        </th>
        <td><input type="file" id="tracer_file" accept=".csv" @change="loadFile($event, 'tracer')" :disabled="run_test_files=='yes'"></td>
      </tr>
      <tr>
        <th>
          Tracer mass accuracy units:
          <HelpIcon tooltipText="Units of mass tolerance for tracer feature identification." />
        </th>
        <td><BFormSelect v-model="tracer_mass_accuracy_units" :options="mass_unit_options" size="sm" style="width: auto;"/></td>
      </tr>
      <tr>
        <th>
          Tracer mass accuracy:
          <HelpIcon tooltipText="The window of masses at which a feature can be considered a tracer feature from the tracer input file.  Numeric." />
        </th>
        <td><input type="number" step="any" v-model="tracer_mass_accuracy"></td>
      </tr>
      <tr>
        <th>
          Tracer retention time accuracy (mins):
          <HelpIcon tooltipText="The window of retention times at which a feature can be considered a trace feature from the tracer input file.  Numeric." />
        </th>
        <td><input type="number" step="0.1" v-model="tracer_retention_time_accuracy"></td>
      </tr>
      <tr>
        <th>
          Tracer plot y-axis scaling:
          <HelpIcon tooltipText="Preferred y-axis format to display on the tracer run sequence plot(s)." />
        </th>
        <td><BFormSelect v-model="tracer_plot_yaxis" :options="tracer_plot_yaxis_options" size="sm" style="width: auto;"/></td>
      </tr>
      <tr>
        <th>
          Tracer plot trendlines shown:
        </th>
        <td><BFormSelect v-model="tracer_plot_trendline" :options="yes_no_options" size="sm" style="width: auto;"/></td>
      </tr>
      <tr>
        <th>
          Min replicate hits (%):
          <HelpIcon tooltipText="Percentage of replicates that a feature must be observed across a set of sample replicates to be kept." />
        </th>
        <td><div style="display: flex; align-items: center;">
          <input type="range" max="100" min="1" class="slider-bar" v-model="min_replicate_hits">&nbsp;{{ min_replicate_hits }}
        </div></td>
      </tr>
      <tr>
        <th>
          Min replicate hits in blanks (%):
          <HelpIcon tooltipText="Percentage of replicates that a feature must be observed across a set of blank replicates to be used for blank-specific calculations (i.e., blank subtraction, minimum reporting limit generation)." />
        </th>
        <td><div style="display: flex; align-items: center;">
          <input type="range" max="100" min="1" class="slider-bar" v-model="min_replicate_hits_in_blanks">&nbsp;{{ min_replicate_hits_in_blanks }}
        </div></td>
      </tr>
      <tr>
        <th>
          Max replicate CV:
          <HelpIcon tooltipText="Numeric value for the maximum acceptable CV. Any occurrences greater than this maximal acceptable CV are subject to removal or flagging in the output data." />
        </th>
        <td><input type="number" step="0.1" v-model="max_replicate_cv"></td>
      </tr>
      <tr>
        <th>
          MRL standard deviation multiplier:
          <HelpIcon tooltipText="The minimum reporting limit (MRL) for each chemical feature is calculated as: <br /> x<sub>b</sub>&#177;(σ*y) <br /> where x<sub>b</sub> is the mean abundance of the chemical feature in the blanks, σ is the standard deviation of the chemical feature in the blanks, and y is the selected multiplier." :html="true" />
        </th>
        <td><BFormSelect v-model="mrl_std_multiplier" :options="mrl_std_multiplier_options" size="sm" style="width: auto;"/></td>
      </tr>
      <tr>
        <th>
          Parent ion mass accuracy (ppm):
          <HelpIcon tooltipText="The mass tolerance in ppm of the parent ions (i.e., features) that will be searched against DSSTox.  Numeric." />
        </th>
        <td><div style="display: flex; align-items: center;">
          <input type="range" max="10" min="1" class="slider-bar" v-model="parent_ion_mass_accuracy">&nbsp;{{ parent_ion_mass_accuracy }}
        </div></td>
      </tr>
      <tr>
        <th>
          Discard features below this retention time (mins):
          <HelpIcon tooltipText="Remove all features below the given retention time.  This limits the features of interest and is directly related to the void volume/time of the analytical method used to acquire sample data.  Numeric." />
        </th>
        <td><input type="number" step="0.1"  id="id_minimum_rt" v-model="minimum_retention_time"></td>
      </tr>
      <tr>
        <th>
          Search DSSTox for possible structures:
          <HelpIcon tooltipText="Whether to compare masses of features that pass QA/QC filtering to those in DSSTox to identify candidate chemicals." />
        </th>
        <td>
          <div style="display: flex; align-items: center;">
            <BFormSelect v-model="search_dsstox" :options="yes_no_options" size="sm" style="width: auto;" :disabled="search_hcd=='yes'"/><div v-if="search_hcd=='yes'">&nbsp; Required for Cheminformatics Hazard Module data.</div>
          </div>
        </td>
      </tr>
      <tr>
        <th>
          Search Cheminformatics Hazard Module for toxicity data:
          <HelpIcon tooltipText="Whether candidate chemicals from DSSTox should have Hazard Information pulled down from the Cheminformatics Hazard module." />
        </th>
        <td><BFormSelect v-model="search_hcd" :options="yes_no_options" size="sm" style="width: auto;" @change="hcd_dsstox"/></td>
      </tr>
      <tr>
        <th>
          Search DSSTox by:
          <HelpIcon tooltipText="How to search for candidates in DSSTox.  When mass is selected, the masses of features that pass QA/QC are used. When formula is selected, the molecular formula for features that pass QA/QC are used. " />
        </th>
        <td><BFormSelect v-model="dsstox_search_mode" :options="search_mode_options" size="sm" style="width: auto;"/></td>
      </tr>
    </tbody>
  </table>
  <div style="padding: 10px;">
    <button @click="resetSettings">Reset Settings</button>
    <button @click="submitJob">Submit</button>
  </div>
  <BAlert variant="danger" v-model="errors.any">
    There are errors with your submission.  Please check above; fields with errors will have red error messages with them.
  </BAlert>
</template>


<script>
  import axios from 'axios'
  import { BAlert, BFormSelect } from 'bootstrap-vue-next'
  import { toRaw } from 'vue'

  import HelpIcon from '@/components/HelpIcon.vue'

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
        min_replicate_hits_in_blanks: 66,
        project_name: "Example NTA",
        run_test_files: "no",
        mass_accuracy_units: "ppm",
        tracer_mass_accuracy_units: "ppm",
        tracer_plot_yaxis: "log",
        tracer_plot_trendline: "yes",
        mrl_std_multiplier: "3",
        search_dsstox: "yes",
        search_hcd: "no",
        dsstox_search_mode: "mass",
        file_contents: {positive_mode: null, negative_mode: null, run_sequence_positive: null, run_sequence_negative: null, tracer: null},
        pos_adducts: ["Na", "K", "NH4"],
        neg_adducts: ["Cl", "Br", "HCO2", "CH3CO2", "CF3CO2"],
        neutral_losses: ["H2O", "CO2"],
        mass_accuracy: 10,
        retention_time_accuracy: 0.05,
        tracer_mass_accuracy: 5,
        tracer_retention_time_accuracy: 0.1,
        max_replicate_cv: 0.8,
        minimum_retention_time: 0.0,
        na_value: "",
        errors: {any: false, no_input_file: false, no_project_name: false}
      }
    },
    methods: {
      hcd_dsstox() {
        console.log(this.search_hcd)
        if (this.search_hcd == 'yes') {
          this.search_dsstox = 'yes'
        }
      },
      loadFile(event, file_input) {
        const file = event.target.files[0]
        let reader = new FileReader()
        reader.addEventListener("load", (event) => {
          this.file_contents[file_input] = reader.result
        })
        reader.readAsText(file)
      },
      validateFields() {
        for (let key of Object.keys(this.errors)) {
          this.errors[key] = false
        }
        
        // check project name is not empty
        if (this.project_name.length == 0) {
          this.errors.any = true
          this.errors.no_project_name = true
        }

        // check that there's at least one file submitted or the test files are being run
        const num_positive_files = document.getElementById("pos_mode_file").files.length
        const num_negative_files = document.getElementById("neg_mode_file").files.length
        if (num_positive_files==0 && num_negative_files==0 && this.run_test_files=="no") {
          this.errors.any = true
          this.errors.no_input_file = true
        }
        
      },
      async submitJob() {
        this.validateFields()
        if (this.errors.any == true) {
          return
        }

        const payload = {
          project_name: this.project_name,
          datetime: this.getDateTime(),
          test_files: this.run_test_files,
          pos_input: document.getElementById("pos_mode_file").files[0],
          neg_input: document.getElementById("neg_mode_file").files[0],
          pos_adducts: toRaw(this.pos_adducts),
          neg_adducts: toRaw(this.neg_adducts),
          neutral_losses: toRaw(this.neutral_losses),
          whaargarbl: 6,
          mass_accuracy_units: this.mass_accuracy_units,
          mass_accuracy: this.mass_accuracy,
          rt_accuracy: this.retention_time_accuracy,
          run_sequence_pos_file: document.getElementById("run_sequence_pos_file").files[0],
          run_sequence_neg_file: document.getElementById("run_sequence_neg_file").files[0],
          tracer_input: document.getElementById("tracer_file").files[0],
          mass_accuracy_units_tr: this.tracer_mass_accuracy_units,
          mass_accuracy_tr: this.tracer_mass_accuracy,
          rt_accuracy_tr: this.tracer_retention_time_accuracy,
          tracer_plot_yaxis_format: this.tracer_plot_yaxis,
          tracer_plot_trendline: this.tracer_plot_trendline,
          min_replicate_hits: this.min_replicate_hits,
          min_replicate_hits_blanks: this.min_replicate_hits_in_blanks,
          max_replicate_cv: this.max_replicate_cv,
          mrl_std_multiplier: this.mrl_std_multiplier,
          parent_ion_mass_accuracy: this.parent_ion_mass_accuracy,
          minimum_rt: this.minimum_retention_time,
          search_dsstox: this.search_dsstox,
          search_hcd: this.search_hcd,
          search_mode: this.dsstox_search_mode,
          na_val: this.na_value
        }

        /* var payload = new FormData()
        payload.append("project_name", this.project_name)
        payload.append("datetime", this.getDateTime())
        payload.append("test_files", this.run_test_files)
        payload.append("pos_input", document.getElementById("pos_mode_file").files[0])
        payload.append("neg_input", document.getElementById("neg_mode_file").files[0])
        payload.append("whaargarbl", "test")
        payload.append("mass_accuracy_units", this.mass_accuracy_units)
        payload.append("mass_accuracy", this.mass_accuracy)
        payload.append("rt_accuracy", this.retention_time_accuracy)
        payload.append("run_sequence_pos_file", document.getElementById("run_sequence_pos_file").files[0])
        payload.append("run_sequence_neg_file", document.getElementById("run_sequence_neg_file").files[0])
        payload.append("tracer_input", document.getElementById("tracer_file").files[0])
        payload.append("mass_accuracy_units_tr", this.tracer_mass_accuracy_units)
        payload.append("mass_accuracy_tr", this.tracer_mass_accuracy)
        payload.append("rt_accuracy_tr", this.tracer_retention_time_accuracy)
        payload.append("tracer_plot_yaxis_format", this.tracer_plot_yaxis)
        payload.append("tracer_plot_trendline", this.tracer_plot_trendline)
        payload.append("min_replicate_hits", this.min_replicate_hits)
        payload.append("min_replicate_hits_blanks", this.min_replicate_hits_in_blanks)
        payload.append("max_replicate_cv", this.max_replicate_cv)
        payload.append("mrl_std_multiplier", this.mrl_std_multiplier)
        payload.append("parent_ion_mass_accuracy", this.parent_ion_mass_accuracy)
        payload.append("minimum_rt", this.minimum_retention_time)
        payload.append("search_dsstox", this.search_dsstox)
        payload.append("search_hcd", this.search_hcd)
        payload.append("search_mode", this.dsstox_search_mode)
        payload.append("na_val", this.na_value)

        for (let a of toRaw(this.pos_adducts)) {
          payload.append("pos_adducts[]", a)
        }
        for (let a of toRaw(this.neg_adducts)) {
          payload.append("neg_adducts[]", a)
        }
        for (let a of toRaw(this.neutral_losses)) {
          payload.append("neutral_losses[]", a)
        } */

        //const response = await axios.post("http://127.0.0.1:5000/dummy_post/", payload)
        const response = await axios.postForm("https://qed-dev.edap-cluster.com/nta/ms1/external/input/", payload)
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
        this.na_value = ""

        // NOTE: unsure whether this is the best way to do this, but it's the only straightforward one I could find,
        // and it's not triggering any other issues that I can see.
        document.getElementById('pos_mode_file').value = null
        document.getElementById('neg_mode_file').value = null
        document.getElementById('run_sequence_pos_file').value = null
        document.getElementById('run_sequence_neg_file').value = null
        document.getElementById('tracer_file').value = null
      }
    },
    components: { BAlert, BFormSelect, HelpIcon }
  }
</script>


<style>
  .job-submission-input-table {
    border: 1px solid black;
    border-collapse: collapse;
  }

  .job-submission-input-table th {
    background-color: #f1f1f1;
    padding: 10px;
    border: 1px solid black;
    border-collapse: collapse;
  }

  .job-submission-input-table td {
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