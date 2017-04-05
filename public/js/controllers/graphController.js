angular
  .module('emissionByCountry')
  .controller('GraphController', ['$scope', 'CountriesByName', GraphController]);

function GraphController($scope, CountriesByName) {
  var self = this;

  self.tagline = 'graph has loaded';
  self.selectedCountry = 'unselected from controller';
  self.dbData = [];
  self.matchingDataFromDB = [{name: 'World Average', emissions: 1500}];


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
        self.matchingDataFromDB[0] = self.dbData[i];
        console.log(self.matchingDataFromDB);
      }
    }
    $scope.$apply();
    if (angular.equals(self.matchingDataFromDB, {})){
      console.log('Country Not Found in Database');
    }
  } // searchForCountryInDatabase

  self.d3OnClick = function(item){
    console.log('d3OnClick Triggered');
    // TODO-chantelle: replace with bubble functionality
  };
}