module.exports = function (app, pool){
  // use a connection from the pool
  pool.getConnection(function (err, connection) {
    // handle connection error
    if (err) {
      console.error('Error connecting to mySQL database.');
      console.error('mySQL database: ' + err.stack);
      return;
    }

    console.log('connected to mySQL database with id: ' + connection.threadId);

    // test query database, expected output to be 3 records
    connection.query('SELECT * FROM emission_by_country_tbl WHERE emissions > 40000',
      //fields is information about each column of the database
      function (err, results, fields) {
        /* release connection back into the pool, requested data has been delivered
         * IMPORTANT: cannot use connection() after releasing back into pool
         */
        connection.release();

        // handle error in query
        if (err) throw err;

        //output results from query
        console.log('Test query success.');
    });
  });
};