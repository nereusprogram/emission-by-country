angular.module('emissionByCountry').config(['$routeProvider', '$locationProvider', angularRouting]);

function angularRouting($routeProvider, $locationProvider) {

  //homepage
  $routeProvider
    // TODO: japan controller
    .when('/Japan', {
      templateUrl: 'countries/japan.pug'
    })

    .when('/', {
      redirectTo: '/graph'
    })

    .when('/graph', {
      templateUrl: '/graph.pug'
    })
  ;

  $locationProvider.html5Mode(true);

}