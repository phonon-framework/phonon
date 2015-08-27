	var readyCallbacks = [];

	/**
	 * Called when Phonon is ready
	 * Used in navigator.js
	 */
	phonon.onReady = function(callback) {
		readyCallbacks.push(callback);
	};

	/**
	 * Dispatches all the ready events
	 */
	phonon.dispatchGlobalReady = function() {
	    var i = readyCallbacks.length - 1;
	    for (; i >= 0; i--) {
	      readyCallbacks[i]();
	    }
	    
	    // Release memory
	    readyCallbacks = [];
	    phonon.dispatchGlobalReady = undefined;
	}