import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
    {path: "/", name: "Home", component: Home},
    {path: "/about", name: "About", component: ()=>import('../views/About.vue')},
    {path: "/cfsre_list", name: "CFSRE Monograph List", component: ()=>import('../views/CFSREList.vue')},
    {path: "/swg_list", name: "SWG Monograph List", component: ()=>import('../views/SWGList.vue')},
    {path: "/search/:search_term", name: "Search Results", component: ()=>import('../views/SearchResults.vue')},
    {path: "/monograph_list", name: "Monograph List", component: ()=>import('../views/MonographList.vue')},
    {path: "/find_inchikeys/:inchikey", name: "Inchikey Search", component: ()=>import('../views/InchikeyRedirect.vue')},
    {path: "/similar_method_search", name: "Similar Method Search", component: ()=>import('../views/SimilarMethodSearch.vue')}
  ]

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active-app-page'
})

export default router