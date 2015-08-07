/* get libraries */
var passport = require('passport');
var mongoose = require('mongoose');

/* setup the LocalStrategy passport object */
var LocalStrategy = require('passport-local').Strategy;

/* set the User model object */
var User = mongoose.model('User');

/* set the LocalStrategy method to check the username and password */
passport.use(new LocalStrategy(
    function(username, password, done)
    {
        User.findOne({ username: username }, function (err, user)
        {
            if (err)
            {
                return done(err);
            }
            if (!user)
            {
                return done(null, false, {
                    message: 'Incorrect username.'
                });
            }

            /* use the validPassword method from the User model */
            if (!user.validPassword(password))
            {
                return done(null, false, {
                    message: 'Incorrect password.'
                });
            }
            return done(null, user);
        });
    }
));
