<!--
  This component is an EPA-standard header element that should be available to all pages in this app.

  This component does not take any props.
-->

<template>
  <div>
    <header class="masthead clearfix" role="banner">
      <img alt class="site-logo" src="https://www.epa.gov/sites/all/themes/epa/logo.png">
      <div class="site-name-and-slogan">
        <h1 class="site-name">
          <a href="https://www.epa.gov/" rel="home" title="Go to the home page">
            <span>US EPA</span>
          </a>
        </h1>
        <div class="site-slogan">
          United States Environmental Protection Agency
        </div>
      </div>
      <div class="region-header">
        <div id="block-epa-core-gsa-epa-search" class="block-epa-core-gsa-epa-search">
          <form action="https://search.epa.gov/epasearch" class="epa-search" method="get">
            <label class="element-hidden" for="search-box">Search</label>
            <input
              id="search-box"
              class="form-text"
              name="querytext"
              placeholder="Search EPA.gov"
              value
            >
            <button id="search-button" class="epa-search-button" title="Search" type="submit">
              Search
            </button>
            <input name="areaname" type="hidden" value>
            <input name="areacontacts" type="hidden">
            <input name="areasearchurl" type="hidden" value>
            <input name="typeofsearch" type="hidden" value="epa">
            <input name="result_template" type="hidden" value="2col.ftl">
          </form>
        </div>
      </div>
    </header>
    <nav class="nav main-nav clearfix" role="navigation">
      <div class="nav__inner">
        <h2 class="element-invisible">
          Main menu
        </h2>
        <ul class="menu" role="menu">
          <li class="menu-item" role="presentation">
            <a
              id="envtopics"
              class="menu-link"
              href="https://www.epa.gov/environmental-topics"
              role="menuitem"
              title="Learn about Environmental Topics that EPA covers."
            >Environmental Topics</a>
          </li>
          <li class="menu-item" role="presentation">
            <a
              id="envlaws"
              class="menu-link"
              href="https://www.epa.gov/laws-regulations"
              role="menuitem"
              title="Laws written by Congress provide the authority for EPA to write regulations. Regulations explain the technical, operational, and legal details necessary to implement laws."
            >Laws &amp; Regulations</a>
          </li>
          <li class="menu-item" role="presentation">
            <a
              id="envabout"
              class="menu-link"
              href="https://www.epa.gov/aboutepa"
              role="menuitem"
              title="Learn more about our mission and what we do, how we are organized, and our history."
            >About EPA</a>
          </li>
        </ul>
      </div>
    </nav>
    <div id="mobile-nav" class="mobile-nav">
      <div class="mobile-bar clearfix">
        <label class="menu-button" for="mobile-nav-toggle">Menu</label>
      </div>
      <input id="mobile-nav-toggle" checked type="checkbox">
      <div id="mobile-links" class="mobile-links element-hidden" style="height:2404px;">
        <ul class="mobile-menu">
          <li class="menu-item" role="presentation">
            <a
              id="envtopics"
              class="menu-link"
              href="https://www.epa.gov/environmental-topics"
              role="menuitem"
              title="Learn about Environmental Topics that EPA covers."
            >Environmental Topics</a>
          </li>
          <li class="menu-item" role="presentation">
            <a
              id="envlaws"
              class="menu-link"
              href="https://www.epa.gov/laws-regulations"
              role="menuitem"
              title="Laws written by Congress provide the authority for EPA to write regulations. Regulations explain the technical, operational, and legal details necessary to implement laws."
            >Laws &amp; Regulations</a>
          </li>
          <li class="menu-item" role="presentation">
            <a
              id="envabout"
              tabindex="0"
              class="menu-link"
              href="https://www.epa.gov/aboutepa"
              role="menuitem"
              title="Learn more about our mission and what we do, how we are organized, and our history."
            >About EPA</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import {mapGetters} from 'vuex'

export default {
  name: 'EPA_header',
  computed: {
    ...mapGetters({
      currentStep: 'getStep',
    }),
    pos() {
      return this.currentStep < 3 ? 'fixed' : 'relative'
    },
  },
}
</script>

<style scoped src="@/styles/oneepastyle.css">
.container-fluid {
  padding-left: 0px !important;
  padding-right: 0px !important;
}
form.epa-search {
  bottom: -2.29em;
}
.skip-links {
  font-size: 16px;
  left: 50%;
  margin-left: -7em;
  position: absolute;
  width: 14em;
  z-index: 9999;
}
header.masthead {
  padding-bottom: 0.2em;
  padding-top: 0.4em;
}
.show-icon {
    float: right
}
</style>