<!--
  This component diplays some basic information on an individual substance and its presence in AMOS's database.  It is
  the primary display element of the disambiguation modals for synonym and InChIKey searches.

  This component takes two props:
  - substance_info: an object containing information on the substance.
  - record_info: an object containing counts of how many records of each type are available in AMOS for the given substance.
-->

<template>
  <div @click="dummy" class="disambiguation-box">
    <div class="disambiguation-content">
      <div class="chemical-image-highlight">
        <img v-if="image_link" class="chemical-image" :src="image_link" :alt="`Structure image for ${substance_info.dtxsid}`"/>  
        <div v-else style="text-align: center; display: flex; align-items: center;">No image was found for this substance.</div>
      </div>
      <div class="chemical-info">
        <ul style="list-style-type: none;">
          <li><strong>(Preferred) Name:</strong> {{ substance_info.preferred_name }} </li>
          <li><strong>DTXSID:</strong> {{ substance_info.dtxsid }} </li>
          <li><strong>CASRN:</strong> {{ substance_info.casrn }} </li>
          <li><strong>InChIKey:</strong> <router-link :to="`/partial_identifier_search?inchikey_first_block_search=${displayed_inchikey.first_block}`" target="_blank">{{displayed_inchikey.first_block}}</router-link>{{displayed_inchikey.remainder}} </li>
          <li><strong>Molecular Formula:</strong> {{ substance_info.molecular_formula }} </li>
          <li><strong>Monoisotopic Mass:</strong> {{ substance_info.monoisotopic_mass }} </li>
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
  import { imageLinkForSubstance } from '@/assets/common_functions.js'
  import '@/styles/main.css'

  export default {
    props: {substance_info: Object, record_info: Object},
    data() {
      return {
        displayed_inchikey: {first_block: "", remainder: ""},
        image_link: ""
      }
    },
    watch: {
      substance_info() {
        this.image_link = imageLinkForSubstance(this.substance_info.dtxsid, this.substance_info.image_in_comptox)
        const inchikey = this.substance_info.indigo_inchikey ? this.substance_info.indigo_inchikey : this.substance_info.jchem_inchikey
        if (inchikey) {
          this.displayed_inchikey.first_block = inchikey.slice(0,14)
          this.displayed_inchikey.remainder = inchikey.slice(14)
        }
      }
    },
    async created() {
      this.image_link = imageLinkForSubstance(this.substance_info.dtxsid, this.substance_info.image_in_comptox)
      const inchikey = this.substance_info.indigo_inchikey ? this.substance_info.indigo_inchikey : this.substance_info.jchem_inchikey
      if (inchikey) {
        this.displayed_inchikey.first_block = inchikey.slice(0,14)
        this.displayed_inchikey.remainder = inchikey.slice(14)
      }
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