"use strict";
var http = require('http');
module.exports = function(req, res){
	var dbService = require('../services/db.server.service');
	
	return {
		getCategories: dbService.getCategories,
		getTables: dbService.getTables,
		getMovies: dbService.getMovies,
		getMovieById: dbService.getMovieById
	}
};