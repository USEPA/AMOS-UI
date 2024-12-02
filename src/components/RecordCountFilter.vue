<template>
  <div>
    <p>Show...</p>
    <label><input type="radio" id="both" v-model="sort_val" value="Both">All rows</label>
    <br />
    <label><input type="radio" id="yes" v-model="sort_val" value="Yes">Only rows with {{ params.record_name }}</label>
    <br />
    <label><input type="radio" id="no" v-model="sort_val" value="No">Only rows without {{ params.record_name }}</label>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        sort_val: "Both"
      }
    },
    watch: {
      sort_val: function(val, oldVal) {
        if (val !== oldVal) {
          this.params.filterChangedCallback()
        }
      }
    },
    methods: {
      isFilterActive() {
        return this.sort_val !== "Both"
      },
      doesFilterPass(params) {
        // the this.params refers to the params for the component, not the argument for this function
        const field = this.params.colDef.field
        if (this.sort_val == "Yes") {
          return params.data[field] > 0
        } else {
          return params.data[field] == 0
        }
      },
      getModel() {
        if (this.sort_val == "Both") {
          return undefined
        }
        return {fieldType: "count", field: this.sort_val}
      },
      setModel(model) {
        if (model == null) {
          this.sort_val = "Both"
          this.params.filterChangedCallback()
        } else {
          this.sort_val = model.field
          this.params.filterChangedCallback()
        }
      },
      getModelAsString() {
        return this.sort_val
      }
    }
  }
</script>

<style>
  
</style>