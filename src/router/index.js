import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
    {path: "/", name: "Home", component: Home},
    {path: "/about", name: "About", component: ()=>import('../views/About.vue')},
    {path: "/search/:search_term", name: "Search Results", component: ()=>import('../views/SearchResults.vue')},
    {path: "/monograph_list", name: "Monograph List", component: ()=>import('../views/MonographList.vue')},
    {path: "/find_inchikeys/:inchikey", name: "Inchikey Search", component: ()=>import('../views/InchikeyRedirect.vue')},
    {path: "/similar_method_search", name: "Similar Methods Search", component: ()=>import('../views/SimilarMethodSearch.vue')},
    {path: "/methods_list", name: "Methods List", component: ()=>import('../views/MethodList.vue')},
    {path: "/batch_search", name: "Batch Search", component: ()=>import('../views/BatchSearch.vue')},
    {path: "/method_with_spectra/:by_type/:internal_id", name: "Method With Associated Spectra", component: ()=>import('../views/MethodWithSpectra.vue')}
  ]

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active-app-page'
})

export default router