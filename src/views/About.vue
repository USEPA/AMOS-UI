<template>
  <div class="About">
    <h1>About</h1>
    <p>This web app is designed to perform searches on and allow examination of a collection of publicly available data from several sources, all of which are focused on mass spectra and other chemical analyses. </p>
    <p>The database contains a mixture of data that can be divided into three categories.</p>
    <ul>
      <li>Mass spectra of various types (including GC, LC, Raman, and IR spectra, among others).</li>
      <li>Monographs that detail the results of an in-depth analysis.  These often contain multiple spectra of varying types.</li>
      <li>Analytical methods which document testing procedures for one or more compounds.</li>
    </ul>
    <br />
    <br />
    <p>This app was last updated on 2022-11-22.</p>
    <label class="toggle-switch">
      <input type="checkbox" class="toggle-switch-input" checked>
      <span class="toggle-slider"></span>
    </label> 
  </div>
</template>

<script>
  export default {
    data() {
      return {
        x: true
      }
    }
  }
</script>

<style>
  .toggle-switch {
    position: fixed;
    width: 34px;
    height: 19px;
  }

  .toggle-switch-input { 
    opacity: 0;
    width: 0;
    height: 0;
  }

  .toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 1rem;
    background-color: lightgray;
    transition: .3s;
  }

  .toggle-slider::before {
    position: absolute;
    content: "";
    height: 15px;
    width: 15px;
    left: 2px;
    bottom: 2px;
    border-radius: 50%;
    background-color: white;
    transition: .3s;
  }

  .toggle-switch-input:checked + .toggle-slider::before {
    transform: translateX(15px);
  }

  .toggle-switch-input:checked + .toggle-slider {
    background-color: cornflowerblue;
  }
</style>