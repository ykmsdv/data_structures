<template>
  <v-col cols="12" xs="2" sm="2" md="2" lg="2" xl="3" class="ma-0 pa-0 mr-2">
      <v-combobox
        v-model="selectedValue"
        :items="data"
        :label="label"
        dense
        :hint="hintValue"
        persistent-hint        
      ></v-combobox>
  
  </v-col>
</template>

<script>
import { mapMutations } from 'vuex';

  export default {
    name: 'Dropdown',

    data: function() {
      return {
        selectedValue: '',
      }
    },
    
    props: ['data', 'label', 'filterName', 'hintValue'],

    watch: {
      selectedValue: function(selectedValue) {
           this.setFilterValue({dropdownName: this.filterName, dropdownValue: selectedValue});
        }
    },
    methods: {
      ...mapMutations(['setFilterValue'])
    }
  }
</script>
