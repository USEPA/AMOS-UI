<!--
  This component is meant to be a stamdard display of spectrum metadata, mostly dividing it along the lines of
  chromatography versus spectrometry, with some additional useful fields appended.

  This component takes one prop -- spectrumMetadata, a JSON object containing the metadata.
-->

<template>
  <div id="spectrum_metadata">
    <!-- <h5>Spectrum Metadata:</h5> -->
    <ul style="list-style-type: none;" ref="metadata_modal">
      <li v-for="c in Object.entries(spectrumMetadata)"><strong>{{c[0]}}:</strong> {{c[1]}}</li>
    </ul>
    <button @click="copyMetadata()">Copy to Clipboard</button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        x: 1,
      }
    },
    props: {spectrumMetadata: Object},
    methods: {
      copyMetadata() {
        const metadata_string = Object.entries(this.spectrumMetadata).map(x => `${x[0]}: ${x[1]}`).join("\n")

        // NOTE: the preferred way to copy to clipboard is apparently "navigator.clipboard.writeText()" these days. I
        // can't get that to work in this app, though, since it apparently requires a secured connection and the
        // deployed version of this app doesn't have that.  So I'm sticking to this technically-depricated solution that
        // I pulled out of CompTox's code, since it apparently works there.
        const textarea = document.createElement('textarea')
        textarea.value = metadata_string
        document.getElementById("spectrum_metadata").appendChild(textarea)
        textarea.select()
        try {
          document.execCommand('copy')
        } catch (err) {
          console.log('Cannot copy: ' + err)
        }
        document.getElementById("spectrum_metadata").removeChild(textarea)
      }
    }
  }
</script>