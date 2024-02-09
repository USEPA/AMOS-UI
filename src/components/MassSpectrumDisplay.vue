<!--
  This component is used to display a plot of spectrum stored in the database, along with some relevant information
  about it.

  This component takes two props:
  - internalID, a string corresponding to a unique ID in the database for a spectrum (with data in the database)
  - displayAdditionalInfo, a boolean value that partially controls whether text indicating that the spectrum is
    assocated with a method is displayed
-->

<template>
  <div class="spectrum-display-container">
    <p>Below is a plot of the spectrum as intensities versus mass-to-charge ratios (m/z).  Click and drag over a section of the horizontal axis to zoom; double click to zoom back out.  Intensities are scaled so that the highest peak has a value of 100.</p>
    <MassSpectrumPlot :spectrum=spectrum spectrumName="Intensity"/>
    <br />
    <div class="info-container">
      <p style="font-weight: bold;">Information</p>
      <ul style="list-style-type: none;">
        <li><strong>Number of Points:</strong> {{ spectrum.length }}</li>
        <li><strong>Spectral Entropy:</strong> {{ spectral_entropy ? spectral_entropy.toFixed(4) : "Undefined" }}</li>
        <li><strong>Normalized Entropy:</strong> {{ normalized_entropy ? normalized_entropy.toFixed(4) : "Undefined" }}</li>
        <li><div style="display: flex;"><strong>Rating:</strong> &nbsp; <div :class="{'clean-spectrum': spectrum_is_clean, 'noisy-spectrum': !spectrum_is_clean}">{{ spectrum.length == 1 ? "N/A" : (spectrum_is_clean ? "Clean" : "Noisy") }}</div></div></li>
        <li><strong>SPLASH:</strong> <a :href="`https://www.google.com/search?q=${splash}`" target="_blank">{{ splash }}</a></li>
        <li v-if="has_associated_method && displayAdditionalInfo">There's an associated method for this spectrum; click <router-link :to="`/method_with_spectra/spectrum/${internalID}`">here</router-link> to view.</li>
      </ul>
      <div>
        <button @click="show_table_modal = true">Show Points</button>
        <button v-if="spectrum_metadata" @click="show_metadata_modal = true">Spectrum Info</button>
      </div>
    </div>

    <!-- Modal window that displays the spectrum in an AG Grid table.-->
    <b-modal v-model="show_table_modal">
      <ag-grid-vue
        class="ag-theme-balham"
        style="height:600px; width:100%"
        :columnDefs="column_defs"
        :rowData="spectrumAsRows(spectrum)"
        rowSelection="single"
      ></ag-grid-vue>
      <button @click="copySpectrum()">Copy to Clipboard</button>
    </b-modal>

    <!-- Modal window that displays the metadata associated with the spectrum, using the spectrum_metadata field from the database. -->
    <b-modal v-model="show_metadata_modal" ref="metadata_modal">
      <MassSpectrumMetadata :spectrumMetadata=spectrum_metadata />
    </b-modal>
  </div>
</template>

<script>
  import axios from 'axios';
  
  import '/node_modules/ag-grid-community/dist/styles/ag-grid.css'
  import '/node_modules/ag-grid-community/dist/styles/ag-theme-balham.css'
  import { AgGridVue } from "ag-grid-vue3"
  import 'ag-grid-enterprise'
  import { LicenseManager } from 'ag-grid-enterprise'
  LicenseManager.setLicenseKey('CompanyName=US EPA,LicensedGroup=Multi,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=5,LicensedProductionInstancesCount=0,AssetReference=AG-010288,ExpiryDate=3_December_2022_[v2]_MTY3MDAyNTYwMDAwMA==4abffeb82fbc0aaf1591b8b7841e6309')
  
  import '@/assets/style.css'
  import { BACKEND_LOCATION } from '@/assets/store';
  import MassSpectrumMetadata from '@/components/MassSpectrumMetadata.vue'
  import MassSpectrumPlot from '@/components/MassSpectrumPlot.vue'
  

  export default {
    data(){
      return {
        spectrum: [],
        spectral_entropy: 0,
        normalized_entropy: 0,
        splash: "",
        has_associated_method: false,
        show_table_modal: false,
        show_metadata_modal: false,
        spectrum_is_clean: false,
        spectrum_metadata: {},
        BACKEND_LOCATION,
        column_defs: [
          {field:'m/z', headerName:'m/z', flex: 1, sortable: true},
          {field:'intensity', headerName:'Peak Intensity', flex: 1, sortable: true}
        ]
      }
    },
    props: {internalID: String, displayAdditionalInfo: Boolean},
    watch: {
      internalID(){
        this.getSpectrumData()
        
      }
    },
    async created() {
      this.getSpectrumData()
      
    },
    methods: {
      async getSpectrumData() {
        const path = `${this.BACKEND_LOCATION}/get_mass_spectrum/${this.internalID}`
        const response = await axios.get(path)
        console.log(this.internalID)
        this.spectrum = response.data.spectrum
        this.spectral_entropy = response.data.spectral_entropy
        this.normalized_entropy = response.data.normalized_entropy
        this.spectrum_is_clean = this.spectral_entropy <= 3.0 & this.normalized_entropy <= 0.8
        this.splash = response.data.splash
        this.has_associated_method = response.data.has_associated_method
        this.spectrum_metadata = response.data.spectrum_metadata
      },
      spectrumAsRows(spectrum) {
        return spectrum.map(function(x){return {"m/z":x[0], "intensity":x[1]}})
      },
      copySpectrum() {
        const spectrum_string = "m/z Intensity\n" + this.spectrum.map(x => `${x[0]} ${x[1]}`).join("\n");
        // NOTE: the preferred way to copy to clipboard is apparently "navigator.clipboard.writeText()" these days. I
        // can't get that to work in this app, though, since it apparently requires a secured connection and the
        // deployed version of this app doesn't have that.  So I'm sticking to this technically-depricated solution that
        // I pulled out of CompTox's code, since it apparently works there.
        const textarea = document.createElement('textarea')
        textarea.value = spectrum_string
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
    components: {AgGridVue, MassSpectrumMetadata, MassSpectrumPlot}
  };
</script>

<style>
.spectrum-display-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 100%
}

.info-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 18px
}

.clean-spectrum {
  color: #008888
}

.noisy-spectrum {
  color: #880000
}
</style>