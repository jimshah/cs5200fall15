"use strict";
var http = require('http');
module.exports = function(req, res){
	var dbService = require('../services/db.server.service');
	
	return {
		getMovieById: dbService.getMovieById,
		getPopularMovies: dbService.getPopularMovies,
		getUpcomingMovies: dbService.getUpcomingMovies,
		getTheatreMovies: dbService.getTheatreMovies,

		getCategories: dbService.getCategories,
		getTables: dbService.getTables,
		getMovies: dbService.getMovies
	}
};