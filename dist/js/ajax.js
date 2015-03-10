"use strict";

;(function (window, document, Phonon) {

    /**
     * @constructor
     * @param {Object} config (baseUrl, timeout, dataType, crossDomain (optional))
    */
    function Ajax(config) {
        if (typeof config.baseUrl !== "string") {
            throw new Error("baseUrl must be a string");
        }
        if (typeof config.timeout !== "undefined" && typeof config.timeout !== "number") {
            throw new Error("timeout must be a number (duration)");
        }
        if (typeof config.dataType !== "string") {
            throw new Error("dataType must be a string");
        }
        if (typeof config.crossDomain !== "undefined" && typeof config.crossDomain !== "boolean") {
            throw new Error("crossDomain must be a boolean or undefined");
        }
        this.baseUrl = config.baseUrl;
        this.timeout = config.timeout ? config.timeout : null;
        this.dataType = config.dataType.toLowerCase();
        this.crossDomain = config.crossDomain ? true : false;
        this.currentXhr = null;
    }
    /**
     * Creates the XMLHttpRequest Object
     * @return {XMLHttpRequest}
     * @private
    */
    Ajax.prototype.createXhr = function () {
        var xhr = null;
        try {
            xhr = new XMLHttpRequest();
            if ("withCredentials" in xhr && this.crossDomain) {
                xhr.withCredentials = true;
            }
        } catch (e) {
            console.error(e);
        }
        return xhr;
    };

    /**
     * Returns the XMLHttpRequest Object
     * @return {XMLHttpRequest}
    */
    Ajax.prototype.getXhr = function () {
        return this.currentXhr;
    };

    /**
     * Starts the request
     * Fix: http://stackoverflow.com/questions/3781387/responsexml-always-null
     * @param {String} method
     * @param {String} url
     * @param {String} data
     * @param {Function} successCallback
     * @param {Function} errorCallback
     * @return {XMLHttpRequest}
     * @private
    */
    Ajax.prototype.send = function (method, url, data, successCallback, errorCallback) {
        if (typeof method !== "string") {
            throw new Error("method must be a string");
        }
        if (typeof url !== "string") {
            throw new Error("url must be a string");
        }
        if (typeof data !== "string" && typeof data !== "object") {
            throw new Error("data must be a string or null");
        }
        if (typeof successCallback !== "function") {
            throw new Error("successCallback must be a function");
        }

        this.currentXhr = this.createXhr();

        var self = this;

        if (this.currentXhr) {

            self.currentXhr.open(method, this.baseUrl + url, true);

            if (self.dataType === "xml") {
                self.currentXhr.overrideMimeType("application/xml");
            }

            self.currentXhr.onreadystatechange = function (event) {
                if (self.currentXhr.readyState === 4) {
                    if (self.currentXhr.status === 200) {
                        // Success

                        if (self.dataType === "json") {
                            var json = self.toJSON(self.currentXhr.responseText);
                            if (json !== "JSON_MALFORMED") {
                                successCallback(json);
                            } else {
                                if (typeof errorCallback === "function") {
                                    errorCallback(json, event);
                                }
                            }
                        } else if (self.dataType === "xml") {
                            successCallback(self.currentXhr.responseXML);
                        } else {
                            successCallback(self.currentXhr.responseText);
                        }
                    } else {
                        // An error has occured
                        if (typeof errorCallback === "function") {
                            errorCallback("NO_INTERNET_ACCESS", event);
                        }
                    }

                    self.currentXhr = null;
                }
            };

            if (self.timeout) {
                self.currentXhr.timeout = self.timeout;
                self.currentXhr.ontimeout = function () {
                    if (typeof errorCallback === "function") {
                        errorCallback("TIMEOUT_EXCEEDED");
                    }
                };
            }
            self.currentXhr.send(data);
        } else {
            if (typeof errorCallback === "function") {
                errorCallback("XMLHTTPREQUEST_UNAVAILABLE");
            }
        }
    };

    /**
     * Parses the API response in JSON
     * @param {String} responseText
     * @return {JSONObject}
     * @private
    */
    Ajax.prototype.toJSON = function (responseText) {
        var response;
        try {
            response = JSON.parse(responseText);
        } catch (e) {
            response = "JSON_MALFORMED";
        }
        return response;
    };

    /**
     * Public API
    */

    /**
     * GET Method
     * @param {String} url
     * @param {String} data
     * @param {Function} successCallback
     * @param {Function} errorCallback (optional)
     * @public
    */
    Ajax.prototype.get = function (url, data, successCallback, errorCallback) {
        this.send("get", url, data, successCallback, errorCallback);
    };

    /**
     * POST Method
     * @param {String} url
     * @param {String} data
     * @param {Function} successCallback
     * @param {Function} errorCallback (optional)
     * @public
    */
    Ajax.prototype.post = function (url, data, successCallback, errorCallback) {
        this.send("post", url, data, successCallback, errorCallback);
    };

    /**
     * PUT Method
     * @param {String} url
     * @param {String} data
     * @param {Function} successCallback
     * @param {Function} errorCallback (optional)
     * @public
    */
    Ajax.prototype.put = function (url, data, successCallback, errorCallback) {
        this.send("put", url, data, successCallback, errorCallback);
    };

    /**
     * DELETE Method
     * @param {String} url
     * @param {String} data
     * @param {Function} successCallback
     * @param {Function} errorCallback (optional)
     * @public
    */
    Ajax.prototype.del = function (url, data, successCallback, errorCallback) {
        this.send("delete", url, data, successCallback, errorCallback);
    };

    /**
     * Cancels the current request
     * @public
    */
    Ajax.prototype.cancel = function () {
        if (this.currentXhr) {
            this.currentXhr.abort();
        }
    };

    Phonon.Ajax = Ajax;
    window.Phonon = Phonon;

    if (typeof define === "function" && define.amd) {
        define(function () {
            if (Phonon.returnGlobalNamespace === true) {
                return Phonon;
            } else {
                return Phonon.Ajax;
            }
        });
    } else if (typeof module === "object" && module.exports) {
        if (Phonon.returnGlobalNamespace === true) {
            module.exports = Phonon;
        } else {
            module.exports = Phonon.Ajax;
        }
    }
})(window, document, window.Phonon || {});
/* ========================================================================
* Phonon: ajax.js v0.1.8
* http://phonon.quarkdev.com
* ========================================================================
* Licensed under MIT (http://phonon.quarkdev.com)
* ======================================================================== */