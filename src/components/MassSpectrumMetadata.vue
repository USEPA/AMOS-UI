<!--
  This component is meant to be a stamdard display of spectrum metadata, mostly dividing it along the lines of
  chromatography versus spectrometry, with some additional useful fields appended.

  This component takes one prop:
  - spectrumMetadata: A JSON object containing the metadata.  Keys should have either strings or numbers as values,
    except for the Chromatography and Spectrometry fields, which have values of JSON objects.  Required.
-->

<template>
  <div id="spectrum_metadata">
    <div v-if="spectrumMetadata.Chromatography && (Object.keys(spectrumMetadata.Chromatography).length > 0)">
      <h5>Chromatography Info:</h5>
      <ul style="list-style-type: none;" ref="metadata_modal">
        <li v-for="c in Object.entries(spectrumMetadata.Chromatography)"><strong>{{c[0]}}:</strong> {{c[1]}}</li>
      </ul>
    </div>
    <div v-if="spectrumMetadata.Spectrometry && (Object.keys(spectrumMetadata.Spectrometry).length > 0)">
      <h5 >Spectrometry Info:</h5>
      <ul style="list-style-type: none;">
        <li v-for="s in Object.entries(spectrumMetadata.Spectrometry)"><strong>{{s[0]}}:</strong> {{s[1]}}</li>
      </ul>
    </div>
    <span v-if="spectrumMetadata.Author"><strong>Author(s):</strong> {{spectrumMetadata.Author}}</span>
    <br />
    <span v-if="spectrumMetadata.Date"><strong>Date:</strong> {{spectrumMetadata.Date}}</span>
    <br /><br />
    <button @click="copyMetadata()">Copy to Clipboard</button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        x: 1
      }
    },
    props: {spectrumMetadata: {type: Object, required: true}},
    methods: {
      copyMetadata() {
        const chromatography = Object.entries(this.spectrumMetadata.Chromatography).map(x => `- ${x[0]}: ${x[1]}`).join("\n")
        const spectrometry = Object.entries(this.spectrumMetadata.Spectrometry).map(x => `- ${x[0]}: ${x[1]}`).join("\n")
        var data_string = `Chromatography:\n${chromatography}\nSpectrometry:\n${spectrometry}`

        var additional_info_string = ""
        if (this.spectrumMetadata.Author) {
          additional_info_string = additional_info_string + `\nAuthor: ${this.spectrumMetadata.Author}`
        }
        if (this.spectrumMetadata.Date) {
          additional_info_string = additional_info_string + `\nDate: ${this.spectrumMetadata.Date}`
        }
        if (additional_info_string != "") {
          data_string = data_string + additional_info_string
        }
        // NOTE: the preferred way to copy to clipboard is apparently "navigator.clipboard.writeText()" these days. I
        // can't get that to work in this app, though, since it apparently requires a secured connection and the
        // deployed version of this app doesn't have that.  So I'm sticking to this technically-depricated solution that
        // I pulled out of CompTox's code, since it apparently works there.
        const textarea = document.createElement('textarea')
        textarea.value = data_string
        //document.body.appendChild(textarea)
        document.getElementById("spectrum_metadata").appendChild(textarea)
        textarea.select()
        try {
          document.execCommand('copy')
        } catch (err) {
          console.log('Cannot copy: ' + err)
        }
        //document.body.removeChild(textarea)
        document.getElementById("spectrum_metadata").removeChild(textarea)
      }
    }
  }
</script>