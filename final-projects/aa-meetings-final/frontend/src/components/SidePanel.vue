<style lang="sass">

  h6
    font-size: 10pt

</style>

<template>
    <v-card
      v-if="dataIsReady && !closeSidePanel"
      class="mx-auto overflow-y-auto"
      style="max-height: 710px"
    >

    <v-card-actions>
      <v-btn
        text
        color="teal accent-4"
        @click="closePanel"
      >
        Close
      </v-btn>
    </v-card-actions>

    <v-card-text>
    
      <h6>Address:</h6>
      <h4>{{formatMeetings.locationName}}</h4>
      <h6>Accessible Location:</h6>
      <h4>{{formatMeetings.accessible ? 'Yes' : 'No'}}</h4>
    
      <h6 class="mt-6 mb-4">Meetings at this location:</h6>
      <v-card class="pa-2 elevation-0" v-for="(days, key) in formatMeetings.meetingDays" :key="key">
          <h3>{{days.day}}</h3>

          <template v-for="(meeting, i) in days.values">

            <v-card
              :key="i"
                class="mx-auto mb-2 elevation-0"
                max-width="344"
                outlined
              >
                <v-card-text>
                  <h6>Time:</h6>
                  <span>From {{meeting.startTime}} to {{meeting.endTime}}</span>
                  <template v-if="meeting.meeting_type != 'false'">
                    <h6>Meeting Type:</h6>
                    <span>{{meeting.meeting_type}}</span>
                  </template>
                  <template v-if="meeting.special_interest != 'false'">
                    <h6>Special Interest:</h6>
                    <span>{{meeting.special_interest}}</span>
                  </template>
                </v-card-text>
              </v-card>

          </template>
      
      </v-card>
  
    </v-card-text>

  </v-card>
</template>

<script>

import * as _ from "underscore";

export default {
  name: 'SidePanel',
  components: {

  },  
  props: ['selectedLocation'],
  computed: {
      dataIsReady: function() {
        return typeof this.selectedLocation === 'object' ? true : false;
      },
      formatMeetings: function() {
        let locationObject = {};


        locationObject['locationName'] = this.selectedLocation.address;
        locationObject['accessible'] = this.selectedLocation.accessible;
        
        let meetings = _.groupBy(this.selectedLocation.meetings, 'day');

        locationObject['meetingDays'] = [];

        _.map(meetings, (values, day) => {

          values = this.formatTimes(values);

          locationObject['meetingDays'].push({'day': day, 'values': values});

        });

        return locationObject;
      }

  },  
  data: () => ({
    closeSidePanel: false
  }),
  watch: {
    selectedLocation: {
      handler: function() {
        this.closeSidePanel = false;

      },
      deep: true
    }
  },
  mounted() {
    // close by default
    this.closeSidePanel = false;
  },

  methods: {
   closePanel (event) {
      this.closeSidePanel = true;
      this.$emit('closeSidePanel');
    },
    formatTimes: (data) => {
          function moveToBeginningOfArr(arr, fromIndex) {
            return [].concat(arr.splice(fromIndex, 1), arr);
        }


          data.map(v => {
              if(v.start_mins === 0) {
                v.start_mins = '00'
              }
              if(v.end_mins === 0) {
                v.end_mins = '00'
              }

              v['startTime'] = `${v.start_hour}:${v.start_mins} ${v.start_ampm}`;
              v['endTime'] = `${v.end_hour}:${v.end_mins} ${v.end_ampm}`;
            });


        // sort the time by hour and am_pm
          data = _.chain(data)
            .sortBy('start_hour')
            .sortBy('start_ampm')
            .value();

        // // 12 am and 12 pm are exceptions: split the array
        let am = _.filter(data, t => t['start_ampm'] == 'AM');
        let pm = _.filter(data, t => t['start_ampm'] == 'PM');
        // // put them at the right array position
          am = moveToBeginningOfArr(am, am.length-1);
          pm = moveToBeginningOfArr(pm, pm.length-1);
        // // put the arr of obj back together
          data = [].concat(am, pm);


          return data;
      }
  
  }

};
</script>
