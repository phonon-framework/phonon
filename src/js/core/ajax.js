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
        var response;
        try  {
            response = JSON.parse(responseText);
        } catch (e) {
            response = 'JSON_MALFORMED';
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

        if(typeof method !== 'string') throw new TypeError('method must be a string');
        if(typeof url !== 'string') throw new TypeError('url must be a string');
        if(typeof data === 'object') data = objToString(data);
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

            xhr.onreadystatechange = function(event) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        // Success

                        if(dataType === 'json') {
                            var json = toJSON(xhr.responseText);
                            if(json !== 'JSON_MALFORMED') success(json);
                            else {
                                if (typeof error === 'function') error(json, event);
                            }
                        } else if(dataType === 'xml') success(xhr.responseXML);
                        else success(xhr.responseText);

                    } else {
                        // page not found (error: 404)
                        if (typeof error === 'function') {
                            window.setTimeout(function() {
                                error(flagError, event);
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