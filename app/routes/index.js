'use strict';
var http = require('http');

module.exports = function(app) {

	var apiController = require('../controllers/api.server.controller')();
	var dbController = require('../controllers/db.server.controller')();
	
	// Defining API ROUTES
	app.route("/api/categories").get(apiController.getCategories);
	app.route("/api/genre/:genreId/movie").get(apiController.getMoviesByGenre);

	//Defining DB ROUTES
	app.route("/db/movie/:movieId").get(dbController.getMovieById);
	app.route("/db/popular/movie").get(dbController.getPopularMovies);
	app.route("/db/upcoming/movie").get(dbController.getUpcomingMovies);
	app.route("/db/theatre/movie").get(dbController.getTheatreMovies);

	app.route("/db/dvd/upcoming").get(dbController.getTheatreMovies);
	app.route("/db/dvd/current").get(dbController.getPopularMovies);
	app.route("/db/dvd/toprentals").get(dbController.getPopularMovies);
	app.route("/db/genre").get(dbController.getCategories);
	//app.route("/db/genre/:genreId/movie").get(apiController.getMoviesByGenre);



	
	//app.route("/db/movie/genre").get(dbController.getCategories);

	app.route("/db/tables").get(dbController.getTables);	
	app.route("/db/movie").get(dbController.getMovies);


};