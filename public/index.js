(function () {
	"use strict";

	function locationHashChanged() {}

	function resize(e) {}

	window.addEventListener('DOMContentLoaded', function () {
		window.onhashchange = locationHashChanged;
		window.addEventListener('resize', resize, false);
		resize(null);
	}, false);

});
