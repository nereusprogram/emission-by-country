angular.module('mainController', []).controller('MainController', function($scope, $http) {
  var self = $scope;
  self.tagline = 'To the moon and back!';

  //get list of countries and emission data from database
  $http({
    method: 'GET',
    url: '/api/countrys'
  }).then(function onSuccess(res){

    //browser console output
    console.log('http get request to /api/countrys successful');
    console.log('Server responded with: ');
    console.log(res);

    //display test region once on UI
    self.firstQueryData = res.data[0].region; //region is a property of data[]

    //update dropdown list on UI
    self.regions = generateRegionList(res.data, self);



  }, function onError(res){
    console.log('Error with http request to /api/countrys');
    console.log(res);
  });

  function generateRegionList(data, self) {
    var regions = [];
    for(var i = 0; i < data.length; i++){
      regions[i] = data[i].region;
    }
    return regions;
  }

  function updateRegionList(regions, self) {
    self.regions = regions;
  }
});