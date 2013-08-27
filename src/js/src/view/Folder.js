/*global window:true, document:true, jQuery:true, _:true, umobile:true, config:true, Backbone:true, Handlebars:true, console:true */
(function ($, _, umobile, config) {
	'use strict';

	/**
	Manages the individual Folder or portlet view.

	@class Folder
	@subfolder view
	@namespace view
	@constructor
	**/
	umobile.view.Folder = umobile.view.Base.extend({
		/**
		Property houses HTML tag name used to build view.

		@property tagName
		@type String
		**/
		tagName: 'ul',

        id: 'abc',

		/**
		Property houses class name that is added to the tagName.

		@property className
		@type String
		**/
		className: 'um-folder-item',

        events: {
            'click': 'clicked'
        },

        clicked: function() {
            $('#'+this.id).find('li').toggle();
            console.log('clicked');
			$('html, body').animate({
				scrollTop : $('#'+this.id).position().top
			});
        },

		/**
		Property houses DOM selectors.

		@property selectors
		@type Object
		**/
		selectors: {
			template: '#views-partials-folder'
		}
	});

})(jQuery, _, umobile, config);
