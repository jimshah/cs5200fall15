"use strict";
var http = require('http'),
Promise = require('bluebird');
var self;

function DbServerService() {
	self = this;
	//this.SesService = new (require('../../../services/ses.js')(sesConfig, dbConfig))();
	self.MySqlService = new (require("../../services/mysql.js")("sakila"))();
	self.mysql = self.MySqlService.getConnection();
	//console.log("self.mysql", self.mysql);
};

var api = {
	config: {
		appKey: "f23cd581108902d295b535bb38eaca6b"
	}
}


module.exports = function(){

	DbServerService.prototype.getTables = function(req, res, next) {
		//console.log("self", self);
		//console.log("self.prototype", self.prototype);
		try {
			return new Promise(function(resolve, reject){
				self.executeQuery("show tables")
				.then(function(responseData){
					res.status(200).send(responseData);
				})
				.catch(function(error){
					res.status(400).send({error: error});
				});
			});
		} catch(error){
			res.status(400).send({error: error});
		}
	};

	DbServerService.prototype.getMovieById = function(req, res, next) {
		//console.log("self", self);
		//console.log("self.prototype", self.prototype);
		try {
			var movieId = req.params.movieId || "";
			return new Promise(function(resolve, reject){
				self.executeQuery("select * from film where film_id="+movieId)
				.then(function(responseData){
					res.status(200).send(responseData);
				})
				.catch(function(error){
					res.status(400).send({error: error});
				});
			});
		} catch(error){
			res.status(400).send({error: error});
		}
	};

	DbServerService.prototype.getMovies = function(req, res, next) {
		//console.log("self", self);
		//console.log("self.prototype", self.prototype);
		try {
			return new Promise(function(resolve, reject){
				self.executeQuery("select * from film")
				.then(function(responseData){
					res.status(200).send(responseData);
				})
				.catch(function(error){
					res.status(400).send({error: error});
				});
			});
		} catch(error){
			res.status(400).send({error: error});
		}
	};

	DbServerService.prototype.executeQuery = function(query) {
		var self = this;
		try {
			return new Promise(function(resolve, reject){
				if (!query){
					return reject("please provide a valid query string");
				} else {
					self.mysql.query(query, function(err, rows, fields) {
						if (err) {
							return reject(err);
						} else {
							/*console.log("rows", rows);
							console.log("fields", fields);*/
							return resolve(rows || []);
						}
					});
				}
			});
		} catch(error){
			return Promise.reject(error);
		}
	};


	DbServerService.prototype.getCategories = function(req, res, next) {
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

	DbServerService.prototype.getCategoryEvents = function(req, res, next) {
		var self = this, category = req.params.category;
		
		try {
			var options = {
				host: "api.eventful.com",
				path: "/json/events/search?app_key="+api.config.appKey+"&category="+category,
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

	DbServerService.prototype.getEvent = function(req, res, next){
		var self = this, eventId = req.params.eventId;
		console.log("eventId", eventId);
		try {
			var options = {
				host: "api.eventful.com",
				path: "/json/events/get?app_key="+api.config.appKey+"&id="+eventId,
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

	return new DbServerService();
}();