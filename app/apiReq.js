// handles querying to mySQL server, given a valid queryString

module.exports = {

  handleCountryRequest: function (pool, queryString, callback){

    // grab connection from pool
    pool.getConnection(function (err, connection) {

      // handle connection error
      if (err) {
        console.error('Error connecting to mySQL database.');
        console.error('mySQL database: ' + err.stack);
        return;
      }

      console.log('connected to mySQL database with id: ' + connection.threadId);

      //query the connection for data
      //fields is information about each column of the database
      connection.query(queryString, function (err, results, fields) {

        /* release connection back into the pool, requested data has been delivered
         * IMPORTANT: cannot use connection() after releasing back into pool
         */
        connection.release();

        // handle error in query
        if (err) throw err;

        // output results from query
        console.log('Query success. (Run with string below)');
        console.log(queryString);
        console.log('Results from query from apiReq: ');
        console.log(results);

        // call callback with results of query
        return callback(results);
      });
    });
  }
};