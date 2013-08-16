/*global window:true, _:true, Backbone:true, jQuery:true, umobile:true, config:true, console:true, Handlebars:true */
(function ($, _, Backbone, umobile, config) {
	'use strict';

	/**
	Manages the loaded Dashboard view.

	@class DashboardView
	@submodule view
	@namespace view
	@constructor
	**/
	umobile.view.DashboardView = umobile.view.LoadedView.extend({
		/**
		Property houses the name of the loaded view.

		@property name
		@type String
		@override LoadedView
		**/
		name: 'dashboard',

		/**
		Property houses DOM selectors.

		@property selectors
		@type Object
		@override Base
		**/
		selectors: {
			template: '#views-partials-dashboardview',
			moduleList: '#moduleList',
            folderList: '#folderList',
			notifier: '#notifier'
		},

		/**
		Method empties root containers.

		@method cleanContainers
		**/
		cleanContainers: function () {
            console.log("Awesome debug DashboardView.js - cleanContainers");
			var notifier = this.loc('notifier'),
				moduleList = this.loc('moduleList'),
                folderList = this.loc('folderList');

			notifier.empty().hide();
			moduleList.empty().hide();
            folderList.empty().hide();
		},

		/**
		Method renderModules
		**/
		renderModules: function () {
                console.log("Awesome debug DashboardView.js - renderModules");
			// Define & initialize.
			var folderList = this.loc('folderList'),
				folders = this.folderCollection.toJSON();
            var i = 1;

			// Iterate over modules and initialize each module view.
			_.each(folders, function (folder, idx) {
               folder.title = $('<div/>').html(folder.title).text(); // decode any html that may be in the JSON feed
				var folderView = new umobile.view.Folder({
					model: folder,
                    id: i
				});
                i++;
				folderList.append(folderView.render().el).show();
			}, this);
		},

		/**
		Method renders the notifier.

		@method renderNotifier
		**/
		renderNotifier: function () {
            console.log("Awesome debug DashBoardView.js - renderNotifier");
			// Define.
			var notifier, notifierModel, notifierView;

			// Initialize.
			notifier = this.loc('notifier');
			notifierModel = new umobile.model.Notifier();
			notifierView = new umobile.view.Notifier({model: notifierModel.toJSON()});
			notifier.append(notifierView.render().el).show();
		},

		/**
		Method overrides the LoadedView class. This method
		provides custom content for the Dashboard view.

		@method renderContent
		@param {Object} collection Reference to the ModuleCollection.
		@override LoadedView
		**/
		renderContent: function (collection) {
            console.log("Awesome debug DashBoardView.js - renderContent");
			this.cleanContainers();
			this.renderModules();
		},

		/**
		Method overrides the LoadedView class. This method
		provides custom content for the Dashboard view.

		@method renderError
		@override LoadedView
		**/
		renderError: function () {
            console.log("Awesome debug DashBoardView.js - renderError");
			this.cleanContainers();
			this.renderNotifier();
		}
	});

})(jQuery, _, Backbone, umobile, config);
