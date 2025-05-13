<!--
  This component is an input for an atomic mass range, with a reference value in Daltons and a window in either Daltons
  or parts per million.

  The calculated mass range currently must be extracted by assigning a ref to the component's infovation in the
  template, and then using this.$refs.<ref name>.calculateRange() to extract the computed mass range.

  This component does not take any props.
-->

<template>
  <input type="text" v-model.number="mass_target"> Da ± &nbsp;<input type="text" v-model.number="mass_error" @focusout="constrainMassError">
  &nbsp;
  <label><input type="radio" id="error_da" v-model="mass_error_type" value="da">Da</label>
  &nbsp;
  <label><input type="radio" id="error_ppm" v-model="mass_error_type" value="ppm">ppm</label>
</template>

<script>
  import { constrainNumber } from '@/assets/common_functions.js'

  export default {
    expose: ['calculateRange'],
    data() {
      return {
        mass_target: null,
        mass_error: 5,
        mass_error_type: "ppm",
        max_ppm: 25,
        max_da: 0.5,
        minimum_mass: null,
        maximum_mass: null,
      }
    },
    watch: {
      mass_error_type() {
        if (this.mass_error_type == "da") {
          this.mass_error = 0.5
        } else if (this.mass_error_type == "ppm") {
          this.mass_error = 5
        }
      }
    },
    created() {
      1
    },
    methods: {
      constrainMassError() {
        const upper_limit = this.mass_error_type == "da" ? this.max_da : this.max_ppm
        this.mass_error = constrainNumber(this.mass_error, 0, upper_limit)
      },
      calculateRange() {
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
      }
    }
  }
</script>