angular
  .module('emissionByCountry')
  .controller('GraphController', ['$scope', '$location', 'smoothScrollService', 'CountriesByName', GraphController]);

function GraphController($scope, $location, smoothScrollService, CountriesByName) {
  var self = this;

  // self.tagline = 'graph has loaded';
  self.selectedCountry = 'Select a country';
  self.dbData = [];
  // world average calculated from world population data from worldometers.info,
  // worldometers.info pulled data from UN 2015 report
  self.matchingDataFromDBWorld = [{name: 'World average per capita CO2 emission (Tons)', propertyValue: 12.2*100/39.7362666248}];
  self.matchingDataFromDB = [];
  self.matchingDataFromDBForD3 = [];
  self.maxValueForEachProperty = [
    {"propertyName":"name","propertyValue": "Qatar"},
    {"propertyName":"perCapitaCO2Emission","propertyValue":39.7362666248},
    {"propertyName":"longTermCO2Emssion","propertyValue":2920405.8287741},
    {"propertyName":"carbonEmission","propertyValue":795750.907022915},
    {"propertyName":"atmosphericSurfaceWarming","propertyValue":4.3806087432},
    {"propertyName":"seaSurfaceWarming","propertyValue":3.0883291639},
    {"propertyName":"seaSurfaceDeoxygenation","propertyValue":-12.81328057},
    {"propertyName":"seaSurfacePH","propertyValue":-0.3942547869},
    {"propertyName":"decreaseMaxCatchPotential","propertyValue":-14894069.73},
    {"propertyName":"speciesTurnover","propertyValue":25.43261495},
    {"propertyName":"decreaseInBodySize","propertyValue":-31.86972656}
  ];


  CountriesByName.get().then(function (res) {
    self.dbData = res;
  });

  // deals with jiggling from table size changing as countUp happens
  self.fixedWidthOfTable = ($('#impactsHeader').width());

  self.updateSelectedCountry = function(newCountry){

    self.selectedCountry = newCountry;
    $scope.$apply();
    searchForCountryInDatabase();

    smoothScrollService.scrollTo('selectedCountryInfo');

    $('#impactsTable').fadeIn();
    $('#CO2BubbleVis').fadeOut(400, clearAndFadeBackIn);
    function clearAndFadeBackIn() {
      $('#CO2BubbleVis').empty();
      $('#CO2BubbleVis').fadeIn();
      CO2BubbleChart('#CO2BubbleVis');
    }
    $('.fixed-width').width(self.fixedWidthOfTable);

  };

  // not used
  self.d3OnClick = function(item){
    console.log('d3OnClick Triggered');
  };

  function searchForCountryInDatabase() {
    for(var i = 0; i < self.dbData.length; i++){
      if(self.selectedCountry === self.dbData[i].name){

        var propertyNames = Object.keys(self.dbData[i]);
        self.matchingDataFromDB = [];
        self.matchingDataFromDBForD3 = [];
        var units = ['', ' in Metric Tons', ' in MegaTons', ' in MegaTons',
          ' in °C', ' in °C', ' in mmol/metres cubes', '', ' in Metric Tons', ' in %', ' in %'];
        // a = 1 avoids name of country being stored in the selected country object being
        // passed to the d3Directive
        for(var a = 1; a < propertyNames.length; a++) {

          self.matchingDataFromDB.push({
            propertyName: propertyNames[a],
            displayPropertyName: camelCaseToNormal(propertyNames[a]),
            actualValue: self.dbData[i][propertyNames[a]],
            displayActualValue: self.dbData[i][propertyNames[a]].toString(),
            displayElementID: 'impactsNum'.concat((a-1).toString()),

            // if propertyValue is negative, return the positive scaled version of the value
            propertyValue: (self.dbData[i][propertyNames[a]] * 100 / self.maxValueForEachProperty[a].propertyValue),
            propertyUnits: units[a]
          });

        }

        for(var b = 0; b < self.matchingDataFromDB.length; b++) {
          // indecies of the 3 data points I want to graph
          if(b === 0 || b === 8 || b === 9){
            self.matchingDataFromDBForD3.push({
              propertyName: self.matchingDataFromDB[b].propertyName,
              // if propertyValue is negative, return the positive scaled version of the value
              propertyValue: self.matchingDataFromDB[b].propertyValue
            });
          }
        }


      }
    }

    $scope.$apply();
    
    // in this case, it calls impactsCount()
    impactsCount();

  } // searchForCountryInDatabase
  
  function impactsCount() {
    var options = {
      useEasing : true,
      useGrouping : false,
      separator : ',',
      decimal : '.'
    };

    for(var c = 0; c < self.matchingDataFromDB.length; c++) {
      var startValue =0;
      var countToValue = parseFloat(self.matchingDataFromDB[c].displayActualValue.slice(0,7));
      var numAnimate = new CountUp("impactsNum".concat(c.toString()), 
        startValue.toFixed(decimalPlaces(countToValue)), countToValue, 
        decimalPlaces(countToValue), 1.5, options);
      numAnimate.start();
    }

  }

  function decimalPlaces(value) {
    if(Math.floor(value) === value) return 0;
    return value.toString().split(".")[1].length || 0;
  }

  function camelCaseToNormal (str){
    return str
      // insert a space between lower & upper
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // space before last upper in a sequence followed by lower
      .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
      // uppercase the first character
      .replace(/^./, function(str){ return str.toUpperCase(); })
      //space after number 2 in CO2
      .split('2').join('2 ')
  }

  function CO2BubbleChart(chartElementID) {
    var myBubbleChart = renderBubbleChart();

    d3.csv('data/gates_money.csv', display);

    function display(error, data) {
      if (error) {
        console.log(error);
      }
      myBubbleChart(chartElementID, data);
    }

    function renderBubbleChart() {

      var height = ($(chartElementID).height() > 500) ? $(chartElementID).height() : 500;
      var width = ($(chartElementID).width() > 200) ? $(chartElementID).width() : self.fixedWidthOfTable;
      var center = { x: width/2, y: height / 2 };

      var damper = 0.102;
      var svg = null;
      var bubbles = null;
      var nodes = [];
      var force = d3.layout.force()
        .size([width, height])
        .charge(charge)
        .gravity(-0.01)
        .friction(0.9);
      var radiusScale = d3.scale.pow()
        .exponent(0.5)
        .range([2, 85]);

      var chart = function chart(selector, rawData) {
        // max divided by 5 to make bubble look biger on screen
        radiusScale.domain([0, self.maxValueForEachProperty[1].propertyValue/5]);
        nodes = createNodes(rawData);
        force.nodes(nodes);
        svg = d3.select(selector)
          .append('svg')
          .attr('width', width)
          .attr('height', height);
        bubbles = svg.selectAll('.bubble')
          .data(nodes, function (d) { return d.id; });
        bubbles.enter().append('circle')
          .classed('bubble', true)
          .attr('r', 0)
          .attr('fill', '#00CE3D')
          .attr('stroke', '#00A132')
          .attr('stroke-width', 2);
        bubbles.transition()
          .duration(2000)
          .attr('r', function (d) { return d.radius; });
        groupBubbles();
      };


      function groupBubbles() {

        force.on('tick', function (e) {
          bubbles.each(moveToCenter(e.alpha))
            .attr('cx', function (d) { return d.x; })
            .attr('cy', function (d) { return d.y; });
        });

        force.start();
      }

      function moveToCenter(alpha) {
        return function (d) {
          d.x = d.x + (center.x - d.x) * damper * alpha;
          d.y = d.y + (center.y - d.y) * damper * alpha;
        };
      }

      function charge(d) {
        return -Math.pow(d.radius, 2.0) / 8;
      }

      function createNodes(rawData) {
        var myNodes = rawData.map(function (d) {
          return {
            id: d.id,
            radius: radiusScale(+self.matchingDataFromDB[0].actualValue),
            // the actualValue of CO2 emission per capita
            value: self.matchingDataFromDB[0].actualValue,
            name: d.grant_title,
            org: d.organization,
            x: Math.random() * 900,
            y: Math.random() * 800
          };
        });

        return myNodes;
      }

      return chart;

    }

  }
}
