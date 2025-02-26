<template>
  <div>
    Filter mode:
    <label><input type="radio" id="type-ahead" v-model="filter_mode" value="type-ahead">Type-ahead</label>
    <label><input type="radio" id="range" v-model="filter_mode" value="range">Range</label>
    <div v-if="filter_mode == 'type-ahead'">
      <input type="text" v-model="type_ahead_val">
    </div>
    <div v-else="filter_mode == 'range'">
      <input type="text" v-model.number="mass_target"> Da ± &nbsp;<input type="text" v-model.number="mass_error" @focusout="constrainMassError">
      &nbsp;
      <label><input type="radio" id="error_da" v-model="mass_error_type" value="da">Da</label>
      &nbsp;
      <label><input type="radio" id="error_ppm" v-model="mass_error_type" value="ppm">ppm</label>
    </div> 
  </div>
</template>

<script>

  import { constrainNumber } from '@/assets/common_functions.js';

  export default {
    data() {
      return {
        filter_mode: "type-ahead",
        type_ahead_val: "",
        mass_target: null,
        mass_error: 0.5,
        mass_error_type: "da",
        max_ppm: 25,
        max_da: 0.5,
      }
    },
    watch: {
      filter_mode: function(val, oldVal) {
        if (val !== oldVal) {
          this.params.filterChangedCallback()
        }
      },
      type_ahead_val: function(val, oldVal) {
        if (val !== oldVal) {
          this.params.filterChangedCallback()
        }
      },
      mass_target: function(val, oldVal) {
        if (val !== oldVal) {
          this.params.filterChangedCallback()
        }
      },
      mass_error: function(val, oldVal) {
        if (val !== oldVal) {
          this.params.filterChangedCallback()
        }
      },
      mass_error_type: function(val, oldVal) {
        if (val !== oldVal) {
          if (this.mass_error_type == "da") {
            this.mass_error = 0.5
          } else if (this.mass_error_type == "ppm") {
            this.mass_error = 5
          }
          this.params.filterChangedCallback()
        }
      }
    },
    methods: {
      constrainMassError() {
        const upper_limit = this.mass_error_type == "da" ? this.max_da : this.max_ppm
        this.mass_error = constrainNumber(this.mass_error, 0, upper_limit)
      },
      calculateMassRange() {
        if (this.mass_target !== null) {
          let minimum_mass = 0
          let maximum_mass = 0
          if (this.mass_error_type == "da") {
            minimum_mass = this.mass_target - this.mass_error
            maximum_mass = this.mass_target + this.mass_error
          } else if (this.mass_error_type == "ppm") {
            minimum_mass = this.mass_target * (1 - this.mass_error/1000000.0)
            maximum_mass = this.mass_target * (1 + this.mass_error/1000000.0)
          }
          return [minimum_mass, maximum_mass]
        }
        return [null, null]
      },
      isFilterActive() {
        if (this.filter_mode == 'type-ahead') {
          return this.type_ahead_val.length > 0
        } else if (this.filter_mode == 'range') {
          // if you type something in the  mass_target field and then delete it, the field becomes
          // an empty string for some reason
          return (this.mass_target !== null) && (this.mass_target !== "")
        }
        return false
      },
      doesFilterPass(params) {
        if (this.filter_mode == 'type-ahead') {
          return String(params.data.monoisotopic_mass).startsWith(this.type_ahead_val)
        } else if (this.filter_mode == 'range') {
          const [lower_limit, upper_limit] = this.calculateMassRange(this.mass_target, this.mass_error, this.mass_error_type)
          return (params.data.monoisotopic_mass >= lower_limit) && (params.data.monoisotopic_mass <= upper_limit)
        }
      },
      getModel() {
        /* CURRENTLY UNTESTED */
        if (!this.isFilterActive()) {
          return null
        } else if (this.filter_mode == 'type-ahead'){
          return {filterMode: this.filter_mode, typeAheadVal: this.type_ahead_val}
        } else if (this.filter_mode == 'range') {
          return {filterMode: this.filter_mode, massTarget: this.mass_target, massError: this.mass_error, massErrorType: this.mass_error_type}
        }
      },
      setModel(model) {
        /* CURRENTLY UNTESTED */
        if (model == null) {
          this.filter_mode = 'type-ahead'
          this.type_ahead_val = ''
        } else {
          this.filter_mode = model.filterMode
          if (model.filterMode == 'type-ahead') {
            this.type_ahead_val = model.typeAheadVal
          } else if (model.filterMode == 'range') {
            this.mass_target = model.massTarget
            this.mass_error = model.massError
            this.mass_error_type = model.massErrorType
          }
        }
      },
      getModelAsString() {
        if (this.filter_mode == 'type-ahead') {
          return this.type_ahead_val
        } else if (this.filter_mode == 'range') {
          return `${this.mass_target} ± ${this.mass_error} ${this.mass_error_type}`
        }
      }
    }
  }
</script>