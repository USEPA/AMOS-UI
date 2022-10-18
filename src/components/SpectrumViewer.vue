<template>
  <div class="spectrum-display-container">
    <div class="results-header"></div>
    <div class="graph-container">
      <div id="graph" ref="graph">graph_placeholder</div>
    </div>
    <div class="info-container">
    <p>Information</p>
    <ul style="list-style-type: none;">
        <li><strong>Number of Points:</strong> {{ spectrum.length }}</li>
        <li><strong>Spectral Entropy:</strong> {{ spectral_entropy ? spectral_entropy.toFixed(4) : "Undefined" }}</li>
        <li><strong>Normalized Entropy:</strong> {{ normalized_entropy ? normalized_entropy.toFixed(4) : "Undefined" }}</li>
        <li><strong>Rating:</strong> {{ spectrum.length == 1 ? "N/A" : (spectral_entropy <= 3.0 & normalized_entropy <= 0.8 ? "Clean" : "Noisy") }}</li>
        <li><strong>SPLASH:</strong> <a :href="`https://www.google.com/search?q=${splash}`">{{ splash }}</a></li>
    </ul>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import Dygraph from 'dygraphs';
  
  import '@/assets/search_results.css'
  import { BACKEND_LOCATION } from '@/assets/store';

  export default {
    data(){
      return {
        spectrumString: "",
        spectrum: [],
        spectral_entropy: 0,
        normalized_entropy: 0,
        splash: "",
        BACKEND_LOCATION
      }
    },
    props: ['selectedRowData'],
    watch: {
      selectedRowData(){
        this.getSpectrumData()
      }
    },
    async created() {
      this.getSpectrumData()
    },
    methods: {
      dummyLog() {
        console.log(this.selectedRowData)
      },
      async getSpectrumData() {
        //const path = `http://v2626umcth819.rtord.epa.gov:9415/get_spectrum/${this.selectedRowData.source}/${this.selectedRowData.internal_id}`;
        const path = `${this.BACKEND_LOCATION}/get_spectrum/${this.selectedRowData.source}/${this.selectedRowData.internal_id}`;
        const response = await axios.get(path)
        this.spectrum = response.data.spectrum
        this.spectral_entropy = response.data.spectral_entropy
        this.normalized_entropy = response.data.normalized_entropy
        this.splash = response.data.splash
        console.log(this.spectrum)
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
      },
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
    }
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

.graph-container {
  display: flex;
  flex-direction: column;
  align-items: center;
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