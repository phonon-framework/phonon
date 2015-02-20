/* ========================================================================
* Phonon: i18n.js v0.2.1
* http://phonon.quarkdev.com
* ========================================================================
* Licensed under MIT (http://phonon.quarkdev.com)
* ======================================================================== */
;(function (window, document, Phonon, undefined) {

    'use strict';

    var _options = {
        defaultLocale: 'en',
        preferredLocale: null,
        locale: undefined,
        directory: '/',
        initCalled: false
    };

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
     * Sets the locale language
     * @private
    */
    function setLocale() {
        var locale = window.navigator.userLanguage || window.navigator.language;
        if (locale.length > 2) {
            locale = locale.substring(0, 2);
        }
        _options.locale = locale;
    }


    /**
    * Public API
    */

    var api = {};

    /**
     * @param {Object} options
     * @public
    */
    function init(options) {
        if (_options.initCalled) {
            throw new Error('Linguistic has already been instantiated');
        }

        if(typeof options.directory === 'string') {
            options.directory = ( (options.directory.indexOf('/', options.directory.length - '/'.length) !== -1) ? options.directory : options.directory + '/');
        }

        setLocale();

        var prop;
        for (prop in options) {
            _options[prop] = options[prop];
        }

        _options.initCalled = true;
    }
    api.init = init;

    /**
     * Reads JSON data
     * @param {Function} callback
    */
    function getAll(callback) {
        if (!_options.initCalled) {
            throw new Error('Please, initialize Linguistic using the init method');
        }
        if (typeof callback !== 'function') {
            throw new Error('callback must be a function');
        }

        var xhr = new XMLHttpRequest();

        var locale = _options.preferredLocale ? _options.preferredLocale : _options.defaultLocale;

        xhr.open('GET', _options.directory + locale + '.json', true);
        xhr.overrideMimeType('application/json; charset=utf-8');

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    // Success
                    callback(JSON.parse(xhr.responseText));
                } else {

                    // An error occured

                    if(_options.preferredLocale) {

                        // The preferredLocale is not found
                        _options.preferredLocale = null;

                        console.log('The language [' + locale + '] is not available, loading ' + _options.defaultLocale);

                        getAll(function (json) {
                            callback(json);
                        });
                    } else {
                        throw new Error('The default locale ['+_options.directory+_options.defaultLocale+'.json] file is not found');
                    }
                }
            }
        };
        xhr.send();
    }
    api.getAll = getAll;

    /**
     * Gets a value in the JSON file with a key or many keys (array)
     * @param {String | Array} key
     * @param {Function} callback
    */
    function get(key, callback) {
        if (typeof key !== 'string' && !(key instanceof Array)) {
            throw new Error('key must be a string or an array');
        }

        var isArray = (key instanceof Array ? true : false);

        getAll(function(json) {
            if(!isArray) {
                callback(json[key]);
            } else {

                var l = key.length, i = l - 1, obj = {};

                for (; i >= 0; i--) {
                    obj[key[i]] = json[key[i]];
                }
                callback(obj);
            }
        });
    }
    api.get = get;

    /**
     * Binds the HTML Object with JSON data
     * @param {DOMObject} el (optional) if el is not set, the document will be binded
     * @param {Function} callback (optional)
    */
    function bind(el, callback) {
        var element = el || document;
        var callbackFunction = callback;

        if (arguments.length === 1) {
            if (typeof el === 'function') {
                element = document;
                callbackFunction = el;
            }
        }

        if (!isElement(element)) {
            throw new TypeError('Not valid element object ' + element);
        }

        var elements = element.querySelectorAll('[data-i18n]'), l = elements.length, i = l - 1;

        getAll(function (json) {

            var res = { status: 'success' };

            for (; i >= 0; i--) {
                var el = elements[i];
                var data = el.getAttribute('data-i18n').trim();
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

            if (typeof callbackFunction === 'function') {
                callbackFunction(res);
            }
        });
    }
    api.bind = bind;

    /**
     * Sets the preferred language
     * @param {String} l the new language
    */
    function setPreference(preference) {
        if (typeof preference !== 'string') {
            throw new Error('The language must be a string');
        }
        if (preference.length > 2) {
            preference = preference.substring(0, 2);
        }
        _options.preferredLocale = preference.toLowerCase();
    }
    api.setPreference = setPreference;

    /**
     * Returns the preferred language
     * @return {String}
    */
    function getPreference() {
        return _options.preferredLocale;
    }
    api.getPreference = getPreference;

    /**
     * Returns the browser language
     * @return {String}
    */
    function getLocale() {
        return _options.locale;
    }
    api.getLocale = getLocale;


    Phonon.i18n = function (options) {

        if(typeof options === 'object') {
            init(options);
        }

        return {
            getAll: function (callback) {
                getAll(callback);
                return this;
            },
            get: function (key, callback) {
                get(key, callback);
                return this;
            },
            bind: function (el, callback) {
                bind(el, callback);
                return this;
            },
            setPreference: function (preference) {
                setPreference(preference);
                return this;
            },
            getPreference: function () {
                return getPreference();
            },
            getLocale: function () {
                return getLocale();
            }
        };
    };
    window.Phonon = Phonon;

    if (typeof define === 'function' && define.amd) {
        define(function () {
            if(Phonon.returnGlobalNamespace === true) {
                return Phonon;
            } else {
                return Phonon.i18n;
            }
        });
    } else if (typeof module === 'object' && module.exports) {
        if(Phonon.returnGlobalNamespace === true) {
            module.exports = Phonon;
        } else {
            module.exports = Phonon.i18n;
        }
    }

}(window, document, window.Phonon || {}));