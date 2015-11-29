"use strict";
var http = require('http'),
Promise = require('bluebird');

function ApiServerService() {
};

var api = {
	config: {
		appKey: "f23cd581108902d295b535bb38eaca6b"
	}
}


module.exports = function(){


	ApiServerService.prototype.getCategories = function(req, res, next) {
		try {
			var options = {
				host: "api.themoviedb.org",
				path: "/3/genre/movie/list?api_key="+api.config.appKey,
				method: 'GET'
			};
			return getRequest(options)
			.then(function(responseData){
				res.status(200).send(responseData);
			})
			.catch(function(error){
				res.status(400).send({error: error});
			})
		} catch(error){
			res.status(400).send({error: error});
		}
	};

	ApiServerService.prototype.getMoviesByGenre = function(req, res, next) {
		try {
			var genreId = req.params.genreId || "";
			var options = {
				host: "api.themoviedb.org",
				path: "/3/genre/"+genreId+"/movies?api_key="+api.config.appKey,
				method: 'GET'
			};
			return getRequest(options)
			.then(function(responseData){
				res.status(200).send(responseData);
			})
			.catch(function(error){
				res.status(400).send({error: error});
			})
		} catch(error){
			res.status(400).send({error: error});
		}
	};


	function getRequest(options){
		var self = this;
		try {
			return new Promise(function(resolve, reject){
				options = options || {};

				var callback = function(response) {
					var str = '';

					response.on('data', function (chunk) {
						str += chunk;
					});


					response.on('end', function () {
						return resolve(str);
					});

					response.on("error", function(error){
						return reject(error);
					});
				};

				http.request(options, callback).end();
			});
		}catch(error){
			console.log("caught an error in \"getRequest\" function");
			return Promise.reject(error);
		};
	}

	return new ApiServerService();
}();