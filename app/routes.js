//grab country model

var Country = require('./models/country');

module.exports = function(app){
  //server routes go here (api calls, auth routes)

  //sample api route
  app.get('/api/countrys', function (req, res) {

    //mongoose gets all countrys in db
    Country.find(function (err, countrys) {

      //error handling
      if (err) {
        res.send(err);
      }

      //return all countrys as JSON
      res.json(countrys);
    });
  });

  //CRUD routes here
  //handle creating (app.post)
  //handle delete (app.delete)

  //frontend routes
  //route to handle all angular requests

  app.get('*', function(req, res){
    res.render('index', {pageTitle: ' Emission By Country: Home'}); //load public/index.pug
  });

  /* '*' specifies all other routes
   * allows angular to handle routing
   */

};
