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
  {path: "/spectrum_comparison", name: "Spectrum Comparison", component: ()=>import('../views/SpectrumComparison.vue')},
  {path: "/spectrum_search", name: "Spectrum Search", component: ()=>import('../views/SpectrumSearch.vue')},
  {path: "/substring_search/:substring", name: "Substring Search", component: ()=>import('../views/SubstringSearch.vue')},
  {path: "/analyte_visualization", name: "Analyte Visualization", component: ()=>import('../views/AnalyteVisualization.vue')},
  {path: "/view_spectrum/:internal_id", name: "Spectrum Viewer", component: ()=>import('../views/SpectrumDisplay.vue')},
  {path: "/view_spectrum_pdf/:internal_id", name: "Spectrum PDF Viewer", component: ()=>import('../views/SpectrumPDFViewer.vue')},
  {path: "/analytical_qc_list", name: "Analytical QC List", component: ()=>import('../views/AnalyticalQCList.vue')}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active-app-page'
})

export default router