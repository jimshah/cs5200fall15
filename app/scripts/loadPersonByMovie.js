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

function getMovieCreditsById(movieId) {
	try {
		return new Promise(function(resolve, reject){
			movieId = movieId || "";
			var options = {
				host: "api.themoviedb.org",
				path: "/3/movie/"+movieId+"/credits?api_key="+api.config.appKey,
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
					return resolve(responseData);
				}, 500);
				//return resolve(responseData);
			})
			.catch(function(error){
				console.log("Error while retrieving movie credits for "+movieId+" \t\t ", error);
				return reject(error);
			})
		});		
	} catch(error){
		res.status(400).send({error: error});
	}
};

function getPersonById(id) {
	try {
		return new Promise(function(resolve, reject){
			id = id || "";
			var options = {
				host: "api.themoviedb.org",
				path: "/3/person/"+id+"?api_key="+api.config.appKey,
				method: 'GET'
			};
			//console.log("options are", options);
			getRequest(options)
			.then(function(responseData){
				// console.log(responseData);
				if (typeof responseData == "string"){
					responseData = JSON.parse(responseData);
				}
				return resolve(responseData);
				/*setTimeout(function() {
					return resolve(responseData);
				}, 50);*/
		})
			.catch(function(error){
				console.log("Error while retrieving movie credits for "+movieId+" \t\t ", error);
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

function insertCastAsPerson(castPerson){
	try {
		return new Promise(function(resolve, reject){
			if (!castPerson.birthday || castPerson.birthday.length < 10){
				castPerson.birthday = "1963-12-18";
			}			
			var query = "insert into Person (id, birthday, homepage, profile_path, place_of_birth) values("+castPerson.id+',"'+castPerson.birthday+'","'+castPerson.homepage+'","'+castPerson.profile_path+'","'+castPerson.place_of_birth+'") ON DUPLICATE KEY UPDATE id = '+castPerson.id;
			executeQuery(query)
			.then(function(result){
				/*setTimeout(function() {
					return resolve(castPerson);
				}, 300);*/
				return resolve(castPerson);
			})
			.catch(function(error){
				//console.log("Error while \"insertCastAsPerson\" "+error);
				console.log("castPerson is ", castPerson);
				return resolve(error);
			});
		});
	} catch(error){
		console.log("caught an error in \"insertCastAsPerson\" function", error);
		return Promise.reject({error: error});
	}
}

function insertCastAsActor(castPerson){
	try {
		castPerson.birthday = castPerson.birthday || "1963-12-18";
		return new Promise(function(resolve, reject){
			var query = "insert into Actor (person_id, name) values("+castPerson.id+',"'+castPerson.name+'") ON DUPLICATE KEY UPDATE person_id='+castPerson.id;
			executeQuery(query)
			.then(function(result){
				setTimeout(function() {
					return resolve(castPerson);
				}, 500);
				//return resolve(castPerson);
			})
			.catch(function(error){
				console.log("Error while \"insertCastAsPerson\" "+error);
				return resolve(castPerson);
			});
		});
	} catch(error){
		console.log("caught an error in \"insertCastAsActor\" function", error);
		return Promise.reject({error: error});
	}
}

function insertAsCast(castMember, movieId){
	try {
		return new Promise(function(resolve, reject){
			var query = "insert into cast ( cast_id, name, char_potrayed, credit_id, person_id, movie_id, profile_path) values("+castMember.cast_id+',"'+castMember.name+'","'+castMember.character+'","'+castMember.credit_id+'",'+castMember.id+','+movieId+',"'+castMember.profile_path+'") ON DUPLICATE KEY UPDATE cast_id='+castMember.cast_id + ';';
			console.log("query is ", query);
			executeQuery(query)
			.then(function(result){
				return resolve(castMember);
			})
			.catch(function(error){
				//console.log("Error while \"insertAsCast\" "+error);
				/*setTimeout(function() {
					return reject(castMember);
				}, 800);*/
				return reject(castMember);
			});
		});
	} catch(error){
		console.log("caught an error in \"insertAsCast\" function", error);
		return Promise.reject({error: error});
	}
}

function execute(){
	var cast, crew;
	getMoviesFromDatabase()
	.map(function(movieIdObject, index, arrlength){
		return getMovieCreditsById(movieIdObject.id)
		.then(function(movie){
			cast = movie.cast || [];
			crew = movie.crew || [];
			if (!movie.id){
				console.log("Movie credits error for ", movie, movieIdObject.id);
			}
			return Promise.resolve(cast);
		})
		.map(function(castMember, index, arrlength){
			//console.log("cast #",index, castMember.name);
			return getPersonById(castMember.id)
			.then(function(castPerson){
				
				console.log("starting insertCastAsPerson to "+castMember.id);
				return insertCastAsPerson(castPerson)
				.then(function(result){
					console.log("starting insertCastAsActor to "+castMember.id);
					return insertCastAsActor(castPerson);
				});
				/*.then(function(result){
					console.log("starting insertAsCast to "+castMember.id);
					return insertAsCast(castMember, movieIdObject.id);
				})*/
			});
			
			//return Promise.resolve();
		}, {concurrency: 1})
		.then(function(results){
			return Promise.resolve(crew);
		})
		.map(function(crewMember, index, arrlength){
			//console.log("crew #",index, crewMember.name);
			return Promise.resolve();
		})
		.then(function(){
			console.log("-------------------------------------------------------------------------------------");
			return Promise.resolve();
		});
	}, {concurrency: 1})
.then(function(result){
	console.log("")
	console.log("done");
	return Promise.resolve();
})
.catch(function(error){
	console.log("error", error);
});
}

execute();

