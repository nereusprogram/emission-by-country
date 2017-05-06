angular.module('emissionByCountry').factory('CountriesByName', ['$http', CountriesByName]);

function CountriesByName($http) {
  return {
    get: function () {
      var apiUrl = '/api/countryNames';
      var promise = $http({
        method: 'GET',
        url: apiUrl
      }).then(function onSuccess(res){

        return res.data;

      }, function onError(res){
        console.log('Error with http request to ' + apiUrl);
        console.log(res);
      });

      return promise;
    }
  };
}