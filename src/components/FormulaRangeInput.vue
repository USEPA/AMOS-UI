<!--
  This component constructs an input field that allows specifying a range of counts of atoms as a filter for molecular
  formulae.  Information from this component currently must be extracted by assigning a ref to the component's
  invocation in the template, and then using this.$refs.<ref name>.$data.current_elements to extract the information.

  This component takes no props.
-->

<template>
  <p>Use the below fields to select a range of molecular formulae to search for.  Minimum values can go down to 0, and maximum values can go up to 100.</p>
  <p>Current formula requirements: {{ current_formula }}</p>
  <div style="display: flex;">
    <div class="range-input-organizer-boxes">
      <div style="padding-bottom: 10px; display: flex" v-for="(e, idx) in current_elements">
        <div class="input-group-preappend">
          <span style="width: 50px;" class="input-group-text">{{ e.element }}: </span>
        </div>
        <input :id="`${e.element}-min`" type="number" min="0" :max="Math.min(100, current_elements[idx].max)" step="1" style="width: 80px;" v-model="current_elements[idx].min" @focusout="updateBoxes(idx, 'min')">
        <div class="input-group-append">
          <span class="input-group-text">to</span>
        </div>
        <input :id="`${e.element}-max`" type="number" :min="Math.max(0, current_elements[idx].min)" max="100" step="1" style="width: 80px;" v-model="current_elements[idx].max" @focusout="updateBoxes(idx, 'max')">
      </div>
    </div>
    <div class="range-input-organizer-boxes">
      <p>Use the box below to select an element to add to the list on the left.</p>
      <div style="display: flex;">
        <select v-model="element_to_add">
          <option v-for="(value, key) in unused_elements">{{ key }} - {{ value }}</option>
        </select>
        <button @click="addElementToList(element_to_add)">Add</button>
      </div>
      <br />
      <label><input type="checkbox" v-model="include_halogens">Include Halogens</label>
    </div>
  </div>
</template>

<script>
  import { ELEMENTS } from '@/assets/store.js'

  export default {
    data() {
      return {
        INITIAL_ELEMENTS: ["C", "H", "N", "O", "P", "S"],
        current_elements_old: {
          "C": {min: 1, max: 50}, "H": {min: 0, max: 100}, "O": {min: 0, max: 20}, "N": {min: 0, max: 20},
          "P": {min: 0, max: 10}, "S": {min: 0, max: 10}
        },
        current_elements: [
          {element: "C", min: 1, max: 50},
          {element: "H", min: 0, max: 100},
          {element: "N", min: 0, max: 20},
          {element: "O", min: 0, max: 20},
          {element: "P", min: 0, max: 10},
          {element: "S", min: 0, max: 10}
        ],
        unused_elements: {},
        current_formula: "",
        include_halogens: false,
        element_to_add: "",
        ELEMENTS
      }
    },
    created() {
      this.updateFormula()
      this.updateUnusedElementList()
    },
    methods: {
      updateFormula() {
        var formula_string = ""
        for (let ce of this.current_elements) {
          formula_string += `${ce.element}${ce.min}-${ce.max} `
        }
        this.current_formula = formula_string
      },
      updateUnusedElementList() {
        const currently_used_symbols = this.current_elements.map(x => x.element)
        var currently_unused_symbols = {}
        for (let E of Object.keys(this.ELEMENTS)) {
          if (!currently_used_symbols.includes(E)) {
            currently_unused_symbols[E] = this.ELEMENTS[E]
          }
        }
        this.unused_elements = currently_unused_symbols
      },
      updateBoxes(idx, level) {
        if ((level == "min") && (this.current_elements[idx]["min"] <= 0)) {
          this.current_elements[idx]["min"] = 0
        } else if ((level == "max") && this.current_elements[idx]["max"] >= 100) {
          this.current_elements[idx]["max"] = 100
        } else {
          if (!Number.isInteger(this.current_elements[idx][level])) {
            this.current_elements[idx][level] = Math.round(this.current_elements[idx][level])
          }

          if ((level == "min") & (this.current_elements[idx]["min"] > this.current_elements[idx]["max"])) {
            this.current_elements[idx]["min"] = this.current_elements[idx]["max"]
          } else if ((level == "max") & (this.current_elements[idx]["min"] > this.current_elements[idx]["max"])) {
            this.current_elements[idx]["max"] = this.current_elements[idx]["min"]
          }
        }
        this.updateFormula()
      },
      addElementToList(element_info) {
        const [abbreviation, full_name] = element_info.split(" - ")
        const insert_index = this.current_elements.slice(2).findIndex(x => abbreviation < x.element) + 2
        this.current_elements.splice(insert_index, 0, {element: abbreviation, min: 0, max: 10})
        this.updateFormula()
        this.updateUnusedElementList()
        this.element_to_add = ""
      }
    }
  }

</script>

<style>
  .range-input-organizer-boxes {
    padding: 15px;
  }
</style>