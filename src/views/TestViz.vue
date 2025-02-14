<template>
  Zooming is by Ctrl+Space.
  <!-- <OccurrenceHeatmap /> -->
</template>


<script>
  import OccurrenceHeatmap from '@/components/OccurrenceHeatmap.vue'

  export default {
    data() {
      return {
        x: 1
      }
    },
    components: { OccurrenceHeatmap },
    created() {
      1
    }
  }
</script>