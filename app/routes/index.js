'use strict';
var http = require('http');

module.exports = function(app) {

	var apiController = require('../controllers/api.server.controller')();
	var dbController = require('../controllers/db.server.controller')();
	
	// Defining API ROUTES
	app.route("/api/categories").get(apiController.getCategories);
	app.route("/api/genre/:genreId/movie").get(apiController.getMoviesByGenre);

	//Defining DB ROUTES
	app.route("/db/categories").get(dbController.getCategories);	
	app.route("/db/tables").get(dbController.getTables);	
	app.route("/db/movie").get(dbController.getMovies);
	app.route("/db/movie/:movieId").get(dbController.getMovieById);

};