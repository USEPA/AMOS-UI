<!--
  This page displays a D3 visualization of the various analyte classes that appear in AMOS's methods, and how they
  relate to each other.  The nodes in this visualization link back to the methods list, pre-populating the "Analyte"
  field there with the selected analyte.

  Updating the data can be done using the HierarchyHelper.py script in the src/assets folder.
-->

<template>
  <p>This page has a visualization of the classes of functional use classes in the database and the relationships between them.  Hover over one of the circles in the plot to see a description of the analyte class -- this will also highlight any parent or child classes that are in the plot as well.  You can also use the controls on the right to look for specific functional classes, either by going through the full list or using the search bar.</p>
  <p>Double-clicking on a circle in the graph or an element in the dropdown list on the right will open the method list in a new tab with a filter on that classificiation; right-clicking will open a similar view of the fact sheets.  The visualization can be zoomed in or out.</p>
  <div class="analyteClassContainer">
    <svg id="analyteClassSvg" width="100%" height="900"></svg>
    <div id="rightClickMenu">
      <a id="rightClickMenuMethods" href="#" target="_blank">Methods List</a>
      <hr />
      <a id="rightClickMenuFactSheets" href="#" target="_blank">Fact Sheets List</a>
    </div>
  </div>
</template>

<script>
  import * as d3 from "d3";
  import '@/assets/analyte_class.css'

  export default {
    mounted() {
      d3.json("json_with_positions.json") 
        .then(function(graph) {

        var svg = d3.select('#analyteClassSvg');
        svg.style("width", '100%');
        svg.style("height", '900px')
        var width = +svg.attr("width"),
          height = +svg.attr("height");
        
        // add zooming/panning
        let zoom = d3.zoom()
          .on('zoom', function(e) {
            d3.selectAll('svg g')
              .attr('transform', e.transform);
            let matrix = document.getElementById('analyteClassSvg').firstChild.getAttribute('transform');
            let m = matrix.slice(10, matrix.length-1).split(' ');
            graph.zoomFactor = Number(m[1].split(',')[0].split('scale(')[1]);
            graph.panX = Number(m[0].split(',')[0]);
            graph.panY = Number(m[0].split(',')[1].split(')')[0]);
          }
        );

        function handleZoom(e) {
          d3.selectAll('svg g')
            .attr('transform', e.transform);
          }

        function initZoom() {
          d3.select('svg')
            .call(zoom)
            .call(zoom.transform, d3.zoomIdentity.translate(700, 560).scale(0.15))
        }

          var link = svg.append("g")
            .attr("class", "links")
            .selectAll("path")
            .data(graph.links)
            .enter().append("path")
            .attr('id', function(d) {
              return `${d.source.id}_to_${d.target.id}`
            })
            .attr('marker-mid', function(d) {
              var myId = `arrow_${d.target.id}_${d.source.id}`
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
          .text("AMOS Analyte Functional Use Classes")
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
          .style("font-size", "1.5rem")
          .style("margin-left", "3px")
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
          .style("font-size", "1.5rem")
          .style("margin-left", "3px")
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
          .style("font-size", "1.5rem")
          .style("margin-left", "3px")
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
          .style("font-size", "1.5rem")
          .style("margin-left", "3px")
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
          // .style("height", "50px")
          .style('font-size', '24px')
          .style('padding', '5px')
          .style("border", "2px solid orange")
          .style("border-radius", "4px")
          .attr("placeholder", "Search Classes")
          .on("keyup", function(e) {
            let search = String(this.value);
            for (const doc of document.getElementsByClassName('functional_class')) {
              let id = doc.id;
              let d3_li = d3.select(`#${id}`);
              let name = d3_li._groups[0][0].__data__.name;
              if (search === '') {
                if (doc.id.split('_').length > 2) {
                  doc.style.display = "none";
                  doc.style.fontSize = '0rem';
                } else {
                doc.style.display = "grid";
                doc.style.fontSize = '1.3rem';
                }
              } else if (name.toLowerCase().includes(search.toLowerCase())) {
                doc.style.display = "grid";
                docID_split = doc.id.split('_');
                for (let d = 0; d < docID_split.length-1; d++) {
                  let newID = docID_split.slice(0,d+1).join('_') + '_classname'
                  var new_doc = document.getElementById(newID);
                  new_doc.style.display = "grid";
                  new_doc.style.fontSize = "1.3rem"
                }
              } else {
                doc.style.fontSize = '0rem'
                doc.style.display = "none"
              }
            }
          })

        var class_names = d3.select("div.class_names")
          .append("ul")
          .style("margin-top", "30px")
          .selectAll("li")
          .data(graph.nodes.filter(function(d) {
            return d.parents === 'None';
          }))
          .enter().append("li")
          .text((d) => d.name)
          .attr("id", (d) => `${d.id.replace(/\s/g, "")}_classname`)
          .attr("z-order", "500")
          .attr('url', (d) => d.url)
          .style("font-size", "1.3rem")
          .attr("class", 'functional_class')
          .style("margin-bottom", "5px")
          .style("color", "white")
          .style("display", "grid")

        function add_children(selector) {
          var dataset = graph.nodes.filter(function(d) {
            var sp = selector.id.split('_');
            return d.id === sp[sp.length-2];
          })[0];
          if (dataset.children === 'None') {
            return 0;
          }
          var test = d3.select("li#"+selector.id)
            .append('ul')
            .style("margin-top", "10px")
            .selectAll("li")
            .data(graph.nodes.filter(function(dp) {
                if (dp.parents === 'None') {
                  return false;
                }
                return dp.parents.includes(selector.id.split('_').slice(-2,-1)[0])
              })
            )
            .enter().append("li")
            .text((d) => d.name)
            .attr("id", (d) => `${selector.id.split('_').slice(0,-1).join('_')}_${d.id.replace(/\s/g, "")}_classname`)
            .attr("class", 'functional_class')
            .attr("z-order", "500")
            .attr('url', (d) => d.url)
            .style("font-size", "1.3rem")
            .style("font-size", "0px")
            .style("margin-bottom", "5px")
            .style("color", "white")
            .style("display", "none")
          
          for (const s of test._groups[0]) {
            add_children(s);
          }
        }
        for (const selector of class_names._groups[0]) {
          add_children(selector)
        }

        d3.selectAll('li')
          .on("mouseover", function(d) {
            if (this === d.target) {
              d3.select(this)
                .transition()
                  .duration(300)
                  .style("color", "rgb(255, 219, 39)");
            } else {
              d3.select(this)
                .transition()
                  .duration(300)
                  .style("color", "rgb(255, 150, 150)");
            }
            var myId = this.id.split("_").slice(-2,-1) + "_node";
            if (this === d.target) {
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
            } else {
              d3.select(`.${myId}`)
                .transition()
                  .duration(300)
                  .style("stroke-width", "4px")
                  .style("stroke", "red")
                .transition()
                  .duration(300)
                  .attr("r", (d) => 80)
                .transition()
                  .duration(300)
                  .attr("r", (d) => d.r)
            }
          })
          .on("mouseout", function(d) {
            d3.select(this)
              .transition()
                .duration(300)
                .style("color", "white");
            var myId = this.id.split("_").slice(-2,-1) + "_node";
            d3.select(`.${myId}`)
              .transition()
                .duration(300)
                .style("stroke-width", "1.5px")
                .attr("r", (d) => d.r)
                .style("stroke", "aqua")
          })
          .on("click", function(d) {
            if (this === d.target) {
              for (const doc of document.getElementsByClassName('functional_class')) {
                let id = doc.id;
                if (id.split('_').slice(-3,-2)[0] === d.target.__data__.id) {
                  if (doc.style.display === 'none') {
                    doc.style.display = 'grid';
                    d3.select("#"+id)
                      .transition().duration(200)
                        .style("font-size", '1.3rem')
                  } else {
                    d3.select("#"+id)
                      .transition().duration(200)
                        .style("font-size", '0rem')
                        .on("end", function() {
                          this.style.display = 'none';
                        })
                  }
                } 
              }
            }
          })
          .on("contextmenu", function(e) {
            if (this === e.target) {
              var posX = e.clientX,
                posY = e.clientY;
              var myId = this.id.split("_")[this.id.split('_').length-2]
              var methods_url = filterById(graph.nodes, myId).url
              var fact_sheets_url = methods_url.replace('methods_list', 'fact_sheet_list').replace("chemical_class", 'functional_classes')
              menu(posX, posY, methods_url, fact_sheets_url);
            }
            e.preventDefault();
          })

        var dragHandler = d3.drag()
          .filter((e) => e.ctrlKey)
          .on("drag", function(e, d) {
            var current = d3.select(this)
            current
              .attr('cx', (e.sourceEvent.offsetX - graph.panX)/graph.zoomFactor)
              .attr('cy', (e.sourceEvent.offsetY - graph.panY)/graph.zoomFactor)

            var thisId = d.id;
            if (d.parents !== 'None') {
              for (const parent of d.parents) {
                var linkId = `${parent}_to_${thisId}`;
                var my_link = document.getElementById(linkId);
                var new_d = my_link.getAttribute('d').split(' ')
                new_d[7] = current.attr('cx')
                new_d[8] = current.attr('cy')
                new_d[4] = (Number(new_d[1]) + Number(new_d[7]))/2
                new_d[5] = (Number(new_d[2]) + Number(new_d[8]))/2
                new_d = new_d.join(' ')
                my_link.setAttribute('d', new_d)
              }
            }
            if (d.children !== 'None') {
              for (const child of d.children) {
                var linkId = `${thisId}_to_${child}`;
                var my_link = document.getElementById(linkId);
                var new_d = my_link.getAttribute('d').split(' ')
                new_d[1] = current.attr('cx')
                new_d[2] = current.attr('cy')
                new_d[4] = (Number(new_d[1]) + Number(new_d[7]))/2
                new_d[5] = (Number(new_d[2]) + Number(new_d[8]))/2
                new_d = new_d.join(' ')
                my_link.setAttribute('d', new_d)
              }
            }
            })
          .on('end', function(e, d) {
            const current = d3.select(this);
            const index = current._groups[0][0].__data__['index'];
            filterById(graph['nodes'], this.id)['x'] = current.attr('cx');
            filterById(graph['nodes'], this.id)['y'] = current.attr('cy');
            for (let link_i in graph['links']) {
              if (graph['links'][link_i]['source']['id'] === this.id) {
                graph['links'][link_i]['source']['x'] = current.attr('cx');
                graph['links'][link_i]['source']['y'] = current.attr('cy');
              } else if (graph['links'][link_i]['target']['id'] === this.id) {
                graph['links'][link_i]['target']['x'] = current.attr('cx');
                graph['links'][link_i]['target']['y'] = current.attr('cy');
              }
            }
          })

        var node = svg.append("g")
          .attr("class", "nodes")
          .selectAll("circle")
          .data(graph.nodes)
          .enter().append("circle")
          .attr("r", (d) => d.r)
          .attr("class", (d) => `${d.id}_node`)
          .attr('id', (d) => d.id)
          .on("mouseover", function (e) {
            if (!e.ctrlKey) {
              const[x, y] = [e.clientX, e.clientY]
              var dat = filterById(graph["nodes"], this.id);
              var class_name = dat.id;
              var name = dat.name;
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
              var rect = document.getElementById('analyteClassSvg').getBoundingClientRect();
              div.html("<span style='font-size:2.2rem'>" + name + "</span><br/><br/><span style='font-size:1.5rem'>" + description + "</span>")
                .style("left", (rect.left + 5) + "px")		
                .style("top", (-(rect.bottom - rect.top) - 120) + "px")
                .style("line-height", "1.5rem")
            }
          })
          .on("mouseout", function(e, d) {
            d3.selectAll('circle')
              .transition()
              .duration(300)
              .style("stroke-width", "1.5px")
              .style("stroke", 'aqua')
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
          .on("contextmenu", function(e, d) {
            var posX = e.clientX,
              posY = e.clientY;
            var methods_url = filterById(graph.nodes, this.id).url;
            var fact_sheets_url = methods_url.replace('methods_list', 'fact_sheet_list').replace("chemical_class", 'functional_classes')
            menu(posX, posY, methods_url, fact_sheets_url);
            e.preventDefault();
          })
          .call(dragHandler)
        
        document.addEventListener("click", function(e) {
          var i = document.getElementById("rightClickMenu").style;
          i.opacity = "0";
          setTimeout(function() {
            i.visibility = "hidden";
          }, 501)
        })

        function menu(x, y, urlMethods, urlFactSheets) {
          var i = document.getElementById("rightClickMenu").style;
          i.top = y + "px";
          i.left = x + "px";
          i.visibility = "visible";
          i.opacity = "1";
          document.getElementById("rightClickMenuMethods").href = urlMethods
          document.getElementById("rightClickMenuFactSheets").href = urlFactSheets
        }

        function filterById(jsonObject, id) {
            return jsonObject.filter(function(jsonObject) {return (jsonObject['id'] == id);})[0];}

        function randomNumber(min, max) {
          return Math.floor(Math.random() * (max-min) + min);
        }

        initZoom();
        
        node
          .attr('cx', () => randomNumber(-3200, 6500))
          .attr('cy', () => randomNumber(-3400, 2200))
          .transition()
            .duration(3000)
            .attr("cx", (d) => d.x)
            .attr("cy", (d) => d.y)
        
        link
          .attr("d", function(d) { 
            var midX = (Number(d.source.x) + Number(d.target.x))/2
            var midY = (Number(d.source.y) + Number(d.target.y))/2
            return `M ${d.source.x} ${d.source.y} L ${midX} ${midY} L ${d.target.x} ${d.target.y}`
          })
          .style('opacity', 0)
          .transition()
            .delay(3000)
            .duration(500)
            .style("opacity", 1)

        function download() {
          var a = document.createElement("a");
          var file = new Blob([JSON.stringify(graph)], {type: 'text/plain'});
          a.href = URL.createObjectURL(file);
          a.download = 'json_with_positions.json';
          a.click();
          URL.revokeObjectURL(a.href)
        }

        /* const button = document.getElementById('savePositionsButton');
        button.addEventListener('click', download) */
      })


  }
}
</script>

<style>

</style>