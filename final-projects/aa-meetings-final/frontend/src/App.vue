<style lang="sass">
  #shell
    border: 1px solid #ddd
</style>

<template>

  <v-app>
    <v-container id="shell">
      <h1>AA Meetings Manhattan</h1>

      <Filters />

      <h3>All Locations in Manhattan</h3>
      <Map />
    </v-container>
  </v-app>
  
</template>

<script>
import Filters from './components/Filters';
import Map from './components/Map';


export default {
  name: 'App',

  components: {
    Filters,
    Map,
  },

  data: () => ({
  }),
};
</script>
