<style lang="sass">
  #app
    background: #222
    color: #fff

</style>

<template>
  <v-app>
    <v-container fluid>
    <v-main>
      <About/>
      <Radar/>
      
    </v-main>
    </v-container>
       <Footer/>
 
  </v-app>
</template>

<script>
import About from './components/About';
import Radar from './components/Radar';
import Footer from './components/Footer';

export default {
  name: 'App',

  components: {
    About,
    Radar,
    Footer,
  },

  data: () => ({
    //
  }),

  mounted() {
      this.$store.dispatch('fetchData')
  },
};
</script>
