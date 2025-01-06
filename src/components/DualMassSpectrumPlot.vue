<template>
  <div class="graph-container">
    <h5>Mass Spectrum Comparison</h5>
    <svg width="600" height="420" id="msplot"></svg>
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
    props: {spectrum1: Array, spectrum2: Array, spectrum1_name: String, spectrum2_name: String},
    mounted() {
      // this can't be used in created() since the svg element needs to be rendered before the plot can be created
      this.createDualMassSpectrumPlot()
    },
    watch: {
      spectrum1(){
        this.createDualMassSpectrumPlot()
      },
      spectrum2(){
        this.createDualMassSpectrumPlot()
      }
    },
    methods: {
      createDualMassSpectrumPlot() {
        var svg = d3.select("#msplot")
        var width = svg.attr("width")
        var height = svg.attr("height")
        const margins = {right: 40, left: 40, top: 60, bottom: 40}

        const spectrum1 = this.spectrum1
        const spectrum2 = this.spectrum2
        const spectrum1_name = this.spectrum1_name
        const spectrum2_name = this.spectrum2_name

        //clears the plot when new data is supplied to this component
        svg.selectAll("*").remove();

        // construct the scales for the axes
        const ppm_domain = d3.extent(spectrum1.concat(spectrum2), d => d[0])
        const middle_height = (height - margins.bottom + margins.top)/2

        var mz_scale = d3.scaleLinear().domain([ppm_domain[0]-0.5, ppm_domain[1]+0.5]).range([margins.left, width-margins.right])
        let mz_rescale = mz_scale.copy()
        var intensity_scale1 = d3.scaleLinear().domain([0,100]).range([middle_height, margins.top]).nice()
        var intensity_scale2 = d3.scaleLinear().domain([0,100]).range([middle_height, height - margins.bottom]).nice()

        // make the axes
        var mz_axis = d3.axisBottom(mz_rescale)
        var mz_axis_g = svg.append("g").call(mz_axis).attr("transform", `translate(0, ${middle_height})`)//${(margins.top + height - margins.bottom)/2})`)
        svg.append("g").call(d3.axisLeft(intensity_scale1)).attr("transform", `translate(${margins.left},0)`)
        svg.append("g").call(d3.axisLeft(intensity_scale2)).attr("transform", `translate(${margins.left},0)`)

        // make the axis labels
        svg.append("text").attr("x", width/2).attr("y", height - margins.bottom/4).attr("text-anchor", "middle").attr("fill", "currentColor").text("m/z")
        svg.append("text").attr("transform", "rotate(-90)").attr("x", -height/2).attr("y", margins.left/3).attr("text-anchor", "middle").attr("fill", "currentColor").text("Relative Intensity")
        svg.append("text").attr("transform", "rotate(90)").attr("x", 1*height/2).attr("y", margins.left/3-width).attr("text-anchor", "end").attr("fill", "currentColor").text(spectrum1_name)
        svg.append("text").attr("transform", "rotate(90)").attr("x", 1.1*height/2).attr("y", margins.left/3-width).attr("text-anchor", "start").attr("fill", "currentColor").text(spectrum2_name)

        // plots peaks as circles; may be useful for visual debugging
        //svg.append("g").selectAll("circle").data(this.spectrum).join("circle").attr("cx", d => mz_rescale(d[0])).attr("cy", d => intensity_scale(d[1])).attr("r", 3)
        
        const clippingRect = svg.append("clipPath").attr("id", "clippy").append("rect").attr("width", width - margins.left - margins.right).attr("height", height - margins.top - margins.bottom).attr("transform", `translate(${margins.left}, ${margins.top})`).attr("fill", "none")

        // add per-point lines
        svg.append("g").selectAll("line").data(spectrum1).join("line").attr("x1", peak => mz_rescale(peak[0])).attr("x2", peak => mz_rescale(peak[0])).attr("y1", intensity_scale1(0)).attr("y2", peak => intensity_scale1(peak[1])).attr("class", "peak-line").attr("clip-path", "url(#clippy)")
        svg.append("g").selectAll("line").data(spectrum2).join("line").attr("x1", peak => mz_rescale(peak[0])).attr("x2", peak => mz_rescale(peak[0])).attr("y1", intensity_scale2(0)).attr("y2", peak => intensity_scale2(peak[1])).attr("class", "peak-line-secondary").attr("clip-path", "url(#clippy)")
        
        const extent = [[margins.left, margins.top], [width-margins.right, height-margins.bottom]]
        const zoom = d3.zoom().scaleExtent([1,100]).extent(extent).translateExtent(extent).on("zoom", function(event){
          mz_rescale = event.transform.rescaleX(mz_scale)
          mz_axis_g.call(mz_axis.scale(mz_rescale))
          svg.selectAll("line").attr("x1", peak => mz_rescale(peak[0])).attr("x2", peak => mz_rescale(peak[0]))
        })
        svg.call(zoom)
        
        // make circles to add to the plot to highlight points
        var focus = svg.append("g").style("display", "none")
        focus.append("circle").attr("id", "circle1").attr("class", "mouseover-highlight-circle").attr("r", 3)
        focus.append("circle").attr("id", "circle2").attr("class", "mouseover-highlight-circle-secondary").attr("r", 3)
        // add description text to the plot
        //focus.append("text").attr("class", "locationtext").attr("text-anchor", "end").attr("x", width).attr("y", margins.top/2)
        focus.append("text").attr("id", "text1").attr("text-anchor", "end").attr("x", width).attr("y", margins.top/2)
        focus.append("text").attr("id", "text2").attr("text-anchor", "end").attr("x", width).attr("y", margins.top/2).attr("dy", "1em")

        // the rect is the selection area for the cursor, while the rest of this block is implementing the mouseover functionality
        svg.append("rect").attr("width", width).attr("height", height).style("fill", "none").style("pointer-events", "all")
          .on("mouseover", function() {focus.style("display", null)})
          .on("mouseout", function() {focus.style("display", "none")})
          .on("mousemove", function(event) {
            var pt = d3.pointer(event, svg.node())
            var cursor_x = mz_rescale.invert(pt[0])
            const x1_index = d3.bisectCenter(spectrum1.map(d => d[0]), cursor_x)
            const x2_index = d3.bisectCenter(spectrum2.map(d => d[0]), cursor_x)
            const show_spectrum1_hover = Math.abs(cursor_x - spectrum1[x1_index][0]) < 2
            const show_spectrum2_hover = Math.abs(cursor_x - spectrum2[x2_index][0]) < 2

            if (show_spectrum1_hover) {
              focus.select("#circle1").attr("display", null)
              focus.select("#text1").attr("display", null)
              focus.select("#circle1").attr("transform", `translate(${mz_rescale(spectrum1[x1_index][0])}, ${intensity_scale1(spectrum1[x1_index][1])})`)
              focus.select("#text1").text(`${spectrum1_name} - m/z: ${spectrum1[x1_index][0].toFixed(4)}; Intensity: ${spectrum1[x1_index][1].toFixed(3)}`)
            } else {
              focus.select("#circle1").attr("display", "none")
              focus.select("#text1").attr("display", "none")
            }
            if (show_spectrum2_hover) {
              focus.select("#circle2").attr("display", null)
              focus.select("#text2").attr("display", null)
              focus.select("#circle2").attr("transform", `translate(${mz_rescale(spectrum2[x2_index][0])}, ${intensity_scale2(spectrum2[x2_index][1])})`)
              focus.select("#text2").text(`${spectrum2_name} - m/z: ${spectrum2[x2_index][0].toFixed(4)}; Intensity: ${spectrum2[x2_index][1].toFixed(3)}`)
            } else {
              focus.select("#circle2").attr("display", "none")
              focus.select("#text2").attr("display", "none")
            }
          })
         
        d3.select("#zoomReset").on("click", function(){
          //console.log("zoom reset clicked")
          svg.call(zoom.transform, d3.zoomIdentity)
        })
      }
    }
  }
</script>