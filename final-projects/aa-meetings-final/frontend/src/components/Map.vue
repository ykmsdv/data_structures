<style lang="sass">
  #mapContainer 
    width: 100%
    height: 80vh
    margin: 0 0 30px 0
  #map
    h3
      margin: 0 0 10px 0
      font:
          weight: 600 !important
    .meetingCount
      display: block
      line-height: 1.3em
      font:
        weight: 400
    .leaflet-tooltip
      min-width: 200px
</style>

<template>
    <v-row v-if="allLocations.length" id="map">
      <v-col :cols=" hasSidePanel ? 8 : 12" >
        <div id="mapContainer"></div>
      </v-col>
      
      <v-col cols="4" v-if="hasSidePanel">

         <SidePanel :selectedLocation="selectedLocation" @closeSidePanel="selectedLocation = Object"/>

      </v-col>
    </v-row>
</template>

<script>
import { mapState } from 'vuex';
import SidePanel from './SidePanel';
import "leaflet/dist/leaflet.css";
import * as L from 'leaflet';
import * as _ from 'underscore';


  export default {
    name: 'Map',
    components: {
      SidePanel
    },
    computed: {
      ...mapState({
        allLocations: state => state.source.defaultLocations,
        filteredLocations: state => state.source.filteredLocations,        
      }),
      dataIsReady: function() {
        return this.allLocations === 'object' ? true : false;
      },
      hasSidePanel: function() {
        let isReady = false;

        if(typeof this.selectedLocation === 'object') {
          isReady = true;
        }
        return isReady;
      }
    },
    data: () => ({
      selectedLocation: Object
    }),
      watch: {
        allLocations: function() {
          this.render(this.allLocations);
        },
        filteredLocations: function() {
          this.render(this.filteredLocations);
        }
      },
    created() {
      this.$store.dispatch('getAllLocations');
    },
    mounted() {
      if(this.dataIsReady) {this.render(this.allLocations)}
      
    },
    methods: {
      render: function(data) {
        if(this.map) this.map.remove();

        this.map = L.map('mapContainer').setView([40.785, -73.987], 12);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
              subdomains: 'abcd',
              minZoom: 10,
              maxZoom: 17
            }).addTo(this.map);
        

          data.forEach(d => {

            L.circle( [d.lat, d.long],  {
                    fillColor: '#07C6B0',
                    weight: 1,
                    opacity: 1,
                    radius: 175,
                    color: 'white',
                    fillOpacity: 0.8
            }).bindTooltip( (layer) => {
                return this.makeTooltip(d);
            }, {direction: 'top'})
            .on('click', () => this.selectedLocation = d)
            .addTo(this.map)
         });


      },
      makeTooltip: function(d) {
            let meetingsPerDay = _.chain(d.meetings)
                  .groupBy('day')
                  .map( (val, key) => [ key, val.length ])
                  .value();

                let meetingsCount = "";

                meetingsPerDay.forEach(m => {
                  let meetingSuffix = m[1] > 1 ? 'meetings' : 'meeting';
                  meetingsCount += `<span class="meetingCount"><strong>${m[0].slice(0,3)}</strong>: ${m[1]} ${meetingSuffix}</span>`
                });

                let address = d.address.split(' New York');
                    address = address[0] + ', <br>' + address[1]

                let ttp = `
                  <h3 class="font-weight-regular">${address}<h3> 
                  location is accessible: ${d.accessible}
                  ${meetingsCount}
                  <span>Click for Details</span>  
                  `;
          return ttp;
      },
      
    }
  }
</script>
