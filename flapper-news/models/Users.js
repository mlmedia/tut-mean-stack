/* require libraries */
var mongoose = require('mongoose');
var crypto = require('crypto');

/* setup the mongoose schema */
var UserSchema = new mongoose.Schema({
    username: {type: String, lowercase: true, unique: true},
    hash: String,
    salt: String
});

/* add a setPassword method for creating secure passwords */
UserSchema.methods.setPassword = function(password)
{
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

/* define the model and pass the mongoose schema */
mongoose.model('User', UserSchema);
