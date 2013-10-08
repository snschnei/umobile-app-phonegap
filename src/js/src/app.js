/*global window:true, document:true, FastClick:true, navigator:true, FileTransfer:true, LocalFileSystem:true, $:true, _:true, umobile:true, config:true, Backbone:true, console:true */

/**
Main module for the umobile application. Namespaces
all source logic to the umobile namespace. Houses the
app, bootstrap, model, collection, view, logout, auth and storage
submodules.

@module umobile
@namespace umobile
@main umobile
**/
var umobile = {
	/**
	Namespace for running instances that are needed across the
	umobile application.

	@submodule app
	@namespace app
	**/
	app: {},

	/**
	Namespace for umobile model implementations.
	Houses the Credential, Module and State model
	implementations.

	@submodule model
	@namespace model
	**/
	model: {},

	/**
	Namespace for umobile collection implementations.
	Houses the Module collection implementation.

	@submodule collection
	@namespace collection
	**/
	collection: {},

	/**
	Namespace for umobile view implementations.
	Houses the App, Credential and Module view
	implementations.

	@submodule view
	@namespace view
	**/
	view: {},

	/**
	Namespace for umobile router implementation.

	@submodule router
	@namespace router
	**/
	router: {},

	/**
	Namespace for the umobile authentication implementation.

	@submodule auth
	@namespace auth
	**/
	auth: {},

	/**
	Namespace for the the logout service.

	@submodule logout
	@namespace logout
	**/
	logout: {},

	/**
	Namespace for the umobile storage implementation.

	@submodule storage
	@namespace storage
	**/
	storage: {},

	/**
	Namespace for the umobile session implementation.

	@submodule session
	@namespace session
	**/
	session: {},

	/**
	Namespace for the umobile resource implementation.
	@submodule resource
	@namespace resource
	**/
	resource: {},

	/**
	Namespace for umobile utilities.

	@submodule utility
	@namespace utility
	**/
	utility: {},

	/**
	Method parses the data received by the session.established event.
	Iterates over layout JSON and adds folders (i.e. tabs) to
	the folders array based upon the number of folders described
	by the JSON feed. The folders array is then returned.

	@method buildFolderArray
	@param {Object} data Object containing layout, folder and portlet information.
	@return {Array} modules Array of folder objects.
	**/
	buildFolderArray: function (data) {
		'use strict';
		// Define.
		var modules, folders, headers, folderList;

		// Initialize.
		modules = [];
		folderList = [];
		folders = (data && !_.isEmpty(data)) ? data.layout.folders : {};
		headers = (data && !_.isEmpty(data) && !_.isEmpty(data.layout.header)) ? data.layout.header.portlets : {};
		// Iterate over Headers
		// We need to iterate over the headers section of the JSON in order to get
		// the information for the background changer implementation
		_.each(headers, function (header, index) {
			if (header.hasOwnProperty('fname') && header.fname === 'background-preference') {
				umobile.resource.Background.getBackground(header.url);
			}
		});

		// Iterate over folders.
		_.each(folders, function (folder, idx) {
				var portlets = folder.portlets;

				// Iterate over portlets.
				_.each(portlets, function (portlet, idx) {
						portlet.id = portlet.fname;

						// Dynamically download Icon from the server
						// using the iconUrl from the JSON feed.

						function grabIcon() {
							var url = config.uMobileServerUrl + portlet.iconUrl; // url where the image can be found.
							window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, function (fs) {
									portlet.iconUrl = fs.root.fullPath + portlet.iconUrl;
									var fileTransfer = new FileTransfer();

									fileTransfer.download(
										url,
										portlet.iconUrl,
										function (entry) {
											console.log('downoad complete: ' + entry.fullPath);
										}, function (error) {
											console.log('download error source ' + error.source);
											console.log('download error target ' + error.target);
											console.log('upload error code ' + error.code);
										});
								});
						}

						// dowload the portlet icons
						grabIcon();
						
						portlet.url = config.uMobileServerUrl + portlet.url;
						portlet.isNative = false;

						// Define hasNewItem property based upon the newItemCount property.
						portlet.hasNewItem = (!Number(portlet.newItemCount)) ? false : true;

						// Truncate portlet title.
						portlet.fullTitle = portlet.title;
						portlet.title = umobile.utility.Utils.truncate(portlet.title);

					}, this);
				folderList.push(new umobile.model.Folder(folder));
			}, this);

		// add the modules that are not part of portal from the config file
		var folder = [];
		_.each(config.nativeFolders, function (nativeFolder, idx) {
				folder.title = nativeFolder.title;
				folder.portlets = nativeFolder.portlets;
				folderList.push(new umobile.model.Folder(nativeFolder));
			}, this);

		return folderList;
	},

	/**
	Method leverages the SessionTracker plugin to determine
	whether or not a valid session still exists.

	@method checkSession
	**/
	checkSession: function () {
		'use strict';
		umobile.session.SessionTracker.get(_.bind(function (time) {

					// Define.
					var now, lastSession, sessionTimeout;

					// Update the 'lastSessionAccess' property.
					if (time !== 0) {
						umobile.app.stateModel.save({
								lastSessionAccess: time
							});
					}

					// Determine if our session has expired.
					now = Number((new Date()).getTime());
					lastSession = Number(umobile.app.stateModel.get('lastSessionAccess'));
					sessionTimeout = Number(config.sessionTimeout);

					// When session exists, fetch modules from module collection.
					// When the session has expired, attempt to re-establish a session.
					if ((now - lastSession) < sessionTimeout) {
						umobile.app.folderCollection.fetch();
					} else {
						umobile.auth.establishSession();
					}
				}, this));
	},

	/**
	Method updates the State and Credential models. This
	interaction happens behind the scenes. For both models,
	the fetch method searches the storage implemenation for
	existing state. If found, the existing state is used to
	update the models. If not found, the default state of each
	model is preserved.

	@method updateAppState
	**/
	updateAppState: function () {
		'use strict';
		umobile.app.stateModel.fetch({
				success: _.bind(function (stateModel) {
						umobile.app.credModel.fetch({
								success: _.bind(function (credModel) {
										umobile.checkSession();
									}, this)
							});
					}, this)
			});
	},

	/**
	Initializes the router for the application.

	@method initRouter
	**/
	initRouter: function () {
		'use strict';
		umobile.app.router = new umobile.router.RouteManager();
		Backbone.history.start();
	},

	/**
	Method initializes the State and Credential models as well as
	the Module collection during the bootstrap phase.

	@method initModels
	**/
	initModels: function () {
		'use strict';
		umobile.app.stateModel = new umobile.model.State();
		umobile.app.credModel = new umobile.model.Credential();
		umobile.app.folderCollection = new umobile.collection.FolderCollection();
	},

	/**
	Method registers subscribed events.

	@method initEventListeners
	**/
	initEventListeners: function () {
		'use strict';

		// Subscribe to 'session.established' event.
		// When triggered, updates the State model and SessionTracker.
		$.subscribe('session.established', _.bind(function (data) {
					// Define.
					var folder;

					// Update credentials.
					umobile.app.credModel.save({
							username: data.user
						});

					// Update state.
					umobile.app.stateModel.save({
							lastSessionAccess: (new Date()).getTime(),
							authenticated: (umobile.app.credModel.get('username')) ? true : false
						});

					// Build module array.
					// Populate the collection with modules.
					folder = umobile.buildFolderArray(data);
					umobile.app.folderCollection.reset(folder);
					umobile.app.folderCollection.save();

					// Update time in the Session Tracker.
					umobile.session.SessionTracker.set(umobile.app.stateModel.get('lastSessionAccess'));

					// Redirect user to dashboard.
					umobile.app.router.navigate('dashboard', {
							trigger: true
						});
				}, this));

		// Subscribe to 'session.failure' event.
		$.subscribe('session.failure', _.bind(function () {
					umobile.app.folderCollection.reset({});

					// Direct users to the login screen.
					umobile.app.router.navigate('login', {
							trigger: true
						});
				}, this));
	},

	/**
	The deviceready event is a part of the PhoneGap API. This is a very important
	event that every PhoneGap application should use. PhoneGap consists of two code
	bases: native and JavaScript. While the native code is loading, a custom loading
	image is displayed. However, JavaScript is only loaded once the DOM loads. This
	means the application could, potentially, call a PhoneGap JavaScript function
	before it is loaded.

	The PhoneGap deviceready event fires once PhoneGap has fully loaded. After the
	device has fired, you can safely make calls to PhoneGap function.

	@method onDeviceReady
	**/
	onDeviceReady: function () {
		'use strict';

		// add listener for the back button
		document.addEventListener('backbutton', umobile.onBackKeyDown, false);

		umobile.initEventListeners();
		umobile.initModels();
		umobile.initRouter();
		umobile.updateAppState();
	},

	restart: function () {
		'use strict';
		Backbone.history.stop();
		umobile.onDeviceReady();
	},

	/**
	This function will listen for the backbutton press. If the backbutton is pressed
	while the user is viewing the dashboard then the app will close. Other wise it will
	go back in the page history.

	@method onBackKeyDown
	**/
	onBackKeyDown: function () {
		'use strict';
		// get the current view that the user is looking at.
		var currentPage = umobile.app.viewManager.getCurrentView().name;
		if (currentPage === 'dashboard') {
			navigator.app.exitApp();
		} else {
			navigator.app.backHistory();
		}
	},

	/**
	Entry point for the umobile application.
	Registers the PhoneGap deviceready event.

	@method initialize
	**/
	initialize: function () {
		'use strict';
		// Listen to onDeviceReady event.
		window.addEventListener('load', function () {
				FastClick.attach(document.body);
			}, false);
		document.addEventListener('deviceready', umobile.onDeviceReady, false);
		if (config.loginFn === 'mockLogin') {
			umobile.onDeviceReady();
		}
	}
};
