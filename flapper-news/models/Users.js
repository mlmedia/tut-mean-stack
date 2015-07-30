/* require libraries */
var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

/* setup the mongoose schema */
var UserSchema = new mongoose.Schema({
    username: {type: String, lowercase: true, unique: true},
    hash: String,
    salt: String
});

/* setPassword method for creating secure passwords */
UserSchema.methods.setPassword = function(password)
{
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

/* validPassword method for checking passwords */
UserSchema.methods.validPassword = function(password)
{
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash === hash;
};

/* generateJMT method for setting validation token */
UserSchema.methods.generateJWT = function()
{
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60); /* expires in 60 days */

    return jwt.sign({
        _id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000),
    }, 'SECRET');
};

/* define the model and pass the mongoose schema */
mongoose.model('User', UserSchema);
