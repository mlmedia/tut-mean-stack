/* get libraries */
var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

/* set up the mongoose schema */
var UserSchema = new mongoose.Schema({
	username: {
		type: String,
		lowercase: true,
		unique: true
	},
	hash: String,
	salt: String
});

/* set up the setPassword method (for user to create a password)*/
UserSchema.methods.setPassword = function (password) {
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

/* set up the validPassword method to check the password (e.g. when logging in) */
UserSchema.methods.validPassword = function (password) {
	var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
	return this.hash === hash;
};

/* set up the generateJWT method to create a json web token */
UserSchema.methods.generateJWT = function () {
	var today = new Date();
	var exp = new Date(today);
	exp.setDate(today.getDate() + 60); /* set expiration to 60 days */

	/* set the token with the username, expiration, and encrypting it with a secret */
	return jwt.sign({
		_id: this._id,
		username: this.username,
		exp: parseInt(exp.getTime() / 1000),
	}, 'SECRET'); /* SECRET should not be hard-coded, but instead put in an ENV variable */
};

/* declare the model and pass the schema */
mongoose.model('User', UserSchema);
