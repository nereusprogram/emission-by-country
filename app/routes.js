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

  // request to get countries by name for populating highcharts map
  // send all emissions related data as well
  app.get('/api/countryNames', function (req, res) {
    console.log('server route for /api/countryNames called');
    var queryString = 'SELECT * FROM data_by_country_tbl;';
    apiReq.handleCountryRequest(pool, queryString, res, respondToRequest);
  });

  // FRONTEND ROUTES =========================================================

  /* since pug can only be rendered by the server (can't be done client-side)
   * this allows express to render frontend routes, as directed by
   * angularRoutes.js
   */
  app.get('/graph/graph.pug', function (req, res){
    res.render(path.join(__dirname, '../public', 'views', 'graph', 'graph.pug'));
  });

  // default route
  app.get('*', function(req, res){
    console.log('rendering default route');
    res.render('index', {root: path.join(__dirname, '../public')}); //load public/index.pug
  });

  /* '*' specifies all other routes
   * allows angular to handle routing
   */

};
