<!--
  This page displays a D3 visualization of the various analyte classes that appear in AMOS's methods, and how they
  relate to each other.  The nodes in this visualization link back to the methods list, pre-populating the "Analyte"
  field there with the selected analyte.

  Updating the data can be done using the HierarchyHelper.py script in the src/assets folder.
-->

<template>
  <p>This page has a visualization of the classes of method analytes in the database and the relationships between them.  Hover over one of the circles in the plot to see a description of the analyte class -- this will also highlight any parent or child classes that are in the plot as well.  Clicking on a circle will open the method list in a new tab with a filter on that analyte.  You can also use the controls on the right to find specific analyte classes, either by going through the full list or using the search bar.</p>
  <p>The visualization can be zoomed in or out.</p>
  <div class="analyteClassContainer">
    <svg id="analyteClassSvg" width="1000" height="700"></svg>
  </div>
</template>

<script>
  import * as d3 from "d3";
  import '@/assets/analyte_class.css'


  export default {
    mounted() {
      d3.json("analyte_hierarchy.json") 
        .then(function(graph) {

        var svg = d3.select('#analyteClassSvg'),
          width = +svg.attr("width"),
          height = +svg.attr("height");
        
        // add zooming/panning
        let zoom = d3.zoom()
          .on('zoom', handleZoom);

        function handleZoom(e) {
          d3.selectAll('svg g')
            .attr('transform', e.transform);
          }

        function initZoom() {
          d3.select('svg')
            .call(zoom)
            .call(zoom.transform, d3.zoomIdentity.translate(width/2-100, height/2).scale(0.2))
        }

        var simulation = d3.forceSimulation()
          .force("link", d3.forceLink().id(function(d) {
            return d.id;
          }).strength(2).distance(80))
          .force("charge", d3.forceManyBody().strength(-800).distanceMax(720))
          .force("center", d3.forceCenter(width / 2, height / 1.8))
          .force("y", d3.forceY(height).strength(0.12))
          .force("x", d3.forceX(width/2).strength(0.018))
          .force("collision", d3.forceCollide().strength(1.05).radius( (d) => d.r + 60 ).iterations(1))
          .on("end", function(d) {
            d3.selectAll("path")
              .transition()
                .duration(500)
                .style("opacity", 1)
            d3.selectAll(".arrow")
              .transition()
                .duration(1000)
                .style("opacity", 1)
          })

        var link = svg.append("g")
          .attr("class", "links")
          .selectAll("path")
          .data(graph.links)
          .enter().append("path")
          .attr('marker-mid', function(d) {
            var myId = `arrow_${d.target.replace(/\s/g, "")}_${d.source.replace(/\s/g, "")}`
            svg.append("svg:defs").append("svg:marker")
            .attr("id", myId)
            .attr("class", "arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr('refX', `6`)//so that it comes towards the center.
            .attr("markerWidth", 12)
            .attr("markerHeight", 12)
            .attr("orient", "auto")
          .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5L2.5,0L0,-5")
            return `url(#${myId})`
          })

        // define div for tooltip
        var div = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0)

        var class_names = d3.select("div.analyteClassContainer").append("div")
          .attr("class", "class_names")
          .append("p")
          .text("AMOS Analyte Classes")
          .style("font-size", "2.2rem")
          .style("padding-left", "20px")
          .style("color", "white")
        d3.select('div.class_names')
          .append("div")
          .attr("class", "analyteClassContainer inner")
          .attr("id", "functional_analyteClassContainer")
          .append("div")
          .attr("class", "legend")
          .attr("id", "functional_legend")
        d3.select('#functional_analyteClassContainer')
          .append("div")
          .text("Functional Class")
          .style("color", "white")
          .style("font-size", "1.7rem")
          .style("margin-left", "5px")
          .style("margin-top", "auto")
          .style("margin-bottom", "auto")
          .style("color", "lightgray")

        d3.select('div.class_names')
          .append("div")
          .attr("class", "analyteClassContainer inner")
          .attr("id", "structural_analyteClassContainer")
          .append("div")
          .attr("class", "legend")
          .attr("id", "structural_legend")
        d3.select('#structural_analyteClassContainer')
          .append("div")
          .text("Structural Class")
          .style("color", "white")
          .style("font-size", "1.7rem")
          .style("margin-left", "5px")
          .style("margin-top", "auto")
          .style("margin-bottom", "auto")
          .style("color", "lightgray")

        d3.select('div.class_names')
          .append("div")
          .attr("class", "analyteClassContainer inner")
          .attr("id", "parent_analyteClassContainer")
          .append("div")
          .attr("class", "legend")
          .attr("id", "parent_legend")
        d3.select('#parent_analyteClassContainer')
          .append("div")
          .text("Parent Class (On-Hover)")
          .style("color", "white")
          .style("font-size", "1.7rem")
          .style("margin-left", "5px")
          .style("margin-top", "auto")
          .style("margin-bottom", "auto")
          .style("color", "lightgray")

        d3.select('div.class_names')
          .append("div")
          .attr("class", "analyteClassContainer inner")
          .attr("id", "focus_analyteClassContainer")
          .append("div")
          .attr("class", "legend")
          .attr("id", "focus_legend")
        d3.select('#focus_analyteClassContainer')
          .append("div")
          .text("Focused Class (On-Hover)")
          .style("color", "white")
          .style("font-size", "1.7rem")
          .style("margin-left", "5px")
          .style("margin-top", "auto")
          .style("margin-bottom", "auto")
          .style("color", "lightgray")

        d3.select('div.class_names')
          .append("div")
          .attr("class", "analyteClassContainer inner")
          .attr("id", "child_analyteClassContainer")
          .append("div")
          .attr("class", "legend")
          .attr("id", "child_legend")
        d3.select('#child_analyteClassContainer')
          .append("div")
          .text("Child Class (On-Hover)")
          .style("color", "white")
          .style("font-size", "1.7rem")
          .style("margin-left", "5px")
          .style("margin-top", "auto")
          .style("margin-bottom", "auto")
          .style("color", "lightgray")

        // searchbar for class names
        d3.select("div.class_names")
          .append('input')
          .attr("type", "text")
          .attr('id', 'class_input')
          .style("margin-left", "40px")
          .style("margin-top", "25px")
          .style("margin-bottom", "-20px")
          .style("width", "300px")
          .style("border", "2px solid orange")
          .style("border-radius", "4px")
          .attr("placeholder", "Search Classes")
          .on("keyup", function(e) {
            let search = String(this.value);
            d3.selectAll("div.class_names li")
              .style("display", function(d) {
                if (search === '') {
                  return "grid"
                } else if (d.id.toLowerCase().includes(search.toLowerCase())) {
                  return "grid"
                } else {
                  return "none"
                }
              })
          })

        d3.select("div.class_names")
          .append("ul")
          .style("margin-top", "30px")
          .selectAll("li")
          .data(graph.nodes)
          .enter().append("li")
          .attr("id", (d) => `${d.id.replace(/\s/g, "")}_classname`)
          .attr("z-order", "500")
          .attr('url', (d) => d.url)
          .text((d) => d.id)
          .style("font-size", "1.3rem")
          .style("margin-bottom", "5px")
          .style("color", "white")
          .style("display", "grid")
          
        d3.selectAll('li')
          .on("mouseover", function(d) {
            d3.select(this)
              .transition()
                .duration(300)
                .style("color", "rgb(255, 219, 39)");
            var myId = this.id.split("_")[0] + "_node";
            d3.select(`.${myId}`)
              .transition()
                .duration(300)
                .style("stroke-width", "4px")
                .style("stroke", "yellow")
              .transition()
                .duration(300)
                .attr("r", (d) => 80)
              .transition()
                .duration(300)
                .attr("r", (d) => d.r)
          })
          .on("mouseout", function(d) {
            d3.select(this)
              .transition()
                .duration(300)
                .style("color", "white");
            var myId = this.id.split("_")[0] + "_node";
            d3.select(`.${myId}`)
              .transition()
                .duration(300)
                .style("stroke-width", "1.5px")
                .attr("r", (d) => d.r)
                .style("stroke", function(d) {
                if (d3.select(this).classed("functional")) {
                  return "aqua"
                } else {
                  return "magenta"
                }
              })
          })
          .on('click', function(d) {
            var myId = this.id.split("_")[0].replace(/([a-z0-9])([A-Z])/g, '$1 $2')
            var myURL = filterById(graph.nodes, myId).url
            window.open(
              myURL,
              '_blank'
            )
          })


        var node = svg.append("g")
          .attr("class", "nodes")
          .selectAll("circle")
          .data(graph.nodes)
          .enter().append("circle")
          .attr("r", (d) => d.r)
          .attr("class", function(d) {
            var class_name = d.id;
            if (d.type === "Functional") {
              return `functional ${class_name.replace(/\s/g, "")}_node`
            } else if (d.type === "Structural") {
              return `structural ${class_name.replace(/\s/g, "")}_node`
            }
          })
          .attr('id', (d) => d.id)
          .on("mouseover", function (e) {
            const[x, y] = [e.clientX, e.clientY]
            var dat = filterById(graph["nodes"], this.id);
            var class_name = dat.id;
            d3.select('.' + class_name.replace(/\s/g, "") + "_node")
              .transition()
              .duration(300)
              .style("stroke-width", "4px")
              .style("stroke", "yellow");
            if ((dat.parents !== "None")) {
              var parents = dat.parents.join("; ")
              for (let i in dat.parents) {
                var p = dat.parents[i]
                d3.selectAll(`.${p.replace(/\s/g, "")}_node`)
                  .transition()
                  .duration(300)
                  .style("stroke-width", "4px")
                  .style("stroke", "red");
                
                var myId = `#arrow_${class_name.replace(/\s/g, "")}_${p.replace(/\s/g, "")}`;
                d3.selectAll(myId)
                  .transition()
                    .duration(400)
                    .attr("markerWidth", 20)
                    .attr("markerHeight", 20)
                    .style("fill", "rgb(200, 130, 130)")
                  .transition()
                    .duration(200)
                    .attr("markerHeight", 20)
                    .attr("markerHeight", 20)
                  .transition()
                    .duration(300)
                    .attr("markerHeight", 16)
                    .attr("markerHeight", 16);
              }
            } else {
              var parents = "None";
            };
            if ((dat.children !== "None")) {
              var children = dat.children.join("; ")
              for (let i in dat.children) {
                var c = dat.children[i]
                d3.selectAll(`.${c.replace(/\s/g, "")}_node`)
                  .transition()
                  .duration(300)
                  .style("stroke-width", "4px")
                  .style("stroke", "lime")

                var myId = `#arrow_${c.replace(/\s/g, "")}_${class_name.replace(/\s/g, "")}`;
                d3.selectAll(myId)
                  .transition()
                    .duration(400)
                    .attr("markerWidth", 20)
                    .attr("markerHeight", 20)
                    .style("fill", "rgb(167, 206, 169)")
                  .transition()
                    .duration(200)
                    .attr("markerHeight", 20)
                    .attr("markerHeight", 20)
                  .transition()
                    .duration(300)
                    .attr("markerHeight", 16)
                    .attr("markerHeight", 16);
              }
            } else {
              var children = "None";
            };
            var description = dat.description;
            div.transition()
              .duration(200)
              .style("opacity", 1)
            // div.html("<span style='font-size:1.8rem'>" + class_name + "</span><br/>" + description + "<br/><br/><b>Parents:</b> " + parents + "<br/><b>Children:</b> " + children)
            div.html("<span style='font-size:1.5rem'>" + class_name + "</span><br/><br/><span style='font-size:1rem'>" + description + "</span>")
              .style("left", (x + 30) + "px")		
              .style("top", (y - 40) + "px")
              .style("line-height", "1.1rem")
          })
          .on("mouseout", function(d) {
            d3.selectAll('circle')
              .transition()
              .duration(300)
              .style("stroke-width", "1.5px")
              .style("stroke", function(d) {
                if (d3.select(this).classed("functional")) {
                  return "aqua"
                } else {
                  return "magenta"
                }
              })
            div.transition()
              .duration(300)
              .style("opacity", 0)
            d3.selectAll(".arrow")
              .transition()
                .duration(250)
                .attr("markerHeight", 12)
                .attr("markerWidth", 12)
                .style("fill", "rgb(255, 203, 131)")
          })
          .on('click', function(d) {
            var myId = this.id
            var myURL = filterById(graph.nodes, myId).url
            window.open(
              myURL,
              '_blank'
            )
          });
        
        function filterById(jsonObject, id) {
            return jsonObject.filter(function(jsonObject) {return (jsonObject['id'] == id);})[0];}

        initZoom();

        simulation
          .nodes(graph.nodes)
          .on("tick", ticked)
          .alpha(1);

        simulation.force("link")
          .links(graph.links);


        function ticked() {

          var k = 16 * simulation.alpha();

          node
            .attr("cx", (d) => d.x)
            .attr("cy", (d) => d.y)
          // use this commented code to keep nodes within boundary
            // .attr("cx", function(d) {
            //   return (d.x = Math.max(d.r, Math.min(width - 1.75*d.r, d.x)));
            // })
            // .attr("cy", function(d) {
            //   return (d.y = Math.max(1.75*d.r, Math.min(height - 1.75*d.r, d.y)));
            // })

          // Push sources up and targets down to form a weak tree.
          link
            .each(function(d) {
              d.source.y -= k, d.target.y += k;
            })
            .attr("d", function(d) { 
              var midX = (d.source.x + d.target.x)/2
              var midY = (d.source.y + d.target.y)/2
              return `M ${d.source.x} ${d.source.y} L ${midX} ${midY} L ${d.target.x} ${d.target.y}`
            })
        ;
        }
      })
  }
}
</script>

<style>

</style>