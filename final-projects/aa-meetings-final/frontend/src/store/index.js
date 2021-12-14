import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    source: {
      defaultLocations: Object,
      filters: Object,
      filteredLocations: Object
    },
    selectedFilter: {
      day: String,
      startTimeOne: String,
      startTimeTwo: String,
      meetingType: String,
      interestType: String,
      accessibility: Boolean
    },
    selectedLocation: {
      location: String
    }
  },
  getters: {
  },
  mutations: {
    saveFilters(state, payload) {
      state.source.filters = payload.data
    },
    saveAllLocations(state, payload) {
      state.source.defaultLocations = payload.allLocations;
    },
    setFilterValue(state, payload) {
      state.selectedFilter[payload.dropdownName] = payload.dropdownValue;
    },
    saveFilteredLocations(state, payload) {
      state.source.filteredLocations = payload.filteredLocations;
    }
  },
  actions: {
    fetchFilters ({state, commit}) {
      return axios
        .get("http://localhost:8084/filters")
        .then(response => {
          
          commit('saveFilters', { data: response.data });

        });
    },
    getAllLocations ({state, commit}) {
      return axios
        .get("http://localhost:8084/alllocations")
        .then(response => {
          commit('saveAllLocations', { allLocations: response.data });
        });
    },

    getFilteredData({state, commit}) {
     
      let addParam = (filterName, paramName, params) => {
        if(typeof state.selectedFilter[filterName] != 'function' && state.selectedFilter[filterName] != "") {
          params[paramName] = state.selectedFilter[filterName];
        }
      }

      let params = {};

      addParam('day', 'day', params);
      addParam('startTimeOne', 'start_time_1', params);
      addParam('startTimeTwo', 'start_time_2', params);
      addParam('interestType', 'special_interest', params);
      addParam('meetingType', 'meeting_type', params);
      addParam('accessibility', 'wheelchair', params);

      console.log(params)

     return axios
        .get("http://localhost:8084/filteredlocations", {params})
        .then(response => {
          console.log('response is ', response)
          commit('saveFilteredLocations', { filteredLocations: response.data })
        });


    }
  },
  modules: {
  }
});
