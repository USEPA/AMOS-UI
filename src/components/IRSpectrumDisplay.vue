<!--
  This component is used to display a D3 plot of an infrared spectrum stored in the database, along with some
  supplemental information.

  The plot is scaled so that the maximum intensity is 100.  The horizontal axis is in units of wavenumber, with the
  value decreasing from left to right.

  This component takes one prop:
  - internalID: The database ID of the IR spectrum to view.  Required.
-->

<template>
  <div class="spectrum-display-container">
    <p>Below is a plot of the selected IR spectrum.  Use the mouse wheel to zoom in and out or double click to zoom in.  Hover over the plot with the mouse to see individual points; this may lag somewhat for larger spectra (64k points or so).  Intensities are scaled so that the maximum is 100.</p>
    <div class="graph-container">
      <h5>{{nucleus}} IR Spectrum</h5>
      <svg width="600" height="400" id="plot"></svg>
      <button id="zoomReset">Reset Zoom</button>
    </div>
    <br />
    <div class="info-container">
      <p style="font-weight: bold;">Information</p>
      <ul style="list-style-type: none;">
        <li><strong>IR Type:</strong> {{ ir_type }}</li>
        <li><strong>Laser frequency:</strong> {{ frequency }} 1/cm</li>
      </ul>
      <button @click="downloadIRSpectrum">Download Spectrum</button>
    </div>
  </div>
</template>


<script>
  import axios from 'axios';

  import * as d3 from "d3";

  import '@/styles/spectrum_plots.css'
  import '@/styles/main.css'
  import { BACKEND_LOCATION } from '@/assets/store.js';

  export default {
    data() {
      return {
        spectrum: [],
        laser_frequency: 0,
        ir_type: 0,
        BACKEND_LOCATION
      }
    },
    props: {internalID: {type: String, required: true}},
    watch: {
      async internalID(){
        await this.getIRSpectrum()
        this.createIRSpectrumPlot()
      }
    },
    async created() {
      await this.getIRSpectrum()
      this.createIRSpectrumPlot()
    },
    methods: {
      async getIRSpectrum() {
        const path = `${this.BACKEND_LOCATION}/get_ir_spectrum/${this.internalID}`
        const response = await axios.get(path)

        this.frequency = response.data.laser_frequency
        this.ir_type = response.data.ir_type

        // all spectra in database should have first_x as the most negative wavenumber and last_x as the most positive wavenumber
        var intensities = response.data.intensities
        var first_x = response.data.first_x
        var last_x = response.data.last_x
        
        const num_points = intensities.length
        const step = (last_x - first_x)/(num_points-1)
        var wavenumbers = Array.from({length: num_points}, (_, i) => first_x + i*step)
        var spectrum_array = d3.zip(wavenumbers, intensities)
        this.spectrum = spectrum_array.map(x => {
          return {wavenumber: x[0], intensity: x[1]}
        })
      },
      downloadIRSpectrum() {
        const spectrum_string = "Wavenumber Intensity\n" + this.spectrum.map(x => `${x.wavenumber} ${x.intensity}`).join("\n")
        var file = new Blob([spectrum_string], {type: "text/plain"})
        var a = document.createElement("a")
        a.setAttribute('download', true)
        a.href = window.URL.createObjectURL(file)
        a.download = "ir spectrum.txt"
        a.click()
      },
      createIRSpectrumPlot() {
        var svg = d3.select("#plot")
        var width = svg.attr("width")
        var height = svg.attr("height")
        const margins = {right: 40, left: 40, top: 40, bottom: 40}

        svg.selectAll("*").remove();

        // construct the scales for the axes; we want the horizontal axis to go from most positive on the left to most negative on the right, so make sure that's set up correctly in the range
        var wavenumber_scale = d3.scaleLinear().domain(d3.extent(this.spectrum, d => d["wavenumber"])).range([width-margins.right, margins.left])
        let wavenumber_rescale = wavenumber_scale.copy()
        var intensity_scale = d3.scaleLinear().domain(d3.extent(this.spectrum, d => d["intensity"])).range([height-margins.bottom, margins.top]).nice()
        
        // make the axes
        var wavenumber_axis = d3.axisBottom(wavenumber_rescale)
        var wavenumber_axis_g = svg.append("g").call(wavenumber_axis).attr("transform", `translate(0,${height-margins.bottom})`)
        svg.append("g").call(d3.axisLeft(intensity_scale)).attr("transform", `translate(${margins.top},0)`)

        // make the axis labels
        svg.append("text").attr("x", width/2).attr("y", height - margins.bottom/4).attr("text-anchor", "middle").attr("fill", "currentColor").text("Wavenumber (1/cm)")
        svg.append("text").attr("transform", "rotate(-90)").attr("x", -height/2).attr("y", margins.left/4).attr("text-anchor", "middle").attr("fill", "currentColor").text("Intensity")
        
        const clippingRect = svg.append("clipPath").attr("id", "clippy").append("rect").attr("width", width - margins.left - margins.right).attr("height", height - margins.top - margins.bottom).attr("transform", `translate(${margins.left}, ${margins.top})`).attr("fill", "none")
        
        // add the actual line to the plot
        var linemaker = d3.line().x(d => wavenumber_rescale(d["wavenumber"])).y(d => intensity_scale(d["intensity"]))
        var path = svg.append("path").attr("fill", "none").attr("stroke", "red").attr("d", linemaker(this.spectrum)).attr("clip-path", "url(#clippy)")

        // make a circle to add to the plot 
        var focus = svg.append("g").style("display", "none")
        focus.append("circle").attr("class", "y").style("fill", "red").style("stroke", "red").attr("r", 4)

        var spectrum = this.spectrum

        const extent = [[margins.left, margins.top], [width-margins.right, height-margins.bottom]]
        const zoom = d3.zoom().scaleExtent([1,1000]).extent(extent).translateExtent(extent).on("zoom", function(event){
          wavenumber_rescale = event.transform.rescaleX(wavenumber_scale)
          wavenumber_axis_g.call(wavenumber_axis.scale(wavenumber_rescale))
          path.attr("d", linemaker(spectrum))
        })
        svg.call(zoom)

        // add description text to the plot
        focus.append("text").attr("class", "locationtext").attr("text-anchor", "end").attr("x", width).attr("y", margins.left/2)

        // the rect is the selection area for the cursor, while the rest of this block is implementing the mouseover functionality
        svg.append("rect").attr("width", width - margins.left - margins.right).attr("height", height - margins.top - margins.bottom).attr("transform", `translate(${margins.left}, ${margins.top})`).style("fill", "none").style("pointer-events", "all")
          .on("mouseover", function() {focus.style("display", null)})
          .on("mouseout", function() {focus.style("display", "none")})
          .on("mousemove", function(event) {
            var pt = d3.pointer(event, svg.node())
            var cursor_x = wavenumber_rescale.invert(pt[0])
            const x_index = d3.bisectCenter(spectrum.map(d => d["wavenumber"]), cursor_x)
            focus.select("circle.y").attr("transform", `translate(${wavenumber_rescale(spectrum[x_index]["wavenumber"])}, ${intensity_scale(spectrum[x_index]["intensity"])})`)
            focus.select("text.locationtext").text(`Wavenumber: ${spectrum[x_index]["wavenumber"].toFixed(6)}; Intensity: ${spectrum[x_index]["intensity"].toFixed(3)}`)
          })
        
        d3.select("#zoomReset").on("click", function(){
          svg.call(zoom.transform, d3.zoomIdentity)
        })
        
      },
    }
  }
  
</script>