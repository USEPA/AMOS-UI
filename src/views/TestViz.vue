<template>
  <svg id="testViz" width="1000" height="700"></svg>
</template>


<script>
  import * as d3 from "d3";

  export default {
    data() {
      return {
        test_data: [
          { date: "2007-04-24", amount: 93.24, z: 1 },
          { date: "2007-04-25", amount: 95.35, z: 2 },
          { date: "2007-04-26", amount: 98.84, z: 3 },
          { date: "2007-04-27", amount: 99.92, z: 4 },
          { date: "2007-04-30", amount: 99.8, z: 5 },
          { date: "2007-05-01", amount: 99.47, z: 6 },
          { date: "2007-05-02", amount: 100.39, z: 7 },
          { date: "2007-05-03", amount: 100.4, z: 8 },
          { date: "2007-05-04", amount: 100.81, z: 9 },
          { date: "2007-05-07", amount: 103.92, z: 10 },
          { date: "2007-05-08", amount: 105.06, z: 11 },
          { date: "2007-05-09", amount: 106.88, z: 12 },
          { date: "2007-05-10", amount: 107.34, z: 13 },
        ]
      }
    },
    mounted() {
      const parseTime = d3.timeParse("%Y-%m-%d");
      const margin = 30

      var svg = d3.select('#testViz'),
        width = +svg.attr("width"),
        height = +svg.attr("height")
      
      var g = svg.append("g")

      const x = d3.scaleTime().domain(d3.extent(this.test_data, d => parseTime(d.date))).rangeRound([margin, width-margin])
      //const x = d3.scaleLinear().domain(d3.extent(this.test_data, d => d.z)).rangeRound([0, width])
      const y = d3.scaleLinear().domain(d3.extent(this.test_data, d => d.amount)).rangeRound([height, 0])

      const line = d3.line().x(function(d){ return x(parseTime(d.date))}).y(function(d) {return y(d.amount)})

      g.append("g")
        .call(d3.axisBottom(x))
        .append("text")
        .attr("transform", "translate(0," + (height-margin) + ")")
        .text("Z")

      g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Price ($)")
      
      g.append("path")
        .datum(this.test_data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line)
    }
  }
</script>