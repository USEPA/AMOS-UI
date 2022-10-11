<template>
  <div class="About">
    <h1>About Page</h1>
    <p>{{BACKEND_LOCATION}}</p>
    <p>{{APP_MODE}}</p>
  </div>
</template>

<script>
  import { BACKEND_LOCATION , APP_MODE } from '@/assets/store';

  export default {
    data() {
      return {
        BACKEND_LOCATION,
        APP_MODE
      }
    }
  }
</script>