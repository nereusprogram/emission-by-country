// include my handle api request function
var apiReq = require('./apiReq');

module.exports = function(app, pool){

  // recieve http req to get country data, respond by fetching data
  // from mySQL server
  app.get('/api/countrys', function (req, res){
    console.log('backend route for /api/countrys has been called');

    // TODO: make it so that the user selects the region and that
    //       region gets passed in from http request from angular
    var region = 'Asia';

    // construct mySQL query
    var queryString = 'SELECT * FROM emission_by_country_table WHERE region = "'.concat(region).concat('"');

    // callback to execute after query to database has finished
    var respondToRequest = function (queryResults) {
      res.send(queryResults);
      console.log('Response to http request has been sent from routes');
    };

    // query database for matching country
    apiReq.handleCountryRequest(pool, queryString, respondToRequest);

  });

  // CRUD routes here
  // handle creating (app.post)
  // handle delete (app.delete)

  // frontend routes
  // route to handle all angular requests
  app.get('*', function(req, res){
    console.log('rendering default route');
    res.render('index', {pageTitle: ' Emission By Country: Home'}); //load public/index.pug
  });
  /* '*' specifies all other routes
   * allows angular to handle routing
   */

};
