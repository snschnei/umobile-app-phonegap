/*global window:true, document:true, jQuery:true, _:true, umobile:true, config:true, Backbone:true, console:true */
(function ($, _, umobile, config) {
		'use strict';

		/**
		The Folder model houses information relating to each
		folder or tab.

		@class Folder
		@subfolder model
		@namespace model
		@constructor
		**/
		umobile.model.Folder = Backbone.Model.extend({
				/**
				Property houses default model attributes.

				@property defaults
				@type Object
				**/
				defaults: {
					title: 'Title'
				},

				/**
				Method overrides Backbone.sync with umobile.storage.sync method.
				Persists the state of the model to the server.

				@method sync
				**/
				sync: umobile.storage.sync(umobile.storage[config.storageFn], 'folder')
			});

	})(jQuery, _, umobile, config);
