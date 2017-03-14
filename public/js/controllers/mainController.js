angular
  .module('emissionByCountry')
  .controller('MainController', MainController);

function MainController (CountryService) {
  var self = this;
  self.tagline = 'To the moon and back!';

  //get list of countries and emission data from database
  CountryService.get().then(function (data) {

    //display test country once on UI
    self.firstQueryData = data[0].country; //region is a property of data[]

    //update dropdown list on UI
    self.countries = generateCountryList(data);
  });

  function generateCountryList(data) {
    var countries = [];
    for (var i = 0; i < data.length; i++) {
      countries[i] = data[i].country;
    }
    return countries;
  }
}