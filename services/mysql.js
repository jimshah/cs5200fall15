"use strict";
var mysql      = require('mysql');
module.exports = function(dbName){

	function MySqlService() {
		var self = this;
		self.host = "localhost";
		self.user = "root";
		self.password = "admin";
		self.db = dbName || "movie";
	}

	/**
	 * [getConnection description]
	 * @return {[type]} [description]
	 */
	MySqlService.prototype.getConnection = function(){
		var self = this;
		try {
			var connection = mysql.createConnection({
				host     : self.host,
				user     : self.user,
				password : self.password,
				database : self.db
			});
			console.log("Connecting to "+self.db);
			connection.connect();
			return connection;
		} catch(error){
			console.log("Error creating a connection", error);
		}
	}

	return MySqlService;

};