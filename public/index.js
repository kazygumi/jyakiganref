(function () {
	'use strict';

	function locationHashChanged() {}

	function resize(_e) {}

	window.addEventListener('DOMContentLoaded', () => {
		window.onhashchange = locationHashChanged;
		window.addEventListener('resize', resize, false);
		resize(null);
	}, false);
}());
