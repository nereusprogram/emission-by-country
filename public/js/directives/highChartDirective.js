angular.module('emissionByCountry').directive('highChartDirective', highChartDirective);

function highChartDirective(highChartService) {
  return {
    restrict: 'E',
    template: '<div></div>',
    scope: {
      options: '='
    },
    link: function (scope, element) {
      Highcharts.mapChart(element[0], highChartService.getMapOptions());
    }
  }
}