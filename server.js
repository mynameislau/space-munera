var express = require('express');
//var consolidate = require('consolidate');
//var hbs = require('hbs');
var nunjucks = require('nunjucks');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var nodeMailer = require('nodemailer');

var env = process.env.NODE_ENV || 'production';

var base = env === 'development' ? 'dev/' : 'dist/';

var app = express();

//app.engine('hbs', consolidate.handlebars);

//app.set('view engine', 'hbs');

//hbs.registerPartials(__dirname + '/views/partials/');

var nunjucksEnv = nunjucks.configure(base + 'views', {
	express: app
});

app.use(compress());
app.use(favicon());

//app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
//app.use(cookieParser());
//app.get('/users', users.list);

if (env === 'development')
{
	app.use(logger('dev'));
	app.use(express.static(path.join(__dirname, base)));
}

app.use(express.static(path.join(__dirname, base + 'public')));

/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	res.status(404);
	next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (env === 'development') {
	app.use(function(err, req, res, next) {
		console.log(err.message, err);
		res.render('error.html', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.render('error.html', {
		message: err.message,
		error: {}
	});
});

//var debug = require('debug')('console.log');

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  //debug('Express server listening on port ' + server.address().port);
  console.log('Express server listening on port ' + server.address().port + ' in ' + env);
});