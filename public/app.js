(function(){

	'use strict';
	
	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(app.applicationModuleName).requires.push(moduleName);
	};

	//Defining our app configs, cann add some more attributes to it later on as we progress
	var app = {
		applicationModuleName: "MovieCentral",
		applicationModuleVendorDependencies: ['ngRoute'],//['ngResource', 'ngAnimate', 'ui.router', 'ui.bootstrap', 'ui.utils'],
		registerModule: registerModule
	};

	window.app = app;

	//Declaring our root module
	angular.module(app.applicationModuleName,app.applicationModuleVendorDependencies);

	// Setting HTML5 Location Mode - May be later, not now
	angular.module(app.applicationModuleName).config(['$locationProvider',
		function($locationProvider) {
			//console.log("hello, hash prefixed");
			//$locationProvider.hashPrefix('!');
		}
		]);

})();