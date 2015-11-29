(function(){

	'use strict';
	
	//Creating "HelloWorldController" controller -> normally create a separate files for controller
	angular
	.module(app.applicationModuleName)
	.config(MyAppFunction)

	function MyAppFunction($routeProvider){
		$routeProvider
		.when("/", {
			/*templateUrl : "/assignment/home/home.view.html" */
			redirectTo : "/home" 
		})
		.when("/home", {
			templateUrl : "/home/views/home.view.html" 
		})
		.otherwise({
			redirectTo : "/" 
		})
	};
})();