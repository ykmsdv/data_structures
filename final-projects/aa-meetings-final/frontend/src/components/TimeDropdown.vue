<template>
  <v-col cols="12" xs="3" sm="1" md="1" lg="1" xl="1" class="ma-0 pa-0 mr-2">
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
    name: 'TimeDropdown',

    data: function() {
      return {
        selectedValue: '',
      }
    },
    props: ['data', 'label', 'nStartTime', 'hintValue'],

    watch: {
      selectedValue: function(selectedValue) {
           this.setFilterValue({dropdownName: this.nStartTime, dropdownValue: selectedValue});
        }
    },
    methods: {
      ...mapMutations(['setFilterValue'])
    }
  }

</script>

