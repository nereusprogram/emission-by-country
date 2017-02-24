module.exports = function(app){
  //server routes go here (api calls, auth routes)


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
