import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {path: "/", name: "Home", component: Home},
  {path: "/about", name: "About", component: ()=>import('../views/About.vue')},
  {path: "/contact", name: "Contact", component: ()=>import('../views/Contact.vue')},
  {path: "/data_sources", name: "Data Sources", component: ()=>import('../views/DataSources.vue')},
  {path: "/search/:search_term", name: "Search Results", component: ()=>import('../views/GeneralSearch.vue')},
  {path: "/fact_sheet_list", name: "Fact Sheet List", component: ()=>import('../views/FactSheetList.vue')},
  {path: "/similar_structure_search", name: "Similar Structure Search", component: ()=>import('../views/SimilarStructureSearch.vue')},
  {path: "/methods_list", name: "Methods List", component: ()=>import('../views/MethodList.vue')},
  {path: "/batch_search", name: "Batch Search", component: ()=>import('../views/BatchSearch.vue')},
  {path: "/method_with_spectra/:by_type/:internal_id", name: "Method With Associated Spectra", component: ()=>import('../views/MethodWithSpectra.vue')},
  {path: "/view_method/:internal_id", name: "Method Viewer", component: ()=>import('../views/MethodViewer.vue')},
  {path: "/view_fact_sheet/:internal_id", name: "Fact Sheet Viewer", component: ()=>import('../views/FactSheetViewer.vue')},
  {path: "/mass_spectrum_comparison", name: "Mass Spectrum Comparison", component: ()=>import('../views/MassSpectrumComparison.vue')},
  {path: "/mass_spectrum_search", name: "Mass Spectrum Search", component: ()=>import('../views/MassSpectrumSearch.vue')},
  {path: "/functional_class_visualization", name: "Functional Class Visualization", component: ()=>import('../views/FunctionalClassVisualization.vue')},
  {path: "/view_mass_spectrum/:internal_id", name: "Mass Spectrum Viewer", component: ()=>import('../views/MassSpectrumViewer.vue')},
  {path: "/view_spectrum_pdf/:internal_id", name: "Spectrum PDF Viewer", component: ()=>import('../views/SpectrumPDFViewer.vue')},
  {path: "/view_nmr_spectrum/:internal_id", name: "NMR Spectrum Viewer", component: ()=>import('../views/NMRSpectrumViewer.vue')},
  {path: "/view_ir_spectrum/:internal_id", name: "IR Spectrum Viewer", component: ()=>import('../views/IRSpectrumViewer.vue')},
  {path: "/analytical_qc_list", name: "Analytical QC List", component: ()=>import('../views/AnalyticalQCList.vue')},
  {path: "/related_applications", name: "Related Applications", component: ()=>import('../views/RelatedApplications.vue')},
  {path: "/classyfire_search", name: "ClassyFire Search", component: ()=>import('../views/ClassyFireClassificationSearch.vue')},
  {path: "/test_viz", name: "Test Viz", component: ()=>import('../views/TestViz.vue')},
  {path: "/release_notes", name: "Release Notes", component: ()=>import('../views/ReleaseNotes.vue')},
  {path: "/record_id_search/:internal_id", name: "Record ID Search", component: ()=>import('../views/RecordIDSearch.vue')},
  {path: "/partial_identifier_search/", name: "Partial Identifier Search", component: ()=>import('../views/PartialIdentifierSearch.vue')},
  {path: "/nta_ms1_workflow/", name: "NTA MS1 Workflow", component: ()=>import('../views/MS1NTAJobSubmission.vue')},
  {path: "/nta_ms2_workflow/", name: "NTA MS2 Workflow", component: ()=>import('../views/MS2NTAJobSubmission.vue')},
  {path: "/:catchAll(.*)", name: "404", component: ()=>import('../views/404.vue')}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active-app-page'
})

export default router