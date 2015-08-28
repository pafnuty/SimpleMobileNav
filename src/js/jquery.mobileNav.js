/**!
 * Плагин для реализации полноэкранного меню из существующего на старнице кода
 * @link https://github.com/pafnuty/SimpleMobileNav
 * @date 28.08.2015
 * @version 0.0.1
 * 
 */
(function ($, window, document) {
	'use strict';
	var pluginName = 'simpleMobileNav',
		defaults = {
			// Селектор, указывающий на блок, из которого будут взяты пункты меню
			navBlock: '.nav',
			// Селектор, указывающий на блок, куда будут помещены пункты меню
			navContainer: '.mobile-nav',
			// Селектор, указывающий на блок, который и будет полноэкранным меню
			navWrapper: '.mobile-nav-wrapper',
			// Колбэки
			// Срабатывает при инициализации плагина
			onInit: function () {},
			// Срабатывает после открытия и закрытия меню
			onNavToggle: function () {},
			// Срабатывает при открытии меню
			beforeNavOpen: function () {},
			// Срабатывает при закрытии меню
			beforeNavClose: function () {}

		};

	function Plugin(obj, options) {
		this.settings = $.extend({}, defaults, options);
		this._defaults = defaults;
		this.init();
	}

	$.extend(Plugin.prototype, {

		init: function () {

			$(this.settings.navContainer).append($(this.settings.navBlock).clone());
			var self = this,
				$nav = this.$nav = $(this.settings.navWrapper),
				$menuButon = this.$menuButon = $('<span class="hamburger"><span class="icon-hamburger"></span></span>');

			this._bodyOverflow = $('body').css('overflow');

			// Hack to prevent mobile safari scrolling the whole body when nav is open
			// @todo: проверить на различных устройствах
			if (navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) {
				$nav.children().addClass('ios-fix');

			}

			$('body').append($menuButon);

			$().add($menuButon).add($nav.find('.hamburger')).on('click', function () {
				self.toggleNav();
			});
			this.settings.onInit.call($menuButon, $nav);

		},

		toggleNav: function () {

			var self = this;

			this.$nav.fadeToggle(400);

			self.toggleBodyOverflow();

			$().add(this.$menuButon).add(this.$nav).toggleClass('active');

			this.settings.onNavToggle.call(this.$menuButon, this.$nav);
		},

		toggleBodyOverflow: function () {

			var self = this,
				$body = $('body');

			$body.toggleClass('no-scroll');
			var isNavOpen = $body.hasClass('no-scroll');

			$body
				.css({
					'overflow': isNavOpen ? 'hidden' : self._bodyOverflow,
					'width': isNavOpen ? $body.width() : ''
				});

			if (isNavOpen) {
				this.settings.beforeNavOpen.call(this.$menuButon, this.$nav);
			} else {
				this.settings.beforeNavClose.call(this.$menuButon, this.$nav);
			}

		}

	});

	if (typeof $[pluginName] === 'undefined') {

		$[pluginName] = function (options) {
			return new Plugin(this, options);
		};

	}

}(jQuery, window, document));