/*TODO: really understand how the callback is structured here,
 * this is not standard according to documentation.
 */
angular.module('CountryService', []).factory('Country', ['$http', function($http) {
  return {
    // call to get all countrys
    get : function() {
      return $http.get('/api/countrys');
    },

    // these will work when more API routes are defined on the Node side of things
    // call to POST and create a new country
    create : function(countryData) {
      return $http.post('/api/countrys', countryData);
    },

    // call to DELETE a country
    delete : function(id) {
      return $http.delete('/api/countrys/' + id);
    }
  }

}]);
