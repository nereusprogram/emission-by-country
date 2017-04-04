angular
  .module('emissionByCountry')
  .controller('GraphController', ['$scope', 'CountriesByName', GraphController]);

function GraphController($scope, CountriesByName) {
  var self = this;

  self.tagline = 'graph has loaded';
  self.selectedCountry = 'unselected from controller';
  self.dbData = [];
  self.matchingDataFromDB = {};

  CountriesByName.get().then(function (res) {
    self.dbData = res;
  });

  self.updateSelectedCountry = function(newCountry){
    self.selectedCountry = newCountry;
    $scope.$apply();
    searchForCountryInDatabase();
  };

  function searchForCountryInDatabase() {
    for(var i = 0; i < self.dbData.length; i++){
      if(self.selectedCountry == self.dbData[i].name){
        self.matchingDataFromDB = self.dbData[i];
        $scope.$apply();
        console.log(self.matchingDataFromDB);
      }
    }
    if (self.matchingDataFromDB == undefined){
      console.log('Country Not Found in Database');
    }
  }
}