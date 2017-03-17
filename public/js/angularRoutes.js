angular.module('emissionByCountry').config(['$routeProvider', '$locationProvider', angularRouting]);

function angularRouting($routeProvider, $locationProvider) {

  //homepage
  $routeProvider
    .when('/', {
      templateUrl: '/graph/graph.pug'
    })
  ;

  $locationProvider.html5Mode(true);

}