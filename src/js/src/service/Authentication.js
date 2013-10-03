/*global window:true, document:true, jQuery:true, _:true, debug:true, umobile:true, config:true, GibberishAES:true, console:true */
(function ($, _, umobile, config, debug) {
		'use strict';

		/**
		Manages authentication process for the umobile application.

		@class Authentication
		@submodule auth
		@namespace auth
		**/
		umobile.auth = umobile.auth || {};

		/**
		Method returns local login servlet url.

		@method getLocalLoginServletUrl
		@return {String} local login servlet url.
		@private
		**/
		var getLocalLoginServletUrl = function () {
			console.log('Awesome debug Authentication.js - getLocalLoginServletUrl');
			return config.uMobileServerUrl + config.uMobileServerContext + '/Login';
		};

		/**
		Method returns local logout servlet url.

		@method getLocalLoginServletUrl
		@return {String} local logout servlet url.
		@private
		**/
		var getLocalLogoutServletUrl = function () {
			console.log('Awesome debug Authentication.js - getLocalLogoutServletUrl');
			return config.uMobileServerUrl + config.uMobileServerContext + '/Logout';
		};

		/**
		Method logs a user into the system with the configured login
		function. Data pertaining to a user and thier layout is made
		available when successful.

		@method establishSession
		**/
		umobile.auth.establishSession = function () {
			console.log('Awesome debug Authentication.js - umobile.auth.establishSession');
			debug.info('Establish a session with: ' + config.loginFn);
			debug.info('Using username: ' + umobile.app.credModel.get('username'));

			var loginFn = umobile.auth[config.loginFn];
			loginFn(
				umobile.app.credModel,
				_.bind(function (data) {
						debug.info('Broadcasting data for user: ' + data.user + '.');
						$.publish('session.established', data);
					}, this),
				_.bind(function (jqXHR, textStatus, errorThrown) {
						var error = {
							xhr: jqXHR,
							status: textStatus,
							error: errorThrown
						};
						debug.error('Login failed: ' + error.errorThrown);
						debug.info('Broadcasting login failure for user: ' + umobile.app.credModel.get('username') + '.');
						$.publish('session.failure', error);
					}, this));
		};


		/**
		Method mocks the login process for development purposes.

		@method mockLogin
		@param {Object} credentials Object hash containing user credentials.
		@param {Function} onSuccess Handler for successful operation.
		@param {Function} onError Handler for unsucssessful operation.
		**/
		umobile.auth.mockLogin = function (credentials, onSuccess, onError) {
			console.log('Awesome debug Authentication.js - umobile.auth.mockLogin');
			// Define.
			var data, url, username;

			// Can only use guest or student with the mock login.
			username = credentials.get('username');

			// Set the username to guest when false.
			if (!username) {
				username = 'guest';
			}

			// Can only use guest or student with the mock login.
			if (username !== null && username !== 'guest' && username !== 'student') {
				throw new Error('Username ' + username + ' not supported with mock login.');
			}

			// Build url.
			url = config.uMobileServerUrl + config.uMobileServerContext + '/layout-' + username + '.json';
			debug.info('Attempting login via URL: ' + url);

			// Request for locally stored json file.
			$.ajax({
					url: url,
					dataType: 'json',
					type: 'GET',
					success: function (data, textStatus, jqXHR) {
						console.log('Awesome debug Authentication.js - ajax: success');
						onSuccess(data);
					},
					error: function (jqXHR, textStatus, errorThrown) {
						console.log('Awesome debug Authentication.js - ajax: error');
						onError(jqXHR, textStatus, errorThrown);
					}
				});
		};

		/**
		Method performs authentication through the uMobile application server
		local authentication controller.

		@method localLogin
		@param {Object} credentials Object hash containing user credentials.
		@param {Function} onSuccess Handler for successful operation.
		@param {Function} onError Handler for unsucssessful operation.
		**/
		umobile.auth.localLogin = function (credentials, onSuccess, onError) {
			console.log('Awesome debug Authentication.js - umobile.auth.localLogin');
			// Define.
			var data, url;

			data = {
				refUrl: config.uMobileServerContext + '/layout.json'
			};
			url = getLocalLoginServletUrl();

			// If credentials are included, add them to the POST data.
			if (credentials && credentials.get('username') && credentials.get('password')) {
				data.userName = credentials.attributes.username;
				data.password = credentials.attributes.password;
				debug.info('Attempting local login via URL ' + url);
			} else {
				debug.info('Establishing guest session via URL ' + url);
			}

			// POST to the uMobile login servlet
			$.ajax({
					url: getLocalLoginServletUrl(),
					data: data,
					dataType: 'json',
					type: 'POST',
					success: function (data, textStatus, jqXHR) {
						if (!credentials || !credentials.attributes.username) {
							debug.info('Established guest session');
							onSuccess(data);
						} else if (credentials.attributes.username === data.user) {
							debug.info('Successful authentication for user ' + credentials.attributes.username);
							onSuccess(data);
						} else {
							debug.info('Error performing local authentication: ' + textStatus);
							onError(jqXHR, 'Auth failure');
						}
					},
					error: function (jqXHR, textStatus, errorThrown) {
						debug.info('Error performing local authentication: ' + textStatus + ', ' + errorThrown);
						onError(jqXHR, textStatus, errorThrown);
					}
				});
		};

		/**
		Method performs CAS authentication.

		@method casLogin
		@param {Object} credentials Object hash containing user credentials.
		@param {Function} onSuccess Handler for successful operation.
		@param {Function} onError Handler for unsucssessful operation.
		**/
		umobile.auth.casLogin = function (credentials, onSuccess, onError) {
			console.log('Awesome debug Authentication.js - umobile.auth.casLogin');
			// Define.
			var casUrl, serviceUrl;

			// When credentials are false, fall back to local login.
			if (!credentials || !credentials.get('username') || !credentials.get('password')) {
				return umobile.auth.localLogin(credentials, onSuccess, onError);
			}

			// Initialize & define url paths.
			casUrl = config.casServerUrl + '/cas/login';
			serviceUrl = getLocalLoginServletUrl() + '?refUrl=' + config.uMobileServerContext + '/layout.json';
			debug.info('Attempting CAS authentication to URL ' + casUrl + ' using serviceUrl ' + serviceUrl);

			// Request to the uMobile login servlet.
			$.ajax({
					url: casUrl,
					data: {
						service: serviceUrl
					},
					dataType: 'html',
					type: 'GET',
					success: function (html, textStatus, jqXHR) {
						console.log('Awesome debug Authentication.js - ajax: success GET');
						// Define.
						var flowRegex, executionRegex, flowId, executionId, data;

						// If this doesn't look like the CAS login form, we already
						// have a CAS session and were directed straight to uMobile.
						console.log('before the check');
						if (html.indexOf('name="lt"') === -1) {
							console.log('after the log');
							data = $.parseJSON(html);
							if (!credentials || credentials.attributes.username === data.user) {
								onSuccess(data);
							} else {
								debug.info('Error parsing layout JSON response.');
								onError(jqXHR, 'Auth failure');
							}
						} else { // Otherwise submit the user's credentials.
							flowRegex = /input type="hidden" name="lt" value="([a-z0-9\-]*)?"/i;
							executionRegex = /input type="hidden" name="execution" value="([a-z0-9\-]*)?"/i;
							flowId = flowRegex.exec(html)[1];
							executionId = executionRegex.exec(html)[1];

							debug.info('Submitting user credentials to CAS.');
							$.ajax({
									url: casUrl,
									data: {
										service: serviceUrl,
										username: credentials.attributes.username,
										password: GibberishAES.dec(credentials.attributes.password, config.encryptionKey),
										lt: flowId,
										execution: executionId,
										_eventId: 'submit',
										submit: 'LOGIN'
									},
									dataType: 'json',
									type: 'POST',
									success: function (data, textStatus, jqXHR) {
										console.log('Awesome debug Authentication.js - ajax: sucess post');
										if (!credentials || credentials.attributes.username === data.user) {
											onSuccess(data);
										} else {
											debug.info('Error parsing layout JSON response' + textStatus);
											onError(jqXHR, 'Auth failure');
										}
									},
									error: function (jqXHR, textStatus, errorThrown) {
										console.log('Awesome debug Authentication.js - ajax: error');
										debug.info('Error submitting CAS credentials: ' + textStatus + ', ' + errorThrown);
										return umobile.auth.localLogin(credentials, onSuccess, onError);
									}
								});
						}
					},
					error: function (jqXHR, textStatus, errorThrown) {
						debug.info('Error accessing CAS login page: ' + textStatus + ', ' + errorThrown);
						onError(jqXHR, textStatus, errorThrown);
					}
				});
		};

		/**
		Method logs the current user out of the application and attempts
		to reauthenticate based upon the given credentials parameter.

		@method switchuser
		@param {Object} credentials Object hash containing user credentials.
		@param {Function} onSuccess Handler for successful operation.
		@param {Function} onError Handler for unsucssessful operation.
		**/
		umobile.auth.switchuser = function (credentials, onSuccess, onError) {
			console.log('Awesome debug Authentication.js - umobile.auth.switchuser');
			// Define.
			var logoutUrl = getLocalLogoutServletUrl();

			debug.info('Logging out via URL ' + logoutUrl);
			$.ajax({
					url: logoutUrl,
					success: function (html, textStatus, jqXHR) {
						umobile.auth[config.loginFn](credentials, onSuccess, onError);
					},
					error: function (jqXHR, textStatus, errorThrown) {
						debug.info('Error logging out: ' + textStatus + ', ' + errorThrown);
						onError(jqXHR, textStatus, errorThrown);
					},
					dataType: 'html',
					type: 'GET'
				});
		};

		/**
		Method logs the current user out of the application

		@method logout
		@param {Object} credentials Object hash containing user credentials.
		@param {Function} onSuccess Handler for successful operation.
		@param {Function} onError Handler for unsucssessful operation.
		**/
		umobile.auth.logout = function (credentials, onSuccess, onError) {
			console.log('Awesome debug Authentication.js - umobile.auth.logout');
			// Define.
			var logoutUrl = getLocalLogoutServletUrl();

			debug.info('Logging out via URL ' + logoutUrl);
			$.ajax({
					url: logoutUrl,
					success: function (html, textStatus, jqXHR) {},
					error: function (jqXHR, textStatus, errorThrown) {
						debug.info('Error logging out: ' + textStatus + ', ' + errorThrown);
						onError(jqXHR, textStatus, errorThrown);
					},
					dataType: 'html',
					type: 'GET'
				});
		};

	})(jQuery, _, umobile, config, debug);
