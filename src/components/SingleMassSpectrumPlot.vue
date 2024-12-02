<!--
  This component is used to display a plot of a single mass spectrum.

  This component takes one prop:
  - spectrum, the mass spectrum in the form of a list of m/z-intensity pairs
-->

<template>
  <div class="graph-container">
    <h5>{{ spectrum_name }}</h5>
    <svg width="600" height="400" id="msplot"></svg>
    <button id="zoomReset">Reset Zoom</button>
  </div>
</template>

<script>
  import * as d3 from "d3";
  import '@/assets/mass_spectra.css'

  export default {
    data() {
      return {
        x: 1
      }
    },
    props: {spectrum: Array, spectrum_name: {type: String, default: "Mass Spectrum"}},
    mounted() {
      // this can't be used in created() since the svg element needs to be rendered before the plot can be created
      this.createSingleMassSpectrumPlot()
    },
    watch: {
      spectrum(){
        this.createSingleMassSpectrumPlot()
      }
    },
    methods: {
      createSingleMassSpectrumPlot() {
        var svg = d3.select("#msplot")
        var width = svg.attr("width")
        var height = svg.attr("height")
        const margins = {right: 40, left: 40, top: 40, bottom: 40}

        const spectrum = this.spectrum

        //clears the plot when new data is supplied to this component
        svg.selectAll("*").remove();

        // construct the scales for the axes
        const ppm_domain = d3.extent(spectrum, d => d[0])
        var mz_scale = d3.scaleLinear().domain([ppm_domain[0]-0.5, ppm_domain[1]+0.5]).range([margins.left, width-margins.right])
        let mz_rescale = mz_scale.copy()
        var intensity_scale = d3.scaleLinear().domain([0,100]).range([height-margins.bottom, margins.top]).nice()

        // make the axes
        var mz_axis = d3.axisBottom(mz_rescale)
        var mz_axis_g = svg.append("g").call(mz_axis).attr("transform", `translate(0,${height-margins.bottom})`)
        svg.append("g").call(d3.axisLeft(intensity_scale)).attr("transform", `translate(${margins.left},0)`)

        // make the axis labels
        svg.append("text").attr("x", width/2).attr("y", height - margins.bottom/4).attr("text-anchor", "middle").attr("fill", "currentColor").text("m/z")
        svg.append("text").attr("transform", "rotate(-90)").attr("x", -height/2).attr("y", margins.left/3).attr("text-anchor", "middle").attr("fill", "currentColor").text("Relative Intensity")

        // plots peaks as circles; may be useful for visual debugging
        //svg.append("g").selectAll("circle").data(this.spectrum).join("circle").attr("cx", d => mz_rescale(d[0])).attr("cy", d => intensity_scale(d[1])).attr("r", 3)
        
        const clippingRect = svg.append("clipPath").attr("id", "clippy").append("rect").attr("width", width - margins.left - margins.right).attr("height", height - margins.top - margins.bottom).attr("transform", `translate(${margins.left}, ${margins.top})`).attr("fill", "none")

        // add per-point lines
        svg.append("g").selectAll("line").data(spectrum).join("line").attr("x1", peak => mz_rescale(peak[0])).attr("x2", peak => mz_rescale(peak[0])).attr("y1", intensity_scale(0)).attr("y2", peak => intensity_scale(peak[1])).attr("class", "peak-line").attr("clip-path", "url(#clippy)")

        const extent = [[margins.left, margins.top], [width-margins.right, height-margins.bottom]]
        const zoom = d3.zoom().scaleExtent([1,100]).extent(extent).translateExtent(extent).on("zoom", function(event){
          mz_rescale = event.transform.rescaleX(mz_scale)
          mz_axis_g.call(mz_axis.scale(mz_rescale))
          svg.selectAll("line").attr("x1", peak => mz_rescale(peak[0])).attr("x2", peak => mz_rescale(peak[0]))
        })
        svg.call(zoom)

        // make a circle to add to the plot 
        var focus = svg.append("g").style("display", "none")
        focus.append("circle").attr("class", "mouseover-highlight-circle").attr("r", 3)
        // add description text to the plot
        focus.append("text").attr("class", "locationtext").attr("text-anchor", "end").attr("x", width).attr("y", margins.top/2)

        // the rect is the selection area for the cursor, while the rest of this block is implementing the mouseover functionality
        svg.append("rect").attr("width", width - margins.left - margins.right).attr("height", height - margins.top - margins.bottom).attr("transform", `translate(${margins.left}, ${margins.top})`).style("fill", "none").style("pointer-events", "all")
          .on("mouseover", function() {focus.style("display", null)})
          .on("mouseout", function() {focus.style("display", "none")})
          .on("mousemove", function(event) {
            var pt = d3.pointer(event, svg.node())
            var cursor_x = mz_rescale.invert(pt[0])
            const x_index = d3.bisectCenter(spectrum.map(d => d[0]), cursor_x)
            focus.select("circle.mouseover-highlight-circle").attr("transform", `translate(${mz_rescale(spectrum[x_index][0])}, ${intensity_scale(spectrum[x_index][1])})`)
            focus.select("text.locationtext").text(`m/z: ${spectrum[x_index][0].toFixed(4)}; Intensity: ${spectrum[x_index][1].toFixed(3)}`)
          })
        
        d3.select("#zoomReset").on("click", function(){
          svg.call(zoom.transform, d3.zoomIdentity)
        })
      }
    }
  }
</script>