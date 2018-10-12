/**
 * @Author: harsha
 * @Date:   2018-10-06T20:37:26+05:30
 * @Last modified by:   harsha
 * @Last modified time: 2018-10-07T17:02:50+05:30
 */

/**
 * Анимация обводки при скролле
 */
// $('.menu .item').tab();

(function(window, document, undefined) {
	/**
	 * переменные
	 */
	var maxS; // для хранения макс. возможной прокрутки

	var getViewportH = function() {
		return Math.max(
			document.documentElement.clientHeight,
			window.innerHeight || 0
		);
	};

	var getScrollY = function(container) {
		return (
			(container && container.scrollTop) ||
			window.pageYOffset ||
			document.documentElement.scrollTop ||
			document.body.scrollTop
		);
	};

	var getDocumentHeight = function() {
		return Math.max(
			document.body.scrollHeight,
			document.documentElement.scrollHeight,
			document.body.offsetHeight,
			document.documentElement.offsetHeight,
			document.body.clientHeight,
			document.documentElement.clientHeight
		);
	};

	var getMaxScroll = function() {
		return getDocumentHeight() - getViewportH();
	};

	var getScrollPercentage = function() {
		return getScrollY() / maxS;
	};

	var setMaxScroll = function() {
		return (maxS = getMaxScroll());
	};

	var extend = function(a, b) {
		var key;
		for (key in b) {
			if (b.hasOwnProperty(key)) {
				a[key] = b[key];
			}
		}
		return a;
	};

	/**
	 * Функция-конструктор
	 */
	function DrawSVGOnScroll(options) {
		this.options = extend({}, this.defaults);
		extend(this.options, options);
		this.init();
	}

	DrawSVGOnScroll.prototype.defaults = {
		elems: [],
		beforeFn: function() {},
		afterFn: function() {}
	};

	DrawSVGOnScroll.prototype.init = function() {
		setMaxScroll();

		var self = this,
			elems = self.options.elems,
			elemCount = elems.length,
			lens = new Array(elemCount);

		elems.forEach(function(item, index, arr) {
			var pathLength = item.getTotalLength();
			lens[index] = pathLength;
			item.style.strokeDasharray = pathLength + ' ' + pathLength;
			item.style.strokeDashoffset = pathLength;
			item.getBoundingClientRect();
		});

		window.addEventListener('scroll', function(e) {
			var scrollPercentage = getScrollPercentage(),
				index;

			for (index = 0; index < elemCount; index += 1) {
				var pathLength = lens[index],
					drawLength = lens[index] * scrollPercentage,
					elem = elems[index];

				self.options.afterFn(elem, index, scrollPercentage);
				elem.style.strokeDashoffset = pathLength - drawLength;
				if (scrollPercentage >= 0.99) {
					elem.style.strokeDasharray = 'none';
				} else {
					elem.style.strokeDasharray = pathLength + ' ' + pathLength;
				}
			}
		});

		window.addEventListener('resize', function() {
			setMaxScroll();
		});
	};

	window.DrawSVGOnScroll = DrawSVGOnScroll;
})(window, document);

/**
 * Вспомогательные  функции
 */
var $ = function(selector, context) {
	return (context || document).querySelector(selector) || null;
};
var $$ = function(selector, context) {
	return (
		Array.prototype.slice.call(
			(context || document).querySelectorAll(selector)
		) || null
	);
};

document.addEventListener('DOMContentLoaded', function() {
	var drawer = new DrawSVGOnScroll({
		elems: $$('.logo path'),
		afterFn: function(elem, index, scrollPercentage) {
			if (scrollPercentage > 0.99) {
				elem.style.fillOpacity = '1';
				elem.style.strokeOpacity = '0';
			} else {
				elem.style.fillOpacity = '';
				elem.style.strokeOpacity = '';
			}
		}
	});
});
