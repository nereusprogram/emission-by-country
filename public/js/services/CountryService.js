angular
  .module('emissionByCountry')
  .factory('CountryService', ['$http', countryAPIReq]);

function countryAPIReq($http) {
  var CountryService = {

    //call to get all countries
    get : function() {
      var promise = $http({
        method: 'GET',
        url: '/api/countries'
      }).then(
        function onSuccess(res){

          // browser console output
          console.log('http get request to /api/countries successful');

          return res.data;

        }, function onError(res) {
          console.log('Error with http request to /api/countries');
          console.log(res);
        }
      );

      return promise;
    }
  };

  return CountryService;
}