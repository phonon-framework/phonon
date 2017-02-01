phonon.device = (function (platform) {

	/* Use of platform.js
	* https://github.com/bestiejs/platform.js
	* License: https://github.com/bestiejs/platform.js/blob/master/LICENSE
	*/

	// device: append osVersion and os for backward compatibility
	return {
		osVersion: platform.os.version,
		os: platform.os.family,
		platform: platform,
		// Const
		ANDROID: 'Android',
		IOS: 'iOS'
	}

})(window.platform);
