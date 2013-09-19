/*global window:true, document:true, jQuery:true, _:true, debug:true, umobile:true, config:true, GibberishAES:true, console:true */
(function ($, _, umobile, config, debug) {
		'use strict';

		/**
		Manages persistence of data for the umobile application.

		@class Storage
		@submodule storage
		@namespace storage
		**/
		umobile.storage = umobile.storage || {};

		/**
		Method overrides Backbone.sync implementation
		to persist application data.

		@method sync
		**/
		umobile.storage.sync = function (storage, key) {
			console.log('Awesome debug Storage - umobile.storage.sync');
			storage.init();
			return function (method, model, options) {
				console.log('Awesome debug Strorage.js - return in umobile.storage.sync');
				var id, storageKey;
				id = model.id || key;
				storageKey = key + '.' + id;
				switch (method) {
				case 'read':
					debug.info('Reading storage key: ' + storageKey);
					storage.getItem(
						storageKey, function (result) {
							console.log('Awesome debug Storage.js - umobile.storage.sync function');
							var arr, modules;
							if (result) {
								debug.info('Reading result: ' + result);
								if (model.id) {
									debug.info('Result has id property.');
									debug.info('Updating model with result.');
									model.set(JSON.parse(result));
								} else {
									arr = JSON.parse(result);
									modules = [];
									$(arr).each(function (idx, module) {
											console.log('Awesome debug Storage.js - arr.each');
											modules.push(new model.model(module));
										});
									model.reset(modules);
								}
								if (options && options.hasOwnProperty('success')) {
									options.success(model);
								}
							} else {
								debug.info('Initializing new ' + storageKey + ' for ' + JSON.stringify(model));
								storage.setItem(storageKey, JSON.stringify(model));
								if (options && options.hasOwnProperty('success')) {
									options.success(model);
								}
							}
						});
					break;
				case 'create':
					debug.info('creating ' + storageKey + ': ' + JSON.stringify(model));
					storage.setItem(storageKey, JSON.stringify(model));
					if (options && options.hasOwnProperty('success')) {
						options.success(model);
					}
					break;
				case 'update':
					debug.info('Saving ' + storageKey + ': ' + JSON.stringify(model));
					storage.setItem(storageKey, JSON.stringify(model));
					if (options && options.hasOwnProperty('success')) {
						options.success(model);
					}
					break;
				case 'delete':
					debug.info('removing ' + storageKey);
					storage.removeItem(storageKey);
					if (options && options.hasOwnProperty('success')) {
						options.success(model);
					}
					break;
				}
			};
		};

		/**
		Manages the persistance of data to local storage.

		@class Local
		@submodule storage
		@namespace storage
		**/
		umobile.storage.local = {
			/**
			Method retrieves item from local storage.

			@method getItem
			@param {String} storageKey
			@param {Function} success
			**/
			getItem: function (storageKey, success) {
				console.log('Awesome debug Storage.js - umobile.storage.local - getItem');
				return success(window.localStorage.getItem(storageKey));
			},

			/**
			Method sets item into local storage.

			@method setItem
			**/
			setItem: function (storageKey, json) {
				console.log('Awesome debug Storage.js - umobile.storage.local - setItem');
				window.localStorage.setItem(storageKey, json);
			},

			/**
			Method removes item from local storage.

			@method setItem
			**/
			removeItem: function (storageKey) {
				console.log('Awesome debug Storage.js - umobile.storage.local - removeItem');
				window.localStorage.removeItem(storageKey);
			},

			/**
			Entry point for the local storage implementation.

			@method init
			**/
			init: function () {
				console.log('Awesome debug Storage.js - umobile.storage.local - init');
			}
		};

		/**
		Manages the persistance of data to the umobile database.

		@class DB
		@submodule storage
		@namespace storage
		**/
		umobile.storage.db = {
			init: function () {
				console.log('Awesome debug Storage.js - umobile.storage.db - init');
				var db = window.openDatabase('umobile', '1.0', 'uMobile DB', 1000000);
				db.transaction(function (tx) {
						console.log('Awesome debug Storage.js - umobile.storage.db - init(tx)');
						tx.executeSql('CREATE TABLE IF NOT EXISTS umobile (id unique, data)');
					}, function (tx, err) {
						debug.info('Error processing SQL: ' + err);
						console.log('Awesome debug Storage.js - umobile.storage.db - itit(tx,err)');
					});
			},
			getItem: function (storageKey, success) {
				console.log('Awesome debug Storage.js - umobile.storage.db - getItem');
				var db = window.openDatabase('umobile', '1.0', 'uMobile DB', 1000000);
				db.transaction(function (tx) {
						console.log('Awesome debug Storage.js - umobile.storage.db - getItem(tx)');
						tx.executeSql(
							'SELECT * FROM umobile WHERE id=?', [storageKey], function (tx, results) {
								console.log('Awesome debug Storage.js - umobile.storage.db - getItem(tx, results)');
								if (results.rows.length > 0) {
									success(results.rows.item(0).data);
								} else {
									success(null);
								}
							}, function (tx, err) {
								debug.info('Error processing SQL: ' + err);
							});
					}, function (tx, err) {
						debug.info('Error processing SQL: ' + err);
					});

				return window.localStorage.getItem(storageKey);
			},
			setItem: function (storageKey, json) {
				console.log('Awesome debug Storage.js - umobile.storage.db - setItem');
				var db = window.openDatabase('umobile', '1.0', 'uMobile DB', 1000000);
				db.transaction(function (tx) {
						console.log('Awesome debug Storage.js - umobile.storage.db - setItem(tx)');
						tx.executeSql('DELETE FROM umobile WHERE id=?', [storageKey]);
						tx.executeSql('INSERT INTO umobile (id, data) VALUES (?, ?)', [storageKey, json]);
					}, function (tx, err) {
						debug.info('Error processing SQL: ' + err);
					});
			},
			removeItem: function (storageKey) {
				console.log('Awesome debug Storage.js - umobile.storage.db - removeItem');
				var db = window.openDatabase('umobile', '1.0', 'uMobile DB', 1000000);
				db.transaction(function (tx) {
						console.log('Awesome debug Storage.js - umobile.storage.db - removeItem(tx)');
						tx.executeSql('DELETE FROM umobile WHERE id=?', [storageKey]);
					}, function (tx, err) {
						debug.info('Error processing SQL: ' + err);
					});
				window.localStorage.removeItem(storageKey);
			}
		};

	})(jQuery, _, umobile, config, debug);
