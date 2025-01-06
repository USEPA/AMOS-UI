<template>
  <table class="nostripe input-table">
    <thead>
      <tr><th scope="col">Input</th><th scope="col">Value</th></tr>
    </thead>
    <tbody>
      <!-- <tr>
        <th>Job ID:</th>
        <td><input type="text" id="jobID" name="jobID" value="" readonly="readonly"></td>
      </tr> -->
      <tr>
        <th>Project name:</th>
        <td><textarea cols="30" rows="1" v-model="project_name">Example nta</textarea></td>
      </tr>
      <tr>
        <th>Positive Mode Data: <br /> <input type="file" id="positive_mode_files" @change="loadFiles($event, 'positive')" style="color:transparent;" multiple></th>
        <td><div v-if="file_names.positive.length > 0">
          {{ file_names.positive.length }} files loaded:
          <ul>
            <li v-for="fn in file_names.positive">{{ fn }} &nbsp; <button class="remove-button" @click="removeFile(fn, 'positive')">Remove</button></li>
          </ul>
        </div></td>
      </tr>
      <tr>
        <th>Negative Mode Data: <br /> <input type="file" id="negative_mode_files" @change="loadFiles($event, 'negative')" style="color:transparent;" multiple></th>
        <td><div v-if="file_names.negative.length > 0">
          {{ file_names.negative.length }} files loaded:
          <ul>
            <li v-for="fn in file_names.negative">{{ fn }} &nbsp; <button class="remove-button" @click="removeFile(fn, 'negative')">Remove</button></li>
          </ul>
        </div></td>
      </tr>
      <tr>
        <th>Precursor mass accuracy (ppm):</th>
        <td><input type="number" v-model="precursor_mass_accuracy" step="any"></td>
      </tr>
      <tr>
        <th>Fragment mass accuracy (Da):</th>
        <td><input type="number" v-model="fragment_mass_accuracy" step="0.01"></td>
      </tr>
    </tbody>
  </table>
  <div class="input-nav">
    <div class="input-side">
      <button @click="clearInputs">Clear</button>
      <button @click="restoreDefaults">Defaults</button>
    </div>
    <div class="input-side">
      <button @click="submitJob">Submit</button>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    data() {
      return {
        project_name: "Example nta",
        precursor_mass_accuracy: 10,
        fragment_mass_accuracy: 0.02,
        file_contents: {positive: [], negative: []},
        file_names: {positive: [], negative: []},
      }
    },
    methods: {
      clearInputs() {
        this.project_name = ""

        // NOTE: unsure whether this is the best way to do this, but it's the only straightforward one, I could find,
        // and it's not triggering any other issues that I can see.
        document.getElementById('positive_mode_files').value = null
        document.getElementById('negative_mode_files').value = null
      },
      restoreDefaults() {
        this.project_name = "Example nta"
        this.precursor_mass_accuracy = 10
        this.fragment_mass_accuracy = 0.02

        // NOTE: unsure whether this is the best way to do this, but it's the only straightforward one, I could find,
        // and it's not triggering any other issues that I can see.
        document.getElementById('positive_mode_files').value = null
        document.getElementById('negative_mode_files').value = null
      },
      loadFiles(event, sign) {
        const files_list = event.target.files
        this.file_contents[sign] = []
        this.file_names[sign] = []
        console.log(files_list)
        for (const file of files_list) {
          let reader = new FileReader()
          reader.addEventListener("load", (event) => {
            this.file_names[sign].push(file.name)
            this.file_contents[sign].push(reader.result)
            console.log(this.file_names[sign])
            console.log(this.file_contents[sign])
          })
          reader.readAsText(file)
        }
      },
      removeFile(file_name, sign) {
        const file_index = this.file_names[sign].indexOf(file_name)
        this.file_names[sign].splice(file_index, 1)
        this.file_contents[sign].splice(file_index, 1)
        console.log(this.file_names[sign])
        console.log(this.file_contents[sign])
      },
      submitJob() {
        1
      }
    }
  }
</script>

<style>
  .input-table {
    border: 1px solid black;
    border-collapse: collapse;
  }

  .input-table th {
    background-color: #f1f1f1;
    padding: 10px;
    border: 1px solid black;
    border-collapse: collapse;
  }

  .input-table td {
    padding: 10px;
    border: 1px solid black;
    border-collapse: collapse;
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

  .remove-button {
    border-width: 1px;
    line-height: 1.2em;
    padding: 1px 4px;
  }
</style>