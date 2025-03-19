<template>
  <p>Primary interactions:</p>
  <ul>
    <li>Hover over the heatmap to see individual data points.</li>
    <li>Click and drag across a region of the plot to zoom in.  Use Ctrl-Space to toggle between the zoomed-out view and the last zoomed-in level.</li>
    <li>Hover over the title text to see aggregate statistics of the data.  Click it to more clearly shows failures in the heatmap.</li>
    <li>Hover over the labels along the vertical axis to get per-feature summaries.</li>
    <li>Use the sliders below the plot to adjust various thresholds.  The heatmap will automatically update after adjustments.</li>
  </ul>
  <p>Caution: This visualization is GPU-intensive, and may lag on some devices.</p>
  <div id="heatmapContainer">
    <canvas id="heatmap"></canvas>
    <!-- Need to have this dummy element for the canvas-adding function to lock on to, otherwise the page elements end up changing order and getting screwed up on the page. -->
    <div id="dummyChild"></div>
    <div id="controls" class="heatmap-control-box">
      <div style="margin: 10px 0px;">
        <label>Sample Replicate Threshold</label>
        <div style="display: flex;">
          <input type="range" id="replicateSampleThreshold" min="0" max="100" step="0.1" v-model.number="minReplicateHitsPercent" class="heatmap-slider-input" @mouseup="thresholdUpdate('minReplicateHitsPercent', 0, 100)">
          <input type="number" id="replicateSampleThresholdBox" min="0" max="100" step="0.1" v-model.number="minReplicateHitsPercent" class="heatmap-numeric-box-input" @keyup.enter="thresholdUpdate('minReplicateHitsPercent', 0, 100)">
        </div>
      </div>
      <div style="margin: 10px 0px;">
        <label>Blank Replicate Threshold</label>
        <div style="display: flex;">
          <input type="range" id="replicateBlankThreshold" min="0" max="100" step="0.1" v-model.number="minReplicateBlankHitPercent" class="heatmap-slider-input" @mouseup="thresholdUpdate('minReplicateBlankHitPercent', 0, 100)">
          <input type="number" id="replicateBlankThresholdBox" min="0" max="100" step="0.1" v-model.number="minReplicateBlankHitPercent" class="heatmap-numeric-box-input" @keyup.enter="thresholdUpdate('minReplicateBlankHitPercent', 0, 100)">
        </div>
      </div>
      <div style="margin: 10px 0px;">
        <label>CV Threshold</label>
        <div style="display: flex;">
          <input type="range" id="cvThreshold" min="0" max="3" step="0.01" v-model.number="maxReplicateCvValue" class="heatmap-slider-input" @mouseup="thresholdUpdate('maxReplicateCvValue', 0, 3)">
          <input type="number" id="cvThresholdBox" min="0" max="3" step="0.01" v-model.number="maxReplicateCvValue" class="heatmap-numeric-box-input" @keyup.enter="thresholdUpdate('maxReplicateCvValue', 0, 3)">
        </div>
      </div>
      <div style="margin: 10px 0px;">
        <label>MRL Multiplier</label>
        <div style="display: flex;">
          <input type="range" id="mrlMultiplier" min="0" max="10" step="1" v-model.number="mrlMult" class="heatmap-slider-input" @mouseup="mrlUpdate">
          <input type="number" id="mrlMultiplierBox" min="0" max="10" step="1" v-model.number="mrlMult" class="heatmap-numeric-box-input" readonly>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as THREE from 'three';
  import * as TWEEN from '@tweenjs/tween.js';

  import * as dataUtils from '@/assets/heatmapDataUtils.js';
  import * as heatmapUtils from '@/assets/heatmapUtils.js';
  import '@/styles/occurrence_heatmap.css'

  
  export default {
    data() {
      return {
        first_pass: true,
        minReplicateHitsPercent: 0,
        minReplicateBlankHitPercent: 0,
        maxReplicateCvValue: 0,
        mrlMult: 3
      }
    },
    mounted() {
      this.createOccurrenceHeatmap()
      this.first_pass = false
    },
    props: {workbook: Object},
    methods: {
      thresholdUpdate(variable_name, min, max) {
        if (this[variable_name] < min) {
          this[variable_name] = min
        } else if (this[variable_name] > max) {
          this[variable_name] = max
        }

        const children = Array.from(document.getElementById("heatmapContainer").children)
        children.forEach(child => {
          if (child.id !== "dummyChild" && child.id !== "controls") {
            child.remove();
          }
        });

        this.createOccurrenceHeatmap(null, this.minReplicateHitsPercent, this.minReplicateBlankHitPercent, this.maxReplicateCvValue, this.mrlMult);
      },
      mrlUpdate() {
        if (this.mrlMult < 4) {
          this.mrlMult = 3
        } else if (this.mrlMult < 7.5) {
          this.mrlMult = 5
        } else {
          this.mrlMult = 10
        }
        
        const children = Array.from(document.getElementById("heatmapContainer").children)
        children.forEach(child => {
          if (child.id !== "dummyChild" && child.id !== "controls") {
            child.remove();
          }
        });

        this.createOccurrenceHeatmap(null, this.minReplicateHitsPercent, this.minReplicateBlankHitPercent, this.maxReplicateCvValue, this.mrlMult);
      }, 
      createOccurrenceHeatmap(data=null, minSample=null, minBlank=null, maxCv=null, mrlMult=null) {
        
        // read in and parse data from files
        var [
          data,
          minReplicateHitsPercent,
          minReplicateBlankHitPercent,
          maxReplicateCvValue,
          MrlMult
        ] = dataUtils.getOccurrenceAndParameterData(this.workbook);
        if (minSample !== null) {
          var minReplicateHitsPercent = minSample;
          var minReplicateBlankHitPercent = minBlank;
          var maxReplicateCvValue = maxCv;
          var MrlMult = mrlMult;
        } else {
          this.minReplicateHitsPercent = minReplicateHitsPercent
          this.minReplicateBlankHitPercent = minReplicateBlankHitPercent
          this.maxReplicateCvValue = maxReplicateCvValue
          this.mrlMult = MrlMult
        }
        
        let thresholdData = {
          minReplicateBlankHitPercent,
          minReplicateHitsPercent,
          maxReplicateCvValue,
          MrlMult
        };
        
        // get unique sample headers
        const sampleGroups = dataUtils.getUniqueSampleHeaders(data);
        
        // find the blank sample names
        const [
          blankMeanHeader, 
          blankStdHeader, 
          blankRepPerHeader
        ] = dataUtils.getBlankHeaders(sampleGroups);

        // get rep_percent, CV and Mean cols for data
        const [
          repColHeaders, 
          cvColHeaders, 
          meanColHeaders
        ] = dataUtils.getRepCvMeanHeaders(sampleGroups);

        // Calculate the MRL
        data = dataUtils.calcMRL(
          data, 
          blankMeanHeader, 
          blankStdHeader, 
          blankRepPerHeader, 
          MrlMult, 
          minReplicateBlankHitPercent
        );
        
        // get subset of data for CV columns
        let cvData = dataUtils.getCvSubset(data, cvColHeaders);
        
        // replace cvValues with null if don't pass n_abun / MRL cutoffs
        let cvDataDiscrete = dataUtils.cleanCvDataAndGetDiscretizedData(
          cvData, data,
          minReplicateBlankHitPercent, minReplicateHitsPercent, maxReplicateCvValue,
          repColHeaders, cvColHeaders, meanColHeaders, blankRepPerHeader
        );

        // flatten data for generating three.js heatmap
        let cvDataFlat;
        [
          cvDataFlat, 
          data
        ] = dataUtils.getFlattenedCvData(cvDataDiscrete, data, sampleGroups);
        
        // get counts (n_samples, n_features, n_passes for each sample)
        const nFeatures = cvDataDiscrete.length;
        const samplePassCounts = dataUtils.getSamplePassCounts(cvDataFlat, nFeatures);

        // we need counts for how many cells are red, grey and white
        let [
          redCount, 
          greyCount, 
          whiteCount
        ] = dataUtils.getColorCounts(cvDataFlat);

        // draw heatmap
        drawHeatMap(this.first_pass);


        function drawHeatMap(first_pass) {
          // await new Promise(r => setTimeout(r, 3000));
          // determine number of rows and columns
          const nRows = cvColHeaders.length;
          const nCols = cvDataDiscrete.length;
          const nCells = nRows * nCols;

          // setup graph and cell dims
          const margin = {top: 75, right: 0, bottom: 75, left: 0};
          const width = 1300 - margin.left - margin.right;
          const height = 725 - margin.top - margin.bottom;
          const paddingHeight = 100;
          const paddingWidth = 100;
          const actualWidth = width + paddingWidth*2;
          const actualHeight = height + paddingHeight*2;

          const cellHeight = height / nRows;
          const cellWidth = width / nCols;
          const apparentCellWidth = cellWidth*1.125; // prevents gaps in between columns

          const dimsObject = {
            width,
            height,
            paddingWidth,
            paddingHeight,
            actualWidth,
            actualHeight,
            cellHeight,
            cellWidth,
            apparentCellWidth
          };
          
          // setup the renderers, cameras, orbitControls and scene
          let [
            canvas, 
            renderer, 
            labelRenderer, 
            camera, 
            cameraDefaults,
            orbitControls, 
            scene
          ] = heatmapUtils.setTheScene("heatmap", dimsObject);
          
          // set renderer bg color
          renderer.setClearColor(0xffffff, 1)

          // set dims and geometry for heatmap graph, and heatmap cells
          const [
            graphGeometry, 
            cellGeometry, 
            horzLineGeo, 
            vertLineGeo
          ] = heatmapUtils.getGeometries(dimsObject);
          
          const vertLineLimit = 60; // diff in x zoomed coords for showing vertical line separators

          // setup materials (the colors for graph bg, cells and axes)
          const [
            redMaterial,
            greyMaterial,
            whiteMaterial,
            clearMaterial,
            zoomBoxMaterial,
            blackMaterial  
          ] = heatmapUtils.getMaterials();
          
          // create instanced mesh objects, to prevent creating a new mesh for each cell of the heatmap
          let redMesh = heatmapUtils.createInstancedMesh(cellGeometry, redMaterial, redCount);
          let greyMesh = heatmapUtils.createInstancedMesh(cellGeometry, greyMaterial, greyCount);
          let whiteMesh = heatmapUtils.createInstancedMesh(cellGeometry, whiteMaterial, whiteCount);
          
          redMesh.renderOrder = 998; // ensure redMesh is rendered on top

          // create a single group for the cell meshes and add to the scene
          const heatmapGroup = new THREE.Group();
          heatmapGroup.add(redMesh);
          heatmapGroup.add(greyMesh);
          heatmapGroup.add(whiteMesh);

          scene.add(heatmapGroup);
          
          // find cell positions and colors, get red cell instances for animation later
          const redCellInstances = heatmapUtils.setCellColorAndPos(cvDataFlat, dimsObject, greyMesh, redMesh, whiteMesh);

          // add a transparent mesh to house the graph title/labels/partitions
          const graphMesh = new THREE.Mesh(graphGeometry, clearMaterial);
          scene.add(graphMesh);
          
          // add title, x-axis label, y-axis labels, horizontal and vertical partition lines
          heatmapUtils.addTitle(canvas, thresholdData, dimsObject, graphMesh);
          heatmapUtils.addXAxisLabel(canvas, dimsObject, graphMesh);
          heatmapUtils.addYAxisLabelsAndHorzLines(canvas, sampleGroups, dimsObject, horzLineGeo, blackMaterial, graphMesh, scene);
          let vertLineObjects = heatmapUtils.getVertLines(dimsObject, nFeatures, vertLineGeo, blackMaterial);
          // set up rendering loop
          animate();
          
          // build on-hover tooltips for cells, y-axis labels and title
          const titleTooltip = heatmapUtils.buildTitleTooltip();
          const yAxisTooltip = heatmapUtils.buildYAxisTooltip();    
          const tooltip = heatmapUtils.buildTooltip();
          
          // add event listeners for title (show tooltip on-hover; highlight red cells on click)
          const heatmapTitleDiv = document.querySelector(".heatmap-title");
          
          heatmapTitleDiv.addEventListener('mouseenter', (e) => {
            heatmapUtils.mouseenterTitleEvent(e, samplePassCounts, titleTooltip, heatmapTitleDiv, dimsObject);
          });

          heatmapTitleDiv.addEventListener('mouseout', () => {
            heatmapUtils.mouseoutTitleEvent(titleTooltip, heatmapTitleDiv);
          });

          var redCellZoomed = false;
          heatmapTitleDiv.addEventListener('click', (e) => {
            redCellZoomed = heatmapUtils.clickTitleEvent(e, redCellInstances, redMesh, redCellZoomed);
          });
          
          // add event listeners for y-axis labels
          const yAxisLabelDivs = document.querySelectorAll(".heatmap-y-axis-label");
          yAxisLabelDivs.forEach(label => {

            label.addEventListener('mouseenter', (e) => {
              heatmapUtils.mouseenterYAxisLabelEvent(e, label, samplePassCounts, yAxisTooltip, dimsObject);
            });

            label.addEventListener('mouseout', () => {
              heatmapUtils.mouseoutYAxisLabelEvent(null, label, yAxisTooltip);
            });

          });
          
          // now add event listeners for the cells. First set some needed variables
          var greenCheck = "&#x2705;";
          var redX = "&#x274c";

          let startX, startY, zoomBoxGeometry, zoomBox, line;
          let cachedZoomBox = null;
          let zoomed = false;
          let cachedOrbitControl = {
            x: orbitControls.target.x,
            y: orbitControls.target.y,
            z: 0
          };
          
          const raycaster = new THREE.Raycaster(); // for detecting on-hovers for heatmap cells
          const mousePos = new THREE.Vector2(); // keep track of the mouse position
          
          canvas.addEventListener("mousedown", (e) => {
            [
              startX,
              startY,
              zoomBox,
              zoomBoxGeometry
            ] = heatmapUtils.mousedownCellEvent(e, startX, startY, zoomBox, zoomBoxGeometry, zoomed);
          });

          canvas.addEventListener("mousemove", (e) => {
            heatmapUtils.mousemoveCellEvent(
              e,
              renderer,
              heatmapGroup,
              redMesh,
              whiteMesh,
              greyMesh, 
              mousePos, 
              raycaster, 
              cvDataFlat, 
              tooltip, 
              zoomBox, 
              startX, 
              startY, 
              zoomBoxGeometry, 
              zoomBoxMaterial,
              line,
              scene,
              camera,
              cameraDefaults,
              redX,
              greenCheck
            );
          });

          canvas.addEventListener('mouseup', (e) => {
            [
              zoomBox,
              cachedZoomBox,
              zoomed,
              redCellZoomed
            ] = heatmapUtils.mouseupCellEvent(
              e,
              scene,
              zoomBox,
              camera,
              cameraDefaults,
              orbitControls,
              cachedZoomBox,
              graphMesh,
              redMesh,
              zoomed,
              redCellZoomed,
              redCellInstances,
              vertLineObjects,
              vertLineLimit,
              dimsObject
            );
          });

          // add event listener to toggle back and forth between last zoom
          document.addEventListener('keydown', async (e) => {
            [ zoomed, redCellZoomed ]= await heatmapUtils.keydownDocEvent(
              e,
              scene,
              camera,
              cameraDefaults,
              zoomed,
              cachedZoomBox,
              orbitControls,
              graphMesh,
              vertLineObjects,
              vertLineLimit,
              dimsObject,
              cachedOrbitControl,
              redMesh,
              redCellInstances,
              redCellZoomed
            );
          });

          // update orbitControls to only allow panning when zoomed
          
          orbitControls.addEventListener('start', () => {
            if (!zoomed) {
              orbitControls.enablePan = false;
            }
          });

          canvas.addEventListener('mousemove', () => {
            if (zoomed) {
              orbitControls.enablePan = true;
              orbitControls.mouseButtons.RIGHT = THREE.MOUSE.PAN;
              orbitControls.mouseButtons.LEFT = THREE.MOUSE.PAN;
              orbitControls.mouseButtons.MIDDLE = THREE.MOUSE.PAN;
              cachedOrbitControl = {
                x: orbitControls.target.x,
                y: orbitControls.target.y,
                z: 0
              };
            } else {
              orbitControls.enablePan = false;
            }
          });

          // animate function for rendering scene/animating
          function animate() {
            requestAnimationFrame(animate);
            TWEEN.update();
            orbitControls.update();
            renderer.render(scene, camera);
            labelRenderer.render(scene, camera);
          }
          
          function createControls() {
            const canvasRect = canvas.getBoundingClientRect();
            const controls = document.getElementById("controls")
            
            controls.style.top = canvasRect.top + height + window.scrollY - paddingHeight*1.65 - 10 + "px";
            controls.style.left = canvasRect.left + canvasRect.width + window.scrollX + 10 + "px"; 

          }
          if (first_pass) {
            createControls();
          }

        }

      },
    }
  }
</script>

<style>
  #heatmapContainer {
    top: 80px;
    margin-top: 60px
  }
</style>