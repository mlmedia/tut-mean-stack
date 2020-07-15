/* get libraries */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');

/* MongoDB connecting and modeling: */
mongoose.connect('mongodb://localhost/news2');

/* require the models */
require('./models/Posts');
require('./models/Comments');
require('./models/Users');

/* get the passport config */
require('./config/passport');

/* require the routes and set up express */
var routes = require('./routes/index');
var app = express();

/* set the port and views */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* uncomment after placing your favicon in /public */
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public_html')));

/* initialize the passport after the express.static middleware */
app.use(passport.initialize());

app.use('/', routes);
//app.use('/users', users);

/* catch 404 and forward to error handler */
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

/* development error handler (w/ stacktrace) */
if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

/* production error handler (no stacktraces leaked to user) */
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

/* start express and setup the listener to the port */
app.listen(app.get('port'), function () {
	console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-c to terminate');
});

/* export the app object */
module.exports = app;
