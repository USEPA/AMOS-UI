<!--
  This is a component for plotting one or two spectra on a Dygraphs plot.  Names for the data and plot titles can also be passed.

  This component takes five props:
  - spectrum: A spectrum to be plotted.
  - secondSpectrum: A second spectrum to be plotted.  If this is supplied, this component will always try to print both spectra.
  - spectrumName: Name for the first spectrum.  This appears when hovering over peaks in the plot.
  - secondSpectrumName: Name for the second spectrum.  This appears when hovering over peaks in the plot.
  - title: Title for the plot.
-->

<template>
  <div class="graph-container">
    <div id="graph" ref="graph">graph_placeholder</div>
  </div>
</template>

<script>
  import Dygraph from 'dygraphs'
  
  export default {
    data() {
      return {
        x: 1
      }
    },
    props: {spectrum: Array, secondSpectrum: Array, spectrumName: {type: String, default: "Spectrum #1"}, secondSpectrumName: {type: String, default: "Spectrum #2"}, title: {type: String, default: "Mass Spectrum"}},
    onMounted() {
      // Note: this needs to be onMounted() instead of created() since the latter tries to create the graph before the
      // div that it's going to is created.
      if (this.secondSpectrum) {
        this.createTwoSpectrumPlot(this.spectrum, this.secondSpectrum)
      } else {
        this.createSingleSpectrumPlot(this.spectrum)
      }
    },
    watch: {
      spectrum() {
        if (this.secondSpectrum) {
          this.createTwoSpectrumPlot(this.spectrum, this.secondSpectrum)
        } else {
          this.createSingleSpectrumPlot(this.spectrum)
        }
      },
      secondSpectrum() {
        if (this.secondSpectrum) {
          this.createTwoSpectrumPlot(this.spectrum, this.secondSpectrum)
        } else {
          this.createSingleSpectrumPlot(this.spectrum)
        }
      }
    },
    methods: {
      createSingleSpectrumPlot(spectrum) {
        if (spectrum.length == 1){
          const padded_spectrum = [[spectrum[0][0] - 1, 0], spectrum[0], [spectrum[0][0] + 1, 0]]
          const g = new Dygraph(document.getElementById("graph"), padded_spectrum, {
            plotter: this.barChartPlotter,
            includeZero: true,
            labels: ["m/z", this.spectrumName],
            title: this.title,
            xlabel: "m/z",
            ylabel: "Relative Intensity",
            width: 600,
            height: 400,
            xRangePad: 100
          })
        } else {
          const g = new Dygraph(document.getElementById("graph"), spectrum, {
            plotter: this.barChartPlotter,
            includeZero: true,
            labels: ["m/z", this.spectrumName],
            title: this.title,
            xlabel: "m/z",
            ylabel: "Relative Intensity",
            width: 600,
            height: 400,
            xRangePad: 10
          })
        }
      },
      createTwoSpectrumPlot(spectrum1, spectrum2, name1, name2) {
        var combined_spectrum = spectrum1.map(x => [x[0],x[1],null]).concat(spectrum2.map(x => [x[0],null,x[1]]))
        combined_spectrum.sort((a,b) => {
            // need to sort points by m/z because dygraph assumes the data is sorted on the independent variable
            if (a[0] > b[0]) {
                return 1
            } else if (a[0] < b[0]) {
                return -1
            } else {
                return 0
            }
        })
        const g = new Dygraph(document.getElementById("graph"), combined_spectrum, {
            plotter: this.barChartPlotter,
            includeZero: true,
            labels: ["m/z", this.spectrumName, this.secondSpectrumName],
            title: this.title,
            xlabel: "m/z",
            ylabel: "Relative Intensity",
            width: 600,
            height: 400,
            xRangePad: 10,
            series: {[this.spectrumName]: {color: "orange"}, [this.secondSpectrumName]: {color: "green"}}
        })
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

  .graph-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

</style>