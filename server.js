// modules =================================================
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mysql          = require('mysql');

// configuration ===========================================

// set our port
var port = process.env.PORT || 80;

// create connection to mySQL database
var pool = mysql.createPool({
  connectionLimit: 10,
  host : '52.39.193.109',
  user : 'angular_service_account',
  password: 'papaya',
  database: 'emission_by_country_schema'
});

// handle connecting to mySQL database, test queries
require('./config/db')(app, pool);

// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(bodyParser.json()); 

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override')); 

// set the static files location
/* express.static returns middleware that serves
 * filesystem path "__dirname + '/public'" when web path '/'
 * is requested
 * equivalent to app.use('/', function(req, res) {//get file from /public})
 */
app.use(express.static(__dirname + '/public'));

//set /public/views to app root dir
app.set('views', './public/views');

//set pug as view engine
app.set('view engine', 'pug');

// routes ==================================================
require('./app/routes')(app, pool); // configure our routes

// start app at http://localhost:3000
app.listen(port);               

console.log('Magic happens on port ' + port);

// expose app           
exports = module.exports = app;