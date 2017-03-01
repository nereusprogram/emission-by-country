angular.module('mainController', []).controller('MainController', function($scope, $http) {
  $scope.tagline = 'To the moon and back!';
  $http({
    method: 'GET',
    url: '/api/countrys'
  }).then(function onSuccess(res){
    console.log('http get request to /api/countrys successful');
    console.log('Server responded with: ');
    console.log(res);
  }, function onError(res){
    console.log('Error with http request to /api/countrys');
    console.log(res);
  });
});