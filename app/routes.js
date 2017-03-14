// include my handle api request function
var apiReq = require('./apiReq');
var path = require('path');

module.exports = function(app, pool){

  // API ROUTES =====================================================

  // helper function that returns data from API request
  // callback to execute after query to database has finished
  var respondToRequest = function (queryResults, res) {
    res.send(queryResults);
    console.log('Response to http request has been sent from routes');
  };

  // receive http req to get country data, respond by fetching data
  // from mySQL server
  app.get('/api/countries', function (req, res){
    console.log('backend route for /api/countries has been called');

    // construct mySQL query
    var queryString = 'SELECT * FROM emission_by_country_tbl';

    // query database for matching country
    apiReq.handleCountryRequest(pool, queryString, res, respondToRequest);

  });

  // CRUD routes here
  // handle creating (app.post)
  // handle delete (app.delete)

  // frontend routes
  // route to handle all angular requests
  app.get('*', function(req, res){
    console.log('rendering default route');
    res.render('index', {root: path.join(__dirname, '../public'),
      pageTitle: ' Emission By Country: Home'}); //load public/index.pug
  });
  /* '*' specifies all other routes
   * allows angular to handle routing
   */

};
