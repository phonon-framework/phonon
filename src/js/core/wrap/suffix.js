	
	window.phonon = phonon

	if(typeof exports === 'object') {
		module.exports = phonon;
	} else if(typeof define === 'function' && define.amd) {
		define(function() { return window.phonon = phonon });
	}


}(typeof window !== 'undefined' ? window : this));