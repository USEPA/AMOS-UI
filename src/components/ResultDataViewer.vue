<template>
<div>
<u @click="displayRecordData">Steve</u>
</div>
</template>

<script>
  export default {
    setup(props) {
      let {data_type} = props.params;
      function displayRecordData(dt) {
        console.log(dt)
      }
      return {data_type, displayRecordData}
    }
  }
</script>