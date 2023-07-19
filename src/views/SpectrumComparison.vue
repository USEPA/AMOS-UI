<!--
  This page is used for loading a spectrum and displaying it.  The long-term intent is likely to involve comparisons
  with another spectrum in the database, but for now it just loads a spectrum supplied in a text box.

  There are no URL route or query parameters associated with this page.
-->

<template>
  <div>
    <p><strong>NOTE: This page is effectively just a demo at the moment, as the full functionality has yet to be coded or established.</strong></p>
    <p>This page allows you to load a spectrum and visualize it.  To use it, copy the data you want to see into the text box.  It should be in the form of space-delimited values for m/z and intensity, with one peak per line.</p>
    <div class="display-stuff">
      <div class="search-inputs">
        <div class="display-stuff">
          <div class="search-inputs">
            <p>First Spectrum</p>
            <textarea type="text" class="batch-search-input" rows="20" columns="35" v-model="spectrum_box_1"></textarea>
          </div>
          <div v-if="dtxcid_mode" class="search-inputs" style="padding-left: 100px">
            <p>DTXCID mode -- {{ dtxcids }}</p>
          </div>
          <div v-else class="search-inputs" style="padding-left: 100px">
            <p>Second Spectrum</p>
            <textarea type="text" class="batch-search-input" rows="20" columns="35" v-model="spectrum_box_2"></textarea>
          </div>
        </div>
        <div class="button-array">
          <button @click="display_spectrum(spectrum_box_1)">Display Spectrum #1</button>
          <button @click="display_spectrum(spectrum_box_2)" style="margin-left:15px;margin-right:15px">Display Spectrum #2</button>
          <button @click="display_both_spectra()">Display Both</button>
        </div>
      </div>
      <div class="info-container" style="padding-left: 100px">
        <div id="graph" ref="graph"></div>
        <br />
        <p v-if="entropy_display == 'entropy'"><strong>Spectral Entropy:</strong> {{ spectral_entropy.toFixed(4) }}</p>
        <p v-else-if="entropy_display == 'similarity'"><strong>Entropy Similarity:</strong> {{ entropy_similarity.toFixed(4) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import Dygraph from 'dygraphs';

  import { BACKEND_LOCATION } from '@/assets/store';

  export default {
    data() {
      return {
        spectrum_box_1: "1 100\n3 100\n5 100",
        spectrum_box_2: "2 100\n4 100\n6 100",
        spectrum: [],
        spectral_entropy: 0,
        entropy_similarity: 0,
        entropy_display: null,
        dtxcid_mode: false,
        dtxcids: [],
        BACKEND_LOCATION
      }
    },
    async created() {
      if (this.$route.query.dtxcids) {
        this.dtxcid_mode = true
        this.dtxcids = this.$route.query.dtxcids.split(",")
        if (this.$route.query.spectrum) {
          var temp_spectrum = this.$route.query.spectrum
          this.spectrum_box_1 = temp_spectrum.replaceAll(":", " ").replaceAll(";", "\n")
        }
      }
    },
    methods: {
      async display_spectrum(box_contents) {
          this.show_similarity = false
          this.spectrum = box_contents.split("\n").map(x => x.split(" ").map(y => Number(y)))
          this.spectral_entropy = await this.calculateSpectralEntropy(this.spectrum)
          this.entropy_display = "entropy"
          if (this.spectrum.length == 1){
              const padded_spectrum = [[this.spectrum[0][0] - 1, 0], this.spectrum[0], [this.spectrum[0][0] + 1, 0]]
              const g = new Dygraph(document.getElementById("graph"), padded_spectrum, {
                  plotter: this.barChartPlotter,
                  includeZero: true,
                  labels: ["m/z", "Relative Intensity"],
                  title: "Mass Spectrum 1",
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
                  title: "Mass Spectrum 2",
                  xlabel: "m/z",
                  ylabel: "Relative Intensity",
                  width: 600,
                  height: 400,
                  xRangePad: 10
              })
          }
      },
      async display_both_spectra() {
          const spectrum1 = this.spectrum_box_1.split("\n").map(x => x.split(" ").map(y => Number(y)))
          const spectrum2 = this.spectrum_box_2.split("\n").map(x => x.split(" ").map(y => Number(y)))
          this.spectrum = spectrum1.map(x => [x[0],x[1],null]).concat(spectrum2.map(x => [x[0],null,x[1]]))
          this.spectrum.sort((a,b) => {
              // need to sort points by m/z because dygraph assumes the data is sorted on the independent variable
              if (a[0] > b[0]) {
                  return 1
              } else if (a[0] < b[0]) {
                  return -1
              } else {
                  return 0
              }
          })
          
          if (this.spectrum.length == 1){
              const padded_spectrum = [[this.spectrum[0][0] - 1, 0], this.spectrum[0], [this.spectrum[0][0] + 1, 0]]
              const g = new Dygraph(document.getElementById("graph"), padded_spectrum, {
                  plotter: this.barChartPlotter,
                  includeZero: true,
                  labels: ["m/z", "Spectrum 1 Intensity", "Spectrum 2 Intensity"],
                  title: "Combined Mass Spectra",
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
                  labels: ["m/z", "Spectrum 1 Intensity", "Spectrum 2 Intensity"],
                  title: "Combined Mass Spectra",
                  xlabel: "m/z",
                  ylabel: "Relative Intensity",
                  width: 600,
                  height: 400,
                  xRangePad: 10,
                  series: {'Spectrum 1 Intensity':{color: "orange"}, 'Spectrum 2 Intensity':{"color":"green"}}
              })
          }
          this.entropy_similarity = await this.calculateEntropySimilarity(spectrum1, spectrum2)
          this.entropy_display = "similarity"
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
      async calculateSpectralEntropy(spectrum) {
        // Calculates spectral entropy.
        // NOTE: This is currently not the same way that the spectral entropies stored in the database are calculated,
        // since that a method of consolidating some peaks that isn't implemented here.
        const response = await axios.post(`${this.BACKEND_LOCATION}/spectral_entropy/`, {spectrum: spectrum})
        return response.data.entropy
      },
      async calculateEntropySimilarity(spectrum_1, spectrum_2) {
        const response = await axios.post(`${this.BACKEND_LOCATION}/entropy_similarity/`, {spectrum_1: spectrum_1, spectrum_2: spectrum_2})
        return response.data.similarity
      }
    }
  }
</script>

<style>
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

.search-inputs {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.display-stuff {
  display: flex;
  flex-direction: row;
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

.button-array {
  margin: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

</style>