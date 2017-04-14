angular
  .module('emissionByCountry')
  .controller('MainController', MainController);

function MainController (CountriesByName) {
  var self = this;
  self.countryNames = [];
  self.testtest = [{'name': 'Canada'}];

  CountriesByName.get().then(function (res) {
    self.dbData = res;

    for(var i = 0; i < self.dbData.length; i++){
      self.countryNames.push({'name': self.dbData[i].name});
    }
  });
}
