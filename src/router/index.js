import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {path: "/", name: "Home", component: Home},
  {path: "/about", name: "About", component: ()=>import('../views/About.vue')},
  {path: "/contact", name: "Contact", component: ()=>import('../views/Contact.vue')},
  {path: "/data_sources", name: "Data Sources", component: ()=>import('../views/DataSources.vue')},
  {path: "/search/:search_term", name: "Search Results", component: ()=>import('../views/SearchResults.vue')},
  {path: "/fact_sheet_list", name: "Fact Sheet List", component: ()=>import('../views/FactSheetList.vue')},
  {path: "/similar_method_search", name: "Similar Methods Search", component: ()=>import('../views/SimilarMethodSearch.vue')},
  {path: "/methods_list", name: "Methods List", component: ()=>import('../views/MethodList.vue')},
  {path: "/batch_search", name: "Batch Search", component: ()=>import('../views/BatchSearch.vue')},
  {path: "/method_with_spectra/:by_type/:internal_id", name: "Method With Associated Spectra", component: ()=>import('../views/MethodWithSpectra.vue')},
  {path: "/view_method/:internal_id", name: "Method Viewer", component: ()=>import('../views/MethodViewer.vue')},
  {path: "/view_fact_sheet/:internal_id", name: "Fact Sheet Viewer", component: ()=>import('../views/FactSheetViewer.vue')},
  {path: "/mass_spectrum_comparison", name: "Mass Spectrum Comparison", component: ()=>import('../views/MassSpectrumComparison.vue')},
  {path: "/mass_spectrum_search", name: "Mass Spectrum Search", component: ()=>import('../views/MassSpectrumSearch.vue')},
  {path: "/substring_search/:substring", name: "Substring Search", component: ()=>import('../views/SubstringSearch.vue')},
  {path: "/analyte_visualization", name: "Analyte Visualization", component: ()=>import('../views/AnalyteVisualization.vue')},
  {path: "/view_mass_spectrum/:internal_id", name: "Mass Spectrum Viewer", component: ()=>import('../views/MassSpectrumViewer.vue')},
  {path: "/view_spectrum_pdf/:internal_id", name: "Spectrum PDF Viewer", component: ()=>import('../views/SpectrumPDFViewer.vue')},
  {path: "/analytical_qc_list", name: "Analytical QC List", component: ()=>import('../views/AnalyticalQCList.vue')},
  {path: "/related_applications", name: "Related Applications", component: ()=>import('../views/RelatedApplications.vue')},
  {path: "/classification_search", name: "Classification Search", component: ()=>import('../views/ClassyFireClassificationSearch.vue')},
  {path: "/test_viz", name: "Test Viz", component: ()=>import('../views/TestViz.vue')}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active-app-page'
})

export default router