angular
  .module('emissionByCountry')
  .controller('GraphController', GraphController);

function GraphController(highChartService) {
  var self = this;

  self.tagline = 'graph has loaded';

  //TODO-chantelle: make the UI watch for changes and update when the service updates selectedCountry
  highChartService.getSelectedCountry(self);

}