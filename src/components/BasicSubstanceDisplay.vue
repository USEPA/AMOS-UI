<template>
  <div class="chemical-box">
    <div class="chemical-image-highlight">
      <img v-if="image_link" class="chemical-image" :src="image_link" :alt="`Structure image for ${substanceInfo.dtxsid}`"/>  
      <div v-else style="text-align: center; display: flex; align-items: center;">No structural representation was found for this substance.</div>
    </div>
    <div class="chemical-info">
      <ul style="list-style-type: none;">
        <table>
          <tr>
            <td><button class="copy-button" title="Copy Name" @click="copyToClipboard(substanceInfo.preferred_name)">⎘</button></td>
            <td><strong>(Preferred) Name:</strong> {{ substanceInfo.preferred_name }}</td>
          </tr>
          <tr>
            <td><button class="copy-button" title="Copy DTXSID" @click="copyToClipboard(substanceInfo.dtxsid)">⎘</button></td>
            <td><strong>DTXSID:</strong> <a :href="`${COMPTOX_PAGE_URL}${substanceInfo.dtxsid}`" target="_blank">{{ substanceInfo.dtxsid }}</a></td>
          </tr>
          <tr>
            <td><button class="copy-button" title="Copy CASRN" @click="copyToClipboard(substanceInfo.casrn)">⎘</button></td>
            <td><strong>CASRN:</strong> {{ substanceInfo.casrn }}</td>
          </tr>
          <tr>
            <td><button class="copy-button" title="Copy InChIKey" @click="copyToClipboard(substanceInfo.indigo_inchikey ? substanceInfo.indigo_inchikey : substanceInfo.jchem_inchikey)">⎘</button></td>
            <td><strong>InChIKey:</strong> <router-link :to="`/partial_identifier_search?inchikey_first_block_search=${displayed_inchikey.first_block}`" target="_blank">{{displayed_inchikey.first_block}}</router-link>{{displayed_inchikey.remainder}}</td>
          </tr>
          <tr>
            <td></td>
            <td><strong>Molecular Formula:</strong> {{ substanceInfo.molecular_formula }}</td>
          </tr>
          <tr>
            <td></td>
            <td><strong>Monoisotopic Mass:</strong> {{ substanceInfo.monoisotopic_mass }}</td>
          </tr>
          <tr v-if="classification">
            <td></td>
            <td><ClassyFireDisplay :kingdom="classification.kingdom" :superklass="classification.superklass" :klass="classification.klass" :subklass="classification.subklass" /></td>
          </tr>
        </table>
      </ul>
    </div>
  </div>
</template>

<script>

  import { imageLinkForSubstance } from '@/assets/common_functions'
  import '@/assets/style.css'
  import { COMPTOX_PAGE_URL } from '@/assets/store'
  import ClassyFireDisplay from '@/components/ClassyFireDisplay.vue'

  export default {
    props: {substanceInfo: Object, classification: Object},
    data() {
      return {
        COMPTOX_PAGE_URL,
        displayed_inchikey: {first_block: "", remainder: ""},
        image_link: ""
      }
    },
    watch: {
      substanceInfo() {
        this.image_link = imageLinkForSubstance(this.substanceInfo.dtxsid, this.substanceInfo.image_in_comptox)
        const inchikey = this.substanceInfo.indigo_inchikey ? this.substanceInfo.indigo_inchikey : this.substanceInfo.jchem_inchikey
        if (inchikey) {
          this.displayed_inchikey.first_block = inchikey.slice(0,14)
          this.displayed_inchikey.remainder = inchikey.slice(14)
        }
      }
    },
    created() {
      this.image_link = imageLinkForSubstance(this.substanceInfo.dtxsid, this.substanceInfo.image_in_comptox)
      const inchikey = this.substanceInfo.indigo_inchikey ? this.substanceInfo.indigo_inchikey : this.substanceInfo.jchem_inchikey
        if (inchikey) {
          this.displayed_inchikey.first_block = inchikey.slice(0,14)
          this.displayed_inchikey.remainder = inchikey.slice(14)
        }
    },
    methods: {
      copyToClipboard(text) {
        // NOTE: the preferred way to copy to clipboard is apparently "navigator.clipboard.writeText()" these days. I
        // can't get that to work in this app, though, since it apparently requires a secured connection and the
        // deployed version of this app doesn't have that.  So I'm sticking to this technically-depricated solution that
        // I pulled out of CompTox's code, since it apparently works there.
        const textarea = document.createElement('textarea')
        textarea.value = text
        document.body.appendChild(textarea)
        textarea.select()
        try {
          document.execCommand('copy')
        } catch (err) {
          console.log('Cannot copy: ' + err)
        }
        document.body.removeChild(textarea)
      }
    },
    components: {ClassyFireDisplay}
  }
</script>

<style>
  .copy-button {
    padding: 0px 5px 0px 0px;
    border: none;
    background: none;
  }
</style>