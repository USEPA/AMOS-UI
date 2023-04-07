<!--
  This component is for the display of an interactive bubble chart that is meant to break down and describe the contents of the database's methods in terms of the methodologies present in the methods (especially liquid and gas chromatography).

  This component does not take any props, but it is currently reliant on a JSON file in the public files directory.
-->

<template>
  <div>
    <svg width="860" height="860"></svg>
  </div>
</template>

<script>
  import * as d3 from "d3";
  export default {
    data() {
      return {};
    },
    mounted() {
      var svg = d3.select("svg"),
        margin = 20,
        diameter = +svg.attr("width"),
        g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

      var color = d3.scaleLinear()
          .domain([-1, 4])
          .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
          .interpolate(d3.interpolateHcl);

      var pack = d3.pack()
          .size([diameter - margin, diameter - margin])
          .padding(2);

      d3.json("circ_matrix_breakdown_02.json").then(function(root) {
          root = d3.hierarchy(root)
              .sum(function(d) { return d.size })
              .sort(function(a, b) { return b.value - a.value; });

          var focus = root,
              nodes = pack(root).descendants(),
              view;
          
          var circle = g.selectAll("circle")
              .data(nodes)
              .enter().append("circle")
              .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
              .style("fill", function(d) { return d.children ? color(d.depth) : null; })
              .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()));
              //.on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });
          
          var text = g.selectAll("text")
              .data(nodes)
              .enter().append("text")
              .attr("class", "label")
              .style("fill-opacity", function(d) {
                  if ((d.parent === root)) {
                      return 1
                  } else {
                      return 0
                  }
              } )
              .style("display", function(d) {
                  if ((d.parent === root)) {
                      return 'inline'
                  } else {
                      return 'none'
                  }
              } )
              .attr('x', 0)
              // if we have a method count to report, set text a little higher
              .attr('y', 0)
              // set up labels with line breaks; first top level
              .style("font-size", 38)
              .style("font-weight", 700)
              .append('tspan')
              .attr('dy', -30)
              .attr('id', 'top')
              .text(function(d) { return d.data.name })
              // now the next line, net method count
              .append('tspan')
              .attr('x', 0)
              .attr('dy', 34)
              .attr('id', 'bottom')
              .style("font-size", 32)
              .style("font-weight", 500)
              .text(function(d) {
                  if (d.data.size) {
                      return "Methods: " +  d.data.size
                  }
              })
              .append('tspan')
              .attr('x', 0)
              .attr('dy', 34)
              .attr('id', 'bottom')
              .style("font-size", 32)
              .style("font-weight", 500)
              .text(function(d) {
                  if (d.data.size) {
                      return "GC Count: " +  d.data.gc_size
                  }
              })
              .append('tspan')
              .attr('x', 0)
              .attr('dy', 34)
              .attr('id', 'bottom')
              .style("font-size", 32)
              .style("font-weight", 500)
              .text(function(d) {
                  if (d.data.size) {
                      return "LC Count: " +  d.data.lc_size
                  }
              })

          var node = g.selectAll("circle,text")

          zoomTo([root.x, root.y, root.r * 2 + margin]);
          
          function zoom(event, d) {
              var focus0 = focus; focus = d;

              var transition = svg.transition()
                  .duration(event.altKey ? 7500 : 1250)
                  .tween("zoom", function(d) {
                      var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
                      return function(t) { zoomTo(i(t)); };
                  });

              transition.selectAll("text")
                  .style("fill-opacity", function(d) {
                      // if your parents is the focus, or if you are zoomed all the way in, show text element
                      if ((d.parent === focus) || ((d === focus) && (focus.height === 0))) {
                          return 1
                      } else {
                          return 0
                      }
                  })

                  // smooth transition for rotating on bottom level
                  .attr("transform", function (d) {
                      var k = diameter / (focus.r * 2 + margin)
                      if (focus.height === 1) {
                          return `translate(${(d.x - focus.x)*k}, ${(d.y - focus.y)*k})rotate(-15)`; 
                      } else {
                          return `translate(${(d.x - focus.x)*k}, ${(d.y - focus.y)*k})rotate(0)`;
                      }
                  })
                  
                  .on("start", function(d) { if ((d.parent === focus) || (d === focus)) this.style.display = "inline"; })
                  .on("end", function(d) { 
                      if ((d.parent !== focus) && (focus.height !== 0)) {
                          this.style.display = "none"
                      } if (focus.height === 0) {
                          // Update text elements with height=0 to be visible if they are the focus
                          d3.selectAll("text")
                              .filter(function(d) { return d.height === 0 })
                              .style("display",  function(d) {
                                  if (d === focus) {
                                      return "inline"
                                  } else {
                                      return "none"
                                  }
                              })
                              .style("fill-opacity", function(d) {
                                  if (d === focus) {
                                      return 1
                                  } else {
                                      return 0
                                  }
                              })
                          

                          // remove visibility of text elements at level we zoomed in from
                          this.style.display = "none"
                      }
                  })

              // update font size for method type on transition
              transition.selectAll("tspan")
                  .filter(function() {
                      return d3.select(this).attr("id") == "top";
                  })
                  .attr("dy", function(d) {
                      if (focus.height === 1) {
                          return 10
                      } else {
                          return -30
                      }
                  })  
                  .attr("font-size", function(d) {
                      if (focus.height === 1) {
                          return 28
                      } else {
                          return 38
                      }
                  })      
                  
              
              // update font size for other types on transition
              transition.selectAll("tspan")
                  .filter(function() {
                      return d3.select(this).attr("id") =="bottom" ;
                  })
                  .style("font-size", function(d) {
                      if (focus.height === 1) {
                          return "0px"
                      } else {
                          return "32px"
                      }
                  })

          }

          function zoomTo(v) {
              var k = diameter / v[2]; view = v;
              node.attr("transform", function(d) {
                  return `translate(${(d.x - v[0])*k}, ${(d.y - v[1])*k})rotate(0)`; 
              })
              circle.attr("r", function(d) { return d.r * k; });
          }

      }).catch(err => console.log(err))
    }
  }
</script>


<style>
.node {
    cursor: pointer;
}

.node:hover {
    stroke: #000000;
    stroke-width: 1.8px;
}

.node--leaf {
    fill: rgb(255, 172, 71);
}

.label, .labelLow {
    font: 38px "Helvetica Neue", Helvetica, Arial, sans-serif;
    text-anchor: middle;
    text-shadow: 0 0.4px 0 #fff, 0.4px 0 0 #fff, -0.4px 0 0 #fff, 0 -0.4px 0 #fff;
}
</style>