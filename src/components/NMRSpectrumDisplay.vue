<!--
  This component is used to display a plot of an NMR stored in the database, along with some supplemental information.

  This component takes one prop:
  - internalID, a string corresponding to a unique ID in the database for a spectrum (with data in the database)
-->

<template>
  <p>NOTE: This component for displaying NMR spectra is currently under construction.</p>
  <div class="spectrum-display-container">
    <div class="graph-container">
      <h5>NMR Spectrum Plot</h5>
      <svg width="600" height="400" id="plot"></svg>
    </div>
    <br />
    <div class="info-container">
      <p style="font-weight: bold;">Information</p>
      <ul style="list-style-type: none;">
        <li><strong>Nucleus:</strong> {{ nucleus }}</li>
        <li><strong>Frequency:</strong> {{ frequency }} MHz</li>
        <li><strong>Temperature:</strong> {{ temperature ? temperature : "Unknown" }}</li>
        <li><strong>Solvent:</strong> {{ solvent ? solvent : "Unknown" }}</li>
      </ul>
    </div>
  </div>
</template>


<script>
  import axios from 'axios';

  import * as d3 from "d3";

  import '@/assets/style.css'
  import { BACKEND_LOCATION } from '@/assets/store';

  export default {
    data() {
      return {
        spectrum: [],
        frequency: 0,
        nucleus: "",
        temperature: null,
        solvent: "",
        x_units: "",
        BACKEND_LOCATION
      }
    },
    props: {internalID: String},
    watch: {
      async internalID(){
        await this.getNMRSpectrum()
        this.createNMRSpectrumPlot()
      }
    },
    async created() {
      await this.getNMRSpectrum()
      this.createNMRSpectrumPlot()
    },
    methods: {
      async getNMRSpectrum() {
        const path = `${this.BACKEND_LOCATION}/get_nmr_spectrum/${this.internalID}`
        const response = await axios.get(path)
        console.log(response)

        this.frequency = response.data.frequency
        this.nucleus = response.data.nucleus
        this.temperature = response.data.temperature
        this.solvent = response.data.solvent
        this.x_units = response.data.x_units

        var intensities = response.data.intensities
        var first_x = response.data.first_x
        var last_x = response.data.last_x
        if (first_x > last_x) {
          [first_x, last_x] = [last_x, first_x]
          intensities.reverse()
        }
        const num_points = intensities.length
        const step = (last_x - first_x)/(num_points-1)
        var ppm = Array.from({length: num_points}, (_, i) => first_x + i*step)
        var spectrum_array = d3.zip(ppm, intensities)
        this.spectrum = spectrum_array.map(x => {
          return {ppm: x[0], intensity: x[1]}
        })
      },
      createNMRSpectrumPlot() {
        var svg = d3.select("#plot")
        var width = svg.attr("width")
        var height = svg.attr("height")
        const margin = 60

        svg.selectAll("*").remove();

        // construct the scales for the axes; we want the horizontal axis to go from most positive to most negative, so make sure that's set up correctly
        var ppm_scale = d3.scaleLinear().domain(d3.extent(this.spectrum, d => d["ppm"])).range([width-margin, margin])
        var intensity_scale = d3.scaleLinear().domain(d3.extent(this.spectrum, d => d["intensity"])).range([height-margin, margin]).nice()
        
        // make the axes
        svg.append("g").call(d3.axisBottom(ppm_scale)).attr("transform", `translate(0,${height-margin})`)
        svg.append("g").call(d3.axisLeft(intensity_scale)).attr("transform", `translate(${margin},0)`)

        // make the axis labels
        svg.append("text").attr("x", width/2).attr("y",height - margin/4).attr("text-anchor", "middle").attr("fill", "currentColor").text(this.x_units)
        svg.append("text").attr("transform", "rotate(-90)").attr("x", -height/2).attr("y", margin/4).attr("text-anchor", "middle").attr("fill", "currentColor").text("Intensity")
        
        // add the actual line to the plot
        var linemaker = d3.line().x(d => ppm_scale(d["ppm"])).y(d => intensity_scale(d["intensity"]))
        svg.append("path").attr("fill", "none").attr("stroke", "red").attr("d", linemaker(this.spectrum))

        // make a circle to add to the plot (plan on removing this later)
        var focus = svg.append("g").style("display", "none")
        focus.append("circle").attr("class", "y").style("fill", "none").style("stroke", "blue").attr("r", 4)

        // add description text to the plot
        focus.append("text").attr("class", "locationtext").attr("text-anchor", "end").attr("x", width).attr("y", margin/2)

        var spectrum = this.spectrum

        svg.append("rect").attr("width", width).attr("height", height).style("fill", "none").style("pointer-events", "all")
          .on("mouseover", function() {focus.style("display", null)})
          .on("mouseout", function() {focus.style("display", "none")})
          .on("mousemove", function(event) {
            var pt = d3.pointer(event, svg.node())
            var cursor_x = ppm_scale.invert(pt[0])
            const x_index = d3.bisectCenter(spectrum.map(d => d["ppm"]), cursor_x)
            focus.select("circle.y").attr("transform", `translate(${ppm_scale(spectrum[x_index]["ppm"])}, ${intensity_scale(spectrum[x_index]["intensity"])})`)
            focus.select("text.locationtext").text(`PPM: ${spectrum[x_index]["ppm"].toFixed(6)}; Intensity: ${spectrum[x_index]["intensity"].toFixed(3)}`)
          })
      },
    }
  }
  
</script>

<style>
  .spectrum-display-container {
    display: flex;
    justify-content: center;
    flex-direction: column;
    height: 100%
  }

  .graph-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .info-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 18px
  }
</style>