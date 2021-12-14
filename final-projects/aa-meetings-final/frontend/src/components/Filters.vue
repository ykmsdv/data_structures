<style lang="sass">
  .filters
    z-index: 1000
</style>

<template>
  <v-col cols="12" >

    <v-row class="filters mt-0">
      <Dropdown :data="days" label="" filterName="day" hintValue="Select Weekday"/>
      <Dropdown :data="meetingType" label="" filterName="meetingType" hintValue="Select Meeting type"/>
      <Dropdown :data="interestType" label="" filterName="interestType" hintValue="Special interest"/>
      <TimeDropdown :data="times" label="" nStartTime="startTimeOne" hintValue="Between start time" />
      <TimeDropdown :data="times" label="" nStartTime="startTimeTwo" hintValue="And start time"/>

      <v-checkbox v-model="accessibilityCheckbox" class="ml-4" style="margin-top: 5px"></v-checkbox>
      <v-icon class="mr-5" color="black darken-2" style="margin-top: -13px">
        mdi-wheelchair-accessibility
      </v-icon> 
                
      <v-btn color="blue-grey" class=" white--text" @click="fetchFilters">
        Filter
      </v-btn>

    </v-row>
  </v-col>

</template>

<script>
import { mapState, mapMutations } from 'vuex';
import Dropdown from './Dropdown';
import TimeDropdown from './TimeDropdown';

export default {
  name: 'Filters',

  components: {
    Dropdown,
    TimeDropdown,
  },

  data: function () {
    return {
      accessibilityCheckbox: false
    }
  },
  mounted() {
    
    this.$store.dispatch('fetchFilters');
  },
  computed: {
    ...mapState({
      days: state => state.source.filters.days,
      meetingType: state => state.source.filters.meetings,
      interestType: state => state.source.filters.special,
      times: state => state.source.filters.times,
      selectedFiltersStore: state => state.selectedFilter,
    }),
  },
  watch: {
    accessibilityCheckbox: function(checkbox) {
          this.setFilterValue({dropdownName: "accessibility", dropdownValue: checkbox});
    }
  },
  methods: {
    ...mapMutations(['setFilterValue']),
    fetchFilters: function() {
      this.$store.dispatch('getFilteredData');
    }    
  }

};
</script>
