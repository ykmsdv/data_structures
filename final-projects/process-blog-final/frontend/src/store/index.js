import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    data: Object,
  },
  mutations: {
    saveData(state, payload) {
      state.data = payload;
    },
  },
  actions: {
    fetchData({ commit, state }, payload) {
      return axios
        .get('data/data.json')
        .then( response => {
          commit('saveData', response.data);
        })
        .catch(function (error) {
          console.log(error);
        });   
    },
  },
  modules: {
  }
})
