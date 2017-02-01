phonon.browser = (function (platform) {

	/* Use of platform.js
	* https://github.com/bestiejs/platform.js
	* License: https://github.com/bestiejs/platform.js/blob/master/LICENSE
	*/
	return {
		name: platform.name,
		version: platform.version,
		platform: platform
	}
})(window.platform);
