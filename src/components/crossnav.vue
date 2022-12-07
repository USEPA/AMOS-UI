<template>
    <nav class="navstyle">
        <span style="font-size:22px">&nbsp; Related EPA Applications &nbsp;</span>
        <a href="http://v2626umcth819.rtord.epa.gov:9414/">Chemical Transformations Database</a>&nbsp; &nbsp;
        <a href="http://v2626umcth819.rtord.epa.gov:81/substances">Analytical QC</a>&nbsp; &nbsp;
        <a href="http://v2626umcth819.rtord.epa.gov:5173/">Spectral and Methods Database</a> &nbsp; &nbsp;
        <a href="http://v2626umcth819.rtord.epa.gov:9004/molmass_web.py">Molecular Mass Calculator</a> &nbsp; &nbsp;
    </nav>
</template>

<script>

export default {
    name: 'crossnav',
}

</script>

<style scoped>



nav{
  display:flex;
  align-items: left;
  justify-content: left;
  background: #0071bc;
  color:white;
}

nav .navstyle{
  padding: 5px;
  position: relative;
  float: left;
  text-align: left;
  border-bottom: 3px solid transparent;
  display: flex;
  transition: 0.4s;
  font-family:'Roboto';
  color:white;
  margin-left: 0;
  background: #586470;
}

a { color: white; }
a:hover{ color:white; }
</style>