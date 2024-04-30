<template>
  <DualMassSpectrumPlot :spectrum1="test_spectrum1" :spectrum2="test_spectrum2" spectrum1_name="Test Spectrum 1" spectrum2_name="Test Spectrum 2"/>
</template>


<script>
  import DualMassSpectrumPlot from '@/components/DualMassSpectrumPlot.vue'

  export default {
    data() {
      return {
        test_spectrum1: [
          [175.0503,1.139139],
          [282.0892,13.042042],
          [285.0759,2.254254],
          [298.084,1.455455],
          [299.0921,20.991993],
          [310.0842,4.224224],
          [311.0919,3.618619],
          [313.0715,12.406406],
          [327.0871,16.472471],
          [328.0951,59.25125],
          [343.1187,100.0]
        ],
        test_spectrum2: [
          [132.0319, 55.965294],
          [138.076, 40.78091],
          [146.0217, 100],
          [174.0537, 27.548807]
        ]
      }
    },
    components: {DualMassSpectrumPlot}
  }
</script>