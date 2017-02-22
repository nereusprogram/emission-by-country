//creates mongoose model for countrys

//get mongoose
var mongoose = require('mongoose');

/*TODO: uncomment after figuring out how to run local
 *      database of mongoDB with name countrys
 *      ---from mongoosejs.com docs
 * mongoose.connect('mongodb://localhost/countrys');
 * var db = mongoose.connection;
 * db.on('error', console.error.bind(console, 'connection error: '));
 * db.once('open', function () {
 *   //we're connected!
 *   //according to mongoose docs, schema and model should be
 *   //inside this callback
 * });
 */

var countrySchema = mongoose.Schema({
  name: {type: String, default: ''},
  perCapitaEmission: {type: Number, default: 0} //metric tons
});

var Country = mongoose.model('Country', countrySchema);

module.exports = Country;