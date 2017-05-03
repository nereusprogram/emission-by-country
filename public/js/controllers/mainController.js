angular
  .module('emissionByCountry')
  .controller('MainController', ['CountriesByName', 'smoothScrollService', MainController]);

function MainController (CountriesByName, smoothScrollService) {
  var self = this;
  self.countryNames = [];
  self.testtest = [{'name': 'Canada'}];

  CountriesByName.get().then(function (res) {
    self.dbData = res;

    for(var i = 0; i < self.dbData.length; i++){
      self.countryNames.push({'name': self.dbData[i].name});
    }
  });

  $(window).scroll(function() {
    if ($(this).scrollTop()) {
      $('#toTop').fadeIn();
    } else {
      $('#toTop').fadeOut();
    }
  });

  self.backToTop = function(){
    smoothScrollService.scrollTo('top');
  };
}
