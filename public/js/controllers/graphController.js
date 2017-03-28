angular
  .module('emissionByCountry')
  .controller('GraphController', ['$scope', GraphController]);

function GraphController($scope) {
  var self = this;

  self.tagline = 'graph has loaded';
  self.selectedCountry = 'unselected from controller';

  self.updateSelectedCountry = function(newCountry){
    self.selectedCountry = newCountry;
    console.log('selectedCountry (from controller): ' + self.selectedCountry);
    $scope.$apply();
  };
}