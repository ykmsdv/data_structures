<style lang="sass">
  .svg-container 
      display: inline-block
      position: relative
      width: 100%
      padding-bottom: 0%
      vertical-align: top
      overflow: hidden

  g.axis text
    font-size: 11pt !important
    fill: #999
  
  h2
    font-size: 21pt !important
    font-weight: 500
    letter-spacing: 0.1666666667em !important
    line-height: 2rem
    text-transform: uppercase
    font-family: "Roboto", sans-serif !important
</style>

<template>
<div v-if="dataIsReady">
      <template v-for="(datapoints, weekN) in formattedData">
        <v-row :key="weekN" justify="center" class="mb-5 ml-1">           
            <v-col cols="4" class="ma-0 pa-0 mb-8" v-for="(day, i) in datapoints.values" :key="day.date">
              <h2 v-if="weekN == 0" class="text-center mb-7 mt-12"> {{ datapoints.values[i].weekDay.toUpperCase() }}S </h2>
              <h4 class="text-center mb-0 overline">{{day.date}}</h4>
              <div :id="'week_'+datapoints.nWeek+'_'+day.weekDay" class="svg-container"></div>
            </v-col>
        </v-row>
      </template>
      
      <div id="viz" class="svg-container"></div>
</div>  


</template>

<script>
import { mapState } from 'vuex';
import * as d3 from 'd3';
import * as _ from 'underscore';

  export default {
    name: 'Radar',

    computed: {
     ...mapState(['data']),
      dataIsReady: function() {
        return typeof this.data != 'function' && this.data.length ? true : false;
      },
      formattedData: function() {
        if (!this.dataIsReady) return;
        return this.formatData(this.data)
      }
    },
    filters: {
      addCommaToDate: function(str) {
        return str.split(' 2021').join(',');
      },        
    },
    updated() {
      this.render();
    },
    mounted() {
      if (!this.dataIsReady) return;
      this.render();
    },
    methods: {
      render: function() {
        
        let normalize = (val, variable) => { 
          let min = 0;
          let max = _.chain(this.formattedData).map(d => d.values).flatten().pluck(variable).max().value();

          // console.log('normalizing ', variable, ' max is ', max, 'normal is ',  (val - min) / (max - min), ' for val ', val)
          
          return ( (val - min) / (max - min) );
        }        
 
        
        this.formattedData.forEach((d,i) => {

          d.values.forEach(day => {
            let vizId = `#week_${d.nWeek}_${day.weekDay}`;

            let thisData = [{
              cc: day.weekDay.toLowerCase(),
              axes: [
                {axis: `Sleep: ${day.sleep}h`, value: normalize(day.sleep, 'sleep')},
                {axis: `Energy: ${day.energy}`, value: normalize(day.energy, 'energy')},
                {axis: `Steps: ${day.steps}`, value: normalize(day.steps, 'steps')}
                ]
            }]
            
            this.radarChart(thisData, vizId);

          });

        });
      },

      radarChart: function(thisData, id) {
        const cc = d3.scaleOrdinal()
                  .domain(['monday', 'tuesday', 'wednesday'])
                  .range(['#97C6C6', '#D8B14C', '#F88FDA']);
        let chart = RadarChart.chart();
        let cfg = chart.config();
            chart.config({
              w: cfg.w / 2, 
              h: cfg.h / 2, 
              axisText: true, 
              levels: 3, 
              maxValue: 1,
              circles: true, 
              color: function(d) {
                return cc(thisData[0].cc)
              }
            });
            cfg = chart.config();

        const margin = {top: 0, right: 10, bottom: 10, left: 103},
            width = 500 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        const svgW = width + margin.left + margin.right;
        const svgH = height + margin.top + margin.bottom;

        const svg = d3.select(id)
                .append("svg")
                .attr("preserveAspectRatio", "xMinYMin meet")
               .attr("viewBox", `0 0 ${svgW} ${svgH}`)
                .classed("svg-content", true)
                .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");

            svg.append('g')
              .classed('single', 1)
              .datum(thisData)
              .call(chart);

      },

      formatData: function(data) {
        
        let dataset = [];
        
        data.forEach(d => {
          let radarData = {};
          let thisDate = new Date(d.date.S).getDay();
          let daysOfWeek = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

              radarData['weekDay'] = daysOfWeek[thisDate];
              radarData['date'] = d.date.S;
              radarData['energy'] = +d.energy_level.N;
              radarData['sleep'] = +d.sleep.S.replace(':', '.');
              radarData['steps'] = +d.steps.N;
              radarData['temp'] = d.temperature.NS;
              radarData['week'] = `${d.week.S.split('w')[1]}`; 

            dataset.push(radarData);
        });

        dataset = _.chain(dataset)
                  .groupBy('week')
                  .map((value, key) => {
                    
                    let weekValues = _.sortBy(value, d => { return new Date(d.date) });

                    return { nWeek: parseInt(key), values: weekValues}
                  })
                  .sortBy('nWeek')
                  .value();


        return dataset;
      },
    
    },


  }
</script>