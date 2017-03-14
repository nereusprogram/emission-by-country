angular.module('emissionByCountry').config(['$routeProvider', '$locationProvider', angularRouting]);

function angularRouting($routeProvider, $locationProvider) {

  //homepage
  $routeProvider
    .when('/', {
      templateUrl: 'countries/default.pug',
      controller: 'MainController'
    })

    // TODO: japan controller
    .when('/Japan', {
      templateUrl: 'countries/japan.pug',
      controller: 'MainController'
    })
  ;

  $locationProvider.html5Mode(true);

}