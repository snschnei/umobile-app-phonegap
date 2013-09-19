/*global window:true, document:true, jQuery:true, _:true, umobile:true, config:true, Backbone:true, console:true */
(function ($, _, umobile, config) {
		'use strict';

		/**
		The Folder collection houses a collection of folders or portlets.

		@class FolderCollection
		@subfolder collection
		@namespace collection
		@constructor
		**/
		umobile.collection.FolderCollection = Backbone.Collection.extend({
				/**
				The model class contained by the collection.

				@property model
				@type Object
				**/
				model: umobile.model.Folder,

				/**
				Method overrides Backbone.save. Makes an update call to the
				umobile.storage.sync method.

				@method save
				@param {Object} options Success and error callbacks.
				**/
				save: function (options) {
					console.log('Awesome debug FolderCollection.js - save');
					this.sync('update', this, options);
				},

				/**
				Method overrides Backbone.fetch. Makes a read call to the
				umobile.storage.sync method.

				@method fetch
				@param {Object} options Success and error callbacks.
				**/
				fetch: function (options) {
					console.log('Awesome debug FolderCollection.js - fetch');
					this.sync('read', this, options);
				},

				/**
				Method overrides Backbone.sync with umobile.storage.sync method.
				Persists the state of the model to the server.

				@method sync
				**/
				sync: umobile.storage.sync(umobile.storage[config.storageFn], 'folders')
			});

	})(jQuery, _, umobile, config);
