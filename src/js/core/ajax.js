phonon.ajax = (function () {
  /**
	* Creates the XMLHttpRequest Object
	* @param {boolean} useCrossDomain
	* @return {XMLHttpRequest | Null}
	* @private
	*/
  const createXhr = function (useCrossDomain) {
    let xhr = null;
    try {
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
  const toJSON = function (responseText) {
    let response = null;
    try {
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
  const objToString = function (data) {
    let strData = '?';
    let key;

    for (key in data) {
      strData += `${key}=${data[key]}&`;
    }

    const last = strData.lastIndexOf('&');
    if (last !== -1) {
      strData = strData.substring(0, last);
    }
    return strData;
  };

  /**
	* Executes an Ajax request
	* @param {Object} opts
	*/
  return function (opts) {
    const { method } = opts;
    let { url } = opts;
    const crossDomain = (typeof opts.crossDomain === 'boolean' ? opts.crossDomain : false);
    const { contentType } = opts;
    const { dataType } = opts;
    let { data } = opts;
    const { timeout } = opts;
    const { success } = opts;
    const { error } = opts;
    const { headers } = opts;

    if (typeof method !== 'string') throw new TypeError('method must be a string');
    if (typeof url !== 'string') throw new TypeError('url must be a string');
    // https://github.com/quark-dev/Phonon-Framework/issues/195#issuecomment-274266194
    if (typeof opts.contentType === 'undefined') opts.contentType = 'application/x-www-form-urlencoded; charset=UTF-8';

    let xhr = createXhr(crossDomain);
    let flagError = 'NO_INTERNET_ACCESS';

    if (typeof method === 'string' && method.toLowerCase().trim() === 'get'
			&& data !== null && typeof data === 'object') {
      url += objToString(data);
    }

    if (typeof data === 'object' && data !== null) data = JSON.stringify(data);

    if (xhr) {
      xhr.open(method, url, true);

      if (typeof contentType === 'string') {
        xhr.setRequestHeader('Content-type', contentType);
      }
      if (dataType === 'xml') {
        if (xhr.overrideMimeType) xhr.overrideMimeType('application/xml; charset=utf-8');
      }

      if (typeof headers === 'object') {
        let key;
        for (key in headers) {
          xhr.setRequestHeader(key, headers[key]);
        }
      }

      xhr.onreadystatechange = function (event) {
        if (xhr.readyState === 4) {
          let res = null;

          if (dataType === 'json') {
            res = toJSON(xhr.responseText);
            if (res === null) {
              flagError = 'JSON_MALFORMED';
            }
          } else if (dataType === 'xml') {
            res = xhr.responseXML;
          } else {
            res = xhr.responseText;
          }

          const status = xhr.status.toString();

          // Success 2xx
          if (status[0] === '2' && typeof success === 'function') {
            success(res, xhr);
          } else {
            // error
            if (typeof error === 'function') {
              window.setTimeout(() => {
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
    } else if (typeof error === 'function') {
      flagError = 'XMLHTTPREQUEST_UNAVAILABLE';
      error(flagError);
    }

    return {
      cancel() {
        flagError = 'REQUEST_CANCELED';
        if (xhr) xhr.abort();
      },
    };
  };
}());
