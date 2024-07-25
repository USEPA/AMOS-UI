<!--
  This component is used to display a plot of an NMR stored in the database, along with some supplemental information.

  This component takes one prop:
  - internalID, a string corresponding to a unique ID in the database for a spectrum (with data in the database)
-->

<template>
  <div class="spectrum-display-container">
    <p>Below is a plot of the selected NMR spectrum.  Use the mouse wheel to zoom in and out or double click to zoom in.  Hover over the plot with the mouse to see individual points; this may lag somewhat for larger spectra (64k points or so).  Intensities are scaled so that the maximum is 10.</p>
    <div class="graph-container">
      <h5>{{nucleus}} NMR Spectrum</h5>
      <svg width="600" height="400" id="plot"></svg>
      <button id="zoomReset">Reset Zoom</button>
    </div>
    <br />
    <div class="info-container">
      <p style="font-weight: bold;">Information</p>
      <ul style="list-style-type: none;">
        <li><strong>Nucleus:</strong> {{ nucleus }}</li>
        <li><strong>Frequency:</strong> {{ frequency }} MHz</li>
        <li><strong>Temperature:</strong> {{ temperature ? `${temperature} °C` : "Unknown" }}</li>
        <li><strong>Solvent:</strong> {{ solvent ? solvent : "Unknown" }}</li>
      </ul>
      <button @click="downloadNMRSpectrum">Download Spectrum</button>
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

        this.frequency = response.data.frequency
        this.nucleus = response.data.nucleus
        this.temperature = response.data.temperature
        this.solvent = response.data.solvent
        this.x_units = response.data.x_units

        // all spectra in database should have first_x as the most negative PPM and last_x as the most positive PPM
        var intensities = response.data.intensities
        var first_x = response.data.first_x
        var last_x = response.data.last_x
        
        const num_points = intensities.length
        const step = (last_x - first_x)/(num_points-1)
        var ppm = Array.from({length: num_points}, (_, i) => first_x + i*step)
        var spectrum_array = d3.zip(ppm, intensities)
        this.spectrum = spectrum_array.map(x => {
          return {ppm: x[0], intensity: x[1]}
        })
      },
      downloadNMRSpectrum() {
        const spectrum_string = "PPM Intensity\n" + this.spectrum.map(x => `${x.ppm} ${x.intensity}`).join("\n")
        var file = new Blob([spectrum_string], {type: "text/plain"})
        var a = document.createElement("a")
        a.setAttribute('download', true)
        a.href = window.URL.createObjectURL(file)
        a.download = "nmr spectrum.txt"
        a.click()
      },
      createNMRSpectrumPlot() {
        var svg = d3.select("#plot")
        var width = svg.attr("width")
        var height = svg.attr("height")
        const margins = {right: 40, left: 40, top: 40, bottom: 40}
        const margin = 40

        svg.selectAll("*").remove();

        // construct the scales for the axes; we want the horizontal axis to go from most positive to most negative, so make sure that's set up correctly in the range
        var ppm_scale = d3.scaleLinear().domain(d3.extent(this.spectrum, d => d["ppm"])).range([width-margin, margin])
        let ppm_rescale = ppm_scale.copy()
        var intensity_scale = d3.scaleLinear().domain(d3.extent(this.spectrum, d => d["intensity"])).range([height-margin, margin]).nice()
        
        // make the axes
        var ppm_axis = d3.axisBottom(ppm_rescale)
        var ppm_axis_g = svg.append("g").call(ppm_axis).attr("transform", `translate(0,${height-margin})`)
        svg.append("g").call(d3.axisLeft(intensity_scale)).attr("transform", `translate(${margin},0)`)

        // make the axis labels
        svg.append("text").attr("x", width/2).attr("y", height - margins.bottom/4).attr("text-anchor", "middle").attr("fill", "currentColor").text(this.x_units)
        svg.append("text").attr("transform", "rotate(-90)").attr("x", -height/2).attr("y", margin/4).attr("text-anchor", "middle").attr("fill", "currentColor").text("Intensity")
        
        const clippingRect = svg.append("clipPath").attr("id", "clippy").append("rect").attr("width", width - 2*margin).attr("height", height - 2*margin).attr("transform", `translate(${margin}, ${margin})`).attr("fill", "none")
        
        // add the actual line to the plot
        var linemaker = d3.line().x(d => ppm_rescale(d["ppm"])).y(d => intensity_scale(d["intensity"]))
        var path = svg.append("path").attr("fill", "none").attr("stroke", "red").attr("d", linemaker(this.spectrum)).attr("clip-path", "url(#clippy)")

        // make a circle to add to the plot 
        var focus = svg.append("g").style("display", "none")
        focus.append("circle").attr("class", "y").style("fill", "red").style("stroke", "red").attr("r", 4)

        var spectrum = this.spectrum

        const extent = [[margin, margin], [width-margin, height-margin]]
        const zoom = d3.zoom().scaleExtent([1,1000]).extent(extent).translateExtent(extent).on("zoom", function(event){
          ppm_rescale = event.transform.rescaleX(ppm_scale)
          ppm_axis_g.call(ppm_axis.scale(ppm_rescale))
          path.attr("d", linemaker(spectrum))
        })
        svg.call(zoom)

        // add description text to the plot
        focus.append("text").attr("class", "locationtext").attr("text-anchor", "end").attr("x", width).attr("y", margin/2)

        // the rect is the selection area for the cursor, while the rest of this block is implementing the mouseover functionality
        svg.append("rect").attr("width", width - 2*margin).attr("height", height - 2*margin).attr("transform", `translate(${margin}, ${margin})`).style("fill", "none").style("pointer-events", "all")
          .on("mouseover", function() {focus.style("display", null)})
          .on("mouseout", function() {focus.style("display", "none")})
          .on("mousemove", function(event) {
            var pt = d3.pointer(event, svg.node())
            var cursor_x = ppm_rescale.invert(pt[0])
            const x_index = d3.bisectCenter(spectrum.map(d => d["ppm"]), cursor_x)
            focus.select("circle.y").attr("transform", `translate(${ppm_rescale(spectrum[x_index]["ppm"])}, ${intensity_scale(spectrum[x_index]["intensity"])})`)
            focus.select("text.locationtext").text(`PPM: ${spectrum[x_index]["ppm"].toFixed(6)}; Intensity: ${spectrum[x_index]["intensity"].toFixed(3)}`)
          })
        
        d3.select("#zoomReset").on("click", function(){
          svg.call(zoom.transform, d3.zoomIdentity)
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