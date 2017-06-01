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
  self.countryDataForHighmaps = [];
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
    for(var i = 0; i < self.dbData.length; i++){
      self.countryDataForHighmaps.push({name:self.dbData[i].name, value:self.dbData[i].perCapitaCO2Emission});
    }
    populateHighcharts(self.countryDataForHighmaps, self.updateSelectedCountry);
  });

  // deals with jiggling from table size changing as countUp happens
  self.fixedWidthOfTable = ($('#impactsHeader').width());

  $('#backToAll').fadeIn();

  self.updateSelectedCountry = function(newCountry, triggeredFromHighmaps){

    $('#selectedCountryName').fadeOut(200, function () {
      self.selectedCountryDisplay = newCountry;
      $scope.$apply();
      $('#selectedCountryName').fadeIn();
    });


    self.selectedCountry = newCountry;

    if(triggeredFromHighmaps){
      $scope.$apply();
    }
    searchForCountryInDatabase(triggeredFromHighmaps);
    smoothScrollService.scrollTo('selectedCountryInfo');

    $('.impacts-table').fadeIn();
    $('.fixed-width').width(self.fixedWidthOfTable);

    $('table').fadeOut(200, function () {
      $('table').fadeIn();
    });

  };

  function searchForCountryInDatabase(triggeredFromHighmaps) {
    for(var i = 0; i < self.dbData.length; i++){
      if(self.selectedCountry === self.dbData[i].name){

        var propertyNames = Object.keys(self.dbData[i]);
        self.matchingDataFromDB = [];
        self.matchingDataFromDBForD3 = [];
        var displayPropertyNames = [
          '', // 0 ==> name
          '', // 1 ==> short term CO2, not displayed
          'Global Cumulative CO₂ Emission in 10 Years in Megatons',  // 2 ==> long term CO2, displayed
          '', // 3 ==> not displayed
          '', // 4 ==> not displayed
          'Sea Surface Warming in °C', // 5 ==> sea surface warming, displayed
          'Sea Surface Deoxygenation in mmol/metres³', // 6 ==> sea surface deoxygenation, displayed
          'Change in Sea Surface pH', // 7 ==> change in sea surface pH, displayed
          'Decrease in Max Catch Potential in Metric Tons', // 8 ==> decreae in max catch potential, displayed
          'Change in Species Turnover in %', // 9 ==> species turnover, displayed
          'Decrease in Fish Body Size in %' // 9 ==> decreaseInBodySize, displayed
        ];
        // a = 1 avoids name of country being stored in the selected country object being
        // passed to the d3Directive

        for(var a = 1; a < propertyNames.length; a++) {

          self.matchingDataFromDB.push({
            propertyName: propertyNames[a],
            displayPropertyName: displayPropertyNames[a],
            actualValue: self.dbData[i][propertyNames[a]],
            //todo-chantelle: turns out I can just do sig figs with .toPrecision(), so displayAcutalValue isn't needed
            displayActualValue: self.dbData[i][propertyNames[a]].toString(),
            displayElementID: 'impactsNum'.concat((a-1).toString()),

            // if propertyValue is negative, return the positive scaled version of the value
            propertyValue: (self.dbData[i][propertyNames[a]] * 100 / self.maxValueForEachProperty[a].propertyValue),
          });

        }

        // format data for D3 draw circle graph
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

    if(triggeredFromHighmaps){
      $scope.$apply();
    }

    updatePanels(triggeredFromHighmaps);

  } // searchForCountryInDatabase

  function updatePanels(triggeredFromHighmaps) {
    // takes end value to count to, takes id of DOM element
    impactCount(parseFloat(self.matchingDataFromDB[1].actualValue.toPrecision(3)), "longTermCO2ImpactNum");
    impactCount(parseFloat(self.matchingDataFromDB[6].actualValue.toPrecision(3)), "acidImpactNum");
    impactCount(parseFloat(self.matchingDataFromDB[8].actualValue.toPrecision(3)), "turnoverImpactNum");
    impactCount(parseFloat(self.matchingDataFromDB[4].actualValue.toPrecision(3)), "warmingImpactNum");
    impactCount(parseFloat(self.matchingDataFromDB[5].actualValue.toPrecision(3)), "oxyImpactNum");
    impactCount(parseFloat(self.matchingDataFromDB[7].actualValue.toPrecision(3)), "potentialImpactNum");
    impactCount(parseFloat(self.matchingDataFromDB[9].actualValue.toPrecision(3)), "bodyImpactNum");

    self.acidInclude = decideGraphic(self.matchingDataFromDB[6].actualValue,
      self.maxValueForEachProperty[7].propertyValue, 'acid');
    self.turnoverInclude = decideGraphic(self.matchingDataFromDB[8].actualValue,
      self.maxValueForEachProperty[9].propertyValue, 'turnover');
    self.warmingInclude = decideGraphic(self.matchingDataFromDB[4].actualValue,
      self.maxValueForEachProperty[5].propertyValue, 'temp');
    self.oxyInclude = decideGraphic(self.matchingDataFromDB[5].actualValue,
      self.maxValueForEachProperty[6].propertyValue, 'oxy');
    self.potentialInclude = decideGraphic(self.matchingDataFromDB[7].actualValue,
      self.maxValueForEachProperty[8].propertyValue, 'potential');
    self.bodyInclude = decideGraphic(self.matchingDataFromDB[9].actualValue,
      self.maxValueForEachProperty[10].propertyValue, 'body');
    
    self.CO2BubbleSize = decideCO2BubbleSize(self.matchingDataFromDB[1].actualValue, self.maxValueForEachProperty[2].propertyValue);

    if(triggeredFromHighmaps){
      $scope.$apply();
    }

  }
  
  function decideCO2BubbleSize(value, maxValue) {
      var percentSize = (value/maxValue*100)+30;
      if (percentSize > 100){
          percentSize = 100;
      }
      return percentSize.toString().concat('%');
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

  function populateHighcharts(dataFromDB, mapClick) {
        var chart = Highcharts.mapChart('highmapsContainer', {
            chart: {
              height: '40%'
            },
            title: {
                text: null
            },

            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },

            colorAxis: {
                type: 'linear',
                stops: [
                    [0, '#00A132'],
                    [1, '#ff2f03']
                ],
                min: 0,
                max: 12
            },

            // must be declared before series for click event to fire
            plotOptions:{
                series:{
                    point:{
                        events:{
                            click: function () {
                                // true denotes that it has been triggered from highmaps (needs manual scope update)
                                mapClick(this.name, true);
                            }
                        }
                    }
                }
            },

            tooltip: {
                formatter: function () {
                    return this.series.name + '<br><b>'
                         + this.point.name + ':' + '</b><br><b>'
                         + this.point.value.toFixed(2)+ '</b>';
                }
            },

            series: [{
                data: dataFromDB,
                mapData: Highcharts.maps['custom/world'],
                nullColor: '#a1a19d',
                name: '<div>Per capita CO₂ emission (metric tons per person per year)</div>',
                joinBy: 'name',
                states: {
                    hover: {
                        color: '#fff88a'
                    }
                }
            }],

            credits: {
                position: {
                    align: 'center'
                },
                text: 'Data for shaded countries not available.',
                href: null

            },

            legend: {
              title: {
                text: 'Per capita CO2 emission <br>(metric tons per person per year)'
              }
            }
        });
        setTimeout(chart.reflow(), 100);
    }

}
