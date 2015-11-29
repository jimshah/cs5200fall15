var express = require('express'),
app = express(),
bodyParser = require('body-parser'),
morgan = require("morgan");


//  Set the environment variables we need.
var ipaddress = '127.0.0.1';
var port      = 3400;

//App usages
app.use(express.static(__dirname + '/public'));
app.use(bodyParser());
app.use(morgan("dev"));

// Handle 404
/*app.use(function(req, res) {
	//.redirect(302, '/not-found.html');
	//res.send('404: Page not Found', 404);
});*/

  // Handle 500
  app.use(function(error, req, res, next) {
  	res.send('500: Internal Server Error', 500);
  });

  // Load local packages
var services = require('./services')();    // load services

  /*// Load modules
require('./app')(app, services);*/

//Load Routes
require("./app/routes")(app);

  app.listen(port, ipaddress, function() {
  	console.log("EXPRESS server started on port "+port); 
  });