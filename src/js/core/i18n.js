/* ========================================================================
 * Phonon: i18n.js v0.2.1
 * http://phonon.quarkdev.com
 * ========================================================================
 * Licensed under MIT (http://phonon.quarkdev.com)
 * ======================================================================== */

;(function (window, document) {

    var jsonCache = null;

    var opts = {
        localeFallback: null,
        localePreferred: window.navigator.userLanguage || window.navigator.language,
        directory: './',
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
    * Binds some html to the given DOM element
    * @param {DOMObject} el
    * @param {String} text
    * @private
    */
    var setHtml = function (el, text){
        el.innerHTML = text;
    }

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
     * Reads data-i18n attributes and set JSON values 
     * @param {Array} elements
     * @param {JSON} json
     * @private
     */
    var computeNodes = function (elements, json) {

        var i = elements.length - 1;

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
                    } else if (key === 'html') {
                        setHtml(el, json[value]);
                    } else if (key === 'value') {
                        setValue(el, json[value]);
                    } else if (key === 'placeholder') {
                        setPlaceholder(el, json[value]);
                    } else {
                        throw new Error('The property: ' + key + ' is unknown');
                    }
                } else {
                    console.error('The value: ' + value + ' does not exist in the JSON file');
                }
            }
        }
    };


    /**
     * Public API
     */

    var api = {};

    /**
     * @param {Object} options
     * @public
     */
    function init(options) {
        if (opts.initCalled) {
            throw new Error('The i18n module has already been instantiated');
        }

        if(typeof options.directory === 'string') {
            options.directory = ( (options.directory.indexOf('/', options.directory.length - '/'.length) !== -1) ? options.directory : options.directory + '/');
        }

        var prop;
        for (prop in options) {
            opts[prop] = options[prop];
        }

        opts.initCalled = true;
    }
    api.init = init;

    /**
     * Reads JSON data
     * @param {Function} callback
     */
    function getAll(callback) {
        if (!opts.initCalled) {
            throw new Error('Please, initialize The i18n module using the init method');
        }
        if (typeof callback !== 'function') {
            throw new Error('callback must be a function');
        }

        if(jsonCache !== null) {
            callback(jsonCache);
            return;
        }

        var xhr = new XMLHttpRequest();

        var locale = opts.localePreferred ? opts.localePreferred : opts.localeFallback;

        xhr.open('GET', opts.directory + locale + '.json', true);
        if(xhr.overrideMimeType) xhr.overrideMimeType('application/json; charset=utf-8');

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {

                    jsonCache = JSON.parse(xhr.responseText);
                    callback(JSON.parse(xhr.responseText));

                } else {

                    if(opts.localePreferred) {

                        // The preferred locale is not available
                        opts.localePreferred = null;

                        console.log('The language [' + locale + '] is not available, loading ' + opts.localeFallback);

                        getAll(function (json) {
                            jsonCache = json;
                            callback(json);
                        });
                    } else {
                        throw new Error('The default locale ['+opts.directory+opts.localeFallback+'.json] file is not found');
                    }
                }
            }
        };
        xhr.send('');
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

        if(jsonCache !== null) {
            if(!isArray) {
                callback(jsonCache[key]);
            } else {

                var l = key.length, i = l - 1, obj = {};

                for (; i >= 0; i--) {
                    obj[key[i]] = jsonCache[key[i]];
                }
                callback(obj);
            }
            return;
        }

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

        var elements = element.querySelectorAll('[data-i18n]');

        if(jsonCache === null) {

            getAll(function (json) {

                computeNodes(elements, json);
                if (typeof callbackFunction === 'function') callbackFunction();
            });
        } else {
            computeNodes(elements, jsonCache);
            if (typeof callbackFunction === 'function') callbackFunction();
        }
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
        opts.localePreferred = preference;
        // reset the cache
        jsonCache = null;

        return api;
    }
    api.setPreference = setPreference;

    /**
     * Returns the preferred language
     * @return {String}
     */
    function getPreference() {
        return opts.localePreferred;
    }
    api.getPreference = getPreference;

    /**
     * Returns the browser language
     * @return {String}
     */
    function getLocale() {
        return window.navigator.userLanguage || window.navigator.language;
    }
    api.getLocale = getLocale;


    phonon.i18n = function (opts) {

        if(typeof opts === 'object') {
            init(opts);
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

}(window, document));
