(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
/*!
 * Platform.js <https://mths.be/platform>
 * Copyright 2014-2016 Benjamin Tan <https://demoneaux.github.io/>
 * Copyright 2011-2013 John-David Dalton <http://allyoucanleet.com/>
 * Available under MIT license <https://mths.be/mit>
 */
;(function() {
  'use strict';

  /** Used to determine if values are of the language type `Object`. */
  var objectTypes = {
    'function': true,
    'object': true
  };

  /** Used as a reference to the global object. */
  var root = (objectTypes[typeof window] && window) || this;

  /** Backup possible global object. */
  var oldRoot = root;

  /** Detect free variable `exports`. */
  var freeExports = objectTypes[typeof exports] && exports;

  /** Detect free variable `module`. */
  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

  /** Detect free variable `global` from Node.js or Browserified code and use it as `root`. */
  var freeGlobal = freeExports && freeModule && typeof global == 'object' && global;
  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal)) {
    root = freeGlobal;
  }

  /**
   * Used as the maximum length of an array-like object.
   * See the [ES6 spec](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength)
   * for more details.
   */
  var maxSafeInteger = Math.pow(2, 53) - 1;

  /** Regular expression to detect Opera. */
  var reOpera = /\bOpera/;

  /** Possible global object. */
  var thisBinding = this;

  /** Used for native method references. */
  var objectProto = Object.prototype;

  /** Used to check for own properties of an object. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /** Used to resolve the internal `[[Class]]` of values. */
  var toString = objectProto.toString;

  /*--------------------------------------------------------------------------*/

  /**
   * Capitalizes a string value.
   *
   * @private
   * @param {string} string The string to capitalize.
   * @returns {string} The capitalized string.
   */
  function capitalize(string) {
    string = String(string);
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  /**
   * A utility function to clean up the OS name.
   *
   * @private
   * @param {string} os The OS name to clean up.
   * @param {string} [pattern] A `RegExp` pattern matching the OS name.
   * @param {string} [label] A label for the OS.
   */
  function cleanupOS(os, pattern, label) {
    // Platform tokens are defined at:
    // http://msdn.microsoft.com/en-us/library/ms537503(VS.85).aspx
    // http://web.archive.org/web/20081122053950/http://msdn.microsoft.com/en-us/library/ms537503(VS.85).aspx
    var data = {
      '10.0': '10',
      '6.4':  '10 Technical Preview',
      '6.3':  '8.1',
      '6.2':  '8',
      '6.1':  'Server 2008 R2 / 7',
      '6.0':  'Server 2008 / Vista',
      '5.2':  'Server 2003 / XP 64-bit',
      '5.1':  'XP',
      '5.01': '2000 SP1',
      '5.0':  '2000',
      '4.0':  'NT',
      '4.90': 'ME'
    };
    // Detect Windows version from platform tokens.
    if (pattern && label && /^Win/i.test(os) && !/^Windows Phone /i.test(os) &&
        (data = data[/[\d.]+$/.exec(os)])) {
      os = 'Windows ' + data;
    }
    // Correct character case and cleanup string.
    os = String(os);

    if (pattern && label) {
      os = os.replace(RegExp(pattern, 'i'), label);
    }

    os = format(
      os.replace(/ ce$/i, ' CE')
        .replace(/\bhpw/i, 'web')
        .replace(/\bMacintosh\b/, 'Mac OS')
        .replace(/_PowerPC\b/i, ' OS')
        .replace(/\b(OS X) [^ \d]+/i, '$1')
        .replace(/\bMac (OS X)\b/, '$1')
        .replace(/\/(\d)/, ' $1')
        .replace(/_/g, '.')
        .replace(/(?: BePC|[ .]*fc[ \d.]+)$/i, '')
        .replace(/\bx86\.64\b/gi, 'x86_64')
        .replace(/\b(Windows Phone) OS\b/, '$1')
        .replace(/\b(Chrome OS \w+) [\d.]+\b/, '$1')
        .split(' on ')[0]
    );

    return os;
  }

  /**
   * An iteration utility for arrays and objects.
   *
   * @private
   * @param {Array|Object} object The object to iterate over.
   * @param {Function} callback The function called per iteration.
   */
  function each(object, callback) {
    var index = -1,
        length = object ? object.length : 0;

    if (typeof length == 'number' && length > -1 && length <= maxSafeInteger) {
      while (++index < length) {
        callback(object[index], index, object);
      }
    } else {
      forOwn(object, callback);
    }
  }

  /**
   * Trim and conditionally capitalize string values.
   *
   * @private
   * @param {string} string The string to format.
   * @returns {string} The formatted string.
   */
  function format(string) {
    string = trim(string);
    return /^(?:webOS|i(?:OS|P))/.test(string)
      ? string
      : capitalize(string);
  }

  /**
   * Iterates over an object's own properties, executing the `callback` for each.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} callback The function executed per own property.
   */
  function forOwn(object, callback) {
    for (var key in object) {
      if (hasOwnProperty.call(object, key)) {
        callback(object[key], key, object);
      }
    }
  }

  /**
   * Gets the internal `[[Class]]` of a value.
   *
   * @private
   * @param {*} value The value.
   * @returns {string} The `[[Class]]`.
   */
  function getClassOf(value) {
    return value == null
      ? capitalize(value)
      : toString.call(value).slice(8, -1);
  }

  /**
   * Host objects can return type values that are different from their actual
   * data type. The objects we are concerned with usually return non-primitive
   * types of "object", "function", or "unknown".
   *
   * @private
   * @param {*} object The owner of the property.
   * @param {string} property The property to check.
   * @returns {boolean} Returns `true` if the property value is a non-primitive, else `false`.
   */
  function isHostType(object, property) {
    var type = object != null ? typeof object[property] : 'number';
    return !/^(?:boolean|number|string|undefined)$/.test(type) &&
      (type == 'object' ? !!object[property] : true);
  }

  /**
   * Prepares a string for use in a `RegExp` by making hyphens and spaces optional.
   *
   * @private
   * @param {string} string The string to qualify.
   * @returns {string} The qualified string.
   */
  function qualify(string) {
    return String(string).replace(/([ -])(?!$)/g, '$1?');
  }

  /**
   * A bare-bones `Array#reduce` like utility function.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} callback The function called per iteration.
   * @returns {*} The accumulated result.
   */
  function reduce(array, callback) {
    var accumulator = null;
    each(array, function(value, index) {
      accumulator = callback(accumulator, value, index, array);
    });
    return accumulator;
  }

  /**
   * Removes leading and trailing whitespace from a string.
   *
   * @private
   * @param {string} string The string to trim.
   * @returns {string} The trimmed string.
   */
  function trim(string) {
    return String(string).replace(/^ +| +$/g, '');
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a new platform object.
   *
   * @memberOf platform
   * @param {Object|string} [ua=navigator.userAgent] The user agent string or
   *  context object.
   * @returns {Object} A platform object.
   */
  function parse(ua) {

    /** The environment context object. */
    var context = root;

    /** Used to flag when a custom context is provided. */
    var isCustomContext = ua && typeof ua == 'object' && getClassOf(ua) != 'String';

    // Juggle arguments.
    if (isCustomContext) {
      context = ua;
      ua = null;
    }

    /** Browser navigator object. */
    var nav = context.navigator || {};

    /** Browser user agent string. */
    var userAgent = nav.userAgent || '';

    ua || (ua = userAgent);

    /** Used to flag when `thisBinding` is the [ModuleScope]. */
    var isModuleScope = isCustomContext || thisBinding == oldRoot;

    /** Used to detect if browser is like Chrome. */
    var likeChrome = isCustomContext
      ? !!nav.likeChrome
      : /\bChrome\b/.test(ua) && !/internal|\n/i.test(toString.toString());

    /** Internal `[[Class]]` value shortcuts. */
    var objectClass = 'Object',
        airRuntimeClass = isCustomContext ? objectClass : 'ScriptBridgingProxyObject',
        enviroClass = isCustomContext ? objectClass : 'Environment',
        javaClass = (isCustomContext && context.java) ? 'JavaPackage' : getClassOf(context.java),
        phantomClass = isCustomContext ? objectClass : 'RuntimeObject';

    /** Detect Java environments. */
    var java = /\bJava/.test(javaClass) && context.java;

    /** Detect Rhino. */
    var rhino = java && getClassOf(context.environment) == enviroClass;

    /** A character to represent alpha. */
    var alpha = java ? 'a' : '\u03b1';

    /** A character to represent beta. */
    var beta = java ? 'b' : '\u03b2';

    /** Browser document object. */
    var doc = context.document || {};

    /**
     * Detect Opera browser (Presto-based).
     * http://www.howtocreate.co.uk/operaStuff/operaObject.html
     * http://dev.opera.com/articles/view/opera-mini-web-content-authoring-guidelines/#operamini
     */
    var opera = context.operamini || context.opera;

    /** Opera `[[Class]]`. */
    var operaClass = reOpera.test(operaClass = (isCustomContext && opera) ? opera['[[Class]]'] : getClassOf(opera))
      ? operaClass
      : (opera = null);

    /*------------------------------------------------------------------------*/

    /** Temporary variable used over the script's lifetime. */
    var data;

    /** The CPU architecture. */
    var arch = ua;

    /** Platform description array. */
    var description = [];

    /** Platform alpha/beta indicator. */
    var prerelease = null;

    /** A flag to indicate that environment features should be used to resolve the platform. */
    var useFeatures = ua == userAgent;

    /** The browser/environment version. */
    var version = useFeatures && opera && typeof opera.version == 'function' && opera.version();

    /** A flag to indicate if the OS ends with "/ Version" */
    var isSpecialCasedOS;

    /* Detectable layout engines (order is important). */
    var layout = getLayout([
      { 'label': 'EdgeHTML', 'pattern': 'Edge' },
      'Trident',
      { 'label': 'WebKit', 'pattern': 'AppleWebKit' },
      'iCab',
      'Presto',
      'NetFront',
      'Tasman',
      'KHTML',
      'Gecko'
    ]);

    /* Detectable browser names (order is important). */
    var name = getName([
      'Adobe AIR',
      'Arora',
      'Avant Browser',
      'Breach',
      'Camino',
      'Electron',
      'Epiphany',
      'Fennec',
      'Flock',
      'Galeon',
      'GreenBrowser',
      'iCab',
      'Iceweasel',
      'K-Meleon',
      'Konqueror',
      'Lunascape',
      'Maxthon',
      { 'label': 'Microsoft Edge', 'pattern': 'Edge' },
      'Midori',
      'Nook Browser',
      'PaleMoon',
      'PhantomJS',
      'Raven',
      'Rekonq',
      'RockMelt',
      { 'label': 'Samsung Internet', 'pattern': 'SamsungBrowser' },
      'SeaMonkey',
      { 'label': 'Silk', 'pattern': '(?:Cloud9|Silk-Accelerated)' },
      'Sleipnir',
      'SlimBrowser',
      { 'label': 'SRWare Iron', 'pattern': 'Iron' },
      'Sunrise',
      'Swiftfox',
      'Waterfox',
      'WebPositive',
      'Opera Mini',
      { 'label': 'Opera Mini', 'pattern': 'OPiOS' },
      'Opera',
      { 'label': 'Opera', 'pattern': 'OPR' },
      'Chrome',
      { 'label': 'Chrome Mobile', 'pattern': '(?:CriOS|CrMo)' },
      { 'label': 'Firefox', 'pattern': '(?:Firefox|Minefield)' },
      { 'label': 'Firefox for iOS', 'pattern': 'FxiOS' },
      { 'label': 'IE', 'pattern': 'IEMobile' },
      { 'label': 'IE', 'pattern': 'MSIE' },
      'Safari'
    ]);

    /* Detectable products (order is important). */
    var product = getProduct([
      { 'label': 'BlackBerry', 'pattern': 'BB10' },
      'BlackBerry',
      { 'label': 'Galaxy S', 'pattern': 'GT-I9000' },
      { 'label': 'Galaxy S2', 'pattern': 'GT-I9100' },
      { 'label': 'Galaxy S3', 'pattern': 'GT-I9300' },
      { 'label': 'Galaxy S4', 'pattern': 'GT-I9500' },
      { 'label': 'Galaxy S5', 'pattern': 'SM-G900' },
      { 'label': 'Galaxy S6', 'pattern': 'SM-G920' },
      { 'label': 'Galaxy S6 Edge', 'pattern': 'SM-G925' },
      { 'label': 'Galaxy S7', 'pattern': 'SM-G930' },
      { 'label': 'Galaxy S7 Edge', 'pattern': 'SM-G935' },
      'Google TV',
      'Lumia',
      'iPad',
      'iPod',
      'iPhone',
      'Kindle',
      { 'label': 'Kindle Fire', 'pattern': '(?:Cloud9|Silk-Accelerated)' },
      'Nexus',
      'Nook',
      'PlayBook',
      'PlayStation Vita',
      'PlayStation',
      'TouchPad',
      'Transformer',
      { 'label': 'Wii U', 'pattern': 'WiiU' },
      'Wii',
      'Xbox One',
      { 'label': 'Xbox 360', 'pattern': 'Xbox' },
      'Xoom'
    ]);

    /* Detectable manufacturers. */
    var manufacturer = getManufacturer({
      'Apple': { 'iPad': 1, 'iPhone': 1, 'iPod': 1 },
      'Archos': {},
      'Amazon': { 'Kindle': 1, 'Kindle Fire': 1 },
      'Asus': { 'Transformer': 1 },
      'Barnes & Noble': { 'Nook': 1 },
      'BlackBerry': { 'PlayBook': 1 },
      'Google': { 'Google TV': 1, 'Nexus': 1 },
      'HP': { 'TouchPad': 1 },
      'HTC': {},
      'LG': {},
      'Microsoft': { 'Xbox': 1, 'Xbox One': 1 },
      'Motorola': { 'Xoom': 1 },
      'Nintendo': { 'Wii U': 1,  'Wii': 1 },
      'Nokia': { 'Lumia': 1 },
      'Samsung': { 'Galaxy S': 1, 'Galaxy S2': 1, 'Galaxy S3': 1, 'Galaxy S4': 1 },
      'Sony': { 'PlayStation': 1, 'PlayStation Vita': 1 }
    });

    /* Detectable operating systems (order is important). */
    var os = getOS([
      'Windows Phone',
      'Android',
      'CentOS',
      { 'label': 'Chrome OS', 'pattern': 'CrOS' },
      'Debian',
      'Fedora',
      'FreeBSD',
      'Gentoo',
      'Haiku',
      'Kubuntu',
      'Linux Mint',
      'OpenBSD',
      'Red Hat',
      'SuSE',
      'Ubuntu',
      'Xubuntu',
      'Cygwin',
      'Symbian OS',
      'hpwOS',
      'webOS ',
      'webOS',
      'Tablet OS',
      'Tizen',
      'Linux',
      'Mac OS X',
      'Macintosh',
      'Mac',
      'Windows 98;',
      'Windows '
    ]);

    /*------------------------------------------------------------------------*/

    /**
     * Picks the layout engine from an array of guesses.
     *
     * @private
     * @param {Array} guesses An array of guesses.
     * @returns {null|string} The detected layout engine.
     */
    function getLayout(guesses) {
      return reduce(guesses, function(result, guess) {
        return result || RegExp('\\b' + (
          guess.pattern || qualify(guess)
        ) + '\\b', 'i').exec(ua) && (guess.label || guess);
      });
    }

    /**
     * Picks the manufacturer from an array of guesses.
     *
     * @private
     * @param {Array} guesses An object of guesses.
     * @returns {null|string} The detected manufacturer.
     */
    function getManufacturer(guesses) {
      return reduce(guesses, function(result, value, key) {
        // Lookup the manufacturer by product or scan the UA for the manufacturer.
        return result || (
          value[product] ||
          value[/^[a-z]+(?: +[a-z]+\b)*/i.exec(product)] ||
          RegExp('\\b' + qualify(key) + '(?:\\b|\\w*\\d)', 'i').exec(ua)
        ) && key;
      });
    }

    /**
     * Picks the browser name from an array of guesses.
     *
     * @private
     * @param {Array} guesses An array of guesses.
     * @returns {null|string} The detected browser name.
     */
    function getName(guesses) {
      return reduce(guesses, function(result, guess) {
        return result || RegExp('\\b' + (
          guess.pattern || qualify(guess)
        ) + '\\b', 'i').exec(ua) && (guess.label || guess);
      });
    }

    /**
     * Picks the OS name from an array of guesses.
     *
     * @private
     * @param {Array} guesses An array of guesses.
     * @returns {null|string} The detected OS name.
     */
    function getOS(guesses) {
      return reduce(guesses, function(result, guess) {
        var pattern = guess.pattern || qualify(guess);
        if (!result && (result =
              RegExp('\\b' + pattern + '(?:/[\\d.]+|[ \\w.]*)', 'i').exec(ua)
            )) {
          result = cleanupOS(result, pattern, guess.label || guess);
        }
        return result;
      });
    }

    /**
     * Picks the product name from an array of guesses.
     *
     * @private
     * @param {Array} guesses An array of guesses.
     * @returns {null|string} The detected product name.
     */
    function getProduct(guesses) {
      return reduce(guesses, function(result, guess) {
        var pattern = guess.pattern || qualify(guess);
        if (!result && (result =
              RegExp('\\b' + pattern + ' *\\d+[.\\w_]*', 'i').exec(ua) ||
              RegExp('\\b' + pattern + ' *\\w+-[\\w]*', 'i').exec(ua) ||
              RegExp('\\b' + pattern + '(?:; *(?:[a-z]+[_-])?[a-z]+\\d+|[^ ();-]*)', 'i').exec(ua)
            )) {
          // Split by forward slash and append product version if needed.
          if ((result = String((guess.label && !RegExp(pattern, 'i').test(guess.label)) ? guess.label : result).split('/'))[1] && !/[\d.]+/.test(result[0])) {
            result[0] += ' ' + result[1];
          }
          // Correct character case and cleanup string.
          guess = guess.label || guess;
          result = format(result[0]
            .replace(RegExp(pattern, 'i'), guess)
            .replace(RegExp('; *(?:' + guess + '[_-])?', 'i'), ' ')
            .replace(RegExp('(' + guess + ')[-_.]?(\\w)', 'i'), '$1 $2'));
        }
        return result;
      });
    }

    /**
     * Resolves the version using an array of UA patterns.
     *
     * @private
     * @param {Array} patterns An array of UA patterns.
     * @returns {null|string} The detected version.
     */
    function getVersion(patterns) {
      return reduce(patterns, function(result, pattern) {
        return result || (RegExp(pattern +
          '(?:-[\\d.]+/|(?: for [\\w-]+)?[ /-])([\\d.]+[^ ();/_-]*)', 'i').exec(ua) || 0)[1] || null;
      });
    }

    /**
     * Returns `platform.description` when the platform object is coerced to a string.
     *
     * @name toString
     * @memberOf platform
     * @returns {string} Returns `platform.description` if available, else an empty string.
     */
    function toStringPlatform() {
      return this.description || '';
    }

    /*------------------------------------------------------------------------*/

    // Convert layout to an array so we can add extra details.
    layout && (layout = [layout]);

    // Detect product names that contain their manufacturer's name.
    if (manufacturer && !product) {
      product = getProduct([manufacturer]);
    }
    // Clean up Google TV.
    if ((data = /\bGoogle TV\b/.exec(product))) {
      product = data[0];
    }
    // Detect simulators.
    if (/\bSimulator\b/i.test(ua)) {
      product = (product ? product + ' ' : '') + 'Simulator';
    }
    // Detect Opera Mini 8+ running in Turbo/Uncompressed mode on iOS.
    if (name == 'Opera Mini' && /\bOPiOS\b/.test(ua)) {
      description.push('running in Turbo/Uncompressed mode');
    }
    // Detect IE Mobile 11.
    if (name == 'IE' && /\blike iPhone OS\b/.test(ua)) {
      data = parse(ua.replace(/like iPhone OS/, ''));
      manufacturer = data.manufacturer;
      product = data.product;
    }
    // Detect iOS.
    else if (/^iP/.test(product)) {
      name || (name = 'Safari');
      os = 'iOS' + ((data = / OS ([\d_]+)/i.exec(ua))
        ? ' ' + data[1].replace(/_/g, '.')
        : '');
    }
    // Detect Kubuntu.
    else if (name == 'Konqueror' && !/buntu/i.test(os)) {
      os = 'Kubuntu';
    }
    // Detect Android browsers.
    else if ((manufacturer && manufacturer != 'Google' &&
        ((/Chrome/.test(name) && !/\bMobile Safari\b/i.test(ua)) || /\bVita\b/.test(product))) ||
        (/\bAndroid\b/.test(os) && /^Chrome/.test(name) && /\bVersion\//i.test(ua))) {
      name = 'Android Browser';
      os = /\bAndroid\b/.test(os) ? os : 'Android';
    }
    // Detect Silk desktop/accelerated modes.
    else if (name == 'Silk') {
      if (!/\bMobi/i.test(ua)) {
        os = 'Android';
        description.unshift('desktop mode');
      }
      if (/Accelerated *= *true/i.test(ua)) {
        description.unshift('accelerated');
      }
    }
    // Detect PaleMoon identifying as Firefox.
    else if (name == 'PaleMoon' && (data = /\bFirefox\/([\d.]+)\b/.exec(ua))) {
      description.push('identifying as Firefox ' + data[1]);
    }
    // Detect Firefox OS and products running Firefox.
    else if (name == 'Firefox' && (data = /\b(Mobile|Tablet|TV)\b/i.exec(ua))) {
      os || (os = 'Firefox OS');
      product || (product = data[1]);
    }
    // Detect false positives for Firefox/Safari.
    else if (!name || (data = !/\bMinefield\b/i.test(ua) && /\b(?:Firefox|Safari)\b/.exec(name))) {
      // Escape the `/` for Firefox 1.
      if (name && !product && /[\/,]|^[^(]+?\)/.test(ua.slice(ua.indexOf(data + '/') + 8))) {
        // Clear name of false positives.
        name = null;
      }
      // Reassign a generic name.
      if ((data = product || manufacturer || os) &&
          (product || manufacturer || /\b(?:Android|Symbian OS|Tablet OS|webOS)\b/.test(os))) {
        name = /[a-z]+(?: Hat)?/i.exec(/\bAndroid\b/.test(os) ? os : data) + ' Browser';
      }
    }
    // Add Chrome version to description for Electron.
    else if (name == 'Electron' && (data = (/\bChrome\/([\d.]+)\b/.exec(ua) || 0)[1])) {
      description.push('Chromium ' + data);
    }
    // Detect non-Opera (Presto-based) versions (order is important).
    if (!version) {
      version = getVersion([
        '(?:Cloud9|CriOS|CrMo|Edge|FxiOS|IEMobile|Iron|Opera ?Mini|OPiOS|OPR|Raven|SamsungBrowser|Silk(?!/[\\d.]+$))',
        'Version',
        qualify(name),
        '(?:Firefox|Minefield|NetFront)'
      ]);
    }
    // Detect stubborn layout engines.
    if ((data =
          layout == 'iCab' && parseFloat(version) > 3 && 'WebKit' ||
          /\bOpera\b/.test(name) && (/\bOPR\b/.test(ua) ? 'Blink' : 'Presto') ||
          /\b(?:Midori|Nook|Safari)\b/i.test(ua) && !/^(?:Trident|EdgeHTML)$/.test(layout) && 'WebKit' ||
          !layout && /\bMSIE\b/i.test(ua) && (os == 'Mac OS' ? 'Tasman' : 'Trident') ||
          layout == 'WebKit' && /\bPlayStation\b(?! Vita\b)/i.test(name) && 'NetFront'
        )) {
      layout = [data];
    }
    // Detect Windows Phone 7 desktop mode.
    if (name == 'IE' && (data = (/; *(?:XBLWP|ZuneWP)(\d+)/i.exec(ua) || 0)[1])) {
      name += ' Mobile';
      os = 'Windows Phone ' + (/\+$/.test(data) ? data : data + '.x');
      description.unshift('desktop mode');
    }
    // Detect Windows Phone 8.x desktop mode.
    else if (/\bWPDesktop\b/i.test(ua)) {
      name = 'IE Mobile';
      os = 'Windows Phone 8.x';
      description.unshift('desktop mode');
      version || (version = (/\brv:([\d.]+)/.exec(ua) || 0)[1]);
    }
    // Detect IE 11 identifying as other browsers.
    else if (name != 'IE' && layout == 'Trident' && (data = /\brv:([\d.]+)/.exec(ua))) {
      if (name) {
        description.push('identifying as ' + name + (version ? ' ' + version : ''));
      }
      name = 'IE';
      version = data[1];
    }
    // Leverage environment features.
    if (useFeatures) {
      // Detect server-side environments.
      // Rhino has a global function while others have a global object.
      if (isHostType(context, 'global')) {
        if (java) {
          data = java.lang.System;
          arch = data.getProperty('os.arch');
          os = os || data.getProperty('os.name') + ' ' + data.getProperty('os.version');
        }
        if (isModuleScope && isHostType(context, 'system') && (data = [context.system])[0]) {
          os || (os = data[0].os || null);
          try {
            data[1] = context.require('ringo/engine').version;
            version = data[1].join('.');
            name = 'RingoJS';
          } catch(e) {
            if (data[0].global.system == context.system) {
              name = 'Narwhal';
            }
          }
        }
        else if (
          typeof context.process == 'object' && !context.process.browser &&
          (data = context.process)
        ) {
          if (typeof data.versions == 'object') {
            if (typeof data.versions.electron == 'string') {
              description.push('Node ' + data.versions.node);
              name = 'Electron';
              version = data.versions.electron;
            } else if (typeof data.versions.nw == 'string') {
              description.push('Chromium ' + version, 'Node ' + data.versions.node);
              name = 'NW.js';
              version = data.versions.nw;
            }
          } else {
            name = 'Node.js';
            arch = data.arch;
            os = data.platform;
            version = /[\d.]+/.exec(data.version)
            version = version ? version[0] : 'unknown';
          }
        }
        else if (rhino) {
          name = 'Rhino';
        }
      }
      // Detect Adobe AIR.
      else if (getClassOf((data = context.runtime)) == airRuntimeClass) {
        name = 'Adobe AIR';
        os = data.flash.system.Capabilities.os;
      }
      // Detect PhantomJS.
      else if (getClassOf((data = context.phantom)) == phantomClass) {
        name = 'PhantomJS';
        version = (data = data.version || null) && (data.major + '.' + data.minor + '.' + data.patch);
      }
      // Detect IE compatibility modes.
      else if (typeof doc.documentMode == 'number' && (data = /\bTrident\/(\d+)/i.exec(ua))) {
        // We're in compatibility mode when the Trident version + 4 doesn't
        // equal the document mode.
        version = [version, doc.documentMode];
        if ((data = +data[1] + 4) != version[1]) {
          description.push('IE ' + version[1] + ' mode');
          layout && (layout[1] = '');
          version[1] = data;
        }
        version = name == 'IE' ? String(version[1].toFixed(1)) : version[0];
      }
      // Detect IE 11 masking as other browsers.
      else if (typeof doc.documentMode == 'number' && /^(?:Chrome|Firefox)\b/.test(name)) {
        description.push('masking as ' + name + ' ' + version);
        name = 'IE';
        version = '11.0';
        layout = ['Trident'];
        os = 'Windows';
      }
      os = os && format(os);
    }
    // Detect prerelease phases.
    if (version && (data =
          /(?:[ab]|dp|pre|[ab]\d+pre)(?:\d+\+?)?$/i.exec(version) ||
          /(?:alpha|beta)(?: ?\d)?/i.exec(ua + ';' + (useFeatures && nav.appMinorVersion)) ||
          /\bMinefield\b/i.test(ua) && 'a'
        )) {
      prerelease = /b/i.test(data) ? 'beta' : 'alpha';
      version = version.replace(RegExp(data + '\\+?$'), '') +
        (prerelease == 'beta' ? beta : alpha) + (/\d+\+?/.exec(data) || '');
    }
    // Detect Firefox Mobile.
    if (name == 'Fennec' || name == 'Firefox' && /\b(?:Android|Firefox OS)\b/.test(os)) {
      name = 'Firefox Mobile';
    }
    // Obscure Maxthon's unreliable version.
    else if (name == 'Maxthon' && version) {
      version = version.replace(/\.[\d.]+/, '.x');
    }
    // Detect Xbox 360 and Xbox One.
    else if (/\bXbox\b/i.test(product)) {
      if (product == 'Xbox 360') {
        os = null;
      }
      if (product == 'Xbox 360' && /\bIEMobile\b/.test(ua)) {
        description.unshift('mobile mode');
      }
    }
    // Add mobile postfix.
    else if ((/^(?:Chrome|IE|Opera)$/.test(name) || name && !product && !/Browser|Mobi/.test(name)) &&
        (os == 'Windows CE' || /Mobi/i.test(ua))) {
      name += ' Mobile';
    }
    // Detect IE platform preview.
    else if (name == 'IE' && useFeatures) {
      try {
        if (context.external === null) {
          description.unshift('platform preview');
        }
      } catch(e) {
        description.unshift('embedded');
      }
    }
    // Detect BlackBerry OS version.
    // http://docs.blackberry.com/en/developers/deliverables/18169/HTTP_headers_sent_by_BB_Browser_1234911_11.jsp
    else if ((/\bBlackBerry\b/.test(product) || /\bBB10\b/.test(ua)) && (data =
          (RegExp(product.replace(/ +/g, ' *') + '/([.\\d]+)', 'i').exec(ua) || 0)[1] ||
          version
        )) {
      data = [data, /BB10/.test(ua)];
      os = (data[1] ? (product = null, manufacturer = 'BlackBerry') : 'Device Software') + ' ' + data[0];
      version = null;
    }
    // Detect Opera identifying/masking itself as another browser.
    // http://www.opera.com/support/kb/view/843/
    else if (this != forOwn && product != 'Wii' && (
          (useFeatures && opera) ||
          (/Opera/.test(name) && /\b(?:MSIE|Firefox)\b/i.test(ua)) ||
          (name == 'Firefox' && /\bOS X (?:\d+\.){2,}/.test(os)) ||
          (name == 'IE' && (
            (os && !/^Win/.test(os) && version > 5.5) ||
            /\bWindows XP\b/.test(os) && version > 8 ||
            version == 8 && !/\bTrident\b/.test(ua)
          ))
        ) && !reOpera.test((data = parse.call(forOwn, ua.replace(reOpera, '') + ';'))) && data.name) {
      // When "identifying", the UA contains both Opera and the other browser's name.
      data = 'ing as ' + data.name + ((data = data.version) ? ' ' + data : '');
      if (reOpera.test(name)) {
        if (/\bIE\b/.test(data) && os == 'Mac OS') {
          os = null;
        }
        data = 'identify' + data;
      }
      // When "masking", the UA contains only the other browser's name.
      else {
        data = 'mask' + data;
        if (operaClass) {
          name = format(operaClass.replace(/([a-z])([A-Z])/g, '$1 $2'));
        } else {
          name = 'Opera';
        }
        if (/\bIE\b/.test(data)) {
          os = null;
        }
        if (!useFeatures) {
          version = null;
        }
      }
      layout = ['Presto'];
      description.push(data);
    }
    // Detect WebKit Nightly and approximate Chrome/Safari versions.
    if ((data = (/\bAppleWebKit\/([\d.]+\+?)/i.exec(ua) || 0)[1])) {
      // Correct build number for numeric comparison.
      // (e.g. "532.5" becomes "532.05")
      data = [parseFloat(data.replace(/\.(\d)$/, '.0$1')), data];
      // Nightly builds are postfixed with a "+".
      if (name == 'Safari' && data[1].slice(-1) == '+') {
        name = 'WebKit Nightly';
        prerelease = 'alpha';
        version = data[1].slice(0, -1);
      }
      // Clear incorrect browser versions.
      else if (version == data[1] ||
          version == (data[2] = (/\bSafari\/([\d.]+\+?)/i.exec(ua) || 0)[1])) {
        version = null;
      }
      // Use the full Chrome version when available.
      data[1] = (/\bChrome\/([\d.]+)/i.exec(ua) || 0)[1];
      // Detect Blink layout engine.
      if (data[0] == 537.36 && data[2] == 537.36 && parseFloat(data[1]) >= 28 && layout == 'WebKit') {
        layout = ['Blink'];
      }
      // Detect JavaScriptCore.
      // http://stackoverflow.com/questions/6768474/how-can-i-detect-which-javascript-engine-v8-or-jsc-is-used-at-runtime-in-androi
      if (!useFeatures || (!likeChrome && !data[1])) {
        layout && (layout[1] = 'like Safari');
        data = (data = data[0], data < 400 ? 1 : data < 500 ? 2 : data < 526 ? 3 : data < 533 ? 4 : data < 534 ? '4+' : data < 535 ? 5 : data < 537 ? 6 : data < 538 ? 7 : data < 601 ? 8 : '8');
      } else {
        layout && (layout[1] = 'like Chrome');
        data = data[1] || (data = data[0], data < 530 ? 1 : data < 532 ? 2 : data < 532.05 ? 3 : data < 533 ? 4 : data < 534.03 ? 5 : data < 534.07 ? 6 : data < 534.10 ? 7 : data < 534.13 ? 8 : data < 534.16 ? 9 : data < 534.24 ? 10 : data < 534.30 ? 11 : data < 535.01 ? 12 : data < 535.02 ? '13+' : data < 535.07 ? 15 : data < 535.11 ? 16 : data < 535.19 ? 17 : data < 536.05 ? 18 : data < 536.10 ? 19 : data < 537.01 ? 20 : data < 537.11 ? '21+' : data < 537.13 ? 23 : data < 537.18 ? 24 : data < 537.24 ? 25 : data < 537.36 ? 26 : layout != 'Blink' ? '27' : '28');
      }
      // Add the postfix of ".x" or "+" for approximate versions.
      layout && (layout[1] += ' ' + (data += typeof data == 'number' ? '.x' : /[.+]/.test(data) ? '' : '+'));
      // Obscure version for some Safari 1-2 releases.
      if (name == 'Safari' && (!version || parseInt(version) > 45)) {
        version = data;
      }
    }
    // Detect Opera desktop modes.
    if (name == 'Opera' &&  (data = /\bzbov|zvav$/.exec(os))) {
      name += ' ';
      description.unshift('desktop mode');
      if (data == 'zvav') {
        name += 'Mini';
        version = null;
      } else {
        name += 'Mobile';
      }
      os = os.replace(RegExp(' *' + data + '$'), '');
    }
    // Detect Chrome desktop mode.
    else if (name == 'Safari' && /\bChrome\b/.exec(layout && layout[1])) {
      description.unshift('desktop mode');
      name = 'Chrome Mobile';
      version = null;

      if (/\bOS X\b/.test(os)) {
        manufacturer = 'Apple';
        os = 'iOS 4.3+';
      } else {
        os = null;
      }
    }
    // Strip incorrect OS versions.
    if (version && version.indexOf((data = /[\d.]+$/.exec(os))) == 0 &&
        ua.indexOf('/' + data + '-') > -1) {
      os = trim(os.replace(data, ''));
    }
    // Add layout engine.
    if (layout && !/\b(?:Avant|Nook)\b/.test(name) && (
        /Browser|Lunascape|Maxthon/.test(name) ||
        name != 'Safari' && /^iOS/.test(os) && /\bSafari\b/.test(layout[1]) ||
        /^(?:Adobe|Arora|Breach|Midori|Opera|Phantom|Rekonq|Rock|Samsung Internet|Sleipnir|Web)/.test(name) && layout[1])) {
      // Don't add layout details to description if they are falsey.
      (data = layout[layout.length - 1]) && description.push(data);
    }
    // Combine contextual information.
    if (description.length) {
      description = ['(' + description.join('; ') + ')'];
    }
    // Append manufacturer to description.
    if (manufacturer && product && product.indexOf(manufacturer) < 0) {
      description.push('on ' + manufacturer);
    }
    // Append product to description.
    if (product) {
      description.push((/^on /.test(description[description.length - 1]) ? '' : 'on ') + product);
    }
    // Parse the OS into an object.
    if (os) {
      data = / ([\d.+]+)$/.exec(os);
      isSpecialCasedOS = data && os.charAt(os.length - data[0].length - 1) == '/';
      os = {
        'architecture': 32,
        'family': (data && !isSpecialCasedOS) ? os.replace(data[0], '') : os,
        'version': data ? data[1] : null,
        'toString': function() {
          var version = this.version;
          return this.family + ((version && !isSpecialCasedOS) ? ' ' + version : '') + (this.architecture == 64 ? ' 64-bit' : '');
        }
      };
    }
    // Add browser/OS architecture.
    if ((data = /\b(?:AMD|IA|Win|WOW|x86_|x)64\b/i.exec(arch)) && !/\bi686\b/i.test(arch)) {
      if (os) {
        os.architecture = 64;
        os.family = os.family.replace(RegExp(' *' + data), '');
      }
      if (
          name && (/\bWOW64\b/i.test(ua) ||
          (useFeatures && /\w(?:86|32)$/.test(nav.cpuClass || nav.platform) && !/\bWin64; x64\b/i.test(ua)))
      ) {
        description.unshift('32-bit');
      }
    }
    // Chrome 39 and above on OS X is always 64-bit.
    else if (
        os && /^OS X/.test(os.family) &&
        name == 'Chrome' && parseFloat(version) >= 39
    ) {
      os.architecture = 64;
    }

    ua || (ua = null);

    /*------------------------------------------------------------------------*/

    /**
     * The platform object.
     *
     * @name platform
     * @type Object
     */
    var platform = {};

    /**
     * The platform description.
     *
     * @memberOf platform
     * @type string|null
     */
    platform.description = ua;

    /**
     * The name of the browser's layout engine.
     *
     * The list of common layout engines include:
     * "Blink", "EdgeHTML", "Gecko", "Trident" and "WebKit"
     *
     * @memberOf platform
     * @type string|null
     */
    platform.layout = layout && layout[0];

    /**
     * The name of the product's manufacturer.
     *
     * The list of manufacturers include:
     * "Apple", "Archos", "Amazon", "Asus", "Barnes & Noble", "BlackBerry",
     * "Google", "HP", "HTC", "LG", "Microsoft", "Motorola", "Nintendo",
     * "Nokia", "Samsung" and "Sony"
     *
     * @memberOf platform
     * @type string|null
     */
    platform.manufacturer = manufacturer;

    /**
     * The name of the browser/environment.
     *
     * The list of common browser names include:
     * "Chrome", "Electron", "Firefox", "Firefox for iOS", "IE",
     * "Microsoft Edge", "PhantomJS", "Safari", "SeaMonkey", "Silk",
     * "Opera Mini" and "Opera"
     *
     * Mobile versions of some browsers have "Mobile" appended to their name:
     * eg. "Chrome Mobile", "Firefox Mobile", "IE Mobile" and "Opera Mobile"
     *
     * @memberOf platform
     * @type string|null
     */
    platform.name = name;

    /**
     * The alpha/beta release indicator.
     *
     * @memberOf platform
     * @type string|null
     */
    platform.prerelease = prerelease;

    /**
     * The name of the product hosting the browser.
     *
     * The list of common products include:
     *
     * "BlackBerry", "Galaxy S4", "Lumia", "iPad", "iPod", "iPhone", "Kindle",
     * "Kindle Fire", "Nexus", "Nook", "PlayBook", "TouchPad" and "Transformer"
     *
     * @memberOf platform
     * @type string|null
     */
    platform.product = product;

    /**
     * The browser's user agent string.
     *
     * @memberOf platform
     * @type string|null
     */
    platform.ua = ua;

    /**
     * The browser/environment version.
     *
     * @memberOf platform
     * @type string|null
     */
    platform.version = name && version;

    /**
     * The name of the operating system.
     *
     * @memberOf platform
     * @type Object
     */
    platform.os = os || {

      /**
       * The CPU architecture the OS is built for.
       *
       * @memberOf platform.os
       * @type number|null
       */
      'architecture': null,

      /**
       * The family of the OS.
       *
       * Common values include:
       * "Windows", "Windows Server 2008 R2 / 7", "Windows Server 2008 / Vista",
       * "Windows XP", "OS X", "Ubuntu", "Debian", "Fedora", "Red Hat", "SuSE",
       * "Android", "iOS" and "Windows Phone"
       *
       * @memberOf platform.os
       * @type string|null
       */
      'family': null,

      /**
       * The version of the OS.
       *
       * @memberOf platform.os
       * @type string|null
       */
      'version': null,

      /**
       * Returns the OS string.
       *
       * @memberOf platform.os
       * @returns {string} The OS string.
       */
      'toString': function() { return 'null'; }
    };

    platform.parse = parse;
    platform.toString = toStringPlatform;

    if (platform.version) {
      description.unshift(version);
    }
    if (platform.name) {
      description.unshift(name);
    }
    if (os && name && !(os == String(os).split(' ')[0] && (os == name.split(' ')[0] || product))) {
      description.push(product ? '(' + os + ')' : 'on ' + os);
    }
    if (description.length) {
      platform.description = description.join(' ');
    }
    return platform;
  }

  /*--------------------------------------------------------------------------*/

  // Export platform.
  var platform = parse();

  // Some AMD build optimizers, like r.js, check for condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Expose platform on the global object to prevent errors when platform is
    // loaded by a script tag in the presence of an AMD loader.
    // See http://requirejs.org/docs/errors.html#mismatch for more details.
    root.platform = platform;

    // Define as an anonymous module so platform can be aliased through path mapping.
    define(function() {
      return platform;
    });
  }
  // Check for `exports` after `define` in case a build optimizer adds an `exports` object.
  else if (freeExports && freeModule) {
    // Export for CommonJS support.
    forOwn(platform, function(value, key) {
      freeExports[key] = value;
    });
  }
  else {
    // Export to the global object.
    root.platform = platform;
  }
}.call(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _collapse = require('../collapse');

var _collapse2 = _interopRequireDefault(_collapse);

var _componentManager = require('../componentManager');

var _events = require('../../core/events');

var _events2 = _interopRequireDefault(_events);

var _utils = require('../../core/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Accordion = function () {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'accordion';
  var VERSION = '2.0.0';
  var DEFAULT_PROPERTIES = {
    element: null
  };
  var DATA_ATTRS_PROPERTIES = [];

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Accordion = function (_Component) {
    _inherits(Accordion, _Component);

    function Accordion() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Accordion);

      var _this = _possibleConstructorReturn(this, (Accordion.__proto__ || Object.getPrototypeOf(Accordion)).call(this, NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false));

      _this.collapses = [];

      var toggles = _this.options.element.querySelectorAll('[data-toggle="' + NAME + '"]');
      toggles.forEach(function (toggle) {
        var collapseId = toggle.getAttribute('href');
        var collapse = document.querySelector(collapseId);

        if (collapse) {
          _this.addCollapse(collapse);
        }
      });
      return _this;
    }

    _createClass(Accordion, [{
      key: 'onElementEvent',
      value: function onElementEvent(event) {
        var id = event.target.getAttribute('href');
        var element = document.querySelector(id);

        this.setCollapses(element);
      }
    }, {
      key: 'addCollapse',
      value: function addCollapse(element) {
        var collapse = new _collapse2.default({
          element: element
        });
        this.collapses.push(collapse);

        return collapse;
      }
    }, {
      key: 'getCollapse',
      value: function getCollapse(element) {
        var collapse = this.collapses.find(function (c) {
          return c.options.element.getAttribute('id') === element.getAttribute('id');
        });

        if (!collapse) {
          // create a new collapse
          collapse = this.addCollapse();
        }

        return collapse;
      }
    }, {
      key: 'getCollapses',
      value: function getCollapses() {
        return this.collapses;
      }
    }, {
      key: 'setCollapses',
      value: function setCollapses(showCollapse) {
        var collapse = this.getCollapse(showCollapse);
        this.collapses.forEach(function (c) {
          if (c.options.element.getAttribute('id') !== showCollapse.getAttribute('id')) {
            c.hide();
          } else {
            collapse.toggle();
          }
        });
      }
    }, {
      key: 'show',
      value: function show(collapseEl) {
        var collapse = collapseEl;
        if (typeof collapseEl === 'string') {
          collapse = document.querySelector(collapseEl);
        }

        if (!collapse) {
          throw new Error(NAME + '. The collapsible ' + collapseEl + ' is an invalid HTMLElement.');
        }

        this.setCollapses(collapse);

        return true;
      }
    }, {
      key: 'hide',
      value: function hide(collapseEl) {
        var collapse = collapseEl;
        if (typeof collapseEl === 'string') {
          collapse = document.querySelector(collapseEl);
        }

        if (!collapse) {
          throw new Error(NAME + '. The collapsible ' + collapseEl + ' is an invalid HTMLElement.');
        }

        var collapseObj = this.getCollapse(collapse);
        return collapseObj.hide();
      }
    }], [{
      key: '_DOMInterface',
      value: function _DOMInterface(options) {
        return _get(Accordion.__proto__ || Object.getPrototypeOf(Accordion), '_DOMInterface', this).call(this, Accordion, options);
      }
    }]);

    return Accordion;
  }(_component2.default);

  /**
   * ------------------------------------------------------------------------
   * DOM Api implementation
   * ------------------------------------------------------------------------
   */


  var components = [];

  var accordions = document.querySelectorAll('.' + NAME);
  if (accordions) {
    accordions.forEach(function (element) {
      var config = (0, _componentManager.getAttributesConfig)(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
      config.element = element;

      components.push(Accordion._DOMInterface(config));
    });
  }

  if (accordions) {
    document.addEventListener('click', function (event) {
      var dataToggleAttr = event.target.getAttribute('data-toggle');
      if (dataToggleAttr && dataToggleAttr === NAME) {
        var collapseId = event.target.getAttribute('data-target') || event.target.getAttribute('href');
        var collapseEl = document.querySelector(collapseId);

        var accordion = (0, _utils.findTargetByClass)(event.target, 'accordion');

        if (accordion === null) {
          return;
        }

        var accordionId = accordion.getAttribute('id');
        var component = components.find(function (c) {
          return c.getElement().getAttribute('id') === accordionId;
        });

        if (!component) {
          return;
        }

        // if the collapse has been added programmatically, we add it
        var targetCollapse = component.getCollapses().find(function (c) {
          return c.getElement() === collapseEl;
        });
        if (!targetCollapse) {
          component.addCollapse(collapseEl);
        }

        component.show(collapseId);
      }
    });
  }

  return Accordion;
}();

exports.default = Accordion;

},{"../../core/events":15,"../../core/utils":22,"../collapse":3,"../component":4,"../componentManager":5}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _componentManager = require('../componentManager');

var _events = require('../../core/events');

var _events2 = _interopRequireDefault(_events);

var _utils = require('../../core/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Collapse = function () {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'collapse';
  var VERSION = '2.0.0';
  var DEFAULT_PROPERTIES = {
    element: null,
    toggle: false
  };
  var DATA_ATTRS_PROPERTIES = ['toggle'];

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Collapse = function (_Component) {
    _inherits(Collapse, _Component);

    function Collapse() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Collapse);

      var _this = _possibleConstructorReturn(this, (Collapse.__proto__ || Object.getPrototypeOf(Collapse)).call(this, NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false));

      _this.onTransition = false;

      // toggle directly
      if (_this.options.toggle) {
        _this.show();
      }
      return _this;
    }

    _createClass(Collapse, [{
      key: 'getHeight',
      value: function getHeight() {
        return this.options.element.getBoundingClientRect(this.options.element).height;
      }
    }, {
      key: 'toggle',
      value: function toggle() {
        if (this.options.element.classList.contains('show')) {
          return this.hide();
        }

        return this.show();
      }
    }, {
      key: 'show',
      value: function show() {
        var _this2 = this;

        if (this.onTransition) {
          return false;
        }

        if (this.options.element.classList.contains('show')) {
          return false;
        }

        this.onTransition = true;

        var onCollapsed = function onCollapsed() {
          _this2.options.element.classList.add('show');
          _this2.options.element.classList.remove('collapsing');
          _this2.options.element.removeEventListener(_events2.default.TRANSITION_END, onCollapsed);

          _this2.options.element.setAttribute('aria-expanded', true);

          _this2.onTransition = false;
        };

        if (!this.options.element.classList.contains('collapsing')) {
          this.options.element.classList.add('collapsing');
        }

        this.options.element.addEventListener(_events2.default.TRANSITION_END, onCollapsed);

        var height = this.getHeight();

        this.options.element.style.height = '0px';

        setTimeout(function () {
          _this2.options.element.style.height = height + 'px';
        }, 20);

        return true;
      }
    }, {
      key: 'hide',
      value: function hide() {
        var _this3 = this;

        if (this.onTransition) {
          return false;
        }

        if (!this.options.element.classList.contains('show')) {
          return false;
        }

        this.onTransition = true;

        var onCollapsed = function onCollapsed() {
          _this3.options.element.classList.remove('collapsing');
          _this3.options.element.style.height = 'auto';
          _this3.options.element.removeEventListener(_events2.default.TRANSITION_END, onCollapsed);

          _this3.options.element.setAttribute('aria-expanded', false);

          _this3.onTransition = false;
        };

        this.options.element.style.height = '0px';

        if (!this.options.element.classList.contains('collapsing')) {
          this.options.element.classList.add('collapsing');
        }

        this.options.element.addEventListener(_events2.default.TRANSITION_END, onCollapsed);

        this.options.element.classList.remove('show');

        return true;
      }
    }], [{
      key: '_DOMInterface',
      value: function _DOMInterface(options) {
        return _get(Collapse.__proto__ || Object.getPrototypeOf(Collapse), '_DOMInterface', this).call(this, Collapse, options);
      }
    }]);

    return Collapse;
  }(_component2.default);

  /**
   * ------------------------------------------------------------------------
   * DOM Api implementation
   * ------------------------------------------------------------------------
   */


  var components = [];

  var collapses = document.querySelectorAll('.' + NAME);
  if (collapses) {
    collapses.forEach(function (element) {
      // const config = {}
      var config = (0, _componentManager.getAttributesConfig)(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
      config.element = element;

      components.push(Collapse._DOMInterface(config));
    });
  }

  if (collapses) {
    document.addEventListener('click', function (event) {
      var target = (0, _utils.findTargetByAttr)(event.target, 'data-toggle');
      if (!target) {
        return;
      }

      var dataToggleAttr = target.getAttribute('data-toggle');

      if (dataToggleAttr && dataToggleAttr === NAME) {
        var id = target.getAttribute('data-target') || target.getAttribute('href');
        id = id.replace('#', '');

        var component = components.find(function (c) {
          return c.getElement().getAttribute('id') === id;
        });

        if (!component) {
          return;
        }

        component.toggle();
      }
    });
  }

  return Collapse;
}();

exports.default = Collapse;

},{"../../core/events":15,"../../core/utils":22,"../component":4,"../componentManager":5}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _dispatch = require('../core/events/dispatch');

var _utils = require('../core/utils');

var _events = require('../core/events');

var _events2 = _interopRequireDefault(_events);

var _componentManager = require('./componentManager');

var _componentManager2 = _interopRequireDefault(_componentManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

var Component = function () {
  function Component(name, version) {
    var defaultOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var optionAttrs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];

    var _this = this;

    var supportDynamicElement = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
    var addToStack = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;

    _classCallCheck(this, Component);

    this.name = name;
    this.version = version;
    this.options = options;

    //this.options = Object.assign(defaultOptions, options)
    /*
    Object.keys(defaultOptions).every((prop) => {
      if (this.options[prop] === undefined) {
        this.options[prop] = defaultOptions[prop]
      }
    })
    */

    this.optionAttrs = optionAttrs;
    this.supportDynamicElement = supportDynamicElement;
    this.addToStack = addToStack;
    this.id = (0, _utils.generateId)();

    var checkElement = !this.supportDynamicElement || this.options.element !== null;

    if (typeof this.options.element === 'string') {
      this.options.element = document.querySelector(this.options.element);
    }

    if (checkElement && !this.options.element) {
      throw new Error(this.name + '. The element is not a HTMLElement.');
    }

    this.dynamicElement = this.options.element === null;
    this.registeredElements = [];

    if (!this.dynamicElement) {
      /**
       * if the element exists, we read the data attributes config
       * then we overwrite existing config keys in JavaScript, so that
       * we keep the following order
       * [1] default JavaScript configuration of the component
       * [2] Data attributes configuration if the element exists in the DOM
       * [3] JavaScript configuration
       */
      this.options = Object.assign(this.options, this.assignJsConfig(this.getAttributes(), options));

      // then, set the new data attributes to the element
      this.setAttributes();
    }

    this.elementListener = function (event) {
      return _this.onBeforeElementEvent(event);
    };
  }

  _createClass(Component, [{
    key: 'assignJsConfig',
    value: function assignJsConfig(attrConfig, options) {
      this.optionAttrs.forEach(function (key) {
        if (options[key]) {
          attrConfig[key] = options[key];
        }
      });

      return attrConfig;
    }
  }, {
    key: 'getVersion',
    value: function getVersion() {
      return this.version;
    }
  }, {
    key: 'getElement',
    value: function getElement() {
      return this.options.element;
    }
  }, {
    key: 'getId',
    value: function getId() {
      return this.id;
    }
  }, {
    key: 'registerElements',
    value: function registerElements(elements) {
      var _this2 = this;

      elements.forEach(function (element) {
        return _this2.registerElement(element);
      });
    }
  }, {
    key: 'registerElement',
    value: function registerElement(element) {
      element.target.addEventListener(element.event, this.elementListener);
      this.registeredElements.push(element);
    }
  }, {
    key: 'unregisterElements',
    value: function unregisterElements() {
      var _this3 = this;

      this.registeredElements.forEach(function (element) {
        _this3.unregisterElement(element);
      });
    }
  }, {
    key: 'unregisterElement',
    value: function unregisterElement(element) {
      var registeredElementIndex = this.registeredElements.findIndex(function (el) {
        return el.target === element.target && el.event === element.event;
      });

      if (registeredElementIndex > -1) {
        element.target.removeEventListener(element.event, this.elementListener);
        this.registeredElements.splice(registeredElementIndex, 1);
      } else {
        console.error('Warning! Unknown registered element: ' + element.target + ' with event: ' + element.event + '.');
      }
    }
  }, {
    key: 'triggerEvent',
    value: function triggerEvent(eventName) {
      var detail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var objectEventOnly = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (this.addToStack) {
        if (eventName === _events2.default.SHOW) {
          _componentManager2.default.add(this);
        } else if (eventName === _events2.default.HIDE) {
          _componentManager2.default.remove(this);
        }
      }

      var eventNameAlias = 'on' + eventName.charAt(0).toUpperCase() + eventName.slice(1);

      // object event
      if (typeof this.options[eventName] === 'function') {
        this.options[eventName].apply(this, [detail]);
      }

      if (typeof this.options[eventNameAlias] === 'function') {
        this.options[eventNameAlias].apply(this, [detail]);
      }

      if (objectEventOnly) {
        return;
      }

      // dom event
      if (this.options.element) {
        (0, _dispatch.dispatchElementEvent)(this.options.element, eventName, this.name, detail);
      } else {
        (0, _dispatch.dispatchWinDocEvent)(eventName, this.name, detail);
      }
    }
  }, {
    key: 'setAttributes',
    value: function setAttributes() {
      if (this.optionAttrs.length > 0) {
        (0, _componentManager.setAttributesConfig)(this.options.element, this.options, this.optionAttrs);
      }
    }
  }, {
    key: 'getAttributes',
    value: function getAttributes() {
      var options = Object.assign({}, this.options);
      return (0, _componentManager.getAttributesConfig)(this.options.element, options, this.optionAttrs);
    }

    /**
     * the preventClosable method manages concurrency between active components.
     * For example, if there is a shown off-canvas and dialog, the last
     * shown component gains the processing priority
     */

  }, {
    key: 'preventClosable',
    value: function preventClosable() {
      return this.addToStack && !_componentManager2.default.closable(this);
    }
  }, {
    key: 'onBeforeElementEvent',
    value: function onBeforeElementEvent(event) {
      if (this.preventClosable()) {
        return;
      }

      this.onElementEvent(event);
    }
  }, {
    key: 'onElementEvent',
    value: function onElementEvent(event) {
      //
    }
  }], [{
    key: '_DOMInterface',
    value: function _DOMInterface(ComponentClass, options) {
      return new ComponentClass(options);
    }
  }]);

  return Component;
}();

exports.default = Component;

},{"../core/events":15,"../core/events/dispatch":14,"../core/utils":22,"./componentManager":5}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.setAttributesConfig = setAttributesConfig;
exports.getAttributesConfig = getAttributesConfig;

var getAttribute = function getAttribute(first, second) {
  if (first === '') {
    return 'data-' + second;
  }
  return 'data-' + first + '-' + second;
};

function setAttributesConfig(element) {
  var obj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var attrs = arguments[2];
  var start = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

  var keys = Object.keys(obj);

  keys.forEach(function (key) {
    if (start === '' && attrs.indexOf(key) === -1) {
      // continue with next iteration
      return;
    }

    if (_typeof(obj[key]) === 'object' && obj[key] !== null) {
      var keyStart = key;
      if (start !== '') {
        keyStart = start + '-' + key;
      }

      setAttributesConfig(element, obj[key], attrs, keyStart);
      return;
    }

    var attr = getAttribute(start, key);
    element.setAttribute(attr, obj[key]);
  });
}

function getAttributesConfig(element) {
  var obj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var attrs = arguments[2];
  var start = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

  var newObj = Object.assign({}, obj);
  var keys = Object.keys(obj);

  keys.forEach(function (key) {
    if (start === '' && attrs.indexOf(key) === -1) {
      // continue with next iteration
      return;
    }

    if (obj[key] !== null && obj[key].constructor === Object) {
      var keyStart = key;
      if (start !== '') {
        keyStart = start + '-' + key;
      }

      newObj[key] = getAttributesConfig(element, obj[key], attrs, keyStart);
      return;
    }

    // update value
    var value = obj[key]; // default value
    var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
    var attr = getAttribute(start, key);
    var attrValue = element.getAttribute(attr);

    if (attrValue !== null) {
      if (type === 'boolean') {
        // convert string to boolean
        value = attrValue === 'true';
      } else if (!isNaN(attrValue)) {
        value = parseInt(attrValue, 10);
      } else {
        value = attrValue;
      }
    }

    newObj[key] = value;
  });

  return newObj;
}

var stack = [];

exports.default = {
  add: function add(component) {
    stack.push(component);
  },
  remove: function remove(component) {
    var index = stack.findIndex(function (c) {
      return Object.is(component, c);
    });
    if (index > -1) {
      stack.splice(index, 1);
    }
  },
  closable: function closable(component) {
    return stack.length === 0 || Object.is(stack[stack.length - 1], component);
  }
};

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _events = require('../../core/events');

var _events2 = _interopRequireDefault(_events);

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _componentManager = require('../componentManager');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Dialog = function () {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'dialog';
  var VERSION = '2.0.0';
  var BACKDROP_SELECTOR = 'dialog-backdrop';
  var DEFAULT_PROPERTIES = {
    element: null,
    title: null,
    message: null,
    cancelable: true
  };
  var DATA_ATTRS_PROPERTIES = ['cancelable'];

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Dialog = function (_Component) {
    _inherits(Dialog, _Component);

    function Dialog() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Dialog);

      var _this = _possibleConstructorReturn(this, (Dialog.__proto__ || Object.getPrototypeOf(Dialog)).call(this, NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, true, true));

      _this.template = '' + '<div class="dialog" tabindex="-1" role="dialog">' + '<div class="dialog-inner" role="document">' + '<div class="dialog-content">' + '<div class="dialog-header">' + '<h5 class="dialog-title"></h5>' + '</div>' + '<div class="dialog-body">' + '<p></p>' + '</div>' + '<div class="dialog-footer">' + '<button type="button" class="btn btn-primary" data-dismiss="dialog">Ok</button>' + '</div>' + '</div>' + '</div>' + '</div>';

      if (_this.dynamicElement) {
        _this.build();
      }
      return _this;
    }

    _createClass(Dialog, [{
      key: 'build',
      value: function build() {
        var builder = document.createElement('div');

        builder.innerHTML = this.template;

        this.options.element = builder.firstChild;

        // title
        if (this.options.title !== null) {
          this.options.element.querySelector('.dialog-title').innerHTML = this.options.title;
        }

        // message
        if (this.options.message !== null) {
          this.options.element.querySelector('.dialog-body').firstChild.innerHTML = this.options.message;
        }

        document.body.appendChild(this.options.element);

        this.setAttributes();
      }
    }, {
      key: 'buildBackdrop',
      value: function buildBackdrop() {
        var backdrop = document.createElement('div');
        backdrop.setAttribute('data-id', this.id);
        backdrop.classList.add(BACKDROP_SELECTOR);

        document.body.appendChild(backdrop);
      }
    }, {
      key: 'getBackdrop',
      value: function getBackdrop() {
        return document.querySelector('.' + BACKDROP_SELECTOR + '[data-id="' + this.id + '"]');
      }
    }, {
      key: 'center',
      value: function center() {
        var computedStyle = window.getComputedStyle(this.options.element);
        // const width = computedStyle.width.slice(0, computedStyle.width.length - 2)
        var height = computedStyle.height.slice(0, computedStyle.height.length - 2);

        var top = window.innerHeight / 2 - height / 2;
        this.options.element.style.top = top + 'px';
      }
    }, {
      key: 'show',
      value: function show() {
        var _this2 = this;

        if (this.options.element === null) {
          // build and insert a new DOM element
          this.build();
        }

        if (this.options.element.classList.contains('show')) {
          return false;
        }

        // add a timeout so that the CSS animation works
        setTimeout(function () {
          _this2.triggerEvent(_events2.default.SHOW);
          _this2.buildBackdrop();

          var onShown = function onShown() {
            _this2.triggerEvent(_events2.default.SHOWN);
            _this2.options.element.removeEventListener(_events2.default.TRANSITION_END, onShown);

            // attach event
            _this2.attachEvents();
          };

          _this2.options.element.addEventListener(_events2.default.TRANSITION_END, onShown);

          _this2.options.element.classList.add('show');

          _this2.center();
        }, 1);

        return true;
      }
    }, {
      key: 'onElementEvent',
      value: function onElementEvent(event) {
        if (event.type === 'keyup' && event.keyCode !== 27 && event.keyCode !== 13) {
          return;
        }

        // hide the dialog
        this.hide();
      }
    }, {
      key: 'hide',
      value: function hide() {
        var _this3 = this;

        if (!this.options.element.classList.contains('show')) {
          return false;
        }

        this.triggerEvent(_events2.default.HIDE);

        this.detachEvents();

        this.options.element.classList.add('hide');
        this.options.element.classList.remove('show');

        var backdrop = this.getBackdrop();

        var onHidden = function onHidden() {
          document.body.removeChild(backdrop);

          _this3.options.element.classList.remove('hide');

          _this3.triggerEvent(_events2.default.HIDDEN);

          backdrop.removeEventListener(_events2.default.TRANSITION_END, onHidden);

          // remove generated dialogs from the DOM
          if (_this3.dynamicElement) {
            document.body.removeChild(_this3.options.element);
            _this3.options.element = null;
          }
        };

        backdrop.addEventListener(_events2.default.TRANSITION_END, onHidden);
        backdrop.classList.add('fadeout');

        return true;
      }
    }, {
      key: 'attachEvents',
      value: function attachEvents() {
        var _this4 = this;

        var dismissButtons = this.options.element.querySelectorAll('[data-dismiss]');
        if (dismissButtons) {
          dismissButtons.forEach(function (button) {
            return _this4.registerElement({ target: button, event: 'click' });
          });
        }

        // add events if the dialog is cancelable
        // which means the user can hide the dialog
        // by pressing the ESC key or click outside the backdrop
        if (this.options.cancelable) {
          var backdrop = this.getBackdrop();
          this.registerElement({ target: backdrop, event: _events2.default.START });
          this.registerElement({ target: document, event: 'keyup' });
        }
      }
    }, {
      key: 'detachEvents',
      value: function detachEvents() {
        var _this5 = this;

        var dismissButtons = this.options.element.querySelectorAll('[data-dismiss]');
        if (dismissButtons) {
          dismissButtons.forEach(function (button) {
            return _this5.unregisterElement({ target: button, event: 'click' });
          });
        }

        if (this.options.cancelable) {
          var backdrop = this.getBackdrop();
          this.unregisterElement({ target: backdrop, event: _events2.default.START });
          this.unregisterElement({ target: document, event: 'keyup' });
        }
      }
    }], [{
      key: '_DOMInterface',
      value: function _DOMInterface(options) {
        return _get(Dialog.__proto__ || Object.getPrototypeOf(Dialog), '_DOMInterface', this).call(this, Dialog, options);
      }
    }]);

    return Dialog;
  }(_component2.default);

  /**
   * ------------------------------------------------------------------------
   * DOM Api implementation
   * ------------------------------------------------------------------------
   */


  var components = [];

  var dialogs = document.querySelectorAll('.' + NAME);
  if (dialogs) {
    dialogs.forEach(function (element) {
      var config = (0, _componentManager.getAttributesConfig)(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
      config.element = element;

      components.push({ element: element, dialog: new Dialog(config) });
    });
  }

  if (dialogs) {
    document.addEventListener('click', function (event) {
      var dataToggleAttr = event.target.getAttribute('data-toggle');
      if (dataToggleAttr && dataToggleAttr === NAME) {
        var id = event.target.getAttribute('data-target');
        var element = document.querySelector(id);

        var component = components.find(function (c) {
          return c.element === element;
        });

        if (!component) {
          return;
        }

        event.target.blur();

        component.dialog.show();
      }
    });
  }

  return Dialog;
}();

exports.default = Dialog;

},{"../../core/events":15,"../component":4,"../componentManager":5}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _events = require('../../core/events');

var _events2 = _interopRequireDefault(_events);

var _utils = require('../../core/utils');

var _componentManager = require('../componentManager');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Dropdown = function () {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'dropdown';
  var VERSION = '2.0.0';
  var DEFAULT_PROPERTIES = {
    element: null,
    default: true
  };
  var DATA_ATTRS_PROPERTIES = ['default'];

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Dropdown = function (_Component) {
    _inherits(Dropdown, _Component);

    function Dropdown() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Dropdown);

      var _this = _possibleConstructorReturn(this, (Dropdown.__proto__ || Object.getPrototypeOf(Dropdown)).call(this, NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false));

      var selected = _this.options.element.querySelector('[data-selected]');
      var item = _this.getItemData(selected);

      _this.setSelected(item.value, item.text, false);
      return _this;
    }

    _createClass(Dropdown, [{
      key: 'setPosition',
      value: function setPosition(button) {}
    }, {
      key: 'setSelected',
      value: function setSelected() {
        var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var text = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var checkExists = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        if (!this.options.default) {
          return false;
        }

        var textDisplay = text;
        this.options.element.querySelector('.default-text').innerHTML = text;
        this.options.element.querySelector('input[type="hidden"]').value = value;

        if (checkExists) {
          var found = false;
          var items = this.options.element.querySelectorAll('.item');
          if (items) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var item = _step.value;

                var data = this.getItemData(item);
                if (value === data.value) {
                  // update the text to display if it is null only
                  if (textDisplay === null) {
                    textDisplay = data.text;
                  }
                  found = true;
                  break;
                }
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }
          }

          this.options.element.querySelector('.default-text').innerHTML = textDisplay;
          this.options.element.querySelector('input[type="hidden"]').value = value;

          if (!found) {
            throw new Error(NAME + '. The value "' + value + '" does not exist in the list of items.');
          }
        }
      }
    }, {
      key: 'getSelected',
      value: function getSelected() {
        return this.options.element.querySelector('input[type="hidden"]').value;
      }
    }, {
      key: 'getItemData',
      value: function getItemData() {
        var item = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        var text = '';
        var value = '';

        if (item) {
          text = item.getAttribute('data-text') || item.innerHTML;

          var selectedTextNode = item.querySelector('.text');
          if (selectedTextNode) {
            text = selectedTextNode.innerHTML;
          }

          value = item.getAttribute('data-value');
        }

        return { text: text, value: value };
      }
    }, {
      key: 'onElementEvent',
      value: function onElementEvent(event) {
        if (event.type === _events2.default.START) {
          var dropdown = (0, _utils.findTargetByClass)(event.target, 'dropdown');
          if (!dropdown) {
            this.hide();
          }
        } else if (event.type === 'click') {
          var item = (0, _utils.findTargetByClass)(event.target, 'item');

          if (item) {
            if (item.classList.contains('disabled')) {
              return;
            }

            var itemInfo = this.getItemData(item);
            this.setSelected(itemInfo.value, itemInfo.text, false);

            var detail = { item: item, text: itemInfo.text, value: itemInfo.value };
            this.triggerEvent(_events2.default.ITEM_SELECTED, detail);

            this.hide();
            return;
          }

          // don't toggle the dropdown if the event concerns headers, dividers
          var dropdownMenu = (0, _utils.findTargetByClass)(event.target, 'dropdown-menu');
          if (dropdownMenu) {
            return;
          }

          this.toggle();
        }
      }
    }, {
      key: 'toggle',
      value: function toggle() {
        if (this.options.element.classList.contains('active')) {
          return this.hide();
        }

        return this.show();
      }
    }, {
      key: 'show',
      value: function show() {
        if (this.options.element.classList.contains('active')) {
          return false;
        }

        this.options.element.classList.add('active');

        var dropdownMenu = this.options.element.querySelector('.dropdown-menu');

        // scroll to top
        dropdownMenu.scrollTop = 0;

        this.triggerEvent(_events2.default.SHOW);
        this.triggerEvent(_events2.default.SHOWN);

        this.registerElement({ target: dropdownMenu, event: 'click' });
        this.registerElement({ target: document.body, event: _events2.default.START });

        return true;
      }
    }, {
      key: 'hide',
      value: function hide() {
        if (!this.options.element.classList.contains('active')) {
          return false;
        }

        this.options.element.classList.remove('active');

        this.triggerEvent(_events2.default.HIDE);
        this.triggerEvent(_events2.default.HIDDEN);

        this.unregisterElement({ target: this.options.element.querySelector('.dropdown-menu'), event: 'click' });
        this.unregisterElement({ target: document.body, event: _events2.default.START });

        return true;
      }
    }], [{
      key: '_DOMInterface',
      value: function _DOMInterface(options) {
        return _get(Dropdown.__proto__ || Object.getPrototypeOf(Dropdown), '_DOMInterface', this).call(this, Dropdown, options);
      }
    }]);

    return Dropdown;
  }(_component2.default);

  /**
   * ------------------------------------------------------------------------
   * DOM Api implementation
   * ------------------------------------------------------------------------
   */


  var components = [];

  var dropdowns = document.querySelectorAll('.' + NAME);
  if (dropdowns) {
    dropdowns.forEach(function (element) {
      var config = (0, _componentManager.getAttributesConfig)(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
      config.element = element;

      components.push(new Dropdown(config));
    });
  }

  if (dropdowns) {
    document.addEventListener('click', function (event) {
      var dropdownMenu = (0, _utils.findTargetByClass)(event.target, 'dropdown-menu');
      if (dropdownMenu) {
        return;
      }

      var dropdown = (0, _utils.findTargetByClass)(event.target, 'dropdown');

      if (dropdown) {
        var dataToggleAttr = dropdown.getAttribute('data-toggle');
        if (dataToggleAttr && dataToggleAttr === NAME && dropdown) {
          var component = components.find(function (c) {
            return c.getElement() === dropdown;
          });

          if (!component) {
            return;
          }

          component.toggle();
        }
      }
    });
  }

  return Dropdown;
}();

exports.default = Dropdown;

},{"../../core/events":15,"../../core/utils":22,"../component":4,"../componentManager":5}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Loader = function () {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'loader';
  var VERSION = '2.0.0';
  var DEFAULT_PROPERTIES = {
    element: null,
    color: null,
    size: null
  };
  var DATA_ATTRS_PROPERTIES = [];

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Loader = function (_Component) {
    _inherits(Loader, _Component);

    function Loader() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Loader);

      // set color
      var _this = _possibleConstructorReturn(this, (Loader.__proto__ || Object.getPrototypeOf(Loader)).call(this, NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false));

      var loaderSpinner = _this.getSpinner();
      if (typeof _this.options.color === 'string' && !loaderSpinner.classList.contains('color-' + _this.options.color)) {
        loaderSpinner.classList.add('color-' + _this.options.color);
      }

      _this.customSize = _this.options.size !== null;
      return _this;
    }

    _createClass(Loader, [{
      key: 'getClientSize',
      value: function getClientSize() {
        if (!this.customSize) {
          var size = this.options.element.getBoundingClientRect();
          return size.height;
        }

        return this.options.size;
      }
    }, {
      key: 'getSpinner',
      value: function getSpinner() {
        return this.options.element.querySelector('.loader-spinner');
      }
    }, {
      key: 'show',
      value: function show() {
        if (this.options.element.classList.contains('hide')) {
          this.options.element.classList.remove('hide');
        }

        var size = this.getClientSize();
        this.options.size = size;

        if (this.customSize) {
          this.options.element.style.width = this.options.size + 'px';
          this.options.element.style.height = this.options.size + 'px';

          var loaderSpinner = this.getSpinner();
          loaderSpinner.style.width = this.options.size + 'px';
          loaderSpinner.style.height = this.options.size + 'px';
        }

        return true;
      }
    }, {
      key: 'animate',
      value: function animate() {
        var startAnimation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        if (startAnimation) {
          this.show();
        } else {
          this.hide();
        }

        var loaderSpinner = this.getSpinner();

        if (startAnimation && !loaderSpinner.classList.contains('loader-spinner-animated')) {
          loaderSpinner.classList.add('loader-spinner-animated');
          return true;
        }

        if (!startAnimation && loaderSpinner.classList.contains('loader-spinner-animated')) {
          loaderSpinner.classList.remove('loader-spinner-animated');
        }

        return true;
      }
    }, {
      key: 'hide',
      value: function hide() {
        if (!this.options.element.classList.contains('hide')) {
          this.options.element.classList.add('hide');
        }

        return true;
      }
    }], [{
      key: '_DOMInterface',
      value: function _DOMInterface(options) {
        return _get(Loader.__proto__ || Object.getPrototypeOf(Loader), '_DOMInterface', this).call(this, Loader, options);
      }
    }]);

    return Loader;
  }(_component2.default);

  return Loader;
}();

exports.default = Loader;

},{"../component":4}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _events = require('../../core/events');

var _events2 = _interopRequireDefault(_events);

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */


var Notification = function () {
  /**
   * ------------------------------------------------------------------------
  * Constants
  * ------------------------------------------------------------------------
  */

  var NAME = 'notification';
  var VERSION = '2.0.0';
  var DEFAULT_PROPERTIES = {
    element: null,
    message: '',
    showButton: true,
    timeout: null,
    background: 'primary'
  };
  var DATA_ATTRS_PROPERTIES = ['timeout'];

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Notification = function (_Component) {
    _inherits(Notification, _Component);

    function Notification() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Notification);

      var _this = _possibleConstructorReturn(this, (Notification.__proto__ || Object.getPrototypeOf(Notification)).call(this, NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, true, false));

      _this.template = '' + '<div class="notification">' + '<div class="notification-inner">' + '<div class="message"></div>' + '<button type="button" class="close" data-dismiss="notification" aria-label="Close">' + '<span aria-hidden="true">&times;</span>' + '</button>' + '</div>' + '</div>';

      if (_this.dynamicElement) {
        _this.build();
      }

      _this.timeoutCallback = null;
      return _this;
    }

    _createClass(Notification, [{
      key: 'build',
      value: function build() {
        var builder = document.createElement('div');

        builder.innerHTML = this.template;

        this.options.element = builder.firstChild;

        // text message
        this.options.element.querySelector('.message').innerHTML = this.options.message;

        if (!this.options.showButton) {
          this.options.element.querySelector('button').style.display = 'none';
        }

        document.body.appendChild(this.options.element);

        this.setAttributes();
      }
    }, {
      key: 'show',
      value: function show() {
        var _this2 = this;

        if (this.options.element === null) {
          // build and insert a new DOM element
          this.build();
        }

        if (this.options.element.classList.contains('show')) {
          return false;
        }

        // reset color
        if (this.options.background) {
          this.options.element.removeAttribute('class');
          this.options.element.setAttribute('class', 'notification');

          this.options.element.classList.add('bg-' + this.options.background);
          this.options.element.querySelector('button').classList.add('btn-' + this.options.background);
        }

        if (this.options.showButton) {
          // attach the button handler
          var buttonElement = this.options.element.querySelector('button');
          this.registerElement({ target: buttonElement, event: 'click' });
        }

        setTimeout(function () {
          _this2.options.element.classList.add('show');
          _this2.triggerEvent(_events2.default.SHOW);

          var onShown = function onShown() {
            _this2.triggerEvent(_events2.default.SHOWN);
            _this2.options.element.removeEventListener(_events2.default.TRANSITION_END, onShown);
          };

          _this2.options.element.addEventListener(_events2.default.TRANSITION_END, onShown);
        }, 1);

        if (Number.isInteger(this.options.timeout) && this.options.timeout > 0) {
          // if there is a timeout, auto hide the notification
          this.timeoutCallback = setTimeout(function () {
            _this2.hide();
          }, this.options.timeout + 1);
        }

        return true;
      }
    }, {
      key: 'hide',
      value: function hide() {
        var _this3 = this;

        /*
         * prevent to close a notification with a timeout
         * if the user has already clicked on the button
         */
        if (this.timeoutCallback) {
          clearTimeout(this.timeoutCallback);
          this.timeoutCallback = null;
        }

        if (!this.options.element.classList.contains('show')) {
          return false;
        }

        this.triggerEvent(_events2.default.HIDE);

        if (this.options.showButton) {
          var buttonElement = this.options.element.querySelector('button');
          this.unregisterElement({ target: buttonElement, event: 'click' });
        }

        this.options.element.classList.remove('show');
        this.options.element.classList.add('hide');

        var onHidden = function onHidden() {
          _this3.options.element.removeEventListener(_events2.default.TRANSITION_END, onHidden);
          _this3.options.element.classList.remove('hide');

          _this3.triggerEvent(_events2.default.HIDDEN);

          if (_this3.dynamicElement) {
            document.body.removeChild(_this3.options.element);
            _this3.options.element = null;
          }
        };

        this.options.element.addEventListener(_events2.default.TRANSITION_END, onHidden);

        return true;
      }
    }, {
      key: 'onElementEvent',
      value: function onElementEvent() {
        this.hide();
      }
    }], [{
      key: '_DOMInterface',
      value: function _DOMInterface(options) {
        return _get(Notification.__proto__ || Object.getPrototypeOf(Notification), '_DOMInterface', this).call(this, Notification, options);
      }
    }]);

    return Notification;
  }(_component2.default);

  return Notification;
}();

exports.default = Notification;

},{"../../core/events":15,"../component":4}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _events = require('../../core/events');

var _events2 = _interopRequireDefault(_events);

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _componentManager = require('../componentManager');

var _utils = require('../../core/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var OffCanvas = function () {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'off-canvas';
  var VERSION = '2.0.0';
  var BACKDROP_SELECTOR = 'off-canvas-backdrop';
  var DEFAULT_PROPERTIES = {
    element: null,
    aside: {
      md: false,
      lg: false,
      xl: false
    }
  };
  var DATA_ATTRS_PROPERTIES = ['aside'];

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var OffCanvas = function (_Component) {
    _inherits(OffCanvas, _Component);

    function OffCanvas() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, OffCanvas);

      var _this = _possibleConstructorReturn(this, (OffCanvas.__proto__ || Object.getPrototypeOf(OffCanvas)).call(this, NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, true));

      _this.useBackdrop = true;
      _this.currentWidth = null;
      _this.animate = true;

      var sm = { name: 'sm', media: window.matchMedia('(min-width: 1px)') };
      var md = { name: 'md', media: window.matchMedia('(min-width: 768px)') };
      var lg = { name: 'lg', media: window.matchMedia('(min-width: 992px)') };
      var xl = { name: 'xl', media: window.matchMedia('(min-width: 1200px)') };

      var sizes = [sm, md, lg, xl].reverse();

      var checkWidth = function checkWidth() {
        if (!('matchMedia' in window)) {
          return;
        }

        sizes.every(function (size) {
          var match = size.media.media.match(/[a-z]?-width:\s?([0-9]+)/);

          if (match) {
            if (size.media.matches) {
              if (_this.currentWidth !== size.name) {
                _this.setAside(size.name);
              }
              _this.currentWidth = size.name;
              return false;
            }
          }

          return true;
        });
      };

      checkWidth();

      window.addEventListener('resize', checkWidth, false);
      return _this;
    }

    _createClass(OffCanvas, [{
      key: 'preventClosable',
      value: function preventClosable() {
        return _get(OffCanvas.prototype.__proto__ || Object.getPrototypeOf(OffCanvas.prototype), 'preventClosable', this).call(this) || this.options.aside[this.currentWidth] === true;
      }
    }, {
      key: 'setAside',
      value: function setAside(name) {
        var content = document.body;

        if (this.options.aside[name] === true) {
          if (!content.classList.contains('off-canvas-aside')) {
            content.classList.add('off-canvas-aside');
          }

          this.useBackdrop = false;

          // avoid animation by setting animate to false
          this.animate = false;
          this.show();
          // remove previous backdrop
          this.removeBackdrop();
        } else {
          if (content.classList.contains('off-canvas-aside')) {
            content.classList.remove('off-canvas-aside');
          }

          this.hide();
          this.useBackdrop = true;
          this.animate = true;
        }
      }
    }, {
      key: 'onElementEvent',
      value: function onElementEvent(event) {
        if (event.type === 'keyup' && event.keyCode !== 27 && event.keyCode !== 13) {
          return;
        }

        // hide the off-canvas
        this.hide();
      }
    }, {
      key: 'show',
      value: function show() {
        var _this2 = this;

        if (this.options.element.classList.contains('show')) {
          return false;
        }

        // add a timeout so that the CSS animation works
        setTimeout(function () {
          _this2.triggerEvent(_events2.default.SHOW);

          var onShown = function onShown() {
            _this2.triggerEvent(_events2.default.SHOWN);

            if (_this2.animate) {
              _this2.options.element.removeEventListener(_events2.default.TRANSITION_END, onShown);
              _this2.options.element.classList.remove('animate');
            }
          };

          if (_this2.useBackdrop) {
            _this2.createBackdrop();
          }

          if (_this2.animate) {
            _this2.options.element.addEventListener(_events2.default.TRANSITION_END, onShown);
            _this2.options.element.classList.add('animate');
          } else {
            // directly trigger the onShown
            onShown();
          }

          _this2.options.element.classList.add('show');

          // attach event
          _this2.attachEvents();
        }, 1);

        return true;
      }
    }, {
      key: 'hide',
      value: function hide() {
        var _this3 = this;

        if (!this.options.element.classList.contains('show')) {
          return false;
        }

        this.triggerEvent(_events2.default.HIDE);

        this.detachEvents();

        if (this.animate) {
          this.options.element.classList.add('animate');
        }

        this.options.element.classList.remove('show');

        if (this.useBackdrop) {
          var backdrop = this.getBackdrop();

          var onHidden = function onHidden() {
            if (_this3.animate) {
              _this3.options.element.classList.remove('animate');
            }

            backdrop.removeEventListener(_events2.default.TRANSITION_END, onHidden);
            _this3.triggerEvent(_events2.default.HIDDEN);
            _this3.removeBackdrop();
          };

          backdrop.addEventListener(_events2.default.TRANSITION_END, onHidden);
          backdrop.classList.add('fadeout');
        }

        return true;
      }
    }, {
      key: 'createBackdrop',
      value: function createBackdrop() {
        var backdrop = document.createElement('div');
        backdrop.setAttribute('data-id', this.id);
        backdrop.classList.add(BACKDROP_SELECTOR);

        document.body.appendChild(backdrop);
      }
    }, {
      key: 'getBackdrop',
      value: function getBackdrop() {
        return document.querySelector('.' + BACKDROP_SELECTOR + '[data-id="' + this.id + '"]');
      }
    }, {
      key: 'removeBackdrop',
      value: function removeBackdrop() {
        var backdrop = this.getBackdrop();
        if (backdrop) {
          document.body.removeChild(backdrop);
        }
      }
    }, {
      key: 'attachEvents',
      value: function attachEvents() {
        var _this4 = this;

        var dismissButtons = this.options.element.querySelectorAll('[data-dismiss]');

        if (dismissButtons) {
          dismissButtons.forEach(function (button) {
            return _this4.registerElement({ target: button, event: 'click' });
          });
        }

        if (this.useBackdrop) {
          var backdrop = this.getBackdrop();
          this.registerElement({ target: backdrop, event: _events2.default.START });
        }

        this.registerElement({ target: document, event: 'keyup' });
      }
    }, {
      key: 'detachEvents',
      value: function detachEvents() {
        var _this5 = this;

        var dismissButtons = this.options.element.querySelectorAll('[data-dismiss]');

        if (dismissButtons) {
          dismissButtons.forEach(function (button) {
            return _this5.unregisterElement({ target: button, event: 'click' });
          });
        }

        if (this.useBackdrop) {
          var backdrop = this.getBackdrop();
          this.unregisterElement({ target: backdrop, event: _events2.default.START });
        }

        this.unregisterElement({ target: document, event: 'keyup' });
      }
    }], [{
      key: '_DOMInterface',
      value: function _DOMInterface(options) {
        return _get(OffCanvas.__proto__ || Object.getPrototypeOf(OffCanvas), '_DOMInterface', this).call(this, OffCanvas, options);
      }
    }]);

    return OffCanvas;
  }(_component2.default);

  /**
   * ------------------------------------------------------------------------
   * DOM Api implementation
   * ------------------------------------------------------------------------
   */


  var components = [];

  var offCanvas = document.querySelectorAll('.' + NAME);
  if (offCanvas) {
    offCanvas.forEach(function (element) {
      var config = (0, _componentManager.getAttributesConfig)(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
      config.element = element;

      components.push({ element: element, offCanvas: new OffCanvas(config) });
    });
  }

  if (offCanvas) {
    document.addEventListener('click', function (event) {
      var target = (0, _utils.findTargetByAttr)(event.target, 'data-toggle');
      if (!target) {
        return;
      }

      var dataToggleAttr = target.getAttribute('data-toggle');
      if (dataToggleAttr && dataToggleAttr === NAME) {
        var id = target.getAttribute('data-target');
        var element = document.querySelector(id);

        var component = components.find(function (c) {
          return c.element === element;
        });

        if (!component) {
          return;
        }

        target.blur();

        component.offCanvas.show();
      }
    });
  }

  return OffCanvas;
}();

exports.default = OffCanvas;

},{"../../core/events":15,"../../core/utils":22,"../component":4,"../componentManager":5}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _events = require('../../core/events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Progress = function () {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'progress';
  var VERSION = '2.0.0';
  var DEFAULT_PROPERTIES = {
    element: null,
    height: 5,
    min: 0,
    max: 100,
    label: false,
    striped: false,
    background: null
  };
  var DATA_ATTRS_PROPERTIES = ['height', 'min', 'max', 'label', 'striped', 'background'];

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Progress = function (_Component) {
    _inherits(Progress, _Component);

    function Progress() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Progress);

      // set the wanted height
      var _this = _possibleConstructorReturn(this, (Progress.__proto__ || Object.getPrototypeOf(Progress)).call(this, NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false));

      _this.options.element.style.height = _this.options.height + 'px';

      // set min and max values
      var progressBar = _this.getProgressBar();
      progressBar.setAttribute('aria-valuemin', '' + _this.options.min);
      progressBar.setAttribute('aria-valuemax', '' + _this.options.max);

      // set striped
      if (_this.options.striped && !progressBar.classList.contains('progress-bar-striped')) {
        progressBar.classList.add('progress-bar-striped');
      }

      // set background
      if (typeof _this.options.background === 'string' && !progressBar.classList.contains('bg-' + _this.options.background)) {
        progressBar.classList.add('bg-' + _this.options.background);
      }
      return _this;
    }

    _createClass(Progress, [{
      key: 'getProgressBar',
      value: function getProgressBar() {
        return this.options.element.querySelector('.progress-bar');
      }
    }, {
      key: 'set',
      value: function set() {
        var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

        var progressBar = this.getProgressBar();
        var progress = Math.round(value / (this.options.min + this.options.max) * 100);

        if (value < this.options.min) {
          console.error(NAME + '. Warning, ' + value + ' is under min value.');
          return false;
        }

        if (value > this.options.max) {
          console.error(NAME + '. Warning, ' + value + ' is above max value.');
          return false;
        }

        progressBar.setAttribute('aria-valuenow', '' + value);

        // set label
        if (this.options.label) {
          progressBar.innerHTML = progress + '%';
        }

        // set percentage
        progressBar.style.width = progress + '%';

        return true;
      }
    }, {
      key: 'animate',
      value: function animate() {
        var startAnimation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        if (!this.options.striped) {
          console.error(NAME + '. Animation works only with striped progress.');
          return false;
        }

        var progressBar = this.getProgressBar();

        if (startAnimation && !progressBar.classList.contains('progress-bar-animated')) {
          progressBar.classList.add('progress-bar-animated');
        }

        if (!startAnimation && progressBar.classList.contains('progress-bar-animated')) {
          progressBar.classList.remove('progress-bar-animated');
        }

        return true;
      }
    }, {
      key: 'show',
      value: function show() {
        this.options.element.style.height = this.options.height + 'px';
        this.triggerEvent(_events2.default.SHOW);
        this.triggerEvent(_events2.default.SHOWN);

        return true;
      }
    }, {
      key: 'hide',
      value: function hide() {
        this.options.element.style.height = '0px';
        this.triggerEvent(_events2.default.HIDE);
        this.triggerEvent(_events2.default.HIDDEN);

        return true;
      }
    }], [{
      key: '_DOMInterface',
      value: function _DOMInterface(options) {
        return _get(Progress.__proto__ || Object.getPrototypeOf(Progress), '_DOMInterface', this).call(this, Progress, options);
      }
    }]);

    return Progress;
  }(_component2.default);

  return Progress;
}();

exports.default = Progress;

},{"../../core/events":15,"../component":4}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _componentManager = require('../componentManager');

var _events = require('../../core/events');

var _events2 = _interopRequireDefault(_events);

var _utils = require('../../core/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Tab = function () {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'tab';
  var VERSION = '2.0.0';
  var DEFAULT_PROPERTIES = {};
  var DATA_ATTRS_PROPERTIES = [];
  var TAB_CONTENT_SELECTOR = '.tab-pane';

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Tab = function (_Component) {
    _inherits(Tab, _Component);

    function Tab() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Tab);

      return _possibleConstructorReturn(this, (Tab.__proto__ || Object.getPrototypeOf(Tab)).call(this, NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false));
    }

    _createClass(Tab, [{
      key: 'show',
      value: function show() {
        if (this.options.element.classList.contains('active')) {
          return false;
        }

        var id = this.options.element.getAttribute('href');
        var nav = (0, _utils.findTargetByClass)(this.options.element, 'nav');
        var navTabs = nav ? nav.querySelectorAll('[data-toggle="' + NAME + '"]') : null;

        if (navTabs) {
          navTabs.forEach(function (tab) {
            if (tab.classList.contains('active')) {
              tab.classList.remove('active');
            }
            tab.setAttribute('aria-selected', false);
          });
        }

        this.options.element.classList.add('active');
        this.options.element.setAttribute('aria-selected', true);

        var tabContent = document.querySelector(id);
        var tabContents = tabContent.parentNode.querySelectorAll(TAB_CONTENT_SELECTOR);

        if (tabContents) {
          tabContents.forEach(function (tab) {
            if (tab.classList.contains('active')) {
              tab.classList.remove('active');
            }
          });
        }

        tabContent.classList.add('showing');

        setTimeout(function () {
          var onShowed = function onShowed() {
            tabContent.classList.remove('animate');
            tabContent.classList.add('active');
            tabContent.classList.remove('showing');
            tabContent.removeEventListener(_events2.default.TRANSITION_END, onShowed);
          };

          tabContent.addEventListener(_events2.default.TRANSITION_END, onShowed);

          tabContent.classList.add('animate');
        }, 20);

        return true;
      }
    }, {
      key: 'hide',
      value: function hide() {
        if (!this.options.element.classList.contains('active')) {
          return false;
        }

        if (this.options.element.classList.contains('active')) {
          this.options.element.classList.remove('active');
        }

        this.options.element.setAttribute('aria-selected', false);

        var id = this.options.element.getAttribute('href');
        var tabContent = document.querySelector(id);

        if (tabContent.classList.contains('active')) {
          tabContent.classList.remove('active');
        }

        return true;
      }
    }], [{
      key: '_DOMInterface',
      value: function _DOMInterface(options) {
        return _get(Tab.__proto__ || Object.getPrototypeOf(Tab), '_DOMInterface', this).call(this, Tab, options);
      }
    }]);

    return Tab;
  }(_component2.default);

  /**
   * ------------------------------------------------------------------------
   * DOM Api implementation
   * ------------------------------------------------------------------------
   */


  var components = [];

  var tabs = document.querySelectorAll('[data-toggle="' + NAME + '"]');
  if (tabs) {
    tabs.forEach(function (element) {
      // const config = {}
      var config = (0, _componentManager.getAttributesConfig)(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
      config.element = element;

      components.push(Tab._DOMInterface(config));
    });
  }

  if (tabs) {
    document.addEventListener('click', function (event) {
      var dataToggleAttr = event.target.getAttribute('data-toggle');
      if (dataToggleAttr && dataToggleAttr === NAME) {
        var id = event.target.getAttribute('href');

        var component = components.find(function (c) {
          return c.getElement().getAttribute('href') === id;
        });

        if (!component) {
          return;
        }

        component.show();
      }
    });
  }

  return Tab;
}();

exports.default = Tab;

},{"../../core/events":15,"../../core/utils":22,"../component":4,"../componentManager":5}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var Ajax = function () {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'ajax';
  var VERSION = '2.0.0';

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Ajax = function () {
    /**
     * Creates an instance of Ajax.
     * @param {{method: string, url: string, complete: Function, success: Function, error: Function, data: any, crossDomain: boolean, headers: {[header: string]: string}, timeout: number, contentType: number, dataType: string }} opts
     */
    function Ajax(opts) {
      _classCallCheck(this, Ajax);

      if ((typeof opts === 'undefined' ? 'undefined' : _typeof(opts)) !== 'object') {
        throw new Error(NAME + '-' + VERSION);
      }
      this.opts = opts;
      this.errorCode = null;
    }

    _createClass(Ajax, [{
      key: 'createXhr',
      value: function createXhr() {
        var xhr = new XMLHttpRequest();
        if ('withCredentials' in xhr && this.opts.crossDomain === true) {
          xhr.withCredentials = true;
        }
        return xhr;
      }

      /**
       * Set headers
       * @param {{[header: string]: string}} headers
       */

    }, {
      key: 'setHeaders',
      value: function setHeaders() {
        var headers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        for (var key in headers) {
          this.xhr.setRequestHeader(key, headers[key]);
        }
      }
    }, {
      key: 'onPreExecute',
      value: function onPreExecute() {
        var _this = this;

        if (_typeof(this.opts.headers) === 'object') {
          this.setHeaders(this.opts.headers);
        }

        if (typeof this.opts.timeout === 'number') {
          this.xhr.timeout = this.opts.timeout;
          this.xhr.ontimeout = function () {
            _this.errorCode = 'TIMEOUT_EXCEEDED';
          };
        }

        if (typeof this.opts.contentType === 'string') {
          this.setHeaders({ 'Content-type': this.opts.contentType });
        }

        if (this.opts.dataType === 'xml' && this.xhr.overrideMimeType) {
          this.xhr.overrideMimeType('application/xml; charset=utf-8');
        }
      }
    }, {
      key: 'parseResponse',
      value: function parseResponse() {
        var response = null;
        if (this.opts.dataType === 'json') {
          try {
            response = JSON.parse(this.xhr.responseText);
          } catch (error) {
            this.errorCode = 'JSON_MALFORMED';
          }
        } else if (this.opts.dataType === 'xml') {
          response = this.xhr.responseXML;
        } else {
          response = this.xhr.responseText;
        }
        return response;
      }
    }, {
      key: 'runRequest',
      value: function runRequest() {
        var _this2 = this;

        this.xhr = this.createXhr();
        this.xhr.open(this.opts.method, this.opts.url, true);
        this.onPreExecute();

        this.xhr.onreadystatechange = function () {
          if (parseInt(_this2.xhr.readyState) === 4) {
            var status = _this2.xhr.status.toString();

            // response received
            if (typeof _this2.opts.complete === 'function') {
              _this2.opts.complete(_this2.errorCode, _this2.xhr);
            }

            // success 2xx
            if (status[0] === '2') {
              if (typeof _this2.opts.success === 'function') {
                _this2.opts.success(_this2.parseResponse(), _this2.xhr);
              }
              return;
            }

            // error (1xx, 2xx, 3xx, 5xx)
            if (typeof _this2.opts.error === 'function') {
              // Timeout in order to wait on the timeout limit
              window.setTimeout(function () {
                _this2.opts.error(_this2.errorCode, _this2.xhr);
              }, 1);
            }
          }
        };
        this.xhr.send(this.opts.data);

        return this;
      }
    }, {
      key: 'cancel',
      value: function cancel() {
        this.errorCode = 'CANCELED';
        if (this.xhr) {
          this.xhr.abort();
        }
        this.xhr = null;
      }

      // getters

    }], [{
      key: '_DOMInterface',


      // public

      // static
      value: function _DOMInterface(opts) {
        return new Ajax(opts).runRequest();
      }
    }, {
      key: 'version',
      get: function get() {
        return NAME + '.' + VERSION;
      }
    }]);

    return Ajax;
  }();

  return Ajax;
}();

exports.default = Ajax;

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dispatchWinDocEvent = dispatchWinDocEvent;
exports.dispatchElementEvent = dispatchElementEvent;
exports.dispatchPageEvent = dispatchPageEvent;
function dispatchWinDocEvent(eventName, moduleName) {
  var detail = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var fullEventName = eventName + ".ph." + moduleName;
  window.dispatchEvent(new CustomEvent(fullEventName, { detail: detail }));
  document.dispatchEvent(new CustomEvent(fullEventName, { detail: detail }));
}

function dispatchElementEvent(domElement, eventName, moduleName) {
  var detail = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var fullEventName = eventName + ".ph." + moduleName;
  domElement.dispatchEvent(new CustomEvent(fullEventName, { detail: detail }));
}

function dispatchPageEvent(eventName, pageName) {
  var detail = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var fullEventName = pageName + "." + eventName;
  window.dispatchEvent(new CustomEvent(fullEventName, { detail: detail }));
  document.dispatchEvent(new CustomEvent(fullEventName, { detail: detail }));
}

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// @todo keep ?
if (typeof window !== 'undefined') {
  window.addEventListener('error', function () {
    console.error('An error has occured! You can pen an issue here: https://github.com/quark-dev/Phonon-Framework/issues');
  });
}

// Use available events
var availableEvents = ['mousedown', 'mousemove', 'mouseup'];
var touchScreen = false;

if (typeof window !== 'undefined') {
  if ('ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch) {
    touchScreen = true;
    availableEvents = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
  }

  if (window.navigator.pointerEnabled) {
    availableEvents = ['pointerdown', 'pointermove', 'pointerup', 'pointercancel'];
  } else if (window.navigator.msPointerEnabled) {
    availableEvents = ['MSPointerDown', 'MSPointerMove', 'MSPointerUp', 'MSPointerCancel'];
  }
}

var el = document.createElement('div');
var transitions = [{ name: 'transition', start: 'transitionstart', end: 'transitionend' }, { name: 'MozTransition', start: 'transitionstart', end: 'transitionend' }, { name: 'msTransition', start: 'msTransitionStart', end: 'msTransitionEnd' }, { name: 'WebkitTransition', start: 'webkitTransitionStart', end: 'webkitTransitionEnd' }];
var animations = [{ name: 'animation', start: 'animationstart', end: 'animationend' }, { name: 'MozAnimation', start: 'animationstart', end: 'animationend' }, { name: 'msAnimation', start: 'msAnimationStart', end: 'msAnimationEnd' }, { name: 'WebkitAnimation', start: 'webkitAnimationStart', end: 'webkitAnimationEnd' }];

var transitionStart = transitions.find(function (t) {
  return el.style[t.name] !== undefined;
}).start;
var transitionEnd = transitions.find(function (t) {
  return el.style[t.name] !== undefined;
}).end;
var animationStart = animations.find(function (t) {
  return el.style[t.name] !== undefined;
}).start;
var animationEnd = animations.find(function (t) {
  return el.style[t.name] !== undefined;
}).end;

exports.default = {
  // touch screen support
  TOUCH_SCREEN: touchScreen,

  // network
  NETWORK_ONLINE: 'online',
  NETWORK_OFFLINE: 'offline',

  // user interface states
  SHOW: 'show',
  SHOWN: 'shown',
  HIDE: 'hide',
  HIDDEN: 'hidden',

  // hash
  HASH: 'hash',

  // touch, mouse and pointer events polyfill
  START: availableEvents[0],
  MOVE: availableEvents[1],
  END: availableEvents[2],
  CANCEL: typeof availableEvents[3] === 'undefined' ? null : availableEvents[3],

  // transitions
  TRANSITION_START: transitionStart,
  TRANSITION_END: transitionEnd,

  // animations
  ANIMATION_START: animationStart,
  ANIMATION_END: animationEnd,

  // dropdown
  ITEM_SELECTED: 'itemSelected'
};

},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* --------------------------------------------------------------------------
* Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
* --------------------------------------------------------------------------
*/

var Binder = function () {
  /**
  * ------------------------------------------------------------------------
  * Constants
  * ------------------------------------------------------------------------
  */

  var NAME = 'intl-binder';
  var VERSION = '2.0.0';

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Binder = function () {
    function Binder(element, data) {
      _classCallCheck(this, Binder);

      this.element = element;
      this.data = data;

      if (!this.isElement(this.element)) {
        return;
      }

      // array of HTMLElement
      if (this.element.length && this.element.length > 0) {
        this.setNodes(this.element);
      } else {
        // single HTMLElement
        this.setNode(this.element);
      }
    }

    // getters

    _createClass(Binder, [{
      key: 'isElement',


      /**
       * Checks if the given argument is a DOM element
       * @param {HTMLElement} the argument to test
       * @return {boolean} true if the object is a DOM element, false otherwise
       */
      value: function isElement(element) {
        if (element === null) {
          return false;
        }
        return (typeof Node === 'undefined' ? 'undefined' : _typeof(Node)) === 'object' ? element instanceof Node : element && (typeof element === 'undefined' ? 'undefined' : _typeof(element)) === 'object' && typeof element.nodeType === 'number' && typeof element.nodeName === 'string';
      }

      /**
      * Binds some text to the given DOM element
      * @param {HTMLElement} element
      * @param {String} text
      */

    }, {
      key: 'setText',
      value: function setText(element, text) {
        if (!('textContent' in element)) {
          element.innerText = text;
        } else {
          element.textContent = text;
        }
      }

      /**
       * Binds some html to the given DOM element
       * @param {HTMLElement} element
       * @param {string} text
       */

    }, {
      key: 'setHtml',
      value: function setHtml(element, text) {
        element.innerHTML = text;
      }

      /**
       * Binds custom attributes to the given DOM element
       * @param {HTMLElement} element
       * @param {String} attr
       * @param {String} text
       */

    }, {
      key: 'setAttribute',
      value: function setAttribute(element, attr, text) {
        element.setAttribute(attr, text);
      }
    }, {
      key: 'setNode',
      value: function setNode(element) {
        var attr = element.getAttribute('data-i18n');
        if (!attr) {
          return;
        }

        attr = attr.trim();

        var r = /(?:\s|^)([A-Za-z-_0-9]+):\s*(.*?)(?=\s+\w+:|$)/g;
        var m = void 0;

        while (m = r.exec(attr)) {
          var key = m[1].trim();
          var value = m[2].trim().replace(',', '');
          var intlValue = this.data[value];

          if (!this.data[value]) {
            console.log(NAME + '. Warning, ' + value + ' does not exist.');
            intlValue = value;
          }

          var methodName = 'set' + key.charAt(0).toUpperCase() + key.slice(1);

          if (this[methodName]) {
            this[methodName](element, intlValue);
          } else {
            this.setAttribute(element, key, intlValue);
          }
        }
      }

      /**
      * Set values to DOM nodes
      */

    }, {
      key: 'setNodes',
      value: function setNodes(element) {
        var _this = this;

        element.forEach(function (el) {
          return _this.setNode(el);
        });
      }
    }], [{
      key: 'version',
      get: function get() {
        return NAME + '.' + VERSION;
      }
    }]);

    return Binder;
  }();

  return Binder;
}();

exports.default = Binder;

},{}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _binder = require('./binder');

var _binder2 = _interopRequireDefault(_binder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Intl = function () {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'Intl';
  var VERSION = '2.0.0';
  var DEFAULT_PROPERTIES = {
    fallbackLocale: 'en',
    locale: 'en',
    autoBind: true,
    data: null

    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };
  var Intl = function () {
    /**
     * Creates an instance of Intl.
     * @param {fallbackLocale: string, locale: string, autoBind: boolean, data: {[lang: string]: {[key: string]: string}}}
     */
    function Intl() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Intl);

      this.options = Object.assign(DEFAULT_PROPERTIES, options);

      if (typeof this.options.fallbackLocale !== 'string') {
        throw new Error(NAME + '. The fallback locale is mandatory and must be a string.');
      }

      if (this.options.data === null) {
        throw new Error(NAME + '. There is no translation data.');
      }

      if (_typeof(this.options.data[this.options.fallbackLocale]) !== 'object') {
        throw new Error(NAME + '. The fallback locale must necessarily have translation data.');
      }

      this.setLocale(this.options.locale, this.options.autoBind);
    }

    _createClass(Intl, [{
      key: 'getLocale',
      value: function getLocale() {
        return this.options.locale;
      }
    }, {
      key: 'getFallbackLocale',
      value: function getFallbackLocale() {
        return this.options.fallbackLocale;
      }

      /**
       * Set default locale
       * @param {string} locale
       * @param {boolean} [updateHTML=true]
       */

    }, {
      key: 'setLocale',
      value: function setLocale(locale) {
        var updateHTML = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        if (_typeof(this.options.data[locale]) !== 'object') {
          console.error(NAME + '. ' + locale + ' has no data, fallback in ' + this.options.fallbackLocale + '.');
        } else {
          this.options.locale = locale;
        }

        if (updateHTML) {
          this.updateHtml();
        }
      }
    }, {
      key: 'getLanguages',
      value: function getLanguages() {
        return Object.keys(this.options.data);
      }
    }, {
      key: 'insertValues',
      value: function insertValues() {
        var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var injectableValues = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        if (typeof value !== 'string') {
          return undefined;
        }

        var match = value.match(/:([a-zA-Z-_0-9]+)/);
        if (match) {
          value = value.replace(match[0], injectableValues[match[1]]);
        }

        if (value.match(/:([a-zA-Z-_0-9]+)/)) {
          return this.insertValues(value, injectableValues);
        }

        return value;
      }
    }, {
      key: 'translate',
      value: function translate() {
        var _this = this;

        var keyName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var inject = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var data = this.options.data[this.options.locale];
        if (!data) {
          data = this.options.data[this.options.fallbackLocale];
        }

        if (keyName === null || keyName === '*' || Array.isArray(keyName)) {
          if (Array.isArray(keyName)) {
            var keys = Object.keys(data).filter(function (key) {
              return keyName.indexOf(key) > -1;
            });
            var filteredData = {};
            keys.forEach(function (key) {
              filteredData[key] = _this.insertValues(data[key], inject);
            });
            data = filteredData;
          }

          var dataMap = {};
          for (var key in data) {
            dataMap[key] = this.insertValues(data[key], inject);
          }

          return dataMap;
        }

        return this.insertValues(data[keyName], inject);
      }

      // alias of t()

    }, {
      key: 't',
      value: function t() {
        var keyName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var inject = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        return this.translate(keyName, inject);
      }

      /**
       * Updates the HTML views
       * @param {HTMLElement} element
       */

    }, {
      key: 'updateHtml',
      value: function updateHtml(element) {
        if (typeof element === 'undefined') {
          element = document.querySelectorAll('[data-i18n]');
        }

        if (typeof element === 'string') {
          element = document.querySelector(element);
        }

        new _binder2.default(element, this.t());
      }

      // static

    }], [{
      key: '_DOMInterface',
      value: function _DOMInterface(options) {
        return new Intl(options);
      }
    }, {
      key: 'version',
      get: function get() {
        return NAME + '.' + VERSION;
      }
    }]);

    return Intl;
  }();

  return Intl;
}();

exports.default = Intl;

},{"./binder":16}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _events = require('../events');

var _events2 = _interopRequireDefault(_events);

var _component = require('../../components/component');

var _component2 = _interopRequireDefault(_component);

var _dispatch = require('../events/dispatch');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Network = function () {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'network';
  var VERSION = '2.0.0';
  var DEFAULT_PROPERTIES = {};

  window.addEventListener('online', function () {
    (0, _dispatch.dispatchWinDocEvent)(_events2.default.NETWORK_ONLINE, NAME, { date: new Date() });
  });

  window.addEventListener('offline', function () {
    (0, _dispatch.dispatchWinDocEvent)(_events2.default.NETWORK_OFFLINE, NAME, { date: new Date() });
  });

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Network = function (_Component) {
    _inherits(Network, _Component);

    /**
     * Creates an instance of Network.
     * @param {{}} [options={}]
     */
    function Network() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Network);

      var _this = _possibleConstructorReturn(this, (Network.__proto__ || Object.getPrototypeOf(Network)).call(this, NAME, VERSION, DEFAULT_PROPERTIES, options, true));

      _this.addEvents();
      return _this;
    }

    _createClass(Network, [{
      key: 'addEvents',
      value: function addEvents() {
        var _this2 = this;

        window.addEventListener('online.ph.network', function () {
          _this2.triggerEvent(_events2.default.NETWORK_ONLINE, { date: new Date() }, true);
        });

        window.addEventListener('offline.ph.network', function () {
          _this2.triggerEvent(_events2.default.NETWORK_OFFLINE, { date: new Date() }, true);
        });
      }
    }], [{
      key: '_DOMInterface',
      value: function _DOMInterface(options) {
        return _get(Network.__proto__ || Object.getPrototypeOf(Network), '_DOMInterface', this).call(this, Network, options);
      }
    }]);

    return Network;
  }(_component2.default);

  return Network;
}();

exports.default = Network;

},{"../../components/component":4,"../events":15,"../events/dispatch":14}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _page = require('./page');

var _page2 = _interopRequireDefault(_page);

var _events = require('../../core/events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Pager = function () {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'pager';
  var VERSION = '2.0.0';
  var DEFAULT_PROPERTIES = {
    hashPrefix: '#!',
    useHash: true,
    defaultPage: null,
    animatePages: true
  };

  var currentPage = void 0;
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Pager = function () {
    /**
     * @constructor
     *
     * @param options {Object}
     */
    function Pager() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Pager);

      this.options = Object.assign(DEFAULT_PROPERTIES, options);

      this.pages = [];
      this.started = false;

      // add global listeners such ash hash change, navigation, etc.
      this.addPagerEvents();

      // faster way to init pages before the DOM is ready
      this.onDOMLoaded();
    }

    // private


    _createClass(Pager, [{
      key: '_',
      value: function _(selector) {
        return document.querySelector(selector);
      }
    }, {
      key: 'getHash',
      value: function getHash() {
        return window.location.hash.split(this.options.hashPrefix)[1];
      }
    }, {
      key: 'getPageFromHash',
      value: function getPageFromHash() {
        var hash = this.getHash();
        var re = new RegExp('[?\/]([^\/]*)');
        var matches = re.exec(hash);

        if (matches && matches[1]) {
          return matches[1];
        }

        return null;
      }
    }, {
      key: 'setHash',
      value: function setHash(pageName) {
        window.location.hash = this.options.hashPrefix + '/' + pageName;
      }
    }, {
      key: 'areSamePage',
      value: function areSamePage(pageName1, pageName2) {
        var page1 = this.getPageModel(pageName1);
        var page2 = this.getPageModel(pageName2);
        return page1 && page2 && page1.name === page2.name;
      }

      /**
       * Attaches the main events for tracking hash changes,
       * click on navigation buttons and links and back history
       */

    }, {
      key: 'addPagerEvents',
      value: function addPagerEvents() {
        var _this = this;

        document.addEventListener('click', function (event) {
          return _this.onClick(event);
        });
        window.addEventListener('popstate', function (event) {
          return _this.onBackHistory(event);
        });
        window.addEventListener('hashchange', function (event) {
          return _this.onHashChange(event);
        });
        document.addEventListener('DOMContentLoaded', function (event) {
          return _this.onDOMLoaded(event);
        });
      }

      // getters

    }, {
      key: 'showPage',


      // public

      value: function showPage(pageName) {
        var _this2 = this;

        var addToHistory = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        var back = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        var oldPage = this._('.current');
        if (oldPage) {
          var oldPageName = oldPage.getAttribute('data-page');

          if (this.areSamePage(pageName, oldPageName)) {
            return;
          }

          oldPage.classList.remove('current');

          // history
          window.history.replaceState({ page: oldPageName }, oldPageName, window.location.href);

          this.triggerPageEvent(oldPageName, _events2.default.HIDE);
        }

        this.triggerPageEvent(pageName, _events2.default.SHOW);

        currentPage = pageName;

        // new page
        var newPage = this._('[data-page="' + pageName + '"]');

        newPage.classList.add('current');

        // template loader
        var pageModel = this.getPageModel(pageName);

        // @todo: use template cache?
        if (pageModel && pageModel.getTemplate()) {
          pageModel.loadTemplate();
        }
        // end

        if (oldPage) {
          var _oldPageName = oldPage.getAttribute('data-page');
          // use of prototype-oriented language
          oldPage.back = back;
          oldPage.previousPageName = _oldPageName;

          var onPageAnimationEnd = function onPageAnimationEnd() {
            if (oldPage.classList.contains('animate')) {
              oldPage.classList.remove('animate');
            }

            oldPage.classList.remove(oldPage.back ? 'pop-page' : 'push-page');

            _this2.triggerPageEvent(currentPage, _events2.default.SHOWN);
            _this2.triggerPageEvent(oldPage.previousPageName, _events2.default.HIDDEN);

            oldPage.removeEventListener(_events2.default.ANIMATION_END, onPageAnimationEnd);
          };

          if (this.options.animatePages) {
            oldPage.addEventListener(_events2.default.ANIMATION_END, onPageAnimationEnd);
            oldPage.classList.add('animate');
          } else {
            onPageAnimationEnd();
          }

          oldPage.classList.add(back ? 'pop-page' : 'push-page');
        }
      }
    }, {
      key: 'addUniquePageModel',
      value: function addUniquePageModel(pageName) {
        if (!this.getPageModel(pageName)) {
          this.pages.push(new _page2.default(pageName));
        }
      }
    }, {
      key: 'getPageModel',
      value: function getPageModel(pageName) {
        return this.pages.find(function (page) {
          return page.name === pageName;
        });
      }
    }, {
      key: 'getPagesModel',
      value: function getPagesModel(pageNames) {
        return this.pages.filter(function (page) {
          return pageNames.indexOf(page.name) > -1;
        });
      }
    }, {
      key: 'selectorToArray',
      value: function selectorToArray(str) {
        return str.split(',').map(function (item) {
          return item.trim();
        });
      }
    }, {
      key: 'addEvents',
      value: function addEvents(callback) {
        if (this.cachePageSelector === '*') {
          // add to all page models
          this.pages.forEach(function (page) {
            page.addEventCallback(callback);
          });
          return;
        }

        var pageModels = this.getPagesModel(this.selectorToArray(this.cachePageSelector), true);
        pageModels.forEach(function (page) {
          page.addEventCallback(callback);
        });
        this.cachePageSelector = null;
      }
    }, {
      key: 'useTemplate',
      value: function useTemplate(templatePath) {
        var renderFunction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        var pageModels = this.getPagesModel(this.selectorToArray(this.cachePageSelector), true);
        pageModels.forEach(function (page) {
          page.useTemplate(templatePath);
          if (typeof renderFunction === 'function') {
            page.useTemplateRenderer(renderFunction);
          }
        });
        this.cachePageSelector = null;
      }
    }, {
      key: 'triggerPageEvent',
      value: function triggerPageEvent(pageName, eventName) {
        var eventParams = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

        var pageModel = this.getPageModel(pageName);
        if (pageModel) {
          pageModel.triggerScopes(eventName, eventParams);
        }
      }
    }, {
      key: 'onClick',
      value: function onClick(event) {
        var pageName = event.target.getAttribute('data-navigate');
        var pushPage = !(event.target.getAttribute('data-pop-page') === 'true');

        if (pageName) {
          if (pageName === '$back') {
            // the popstate event will be triggered
            window.history.back();
            return;
          }

          /*
           * If we he use the hash as trigger,
           * we change it dynamically so that the hashchange event is called
           * Otherwise, we show the page
           */
          if (this.options.useHash) {
            this.setHash(pageName);
          } else {
            this.showPage(pageName, true, pushPage);
          }
        }
      }
    }, {
      key: 'onBackHistory',
      value: function onBackHistory() {
        var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var pageName = event.state ? event.state.page : null;
        if (!pageName) {
          return;
        }

        this.showPage(pageName, true, true);
      }
    }, {
      key: 'onHashChange',
      value: function onHashChange() {
        var params = (this.getHash() ? this.getHash().split('/') : []).filter(function (p) {
          return p.length > 0;
        });
        if (params.length > 0) {
          // remove first value which is the page name
          params.shift();
        }

        this.triggerPageEvent(currentPage, _events2.default.HASH, params);

        var navPage = this.getPageFromHash();
        if (navPage) {
          this.showPage(navPage);
        }
      }

      /**
       * Queries the page nodes in the DOM
       */

    }, {
      key: 'onDOMLoaded',
      value: function onDOMLoaded() {
        var _this3 = this;

        var pages = document.querySelectorAll('[data-page]');

        if (!pages) {
          return;
        }

        pages.forEach(function (page) {
          var pageName = page.getAttribute('data-page');
          /*
           * the page name can be given with the attribute data-page
           * or with its node name
           */
          if (!pageName) {
            pageName = page.nodeName;
          }

          _this3.addUniquePageModel(pageName);
        });
      }
    }, {
      key: 'select',
      value: function select(pageName) {
        var addPageModel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        this.cachePageSelector = pageName;

        if (addPageModel && pageName !== '*') {
          this.addUniquePageModel(pageName);
        }

        return this;
      }
    }, {
      key: 'start',
      value: function start() {
        var forceDefaultPage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        // check if the app has been already started
        if (this.started) {
          throw new Error(NAME + '. The app has been already started.');
        }

        this.started = true;

        // force default page on Cordova
        if (window.cordova) {
          forceDefaultPage = true;
        }

        var pageName = this.getPageFromHash();
        if (!this.getPageModel(pageName)) {
          pageName = this.options.defaultPage;
        }

        if (forceDefaultPage && !this.options.defaultPage) {
          throw new Error(NAME + '. The default page must exist for forcing its launch!');
        }

        // Log the device info
        if (phonon.debug) {
          console.log('Starting Phonon in ' + platform.description);
          console.log(this.pages.length + ' pages found');
          console.log('Loading ' + pageName);
        }

        /*
         * if the app is configurated to use hash tracking
         * we add the page dynamically in the url
         */
        if (this.options.useHash) {
          this.setHash(pageName);
        }

        this.showPage(forceDefaultPage ? this.options.defaultPage : pageName);
      }

      // static

    }], [{
      key: '_DOMInterface',
      value: function _DOMInterface(options) {
        return new Pager(options);
      }
    }, {
      key: 'version',
      get: function get() {
        return NAME + '.' + VERSION;
      }
    }]);

    return Pager;
  }();

  return Pager;
}();

exports.default = Pager;

},{"../../core/events":15,"./page":20}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _utils = require('../utils');

var _dispatch = require('../events/dispatch');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Page = function () {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'page';
  var VERSION = '2.0.0';

  var TEMPLATE_SELECTOR = '[data-template]';

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Page = function () {
    /**
     * Creates an instance of Page.
     * @param {string} pageName
     */
    function Page(pageName) {
      _classCallCheck(this, Page);

      this.name = pageName;
      this.events = [];
      this.templatePath = null;
      this.renderFunction = null;
    }

    // getters

    _createClass(Page, [{
      key: 'getEvents',


      /**
       * Get events
       * @returns {Function[]}
       */
      value: function getEvents() {
        return this.events;
      }

      /**
       * Get template
       * @returns {string}
       */

    }, {
      key: 'getTemplate',
      value: function getTemplate() {
        return this.templatePath;
      }

      /**
       * Get render function
       * @returns {Function}
       */

    }, {
      key: 'getRenderFunction',
      value: function getRenderFunction() {
        return this.renderFunction;
      }
    }, {
      key: 'loadTemplate',
      value: function loadTemplate() {
        var _this = this;

        var pageElement = document.querySelector('[data-page="' + this.name + '"]');

        (0, _utils.loadFile)(this.getTemplate(), function (template) {
          var render = function render(DOMPage, template, elements) {
            if (elements) {
              elements.forEach(function (el) {
                el.innerHTML = template;
              });
            } else {
              DOMPage.innerHTML = template;
            }
          };

          if (_this.getRenderFunction()) {
            render = _this.getRenderFunction();
          }

          render(pageElement, template, pageElement.querySelectorAll(TEMPLATE_SELECTOR));
        }, null);
      }

      // public

      /**
       *
       * @param {*} callbackFn
       */

    }, {
      key: 'addEventCallback',
      value: function addEventCallback(callbackFn) {
        this.events.push(callbackFn);
      }

      /**
       * Use the given template
       *
       * @param {string} templatePath
       */

    }, {
      key: 'useTemplate',
      value: function useTemplate(templatePath) {
        if (typeof templatePath !== 'string') {
          throw new Error('The template path must be a string. ' + (typeof templatePath === 'undefined' ? 'undefined' : _typeof(templatePath)) + ' is given');
        }
        this.templatePath = templatePath;
      }

      /**
       * Use the given template renderer
       * @param {Function} renderFunction
       */

    }, {
      key: 'useTemplateRenderer',
      value: function useTemplateRenderer(renderFunction) {
        if (typeof renderFunction !== 'function') {
          throw new Error('The custom template renderer must be a function. ' + (typeof renderFunction === 'undefined' ? 'undefined' : _typeof(renderFunction)) + ' is given');
        }
        this.renderFunction = renderFunction;
      }

      /**
       * Trigger scopes
       * @param {string} eventName
       * @param {{}} [eventParams={}]
       */

    }, {
      key: 'triggerScopes',
      value: function triggerScopes(eventName) {
        var _this2 = this;

        var eventParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var eventNameAlias = 'on' + eventName.charAt(0).toUpperCase() + eventName.slice(1);

        this.events.forEach(function (scope) {
          var scopeEvent = scope[eventName];
          var scopeEventAlias = scope[eventNameAlias];
          if (typeof scopeEvent === 'function') {
            scopeEvent.apply(_this2, eventParams);
          }

          // trigger the event alias
          if (typeof scopeEventAlias === 'function') {
            scopeEventAlias.apply(_this2, eventParams);
          }
        });

        (0, _dispatch.dispatchPageEvent)(eventName, this.name, eventParams);
      }
    }], [{
      key: 'version',
      get: function get() {
        return NAME + '.' + VERSION;
      }
    }]);

    return Page;
  }();

  return Page;
}();

exports.default = Page;

},{"../events/dispatch":14,"../utils":22}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _platform = require('platform');

var _platform2 = _interopRequireDefault(_platform);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _platform2.default; /*
                                       * Use of platform.js
                                       * https://github.com/bestiejs/platform.js
                                       * License: https://github.com/bestiejs/platform.js/blob/master/LICENSE
                                       */

},{"platform":1}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadFile = loadFile;
exports.generateId = generateId;
exports.findTargetByClass = findTargetByClass;
exports.findTargetById = findTargetById;
exports.findTargetByAttr = findTargetByAttr;
function loadFile(url, fn, postData) {
  var req = new XMLHttpRequest();
  if (req.overrideMimeType) req.overrideMimeType('text/html; charset=utf-8');
  req.onreadystatechange = function () {
    if (req.readyState === 4 && (parseInt(req.status) === 200 || !req.status && req.responseText.length)) {
      fn(req.responseText);
    }
  };

  if (typeof postData !== 'string') {
    req.open('GET', url, true);
    req.send('');
  } else {
    req.open('POST', url, true);
    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    req.send(postData);
  }
}

function generateId() {
  return Math.random().toString(36).substr(2, 10);
}

function findTargetByClass(target, parentClass) {
  for (; target && target !== document; target = target.parentNode) {
    if (target.classList.contains(parentClass)) {
      return target;
    }
  }

  return null;
}

function findTargetById(target, parentId) {
  for (; target && target !== document; target = target.parentNode) {
    if (target.getAttribute('id') === parentId) {
      return target;
    }
  }

  return null;
}

function findTargetByAttr(target, attr) {
  for (; target && target !== document; target = target.parentNode) {
    if (target.getAttribute(attr) !== null) {
      return target;
    }
  }

  return null;
}

},{}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('./core/pager/index');

var _index2 = _interopRequireDefault(_index);

var _ajax = require('./core/ajax');

var _ajax2 = _interopRequireDefault(_ajax);

var _platform = require('./core/platform');

var _platform2 = _interopRequireDefault(_platform);

var _intl = require('./core/intl');

var _intl2 = _interopRequireDefault(_intl);

var _network = require('./core/network');

var _network2 = _interopRequireDefault(_network);

var _dialog = require('./components/dialog');

var _dialog2 = _interopRequireDefault(_dialog);

var _notification = require('./components/notification');

var _notification2 = _interopRequireDefault(_notification);

var _collapse = require('./components/collapse');

var _collapse2 = _interopRequireDefault(_collapse);

var _accordion = require('./components/accordion');

var _accordion2 = _interopRequireDefault(_accordion);

var _tab = require('./components/tab');

var _tab2 = _interopRequireDefault(_tab);

var _progress = require('./components/progress');

var _progress2 = _interopRequireDefault(_progress);

var _loader = require('./components/loader');

var _loader2 = _interopRequireDefault(_loader);

var _offCanvas = require('./components/off-canvas');

var _offCanvas2 = _interopRequireDefault(_offCanvas);

var _dropdown = require('./components/dropdown');

var _dropdown2 = _interopRequireDefault(_dropdown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

// core
var api = {};

/**
 * ------------------------------------------------------------------------
 * Configuration
 * ------------------------------------------------------------------------
 */


// components
api.config = {
  // global config
  debug: true

  /**
   * ------------------------------------------------------------------------
   * Pager
   * ------------------------------------------------------------------------
   */
};api.pager = function (options) {
  if (typeof api._pager === 'undefined') {
    api._pager = _index2.default._DOMInterface(options);
  }
  return api._pager;
};

/**
 * ------------------------------------------------------------------------
 * Platform
 * ------------------------------------------------------------------------
 */

api.platform = _platform2.default;

/**
 * ------------------------------------------------------------------------
 * Ajax
 * ------------------------------------------------------------------------
 */
api.ajax = _ajax2.default._DOMInterface;

/**
 * ------------------------------------------------------------------------
 * Intl
 * ------------------------------------------------------------------------
 */
api.intl = _intl2.default._DOMInterface;

/**
 * ------------------------------------------------------------------------
 * Network
 * ------------------------------------------------------------------------
 */
api.network = _network2.default._DOMInterface;

/**
 * ------------------------------------------------------------------------
 * Notification
 * ------------------------------------------------------------------------
 */
api.notification = _notification2.default._DOMInterface;

/**
 * ------------------------------------------------------------------------
 * Dialog
 * ------------------------------------------------------------------------
 */
api.dialog = _dialog2.default._DOMInterface;

/**
 * ------------------------------------------------------------------------
 * Collapse
 * ------------------------------------------------------------------------
 */
api.collapse = _collapse2.default._DOMInterface;

/**
 * ------------------------------------------------------------------------
 * Accordion
 * ------------------------------------------------------------------------
 */
api.accordion = _accordion2.default._DOMInterface;

/**
 * ------------------------------------------------------------------------
 * Tab
 * ------------------------------------------------------------------------
 */
api.tab = _tab2.default._DOMInterface;

/**
 * ------------------------------------------------------------------------
 * Progress
 * ------------------------------------------------------------------------
 */
api.progress = _progress2.default._DOMInterface;

/**
 * ------------------------------------------------------------------------
 * Loader
 * ------------------------------------------------------------------------
 */
api.loader = _loader2.default._DOMInterface;

/**
 * ------------------------------------------------------------------------
 * Off canvas
 * ------------------------------------------------------------------------
 */
api.offCanvas = _offCanvas2.default._DOMInterface;

/**
 * ------------------------------------------------------------------------
 * Dropdown
 * ------------------------------------------------------------------------
 */
api.dropdown = _dropdown2.default._DOMInterface;

// Make the API live
window.phonon = api;

exports.default = api;

},{"./components/accordion":2,"./components/collapse":3,"./components/dialog":6,"./components/dropdown":7,"./components/loader":8,"./components/notification":9,"./components/off-canvas":10,"./components/progress":11,"./components/tab":12,"./core/ajax":13,"./core/intl":17,"./core/network":18,"./core/pager/index":19,"./core/platform":21}]},{},[23])

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcGxhdGZvcm0vcGxhdGZvcm0uanMiLCJzcmMvanMvY29tcG9uZW50cy9hY2NvcmRpb24vaW5kZXguanMiLCJzcmMvanMvY29tcG9uZW50cy9jb2xsYXBzZS9pbmRleC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2NvbXBvbmVudC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2NvbXBvbmVudE1hbmFnZXIuanMiLCJzcmMvanMvY29tcG9uZW50cy9kaWFsb2cvaW5kZXguanMiLCJzcmMvanMvY29tcG9uZW50cy9kcm9wZG93bi9pbmRleC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2xvYWRlci9pbmRleC5qcyIsInNyYy9qcy9jb21wb25lbnRzL25vdGlmaWNhdGlvbi9pbmRleC5qcyIsInNyYy9qcy9jb21wb25lbnRzL29mZi1jYW52YXMvaW5kZXguanMiLCJzcmMvanMvY29tcG9uZW50cy9wcm9ncmVzcy9pbmRleC5qcyIsInNyYy9qcy9jb21wb25lbnRzL3RhYi9pbmRleC5qcyIsInNyYy9qcy9jb3JlL2FqYXgvaW5kZXguanMiLCJzcmMvanMvY29yZS9ldmVudHMvZGlzcGF0Y2guanMiLCJzcmMvanMvY29yZS9ldmVudHMvaW5kZXguanMiLCJzcmMvanMvY29yZS9pbnRsL2JpbmRlci5qcyIsInNyYy9qcy9jb3JlL2ludGwvaW5kZXguanMiLCJzcmMvanMvY29yZS9uZXR3b3JrL2luZGV4LmpzIiwic3JjL2pzL2NvcmUvcGFnZXIvaW5kZXguanMiLCJzcmMvanMvY29yZS9wYWdlci9wYWdlLmpzIiwic3JjL2pzL2NvcmUvcGxhdGZvcm0vaW5kZXguanMiLCJzcmMvanMvY29yZS91dGlscy9pbmRleC5qcyIsInNyYy9qcy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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RUE7Ozs7O0FBS0EsSUFBSSxNQUFKLEdBQWEsaUJBQU8sYUFBcEI7O0FBRUE7Ozs7O0FBS0EsSUFBSSxRQUFKLEdBQWUsbUJBQVMsYUFBeEI7O0FBRUE7Ozs7O0FBS0EsSUFBSSxTQUFKLEdBQWdCLG9CQUFVLGFBQTFCOztBQUdBOzs7OztBQUtBLElBQUksR0FBSixHQUFVLGNBQUksYUFBZDs7QUFFQTs7Ozs7QUFLQSxJQUFJLFFBQUosR0FBZSxtQkFBUyxhQUF4Qjs7QUFFQTs7Ozs7QUFLQSxJQUFJLE1BQUosR0FBYSxpQkFBTyxhQUFwQjs7QUFFQTs7Ozs7QUFLQSxJQUFJLFNBQUosR0FBZ0Isb0JBQVUsYUFBMUI7O0FBRUE7Ozs7O0FBS0EsSUFBSSxRQUFKLEdBQWUsbUJBQVMsYUFBeEI7O0FBRUE7QUFDQSxPQUFPLE1BQVAsR0FBZ0IsR0FBaEI7O2tCQUVlLEciLCJmaWxlIjoicGhvbm9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiFcbiAqIFBsYXRmb3JtLmpzIDxodHRwczovL210aHMuYmUvcGxhdGZvcm0+XG4gKiBDb3B5cmlnaHQgMjAxNC0yMDE2IEJlbmphbWluIFRhbiA8aHR0cHM6Ly9kZW1vbmVhdXguZ2l0aHViLmlvLz5cbiAqIENvcHlyaWdodCAyMDExLTIwMTMgSm9obi1EYXZpZCBEYWx0b24gPGh0dHA6Ly9hbGx5b3VjYW5sZWV0LmNvbS8+XG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbXRocy5iZS9taXQ+XG4gKi9cbjsoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvKiogVXNlZCB0byBkZXRlcm1pbmUgaWYgdmFsdWVzIGFyZSBvZiB0aGUgbGFuZ3VhZ2UgdHlwZSBgT2JqZWN0YC4gKi9cbiAgdmFyIG9iamVjdFR5cGVzID0ge1xuICAgICdmdW5jdGlvbic6IHRydWUsXG4gICAgJ29iamVjdCc6IHRydWVcbiAgfTtcblxuICAvKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbiAgdmFyIHJvb3QgPSAob2JqZWN0VHlwZXNbdHlwZW9mIHdpbmRvd10gJiYgd2luZG93KSB8fCB0aGlzO1xuXG4gIC8qKiBCYWNrdXAgcG9zc2libGUgZ2xvYmFsIG9iamVjdC4gKi9cbiAgdmFyIG9sZFJvb3QgPSByb290O1xuXG4gIC8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG4gIHZhciBmcmVlRXhwb3J0cyA9IG9iamVjdFR5cGVzW3R5cGVvZiBleHBvcnRzXSAmJiBleHBvcnRzO1xuXG4gIC8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbiAgdmFyIGZyZWVNb2R1bGUgPSBvYmplY3RUeXBlc1t0eXBlb2YgbW9kdWxlXSAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbiAgLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcyBvciBCcm93c2VyaWZpZWQgY29kZSBhbmQgdXNlIGl0IGFzIGByb290YC4gKi9cbiAgdmFyIGZyZWVHbG9iYWwgPSBmcmVlRXhwb3J0cyAmJiBmcmVlTW9kdWxlICYmIHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsO1xuICBpZiAoZnJlZUdsb2JhbCAmJiAoZnJlZUdsb2JhbC5nbG9iYWwgPT09IGZyZWVHbG9iYWwgfHwgZnJlZUdsb2JhbC53aW5kb3cgPT09IGZyZWVHbG9iYWwgfHwgZnJlZUdsb2JhbC5zZWxmID09PSBmcmVlR2xvYmFsKSkge1xuICAgIHJvb3QgPSBmcmVlR2xvYmFsO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZWQgYXMgdGhlIG1heGltdW0gbGVuZ3RoIG9mIGFuIGFycmF5LWxpa2Ugb2JqZWN0LlxuICAgKiBTZWUgdGhlIFtFUzYgc3BlY10oaHR0cDovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtdG9sZW5ndGgpXG4gICAqIGZvciBtb3JlIGRldGFpbHMuXG4gICAqL1xuICB2YXIgbWF4U2FmZUludGVnZXIgPSBNYXRoLnBvdygyLCA1MykgLSAxO1xuXG4gIC8qKiBSZWd1bGFyIGV4cHJlc3Npb24gdG8gZGV0ZWN0IE9wZXJhLiAqL1xuICB2YXIgcmVPcGVyYSA9IC9cXGJPcGVyYS87XG5cbiAgLyoqIFBvc3NpYmxlIGdsb2JhbCBvYmplY3QuICovXG4gIHZhciB0aGlzQmluZGluZyA9IHRoaXM7XG5cbiAgLyoqIFVzZWQgZm9yIG5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbiAgdmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuICAvKiogVXNlZCB0byBjaGVjayBmb3Igb3duIHByb3BlcnRpZXMgb2YgYW4gb2JqZWN0LiAqL1xuICB2YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuICAvKiogVXNlZCB0byByZXNvbHZlIHRoZSBpbnRlcm5hbCBgW1tDbGFzc11dYCBvZiB2YWx1ZXMuICovXG4gIHZhciB0b1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBDYXBpdGFsaXplcyBhIHN0cmluZyB2YWx1ZS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBUaGUgc3RyaW5nIHRvIGNhcGl0YWxpemUuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBjYXBpdGFsaXplZCBzdHJpbmcuXG4gICAqL1xuICBmdW5jdGlvbiBjYXBpdGFsaXplKHN0cmluZykge1xuICAgIHN0cmluZyA9IFN0cmluZyhzdHJpbmcpO1xuICAgIHJldHVybiBzdHJpbmcuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHJpbmcuc2xpY2UoMSk7XG4gIH1cblxuICAvKipcbiAgICogQSB1dGlsaXR5IGZ1bmN0aW9uIHRvIGNsZWFuIHVwIHRoZSBPUyBuYW1lLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gb3MgVGhlIE9TIG5hbWUgdG8gY2xlYW4gdXAuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbcGF0dGVybl0gQSBgUmVnRXhwYCBwYXR0ZXJuIG1hdGNoaW5nIHRoZSBPUyBuYW1lLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gW2xhYmVsXSBBIGxhYmVsIGZvciB0aGUgT1MuXG4gICAqL1xuICBmdW5jdGlvbiBjbGVhbnVwT1Mob3MsIHBhdHRlcm4sIGxhYmVsKSB7XG4gICAgLy8gUGxhdGZvcm0gdG9rZW5zIGFyZSBkZWZpbmVkIGF0OlxuICAgIC8vIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9tczUzNzUwMyhWUy44NSkuYXNweFxuICAgIC8vIGh0dHA6Ly93ZWIuYXJjaGl2ZS5vcmcvd2ViLzIwMDgxMTIyMDUzOTUwL2h0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9tczUzNzUwMyhWUy44NSkuYXNweFxuICAgIHZhciBkYXRhID0ge1xuICAgICAgJzEwLjAnOiAnMTAnLFxuICAgICAgJzYuNCc6ICAnMTAgVGVjaG5pY2FsIFByZXZpZXcnLFxuICAgICAgJzYuMyc6ICAnOC4xJyxcbiAgICAgICc2LjInOiAgJzgnLFxuICAgICAgJzYuMSc6ICAnU2VydmVyIDIwMDggUjIgLyA3JyxcbiAgICAgICc2LjAnOiAgJ1NlcnZlciAyMDA4IC8gVmlzdGEnLFxuICAgICAgJzUuMic6ICAnU2VydmVyIDIwMDMgLyBYUCA2NC1iaXQnLFxuICAgICAgJzUuMSc6ICAnWFAnLFxuICAgICAgJzUuMDEnOiAnMjAwMCBTUDEnLFxuICAgICAgJzUuMCc6ICAnMjAwMCcsXG4gICAgICAnNC4wJzogICdOVCcsXG4gICAgICAnNC45MCc6ICdNRSdcbiAgICB9O1xuICAgIC8vIERldGVjdCBXaW5kb3dzIHZlcnNpb24gZnJvbSBwbGF0Zm9ybSB0b2tlbnMuXG4gICAgaWYgKHBhdHRlcm4gJiYgbGFiZWwgJiYgL15XaW4vaS50ZXN0KG9zKSAmJiAhL15XaW5kb3dzIFBob25lIC9pLnRlc3Qob3MpICYmXG4gICAgICAgIChkYXRhID0gZGF0YVsvW1xcZC5dKyQvLmV4ZWMob3MpXSkpIHtcbiAgICAgIG9zID0gJ1dpbmRvd3MgJyArIGRhdGE7XG4gICAgfVxuICAgIC8vIENvcnJlY3QgY2hhcmFjdGVyIGNhc2UgYW5kIGNsZWFudXAgc3RyaW5nLlxuICAgIG9zID0gU3RyaW5nKG9zKTtcblxuICAgIGlmIChwYXR0ZXJuICYmIGxhYmVsKSB7XG4gICAgICBvcyA9IG9zLnJlcGxhY2UoUmVnRXhwKHBhdHRlcm4sICdpJyksIGxhYmVsKTtcbiAgICB9XG5cbiAgICBvcyA9IGZvcm1hdChcbiAgICAgIG9zLnJlcGxhY2UoLyBjZSQvaSwgJyBDRScpXG4gICAgICAgIC5yZXBsYWNlKC9cXGJocHcvaSwgJ3dlYicpXG4gICAgICAgIC5yZXBsYWNlKC9cXGJNYWNpbnRvc2hcXGIvLCAnTWFjIE9TJylcbiAgICAgICAgLnJlcGxhY2UoL19Qb3dlclBDXFxiL2ksICcgT1MnKVxuICAgICAgICAucmVwbGFjZSgvXFxiKE9TIFgpIFteIFxcZF0rL2ksICckMScpXG4gICAgICAgIC5yZXBsYWNlKC9cXGJNYWMgKE9TIFgpXFxiLywgJyQxJylcbiAgICAgICAgLnJlcGxhY2UoL1xcLyhcXGQpLywgJyAkMScpXG4gICAgICAgIC5yZXBsYWNlKC9fL2csICcuJylcbiAgICAgICAgLnJlcGxhY2UoLyg/OiBCZVBDfFsgLl0qZmNbIFxcZC5dKykkL2ksICcnKVxuICAgICAgICAucmVwbGFjZSgvXFxieDg2XFwuNjRcXGIvZ2ksICd4ODZfNjQnKVxuICAgICAgICAucmVwbGFjZSgvXFxiKFdpbmRvd3MgUGhvbmUpIE9TXFxiLywgJyQxJylcbiAgICAgICAgLnJlcGxhY2UoL1xcYihDaHJvbWUgT1MgXFx3KykgW1xcZC5dK1xcYi8sICckMScpXG4gICAgICAgIC5zcGxpdCgnIG9uICcpWzBdXG4gICAgKTtcblxuICAgIHJldHVybiBvcztcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBpdGVyYXRpb24gdXRpbGl0eSBmb3IgYXJyYXlzIGFuZCBvYmplY3RzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gICAqL1xuICBmdW5jdGlvbiBlYWNoKG9iamVjdCwgY2FsbGJhY2spIHtcbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gb2JqZWN0ID8gb2JqZWN0Lmxlbmd0aCA6IDA7XG5cbiAgICBpZiAodHlwZW9mIGxlbmd0aCA9PSAnbnVtYmVyJyAmJiBsZW5ndGggPiAtMSAmJiBsZW5ndGggPD0gbWF4U2FmZUludGVnZXIpIHtcbiAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgIGNhbGxiYWNrKG9iamVjdFtpbmRleF0sIGluZGV4LCBvYmplY3QpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3JPd24ob2JqZWN0LCBjYWxsYmFjayk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRyaW0gYW5kIGNvbmRpdGlvbmFsbHkgY2FwaXRhbGl6ZSBzdHJpbmcgdmFsdWVzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFRoZSBzdHJpbmcgdG8gZm9ybWF0LlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZm9ybWF0dGVkIHN0cmluZy5cbiAgICovXG4gIGZ1bmN0aW9uIGZvcm1hdChzdHJpbmcpIHtcbiAgICBzdHJpbmcgPSB0cmltKHN0cmluZyk7XG4gICAgcmV0dXJuIC9eKD86d2ViT1N8aSg/Ok9TfFApKS8udGVzdChzdHJpbmcpXG4gICAgICA/IHN0cmluZ1xuICAgICAgOiBjYXBpdGFsaXplKHN0cmluZyk7XG4gIH1cblxuICAvKipcbiAgICogSXRlcmF0ZXMgb3ZlciBhbiBvYmplY3QncyBvd24gcHJvcGVydGllcywgZXhlY3V0aW5nIHRoZSBgY2FsbGJhY2tgIGZvciBlYWNoLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgZnVuY3Rpb24gZXhlY3V0ZWQgcGVyIG93biBwcm9wZXJ0eS5cbiAgICovXG4gIGZ1bmN0aW9uIGZvck93bihvYmplY3QsIGNhbGxiYWNrKSB7XG4gICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpKSB7XG4gICAgICAgIGNhbGxiYWNrKG9iamVjdFtrZXldLCBrZXksIG9iamVjdCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGludGVybmFsIGBbW0NsYXNzXV1gIG9mIGEgdmFsdWUuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgYFtbQ2xhc3NdXWAuXG4gICAqL1xuICBmdW5jdGlvbiBnZXRDbGFzc09mKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09IG51bGxcbiAgICAgID8gY2FwaXRhbGl6ZSh2YWx1ZSlcbiAgICAgIDogdG9TdHJpbmcuY2FsbCh2YWx1ZSkuc2xpY2UoOCwgLTEpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhvc3Qgb2JqZWN0cyBjYW4gcmV0dXJuIHR5cGUgdmFsdWVzIHRoYXQgYXJlIGRpZmZlcmVudCBmcm9tIHRoZWlyIGFjdHVhbFxuICAgKiBkYXRhIHR5cGUuIFRoZSBvYmplY3RzIHdlIGFyZSBjb25jZXJuZWQgd2l0aCB1c3VhbGx5IHJldHVybiBub24tcHJpbWl0aXZlXG4gICAqIHR5cGVzIG9mIFwib2JqZWN0XCIsIFwiZnVuY3Rpb25cIiwgb3IgXCJ1bmtub3duXCIuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7Kn0gb2JqZWN0IFRoZSBvd25lciBvZiB0aGUgcHJvcGVydHkuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wZXJ0eSBUaGUgcHJvcGVydHkgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgcHJvcGVydHkgdmFsdWUgaXMgYSBub24tcHJpbWl0aXZlLCBlbHNlIGBmYWxzZWAuXG4gICAqL1xuICBmdW5jdGlvbiBpc0hvc3RUeXBlKG9iamVjdCwgcHJvcGVydHkpIHtcbiAgICB2YXIgdHlwZSA9IG9iamVjdCAhPSBudWxsID8gdHlwZW9mIG9iamVjdFtwcm9wZXJ0eV0gOiAnbnVtYmVyJztcbiAgICByZXR1cm4gIS9eKD86Ym9vbGVhbnxudW1iZXJ8c3RyaW5nfHVuZGVmaW5lZCkkLy50ZXN0KHR5cGUpICYmXG4gICAgICAodHlwZSA9PSAnb2JqZWN0JyA/ICEhb2JqZWN0W3Byb3BlcnR5XSA6IHRydWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFByZXBhcmVzIGEgc3RyaW5nIGZvciB1c2UgaW4gYSBgUmVnRXhwYCBieSBtYWtpbmcgaHlwaGVucyBhbmQgc3BhY2VzIG9wdGlvbmFsLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFRoZSBzdHJpbmcgdG8gcXVhbGlmeS5cbiAgICogQHJldHVybnMge3N0cmluZ30gVGhlIHF1YWxpZmllZCBzdHJpbmcuXG4gICAqL1xuICBmdW5jdGlvbiBxdWFsaWZ5KHN0cmluZykge1xuICAgIHJldHVybiBTdHJpbmcoc3RyaW5nKS5yZXBsYWNlKC8oWyAtXSkoPyEkKS9nLCAnJDE/Jyk7XG4gIH1cblxuICAvKipcbiAgICogQSBiYXJlLWJvbmVzIGBBcnJheSNyZWR1Y2VgIGxpa2UgdXRpbGl0eSBmdW5jdGlvbi5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXIgaXRlcmF0aW9uLlxuICAgKiBAcmV0dXJucyB7Kn0gVGhlIGFjY3VtdWxhdGVkIHJlc3VsdC5cbiAgICovXG4gIGZ1bmN0aW9uIHJlZHVjZShhcnJheSwgY2FsbGJhY2spIHtcbiAgICB2YXIgYWNjdW11bGF0b3IgPSBudWxsO1xuICAgIGVhY2goYXJyYXksIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xuICAgICAgYWNjdW11bGF0b3IgPSBjYWxsYmFjayhhY2N1bXVsYXRvciwgdmFsdWUsIGluZGV4LCBhcnJheSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgbGVhZGluZyBhbmQgdHJhaWxpbmcgd2hpdGVzcGFjZSBmcm9tIGEgc3RyaW5nLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFRoZSBzdHJpbmcgdG8gdHJpbS5cbiAgICogQHJldHVybnMge3N0cmluZ30gVGhlIHRyaW1tZWQgc3RyaW5nLlxuICAgKi9cbiAgZnVuY3Rpb24gdHJpbShzdHJpbmcpIHtcbiAgICByZXR1cm4gU3RyaW5nKHN0cmluZykucmVwbGFjZSgvXiArfCArJC9nLCAnJyk7XG4gIH1cblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBwbGF0Zm9ybSBvYmplY3QuXG4gICAqXG4gICAqIEBtZW1iZXJPZiBwbGF0Zm9ybVxuICAgKiBAcGFyYW0ge09iamVjdHxzdHJpbmd9IFt1YT1uYXZpZ2F0b3IudXNlckFnZW50XSBUaGUgdXNlciBhZ2VudCBzdHJpbmcgb3JcbiAgICogIGNvbnRleHQgb2JqZWN0LlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBBIHBsYXRmb3JtIG9iamVjdC5cbiAgICovXG4gIGZ1bmN0aW9uIHBhcnNlKHVhKSB7XG5cbiAgICAvKiogVGhlIGVudmlyb25tZW50IGNvbnRleHQgb2JqZWN0LiAqL1xuICAgIHZhciBjb250ZXh0ID0gcm9vdDtcblxuICAgIC8qKiBVc2VkIHRvIGZsYWcgd2hlbiBhIGN1c3RvbSBjb250ZXh0IGlzIHByb3ZpZGVkLiAqL1xuICAgIHZhciBpc0N1c3RvbUNvbnRleHQgPSB1YSAmJiB0eXBlb2YgdWEgPT0gJ29iamVjdCcgJiYgZ2V0Q2xhc3NPZih1YSkgIT0gJ1N0cmluZyc7XG5cbiAgICAvLyBKdWdnbGUgYXJndW1lbnRzLlxuICAgIGlmIChpc0N1c3RvbUNvbnRleHQpIHtcbiAgICAgIGNvbnRleHQgPSB1YTtcbiAgICAgIHVhID0gbnVsbDtcbiAgICB9XG5cbiAgICAvKiogQnJvd3NlciBuYXZpZ2F0b3Igb2JqZWN0LiAqL1xuICAgIHZhciBuYXYgPSBjb250ZXh0Lm5hdmlnYXRvciB8fCB7fTtcblxuICAgIC8qKiBCcm93c2VyIHVzZXIgYWdlbnQgc3RyaW5nLiAqL1xuICAgIHZhciB1c2VyQWdlbnQgPSBuYXYudXNlckFnZW50IHx8ICcnO1xuXG4gICAgdWEgfHwgKHVhID0gdXNlckFnZW50KTtcblxuICAgIC8qKiBVc2VkIHRvIGZsYWcgd2hlbiBgdGhpc0JpbmRpbmdgIGlzIHRoZSBbTW9kdWxlU2NvcGVdLiAqL1xuICAgIHZhciBpc01vZHVsZVNjb3BlID0gaXNDdXN0b21Db250ZXh0IHx8IHRoaXNCaW5kaW5nID09IG9sZFJvb3Q7XG5cbiAgICAvKiogVXNlZCB0byBkZXRlY3QgaWYgYnJvd3NlciBpcyBsaWtlIENocm9tZS4gKi9cbiAgICB2YXIgbGlrZUNocm9tZSA9IGlzQ3VzdG9tQ29udGV4dFxuICAgICAgPyAhIW5hdi5saWtlQ2hyb21lXG4gICAgICA6IC9cXGJDaHJvbWVcXGIvLnRlc3QodWEpICYmICEvaW50ZXJuYWx8XFxuL2kudGVzdCh0b1N0cmluZy50b1N0cmluZygpKTtcblxuICAgIC8qKiBJbnRlcm5hbCBgW1tDbGFzc11dYCB2YWx1ZSBzaG9ydGN1dHMuICovXG4gICAgdmFyIG9iamVjdENsYXNzID0gJ09iamVjdCcsXG4gICAgICAgIGFpclJ1bnRpbWVDbGFzcyA9IGlzQ3VzdG9tQ29udGV4dCA/IG9iamVjdENsYXNzIDogJ1NjcmlwdEJyaWRnaW5nUHJveHlPYmplY3QnLFxuICAgICAgICBlbnZpcm9DbGFzcyA9IGlzQ3VzdG9tQ29udGV4dCA/IG9iamVjdENsYXNzIDogJ0Vudmlyb25tZW50JyxcbiAgICAgICAgamF2YUNsYXNzID0gKGlzQ3VzdG9tQ29udGV4dCAmJiBjb250ZXh0LmphdmEpID8gJ0phdmFQYWNrYWdlJyA6IGdldENsYXNzT2YoY29udGV4dC5qYXZhKSxcbiAgICAgICAgcGhhbnRvbUNsYXNzID0gaXNDdXN0b21Db250ZXh0ID8gb2JqZWN0Q2xhc3MgOiAnUnVudGltZU9iamVjdCc7XG5cbiAgICAvKiogRGV0ZWN0IEphdmEgZW52aXJvbm1lbnRzLiAqL1xuICAgIHZhciBqYXZhID0gL1xcYkphdmEvLnRlc3QoamF2YUNsYXNzKSAmJiBjb250ZXh0LmphdmE7XG5cbiAgICAvKiogRGV0ZWN0IFJoaW5vLiAqL1xuICAgIHZhciByaGlubyA9IGphdmEgJiYgZ2V0Q2xhc3NPZihjb250ZXh0LmVudmlyb25tZW50KSA9PSBlbnZpcm9DbGFzcztcblxuICAgIC8qKiBBIGNoYXJhY3RlciB0byByZXByZXNlbnQgYWxwaGEuICovXG4gICAgdmFyIGFscGhhID0gamF2YSA/ICdhJyA6ICdcXHUwM2IxJztcblxuICAgIC8qKiBBIGNoYXJhY3RlciB0byByZXByZXNlbnQgYmV0YS4gKi9cbiAgICB2YXIgYmV0YSA9IGphdmEgPyAnYicgOiAnXFx1MDNiMic7XG5cbiAgICAvKiogQnJvd3NlciBkb2N1bWVudCBvYmplY3QuICovXG4gICAgdmFyIGRvYyA9IGNvbnRleHQuZG9jdW1lbnQgfHwge307XG5cbiAgICAvKipcbiAgICAgKiBEZXRlY3QgT3BlcmEgYnJvd3NlciAoUHJlc3RvLWJhc2VkKS5cbiAgICAgKiBodHRwOi8vd3d3Lmhvd3RvY3JlYXRlLmNvLnVrL29wZXJhU3R1ZmYvb3BlcmFPYmplY3QuaHRtbFxuICAgICAqIGh0dHA6Ly9kZXYub3BlcmEuY29tL2FydGljbGVzL3ZpZXcvb3BlcmEtbWluaS13ZWItY29udGVudC1hdXRob3JpbmctZ3VpZGVsaW5lcy8jb3BlcmFtaW5pXG4gICAgICovXG4gICAgdmFyIG9wZXJhID0gY29udGV4dC5vcGVyYW1pbmkgfHwgY29udGV4dC5vcGVyYTtcblxuICAgIC8qKiBPcGVyYSBgW1tDbGFzc11dYC4gKi9cbiAgICB2YXIgb3BlcmFDbGFzcyA9IHJlT3BlcmEudGVzdChvcGVyYUNsYXNzID0gKGlzQ3VzdG9tQ29udGV4dCAmJiBvcGVyYSkgPyBvcGVyYVsnW1tDbGFzc11dJ10gOiBnZXRDbGFzc09mKG9wZXJhKSlcbiAgICAgID8gb3BlcmFDbGFzc1xuICAgICAgOiAob3BlcmEgPSBudWxsKTtcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8qKiBUZW1wb3JhcnkgdmFyaWFibGUgdXNlZCBvdmVyIHRoZSBzY3JpcHQncyBsaWZldGltZS4gKi9cbiAgICB2YXIgZGF0YTtcblxuICAgIC8qKiBUaGUgQ1BVIGFyY2hpdGVjdHVyZS4gKi9cbiAgICB2YXIgYXJjaCA9IHVhO1xuXG4gICAgLyoqIFBsYXRmb3JtIGRlc2NyaXB0aW9uIGFycmF5LiAqL1xuICAgIHZhciBkZXNjcmlwdGlvbiA9IFtdO1xuXG4gICAgLyoqIFBsYXRmb3JtIGFscGhhL2JldGEgaW5kaWNhdG9yLiAqL1xuICAgIHZhciBwcmVyZWxlYXNlID0gbnVsbDtcblxuICAgIC8qKiBBIGZsYWcgdG8gaW5kaWNhdGUgdGhhdCBlbnZpcm9ubWVudCBmZWF0dXJlcyBzaG91bGQgYmUgdXNlZCB0byByZXNvbHZlIHRoZSBwbGF0Zm9ybS4gKi9cbiAgICB2YXIgdXNlRmVhdHVyZXMgPSB1YSA9PSB1c2VyQWdlbnQ7XG5cbiAgICAvKiogVGhlIGJyb3dzZXIvZW52aXJvbm1lbnQgdmVyc2lvbi4gKi9cbiAgICB2YXIgdmVyc2lvbiA9IHVzZUZlYXR1cmVzICYmIG9wZXJhICYmIHR5cGVvZiBvcGVyYS52ZXJzaW9uID09ICdmdW5jdGlvbicgJiYgb3BlcmEudmVyc2lvbigpO1xuXG4gICAgLyoqIEEgZmxhZyB0byBpbmRpY2F0ZSBpZiB0aGUgT1MgZW5kcyB3aXRoIFwiLyBWZXJzaW9uXCIgKi9cbiAgICB2YXIgaXNTcGVjaWFsQ2FzZWRPUztcblxuICAgIC8qIERldGVjdGFibGUgbGF5b3V0IGVuZ2luZXMgKG9yZGVyIGlzIGltcG9ydGFudCkuICovXG4gICAgdmFyIGxheW91dCA9IGdldExheW91dChbXG4gICAgICB7ICdsYWJlbCc6ICdFZGdlSFRNTCcsICdwYXR0ZXJuJzogJ0VkZ2UnIH0sXG4gICAgICAnVHJpZGVudCcsXG4gICAgICB7ICdsYWJlbCc6ICdXZWJLaXQnLCAncGF0dGVybic6ICdBcHBsZVdlYktpdCcgfSxcbiAgICAgICdpQ2FiJyxcbiAgICAgICdQcmVzdG8nLFxuICAgICAgJ05ldEZyb250JyxcbiAgICAgICdUYXNtYW4nLFxuICAgICAgJ0tIVE1MJyxcbiAgICAgICdHZWNrbydcbiAgICBdKTtcblxuICAgIC8qIERldGVjdGFibGUgYnJvd3NlciBuYW1lcyAob3JkZXIgaXMgaW1wb3J0YW50KS4gKi9cbiAgICB2YXIgbmFtZSA9IGdldE5hbWUoW1xuICAgICAgJ0Fkb2JlIEFJUicsXG4gICAgICAnQXJvcmEnLFxuICAgICAgJ0F2YW50IEJyb3dzZXInLFxuICAgICAgJ0JyZWFjaCcsXG4gICAgICAnQ2FtaW5vJyxcbiAgICAgICdFbGVjdHJvbicsXG4gICAgICAnRXBpcGhhbnknLFxuICAgICAgJ0Zlbm5lYycsXG4gICAgICAnRmxvY2snLFxuICAgICAgJ0dhbGVvbicsXG4gICAgICAnR3JlZW5Ccm93c2VyJyxcbiAgICAgICdpQ2FiJyxcbiAgICAgICdJY2V3ZWFzZWwnLFxuICAgICAgJ0stTWVsZW9uJyxcbiAgICAgICdLb25xdWVyb3InLFxuICAgICAgJ0x1bmFzY2FwZScsXG4gICAgICAnTWF4dGhvbicsXG4gICAgICB7ICdsYWJlbCc6ICdNaWNyb3NvZnQgRWRnZScsICdwYXR0ZXJuJzogJ0VkZ2UnIH0sXG4gICAgICAnTWlkb3JpJyxcbiAgICAgICdOb29rIEJyb3dzZXInLFxuICAgICAgJ1BhbGVNb29uJyxcbiAgICAgICdQaGFudG9tSlMnLFxuICAgICAgJ1JhdmVuJyxcbiAgICAgICdSZWtvbnEnLFxuICAgICAgJ1JvY2tNZWx0JyxcbiAgICAgIHsgJ2xhYmVsJzogJ1NhbXN1bmcgSW50ZXJuZXQnLCAncGF0dGVybic6ICdTYW1zdW5nQnJvd3NlcicgfSxcbiAgICAgICdTZWFNb25rZXknLFxuICAgICAgeyAnbGFiZWwnOiAnU2lsaycsICdwYXR0ZXJuJzogJyg/OkNsb3VkOXxTaWxrLUFjY2VsZXJhdGVkKScgfSxcbiAgICAgICdTbGVpcG5pcicsXG4gICAgICAnU2xpbUJyb3dzZXInLFxuICAgICAgeyAnbGFiZWwnOiAnU1JXYXJlIElyb24nLCAncGF0dGVybic6ICdJcm9uJyB9LFxuICAgICAgJ1N1bnJpc2UnLFxuICAgICAgJ1N3aWZ0Zm94JyxcbiAgICAgICdXYXRlcmZveCcsXG4gICAgICAnV2ViUG9zaXRpdmUnLFxuICAgICAgJ09wZXJhIE1pbmknLFxuICAgICAgeyAnbGFiZWwnOiAnT3BlcmEgTWluaScsICdwYXR0ZXJuJzogJ09QaU9TJyB9LFxuICAgICAgJ09wZXJhJyxcbiAgICAgIHsgJ2xhYmVsJzogJ09wZXJhJywgJ3BhdHRlcm4nOiAnT1BSJyB9LFxuICAgICAgJ0Nocm9tZScsXG4gICAgICB7ICdsYWJlbCc6ICdDaHJvbWUgTW9iaWxlJywgJ3BhdHRlcm4nOiAnKD86Q3JpT1N8Q3JNbyknIH0sXG4gICAgICB7ICdsYWJlbCc6ICdGaXJlZm94JywgJ3BhdHRlcm4nOiAnKD86RmlyZWZveHxNaW5lZmllbGQpJyB9LFxuICAgICAgeyAnbGFiZWwnOiAnRmlyZWZveCBmb3IgaU9TJywgJ3BhdHRlcm4nOiAnRnhpT1MnIH0sXG4gICAgICB7ICdsYWJlbCc6ICdJRScsICdwYXR0ZXJuJzogJ0lFTW9iaWxlJyB9LFxuICAgICAgeyAnbGFiZWwnOiAnSUUnLCAncGF0dGVybic6ICdNU0lFJyB9LFxuICAgICAgJ1NhZmFyaSdcbiAgICBdKTtcblxuICAgIC8qIERldGVjdGFibGUgcHJvZHVjdHMgKG9yZGVyIGlzIGltcG9ydGFudCkuICovXG4gICAgdmFyIHByb2R1Y3QgPSBnZXRQcm9kdWN0KFtcbiAgICAgIHsgJ2xhYmVsJzogJ0JsYWNrQmVycnknLCAncGF0dGVybic6ICdCQjEwJyB9LFxuICAgICAgJ0JsYWNrQmVycnknLFxuICAgICAgeyAnbGFiZWwnOiAnR2FsYXh5IFMnLCAncGF0dGVybic6ICdHVC1JOTAwMCcgfSxcbiAgICAgIHsgJ2xhYmVsJzogJ0dhbGF4eSBTMicsICdwYXR0ZXJuJzogJ0dULUk5MTAwJyB9LFxuICAgICAgeyAnbGFiZWwnOiAnR2FsYXh5IFMzJywgJ3BhdHRlcm4nOiAnR1QtSTkzMDAnIH0sXG4gICAgICB7ICdsYWJlbCc6ICdHYWxheHkgUzQnLCAncGF0dGVybic6ICdHVC1JOTUwMCcgfSxcbiAgICAgIHsgJ2xhYmVsJzogJ0dhbGF4eSBTNScsICdwYXR0ZXJuJzogJ1NNLUc5MDAnIH0sXG4gICAgICB7ICdsYWJlbCc6ICdHYWxheHkgUzYnLCAncGF0dGVybic6ICdTTS1HOTIwJyB9LFxuICAgICAgeyAnbGFiZWwnOiAnR2FsYXh5IFM2IEVkZ2UnLCAncGF0dGVybic6ICdTTS1HOTI1JyB9LFxuICAgICAgeyAnbGFiZWwnOiAnR2FsYXh5IFM3JywgJ3BhdHRlcm4nOiAnU00tRzkzMCcgfSxcbiAgICAgIHsgJ2xhYmVsJzogJ0dhbGF4eSBTNyBFZGdlJywgJ3BhdHRlcm4nOiAnU00tRzkzNScgfSxcbiAgICAgICdHb29nbGUgVFYnLFxuICAgICAgJ0x1bWlhJyxcbiAgICAgICdpUGFkJyxcbiAgICAgICdpUG9kJyxcbiAgICAgICdpUGhvbmUnLFxuICAgICAgJ0tpbmRsZScsXG4gICAgICB7ICdsYWJlbCc6ICdLaW5kbGUgRmlyZScsICdwYXR0ZXJuJzogJyg/OkNsb3VkOXxTaWxrLUFjY2VsZXJhdGVkKScgfSxcbiAgICAgICdOZXh1cycsXG4gICAgICAnTm9vaycsXG4gICAgICAnUGxheUJvb2snLFxuICAgICAgJ1BsYXlTdGF0aW9uIFZpdGEnLFxuICAgICAgJ1BsYXlTdGF0aW9uJyxcbiAgICAgICdUb3VjaFBhZCcsXG4gICAgICAnVHJhbnNmb3JtZXInLFxuICAgICAgeyAnbGFiZWwnOiAnV2lpIFUnLCAncGF0dGVybic6ICdXaWlVJyB9LFxuICAgICAgJ1dpaScsXG4gICAgICAnWGJveCBPbmUnLFxuICAgICAgeyAnbGFiZWwnOiAnWGJveCAzNjAnLCAncGF0dGVybic6ICdYYm94JyB9LFxuICAgICAgJ1hvb20nXG4gICAgXSk7XG5cbiAgICAvKiBEZXRlY3RhYmxlIG1hbnVmYWN0dXJlcnMuICovXG4gICAgdmFyIG1hbnVmYWN0dXJlciA9IGdldE1hbnVmYWN0dXJlcih7XG4gICAgICAnQXBwbGUnOiB7ICdpUGFkJzogMSwgJ2lQaG9uZSc6IDEsICdpUG9kJzogMSB9LFxuICAgICAgJ0FyY2hvcyc6IHt9LFxuICAgICAgJ0FtYXpvbic6IHsgJ0tpbmRsZSc6IDEsICdLaW5kbGUgRmlyZSc6IDEgfSxcbiAgICAgICdBc3VzJzogeyAnVHJhbnNmb3JtZXInOiAxIH0sXG4gICAgICAnQmFybmVzICYgTm9ibGUnOiB7ICdOb29rJzogMSB9LFxuICAgICAgJ0JsYWNrQmVycnknOiB7ICdQbGF5Qm9vayc6IDEgfSxcbiAgICAgICdHb29nbGUnOiB7ICdHb29nbGUgVFYnOiAxLCAnTmV4dXMnOiAxIH0sXG4gICAgICAnSFAnOiB7ICdUb3VjaFBhZCc6IDEgfSxcbiAgICAgICdIVEMnOiB7fSxcbiAgICAgICdMRyc6IHt9LFxuICAgICAgJ01pY3Jvc29mdCc6IHsgJ1hib3gnOiAxLCAnWGJveCBPbmUnOiAxIH0sXG4gICAgICAnTW90b3JvbGEnOiB7ICdYb29tJzogMSB9LFxuICAgICAgJ05pbnRlbmRvJzogeyAnV2lpIFUnOiAxLCAgJ1dpaSc6IDEgfSxcbiAgICAgICdOb2tpYSc6IHsgJ0x1bWlhJzogMSB9LFxuICAgICAgJ1NhbXN1bmcnOiB7ICdHYWxheHkgUyc6IDEsICdHYWxheHkgUzInOiAxLCAnR2FsYXh5IFMzJzogMSwgJ0dhbGF4eSBTNCc6IDEgfSxcbiAgICAgICdTb255JzogeyAnUGxheVN0YXRpb24nOiAxLCAnUGxheVN0YXRpb24gVml0YSc6IDEgfVxuICAgIH0pO1xuXG4gICAgLyogRGV0ZWN0YWJsZSBvcGVyYXRpbmcgc3lzdGVtcyAob3JkZXIgaXMgaW1wb3J0YW50KS4gKi9cbiAgICB2YXIgb3MgPSBnZXRPUyhbXG4gICAgICAnV2luZG93cyBQaG9uZScsXG4gICAgICAnQW5kcm9pZCcsXG4gICAgICAnQ2VudE9TJyxcbiAgICAgIHsgJ2xhYmVsJzogJ0Nocm9tZSBPUycsICdwYXR0ZXJuJzogJ0NyT1MnIH0sXG4gICAgICAnRGViaWFuJyxcbiAgICAgICdGZWRvcmEnLFxuICAgICAgJ0ZyZWVCU0QnLFxuICAgICAgJ0dlbnRvbycsXG4gICAgICAnSGFpa3UnLFxuICAgICAgJ0t1YnVudHUnLFxuICAgICAgJ0xpbnV4IE1pbnQnLFxuICAgICAgJ09wZW5CU0QnLFxuICAgICAgJ1JlZCBIYXQnLFxuICAgICAgJ1N1U0UnLFxuICAgICAgJ1VidW50dScsXG4gICAgICAnWHVidW50dScsXG4gICAgICAnQ3lnd2luJyxcbiAgICAgICdTeW1iaWFuIE9TJyxcbiAgICAgICdocHdPUycsXG4gICAgICAnd2ViT1MgJyxcbiAgICAgICd3ZWJPUycsXG4gICAgICAnVGFibGV0IE9TJyxcbiAgICAgICdUaXplbicsXG4gICAgICAnTGludXgnLFxuICAgICAgJ01hYyBPUyBYJyxcbiAgICAgICdNYWNpbnRvc2gnLFxuICAgICAgJ01hYycsXG4gICAgICAnV2luZG93cyA5ODsnLFxuICAgICAgJ1dpbmRvd3MgJ1xuICAgIF0pO1xuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLyoqXG4gICAgICogUGlja3MgdGhlIGxheW91dCBlbmdpbmUgZnJvbSBhbiBhcnJheSBvZiBndWVzc2VzLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBndWVzc2VzIEFuIGFycmF5IG9mIGd1ZXNzZXMuXG4gICAgICogQHJldHVybnMge251bGx8c3RyaW5nfSBUaGUgZGV0ZWN0ZWQgbGF5b3V0IGVuZ2luZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRMYXlvdXQoZ3Vlc3Nlcykge1xuICAgICAgcmV0dXJuIHJlZHVjZShndWVzc2VzLCBmdW5jdGlvbihyZXN1bHQsIGd1ZXNzKSB7XG4gICAgICAgIHJldHVybiByZXN1bHQgfHwgUmVnRXhwKCdcXFxcYicgKyAoXG4gICAgICAgICAgZ3Vlc3MucGF0dGVybiB8fCBxdWFsaWZ5KGd1ZXNzKVxuICAgICAgICApICsgJ1xcXFxiJywgJ2knKS5leGVjKHVhKSAmJiAoZ3Vlc3MubGFiZWwgfHwgZ3Vlc3MpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGlja3MgdGhlIG1hbnVmYWN0dXJlciBmcm9tIGFuIGFycmF5IG9mIGd1ZXNzZXMuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGd1ZXNzZXMgQW4gb2JqZWN0IG9mIGd1ZXNzZXMuXG4gICAgICogQHJldHVybnMge251bGx8c3RyaW5nfSBUaGUgZGV0ZWN0ZWQgbWFudWZhY3R1cmVyLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldE1hbnVmYWN0dXJlcihndWVzc2VzKSB7XG4gICAgICByZXR1cm4gcmVkdWNlKGd1ZXNzZXMsIGZ1bmN0aW9uKHJlc3VsdCwgdmFsdWUsIGtleSkge1xuICAgICAgICAvLyBMb29rdXAgdGhlIG1hbnVmYWN0dXJlciBieSBwcm9kdWN0IG9yIHNjYW4gdGhlIFVBIGZvciB0aGUgbWFudWZhY3R1cmVyLlxuICAgICAgICByZXR1cm4gcmVzdWx0IHx8IChcbiAgICAgICAgICB2YWx1ZVtwcm9kdWN0XSB8fFxuICAgICAgICAgIHZhbHVlWy9eW2Etel0rKD86ICtbYS16XStcXGIpKi9pLmV4ZWMocHJvZHVjdCldIHx8XG4gICAgICAgICAgUmVnRXhwKCdcXFxcYicgKyBxdWFsaWZ5KGtleSkgKyAnKD86XFxcXGJ8XFxcXHcqXFxcXGQpJywgJ2knKS5leGVjKHVhKVxuICAgICAgICApICYmIGtleTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBpY2tzIHRoZSBicm93c2VyIG5hbWUgZnJvbSBhbiBhcnJheSBvZiBndWVzc2VzLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBndWVzc2VzIEFuIGFycmF5IG9mIGd1ZXNzZXMuXG4gICAgICogQHJldHVybnMge251bGx8c3RyaW5nfSBUaGUgZGV0ZWN0ZWQgYnJvd3NlciBuYW1lLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldE5hbWUoZ3Vlc3Nlcykge1xuICAgICAgcmV0dXJuIHJlZHVjZShndWVzc2VzLCBmdW5jdGlvbihyZXN1bHQsIGd1ZXNzKSB7XG4gICAgICAgIHJldHVybiByZXN1bHQgfHwgUmVnRXhwKCdcXFxcYicgKyAoXG4gICAgICAgICAgZ3Vlc3MucGF0dGVybiB8fCBxdWFsaWZ5KGd1ZXNzKVxuICAgICAgICApICsgJ1xcXFxiJywgJ2knKS5leGVjKHVhKSAmJiAoZ3Vlc3MubGFiZWwgfHwgZ3Vlc3MpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGlja3MgdGhlIE9TIG5hbWUgZnJvbSBhbiBhcnJheSBvZiBndWVzc2VzLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBndWVzc2VzIEFuIGFycmF5IG9mIGd1ZXNzZXMuXG4gICAgICogQHJldHVybnMge251bGx8c3RyaW5nfSBUaGUgZGV0ZWN0ZWQgT1MgbmFtZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRPUyhndWVzc2VzKSB7XG4gICAgICByZXR1cm4gcmVkdWNlKGd1ZXNzZXMsIGZ1bmN0aW9uKHJlc3VsdCwgZ3Vlc3MpIHtcbiAgICAgICAgdmFyIHBhdHRlcm4gPSBndWVzcy5wYXR0ZXJuIHx8IHF1YWxpZnkoZ3Vlc3MpO1xuICAgICAgICBpZiAoIXJlc3VsdCAmJiAocmVzdWx0ID1cbiAgICAgICAgICAgICAgUmVnRXhwKCdcXFxcYicgKyBwYXR0ZXJuICsgJyg/Oi9bXFxcXGQuXSt8WyBcXFxcdy5dKiknLCAnaScpLmV4ZWModWEpXG4gICAgICAgICAgICApKSB7XG4gICAgICAgICAgcmVzdWx0ID0gY2xlYW51cE9TKHJlc3VsdCwgcGF0dGVybiwgZ3Vlc3MubGFiZWwgfHwgZ3Vlc3MpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQaWNrcyB0aGUgcHJvZHVjdCBuYW1lIGZyb20gYW4gYXJyYXkgb2YgZ3Vlc3Nlcy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtBcnJheX0gZ3Vlc3NlcyBBbiBhcnJheSBvZiBndWVzc2VzLlxuICAgICAqIEByZXR1cm5zIHtudWxsfHN0cmluZ30gVGhlIGRldGVjdGVkIHByb2R1Y3QgbmFtZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRQcm9kdWN0KGd1ZXNzZXMpIHtcbiAgICAgIHJldHVybiByZWR1Y2UoZ3Vlc3NlcywgZnVuY3Rpb24ocmVzdWx0LCBndWVzcykge1xuICAgICAgICB2YXIgcGF0dGVybiA9IGd1ZXNzLnBhdHRlcm4gfHwgcXVhbGlmeShndWVzcyk7XG4gICAgICAgIGlmICghcmVzdWx0ICYmIChyZXN1bHQgPVxuICAgICAgICAgICAgICBSZWdFeHAoJ1xcXFxiJyArIHBhdHRlcm4gKyAnICpcXFxcZCtbLlxcXFx3X10qJywgJ2knKS5leGVjKHVhKSB8fFxuICAgICAgICAgICAgICBSZWdFeHAoJ1xcXFxiJyArIHBhdHRlcm4gKyAnICpcXFxcdystW1xcXFx3XSonLCAnaScpLmV4ZWModWEpIHx8XG4gICAgICAgICAgICAgIFJlZ0V4cCgnXFxcXGInICsgcGF0dGVybiArICcoPzo7ICooPzpbYS16XStbXy1dKT9bYS16XStcXFxcZCt8W14gKCk7LV0qKScsICdpJykuZXhlYyh1YSlcbiAgICAgICAgICAgICkpIHtcbiAgICAgICAgICAvLyBTcGxpdCBieSBmb3J3YXJkIHNsYXNoIGFuZCBhcHBlbmQgcHJvZHVjdCB2ZXJzaW9uIGlmIG5lZWRlZC5cbiAgICAgICAgICBpZiAoKHJlc3VsdCA9IFN0cmluZygoZ3Vlc3MubGFiZWwgJiYgIVJlZ0V4cChwYXR0ZXJuLCAnaScpLnRlc3QoZ3Vlc3MubGFiZWwpKSA/IGd1ZXNzLmxhYmVsIDogcmVzdWx0KS5zcGxpdCgnLycpKVsxXSAmJiAhL1tcXGQuXSsvLnRlc3QocmVzdWx0WzBdKSkge1xuICAgICAgICAgICAgcmVzdWx0WzBdICs9ICcgJyArIHJlc3VsdFsxXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gQ29ycmVjdCBjaGFyYWN0ZXIgY2FzZSBhbmQgY2xlYW51cCBzdHJpbmcuXG4gICAgICAgICAgZ3Vlc3MgPSBndWVzcy5sYWJlbCB8fCBndWVzcztcbiAgICAgICAgICByZXN1bHQgPSBmb3JtYXQocmVzdWx0WzBdXG4gICAgICAgICAgICAucmVwbGFjZShSZWdFeHAocGF0dGVybiwgJ2knKSwgZ3Vlc3MpXG4gICAgICAgICAgICAucmVwbGFjZShSZWdFeHAoJzsgKig/OicgKyBndWVzcyArICdbXy1dKT8nLCAnaScpLCAnICcpXG4gICAgICAgICAgICAucmVwbGFjZShSZWdFeHAoJygnICsgZ3Vlc3MgKyAnKVstXy5dPyhcXFxcdyknLCAnaScpLCAnJDEgJDInKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc29sdmVzIHRoZSB2ZXJzaW9uIHVzaW5nIGFuIGFycmF5IG9mIFVBIHBhdHRlcm5zLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBwYXR0ZXJucyBBbiBhcnJheSBvZiBVQSBwYXR0ZXJucy5cbiAgICAgKiBAcmV0dXJucyB7bnVsbHxzdHJpbmd9IFRoZSBkZXRlY3RlZCB2ZXJzaW9uLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldFZlcnNpb24ocGF0dGVybnMpIHtcbiAgICAgIHJldHVybiByZWR1Y2UocGF0dGVybnMsIGZ1bmN0aW9uKHJlc3VsdCwgcGF0dGVybikge1xuICAgICAgICByZXR1cm4gcmVzdWx0IHx8IChSZWdFeHAocGF0dGVybiArXG4gICAgICAgICAgJyg/Oi1bXFxcXGQuXSsvfCg/OiBmb3IgW1xcXFx3LV0rKT9bIC8tXSkoW1xcXFxkLl0rW14gKCk7L18tXSopJywgJ2knKS5leGVjKHVhKSB8fCAwKVsxXSB8fCBudWxsO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBgcGxhdGZvcm0uZGVzY3JpcHRpb25gIHdoZW4gdGhlIHBsYXRmb3JtIG9iamVjdCBpcyBjb2VyY2VkIHRvIGEgc3RyaW5nLlxuICAgICAqXG4gICAgICogQG5hbWUgdG9TdHJpbmdcbiAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm1cbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIGBwbGF0Zm9ybS5kZXNjcmlwdGlvbmAgaWYgYXZhaWxhYmxlLCBlbHNlIGFuIGVtcHR5IHN0cmluZy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiB0b1N0cmluZ1BsYXRmb3JtKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZGVzY3JpcHRpb24gfHwgJyc7XG4gICAgfVxuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLy8gQ29udmVydCBsYXlvdXQgdG8gYW4gYXJyYXkgc28gd2UgY2FuIGFkZCBleHRyYSBkZXRhaWxzLlxuICAgIGxheW91dCAmJiAobGF5b3V0ID0gW2xheW91dF0pO1xuXG4gICAgLy8gRGV0ZWN0IHByb2R1Y3QgbmFtZXMgdGhhdCBjb250YWluIHRoZWlyIG1hbnVmYWN0dXJlcidzIG5hbWUuXG4gICAgaWYgKG1hbnVmYWN0dXJlciAmJiAhcHJvZHVjdCkge1xuICAgICAgcHJvZHVjdCA9IGdldFByb2R1Y3QoW21hbnVmYWN0dXJlcl0pO1xuICAgIH1cbiAgICAvLyBDbGVhbiB1cCBHb29nbGUgVFYuXG4gICAgaWYgKChkYXRhID0gL1xcYkdvb2dsZSBUVlxcYi8uZXhlYyhwcm9kdWN0KSkpIHtcbiAgICAgIHByb2R1Y3QgPSBkYXRhWzBdO1xuICAgIH1cbiAgICAvLyBEZXRlY3Qgc2ltdWxhdG9ycy5cbiAgICBpZiAoL1xcYlNpbXVsYXRvclxcYi9pLnRlc3QodWEpKSB7XG4gICAgICBwcm9kdWN0ID0gKHByb2R1Y3QgPyBwcm9kdWN0ICsgJyAnIDogJycpICsgJ1NpbXVsYXRvcic7XG4gICAgfVxuICAgIC8vIERldGVjdCBPcGVyYSBNaW5pIDgrIHJ1bm5pbmcgaW4gVHVyYm8vVW5jb21wcmVzc2VkIG1vZGUgb24gaU9TLlxuICAgIGlmIChuYW1lID09ICdPcGVyYSBNaW5pJyAmJiAvXFxiT1BpT1NcXGIvLnRlc3QodWEpKSB7XG4gICAgICBkZXNjcmlwdGlvbi5wdXNoKCdydW5uaW5nIGluIFR1cmJvL1VuY29tcHJlc3NlZCBtb2RlJyk7XG4gICAgfVxuICAgIC8vIERldGVjdCBJRSBNb2JpbGUgMTEuXG4gICAgaWYgKG5hbWUgPT0gJ0lFJyAmJiAvXFxibGlrZSBpUGhvbmUgT1NcXGIvLnRlc3QodWEpKSB7XG4gICAgICBkYXRhID0gcGFyc2UodWEucmVwbGFjZSgvbGlrZSBpUGhvbmUgT1MvLCAnJykpO1xuICAgICAgbWFudWZhY3R1cmVyID0gZGF0YS5tYW51ZmFjdHVyZXI7XG4gICAgICBwcm9kdWN0ID0gZGF0YS5wcm9kdWN0O1xuICAgIH1cbiAgICAvLyBEZXRlY3QgaU9TLlxuICAgIGVsc2UgaWYgKC9eaVAvLnRlc3QocHJvZHVjdCkpIHtcbiAgICAgIG5hbWUgfHwgKG5hbWUgPSAnU2FmYXJpJyk7XG4gICAgICBvcyA9ICdpT1MnICsgKChkYXRhID0gLyBPUyAoW1xcZF9dKykvaS5leGVjKHVhKSlcbiAgICAgICAgPyAnICcgKyBkYXRhWzFdLnJlcGxhY2UoL18vZywgJy4nKVxuICAgICAgICA6ICcnKTtcbiAgICB9XG4gICAgLy8gRGV0ZWN0IEt1YnVudHUuXG4gICAgZWxzZSBpZiAobmFtZSA9PSAnS29ucXVlcm9yJyAmJiAhL2J1bnR1L2kudGVzdChvcykpIHtcbiAgICAgIG9zID0gJ0t1YnVudHUnO1xuICAgIH1cbiAgICAvLyBEZXRlY3QgQW5kcm9pZCBicm93c2Vycy5cbiAgICBlbHNlIGlmICgobWFudWZhY3R1cmVyICYmIG1hbnVmYWN0dXJlciAhPSAnR29vZ2xlJyAmJlxuICAgICAgICAoKC9DaHJvbWUvLnRlc3QobmFtZSkgJiYgIS9cXGJNb2JpbGUgU2FmYXJpXFxiL2kudGVzdCh1YSkpIHx8IC9cXGJWaXRhXFxiLy50ZXN0KHByb2R1Y3QpKSkgfHxcbiAgICAgICAgKC9cXGJBbmRyb2lkXFxiLy50ZXN0KG9zKSAmJiAvXkNocm9tZS8udGVzdChuYW1lKSAmJiAvXFxiVmVyc2lvblxcLy9pLnRlc3QodWEpKSkge1xuICAgICAgbmFtZSA9ICdBbmRyb2lkIEJyb3dzZXInO1xuICAgICAgb3MgPSAvXFxiQW5kcm9pZFxcYi8udGVzdChvcykgPyBvcyA6ICdBbmRyb2lkJztcbiAgICB9XG4gICAgLy8gRGV0ZWN0IFNpbGsgZGVza3RvcC9hY2NlbGVyYXRlZCBtb2Rlcy5cbiAgICBlbHNlIGlmIChuYW1lID09ICdTaWxrJykge1xuICAgICAgaWYgKCEvXFxiTW9iaS9pLnRlc3QodWEpKSB7XG4gICAgICAgIG9zID0gJ0FuZHJvaWQnO1xuICAgICAgICBkZXNjcmlwdGlvbi51bnNoaWZ0KCdkZXNrdG9wIG1vZGUnKTtcbiAgICAgIH1cbiAgICAgIGlmICgvQWNjZWxlcmF0ZWQgKj0gKnRydWUvaS50ZXN0KHVhKSkge1xuICAgICAgICBkZXNjcmlwdGlvbi51bnNoaWZ0KCdhY2NlbGVyYXRlZCcpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBEZXRlY3QgUGFsZU1vb24gaWRlbnRpZnlpbmcgYXMgRmlyZWZveC5cbiAgICBlbHNlIGlmIChuYW1lID09ICdQYWxlTW9vbicgJiYgKGRhdGEgPSAvXFxiRmlyZWZveFxcLyhbXFxkLl0rKVxcYi8uZXhlYyh1YSkpKSB7XG4gICAgICBkZXNjcmlwdGlvbi5wdXNoKCdpZGVudGlmeWluZyBhcyBGaXJlZm94ICcgKyBkYXRhWzFdKTtcbiAgICB9XG4gICAgLy8gRGV0ZWN0IEZpcmVmb3ggT1MgYW5kIHByb2R1Y3RzIHJ1bm5pbmcgRmlyZWZveC5cbiAgICBlbHNlIGlmIChuYW1lID09ICdGaXJlZm94JyAmJiAoZGF0YSA9IC9cXGIoTW9iaWxlfFRhYmxldHxUVilcXGIvaS5leGVjKHVhKSkpIHtcbiAgICAgIG9zIHx8IChvcyA9ICdGaXJlZm94IE9TJyk7XG4gICAgICBwcm9kdWN0IHx8IChwcm9kdWN0ID0gZGF0YVsxXSk7XG4gICAgfVxuICAgIC8vIERldGVjdCBmYWxzZSBwb3NpdGl2ZXMgZm9yIEZpcmVmb3gvU2FmYXJpLlxuICAgIGVsc2UgaWYgKCFuYW1lIHx8IChkYXRhID0gIS9cXGJNaW5lZmllbGRcXGIvaS50ZXN0KHVhKSAmJiAvXFxiKD86RmlyZWZveHxTYWZhcmkpXFxiLy5leGVjKG5hbWUpKSkge1xuICAgICAgLy8gRXNjYXBlIHRoZSBgL2AgZm9yIEZpcmVmb3ggMS5cbiAgICAgIGlmIChuYW1lICYmICFwcm9kdWN0ICYmIC9bXFwvLF18XlteKF0rP1xcKS8udGVzdCh1YS5zbGljZSh1YS5pbmRleE9mKGRhdGEgKyAnLycpICsgOCkpKSB7XG4gICAgICAgIC8vIENsZWFyIG5hbWUgb2YgZmFsc2UgcG9zaXRpdmVzLlxuICAgICAgICBuYW1lID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIC8vIFJlYXNzaWduIGEgZ2VuZXJpYyBuYW1lLlxuICAgICAgaWYgKChkYXRhID0gcHJvZHVjdCB8fCBtYW51ZmFjdHVyZXIgfHwgb3MpICYmXG4gICAgICAgICAgKHByb2R1Y3QgfHwgbWFudWZhY3R1cmVyIHx8IC9cXGIoPzpBbmRyb2lkfFN5bWJpYW4gT1N8VGFibGV0IE9TfHdlYk9TKVxcYi8udGVzdChvcykpKSB7XG4gICAgICAgIG5hbWUgPSAvW2Etel0rKD86IEhhdCk/L2kuZXhlYygvXFxiQW5kcm9pZFxcYi8udGVzdChvcykgPyBvcyA6IGRhdGEpICsgJyBCcm93c2VyJztcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gQWRkIENocm9tZSB2ZXJzaW9uIHRvIGRlc2NyaXB0aW9uIGZvciBFbGVjdHJvbi5cbiAgICBlbHNlIGlmIChuYW1lID09ICdFbGVjdHJvbicgJiYgKGRhdGEgPSAoL1xcYkNocm9tZVxcLyhbXFxkLl0rKVxcYi8uZXhlYyh1YSkgfHwgMClbMV0pKSB7XG4gICAgICBkZXNjcmlwdGlvbi5wdXNoKCdDaHJvbWl1bSAnICsgZGF0YSk7XG4gICAgfVxuICAgIC8vIERldGVjdCBub24tT3BlcmEgKFByZXN0by1iYXNlZCkgdmVyc2lvbnMgKG9yZGVyIGlzIGltcG9ydGFudCkuXG4gICAgaWYgKCF2ZXJzaW9uKSB7XG4gICAgICB2ZXJzaW9uID0gZ2V0VmVyc2lvbihbXG4gICAgICAgICcoPzpDbG91ZDl8Q3JpT1N8Q3JNb3xFZGdlfEZ4aU9TfElFTW9iaWxlfElyb258T3BlcmEgP01pbml8T1BpT1N8T1BSfFJhdmVufFNhbXN1bmdCcm93c2VyfFNpbGsoPyEvW1xcXFxkLl0rJCkpJyxcbiAgICAgICAgJ1ZlcnNpb24nLFxuICAgICAgICBxdWFsaWZ5KG5hbWUpLFxuICAgICAgICAnKD86RmlyZWZveHxNaW5lZmllbGR8TmV0RnJvbnQpJ1xuICAgICAgXSk7XG4gICAgfVxuICAgIC8vIERldGVjdCBzdHViYm9ybiBsYXlvdXQgZW5naW5lcy5cbiAgICBpZiAoKGRhdGEgPVxuICAgICAgICAgIGxheW91dCA9PSAnaUNhYicgJiYgcGFyc2VGbG9hdCh2ZXJzaW9uKSA+IDMgJiYgJ1dlYktpdCcgfHxcbiAgICAgICAgICAvXFxiT3BlcmFcXGIvLnRlc3QobmFtZSkgJiYgKC9cXGJPUFJcXGIvLnRlc3QodWEpID8gJ0JsaW5rJyA6ICdQcmVzdG8nKSB8fFxuICAgICAgICAgIC9cXGIoPzpNaWRvcml8Tm9va3xTYWZhcmkpXFxiL2kudGVzdCh1YSkgJiYgIS9eKD86VHJpZGVudHxFZGdlSFRNTCkkLy50ZXN0KGxheW91dCkgJiYgJ1dlYktpdCcgfHxcbiAgICAgICAgICAhbGF5b3V0ICYmIC9cXGJNU0lFXFxiL2kudGVzdCh1YSkgJiYgKG9zID09ICdNYWMgT1MnID8gJ1Rhc21hbicgOiAnVHJpZGVudCcpIHx8XG4gICAgICAgICAgbGF5b3V0ID09ICdXZWJLaXQnICYmIC9cXGJQbGF5U3RhdGlvblxcYig/ISBWaXRhXFxiKS9pLnRlc3QobmFtZSkgJiYgJ05ldEZyb250J1xuICAgICAgICApKSB7XG4gICAgICBsYXlvdXQgPSBbZGF0YV07XG4gICAgfVxuICAgIC8vIERldGVjdCBXaW5kb3dzIFBob25lIDcgZGVza3RvcCBtb2RlLlxuICAgIGlmIChuYW1lID09ICdJRScgJiYgKGRhdGEgPSAoLzsgKig/OlhCTFdQfFp1bmVXUCkoXFxkKykvaS5leGVjKHVhKSB8fCAwKVsxXSkpIHtcbiAgICAgIG5hbWUgKz0gJyBNb2JpbGUnO1xuICAgICAgb3MgPSAnV2luZG93cyBQaG9uZSAnICsgKC9cXCskLy50ZXN0KGRhdGEpID8gZGF0YSA6IGRhdGEgKyAnLngnKTtcbiAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQoJ2Rlc2t0b3AgbW9kZScpO1xuICAgIH1cbiAgICAvLyBEZXRlY3QgV2luZG93cyBQaG9uZSA4LnggZGVza3RvcCBtb2RlLlxuICAgIGVsc2UgaWYgKC9cXGJXUERlc2t0b3BcXGIvaS50ZXN0KHVhKSkge1xuICAgICAgbmFtZSA9ICdJRSBNb2JpbGUnO1xuICAgICAgb3MgPSAnV2luZG93cyBQaG9uZSA4LngnO1xuICAgICAgZGVzY3JpcHRpb24udW5zaGlmdCgnZGVza3RvcCBtb2RlJyk7XG4gICAgICB2ZXJzaW9uIHx8ICh2ZXJzaW9uID0gKC9cXGJydjooW1xcZC5dKykvLmV4ZWModWEpIHx8IDApWzFdKTtcbiAgICB9XG4gICAgLy8gRGV0ZWN0IElFIDExIGlkZW50aWZ5aW5nIGFzIG90aGVyIGJyb3dzZXJzLlxuICAgIGVsc2UgaWYgKG5hbWUgIT0gJ0lFJyAmJiBsYXlvdXQgPT0gJ1RyaWRlbnQnICYmIChkYXRhID0gL1xcYnJ2OihbXFxkLl0rKS8uZXhlYyh1YSkpKSB7XG4gICAgICBpZiAobmFtZSkge1xuICAgICAgICBkZXNjcmlwdGlvbi5wdXNoKCdpZGVudGlmeWluZyBhcyAnICsgbmFtZSArICh2ZXJzaW9uID8gJyAnICsgdmVyc2lvbiA6ICcnKSk7XG4gICAgICB9XG4gICAgICBuYW1lID0gJ0lFJztcbiAgICAgIHZlcnNpb24gPSBkYXRhWzFdO1xuICAgIH1cbiAgICAvLyBMZXZlcmFnZSBlbnZpcm9ubWVudCBmZWF0dXJlcy5cbiAgICBpZiAodXNlRmVhdHVyZXMpIHtcbiAgICAgIC8vIERldGVjdCBzZXJ2ZXItc2lkZSBlbnZpcm9ubWVudHMuXG4gICAgICAvLyBSaGlubyBoYXMgYSBnbG9iYWwgZnVuY3Rpb24gd2hpbGUgb3RoZXJzIGhhdmUgYSBnbG9iYWwgb2JqZWN0LlxuICAgICAgaWYgKGlzSG9zdFR5cGUoY29udGV4dCwgJ2dsb2JhbCcpKSB7XG4gICAgICAgIGlmIChqYXZhKSB7XG4gICAgICAgICAgZGF0YSA9IGphdmEubGFuZy5TeXN0ZW07XG4gICAgICAgICAgYXJjaCA9IGRhdGEuZ2V0UHJvcGVydHkoJ29zLmFyY2gnKTtcbiAgICAgICAgICBvcyA9IG9zIHx8IGRhdGEuZ2V0UHJvcGVydHkoJ29zLm5hbWUnKSArICcgJyArIGRhdGEuZ2V0UHJvcGVydHkoJ29zLnZlcnNpb24nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNNb2R1bGVTY29wZSAmJiBpc0hvc3RUeXBlKGNvbnRleHQsICdzeXN0ZW0nKSAmJiAoZGF0YSA9IFtjb250ZXh0LnN5c3RlbV0pWzBdKSB7XG4gICAgICAgICAgb3MgfHwgKG9zID0gZGF0YVswXS5vcyB8fCBudWxsKTtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZGF0YVsxXSA9IGNvbnRleHQucmVxdWlyZSgncmluZ28vZW5naW5lJykudmVyc2lvbjtcbiAgICAgICAgICAgIHZlcnNpb24gPSBkYXRhWzFdLmpvaW4oJy4nKTtcbiAgICAgICAgICAgIG5hbWUgPSAnUmluZ29KUyc7XG4gICAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICBpZiAoZGF0YVswXS5nbG9iYWwuc3lzdGVtID09IGNvbnRleHQuc3lzdGVtKSB7XG4gICAgICAgICAgICAgIG5hbWUgPSAnTmFyd2hhbCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKFxuICAgICAgICAgIHR5cGVvZiBjb250ZXh0LnByb2Nlc3MgPT0gJ29iamVjdCcgJiYgIWNvbnRleHQucHJvY2Vzcy5icm93c2VyICYmXG4gICAgICAgICAgKGRhdGEgPSBjb250ZXh0LnByb2Nlc3MpXG4gICAgICAgICkge1xuICAgICAgICAgIGlmICh0eXBlb2YgZGF0YS52ZXJzaW9ucyA9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBkYXRhLnZlcnNpb25zLmVsZWN0cm9uID09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uLnB1c2goJ05vZGUgJyArIGRhdGEudmVyc2lvbnMubm9kZSk7XG4gICAgICAgICAgICAgIG5hbWUgPSAnRWxlY3Ryb24nO1xuICAgICAgICAgICAgICB2ZXJzaW9uID0gZGF0YS52ZXJzaW9ucy5lbGVjdHJvbjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGRhdGEudmVyc2lvbnMubncgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb24ucHVzaCgnQ2hyb21pdW0gJyArIHZlcnNpb24sICdOb2RlICcgKyBkYXRhLnZlcnNpb25zLm5vZGUpO1xuICAgICAgICAgICAgICBuYW1lID0gJ05XLmpzJztcbiAgICAgICAgICAgICAgdmVyc2lvbiA9IGRhdGEudmVyc2lvbnMubnc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5hbWUgPSAnTm9kZS5qcyc7XG4gICAgICAgICAgICBhcmNoID0gZGF0YS5hcmNoO1xuICAgICAgICAgICAgb3MgPSBkYXRhLnBsYXRmb3JtO1xuICAgICAgICAgICAgdmVyc2lvbiA9IC9bXFxkLl0rLy5leGVjKGRhdGEudmVyc2lvbilcbiAgICAgICAgICAgIHZlcnNpb24gPSB2ZXJzaW9uID8gdmVyc2lvblswXSA6ICd1bmtub3duJztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocmhpbm8pIHtcbiAgICAgICAgICBuYW1lID0gJ1JoaW5vJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gRGV0ZWN0IEFkb2JlIEFJUi5cbiAgICAgIGVsc2UgaWYgKGdldENsYXNzT2YoKGRhdGEgPSBjb250ZXh0LnJ1bnRpbWUpKSA9PSBhaXJSdW50aW1lQ2xhc3MpIHtcbiAgICAgICAgbmFtZSA9ICdBZG9iZSBBSVInO1xuICAgICAgICBvcyA9IGRhdGEuZmxhc2guc3lzdGVtLkNhcGFiaWxpdGllcy5vcztcbiAgICAgIH1cbiAgICAgIC8vIERldGVjdCBQaGFudG9tSlMuXG4gICAgICBlbHNlIGlmIChnZXRDbGFzc09mKChkYXRhID0gY29udGV4dC5waGFudG9tKSkgPT0gcGhhbnRvbUNsYXNzKSB7XG4gICAgICAgIG5hbWUgPSAnUGhhbnRvbUpTJztcbiAgICAgICAgdmVyc2lvbiA9IChkYXRhID0gZGF0YS52ZXJzaW9uIHx8IG51bGwpICYmIChkYXRhLm1ham9yICsgJy4nICsgZGF0YS5taW5vciArICcuJyArIGRhdGEucGF0Y2gpO1xuICAgICAgfVxuICAgICAgLy8gRGV0ZWN0IElFIGNvbXBhdGliaWxpdHkgbW9kZXMuXG4gICAgICBlbHNlIGlmICh0eXBlb2YgZG9jLmRvY3VtZW50TW9kZSA9PSAnbnVtYmVyJyAmJiAoZGF0YSA9IC9cXGJUcmlkZW50XFwvKFxcZCspL2kuZXhlYyh1YSkpKSB7XG4gICAgICAgIC8vIFdlJ3JlIGluIGNvbXBhdGliaWxpdHkgbW9kZSB3aGVuIHRoZSBUcmlkZW50IHZlcnNpb24gKyA0IGRvZXNuJ3RcbiAgICAgICAgLy8gZXF1YWwgdGhlIGRvY3VtZW50IG1vZGUuXG4gICAgICAgIHZlcnNpb24gPSBbdmVyc2lvbiwgZG9jLmRvY3VtZW50TW9kZV07XG4gICAgICAgIGlmICgoZGF0YSA9ICtkYXRhWzFdICsgNCkgIT0gdmVyc2lvblsxXSkge1xuICAgICAgICAgIGRlc2NyaXB0aW9uLnB1c2goJ0lFICcgKyB2ZXJzaW9uWzFdICsgJyBtb2RlJyk7XG4gICAgICAgICAgbGF5b3V0ICYmIChsYXlvdXRbMV0gPSAnJyk7XG4gICAgICAgICAgdmVyc2lvblsxXSA9IGRhdGE7XG4gICAgICAgIH1cbiAgICAgICAgdmVyc2lvbiA9IG5hbWUgPT0gJ0lFJyA/IFN0cmluZyh2ZXJzaW9uWzFdLnRvRml4ZWQoMSkpIDogdmVyc2lvblswXTtcbiAgICAgIH1cbiAgICAgIC8vIERldGVjdCBJRSAxMSBtYXNraW5nIGFzIG90aGVyIGJyb3dzZXJzLlxuICAgICAgZWxzZSBpZiAodHlwZW9mIGRvYy5kb2N1bWVudE1vZGUgPT0gJ251bWJlcicgJiYgL14oPzpDaHJvbWV8RmlyZWZveClcXGIvLnRlc3QobmFtZSkpIHtcbiAgICAgICAgZGVzY3JpcHRpb24ucHVzaCgnbWFza2luZyBhcyAnICsgbmFtZSArICcgJyArIHZlcnNpb24pO1xuICAgICAgICBuYW1lID0gJ0lFJztcbiAgICAgICAgdmVyc2lvbiA9ICcxMS4wJztcbiAgICAgICAgbGF5b3V0ID0gWydUcmlkZW50J107XG4gICAgICAgIG9zID0gJ1dpbmRvd3MnO1xuICAgICAgfVxuICAgICAgb3MgPSBvcyAmJiBmb3JtYXQob3MpO1xuICAgIH1cbiAgICAvLyBEZXRlY3QgcHJlcmVsZWFzZSBwaGFzZXMuXG4gICAgaWYgKHZlcnNpb24gJiYgKGRhdGEgPVxuICAgICAgICAgIC8oPzpbYWJdfGRwfHByZXxbYWJdXFxkK3ByZSkoPzpcXGQrXFwrPyk/JC9pLmV4ZWModmVyc2lvbikgfHxcbiAgICAgICAgICAvKD86YWxwaGF8YmV0YSkoPzogP1xcZCk/L2kuZXhlYyh1YSArICc7JyArICh1c2VGZWF0dXJlcyAmJiBuYXYuYXBwTWlub3JWZXJzaW9uKSkgfHxcbiAgICAgICAgICAvXFxiTWluZWZpZWxkXFxiL2kudGVzdCh1YSkgJiYgJ2EnXG4gICAgICAgICkpIHtcbiAgICAgIHByZXJlbGVhc2UgPSAvYi9pLnRlc3QoZGF0YSkgPyAnYmV0YScgOiAnYWxwaGEnO1xuICAgICAgdmVyc2lvbiA9IHZlcnNpb24ucmVwbGFjZShSZWdFeHAoZGF0YSArICdcXFxcKz8kJyksICcnKSArXG4gICAgICAgIChwcmVyZWxlYXNlID09ICdiZXRhJyA/IGJldGEgOiBhbHBoYSkgKyAoL1xcZCtcXCs/Ly5leGVjKGRhdGEpIHx8ICcnKTtcbiAgICB9XG4gICAgLy8gRGV0ZWN0IEZpcmVmb3ggTW9iaWxlLlxuICAgIGlmIChuYW1lID09ICdGZW5uZWMnIHx8IG5hbWUgPT0gJ0ZpcmVmb3gnICYmIC9cXGIoPzpBbmRyb2lkfEZpcmVmb3ggT1MpXFxiLy50ZXN0KG9zKSkge1xuICAgICAgbmFtZSA9ICdGaXJlZm94IE1vYmlsZSc7XG4gICAgfVxuICAgIC8vIE9ic2N1cmUgTWF4dGhvbidzIHVucmVsaWFibGUgdmVyc2lvbi5cbiAgICBlbHNlIGlmIChuYW1lID09ICdNYXh0aG9uJyAmJiB2ZXJzaW9uKSB7XG4gICAgICB2ZXJzaW9uID0gdmVyc2lvbi5yZXBsYWNlKC9cXC5bXFxkLl0rLywgJy54Jyk7XG4gICAgfVxuICAgIC8vIERldGVjdCBYYm94IDM2MCBhbmQgWGJveCBPbmUuXG4gICAgZWxzZSBpZiAoL1xcYlhib3hcXGIvaS50ZXN0KHByb2R1Y3QpKSB7XG4gICAgICBpZiAocHJvZHVjdCA9PSAnWGJveCAzNjAnKSB7XG4gICAgICAgIG9zID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIGlmIChwcm9kdWN0ID09ICdYYm94IDM2MCcgJiYgL1xcYklFTW9iaWxlXFxiLy50ZXN0KHVhKSkge1xuICAgICAgICBkZXNjcmlwdGlvbi51bnNoaWZ0KCdtb2JpbGUgbW9kZScpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBBZGQgbW9iaWxlIHBvc3RmaXguXG4gICAgZWxzZSBpZiAoKC9eKD86Q2hyb21lfElFfE9wZXJhKSQvLnRlc3QobmFtZSkgfHwgbmFtZSAmJiAhcHJvZHVjdCAmJiAhL0Jyb3dzZXJ8TW9iaS8udGVzdChuYW1lKSkgJiZcbiAgICAgICAgKG9zID09ICdXaW5kb3dzIENFJyB8fCAvTW9iaS9pLnRlc3QodWEpKSkge1xuICAgICAgbmFtZSArPSAnIE1vYmlsZSc7XG4gICAgfVxuICAgIC8vIERldGVjdCBJRSBwbGF0Zm9ybSBwcmV2aWV3LlxuICAgIGVsc2UgaWYgKG5hbWUgPT0gJ0lFJyAmJiB1c2VGZWF0dXJlcykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKGNvbnRleHQuZXh0ZXJuYWwgPT09IG51bGwpIHtcbiAgICAgICAgICBkZXNjcmlwdGlvbi51bnNoaWZ0KCdwbGF0Zm9ybSBwcmV2aWV3Jyk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICBkZXNjcmlwdGlvbi51bnNoaWZ0KCdlbWJlZGRlZCcpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBEZXRlY3QgQmxhY2tCZXJyeSBPUyB2ZXJzaW9uLlxuICAgIC8vIGh0dHA6Ly9kb2NzLmJsYWNrYmVycnkuY29tL2VuL2RldmVsb3BlcnMvZGVsaXZlcmFibGVzLzE4MTY5L0hUVFBfaGVhZGVyc19zZW50X2J5X0JCX0Jyb3dzZXJfMTIzNDkxMV8xMS5qc3BcbiAgICBlbHNlIGlmICgoL1xcYkJsYWNrQmVycnlcXGIvLnRlc3QocHJvZHVjdCkgfHwgL1xcYkJCMTBcXGIvLnRlc3QodWEpKSAmJiAoZGF0YSA9XG4gICAgICAgICAgKFJlZ0V4cChwcm9kdWN0LnJlcGxhY2UoLyArL2csICcgKicpICsgJy8oWy5cXFxcZF0rKScsICdpJykuZXhlYyh1YSkgfHwgMClbMV0gfHxcbiAgICAgICAgICB2ZXJzaW9uXG4gICAgICAgICkpIHtcbiAgICAgIGRhdGEgPSBbZGF0YSwgL0JCMTAvLnRlc3QodWEpXTtcbiAgICAgIG9zID0gKGRhdGFbMV0gPyAocHJvZHVjdCA9IG51bGwsIG1hbnVmYWN0dXJlciA9ICdCbGFja0JlcnJ5JykgOiAnRGV2aWNlIFNvZnR3YXJlJykgKyAnICcgKyBkYXRhWzBdO1xuICAgICAgdmVyc2lvbiA9IG51bGw7XG4gICAgfVxuICAgIC8vIERldGVjdCBPcGVyYSBpZGVudGlmeWluZy9tYXNraW5nIGl0c2VsZiBhcyBhbm90aGVyIGJyb3dzZXIuXG4gICAgLy8gaHR0cDovL3d3dy5vcGVyYS5jb20vc3VwcG9ydC9rYi92aWV3Lzg0My9cbiAgICBlbHNlIGlmICh0aGlzICE9IGZvck93biAmJiBwcm9kdWN0ICE9ICdXaWknICYmIChcbiAgICAgICAgICAodXNlRmVhdHVyZXMgJiYgb3BlcmEpIHx8XG4gICAgICAgICAgKC9PcGVyYS8udGVzdChuYW1lKSAmJiAvXFxiKD86TVNJRXxGaXJlZm94KVxcYi9pLnRlc3QodWEpKSB8fFxuICAgICAgICAgIChuYW1lID09ICdGaXJlZm94JyAmJiAvXFxiT1MgWCAoPzpcXGQrXFwuKXsyLH0vLnRlc3Qob3MpKSB8fFxuICAgICAgICAgIChuYW1lID09ICdJRScgJiYgKFxuICAgICAgICAgICAgKG9zICYmICEvXldpbi8udGVzdChvcykgJiYgdmVyc2lvbiA+IDUuNSkgfHxcbiAgICAgICAgICAgIC9cXGJXaW5kb3dzIFhQXFxiLy50ZXN0KG9zKSAmJiB2ZXJzaW9uID4gOCB8fFxuICAgICAgICAgICAgdmVyc2lvbiA9PSA4ICYmICEvXFxiVHJpZGVudFxcYi8udGVzdCh1YSlcbiAgICAgICAgICApKVxuICAgICAgICApICYmICFyZU9wZXJhLnRlc3QoKGRhdGEgPSBwYXJzZS5jYWxsKGZvck93biwgdWEucmVwbGFjZShyZU9wZXJhLCAnJykgKyAnOycpKSkgJiYgZGF0YS5uYW1lKSB7XG4gICAgICAvLyBXaGVuIFwiaWRlbnRpZnlpbmdcIiwgdGhlIFVBIGNvbnRhaW5zIGJvdGggT3BlcmEgYW5kIHRoZSBvdGhlciBicm93c2VyJ3MgbmFtZS5cbiAgICAgIGRhdGEgPSAnaW5nIGFzICcgKyBkYXRhLm5hbWUgKyAoKGRhdGEgPSBkYXRhLnZlcnNpb24pID8gJyAnICsgZGF0YSA6ICcnKTtcbiAgICAgIGlmIChyZU9wZXJhLnRlc3QobmFtZSkpIHtcbiAgICAgICAgaWYgKC9cXGJJRVxcYi8udGVzdChkYXRhKSAmJiBvcyA9PSAnTWFjIE9TJykge1xuICAgICAgICAgIG9zID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBkYXRhID0gJ2lkZW50aWZ5JyArIGRhdGE7XG4gICAgICB9XG4gICAgICAvLyBXaGVuIFwibWFza2luZ1wiLCB0aGUgVUEgY29udGFpbnMgb25seSB0aGUgb3RoZXIgYnJvd3NlcidzIG5hbWUuXG4gICAgICBlbHNlIHtcbiAgICAgICAgZGF0YSA9ICdtYXNrJyArIGRhdGE7XG4gICAgICAgIGlmIChvcGVyYUNsYXNzKSB7XG4gICAgICAgICAgbmFtZSA9IGZvcm1hdChvcGVyYUNsYXNzLnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pL2csICckMSAkMicpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuYW1lID0gJ09wZXJhJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoL1xcYklFXFxiLy50ZXN0KGRhdGEpKSB7XG4gICAgICAgICAgb3MgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdXNlRmVhdHVyZXMpIHtcbiAgICAgICAgICB2ZXJzaW9uID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGF5b3V0ID0gWydQcmVzdG8nXTtcbiAgICAgIGRlc2NyaXB0aW9uLnB1c2goZGF0YSk7XG4gICAgfVxuICAgIC8vIERldGVjdCBXZWJLaXQgTmlnaHRseSBhbmQgYXBwcm94aW1hdGUgQ2hyb21lL1NhZmFyaSB2ZXJzaW9ucy5cbiAgICBpZiAoKGRhdGEgPSAoL1xcYkFwcGxlV2ViS2l0XFwvKFtcXGQuXStcXCs/KS9pLmV4ZWModWEpIHx8IDApWzFdKSkge1xuICAgICAgLy8gQ29ycmVjdCBidWlsZCBudW1iZXIgZm9yIG51bWVyaWMgY29tcGFyaXNvbi5cbiAgICAgIC8vIChlLmcuIFwiNTMyLjVcIiBiZWNvbWVzIFwiNTMyLjA1XCIpXG4gICAgICBkYXRhID0gW3BhcnNlRmxvYXQoZGF0YS5yZXBsYWNlKC9cXC4oXFxkKSQvLCAnLjAkMScpKSwgZGF0YV07XG4gICAgICAvLyBOaWdodGx5IGJ1aWxkcyBhcmUgcG9zdGZpeGVkIHdpdGggYSBcIitcIi5cbiAgICAgIGlmIChuYW1lID09ICdTYWZhcmknICYmIGRhdGFbMV0uc2xpY2UoLTEpID09ICcrJykge1xuICAgICAgICBuYW1lID0gJ1dlYktpdCBOaWdodGx5JztcbiAgICAgICAgcHJlcmVsZWFzZSA9ICdhbHBoYSc7XG4gICAgICAgIHZlcnNpb24gPSBkYXRhWzFdLnNsaWNlKDAsIC0xKTtcbiAgICAgIH1cbiAgICAgIC8vIENsZWFyIGluY29ycmVjdCBicm93c2VyIHZlcnNpb25zLlxuICAgICAgZWxzZSBpZiAodmVyc2lvbiA9PSBkYXRhWzFdIHx8XG4gICAgICAgICAgdmVyc2lvbiA9PSAoZGF0YVsyXSA9ICgvXFxiU2FmYXJpXFwvKFtcXGQuXStcXCs/KS9pLmV4ZWModWEpIHx8IDApWzFdKSkge1xuICAgICAgICB2ZXJzaW9uID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIC8vIFVzZSB0aGUgZnVsbCBDaHJvbWUgdmVyc2lvbiB3aGVuIGF2YWlsYWJsZS5cbiAgICAgIGRhdGFbMV0gPSAoL1xcYkNocm9tZVxcLyhbXFxkLl0rKS9pLmV4ZWModWEpIHx8IDApWzFdO1xuICAgICAgLy8gRGV0ZWN0IEJsaW5rIGxheW91dCBlbmdpbmUuXG4gICAgICBpZiAoZGF0YVswXSA9PSA1MzcuMzYgJiYgZGF0YVsyXSA9PSA1MzcuMzYgJiYgcGFyc2VGbG9hdChkYXRhWzFdKSA+PSAyOCAmJiBsYXlvdXQgPT0gJ1dlYktpdCcpIHtcbiAgICAgICAgbGF5b3V0ID0gWydCbGluayddO1xuICAgICAgfVxuICAgICAgLy8gRGV0ZWN0IEphdmFTY3JpcHRDb3JlLlxuICAgICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy82NzY4NDc0L2hvdy1jYW4taS1kZXRlY3Qtd2hpY2gtamF2YXNjcmlwdC1lbmdpbmUtdjgtb3ItanNjLWlzLXVzZWQtYXQtcnVudGltZS1pbi1hbmRyb2lcbiAgICAgIGlmICghdXNlRmVhdHVyZXMgfHwgKCFsaWtlQ2hyb21lICYmICFkYXRhWzFdKSkge1xuICAgICAgICBsYXlvdXQgJiYgKGxheW91dFsxXSA9ICdsaWtlIFNhZmFyaScpO1xuICAgICAgICBkYXRhID0gKGRhdGEgPSBkYXRhWzBdLCBkYXRhIDwgNDAwID8gMSA6IGRhdGEgPCA1MDAgPyAyIDogZGF0YSA8IDUyNiA/IDMgOiBkYXRhIDwgNTMzID8gNCA6IGRhdGEgPCA1MzQgPyAnNCsnIDogZGF0YSA8IDUzNSA/IDUgOiBkYXRhIDwgNTM3ID8gNiA6IGRhdGEgPCA1MzggPyA3IDogZGF0YSA8IDYwMSA/IDggOiAnOCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGF5b3V0ICYmIChsYXlvdXRbMV0gPSAnbGlrZSBDaHJvbWUnKTtcbiAgICAgICAgZGF0YSA9IGRhdGFbMV0gfHwgKGRhdGEgPSBkYXRhWzBdLCBkYXRhIDwgNTMwID8gMSA6IGRhdGEgPCA1MzIgPyAyIDogZGF0YSA8IDUzMi4wNSA/IDMgOiBkYXRhIDwgNTMzID8gNCA6IGRhdGEgPCA1MzQuMDMgPyA1IDogZGF0YSA8IDUzNC4wNyA/IDYgOiBkYXRhIDwgNTM0LjEwID8gNyA6IGRhdGEgPCA1MzQuMTMgPyA4IDogZGF0YSA8IDUzNC4xNiA/IDkgOiBkYXRhIDwgNTM0LjI0ID8gMTAgOiBkYXRhIDwgNTM0LjMwID8gMTEgOiBkYXRhIDwgNTM1LjAxID8gMTIgOiBkYXRhIDwgNTM1LjAyID8gJzEzKycgOiBkYXRhIDwgNTM1LjA3ID8gMTUgOiBkYXRhIDwgNTM1LjExID8gMTYgOiBkYXRhIDwgNTM1LjE5ID8gMTcgOiBkYXRhIDwgNTM2LjA1ID8gMTggOiBkYXRhIDwgNTM2LjEwID8gMTkgOiBkYXRhIDwgNTM3LjAxID8gMjAgOiBkYXRhIDwgNTM3LjExID8gJzIxKycgOiBkYXRhIDwgNTM3LjEzID8gMjMgOiBkYXRhIDwgNTM3LjE4ID8gMjQgOiBkYXRhIDwgNTM3LjI0ID8gMjUgOiBkYXRhIDwgNTM3LjM2ID8gMjYgOiBsYXlvdXQgIT0gJ0JsaW5rJyA/ICcyNycgOiAnMjgnKTtcbiAgICAgIH1cbiAgICAgIC8vIEFkZCB0aGUgcG9zdGZpeCBvZiBcIi54XCIgb3IgXCIrXCIgZm9yIGFwcHJveGltYXRlIHZlcnNpb25zLlxuICAgICAgbGF5b3V0ICYmIChsYXlvdXRbMV0gKz0gJyAnICsgKGRhdGEgKz0gdHlwZW9mIGRhdGEgPT0gJ251bWJlcicgPyAnLngnIDogL1suK10vLnRlc3QoZGF0YSkgPyAnJyA6ICcrJykpO1xuICAgICAgLy8gT2JzY3VyZSB2ZXJzaW9uIGZvciBzb21lIFNhZmFyaSAxLTIgcmVsZWFzZXMuXG4gICAgICBpZiAobmFtZSA9PSAnU2FmYXJpJyAmJiAoIXZlcnNpb24gfHwgcGFyc2VJbnQodmVyc2lvbikgPiA0NSkpIHtcbiAgICAgICAgdmVyc2lvbiA9IGRhdGE7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIERldGVjdCBPcGVyYSBkZXNrdG9wIG1vZGVzLlxuICAgIGlmIChuYW1lID09ICdPcGVyYScgJiYgIChkYXRhID0gL1xcYnpib3Z8enZhdiQvLmV4ZWMob3MpKSkge1xuICAgICAgbmFtZSArPSAnICc7XG4gICAgICBkZXNjcmlwdGlvbi51bnNoaWZ0KCdkZXNrdG9wIG1vZGUnKTtcbiAgICAgIGlmIChkYXRhID09ICd6dmF2Jykge1xuICAgICAgICBuYW1lICs9ICdNaW5pJztcbiAgICAgICAgdmVyc2lvbiA9IG51bGw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuYW1lICs9ICdNb2JpbGUnO1xuICAgICAgfVxuICAgICAgb3MgPSBvcy5yZXBsYWNlKFJlZ0V4cCgnIConICsgZGF0YSArICckJyksICcnKTtcbiAgICB9XG4gICAgLy8gRGV0ZWN0IENocm9tZSBkZXNrdG9wIG1vZGUuXG4gICAgZWxzZSBpZiAobmFtZSA9PSAnU2FmYXJpJyAmJiAvXFxiQ2hyb21lXFxiLy5leGVjKGxheW91dCAmJiBsYXlvdXRbMV0pKSB7XG4gICAgICBkZXNjcmlwdGlvbi51bnNoaWZ0KCdkZXNrdG9wIG1vZGUnKTtcbiAgICAgIG5hbWUgPSAnQ2hyb21lIE1vYmlsZSc7XG4gICAgICB2ZXJzaW9uID0gbnVsbDtcblxuICAgICAgaWYgKC9cXGJPUyBYXFxiLy50ZXN0KG9zKSkge1xuICAgICAgICBtYW51ZmFjdHVyZXIgPSAnQXBwbGUnO1xuICAgICAgICBvcyA9ICdpT1MgNC4zKyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvcyA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFN0cmlwIGluY29ycmVjdCBPUyB2ZXJzaW9ucy5cbiAgICBpZiAodmVyc2lvbiAmJiB2ZXJzaW9uLmluZGV4T2YoKGRhdGEgPSAvW1xcZC5dKyQvLmV4ZWMob3MpKSkgPT0gMCAmJlxuICAgICAgICB1YS5pbmRleE9mKCcvJyArIGRhdGEgKyAnLScpID4gLTEpIHtcbiAgICAgIG9zID0gdHJpbShvcy5yZXBsYWNlKGRhdGEsICcnKSk7XG4gICAgfVxuICAgIC8vIEFkZCBsYXlvdXQgZW5naW5lLlxuICAgIGlmIChsYXlvdXQgJiYgIS9cXGIoPzpBdmFudHxOb29rKVxcYi8udGVzdChuYW1lKSAmJiAoXG4gICAgICAgIC9Ccm93c2VyfEx1bmFzY2FwZXxNYXh0aG9uLy50ZXN0KG5hbWUpIHx8XG4gICAgICAgIG5hbWUgIT0gJ1NhZmFyaScgJiYgL15pT1MvLnRlc3Qob3MpICYmIC9cXGJTYWZhcmlcXGIvLnRlc3QobGF5b3V0WzFdKSB8fFxuICAgICAgICAvXig/OkFkb2JlfEFyb3JhfEJyZWFjaHxNaWRvcml8T3BlcmF8UGhhbnRvbXxSZWtvbnF8Um9ja3xTYW1zdW5nIEludGVybmV0fFNsZWlwbmlyfFdlYikvLnRlc3QobmFtZSkgJiYgbGF5b3V0WzFdKSkge1xuICAgICAgLy8gRG9uJ3QgYWRkIGxheW91dCBkZXRhaWxzIHRvIGRlc2NyaXB0aW9uIGlmIHRoZXkgYXJlIGZhbHNleS5cbiAgICAgIChkYXRhID0gbGF5b3V0W2xheW91dC5sZW5ndGggLSAxXSkgJiYgZGVzY3JpcHRpb24ucHVzaChkYXRhKTtcbiAgICB9XG4gICAgLy8gQ29tYmluZSBjb250ZXh0dWFsIGluZm9ybWF0aW9uLlxuICAgIGlmIChkZXNjcmlwdGlvbi5sZW5ndGgpIHtcbiAgICAgIGRlc2NyaXB0aW9uID0gWycoJyArIGRlc2NyaXB0aW9uLmpvaW4oJzsgJykgKyAnKSddO1xuICAgIH1cbiAgICAvLyBBcHBlbmQgbWFudWZhY3R1cmVyIHRvIGRlc2NyaXB0aW9uLlxuICAgIGlmIChtYW51ZmFjdHVyZXIgJiYgcHJvZHVjdCAmJiBwcm9kdWN0LmluZGV4T2YobWFudWZhY3R1cmVyKSA8IDApIHtcbiAgICAgIGRlc2NyaXB0aW9uLnB1c2goJ29uICcgKyBtYW51ZmFjdHVyZXIpO1xuICAgIH1cbiAgICAvLyBBcHBlbmQgcHJvZHVjdCB0byBkZXNjcmlwdGlvbi5cbiAgICBpZiAocHJvZHVjdCkge1xuICAgICAgZGVzY3JpcHRpb24ucHVzaCgoL15vbiAvLnRlc3QoZGVzY3JpcHRpb25bZGVzY3JpcHRpb24ubGVuZ3RoIC0gMV0pID8gJycgOiAnb24gJykgKyBwcm9kdWN0KTtcbiAgICB9XG4gICAgLy8gUGFyc2UgdGhlIE9TIGludG8gYW4gb2JqZWN0LlxuICAgIGlmIChvcykge1xuICAgICAgZGF0YSA9IC8gKFtcXGQuK10rKSQvLmV4ZWMob3MpO1xuICAgICAgaXNTcGVjaWFsQ2FzZWRPUyA9IGRhdGEgJiYgb3MuY2hhckF0KG9zLmxlbmd0aCAtIGRhdGFbMF0ubGVuZ3RoIC0gMSkgPT0gJy8nO1xuICAgICAgb3MgPSB7XG4gICAgICAgICdhcmNoaXRlY3R1cmUnOiAzMixcbiAgICAgICAgJ2ZhbWlseSc6IChkYXRhICYmICFpc1NwZWNpYWxDYXNlZE9TKSA/IG9zLnJlcGxhY2UoZGF0YVswXSwgJycpIDogb3MsXG4gICAgICAgICd2ZXJzaW9uJzogZGF0YSA/IGRhdGFbMV0gOiBudWxsLFxuICAgICAgICAndG9TdHJpbmcnOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgdmVyc2lvbiA9IHRoaXMudmVyc2lvbjtcbiAgICAgICAgICByZXR1cm4gdGhpcy5mYW1pbHkgKyAoKHZlcnNpb24gJiYgIWlzU3BlY2lhbENhc2VkT1MpID8gJyAnICsgdmVyc2lvbiA6ICcnKSArICh0aGlzLmFyY2hpdGVjdHVyZSA9PSA2NCA/ICcgNjQtYml0JyA6ICcnKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gICAgLy8gQWRkIGJyb3dzZXIvT1MgYXJjaGl0ZWN0dXJlLlxuICAgIGlmICgoZGF0YSA9IC9cXGIoPzpBTUR8SUF8V2lufFdPV3x4ODZffHgpNjRcXGIvaS5leGVjKGFyY2gpKSAmJiAhL1xcYmk2ODZcXGIvaS50ZXN0KGFyY2gpKSB7XG4gICAgICBpZiAob3MpIHtcbiAgICAgICAgb3MuYXJjaGl0ZWN0dXJlID0gNjQ7XG4gICAgICAgIG9zLmZhbWlseSA9IG9zLmZhbWlseS5yZXBsYWNlKFJlZ0V4cCgnIConICsgZGF0YSksICcnKTtcbiAgICAgIH1cbiAgICAgIGlmIChcbiAgICAgICAgICBuYW1lICYmICgvXFxiV09XNjRcXGIvaS50ZXN0KHVhKSB8fFxuICAgICAgICAgICh1c2VGZWF0dXJlcyAmJiAvXFx3KD86ODZ8MzIpJC8udGVzdChuYXYuY3B1Q2xhc3MgfHwgbmF2LnBsYXRmb3JtKSAmJiAhL1xcYldpbjY0OyB4NjRcXGIvaS50ZXN0KHVhKSkpXG4gICAgICApIHtcbiAgICAgICAgZGVzY3JpcHRpb24udW5zaGlmdCgnMzItYml0Jyk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIENocm9tZSAzOSBhbmQgYWJvdmUgb24gT1MgWCBpcyBhbHdheXMgNjQtYml0LlxuICAgIGVsc2UgaWYgKFxuICAgICAgICBvcyAmJiAvXk9TIFgvLnRlc3Qob3MuZmFtaWx5KSAmJlxuICAgICAgICBuYW1lID09ICdDaHJvbWUnICYmIHBhcnNlRmxvYXQodmVyc2lvbikgPj0gMzlcbiAgICApIHtcbiAgICAgIG9zLmFyY2hpdGVjdHVyZSA9IDY0O1xuICAgIH1cblxuICAgIHVhIHx8ICh1YSA9IG51bGwpO1xuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLyoqXG4gICAgICogVGhlIHBsYXRmb3JtIG9iamVjdC5cbiAgICAgKlxuICAgICAqIEBuYW1lIHBsYXRmb3JtXG4gICAgICogQHR5cGUgT2JqZWN0XG4gICAgICovXG4gICAgdmFyIHBsYXRmb3JtID0ge307XG5cbiAgICAvKipcbiAgICAgKiBUaGUgcGxhdGZvcm0gZGVzY3JpcHRpb24uXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm1cbiAgICAgKiBAdHlwZSBzdHJpbmd8bnVsbFxuICAgICAqL1xuICAgIHBsYXRmb3JtLmRlc2NyaXB0aW9uID0gdWE7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgYnJvd3NlcidzIGxheW91dCBlbmdpbmUuXG4gICAgICpcbiAgICAgKiBUaGUgbGlzdCBvZiBjb21tb24gbGF5b3V0IGVuZ2luZXMgaW5jbHVkZTpcbiAgICAgKiBcIkJsaW5rXCIsIFwiRWRnZUhUTUxcIiwgXCJHZWNrb1wiLCBcIlRyaWRlbnRcIiBhbmQgXCJXZWJLaXRcIlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIHBsYXRmb3JtXG4gICAgICogQHR5cGUgc3RyaW5nfG51bGxcbiAgICAgKi9cbiAgICBwbGF0Zm9ybS5sYXlvdXQgPSBsYXlvdXQgJiYgbGF5b3V0WzBdO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIHByb2R1Y3QncyBtYW51ZmFjdHVyZXIuXG4gICAgICpcbiAgICAgKiBUaGUgbGlzdCBvZiBtYW51ZmFjdHVyZXJzIGluY2x1ZGU6XG4gICAgICogXCJBcHBsZVwiLCBcIkFyY2hvc1wiLCBcIkFtYXpvblwiLCBcIkFzdXNcIiwgXCJCYXJuZXMgJiBOb2JsZVwiLCBcIkJsYWNrQmVycnlcIixcbiAgICAgKiBcIkdvb2dsZVwiLCBcIkhQXCIsIFwiSFRDXCIsIFwiTEdcIiwgXCJNaWNyb3NvZnRcIiwgXCJNb3Rvcm9sYVwiLCBcIk5pbnRlbmRvXCIsXG4gICAgICogXCJOb2tpYVwiLCBcIlNhbXN1bmdcIiBhbmQgXCJTb255XCJcbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybVxuICAgICAqIEB0eXBlIHN0cmluZ3xudWxsXG4gICAgICovXG4gICAgcGxhdGZvcm0ubWFudWZhY3R1cmVyID0gbWFudWZhY3R1cmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIGJyb3dzZXIvZW52aXJvbm1lbnQuXG4gICAgICpcbiAgICAgKiBUaGUgbGlzdCBvZiBjb21tb24gYnJvd3NlciBuYW1lcyBpbmNsdWRlOlxuICAgICAqIFwiQ2hyb21lXCIsIFwiRWxlY3Ryb25cIiwgXCJGaXJlZm94XCIsIFwiRmlyZWZveCBmb3IgaU9TXCIsIFwiSUVcIixcbiAgICAgKiBcIk1pY3Jvc29mdCBFZGdlXCIsIFwiUGhhbnRvbUpTXCIsIFwiU2FmYXJpXCIsIFwiU2VhTW9ua2V5XCIsIFwiU2lsa1wiLFxuICAgICAqIFwiT3BlcmEgTWluaVwiIGFuZCBcIk9wZXJhXCJcbiAgICAgKlxuICAgICAqIE1vYmlsZSB2ZXJzaW9ucyBvZiBzb21lIGJyb3dzZXJzIGhhdmUgXCJNb2JpbGVcIiBhcHBlbmRlZCB0byB0aGVpciBuYW1lOlxuICAgICAqIGVnLiBcIkNocm9tZSBNb2JpbGVcIiwgXCJGaXJlZm94IE1vYmlsZVwiLCBcIklFIE1vYmlsZVwiIGFuZCBcIk9wZXJhIE1vYmlsZVwiXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm1cbiAgICAgKiBAdHlwZSBzdHJpbmd8bnVsbFxuICAgICAqL1xuICAgIHBsYXRmb3JtLm5hbWUgPSBuYW1lO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGFscGhhL2JldGEgcmVsZWFzZSBpbmRpY2F0b3IuXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm1cbiAgICAgKiBAdHlwZSBzdHJpbmd8bnVsbFxuICAgICAqL1xuICAgIHBsYXRmb3JtLnByZXJlbGVhc2UgPSBwcmVyZWxlYXNlO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIHByb2R1Y3QgaG9zdGluZyB0aGUgYnJvd3Nlci5cbiAgICAgKlxuICAgICAqIFRoZSBsaXN0IG9mIGNvbW1vbiBwcm9kdWN0cyBpbmNsdWRlOlxuICAgICAqXG4gICAgICogXCJCbGFja0JlcnJ5XCIsIFwiR2FsYXh5IFM0XCIsIFwiTHVtaWFcIiwgXCJpUGFkXCIsIFwiaVBvZFwiLCBcImlQaG9uZVwiLCBcIktpbmRsZVwiLFxuICAgICAqIFwiS2luZGxlIEZpcmVcIiwgXCJOZXh1c1wiLCBcIk5vb2tcIiwgXCJQbGF5Qm9va1wiLCBcIlRvdWNoUGFkXCIgYW5kIFwiVHJhbnNmb3JtZXJcIlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIHBsYXRmb3JtXG4gICAgICogQHR5cGUgc3RyaW5nfG51bGxcbiAgICAgKi9cbiAgICBwbGF0Zm9ybS5wcm9kdWN0ID0gcHJvZHVjdDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBicm93c2VyJ3MgdXNlciBhZ2VudCBzdHJpbmcuXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm1cbiAgICAgKiBAdHlwZSBzdHJpbmd8bnVsbFxuICAgICAqL1xuICAgIHBsYXRmb3JtLnVhID0gdWE7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYnJvd3Nlci9lbnZpcm9ubWVudCB2ZXJzaW9uLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIHBsYXRmb3JtXG4gICAgICogQHR5cGUgc3RyaW5nfG51bGxcbiAgICAgKi9cbiAgICBwbGF0Zm9ybS52ZXJzaW9uID0gbmFtZSAmJiB2ZXJzaW9uO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIG9wZXJhdGluZyBzeXN0ZW0uXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm1cbiAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgKi9cbiAgICBwbGF0Zm9ybS5vcyA9IG9zIHx8IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgQ1BVIGFyY2hpdGVjdHVyZSB0aGUgT1MgaXMgYnVpbHQgZm9yLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybS5vc1xuICAgICAgICogQHR5cGUgbnVtYmVyfG51bGxcbiAgICAgICAqL1xuICAgICAgJ2FyY2hpdGVjdHVyZSc6IG51bGwsXG5cbiAgICAgIC8qKlxuICAgICAgICogVGhlIGZhbWlseSBvZiB0aGUgT1MuXG4gICAgICAgKlxuICAgICAgICogQ29tbW9uIHZhbHVlcyBpbmNsdWRlOlxuICAgICAgICogXCJXaW5kb3dzXCIsIFwiV2luZG93cyBTZXJ2ZXIgMjAwOCBSMiAvIDdcIiwgXCJXaW5kb3dzIFNlcnZlciAyMDA4IC8gVmlzdGFcIixcbiAgICAgICAqIFwiV2luZG93cyBYUFwiLCBcIk9TIFhcIiwgXCJVYnVudHVcIiwgXCJEZWJpYW5cIiwgXCJGZWRvcmFcIiwgXCJSZWQgSGF0XCIsIFwiU3VTRVwiLFxuICAgICAgICogXCJBbmRyb2lkXCIsIFwiaU9TXCIgYW5kIFwiV2luZG93cyBQaG9uZVwiXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIHBsYXRmb3JtLm9zXG4gICAgICAgKiBAdHlwZSBzdHJpbmd8bnVsbFxuICAgICAgICovXG4gICAgICAnZmFtaWx5JzogbnVsbCxcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgdmVyc2lvbiBvZiB0aGUgT1MuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIHBsYXRmb3JtLm9zXG4gICAgICAgKiBAdHlwZSBzdHJpbmd8bnVsbFxuICAgICAgICovXG4gICAgICAndmVyc2lvbic6IG51bGwsXG5cbiAgICAgIC8qKlxuICAgICAgICogUmV0dXJucyB0aGUgT1Mgc3RyaW5nLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybS5vc1xuICAgICAgICogQHJldHVybnMge3N0cmluZ30gVGhlIE9TIHN0cmluZy5cbiAgICAgICAqL1xuICAgICAgJ3RvU3RyaW5nJzogZnVuY3Rpb24oKSB7IHJldHVybiAnbnVsbCc7IH1cbiAgICB9O1xuXG4gICAgcGxhdGZvcm0ucGFyc2UgPSBwYXJzZTtcbiAgICBwbGF0Zm9ybS50b1N0cmluZyA9IHRvU3RyaW5nUGxhdGZvcm07XG5cbiAgICBpZiAocGxhdGZvcm0udmVyc2lvbikge1xuICAgICAgZGVzY3JpcHRpb24udW5zaGlmdCh2ZXJzaW9uKTtcbiAgICB9XG4gICAgaWYgKHBsYXRmb3JtLm5hbWUpIHtcbiAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQobmFtZSk7XG4gICAgfVxuICAgIGlmIChvcyAmJiBuYW1lICYmICEob3MgPT0gU3RyaW5nKG9zKS5zcGxpdCgnICcpWzBdICYmIChvcyA9PSBuYW1lLnNwbGl0KCcgJylbMF0gfHwgcHJvZHVjdCkpKSB7XG4gICAgICBkZXNjcmlwdGlvbi5wdXNoKHByb2R1Y3QgPyAnKCcgKyBvcyArICcpJyA6ICdvbiAnICsgb3MpO1xuICAgIH1cbiAgICBpZiAoZGVzY3JpcHRpb24ubGVuZ3RoKSB7XG4gICAgICBwbGF0Zm9ybS5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uLmpvaW4oJyAnKTtcbiAgICB9XG4gICAgcmV0dXJuIHBsYXRmb3JtO1xuICB9XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLy8gRXhwb3J0IHBsYXRmb3JtLlxuICB2YXIgcGxhdGZvcm0gPSBwYXJzZSgpO1xuXG4gIC8vIFNvbWUgQU1EIGJ1aWxkIG9wdGltaXplcnMsIGxpa2Ugci5qcywgY2hlY2sgZm9yIGNvbmRpdGlvbiBwYXR0ZXJucyBsaWtlIHRoZSBmb2xsb3dpbmc6XG4gIGlmICh0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT0gJ29iamVjdCcgJiYgZGVmaW5lLmFtZCkge1xuICAgIC8vIEV4cG9zZSBwbGF0Zm9ybSBvbiB0aGUgZ2xvYmFsIG9iamVjdCB0byBwcmV2ZW50IGVycm9ycyB3aGVuIHBsYXRmb3JtIGlzXG4gICAgLy8gbG9hZGVkIGJ5IGEgc2NyaXB0IHRhZyBpbiB0aGUgcHJlc2VuY2Ugb2YgYW4gQU1EIGxvYWRlci5cbiAgICAvLyBTZWUgaHR0cDovL3JlcXVpcmVqcy5vcmcvZG9jcy9lcnJvcnMuaHRtbCNtaXNtYXRjaCBmb3IgbW9yZSBkZXRhaWxzLlxuICAgIHJvb3QucGxhdGZvcm0gPSBwbGF0Zm9ybTtcblxuICAgIC8vIERlZmluZSBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlIHNvIHBsYXRmb3JtIGNhbiBiZSBhbGlhc2VkIHRocm91Z2ggcGF0aCBtYXBwaW5nLlxuICAgIGRlZmluZShmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBwbGF0Zm9ybTtcbiAgICB9KTtcbiAgfVxuICAvLyBDaGVjayBmb3IgYGV4cG9ydHNgIGFmdGVyIGBkZWZpbmVgIGluIGNhc2UgYSBidWlsZCBvcHRpbWl6ZXIgYWRkcyBhbiBgZXhwb3J0c2Agb2JqZWN0LlxuICBlbHNlIGlmIChmcmVlRXhwb3J0cyAmJiBmcmVlTW9kdWxlKSB7XG4gICAgLy8gRXhwb3J0IGZvciBDb21tb25KUyBzdXBwb3J0LlxuICAgIGZvck93bihwbGF0Zm9ybSwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgZnJlZUV4cG9ydHNba2V5XSA9IHZhbHVlO1xuICAgIH0pO1xuICB9XG4gIGVsc2Uge1xuICAgIC8vIEV4cG9ydCB0byB0aGUgZ2xvYmFsIG9iamVjdC5cbiAgICByb290LnBsYXRmb3JtID0gcGxhdGZvcm07XG4gIH1cbn0uY2FsbCh0aGlzKSk7XG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuaW1wb3J0IENvbXBvbmVudCBmcm9tICcuLi9jb21wb25lbnQnXG5pbXBvcnQgQ29sbGFwc2UgZnJvbSAnLi4vY29sbGFwc2UnXG5pbXBvcnQgeyBnZXRBdHRyaWJ1dGVzQ29uZmlnIH0gZnJvbSAnLi4vY29tcG9uZW50TWFuYWdlcidcbmltcG9ydCBFdmVudCBmcm9tICcuLi8uLi9jb3JlL2V2ZW50cydcbmltcG9ydCB7IGZpbmRUYXJnZXRCeUNsYXNzIH0gZnJvbSAnLi4vLi4vY29yZS91dGlscydcblxuY29uc3QgQWNjb3JkaW9uID0gKCgpID0+IHtcbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDb25zdGFudHNcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNvbnN0IE5BTUUgPSAnYWNjb3JkaW9uJ1xuICBjb25zdCBWRVJTSU9OID0gJzIuMC4wJ1xuICBjb25zdCBERUZBVUxUX1BST1BFUlRJRVMgPSB7XG4gICAgZWxlbWVudDogbnVsbCxcbiAgfVxuICBjb25zdCBEQVRBX0FUVFJTX1BST1BFUlRJRVMgPSBbXG4gIF1cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENsYXNzIERlZmluaXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNsYXNzIEFjY29yZGlvbiBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAgIHN1cGVyKE5BTUUsIFZFUlNJT04sIERFRkFVTFRfUFJPUEVSVElFUywgb3B0aW9ucywgREFUQV9BVFRSU19QUk9QRVJUSUVTLCBmYWxzZSwgZmFsc2UpXG5cbiAgICAgIHRoaXMuY29sbGFwc2VzID0gW11cblxuICAgICAgY29uc3QgdG9nZ2xlcyA9IHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFtkYXRhLXRvZ2dsZT1cIiR7TkFNRX1cIl1gKVxuICAgICAgdG9nZ2xlcy5mb3JFYWNoKCh0b2dnbGUpID0+IHtcbiAgICAgICAgY29uc3QgY29sbGFwc2VJZCA9IHRvZ2dsZS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKVxuICAgICAgICBjb25zdCBjb2xsYXBzZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29sbGFwc2VJZClcblxuICAgICAgICBpZiAoY29sbGFwc2UpIHtcbiAgICAgICAgICB0aGlzLmFkZENvbGxhcHNlKGNvbGxhcHNlKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIG9uRWxlbWVudEV2ZW50KGV2ZW50KSB7XG4gICAgICBjb25zdCBpZCA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKVxuICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoaWQpXG5cbiAgICAgIHRoaXMuc2V0Q29sbGFwc2VzKGVsZW1lbnQpXG4gICAgfVxuXG4gICAgYWRkQ29sbGFwc2UoZWxlbWVudCkge1xuICAgICAgY29uc3QgY29sbGFwc2UgPSBuZXcgQ29sbGFwc2Uoe1xuICAgICAgICBlbGVtZW50LFxuICAgICAgfSlcbiAgICAgIHRoaXMuY29sbGFwc2VzLnB1c2goY29sbGFwc2UpXG5cbiAgICAgIHJldHVybiBjb2xsYXBzZVxuICAgIH1cblxuICAgIGdldENvbGxhcHNlKGVsZW1lbnQpIHtcbiAgICAgIGxldCBjb2xsYXBzZSA9IHRoaXMuY29sbGFwc2VzLmZpbmQoYyA9PiBjLm9wdGlvbnMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lkJykgPT09IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpZCcpKVxuXG4gICAgICBpZiAoIWNvbGxhcHNlKSB7XG4gICAgICAgIC8vIGNyZWF0ZSBhIG5ldyBjb2xsYXBzZVxuICAgICAgICBjb2xsYXBzZSA9IHRoaXMuYWRkQ29sbGFwc2UoKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gY29sbGFwc2VcbiAgICB9XG5cbiAgICBnZXRDb2xsYXBzZXMoKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb2xsYXBzZXNcbiAgICB9XG5cbiAgICBzZXRDb2xsYXBzZXMoc2hvd0NvbGxhcHNlKSB7XG4gICAgICBjb25zdCBjb2xsYXBzZSA9IHRoaXMuZ2V0Q29sbGFwc2Uoc2hvd0NvbGxhcHNlKVxuICAgICAgdGhpcy5jb2xsYXBzZXMuZm9yRWFjaCgoYykgPT4ge1xuICAgICAgICBpZiAoYy5vcHRpb25zLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpZCcpICE9PSBzaG93Q29sbGFwc2UuZ2V0QXR0cmlidXRlKCdpZCcpKSB7XG4gICAgICAgICAgYy5oaWRlKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb2xsYXBzZS50b2dnbGUoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIHNob3coY29sbGFwc2VFbCkge1xuICAgICAgbGV0IGNvbGxhcHNlID0gY29sbGFwc2VFbFxuICAgICAgaWYgKHR5cGVvZiBjb2xsYXBzZUVsID09PSAnc3RyaW5nJykge1xuICAgICAgICBjb2xsYXBzZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29sbGFwc2VFbClcbiAgICAgIH1cblxuICAgICAgaWYgKCFjb2xsYXBzZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7TkFNRX0uIFRoZSBjb2xsYXBzaWJsZSAke2NvbGxhcHNlRWx9IGlzIGFuIGludmFsaWQgSFRNTEVsZW1lbnQuYClcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRDb2xsYXBzZXMoY29sbGFwc2UpXG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgaGlkZShjb2xsYXBzZUVsKSB7XG4gICAgICBsZXQgY29sbGFwc2UgPSBjb2xsYXBzZUVsXG4gICAgICBpZiAodHlwZW9mIGNvbGxhcHNlRWwgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGNvbGxhcHNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb2xsYXBzZUVsKVxuICAgICAgfVxuXG4gICAgICBpZiAoIWNvbGxhcHNlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtOQU1FfS4gVGhlIGNvbGxhcHNpYmxlICR7Y29sbGFwc2VFbH0gaXMgYW4gaW52YWxpZCBIVE1MRWxlbWVudC5gKVxuICAgICAgfVxuXG4gICAgICBjb25zdCBjb2xsYXBzZU9iaiA9IHRoaXMuZ2V0Q29sbGFwc2UoY29sbGFwc2UpXG4gICAgICByZXR1cm4gY29sbGFwc2VPYmouaGlkZSgpXG4gICAgfVxuXG4gICAgc3RhdGljIF9ET01JbnRlcmZhY2Uob3B0aW9ucykge1xuICAgICAgcmV0dXJuIHN1cGVyLl9ET01JbnRlcmZhY2UoQWNjb3JkaW9uLCBvcHRpb25zKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogRE9NIEFwaSBpbXBsZW1lbnRhdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG4gIGNvbnN0IGNvbXBvbmVudHMgPSBbXVxuXG4gIGNvbnN0IGFjY29yZGlvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuJHtOQU1FfWApXG4gIGlmIChhY2NvcmRpb25zKSB7XG4gICAgYWNjb3JkaW9ucy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBjb25zdCBjb25maWcgPSBnZXRBdHRyaWJ1dGVzQ29uZmlnKGVsZW1lbnQsIERFRkFVTFRfUFJPUEVSVElFUywgREFUQV9BVFRSU19QUk9QRVJUSUVTKVxuICAgICAgY29uZmlnLmVsZW1lbnQgPSBlbGVtZW50XG5cbiAgICAgIGNvbXBvbmVudHMucHVzaChBY2NvcmRpb24uX0RPTUludGVyZmFjZShjb25maWcpKVxuICAgIH0pXG4gIH1cblxuICBpZiAoYWNjb3JkaW9ucykge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICBjb25zdCBkYXRhVG9nZ2xlQXR0ciA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdG9nZ2xlJylcbiAgICAgIGlmIChkYXRhVG9nZ2xlQXR0ciAmJiBkYXRhVG9nZ2xlQXR0ciA9PT0gTkFNRSkge1xuICAgICAgICBjb25zdCBjb2xsYXBzZUlkID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS10YXJnZXQnKSB8fCBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdocmVmJylcbiAgICAgICAgY29uc3QgY29sbGFwc2VFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29sbGFwc2VJZClcblxuICAgICAgICBjb25zdCBhY2NvcmRpb24gPSBmaW5kVGFyZ2V0QnlDbGFzcyhldmVudC50YXJnZXQsICdhY2NvcmRpb24nKVxuXG4gICAgICAgIGlmIChhY2NvcmRpb24gPT09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFjY29yZGlvbklkID0gYWNjb3JkaW9uLmdldEF0dHJpYnV0ZSgnaWQnKVxuICAgICAgICBjb25zdCBjb21wb25lbnQgPSBjb21wb25lbnRzLmZpbmQoYyA9PiBjLmdldEVsZW1lbnQoKS5nZXRBdHRyaWJ1dGUoJ2lkJykgPT09IGFjY29yZGlvbklkKVxuXG4gICAgICAgIGlmICghY29tcG9uZW50KSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiB0aGUgY29sbGFwc2UgaGFzIGJlZW4gYWRkZWQgcHJvZ3JhbW1hdGljYWxseSwgd2UgYWRkIGl0XG4gICAgICAgIGNvbnN0IHRhcmdldENvbGxhcHNlID0gY29tcG9uZW50LmdldENvbGxhcHNlcygpLmZpbmQoYyA9PiBjLmdldEVsZW1lbnQoKSA9PT0gY29sbGFwc2VFbClcbiAgICAgICAgaWYgKCF0YXJnZXRDb2xsYXBzZSkge1xuICAgICAgICAgIGNvbXBvbmVudC5hZGRDb2xsYXBzZShjb2xsYXBzZUVsKVxuICAgICAgICB9XG5cbiAgICAgICAgY29tcG9uZW50LnNob3coY29sbGFwc2VJZClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgcmV0dXJuIEFjY29yZGlvblxufSkoKVxuXG5leHBvcnQgZGVmYXVsdCBBY2NvcmRpb25cbiIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3F1YXJrLWRldi9QaG9ub24tRnJhbWV3b3JrL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gJy4uL2NvbXBvbmVudCdcbmltcG9ydCB7IGdldEF0dHJpYnV0ZXNDb25maWcgfSBmcm9tICcuLi9jb21wb25lbnRNYW5hZ2VyJ1xuaW1wb3J0IEV2ZW50IGZyb20gJy4uLy4uL2NvcmUvZXZlbnRzJ1xuaW1wb3J0IHsgZmluZFRhcmdldEJ5QXR0ciB9IGZyb20gJy4uLy4uL2NvcmUvdXRpbHMnXG5cbmNvbnN0IENvbGxhcHNlID0gKCgpID0+IHtcbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDb25zdGFudHNcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNvbnN0IE5BTUUgPSAnY29sbGFwc2UnXG4gIGNvbnN0IFZFUlNJT04gPSAnMi4wLjAnXG4gIGNvbnN0IERFRkFVTFRfUFJPUEVSVElFUyA9IHtcbiAgICBlbGVtZW50OiBudWxsLFxuICAgIHRvZ2dsZTogZmFsc2UsXG4gIH1cbiAgY29uc3QgREFUQV9BVFRSU19QUk9QRVJUSUVTID0gW1xuICAgICd0b2dnbGUnLFxuICBdXG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDbGFzcyBEZWZpbml0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjbGFzcyBDb2xsYXBzZSBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAgIHN1cGVyKE5BTUUsIFZFUlNJT04sIERFRkFVTFRfUFJPUEVSVElFUywgb3B0aW9ucywgREFUQV9BVFRSU19QUk9QRVJUSUVTLCBmYWxzZSwgZmFsc2UpXG5cbiAgICAgIHRoaXMub25UcmFuc2l0aW9uID0gZmFsc2VcblxuICAgICAgLy8gdG9nZ2xlIGRpcmVjdGx5XG4gICAgICBpZiAodGhpcy5vcHRpb25zLnRvZ2dsZSkge1xuICAgICAgICB0aGlzLnNob3coKVxuICAgICAgfVxuICAgIH1cblxuICAgIGdldEhlaWdodCgpIHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QodGhpcy5vcHRpb25zLmVsZW1lbnQpLmhlaWdodFxuICAgIH1cblxuICAgIHRvZ2dsZSgpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3cnKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5oaWRlKClcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuc2hvdygpXG4gICAgfVxuXG4gICAgc2hvdygpIHtcbiAgICAgIGlmICh0aGlzLm9uVHJhbnNpdGlvbikge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnc2hvdycpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICB0aGlzLm9uVHJhbnNpdGlvbiA9IHRydWVcblxuICAgICAgY29uc3Qgb25Db2xsYXBzZWQgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3Nob3cnKVxuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdjb2xsYXBzaW5nJylcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihFdmVudC5UUkFOU0lUSU9OX0VORCwgb25Db2xsYXBzZWQpXG5cbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgdHJ1ZSlcblxuICAgICAgICB0aGlzLm9uVHJhbnNpdGlvbiA9IGZhbHNlXG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjb2xsYXBzaW5nJykpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2luZycpXG4gICAgICB9XG5cbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoRXZlbnQuVFJBTlNJVElPTl9FTkQsIG9uQ29sbGFwc2VkKVxuXG4gICAgICBjb25zdCBoZWlnaHQgPSB0aGlzLmdldEhlaWdodCgpXG5cbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnN0eWxlLmhlaWdodCA9ICcwcHgnXG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSBgJHtoZWlnaHR9cHhgXG4gICAgICB9LCAyMClcblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgaWYgKHRoaXMub25UcmFuc2l0aW9uKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnc2hvdycpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICB0aGlzLm9uVHJhbnNpdGlvbiA9IHRydWVcblxuICAgICAgY29uc3Qgb25Db2xsYXBzZWQgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2NvbGxhcHNpbmcnKVxuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSAnYXV0bydcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihFdmVudC5UUkFOU0lUSU9OX0VORCwgb25Db2xsYXBzZWQpXG5cbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpXG5cbiAgICAgICAgdGhpcy5vblRyYW5zaXRpb24gPSBmYWxzZVxuICAgICAgfVxuXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSAnMHB4J1xuXG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnY29sbGFwc2luZycpKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNpbmcnKVxuICAgICAgfVxuXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKEV2ZW50LlRSQU5TSVRJT05fRU5ELCBvbkNvbGxhcHNlZClcblxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpXG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgc3RhdGljIF9ET01JbnRlcmZhY2Uob3B0aW9ucykge1xuICAgICAgcmV0dXJuIHN1cGVyLl9ET01JbnRlcmZhY2UoQ29sbGFwc2UsIG9wdGlvbnMpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBET00gQXBpIGltcGxlbWVudGF0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cbiAgY29uc3QgY29tcG9uZW50cyA9IFtdXG5cbiAgY29uc3QgY29sbGFwc2VzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLiR7TkFNRX1gKVxuICBpZiAoY29sbGFwc2VzKSB7XG4gICAgY29sbGFwc2VzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIC8vIGNvbnN0IGNvbmZpZyA9IHt9XG4gICAgICBjb25zdCBjb25maWcgPSBnZXRBdHRyaWJ1dGVzQ29uZmlnKGVsZW1lbnQsIERFRkFVTFRfUFJPUEVSVElFUywgREFUQV9BVFRSU19QUk9QRVJUSUVTKVxuICAgICAgY29uZmlnLmVsZW1lbnQgPSBlbGVtZW50XG5cbiAgICAgIGNvbXBvbmVudHMucHVzaChDb2xsYXBzZS5fRE9NSW50ZXJmYWNlKGNvbmZpZykpXG4gICAgfSlcbiAgfVxuXG4gIGlmIChjb2xsYXBzZXMpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgY29uc3QgdGFyZ2V0ID0gZmluZFRhcmdldEJ5QXR0cihldmVudC50YXJnZXQsICdkYXRhLXRvZ2dsZScpXG4gICAgICBpZiAoIXRhcmdldCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgY29uc3QgZGF0YVRvZ2dsZUF0dHIgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvZ2dsZScpXG5cbiAgICAgIGlmIChkYXRhVG9nZ2xlQXR0ciAmJiBkYXRhVG9nZ2xlQXR0ciA9PT0gTkFNRSkge1xuICAgICAgICBsZXQgaWQgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXRhcmdldCcpIHx8IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKVxuICAgICAgICBpZCA9IGlkLnJlcGxhY2UoJyMnLCAnJylcblxuICAgICAgICBjb25zdCBjb21wb25lbnQgPSBjb21wb25lbnRzLmZpbmQoYyA9PiBjLmdldEVsZW1lbnQoKS5nZXRBdHRyaWJ1dGUoJ2lkJykgPT09IGlkKVxuXG4gICAgICAgIGlmICghY29tcG9uZW50KSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb21wb25lbnQudG9nZ2xlKClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgcmV0dXJuIENvbGxhcHNlXG59KSgpXG5cbmV4cG9ydCBkZWZhdWx0IENvbGxhcHNlXG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuaW1wb3J0IHsgZGlzcGF0Y2hFbGVtZW50RXZlbnQsIGRpc3BhdGNoV2luRG9jRXZlbnQgfSBmcm9tICcuLi9jb3JlL2V2ZW50cy9kaXNwYXRjaCdcbmltcG9ydCB7IGdlbmVyYXRlSWQgfSBmcm9tICcuLi9jb3JlL3V0aWxzJ1xuaW1wb3J0IEV2ZW50IGZyb20gJy4uL2NvcmUvZXZlbnRzJ1xuaW1wb3J0IENvbXBvbmVudE1hbmFnZXIsIHsgc2V0QXR0cmlidXRlc0NvbmZpZywgZ2V0QXR0cmlidXRlc0NvbmZpZyB9IGZyb20gJy4vY29tcG9uZW50TWFuYWdlcidcblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENsYXNzIERlZmluaXRpb25cbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXBvbmVudCB7XG5cbiAgY29uc3RydWN0b3IobmFtZSwgdmVyc2lvbiwgZGVmYXVsdE9wdGlvbnMgPSB7fSwgb3B0aW9ucyA9IHt9LCBvcHRpb25BdHRycyA9IFtdLCBzdXBwb3J0RHluYW1pY0VsZW1lbnQgPSBmYWxzZSwgYWRkVG9TdGFjayA9IGZhbHNlKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZVxuICAgIHRoaXMudmVyc2lvbiA9IHZlcnNpb25cbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG5cbiAgICAvL3RoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpXG4gICAgLypcbiAgICBPYmplY3Qua2V5cyhkZWZhdWx0T3B0aW9ucykuZXZlcnkoKHByb3ApID0+IHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnNbcHJvcF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLm9wdGlvbnNbcHJvcF0gPSBkZWZhdWx0T3B0aW9uc1twcm9wXVxuICAgICAgfVxuICAgIH0pXG4gICAgKi9cblxuICAgIHRoaXMub3B0aW9uQXR0cnMgPSBvcHRpb25BdHRyc1xuICAgIHRoaXMuc3VwcG9ydER5bmFtaWNFbGVtZW50ID0gc3VwcG9ydER5bmFtaWNFbGVtZW50XG4gICAgdGhpcy5hZGRUb1N0YWNrID0gYWRkVG9TdGFja1xuICAgIHRoaXMuaWQgPSBnZW5lcmF0ZUlkKClcblxuICAgIGNvbnN0IGNoZWNrRWxlbWVudCA9ICF0aGlzLnN1cHBvcnREeW5hbWljRWxlbWVudCB8fCB0aGlzLm9wdGlvbnMuZWxlbWVudCAhPT0gbnVsbFxuXG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMuZWxlbWVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLm9wdGlvbnMuZWxlbWVudClcbiAgICB9XG5cbiAgICBpZiAoY2hlY2tFbGVtZW50ICYmICF0aGlzLm9wdGlvbnMuZWxlbWVudCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3RoaXMubmFtZX0uIFRoZSBlbGVtZW50IGlzIG5vdCBhIEhUTUxFbGVtZW50LmApXG4gICAgfVxuXG4gICAgdGhpcy5keW5hbWljRWxlbWVudCA9IHRoaXMub3B0aW9ucy5lbGVtZW50ID09PSBudWxsXG4gICAgdGhpcy5yZWdpc3RlcmVkRWxlbWVudHMgPSBbXVxuXG4gICAgaWYgKCF0aGlzLmR5bmFtaWNFbGVtZW50KSB7XG4gICAgICAvKipcbiAgICAgICAqIGlmIHRoZSBlbGVtZW50IGV4aXN0cywgd2UgcmVhZCB0aGUgZGF0YSBhdHRyaWJ1dGVzIGNvbmZpZ1xuICAgICAgICogdGhlbiB3ZSBvdmVyd3JpdGUgZXhpc3RpbmcgY29uZmlnIGtleXMgaW4gSmF2YVNjcmlwdCwgc28gdGhhdFxuICAgICAgICogd2Uga2VlcCB0aGUgZm9sbG93aW5nIG9yZGVyXG4gICAgICAgKiBbMV0gZGVmYXVsdCBKYXZhU2NyaXB0IGNvbmZpZ3VyYXRpb24gb2YgdGhlIGNvbXBvbmVudFxuICAgICAgICogWzJdIERhdGEgYXR0cmlidXRlcyBjb25maWd1cmF0aW9uIGlmIHRoZSBlbGVtZW50IGV4aXN0cyBpbiB0aGUgRE9NXG4gICAgICAgKiBbM10gSmF2YVNjcmlwdCBjb25maWd1cmF0aW9uXG4gICAgICAgKi9cbiAgICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24odGhpcy5vcHRpb25zLCB0aGlzLmFzc2lnbkpzQ29uZmlnKHRoaXMuZ2V0QXR0cmlidXRlcygpLCBvcHRpb25zKSlcblxuICAgICAgLy8gdGhlbiwgc2V0IHRoZSBuZXcgZGF0YSBhdHRyaWJ1dGVzIHRvIHRoZSBlbGVtZW50XG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZXMoKVxuICAgIH1cblxuICAgIHRoaXMuZWxlbWVudExpc3RlbmVyID0gZXZlbnQgPT4gdGhpcy5vbkJlZm9yZUVsZW1lbnRFdmVudChldmVudCkgICAgICAgICAgXG4gIH1cblxuICBhc3NpZ25Kc0NvbmZpZyhhdHRyQ29uZmlnLCBvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25BdHRycy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGlmIChvcHRpb25zW2tleV0pIHtcbiAgICAgICAgYXR0ckNvbmZpZ1trZXldID0gb3B0aW9uc1trZXldXG4gICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiBhdHRyQ29uZmlnXG4gIH1cblxuICBnZXRWZXJzaW9uKCkge1xuICAgIHJldHVybiB0aGlzLnZlcnNpb25cbiAgfVxuXG4gIGdldEVsZW1lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy5lbGVtZW50XG4gIH1cblxuICBnZXRJZCgpIHtcbiAgICByZXR1cm4gdGhpcy5pZFxuICB9XG5cbiAgcmVnaXN0ZXJFbGVtZW50cyhlbGVtZW50cykge1xuICAgIGVsZW1lbnRzLmZvckVhY2goZWxlbWVudCA9PiB0aGlzLnJlZ2lzdGVyRWxlbWVudChlbGVtZW50KSlcbiAgfVxuXG4gIHJlZ2lzdGVyRWxlbWVudChlbGVtZW50KSB7XG4gICAgZWxlbWVudC50YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihlbGVtZW50LmV2ZW50LCB0aGlzLmVsZW1lbnRMaXN0ZW5lcilcbiAgICB0aGlzLnJlZ2lzdGVyZWRFbGVtZW50cy5wdXNoKGVsZW1lbnQpXG4gIH1cblxuICB1bnJlZ2lzdGVyRWxlbWVudHMoKSB7XG4gICAgdGhpcy5yZWdpc3RlcmVkRWxlbWVudHMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgdGhpcy51bnJlZ2lzdGVyRWxlbWVudChlbGVtZW50KVxuICAgIH0pXG4gIH1cblxuICB1bnJlZ2lzdGVyRWxlbWVudChlbGVtZW50KSB7XG4gICAgY29uc3QgcmVnaXN0ZXJlZEVsZW1lbnRJbmRleCA9IHRoaXMucmVnaXN0ZXJlZEVsZW1lbnRzXG4gICAgICAuZmluZEluZGV4KGVsID0+IGVsLnRhcmdldCA9PT0gZWxlbWVudC50YXJnZXQgJiYgZWwuZXZlbnQgPT09IGVsZW1lbnQuZXZlbnQpXG5cbiAgICBpZiAocmVnaXN0ZXJlZEVsZW1lbnRJbmRleCA+IC0xKSB7XG4gICAgICBlbGVtZW50LnRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGVsZW1lbnQuZXZlbnQsIHRoaXMuZWxlbWVudExpc3RlbmVyKVxuICAgICAgdGhpcy5yZWdpc3RlcmVkRWxlbWVudHMuc3BsaWNlKHJlZ2lzdGVyZWRFbGVtZW50SW5kZXgsIDEpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYFdhcm5pbmchIFVua25vd24gcmVnaXN0ZXJlZCBlbGVtZW50OiAke2VsZW1lbnQudGFyZ2V0fSB3aXRoIGV2ZW50OiAke2VsZW1lbnQuZXZlbnR9LmApXG4gICAgfVxuICB9XG5cbiAgdHJpZ2dlckV2ZW50KGV2ZW50TmFtZSwgZGV0YWlsID0ge30sIG9iamVjdEV2ZW50T25seSA9IGZhbHNlKSB7XG4gICAgaWYgKHRoaXMuYWRkVG9TdGFjaykge1xuICAgICAgaWYgKGV2ZW50TmFtZSA9PT0gRXZlbnQuU0hPVykge1xuICAgICAgICBDb21wb25lbnRNYW5hZ2VyLmFkZCh0aGlzKVxuICAgICAgfSBlbHNlIGlmIChldmVudE5hbWUgPT09IEV2ZW50LkhJREUpIHtcbiAgICAgICAgQ29tcG9uZW50TWFuYWdlci5yZW1vdmUodGhpcylcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBldmVudE5hbWVBbGlhcyA9IGBvbiR7ZXZlbnROYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpfSR7ZXZlbnROYW1lLnNsaWNlKDEpfWBcblxuICAgIC8vIG9iamVjdCBldmVudFxuICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zW2V2ZW50TmFtZV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMub3B0aW9uc1tldmVudE5hbWVdLmFwcGx5KHRoaXMsIFtkZXRhaWxdKVxuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zW2V2ZW50TmFtZUFsaWFzXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5vcHRpb25zW2V2ZW50TmFtZUFsaWFzXS5hcHBseSh0aGlzLCBbZGV0YWlsXSlcbiAgICB9XG5cbiAgICBpZiAob2JqZWN0RXZlbnRPbmx5KSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyBkb20gZXZlbnRcbiAgICBpZiAodGhpcy5vcHRpb25zLmVsZW1lbnQpIHtcbiAgICAgIGRpc3BhdGNoRWxlbWVudEV2ZW50KHRoaXMub3B0aW9ucy5lbGVtZW50LCBldmVudE5hbWUsIHRoaXMubmFtZSwgZGV0YWlsKVxuICAgIH0gZWxzZSB7XG4gICAgICBkaXNwYXRjaFdpbkRvY0V2ZW50KGV2ZW50TmFtZSwgdGhpcy5uYW1lLCBkZXRhaWwpXG4gICAgfVxuICB9XG5cbiAgc2V0QXR0cmlidXRlcygpIHtcbiAgICBpZiAodGhpcy5vcHRpb25BdHRycy5sZW5ndGggPiAwKSB7XG4gICAgICBzZXRBdHRyaWJ1dGVzQ29uZmlnKHRoaXMub3B0aW9ucy5lbGVtZW50LCB0aGlzLm9wdGlvbnMsIHRoaXMub3B0aW9uQXR0cnMpXG4gICAgfVxuICB9XG5cbiAgZ2V0QXR0cmlidXRlcygpIHtcbiAgICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5vcHRpb25zKVxuICAgIHJldHVybiBnZXRBdHRyaWJ1dGVzQ29uZmlnKHRoaXMub3B0aW9ucy5lbGVtZW50LCBvcHRpb25zLCB0aGlzLm9wdGlvbkF0dHJzKVxuICB9XG5cbiAgLyoqXG4gICAqIHRoZSBwcmV2ZW50Q2xvc2FibGUgbWV0aG9kIG1hbmFnZXMgY29uY3VycmVuY3kgYmV0d2VlbiBhY3RpdmUgY29tcG9uZW50cy5cbiAgICogRm9yIGV4YW1wbGUsIGlmIHRoZXJlIGlzIGEgc2hvd24gb2ZmLWNhbnZhcyBhbmQgZGlhbG9nLCB0aGUgbGFzdFxuICAgKiBzaG93biBjb21wb25lbnQgZ2FpbnMgdGhlIHByb2Nlc3NpbmcgcHJpb3JpdHlcbiAgICovXG4gIHByZXZlbnRDbG9zYWJsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5hZGRUb1N0YWNrICYmICFDb21wb25lbnRNYW5hZ2VyLmNsb3NhYmxlKHRoaXMpXG4gIH1cblxuICBvbkJlZm9yZUVsZW1lbnRFdmVudChldmVudCkge1xuICAgIGlmICh0aGlzLnByZXZlbnRDbG9zYWJsZSgpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLm9uRWxlbWVudEV2ZW50KGV2ZW50KVxuICB9XG5cbiAgb25FbGVtZW50RXZlbnQoZXZlbnQpIHtcbiAgICAvL1xuICB9XG5cbiAgc3RhdGljIF9ET01JbnRlcmZhY2UoQ29tcG9uZW50Q2xhc3MsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gbmV3IENvbXBvbmVudENsYXNzKG9wdGlvbnMpXG4gIH1cbn1cbiIsIlxuY29uc3QgZ2V0QXR0cmlidXRlID0gKGZpcnN0LCBzZWNvbmQpID0+IHtcbiAgaWYgKGZpcnN0ID09PSAnJykge1xuICAgIHJldHVybiBgZGF0YS0ke3NlY29uZH1gXG4gIH1cbiAgcmV0dXJuIGBkYXRhLSR7Zmlyc3R9LSR7c2Vjb25kfWBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNDb25maWcoZWxlbWVudCwgb2JqID0ge30sIGF0dHJzLCBzdGFydCA9ICcnKSB7XG4gIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhvYmopXG4gIFxuICBrZXlzLmZvckVhY2goKGtleSkgPT4ge1xuICAgIGlmIChzdGFydCA9PT0gJycgJiYgYXR0cnMuaW5kZXhPZihrZXkpID09PSAtMSkge1xuICAgICAgLy8gY29udGludWUgd2l0aCBuZXh0IGl0ZXJhdGlvblxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBvYmpba2V5XSA9PT0gJ29iamVjdCcgJiYgb2JqW2tleV0gIT09IG51bGwpIHtcbiAgICAgIGxldCBrZXlTdGFydCA9IGtleVxuICAgICAgaWYgKHN0YXJ0ICE9PSAnJykge1xuICAgICAgICBrZXlTdGFydCA9IGAke3N0YXJ0fS0ke2tleX1gXG4gICAgICB9XG5cbiAgICAgIHNldEF0dHJpYnV0ZXNDb25maWcoZWxlbWVudCwgb2JqW2tleV0sIGF0dHJzLCBrZXlTdGFydClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IGF0dHIgPSBnZXRBdHRyaWJ1dGUoc3RhcnQsIGtleSlcbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyLCBvYmpba2V5XSlcbiAgfSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEF0dHJpYnV0ZXNDb25maWcoZWxlbWVudCwgb2JqID0ge30sIGF0dHJzLCBzdGFydCA9ICcnKSB7XG4gIGNvbnN0IG5ld09iaiA9IE9iamVjdC5hc3NpZ24oe30sIG9iailcbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKG9iailcblxuICBrZXlzLmZvckVhY2goKGtleSkgPT4ge1xuICAgIGlmIChzdGFydCA9PT0gJycgJiYgYXR0cnMuaW5kZXhPZihrZXkpID09PSAtMSkge1xuICAgICAgLy8gY29udGludWUgd2l0aCBuZXh0IGl0ZXJhdGlvblxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKG9ialtrZXldICE9PSBudWxsICYmIG9ialtrZXldLmNvbnN0cnVjdG9yID09PSBPYmplY3QpIHtcbiAgICAgIGxldCBrZXlTdGFydCA9IGtleVxuICAgICAgaWYgKHN0YXJ0ICE9PSAnJykge1xuICAgICAgICBrZXlTdGFydCA9IGAke3N0YXJ0fS0ke2tleX1gXG4gICAgICB9XG5cbiAgICAgIG5ld09ialtrZXldID0gZ2V0QXR0cmlidXRlc0NvbmZpZyhlbGVtZW50LCBvYmpba2V5XSwgYXR0cnMsIGtleVN0YXJ0KVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIHZhbHVlXG4gICAgbGV0IHZhbHVlID0gb2JqW2tleV0gLy8gZGVmYXVsdCB2YWx1ZVxuICAgIGNvbnN0IHR5cGUgPSB0eXBlb2YgdmFsdWVcbiAgICBjb25zdCBhdHRyID0gZ2V0QXR0cmlidXRlKHN0YXJ0LCBrZXkpXG4gICAgY29uc3QgYXR0clZhbHVlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cilcblxuICAgIGlmIChhdHRyVmFsdWUgIT09IG51bGwpIHtcbiAgICAgIGlmICh0eXBlID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgLy8gY29udmVydCBzdHJpbmcgdG8gYm9vbGVhblxuICAgICAgICB2YWx1ZSA9IGF0dHJWYWx1ZSA9PT0gJ3RydWUnXG4gICAgICB9IGVsc2UgaWYgKCFpc05hTihhdHRyVmFsdWUpKSB7XG4gICAgICAgIHZhbHVlID0gcGFyc2VJbnQoYXR0clZhbHVlLCAxMClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlID0gYXR0clZhbHVlXG4gICAgICB9XG4gICAgfVxuXG4gICAgbmV3T2JqW2tleV0gPSB2YWx1ZVxuICB9KVxuXG4gIHJldHVybiBuZXdPYmpcbn1cblxuY29uc3Qgc3RhY2sgPSBbXVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGFkZChjb21wb25lbnQpIHtcbiAgICBzdGFjay5wdXNoKGNvbXBvbmVudClcbiAgfSxcbiAgcmVtb3ZlKGNvbXBvbmVudCkge1xuICAgIGNvbnN0IGluZGV4ID0gc3RhY2suZmluZEluZGV4KGMgPT4gT2JqZWN0LmlzKGNvbXBvbmVudCwgYykpXG4gICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgIHN0YWNrLnNwbGljZShpbmRleCwgMSlcbiAgICB9XG4gIH0sXG4gIGNsb3NhYmxlKGNvbXBvbmVudCkge1xuICAgIHJldHVybiBzdGFjay5sZW5ndGggPT09IDAgfHwgT2JqZWN0LmlzKHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdLCBjb21wb25lbnQpXG4gIH1cbn1cbiIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3F1YXJrLWRldi9QaG9ub24tRnJhbWV3b3JrL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5pbXBvcnQgRXZlbnQgZnJvbSAnLi4vLi4vY29yZS9ldmVudHMnXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gJy4uL2NvbXBvbmVudCdcbmltcG9ydCB7IGdldEF0dHJpYnV0ZXNDb25maWcgfSBmcm9tICcuLi9jb21wb25lbnRNYW5hZ2VyJ1xuXG5jb25zdCBEaWFsb2cgPSAoKCkgPT4ge1xuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENvbnN0YW50c1xuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY29uc3QgTkFNRSA9ICdkaWFsb2cnXG4gIGNvbnN0IFZFUlNJT04gPSAnMi4wLjAnXG4gIGNvbnN0IEJBQ0tEUk9QX1NFTEVDVE9SID0gJ2RpYWxvZy1iYWNrZHJvcCdcbiAgY29uc3QgREVGQVVMVF9QUk9QRVJUSUVTID0ge1xuICAgIGVsZW1lbnQ6IG51bGwsXG4gICAgdGl0bGU6IG51bGwsXG4gICAgbWVzc2FnZTogbnVsbCxcbiAgICBjYW5jZWxhYmxlOiB0cnVlLFxuICB9XG4gIGNvbnN0IERBVEFfQVRUUlNfUFJPUEVSVElFUyA9IFtcbiAgICAnY2FuY2VsYWJsZScsXG4gIF1cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENsYXNzIERlZmluaXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNsYXNzIERpYWxvZyBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAgIHN1cGVyKE5BTUUsIFZFUlNJT04sIERFRkFVTFRfUFJPUEVSVElFUywgb3B0aW9ucywgREFUQV9BVFRSU19QUk9QRVJUSUVTLCB0cnVlLCB0cnVlKVxuXG4gICAgICB0aGlzLnRlbXBsYXRlID0gJycgK1xuICAgICAgJzxkaXYgY2xhc3M9XCJkaWFsb2dcIiB0YWJpbmRleD1cIi0xXCIgcm9sZT1cImRpYWxvZ1wiPicgK1xuICAgICAgICAnPGRpdiBjbGFzcz1cImRpYWxvZy1pbm5lclwiIHJvbGU9XCJkb2N1bWVudFwiPicgK1xuICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZGlhbG9nLWNvbnRlbnRcIj4nICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZGlhbG9nLWhlYWRlclwiPicgK1xuICAgICAgICAgICAgICAnPGg1IGNsYXNzPVwiZGlhbG9nLXRpdGxlXCI+PC9oNT4nICtcbiAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZGlhbG9nLWJvZHlcIj4nICtcbiAgICAgICAgICAgICAgJzxwPjwvcD4nICtcbiAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZGlhbG9nLWZvb3RlclwiPicgK1xuICAgICAgICAgICAgICAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIiBkYXRhLWRpc21pc3M9XCJkaWFsb2dcIj5PazwvYnV0dG9uPicgK1xuICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgJzwvZGl2PicgK1xuICAgICAgJzwvZGl2PidcblxuICAgICAgaWYgKHRoaXMuZHluYW1pY0VsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5idWlsZCgpXG4gICAgICB9XG4gICAgfVxuXG4gICAgYnVpbGQoKSB7XG4gICAgICBjb25zdCBidWlsZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcblxuICAgICAgYnVpbGRlci5pbm5lckhUTUwgPSB0aGlzLnRlbXBsYXRlXG5cbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50ID0gYnVpbGRlci5maXJzdENoaWxkXG5cbiAgICAgIC8vIHRpdGxlXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnRpdGxlICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kaWFsb2ctdGl0bGUnKS5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMudGl0bGVcbiAgICAgIH1cblxuICAgICAgLy8gbWVzc2FnZVxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5tZXNzYWdlICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kaWFsb2ctYm9keScpLmZpcnN0Q2hpbGQuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLm1lc3NhZ2VcbiAgICAgIH1cblxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLm9wdGlvbnMuZWxlbWVudClcblxuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGVzKClcbiAgICB9XG5cbiAgICBidWlsZEJhY2tkcm9wKCkge1xuICAgICAgY29uc3QgYmFja2Ryb3AgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgYmFja2Ryb3Auc2V0QXR0cmlidXRlKCdkYXRhLWlkJywgdGhpcy5pZClcbiAgICAgIGJhY2tkcm9wLmNsYXNzTGlzdC5hZGQoQkFDS0RST1BfU0VMRUNUT1IpXG5cbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYmFja2Ryb3ApXG4gICAgfVxuXG4gICAgZ2V0QmFja2Ryb3AoKSB7XG4gICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLiR7QkFDS0RST1BfU0VMRUNUT1J9W2RhdGEtaWQ9XCIke3RoaXMuaWR9XCJdYClcbiAgICB9XG5cbiAgICBjZW50ZXIoKSB7XG4gICAgICBjb25zdCBjb21wdXRlZFN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5vcHRpb25zLmVsZW1lbnQpXG4gICAgICAvLyBjb25zdCB3aWR0aCA9IGNvbXB1dGVkU3R5bGUud2lkdGguc2xpY2UoMCwgY29tcHV0ZWRTdHlsZS53aWR0aC5sZW5ndGggLSAyKVxuICAgICAgY29uc3QgaGVpZ2h0ID0gY29tcHV0ZWRTdHlsZS5oZWlnaHQuc2xpY2UoMCwgY29tcHV0ZWRTdHlsZS5oZWlnaHQubGVuZ3RoIC0gMilcblxuICAgICAgY29uc3QgdG9wID0gKHdpbmRvdy5pbm5lckhlaWdodCAvIDIpIC0gKGhlaWdodCAvIDIpXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5zdHlsZS50b3AgPSBgJHt0b3B9cHhgXG4gICAgfVxuXG4gICAgc2hvdygpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuZWxlbWVudCA9PT0gbnVsbCkge1xuICAgICAgICAvLyBidWlsZCBhbmQgaW5zZXJ0IGEgbmV3IERPTSBlbGVtZW50XG4gICAgICAgIHRoaXMuYnVpbGQoKVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93JykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIC8vIGFkZCBhIHRpbWVvdXQgc28gdGhhdCB0aGUgQ1NTIGFuaW1hdGlvbiB3b3Jrc1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LlNIT1cpXG4gICAgICAgIHRoaXMuYnVpbGRCYWNrZHJvcCgpXG5cbiAgICAgICAgY29uc3Qgb25TaG93biA9ICgpID0+IHtcbiAgICAgICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5TSE9XTilcbiAgICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKEV2ZW50LlRSQU5TSVRJT05fRU5ELCBvblNob3duKVxuXG4gICAgICAgICAgLy8gYXR0YWNoIGV2ZW50XG4gICAgICAgICAgdGhpcy5hdHRhY2hFdmVudHMoKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFdmVudC5UUkFOU0lUSU9OX0VORCwgb25TaG93bilcblxuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdzaG93JylcblxuICAgICAgICB0aGlzLmNlbnRlcigpXG4gICAgICB9LCAxKVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIG9uRWxlbWVudEV2ZW50KGV2ZW50KSB7XG4gICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2tleXVwJyAmJiBldmVudC5rZXlDb2RlICE9PSAyNyAmJiBldmVudC5rZXlDb2RlICE9PSAxMykge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgLy8gaGlkZSB0aGUgZGlhbG9nXG4gICAgICB0aGlzLmhpZGUoKVxuICAgIH1cblxuICAgIGhpZGUoKSB7XG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnc2hvdycpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5ISURFKVxuXG4gICAgICB0aGlzLmRldGFjaEV2ZW50cygpXG5cbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hpZGUnKVxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpXG5cbiAgICAgIGNvbnN0IGJhY2tkcm9wID0gdGhpcy5nZXRCYWNrZHJvcCgpXG5cbiAgICAgIGNvbnN0IG9uSGlkZGVuID0gKCkgPT4ge1xuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGJhY2tkcm9wKVxuXG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKVxuXG4gICAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LkhJRERFTilcblxuICAgICAgICBiYWNrZHJvcC5yZW1vdmVFdmVudExpc3RlbmVyKEV2ZW50LlRSQU5TSVRJT05fRU5ELCBvbkhpZGRlbilcblxuICAgICAgICAvLyByZW1vdmUgZ2VuZXJhdGVkIGRpYWxvZ3MgZnJvbSB0aGUgRE9NXG4gICAgICAgIGlmICh0aGlzLmR5bmFtaWNFbGVtZW50KSB7XG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0aGlzLm9wdGlvbnMuZWxlbWVudClcbiAgICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudCA9IG51bGxcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBiYWNrZHJvcC5hZGRFdmVudExpc3RlbmVyKEV2ZW50LlRSQU5TSVRJT05fRU5ELCBvbkhpZGRlbilcbiAgICAgIGJhY2tkcm9wLmNsYXNzTGlzdC5hZGQoJ2ZhZGVvdXQnKVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGF0dGFjaEV2ZW50cygpIHtcbiAgICAgIGNvbnN0IGRpc21pc3NCdXR0b25zID0gdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtZGlzbWlzc10nKVxuICAgICAgaWYgKGRpc21pc3NCdXR0b25zKSB7XG4gICAgICAgIGRpc21pc3NCdXR0b25zLmZvckVhY2goYnV0dG9uID0+IHRoaXMucmVnaXN0ZXJFbGVtZW50KHsgdGFyZ2V0OiBidXR0b24sIGV2ZW50OiAnY2xpY2snIH0pKVxuICAgICAgfVxuXG4gICAgICAvLyBhZGQgZXZlbnRzIGlmIHRoZSBkaWFsb2cgaXMgY2FuY2VsYWJsZVxuICAgICAgLy8gd2hpY2ggbWVhbnMgdGhlIHVzZXIgY2FuIGhpZGUgdGhlIGRpYWxvZ1xuICAgICAgLy8gYnkgcHJlc3NpbmcgdGhlIEVTQyBrZXkgb3IgY2xpY2sgb3V0c2lkZSB0aGUgYmFja2Ryb3BcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuY2FuY2VsYWJsZSkge1xuICAgICAgICBjb25zdCBiYWNrZHJvcCA9IHRoaXMuZ2V0QmFja2Ryb3AoKVxuICAgICAgICB0aGlzLnJlZ2lzdGVyRWxlbWVudCh7IHRhcmdldDogYmFja2Ryb3AsIGV2ZW50OiBFdmVudC5TVEFSVCB9KVxuICAgICAgICB0aGlzLnJlZ2lzdGVyRWxlbWVudCh7IHRhcmdldDogZG9jdW1lbnQsIGV2ZW50OiAna2V5dXAnIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgZGV0YWNoRXZlbnRzKCkge1xuICAgICAgY29uc3QgZGlzbWlzc0J1dHRvbnMgPSB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1kaXNtaXNzXScpXG4gICAgICBpZiAoZGlzbWlzc0J1dHRvbnMpIHtcbiAgICAgICAgZGlzbWlzc0J1dHRvbnMuZm9yRWFjaChidXR0b24gPT4gdGhpcy51bnJlZ2lzdGVyRWxlbWVudCh7IHRhcmdldDogYnV0dG9uLCBldmVudDogJ2NsaWNrJyB9KSlcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5jYW5jZWxhYmxlKSB7XG4gICAgICAgIGNvbnN0IGJhY2tkcm9wID0gdGhpcy5nZXRCYWNrZHJvcCgpXG4gICAgICAgIHRoaXMudW5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IGJhY2tkcm9wLCBldmVudDogRXZlbnQuU1RBUlQgfSlcbiAgICAgICAgdGhpcy51bnJlZ2lzdGVyRWxlbWVudCh7IHRhcmdldDogZG9jdW1lbnQsIGV2ZW50OiAna2V5dXAnIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIF9ET01JbnRlcmZhY2Uob3B0aW9ucykge1xuICAgICAgcmV0dXJuIHN1cGVyLl9ET01JbnRlcmZhY2UoRGlhbG9nLCBvcHRpb25zKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogRE9NIEFwaSBpbXBsZW1lbnRhdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG4gIGNvbnN0IGNvbXBvbmVudHMgPSBbXVxuXG4gIGNvbnN0IGRpYWxvZ3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuJHtOQU1FfWApXG4gIGlmIChkaWFsb2dzKSB7XG4gICAgZGlhbG9ncy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBjb25zdCBjb25maWcgPSBnZXRBdHRyaWJ1dGVzQ29uZmlnKGVsZW1lbnQsIERFRkFVTFRfUFJPUEVSVElFUywgREFUQV9BVFRSU19QUk9QRVJUSUVTKVxuICAgICAgY29uZmlnLmVsZW1lbnQgPSBlbGVtZW50XG5cbiAgICAgIGNvbXBvbmVudHMucHVzaCh7IGVsZW1lbnQsIGRpYWxvZzogbmV3IERpYWxvZyhjb25maWcpIH0pXG4gICAgfSlcbiAgfVxuXG4gIGlmIChkaWFsb2dzKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IGRhdGFUb2dnbGVBdHRyID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS10b2dnbGUnKVxuICAgICAgaWYgKGRhdGFUb2dnbGVBdHRyICYmIGRhdGFUb2dnbGVBdHRyID09PSBOQU1FKSB7XG4gICAgICAgIGNvbnN0IGlkID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS10YXJnZXQnKVxuICAgICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpZClcblxuICAgICAgICBjb25zdCBjb21wb25lbnQgPSBjb21wb25lbnRzLmZpbmQoYyA9PiBjLmVsZW1lbnQgPT09IGVsZW1lbnQpXG5cbiAgICAgICAgaWYgKCFjb21wb25lbnQpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGV2ZW50LnRhcmdldC5ibHVyKClcblxuICAgICAgICBjb21wb25lbnQuZGlhbG9nLnNob3coKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICByZXR1cm4gRGlhbG9nXG59KSgpXG5cbmV4cG9ydCBkZWZhdWx0IERpYWxvZ1xuIiwiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vcXVhcmstZGV2L1Bob25vbi1GcmFtZXdvcmsvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmltcG9ydCBDb21wb25lbnQgZnJvbSAnLi4vY29tcG9uZW50J1xuaW1wb3J0IEV2ZW50IGZyb20gJy4uLy4uL2NvcmUvZXZlbnRzJ1xuaW1wb3J0IHsgZmluZFRhcmdldEJ5Q2xhc3MgfSBmcm9tICcuLi8uLi9jb3JlL3V0aWxzJ1xuaW1wb3J0IHsgZ2V0QXR0cmlidXRlc0NvbmZpZyB9IGZyb20gJy4uL2NvbXBvbmVudE1hbmFnZXInXG5cbmNvbnN0IERyb3Bkb3duID0gKCgpID0+IHtcbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDb25zdGFudHNcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNvbnN0IE5BTUUgPSAnZHJvcGRvd24nXG4gIGNvbnN0IFZFUlNJT04gPSAnMi4wLjAnXG4gIGNvbnN0IERFRkFVTFRfUFJPUEVSVElFUyA9IHtcbiAgICBlbGVtZW50OiBudWxsLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gIH1cbiAgY29uc3QgREFUQV9BVFRSU19QUk9QRVJUSUVTID0gW1xuICAgICdkZWZhdWx0JyxcbiAgXVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY2xhc3MgRHJvcGRvd24gZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgICBzdXBlcihOQU1FLCBWRVJTSU9OLCBERUZBVUxUX1BST1BFUlRJRVMsIG9wdGlvbnMsIERBVEFfQVRUUlNfUFJPUEVSVElFUywgZmFsc2UsIGZhbHNlKVxuXG4gICAgICBjb25zdCBzZWxlY3RlZCA9IHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXNlbGVjdGVkXScpXG4gICAgICBjb25zdCBpdGVtID0gdGhpcy5nZXRJdGVtRGF0YShzZWxlY3RlZClcblxuICAgICAgdGhpcy5zZXRTZWxlY3RlZChpdGVtLnZhbHVlLCBpdGVtLnRleHQsIGZhbHNlKVxuICAgIH1cblxuICAgIHNldFBvc2l0aW9uKGJ1dHRvbikge1xuXG4gICAgfVxuXG4gICAgc2V0U2VsZWN0ZWQodmFsdWUgPSAnJywgdGV4dCA9IG51bGwsIGNoZWNrRXhpc3RzID0gdHJ1ZSkge1xuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuZGVmYXVsdCkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgbGV0IHRleHREaXNwbGF5ID0gdGV4dFxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLmRlZmF1bHQtdGV4dCcpLmlubmVySFRNTCA9IHRleHRcbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJoaWRkZW5cIl0nKS52YWx1ZSA9IHZhbHVlXG5cbiAgICAgIGlmIChjaGVja0V4aXN0cykge1xuICAgICAgICBsZXQgZm91bmQgPSBmYWxzZVxuICAgICAgICBjb25zdCBpdGVtcyA9IHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5pdGVtJylcbiAgICAgICAgaWYgKGl0ZW1zKSB7XG4gICAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5nZXRJdGVtRGF0YShpdGVtKVxuICAgICAgICAgICAgaWYgKHZhbHVlID09PSBkYXRhLnZhbHVlKSB7XG4gICAgICAgICAgICAgIC8vIHVwZGF0ZSB0aGUgdGV4dCB0byBkaXNwbGF5IGlmIGl0IGlzIG51bGwgb25seVxuICAgICAgICAgICAgICBpZiAodGV4dERpc3BsYXkgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0ZXh0RGlzcGxheSA9IGRhdGEudGV4dFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZVxuICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kZWZhdWx0LXRleHQnKS5pbm5lckhUTUwgPSB0ZXh0RGlzcGxheVxuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPVwiaGlkZGVuXCJdJykudmFsdWUgPSB2YWx1ZVxuXG4gICAgICAgIGlmICghZm91bmQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7TkFNRX0uIFRoZSB2YWx1ZSBcIiR7dmFsdWV9XCIgZG9lcyBub3QgZXhpc3QgaW4gdGhlIGxpc3Qgb2YgaXRlbXMuYClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGdldFNlbGVjdGVkKCkge1xuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJoaWRkZW5cIl0nKS52YWx1ZVxuICAgIH1cblxuICAgIGdldEl0ZW1EYXRhKGl0ZW0gPSBudWxsKSB7XG4gICAgICBsZXQgdGV4dCA9ICcnXG4gICAgICBsZXQgdmFsdWUgPSAnJ1xuXG4gICAgICBpZiAoaXRlbSkge1xuICAgICAgICB0ZXh0ID0gaXRlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGV4dCcpIHx8IGl0ZW0uaW5uZXJIVE1MXG5cbiAgICAgICAgY29uc3Qgc2VsZWN0ZWRUZXh0Tm9kZSA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLnRleHQnKVxuICAgICAgICBpZiAoc2VsZWN0ZWRUZXh0Tm9kZSkge1xuICAgICAgICAgIHRleHQgPSBzZWxlY3RlZFRleHROb2RlLmlubmVySFRNTFxuICAgICAgICB9XG5cbiAgICAgICAgdmFsdWUgPSBpdGVtLmdldEF0dHJpYnV0ZSgnZGF0YS12YWx1ZScpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7IHRleHQsIHZhbHVlIH1cbiAgICB9XG5cbiAgICBvbkVsZW1lbnRFdmVudChldmVudCkge1xuICAgICAgaWYgKGV2ZW50LnR5cGUgPT09IEV2ZW50LlNUQVJUKSB7XG4gICAgICAgIGNvbnN0IGRyb3Bkb3duID0gZmluZFRhcmdldEJ5Q2xhc3MoZXZlbnQudGFyZ2V0LCAnZHJvcGRvd24nKVxuICAgICAgICBpZiAoIWRyb3Bkb3duKSB7XG4gICAgICAgICAgdGhpcy5oaWRlKClcbiAgICAgICAgfVxuXG4gICAgICB9IGVsc2UgaWYgKGV2ZW50LnR5cGUgPT09ICdjbGljaycpIHtcbiAgICAgICAgY29uc3QgaXRlbSA9IGZpbmRUYXJnZXRCeUNsYXNzKGV2ZW50LnRhcmdldCwgJ2l0ZW0nKVxuXG4gICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgaWYgKGl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCdkaXNhYmxlZCcpKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBpdGVtSW5mbyA9IHRoaXMuZ2V0SXRlbURhdGEoaXRlbSlcbiAgICAgICAgICB0aGlzLnNldFNlbGVjdGVkKGl0ZW1JbmZvLnZhbHVlLCBpdGVtSW5mby50ZXh0LCBmYWxzZSlcblxuICAgICAgICAgIGNvbnN0IGRldGFpbCA9IHsgaXRlbSwgdGV4dDogaXRlbUluZm8udGV4dCwgdmFsdWU6IGl0ZW1JbmZvLnZhbHVlIH1cbiAgICAgICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5JVEVNX1NFTEVDVEVELCBkZXRhaWwpXG5cbiAgICAgICAgICB0aGlzLmhpZGUoKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gZG9uJ3QgdG9nZ2xlIHRoZSBkcm9wZG93biBpZiB0aGUgZXZlbnQgY29uY2VybnMgaGVhZGVycywgZGl2aWRlcnNcbiAgICAgICAgY29uc3QgZHJvcGRvd25NZW51ID0gZmluZFRhcmdldEJ5Q2xhc3MoZXZlbnQudGFyZ2V0LCAnZHJvcGRvd24tbWVudScpXG4gICAgICAgIGlmIChkcm9wZG93bk1lbnUpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudG9nZ2xlKClcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0b2dnbGUoKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5oaWRlKClcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuc2hvdygpXG4gICAgfVxuXG4gICAgc2hvdygpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuXG4gICAgICBjb25zdCBkcm9wZG93bk1lbnUgPSB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZHJvcGRvd24tbWVudScpXG5cbiAgICAgIC8vIHNjcm9sbCB0byB0b3BcbiAgICAgIGRyb3Bkb3duTWVudS5zY3JvbGxUb3AgPSAwXG5cbiAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LlNIT1cpXG4gICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5TSE9XTilcblxuICAgICAgdGhpcy5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IGRyb3Bkb3duTWVudSwgZXZlbnQ6ICdjbGljaycgfSkgICAgICBcbiAgICAgIHRoaXMucmVnaXN0ZXJFbGVtZW50KHsgdGFyZ2V0OiBkb2N1bWVudC5ib2R5LCBldmVudDogRXZlbnQuU1RBUlQgfSlcblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuXG4gICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5ISURFKVxuICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuSElEREVOKVxuXG4gICAgICB0aGlzLnVucmVnaXN0ZXJFbGVtZW50KHsgdGFyZ2V0OiB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZHJvcGRvd24tbWVudScpLCBldmVudDogJ2NsaWNrJyB9KSAgICAgIFxuICAgICAgdGhpcy51bnJlZ2lzdGVyRWxlbWVudCh7IHRhcmdldDogZG9jdW1lbnQuYm9keSwgZXZlbnQ6IEV2ZW50LlNUQVJUIH0pXG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgc3RhdGljIF9ET01JbnRlcmZhY2Uob3B0aW9ucykge1xuICAgICAgcmV0dXJuIHN1cGVyLl9ET01JbnRlcmZhY2UoRHJvcGRvd24sIG9wdGlvbnMpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBET00gQXBpIGltcGxlbWVudGF0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cbiAgY29uc3QgY29tcG9uZW50cyA9IFtdXG5cbiAgY29uc3QgZHJvcGRvd25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLiR7TkFNRX1gKVxuICBpZiAoZHJvcGRvd25zKSB7XG4gICAgZHJvcGRvd25zLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IGdldEF0dHJpYnV0ZXNDb25maWcoZWxlbWVudCwgREVGQVVMVF9QUk9QRVJUSUVTLCBEQVRBX0FUVFJTX1BST1BFUlRJRVMpXG4gICAgICBjb25maWcuZWxlbWVudCA9IGVsZW1lbnRcblxuICAgICAgY29tcG9uZW50cy5wdXNoKG5ldyBEcm9wZG93bihjb25maWcpKVxuICAgIH0pXG4gIH1cblxuICBpZiAoZHJvcGRvd25zKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IGRyb3Bkb3duTWVudSA9IGZpbmRUYXJnZXRCeUNsYXNzKGV2ZW50LnRhcmdldCwgJ2Ryb3Bkb3duLW1lbnUnKVxuICAgICAgaWYgKGRyb3Bkb3duTWVudSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgY29uc3QgZHJvcGRvd24gPSBmaW5kVGFyZ2V0QnlDbGFzcyhldmVudC50YXJnZXQsICdkcm9wZG93bicpXG5cbiAgICAgIGlmIChkcm9wZG93bikge1xuICAgICAgICBjb25zdCBkYXRhVG9nZ2xlQXR0ciA9IGRyb3Bkb3duLmdldEF0dHJpYnV0ZSgnZGF0YS10b2dnbGUnKVxuICAgICAgICBpZiAoZGF0YVRvZ2dsZUF0dHIgJiYgZGF0YVRvZ2dsZUF0dHIgPT09IE5BTUUgJiYgZHJvcGRvd24pIHtcbiAgICAgICAgICBjb25zdCBjb21wb25lbnQgPSBjb21wb25lbnRzLmZpbmQoYyA9PiBjLmdldEVsZW1lbnQoKSA9PT0gZHJvcGRvd24pXG5cbiAgICAgICAgICBpZiAoIWNvbXBvbmVudCkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29tcG9uZW50LnRvZ2dsZSgpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgcmV0dXJuIERyb3Bkb3duXG59KSgpXG5cbmV4cG9ydCBkZWZhdWx0IERyb3Bkb3duXG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuaW1wb3J0IENvbXBvbmVudCBmcm9tICcuLi9jb21wb25lbnQnXG5cbmNvbnN0IExvYWRlciA9ICgoKSA9PiB7XG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ29uc3RhbnRzXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjb25zdCBOQU1FID0gJ2xvYWRlcidcbiAgY29uc3QgVkVSU0lPTiA9ICcyLjAuMCdcbiAgY29uc3QgREVGQVVMVF9QUk9QRVJUSUVTID0ge1xuICAgIGVsZW1lbnQ6IG51bGwsXG4gICAgY29sb3I6IG51bGwsXG4gICAgc2l6ZTogbnVsbCxcbiAgfVxuICBjb25zdCBEQVRBX0FUVFJTX1BST1BFUlRJRVMgPSBbXVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY2xhc3MgTG9hZGVyIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgc3VwZXIoTkFNRSwgVkVSU0lPTiwgREVGQVVMVF9QUk9QRVJUSUVTLCBvcHRpb25zLCBEQVRBX0FUVFJTX1BST1BFUlRJRVMsIGZhbHNlLCBmYWxzZSlcblxuICAgICAgLy8gc2V0IGNvbG9yXG4gICAgICBjb25zdCBsb2FkZXJTcGlubmVyID0gdGhpcy5nZXRTcGlubmVyKClcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLmNvbG9yID09PSAnc3RyaW5nJ1xuICAgICAgICAmJiAhbG9hZGVyU3Bpbm5lci5jbGFzc0xpc3QuY29udGFpbnMoYGNvbG9yLSR7dGhpcy5vcHRpb25zLmNvbG9yfWApKSB7XG4gICAgICAgIGxvYWRlclNwaW5uZXIuY2xhc3NMaXN0LmFkZChgY29sb3ItJHt0aGlzLm9wdGlvbnMuY29sb3J9YClcbiAgICAgIH1cblxuICAgICAgdGhpcy5jdXN0b21TaXplID0gdGhpcy5vcHRpb25zLnNpemUgIT09IG51bGxcbiAgICB9XG5cbiAgICBnZXRDbGllbnRTaXplKCkge1xuICAgICAgaWYgKCF0aGlzLmN1c3RvbVNpemUpIHtcbiAgICAgICAgY29uc3Qgc2l6ZSA9IHRoaXMub3B0aW9ucy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpICAgICAgICBcbiAgICAgICAgcmV0dXJuIHNpemUuaGVpZ2h0XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuc2l6ZVxuICAgIH1cblxuICAgIGdldFNwaW5uZXIoKSB7XG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLmxvYWRlci1zcGlubmVyJylcbiAgICB9XG5cbiAgICBzaG93KCkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnaGlkZScpKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKVxuICAgICAgfVxuXG4gICAgICBjb25zdCBzaXplID0gdGhpcy5nZXRDbGllbnRTaXplKClcbiAgICAgIHRoaXMub3B0aW9ucy5zaXplID0gc2l6ZVxuXG4gICAgICBpZiAodGhpcy5jdXN0b21TaXplKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnN0eWxlLndpZHRoID0gYCR7dGhpcy5vcHRpb25zLnNpemV9cHhgXG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnN0eWxlLmhlaWdodCA9IGAke3RoaXMub3B0aW9ucy5zaXplfXB4YFxuXG4gICAgICAgIGNvbnN0IGxvYWRlclNwaW5uZXIgPSB0aGlzLmdldFNwaW5uZXIoKVxuICAgICAgICBsb2FkZXJTcGlubmVyLnN0eWxlLndpZHRoID0gYCR7dGhpcy5vcHRpb25zLnNpemV9cHhgXG4gICAgICAgIGxvYWRlclNwaW5uZXIuc3R5bGUuaGVpZ2h0ID0gYCR7dGhpcy5vcHRpb25zLnNpemV9cHhgXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgYW5pbWF0ZShzdGFydEFuaW1hdGlvbiA9IHRydWUpIHtcbiAgICAgIGlmIChzdGFydEFuaW1hdGlvbikge1xuICAgICAgICB0aGlzLnNob3coKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5oaWRlKClcbiAgICAgIH1cblxuICAgICAgY29uc3QgbG9hZGVyU3Bpbm5lciA9IHRoaXMuZ2V0U3Bpbm5lcigpXG5cbiAgICAgIGlmIChzdGFydEFuaW1hdGlvbiAmJlxuICAgICAgICAhbG9hZGVyU3Bpbm5lci5jbGFzc0xpc3QuY29udGFpbnMoJ2xvYWRlci1zcGlubmVyLWFuaW1hdGVkJykpIHtcbiAgICAgICAgbG9hZGVyU3Bpbm5lci5jbGFzc0xpc3QuYWRkKCdsb2FkZXItc3Bpbm5lci1hbmltYXRlZCcpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG5cbiAgICAgIGlmICghc3RhcnRBbmltYXRpb24gJiZcbiAgICAgICAgbG9hZGVyU3Bpbm5lci5jbGFzc0xpc3QuY29udGFpbnMoJ2xvYWRlci1zcGlubmVyLWFuaW1hdGVkJykpIHtcbiAgICAgICAgbG9hZGVyU3Bpbm5lci5jbGFzc0xpc3QucmVtb3ZlKCdsb2FkZXItc3Bpbm5lci1hbmltYXRlZCcpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgIGlmICghdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRlJykpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaGlkZScpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgc3RhdGljIF9ET01JbnRlcmZhY2Uob3B0aW9ucykge1xuICAgICAgcmV0dXJuIHN1cGVyLl9ET01JbnRlcmZhY2UoTG9hZGVyLCBvcHRpb25zKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBMb2FkZXJcbn0pKClcblxuZXhwb3J0IGRlZmF1bHQgTG9hZGVyXG4iLCIvKipcbiogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vcXVhcmstZGV2L1Bob25vbi1GcmFtZXdvcmsvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiovXG5pbXBvcnQgRXZlbnQgZnJvbSAnLi4vLi4vY29yZS9ldmVudHMnXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gJy4uL2NvbXBvbmVudCdcblxuY29uc3QgTm90aWZpY2F0aW9uID0gKCgpID0+IHtcbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAqIENvbnN0YW50c1xuICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAqL1xuXG4gIGNvbnN0IE5BTUUgPSAnbm90aWZpY2F0aW9uJ1xuICBjb25zdCBWRVJTSU9OID0gJzIuMC4wJ1xuICBjb25zdCBERUZBVUxUX1BST1BFUlRJRVMgPSB7XG4gICAgZWxlbWVudDogbnVsbCxcbiAgICBtZXNzYWdlOiAnJyxcbiAgICBzaG93QnV0dG9uOiB0cnVlLFxuICAgIHRpbWVvdXQ6IG51bGwsXG4gICAgYmFja2dyb3VuZDogJ3ByaW1hcnknLFxuICB9XG4gIGNvbnN0IERBVEFfQVRUUlNfUFJPUEVSVElFUyA9IFtcbiAgICAndGltZW91dCcsXG4gIF1cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENsYXNzIERlZmluaXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNsYXNzIE5vdGlmaWNhdGlvbiBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAgIHN1cGVyKE5BTUUsIFZFUlNJT04sIERFRkFVTFRfUFJPUEVSVElFUywgb3B0aW9ucywgREFUQV9BVFRSU19QUk9QRVJUSUVTLCB0cnVlLCBmYWxzZSlcblxuICAgICAgdGhpcy50ZW1wbGF0ZSA9ICcnICtcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJub3RpZmljYXRpb25cIj4nICtcbiAgICAgICAgICAnPGRpdiBjbGFzcz1cIm5vdGlmaWNhdGlvbi1pbm5lclwiPicgK1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJtZXNzYWdlXCI+PC9kaXY+JyArXG4gICAgICAgICAgICAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cIm5vdGlmaWNhdGlvblwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPicgK1xuICAgICAgICAgICAgICAnPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj4nICtcbiAgICAgICAgICAgICc8L2J1dHRvbj4nICtcbiAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICc8L2Rpdj4nXG5cbiAgICAgIGlmICh0aGlzLmR5bmFtaWNFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuYnVpbGQoKVxuICAgICAgfVxuXG4gICAgICB0aGlzLnRpbWVvdXRDYWxsYmFjayA9IG51bGxcbiAgICB9XG5cbiAgICBidWlsZCgpIHtcbiAgICAgIGNvbnN0IGJ1aWxkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXG4gICAgICBidWlsZGVyLmlubmVySFRNTCA9IHRoaXMudGVtcGxhdGVcblxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQgPSBidWlsZGVyLmZpcnN0Q2hpbGRcblxuICAgICAgLy8gdGV4dCBtZXNzYWdlXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcubWVzc2FnZScpLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5tZXNzYWdlXG5cbiAgICAgIGlmICghdGhpcy5vcHRpb25zLnNob3dCdXR0b24pIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignYnV0dG9uJykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgICAgfVxuXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMub3B0aW9ucy5lbGVtZW50KVxuXG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZXMoKVxuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmVsZW1lbnQgPT09IG51bGwpIHtcbiAgICAgICAgLy8gYnVpbGQgYW5kIGluc2VydCBhIG5ldyBET00gZWxlbWVudFxuICAgICAgICB0aGlzLmJ1aWxkKClcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnc2hvdycpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICAvLyByZXNldCBjb2xvclxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5iYWNrZ3JvdW5kKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnY2xhc3MnKVxuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ25vdGlmaWNhdGlvbicpXG5cbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChgYmctJHt0aGlzLm9wdGlvbnMuYmFja2dyb3VuZH1gKVxuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdidXR0b24nKS5jbGFzc0xpc3QuYWRkKGBidG4tJHt0aGlzLm9wdGlvbnMuYmFja2dyb3VuZH1gKVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnNob3dCdXR0b24pIHtcbiAgICAgICAgLy8gYXR0YWNoIHRoZSBidXR0b24gaGFuZGxlclxuICAgICAgICBjb25zdCBidXR0b25FbGVtZW50ID0gdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignYnV0dG9uJylcbiAgICAgICAgdGhpcy5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IGJ1dHRvbkVsZW1lbnQsIGV2ZW50OiAnY2xpY2snIH0pXG4gICAgICB9XG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdzaG93JylcbiAgICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuU0hPVylcblxuICAgICAgICBjb25zdCBvblNob3duID0gKCkgPT4ge1xuICAgICAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LlNIT1dOKVxuICAgICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoRXZlbnQuVFJBTlNJVElPTl9FTkQsIG9uU2hvd24pXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKEV2ZW50LlRSQU5TSVRJT05fRU5ELCBvblNob3duKVxuXG4gICAgICB9LCAxKVxuXG4gICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcih0aGlzLm9wdGlvbnMudGltZW91dCkgJiYgdGhpcy5vcHRpb25zLnRpbWVvdXQgPiAwKSB7XG4gICAgICAgIC8vIGlmIHRoZXJlIGlzIGEgdGltZW91dCwgYXV0byBoaWRlIHRoZSBub3RpZmljYXRpb25cbiAgICAgICAgdGhpcy50aW1lb3V0Q2FsbGJhY2sgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLmhpZGUoKVxuICAgICAgICB9LCB0aGlzLm9wdGlvbnMudGltZW91dCArIDEpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgIC8qXG4gICAgICAgKiBwcmV2ZW50IHRvIGNsb3NlIGEgbm90aWZpY2F0aW9uIHdpdGggYSB0aW1lb3V0XG4gICAgICAgKiBpZiB0aGUgdXNlciBoYXMgYWxyZWFkeSBjbGlja2VkIG9uIHRoZSBidXR0b25cbiAgICAgICAqL1xuICAgICAgaWYgKHRoaXMudGltZW91dENhbGxiYWNrKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRDYWxsYmFjaylcbiAgICAgICAgdGhpcy50aW1lb3V0Q2FsbGJhY2sgPSBudWxsXG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93JykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LkhJREUpXG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0J1dHRvbikge1xuICAgICAgICBjb25zdCBidXR0b25FbGVtZW50ID0gdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignYnV0dG9uJylcbiAgICAgICAgdGhpcy51bnJlZ2lzdGVyRWxlbWVudCh7IHRhcmdldDogYnV0dG9uRWxlbWVudCwgZXZlbnQ6ICdjbGljaycgfSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoaWRlJylcblxuICAgICAgY29uc3Qgb25IaWRkZW4gPSAoKSA9PiB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoRXZlbnQuVFJBTlNJVElPTl9FTkQsIG9uSGlkZGVuKVxuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJylcblxuICAgICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5ISURERU4pXG5cbiAgICAgICAgaWYgKHRoaXMuZHluYW1pY0VsZW1lbnQpIHtcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRoaXMub3B0aW9ucy5lbGVtZW50KVxuICAgICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50ID0gbnVsbFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoRXZlbnQuVFJBTlNJVElPTl9FTkQsIG9uSGlkZGVuKVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIG9uRWxlbWVudEV2ZW50KCkge1xuICAgICAgdGhpcy5oaWRlKClcbiAgICB9XG5cbiAgICBzdGF0aWMgX0RPTUludGVyZmFjZShvcHRpb25zKSB7XG4gICAgICByZXR1cm4gc3VwZXIuX0RPTUludGVyZmFjZShOb3RpZmljYXRpb24sIG9wdGlvbnMpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIE5vdGlmaWNhdGlvblxufSkoKVxuXG5leHBvcnQgZGVmYXVsdCBOb3RpZmljYXRpb25cbiIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3F1YXJrLWRldi9QaG9ub24tRnJhbWV3b3JrL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5pbXBvcnQgRXZlbnQgZnJvbSAnLi4vLi4vY29yZS9ldmVudHMnXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gJy4uL2NvbXBvbmVudCdcbmltcG9ydCB7IGdldEF0dHJpYnV0ZXNDb25maWcgfSBmcm9tICcuLi9jb21wb25lbnRNYW5hZ2VyJ1xuaW1wb3J0IHsgZmluZFRhcmdldEJ5QXR0ciB9IGZyb20gJy4uLy4uL2NvcmUvdXRpbHMnXG5cbmNvbnN0IE9mZkNhbnZhcyA9ICgoKSA9PiB7XG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ29uc3RhbnRzXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjb25zdCBOQU1FID0gJ29mZi1jYW52YXMnXG4gIGNvbnN0IFZFUlNJT04gPSAnMi4wLjAnXG4gIGNvbnN0IEJBQ0tEUk9QX1NFTEVDVE9SID0gJ29mZi1jYW52YXMtYmFja2Ryb3AnXG4gIGNvbnN0IERFRkFVTFRfUFJPUEVSVElFUyA9IHtcbiAgICBlbGVtZW50OiBudWxsLFxuICAgIGFzaWRlOiB7XG4gICAgICBtZDogZmFsc2UsXG4gICAgICBsZzogZmFsc2UsXG4gICAgICB4bDogZmFsc2UsXG4gICAgfSxcbiAgfVxuICBjb25zdCBEQVRBX0FUVFJTX1BST1BFUlRJRVMgPSBbXG4gICAgJ2FzaWRlJyxcbiAgXVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY2xhc3MgT2ZmQ2FudmFzIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgc3VwZXIoTkFNRSwgVkVSU0lPTiwgREVGQVVMVF9QUk9QRVJUSUVTLCBvcHRpb25zLCBEQVRBX0FUVFJTX1BST1BFUlRJRVMsIGZhbHNlLCB0cnVlKVxuXG4gICAgICB0aGlzLnVzZUJhY2tkcm9wID0gdHJ1ZVxuICAgICAgdGhpcy5jdXJyZW50V2lkdGggPSBudWxsXG4gICAgICB0aGlzLmFuaW1hdGUgPSB0cnVlXG5cbiAgICAgIGNvbnN0IHNtID0geyBuYW1lOiAnc20nLCBtZWRpYTogd2luZG93Lm1hdGNoTWVkaWEoJyhtaW4td2lkdGg6IDFweCknKSB9XG4gICAgICBjb25zdCBtZCA9IHsgbmFtZTogJ21kJywgbWVkaWE6IHdpbmRvdy5tYXRjaE1lZGlhKCcobWluLXdpZHRoOiA3NjhweCknKSB9XG4gICAgICBjb25zdCBsZyA9IHsgbmFtZTogJ2xnJywgbWVkaWE6IHdpbmRvdy5tYXRjaE1lZGlhKCcobWluLXdpZHRoOiA5OTJweCknKSB9XG4gICAgICBjb25zdCB4bCA9IHsgbmFtZTogJ3hsJywgbWVkaWE6IHdpbmRvdy5tYXRjaE1lZGlhKCcobWluLXdpZHRoOiAxMjAwcHgpJykgfVxuXG4gICAgICBjb25zdCBzaXplcyA9IFtzbSwgbWQsIGxnLCB4bF0ucmV2ZXJzZSgpXG5cbiAgICAgIGNvbnN0IGNoZWNrV2lkdGggPSAoKSA9PiB7XG4gICAgICAgIGlmICghKCdtYXRjaE1lZGlhJyBpbiB3aW5kb3cpKSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBzaXplcy5ldmVyeSgoc2l6ZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IG1hdGNoID0gc2l6ZS5tZWRpYS5tZWRpYS5tYXRjaCgvW2Etel0/LXdpZHRoOlxccz8oWzAtOV0rKS8pXG5cbiAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgIGlmIChzaXplLm1lZGlhLm1hdGNoZXMpIHtcbiAgICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFdpZHRoICE9PSBzaXplLm5hbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEFzaWRlKHNpemUubmFtZSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRXaWR0aCA9IHNpemUubmFtZVxuICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBjaGVja1dpZHRoKClcblxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGNoZWNrV2lkdGgsIGZhbHNlKSAgICAgIFxuICAgIH1cblxuICAgIHByZXZlbnRDbG9zYWJsZSgpIHtcbiAgICAgIHJldHVybiBzdXBlci5wcmV2ZW50Q2xvc2FibGUoKSB8fCB0aGlzLm9wdGlvbnMuYXNpZGVbdGhpcy5jdXJyZW50V2lkdGhdID09PSB0cnVlXG4gICAgfVxuXG4gICAgc2V0QXNpZGUobmFtZSkge1xuICAgICAgY29uc3QgY29udGVudCA9IGRvY3VtZW50LmJvZHlcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5hc2lkZVtuYW1lXSA9PT0gdHJ1ZSkge1xuICAgICAgICBpZiAoIWNvbnRlbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdvZmYtY2FudmFzLWFzaWRlJykpIHtcbiAgICAgICAgICBjb250ZW50LmNsYXNzTGlzdC5hZGQoJ29mZi1jYW52YXMtYXNpZGUnKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51c2VCYWNrZHJvcCA9IGZhbHNlXG5cbiAgICAgICAgLy8gYXZvaWQgYW5pbWF0aW9uIGJ5IHNldHRpbmcgYW5pbWF0ZSB0byBmYWxzZVxuICAgICAgICB0aGlzLmFuaW1hdGUgPSBmYWxzZVxuICAgICAgICB0aGlzLnNob3coKVxuICAgICAgICAvLyByZW1vdmUgcHJldmlvdXMgYmFja2Ryb3BcbiAgICAgICAgdGhpcy5yZW1vdmVCYWNrZHJvcCgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoY29udGVudC5jbGFzc0xpc3QuY29udGFpbnMoJ29mZi1jYW52YXMtYXNpZGUnKSkge1xuICAgICAgICAgIGNvbnRlbnQuY2xhc3NMaXN0LnJlbW92ZSgnb2ZmLWNhbnZhcy1hc2lkZScpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmhpZGUoKVxuICAgICAgICB0aGlzLnVzZUJhY2tkcm9wID0gdHJ1ZVxuICAgICAgICB0aGlzLmFuaW1hdGUgPSB0cnVlXG4gICAgICB9XG4gICAgfVxuXG4gICAgb25FbGVtZW50RXZlbnQoZXZlbnQpIHtcbiAgICAgIGlmIChldmVudC50eXBlID09PSAna2V5dXAnICYmIGV2ZW50LmtleUNvZGUgIT09IDI3ICYmIGV2ZW50LmtleUNvZGUgIT09IDEzKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICAvLyBoaWRlIHRoZSBvZmYtY2FudmFzXG4gICAgICB0aGlzLmhpZGUoKVxuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93JykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIC8vIGFkZCBhIHRpbWVvdXQgc28gdGhhdCB0aGUgQ1NTIGFuaW1hdGlvbiB3b3Jrc1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LlNIT1cpXG5cbiAgICAgICAgY29uc3Qgb25TaG93biA9ICgpID0+IHtcbiAgICAgICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5TSE9XTilcblxuICAgICAgICAgIGlmICh0aGlzLmFuaW1hdGUpIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoRXZlbnQuVFJBTlNJVElPTl9FTkQsIG9uU2hvd24pXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdhbmltYXRlJylcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy51c2VCYWNrZHJvcCkge1xuICAgICAgICAgIHRoaXMuY3JlYXRlQmFja2Ryb3AoKVxuICAgICAgICB9XG5cblxuICAgICAgICBpZiAodGhpcy5hbmltYXRlKSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFdmVudC5UUkFOU0lUSU9OX0VORCwgb25TaG93bikgICAgICAgIFxuICAgICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FuaW1hdGUnKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGRpcmVjdGx5IHRyaWdnZXIgdGhlIG9uU2hvd25cbiAgICAgICAgICBvblNob3duKClcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3Nob3cnKSAgICAgICAgXG5cbiAgICAgICAgLy8gYXR0YWNoIGV2ZW50XG4gICAgICAgIHRoaXMuYXR0YWNoRXZlbnRzKClcbiAgICAgIH0sIDEpXG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgIGlmICghdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93JykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LkhJREUpXG5cbiAgICAgIHRoaXMuZGV0YWNoRXZlbnRzKClcblxuICAgICAgaWYgKHRoaXMuYW5pbWF0ZSkge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhbmltYXRlJylcbiAgICAgIH1cblxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpXG5cbiAgICAgIGlmICh0aGlzLnVzZUJhY2tkcm9wKSB7XG4gICAgICAgIGNvbnN0IGJhY2tkcm9wID0gdGhpcy5nZXRCYWNrZHJvcCgpXG5cbiAgICAgICAgY29uc3Qgb25IaWRkZW4gPSAoKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuYW5pbWF0ZSkge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnYW5pbWF0ZScpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYmFja2Ryb3AucmVtb3ZlRXZlbnRMaXN0ZW5lcihFdmVudC5UUkFOU0lUSU9OX0VORCwgb25IaWRkZW4pXG4gICAgICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuSElEREVOKSAgICAgICAgXG4gICAgICAgICAgdGhpcy5yZW1vdmVCYWNrZHJvcCgpXG4gICAgICAgIH1cblxuICAgICAgICBiYWNrZHJvcC5hZGRFdmVudExpc3RlbmVyKEV2ZW50LlRSQU5TSVRJT05fRU5ELCBvbkhpZGRlbilcbiAgICAgICAgYmFja2Ryb3AuY2xhc3NMaXN0LmFkZCgnZmFkZW91dCcpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgY3JlYXRlQmFja2Ryb3AoKSB7XG4gICAgICBjb25zdCBiYWNrZHJvcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICBiYWNrZHJvcC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnLCB0aGlzLmlkKVxuICAgICAgYmFja2Ryb3AuY2xhc3NMaXN0LmFkZChCQUNLRFJPUF9TRUxFQ1RPUilcblxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChiYWNrZHJvcClcbiAgICB9XG5cbiAgICBnZXRCYWNrZHJvcCgpIHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuJHtCQUNLRFJPUF9TRUxFQ1RPUn1bZGF0YS1pZD1cIiR7dGhpcy5pZH1cIl1gKVxuICAgIH1cblxuICAgIHJlbW92ZUJhY2tkcm9wKCkge1xuICAgICAgY29uc3QgYmFja2Ryb3AgPSB0aGlzLmdldEJhY2tkcm9wKClcbiAgICAgIGlmIChiYWNrZHJvcCkge1xuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGJhY2tkcm9wKVxuICAgICAgfVxuICAgIH1cblxuICAgIGF0dGFjaEV2ZW50cygpIHtcbiAgICAgIGNvbnN0IGRpc21pc3NCdXR0b25zID0gdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtZGlzbWlzc10nKVxuXG4gICAgICBpZiAoZGlzbWlzc0J1dHRvbnMpIHtcbiAgICAgICAgZGlzbWlzc0J1dHRvbnMuZm9yRWFjaChidXR0b24gPT4gdGhpcy5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IGJ1dHRvbiwgZXZlbnQ6ICdjbGljaycgfSkpXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnVzZUJhY2tkcm9wKSB7XG4gICAgICAgIGNvbnN0IGJhY2tkcm9wID0gdGhpcy5nZXRCYWNrZHJvcCgpICAgICAgXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFbGVtZW50KHsgdGFyZ2V0OiBiYWNrZHJvcCwgZXZlbnQ6IEV2ZW50LlNUQVJUIH0pXG4gICAgICB9XG5cbiAgICAgIHRoaXMucmVnaXN0ZXJFbGVtZW50KHsgdGFyZ2V0OiBkb2N1bWVudCwgZXZlbnQ6ICdrZXl1cCcgfSlcbiAgICB9XG5cbiAgICBkZXRhY2hFdmVudHMoKSB7XG4gICAgICBjb25zdCBkaXNtaXNzQnV0dG9ucyA9IHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWRpc21pc3NdJylcblxuICAgICAgaWYgKGRpc21pc3NCdXR0b25zKSB7XG4gICAgICAgIGRpc21pc3NCdXR0b25zLmZvckVhY2goYnV0dG9uID0+IHRoaXMudW5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IGJ1dHRvbiwgZXZlbnQ6ICdjbGljaycgfSkpXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnVzZUJhY2tkcm9wKSB7XG4gICAgICAgIGNvbnN0IGJhY2tkcm9wID0gdGhpcy5nZXRCYWNrZHJvcCgpXG4gICAgICAgIHRoaXMudW5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IGJhY2tkcm9wLCBldmVudDogRXZlbnQuU1RBUlQgfSlcbiAgICAgIH1cblxuICAgICAgdGhpcy51bnJlZ2lzdGVyRWxlbWVudCh7IHRhcmdldDogZG9jdW1lbnQsIGV2ZW50OiAna2V5dXAnIH0pXG4gICAgfVxuXG4gICAgc3RhdGljIF9ET01JbnRlcmZhY2Uob3B0aW9ucykge1xuICAgICAgcmV0dXJuIHN1cGVyLl9ET01JbnRlcmZhY2UoT2ZmQ2FudmFzLCBvcHRpb25zKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogRE9NIEFwaSBpbXBsZW1lbnRhdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG4gIGNvbnN0IGNvbXBvbmVudHMgPSBbXVxuXG4gIGNvbnN0IG9mZkNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke05BTUV9YClcbiAgaWYgKG9mZkNhbnZhcykge1xuICAgIG9mZkNhbnZhcy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBjb25zdCBjb25maWcgPSBnZXRBdHRyaWJ1dGVzQ29uZmlnKGVsZW1lbnQsIERFRkFVTFRfUFJPUEVSVElFUywgREFUQV9BVFRSU19QUk9QRVJUSUVTKVxuICAgICAgY29uZmlnLmVsZW1lbnQgPSBlbGVtZW50XG5cbiAgICAgIGNvbXBvbmVudHMucHVzaCh7IGVsZW1lbnQsIG9mZkNhbnZhczogbmV3IE9mZkNhbnZhcyhjb25maWcpIH0pXG4gICAgfSlcbiAgfVxuXG4gIGlmIChvZmZDYW52YXMpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgY29uc3QgdGFyZ2V0ID0gZmluZFRhcmdldEJ5QXR0cihldmVudC50YXJnZXQsICdkYXRhLXRvZ2dsZScpXG4gICAgICBpZiAoIXRhcmdldCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgY29uc3QgZGF0YVRvZ2dsZUF0dHIgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvZ2dsZScpXG4gICAgICBpZiAoZGF0YVRvZ2dsZUF0dHIgJiYgZGF0YVRvZ2dsZUF0dHIgPT09IE5BTUUpIHtcbiAgICAgICAgY29uc3QgaWQgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXRhcmdldCcpXG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGlkKVxuXG4gICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGNvbXBvbmVudHMuZmluZChjID0+IGMuZWxlbWVudCA9PT0gZWxlbWVudClcblxuICAgICAgICBpZiAoIWNvbXBvbmVudCkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgdGFyZ2V0LmJsdXIoKVxuXG4gICAgICAgIGNvbXBvbmVudC5vZmZDYW52YXMuc2hvdygpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHJldHVybiBPZmZDYW52YXNcbn0pKClcblxuZXhwb3J0IGRlZmF1bHQgT2ZmQ2FudmFzXG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuaW1wb3J0IENvbXBvbmVudCBmcm9tICcuLi9jb21wb25lbnQnXG5pbXBvcnQgRXZlbnQgZnJvbSAnLi4vLi4vY29yZS9ldmVudHMnXG5cbmNvbnN0IFByb2dyZXNzID0gKCgpID0+IHtcbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDb25zdGFudHNcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNvbnN0IE5BTUUgPSAncHJvZ3Jlc3MnXG4gIGNvbnN0IFZFUlNJT04gPSAnMi4wLjAnXG4gIGNvbnN0IERFRkFVTFRfUFJPUEVSVElFUyA9IHtcbiAgICBlbGVtZW50OiBudWxsLFxuICAgIGhlaWdodDogNSxcbiAgICBtaW46IDAsXG4gICAgbWF4OiAxMDAsXG4gICAgbGFiZWw6IGZhbHNlLFxuICAgIHN0cmlwZWQ6IGZhbHNlLFxuICAgIGJhY2tncm91bmQ6IG51bGwsXG4gIH1cbiAgY29uc3QgREFUQV9BVFRSU19QUk9QRVJUSUVTID0gW1xuICAgICdoZWlnaHQnLFxuICAgICdtaW4nLFxuICAgICdtYXgnLFxuICAgICdsYWJlbCcsXG4gICAgJ3N0cmlwZWQnLFxuICAgICdiYWNrZ3JvdW5kJyxcbiAgXVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY2xhc3MgUHJvZ3Jlc3MgZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgICBzdXBlcihOQU1FLCBWRVJTSU9OLCBERUZBVUxUX1BST1BFUlRJRVMsIG9wdGlvbnMsIERBVEFfQVRUUlNfUFJPUEVSVElFUywgZmFsc2UsIGZhbHNlKVxuXG4gICAgICAvLyBzZXQgdGhlIHdhbnRlZCBoZWlnaHRcbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnN0eWxlLmhlaWdodCA9IGAke3RoaXMub3B0aW9ucy5oZWlnaHR9cHhgXG5cbiAgICAgIC8vIHNldCBtaW4gYW5kIG1heCB2YWx1ZXNcbiAgICAgIGNvbnN0IHByb2dyZXNzQmFyID0gdGhpcy5nZXRQcm9ncmVzc0JhcigpXG4gICAgICBwcm9ncmVzc0Jhci5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVtaW4nLCBgJHt0aGlzLm9wdGlvbnMubWlufWApXG4gICAgICBwcm9ncmVzc0Jhci5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVtYXgnLCBgJHt0aGlzLm9wdGlvbnMubWF4fWApXG5cbiAgICAgIC8vIHNldCBzdHJpcGVkXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnN0cmlwZWRcbiAgICAgICAgJiYgIXByb2dyZXNzQmFyLmNsYXNzTGlzdC5jb250YWlucygncHJvZ3Jlc3MtYmFyLXN0cmlwZWQnKSkge1xuICAgICAgICBwcm9ncmVzc0Jhci5jbGFzc0xpc3QuYWRkKCdwcm9ncmVzcy1iYXItc3RyaXBlZCcpXG4gICAgICB9XG5cbiAgICAgIC8vIHNldCBiYWNrZ3JvdW5kXG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5iYWNrZ3JvdW5kID09PSAnc3RyaW5nJ1xuICAgICAgICAmJiAhcHJvZ3Jlc3NCYXIuY2xhc3NMaXN0LmNvbnRhaW5zKGBiZy0ke3RoaXMub3B0aW9ucy5iYWNrZ3JvdW5kfWApKSB7XG4gICAgICAgIHByb2dyZXNzQmFyLmNsYXNzTGlzdC5hZGQoYGJnLSR7dGhpcy5vcHRpb25zLmJhY2tncm91bmR9YClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRQcm9ncmVzc0JhcigpIHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcucHJvZ3Jlc3MtYmFyJylcbiAgICB9XG5cbiAgICBzZXQodmFsdWUgPSAwKSB7XG4gICAgICBjb25zdCBwcm9ncmVzc0JhciA9IHRoaXMuZ2V0UHJvZ3Jlc3NCYXIoKVxuICAgICAgY29uc3QgcHJvZ3Jlc3MgPSBNYXRoLnJvdW5kKCh2YWx1ZSAvICh0aGlzLm9wdGlvbnMubWluICsgdGhpcy5vcHRpb25zLm1heCkpICogMTAwKVxuXG4gICAgICBpZiAodmFsdWUgPCB0aGlzLm9wdGlvbnMubWluKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYCR7TkFNRX0uIFdhcm5pbmcsICR7dmFsdWV9IGlzIHVuZGVyIG1pbiB2YWx1ZS5gKVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgaWYgKHZhbHVlID4gdGhpcy5vcHRpb25zLm1heCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKGAke05BTUV9LiBXYXJuaW5nLCAke3ZhbHVlfSBpcyBhYm92ZSBtYXggdmFsdWUuYCkgICAgICAgICAgXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICBwcm9ncmVzc0Jhci5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVub3cnLCBgJHt2YWx1ZX1gKSAgICAgIFxuXG4gICAgICAvLyBzZXQgbGFiZWxcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMubGFiZWwpIHtcbiAgICAgICAgcHJvZ3Jlc3NCYXIuaW5uZXJIVE1MID0gYCR7cHJvZ3Jlc3N9JWBcbiAgICAgIH1cblxuICAgICAgLy8gc2V0IHBlcmNlbnRhZ2VcbiAgICAgIHByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gYCR7cHJvZ3Jlc3N9JWBcblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBhbmltYXRlKHN0YXJ0QW5pbWF0aW9uID0gdHJ1ZSkge1xuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuc3RyaXBlZCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKGAke05BTUV9LiBBbmltYXRpb24gd29ya3Mgb25seSB3aXRoIHN0cmlwZWQgcHJvZ3Jlc3MuYClcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHByb2dyZXNzQmFyID0gdGhpcy5nZXRQcm9ncmVzc0JhcigpXG5cbiAgICAgIGlmIChzdGFydEFuaW1hdGlvblxuICAgICAgICAmJiAhcHJvZ3Jlc3NCYXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdwcm9ncmVzcy1iYXItYW5pbWF0ZWQnKSkge1xuICAgICAgICBwcm9ncmVzc0Jhci5jbGFzc0xpc3QuYWRkKCdwcm9ncmVzcy1iYXItYW5pbWF0ZWQnKVxuICAgICAgfVxuXG4gICAgICBpZiAoIXN0YXJ0QW5pbWF0aW9uXG4gICAgICAgICYmIHByb2dyZXNzQmFyLmNsYXNzTGlzdC5jb250YWlucygncHJvZ3Jlc3MtYmFyLWFuaW1hdGVkJykpIHtcbiAgICAgICAgcHJvZ3Jlc3NCYXIuY2xhc3NMaXN0LnJlbW92ZSgncHJvZ3Jlc3MtYmFyLWFuaW1hdGVkJylcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBzaG93KCkge1xuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gYCR7dGhpcy5vcHRpb25zLmhlaWdodH1weGBcbiAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LlNIT1cpXG4gICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5TSE9XTilcbiAgICAgIFxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gJzBweCdcbiAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LkhJREUpXG4gICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5ISURERU4pXG4gICAgICBcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgc3RhdGljIF9ET01JbnRlcmZhY2Uob3B0aW9ucykge1xuICAgICAgcmV0dXJuIHN1cGVyLl9ET01JbnRlcmZhY2UoUHJvZ3Jlc3MsIG9wdGlvbnMpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIFByb2dyZXNzXG59KSgpXG5cbmV4cG9ydCBkZWZhdWx0IFByb2dyZXNzXG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuaW1wb3J0IENvbXBvbmVudCBmcm9tICcuLi9jb21wb25lbnQnXG5pbXBvcnQgeyBnZXRBdHRyaWJ1dGVzQ29uZmlnIH0gZnJvbSAnLi4vY29tcG9uZW50TWFuYWdlcidcbmltcG9ydCBFdmVudCBmcm9tICcuLi8uLi9jb3JlL2V2ZW50cydcbmltcG9ydCB7IGZpbmRUYXJnZXRCeUNsYXNzIH0gZnJvbSAnLi4vLi4vY29yZS91dGlscydcblxuY29uc3QgVGFiID0gKCgpID0+IHtcbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDb25zdGFudHNcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNvbnN0IE5BTUUgPSAndGFiJ1xuICBjb25zdCBWRVJTSU9OID0gJzIuMC4wJ1xuICBjb25zdCBERUZBVUxUX1BST1BFUlRJRVMgPSB7XG5cbiAgfVxuICBjb25zdCBEQVRBX0FUVFJTX1BST1BFUlRJRVMgPSBbXG4gIF1cbiAgY29uc3QgVEFCX0NPTlRFTlRfU0VMRUNUT1IgPSAnLnRhYi1wYW5lJ1xuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY2xhc3MgVGFiIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgc3VwZXIoTkFNRSwgVkVSU0lPTiwgREVGQVVMVF9QUk9QRVJUSUVTLCBvcHRpb25zLCBEQVRBX0FUVFJTX1BST1BFUlRJRVMsIGZhbHNlLCBmYWxzZSlcbiAgICB9XG5cbiAgICBzaG93KCkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGlkID0gdGhpcy5vcHRpb25zLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJylcbiAgICAgIGNvbnN0IG5hdiA9IGZpbmRUYXJnZXRCeUNsYXNzKHRoaXMub3B0aW9ucy5lbGVtZW50LCAnbmF2JylcbiAgICAgIGNvbnN0IG5hdlRhYnMgPSBuYXYgPyBuYXYucXVlcnlTZWxlY3RvckFsbChgW2RhdGEtdG9nZ2xlPVwiJHtOQU1FfVwiXWApIDogbnVsbFxuXG4gICAgICBpZiAobmF2VGFicykge1xuICAgICAgICBuYXZUYWJzLmZvckVhY2goKHRhYikgPT4ge1xuICAgICAgICAgIGlmICh0YWIuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuICAgICAgICAgICAgdGFiLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICAgICAgfVxuICAgICAgICAgIHRhYi5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCBmYWxzZSlcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIHRydWUpXG5cbiAgICAgIGNvbnN0IHRhYkNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGlkKVxuICAgICAgY29uc3QgdGFiQ29udGVudHMgPSB0YWJDb250ZW50LnBhcmVudE5vZGUucXVlcnlTZWxlY3RvckFsbChUQUJfQ09OVEVOVF9TRUxFQ1RPUilcblxuICAgICAgaWYgKHRhYkNvbnRlbnRzKSB7XG4gICAgICAgIHRhYkNvbnRlbnRzLmZvckVhY2goKHRhYikgPT4ge1xuICAgICAgICAgIGlmICh0YWIuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuICAgICAgICAgICAgdGFiLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICB0YWJDb250ZW50LmNsYXNzTGlzdC5hZGQoJ3Nob3dpbmcnKVxuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgY29uc3Qgb25TaG93ZWQgPSAoKSA9PiB7XG4gICAgICAgICAgdGFiQ29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCdhbmltYXRlJylcbiAgICAgICAgICB0YWJDb250ZW50LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgICAgICAgdGFiQ29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93aW5nJylcbiAgICAgICAgICB0YWJDb250ZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoRXZlbnQuVFJBTlNJVElPTl9FTkQsIG9uU2hvd2VkKVxuICAgICAgICB9XG5cbiAgICAgICAgdGFiQ29udGVudC5hZGRFdmVudExpc3RlbmVyKEV2ZW50LlRSQU5TSVRJT05fRU5ELCBvblNob3dlZClcblxuICAgICAgICB0YWJDb250ZW50LmNsYXNzTGlzdC5hZGQoJ2FuaW1hdGUnKVxuXG4gICAgICB9LCAyMClcblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgfVxuXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCBmYWxzZSlcblxuICAgICAgY29uc3QgaWQgPSB0aGlzLm9wdGlvbnMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKVxuICAgICAgY29uc3QgdGFiQ29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoaWQpXG5cbiAgICAgIGlmICh0YWJDb250ZW50LmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcbiAgICAgICAgdGFiQ29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIHN0YXRpYyBfRE9NSW50ZXJmYWNlKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBzdXBlci5fRE9NSW50ZXJmYWNlKFRhYiwgb3B0aW9ucylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIERPTSBBcGkgaW1wbGVtZW50YXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuICBjb25zdCBjb21wb25lbnRzID0gW11cblxuICBjb25zdCB0YWJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgW2RhdGEtdG9nZ2xlPVwiJHtOQU1FfVwiXWApXG4gIGlmICh0YWJzKSB7XG4gICAgdGFicy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAvLyBjb25zdCBjb25maWcgPSB7fVxuICAgICAgY29uc3QgY29uZmlnID0gZ2V0QXR0cmlidXRlc0NvbmZpZyhlbGVtZW50LCBERUZBVUxUX1BST1BFUlRJRVMsIERBVEFfQVRUUlNfUFJPUEVSVElFUylcbiAgICAgIGNvbmZpZy5lbGVtZW50ID0gZWxlbWVudFxuXG4gICAgICBjb21wb25lbnRzLnB1c2goVGFiLl9ET01JbnRlcmZhY2UoY29uZmlnKSlcbiAgICB9KVxuICB9XG5cbiAgaWYgKHRhYnMpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgY29uc3QgZGF0YVRvZ2dsZUF0dHIgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvZ2dsZScpXG4gICAgICBpZiAoZGF0YVRvZ2dsZUF0dHIgJiYgZGF0YVRvZ2dsZUF0dHIgPT09IE5BTUUpIHtcbiAgICAgICAgY29uc3QgaWQgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdocmVmJylcblxuICAgICAgICBjb25zdCBjb21wb25lbnQgPSBjb21wb25lbnRzLmZpbmQoYyA9PiBjLmdldEVsZW1lbnQoKS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSA9PT0gaWQpXG5cbiAgICAgICAgaWYgKCFjb21wb25lbnQpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbXBvbmVudC5zaG93KClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgcmV0dXJuIFRhYlxufSkoKVxuXG5leHBvcnQgZGVmYXVsdCBUYWJcbiIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3F1YXJrLWRldi9QaG9ub24tRnJhbWV3b3JrL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmNvbnN0IEFqYXggPSAoKCkgPT4ge1xuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENvbnN0YW50c1xuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY29uc3QgTkFNRSA9ICdhamF4J1xuICBjb25zdCBWRVJTSU9OID0gJzIuMC4wJ1xuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY2xhc3MgQWpheCB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBBamF4LlxuICAgICAqIEBwYXJhbSB7e21ldGhvZDogc3RyaW5nLCB1cmw6IHN0cmluZywgY29tcGxldGU6IEZ1bmN0aW9uLCBzdWNjZXNzOiBGdW5jdGlvbiwgZXJyb3I6IEZ1bmN0aW9uLCBkYXRhOiBhbnksIGNyb3NzRG9tYWluOiBib29sZWFuLCBoZWFkZXJzOiB7W2hlYWRlcjogc3RyaW5nXTogc3RyaW5nfSwgdGltZW91dDogbnVtYmVyLCBjb250ZW50VHlwZTogbnVtYmVyLCBkYXRhVHlwZTogc3RyaW5nIH19IG9wdHNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICBpZiAodHlwZW9mIG9wdHMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtOQU1FfS0ke1ZFUlNJT059YClcbiAgICAgIH1cbiAgICAgIHRoaXMub3B0cyA9IG9wdHNcbiAgICAgIHRoaXMuZXJyb3JDb2RlID0gbnVsbFxuICAgIH1cblxuICAgIGNyZWF0ZVhocigpIHtcbiAgICAgIGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gICAgICBpZiAoJ3dpdGhDcmVkZW50aWFscycgaW4geGhyICYmIHRoaXMub3B0cy5jcm9zc0RvbWFpbiA9PT0gdHJ1ZSkge1xuICAgICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZVxuICAgICAgfVxuICAgICAgcmV0dXJuIHhoclxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCBoZWFkZXJzXG4gICAgICogQHBhcmFtIHt7W2hlYWRlcjogc3RyaW5nXTogc3RyaW5nfX0gaGVhZGVyc1xuICAgICAqL1xuICAgIHNldEhlYWRlcnMoaGVhZGVycyA9IHt9KSB7XG4gICAgICBmb3IgKGNvbnN0IGtleSBpbiBoZWFkZXJzKSB7XG4gICAgICAgIHRoaXMueGhyLnNldFJlcXVlc3RIZWFkZXIoa2V5LCBoZWFkZXJzW2tleV0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgb25QcmVFeGVjdXRlKCkge1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdHMuaGVhZGVycyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgdGhpcy5zZXRIZWFkZXJzKHRoaXMub3B0cy5oZWFkZXJzKVxuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0cy50aW1lb3V0ID09PSAnbnVtYmVyJykge1xuICAgICAgICB0aGlzLnhoci50aW1lb3V0ID0gdGhpcy5vcHRzLnRpbWVvdXRcbiAgICAgICAgdGhpcy54aHIub250aW1lb3V0ID0gKCkgPT4ge1xuICAgICAgICAgIHRoaXMuZXJyb3JDb2RlID0gJ1RJTUVPVVRfRVhDRUVERUQnXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdHMuY29udGVudFR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMuc2V0SGVhZGVycyh7ICdDb250ZW50LXR5cGUnOiB0aGlzLm9wdHMuY29udGVudFR5cGUgfSlcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub3B0cy5kYXRhVHlwZSA9PT0gJ3htbCcgJiYgdGhpcy54aHIub3ZlcnJpZGVNaW1lVHlwZSkge1xuICAgICAgICB0aGlzLnhoci5vdmVycmlkZU1pbWVUeXBlKCdhcHBsaWNhdGlvbi94bWw7IGNoYXJzZXQ9dXRmLTgnKVxuICAgICAgfVxuICAgIH1cblxuICAgIHBhcnNlUmVzcG9uc2UoKSB7XG4gICAgICBsZXQgcmVzcG9uc2UgPSBudWxsXG4gICAgICBpZiAodGhpcy5vcHRzLmRhdGFUeXBlID09PSAnanNvbicpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXNwb25zZSA9IEpTT04ucGFyc2UodGhpcy54aHIucmVzcG9uc2VUZXh0KVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIHRoaXMuZXJyb3JDb2RlID0gJ0pTT05fTUFMRk9STUVEJ1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMub3B0cy5kYXRhVHlwZSA9PT0gJ3htbCcpIHtcbiAgICAgICAgcmVzcG9uc2UgPSB0aGlzLnhoci5yZXNwb25zZVhNTFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzcG9uc2UgPSB0aGlzLnhoci5yZXNwb25zZVRleHRcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNwb25zZVxuICAgIH1cblxuICAgIHJ1blJlcXVlc3QoKSB7XG4gICAgICB0aGlzLnhociA9IHRoaXMuY3JlYXRlWGhyKClcbiAgICAgIHRoaXMueGhyLm9wZW4odGhpcy5vcHRzLm1ldGhvZCwgdGhpcy5vcHRzLnVybCwgdHJ1ZSlcbiAgICAgIHRoaXMub25QcmVFeGVjdXRlKClcblxuICAgICAgdGhpcy54aHIub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICBpZiAocGFyc2VJbnQodGhpcy54aHIucmVhZHlTdGF0ZSkgPT09IDQpIHtcbiAgICAgICAgICBjb25zdCBzdGF0dXMgPSB0aGlzLnhoci5zdGF0dXMudG9TdHJpbmcoKVxuXG4gICAgICAgICAgLy8gcmVzcG9uc2UgcmVjZWl2ZWRcbiAgICAgICAgICBpZiAodHlwZW9mIHRoaXMub3B0cy5jb21wbGV0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5vcHRzLmNvbXBsZXRlKHRoaXMuZXJyb3JDb2RlLCB0aGlzLnhocilcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBzdWNjZXNzIDJ4eFxuICAgICAgICAgIGlmIChzdGF0dXNbMF0gPT09ICcyJykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdHMuc3VjY2VzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICB0aGlzLm9wdHMuc3VjY2Vzcyh0aGlzLnBhcnNlUmVzcG9uc2UoKSwgdGhpcy54aHIpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBlcnJvciAoMXh4LCAyeHgsIDN4eCwgNXh4KVxuICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRzLmVycm9yID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAvLyBUaW1lb3V0IGluIG9yZGVyIHRvIHdhaXQgb24gdGhlIHRpbWVvdXQgbGltaXRcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5vcHRzLmVycm9yKHRoaXMuZXJyb3JDb2RlLCB0aGlzLnhocilcbiAgICAgICAgICAgIH0sIDEpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLnhoci5zZW5kKHRoaXMub3B0cy5kYXRhKVxuXG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIGNhbmNlbCgpIHtcbiAgICAgIHRoaXMuZXJyb3JDb2RlID0gJ0NBTkNFTEVEJ1xuICAgICAgaWYgKHRoaXMueGhyKSB7XG4gICAgICAgIHRoaXMueGhyLmFib3J0KClcbiAgICAgIH1cbiAgICAgIHRoaXMueGhyID0gbnVsbFxuICAgIH1cblxuICAgIC8vIGdldHRlcnNcblxuICAgIHN0YXRpYyBnZXQgdmVyc2lvbigpIHtcbiAgICAgIHJldHVybiBgJHtOQU1FfS4ke1ZFUlNJT059YFxuICAgIH1cblxuICAgIC8vIHB1YmxpY1xuXG4gICAgLy8gc3RhdGljXG4gICAgc3RhdGljIF9ET01JbnRlcmZhY2Uob3B0cykge1xuICAgICAgcmV0dXJuIG5ldyBBamF4KG9wdHMpLnJ1blJlcXVlc3QoKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBBamF4XG59KSgpXG5cbmV4cG9ydCBkZWZhdWx0IEFqYXhcbiIsImV4cG9ydCBmdW5jdGlvbiBkaXNwYXRjaFdpbkRvY0V2ZW50KGV2ZW50TmFtZSwgbW9kdWxlTmFtZSwgZGV0YWlsID0ge30pIHtcbiAgY29uc3QgZnVsbEV2ZW50TmFtZSA9IGAke2V2ZW50TmFtZX0ucGguJHttb2R1bGVOYW1lfWBcbiAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGZ1bGxFdmVudE5hbWUsIHsgZGV0YWlsIH0pKVxuICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChmdWxsRXZlbnROYW1lLCB7IGRldGFpbCB9KSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BhdGNoRWxlbWVudEV2ZW50KGRvbUVsZW1lbnQsIGV2ZW50TmFtZSwgbW9kdWxlTmFtZSwgZGV0YWlsID0ge30pIHtcbiAgY29uc3QgZnVsbEV2ZW50TmFtZSA9IGAke2V2ZW50TmFtZX0ucGguJHttb2R1bGVOYW1lfWBcbiAgZG9tRWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChmdWxsRXZlbnROYW1lLCB7IGRldGFpbCB9KSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BhdGNoUGFnZUV2ZW50KGV2ZW50TmFtZSwgcGFnZU5hbWUsIGRldGFpbCA9IHt9KSB7XG4gIGNvbnN0IGZ1bGxFdmVudE5hbWUgPSBgJHtwYWdlTmFtZX0uJHtldmVudE5hbWV9YFxuICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoZnVsbEV2ZW50TmFtZSwgeyBkZXRhaWwgfSkpXG4gIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGZ1bGxFdmVudE5hbWUsIHsgZGV0YWlsIH0pKVxufVxuIiwiLy8gQHRvZG8ga2VlcCA/XG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKCkgPT4ge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0FuIGVycm9yIGhhcyBvY2N1cmVkISBZb3UgY2FuIHBlbiBhbiBpc3N1ZSBoZXJlOiBodHRwczovL2dpdGh1Yi5jb20vcXVhcmstZGV2L1Bob25vbi1GcmFtZXdvcmsvaXNzdWVzJylcbiAgfSlcbn1cblxuLy8gVXNlIGF2YWlsYWJsZSBldmVudHNcbmxldCBhdmFpbGFibGVFdmVudHMgPSBbJ21vdXNlZG93bicsICdtb3VzZW1vdmUnLCAnbW91c2V1cCddXG5sZXQgdG91Y2hTY3JlZW4gPSBmYWxzZVxuXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgaWYgKCgnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cpIHx8IHdpbmRvdy5Eb2N1bWVudFRvdWNoICYmIGRvY3VtZW50IGluc3RhbmNlb2YgRG9jdW1lbnRUb3VjaCkge1xuICAgIHRvdWNoU2NyZWVuID0gdHJ1ZVxuICAgIGF2YWlsYWJsZUV2ZW50cyA9IFsndG91Y2hzdGFydCcsICd0b3VjaG1vdmUnLCAndG91Y2hlbmQnLCAndG91Y2hjYW5jZWwnXVxuICB9XG5cbiAgaWYgKHdpbmRvdy5uYXZpZ2F0b3IucG9pbnRlckVuYWJsZWQpIHtcbiAgICBhdmFpbGFibGVFdmVudHMgPSBbJ3BvaW50ZXJkb3duJywgJ3BvaW50ZXJtb3ZlJywgJ3BvaW50ZXJ1cCcsICdwb2ludGVyY2FuY2VsJ11cbiAgfSBlbHNlIGlmICh3aW5kb3cubmF2aWdhdG9yLm1zUG9pbnRlckVuYWJsZWQpIHtcbiAgICBhdmFpbGFibGVFdmVudHMgPSBbJ01TUG9pbnRlckRvd24nLCAnTVNQb2ludGVyTW92ZScsICdNU1BvaW50ZXJVcCcsICdNU1BvaW50ZXJDYW5jZWwnXVxuICB9XG59XG5cbmNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbmNvbnN0IHRyYW5zaXRpb25zID0gW1xuICB7IG5hbWU6ICd0cmFuc2l0aW9uJywgc3RhcnQ6ICd0cmFuc2l0aW9uc3RhcnQnLCBlbmQ6ICd0cmFuc2l0aW9uZW5kJyB9LFxuICB7IG5hbWU6ICdNb3pUcmFuc2l0aW9uJywgc3RhcnQ6ICd0cmFuc2l0aW9uc3RhcnQnLCBlbmQ6ICd0cmFuc2l0aW9uZW5kJyB9LFxuICB7IG5hbWU6ICdtc1RyYW5zaXRpb24nLCBzdGFydDogJ21zVHJhbnNpdGlvblN0YXJ0JywgZW5kOiAnbXNUcmFuc2l0aW9uRW5kJyB9LFxuICB7IG5hbWU6ICdXZWJraXRUcmFuc2l0aW9uJywgc3RhcnQ6ICd3ZWJraXRUcmFuc2l0aW9uU3RhcnQnLCBlbmQ6ICd3ZWJraXRUcmFuc2l0aW9uRW5kJyB9LFxuXVxuY29uc3QgYW5pbWF0aW9ucyA9IFtcbiAgeyBuYW1lOiAnYW5pbWF0aW9uJywgc3RhcnQ6ICdhbmltYXRpb25zdGFydCcsIGVuZDogJ2FuaW1hdGlvbmVuZCcgfSxcbiAgeyBuYW1lOiAnTW96QW5pbWF0aW9uJywgc3RhcnQ6ICdhbmltYXRpb25zdGFydCcsIGVuZDogJ2FuaW1hdGlvbmVuZCcgfSxcbiAgeyBuYW1lOiAnbXNBbmltYXRpb24nLCBzdGFydDogJ21zQW5pbWF0aW9uU3RhcnQnLCBlbmQ6ICdtc0FuaW1hdGlvbkVuZCcgfSxcbiAgeyBuYW1lOiAnV2Via2l0QW5pbWF0aW9uJywgc3RhcnQ6ICd3ZWJraXRBbmltYXRpb25TdGFydCcsIGVuZDogJ3dlYmtpdEFuaW1hdGlvbkVuZCcgfSxcbl1cblxuY29uc3QgdHJhbnNpdGlvblN0YXJ0ID0gdHJhbnNpdGlvbnMuZmluZCh0ID0+IGVsLnN0eWxlW3QubmFtZV0gIT09IHVuZGVmaW5lZCkuc3RhcnRcbmNvbnN0IHRyYW5zaXRpb25FbmQgPSB0cmFuc2l0aW9ucy5maW5kKHQgPT4gZWwuc3R5bGVbdC5uYW1lXSAhPT0gdW5kZWZpbmVkKS5lbmRcbmNvbnN0IGFuaW1hdGlvblN0YXJ0ID0gYW5pbWF0aW9ucy5maW5kKHQgPT4gZWwuc3R5bGVbdC5uYW1lXSAhPT0gdW5kZWZpbmVkKS5zdGFydFxuY29uc3QgYW5pbWF0aW9uRW5kID0gYW5pbWF0aW9ucy5maW5kKHQgPT4gZWwuc3R5bGVbdC5uYW1lXSAhPT0gdW5kZWZpbmVkKS5lbmRcblxuZXhwb3J0IGRlZmF1bHQge1xuICAvLyB0b3VjaCBzY3JlZW4gc3VwcG9ydFxuICBUT1VDSF9TQ1JFRU46IHRvdWNoU2NyZWVuLFxuXG4gIC8vIG5ldHdvcmtcbiAgTkVUV09SS19PTkxJTkU6ICdvbmxpbmUnLFxuICBORVRXT1JLX09GRkxJTkU6ICdvZmZsaW5lJyxcblxuICAvLyB1c2VyIGludGVyZmFjZSBzdGF0ZXNcbiAgU0hPVzogJ3Nob3cnLFxuICBTSE9XTjogJ3Nob3duJyxcbiAgSElERTogJ2hpZGUnLFxuICBISURERU46ICdoaWRkZW4nLFxuXG4gIC8vIGhhc2hcbiAgSEFTSDogJ2hhc2gnLFxuXG4gIC8vIHRvdWNoLCBtb3VzZSBhbmQgcG9pbnRlciBldmVudHMgcG9seWZpbGxcbiAgU1RBUlQ6IGF2YWlsYWJsZUV2ZW50c1swXSxcbiAgTU9WRTogYXZhaWxhYmxlRXZlbnRzWzFdLFxuICBFTkQ6IGF2YWlsYWJsZUV2ZW50c1syXSxcbiAgQ0FOQ0VMOiB0eXBlb2YgYXZhaWxhYmxlRXZlbnRzWzNdID09PSAndW5kZWZpbmVkJyA/IG51bGwgOiBhdmFpbGFibGVFdmVudHNbM10sXG5cbiAgLy8gdHJhbnNpdGlvbnNcbiAgVFJBTlNJVElPTl9TVEFSVDogdHJhbnNpdGlvblN0YXJ0LFxuICBUUkFOU0lUSU9OX0VORDogdHJhbnNpdGlvbkVuZCxcblxuICAvLyBhbmltYXRpb25zXG4gIEFOSU1BVElPTl9TVEFSVDogYW5pbWF0aW9uU3RhcnQsXG4gIEFOSU1BVElPTl9FTkQ6IGFuaW1hdGlvbkVuZCxcblxuICAvLyBkcm9wZG93blxuICBJVEVNX1NFTEVDVEVEOiAnaXRlbVNlbGVjdGVkJyxcbn0iLCIvKipcbiogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vcXVhcmstZGV2L1Bob25vbi1GcmFtZXdvcmsvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiovXG5cbmNvbnN0IEJpbmRlciA9ICgoKSA9PiB7XG4gIC8qKlxuICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAqIENvbnN0YW50c1xuICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAqL1xuXG4gIGNvbnN0IE5BTUUgPSAnaW50bC1iaW5kZXInXG4gIGNvbnN0IFZFUlNJT04gPSAnMi4wLjAnXG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDbGFzcyBEZWZpbml0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjbGFzcyBCaW5kZXIge1xuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIGRhdGEpIHtcbiAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnRcbiAgICAgIHRoaXMuZGF0YSA9IGRhdGFcblxuICAgICAgaWYgKCF0aGlzLmlzRWxlbWVudCh0aGlzLmVsZW1lbnQpKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICAvLyBhcnJheSBvZiBIVE1MRWxlbWVudFxuICAgICAgaWYgKHRoaXMuZWxlbWVudC5sZW5ndGggJiYgdGhpcy5lbGVtZW50Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhpcy5zZXROb2Rlcyh0aGlzLmVsZW1lbnQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBzaW5nbGUgSFRNTEVsZW1lbnRcbiAgICAgICAgdGhpcy5zZXROb2RlKHRoaXMuZWxlbWVudClcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBnZXR0ZXJzXG5cbiAgICBzdGF0aWMgZ2V0IHZlcnNpb24oKSB7XG4gICAgICByZXR1cm4gYCR7TkFNRX0uJHtWRVJTSU9OfWBcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgdGhlIGdpdmVuIGFyZ3VtZW50IGlzIGEgRE9NIGVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSB0aGUgYXJndW1lbnQgdG8gdGVzdFxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhlIG9iamVjdCBpcyBhIERPTSBlbGVtZW50LCBmYWxzZSBvdGhlcndpc2VcbiAgICAgKi9cbiAgICBpc0VsZW1lbnQoZWxlbWVudCkge1xuICAgICAgaWYgKGVsZW1lbnQgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgICByZXR1cm4gKHR5cGVvZiBOb2RlID09PSAnb2JqZWN0JyA/IGVsZW1lbnQgaW5zdGFuY2VvZiBOb2RlIDogZWxlbWVudCAmJiB0eXBlb2YgZWxlbWVudCA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIGVsZW1lbnQubm9kZVR5cGUgPT09ICdudW1iZXInICYmIHR5cGVvZiBlbGVtZW50Lm5vZGVOYW1lID09PSAnc3RyaW5nJylcbiAgICB9XG5cbiAgICAvKipcbiAgICAqIEJpbmRzIHNvbWUgdGV4dCB0byB0aGUgZ2l2ZW4gRE9NIGVsZW1lbnRcbiAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0XG4gICAgKi9cbiAgICBzZXRUZXh0KGVsZW1lbnQsIHRleHQpIHtcbiAgICAgIGlmICghKCd0ZXh0Q29udGVudCcgaW4gZWxlbWVudCkpIHtcbiAgICAgICAgZWxlbWVudC5pbm5lclRleHQgPSB0ZXh0XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50LnRleHRDb250ZW50ID0gdGV4dFxuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJpbmRzIHNvbWUgaHRtbCB0byB0aGUgZ2l2ZW4gRE9NIGVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiAgICAgKi9cbiAgICBzZXRIdG1sKGVsZW1lbnQsIHRleHQpIHtcbiAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gdGV4dFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJpbmRzIGN1c3RvbSBhdHRyaWJ1dGVzIHRvIHRoZSBnaXZlbiBET00gZWxlbWVudFxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYXR0clxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0XG4gICAgICovXG4gICAgc2V0QXR0cmlidXRlKGVsZW1lbnQsIGF0dHIsIHRleHQpIHtcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHIsIHRleHQpXG4gICAgfVxuXG4gICAgc2V0Tm9kZShlbGVtZW50KSB7XG4gICAgICBsZXQgYXR0ciA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWkxOG4nKVxuICAgICAgaWYgKCFhdHRyKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBhdHRyID0gYXR0ci50cmltKClcblxuICAgICAgY29uc3QgciA9IC8oPzpcXHN8XikoW0EtWmEtei1fMC05XSspOlxccyooLio/KSg/PVxccytcXHcrOnwkKS9nXG4gICAgICBsZXQgbVxuXG4gICAgICB3aGlsZSAobSA9IHIuZXhlYyhhdHRyKSkge1xuICAgICAgICBjb25zdCBrZXkgPSBtWzFdLnRyaW0oKVxuICAgICAgICBjb25zdCB2YWx1ZSA9IG1bMl0udHJpbSgpLnJlcGxhY2UoJywnLCAnJylcbiAgICAgICAgbGV0IGludGxWYWx1ZSA9IHRoaXMuZGF0YVt2YWx1ZV1cblxuICAgICAgICBpZiAoIXRoaXMuZGF0YVt2YWx1ZV0pIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgJHtOQU1FfS4gV2FybmluZywgJHt2YWx1ZX0gZG9lcyBub3QgZXhpc3QuYClcbiAgICAgICAgICBpbnRsVmFsdWUgPSB2YWx1ZVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbWV0aG9kTmFtZSA9ICdzZXQnICsga2V5LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsga2V5LnNsaWNlKDEpXG5cbiAgICAgICAgaWYgKHRoaXNbbWV0aG9kTmFtZV0pIHtcbiAgICAgICAgICB0aGlzW21ldGhvZE5hbWVdKGVsZW1lbnQsIGludGxWYWx1ZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShlbGVtZW50LCBrZXksIGludGxWYWx1ZSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICogU2V0IHZhbHVlcyB0byBET00gbm9kZXNcbiAgICAqL1xuICAgIHNldE5vZGVzKGVsZW1lbnQpIHtcbiAgICAgIGVsZW1lbnQuZm9yRWFjaChlbCA9PiB0aGlzLnNldE5vZGUoZWwpKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBCaW5kZXJcbn0pKClcblxuZXhwb3J0IGRlZmF1bHQgQmluZGVyXG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuaW1wb3J0IEJpbmRlciBmcm9tICcuL2JpbmRlcidcblxuY29uc3QgSW50bCA9ICgoKSA9PiB7XG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ29uc3RhbnRzXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjb25zdCBOQU1FID0gJ0ludGwnXG4gIGNvbnN0IFZFUlNJT04gPSAnMi4wLjAnXG4gIGNvbnN0IERFRkFVTFRfUFJPUEVSVElFUyA9IHtcbiAgICBmYWxsYmFja0xvY2FsZTogJ2VuJyxcbiAgICBsb2NhbGU6ICdlbicsXG4gICAgYXV0b0JpbmQ6IHRydWUsXG4gICAgZGF0YTogbnVsbCxcbiAgfVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY2xhc3MgSW50bCB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBJbnRsLlxuICAgICAqIEBwYXJhbSB7ZmFsbGJhY2tMb2NhbGU6IHN0cmluZywgbG9jYWxlOiBzdHJpbmcsIGF1dG9CaW5kOiBib29sZWFuLCBkYXRhOiB7W2xhbmc6IHN0cmluZ106IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9fX1cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oREVGQVVMVF9QUk9QRVJUSUVTLCBvcHRpb25zKVxuXG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5mYWxsYmFja0xvY2FsZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke05BTUV9LiBUaGUgZmFsbGJhY2sgbG9jYWxlIGlzIG1hbmRhdG9yeSBhbmQgbXVzdCBiZSBhIHN0cmluZy5gKVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmRhdGEgPT09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke05BTUV9LiBUaGVyZSBpcyBubyB0cmFuc2xhdGlvbiBkYXRhLmApXG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLmRhdGFbdGhpcy5vcHRpb25zLmZhbGxiYWNrTG9jYWxlXSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke05BTUV9LiBUaGUgZmFsbGJhY2sgbG9jYWxlIG11c3QgbmVjZXNzYXJpbHkgaGF2ZSB0cmFuc2xhdGlvbiBkYXRhLmApXG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0TG9jYWxlKHRoaXMub3B0aW9ucy5sb2NhbGUsIHRoaXMub3B0aW9ucy5hdXRvQmluZClcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0IHZlcnNpb24oKSB7XG4gICAgICByZXR1cm4gYCR7TkFNRX0uJHtWRVJTSU9OfWBcbiAgICB9XG5cbiAgICBnZXRMb2NhbGUoKSB7XG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmxvY2FsZVxuICAgIH1cblxuICAgIGdldEZhbGxiYWNrTG9jYWxlKCkge1xuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5mYWxsYmFja0xvY2FsZVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCBkZWZhdWx0IGxvY2FsZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhbGVcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFt1cGRhdGVIVE1MPXRydWVdXG4gICAgICovXG4gICAgc2V0TG9jYWxlKGxvY2FsZSwgdXBkYXRlSFRNTCA9IHRydWUpIHtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLmRhdGFbbG9jYWxlXSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgJHtOQU1FfS4gJHtsb2NhbGV9IGhhcyBubyBkYXRhLCBmYWxsYmFjayBpbiAke3RoaXMub3B0aW9ucy5mYWxsYmFja0xvY2FsZX0uYClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5sb2NhbGUgPSBsb2NhbGVcbiAgICAgIH1cblxuICAgICAgaWYgKHVwZGF0ZUhUTUwpIHtcbiAgICAgICAgdGhpcy51cGRhdGVIdG1sKClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRMYW5ndWFnZXMoKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5vcHRpb25zLmRhdGEpXG4gICAgfVxuXG4gICAgaW5zZXJ0VmFsdWVzKHZhbHVlID0gbnVsbCwgaW5qZWN0YWJsZVZhbHVlcyA9IHt9KSB7XG4gICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1hdGNoID0gdmFsdWUubWF0Y2goLzooW2EtekEtWi1fMC05XSspLylcbiAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UobWF0Y2hbMF0sIGluamVjdGFibGVWYWx1ZXNbbWF0Y2hbMV1dKVxuICAgICAgfVxuXG4gICAgICBpZiAodmFsdWUubWF0Y2goLzooW2EtekEtWi1fMC05XSspLykpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zZXJ0VmFsdWVzKHZhbHVlLCBpbmplY3RhYmxlVmFsdWVzKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdmFsdWVcbiAgICB9XG5cbiAgICB0cmFuc2xhdGUoa2V5TmFtZSA9IG51bGwsIGluamVjdCA9IHt9KSB7XG4gICAgICBsZXQgZGF0YSA9IHRoaXMub3B0aW9ucy5kYXRhW3RoaXMub3B0aW9ucy5sb2NhbGVdXG4gICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgZGF0YSA9IHRoaXMub3B0aW9ucy5kYXRhW3RoaXMub3B0aW9ucy5mYWxsYmFja0xvY2FsZV1cbiAgICAgIH1cblxuICAgICAgaWYgKGtleU5hbWUgPT09IG51bGwgfHwga2V5TmFtZSA9PT0gJyonIHx8IEFycmF5LmlzQXJyYXkoa2V5TmFtZSkpIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoa2V5TmFtZSkpIHtcbiAgICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoZGF0YSkuZmlsdGVyKGtleSA9PiBrZXlOYW1lLmluZGV4T2Yoa2V5KSA+IC0xKVxuICAgICAgICAgIGNvbnN0IGZpbHRlcmVkRGF0YSA9IHt9XG4gICAgICAgICAga2V5cy5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICBmaWx0ZXJlZERhdGFba2V5XSA9IHRoaXMuaW5zZXJ0VmFsdWVzKGRhdGFba2V5XSwgaW5qZWN0KVxuICAgICAgICAgIH0pXG4gICAgICAgICAgZGF0YSA9IGZpbHRlcmVkRGF0YVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGF0YU1hcCA9IHt9XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIGRhdGEpIHtcbiAgICAgICAgICBkYXRhTWFwW2tleV0gPSB0aGlzLmluc2VydFZhbHVlcyhkYXRhW2tleV0sIGluamVjdClcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkYXRhTWFwXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmluc2VydFZhbHVlcyhkYXRhW2tleU5hbWVdLCBpbmplY3QpXG4gICAgfVxuXG4gICAgLy8gYWxpYXMgb2YgdCgpXG4gICAgdChrZXlOYW1lID0gbnVsbCwgaW5qZWN0ID0ge30pIHtcbiAgICAgIHJldHVybiB0aGlzLnRyYW5zbGF0ZShrZXlOYW1lLCBpbmplY3QpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyB0aGUgSFRNTCB2aWV3c1xuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAgICAgKi9cbiAgICB1cGRhdGVIdG1sKGVsZW1lbnQpIHtcbiAgICAgIGlmICh0eXBlb2YgZWxlbWVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWkxOG5dJylcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBlbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbGVtZW50KVxuICAgICAgfVxuXG4gICAgICBuZXcgQmluZGVyKGVsZW1lbnQsIHRoaXMudCgpKVxuICAgIH1cblxuICAgIC8vIHN0YXRpY1xuICAgIHN0YXRpYyBfRE9NSW50ZXJmYWNlKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBuZXcgSW50bChvcHRpb25zKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBJbnRsXG59KSgpXG5cbmV4cG9ydCBkZWZhdWx0IEludGxcbiIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3F1YXJrLWRldi9QaG9ub24tRnJhbWV3b3JrL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmltcG9ydCBFdmVudCBmcm9tICcuLi9ldmVudHMnXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvY29tcG9uZW50J1xuaW1wb3J0IHsgZGlzcGF0Y2hXaW5Eb2NFdmVudCB9IGZyb20gJy4uL2V2ZW50cy9kaXNwYXRjaCdcblxuY29uc3QgTmV0d29yayA9ICgoKSA9PiB7XG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ29uc3RhbnRzXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjb25zdCBOQU1FID0gJ25ldHdvcmsnXG4gIGNvbnN0IFZFUlNJT04gPSAnMi4wLjAnXG4gIGNvbnN0IERFRkFVTFRfUFJPUEVSVElFUyA9IHt9XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29ubGluZScsICgpID0+IHtcbiAgICBkaXNwYXRjaFdpbkRvY0V2ZW50KEV2ZW50Lk5FVFdPUktfT05MSU5FLCBOQU1FLCB7IGRhdGU6IG5ldyBEYXRlKCkgfSlcbiAgfSlcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb2ZmbGluZScsICgpID0+IHtcbiAgICBkaXNwYXRjaFdpbkRvY0V2ZW50KEV2ZW50Lk5FVFdPUktfT0ZGTElORSwgTkFNRSwgeyBkYXRlOiBuZXcgRGF0ZSgpIH0pXG4gIH0pXG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDbGFzcyBEZWZpbml0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjbGFzcyBOZXR3b3JrIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIE5ldHdvcmsuXG4gICAgICogQHBhcmFtIHt7fX0gW29wdGlvbnM9e31dXG4gICAgICovXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgICBzdXBlcihOQU1FLCBWRVJTSU9OLCBERUZBVUxUX1BST1BFUlRJRVMsIG9wdGlvbnMsIHRydWUpXG4gICAgICB0aGlzLmFkZEV2ZW50cygpXG4gICAgfVxuXG4gICAgYWRkRXZlbnRzKCkge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29ubGluZS5waC5uZXR3b3JrJywgKCkgPT4ge1xuICAgICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5ORVRXT1JLX09OTElORSwgeyBkYXRlOiBuZXcgRGF0ZSgpIH0sIHRydWUpXG4gICAgICB9KVxuXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb2ZmbGluZS5waC5uZXR3b3JrJywgKCkgPT4ge1xuICAgICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5ORVRXT1JLX09GRkxJTkUsIHsgZGF0ZTogbmV3IERhdGUoKSB9LCB0cnVlKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBzdGF0aWMgX0RPTUludGVyZmFjZShvcHRpb25zKSB7XG4gICAgICByZXR1cm4gc3VwZXIuX0RPTUludGVyZmFjZShOZXR3b3JrLCBvcHRpb25zKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBOZXR3b3JrXG59KSgpXG5cbmV4cG9ydCBkZWZhdWx0IE5ldHdvcmtcbiIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3F1YXJrLWRldi9QaG9ub24tRnJhbWV3b3JrL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmltcG9ydCBQYWdlIGZyb20gJy4vcGFnZSdcbmltcG9ydCBFdmVudCBmcm9tICcuLi8uLi9jb3JlL2V2ZW50cydcblxuY29uc3QgUGFnZXIgPSAoKCkgPT4ge1xuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENvbnN0YW50c1xuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY29uc3QgTkFNRSA9ICdwYWdlcidcbiAgY29uc3QgVkVSU0lPTiA9ICcyLjAuMCdcbiAgY29uc3QgREVGQVVMVF9QUk9QRVJUSUVTID0ge1xuICAgIGhhc2hQcmVmaXg6ICcjIScsXG4gICAgdXNlSGFzaDogdHJ1ZSxcbiAgICBkZWZhdWx0UGFnZTogbnVsbCxcbiAgICBhbmltYXRlUGFnZXM6IHRydWUsXG4gIH1cblxuICBsZXQgY3VycmVudFBhZ2VcbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDbGFzcyBEZWZpbml0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjbGFzcyBQYWdlciB7XG4gICAgLyoqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3B0aW9ucyB7T2JqZWN0fVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbihERUZBVUxUX1BST1BFUlRJRVMsIG9wdGlvbnMpXG5cbiAgICAgIHRoaXMucGFnZXMgPSBbXVxuICAgICAgdGhpcy5zdGFydGVkID0gZmFsc2VcblxuICAgICAgLy8gYWRkIGdsb2JhbCBsaXN0ZW5lcnMgc3VjaCBhc2ggaGFzaCBjaGFuZ2UsIG5hdmlnYXRpb24sIGV0Yy5cbiAgICAgIHRoaXMuYWRkUGFnZXJFdmVudHMoKVxuXG4gICAgICAvLyBmYXN0ZXIgd2F5IHRvIGluaXQgcGFnZXMgYmVmb3JlIHRoZSBET00gaXMgcmVhZHlcbiAgICAgIHRoaXMub25ET01Mb2FkZWQoKVxuICAgIH1cblxuICAgIC8vIHByaXZhdGVcbiAgICBfKHNlbGVjdG9yKSB7XG4gICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcilcbiAgICB9XG5cbiAgICBnZXRIYXNoKCkge1xuICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5oYXNoLnNwbGl0KHRoaXMub3B0aW9ucy5oYXNoUHJlZml4KVsxXVxuICAgIH1cblxuICAgIGdldFBhZ2VGcm9tSGFzaCgpIHtcbiAgICAgIGNvbnN0IGhhc2ggPSB0aGlzLmdldEhhc2goKVxuICAgICAgY29uc3QgcmUgPSBuZXcgUmVnRXhwKCdbP1xcL10oW15cXC9dKiknKVxuICAgICAgY29uc3QgbWF0Y2hlcyA9IHJlLmV4ZWMoaGFzaClcblxuICAgICAgaWYgKG1hdGNoZXMgJiYgbWF0Y2hlc1sxXSkge1xuICAgICAgICByZXR1cm4gbWF0Y2hlc1sxXVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxuICAgIHNldEhhc2gocGFnZU5hbWUpIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gYCR7dGhpcy5vcHRpb25zLmhhc2hQcmVmaXh9LyR7cGFnZU5hbWV9YFxuICAgIH1cblxuICAgIGFyZVNhbWVQYWdlKHBhZ2VOYW1lMSwgcGFnZU5hbWUyKSB7XG4gICAgICBjb25zdCBwYWdlMSA9IHRoaXMuZ2V0UGFnZU1vZGVsKHBhZ2VOYW1lMSlcbiAgICAgIGNvbnN0IHBhZ2UyID0gdGhpcy5nZXRQYWdlTW9kZWwocGFnZU5hbWUyKVxuICAgICAgcmV0dXJuIHBhZ2UxICYmIHBhZ2UyICYmIHBhZ2UxLm5hbWUgPT09IHBhZ2UyLm5hbWVcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBdHRhY2hlcyB0aGUgbWFpbiBldmVudHMgZm9yIHRyYWNraW5nIGhhc2ggY2hhbmdlcyxcbiAgICAgKiBjbGljayBvbiBuYXZpZ2F0aW9uIGJ1dHRvbnMgYW5kIGxpbmtzIGFuZCBiYWNrIGhpc3RvcnlcbiAgICAgKi9cbiAgICBhZGRQYWdlckV2ZW50cygpIHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4gdGhpcy5vbkNsaWNrKGV2ZW50KSlcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIGV2ZW50ID0+IHRoaXMub25CYWNrSGlzdG9yeShldmVudCkpXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIGV2ZW50ID0+IHRoaXMub25IYXNoQ2hhbmdlKGV2ZW50KSlcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBldmVudCA9PiB0aGlzLm9uRE9NTG9hZGVkKGV2ZW50KSlcbiAgICB9XG5cbiAgICAvLyBnZXR0ZXJzXG5cbiAgICBzdGF0aWMgZ2V0IHZlcnNpb24oKSB7XG4gICAgICByZXR1cm4gYCR7TkFNRX0uJHtWRVJTSU9OfWBcbiAgICB9XG5cbiAgICAvLyBwdWJsaWNcblxuICAgIHNob3dQYWdlKHBhZ2VOYW1lLCBhZGRUb0hpc3RvcnkgPSB0cnVlLCBiYWNrID0gZmFsc2UpIHtcbiAgICAgIGNvbnN0IG9sZFBhZ2UgPSB0aGlzLl8oJy5jdXJyZW50JylcbiAgICAgIGlmIChvbGRQYWdlKSB7XG4gICAgICAgIGNvbnN0IG9sZFBhZ2VOYW1lID0gb2xkUGFnZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGFnZScpXG5cbiAgICAgICAgaWYgKHRoaXMuYXJlU2FtZVBhZ2UocGFnZU5hbWUsIG9sZFBhZ2VOYW1lKSkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgb2xkUGFnZS5jbGFzc0xpc3QucmVtb3ZlKCdjdXJyZW50JylcblxuICAgICAgICAvLyBoaXN0b3J5XG4gICAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSh7IHBhZ2U6IG9sZFBhZ2VOYW1lIH0sIG9sZFBhZ2VOYW1lLCB3aW5kb3cubG9jYXRpb24uaHJlZilcblxuICAgICAgICB0aGlzLnRyaWdnZXJQYWdlRXZlbnQob2xkUGFnZU5hbWUsIEV2ZW50LkhJREUpXG4gICAgICB9XG5cbiAgICAgIHRoaXMudHJpZ2dlclBhZ2VFdmVudChwYWdlTmFtZSwgRXZlbnQuU0hPVylcblxuICAgICAgY3VycmVudFBhZ2UgPSBwYWdlTmFtZVxuXG4gICAgICAvLyBuZXcgcGFnZVxuICAgICAgY29uc3QgbmV3UGFnZSA9IHRoaXMuXyhgW2RhdGEtcGFnZT1cIiR7cGFnZU5hbWV9XCJdYClcblxuICAgICAgbmV3UGFnZS5jbGFzc0xpc3QuYWRkKCdjdXJyZW50JylcblxuICAgICAgLy8gdGVtcGxhdGUgbG9hZGVyXG4gICAgICBjb25zdCBwYWdlTW9kZWwgPSB0aGlzLmdldFBhZ2VNb2RlbChwYWdlTmFtZSlcblxuICAgICAgLy8gQHRvZG86IHVzZSB0ZW1wbGF0ZSBjYWNoZT9cbiAgICAgIGlmIChwYWdlTW9kZWwgJiYgcGFnZU1vZGVsLmdldFRlbXBsYXRlKCkpIHtcbiAgICAgICAgcGFnZU1vZGVsLmxvYWRUZW1wbGF0ZSgpXG4gICAgICB9XG4gICAgICAvLyBlbmRcblxuICAgICAgaWYgKG9sZFBhZ2UpIHtcbiAgICAgICAgY29uc3Qgb2xkUGFnZU5hbWUgPSBvbGRQYWdlLmdldEF0dHJpYnV0ZSgnZGF0YS1wYWdlJylcbiAgICAgICAgLy8gdXNlIG9mIHByb3RvdHlwZS1vcmllbnRlZCBsYW5ndWFnZVxuICAgICAgICBvbGRQYWdlLmJhY2sgPSBiYWNrXG4gICAgICAgIG9sZFBhZ2UucHJldmlvdXNQYWdlTmFtZSA9IG9sZFBhZ2VOYW1lXG5cbiAgICAgICAgY29uc3Qgb25QYWdlQW5pbWF0aW9uRW5kID0gKCkgPT4ge1xuICAgICAgICAgIGlmIChvbGRQYWdlLmNsYXNzTGlzdC5jb250YWlucygnYW5pbWF0ZScpKSB7XG4gICAgICAgICAgICBvbGRQYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ2FuaW1hdGUnKVxuICAgICAgICAgIH1cblxuICAgICAgICAgIG9sZFBhZ2UuY2xhc3NMaXN0LnJlbW92ZShvbGRQYWdlLmJhY2sgPyAncG9wLXBhZ2UnIDogJ3B1c2gtcGFnZScpXG5cbiAgICAgICAgICB0aGlzLnRyaWdnZXJQYWdlRXZlbnQoY3VycmVudFBhZ2UsIEV2ZW50LlNIT1dOKVxuICAgICAgICAgIHRoaXMudHJpZ2dlclBhZ2VFdmVudChvbGRQYWdlLnByZXZpb3VzUGFnZU5hbWUsIEV2ZW50LkhJRERFTilcblxuICAgICAgICAgIG9sZFBhZ2UucmVtb3ZlRXZlbnRMaXN0ZW5lcihFdmVudC5BTklNQVRJT05fRU5ELCBvblBhZ2VBbmltYXRpb25FbmQpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmFuaW1hdGVQYWdlcykge1xuICAgICAgICAgIG9sZFBhZ2UuYWRkRXZlbnRMaXN0ZW5lcihFdmVudC5BTklNQVRJT05fRU5ELCBvblBhZ2VBbmltYXRpb25FbmQpXG4gICAgICAgICAgb2xkUGFnZS5jbGFzc0xpc3QuYWRkKCdhbmltYXRlJylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvblBhZ2VBbmltYXRpb25FbmQoKVxuICAgICAgICB9XG5cbiAgICAgICAgb2xkUGFnZS5jbGFzc0xpc3QuYWRkKGJhY2sgPyAncG9wLXBhZ2UnIDogJ3B1c2gtcGFnZScpXG4gICAgICB9XG4gICAgfVxuXG4gICAgYWRkVW5pcXVlUGFnZU1vZGVsKHBhZ2VOYW1lKSB7XG4gICAgICBpZiAoIXRoaXMuZ2V0UGFnZU1vZGVsKHBhZ2VOYW1lKSkge1xuICAgICAgICB0aGlzLnBhZ2VzLnB1c2gobmV3IFBhZ2UocGFnZU5hbWUpKVxuICAgICAgfVxuICAgIH1cblxuICAgIGdldFBhZ2VNb2RlbChwYWdlTmFtZSkge1xuICAgICAgcmV0dXJuIHRoaXMucGFnZXMuZmluZChwYWdlID0+IHBhZ2UubmFtZSA9PT0gcGFnZU5hbWUpXG4gICAgfVxuXG4gICAgZ2V0UGFnZXNNb2RlbChwYWdlTmFtZXMpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhZ2VzLmZpbHRlcihwYWdlID0+IHBhZ2VOYW1lcy5pbmRleE9mKHBhZ2UubmFtZSkgPiAtMSlcbiAgICB9XG5cbiAgICBzZWxlY3RvclRvQXJyYXkoc3RyKSB7XG4gICAgICByZXR1cm4gc3RyLnNwbGl0KCcsJykubWFwKGl0ZW0gPT4gaXRlbS50cmltKCkpXG4gICAgfVxuXG4gICAgYWRkRXZlbnRzKGNhbGxiYWNrKSB7XG4gICAgICBpZiAodGhpcy5jYWNoZVBhZ2VTZWxlY3RvciA9PT0gJyonKSB7XG4gICAgICAgIC8vIGFkZCB0byBhbGwgcGFnZSBtb2RlbHNcbiAgICAgICAgdGhpcy5wYWdlcy5mb3JFYWNoKChwYWdlKSA9PiB7XG4gICAgICAgICAgcGFnZS5hZGRFdmVudENhbGxiYWNrKGNhbGxiYWNrKVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgY29uc3QgcGFnZU1vZGVscyA9IHRoaXMuZ2V0UGFnZXNNb2RlbCh0aGlzLnNlbGVjdG9yVG9BcnJheSh0aGlzLmNhY2hlUGFnZVNlbGVjdG9yKSwgdHJ1ZSlcbiAgICAgIHBhZ2VNb2RlbHMuZm9yRWFjaCgocGFnZSkgPT4ge1xuICAgICAgICBwYWdlLmFkZEV2ZW50Q2FsbGJhY2soY2FsbGJhY2spXG4gICAgICB9KVxuICAgICAgdGhpcy5jYWNoZVBhZ2VTZWxlY3RvciA9IG51bGxcbiAgICB9XG5cbiAgICB1c2VUZW1wbGF0ZSh0ZW1wbGF0ZVBhdGgsIHJlbmRlckZ1bmN0aW9uID0gbnVsbCkge1xuICAgICAgY29uc3QgcGFnZU1vZGVscyA9IHRoaXMuZ2V0UGFnZXNNb2RlbCh0aGlzLnNlbGVjdG9yVG9BcnJheSh0aGlzLmNhY2hlUGFnZVNlbGVjdG9yKSwgdHJ1ZSlcbiAgICAgIHBhZ2VNb2RlbHMuZm9yRWFjaCgocGFnZSkgPT4ge1xuICAgICAgICBwYWdlLnVzZVRlbXBsYXRlKHRlbXBsYXRlUGF0aClcbiAgICAgICAgaWYgKHR5cGVvZiByZW5kZXJGdW5jdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHBhZ2UudXNlVGVtcGxhdGVSZW5kZXJlcihyZW5kZXJGdW5jdGlvbilcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHRoaXMuY2FjaGVQYWdlU2VsZWN0b3IgPSBudWxsXG4gICAgfVxuXG4gICAgdHJpZ2dlclBhZ2VFdmVudChwYWdlTmFtZSwgZXZlbnROYW1lLCBldmVudFBhcmFtcyA9IG51bGwpIHtcbiAgICAgIGNvbnN0IHBhZ2VNb2RlbCA9IHRoaXMuZ2V0UGFnZU1vZGVsKHBhZ2VOYW1lKVxuICAgICAgaWYgKHBhZ2VNb2RlbCkge1xuICAgICAgICBwYWdlTW9kZWwudHJpZ2dlclNjb3BlcyhldmVudE5hbWUsIGV2ZW50UGFyYW1zKVxuICAgICAgfVxuICAgIH1cblxuICAgIG9uQ2xpY2soZXZlbnQpIHtcbiAgICAgIGNvbnN0IHBhZ2VOYW1lID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1uYXZpZ2F0ZScpXG4gICAgICBjb25zdCBwdXNoUGFnZSA9ICEoZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1wb3AtcGFnZScpID09PSAndHJ1ZScpXG5cbiAgICAgIGlmIChwYWdlTmFtZSkge1xuICAgICAgICBpZiAocGFnZU5hbWUgPT09ICckYmFjaycpIHtcbiAgICAgICAgICAvLyB0aGUgcG9wc3RhdGUgZXZlbnQgd2lsbCBiZSB0cmlnZ2VyZWRcbiAgICAgICAgICB3aW5kb3cuaGlzdG9yeS5iYWNrKClcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIElmIHdlIGhlIHVzZSB0aGUgaGFzaCBhcyB0cmlnZ2VyLFxuICAgICAgICAgKiB3ZSBjaGFuZ2UgaXQgZHluYW1pY2FsbHkgc28gdGhhdCB0aGUgaGFzaGNoYW5nZSBldmVudCBpcyBjYWxsZWRcbiAgICAgICAgICogT3RoZXJ3aXNlLCB3ZSBzaG93IHRoZSBwYWdlXG4gICAgICAgICAqL1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnVzZUhhc2gpIHtcbiAgICAgICAgICB0aGlzLnNldEhhc2gocGFnZU5hbWUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zaG93UGFnZShwYWdlTmFtZSwgdHJ1ZSwgcHVzaFBhZ2UpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBvbkJhY2tIaXN0b3J5KGV2ZW50ID0ge30pIHtcbiAgICAgIGNvbnN0IHBhZ2VOYW1lID0gZXZlbnQuc3RhdGUgPyBldmVudC5zdGF0ZS5wYWdlIDogbnVsbFxuICAgICAgaWYgKCFwYWdlTmFtZSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgdGhpcy5zaG93UGFnZShwYWdlTmFtZSwgdHJ1ZSwgdHJ1ZSlcbiAgICB9XG5cbiAgICBvbkhhc2hDaGFuZ2UoKSB7XG4gICAgICBjb25zdCBwYXJhbXMgPSAodGhpcy5nZXRIYXNoKCkgPyB0aGlzLmdldEhhc2goKS5zcGxpdCgnLycpIDogW10pLmZpbHRlcihwID0+IHAubGVuZ3RoID4gMClcbiAgICAgIGlmIChwYXJhbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAvLyByZW1vdmUgZmlyc3QgdmFsdWUgd2hpY2ggaXMgdGhlIHBhZ2UgbmFtZVxuICAgICAgICBwYXJhbXMuc2hpZnQoKVxuICAgICAgfVxuXG4gICAgICB0aGlzLnRyaWdnZXJQYWdlRXZlbnQoY3VycmVudFBhZ2UsIEV2ZW50LkhBU0gsIHBhcmFtcylcblxuICAgICAgY29uc3QgbmF2UGFnZSA9IHRoaXMuZ2V0UGFnZUZyb21IYXNoKClcbiAgICAgIGlmIChuYXZQYWdlKSB7XG4gICAgICAgIHRoaXMuc2hvd1BhZ2UobmF2UGFnZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBRdWVyaWVzIHRoZSBwYWdlIG5vZGVzIGluIHRoZSBET01cbiAgICAgKi9cbiAgICBvbkRPTUxvYWRlZCgpIHtcbiAgICAgIGNvbnN0IHBhZ2VzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtcGFnZV0nKVxuXG4gICAgICBpZiAoIXBhZ2VzKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBwYWdlcy5mb3JFYWNoKChwYWdlKSA9PiB7XG4gICAgICAgIGxldCBwYWdlTmFtZSA9IHBhZ2UuZ2V0QXR0cmlidXRlKCdkYXRhLXBhZ2UnKVxuICAgICAgICAvKlxuICAgICAgICAgKiB0aGUgcGFnZSBuYW1lIGNhbiBiZSBnaXZlbiB3aXRoIHRoZSBhdHRyaWJ1dGUgZGF0YS1wYWdlXG4gICAgICAgICAqIG9yIHdpdGggaXRzIG5vZGUgbmFtZVxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKCFwYWdlTmFtZSkge1xuICAgICAgICAgIHBhZ2VOYW1lID0gcGFnZS5ub2RlTmFtZVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hZGRVbmlxdWVQYWdlTW9kZWwocGFnZU5hbWUpXG4gICAgICB9KVxuICAgIH1cblxuICAgIHNlbGVjdChwYWdlTmFtZSwgYWRkUGFnZU1vZGVsID0gdHJ1ZSkge1xuICAgICAgdGhpcy5jYWNoZVBhZ2VTZWxlY3RvciA9IHBhZ2VOYW1lXG5cbiAgICAgIGlmIChhZGRQYWdlTW9kZWwgJiYgcGFnZU5hbWUgIT09ICcqJykge1xuICAgICAgICB0aGlzLmFkZFVuaXF1ZVBhZ2VNb2RlbChwYWdlTmFtZSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBzdGFydChmb3JjZURlZmF1bHRQYWdlID0gZmFsc2UpIHtcbiAgICAgIC8vIGNoZWNrIGlmIHRoZSBhcHAgaGFzIGJlZW4gYWxyZWFkeSBzdGFydGVkXG4gICAgICBpZiAodGhpcy5zdGFydGVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtOQU1FfS4gVGhlIGFwcCBoYXMgYmVlbiBhbHJlYWR5IHN0YXJ0ZWQuYClcbiAgICAgIH1cblxuICAgICAgdGhpcy5zdGFydGVkID0gdHJ1ZVxuXG4gICAgICAvLyBmb3JjZSBkZWZhdWx0IHBhZ2Ugb24gQ29yZG92YVxuICAgICAgaWYgKHdpbmRvdy5jb3Jkb3ZhKSB7XG4gICAgICAgIGZvcmNlRGVmYXVsdFBhZ2UgPSB0cnVlXG4gICAgICB9XG5cbiAgICAgIGxldCBwYWdlTmFtZSA9IHRoaXMuZ2V0UGFnZUZyb21IYXNoKClcbiAgICAgIGlmICghdGhpcy5nZXRQYWdlTW9kZWwocGFnZU5hbWUpKSB7XG4gICAgICAgIHBhZ2VOYW1lID0gdGhpcy5vcHRpb25zLmRlZmF1bHRQYWdlXG4gICAgICB9XG5cbiAgICAgIGlmIChmb3JjZURlZmF1bHRQYWdlICYmICF0aGlzLm9wdGlvbnMuZGVmYXVsdFBhZ2UpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke05BTUV9LiBUaGUgZGVmYXVsdCBwYWdlIG11c3QgZXhpc3QgZm9yIGZvcmNpbmcgaXRzIGxhdW5jaCFgKVxuICAgICAgfVxuXG4gICAgICAvLyBMb2cgdGhlIGRldmljZSBpbmZvXG4gICAgICBpZiAocGhvbm9uLmRlYnVnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdTdGFydGluZyBQaG9ub24gaW4gJyArIHBsYXRmb3JtLmRlc2NyaXB0aW9uKVxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnBhZ2VzLmxlbmd0aCArICcgcGFnZXMgZm91bmQnKVxuICAgICAgICBjb25zb2xlLmxvZygnTG9hZGluZyAnICsgcGFnZU5hbWUpXG4gICAgICB9XG5cbiAgICAgIC8qXG4gICAgICAgKiBpZiB0aGUgYXBwIGlzIGNvbmZpZ3VyYXRlZCB0byB1c2UgaGFzaCB0cmFja2luZ1xuICAgICAgICogd2UgYWRkIHRoZSBwYWdlIGR5bmFtaWNhbGx5IGluIHRoZSB1cmxcbiAgICAgICAqL1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy51c2VIYXNoKSB7XG4gICAgICAgIHRoaXMuc2V0SGFzaChwYWdlTmFtZSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5zaG93UGFnZShmb3JjZURlZmF1bHRQYWdlID8gdGhpcy5vcHRpb25zLmRlZmF1bHRQYWdlIDogcGFnZU5hbWUpXG4gICAgfVxuXG4gICAgLy8gc3RhdGljXG4gICAgc3RhdGljIF9ET01JbnRlcmZhY2Uob3B0aW9ucykge1xuICAgICAgcmV0dXJuIG5ldyBQYWdlcihvcHRpb25zKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBQYWdlclxufSkoKVxuXG5leHBvcnQgZGVmYXVsdCBQYWdlclxuIiwiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vcXVhcmstZGV2L1Bob25vbi1GcmFtZXdvcmsvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuaW1wb3J0IHsgbG9hZEZpbGUgfSBmcm9tICcuLi91dGlscydcbmltcG9ydCB7IGRpc3BhdGNoUGFnZUV2ZW50IH0gZnJvbSAnLi4vZXZlbnRzL2Rpc3BhdGNoJ1xuXG5jb25zdCBQYWdlID0gKCgpID0+IHtcbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDb25zdGFudHNcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNvbnN0IE5BTUUgPSAncGFnZSdcbiAgY29uc3QgVkVSU0lPTiA9ICcyLjAuMCdcblxuICBjb25zdCBURU1QTEFURV9TRUxFQ1RPUiA9ICdbZGF0YS10ZW1wbGF0ZV0nXG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDbGFzcyBEZWZpbml0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjbGFzcyBQYWdlIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIFBhZ2UuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHBhZ2VOYW1lXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocGFnZU5hbWUpIHtcbiAgICAgIHRoaXMubmFtZSA9IHBhZ2VOYW1lXG4gICAgICB0aGlzLmV2ZW50cyA9IFtdXG4gICAgICB0aGlzLnRlbXBsYXRlUGF0aCA9IG51bGxcbiAgICAgIHRoaXMucmVuZGVyRnVuY3Rpb24gPSBudWxsXG4gICAgfVxuXG4gICAgLy8gZ2V0dGVyc1xuXG4gICAgc3RhdGljIGdldCB2ZXJzaW9uKCkge1xuICAgICAgcmV0dXJuIGAke05BTUV9LiR7VkVSU0lPTn1gXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGV2ZW50c1xuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbltdfVxuICAgICAqL1xuICAgIGdldEV2ZW50cygpIHtcbiAgICAgIHJldHVybiB0aGlzLmV2ZW50c1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0ZW1wbGF0ZVxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgZ2V0VGVtcGxhdGUoKSB7XG4gICAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZVBhdGhcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgcmVuZGVyIGZ1bmN0aW9uXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufVxuICAgICAqL1xuICAgIGdldFJlbmRlckZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyRnVuY3Rpb25cbiAgICB9XG5cbiAgICBsb2FkVGVtcGxhdGUoKSB7XG4gICAgICBjb25zdCBwYWdlRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXBhZ2U9XCIke3RoaXMubmFtZX1cIl1gKVxuXG4gICAgICBsb2FkRmlsZSh0aGlzLmdldFRlbXBsYXRlKCksICh0ZW1wbGF0ZSkgPT4ge1xuICAgICAgICBsZXQgcmVuZGVyID0gZnVuY3Rpb24gKERPTVBhZ2UsIHRlbXBsYXRlLCBlbGVtZW50cykge1xuICAgICAgICAgIGlmIChlbGVtZW50cykge1xuICAgICAgICAgICAgZWxlbWVudHMuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICAgICAgZWwuaW5uZXJIVE1MID0gdGVtcGxhdGVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIERPTVBhZ2UuaW5uZXJIVE1MID0gdGVtcGxhdGVcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5nZXRSZW5kZXJGdW5jdGlvbigpKSB7XG4gICAgICAgICAgcmVuZGVyID0gdGhpcy5nZXRSZW5kZXJGdW5jdGlvbigpXG4gICAgICAgIH1cblxuICAgICAgICByZW5kZXIocGFnZUVsZW1lbnQsIHRlbXBsYXRlLCBwYWdlRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFRFTVBMQVRFX1NFTEVDVE9SKSlcbiAgICAgIH0sIG51bGwpXG4gICAgfVxuXG4gICAgLy8gcHVibGljXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Kn0gY2FsbGJhY2tGblxuICAgICAqL1xuICAgIGFkZEV2ZW50Q2FsbGJhY2soY2FsbGJhY2tGbikge1xuICAgICAgdGhpcy5ldmVudHMucHVzaChjYWxsYmFja0ZuKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVzZSB0aGUgZ2l2ZW4gdGVtcGxhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0ZW1wbGF0ZVBhdGhcbiAgICAgKi9cbiAgICB1c2VUZW1wbGF0ZSh0ZW1wbGF0ZVBhdGgpIHtcbiAgICAgIGlmICh0eXBlb2YgdGVtcGxhdGVQYXRoICE9PSAnc3RyaW5nJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSB0ZW1wbGF0ZSBwYXRoIG11c3QgYmUgYSBzdHJpbmcuICcgKyB0eXBlb2YgdGVtcGxhdGVQYXRoICsgJyBpcyBnaXZlbicpXG4gICAgICB9XG4gICAgICB0aGlzLnRlbXBsYXRlUGF0aCA9IHRlbXBsYXRlUGF0aFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVzZSB0aGUgZ2l2ZW4gdGVtcGxhdGUgcmVuZGVyZXJcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSByZW5kZXJGdW5jdGlvblxuICAgICAqL1xuICAgIHVzZVRlbXBsYXRlUmVuZGVyZXIocmVuZGVyRnVuY3Rpb24pIHtcbiAgICAgIGlmICh0eXBlb2YgcmVuZGVyRnVuY3Rpb24gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgY3VzdG9tIHRlbXBsYXRlIHJlbmRlcmVyIG11c3QgYmUgYSBmdW5jdGlvbi4gJyArIHR5cGVvZiByZW5kZXJGdW5jdGlvbiArICcgaXMgZ2l2ZW4nKVxuICAgICAgfVxuICAgICAgdGhpcy5yZW5kZXJGdW5jdGlvbiA9IHJlbmRlckZ1bmN0aW9uXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVHJpZ2dlciBzY29wZXNcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lXG4gICAgICogQHBhcmFtIHt7fX0gW2V2ZW50UGFyYW1zPXt9XVxuICAgICAqL1xuICAgIHRyaWdnZXJTY29wZXMoZXZlbnROYW1lLCBldmVudFBhcmFtcyA9IHt9KSB7XG4gICAgICBjb25zdCBldmVudE5hbWVBbGlhcyA9IGBvbiR7ZXZlbnROYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpfSR7ZXZlbnROYW1lLnNsaWNlKDEpfWBcblxuICAgICAgdGhpcy5ldmVudHMuZm9yRWFjaCgoc2NvcGUpID0+IHtcbiAgICAgICAgY29uc3Qgc2NvcGVFdmVudCA9IHNjb3BlW2V2ZW50TmFtZV1cbiAgICAgICAgY29uc3Qgc2NvcGVFdmVudEFsaWFzID0gc2NvcGVbZXZlbnROYW1lQWxpYXNdXG4gICAgICAgIGlmICh0eXBlb2Ygc2NvcGVFdmVudCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHNjb3BlRXZlbnQuYXBwbHkodGhpcywgZXZlbnRQYXJhbXMpXG4gICAgICAgIH1cblxuICAgICAgICAvLyB0cmlnZ2VyIHRoZSBldmVudCBhbGlhc1xuICAgICAgICBpZiAodHlwZW9mIHNjb3BlRXZlbnRBbGlhcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHNjb3BlRXZlbnRBbGlhcy5hcHBseSh0aGlzLCBldmVudFBhcmFtcylcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgZGlzcGF0Y2hQYWdlRXZlbnQoZXZlbnROYW1lLCB0aGlzLm5hbWUsIGV2ZW50UGFyYW1zKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBQYWdlXG59KSgpXG5cbmV4cG9ydCBkZWZhdWx0IFBhZ2VcbiIsIi8qXG4gKiBVc2Ugb2YgcGxhdGZvcm0uanNcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9iZXN0aWVqcy9wbGF0Zm9ybS5qc1xuICogTGljZW5zZTogaHR0cHM6Ly9naXRodWIuY29tL2Jlc3RpZWpzL3BsYXRmb3JtLmpzL2Jsb2IvbWFzdGVyL0xJQ0VOU0VcbiAqL1xuaW1wb3J0IHBsYXRmb3JtIGZyb20gJ3BsYXRmb3JtJ1xuXG5leHBvcnQgZGVmYXVsdCBwbGF0Zm9ybVxuIiwiXG5leHBvcnQgZnVuY3Rpb24gbG9hZEZpbGUodXJsLCBmbiwgcG9zdERhdGEpIHtcbiAgY29uc3QgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgaWYgKHJlcS5vdmVycmlkZU1pbWVUeXBlKSByZXEub3ZlcnJpZGVNaW1lVHlwZSgndGV4dC9odG1sOyBjaGFyc2V0PXV0Zi04JylcbiAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT09IDQgJiYgKHBhcnNlSW50KHJlcS5zdGF0dXMpID09PSAyMDAgfHwgIXJlcS5zdGF0dXMgJiYgcmVxLnJlc3BvbnNlVGV4dC5sZW5ndGgpKSB7XG4gICAgICBmbihyZXEucmVzcG9uc2VUZXh0KVxuICAgIH1cbiAgfVxuXG4gIGlmICh0eXBlb2YgcG9zdERhdGEgIT09ICdzdHJpbmcnKSB7XG4gICAgcmVxLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSlcbiAgICByZXEuc2VuZCgnJylcbiAgfSBlbHNlIHtcbiAgICByZXEub3BlbignUE9TVCcsIHVybCwgdHJ1ZSlcbiAgICByZXEuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpXG4gICAgcmVxLnNlbmQocG9zdERhdGEpXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlSWQoKSB7XG4gIHJldHVybiBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHIoMiwgMTApXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kVGFyZ2V0QnlDbGFzcyh0YXJnZXQsIHBhcmVudENsYXNzKSB7XG4gIGZvciAoOyB0YXJnZXQgJiYgdGFyZ2V0ICE9PSBkb2N1bWVudDsgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGUpIHtcbiAgICBpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhwYXJlbnRDbGFzcykpIHtcbiAgICAgIHJldHVybiB0YXJnZXRcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbFxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kVGFyZ2V0QnlJZCh0YXJnZXQsIHBhcmVudElkKSB7XG4gIGZvciAoOyB0YXJnZXQgJiYgdGFyZ2V0ICE9PSBkb2N1bWVudDsgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGUpIHtcbiAgICBpZiAodGFyZ2V0LmdldEF0dHJpYnV0ZSgnaWQnKSA9PT0gcGFyZW50SWQpIHtcbiAgICAgIHJldHVybiB0YXJnZXRcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZFRhcmdldEJ5QXR0cih0YXJnZXQsIGF0dHIpIHtcbiAgZm9yICg7IHRhcmdldCAmJiB0YXJnZXQgIT09IGRvY3VtZW50OyB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZSkge1xuICAgIGlmICh0YXJnZXQuZ2V0QXR0cmlidXRlKGF0dHIpICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gdGFyZ2V0XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGxcbn1cbiIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3F1YXJrLWRldi9QaG9ub24tRnJhbWV3b3JrL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8vIGNvcmVcbmltcG9ydCBQYWdlciBmcm9tICcuL2NvcmUvcGFnZXIvaW5kZXgnXG5pbXBvcnQgQWpheCBmcm9tICcuL2NvcmUvYWpheCdcbmltcG9ydCBwbGF0Zm9ybSBmcm9tICcuL2NvcmUvcGxhdGZvcm0nXG5pbXBvcnQgSW50bCBmcm9tICcuL2NvcmUvaW50bCdcbmltcG9ydCBOZXR3b3JrIGZyb20gJy4vY29yZS9uZXR3b3JrJ1xuXG4vLyBjb21wb25lbnRzXG5pbXBvcnQgRGlhbG9nIGZyb20gJy4vY29tcG9uZW50cy9kaWFsb2cnXG5pbXBvcnQgTm90aWZpY2F0aW9uIGZyb20gJy4vY29tcG9uZW50cy9ub3RpZmljYXRpb24nXG5pbXBvcnQgQ29sbGFwc2UgZnJvbSAnLi9jb21wb25lbnRzL2NvbGxhcHNlJ1xuaW1wb3J0IEFjY29yZGlvbiBmcm9tICcuL2NvbXBvbmVudHMvYWNjb3JkaW9uJ1xuaW1wb3J0IFRhYiBmcm9tICcuL2NvbXBvbmVudHMvdGFiJ1xuaW1wb3J0IFByb2dyZXNzIGZyb20gJy4vY29tcG9uZW50cy9wcm9ncmVzcydcbmltcG9ydCBMb2FkZXIgZnJvbSAnLi9jb21wb25lbnRzL2xvYWRlcidcbmltcG9ydCBPZmZDYW52YXMgZnJvbSAnLi9jb21wb25lbnRzL29mZi1jYW52YXMnXG5pbXBvcnQgRHJvcGRvd24gZnJvbSAnLi9jb21wb25lbnRzL2Ryb3Bkb3duJ1xuXG5jb25zdCBhcGkgPSB7fVxuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQ29uZmlndXJhdGlvblxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmFwaS5jb25maWcgPSB7XG4gIC8vIGdsb2JhbCBjb25maWdcbiAgZGVidWc6IHRydWUsXG59XG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBQYWdlclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmFwaS5wYWdlciA9IChvcHRpb25zKSA9PiB7XG4gIGlmICh0eXBlb2YgYXBpLl9wYWdlciA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBhcGkuX3BhZ2VyID0gUGFnZXIuX0RPTUludGVyZmFjZShvcHRpb25zKVxuICB9XG4gIHJldHVybiBhcGkuX3BhZ2VyXG59XG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBQbGF0Zm9ybVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuYXBpLnBsYXRmb3JtID0gcGxhdGZvcm1cblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIEFqYXhcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5hcGkuYWpheCA9IEFqYXguX0RPTUludGVyZmFjZVxuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogSW50bFxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmFwaS5pbnRsID0gSW50bC5fRE9NSW50ZXJmYWNlXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBOZXR3b3JrXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuYXBpLm5ldHdvcmsgPSBOZXR3b3JrLl9ET01JbnRlcmZhY2VcblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIE5vdGlmaWNhdGlvblxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmFwaS5ub3RpZmljYXRpb24gPSBOb3RpZmljYXRpb24uX0RPTUludGVyZmFjZVxuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogRGlhbG9nXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuYXBpLmRpYWxvZyA9IERpYWxvZy5fRE9NSW50ZXJmYWNlXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBDb2xsYXBzZVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmFwaS5jb2xsYXBzZSA9IENvbGxhcHNlLl9ET01JbnRlcmZhY2VcblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIEFjY29yZGlvblxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmFwaS5hY2NvcmRpb24gPSBBY2NvcmRpb24uX0RPTUludGVyZmFjZVxuXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBUYWJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5hcGkudGFiID0gVGFiLl9ET01JbnRlcmZhY2VcblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIFByb2dyZXNzXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuYXBpLnByb2dyZXNzID0gUHJvZ3Jlc3MuX0RPTUludGVyZmFjZVxuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogTG9hZGVyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuYXBpLmxvYWRlciA9IExvYWRlci5fRE9NSW50ZXJmYWNlXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBPZmYgY2FudmFzXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuYXBpLm9mZkNhbnZhcyA9IE9mZkNhbnZhcy5fRE9NSW50ZXJmYWNlXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBEcm9wZG93blxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmFwaS5kcm9wZG93biA9IERyb3Bkb3duLl9ET01JbnRlcmZhY2VcblxuLy8gTWFrZSB0aGUgQVBJIGxpdmVcbndpbmRvdy5waG9ub24gPSBhcGlcblxuZXhwb3J0IGRlZmF1bHQgYXBpXG4iXSwicHJlRXhpc3RpbmdDb21tZW50IjoiLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW01dlpHVmZiVzlrZFd4bGN5OWljbTkzYzJWeUxYQmhZMnN2WDNCeVpXeDFaR1V1YW5NaUxDSnViMlJsWDIxdlpIVnNaWE12Y0d4aGRHWnZjbTB2Y0d4aGRHWnZjbTB1YW5NaUxDSnpjbU12YW5NdlkyOXRjRzl1Wlc1MGN5OWhZMk52Y21ScGIyNHZhVzVrWlhndWFuTWlMQ0p6Y21NdmFuTXZZMjl0Y0c5dVpXNTBjeTlqYjJ4c1lYQnpaUzlwYm1SbGVDNXFjeUlzSW5OeVl5OXFjeTlqYjIxd2IyNWxiblJ6TDJOdmJYQnZibVZ1ZEM1cWN5SXNJbk55WXk5cWN5OWpiMjF3YjI1bGJuUnpMMk52YlhCdmJtVnVkRTFoYm1GblpYSXVhbk1pTENKemNtTXZhbk12WTI5dGNHOXVaVzUwY3k5a2FXRnNiMmN2YVc1a1pYZ3Vhbk1pTENKemNtTXZhbk12WTI5dGNHOXVaVzUwY3k5a2NtOXdaRzkzYmk5cGJtUmxlQzVxY3lJc0luTnlZeTlxY3k5amIyMXdiMjVsYm5SekwyeHZZV1JsY2k5cGJtUmxlQzVxY3lJc0luTnlZeTlxY3k5amIyMXdiMjVsYm5SekwyNXZkR2xtYVdOaGRHbHZiaTlwYm1SbGVDNXFjeUlzSW5OeVl5OXFjeTlqYjIxd2IyNWxiblJ6TDI5bVppMWpZVzUyWVhNdmFXNWtaWGd1YW5NaUxDSnpjbU12YW5NdlkyOXRjRzl1Wlc1MGN5OXdjbTluY21WemN5OXBibVJsZUM1cWN5SXNJbk55WXk5cWN5OWpiMjF3YjI1bGJuUnpMM1JoWWk5cGJtUmxlQzVxY3lJc0luTnlZeTlxY3k5amIzSmxMMkZxWVhndmFXNWtaWGd1YW5NaUxDSnpjbU12YW5NdlkyOXlaUzlsZG1WdWRITXZaR2x6Y0dGMFkyZ3Vhbk1pTENKemNtTXZhbk12WTI5eVpTOWxkbVZ1ZEhNdmFXNWtaWGd1YW5NaUxDSnpjbU12YW5NdlkyOXlaUzlwYm5Sc0wySnBibVJsY2k1cWN5SXNJbk55WXk5cWN5OWpiM0psTDJsdWRHd3ZhVzVrWlhndWFuTWlMQ0p6Y21NdmFuTXZZMjl5WlM5dVpYUjNiM0pyTDJsdVpHVjRMbXB6SWl3aWMzSmpMMnB6TDJOdmNtVXZjR0ZuWlhJdmFXNWtaWGd1YW5NaUxDSnpjbU12YW5NdlkyOXlaUzl3WVdkbGNpOXdZV2RsTG1weklpd2ljM0pqTDJwekwyTnZjbVV2Y0d4aGRHWnZjbTB2YVc1a1pYZ3Vhbk1pTENKemNtTXZhbk12WTI5eVpTOTFkR2xzY3k5cGJtUmxlQzVxY3lJc0luTnlZeTlxY3k5cGJtUmxlQzVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFUczdRVU5CUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN096czdPenM3T3pzN096czdPMEZETlhKRFFUczdPenRCUVVOQk96czdPMEZCUTBFN08wRkJRMEU3T3pzN1FVRkRRVHM3T3pzN096czdLMlZCVkVFN096czdPenM3UVVGWFFTeEpRVUZOTEZsQlFXRXNXVUZCVFR0QlFVTjJRanM3T3pzN08wRkJUVUVzVFVGQlRTeFBRVUZQTEZkQlFXSTdRVUZEUVN4TlFVRk5MRlZCUVZVc1QwRkJhRUk3UVVGRFFTeE5RVUZOTEhGQ1FVRnhRanRCUVVONlFpeGhRVUZUTzBGQlJHZENMRWRCUVROQ08wRkJSMEVzVFVGQlRTeDNRa0ZCZDBJc1JVRkJPVUk3TzBGQlIwRTdPenM3T3p0QlFXWjFRaXhOUVhGQ2FrSXNVMEZ5UW1sQ08wRkJRVUU3TzBGQmRVSnlRaXg1UWtGQk1FSTdRVUZCUVN4VlFVRmtMRTlCUVdNc2RVVkJRVW9zUlVGQlNUczdRVUZCUVRzN1FVRkJRU3gzU0VGRGJFSXNTVUZFYTBJc1JVRkRXaXhQUVVSWkxFVkJRMGdzYTBKQlJFY3NSVUZEYVVJc1QwRkVha0lzUlVGRE1FSXNjVUpCUkRGQ0xFVkJRMmxFTEV0QlJHcEVMRVZCUTNkRUxFdEJSSGhFT3p0QlFVZDRRaXhaUVVGTExGTkJRVXdzUjBGQmFVSXNSVUZCYWtJN08wRkJSVUVzVlVGQlRTeFZRVUZWTEUxQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzWjBKQlFYSkNMRzlDUVVGMVJDeEpRVUYyUkN4UlFVRm9RanRCUVVOQkxHTkJRVkVzVDBGQlVpeERRVUZuUWl4VlFVRkRMRTFCUVVRc1JVRkJXVHRCUVVNeFFpeFpRVUZOTEdGQlFXRXNUMEZCVHl4WlFVRlFMRU5CUVc5Q0xFMUJRWEJDTEVOQlFXNUNPMEZCUTBFc1dVRkJUU3hYUVVGWExGTkJRVk1zWVVGQlZDeERRVUYxUWl4VlFVRjJRaXhEUVVGcVFqczdRVUZGUVN4WlFVRkpMRkZCUVVvc1JVRkJZenRCUVVOYUxHZENRVUZMTEZkQlFVd3NRMEZCYVVJc1VVRkJha0k3UVVGRFJEdEJRVU5HTEU5QlVFUTdRVUZPZDBJN1FVRmpla0k3TzBGQmNrTnZRanRCUVVGQk8wRkJRVUVzY1VOQmRVTk9MRXRCZGtOTkxFVkJkVU5ETzBGQlEzQkNMRmxCUVUwc1MwRkJTeXhOUVVGTkxFMUJRVTRzUTBGQllTeFpRVUZpTEVOQlFUQkNMRTFCUVRGQ0xFTkJRVmc3UVVGRFFTeFpRVUZOTEZWQlFWVXNVMEZCVXl4aFFVRlVMRU5CUVhWQ0xFVkJRWFpDTEVOQlFXaENPenRCUVVWQkxHRkJRVXNzV1VGQlRDeERRVUZyUWl4UFFVRnNRanRCUVVORU8wRkJOVU52UWp0QlFVRkJPMEZCUVVFc2EwTkJPRU5VTEU5Qk9VTlRMRVZCT0VOQk8wRkJRMjVDTEZsQlFVMHNWMEZCVnl4MVFrRkJZVHRCUVVNMVFqdEJRVVEwUWl4VFFVRmlMRU5CUVdwQ08wRkJSMEVzWVVGQlN5eFRRVUZNTEVOQlFXVXNTVUZCWml4RFFVRnZRaXhSUVVGd1FqczdRVUZGUVN4bFFVRlBMRkZCUVZBN1FVRkRSRHRCUVhKRWIwSTdRVUZCUVR0QlFVRkJMR3REUVhWRVZDeFBRWFpFVXl4RlFYVkVRVHRCUVVOdVFpeFpRVUZKTEZkQlFWY3NTMEZCU3l4VFFVRk1MRU5CUVdVc1NVRkJaaXhEUVVGdlFqdEJRVUZCTEdsQ1FVRkxMRVZCUVVVc1QwRkJSaXhEUVVGVkxFOUJRVllzUTBGQmEwSXNXVUZCYkVJc1EwRkJLMElzU1VGQkwwSXNUVUZCZVVNc1VVRkJVU3haUVVGU0xFTkJRWEZDTEVsQlFYSkNMRU5CUVRsRE8wRkJRVUVzVTBGQmNFSXNRMEZCWmpzN1FVRkZRU3haUVVGSkxFTkJRVU1zVVVGQlRDeEZRVUZsTzBGQlEySTdRVUZEUVN4eFFrRkJWeXhMUVVGTExGZEJRVXdzUlVGQldEdEJRVU5FT3p0QlFVVkVMR1ZCUVU4c1VVRkJVRHRCUVVORU8wRkJhRVZ2UWp0QlFVRkJPMEZCUVVFc2NVTkJhMFZPTzBGQlEySXNaVUZCVHl4TFFVRkxMRk5CUVZvN1FVRkRSRHRCUVhCRmIwSTdRVUZCUVR0QlFVRkJMRzFEUVhORlVpeFpRWFJGVVN4RlFYTkZUVHRCUVVONlFpeFpRVUZOTEZkQlFWY3NTMEZCU3l4WFFVRk1MRU5CUVdsQ0xGbEJRV3BDTEVOQlFXcENPMEZCUTBFc1lVRkJTeXhUUVVGTUxFTkJRV1VzVDBGQlppeERRVUYxUWl4VlFVRkRMRU5CUVVRc1JVRkJUenRCUVVNMVFpeGpRVUZKTEVWQlFVVXNUMEZCUml4RFFVRlZMRTlCUVZZc1EwRkJhMElzV1VGQmJFSXNRMEZCSzBJc1NVRkJMMElzVFVGQmVVTXNZVUZCWVN4WlFVRmlMRU5CUVRCQ0xFbEJRVEZDTEVOQlFUZERMRVZCUVRoRk8wRkJRelZGTEdOQlFVVXNTVUZCUmp0QlFVTkVMRmRCUmtRc1RVRkZUenRCUVVOTUxIRkNRVUZUTEUxQlFWUTdRVUZEUkR0QlFVTkdMRk5CVGtRN1FVRlBSRHRCUVM5RmIwSTdRVUZCUVR0QlFVRkJMREpDUVdsR2FFSXNWVUZxUm1kQ0xFVkJhVVpLTzBGQlEyWXNXVUZCU1N4WFFVRlhMRlZCUVdZN1FVRkRRU3haUVVGSkxFOUJRVThzVlVGQlVDeExRVUZ6UWl4UlFVRXhRaXhGUVVGdlF6dEJRVU5zUXl4eFFrRkJWeXhUUVVGVExHRkJRVlFzUTBGQmRVSXNWVUZCZGtJc1EwRkJXRHRCUVVORU96dEJRVVZFTEZsQlFVa3NRMEZCUXl4UlFVRk1MRVZCUVdVN1FVRkRZaXhuUWtGQlRTeEpRVUZKTEV0QlFVb3NRMEZCWVN4SlFVRmlMREJDUVVGelF5eFZRVUYwUXl4cFEwRkJUanRCUVVORU96dEJRVVZFTEdGQlFVc3NXVUZCVEN4RFFVRnJRaXhSUVVGc1FqczdRVUZGUVN4bFFVRlBMRWxCUVZBN1FVRkRSRHRCUVRsR2IwSTdRVUZCUVR0QlFVRkJMREpDUVdkSGFFSXNWVUZvUjJkQ0xFVkJaMGRLTzBGQlEyWXNXVUZCU1N4WFFVRlhMRlZCUVdZN1FVRkRRU3haUVVGSkxFOUJRVThzVlVGQlVDeExRVUZ6UWl4UlFVRXhRaXhGUVVGdlF6dEJRVU5zUXl4eFFrRkJWeXhUUVVGVExHRkJRVlFzUTBGQmRVSXNWVUZCZGtJc1EwRkJXRHRCUVVORU96dEJRVVZFTEZsQlFVa3NRMEZCUXl4UlFVRk1MRVZCUVdVN1FVRkRZaXhuUWtGQlRTeEpRVUZKTEV0QlFVb3NRMEZCWVN4SlFVRmlMREJDUVVGelF5eFZRVUYwUXl4cFEwRkJUanRCUVVORU96dEJRVVZFTEZsQlFVMHNZMEZCWXl4TFFVRkxMRmRCUVV3c1EwRkJhVUlzVVVGQmFrSXNRMEZCY0VJN1FVRkRRU3hsUVVGUExGbEJRVmtzU1VGQldpeEZRVUZRTzBGQlEwUTdRVUUxUjI5Q08wRkJRVUU3UVVGQlFTeHZRMEU0UjBFc1QwRTVSMEVzUlVFNFIxTTdRVUZETlVJc0swZEJRVEpDTEZOQlFUTkNMRVZCUVhORExFOUJRWFJETzBGQlEwUTdRVUZvU0c5Q096dEJRVUZCTzBGQlFVRTdPMEZCYlVoMlFqczdPenM3T3p0QlFVdEJMRTFCUVUwc1lVRkJZU3hGUVVGdVFqczdRVUZGUVN4TlFVRk5MR0ZCUVdFc1UwRkJVeXhuUWtGQlZDeFBRVUU0UWl4SlFVRTVRaXhEUVVGdVFqdEJRVU5CTEUxQlFVa3NWVUZCU2l4RlFVRm5RanRCUVVOa0xHVkJRVmNzVDBGQldDeERRVUZ0UWl4VlFVRkRMRTlCUVVRc1JVRkJZVHRCUVVNNVFpeFZRVUZOTEZOQlFWTXNNa05CUVc5Q0xFOUJRWEJDTEVWQlFUWkNMR3RDUVVFM1FpeEZRVUZwUkN4eFFrRkJha1FzUTBGQlpqdEJRVU5CTEdGQlFVOHNUMEZCVUN4SFFVRnBRaXhQUVVGcVFqczdRVUZGUVN4cFFrRkJWeXhKUVVGWUxFTkJRV2RDTEZWQlFWVXNZVUZCVml4RFFVRjNRaXhOUVVGNFFpeERRVUZvUWp0QlFVTkVMRXRCVEVRN1FVRk5SRHM3UVVGRlJDeE5RVUZKTEZWQlFVb3NSVUZCWjBJN1FVRkRaQ3hoUVVGVExHZENRVUZVTEVOQlFUQkNMRTlCUVRGQ0xFVkJRVzFETEZWQlFVTXNTMEZCUkN4RlFVRlhPMEZCUXpWRExGVkJRVTBzYVVKQlFXbENMRTFCUVUwc1RVRkJUaXhEUVVGaExGbEJRV0lzUTBGQk1FSXNZVUZCTVVJc1EwRkJka0k3UVVGRFFTeFZRVUZKTEd0Q1FVRnJRaXh0UWtGQmJVSXNTVUZCZWtNc1JVRkJLME03UVVGRE4wTXNXVUZCVFN4aFFVRmhMRTFCUVUwc1RVRkJUaXhEUVVGaExGbEJRV0lzUTBGQk1FSXNZVUZCTVVJc1MwRkJORU1zVFVGQlRTeE5RVUZPTEVOQlFXRXNXVUZCWWl4RFFVRXdRaXhOUVVFeFFpeERRVUV2UkR0QlFVTkJMRmxCUVUwc1lVRkJZU3hUUVVGVExHRkJRVlFzUTBGQmRVSXNWVUZCZGtJc1EwRkJia0k3TzBGQlJVRXNXVUZCVFN4WlFVRlpMRGhDUVVGclFpeE5RVUZOTEUxQlFYaENMRVZCUVdkRExGZEJRV2hETEVOQlFXeENPenRCUVVWQkxGbEJRVWtzWTBGQll5eEpRVUZzUWl4RlFVRjNRanRCUVVOMFFqdEJRVU5FT3p0QlFVVkVMRmxCUVUwc1kwRkJZeXhWUVVGVkxGbEJRVllzUTBGQmRVSXNTVUZCZGtJc1EwRkJjRUk3UVVGRFFTeFpRVUZOTEZsQlFWa3NWMEZCVnl4SlFVRllMRU5CUVdkQ08wRkJRVUVzYVVKQlFVc3NSVUZCUlN4VlFVRkdMRWRCUVdVc1dVRkJaaXhEUVVFMFFpeEpRVUUxUWl4TlFVRnpReXhYUVVFelF6dEJRVUZCTEZOQlFXaENMRU5CUVd4Q096dEJRVVZCTEZsQlFVa3NRMEZCUXl4VFFVRk1MRVZCUVdkQ08wRkJRMlE3UVVGRFJEczdRVUZGUkR0QlFVTkJMRmxCUVUwc2FVSkJRV2xDTEZWQlFWVXNXVUZCVml4SFFVRjVRaXhKUVVGNlFpeERRVUU0UWp0QlFVRkJMR2xDUVVGTExFVkJRVVVzVlVGQlJpeFBRVUZ0UWl4VlFVRjRRanRCUVVGQkxGTkJRVGxDTEVOQlFYWkNPMEZCUTBFc1dVRkJTU3hEUVVGRExHTkJRVXdzUlVGQmNVSTdRVUZEYmtJc2IwSkJRVlVzVjBGQlZpeERRVUZ6UWl4VlFVRjBRanRCUVVORU96dEJRVVZFTEd0Q1FVRlZMRWxCUVZZc1EwRkJaU3hWUVVGbU8wRkJRMFE3UVVGRFJpeExRVE5DUkR0QlFUUkNSRHM3UVVGRlJDeFRRVUZQTEZOQlFWQTdRVUZEUkN4RFFYQkxhVUlzUlVGQmJFSTdPMnRDUVhOTFpTeFRPenM3T3pzN096czdPenM3TzBGRE5VdG1PenM3TzBGQlEwRTdPMEZCUTBFN096czdRVUZEUVRzN096czdPenM3SzJWQlVrRTdPenM3T3pzN1FVRlZRU3hKUVVGTkxGZEJRVmtzV1VGQlRUdEJRVU4wUWpzN096czdPMEZCVFVFc1RVRkJUU3hQUVVGUExGVkJRV0k3UVVGRFFTeE5RVUZOTEZWQlFWVXNUMEZCYUVJN1FVRkRRU3hOUVVGTkxIRkNRVUZ4UWp0QlFVTjZRaXhoUVVGVExFbEJSR2RDTzBGQlJYcENMRmxCUVZFN1FVRkdhVUlzUjBGQk0wSTdRVUZKUVN4TlFVRk5MSGRDUVVGM1FpeERRVU0xUWl4UlFVUTBRaXhEUVVFNVFqczdRVUZKUVRzN096czdPMEZCYWtKelFpeE5RWFZDYUVJc1VVRjJRbWRDTzBGQlFVRTdPMEZCZVVKd1FpeDNRa0ZCTUVJN1FVRkJRU3hWUVVGa0xFOUJRV01zZFVWQlFVb3NSVUZCU1RzN1FVRkJRVHM3UVVGQlFTeHpTRUZEYkVJc1NVRkVhMElzUlVGRFdpeFBRVVJaTEVWQlEwZ3NhMEpCUkVjc1JVRkRhVUlzVDBGRWFrSXNSVUZETUVJc2NVSkJSREZDTEVWQlEybEVMRXRCUkdwRUxFVkJRM2RFTEV0QlJIaEVPenRCUVVkNFFpeFpRVUZMTEZsQlFVd3NSMEZCYjBJc1MwRkJjRUk3TzBGQlJVRTdRVUZEUVN4VlFVRkpMRTFCUVVzc1QwRkJUQ3hEUVVGaExFMUJRV3BDTEVWQlFYbENPMEZCUTNaQ0xHTkJRVXNzU1VGQlREdEJRVU5FTzBGQlVuVkNPMEZCVTNwQ096dEJRV3hEYlVJN1FVRkJRVHRCUVVGQkxHdERRVzlEVWp0QlFVTldMR1ZCUVU4c1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4eFFrRkJja0lzUTBGQk1rTXNTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJlRVFzUlVGQmFVVXNUVUZCZUVVN1FVRkRSRHRCUVhSRGJVSTdRVUZCUVR0QlFVRkJMQ3RDUVhkRFdEdEJRVU5RTEZsQlFVa3NTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFRRVUZ5UWl4RFFVRXJRaXhSUVVFdlFpeERRVUYzUXl4TlFVRjRReXhEUVVGS0xFVkJRWEZFTzBGQlEyNUVMR2xDUVVGUExFdEJRVXNzU1VGQlRDeEZRVUZRTzBGQlEwUTdPMEZCUlVRc1pVRkJUeXhMUVVGTExFbEJRVXdzUlVGQlVEdEJRVU5FTzBGQk9VTnRRanRCUVVGQk8wRkJRVUVzTmtKQlowUmlPMEZCUVVFN08wRkJRMHdzV1VGQlNTeExRVUZMTEZsQlFWUXNSVUZCZFVJN1FVRkRja0lzYVVKQlFVOHNTMEZCVUR0QlFVTkVPenRCUVVWRUxGbEJRVWtzUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhUUVVGeVFpeERRVUVyUWl4UlFVRXZRaXhEUVVGM1F5eE5RVUY0UXl4RFFVRktMRVZCUVhGRU8wRkJRMjVFTEdsQ1FVRlBMRXRCUVZBN1FVRkRSRHM3UVVGRlJDeGhRVUZMTEZsQlFVd3NSMEZCYjBJc1NVRkJjRUk3TzBGQlJVRXNXVUZCVFN4alFVRmpMRk5CUVdRc1YwRkJZeXhIUVVGTk8wRkJRM2hDTEdsQ1FVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEZOQlFYSkNMRU5CUVN0Q0xFZEJRUzlDTEVOQlFXMURMRTFCUVc1RE8wRkJRMEVzYVVKQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzVTBGQmNrSXNRMEZCSzBJc1RVRkJMMElzUTBGQmMwTXNXVUZCZEVNN1FVRkRRU3hwUWtGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXh0UWtGQmNrSXNRMEZCZVVNc2FVSkJRVTBzWTBGQkwwTXNSVUZCSzBRc1YwRkJMMFE3TzBGQlJVRXNhVUpCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNXVUZCY2tJc1EwRkJhME1zWlVGQmJFTXNSVUZCYlVRc1NVRkJia1E3TzBGQlJVRXNhVUpCUVVzc1dVRkJUQ3hIUVVGdlFpeExRVUZ3UWp0QlFVTkVMRk5CVWtRN08wRkJWVUVzV1VGQlNTeERRVUZETEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzVTBGQmNrSXNRMEZCSzBJc1VVRkJMMElzUTBGQmQwTXNXVUZCZUVNc1EwRkJUQ3hGUVVFMFJEdEJRVU14UkN4bFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEZOQlFYSkNMRU5CUVN0Q0xFZEJRUzlDTEVOQlFXMURMRmxCUVc1RE8wRkJRMFE3TzBGQlJVUXNZVUZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeG5Ra0ZCY2tJc1EwRkJjME1zYVVKQlFVMHNZMEZCTlVNc1JVRkJORVFzVjBGQk5VUTdPMEZCUlVFc1dVRkJUU3hUUVVGVExFdEJRVXNzVTBGQlRDeEZRVUZtT3p0QlFVVkJMR0ZCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNTMEZCY2tJc1EwRkJNa0lzVFVGQk0wSXNSMEZCYjBNc1MwRkJjRU03TzBGQlJVRXNiVUpCUVZjc1dVRkJUVHRCUVVObUxHbENRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xFdEJRWEpDTEVOQlFUSkNMRTFCUVROQ0xFZEJRWFZETEUxQlFYWkRPMEZCUTBRc1UwRkdSQ3hGUVVWSExFVkJSa2c3TzBGQlNVRXNaVUZCVHl4SlFVRlFPMEZCUTBRN1FVRndSbTFDTzBGQlFVRTdRVUZCUVN3MlFrRnpSbUk3UVVGQlFUczdRVUZEVEN4WlFVRkpMRXRCUVVzc1dVRkJWQ3hGUVVGMVFqdEJRVU55UWl4cFFrRkJUeXhMUVVGUU8wRkJRMFE3TzBGQlJVUXNXVUZCU1N4RFFVRkRMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNVMEZCY2tJc1EwRkJLMElzVVVGQkwwSXNRMEZCZDBNc1RVRkJlRU1zUTBGQlRDeEZRVUZ6UkR0QlFVTndSQ3hwUWtGQlR5eExRVUZRTzBGQlEwUTdPMEZCUlVRc1lVRkJTeXhaUVVGTUxFZEJRVzlDTEVsQlFYQkNPenRCUVVWQkxGbEJRVTBzWTBGQll5eFRRVUZrTEZkQlFXTXNSMEZCVFR0QlFVTjRRaXhwUWtGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhUUVVGeVFpeERRVUVyUWl4TlFVRXZRaXhEUVVGelF5eFpRVUYwUXp0QlFVTkJMR2xDUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRXRCUVhKQ0xFTkJRVEpDTEUxQlFUTkNMRWRCUVc5RExFMUJRWEJETzBGQlEwRXNhVUpCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNiVUpCUVhKQ0xFTkJRWGxETEdsQ1FVRk5MR05CUVM5RExFVkJRU3RFTEZkQlFTOUVPenRCUVVWQkxHbENRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xGbEJRWEpDTEVOQlFXdERMR1ZCUVd4RExFVkJRVzFFTEV0QlFXNUVPenRCUVVWQkxHbENRVUZMTEZsQlFVd3NSMEZCYjBJc1MwRkJjRUk3UVVGRFJDeFRRVkpFT3p0QlFWVkJMR0ZCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNTMEZCY2tJc1EwRkJNa0lzVFVGQk0wSXNSMEZCYjBNc1MwRkJjRU03TzBGQlJVRXNXVUZCU1N4RFFVRkRMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNVMEZCY2tJc1EwRkJLMElzVVVGQkwwSXNRMEZCZDBNc1dVRkJlRU1zUTBGQlRDeEZRVUUwUkR0QlFVTXhSQ3hsUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRk5CUVhKQ0xFTkJRU3RDTEVkQlFTOUNMRU5CUVcxRExGbEJRVzVETzBGQlEwUTdPMEZCUlVRc1lVRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4blFrRkJja0lzUTBGQmMwTXNhVUpCUVUwc1kwRkJOVU1zUlVGQk5FUXNWMEZCTlVRN08wRkJSVUVzWVVGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhUUVVGeVFpeERRVUVyUWl4TlFVRXZRaXhEUVVGelF5eE5RVUYwUXpzN1FVRkZRU3hsUVVGUExFbEJRVkE3UVVGRFJEdEJRWFJJYlVJN1FVRkJRVHRCUVVGQkxHOURRWGRJUXl4UFFYaElSQ3hGUVhkSVZUdEJRVU0xUWl3MlIwRkJNa0lzVVVGQk0wSXNSVUZCY1VNc1QwRkJja003UVVGRFJEdEJRVEZJYlVJN08wRkJRVUU3UVVGQlFUczdRVUUyU0hSQ096czdPenM3TzBGQlMwRXNUVUZCVFN4aFFVRmhMRVZCUVc1Q096dEJRVVZCTEUxQlFVMHNXVUZCV1N4VFFVRlRMR2RDUVVGVUxFOUJRVGhDTEVsQlFUbENMRU5CUVd4Q08wRkJRMEVzVFVGQlNTeFRRVUZLTEVWQlFXVTdRVUZEWWl4alFVRlZMRTlCUVZZc1EwRkJhMElzVlVGQlF5eFBRVUZFTEVWQlFXRTdRVUZETjBJN1FVRkRRU3hWUVVGTkxGTkJRVk1zTWtOQlFXOUNMRTlCUVhCQ0xFVkJRVFpDTEd0Q1FVRTNRaXhGUVVGcFJDeHhRa0ZCYWtRc1EwRkJaanRCUVVOQkxHRkJRVThzVDBGQlVDeEhRVUZwUWl4UFFVRnFRanM3UVVGRlFTeHBRa0ZCVnl4SlFVRllMRU5CUVdkQ0xGTkJRVk1zWVVGQlZDeERRVUYxUWl4TlFVRjJRaXhEUVVGb1FqdEJRVU5FTEV0QlRrUTdRVUZQUkRzN1FVRkZSQ3hOUVVGSkxGTkJRVW9zUlVGQlpUdEJRVU5pTEdGQlFWTXNaMEpCUVZRc1EwRkJNRUlzVDBGQk1VSXNSVUZCYlVNc1ZVRkJReXhMUVVGRUxFVkJRVmM3UVVGRE5VTXNWVUZCVFN4VFFVRlRMRFpDUVVGcFFpeE5RVUZOTEUxQlFYWkNMRVZCUVN0Q0xHRkJRUzlDTEVOQlFXWTdRVUZEUVN4VlFVRkpMRU5CUVVNc1RVRkJUQ3hGUVVGaE8wRkJRMWc3UVVGRFJEczdRVUZGUkN4VlFVRk5MR2xDUVVGcFFpeFBRVUZQTEZsQlFWQXNRMEZCYjBJc1lVRkJjRUlzUTBGQmRrSTdPMEZCUlVFc1ZVRkJTU3hyUWtGQmEwSXNiVUpCUVcxQ0xFbEJRWHBETEVWQlFTdERPMEZCUXpkRExGbEJRVWtzUzBGQlN5eFBRVUZQTEZsQlFWQXNRMEZCYjBJc1lVRkJjRUlzUzBGQmMwTXNUMEZCVHl4WlFVRlFMRU5CUVc5Q0xFMUJRWEJDTEVOQlFTOURPMEZCUTBFc1lVRkJTeXhIUVVGSExFOUJRVWdzUTBGQlZ5eEhRVUZZTEVWQlFXZENMRVZCUVdoQ0xFTkJRVXc3TzBGQlJVRXNXVUZCVFN4WlFVRlpMRmRCUVZjc1NVRkJXQ3hEUVVGblFqdEJRVUZCTEdsQ1FVRkxMRVZCUVVVc1ZVRkJSaXhIUVVGbExGbEJRV1lzUTBGQk5FSXNTVUZCTlVJc1RVRkJjME1zUlVGQk0wTTdRVUZCUVN4VFFVRm9RaXhEUVVGc1FqczdRVUZGUVN4WlFVRkpMRU5CUVVNc1UwRkJUQ3hGUVVGblFqdEJRVU5rTzBGQlEwUTdPMEZCUlVRc2EwSkJRVlVzVFVGQlZqdEJRVU5FTzBGQlEwWXNTMEZ3UWtRN1FVRnhRa1E3TzBGQlJVUXNVMEZCVHl4UlFVRlFPMEZCUTBRc1EwRjRTMmRDTEVWQlFXcENPenRyUWtFd1MyVXNVVHM3T3pzN096czdPM0ZxUWtOd1RHWTdPenM3T3pzN1FVRkxRVHM3UVVGRFFUczdRVUZEUVRzN096dEJRVU5CT3pzN096czdPenRCUVVWQk96czdPenM3U1VGTmNVSXNVenRCUVVWdVFpeHhRa0ZCV1N4SlFVRmFMRVZCUVd0Q0xFOUJRV3hDTEVWQlFXMUpPMEZCUVVFc1VVRkJlRWNzWTBGQmQwY3NkVVZCUVhaR0xFVkJRWFZHTzBGQlFVRXNVVUZCYmtZc1QwRkJiVVlzZFVWQlFYcEZMRVZCUVhsRk8wRkJRVUVzVVVGQmNrVXNWMEZCY1VVc2RVVkJRWFpFTEVWQlFYVkVPenRCUVVGQk96dEJRVUZCTEZGQlFXNUVMSEZDUVVGdFJDeDFSVUZCTTBJc1MwRkJNa0k3UVVGQlFTeFJRVUZ3UWl4VlFVRnZRaXgxUlVGQlVDeExRVUZQT3p0QlFVRkJPenRCUVVOcVNTeFRRVUZMTEVsQlFVd3NSMEZCV1N4SlFVRmFPMEZCUTBFc1UwRkJTeXhQUVVGTUxFZEJRV1VzVDBGQlpqdEJRVU5CTEZOQlFVc3NUMEZCVEN4SFFVRmxMRTlCUVdZN08wRkJSVUU3UVVGRFFUczdPenM3T3pzN1FVRlJRU3hUUVVGTExGZEJRVXdzUjBGQmJVSXNWMEZCYmtJN1FVRkRRU3hUUVVGTExIRkNRVUZNTEVkQlFUWkNMSEZDUVVFM1FqdEJRVU5CTEZOQlFVc3NWVUZCVEN4SFFVRnJRaXhWUVVGc1FqdEJRVU5CTEZOQlFVc3NSVUZCVEN4SFFVRlZMSGRDUVVGV096dEJRVVZCTEZGQlFVMHNaVUZCWlN4RFFVRkRMRXRCUVVzc2NVSkJRVTRzU1VGQkswSXNTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhMUVVGNVFpeEpRVUUzUlRzN1FVRkZRU3hSUVVGSkxFOUJRVThzUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCY0VJc1MwRkJaME1zVVVGQmNFTXNSVUZCT0VNN1FVRkROVU1zVjBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4SFFVRjFRaXhUUVVGVExHRkJRVlFzUTBGQmRVSXNTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJjRU1zUTBGQmRrSTdRVUZEUkRzN1FVRkZSQ3hSUVVGSkxHZENRVUZuUWl4RFFVRkRMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV3hETEVWQlFUSkRPMEZCUTNwRExGbEJRVTBzU1VGQlNTeExRVUZLTEVOQlFXRXNTMEZCU3l4SlFVRnNRaXg1UTBGQlRqdEJRVU5FT3p0QlFVVkVMRk5CUVVzc1kwRkJUQ3hIUVVGelFpeExRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRXRCUVhsQ0xFbEJRUzlETzBGQlEwRXNVMEZCU3l4clFrRkJUQ3hIUVVFd1FpeEZRVUV4UWpzN1FVRkZRU3hSUVVGSkxFTkJRVU1zUzBGQlN5eGpRVUZXTEVWQlFUQkNPMEZCUTNoQ096czdPenM3T3p0QlFWRkJMRmRCUVVzc1QwRkJUQ3hIUVVGbExFOUJRVThzVFVGQlVDeERRVUZqTEV0QlFVc3NUMEZCYmtJc1JVRkJORUlzUzBGQlN5eGpRVUZNTEVOQlFXOUNMRXRCUVVzc1lVRkJUQ3hGUVVGd1FpeEZRVUV3UXl4UFFVRXhReXhEUVVFMVFpeERRVUZtT3p0QlFVVkJPMEZCUTBFc1YwRkJTeXhoUVVGTU8wRkJRMFE3TzBGQlJVUXNVMEZCU3l4bFFVRk1MRWRCUVhWQ08wRkJRVUVzWVVGQlV5eE5RVUZMTEc5Q1FVRk1MRU5CUVRCQ0xFdEJRVEZDTEVOQlFWUTdRVUZCUVN4TFFVRjJRanRCUVVORU96czdPMjFEUVVWakxGVXNSVUZCV1N4UExFVkJRVk03UVVGRGJFTXNWMEZCU3l4WFFVRk1MRU5CUVdsQ0xFOUJRV3BDTEVOQlFYbENMRlZCUVVNc1IwRkJSQ3hGUVVGVE8wRkJRMmhETEZsQlFVa3NVVUZCVVN4SFFVRlNMRU5CUVVvc1JVRkJhMEk3UVVGRGFFSXNjVUpCUVZjc1IwRkJXQ3hKUVVGclFpeFJRVUZSTEVkQlFWSXNRMEZCYkVJN1FVRkRSRHRCUVVOR0xFOUJTa1E3TzBGQlRVRXNZVUZCVHl4VlFVRlFPMEZCUTBRN096dHBRMEZGV1R0QlFVTllMR0ZCUVU4c1MwRkJTeXhQUVVGYU8wRkJRMFE3T3p0cFEwRkZXVHRCUVVOWUxHRkJRVThzUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCY0VJN1FVRkRSRHM3T3pSQ1FVVlBPMEZCUTA0c1lVRkJUeXhMUVVGTExFVkJRVm83UVVGRFJEczdPM0ZEUVVWblFpeFJMRVZCUVZVN1FVRkJRVHM3UVVGRGVrSXNaVUZCVXl4UFFVRlVMRU5CUVdsQ08wRkJRVUVzWlVGQlZ5eFBRVUZMTEdWQlFVd3NRMEZCY1VJc1QwRkJja0lzUTBGQldEdEJRVUZCTEU5QlFXcENPMEZCUTBRN096dHZRMEZGWlN4UExFVkJRVk03UVVGRGRrSXNZMEZCVVN4TlFVRlNMRU5CUVdVc1owSkJRV1lzUTBGQlowTXNVVUZCVVN4TFFVRjRReXhGUVVFclF5eExRVUZMTEdWQlFYQkVPMEZCUTBFc1YwRkJTeXhyUWtGQlRDeERRVUYzUWl4SlFVRjRRaXhEUVVFMlFpeFBRVUUzUWp0QlFVTkVPenM3ZVVOQlJXOUNPMEZCUVVFN08wRkJRMjVDTEZkQlFVc3NhMEpCUVV3c1EwRkJkMElzVDBGQmVFSXNRMEZCWjBNc1ZVRkJReXhQUVVGRUxFVkJRV0U3UVVGRE0wTXNaVUZCU3l4cFFrRkJUQ3hEUVVGMVFpeFBRVUYyUWp0QlFVTkVMRTlCUmtRN1FVRkhSRHM3TzNORFFVVnBRaXhQTEVWQlFWTTdRVUZEZWtJc1ZVRkJUU3g1UWtGQmVVSXNTMEZCU3l4clFrRkJUQ3hEUVVNMVFpeFRRVVEwUWl4RFFVTnNRanRCUVVGQkxHVkJRVTBzUjBGQlJ5eE5RVUZJTEV0QlFXTXNVVUZCVVN4TlFVRjBRaXhKUVVGblF5eEhRVUZITEV0QlFVZ3NTMEZCWVN4UlFVRlJMRXRCUVRORU8wRkJRVUVzVDBGRWEwSXNRMEZCTDBJN08wRkJSMEVzVlVGQlNTeDVRa0ZCZVVJc1EwRkJReXhEUVVFNVFpeEZRVUZwUXp0QlFVTXZRaXhuUWtGQlVTeE5RVUZTTEVOQlFXVXNiVUpCUVdZc1EwRkJiVU1zVVVGQlVTeExRVUV6UXl4RlFVRnJSQ3hMUVVGTExHVkJRWFpFTzBGQlEwRXNZVUZCU3l4clFrRkJUQ3hEUVVGM1FpeE5RVUY0UWl4RFFVRXJRaXh6UWtGQkwwSXNSVUZCZFVRc1EwRkJka1E3UVVGRFJDeFBRVWhFTEUxQlIwODdRVUZEVEN4blFrRkJVU3hMUVVGU0xESkRRVUZ6UkN4UlFVRlJMRTFCUVRsRUxIRkNRVUZ2Uml4UlFVRlJMRXRCUVRWR08wRkJRMFE3UVVGRFJqczdPMmxEUVVWWkxGTXNSVUZCYVVRN1FVRkJRU3hWUVVGMFF5eE5RVUZ6UXl4MVJVRkJOMElzUlVGQk5rSTdRVUZCUVN4VlFVRjZRaXhsUVVGNVFpeDFSVUZCVUN4TFFVRlBPenRCUVVNMVJDeFZRVUZKTEV0QlFVc3NWVUZCVkN4RlFVRnhRanRCUVVOdVFpeFpRVUZKTEdOQlFXTXNhVUpCUVUwc1NVRkJlRUlzUlVGQk9FSTdRVUZETlVJc2NVTkJRV2xDTEVkQlFXcENMRU5CUVhGQ0xFbEJRWEpDTzBGQlEwUXNVMEZHUkN4TlFVVlBMRWxCUVVrc1kwRkJZeXhwUWtGQlRTeEpRVUY0UWl4RlFVRTRRanRCUVVOdVF5eHhRMEZCYVVJc1RVRkJha0lzUTBGQmQwSXNTVUZCZUVJN1FVRkRSRHRCUVVOR096dEJRVVZFTEZWQlFVMHNkMEpCUVhOQ0xGVkJRVlVzVFVGQlZpeERRVUZwUWl4RFFVRnFRaXhGUVVGdlFpeFhRVUZ3UWl4RlFVRjBRaXhIUVVFd1JDeFZRVUZWTEV0QlFWWXNRMEZCWjBJc1EwRkJhRUlzUTBGQmFFVTdPMEZCUlVFN1FVRkRRU3hWUVVGSkxFOUJRVThzUzBGQlN5eFBRVUZNTEVOQlFXRXNVMEZCWWl4RFFVRlFMRXRCUVcxRExGVkJRWFpETEVWQlFXMUVPMEZCUTJwRUxHRkJRVXNzVDBGQlRDeERRVUZoTEZOQlFXSXNSVUZCZDBJc1MwRkJlRUlzUTBGQk9FSXNTVUZCT1VJc1JVRkJiME1zUTBGQlF5eE5RVUZFTEVOQlFYQkRPMEZCUTBRN08wRkJSVVFzVlVGQlNTeFBRVUZQTEV0QlFVc3NUMEZCVEN4RFFVRmhMR05CUVdJc1EwRkJVQ3hMUVVGM1F5eFZRVUUxUXl4RlFVRjNSRHRCUVVOMFJDeGhRVUZMTEU5QlFVd3NRMEZCWVN4alFVRmlMRVZCUVRaQ0xFdEJRVGRDTEVOQlFXMURMRWxCUVc1RExFVkJRWGxETEVOQlFVTXNUVUZCUkN4RFFVRjZRenRCUVVORU96dEJRVVZFTEZWQlFVa3NaVUZCU2l4RlFVRnhRanRCUVVOdVFqdEJRVU5FT3p0QlFVVkVPMEZCUTBFc1ZVRkJTU3hMUVVGTExFOUJRVXdzUTBGQllTeFBRVUZxUWl4RlFVRXdRanRCUVVONFFpdzBRMEZCY1VJc1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQmJFTXNSVUZCTWtNc1UwRkJNME1zUlVGQmMwUXNTMEZCU3l4SlFVRXpSQ3hGUVVGcFJTeE5RVUZxUlR0QlFVTkVMRTlCUmtRc1RVRkZUenRCUVVOTUxESkRRVUZ2UWl4VFFVRndRaXhGUVVFclFpeExRVUZMTEVsQlFYQkRMRVZCUVRCRExFMUJRVEZETzBGQlEwUTdRVUZEUmpzN08yOURRVVZsTzBGQlEyUXNWVUZCU1N4TFFVRkxMRmRCUVV3c1EwRkJhVUlzVFVGQmFrSXNSMEZCTUVJc1EwRkJPVUlzUlVGQmFVTTdRVUZETDBJc2JVUkJRVzlDTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdwRExFVkJRVEJETEV0QlFVc3NUMEZCTDBNc1JVRkJkMFFzUzBGQlN5eFhRVUUzUkR0QlFVTkVPMEZCUTBZN096dHZRMEZGWlR0QlFVTmtMRlZCUVUwc1ZVRkJWU3hQUVVGUExFMUJRVkFzUTBGQll5eEZRVUZrTEVWQlFXdENMRXRCUVVzc1QwRkJka0lzUTBGQmFFSTdRVUZEUVN4aFFVRlBMREpEUVVGdlFpeExRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRnFReXhGUVVFd1F5eFBRVUV4UXl4RlFVRnRSQ3hMUVVGTExGZEJRWGhFTEVOQlFWQTdRVUZEUkRzN1FVRkZSRHM3T3pzN096czdjME5CUzJ0Q08wRkJRMmhDTEdGQlFVOHNTMEZCU3l4VlFVRk1MRWxCUVcxQ0xFTkJRVU1zTWtKQlFXbENMRkZCUVdwQ0xFTkJRVEJDTEVsQlFURkNMRU5CUVROQ08wRkJRMFE3T3p0NVEwRkZiMElzU3l4RlFVRlBPMEZCUXpGQ0xGVkJRVWtzUzBGQlN5eGxRVUZNTEVWQlFVb3NSVUZCTkVJN1FVRkRNVUk3UVVGRFJEczdRVUZGUkN4WFFVRkxMR05CUVV3c1EwRkJiMElzUzBGQmNFSTdRVUZEUkRzN08yMURRVVZqTEVzc1JVRkJUenRCUVVOd1FqdEJRVU5FT3pzN2EwTkJSVzlDTEdNc1JVRkJaMElzVHl4RlFVRlRPMEZCUXpWRExHRkJRVThzU1VGQlNTeGpRVUZLTEVOQlFXMUNMRTlCUVc1Q0xFTkJRVkE3UVVGRFJEczdPenM3TzJ0Q1FYWkxhMElzVXpzN096czdPenM3T3pzN1VVTlNUQ3h0UWl4SFFVRkJMRzFDTzFGQmQwSkJMRzFDTEVkQlFVRXNiVUk3TzBGQkwwSm9RaXhKUVVGTkxHVkJRV1VzVTBGQlppeFpRVUZsTEVOQlFVTXNTMEZCUkN4RlFVRlJMRTFCUVZJc1JVRkJiVUk3UVVGRGRFTXNUVUZCU1N4VlFVRlZMRVZCUVdRc1JVRkJhMEk3UVVGRGFFSXNjVUpCUVdVc1RVRkJaanRCUVVORU8wRkJRMFFzYlVKQlFXVXNTMEZCWml4VFFVRjNRaXhOUVVGNFFqdEJRVU5FTEVOQlRFUTdPMEZCVDA4c1UwRkJVeXh0UWtGQlZDeERRVUUyUWl4UFFVRTNRaXhGUVVGdFJUdEJRVUZCTEUxQlFUZENMRWRCUVRaQ0xIVkZRVUYyUWl4RlFVRjFRanRCUVVGQkxFMUJRVzVDTEV0QlFXMUNPMEZCUVVFc1RVRkJXaXhMUVVGWkxIVkZRVUZLTEVWQlFVazdPMEZCUTNoRkxFMUJRVTBzVDBGQlR5eFBRVUZQTEVsQlFWQXNRMEZCV1N4SFFVRmFMRU5CUVdJN08wRkJSVUVzVDBGQlN5eFBRVUZNTEVOQlFXRXNWVUZCUXl4SFFVRkVMRVZCUVZNN1FVRkRjRUlzVVVGQlNTeFZRVUZWTEVWQlFWWXNTVUZCWjBJc1RVRkJUU3hQUVVGT0xFTkJRV01zUjBGQlpDeE5RVUYxUWl4RFFVRkRMRU5CUVRWRExFVkJRU3RETzBGQlF6ZERPMEZCUTBFN1FVRkRSRHM3UVVGRlJDeFJRVUZKTEZGQlFVOHNTVUZCU1N4SFFVRktMRU5CUVZBc1RVRkJiMElzVVVGQmNFSXNTVUZCWjBNc1NVRkJTU3hIUVVGS0xFMUJRV0VzU1VGQmFrUXNSVUZCZFVRN1FVRkRja1FzVlVGQlNTeFhRVUZYTEVkQlFXWTdRVUZEUVN4VlFVRkpMRlZCUVZVc1JVRkJaQ3hGUVVGclFqdEJRVU5vUWl4dFFrRkJZeXhMUVVGa0xGTkJRWFZDTEVkQlFYWkNPMEZCUTBRN08wRkJSVVFzTUVKQlFXOUNMRTlCUVhCQ0xFVkJRVFpDTEVsQlFVa3NSMEZCU2l4RFFVRTNRaXhGUVVGMVF5eExRVUYyUXl4RlFVRTRReXhSUVVFNVF6dEJRVU5CTzBGQlEwUTdPMEZCUlVRc1VVRkJUU3hQUVVGUExHRkJRV0VzUzBGQllpeEZRVUZ2UWl4SFFVRndRaXhEUVVGaU8wRkJRMEVzV1VGQlVTeFpRVUZTTEVOQlFYRkNMRWxCUVhKQ0xFVkJRVEpDTEVsQlFVa3NSMEZCU2l4RFFVRXpRanRCUVVORUxFZEJiRUpFTzBGQmJVSkVPenRCUVVWTkxGTkJRVk1zYlVKQlFWUXNRMEZCTmtJc1QwRkJOMElzUlVGQmJVVTdRVUZCUVN4TlFVRTNRaXhIUVVFMlFpeDFSVUZCZGtJc1JVRkJkVUk3UVVGQlFTeE5RVUZ1UWl4TFFVRnRRanRCUVVGQkxFMUJRVm9zUzBGQldTeDFSVUZCU2l4RlFVRkpPenRCUVVONFJTeE5RVUZOTEZOQlFWTXNUMEZCVHl4TlFVRlFMRU5CUVdNc1JVRkJaQ3hGUVVGclFpeEhRVUZzUWl4RFFVRm1PMEZCUTBFc1RVRkJUU3hQUVVGUExFOUJRVThzU1VGQlVDeERRVUZaTEVkQlFWb3NRMEZCWWpzN1FVRkZRU3hQUVVGTExFOUJRVXdzUTBGQllTeFZRVUZETEVkQlFVUXNSVUZCVXp0QlFVTndRaXhSUVVGSkxGVkJRVlVzUlVGQlZpeEpRVUZuUWl4TlFVRk5MRTlCUVU0c1EwRkJZeXhIUVVGa0xFMUJRWFZDTEVOQlFVTXNRMEZCTlVNc1JVRkJLME03UVVGRE4wTTdRVUZEUVR0QlFVTkVPenRCUVVWRUxGRkJRVWtzU1VGQlNTeEhRVUZLTEUxQlFXRXNTVUZCWWl4SlFVRnhRaXhKUVVGSkxFZEJRVW9zUlVGQlV5eFhRVUZVTEV0QlFYbENMRTFCUVd4RUxFVkJRVEJFTzBGQlEzaEVMRlZCUVVrc1YwRkJWeXhIUVVGbU8wRkJRMEVzVlVGQlNTeFZRVUZWTEVWQlFXUXNSVUZCYTBJN1FVRkRhRUlzYlVKQlFXTXNTMEZCWkN4VFFVRjFRaXhIUVVGMlFqdEJRVU5FT3p0QlFVVkVMR0ZCUVU4c1IwRkJVQ3hKUVVGakxHOUNRVUZ2UWl4UFFVRndRaXhGUVVFMlFpeEpRVUZKTEVkQlFVb3NRMEZCTjBJc1JVRkJkVU1zUzBGQmRrTXNSVUZCT0VNc1VVRkJPVU1zUTBGQlpEdEJRVU5CTzBGQlEwUTdPMEZCUlVRN1FVRkRRU3hSUVVGSkxGRkJRVkVzU1VGQlNTeEhRVUZLTEVOQlFWb3NRMEZxUW05Q0xFTkJhVUpETzBGQlEzSkNMRkZCUVUwc1kwRkJZeXhMUVVGa0xIbERRVUZqTEV0QlFXUXNRMEZCVGp0QlFVTkJMRkZCUVUwc1QwRkJUeXhoUVVGaExFdEJRV0lzUlVGQmIwSXNSMEZCY0VJc1EwRkJZanRCUVVOQkxGRkJRVTBzV1VGQldTeFJRVUZSTEZsQlFWSXNRMEZCY1VJc1NVRkJja0lzUTBGQmJFSTdPMEZCUlVFc1VVRkJTU3hqUVVGakxFbEJRV3hDTEVWQlFYZENPMEZCUTNSQ0xGVkJRVWtzVTBGQlV5eFRRVUZpTEVWQlFYZENPMEZCUTNSQ08wRkJRMEVzWjBKQlFWRXNZMEZCWXl4TlFVRjBRanRCUVVORUxFOUJTRVFzVFVGSFR5eEpRVUZKTEVOQlFVTXNUVUZCVFN4VFFVRk9MRU5CUVV3c1JVRkJkVUk3UVVGRE5VSXNaMEpCUVZFc1UwRkJVeXhUUVVGVUxFVkJRVzlDTEVWQlFYQkNMRU5CUVZJN1FVRkRSQ3hQUVVaTkxFMUJSVUU3UVVGRFRDeG5Ra0ZCVVN4VFFVRlNPMEZCUTBRN1FVRkRSanM3UVVGRlJDeFhRVUZQTEVkQlFWQXNTVUZCWXl4TFFVRmtPMEZCUTBRc1IwRnNRMFE3TzBGQmIwTkJMRk5CUVU4c1RVRkJVRHRCUVVORU96dEJRVVZFTEVsQlFVMHNVVUZCVVN4RlFVRmtPenRyUWtGRlpUdEJRVU5pTEV0QlJHRXNaVUZEVkN4VFFVUlRMRVZCUTBVN1FVRkRZaXhWUVVGTkxFbEJRVTRzUTBGQlZ5eFRRVUZZTzBGQlEwUXNSMEZJV1R0QlFVbGlMRkZCU21Fc2EwSkJTVTRzVTBGS1RTeEZRVWxMTzBGQlEyaENMRkZCUVUwc1VVRkJVU3hOUVVGTkxGTkJRVTRzUTBGQlowSTdRVUZCUVN4aFFVRkxMRTlCUVU4c1JVRkJVQ3hEUVVGVkxGTkJRVllzUlVGQmNVSXNRMEZCY2tJc1EwRkJURHRCUVVGQkxFdEJRV2hDTEVOQlFXUTdRVUZEUVN4UlFVRkpMRkZCUVZFc1EwRkJReXhEUVVGaUxFVkJRV2RDTzBGQlEyUXNXVUZCVFN4TlFVRk9MRU5CUVdFc1MwRkJZaXhGUVVGdlFpeERRVUZ3UWp0QlFVTkVPMEZCUTBZc1IwRlVXVHRCUVZWaUxGVkJWbUVzYjBKQlZVb3NVMEZXU1N4RlFWVlBPMEZCUTJ4Q0xGZEJRVThzVFVGQlRTeE5RVUZPTEV0QlFXbENMRU5CUVdwQ0xFbEJRWE5DTEU5QlFVOHNSVUZCVUN4RFFVRlZMRTFCUVUwc1RVRkJUU3hOUVVGT0xFZEJRV1VzUTBGQmNrSXNRMEZCVml4RlFVRnRReXhUUVVGdVF5eERRVUUzUWp0QlFVTkVPMEZCV2xrc1F6czdPenM3T3pzN096czdPenRCUTNoRlpqczdPenRCUVVOQk96czdPMEZCUTBFN096czdPenM3T3l0bFFWQkJPenM3T3pzN08wRkJVMEVzU1VGQlRTeFRRVUZWTEZsQlFVMDdRVUZEY0VJN096czdPenRCUVUxQkxFMUJRVTBzVDBGQlR5eFJRVUZpTzBGQlEwRXNUVUZCVFN4VlFVRlZMRTlCUVdoQ08wRkJRMEVzVFVGQlRTeHZRa0ZCYjBJc2FVSkJRVEZDTzBGQlEwRXNUVUZCVFN4eFFrRkJjVUk3UVVGRGVrSXNZVUZCVXl4SlFVUm5RanRCUVVWNlFpeFhRVUZQTEVsQlJtdENPMEZCUjNwQ0xHRkJRVk1zU1VGSVowSTdRVUZKZWtJc1owSkJRVms3UVVGS1lTeEhRVUV6UWp0QlFVMUJMRTFCUVUwc2QwSkJRWGRDTEVOQlF6VkNMRmxCUkRSQ0xFTkJRVGxDT3p0QlFVbEJPenM3T3pzN1FVRndRbTlDTEUxQk1FSmtMRTFCTVVKak8wRkJRVUU3TzBGQk5FSnNRaXh6UWtGQk1FSTdRVUZCUVN4VlFVRmtMRTlCUVdNc2RVVkJRVW9zUlVGQlNUczdRVUZCUVRzN1FVRkJRU3hyU0VGRGJFSXNTVUZFYTBJc1JVRkRXaXhQUVVSWkxFVkJRMGdzYTBKQlJFY3NSVUZEYVVJc1QwRkVha0lzUlVGRE1FSXNjVUpCUkRGQ0xFVkJRMmxFTEVsQlJHcEVMRVZCUTNWRUxFbEJSSFpFT3p0QlFVZDRRaXhaUVVGTExGRkJRVXdzUjBGQlowSXNTMEZEYUVJc2EwUkJSR2RDTEVkQlJXUXNORU5CUm1Nc1IwRkhXaXc0UWtGSVdTeEhRVWxXTERaQ1FVcFZMRWRCUzFJc1owTkJURkVzUjBGTlZpeFJRVTVWTEVkQlQxWXNNa0pCVUZVc1IwRlJVaXhUUVZKUkxFZEJVMVlzVVVGVVZTeEhRVlZXTERaQ1FWWlZMRWRCVjFJc2FVWkJXRkVzUjBGWlZpeFJRVnBWTEVkQllWb3NVVUZpV1N4SFFXTmtMRkZCWkdNc1IwRmxhRUlzVVVGbVFUczdRVUZwUWtFc1ZVRkJTU3hOUVVGTExHTkJRVlFzUlVGQmVVSTdRVUZEZGtJc1kwRkJTeXhMUVVGTU8wRkJRMFE3UVVGMFFuVkNPMEZCZFVKNlFqczdRVUZ1UkdsQ08wRkJRVUU3UVVGQlFTdzRRa0Z4UkZZN1FVRkRUaXhaUVVGTkxGVkJRVlVzVTBGQlV5eGhRVUZVTEVOQlFYVkNMRXRCUVhaQ0xFTkJRV2hDT3p0QlFVVkJMR2RDUVVGUkxGTkJRVklzUjBGQmIwSXNTMEZCU3l4UlFVRjZRanM3UVVGRlFTeGhRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRWRCUVhWQ0xGRkJRVkVzVlVGQkwwSTdPMEZCUlVFN1FVRkRRU3haUVVGSkxFdEJRVXNzVDBGQlRDeERRVUZoTEV0QlFXSXNTMEZCZFVJc1NVRkJNMElzUlVGQmFVTTdRVUZETDBJc1pVRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4aFFVRnlRaXhEUVVGdFF5eGxRVUZ1UXl4RlFVRnZSQ3hUUVVGd1JDeEhRVUZuUlN4TFFVRkxMRTlCUVV3c1EwRkJZU3hMUVVFM1JUdEJRVU5FT3p0QlFVVkVPMEZCUTBFc1dVRkJTU3hMUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEV0QlFYbENMRWxCUVRkQ0xFVkJRVzFETzBGQlEycERMR1ZCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNZVUZCY2tJc1EwRkJiVU1zWTBGQmJrTXNSVUZCYlVRc1ZVRkJia1FzUTBGQk9FUXNVMEZCT1VRc1IwRkJNRVVzUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCZGtZN1FVRkRSRHM3UVVGRlJDeHBRa0ZCVXl4SlFVRlVMRU5CUVdNc1YwRkJaQ3hEUVVFd1FpeExRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRjJRenM3UVVGRlFTeGhRVUZMTEdGQlFVdzdRVUZEUkR0QlFYcEZhVUk3UVVGQlFUdEJRVUZCTEhORFFUSkZSanRCUVVOa0xGbEJRVTBzVjBGQlZ5eFRRVUZUTEdGQlFWUXNRMEZCZFVJc1MwRkJka0lzUTBGQmFrSTdRVUZEUVN4cFFrRkJVeXhaUVVGVUxFTkJRWE5DTEZOQlFYUkNMRVZCUVdsRExFdEJRVXNzUlVGQmRFTTdRVUZEUVN4cFFrRkJVeXhUUVVGVUxFTkJRVzFDTEVkQlFXNUNMRU5CUVhWQ0xHbENRVUYyUWpzN1FVRkZRU3hwUWtGQlV5eEpRVUZVTEVOQlFXTXNWMEZCWkN4RFFVRXdRaXhSUVVFeFFqdEJRVU5FTzBGQmFrWnBRanRCUVVGQk8wRkJRVUVzYjBOQmJVWktPMEZCUTFvc1pVRkJUeXhUUVVGVExHRkJRVlFzVDBGQk1rSXNhVUpCUVROQ0xHdENRVUY1UkN4TFFVRkxMRVZCUVRsRUxGRkJRVkE3UVVGRFJEdEJRWEpHYVVJN1FVRkJRVHRCUVVGQkxDdENRWFZHVkR0QlFVTlFMRmxCUVUwc1owSkJRV2RDTEU5QlFVOHNaMEpCUVZBc1EwRkJkMElzUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCY2tNc1EwRkJkRUk3UVVGRFFUdEJRVU5CTEZsQlFVMHNVMEZCVXl4alFVRmpMRTFCUVdRc1EwRkJjVUlzUzBGQmNrSXNRMEZCTWtJc1EwRkJNMElzUlVGQk9FSXNZMEZCWXl4TlFVRmtMRU5CUVhGQ0xFMUJRWEpDTEVkQlFUaENMRU5CUVRWRUxFTkJRV1k3TzBGQlJVRXNXVUZCVFN4TlFVRlBMRTlCUVU4c1YwRkJVQ3hIUVVGeFFpeERRVUYwUWl4SFFVRTBRaXhUUVVGVExFTkJRV3BFTzBGQlEwRXNZVUZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeExRVUZ5UWl4RFFVRXlRaXhIUVVFelFpeEhRVUZ2UXl4SFFVRndRenRCUVVORU8wRkJPVVpwUWp0QlFVRkJPMEZCUVVFc05rSkJaMGRZTzBGQlFVRTdPMEZCUTB3c1dVRkJTU3hMUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEV0QlFYbENMRWxCUVRkQ0xFVkJRVzFETzBGQlEycERPMEZCUTBFc1pVRkJTeXhMUVVGTU8wRkJRMFE3TzBGQlJVUXNXVUZCU1N4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEZOQlFYSkNMRU5CUVN0Q0xGRkJRUzlDTEVOQlFYZERMRTFCUVhoRExFTkJRVW9zUlVGQmNVUTdRVUZEYmtRc2FVSkJRVThzUzBGQlVEdEJRVU5FT3p0QlFVVkVPMEZCUTBFc2JVSkJRVmNzV1VGQlRUdEJRVU5tTEdsQ1FVRkxMRmxCUVV3c1EwRkJhMElzYVVKQlFVMHNTVUZCZUVJN1FVRkRRU3hwUWtGQlN5eGhRVUZNT3p0QlFVVkJMR05CUVUwc1ZVRkJWU3hUUVVGV0xFOUJRVlVzUjBGQlRUdEJRVU53UWl4dFFrRkJTeXhaUVVGTUxFTkJRV3RDTEdsQ1FVRk5MRXRCUVhoQ08wRkJRMEVzYlVKQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzYlVKQlFYSkNMRU5CUVhsRExHbENRVUZOTEdOQlFTOURMRVZCUVN0RUxFOUJRUzlFT3p0QlFVVkJPMEZCUTBFc2JVSkJRVXNzV1VGQlREdEJRVU5FTEZkQlRrUTdPMEZCVVVFc2FVSkJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1owSkJRWEpDTEVOQlFYTkRMR2xDUVVGTkxHTkJRVFZETEVWQlFUUkVMRTlCUVRWRU96dEJRVVZCTEdsQ1FVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEZOQlFYSkNMRU5CUVN0Q0xFZEJRUzlDTEVOQlFXMURMRTFCUVc1RE96dEJRVVZCTEdsQ1FVRkxMRTFCUVV3N1FVRkRSQ3hUUVdwQ1JDeEZRV2xDUnl4RFFXcENTRHM3UVVGdFFrRXNaVUZCVHl4SlFVRlFPMEZCUTBRN1FVRXZTR2xDTzBGQlFVRTdRVUZCUVN4eFEwRnBTVWdzUzBGcVNVY3NSVUZwU1VrN1FVRkRjRUlzV1VGQlNTeE5RVUZOTEVsQlFVNHNTMEZCWlN4UFFVRm1MRWxCUVRCQ0xFMUJRVTBzVDBGQlRpeExRVUZyUWl4RlFVRTFReXhKUVVGclJDeE5RVUZOTEU5QlFVNHNTMEZCYTBJc1JVRkJlRVVzUlVGQk5FVTdRVUZETVVVN1FVRkRSRHM3UVVGRlJEdEJRVU5CTEdGQlFVc3NTVUZCVER0QlFVTkVPMEZCZUVscFFqdEJRVUZCTzBGQlFVRXNOa0pCTUVsWU8wRkJRVUU3TzBGQlEwd3NXVUZCU1N4RFFVRkRMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNVMEZCY2tJc1EwRkJLMElzVVVGQkwwSXNRMEZCZDBNc1RVRkJlRU1zUTBGQlRDeEZRVUZ6UkR0QlFVTndSQ3hwUWtGQlR5eExRVUZRTzBGQlEwUTdPMEZCUlVRc1lVRkJTeXhaUVVGTUxFTkJRV3RDTEdsQ1FVRk5MRWxCUVhoQ096dEJRVVZCTEdGQlFVc3NXVUZCVERzN1FVRkZRU3hoUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRk5CUVhKQ0xFTkJRU3RDTEVkQlFTOUNMRU5CUVcxRExFMUJRVzVETzBGQlEwRXNZVUZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFRRVUZ5UWl4RFFVRXJRaXhOUVVFdlFpeERRVUZ6UXl4TlFVRjBRenM3UVVGRlFTeFpRVUZOTEZkQlFWY3NTMEZCU3l4WFFVRk1MRVZCUVdwQ096dEJRVVZCTEZsQlFVMHNWMEZCVnl4VFFVRllMRkZCUVZjc1IwRkJUVHRCUVVOeVFpeHRRa0ZCVXl4SlFVRlVMRU5CUVdNc1YwRkJaQ3hEUVVFd1FpeFJRVUV4UWpzN1FVRkZRU3hwUWtGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhUUVVGeVFpeERRVUVyUWl4TlFVRXZRaXhEUVVGelF5eE5RVUYwUXpzN1FVRkZRU3hwUWtGQlN5eFpRVUZNTEVOQlFXdENMR2xDUVVGTkxFMUJRWGhDT3p0QlFVVkJMRzFDUVVGVExHMUNRVUZVTEVOQlFUWkNMR2xDUVVGTkxHTkJRVzVETEVWQlFXMUVMRkZCUVc1RU96dEJRVVZCTzBGQlEwRXNZMEZCU1N4UFFVRkxMR05CUVZRc1JVRkJlVUk3UVVGRGRrSXNjVUpCUVZNc1NVRkJWQ3hEUVVGakxGZEJRV1FzUTBGQk1FSXNUMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJka003UVVGRFFTeHRRa0ZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhIUVVGMVFpeEpRVUYyUWp0QlFVTkVPMEZCUTBZc1UwRmtSRHM3UVVGblFrRXNhVUpCUVZNc1owSkJRVlFzUTBGQk1FSXNhVUpCUVUwc1kwRkJhRU1zUlVGQlowUXNVVUZCYUVRN1FVRkRRU3hwUWtGQlV5eFRRVUZVTEVOQlFXMUNMRWRCUVc1Q0xFTkJRWFZDTEZOQlFYWkNPenRCUVVWQkxHVkJRVThzU1VGQlVEdEJRVU5FTzBGQk5VdHBRanRCUVVGQk8wRkJRVUVzY1VOQk9FdElPMEZCUVVFN08wRkJRMklzV1VGQlRTeHBRa0ZCYVVJc1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4blFrRkJja0lzUTBGQmMwTXNaMEpCUVhSRExFTkJRWFpDTzBGQlEwRXNXVUZCU1N4alFVRktMRVZCUVc5Q08wRkJRMnhDTEhsQ1FVRmxMRTlCUVdZc1EwRkJkVUk3UVVGQlFTeHRRa0ZCVlN4UFFVRkxMR1ZCUVV3c1EwRkJjVUlzUlVGQlJTeFJRVUZSTEUxQlFWWXNSVUZCYTBJc1QwRkJUeXhQUVVGNlFpeEZRVUZ5UWl4RFFVRldPMEZCUVVFc1YwRkJka0k3UVVGRFJEczdRVUZGUkR0QlFVTkJPMEZCUTBFN1FVRkRRU3haUVVGSkxFdEJRVXNzVDBGQlRDeERRVUZoTEZWQlFXcENMRVZCUVRaQ08wRkJRek5DTEdOQlFVMHNWMEZCVnl4TFFVRkxMRmRCUVV3c1JVRkJha0k3UVVGRFFTeGxRVUZMTEdWQlFVd3NRMEZCY1VJc1JVRkJSU3hSUVVGUkxGRkJRVllzUlVGQmIwSXNUMEZCVHl4cFFrRkJUU3hMUVVGcVF5eEZRVUZ5UWp0QlFVTkJMR1ZCUVVzc1pVRkJUQ3hEUVVGeFFpeEZRVUZGTEZGQlFWRXNVVUZCVml4RlFVRnZRaXhQUVVGUExFOUJRVE5DTEVWQlFYSkNPMEZCUTBRN1FVRkRSanRCUVRWTWFVSTdRVUZCUVR0QlFVRkJMSEZEUVRoTVNEdEJRVUZCT3p0QlFVTmlMRmxCUVUwc2FVSkJRV2xDTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzWjBKQlFYSkNMRU5CUVhORExHZENRVUYwUXl4RFFVRjJRanRCUVVOQkxGbEJRVWtzWTBGQlNpeEZRVUZ2UWp0QlFVTnNRaXg1UWtGQlpTeFBRVUZtTEVOQlFYVkNPMEZCUVVFc2JVSkJRVlVzVDBGQlN5eHBRa0ZCVEN4RFFVRjFRaXhGUVVGRkxGRkJRVkVzVFVGQlZpeEZRVUZyUWl4UFFVRlBMRTlCUVhwQ0xFVkJRWFpDTEVOQlFWWTdRVUZCUVN4WFFVRjJRanRCUVVORU96dEJRVVZFTEZsQlFVa3NTMEZCU3l4UFFVRk1MRU5CUVdFc1ZVRkJha0lzUlVGQk5rSTdRVUZETTBJc1kwRkJUU3hYUVVGWExFdEJRVXNzVjBGQlRDeEZRVUZxUWp0QlFVTkJMR1ZCUVVzc2FVSkJRVXdzUTBGQmRVSXNSVUZCUlN4UlFVRlJMRkZCUVZZc1JVRkJiMElzVDBGQlR5eHBRa0ZCVFN4TFFVRnFReXhGUVVGMlFqdEJRVU5CTEdWQlFVc3NhVUpCUVV3c1EwRkJkVUlzUlVGQlJTeFJRVUZSTEZGQlFWWXNSVUZCYjBJc1QwRkJUeXhQUVVFelFpeEZRVUYyUWp0QlFVTkVPMEZCUTBZN1FVRjZUV2xDTzBGQlFVRTdRVUZCUVN4dlEwRXlUVWNzVDBFelRVZ3NSVUV5VFZrN1FVRkROVUlzZVVkQlFUSkNMRTFCUVROQ0xFVkJRVzFETEU5QlFXNURPMEZCUTBRN1FVRTNUV2xDT3p0QlFVRkJPMEZCUVVFN08wRkJaMDV3UWpzN096czdPenRCUVV0QkxFMUJRVTBzWVVGQllTeEZRVUZ1UWpzN1FVRkZRU3hOUVVGTkxGVkJRVlVzVTBGQlV5eG5Ra0ZCVkN4UFFVRTRRaXhKUVVFNVFpeERRVUZvUWp0QlFVTkJMRTFCUVVrc1QwRkJTaXhGUVVGaE8wRkJRMWdzV1VGQlVTeFBRVUZTTEVOQlFXZENMRlZCUVVNc1QwRkJSQ3hGUVVGaE8wRkJRek5DTEZWQlFVMHNVMEZCVXl3eVEwRkJiMElzVDBGQmNFSXNSVUZCTmtJc2EwSkJRVGRDTEVWQlFXbEVMSEZDUVVGcVJDeERRVUZtTzBGQlEwRXNZVUZCVHl4UFFVRlFMRWRCUVdsQ0xFOUJRV3BDT3p0QlFVVkJMR2xDUVVGWExFbEJRVmdzUTBGQlowSXNSVUZCUlN4blFrRkJSaXhGUVVGWExGRkJRVkVzU1VGQlNTeE5RVUZLTEVOQlFWY3NUVUZCV0N4RFFVRnVRaXhGUVVGb1FqdEJRVU5FTEV0QlRFUTdRVUZOUkRzN1FVRkZSQ3hOUVVGSkxFOUJRVW9zUlVGQllUdEJRVU5ZTEdGQlFWTXNaMEpCUVZRc1EwRkJNRUlzVDBGQk1VSXNSVUZCYlVNc1ZVRkJReXhMUVVGRUxFVkJRVmM3UVVGRE5VTXNWVUZCVFN4cFFrRkJhVUlzVFVGQlRTeE5RVUZPTEVOQlFXRXNXVUZCWWl4RFFVRXdRaXhoUVVFeFFpeERRVUYyUWp0QlFVTkJMRlZCUVVrc2EwSkJRV3RDTEcxQ1FVRnRRaXhKUVVGNlF5eEZRVUVyUXp0QlFVTTNReXhaUVVGTkxFdEJRVXNzVFVGQlRTeE5RVUZPTEVOQlFXRXNXVUZCWWl4RFFVRXdRaXhoUVVFeFFpeERRVUZZTzBGQlEwRXNXVUZCVFN4VlFVRlZMRk5CUVZNc1lVRkJWQ3hEUVVGMVFpeEZRVUYyUWl4RFFVRm9RanM3UVVGRlFTeFpRVUZOTEZsQlFWa3NWMEZCVnl4SlFVRllMRU5CUVdkQ08wRkJRVUVzYVVKQlFVc3NSVUZCUlN4UFFVRkdMRXRCUVdNc1QwRkJia0k3UVVGQlFTeFRRVUZvUWl4RFFVRnNRanM3UVVGRlFTeFpRVUZKTEVOQlFVTXNVMEZCVEN4RlFVRm5RanRCUVVOa08wRkJRMFE3TzBGQlJVUXNZMEZCVFN4TlFVRk9MRU5CUVdFc1NVRkJZanM3UVVGRlFTeHJRa0ZCVlN4TlFVRldMRU5CUVdsQ0xFbEJRV3BDTzBGQlEwUTdRVUZEUml4TFFXaENSRHRCUVdsQ1JEczdRVUZGUkN4VFFVRlBMRTFCUVZBN1FVRkRSQ3hEUVhSUVl5eEZRVUZtT3p0clFrRjNVR1VzVFRzN096czdPenM3T3pzN096dEJRelZRWmpzN096dEJRVU5CT3pzN08wRkJRMEU3TzBGQlEwRTdPenM3T3pzN095dGxRVkpCT3pzN096czdPMEZCVlVFc1NVRkJUU3hYUVVGWkxGbEJRVTA3UVVGRGRFSTdPenM3T3p0QlFVMUJMRTFCUVUwc1QwRkJUeXhWUVVGaU8wRkJRMEVzVFVGQlRTeFZRVUZWTEU5QlFXaENPMEZCUTBFc1RVRkJUU3h4UWtGQmNVSTdRVUZEZWtJc1lVRkJVeXhKUVVSblFqdEJRVVY2UWl4aFFVRlRPMEZCUm1kQ0xFZEJRVE5DTzBGQlNVRXNUVUZCVFN4M1FrRkJkMElzUTBGRE5VSXNVMEZFTkVJc1EwRkJPVUk3TzBGQlNVRTdPenM3T3p0QlFXcENjMElzVFVGMVFtaENMRkZCZGtKblFqdEJRVUZCT3p0QlFYbENjRUlzZDBKQlFUQkNPMEZCUVVFc1ZVRkJaQ3hQUVVGakxIVkZRVUZLTEVWQlFVazdPMEZCUVVFN08wRkJRVUVzYzBoQlEyeENMRWxCUkd0Q0xFVkJRMW9zVDBGRVdTeEZRVU5JTEd0Q1FVUkhMRVZCUTJsQ0xFOUJSR3BDTEVWQlF6QkNMSEZDUVVReFFpeEZRVU5wUkN4TFFVUnFSQ3hGUVVOM1JDeExRVVI0UkRzN1FVRkhlRUlzVlVGQlRTeFhRVUZYTEUxQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzWVVGQmNrSXNRMEZCYlVNc2FVSkJRVzVETEVOQlFXcENPMEZCUTBFc1ZVRkJUU3hQUVVGUExFMUJRVXNzVjBGQlRDeERRVUZwUWl4UlFVRnFRaXhEUVVGaU96dEJRVVZCTEZsQlFVc3NWMEZCVEN4RFFVRnBRaXhMUVVGTExFdEJRWFJDTEVWQlFUWkNMRXRCUVVzc1NVRkJiRU1zUlVGQmQwTXNTMEZCZUVNN1FVRk9kMEk3UVVGUGVrSTdPMEZCYUVOdFFqdEJRVUZCTzBGQlFVRXNhME5CYTBOU0xFMUJiRU5STEVWQmEwTkJMRU5CUlc1Q08wRkJjRU50UWp0QlFVRkJPMEZCUVVFc2IwTkJjME54UXp0QlFVRkJMRmxCUVRkRExFdEJRVFpETEhWRlFVRnlReXhGUVVGeFF6dEJRVUZCTEZsQlFXcERMRWxCUVdsRExIVkZRVUV4UWl4SlFVRXdRanRCUVVGQkxGbEJRWEJDTEZkQlFXOUNMSFZGUVVGT0xFbEJRVTA3TzBGQlEzWkVMRmxCUVVrc1EwRkJReXhMUVVGTExFOUJRVXdzUTBGQllTeFBRVUZzUWl4RlFVRXlRanRCUVVONlFpeHBRa0ZCVHl4TFFVRlFPMEZCUTBRN08wRkJSVVFzV1VGQlNTeGpRVUZqTEVsQlFXeENPMEZCUTBFc1lVRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4aFFVRnlRaXhEUVVGdFF5eGxRVUZ1UXl4RlFVRnZSQ3hUUVVGd1JDeEhRVUZuUlN4SlFVRm9SVHRCUVVOQkxHRkJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1lVRkJja0lzUTBGQmJVTXNjMEpCUVc1RExFVkJRVEpFTEV0QlFUTkVMRWRCUVcxRkxFdEJRVzVGT3p0QlFVVkJMRmxCUVVrc1YwRkJTaXhGUVVGcFFqdEJRVU5tTEdOQlFVa3NVVUZCVVN4TFFVRmFPMEZCUTBFc1kwRkJUU3hSUVVGUkxFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1owSkJRWEpDTEVOQlFYTkRMRTlCUVhSRExFTkJRV1E3UVVGRFFTeGpRVUZKTEV0QlFVb3NSVUZCVnp0QlFVRkJPMEZCUVVFN1FVRkJRVHM3UVVGQlFUdEJRVU5VTEcxRFFVRnRRaXhMUVVGdVFpdzRTRUZCTUVJN1FVRkJRU3h2UWtGQlppeEpRVUZsT3p0QlFVTjRRaXh2UWtGQlRTeFBRVUZQTEV0QlFVc3NWMEZCVEN4RFFVRnBRaXhKUVVGcVFpeERRVUZpTzBGQlEwRXNiMEpCUVVrc1ZVRkJWU3hMUVVGTExFdEJRVzVDTEVWQlFUQkNPMEZCUTNoQ08wRkJRMEVzYzBKQlFVa3NaMEpCUVdkQ0xFbEJRWEJDTEVWQlFUQkNPMEZCUTNoQ0xHdERRVUZqTEV0QlFVc3NTVUZCYmtJN1FVRkRSRHRCUVVORUxEQkNRVUZSTEVsQlFWSTdRVUZEUVR0QlFVTkVPMEZCUTBZN1FVRllVVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQldWWTdPMEZCUlVRc1pVRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4aFFVRnlRaXhEUVVGdFF5eGxRVUZ1UXl4RlFVRnZSQ3hUUVVGd1JDeEhRVUZuUlN4WFFVRm9SVHRCUVVOQkxHVkJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1lVRkJja0lzUTBGQmJVTXNjMEpCUVc1RExFVkJRVEpFTEV0QlFUTkVMRWRCUVcxRkxFdEJRVzVGT3p0QlFVVkJMR05CUVVrc1EwRkJReXhMUVVGTUxFVkJRVms3UVVGRFZpeHJRa0ZCVFN4SlFVRkpMRXRCUVVvc1EwRkJZU3hKUVVGaUxIRkNRVUZwUXl4TFFVRnFReXcwUTBGQlRqdEJRVU5FTzBGQlEwWTdRVUZEUmp0QlFYWkZiVUk3UVVGQlFUdEJRVUZCTEc5RFFYbEZUanRCUVVOYUxHVkJRVThzUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhoUVVGeVFpeERRVUZ0UXl4elFrRkJia01zUlVGQk1rUXNTMEZCYkVVN1FVRkRSRHRCUVRORmJVSTdRVUZCUVR0QlFVRkJMRzlEUVRaRlN6dEJRVUZCTEZsQlFXSXNTVUZCWVN4MVJVRkJUaXhKUVVGTk96dEJRVU4yUWl4WlFVRkpMRTlCUVU4c1JVRkJXRHRCUVVOQkxGbEJRVWtzVVVGQlVTeEZRVUZhT3p0QlFVVkJMRmxCUVVrc1NVRkJTaXhGUVVGVk8wRkJRMUlzYVVKQlFVOHNTMEZCU3l4WlFVRk1MRU5CUVd0Q0xGZEJRV3hDTEV0QlFXdERMRXRCUVVzc1UwRkJPVU03TzBGQlJVRXNZMEZCVFN4dFFrRkJiVUlzUzBGQlN5eGhRVUZNTEVOQlFXMUNMRTlCUVc1Q0xFTkJRWHBDTzBGQlEwRXNZMEZCU1N4blFrRkJTaXhGUVVGelFqdEJRVU53UWl4dFFrRkJUeXhwUWtGQmFVSXNVMEZCZUVJN1FVRkRSRHM3UVVGRlJDeHJRa0ZCVVN4TFFVRkxMRmxCUVV3c1EwRkJhMElzV1VGQmJFSXNRMEZCVWp0QlFVTkVPenRCUVVWRUxHVkJRVThzUlVGQlJTeFZRVUZHTEVWQlFWRXNXVUZCVWl4RlFVRlFPMEZCUTBRN1FVRTNSbTFDTzBGQlFVRTdRVUZCUVN4eFEwRXJSa3dzUzBFdlJrc3NSVUVyUmtVN1FVRkRjRUlzV1VGQlNTeE5RVUZOTEVsQlFVNHNTMEZCWlN4cFFrRkJUU3hMUVVGNlFpeEZRVUZuUXp0QlFVTTVRaXhqUVVGTkxGZEJRVmNzT0VKQlFXdENMRTFCUVUwc1RVRkJlRUlzUlVGQlowTXNWVUZCYUVNc1EwRkJha0k3UVVGRFFTeGpRVUZKTEVOQlFVTXNVVUZCVEN4RlFVRmxPMEZCUTJJc2FVSkJRVXNzU1VGQlREdEJRVU5FTzBGQlJVWXNVMEZPUkN4TlFVMVBMRWxCUVVrc1RVRkJUU3hKUVVGT0xFdEJRV1VzVDBGQmJrSXNSVUZCTkVJN1FVRkRha01zWTBGQlRTeFBRVUZQTERoQ1FVRnJRaXhOUVVGTkxFMUJRWGhDTEVWQlFXZERMRTFCUVdoRExFTkJRV0k3TzBGQlJVRXNZMEZCU1N4SlFVRktMRVZCUVZVN1FVRkRVaXhuUWtGQlNTeExRVUZMTEZOQlFVd3NRMEZCWlN4UlFVRm1MRU5CUVhkQ0xGVkJRWGhDTEVOQlFVb3NSVUZCZVVNN1FVRkRka003UVVGRFJEczdRVUZGUkN4blFrRkJUU3hYUVVGWExFdEJRVXNzVjBGQlRDeERRVUZwUWl4SlFVRnFRaXhEUVVGcVFqdEJRVU5CTEdsQ1FVRkxMRmRCUVV3c1EwRkJhVUlzVTBGQlV5eExRVUV4UWl4RlFVRnBReXhUUVVGVExFbEJRVEZETEVWQlFXZEVMRXRCUVdoRU96dEJRVVZCTEdkQ1FVRk5MRk5CUVZNc1JVRkJSU3hWUVVGR0xFVkJRVkVzVFVGQlRTeFRRVUZUTEVsQlFYWkNMRVZCUVRaQ0xFOUJRVThzVTBGQlV5eExRVUUzUXl4RlFVRm1PMEZCUTBFc2FVSkJRVXNzV1VGQlRDeERRVUZyUWl4cFFrRkJUU3hoUVVGNFFpeEZRVUYxUXl4TlFVRjJRenM3UVVGRlFTeHBRa0ZCU3l4SlFVRk1PMEZCUTBFN1FVRkRSRHM3UVVGRlJEdEJRVU5CTEdOQlFVMHNaVUZCWlN3NFFrRkJhMElzVFVGQlRTeE5RVUY0UWl4RlFVRm5ReXhsUVVGb1F5eERRVUZ5UWp0QlFVTkJMR05CUVVrc1dVRkJTaXhGUVVGclFqdEJRVU5vUWp0QlFVTkVPenRCUVVWRUxHVkJRVXNzVFVGQlREdEJRVU5FTzBGQlEwWTdRVUZvU1cxQ08wRkJRVUU3UVVGQlFTd3JRa0ZyU1ZnN1FVRkRVQ3haUVVGSkxFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1UwRkJja0lzUTBGQkswSXNVVUZCTDBJc1EwRkJkME1zVVVGQmVFTXNRMEZCU2l4RlFVRjFSRHRCUVVOeVJDeHBRa0ZCVHl4TFFVRkxMRWxCUVV3c1JVRkJVRHRCUVVORU96dEJRVVZFTEdWQlFVOHNTMEZCU3l4SlFVRk1MRVZCUVZBN1FVRkRSRHRCUVhoSmJVSTdRVUZCUVR0QlFVRkJMRFpDUVRCSllqdEJRVU5NTEZsQlFVa3NTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFRRVUZ5UWl4RFFVRXJRaXhSUVVFdlFpeERRVUYzUXl4UlFVRjRReXhEUVVGS0xFVkJRWFZFTzBGQlEzSkVMR2xDUVVGUExFdEJRVkE3UVVGRFJEczdRVUZGUkN4aFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEZOQlFYSkNMRU5CUVN0Q0xFZEJRUzlDTEVOQlFXMURMRkZCUVc1RE96dEJRVVZCTEZsQlFVMHNaVUZCWlN4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEdGQlFYSkNMRU5CUVcxRExHZENRVUZ1UXl4RFFVRnlRanM3UVVGRlFUdEJRVU5CTEhGQ1FVRmhMRk5CUVdJc1IwRkJlVUlzUTBGQmVrSTdPMEZCUlVFc1lVRkJTeXhaUVVGTUxFTkJRV3RDTEdsQ1FVRk5MRWxCUVhoQ08wRkJRMEVzWVVGQlN5eFpRVUZNTEVOQlFXdENMR2xDUVVGTkxFdEJRWGhDT3p0QlFVVkJMR0ZCUVVzc1pVRkJUQ3hEUVVGeFFpeEZRVUZGTEZGQlFWRXNXVUZCVml4RlFVRjNRaXhQUVVGUExFOUJRUzlDTEVWQlFYSkNPMEZCUTBFc1lVRkJTeXhsUVVGTUxFTkJRWEZDTEVWQlFVVXNVVUZCVVN4VFFVRlRMRWxCUVc1Q0xFVkJRWGxDTEU5QlFVOHNhVUpCUVUwc1MwRkJkRU1zUlVGQmNrSTdPMEZCUlVFc1pVRkJUeXhKUVVGUU8wRkJRMFE3UVVFM1NtMUNPMEZCUVVFN1FVRkJRU3cyUWtFclNtSTdRVUZEVEN4WlFVRkpMRU5CUVVNc1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4VFFVRnlRaXhEUVVFclFpeFJRVUV2UWl4RFFVRjNReXhSUVVGNFF5eERRVUZNTEVWQlFYZEVPMEZCUTNSRUxHbENRVUZQTEV0QlFWQTdRVUZEUkRzN1FVRkZSQ3hoUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRk5CUVhKQ0xFTkJRU3RDTEUxQlFTOUNMRU5CUVhORExGRkJRWFJET3p0QlFVVkJMR0ZCUVVzc1dVRkJUQ3hEUVVGclFpeHBRa0ZCVFN4SlFVRjRRanRCUVVOQkxHRkJRVXNzV1VGQlRDeERRVUZyUWl4cFFrRkJUU3hOUVVGNFFqczdRVUZGUVN4aFFVRkxMR2xDUVVGTUxFTkJRWFZDTEVWQlFVVXNVVUZCVVN4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEdGQlFYSkNMRU5CUVcxRExHZENRVUZ1UXl4RFFVRldMRVZCUVdkRkxFOUJRVThzVDBGQmRrVXNSVUZCZGtJN1FVRkRRU3hoUVVGTExHbENRVUZNTEVOQlFYVkNMRVZCUVVVc1VVRkJVU3hUUVVGVExFbEJRVzVDTEVWQlFYbENMRTlCUVU4c2FVSkJRVTBzUzBGQmRFTXNSVUZCZGtJN08wRkJSVUVzWlVGQlR5eEpRVUZRTzBGQlEwUTdRVUUzUzIxQ08wRkJRVUU3UVVGQlFTeHZRMEVyUzBNc1QwRXZTMFFzUlVFclMxVTdRVUZETlVJc05rZEJRVEpDTEZGQlFUTkNMRVZCUVhGRExFOUJRWEpETzBGQlEwUTdRVUZxVEcxQ096dEJRVUZCTzBGQlFVRTdPMEZCYjB4MFFqczdPenM3T3p0QlFVdEJMRTFCUVUwc1lVRkJZU3hGUVVGdVFqczdRVUZGUVN4TlFVRk5MRmxCUVZrc1UwRkJVeXhuUWtGQlZDeFBRVUU0UWl4SlFVRTVRaXhEUVVGc1FqdEJRVU5CTEUxQlFVa3NVMEZCU2l4RlFVRmxPMEZCUTJJc1kwRkJWU3hQUVVGV0xFTkJRV3RDTEZWQlFVTXNUMEZCUkN4RlFVRmhPMEZCUXpkQ0xGVkJRVTBzVTBGQlV5d3lRMEZCYjBJc1QwRkJjRUlzUlVGQk5rSXNhMEpCUVRkQ0xFVkJRV2xFTEhGQ1FVRnFSQ3hEUVVGbU8wRkJRMEVzWVVGQlR5eFBRVUZRTEVkQlFXbENMRTlCUVdwQ096dEJRVVZCTEdsQ1FVRlhMRWxCUVZnc1EwRkJaMElzU1VGQlNTeFJRVUZLTEVOQlFXRXNUVUZCWWl4RFFVRm9RanRCUVVORUxFdEJURVE3UVVGTlJEczdRVUZGUkN4TlFVRkpMRk5CUVVvc1JVRkJaVHRCUVVOaUxHRkJRVk1zWjBKQlFWUXNRMEZCTUVJc1QwRkJNVUlzUlVGQmJVTXNWVUZCUXl4TFFVRkVMRVZCUVZjN1FVRkROVU1zVlVGQlRTeGxRVUZsTERoQ1FVRnJRaXhOUVVGTkxFMUJRWGhDTEVWQlFXZERMR1ZCUVdoRExFTkJRWEpDTzBGQlEwRXNWVUZCU1N4WlFVRktMRVZCUVd0Q08wRkJRMmhDTzBGQlEwUTdPMEZCUlVRc1ZVRkJUU3hYUVVGWExEaENRVUZyUWl4TlFVRk5MRTFCUVhoQ0xFVkJRV2RETEZWQlFXaERMRU5CUVdwQ096dEJRVVZCTEZWQlFVa3NVVUZCU2l4RlFVRmpPMEZCUTFvc1dVRkJUU3hwUWtGQmFVSXNVMEZCVXl4WlFVRlVMRU5CUVhOQ0xHRkJRWFJDTEVOQlFYWkNPMEZCUTBFc1dVRkJTU3hyUWtGQmEwSXNiVUpCUVcxQ0xFbEJRWEpETEVsQlFUWkRMRkZCUVdwRUxFVkJRVEpFTzBGQlEzcEVMR05CUVUwc1dVRkJXU3hYUVVGWExFbEJRVmdzUTBGQlowSTdRVUZCUVN4dFFrRkJTeXhGUVVGRkxGVkJRVVlzVDBGQmJVSXNVVUZCZUVJN1FVRkJRU3hYUVVGb1FpeERRVUZzUWpzN1FVRkZRU3hqUVVGSkxFTkJRVU1zVTBGQlRDeEZRVUZuUWp0QlFVTmtPMEZCUTBRN08wRkJSVVFzYjBKQlFWVXNUVUZCVmp0QlFVTkVPMEZCUTBZN1FVRkRSaXhMUVhCQ1JEdEJRWEZDUkRzN1FVRkZSQ3hUUVVGUExGRkJRVkE3UVVGRFJDeERRVGxPWjBJc1JVRkJha0k3TzJ0Q1FXZFBaU3hST3pzN096czdPenM3T3pzN08wRkRjazltT3pzN096czdPenM3T3l0bFFVeEJPenM3T3pzN08wRkJUMEVzU1VGQlRTeFRRVUZWTEZsQlFVMDdRVUZEY0VJN096czdPenRCUVUxQkxFMUJRVTBzVDBGQlR5eFJRVUZpTzBGQlEwRXNUVUZCVFN4VlFVRlZMRTlCUVdoQ08wRkJRMEVzVFVGQlRTeHhRa0ZCY1VJN1FVRkRla0lzWVVGQlV5eEpRVVJuUWp0QlFVVjZRaXhYUVVGUExFbEJSbXRDTzBGQlIzcENMRlZCUVUwN1FVRkliVUlzUjBGQk0wSTdRVUZMUVN4TlFVRk5MSGRDUVVGM1FpeEZRVUU1UWpzN1FVRkZRVHM3T3pzN08wRkJhRUp2UWl4TlFYTkNaQ3hOUVhSQ1l6dEJRVUZCT3p0QlFYZENiRUlzYzBKQlFUQkNPMEZCUVVFc1ZVRkJaQ3hQUVVGakxIVkZRVUZLTEVWQlFVazdPMEZCUVVFN08wRkJSM2hDTzBGQlNIZENMR3RJUVVOc1FpeEpRVVJyUWl4RlFVTmFMRTlCUkZrc1JVRkRTQ3hyUWtGRVJ5eEZRVU5wUWl4UFFVUnFRaXhGUVVNd1FpeHhRa0ZFTVVJc1JVRkRhVVFzUzBGRWFrUXNSVUZEZDBRc1MwRkVlRVE3TzBGQlNYaENMRlZCUVUwc1owSkJRV2RDTEUxQlFVc3NWVUZCVEN4RlFVRjBRanRCUVVOQkxGVkJRVWtzVDBGQlR5eE5RVUZMTEU5QlFVd3NRMEZCWVN4TFFVRndRaXhMUVVFNFFpeFJRVUU1UWl4SlFVTkRMRU5CUVVNc1kwRkJZeXhUUVVGa0xFTkJRWGRDTEZGQlFYaENMRmxCUVRCRExFMUJRVXNzVDBGQlRDeERRVUZoTEV0QlFYWkVMRU5CUkU0c1JVRkRkVVU3UVVGRGNrVXNjMEpCUVdNc1UwRkJaQ3hEUVVGM1FpeEhRVUY0UWl4WlFVRnhReXhOUVVGTExFOUJRVXdzUTBGQllTeExRVUZzUkR0QlFVTkVPenRCUVVWRUxGbEJRVXNzVlVGQlRDeEhRVUZyUWl4TlFVRkxMRTlCUVV3c1EwRkJZU3hKUVVGaUxFdEJRWE5DTEVsQlFYaERPMEZCVm5kQ08wRkJWM3BDT3p0QlFXNURhVUk3UVVGQlFUdEJRVUZCTEhORFFYRkRSanRCUVVOa0xGbEJRVWtzUTBGQlF5eExRVUZMTEZWQlFWWXNSVUZCYzBJN1FVRkRjRUlzWTBGQlRTeFBRVUZQTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzY1VKQlFYSkNMRVZCUVdJN1FVRkRRU3hwUWtGQlR5eExRVUZMTEUxQlFWbzdRVUZEUkRzN1FVRkZSQ3hsUVVGUExFdEJRVXNzVDBGQlRDeERRVUZoTEVsQlFYQkNPMEZCUTBRN1FVRTFRMmxDTzBGQlFVRTdRVUZCUVN4dFEwRTRRMHc3UVVGRFdDeGxRVUZQTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzWVVGQmNrSXNRMEZCYlVNc2FVSkJRVzVETEVOQlFWQTdRVUZEUkR0QlFXaEVhVUk3UVVGQlFUdEJRVUZCTERaQ1FXdEVXRHRCUVVOTUxGbEJRVWtzUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhUUVVGeVFpeERRVUVyUWl4UlFVRXZRaXhEUVVGM1F5eE5RVUY0UXl4RFFVRktMRVZCUVhGRU8wRkJRMjVFTEdWQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzVTBGQmNrSXNRMEZCSzBJc1RVRkJMMElzUTBGQmMwTXNUVUZCZEVNN1FVRkRSRHM3UVVGRlJDeFpRVUZOTEU5QlFVOHNTMEZCU3l4aFFVRk1MRVZCUVdJN1FVRkRRU3hoUVVGTExFOUJRVXdzUTBGQllTeEpRVUZpTEVkQlFXOUNMRWxCUVhCQ096dEJRVVZCTEZsQlFVa3NTMEZCU3l4VlFVRlVMRVZCUVhGQ08wRkJRMjVDTEdWQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzUzBGQmNrSXNRMEZCTWtJc1MwRkJNMElzUjBGQmMwTXNTMEZCU3l4UFFVRk1MRU5CUVdFc1NVRkJia1E3UVVGRFFTeGxRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xFdEJRWEpDTEVOQlFUSkNMRTFCUVROQ0xFZEJRWFZETEV0QlFVc3NUMEZCVEN4RFFVRmhMRWxCUVhCRU96dEJRVVZCTEdOQlFVMHNaMEpCUVdkQ0xFdEJRVXNzVlVGQlRDeEZRVUYwUWp0QlFVTkJMSGRDUVVGakxFdEJRV1FzUTBGQmIwSXNTMEZCY0VJc1IwRkJLMElzUzBGQlN5eFBRVUZNTEVOQlFXRXNTVUZCTlVNN1FVRkRRU3gzUWtGQll5eExRVUZrTEVOQlFXOUNMRTFCUVhCQ0xFZEJRV2RETEV0QlFVc3NUMEZCVEN4RFFVRmhMRWxCUVRkRE8wRkJRMFE3TzBGQlJVUXNaVUZCVHl4SlFVRlFPMEZCUTBRN1FVRndSV2xDTzBGQlFVRTdRVUZCUVN4blEwRnpSV0U3UVVGQlFTeFpRVUYyUWl4alFVRjFRaXgxUlVGQlRpeEpRVUZOT3p0QlFVTTNRaXhaUVVGSkxHTkJRVW9zUlVGQmIwSTdRVUZEYkVJc1pVRkJTeXhKUVVGTU8wRkJRMFFzVTBGR1JDeE5RVVZQTzBGQlEwd3NaVUZCU3l4SlFVRk1PMEZCUTBRN08wRkJSVVFzV1VGQlRTeG5Ra0ZCWjBJc1MwRkJTeXhWUVVGTUxFVkJRWFJDT3p0QlFVVkJMRmxCUVVrc2EwSkJRMFlzUTBGQlF5eGpRVUZqTEZOQlFXUXNRMEZCZDBJc1VVRkJlRUlzUTBGQmFVTXNlVUpCUVdwRExFTkJSRWdzUlVGRFowVTdRVUZET1VRc2QwSkJRV01zVTBGQlpDeERRVUYzUWl4SFFVRjRRaXhEUVVFMFFpeDVRa0ZCTlVJN1FVRkRRU3hwUWtGQlR5eEpRVUZRTzBGQlEwUTdPMEZCUlVRc1dVRkJTU3hEUVVGRExHTkJRVVFzU1VGRFJpeGpRVUZqTEZOQlFXUXNRMEZCZDBJc1VVRkJlRUlzUTBGQmFVTXNlVUpCUVdwRExFTkJSRVlzUlVGREswUTdRVUZETjBRc2QwSkJRV01zVTBGQlpDeERRVUYzUWl4TlFVRjRRaXhEUVVFclFpeDVRa0ZCTDBJN1FVRkRSRHM3UVVGRlJDeGxRVUZQTEVsQlFWQTdRVUZEUkR0QlFUTkdhVUk3UVVGQlFUdEJRVUZCTERaQ1FUWkdXRHRCUVVOTUxGbEJRVWtzUTBGQlF5eExRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xGTkJRWEpDTEVOQlFTdENMRkZCUVM5Q0xFTkJRWGRETEUxQlFYaERMRU5CUVV3c1JVRkJjMFE3UVVGRGNFUXNaVUZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFRRVUZ5UWl4RFFVRXJRaXhIUVVFdlFpeERRVUZ0UXl4TlFVRnVRenRCUVVORU96dEJRVVZFTEdWQlFVOHNTVUZCVUR0QlFVTkVPMEZCYmtkcFFqdEJRVUZCTzBGQlFVRXNiME5CY1VkSExFOUJja2RJTEVWQmNVZFpPMEZCUXpWQ0xIbEhRVUV5UWl4TlFVRXpRaXhGUVVGdFF5eFBRVUZ1UXp0QlFVTkVPMEZCZGtkcFFqczdRVUZCUVR0QlFVRkJPenRCUVRCSGNFSXNVMEZCVHl4TlFVRlFPMEZCUTBRc1EwRXpSMk1zUlVGQlpqczdhMEpCTmtkbExFMDdPenM3T3pzN096czdPenM3UVVNdlIyWTdPenM3UVVGRFFUczdPenM3T3pzN096c3JaVUZPUVRzN096czdPenRCUVZGQkxFbEJRVTBzWlVGQlowSXNXVUZCVFR0QlFVTXhRanM3T3pzN08wRkJUVUVzVFVGQlRTeFBRVUZQTEdOQlFXSTdRVUZEUVN4TlFVRk5MRlZCUVZVc1QwRkJhRUk3UVVGRFFTeE5RVUZOTEhGQ1FVRnhRanRCUVVONlFpeGhRVUZUTEVsQlJHZENPMEZCUlhwQ0xHRkJRVk1zUlVGR1owSTdRVUZIZWtJc1owSkJRVmtzU1VGSVlUdEJRVWw2UWl4aFFVRlRMRWxCU21kQ08wRkJTM3BDTEdkQ1FVRlpPMEZCVEdFc1IwRkJNMEk3UVVGUFFTeE5RVUZOTEhkQ1FVRjNRaXhEUVVNMVFpeFRRVVEwUWl4RFFVRTVRanM3UVVGSlFUczdPenM3TzBGQmNFSXdRaXhOUVRCQ2NFSXNXVUV4UW05Q08wRkJRVUU3TzBGQk5FSjRRaXcwUWtGQk1FSTdRVUZCUVN4VlFVRmtMRTlCUVdNc2RVVkJRVW9zUlVGQlNUczdRVUZCUVRzN1FVRkJRU3c0U0VGRGJFSXNTVUZFYTBJc1JVRkRXaXhQUVVSWkxFVkJRMGdzYTBKQlJFY3NSVUZEYVVJc1QwRkVha0lzUlVGRE1FSXNjVUpCUkRGQ0xFVkJRMmxFTEVsQlJHcEVMRVZCUTNWRUxFdEJSSFpFT3p0QlFVZDRRaXhaUVVGTExGRkJRVXdzUjBGQlowSXNTMEZEWkN3MFFrRkVZeXhIUVVWYUxHdERRVVpaTEVkQlIxWXNOa0pCU0ZVc1IwRkpWaXh4UmtGS1ZTeEhRVXRTTEhsRFFVeFJMRWRCVFZZc1YwRk9WU3hIUVU5YUxGRkJVRmtzUjBGUlpDeFJRVkpHT3p0QlFWVkJMRlZCUVVrc1RVRkJTeXhqUVVGVUxFVkJRWGxDTzBGQlEzWkNMR05CUVVzc1MwRkJURHRCUVVORU96dEJRVVZFTEZsQlFVc3NaVUZCVEN4SFFVRjFRaXhKUVVGMlFqdEJRV3BDZDBJN1FVRnJRbnBDT3p0QlFUbERkVUk3UVVGQlFUdEJRVUZCTERoQ1FXZEVhRUk3UVVGRFRpeFpRVUZOTEZWQlFWVXNVMEZCVXl4aFFVRlVMRU5CUVhWQ0xFdEJRWFpDTEVOQlFXaENPenRCUVVWQkxHZENRVUZSTEZOQlFWSXNSMEZCYjBJc1MwRkJTeXhSUVVGNlFqczdRVUZGUVN4aFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFZEJRWFZDTEZGQlFWRXNWVUZCTDBJN08wRkJSVUU3UVVGRFFTeGhRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xHRkJRWEpDTEVOQlFXMURMRlZCUVc1RExFVkJRU3RETEZOQlFTOURMRWRCUVRKRUxFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFYaEZPenRCUVVWQkxGbEJRVWtzUTBGQlF5eExRVUZMTEU5QlFVd3NRMEZCWVN4VlFVRnNRaXhGUVVFNFFqdEJRVU0xUWl4bFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEdGQlFYSkNMRU5CUVcxRExGRkJRVzVETEVWQlFUWkRMRXRCUVRkRExFTkJRVzFFTEU5QlFXNUVMRWRCUVRaRUxFMUJRVGRFTzBGQlEwUTdPMEZCUlVRc2FVSkJRVk1zU1VGQlZDeERRVUZqTEZkQlFXUXNRMEZCTUVJc1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQmRrTTdPMEZCUlVFc1lVRkJTeXhoUVVGTU8wRkJRMFE3UVVGcVJYVkNPMEZCUVVFN1FVRkJRU3cyUWtGdFJXcENPMEZCUVVFN08wRkJRMHdzV1VGQlNTeExRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRXRCUVhsQ0xFbEJRVGRDTEVWQlFXMURPMEZCUTJwRE8wRkJRMEVzWlVGQlN5eExRVUZNTzBGQlEwUTdPMEZCUlVRc1dVRkJTU3hMUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRk5CUVhKQ0xFTkJRU3RDTEZGQlFTOUNMRU5CUVhkRExFMUJRWGhETEVOQlFVb3NSVUZCY1VRN1FVRkRia1FzYVVKQlFVOHNTMEZCVUR0QlFVTkVPenRCUVVWRU8wRkJRMEVzV1VGQlNTeExRVUZMTEU5QlFVd3NRMEZCWVN4VlFVRnFRaXhGUVVFMlFqdEJRVU16UWl4bFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEdWQlFYSkNMRU5CUVhGRExFOUJRWEpETzBGQlEwRXNaVUZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFpRVUZ5UWl4RFFVRnJReXhQUVVGc1F5eEZRVUV5UXl4alFVRXpRenM3UVVGRlFTeGxRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xGTkJRWEpDTEVOQlFTdENMRWRCUVM5Q0xGTkJRWGxETEV0QlFVc3NUMEZCVEN4RFFVRmhMRlZCUVhSRU8wRkJRMEVzWlVGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhoUVVGeVFpeERRVUZ0UXl4UlFVRnVReXhGUVVFMlF5eFRRVUUzUXl4RFFVRjFSQ3hIUVVGMlJDeFZRVUZyUlN4TFFVRkxMRTlCUVV3c1EwRkJZU3hWUVVFdlJUdEJRVU5FT3p0QlFVVkVMRmxCUVVrc1MwRkJTeXhQUVVGTUxFTkJRV0VzVlVGQmFrSXNSVUZCTmtJN1FVRkRNMEk3UVVGRFFTeGpRVUZOTEdkQ1FVRm5RaXhMUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMR0ZCUVhKQ0xFTkJRVzFETEZGQlFXNURMRU5CUVhSQ08wRkJRMEVzWlVGQlN5eGxRVUZNTEVOQlFYRkNMRVZCUVVVc1VVRkJVU3hoUVVGV0xFVkJRWGxDTEU5QlFVOHNUMEZCYUVNc1JVRkJja0k3UVVGRFJEczdRVUZGUkN4dFFrRkJWeXhaUVVGTk8wRkJRMllzYVVKQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzVTBGQmNrSXNRMEZCSzBJc1IwRkJMMElzUTBGQmJVTXNUVUZCYmtNN1FVRkRRU3hwUWtGQlN5eFpRVUZNTEVOQlFXdENMR2xDUVVGTkxFbEJRWGhDT3p0QlFVVkJMR05CUVUwc1ZVRkJWU3hUUVVGV0xFOUJRVlVzUjBGQlRUdEJRVU53UWl4dFFrRkJTeXhaUVVGTUxFTkJRV3RDTEdsQ1FVRk5MRXRCUVhoQ08wRkJRMEVzYlVKQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzYlVKQlFYSkNMRU5CUVhsRExHbENRVUZOTEdOQlFTOURMRVZCUVN0RUxFOUJRUzlFTzBGQlEwUXNWMEZJUkRzN1FVRkxRU3hwUWtGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhuUWtGQmNrSXNRMEZCYzBNc2FVSkJRVTBzWTBGQk5VTXNSVUZCTkVRc1QwRkJOVVE3UVVGRlJDeFRRVmhFTEVWQlYwY3NRMEZZU0RzN1FVRmhRU3haUVVGSkxFOUJRVThzVTBGQlVDeERRVUZwUWl4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVFNVFpeExRVUV3UXl4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFZEJRWFZDTEVOQlFYSkZMRVZCUVhkRk8wRkJRM1JGTzBGQlEwRXNaVUZCU3l4bFFVRk1MRWRCUVhWQ0xGZEJRVmNzV1VGQlRUdEJRVU4wUXl4dFFrRkJTeXhKUVVGTU8wRkJRMFFzVjBGR2MwSXNSVUZGY0VJc1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeEhRVUYxUWl4RFFVWklMRU5CUVhaQ08wRkJSMFE3TzBGQlJVUXNaVUZCVHl4SlFVRlFPMEZCUTBRN1FVRnFTSFZDTzBGQlFVRTdRVUZCUVN3MlFrRnRTR3BDTzBGQlFVRTdPMEZCUTB3N096czdRVUZKUVN4WlFVRkpMRXRCUVVzc1pVRkJWQ3hGUVVFd1FqdEJRVU40UWl4MVFrRkJZU3hMUVVGTExHVkJRV3hDTzBGQlEwRXNaVUZCU3l4bFFVRk1MRWRCUVhWQ0xFbEJRWFpDTzBGQlEwUTdPMEZCUlVRc1dVRkJTU3hEUVVGRExFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1UwRkJja0lzUTBGQkswSXNVVUZCTDBJc1EwRkJkME1zVFVGQmVFTXNRMEZCVEN4RlFVRnpSRHRCUVVOd1JDeHBRa0ZCVHl4TFFVRlFPMEZCUTBRN08wRkJSVVFzWVVGQlN5eFpRVUZNTEVOQlFXdENMR2xDUVVGTkxFbEJRWGhDT3p0QlFVVkJMRmxCUVVrc1MwRkJTeXhQUVVGTUxFTkJRV0VzVlVGQmFrSXNSVUZCTmtJN1FVRkRNMElzWTBGQlRTeG5Ra0ZCWjBJc1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4aFFVRnlRaXhEUVVGdFF5eFJRVUZ1UXl4RFFVRjBRanRCUVVOQkxHVkJRVXNzYVVKQlFVd3NRMEZCZFVJc1JVRkJSU3hSUVVGUkxHRkJRVllzUlVGQmVVSXNUMEZCVHl4UFFVRm9ReXhGUVVGMlFqdEJRVU5FT3p0QlFVVkVMR0ZCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNVMEZCY2tJc1EwRkJLMElzVFVGQkwwSXNRMEZCYzBNc1RVRkJkRU03UVVGRFFTeGhRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xGTkJRWEpDTEVOQlFTdENMRWRCUVM5Q0xFTkJRVzFETEUxQlFXNURPenRCUVVWQkxGbEJRVTBzVjBGQlZ5eFRRVUZZTEZGQlFWY3NSMEZCVFR0QlFVTnlRaXhwUWtGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXh0UWtGQmNrSXNRMEZCZVVNc2FVSkJRVTBzWTBGQkwwTXNSVUZCSzBRc1VVRkJMMFE3UVVGRFFTeHBRa0ZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFRRVUZ5UWl4RFFVRXJRaXhOUVVFdlFpeERRVUZ6UXl4TlFVRjBRenM3UVVGRlFTeHBRa0ZCU3l4WlFVRk1MRU5CUVd0Q0xHbENRVUZOTEUxQlFYaENPenRCUVVWQkxHTkJRVWtzVDBGQlN5eGpRVUZVTEVWQlFYbENPMEZCUTNaQ0xIRkNRVUZUTEVsQlFWUXNRMEZCWXl4WFFVRmtMRU5CUVRCQ0xFOUJRVXNzVDBGQlRDeERRVUZoTEU5QlFYWkRPMEZCUTBFc2JVSkJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNSMEZCZFVJc1NVRkJka0k3UVVGRFJEdEJRVU5HTEZOQlZrUTdPMEZCV1VFc1lVRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4blFrRkJja0lzUTBGQmMwTXNhVUpCUVUwc1kwRkJOVU1zUlVGQk5FUXNVVUZCTlVRN08wRkJSVUVzWlVGQlR5eEpRVUZRTzBGQlEwUTdRVUV4U25WQ08wRkJRVUU3UVVGQlFTeDFRMEUwU2xBN1FVRkRaaXhoUVVGTExFbEJRVXc3UVVGRFJEdEJRVGxLZFVJN1FVRkJRVHRCUVVGQkxHOURRV2RMU0N4UFFXaExSeXhGUVdkTFRUdEJRVU0xUWl4eFNFRkJNa0lzV1VGQk0wSXNSVUZCZVVNc1QwRkJla003UVVGRFJEdEJRV3hMZFVJN08wRkJRVUU3UVVGQlFUczdRVUZ4U3pGQ0xGTkJRVThzV1VGQlVEdEJRVU5FTEVOQmRFdHZRaXhGUVVGeVFqczdhMEpCZDB0bExGazdPenM3T3pzN096czdPenM3UVVNelMyWTdPenM3UVVGRFFUczdPenRCUVVOQk96dEJRVU5CT3pzN096czdPenNyWlVGU1FUczdPenM3T3p0QlFWVkJMRWxCUVUwc1dVRkJZU3haUVVGTk8wRkJRM1pDT3pzN096czdRVUZOUVN4TlFVRk5MRTlCUVU4c1dVRkJZanRCUVVOQkxFMUJRVTBzVlVGQlZTeFBRVUZvUWp0QlFVTkJMRTFCUVUwc2IwSkJRVzlDTEhGQ1FVRXhRanRCUVVOQkxFMUJRVTBzY1VKQlFYRkNPMEZCUTNwQ0xHRkJRVk1zU1VGRVowSTdRVUZGZWtJc1YwRkJUenRCUVVOTUxGVkJRVWtzUzBGRVF6dEJRVVZNTEZWQlFVa3NTMEZHUXp0QlFVZE1MRlZCUVVrN1FVRklRenRCUVVaclFpeEhRVUV6UWp0QlFWRkJMRTFCUVUwc2QwSkJRWGRDTEVOQlF6VkNMRTlCUkRSQ0xFTkJRVGxDT3p0QlFVbEJPenM3T3pzN1FVRjBRblZDTEUxQk5FSnFRaXhUUVRWQ2FVSTdRVUZCUVRzN1FVRTRRbkpDTEhsQ1FVRXdRanRCUVVGQkxGVkJRV1FzVDBGQll5eDFSVUZCU2l4RlFVRkpPenRCUVVGQk96dEJRVUZCTEhkSVFVTnNRaXhKUVVSclFpeEZRVU5hTEU5QlJGa3NSVUZEU0N4clFrRkVSeXhGUVVOcFFpeFBRVVJxUWl4RlFVTXdRaXh4UWtGRU1VSXNSVUZEYVVRc1MwRkVha1FzUlVGRGQwUXNTVUZFZUVRN08wRkJSM2hDTEZsQlFVc3NWMEZCVEN4SFFVRnRRaXhKUVVGdVFqdEJRVU5CTEZsQlFVc3NXVUZCVEN4SFFVRnZRaXhKUVVGd1FqdEJRVU5CTEZsQlFVc3NUMEZCVEN4SFFVRmxMRWxCUVdZN08wRkJSVUVzVlVGQlRTeExRVUZMTEVWQlFVVXNUVUZCVFN4SlFVRlNMRVZCUVdNc1QwRkJUeXhQUVVGUExGVkJRVkFzUTBGQmEwSXNhMEpCUVd4Q0xFTkJRWEpDTEVWQlFWZzdRVUZEUVN4VlFVRk5MRXRCUVVzc1JVRkJSU3hOUVVGTkxFbEJRVklzUlVGQll5eFBRVUZQTEU5QlFVOHNWVUZCVUN4RFFVRnJRaXh2UWtGQmJFSXNRMEZCY2tJc1JVRkJXRHRCUVVOQkxGVkJRVTBzUzBGQlN5eEZRVUZGTEUxQlFVMHNTVUZCVWl4RlFVRmpMRTlCUVU4c1QwRkJUeXhWUVVGUUxFTkJRV3RDTEc5Q1FVRnNRaXhEUVVGeVFpeEZRVUZZTzBGQlEwRXNWVUZCVFN4TFFVRkxMRVZCUVVVc1RVRkJUU3hKUVVGU0xFVkJRV01zVDBGQlR5eFBRVUZQTEZWQlFWQXNRMEZCYTBJc2NVSkJRV3hDTEVOQlFYSkNMRVZCUVZnN08wRkJSVUVzVlVGQlRTeFJRVUZSTEVOQlFVTXNSVUZCUkN4RlFVRkxMRVZCUVV3c1JVRkJVeXhGUVVGVUxFVkJRV0VzUlVGQllpeEZRVUZwUWl4UFFVRnFRaXhGUVVGa096dEJRVVZCTEZWQlFVMHNZVUZCWVN4VFFVRmlMRlZCUVdFc1IwRkJUVHRCUVVOMlFpeFpRVUZKTEVWQlFVVXNaMEpCUVdkQ0xFMUJRV3hDTEVOQlFVb3NSVUZCSzBJN1FVRkROMEk3UVVGRFJEczdRVUZGUkN4alFVRk5MRXRCUVU0c1EwRkJXU3hWUVVGRExFbEJRVVFzUlVGQlZUdEJRVU53UWl4alFVRk5MRkZCUVZFc1MwRkJTeXhMUVVGTUxFTkJRVmNzUzBGQldDeERRVUZwUWl4TFFVRnFRaXhEUVVGMVFpd3dRa0ZCZGtJc1EwRkJaRHM3UVVGRlFTeGpRVUZKTEV0QlFVb3NSVUZCVnp0QlFVTlVMR2RDUVVGSkxFdEJRVXNzUzBGQlRDeERRVUZYTEU5QlFXWXNSVUZCZDBJN1FVRkRkRUlzYTBKQlFVa3NUVUZCU3l4WlFVRk1MRXRCUVhOQ0xFdEJRVXNzU1VGQkwwSXNSVUZCY1VNN1FVRkRia01zYzBKQlFVc3NVVUZCVEN4RFFVRmpMRXRCUVVzc1NVRkJia0k3UVVGRFJEdEJRVU5FTEc5Q1FVRkxMRmxCUVV3c1IwRkJiMElzUzBGQlN5eEpRVUY2UWp0QlFVTkJMSEZDUVVGUExFdEJRVkE3UVVGRFJEdEJRVU5HT3p0QlFVVkVMR2xDUVVGUExFbEJRVkE3UVVGRFJDeFRRV1JFTzBGQlpVUXNUMEZ3UWtRN08wRkJjMEpCT3p0QlFVVkJMR0ZCUVU4c1owSkJRVkFzUTBGQmQwSXNVVUZCZUVJc1JVRkJhME1zVlVGQmJFTXNSVUZCT0VNc1MwRkJPVU03UVVGMFEzZENPMEZCZFVONlFqczdRVUZ5Ulc5Q08wRkJRVUU3UVVGQlFTeDNRMEYxUlVnN1FVRkRhRUlzWlVGQlR5eDVTRUZCTWtJc1MwRkJTeXhQUVVGTUxFTkJRV0VzUzBGQllpeERRVUZ0UWl4TFFVRkxMRmxCUVhoQ0xFMUJRVEJETEVsQlFUVkZPMEZCUTBRN1FVRjZSVzlDTzBGQlFVRTdRVUZCUVN3clFrRXlSVm9zU1VFelJWa3NSVUV5UlU0N1FVRkRZaXhaUVVGTkxGVkJRVlVzVTBGQlV5eEpRVUY2UWpzN1FVRkZRU3haUVVGSkxFdEJRVXNzVDBGQlRDeERRVUZoTEV0QlFXSXNRMEZCYlVJc1NVRkJia0lzVFVGQk5rSXNTVUZCYWtNc1JVRkJkVU03UVVGRGNrTXNZMEZCU1N4RFFVRkRMRkZCUVZFc1UwRkJVaXhEUVVGclFpeFJRVUZzUWl4RFFVRXlRaXhyUWtGQk0wSXNRMEZCVEN4RlFVRnhSRHRCUVVOdVJDeHZRa0ZCVVN4VFFVRlNMRU5CUVd0Q0xFZEJRV3hDTEVOQlFYTkNMR3RDUVVGMFFqdEJRVU5FT3p0QlFVVkVMR1ZCUVVzc1YwRkJUQ3hIUVVGdFFpeExRVUZ1UWpzN1FVRkZRVHRCUVVOQkxHVkJRVXNzVDBGQlRDeEhRVUZsTEV0QlFXWTdRVUZEUVN4bFFVRkxMRWxCUVV3N1FVRkRRVHRCUVVOQkxHVkJRVXNzWTBGQlREdEJRVU5FTEZOQldrUXNUVUZaVHp0QlFVTk1MR05CUVVrc1VVRkJVU3hUUVVGU0xFTkJRV3RDTEZGQlFXeENMRU5CUVRKQ0xHdENRVUV6UWl4RFFVRktMRVZCUVc5RU8wRkJRMnhFTEc5Q1FVRlJMRk5CUVZJc1EwRkJhMElzVFVGQmJFSXNRMEZCZVVJc2EwSkJRWHBDTzBGQlEwUTdPMEZCUlVRc1pVRkJTeXhKUVVGTU8wRkJRMEVzWlVGQlN5eFhRVUZNTEVkQlFXMUNMRWxCUVc1Q08wRkJRMEVzWlVGQlN5eFBRVUZNTEVkQlFXVXNTVUZCWmp0QlFVTkVPMEZCUTBZN1FVRnVSMjlDTzBGQlFVRTdRVUZCUVN4eFEwRnhSMDRzUzBGeVIwMHNSVUZ4UjBNN1FVRkRjRUlzV1VGQlNTeE5RVUZOTEVsQlFVNHNTMEZCWlN4UFFVRm1MRWxCUVRCQ0xFMUJRVTBzVDBGQlRpeExRVUZyUWl4RlFVRTFReXhKUVVGclJDeE5RVUZOTEU5QlFVNHNTMEZCYTBJc1JVRkJlRVVzUlVGQk5FVTdRVUZETVVVN1FVRkRSRHM3UVVGRlJEdEJRVU5CTEdGQlFVc3NTVUZCVER0QlFVTkVPMEZCTlVkdlFqdEJRVUZCTzBGQlFVRXNOa0pCT0Vka08wRkJRVUU3TzBGQlEwd3NXVUZCU1N4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEZOQlFYSkNMRU5CUVN0Q0xGRkJRUzlDTEVOQlFYZERMRTFCUVhoRExFTkJRVW9zUlVGQmNVUTdRVUZEYmtRc2FVSkJRVThzUzBGQlVEdEJRVU5FT3p0QlFVVkVPMEZCUTBFc2JVSkJRVmNzV1VGQlRUdEJRVU5tTEdsQ1FVRkxMRmxCUVV3c1EwRkJhMElzYVVKQlFVMHNTVUZCZUVJN08wRkJSVUVzWTBGQlRTeFZRVUZWTEZOQlFWWXNUMEZCVlN4SFFVRk5PMEZCUTNCQ0xHMUNRVUZMTEZsQlFVd3NRMEZCYTBJc2FVSkJRVTBzUzBGQmVFSTdPMEZCUlVFc1owSkJRVWtzVDBGQlN5eFBRVUZVTEVWQlFXdENPMEZCUTJoQ0xIRkNRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xHMUNRVUZ5UWl4RFFVRjVReXhwUWtGQlRTeGpRVUV2UXl4RlFVRXJSQ3hQUVVFdlJEdEJRVU5CTEhGQ1FVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEZOQlFYSkNMRU5CUVN0Q0xFMUJRUzlDTEVOQlFYTkRMRk5CUVhSRE8wRkJRMFE3UVVGRFJpeFhRVkJFT3p0QlFWTkJMR05CUVVrc1QwRkJTeXhYUVVGVUxFVkJRWE5DTzBGQlEzQkNMRzFDUVVGTExHTkJRVXc3UVVGRFJEczdRVUZIUkN4alFVRkpMRTlCUVVzc1QwRkJWQ3hGUVVGclFqdEJRVU5vUWl4dFFrRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4blFrRkJja0lzUTBGQmMwTXNhVUpCUVUwc1kwRkJOVU1zUlVGQk5FUXNUMEZCTlVRN1FVRkRRU3h0UWtGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhUUVVGeVFpeERRVUVyUWl4SFFVRXZRaXhEUVVGdFF5eFRRVUZ1UXp0QlFVTkVMRmRCU0VRc1RVRkhUenRCUVVOTU8wRkJRMEU3UVVGRFJEczdRVUZGUkN4cFFrRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4VFFVRnlRaXhEUVVFclFpeEhRVUV2UWl4RFFVRnRReXhOUVVGdVF6czdRVUZGUVR0QlFVTkJMR2xDUVVGTExGbEJRVXc3UVVGRFJDeFRRVGRDUkN4RlFUWkNSeXhEUVRkQ1NEczdRVUVyUWtFc1pVRkJUeXhKUVVGUU8wRkJRMFE3UVVGd1NtOUNPMEZCUVVFN1FVRkJRU3cyUWtGelNtUTdRVUZCUVRzN1FVRkRUQ3haUVVGSkxFTkJRVU1zUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhUUVVGeVFpeERRVUVyUWl4UlFVRXZRaXhEUVVGM1F5eE5RVUY0UXl4RFFVRk1MRVZCUVhORU8wRkJRM0JFTEdsQ1FVRlBMRXRCUVZBN1FVRkRSRHM3UVVGRlJDeGhRVUZMTEZsQlFVd3NRMEZCYTBJc2FVSkJRVTBzU1VGQmVFSTdPMEZCUlVFc1lVRkJTeXhaUVVGTU96dEJRVVZCTEZsQlFVa3NTMEZCU3l4UFFVRlVMRVZCUVd0Q08wRkJRMmhDTEdWQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzVTBGQmNrSXNRMEZCSzBJc1IwRkJMMElzUTBGQmJVTXNVMEZCYmtNN1FVRkRSRHM3UVVGRlJDeGhRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xGTkJRWEpDTEVOQlFTdENMRTFCUVM5Q0xFTkJRWE5ETEUxQlFYUkRPenRCUVVWQkxGbEJRVWtzUzBGQlN5eFhRVUZVTEVWQlFYTkNPMEZCUTNCQ0xHTkJRVTBzVjBGQlZ5eExRVUZMTEZkQlFVd3NSVUZCYWtJN08wRkJSVUVzWTBGQlRTeFhRVUZYTEZOQlFWZ3NVVUZCVnl4SFFVRk5PMEZCUTNKQ0xHZENRVUZKTEU5QlFVc3NUMEZCVkN4RlFVRnJRanRCUVVOb1FpeHhRa0ZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFRRVUZ5UWl4RFFVRXJRaXhOUVVFdlFpeERRVUZ6UXl4VFFVRjBRenRCUVVORU96dEJRVVZFTEhGQ1FVRlRMRzFDUVVGVUxFTkJRVFpDTEdsQ1FVRk5MR05CUVc1RExFVkJRVzFFTEZGQlFXNUVPMEZCUTBFc2JVSkJRVXNzV1VGQlRDeERRVUZyUWl4cFFrRkJUU3hOUVVGNFFqdEJRVU5CTEcxQ1FVRkxMR05CUVV3N1FVRkRSQ3hYUVZKRU96dEJRVlZCTEcxQ1FVRlRMR2RDUVVGVUxFTkJRVEJDTEdsQ1FVRk5MR05CUVdoRExFVkJRV2RFTEZGQlFXaEVPMEZCUTBFc2JVSkJRVk1zVTBGQlZDeERRVUZ0UWl4SFFVRnVRaXhEUVVGMVFpeFRRVUYyUWp0QlFVTkVPenRCUVVWRUxHVkJRVThzU1VGQlVEdEJRVU5FTzBGQmRreHZRanRCUVVGQk8wRkJRVUVzZFVOQmVVeEtPMEZCUTJZc1dVRkJUU3hYUVVGWExGTkJRVk1zWVVGQlZDeERRVUYxUWl4TFFVRjJRaXhEUVVGcVFqdEJRVU5CTEdsQ1FVRlRMRmxCUVZRc1EwRkJjMElzVTBGQmRFSXNSVUZCYVVNc1MwRkJTeXhGUVVGMFF6dEJRVU5CTEdsQ1FVRlRMRk5CUVZRc1EwRkJiVUlzUjBGQmJrSXNRMEZCZFVJc2FVSkJRWFpDT3p0QlFVVkJMR2xDUVVGVExFbEJRVlFzUTBGQll5eFhRVUZrTEVOQlFUQkNMRkZCUVRGQ08wRkJRMFE3UVVFdlRHOUNPMEZCUVVFN1FVRkJRU3h2UTBGcFRWQTdRVUZEV2l4bFFVRlBMRk5CUVZNc1lVRkJWQ3hQUVVFeVFpeHBRa0ZCTTBJc2EwSkJRWGxFTEV0QlFVc3NSVUZCT1VRc1VVRkJVRHRCUVVORU8wRkJiazF2UWp0QlFVRkJPMEZCUVVFc2RVTkJjVTFLTzBGQlEyWXNXVUZCVFN4WFFVRlhMRXRCUVVzc1YwRkJUQ3hGUVVGcVFqdEJRVU5CTEZsQlFVa3NVVUZCU2l4RlFVRmpPMEZCUTFvc2JVSkJRVk1zU1VGQlZDeERRVUZqTEZkQlFXUXNRMEZCTUVJc1VVRkJNVUk3UVVGRFJEdEJRVU5HTzBGQk1VMXZRanRCUVVGQk8wRkJRVUVzY1VOQk5FMU9PMEZCUVVFN08wRkJRMklzV1VGQlRTeHBRa0ZCYVVJc1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4blFrRkJja0lzUTBGQmMwTXNaMEpCUVhSRExFTkJRWFpDT3p0QlFVVkJMRmxCUVVrc1kwRkJTaXhGUVVGdlFqdEJRVU5zUWl4NVFrRkJaU3hQUVVGbUxFTkJRWFZDTzBGQlFVRXNiVUpCUVZVc1QwRkJTeXhsUVVGTUxFTkJRWEZDTEVWQlFVVXNVVUZCVVN4TlFVRldMRVZCUVd0Q0xFOUJRVThzVDBGQmVrSXNSVUZCY2tJc1EwRkJWanRCUVVGQkxGZEJRWFpDTzBGQlEwUTdPMEZCUlVRc1dVRkJTU3hMUVVGTExGZEJRVlFzUlVGQmMwSTdRVUZEY0VJc1kwRkJUU3hYUVVGWExFdEJRVXNzVjBGQlRDeEZRVUZxUWp0QlFVTkJMR1ZCUVVzc1pVRkJUQ3hEUVVGeFFpeEZRVUZGTEZGQlFWRXNVVUZCVml4RlFVRnZRaXhQUVVGUExHbENRVUZOTEV0QlFXcERMRVZCUVhKQ08wRkJRMFE3TzBGQlJVUXNZVUZCU3l4bFFVRk1MRU5CUVhGQ0xFVkJRVVVzVVVGQlVTeFJRVUZXTEVWQlFXOUNMRTlCUVU4c1QwRkJNMElzUlVGQmNrSTdRVUZEUkR0QlFYcE9iMEk3UVVGQlFUdEJRVUZCTEhGRFFUSk9UanRCUVVGQk96dEJRVU5pTEZsQlFVMHNhVUpCUVdsQ0xFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1owSkJRWEpDTEVOQlFYTkRMR2RDUVVGMFF5eERRVUYyUWpzN1FVRkZRU3haUVVGSkxHTkJRVW9zUlVGQmIwSTdRVUZEYkVJc2VVSkJRV1VzVDBGQlppeERRVUYxUWp0QlFVRkJMRzFDUVVGVkxFOUJRVXNzYVVKQlFVd3NRMEZCZFVJc1JVRkJSU3hSUVVGUkxFMUJRVllzUlVGQmEwSXNUMEZCVHl4UFFVRjZRaXhGUVVGMlFpeERRVUZXTzBGQlFVRXNWMEZCZGtJN1FVRkRSRHM3UVVGRlJDeFpRVUZKTEV0QlFVc3NWMEZCVkN4RlFVRnpRanRCUVVOd1FpeGpRVUZOTEZkQlFWY3NTMEZCU3l4WFFVRk1MRVZCUVdwQ08wRkJRMEVzWlVGQlN5eHBRa0ZCVEN4RFFVRjFRaXhGUVVGRkxGRkJRVkVzVVVGQlZpeEZRVUZ2UWl4UFFVRlBMR2xDUVVGTkxFdEJRV3BETEVWQlFYWkNPMEZCUTBRN08wRkJSVVFzWVVGQlN5eHBRa0ZCVEN4RFFVRjFRaXhGUVVGRkxGRkJRVkVzVVVGQlZpeEZRVUZ2UWl4UFFVRlBMRTlCUVROQ0xFVkJRWFpDTzBGQlEwUTdRVUY0VDI5Q08wRkJRVUU3UVVGQlFTeHZRMEV3VDBFc1QwRXhUMEVzUlVFd1QxTTdRVUZETlVJc0swZEJRVEpDTEZOQlFUTkNMRVZCUVhORExFOUJRWFJETzBGQlEwUTdRVUUxVDI5Q096dEJRVUZCTzBGQlFVRTdPMEZCSzA5MlFqczdPenM3T3p0QlFVdEJMRTFCUVUwc1lVRkJZU3hGUVVGdVFqczdRVUZGUVN4TlFVRk5MRmxCUVZrc1UwRkJVeXhuUWtGQlZDeFBRVUU0UWl4SlFVRTVRaXhEUVVGc1FqdEJRVU5CTEUxQlFVa3NVMEZCU2l4RlFVRmxPMEZCUTJJc1kwRkJWU3hQUVVGV0xFTkJRV3RDTEZWQlFVTXNUMEZCUkN4RlFVRmhPMEZCUXpkQ0xGVkJRVTBzVTBGQlV5d3lRMEZCYjBJc1QwRkJjRUlzUlVGQk5rSXNhMEpCUVRkQ0xFVkJRV2xFTEhGQ1FVRnFSQ3hEUVVGbU8wRkJRMEVzWVVGQlR5eFBRVUZRTEVkQlFXbENMRTlCUVdwQ096dEJRVVZCTEdsQ1FVRlhMRWxCUVZnc1EwRkJaMElzUlVGQlJTeG5Ra0ZCUml4RlFVRlhMRmRCUVZjc1NVRkJTU3hUUVVGS0xFTkJRV01zVFVGQlpDeERRVUYwUWl4RlFVRm9RanRCUVVORUxFdEJURVE3UVVGTlJEczdRVUZGUkN4TlFVRkpMRk5CUVVvc1JVRkJaVHRCUVVOaUxHRkJRVk1zWjBKQlFWUXNRMEZCTUVJc1QwRkJNVUlzUlVGQmJVTXNWVUZCUXl4TFFVRkVMRVZCUVZjN1FVRkROVU1zVlVGQlRTeFRRVUZUTERaQ1FVRnBRaXhOUVVGTkxFMUJRWFpDTEVWQlFTdENMR0ZCUVM5Q0xFTkJRV1k3UVVGRFFTeFZRVUZKTEVOQlFVTXNUVUZCVEN4RlFVRmhPMEZCUTFnN1FVRkRSRHM3UVVGRlJDeFZRVUZOTEdsQ1FVRnBRaXhQUVVGUExGbEJRVkFzUTBGQmIwSXNZVUZCY0VJc1EwRkJka0k3UVVGRFFTeFZRVUZKTEd0Q1FVRnJRaXh0UWtGQmJVSXNTVUZCZWtNc1JVRkJLME03UVVGRE4wTXNXVUZCVFN4TFFVRkxMRTlCUVU4c1dVRkJVQ3hEUVVGdlFpeGhRVUZ3UWl4RFFVRllPMEZCUTBFc1dVRkJUU3hWUVVGVkxGTkJRVk1zWVVGQlZDeERRVUYxUWl4RlFVRjJRaXhEUVVGb1FqczdRVUZGUVN4WlFVRk5MRmxCUVZrc1YwRkJWeXhKUVVGWUxFTkJRV2RDTzBGQlFVRXNhVUpCUVVzc1JVRkJSU3hQUVVGR0xFdEJRV01zVDBGQmJrSTdRVUZCUVN4VFFVRm9RaXhEUVVGc1FqczdRVUZGUVN4WlFVRkpMRU5CUVVNc1UwRkJUQ3hGUVVGblFqdEJRVU5rTzBGQlEwUTdPMEZCUlVRc1pVRkJUeXhKUVVGUU96dEJRVVZCTEd0Q1FVRlZMRk5CUVZZc1EwRkJiMElzU1VGQmNFSTdRVUZEUkR0QlFVTkdMRXRCY2tKRU8wRkJjMEpFT3p0QlFVVkVMRk5CUVU4c1UwRkJVRHRCUVVORUxFTkJNVkpwUWl4RlFVRnNRanM3YTBKQk5GSmxMRk03T3pzN096czdPenM3T3pzN1FVTnFVMlk3T3pzN1FVRkRRVHM3T3pzN096czdPenNyWlVGT1FUczdPenM3T3p0QlFWRkJMRWxCUVUwc1YwRkJXU3haUVVGTk8wRkJRM1JDT3pzN096czdRVUZOUVN4TlFVRk5MRTlCUVU4c1ZVRkJZanRCUVVOQkxFMUJRVTBzVlVGQlZTeFBRVUZvUWp0QlFVTkJMRTFCUVUwc2NVSkJRWEZDTzBGQlEzcENMR0ZCUVZNc1NVRkVaMEk3UVVGRmVrSXNXVUZCVVN4RFFVWnBRanRCUVVkNlFpeFRRVUZMTEVOQlNHOUNPMEZCU1hwQ0xGTkJRVXNzUjBGS2IwSTdRVUZMZWtJc1YwRkJUeXhMUVV4clFqdEJRVTE2UWl4aFFVRlRMRXRCVG1kQ08wRkJUM3BDTEdkQ1FVRlpPMEZCVUdFc1IwRkJNMEk3UVVGVFFTeE5RVUZOTEhkQ1FVRjNRaXhEUVVNMVFpeFJRVVEwUWl4RlFVVTFRaXhMUVVZMFFpeEZRVWMxUWl4TFFVZzBRaXhGUVVrMVFpeFBRVW8wUWl4RlFVczFRaXhUUVV3MFFpeEZRVTAxUWl4WlFVNDBRaXhEUVVFNVFqczdRVUZUUVRzN096czdPMEZCTTBKelFpeE5RV2xEYUVJc1VVRnFRMmRDTzBGQlFVRTdPMEZCYlVOd1FpeDNRa0ZCTUVJN1FVRkJRU3hWUVVGa0xFOUJRV01zZFVWQlFVb3NSVUZCU1RzN1FVRkJRVHM3UVVGSGVFSTdRVUZJZDBJc2MwaEJRMnhDTEVsQlJHdENMRVZCUTFvc1QwRkVXU3hGUVVOSUxHdENRVVJITEVWQlEybENMRTlCUkdwQ0xFVkJRekJDTEhGQ1FVUXhRaXhGUVVOcFJDeExRVVJxUkN4RlFVTjNSQ3hMUVVSNFJEczdRVUZKZUVJc1dVRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4TFFVRnlRaXhEUVVFeVFpeE5RVUV6UWl4SFFVRjFReXhOUVVGTExFOUJRVXdzUTBGQllTeE5RVUZ3UkRzN1FVRkZRVHRCUVVOQkxGVkJRVTBzWTBGQll5eE5RVUZMTEdOQlFVd3NSVUZCY0VJN1FVRkRRU3hyUWtGQldTeFpRVUZhTEVOQlFYbENMR1ZCUVhwQ0xFOUJRVFpETEUxQlFVc3NUMEZCVEN4RFFVRmhMRWRCUVRGRU8wRkJRMEVzYTBKQlFWa3NXVUZCV2l4RFFVRjVRaXhsUVVGNlFpeFBRVUUyUXl4TlFVRkxMRTlCUVV3c1EwRkJZU3hIUVVFeFJEczdRVUZGUVR0QlFVTkJMRlZCUVVrc1RVRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeEpRVU5ETEVOQlFVTXNXVUZCV1N4VFFVRmFMRU5CUVhOQ0xGRkJRWFJDTEVOQlFTdENMSE5DUVVFdlFpeERRVVJPTEVWQlF6aEVPMEZCUXpWRUxHOUNRVUZaTEZOQlFWb3NRMEZCYzBJc1IwRkJkRUlzUTBGQk1FSXNjMEpCUVRGQ08wRkJRMFE3TzBGQlJVUTdRVUZEUVN4VlFVRkpMRTlCUVU4c1RVRkJTeXhQUVVGTUxFTkJRV0VzVlVGQmNFSXNTMEZCYlVNc1VVRkJia01zU1VGRFF5eERRVUZETEZsQlFWa3NVMEZCV2l4RFFVRnpRaXhSUVVGMFFpeFRRVUZ4UXl4TlFVRkxMRTlCUVV3c1EwRkJZU3hWUVVGc1JDeERRVVJPTEVWQlEzVkZPMEZCUTNKRkxHOUNRVUZaTEZOQlFWb3NRMEZCYzBJc1IwRkJkRUlzVTBGQlowTXNUVUZCU3l4UFFVRk1MRU5CUVdFc1ZVRkJOME03UVVGRFJEdEJRWEpDZFVJN1FVRnpRbnBDT3p0QlFYcEViVUk3UVVGQlFUdEJRVUZCTEhWRFFUSkVTRHRCUVVObUxHVkJRVThzUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhoUVVGeVFpeERRVUZ0UXl4bFFVRnVReXhEUVVGUU8wRkJRMFE3UVVFM1JHMUNPMEZCUVVFN1FVRkJRU3cwUWtFclJFdzdRVUZCUVN4WlFVRllMRXRCUVZjc2RVVkJRVWdzUTBGQlJ6czdRVUZEWWl4WlFVRk5MR05CUVdNc1MwRkJTeXhqUVVGTUxFVkJRWEJDTzBGQlEwRXNXVUZCVFN4WFFVRlhMRXRCUVVzc1MwRkJUQ3hEUVVGWkxGTkJRVk1zUzBGQlN5eFBRVUZNTEVOQlFXRXNSMEZCWWl4SFFVRnRRaXhMUVVGTExFOUJRVXdzUTBGQllTeEhRVUY2UXl4RFFVRkVMRWRCUVd0RUxFZEJRVGRFTEVOQlFXcENPenRCUVVWQkxGbEJRVWtzVVVGQlVTeExRVUZMTEU5QlFVd3NRMEZCWVN4SFFVRjZRaXhGUVVFNFFqdEJRVU0xUWl4clFrRkJVU3hMUVVGU0xFTkJRV2xDTEVsQlFXcENMRzFDUVVGdFF5eExRVUZ1UXp0QlFVTkJMR2xDUVVGUExFdEJRVkE3UVVGRFJEczdRVUZGUkN4WlFVRkpMRkZCUVZFc1MwRkJTeXhQUVVGTUxFTkJRV0VzUjBGQmVrSXNSVUZCT0VJN1FVRkROVUlzYTBKQlFWRXNTMEZCVWl4RFFVRnBRaXhKUVVGcVFpeHRRa0ZCYlVNc1MwRkJia003UVVGRFFTeHBRa0ZCVHl4TFFVRlFPMEZCUTBRN08wRkJSVVFzYjBKQlFWa3NXVUZCV2l4RFFVRjVRaXhsUVVGNlFpeFBRVUUyUXl4TFFVRTNRenM3UVVGRlFUdEJRVU5CTEZsQlFVa3NTMEZCU3l4UFFVRk1MRU5CUVdFc1MwRkJha0lzUlVGQmQwSTdRVUZEZEVJc2MwSkJRVmtzVTBGQldpeEhRVUV5UWl4UlFVRXpRanRCUVVORU96dEJRVVZFTzBGQlEwRXNiMEpCUVZrc1MwRkJXaXhEUVVGclFpeExRVUZzUWl4SFFVRTJRaXhSUVVFM1FqczdRVUZGUVN4bFFVRlBMRWxCUVZBN1FVRkRSRHRCUVhoR2JVSTdRVUZCUVR0QlFVRkJMR2REUVRCR1Z6dEJRVUZCTEZsQlFYWkNMR05CUVhWQ0xIVkZRVUZPTEVsQlFVMDdPMEZCUXpkQ0xGbEJRVWtzUTBGQlF5eExRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRnNRaXhGUVVFeVFqdEJRVU42UWl4clFrRkJVU3hMUVVGU0xFTkJRV2xDTEVsQlFXcENPMEZCUTBFc2FVSkJRVThzUzBGQlVEdEJRVU5FT3p0QlFVVkVMRmxCUVUwc1kwRkJZeXhMUVVGTExHTkJRVXdzUlVGQmNFSTdPMEZCUlVFc1dVRkJTU3hyUWtGRFF5eERRVUZETEZsQlFWa3NVMEZCV2l4RFFVRnpRaXhSUVVGMFFpeERRVUVyUWl4MVFrRkJMMElzUTBGRVRpeEZRVU1yUkR0QlFVTTNSQ3h6UWtGQldTeFRRVUZhTEVOQlFYTkNMRWRCUVhSQ0xFTkJRVEJDTEhWQ1FVRXhRanRCUVVORU96dEJRVVZFTEZsQlFVa3NRMEZCUXl4alFVRkVMRWxCUTBNc1dVRkJXU3hUUVVGYUxFTkJRWE5DTEZGQlFYUkNMRU5CUVN0Q0xIVkNRVUV2UWl4RFFVUk1MRVZCUXpoRU8wRkJRelZFTEhOQ1FVRlpMRk5CUVZvc1EwRkJjMElzVFVGQmRFSXNRMEZCTmtJc2RVSkJRVGRDTzBGQlEwUTdPMEZCUlVRc1pVRkJUeXhKUVVGUU8wRkJRMFE3UVVFM1IyMUNPMEZCUVVFN1FVRkJRU3cyUWtFclIySTdRVUZEVEN4aFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEV0QlFYSkNMRU5CUVRKQ0xFMUJRVE5DTEVkQlFYVkRMRXRCUVVzc1QwRkJUQ3hEUVVGaExFMUJRWEJFTzBGQlEwRXNZVUZCU3l4WlFVRk1MRU5CUVd0Q0xHbENRVUZOTEVsQlFYaENPMEZCUTBFc1lVRkJTeXhaUVVGTUxFTkJRV3RDTEdsQ1FVRk5MRXRCUVhoQ096dEJRVVZCTEdWQlFVOHNTVUZCVUR0QlFVTkVPMEZCY2todFFqdEJRVUZCTzBGQlFVRXNOa0pCZFVoaU8wRkJRMHdzWVVGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhMUVVGeVFpeERRVUV5UWl4TlFVRXpRaXhIUVVGdlF5eExRVUZ3UXp0QlFVTkJMR0ZCUVVzc1dVRkJUQ3hEUVVGclFpeHBRa0ZCVFN4SlFVRjRRanRCUVVOQkxHRkJRVXNzV1VGQlRDeERRVUZyUWl4cFFrRkJUU3hOUVVGNFFqczdRVUZGUVN4bFFVRlBMRWxCUVZBN1FVRkRSRHRCUVRkSWJVSTdRVUZCUVR0QlFVRkJMRzlEUVN0SVF5eFBRUzlJUkN4RlFTdElWVHRCUVVNMVFpdzJSMEZCTWtJc1VVRkJNMElzUlVGQmNVTXNUMEZCY2tNN1FVRkRSRHRCUVdwSmJVSTdPMEZCUVVFN1FVRkJRVHM3UVVGdlNYUkNMRk5CUVU4c1VVRkJVRHRCUVVORUxFTkJja2xuUWl4RlFVRnFRanM3YTBKQmRVbGxMRkU3T3pzN096czdPenM3T3pzN1FVTXhTV1k3T3pzN1FVRkRRVHM3UVVGRFFUczdPenRCUVVOQk96czdPenM3T3pzclpVRlNRVHM3T3pzN096dEJRVlZCTEVsQlFVMHNUVUZCVHl4WlFVRk5PMEZCUTJwQ096czdPenM3UVVGTlFTeE5RVUZOTEU5QlFVOHNTMEZCWWp0QlFVTkJMRTFCUVUwc1ZVRkJWU3hQUVVGb1FqdEJRVU5CTEUxQlFVMHNjVUpCUVhGQ0xFVkJRVE5DTzBGQlIwRXNUVUZCVFN4M1FrRkJkMElzUlVGQk9VSTdRVUZGUVN4TlFVRk5MSFZDUVVGMVFpeFhRVUUzUWpzN1FVRkZRVHM3T3pzN08wRkJhRUpwUWl4TlFYTkNXQ3hIUVhSQ1Z6dEJRVUZCT3p0QlFYZENaaXh0UWtGQk1FSTdRVUZCUVN4VlFVRmtMRTlCUVdNc2RVVkJRVW9zUlVGQlNUczdRVUZCUVRzN1FVRkJRU3gxUjBGRGJFSXNTVUZFYTBJc1JVRkRXaXhQUVVSWkxFVkJRMGdzYTBKQlJFY3NSVUZEYVVJc1QwRkVha0lzUlVGRE1FSXNjVUpCUkRGQ0xFVkJRMmxFTEV0QlJHcEVMRVZCUTNkRUxFdEJSSGhFTzBGQlJYcENPenRCUVRGQ1l6dEJRVUZCTzBGQlFVRXNOa0pCTkVKU08wRkJRMHdzV1VGQlNTeExRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xGTkJRWEpDTEVOQlFTdENMRkZCUVM5Q0xFTkJRWGRETEZGQlFYaERMRU5CUVVvc1JVRkJkVVE3UVVGRGNrUXNhVUpCUVU4c1MwRkJVRHRCUVVORU96dEJRVVZFTEZsQlFVMHNTMEZCU3l4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEZsQlFYSkNMRU5CUVd0RExFMUJRV3hETEVOQlFWZzdRVUZEUVN4WlFVRk5MRTFCUVUwc09FSkJRV3RDTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVM5Q0xFVkJRWGRETEV0QlFYaERMRU5CUVZvN1FVRkRRU3haUVVGTkxGVkJRVlVzVFVGQlRTeEpRVUZKTEdkQ1FVRktMRzlDUVVGelF5eEpRVUYwUXl4UlFVRk9MRWRCUVhkRUxFbEJRWGhGT3p0QlFVVkJMRmxCUVVrc1QwRkJTaXhGUVVGaE8wRkJRMWdzYTBKQlFWRXNUMEZCVWl4RFFVRm5RaXhWUVVGRExFZEJRVVFzUlVGQlV6dEJRVU4yUWl4blFrRkJTU3hKUVVGSkxGTkJRVW9zUTBGQll5eFJRVUZrTEVOQlFYVkNMRkZCUVhaQ0xFTkJRVW9zUlVGQmMwTTdRVUZEY0VNc2EwSkJRVWtzVTBGQlNpeERRVUZqTEUxQlFXUXNRMEZCY1VJc1VVRkJja0k3UVVGRFJEdEJRVU5FTEdkQ1FVRkpMRmxCUVVvc1EwRkJhVUlzWlVGQmFrSXNSVUZCYTBNc1MwRkJiRU03UVVGRFJDeFhRVXhFTzBGQlRVUTdPMEZCUlVRc1lVRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4VFFVRnlRaXhEUVVFclFpeEhRVUV2UWl4RFFVRnRReXhSUVVGdVF6dEJRVU5CTEdGQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzV1VGQmNrSXNRMEZCYTBNc1pVRkJiRU1zUlVGQmJVUXNTVUZCYmtRN08wRkJSVUVzV1VGQlRTeGhRVUZoTEZOQlFWTXNZVUZCVkN4RFFVRjFRaXhGUVVGMlFpeERRVUZ1UWp0QlFVTkJMRmxCUVUwc1kwRkJZeXhYUVVGWExGVkJRVmdzUTBGQmMwSXNaMEpCUVhSQ0xFTkJRWFZETEc5Q1FVRjJReXhEUVVGd1FqczdRVUZGUVN4WlFVRkpMRmRCUVVvc1JVRkJhVUk3UVVGRFppeHpRa0ZCV1N4UFFVRmFMRU5CUVc5Q0xGVkJRVU1zUjBGQlJDeEZRVUZUTzBGQlF6TkNMR2RDUVVGSkxFbEJRVWtzVTBGQlNpeERRVUZqTEZGQlFXUXNRMEZCZFVJc1VVRkJka0lzUTBGQlNpeEZRVUZ6UXp0QlFVTndReXhyUWtGQlNTeFRRVUZLTEVOQlFXTXNUVUZCWkN4RFFVRnhRaXhSUVVGeVFqdEJRVU5FTzBGQlEwWXNWMEZLUkR0QlFVdEVPenRCUVVWRUxHMUNRVUZYTEZOQlFWZ3NRMEZCY1VJc1IwRkJja0lzUTBGQmVVSXNVMEZCZWtJN08wRkJSVUVzYlVKQlFWY3NXVUZCVFR0QlFVTm1MR05CUVUwc1YwRkJWeXhUUVVGWUxGRkJRVmNzUjBGQlRUdEJRVU55UWl4MVFrRkJWeXhUUVVGWUxFTkJRWEZDTEUxQlFYSkNMRU5CUVRSQ0xGTkJRVFZDTzBGQlEwRXNkVUpCUVZjc1UwRkJXQ3hEUVVGeFFpeEhRVUZ5UWl4RFFVRjVRaXhSUVVGNlFqdEJRVU5CTEhWQ1FVRlhMRk5CUVZnc1EwRkJjVUlzVFVGQmNrSXNRMEZCTkVJc1UwRkJOVUk3UVVGRFFTeDFRa0ZCVnl4dFFrRkJXQ3hEUVVFclFpeHBRa0ZCVFN4alFVRnlReXhGUVVGeFJDeFJRVUZ5UkR0QlFVTkVMRmRCVEVRN08wRkJUMEVzY1VKQlFWY3NaMEpCUVZnc1EwRkJORUlzYVVKQlFVMHNZMEZCYkVNc1JVRkJhMFFzVVVGQmJFUTdPMEZCUlVFc2NVSkJRVmNzVTBGQldDeERRVUZ4UWl4SFFVRnlRaXhEUVVGNVFpeFRRVUY2UWp0QlFVVkVMRk5CV2tRc1JVRlpSeXhGUVZwSU96dEJRV05CTEdWQlFVOHNTVUZCVUR0QlFVTkVPMEZCTjBWak8wRkJRVUU3UVVGQlFTdzJRa0VyUlZJN1FVRkRUQ3haUVVGSkxFTkJRVU1zUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhUUVVGeVFpeERRVUVyUWl4UlFVRXZRaXhEUVVGM1F5eFJRVUY0UXl4RFFVRk1MRVZCUVhkRU8wRkJRM1JFTEdsQ1FVRlBMRXRCUVZBN1FVRkRSRHM3UVVGRlJDeFpRVUZKTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzVTBGQmNrSXNRMEZCSzBJc1VVRkJMMElzUTBGQmQwTXNVVUZCZUVNc1EwRkJTaXhGUVVGMVJEdEJRVU55UkN4bFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEZOQlFYSkNMRU5CUVN0Q0xFMUJRUzlDTEVOQlFYTkRMRkZCUVhSRE8wRkJRMFE3TzBGQlJVUXNZVUZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFpRVUZ5UWl4RFFVRnJReXhsUVVGc1F5eEZRVUZ0UkN4TFFVRnVSRHM3UVVGRlFTeFpRVUZOTEV0QlFVc3NTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFpRVUZ5UWl4RFFVRnJReXhOUVVGc1F5eERRVUZZTzBGQlEwRXNXVUZCVFN4aFFVRmhMRk5CUVZNc1lVRkJWQ3hEUVVGMVFpeEZRVUYyUWl4RFFVRnVRanM3UVVGRlFTeFpRVUZKTEZkQlFWY3NVMEZCV0N4RFFVRnhRaXhSUVVGeVFpeERRVUU0UWl4UlFVRTVRaXhEUVVGS0xFVkJRVFpETzBGQlF6TkRMSEZDUVVGWExGTkJRVmdzUTBGQmNVSXNUVUZCY2tJc1EwRkJORUlzVVVGQk5VSTdRVUZEUkRzN1FVRkZSQ3hsUVVGUExFbEJRVkE3UVVGRFJEdEJRV3hIWXp0QlFVRkJPMEZCUVVFc2IwTkJiMGROTEU5QmNFZE9MRVZCYjBkbE8wRkJRelZDTEcxSFFVRXlRaXhIUVVFelFpeEZRVUZuUXl4UFFVRm9RenRCUVVORU8wRkJkRWRqT3p0QlFVRkJPMEZCUVVFN08wRkJlVWRxUWpzN096czdPenRCUVV0QkxFMUJRVTBzWVVGQllTeEZRVUZ1UWpzN1FVRkZRU3hOUVVGTkxFOUJRVThzVTBGQlV5eG5Ra0ZCVkN4dlFrRkJNa01zU1VGQk0wTXNVVUZCWWp0QlFVTkJMRTFCUVVrc1NVRkJTaXhGUVVGVk8wRkJRMUlzVTBGQlN5eFBRVUZNTEVOQlFXRXNWVUZCUXl4UFFVRkVMRVZCUVdFN1FVRkRlRUk3UVVGRFFTeFZRVUZOTEZOQlFWTXNNa05CUVc5Q0xFOUJRWEJDTEVWQlFUWkNMR3RDUVVFM1FpeEZRVUZwUkN4eFFrRkJha1FzUTBGQlpqdEJRVU5CTEdGQlFVOHNUMEZCVUN4SFFVRnBRaXhQUVVGcVFqczdRVUZGUVN4cFFrRkJWeXhKUVVGWUxFTkJRV2RDTEVsQlFVa3NZVUZCU2l4RFFVRnJRaXhOUVVGc1FpeERRVUZvUWp0QlFVTkVMRXRCVGtRN1FVRlBSRHM3UVVGRlJDeE5RVUZKTEVsQlFVb3NSVUZCVlR0QlFVTlNMR0ZCUVZNc1owSkJRVlFzUTBGQk1FSXNUMEZCTVVJc1JVRkJiVU1zVlVGQlF5eExRVUZFTEVWQlFWYzdRVUZETlVNc1ZVRkJUU3hwUWtGQmFVSXNUVUZCVFN4TlFVRk9MRU5CUVdFc1dVRkJZaXhEUVVFd1FpeGhRVUV4UWl4RFFVRjJRanRCUVVOQkxGVkJRVWtzYTBKQlFXdENMRzFDUVVGdFFpeEpRVUY2UXl4RlFVRXJRenRCUVVNM1F5eFpRVUZOTEV0QlFVc3NUVUZCVFN4TlFVRk9MRU5CUVdFc1dVRkJZaXhEUVVFd1FpeE5RVUV4UWl4RFFVRllPenRCUVVWQkxGbEJRVTBzV1VGQldTeFhRVUZYTEVsQlFWZ3NRMEZCWjBJN1FVRkJRU3hwUWtGQlN5eEZRVUZGTEZWQlFVWXNSMEZCWlN4WlFVRm1MRU5CUVRSQ0xFMUJRVFZDTEUxQlFYZERMRVZCUVRkRE8wRkJRVUVzVTBGQmFFSXNRMEZCYkVJN08wRkJSVUVzV1VGQlNTeERRVUZETEZOQlFVd3NSVUZCWjBJN1FVRkRaRHRCUVVORU96dEJRVVZFTEd0Q1FVRlZMRWxCUVZZN1FVRkRSRHRCUVVOR0xFdEJZa1E3UVVGalJEczdRVUZGUkN4VFFVRlBMRWRCUVZBN1FVRkRSQ3hEUVRkSlZ5eEZRVUZhT3p0clFrRXJTV1VzUnpzN096czdPenM3T3pzN096czdPMEZEZWtwbU96czdPenM3UVVGTlFTeEpRVUZOTEU5QlFWRXNXVUZCVFR0QlFVTnNRanM3T3pzN08wRkJUVUVzVFVGQlRTeFBRVUZQTEUxQlFXSTdRVUZEUVN4TlFVRk5MRlZCUVZVc1QwRkJhRUk3TzBGQlJVRTdPenM3T3p0QlFWWnJRaXhOUVdkQ1dpeEpRV2hDV1R0QlFXbENhRUk3T3pzN1FVRkpRU3hyUWtGQldTeEpRVUZhTEVWQlFXdENPMEZCUVVFN08wRkJRMmhDTEZWQlFVa3NVVUZCVHl4SlFVRlFMSGxEUVVGUExFbEJRVkFzVDBGQlowSXNVVUZCY0VJc1JVRkJPRUk3UVVGRE5VSXNZMEZCVFN4SlFVRkpMRXRCUVVvc1EwRkJZU3hKUVVGaUxGTkJRWEZDTEU5QlFYSkNMRU5CUVU0N1FVRkRSRHRCUVVORUxGZEJRVXNzU1VGQlRDeEhRVUZaTEVsQlFWbzdRVUZEUVN4WFFVRkxMRk5CUVV3c1IwRkJhVUlzU1VGQmFrSTdRVUZEUkRzN1FVRXpRbVU3UVVGQlFUdEJRVUZCTEd0RFFUWkNTanRCUVVOV0xGbEJRVTBzVFVGQlRTeEpRVUZKTEdOQlFVb3NSVUZCV2p0QlFVTkJMRmxCUVVrc2NVSkJRWEZDTEVkQlFYSkNMRWxCUVRSQ0xFdEJRVXNzU1VGQlRDeERRVUZWTEZkQlFWWXNTMEZCTUVJc1NVRkJNVVFzUlVGQlowVTdRVUZET1VRc1kwRkJTU3hsUVVGS0xFZEJRWE5DTEVsQlFYUkNPMEZCUTBRN1FVRkRSQ3hsUVVGUExFZEJRVkE3UVVGRFJEczdRVUZGUkRzN096czdRVUZ5UTJkQ08wRkJRVUU3UVVGQlFTeHRRMEY1UTFNN1FVRkJRU3haUVVGa0xFOUJRV01zZFVWQlFVb3NSVUZCU1RzN1FVRkRka0lzWVVGQlN5eEpRVUZOTEVkQlFWZ3NTVUZCYTBJc1QwRkJiRUlzUlVGQk1rSTdRVUZEZWtJc1pVRkJTeXhIUVVGTUxFTkJRVk1zWjBKQlFWUXNRMEZCTUVJc1IwRkJNVUlzUlVGQkswSXNVVUZCVVN4SFFVRlNMRU5CUVM5Q08wRkJRMFE3UVVGRFJqdEJRVGREWlR0QlFVRkJPMEZCUVVFc2NVTkJLME5FTzBGQlFVRTdPMEZCUTJJc1dVRkJTU3hSUVVGUExFdEJRVXNzU1VGQlRDeERRVUZWTEU5QlFXcENMRTFCUVRaQ0xGRkJRV3BETEVWQlFUSkRPMEZCUTNwRExHVkJRVXNzVlVGQlRDeERRVUZuUWl4TFFVRkxMRWxCUVV3c1EwRkJWU3hQUVVFeFFqdEJRVU5FT3p0QlFVVkVMRmxCUVVrc1QwRkJUeXhMUVVGTExFbEJRVXdzUTBGQlZTeFBRVUZxUWl4TFFVRTJRaXhSUVVGcVF5eEZRVUV5UXp0QlFVTjZReXhsUVVGTExFZEJRVXdzUTBGQlV5eFBRVUZVTEVkQlFXMUNMRXRCUVVzc1NVRkJUQ3hEUVVGVkxFOUJRVGRDTzBGQlEwRXNaVUZCU3l4SFFVRk1MRU5CUVZNc1UwRkJWQ3hIUVVGeFFpeFpRVUZOTzBGQlEzcENMR3RDUVVGTExGTkJRVXdzUjBGQmFVSXNhMEpCUVdwQ08wRkJRMFFzVjBGR1JEdEJRVWRFT3p0QlFVVkVMRmxCUVVrc1QwRkJUeXhMUVVGTExFbEJRVXdzUTBGQlZTeFhRVUZxUWl4TFFVRnBReXhSUVVGeVF5eEZRVUVyUXp0QlFVTTNReXhsUVVGTExGVkJRVXdzUTBGQlowSXNSVUZCUlN4blFrRkJaMElzUzBGQlN5eEpRVUZNTEVOQlFWVXNWMEZCTlVJc1JVRkJhRUk3UVVGRFJEczdRVUZGUkN4WlFVRkpMRXRCUVVzc1NVRkJUQ3hEUVVGVkxGRkJRVllzUzBGQmRVSXNTMEZCZGtJc1NVRkJaME1zUzBGQlN5eEhRVUZNTEVOQlFWTXNaMEpCUVRkRExFVkJRU3RFTzBGQlF6ZEVMR1ZCUVVzc1IwRkJUQ3hEUVVGVExHZENRVUZVTEVOQlFUQkNMR2REUVVFeFFqdEJRVU5FTzBGQlEwWTdRVUZzUldVN1FVRkJRVHRCUVVGQkxITkRRVzlGUVR0QlFVTmtMRmxCUVVrc1YwRkJWeXhKUVVGbU8wRkJRMEVzV1VGQlNTeExRVUZMTEVsQlFVd3NRMEZCVlN4UlFVRldMRXRCUVhWQ0xFMUJRVE5DTEVWQlFXMURPMEZCUTJwRExHTkJRVWs3UVVGRFJpeDFRa0ZCVnl4TFFVRkxMRXRCUVV3c1EwRkJWeXhMUVVGTExFZEJRVXdzUTBGQlV5eFpRVUZ3UWl4RFFVRllPMEZCUTBRc1YwRkdSQ3hEUVVWRkxFOUJRVThzUzBGQlVDeEZRVUZqTzBGQlEyUXNhVUpCUVVzc1UwRkJUQ3hIUVVGcFFpeG5Ra0ZCYWtJN1FVRkRSRHRCUVVOR0xGTkJUa1FzVFVGTlR5eEpRVUZKTEV0QlFVc3NTVUZCVEN4RFFVRlZMRkZCUVZZc1MwRkJkVUlzUzBGQk0wSXNSVUZCYTBNN1FVRkRka01zY1VKQlFWY3NTMEZCU3l4SFFVRk1MRU5CUVZNc1YwRkJjRUk3UVVGRFJDeFRRVVpOTEUxQlJVRTdRVUZEVEN4eFFrRkJWeXhMUVVGTExFZEJRVXdzUTBGQlV5eFpRVUZ3UWp0QlFVTkVPMEZCUTBRc1pVRkJUeXhSUVVGUU8wRkJRMFE3UVVGc1JtVTdRVUZCUVR0QlFVRkJMRzFEUVc5R1NEdEJRVUZCT3p0QlFVTllMR0ZCUVVzc1IwRkJUQ3hIUVVGWExFdEJRVXNzVTBGQlRDeEZRVUZZTzBGQlEwRXNZVUZCU3l4SFFVRk1MRU5CUVZNc1NVRkJWQ3hEUVVGakxFdEJRVXNzU1VGQlRDeERRVUZWTEUxQlFYaENMRVZCUVdkRExFdEJRVXNzU1VGQlRDeERRVUZWTEVkQlFURkRMRVZCUVN0RExFbEJRUzlETzBGQlEwRXNZVUZCU3l4WlFVRk1PenRCUVVWQkxHRkJRVXNzUjBGQlRDeERRVUZUTEd0Q1FVRlVMRWRCUVRoQ0xGbEJRVTA3UVVGRGJFTXNZMEZCU1N4VFFVRlRMRTlCUVVzc1IwRkJUQ3hEUVVGVExGVkJRV3hDTEUxQlFXdERMRU5CUVhSRExFVkJRWGxETzBGQlEzWkRMR2RDUVVGTkxGTkJRVk1zVDBGQlN5eEhRVUZNTEVOQlFWTXNUVUZCVkN4RFFVRm5RaXhSUVVGb1FpeEZRVUZtT3p0QlFVVkJPMEZCUTBFc1owSkJRVWtzVDBGQlR5eFBRVUZMTEVsQlFVd3NRMEZCVlN4UlFVRnFRaXhMUVVFNFFpeFZRVUZzUXl4RlFVRTRRenRCUVVNMVF5eHhRa0ZCU3l4SlFVRk1MRU5CUVZVc1VVRkJWaXhEUVVGdFFpeFBRVUZMTEZOQlFYaENMRVZCUVcxRExFOUJRVXNzUjBGQmVFTTdRVUZEUkRzN1FVRkZSRHRCUVVOQkxHZENRVUZKTEU5QlFVOHNRMEZCVUN4TlFVRmpMRWRCUVd4Q0xFVkJRWFZDTzBGQlEzSkNMR3RDUVVGSkxFOUJRVThzVDBGQlN5eEpRVUZNTEVOQlFWVXNUMEZCYWtJc1MwRkJOa0lzVlVGQmFrTXNSVUZCTmtNN1FVRkRNME1zZFVKQlFVc3NTVUZCVEN4RFFVRlZMRTlCUVZZc1EwRkJhMElzVDBGQlN5eGhRVUZNTEVWQlFXeENMRVZCUVhkRExFOUJRVXNzUjBGQk4wTTdRVUZEUkR0QlFVTkVPMEZCUTBRN08wRkJSVVE3UVVGRFFTeG5Ra0ZCU1N4UFFVRlBMRTlCUVVzc1NVRkJUQ3hEUVVGVkxFdEJRV3BDTEV0QlFUSkNMRlZCUVM5Q0xFVkJRVEpETzBGQlEzcERPMEZCUTBFc2NVSkJRVThzVlVGQlVDeERRVUZyUWl4WlFVRk5PMEZCUTNSQ0xIVkNRVUZMTEVsQlFVd3NRMEZCVlN4TFFVRldMRU5CUVdkQ0xFOUJRVXNzVTBGQmNrSXNSVUZCWjBNc1QwRkJTeXhIUVVGeVF6dEJRVU5FTEdWQlJrUXNSVUZGUnl4RFFVWklPMEZCUjBRN1FVRkRSanRCUVVOR0xGTkJla0pFTzBGQk1FSkJMR0ZCUVVzc1IwRkJUQ3hEUVVGVExFbEJRVlFzUTBGQll5eExRVUZMTEVsQlFVd3NRMEZCVlN4SlFVRjRRanM3UVVGRlFTeGxRVUZQTEVsQlFWQTdRVUZEUkR0QlFYUklaVHRCUVVGQk8wRkJRVUVzSzBKQmQwaFFPMEZCUTFBc1lVRkJTeXhUUVVGTUxFZEJRV2xDTEZWQlFXcENPMEZCUTBFc1dVRkJTU3hMUVVGTExFZEJRVlFzUlVGQll6dEJRVU5hTEdWQlFVc3NSMEZCVEN4RFFVRlRMRXRCUVZRN1FVRkRSRHRCUVVORUxHRkJRVXNzUjBGQlRDeEhRVUZYTEVsQlFWZzdRVUZEUkRzN1FVRkZSRHM3UVVGb1NXZENPMEZCUVVFN096dEJRWE5KYUVJN08wRkJSVUU3UVVGNFNXZENMRzlEUVhsSlN5eEpRWHBKVEN4RlFYbEpWenRCUVVONlFpeGxRVUZQTEVsQlFVa3NTVUZCU2l4RFFVRlRMRWxCUVZRc1JVRkJaU3hWUVVGbUxFVkJRVkE3UVVGRFJEdEJRVE5KWlR0QlFVRkJPMEZCUVVFc01FSkJhMGxMTzBGQlEyNUNMR1ZCUVZVc1NVRkJWaXhUUVVGclFpeFBRVUZzUWp0QlFVTkVPMEZCY0VsbE96dEJRVUZCTzBGQlFVRTdPMEZCT0Vsc1FpeFRRVUZQTEVsQlFWQTdRVUZEUkN4RFFTOUpXU3hGUVVGaU96dHJRa0ZwU21Vc1NUczdPenM3T3pzN1VVTjJTa01zYlVJc1IwRkJRU3h0UWp0UlFVMUJMRzlDTEVkQlFVRXNiMEk3VVVGTFFTeHBRaXhIUVVGQkxHbENPMEZCV0ZRc1UwRkJVeXh0UWtGQlZDeERRVUUyUWl4VFFVRTNRaXhGUVVGM1F5eFZRVUY0UXl4RlFVRnBSVHRCUVVGQkxFMUJRV0lzVFVGQllTeDFSVUZCU2l4RlFVRkpPenRCUVVOMFJTeE5RVUZOTEdkQ1FVRnRRaXhUUVVGdVFpeFpRVUZ0UXl4VlFVRjZRenRCUVVOQkxGTkJRVThzWVVGQlVDeERRVUZ4UWl4SlFVRkpMRmRCUVVvc1EwRkJaMElzWVVGQmFFSXNSVUZCSzBJc1JVRkJSU3hqUVVGR0xFVkJRUzlDTEVOQlFYSkNPMEZCUTBFc1YwRkJVeXhoUVVGVUxFTkJRWFZDTEVsQlFVa3NWMEZCU2l4RFFVRm5RaXhoUVVGb1FpeEZRVUVyUWl4RlFVRkZMR05CUVVZc1JVRkJMMElzUTBGQmRrSTdRVUZEUkRzN1FVRkZUU3hUUVVGVExHOUNRVUZVTEVOQlFUaENMRlZCUVRsQ0xFVkJRVEJETEZOQlFURkRMRVZCUVhGRUxGVkJRWEpFTEVWQlFUaEZPMEZCUVVFc1RVRkJZaXhOUVVGaExIVkZRVUZLTEVWQlFVazdPMEZCUTI1R0xFMUJRVTBzWjBKQlFXMUNMRk5CUVc1Q0xGbEJRVzFETEZWQlFYcERPMEZCUTBFc1lVRkJWeXhoUVVGWUxFTkJRWGxDTEVsQlFVa3NWMEZCU2l4RFFVRm5RaXhoUVVGb1FpeEZRVUVyUWl4RlFVRkZMR05CUVVZc1JVRkJMMElzUTBGQmVrSTdRVUZEUkRzN1FVRkZUU3hUUVVGVExHbENRVUZVTEVOQlFUSkNMRk5CUVROQ0xFVkJRWE5ETEZGQlFYUkRMRVZCUVRaRU8wRkJRVUVzVFVGQllpeE5RVUZoTEhWRlFVRktMRVZCUVVrN08wRkJRMnhGTEUxQlFVMHNaMEpCUVcxQ0xGRkJRVzVDTEZOQlFTdENMRk5CUVhKRE8wRkJRMEVzVTBGQlR5eGhRVUZRTEVOQlFYRkNMRWxCUVVrc1YwRkJTaXhEUVVGblFpeGhRVUZvUWl4RlFVRXJRaXhGUVVGRkxHTkJRVVlzUlVGQkwwSXNRMEZCY2tJN1FVRkRRU3hYUVVGVExHRkJRVlFzUTBGQmRVSXNTVUZCU1N4WFFVRktMRU5CUVdkQ0xHRkJRV2hDTEVWQlFTdENMRVZCUVVVc1kwRkJSaXhGUVVFdlFpeERRVUYyUWp0QlFVTkVPenM3T3pzN096dEJRMlpFTzBGQlEwRXNTVUZCU1N4UFFVRlBMRTFCUVZBc1MwRkJhMElzVjBGQmRFSXNSVUZCYlVNN1FVRkRha01zVTBGQlR5eG5Ra0ZCVUN4RFFVRjNRaXhQUVVGNFFpeEZRVUZwUXl4WlFVRk5PMEZCUTNKRExGbEJRVkVzUzBGQlVpeERRVUZqTEhWSFFVRmtPMEZCUTBRc1IwRkdSRHRCUVVkRU96dEJRVVZFTzBGQlEwRXNTVUZCU1N4clFrRkJhMElzUTBGQlF5eFhRVUZFTEVWQlFXTXNWMEZCWkN4RlFVRXlRaXhUUVVFelFpeERRVUYwUWp0QlFVTkJMRWxCUVVrc1kwRkJZeXhMUVVGc1FqczdRVUZGUVN4SlFVRkpMRTlCUVU4c1RVRkJVQ3hMUVVGclFpeFhRVUYwUWl4RlFVRnRRenRCUVVOcVF5eE5RVUZMTEd0Q1FVRnJRaXhOUVVGdVFpeEpRVUU0UWl4UFFVRlBMR0ZCUVZBc1NVRkJkMElzYjBKQlFXOUNMR0ZCUVRsRkxFVkJRVFpHTzBGQlF6TkdMR3RDUVVGakxFbEJRV1E3UVVGRFFTeHpRa0ZCYTBJc1EwRkJReXhaUVVGRUxFVkJRV1VzVjBGQlppeEZRVUUwUWl4VlFVRTFRaXhGUVVGM1F5eGhRVUY0UXl4RFFVRnNRanRCUVVORU96dEJRVVZFTEUxQlFVa3NUMEZCVHl4VFFVRlFMRU5CUVdsQ0xHTkJRWEpDTEVWQlFYRkRPMEZCUTI1RExITkNRVUZyUWl4RFFVRkRMR0ZCUVVRc1JVRkJaMElzWVVGQmFFSXNSVUZCSzBJc1YwRkJMMElzUlVGQk5FTXNaVUZCTlVNc1EwRkJiRUk3UVVGRFJDeEhRVVpFTEUxQlJVOHNTVUZCU1N4UFFVRlBMRk5CUVZBc1EwRkJhVUlzWjBKQlFYSkNMRVZCUVhWRE8wRkJRelZETEhOQ1FVRnJRaXhEUVVGRExHVkJRVVFzUlVGQmEwSXNaVUZCYkVJc1JVRkJiVU1zWVVGQmJrTXNSVUZCYTBRc2FVSkJRV3hFTEVOQlFXeENPMEZCUTBRN1FVRkRSanM3UVVGRlJDeEpRVUZOTEV0QlFVc3NVMEZCVXl4aFFVRlVMRU5CUVhWQ0xFdEJRWFpDTEVOQlFWZzdRVUZEUVN4SlFVRk5MR05CUVdNc1EwRkRiRUlzUlVGQlJTeE5RVUZOTEZsQlFWSXNSVUZCYzBJc1QwRkJUeXhwUWtGQk4wSXNSVUZCWjBRc1MwRkJTeXhsUVVGeVJDeEZRVVJyUWl4RlFVVnNRaXhGUVVGRkxFMUJRVTBzWlVGQlVpeEZRVUY1UWl4UFFVRlBMR2xDUVVGb1F5eEZRVUZ0UkN4TFFVRkxMR1ZCUVhoRUxFVkJSbXRDTEVWQlIyeENMRVZCUVVVc1RVRkJUU3hqUVVGU0xFVkJRWGRDTEU5QlFVOHNiVUpCUVM5Q0xFVkJRVzlFTEV0QlFVc3NhVUpCUVhwRUxFVkJTR3RDTEVWQlNXeENMRVZCUVVVc1RVRkJUU3hyUWtGQlVpeEZRVUUwUWl4UFFVRlBMSFZDUVVGdVF5eEZRVUUwUkN4TFFVRkxMSEZDUVVGcVJTeEZRVXByUWl4RFFVRndRanRCUVUxQkxFbEJRVTBzWVVGQllTeERRVU5xUWl4RlFVRkZMRTFCUVUwc1YwRkJVaXhGUVVGeFFpeFBRVUZQTEdkQ1FVRTFRaXhGUVVFNFF5eExRVUZMTEdOQlFXNUVMRVZCUkdsQ0xFVkJSV3BDTEVWQlFVVXNUVUZCVFN4alFVRlNMRVZCUVhkQ0xFOUJRVThzWjBKQlFTOUNMRVZCUVdsRUxFdEJRVXNzWTBGQmRFUXNSVUZHYVVJc1JVRkhha0lzUlVGQlJTeE5RVUZOTEdGQlFWSXNSVUZCZFVJc1QwRkJUeXhyUWtGQk9VSXNSVUZCYTBRc1MwRkJTeXhuUWtGQmRrUXNSVUZJYVVJc1JVRkpha0lzUlVGQlJTeE5RVUZOTEdsQ1FVRlNMRVZCUVRKQ0xFOUJRVThzYzBKQlFXeERMRVZCUVRCRUxFdEJRVXNzYjBKQlFTOUVMRVZCU21sQ0xFTkJRVzVDT3p0QlFVOUJMRWxCUVUwc2EwSkJRV3RDTEZsQlFWa3NTVUZCV2l4RFFVRnBRanRCUVVGQkxGTkJRVXNzUjBGQlJ5eExRVUZJTEVOQlFWTXNSVUZCUlN4SlFVRllMRTFCUVhGQ0xGTkJRVEZDTzBGQlFVRXNRMEZCYWtJc1JVRkJjMFFzUzBGQk9VVTdRVUZEUVN4SlFVRk5MR2RDUVVGblFpeFpRVUZaTEVsQlFWb3NRMEZCYVVJN1FVRkJRU3hUUVVGTExFZEJRVWNzUzBGQlNDeERRVUZUTEVWQlFVVXNTVUZCV0N4TlFVRnhRaXhUUVVFeFFqdEJRVUZCTEVOQlFXcENMRVZCUVhORUxFZEJRVFZGTzBGQlEwRXNTVUZCVFN4cFFrRkJhVUlzVjBGQlZ5eEpRVUZZTEVOQlFXZENPMEZCUVVFc1UwRkJTeXhIUVVGSExFdEJRVWdzUTBGQlV5eEZRVUZGTEVsQlFWZ3NUVUZCY1VJc1UwRkJNVUk3UVVGQlFTeERRVUZvUWl4RlFVRnhSQ3hMUVVFMVJUdEJRVU5CTEVsQlFVMHNaVUZCWlN4WFFVRlhMRWxCUVZnc1EwRkJaMEk3UVVGQlFTeFRRVUZMTEVkQlFVY3NTMEZCU0N4RFFVRlRMRVZCUVVVc1NVRkJXQ3hOUVVGeFFpeFRRVUV4UWp0QlFVRkJMRU5CUVdoQ0xFVkJRWEZFTEVkQlFURkZPenRyUWtGRlpUdEJRVU5pTzBGQlEwRXNaMEpCUVdNc1YwRkdSRHM3UVVGSllqdEJRVU5CTEd0Q1FVRm5RaXhSUVV4SU8wRkJUV0lzYlVKQlFXbENMRk5CVGtvN08wRkJVV0k3UVVGRFFTeFJRVUZOTEUxQlZFODdRVUZWWWl4VFFVRlBMRTlCVmswN1FVRlhZaXhSUVVGTkxFMUJXRTg3UVVGWllpeFZRVUZSTEZGQldrczdPMEZCWTJJN1FVRkRRU3hSUVVGTkxFMUJaazg3TzBGQmFVSmlPMEZCUTBFc1UwRkJUeXhuUWtGQlowSXNRMEZCYUVJc1EwRnNRazA3UVVGdFFtSXNVVUZCVFN4blFrRkJaMElzUTBGQmFFSXNRMEZ1UWs4N1FVRnZRbUlzVDBGQlN5eG5Ra0ZCWjBJc1EwRkJhRUlzUTBGd1FsRTdRVUZ4UW1Jc1ZVRkJVU3hQUVVGUExHZENRVUZuUWl4RFFVRm9RaXhEUVVGUUxFdEJRVGhDTEZkQlFUbENMRWRCUVRSRExFbEJRVFZETEVkQlFXMUVMR2RDUVVGblFpeERRVUZvUWl4RFFYSkNPVU03TzBGQmRVSmlPMEZCUTBFc2IwSkJRV3RDTEdWQmVFSk1PMEZCZVVKaUxHdENRVUZuUWl4aFFYcENTRHM3UVVFeVFtSTdRVUZEUVN4dFFrRkJhVUlzWTBFMVFrbzdRVUUyUW1Jc2FVSkJRV1VzV1VFM1FrWTdPMEZCSzBKaU8wRkJRMEVzYVVKQlFXVTdRVUZvUTBZc1F6czdPenM3T3pzN096czdPenM3TzBGRE0wTm1PenM3T3pzN1FVRk5RU3hKUVVGTkxGTkJRVlVzV1VGQlRUdEJRVU53UWpzN096czdPMEZCVFVFc1RVRkJUU3hQUVVGUExHRkJRV0k3UVVGRFFTeE5RVUZOTEZWQlFWVXNUMEZCYUVJN08wRkJSVUU3T3pzN096dEJRVlp2UWl4TlFXZENaQ3hOUVdoQ1l6dEJRV2xDYkVJc2IwSkJRVmtzVDBGQldpeEZRVUZ4UWl4SlFVRnlRaXhGUVVFeVFqdEJRVUZCT3p0QlFVTjZRaXhYUVVGTExFOUJRVXdzUjBGQlpTeFBRVUZtTzBGQlEwRXNWMEZCU3l4SlFVRk1MRWRCUVZrc1NVRkJXanM3UVVGRlFTeFZRVUZKTEVOQlFVTXNTMEZCU3l4VFFVRk1MRU5CUVdVc1MwRkJTeXhQUVVGd1FpeERRVUZNTEVWQlFXMURPMEZCUTJwRE8wRkJRMFE3TzBGQlJVUTdRVUZEUVN4VlFVRkpMRXRCUVVzc1QwRkJUQ3hEUVVGaExFMUJRV0lzU1VGQmRVSXNTMEZCU3l4UFFVRk1MRU5CUVdFc1RVRkJZaXhIUVVGelFpeERRVUZxUkN4RlFVRnZSRHRCUVVOc1JDeGhRVUZMTEZGQlFVd3NRMEZCWXl4TFFVRkxMRTlCUVc1Q08wRkJRMFFzVDBGR1JDeE5RVVZQTzBGQlEwdzdRVUZEUVN4aFFVRkxMRTlCUVV3c1EwRkJZU3hMUVVGTExFOUJRV3hDTzBGQlEwUTdRVUZEUmpzN1FVRkZSRHM3UVVGc1EydENPMEZCUVVFN096dEJRWGREYkVJN096czdPMEZCZUVOclFpeG5RMEUyUTFJc1QwRTNRMUVzUlVFMlEwTTdRVUZEYWtJc1dVRkJTU3haUVVGWkxFbEJRV2hDTEVWQlFYTkNPMEZCUTNCQ0xHbENRVUZQTEV0QlFWQTdRVUZEUkR0QlFVTkVMR1ZCUVZFc1VVRkJUeXhKUVVGUUxIbERRVUZQTEVsQlFWQXNUMEZCWjBJc1VVRkJhRUlzUjBGQk1rSXNiVUpCUVcxQ0xFbEJRVGxETEVkQlFYRkVMRmRCUVZjc1VVRkJUeXhQUVVGUUxIbERRVUZQTEU5QlFWQXNUMEZCYlVJc1VVRkJPVUlzU1VGQk1FTXNUMEZCVHl4UlFVRlJMRkZCUVdZc1MwRkJORUlzVVVGQmRFVXNTVUZCYTBZc1QwRkJUeXhSUVVGUkxGRkJRV1lzUzBGQk5FSXNVVUZCTTBzN1FVRkRSRHM3UVVGRlJEczdPenM3TzBGQmNFUnJRanRCUVVGQk8wRkJRVUVzT0VKQmVVUldMRTlCZWtSVkxFVkJlVVJFTEVsQmVrUkRMRVZCZVVSTE8wRkJRM0pDTEZsQlFVa3NSVUZCUlN4cFFrRkJhVUlzVDBGQmJrSXNRMEZCU2l4RlFVRnBRenRCUVVNdlFpeHJRa0ZCVVN4VFFVRlNMRWRCUVc5Q0xFbEJRWEJDTzBGQlEwUXNVMEZHUkN4TlFVVlBPMEZCUTB3c2EwSkJRVkVzVjBGQlVpeEhRVUZ6UWl4SlFVRjBRanRCUVVORU8wRkJRMFk3TzBGQlJVUTdPenM3T3p0QlFXcEZhMEk3UVVGQlFUdEJRVUZCTERoQ1FYTkZWaXhQUVhSRlZTeEZRWE5GUkN4SlFYUkZReXhGUVhORlN6dEJRVU55UWl4blFrRkJVU3hUUVVGU0xFZEJRVzlDTEVsQlFYQkNPMEZCUTBRN08wRkJSVVE3T3pzN096czdRVUV4Uld0Q08wRkJRVUU3UVVGQlFTeHRRMEZuUmt3c1QwRm9Sa3NzUlVGblJra3NTVUZvUmtvc1JVRm5SbFVzU1VGb1JsWXNSVUZuUm1kQ08wRkJRMmhETEdkQ1FVRlJMRmxCUVZJc1EwRkJjVUlzU1VGQmNrSXNSVUZCTWtJc1NVRkJNMEk3UVVGRFJEdEJRV3hHYVVJN1FVRkJRVHRCUVVGQkxEaENRVzlHVml4UFFYQkdWU3hGUVc5R1JEdEJRVU5tTEZsQlFVa3NUMEZCVHl4UlFVRlJMRmxCUVZJc1EwRkJjVUlzVjBGQmNrSXNRMEZCV0R0QlFVTkJMRmxCUVVrc1EwRkJReXhKUVVGTUxFVkJRVmM3UVVGRFZEdEJRVU5FT3p0QlFVVkVMR1ZCUVU4c1MwRkJTeXhKUVVGTUxFVkJRVkE3TzBGQlJVRXNXVUZCVFN4SlFVRkpMR2xFUVVGV08wRkJRMEVzV1VGQlNTeFZRVUZLT3p0QlFVVkJMR1ZCUVU4c1NVRkJTU3hGUVVGRkxFbEJRVVlzUTBGQlR5eEpRVUZRTEVOQlFWZ3NSVUZCZVVJN1FVRkRka0lzWTBGQlRTeE5RVUZOTEVWQlFVVXNRMEZCUml4RlFVRkxMRWxCUVV3c1JVRkJXanRCUVVOQkxHTkJRVTBzVVVGQlVTeEZRVUZGTEVOQlFVWXNSVUZCU3l4SlFVRk1MRWRCUVZrc1QwRkJXaXhEUVVGdlFpeEhRVUZ3UWl4RlFVRjVRaXhGUVVGNlFpeERRVUZrTzBGQlEwRXNZMEZCU1N4WlFVRlpMRXRCUVVzc1NVRkJUQ3hEUVVGVkxFdEJRVllzUTBGQmFFSTdPMEZCUlVFc1kwRkJTU3hEUVVGRExFdEJRVXNzU1VGQlRDeERRVUZWTEV0QlFWWXNRMEZCVEN4RlFVRjFRanRCUVVOeVFpeHZRa0ZCVVN4SFFVRlNMRU5CUVdVc1NVRkJaaXh0UWtGQmFVTXNTMEZCYWtNN1FVRkRRU3gzUWtGQldTeExRVUZhTzBGQlEwUTdPMEZCUlVRc1kwRkJUU3hoUVVGaExGRkJRVkVzU1VGQlNTeE5RVUZLTEVOQlFWY3NRMEZCV0N4RlFVRmpMRmRCUVdRc1JVRkJVaXhIUVVGelF5eEpRVUZKTEV0QlFVb3NRMEZCVlN4RFFVRldMRU5CUVhwRU96dEJRVVZCTEdOQlFVa3NTMEZCU3l4VlFVRk1MRU5CUVVvc1JVRkJjMEk3UVVGRGNFSXNhVUpCUVVzc1ZVRkJUQ3hGUVVGcFFpeFBRVUZxUWl4RlFVRXdRaXhUUVVFeFFqdEJRVU5FTEZkQlJrUXNUVUZGVHp0QlFVTk1MR2xDUVVGTExGbEJRVXdzUTBGQmEwSXNUMEZCYkVJc1JVRkJNa0lzUjBGQk0wSXNSVUZCWjBNc1UwRkJhRU03UVVGRFJEdEJRVU5HTzBGQlEwWTdPMEZCUlVRN096czdRVUZ1U0d0Q08wRkJRVUU3UVVGQlFTd3JRa0Z6U0ZRc1QwRjBTRk1zUlVGelNFRTdRVUZCUVRzN1FVRkRhRUlzWjBKQlFWRXNUMEZCVWl4RFFVRm5RanRCUVVGQkxHbENRVUZOTEUxQlFVc3NUMEZCVEN4RFFVRmhMRVZCUVdJc1EwRkJUanRCUVVGQkxGTkJRV2hDTzBGQlEwUTdRVUY0U0dsQ08wRkJRVUU3UVVGQlFTd3dRa0Z2UTBjN1FVRkRia0lzWlVGQlZTeEpRVUZXTEZOQlFXdENMRTlCUVd4Q08wRkJRMFE3UVVGMFEybENPenRCUVVGQk8wRkJRVUU3TzBGQk1raHdRaXhUUVVGUExFMUJRVkE3UVVGRFJDeERRVFZJWXl4RlFVRm1PenRyUWtFNFNHVXNUVHM3T3pzN096czdPenM3Y1dwQ1EzQkpaanM3T3pzN096dEJRVXRCT3pzN096czdPenRCUVVWQkxFbEJRVTBzVDBGQlVTeFpRVUZOTzBGQlEyeENPenM3T3pzN1FVRk5RU3hOUVVGTkxFOUJRVThzVFVGQllqdEJRVU5CTEUxQlFVMHNWVUZCVlN4UFFVRm9RanRCUVVOQkxFMUJRVTBzY1VKQlFYRkNPMEZCUTNwQ0xHOUNRVUZuUWl4SlFVUlRPMEZCUlhwQ0xGbEJRVkVzU1VGR2FVSTdRVUZIZWtJc1kwRkJWU3hKUVVobE8wRkJTWHBDTEZWQlFVMDdPMEZCUjFJN096czdPenRCUVZBeVFpeEhRVUV6UWp0QlFWUnJRaXhOUVhOQ1dpeEpRWFJDV1R0QlFYVkNhRUk3T3pzN1FVRkpRU3h2UWtGQk1FSTdRVUZCUVN4VlFVRmtMRTlCUVdNc2RVVkJRVW9zUlVGQlNUczdRVUZCUVRzN1FVRkRlRUlzVjBGQlN5eFBRVUZNTEVkQlFXVXNUMEZCVHl4TlFVRlFMRU5CUVdNc2EwSkJRV1FzUlVGQmEwTXNUMEZCYkVNc1EwRkJaanM3UVVGRlFTeFZRVUZKTEU5QlFVOHNTMEZCU3l4UFFVRk1MRU5CUVdFc1kwRkJjRUlzUzBGQmRVTXNVVUZCTTBNc1JVRkJjVVE3UVVGRGJrUXNZMEZCVFN4SlFVRkpMRXRCUVVvc1EwRkJZU3hKUVVGaUxEaEVRVUZPTzBGQlEwUTdPMEZCUlVRc1ZVRkJTU3hMUVVGTExFOUJRVXdzUTBGQllTeEpRVUZpTEV0QlFYTkNMRWxCUVRGQ0xFVkJRV2RETzBGQlF6bENMR05CUVUwc1NVRkJTU3hMUVVGS0xFTkJRV0VzU1VGQllpeHhRMEZCVGp0QlFVTkVPenRCUVVWRUxGVkJRVWtzVVVGQlR5eExRVUZMTEU5QlFVd3NRMEZCWVN4SlFVRmlMRU5CUVd0Q0xFdEJRVXNzVDBGQlRDeERRVUZoTEdOQlFTOUNMRU5CUVZBc1RVRkJNRVFzVVVGQk9VUXNSVUZCZDBVN1FVRkRkRVVzWTBGQlRTeEpRVUZKTEV0QlFVb3NRMEZCWVN4SlFVRmlMRzFGUVVGT08wRkJRMFE3TzBGQlJVUXNWMEZCU3l4VFFVRk1MRU5CUVdVc1MwRkJTeXhQUVVGTUxFTkJRV0VzVFVGQk5VSXNSVUZCYjBNc1MwRkJTeXhQUVVGTUxFTkJRV0VzVVVGQmFrUTdRVUZEUkRzN1FVRXpRMlU3UVVGQlFUdEJRVUZCTEd0RFFXbEVTanRCUVVOV0xHVkJRVThzUzBGQlN5eFBRVUZNTEVOQlFXRXNUVUZCY0VJN1FVRkRSRHRCUVc1RVpUdEJRVUZCTzBGQlFVRXNNRU5CY1VSSk8wRkJRMnhDTEdWQlFVOHNTMEZCU3l4UFFVRk1MRU5CUVdFc1kwRkJjRUk3UVVGRFJEczdRVUZGUkRzN096czdPMEZCZWtSblFqdEJRVUZCTzBGQlFVRXNaME5CT0VST0xFMUJPVVJOTEVWQk9FUnhRanRCUVVGQkxGbEJRVzVDTEZWQlFXMUNMSFZGUVVGT0xFbEJRVTA3TzBGQlEyNURMRmxCUVVrc1VVRkJUeXhMUVVGTExFOUJRVXdzUTBGQllTeEpRVUZpTEVOQlFXdENMRTFCUVd4Q0xFTkJRVkFzVFVGQmNVTXNVVUZCZWtNc1JVRkJiVVE3UVVGRGFrUXNhMEpCUVZFc1MwRkJVaXhEUVVGcFFpeEpRVUZxUWl4VlFVRXdRaXhOUVVFeFFpeHJRMEZCTmtRc1MwRkJTeXhQUVVGTUxFTkJRV0VzWTBGQk1VVTdRVUZEUkN4VFFVWkVMRTFCUlU4N1FVRkRUQ3hsUVVGTExFOUJRVXdzUTBGQllTeE5RVUZpTEVkQlFYTkNMRTFCUVhSQ08wRkJRMFE3TzBGQlJVUXNXVUZCU1N4VlFVRktMRVZCUVdkQ08wRkJRMlFzWlVGQlN5eFZRVUZNTzBGQlEwUTdRVUZEUmp0QlFYaEZaVHRCUVVGQk8wRkJRVUVzY1VOQk1FVkVPMEZCUTJJc1pVRkJUeXhQUVVGUExFbEJRVkFzUTBGQldTeExRVUZMTEU5QlFVd3NRMEZCWVN4SlFVRjZRaXhEUVVGUU8wRkJRMFE3UVVFMVJXVTdRVUZCUVR0QlFVRkJMSEZEUVRoRmEwTTdRVUZCUVN4WlFVRnlReXhMUVVGeFF5eDFSVUZCTjBJc1NVRkJOa0k3UVVGQlFTeFpRVUYyUWl4blFrRkJkVUlzZFVWQlFVb3NSVUZCU1RzN1FVRkRhRVFzV1VGQlNTeFBRVUZQTEV0QlFWQXNTMEZCYVVJc1VVRkJja0lzUlVGQkswSTdRVUZETjBJc2FVSkJRVThzVTBGQlVEdEJRVU5FT3p0QlFVVkVMRmxCUVUwc1VVRkJVU3hOUVVGTkxFdEJRVTRzUTBGQldTeHRRa0ZCV2l4RFFVRmtPMEZCUTBFc1dVRkJTU3hMUVVGS0xFVkJRVmM3UVVGRFZDeHJRa0ZCVVN4TlFVRk5MRTlCUVU0c1EwRkJZeXhOUVVGTkxFTkJRVTRzUTBGQlpDeEZRVUYzUWl4cFFrRkJhVUlzVFVGQlRTeERRVUZPTEVOQlFXcENMRU5CUVhoQ0xFTkJRVkk3UVVGRFJEczdRVUZGUkN4WlFVRkpMRTFCUVUwc1MwRkJUaXhEUVVGWkxHMUNRVUZhTEVOQlFVb3NSVUZCYzBNN1FVRkRjRU1zYVVKQlFVOHNTMEZCU3l4WlFVRk1MRU5CUVd0Q0xFdEJRV3hDTEVWQlFYbENMR2RDUVVGNlFpeERRVUZRTzBGQlEwUTdPMEZCUlVRc1pVRkJUeXhMUVVGUU8wRkJRMFE3UVVFM1JtVTdRVUZCUVR0QlFVRkJMR3REUVN0R2RVSTdRVUZCUVRzN1FVRkJRU3haUVVFM1FpeFBRVUUyUWl4MVJVRkJia0lzU1VGQmJVSTdRVUZCUVN4WlFVRmlMRTFCUVdFc2RVVkJRVW9zUlVGQlNUczdRVUZEY2tNc1dVRkJTU3hQUVVGUExFdEJRVXNzVDBGQlRDeERRVUZoTEVsQlFXSXNRMEZCYTBJc1MwRkJTeXhQUVVGTUxFTkJRV0VzVFVGQkwwSXNRMEZCV0R0QlFVTkJMRmxCUVVrc1EwRkJReXhKUVVGTUxFVkJRVmM3UVVGRFZDeHBRa0ZCVHl4TFFVRkxMRTlCUVV3c1EwRkJZU3hKUVVGaUxFTkJRV3RDTEV0QlFVc3NUMEZCVEN4RFFVRmhMR05CUVM5Q0xFTkJRVkE3UVVGRFJEczdRVUZGUkN4WlFVRkpMRmxCUVZrc1NVRkJXaXhKUVVGdlFpeFpRVUZaTEVkQlFXaERMRWxCUVhWRExFMUJRVTBzVDBGQlRpeERRVUZqTEU5QlFXUXNRMEZCTTBNc1JVRkJiVVU3UVVGRGFrVXNZMEZCU1N4TlFVRk5MRTlCUVU0c1EwRkJZeXhQUVVGa0xFTkJRVW9zUlVGQk5FSTdRVUZETVVJc1owSkJRVTBzVDBGQlR5eFBRVUZQTEVsQlFWQXNRMEZCV1N4SlFVRmFMRVZCUVd0Q0xFMUJRV3hDTEVOQlFYbENPMEZCUVVFc2NVSkJRVThzVVVGQlVTeFBRVUZTTEVOQlFXZENMRWRCUVdoQ0xFbEJRWFZDTEVOQlFVTXNRMEZCTDBJN1FVRkJRU3hoUVVGNlFpeERRVUZpTzBGQlEwRXNaMEpCUVUwc1pVRkJaU3hGUVVGeVFqdEJRVU5CTEdsQ1FVRkxMRTlCUVV3c1EwRkJZU3hsUVVGUE8wRkJRMnhDTERKQ1FVRmhMRWRCUVdJc1NVRkJiMElzVFVGQlN5eFpRVUZNTEVOQlFXdENMRXRCUVVzc1IwRkJUQ3hEUVVGc1FpeEZRVUUyUWl4TlFVRTNRaXhEUVVGd1FqdEJRVU5FTEdGQlJrUTdRVUZIUVN4dFFrRkJUeXhaUVVGUU8wRkJRMFE3TzBGQlJVUXNZMEZCVFN4VlFVRlZMRVZCUVdoQ08wRkJRMEVzWlVGQlN5eEpRVUZOTEVkQlFWZ3NTVUZCYTBJc1NVRkJiRUlzUlVGQmQwSTdRVUZEZEVJc2IwSkJRVkVzUjBGQlVpeEpRVUZsTEV0QlFVc3NXVUZCVEN4RFFVRnJRaXhMUVVGTExFZEJRVXdzUTBGQmJFSXNSVUZCTmtJc1RVRkJOMElzUTBGQlpqdEJRVU5FT3p0QlFVVkVMR2xDUVVGUExFOUJRVkE3UVVGRFJEczdRVUZGUkN4bFFVRlBMRXRCUVVzc1dVRkJUQ3hEUVVGclFpeExRVUZMTEU5QlFVd3NRMEZCYkVJc1JVRkJhVU1zVFVGQmFrTXNRMEZCVUR0QlFVTkVPenRCUVVWRU96dEJRVEZJWjBJN1FVRkJRVHRCUVVGQkxEQkNRVEpJWlR0QlFVRkJMRmxCUVRkQ0xFOUJRVFpDTEhWRlFVRnVRaXhKUVVGdFFqdEJRVUZCTEZsQlFXSXNUVUZCWVN4MVJVRkJTaXhGUVVGSk96dEJRVU0zUWl4bFFVRlBMRXRCUVVzc1UwRkJUQ3hEUVVGbExFOUJRV1lzUlVGQmQwSXNUVUZCZUVJc1EwRkJVRHRCUVVORU96dEJRVVZFT3pzN096dEJRUzlJWjBJN1FVRkJRVHRCUVVGQkxHbERRVzFKVEN4UFFXNUpTeXhGUVcxSlNUdEJRVU5zUWl4WlFVRkpMRTlCUVU4c1QwRkJVQ3hMUVVGdFFpeFhRVUYyUWl4RlFVRnZRenRCUVVOc1F5eHZRa0ZCVlN4VFFVRlRMR2RDUVVGVUxFTkJRVEJDTEdGQlFURkNMRU5CUVZZN1FVRkRSRHM3UVVGRlJDeFpRVUZKTEU5QlFVOHNUMEZCVUN4TFFVRnRRaXhSUVVGMlFpeEZRVUZwUXp0QlFVTXZRaXh2UWtGQlZTeFRRVUZUTEdGQlFWUXNRMEZCZFVJc1QwRkJka0lzUTBGQlZqdEJRVU5FT3p0QlFVVkVMRFpDUVVGWExFOUJRVmdzUlVGQmIwSXNTMEZCU3l4RFFVRk1MRVZCUVhCQ08wRkJRMFE3TzBGQlJVUTdPMEZCTDBsblFqdEJRVUZCTzBGQlFVRXNiME5CWjBwTExFOUJhRXBNTEVWQlowcGpPMEZCUXpWQ0xHVkJRVThzU1VGQlNTeEpRVUZLTEVOQlFWTXNUMEZCVkN4RFFVRlFPMEZCUTBRN1FVRnNTbVU3UVVGQlFUdEJRVUZCTERCQ1FUWkRTenRCUVVOdVFpeGxRVUZWTEVsQlFWWXNVMEZCYTBJc1QwRkJiRUk3UVVGRFJEdEJRUzlEWlRzN1FVRkJRVHRCUVVGQk96dEJRWEZLYkVJc1UwRkJUeXhKUVVGUU8wRkJRMFFzUTBGMFNsa3NSVUZCWWpzN2EwSkJkMHBsTEVrN096czdPenM3T3pzN096czdRVU42U21ZN096czdRVUZEUVRzN096dEJRVU5CT3pzN096czdPenNyWlVGU1FUczdPenM3TzBGQlZVRXNTVUZCVFN4VlFVRlhMRmxCUVUwN1FVRkRja0k3T3pzN096dEJRVTFCTEUxQlFVMHNUMEZCVHl4VFFVRmlPMEZCUTBFc1RVRkJUU3hWUVVGVkxFOUJRV2hDTzBGQlEwRXNUVUZCVFN4eFFrRkJjVUlzUlVGQk0wSTdPMEZCUlVFc1UwRkJUeXhuUWtGQlVDeERRVUYzUWl4UlFVRjRRaXhGUVVGclF5eFpRVUZOTzBGQlEzUkRMSFZEUVVGdlFpeHBRa0ZCVFN4alFVRXhRaXhGUVVFd1F5eEpRVUV4UXl4RlFVRm5SQ3hGUVVGRkxFMUJRVTBzU1VGQlNTeEpRVUZLTEVWQlFWSXNSVUZCYUVRN1FVRkRSQ3hIUVVaRU96dEJRVWxCTEZOQlFVOHNaMEpCUVZBc1EwRkJkMElzVTBGQmVFSXNSVUZCYlVNc1dVRkJUVHRCUVVOMlF5eDFRMEZCYjBJc2FVSkJRVTBzWlVGQk1VSXNSVUZCTWtNc1NVRkJNME1zUlVGQmFVUXNSVUZCUlN4TlFVRk5MRWxCUVVrc1NVRkJTaXhGUVVGU0xFVkJRV3BFTzBGQlEwUXNSMEZHUkRzN1FVRkpRVHM3T3pzN08wRkJia0p4UWl4TlFYbENaaXhQUVhwQ1pUdEJRVUZCT3p0QlFUQkNia0k3T3pzN1FVRkpRU3gxUWtGQk1FSTdRVUZCUVN4VlFVRmtMRTlCUVdNc2RVVkJRVW9zUlVGQlNUczdRVUZCUVRzN1FVRkJRU3h2U0VGRGJFSXNTVUZFYTBJc1JVRkRXaXhQUVVSWkxFVkJRMGdzYTBKQlJFY3NSVUZEYVVJc1QwRkVha0lzUlVGRE1FSXNTVUZFTVVJN08wRkJSWGhDTEZsQlFVc3NVMEZCVER0QlFVWjNRanRCUVVkNlFqczdRVUZxUTJ0Q08wRkJRVUU3UVVGQlFTeHJRMEZ0UTFBN1FVRkJRVHM3UVVGRFZpeGxRVUZQTEdkQ1FVRlFMRU5CUVhkQ0xHMUNRVUY0UWl4RlFVRTJReXhaUVVGTk8wRkJRMnBFTEdsQ1FVRkxMRmxCUVV3c1EwRkJhMElzYVVKQlFVMHNZMEZCZUVJc1JVRkJkME1zUlVGQlJTeE5RVUZOTEVsQlFVa3NTVUZCU2l4RlFVRlNMRVZCUVhoRExFVkJRVGhFTEVsQlFUbEVPMEZCUTBRc1UwRkdSRHM3UVVGSlFTeGxRVUZQTEdkQ1FVRlFMRU5CUVhkQ0xHOUNRVUY0UWl4RlFVRTRReXhaUVVGTk8wRkJRMnhFTEdsQ1FVRkxMRmxCUVV3c1EwRkJhMElzYVVKQlFVMHNaVUZCZUVJc1JVRkJlVU1zUlVGQlJTeE5RVUZOTEVsQlFVa3NTVUZCU2l4RlFVRlNMRVZCUVhwRExFVkJRU3RFTEVsQlFTOUVPMEZCUTBRc1UwRkdSRHRCUVVkRU8wRkJNME5yUWp0QlFVRkJPMEZCUVVFc2IwTkJOa05GTEU5Qk4wTkdMRVZCTmtOWE8wRkJRelZDTERKSFFVRXlRaXhQUVVFelFpeEZRVUZ2UXl4UFFVRndRenRCUVVORU8wRkJMME5yUWpzN1FVRkJRVHRCUVVGQk96dEJRV3RFY2tJc1UwRkJUeXhQUVVGUU8wRkJRMFFzUTBGdVJHVXNSVUZCYUVJN08ydENRWEZFWlN4UE96czdPenM3T3pzN2NXcENReTlFWmpzN096czdPMEZCVFVFN096czdRVUZEUVRzN096czdPenM3UVVGRlFTeEpRVUZOTEZGQlFWTXNXVUZCVFR0QlFVTnVRanM3T3pzN08wRkJUVUVzVFVGQlRTeFBRVUZQTEU5QlFXSTdRVUZEUVN4TlFVRk5MRlZCUVZVc1QwRkJhRUk3UVVGRFFTeE5RVUZOTEhGQ1FVRnhRanRCUVVONlFpeG5Ra0ZCV1N4SlFVUmhPMEZCUlhwQ0xHRkJRVk1zU1VGR1owSTdRVUZIZWtJc2FVSkJRV0VzU1VGSVdUdEJRVWw2UWl4clFrRkJZenRCUVVwWExFZEJRVE5DT3p0QlFVOUJMRTFCUVVrc2IwSkJRVW83UVVGRFFUczdPenM3TzBGQmFrSnRRaXhOUVhWQ1lpeExRWFpDWVR0QlFYZENha0k3T3pzN08wRkJTMEVzY1VKQlFUQkNPMEZCUVVFc1ZVRkJaQ3hQUVVGakxIVkZRVUZLTEVWQlFVazdPMEZCUVVFN08wRkJRM2hDTEZkQlFVc3NUMEZCVEN4SFFVRmxMRTlCUVU4c1RVRkJVQ3hEUVVGakxHdENRVUZrTEVWQlFXdERMRTlCUVd4RExFTkJRV1k3TzBGQlJVRXNWMEZCU3l4TFFVRk1MRWRCUVdFc1JVRkJZanRCUVVOQkxGZEJRVXNzVDBGQlRDeEhRVUZsTEV0QlFXWTdPMEZCUlVFN1FVRkRRU3hYUVVGTExHTkJRVXc3TzBGQlJVRTdRVUZEUVN4WFFVRkxMRmRCUVV3N1FVRkRSRHM3UVVGRlJEczdPMEZCTVVOcFFqdEJRVUZCTzBGQlFVRXNkMEpCTWtObUxGRkJNME5sTEVWQk1rTk1PMEZCUTFZc1pVRkJUeXhUUVVGVExHRkJRVlFzUTBGQmRVSXNVVUZCZGtJc1EwRkJVRHRCUVVORU8wRkJOME5uUWp0QlFVRkJPMEZCUVVFc1owTkJLME5RTzBGQlExSXNaVUZCVHl4UFFVRlBMRkZCUVZBc1EwRkJaMElzU1VGQmFFSXNRMEZCY1VJc1MwRkJja0lzUTBGQk1rSXNTMEZCU3l4UFFVRk1MRU5CUVdFc1ZVRkJlRU1zUlVGQmIwUXNRMEZCY0VRc1EwRkJVRHRCUVVORU8wRkJha1JuUWp0QlFVRkJPMEZCUVVFc2QwTkJiVVJETzBGQlEyaENMRmxCUVUwc1QwRkJUeXhMUVVGTExFOUJRVXdzUlVGQllqdEJRVU5CTEZsQlFVMHNTMEZCU3l4SlFVRkpMRTFCUVVvc1EwRkJWeXhsUVVGWUxFTkJRVmc3UVVGRFFTeFpRVUZOTEZWQlFWVXNSMEZCUnl4SlFVRklMRU5CUVZFc1NVRkJVaXhEUVVGb1FqczdRVUZGUVN4WlFVRkpMRmRCUVZjc1VVRkJVU3hEUVVGU0xFTkJRV1lzUlVGQk1rSTdRVUZEZWtJc2FVSkJRVThzVVVGQlVTeERRVUZTTEVOQlFWQTdRVUZEUkRzN1FVRkZSQ3hsUVVGUExFbEJRVkE3UVVGRFJEdEJRVGRFWjBJN1FVRkJRVHRCUVVGQkxEaENRU3RFVkN4UlFTOUVVeXhGUVN0RVF6dEJRVU5vUWl4bFFVRlBMRkZCUVZBc1EwRkJaMElzU1VGQmFFSXNSMEZCTUVJc1MwRkJTeXhQUVVGTUxFTkJRV0VzVlVGQmRrTXNVMEZCY1VRc1VVRkJja1E3UVVGRFJEdEJRV3BGWjBJN1FVRkJRVHRCUVVGQkxHdERRVzFGVEN4VFFXNUZTeXhGUVcxRlRTeFRRVzVGVGl4RlFXMUZhVUk3UVVGRGFFTXNXVUZCVFN4UlFVRlJMRXRCUVVzc1dVRkJUQ3hEUVVGclFpeFRRVUZzUWl4RFFVRmtPMEZCUTBFc1dVRkJUU3hSUVVGUkxFdEJRVXNzV1VGQlRDeERRVUZyUWl4VFFVRnNRaXhEUVVGa08wRkJRMEVzWlVGQlR5eFRRVUZUTEV0QlFWUXNTVUZCYTBJc1RVRkJUU3hKUVVGT0xFdEJRV1VzVFVGQlRTeEpRVUU1UXp0QlFVTkVPenRCUVVWRU96czdPenRCUVhwRmFVSTdRVUZCUVR0QlFVRkJMSFZEUVRaRlFUdEJRVUZCT3p0QlFVTm1MR2xDUVVGVExHZENRVUZVTEVOQlFUQkNMRTlCUVRGQ0xFVkJRVzFETzBGQlFVRXNhVUpCUVZNc1RVRkJTeXhQUVVGTUxFTkJRV0VzUzBGQllpeERRVUZVTzBGQlFVRXNVMEZCYmtNN1FVRkRRU3hsUVVGUExHZENRVUZRTEVOQlFYZENMRlZCUVhoQ0xFVkJRVzlETzBGQlFVRXNhVUpCUVZNc1RVRkJTeXhoUVVGTUxFTkJRVzFDTEV0QlFXNUNMRU5CUVZRN1FVRkJRU3hUUVVGd1F6dEJRVU5CTEdWQlFVOHNaMEpCUVZBc1EwRkJkMElzV1VGQmVFSXNSVUZCYzBNN1FVRkJRU3hwUWtGQlV5eE5RVUZMTEZsQlFVd3NRMEZCYTBJc1MwRkJiRUlzUTBGQlZEdEJRVUZCTEZOQlFYUkRPMEZCUTBFc2FVSkJRVk1zWjBKQlFWUXNRMEZCTUVJc2EwSkJRVEZDTEVWQlFUaERPMEZCUVVFc2FVSkJRVk1zVFVGQlN5eFhRVUZNTEVOQlFXbENMRXRCUVdwQ0xFTkJRVlE3UVVGQlFTeFRRVUU1UXp0QlFVTkVPenRCUVVWRU96dEJRWEJHYVVJN1FVRkJRVHM3TzBGQk1FWnFRanM3UVVFeFJtbENMQ3RDUVRSR1VpeFJRVFZHVVN4RlFUUkdjVU03UVVGQlFUczdRVUZCUVN4WlFVRnVReXhaUVVGdFF5eDFSVUZCY0VJc1NVRkJiMEk3UVVGQlFTeFpRVUZrTEVsQlFXTXNkVVZCUVZBc1MwRkJUenM3UVVGRGNFUXNXVUZCVFN4VlFVRlZMRXRCUVVzc1EwRkJUQ3hEUVVGUExGVkJRVkFzUTBGQmFFSTdRVUZEUVN4WlFVRkpMRTlCUVVvc1JVRkJZVHRCUVVOWUxHTkJRVTBzWTBGQll5eFJRVUZSTEZsQlFWSXNRMEZCY1VJc1YwRkJja0lzUTBGQmNFSTdPMEZCUlVFc1kwRkJTU3hMUVVGTExGZEJRVXdzUTBGQmFVSXNVVUZCYWtJc1JVRkJNa0lzVjBGQk0wSXNRMEZCU2l4RlFVRTJRenRCUVVNelF6dEJRVU5FT3p0QlFVVkVMR3RDUVVGUkxGTkJRVklzUTBGQmEwSXNUVUZCYkVJc1EwRkJlVUlzVTBGQmVrSTdPMEZCUlVFN1FVRkRRU3hwUWtGQlR5eFBRVUZRTEVOQlFXVXNXVUZCWml4RFFVRTBRaXhGUVVGRkxFMUJRVTBzVjBGQlVpeEZRVUUxUWl4RlFVRnRSQ3hYUVVGdVJDeEZRVUZuUlN4UFFVRlBMRkZCUVZBc1EwRkJaMElzU1VGQmFFWTdPMEZCUlVFc1pVRkJTeXhuUWtGQlRDeERRVUZ6UWl4WFFVRjBRaXhGUVVGdFF5eHBRa0ZCVFN4SlFVRjZRenRCUVVORU96dEJRVVZFTEdGQlFVc3NaMEpCUVV3c1EwRkJjMElzVVVGQmRFSXNSVUZCWjBNc2FVSkJRVTBzU1VGQmRFTTdPMEZCUlVFc2MwSkJRV01zVVVGQlpEczdRVUZGUVR0QlFVTkJMRmxCUVUwc1ZVRkJWU3hMUVVGTExFTkJRVXdzYTBKQlFYTkNMRkZCUVhSQ0xGRkJRV2hDT3p0QlFVVkJMR2RDUVVGUkxGTkJRVklzUTBGQmEwSXNSMEZCYkVJc1EwRkJjMElzVTBGQmRFSTdPMEZCUlVFN1FVRkRRU3haUVVGTkxGbEJRVmtzUzBGQlN5eFpRVUZNTEVOQlFXdENMRkZCUVd4Q0xFTkJRV3hDT3p0QlFVVkJPMEZCUTBFc1dVRkJTU3hoUVVGaExGVkJRVlVzVjBGQlZpeEZRVUZxUWl4RlFVRXdRenRCUVVONFF5eHZRa0ZCVlN4WlFVRldPMEZCUTBRN1FVRkRSRHM3UVVGRlFTeFpRVUZKTEU5QlFVb3NSVUZCWVR0QlFVTllMR05CUVUwc1pVRkJZeXhSUVVGUkxGbEJRVklzUTBGQmNVSXNWMEZCY2tJc1EwRkJjRUk3UVVGRFFUdEJRVU5CTEd0Q1FVRlJMRWxCUVZJc1IwRkJaU3hKUVVGbU8wRkJRMEVzYTBKQlFWRXNaMEpCUVZJc1IwRkJNa0lzV1VGQk0wSTdPMEZCUlVFc1kwRkJUU3h4UWtGQmNVSXNVMEZCY2tJc2EwSkJRWEZDTEVkQlFVMDdRVUZETDBJc1owSkJRVWtzVVVGQlVTeFRRVUZTTEVOQlFXdENMRkZCUVd4Q0xFTkJRVEpDTEZOQlFUTkNMRU5CUVVvc1JVRkJNa003UVVGRGVrTXNjMEpCUVZFc1UwRkJVaXhEUVVGclFpeE5RVUZzUWl4RFFVRjVRaXhUUVVGNlFqdEJRVU5FT3p0QlFVVkVMRzlDUVVGUkxGTkJRVklzUTBGQmEwSXNUVUZCYkVJc1EwRkJlVUlzVVVGQlVTeEpRVUZTTEVkQlFXVXNWVUZCWml4SFFVRTBRaXhYUVVGeVJEczdRVUZGUVN4dFFrRkJTeXhuUWtGQlRDeERRVUZ6UWl4WFFVRjBRaXhGUVVGdFF5eHBRa0ZCVFN4TFFVRjZRenRCUVVOQkxHMUNRVUZMTEdkQ1FVRk1MRU5CUVhOQ0xGRkJRVkVzWjBKQlFUbENMRVZCUVdkRUxHbENRVUZOTEUxQlFYUkVPenRCUVVWQkxHOUNRVUZSTEcxQ1FVRlNMRU5CUVRSQ0xHbENRVUZOTEdGQlFXeERMRVZCUVdsRUxHdENRVUZxUkR0QlFVTkVMRmRCV0VRN08wRkJZVUVzWTBGQlNTeExRVUZMTEU5QlFVd3NRMEZCWVN4WlFVRnFRaXhGUVVFclFqdEJRVU0zUWl4dlFrRkJVU3huUWtGQlVpeERRVUY1UWl4cFFrRkJUU3hoUVVFdlFpeEZRVUU0UXl4clFrRkJPVU03UVVGRFFTeHZRa0ZCVVN4VFFVRlNMRU5CUVd0Q0xFZEJRV3hDTEVOQlFYTkNMRk5CUVhSQ08wRkJRMFFzVjBGSVJDeE5RVWRQTzBGQlEwdzdRVUZEUkRzN1FVRkZSQ3hyUWtGQlVTeFRRVUZTTEVOQlFXdENMRWRCUVd4Q0xFTkJRWE5DTEU5QlFVOHNWVUZCVUN4SFFVRnZRaXhYUVVFeFF6dEJRVU5FTzBGQlEwWTdRVUV6U21kQ08wRkJRVUU3UVVGQlFTeDVRMEUyU2tVc1VVRTNTa1lzUlVFMlNsazdRVUZETTBJc1dVRkJTU3hEUVVGRExFdEJRVXNzV1VGQlRDeERRVUZyUWl4UlFVRnNRaXhEUVVGTUxFVkJRV3RETzBGQlEyaERMR1ZCUVVzc1MwRkJUQ3hEUVVGWExFbEJRVmdzUTBGQlowSXNiVUpCUVZNc1VVRkJWQ3hEUVVGb1FqdEJRVU5FTzBGQlEwWTdRVUZxUzJkQ08wRkJRVUU3UVVGQlFTeHRRMEZ0UzBvc1VVRnVTMGtzUlVGdFMwMDdRVUZEY2tJc1pVRkJUeXhMUVVGTExFdEJRVXdzUTBGQlZ5eEpRVUZZTEVOQlFXZENPMEZCUVVFc2FVSkJRVkVzUzBGQlN5eEpRVUZNTEV0QlFXTXNVVUZCZEVJN1FVRkJRU3hUUVVGb1FpeERRVUZRTzBGQlEwUTdRVUZ5UzJkQ08wRkJRVUU3UVVGQlFTeHZRMEYxUzBnc1UwRjJTMGNzUlVGMVMxRTdRVUZEZGtJc1pVRkJUeXhMUVVGTExFdEJRVXdzUTBGQlZ5eE5RVUZZTEVOQlFXdENPMEZCUVVFc2FVSkJRVkVzVlVGQlZTeFBRVUZXTEVOQlFXdENMRXRCUVVzc1NVRkJka0lzU1VGQkswSXNRMEZCUXl4RFFVRjRRenRCUVVGQkxGTkJRV3hDTEVOQlFWQTdRVUZEUkR0QlFYcExaMEk3UVVGQlFUdEJRVUZCTEhORFFUSkxSQ3hIUVROTFF5eEZRVEpMU1R0QlFVTnVRaXhsUVVGUExFbEJRVWtzUzBGQlNpeERRVUZWTEVkQlFWWXNSVUZCWlN4SFFVRm1MRU5CUVcxQ08wRkJRVUVzYVVKQlFWRXNTMEZCU3l4SlFVRk1MRVZCUVZJN1FVRkJRU3hUUVVGdVFpeERRVUZRTzBGQlEwUTdRVUUzUzJkQ08wRkJRVUU3UVVGQlFTeG5RMEVyUzFBc1VVRXZTMDhzUlVFclMwYzdRVUZEYkVJc1dVRkJTU3hMUVVGTExHbENRVUZNTEV0QlFUSkNMRWRCUVM5Q0xFVkJRVzlETzBGQlEyeERPMEZCUTBFc1pVRkJTeXhMUVVGTUxFTkJRVmNzVDBGQldDeERRVUZ0UWl4VlFVRkRMRWxCUVVRc1JVRkJWVHRCUVVNelFpeHBRa0ZCU3l4blFrRkJUQ3hEUVVGelFpeFJRVUYwUWp0QlFVTkVMRmRCUmtRN1FVRkhRVHRCUVVORU96dEJRVVZFTEZsQlFVMHNZVUZCWVN4TFFVRkxMR0ZCUVV3c1EwRkJiVUlzUzBGQlN5eGxRVUZNTEVOQlFYRkNMRXRCUVVzc2FVSkJRVEZDTEVOQlFXNUNMRVZCUVdsRkxFbEJRV3BGTEVOQlFXNUNPMEZCUTBFc2JVSkJRVmNzVDBGQldDeERRVUZ0UWl4VlFVRkRMRWxCUVVRc1JVRkJWVHRCUVVNelFpeGxRVUZMTEdkQ1FVRk1MRU5CUVhOQ0xGRkJRWFJDTzBGQlEwUXNVMEZHUkR0QlFVZEJMR0ZCUVVzc2FVSkJRVXdzUjBGQmVVSXNTVUZCZWtJN1FVRkRSRHRCUVRkTVowSTdRVUZCUVR0QlFVRkJMR3REUVN0TVRDeFpRUzlNU3l4RlFTdE1aME03UVVGQlFTeFpRVUYyUWl4alFVRjFRaXgxUlVGQlRpeEpRVUZOT3p0QlFVTXZReXhaUVVGTkxHRkJRV0VzUzBGQlN5eGhRVUZNTEVOQlFXMUNMRXRCUVVzc1pVRkJUQ3hEUVVGeFFpeExRVUZMTEdsQ1FVRXhRaXhEUVVGdVFpeEZRVUZwUlN4SlFVRnFSU3hEUVVGdVFqdEJRVU5CTEcxQ1FVRlhMRTlCUVZnc1EwRkJiVUlzVlVGQlF5eEpRVUZFTEVWQlFWVTdRVUZETTBJc1pVRkJTeXhYUVVGTUxFTkJRV2xDTEZsQlFXcENPMEZCUTBFc1kwRkJTU3hQUVVGUExHTkJRVkFzUzBGQk1FSXNWVUZCT1VJc1JVRkJNRU03UVVGRGVFTXNhVUpCUVVzc2JVSkJRVXdzUTBGQmVVSXNZMEZCZWtJN1FVRkRSRHRCUVVOR0xGTkJURVE3UVVGTlFTeGhRVUZMTEdsQ1FVRk1MRWRCUVhsQ0xFbEJRWHBDTzBGQlEwUTdRVUY0VFdkQ08wRkJRVUU3UVVGQlFTeDFRMEV3VFVFc1VVRXhUVUVzUlVFd1RWVXNVMEV4VFZZc1JVRXdUWGxETzBGQlFVRXNXVUZCY0VJc1YwRkJiMElzZFVWQlFVNHNTVUZCVFRzN1FVRkRlRVFzV1VGQlRTeFpRVUZaTEV0QlFVc3NXVUZCVEN4RFFVRnJRaXhSUVVGc1FpeERRVUZzUWp0QlFVTkJMRmxCUVVrc1UwRkJTaXhGUVVGbE8wRkJRMklzYjBKQlFWVXNZVUZCVml4RFFVRjNRaXhUUVVGNFFpeEZRVUZ0UXl4WFFVRnVRenRCUVVORU8wRkJRMFk3UVVFdlRXZENPMEZCUVVFN1FVRkJRU3c0UWtGcFRsUXNTMEZxVGxNc1JVRnBUa1k3UVVGRFlpeFpRVUZOTEZkQlFWY3NUVUZCVFN4TlFVRk9MRU5CUVdFc1dVRkJZaXhEUVVFd1FpeGxRVUV4UWl4RFFVRnFRanRCUVVOQkxGbEJRVTBzVjBGQlZ5eEZRVUZGTEUxQlFVMHNUVUZCVGl4RFFVRmhMRmxCUVdJc1EwRkJNRUlzWlVGQk1VSXNUVUZCSzBNc1RVRkJha1FzUTBGQmFrSTdPMEZCUlVFc1dVRkJTU3hSUVVGS0xFVkJRV003UVVGRFdpeGpRVUZKTEdGQlFXRXNUMEZCYWtJc1JVRkJNRUk3UVVGRGVFSTdRVUZEUVN4dFFrRkJUeXhQUVVGUUxFTkJRV1VzU1VGQlpqdEJRVU5CTzBGQlEwUTdPMEZCUlVRN096czdPMEZCUzBFc1kwRkJTU3hMUVVGTExFOUJRVXdzUTBGQllTeFBRVUZxUWl4RlFVRXdRanRCUVVONFFpeHBRa0ZCU3l4UFFVRk1MRU5CUVdFc1VVRkJZanRCUVVORUxGZEJSa1FzVFVGRlR6dEJRVU5NTEdsQ1FVRkxMRkZCUVV3c1EwRkJZeXhSUVVGa0xFVkJRWGRDTEVsQlFYaENMRVZCUVRoQ0xGRkJRVGxDTzBGQlEwUTdRVUZEUmp0QlFVTkdPMEZCZGs5blFqdEJRVUZCTzBGQlFVRXNjME5CZVU5VE8wRkJRVUVzV1VGQldpeExRVUZaTEhWRlFVRktMRVZCUVVrN08wRkJRM2hDTEZsQlFVMHNWMEZCVnl4TlFVRk5MRXRCUVU0c1IwRkJZeXhOUVVGTkxFdEJRVTRzUTBGQldTeEpRVUV4UWl4SFFVRnBReXhKUVVGc1JEdEJRVU5CTEZsQlFVa3NRMEZCUXl4UlFVRk1MRVZCUVdVN1FVRkRZanRCUVVORU96dEJRVVZFTEdGQlFVc3NVVUZCVEN4RFFVRmpMRkZCUVdRc1JVRkJkMElzU1VGQmVFSXNSVUZCT0VJc1NVRkJPVUk3UVVGRFJEdEJRV2hRWjBJN1FVRkJRVHRCUVVGQkxIRkRRV3RRUmp0QlFVTmlMRmxCUVUwc1UwRkJVeXhEUVVGRExFdEJRVXNzVDBGQlRDeExRVUZwUWl4TFFVRkxMRTlCUVV3c1IwRkJaU3hMUVVGbUxFTkJRWEZDTEVkQlFYSkNMRU5CUVdwQ0xFZEJRVFpETEVWQlFUbERMRVZCUVd0RUxFMUJRV3hFTEVOQlFYbEVPMEZCUVVFc2FVSkJRVXNzUlVGQlJTeE5RVUZHTEVkQlFWY3NRMEZCYUVJN1FVRkJRU3hUUVVGNlJDeERRVUZtTzBGQlEwRXNXVUZCU1N4UFFVRlBMRTFCUVZBc1IwRkJaMElzUTBGQmNFSXNSVUZCZFVJN1FVRkRja0k3UVVGRFFTeHBRa0ZCVHl4TFFVRlFPMEZCUTBRN08wRkJSVVFzWVVGQlN5eG5Ra0ZCVEN4RFFVRnpRaXhYUVVGMFFpeEZRVUZ0UXl4cFFrRkJUU3hKUVVGNlF5eEZRVUVyUXl4TlFVRXZRenM3UVVGRlFTeFpRVUZOTEZWQlFWVXNTMEZCU3l4bFFVRk1MRVZCUVdoQ08wRkJRMEVzV1VGQlNTeFBRVUZLTEVWQlFXRTdRVUZEV0N4bFFVRkxMRkZCUVV3c1EwRkJZeXhQUVVGa08wRkJRMFE3UVVGRFJqczdRVUZGUkRzN096dEJRV3BSYVVJN1FVRkJRVHRCUVVGQkxHOURRVzlSU0R0QlFVRkJPenRCUVVOYUxGbEJRVTBzVVVGQlVTeFRRVUZUTEdkQ1FVRlVMRU5CUVRCQ0xHRkJRVEZDTEVOQlFXUTdPMEZCUlVFc1dVRkJTU3hEUVVGRExFdEJRVXdzUlVGQldUdEJRVU5XTzBGQlEwUTdPMEZCUlVRc1kwRkJUU3hQUVVGT0xFTkJRV01zVlVGQlF5eEpRVUZFTEVWQlFWVTdRVUZEZEVJc1kwRkJTU3hYUVVGWExFdEJRVXNzV1VGQlRDeERRVUZyUWl4WFFVRnNRaXhEUVVGbU8wRkJRMEU3T3pzN1FVRkpRU3hqUVVGSkxFTkJRVU1zVVVGQlRDeEZRVUZsTzBGQlEySXNkVUpCUVZjc1MwRkJTeXhSUVVGb1FqdEJRVU5FT3p0QlFVVkVMR2xDUVVGTExHdENRVUZNTEVOQlFYZENMRkZCUVhoQ08wRkJRMFFzVTBGWVJEdEJRVmxFTzBGQmRsSm5RanRCUVVGQk8wRkJRVUVzTmtKQmVWSldMRkZCZWxKVkxFVkJlVkp4UWp0QlFVRkJMRmxCUVhKQ0xGbEJRWEZDTEhWRlFVRk9MRWxCUVUwN08wRkJRM0JETEdGQlFVc3NhVUpCUVV3c1IwRkJlVUlzVVVGQmVrSTdPMEZCUlVFc1dVRkJTU3huUWtGQlowSXNZVUZCWVN4SFFVRnFReXhGUVVGelF6dEJRVU53UXl4bFFVRkxMR3RDUVVGTUxFTkJRWGRDTEZGQlFYaENPMEZCUTBRN08wRkJSVVFzWlVGQlR5eEpRVUZRTzBGQlEwUTdRVUZxVTJkQ08wRkJRVUU3UVVGQlFTdzRRa0Z0VTJVN1FVRkJRU3haUVVFeFFpeG5Ra0ZCTUVJc2RVVkJRVkFzUzBGQlR6czdRVUZET1VJN1FVRkRRU3haUVVGSkxFdEJRVXNzVDBGQlZDeEZRVUZyUWp0QlFVTm9RaXhuUWtGQlRTeEpRVUZKTEV0QlFVb3NRMEZCWVN4SlFVRmlMSGxEUVVGT08wRkJRMFE3TzBGQlJVUXNZVUZCU3l4UFFVRk1MRWRCUVdVc1NVRkJaanM3UVVGRlFUdEJRVU5CTEZsQlFVa3NUMEZCVHl4UFFVRllMRVZCUVc5Q08wRkJRMnhDTERaQ1FVRnRRaXhKUVVGdVFqdEJRVU5FT3p0QlFVVkVMRmxCUVVrc1YwRkJWeXhMUVVGTExHVkJRVXdzUlVGQlpqdEJRVU5CTEZsQlFVa3NRMEZCUXl4TFFVRkxMRmxCUVV3c1EwRkJhMElzVVVGQmJFSXNRMEZCVEN4RlFVRnJRenRCUVVOb1F5eHhRa0ZCVnl4TFFVRkxMRTlCUVV3c1EwRkJZU3hYUVVGNFFqdEJRVU5FT3p0QlFVVkVMRmxCUVVrc2IwSkJRVzlDTEVOQlFVTXNTMEZCU3l4UFFVRk1MRU5CUVdFc1YwRkJkRU1zUlVGQmJVUTdRVUZEYWtRc1owSkJRVTBzU1VGQlNTeExRVUZLTEVOQlFXRXNTVUZCWWl3eVJFRkJUanRCUVVORU96dEJRVVZFTzBGQlEwRXNXVUZCU1N4UFFVRlBMRXRCUVZnc1JVRkJhMEk3UVVGRGFFSXNhMEpCUVZFc1IwRkJVaXhEUVVGWkxIZENRVUYzUWl4VFFVRlRMRmRCUVRkRE8wRkJRMEVzYTBKQlFWRXNSMEZCVWl4RFFVRlpMRXRCUVVzc1MwRkJUQ3hEUVVGWExFMUJRVmdzUjBGQmIwSXNZMEZCYUVNN1FVRkRRU3hyUWtGQlVTeEhRVUZTTEVOQlFWa3NZVUZCWVN4UlFVRjZRanRCUVVORU96dEJRVVZFT3pzN08wRkJTVUVzV1VGQlNTeExRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRnFRaXhGUVVFd1FqdEJRVU40UWl4bFFVRkxMRTlCUVV3c1EwRkJZU3hSUVVGaU8wRkJRMFE3TzBGQlJVUXNZVUZCU3l4UlFVRk1MRU5CUVdNc2JVSkJRVzFDTEV0QlFVc3NUMEZCVEN4RFFVRmhMRmRCUVdoRExFZEJRVGhETEZGQlFUVkVPMEZCUTBRN08wRkJSVVE3TzBGQk0xVnBRanRCUVVGQk8wRkJRVUVzYjBOQk5GVkpMRTlCTlZWS0xFVkJORlZoTzBGQlF6VkNMR1ZCUVU4c1NVRkJTU3hMUVVGS0xFTkJRVlVzVDBGQlZpeERRVUZRTzBGQlEwUTdRVUU1VldkQ08wRkJRVUU3UVVGQlFTd3dRa0Z6UmtrN1FVRkRia0lzWlVGQlZTeEpRVUZXTEZOQlFXdENMRTlCUVd4Q08wRkJRMFE3UVVGNFJtZENPenRCUVVGQk8wRkJRVUU3TzBGQmFWWnVRaXhUUVVGUExFdEJRVkE3UVVGRFJDeERRV3hXWVN4RlFVRmtPenRyUWtGdlZtVXNTenM3T3pzN096czdPenM3Y1dwQ1F6ZFdaanM3T3pzN08wRkJUVUU3TzBGQlEwRTdPenM3UVVGRlFTeEpRVUZOTEU5QlFWRXNXVUZCVFR0QlFVTnNRanM3T3pzN08wRkJUVUVzVFVGQlRTeFBRVUZQTEUxQlFXSTdRVUZEUVN4TlFVRk5MRlZCUVZVc1QwRkJhRUk3TzBGQlJVRXNUVUZCVFN4dlFrRkJiMElzYVVKQlFURkNPenRCUVVWQk96czdPenM3UVVGYWEwSXNUVUZyUWxvc1NVRnNRbGs3UVVGdFFtaENPenM3TzBGQlNVRXNhMEpCUVZrc1VVRkJXaXhGUVVGelFqdEJRVUZCT3p0QlFVTndRaXhYUVVGTExFbEJRVXdzUjBGQldTeFJRVUZhTzBGQlEwRXNWMEZCU3l4TlFVRk1MRWRCUVdNc1JVRkJaRHRCUVVOQkxGZEJRVXNzV1VGQlRDeEhRVUZ2UWl4SlFVRndRanRCUVVOQkxGZEJRVXNzWTBGQlRDeEhRVUZ6UWl4SlFVRjBRanRCUVVORU96dEJRVVZFT3p0QlFUbENaMEk3UVVGQlFUczdPMEZCYjBOb1FqczdPenRCUVhCRFowSXNhME5CZDBOS08wRkJRMVlzWlVGQlR5eExRVUZMTEUxQlFWbzdRVUZEUkRzN1FVRkZSRHM3T3pzN1FVRTFRMmRDTzBGQlFVRTdRVUZCUVN4dlEwRm5SRVk3UVVGRFdpeGxRVUZQTEV0QlFVc3NXVUZCV2p0QlFVTkVPenRCUVVWRU96czdPenRCUVhCRVowSTdRVUZCUVR0QlFVRkJMREJEUVhkRVNUdEJRVU5zUWl4bFFVRlBMRXRCUVVzc1kwRkJXanRCUVVORU8wRkJNVVJsTzBGQlFVRTdRVUZCUVN4eFEwRTBSRVE3UVVGQlFUczdRVUZEWWl4WlFVRk5MR05CUVdNc1UwRkJVeXhoUVVGVUxHdENRVUZ6UXl4TFFVRkxMRWxCUVRORExGRkJRWEJDT3p0QlFVVkJMRFpDUVVGVExFdEJRVXNzVjBGQlRDeEZRVUZVTEVWQlFUWkNMRlZCUVVNc1VVRkJSQ3hGUVVGak8wRkJRM3BETEdOQlFVa3NVMEZCVXl4blFrRkJWU3hQUVVGV0xFVkJRVzFDTEZGQlFXNUNMRVZCUVRaQ0xGRkJRVGRDTEVWQlFYVkRPMEZCUTJ4RUxHZENRVUZKTEZGQlFVb3NSVUZCWXp0QlFVTmFMSFZDUVVGVExFOUJRVlFzUTBGQmFVSXNWVUZCUXl4RlFVRkVMRVZCUVZFN1FVRkRka0lzYlVKQlFVY3NVMEZCU0N4SFFVRmxMRkZCUVdZN1FVRkRSQ3hsUVVaRU8wRkJSMFFzWVVGS1JDeE5RVWxQTzBGQlEwd3NjMEpCUVZFc1UwRkJVaXhIUVVGdlFpeFJRVUZ3UWp0QlFVTkVPMEZCUTBZc1YwRlNSRHM3UVVGVlFTeGpRVUZKTEUxQlFVc3NhVUpCUVV3c1JVRkJTaXhGUVVFNFFqdEJRVU0xUWl4eFFrRkJVeXhOUVVGTExHbENRVUZNTEVWQlFWUTdRVUZEUkRzN1FVRkZSQ3hwUWtGQlR5eFhRVUZRTEVWQlFXOUNMRkZCUVhCQ0xFVkJRVGhDTEZsQlFWa3NaMEpCUVZvc1EwRkJOa0lzYVVKQlFUZENMRU5CUVRsQ08wRkJRMFFzVTBGb1FrUXNSVUZuUWtjc1NVRm9Ra2c3UVVGcFFrUTdPMEZCUlVRN08wRkJSVUU3T3pzN08wRkJjRVpuUWp0QlFVRkJPMEZCUVVFc2RVTkJkMFpETEZWQmVFWkVMRVZCZDBaaE8wRkJRek5DTEdGQlFVc3NUVUZCVEN4RFFVRlpMRWxCUVZvc1EwRkJhVUlzVlVGQmFrSTdRVUZEUkRzN1FVRkZSRHM3T3pzN08wRkJOVVpuUWp0QlFVRkJPMEZCUVVFc2EwTkJhVWRLTEZsQmFrZEpMRVZCYVVkVk8wRkJRM2hDTEZsQlFVa3NUMEZCVHl4WlFVRlFMRXRCUVhkQ0xGRkJRVFZDTEVWQlFYTkRPMEZCUTNCRExHZENRVUZOTEVsQlFVa3NTMEZCU2l4RFFVRlZMR2xFUVVGblJDeFpRVUZvUkN4NVEwRkJaMFFzV1VGQmFFUXNTMEZCSzBRc1YwRkJla1VzUTBGQlRqdEJRVU5FTzBGQlEwUXNZVUZCU3l4WlFVRk1MRWRCUVc5Q0xGbEJRWEJDTzBGQlEwUTdPMEZCUlVRN096czdPMEZCZUVkblFqdEJRVUZCTzBGQlFVRXNNRU5CTkVkSkxHTkJOVWRLTEVWQk5FZHZRanRCUVVOc1F5eFpRVUZKTEU5QlFVOHNZMEZCVUN4TFFVRXdRaXhWUVVFNVFpeEZRVUV3UXp0QlFVTjRReXhuUWtGQlRTeEpRVUZKTEV0QlFVb3NRMEZCVlN3NFJFRkJOa1FzWTBGQk4wUXNlVU5CUVRaRUxHTkJRVGRFTEV0QlFUaEZMRmRCUVhoR0xFTkJRVTQ3UVVGRFJEdEJRVU5FTEdGQlFVc3NZMEZCVEN4SFFVRnpRaXhqUVVGMFFqdEJRVU5FT3p0QlFVVkVPenM3T3pzN1FVRnVTR2RDTzBGQlFVRTdRVUZCUVN4dlEwRjNTRVlzVTBGNFNFVXNSVUYzU0RKQ08wRkJRVUU3TzBGQlFVRXNXVUZCYkVJc1YwRkJhMElzZFVWQlFVb3NSVUZCU1RzN1FVRkRla01zV1VGQlRTeDNRa0ZCYzBJc1ZVRkJWU3hOUVVGV0xFTkJRV2xDTEVOQlFXcENMRVZCUVc5Q0xGZEJRWEJDTEVWQlFYUkNMRWRCUVRCRUxGVkJRVlVzUzBGQlZpeERRVUZuUWl4RFFVRm9RaXhEUVVGb1JUczdRVUZGUVN4aFFVRkxMRTFCUVV3c1EwRkJXU3hQUVVGYUxFTkJRVzlDTEZWQlFVTXNTMEZCUkN4RlFVRlhPMEZCUXpkQ0xHTkJRVTBzWVVGQllTeE5RVUZOTEZOQlFVNHNRMEZCYmtJN1FVRkRRU3hqUVVGTkxHdENRVUZyUWl4TlFVRk5MR05CUVU0c1EwRkJlRUk3UVVGRFFTeGpRVUZKTEU5QlFVOHNWVUZCVUN4TFFVRnpRaXhWUVVFeFFpeEZRVUZ6UXp0QlFVTndReXgxUWtGQlZ5eExRVUZZTEZOQlFYVkNMRmRCUVhaQ08wRkJRMFE3TzBGQlJVUTdRVUZEUVN4alFVRkpMRTlCUVU4c1pVRkJVQ3hMUVVFeVFpeFZRVUV2UWl4RlFVRXlRenRCUVVONlF5dzBRa0ZCWjBJc1MwRkJhRUlzVTBGQk5FSXNWMEZCTlVJN1FVRkRSRHRCUVVOR0xGTkJXRVE3TzBGQllVRXNlVU5CUVd0Q0xGTkJRV3hDTEVWQlFUWkNMRXRCUVVzc1NVRkJiRU1zUlVGQmQwTXNWMEZCZUVNN1FVRkRSRHRCUVhwSlpUdEJRVUZCTzBGQlFVRXNNRUpCWjBOTE8wRkJRMjVDTEdWQlFWVXNTVUZCVml4VFFVRnJRaXhQUVVGc1FqdEJRVU5FTzBGQmJFTmxPenRCUVVGQk8wRkJRVUU3TzBGQk5FbHNRaXhUUVVGUExFbEJRVkE3UVVGRFJDeERRVGRKV1N4RlFVRmlPenRyUWtFclNXVXNTVHM3T3pzN096czdPMEZEYmtwbU96czdPenM3YzBOQlRFRTdPenM3T3pzN096czdPenRSUTBOblFpeFJMRWRCUVVFc1VUdFJRVzFDUVN4VkxFZEJRVUVzVlR0UlFVbEJMR2xDTEVkQlFVRXNhVUk3VVVGWFFTeGpMRWRCUVVFc1l6dFJRVlZCTEdkQ0xFZEJRVUVzWjBJN1FVRTFRMVFzVTBGQlV5eFJRVUZVTEVOQlFXdENMRWRCUVd4Q0xFVkJRWFZDTEVWQlFYWkNMRVZCUVRKQ0xGRkJRVE5DTEVWQlFYRkRPMEZCUXpGRExFMUJRVTBzVFVGQlRTeEpRVUZKTEdOQlFVb3NSVUZCV2p0QlFVTkJMRTFCUVVrc1NVRkJTU3huUWtGQlVpeEZRVUV3UWl4SlFVRkpMR2RDUVVGS0xFTkJRWEZDTERCQ1FVRnlRanRCUVVNeFFpeE5RVUZKTEd0Q1FVRktMRWRCUVhsQ0xGbEJRVTA3UVVGRE4wSXNVVUZCU1N4SlFVRkpMRlZCUVVvc1MwRkJiVUlzUTBGQmJrSXNTMEZCZVVJc1UwRkJVeXhKUVVGSkxFMUJRV0lzVFVGQmVVSXNSMEZCZWtJc1NVRkJaME1zUTBGQlF5eEpRVUZKTEUxQlFVd3NTVUZCWlN4SlFVRkpMRmxCUVVvc1EwRkJhVUlzVFVGQmVrWXNRMEZCU2l4RlFVRnpSenRCUVVOd1J5eFRRVUZITEVsQlFVa3NXVUZCVUR0QlFVTkVPMEZCUTBZc1IwRktSRHM3UVVGTlFTeE5RVUZKTEU5QlFVOHNVVUZCVUN4TFFVRnZRaXhSUVVGNFFpeEZRVUZyUXp0QlFVTm9ReXhSUVVGSkxFbEJRVW9zUTBGQlV5eExRVUZVTEVWQlFXZENMRWRCUVdoQ0xFVkJRWEZDTEVsQlFYSkNPMEZCUTBFc1VVRkJTU3hKUVVGS0xFTkJRVk1zUlVGQlZEdEJRVU5FTEVkQlNFUXNUVUZIVHp0QlFVTk1MRkZCUVVrc1NVRkJTaXhEUVVGVExFMUJRVlFzUlVGQmFVSXNSMEZCYWtJc1JVRkJjMElzU1VGQmRFSTdRVUZEUVN4UlFVRkpMR2RDUVVGS0xFTkJRWEZDTEdOQlFYSkNMRVZCUVhGRExHMURRVUZ5UXp0QlFVTkJMRkZCUVVrc1NVRkJTaXhEUVVGVExGRkJRVlE3UVVGRFJEdEJRVU5HT3p0QlFVVk5MRk5CUVZNc1ZVRkJWQ3hIUVVGelFqdEJRVU16UWl4VFFVRlBMRXRCUVVzc1RVRkJUQ3hIUVVGakxGRkJRV1FzUTBGQmRVSXNSVUZCZGtJc1JVRkJNa0lzVFVGQk0wSXNRMEZCYTBNc1EwRkJiRU1zUlVGQmNVTXNSVUZCY2tNc1EwRkJVRHRCUVVORU96dEJRVVZOTEZOQlFWTXNhVUpCUVZRc1EwRkJNa0lzVFVGQk0wSXNSVUZCYlVNc1YwRkJia01zUlVGQlowUTdRVUZEY2tRc1UwRkJUeXhWUVVGVkxGZEJRVmNzVVVGQk5VSXNSVUZCYzBNc1UwRkJVeXhQUVVGUExGVkJRWFJFTEVWQlFXdEZPMEZCUTJoRkxGRkJRVWtzVDBGQlR5eFRRVUZRTEVOQlFXbENMRkZCUVdwQ0xFTkJRVEJDTEZkQlFURkNMRU5CUVVvc1JVRkJORU03UVVGRE1VTXNZVUZCVHl4TlFVRlFPMEZCUTBRN1FVRkRSanM3UVVGRlJDeFRRVUZQTEVsQlFWQTdRVUZEUkRzN1FVRkhUU3hUUVVGVExHTkJRVlFzUTBGQmQwSXNUVUZCZUVJc1JVRkJaME1zVVVGQmFFTXNSVUZCTUVNN1FVRkRMME1zVTBGQlR5eFZRVUZWTEZkQlFWY3NVVUZCTlVJc1JVRkJjME1zVTBGQlV5eFBRVUZQTEZWQlFYUkVMRVZCUVd0Rk8wRkJRMmhGTEZGQlFVa3NUMEZCVHl4WlFVRlFMRU5CUVc5Q0xFbEJRWEJDTEUxQlFUaENMRkZCUVd4RExFVkJRVFJETzBGQlF6RkRMR0ZCUVU4c1RVRkJVRHRCUVVORU8wRkJRMFk3TzBGQlJVUXNVMEZCVHl4SlFVRlFPMEZCUTBRN08wRkJSVTBzVTBGQlV5eG5Ra0ZCVkN4RFFVRXdRaXhOUVVFeFFpeEZRVUZyUXl4SlFVRnNReXhGUVVGM1F6dEJRVU0zUXl4VFFVRlBMRlZCUVZVc1YwRkJWeXhSUVVFMVFpeEZRVUZ6UXl4VFFVRlRMRTlCUVU4c1ZVRkJkRVFzUlVGQmEwVTdRVUZEYUVVc1VVRkJTU3hQUVVGUExGbEJRVkFzUTBGQmIwSXNTVUZCY0VJc1RVRkJPRUlzU1VGQmJFTXNSVUZCZDBNN1FVRkRkRU1zWVVGQlR5eE5RVUZRTzBGQlEwUTdRVUZEUmpzN1FVRkZSQ3hUUVVGUExFbEJRVkE3UVVGRFJEczdPenM3T3pzN08wRkRPVU5FT3pzN08wRkJRMEU3T3pzN1FVRkRRVHM3T3p0QlFVTkJPenM3TzBGQlEwRTdPenM3UVVGSFFUczdPenRCUVVOQk96czdPMEZCUTBFN096czdRVUZEUVRzN096dEJRVU5CT3pzN08wRkJRMEU3T3pzN1FVRkRRVHM3T3p0QlFVTkJPenM3TzBGQlEwRTdPenM3T3p0QlFYUkNRVHM3T3pzN08wRkJUVUU3UVVGclFrRXNTVUZCVFN4TlFVRk5MRVZCUVZvN08wRkJSVUU3T3pzN096czdRVUZpUVR0QlFXdENRU3hKUVVGSkxFMUJRVW9zUjBGQllUdEJRVU5ZTzBGQlEwRXNVMEZCVHpzN1FVRkhWRHM3T3pzN1FVRk1ZU3hEUVVGaUxFTkJWVUVzU1VGQlNTeExRVUZLTEVkQlFWa3NWVUZCUXl4UFFVRkVMRVZCUVdFN1FVRkRka0lzVFVGQlNTeFBRVUZQTEVsQlFVa3NUVUZCV0N4TFFVRnpRaXhYUVVFeFFpeEZRVUYxUXp0QlFVTnlReXhSUVVGSkxFMUJRVW9zUjBGQllTeG5Ra0ZCVFN4aFFVRk9MRU5CUVc5Q0xFOUJRWEJDTEVOQlFXSTdRVUZEUkR0QlFVTkVMRk5CUVU4c1NVRkJTU3hOUVVGWU8wRkJRMFFzUTBGTVJEczdRVUZQUVRzN096czdPMEZCVFVFc1NVRkJTU3hSUVVGS096dEJRVVZCT3pzN096dEJRVXRCTEVsQlFVa3NTVUZCU2l4SFFVRlhMR1ZCUVVzc1lVRkJhRUk3TzBGQlJVRTdPenM3TzBGQlMwRXNTVUZCU1N4SlFVRktMRWRCUVZjc1pVRkJTeXhoUVVGb1FqczdRVUZGUVRzN096czdRVUZMUVN4SlFVRkpMRTlCUVVvc1IwRkJZeXhyUWtGQlVTeGhRVUYwUWpzN1FVRkZRVHM3T3pzN1FVRkxRU3hKUVVGSkxGbEJRVW9zUjBGQmJVSXNkVUpCUVdFc1lVRkJhRU03TzBGQlJVRTdPenM3TzBGQlMwRXNTVUZCU1N4TlFVRktMRWRCUVdFc2FVSkJRVThzWVVGQmNFSTdPMEZCUlVFN096czdPMEZCUzBFc1NVRkJTU3hSUVVGS0xFZEJRV1VzYlVKQlFWTXNZVUZCZUVJN08wRkJSVUU3T3pzN08wRkJTMEVzU1VGQlNTeFRRVUZLTEVkQlFXZENMRzlDUVVGVkxHRkJRVEZDT3p0QlFVZEJPenM3T3p0QlFVdEJMRWxCUVVrc1IwRkJTaXhIUVVGVkxHTkJRVWtzWVVGQlpEczdRVUZGUVRzN096czdRVUZMUVN4SlFVRkpMRkZCUVVvc1IwRkJaU3h0UWtGQlV5eGhRVUY0UWpzN1FVRkZRVHM3T3pzN1FVRkxRU3hKUVVGSkxFMUJRVW9zUjBGQllTeHBRa0ZCVHl4aFFVRndRanM3UVVGRlFUczdPenM3UVVGTFFTeEpRVUZKTEZOQlFVb3NSMEZCWjBJc2IwSkJRVlVzWVVGQk1VSTdPMEZCUlVFN096czdPMEZCUzBFc1NVRkJTU3hSUVVGS0xFZEJRV1VzYlVKQlFWTXNZVUZCZUVJN08wRkJSVUU3UVVGRFFTeFBRVUZQTEUxQlFWQXNSMEZCWjBJc1IwRkJhRUk3TzJ0Q1FVVmxMRWNpTENKbWFXeGxJam9pWjJWdVpYSmhkR1ZrTG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpaG1kVzVqZEdsdmJpQmxLSFFzYml4eUtYdG1kVzVqZEdsdmJpQnpLRzhzZFNsN2FXWW9JVzViYjEwcGUybG1LQ0YwVzI5ZEtYdDJZWElnWVQxMGVYQmxiMllnY21WeGRXbHlaVDA5WENKbWRXNWpkR2x2Ymx3aUppWnlaWEYxYVhKbE8ybG1LQ0YxSmlaaEtYSmxkSFZ5YmlCaEtHOHNJVEFwTzJsbUtHa3BjbVYwZFhKdUlHa29ieXdoTUNrN2RtRnlJR1k5Ym1WM0lFVnljbTl5S0Z3aVEyRnVibTkwSUdacGJtUWdiVzlrZFd4bElDZGNJaXR2SzF3aUoxd2lLVHQwYUhKdmR5Qm1MbU52WkdVOVhDSk5UMFJWVEVWZlRrOVVYMFpQVlU1RVhDSXNabjEyWVhJZ2JEMXVXMjlkUFh0bGVIQnZjblJ6T250OWZUdDBXMjlkV3pCZExtTmhiR3dvYkM1bGVIQnZjblJ6TEdaMWJtTjBhVzl1S0dVcGUzWmhjaUJ1UFhSYmIxMWJNVjFiWlYwN2NtVjBkWEp1SUhNb2JqOXVPbVVwZlN4c0xHd3VaWGh3YjNKMGN5eGxMSFFzYml4eUtYMXlaWFIxY200Z2JsdHZYUzVsZUhCdmNuUnpmWFpoY2lCcFBYUjVjR1Z2WmlCeVpYRjFhWEpsUFQxY0ltWjFibU4wYVc5dVhDSW1KbkpsY1hWcGNtVTdabTl5S0haaGNpQnZQVEE3Ynp4eUxteGxibWQwYUR0dkt5c3BjeWh5VzI5ZEtUdHlaWFIxY200Z2MzMHBJaXdpTHlvaFhHNGdLaUJRYkdGMFptOXliUzVxY3lBOGFIUjBjSE02THk5dGRHaHpMbUpsTDNCc1lYUm1iM0p0UGx4dUlDb2dRMjl3ZVhKcFoyaDBJREl3TVRRdE1qQXhOaUJDWlc1cVlXMXBiaUJVWVc0Z1BHaDBkSEJ6T2k4dlpHVnRiMjVsWVhWNExtZHBkR2gxWWk1cGJ5OCtYRzRnS2lCRGIzQjVjbWxuYUhRZ01qQXhNUzB5TURFeklFcHZhRzR0UkdGMmFXUWdSR0ZzZEc5dUlEeG9kSFJ3T2k4dllXeHNlVzkxWTJGdWJHVmxkQzVqYjIwdlBseHVJQ29nUVhaaGFXeGhZbXhsSUhWdVpHVnlJRTFKVkNCc2FXTmxibk5sSUR4b2RIUndjem92TDIxMGFITXVZbVV2YldsMFBseHVJQ292WEc0N0tHWjFibU4wYVc5dUtDa2dlMXh1SUNBbmRYTmxJSE4wY21samRDYzdYRzVjYmlBZ0x5b3FJRlZ6WldRZ2RHOGdaR1YwWlhKdGFXNWxJR2xtSUhaaGJIVmxjeUJoY21VZ2IyWWdkR2hsSUd4aGJtZDFZV2RsSUhSNWNHVWdZRTlpYW1WamRHQXVJQ292WEc0Z0lIWmhjaUJ2WW1wbFkzUlVlWEJsY3lBOUlIdGNiaUFnSUNBblpuVnVZM1JwYjI0bk9pQjBjblZsTEZ4dUlDQWdJQ2R2WW1wbFkzUW5PaUIwY25WbFhHNGdJSDA3WEc1Y2JpQWdMeW9xSUZWelpXUWdZWE1nWVNCeVpXWmxjbVZ1WTJVZ2RHOGdkR2hsSUdkc2IySmhiQ0J2WW1wbFkzUXVJQ292WEc0Z0lIWmhjaUJ5YjI5MElEMGdLRzlpYW1WamRGUjVjR1Z6VzNSNWNHVnZaaUIzYVc1a2IzZGRJQ1ltSUhkcGJtUnZkeWtnZkh3Z2RHaHBjenRjYmx4dUlDQXZLaW9nUW1GamEzVndJSEJ2YzNOcFlteGxJR2RzYjJKaGJDQnZZbXBsWTNRdUlDb3ZYRzRnSUhaaGNpQnZiR1JTYjI5MElEMGdjbTl2ZER0Y2JseHVJQ0F2S2lvZ1JHVjBaV04wSUdaeVpXVWdkbUZ5YVdGaWJHVWdZR1Y0Y0c5eWRITmdMaUFxTDF4dUlDQjJZWElnWm5KbFpVVjRjRzl5ZEhNZ1BTQnZZbXBsWTNSVWVYQmxjMXQwZVhCbGIyWWdaWGh3YjNKMGMxMGdKaVlnWlhod2IzSjBjenRjYmx4dUlDQXZLaW9nUkdWMFpXTjBJR1p5WldVZ2RtRnlhV0ZpYkdVZ1lHMXZaSFZzWldBdUlDb3ZYRzRnSUhaaGNpQm1jbVZsVFc5a2RXeGxJRDBnYjJKcVpXTjBWSGx3WlhOYmRIbHdaVzltSUcxdlpIVnNaVjBnSmlZZ2JXOWtkV3hsSUNZbUlDRnRiMlIxYkdVdWJtOWtaVlI1Y0dVZ0ppWWdiVzlrZFd4bE8xeHVYRzRnSUM4cUtpQkVaWFJsWTNRZ1puSmxaU0IyWVhKcFlXSnNaU0JnWjJ4dlltRnNZQ0JtY205dElFNXZaR1V1YW5NZ2IzSWdRbkp2ZDNObGNtbG1hV1ZrSUdOdlpHVWdZVzVrSUhWelpTQnBkQ0JoY3lCZ2NtOXZkR0F1SUNvdlhHNGdJSFpoY2lCbWNtVmxSMnh2WW1Gc0lEMGdabkpsWlVWNGNHOXlkSE1nSmlZZ1puSmxaVTF2WkhWc1pTQW1KaUIwZVhCbGIyWWdaMnh2WW1Gc0lEMDlJQ2R2WW1wbFkzUW5JQ1ltSUdkc2IySmhiRHRjYmlBZ2FXWWdLR1p5WldWSGJHOWlZV3dnSmlZZ0tHWnlaV1ZIYkc5aVlXd3VaMnh2WW1Gc0lEMDlQU0JtY21WbFIyeHZZbUZzSUh4OElHWnlaV1ZIYkc5aVlXd3VkMmx1Wkc5M0lEMDlQU0JtY21WbFIyeHZZbUZzSUh4OElHWnlaV1ZIYkc5aVlXd3VjMlZzWmlBOVBUMGdabkpsWlVkc2IySmhiQ2twSUh0Y2JpQWdJQ0J5YjI5MElEMGdabkpsWlVkc2IySmhiRHRjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lCVmMyVmtJR0Z6SUhSb1pTQnRZWGhwYlhWdElHeGxibWQwYUNCdlppQmhiaUJoY25KaGVTMXNhV3RsSUc5aWFtVmpkQzVjYmlBZ0lDb2dVMlZsSUhSb1pTQmJSVk0ySUhOd1pXTmRLR2gwZEhBNkx5OXdaVzl3YkdVdWJXOTZhV3hzWVM1dmNtY3ZmbXB2Y21WdVpHOXlabVl2WlhNMkxXUnlZV1owTG1oMGJXd2pjMlZqTFhSdmJHVnVaM1JvS1Z4dUlDQWdLaUJtYjNJZ2JXOXlaU0JrWlhSaGFXeHpMbHh1SUNBZ0tpOWNiaUFnZG1GeUlHMWhlRk5oWm1WSmJuUmxaMlZ5SUQwZ1RXRjBhQzV3YjNjb01pd2dOVE1wSUMwZ01UdGNibHh1SUNBdktpb2dVbVZuZFd4aGNpQmxlSEJ5WlhOemFXOXVJSFJ2SUdSbGRHVmpkQ0JQY0dWeVlTNGdLaTljYmlBZ2RtRnlJSEpsVDNCbGNtRWdQU0F2WEZ4aVQzQmxjbUV2TzF4dVhHNGdJQzhxS2lCUWIzTnphV0pzWlNCbmJHOWlZV3dnYjJKcVpXTjBMaUFxTDF4dUlDQjJZWElnZEdocGMwSnBibVJwYm1jZ1BTQjBhR2x6TzF4dVhHNGdJQzhxS2lCVmMyVmtJR1p2Y2lCdVlYUnBkbVVnYldWMGFHOWtJSEpsWm1WeVpXNWpaWE11SUNvdlhHNGdJSFpoY2lCdlltcGxZM1JRY205MGJ5QTlJRTlpYW1WamRDNXdjbTkwYjNSNWNHVTdYRzVjYmlBZ0x5b3FJRlZ6WldRZ2RHOGdZMmhsWTJzZ1ptOXlJRzkzYmlCd2NtOXdaWEowYVdWeklHOW1JR0Z1SUc5aWFtVmpkQzRnS2k5Y2JpQWdkbUZ5SUdoaGMwOTNibEJ5YjNCbGNuUjVJRDBnYjJKcVpXTjBVSEp2ZEc4dWFHRnpUM2R1VUhKdmNHVnlkSGs3WEc1Y2JpQWdMeW9xSUZWelpXUWdkRzhnY21WemIyeDJaU0IwYUdVZ2FXNTBaWEp1WVd3Z1lGdGJRMnhoYzNOZFhXQWdiMllnZG1Gc2RXVnpMaUFxTDF4dUlDQjJZWElnZEc5VGRISnBibWNnUFNCdlltcGxZM1JRY205MGJ5NTBiMU4wY21sdVp6dGNibHh1SUNBdktpMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRLaTljYmx4dUlDQXZLaXBjYmlBZ0lDb2dRMkZ3YVhSaGJHbDZaWE1nWVNCemRISnBibWNnZG1Gc2RXVXVYRzRnSUNBcVhHNGdJQ0FxSUVCd2NtbDJZWFJsWEc0Z0lDQXFJRUJ3WVhKaGJTQjdjM1J5YVc1bmZTQnpkSEpwYm1jZ1ZHaGxJSE4wY21sdVp5QjBieUJqWVhCcGRHRnNhWHBsTGx4dUlDQWdLaUJBY21WMGRYSnVjeUI3YzNSeWFXNW5mU0JVYUdVZ1kyRndhWFJoYkdsNlpXUWdjM1J5YVc1bkxseHVJQ0FnS2k5Y2JpQWdablZ1WTNScGIyNGdZMkZ3YVhSaGJHbDZaU2h6ZEhKcGJtY3BJSHRjYmlBZ0lDQnpkSEpwYm1jZ1BTQlRkSEpwYm1jb2MzUnlhVzVuS1R0Y2JpQWdJQ0J5WlhSMWNtNGdjM1J5YVc1bkxtTm9ZWEpCZENnd0tTNTBiMVZ3Y0dWeVEyRnpaU2dwSUNzZ2MzUnlhVzVuTG5Oc2FXTmxLREVwTzF4dUlDQjlYRzVjYmlBZ0x5b3FYRzRnSUNBcUlFRWdkWFJwYkdsMGVTQm1kVzVqZEdsdmJpQjBieUJqYkdWaGJpQjFjQ0IwYUdVZ1QxTWdibUZ0WlM1Y2JpQWdJQ3BjYmlBZ0lDb2dRSEJ5YVhaaGRHVmNiaUFnSUNvZ1FIQmhjbUZ0SUh0emRISnBibWQ5SUc5eklGUm9aU0JQVXlCdVlXMWxJSFJ2SUdOc1pXRnVJSFZ3TGx4dUlDQWdLaUJBY0dGeVlXMGdlM04wY21sdVozMGdXM0JoZEhSbGNtNWRJRUVnWUZKbFowVjRjR0FnY0dGMGRHVnliaUJ0WVhSamFHbHVaeUIwYUdVZ1QxTWdibUZ0WlM1Y2JpQWdJQ29nUUhCaGNtRnRJSHR6ZEhKcGJtZDlJRnRzWVdKbGJGMGdRU0JzWVdKbGJDQm1iM0lnZEdobElFOVRMbHh1SUNBZ0tpOWNiaUFnWm5WdVkzUnBiMjRnWTJ4bFlXNTFjRTlUS0c5ekxDQndZWFIwWlhKdUxDQnNZV0psYkNrZ2UxeHVJQ0FnSUM4dklGQnNZWFJtYjNKdElIUnZhMlZ1Y3lCaGNtVWdaR1ZtYVc1bFpDQmhkRHBjYmlBZ0lDQXZMeUJvZEhSd09pOHZiWE5rYmk1dGFXTnliM052Wm5RdVkyOXRMMlZ1TFhWekwyeHBZbkpoY25rdmJYTTFNemMxTURNb1ZsTXVPRFVwTG1GemNIaGNiaUFnSUNBdkx5Qm9kSFJ3T2k4dmQyVmlMbUZ5WTJocGRtVXViM0puTDNkbFlpOHlNREE0TVRFeU1qQTFNemsxTUM5b2RIUndPaTh2YlhOa2JpNXRhV055YjNOdlpuUXVZMjl0TDJWdUxYVnpMMnhwWW5KaGNua3ZiWE0xTXpjMU1ETW9WbE11T0RVcExtRnpjSGhjYmlBZ0lDQjJZWElnWkdGMFlTQTlJSHRjYmlBZ0lDQWdJQ2N4TUM0d0p6b2dKekV3Snl4Y2JpQWdJQ0FnSUNjMkxqUW5PaUFnSnpFd0lGUmxZMmh1YVdOaGJDQlFjbVYyYVdWM0p5eGNiaUFnSUNBZ0lDYzJMak1uT2lBZ0p6Z3VNU2NzWEc0Z0lDQWdJQ0FuTmk0eUp6b2dJQ2M0Snl4Y2JpQWdJQ0FnSUNjMkxqRW5PaUFnSjFObGNuWmxjaUF5TURBNElGSXlJQzhnTnljc1hHNGdJQ0FnSUNBbk5pNHdKem9nSUNkVFpYSjJaWElnTWpBd09DQXZJRlpwYzNSaEp5eGNiaUFnSUNBZ0lDYzFMakluT2lBZ0oxTmxjblpsY2lBeU1EQXpJQzhnV0ZBZ05qUXRZbWwwSnl4Y2JpQWdJQ0FnSUNjMUxqRW5PaUFnSjFoUUp5eGNiaUFnSUNBZ0lDYzFMakF4SnpvZ0p6SXdNREFnVTFBeEp5eGNiaUFnSUNBZ0lDYzFMakFuT2lBZ0p6SXdNREFuTEZ4dUlDQWdJQ0FnSnpRdU1DYzZJQ0FuVGxRbkxGeHVJQ0FnSUNBZ0p6UXVPVEFuT2lBblRVVW5YRzRnSUNBZ2ZUdGNiaUFnSUNBdkx5QkVaWFJsWTNRZ1YybHVaRzkzY3lCMlpYSnphVzl1SUdaeWIyMGdjR3hoZEdadmNtMGdkRzlyWlc1ekxseHVJQ0FnSUdsbUlDaHdZWFIwWlhKdUlDWW1JR3hoWW1Wc0lDWW1JQzllVjJsdUwya3VkR1Z6ZENodmN5a2dKaVlnSVM5ZVYybHVaRzkzY3lCUWFHOXVaU0F2YVM1MFpYTjBLRzl6S1NBbUpseHVJQ0FnSUNBZ0lDQW9aR0YwWVNBOUlHUmhkR0ZiTDF0Y1hHUXVYU3NrTHk1bGVHVmpLRzl6S1YwcEtTQjdYRzRnSUNBZ0lDQnZjeUE5SUNkWGFXNWtiM2R6SUNjZ0t5QmtZWFJoTzF4dUlDQWdJSDFjYmlBZ0lDQXZMeUJEYjNKeVpXTjBJR05vWVhKaFkzUmxjaUJqWVhObElHRnVaQ0JqYkdWaGJuVndJSE4wY21sdVp5NWNiaUFnSUNCdmN5QTlJRk4wY21sdVp5aHZjeWs3WEc1Y2JpQWdJQ0JwWmlBb2NHRjBkR1Z5YmlBbUppQnNZV0psYkNrZ2UxeHVJQ0FnSUNBZ2IzTWdQU0J2Y3k1eVpYQnNZV05sS0ZKbFowVjRjQ2h3WVhSMFpYSnVMQ0FuYVNjcExDQnNZV0psYkNrN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnYjNNZ1BTQm1iM0p0WVhRb1hHNGdJQ0FnSUNCdmN5NXlaWEJzWVdObEtDOGdZMlVrTDJrc0lDY2dRMFVuS1Z4dUlDQWdJQ0FnSUNBdWNtVndiR0ZqWlNndlhGeGlhSEIzTDJrc0lDZDNaV0luS1Z4dUlDQWdJQ0FnSUNBdWNtVndiR0ZqWlNndlhGeGlUV0ZqYVc1MGIzTm9YRnhpTHl3Z0owMWhZeUJQVXljcFhHNGdJQ0FnSUNBZ0lDNXlaWEJzWVdObEtDOWZVRzkzWlhKUVExeGNZaTlwTENBbklFOVRKeWxjYmlBZ0lDQWdJQ0FnTG5KbGNHeGhZMlVvTDF4Y1lpaFBVeUJZS1NCYlhpQmNYR1JkS3k5cExDQW5KREVuS1Z4dUlDQWdJQ0FnSUNBdWNtVndiR0ZqWlNndlhGeGlUV0ZqSUNoUFV5QllLVnhjWWk4c0lDY2tNU2NwWEc0Z0lDQWdJQ0FnSUM1eVpYQnNZV05sS0M5Y1hDOG9YRnhrS1M4c0lDY2dKREVuS1Z4dUlDQWdJQ0FnSUNBdWNtVndiR0ZqWlNndlh5OW5MQ0FuTGljcFhHNGdJQ0FnSUNBZ0lDNXlaWEJzWVdObEtDOG9Qem9nUW1WUVEzeGJJQzVkS21aald5QmNYR1F1WFNzcEpDOXBMQ0FuSnlsY2JpQWdJQ0FnSUNBZ0xuSmxjR3hoWTJVb0wxeGNZbmc0Tmx4Y0xqWTBYRnhpTDJkcExDQW5lRGcyWHpZMEp5bGNiaUFnSUNBZ0lDQWdMbkpsY0d4aFkyVW9MMXhjWWloWGFXNWtiM2R6SUZCb2IyNWxLU0JQVTF4Y1lpOHNJQ2NrTVNjcFhHNGdJQ0FnSUNBZ0lDNXlaWEJzWVdObEtDOWNYR0lvUTJoeWIyMWxJRTlUSUZ4Y2R5c3BJRnRjWEdRdVhTdGNYR0l2TENBbkpERW5LVnh1SUNBZ0lDQWdJQ0F1YzNCc2FYUW9KeUJ2YmlBbktWc3dYVnh1SUNBZ0lDazdYRzVjYmlBZ0lDQnlaWFIxY200Z2IzTTdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nUVc0Z2FYUmxjbUYwYVc5dUlIVjBhV3hwZEhrZ1ptOXlJR0Z5Y21GNWN5QmhibVFnYjJKcVpXTjBjeTVjYmlBZ0lDcGNiaUFnSUNvZ1FIQnlhWFpoZEdWY2JpQWdJQ29nUUhCaGNtRnRJSHRCY25KaGVYeFBZbXBsWTNSOUlHOWlhbVZqZENCVWFHVWdiMkpxWldOMElIUnZJR2wwWlhKaGRHVWdiM1psY2k1Y2JpQWdJQ29nUUhCaGNtRnRJSHRHZFc1amRHbHZibjBnWTJGc2JHSmhZMnNnVkdobElHWjFibU4wYVc5dUlHTmhiR3hsWkNCd1pYSWdhWFJsY21GMGFXOXVMbHh1SUNBZ0tpOWNiaUFnWm5WdVkzUnBiMjRnWldGamFDaHZZbXBsWTNRc0lHTmhiR3hpWVdOcktTQjdYRzRnSUNBZ2RtRnlJR2x1WkdWNElEMGdMVEVzWEc0Z0lDQWdJQ0FnSUd4bGJtZDBhQ0E5SUc5aWFtVmpkQ0EvSUc5aWFtVmpkQzVzWlc1bmRHZ2dPaUF3TzF4dVhHNGdJQ0FnYVdZZ0tIUjVjR1Z2WmlCc1pXNW5kR2dnUFQwZ0oyNTFiV0psY2ljZ0ppWWdiR1Z1WjNSb0lENGdMVEVnSmlZZ2JHVnVaM1JvSUR3OUlHMWhlRk5oWm1WSmJuUmxaMlZ5S1NCN1hHNGdJQ0FnSUNCM2FHbHNaU0FvS3l0cGJtUmxlQ0E4SUd4bGJtZDBhQ2tnZTF4dUlDQWdJQ0FnSUNCallXeHNZbUZqYXlodlltcGxZM1JiYVc1a1pYaGRMQ0JwYm1SbGVDd2diMkpxWldOMEtUdGNiaUFnSUNBZ0lIMWNiaUFnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnWm05eVQzZHVLRzlpYW1WamRDd2dZMkZzYkdKaFkyc3BPMXh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJVY21sdElHRnVaQ0JqYjI1a2FYUnBiMjVoYkd4NUlHTmhjR2wwWVd4cGVtVWdjM1J5YVc1bklIWmhiSFZsY3k1Y2JpQWdJQ3BjYmlBZ0lDb2dRSEJ5YVhaaGRHVmNiaUFnSUNvZ1FIQmhjbUZ0SUh0emRISnBibWQ5SUhOMGNtbHVaeUJVYUdVZ2MzUnlhVzVuSUhSdklHWnZjbTFoZEM1Y2JpQWdJQ29nUUhKbGRIVnlibk1nZTNOMGNtbHVaMzBnVkdobElHWnZjbTFoZEhSbFpDQnpkSEpwYm1jdVhHNGdJQ0FxTDF4dUlDQm1kVzVqZEdsdmJpQm1iM0p0WVhRb2MzUnlhVzVuS1NCN1hHNGdJQ0FnYzNSeWFXNW5JRDBnZEhKcGJTaHpkSEpwYm1jcE8xeHVJQ0FnSUhKbGRIVnliaUF2WGlnL09uZGxZazlUZkdrb1B6cFBVM3hRS1NrdkxuUmxjM1FvYzNSeWFXNW5LVnh1SUNBZ0lDQWdQeUJ6ZEhKcGJtZGNiaUFnSUNBZ0lEb2dZMkZ3YVhSaGJHbDZaU2h6ZEhKcGJtY3BPMXh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUVsMFpYSmhkR1Z6SUc5MlpYSWdZVzRnYjJKcVpXTjBKM01nYjNkdUlIQnliM0JsY25ScFpYTXNJR1Y0WldOMWRHbHVaeUIwYUdVZ1lHTmhiR3hpWVdOcllDQm1iM0lnWldGamFDNWNiaUFnSUNwY2JpQWdJQ29nUUhCeWFYWmhkR1ZjYmlBZ0lDb2dRSEJoY21GdElIdFBZbXBsWTNSOUlHOWlhbVZqZENCVWFHVWdiMkpxWldOMElIUnZJR2wwWlhKaGRHVWdiM1psY2k1Y2JpQWdJQ29nUUhCaGNtRnRJSHRHZFc1amRHbHZibjBnWTJGc2JHSmhZMnNnVkdobElHWjFibU4wYVc5dUlHVjRaV04xZEdWa0lIQmxjaUJ2ZDI0Z2NISnZjR1Z5ZEhrdVhHNGdJQ0FxTDF4dUlDQm1kVzVqZEdsdmJpQm1iM0pQZDI0b2IySnFaV04wTENCallXeHNZbUZqYXlrZ2UxeHVJQ0FnSUdadmNpQW9kbUZ5SUd0bGVTQnBiaUJ2WW1wbFkzUXBJSHRjYmlBZ0lDQWdJR2xtSUNob1lYTlBkMjVRY205d1pYSjBlUzVqWVd4c0tHOWlhbVZqZEN3Z2EyVjVLU2tnZTF4dUlDQWdJQ0FnSUNCallXeHNZbUZqYXlodlltcGxZM1JiYTJWNVhTd2dhMlY1TENCdlltcGxZM1FwTzF4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lCSFpYUnpJSFJvWlNCcGJuUmxjbTVoYkNCZ1cxdERiR0Z6YzExZFlDQnZaaUJoSUhaaGJIVmxMbHh1SUNBZ0tseHVJQ0FnS2lCQWNISnBkbUYwWlZ4dUlDQWdLaUJBY0dGeVlXMGdleXA5SUhaaGJIVmxJRlJvWlNCMllXeDFaUzVjYmlBZ0lDb2dRSEpsZEhWeWJuTWdlM04wY21sdVozMGdWR2hsSUdCYlcwTnNZWE56WFYxZ0xseHVJQ0FnS2k5Y2JpQWdablZ1WTNScGIyNGdaMlYwUTJ4aGMzTlBaaWgyWVd4MVpTa2dlMXh1SUNBZ0lISmxkSFZ5YmlCMllXeDFaU0E5UFNCdWRXeHNYRzRnSUNBZ0lDQS9JR05oY0dsMFlXeHBlbVVvZG1Gc2RXVXBYRzRnSUNBZ0lDQTZJSFJ2VTNSeWFXNW5MbU5oYkd3b2RtRnNkV1VwTG5Oc2FXTmxLRGdzSUMweEtUdGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJJYjNOMElHOWlhbVZqZEhNZ1kyRnVJSEpsZEhWeWJpQjBlWEJsSUhaaGJIVmxjeUIwYUdGMElHRnlaU0JrYVdabVpYSmxiblFnWm5KdmJTQjBhR1ZwY2lCaFkzUjFZV3hjYmlBZ0lDb2daR0YwWVNCMGVYQmxMaUJVYUdVZ2IySnFaV04wY3lCM1pTQmhjbVVnWTI5dVkyVnlibVZrSUhkcGRHZ2dkWE4xWVd4c2VTQnlaWFIxY200Z2JtOXVMWEJ5YVcxcGRHbDJaVnh1SUNBZ0tpQjBlWEJsY3lCdlppQmNJbTlpYW1WamRGd2lMQ0JjSW1aMWJtTjBhVzl1WENJc0lHOXlJRndpZFc1cmJtOTNibHdpTGx4dUlDQWdLbHh1SUNBZ0tpQkFjSEpwZG1GMFpWeHVJQ0FnS2lCQWNHRnlZVzBnZXlwOUlHOWlhbVZqZENCVWFHVWdiM2R1WlhJZ2IyWWdkR2hsSUhCeWIzQmxjblI1TGx4dUlDQWdLaUJBY0dGeVlXMGdlM04wY21sdVozMGdjSEp2Y0dWeWRIa2dWR2hsSUhCeWIzQmxjblI1SUhSdklHTm9aV05yTGx4dUlDQWdLaUJBY21WMGRYSnVjeUI3WW05dmJHVmhibjBnVW1WMGRYSnVjeUJnZEhKMVpXQWdhV1lnZEdobElIQnliM0JsY25SNUlIWmhiSFZsSUdseklHRWdibTl1TFhCeWFXMXBkR2wyWlN3Z1pXeHpaU0JnWm1Gc2MyVmdMbHh1SUNBZ0tpOWNiaUFnWm5WdVkzUnBiMjRnYVhOSWIzTjBWSGx3WlNodlltcGxZM1FzSUhCeWIzQmxjblI1S1NCN1hHNGdJQ0FnZG1GeUlIUjVjR1VnUFNCdlltcGxZM1FnSVQwZ2JuVnNiQ0EvSUhSNWNHVnZaaUJ2WW1wbFkzUmJjSEp2Y0dWeWRIbGRJRG9nSjI1MWJXSmxjaWM3WEc0Z0lDQWdjbVYwZFhKdUlDRXZYaWcvT21KdmIyeGxZVzU4Ym5WdFltVnlmSE4wY21sdVozeDFibVJsWm1sdVpXUXBKQzh1ZEdWemRDaDBlWEJsS1NBbUpseHVJQ0FnSUNBZ0tIUjVjR1VnUFQwZ0oyOWlhbVZqZENjZ1B5QWhJVzlpYW1WamRGdHdjbTl3WlhKMGVWMGdPaUIwY25WbEtUdGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJRY21Wd1lYSmxjeUJoSUhOMGNtbHVaeUJtYjNJZ2RYTmxJR2x1SUdFZ1lGSmxaMFY0Y0dBZ1lua2diV0ZyYVc1bklHaDVjR2hsYm5NZ1lXNWtJSE53WVdObGN5QnZjSFJwYjI1aGJDNWNiaUFnSUNwY2JpQWdJQ29nUUhCeWFYWmhkR1ZjYmlBZ0lDb2dRSEJoY21GdElIdHpkSEpwYm1kOUlITjBjbWx1WnlCVWFHVWdjM1J5YVc1bklIUnZJSEYxWVd4cFpua3VYRzRnSUNBcUlFQnlaWFIxY201eklIdHpkSEpwYm1kOUlGUm9aU0J4ZFdGc2FXWnBaV1FnYzNSeWFXNW5MbHh1SUNBZ0tpOWNiaUFnWm5WdVkzUnBiMjRnY1hWaGJHbG1lU2h6ZEhKcGJtY3BJSHRjYmlBZ0lDQnlaWFIxY200Z1UzUnlhVzVuS0hOMGNtbHVaeWt1Y21Wd2JHRmpaU2d2S0ZzZ0xWMHBLRDhoSkNrdlp5d2dKeVF4UHljcE8xeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRUVnWW1GeVpTMWliMjVsY3lCZ1FYSnlZWGtqY21Wa2RXTmxZQ0JzYVd0bElIVjBhV3hwZEhrZ1puVnVZM1JwYjI0dVhHNGdJQ0FxWEc0Z0lDQXFJRUJ3Y21sMllYUmxYRzRnSUNBcUlFQndZWEpoYlNCN1FYSnlZWGw5SUdGeWNtRjVJRlJvWlNCaGNuSmhlU0IwYnlCcGRHVnlZWFJsSUc5MlpYSXVYRzRnSUNBcUlFQndZWEpoYlNCN1JuVnVZM1JwYjI1OUlHTmhiR3hpWVdOcklGUm9aU0JtZFc1amRHbHZiaUJqWVd4c1pXUWdjR1Z5SUdsMFpYSmhkR2x2Ymk1Y2JpQWdJQ29nUUhKbGRIVnlibk1nZXlwOUlGUm9aU0JoWTJOMWJYVnNZWFJsWkNCeVpYTjFiSFF1WEc0Z0lDQXFMMXh1SUNCbWRXNWpkR2x2YmlCeVpXUjFZMlVvWVhKeVlYa3NJR05oYkd4aVlXTnJLU0I3WEc0Z0lDQWdkbUZ5SUdGalkzVnRkV3hoZEc5eUlEMGdiblZzYkR0Y2JpQWdJQ0JsWVdOb0tHRnljbUY1TENCbWRXNWpkR2x2YmloMllXeDFaU3dnYVc1a1pYZ3BJSHRjYmlBZ0lDQWdJR0ZqWTNWdGRXeGhkRzl5SUQwZ1kyRnNiR0poWTJzb1lXTmpkVzExYkdGMGIzSXNJSFpoYkhWbExDQnBibVJsZUN3Z1lYSnlZWGtwTzF4dUlDQWdJSDBwTzF4dUlDQWdJSEpsZEhWeWJpQmhZMk4xYlhWc1lYUnZjanRjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lCU1pXMXZkbVZ6SUd4bFlXUnBibWNnWVc1a0lIUnlZV2xzYVc1bklIZG9hWFJsYzNCaFkyVWdabkp2YlNCaElITjBjbWx1Wnk1Y2JpQWdJQ3BjYmlBZ0lDb2dRSEJ5YVhaaGRHVmNiaUFnSUNvZ1FIQmhjbUZ0SUh0emRISnBibWQ5SUhOMGNtbHVaeUJVYUdVZ2MzUnlhVzVuSUhSdklIUnlhVzB1WEc0Z0lDQXFJRUJ5WlhSMWNtNXpJSHR6ZEhKcGJtZDlJRlJvWlNCMGNtbHRiV1ZrSUhOMGNtbHVaeTVjYmlBZ0lDb3ZYRzRnSUdaMWJtTjBhVzl1SUhSeWFXMG9jM1J5YVc1bktTQjdYRzRnSUNBZ2NtVjBkWEp1SUZOMGNtbHVaeWh6ZEhKcGJtY3BMbkpsY0d4aFkyVW9MMTRnSzN3Z0t5UXZaeXdnSnljcE8xeHVJQ0I5WEc1Y2JpQWdMeW90TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFNvdlhHNWNiaUFnTHlvcVhHNGdJQ0FxSUVOeVpXRjBaWE1nWVNCdVpYY2djR3hoZEdadmNtMGdiMkpxWldOMExseHVJQ0FnS2x4dUlDQWdLaUJBYldWdFltVnlUMllnY0d4aGRHWnZjbTFjYmlBZ0lDb2dRSEJoY21GdElIdFBZbXBsWTNSOGMzUnlhVzVuZlNCYmRXRTlibUYyYVdkaGRHOXlMblZ6WlhKQloyVnVkRjBnVkdobElIVnpaWElnWVdkbGJuUWdjM1J5YVc1bklHOXlYRzRnSUNBcUlDQmpiMjUwWlhoMElHOWlhbVZqZEM1Y2JpQWdJQ29nUUhKbGRIVnlibk1nZTA5aWFtVmpkSDBnUVNCd2JHRjBabTl5YlNCdlltcGxZM1F1WEc0Z0lDQXFMMXh1SUNCbWRXNWpkR2x2YmlCd1lYSnpaU2gxWVNrZ2UxeHVYRzRnSUNBZ0x5b3FJRlJvWlNCbGJuWnBjbTl1YldWdWRDQmpiMjUwWlhoMElHOWlhbVZqZEM0Z0tpOWNiaUFnSUNCMllYSWdZMjl1ZEdWNGRDQTlJSEp2YjNRN1hHNWNiaUFnSUNBdktpb2dWWE5sWkNCMGJ5Qm1iR0ZuSUhkb1pXNGdZU0JqZFhOMGIyMGdZMjl1ZEdWNGRDQnBjeUJ3Y205MmFXUmxaQzRnS2k5Y2JpQWdJQ0IyWVhJZ2FYTkRkWE4wYjIxRGIyNTBaWGgwSUQwZ2RXRWdKaVlnZEhsd1pXOW1JSFZoSUQwOUlDZHZZbXBsWTNRbklDWW1JR2RsZEVOc1lYTnpUMllvZFdFcElDRTlJQ2RUZEhKcGJtY25PMXh1WEc0Z0lDQWdMeThnU25WbloyeGxJR0Z5WjNWdFpXNTBjeTVjYmlBZ0lDQnBaaUFvYVhORGRYTjBiMjFEYjI1MFpYaDBLU0I3WEc0Z0lDQWdJQ0JqYjI1MFpYaDBJRDBnZFdFN1hHNGdJQ0FnSUNCMVlTQTlJRzUxYkd3N1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnTHlvcUlFSnliM2R6WlhJZ2JtRjJhV2RoZEc5eUlHOWlhbVZqZEM0Z0tpOWNiaUFnSUNCMllYSWdibUYySUQwZ1kyOXVkR1Y0ZEM1dVlYWnBaMkYwYjNJZ2ZId2dlMzA3WEc1Y2JpQWdJQ0F2S2lvZ1FuSnZkM05sY2lCMWMyVnlJR0ZuWlc1MElITjBjbWx1Wnk0Z0tpOWNiaUFnSUNCMllYSWdkWE5sY2tGblpXNTBJRDBnYm1GMkxuVnpaWEpCWjJWdWRDQjhmQ0FuSnp0Y2JseHVJQ0FnSUhWaElIeDhJQ2gxWVNBOUlIVnpaWEpCWjJWdWRDazdYRzVjYmlBZ0lDQXZLaW9nVlhObFpDQjBieUJtYkdGbklIZG9aVzRnWUhSb2FYTkNhVzVrYVc1bllDQnBjeUIwYUdVZ1cwMXZaSFZzWlZOamIzQmxYUzRnS2k5Y2JpQWdJQ0IyWVhJZ2FYTk5iMlIxYkdWVFkyOXdaU0E5SUdselEzVnpkRzl0UTI5dWRHVjRkQ0I4ZkNCMGFHbHpRbWx1WkdsdVp5QTlQU0J2YkdSU2IyOTBPMXh1WEc0Z0lDQWdMeW9xSUZWelpXUWdkRzhnWkdWMFpXTjBJR2xtSUdKeWIzZHpaWElnYVhNZ2JHbHJaU0JEYUhKdmJXVXVJQ292WEc0Z0lDQWdkbUZ5SUd4cGEyVkRhSEp2YldVZ1BTQnBjME4xYzNSdmJVTnZiblJsZUhSY2JpQWdJQ0FnSUQ4Z0lTRnVZWFl1YkdsclpVTm9jbTl0WlZ4dUlDQWdJQ0FnT2lBdlhGeGlRMmh5YjIxbFhGeGlMeTUwWlhOMEtIVmhLU0FtSmlBaEwybHVkR1Z5Ym1Gc2ZGeGNiaTlwTG5SbGMzUW9kRzlUZEhKcGJtY3VkRzlUZEhKcGJtY29LU2s3WEc1Y2JpQWdJQ0F2S2lvZ1NXNTBaWEp1WVd3Z1lGdGJRMnhoYzNOZFhXQWdkbUZzZFdVZ2MyaHZjblJqZFhSekxpQXFMMXh1SUNBZ0lIWmhjaUJ2WW1wbFkzUkRiR0Z6Y3lBOUlDZFBZbXBsWTNRbkxGeHVJQ0FnSUNBZ0lDQmhhWEpTZFc1MGFXMWxRMnhoYzNNZ1BTQnBjME4xYzNSdmJVTnZiblJsZUhRZ1B5QnZZbXBsWTNSRGJHRnpjeUE2SUNkVFkzSnBjSFJDY21sa1oybHVaMUJ5YjNoNVQySnFaV04wSnl4Y2JpQWdJQ0FnSUNBZ1pXNTJhWEp2UTJ4aGMzTWdQU0JwYzBOMWMzUnZiVU52Ym5SbGVIUWdQeUJ2WW1wbFkzUkRiR0Z6Y3lBNklDZEZiblpwY205dWJXVnVkQ2NzWEc0Z0lDQWdJQ0FnSUdwaGRtRkRiR0Z6Y3lBOUlDaHBjME4xYzNSdmJVTnZiblJsZUhRZ0ppWWdZMjl1ZEdWNGRDNXFZWFpoS1NBL0lDZEtZWFpoVUdGamEyRm5aU2NnT2lCblpYUkRiR0Z6YzA5bUtHTnZiblJsZUhRdWFtRjJZU2tzWEc0Z0lDQWdJQ0FnSUhCb1lXNTBiMjFEYkdGemN5QTlJR2x6UTNWemRHOXRRMjl1ZEdWNGRDQS9JRzlpYW1WamRFTnNZWE56SURvZ0oxSjFiblJwYldWUFltcGxZM1FuTzF4dVhHNGdJQ0FnTHlvcUlFUmxkR1ZqZENCS1lYWmhJR1Z1ZG1seWIyNXRaVzUwY3k0Z0tpOWNiaUFnSUNCMllYSWdhbUYyWVNBOUlDOWNYR0pLWVhaaEx5NTBaWE4wS0dwaGRtRkRiR0Z6Y3lrZ0ppWWdZMjl1ZEdWNGRDNXFZWFpoTzF4dVhHNGdJQ0FnTHlvcUlFUmxkR1ZqZENCU2FHbHVieTRnS2k5Y2JpQWdJQ0IyWVhJZ2NtaHBibThnUFNCcVlYWmhJQ1ltSUdkbGRFTnNZWE56VDJZb1kyOXVkR1Y0ZEM1bGJuWnBjbTl1YldWdWRDa2dQVDBnWlc1MmFYSnZRMnhoYzNNN1hHNWNiaUFnSUNBdktpb2dRU0JqYUdGeVlXTjBaWElnZEc4Z2NtVndjbVZ6Wlc1MElHRnNjR2hoTGlBcUwxeHVJQ0FnSUhaaGNpQmhiSEJvWVNBOUlHcGhkbUVnUHlBbllTY2dPaUFuWEZ4MU1ETmlNU2M3WEc1Y2JpQWdJQ0F2S2lvZ1FTQmphR0Z5WVdOMFpYSWdkRzhnY21Wd2NtVnpaVzUwSUdKbGRHRXVJQ292WEc0Z0lDQWdkbUZ5SUdKbGRHRWdQU0JxWVhaaElEOGdKMkluSURvZ0oxeGNkVEF6WWpJbk8xeHVYRzRnSUNBZ0x5b3FJRUp5YjNkelpYSWdaRzlqZFcxbGJuUWdiMkpxWldOMExpQXFMMXh1SUNBZ0lIWmhjaUJrYjJNZ1BTQmpiMjUwWlhoMExtUnZZM1Z0Wlc1MElIeDhJSHQ5TzF4dVhHNGdJQ0FnTHlvcVhHNGdJQ0FnSUNvZ1JHVjBaV04wSUU5d1pYSmhJR0p5YjNkelpYSWdLRkJ5WlhOMGJ5MWlZWE5sWkNrdVhHNGdJQ0FnSUNvZ2FIUjBjRG92TDNkM2R5NW9iM2QwYjJOeVpXRjBaUzVqYnk1MWF5OXZjR1Z5WVZOMGRXWm1MMjl3WlhKaFQySnFaV04wTG1oMGJXeGNiaUFnSUNBZ0tpQm9kSFJ3T2k4dlpHVjJMbTl3WlhKaExtTnZiUzloY25ScFkyeGxjeTkyYVdWM0wyOXdaWEpoTFcxcGJta3RkMlZpTFdOdmJuUmxiblF0WVhWMGFHOXlhVzVuTFdkMWFXUmxiR2x1WlhNdkkyOXdaWEpoYldsdWFWeHVJQ0FnSUNBcUwxeHVJQ0FnSUhaaGNpQnZjR1Z5WVNBOUlHTnZiblJsZUhRdWIzQmxjbUZ0YVc1cElIeDhJR052Ym5SbGVIUXViM0JsY21FN1hHNWNiaUFnSUNBdktpb2dUM0JsY21FZ1lGdGJRMnhoYzNOZFhXQXVJQ292WEc0Z0lDQWdkbUZ5SUc5d1pYSmhRMnhoYzNNZ1BTQnlaVTl3WlhKaExuUmxjM1FvYjNCbGNtRkRiR0Z6Y3lBOUlDaHBjME4xYzNSdmJVTnZiblJsZUhRZ0ppWWdiM0JsY21FcElEOGdiM0JsY21GYkoxdGJRMnhoYzNOZFhTZGRJRG9nWjJWMFEyeGhjM05QWmlodmNHVnlZU2twWEc0Z0lDQWdJQ0EvSUc5d1pYSmhRMnhoYzNOY2JpQWdJQ0FnSURvZ0tHOXdaWEpoSUQwZ2JuVnNiQ2s3WEc1Y2JpQWdJQ0F2S2kwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFNvdlhHNWNiaUFnSUNBdktpb2dWR1Z0Y0c5eVlYSjVJSFpoY21saFlteGxJSFZ6WldRZ2IzWmxjaUIwYUdVZ2MyTnlhWEIwSjNNZ2JHbG1aWFJwYldVdUlDb3ZYRzRnSUNBZ2RtRnlJR1JoZEdFN1hHNWNiaUFnSUNBdktpb2dWR2hsSUVOUVZTQmhjbU5vYVhSbFkzUjFjbVV1SUNvdlhHNGdJQ0FnZG1GeUlHRnlZMmdnUFNCMVlUdGNibHh1SUNBZ0lDOHFLaUJRYkdGMFptOXliU0JrWlhOamNtbHdkR2x2YmlCaGNuSmhlUzRnS2k5Y2JpQWdJQ0IyWVhJZ1pHVnpZM0pwY0hScGIyNGdQU0JiWFR0Y2JseHVJQ0FnSUM4cUtpQlFiR0YwWm05eWJTQmhiSEJvWVM5aVpYUmhJR2x1WkdsallYUnZjaTRnS2k5Y2JpQWdJQ0IyWVhJZ2NISmxjbVZzWldGelpTQTlJRzUxYkd3N1hHNWNiaUFnSUNBdktpb2dRU0JtYkdGbklIUnZJR2x1WkdsallYUmxJSFJvWVhRZ1pXNTJhWEp2Ym0xbGJuUWdabVZoZEhWeVpYTWdjMmh2ZFd4a0lHSmxJSFZ6WldRZ2RHOGdjbVZ6YjJ4MlpTQjBhR1VnY0d4aGRHWnZjbTB1SUNvdlhHNGdJQ0FnZG1GeUlIVnpaVVpsWVhSMWNtVnpJRDBnZFdFZ1BUMGdkWE5sY2tGblpXNTBPMXh1WEc0Z0lDQWdMeW9xSUZSb1pTQmljbTkzYzJWeUwyVnVkbWx5YjI1dFpXNTBJSFpsY25OcGIyNHVJQ292WEc0Z0lDQWdkbUZ5SUhabGNuTnBiMjRnUFNCMWMyVkdaV0YwZFhKbGN5QW1KaUJ2Y0dWeVlTQW1KaUIwZVhCbGIyWWdiM0JsY21FdWRtVnljMmx2YmlBOVBTQW5ablZ1WTNScGIyNG5JQ1ltSUc5d1pYSmhMblpsY25OcGIyNG9LVHRjYmx4dUlDQWdJQzhxS2lCQklHWnNZV2NnZEc4Z2FXNWthV05oZEdVZ2FXWWdkR2hsSUU5VElHVnVaSE1nZDJsMGFDQmNJaThnVm1WeWMybHZibHdpSUNvdlhHNGdJQ0FnZG1GeUlHbHpVM0JsWTJsaGJFTmhjMlZrVDFNN1hHNWNiaUFnSUNBdktpQkVaWFJsWTNSaFlteGxJR3hoZVc5MWRDQmxibWRwYm1WeklDaHZjbVJsY2lCcGN5QnBiWEJ2Y25SaGJuUXBMaUFxTDF4dUlDQWdJSFpoY2lCc1lYbHZkWFFnUFNCblpYUk1ZWGx2ZFhRb1cxeHVJQ0FnSUNBZ2V5QW5iR0ZpWld3bk9pQW5SV1JuWlVoVVRVd25MQ0FuY0dGMGRHVnliaWM2SUNkRlpHZGxKeUI5TEZ4dUlDQWdJQ0FnSjFSeWFXUmxiblFuTEZ4dUlDQWdJQ0FnZXlBbmJHRmlaV3duT2lBblYyVmlTMmwwSnl3Z0ozQmhkSFJsY200bk9pQW5RWEJ3YkdWWFpXSkxhWFFuSUgwc1hHNGdJQ0FnSUNBbmFVTmhZaWNzWEc0Z0lDQWdJQ0FuVUhKbGMzUnZKeXhjYmlBZ0lDQWdJQ2RPWlhSR2NtOXVkQ2NzWEc0Z0lDQWdJQ0FuVkdGemJXRnVKeXhjYmlBZ0lDQWdJQ2RMU0ZSTlRDY3NYRzRnSUNBZ0lDQW5SMlZqYTI4blhHNGdJQ0FnWFNrN1hHNWNiaUFnSUNBdktpQkVaWFJsWTNSaFlteGxJR0p5YjNkelpYSWdibUZ0WlhNZ0tHOXlaR1Z5SUdseklHbHRjRzl5ZEdGdWRDa3VJQ292WEc0Z0lDQWdkbUZ5SUc1aGJXVWdQU0JuWlhST1lXMWxLRnRjYmlBZ0lDQWdJQ2RCWkc5aVpTQkJTVkluTEZ4dUlDQWdJQ0FnSjBGeWIzSmhKeXhjYmlBZ0lDQWdJQ2RCZG1GdWRDQkNjbTkzYzJWeUp5eGNiaUFnSUNBZ0lDZENjbVZoWTJnbkxGeHVJQ0FnSUNBZ0owTmhiV2x1Ynljc1hHNGdJQ0FnSUNBblJXeGxZM1J5YjI0bkxGeHVJQ0FnSUNBZ0owVndhWEJvWVc1NUp5eGNiaUFnSUNBZ0lDZEdaVzV1WldNbkxGeHVJQ0FnSUNBZ0owWnNiMk5ySnl4Y2JpQWdJQ0FnSUNkSFlXeGxiMjRuTEZ4dUlDQWdJQ0FnSjBkeVpXVnVRbkp2ZDNObGNpY3NYRzRnSUNBZ0lDQW5hVU5oWWljc1hHNGdJQ0FnSUNBblNXTmxkMlZoYzJWc0p5eGNiaUFnSUNBZ0lDZExMVTFsYkdWdmJpY3NYRzRnSUNBZ0lDQW5TMjl1Y1hWbGNtOXlKeXhjYmlBZ0lDQWdJQ2RNZFc1aGMyTmhjR1VuTEZ4dUlDQWdJQ0FnSjAxaGVIUm9iMjRuTEZ4dUlDQWdJQ0FnZXlBbmJHRmlaV3duT2lBblRXbGpjbTl6YjJaMElFVmtaMlVuTENBbmNHRjBkR1Z5YmljNklDZEZaR2RsSnlCOUxGeHVJQ0FnSUNBZ0owMXBaRzl5YVNjc1hHNGdJQ0FnSUNBblRtOXZheUJDY205M2MyVnlKeXhjYmlBZ0lDQWdJQ2RRWVd4bFRXOXZiaWNzWEc0Z0lDQWdJQ0FuVUdoaGJuUnZiVXBUSnl4Y2JpQWdJQ0FnSUNkU1lYWmxiaWNzWEc0Z0lDQWdJQ0FuVW1WcmIyNXhKeXhjYmlBZ0lDQWdJQ2RTYjJOclRXVnNkQ2NzWEc0Z0lDQWdJQ0I3SUNkc1lXSmxiQ2M2SUNkVFlXMXpkVzVuSUVsdWRHVnlibVYwSnl3Z0ozQmhkSFJsY200bk9pQW5VMkZ0YzNWdVowSnliM2R6WlhJbklIMHNYRzRnSUNBZ0lDQW5VMlZoVFc5dWEyVjVKeXhjYmlBZ0lDQWdJSHNnSjJ4aFltVnNKem9nSjFOcGJHc25MQ0FuY0dGMGRHVnliaWM2SUNjb1B6cERiRzkxWkRsOFUybHNheTFCWTJObGJHVnlZWFJsWkNrbklIMHNYRzRnSUNBZ0lDQW5VMnhsYVhCdWFYSW5MRnh1SUNBZ0lDQWdKMU5zYVcxQ2NtOTNjMlZ5Snl4Y2JpQWdJQ0FnSUhzZ0oyeGhZbVZzSnpvZ0oxTlNWMkZ5WlNCSmNtOXVKeXdnSjNCaGRIUmxjbTRuT2lBblNYSnZiaWNnZlN4Y2JpQWdJQ0FnSUNkVGRXNXlhWE5sSnl4Y2JpQWdJQ0FnSUNkVGQybG1kR1p2ZUNjc1hHNGdJQ0FnSUNBblYyRjBaWEptYjNnbkxGeHVJQ0FnSUNBZ0oxZGxZbEJ2YzJsMGFYWmxKeXhjYmlBZ0lDQWdJQ2RQY0dWeVlTQk5hVzVwSnl4Y2JpQWdJQ0FnSUhzZ0oyeGhZbVZzSnpvZ0owOXdaWEpoSUUxcGJta25MQ0FuY0dGMGRHVnliaWM2SUNkUFVHbFBVeWNnZlN4Y2JpQWdJQ0FnSUNkUGNHVnlZU2NzWEc0Z0lDQWdJQ0I3SUNkc1lXSmxiQ2M2SUNkUGNHVnlZU2NzSUNkd1lYUjBaWEp1SnpvZ0owOVFVaWNnZlN4Y2JpQWdJQ0FnSUNkRGFISnZiV1VuTEZ4dUlDQWdJQ0FnZXlBbmJHRmlaV3duT2lBblEyaHliMjFsSUUxdlltbHNaU2NzSUNkd1lYUjBaWEp1SnpvZ0p5Zy9Pa055YVU5VGZFTnlUVzhwSnlCOUxGeHVJQ0FnSUNBZ2V5QW5iR0ZpWld3bk9pQW5SbWx5WldadmVDY3NJQ2R3WVhSMFpYSnVKem9nSnlnL09rWnBjbVZtYjNoOFRXbHVaV1pwWld4a0tTY2dmU3hjYmlBZ0lDQWdJSHNnSjJ4aFltVnNKem9nSjBacGNtVm1iM2dnWm05eUlHbFBVeWNzSUNkd1lYUjBaWEp1SnpvZ0owWjRhVTlUSnlCOUxGeHVJQ0FnSUNBZ2V5QW5iR0ZpWld3bk9pQW5TVVVuTENBbmNHRjBkR1Z5YmljNklDZEpSVTF2WW1sc1pTY2dmU3hjYmlBZ0lDQWdJSHNnSjJ4aFltVnNKem9nSjBsRkp5d2dKM0JoZEhSbGNtNG5PaUFuVFZOSlJTY2dmU3hjYmlBZ0lDQWdJQ2RUWVdaaGNta25YRzRnSUNBZ1hTazdYRzVjYmlBZ0lDQXZLaUJFWlhSbFkzUmhZbXhsSUhCeWIyUjFZM1J6SUNodmNtUmxjaUJwY3lCcGJYQnZjblJoYm5RcExpQXFMMXh1SUNBZ0lIWmhjaUJ3Y205a2RXTjBJRDBnWjJWMFVISnZaSFZqZENoYlhHNGdJQ0FnSUNCN0lDZHNZV0psYkNjNklDZENiR0ZqYTBKbGNuSjVKeXdnSjNCaGRIUmxjbTRuT2lBblFrSXhNQ2NnZlN4Y2JpQWdJQ0FnSUNkQ2JHRmphMEpsY25KNUp5eGNiaUFnSUNBZ0lIc2dKMnhoWW1Wc0p6b2dKMGRoYkdGNGVTQlRKeXdnSjNCaGRIUmxjbTRuT2lBblIxUXRTVGt3TURBbklIMHNYRzRnSUNBZ0lDQjdJQ2RzWVdKbGJDYzZJQ2RIWVd4aGVIa2dVekluTENBbmNHRjBkR1Z5YmljNklDZEhWQzFKT1RFd01DY2dmU3hjYmlBZ0lDQWdJSHNnSjJ4aFltVnNKem9nSjBkaGJHRjRlU0JUTXljc0lDZHdZWFIwWlhKdUp6b2dKMGRVTFVrNU16QXdKeUI5TEZ4dUlDQWdJQ0FnZXlBbmJHRmlaV3duT2lBblIyRnNZWGg1SUZNMEp5d2dKM0JoZEhSbGNtNG5PaUFuUjFRdFNUazFNREFuSUgwc1hHNGdJQ0FnSUNCN0lDZHNZV0psYkNjNklDZEhZV3hoZUhrZ1V6VW5MQ0FuY0dGMGRHVnliaWM2SUNkVFRTMUhPVEF3SnlCOUxGeHVJQ0FnSUNBZ2V5QW5iR0ZpWld3bk9pQW5SMkZzWVhoNUlGTTJKeXdnSjNCaGRIUmxjbTRuT2lBblUwMHRSemt5TUNjZ2ZTeGNiaUFnSUNBZ0lIc2dKMnhoWW1Wc0p6b2dKMGRoYkdGNGVTQlROaUJGWkdkbEp5d2dKM0JoZEhSbGNtNG5PaUFuVTAwdFJ6a3lOU2NnZlN4Y2JpQWdJQ0FnSUhzZ0oyeGhZbVZzSnpvZ0owZGhiR0Y0ZVNCVE55Y3NJQ2R3WVhSMFpYSnVKem9nSjFOTkxVYzVNekFuSUgwc1hHNGdJQ0FnSUNCN0lDZHNZV0psYkNjNklDZEhZV3hoZUhrZ1V6Y2dSV1JuWlNjc0lDZHdZWFIwWlhKdUp6b2dKMU5OTFVjNU16VW5JSDBzWEc0Z0lDQWdJQ0FuUjI5dloyeGxJRlJXSnl4Y2JpQWdJQ0FnSUNkTWRXMXBZU2NzWEc0Z0lDQWdJQ0FuYVZCaFpDY3NYRzRnSUNBZ0lDQW5hVkJ2WkNjc1hHNGdJQ0FnSUNBbmFWQm9iMjVsSnl4Y2JpQWdJQ0FnSUNkTGFXNWtiR1VuTEZ4dUlDQWdJQ0FnZXlBbmJHRmlaV3duT2lBblMybHVaR3hsSUVacGNtVW5MQ0FuY0dGMGRHVnliaWM2SUNjb1B6cERiRzkxWkRsOFUybHNheTFCWTJObGJHVnlZWFJsWkNrbklIMHNYRzRnSUNBZ0lDQW5UbVY0ZFhNbkxGeHVJQ0FnSUNBZ0owNXZiMnNuTEZ4dUlDQWdJQ0FnSjFCc1lYbENiMjlySnl4Y2JpQWdJQ0FnSUNkUWJHRjVVM1JoZEdsdmJpQldhWFJoSnl4Y2JpQWdJQ0FnSUNkUWJHRjVVM1JoZEdsdmJpY3NYRzRnSUNBZ0lDQW5WRzkxWTJoUVlXUW5MRnh1SUNBZ0lDQWdKMVJ5WVc1elptOXliV1Z5Snl4Y2JpQWdJQ0FnSUhzZ0oyeGhZbVZzSnpvZ0oxZHBhU0JWSnl3Z0ozQmhkSFJsY200bk9pQW5WMmxwVlNjZ2ZTeGNiaUFnSUNBZ0lDZFhhV2tuTEZ4dUlDQWdJQ0FnSjFoaWIzZ2dUMjVsSnl4Y2JpQWdJQ0FnSUhzZ0oyeGhZbVZzSnpvZ0oxaGliM2dnTXpZd0p5d2dKM0JoZEhSbGNtNG5PaUFuV0dKdmVDY2dmU3hjYmlBZ0lDQWdJQ2RZYjI5dEoxeHVJQ0FnSUYwcE8xeHVYRzRnSUNBZ0x5b2dSR1YwWldOMFlXSnNaU0J0WVc1MVptRmpkSFZ5WlhKekxpQXFMMXh1SUNBZ0lIWmhjaUJ0WVc1MVptRmpkSFZ5WlhJZ1BTQm5aWFJOWVc1MVptRmpkSFZ5WlhJb2UxeHVJQ0FnSUNBZ0owRndjR3hsSnpvZ2V5QW5hVkJoWkNjNklERXNJQ2RwVUdodmJtVW5PaUF4TENBbmFWQnZaQ2M2SURFZ2ZTeGNiaUFnSUNBZ0lDZEJjbU5vYjNNbk9pQjdmU3hjYmlBZ0lDQWdJQ2RCYldGNmIyNG5PaUI3SUNkTGFXNWtiR1VuT2lBeExDQW5TMmx1Wkd4bElFWnBjbVVuT2lBeElIMHNYRzRnSUNBZ0lDQW5RWE4xY3ljNklIc2dKMVJ5WVc1elptOXliV1Z5SnpvZ01TQjlMRnh1SUNBZ0lDQWdKMEpoY201bGN5QW1JRTV2WW14bEp6b2dleUFuVG05dmF5YzZJREVnZlN4Y2JpQWdJQ0FnSUNkQ2JHRmphMEpsY25KNUp6b2dleUFuVUd4aGVVSnZiMnNuT2lBeElIMHNYRzRnSUNBZ0lDQW5SMjl2WjJ4bEp6b2dleUFuUjI5dloyeGxJRlJXSnpvZ01Td2dKMDVsZUhWekp6b2dNU0I5TEZ4dUlDQWdJQ0FnSjBoUUp6b2dleUFuVkc5MVkyaFFZV1FuT2lBeElIMHNYRzRnSUNBZ0lDQW5TRlJESnpvZ2UzMHNYRzRnSUNBZ0lDQW5URWNuT2lCN2ZTeGNiaUFnSUNBZ0lDZE5hV055YjNOdlpuUW5PaUI3SUNkWVltOTRKem9nTVN3Z0oxaGliM2dnVDI1bEp6b2dNU0I5TEZ4dUlDQWdJQ0FnSjAxdmRHOXliMnhoSnpvZ2V5QW5XRzl2YlNjNklERWdmU3hjYmlBZ0lDQWdJQ2RPYVc1MFpXNWtieWM2SUhzZ0oxZHBhU0JWSnpvZ01Td2dJQ2RYYVdrbk9pQXhJSDBzWEc0Z0lDQWdJQ0FuVG05cmFXRW5PaUI3SUNkTWRXMXBZU2M2SURFZ2ZTeGNiaUFnSUNBZ0lDZFRZVzF6ZFc1bkp6b2dleUFuUjJGc1lYaDVJRk1uT2lBeExDQW5SMkZzWVhoNUlGTXlKem9nTVN3Z0owZGhiR0Y0ZVNCVE15YzZJREVzSUNkSFlXeGhlSGtnVXpRbk9pQXhJSDBzWEc0Z0lDQWdJQ0FuVTI5dWVTYzZJSHNnSjFCc1lYbFRkR0YwYVc5dUp6b2dNU3dnSjFCc1lYbFRkR0YwYVc5dUlGWnBkR0VuT2lBeElIMWNiaUFnSUNCOUtUdGNibHh1SUNBZ0lDOHFJRVJsZEdWamRHRmliR1VnYjNCbGNtRjBhVzVuSUhONWMzUmxiWE1nS0c5eVpHVnlJR2x6SUdsdGNHOXlkR0Z1ZENrdUlDb3ZYRzRnSUNBZ2RtRnlJRzl6SUQwZ1oyVjBUMU1vVzF4dUlDQWdJQ0FnSjFkcGJtUnZkM01nVUdodmJtVW5MRnh1SUNBZ0lDQWdKMEZ1WkhKdmFXUW5MRnh1SUNBZ0lDQWdKME5sYm5SUFV5Y3NYRzRnSUNBZ0lDQjdJQ2RzWVdKbGJDYzZJQ2REYUhKdmJXVWdUMU1uTENBbmNHRjBkR1Z5YmljNklDZERjazlUSnlCOUxGeHVJQ0FnSUNBZ0owUmxZbWxoYmljc1hHNGdJQ0FnSUNBblJtVmtiM0poSnl4Y2JpQWdJQ0FnSUNkR2NtVmxRbE5FSnl4Y2JpQWdJQ0FnSUNkSFpXNTBiMjhuTEZ4dUlDQWdJQ0FnSjBoaGFXdDFKeXhjYmlBZ0lDQWdJQ2RMZFdKMWJuUjFKeXhjYmlBZ0lDQWdJQ2RNYVc1MWVDQk5hVzUwSnl4Y2JpQWdJQ0FnSUNkUGNHVnVRbE5FSnl4Y2JpQWdJQ0FnSUNkU1pXUWdTR0YwSnl4Y2JpQWdJQ0FnSUNkVGRWTkZKeXhjYmlBZ0lDQWdJQ2RWWW5WdWRIVW5MRnh1SUNBZ0lDQWdKMWgxWW5WdWRIVW5MRnh1SUNBZ0lDQWdKME41WjNkcGJpY3NYRzRnSUNBZ0lDQW5VM2x0WW1saGJpQlBVeWNzWEc0Z0lDQWdJQ0FuYUhCM1QxTW5MRnh1SUNBZ0lDQWdKM2RsWWs5VElDY3NYRzRnSUNBZ0lDQW5kMlZpVDFNbkxGeHVJQ0FnSUNBZ0oxUmhZbXhsZENCUFV5Y3NYRzRnSUNBZ0lDQW5WR2w2Wlc0bkxGeHVJQ0FnSUNBZ0oweHBiblY0Snl4Y2JpQWdJQ0FnSUNkTllXTWdUMU1nV0Njc1hHNGdJQ0FnSUNBblRXRmphVzUwYjNOb0p5eGNiaUFnSUNBZ0lDZE5ZV01uTEZ4dUlDQWdJQ0FnSjFkcGJtUnZkM01nT1RnN0p5eGNiaUFnSUNBZ0lDZFhhVzVrYjNkeklDZGNiaUFnSUNCZEtUdGNibHh1SUNBZ0lDOHFMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRLaTljYmx4dUlDQWdJQzhxS2x4dUlDQWdJQ0FxSUZCcFkydHpJSFJvWlNCc1lYbHZkWFFnWlc1bmFXNWxJR1p5YjIwZ1lXNGdZWEp5WVhrZ2IyWWdaM1ZsYzNObGN5NWNiaUFnSUNBZ0tseHVJQ0FnSUNBcUlFQndjbWwyWVhSbFhHNGdJQ0FnSUNvZ1FIQmhjbUZ0SUh0QmNuSmhlWDBnWjNWbGMzTmxjeUJCYmlCaGNuSmhlU0J2WmlCbmRXVnpjMlZ6TGx4dUlDQWdJQ0FxSUVCeVpYUjFjbTV6SUh0dWRXeHNmSE4wY21sdVozMGdWR2hsSUdSbGRHVmpkR1ZrSUd4aGVXOTFkQ0JsYm1kcGJtVXVYRzRnSUNBZ0lDb3ZYRzRnSUNBZ1puVnVZM1JwYjI0Z1oyVjBUR0Y1YjNWMEtHZDFaWE56WlhNcElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCeVpXUjFZMlVvWjNWbGMzTmxjeXdnWm5WdVkzUnBiMjRvY21WemRXeDBMQ0JuZFdWemN5a2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdjbVZ6ZFd4MElIeDhJRkpsWjBWNGNDZ25YRnhjWEdJbklDc2dLRnh1SUNBZ0lDQWdJQ0FnSUdkMVpYTnpMbkJoZEhSbGNtNGdmSHdnY1hWaGJHbG1lU2huZFdWemN5bGNiaUFnSUNBZ0lDQWdLU0FySUNkY1hGeGNZaWNzSUNkcEp5a3VaWGhsWXloMVlTa2dKaVlnS0dkMVpYTnpMbXhoWW1Wc0lIeDhJR2QxWlhOektUdGNiaUFnSUNBZ0lIMHBPMXh1SUNBZ0lIMWNibHh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRkJwWTJ0eklIUm9aU0J0WVc1MVptRmpkSFZ5WlhJZ1puSnZiU0JoYmlCaGNuSmhlU0J2WmlCbmRXVnpjMlZ6TGx4dUlDQWdJQ0FxWEc0Z0lDQWdJQ29nUUhCeWFYWmhkR1ZjYmlBZ0lDQWdLaUJBY0dGeVlXMGdlMEZ5Y21GNWZTQm5kV1Z6YzJWeklFRnVJRzlpYW1WamRDQnZaaUJuZFdWemMyVnpMbHh1SUNBZ0lDQXFJRUJ5WlhSMWNtNXpJSHR1ZFd4c2ZITjBjbWx1WjMwZ1ZHaGxJR1JsZEdWamRHVmtJRzFoYm5WbVlXTjBkWEpsY2k1Y2JpQWdJQ0FnS2k5Y2JpQWdJQ0JtZFc1amRHbHZiaUJuWlhSTllXNTFabUZqZEhWeVpYSW9aM1ZsYzNObGN5a2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlISmxaSFZqWlNobmRXVnpjMlZ6TENCbWRXNWpkR2x2YmloeVpYTjFiSFFzSUhaaGJIVmxMQ0JyWlhrcElIdGNiaUFnSUNBZ0lDQWdMeThnVEc5dmEzVndJSFJvWlNCdFlXNTFabUZqZEhWeVpYSWdZbmtnY0hKdlpIVmpkQ0J2Y2lCelkyRnVJSFJvWlNCVlFTQm1iM0lnZEdobElHMWhiblZtWVdOMGRYSmxjaTVjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJSEpsYzNWc2RDQjhmQ0FvWEc0Z0lDQWdJQ0FnSUNBZ2RtRnNkV1ZiY0hKdlpIVmpkRjBnZkh4Y2JpQWdJQ0FnSUNBZ0lDQjJZV3gxWlZzdlhsdGhMWHBkS3lnL09pQXJXMkV0ZWwwclhGeGlLU292YVM1bGVHVmpLSEJ5YjJSMVkzUXBYU0I4ZkZ4dUlDQWdJQ0FnSUNBZ0lGSmxaMFY0Y0NnblhGeGNYR0luSUNzZ2NYVmhiR2xtZVNoclpYa3BJQ3NnSnlnL09seGNYRnhpZkZ4Y1hGeDNLbHhjWEZ4a0tTY3NJQ2RwSnlrdVpYaGxZeWgxWVNsY2JpQWdJQ0FnSUNBZ0tTQW1KaUJyWlhrN1hHNGdJQ0FnSUNCOUtUdGNiaUFnSUNCOVhHNWNiaUFnSUNBdktpcGNiaUFnSUNBZ0tpQlFhV05yY3lCMGFHVWdZbkp2ZDNObGNpQnVZVzFsSUdaeWIyMGdZVzRnWVhKeVlYa2diMllnWjNWbGMzTmxjeTVjYmlBZ0lDQWdLbHh1SUNBZ0lDQXFJRUJ3Y21sMllYUmxYRzRnSUNBZ0lDb2dRSEJoY21GdElIdEJjbkpoZVgwZ1ozVmxjM05sY3lCQmJpQmhjbkpoZVNCdlppQm5kV1Z6YzJWekxseHVJQ0FnSUNBcUlFQnlaWFIxY201eklIdHVkV3hzZkhOMGNtbHVaMzBnVkdobElHUmxkR1ZqZEdWa0lHSnliM2R6WlhJZ2JtRnRaUzVjYmlBZ0lDQWdLaTljYmlBZ0lDQm1kVzVqZEdsdmJpQm5aWFJPWVcxbEtHZDFaWE56WlhNcElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCeVpXUjFZMlVvWjNWbGMzTmxjeXdnWm5WdVkzUnBiMjRvY21WemRXeDBMQ0JuZFdWemN5a2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdjbVZ6ZFd4MElIeDhJRkpsWjBWNGNDZ25YRnhjWEdJbklDc2dLRnh1SUNBZ0lDQWdJQ0FnSUdkMVpYTnpMbkJoZEhSbGNtNGdmSHdnY1hWaGJHbG1lU2huZFdWemN5bGNiaUFnSUNBZ0lDQWdLU0FySUNkY1hGeGNZaWNzSUNkcEp5a3VaWGhsWXloMVlTa2dKaVlnS0dkMVpYTnpMbXhoWW1Wc0lIeDhJR2QxWlhOektUdGNiaUFnSUNBZ0lIMHBPMXh1SUNBZ0lIMWNibHh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRkJwWTJ0eklIUm9aU0JQVXlCdVlXMWxJR1p5YjIwZ1lXNGdZWEp5WVhrZ2IyWWdaM1ZsYzNObGN5NWNiaUFnSUNBZ0tseHVJQ0FnSUNBcUlFQndjbWwyWVhSbFhHNGdJQ0FnSUNvZ1FIQmhjbUZ0SUh0QmNuSmhlWDBnWjNWbGMzTmxjeUJCYmlCaGNuSmhlU0J2WmlCbmRXVnpjMlZ6TGx4dUlDQWdJQ0FxSUVCeVpYUjFjbTV6SUh0dWRXeHNmSE4wY21sdVozMGdWR2hsSUdSbGRHVmpkR1ZrSUU5VElHNWhiV1V1WEc0Z0lDQWdJQ292WEc0Z0lDQWdablZ1WTNScGIyNGdaMlYwVDFNb1ozVmxjM05sY3lrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUhKbFpIVmpaU2huZFdWemMyVnpMQ0JtZFc1amRHbHZiaWh5WlhOMWJIUXNJR2QxWlhOektTQjdYRzRnSUNBZ0lDQWdJSFpoY2lCd1lYUjBaWEp1SUQwZ1ozVmxjM011Y0dGMGRHVnliaUI4ZkNCeGRXRnNhV1o1S0dkMVpYTnpLVHRjYmlBZ0lDQWdJQ0FnYVdZZ0tDRnlaWE4xYkhRZ0ppWWdLSEpsYzNWc2RDQTlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lGSmxaMFY0Y0NnblhGeGNYR0luSUNzZ2NHRjBkR1Z5YmlBcklDY29Qem92VzF4Y1hGeGtMbDByZkZzZ1hGeGNYSGN1WFNvcEp5d2dKMmtuS1M1bGVHVmpLSFZoS1Z4dUlDQWdJQ0FnSUNBZ0lDQWdLU2tnZTF4dUlDQWdJQ0FnSUNBZ0lISmxjM1ZzZENBOUlHTnNaV0Z1ZFhCUFV5aHlaWE4xYkhRc0lIQmhkSFJsY200c0lHZDFaWE56TG14aFltVnNJSHg4SUdkMVpYTnpLVHRjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnY21WemRXeDBPMXh1SUNBZ0lDQWdmU2s3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdMeW9xWEc0Z0lDQWdJQ29nVUdsamEzTWdkR2hsSUhCeWIyUjFZM1FnYm1GdFpTQm1jbTl0SUdGdUlHRnljbUY1SUc5bUlHZDFaWE56WlhNdVhHNGdJQ0FnSUNwY2JpQWdJQ0FnS2lCQWNISnBkbUYwWlZ4dUlDQWdJQ0FxSUVCd1lYSmhiU0I3UVhKeVlYbDlJR2QxWlhOelpYTWdRVzRnWVhKeVlYa2diMllnWjNWbGMzTmxjeTVjYmlBZ0lDQWdLaUJBY21WMGRYSnVjeUI3Ym5Wc2JIeHpkSEpwYm1kOUlGUm9aU0JrWlhSbFkzUmxaQ0J3Y205a2RXTjBJRzVoYldVdVhHNGdJQ0FnSUNvdlhHNGdJQ0FnWm5WdVkzUnBiMjRnWjJWMFVISnZaSFZqZENobmRXVnpjMlZ6S1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnY21Wa2RXTmxLR2QxWlhOelpYTXNJR1oxYm1OMGFXOXVLSEpsYzNWc2RDd2daM1ZsYzNNcElIdGNiaUFnSUNBZ0lDQWdkbUZ5SUhCaGRIUmxjbTRnUFNCbmRXVnpjeTV3WVhSMFpYSnVJSHg4SUhGMVlXeHBabmtvWjNWbGMzTXBPMXh1SUNBZ0lDQWdJQ0JwWmlBb0lYSmxjM1ZzZENBbUppQW9jbVZ6ZFd4MElEMWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ1VtVm5SWGh3S0NkY1hGeGNZaWNnS3lCd1lYUjBaWEp1SUNzZ0p5QXFYRnhjWEdRcld5NWNYRnhjZDE5ZEtpY3NJQ2RwSnlrdVpYaGxZeWgxWVNrZ2ZIeGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ1VtVm5SWGh3S0NkY1hGeGNZaWNnS3lCd1lYUjBaWEp1SUNzZ0p5QXFYRnhjWEhjckxWdGNYRnhjZDEwcUp5d2dKMmtuS1M1bGVHVmpLSFZoS1NCOGZGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCU1pXZEZlSEFvSjF4Y1hGeGlKeUFySUhCaGRIUmxjbTRnS3lBbktEODZPeUFxS0Q4NlcyRXRlbDByVzE4dFhTay9XMkV0ZWwwclhGeGNYR1FyZkZ0ZUlDZ3BPeTFkS2lrbkxDQW5hU2NwTG1WNFpXTW9kV0VwWEc0Z0lDQWdJQ0FnSUNBZ0lDQXBLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0x5OGdVM0JzYVhRZ1lua2dabTl5ZDJGeVpDQnpiR0Z6YUNCaGJtUWdZWEJ3Wlc1a0lIQnliMlIxWTNRZ2RtVnljMmx2YmlCcFppQnVaV1ZrWldRdVhHNGdJQ0FnSUNBZ0lDQWdhV1lnS0NoeVpYTjFiSFFnUFNCVGRISnBibWNvS0dkMVpYTnpMbXhoWW1Wc0lDWW1JQ0ZTWldkRmVIQW9jR0YwZEdWeWJpd2dKMmtuS1M1MFpYTjBLR2QxWlhOekxteGhZbVZzS1NrZ1B5Qm5kV1Z6Y3k1c1lXSmxiQ0E2SUhKbGMzVnNkQ2t1YzNCc2FYUW9KeThuS1NsYk1WMGdKaVlnSVM5YlhGeGtMbDByTHk1MFpYTjBLSEpsYzNWc2RGc3dYU2twSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJSEpsYzNWc2RGc3dYU0FyUFNBbklDY2dLeUJ5WlhOMWJIUmJNVjA3WEc0Z0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQWdJQzh2SUVOdmNuSmxZM1FnWTJoaGNtRmpkR1Z5SUdOaGMyVWdZVzVrSUdOc1pXRnVkWEFnYzNSeWFXNW5MbHh1SUNBZ0lDQWdJQ0FnSUdkMVpYTnpJRDBnWjNWbGMzTXViR0ZpWld3Z2ZId2daM1ZsYzNNN1hHNGdJQ0FnSUNBZ0lDQWdjbVZ6ZFd4MElEMGdabTl5YldGMEtISmxjM1ZzZEZzd1hWeHVJQ0FnSUNBZ0lDQWdJQ0FnTG5KbGNHeGhZMlVvVW1WblJYaHdLSEJoZEhSbGNtNHNJQ2RwSnlrc0lHZDFaWE56S1Z4dUlDQWdJQ0FnSUNBZ0lDQWdMbkpsY0d4aFkyVW9VbVZuUlhod0tDYzdJQ29vUHpvbklDc2daM1ZsYzNNZ0t5QW5XMTh0WFNrL0p5d2dKMmtuS1N3Z0p5QW5LVnh1SUNBZ0lDQWdJQ0FnSUNBZ0xuSmxjR3hoWTJVb1VtVm5SWGh3S0Njb0p5QXJJR2QxWlhOeklDc2dKeWxiTFY4dVhUOG9YRnhjWEhjcEp5d2dKMmtuS1N3Z0p5UXhJQ1F5SnlrcE8xeHVJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQnlaWE4xYkhRN1hHNGdJQ0FnSUNCOUtUdGNiaUFnSUNCOVhHNWNiaUFnSUNBdktpcGNiaUFnSUNBZ0tpQlNaWE52YkhabGN5QjBhR1VnZG1WeWMybHZiaUIxYzJsdVp5QmhiaUJoY25KaGVTQnZaaUJWUVNCd1lYUjBaWEp1Y3k1Y2JpQWdJQ0FnS2x4dUlDQWdJQ0FxSUVCd2NtbDJZWFJsWEc0Z0lDQWdJQ29nUUhCaGNtRnRJSHRCY25KaGVYMGdjR0YwZEdWeWJuTWdRVzRnWVhKeVlYa2diMllnVlVFZ2NHRjBkR1Z5Ym5NdVhHNGdJQ0FnSUNvZ1FISmxkSFZ5Ym5NZ2UyNTFiR3g4YzNSeWFXNW5mU0JVYUdVZ1pHVjBaV04wWldRZ2RtVnljMmx2Ymk1Y2JpQWdJQ0FnS2k5Y2JpQWdJQ0JtZFc1amRHbHZiaUJuWlhSV1pYSnphVzl1S0hCaGRIUmxjbTV6S1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnY21Wa2RXTmxLSEJoZEhSbGNtNXpMQ0JtZFc1amRHbHZiaWh5WlhOMWJIUXNJSEJoZEhSbGNtNHBJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJSEpsYzNWc2RDQjhmQ0FvVW1WblJYaHdLSEJoZEhSbGNtNGdLMXh1SUNBZ0lDQWdJQ0FnSUNjb1B6b3RXMXhjWEZ4a0xsMHJMM3dvUHpvZ1ptOXlJRnRjWEZ4Y2R5MWRLeWsvV3lBdkxWMHBLRnRjWEZ4Y1pDNWRLMXRlSUNncE95OWZMVjBxS1Njc0lDZHBKeWt1WlhobFl5aDFZU2tnZkh3Z01DbGJNVjBnZkh3Z2JuVnNiRHRjYmlBZ0lDQWdJSDBwTzF4dUlDQWdJSDFjYmx4dUlDQWdJQzhxS2x4dUlDQWdJQ0FxSUZKbGRIVnlibk1nWUhCc1lYUm1iM0p0TG1SbGMyTnlhWEIwYVc5dVlDQjNhR1Z1SUhSb1pTQndiR0YwWm05eWJTQnZZbXBsWTNRZ2FYTWdZMjlsY21ObFpDQjBieUJoSUhOMGNtbHVaeTVjYmlBZ0lDQWdLbHh1SUNBZ0lDQXFJRUJ1WVcxbElIUnZVM1J5YVc1blhHNGdJQ0FnSUNvZ1FHMWxiV0psY2s5bUlIQnNZWFJtYjNKdFhHNGdJQ0FnSUNvZ1FISmxkSFZ5Ym5NZ2UzTjBjbWx1WjMwZ1VtVjBkWEp1Y3lCZ2NHeGhkR1p2Y20wdVpHVnpZM0pwY0hScGIyNWdJR2xtSUdGMllXbHNZV0pzWlN3Z1pXeHpaU0JoYmlCbGJYQjBlU0J6ZEhKcGJtY3VYRzRnSUNBZ0lDb3ZYRzRnSUNBZ1puVnVZM1JwYjI0Z2RHOVRkSEpwYm1kUWJHRjBabTl5YlNncElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCMGFHbHpMbVJsYzJOeWFYQjBhVzl1SUh4OElDY25PMXh1SUNBZ0lIMWNibHh1SUNBZ0lDOHFMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRLaTljYmx4dUlDQWdJQzh2SUVOdmJuWmxjblFnYkdGNWIzVjBJSFJ2SUdGdUlHRnljbUY1SUhOdklIZGxJR05oYmlCaFpHUWdaWGgwY21FZ1pHVjBZV2xzY3k1Y2JpQWdJQ0JzWVhsdmRYUWdKaVlnS0d4aGVXOTFkQ0E5SUZ0c1lYbHZkWFJkS1R0Y2JseHVJQ0FnSUM4dklFUmxkR1ZqZENCd2NtOWtkV04wSUc1aGJXVnpJSFJvWVhRZ1kyOXVkR0ZwYmlCMGFHVnBjaUJ0WVc1MVptRmpkSFZ5WlhJbmN5QnVZVzFsTGx4dUlDQWdJR2xtSUNodFlXNTFabUZqZEhWeVpYSWdKaVlnSVhCeWIyUjFZM1FwSUh0Y2JpQWdJQ0FnSUhCeWIyUjFZM1FnUFNCblpYUlFjbTlrZFdOMEtGdHRZVzUxWm1GamRIVnlaWEpkS1R0Y2JpQWdJQ0I5WEc0Z0lDQWdMeThnUTJ4bFlXNGdkWEFnUjI5dloyeGxJRlJXTGx4dUlDQWdJR2xtSUNnb1pHRjBZU0E5SUM5Y1hHSkhiMjluYkdVZ1ZGWmNYR0l2TG1WNFpXTW9jSEp2WkhWamRDa3BLU0I3WEc0Z0lDQWdJQ0J3Y205a2RXTjBJRDBnWkdGMFlWc3dYVHRjYmlBZ0lDQjlYRzRnSUNBZ0x5OGdSR1YwWldOMElITnBiWFZzWVhSdmNuTXVYRzRnSUNBZ2FXWWdLQzljWEdKVGFXMTFiR0YwYjNKY1hHSXZhUzUwWlhOMEtIVmhLU2tnZTF4dUlDQWdJQ0FnY0hKdlpIVmpkQ0E5SUNod2NtOWtkV04wSUQ4Z2NISnZaSFZqZENBcklDY2dKeUE2SUNjbktTQXJJQ2RUYVcxMWJHRjBiM0luTzF4dUlDQWdJSDFjYmlBZ0lDQXZMeUJFWlhSbFkzUWdUM0JsY21FZ1RXbHVhU0E0S3lCeWRXNXVhVzVuSUdsdUlGUjFjbUp2TDFWdVkyOXRjSEpsYzNObFpDQnRiMlJsSUc5dUlHbFBVeTVjYmlBZ0lDQnBaaUFvYm1GdFpTQTlQU0FuVDNCbGNtRWdUV2x1YVNjZ0ppWWdMMXhjWWs5UWFVOVRYRnhpTHk1MFpYTjBLSFZoS1NrZ2UxeHVJQ0FnSUNBZ1pHVnpZM0pwY0hScGIyNHVjSFZ6YUNnbmNuVnVibWx1WnlCcGJpQlVkWEppYnk5VmJtTnZiWEJ5WlhOelpXUWdiVzlrWlNjcE8xeHVJQ0FnSUgxY2JpQWdJQ0F2THlCRVpYUmxZM1FnU1VVZ1RXOWlhV3hsSURFeExseHVJQ0FnSUdsbUlDaHVZVzFsSUQwOUlDZEpSU2NnSmlZZ0wxeGNZbXhwYTJVZ2FWQm9iMjVsSUU5VFhGeGlMeTUwWlhOMEtIVmhLU2tnZTF4dUlDQWdJQ0FnWkdGMFlTQTlJSEJoY25ObEtIVmhMbkpsY0d4aFkyVW9MMnhwYTJVZ2FWQm9iMjVsSUU5VEx5d2dKeWNwS1R0Y2JpQWdJQ0FnSUcxaGJuVm1ZV04wZFhKbGNpQTlJR1JoZEdFdWJXRnVkV1poWTNSMWNtVnlPMXh1SUNBZ0lDQWdjSEp2WkhWamRDQTlJR1JoZEdFdWNISnZaSFZqZER0Y2JpQWdJQ0I5WEc0Z0lDQWdMeThnUkdWMFpXTjBJR2xQVXk1Y2JpQWdJQ0JsYkhObElHbG1JQ2d2WG1sUUx5NTBaWE4wS0hCeWIyUjFZM1FwS1NCN1hHNGdJQ0FnSUNCdVlXMWxJSHg4SUNodVlXMWxJRDBnSjFOaFptRnlhU2NwTzF4dUlDQWdJQ0FnYjNNZ1BTQW5hVTlUSnlBcklDZ29aR0YwWVNBOUlDOGdUMU1nS0Z0Y1hHUmZYU3NwTDJrdVpYaGxZeWgxWVNrcFhHNGdJQ0FnSUNBZ0lEOGdKeUFuSUNzZ1pHRjBZVnN4WFM1eVpYQnNZV05sS0M5ZkwyY3NJQ2N1SnlsY2JpQWdJQ0FnSUNBZ09pQW5KeWs3WEc0Z0lDQWdmVnh1SUNBZ0lDOHZJRVJsZEdWamRDQkxkV0oxYm5SMUxseHVJQ0FnSUdWc2MyVWdhV1lnS0c1aGJXVWdQVDBnSjB0dmJuRjFaWEp2Y2ljZ0ppWWdJUzlpZFc1MGRTOXBMblJsYzNRb2IzTXBLU0I3WEc0Z0lDQWdJQ0J2Y3lBOUlDZExkV0oxYm5SMUp6dGNiaUFnSUNCOVhHNGdJQ0FnTHk4Z1JHVjBaV04wSUVGdVpISnZhV1FnWW5KdmQzTmxjbk11WEc0Z0lDQWdaV3h6WlNCcFppQW9LRzFoYm5WbVlXTjBkWEpsY2lBbUppQnRZVzUxWm1GamRIVnlaWElnSVQwZ0owZHZiMmRzWlNjZ0ppWmNiaUFnSUNBZ0lDQWdLQ2d2UTJoeWIyMWxMeTUwWlhOMEtHNWhiV1VwSUNZbUlDRXZYRnhpVFc5aWFXeGxJRk5oWm1GeWFWeGNZaTlwTG5SbGMzUW9kV0VwS1NCOGZDQXZYRnhpVm1sMFlWeGNZaTh1ZEdWemRDaHdjbTlrZFdOMEtTa3BJSHg4WEc0Z0lDQWdJQ0FnSUNndlhGeGlRVzVrY205cFpGeGNZaTh1ZEdWemRDaHZjeWtnSmlZZ0wxNURhSEp2YldVdkxuUmxjM1FvYm1GdFpTa2dKaVlnTDF4Y1lsWmxjbk5wYjI1Y1hDOHZhUzUwWlhOMEtIVmhLU2twSUh0Y2JpQWdJQ0FnSUc1aGJXVWdQU0FuUVc1a2NtOXBaQ0JDY205M2MyVnlKenRjYmlBZ0lDQWdJRzl6SUQwZ0wxeGNZa0Z1WkhKdmFXUmNYR0l2TG5SbGMzUW9iM01wSUQ4Z2IzTWdPaUFuUVc1a2NtOXBaQ2M3WEc0Z0lDQWdmVnh1SUNBZ0lDOHZJRVJsZEdWamRDQlRhV3hySUdSbGMydDBiM0F2WVdOalpXeGxjbUYwWldRZ2JXOWtaWE11WEc0Z0lDQWdaV3h6WlNCcFppQW9ibUZ0WlNBOVBTQW5VMmxzYXljcElIdGNiaUFnSUNBZ0lHbG1JQ2doTDF4Y1lrMXZZbWt2YVM1MFpYTjBLSFZoS1NrZ2UxeHVJQ0FnSUNBZ0lDQnZjeUE5SUNkQmJtUnliMmxrSnp0Y2JpQWdJQ0FnSUNBZ1pHVnpZM0pwY0hScGIyNHVkVzV6YUdsbWRDZ25aR1Z6YTNSdmNDQnRiMlJsSnlrN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnSUNCcFppQW9MMEZqWTJWc1pYSmhkR1ZrSUNvOUlDcDBjblZsTDJrdWRHVnpkQ2gxWVNrcElIdGNiaUFnSUNBZ0lDQWdaR1Z6WTNKcGNIUnBiMjR1ZFc1emFHbG1kQ2duWVdOalpXeGxjbUYwWldRbktUdGNiaUFnSUNBZ0lIMWNiaUFnSUNCOVhHNGdJQ0FnTHk4Z1JHVjBaV04wSUZCaGJHVk5iMjl1SUdsa1pXNTBhV1o1YVc1bklHRnpJRVpwY21WbWIzZ3VYRzRnSUNBZ1pXeHpaU0JwWmlBb2JtRnRaU0E5UFNBblVHRnNaVTF2YjI0bklDWW1JQ2hrWVhSaElEMGdMMXhjWWtacGNtVm1iM2hjWEM4b1cxeGNaQzVkS3lsY1hHSXZMbVY0WldNb2RXRXBLU2tnZTF4dUlDQWdJQ0FnWkdWelkzSnBjSFJwYjI0dWNIVnphQ2duYVdSbGJuUnBabmxwYm1jZ1lYTWdSbWx5WldadmVDQW5JQ3NnWkdGMFlWc3hYU2s3WEc0Z0lDQWdmVnh1SUNBZ0lDOHZJRVJsZEdWamRDQkdhWEpsWm05NElFOVRJR0Z1WkNCd2NtOWtkV04wY3lCeWRXNXVhVzVuSUVacGNtVm1iM2d1WEc0Z0lDQWdaV3h6WlNCcFppQW9ibUZ0WlNBOVBTQW5SbWx5WldadmVDY2dKaVlnS0dSaGRHRWdQU0F2WEZ4aUtFMXZZbWxzWlh4VVlXSnNaWFI4VkZZcFhGeGlMMmt1WlhobFl5aDFZU2twS1NCN1hHNGdJQ0FnSUNCdmN5QjhmQ0FvYjNNZ1BTQW5SbWx5WldadmVDQlBVeWNwTzF4dUlDQWdJQ0FnY0hKdlpIVmpkQ0I4ZkNBb2NISnZaSFZqZENBOUlHUmhkR0ZiTVYwcE8xeHVJQ0FnSUgxY2JpQWdJQ0F2THlCRVpYUmxZM1FnWm1Gc2MyVWdjRzl6YVhScGRtVnpJR1p2Y2lCR2FYSmxabTk0TDFOaFptRnlhUzVjYmlBZ0lDQmxiSE5sSUdsbUlDZ2hibUZ0WlNCOGZDQW9aR0YwWVNBOUlDRXZYRnhpVFdsdVpXWnBaV3hrWEZ4aUwya3VkR1Z6ZENoMVlTa2dKaVlnTDF4Y1lpZy9Pa1pwY21WbWIzaDhVMkZtWVhKcEtWeGNZaTh1WlhobFl5aHVZVzFsS1NrcElIdGNiaUFnSUNBZ0lDOHZJRVZ6WTJGd1pTQjBhR1VnWUM5Z0lHWnZjaUJHYVhKbFptOTRJREV1WEc0Z0lDQWdJQ0JwWmlBb2JtRnRaU0FtSmlBaGNISnZaSFZqZENBbUppQXZXMXhjTHl4ZGZGNWJYaWhkS3o5Y1hDa3ZMblJsYzNRb2RXRXVjMnhwWTJVb2RXRXVhVzVrWlhoUFppaGtZWFJoSUNzZ0p5OG5LU0FySURncEtTa2dlMXh1SUNBZ0lDQWdJQ0F2THlCRGJHVmhjaUJ1WVcxbElHOW1JR1poYkhObElIQnZjMmwwYVhabGN5NWNiaUFnSUNBZ0lDQWdibUZ0WlNBOUlHNTFiR3c3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdJQ0F2THlCU1pXRnpjMmxuYmlCaElHZGxibVZ5YVdNZ2JtRnRaUzVjYmlBZ0lDQWdJR2xtSUNnb1pHRjBZU0E5SUhCeWIyUjFZM1FnZkh3Z2JXRnVkV1poWTNSMWNtVnlJSHg4SUc5ektTQW1KbHh1SUNBZ0lDQWdJQ0FnSUNod2NtOWtkV04wSUh4OElHMWhiblZtWVdOMGRYSmxjaUI4ZkNBdlhGeGlLRDg2UVc1a2NtOXBaSHhUZVcxaWFXRnVJRTlUZkZSaFlteGxkQ0JQVTN4M1pXSlBVeWxjWEdJdkxuUmxjM1FvYjNNcEtTa2dlMXh1SUNBZ0lDQWdJQ0J1WVcxbElEMGdMMXRoTFhwZEt5Zy9PaUJJWVhRcFB5OXBMbVY0WldNb0wxeGNZa0Z1WkhKdmFXUmNYR0l2TG5SbGMzUW9iM01wSUQ4Z2IzTWdPaUJrWVhSaEtTQXJJQ2NnUW5KdmQzTmxjaWM3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1SUNBZ0lDOHZJRUZrWkNCRGFISnZiV1VnZG1WeWMybHZiaUIwYnlCa1pYTmpjbWx3ZEdsdmJpQm1iM0lnUld4bFkzUnliMjR1WEc0Z0lDQWdaV3h6WlNCcFppQW9ibUZ0WlNBOVBTQW5SV3hsWTNSeWIyNG5JQ1ltSUNoa1lYUmhJRDBnS0M5Y1hHSkRhSEp2YldWY1hDOG9XMXhjWkM1ZEt5bGNYR0l2TG1WNFpXTW9kV0VwSUh4OElEQXBXekZkS1NrZ2UxeHVJQ0FnSUNBZ1pHVnpZM0pwY0hScGIyNHVjSFZ6YUNnblEyaHliMjFwZFcwZ0p5QXJJR1JoZEdFcE8xeHVJQ0FnSUgxY2JpQWdJQ0F2THlCRVpYUmxZM1FnYm05dUxVOXdaWEpoSUNoUWNtVnpkRzh0WW1GelpXUXBJSFpsY25OcGIyNXpJQ2h2Y21SbGNpQnBjeUJwYlhCdmNuUmhiblFwTGx4dUlDQWdJR2xtSUNnaGRtVnljMmx2YmlrZ2UxeHVJQ0FnSUNBZ2RtVnljMmx2YmlBOUlHZGxkRlpsY25OcGIyNG9XMXh1SUNBZ0lDQWdJQ0FuS0Q4NlEyeHZkV1E1ZkVOeWFVOVRmRU55VFc5OFJXUm5aWHhHZUdsUFUzeEpSVTF2WW1sc1pYeEpjbTl1ZkU5d1pYSmhJRDlOYVc1cGZFOVFhVTlUZkU5UVVueFNZWFpsYm54VFlXMXpkVzVuUW5KdmQzTmxjbnhUYVd4cktEOGhMMXRjWEZ4Y1pDNWRLeVFwS1Njc1hHNGdJQ0FnSUNBZ0lDZFdaWEp6YVc5dUp5eGNiaUFnSUNBZ0lDQWdjWFZoYkdsbWVTaHVZVzFsS1N4Y2JpQWdJQ0FnSUNBZ0p5Zy9Pa1pwY21WbWIzaDhUV2x1WldacFpXeGtmRTVsZEVaeWIyNTBLU2RjYmlBZ0lDQWdJRjBwTzF4dUlDQWdJSDFjYmlBZ0lDQXZMeUJFWlhSbFkzUWdjM1IxWW1KdmNtNGdiR0Y1YjNWMElHVnVaMmx1WlhNdVhHNGdJQ0FnYVdZZ0tDaGtZWFJoSUQxY2JpQWdJQ0FnSUNBZ0lDQnNZWGx2ZFhRZ1BUMGdKMmxEWVdJbklDWW1JSEJoY25ObFJteHZZWFFvZG1WeWMybHZiaWtnUGlBeklDWW1JQ2RYWldKTGFYUW5JSHg4WEc0Z0lDQWdJQ0FnSUNBZ0wxeGNZazl3WlhKaFhGeGlMeTUwWlhOMEtHNWhiV1VwSUNZbUlDZ3ZYRnhpVDFCU1hGeGlMeTUwWlhOMEtIVmhLU0EvSUNkQ2JHbHVheWNnT2lBblVISmxjM1J2SnlrZ2ZIeGNiaUFnSUNBZ0lDQWdJQ0F2WEZ4aUtEODZUV2xrYjNKcGZFNXZiMnQ4VTJGbVlYSnBLVnhjWWk5cExuUmxjM1FvZFdFcElDWW1JQ0V2WGlnL09sUnlhV1JsYm5SOFJXUm5aVWhVVFV3cEpDOHVkR1Z6ZENoc1lYbHZkWFFwSUNZbUlDZFhaV0pMYVhRbklIeDhYRzRnSUNBZ0lDQWdJQ0FnSVd4aGVXOTFkQ0FtSmlBdlhGeGlUVk5KUlZ4Y1lpOXBMblJsYzNRb2RXRXBJQ1ltSUNodmN5QTlQU0FuVFdGaklFOVRKeUEvSUNkVVlYTnRZVzRuSURvZ0oxUnlhV1JsYm5RbktTQjhmRnh1SUNBZ0lDQWdJQ0FnSUd4aGVXOTFkQ0E5UFNBblYyVmlTMmwwSnlBbUppQXZYRnhpVUd4aGVWTjBZWFJwYjI1Y1hHSW9QeUVnVm1sMFlWeGNZaWt2YVM1MFpYTjBLRzVoYldVcElDWW1JQ2RPWlhSR2NtOXVkQ2RjYmlBZ0lDQWdJQ0FnS1NrZ2UxeHVJQ0FnSUNBZ2JHRjViM1YwSUQwZ1cyUmhkR0ZkTzF4dUlDQWdJSDFjYmlBZ0lDQXZMeUJFWlhSbFkzUWdWMmx1Wkc5M2N5QlFhRzl1WlNBM0lHUmxjMnQwYjNBZ2JXOWtaUzVjYmlBZ0lDQnBaaUFvYm1GdFpTQTlQU0FuU1VVbklDWW1JQ2hrWVhSaElEMGdLQzg3SUNvb1B6cFlRa3hYVUh4YWRXNWxWMUFwS0Z4Y1pDc3BMMmt1WlhobFl5aDFZU2tnZkh3Z01DbGJNVjBwS1NCN1hHNGdJQ0FnSUNCdVlXMWxJQ3M5SUNjZ1RXOWlhV3hsSnp0Y2JpQWdJQ0FnSUc5eklEMGdKMWRwYm1SdmQzTWdVR2h2Ym1VZ0p5QXJJQ2d2WEZ3ckpDOHVkR1Z6ZENoa1lYUmhLU0EvSUdSaGRHRWdPaUJrWVhSaElDc2dKeTU0SnlrN1hHNGdJQ0FnSUNCa1pYTmpjbWx3ZEdsdmJpNTFibk5vYVdaMEtDZGtaWE5yZEc5d0lHMXZaR1VuS1R0Y2JpQWdJQ0I5WEc0Z0lDQWdMeThnUkdWMFpXTjBJRmRwYm1SdmQzTWdVR2h2Ym1VZ09DNTRJR1JsYzJ0MGIzQWdiVzlrWlM1Y2JpQWdJQ0JsYkhObElHbG1JQ2d2WEZ4aVYxQkVaWE5yZEc5d1hGeGlMMmt1ZEdWemRDaDFZU2twSUh0Y2JpQWdJQ0FnSUc1aGJXVWdQU0FuU1VVZ1RXOWlhV3hsSnp0Y2JpQWdJQ0FnSUc5eklEMGdKMWRwYm1SdmQzTWdVR2h2Ym1VZ09DNTRKenRjYmlBZ0lDQWdJR1JsYzJOeWFYQjBhVzl1TG5WdWMyaHBablFvSjJSbGMydDBiM0FnYlc5a1pTY3BPMXh1SUNBZ0lDQWdkbVZ5YzJsdmJpQjhmQ0FvZG1WeWMybHZiaUE5SUNndlhGeGljblk2S0Z0Y1hHUXVYU3NwTHk1bGVHVmpLSFZoS1NCOGZDQXdLVnN4WFNrN1hHNGdJQ0FnZlZ4dUlDQWdJQzh2SUVSbGRHVmpkQ0JKUlNBeE1TQnBaR1Z1ZEdsbWVXbHVaeUJoY3lCdmRHaGxjaUJpY205M2MyVnljeTVjYmlBZ0lDQmxiSE5sSUdsbUlDaHVZVzFsSUNFOUlDZEpSU2NnSmlZZ2JHRjViM1YwSUQwOUlDZFVjbWxrWlc1MEp5QW1KaUFvWkdGMFlTQTlJQzljWEdKeWRqb29XMXhjWkM1ZEt5a3ZMbVY0WldNb2RXRXBLU2tnZTF4dUlDQWdJQ0FnYVdZZ0tHNWhiV1VwSUh0Y2JpQWdJQ0FnSUNBZ1pHVnpZM0pwY0hScGIyNHVjSFZ6YUNnbmFXUmxiblJwWm5scGJtY2dZWE1nSnlBcklHNWhiV1VnS3lBb2RtVnljMmx2YmlBL0lDY2dKeUFySUhabGNuTnBiMjRnT2lBbkp5a3BPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lDQWdibUZ0WlNBOUlDZEpSU2M3WEc0Z0lDQWdJQ0IyWlhKemFXOXVJRDBnWkdGMFlWc3hYVHRjYmlBZ0lDQjlYRzRnSUNBZ0x5OGdUR1YyWlhKaFoyVWdaVzUyYVhKdmJtMWxiblFnWm1WaGRIVnlaWE11WEc0Z0lDQWdhV1lnS0hWelpVWmxZWFIxY21WektTQjdYRzRnSUNBZ0lDQXZMeUJFWlhSbFkzUWdjMlZ5ZG1WeUxYTnBaR1VnWlc1MmFYSnZibTFsYm5SekxseHVJQ0FnSUNBZ0x5OGdVbWhwYm04Z2FHRnpJR0VnWjJ4dlltRnNJR1oxYm1OMGFXOXVJSGRvYVd4bElHOTBhR1Z5Y3lCb1lYWmxJR0VnWjJ4dlltRnNJRzlpYW1WamRDNWNiaUFnSUNBZ0lHbG1JQ2hwYzBodmMzUlVlWEJsS0dOdmJuUmxlSFFzSUNkbmJHOWlZV3duS1NrZ2UxeHVJQ0FnSUNBZ0lDQnBaaUFvYW1GMllTa2dlMXh1SUNBZ0lDQWdJQ0FnSUdSaGRHRWdQU0JxWVhaaExteGhibWN1VTNsemRHVnRPMXh1SUNBZ0lDQWdJQ0FnSUdGeVkyZ2dQU0JrWVhSaExtZGxkRkJ5YjNCbGNuUjVLQ2R2Y3k1aGNtTm9KeWs3WEc0Z0lDQWdJQ0FnSUNBZ2IzTWdQU0J2Y3lCOGZDQmtZWFJoTG1kbGRGQnliM0JsY25SNUtDZHZjeTV1WVcxbEp5a2dLeUFuSUNjZ0t5QmtZWFJoTG1kbGRGQnliM0JsY25SNUtDZHZjeTUyWlhKemFXOXVKeWs3WEc0Z0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUNBZ2FXWWdLR2x6VFc5a2RXeGxVMk52Y0dVZ0ppWWdhWE5JYjNOMFZIbHdaU2hqYjI1MFpYaDBMQ0FuYzNsemRHVnRKeWtnSmlZZ0tHUmhkR0VnUFNCYlkyOXVkR1Y0ZEM1emVYTjBaVzFkS1Zzd1hTa2dlMXh1SUNBZ0lDQWdJQ0FnSUc5eklIeDhJQ2h2Y3lBOUlHUmhkR0ZiTUYwdWIzTWdmSHdnYm5Wc2JDazdYRzRnSUNBZ0lDQWdJQ0FnZEhKNUlIdGNiaUFnSUNBZ0lDQWdJQ0FnSUdSaGRHRmJNVjBnUFNCamIyNTBaWGgwTG5KbGNYVnBjbVVvSjNKcGJtZHZMMlZ1WjJsdVpTY3BMblpsY25OcGIyNDdYRzRnSUNBZ0lDQWdJQ0FnSUNCMlpYSnphVzl1SUQwZ1pHRjBZVnN4WFM1cWIybHVLQ2N1SnlrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0J1WVcxbElEMGdKMUpwYm1kdlNsTW5PMXh1SUNBZ0lDQWdJQ0FnSUgwZ1kyRjBZMmdvWlNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnYVdZZ0tHUmhkR0ZiTUYwdVoyeHZZbUZzTG5ONWMzUmxiU0E5UFNCamIyNTBaWGgwTG5ONWMzUmxiU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0J1WVcxbElEMGdKMDVoY25kb1lXd25PMXh1SUNBZ0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNCbGJITmxJR2xtSUNoY2JpQWdJQ0FnSUNBZ0lDQjBlWEJsYjJZZ1kyOXVkR1Y0ZEM1d2NtOWpaWE56SUQwOUlDZHZZbXBsWTNRbklDWW1JQ0ZqYjI1MFpYaDBMbkJ5YjJObGMzTXVZbkp2ZDNObGNpQW1KbHh1SUNBZ0lDQWdJQ0FnSUNoa1lYUmhJRDBnWTI5dWRHVjRkQzV3Y205alpYTnpLVnh1SUNBZ0lDQWdJQ0FwSUh0Y2JpQWdJQ0FnSUNBZ0lDQnBaaUFvZEhsd1pXOW1JR1JoZEdFdWRtVnljMmx2Ym5NZ1BUMGdKMjlpYW1WamRDY3BJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lHbG1JQ2gwZVhCbGIyWWdaR0YwWVM1MlpYSnphVzl1Y3k1bGJHVmpkSEp2YmlBOVBTQW5jM1J5YVc1bkp5a2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQmtaWE5qY21sd2RHbHZiaTV3ZFhOb0tDZE9iMlJsSUNjZ0t5QmtZWFJoTG5abGNuTnBiMjV6TG01dlpHVXBPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQnVZVzFsSUQwZ0owVnNaV04wY205dUp6dGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ2RtVnljMmx2YmlBOUlHUmhkR0V1ZG1WeWMybHZibk11Wld4bFkzUnliMjQ3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlJR1ZzYzJVZ2FXWWdLSFI1Y0dWdlppQmtZWFJoTG5abGNuTnBiMjV6TG01M0lEMDlJQ2R6ZEhKcGJtY25LU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJR1JsYzJOeWFYQjBhVzl1TG5CMWMyZ29KME5vY205dGFYVnRJQ2NnS3lCMlpYSnphVzl1TENBblRtOWtaU0FuSUNzZ1pHRjBZUzUyWlhKemFXOXVjeTV1YjJSbEtUdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ2JtRnRaU0E5SUNkT1Z5NXFjeWM3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJSFpsY25OcGIyNGdQU0JrWVhSaExuWmxjbk5wYjI1ekxtNTNPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCdVlXMWxJRDBnSjA1dlpHVXVhbk1uTzF4dUlDQWdJQ0FnSUNBZ0lDQWdZWEpqYUNBOUlHUmhkR0V1WVhKamFEdGNiaUFnSUNBZ0lDQWdJQ0FnSUc5eklEMGdaR0YwWVM1d2JHRjBabTl5YlR0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFpsY25OcGIyNGdQU0F2VzF4Y1pDNWRLeTh1WlhobFl5aGtZWFJoTG5abGNuTnBiMjRwWEc0Z0lDQWdJQ0FnSUNBZ0lDQjJaWEp6YVc5dUlEMGdkbVZ5YzJsdmJpQS9JSFpsY25OcGIyNWJNRjBnT2lBbmRXNXJibTkzYmljN1hHNGdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUdWc2MyVWdhV1lnS0hKb2FXNXZLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2JtRnRaU0E5SUNkU2FHbHVieWM3WEc0Z0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUgxY2JpQWdJQ0FnSUM4dklFUmxkR1ZqZENCQlpHOWlaU0JCU1ZJdVhHNGdJQ0FnSUNCbGJITmxJR2xtSUNoblpYUkRiR0Z6YzA5bUtDaGtZWFJoSUQwZ1kyOXVkR1Y0ZEM1eWRXNTBhVzFsS1NrZ1BUMGdZV2x5VW5WdWRHbHRaVU5zWVhOektTQjdYRzRnSUNBZ0lDQWdJRzVoYldVZ1BTQW5RV1J2WW1VZ1FVbFNKenRjYmlBZ0lDQWdJQ0FnYjNNZ1BTQmtZWFJoTG1ac1lYTm9Mbk41YzNSbGJTNURZWEJoWW1sc2FYUnBaWE11YjNNN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnSUNBdkx5QkVaWFJsWTNRZ1VHaGhiblJ2YlVwVExseHVJQ0FnSUNBZ1pXeHpaU0JwWmlBb1oyVjBRMnhoYzNOUFppZ29aR0YwWVNBOUlHTnZiblJsZUhRdWNHaGhiblJ2YlNrcElEMDlJSEJvWVc1MGIyMURiR0Z6Y3lrZ2UxeHVJQ0FnSUNBZ0lDQnVZVzFsSUQwZ0oxQm9ZVzUwYjIxS1V5YzdYRzRnSUNBZ0lDQWdJSFpsY25OcGIyNGdQU0FvWkdGMFlTQTlJR1JoZEdFdWRtVnljMmx2YmlCOGZDQnVkV3hzS1NBbUppQW9aR0YwWVM1dFlXcHZjaUFySUNjdUp5QXJJR1JoZEdFdWJXbHViM0lnS3lBbkxpY2dLeUJrWVhSaExuQmhkR05vS1R0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0FnSUM4dklFUmxkR1ZqZENCSlJTQmpiMjF3WVhScFltbHNhWFI1SUcxdlpHVnpMbHh1SUNBZ0lDQWdaV3h6WlNCcFppQW9kSGx3Wlc5bUlHUnZZeTVrYjJOMWJXVnVkRTF2WkdVZ1BUMGdKMjUxYldKbGNpY2dKaVlnS0dSaGRHRWdQU0F2WEZ4aVZISnBaR1Z1ZEZ4Y0x5aGNYR1FyS1M5cExtVjRaV01vZFdFcEtTa2dlMXh1SUNBZ0lDQWdJQ0F2THlCWFpTZHlaU0JwYmlCamIyMXdZWFJwWW1sc2FYUjVJRzF2WkdVZ2QyaGxiaUIwYUdVZ1ZISnBaR1Z1ZENCMlpYSnphVzl1SUNzZ05DQmtiMlZ6YmlkMFhHNGdJQ0FnSUNBZ0lDOHZJR1Z4ZFdGc0lIUm9aU0JrYjJOMWJXVnVkQ0J0YjJSbExseHVJQ0FnSUNBZ0lDQjJaWEp6YVc5dUlEMGdXM1psY25OcGIyNHNJR1J2WXk1a2IyTjFiV1Z1ZEUxdlpHVmRPMXh1SUNBZ0lDQWdJQ0JwWmlBb0tHUmhkR0VnUFNBclpHRjBZVnN4WFNBcklEUXBJQ0U5SUhabGNuTnBiMjViTVYwcElIdGNiaUFnSUNBZ0lDQWdJQ0JrWlhOamNtbHdkR2x2Ymk1d2RYTm9LQ2RKUlNBbklDc2dkbVZ5YzJsdmJsc3hYU0FySUNjZ2JXOWtaU2NwTzF4dUlDQWdJQ0FnSUNBZ0lHeGhlVzkxZENBbUppQW9iR0Y1YjNWMFd6RmRJRDBnSnljcE8xeHVJQ0FnSUNBZ0lDQWdJSFpsY25OcGIyNWJNVjBnUFNCa1lYUmhPMXh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUhabGNuTnBiMjRnUFNCdVlXMWxJRDA5SUNkSlJTY2dQeUJUZEhKcGJtY29kbVZ5YzJsdmJsc3hYUzUwYjBacGVHVmtLREVwS1NBNklIWmxjbk5wYjI1Yk1GMDdYRzRnSUNBZ0lDQjlYRzRnSUNBZ0lDQXZMeUJFWlhSbFkzUWdTVVVnTVRFZ2JXRnphMmx1WnlCaGN5QnZkR2hsY2lCaWNtOTNjMlZ5Y3k1Y2JpQWdJQ0FnSUdWc2MyVWdhV1lnS0hSNWNHVnZaaUJrYjJNdVpHOWpkVzFsYm5STmIyUmxJRDA5SUNkdWRXMWlaWEluSUNZbUlDOWVLRDg2UTJoeWIyMWxmRVpwY21WbWIzZ3BYRnhpTHk1MFpYTjBLRzVoYldVcEtTQjdYRzRnSUNBZ0lDQWdJR1JsYzJOeWFYQjBhVzl1TG5CMWMyZ29KMjFoYzJ0cGJtY2dZWE1nSnlBcklHNWhiV1VnS3lBbklDY2dLeUIyWlhKemFXOXVLVHRjYmlBZ0lDQWdJQ0FnYm1GdFpTQTlJQ2RKUlNjN1hHNGdJQ0FnSUNBZ0lIWmxjbk5wYjI0Z1BTQW5NVEV1TUNjN1hHNGdJQ0FnSUNBZ0lHeGhlVzkxZENBOUlGc25WSEpwWkdWdWRDZGRPMXh1SUNBZ0lDQWdJQ0J2Y3lBOUlDZFhhVzVrYjNkekp6dGNiaUFnSUNBZ0lIMWNiaUFnSUNBZ0lHOXpJRDBnYjNNZ0ppWWdabTl5YldGMEtHOXpLVHRjYmlBZ0lDQjlYRzRnSUNBZ0x5OGdSR1YwWldOMElIQnlaWEpsYkdWaGMyVWdjR2hoYzJWekxseHVJQ0FnSUdsbUlDaDJaWEp6YVc5dUlDWW1JQ2hrWVhSaElEMWNiaUFnSUNBZ0lDQWdJQ0F2S0Q4NlcyRmlYWHhrY0h4d2NtVjhXMkZpWFZ4Y1pDdHdjbVVwS0Q4NlhGeGtLMXhjS3o4cFB5UXZhUzVsZUdWaktIWmxjbk5wYjI0cElIeDhYRzRnSUNBZ0lDQWdJQ0FnTHlnL09tRnNjR2hoZkdKbGRHRXBLRDg2SUQ5Y1hHUXBQeTlwTG1WNFpXTW9kV0VnS3lBbk95Y2dLeUFvZFhObFJtVmhkSFZ5WlhNZ0ppWWdibUYyTG1Gd2NFMXBibTl5Vm1WeWMybHZiaWtwSUh4OFhHNGdJQ0FnSUNBZ0lDQWdMMXhjWWsxcGJtVm1hV1ZzWkZ4Y1lpOXBMblJsYzNRb2RXRXBJQ1ltSUNkaEoxeHVJQ0FnSUNBZ0lDQXBLU0I3WEc0Z0lDQWdJQ0J3Y21WeVpXeGxZWE5sSUQwZ0wySXZhUzUwWlhOMEtHUmhkR0VwSUQ4Z0oySmxkR0VuSURvZ0oyRnNjR2hoSnp0Y2JpQWdJQ0FnSUhabGNuTnBiMjRnUFNCMlpYSnphVzl1TG5KbGNHeGhZMlVvVW1WblJYaHdLR1JoZEdFZ0t5QW5YRnhjWENzL0pDY3BMQ0FuSnlrZ0sxeHVJQ0FnSUNBZ0lDQW9jSEpsY21Wc1pXRnpaU0E5UFNBblltVjBZU2NnUHlCaVpYUmhJRG9nWVd4d2FHRXBJQ3NnS0M5Y1hHUXJYRndyUHk4dVpYaGxZeWhrWVhSaEtTQjhmQ0FuSnlrN1hHNGdJQ0FnZlZ4dUlDQWdJQzh2SUVSbGRHVmpkQ0JHYVhKbFptOTRJRTF2WW1sc1pTNWNiaUFnSUNCcFppQW9ibUZ0WlNBOVBTQW5SbVZ1Ym1Wakp5QjhmQ0J1WVcxbElEMDlJQ2RHYVhKbFptOTRKeUFtSmlBdlhGeGlLRDg2UVc1a2NtOXBaSHhHYVhKbFptOTRJRTlUS1Z4Y1lpOHVkR1Z6ZENodmN5a3BJSHRjYmlBZ0lDQWdJRzVoYldVZ1BTQW5SbWx5WldadmVDQk5iMkpwYkdVbk8xeHVJQ0FnSUgxY2JpQWdJQ0F2THlCUFluTmpkWEpsSUUxaGVIUm9iMjRuY3lCMWJuSmxiR2xoWW14bElIWmxjbk5wYjI0dVhHNGdJQ0FnWld4elpTQnBaaUFvYm1GdFpTQTlQU0FuVFdGNGRHaHZiaWNnSmlZZ2RtVnljMmx2YmlrZ2UxeHVJQ0FnSUNBZ2RtVnljMmx2YmlBOUlIWmxjbk5wYjI0dWNtVndiR0ZqWlNndlhGd3VXMXhjWkM1ZEt5OHNJQ2N1ZUNjcE8xeHVJQ0FnSUgxY2JpQWdJQ0F2THlCRVpYUmxZM1FnV0dKdmVDQXpOakFnWVc1a0lGaGliM2dnVDI1bExseHVJQ0FnSUdWc2MyVWdhV1lnS0M5Y1hHSllZbTk0WEZ4aUwya3VkR1Z6ZENod2NtOWtkV04wS1NrZ2UxeHVJQ0FnSUNBZ2FXWWdLSEJ5YjJSMVkzUWdQVDBnSjFoaWIzZ2dNell3SnlrZ2UxeHVJQ0FnSUNBZ0lDQnZjeUE5SUc1MWJHdzdYRzRnSUNBZ0lDQjlYRzRnSUNBZ0lDQnBaaUFvY0hKdlpIVmpkQ0E5UFNBbldHSnZlQ0F6TmpBbklDWW1JQzljWEdKSlJVMXZZbWxzWlZ4Y1lpOHVkR1Z6ZENoMVlTa3BJSHRjYmlBZ0lDQWdJQ0FnWkdWelkzSnBjSFJwYjI0dWRXNXphR2xtZENnbmJXOWlhV3hsSUcxdlpHVW5LVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzRnSUNBZ0x5OGdRV1JrSUcxdlltbHNaU0J3YjNOMFptbDRMbHh1SUNBZ0lHVnNjMlVnYVdZZ0tDZ3ZYaWcvT2tOb2NtOXRaWHhKUlh4UGNHVnlZU2trTHk1MFpYTjBLRzVoYldVcElIeDhJRzVoYldVZ0ppWWdJWEJ5YjJSMVkzUWdKaVlnSVM5Q2NtOTNjMlZ5ZkUxdllta3ZMblJsYzNRb2JtRnRaU2twSUNZbVhHNGdJQ0FnSUNBZ0lDaHZjeUE5UFNBblYybHVaRzkzY3lCRFJTY2dmSHdnTDAxdllta3ZhUzUwWlhOMEtIVmhLU2twSUh0Y2JpQWdJQ0FnSUc1aGJXVWdLejBnSnlCTmIySnBiR1VuTzF4dUlDQWdJSDFjYmlBZ0lDQXZMeUJFWlhSbFkzUWdTVVVnY0d4aGRHWnZjbTBnY0hKbGRtbGxkeTVjYmlBZ0lDQmxiSE5sSUdsbUlDaHVZVzFsSUQwOUlDZEpSU2NnSmlZZ2RYTmxSbVZoZEhWeVpYTXBJSHRjYmlBZ0lDQWdJSFJ5ZVNCN1hHNGdJQ0FnSUNBZ0lHbG1JQ2hqYjI1MFpYaDBMbVY0ZEdWeWJtRnNJRDA5UFNCdWRXeHNLU0I3WEc0Z0lDQWdJQ0FnSUNBZ1pHVnpZM0pwY0hScGIyNHVkVzV6YUdsbWRDZ25jR3hoZEdadmNtMGdjSEpsZG1sbGR5Y3BPMXh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0I5SUdOaGRHTm9LR1VwSUh0Y2JpQWdJQ0FnSUNBZ1pHVnpZM0pwY0hScGIyNHVkVzV6YUdsbWRDZ25aVzFpWldSa1pXUW5LVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzRnSUNBZ0x5OGdSR1YwWldOMElFSnNZV05yUW1WeWNua2dUMU1nZG1WeWMybHZiaTVjYmlBZ0lDQXZMeUJvZEhSd09pOHZaRzlqY3k1aWJHRmphMkpsY25KNUxtTnZiUzlsYmk5a1pYWmxiRzl3WlhKekwyUmxiR2wyWlhKaFlteGxjeTh4T0RFMk9TOUlWRlJRWDJobFlXUmxjbk5mYzJWdWRGOWllVjlDUWw5Q2NtOTNjMlZ5WHpFeU16UTVNVEZmTVRFdWFuTndYRzRnSUNBZ1pXeHpaU0JwWmlBb0tDOWNYR0pDYkdGamEwSmxjbko1WEZ4aUx5NTBaWE4wS0hCeWIyUjFZM1FwSUh4OElDOWNYR0pDUWpFd1hGeGlMeTUwWlhOMEtIVmhLU2tnSmlZZ0tHUmhkR0VnUFZ4dUlDQWdJQ0FnSUNBZ0lDaFNaV2RGZUhBb2NISnZaSFZqZEM1eVpYQnNZV05sS0M4Z0t5OW5MQ0FuSUNvbktTQXJJQ2N2S0ZzdVhGeGNYR1JkS3lrbkxDQW5hU2NwTG1WNFpXTW9kV0VwSUh4OElEQXBXekZkSUh4OFhHNGdJQ0FnSUNBZ0lDQWdkbVZ5YzJsdmJseHVJQ0FnSUNBZ0lDQXBLU0I3WEc0Z0lDQWdJQ0JrWVhSaElEMGdXMlJoZEdFc0lDOUNRakV3THk1MFpYTjBLSFZoS1YwN1hHNGdJQ0FnSUNCdmN5QTlJQ2hrWVhSaFd6RmRJRDhnS0hCeWIyUjFZM1FnUFNCdWRXeHNMQ0J0WVc1MVptRmpkSFZ5WlhJZ1BTQW5RbXhoWTJ0Q1pYSnllU2NwSURvZ0owUmxkbWxqWlNCVGIyWjBkMkZ5WlNjcElDc2dKeUFuSUNzZ1pHRjBZVnN3WFR0Y2JpQWdJQ0FnSUhabGNuTnBiMjRnUFNCdWRXeHNPMXh1SUNBZ0lIMWNiaUFnSUNBdkx5QkVaWFJsWTNRZ1QzQmxjbUVnYVdSbGJuUnBabmxwYm1jdmJXRnphMmx1WnlCcGRITmxiR1lnWVhNZ1lXNXZkR2hsY2lCaWNtOTNjMlZ5TGx4dUlDQWdJQzh2SUdoMGRIQTZMeTkzZDNjdWIzQmxjbUV1WTI5dEwzTjFjSEJ2Y25RdmEySXZkbWxsZHk4NE5ETXZYRzRnSUNBZ1pXeHpaU0JwWmlBb2RHaHBjeUFoUFNCbWIzSlBkMjRnSmlZZ2NISnZaSFZqZENBaFBTQW5WMmxwSnlBbUppQW9YRzRnSUNBZ0lDQWdJQ0FnS0hWelpVWmxZWFIxY21WeklDWW1JRzl3WlhKaEtTQjhmRnh1SUNBZ0lDQWdJQ0FnSUNndlQzQmxjbUV2TG5SbGMzUW9ibUZ0WlNrZ0ppWWdMMXhjWWlnL09rMVRTVVY4Um1seVpXWnZlQ2xjWEdJdmFTNTBaWE4wS0hWaEtTa2dmSHhjYmlBZ0lDQWdJQ0FnSUNBb2JtRnRaU0E5UFNBblJtbHlaV1p2ZUNjZ0ppWWdMMXhjWWs5VElGZ2dLRDg2WEZ4a0sxeGNMaWw3TWl4OUx5NTBaWE4wS0c5ektTa2dmSHhjYmlBZ0lDQWdJQ0FnSUNBb2JtRnRaU0E5UFNBblNVVW5JQ1ltSUNoY2JpQWdJQ0FnSUNBZ0lDQWdJQ2h2Y3lBbUppQWhMMTVYYVc0dkxuUmxjM1FvYjNNcElDWW1JSFpsY25OcGIyNGdQaUExTGpVcElIeDhYRzRnSUNBZ0lDQWdJQ0FnSUNBdlhGeGlWMmx1Wkc5M2N5QllVRnhjWWk4dWRHVnpkQ2h2Y3lrZ0ppWWdkbVZ5YzJsdmJpQStJRGdnZkh4Y2JpQWdJQ0FnSUNBZ0lDQWdJSFpsY25OcGIyNGdQVDBnT0NBbUppQWhMMXhjWWxSeWFXUmxiblJjWEdJdkxuUmxjM1FvZFdFcFhHNGdJQ0FnSUNBZ0lDQWdLU2xjYmlBZ0lDQWdJQ0FnS1NBbUppQWhjbVZQY0dWeVlTNTBaWE4wS0Noa1lYUmhJRDBnY0dGeWMyVXVZMkZzYkNobWIzSlBkMjRzSUhWaExuSmxjR3hoWTJVb2NtVlBjR1Z5WVN3Z0p5Y3BJQ3NnSnpzbktTa3BJQ1ltSUdSaGRHRXVibUZ0WlNrZ2UxeHVJQ0FnSUNBZ0x5OGdWMmhsYmlCY0ltbGtaVzUwYVdaNWFXNW5YQ0lzSUhSb1pTQlZRU0JqYjI1MFlXbHVjeUJpYjNSb0lFOXdaWEpoSUdGdVpDQjBhR1VnYjNSb1pYSWdZbkp2ZDNObGNpZHpJRzVoYldVdVhHNGdJQ0FnSUNCa1lYUmhJRDBnSjJsdVp5QmhjeUFuSUNzZ1pHRjBZUzV1WVcxbElDc2dLQ2hrWVhSaElEMGdaR0YwWVM1MlpYSnphVzl1S1NBL0lDY2dKeUFySUdSaGRHRWdPaUFuSnlrN1hHNGdJQ0FnSUNCcFppQW9jbVZQY0dWeVlTNTBaWE4wS0c1aGJXVXBLU0I3WEc0Z0lDQWdJQ0FnSUdsbUlDZ3ZYRnhpU1VWY1hHSXZMblJsYzNRb1pHRjBZU2tnSmlZZ2IzTWdQVDBnSjAxaFl5QlBVeWNwSUh0Y2JpQWdJQ0FnSUNBZ0lDQnZjeUE5SUc1MWJHdzdYRzRnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnWkdGMFlTQTlJQ2RwWkdWdWRHbG1lU2NnS3lCa1lYUmhPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lDQWdMeThnVjJobGJpQmNJbTFoYzJ0cGJtZGNJaXdnZEdobElGVkJJR052Ym5SaGFXNXpJRzl1YkhrZ2RHaGxJRzkwYUdWeUlHSnliM2R6WlhJbmN5QnVZVzFsTGx4dUlDQWdJQ0FnWld4elpTQjdYRzRnSUNBZ0lDQWdJR1JoZEdFZ1BTQW5iV0Z6YXljZ0t5QmtZWFJoTzF4dUlDQWdJQ0FnSUNCcFppQW9iM0JsY21GRGJHRnpjeWtnZTF4dUlDQWdJQ0FnSUNBZ0lHNWhiV1VnUFNCbWIzSnRZWFFvYjNCbGNtRkRiR0Z6Y3k1eVpYQnNZV05sS0M4b1cyRXRlbDBwS0Z0QkxWcGRLUzluTENBbkpERWdKREluS1NrN1hHNGdJQ0FnSUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNBZ0lDQWdibUZ0WlNBOUlDZFBjR1Z5WVNjN1hHNGdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdhV1lnS0M5Y1hHSkpSVnhjWWk4dWRHVnpkQ2hrWVhSaEtTa2dlMXh1SUNBZ0lDQWdJQ0FnSUc5eklEMGdiblZzYkR0Y2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQnBaaUFvSVhWelpVWmxZWFIxY21WektTQjdYRzRnSUNBZ0lDQWdJQ0FnZG1WeWMybHZiaUE5SUc1MWJHdzdYRzRnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJSDFjYmlBZ0lDQWdJR3hoZVc5MWRDQTlJRnNuVUhKbGMzUnZKMTA3WEc0Z0lDQWdJQ0JrWlhOamNtbHdkR2x2Ymk1d2RYTm9LR1JoZEdFcE8xeHVJQ0FnSUgxY2JpQWdJQ0F2THlCRVpYUmxZM1FnVjJWaVMybDBJRTVwWjJoMGJIa2dZVzVrSUdGd2NISnZlR2x0WVhSbElFTm9jbTl0WlM5VFlXWmhjbWtnZG1WeWMybHZibk11WEc0Z0lDQWdhV1lnS0Noa1lYUmhJRDBnS0M5Y1hHSkJjSEJzWlZkbFlrdHBkRnhjTHloYlhGeGtMbDByWEZ3clB5a3ZhUzVsZUdWaktIVmhLU0I4ZkNBd0tWc3hYU2twSUh0Y2JpQWdJQ0FnSUM4dklFTnZjbkpsWTNRZ1luVnBiR1FnYm5WdFltVnlJR1p2Y2lCdWRXMWxjbWxqSUdOdmJYQmhjbWx6YjI0dVhHNGdJQ0FnSUNBdkx5QW9aUzVuTGlCY0lqVXpNaTQxWENJZ1ltVmpiMjFsY3lCY0lqVXpNaTR3TlZ3aUtWeHVJQ0FnSUNBZ1pHRjBZU0E5SUZ0d1lYSnpaVVpzYjJGMEtHUmhkR0V1Y21Wd2JHRmpaU2d2WEZ3dUtGeGNaQ2trTHl3Z0p5NHdKREVuS1Nrc0lHUmhkR0ZkTzF4dUlDQWdJQ0FnTHk4Z1RtbG5hSFJzZVNCaWRXbHNaSE1nWVhKbElIQnZjM1JtYVhobFpDQjNhWFJvSUdFZ1hDSXJYQ0l1WEc0Z0lDQWdJQ0JwWmlBb2JtRnRaU0E5UFNBblUyRm1ZWEpwSnlBbUppQmtZWFJoV3pGZExuTnNhV05sS0MweEtTQTlQU0FuS3ljcElIdGNiaUFnSUNBZ0lDQWdibUZ0WlNBOUlDZFhaV0pMYVhRZ1RtbG5hSFJzZVNjN1hHNGdJQ0FnSUNBZ0lIQnlaWEpsYkdWaGMyVWdQU0FuWVd4d2FHRW5PMXh1SUNBZ0lDQWdJQ0IyWlhKemFXOXVJRDBnWkdGMFlWc3hYUzV6YkdsalpTZ3dMQ0F0TVNrN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnSUNBdkx5QkRiR1ZoY2lCcGJtTnZjbkpsWTNRZ1luSnZkM05sY2lCMlpYSnphVzl1Y3k1Y2JpQWdJQ0FnSUdWc2MyVWdhV1lnS0habGNuTnBiMjRnUFQwZ1pHRjBZVnN4WFNCOGZGeHVJQ0FnSUNBZ0lDQWdJSFpsY25OcGIyNGdQVDBnS0dSaGRHRmJNbDBnUFNBb0wxeGNZbE5oWm1GeWFWeGNMeWhiWEZ4a0xsMHJYRndyUHlrdmFTNWxlR1ZqS0hWaEtTQjhmQ0F3S1ZzeFhTa3BJSHRjYmlBZ0lDQWdJQ0FnZG1WeWMybHZiaUE5SUc1MWJHdzdYRzRnSUNBZ0lDQjlYRzRnSUNBZ0lDQXZMeUJWYzJVZ2RHaGxJR1oxYkd3Z1EyaHliMjFsSUhabGNuTnBiMjRnZDJobGJpQmhkbUZwYkdGaWJHVXVYRzRnSUNBZ0lDQmtZWFJoV3pGZElEMGdLQzljWEdKRGFISnZiV1ZjWEM4b1cxeGNaQzVkS3lrdmFTNWxlR1ZqS0hWaEtTQjhmQ0F3S1ZzeFhUdGNiaUFnSUNBZ0lDOHZJRVJsZEdWamRDQkNiR2x1YXlCc1lYbHZkWFFnWlc1bmFXNWxMbHh1SUNBZ0lDQWdhV1lnS0dSaGRHRmJNRjBnUFQwZ05UTTNMak0ySUNZbUlHUmhkR0ZiTWwwZ1BUMGdOVE0zTGpNMklDWW1JSEJoY25ObFJteHZZWFFvWkdGMFlWc3hYU2tnUGowZ01qZ2dKaVlnYkdGNWIzVjBJRDA5SUNkWFpXSkxhWFFuS1NCN1hHNGdJQ0FnSUNBZ0lHeGhlVzkxZENBOUlGc25RbXhwYm1zblhUdGNiaUFnSUNBZ0lIMWNiaUFnSUNBZ0lDOHZJRVJsZEdWamRDQktZWFpoVTJOeWFYQjBRMjl5WlM1Y2JpQWdJQ0FnSUM4dklHaDBkSEE2THk5emRHRmphMjkyWlhKbWJHOTNMbU52YlM5eGRXVnpkR2x2Ym5Ndk5qYzJPRFEzTkM5b2IzY3RZMkZ1TFdrdFpHVjBaV04wTFhkb2FXTm9MV3BoZG1GelkzSnBjSFF0Wlc1bmFXNWxMWFk0TFc5eUxXcHpZeTFwY3kxMWMyVmtMV0YwTFhKMWJuUnBiV1V0YVc0dFlXNWtjbTlwWEc0Z0lDQWdJQ0JwWmlBb0lYVnpaVVpsWVhSMWNtVnpJSHg4SUNnaGJHbHJaVU5vY205dFpTQW1KaUFoWkdGMFlWc3hYU2twSUh0Y2JpQWdJQ0FnSUNBZ2JHRjViM1YwSUNZbUlDaHNZWGx2ZFhSYk1WMGdQU0FuYkdsclpTQlRZV1poY21rbktUdGNiaUFnSUNBZ0lDQWdaR0YwWVNBOUlDaGtZWFJoSUQwZ1pHRjBZVnN3WFN3Z1pHRjBZU0E4SURRd01DQS9JREVnT2lCa1lYUmhJRHdnTlRBd0lEOGdNaUE2SUdSaGRHRWdQQ0ExTWpZZ1B5QXpJRG9nWkdGMFlTQThJRFV6TXlBL0lEUWdPaUJrWVhSaElEd2dOVE0wSUQ4Z0p6UXJKeUE2SUdSaGRHRWdQQ0ExTXpVZ1B5QTFJRG9nWkdGMFlTQThJRFV6TnlBL0lEWWdPaUJrWVhSaElEd2dOVE00SUQ4Z055QTZJR1JoZEdFZ1BDQTJNREVnUHlBNElEb2dKemduS1R0Y2JpQWdJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0FnSUd4aGVXOTFkQ0FtSmlBb2JHRjViM1YwV3pGZElEMGdKMnhwYTJVZ1EyaHliMjFsSnlrN1hHNGdJQ0FnSUNBZ0lHUmhkR0VnUFNCa1lYUmhXekZkSUh4OElDaGtZWFJoSUQwZ1pHRjBZVnN3WFN3Z1pHRjBZU0E4SURVek1DQS9JREVnT2lCa1lYUmhJRHdnTlRNeUlEOGdNaUE2SUdSaGRHRWdQQ0ExTXpJdU1EVWdQeUF6SURvZ1pHRjBZU0E4SURVek15QS9JRFFnT2lCa1lYUmhJRHdnTlRNMExqQXpJRDhnTlNBNklHUmhkR0VnUENBMU16UXVNRGNnUHlBMklEb2daR0YwWVNBOElEVXpOQzR4TUNBL0lEY2dPaUJrWVhSaElEd2dOVE0wTGpFeklEOGdPQ0E2SUdSaGRHRWdQQ0ExTXpRdU1UWWdQeUE1SURvZ1pHRjBZU0E4SURVek5DNHlOQ0EvSURFd0lEb2daR0YwWVNBOElEVXpOQzR6TUNBL0lERXhJRG9nWkdGMFlTQThJRFV6TlM0d01TQS9JREV5SURvZ1pHRjBZU0E4SURVek5TNHdNaUEvSUNjeE15c25JRG9nWkdGMFlTQThJRFV6TlM0d055QS9JREUxSURvZ1pHRjBZU0E4SURVek5TNHhNU0EvSURFMklEb2daR0YwWVNBOElEVXpOUzR4T1NBL0lERTNJRG9nWkdGMFlTQThJRFV6Tmk0d05TQS9JREU0SURvZ1pHRjBZU0E4SURVek5pNHhNQ0EvSURFNUlEb2daR0YwWVNBOElEVXpOeTR3TVNBL0lESXdJRG9nWkdGMFlTQThJRFV6Tnk0eE1TQS9JQ2N5TVNzbklEb2daR0YwWVNBOElEVXpOeTR4TXlBL0lESXpJRG9nWkdGMFlTQThJRFV6Tnk0eE9DQS9JREkwSURvZ1pHRjBZU0E4SURVek55NHlOQ0EvSURJMUlEb2daR0YwWVNBOElEVXpOeTR6TmlBL0lESTJJRG9nYkdGNWIzVjBJQ0U5SUNkQ2JHbHVheWNnUHlBbk1qY25JRG9nSnpJNEp5azdYRzRnSUNBZ0lDQjlYRzRnSUNBZ0lDQXZMeUJCWkdRZ2RHaGxJSEJ2YzNSbWFYZ2diMllnWENJdWVGd2lJRzl5SUZ3aUsxd2lJR1p2Y2lCaGNIQnliM2hwYldGMFpTQjJaWEp6YVc5dWN5NWNiaUFnSUNBZ0lHeGhlVzkxZENBbUppQW9iR0Y1YjNWMFd6RmRJQ3M5SUNjZ0p5QXJJQ2hrWVhSaElDczlJSFI1Y0dWdlppQmtZWFJoSUQwOUlDZHVkVzFpWlhJbklEOGdKeTU0SnlBNklDOWJMaXRkTHk1MFpYTjBLR1JoZEdFcElEOGdKeWNnT2lBbkt5Y3BLVHRjYmlBZ0lDQWdJQzh2SUU5aWMyTjFjbVVnZG1WeWMybHZiaUJtYjNJZ2MyOXRaU0JUWVdaaGNta2dNUzB5SUhKbGJHVmhjMlZ6TGx4dUlDQWdJQ0FnYVdZZ0tHNWhiV1VnUFQwZ0oxTmhabUZ5YVNjZ0ppWWdLQ0YyWlhKemFXOXVJSHg4SUhCaGNuTmxTVzUwS0habGNuTnBiMjRwSUQ0Z05EVXBLU0I3WEc0Z0lDQWdJQ0FnSUhabGNuTnBiMjRnUFNCa1lYUmhPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lIMWNiaUFnSUNBdkx5QkVaWFJsWTNRZ1QzQmxjbUVnWkdWemEzUnZjQ0J0YjJSbGN5NWNiaUFnSUNCcFppQW9ibUZ0WlNBOVBTQW5UM0JsY21FbklDWW1JQ0FvWkdGMFlTQTlJQzljWEdKNlltOTJmSHAyWVhZa0x5NWxlR1ZqS0c5ektTa3BJSHRjYmlBZ0lDQWdJRzVoYldVZ0t6MGdKeUFuTzF4dUlDQWdJQ0FnWkdWelkzSnBjSFJwYjI0dWRXNXphR2xtZENnblpHVnphM1J2Y0NCdGIyUmxKeWs3WEc0Z0lDQWdJQ0JwWmlBb1pHRjBZU0E5UFNBbmVuWmhkaWNwSUh0Y2JpQWdJQ0FnSUNBZ2JtRnRaU0FyUFNBblRXbHVhU2M3WEc0Z0lDQWdJQ0FnSUhabGNuTnBiMjRnUFNCdWRXeHNPMXh1SUNBZ0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDQWdibUZ0WlNBclBTQW5UVzlpYVd4bEp6dGNiaUFnSUNBZ0lIMWNiaUFnSUNBZ0lHOXpJRDBnYjNNdWNtVndiR0ZqWlNoU1pXZEZlSEFvSnlBcUp5QXJJR1JoZEdFZ0t5QW5KQ2NwTENBbkp5azdYRzRnSUNBZ2ZWeHVJQ0FnSUM4dklFUmxkR1ZqZENCRGFISnZiV1VnWkdWemEzUnZjQ0J0YjJSbExseHVJQ0FnSUdWc2MyVWdhV1lnS0c1aGJXVWdQVDBnSjFOaFptRnlhU2NnSmlZZ0wxeGNZa05vY205dFpWeGNZaTh1WlhobFl5aHNZWGx2ZFhRZ0ppWWdiR0Y1YjNWMFd6RmRLU2tnZTF4dUlDQWdJQ0FnWkdWelkzSnBjSFJwYjI0dWRXNXphR2xtZENnblpHVnphM1J2Y0NCdGIyUmxKeWs3WEc0Z0lDQWdJQ0J1WVcxbElEMGdKME5vY205dFpTQk5iMkpwYkdVbk8xeHVJQ0FnSUNBZ2RtVnljMmx2YmlBOUlHNTFiR3c3WEc1Y2JpQWdJQ0FnSUdsbUlDZ3ZYRnhpVDFNZ1dGeGNZaTh1ZEdWemRDaHZjeWtwSUh0Y2JpQWdJQ0FnSUNBZ2JXRnVkV1poWTNSMWNtVnlJRDBnSjBGd2NHeGxKenRjYmlBZ0lDQWdJQ0FnYjNNZ1BTQW5hVTlUSURRdU15c25PMXh1SUNBZ0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDQWdiM01nUFNCdWRXeHNPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lIMWNiaUFnSUNBdkx5QlRkSEpwY0NCcGJtTnZjbkpsWTNRZ1QxTWdkbVZ5YzJsdmJuTXVYRzRnSUNBZ2FXWWdLSFpsY25OcGIyNGdKaVlnZG1WeWMybHZiaTVwYm1SbGVFOW1LQ2hrWVhSaElEMGdMMXRjWEdRdVhTc2tMeTVsZUdWaktHOXpLU2twSUQwOUlEQWdKaVpjYmlBZ0lDQWdJQ0FnZFdFdWFXNWtaWGhQWmlnbkx5Y2dLeUJrWVhSaElDc2dKeTBuS1NBK0lDMHhLU0I3WEc0Z0lDQWdJQ0J2Y3lBOUlIUnlhVzBvYjNNdWNtVndiR0ZqWlNoa1lYUmhMQ0FuSnlrcE8xeHVJQ0FnSUgxY2JpQWdJQ0F2THlCQlpHUWdiR0Y1YjNWMElHVnVaMmx1WlM1Y2JpQWdJQ0JwWmlBb2JHRjViM1YwSUNZbUlDRXZYRnhpS0Q4NlFYWmhiblI4VG05dmF5bGNYR0l2TG5SbGMzUW9ibUZ0WlNrZ0ppWWdLRnh1SUNBZ0lDQWdJQ0F2UW5KdmQzTmxjbnhNZFc1aGMyTmhjR1Y4VFdGNGRHaHZiaTh1ZEdWemRDaHVZVzFsS1NCOGZGeHVJQ0FnSUNBZ0lDQnVZVzFsSUNFOUlDZFRZV1poY21rbklDWW1JQzllYVU5VEx5NTBaWE4wS0c5ektTQW1KaUF2WEZ4aVUyRm1ZWEpwWEZ4aUx5NTBaWE4wS0d4aGVXOTFkRnN4WFNrZ2ZIeGNiaUFnSUNBZ0lDQWdMMTRvUHpwQlpHOWlaWHhCY205eVlYeENjbVZoWTJoOFRXbGtiM0pwZkU5d1pYSmhmRkJvWVc1MGIyMThVbVZyYjI1eGZGSnZZMnQ4VTJGdGMzVnVaeUJKYm5SbGNtNWxkSHhUYkdWcGNHNXBjbnhYWldJcEx5NTBaWE4wS0c1aGJXVXBJQ1ltSUd4aGVXOTFkRnN4WFNrcElIdGNiaUFnSUNBZ0lDOHZJRVJ2YmlkMElHRmtaQ0JzWVhsdmRYUWdaR1YwWVdsc2N5QjBieUJrWlhOamNtbHdkR2x2YmlCcFppQjBhR1Y1SUdGeVpTQm1ZV3h6WlhrdVhHNGdJQ0FnSUNBb1pHRjBZU0E5SUd4aGVXOTFkRnRzWVhsdmRYUXViR1Z1WjNSb0lDMGdNVjBwSUNZbUlHUmxjMk55YVhCMGFXOXVMbkIxYzJnb1pHRjBZU2s3WEc0Z0lDQWdmVnh1SUNBZ0lDOHZJRU52YldKcGJtVWdZMjl1ZEdWNGRIVmhiQ0JwYm1admNtMWhkR2x2Ymk1Y2JpQWdJQ0JwWmlBb1pHVnpZM0pwY0hScGIyNHViR1Z1WjNSb0tTQjdYRzRnSUNBZ0lDQmtaWE5qY21sd2RHbHZiaUE5SUZzbktDY2dLeUJrWlhOamNtbHdkR2x2Ymk1cWIybHVLQ2M3SUNjcElDc2dKeWtuWFR0Y2JpQWdJQ0I5WEc0Z0lDQWdMeThnUVhCd1pXNWtJRzFoYm5WbVlXTjBkWEpsY2lCMGJ5QmtaWE5qY21sd2RHbHZiaTVjYmlBZ0lDQnBaaUFvYldGdWRXWmhZM1IxY21WeUlDWW1JSEJ5YjJSMVkzUWdKaVlnY0hKdlpIVmpkQzVwYm1SbGVFOW1LRzFoYm5WbVlXTjBkWEpsY2lrZ1BDQXdLU0I3WEc0Z0lDQWdJQ0JrWlhOamNtbHdkR2x2Ymk1d2RYTm9LQ2R2YmlBbklDc2diV0Z1ZFdaaFkzUjFjbVZ5S1R0Y2JpQWdJQ0I5WEc0Z0lDQWdMeThnUVhCd1pXNWtJSEJ5YjJSMVkzUWdkRzhnWkdWelkzSnBjSFJwYjI0dVhHNGdJQ0FnYVdZZ0tIQnliMlIxWTNRcElIdGNiaUFnSUNBZ0lHUmxjMk55YVhCMGFXOXVMbkIxYzJnb0tDOWViMjRnTHk1MFpYTjBLR1JsYzJOeWFYQjBhVzl1VzJSbGMyTnlhWEIwYVc5dUxteGxibWQwYUNBdElERmRLU0EvSUNjbklEb2dKMjl1SUNjcElDc2djSEp2WkhWamRDazdYRzRnSUNBZ2ZWeHVJQ0FnSUM4dklGQmhjbk5sSUhSb1pTQlBVeUJwYm5SdklHRnVJRzlpYW1WamRDNWNiaUFnSUNCcFppQW9iM01wSUh0Y2JpQWdJQ0FnSUdSaGRHRWdQU0F2SUNoYlhGeGtMaXRkS3lra0x5NWxlR1ZqS0c5ektUdGNiaUFnSUNBZ0lHbHpVM0JsWTJsaGJFTmhjMlZrVDFNZ1BTQmtZWFJoSUNZbUlHOXpMbU5vWVhKQmRDaHZjeTVzWlc1bmRHZ2dMU0JrWVhSaFd6QmRMbXhsYm1kMGFDQXRJREVwSUQwOUlDY3ZKenRjYmlBZ0lDQWdJRzl6SUQwZ2UxeHVJQ0FnSUNBZ0lDQW5ZWEpqYUdsMFpXTjBkWEpsSnpvZ016SXNYRzRnSUNBZ0lDQWdJQ2RtWVcxcGJIa25PaUFvWkdGMFlTQW1KaUFoYVhOVGNHVmphV0ZzUTJGelpXUlBVeWtnUHlCdmN5NXlaWEJzWVdObEtHUmhkR0ZiTUYwc0lDY25LU0E2SUc5ekxGeHVJQ0FnSUNBZ0lDQW5kbVZ5YzJsdmJpYzZJR1JoZEdFZ1B5QmtZWFJoV3pGZElEb2diblZzYkN4Y2JpQWdJQ0FnSUNBZ0ozUnZVM1J5YVc1bkp6b2dablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdJQ0FnSUNBZ2RtRnlJSFpsY25OcGIyNGdQU0IwYUdsekxuWmxjbk5wYjI0N1hHNGdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlIUm9hWE11Wm1GdGFXeDVJQ3NnS0NoMlpYSnphVzl1SUNZbUlDRnBjMU53WldOcFlXeERZWE5sWkU5VEtTQS9JQ2NnSnlBcklIWmxjbk5wYjI0Z09pQW5KeWtnS3lBb2RHaHBjeTVoY21Ob2FYUmxZM1IxY21VZ1BUMGdOalFnUHlBbklEWTBMV0pwZENjZ09pQW5KeWs3WEc0Z0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUgwN1hHNGdJQ0FnZlZ4dUlDQWdJQzh2SUVGa1pDQmljbTkzYzJWeUwwOVRJR0Z5WTJocGRHVmpkSFZ5WlM1Y2JpQWdJQ0JwWmlBb0tHUmhkR0VnUFNBdlhGeGlLRDg2UVUxRWZFbEJmRmRwYm54WFQxZDhlRGcyWDN4NEtUWTBYRnhpTDJrdVpYaGxZeWhoY21Ob0tTa2dKaVlnSVM5Y1hHSnBOamcyWEZ4aUwya3VkR1Z6ZENoaGNtTm9LU2tnZTF4dUlDQWdJQ0FnYVdZZ0tHOXpLU0I3WEc0Z0lDQWdJQ0FnSUc5ekxtRnlZMmhwZEdWamRIVnlaU0E5SURZME8xeHVJQ0FnSUNBZ0lDQnZjeTVtWVcxcGJIa2dQU0J2Y3k1bVlXMXBiSGt1Y21Wd2JHRmpaU2hTWldkRmVIQW9KeUFxSnlBcklHUmhkR0VwTENBbkp5azdYRzRnSUNBZ0lDQjlYRzRnSUNBZ0lDQnBaaUFvWEc0Z0lDQWdJQ0FnSUNBZ2JtRnRaU0FtSmlBb0wxeGNZbGRQVnpZMFhGeGlMMmt1ZEdWemRDaDFZU2tnZkh4Y2JpQWdJQ0FnSUNBZ0lDQW9kWE5sUm1WaGRIVnlaWE1nSmlZZ0wxeGNkeWcvT2pnMmZETXlLU1F2TG5SbGMzUW9ibUYyTG1Od2RVTnNZWE56SUh4OElHNWhkaTV3YkdGMFptOXliU2tnSmlZZ0lTOWNYR0pYYVc0Mk5Ec2dlRFkwWEZ4aUwya3VkR1Z6ZENoMVlTa3BLVnh1SUNBZ0lDQWdLU0I3WEc0Z0lDQWdJQ0FnSUdSbGMyTnlhWEIwYVc5dUxuVnVjMmhwWm5Rb0p6TXlMV0pwZENjcE8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JpQWdJQ0F2THlCRGFISnZiV1VnTXprZ1lXNWtJR0ZpYjNabElHOXVJRTlUSUZnZ2FYTWdZV3gzWVhseklEWTBMV0pwZEM1Y2JpQWdJQ0JsYkhObElHbG1JQ2hjYmlBZ0lDQWdJQ0FnYjNNZ0ppWWdMMTVQVXlCWUx5NTBaWE4wS0c5ekxtWmhiV2xzZVNrZ0ppWmNiaUFnSUNBZ0lDQWdibUZ0WlNBOVBTQW5RMmh5YjIxbEp5QW1KaUJ3WVhKelpVWnNiMkYwS0habGNuTnBiMjRwSUQ0OUlETTVYRzRnSUNBZ0tTQjdYRzRnSUNBZ0lDQnZjeTVoY21Ob2FYUmxZM1IxY21VZ1BTQTJORHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQjFZU0I4ZkNBb2RXRWdQU0J1ZFd4c0tUdGNibHh1SUNBZ0lDOHFMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRLaTljYmx4dUlDQWdJQzhxS2x4dUlDQWdJQ0FxSUZSb1pTQndiR0YwWm05eWJTQnZZbXBsWTNRdVhHNGdJQ0FnSUNwY2JpQWdJQ0FnS2lCQWJtRnRaU0J3YkdGMFptOXliVnh1SUNBZ0lDQXFJRUIwZVhCbElFOWlhbVZqZEZ4dUlDQWdJQ0FxTDF4dUlDQWdJSFpoY2lCd2JHRjBabTl5YlNBOUlIdDlPMXh1WEc0Z0lDQWdMeW9xWEc0Z0lDQWdJQ29nVkdobElIQnNZWFJtYjNKdElHUmxjMk55YVhCMGFXOXVMbHh1SUNBZ0lDQXFYRzRnSUNBZ0lDb2dRRzFsYldKbGNrOW1JSEJzWVhSbWIzSnRYRzRnSUNBZ0lDb2dRSFI1Y0dVZ2MzUnlhVzVuZkc1MWJHeGNiaUFnSUNBZ0tpOWNiaUFnSUNCd2JHRjBabTl5YlM1a1pYTmpjbWx3ZEdsdmJpQTlJSFZoTzF4dVhHNGdJQ0FnTHlvcVhHNGdJQ0FnSUNvZ1ZHaGxJRzVoYldVZ2IyWWdkR2hsSUdKeWIzZHpaWEluY3lCc1lYbHZkWFFnWlc1bmFXNWxMbHh1SUNBZ0lDQXFYRzRnSUNBZ0lDb2dWR2hsSUd4cGMzUWdiMllnWTI5dGJXOXVJR3hoZVc5MWRDQmxibWRwYm1WeklHbHVZMngxWkdVNlhHNGdJQ0FnSUNvZ1hDSkNiR2x1YTF3aUxDQmNJa1ZrWjJWSVZFMU1YQ0lzSUZ3aVIyVmphMjljSWl3Z1hDSlVjbWxrWlc1MFhDSWdZVzVrSUZ3aVYyVmlTMmwwWENKY2JpQWdJQ0FnS2x4dUlDQWdJQ0FxSUVCdFpXMWlaWEpQWmlCd2JHRjBabTl5YlZ4dUlDQWdJQ0FxSUVCMGVYQmxJSE4wY21sdVozeHVkV3hzWEc0Z0lDQWdJQ292WEc0Z0lDQWdjR3hoZEdadmNtMHViR0Y1YjNWMElEMGdiR0Y1YjNWMElDWW1JR3hoZVc5MWRGc3dYVHRjYmx4dUlDQWdJQzhxS2x4dUlDQWdJQ0FxSUZSb1pTQnVZVzFsSUc5bUlIUm9aU0J3Y205a2RXTjBKM01nYldGdWRXWmhZM1IxY21WeUxseHVJQ0FnSUNBcVhHNGdJQ0FnSUNvZ1ZHaGxJR3hwYzNRZ2IyWWdiV0Z1ZFdaaFkzUjFjbVZ5Y3lCcGJtTnNkV1JsT2x4dUlDQWdJQ0FxSUZ3aVFYQndiR1ZjSWl3Z1hDSkJjbU5vYjNOY0lpd2dYQ0pCYldGNmIyNWNJaXdnWENKQmMzVnpYQ0lzSUZ3aVFtRnlibVZ6SUNZZ1RtOWliR1ZjSWl3Z1hDSkNiR0ZqYTBKbGNuSjVYQ0lzWEc0Z0lDQWdJQ29nWENKSGIyOW5iR1ZjSWl3Z1hDSklVRndpTENCY0lraFVRMXdpTENCY0lreEhYQ0lzSUZ3aVRXbGpjbTl6YjJaMFhDSXNJRndpVFc5MGIzSnZiR0ZjSWl3Z1hDSk9hVzUwWlc1a2Ixd2lMRnh1SUNBZ0lDQXFJRndpVG05cmFXRmNJaXdnWENKVFlXMXpkVzVuWENJZ1lXNWtJRndpVTI5dWVWd2lYRzRnSUNBZ0lDcGNiaUFnSUNBZ0tpQkFiV1Z0WW1WeVQyWWdjR3hoZEdadmNtMWNiaUFnSUNBZ0tpQkFkSGx3WlNCemRISnBibWQ4Ym5Wc2JGeHVJQ0FnSUNBcUwxeHVJQ0FnSUhCc1lYUm1iM0p0TG0xaGJuVm1ZV04wZFhKbGNpQTlJRzFoYm5WbVlXTjBkWEpsY2p0Y2JseHVJQ0FnSUM4cUtseHVJQ0FnSUNBcUlGUm9aU0J1WVcxbElHOW1JSFJvWlNCaWNtOTNjMlZ5TDJWdWRtbHliMjV0Wlc1MExseHVJQ0FnSUNBcVhHNGdJQ0FnSUNvZ1ZHaGxJR3hwYzNRZ2IyWWdZMjl0Ylc5dUlHSnliM2R6WlhJZ2JtRnRaWE1nYVc1amJIVmtaVHBjYmlBZ0lDQWdLaUJjSWtOb2NtOXRaVndpTENCY0lrVnNaV04wY205dVhDSXNJRndpUm1seVpXWnZlRndpTENCY0lrWnBjbVZtYjNnZ1ptOXlJR2xQVTF3aUxDQmNJa2xGWENJc1hHNGdJQ0FnSUNvZ1hDSk5hV055YjNOdlpuUWdSV1JuWlZ3aUxDQmNJbEJvWVc1MGIyMUtVMXdpTENCY0lsTmhabUZ5YVZ3aUxDQmNJbE5sWVUxdmJtdGxlVndpTENCY0lsTnBiR3RjSWl4Y2JpQWdJQ0FnS2lCY0lrOXdaWEpoSUUxcGJtbGNJaUJoYm1RZ1hDSlBjR1Z5WVZ3aVhHNGdJQ0FnSUNwY2JpQWdJQ0FnS2lCTmIySnBiR1VnZG1WeWMybHZibk1nYjJZZ2MyOXRaU0JpY205M2MyVnljeUJvWVhabElGd2lUVzlpYVd4bFhDSWdZWEJ3Wlc1a1pXUWdkRzhnZEdobGFYSWdibUZ0WlRwY2JpQWdJQ0FnS2lCbFp5NGdYQ0pEYUhKdmJXVWdUVzlpYVd4bFhDSXNJRndpUm1seVpXWnZlQ0JOYjJKcGJHVmNJaXdnWENKSlJTQk5iMkpwYkdWY0lpQmhibVFnWENKUGNHVnlZU0JOYjJKcGJHVmNJbHh1SUNBZ0lDQXFYRzRnSUNBZ0lDb2dRRzFsYldKbGNrOW1JSEJzWVhSbWIzSnRYRzRnSUNBZ0lDb2dRSFI1Y0dVZ2MzUnlhVzVuZkc1MWJHeGNiaUFnSUNBZ0tpOWNiaUFnSUNCd2JHRjBabTl5YlM1dVlXMWxJRDBnYm1GdFpUdGNibHh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRlJvWlNCaGJIQm9ZUzlpWlhSaElISmxiR1ZoYzJVZ2FXNWthV05oZEc5eUxseHVJQ0FnSUNBcVhHNGdJQ0FnSUNvZ1FHMWxiV0psY2s5bUlIQnNZWFJtYjNKdFhHNGdJQ0FnSUNvZ1FIUjVjR1VnYzNSeWFXNW5mRzUxYkd4Y2JpQWdJQ0FnS2k5Y2JpQWdJQ0J3YkdGMFptOXliUzV3Y21WeVpXeGxZWE5sSUQwZ2NISmxjbVZzWldGelpUdGNibHh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRlJvWlNCdVlXMWxJRzltSUhSb1pTQndjbTlrZFdOMElHaHZjM1JwYm1jZ2RHaGxJR0p5YjNkelpYSXVYRzRnSUNBZ0lDcGNiaUFnSUNBZ0tpQlVhR1VnYkdsemRDQnZaaUJqYjIxdGIyNGdjSEp2WkhWamRITWdhVzVqYkhWa1pUcGNiaUFnSUNBZ0tseHVJQ0FnSUNBcUlGd2lRbXhoWTJ0Q1pYSnllVndpTENCY0lrZGhiR0Y0ZVNCVE5Gd2lMQ0JjSWt4MWJXbGhYQ0lzSUZ3aWFWQmhaRndpTENCY0ltbFFiMlJjSWl3Z1hDSnBVR2h2Ym1WY0lpd2dYQ0pMYVc1a2JHVmNJaXhjYmlBZ0lDQWdLaUJjSWt0cGJtUnNaU0JHYVhKbFhDSXNJRndpVG1WNGRYTmNJaXdnWENKT2IyOXJYQ0lzSUZ3aVVHeGhlVUp2YjJ0Y0lpd2dYQ0pVYjNWamFGQmhaRndpSUdGdVpDQmNJbFJ5WVc1elptOXliV1Z5WENKY2JpQWdJQ0FnS2x4dUlDQWdJQ0FxSUVCdFpXMWlaWEpQWmlCd2JHRjBabTl5YlZ4dUlDQWdJQ0FxSUVCMGVYQmxJSE4wY21sdVozeHVkV3hzWEc0Z0lDQWdJQ292WEc0Z0lDQWdjR3hoZEdadmNtMHVjSEp2WkhWamRDQTlJSEJ5YjJSMVkzUTdYRzVjYmlBZ0lDQXZLaXBjYmlBZ0lDQWdLaUJVYUdVZ1luSnZkM05sY2lkeklIVnpaWElnWVdkbGJuUWdjM1J5YVc1bkxseHVJQ0FnSUNBcVhHNGdJQ0FnSUNvZ1FHMWxiV0psY2s5bUlIQnNZWFJtYjNKdFhHNGdJQ0FnSUNvZ1FIUjVjR1VnYzNSeWFXNW5mRzUxYkd4Y2JpQWdJQ0FnS2k5Y2JpQWdJQ0J3YkdGMFptOXliUzUxWVNBOUlIVmhPMXh1WEc0Z0lDQWdMeW9xWEc0Z0lDQWdJQ29nVkdobElHSnliM2R6WlhJdlpXNTJhWEp2Ym0xbGJuUWdkbVZ5YzJsdmJpNWNiaUFnSUNBZ0tseHVJQ0FnSUNBcUlFQnRaVzFpWlhKUFppQndiR0YwWm05eWJWeHVJQ0FnSUNBcUlFQjBlWEJsSUhOMGNtbHVaM3h1ZFd4c1hHNGdJQ0FnSUNvdlhHNGdJQ0FnY0d4aGRHWnZjbTB1ZG1WeWMybHZiaUE5SUc1aGJXVWdKaVlnZG1WeWMybHZianRjYmx4dUlDQWdJQzhxS2x4dUlDQWdJQ0FxSUZSb1pTQnVZVzFsSUc5bUlIUm9aU0J2Y0dWeVlYUnBibWNnYzNsemRHVnRMbHh1SUNBZ0lDQXFYRzRnSUNBZ0lDb2dRRzFsYldKbGNrOW1JSEJzWVhSbWIzSnRYRzRnSUNBZ0lDb2dRSFI1Y0dVZ1QySnFaV04wWEc0Z0lDQWdJQ292WEc0Z0lDQWdjR3hoZEdadmNtMHViM01nUFNCdmN5QjhmQ0I3WEc1Y2JpQWdJQ0FnSUM4cUtseHVJQ0FnSUNBZ0lDb2dWR2hsSUVOUVZTQmhjbU5vYVhSbFkzUjFjbVVnZEdobElFOVRJR2x6SUdKMWFXeDBJR1p2Y2k1Y2JpQWdJQ0FnSUNBcVhHNGdJQ0FnSUNBZ0tpQkFiV1Z0WW1WeVQyWWdjR3hoZEdadmNtMHViM05jYmlBZ0lDQWdJQ0FxSUVCMGVYQmxJRzUxYldKbGNueHVkV3hzWEc0Z0lDQWdJQ0FnS2k5Y2JpQWdJQ0FnSUNkaGNtTm9hWFJsWTNSMWNtVW5PaUJ1ZFd4c0xGeHVYRzRnSUNBZ0lDQXZLaXBjYmlBZ0lDQWdJQ0FxSUZSb1pTQm1ZVzFwYkhrZ2IyWWdkR2hsSUU5VExseHVJQ0FnSUNBZ0lDcGNiaUFnSUNBZ0lDQXFJRU52YlcxdmJpQjJZV3gxWlhNZ2FXNWpiSFZrWlRwY2JpQWdJQ0FnSUNBcUlGd2lWMmx1Wkc5M2Mxd2lMQ0JjSWxkcGJtUnZkM01nVTJWeWRtVnlJREl3TURnZ1VqSWdMeUEzWENJc0lGd2lWMmx1Wkc5M2N5QlRaWEoyWlhJZ01qQXdPQ0F2SUZacGMzUmhYQ0lzWEc0Z0lDQWdJQ0FnS2lCY0lsZHBibVJ2ZDNNZ1dGQmNJaXdnWENKUFV5QllYQ0lzSUZ3aVZXSjFiblIxWENJc0lGd2lSR1ZpYVdGdVhDSXNJRndpUm1Wa2IzSmhYQ0lzSUZ3aVVtVmtJRWhoZEZ3aUxDQmNJbE4xVTBWY0lpeGNiaUFnSUNBZ0lDQXFJRndpUVc1a2NtOXBaRndpTENCY0ltbFBVMXdpSUdGdVpDQmNJbGRwYm1SdmQzTWdVR2h2Ym1WY0lseHVJQ0FnSUNBZ0lDcGNiaUFnSUNBZ0lDQXFJRUJ0WlcxaVpYSlBaaUJ3YkdGMFptOXliUzV2YzF4dUlDQWdJQ0FnSUNvZ1FIUjVjR1VnYzNSeWFXNW5mRzUxYkd4Y2JpQWdJQ0FnSUNBcUwxeHVJQ0FnSUNBZ0oyWmhiV2xzZVNjNklHNTFiR3dzWEc1Y2JpQWdJQ0FnSUM4cUtseHVJQ0FnSUNBZ0lDb2dWR2hsSUhabGNuTnBiMjRnYjJZZ2RHaGxJRTlUTGx4dUlDQWdJQ0FnSUNwY2JpQWdJQ0FnSUNBcUlFQnRaVzFpWlhKUFppQndiR0YwWm05eWJTNXZjMXh1SUNBZ0lDQWdJQ29nUUhSNWNHVWdjM1J5YVc1bmZHNTFiR3hjYmlBZ0lDQWdJQ0FxTDF4dUlDQWdJQ0FnSjNabGNuTnBiMjRuT2lCdWRXeHNMRnh1WEc0Z0lDQWdJQ0F2S2lwY2JpQWdJQ0FnSUNBcUlGSmxkSFZ5Ym5NZ2RHaGxJRTlUSUhOMGNtbHVaeTVjYmlBZ0lDQWdJQ0FxWEc0Z0lDQWdJQ0FnS2lCQWJXVnRZbVZ5VDJZZ2NHeGhkR1p2Y20wdWIzTmNiaUFnSUNBZ0lDQXFJRUJ5WlhSMWNtNXpJSHR6ZEhKcGJtZDlJRlJvWlNCUFV5QnpkSEpwYm1jdVhHNGdJQ0FnSUNBZ0tpOWNiaUFnSUNBZ0lDZDBiMU4wY21sdVp5YzZJR1oxYm1OMGFXOXVLQ2tnZXlCeVpYUjFjbTRnSjI1MWJHd25PeUI5WEc0Z0lDQWdmVHRjYmx4dUlDQWdJSEJzWVhSbWIzSnRMbkJoY25ObElEMGdjR0Z5YzJVN1hHNGdJQ0FnY0d4aGRHWnZjbTB1ZEc5VGRISnBibWNnUFNCMGIxTjBjbWx1WjFCc1lYUm1iM0p0TzF4dVhHNGdJQ0FnYVdZZ0tIQnNZWFJtYjNKdExuWmxjbk5wYjI0cElIdGNiaUFnSUNBZ0lHUmxjMk55YVhCMGFXOXVMblZ1YzJocFpuUW9kbVZ5YzJsdmJpazdYRzRnSUNBZ2ZWeHVJQ0FnSUdsbUlDaHdiR0YwWm05eWJTNXVZVzFsS1NCN1hHNGdJQ0FnSUNCa1pYTmpjbWx3ZEdsdmJpNTFibk5vYVdaMEtHNWhiV1VwTzF4dUlDQWdJSDFjYmlBZ0lDQnBaaUFvYjNNZ0ppWWdibUZ0WlNBbUppQWhLRzl6SUQwOUlGTjBjbWx1WnlodmN5a3VjM0JzYVhRb0p5QW5LVnN3WFNBbUppQW9iM01nUFQwZ2JtRnRaUzV6Y0d4cGRDZ25JQ2NwV3pCZElIeDhJSEJ5YjJSMVkzUXBLU2tnZTF4dUlDQWdJQ0FnWkdWelkzSnBjSFJwYjI0dWNIVnphQ2h3Y205a2RXTjBJRDhnSnlnbklDc2diM01nS3lBbktTY2dPaUFuYjI0Z0p5QXJJRzl6S1R0Y2JpQWdJQ0I5WEc0Z0lDQWdhV1lnS0dSbGMyTnlhWEIwYVc5dUxteGxibWQwYUNrZ2UxeHVJQ0FnSUNBZ2NHeGhkR1p2Y20wdVpHVnpZM0pwY0hScGIyNGdQU0JrWlhOamNtbHdkR2x2Ymk1cWIybHVLQ2NnSnlrN1hHNGdJQ0FnZlZ4dUlDQWdJSEpsZEhWeWJpQndiR0YwWm05eWJUdGNiaUFnZlZ4dVhHNGdJQzhxTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwcUwxeHVYRzRnSUM4dklFVjRjRzl5ZENCd2JHRjBabTl5YlM1Y2JpQWdkbUZ5SUhCc1lYUm1iM0p0SUQwZ2NHRnljMlVvS1R0Y2JseHVJQ0F2THlCVGIyMWxJRUZOUkNCaWRXbHNaQ0J2Y0hScGJXbDZaWEp6TENCc2FXdGxJSEl1YW5Nc0lHTm9aV05ySUdadmNpQmpiMjVrYVhScGIyNGdjR0YwZEdWeWJuTWdiR2xyWlNCMGFHVWdabTlzYkc5M2FXNW5PbHh1SUNCcFppQW9kSGx3Wlc5bUlHUmxabWx1WlNBOVBTQW5ablZ1WTNScGIyNG5JQ1ltSUhSNWNHVnZaaUJrWldacGJtVXVZVzFrSUQwOUlDZHZZbXBsWTNRbklDWW1JR1JsWm1sdVpTNWhiV1FwSUh0Y2JpQWdJQ0F2THlCRmVIQnZjMlVnY0d4aGRHWnZjbTBnYjI0Z2RHaGxJR2RzYjJKaGJDQnZZbXBsWTNRZ2RHOGdjSEpsZG1WdWRDQmxjbkp2Y25NZ2QyaGxiaUJ3YkdGMFptOXliU0JwYzF4dUlDQWdJQzh2SUd4dllXUmxaQ0JpZVNCaElITmpjbWx3ZENCMFlXY2dhVzRnZEdobElIQnlaWE5sYm1ObElHOW1JR0Z1SUVGTlJDQnNiMkZrWlhJdVhHNGdJQ0FnTHk4Z1UyVmxJR2gwZEhBNkx5OXlaWEYxYVhKbGFuTXViM0puTDJSdlkzTXZaWEp5YjNKekxtaDBiV3dqYldsemJXRjBZMmdnWm05eUlHMXZjbVVnWkdWMFlXbHNjeTVjYmlBZ0lDQnliMjkwTG5Cc1lYUm1iM0p0SUQwZ2NHeGhkR1p2Y20wN1hHNWNiaUFnSUNBdkx5QkVaV1pwYm1VZ1lYTWdZVzRnWVc1dmJubHRiM1Z6SUcxdlpIVnNaU0J6YnlCd2JHRjBabTl5YlNCallXNGdZbVVnWVd4cFlYTmxaQ0IwYUhKdmRXZG9JSEJoZEdnZ2JXRndjR2x1Wnk1Y2JpQWdJQ0JrWldacGJtVW9ablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdjR3hoZEdadmNtMDdYRzRnSUNBZ2ZTazdYRzRnSUgxY2JpQWdMeThnUTJobFkyc2dabTl5SUdCbGVIQnZjblJ6WUNCaFpuUmxjaUJnWkdWbWFXNWxZQ0JwYmlCallYTmxJR0VnWW5WcGJHUWdiM0IwYVcxcGVtVnlJR0ZrWkhNZ1lXNGdZR1Y0Y0c5eWRITmdJRzlpYW1WamRDNWNiaUFnWld4elpTQnBaaUFvWm5KbFpVVjRjRzl5ZEhNZ0ppWWdabkpsWlUxdlpIVnNaU2tnZTF4dUlDQWdJQzh2SUVWNGNHOXlkQ0JtYjNJZ1EyOXRiVzl1U2xNZ2MzVndjRzl5ZEM1Y2JpQWdJQ0JtYjNKUGQyNG9jR3hoZEdadmNtMHNJR1oxYm1OMGFXOXVLSFpoYkhWbExDQnJaWGtwSUh0Y2JpQWdJQ0FnSUdaeVpXVkZlSEJ2Y25SelcydGxlVjBnUFNCMllXeDFaVHRjYmlBZ0lDQjlLVHRjYmlBZ2ZWeHVJQ0JsYkhObElIdGNiaUFnSUNBdkx5QkZlSEJ2Y25RZ2RHOGdkR2hsSUdkc2IySmhiQ0J2WW1wbFkzUXVYRzRnSUNBZ2NtOXZkQzV3YkdGMFptOXliU0E5SUhCc1lYUm1iM0p0TzF4dUlDQjlYRzU5TG1OaGJHd29kR2hwY3lrcE8xeHVJaXdpTHlvcVhHNGdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDb2dUR2xqWlc1elpXUWdkVzVrWlhJZ1RVbFVJQ2hvZEhSd2N6b3ZMMmRwZEdoMVlpNWpiMjB2Y1hWaGNtc3RaR1YyTDFCb2IyNXZiaTFHY21GdFpYZHZjbXN2WW14dllpOXRZWE4wWlhJdlRFbERSVTVUUlNsY2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0tpOWNibWx0Y0c5eWRDQkRiMjF3YjI1bGJuUWdabkp2YlNBbkxpNHZZMjl0Y0c5dVpXNTBKMXh1YVcxd2IzSjBJRU52Ykd4aGNITmxJR1p5YjIwZ0p5NHVMMk52Ykd4aGNITmxKMXh1YVcxd2IzSjBJSHNnWjJWMFFYUjBjbWxpZFhSbGMwTnZibVpwWnlCOUlHWnliMjBnSnk0dUwyTnZiWEJ2Ym1WdWRFMWhibUZuWlhJblhHNXBiWEJ2Y25RZ1JYWmxiblFnWm5KdmJTQW5MaTR2TGk0dlkyOXlaUzlsZG1WdWRITW5YRzVwYlhCdmNuUWdleUJtYVc1a1ZHRnlaMlYwUW5sRGJHRnpjeUI5SUdaeWIyMGdKeTR1THk0dUwyTnZjbVV2ZFhScGJITW5YRzVjYm1OdmJuTjBJRUZqWTI5eVpHbHZiaUE5SUNnb0tTQTlQaUI3WEc0Z0lDOHFLbHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvZ1EyOXVjM1JoYm5SelhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaTljYmx4dUlDQmpiMjV6ZENCT1FVMUZJRDBnSjJGalkyOXlaR2x2YmlkY2JpQWdZMjl1YzNRZ1ZrVlNVMGxQVGlBOUlDY3lMakF1TUNkY2JpQWdZMjl1YzNRZ1JFVkdRVlZNVkY5UVVrOVFSVkpVU1VWVElEMGdlMXh1SUNBZ0lHVnNaVzFsYm5RNklHNTFiR3dzWEc0Z0lIMWNiaUFnWTI5dWMzUWdSRUZVUVY5QlZGUlNVMTlRVWs5UVJWSlVTVVZUSUQwZ1cxeHVJQ0JkWEc1Y2JpQWdMeW9xWEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpQkRiR0Z6Y3lCRVpXWnBibWwwYVc5dVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaTljYmx4dUlDQmpiR0Z6Y3lCQlkyTnZjbVJwYjI0Z1pYaDBaVzVrY3lCRGIyMXdiMjVsYm5RZ2UxeHVYRzRnSUNBZ1kyOXVjM1J5ZFdOMGIzSW9iM0IwYVc5dWN5QTlJSHQ5S1NCN1hHNGdJQ0FnSUNCemRYQmxjaWhPUVUxRkxDQldSVkpUU1U5T0xDQkVSVVpCVlV4VVgxQlNUMUJGVWxSSlJWTXNJRzl3ZEdsdmJuTXNJRVJCVkVGZlFWUlVVbE5mVUZKUFVFVlNWRWxGVXl3Z1ptRnNjMlVzSUdaaGJITmxLVnh1WEc0Z0lDQWdJQ0IwYUdsekxtTnZiR3hoY0hObGN5QTlJRnRkWEc1Y2JpQWdJQ0FnSUdOdmJuTjBJSFJ2WjJkc1pYTWdQU0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1eGRXVnllVk5sYkdWamRHOXlRV3hzS0dCYlpHRjBZUzEwYjJkbmJHVTlYQ0lrZTA1QlRVVjlYQ0pkWUNsY2JpQWdJQ0FnSUhSdloyZHNaWE11Wm05eVJXRmphQ2dvZEc5bloyeGxLU0E5UGlCN1hHNGdJQ0FnSUNBZ0lHTnZibk4wSUdOdmJHeGhjSE5sU1dRZ1BTQjBiMmRuYkdVdVoyVjBRWFIwY21saWRYUmxLQ2RvY21WbUp5bGNiaUFnSUNBZ0lDQWdZMjl1YzNRZ1kyOXNiR0Z3YzJVZ1BTQmtiMk4xYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5S0dOdmJHeGhjSE5sU1dRcFhHNWNiaUFnSUNBZ0lDQWdhV1lnS0dOdmJHeGhjSE5sS1NCN1hHNGdJQ0FnSUNBZ0lDQWdkR2hwY3k1aFpHUkRiMnhzWVhCelpTaGpiMnhzWVhCelpTbGNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdmU2xjYmlBZ0lDQjlYRzVjYmlBZ0lDQnZia1ZzWlcxbGJuUkZkbVZ1ZENobGRtVnVkQ2tnZTF4dUlDQWdJQ0FnWTI5dWMzUWdhV1FnUFNCbGRtVnVkQzUwWVhKblpYUXVaMlYwUVhSMGNtbGlkWFJsS0Nkb2NtVm1KeWxjYmlBZ0lDQWdJR052Ym5OMElHVnNaVzFsYm5RZ1BTQmtiMk4xYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5S0dsa0tWeHVYRzRnSUNBZ0lDQjBhR2x6TG5ObGRFTnZiR3hoY0hObGN5aGxiR1Z0Wlc1MEtWeHVJQ0FnSUgxY2JseHVJQ0FnSUdGa1pFTnZiR3hoY0hObEtHVnNaVzFsYm5RcElIdGNiaUFnSUNBZ0lHTnZibk4wSUdOdmJHeGhjSE5sSUQwZ2JtVjNJRU52Ykd4aGNITmxLSHRjYmlBZ0lDQWdJQ0FnWld4bGJXVnVkQ3hjYmlBZ0lDQWdJSDBwWEc0Z0lDQWdJQ0IwYUdsekxtTnZiR3hoY0hObGN5NXdkWE5vS0dOdmJHeGhjSE5sS1Z4dVhHNGdJQ0FnSUNCeVpYUjFjbTRnWTI5c2JHRndjMlZjYmlBZ0lDQjlYRzVjYmlBZ0lDQm5aWFJEYjJ4c1lYQnpaU2hsYkdWdFpXNTBLU0I3WEc0Z0lDQWdJQ0JzWlhRZ1kyOXNiR0Z3YzJVZ1BTQjBhR2x6TG1OdmJHeGhjSE5sY3k1bWFXNWtLR01nUFQ0Z1l5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdVoyVjBRWFIwY21saWRYUmxLQ2RwWkNjcElEMDlQU0JsYkdWdFpXNTBMbWRsZEVGMGRISnBZblYwWlNnbmFXUW5LU2xjYmx4dUlDQWdJQ0FnYVdZZ0tDRmpiMnhzWVhCelpTa2dlMXh1SUNBZ0lDQWdJQ0F2THlCamNtVmhkR1VnWVNCdVpYY2dZMjlzYkdGd2MyVmNiaUFnSUNBZ0lDQWdZMjlzYkdGd2MyVWdQU0IwYUdsekxtRmtaRU52Ykd4aGNITmxLQ2xjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnY21WMGRYSnVJR052Ykd4aGNITmxYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1oyVjBRMjlzYkdGd2MyVnpLQ2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVJSFJvYVhNdVkyOXNiR0Z3YzJWelhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYzJWMFEyOXNiR0Z3YzJWektITm9iM2REYjJ4c1lYQnpaU2tnZTF4dUlDQWdJQ0FnWTI5dWMzUWdZMjlzYkdGd2MyVWdQU0IwYUdsekxtZGxkRU52Ykd4aGNITmxLSE5vYjNkRGIyeHNZWEJ6WlNsY2JpQWdJQ0FnSUhSb2FYTXVZMjlzYkdGd2MyVnpMbVp2Y2tWaFkyZ29LR01wSUQwK0lIdGNiaUFnSUNBZ0lDQWdhV1lnS0dNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1kbGRFRjBkSEpwWW5WMFpTZ25hV1FuS1NBaFBUMGdjMmh2ZDBOdmJHeGhjSE5sTG1kbGRFRjBkSEpwWW5WMFpTZ25hV1FuS1NrZ2UxeHVJQ0FnSUNBZ0lDQWdJR011YUdsa1pTZ3BYRzRnSUNBZ0lDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQWdJQ0FnWTI5c2JHRndjMlV1ZEc5bloyeGxLQ2xjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnZlNsY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J6YUc5M0tHTnZiR3hoY0hObFJXd3BJSHRjYmlBZ0lDQWdJR3hsZENCamIyeHNZWEJ6WlNBOUlHTnZiR3hoY0hObFJXeGNiaUFnSUNBZ0lHbG1JQ2gwZVhCbGIyWWdZMjlzYkdGd2MyVkZiQ0E5UFQwZ0ozTjBjbWx1WnljcElIdGNiaUFnSUNBZ0lDQWdZMjlzYkdGd2MyVWdQU0JrYjJOMWJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eUtHTnZiR3hoY0hObFJXd3BYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR2xtSUNnaFkyOXNiR0Z3YzJVcElIdGNiaUFnSUNBZ0lDQWdkR2h5YjNjZ2JtVjNJRVZ5Y205eUtHQWtlMDVCVFVWOUxpQlVhR1VnWTI5c2JHRndjMmxpYkdVZ0pIdGpiMnhzWVhCelpVVnNmU0JwY3lCaGJpQnBiblpoYkdsa0lFaFVUVXhGYkdWdFpXNTBMbUFwWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhSb2FYTXVjMlYwUTI5c2JHRndjMlZ6S0dOdmJHeGhjSE5sS1Z4dVhHNGdJQ0FnSUNCeVpYUjFjbTRnZEhKMVpWeHVJQ0FnSUgxY2JseHVJQ0FnSUdocFpHVW9ZMjlzYkdGd2MyVkZiQ2tnZTF4dUlDQWdJQ0FnYkdWMElHTnZiR3hoY0hObElEMGdZMjlzYkdGd2MyVkZiRnh1SUNBZ0lDQWdhV1lnS0hSNWNHVnZaaUJqYjJ4c1lYQnpaVVZzSUQwOVBTQW5jM1J5YVc1bkp5a2dlMXh1SUNBZ0lDQWdJQ0JqYjJ4c1lYQnpaU0E5SUdSdlkzVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSW9ZMjlzYkdGd2MyVkZiQ2xjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnYVdZZ0tDRmpiMnhzWVhCelpTa2dlMXh1SUNBZ0lDQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9ZQ1I3VGtGTlJYMHVJRlJvWlNCamIyeHNZWEJ6YVdKc1pTQWtlMk52Ykd4aGNITmxSV3g5SUdseklHRnVJR2x1ZG1Gc2FXUWdTRlJOVEVWc1pXMWxiblF1WUNsY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ1kyOXVjM1FnWTI5c2JHRndjMlZQWW1vZ1BTQjBhR2x6TG1kbGRFTnZiR3hoY0hObEtHTnZiR3hoY0hObEtWeHVJQ0FnSUNBZ2NtVjBkWEp1SUdOdmJHeGhjSE5sVDJKcUxtaHBaR1VvS1Z4dUlDQWdJSDFjYmx4dUlDQWdJSE4wWVhScFl5QmZSRTlOU1c1MFpYSm1ZV05sS0c5d2RHbHZibk1wSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJ6ZFhCbGNpNWZSRTlOU1c1MFpYSm1ZV05sS0VGalkyOXlaR2x2Yml3Z2IzQjBhVzl1Y3lsY2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxSUVSUFRTQkJjR2tnYVcxd2JHVnRaVzUwWVhScGIyNWNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxTDF4dUlDQmpiMjV6ZENCamIyMXdiMjVsYm5SeklEMGdXMTFjYmx4dUlDQmpiMjV6ZENCaFkyTnZjbVJwYjI1eklEMGdaRzlqZFcxbGJuUXVjWFZsY25sVFpXeGxZM1J2Y2tGc2JDaGdMaVI3VGtGTlJYMWdLVnh1SUNCcFppQW9ZV05qYjNKa2FXOXVjeWtnZTF4dUlDQWdJR0ZqWTI5eVpHbHZibk11Wm05eVJXRmphQ2dvWld4bGJXVnVkQ2tnUFQ0Z2UxeHVJQ0FnSUNBZ1kyOXVjM1FnWTI5dVptbG5JRDBnWjJWMFFYUjBjbWxpZFhSbGMwTnZibVpwWnlobGJHVnRaVzUwTENCRVJVWkJWVXhVWDFCU1QxQkZVbFJKUlZNc0lFUkJWRUZmUVZSVVVsTmZVRkpQVUVWU1ZFbEZVeWxjYmlBZ0lDQWdJR052Ym1acFp5NWxiR1Z0Wlc1MElEMGdaV3hsYldWdWRGeHVYRzRnSUNBZ0lDQmpiMjF3YjI1bGJuUnpMbkIxYzJnb1FXTmpiM0prYVc5dUxsOUVUMDFKYm5SbGNtWmhZMlVvWTI5dVptbG5LU2xjYmlBZ0lDQjlLVnh1SUNCOVhHNWNiaUFnYVdZZ0tHRmpZMjl5WkdsdmJuTXBJSHRjYmlBZ0lDQmtiMk4xYldWdWRDNWhaR1JGZG1WdWRFeHBjM1JsYm1WeUtDZGpiR2xqYXljc0lDaGxkbVZ1ZENrZ1BUNGdlMXh1SUNBZ0lDQWdZMjl1YzNRZ1pHRjBZVlJ2WjJkc1pVRjBkSElnUFNCbGRtVnVkQzUwWVhKblpYUXVaMlYwUVhSMGNtbGlkWFJsS0Nka1lYUmhMWFJ2WjJkc1pTY3BYRzRnSUNBZ0lDQnBaaUFvWkdGMFlWUnZaMmRzWlVGMGRISWdKaVlnWkdGMFlWUnZaMmRzWlVGMGRISWdQVDA5SUU1QlRVVXBJSHRjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdZMjlzYkdGd2MyVkpaQ0E5SUdWMlpXNTBMblJoY21kbGRDNW5aWFJCZEhSeWFXSjFkR1VvSjJSaGRHRXRkR0Z5WjJWMEp5a2dmSHdnWlhabGJuUXVkR0Z5WjJWMExtZGxkRUYwZEhKcFluVjBaU2duYUhKbFppY3BYRzRnSUNBZ0lDQWdJR052Ym5OMElHTnZiR3hoY0hObFJXd2dQU0JrYjJOMWJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eUtHTnZiR3hoY0hObFNXUXBYRzVjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdZV05qYjNKa2FXOXVJRDBnWm1sdVpGUmhjbWRsZEVKNVEyeGhjM01vWlhabGJuUXVkR0Z5WjJWMExDQW5ZV05qYjNKa2FXOXVKeWxjYmx4dUlDQWdJQ0FnSUNCcFppQW9ZV05qYjNKa2FXOXVJRDA5UFNCdWRXeHNLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2NtVjBkWEp1WEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQmpiMjV6ZENCaFkyTnZjbVJwYjI1SlpDQTlJR0ZqWTI5eVpHbHZiaTVuWlhSQmRIUnlhV0oxZEdVb0oybGtKeWxjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdZMjl0Y0c5dVpXNTBJRDBnWTI5dGNHOXVaVzUwY3k1bWFXNWtLR01nUFQ0Z1l5NW5aWFJGYkdWdFpXNTBLQ2t1WjJWMFFYUjBjbWxpZFhSbEtDZHBaQ2NwSUQwOVBTQmhZMk52Y21ScGIyNUpaQ2xjYmx4dUlDQWdJQ0FnSUNCcFppQW9JV052YlhCdmJtVnVkQ2tnZTF4dUlDQWdJQ0FnSUNBZ0lISmxkSFZ5Ymx4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdMeThnYVdZZ2RHaGxJR052Ykd4aGNITmxJR2hoY3lCaVpXVnVJR0ZrWkdWa0lIQnliMmR5WVcxdFlYUnBZMkZzYkhrc0lIZGxJR0ZrWkNCcGRGeHVJQ0FnSUNBZ0lDQmpiMjV6ZENCMFlYSm5aWFJEYjJ4c1lYQnpaU0E5SUdOdmJYQnZibVZ1ZEM1blpYUkRiMnhzWVhCelpYTW9LUzVtYVc1a0tHTWdQVDRnWXk1blpYUkZiR1Z0Wlc1MEtDa2dQVDA5SUdOdmJHeGhjSE5sUld3cFhHNGdJQ0FnSUNBZ0lHbG1JQ2doZEdGeVoyVjBRMjlzYkdGd2MyVXBJSHRjYmlBZ0lDQWdJQ0FnSUNCamIyMXdiMjVsYm5RdVlXUmtRMjlzYkdGd2MyVW9ZMjlzYkdGd2MyVkZiQ2xjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lHTnZiWEJ2Ym1WdWRDNXphRzkzS0dOdmJHeGhjSE5sU1dRcFhHNGdJQ0FnSUNCOVhHNGdJQ0FnZlNsY2JpQWdmVnh1WEc0Z0lISmxkSFZ5YmlCQlkyTnZjbVJwYjI1Y2JuMHBLQ2xjYmx4dVpYaHdiM0owSUdSbFptRjFiSFFnUVdOamIzSmthVzl1WEc0aUxDSXZLaXBjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2lCTWFXTmxibk5sWkNCMWJtUmxjaUJOU1ZRZ0tHaDBkSEJ6T2k4dloybDBhSFZpTG1OdmJTOXhkV0Z5YXkxa1pYWXZVR2h2Ym05dUxVWnlZVzFsZDI5eWF5OWliRzlpTDIxaGMzUmxjaTlNU1VORlRsTkZLVnh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxTDF4dWFXMXdiM0owSUVOdmJYQnZibVZ1ZENCbWNtOXRJQ2N1TGk5amIyMXdiMjVsYm5RblhHNXBiWEJ2Y25RZ2V5Qm5aWFJCZEhSeWFXSjFkR1Z6UTI5dVptbG5JSDBnWm5KdmJTQW5MaTR2WTI5dGNHOXVaVzUwVFdGdVlXZGxjaWRjYm1sdGNHOXlkQ0JGZG1WdWRDQm1jbTl0SUNjdUxpOHVMaTlqYjNKbEwyVjJaVzUwY3lkY2JtbHRjRzl5ZENCN0lHWnBibVJVWVhKblpYUkNlVUYwZEhJZ2ZTQm1jbTl0SUNjdUxpOHVMaTlqYjNKbEwzVjBhV3h6SjF4dVhHNWpiMjV6ZENCRGIyeHNZWEJ6WlNBOUlDZ29LU0E5UGlCN1hHNGdJQzhxS2x4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb2dRMjl1YzNSaGJuUnpYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2k5Y2JseHVJQ0JqYjI1emRDQk9RVTFGSUQwZ0oyTnZiR3hoY0hObEoxeHVJQ0JqYjI1emRDQldSVkpUU1U5T0lEMGdKekl1TUM0d0oxeHVJQ0JqYjI1emRDQkVSVVpCVlV4VVgxQlNUMUJGVWxSSlJWTWdQU0I3WEc0Z0lDQWdaV3hsYldWdWREb2diblZzYkN4Y2JpQWdJQ0IwYjJkbmJHVTZJR1poYkhObExGeHVJQ0I5WEc0Z0lHTnZibk4wSUVSQlZFRmZRVlJVVWxOZlVGSlBVRVZTVkVsRlV5QTlJRnRjYmlBZ0lDQW5kRzluWjJ4bEp5eGNiaUFnWFZ4dVhHNGdJQzhxS2x4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb2dRMnhoYzNNZ1JHVm1hVzVwZEdsdmJseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ292WEc1Y2JpQWdZMnhoYzNNZ1EyOXNiR0Z3YzJVZ1pYaDBaVzVrY3lCRGIyMXdiMjVsYm5RZ2UxeHVYRzRnSUNBZ1kyOXVjM1J5ZFdOMGIzSW9iM0IwYVc5dWN5QTlJSHQ5S1NCN1hHNGdJQ0FnSUNCemRYQmxjaWhPUVUxRkxDQldSVkpUU1U5T0xDQkVSVVpCVlV4VVgxQlNUMUJGVWxSSlJWTXNJRzl3ZEdsdmJuTXNJRVJCVkVGZlFWUlVVbE5mVUZKUFVFVlNWRWxGVXl3Z1ptRnNjMlVzSUdaaGJITmxLVnh1WEc0Z0lDQWdJQ0IwYUdsekxtOXVWSEpoYm5OcGRHbHZiaUE5SUdaaGJITmxYRzVjYmlBZ0lDQWdJQzh2SUhSdloyZHNaU0JrYVhKbFkzUnNlVnh1SUNBZ0lDQWdhV1lnS0hSb2FYTXViM0IwYVc5dWN5NTBiMmRuYkdVcElIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1emFHOTNLQ2xjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzVjYmlBZ0lDQm5aWFJJWldsbmFIUW9LU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1WjJWMFFtOTFibVJwYm1kRGJHbGxiblJTWldOMEtIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBLUzVvWldsbmFIUmNiaUFnSUNCOVhHNWNiaUFnSUNCMGIyZG5iR1VvS1NCN1hHNGdJQ0FnSUNCcFppQW9kR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1WTJ4aGMzTk1hWE4wTG1OdmJuUmhhVzV6S0NkemFHOTNKeWtwSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTXVhR2xrWlNncFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lISmxkSFZ5YmlCMGFHbHpMbk5vYjNjb0tWeHVJQ0FnSUgxY2JseHVJQ0FnSUhOb2IzY29LU0I3WEc0Z0lDQWdJQ0JwWmlBb2RHaHBjeTV2YmxSeVlXNXphWFJwYjI0cElIdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlHWmhiSE5sWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUdsbUlDaDBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVqYkdGemMweHBjM1F1WTI5dWRHRnBibk1vSjNOb2IzY25LU2tnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnWm1Gc2MyVmNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdkR2hwY3k1dmJsUnlZVzV6YVhScGIyNGdQU0IwY25WbFhHNWNiaUFnSUNBZ0lHTnZibk4wSUc5dVEyOXNiR0Z3YzJWa0lEMGdLQ2tnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVqYkdGemMweHBjM1F1WVdSa0tDZHphRzkzSnlsY2JpQWdJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25ZMjlzYkdGd2MybHVaeWNwWEc0Z0lDQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExuSmxiVzkyWlVWMlpXNTBUR2x6ZEdWdVpYSW9SWFpsYm5RdVZGSkJUbE5KVkVsUFRsOUZUa1FzSUc5dVEyOXNiR0Z3YzJWa0tWeHVYRzRnSUNBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG5ObGRFRjBkSEpwWW5WMFpTZ25ZWEpwWVMxbGVIQmhibVJsWkNjc0lIUnlkV1VwWEc1Y2JpQWdJQ0FnSUNBZ2RHaHBjeTV2YmxSeVlXNXphWFJwYjI0Z1BTQm1ZV3h6WlZ4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCcFppQW9JWFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1Oc1lYTnpUR2x6ZEM1amIyNTBZV2x1Y3lnblkyOXNiR0Z3YzJsdVp5Y3BLU0I3WEc0Z0lDQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExtTnNZWE56VEdsemRDNWhaR1FvSjJOdmJHeGhjSE5wYm1jbktWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVoWkdSRmRtVnVkRXhwYzNSbGJtVnlLRVYyWlc1MExsUlNRVTVUU1ZSSlQwNWZSVTVFTENCdmJrTnZiR3hoY0hObFpDbGNibHh1SUNBZ0lDQWdZMjl1YzNRZ2FHVnBaMmgwSUQwZ2RHaHBjeTVuWlhSSVpXbG5hSFFvS1Z4dVhHNGdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNXpkSGxzWlM1b1pXbG5hSFFnUFNBbk1IQjRKMXh1WEc0Z0lDQWdJQ0J6WlhSVWFXMWxiM1YwS0NncElEMCtJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdWMzUjViR1V1YUdWcFoyaDBJRDBnWUNSN2FHVnBaMmgwZlhCNFlGeHVJQ0FnSUNBZ2ZTd2dNakFwWEc1Y2JpQWdJQ0FnSUhKbGRIVnliaUIwY25WbFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYUdsa1pTZ3BJSHRjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbTl1VkhKaGJuTnBkR2x2YmlrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z1ptRnNjMlZjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnYVdZZ0tDRjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVqYkdGemMweHBjM1F1WTI5dWRHRnBibk1vSjNOb2IzY25LU2tnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnWm1Gc2MyVmNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdkR2hwY3k1dmJsUnlZVzV6YVhScGIyNGdQU0IwY25WbFhHNWNiaUFnSUNBZ0lHTnZibk4wSUc5dVEyOXNiR0Z3YzJWa0lEMGdLQ2tnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVqYkdGemMweHBjM1F1Y21WdGIzWmxLQ2RqYjJ4c1lYQnphVzVuSnlsY2JpQWdJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVjM1I1YkdVdWFHVnBaMmgwSUQwZ0oyRjFkRzhuWEc0Z0lDQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExuSmxiVzkyWlVWMlpXNTBUR2x6ZEdWdVpYSW9SWFpsYm5RdVZGSkJUbE5KVkVsUFRsOUZUa1FzSUc5dVEyOXNiR0Z3YzJWa0tWeHVYRzRnSUNBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG5ObGRFRjBkSEpwWW5WMFpTZ25ZWEpwWVMxbGVIQmhibVJsWkNjc0lHWmhiSE5sS1Z4dVhHNGdJQ0FnSUNBZ0lIUm9hWE11YjI1VWNtRnVjMmwwYVc5dUlEMGdabUZzYzJWY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVjM1I1YkdVdWFHVnBaMmgwSUQwZ0p6QndlQ2RjYmx4dUlDQWdJQ0FnYVdZZ0tDRjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVqYkdGemMweHBjM1F1WTI5dWRHRnBibk1vSjJOdmJHeGhjSE5wYm1jbktTa2dlMXh1SUNBZ0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1amJHRnpjMHhwYzNRdVlXUmtLQ2RqYjJ4c1lYQnphVzVuSnlsY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVZV1JrUlhabGJuUk1hWE4wWlc1bGNpaEZkbVZ1ZEM1VVVrRk9VMGxVU1U5T1gwVk9SQ3dnYjI1RGIyeHNZWEJ6WldRcFhHNWNiaUFnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbU5zWVhOelRHbHpkQzV5WlcxdmRtVW9KM05vYjNjbktWeHVYRzRnSUNBZ0lDQnlaWFIxY200Z2RISjFaVnh1SUNBZ0lIMWNibHh1SUNBZ0lITjBZWFJwWXlCZlJFOU5TVzUwWlhKbVlXTmxLRzl3ZEdsdmJuTXBJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQnpkWEJsY2k1ZlJFOU5TVzUwWlhKbVlXTmxLRU52Ykd4aGNITmxMQ0J2Y0hScGIyNXpLVnh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb2dSRTlOSUVGd2FTQnBiWEJzWlcxbGJuUmhkR2x2Ymx4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb3ZYRzRnSUdOdmJuTjBJR052YlhCdmJtVnVkSE1nUFNCYlhWeHVYRzRnSUdOdmJuTjBJR052Ykd4aGNITmxjeUE5SUdSdlkzVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSkJiR3dvWUM0a2UwNUJUVVY5WUNsY2JpQWdhV1lnS0dOdmJHeGhjSE5sY3lrZ2UxeHVJQ0FnSUdOdmJHeGhjSE5sY3k1bWIzSkZZV05vS0NobGJHVnRaVzUwS1NBOVBpQjdYRzRnSUNBZ0lDQXZMeUJqYjI1emRDQmpiMjVtYVdjZ1BTQjdmVnh1SUNBZ0lDQWdZMjl1YzNRZ1kyOXVabWxuSUQwZ1oyVjBRWFIwY21saWRYUmxjME52Ym1acFp5aGxiR1Z0Wlc1MExDQkVSVVpCVlV4VVgxQlNUMUJGVWxSSlJWTXNJRVJCVkVGZlFWUlVVbE5mVUZKUFVFVlNWRWxGVXlsY2JpQWdJQ0FnSUdOdmJtWnBaeTVsYkdWdFpXNTBJRDBnWld4bGJXVnVkRnh1WEc0Z0lDQWdJQ0JqYjIxd2IyNWxiblJ6TG5CMWMyZ29RMjlzYkdGd2MyVXVYMFJQVFVsdWRHVnlabUZqWlNoamIyNW1hV2NwS1Z4dUlDQWdJSDBwWEc0Z0lIMWNibHh1SUNCcFppQW9ZMjlzYkdGd2MyVnpLU0I3WEc0Z0lDQWdaRzlqZFcxbGJuUXVZV1JrUlhabGJuUk1hWE4wWlc1bGNpZ25ZMnhwWTJzbkxDQW9aWFpsYm5RcElEMCtJSHRjYmlBZ0lDQWdJR052Ym5OMElIUmhjbWRsZENBOUlHWnBibVJVWVhKblpYUkNlVUYwZEhJb1pYWmxiblF1ZEdGeVoyVjBMQ0FuWkdGMFlTMTBiMmRuYkdVbktWeHVJQ0FnSUNBZ2FXWWdLQ0YwWVhKblpYUXBJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR052Ym5OMElHUmhkR0ZVYjJkbmJHVkJkSFJ5SUQwZ2RHRnlaMlYwTG1kbGRFRjBkSEpwWW5WMFpTZ25aR0YwWVMxMGIyZG5iR1VuS1Z4dVhHNGdJQ0FnSUNCcFppQW9aR0YwWVZSdloyZHNaVUYwZEhJZ0ppWWdaR0YwWVZSdloyZHNaVUYwZEhJZ1BUMDlJRTVCVFVVcElIdGNiaUFnSUNBZ0lDQWdiR1YwSUdsa0lEMGdkR0Z5WjJWMExtZGxkRUYwZEhKcFluVjBaU2duWkdGMFlTMTBZWEpuWlhRbktTQjhmQ0IwWVhKblpYUXVaMlYwUVhSMGNtbGlkWFJsS0Nkb2NtVm1KeWxjYmlBZ0lDQWdJQ0FnYVdRZ1BTQnBaQzV5WlhCc1lXTmxLQ2NqSnl3Z0p5Y3BYRzVjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdZMjl0Y0c5dVpXNTBJRDBnWTI5dGNHOXVaVzUwY3k1bWFXNWtLR01nUFQ0Z1l5NW5aWFJGYkdWdFpXNTBLQ2t1WjJWMFFYUjBjbWxpZFhSbEtDZHBaQ2NwSUQwOVBTQnBaQ2xjYmx4dUlDQWdJQ0FnSUNCcFppQW9JV052YlhCdmJtVnVkQ2tnZTF4dUlDQWdJQ0FnSUNBZ0lISmxkSFZ5Ymx4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdZMjl0Y0c5dVpXNTBMblJ2WjJkc1pTZ3BYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZTbGNiaUFnZlZ4dVhHNGdJSEpsZEhWeWJpQkRiMnhzWVhCelpWeHVmU2tvS1Z4dVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCRGIyeHNZWEJ6WlZ4dUlpd2lMeW9xWEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvZ1RHbGpaVzV6WldRZ2RXNWtaWElnVFVsVUlDaG9kSFJ3Y3pvdkwyZHBkR2gxWWk1amIyMHZjWFZoY21zdFpHVjJMMUJvYjI1dmJpMUdjbUZ0WlhkdmNtc3ZZbXh2WWk5dFlYTjBaWEl2VEVsRFJVNVRSU2xjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2k5Y2JtbHRjRzl5ZENCN0lHUnBjM0JoZEdOb1JXeGxiV1Z1ZEVWMlpXNTBMQ0JrYVhOd1lYUmphRmRwYmtSdlkwVjJaVzUwSUgwZ1puSnZiU0FuTGk0dlkyOXlaUzlsZG1WdWRITXZaR2x6Y0dGMFkyZ25YRzVwYlhCdmNuUWdleUJuWlc1bGNtRjBaVWxrSUgwZ1puSnZiU0FuTGk0dlkyOXlaUzkxZEdsc2N5ZGNibWx0Y0c5eWRDQkZkbVZ1ZENCbWNtOXRJQ2N1TGk5amIzSmxMMlYyWlc1MGN5ZGNibWx0Y0c5eWRDQkRiMjF3YjI1bGJuUk5ZVzVoWjJWeUxDQjdJSE5sZEVGMGRISnBZblYwWlhORGIyNW1hV2NzSUdkbGRFRjBkSEpwWW5WMFpYTkRiMjVtYVdjZ2ZTQm1jbTl0SUNjdUwyTnZiWEJ2Ym1WdWRFMWhibUZuWlhJblhHNWNiaThxS2x4dUlDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2lCRGJHRnpjeUJFWldacGJtbDBhVzl1WEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxTDF4dVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCamJHRnpjeUJEYjIxd2IyNWxiblFnZTF4dVhHNGdJR052Ym5OMGNuVmpkRzl5S0c1aGJXVXNJSFpsY25OcGIyNHNJR1JsWm1GMWJIUlBjSFJwYjI1eklEMGdlMzBzSUc5d2RHbHZibk1nUFNCN2ZTd2diM0IwYVc5dVFYUjBjbk1nUFNCYlhTd2djM1Z3Y0c5eWRFUjVibUZ0YVdORmJHVnRaVzUwSUQwZ1ptRnNjMlVzSUdGa1pGUnZVM1JoWTJzZ1BTQm1ZV3h6WlNrZ2UxeHVJQ0FnSUhSb2FYTXVibUZ0WlNBOUlHNWhiV1ZjYmlBZ0lDQjBhR2x6TG5abGNuTnBiMjRnUFNCMlpYSnphVzl1WEc0Z0lDQWdkR2hwY3k1dmNIUnBiMjV6SUQwZ2IzQjBhVzl1YzF4dVhHNGdJQ0FnTHk5MGFHbHpMbTl3ZEdsdmJuTWdQU0JQWW1wbFkzUXVZWE56YVdkdUtHUmxabUYxYkhSUGNIUnBiMjV6TENCdmNIUnBiMjV6S1Z4dUlDQWdJQzhxWEc0Z0lDQWdUMkpxWldOMExtdGxlWE1vWkdWbVlYVnNkRTl3ZEdsdmJuTXBMbVYyWlhKNUtDaHdjbTl3S1NBOVBpQjdYRzRnSUNBZ0lDQnBaaUFvZEdocGN5NXZjSFJwYjI1elczQnliM0JkSUQwOVBTQjFibVJsWm1sdVpXUXBJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NXZjSFJwYjI1elczQnliM0JkSUQwZ1pHVm1ZWFZzZEU5d2RHbHZibk5iY0hKdmNGMWNiaUFnSUNBZ0lIMWNiaUFnSUNCOUtWeHVJQ0FnSUNvdlhHNWNiaUFnSUNCMGFHbHpMbTl3ZEdsdmJrRjBkSEp6SUQwZ2IzQjBhVzl1UVhSMGNuTmNiaUFnSUNCMGFHbHpMbk4xY0hCdmNuUkVlVzVoYldsalJXeGxiV1Z1ZENBOUlITjFjSEJ2Y25SRWVXNWhiV2xqUld4bGJXVnVkRnh1SUNBZ0lIUm9hWE11WVdSa1ZHOVRkR0ZqYXlBOUlHRmtaRlJ2VTNSaFkydGNiaUFnSUNCMGFHbHpMbWxrSUQwZ1oyVnVaWEpoZEdWSlpDZ3BYRzVjYmlBZ0lDQmpiMjV6ZENCamFHVmphMFZzWlcxbGJuUWdQU0FoZEdocGN5NXpkWEJ3YjNKMFJIbHVZVzFwWTBWc1pXMWxiblFnZkh3Z2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUWdJVDA5SUc1MWJHeGNibHh1SUNBZ0lHbG1JQ2gwZVhCbGIyWWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblFnUFQwOUlDZHpkSEpwYm1jbktTQjdYRzRnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQ0E5SUdSdlkzVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSW9kR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblFwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdhV1lnS0dOb1pXTnJSV3hsYldWdWRDQW1KaUFoZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RcElIdGNiaUFnSUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2loZ0pIdDBhR2x6TG01aGJXVjlMaUJVYUdVZ1pXeGxiV1Z1ZENCcGN5QnViM1FnWVNCSVZFMU1SV3hsYldWdWRDNWdLVnh1SUNBZ0lIMWNibHh1SUNBZ0lIUm9hWE11WkhsdVlXMXBZMFZzWlcxbGJuUWdQU0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZENBOVBUMGdiblZzYkZ4dUlDQWdJSFJvYVhNdWNtVm5hWE4wWlhKbFpFVnNaVzFsYm5SeklEMGdXMTFjYmx4dUlDQWdJR2xtSUNnaGRHaHBjeTVrZVc1aGJXbGpSV3hsYldWdWRDa2dlMXh1SUNBZ0lDQWdMeW9xWEc0Z0lDQWdJQ0FnS2lCcFppQjBhR1VnWld4bGJXVnVkQ0JsZUdsemRITXNJSGRsSUhKbFlXUWdkR2hsSUdSaGRHRWdZWFIwY21saWRYUmxjeUJqYjI1bWFXZGNiaUFnSUNBZ0lDQXFJSFJvWlc0Z2QyVWdiM1psY25keWFYUmxJR1Y0YVhOMGFXNW5JR052Ym1acFp5QnJaWGx6SUdsdUlFcGhkbUZUWTNKcGNIUXNJSE52SUhSb1lYUmNiaUFnSUNBZ0lDQXFJSGRsSUd0bFpYQWdkR2hsSUdadmJHeHZkMmx1WnlCdmNtUmxjbHh1SUNBZ0lDQWdJQ29nV3pGZElHUmxabUYxYkhRZ1NtRjJZVk5qY21sd2RDQmpiMjVtYVdkMWNtRjBhVzl1SUc5bUlIUm9aU0JqYjIxd2IyNWxiblJjYmlBZ0lDQWdJQ0FxSUZzeVhTQkVZWFJoSUdGMGRISnBZblYwWlhNZ1kyOXVabWxuZFhKaGRHbHZiaUJwWmlCMGFHVWdaV3hsYldWdWRDQmxlR2x6ZEhNZ2FXNGdkR2hsSUVSUFRWeHVJQ0FnSUNBZ0lDb2dXek5kSUVwaGRtRlRZM0pwY0hRZ1kyOXVabWxuZFhKaGRHbHZibHh1SUNBZ0lDQWdJQ292WEc0Z0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NZ1BTQlBZbXBsWTNRdVlYTnphV2R1S0hSb2FYTXViM0IwYVc5dWN5d2dkR2hwY3k1aGMzTnBaMjVLYzBOdmJtWnBaeWgwYUdsekxtZGxkRUYwZEhKcFluVjBaWE1vS1N3Z2IzQjBhVzl1Y3lrcFhHNWNiaUFnSUNBZ0lDOHZJSFJvWlc0c0lITmxkQ0IwYUdVZ2JtVjNJR1JoZEdFZ1lYUjBjbWxpZFhSbGN5QjBieUIwYUdVZ1pXeGxiV1Z1ZEZ4dUlDQWdJQ0FnZEdocGN5NXpaWFJCZEhSeWFXSjFkR1Z6S0NsY2JpQWdJQ0I5WEc1Y2JpQWdJQ0IwYUdsekxtVnNaVzFsYm5STWFYTjBaVzVsY2lBOUlHVjJaVzUwSUQwK0lIUm9hWE11YjI1Q1pXWnZjbVZGYkdWdFpXNTBSWFpsYm5Rb1pYWmxiblFwSUNBZ0lDQWdJQ0FnSUZ4dUlDQjlYRzVjYmlBZ1lYTnphV2R1U25ORGIyNW1hV2NvWVhSMGNrTnZibVpwWnl3Z2IzQjBhVzl1Y3lrZ2UxeHVJQ0FnSUhSb2FYTXViM0IwYVc5dVFYUjBjbk11Wm05eVJXRmphQ2dvYTJWNUtTQTlQaUI3WEc0Z0lDQWdJQ0JwWmlBb2IzQjBhVzl1YzF0clpYbGRLU0I3WEc0Z0lDQWdJQ0FnSUdGMGRISkRiMjVtYVdkYmEyVjVYU0E5SUc5d2RHbHZibk5iYTJWNVhWeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgwcFhHNWNiaUFnSUNCeVpYUjFjbTRnWVhSMGNrTnZibVpwWjF4dUlDQjlYRzVjYmlBZ1oyVjBWbVZ5YzJsdmJpZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z2RHaHBjeTUyWlhKemFXOXVYRzRnSUgxY2JseHVJQ0JuWlhSRmJHVnRaVzUwS0NrZ2UxeHVJQ0FnSUhKbGRIVnliaUIwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEZ4dUlDQjlYRzVjYmlBZ1oyVjBTV1FvS1NCN1hHNGdJQ0FnY21WMGRYSnVJSFJvYVhNdWFXUmNiaUFnZlZ4dVhHNGdJSEpsWjJsemRHVnlSV3hsYldWdWRITW9aV3hsYldWdWRITXBJSHRjYmlBZ0lDQmxiR1Z0Wlc1MGN5NW1iM0pGWVdOb0tHVnNaVzFsYm5RZ1BUNGdkR2hwY3k1eVpXZHBjM1JsY2tWc1pXMWxiblFvWld4bGJXVnVkQ2twWEc0Z0lIMWNibHh1SUNCeVpXZHBjM1JsY2tWc1pXMWxiblFvWld4bGJXVnVkQ2tnZTF4dUlDQWdJR1ZzWlcxbGJuUXVkR0Z5WjJWMExtRmtaRVYyWlc1MFRHbHpkR1Z1WlhJb1pXeGxiV1Z1ZEM1bGRtVnVkQ3dnZEdocGN5NWxiR1Z0Wlc1MFRHbHpkR1Z1WlhJcFhHNGdJQ0FnZEdocGN5NXlaV2RwYzNSbGNtVmtSV3hsYldWdWRITXVjSFZ6YUNobGJHVnRaVzUwS1Z4dUlDQjlYRzVjYmlBZ2RXNXlaV2RwYzNSbGNrVnNaVzFsYm5SektDa2dlMXh1SUNBZ0lIUm9hWE11Y21WbmFYTjBaWEpsWkVWc1pXMWxiblJ6TG1admNrVmhZMmdvS0dWc1pXMWxiblFwSUQwK0lIdGNiaUFnSUNBZ0lIUm9hWE11ZFc1eVpXZHBjM1JsY2tWc1pXMWxiblFvWld4bGJXVnVkQ2xjYmlBZ0lDQjlLVnh1SUNCOVhHNWNiaUFnZFc1eVpXZHBjM1JsY2tWc1pXMWxiblFvWld4bGJXVnVkQ2tnZTF4dUlDQWdJR052Ym5OMElISmxaMmx6ZEdWeVpXUkZiR1Z0Wlc1MFNXNWtaWGdnUFNCMGFHbHpMbkpsWjJsemRHVnlaV1JGYkdWdFpXNTBjMXh1SUNBZ0lDQWdMbVpwYm1SSmJtUmxlQ2hsYkNBOVBpQmxiQzUwWVhKblpYUWdQVDA5SUdWc1pXMWxiblF1ZEdGeVoyVjBJQ1ltSUdWc0xtVjJaVzUwSUQwOVBTQmxiR1Z0Wlc1MExtVjJaVzUwS1Z4dVhHNGdJQ0FnYVdZZ0tISmxaMmx6ZEdWeVpXUkZiR1Z0Wlc1MFNXNWtaWGdnUGlBdE1Ta2dlMXh1SUNBZ0lDQWdaV3hsYldWdWRDNTBZWEpuWlhRdWNtVnRiM1psUlhabGJuUk1hWE4wWlc1bGNpaGxiR1Z0Wlc1MExtVjJaVzUwTENCMGFHbHpMbVZzWlcxbGJuUk1hWE4wWlc1bGNpbGNiaUFnSUNBZ0lIUm9hWE11Y21WbmFYTjBaWEpsWkVWc1pXMWxiblJ6TG5Od2JHbGpaU2h5WldkcGMzUmxjbVZrUld4bGJXVnVkRWx1WkdWNExDQXhLVnh1SUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNCamIyNXpiMnhsTG1WeWNtOXlLR0JYWVhKdWFXNW5JU0JWYm10dWIzZHVJSEpsWjJsemRHVnlaV1FnWld4bGJXVnVkRG9nSkh0bGJHVnRaVzUwTG5SaGNtZGxkSDBnZDJsMGFDQmxkbVZ1ZERvZ0pIdGxiR1Z0Wlc1MExtVjJaVzUwZlM1Z0tWeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lIUnlhV2RuWlhKRmRtVnVkQ2hsZG1WdWRFNWhiV1VzSUdSbGRHRnBiQ0E5SUh0OUxDQnZZbXBsWTNSRmRtVnVkRTl1YkhrZ1BTQm1ZV3h6WlNrZ2UxeHVJQ0FnSUdsbUlDaDBhR2x6TG1Ga1pGUnZVM1JoWTJzcElIdGNiaUFnSUNBZ0lHbG1JQ2hsZG1WdWRFNWhiV1VnUFQwOUlFVjJaVzUwTGxOSVQxY3BJSHRjYmlBZ0lDQWdJQ0FnUTI5dGNHOXVaVzUwVFdGdVlXZGxjaTVoWkdRb2RHaHBjeWxjYmlBZ0lDQWdJSDBnWld4elpTQnBaaUFvWlhabGJuUk9ZVzFsSUQwOVBTQkZkbVZ1ZEM1SVNVUkZLU0I3WEc0Z0lDQWdJQ0FnSUVOdmJYQnZibVZ1ZEUxaGJtRm5aWEl1Y21WdGIzWmxLSFJvYVhNcFhHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dVhHNGdJQ0FnWTI5dWMzUWdaWFpsYm5ST1lXMWxRV3hwWVhNZ1BTQmdiMjRrZTJWMlpXNTBUbUZ0WlM1amFHRnlRWFFvTUNrdWRHOVZjSEJsY2tOaGMyVW9LWDBrZTJWMlpXNTBUbUZ0WlM1emJHbGpaU2d4S1gxZ1hHNWNiaUFnSUNBdkx5QnZZbXBsWTNRZ1pYWmxiblJjYmlBZ0lDQnBaaUFvZEhsd1pXOW1JSFJvYVhNdWIzQjBhVzl1YzF0bGRtVnVkRTVoYldWZElEMDlQU0FuWm5WdVkzUnBiMjRuS1NCN1hHNGdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTmJaWFpsYm5ST1lXMWxYUzVoY0hCc2VTaDBhR2x6TENCYlpHVjBZV2xzWFNsY2JpQWdJQ0I5WEc1Y2JpQWdJQ0JwWmlBb2RIbHdaVzltSUhSb2FYTXViM0IwYVc5dWMxdGxkbVZ1ZEU1aGJXVkJiR2xoYzEwZ1BUMDlJQ2RtZFc1amRHbHZiaWNwSUh0Y2JpQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWMxdGxkbVZ1ZEU1aGJXVkJiR2xoYzEwdVlYQndiSGtvZEdocGN5d2dXMlJsZEdGcGJGMHBYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2FXWWdLRzlpYW1WamRFVjJaVzUwVDI1c2VTa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdVhHNGdJQ0FnZlZ4dVhHNGdJQ0FnTHk4Z1pHOXRJR1YyWlc1MFhHNGdJQ0FnYVdZZ0tIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBLU0I3WEc0Z0lDQWdJQ0JrYVhOd1lYUmphRVZzWlcxbGJuUkZkbVZ1ZENoMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDd2daWFpsYm5ST1lXMWxMQ0IwYUdsekxtNWhiV1VzSUdSbGRHRnBiQ2xjYmlBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ1pHbHpjR0YwWTJoWGFXNUViMk5GZG1WdWRDaGxkbVZ1ZEU1aGJXVXNJSFJvYVhNdWJtRnRaU3dnWkdWMFlXbHNLVnh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJSE5sZEVGMGRISnBZblYwWlhNb0tTQjdYRzRnSUNBZ2FXWWdLSFJvYVhNdWIzQjBhVzl1UVhSMGNuTXViR1Z1WjNSb0lENGdNQ2tnZTF4dUlDQWdJQ0FnYzJWMFFYUjBjbWxpZFhSbGMwTnZibVpwWnloMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDd2dkR2hwY3k1dmNIUnBiMjV6TENCMGFHbHpMbTl3ZEdsdmJrRjBkSEp6S1Z4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUdkbGRFRjBkSEpwWW5WMFpYTW9LU0I3WEc0Z0lDQWdZMjl1YzNRZ2IzQjBhVzl1Y3lBOUlFOWlhbVZqZEM1aGMzTnBaMjRvZTMwc0lIUm9hWE11YjNCMGFXOXVjeWxjYmlBZ0lDQnlaWFIxY200Z1oyVjBRWFIwY21saWRYUmxjME52Ym1acFp5aDBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQ3dnYjNCMGFXOXVjeXdnZEdocGN5NXZjSFJwYjI1QmRIUnljeWxjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lCMGFHVWdjSEpsZG1WdWRFTnNiM05oWW14bElHMWxkR2h2WkNCdFlXNWhaMlZ6SUdOdmJtTjFjbkpsYm1ONUlHSmxkSGRsWlc0Z1lXTjBhWFpsSUdOdmJYQnZibVZ1ZEhNdVhHNGdJQ0FxSUVadmNpQmxlR0Z0Y0d4bExDQnBaaUIwYUdWeVpTQnBjeUJoSUhOb2IzZHVJRzltWmkxallXNTJZWE1nWVc1a0lHUnBZV3h2Wnl3Z2RHaGxJR3hoYzNSY2JpQWdJQ29nYzJodmQyNGdZMjl0Y0c5dVpXNTBJR2RoYVc1eklIUm9aU0J3Y205alpYTnphVzVuSUhCeWFXOXlhWFI1WEc0Z0lDQXFMMXh1SUNCd2NtVjJaVzUwUTJ4dmMyRmliR1VvS1NCN1hHNGdJQ0FnY21WMGRYSnVJSFJvYVhNdVlXUmtWRzlUZEdGamF5QW1KaUFoUTI5dGNHOXVaVzUwVFdGdVlXZGxjaTVqYkc5ellXSnNaU2gwYUdsektWeHVJQ0I5WEc1Y2JpQWdiMjVDWldadmNtVkZiR1Z0Wlc1MFJYWmxiblFvWlhabGJuUXBJSHRjYmlBZ0lDQnBaaUFvZEdocGN5NXdjbVYyWlc1MFEyeHZjMkZpYkdVb0tTa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdVhHNGdJQ0FnZlZ4dVhHNGdJQ0FnZEdocGN5NXZia1ZzWlcxbGJuUkZkbVZ1ZENobGRtVnVkQ2xjYmlBZ2ZWeHVYRzRnSUc5dVJXeGxiV1Z1ZEVWMlpXNTBLR1YyWlc1MEtTQjdYRzRnSUNBZ0x5OWNiaUFnZlZ4dVhHNGdJSE4wWVhScFl5QmZSRTlOU1c1MFpYSm1ZV05sS0VOdmJYQnZibVZ1ZEVOc1lYTnpMQ0J2Y0hScGIyNXpLU0I3WEc0Z0lDQWdjbVYwZFhKdUlHNWxkeUJEYjIxd2IyNWxiblJEYkdGemN5aHZjSFJwYjI1ektWeHVJQ0I5WEc1OVhHNGlMQ0pjYm1OdmJuTjBJR2RsZEVGMGRISnBZblYwWlNBOUlDaG1hWEp6ZEN3Z2MyVmpiMjVrS1NBOVBpQjdYRzRnSUdsbUlDaG1hWEp6ZENBOVBUMGdKeWNwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdZR1JoZEdFdEpIdHpaV052Ym1SOVlGeHVJQ0I5WEc0Z0lISmxkSFZ5YmlCZ1pHRjBZUzBrZTJacGNuTjBmUzBrZTNObFkyOXVaSDFnWEc1OVhHNWNibVY0Y0c5eWRDQm1kVzVqZEdsdmJpQnpaWFJCZEhSeWFXSjFkR1Z6UTI5dVptbG5LR1ZzWlcxbGJuUXNJRzlpYWlBOUlIdDlMQ0JoZEhSeWN5d2djM1JoY25RZ1BTQW5KeWtnZTF4dUlDQmpiMjV6ZENCclpYbHpJRDBnVDJKcVpXTjBMbXRsZVhNb2IySnFLVnh1SUNCY2JpQWdhMlY1Y3k1bWIzSkZZV05vS0NoclpYa3BJRDArSUh0Y2JpQWdJQ0JwWmlBb2MzUmhjblFnUFQwOUlDY25JQ1ltSUdGMGRISnpMbWx1WkdWNFQyWW9hMlY1S1NBOVBUMGdMVEVwSUh0Y2JpQWdJQ0FnSUM4dklHTnZiblJwYm5WbElIZHBkR2dnYm1WNGRDQnBkR1Z5WVhScGIyNWNiaUFnSUNBZ0lISmxkSFZ5Ymx4dUlDQWdJSDFjYmx4dUlDQWdJR2xtSUNoMGVYQmxiMllnYjJKcVcydGxlVjBnUFQwOUlDZHZZbXBsWTNRbklDWW1JRzlpYWx0clpYbGRJQ0U5UFNCdWRXeHNLU0I3WEc0Z0lDQWdJQ0JzWlhRZ2EyVjVVM1JoY25RZ1BTQnJaWGxjYmlBZ0lDQWdJR2xtSUNoemRHRnlkQ0FoUFQwZ0p5Y3BJSHRjYmlBZ0lDQWdJQ0FnYTJWNVUzUmhjblFnUFNCZ0pIdHpkR0Z5ZEgwdEpIdHJaWGw5WUZ4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCelpYUkJkSFJ5YVdKMWRHVnpRMjl1Wm1sbktHVnNaVzFsYm5Rc0lHOWlhbHRyWlhsZExDQmhkSFJ5Y3l3Z2EyVjVVM1JoY25RcFhHNGdJQ0FnSUNCeVpYUjFjbTVjYmlBZ0lDQjlYRzVjYmlBZ0lDQmpiMjV6ZENCaGRIUnlJRDBnWjJWMFFYUjBjbWxpZFhSbEtITjBZWEowTENCclpYa3BYRzRnSUNBZ1pXeGxiV1Z1ZEM1elpYUkJkSFJ5YVdKMWRHVW9ZWFIwY2l3Z2IySnFXMnRsZVYwcFhHNGdJSDBwWEc1OVhHNWNibVY0Y0c5eWRDQm1kVzVqZEdsdmJpQm5aWFJCZEhSeWFXSjFkR1Z6UTI5dVptbG5LR1ZzWlcxbGJuUXNJRzlpYWlBOUlIdDlMQ0JoZEhSeWN5d2djM1JoY25RZ1BTQW5KeWtnZTF4dUlDQmpiMjV6ZENCdVpYZFBZbW9nUFNCUFltcGxZM1F1WVhOemFXZHVLSHQ5TENCdlltb3BYRzRnSUdOdmJuTjBJR3RsZVhNZ1BTQlBZbXBsWTNRdWEyVjVjeWh2WW1vcFhHNWNiaUFnYTJWNWN5NW1iM0pGWVdOb0tDaHJaWGtwSUQwK0lIdGNiaUFnSUNCcFppQW9jM1JoY25RZ1BUMDlJQ2NuSUNZbUlHRjBkSEp6TG1sdVpHVjRUMllvYTJWNUtTQTlQVDBnTFRFcElIdGNiaUFnSUNBZ0lDOHZJR052Ym5ScGJuVmxJSGRwZEdnZ2JtVjRkQ0JwZEdWeVlYUnBiMjVjYmlBZ0lDQWdJSEpsZEhWeWJseHVJQ0FnSUgxY2JseHVJQ0FnSUdsbUlDaHZZbXBiYTJWNVhTQWhQVDBnYm5Wc2JDQW1KaUJ2WW1wYmEyVjVYUzVqYjI1emRISjFZM1J2Y2lBOVBUMGdUMkpxWldOMEtTQjdYRzRnSUNBZ0lDQnNaWFFnYTJWNVUzUmhjblFnUFNCclpYbGNiaUFnSUNBZ0lHbG1JQ2h6ZEdGeWRDQWhQVDBnSnljcElIdGNiaUFnSUNBZ0lDQWdhMlY1VTNSaGNuUWdQU0JnSkh0emRHRnlkSDB0Skh0clpYbDlZRnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0J1WlhkUFltcGJhMlY1WFNBOUlHZGxkRUYwZEhKcFluVjBaWE5EYjI1bWFXY29aV3hsYldWdWRDd2diMkpxVzJ0bGVWMHNJR0YwZEhKekxDQnJaWGxUZEdGeWRDbGNiaUFnSUNBZ0lISmxkSFZ5Ymx4dUlDQWdJSDFjYmx4dUlDQWdJQzh2SUhWd1pHRjBaU0IyWVd4MVpWeHVJQ0FnSUd4bGRDQjJZV3gxWlNBOUlHOWlhbHRyWlhsZElDOHZJR1JsWm1GMWJIUWdkbUZzZFdWY2JpQWdJQ0JqYjI1emRDQjBlWEJsSUQwZ2RIbHdaVzltSUhaaGJIVmxYRzRnSUNBZ1kyOXVjM1FnWVhSMGNpQTlJR2RsZEVGMGRISnBZblYwWlNoemRHRnlkQ3dnYTJWNUtWeHVJQ0FnSUdOdmJuTjBJR0YwZEhKV1lXeDFaU0E5SUdWc1pXMWxiblF1WjJWMFFYUjBjbWxpZFhSbEtHRjBkSElwWEc1Y2JpQWdJQ0JwWmlBb1lYUjBjbFpoYkhWbElDRTlQU0J1ZFd4c0tTQjdYRzRnSUNBZ0lDQnBaaUFvZEhsd1pTQTlQVDBnSjJKdmIyeGxZVzRuS1NCN1hHNGdJQ0FnSUNBZ0lDOHZJR052Ym5abGNuUWdjM1J5YVc1bklIUnZJR0p2YjJ4bFlXNWNiaUFnSUNBZ0lDQWdkbUZzZFdVZ1BTQmhkSFJ5Vm1Gc2RXVWdQVDA5SUNkMGNuVmxKMXh1SUNBZ0lDQWdmU0JsYkhObElHbG1JQ2doYVhOT1lVNG9ZWFIwY2xaaGJIVmxLU2tnZTF4dUlDQWdJQ0FnSUNCMllXeDFaU0E5SUhCaGNuTmxTVzUwS0dGMGRISldZV3gxWlN3Z01UQXBYRzRnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQjJZV3gxWlNBOUlHRjBkSEpXWVd4MVpWeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JseHVJQ0FnSUc1bGQwOWlhbHRyWlhsZElEMGdkbUZzZFdWY2JpQWdmU2xjYmx4dUlDQnlaWFIxY200Z2JtVjNUMkpxWEc1OVhHNWNibU52Ym5OMElITjBZV05ySUQwZ1cxMWNibHh1Wlhod2IzSjBJR1JsWm1GMWJIUWdlMXh1SUNCaFpHUW9ZMjl0Y0c5dVpXNTBLU0I3WEc0Z0lDQWdjM1JoWTJzdWNIVnphQ2hqYjIxd2IyNWxiblFwWEc0Z0lIMHNYRzRnSUhKbGJXOTJaU2hqYjIxd2IyNWxiblFwSUh0Y2JpQWdJQ0JqYjI1emRDQnBibVJsZUNBOUlITjBZV05yTG1acGJtUkpibVJsZUNoaklEMCtJRTlpYW1WamRDNXBjeWhqYjIxd2IyNWxiblFzSUdNcEtWeHVJQ0FnSUdsbUlDaHBibVJsZUNBK0lDMHhLU0I3WEc0Z0lDQWdJQ0J6ZEdGamF5NXpjR3hwWTJVb2FXNWtaWGdzSURFcFhHNGdJQ0FnZlZ4dUlDQjlMRnh1SUNCamJHOXpZV0pzWlNoamIyMXdiMjVsYm5RcElIdGNiaUFnSUNCeVpYUjFjbTRnYzNSaFkyc3ViR1Z1WjNSb0lEMDlQU0F3SUh4OElFOWlhbVZqZEM1cGN5aHpkR0ZqYTF0emRHRmpheTVzWlc1bmRHZ2dMU0F4WFN3Z1kyOXRjRzl1Wlc1MEtWeHVJQ0I5WEc1OVhHNGlMQ0l2S2lwY2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0tpQk1hV05sYm5ObFpDQjFibVJsY2lCTlNWUWdLR2gwZEhCek9pOHZaMmwwYUhWaUxtTnZiUzl4ZFdGeWF5MWtaWFl2VUdodmJtOXVMVVp5WVcxbGQyOXlheTlpYkc5aUwyMWhjM1JsY2k5TVNVTkZUbE5GS1Z4dUlDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBcUwxeHVhVzF3YjNKMElFVjJaVzUwSUdaeWIyMGdKeTR1THk0dUwyTnZjbVV2WlhabGJuUnpKMXh1YVcxd2IzSjBJRU52YlhCdmJtVnVkQ0JtY205dElDY3VMaTlqYjIxd2IyNWxiblFuWEc1cGJYQnZjblFnZXlCblpYUkJkSFJ5YVdKMWRHVnpRMjl1Wm1sbklIMGdabkp2YlNBbkxpNHZZMjl0Y0c5dVpXNTBUV0Z1WVdkbGNpZGNibHh1WTI5dWMzUWdSR2xoYkc5bklEMGdLQ2dwSUQwK0lIdGNiaUFnTHlvcVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaUJEYjI1emRHRnVkSE5jYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUwxeHVYRzRnSUdOdmJuTjBJRTVCVFVVZ1BTQW5aR2xoYkc5bkoxeHVJQ0JqYjI1emRDQldSVkpUU1U5T0lEMGdKekl1TUM0d0oxeHVJQ0JqYjI1emRDQkNRVU5MUkZKUFVGOVRSVXhGUTFSUFVpQTlJQ2RrYVdGc2IyY3RZbUZqYTJSeWIzQW5YRzRnSUdOdmJuTjBJRVJGUmtGVlRGUmZVRkpQVUVWU1ZFbEZVeUE5SUh0Y2JpQWdJQ0JsYkdWdFpXNTBPaUJ1ZFd4c0xGeHVJQ0FnSUhScGRHeGxPaUJ1ZFd4c0xGeHVJQ0FnSUcxbGMzTmhaMlU2SUc1MWJHd3NYRzRnSUNBZ1kyRnVZMlZzWVdKc1pUb2dkSEoxWlN4Y2JpQWdmVnh1SUNCamIyNXpkQ0JFUVZSQlgwRlVWRkpUWDFCU1QxQkZVbFJKUlZNZ1BTQmJYRzRnSUNBZ0oyTmhibU5sYkdGaWJHVW5MRnh1SUNCZFhHNWNiaUFnTHlvcVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaUJEYkdGemN5QkVaV1pwYm1sMGFXOXVYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2k5Y2JseHVJQ0JqYkdGemN5QkVhV0ZzYjJjZ1pYaDBaVzVrY3lCRGIyMXdiMjVsYm5RZ2UxeHVYRzRnSUNBZ1kyOXVjM1J5ZFdOMGIzSW9iM0IwYVc5dWN5QTlJSHQ5S1NCN1hHNGdJQ0FnSUNCemRYQmxjaWhPUVUxRkxDQldSVkpUU1U5T0xDQkVSVVpCVlV4VVgxQlNUMUJGVWxSSlJWTXNJRzl3ZEdsdmJuTXNJRVJCVkVGZlFWUlVVbE5mVUZKUFVFVlNWRWxGVXl3Z2RISjFaU3dnZEhKMVpTbGNibHh1SUNBZ0lDQWdkR2hwY3k1MFpXMXdiR0YwWlNBOUlDY25JQ3RjYmlBZ0lDQWdJQ2M4WkdsMklHTnNZWE56UFZ3aVpHbGhiRzluWENJZ2RHRmlhVzVrWlhnOVhDSXRNVndpSUhKdmJHVTlYQ0prYVdGc2IyZGNJajRuSUN0Y2JpQWdJQ0FnSUNBZ0p6eGthWFlnWTJ4aGMzTTlYQ0prYVdGc2IyY3RhVzV1WlhKY0lpQnliMnhsUFZ3aVpHOWpkVzFsYm5SY0lqNG5JQ3RjYmlBZ0lDQWdJQ0FnSUNBblBHUnBkaUJqYkdGemN6MWNJbVJwWVd4dlp5MWpiMjUwWlc1MFhDSStKeUFyWEc0Z0lDQWdJQ0FnSUNBZ0lDQW5QR1JwZGlCamJHRnpjejFjSW1ScFlXeHZaeTFvWldGa1pYSmNJajRuSUN0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSnp4b05TQmpiR0Z6Y3oxY0ltUnBZV3h2WnkxMGFYUnNaVndpUGp3dmFEVStKeUFyWEc0Z0lDQWdJQ0FnSUNBZ0lDQW5QQzlrYVhZK0p5QXJYRzRnSUNBZ0lDQWdJQ0FnSUNBblBHUnBkaUJqYkdGemN6MWNJbVJwWVd4dlp5MWliMlI1WENJK0p5QXJYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDYzhjRDQ4TDNBK0p5QXJYRzRnSUNBZ0lDQWdJQ0FnSUNBblBDOWthWFkrSnlBclhHNGdJQ0FnSUNBZ0lDQWdJQ0FuUEdScGRpQmpiR0Z6Y3oxY0ltUnBZV3h2WnkxbWIyOTBaWEpjSWo0bklDdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0p6eGlkWFIwYjI0Z2RIbHdaVDFjSW1KMWRIUnZibHdpSUdOc1lYTnpQVndpWW5SdUlHSjBiaTF3Y21sdFlYSjVYQ0lnWkdGMFlTMWthWE50YVhOelBWd2laR2xoYkc5blhDSStUMnM4TDJKMWRIUnZiajRuSUN0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ2M4TDJScGRqNG5JQ3RjYmlBZ0lDQWdJQ0FnSUNBblBDOWthWFkrSnlBclhHNGdJQ0FnSUNBZ0lDYzhMMlJwZGo0bklDdGNiaUFnSUNBZ0lDYzhMMlJwZGo0blhHNWNiaUFnSUNBZ0lHbG1JQ2gwYUdsekxtUjVibUZ0YVdORmJHVnRaVzUwS1NCN1hHNGdJQ0FnSUNBZ0lIUm9hWE11WW5WcGJHUW9LVnh1SUNBZ0lDQWdmVnh1SUNBZ0lIMWNibHh1SUNBZ0lHSjFhV3hrS0NrZ2UxeHVJQ0FnSUNBZ1kyOXVjM1FnWW5WcGJHUmxjaUE5SUdSdlkzVnRaVzUwTG1OeVpXRjBaVVZzWlcxbGJuUW9KMlJwZGljcFhHNWNiaUFnSUNBZ0lHSjFhV3hrWlhJdWFXNXVaWEpJVkUxTUlEMGdkR2hwY3k1MFpXMXdiR0YwWlZ4dVhHNGdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDQTlJR0oxYVd4a1pYSXVabWx5YzNSRGFHbHNaRnh1WEc0Z0lDQWdJQ0F2THlCMGFYUnNaVnh1SUNBZ0lDQWdhV1lnS0hSb2FYTXViM0IwYVc5dWN5NTBhWFJzWlNBaFBUMGdiblZzYkNrZ2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eUtDY3VaR2xoYkc5bkxYUnBkR3hsSnlrdWFXNXVaWEpJVkUxTUlEMGdkR2hwY3k1dmNIUnBiMjV6TG5ScGRHeGxYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQzh2SUcxbGMzTmhaMlZjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbTl3ZEdsdmJuTXViV1Z6YzJGblpTQWhQVDBnYm5Wc2JDa2dlMXh1SUNBZ0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1eGRXVnllVk5sYkdWamRHOXlLQ2N1WkdsaGJHOW5MV0p2WkhrbktTNW1hWEp6ZEVOb2FXeGtMbWx1Ym1WeVNGUk5UQ0E5SUhSb2FYTXViM0IwYVc5dWN5NXRaWE56WVdkbFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lHUnZZM1Z0Wlc1MExtSnZaSGt1WVhCd1pXNWtRMmhwYkdRb2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXBYRzVjYmlBZ0lDQWdJSFJvYVhNdWMyVjBRWFIwY21saWRYUmxjeWdwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdZblZwYkdSQ1lXTnJaSEp2Y0NncElIdGNiaUFnSUNBZ0lHTnZibk4wSUdKaFkydGtjbTl3SUQwZ1pHOWpkVzFsYm5RdVkzSmxZWFJsUld4bGJXVnVkQ2duWkdsMkp5bGNiaUFnSUNBZ0lHSmhZMnRrY205d0xuTmxkRUYwZEhKcFluVjBaU2duWkdGMFlTMXBaQ2NzSUhSb2FYTXVhV1FwWEc0Z0lDQWdJQ0JpWVdOclpISnZjQzVqYkdGemMweHBjM1F1WVdSa0tFSkJRMHRFVWs5UVgxTkZURVZEVkU5U0tWeHVYRzRnSUNBZ0lDQmtiMk4xYldWdWRDNWliMlI1TG1Gd2NHVnVaRU5vYVd4a0tHSmhZMnRrY205d0tWeHVJQ0FnSUgxY2JseHVJQ0FnSUdkbGRFSmhZMnRrY205d0tDa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlHUnZZM1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0lvWUM0a2UwSkJRMHRFVWs5UVgxTkZURVZEVkU5U2ZWdGtZWFJoTFdsa1BWd2lKSHQwYUdsekxtbGtmVndpWFdBcFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnWTJWdWRHVnlLQ2tnZTF4dUlDQWdJQ0FnWTI5dWMzUWdZMjl0Y0hWMFpXUlRkSGxzWlNBOUlIZHBibVJ2ZHk1blpYUkRiMjF3ZFhSbFpGTjBlV3hsS0hSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MEtWeHVJQ0FnSUNBZ0x5OGdZMjl1YzNRZ2QybGtkR2dnUFNCamIyMXdkWFJsWkZOMGVXeGxMbmRwWkhSb0xuTnNhV05sS0RBc0lHTnZiWEIxZEdWa1UzUjViR1V1ZDJsa2RHZ3ViR1Z1WjNSb0lDMGdNaWxjYmlBZ0lDQWdJR052Ym5OMElHaGxhV2RvZENBOUlHTnZiWEIxZEdWa1UzUjViR1V1YUdWcFoyaDBMbk5zYVdObEtEQXNJR052YlhCMWRHVmtVM1I1YkdVdWFHVnBaMmgwTG14bGJtZDBhQ0F0SURJcFhHNWNiaUFnSUNBZ0lHTnZibk4wSUhSdmNDQTlJQ2gzYVc1a2IzY3VhVzV1WlhKSVpXbG5hSFFnTHlBeUtTQXRJQ2hvWldsbmFIUWdMeUF5S1Z4dUlDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdWMzUjViR1V1ZEc5d0lEMGdZQ1I3ZEc5d2ZYQjRZRnh1SUNBZ0lIMWNibHh1SUNBZ0lITm9iM2NvS1NCN1hHNGdJQ0FnSUNCcFppQW9kR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblFnUFQwOUlHNTFiR3dwSUh0Y2JpQWdJQ0FnSUNBZ0x5OGdZblZwYkdRZ1lXNWtJR2x1YzJWeWRDQmhJRzVsZHlCRVQwMGdaV3hsYldWdWRGeHVJQ0FnSUNBZ0lDQjBhR2x6TG1KMWFXeGtLQ2xjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnYVdZZ0tIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbU5zWVhOelRHbHpkQzVqYjI1MFlXbHVjeWduYzJodmR5Y3BLU0I3WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJtWVd4elpWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQXZMeUJoWkdRZ1lTQjBhVzFsYjNWMElITnZJSFJvWVhRZ2RHaGxJRU5UVXlCaGJtbHRZWFJwYjI0Z2QyOXlhM05jYmlBZ0lDQWdJSE5sZEZScGJXVnZkWFFvS0NrZ1BUNGdlMXh1SUNBZ0lDQWdJQ0IwYUdsekxuUnlhV2RuWlhKRmRtVnVkQ2hGZG1WdWRDNVRTRTlYS1Z4dUlDQWdJQ0FnSUNCMGFHbHpMbUoxYVd4a1FtRmphMlJ5YjNBb0tWeHVYRzRnSUNBZ0lDQWdJR052Ym5OMElHOXVVMmh2ZDI0Z1BTQW9LU0E5UGlCN1hHNGdJQ0FnSUNBZ0lDQWdkR2hwY3k1MGNtbG5aMlZ5UlhabGJuUW9SWFpsYm5RdVUwaFBWMDRwWEc0Z0lDQWdJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVjbVZ0YjNabFJYWmxiblJNYVhOMFpXNWxjaWhGZG1WdWRDNVVVa0ZPVTBsVVNVOU9YMFZPUkN3Z2IyNVRhRzkzYmlsY2JseHVJQ0FnSUNBZ0lDQWdJQzh2SUdGMGRHRmphQ0JsZG1WdWRGeHVJQ0FnSUNBZ0lDQWdJSFJvYVhNdVlYUjBZV05vUlhabGJuUnpLQ2xjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbUZrWkVWMlpXNTBUR2x6ZEdWdVpYSW9SWFpsYm5RdVZGSkJUbE5KVkVsUFRsOUZUa1FzSUc5dVUyaHZkMjRwWEc1Y2JpQWdJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVZMnhoYzNOTWFYTjBMbUZrWkNnbmMyaHZkeWNwWEc1Y2JpQWdJQ0FnSUNBZ2RHaHBjeTVqWlc1MFpYSW9LVnh1SUNBZ0lDQWdmU3dnTVNsY2JseHVJQ0FnSUNBZ2NtVjBkWEp1SUhSeWRXVmNiaUFnSUNCOVhHNWNiaUFnSUNCdmJrVnNaVzFsYm5SRmRtVnVkQ2hsZG1WdWRDa2dlMXh1SUNBZ0lDQWdhV1lnS0dWMlpXNTBMblI1Y0dVZ1BUMDlJQ2RyWlhsMWNDY2dKaVlnWlhabGJuUXVhMlY1UTI5a1pTQWhQVDBnTWpjZ0ppWWdaWFpsYm5RdWEyVjVRMjlrWlNBaFBUMGdNVE1wSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1WEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUM4dklHaHBaR1VnZEdobElHUnBZV3h2WjF4dUlDQWdJQ0FnZEdocGN5NW9hV1JsS0NsY2JpQWdJQ0I5WEc1Y2JpQWdJQ0JvYVdSbEtDa2dlMXh1SUNBZ0lDQWdhV1lnS0NGMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNWpiR0Z6YzB4cGMzUXVZMjl1ZEdGcGJuTW9KM05vYjNjbktTa2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdabUZzYzJWY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2RHaHBjeTUwY21sbloyVnlSWFpsYm5Rb1JYWmxiblF1U0VsRVJTbGNibHh1SUNBZ0lDQWdkR2hwY3k1a1pYUmhZMmhGZG1WdWRITW9LVnh1WEc0Z0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1amJHRnpjMHhwYzNRdVlXUmtLQ2RvYVdSbEp5bGNiaUFnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbU5zWVhOelRHbHpkQzV5WlcxdmRtVW9KM05vYjNjbktWeHVYRzRnSUNBZ0lDQmpiMjV6ZENCaVlXTnJaSEp2Y0NBOUlIUm9hWE11WjJWMFFtRmphMlJ5YjNBb0tWeHVYRzRnSUNBZ0lDQmpiMjV6ZENCdmJraHBaR1JsYmlBOUlDZ3BJRDArSUh0Y2JpQWdJQ0FnSUNBZ1pHOWpkVzFsYm5RdVltOWtlUzV5WlcxdmRtVkRhR2xzWkNoaVlXTnJaSEp2Y0NsY2JseHVJQ0FnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVqYkdGemMweHBjM1F1Y21WdGIzWmxLQ2RvYVdSbEp5bGNibHh1SUNBZ0lDQWdJQ0IwYUdsekxuUnlhV2RuWlhKRmRtVnVkQ2hGZG1WdWRDNUlTVVJFUlU0cFhHNWNiaUFnSUNBZ0lDQWdZbUZqYTJSeWIzQXVjbVZ0YjNabFJYWmxiblJNYVhOMFpXNWxjaWhGZG1WdWRDNVVVa0ZPVTBsVVNVOU9YMFZPUkN3Z2IyNUlhV1JrWlc0cFhHNWNiaUFnSUNBZ0lDQWdMeThnY21WdGIzWmxJR2RsYm1WeVlYUmxaQ0JrYVdGc2IyZHpJR1p5YjIwZ2RHaGxJRVJQVFZ4dUlDQWdJQ0FnSUNCcFppQW9kR2hwY3k1a2VXNWhiV2xqUld4bGJXVnVkQ2tnZTF4dUlDQWdJQ0FnSUNBZ0lHUnZZM1Z0Wlc1MExtSnZaSGt1Y21WdGIzWmxRMmhwYkdRb2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXBYRzRnSUNBZ0lDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RZ1BTQnVkV3hzWEc0Z0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ1ltRmphMlJ5YjNBdVlXUmtSWFpsYm5STWFYTjBaVzVsY2loRmRtVnVkQzVVVWtGT1UwbFVTVTlPWDBWT1JDd2diMjVJYVdSa1pXNHBYRzRnSUNBZ0lDQmlZV05yWkhKdmNDNWpiR0Z6YzB4cGMzUXVZV1JrS0NkbVlXUmxiM1YwSnlsY2JseHVJQ0FnSUNBZ2NtVjBkWEp1SUhSeWRXVmNiaUFnSUNCOVhHNWNiaUFnSUNCaGRIUmhZMmhGZG1WdWRITW9LU0I3WEc0Z0lDQWdJQ0JqYjI1emRDQmthWE50YVhOelFuVjBkRzl1Y3lBOUlIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNKQmJHd29KMXRrWVhSaExXUnBjMjFwYzNOZEp5bGNiaUFnSUNBZ0lHbG1JQ2hrYVhOdGFYTnpRblYwZEc5dWN5a2dlMXh1SUNBZ0lDQWdJQ0JrYVhOdGFYTnpRblYwZEc5dWN5NW1iM0pGWVdOb0tHSjFkSFJ2YmlBOVBpQjBhR2x6TG5KbFoybHpkR1Z5Uld4bGJXVnVkQ2g3SUhSaGNtZGxkRG9nWW5WMGRHOXVMQ0JsZG1WdWREb2dKMk5zYVdOckp5QjlLU2xjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnTHk4Z1lXUmtJR1YyWlc1MGN5QnBaaUIwYUdVZ1pHbGhiRzluSUdseklHTmhibU5sYkdGaWJHVmNiaUFnSUNBZ0lDOHZJSGRvYVdOb0lHMWxZVzV6SUhSb1pTQjFjMlZ5SUdOaGJpQm9hV1JsSUhSb1pTQmthV0ZzYjJkY2JpQWdJQ0FnSUM4dklHSjVJSEJ5WlhOemFXNW5JSFJvWlNCRlUwTWdhMlY1SUc5eUlHTnNhV05ySUc5MWRITnBaR1VnZEdobElHSmhZMnRrY205d1hHNGdJQ0FnSUNCcFppQW9kR2hwY3k1dmNIUnBiMjV6TG1OaGJtTmxiR0ZpYkdVcElIdGNiaUFnSUNBZ0lDQWdZMjl1YzNRZ1ltRmphMlJ5YjNBZ1BTQjBhR2x6TG1kbGRFSmhZMnRrY205d0tDbGNiaUFnSUNBZ0lDQWdkR2hwY3k1eVpXZHBjM1JsY2tWc1pXMWxiblFvZXlCMFlYSm5aWFE2SUdKaFkydGtjbTl3TENCbGRtVnVkRG9nUlhabGJuUXVVMVJCVWxRZ2ZTbGNiaUFnSUNBZ0lDQWdkR2hwY3k1eVpXZHBjM1JsY2tWc1pXMWxiblFvZXlCMFlYSm5aWFE2SUdSdlkzVnRaVzUwTENCbGRtVnVkRG9nSjJ0bGVYVndKeUI5S1Z4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmx4dUlDQWdJR1JsZEdGamFFVjJaVzUwY3lncElIdGNiaUFnSUNBZ0lHTnZibk4wSUdScGMyMXBjM05DZFhSMGIyNXpJRDBnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZja0ZzYkNnblcyUmhkR0V0WkdsemJXbHpjMTBuS1Z4dUlDQWdJQ0FnYVdZZ0tHUnBjMjFwYzNOQ2RYUjBiMjV6S1NCN1hHNGdJQ0FnSUNBZ0lHUnBjMjFwYzNOQ2RYUjBiMjV6TG1admNrVmhZMmdvWW5WMGRHOXVJRDArSUhSb2FYTXVkVzV5WldkcGMzUmxja1ZzWlcxbGJuUW9leUIwWVhKblpYUTZJR0oxZEhSdmJpd2daWFpsYm5RNklDZGpiR2xqYXljZ2ZTa3BYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbTl3ZEdsdmJuTXVZMkZ1WTJWc1lXSnNaU2tnZTF4dUlDQWdJQ0FnSUNCamIyNXpkQ0JpWVdOclpISnZjQ0E5SUhSb2FYTXVaMlYwUW1GamEyUnliM0FvS1Z4dUlDQWdJQ0FnSUNCMGFHbHpMblZ1Y21WbmFYTjBaWEpGYkdWdFpXNTBLSHNnZEdGeVoyVjBPaUJpWVdOclpISnZjQ3dnWlhabGJuUTZJRVYyWlc1MExsTlVRVkpVSUgwcFhHNGdJQ0FnSUNBZ0lIUm9hWE11ZFc1eVpXZHBjM1JsY2tWc1pXMWxiblFvZXlCMFlYSm5aWFE2SUdSdlkzVnRaVzUwTENCbGRtVnVkRG9nSjJ0bGVYVndKeUI5S1Z4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmx4dUlDQWdJSE4wWVhScFl5QmZSRTlOU1c1MFpYSm1ZV05sS0c5d2RHbHZibk1wSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJ6ZFhCbGNpNWZSRTlOU1c1MFpYSm1ZV05sS0VScFlXeHZaeXdnYjNCMGFXOXVjeWxjYmlBZ0lDQjlYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFJRVJQVFNCQmNHa2dhVzF3YkdWdFpXNTBZWFJwYjI1Y2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFMMXh1SUNCamIyNXpkQ0JqYjIxd2IyNWxiblJ6SUQwZ1cxMWNibHh1SUNCamIyNXpkQ0JrYVdGc2IyZHpJRDBnWkc5amRXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNrRnNiQ2hnTGlSN1RrRk5SWDFnS1Z4dUlDQnBaaUFvWkdsaGJHOW5jeWtnZTF4dUlDQWdJR1JwWVd4dlozTXVabTl5UldGamFDZ29aV3hsYldWdWRDa2dQVDRnZTF4dUlDQWdJQ0FnWTI5dWMzUWdZMjl1Wm1sbklEMGdaMlYwUVhSMGNtbGlkWFJsYzBOdmJtWnBaeWhsYkdWdFpXNTBMQ0JFUlVaQlZVeFVYMUJTVDFCRlVsUkpSVk1zSUVSQlZFRmZRVlJVVWxOZlVGSlBVRVZTVkVsRlV5bGNiaUFnSUNBZ0lHTnZibVpwWnk1bGJHVnRaVzUwSUQwZ1pXeGxiV1Z1ZEZ4dVhHNGdJQ0FnSUNCamIyMXdiMjVsYm5SekxuQjFjMmdvZXlCbGJHVnRaVzUwTENCa2FXRnNiMmM2SUc1bGR5QkVhV0ZzYjJjb1kyOXVabWxuS1NCOUtWeHVJQ0FnSUgwcFhHNGdJSDFjYmx4dUlDQnBaaUFvWkdsaGJHOW5jeWtnZTF4dUlDQWdJR1J2WTNWdFpXNTBMbUZrWkVWMlpXNTBUR2x6ZEdWdVpYSW9KMk5zYVdOckp5d2dLR1YyWlc1MEtTQTlQaUI3WEc0Z0lDQWdJQ0JqYjI1emRDQmtZWFJoVkc5bloyeGxRWFIwY2lBOUlHVjJaVzUwTG5SaGNtZGxkQzVuWlhSQmRIUnlhV0oxZEdVb0oyUmhkR0V0ZEc5bloyeGxKeWxjYmlBZ0lDQWdJR2xtSUNoa1lYUmhWRzluWjJ4bFFYUjBjaUFtSmlCa1lYUmhWRzluWjJ4bFFYUjBjaUE5UFQwZ1RrRk5SU2tnZTF4dUlDQWdJQ0FnSUNCamIyNXpkQ0JwWkNBOUlHVjJaVzUwTG5SaGNtZGxkQzVuWlhSQmRIUnlhV0oxZEdVb0oyUmhkR0V0ZEdGeVoyVjBKeWxjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdaV3hsYldWdWRDQTlJR1J2WTNWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNJb2FXUXBYRzVjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdZMjl0Y0c5dVpXNTBJRDBnWTI5dGNHOXVaVzUwY3k1bWFXNWtLR01nUFQ0Z1l5NWxiR1Z0Wlc1MElEMDlQU0JsYkdWdFpXNTBLVnh1WEc0Z0lDQWdJQ0FnSUdsbUlDZ2hZMjl0Y0c5dVpXNTBLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2NtVjBkWEp1WEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQmxkbVZ1ZEM1MFlYSm5aWFF1WW14MWNpZ3BYRzVjYmlBZ0lDQWdJQ0FnWTI5dGNHOXVaVzUwTG1ScFlXeHZaeTV6YUc5M0tDbGNiaUFnSUNBZ0lIMWNiaUFnSUNCOUtWeHVJQ0I5WEc1Y2JpQWdjbVYwZFhKdUlFUnBZV3h2WjF4dWZTa29LVnh1WEc1bGVIQnZjblFnWkdWbVlYVnNkQ0JFYVdGc2IyZGNiaUlzSWk4cUtseHVJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQXFJRXhwWTJWdWMyVmtJSFZ1WkdWeUlFMUpWQ0FvYUhSMGNITTZMeTluYVhSb2RXSXVZMjl0TDNGMVlYSnJMV1JsZGk5UWFHOXViMjR0Um5KaGJXVjNiM0pyTDJKc2IySXZiV0Z6ZEdWeUwweEpRMFZPVTBVcFhHNGdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDb3ZYRzVwYlhCdmNuUWdRMjl0Y0c5dVpXNTBJR1p5YjIwZ0p5NHVMMk52YlhCdmJtVnVkQ2RjYm1sdGNHOXlkQ0JGZG1WdWRDQm1jbTl0SUNjdUxpOHVMaTlqYjNKbEwyVjJaVzUwY3lkY2JtbHRjRzl5ZENCN0lHWnBibVJVWVhKblpYUkNlVU5zWVhOeklIMGdabkp2YlNBbkxpNHZMaTR2WTI5eVpTOTFkR2xzY3lkY2JtbHRjRzl5ZENCN0lHZGxkRUYwZEhKcFluVjBaWE5EYjI1bWFXY2dmU0JtY205dElDY3VMaTlqYjIxd2IyNWxiblJOWVc1aFoyVnlKMXh1WEc1amIyNXpkQ0JFY205d1pHOTNiaUE5SUNnb0tTQTlQaUI3WEc0Z0lDOHFLbHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvZ1EyOXVjM1JoYm5SelhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaTljYmx4dUlDQmpiMjV6ZENCT1FVMUZJRDBnSjJSeWIzQmtiM2R1SjF4dUlDQmpiMjV6ZENCV1JWSlRTVTlPSUQwZ0p6SXVNQzR3SjF4dUlDQmpiMjV6ZENCRVJVWkJWVXhVWDFCU1QxQkZVbFJKUlZNZ1BTQjdYRzRnSUNBZ1pXeGxiV1Z1ZERvZ2JuVnNiQ3hjYmlBZ0lDQmtaV1poZFd4ME9pQjBjblZsTEZ4dUlDQjlYRzRnSUdOdmJuTjBJRVJCVkVGZlFWUlVVbE5mVUZKUFVFVlNWRWxGVXlBOUlGdGNiaUFnSUNBblpHVm1ZWFZzZENjc1hHNGdJRjFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUlFTnNZWE56SUVSbFptbHVhWFJwYjI1Y2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFMMXh1WEc0Z0lHTnNZWE56SUVSeWIzQmtiM2R1SUdWNGRHVnVaSE1nUTI5dGNHOXVaVzUwSUh0Y2JseHVJQ0FnSUdOdmJuTjBjblZqZEc5eUtHOXdkR2x2Ym5NZ1BTQjdmU2tnZTF4dUlDQWdJQ0FnYzNWd1pYSW9Ua0ZOUlN3Z1ZrVlNVMGxQVGl3Z1JFVkdRVlZNVkY5UVVrOVFSVkpVU1VWVExDQnZjSFJwYjI1ekxDQkVRVlJCWDBGVVZGSlRYMUJTVDFCRlVsUkpSVk1zSUdaaGJITmxMQ0JtWVd4elpTbGNibHh1SUNBZ0lDQWdZMjl1YzNRZ2MyVnNaV04wWldRZ1BTQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eUtDZGJaR0YwWVMxelpXeGxZM1JsWkYwbktWeHVJQ0FnSUNBZ1kyOXVjM1FnYVhSbGJTQTlJSFJvYVhNdVoyVjBTWFJsYlVSaGRHRW9jMlZzWldOMFpXUXBYRzVjYmlBZ0lDQWdJSFJvYVhNdWMyVjBVMlZzWldOMFpXUW9hWFJsYlM1MllXeDFaU3dnYVhSbGJTNTBaWGgwTENCbVlXeHpaU2xjYmlBZ0lDQjlYRzVjYmlBZ0lDQnpaWFJRYjNOcGRHbHZiaWhpZFhSMGIyNHBJSHRjYmx4dUlDQWdJSDFjYmx4dUlDQWdJSE5sZEZObGJHVmpkR1ZrS0haaGJIVmxJRDBnSnljc0lIUmxlSFFnUFNCdWRXeHNMQ0JqYUdWamEwVjRhWE4wY3lBOUlIUnlkV1VwSUh0Y2JpQWdJQ0FnSUdsbUlDZ2hkR2hwY3k1dmNIUnBiMjV6TG1SbFptRjFiSFFwSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUdaaGJITmxYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR3hsZENCMFpYaDBSR2x6Y0d4aGVTQTlJSFJsZUhSY2JpQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0lvSnk1a1pXWmhkV3gwTFhSbGVIUW5LUzVwYm01bGNraFVUVXdnUFNCMFpYaDBYRzRnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eUtDZHBibkIxZEZ0MGVYQmxQVndpYUdsa1pHVnVYQ0pkSnlrdWRtRnNkV1VnUFNCMllXeDFaVnh1WEc0Z0lDQWdJQ0JwWmlBb1kyaGxZMnRGZUdsemRITXBJSHRjYmlBZ0lDQWdJQ0FnYkdWMElHWnZkVzVrSUQwZ1ptRnNjMlZjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdhWFJsYlhNZ1BTQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eVFXeHNLQ2N1YVhSbGJTY3BYRzRnSUNBZ0lDQWdJR2xtSUNocGRHVnRjeWtnZTF4dUlDQWdJQ0FnSUNBZ0lHWnZjaUFvWTI5dWMzUWdhWFJsYlNCdlppQnBkR1Z0Y3lrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnWTI5dWMzUWdaR0YwWVNBOUlIUm9hWE11WjJWMFNYUmxiVVJoZEdFb2FYUmxiU2xjYmlBZ0lDQWdJQ0FnSUNBZ0lHbG1JQ2gyWVd4MVpTQTlQVDBnWkdGMFlTNTJZV3gxWlNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBdkx5QjFjR1JoZEdVZ2RHaGxJSFJsZUhRZ2RHOGdaR2x6Y0d4aGVTQnBaaUJwZENCcGN5QnVkV3hzSUc5dWJIbGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLSFJsZUhSRWFYTndiR0Y1SUQwOVBTQnVkV3hzS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2RHVjRkRVJwYzNCc1lYa2dQU0JrWVhSaExuUmxlSFJjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQm1iM1Z1WkNBOUlIUnlkV1ZjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdZbkpsWVd0Y2JpQWdJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1eGRXVnllVk5sYkdWamRHOXlLQ2N1WkdWbVlYVnNkQzEwWlhoMEp5a3VhVzV1WlhKSVZFMU1JRDBnZEdWNGRFUnBjM0JzWVhsY2JpQWdJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVjWFZsY25sVFpXeGxZM1J2Y2lnbmFXNXdkWFJiZEhsd1pUMWNJbWhwWkdSbGJsd2lYU2NwTG5aaGJIVmxJRDBnZG1Gc2RXVmNibHh1SUNBZ0lDQWdJQ0JwWmlBb0lXWnZkVzVrS1NCN1hHNGdJQ0FnSUNBZ0lDQWdkR2h5YjNjZ2JtVjNJRVZ5Y205eUtHQWtlMDVCVFVWOUxpQlVhR1VnZG1Gc2RXVWdYQ0lrZTNaaGJIVmxmVndpSUdSdlpYTWdibTkwSUdWNGFYTjBJR2x1SUhSb1pTQnNhWE4wSUc5bUlHbDBaVzF6TG1BcFhHNGdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lIMWNiaUFnSUNCOVhHNWNiaUFnSUNCblpYUlRaV3hsWTNSbFpDZ3BJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eUtDZHBibkIxZEZ0MGVYQmxQVndpYUdsa1pHVnVYQ0pkSnlrdWRtRnNkV1ZjYmlBZ0lDQjlYRzVjYmlBZ0lDQm5aWFJKZEdWdFJHRjBZU2hwZEdWdElEMGdiblZzYkNrZ2UxeHVJQ0FnSUNBZ2JHVjBJSFJsZUhRZ1BTQW5KMXh1SUNBZ0lDQWdiR1YwSUhaaGJIVmxJRDBnSnlkY2JseHVJQ0FnSUNBZ2FXWWdLR2wwWlcwcElIdGNiaUFnSUNBZ0lDQWdkR1Y0ZENBOUlHbDBaVzB1WjJWMFFYUjBjbWxpZFhSbEtDZGtZWFJoTFhSbGVIUW5LU0I4ZkNCcGRHVnRMbWx1Ym1WeVNGUk5URnh1WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJSE5sYkdWamRHVmtWR1Y0ZEU1dlpHVWdQU0JwZEdWdExuRjFaWEo1VTJWc1pXTjBiM0lvSnk1MFpYaDBKeWxjYmlBZ0lDQWdJQ0FnYVdZZ0tITmxiR1ZqZEdWa1ZHVjRkRTV2WkdVcElIdGNiaUFnSUNBZ0lDQWdJQ0IwWlhoMElEMGdjMlZzWldOMFpXUlVaWGgwVG05a1pTNXBibTVsY2toVVRVeGNiaUFnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUhaaGJIVmxJRDBnYVhSbGJTNW5aWFJCZEhSeWFXSjFkR1VvSjJSaGRHRXRkbUZzZFdVbktWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQnlaWFIxY200Z2V5QjBaWGgwTENCMllXeDFaU0I5WEc0Z0lDQWdmVnh1WEc0Z0lDQWdiMjVGYkdWdFpXNTBSWFpsYm5Rb1pYWmxiblFwSUh0Y2JpQWdJQ0FnSUdsbUlDaGxkbVZ1ZEM1MGVYQmxJRDA5UFNCRmRtVnVkQzVUVkVGU1ZDa2dlMXh1SUNBZ0lDQWdJQ0JqYjI1emRDQmtjbTl3Wkc5M2JpQTlJR1pwYm1SVVlYSm5aWFJDZVVOc1lYTnpLR1YyWlc1MExuUmhjbWRsZEN3Z0oyUnliM0JrYjNkdUp5bGNiaUFnSUNBZ0lDQWdhV1lnS0NGa2NtOXdaRzkzYmlrZ2UxeHVJQ0FnSUNBZ0lDQWdJSFJvYVhNdWFHbGtaU2dwWEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2ZTQmxiSE5sSUdsbUlDaGxkbVZ1ZEM1MGVYQmxJRDA5UFNBblkyeHBZMnNuS1NCN1hHNGdJQ0FnSUNBZ0lHTnZibk4wSUdsMFpXMGdQU0JtYVc1a1ZHRnlaMlYwUW5sRGJHRnpjeWhsZG1WdWRDNTBZWEpuWlhRc0lDZHBkR1Z0SnlsY2JseHVJQ0FnSUNBZ0lDQnBaaUFvYVhSbGJTa2dlMXh1SUNBZ0lDQWdJQ0FnSUdsbUlDaHBkR1Z0TG1Oc1lYTnpUR2x6ZEM1amIyNTBZV2x1Y3lnblpHbHpZV0pzWldRbktTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1WEc0Z0lDQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJQ0FnWTI5dWMzUWdhWFJsYlVsdVptOGdQU0IwYUdsekxtZGxkRWwwWlcxRVlYUmhLR2wwWlcwcFhHNGdJQ0FnSUNBZ0lDQWdkR2hwY3k1elpYUlRaV3hsWTNSbFpDaHBkR1Z0U1c1bWJ5NTJZV3gxWlN3Z2FYUmxiVWx1Wm04dWRHVjRkQ3dnWm1Gc2MyVXBYRzVjYmlBZ0lDQWdJQ0FnSUNCamIyNXpkQ0JrWlhSaGFXd2dQU0I3SUdsMFpXMHNJSFJsZUhRNklHbDBaVzFKYm1adkxuUmxlSFFzSUhaaGJIVmxPaUJwZEdWdFNXNW1ieTUyWVd4MVpTQjlYRzRnSUNBZ0lDQWdJQ0FnZEdocGN5NTBjbWxuWjJWeVJYWmxiblFvUlhabGJuUXVTVlJGVFY5VFJVeEZRMVJGUkN3Z1pHVjBZV2xzS1Z4dVhHNGdJQ0FnSUNBZ0lDQWdkR2hwY3k1b2FXUmxLQ2xjYmlBZ0lDQWdJQ0FnSUNCeVpYUjFjbTVjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lDOHZJR1J2YmlkMElIUnZaMmRzWlNCMGFHVWdaSEp2Y0dSdmQyNGdhV1lnZEdobElHVjJaVzUwSUdOdmJtTmxjbTV6SUdobFlXUmxjbk1zSUdScGRtbGtaWEp6WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJR1J5YjNCa2IzZHVUV1Z1ZFNBOUlHWnBibVJVWVhKblpYUkNlVU5zWVhOektHVjJaVzUwTG5SaGNtZGxkQ3dnSjJSeWIzQmtiM2R1TFcxbGJuVW5LVnh1SUNBZ0lDQWdJQ0JwWmlBb1pISnZjR1J2ZDI1TlpXNTFLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2NtVjBkWEp1WEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQjBhR2x6TG5SdloyZHNaU2dwWEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1WEc0Z0lDQWdkRzluWjJ4bEtDa2dlMXh1SUNBZ0lDQWdhV1lnS0hSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExtTnNZWE56VEdsemRDNWpiMjUwWVdsdWN5Z25ZV04wYVhabEp5a3BJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJSFJvYVhNdWFHbGtaU2dwWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhKbGRIVnliaUIwYUdsekxuTm9iM2NvS1Z4dUlDQWdJSDFjYmx4dUlDQWdJSE5vYjNjb0tTQjdYRzRnSUNBZ0lDQnBaaUFvZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdVkyeGhjM05NYVhOMExtTnZiblJoYVc1ektDZGhZM1JwZG1VbktTa2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdabUZzYzJWY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVZMnhoYzNOTWFYTjBMbUZrWkNnbllXTjBhWFpsSnlsY2JseHVJQ0FnSUNBZ1kyOXVjM1FnWkhKdmNHUnZkMjVOWlc1MUlEMGdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNpZ25MbVJ5YjNCa2IzZHVMVzFsYm5VbktWeHVYRzRnSUNBZ0lDQXZMeUJ6WTNKdmJHd2dkRzhnZEc5d1hHNGdJQ0FnSUNCa2NtOXdaRzkzYmsxbGJuVXVjMk55YjJ4c1ZHOXdJRDBnTUZ4dVhHNGdJQ0FnSUNCMGFHbHpMblJ5YVdkblpYSkZkbVZ1ZENoRmRtVnVkQzVUU0U5WEtWeHVJQ0FnSUNBZ2RHaHBjeTUwY21sbloyVnlSWFpsYm5Rb1JYWmxiblF1VTBoUFYwNHBYRzVjYmlBZ0lDQWdJSFJvYVhNdWNtVm5hWE4wWlhKRmJHVnRaVzUwS0hzZ2RHRnlaMlYwT2lCa2NtOXdaRzkzYmsxbGJuVXNJR1YyWlc1ME9pQW5ZMnhwWTJzbklIMHBJQ0FnSUNBZ1hHNGdJQ0FnSUNCMGFHbHpMbkpsWjJsemRHVnlSV3hsYldWdWRDaDdJSFJoY21kbGREb2daRzlqZFcxbGJuUXVZbTlrZVN3Z1pYWmxiblE2SUVWMlpXNTBMbE5VUVZKVUlIMHBYRzVjYmlBZ0lDQWdJSEpsZEhWeWJpQjBjblZsWEc0Z0lDQWdmVnh1WEc0Z0lDQWdhR2xrWlNncElIdGNiaUFnSUNBZ0lHbG1JQ2doZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdVkyeGhjM05NYVhOMExtTnZiblJoYVc1ektDZGhZM1JwZG1VbktTa2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdabUZzYzJWY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25ZV04wYVhabEp5bGNibHh1SUNBZ0lDQWdkR2hwY3k1MGNtbG5aMlZ5UlhabGJuUW9SWFpsYm5RdVNFbEVSU2xjYmlBZ0lDQWdJSFJvYVhNdWRISnBaMmRsY2tWMlpXNTBLRVYyWlc1MExraEpSRVJGVGlsY2JseHVJQ0FnSUNBZ2RHaHBjeTUxYm5KbFoybHpkR1Z5Uld4bGJXVnVkQ2g3SUhSaGNtZGxkRG9nZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZjaWduTG1SeWIzQmtiM2R1TFcxbGJuVW5LU3dnWlhabGJuUTZJQ2RqYkdsamF5Y2dmU2tnSUNBZ0lDQmNiaUFnSUNBZ0lIUm9hWE11ZFc1eVpXZHBjM1JsY2tWc1pXMWxiblFvZXlCMFlYSm5aWFE2SUdSdlkzVnRaVzUwTG1KdlpIa3NJR1YyWlc1ME9pQkZkbVZ1ZEM1VFZFRlNWQ0I5S1Z4dVhHNGdJQ0FnSUNCeVpYUjFjbTRnZEhKMVpWeHVJQ0FnSUgxY2JseHVJQ0FnSUhOMFlYUnBZeUJmUkU5TlNXNTBaWEptWVdObEtHOXdkR2x2Ym5NcElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCemRYQmxjaTVmUkU5TlNXNTBaWEptWVdObEtFUnliM0JrYjNkdUxDQnZjSFJwYjI1ektWeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvZ1JFOU5JRUZ3YVNCcGJYQnNaVzFsYm5SaGRHbHZibHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvdlhHNGdJR052Ym5OMElHTnZiWEJ2Ym1WdWRITWdQU0JiWFZ4dVhHNGdJR052Ym5OMElHUnliM0JrYjNkdWN5QTlJR1J2WTNWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNKQmJHd29ZQzRrZTA1QlRVVjlZQ2xjYmlBZ2FXWWdLR1J5YjNCa2IzZHVjeWtnZTF4dUlDQWdJR1J5YjNCa2IzZHVjeTVtYjNKRllXTm9LQ2hsYkdWdFpXNTBLU0E5UGlCN1hHNGdJQ0FnSUNCamIyNXpkQ0JqYjI1bWFXY2dQU0JuWlhSQmRIUnlhV0oxZEdWelEyOXVabWxuS0dWc1pXMWxiblFzSUVSRlJrRlZURlJmVUZKUFVFVlNWRWxGVXl3Z1JFRlVRVjlCVkZSU1UxOVFVazlRUlZKVVNVVlRLVnh1SUNBZ0lDQWdZMjl1Wm1sbkxtVnNaVzFsYm5RZ1BTQmxiR1Z0Wlc1MFhHNWNiaUFnSUNBZ0lHTnZiWEJ2Ym1WdWRITXVjSFZ6YUNodVpYY2dSSEp2Y0dSdmQyNG9ZMjl1Wm1sbktTbGNiaUFnSUNCOUtWeHVJQ0I5WEc1Y2JpQWdhV1lnS0dSeWIzQmtiM2R1Y3lrZ2UxeHVJQ0FnSUdSdlkzVnRaVzUwTG1Ga1pFVjJaVzUwVEdsemRHVnVaWElvSjJOc2FXTnJKeXdnS0dWMlpXNTBLU0E5UGlCN1hHNGdJQ0FnSUNCamIyNXpkQ0JrY205d1pHOTNiazFsYm5VZ1BTQm1hVzVrVkdGeVoyVjBRbmxEYkdGemN5aGxkbVZ1ZEM1MFlYSm5aWFFzSUNka2NtOXdaRzkzYmkxdFpXNTFKeWxjYmlBZ0lDQWdJR2xtSUNoa2NtOXdaRzkzYmsxbGJuVXBJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR052Ym5OMElHUnliM0JrYjNkdUlEMGdabWx1WkZSaGNtZGxkRUo1UTJ4aGMzTW9aWFpsYm5RdWRHRnlaMlYwTENBblpISnZjR1J2ZDI0bktWeHVYRzRnSUNBZ0lDQnBaaUFvWkhKdmNHUnZkMjRwSUh0Y2JpQWdJQ0FnSUNBZ1kyOXVjM1FnWkdGMFlWUnZaMmRzWlVGMGRISWdQU0JrY205d1pHOTNiaTVuWlhSQmRIUnlhV0oxZEdVb0oyUmhkR0V0ZEc5bloyeGxKeWxjYmlBZ0lDQWdJQ0FnYVdZZ0tHUmhkR0ZVYjJkbmJHVkJkSFJ5SUNZbUlHUmhkR0ZVYjJkbmJHVkJkSFJ5SUQwOVBTQk9RVTFGSUNZbUlHUnliM0JrYjNkdUtTQjdYRzRnSUNBZ0lDQWdJQ0FnWTI5dWMzUWdZMjl0Y0c5dVpXNTBJRDBnWTI5dGNHOXVaVzUwY3k1bWFXNWtLR01nUFQ0Z1l5NW5aWFJGYkdWdFpXNTBLQ2tnUFQwOUlHUnliM0JrYjNkdUtWeHVYRzRnSUNBZ0lDQWdJQ0FnYVdZZ0tDRmpiMjF3YjI1bGJuUXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5Ymx4dUlDQWdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0FnSUdOdmJYQnZibVZ1ZEM1MGIyZG5iR1VvS1Z4dUlDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNCOVhHNGdJQ0FnZlNsY2JpQWdmVnh1WEc0Z0lISmxkSFZ5YmlCRWNtOXdaRzkzYmx4dWZTa29LVnh1WEc1bGVIQnZjblFnWkdWbVlYVnNkQ0JFY205d1pHOTNibHh1SWl3aUx5b3FYRzRnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ29nVEdsalpXNXpaV1FnZFc1a1pYSWdUVWxVSUNob2RIUndjem92TDJkcGRHaDFZaTVqYjIwdmNYVmhjbXN0WkdWMkwxQm9iMjV2YmkxR2NtRnRaWGR2Y21zdllteHZZaTl0WVhOMFpYSXZURWxEUlU1VFJTbGNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaTljYm1sdGNHOXlkQ0JEYjIxd2IyNWxiblFnWm5KdmJTQW5MaTR2WTI5dGNHOXVaVzUwSjF4dVhHNWpiMjV6ZENCTWIyRmtaWElnUFNBb0tDa2dQVDRnZTF4dUlDQXZLaXBjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUlFTnZibk4wWVc1MGMxeHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ292WEc1Y2JpQWdZMjl1YzNRZ1RrRk5SU0E5SUNkc2IyRmtaWEluWEc0Z0lHTnZibk4wSUZaRlVsTkpUMDRnUFNBbk1pNHdMakFuWEc0Z0lHTnZibk4wSUVSRlJrRlZURlJmVUZKUFVFVlNWRWxGVXlBOUlIdGNiaUFnSUNCbGJHVnRaVzUwT2lCdWRXeHNMRnh1SUNBZ0lHTnZiRzl5T2lCdWRXeHNMRnh1SUNBZ0lITnBlbVU2SUc1MWJHd3NYRzRnSUgxY2JpQWdZMjl1YzNRZ1JFRlVRVjlCVkZSU1UxOVFVazlRUlZKVVNVVlRJRDBnVzExY2JseHVJQ0F2S2lwY2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFJRU5zWVhOeklFUmxabWx1YVhScGIyNWNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxTDF4dVhHNGdJR05zWVhOeklFeHZZV1JsY2lCbGVIUmxibVJ6SUVOdmJYQnZibVZ1ZENCN1hHNWNiaUFnSUNCamIyNXpkSEoxWTNSdmNpaHZjSFJwYjI1eklEMGdlMzBwSUh0Y2JpQWdJQ0FnSUhOMWNHVnlLRTVCVFVVc0lGWkZVbE5KVDA0c0lFUkZSa0ZWVEZSZlVGSlBVRVZTVkVsRlV5d2diM0IwYVc5dWN5d2dSRUZVUVY5QlZGUlNVMTlRVWs5UVJWSlVTVVZUTENCbVlXeHpaU3dnWm1Gc2MyVXBYRzVjYmlBZ0lDQWdJQzh2SUhObGRDQmpiMnh2Y2x4dUlDQWdJQ0FnWTI5dWMzUWdiRzloWkdWeVUzQnBibTVsY2lBOUlIUm9hWE11WjJWMFUzQnBibTVsY2lncFhHNGdJQ0FnSUNCcFppQW9kSGx3Wlc5bUlIUm9hWE11YjNCMGFXOXVjeTVqYjJ4dmNpQTlQVDBnSjNOMGNtbHVaeWRjYmlBZ0lDQWdJQ0FnSmlZZ0lXeHZZV1JsY2xOd2FXNXVaWEl1WTJ4aGMzTk1hWE4wTG1OdmJuUmhhVzV6S0dCamIyeHZjaTBrZTNSb2FYTXViM0IwYVc5dWN5NWpiMnh2Y24xZ0tTa2dlMXh1SUNBZ0lDQWdJQ0JzYjJGa1pYSlRjR2x1Ym1WeUxtTnNZWE56VEdsemRDNWhaR1FvWUdOdmJHOXlMU1I3ZEdocGN5NXZjSFJwYjI1ekxtTnZiRzl5ZldBcFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lIUm9hWE11WTNWemRHOXRVMmw2WlNBOUlIUm9hWE11YjNCMGFXOXVjeTV6YVhwbElDRTlQU0J1ZFd4c1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnWjJWMFEyeHBaVzUwVTJsNlpTZ3BJSHRjYmlBZ0lDQWdJR2xtSUNnaGRHaHBjeTVqZFhOMGIyMVRhWHBsS1NCN1hHNGdJQ0FnSUNBZ0lHTnZibk4wSUhOcGVtVWdQU0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1blpYUkNiM1Z1WkdsdVowTnNhV1Z1ZEZKbFkzUW9LU0FnSUNBZ0lDQWdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQnphWHBsTG1obGFXZG9kRnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkR2hwY3k1dmNIUnBiMjV6TG5OcGVtVmNiaUFnSUNCOVhHNWNiaUFnSUNCblpYUlRjR2x1Ym1WeUtDa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNJb0p5NXNiMkZrWlhJdGMzQnBibTVsY2ljcFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYzJodmR5Z3BJSHRjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNWpiR0Z6YzB4cGMzUXVZMjl1ZEdGcGJuTW9KMmhwWkdVbktTa2dlMXh1SUNBZ0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1amJHRnpjMHhwYzNRdWNtVnRiM1psS0Nkb2FXUmxKeWxjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnWTI5dWMzUWdjMmw2WlNBOUlIUm9hWE11WjJWMFEyeHBaVzUwVTJsNlpTZ3BYRzRnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11YzJsNlpTQTlJSE5wZW1WY2JseHVJQ0FnSUNBZ2FXWWdLSFJvYVhNdVkzVnpkRzl0VTJsNlpTa2dlMXh1SUNBZ0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1emRIbHNaUzUzYVdSMGFDQTlJR0FrZTNSb2FYTXViM0IwYVc5dWN5NXphWHBsZlhCNFlGeHVJQ0FnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzV6ZEhsc1pTNW9aV2xuYUhRZ1BTQmdKSHQwYUdsekxtOXdkR2x2Ym5NdWMybDZaWDF3ZUdCY2JseHVJQ0FnSUNBZ0lDQmpiMjV6ZENCc2IyRmtaWEpUY0dsdWJtVnlJRDBnZEdocGN5NW5aWFJUY0dsdWJtVnlLQ2xjYmlBZ0lDQWdJQ0FnYkc5aFpHVnlVM0JwYm01bGNpNXpkSGxzWlM1M2FXUjBhQ0E5SUdBa2UzUm9hWE11YjNCMGFXOXVjeTV6YVhwbGZYQjRZRnh1SUNBZ0lDQWdJQ0JzYjJGa1pYSlRjR2x1Ym1WeUxuTjBlV3hsTG1obGFXZG9kQ0E5SUdBa2UzUm9hWE11YjNCMGFXOXVjeTV6YVhwbGZYQjRZRnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkSEoxWlZ4dUlDQWdJSDFjYmx4dUlDQWdJR0Z1YVcxaGRHVW9jM1JoY25SQmJtbHRZWFJwYjI0Z1BTQjBjblZsS1NCN1hHNGdJQ0FnSUNCcFppQW9jM1JoY25SQmJtbHRZWFJwYjI0cElIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1emFHOTNLQ2xjYmlBZ0lDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQWdJSFJvYVhNdWFHbGtaU2dwWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUdOdmJuTjBJR3h2WVdSbGNsTndhVzV1WlhJZ1BTQjBhR2x6TG1kbGRGTndhVzV1WlhJb0tWeHVYRzRnSUNBZ0lDQnBaaUFvYzNSaGNuUkJibWx0WVhScGIyNGdKaVpjYmlBZ0lDQWdJQ0FnSVd4dllXUmxjbE53YVc1dVpYSXVZMnhoYzNOTWFYTjBMbU52Ym5SaGFXNXpLQ2RzYjJGa1pYSXRjM0JwYm01bGNpMWhibWx0WVhSbFpDY3BLU0I3WEc0Z0lDQWdJQ0FnSUd4dllXUmxjbE53YVc1dVpYSXVZMnhoYzNOTWFYTjBMbUZrWkNnbmJHOWhaR1Z5TFhOd2FXNXVaWEl0WVc1cGJXRjBaV1FuS1Z4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnZEhKMVpWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQnBaaUFvSVhOMFlYSjBRVzVwYldGMGFXOXVJQ1ltWEc0Z0lDQWdJQ0FnSUd4dllXUmxjbE53YVc1dVpYSXVZMnhoYzNOTWFYTjBMbU52Ym5SaGFXNXpLQ2RzYjJGa1pYSXRjM0JwYm01bGNpMWhibWx0WVhSbFpDY3BLU0I3WEc0Z0lDQWdJQ0FnSUd4dllXUmxjbE53YVc1dVpYSXVZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25iRzloWkdWeUxYTndhVzV1WlhJdFlXNXBiV0YwWldRbktWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQnlaWFIxY200Z2RISjFaVnh1SUNBZ0lIMWNibHh1SUNBZ0lHaHBaR1VvS1NCN1hHNGdJQ0FnSUNCcFppQW9JWFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1Oc1lYTnpUR2x6ZEM1amIyNTBZV2x1Y3lnbmFHbGtaU2NwS1NCN1hHNGdJQ0FnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbU5zWVhOelRHbHpkQzVoWkdRb0oyaHBaR1VuS1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCeVpYUjFjbTRnZEhKMVpWeHVJQ0FnSUgxY2JseHVJQ0FnSUhOMFlYUnBZeUJmUkU5TlNXNTBaWEptWVdObEtHOXdkR2x2Ym5NcElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCemRYQmxjaTVmUkU5TlNXNTBaWEptWVdObEtFeHZZV1JsY2l3Z2IzQjBhVzl1Y3lsY2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNCeVpYUjFjbTRnVEc5aFpHVnlYRzU5S1NncFhHNWNibVY0Y0c5eWRDQmtaV1poZFd4MElFeHZZV1JsY2x4dUlpd2lMeW9xWEc0cUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRxSUV4cFkyVnVjMlZrSUhWdVpHVnlJRTFKVkNBb2FIUjBjSE02THk5bmFYUm9kV0l1WTI5dEwzRjFZWEpyTFdSbGRpOVFhRzl1YjI0dFJuSmhiV1YzYjNKckwySnNiMkl2YldGemRHVnlMMHhKUTBWT1UwVXBYRzRxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNHFMMXh1YVcxd2IzSjBJRVYyWlc1MElHWnliMjBnSnk0dUx5NHVMMk52Y21VdlpYWmxiblJ6SjF4dWFXMXdiM0owSUVOdmJYQnZibVZ1ZENCbWNtOXRJQ2N1TGk5amIyMXdiMjVsYm5RblhHNWNibU52Ym5OMElFNXZkR2xtYVdOaGRHbHZiaUE5SUNnb0tTQTlQaUI3WEc0Z0lDOHFLbHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnS2lCRGIyNXpkR0Z1ZEhOY2JpQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0tpOWNibHh1SUNCamIyNXpkQ0JPUVUxRklEMGdKMjV2ZEdsbWFXTmhkR2x2YmlkY2JpQWdZMjl1YzNRZ1ZrVlNVMGxQVGlBOUlDY3lMakF1TUNkY2JpQWdZMjl1YzNRZ1JFVkdRVlZNVkY5UVVrOVFSVkpVU1VWVElEMGdlMXh1SUNBZ0lHVnNaVzFsYm5RNklHNTFiR3dzWEc0Z0lDQWdiV1Z6YzJGblpUb2dKeWNzWEc0Z0lDQWdjMmh2ZDBKMWRIUnZiam9nZEhKMVpTeGNiaUFnSUNCMGFXMWxiM1YwT2lCdWRXeHNMRnh1SUNBZ0lHSmhZMnRuY205MWJtUTZJQ2R3Y21sdFlYSjVKeXhjYmlBZ2ZWeHVJQ0JqYjI1emRDQkVRVlJCWDBGVVZGSlRYMUJTVDFCRlVsUkpSVk1nUFNCYlhHNGdJQ0FnSjNScGJXVnZkWFFuTEZ4dUlDQmRYRzVjYmlBZ0x5b3FYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2lCRGJHRnpjeUJFWldacGJtbDBhVzl1WEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpOWNibHh1SUNCamJHRnpjeUJPYjNScFptbGpZWFJwYjI0Z1pYaDBaVzVrY3lCRGIyMXdiMjVsYm5RZ2UxeHVYRzRnSUNBZ1kyOXVjM1J5ZFdOMGIzSW9iM0IwYVc5dWN5QTlJSHQ5S1NCN1hHNGdJQ0FnSUNCemRYQmxjaWhPUVUxRkxDQldSVkpUU1U5T0xDQkVSVVpCVlV4VVgxQlNUMUJGVWxSSlJWTXNJRzl3ZEdsdmJuTXNJRVJCVkVGZlFWUlVVbE5mVUZKUFVFVlNWRWxGVXl3Z2RISjFaU3dnWm1Gc2MyVXBYRzVjYmlBZ0lDQWdJSFJvYVhNdWRHVnRjR3hoZEdVZ1BTQW5KeUFyWEc0Z0lDQWdJQ0FnSUNjOFpHbDJJR05zWVhOelBWd2libTkwYVdacFkyRjBhVzl1WENJK0p5QXJYRzRnSUNBZ0lDQWdJQ0FnSnp4a2FYWWdZMnhoYzNNOVhDSnViM1JwWm1sallYUnBiMjR0YVc1dVpYSmNJajRuSUN0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ2M4WkdsMklHTnNZWE56UFZ3aWJXVnpjMkZuWlZ3aVBqd3ZaR2wyUGljZ0sxeHVJQ0FnSUNBZ0lDQWdJQ0FnSnp4aWRYUjBiMjRnZEhsd1pUMWNJbUoxZEhSdmJsd2lJR05zWVhOelBWd2lZMnh2YzJWY0lpQmtZWFJoTFdScGMyMXBjM005WENKdWIzUnBabWxqWVhScGIyNWNJaUJoY21saExXeGhZbVZzUFZ3aVEyeHZjMlZjSWo0bklDdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0p6eHpjR0Z1SUdGeWFXRXRhR2xrWkdWdVBWd2lkSEoxWlZ3aVBpWjBhVzFsY3pzOEwzTndZVzQrSnlBclhHNGdJQ0FnSUNBZ0lDQWdJQ0FuUEM5aWRYUjBiMjQrSnlBclhHNGdJQ0FnSUNBZ0lDQWdKend2WkdsMlBpY2dLMXh1SUNBZ0lDQWdJQ0FuUEM5a2FYWStKMXh1WEc0Z0lDQWdJQ0JwWmlBb2RHaHBjeTVrZVc1aGJXbGpSV3hsYldWdWRDa2dlMXh1SUNBZ0lDQWdJQ0IwYUdsekxtSjFhV3hrS0NsY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2RHaHBjeTUwYVcxbGIzVjBRMkZzYkdKaFkyc2dQU0J1ZFd4c1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnWW5WcGJHUW9LU0I3WEc0Z0lDQWdJQ0JqYjI1emRDQmlkV2xzWkdWeUlEMGdaRzlqZFcxbGJuUXVZM0psWVhSbFJXeGxiV1Z1ZENnblpHbDJKeWxjYmx4dUlDQWdJQ0FnWW5WcGJHUmxjaTVwYm01bGNraFVUVXdnUFNCMGFHbHpMblJsYlhCc1lYUmxYRzVjYmlBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwSUQwZ1luVnBiR1JsY2k1bWFYSnpkRU5vYVd4a1hHNWNiaUFnSUNBZ0lDOHZJSFJsZUhRZ2JXVnpjMkZuWlZ4dUlDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZjaWduTG0xbGMzTmhaMlVuS1M1cGJtNWxja2hVVFV3Z1BTQjBhR2x6TG05d2RHbHZibk11YldWemMyRm5aVnh1WEc0Z0lDQWdJQ0JwWmlBb0lYUm9hWE11YjNCMGFXOXVjeTV6YUc5M1FuVjBkRzl1S1NCN1hHNGdJQ0FnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNJb0oySjFkSFJ2YmljcExuTjBlV3hsTG1ScGMzQnNZWGtnUFNBbmJtOXVaU2RjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnWkc5amRXMWxiblF1WW05a2VTNWhjSEJsYm1SRGFHbHNaQ2gwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZENsY2JseHVJQ0FnSUNBZ2RHaHBjeTV6WlhSQmRIUnlhV0oxZEdWektDbGNiaUFnSUNCOVhHNWNiaUFnSUNCemFHOTNLQ2tnZTF4dUlDQWdJQ0FnYVdZZ0tIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBJRDA5UFNCdWRXeHNLU0I3WEc0Z0lDQWdJQ0FnSUM4dklHSjFhV3hrSUdGdVpDQnBibk5sY25RZ1lTQnVaWGNnUkU5TklHVnNaVzFsYm5SY2JpQWdJQ0FnSUNBZ2RHaHBjeTVpZFdsc1pDZ3BYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNWpiR0Z6YzB4cGMzUXVZMjl1ZEdGcGJuTW9KM05vYjNjbktTa2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdabUZzYzJWY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0x5OGdjbVZ6WlhRZ1kyOXNiM0pjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbTl3ZEdsdmJuTXVZbUZqYTJkeWIzVnVaQ2tnZTF4dUlDQWdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNXlaVzF2ZG1WQmRIUnlhV0oxZEdVb0oyTnNZWE56SnlsY2JpQWdJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVjMlYwUVhSMGNtbGlkWFJsS0NkamJHRnpjeWNzSUNkdWIzUnBabWxqWVhScGIyNG5LVnh1WEc0Z0lDQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExtTnNZWE56VEdsemRDNWhaR1FvWUdKbkxTUjdkR2hwY3k1dmNIUnBiMjV6TG1KaFkydG5jbTkxYm1SOVlDbGNiaUFnSUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNpZ25ZblYwZEc5dUp5a3VZMnhoYzNOTWFYTjBMbUZrWkNoZ1luUnVMU1I3ZEdocGN5NXZjSFJwYjI1ekxtSmhZMnRuY205MWJtUjlZQ2xjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnYVdZZ0tIUm9hWE11YjNCMGFXOXVjeTV6YUc5M1FuVjBkRzl1S1NCN1hHNGdJQ0FnSUNBZ0lDOHZJR0YwZEdGamFDQjBhR1VnWW5WMGRHOXVJR2hoYm1Sc1pYSmNiaUFnSUNBZ0lDQWdZMjl1YzNRZ1luVjBkRzl1Uld4bGJXVnVkQ0E5SUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0lvSjJKMWRIUnZiaWNwWEc0Z0lDQWdJQ0FnSUhSb2FYTXVjbVZuYVhOMFpYSkZiR1Z0Wlc1MEtIc2dkR0Z5WjJWME9pQmlkWFIwYjI1RmJHVnRaVzUwTENCbGRtVnVkRG9nSjJOc2FXTnJKeUI5S1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCelpYUlVhVzFsYjNWMEtDZ3BJRDArSUh0Y2JpQWdJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVZMnhoYzNOTWFYTjBMbUZrWkNnbmMyaHZkeWNwWEc0Z0lDQWdJQ0FnSUhSb2FYTXVkSEpwWjJkbGNrVjJaVzUwS0VWMlpXNTBMbE5JVDFjcFhHNWNiaUFnSUNBZ0lDQWdZMjl1YzNRZ2IyNVRhRzkzYmlBOUlDZ3BJRDArSUh0Y2JpQWdJQ0FnSUNBZ0lDQjBhR2x6TG5SeWFXZG5aWEpGZG1WdWRDaEZkbVZ1ZEM1VFNFOVhUaWxjYmlBZ0lDQWdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNXlaVzF2ZG1WRmRtVnVkRXhwYzNSbGJtVnlLRVYyWlc1MExsUlNRVTVUU1ZSSlQwNWZSVTVFTENCdmJsTm9iM2R1S1Z4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1WVdSa1JYWmxiblJNYVhOMFpXNWxjaWhGZG1WdWRDNVVVa0ZPVTBsVVNVOU9YMFZPUkN3Z2IyNVRhRzkzYmlsY2JseHVJQ0FnSUNBZ2ZTd2dNU2xjYmx4dUlDQWdJQ0FnYVdZZ0tFNTFiV0psY2k1cGMwbHVkR1ZuWlhJb2RHaHBjeTV2Y0hScGIyNXpMblJwYldWdmRYUXBJQ1ltSUhSb2FYTXViM0IwYVc5dWN5NTBhVzFsYjNWMElENGdNQ2tnZTF4dUlDQWdJQ0FnSUNBdkx5QnBaaUIwYUdWeVpTQnBjeUJoSUhScGJXVnZkWFFzSUdGMWRHOGdhR2xrWlNCMGFHVWdibTkwYVdacFkyRjBhVzl1WEc0Z0lDQWdJQ0FnSUhSb2FYTXVkR2x0Wlc5MWRFTmhiR3hpWVdOcklEMGdjMlYwVkdsdFpXOTFkQ2dvS1NBOVBpQjdYRzRnSUNBZ0lDQWdJQ0FnZEdocGN5NW9hV1JsS0NsY2JpQWdJQ0FnSUNBZ2ZTd2dkR2hwY3k1dmNIUnBiMjV6TG5ScGJXVnZkWFFnS3lBeEtWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQnlaWFIxY200Z2RISjFaVnh1SUNBZ0lIMWNibHh1SUNBZ0lHaHBaR1VvS1NCN1hHNGdJQ0FnSUNBdktseHVJQ0FnSUNBZ0lDb2djSEpsZG1WdWRDQjBieUJqYkc5elpTQmhJRzV2ZEdsbWFXTmhkR2x2YmlCM2FYUm9JR0VnZEdsdFpXOTFkRnh1SUNBZ0lDQWdJQ29nYVdZZ2RHaGxJSFZ6WlhJZ2FHRnpJR0ZzY21WaFpIa2dZMnhwWTJ0bFpDQnZiaUIwYUdVZ1luVjBkRzl1WEc0Z0lDQWdJQ0FnS2k5Y2JpQWdJQ0FnSUdsbUlDaDBhR2x6TG5ScGJXVnZkWFJEWVd4c1ltRmpheWtnZTF4dUlDQWdJQ0FnSUNCamJHVmhjbFJwYldWdmRYUW9kR2hwY3k1MGFXMWxiM1YwUTJGc2JHSmhZMnNwWEc0Z0lDQWdJQ0FnSUhSb2FYTXVkR2x0Wlc5MWRFTmhiR3hpWVdOcklEMGdiblZzYkZ4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCcFppQW9JWFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1Oc1lYTnpUR2x6ZEM1amIyNTBZV2x1Y3lnbmMyaHZkeWNwS1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCbVlXeHpaVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0IwYUdsekxuUnlhV2RuWlhKRmRtVnVkQ2hGZG1WdWRDNUlTVVJGS1Z4dVhHNGdJQ0FnSUNCcFppQW9kR2hwY3k1dmNIUnBiMjV6TG5Ob2IzZENkWFIwYjI0cElIdGNiaUFnSUNBZ0lDQWdZMjl1YzNRZ1luVjBkRzl1Uld4bGJXVnVkQ0E5SUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0lvSjJKMWRIUnZiaWNwWEc0Z0lDQWdJQ0FnSUhSb2FYTXVkVzV5WldkcGMzUmxja1ZzWlcxbGJuUW9leUIwWVhKblpYUTZJR0oxZEhSdmJrVnNaVzFsYm5Rc0lHVjJaVzUwT2lBblkyeHBZMnNuSUgwcFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbU5zWVhOelRHbHpkQzV5WlcxdmRtVW9KM05vYjNjbktWeHVJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVZMnhoYzNOTWFYTjBMbUZrWkNnbmFHbGtaU2NwWEc1Y2JpQWdJQ0FnSUdOdmJuTjBJRzl1U0dsa1pHVnVJRDBnS0NrZ1BUNGdlMXh1SUNBZ0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1eVpXMXZkbVZGZG1WdWRFeHBjM1JsYm1WeUtFVjJaVzUwTGxSU1FVNVRTVlJKVDA1ZlJVNUVMQ0J2YmtocFpHUmxiaWxjYmlBZ0lDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdVkyeGhjM05NYVhOMExuSmxiVzkyWlNnbmFHbGtaU2NwWEc1Y2JpQWdJQ0FnSUNBZ2RHaHBjeTUwY21sbloyVnlSWFpsYm5Rb1JYWmxiblF1U0VsRVJFVk9LVnh1WEc0Z0lDQWdJQ0FnSUdsbUlDaDBhR2x6TG1SNWJtRnRhV05GYkdWdFpXNTBLU0I3WEc0Z0lDQWdJQ0FnSUNBZ1pHOWpkVzFsYm5RdVltOWtlUzV5WlcxdmRtVkRhR2xzWkNoMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDbGNiaUFnSUNBZ0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZENBOUlHNTFiR3hjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNWhaR1JGZG1WdWRFeHBjM1JsYm1WeUtFVjJaVzUwTGxSU1FVNVRTVlJKVDA1ZlJVNUVMQ0J2YmtocFpHUmxiaWxjYmx4dUlDQWdJQ0FnY21WMGRYSnVJSFJ5ZFdWY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J2YmtWc1pXMWxiblJGZG1WdWRDZ3BJSHRjYmlBZ0lDQWdJSFJvYVhNdWFHbGtaU2dwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdjM1JoZEdsaklGOUVUMDFKYm5SbGNtWmhZMlVvYjNCMGFXOXVjeWtnZTF4dUlDQWdJQ0FnY21WMGRYSnVJSE4xY0dWeUxsOUVUMDFKYm5SbGNtWmhZMlVvVG05MGFXWnBZMkYwYVc5dUxDQnZjSFJwYjI1ektWeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lISmxkSFZ5YmlCT2IzUnBabWxqWVhScGIyNWNibjBwS0NsY2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ1RtOTBhV1pwWTJGMGFXOXVYRzRpTENJdktpcGNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaUJNYVdObGJuTmxaQ0IxYm1SbGNpQk5TVlFnS0doMGRIQnpPaTh2WjJsMGFIVmlMbU52YlM5eGRXRnlheTFrWlhZdlVHaHZibTl1TFVaeVlXMWxkMjl5YXk5aWJHOWlMMjFoYzNSbGNpOU1TVU5GVGxORktWeHVJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQXFMMXh1YVcxd2IzSjBJRVYyWlc1MElHWnliMjBnSnk0dUx5NHVMMk52Y21VdlpYWmxiblJ6SjF4dWFXMXdiM0owSUVOdmJYQnZibVZ1ZENCbWNtOXRJQ2N1TGk5amIyMXdiMjVsYm5RblhHNXBiWEJ2Y25RZ2V5Qm5aWFJCZEhSeWFXSjFkR1Z6UTI5dVptbG5JSDBnWm5KdmJTQW5MaTR2WTI5dGNHOXVaVzUwVFdGdVlXZGxjaWRjYm1sdGNHOXlkQ0I3SUdacGJtUlVZWEpuWlhSQ2VVRjBkSElnZlNCbWNtOXRJQ2N1TGk4dUxpOWpiM0psTDNWMGFXeHpKMXh1WEc1amIyNXpkQ0JQWm1aRFlXNTJZWE1nUFNBb0tDa2dQVDRnZTF4dUlDQXZLaXBjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUlFTnZibk4wWVc1MGMxeHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ292WEc1Y2JpQWdZMjl1YzNRZ1RrRk5SU0E5SUNkdlptWXRZMkZ1ZG1GekoxeHVJQ0JqYjI1emRDQldSVkpUU1U5T0lEMGdKekl1TUM0d0oxeHVJQ0JqYjI1emRDQkNRVU5MUkZKUFVGOVRSVXhGUTFSUFVpQTlJQ2R2Wm1ZdFkyRnVkbUZ6TFdKaFkydGtjbTl3SjF4dUlDQmpiMjV6ZENCRVJVWkJWVXhVWDFCU1QxQkZVbFJKUlZNZ1BTQjdYRzRnSUNBZ1pXeGxiV1Z1ZERvZ2JuVnNiQ3hjYmlBZ0lDQmhjMmxrWlRvZ2UxeHVJQ0FnSUNBZ2JXUTZJR1poYkhObExGeHVJQ0FnSUNBZ2JHYzZJR1poYkhObExGeHVJQ0FnSUNBZ2VHdzZJR1poYkhObExGeHVJQ0FnSUgwc1hHNGdJSDFjYmlBZ1kyOXVjM1FnUkVGVVFWOUJWRlJTVTE5UVVrOVFSVkpVU1VWVElEMGdXMXh1SUNBZ0lDZGhjMmxrWlNjc1hHNGdJRjFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUlFTnNZWE56SUVSbFptbHVhWFJwYjI1Y2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFMMXh1WEc0Z0lHTnNZWE56SUU5bVprTmhiblpoY3lCbGVIUmxibVJ6SUVOdmJYQnZibVZ1ZENCN1hHNWNiaUFnSUNCamIyNXpkSEoxWTNSdmNpaHZjSFJwYjI1eklEMGdlMzBwSUh0Y2JpQWdJQ0FnSUhOMWNHVnlLRTVCVFVVc0lGWkZVbE5KVDA0c0lFUkZSa0ZWVEZSZlVGSlBVRVZTVkVsRlV5d2diM0IwYVc5dWN5d2dSRUZVUVY5QlZGUlNVMTlRVWs5UVJWSlVTVVZUTENCbVlXeHpaU3dnZEhKMVpTbGNibHh1SUNBZ0lDQWdkR2hwY3k1MWMyVkNZV05yWkhKdmNDQTlJSFJ5ZFdWY2JpQWdJQ0FnSUhSb2FYTXVZM1Z5Y21WdWRGZHBaSFJvSUQwZ2JuVnNiRnh1SUNBZ0lDQWdkR2hwY3k1aGJtbHRZWFJsSUQwZ2RISjFaVnh1WEc0Z0lDQWdJQ0JqYjI1emRDQnpiU0E5SUhzZ2JtRnRaVG9nSjNOdEp5d2diV1ZrYVdFNklIZHBibVJ2ZHk1dFlYUmphRTFsWkdsaEtDY29iV2x1TFhkcFpIUm9PaUF4Y0hncEp5a2dmVnh1SUNBZ0lDQWdZMjl1YzNRZ2JXUWdQU0I3SUc1aGJXVTZJQ2R0WkNjc0lHMWxaR2xoT2lCM2FXNWtiM2N1YldGMFkyaE5aV1JwWVNnbktHMXBiaTEzYVdSMGFEb2dOelk0Y0hncEp5a2dmVnh1SUNBZ0lDQWdZMjl1YzNRZ2JHY2dQU0I3SUc1aGJXVTZJQ2RzWnljc0lHMWxaR2xoT2lCM2FXNWtiM2N1YldGMFkyaE5aV1JwWVNnbktHMXBiaTEzYVdSMGFEb2dPVGt5Y0hncEp5a2dmVnh1SUNBZ0lDQWdZMjl1YzNRZ2VHd2dQU0I3SUc1aGJXVTZJQ2Q0YkNjc0lHMWxaR2xoT2lCM2FXNWtiM2N1YldGMFkyaE5aV1JwWVNnbktHMXBiaTEzYVdSMGFEb2dNVEl3TUhCNEtTY3BJSDFjYmx4dUlDQWdJQ0FnWTI5dWMzUWdjMmw2WlhNZ1BTQmJjMjBzSUcxa0xDQnNaeXdnZUd4ZExuSmxkbVZ5YzJVb0tWeHVYRzRnSUNBZ0lDQmpiMjV6ZENCamFHVmphMWRwWkhSb0lEMGdLQ2tnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQnBaaUFvSVNnbmJXRjBZMmhOWldScFlTY2dhVzRnZDJsdVpHOTNLU2tnZTF4dUlDQWdJQ0FnSUNBZ0lISmxkSFZ5Ymx4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdjMmw2WlhNdVpYWmxjbmtvS0hOcGVtVXBJRDArSUh0Y2JpQWdJQ0FnSUNBZ0lDQmpiMjV6ZENCdFlYUmphQ0E5SUhOcGVtVXViV1ZrYVdFdWJXVmthV0V1YldGMFkyZ29MMXRoTFhwZFB5MTNhV1IwYURwY1hITS9LRnN3TFRsZEt5a3ZLVnh1WEc0Z0lDQWdJQ0FnSUNBZ2FXWWdLRzFoZEdOb0tTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCcFppQW9jMmw2WlM1dFpXUnBZUzV0WVhSamFHVnpLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJR2xtSUNoMGFHbHpMbU4xY25KbGJuUlhhV1IwYUNBaFBUMGdjMmw2WlM1dVlXMWxLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZEdocGN5NXpaWFJCYzJsa1pTaHphWHBsTG01aGJXVXBYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ2RHaHBjeTVqZFhKeVpXNTBWMmxrZEdnZ1BTQnphWHBsTG01aGJXVmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUdaaGJITmxYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUhSeWRXVmNiaUFnSUNBZ0lDQWdmU2xjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnWTJobFkydFhhV1IwYUNncFhHNWNiaUFnSUNBZ0lIZHBibVJ2ZHk1aFpHUkZkbVZ1ZEV4cGMzUmxibVZ5S0NkeVpYTnBlbVVuTENCamFHVmphMWRwWkhSb0xDQm1ZV3h6WlNrZ0lDQWdJQ0JjYmlBZ0lDQjlYRzVjYmlBZ0lDQndjbVYyWlc1MFEyeHZjMkZpYkdVb0tTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z2MzVndaWEl1Y0hKbGRtVnVkRU5zYjNOaFlteGxLQ2tnZkh3Z2RHaHBjeTV2Y0hScGIyNXpMbUZ6YVdSbFczUm9hWE11WTNWeWNtVnVkRmRwWkhSb1hTQTlQVDBnZEhKMVpWeHVJQ0FnSUgxY2JseHVJQ0FnSUhObGRFRnphV1JsS0c1aGJXVXBJSHRjYmlBZ0lDQWdJR052Ym5OMElHTnZiblJsYm5RZ1BTQmtiMk4xYldWdWRDNWliMlI1WEc1Y2JpQWdJQ0FnSUdsbUlDaDBhR2x6TG05d2RHbHZibk11WVhOcFpHVmJibUZ0WlYwZ1BUMDlJSFJ5ZFdVcElIdGNiaUFnSUNBZ0lDQWdhV1lnS0NGamIyNTBaVzUwTG1Oc1lYTnpUR2x6ZEM1amIyNTBZV2x1Y3lnbmIyWm1MV05oYm5aaGN5MWhjMmxrWlNjcEtTQjdYRzRnSUNBZ0lDQWdJQ0FnWTI5dWRHVnVkQzVqYkdGemMweHBjM1F1WVdSa0tDZHZabVl0WTJGdWRtRnpMV0Z6YVdSbEp5bGNiaUFnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUhSb2FYTXVkWE5sUW1GamEyUnliM0FnUFNCbVlXeHpaVnh1WEc0Z0lDQWdJQ0FnSUM4dklHRjJiMmxrSUdGdWFXMWhkR2x2YmlCaWVTQnpaWFIwYVc1bklHRnVhVzFoZEdVZ2RHOGdabUZzYzJWY2JpQWdJQ0FnSUNBZ2RHaHBjeTVoYm1sdFlYUmxJRDBnWm1Gc2MyVmNiaUFnSUNBZ0lDQWdkR2hwY3k1emFHOTNLQ2xjYmlBZ0lDQWdJQ0FnTHk4Z2NtVnRiM1psSUhCeVpYWnBiM1Z6SUdKaFkydGtjbTl3WEc0Z0lDQWdJQ0FnSUhSb2FYTXVjbVZ0YjNabFFtRmphMlJ5YjNBb0tWeHVJQ0FnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUNBZ2FXWWdLR052Ym5SbGJuUXVZMnhoYzNOTWFYTjBMbU52Ym5SaGFXNXpLQ2R2Wm1ZdFkyRnVkbUZ6TFdGemFXUmxKeWtwSUh0Y2JpQWdJQ0FnSUNBZ0lDQmpiMjUwWlc1MExtTnNZWE56VEdsemRDNXlaVzF2ZG1Vb0oyOW1aaTFqWVc1MllYTXRZWE5wWkdVbktWeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnZEdocGN5NW9hV1JsS0NsY2JpQWdJQ0FnSUNBZ2RHaHBjeTUxYzJWQ1lXTnJaSEp2Y0NBOUlIUnlkV1ZjYmlBZ0lDQWdJQ0FnZEdocGN5NWhibWx0WVhSbElEMGdkSEoxWlZ4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmx4dUlDQWdJRzl1Uld4bGJXVnVkRVYyWlc1MEtHVjJaVzUwS1NCN1hHNGdJQ0FnSUNCcFppQW9aWFpsYm5RdWRIbHdaU0E5UFQwZ0oydGxlWFZ3SnlBbUppQmxkbVZ1ZEM1clpYbERiMlJsSUNFOVBTQXlOeUFtSmlCbGRtVnVkQzVyWlhsRGIyUmxJQ0U5UFNBeE15a2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNWNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdMeThnYUdsa1pTQjBhR1VnYjJabUxXTmhiblpoYzF4dUlDQWdJQ0FnZEdocGN5NW9hV1JsS0NsY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J6YUc5M0tDa2dlMXh1SUNBZ0lDQWdhV1lnS0hSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExtTnNZWE56VEdsemRDNWpiMjUwWVdsdWN5Z25jMmh2ZHljcEtTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQm1ZV3h6WlZ4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBdkx5QmhaR1FnWVNCMGFXMWxiM1YwSUhOdklIUm9ZWFFnZEdobElFTlRVeUJoYm1sdFlYUnBiMjRnZDI5eWEzTmNiaUFnSUNBZ0lITmxkRlJwYldWdmRYUW9LQ2tnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TG5SeWFXZG5aWEpGZG1WdWRDaEZkbVZ1ZEM1VFNFOVhLVnh1WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJRzl1VTJodmQyNGdQU0FvS1NBOVBpQjdYRzRnSUNBZ0lDQWdJQ0FnZEdocGN5NTBjbWxuWjJWeVJYWmxiblFvUlhabGJuUXVVMGhQVjA0cFhHNWNiaUFnSUNBZ0lDQWdJQ0JwWmlBb2RHaHBjeTVoYm1sdFlYUmxLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzV5WlcxdmRtVkZkbVZ1ZEV4cGMzUmxibVZ5S0VWMlpXNTBMbFJTUVU1VFNWUkpUMDVmUlU1RUxDQnZibE5vYjNkdUtWeHVJQ0FnSUNBZ0lDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdVkyeGhjM05NYVhOMExuSmxiVzkyWlNnbllXNXBiV0YwWlNjcFhHNGdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ2FXWWdLSFJvYVhNdWRYTmxRbUZqYTJSeWIzQXBJSHRjYmlBZ0lDQWdJQ0FnSUNCMGFHbHpMbU55WldGMFpVSmhZMnRrY205d0tDbGNiaUFnSUNBZ0lDQWdmVnh1WEc1Y2JpQWdJQ0FnSUNBZ2FXWWdLSFJvYVhNdVlXNXBiV0YwWlNrZ2UxeHVJQ0FnSUNBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1Ga1pFVjJaVzUwVEdsemRHVnVaWElvUlhabGJuUXVWRkpCVGxOSlZFbFBUbDlGVGtRc0lHOXVVMmh2ZDI0cElDQWdJQ0FnSUNCY2JpQWdJQ0FnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVqYkdGemMweHBjM1F1WVdSa0tDZGhibWx0WVhSbEp5bGNiaUFnSUNBZ0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDQWdJQ0F2THlCa2FYSmxZM1JzZVNCMGNtbG5aMlZ5SUhSb1pTQnZibE5vYjNkdVhHNGdJQ0FnSUNBZ0lDQWdiMjVUYUc5M2JpZ3BYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNWpiR0Z6YzB4cGMzUXVZV1JrS0NkemFHOTNKeWtnSUNBZ0lDQWdJRnh1WEc0Z0lDQWdJQ0FnSUM4dklHRjBkR0ZqYUNCbGRtVnVkRnh1SUNBZ0lDQWdJQ0IwYUdsekxtRjBkR0ZqYUVWMlpXNTBjeWdwWEc0Z0lDQWdJQ0I5TENBeEtWeHVYRzRnSUNBZ0lDQnlaWFIxY200Z2RISjFaVnh1SUNBZ0lIMWNibHh1SUNBZ0lHaHBaR1VvS1NCN1hHNGdJQ0FnSUNCcFppQW9JWFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1Oc1lYTnpUR2x6ZEM1amIyNTBZV2x1Y3lnbmMyaHZkeWNwS1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCbVlXeHpaVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0IwYUdsekxuUnlhV2RuWlhKRmRtVnVkQ2hGZG1WdWRDNUlTVVJGS1Z4dVhHNGdJQ0FnSUNCMGFHbHpMbVJsZEdGamFFVjJaVzUwY3lncFhHNWNiaUFnSUNBZ0lHbG1JQ2gwYUdsekxtRnVhVzFoZEdVcElIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1WTJ4aGMzTk1hWE4wTG1Ga1pDZ25ZVzVwYldGMFpTY3BYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvSjNOb2IzY25LVnh1WEc0Z0lDQWdJQ0JwWmlBb2RHaHBjeTUxYzJWQ1lXTnJaSEp2Y0NrZ2UxeHVJQ0FnSUNBZ0lDQmpiMjV6ZENCaVlXTnJaSEp2Y0NBOUlIUm9hWE11WjJWMFFtRmphMlJ5YjNBb0tWeHVYRzRnSUNBZ0lDQWdJR052Ym5OMElHOXVTR2xrWkdWdUlEMGdLQ2tnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQWdJR2xtSUNoMGFHbHpMbUZ1YVcxaGRHVXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbU5zWVhOelRHbHpkQzV5WlcxdmRtVW9KMkZ1YVcxaGRHVW5LVnh1SUNBZ0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQWdJR0poWTJ0a2NtOXdMbkpsYlc5MlpVVjJaVzUwVEdsemRHVnVaWElvUlhabGJuUXVWRkpCVGxOSlZFbFBUbDlGVGtRc0lHOXVTR2xrWkdWdUtWeHVJQ0FnSUNBZ0lDQWdJSFJvYVhNdWRISnBaMmRsY2tWMlpXNTBLRVYyWlc1MExraEpSRVJGVGlrZ0lDQWdJQ0FnSUZ4dUlDQWdJQ0FnSUNBZ0lIUm9hWE11Y21WdGIzWmxRbUZqYTJSeWIzQW9LVnh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ1ltRmphMlJ5YjNBdVlXUmtSWFpsYm5STWFYTjBaVzVsY2loRmRtVnVkQzVVVWtGT1UwbFVTVTlPWDBWT1JDd2diMjVJYVdSa1pXNHBYRzRnSUNBZ0lDQWdJR0poWTJ0a2NtOXdMbU5zWVhOelRHbHpkQzVoWkdRb0oyWmhaR1Z2ZFhRbktWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQnlaWFIxY200Z2RISjFaVnh1SUNBZ0lIMWNibHh1SUNBZ0lHTnlaV0YwWlVKaFkydGtjbTl3S0NrZ2UxeHVJQ0FnSUNBZ1kyOXVjM1FnWW1GamEyUnliM0FnUFNCa2IyTjFiV1Z1ZEM1amNtVmhkR1ZGYkdWdFpXNTBLQ2RrYVhZbktWeHVJQ0FnSUNBZ1ltRmphMlJ5YjNBdWMyVjBRWFIwY21saWRYUmxLQ2RrWVhSaExXbGtKeXdnZEdocGN5NXBaQ2xjYmlBZ0lDQWdJR0poWTJ0a2NtOXdMbU5zWVhOelRHbHpkQzVoWkdRb1FrRkRTMFJTVDFCZlUwVk1SVU5VVDFJcFhHNWNiaUFnSUNBZ0lHUnZZM1Z0Wlc1MExtSnZaSGt1WVhCd1pXNWtRMmhwYkdRb1ltRmphMlJ5YjNBcFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnWjJWMFFtRmphMlJ5YjNBb0tTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z1pHOWpkVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZjaWhnTGlSN1FrRkRTMFJTVDFCZlUwVk1SVU5VVDFKOVcyUmhkR0V0YVdROVhDSWtlM1JvYVhNdWFXUjlYQ0pkWUNsY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J5WlcxdmRtVkNZV05yWkhKdmNDZ3BJSHRjYmlBZ0lDQWdJR052Ym5OMElHSmhZMnRrY205d0lEMGdkR2hwY3k1blpYUkNZV05yWkhKdmNDZ3BYRzRnSUNBZ0lDQnBaaUFvWW1GamEyUnliM0FwSUh0Y2JpQWdJQ0FnSUNBZ1pHOWpkVzFsYm5RdVltOWtlUzV5WlcxdmRtVkRhR2xzWkNoaVlXTnJaSEp2Y0NsY2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc1Y2JpQWdJQ0JoZEhSaFkyaEZkbVZ1ZEhNb0tTQjdYRzRnSUNBZ0lDQmpiMjV6ZENCa2FYTnRhWE56UW5WMGRHOXVjeUE5SUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0pCYkd3b0oxdGtZWFJoTFdScGMyMXBjM05kSnlsY2JseHVJQ0FnSUNBZ2FXWWdLR1JwYzIxcGMzTkNkWFIwYjI1ektTQjdYRzRnSUNBZ0lDQWdJR1JwYzIxcGMzTkNkWFIwYjI1ekxtWnZja1ZoWTJnb1luVjBkRzl1SUQwK0lIUm9hWE11Y21WbmFYTjBaWEpGYkdWdFpXNTBLSHNnZEdGeVoyVjBPaUJpZFhSMGIyNHNJR1YyWlc1ME9pQW5ZMnhwWTJzbklIMHBLVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0JwWmlBb2RHaHBjeTUxYzJWQ1lXTnJaSEp2Y0NrZ2UxeHVJQ0FnSUNBZ0lDQmpiMjV6ZENCaVlXTnJaSEp2Y0NBOUlIUm9hWE11WjJWMFFtRmphMlJ5YjNBb0tTQWdJQ0FnSUZ4dUlDQWdJQ0FnSUNCMGFHbHpMbkpsWjJsemRHVnlSV3hsYldWdWRDaDdJSFJoY21kbGREb2dZbUZqYTJSeWIzQXNJR1YyWlc1ME9pQkZkbVZ1ZEM1VFZFRlNWQ0I5S1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCMGFHbHpMbkpsWjJsemRHVnlSV3hsYldWdWRDaDdJSFJoY21kbGREb2daRzlqZFcxbGJuUXNJR1YyWlc1ME9pQW5hMlY1ZFhBbklIMHBYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1pHVjBZV05vUlhabGJuUnpLQ2tnZTF4dUlDQWdJQ0FnWTI5dWMzUWdaR2x6YldsemMwSjFkSFJ2Ym5NZ1BTQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eVFXeHNLQ2RiWkdGMFlTMWthWE50YVhOelhTY3BYRzVjYmlBZ0lDQWdJR2xtSUNoa2FYTnRhWE56UW5WMGRHOXVjeWtnZTF4dUlDQWdJQ0FnSUNCa2FYTnRhWE56UW5WMGRHOXVjeTVtYjNKRllXTm9LR0oxZEhSdmJpQTlQaUIwYUdsekxuVnVjbVZuYVhOMFpYSkZiR1Z0Wlc1MEtIc2dkR0Z5WjJWME9pQmlkWFIwYjI0c0lHVjJaVzUwT2lBblkyeHBZMnNuSUgwcEtWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQnBaaUFvZEdocGN5NTFjMlZDWVdOclpISnZjQ2tnZTF4dUlDQWdJQ0FnSUNCamIyNXpkQ0JpWVdOclpISnZjQ0E5SUhSb2FYTXVaMlYwUW1GamEyUnliM0FvS1Z4dUlDQWdJQ0FnSUNCMGFHbHpMblZ1Y21WbmFYTjBaWEpGYkdWdFpXNTBLSHNnZEdGeVoyVjBPaUJpWVdOclpISnZjQ3dnWlhabGJuUTZJRVYyWlc1MExsTlVRVkpVSUgwcFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lIUm9hWE11ZFc1eVpXZHBjM1JsY2tWc1pXMWxiblFvZXlCMFlYSm5aWFE2SUdSdlkzVnRaVzUwTENCbGRtVnVkRG9nSjJ0bGVYVndKeUI5S1Z4dUlDQWdJSDFjYmx4dUlDQWdJSE4wWVhScFl5QmZSRTlOU1c1MFpYSm1ZV05sS0c5d2RHbHZibk1wSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJ6ZFhCbGNpNWZSRTlOU1c1MFpYSm1ZV05sS0U5bVprTmhiblpoY3l3Z2IzQjBhVzl1Y3lsY2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxSUVSUFRTQkJjR2tnYVcxd2JHVnRaVzUwWVhScGIyNWNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxTDF4dUlDQmpiMjV6ZENCamIyMXdiMjVsYm5SeklEMGdXMTFjYmx4dUlDQmpiMjV6ZENCdlptWkRZVzUyWVhNZ1BTQmtiMk4xYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5UVd4c0tHQXVKSHRPUVUxRmZXQXBYRzRnSUdsbUlDaHZabVpEWVc1MllYTXBJSHRjYmlBZ0lDQnZabVpEWVc1MllYTXVabTl5UldGamFDZ29aV3hsYldWdWRDa2dQVDRnZTF4dUlDQWdJQ0FnWTI5dWMzUWdZMjl1Wm1sbklEMGdaMlYwUVhSMGNtbGlkWFJsYzBOdmJtWnBaeWhsYkdWdFpXNTBMQ0JFUlVaQlZVeFVYMUJTVDFCRlVsUkpSVk1zSUVSQlZFRmZRVlJVVWxOZlVGSlBVRVZTVkVsRlV5bGNiaUFnSUNBZ0lHTnZibVpwWnk1bGJHVnRaVzUwSUQwZ1pXeGxiV1Z1ZEZ4dVhHNGdJQ0FnSUNCamIyMXdiMjVsYm5SekxuQjFjMmdvZXlCbGJHVnRaVzUwTENCdlptWkRZVzUyWVhNNklHNWxkeUJQWm1aRFlXNTJZWE1vWTI5dVptbG5LU0I5S1Z4dUlDQWdJSDBwWEc0Z0lIMWNibHh1SUNCcFppQW9iMlptUTJGdWRtRnpLU0I3WEc0Z0lDQWdaRzlqZFcxbGJuUXVZV1JrUlhabGJuUk1hWE4wWlc1bGNpZ25ZMnhwWTJzbkxDQW9aWFpsYm5RcElEMCtJSHRjYmlBZ0lDQWdJR052Ym5OMElIUmhjbWRsZENBOUlHWnBibVJVWVhKblpYUkNlVUYwZEhJb1pYWmxiblF1ZEdGeVoyVjBMQ0FuWkdGMFlTMTBiMmRuYkdVbktWeHVJQ0FnSUNBZ2FXWWdLQ0YwWVhKblpYUXBJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR052Ym5OMElHUmhkR0ZVYjJkbmJHVkJkSFJ5SUQwZ2RHRnlaMlYwTG1kbGRFRjBkSEpwWW5WMFpTZ25aR0YwWVMxMGIyZG5iR1VuS1Z4dUlDQWdJQ0FnYVdZZ0tHUmhkR0ZVYjJkbmJHVkJkSFJ5SUNZbUlHUmhkR0ZVYjJkbmJHVkJkSFJ5SUQwOVBTQk9RVTFGS1NCN1hHNGdJQ0FnSUNBZ0lHTnZibk4wSUdsa0lEMGdkR0Z5WjJWMExtZGxkRUYwZEhKcFluVjBaU2duWkdGMFlTMTBZWEpuWlhRbktWeHVJQ0FnSUNBZ0lDQmpiMjV6ZENCbGJHVnRaVzUwSUQwZ1pHOWpkVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZjaWhwWkNsY2JseHVJQ0FnSUNBZ0lDQmpiMjV6ZENCamIyMXdiMjVsYm5RZ1BTQmpiMjF3YjI1bGJuUnpMbVpwYm1Rb1l5QTlQaUJqTG1Wc1pXMWxiblFnUFQwOUlHVnNaVzFsYm5RcFhHNWNiaUFnSUNBZ0lDQWdhV1lnS0NGamIyMXdiMjVsYm5RcElIdGNiaUFnSUNBZ0lDQWdJQ0J5WlhSMWNtNWNiaUFnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUhSaGNtZGxkQzVpYkhWeUtDbGNibHh1SUNBZ0lDQWdJQ0JqYjIxd2IyNWxiblF1YjJabVEyRnVkbUZ6TG5Ob2IzY29LVnh1SUNBZ0lDQWdmVnh1SUNBZ0lIMHBYRzRnSUgxY2JseHVJQ0J5WlhSMWNtNGdUMlptUTJGdWRtRnpYRzU5S1NncFhHNWNibVY0Y0c5eWRDQmtaV1poZFd4MElFOW1aa05oYm5aaGMxeHVJaXdpTHlvcVhHNGdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDb2dUR2xqWlc1elpXUWdkVzVrWlhJZ1RVbFVJQ2hvZEhSd2N6b3ZMMmRwZEdoMVlpNWpiMjB2Y1hWaGNtc3RaR1YyTDFCb2IyNXZiaTFHY21GdFpYZHZjbXN2WW14dllpOXRZWE4wWlhJdlRFbERSVTVUUlNsY2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0tpOWNibWx0Y0c5eWRDQkRiMjF3YjI1bGJuUWdabkp2YlNBbkxpNHZZMjl0Y0c5dVpXNTBKMXh1YVcxd2IzSjBJRVYyWlc1MElHWnliMjBnSnk0dUx5NHVMMk52Y21VdlpYWmxiblJ6SjF4dVhHNWpiMjV6ZENCUWNtOW5jbVZ6Y3lBOUlDZ29LU0E5UGlCN1hHNGdJQzhxS2x4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb2dRMjl1YzNSaGJuUnpYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2k5Y2JseHVJQ0JqYjI1emRDQk9RVTFGSUQwZ0ozQnliMmR5WlhOekoxeHVJQ0JqYjI1emRDQldSVkpUU1U5T0lEMGdKekl1TUM0d0oxeHVJQ0JqYjI1emRDQkVSVVpCVlV4VVgxQlNUMUJGVWxSSlJWTWdQU0I3WEc0Z0lDQWdaV3hsYldWdWREb2diblZzYkN4Y2JpQWdJQ0JvWldsbmFIUTZJRFVzWEc0Z0lDQWdiV2x1T2lBd0xGeHVJQ0FnSUcxaGVEb2dNVEF3TEZ4dUlDQWdJR3hoWW1Wc09pQm1ZV3h6WlN4Y2JpQWdJQ0J6ZEhKcGNHVmtPaUJtWVd4elpTeGNiaUFnSUNCaVlXTnJaM0p2ZFc1a09pQnVkV3hzTEZ4dUlDQjlYRzRnSUdOdmJuTjBJRVJCVkVGZlFWUlVVbE5mVUZKUFVFVlNWRWxGVXlBOUlGdGNiaUFnSUNBbmFHVnBaMmgwSnl4Y2JpQWdJQ0FuYldsdUp5eGNiaUFnSUNBbmJXRjRKeXhjYmlBZ0lDQW5iR0ZpWld3bkxGeHVJQ0FnSUNkemRISnBjR1ZrSnl4Y2JpQWdJQ0FuWW1GamEyZHliM1Z1WkNjc1hHNGdJRjFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUlFTnNZWE56SUVSbFptbHVhWFJwYjI1Y2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFMMXh1WEc0Z0lHTnNZWE56SUZCeWIyZHlaWE56SUdWNGRHVnVaSE1nUTI5dGNHOXVaVzUwSUh0Y2JseHVJQ0FnSUdOdmJuTjBjblZqZEc5eUtHOXdkR2x2Ym5NZ1BTQjdmU2tnZTF4dUlDQWdJQ0FnYzNWd1pYSW9Ua0ZOUlN3Z1ZrVlNVMGxQVGl3Z1JFVkdRVlZNVkY5UVVrOVFSVkpVU1VWVExDQnZjSFJwYjI1ekxDQkVRVlJCWDBGVVZGSlRYMUJTVDFCRlVsUkpSVk1zSUdaaGJITmxMQ0JtWVd4elpTbGNibHh1SUNBZ0lDQWdMeThnYzJWMElIUm9aU0IzWVc1MFpXUWdhR1ZwWjJoMFhHNGdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNXpkSGxzWlM1b1pXbG5hSFFnUFNCZ0pIdDBhR2x6TG05d2RHbHZibk11YUdWcFoyaDBmWEI0WUZ4dVhHNGdJQ0FnSUNBdkx5QnpaWFFnYldsdUlHRnVaQ0J0WVhnZ2RtRnNkV1Z6WEc0Z0lDQWdJQ0JqYjI1emRDQndjbTluY21WemMwSmhjaUE5SUhSb2FYTXVaMlYwVUhKdlozSmxjM05DWVhJb0tWeHVJQ0FnSUNBZ2NISnZaM0psYzNOQ1lYSXVjMlYwUVhSMGNtbGlkWFJsS0NkaGNtbGhMWFpoYkhWbGJXbHVKeXdnWUNSN2RHaHBjeTV2Y0hScGIyNXpMbTFwYm4xZ0tWeHVJQ0FnSUNBZ2NISnZaM0psYzNOQ1lYSXVjMlYwUVhSMGNtbGlkWFJsS0NkaGNtbGhMWFpoYkhWbGJXRjRKeXdnWUNSN2RHaHBjeTV2Y0hScGIyNXpMbTFoZUgxZ0tWeHVYRzRnSUNBZ0lDQXZMeUJ6WlhRZ2MzUnlhWEJsWkZ4dUlDQWdJQ0FnYVdZZ0tIUm9hWE11YjNCMGFXOXVjeTV6ZEhKcGNHVmtYRzRnSUNBZ0lDQWdJQ1ltSUNGd2NtOW5jbVZ6YzBKaGNpNWpiR0Z6YzB4cGMzUXVZMjl1ZEdGcGJuTW9KM0J5YjJkeVpYTnpMV0poY2kxemRISnBjR1ZrSnlrcElIdGNiaUFnSUNBZ0lDQWdjSEp2WjNKbGMzTkNZWEl1WTJ4aGMzTk1hWE4wTG1Ga1pDZ25jSEp2WjNKbGMzTXRZbUZ5TFhOMGNtbHdaV1FuS1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBdkx5QnpaWFFnWW1GamEyZHliM1Z1WkZ4dUlDQWdJQ0FnYVdZZ0tIUjVjR1Z2WmlCMGFHbHpMbTl3ZEdsdmJuTXVZbUZqYTJkeWIzVnVaQ0E5UFQwZ0ozTjBjbWx1WnlkY2JpQWdJQ0FnSUNBZ0ppWWdJWEJ5YjJkeVpYTnpRbUZ5TG1Oc1lYTnpUR2x6ZEM1amIyNTBZV2x1Y3loZ1ltY3RKSHQwYUdsekxtOXdkR2x2Ym5NdVltRmphMmR5YjNWdVpIMWdLU2tnZTF4dUlDQWdJQ0FnSUNCd2NtOW5jbVZ6YzBKaGNpNWpiR0Z6YzB4cGMzUXVZV1JrS0dCaVp5MGtlM1JvYVhNdWIzQjBhVzl1Y3k1aVlXTnJaM0p2ZFc1a2ZXQXBYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1oyVjBVSEp2WjNKbGMzTkNZWElvS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZjaWduTG5CeWIyZHlaWE56TFdKaGNpY3BYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MyVjBLSFpoYkhWbElEMGdNQ2tnZTF4dUlDQWdJQ0FnWTI5dWMzUWdjSEp2WjNKbGMzTkNZWElnUFNCMGFHbHpMbWRsZEZCeWIyZHlaWE56UW1GeUtDbGNiaUFnSUNBZ0lHTnZibk4wSUhCeWIyZHlaWE56SUQwZ1RXRjBhQzV5YjNWdVpDZ29kbUZzZFdVZ0x5QW9kR2hwY3k1dmNIUnBiMjV6TG0xcGJpQXJJSFJvYVhNdWIzQjBhVzl1Y3k1dFlYZ3BLU0FxSURFd01DbGNibHh1SUNBZ0lDQWdhV1lnS0haaGJIVmxJRHdnZEdocGN5NXZjSFJwYjI1ekxtMXBiaWtnZTF4dUlDQWdJQ0FnSUNCamIyNXpiMnhsTG1WeWNtOXlLR0FrZTA1QlRVVjlMaUJYWVhKdWFXNW5MQ0FrZTNaaGJIVmxmU0JwY3lCMWJtUmxjaUJ0YVc0Z2RtRnNkV1V1WUNsY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUdaaGJITmxYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR2xtSUNoMllXeDFaU0ErSUhSb2FYTXViM0IwYVc5dWN5NXRZWGdwSUh0Y2JpQWdJQ0FnSUNBZ1kyOXVjMjlzWlM1bGNuSnZjaWhnSkh0T1FVMUZmUzRnVjJGeWJtbHVaeXdnSkh0MllXeDFaWDBnYVhNZ1lXSnZkbVVnYldGNElIWmhiSFZsTG1BcElDQWdJQ0FnSUNBZ0lGeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z1ptRnNjMlZjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnY0hKdlozSmxjM05DWVhJdWMyVjBRWFIwY21saWRYUmxLQ2RoY21saExYWmhiSFZsYm05M0p5d2dZQ1I3ZG1Gc2RXVjlZQ2tnSUNBZ0lDQmNibHh1SUNBZ0lDQWdMeThnYzJWMElHeGhZbVZzWEc0Z0lDQWdJQ0JwWmlBb2RHaHBjeTV2Y0hScGIyNXpMbXhoWW1Wc0tTQjdYRzRnSUNBZ0lDQWdJSEJ5YjJkeVpYTnpRbUZ5TG1sdWJtVnlTRlJOVENBOUlHQWtlM0J5YjJkeVpYTnpmU1ZnWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUM4dklITmxkQ0J3WlhKalpXNTBZV2RsWEc0Z0lDQWdJQ0J3Y205bmNtVnpjMEpoY2k1emRIbHNaUzUzYVdSMGFDQTlJR0FrZTNCeWIyZHlaWE56ZlNWZ1hHNWNiaUFnSUNBZ0lISmxkSFZ5YmlCMGNuVmxYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1lXNXBiV0YwWlNoemRHRnlkRUZ1YVcxaGRHbHZiaUE5SUhSeWRXVXBJSHRjYmlBZ0lDQWdJR2xtSUNnaGRHaHBjeTV2Y0hScGIyNXpMbk4wY21sd1pXUXBJSHRjYmlBZ0lDQWdJQ0FnWTI5dWMyOXNaUzVsY25KdmNpaGdKSHRPUVUxRmZTNGdRVzVwYldGMGFXOXVJSGR2Y210eklHOXViSGtnZDJsMGFDQnpkSEpwY0dWa0lIQnliMmR5WlhOekxtQXBYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQm1ZV3h6WlZ4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCamIyNXpkQ0J3Y205bmNtVnpjMEpoY2lBOUlIUm9hWE11WjJWMFVISnZaM0psYzNOQ1lYSW9LVnh1WEc0Z0lDQWdJQ0JwWmlBb2MzUmhjblJCYm1sdFlYUnBiMjVjYmlBZ0lDQWdJQ0FnSmlZZ0lYQnliMmR5WlhOelFtRnlMbU5zWVhOelRHbHpkQzVqYjI1MFlXbHVjeWduY0hKdlozSmxjM010WW1GeUxXRnVhVzFoZEdWa0p5a3BJSHRjYmlBZ0lDQWdJQ0FnY0hKdlozSmxjM05DWVhJdVkyeGhjM05NYVhOMExtRmtaQ2duY0hKdlozSmxjM010WW1GeUxXRnVhVzFoZEdWa0p5bGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdhV1lnS0NGemRHRnlkRUZ1YVcxaGRHbHZibHh1SUNBZ0lDQWdJQ0FtSmlCd2NtOW5jbVZ6YzBKaGNpNWpiR0Z6YzB4cGMzUXVZMjl1ZEdGcGJuTW9KM0J5YjJkeVpYTnpMV0poY2kxaGJtbHRZWFJsWkNjcEtTQjdYRzRnSUNBZ0lDQWdJSEJ5YjJkeVpYTnpRbUZ5TG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvSjNCeWIyZHlaWE56TFdKaGNpMWhibWx0WVhSbFpDY3BYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSEpsZEhWeWJpQjBjblZsWEc0Z0lDQWdmVnh1WEc0Z0lDQWdjMmh2ZHlncElIdGNiaUFnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbk4wZVd4bExtaGxhV2RvZENBOUlHQWtlM1JvYVhNdWIzQjBhVzl1Y3k1b1pXbG5hSFI5Y0hoZ1hHNGdJQ0FnSUNCMGFHbHpMblJ5YVdkblpYSkZkbVZ1ZENoRmRtVnVkQzVUU0U5WEtWeHVJQ0FnSUNBZ2RHaHBjeTUwY21sbloyVnlSWFpsYm5Rb1JYWmxiblF1VTBoUFYwNHBYRzRnSUNBZ0lDQmNiaUFnSUNBZ0lISmxkSFZ5YmlCMGNuVmxYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2FHbGtaU2dwSUh0Y2JpQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExuTjBlV3hsTG1obGFXZG9kQ0E5SUNjd2NIZ25YRzRnSUNBZ0lDQjBhR2x6TG5SeWFXZG5aWEpGZG1WdWRDaEZkbVZ1ZEM1SVNVUkZLVnh1SUNBZ0lDQWdkR2hwY3k1MGNtbG5aMlZ5UlhabGJuUW9SWFpsYm5RdVNFbEVSRVZPS1Z4dUlDQWdJQ0FnWEc0Z0lDQWdJQ0J5WlhSMWNtNGdkSEoxWlZ4dUlDQWdJSDFjYmx4dUlDQWdJSE4wWVhScFl5QmZSRTlOU1c1MFpYSm1ZV05sS0c5d2RHbHZibk1wSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJ6ZFhCbGNpNWZSRTlOU1c1MFpYSm1ZV05sS0ZCeWIyZHlaWE56TENCdmNIUnBiMjV6S1Z4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUhKbGRIVnliaUJRY205bmNtVnpjMXh1ZlNrb0tWeHVYRzVsZUhCdmNuUWdaR1ZtWVhWc2RDQlFjbTluY21WemMxeHVJaXdpTHlvcVhHNGdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDb2dUR2xqWlc1elpXUWdkVzVrWlhJZ1RVbFVJQ2hvZEhSd2N6b3ZMMmRwZEdoMVlpNWpiMjB2Y1hWaGNtc3RaR1YyTDFCb2IyNXZiaTFHY21GdFpYZHZjbXN2WW14dllpOXRZWE4wWlhJdlRFbERSVTVUUlNsY2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0tpOWNibWx0Y0c5eWRDQkRiMjF3YjI1bGJuUWdabkp2YlNBbkxpNHZZMjl0Y0c5dVpXNTBKMXh1YVcxd2IzSjBJSHNnWjJWMFFYUjBjbWxpZFhSbGMwTnZibVpwWnlCOUlHWnliMjBnSnk0dUwyTnZiWEJ2Ym1WdWRFMWhibUZuWlhJblhHNXBiWEJ2Y25RZ1JYWmxiblFnWm5KdmJTQW5MaTR2TGk0dlkyOXlaUzlsZG1WdWRITW5YRzVwYlhCdmNuUWdleUJtYVc1a1ZHRnlaMlYwUW5sRGJHRnpjeUI5SUdaeWIyMGdKeTR1THk0dUwyTnZjbVV2ZFhScGJITW5YRzVjYm1OdmJuTjBJRlJoWWlBOUlDZ29LU0E5UGlCN1hHNGdJQzhxS2x4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb2dRMjl1YzNSaGJuUnpYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2k5Y2JseHVJQ0JqYjI1emRDQk9RVTFGSUQwZ0ozUmhZaWRjYmlBZ1kyOXVjM1FnVmtWU1UwbFBUaUE5SUNjeUxqQXVNQ2RjYmlBZ1kyOXVjM1FnUkVWR1FWVk1WRjlRVWs5UVJWSlVTVVZUSUQwZ2UxeHVYRzRnSUgxY2JpQWdZMjl1YzNRZ1JFRlVRVjlCVkZSU1UxOVFVazlRUlZKVVNVVlRJRDBnVzF4dUlDQmRYRzRnSUdOdmJuTjBJRlJCUWw5RFQwNVVSVTVVWDFORlRFVkRWRTlTSUQwZ0p5NTBZV0l0Y0dGdVpTZGNibHh1SUNBdktpcGNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxSUVOc1lYTnpJRVJsWm1sdWFYUnBiMjVjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUwxeHVYRzRnSUdOc1lYTnpJRlJoWWlCbGVIUmxibVJ6SUVOdmJYQnZibVZ1ZENCN1hHNWNiaUFnSUNCamIyNXpkSEoxWTNSdmNpaHZjSFJwYjI1eklEMGdlMzBwSUh0Y2JpQWdJQ0FnSUhOMWNHVnlLRTVCVFVVc0lGWkZVbE5KVDA0c0lFUkZSa0ZWVEZSZlVGSlBVRVZTVkVsRlV5d2diM0IwYVc5dWN5d2dSRUZVUVY5QlZGUlNVMTlRVWs5UVJWSlVTVVZUTENCbVlXeHpaU3dnWm1Gc2MyVXBYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MyaHZkeWdwSUh0Y2JpQWdJQ0FnSUdsbUlDaDBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVqYkdGemMweHBjM1F1WTI5dWRHRnBibk1vSjJGamRHbDJaU2NwS1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCbVlXeHpaVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0JqYjI1emRDQnBaQ0E5SUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExtZGxkRUYwZEhKcFluVjBaU2duYUhKbFppY3BYRzRnSUNBZ0lDQmpiMjV6ZENCdVlYWWdQU0JtYVc1a1ZHRnlaMlYwUW5sRGJHRnpjeWgwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEN3Z0oyNWhkaWNwWEc0Z0lDQWdJQ0JqYjI1emRDQnVZWFpVWVdKeklEMGdibUYySUQ4Z2JtRjJMbkYxWlhKNVUyVnNaV04wYjNKQmJHd29ZRnRrWVhSaExYUnZaMmRzWlQxY0lpUjdUa0ZOUlgxY0lsMWdLU0E2SUc1MWJHeGNibHh1SUNBZ0lDQWdhV1lnS0c1aGRsUmhZbk1wSUh0Y2JpQWdJQ0FnSUNBZ2JtRjJWR0ZpY3k1bWIzSkZZV05vS0NoMFlXSXBJRDArSUh0Y2JpQWdJQ0FnSUNBZ0lDQnBaaUFvZEdGaUxtTnNZWE56VEdsemRDNWpiMjUwWVdsdWN5Z25ZV04wYVhabEp5a3BJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIUmhZaTVqYkdGemMweHBjM1F1Y21WdGIzWmxLQ2RoWTNScGRtVW5LVnh1SUNBZ0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUNBZ0lDQjBZV0l1YzJWMFFYUjBjbWxpZFhSbEtDZGhjbWxoTFhObGJHVmpkR1ZrSnl3Z1ptRnNjMlVwWEc0Z0lDQWdJQ0FnSUgwcFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbU5zWVhOelRHbHpkQzVoWkdRb0oyRmpkR2wyWlNjcFhHNGdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNXpaWFJCZEhSeWFXSjFkR1VvSjJGeWFXRXRjMlZzWldOMFpXUW5MQ0IwY25WbEtWeHVYRzRnSUNBZ0lDQmpiMjV6ZENCMFlXSkRiMjUwWlc1MElEMGdaRzlqZFcxbGJuUXVjWFZsY25sVFpXeGxZM1J2Y2locFpDbGNiaUFnSUNBZ0lHTnZibk4wSUhSaFlrTnZiblJsYm5SeklEMGdkR0ZpUTI5dWRHVnVkQzV3WVhKbGJuUk9iMlJsTG5GMVpYSjVVMlZzWldOMGIzSkJiR3dvVkVGQ1gwTlBUbFJGVGxSZlUwVk1SVU5VVDFJcFhHNWNiaUFnSUNBZ0lHbG1JQ2gwWVdKRGIyNTBaVzUwY3lrZ2UxeHVJQ0FnSUNBZ0lDQjBZV0pEYjI1MFpXNTBjeTVtYjNKRllXTm9LQ2gwWVdJcElEMCtJSHRjYmlBZ0lDQWdJQ0FnSUNCcFppQW9kR0ZpTG1Oc1lYTnpUR2x6ZEM1amIyNTBZV2x1Y3lnbllXTjBhWFpsSnlrcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUhSaFlpNWpiR0Z6YzB4cGMzUXVjbVZ0YjNabEtDZGhZM1JwZG1VbktWeHVJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnZlNsY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2RHRmlRMjl1ZEdWdWRDNWpiR0Z6YzB4cGMzUXVZV1JrS0NkemFHOTNhVzVuSnlsY2JseHVJQ0FnSUNBZ2MyVjBWR2x0Wlc5MWRDZ29LU0E5UGlCN1hHNGdJQ0FnSUNBZ0lHTnZibk4wSUc5dVUyaHZkMlZrSUQwZ0tDa2dQVDRnZTF4dUlDQWdJQ0FnSUNBZ0lIUmhZa052Ym5SbGJuUXVZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25ZVzVwYldGMFpTY3BYRzRnSUNBZ0lDQWdJQ0FnZEdGaVEyOXVkR1Z1ZEM1amJHRnpjMHhwYzNRdVlXUmtLQ2RoWTNScGRtVW5LVnh1SUNBZ0lDQWdJQ0FnSUhSaFlrTnZiblJsYm5RdVkyeGhjM05NYVhOMExuSmxiVzkyWlNnbmMyaHZkMmx1WnljcFhHNGdJQ0FnSUNBZ0lDQWdkR0ZpUTI5dWRHVnVkQzV5WlcxdmRtVkZkbVZ1ZEV4cGMzUmxibVZ5S0VWMlpXNTBMbFJTUVU1VFNWUkpUMDVmUlU1RUxDQnZibE5vYjNkbFpDbGNiaUFnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUhSaFlrTnZiblJsYm5RdVlXUmtSWFpsYm5STWFYTjBaVzVsY2loRmRtVnVkQzVVVWtGT1UwbFVTVTlPWDBWT1JDd2diMjVUYUc5M1pXUXBYRzVjYmlBZ0lDQWdJQ0FnZEdGaVEyOXVkR1Z1ZEM1amJHRnpjMHhwYzNRdVlXUmtLQ2RoYm1sdFlYUmxKeWxjYmx4dUlDQWdJQ0FnZlN3Z01qQXBYRzVjYmlBZ0lDQWdJSEpsZEhWeWJpQjBjblZsWEc0Z0lDQWdmVnh1WEc0Z0lDQWdhR2xrWlNncElIdGNiaUFnSUNBZ0lHbG1JQ2doZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdVkyeGhjM05NYVhOMExtTnZiblJoYVc1ektDZGhZM1JwZG1VbktTa2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdabUZzYzJWY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2FXWWdLSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1Oc1lYTnpUR2x6ZEM1amIyNTBZV2x1Y3lnbllXTjBhWFpsSnlrcElIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1WTJ4aGMzTk1hWE4wTG5KbGJXOTJaU2duWVdOMGFYWmxKeWxjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdWMyVjBRWFIwY21saWRYUmxLQ2RoY21saExYTmxiR1ZqZEdWa0p5d2dabUZzYzJVcFhHNWNiaUFnSUNBZ0lHTnZibk4wSUdsa0lEMGdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1WjJWMFFYUjBjbWxpZFhSbEtDZG9jbVZtSnlsY2JpQWdJQ0FnSUdOdmJuTjBJSFJoWWtOdmJuUmxiblFnUFNCa2IyTjFiV1Z1ZEM1eGRXVnllVk5sYkdWamRHOXlLR2xrS1Z4dVhHNGdJQ0FnSUNCcFppQW9kR0ZpUTI5dWRHVnVkQzVqYkdGemMweHBjM1F1WTI5dWRHRnBibk1vSjJGamRHbDJaU2NwS1NCN1hHNGdJQ0FnSUNBZ0lIUmhZa052Ym5SbGJuUXVZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25ZV04wYVhabEp5bGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdjbVYwZFhKdUlIUnlkV1ZjYmlBZ0lDQjlYRzVjYmlBZ0lDQnpkR0YwYVdNZ1gwUlBUVWx1ZEdWeVptRmpaU2h2Y0hScGIyNXpLU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdjM1Z3WlhJdVgwUlBUVWx1ZEdWeVptRmpaU2hVWVdJc0lHOXdkR2x2Ym5NcFhHNGdJQ0FnZlZ4dUlDQjlYRzVjYmlBZ0x5b3FYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2lCRVQwMGdRWEJwSUdsdGNHeGxiV1Z1ZEdGMGFXOXVYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2k5Y2JpQWdZMjl1YzNRZ1kyOXRjRzl1Wlc1MGN5QTlJRnRkWEc1Y2JpQWdZMjl1YzNRZ2RHRmljeUE5SUdSdlkzVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSkJiR3dvWUZ0a1lYUmhMWFJ2WjJkc1pUMWNJaVI3VGtGTlJYMWNJbDFnS1Z4dUlDQnBaaUFvZEdGaWN5a2dlMXh1SUNBZ0lIUmhZbk11Wm05eVJXRmphQ2dvWld4bGJXVnVkQ2tnUFQ0Z2UxeHVJQ0FnSUNBZ0x5OGdZMjl1YzNRZ1kyOXVabWxuSUQwZ2UzMWNiaUFnSUNBZ0lHTnZibk4wSUdOdmJtWnBaeUE5SUdkbGRFRjBkSEpwWW5WMFpYTkRiMjVtYVdjb1pXeGxiV1Z1ZEN3Z1JFVkdRVlZNVkY5UVVrOVFSVkpVU1VWVExDQkVRVlJCWDBGVVZGSlRYMUJTVDFCRlVsUkpSVk1wWEc0Z0lDQWdJQ0JqYjI1bWFXY3VaV3hsYldWdWRDQTlJR1ZzWlcxbGJuUmNibHh1SUNBZ0lDQWdZMjl0Y0c5dVpXNTBjeTV3ZFhOb0tGUmhZaTVmUkU5TlNXNTBaWEptWVdObEtHTnZibVpwWnlrcFhHNGdJQ0FnZlNsY2JpQWdmVnh1WEc0Z0lHbG1JQ2gwWVdKektTQjdYRzRnSUNBZ1pHOWpkVzFsYm5RdVlXUmtSWFpsYm5STWFYTjBaVzVsY2lnblkyeHBZMnNuTENBb1pYWmxiblFwSUQwK0lIdGNiaUFnSUNBZ0lHTnZibk4wSUdSaGRHRlViMmRuYkdWQmRIUnlJRDBnWlhabGJuUXVkR0Z5WjJWMExtZGxkRUYwZEhKcFluVjBaU2duWkdGMFlTMTBiMmRuYkdVbktWeHVJQ0FnSUNBZ2FXWWdLR1JoZEdGVWIyZG5iR1ZCZEhSeUlDWW1JR1JoZEdGVWIyZG5iR1ZCZEhSeUlEMDlQU0JPUVUxRktTQjdYRzRnSUNBZ0lDQWdJR052Ym5OMElHbGtJRDBnWlhabGJuUXVkR0Z5WjJWMExtZGxkRUYwZEhKcFluVjBaU2duYUhKbFppY3BYRzVjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdZMjl0Y0c5dVpXNTBJRDBnWTI5dGNHOXVaVzUwY3k1bWFXNWtLR01nUFQ0Z1l5NW5aWFJGYkdWdFpXNTBLQ2t1WjJWMFFYUjBjbWxpZFhSbEtDZG9jbVZtSnlrZ1BUMDlJR2xrS1Z4dVhHNGdJQ0FnSUNBZ0lHbG1JQ2doWTI5dGNHOXVaVzUwS1NCN1hHNGdJQ0FnSUNBZ0lDQWdjbVYwZFhKdVhHNGdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0JqYjIxd2IyNWxiblF1YzJodmR5Z3BYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZTbGNiaUFnZlZ4dVhHNGdJSEpsZEhWeWJpQlVZV0pjYm4wcEtDbGNibHh1Wlhod2IzSjBJR1JsWm1GMWJIUWdWR0ZpWEc0aUxDSXZLaXBjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2lCTWFXTmxibk5sWkNCMWJtUmxjaUJOU1ZRZ0tHaDBkSEJ6T2k4dloybDBhSFZpTG1OdmJTOXhkV0Z5YXkxa1pYWXZVR2h2Ym05dUxVWnlZVzFsZDI5eWF5OWliRzlpTDIxaGMzUmxjaTlNU1VORlRsTkZLVnh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxTDF4dVhHNWpiMjV6ZENCQmFtRjRJRDBnS0NncElEMCtJSHRjYmlBZ0x5b3FYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2lCRGIyNXpkR0Z1ZEhOY2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFMMXh1WEc0Z0lHTnZibk4wSUU1QlRVVWdQU0FuWVdwaGVDZGNiaUFnWTI5dWMzUWdWa1ZTVTBsUFRpQTlJQ2N5TGpBdU1DZGNibHh1SUNBdktpcGNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxSUVOc1lYTnpJRVJsWm1sdWFYUnBiMjVjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUwxeHVYRzRnSUdOc1lYTnpJRUZxWVhnZ2UxeHVJQ0FnSUM4cUtseHVJQ0FnSUNBcUlFTnlaV0YwWlhNZ1lXNGdhVzV6ZEdGdVkyVWdiMllnUVdwaGVDNWNiaUFnSUNBZ0tpQkFjR0Z5WVcwZ2UzdHRaWFJvYjJRNklITjBjbWx1Wnl3Z2RYSnNPaUJ6ZEhKcGJtY3NJR052YlhCc1pYUmxPaUJHZFc1amRHbHZiaXdnYzNWalkyVnpjem9nUm5WdVkzUnBiMjRzSUdWeWNtOXlPaUJHZFc1amRHbHZiaXdnWkdGMFlUb2dZVzU1TENCamNtOXpjMFJ2YldGcGJqb2dZbTl2YkdWaGJpd2dhR1ZoWkdWeWN6b2dlMXRvWldGa1pYSTZJSE4wY21sdVoxMDZJSE4wY21sdVozMHNJSFJwYldWdmRYUTZJRzUxYldKbGNpd2dZMjl1ZEdWdWRGUjVjR1U2SUc1MWJXSmxjaXdnWkdGMFlWUjVjR1U2SUhOMGNtbHVaeUI5ZlNCdmNIUnpYRzRnSUNBZ0lDb3ZYRzRnSUNBZ1kyOXVjM1J5ZFdOMGIzSW9iM0IwY3lrZ2UxeHVJQ0FnSUNBZ2FXWWdLSFI1Y0dWdlppQnZjSFJ6SUNFOVBTQW5iMkpxWldOMEp5a2dlMXh1SUNBZ0lDQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9ZQ1I3VGtGTlJYMHRKSHRXUlZKVFNVOU9mV0FwWEc0Z0lDQWdJQ0I5WEc0Z0lDQWdJQ0IwYUdsekxtOXdkSE1nUFNCdmNIUnpYRzRnSUNBZ0lDQjBhR2x6TG1WeWNtOXlRMjlrWlNBOUlHNTFiR3hjYmlBZ0lDQjlYRzVjYmlBZ0lDQmpjbVZoZEdWWWFISW9LU0I3WEc0Z0lDQWdJQ0JqYjI1emRDQjRhSElnUFNCdVpYY2dXRTFNU0hSMGNGSmxjWFZsYzNRb0tWeHVJQ0FnSUNBZ2FXWWdLQ2QzYVhSb1EzSmxaR1Z1ZEdsaGJITW5JR2x1SUhob2NpQW1KaUIwYUdsekxtOXdkSE11WTNKdmMzTkViMjFoYVc0Z1BUMDlJSFJ5ZFdVcElIdGNiaUFnSUNBZ0lDQWdlR2h5TG5kcGRHaERjbVZrWlc1MGFXRnNjeUE5SUhSeWRXVmNiaUFnSUNBZ0lIMWNiaUFnSUNBZ0lISmxkSFZ5YmlCNGFISmNiaUFnSUNCOVhHNWNiaUFnSUNBdktpcGNiaUFnSUNBZ0tpQlRaWFFnYUdWaFpHVnljMXh1SUNBZ0lDQXFJRUJ3WVhKaGJTQjdlMXRvWldGa1pYSTZJSE4wY21sdVoxMDZJSE4wY21sdVozMTlJR2hsWVdSbGNuTmNiaUFnSUNBZ0tpOWNiaUFnSUNCelpYUklaV0ZrWlhKektHaGxZV1JsY25NZ1BTQjdmU2tnZTF4dUlDQWdJQ0FnWm05eUlDaGpiMjV6ZENCclpYa2dhVzRnYUdWaFpHVnljeWtnZTF4dUlDQWdJQ0FnSUNCMGFHbHpMbmhvY2k1elpYUlNaWEYxWlhOMFNHVmhaR1Z5S0d0bGVTd2dhR1ZoWkdWeWMxdHJaWGxkS1Z4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmx4dUlDQWdJRzl1VUhKbFJYaGxZM1YwWlNncElIdGNiaUFnSUNBZ0lHbG1JQ2gwZVhCbGIyWWdkR2hwY3k1dmNIUnpMbWhsWVdSbGNuTWdQVDA5SUNkdlltcGxZM1FuS1NCN1hHNGdJQ0FnSUNBZ0lIUm9hWE11YzJWMFNHVmhaR1Z5Y3loMGFHbHpMbTl3ZEhNdWFHVmhaR1Z5Y3lsY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2FXWWdLSFI1Y0dWdlppQjBhR2x6TG05d2RITXVkR2x0Wlc5MWRDQTlQVDBnSjI1MWJXSmxjaWNwSUh0Y2JpQWdJQ0FnSUNBZ2RHaHBjeTU0YUhJdWRHbHRaVzkxZENBOUlIUm9hWE11YjNCMGN5NTBhVzFsYjNWMFhHNGdJQ0FnSUNBZ0lIUm9hWE11ZUdoeUxtOXVkR2x0Wlc5MWRDQTlJQ2dwSUQwK0lIdGNiaUFnSUNBZ0lDQWdJQ0IwYUdsekxtVnljbTl5UTI5a1pTQTlJQ2RVU1UxRlQxVlVYMFZZUTBWRlJFVkVKMXh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUdsbUlDaDBlWEJsYjJZZ2RHaHBjeTV2Y0hSekxtTnZiblJsYm5SVWVYQmxJRDA5UFNBbmMzUnlhVzVuSnlrZ2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TG5ObGRFaGxZV1JsY25Nb2V5QW5RMjl1ZEdWdWRDMTBlWEJsSnpvZ2RHaHBjeTV2Y0hSekxtTnZiblJsYm5SVWVYQmxJSDBwWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUdsbUlDaDBhR2x6TG05d2RITXVaR0YwWVZSNWNHVWdQVDA5SUNkNGJXd25JQ1ltSUhSb2FYTXVlR2h5TG05MlpYSnlhV1JsVFdsdFpWUjVjR1VwSUh0Y2JpQWdJQ0FnSUNBZ2RHaHBjeTU0YUhJdWIzWmxjbkpwWkdWTmFXMWxWSGx3WlNnbllYQndiR2xqWVhScGIyNHZlRzFzT3lCamFHRnljMlYwUFhWMFppMDRKeWxjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzVjYmlBZ0lDQndZWEp6WlZKbGMzQnZibk5sS0NrZ2UxeHVJQ0FnSUNBZ2JHVjBJSEpsYzNCdmJuTmxJRDBnYm5Wc2JGeHVJQ0FnSUNBZ2FXWWdLSFJvYVhNdWIzQjBjeTVrWVhSaFZIbHdaU0E5UFQwZ0oycHpiMjRuS1NCN1hHNGdJQ0FnSUNBZ0lIUnllU0I3WEc0Z0lDQWdJQ0FnSUNBZ2NtVnpjRzl1YzJVZ1BTQktVMDlPTG5CaGNuTmxLSFJvYVhNdWVHaHlMbkpsYzNCdmJuTmxWR1Y0ZENsY2JpQWdJQ0FnSUNBZ2ZTQmpZWFJqYUNBb1pYSnliM0lwSUh0Y2JpQWdJQ0FnSUNBZ0lDQjBhR2x6TG1WeWNtOXlRMjlrWlNBOUlDZEtVMDlPWDAxQlRFWlBVazFGUkNkY2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2ZTQmxiSE5sSUdsbUlDaDBhR2x6TG05d2RITXVaR0YwWVZSNWNHVWdQVDA5SUNkNGJXd25LU0I3WEc0Z0lDQWdJQ0FnSUhKbGMzQnZibk5sSUQwZ2RHaHBjeTU0YUhJdWNtVnpjRzl1YzJWWVRVeGNiaUFnSUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNBZ0lISmxjM0J2Ym5ObElEMGdkR2hwY3k1NGFISXVjbVZ6Y0c5dWMyVlVaWGgwWEc0Z0lDQWdJQ0I5WEc0Z0lDQWdJQ0J5WlhSMWNtNGdjbVZ6Y0c5dWMyVmNiaUFnSUNCOVhHNWNiaUFnSUNCeWRXNVNaWEYxWlhOMEtDa2dlMXh1SUNBZ0lDQWdkR2hwY3k1NGFISWdQU0IwYUdsekxtTnlaV0YwWlZob2NpZ3BYRzRnSUNBZ0lDQjBhR2x6TG5ob2NpNXZjR1Z1S0hSb2FYTXViM0IwY3k1dFpYUm9iMlFzSUhSb2FYTXViM0IwY3k1MWNtd3NJSFJ5ZFdVcFhHNGdJQ0FnSUNCMGFHbHpMbTl1VUhKbFJYaGxZM1YwWlNncFhHNWNiaUFnSUNBZ0lIUm9hWE11ZUdoeUxtOXVjbVZoWkhsemRHRjBaV05vWVc1blpTQTlJQ2dwSUQwK0lIdGNiaUFnSUNBZ0lDQWdhV1lnS0hCaGNuTmxTVzUwS0hSb2FYTXVlR2h5TG5KbFlXUjVVM1JoZEdVcElEMDlQU0EwS1NCN1hHNGdJQ0FnSUNBZ0lDQWdZMjl1YzNRZ2MzUmhkSFZ6SUQwZ2RHaHBjeTU0YUhJdWMzUmhkSFZ6TG5SdlUzUnlhVzVuS0NsY2JseHVJQ0FnSUNBZ0lDQWdJQzh2SUhKbGMzQnZibk5sSUhKbFkyVnBkbVZrWEc0Z0lDQWdJQ0FnSUNBZ2FXWWdLSFI1Y0dWdlppQjBhR2x6TG05d2RITXVZMjl0Y0d4bGRHVWdQVDA5SUNkbWRXNWpkR2x2YmljcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUhSb2FYTXViM0IwY3k1amIyMXdiR1YwWlNoMGFHbHpMbVZ5Y205eVEyOWtaU3dnZEdocGN5NTRhSElwWEc0Z0lDQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJQ0FnTHk4Z2MzVmpZMlZ6Y3lBeWVIaGNiaUFnSUNBZ0lDQWdJQ0JwWmlBb2MzUmhkSFZ6V3pCZElEMDlQU0FuTWljcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUdsbUlDaDBlWEJsYjJZZ2RHaHBjeTV2Y0hSekxuTjFZMk5sYzNNZ1BUMDlJQ2RtZFc1amRHbHZiaWNwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnZEdocGN5NXZjSFJ6TG5OMVkyTmxjM01vZEdocGN5NXdZWEp6WlZKbGMzQnZibk5sS0Nrc0lIUm9hWE11ZUdoeUtWeHVJQ0FnSUNBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdVhHNGdJQ0FnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUNBZ0x5OGdaWEp5YjNJZ0tERjRlQ3dnTW5oNExDQXplSGdzSURWNGVDbGNiaUFnSUNBZ0lDQWdJQ0JwWmlBb2RIbHdaVzltSUhSb2FYTXViM0IwY3k1bGNuSnZjaUE5UFQwZ0oyWjFibU4wYVc5dUp5a2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0x5OGdWR2x0Wlc5MWRDQnBiaUJ2Y21SbGNpQjBieUIzWVdsMElHOXVJSFJvWlNCMGFXMWxiM1YwSUd4cGJXbDBYRzRnSUNBZ0lDQWdJQ0FnSUNCM2FXNWtiM2N1YzJWMFZHbHRaVzkxZENnb0tTQTlQaUI3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJSFJvYVhNdWIzQjBjeTVsY25KdmNpaDBhR2x6TG1WeWNtOXlRMjlrWlN3Z2RHaHBjeTU0YUhJcFhHNGdJQ0FnSUNBZ0lDQWdJQ0I5TENBeEtWeHVJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnZlZ4dUlDQWdJQ0FnZEdocGN5NTRhSEl1YzJWdVpDaDBhR2x6TG05d2RITXVaR0YwWVNsY2JseHVJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTmNiaUFnSUNCOVhHNWNiaUFnSUNCallXNWpaV3dvS1NCN1hHNGdJQ0FnSUNCMGFHbHpMbVZ5Y205eVEyOWtaU0E5SUNkRFFVNURSVXhGUkNkY2JpQWdJQ0FnSUdsbUlDaDBhR2x6TG5ob2Npa2dlMXh1SUNBZ0lDQWdJQ0IwYUdsekxuaG9jaTVoWW05eWRDZ3BYRzRnSUNBZ0lDQjlYRzRnSUNBZ0lDQjBhR2x6TG5ob2NpQTlJRzUxYkd4Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2THlCblpYUjBaWEp6WEc1Y2JpQWdJQ0J6ZEdGMGFXTWdaMlYwSUhabGNuTnBiMjRvS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnWUNSN1RrRk5SWDB1Skh0V1JWSlRTVTlPZldCY2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2THlCd2RXSnNhV05jYmx4dUlDQWdJQzh2SUhOMFlYUnBZMXh1SUNBZ0lITjBZWFJwWXlCZlJFOU5TVzUwWlhKbVlXTmxLRzl3ZEhNcElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCdVpYY2dRV3BoZUNodmNIUnpLUzV5ZFc1U1pYRjFaWE4wS0NsY2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNCeVpYUjFjbTRnUVdwaGVGeHVmU2tvS1Z4dVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCQmFtRjRYRzRpTENKbGVIQnZjblFnWm5WdVkzUnBiMjRnWkdsemNHRjBZMmhYYVc1RWIyTkZkbVZ1ZENobGRtVnVkRTVoYldVc0lHMXZaSFZzWlU1aGJXVXNJR1JsZEdGcGJDQTlJSHQ5S1NCN1hHNGdJR052Ym5OMElHWjFiR3hGZG1WdWRFNWhiV1VnUFNCZ0pIdGxkbVZ1ZEU1aGJXVjlMbkJvTGlSN2JXOWtkV3hsVG1GdFpYMWdYRzRnSUhkcGJtUnZkeTVrYVhOd1lYUmphRVYyWlc1MEtHNWxkeUJEZFhOMGIyMUZkbVZ1ZENobWRXeHNSWFpsYm5ST1lXMWxMQ0I3SUdSbGRHRnBiQ0I5S1NsY2JpQWdaRzlqZFcxbGJuUXVaR2x6Y0dGMFkyaEZkbVZ1ZENodVpYY2dRM1Z6ZEc5dFJYWmxiblFvWm5Wc2JFVjJaVzUwVG1GdFpTd2dleUJrWlhSaGFXd2dmU2twWEc1OVhHNWNibVY0Y0c5eWRDQm1kVzVqZEdsdmJpQmthWE53WVhSamFFVnNaVzFsYm5SRmRtVnVkQ2hrYjIxRmJHVnRaVzUwTENCbGRtVnVkRTVoYldVc0lHMXZaSFZzWlU1aGJXVXNJR1JsZEdGcGJDQTlJSHQ5S1NCN1hHNGdJR052Ym5OMElHWjFiR3hGZG1WdWRFNWhiV1VnUFNCZ0pIdGxkbVZ1ZEU1aGJXVjlMbkJvTGlSN2JXOWtkV3hsVG1GdFpYMWdYRzRnSUdSdmJVVnNaVzFsYm5RdVpHbHpjR0YwWTJoRmRtVnVkQ2h1WlhjZ1EzVnpkRzl0UlhabGJuUW9ablZzYkVWMlpXNTBUbUZ0WlN3Z2V5QmtaWFJoYVd3Z2ZTa3BYRzU5WEc1Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCa2FYTndZWFJqYUZCaFoyVkZkbVZ1ZENobGRtVnVkRTVoYldVc0lIQmhaMlZPWVcxbExDQmtaWFJoYVd3Z1BTQjdmU2tnZTF4dUlDQmpiMjV6ZENCbWRXeHNSWFpsYm5ST1lXMWxJRDBnWUNSN2NHRm5aVTVoYldWOUxpUjdaWFpsYm5ST1lXMWxmV0JjYmlBZ2QybHVaRzkzTG1ScGMzQmhkR05vUlhabGJuUW9ibVYzSUVOMWMzUnZiVVYyWlc1MEtHWjFiR3hGZG1WdWRFNWhiV1VzSUhzZ1pHVjBZV2xzSUgwcEtWeHVJQ0JrYjJOMWJXVnVkQzVrYVhOd1lYUmphRVYyWlc1MEtHNWxkeUJEZFhOMGIyMUZkbVZ1ZENobWRXeHNSWFpsYm5ST1lXMWxMQ0I3SUdSbGRHRnBiQ0I5S1NsY2JuMWNiaUlzSWk4dklFQjBiMlJ2SUd0bFpYQWdQMXh1YVdZZ0tIUjVjR1Z2WmlCM2FXNWtiM2NnSVQwOUlDZDFibVJsWm1sdVpXUW5LU0I3WEc0Z0lIZHBibVJ2ZHk1aFpHUkZkbVZ1ZEV4cGMzUmxibVZ5S0NkbGNuSnZjaWNzSUNncElEMCtJSHRjYmlBZ0lDQmpiMjV6YjJ4bExtVnljbTl5S0NkQmJpQmxjbkp2Y2lCb1lYTWdiMk5qZFhKbFpDRWdXVzkxSUdOaGJpQndaVzRnWVc0Z2FYTnpkV1VnYUdWeVpUb2dhSFIwY0hNNkx5OW5hWFJvZFdJdVkyOXRMM0YxWVhKckxXUmxkaTlRYUc5dWIyNHRSbkpoYldWM2IzSnJMMmx6YzNWbGN5Y3BYRzRnSUgwcFhHNTlYRzVjYmk4dklGVnpaU0JoZG1GcGJHRmliR1VnWlhabGJuUnpYRzVzWlhRZ1lYWmhhV3hoWW14bFJYWmxiblJ6SUQwZ1d5ZHRiM1Z6WldSdmQyNG5MQ0FuYlc5MWMyVnRiM1psSnl3Z0oyMXZkWE5sZFhBblhWeHViR1YwSUhSdmRXTm9VMk55WldWdUlEMGdabUZzYzJWY2JseHVhV1lnS0hSNWNHVnZaaUIzYVc1a2IzY2dJVDA5SUNkMWJtUmxabWx1WldRbktTQjdYRzRnSUdsbUlDZ29KMjl1ZEc5MVkyaHpkR0Z5ZENjZ2FXNGdkMmx1Wkc5M0tTQjhmQ0IzYVc1a2IzY3VSRzlqZFcxbGJuUlViM1ZqYUNBbUppQmtiMk4xYldWdWRDQnBibk4wWVc1alpXOW1JRVJ2WTNWdFpXNTBWRzkxWTJncElIdGNiaUFnSUNCMGIzVmphRk5qY21WbGJpQTlJSFJ5ZFdWY2JpQWdJQ0JoZG1GcGJHRmliR1ZGZG1WdWRITWdQU0JiSjNSdmRXTm9jM1JoY25RbkxDQW5kRzkxWTJodGIzWmxKeXdnSjNSdmRXTm9aVzVrSnl3Z0ozUnZkV05vWTJGdVkyVnNKMTFjYmlBZ2ZWeHVYRzRnSUdsbUlDaDNhVzVrYjNjdWJtRjJhV2RoZEc5eUxuQnZhVzUwWlhKRmJtRmliR1ZrS1NCN1hHNGdJQ0FnWVhaaGFXeGhZbXhsUlhabGJuUnpJRDBnV3lkd2IybHVkR1Z5Wkc5M2JpY3NJQ2R3YjJsdWRHVnliVzkyWlNjc0lDZHdiMmx1ZEdWeWRYQW5MQ0FuY0c5cGJuUmxjbU5oYm1ObGJDZGRYRzRnSUgwZ1pXeHpaU0JwWmlBb2QybHVaRzkzTG01aGRtbG5ZWFJ2Y2k1dGMxQnZhVzUwWlhKRmJtRmliR1ZrS1NCN1hHNGdJQ0FnWVhaaGFXeGhZbXhsUlhabGJuUnpJRDBnV3lkTlUxQnZhVzUwWlhKRWIzZHVKeXdnSjAxVFVHOXBiblJsY2sxdmRtVW5MQ0FuVFZOUWIybHVkR1Z5VlhBbkxDQW5UVk5RYjJsdWRHVnlRMkZ1WTJWc0oxMWNiaUFnZlZ4dWZWeHVYRzVqYjI1emRDQmxiQ0E5SUdSdlkzVnRaVzUwTG1OeVpXRjBaVVZzWlcxbGJuUW9KMlJwZGljcFhHNWpiMjV6ZENCMGNtRnVjMmwwYVc5dWN5QTlJRnRjYmlBZ2V5QnVZVzFsT2lBbmRISmhibk5wZEdsdmJpY3NJSE4wWVhKME9pQW5kSEpoYm5OcGRHbHZibk4wWVhKMEp5d2daVzVrT2lBbmRISmhibk5wZEdsdmJtVnVaQ2NnZlN4Y2JpQWdleUJ1WVcxbE9pQW5UVzk2VkhKaGJuTnBkR2x2Ymljc0lITjBZWEowT2lBbmRISmhibk5wZEdsdmJuTjBZWEowSnl3Z1pXNWtPaUFuZEhKaGJuTnBkR2x2Ym1WdVpDY2dmU3hjYmlBZ2V5QnVZVzFsT2lBbmJYTlVjbUZ1YzJsMGFXOXVKeXdnYzNSaGNuUTZJQ2R0YzFSeVlXNXphWFJwYjI1VGRHRnlkQ2NzSUdWdVpEb2dKMjF6VkhKaGJuTnBkR2x2YmtWdVpDY2dmU3hjYmlBZ2V5QnVZVzFsT2lBblYyVmlhMmwwVkhKaGJuTnBkR2x2Ymljc0lITjBZWEowT2lBbmQyVmlhMmwwVkhKaGJuTnBkR2x2YmxOMFlYSjBKeXdnWlc1a09pQW5kMlZpYTJsMFZISmhibk5wZEdsdmJrVnVaQ2NnZlN4Y2JsMWNibU52Ym5OMElHRnVhVzFoZEdsdmJuTWdQU0JiWEc0Z0lIc2dibUZ0WlRvZ0oyRnVhVzFoZEdsdmJpY3NJSE4wWVhKME9pQW5ZVzVwYldGMGFXOXVjM1JoY25RbkxDQmxibVE2SUNkaGJtbHRZWFJwYjI1bGJtUW5JSDBzWEc0Z0lIc2dibUZ0WlRvZ0owMXZla0Z1YVcxaGRHbHZiaWNzSUhOMFlYSjBPaUFuWVc1cGJXRjBhVzl1YzNSaGNuUW5MQ0JsYm1RNklDZGhibWx0WVhScGIyNWxibVFuSUgwc1hHNGdJSHNnYm1GdFpUb2dKMjF6UVc1cGJXRjBhVzl1Snl3Z2MzUmhjblE2SUNkdGMwRnVhVzFoZEdsdmJsTjBZWEowSnl3Z1pXNWtPaUFuYlhOQmJtbHRZWFJwYjI1RmJtUW5JSDBzWEc0Z0lIc2dibUZ0WlRvZ0oxZGxZbXRwZEVGdWFXMWhkR2x2Ymljc0lITjBZWEowT2lBbmQyVmlhMmwwUVc1cGJXRjBhVzl1VTNSaGNuUW5MQ0JsYm1RNklDZDNaV0pyYVhSQmJtbHRZWFJwYjI1RmJtUW5JSDBzWEc1ZFhHNWNibU52Ym5OMElIUnlZVzV6YVhScGIyNVRkR0Z5ZENBOUlIUnlZVzV6YVhScGIyNXpMbVpwYm1Rb2RDQTlQaUJsYkM1emRIbHNaVnQwTG01aGJXVmRJQ0U5UFNCMWJtUmxabWx1WldRcExuTjBZWEowWEc1amIyNXpkQ0IwY21GdWMybDBhVzl1Ulc1a0lEMGdkSEpoYm5OcGRHbHZibk11Wm1sdVpDaDBJRDArSUdWc0xuTjBlV3hsVzNRdWJtRnRaVjBnSVQwOUlIVnVaR1ZtYVc1bFpDa3VaVzVrWEc1amIyNXpkQ0JoYm1sdFlYUnBiMjVUZEdGeWRDQTlJR0Z1YVcxaGRHbHZibk11Wm1sdVpDaDBJRDArSUdWc0xuTjBlV3hsVzNRdWJtRnRaVjBnSVQwOUlIVnVaR1ZtYVc1bFpDa3VjM1JoY25SY2JtTnZibk4wSUdGdWFXMWhkR2x2YmtWdVpDQTlJR0Z1YVcxaGRHbHZibk11Wm1sdVpDaDBJRDArSUdWc0xuTjBlV3hsVzNRdWJtRnRaVjBnSVQwOUlIVnVaR1ZtYVc1bFpDa3VaVzVrWEc1Y2JtVjRjRzl5ZENCa1pXWmhkV3gwSUh0Y2JpQWdMeThnZEc5MVkyZ2djMk55WldWdUlITjFjSEJ2Y25SY2JpQWdWRTlWUTBoZlUwTlNSVVZPT2lCMGIzVmphRk5qY21WbGJpeGNibHh1SUNBdkx5QnVaWFIzYjNKclhHNGdJRTVGVkZkUFVrdGZUMDVNU1U1Rk9pQW5iMjVzYVc1bEp5eGNiaUFnVGtWVVYwOVNTMTlQUmtaTVNVNUZPaUFuYjJabWJHbHVaU2NzWEc1Y2JpQWdMeThnZFhObGNpQnBiblJsY21aaFkyVWdjM1JoZEdWelhHNGdJRk5JVDFjNklDZHphRzkzSnl4Y2JpQWdVMGhQVjA0NklDZHphRzkzYmljc1hHNGdJRWhKUkVVNklDZG9hV1JsSnl4Y2JpQWdTRWxFUkVWT09pQW5hR2xrWkdWdUp5eGNibHh1SUNBdkx5Qm9ZWE5vWEc0Z0lFaEJVMGc2SUNkb1lYTm9KeXhjYmx4dUlDQXZMeUIwYjNWamFDd2diVzkxYzJVZ1lXNWtJSEJ2YVc1MFpYSWdaWFpsYm5SeklIQnZiSGxtYVd4c1hHNGdJRk5VUVZKVU9pQmhkbUZwYkdGaWJHVkZkbVZ1ZEhOYk1GMHNYRzRnSUUxUFZrVTZJR0YyWVdsc1lXSnNaVVYyWlc1MGMxc3hYU3hjYmlBZ1JVNUVPaUJoZG1GcGJHRmliR1ZGZG1WdWRITmJNbDBzWEc0Z0lFTkJUa05GVERvZ2RIbHdaVzltSUdGMllXbHNZV0pzWlVWMlpXNTBjMXN6WFNBOVBUMGdKM1Z1WkdWbWFXNWxaQ2NnUHlCdWRXeHNJRG9nWVhaaGFXeGhZbXhsUlhabGJuUnpXek5kTEZ4dVhHNGdJQzh2SUhSeVlXNXphWFJwYjI1elhHNGdJRlJTUVU1VFNWUkpUMDVmVTFSQlVsUTZJSFJ5WVc1emFYUnBiMjVUZEdGeWRDeGNiaUFnVkZKQlRsTkpWRWxQVGw5RlRrUTZJSFJ5WVc1emFYUnBiMjVGYm1Rc1hHNWNiaUFnTHk4Z1lXNXBiV0YwYVc5dWMxeHVJQ0JCVGtsTlFWUkpUMDVmVTFSQlVsUTZJR0Z1YVcxaGRHbHZibE4wWVhKMExGeHVJQ0JCVGtsTlFWUkpUMDVmUlU1RU9pQmhibWx0WVhScGIyNUZibVFzWEc1Y2JpQWdMeThnWkhKdmNHUnZkMjVjYmlBZ1NWUkZUVjlUUlV4RlExUkZSRG9nSjJsMFpXMVRaV3hsWTNSbFpDY3NYRzU5SWl3aUx5b3FYRzRxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNHFJRXhwWTJWdWMyVmtJSFZ1WkdWeUlFMUpWQ0FvYUhSMGNITTZMeTluYVhSb2RXSXVZMjl0TDNGMVlYSnJMV1JsZGk5UWFHOXViMjR0Um5KaGJXVjNiM0pyTDJKc2IySXZiV0Z6ZEdWeUwweEpRMFZPVTBVcFhHNHFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0cUwxeHVYRzVqYjI1emRDQkNhVzVrWlhJZ1BTQW9LQ2tnUFQ0Z2UxeHVJQ0F2S2lwY2JpQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0tpQkRiMjV6ZEdGdWRITmNiaUFnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdLaTljYmx4dUlDQmpiMjV6ZENCT1FVMUZJRDBnSjJsdWRHd3RZbWx1WkdWeUoxeHVJQ0JqYjI1emRDQldSVkpUU1U5T0lEMGdKekl1TUM0d0oxeHVYRzRnSUM4cUtseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ29nUTJ4aGMzTWdSR1ZtYVc1cGRHbHZibHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvdlhHNWNiaUFnWTJ4aGMzTWdRbWx1WkdWeUlIdGNiaUFnSUNCamIyNXpkSEoxWTNSdmNpaGxiR1Z0Wlc1MExDQmtZWFJoS1NCN1hHNGdJQ0FnSUNCMGFHbHpMbVZzWlcxbGJuUWdQU0JsYkdWdFpXNTBYRzRnSUNBZ0lDQjBhR2x6TG1SaGRHRWdQU0JrWVhSaFhHNWNiaUFnSUNBZ0lHbG1JQ2doZEdocGN5NXBjMFZzWlcxbGJuUW9kR2hwY3k1bGJHVnRaVzUwS1NrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY201Y2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0x5OGdZWEp5WVhrZ2IyWWdTRlJOVEVWc1pXMWxiblJjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbVZzWlcxbGJuUXViR1Z1WjNSb0lDWW1JSFJvYVhNdVpXeGxiV1Z1ZEM1c1pXNW5kR2dnUGlBd0tTQjdYRzRnSUNBZ0lDQWdJSFJvYVhNdWMyVjBUbTlrWlhNb2RHaHBjeTVsYkdWdFpXNTBLVnh1SUNBZ0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDQWdMeThnYzJsdVoyeGxJRWhVVFV4RmJHVnRaVzUwWEc0Z0lDQWdJQ0FnSUhSb2FYTXVjMlYwVG05a1pTaDBhR2x6TG1Wc1pXMWxiblFwWEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1WEc0Z0lDQWdMeThnWjJWMGRHVnljMXh1WEc0Z0lDQWdjM1JoZEdsaklHZGxkQ0IyWlhKemFXOXVLQ2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVJR0FrZTA1QlRVVjlMaVI3VmtWU1UwbFBUbjFnWEc0Z0lDQWdmVnh1WEc0Z0lDQWdMeW9xWEc0Z0lDQWdJQ29nUTJobFkydHpJR2xtSUhSb1pTQm5hWFpsYmlCaGNtZDFiV1Z1ZENCcGN5QmhJRVJQVFNCbGJHVnRaVzUwWEc0Z0lDQWdJQ29nUUhCaGNtRnRJSHRJVkUxTVJXeGxiV1Z1ZEgwZ2RHaGxJR0Z5WjNWdFpXNTBJSFJ2SUhSbGMzUmNiaUFnSUNBZ0tpQkFjbVYwZFhKdUlIdGliMjlzWldGdWZTQjBjblZsSUdsbUlIUm9aU0J2WW1wbFkzUWdhWE1nWVNCRVQwMGdaV3hsYldWdWRDd2dabUZzYzJVZ2IzUm9aWEozYVhObFhHNGdJQ0FnSUNvdlhHNGdJQ0FnYVhORmJHVnRaVzUwS0dWc1pXMWxiblFwSUh0Y2JpQWdJQ0FnSUdsbUlDaGxiR1Z0Wlc1MElEMDlQU0J1ZFd4c0tTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQm1ZV3h6WlZ4dUlDQWdJQ0FnZlZ4dUlDQWdJQ0FnY21WMGRYSnVJQ2gwZVhCbGIyWWdUbTlrWlNBOVBUMGdKMjlpYW1WamRDY2dQeUJsYkdWdFpXNTBJR2x1YzNSaGJtTmxiMllnVG05a1pTQTZJR1ZzWlcxbGJuUWdKaVlnZEhsd1pXOW1JR1ZzWlcxbGJuUWdQVDA5SUNkdlltcGxZM1FuSUNZbUlIUjVjR1Z2WmlCbGJHVnRaVzUwTG01dlpHVlVlWEJsSUQwOVBTQW5iblZ0WW1WeUp5QW1KaUIwZVhCbGIyWWdaV3hsYldWdWRDNXViMlJsVG1GdFpTQTlQVDBnSjNOMGNtbHVaeWNwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdMeW9xWEc0Z0lDQWdLaUJDYVc1a2N5QnpiMjFsSUhSbGVIUWdkRzhnZEdobElHZHBkbVZ1SUVSUFRTQmxiR1Z0Wlc1MFhHNGdJQ0FnS2lCQWNHRnlZVzBnZTBoVVRVeEZiR1Z0Wlc1MGZTQmxiR1Z0Wlc1MFhHNGdJQ0FnS2lCQWNHRnlZVzBnZTFOMGNtbHVaMzBnZEdWNGRGeHVJQ0FnSUNvdlhHNGdJQ0FnYzJWMFZHVjRkQ2hsYkdWdFpXNTBMQ0IwWlhoMEtTQjdYRzRnSUNBZ0lDQnBaaUFvSVNnbmRHVjRkRU52Ym5SbGJuUW5JR2x1SUdWc1pXMWxiblFwS1NCN1hHNGdJQ0FnSUNBZ0lHVnNaVzFsYm5RdWFXNXVaWEpVWlhoMElEMGdkR1Y0ZEZ4dUlDQWdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJQ0FnWld4bGJXVnVkQzUwWlhoMFEyOXVkR1Z1ZENBOUlIUmxlSFJjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzVjYmlBZ0lDQXZLaXBjYmlBZ0lDQWdLaUJDYVc1a2N5QnpiMjFsSUdoMGJXd2dkRzhnZEdobElHZHBkbVZ1SUVSUFRTQmxiR1Z0Wlc1MFhHNGdJQ0FnSUNvZ1FIQmhjbUZ0SUh0SVZFMU1SV3hsYldWdWRIMGdaV3hsYldWdWRGeHVJQ0FnSUNBcUlFQndZWEpoYlNCN2MzUnlhVzVuZlNCMFpYaDBYRzRnSUNBZ0lDb3ZYRzRnSUNBZ2MyVjBTSFJ0YkNobGJHVnRaVzUwTENCMFpYaDBLU0I3WEc0Z0lDQWdJQ0JsYkdWdFpXNTBMbWx1Ym1WeVNGUk5UQ0E5SUhSbGVIUmNiaUFnSUNCOVhHNWNiaUFnSUNBdktpcGNiaUFnSUNBZ0tpQkNhVzVrY3lCamRYTjBiMjBnWVhSMGNtbGlkWFJsY3lCMGJ5QjBhR1VnWjJsMlpXNGdSRTlOSUdWc1pXMWxiblJjYmlBZ0lDQWdLaUJBY0dGeVlXMGdlMGhVVFV4RmJHVnRaVzUwZlNCbGJHVnRaVzUwWEc0Z0lDQWdJQ29nUUhCaGNtRnRJSHRUZEhKcGJtZDlJR0YwZEhKY2JpQWdJQ0FnS2lCQWNHRnlZVzBnZTFOMGNtbHVaMzBnZEdWNGRGeHVJQ0FnSUNBcUwxeHVJQ0FnSUhObGRFRjBkSEpwWW5WMFpTaGxiR1Z0Wlc1MExDQmhkSFJ5TENCMFpYaDBLU0I3WEc0Z0lDQWdJQ0JsYkdWdFpXNTBMbk5sZEVGMGRISnBZblYwWlNoaGRIUnlMQ0IwWlhoMEtWeHVJQ0FnSUgxY2JseHVJQ0FnSUhObGRFNXZaR1VvWld4bGJXVnVkQ2tnZTF4dUlDQWdJQ0FnYkdWMElHRjBkSElnUFNCbGJHVnRaVzUwTG1kbGRFRjBkSEpwWW5WMFpTZ25aR0YwWVMxcE1UaHVKeWxjYmlBZ0lDQWdJR2xtSUNnaFlYUjBjaWtnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTVjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnWVhSMGNpQTlJR0YwZEhJdWRISnBiU2dwWEc1Y2JpQWdJQ0FnSUdOdmJuTjBJSElnUFNBdktEODZYRnh6ZkY0cEtGdEJMVnBoTFhvdFh6QXRPVjByS1RwY1hITXFLQzRxUHlrb1B6MWNYSE1yWEZ4M0t6cDhKQ2t2WjF4dUlDQWdJQ0FnYkdWMElHMWNibHh1SUNBZ0lDQWdkMmhwYkdVZ0tHMGdQU0J5TG1WNFpXTW9ZWFIwY2lrcElIdGNiaUFnSUNBZ0lDQWdZMjl1YzNRZ2EyVjVJRDBnYlZzeFhTNTBjbWx0S0NsY2JpQWdJQ0FnSUNBZ1kyOXVjM1FnZG1Gc2RXVWdQU0J0V3pKZExuUnlhVzBvS1M1eVpYQnNZV05sS0Njc0p5d2dKeWNwWEc0Z0lDQWdJQ0FnSUd4bGRDQnBiblJzVm1Gc2RXVWdQU0IwYUdsekxtUmhkR0ZiZG1Gc2RXVmRYRzVjYmlBZ0lDQWdJQ0FnYVdZZ0tDRjBhR2x6TG1SaGRHRmJkbUZzZFdWZEtTQjdYRzRnSUNBZ0lDQWdJQ0FnWTI5dWMyOXNaUzVzYjJjb1lDUjdUa0ZOUlgwdUlGZGhjbTVwYm1jc0lDUjdkbUZzZFdWOUlHUnZaWE1nYm05MElHVjRhWE4wTG1BcFhHNGdJQ0FnSUNBZ0lDQWdhVzUwYkZaaGJIVmxJRDBnZG1Gc2RXVmNiaUFnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJRzFsZEdodlpFNWhiV1VnUFNBbmMyVjBKeUFySUd0bGVTNWphR0Z5UVhRb01Da3VkRzlWY0hCbGNrTmhjMlVvS1NBcklHdGxlUzV6YkdsalpTZ3hLVnh1WEc0Z0lDQWdJQ0FnSUdsbUlDaDBhR2x6VzIxbGRHaHZaRTVoYldWZEtTQjdYRzRnSUNBZ0lDQWdJQ0FnZEdocGMxdHRaWFJvYjJST1lXMWxYU2hsYkdWdFpXNTBMQ0JwYm5Sc1ZtRnNkV1VwWEc0Z0lDQWdJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0FnSUNBZ2RHaHBjeTV6WlhSQmRIUnlhV0oxZEdVb1pXeGxiV1Z1ZEN3Z2EyVjVMQ0JwYm5Sc1ZtRnNkV1VwWEc0Z0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2S2lwY2JpQWdJQ0FxSUZObGRDQjJZV3gxWlhNZ2RHOGdSRTlOSUc1dlpHVnpYRzRnSUNBZ0tpOWNiaUFnSUNCelpYUk9iMlJsY3lobGJHVnRaVzUwS1NCN1hHNGdJQ0FnSUNCbGJHVnRaVzUwTG1admNrVmhZMmdvWld3Z1BUNGdkR2hwY3k1elpYUk9iMlJsS0dWc0tTbGNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQnlaWFIxY200Z1FtbHVaR1Z5WEc1OUtTZ3BYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJRUpwYm1SbGNseHVJaXdpTHlvcVhHNGdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDb2dUR2xqWlc1elpXUWdkVzVrWlhJZ1RVbFVJQ2hvZEhSd2N6b3ZMMmRwZEdoMVlpNWpiMjB2Y1hWaGNtc3RaR1YyTDFCb2IyNXZiaTFHY21GdFpYZHZjbXN2WW14dllpOXRZWE4wWlhJdlRFbERSVTVUUlNsY2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0tpOWNibWx0Y0c5eWRDQkNhVzVrWlhJZ1puSnZiU0FuTGk5aWFXNWtaWEluWEc1Y2JtTnZibk4wSUVsdWRHd2dQU0FvS0NrZ1BUNGdlMXh1SUNBdktpcGNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxSUVOdmJuTjBZVzUwYzF4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb3ZYRzVjYmlBZ1kyOXVjM1FnVGtGTlJTQTlJQ2RKYm5Sc0oxeHVJQ0JqYjI1emRDQldSVkpUU1U5T0lEMGdKekl1TUM0d0oxeHVJQ0JqYjI1emRDQkVSVVpCVlV4VVgxQlNUMUJGVWxSSlJWTWdQU0I3WEc0Z0lDQWdabUZzYkdKaFkydE1iMk5oYkdVNklDZGxiaWNzWEc0Z0lDQWdiRzlqWVd4bE9pQW5aVzRuTEZ4dUlDQWdJR0YxZEc5Q2FXNWtPaUIwY25WbExGeHVJQ0FnSUdSaGRHRTZJRzUxYkd3c1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUlFTnNZWE56SUVSbFptbHVhWFJwYjI1Y2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFMMXh1WEc0Z0lHTnNZWE56SUVsdWRHd2dlMXh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRU55WldGMFpYTWdZVzRnYVc1emRHRnVZMlVnYjJZZ1NXNTBiQzVjYmlBZ0lDQWdLaUJBY0dGeVlXMGdlMlpoYkd4aVlXTnJURzlqWVd4bE9pQnpkSEpwYm1jc0lHeHZZMkZzWlRvZ2MzUnlhVzVuTENCaGRYUnZRbWx1WkRvZ1ltOXZiR1ZoYml3Z1pHRjBZVG9nZTF0c1lXNW5PaUJ6ZEhKcGJtZGRPaUI3VzJ0bGVUb2djM1J5YVc1blhUb2djM1J5YVc1bmZYMTlYRzRnSUNBZ0lDb3ZYRzRnSUNBZ1kyOXVjM1J5ZFdOMGIzSW9iM0IwYVc5dWN5QTlJSHQ5S1NCN1hHNGdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTWdQU0JQWW1wbFkzUXVZWE56YVdkdUtFUkZSa0ZWVEZSZlVGSlBVRVZTVkVsRlV5d2diM0IwYVc5dWN5bGNibHh1SUNBZ0lDQWdhV1lnS0hSNWNHVnZaaUIwYUdsekxtOXdkR2x2Ym5NdVptRnNiR0poWTJ0TWIyTmhiR1VnSVQwOUlDZHpkSEpwYm1jbktTQjdYRzRnSUNBZ0lDQWdJSFJvY205M0lHNWxkeUJGY25KdmNpaGdKSHRPUVUxRmZTNGdWR2hsSUdaaGJHeGlZV05ySUd4dlkyRnNaU0JwY3lCdFlXNWtZWFJ2Y25rZ1lXNWtJRzExYzNRZ1ltVWdZU0J6ZEhKcGJtY3VZQ2xjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnYVdZZ0tIUm9hWE11YjNCMGFXOXVjeTVrWVhSaElEMDlQU0J1ZFd4c0tTQjdYRzRnSUNBZ0lDQWdJSFJvY205M0lHNWxkeUJGY25KdmNpaGdKSHRPUVUxRmZTNGdWR2hsY21VZ2FYTWdibThnZEhKaGJuTnNZWFJwYjI0Z1pHRjBZUzVnS1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCcFppQW9kSGx3Wlc5bUlIUm9hWE11YjNCMGFXOXVjeTVrWVhSaFczUm9hWE11YjNCMGFXOXVjeTVtWVd4c1ltRmphMHh2WTJGc1pWMGdJVDA5SUNkdlltcGxZM1FuS1NCN1hHNGdJQ0FnSUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2loZ0pIdE9RVTFGZlM0Z1ZHaGxJR1poYkd4aVlXTnJJR3h2WTJGc1pTQnRkWE4wSUc1bFkyVnpjMkZ5YVd4NUlHaGhkbVVnZEhKaGJuTnNZWFJwYjI0Z1pHRjBZUzVnS1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCMGFHbHpMbk5sZEV4dlkyRnNaU2gwYUdsekxtOXdkR2x2Ym5NdWJHOWpZV3hsTENCMGFHbHpMbTl3ZEdsdmJuTXVZWFYwYjBKcGJtUXBYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MzUmhkR2xqSUdkbGRDQjJaWEp6YVc5dUtDa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlHQWtlMDVCVFVWOUxpUjdWa1ZTVTBsUFRuMWdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1oyVjBURzlqWVd4bEtDa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlIUm9hWE11YjNCMGFXOXVjeTVzYjJOaGJHVmNiaUFnSUNCOVhHNWNiaUFnSUNCblpYUkdZV3hzWW1GamEweHZZMkZzWlNncElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCMGFHbHpMbTl3ZEdsdmJuTXVabUZzYkdKaFkydE1iMk5oYkdWY2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2S2lwY2JpQWdJQ0FnS2lCVFpYUWdaR1ZtWVhWc2RDQnNiMk5oYkdWY2JpQWdJQ0FnS2lCQWNHRnlZVzBnZTNOMGNtbHVaMzBnYkc5allXeGxYRzRnSUNBZ0lDb2dRSEJoY21GdElIdGliMjlzWldGdWZTQmJkWEJrWVhSbFNGUk5URDEwY25WbFhWeHVJQ0FnSUNBcUwxeHVJQ0FnSUhObGRFeHZZMkZzWlNoc2IyTmhiR1VzSUhWd1pHRjBaVWhVVFV3Z1BTQjBjblZsS1NCN1hHNGdJQ0FnSUNCcFppQW9kSGx3Wlc5bUlIUm9hWE11YjNCMGFXOXVjeTVrWVhSaFcyeHZZMkZzWlYwZ0lUMDlJQ2R2WW1wbFkzUW5LU0I3WEc0Z0lDQWdJQ0FnSUdOdmJuTnZiR1V1WlhKeWIzSW9ZQ1I3VGtGTlJYMHVJQ1I3Ykc5allXeGxmU0JvWVhNZ2JtOGdaR0YwWVN3Z1ptRnNiR0poWTJzZ2FXNGdKSHQwYUdsekxtOXdkR2x2Ym5NdVptRnNiR0poWTJ0TWIyTmhiR1Y5TG1BcFhHNGdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXViRzlqWVd4bElEMGdiRzlqWVd4bFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lHbG1JQ2gxY0dSaGRHVklWRTFNS1NCN1hHNGdJQ0FnSUNBZ0lIUm9hWE11ZFhCa1lYUmxTSFJ0YkNncFhHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dVhHNGdJQ0FnWjJWMFRHRnVaM1ZoWjJWektDa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlFOWlhbVZqZEM1clpYbHpLSFJvYVhNdWIzQjBhVzl1Y3k1a1lYUmhLVnh1SUNBZ0lIMWNibHh1SUNBZ0lHbHVjMlZ5ZEZaaGJIVmxjeWgyWVd4MVpTQTlJRzUxYkd3c0lHbHVhbVZqZEdGaWJHVldZV3gxWlhNZ1BTQjdmU2tnZTF4dUlDQWdJQ0FnYVdZZ0tIUjVjR1Z2WmlCMllXeDFaU0FoUFQwZ0ozTjBjbWx1WnljcElIdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlIVnVaR1ZtYVc1bFpGeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQmpiMjV6ZENCdFlYUmphQ0E5SUhaaGJIVmxMbTFoZEdOb0tDODZLRnRoTFhwQkxWb3RYekF0T1YwcktTOHBYRzRnSUNBZ0lDQnBaaUFvYldGMFkyZ3BJSHRjYmlBZ0lDQWdJQ0FnZG1Gc2RXVWdQU0IyWVd4MVpTNXlaWEJzWVdObEtHMWhkR05vV3pCZExDQnBibXBsWTNSaFlteGxWbUZzZFdWelcyMWhkR05vV3pGZFhTbGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdhV1lnS0haaGJIVmxMbTFoZEdOb0tDODZLRnRoTFhwQkxWb3RYekF0T1YwcktTOHBLU0I3WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUIwYUdsekxtbHVjMlZ5ZEZaaGJIVmxjeWgyWVd4MVpTd2dhVzVxWldOMFlXSnNaVlpoYkhWbGN5bGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdjbVYwZFhKdUlIWmhiSFZsWEc0Z0lDQWdmVnh1WEc0Z0lDQWdkSEpoYm5Oc1lYUmxLR3RsZVU1aGJXVWdQU0J1ZFd4c0xDQnBibXBsWTNRZ1BTQjdmU2tnZTF4dUlDQWdJQ0FnYkdWMElHUmhkR0VnUFNCMGFHbHpMbTl3ZEdsdmJuTXVaR0YwWVZ0MGFHbHpMbTl3ZEdsdmJuTXViRzlqWVd4bFhWeHVJQ0FnSUNBZ2FXWWdLQ0ZrWVhSaEtTQjdYRzRnSUNBZ0lDQWdJR1JoZEdFZ1BTQjBhR2x6TG05d2RHbHZibk11WkdGMFlWdDBhR2x6TG05d2RHbHZibk11Wm1Gc2JHSmhZMnRNYjJOaGJHVmRYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR2xtSUNoclpYbE9ZVzFsSUQwOVBTQnVkV3hzSUh4OElHdGxlVTVoYldVZ1BUMDlJQ2NxSnlCOGZDQkJjbkpoZVM1cGMwRnljbUY1S0d0bGVVNWhiV1VwS1NCN1hHNGdJQ0FnSUNBZ0lHbG1JQ2hCY25KaGVTNXBjMEZ5Y21GNUtHdGxlVTVoYldVcEtTQjdYRzRnSUNBZ0lDQWdJQ0FnWTI5dWMzUWdhMlY1Y3lBOUlFOWlhbVZqZEM1clpYbHpLR1JoZEdFcExtWnBiSFJsY2loclpYa2dQVDRnYTJWNVRtRnRaUzVwYm1SbGVFOW1LR3RsZVNrZ1BpQXRNU2xjYmlBZ0lDQWdJQ0FnSUNCamIyNXpkQ0JtYVd4MFpYSmxaRVJoZEdFZ1BTQjdmVnh1SUNBZ0lDQWdJQ0FnSUd0bGVYTXVabTl5UldGamFDaHJaWGtnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnWm1sc2RHVnlaV1JFWVhSaFcydGxlVjBnUFNCMGFHbHpMbWx1YzJWeWRGWmhiSFZsY3loa1lYUmhXMnRsZVYwc0lHbHVhbVZqZENsY2JpQWdJQ0FnSUNBZ0lDQjlLVnh1SUNBZ0lDQWdJQ0FnSUdSaGRHRWdQU0JtYVd4MFpYSmxaRVJoZEdGY2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJR052Ym5OMElHUmhkR0ZOWVhBZ1BTQjdmVnh1SUNBZ0lDQWdJQ0JtYjNJZ0tHTnZibk4wSUd0bGVTQnBiaUJrWVhSaEtTQjdYRzRnSUNBZ0lDQWdJQ0FnWkdGMFlVMWhjRnRyWlhsZElEMGdkR2hwY3k1cGJuTmxjblJXWVd4MVpYTW9aR0YwWVZ0clpYbGRMQ0JwYm1wbFkzUXBYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnWkdGMFlVMWhjRnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkR2hwY3k1cGJuTmxjblJXWVd4MVpYTW9aR0YwWVZ0clpYbE9ZVzFsWFN3Z2FXNXFaV04wS1Z4dUlDQWdJSDFjYmx4dUlDQWdJQzh2SUdGc2FXRnpJRzltSUhRb0tWeHVJQ0FnSUhRb2EyVjVUbUZ0WlNBOUlHNTFiR3dzSUdsdWFtVmpkQ0E5SUh0OUtTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z2RHaHBjeTUwY21GdWMyeGhkR1VvYTJWNVRtRnRaU3dnYVc1cVpXTjBLVnh1SUNBZ0lIMWNibHh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRlZ3WkdGMFpYTWdkR2hsSUVoVVRVd2dkbWxsZDNOY2JpQWdJQ0FnS2lCQWNHRnlZVzBnZTBoVVRVeEZiR1Z0Wlc1MGZTQmxiR1Z0Wlc1MFhHNGdJQ0FnSUNvdlhHNGdJQ0FnZFhCa1lYUmxTSFJ0YkNobGJHVnRaVzUwS1NCN1hHNGdJQ0FnSUNCcFppQW9kSGx3Wlc5bUlHVnNaVzFsYm5RZ1BUMDlJQ2QxYm1SbFptbHVaV1FuS1NCN1hHNGdJQ0FnSUNBZ0lHVnNaVzFsYm5RZ1BTQmtiMk4xYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5UVd4c0tDZGJaR0YwWVMxcE1UaHVYU2NwWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUdsbUlDaDBlWEJsYjJZZ1pXeGxiV1Z1ZENBOVBUMGdKM04wY21sdVp5Y3BJSHRjYmlBZ0lDQWdJQ0FnWld4bGJXVnVkQ0E5SUdSdlkzVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSW9aV3hsYldWdWRDbGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdibVYzSUVKcGJtUmxjaWhsYkdWdFpXNTBMQ0IwYUdsekxuUW9LU2xjYmlBZ0lDQjlYRzVjYmlBZ0lDQXZMeUJ6ZEdGMGFXTmNiaUFnSUNCemRHRjBhV01nWDBSUFRVbHVkR1Z5Wm1GalpTaHZjSFJwYjI1ektTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z2JtVjNJRWx1ZEd3b2IzQjBhVzl1Y3lsY2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNCeVpYUjFjbTRnU1c1MGJGeHVmU2tvS1Z4dVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCSmJuUnNYRzRpTENJdktpcGNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaUJNYVdObGJuTmxaQ0IxYm1SbGNpQk5TVlFnS0doMGRIQnpPaTh2WjJsMGFIVmlMbU52YlM5eGRXRnlheTFrWlhZdlVHaHZibTl1TFVaeVlXMWxkMjl5YXk5aWJHOWlMMjFoYzNSbGNpOU1TVU5GVGxORktWeHVJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQXFMMXh1WEc1cGJYQnZjblFnUlhabGJuUWdabkp2YlNBbkxpNHZaWFpsYm5SekoxeHVhVzF3YjNKMElFTnZiWEJ2Ym1WdWRDQm1jbTl0SUNjdUxpOHVMaTlqYjIxd2IyNWxiblJ6TDJOdmJYQnZibVZ1ZENkY2JtbHRjRzl5ZENCN0lHUnBjM0JoZEdOb1YybHVSRzlqUlhabGJuUWdmU0JtY205dElDY3VMaTlsZG1WdWRITXZaR2x6Y0dGMFkyZ25YRzVjYm1OdmJuTjBJRTVsZEhkdmNtc2dQU0FvS0NrZ1BUNGdlMXh1SUNBdktpcGNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxSUVOdmJuTjBZVzUwYzF4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb3ZYRzVjYmlBZ1kyOXVjM1FnVGtGTlJTQTlJQ2R1WlhSM2IzSnJKMXh1SUNCamIyNXpkQ0JXUlZKVFNVOU9JRDBnSnpJdU1DNHdKMXh1SUNCamIyNXpkQ0JFUlVaQlZVeFVYMUJTVDFCRlVsUkpSVk1nUFNCN2ZWeHVYRzRnSUhkcGJtUnZkeTVoWkdSRmRtVnVkRXhwYzNSbGJtVnlLQ2R2Ym14cGJtVW5MQ0FvS1NBOVBpQjdYRzRnSUNBZ1pHbHpjR0YwWTJoWGFXNUViMk5GZG1WdWRDaEZkbVZ1ZEM1T1JWUlhUMUpMWDA5T1RFbE9SU3dnVGtGTlJTd2dleUJrWVhSbE9pQnVaWGNnUkdGMFpTZ3BJSDBwWEc0Z0lIMHBYRzVjYmlBZ2QybHVaRzkzTG1Ga1pFVjJaVzUwVEdsemRHVnVaWElvSjI5bVpteHBibVVuTENBb0tTQTlQaUI3WEc0Z0lDQWdaR2x6Y0dGMFkyaFhhVzVFYjJORmRtVnVkQ2hGZG1WdWRDNU9SVlJYVDFKTFgwOUdSa3hKVGtVc0lFNUJUVVVzSUhzZ1pHRjBaVG9nYm1WM0lFUmhkR1VvS1NCOUtWeHVJQ0I5S1Z4dVhHNGdJQzhxS2x4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb2dRMnhoYzNNZ1JHVm1hVzVwZEdsdmJseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ292WEc1Y2JpQWdZMnhoYzNNZ1RtVjBkMjl5YXlCbGVIUmxibVJ6SUVOdmJYQnZibVZ1ZENCN1hHNGdJQ0FnTHlvcVhHNGdJQ0FnSUNvZ1EzSmxZWFJsY3lCaGJpQnBibk4wWVc1alpTQnZaaUJPWlhSM2IzSnJMbHh1SUNBZ0lDQXFJRUJ3WVhKaGJTQjdlMzE5SUZ0dmNIUnBiMjV6UFh0OVhWeHVJQ0FnSUNBcUwxeHVJQ0FnSUdOdmJuTjBjblZqZEc5eUtHOXdkR2x2Ym5NZ1BTQjdmU2tnZTF4dUlDQWdJQ0FnYzNWd1pYSW9Ua0ZOUlN3Z1ZrVlNVMGxQVGl3Z1JFVkdRVlZNVkY5UVVrOVFSVkpVU1VWVExDQnZjSFJwYjI1ekxDQjBjblZsS1Z4dUlDQWdJQ0FnZEdocGN5NWhaR1JGZG1WdWRITW9LVnh1SUNBZ0lIMWNibHh1SUNBZ0lHRmtaRVYyWlc1MGN5Z3BJSHRjYmlBZ0lDQWdJSGRwYm1SdmR5NWhaR1JGZG1WdWRFeHBjM1JsYm1WeUtDZHZibXhwYm1VdWNHZ3VibVYwZDI5eWF5Y3NJQ2dwSUQwK0lIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1MGNtbG5aMlZ5UlhabGJuUW9SWFpsYm5RdVRrVlVWMDlTUzE5UFRreEpUa1VzSUhzZ1pHRjBaVG9nYm1WM0lFUmhkR1VvS1NCOUxDQjBjblZsS1Z4dUlDQWdJQ0FnZlNsY2JseHVJQ0FnSUNBZ2QybHVaRzkzTG1Ga1pFVjJaVzUwVEdsemRHVnVaWElvSjI5bVpteHBibVV1Y0dndWJtVjBkMjl5YXljc0lDZ3BJRDArSUh0Y2JpQWdJQ0FnSUNBZ2RHaHBjeTUwY21sbloyVnlSWFpsYm5Rb1JYWmxiblF1VGtWVVYwOVNTMTlQUmtaTVNVNUZMQ0I3SUdSaGRHVTZJRzVsZHlCRVlYUmxLQ2tnZlN3Z2RISjFaU2xjYmlBZ0lDQWdJSDBwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdjM1JoZEdsaklGOUVUMDFKYm5SbGNtWmhZMlVvYjNCMGFXOXVjeWtnZTF4dUlDQWdJQ0FnY21WMGRYSnVJSE4xY0dWeUxsOUVUMDFKYm5SbGNtWmhZMlVvVG1WMGQyOXlheXdnYjNCMGFXOXVjeWxjYmlBZ0lDQjlYRzRnSUgxY2JseHVJQ0J5WlhSMWNtNGdUbVYwZDI5eWExeHVmU2tvS1Z4dVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCT1pYUjNiM0pyWEc0aUxDSXZLaXBjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2lCTWFXTmxibk5sWkNCMWJtUmxjaUJOU1ZRZ0tHaDBkSEJ6T2k4dloybDBhSFZpTG1OdmJTOXhkV0Z5YXkxa1pYWXZVR2h2Ym05dUxVWnlZVzFsZDI5eWF5OWliRzlpTDIxaGMzUmxjaTlNU1VORlRsTkZLVnh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxTDF4dVhHNXBiWEJ2Y25RZ1VHRm5aU0JtY205dElDY3VMM0JoWjJVblhHNXBiWEJ2Y25RZ1JYWmxiblFnWm5KdmJTQW5MaTR2TGk0dlkyOXlaUzlsZG1WdWRITW5YRzVjYm1OdmJuTjBJRkJoWjJWeUlEMGdLQ2dwSUQwK0lIdGNiaUFnTHlvcVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaUJEYjI1emRHRnVkSE5jYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUwxeHVYRzRnSUdOdmJuTjBJRTVCVFVVZ1BTQW5jR0ZuWlhJblhHNGdJR052Ym5OMElGWkZVbE5KVDA0Z1BTQW5NaTR3TGpBblhHNGdJR052Ym5OMElFUkZSa0ZWVEZSZlVGSlBVRVZTVkVsRlV5QTlJSHRjYmlBZ0lDQm9ZWE5vVUhKbFptbDRPaUFuSXlFbkxGeHVJQ0FnSUhWelpVaGhjMmc2SUhSeWRXVXNYRzRnSUNBZ1pHVm1ZWFZzZEZCaFoyVTZJRzUxYkd3c1hHNGdJQ0FnWVc1cGJXRjBaVkJoWjJWek9pQjBjblZsTEZ4dUlDQjlYRzVjYmlBZ2JHVjBJR04xY25KbGJuUlFZV2RsWEc0Z0lDOHFLbHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvZ1EyeGhjM01nUkdWbWFXNXBkR2x2Ymx4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb3ZYRzVjYmlBZ1kyeGhjM01nVUdGblpYSWdlMXh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRUJqYjI1emRISjFZM1J2Y2x4dUlDQWdJQ0FxWEc0Z0lDQWdJQ29nUUhCaGNtRnRJRzl3ZEdsdmJuTWdlMDlpYW1WamRIMWNiaUFnSUNBZ0tpOWNiaUFnSUNCamIyNXpkSEoxWTNSdmNpaHZjSFJwYjI1eklEMGdlMzBwSUh0Y2JpQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5QTlJRTlpYW1WamRDNWhjM05wWjI0b1JFVkdRVlZNVkY5UVVrOVFSVkpVU1VWVExDQnZjSFJwYjI1ektWeHVYRzRnSUNBZ0lDQjBhR2x6TG5CaFoyVnpJRDBnVzExY2JpQWdJQ0FnSUhSb2FYTXVjM1JoY25SbFpDQTlJR1poYkhObFhHNWNiaUFnSUNBZ0lDOHZJR0ZrWkNCbmJHOWlZV3dnYkdsemRHVnVaWEp6SUhOMVkyZ2dZWE5vSUdoaGMyZ2dZMmhoYm1kbExDQnVZWFpwWjJGMGFXOXVMQ0JsZEdNdVhHNGdJQ0FnSUNCMGFHbHpMbUZrWkZCaFoyVnlSWFpsYm5SektDbGNibHh1SUNBZ0lDQWdMeThnWm1GemRHVnlJSGRoZVNCMGJ5QnBibWwwSUhCaFoyVnpJR0psWm05eVpTQjBhR1VnUkU5TklHbHpJSEpsWVdSNVhHNGdJQ0FnSUNCMGFHbHpMbTl1UkU5TlRHOWhaR1ZrS0NsY2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2THlCd2NtbDJZWFJsWEc0Z0lDQWdYeWh6Wld4bFkzUnZjaWtnZTF4dUlDQWdJQ0FnY21WMGRYSnVJR1J2WTNWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNJb2MyVnNaV04wYjNJcFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnWjJWMFNHRnphQ2dwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUIzYVc1a2IzY3ViRzlqWVhScGIyNHVhR0Z6YUM1emNHeHBkQ2gwYUdsekxtOXdkR2x2Ym5NdWFHRnphRkJ5WldacGVDbGJNVjFjYmlBZ0lDQjlYRzVjYmlBZ0lDQm5aWFJRWVdkbFJuSnZiVWhoYzJnb0tTQjdYRzRnSUNBZ0lDQmpiMjV6ZENCb1lYTm9JRDBnZEdocGN5NW5aWFJJWVhOb0tDbGNiaUFnSUNBZ0lHTnZibk4wSUhKbElEMGdibVYzSUZKbFowVjRjQ2duV3o5Y1hDOWRLRnRlWEZ3dlhTb3BKeWxjYmlBZ0lDQWdJR052Ym5OMElHMWhkR05vWlhNZ1BTQnlaUzVsZUdWaktHaGhjMmdwWEc1Y2JpQWdJQ0FnSUdsbUlDaHRZWFJqYUdWeklDWW1JRzFoZEdOb1pYTmJNVjBwSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUcxaGRHTm9aWE5iTVYxY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2NtVjBkWEp1SUc1MWJHeGNiaUFnSUNCOVhHNWNiaUFnSUNCelpYUklZWE5vS0hCaFoyVk9ZVzFsS1NCN1hHNGdJQ0FnSUNCM2FXNWtiM2N1Ykc5allYUnBiMjR1YUdGemFDQTlJR0FrZTNSb2FYTXViM0IwYVc5dWN5NW9ZWE5vVUhKbFptbDRmUzhrZTNCaFoyVk9ZVzFsZldCY2JpQWdJQ0I5WEc1Y2JpQWdJQ0JoY21WVFlXMWxVR0ZuWlNod1lXZGxUbUZ0WlRFc0lIQmhaMlZPWVcxbE1pa2dlMXh1SUNBZ0lDQWdZMjl1YzNRZ2NHRm5aVEVnUFNCMGFHbHpMbWRsZEZCaFoyVk5iMlJsYkNod1lXZGxUbUZ0WlRFcFhHNGdJQ0FnSUNCamIyNXpkQ0J3WVdkbE1pQTlJSFJvYVhNdVoyVjBVR0ZuWlUxdlpHVnNLSEJoWjJWT1lXMWxNaWxjYmlBZ0lDQWdJSEpsZEhWeWJpQndZV2RsTVNBbUppQndZV2RsTWlBbUppQndZV2RsTVM1dVlXMWxJRDA5UFNCd1lXZGxNaTV1WVcxbFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnTHlvcVhHNGdJQ0FnSUNvZ1FYUjBZV05vWlhNZ2RHaGxJRzFoYVc0Z1pYWmxiblJ6SUdadmNpQjBjbUZqYTJsdVp5Qm9ZWE5vSUdOb1lXNW5aWE1zWEc0Z0lDQWdJQ29nWTJ4cFkyc2diMjRnYm1GMmFXZGhkR2x2YmlCaWRYUjBiMjV6SUdGdVpDQnNhVzVyY3lCaGJtUWdZbUZqYXlCb2FYTjBiM0o1WEc0Z0lDQWdJQ292WEc0Z0lDQWdZV1JrVUdGblpYSkZkbVZ1ZEhNb0tTQjdYRzRnSUNBZ0lDQmtiMk4xYldWdWRDNWhaR1JGZG1WdWRFeHBjM1JsYm1WeUtDZGpiR2xqYXljc0lHVjJaVzUwSUQwK0lIUm9hWE11YjI1RGJHbGpheWhsZG1WdWRDa3BYRzRnSUNBZ0lDQjNhVzVrYjNjdVlXUmtSWFpsYm5STWFYTjBaVzVsY2lnbmNHOXdjM1JoZEdVbkxDQmxkbVZ1ZENBOVBpQjBhR2x6TG05dVFtRmphMGhwYzNSdmNua29aWFpsYm5RcEtWeHVJQ0FnSUNBZ2QybHVaRzkzTG1Ga1pFVjJaVzUwVEdsemRHVnVaWElvSjJoaGMyaGphR0Z1WjJVbkxDQmxkbVZ1ZENBOVBpQjBhR2x6TG05dVNHRnphRU5vWVc1blpTaGxkbVZ1ZENrcFhHNGdJQ0FnSUNCa2IyTjFiV1Z1ZEM1aFpHUkZkbVZ1ZEV4cGMzUmxibVZ5S0NkRVQwMURiMjUwWlc1MFRHOWhaR1ZrSnl3Z1pYWmxiblFnUFQ0Z2RHaHBjeTV2YmtSUFRVeHZZV1JsWkNobGRtVnVkQ2twWEc0Z0lDQWdmVnh1WEc0Z0lDQWdMeThnWjJWMGRHVnljMXh1WEc0Z0lDQWdjM1JoZEdsaklHZGxkQ0IyWlhKemFXOXVLQ2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVJR0FrZTA1QlRVVjlMaVI3VmtWU1UwbFBUbjFnWEc0Z0lDQWdmVnh1WEc0Z0lDQWdMeThnY0hWaWJHbGpYRzVjYmlBZ0lDQnphRzkzVUdGblpTaHdZV2RsVG1GdFpTd2dZV1JrVkc5SWFYTjBiM0o1SUQwZ2RISjFaU3dnWW1GamF5QTlJR1poYkhObEtTQjdYRzRnSUNBZ0lDQmpiMjV6ZENCdmJHUlFZV2RsSUQwZ2RHaHBjeTVmS0NjdVkzVnljbVZ1ZENjcFhHNGdJQ0FnSUNCcFppQW9iMnhrVUdGblpTa2dlMXh1SUNBZ0lDQWdJQ0JqYjI1emRDQnZiR1JRWVdkbFRtRnRaU0E5SUc5c1pGQmhaMlV1WjJWMFFYUjBjbWxpZFhSbEtDZGtZWFJoTFhCaFoyVW5LVnh1WEc0Z0lDQWdJQ0FnSUdsbUlDaDBhR2x6TG1GeVpWTmhiV1ZRWVdkbEtIQmhaMlZPWVcxbExDQnZiR1JRWVdkbFRtRnRaU2twSUh0Y2JpQWdJQ0FnSUNBZ0lDQnlaWFIxY201Y2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJRzlzWkZCaFoyVXVZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25ZM1Z5Y21WdWRDY3BYRzVjYmlBZ0lDQWdJQ0FnTHk4Z2FHbHpkRzl5ZVZ4dUlDQWdJQ0FnSUNCM2FXNWtiM2N1YUdsemRHOXllUzV5WlhCc1lXTmxVM1JoZEdVb2V5QndZV2RsT2lCdmJHUlFZV2RsVG1GdFpTQjlMQ0J2YkdSUVlXZGxUbUZ0WlN3Z2QybHVaRzkzTG14dlkyRjBhVzl1TG1oeVpXWXBYRzVjYmlBZ0lDQWdJQ0FnZEdocGN5NTBjbWxuWjJWeVVHRm5aVVYyWlc1MEtHOXNaRkJoWjJWT1lXMWxMQ0JGZG1WdWRDNUlTVVJGS1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCMGFHbHpMblJ5YVdkblpYSlFZV2RsUlhabGJuUW9jR0ZuWlU1aGJXVXNJRVYyWlc1MExsTklUMWNwWEc1Y2JpQWdJQ0FnSUdOMWNuSmxiblJRWVdkbElEMGdjR0ZuWlU1aGJXVmNibHh1SUNBZ0lDQWdMeThnYm1WM0lIQmhaMlZjYmlBZ0lDQWdJR052Ym5OMElHNWxkMUJoWjJVZ1BTQjBhR2x6TGw4b1lGdGtZWFJoTFhCaFoyVTlYQ0lrZTNCaFoyVk9ZVzFsZlZ3aVhXQXBYRzVjYmlBZ0lDQWdJRzVsZDFCaFoyVXVZMnhoYzNOTWFYTjBMbUZrWkNnblkzVnljbVZ1ZENjcFhHNWNiaUFnSUNBZ0lDOHZJSFJsYlhCc1lYUmxJR3h2WVdSbGNseHVJQ0FnSUNBZ1kyOXVjM1FnY0dGblpVMXZaR1ZzSUQwZ2RHaHBjeTVuWlhSUVlXZGxUVzlrWld3b2NHRm5aVTVoYldVcFhHNWNiaUFnSUNBZ0lDOHZJRUIwYjJSdk9pQjFjMlVnZEdWdGNHeGhkR1VnWTJGamFHVS9YRzRnSUNBZ0lDQnBaaUFvY0dGblpVMXZaR1ZzSUNZbUlIQmhaMlZOYjJSbGJDNW5aWFJVWlcxd2JHRjBaU2dwS1NCN1hHNGdJQ0FnSUNBZ0lIQmhaMlZOYjJSbGJDNXNiMkZrVkdWdGNHeGhkR1VvS1Z4dUlDQWdJQ0FnZlZ4dUlDQWdJQ0FnTHk4Z1pXNWtYRzVjYmlBZ0lDQWdJR2xtSUNodmJHUlFZV2RsS1NCN1hHNGdJQ0FnSUNBZ0lHTnZibk4wSUc5c1pGQmhaMlZPWVcxbElEMGdiMnhrVUdGblpTNW5aWFJCZEhSeWFXSjFkR1VvSjJSaGRHRXRjR0ZuWlNjcFhHNGdJQ0FnSUNBZ0lDOHZJSFZ6WlNCdlppQndjbTkwYjNSNWNHVXRiM0pwWlc1MFpXUWdiR0Z1WjNWaFoyVmNiaUFnSUNBZ0lDQWdiMnhrVUdGblpTNWlZV05ySUQwZ1ltRmphMXh1SUNBZ0lDQWdJQ0J2YkdSUVlXZGxMbkJ5WlhacGIzVnpVR0ZuWlU1aGJXVWdQU0J2YkdSUVlXZGxUbUZ0WlZ4dVhHNGdJQ0FnSUNBZ0lHTnZibk4wSUc5dVVHRm5aVUZ1YVcxaGRHbHZia1Z1WkNBOUlDZ3BJRDArSUh0Y2JpQWdJQ0FnSUNBZ0lDQnBaaUFvYjJ4a1VHRm5aUzVqYkdGemMweHBjM1F1WTI5dWRHRnBibk1vSjJGdWFXMWhkR1VuS1NrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnYjJ4a1VHRm5aUzVqYkdGemMweHBjM1F1Y21WdGIzWmxLQ2RoYm1sdFlYUmxKeWxjYmlBZ0lDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdJQ0J2YkdSUVlXZGxMbU5zWVhOelRHbHpkQzV5WlcxdmRtVW9iMnhrVUdGblpTNWlZV05ySUQ4Z0ozQnZjQzF3WVdkbEp5QTZJQ2R3ZFhOb0xYQmhaMlVuS1Z4dVhHNGdJQ0FnSUNBZ0lDQWdkR2hwY3k1MGNtbG5aMlZ5VUdGblpVVjJaVzUwS0dOMWNuSmxiblJRWVdkbExDQkZkbVZ1ZEM1VFNFOVhUaWxjYmlBZ0lDQWdJQ0FnSUNCMGFHbHpMblJ5YVdkblpYSlFZV2RsUlhabGJuUW9iMnhrVUdGblpTNXdjbVYyYVc5MWMxQmhaMlZPWVcxbExDQkZkbVZ1ZEM1SVNVUkVSVTRwWEc1Y2JpQWdJQ0FnSUNBZ0lDQnZiR1JRWVdkbExuSmxiVzkyWlVWMlpXNTBUR2x6ZEdWdVpYSW9SWFpsYm5RdVFVNUpUVUZVU1U5T1gwVk9SQ3dnYjI1UVlXZGxRVzVwYldGMGFXOXVSVzVrS1Z4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdhV1lnS0hSb2FYTXViM0IwYVc5dWN5NWhibWx0WVhSbFVHRm5aWE1wSUh0Y2JpQWdJQ0FnSUNBZ0lDQnZiR1JRWVdkbExtRmtaRVYyWlc1MFRHbHpkR1Z1WlhJb1JYWmxiblF1UVU1SlRVRlVTVTlPWDBWT1JDd2diMjVRWVdkbFFXNXBiV0YwYVc5dVJXNWtLVnh1SUNBZ0lDQWdJQ0FnSUc5c1pGQmhaMlV1WTJ4aGMzTk1hWE4wTG1Ga1pDZ25ZVzVwYldGMFpTY3BYRzRnSUNBZ0lDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQWdJQ0FnYjI1UVlXZGxRVzVwYldGMGFXOXVSVzVrS0NsY2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJRzlzWkZCaFoyVXVZMnhoYzNOTWFYTjBMbUZrWkNoaVlXTnJJRDhnSjNCdmNDMXdZV2RsSnlBNklDZHdkWE5vTFhCaFoyVW5LVnh1SUNBZ0lDQWdmVnh1SUNBZ0lIMWNibHh1SUNBZ0lHRmtaRlZ1YVhGMVpWQmhaMlZOYjJSbGJDaHdZV2RsVG1GdFpTa2dlMXh1SUNBZ0lDQWdhV1lnS0NGMGFHbHpMbWRsZEZCaFoyVk5iMlJsYkNod1lXZGxUbUZ0WlNrcElIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1d1lXZGxjeTV3ZFhOb0tHNWxkeUJRWVdkbEtIQmhaMlZPWVcxbEtTbGNiaUFnSUNBZ0lIMWNiaUFnSUNCOVhHNWNiaUFnSUNCblpYUlFZV2RsVFc5a1pXd29jR0ZuWlU1aGJXVXBJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQjBhR2x6TG5CaFoyVnpMbVpwYm1Rb2NHRm5aU0E5UGlCd1lXZGxMbTVoYldVZ1BUMDlJSEJoWjJWT1lXMWxLVnh1SUNBZ0lIMWNibHh1SUNBZ0lHZGxkRkJoWjJWelRXOWtaV3dvY0dGblpVNWhiV1Z6S1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnZEdocGN5NXdZV2RsY3k1bWFXeDBaWElvY0dGblpTQTlQaUJ3WVdkbFRtRnRaWE11YVc1a1pYaFBaaWh3WVdkbExtNWhiV1VwSUQ0Z0xURXBYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MyVnNaV04wYjNKVWIwRnljbUY1S0hOMGNpa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlITjBjaTV6Y0d4cGRDZ25MQ2NwTG0xaGNDaHBkR1Z0SUQwK0lHbDBaVzB1ZEhKcGJTZ3BLVnh1SUNBZ0lIMWNibHh1SUNBZ0lHRmtaRVYyWlc1MGN5aGpZV3hzWW1GamF5a2dlMXh1SUNBZ0lDQWdhV1lnS0hSb2FYTXVZMkZqYUdWUVlXZGxVMlZzWldOMGIzSWdQVDA5SUNjcUp5a2dlMXh1SUNBZ0lDQWdJQ0F2THlCaFpHUWdkRzhnWVd4c0lIQmhaMlVnYlc5a1pXeHpYRzRnSUNBZ0lDQWdJSFJvYVhNdWNHRm5aWE11Wm05eVJXRmphQ2dvY0dGblpTa2dQVDRnZTF4dUlDQWdJQ0FnSUNBZ0lIQmhaMlV1WVdSa1JYWmxiblJEWVd4c1ltRmpheWhqWVd4c1ltRmpheWxjYmlBZ0lDQWdJQ0FnZlNsY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1WEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUdOdmJuTjBJSEJoWjJWTmIyUmxiSE1nUFNCMGFHbHpMbWRsZEZCaFoyVnpUVzlrWld3b2RHaHBjeTV6Wld4bFkzUnZjbFJ2UVhKeVlYa29kR2hwY3k1allXTm9aVkJoWjJWVFpXeGxZM1J2Y2lrc0lIUnlkV1VwWEc0Z0lDQWdJQ0J3WVdkbFRXOWtaV3h6TG1admNrVmhZMmdvS0hCaFoyVXBJRDArSUh0Y2JpQWdJQ0FnSUNBZ2NHRm5aUzVoWkdSRmRtVnVkRU5oYkd4aVlXTnJLR05oYkd4aVlXTnJLVnh1SUNBZ0lDQWdmU2xjYmlBZ0lDQWdJSFJvYVhNdVkyRmphR1ZRWVdkbFUyVnNaV04wYjNJZ1BTQnVkV3hzWEc0Z0lDQWdmVnh1WEc0Z0lDQWdkWE5sVkdWdGNHeGhkR1VvZEdWdGNHeGhkR1ZRWVhSb0xDQnlaVzVrWlhKR2RXNWpkR2x2YmlBOUlHNTFiR3dwSUh0Y2JpQWdJQ0FnSUdOdmJuTjBJSEJoWjJWTmIyUmxiSE1nUFNCMGFHbHpMbWRsZEZCaFoyVnpUVzlrWld3b2RHaHBjeTV6Wld4bFkzUnZjbFJ2UVhKeVlYa29kR2hwY3k1allXTm9aVkJoWjJWVFpXeGxZM1J2Y2lrc0lIUnlkV1VwWEc0Z0lDQWdJQ0J3WVdkbFRXOWtaV3h6TG1admNrVmhZMmdvS0hCaFoyVXBJRDArSUh0Y2JpQWdJQ0FnSUNBZ2NHRm5aUzUxYzJWVVpXMXdiR0YwWlNoMFpXMXdiR0YwWlZCaGRHZ3BYRzRnSUNBZ0lDQWdJR2xtSUNoMGVYQmxiMllnY21WdVpHVnlSblZ1WTNScGIyNGdQVDA5SUNkbWRXNWpkR2x2YmljcElIdGNiaUFnSUNBZ0lDQWdJQ0J3WVdkbExuVnpaVlJsYlhCc1lYUmxVbVZ1WkdWeVpYSW9jbVZ1WkdWeVJuVnVZM1JwYjI0cFhHNGdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lIMHBYRzRnSUNBZ0lDQjBhR2x6TG1OaFkyaGxVR0ZuWlZObGJHVmpkRzl5SUQwZ2JuVnNiRnh1SUNBZ0lIMWNibHh1SUNBZ0lIUnlhV2RuWlhKUVlXZGxSWFpsYm5Rb2NHRm5aVTVoYldVc0lHVjJaVzUwVG1GdFpTd2daWFpsYm5SUVlYSmhiWE1nUFNCdWRXeHNLU0I3WEc0Z0lDQWdJQ0JqYjI1emRDQndZV2RsVFc5a1pXd2dQU0IwYUdsekxtZGxkRkJoWjJWTmIyUmxiQ2h3WVdkbFRtRnRaU2xjYmlBZ0lDQWdJR2xtSUNod1lXZGxUVzlrWld3cElIdGNiaUFnSUNBZ0lDQWdjR0ZuWlUxdlpHVnNMblJ5YVdkblpYSlRZMjl3WlhNb1pYWmxiblJPWVcxbExDQmxkbVZ1ZEZCaGNtRnRjeWxjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzVjYmlBZ0lDQnZia05zYVdOcktHVjJaVzUwS1NCN1hHNGdJQ0FnSUNCamIyNXpkQ0J3WVdkbFRtRnRaU0E5SUdWMlpXNTBMblJoY21kbGRDNW5aWFJCZEhSeWFXSjFkR1VvSjJSaGRHRXRibUYyYVdkaGRHVW5LVnh1SUNBZ0lDQWdZMjl1YzNRZ2NIVnphRkJoWjJVZ1BTQWhLR1YyWlc1MExuUmhjbWRsZEM1blpYUkJkSFJ5YVdKMWRHVW9KMlJoZEdFdGNHOXdMWEJoWjJVbktTQTlQVDBnSjNSeWRXVW5LVnh1WEc0Z0lDQWdJQ0JwWmlBb2NHRm5aVTVoYldVcElIdGNiaUFnSUNBZ0lDQWdhV1lnS0hCaFoyVk9ZVzFsSUQwOVBTQW5KR0poWTJzbktTQjdYRzRnSUNBZ0lDQWdJQ0FnTHk4Z2RHaGxJSEJ2Y0hOMFlYUmxJR1YyWlc1MElIZHBiR3dnWW1VZ2RISnBaMmRsY21Wa1hHNGdJQ0FnSUNBZ0lDQWdkMmx1Wkc5M0xtaHBjM1J2Y25rdVltRmpheWdwWEc0Z0lDQWdJQ0FnSUNBZ2NtVjBkWEp1WEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQXZLbHh1SUNBZ0lDQWdJQ0FnS2lCSlppQjNaU0JvWlNCMWMyVWdkR2hsSUdoaGMyZ2dZWE1nZEhKcFoyZGxjaXhjYmlBZ0lDQWdJQ0FnSUNvZ2QyVWdZMmhoYm1kbElHbDBJR1I1Ym1GdGFXTmhiR3g1SUhOdklIUm9ZWFFnZEdobElHaGhjMmhqYUdGdVoyVWdaWFpsYm5RZ2FYTWdZMkZzYkdWa1hHNGdJQ0FnSUNBZ0lDQXFJRTkwYUdWeWQybHpaU3dnZDJVZ2MyaHZkeUIwYUdVZ2NHRm5aVnh1SUNBZ0lDQWdJQ0FnS2k5Y2JpQWdJQ0FnSUNBZ2FXWWdLSFJvYVhNdWIzQjBhVzl1Y3k1MWMyVklZWE5vS1NCN1hHNGdJQ0FnSUNBZ0lDQWdkR2hwY3k1elpYUklZWE5vS0hCaFoyVk9ZVzFsS1Z4dUlDQWdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNBZ0lIUm9hWE11YzJodmQxQmhaMlVvY0dGblpVNWhiV1VzSUhSeWRXVXNJSEIxYzJoUVlXZGxLVnh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1WEc0Z0lDQWdiMjVDWVdOclNHbHpkRzl5ZVNobGRtVnVkQ0E5SUh0OUtTQjdYRzRnSUNBZ0lDQmpiMjV6ZENCd1lXZGxUbUZ0WlNBOUlHVjJaVzUwTG5OMFlYUmxJRDhnWlhabGJuUXVjM1JoZEdVdWNHRm5aU0E2SUc1MWJHeGNiaUFnSUNBZ0lHbG1JQ2doY0dGblpVNWhiV1VwSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1WEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhSb2FYTXVjMmh2ZDFCaFoyVW9jR0ZuWlU1aGJXVXNJSFJ5ZFdVc0lIUnlkV1VwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdiMjVJWVhOb1EyaGhibWRsS0NrZ2UxeHVJQ0FnSUNBZ1kyOXVjM1FnY0dGeVlXMXpJRDBnS0hSb2FYTXVaMlYwU0dGemFDZ3BJRDhnZEdocGN5NW5aWFJJWVhOb0tDa3VjM0JzYVhRb0p5OG5LU0E2SUZ0ZEtTNW1hV3gwWlhJb2NDQTlQaUJ3TG14bGJtZDBhQ0ErSURBcFhHNGdJQ0FnSUNCcFppQW9jR0Z5WVcxekxteGxibWQwYUNBK0lEQXBJSHRjYmlBZ0lDQWdJQ0FnTHk4Z2NtVnRiM1psSUdacGNuTjBJSFpoYkhWbElIZG9hV05vSUdseklIUm9aU0J3WVdkbElHNWhiV1ZjYmlBZ0lDQWdJQ0FnY0dGeVlXMXpMbk5vYVdaMEtDbGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdkR2hwY3k1MGNtbG5aMlZ5VUdGblpVVjJaVzUwS0dOMWNuSmxiblJRWVdkbExDQkZkbVZ1ZEM1SVFWTklMQ0J3WVhKaGJYTXBYRzVjYmlBZ0lDQWdJR052Ym5OMElHNWhkbEJoWjJVZ1BTQjBhR2x6TG1kbGRGQmhaMlZHY205dFNHRnphQ2dwWEc0Z0lDQWdJQ0JwWmlBb2JtRjJVR0ZuWlNrZ2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TG5Ob2IzZFFZV2RsS0c1aGRsQmhaMlVwWEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1WEc0Z0lDQWdMeW9xWEc0Z0lDQWdJQ29nVVhWbGNtbGxjeUIwYUdVZ2NHRm5aU0J1YjJSbGN5QnBiaUIwYUdVZ1JFOU5YRzRnSUNBZ0lDb3ZYRzRnSUNBZ2IyNUVUMDFNYjJGa1pXUW9LU0I3WEc0Z0lDQWdJQ0JqYjI1emRDQndZV2RsY3lBOUlHUnZZM1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0pCYkd3b0oxdGtZWFJoTFhCaFoyVmRKeWxjYmx4dUlDQWdJQ0FnYVdZZ0tDRndZV2RsY3lrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY201Y2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2NHRm5aWE11Wm05eVJXRmphQ2dvY0dGblpTa2dQVDRnZTF4dUlDQWdJQ0FnSUNCc1pYUWdjR0ZuWlU1aGJXVWdQU0J3WVdkbExtZGxkRUYwZEhKcFluVjBaU2duWkdGMFlTMXdZV2RsSnlsY2JpQWdJQ0FnSUNBZ0x5cGNiaUFnSUNBZ0lDQWdJQ29nZEdobElIQmhaMlVnYm1GdFpTQmpZVzRnWW1VZ1oybDJaVzRnZDJsMGFDQjBhR1VnWVhSMGNtbGlkWFJsSUdSaGRHRXRjR0ZuWlZ4dUlDQWdJQ0FnSUNBZ0tpQnZjaUIzYVhSb0lHbDBjeUJ1YjJSbElHNWhiV1ZjYmlBZ0lDQWdJQ0FnSUNvdlhHNGdJQ0FnSUNBZ0lHbG1JQ2doY0dGblpVNWhiV1VwSUh0Y2JpQWdJQ0FnSUNBZ0lDQndZV2RsVG1GdFpTQTlJSEJoWjJVdWJtOWtaVTVoYldWY2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJSFJvYVhNdVlXUmtWVzVwY1hWbFVHRm5aVTF2WkdWc0tIQmhaMlZPWVcxbEtWeHVJQ0FnSUNBZ2ZTbGNiaUFnSUNCOVhHNWNiaUFnSUNCelpXeGxZM1FvY0dGblpVNWhiV1VzSUdGa1pGQmhaMlZOYjJSbGJDQTlJSFJ5ZFdVcElIdGNiaUFnSUNBZ0lIUm9hWE11WTJGamFHVlFZV2RsVTJWc1pXTjBiM0lnUFNCd1lXZGxUbUZ0WlZ4dVhHNGdJQ0FnSUNCcFppQW9ZV1JrVUdGblpVMXZaR1ZzSUNZbUlIQmhaMlZPWVcxbElDRTlQU0FuS2ljcElIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1aFpHUlZibWx4ZFdWUVlXZGxUVzlrWld3b2NHRm5aVTVoYldVcFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lISmxkSFZ5YmlCMGFHbHpYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MzUmhjblFvWm05eVkyVkVaV1poZFd4MFVHRm5aU0E5SUdaaGJITmxLU0I3WEc0Z0lDQWdJQ0F2THlCamFHVmpheUJwWmlCMGFHVWdZWEJ3SUdoaGN5QmlaV1Z1SUdGc2NtVmhaSGtnYzNSaGNuUmxaRnh1SUNBZ0lDQWdhV1lnS0hSb2FYTXVjM1JoY25SbFpDa2dlMXh1SUNBZ0lDQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9ZQ1I3VGtGTlJYMHVJRlJvWlNCaGNIQWdhR0Z6SUdKbFpXNGdZV3h5WldGa2VTQnpkR0Z5ZEdWa0xtQXBYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSFJvYVhNdWMzUmhjblJsWkNBOUlIUnlkV1ZjYmx4dUlDQWdJQ0FnTHk4Z1ptOXlZMlVnWkdWbVlYVnNkQ0J3WVdkbElHOXVJRU52Y21SdmRtRmNiaUFnSUNBZ0lHbG1JQ2gzYVc1a2IzY3VZMjl5Wkc5MllTa2dlMXh1SUNBZ0lDQWdJQ0JtYjNKalpVUmxabUYxYkhSUVlXZGxJRDBnZEhKMVpWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQnNaWFFnY0dGblpVNWhiV1VnUFNCMGFHbHpMbWRsZEZCaFoyVkdjbTl0U0dGemFDZ3BYRzRnSUNBZ0lDQnBaaUFvSVhSb2FYTXVaMlYwVUdGblpVMXZaR1ZzS0hCaFoyVk9ZVzFsS1NrZ2UxeHVJQ0FnSUNBZ0lDQndZV2RsVG1GdFpTQTlJSFJvYVhNdWIzQjBhVzl1Y3k1a1pXWmhkV3gwVUdGblpWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQnBaaUFvWm05eVkyVkVaV1poZFd4MFVHRm5aU0FtSmlBaGRHaHBjeTV2Y0hScGIyNXpMbVJsWm1GMWJIUlFZV2RsS1NCN1hHNGdJQ0FnSUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2loZ0pIdE9RVTFGZlM0Z1ZHaGxJR1JsWm1GMWJIUWdjR0ZuWlNCdGRYTjBJR1Y0YVhOMElHWnZjaUJtYjNKamFXNW5JR2wwY3lCc1lYVnVZMmdoWUNsY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0x5OGdURzluSUhSb1pTQmtaWFpwWTJVZ2FXNW1iMXh1SUNBZ0lDQWdhV1lnS0hCb2IyNXZiaTVrWldKMVp5a2dlMXh1SUNBZ0lDQWdJQ0JqYjI1emIyeGxMbXh2WnlnblUzUmhjblJwYm1jZ1VHaHZibTl1SUdsdUlDY2dLeUJ3YkdGMFptOXliUzVrWlhOamNtbHdkR2x2YmlsY2JpQWdJQ0FnSUNBZ1kyOXVjMjlzWlM1c2IyY29kR2hwY3k1d1lXZGxjeTVzWlc1bmRHZ2dLeUFuSUhCaFoyVnpJR1p2ZFc1a0p5bGNiaUFnSUNBZ0lDQWdZMjl1YzI5c1pTNXNiMmNvSjB4dllXUnBibWNnSnlBcklIQmhaMlZPWVcxbEtWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQXZLbHh1SUNBZ0lDQWdJQ29nYVdZZ2RHaGxJR0Z3Y0NCcGN5QmpiMjVtYVdkMWNtRjBaV1FnZEc4Z2RYTmxJR2hoYzJnZ2RISmhZMnRwYm1kY2JpQWdJQ0FnSUNBcUlIZGxJR0ZrWkNCMGFHVWdjR0ZuWlNCa2VXNWhiV2xqWVd4c2VTQnBiaUIwYUdVZ2RYSnNYRzRnSUNBZ0lDQWdLaTljYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbTl3ZEdsdmJuTXVkWE5sU0dGemFDa2dlMXh1SUNBZ0lDQWdJQ0IwYUdsekxuTmxkRWhoYzJnb2NHRm5aVTVoYldVcFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lIUm9hWE11YzJodmQxQmhaMlVvWm05eVkyVkVaV1poZFd4MFVHRm5aU0EvSUhSb2FYTXViM0IwYVc5dWN5NWtaV1poZFd4MFVHRm5aU0E2SUhCaFoyVk9ZVzFsS1Z4dUlDQWdJSDFjYmx4dUlDQWdJQzh2SUhOMFlYUnBZMXh1SUNBZ0lITjBZWFJwWXlCZlJFOU5TVzUwWlhKbVlXTmxLRzl3ZEdsdmJuTXBJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQnVaWGNnVUdGblpYSW9iM0IwYVc5dWN5bGNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQnlaWFIxY200Z1VHRm5aWEpjYm4wcEtDbGNibHh1Wlhod2IzSjBJR1JsWm1GMWJIUWdVR0ZuWlhKY2JpSXNJaThxS2x4dUlDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBcUlFeHBZMlZ1YzJWa0lIVnVaR1Z5SUUxSlZDQW9hSFIwY0hNNkx5OW5hWFJvZFdJdVkyOXRMM0YxWVhKckxXUmxkaTlRYUc5dWIyNHRSbkpoYldWM2IzSnJMMkpzYjJJdmJXRnpkR1Z5TDB4SlEwVk9VMFVwWEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvdlhHNWNibWx0Y0c5eWRDQjdJR3h2WVdSR2FXeGxJSDBnWm5KdmJTQW5MaTR2ZFhScGJITW5YRzVwYlhCdmNuUWdleUJrYVhOd1lYUmphRkJoWjJWRmRtVnVkQ0I5SUdaeWIyMGdKeTR1TDJWMlpXNTBjeTlrYVhOd1lYUmphQ2RjYmx4dVkyOXVjM1FnVUdGblpTQTlJQ2dvS1NBOVBpQjdYRzRnSUM4cUtseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ29nUTI5dWMzUmhiblJ6WEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpOWNibHh1SUNCamIyNXpkQ0JPUVUxRklEMGdKM0JoWjJVblhHNGdJR052Ym5OMElGWkZVbE5KVDA0Z1BTQW5NaTR3TGpBblhHNWNiaUFnWTI5dWMzUWdWRVZOVUV4QlZFVmZVMFZNUlVOVVQxSWdQU0FuVzJSaGRHRXRkR1Z0Y0d4aGRHVmRKMXh1WEc0Z0lDOHFLbHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvZ1EyeGhjM01nUkdWbWFXNXBkR2x2Ymx4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb3ZYRzVjYmlBZ1kyeGhjM01nVUdGblpTQjdYRzRnSUNBZ0x5b3FYRzRnSUNBZ0lDb2dRM0psWVhSbGN5QmhiaUJwYm5OMFlXNWpaU0J2WmlCUVlXZGxMbHh1SUNBZ0lDQXFJRUJ3WVhKaGJTQjdjM1J5YVc1bmZTQndZV2RsVG1GdFpWeHVJQ0FnSUNBcUwxeHVJQ0FnSUdOdmJuTjBjblZqZEc5eUtIQmhaMlZPWVcxbEtTQjdYRzRnSUNBZ0lDQjBhR2x6TG01aGJXVWdQU0J3WVdkbFRtRnRaVnh1SUNBZ0lDQWdkR2hwY3k1bGRtVnVkSE1nUFNCYlhWeHVJQ0FnSUNBZ2RHaHBjeTUwWlcxd2JHRjBaVkJoZEdnZ1BTQnVkV3hzWEc0Z0lDQWdJQ0IwYUdsekxuSmxibVJsY2taMWJtTjBhVzl1SUQwZ2JuVnNiRnh1SUNBZ0lIMWNibHh1SUNBZ0lDOHZJR2RsZEhSbGNuTmNibHh1SUNBZ0lITjBZWFJwWXlCblpYUWdkbVZ5YzJsdmJpZ3BJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQmdKSHRPUVUxRmZTNGtlMVpGVWxOSlQwNTlZRnh1SUNBZ0lIMWNibHh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRWRsZENCbGRtVnVkSE5jYmlBZ0lDQWdLaUJBY21WMGRYSnVjeUI3Um5WdVkzUnBiMjViWFgxY2JpQWdJQ0FnS2k5Y2JpQWdJQ0JuWlhSRmRtVnVkSE1vS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnZEdocGN5NWxkbVZ1ZEhOY2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2S2lwY2JpQWdJQ0FnS2lCSFpYUWdkR1Z0Y0d4aGRHVmNiaUFnSUNBZ0tpQkFjbVYwZFhKdWN5QjdjM1J5YVc1bmZWeHVJQ0FnSUNBcUwxeHVJQ0FnSUdkbGRGUmxiWEJzWVhSbEtDa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlIUm9hWE11ZEdWdGNHeGhkR1ZRWVhSb1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnTHlvcVhHNGdJQ0FnSUNvZ1IyVjBJSEpsYm1SbGNpQm1kVzVqZEdsdmJseHVJQ0FnSUNBcUlFQnlaWFIxY201eklIdEdkVzVqZEdsdmJuMWNiaUFnSUNBZ0tpOWNiaUFnSUNCblpYUlNaVzVrWlhKR2RXNWpkR2x2YmlncElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCMGFHbHpMbkpsYm1SbGNrWjFibU4wYVc5dVhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYkc5aFpGUmxiWEJzWVhSbEtDa2dlMXh1SUNBZ0lDQWdZMjl1YzNRZ2NHRm5aVVZzWlcxbGJuUWdQU0JrYjJOMWJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eUtHQmJaR0YwWVMxd1lXZGxQVndpSkh0MGFHbHpMbTVoYldWOVhDSmRZQ2xjYmx4dUlDQWdJQ0FnYkc5aFpFWnBiR1VvZEdocGN5NW5aWFJVWlcxd2JHRjBaU2dwTENBb2RHVnRjR3hoZEdVcElEMCtJSHRjYmlBZ0lDQWdJQ0FnYkdWMElISmxibVJsY2lBOUlHWjFibU4wYVc5dUlDaEVUMDFRWVdkbExDQjBaVzF3YkdGMFpTd2daV3hsYldWdWRITXBJSHRjYmlBZ0lDQWdJQ0FnSUNCcFppQW9aV3hsYldWdWRITXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lHVnNaVzFsYm5SekxtWnZja1ZoWTJnb0tHVnNLU0E5UGlCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUdWc0xtbHVibVZ5U0ZSTlRDQTlJSFJsYlhCc1lYUmxYRzRnSUNBZ0lDQWdJQ0FnSUNCOUtWeHVJQ0FnSUNBZ0lDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCRVQwMVFZV2RsTG1sdWJtVnlTRlJOVENBOUlIUmxiWEJzWVhSbFhHNGdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ2FXWWdLSFJvYVhNdVoyVjBVbVZ1WkdWeVJuVnVZM1JwYjI0b0tTa2dlMXh1SUNBZ0lDQWdJQ0FnSUhKbGJtUmxjaUE5SUhSb2FYTXVaMlYwVW1WdVpHVnlSblZ1WTNScGIyNG9LVnh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ2NtVnVaR1Z5S0hCaFoyVkZiR1Z0Wlc1MExDQjBaVzF3YkdGMFpTd2djR0ZuWlVWc1pXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNrRnNiQ2hVUlUxUVRFRlVSVjlUUlV4RlExUlBVaWtwWEc0Z0lDQWdJQ0I5TENCdWRXeHNLVnh1SUNBZ0lIMWNibHh1SUNBZ0lDOHZJSEIxWW14cFkxeHVYRzRnSUNBZ0x5b3FYRzRnSUNBZ0lDcGNiaUFnSUNBZ0tpQkFjR0Z5WVcwZ2V5cDlJR05oYkd4aVlXTnJSbTVjYmlBZ0lDQWdLaTljYmlBZ0lDQmhaR1JGZG1WdWRFTmhiR3hpWVdOcktHTmhiR3hpWVdOclJtNHBJSHRjYmlBZ0lDQWdJSFJvYVhNdVpYWmxiblJ6TG5CMWMyZ29ZMkZzYkdKaFkydEdiaWxjYmlBZ0lDQjlYRzVjYmlBZ0lDQXZLaXBjYmlBZ0lDQWdLaUJWYzJVZ2RHaGxJR2RwZG1WdUlIUmxiWEJzWVhSbFhHNGdJQ0FnSUNwY2JpQWdJQ0FnS2lCQWNHRnlZVzBnZTNOMGNtbHVaMzBnZEdWdGNHeGhkR1ZRWVhSb1hHNGdJQ0FnSUNvdlhHNGdJQ0FnZFhObFZHVnRjR3hoZEdVb2RHVnRjR3hoZEdWUVlYUm9LU0I3WEc0Z0lDQWdJQ0JwWmlBb2RIbHdaVzltSUhSbGJYQnNZWFJsVUdGMGFDQWhQVDBnSjNOMGNtbHVaeWNwSUh0Y2JpQWdJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0NkVWFHVWdkR1Z0Y0d4aGRHVWdjR0YwYUNCdGRYTjBJR0psSUdFZ2MzUnlhVzVuTGlBbklDc2dkSGx3Wlc5bUlIUmxiWEJzWVhSbFVHRjBhQ0FySUNjZ2FYTWdaMmwyWlc0bktWeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2RHaHBjeTUwWlcxd2JHRjBaVkJoZEdnZ1BTQjBaVzF3YkdGMFpWQmhkR2hjYmlBZ0lDQjlYRzVjYmlBZ0lDQXZLaXBjYmlBZ0lDQWdLaUJWYzJVZ2RHaGxJR2RwZG1WdUlIUmxiWEJzWVhSbElISmxibVJsY21WeVhHNGdJQ0FnSUNvZ1FIQmhjbUZ0SUh0R2RXNWpkR2x2Ym4wZ2NtVnVaR1Z5Um5WdVkzUnBiMjVjYmlBZ0lDQWdLaTljYmlBZ0lDQjFjMlZVWlcxd2JHRjBaVkpsYm1SbGNtVnlLSEpsYm1SbGNrWjFibU4wYVc5dUtTQjdYRzRnSUNBZ0lDQnBaaUFvZEhsd1pXOW1JSEpsYm1SbGNrWjFibU4wYVc5dUlDRTlQU0FuWm5WdVkzUnBiMjRuS1NCN1hHNGdJQ0FnSUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2lnblZHaGxJR04xYzNSdmJTQjBaVzF3YkdGMFpTQnlaVzVrWlhKbGNpQnRkWE4wSUdKbElHRWdablZ1WTNScGIyNHVJQ2NnS3lCMGVYQmxiMllnY21WdVpHVnlSblZ1WTNScGIyNGdLeUFuSUdseklHZHBkbVZ1SnlsY2JpQWdJQ0FnSUgxY2JpQWdJQ0FnSUhSb2FYTXVjbVZ1WkdWeVJuVnVZM1JwYjI0Z1BTQnlaVzVrWlhKR2RXNWpkR2x2Ymx4dUlDQWdJSDFjYmx4dUlDQWdJQzhxS2x4dUlDQWdJQ0FxSUZSeWFXZG5aWElnYzJOdmNHVnpYRzRnSUNBZ0lDb2dRSEJoY21GdElIdHpkSEpwYm1kOUlHVjJaVzUwVG1GdFpWeHVJQ0FnSUNBcUlFQndZWEpoYlNCN2UzMTlJRnRsZG1WdWRGQmhjbUZ0Y3oxN2ZWMWNiaUFnSUNBZ0tpOWNiaUFnSUNCMGNtbG5aMlZ5VTJOdmNHVnpLR1YyWlc1MFRtRnRaU3dnWlhabGJuUlFZWEpoYlhNZ1BTQjdmU2tnZTF4dUlDQWdJQ0FnWTI5dWMzUWdaWFpsYm5ST1lXMWxRV3hwWVhNZ1BTQmdiMjRrZTJWMlpXNTBUbUZ0WlM1amFHRnlRWFFvTUNrdWRHOVZjSEJsY2tOaGMyVW9LWDBrZTJWMlpXNTBUbUZ0WlM1emJHbGpaU2d4S1gxZ1hHNWNiaUFnSUNBZ0lIUm9hWE11WlhabGJuUnpMbVp2Y2tWaFkyZ29LSE5qYjNCbEtTQTlQaUI3WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJSE5qYjNCbFJYWmxiblFnUFNCelkyOXdaVnRsZG1WdWRFNWhiV1ZkWEc0Z0lDQWdJQ0FnSUdOdmJuTjBJSE5qYjNCbFJYWmxiblJCYkdsaGN5QTlJSE5qYjNCbFcyVjJaVzUwVG1GdFpVRnNhV0Z6WFZ4dUlDQWdJQ0FnSUNCcFppQW9kSGx3Wlc5bUlITmpiM0JsUlhabGJuUWdQVDA5SUNkbWRXNWpkR2x2YmljcElIdGNiaUFnSUNBZ0lDQWdJQ0J6WTI5d1pVVjJaVzUwTG1Gd2NHeDVLSFJvYVhNc0lHVjJaVzUwVUdGeVlXMXpLVnh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ0x5OGdkSEpwWjJkbGNpQjBhR1VnWlhabGJuUWdZV3hwWVhOY2JpQWdJQ0FnSUNBZ2FXWWdLSFI1Y0dWdlppQnpZMjl3WlVWMlpXNTBRV3hwWVhNZ1BUMDlJQ2RtZFc1amRHbHZiaWNwSUh0Y2JpQWdJQ0FnSUNBZ0lDQnpZMjl3WlVWMlpXNTBRV3hwWVhNdVlYQndiSGtvZEdocGN5d2daWFpsYm5SUVlYSmhiWE1wWEc0Z0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUgwcFhHNWNiaUFnSUNBZ0lHUnBjM0JoZEdOb1VHRm5aVVYyWlc1MEtHVjJaVzUwVG1GdFpTd2dkR2hwY3k1dVlXMWxMQ0JsZG1WdWRGQmhjbUZ0Y3lsY2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNCeVpYUjFjbTRnVUdGblpWeHVmU2tvS1Z4dVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCUVlXZGxYRzRpTENJdktseHVJQ29nVlhObElHOW1JSEJzWVhSbWIzSnRMbXB6WEc0Z0tpQm9kSFJ3Y3pvdkwyZHBkR2gxWWk1amIyMHZZbVZ6ZEdsbGFuTXZjR3hoZEdadmNtMHVhbk5jYmlBcUlFeHBZMlZ1YzJVNklHaDBkSEJ6T2k4dloybDBhSFZpTG1OdmJTOWlaWE4wYVdWcWN5OXdiR0YwWm05eWJTNXFjeTlpYkc5aUwyMWhjM1JsY2k5TVNVTkZUbE5GWEc0Z0tpOWNibWx0Y0c5eWRDQndiR0YwWm05eWJTQm1jbTl0SUNkd2JHRjBabTl5YlNkY2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ2NHeGhkR1p2Y20xY2JpSXNJbHh1Wlhod2IzSjBJR1oxYm1OMGFXOXVJR3h2WVdSR2FXeGxLSFZ5YkN3Z1ptNHNJSEJ2YzNSRVlYUmhLU0I3WEc0Z0lHTnZibk4wSUhKbGNTQTlJRzVsZHlCWVRVeElkSFJ3VW1WeGRXVnpkQ2dwWEc0Z0lHbG1JQ2h5WlhFdWIzWmxjbkpwWkdWTmFXMWxWSGx3WlNrZ2NtVnhMbTkyWlhKeWFXUmxUV2x0WlZSNWNHVW9KM1JsZUhRdmFIUnRiRHNnWTJoaGNuTmxkRDExZEdZdE9DY3BYRzRnSUhKbGNTNXZibkpsWVdSNWMzUmhkR1ZqYUdGdVoyVWdQU0FvS1NBOVBpQjdYRzRnSUNBZ2FXWWdLSEpsY1M1eVpXRmtlVk4wWVhSbElEMDlQU0EwSUNZbUlDaHdZWEp6WlVsdWRDaHlaWEV1YzNSaGRIVnpLU0E5UFQwZ01qQXdJSHg4SUNGeVpYRXVjM1JoZEhWeklDWW1JSEpsY1M1eVpYTndiMjV6WlZSbGVIUXViR1Z1WjNSb0tTa2dlMXh1SUNBZ0lDQWdabTRvY21WeExuSmxjM0J2Ym5ObFZHVjRkQ2xjYmlBZ0lDQjlYRzRnSUgxY2JseHVJQ0JwWmlBb2RIbHdaVzltSUhCdmMzUkVZWFJoSUNFOVBTQW5jM1J5YVc1bkp5a2dlMXh1SUNBZ0lISmxjUzV2Y0dWdUtDZEhSVlFuTENCMWNtd3NJSFJ5ZFdVcFhHNGdJQ0FnY21WeExuTmxibVFvSnljcFhHNGdJSDBnWld4elpTQjdYRzRnSUNBZ2NtVnhMbTl3Wlc0b0oxQlBVMVFuTENCMWNtd3NJSFJ5ZFdVcFhHNGdJQ0FnY21WeExuTmxkRkpsY1hWbGMzUklaV0ZrWlhJb0owTnZiblJsYm5RdGRIbHdaU2NzSUNkaGNIQnNhV05oZEdsdmJpOTRMWGQzZHkxbWIzSnRMWFZ5YkdWdVkyOWtaV1FuS1Z4dUlDQWdJSEpsY1M1elpXNWtLSEJ2YzNSRVlYUmhLVnh1SUNCOVhHNTlYRzVjYm1WNGNHOXlkQ0JtZFc1amRHbHZiaUJuWlc1bGNtRjBaVWxrS0NrZ2UxeHVJQ0J5WlhSMWNtNGdUV0YwYUM1eVlXNWtiMjBvS1M1MGIxTjBjbWx1Wnlnek5pa3VjM1ZpYzNSeUtESXNJREV3S1Z4dWZWeHVYRzVsZUhCdmNuUWdablZ1WTNScGIyNGdabWx1WkZSaGNtZGxkRUo1UTJ4aGMzTW9kR0Z5WjJWMExDQndZWEpsYm5SRGJHRnpjeWtnZTF4dUlDQm1iM0lnS0RzZ2RHRnlaMlYwSUNZbUlIUmhjbWRsZENBaFBUMGdaRzlqZFcxbGJuUTdJSFJoY21kbGRDQTlJSFJoY21kbGRDNXdZWEpsYm5ST2IyUmxLU0I3WEc0Z0lDQWdhV1lnS0hSaGNtZGxkQzVqYkdGemMweHBjM1F1WTI5dWRHRnBibk1vY0dGeVpXNTBRMnhoYzNNcEtTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z2RHRnlaMlYwWEc0Z0lDQWdmVnh1SUNCOVhHNWNiaUFnY21WMGRYSnVJRzUxYkd4Y2JuMWNibHh1WEc1bGVIQnZjblFnWm5WdVkzUnBiMjRnWm1sdVpGUmhjbWRsZEVKNVNXUW9kR0Z5WjJWMExDQndZWEpsYm5SSlpDa2dlMXh1SUNCbWIzSWdLRHNnZEdGeVoyVjBJQ1ltSUhSaGNtZGxkQ0FoUFQwZ1pHOWpkVzFsYm5RN0lIUmhjbWRsZENBOUlIUmhjbWRsZEM1d1lYSmxiblJPYjJSbEtTQjdYRzRnSUNBZ2FXWWdLSFJoY21kbGRDNW5aWFJCZEhSeWFXSjFkR1VvSjJsa0p5a2dQVDA5SUhCaGNtVnVkRWxrS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnZEdGeVoyVjBYRzRnSUNBZ2ZWeHVJQ0I5WEc1Y2JpQWdjbVYwZFhKdUlHNTFiR3hjYm4xY2JseHVaWGh3YjNKMElHWjFibU4wYVc5dUlHWnBibVJVWVhKblpYUkNlVUYwZEhJb2RHRnlaMlYwTENCaGRIUnlLU0I3WEc0Z0lHWnZjaUFvT3lCMFlYSm5aWFFnSmlZZ2RHRnlaMlYwSUNFOVBTQmtiMk4xYldWdWREc2dkR0Z5WjJWMElEMGdkR0Z5WjJWMExuQmhjbVZ1ZEU1dlpHVXBJSHRjYmlBZ0lDQnBaaUFvZEdGeVoyVjBMbWRsZEVGMGRISnBZblYwWlNoaGRIUnlLU0FoUFQwZ2JuVnNiQ2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVJSFJoY21kbGRGeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lISmxkSFZ5YmlCdWRXeHNYRzU5WEc0aUxDSXZLaXBjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2lCTWFXTmxibk5sWkNCMWJtUmxjaUJOU1ZRZ0tHaDBkSEJ6T2k4dloybDBhSFZpTG1OdmJTOXhkV0Z5YXkxa1pYWXZVR2h2Ym05dUxVWnlZVzFsZDI5eWF5OWliRzlpTDIxaGMzUmxjaTlNU1VORlRsTkZLVnh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxTDF4dVhHNHZMeUJqYjNKbFhHNXBiWEJ2Y25RZ1VHRm5aWElnWm5KdmJTQW5MaTlqYjNKbEwzQmhaMlZ5TDJsdVpHVjRKMXh1YVcxd2IzSjBJRUZxWVhnZ1puSnZiU0FuTGk5amIzSmxMMkZxWVhnblhHNXBiWEJ2Y25RZ2NHeGhkR1p2Y20wZ1puSnZiU0FuTGk5amIzSmxMM0JzWVhSbWIzSnRKMXh1YVcxd2IzSjBJRWx1ZEd3Z1puSnZiU0FuTGk5amIzSmxMMmx1ZEd3blhHNXBiWEJ2Y25RZ1RtVjBkMjl5YXlCbWNtOXRJQ2N1TDJOdmNtVXZibVYwZDI5eWF5ZGNibHh1THk4Z1kyOXRjRzl1Wlc1MGMxeHVhVzF3YjNKMElFUnBZV3h2WnlCbWNtOXRJQ2N1TDJOdmJYQnZibVZ1ZEhNdlpHbGhiRzluSjF4dWFXMXdiM0owSUU1dmRHbG1hV05oZEdsdmJpQm1jbTl0SUNjdUwyTnZiWEJ2Ym1WdWRITXZibTkwYVdacFkyRjBhVzl1SjF4dWFXMXdiM0owSUVOdmJHeGhjSE5sSUdaeWIyMGdKeTR2WTI5dGNHOXVaVzUwY3k5amIyeHNZWEJ6WlNkY2JtbHRjRzl5ZENCQlkyTnZjbVJwYjI0Z1puSnZiU0FuTGk5amIyMXdiMjVsYm5SekwyRmpZMjl5WkdsdmJpZGNibWx0Y0c5eWRDQlVZV0lnWm5KdmJTQW5MaTlqYjIxd2IyNWxiblJ6TDNSaFlpZGNibWx0Y0c5eWRDQlFjbTluY21WemN5Qm1jbTl0SUNjdUwyTnZiWEJ2Ym1WdWRITXZjSEp2WjNKbGMzTW5YRzVwYlhCdmNuUWdURzloWkdWeUlHWnliMjBnSnk0dlkyOXRjRzl1Wlc1MGN5OXNiMkZrWlhJblhHNXBiWEJ2Y25RZ1QyWm1RMkZ1ZG1GeklHWnliMjBnSnk0dlkyOXRjRzl1Wlc1MGN5OXZabVl0WTJGdWRtRnpKMXh1YVcxd2IzSjBJRVJ5YjNCa2IzZHVJR1p5YjIwZ0p5NHZZMjl0Y0c5dVpXNTBjeTlrY205d1pHOTNiaWRjYmx4dVkyOXVjM1FnWVhCcElEMGdlMzFjYmx4dUx5b3FYRzRnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQXFJRU52Ym1acFozVnlZWFJwYjI1Y2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvdlhHNWhjR2t1WTI5dVptbG5JRDBnZTF4dUlDQXZMeUJuYkc5aVlXd2dZMjl1Wm1sblhHNGdJR1JsWW5Wbk9pQjBjblZsTEZ4dWZWeHVYRzR2S2lwY2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvZ1VHRm5aWEpjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ292WEc1aGNHa3VjR0ZuWlhJZ1BTQW9iM0IwYVc5dWN5a2dQVDRnZTF4dUlDQnBaaUFvZEhsd1pXOW1JR0Z3YVM1ZmNHRm5aWElnUFQwOUlDZDFibVJsWm1sdVpXUW5LU0I3WEc0Z0lDQWdZWEJwTGw5d1lXZGxjaUE5SUZCaFoyVnlMbDlFVDAxSmJuUmxjbVpoWTJVb2IzQjBhVzl1Y3lsY2JpQWdmVnh1SUNCeVpYUjFjbTRnWVhCcExsOXdZV2RsY2x4dWZWeHVYRzR2S2lwY2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvZ1VHeGhkR1p2Y20xY2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvdlhHNWNibUZ3YVM1d2JHRjBabTl5YlNBOUlIQnNZWFJtYjNKdFhHNWNiaThxS2x4dUlDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2lCQmFtRjRYRzRnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQXFMMXh1WVhCcExtRnFZWGdnUFNCQmFtRjRMbDlFVDAxSmJuUmxjbVpoWTJWY2JseHVMeW9xWEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxSUVsdWRHeGNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDb3ZYRzVoY0drdWFXNTBiQ0E5SUVsdWRHd3VYMFJQVFVsdWRHVnlabUZqWlZ4dVhHNHZLaXBjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ29nVG1WMGQyOXlhMXh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaTljYm1Gd2FTNXVaWFIzYjNKcklEMGdUbVYwZDI5eWF5NWZSRTlOU1c1MFpYSm1ZV05sWEc1Y2JpOHFLbHh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaUJPYjNScFptbGpZWFJwYjI1Y2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvdlhHNWhjR2t1Ym05MGFXWnBZMkYwYVc5dUlEMGdUbTkwYVdacFkyRjBhVzl1TGw5RVQwMUpiblJsY21aaFkyVmNibHh1THlvcVhHNGdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBcUlFUnBZV3h2WjF4dUlDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2k5Y2JtRndhUzVrYVdGc2IyY2dQU0JFYVdGc2IyY3VYMFJQVFVsdWRHVnlabUZqWlZ4dVhHNHZLaXBjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ29nUTI5c2JHRndjMlZjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ292WEc1aGNHa3VZMjlzYkdGd2MyVWdQU0JEYjJ4c1lYQnpaUzVmUkU5TlNXNTBaWEptWVdObFhHNWNiaThxS2x4dUlDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2lCQlkyTnZjbVJwYjI1Y2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvdlhHNWhjR2t1WVdOamIzSmthVzl1SUQwZ1FXTmpiM0prYVc5dUxsOUVUMDFKYm5SbGNtWmhZMlZjYmx4dVhHNHZLaXBjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ29nVkdGaVhHNGdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBcUwxeHVZWEJwTG5SaFlpQTlJRlJoWWk1ZlJFOU5TVzUwWlhKbVlXTmxYRzVjYmk4cUtseHVJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0tpQlFjbTluY21WemMxeHVJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0tpOWNibUZ3YVM1d2NtOW5jbVZ6Y3lBOUlGQnliMmR5WlhOekxsOUVUMDFKYm5SbGNtWmhZMlZjYmx4dUx5b3FYRzRnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQXFJRXh2WVdSbGNseHVJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0tpOWNibUZ3YVM1c2IyRmtaWElnUFNCTWIyRmtaWEl1WDBSUFRVbHVkR1Z5Wm1GalpWeHVYRzR2S2lwY2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvZ1QyWm1JR05oYm5aaGMxeHVJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0tpOWNibUZ3YVM1dlptWkRZVzUyWVhNZ1BTQlBabVpEWVc1MllYTXVYMFJQVFVsdWRHVnlabUZqWlZ4dVhHNHZLaXBjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ29nUkhKdmNHUnZkMjVjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ292WEc1aGNHa3VaSEp2Y0dSdmQyNGdQU0JFY205d1pHOTNiaTVmUkU5TlNXNTBaWEptWVdObFhHNWNiaTh2SUUxaGEyVWdkR2hsSUVGUVNTQnNhWFpsWEc1M2FXNWtiM2N1Y0dodmJtOXVJRDBnWVhCcFhHNWNibVY0Y0c5eWRDQmtaV1poZFd4MElHRndhVnh1SWwxOSJ9
