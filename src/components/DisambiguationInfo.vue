<!--
  This component is used to display information on a compound.  It is intended to be used with the disambiguation modals
  for synonym and InChIKey searches.

  This component takes two props:
  - substance_info: an object containing information on the substance.
  - record_info: an object containing counts of how many records of each type are available in AMOS.
-->

<template>
  <div @click="dummy" class="disambiguation-box">
    <div class="disambiguation-content">
      <div class="chemical-image-highlight">
        <img v-if="image_link" class="chemical-image" :src="image_link"/>  
        <div v-else style="text-align: center; display: flex; align-items: center;">No image was found for this compound.</div>
      </div>
      <div class="chemical-info">
        <ul style="list-style-type: none;">
          <li><strong>(Preferred) Name:</strong> {{ substance_info.preferred_name }} </li>
          <li><strong>DTXSID:</strong> {{ substance_info.dtxsid }} </li>
          <li><strong>CASRN:</strong> {{ substance_info.casrn }} </li>
          <li><strong>InChIKey:</strong> {{ substance_info.indigo_inchikey ? substance_info.indigo_inchikey : substance_info.jchem_inchikey}} </li>
          <li><strong>Molecular Formula:</strong> {{ substance_info.molecular_formula }} </li>
          <li><strong>Mass:</strong> {{ substance_info.monoisotopic_mass }} </li>
          <li><br /></li>
          <li v-if="record_info">Records available:
            <span v-if="record_info.Spectrum">{{ record_info.Spectrum }} spectra</span>
            <span v-if="record_info.Spectrum && (record_info['Fact Sheet'] || record_info.Method)">, </span>
            <span v-if="record_info['Fact Sheet']">{{ record_info['Fact Sheet'] }} fact sheets</span>
            <span v-if="record_info['Fact Sheet'] && record_info.Method">, </span>
            <span v-if="record_info.Method">{{ record_info.Method }} methods</span>
          </li>
          <li v-else>No records for this substance are available.</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  import { getSubstanceImageLink } from '@/assets/common_functions'
  import '@/assets/style.css'

  export default {
    props: {substance_info: Object, record_info: Object},
    data() {
      return {
        image_link: ""
      }
    },
    async created() {
      this.image_link = await getSubstanceImageLink(this.substance_info.dtxsid)
    },
    methods: {
      dummy() {
        1
      }
    }
  }
</script>

<style>
  .disambiguation-box {
    border: 4px solid blue;
    width: fit-content;
    float: left;
  }

  .disambiguation-box:hover {
    background-color: #EEEEEE
  }

  .disambiguation-content {
    display: flex;
    align-content: left;
    justify-content: flex-start;
    overflow: hidden;
    width: 700px;
    text-overflow: ellipsis;
    margin: 6px;
  }
</style>