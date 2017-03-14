angular.module('emissionByCountry').config(['$routeProvider', '$locationProvider', angularRouting]);

function angularRouting($routeProvider, $locationProvider) {

  //homepage
  $routeProvider.when('/', {
    templateUrl: 'views/index.pug',
    controller: 'MainController'
  });

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
}