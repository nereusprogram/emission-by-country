angular.module('angularRoutes', []).config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {

  //homepage
  $routeProvider.when('/', {
      templateUrl: 'views/index.pug',
      controller: 'MainController'
  });

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });

}]);
