/* ========================================================================
* Phonon: linguistic.js v0.1.5
* http://phonon.quarkdev.com
* ========================================================================
* Licensed under MIT (http://phonon.quarkdev.com)
* ======================================================================== */
(function (window, document) {

    'use strict';

    var path, browserLanguage, defaultLanguage, preferredLanguage = null, initCalled = false, invalidLanguage = false;

    /**
     * Checks if the given argument is a DOM element
     * @param {DOMObject} o the argument to test
     * @return true if the object is a DOM element, false otherwise
     * @private
    */
    var isElement = function (o) {
        return (typeof Node === 'object' ? o instanceof Node : o && typeof o === 'object' && typeof o.nodeType === 'number' && typeof o.nodeName === 'string');
    };

    /**
     * Binds some text to the given DOM element
     * @param {DOMObject} el
     * @param {String} text
     * @private
    */
    var setText = function (el, text) {
        if(!('textContent' in el)) {
            el.innerText = text;
        } else {
            el.textContent = text;
        }
    };

    /**
     * Binds the value to the given DOM element
     * @param {DOMObject} el
     * @param {String} text
     * @private
    */
    var setValue = function (el, text) {
        el.value = text;
    };

    /**
     * Binds the placeholder to the given DOM element
     * @param {DOMObject} el
     * @param {String} text
     * @private
    */
    var setPlaceholder = function (el, text) {
        el.setAttribute('placeholder', text);
    };

    /**
     * Sets the browser language
     * @param {String} l the new language
    */
    function setBrowserLanguage(l) {
        if (typeof l !== 'string') {
            throw new Error('The language must be a string');
        }
        if (l.length > 2) {
            l = l.substring(0, 2);
        }
        browserLanguage = l.toLowerCase();
    }


    /**
    * Public API
    */

    var api = {};

    /**
     * @param {String} p the path where the JSON files are stored
     * @param {String} dl the default language if the browser's language is not available
     * @param {String} pl (optional) the preferred language.
     * If set, it will override the default language's browser when retrieving data
     * @public
    */
    function init(p, dl, pl) {
        if (initCalled) {
            throw new Error('Linguistic has already been instantiated');
        }

        if (typeof p !== 'string') {
            throw new Error('The path where JSON files are stored is missing');
        }
        if (typeof dl !== 'string') {
            throw new Error('The default language is missing');
        }

        // Add slash at then end of the path if necessary
        var endsWith = p.indexOf('/', p.length - '/'.length) !== -1;
        if (!endsWith) {
            p = p + '/';
        }
        path = p;

        setBrowserLanguage(window.navigator.userLanguage || window.navigator.language);

        if (pl !== undefined) {
            setPreferredLanguage(pl);
        }

        setDefaultLanguage(dl);
        initCalled = true;
    }
    api.init = init;

    /**
     * Reads JSON data
     * @param {Function} callback
    */
    function getData(callback) {
        if (!initCalled) {
            throw new Error('Please, initialize Linguistic using the init method');
        }
        if (typeof callback !== 'function') {
            throw new Error('callback must be a function');
        }

        var xhr = new XMLHttpRequest();

        var useLang = (getPreferredLanguage() === null ? getBrowserLanguage() : getPreferredLanguage());

        if (invalidLanguage) {
            useLang = getDefaultLanguage();
        }

        xhr.open('GET', path + useLang + '.json', true);
        xhr.overrideMimeType('application/json; charset=utf-8');

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    // Success
                    callback(JSON.parse(xhr.responseText));
                } else {
                    // An error occured, set the default language
                    console.log('The language [' + useLang + '] is not available');

                    if (!invalidLanguage) {
                        invalidLanguage = true;
                        getData(function (json) {
                            callback(json);
                        });
                    } else {
                        console.error('JSON file not found for the language: ' + useLang);
                    }
                }
            }
        };
        xhr.send();
    }
    api.getData = getData;

    /**
     * Binds the HTML Object with JSON data
     * @param {DOMObject} el (optional) if el is not set, the document will be binded
     * @param {Function} callback (optional)
    */
    function draw(el, callback) {
        var element = el || document;
        var callbackFunction = callback;

        if (arguments.length === 1) {
            if (typeof el === 'function') {
                element = document;
                callbackFunction = el;
            }
        }

        try  {
            if (!isElement(element)) {
                throw new TypeError('Not valid element object ' + element);
            }

            var elements = element.querySelectorAll('[data-linguistic]'), l = elements.length, i;

            getData(function (json) {
                var res = { status: 'success' };

                for (i = l - 1; i >= 0; i--) {
                    var el = elements[i];
                    var data = el.getAttribute('data-linguistic').trim();
                    var r = /(?:\s|^)(\w+):\s*(.*?)(?=\s+\w+:|$)/g, m;

                    while (m = r.exec(data)) {
                        var key = m[1].trim();
                        var value = m[2].trim().replace(',', '');

                        if (json[value] !== undefined) {
                            if (key === 'text') {
                                setText(el, json[value]);
                            } else if (key === 'value') {
                                setValue(el, json[value]);
                            } else if (key === 'placeholder') {
                                setPlaceholder(el, json[value]);
                            } else {
                                throw new Error('The property: ' + key + ' is unknown');
                            }
                        } else {
                            var msg = 'The value: ' + value + ' does not exist in the JSON file';
                            console.error(msg);
                            res = { status: 'error', message: msg };
                        }
                    }
                }
                if (callbackFunction !== undefined)
                    callbackFunction(res);
            });
        } catch (e) {
            if (callbackFunction !== undefined)
                callbackFunction({ status: 'error', message: e.message });
        }
    }
    api.draw = draw;

    /**
     * Sets the preferred language
     * @param {String} l the new language
    */
    function setPreferredLanguage(l) {
        if (typeof l !== 'string') {
            throw new Error('The language must be a string');
        }
        if (l.length > 2) {
            l = l.substring(0, 2);
        }
        preferredLanguage = l.toLowerCase();
    }
    api.setPreferredLanguage = setPreferredLanguage;

    /**
     * Returns the preferred language
     * @return {String}
    */
    function getPreferredLanguage() {
        return preferredLanguage;
    }
    api.getPreferredLanguage = getPreferredLanguage;

    /**
     * Returns the browser language
     * @return {String}
    */
    function getBrowserLanguage() {
        return browserLanguage;
    }
    api.getBrowserLanguage = getBrowserLanguage;

    /**
     * Sets the defaults language
     * @param {String} dl the language
    */
    function setDefaultLanguage(dl) {
        if (typeof dl !== 'string') {
            throw new Error('The language must be a string');
        }
        if (dl.length > 2) {
            dl = dl.substring(0, 2);
        }
        defaultLanguage = dl.toLowerCase();
    }
    api.setDefaultLanguage = setDefaultLanguage;

    /**
     * Returns the default language
     * @return {String}
    */
    function getDefaultLanguage() {
        return defaultLanguage;
    }
    api.getDefaultLanguage = getDefaultLanguage;

    // Expose the Router either via AMD, CommonJS or the global object
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return api;
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = api;
    } else {
        if(window.Phonon === undefined) {
            window.Phonon = {};
        }
        window.Phonon.Linguistic = api;
    }

}(window, document));