/**!
 * Плагин для реализации полноэкранного меню из существующего на старнице кода
 * @link https://github.com/pafnuty/SimpleMobileNav
 * @date 05.02.2015
 * @version 1.0.2
 * 
 */
(function ($, window, document) {
	'use strict';
	var pluginName = 'simpleMobileNav',
		previousResizeWidth = 0,
		$body,
		$window = $(window),
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
				$menuButon = this.$menuButon = $('<span class="hamburger"><span class="icon-hamburger"></span></span>'),
				$body = $('body');

			this._bodyOverflow = $body.css('overflow');

			// Hack to prevent mobile safari scrolling the whole body when nav is open
			// @todo: проверить на различных устройствах
			if (navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) {
				$nav.children().addClass('ios-fix');
			}

			$body.append($menuButon);

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

			var self = this;

			$body.toggleClass('no-scroll');
			var isNavOpen = $body.hasClass('no-scroll');

			$body
				.css({
					'overflow': isNavOpen ? 'hidden' : self._bodyOverflow,
					'width': isNavOpen ? $window.width() : ''
				});

			if (isNavOpen) {
				this.settings.beforeNavOpen.call(this.$menuButon, this.$nav);

				$(window).on('resize.' + pluginName + ' orientationchange.' + pluginName, function (event) {
					self.navResize(event);
				});
			}
			else {
				this.settings.beforeNavClose.call(this.$menuButon, this.$nav);

				$(window).off('resize.' + pluginName + ' orientationchange.' + pluginName);
			}

		},
		navResize: function (event) {
			if (event && (event.type === 'resize' || event.type === 'orientationchange')) {
				var windowWidth = $window.width();
				if (windowWidth === previousResizeWidth) {
					return;
				}
				$body.css('width', windowWidth);
				previousResizeWidth = windowWidth;
			}
		}

	});

	if (typeof $[pluginName] === 'undefined') {

		$[pluginName] = function (options) {
			return new Plugin(this, options);
		};

	}

}(jQuery, window, document));