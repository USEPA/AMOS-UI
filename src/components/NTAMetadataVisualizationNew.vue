<!--
  This is a visualization of various metadata associated with the compound candidates identified by an INTERPRET NTA
  job.  It is a way of trying to rank candidates based on various aspects of the metadata.

  This component takes one prop:
  - csvString: A comma-delimited string containing per-compound metadata.  Specific fields needed can be found listed in
  the code.

  Note that this code is an attempt at rebuilding the visualization into something that worked better with Vue (see the
  file NTAMetadataVisualization.vue for the mostly-functional original version.)

  The visualization's original code was grabbed from https://github.com/shajarizwan/tripod_vis.
-->

<template>
  <div style="display: flex;">
    <div id="tripod-main-container" class="tripod-main-container">
      <div class="tripod-title-new" id="tripod-title">
        <div style="font-size: 22px; font-weight: bold;">Feature {{ selectedFeature }}</div>
        <div style="font-size: 20px">Mass: {{ featureMass }} &nbsp; RT: {{ featureRT }}</div>
        <div style="font-size: 20px"># total candidates: {{ totalCandidates }}</div>
        <div style="font-size: 20px"># removed (no metadata): {{ numCandidatesRemoved }}</div>
        <div id="buttonArray" style="display: flex; gap: 5px">
          <svg id="first-arrow" class="tripod-arrow-button" @mouseenter="iconHover('first-arrow-rect', '#3d4e634d')" @mouseleave="iconHover('first-arrow-rect', '#DBE4F0')">
            <rect id="first-arrow-rect" class="tripod-arrow-icon"></rect>
            <path d="M25 0H7a7 7 0 0 0-7 7v18a7 7 0 0 0 7 7h18a7 7 0 0 0 7-7V7a7 7 0 0 0-7-7zm5 25a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5h18a5 5 0 0 1 5 5z"></path>
            <path d="M66.6,108.91c1.55,1.63,2.31,3.74,2.28,5.85c-0.03,2.11-0.84,4.2-2.44,5.79l-0.12,0.12c-1.58,1.5-3.6,2.23-5.61,2.2 c-2.01-0.03-4.02-0.82-5.55-2.37C37.5,102.85,20.03,84.9,2.48,67.11c-0.07-0.05-0.13-0.1-0.19-0.16C0.73,65.32-0.03,63.19,0,61.08 c0.03-2.11,0.85-4.21,2.45-5.8l0.27-0.26C20.21,37.47,37.65,19.87,55.17,2.36C56.71,0.82,58.7,0.03,60.71,0 c2.01-0.03,4.03,0.7,5.61,2.21l0.15,0.15c1.57,1.58,2.38,3.66,2.41,5.76c0.03,2.1-0.73,4.22-2.28,5.85L19.38,61.23L66.6,108.91 L66.6,108.91z M118.37,106.91c1.54,1.62,2.29,3.73,2.26,5.83c-0.03,2.11-0.84,4.2-2.44,5.79l-0.12,0.12 c-1.57,1.5-3.6,2.23-5.61,2.21c-2.01-0.03-4.02-0.82-5.55-2.37C89.63,101.2,71.76,84.2,54.24,67.12c-0.07-0.05-0.14-0.11-0.21-0.17 c-1.55-1.63-2.31-3.76-2.28-5.87c0.03-2.11,0.85-4.21,2.45-5.8C71.7,38.33,89.27,21.44,106.8,4.51l0.12-0.13 c1.53-1.54,3.53-2.32,5.54-2.35c2.01-0.03,4.03,0.7,5.61,2.21l0.15,0.15c1.57,1.58,2.38,3.66,2.41,5.76 c0.03,2.1-0.73,4.22-2.28,5.85L71.17,61.23L118.37,106.91L118.37,106.91z" transform="translate(5.5, 6.5) scale(0.16) "></path>
          </svg>
          <svg id="left-arrow" class="tripod-arrow-button" @mouseenter="iconHover('left-arrow-rect', '#3d4e634d')" @mouseleave="iconHover('left-arrow-rect', '#DBE4F0')">
            <rect id="left-arrow-rect" class="tripod-arrow-icon"></rect>
            <path d="M25 0H7a7 7 0 0 0-7 7v18a7 7 0 0 0 7 7h18a7 7 0 0 0 7-7V7a7 7 0 0 0-7-7zm5 25a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5h18a5 5 0 0 1 5 5z"></path>
            <path d="m13.71 9.71-1.42-1.42-7 7a1 1 0 0 0 0 1.41l7 7 1.41-1.41L8.41 17H27v-2H8.41z"></path>
          </svg>
          <div style="padding-top: 1px">
            <input type="text" id="input-feature" placeholder="Feature ID" list="featureOptions" style="width: 85px;" />
            <datalist id="featureOptions">
              <option v-for="feature in featureList"> {{ feature }}</option>
            </datalist>
            <button id="feature-input-button">Go</button>
          </div>
          <svg id="right-arrow" class="tripod-arrow-button" @mouseenter="iconHover('right-arrow-rect', '#3d4e634d')" @mouseleave="iconHover('right-arrow-rect', '#DBE4F0')">
            <rect id="right-arrow-rect" class="tripod-arrow-icon"></rect>
            <path d="M25 0H7a7 7 0 0 0-7 7v18a7 7 0 0 0 7 7h18a7 7 0 0 0 7-7V7a7 7 0 0 0-7-7zm5 25a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5h18a5 5 0 0 1 5 5z"></path>
            <path d="m19.71 8.29-1.42 1.42 5.3 5.29H5v2h18.59l-5.29 5.29 1.41 1.41 7-7a1 1 0 0 0 0-1.41z"></path>
          </svg>
          <svg id="last-arrow" class="tripod-arrow-button" @mouseenter="iconHover('last-arrow-rect', '#3d4e634d')" @mouseleave="iconHover('last-arrow-rect', '#DBE4F0')">
            <rect id="last-arrow-rect" class="tripod-arrow-icon"></rect>
            <path d="M25 0H7a7 7 0 0 0-7 7v18a7 7 0 0 0 7 7h18a7 7 0 0 0 7-7V7a7 7 0 0 0-7-7zm5 25a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5h18a5 5 0 0 1 5 5z"></path>
            <path d="M66.6,108.91c1.55,1.63,2.31,3.74,2.28,5.85c-0.03,2.11-0.84,4.2-2.44,5.79l-0.12,0.12c-1.58,1.5-3.6,2.23-5.61,2.2 c-2.01-0.03-4.02-0.82-5.55-2.37C37.5,102.85,20.03,84.9,2.48,67.11c-0.07-0.05-0.13-0.1-0.19-0.16C0.73,65.32-0.03,63.19,0,61.08 c0.03-2.11,0.85-4.21,2.45-5.8l0.27-0.26C20.21,37.47,37.65,19.87,55.17,2.36C56.71,0.82,58.7,0.03,60.71,0 c2.01-0.03,4.03,0.7,5.61,2.21l0.15,0.15c1.57,1.58,2.38,3.66,2.41,5.76c0.03,2.1-0.73,4.22-2.28,5.85L19.38,61.23L66.6,108.91 L66.6,108.91z M118.37,106.91c1.54,1.62,2.29,3.73,2.26,5.83c-0.03,2.11-0.84,4.2-2.44,5.79l-0.12,0.12 c-1.57,1.5-3.6,2.23-5.61,2.21c-2.01-0.03-4.02-0.82-5.55-2.37C89.63,101.2,71.76,84.2,54.24,67.12c-0.07-0.05-0.14-0.11-0.21-0.17 c-1.55-1.63-2.31-3.76-2.28-5.87c0.03-2.11,0.85-4.21,2.45-5.8C71.7,38.33,89.27,21.44,106.8,4.51l0.12-0.13 c1.53-1.54,3.53-2.32,5.54-2.35c2.01-0.03,4.03,0.7,5.61,2.21l0.15,0.15c1.57,1.58,2.38,3.66,2.41,5.76 c0.03,2.1-0.73,4.22-2.28,5.85L71.17,61.23L118.37,106.91L118.37,106.91z" transform="translate(26, 26) scale(0.16) rotate(180)"></path>
          </svg>
        </div>
      </div>
      <div class="tripod-header-box" id="tripod-title-static">
        <div class="tripod-header">
          <div style="font-size: 22px; font-weight: bold;">MS2</div>
          <label style="font-size: 20px">Select plot to sort &#8239;<input type="checkbox" v-model="sortPlots.MS2" :disabled="!hasMS2"></label>
        </div>
        <div class="tripod-header">
          <div style="display: flex; align-items: center;">
            <div style="font-size: 22px; font-weight: bold;">Metadata</div>
            <!-- Old icon; may want to rework it into the default icon for HelpIcon
            <svg width="24px" height="24px" overflow="visible" class="tripod-info" @mouseenter="iconHover('help-circle', '#3d4e634d')" @mouseleave="iconHover('help-circle', '#DBE4F0')">
              <circle id="help-circle" class="help-icon-circle"></circle>
              <path d="M960 0c530.193 0 960 429.807 960 960s-429.807 960-960 960S0 1490.193 0 960 429.807 0 960 0Zm0 101.053c-474.384 0-858.947 384.563-858.947 858.947S485.616 1818.947 960 1818.947 1818.947 1434.384 1818.947 960 1434.384 101.053 960 101.053Zm-42.074 626.795c-85.075 39.632-157.432 107.975-229.844 207.898-10.327 14.249-10.744 22.907-.135 30.565 7.458 5.384 11.792 3.662 22.656-7.928 1.453-1.562 1.453-1.562 2.94-3.174 9.391-10.17 16.956-18.8 33.115-37.565 53.392-62.005 79.472-87.526 120.003-110.867 35.075-20.198 65.9 9.485 60.03 47.471-1.647 10.664-4.483 18.534-11.791 35.432-2.907 6.722-4.133 9.646-5.496 13.23-13.173 34.63-24.269 63.518-47.519 123.85l-1.112 2.886c-7.03 18.242-7.03 18.242-14.053 36.48-30.45 79.138-48.927 127.666-67.991 178.988l-1.118 3.008a10180.575 10180.575 0 0 0-10.189 27.469c-21.844 59.238-34.337 97.729-43.838 138.668-1.484 6.37-1.484 6.37-2.988 12.845-5.353 23.158-8.218 38.081-9.82 53.42-2.77 26.522-.543 48.24 7.792 66.493 9.432 20.655 29.697 35.43 52.819 38.786 38.518 5.592 75.683 5.194 107.515-2.048 17.914-4.073 35.638-9.405 53.03-15.942 50.352-18.932 98.861-48.472 145.846-87.52 41.11-34.26 80.008-76 120.788-127.872 3.555-4.492 3.555-4.492 7.098-8.976 12.318-15.707 18.352-25.908 20.605-36.683 2.45-11.698-7.439-23.554-15.343-19.587-3.907 1.96-7.993 6.018-14.22 13.872-4.454 5.715-6.875 8.77-9.298 11.514-9.671 10.95-19.883 22.157-30.947 33.998-18.241 19.513-36.775 38.608-63.656 65.789-13.69 13.844-30.908 25.947-49.42 35.046-29.63 14.559-56.358-3.792-53.148-36.635 2.118-21.681 7.37-44.096 15.224-65.767 17.156-47.367 31.183-85.659 62.216-170.048 13.459-36.6 19.27-52.41 26.528-72.201 21.518-58.652 38.696-105.868 55.04-151.425 20.19-56.275 31.596-98.224 36.877-141.543 3.987-32.673-5.103-63.922-25.834-85.405-22.986-23.816-55.68-34.787-96.399-34.305-45.053.535-97.607 15.256-145.963 37.783Zm308.381-388.422c-80.963-31.5-178.114 22.616-194.382 108.33-11.795 62.124 11.412 115.76 58.78 138.225 93.898 44.531 206.587-26.823 206.592-130.826.005-57.855-24.705-97.718-70.99-115.729Z" transform="scale(0.0125)"></path>
            </svg> -->
            <HelpIcon tooltipText="Each metadata bar segment is normalized to a value between 0 and 1 based on the highest value among all DTXCIDs for a given feature, with a minimum bar width of 0.05." iconSize="24px" />
          </div>
          <label style="font-size: 20px">Select plot to sort &#8239;<input type="checkbox" v-model="sortPlots.metadata"></label>
        </div>
        <div class="tripod-header">
          <div style="font-size: 22px; font-weight: bold;">Hazard</div>
          <label style="font-size: 20px">Select plot to sort &#8239;<input type="checkbox" v-model="sortPlots.hazard"></label>
        </div>
      </div>
      <div class="tripod-chart-container">
        <div class="tripod-chart" id="tripod-chart-MS2" v-if="!hasMS2"></div>
        <div class="tripod-chart" v-else>
          <p style="font-size: 22px; width: 100%; text-align: center; margin-top: 20px;">No MS2 data found.</p>
        </div>
        <div class="tripod-chart" id="tripod-chart-meta"></div>
        <div class="tripod-chart" id="tripod-chart-hazard"></div>
      </div>
      <div class="tripod-xaxis" id="tripod-xaxis"></div>
      
    </div>
    <div style="width: 350px; padding-left: 10px">
      <div class="tripod-settings-container" style="padding-top: 15px; justify-items: center">
        <p class="title-header-text">Metadata Legend</p>
        <svg width="198" height="108" overflow="visible" class="metadata-legendbox">
          <g class="metadata-legend-new">
            <rect id="metadata-square0" y="3" width="16" height="16" fill="#E9B0C8"></rect>
            <rect id="metadata-square1" y="29" width="16" height="16" fill="#6E1E3A"></rect>
            <rect id="metadata-square2" y="55" width="16" height="16" fill="#FADD8B"></rect>
            <rect id="metadata-square3" y="81" width="16" height="16" fill="#274F8B"></rect>
            <text y="0" alignment-baseline="hanging" transform="translate(22,0)" id="metadata-legendText0" style="font-size: 22px; cursor: pointer;">PubMed Articles</text>
            <text y="26" alignment-baseline="hanging" transform="translate(22,0)" id="metadata-legendText1" style="font-size: 22px; cursor: pointer;">PubChem Articles</text>
            <text y="52" alignment-baseline="hanging" transform="translate(22,0)" id="metadata-legendText2" style="font-size: 22px;">PubChem Patents</text>
            <text y="78" alignment-baseline="hanging" transform="translate(22,0)" id="metadata-legendText3" style="font-size: 22px;">PubChem Sources</text>
          </g>
        </svg>
        <p class="title-header-text" style="margin-top: 8px; margin-bottom: 8px;">Hazard Completeness Score</p>
        <svg id="tripod-gradient-rect-hazard" width="300" height="50">
          <defs>
            <linearGradient id="tripod-Gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="white"></stop>
              <stop offset="100%" stop-color="red"></stop>
            </linearGradient>
          </defs>
          <rect width="300" height="20" fill="url(#tripod-Gradient1)"></rect>
          <text font-size="18" x="0" y="40">0.0</text>
          <text font-size="18" x="277" y="40">1.0</text>
        </svg>
        <p v-if="hasMS2" class="title-header-text" style="margin-top: 8px; margin-bottom: 8px;">MS2 Amenability Score</p>
        <svg v-if="hasMS2" width="300" height="50">
          <defs>
            <linearGradient id="tripod-Gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="white"></stop>
              <stop offset="100%" stop-color="blue"></stop>
            </linearGradient>
          </defs>
          <rect width="300" height="20" fill="url(#tripod-Gradient2)"></rect>
          <text font-size="18" x="0" y="40">0.0</text>
          <text font-size="18" x="277" y="40">1.0</text>
        </svg>
        <p></p>
        <div style="display: flex; justify-content: space-between; width: 90%">
          <span style="font-size: 20px">Amenability Mode:</span>
          <button :disabled="!positiveAmenability">POS</button>
          <button :disabled="positiveAmenability">NEG</button>
        </div>
        <p></p>
        <button style="width: 220px;" @click="toggleTop5Rows">
          <span v-if="showingTop5">Showing Top 5 metadata candidates. Click to show all</span>
          <span v-else>Click to show top 5 metadata candidates only</span>
        </button>
      </div>
      <div class="tripod-image-container">
        <div style="display: flex;">
          <div id="tripod-StructureToolTip" class="compound-image-highlight">
            <img v-if="image_link" class="compound-image" :src="image_link" :alt="`Structure image for selected compound.`"/>  
            <div v-else style="text-align: center; display: flex; align-items: center;">Click on a DTXCID to display the structure image.</div>
            <!-- <div style="width: 180px; height: 188px; padding-left: 10px; padding-right: 10px; display: flex; justify-content: center; align-items: center;">
              Click on a DTXCID to display the structure image
            </div> -->
          </div>
          <svg width="30" height="30" overflow="visible" class="tripod-outlink-svg">
            <g id="tripod-outlink" transform="scale(0.06)">
              <!-- <rect height="500px" width="500px" fill="white" opacity="10%"></rect> -->
              <polygon fill="#BFBFBF" id="tripod-outlink-color" points="400 464 48 464 48 104 240 104 240 72 16 72 16 496 432 496 432 272 400 272 400 464"></polygon>
              <polygon fill="#BFBFBF" id="tripod-outlink-color" points="304 16 304 48 441.373 48 188.687 300.687 211.313 323.313 464 70.627 464 208 496 208 496 16 304 16"></polygon>
            </g>
          </svg>
        </div>
        <button id="screenshot-btn" style="margin-left: auto;">Take Screenshot</button>
      </div>
    </div>
  
    <div class="ag-theme-balham" id="tripod-grid"></div>
  </div>
  <ag-grid-vue
    :columnDefs="columnDefs"
  ></ag-grid-vue>
</template>

<script>
  import * as d3 from "d3";
  import { toPng } from "html-to-image"
  //import XLSX from 'xlsx';

  import HelpIcon from "./HelpIcon.vue";

  import 'ag-grid-community/styles/ag-grid.css'
  import 'ag-grid-community/styles/ag-theme-balham.css'
  import { AgGridVue } from "ag-grid-vue3"
  import 'ag-grid-enterprise'
  import { LicenseManager } from 'ag-grid-enterprise'
  LicenseManager.setLicenseKey('CompanyName=US EPA,LicensedGroup=Multi,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=5,LicensedProductionInstancesCount=0,AssetReference=AG-010288,ExpiryDate=3_December_2022_[v2]_MTY3MDAyNTYwMDAwMA==4abffeb82fbc0aaf1591b8b7841e6309')

  //import '@/styles/nta_metadata_visualization_new.css'

  export default {
    data() {
      return {
        /* CONSTANTS */
        STRUCTURE_IMAGE_URL: "https://comptox.epa.gov/dashboard-api/ccdapp1/chemical-files/image/by-dtxcid/",
        COMPTOX_URL: "https://ccte-res-ncd.epa.gov/dashboard/dsstoxdb/results?search=",
        KEYS_TO_KEEP: [
          "Feature ID",
          "DTXCID_INDIVIDUAL_COMPONENT",
          "Mass", 
          "Retention Time",
          "SOURCE_COUNT_COLLAPSED",
          "PATENT_COUNT_COLLAPSED",
          "LITERATURE_COUNT_COLLAPSED",
          "PUBMED_COUNT_COLLAPSED",
          "SOURCE_COUNT_COLLAPSED_NORM",
          "PATENT_COUNT_COLLAPSED_NORM",
          "LITERATURE_COUNT_COLLAPSED_NORM",
          "PUBMED_COUNT_COLLAPSED_NORM",
          "STRUCTURE_TOTAL_NORM", 
          "Hazard Score", 
          "Hazard Completeness Score",
          "POSITIVE_MODE_AMENABILITY_PREDICTION",
          "NEGATIVE_MODE_AMENABILITY_PREDICTION",
          "MS2 quotient score", 
          "Acute Mammalian Toxicity Oral_authority_mapped",
          "Acute Mammalian Toxicity Inhalation_authority_mapped",
          "Acute Mammalian Toxicity Dermal_authority_mapped",
          "Carcinogenicity_authority_mapped",
          "Genotoxicity Mutagenicity_authority_mapped",
          "Endocrine Disruption_authority_mapped",
          "Reproductive_authority_mapped",
          "Developmental_authority_mapped",
          "Neurotoxicity Repeat Exposure_authority_mapped",
          "Neurotoxicity Single Exposure_authority_mapped",
          "Systemic Toxicity Repeat Exposure_authority_mapped",
          "Systemic Toxicity Single Exposure_authority_mapped",
          "Skin Sensitization_authority_mapped",
          "Skin Irritation_authority_mapped",
          "Eye Irritation_authority_mapped",
          "Acute Aquatic Toxicity_authority_mapped",
          "Chronic Aquatic Toxicity_authority_mapped",
          "Persistence_authority_mapped",
          "Bioaccumulation_authority_mapped",
          "Exposure_authority_mapped",
          "Acute Mammalian Toxicity Oral_score_mapped",
          "Acute Mammalian Toxicity Inhalation_score_mapped",
          "Acute Mammalian Toxicity Dermal_score_mapped",
          "Carcinogenicity_score_mapped",
          "Genotoxicity Mutagenicity_score_mapped",
          "Endocrine Disruption_score_mapped",
          "Reproductive_score_mapped",
          "Developmental_score_mapped",
          "Neurotoxicity Repeat Exposure_score_mapped",
          "Neurotoxicity Single Exposure_score_mapped",
          "Systemic Toxicity Repeat Exposure_score_mapped",
          "Systemic Toxicity Single Exposure_score_mapped",
          "Skin Sensitization_score_mapped",
          "Skin Irritation_score_mapped",
          "Eye Irritation_score_mapped",
          "Acute Aquatic Toxicity_score_mapped",
          "Chronic Aquatic Toxicity_score_mapped",
          "Persistence_score_mapped",
          "Bioaccumulation_score_mapped",
          "Exposure_score_mapped",
        ],
        SUBGROUP_KEYS: [
          "DTXCID_INDIVIDUAL_COMPONENT",
          "SOURCE_COUNT_COLLAPSED",
          "PATENT_COUNT_COLLAPSED",
          "LITERATURE_COUNT_COLLAPSED",
          "PUBMED_COUNT_COLLAPSED",
          "SOURCE_COUNT_COLLAPSED_NORM",
          "PATENT_COUNT_COLLAPSED_NORM",
          "LITERATURE_COUNT_COLLAPSED_NORM",
          "PUBMED_COUNT_COLLAPSED_NORM",
          "STRUCTURE_TOTAL_NORM", 
          "Hazard Score", 
          "Hazard Completeness Score",
          "POSITIVE_MODE_AMENABILITY_PREDICTION",
          "NEGATIVE_MODE_AMENABILITY_PREDICTION",
          "MS2 quotient score", 
        ],
        /* VARIABLES FOR TOP DISPLAY */
        selectedFeature: 22,
        featureMass: null,
        featureRT: null,
        totalCandidates: null,
        numCandidatesRemoved: null,
        sortPlots: {MS2: true, metadata: true, hazard: true},
        featureList: [],
        /* OTHER DISPLAY VARIABLES */
        showingTop5: false,
        image_link: null,
        /* INTERNAL STATUS VARIABLES */
        hasAmenability: false,
        hasMS2: false,
        gridUpdated: false,
        positiveAmenability: true,
        /* DATA VARIABLES */
        unsorted_subGroupData: null,
        subGroupData: null,
        dataFromGrid: null,
        /* AG GRID DEFINITIONS */
        columnDefs: [
          {headerName: "", 
            children: [
              {field: 'Feature ID', filter: 'agNumberColumnFilter', floatingFilter: true, width: 100, sortingOrder: ['desc', 'asc', null]},
              {field: 'Structure', autoHeight: true, width: 150,
              cellRenderer: params => {
                try {
                  var image = document.createElement('img');
                  image.src = structureImageURL + params.data.DTXCID_INDIVIDUAL_COMPONENT
                
                  image.style = "width:80px;height:80px;padding-top:2px;padding-bottom:2px;";
                  image.alt = `Structure image for ${params.data.DTXCID_INDIVIDUAL_COMPONENT}`
                  return image;
                } 
                catch (error) {
                  var p = document.createElement('div')
                  p.style = "width:70px;height:70px;padding-top:2px;padding-bottom:2px;text-align: center; line-height: 70px;";
                  p.innerText = "No structure."
                  return p
                }
              }
              },
              {headerName: "DTXCID", field: 'DTXCID_INDIVIDUAL_COMPONENT', filter: 'agTextColumnFilter', floatingFilter: true, width: 150, sortingOrder: ['desc', 'asc', null], 
                cellRenderer: params => {
                return "<a href='" + comptoxURL + params.data.DTXCID_INDIVIDUAL_COMPONENT + "' target='_blank'>" + params.data.DTXCID_INDIVIDUAL_COMPONENT + "</a>"
                }
              },
            ]},
          {headerName: "MS2", children: 
            [
              {headerName: 'MS2 Score', 
            field: 'MS2 quotient score', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null], 
            // cellRenderer: params => {params.value === "" ? "N/A" : params.value}, 
            valueGetter: (params) => {return params.data?.["MS2 quotient score"] ?? 'N/A'}
          }, 
          {headerName: 'Amenability Score', 
            field: 'Amenability', floatingFilter: true, filter: 'agNumberColumnFilter', width: 120, sortingOrder: ['desc', 'asc', null], 
            // cellRenderer: params => {params.value === "" ? "N/A" : params.value}, 
            valueGetter: (params) => {return params.data?.["Amenability"] ?? 'N/A'}
          }, 
        
        ]
        
        },
          {headerName: "Metadata", 
            openByDefault: true,
            children: [
              {columnGroupShow: "closed", headerName: "Metadata Score", field: 'STRUCTURE_TOTAL_NORM', floatingFilter: true, filter: 'agNumberColumnFilter', width: 200, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Metadata Score", field: 'STRUCTURE_TOTAL_NORM', floatingFilter: true, filter: 'agNumberColumnFilter', width: 150, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "PubMed Articles", field: 'PUBMED_COUNT_COLLAPSED', floatingFilter: true, filter: 'agNumberColumnFilter', width: 150, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "PubChem Articles", field: 'LITERATURE_COUNT_COLLAPSED', floatingFilter: true, filter: 'agNumberColumnFilter', width: 150, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "PubChem Patents", field: 'PATENT_COUNT_COLLAPSED', floatingFilter: true, filter: 'agNumberColumnFilter', width: 150, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "PubChem Sources", field: 'SOURCE_COUNT_COLLAPSED', floatingFilter: true, filter: 'agNumberColumnFilter', width: 150, sortingOrder: ['desc', 'asc', null]},
            ]
          },   
          {headerName: "Hazard", 
            children: [
              {columnGroupShow: "closed", headerName: "Hazard Score", field: 'Hazard Score', floatingFilter: true, filter: 'agNumberColumnFilter', width: 120, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "closed", headerName: "Hazard Completeness Score", field: 'Hazard Completeness Score', floatingFilter: true, filter: 'agNumberColumnFilter', width: 210, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Hazard Score", field: 'Hazard Score', floatingFilter: true, filter: 'agNumberColumnFilter', width: 210, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Hazard Completeness Score", field: 'Hazard Completeness Score', floatingFilter: true, filter: 'agNumberColumnFilter', width: 200, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Acute Aquatic Toxicity Authority", field: 'Acute Aquatic Toxicity_authority_mapped', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Acute Aquatic Toxicity Score", field: 'Acute Aquatic Toxicity_score_mapped', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Acute Mammalian Toxicity Dermal Authority", field: 'Acute Mammalian Toxicity Dermal_authority_mapped', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Acute Mammalian Toxicity Dermal Score", field: 'Acute Mammalian Toxicity Dermal_score_mapped', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Acute Mammalian Toxicity Inhalation Authority", field: 'Acute Mammalian Toxicity Inhalation_authority_mapped', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Acute Mammalian Toxicity Inhalation Score", field: 'Acute Mammalian Toxicity Inhalation_score_mapped', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Acute Mammalian Toxicity Oral Authority", field: 'Acute Mammalian Toxicity Oral_authority_mapped', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Acute Mammalian Toxicity Oral Score", field: 'Acute Mammalian Toxicity Oral_score_mapped', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Bioaccumulation Authority", field: 'Bioaccumulation_authority_mapped', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Bioaccumulation Score", field: 'Bioaccumulation_score_mapped', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Carcinogenicity Authority", field: 'Carcinogenicity_authority_mapped', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Carcinogenicity Score", field: 'Carcinogenicity_score_mapped', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Chronic Aquatic Toxicity Authority", field: 'Chronic Aquatic Toxicity_authority_mapped', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Chronic Aquatic Toxicity Score", field: 'Chronic Aquatic Toxicity_score_mapped', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Developmental Authority", field: 'Developmental_authority_mapped', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Developmental Score", field: 'Developmental_score_mapped', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Endocrine Disruption Authority", field: 'Endocrine Disruption_authority_mapped', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Endocrine Disruption Score", field: 'Endocrine Disruption_score_mapped', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Exposure Authority", field: 'Exposure_authority_mapped', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Exposure Score", field: 'Exposure_score_mapped', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Eye Irritation Authority", field: 'Eye Irritation_authority_mapped', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Eye Irritation Score", field: 'Eye Irritation_score_mapped', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Genotoxicity Mutagenicity Authority", field: 'Genotoxicity Mutagenicity_authority_mapped', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Genotoxicity Mutagenicity Score", field: 'Genotoxicity Mutagenicity_score_mapped', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Neurotoxicity Repeat Exposure Authority", field: 'Neurotoxicity Repeat Exposure_authority_mapped', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Neurotoxicity Repeat Exposure Score", field: 'Neurotoxicity Repeat Exposure_score_mapped', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Neurotoxicity Single Exposure Authority", field: 'Neurotoxicity Single Exposure_authority_mapped', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Neurotoxicity Single Exposure Score", field: 'Neurotoxicity Single Exposure_score_mapped', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Persistence Authority", field: 'Persistence_authority_mapped', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Persistence Score", field: 'Persistence_score_mapped', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Reproductive Authority", field: 'Reproductive_authority_mapped', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Reproductive Score", field: 'Reproductive_score_mapped', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Skin Irritation Authority", field: 'Skin Irritation_authority_mapped', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Skin Irritation Toxicity Score", field: 'Skin Irritation_score_mapped', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Skin Sensitization Authority", field: 'Skin Sensitization_authority_mapped', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Skin Sensitization Score", field: 'Skin Sensitization_score_mapped', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Systemic Toxicity Repeat Exposure Authority", field: 'Systemic Toxicity Repeat Exposure_authority_mapped', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Systemic Toxicity Repeat Exposure Score", field: 'Systemic Toxicity Repeat Exposure_score_mapped', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Systemic Toxicity Single Exposure Authority", field: 'Systemic Toxicity Single Exposure_authority_mapped', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null]},
              {columnGroupShow: "open", headerName: "Systemic Toxicity Single Exposurey Score", field: 'Systemic Toxicity Single Exposure_score_mapped', floatingFilter: true, filter: 'agNumberColumnFilter', width: 100, sortingOrder: ['desc', 'asc', null]},
            ]
          }
        ]
      }
    },
    props: {csvString: String},
    components: { AgGridVue, HelpIcon },
    mounted() {
      // Parse the CSV string
      const fullData = this.parseCSV(this.csvString)

      // Check if the dataset contains MS2 data
      this.hasMS2 = Object.keys(fullData[0]).some(col => col.includes("MS2"))
      if (this.hasMS2) {
        this.hasAmenability = Object.keys(fullData[0]).some(col => col.includes("Amenability"))
      }

      // Gets the dataset containing only the top 5 highest metadata rows. 
      const top5groups = this.getTop5Rows(fullData, 'Feature ID', 'STRUCTURE_TOTAL_NORM');

      // Get a list of all unique features in the dataset, sorted from smallest to largest
      var uniqueFeatureList = [...new Set(fullData.map(item =>item['Feature ID']))]
      for (let i = 0; i < uniqueFeatureList.length; i++) {uniqueFeatureList[i] = Number(uniqueFeatureList[i]);}
      uniqueFeatureList.sort((a, b) => a - b);

      // Define the feature to initially display in the plots
      var selectedFeature = uniqueFeatureList[0]

      // Define the number of unique feature IDs in the dataset
      const uniqueFeatureListLength = uniqueFeatureList.length

      // Define the mass, RT, abundance, and occurrence percentage of the selectedFeature to initially display in the plot title
      this.featureMass = Number(fullData[0]["Mass"]).toFixed(4)
      this.featureRT = Number(fullData[0]["Retention Time"]).toFixed(2)

      console.log(this.loadData())
    },
    methods: {
      iconHover(target_element, fill_color) {
        document.getElementById(target_element).style.fill = fill_color
      },
      parseCSV(csvText) {
        // parse the file
        const lines = csvText.split('\n');
        const headers = lines[0].split(',');
        var result = [];

        // remove the '\r' from the last column of the csv
        // headers[headers.length - 1] = headers[headers.length - 1].replace(/\r/g, "");

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',');
          const obj = {};
          for (let j = 0; j < headers.length; j++) {obj[headers[j]] = values[j];}
          result.push(obj);
        }
        
        // Remove rows with no feature ID
        const cleaned_result = result.filter(feature => feature['Feature ID'] != "")
        return cleaned_result;
      },
      isElementVisibleInScrollContainer(element, scrollContainer) {
        const elementRect = element.getBoundingClientRect();
        const containerRect = scrollContainer.getBoundingClientRect();
        return (elementRect.top >= containerRect.top && elementRect.bottom <= containerRect.bottom)
      },
      sortData(data, category = null) {
        let headers = null
        if (data.length > 0){
          headers = Object.keys(data[0])
        } else {
          return []
        }

        const headers_norm = [] //contains normalized headers (not including total norm)
        headers.forEach((key) => {if (key.includes("NORM") && !key.includes("TOTAL")) {headers_norm.push(key);}});

        let itemToRemove = []
        for (let i = 0; i < data.length; i++) { 
          if (data[i]['STRUCTURE_TOTAL_NORM'] == 0){itemToRemove.push(data[i]);}
          
          for (let j = 0; j < headers_norm.length; j++){
            const currentHeader = headers_norm[j];
            data[i][currentHeader + "_original"] = data[i][currentHeader]
            if (0 < data[i][currentHeader] && data[i][currentHeader] < 0.05) {data[i][currentHeader] = 0.05;}
          }
        }
        let removeSet = new Set(itemToRemove);
        let newArray = data.filter(item => !removeSet.has(item));

        if (category != null) {newArray.sort((a, b) => b[category] - a[category])}
        
        return newArray;
      },
      cleanData(data, keysToKeep) {
        const keysToNum = [
          "Feature ID",
          "SOURCE_COUNT_COLLAPSED",
          "PATENT_COUNT_COLLAPSED",
          "LITERATURE_COUNT_COLLAPSED",
          "PUBMED_COUNT_COLLAPSED",
          "SOURCE_COUNT_COLLAPSED_NORM",
          "PATENT_COUNT_COLLAPSED_NORM",
          "LITERATURE_COUNT_COLLAPSED_NORM",
          "PUBMED_COUNT_COLLAPSED_NORM",
          "STRUCTURE_TOTAL_NORM",
          "MS2 quotient score", 
          "Acute Mammalian Toxicity Oral_authority_mapped",
          "Acute Mammalian Toxicity Inhalation_authority_mapped",
          "Acute Mammalian Toxicity Dermal_authority_mapped",
          "Carcinogenicity_authority_mapped",
          "Genotoxicity Mutagenicity_authority_mapped",
          "Endocrine Disruption_authority_mapped",
          "Reproductive_authority_mapped",
          "Developmental_authority_mapped",
          "Neurotoxicity Repeat Exposure_authority_mapped",
          "Neurotoxicity Single Exposure_authority_mapped",
          "Systemic Toxicity Repeat Exposure_authority_mapped",
          "Systemic Toxicity Single Exposure_authority_mapped",
          "Skin Sensitization_authority_mapped",
          "Skin Irritation_authority_mapped",
          "Eye Irritation_authority_mapped",
          "Acute Aquatic Toxicity_authority_mapped",
          "Chronic Aquatic Toxicity_authority_mapped",
          "Persistence_authority_mapped",
          "Bioaccumulation_authority_mapped",
          "Exposure_authority_mapped",
          "Acute Mammalian Toxicity Oral_score_mapped",
          "Acute Mammalian Toxicity Inhalation_score_mapped",
          "Acute Mammalian Toxicity Dermal_score_mapped",
          "Carcinogenicity_score_mapped",
          "Genotoxicity Mutagenicity_score_mapped",
          "Endocrine Disruption_score_mapped",
          "Reproductive_score_mapped",
          "Developmental_score_mapped",
          "Neurotoxicity Repeat Exposure_score_mapped",
          "Neurotoxicity Single Exposure_score_mapped",
          "Systemic Toxicity Repeat Exposure_score_mapped",
          "Systemic Toxicity Single Exposure_score_mapped",
          "Skin Sensitization_score_mapped",
          "Skin Irritation_score_mapped",
          "Eye Irritation_score_mapped",
          "Acute Aquatic Toxicity_score_mapped",
          "Chronic Aquatic Toxicity_score_mapped",
          "Persistence_score_mapped",
          "Bioaccumulation_score_mapped",
          "Exposure_score_mapped",
          "Hazard Score",
          "Hazard Completeness Score",
          "POSITIVE_MODE_AMENABILITY_PREDICTION",
          "NEGATIVE_MODE_AMENABILITY_PREDICTION"
        ];
  
        let filteredData = [];
        data.forEach((row) => {
          let filteredRow = {};
          Object.entries(row).forEach(([key, value]) => {
            if (keysToKeep.includes(key)) {
              // converts numerical data into a Number data type
              if (key == "Feature ID"){value = Number(value);}
              else if (key.includes("AMENABILITY")){
                if (value === ""){
                  value = 9999
                }
                else {value = Number(value)}
              }
              else if (keysToNum.includes(key)) {value = Number(Number(value).toPrecision(3));} //Rounds all numerical columns to 3 sig figs
              filteredRow[key] = value;
            }
          });
          filteredData.push(filteredRow)
        });
        return filteredData;
      },
      truncateData(data, selectedFeature){
        const result_truncated = data.filter(feature => feature['Feature ID'] == selectedFeature);
        return result_truncated;
      },
      updateData(fullData, category){
        let data = this.truncateData(fullData, this.selectedFeature);
        data = this.cleanData(data, this.KEYS_TO_KEEP)

        this.featureMass = Number(data[0]["Mass"]).toFixed(4)
        this.featureRT = Number(data[0]["Retention Time"]).toFixed(2)

        this.unsorted_subGroupData = this.cleanData(data, this.SUBGROUP_KEYS);
        this.totalCandidates = this.unsorted_subGroupData.length
        this.subGroupData = this.sortData(this.unsorted_subGroupData, category)
        this.numCandidatesRemoved = this.unsorted_subGroupData.length - this.subGroupData.length
        const subGroupHeaders = []; //includes all norm headers exept total norm
        Object.entries(this.subGroupData[0]).forEach(([key]) => {if (key.includes("NORM") && !key.includes("TOTAL")) {subGroupHeaders.push(key);}});

        //Check status of the Top-5 toggle button
        if (showingTop5) {
          this.subGroupData = sortData(this.unsorted_subGroupData, "STRUCTURE_TOTAL_NORM").slice(0, 5);
          this.subGroupData = sortData(this.subGroupData, category)
        } 

        //Check if the chart is being loaded from a grid update
        if (gridUpdated){
          this.subGroupData = this.dataFromGrid;
        }

      },
      loadData(data){
        
        // create svg for visualization
        const width = document.getElementById("tripod-chart-hazard").clientWidth
        const height = subGroupData.length * 30;
  
        // Create a tooltip for the stacked bars -----------------------------------------------------------------
        var tooltipBarMeta = d3.select("#tripod-chart-meta")
          .append("div")
          .attr("class", "tripod-tooltip")
          .attr("id", "tripod-tooltipbar");
  
        if (hasMS2) {
          var tooltipBarMS2 = d3.select("#tripod-chart-MS2")
            .append("div")
            .attr("class", "tripod-tooltip")
            .attr("id", "tripod-tooltipbar");
        }
  
        var tooltipBarHazard = d3.select("#tripod-chart-hazard")
          .append("div")
          .attr("class", "tripod-tooltip")
          .attr("id", "tripod-tooltipbar");
  
        // Hover functions for Metadata bars
        var mouseoverBarMeta = function(d) {
          var categoryName = d3.select(this.parentNode).datum().key;
          let wordsList = categoryName.split("_");
  
          var labelName = null
          if (categoryName.includes("LITERATURE")){
            labelName = "PubChem Articles"
            let catName = wordsList[0];
            var categoryValue = d.srcElement.__data__.data[catName + "_COUNT_COLLAPSED"];
          } else if (categoryName.includes("PATENT")){
            labelName = "PubChem Patents"
            let catName = wordsList[0];
            var categoryValue = d.srcElement.__data__.data[catName + "_COUNT_COLLAPSED"];
          } else if (categoryName.includes("PUBMED")){
              labelName = "PubMed Articles"
              let catName = wordsList[0];
              var categoryValue = d.srcElement.__data__.data[catName + "_COUNT_COLLAPSED"];
          } else if (categoryName.includes("SOURCE")){
              labelName = "PubChem Sources"
              let catName = wordsList[0];
              var categoryValue = d.srcElement.__data__.data[catName + "_COUNT_COLLAPSED"];
          }

          tooltipBarMeta
              .html(labelName + ": " + categoryValue)
              .style("opacity", 1)
  
            // Make the corresponding y-axis label red
            fieldList.forEach(key =>{
              let IdToHighlight = document.getElementById(`ylabel-${d3.select(this)._groups[0][0]["__data__"]["data"]["DTXCID_INDIVIDUAL_COMPONENT"]}-${key}`);
              IdToHighlight.setAttribute("fill", "#FF13F0");
              IdToHighlight.style.fontWeight = "bold";})
  
          }
          var mousemoveBarMeta = function(event) {
            tooltipBarMeta
              .style("left", (event.pageX + 20) + "px")
              .style("top", (event.pageY - window.pageYOffset + 10) + "px")
              .style("display", "block")
          }
          var mouseleaveBarMeta = function() {
            tooltipBarMeta
              .style("display", "none");
  
            if (clickedDTXCID != d3.select(this)._groups[0][0]["__data__"]["data"]["DTXCID_INDIVIDUAL_COMPONENT"])
              {fieldList.forEach(key =>{
                let IdToHighlight = document.getElementById(`ylabel-${d3.select(this)._groups[0][0]["__data__"]["data"]["DTXCID_INDIVIDUAL_COMPONENT"]}-${key}`)
                IdToHighlight.setAttribute("fill", "black");
                IdToHighlight.style.fontWeight = "normal";
            })} 
            else {fieldList.forEach(key =>{
              let IdToHighlight = document.getElementById(`ylabel-${d3.select(this)._groups[0][0]["__data__"]["data"]["DTXCID_INDIVIDUAL_COMPONENT"]}-${key}`)
              IdToHighlight.setAttribute("fill", "red");
              IdToHighlight.style.fontWeight = "bold";
            })}  
          }
  
          // Hover functions for MS2 bars
          var mouseoverBarMS2 = function(d) {
  
            if (! hasAmenability){
            var MS2Score = d3.select(this)._groups[0][0]["__data__"]["MS2 quotient score"];
            tooltipBarMS2
              .html("MS2 Score: " + MS2Score)
              .style("opacity", 1)}
            else {
              var MS2Score = d3.select(this)._groups[0][0]["__data__"]["MS2 quotient score"];
              var amenabilityScore = d3.select(this)._groups[0][0]["__data__"][amenabilityMode];
              if (amenabilityScore == 9999){amenabilityScore = "No Data"}
            tooltipBarMS2
              .html("MS2 Score: " + MS2Score + "<br>" + "Amenability Score: " + amenabilityScore)
              .style("opacity", 1)}
  
            // Make the corresponding y-axis label red
            fieldList.forEach(key =>{
              let IdToHighlight = document.getElementById(`ylabel-${d3.select(this)._groups[0][0]["__data__"]["DTXCID_INDIVIDUAL_COMPONENT"]}-${key}`)
              IdToHighlight.setAttribute("fill", "#FF13F0");
              IdToHighlight.style.fontWeight = "bold";
            })  
          }
          var mousemoveBarMS2 = function(event) {
            tooltipBarMS2
              .style("left", (event.pageX + 20) + "px")
              .style("top", (event.pageY - window.pageYOffset + 10) + "px")
              .style("display", "block")
          }
          var mouseleaveBarMS2Hazard = function() {
            
            if (hasMS2){tooltipBarMS2.style("display", "none");}
            tooltipBarHazard.style("display", "none");  
  
          // Make the corresponding y-axis label black again
          if (clickedDTXCID != d3.select(this)._groups[0][0]["__data__"]["DTXCID_INDIVIDUAL_COMPONENT"])
            {fieldList.forEach(key =>{
              let IdToHighlight = document.getElementById(`ylabel-${d3.select(this)._groups[0][0]["__data__"]["DTXCID_INDIVIDUAL_COMPONENT"]}-${key}`)
              IdToHighlight.setAttribute("fill", "black");
              IdToHighlight.style.fontWeight = "normal";
            })}  
          else {fieldList.forEach(key =>{
            let IdToHighlight = document.getElementById(`ylabel-${d3.select(this)._groups[0][0]["__data__"]["DTXCID_INDIVIDUAL_COMPONENT"]}-${key}`)
            IdToHighlight.setAttribute("fill", "red");
            IdToHighlight.style.fontWeight = "bold";
            })}  
          }
  
          // Hover functions for Hazard bars
          var mouseoverBarHazard = function(d) {
            var HScore = d3.select(this)._groups[0][0]["__data__"]["Hazard Score"];
            var HCompScore = d3.select(this)._groups[0][0]["__data__"]["Hazard Completeness Score"];
            tooltipBarHazard
              .html("Hazard Score: " + HScore + "<br>" + "Hazard Completeness Score: " + HCompScore)
              .style("opacity", 1)
  
            // Make the corresponding y-axis label red
            fieldList.forEach(key =>{
              let IdToHighlight = document.getElementById(`ylabel-${d3.select(this)._groups[0][0]["__data__"]["DTXCID_INDIVIDUAL_COMPONENT"]}-${key}`)
              IdToHighlight.setAttribute("fill", "#FF13F0");
              IdToHighlight.style.fontWeight = "bold";
            })  
          }
          var mousemoveBarHazard = function(event) {
            tooltipBarHazard
              .style("left", (event.pageX + 20) + "px")
              .style("top", (event.pageY - window.pageYOffset + 10) + "px")
              .style("display", "block")
          }
  
        //Display bar functions for all three plots 
        showBarsMetadata = function(keys2Include, data){
          let stackedData = d3.stack().keys(keys2Include)(data);
          let barGroup = svgMeta.append("g").selectAll("g").data(stackedData)
          // Enter in the stack data = loop key per key = group per group
          meta_bars = barGroup.join("g")
          .attr("fill", d => color(d.key))
          .selectAll("rect")
          // enter a second time = loop subgroup per subgroup to add all rectangles
          .data(d => {return d})
          .join("rect")
            .attr("y", d => yMeta(d.data.DTXCID_INDIVIDUAL_COMPONENT))
            .attr("x", d => xMeta(d[0]))
            .attr("transform", `translate(137, 20)`)
            .attr("width", d => xMeta(d[1]) - xMeta(d[0]))
            .attr("height", yMeta.bandwidth())
            .on("mouseover", mouseoverBarMeta)
            .on("mousemove", mousemoveBarMeta)
            .on("mouseleave", mouseleaveBarMeta)
            .on("click", barClickMeta)
  
        }
        showBarsHazard = function(data){
          svgHazard.append("g");
          hazard_bars = svgHazard.selectAll(".bar")
          .data(data)
          .enter().append("rect").attr("fill", "red").attr("opacity", d => d["Hazard Completeness Score"])
          .attr("transform", `translate(137, 20)`)
          .attr("class", "hazard-bar")
          .attr("y", d => yHazard(d.DTXCID_INDIVIDUAL_COMPONENT))
          .attr("x", 0)
          .attr("width", d => xHazard(d["Hazard Score"]))
          .attr("height", yHazard.bandwidth())
          .on("mouseover", mouseoverBarHazard)
          .on("mousemove", mousemoveBarHazard)
          .on("mouseleave", mouseleaveBarMS2Hazard)
          .on("click", barClickMS2Hazard);
  
        }
        showBarsMS2 = function(data){
  
          svgMS2.append("g");
          MS2_bars = svgMS2.selectAll(".bar")
          .data(data)
          .enter().append("rect").attr("fill", d => {
            if (hasAmenability){
              if (d[amenabilityMode] == 9999){
                return "white"
              }
              else{
                return "blue"
              }}
            else {return "#93AEC5"}  
  
          })
  
          .attr("stroke", d => {
              if (d[amenabilityMode] == 9999){
                return "red"
              }
              else if (d[amenabilityMode] == 0){
                return "#DBE4F0"
              }
            })
  
          
          .attr("fill-opacity", d => d[amenabilityMode])
          .attr("transform", `translate(137, 20)`)
          .attr("class", "MS2-bar")
          .attr("y", d => yMS2(d.DTXCID_INDIVIDUAL_COMPONENT))
          .attr("x", 0)
          .attr("width", d => xMS2(d["MS2 quotient score"]))
          .attr("height", yMS2.bandwidth())
          .on("mouseover", mouseoverBarMS2)
          .on("mousemove", mousemoveBarMS2)
          .on("mouseleave", mouseleaveBarMS2Hazard)
          .on("click", barClickMS2Hazard);
  
        }
  
        if (metaInput.checked){
          svgMeta = makeSvgElement(width, height + 20, "tripod-vis", d3.select("#tripod-chart-meta"));
          yAxisMeta(subGroupData);
          showBarsMetadata(showKeys, subGroupData);
        }
  
        if (hazardInput.checked){
          svgHazard = makeSvgElement(width, height + 20, "tripod-vis", d3.select("#tripod-chart-hazard"));
          yAxisHazard(subGroupData);
          showBarsHazard(subGroupData);
        }
  
        if (hasMS2 && MS2Input.checked){
          svgMS2 = makeSvgElement(width, height + 20, "tripod-vis", d3.select("#tripod-chart-MS2"));
          yAxisMS2(subGroupData);
          showBarsMS2(subGroupData);
        }
  
        // Add the title
        function makeTitle(){
          const titlesvg = makeSvgElement(width, 20, 'tripod-title', d3.select("#tripod-title"));
          titlesvg.append("text")  
            .attr("x", 0)
            .attr("y", 18)
            .attr("text-anchor", "left")
            .style("font-size", "22px")
            .style("font-weight", "bold")
            .text(`Feature ${selectedFeature}`);  
  
          titlesvg.append("text")  
            .attr("x", 580)
            .attr("y", 19)
            .attr("text-anchor", "left")
            .style("font-size", "20px")
            .style("font-weight", "bold")
            .text(`${totalCandidates}`);  
  
          titlesvg.append("text")  
            .attr("x", 830)
            .attr("y", 19)
            .attr("text-anchor", "left")
            .style("font-size", "20px")
            .style("font-weight", "bold")
            .text(` ${numCandidatesRemoved}`); 
  
          titlesvg.append("text") 
            .attr("x", 160)
            .attr("y", 18)
            .attr("text-anchor", "left")
            .style("font-size", "20px")
            .text(`Mass: ${mass}    RT: ${RT}`)  
  
        }
        makeTitle()
      },
      getTop5Rows(arr, categoryField, valueField) {
        const groupedData = {};

        arr.forEach(item => {
          const category = item[categoryField];
          if (!groupedData[category]) {groupedData[category] = [];}
          groupedData[category].push(item);
        });

        let result = [];

        for (const category in groupedData) {
          const sortedData = groupedData[category].sort((a, b) => b[valueField] - a[valueField]);
          result = result.concat(sortedData.slice(0, 5));
        }

        let usefulKeys = [
          "Feature ID",
          "DTXCID_INDIVIDUAL_COMPONENT",
          "SOURCE_COUNT_COLLAPSED",
          "PATENT_COUNT_COLLAPSED",
          "LITERATURE_COUNT_COLLAPSED",
          "PUBMED_COUNT_COLLAPSED",
          "SOURCE_COUNT_COLLAPSED_NORM",
          "PATENT_COUNT_COLLAPSED_NORM",
          "LITERATURE_COUNT_COLLAPSED_NORM",
          "PUBMED_COUNT_COLLAPSED_NORM",
          "STRUCTURE_TOTAL_NORM",
          "MS2 quotient score", 
          "Acute Mammalian Toxicity Oral_authority_mapped",
          "Acute Mammalian Toxicity Inhalation_authority_mapped",
          "Acute Mammalian Toxicity Dermal_authority_mapped",
          "Carcinogenicity_authority_mapped",
          "Genotoxicity Mutagenicity_authority_mapped",
          "Endocrine Disruption_authority_mapped",
          "Reproductive_authority_mapped",
          "Developmental_authority_mapped",
          "Neurotoxicity Repeat Exposure_authority_mapped",
          "Neurotoxicity Single Exposure_authority_mapped",
          "Systemic Toxicity Repeat Exposure_authority_mapped",
          "Systemic Toxicity Single Exposure_authority_mapped",
          "Skin Sensitization_authority_mapped",
          "Skin Irritation_authority_mapped",
          "Eye Irritation_authority_mapped",
          "Acute Aquatic Toxicity_authority_mapped",
          "Chronic Aquatic Toxicity_authority_mapped",
          "Persistence_authority_mapped",
          "Bioaccumulation_authority_mapped",
          "Exposure_authority_mapped",
          "Acute Mammalian Toxicity Oral_score_mapped",
          "Acute Mammalian Toxicity Inhalation_score_mapped",
          "Acute Mammalian Toxicity Dermal_score_mapped",
          "Carcinogenicity_score_mapped",
          "Genotoxicity Mutagenicity_score_mapped",
          "Endocrine Disruption_score_mapped",
          "Reproductive_score_mapped",
          "Developmental_score_mapped",
          "Neurotoxicity Repeat Exposure_score_mapped",
          "Neurotoxicity Single Exposure_score_mapped",
          "Systemic Toxicity Repeat Exposure_score_mapped",
          "Systemic Toxicity Single Exposure_score_mapped",
          "Skin Sensitization_score_mapped",
          "Skin Irritation_score_mapped",
          "Eye Irritation_score_mapped",
          "Acute Aquatic Toxicity_score_mapped",
          "Chronic Aquatic Toxicity_score_mapped",
          "Persistence_score_mapped",
          "Bioaccumulation_score_mapped",
          "Exposure_score_mapped",
          "Hazard Score",
          "Hazard Completeness Score",
          "POSITIVE_MODE_AMENABILITY_PREDICTION",
          "NEGATIVE_MODE_AMENABILITY_PREDICTION"
        ];

        return this.cleanData(result, usefulKeys)
      },
      toggleTop5Rows() {
        /*Incomplete*/
        this.showingTop5 = !this.showingTop5

        this.gridUpdated = false
        document.getElementById('tripod-grid').innerHTML= ""
        console.log(this.showingTop5)
        /*if (this.showingTop5) {
          metaInput.checked = true;
          hazardInput.checked = false;
          if (hasMS2){MS2Input.checked = false;}

          document.getElementById('tripod-chart-meta').innerHTML= ""
          document.getElementById('tripod-title').innerHTML= ""
          updateData("STRUCTURE_TOTAL_NORM")
          loadData(data)

          metaInput.checked = false;
          hazardInput.checked = true;
          document.getElementById('tripod-chart-hazard').innerHTML= ""
          document.getElementById('tripod-title').innerHTML= ""
          updateData("Hazard Score")
          loadData(data)

          if (hasMS2){
            hazardInput.checked = false;
            MS2Input.checked = true
            document.getElementById('tripod-chart-MS2').innerHTML= ""
            document.getElementById('tripod-title').innerHTML= ""
            updateData("MS2 quotient score")
            loadData(data)
          }

          metaInput.checked = true
          hazardInput.checked = true
        } else {
          metaInput.checked = true;
          hazardInput.checked = false;
          if (hasMS2){MS2Input.checked = false;}

          document.getElementById('tripod-chart-meta').innerHTML= ""
          document.getElementById('tripod-title').innerHTML= ""
          updateData("STRUCTURE_TOTAL_NORM")
          loadData(data)

          metaInput.checked = false;
          hazardInput.checked = true;
          document.getElementById('tripod-chart-hazard').innerHTML= ""
          document.getElementById('tripod-title').innerHTML= ""
          updateData("Hazard Score")
          loadData(data)

          if (hasMS2) {
            hazardInput.checked = false;
            MS2Input.checked = true
            document.getElementById('tripod-chart-MS2').innerHTML= ""
            document.getElementById('tripod-title').innerHTML= ""
            updateData("MS2 quotient score")
            loadData(data)
          }

          metaInput.checked = true
          hazardInput.checked = true
        }

            if (clickedDTXCID){

              try{
                fieldList.forEach(key =>{
                  let IdToHighlight = document.getElementById(`ylabel-${clickedDTXCID}-${key}`);
                  IdToHighlight.setAttribute("fill", "red");
                  IdToHighlight.style.fontWeight = "bold";
                  })}
              catch(error){return}   
        
          } */
      }
    },
  }
</script>

<style>
  .tripod-main-container {
    height: 820px;
    width: 1279px;
  }

  .tripod-title-new {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 15px;
    background-color: #DBE4F0;
    border: 1px #a7b2c2 solid;
    border-radius: 10px 10px 0px 0px;
  }

  .tripod-header-box {
    height: 40px;
    display: flex;
  }

  .tripod-header {
    width: calc(100% / 3);
    background-color: #DBE4F0;
    border: 1px #a7b2c2 solid;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 15px;
  }

  .tripod-arrow-button {
    width: 32px;
    height: 32px;
    cursor: pointer;
  }

  .tripod-arrow-icon {
    width: 30px;
    height: 30px;
    rx: 6px;
    ry: 6px; 
    fill: #DBE4F0
  }

  .help-icon-circle {
    width: 24px;
    height: 24px;
    r: 11px;
    cx: 12px;
    cy: 12px;
    fill: #DBE4F0;
    cursor: pointer;
  }

  .tripod-chart {
    height: 700px;
    width: calc(100% / 3);
    top: 85px;
    overflow-y: auto;
    border: 1px solid #ccc;
  }

  .tripod-chart-container {
    width: 100%;
    display: flex;
  }

  .metadata-legend {
    height: 210px;
    width: 276px;
    z-index:1;
    padding-left: 10px;
  }

  .title-header-text {
    font-size: 22px;
    font-weight: bold;
  }

  .tripod-settings-container {
    width: 100%;
    height: 500px;
    border: 1px solid #ccc;
    border-radius: 10px;
  }

  .tripod-image-container {
    width: 100%;
    height: 300px;
    border: 1px solid #ccc;
    border-radius: 10px;
    margin-top: 10px;
    padding: 20px;
  }

  .compound-image {
    display: flex;
    max-height: 200px;
    max-width: 200px;
  }

  .compound-image-highlight {
    display: flex;
    height: 200px;
    width: 200px;
    border: 1px solid #ccc;
    border-radius: 10px;
  }

  .tripod-tooltip {
    background-color: white;
    border: solid;
    border-width: 1px;
    border-radius: 5px;
    padding: 8px;
    /* position: fixed; */
    display: none;
  }
</style>