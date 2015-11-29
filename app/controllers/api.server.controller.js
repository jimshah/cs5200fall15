"use strict";
var http = require('http');
module.exports = function(req, res){
	var apiService = require('../services/api.server.service');
	
	return {
		getMoviesByGenre: apiService.getMoviesByGenre,
		getCategories: apiService.getCategories
	}
};

/*module.exports = function(){
	var apiService = require('../services/api.server.service')();
	console.log("apiService", apiService);

	function ApiServerController() {
	}

	ApiServerController.prototype.getCategories = function(req, res, next){
		return apiService.getCategories(req, res, next);
	};
	
	return ApiServerController;
};*/