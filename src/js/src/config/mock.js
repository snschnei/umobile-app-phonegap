// Configuration object.
var config = {};

// BASE SERVER URL
// HTML5 testing url: http://localhost:5000
// Android: http://10.0.2.2:8080
// iOS: http://localhost:8080
config.uMobileServerUrl = 'http://localhost:5000';

// UMOBILE SERVER CONTEXT PATH
config.uMobileServerContext = '/data';

// AUTHENTICATION
// mockLogin, localLogin or casLogin.
config.loginFn = 'mockLogin';
config.encryptionKey = 'umobile';
config.casServerUrl = 'http://localhost:8080';

// LOCAL STORAGE.
config.storageFn = 'local';

// SESSION TIMEOUT.
// 600000 millseconds = 10 minutes.
config.sessionTimeout = '600000';

// LOCALLY HOSTED ICONS
// For uMobile modules. Keyed by module fname.
config.nativeIcons = {
	athletics: 'athletics.png',
	announcements: 'bullhorn.png',
	calendar: 'calendar.png',
	'computer-labs': 'computer_lab.png',
	courses: 'courses.png',
	dining: 'dining.png',
	directory: 'directory.png',
	laundry: 'laundry.png',
	library: 'library.png',
	map: 'map.png',
	news: 'feed.png',
	presentations: 'opencast.png',
	search: 'search.png',
	stats: 'stats.png',
	transit: 'transit.png',
	twitter: 'twitter.png',
	videos: 'youtube.png',
	weather: 'weather.png',
	info: 'default-icon.png'
};

// SUPPORTED Folders
// add folders and modules here if not part of uPortal
config.nativeFolders = {
    OtherServices: {
        title: 'Other Services',
        portlets: {
            directory: {
                title: 'Campus Directory',
                description: 'Oakland University Web Directory',
                iconUrl: 'images/icons/directory.png',
                url: 'http://www.oakland.edu/apps/mobile/directory/People.aspx?mobileapp=true'
            },
            
            admissions: {
                title: 'Undergraduate Admissions', 
                description: 'Undergraduate Admissions',
                iconUrl: 'images/icons/admissions.png',
                url:'http://www.oakland.edu/m/go?mobileapp=true'
            },
            
            links: {
                title: 'More Mobile Services',
                description: 'Links to sites outside of MySail',
                iconUrl: 'images/icons/links.png',
                url: 'http://www.oakland.edu/m/?mobileapp=true'
            }
        }
    }
};
