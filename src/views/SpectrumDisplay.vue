<template>
  <div class="two-column-page">
    <div class="half-page-column">
      <p>Below is a plot of the spectrum as intensities versus mass-to-charge ratios (m/z).  Click and drag over a section of the horizontal axis to zoom; double click to zoom back out.  Intensities are scaled so that the highest peak has a value of 100.</p>
      <div class="graph-container">
        <div id="graph" ref="graph">graph_placeholder</div>
      </div>
      <br />
      <div class="info-container">
        <p style="font-weight: bold;">Information</p>
        <ul style="list-style-type: none;">
          <li><strong>Number of Points:</strong> {{ spectrum.length }}</li>
          <li><strong>Spectral Entropy:</strong> {{ spectral_entropy ? spectral_entropy.toFixed(4) : "Undefined" }}</li>
          <li><strong>Normalized Entropy:</strong> {{ normalized_entropy ? normalized_entropy.toFixed(4) : "Undefined" }}</li>
          <li><div style="display: flex;"><strong>Rating:</strong> &nbsp; <div :class="{'clean-spectrum': spectrum_is_clean, 'noisy-spectrum': !spectrum_is_clean}">{{ spectrum.length == 1 ? "N/A" : (spectrum_is_clean ? "Clean" : "Noisy") }}</div></div></li>
          <li><strong>SPLASH:</strong> <a :href="`https://www.google.com/search?q=${splash}`" target="_blank">{{ splash }}</a></li>
          <li v-if="has_associated_method">There's an associated method for this spectrum; click <router-link :to="`/method_with_spectra/spectrum/${internalID}`">here</router-link> to view.</li>
        </ul>
      </div>
      <div>
        <button @click="show_table_modal = true">Show Points</button>
      </div>
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
    </div>
    <div class="half-page-column">
      <h3>Substance Info</h3>
      <div class="chemical-box">
        <div class="chemical-image-highlight">
          <img v-if="image_link" class="chemical-image" :src="image_link"/>  
          <div v-else style="text-align: center; display: flex; align-items: center;">No structural representation was found for this substance.</div>
        </div>
        <div class="chemical-info">
          <ul style="list-style-type: none;">
            <li><strong>(Preferred) Name:</strong> {{ substance_info.preferred_name }} </li>
            <li><strong>DTXSID:</strong> <a :href="`${COMPTOX_PAGE_URL}${substance_info.dtxsid}`">{{ substance_info.dtxsid }}</a> </li>
            <li><strong>CASRN:</strong> {{ substance_info.casrn }} </li>
            <li><strong>InChIKey:</strong> {{ substance_info.indigo_inchikey ? substance_info.indigo_inchikey : substance_info.jchem_inchikey}} </li>
            <li><strong>Molecular Formula:</strong> {{ substance_info.molecular_formula }} </li>
            <li><strong>Mass:</strong> {{ substance_info.monoisotopic_mass }} </li>
          </ul>
        </div>
      </div>
      <br /> <br />
      <h3>Metadata</h3>
      <SpectrumMetadata v-if="spectrum_metadata" :spectrumMetadata=spectrum_metadata />
      <p v-else>No metadata available.</p>
    </div>
    
  </div>
</template>

<script>
  import axios from 'axios';
  import Dygraph from 'dygraphs';

  import '/node_modules/ag-grid-community/dist/styles/ag-grid.css'
  import '/node_modules/ag-grid-community/dist/styles/ag-theme-balham.css'
  import { AgGridVue } from "ag-grid-vue3"
  import 'ag-grid-enterprise'
  import { LicenseManager } from 'ag-grid-enterprise'
  LicenseManager.setLicenseKey('CompanyName=US EPA,LicensedGroup=Multi,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=5,LicensedProductionInstancesCount=0,AssetReference=AG-010288,ExpiryDate=3_December_2022_[v2]_MTY3MDAyNTYwMDAwMA==4abffeb82fbc0aaf1591b8b7841e6309')

  import { getSubstanceImageLink } from '@/assets/common_functions'
  import { BACKEND_LOCATION } from '@/assets/store'
  import '@/assets/style.css'
  import SpectrumMetadata from '@/components/SpectrumMetadata.vue'

  export default {
    data() {
      return {
        spectrum: [],
        spectral_entropy: 0,
        normalized_entropy: 0,
        splash: "",
        has_associated_method: false,
        show_table_modal: false,
        spectrum_is_clean: false,
        spectrum_metadata: {},
        substance_info: {},
        image_link: "",
        BACKEND_LOCATION,
        column_defs: [
          {field:'m/z', headerName:'m/z', flex: 1, sortable: true},
          {field:'intensity', headerName:'Peak Intensity', flex: 1, sortable: true}
        ]
      }
    },
    methods: {
      barChartPlotter(e) {
        const ctx = e.drawingContext
        const {points} = e
        const yBottom = e.dygraph.toDomYCoord(0)
        const barWidth = 1

        // Do the actual plotting.
        for (let i = 0; i < points.length; i += 1) {
            const p = points[i]
            const centerX = p.canvasx

            // center of the bar
            ctx.fillRect(centerX - barWidth / 2, p.canvasy,
            barWidth, yBottom - p.canvasy)
            ctx.strokeRect(centerX - barWidth / 2, p.canvasy,
            barWidth, yBottom - p.canvasy)
        }
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
      },
      spectrumAsRows(spectrum) {
        return spectrum.map(function(x){return {"m/z":x[0], "intensity":x[1]}})
      }
    },
    async created() {
      
      // Get spectrum
      const path = `${this.BACKEND_LOCATION}/get_spectrum/${this.$route.params.internal_id}`
      const response = await axios.get(path)
      console.log(response.data)
      this.spectrum = response.data.spectrum
      this.spectral_entropy = response.data.spectral_entropy
      this.normalized_entropy = response.data.normalized_entropy
      this.spectrum_is_clean = this.spectral_entropy <= 3.0 & this.normalized_entropy <= 0.8
      this.splash = response.data.splash
      this.has_associated_method = response.data.has_associated_method
      
      // set up plots
      this.spectrum_metadata = response.data.spectrum_metadata
      if (this.spectrum.length == 1){
        const padded_spectrum = [[this.spectrum[0][0] - 1, 0], this.spectrum[0], [this.spectrum[0][0] + 1, 0]]
        const g = new Dygraph(document.getElementById("graph"), padded_spectrum, {
          plotter: this.barChartPlotter,
          includeZero: true,
          labels: ["m/z", "Relative Intensity"],
          title: "Mass Spectrum",
          xlabel: "m/z",
          ylabel: "Relative Intensity",
          width: 600,
          height: 400,
          xRangePad: 100
        })
      } else {
        const g = new Dygraph(document.getElementById("graph"), this.spectrum, {
          plotter: this.barChartPlotter,
          includeZero: true,
          labels: ["m/z", "Relative Intensity"],
          title: "Mass Spectrum",
          xlabel: "m/z",
          ylabel: "Relative Intensity",
          width: 600,
          height: 400,
          xRangePad: 10
        })
      }

      // get substance info
      const dtxsid_response = await axios.get(`${this.BACKEND_LOCATION}/find_dtxsids/${this.$route.params.internal_id}`)
      const dtxsid = dtxsid_response.data.substance_list[0].dtxsid
      const substance_response = await axios.get(`${this.BACKEND_LOCATION}/get_substances_for_search_term/${dtxsid}`)
      console.log(dtxsid_response)
      this.substance_info = substance_response.data.substances
      this.image_link = await getSubstanceImageLink(this.substance_info.dtxsid)
    },
    components: {AgGridVue, SpectrumMetadata}
  }
</script>

<style>
  .info-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 18px
  }

  .graph-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .clean-spectrum {
    color: #008888
  }

  .noisy-spectrum {
    color: #880000
  }

  .dygraph-label {
    text-align: center;
  }

  .dygraph-title {
    font-weight: bold;
  }

  .dygraph-label {
    text-align: center;
  }

  .dygraph-ylabel {
    transform: rotate(-90deg);
    margin-left: 38px;
  }

  .dygraph-legend {
    float: right;
    margin-top: 22px;
  }
</style>