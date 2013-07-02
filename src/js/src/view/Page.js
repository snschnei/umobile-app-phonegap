/*global window:true, _:true, Backbone:true, jQuery:true, umobile:true, config:true, Handlebars:true, console:true */
(function ($, _, Backbone, umobile, config) {
	'use strict';

	/**
	Responsible for rendering out a basic page layout,
	which consists of the header, content and footer.

	@class Page
	@submodule view
	@namespace view
	@constructor
	**/
	umobile.view.Page = umobile.view.Base.extend({
		/**
		Property houses the root DOM element.

		@property el
		@type Object
		@override Base
		**/
		el: '#page',

		/**
		Property houses DOM selectors.

		@property selectors
		@type Object
		@override Base
		**/
		selectors: {
			template: '#views-partials-page',
			header: '#header',
			breadcrumb: '#breadcrumb',
			footer: '#footer'
		},

		/**
		Method initializes the Header view.

		@method renderHeader
		**/
		renderHeader: function () {
            console.log("Awesome debug Page.js - renderHeader");
			// Define.
			var header, headerView;

			// Initialize.
			header = this.loc('header').html('');
			headerView = new umobile.view.Header();
			headerView.render();
		},

		/**
		Method initializes the Breadcrumb view.

		@method renderBreadcrumb
		**/
		renderBreadcrumb: function () {
            console.log("Awesome debug Page.js - renderBreadcrumb");
			// Define.
			var breadcrumb, breadcrumbView;

			// Initialize.
			breadcrumb = this.loc('breadcrumb').html('');
			breadcrumbView = new umobile.view.Breadcrumb();
			breadcrumbView.render();
		},

		/**
		Method initializes the Footer view.

		@method renderFooter
		**/
		renderFooter: function () {
            console.log("Awesome debug Page.js - renderFooter");
			// Define.
			var footer, footerView;

			// Initialize.
			footer = this.loc('footer').html('');
			footerView = new umobile.view.Footer();
			footerView.render();
		},

		/**
		Method renders header, content and footer.

		@method render
		@return {Object} Reference to the Page view.
		@override Base
		**/
		render: function () {
            console.log("Awesome debug Page.js - render");
			// Render base page.
			this.$el.html(this.template(this.options));

			// Render the header.
			this.renderHeader();

			// Render the breadcrumb.
			this.renderBreadcrumb();

			// Render the footer.
			this.renderFooter();

			return this;
		}
	});

})(jQuery, _, Backbone, umobile, config);
