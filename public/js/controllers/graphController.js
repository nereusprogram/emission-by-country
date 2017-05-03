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

  self.updateSelectedCountry = function(newCountry){
    self.selectedCountry = newCountry;
    $scope.$apply();
    searchForCountryInDatabase();

    $location.hash('selectedCountryInfo');
    smoothScrollService.scrollTo('selectedCountryInfo');
  };

  self.d3OnClick = function(item){
    console.log('d3OnClick Triggered');
    // TODO-chantelle: replace with bubble functionality
  };

  function searchForCountryInDatabase() {
    for(var i = 0; i < self.dbData.length; i++){
      if(self.selectedCountry === self.dbData[i].name){

        var propertyNames = Object.keys(self.dbData[i]);
        self.matchingDataFromDB = [];
        self.matchingDataFromDBForD3 = [];

        // a = 1 avoids name of country being stored in the selected country object being
        // passed to the d3Directive
        for(var a = 1; a < propertyNames.length; a++) {

          self.matchingDataFromDB.push({
            propertyName: propertyNames[a],
            displayPropertyName: camelCaseToNormal(propertyNames[a]),
            actualValue: self.dbData[i][propertyNames[a]],
            displayActualValue: self.dbData[i][propertyNames[a]].toString(),

            // if propertyValue is negative, return the positive scaled version of the value
            propertyValue: (self.dbData[i][propertyNames[a]] * 100 / self.maxValueForEachProperty[a].propertyValue)
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
          console.log('data for D3: ' + self.matchingDataFromDBForD3);
        }


      }
    }

    $scope.$apply();

  } // searchForCountryInDatabase

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
}