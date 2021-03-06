/*global window:true, _:true, document:true, jQuery:true, umobile:true, config:true, cordova:true, console:true */
(function ($, _, umobile, config) {
		'use strict';

		/**
		The Logout class ends the users Cas
		sesson and reloads the dashboard
		with the guest layout

		@class Logout
		@submodule logout
		@namespace logout
		**/
		umobile.logout.Logout = {

			/**
			method used to log user out of CAS, pull down guest layout and display the dashboard
			@method logout
			**/
			logout: function () {
				console.log('Logout was called properly');
				umobile.auth.logout(); // do an ajax call to remove cas ticket
				umobile.app.credModel.set('username', 'guest'); // make the username guest so toggle icons switches back to default icons
				umobile.app.credModel.deleteCredentials();

				// pull default JSON feed and display it
				$.ajax({
						url: config.uMobileServerUrl + config.uMobileServerContext + '/layout.json',
						success: function (data, textStatus, jqXHR) {
							var folders = umobile.buildFolderArray(data);
							umobile.app.folderCollection.reset(folders);
							umobile.app.folderCollection.save();
							umobile.app.viewManager.show(new umobile.view.DashboardView());
						},
						error: function (jqXHR, textStatus, errorThrown) {
							console.log('Error Getting guest feed' + jqXHR + ' ' + textStatus + ' ' +  errorThrown);
						}
					});
			}
		};

	})(jQuery, _, umobile, config);
