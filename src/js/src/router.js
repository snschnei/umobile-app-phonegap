/*global window:true, _:true, Backbone:true, jQuery:true, umobile:true, config:true, console:true */
(function ($, _, Backbone, umobile, config) {
	'use strict';

	/**
	Houses the Backbone.Router implementation.

	@class RouteManager
	@submodule router
	@namespace router
	**/
	umobile.router.RouteManager = Backbone.Router.extend({
		/**
		Property houses the current view class name.

		@property currentViewClass
		@type String
		**/
		currentViewClass: null,

		/**
		Property houses Backbone routes.

		@property routes
		@type Object
		**/
		routes: {
			'dashboard': 'dashboard',
			'login': 'login',
			'logout': 'logout',
			'modules/*module': 'modules',
			'forgotPassword': 'forgotPassword',
			'*other': 'dashboard'
		},

		/**
		Method initializes the Dashboard view.

		@method dashboard
		**/
		dashboard: function () {
			console.log('Awesome debug router.js - dashboard');
			var dashboard = new umobile.view.DashboardView();
			umobile.app.viewManager.show(dashboard);
		},

		/**
		method initializes the login view.

		@method login
		**/
		login: function () {
			console.log('Awesome debug router.js - login');
			var login = new umobile.view.LoginView();
			umobile.app.viewManager.show(login);
		},

		/**
		Method initializes the logout view.

		@method logout
		**/
		logout: function () {
			console.log('Awesome debug router.js - logout');
			umobile.logout.Logout.logout();
		},

		/**
		Method initializes the Module view.

		@method modules
		**/
		modules: function () {
			console.log('Awesome debug router.js - modules');
			var path, module;
			path = umobile.utility.Utils.getParameter('url', Backbone.history.fragment);
			module = new umobile.view.ModuleView({
				path: path
			});
			umobile.app.viewManager.show(module);
		},

		/**
		Method initializes the Module view and directs user to the Forgot password page.

		@method forgotPassword
		**/

		forgotPassword: function () {
			console.log('Awesome debug routher.js - forgot_Password');
			var path, module;
			path = config.forgotPassword;
			module = new umobile.view.ModuleView({
				path: path
			});
			umobile.app.viewManager.show(module);
		},

		/**
		Listens for the route to change. When triggered,
		it updates the class name on the html container
		and broadcasts the changed route.

		@method onRouteChanged
		@param {String} route Reference to full route path.
		**/
		onRouteChanged: function (route, routeParam) {
			console.log('Awesome debug router.js - onRouteChanged');
			// Define.
			var className, root, path, view;

			// Initialize.
			root = $('html');
			route = route.split(':');
			view = route[1];
			path = (!routeParam) ? view : view + '/' + routeParam;
			className = ('um-' + view);

			// Remove the class from the container when generated className
			// is different from the stored currentViewClass.
			if (this.currentViewClass && className !== this.currentViewClass) {
				root.removeClass(this.currentViewClass);
			}

			// Add class name to container.
			root.addClass(className);
			this.currentViewClass = className;

			// Update the current view on the state model.
			umobile.app.stateModel.save({
				currentView: path
			});

			// Broadcast route changed event.
			$.publish('route.changed', {
				name: view
			});
		},

		/**
		Method initializes the router.

		@method initialize
		**/
		initialize: function () {
			console.log('Awesome debug router.js - initialize');
			// Initialize the Page view.
			var page = new umobile.view.Page().render();

			// Initialize the ViewManager.
			umobile.app.viewManager = new umobile.view.ViewManager();

			// Bind to all the routes. When they change, call
			// the onRouteChanged method.
			this.on('all', _.bind(this.onRouteChanged, this));
		}
	});

})(jQuery, _, Backbone, umobile, config);
