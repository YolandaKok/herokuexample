var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var UserSchema = Schema({
  username: String,
  password: String
});

// Create a Hash function to store the password safely
// Got it from the npm bcrypt website
UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}

// Check if the user inserted the right credentials

module.exports = mongoose.model('User', UserSchema);
