var Promise = require('bluebird');
var http = require('http');

var MySqlService = new (require("../../services/mysql.js")("movie"))();
var mysql = MySqlService.getConnection();

var api = {
	config: {
		appKey: "f23cd581108902d295b535bb38eaca6b"
	}
};


function getMovieByGenre(genreId) {
	try {
		return new Promise(function(resolve, reject){
			genreId = genreId || "";
			var options = {
				host: "api.themoviedb.org",
				path: "/3/genre/"+genreId+"/movies?api_key="+api.config.appKey,
				method: 'GET'
			};
			//console.log("options are", options);
			getRequest(options)
			.then(function(responseData){
				// console.log(responseData);
				if (typeof responseData == "string"){
					responseData = JSON.parse(responseData);
				}
				return resolve(responseData.results);
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
					/*console.log("chunk", chunk);
					console.log("typeof chunk", typeof chunk);
					if (chunk){
						str += chunk.replace(/"/g, '');
					} else {
						str += chunk;
					}*/
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

getMovieByGenre(28)
.map(function(movie, index){
	var query = "insert into movies (id, title, genre, overview, popularity, poster_path, movie_lang, release_date) values(" + movie.id + ',"' + movie.title + '","' + movie.genre + '","' + movie.overview + '",' + movie.popularity + ',"' + movie.poster_path + '","' + movie.movie_lang + '","' + movie.release_date + '")';
	console.log("query is \n", query);
	mysql.query(query,function(err, rows, fields) {
		if (err) {
			console.log("err", err);
			return Promise.reject(err);
		} else {
			console.log(movie.title + " added successfully");
		}
	});
})
.then(function(){
	console.log("Done");
})
.catch(function(error){
	console.log("Final error", error);
});

/*var movie = {
	title: "American Ultra",
	id: 254128456,
	genre: 28,
	release_date: "2015-05-29"
};*/

//var query = "insert into movies (id, title, genre, release_date) values(?,?,?,?)",[movie.id, movie.title, movie.genre, movie.release_date];
//console.log("query is \n", query);
/*mysql.query("insert into movies (id, title, genre, release_date) values(?,?,?,?)", [movie.id, movie.title, movie.genre, movie.release_date], function(err, rows, fields) {
	if (err) {
		console.log("err", err);
		return Promise.reject(err);
	} else {
		console.log(movie.title + " added successfully");
	}
});*/

/*mysql.query("select * from movies", function(err, rows, fields) {
	if (err) {
		console.log("err", err);
		return Promise.reject(err);
	} else {
		console.log("row", rows);
		console.log("fields", fields);
		console.log(movie.title + " added successfully");
	}
});*/