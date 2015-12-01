var Promise = require('bluebird');
var http = require('http');

var MySqlService = new (require("../../services/mysql.js")("movie"))();
var mysql = MySqlService.getConnection();

var api = {
	config: {
		appKey: "f23cd581108902d295b535bb38eaca6b"
	}
};

function getMoviesFromDatabase(){
	var query = "select id from movies";
	return new Promise(function(resolve, reject){
		mysql.query(query,function(err, rows, fields) {
			if (err) {
				console.log("err", err);
				return reject(err);
			} else {
				//console.log("row", rows);
				return resolve(rows);
			}
		});
	});
}

function executeQuery(query){
	return new Promise(function(resolve, reject){
		mysql.query(query,function(err, rows, fields) {
			if (err) {
				console.log("err", err);
				return reject(err);
			} else {
				//console.log("row", rows);
				return resolve(rows);
			}
		});
	});
}

function addMovieToPopular(movie){
	try {
		return new Promise(function(resolve, reject){
			var query = "insert into popular (id, title, overview, popularity, poster_path, release_date) values (";
			query += movie.id + ',"' + movie.title + '","' + movie.overview + '",' + movie.popularity + ',"' + movie.poster_path + '","' + movie.release_date + '")';
			query += 'ON DUPLICATE KEY UPDATE id = '+movie.id;
			executeQuery(query)
			.then(function(result){
				return resolve(result);
			})
			.catch(function(error){
				console.log("query", query);
				return resolve(error);
			})
		});
	} catch(error){
		return Promise.reject(error);
	}
}

function getPopularMovies(page) {
	try {
		return new Promise(function(resolve, reject){
			//return resolve([]);
			page = page || 1;
			var options = {
				host: "api.themoviedb.org",
				path: "/3/movie/popular?api_key="+api.config.appKey+"&page="+page,
				method: 'GET'
			};
			//console.log("options are", options);
			getRequest(options)
			.then(function(responseData){
				// console.log(responseData);
				if (typeof responseData == "string"){
					responseData = JSON.parse(responseData);
				}
				setTimeout(function() {
					//console.log("responseData", responseData);
					return resolve(responseData.results);
				}, 1000);
				//return resolve(responseData);
			})
			.catch(function(error){
				return reject(error);
			})
		});		
	} catch(error){
		res.status(400).send({error: error});
	}
};

function getRequest(options){
	try {
		return new Promise(function(resolve, reject){
			options = options || {};

			var callback = function(response) {
				var str = '';

				response.on('data', function (chunk) {
					str += chunk;
				});


				response.on('end', function () {
					//str = str.replace(/"/g, '\"');
					return resolve(str);
				});

				response.on("error", function(error){
					console.log("http rcv error", error);
					return reject(error);
				});
			};

			http.request(options, callback).end();
		});
	}catch(error){
		console.log("caught an error in \"getRequest\" function");
		return Promise.reject(error);
	};
};



function execute(){
	var pages = [1,2,3,4,5];
	return Promise.resolve(pages)
	.map(function(page, index, arrlength){
		return getPopularMovies(page)
		.map(function(movie, index, arrlength){
			console.log("adding in", movie.title);
			return addMovieToPopular(movie);
		});
	}, {concurrency: 1})
	.then(function(data){
		console.log("Done");
	})
	.catch(function(error){
		console.log("Final Error", error);
	});
};

execute();

