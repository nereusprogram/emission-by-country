angular
  .module('emissionByCountry')
  .controller('GraphController', ['$scope', '$location', 'smoothScrollService', 'CountriesByName', GraphController]);

function GraphController($scope, $location, smoothScrollService, CountriesByName) {
  var self = this;

  // self.tagline = 'graph has loaded';
  self.selectedCountry = 'unselected';
  self.selectedCountryDisplay = '?';
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

    $('#selectedCountryName').fadeOut(200, function () {
      self.selectedCountryDisplay = newCountry;
      $scope.$apply();
      $('#selectedCountryName').fadeIn();
    });


    self.selectedCountry = newCountry;

    $scope.$apply();
    searchForCountryInDatabase();
    smoothScrollService.scrollTo('selectedCountryInfo');

    $('#impactsTable').fadeIn();
    $('#CO2BubbleVis').fadeOut(400, function () {
      $('#CO2BubbleVis').empty();
      $('#CO2BubbleVis').fadeIn();
      CO2BubbleChart('#CO2BubbleVis');
    });
    $('.fixed-width').width(self.fixedWidthOfTable);

    $('table').fadeOut(200, function () {
      $('table').fadeIn();
    });

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

    updatePanels();

  } // searchForCountryInDatabase

  function updatePanels() {
    // takes end value to count to, takes id of DOM element
    impactCount(parseFloat(self.matchingDataFromDB[0].displayActualValue.slice(0,7)), "CO2ImpactNum");
    impactCount(parseFloat(self.matchingDataFromDB[6].displayActualValue.slice(0,7)), "acidImpactNum");
    impactCount(parseFloat(self.matchingDataFromDB[8].displayActualValue.slice(0,7)), "turnoverImpactNum");
    impactCount(parseFloat(self.matchingDataFromDB[4].displayActualValue.slice(0,7)), "warmingImpactNum");
    impactCount(parseFloat(self.matchingDataFromDB[5].displayActualValue.slice(0,7)), "oxyImpactNum");
    impactCount(parseFloat(self.matchingDataFromDB[7].displayActualValue.slice(0,7)), "potentialImpactNum");

    self.acidInclude = decideGraphic(self.matchingDataFromDB[6].displayActualValue,
      self.maxValueForEachProperty[7].propertyValue, 'acid');
    self.turnoverInclude = decideGraphic(self.matchingDataFromDB[8].displayActualValue,
      self.maxValueForEachProperty[9].propertyValue, 'turnover');
    self.warmingInclude = decideGraphic(self.matchingDataFromDB[4].displayActualValue,
      self.maxValueForEachProperty[5].propertyValue, 'temp');
    self.oxyInclude = decideGraphic(self.matchingDataFromDB[5].displayActualValue,
      self.maxValueForEachProperty[6].propertyValue, 'oxy');
    self.potentialInclude = decideGraphic(self.matchingDataFromDB[7].displayActualValue,
      self.maxValueForEachProperty[8].propertyValue, 'potential');


  }

  function decideGraphic(value, maxValue, panelPrefix) {
    var percentOfMax = value/maxValue*100;
    var graphicState = 5; // assume best case
    var relevantFileName = '';

    if (percentOfMax <= 20) {
      graphicState = 5;
    }else if (percentOfMax <= 40){
      graphicState = 4;
    }else if (percentOfMax <= 60){
      graphicState = 3;
    }else if(percentOfMax <=80){
      graphicState = 2;
    }else{
      graphicState = 1;
    }

    relevantFileName = 'data/'.concat(panelPrefix.concat(graphicState.toString().concat('.png')));

    return relevantFileName;
  }

  function impactCount(endVal, eID){
    var options = {
      useEasing : true,
      useGrouping : false,
      separator : ',',
      decimal : '.'
    };

    var startValue = 0;
    var endValue = endVal;
    var numAnimate = new CountUp(eID, startValue.toFixed(decimalPlaces(endValue)), endValue, decimalPlaces(endValue), 1.5, options);
    numAnimate.start();
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

      var height = ($(chartElementID).height() < 500) ? $('#visContainer').width() : 500;
      var width = ($(chartElementID).width() < 500) ? $('#visContainer').width() : 500;
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
        // max divided by 2 to make bubble look biger on screen
        radiusScale.domain([0, self.maxValueForEachProperty[1].propertyValue/1.5]);
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
