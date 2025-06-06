<!--
  This component is used to display a plot of an NMR spectrum stored directly in the database (as opposed to a PDF).
  The data is plotted as intensity as a function of frequency shift in PPM.

  Plots with large numbers of points -- 64k or more -- will lag noticably, but should be functional.

  This component takes one prop:
  - spectrum: An array of two-element arrays, where the latter represent frequency-intensity pairs.  Data is assumed to
    be sorted in ascending order of PPM.  Required.
-->

<template>
  <div class="graph-container">
    <h5>{{nucleus}} NMR Spectrum</h5>
    <svg width="600" height="400" id="nmrplot"></svg>
    <button id="zoomReset">Reset Zoom</button>
  </div>
</template>


<script>
  import * as d3 from "d3";

  import '@/styles/main.css'
  import '@/styles/spectrum_plots.css'

  export default {
    data() {
      return {
        x: 1
      }
    },
    props: {spectrum: {type: Array, required: true}},
    watch: {
      spectrum(){
        this.createNMRSpectrumPlot()
      }
    },
    mounted() {
      // this can't be used in created() since the svg element needs to be rendered before the plot can be created
      this.createNMRSpectrumPlot()
    },
    methods: {
      createNMRSpectrumPlot() {
        var svg = d3.select("#nmrplot")
        var width = svg.attr("width")
        var height = svg.attr("height")
        const margins = {right: 40, left: 40, top: 40, bottom: 40}

        svg.selectAll("*").remove();

        // construct the scales for the axes; we want the horizontal axis to go from most positive on the left to most
        // negative on the right, so make sure that's set up correctly in the range
        var ppm_scale = d3.scaleLinear().domain(d3.extent(this.spectrum, d => d["ppm"])).range([width-margins.right, margins.left])
        let ppm_rescale = ppm_scale.copy()
        var intensity_scale = d3.scaleLinear().domain(d3.extent(this.spectrum, d => d["intensity"])).range([height-margins.bottom, margins.top]).nice()
        
        // make the axes
        var ppm_axis = d3.axisBottom(ppm_rescale)
        var ppm_axis_g = svg.append("g").call(ppm_axis).attr("transform", `translate(0,${height-margins.bottom})`)
        svg.append("g").call(d3.axisLeft(intensity_scale)).attr("transform", `translate(${margins.top},0)`)

        // make the axis labels
        svg.append("text").attr("x", width/2).attr("y", height - margins.bottom/4).attr("text-anchor", "middle").attr("fill", "currentColor").text("PPM")
        svg.append("text").attr("transform", "rotate(-90)").attr("x", -height/2).attr("y", margins.left/4).attr("text-anchor", "middle").attr("fill", "currentColor").text("Intensity")
        
        const clippingRect = svg.append("clipPath").attr("id", "clippy").append("rect").attr("width", width - margins.left - margins.right).attr("height", height - margins.top - margins.bottom).attr("transform", `translate(${margins.left}, ${margins.top})`).attr("fill", "none")
        
        // add the actual line to the plot
        var linemaker = d3.line().x(d => ppm_rescale(d["ppm"])).y(d => intensity_scale(d["intensity"]))
        var path = svg.append("path").attr("fill", "none").attr("stroke", "red").attr("d", linemaker(this.spectrum)).attr("clip-path", "url(#clippy)")

        // make a circle to add to the plot 
        var focus = svg.append("g").style("display", "none")
        focus.append("circle").attr("class", "y").style("fill", "red").style("stroke", "red").attr("r", 4)

        var spectrum = this.spectrum

        const extent = [[margins.left, margins.top], [width-margins.right, height-margins.bottom]]
        const zoom = d3.zoom().scaleExtent([1,1000]).extent(extent).translateExtent(extent).on("zoom", function(event){
          ppm_rescale = event.transform.rescaleX(ppm_scale)
          ppm_axis_g.call(ppm_axis.scale(ppm_rescale))
          path.attr("d", linemaker(spectrum))
        })
        svg.call(zoom)

        // add description text to the plot
        focus.append("text").attr("class", "locationtext").attr("text-anchor", "end").attr("x", width).attr("y", margins.top/2)

        // the rect is the selection area for the cursor, while the rest of this block is implementing the mouseover functionality
        svg.append("rect").attr("width", width - margins.left - margins.right).attr("height", height - margins.top - margins.bottom).attr("transform", `translate(${margins.left}, ${margins.top})`).style("fill", "none").style("pointer-events", "all")
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