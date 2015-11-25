phonon.ajax = (function () {

	/**
	 * Creates the XMLHttpRequest Object
	 * @param {boolean} useCrossDomain
	 * @return {XMLHttpRequest | Null}
	 * @private
	 */
	var createXhr = function (useCrossDomain) {
		var xhr = null;
		try  {
			xhr = new XMLHttpRequest();
			if ('withCredentials' in xhr && useCrossDomain) {
				xhr.withCredentials = true;
			}
		} catch (e) {
			console.error(e);
		}

		return xhr;
	};

    /**
     * Parses the API response in JSON format
     * @param {String} responseText
     * @return {JSONObject}
     * @private
     */
    var toJSON = function(responseText) {
        var response = null;
        try  {
            response = JSON.parse(responseText);
        } catch (e) {
            response = null;
        }
        return response;
    };

    /**
     * Transforms an object to a string
     * @param {Object} data
     */
    var objToString = function(data) {
		var strData = '';
		var key;

		for(key in data) {
			strData += key + '=' + data[key] + '&';
		}

		var last = strData.lastIndexOf('&');
		if(last !== -1) {
			data = strData.substring(0, last);
		}
		return strData;
    };

    /**
     * Executes an Ajax request
     * @param {Object} opts
     */
	return function(opts) {

		var method = opts.method;
		var url = opts.url;
		var crossDomain = (typeof opts.crossDomain === 'boolean' ? opts.crossDomain : false);
		var contentType = opts.contentType;
		var dataType = opts.dataType;
		var data = opts.data;
		var timeout = opts.timeout;
		var success = opts.success;
		var error = opts.error;
		var headers = opts.headers;

        if(typeof method !== 'string') throw new TypeError('method must be a string');
        if(typeof url !== 'string') throw new TypeError('url must be a string');
        if(typeof data === 'object') data = contentType==="application/json"?JSON.stringify(data):objToString(data);
        if(typeof success !== 'function') throw new TypeError('success must be a function');

        var xhr = createXhr(crossDomain);
        var flagError = 'NO_INTERNET_ACCESS';

        if(xhr) {

            xhr.open(method, url, true);

            if(typeof contentType === 'string') {
            	xhr.setRequestHeader('Content-type', contentType);
            }
            if(dataType === 'xml') {
                if(xhr.overrideMimeType) xhr.overrideMimeType('application/xml; charset=utf-8');
            }

						if(typeof headers === 'object') {
							var key;
							for(key in headers) {
								xhr.setRequestHeader(key, headers[key]);
							}
						}

            xhr.onreadystatechange = function(event) {

                if (xhr.readyState === 4) {

										var res = null;

										if(dataType === 'json') {
											res = toJSON(xhr.responseText);
											if(res === null) {
												flagError = 'JSON_MALFORMED';
											}
										} else if(dataType === 'xml') {
											res = xhr.responseXML;
										} else {
											res = xhr.responseText;
										}

										var status = xhr.status.toString();

										// Success 2xx
                    if (status[0] === '2') {

											success(res, xhr);

                    } else {

                        // error
                        if (typeof error === 'function') {
                            window.setTimeout(function() {
                                error(res, flagError, xhr);
                            }, 1);
                        }
                    }

                    xhr = null;
                }
            };

            if (typeof timeout === 'number') {
                xhr.timeout = timeout;
                xhr.ontimeout = function () {
                    flagError = 'TIMEOUT_EXCEEDED';
                };
            }
            xhr.send(data);

        } else {
            if (typeof error === 'function') {
                flagError = 'XMLHTTPREQUEST_UNAVAILABLE';
                error(flagError);
            }
        }

        return {
        	cancel: function() {
        		flagError = 'REQUEST_CANCELED';
        		if(xhr) xhr.abort();
        	}
        };
	};
})();
