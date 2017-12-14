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

    // @todo keep?
    // this.options = Object.assign(defaultOptions, options)
    Object.keys(defaultOptions).forEach(function (prop) {
      if (typeof _this.options[prop] === 'undefined') {
        _this.options[prop] = defaultOptions[prop];
      }
    });

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

      if (typeof eventName !== 'string') {
        throw new Error('The event name is not valid.');
      }

      if (this.addToStack) {
        if (eventName === _events2.default.SHOW) {
          _componentManager2.default.add(this);
        } else if (eventName === _events2.default.HIDE) {
          _componentManager2.default.remove(this);
        }
      }

      // event names can be with dot notation like reconnecting.success
      var eventNameObject = eventName.split('.').reduce(function (acc, current, index) {
        if (index === 0) {
          return current;
        }

        return acc + current.charAt(0).toUpperCase() + current.slice(1);
      });

      var eventNameAlias = 'on' + eventNameObject.charAt(0).toUpperCase() + eventNameObject.slice(1);

      // object event
      if (typeof this.options[eventNameObject] === 'function') {
        this.options[eventNameObject].apply(this, [detail]);
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
        }, 10);

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

          // set position
          var activeNotifications = document.querySelectorAll('.notification.show') || [];
          var pushDistance = 0;
          activeNotifications.forEach(function (notification) {
            if (_this2.options.element !== notification) {
              var style = getComputedStyle(notification);
              pushDistance += notification.offsetHeight + parseInt(style.marginBottom, 10);
            }
          });

          _this2.options.element.style.transform = 'translateY(' + pushDistance + 'px)';

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
  NETWORK_RECONNECTING: 'reconnecting',
  NETWORK_RECONNECTING_SUCCESS: 'reconnect.success',
  NETWORK_RECONNECTING_FAILURE: 'reconnect.failure',

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
  var DEFAULT_PROPERTIES = {
    element: null,
    initialDelay: 3000,
    delay: 5000
  };
  var DATA_ATTRS_PROPERTIES = [];

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

      var _this = _possibleConstructorReturn(this, (Network.__proto__ || Object.getPrototypeOf(Network)).call(this, NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, true, false));

      _this.xhr = null;
      _this.checkInterval = null;

      _this.setStatus(_events2.default.NETWORK_ONLINE);

      setTimeout(function () {
        _this.startCheck();
      }, _this.options.initialDelay);
      return _this;
    }

    _createClass(Network, [{
      key: 'getStatus',
      value: function getStatus() {
        return this.status;
      }
    }, {
      key: 'setStatus',
      value: function setStatus(status) {
        this.status = status;
      }
    }, {
      key: 'startRequest',
      value: function startRequest() {
        var _this2 = this;

        this.xhr = new XMLHttpRequest();
        this.xhr.offline = false;

        var url = '/favicon.ico?_=' + new Date().getTime();

        this.triggerEvent(_events2.default.NETWORK_RECONNECTING, { date: new Date() }, false);

        this.xhr.open('HEAD', url, true);

        this.xhr.timeout = this.options.delay - 1;
        this.xhr.ontimeout = function () {
          _this2.xhr.abort();
          _this2.xhr = null;
        };

        this.xhr.onload = function () {
          _this2.onUp();
        };
        this.xhr.onerror = function () {
          _this2.onDown();
        };

        try {
          this.xhr.send();
        } catch (e) {
          this.onDown();
        }
      }
    }, {
      key: 'onUp',
      value: function onUp() {
        this.triggerEvent(_events2.default.NETWORK_RECONNECTING_SUCCESS, { date: new Date() }, false);

        if (this.getStatus() !== _events2.default.NETWORK_ONLINE) {
          this.triggerEvent(_events2.default.NETWORK_ONLINE, { date: new Date() }, false);
        }

        this.setStatus(_events2.default.NETWORK_ONLINE);
      }
    }, {
      key: 'onDown',
      value: function onDown() {
        this.triggerEvent(_events2.default.NETWORK_RECONNECTING_FAILURE, { date: new Date() }, false);

        if (this.getStatus() !== _events2.default.NETWORK_OFFLINE) {
          this.triggerEvent(_events2.default.NETWORK_OFFLINE, { date: new Date() }, false);
        }

        this.setStatus(_events2.default.NETWORK_OFFLINE);
      }
    }, {
      key: 'startCheck',
      value: function startCheck() {
        var _this3 = this;

        this.stopCheck();

        this.startRequest();

        this.checkInterval = setInterval(function () {
          _this3.startRequest();
        }, this.options.delay);
      }
    }, {
      key: 'stopCheck',
      value: function stopCheck() {
        if (this.checkInterval !== null) {
          clearInterval(this.checkInterval);
          this.checkInterval = null;
        }
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcGxhdGZvcm0vcGxhdGZvcm0uanMiLCJzcmMvanMvY29tcG9uZW50cy9hY2NvcmRpb24vaW5kZXguanMiLCJzcmMvanMvY29tcG9uZW50cy9jb2xsYXBzZS9pbmRleC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2NvbXBvbmVudC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2NvbXBvbmVudE1hbmFnZXIuanMiLCJzcmMvanMvY29tcG9uZW50cy9kaWFsb2cvaW5kZXguanMiLCJzcmMvanMvY29tcG9uZW50cy9kcm9wZG93bi9pbmRleC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2xvYWRlci9pbmRleC5qcyIsInNyYy9qcy9jb21wb25lbnRzL25vdGlmaWNhdGlvbi9pbmRleC5qcyIsInNyYy9qcy9jb21wb25lbnRzL29mZi1jYW52YXMvaW5kZXguanMiLCJzcmMvanMvY29tcG9uZW50cy9wcm9ncmVzcy9pbmRleC5qcyIsInNyYy9qcy9jb21wb25lbnRzL3RhYi9pbmRleC5qcyIsInNyYy9qcy9jb3JlL2FqYXgvaW5kZXguanMiLCJzcmMvanMvY29yZS9ldmVudHMvZGlzcGF0Y2guanMiLCJzcmMvanMvY29yZS9ldmVudHMvaW5kZXguanMiLCJzcmMvanMvY29yZS9pbnRsL2JpbmRlci5qcyIsInNyYy9qcy9jb3JlL2ludGwvaW5kZXguanMiLCJzcmMvanMvY29yZS9uZXR3b3JrL2luZGV4LmpzIiwic3JjL2pzL2NvcmUvcGFnZXIvaW5kZXguanMiLCJzcmMvanMvY29yZS9wYWdlci9wYWdlLmpzIiwic3JjL2pzL2NvcmUvcGxhdGZvcm0vaW5kZXguanMiLCJzcmMvanMvY29yZS91dGlscy9pbmRleC5qcyIsInNyYy9qcy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QTs7Ozs7OztBQWJBO0FBa0JBLElBQUksTUFBSixHQUFhO0FBQ1g7QUFDQSxTQUFPOztBQUdUOzs7OztBQUxhLENBQWIsQ0FVQSxJQUFJLEtBQUosR0FBWSxVQUFDLE9BQUQsRUFBYTtBQUN2QixNQUFJLE9BQU8sSUFBSSxNQUFYLEtBQXNCLFdBQTFCLEVBQXVDO0FBQ3JDLFFBQUksTUFBSixHQUFhLGdCQUFNLGFBQU4sQ0FBb0IsT0FBcEIsQ0FBYjtBQUNEO0FBQ0QsU0FBTyxJQUFJLE1BQVg7QUFDRCxDQUxEOztBQU9BOzs7Ozs7QUFNQSxJQUFJLFFBQUo7O0FBRUE7Ozs7O0FBS0EsSUFBSSxJQUFKLEdBQVcsZUFBSyxhQUFoQjs7QUFFQTs7Ozs7QUFLQSxJQUFJLElBQUosR0FBVyxlQUFLLGFBQWhCOztBQUVBOzs7OztBQUtBLElBQUksT0FBSixHQUFjLGtCQUFRLGFBQXRCOztBQUVBOzs7OztBQUtBLElBQUksWUFBSixHQUFtQix1QkFBYSxhQUFoQzs7QUFFQTs7Ozs7QUFLQSxJQUFJLE1BQUosR0FBYSxpQkFBTyxhQUFwQjs7QUFFQTs7Ozs7QUFLQSxJQUFJLFFBQUosR0FBZSxtQkFBUyxhQUF4Qjs7QUFFQTs7Ozs7QUFLQSxJQUFJLFNBQUosR0FBZ0Isb0JBQVUsYUFBMUI7O0FBR0E7Ozs7O0FBS0EsSUFBSSxHQUFKLEdBQVUsY0FBSSxhQUFkOztBQUVBOzs7OztBQUtBLElBQUksUUFBSixHQUFlLG1CQUFTLGFBQXhCOztBQUVBOzs7OztBQUtBLElBQUksTUFBSixHQUFhLGlCQUFPLGFBQXBCOztBQUVBOzs7OztBQUtBLElBQUksU0FBSixHQUFnQixvQkFBVSxhQUExQjs7QUFFQTs7Ozs7QUFLQSxJQUFJLFFBQUosR0FBZSxtQkFBUyxhQUF4Qjs7QUFFQTtBQUNBLE9BQU8sTUFBUCxHQUFnQixHQUFoQjs7a0JBRWUsRyIsImZpbGUiOiJwaG9ub24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIVxuICogUGxhdGZvcm0uanMgPGh0dHBzOi8vbXRocy5iZS9wbGF0Zm9ybT5cbiAqIENvcHlyaWdodCAyMDE0LTIwMTYgQmVuamFtaW4gVGFuIDxodHRwczovL2RlbW9uZWF1eC5naXRodWIuaW8vPlxuICogQ29weXJpZ2h0IDIwMTEtMjAxMyBKb2huLURhdmlkIERhbHRvbiA8aHR0cDovL2FsbHlvdWNhbmxlZXQuY29tLz5cbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9tdGhzLmJlL21pdD5cbiAqL1xuOyhmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8qKiBVc2VkIHRvIGRldGVybWluZSBpZiB2YWx1ZXMgYXJlIG9mIHRoZSBsYW5ndWFnZSB0eXBlIGBPYmplY3RgLiAqL1xuICB2YXIgb2JqZWN0VHlwZXMgPSB7XG4gICAgJ2Z1bmN0aW9uJzogdHJ1ZSxcbiAgICAnb2JqZWN0JzogdHJ1ZVxuICB9O1xuXG4gIC8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xuICB2YXIgcm9vdCA9IChvYmplY3RUeXBlc1t0eXBlb2Ygd2luZG93XSAmJiB3aW5kb3cpIHx8IHRoaXM7XG5cbiAgLyoqIEJhY2t1cCBwb3NzaWJsZSBnbG9iYWwgb2JqZWN0LiAqL1xuICB2YXIgb2xkUm9vdCA9IHJvb3Q7XG5cbiAgLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbiAgdmFyIGZyZWVFeHBvcnRzID0gb2JqZWN0VHlwZXNbdHlwZW9mIGV4cG9ydHNdICYmIGV4cG9ydHM7XG5cbiAgLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xuICB2YXIgZnJlZU1vZHVsZSA9IG9iamVjdFR5cGVzW3R5cGVvZiBtb2R1bGVdICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuICAvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzIG9yIEJyb3dzZXJpZmllZCBjb2RlIGFuZCB1c2UgaXQgYXMgYHJvb3RgLiAqL1xuICB2YXIgZnJlZUdsb2JhbCA9IGZyZWVFeHBvcnRzICYmIGZyZWVNb2R1bGUgJiYgdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWw7XG4gIGlmIChmcmVlR2xvYmFsICYmIChmcmVlR2xvYmFsLmdsb2JhbCA9PT0gZnJlZUdsb2JhbCB8fCBmcmVlR2xvYmFsLndpbmRvdyA9PT0gZnJlZUdsb2JhbCB8fCBmcmVlR2xvYmFsLnNlbGYgPT09IGZyZWVHbG9iYWwpKSB7XG4gICAgcm9vdCA9IGZyZWVHbG9iYWw7XG4gIH1cblxuICAvKipcbiAgICogVXNlZCBhcyB0aGUgbWF4aW11bSBsZW5ndGggb2YgYW4gYXJyYXktbGlrZSBvYmplY3QuXG4gICAqIFNlZSB0aGUgW0VTNiBzcGVjXShodHRwOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy10b2xlbmd0aClcbiAgICogZm9yIG1vcmUgZGV0YWlscy5cbiAgICovXG4gIHZhciBtYXhTYWZlSW50ZWdlciA9IE1hdGgucG93KDIsIDUzKSAtIDE7XG5cbiAgLyoqIFJlZ3VsYXIgZXhwcmVzc2lvbiB0byBkZXRlY3QgT3BlcmEuICovXG4gIHZhciByZU9wZXJhID0gL1xcYk9wZXJhLztcblxuICAvKiogUG9zc2libGUgZ2xvYmFsIG9iamVjdC4gKi9cbiAgdmFyIHRoaXNCaW5kaW5nID0gdGhpcztcblxuICAvKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xuICB2YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4gIC8qKiBVc2VkIHRvIGNoZWNrIGZvciBvd24gcHJvcGVydGllcyBvZiBhbiBvYmplY3QuICovXG4gIHZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4gIC8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGludGVybmFsIGBbW0NsYXNzXV1gIG9mIHZhbHVlcy4gKi9cbiAgdmFyIHRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLyoqXG4gICAqIENhcGl0YWxpemVzIGEgc3RyaW5nIHZhbHVlLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFRoZSBzdHJpbmcgdG8gY2FwaXRhbGl6ZS5cbiAgICogQHJldHVybnMge3N0cmluZ30gVGhlIGNhcGl0YWxpemVkIHN0cmluZy5cbiAgICovXG4gIGZ1bmN0aW9uIGNhcGl0YWxpemUoc3RyaW5nKSB7XG4gICAgc3RyaW5nID0gU3RyaW5nKHN0cmluZyk7XG4gICAgcmV0dXJuIHN0cmluZy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0cmluZy5zbGljZSgxKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHV0aWxpdHkgZnVuY3Rpb24gdG8gY2xlYW4gdXAgdGhlIE9TIG5hbWUuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvcyBUaGUgT1MgbmFtZSB0byBjbGVhbiB1cC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IFtwYXR0ZXJuXSBBIGBSZWdFeHBgIHBhdHRlcm4gbWF0Y2hpbmcgdGhlIE9TIG5hbWUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbbGFiZWxdIEEgbGFiZWwgZm9yIHRoZSBPUy5cbiAgICovXG4gIGZ1bmN0aW9uIGNsZWFudXBPUyhvcywgcGF0dGVybiwgbGFiZWwpIHtcbiAgICAvLyBQbGF0Zm9ybSB0b2tlbnMgYXJlIGRlZmluZWQgYXQ6XG4gICAgLy8gaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L21zNTM3NTAzKFZTLjg1KS5hc3B4XG4gICAgLy8gaHR0cDovL3dlYi5hcmNoaXZlLm9yZy93ZWIvMjAwODExMjIwNTM5NTAvaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L21zNTM3NTAzKFZTLjg1KS5hc3B4XG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICAnMTAuMCc6ICcxMCcsXG4gICAgICAnNi40JzogICcxMCBUZWNobmljYWwgUHJldmlldycsXG4gICAgICAnNi4zJzogICc4LjEnLFxuICAgICAgJzYuMic6ICAnOCcsXG4gICAgICAnNi4xJzogICdTZXJ2ZXIgMjAwOCBSMiAvIDcnLFxuICAgICAgJzYuMCc6ICAnU2VydmVyIDIwMDggLyBWaXN0YScsXG4gICAgICAnNS4yJzogICdTZXJ2ZXIgMjAwMyAvIFhQIDY0LWJpdCcsXG4gICAgICAnNS4xJzogICdYUCcsXG4gICAgICAnNS4wMSc6ICcyMDAwIFNQMScsXG4gICAgICAnNS4wJzogICcyMDAwJyxcbiAgICAgICc0LjAnOiAgJ05UJyxcbiAgICAgICc0LjkwJzogJ01FJ1xuICAgIH07XG4gICAgLy8gRGV0ZWN0IFdpbmRvd3MgdmVyc2lvbiBmcm9tIHBsYXRmb3JtIHRva2Vucy5cbiAgICBpZiAocGF0dGVybiAmJiBsYWJlbCAmJiAvXldpbi9pLnRlc3Qob3MpICYmICEvXldpbmRvd3MgUGhvbmUgL2kudGVzdChvcykgJiZcbiAgICAgICAgKGRhdGEgPSBkYXRhWy9bXFxkLl0rJC8uZXhlYyhvcyldKSkge1xuICAgICAgb3MgPSAnV2luZG93cyAnICsgZGF0YTtcbiAgICB9XG4gICAgLy8gQ29ycmVjdCBjaGFyYWN0ZXIgY2FzZSBhbmQgY2xlYW51cCBzdHJpbmcuXG4gICAgb3MgPSBTdHJpbmcob3MpO1xuXG4gICAgaWYgKHBhdHRlcm4gJiYgbGFiZWwpIHtcbiAgICAgIG9zID0gb3MucmVwbGFjZShSZWdFeHAocGF0dGVybiwgJ2knKSwgbGFiZWwpO1xuICAgIH1cblxuICAgIG9zID0gZm9ybWF0KFxuICAgICAgb3MucmVwbGFjZSgvIGNlJC9pLCAnIENFJylcbiAgICAgICAgLnJlcGxhY2UoL1xcYmhwdy9pLCAnd2ViJylcbiAgICAgICAgLnJlcGxhY2UoL1xcYk1hY2ludG9zaFxcYi8sICdNYWMgT1MnKVxuICAgICAgICAucmVwbGFjZSgvX1Bvd2VyUENcXGIvaSwgJyBPUycpXG4gICAgICAgIC5yZXBsYWNlKC9cXGIoT1MgWCkgW14gXFxkXSsvaSwgJyQxJylcbiAgICAgICAgLnJlcGxhY2UoL1xcYk1hYyAoT1MgWClcXGIvLCAnJDEnKVxuICAgICAgICAucmVwbGFjZSgvXFwvKFxcZCkvLCAnICQxJylcbiAgICAgICAgLnJlcGxhY2UoL18vZywgJy4nKVxuICAgICAgICAucmVwbGFjZSgvKD86IEJlUEN8WyAuXSpmY1sgXFxkLl0rKSQvaSwgJycpXG4gICAgICAgIC5yZXBsYWNlKC9cXGJ4ODZcXC42NFxcYi9naSwgJ3g4Nl82NCcpXG4gICAgICAgIC5yZXBsYWNlKC9cXGIoV2luZG93cyBQaG9uZSkgT1NcXGIvLCAnJDEnKVxuICAgICAgICAucmVwbGFjZSgvXFxiKENocm9tZSBPUyBcXHcrKSBbXFxkLl0rXFxiLywgJyQxJylcbiAgICAgICAgLnNwbGl0KCcgb24gJylbMF1cbiAgICApO1xuXG4gICAgcmV0dXJuIG9zO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIGl0ZXJhdGlvbiB1dGlsaXR5IGZvciBhcnJheXMgYW5kIG9iamVjdHMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICovXG4gIGZ1bmN0aW9uIGVhY2gob2JqZWN0LCBjYWxsYmFjaykge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBvYmplY3QgPyBvYmplY3QubGVuZ3RoIDogMDtcblxuICAgIGlmICh0eXBlb2YgbGVuZ3RoID09ICdudW1iZXInICYmIGxlbmd0aCA+IC0xICYmIGxlbmd0aCA8PSBtYXhTYWZlSW50ZWdlcikge1xuICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgY2FsbGJhY2sob2JqZWN0W2luZGV4XSwgaW5kZXgsIG9iamVjdCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvck93bihvYmplY3QsIGNhbGxiYWNrKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVHJpbSBhbmQgY29uZGl0aW9uYWxseSBjYXBpdGFsaXplIHN0cmluZyB2YWx1ZXMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byBmb3JtYXQuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBmb3JtYXR0ZWQgc3RyaW5nLlxuICAgKi9cbiAgZnVuY3Rpb24gZm9ybWF0KHN0cmluZykge1xuICAgIHN0cmluZyA9IHRyaW0oc3RyaW5nKTtcbiAgICByZXR1cm4gL14oPzp3ZWJPU3xpKD86T1N8UCkpLy50ZXN0KHN0cmluZylcbiAgICAgID8gc3RyaW5nXG4gICAgICA6IGNhcGl0YWxpemUoc3RyaW5nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJdGVyYXRlcyBvdmVyIGFuIG9iamVjdCdzIG93biBwcm9wZXJ0aWVzLCBleGVjdXRpbmcgdGhlIGBjYWxsYmFja2AgZm9yIGVhY2guXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBmdW5jdGlvbiBleGVjdXRlZCBwZXIgb3duIHByb3BlcnR5LlxuICAgKi9cbiAgZnVuY3Rpb24gZm9yT3duKG9iamVjdCwgY2FsbGJhY2spIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkpIHtcbiAgICAgICAgY2FsbGJhY2sob2JqZWN0W2tleV0sIGtleSwgb2JqZWN0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgaW50ZXJuYWwgYFtbQ2xhc3NdXWAgb2YgYSB2YWx1ZS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBgW1tDbGFzc11dYC5cbiAgICovXG4gIGZ1bmN0aW9uIGdldENsYXNzT2YodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT0gbnVsbFxuICAgICAgPyBjYXBpdGFsaXplKHZhbHVlKVxuICAgICAgOiB0b1N0cmluZy5jYWxsKHZhbHVlKS5zbGljZSg4LCAtMSk7XG4gIH1cblxuICAvKipcbiAgICogSG9zdCBvYmplY3RzIGNhbiByZXR1cm4gdHlwZSB2YWx1ZXMgdGhhdCBhcmUgZGlmZmVyZW50IGZyb20gdGhlaXIgYWN0dWFsXG4gICAqIGRhdGEgdHlwZS4gVGhlIG9iamVjdHMgd2UgYXJlIGNvbmNlcm5lZCB3aXRoIHVzdWFsbHkgcmV0dXJuIG5vbi1wcmltaXRpdmVcbiAgICogdHlwZXMgb2YgXCJvYmplY3RcIiwgXCJmdW5jdGlvblwiLCBvciBcInVua25vd25cIi5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHsqfSBvYmplY3QgVGhlIG93bmVyIG9mIHRoZSBwcm9wZXJ0eS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BlcnR5IFRoZSBwcm9wZXJ0eSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBwcm9wZXJ0eSB2YWx1ZSBpcyBhIG5vbi1wcmltaXRpdmUsIGVsc2UgYGZhbHNlYC5cbiAgICovXG4gIGZ1bmN0aW9uIGlzSG9zdFR5cGUob2JqZWN0LCBwcm9wZXJ0eSkge1xuICAgIHZhciB0eXBlID0gb2JqZWN0ICE9IG51bGwgPyB0eXBlb2Ygb2JqZWN0W3Byb3BlcnR5XSA6ICdudW1iZXInO1xuICAgIHJldHVybiAhL14oPzpib29sZWFufG51bWJlcnxzdHJpbmd8dW5kZWZpbmVkKSQvLnRlc3QodHlwZSkgJiZcbiAgICAgICh0eXBlID09ICdvYmplY3QnID8gISFvYmplY3RbcHJvcGVydHldIDogdHJ1ZSk7XG4gIH1cblxuICAvKipcbiAgICogUHJlcGFyZXMgYSBzdHJpbmcgZm9yIHVzZSBpbiBhIGBSZWdFeHBgIGJ5IG1ha2luZyBoeXBoZW5zIGFuZCBzcGFjZXMgb3B0aW9uYWwuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byBxdWFsaWZ5LlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgcXVhbGlmaWVkIHN0cmluZy5cbiAgICovXG4gIGZ1bmN0aW9uIHF1YWxpZnkoc3RyaW5nKSB7XG4gICAgcmV0dXJuIFN0cmluZyhzdHJpbmcpLnJlcGxhY2UoLyhbIC1dKSg/ISQpL2csICckMT8nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIGJhcmUtYm9uZXMgYEFycmF5I3JlZHVjZWAgbGlrZSB1dGlsaXR5IGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gICAqIEByZXR1cm5zIHsqfSBUaGUgYWNjdW11bGF0ZWQgcmVzdWx0LlxuICAgKi9cbiAgZnVuY3Rpb24gcmVkdWNlKGFycmF5LCBjYWxsYmFjaykge1xuICAgIHZhciBhY2N1bXVsYXRvciA9IG51bGw7XG4gICAgZWFjaChhcnJheSwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XG4gICAgICBhY2N1bXVsYXRvciA9IGNhbGxiYWNrKGFjY3VtdWxhdG9yLCB2YWx1ZSwgaW5kZXgsIGFycmF5KTtcbiAgICB9KTtcbiAgICByZXR1cm4gYWNjdW11bGF0b3I7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBsZWFkaW5nIGFuZCB0cmFpbGluZyB3aGl0ZXNwYWNlIGZyb20gYSBzdHJpbmcuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byB0cmltLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgdHJpbW1lZCBzdHJpbmcuXG4gICAqL1xuICBmdW5jdGlvbiB0cmltKHN0cmluZykge1xuICAgIHJldHVybiBTdHJpbmcoc3RyaW5nKS5yZXBsYWNlKC9eICt8ICskL2csICcnKTtcbiAgfVxuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IHBsYXRmb3JtIG9iamVjdC5cbiAgICpcbiAgICogQG1lbWJlck9mIHBsYXRmb3JtXG4gICAqIEBwYXJhbSB7T2JqZWN0fHN0cmluZ30gW3VhPW5hdmlnYXRvci51c2VyQWdlbnRdIFRoZSB1c2VyIGFnZW50IHN0cmluZyBvclxuICAgKiAgY29udGV4dCBvYmplY3QuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IEEgcGxhdGZvcm0gb2JqZWN0LlxuICAgKi9cbiAgZnVuY3Rpb24gcGFyc2UodWEpIHtcblxuICAgIC8qKiBUaGUgZW52aXJvbm1lbnQgY29udGV4dCBvYmplY3QuICovXG4gICAgdmFyIGNvbnRleHQgPSByb290O1xuXG4gICAgLyoqIFVzZWQgdG8gZmxhZyB3aGVuIGEgY3VzdG9tIGNvbnRleHQgaXMgcHJvdmlkZWQuICovXG4gICAgdmFyIGlzQ3VzdG9tQ29udGV4dCA9IHVhICYmIHR5cGVvZiB1YSA9PSAnb2JqZWN0JyAmJiBnZXRDbGFzc09mKHVhKSAhPSAnU3RyaW5nJztcblxuICAgIC8vIEp1Z2dsZSBhcmd1bWVudHMuXG4gICAgaWYgKGlzQ3VzdG9tQ29udGV4dCkge1xuICAgICAgY29udGV4dCA9IHVhO1xuICAgICAgdWEgPSBudWxsO1xuICAgIH1cblxuICAgIC8qKiBCcm93c2VyIG5hdmlnYXRvciBvYmplY3QuICovXG4gICAgdmFyIG5hdiA9IGNvbnRleHQubmF2aWdhdG9yIHx8IHt9O1xuXG4gICAgLyoqIEJyb3dzZXIgdXNlciBhZ2VudCBzdHJpbmcuICovXG4gICAgdmFyIHVzZXJBZ2VudCA9IG5hdi51c2VyQWdlbnQgfHwgJyc7XG5cbiAgICB1YSB8fCAodWEgPSB1c2VyQWdlbnQpO1xuXG4gICAgLyoqIFVzZWQgdG8gZmxhZyB3aGVuIGB0aGlzQmluZGluZ2AgaXMgdGhlIFtNb2R1bGVTY29wZV0uICovXG4gICAgdmFyIGlzTW9kdWxlU2NvcGUgPSBpc0N1c3RvbUNvbnRleHQgfHwgdGhpc0JpbmRpbmcgPT0gb2xkUm9vdDtcblxuICAgIC8qKiBVc2VkIHRvIGRldGVjdCBpZiBicm93c2VyIGlzIGxpa2UgQ2hyb21lLiAqL1xuICAgIHZhciBsaWtlQ2hyb21lID0gaXNDdXN0b21Db250ZXh0XG4gICAgICA/ICEhbmF2Lmxpa2VDaHJvbWVcbiAgICAgIDogL1xcYkNocm9tZVxcYi8udGVzdCh1YSkgJiYgIS9pbnRlcm5hbHxcXG4vaS50ZXN0KHRvU3RyaW5nLnRvU3RyaW5nKCkpO1xuXG4gICAgLyoqIEludGVybmFsIGBbW0NsYXNzXV1gIHZhbHVlIHNob3J0Y3V0cy4gKi9cbiAgICB2YXIgb2JqZWN0Q2xhc3MgPSAnT2JqZWN0JyxcbiAgICAgICAgYWlyUnVudGltZUNsYXNzID0gaXNDdXN0b21Db250ZXh0ID8gb2JqZWN0Q2xhc3MgOiAnU2NyaXB0QnJpZGdpbmdQcm94eU9iamVjdCcsXG4gICAgICAgIGVudmlyb0NsYXNzID0gaXNDdXN0b21Db250ZXh0ID8gb2JqZWN0Q2xhc3MgOiAnRW52aXJvbm1lbnQnLFxuICAgICAgICBqYXZhQ2xhc3MgPSAoaXNDdXN0b21Db250ZXh0ICYmIGNvbnRleHQuamF2YSkgPyAnSmF2YVBhY2thZ2UnIDogZ2V0Q2xhc3NPZihjb250ZXh0LmphdmEpLFxuICAgICAgICBwaGFudG9tQ2xhc3MgPSBpc0N1c3RvbUNvbnRleHQgPyBvYmplY3RDbGFzcyA6ICdSdW50aW1lT2JqZWN0JztcblxuICAgIC8qKiBEZXRlY3QgSmF2YSBlbnZpcm9ubWVudHMuICovXG4gICAgdmFyIGphdmEgPSAvXFxiSmF2YS8udGVzdChqYXZhQ2xhc3MpICYmIGNvbnRleHQuamF2YTtcblxuICAgIC8qKiBEZXRlY3QgUmhpbm8uICovXG4gICAgdmFyIHJoaW5vID0gamF2YSAmJiBnZXRDbGFzc09mKGNvbnRleHQuZW52aXJvbm1lbnQpID09IGVudmlyb0NsYXNzO1xuXG4gICAgLyoqIEEgY2hhcmFjdGVyIHRvIHJlcHJlc2VudCBhbHBoYS4gKi9cbiAgICB2YXIgYWxwaGEgPSBqYXZhID8gJ2EnIDogJ1xcdTAzYjEnO1xuXG4gICAgLyoqIEEgY2hhcmFjdGVyIHRvIHJlcHJlc2VudCBiZXRhLiAqL1xuICAgIHZhciBiZXRhID0gamF2YSA/ICdiJyA6ICdcXHUwM2IyJztcblxuICAgIC8qKiBCcm93c2VyIGRvY3VtZW50IG9iamVjdC4gKi9cbiAgICB2YXIgZG9jID0gY29udGV4dC5kb2N1bWVudCB8fCB7fTtcblxuICAgIC8qKlxuICAgICAqIERldGVjdCBPcGVyYSBicm93c2VyIChQcmVzdG8tYmFzZWQpLlxuICAgICAqIGh0dHA6Ly93d3cuaG93dG9jcmVhdGUuY28udWsvb3BlcmFTdHVmZi9vcGVyYU9iamVjdC5odG1sXG4gICAgICogaHR0cDovL2Rldi5vcGVyYS5jb20vYXJ0aWNsZXMvdmlldy9vcGVyYS1taW5pLXdlYi1jb250ZW50LWF1dGhvcmluZy1ndWlkZWxpbmVzLyNvcGVyYW1pbmlcbiAgICAgKi9cbiAgICB2YXIgb3BlcmEgPSBjb250ZXh0Lm9wZXJhbWluaSB8fCBjb250ZXh0Lm9wZXJhO1xuXG4gICAgLyoqIE9wZXJhIGBbW0NsYXNzXV1gLiAqL1xuICAgIHZhciBvcGVyYUNsYXNzID0gcmVPcGVyYS50ZXN0KG9wZXJhQ2xhc3MgPSAoaXNDdXN0b21Db250ZXh0ICYmIG9wZXJhKSA/IG9wZXJhWydbW0NsYXNzXV0nXSA6IGdldENsYXNzT2Yob3BlcmEpKVxuICAgICAgPyBvcGVyYUNsYXNzXG4gICAgICA6IChvcGVyYSA9IG51bGwpO1xuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLyoqIFRlbXBvcmFyeSB2YXJpYWJsZSB1c2VkIG92ZXIgdGhlIHNjcmlwdCdzIGxpZmV0aW1lLiAqL1xuICAgIHZhciBkYXRhO1xuXG4gICAgLyoqIFRoZSBDUFUgYXJjaGl0ZWN0dXJlLiAqL1xuICAgIHZhciBhcmNoID0gdWE7XG5cbiAgICAvKiogUGxhdGZvcm0gZGVzY3JpcHRpb24gYXJyYXkuICovXG4gICAgdmFyIGRlc2NyaXB0aW9uID0gW107XG5cbiAgICAvKiogUGxhdGZvcm0gYWxwaGEvYmV0YSBpbmRpY2F0b3IuICovXG4gICAgdmFyIHByZXJlbGVhc2UgPSBudWxsO1xuXG4gICAgLyoqIEEgZmxhZyB0byBpbmRpY2F0ZSB0aGF0IGVudmlyb25tZW50IGZlYXR1cmVzIHNob3VsZCBiZSB1c2VkIHRvIHJlc29sdmUgdGhlIHBsYXRmb3JtLiAqL1xuICAgIHZhciB1c2VGZWF0dXJlcyA9IHVhID09IHVzZXJBZ2VudDtcblxuICAgIC8qKiBUaGUgYnJvd3Nlci9lbnZpcm9ubWVudCB2ZXJzaW9uLiAqL1xuICAgIHZhciB2ZXJzaW9uID0gdXNlRmVhdHVyZXMgJiYgb3BlcmEgJiYgdHlwZW9mIG9wZXJhLnZlcnNpb24gPT0gJ2Z1bmN0aW9uJyAmJiBvcGVyYS52ZXJzaW9uKCk7XG5cbiAgICAvKiogQSBmbGFnIHRvIGluZGljYXRlIGlmIHRoZSBPUyBlbmRzIHdpdGggXCIvIFZlcnNpb25cIiAqL1xuICAgIHZhciBpc1NwZWNpYWxDYXNlZE9TO1xuXG4gICAgLyogRGV0ZWN0YWJsZSBsYXlvdXQgZW5naW5lcyAob3JkZXIgaXMgaW1wb3J0YW50KS4gKi9cbiAgICB2YXIgbGF5b3V0ID0gZ2V0TGF5b3V0KFtcbiAgICAgIHsgJ2xhYmVsJzogJ0VkZ2VIVE1MJywgJ3BhdHRlcm4nOiAnRWRnZScgfSxcbiAgICAgICdUcmlkZW50JyxcbiAgICAgIHsgJ2xhYmVsJzogJ1dlYktpdCcsICdwYXR0ZXJuJzogJ0FwcGxlV2ViS2l0JyB9LFxuICAgICAgJ2lDYWInLFxuICAgICAgJ1ByZXN0bycsXG4gICAgICAnTmV0RnJvbnQnLFxuICAgICAgJ1Rhc21hbicsXG4gICAgICAnS0hUTUwnLFxuICAgICAgJ0dlY2tvJ1xuICAgIF0pO1xuXG4gICAgLyogRGV0ZWN0YWJsZSBicm93c2VyIG5hbWVzIChvcmRlciBpcyBpbXBvcnRhbnQpLiAqL1xuICAgIHZhciBuYW1lID0gZ2V0TmFtZShbXG4gICAgICAnQWRvYmUgQUlSJyxcbiAgICAgICdBcm9yYScsXG4gICAgICAnQXZhbnQgQnJvd3NlcicsXG4gICAgICAnQnJlYWNoJyxcbiAgICAgICdDYW1pbm8nLFxuICAgICAgJ0VsZWN0cm9uJyxcbiAgICAgICdFcGlwaGFueScsXG4gICAgICAnRmVubmVjJyxcbiAgICAgICdGbG9jaycsXG4gICAgICAnR2FsZW9uJyxcbiAgICAgICdHcmVlbkJyb3dzZXInLFxuICAgICAgJ2lDYWInLFxuICAgICAgJ0ljZXdlYXNlbCcsXG4gICAgICAnSy1NZWxlb24nLFxuICAgICAgJ0tvbnF1ZXJvcicsXG4gICAgICAnTHVuYXNjYXBlJyxcbiAgICAgICdNYXh0aG9uJyxcbiAgICAgIHsgJ2xhYmVsJzogJ01pY3Jvc29mdCBFZGdlJywgJ3BhdHRlcm4nOiAnRWRnZScgfSxcbiAgICAgICdNaWRvcmknLFxuICAgICAgJ05vb2sgQnJvd3NlcicsXG4gICAgICAnUGFsZU1vb24nLFxuICAgICAgJ1BoYW50b21KUycsXG4gICAgICAnUmF2ZW4nLFxuICAgICAgJ1Jla29ucScsXG4gICAgICAnUm9ja01lbHQnLFxuICAgICAgeyAnbGFiZWwnOiAnU2Ftc3VuZyBJbnRlcm5ldCcsICdwYXR0ZXJuJzogJ1NhbXN1bmdCcm93c2VyJyB9LFxuICAgICAgJ1NlYU1vbmtleScsXG4gICAgICB7ICdsYWJlbCc6ICdTaWxrJywgJ3BhdHRlcm4nOiAnKD86Q2xvdWQ5fFNpbGstQWNjZWxlcmF0ZWQpJyB9LFxuICAgICAgJ1NsZWlwbmlyJyxcbiAgICAgICdTbGltQnJvd3NlcicsXG4gICAgICB7ICdsYWJlbCc6ICdTUldhcmUgSXJvbicsICdwYXR0ZXJuJzogJ0lyb24nIH0sXG4gICAgICAnU3VucmlzZScsXG4gICAgICAnU3dpZnRmb3gnLFxuICAgICAgJ1dhdGVyZm94JyxcbiAgICAgICdXZWJQb3NpdGl2ZScsXG4gICAgICAnT3BlcmEgTWluaScsXG4gICAgICB7ICdsYWJlbCc6ICdPcGVyYSBNaW5pJywgJ3BhdHRlcm4nOiAnT1BpT1MnIH0sXG4gICAgICAnT3BlcmEnLFxuICAgICAgeyAnbGFiZWwnOiAnT3BlcmEnLCAncGF0dGVybic6ICdPUFInIH0sXG4gICAgICAnQ2hyb21lJyxcbiAgICAgIHsgJ2xhYmVsJzogJ0Nocm9tZSBNb2JpbGUnLCAncGF0dGVybic6ICcoPzpDcmlPU3xDck1vKScgfSxcbiAgICAgIHsgJ2xhYmVsJzogJ0ZpcmVmb3gnLCAncGF0dGVybic6ICcoPzpGaXJlZm94fE1pbmVmaWVsZCknIH0sXG4gICAgICB7ICdsYWJlbCc6ICdGaXJlZm94IGZvciBpT1MnLCAncGF0dGVybic6ICdGeGlPUycgfSxcbiAgICAgIHsgJ2xhYmVsJzogJ0lFJywgJ3BhdHRlcm4nOiAnSUVNb2JpbGUnIH0sXG4gICAgICB7ICdsYWJlbCc6ICdJRScsICdwYXR0ZXJuJzogJ01TSUUnIH0sXG4gICAgICAnU2FmYXJpJ1xuICAgIF0pO1xuXG4gICAgLyogRGV0ZWN0YWJsZSBwcm9kdWN0cyAob3JkZXIgaXMgaW1wb3J0YW50KS4gKi9cbiAgICB2YXIgcHJvZHVjdCA9IGdldFByb2R1Y3QoW1xuICAgICAgeyAnbGFiZWwnOiAnQmxhY2tCZXJyeScsICdwYXR0ZXJuJzogJ0JCMTAnIH0sXG4gICAgICAnQmxhY2tCZXJyeScsXG4gICAgICB7ICdsYWJlbCc6ICdHYWxheHkgUycsICdwYXR0ZXJuJzogJ0dULUk5MDAwJyB9LFxuICAgICAgeyAnbGFiZWwnOiAnR2FsYXh5IFMyJywgJ3BhdHRlcm4nOiAnR1QtSTkxMDAnIH0sXG4gICAgICB7ICdsYWJlbCc6ICdHYWxheHkgUzMnLCAncGF0dGVybic6ICdHVC1JOTMwMCcgfSxcbiAgICAgIHsgJ2xhYmVsJzogJ0dhbGF4eSBTNCcsICdwYXR0ZXJuJzogJ0dULUk5NTAwJyB9LFxuICAgICAgeyAnbGFiZWwnOiAnR2FsYXh5IFM1JywgJ3BhdHRlcm4nOiAnU00tRzkwMCcgfSxcbiAgICAgIHsgJ2xhYmVsJzogJ0dhbGF4eSBTNicsICdwYXR0ZXJuJzogJ1NNLUc5MjAnIH0sXG4gICAgICB7ICdsYWJlbCc6ICdHYWxheHkgUzYgRWRnZScsICdwYXR0ZXJuJzogJ1NNLUc5MjUnIH0sXG4gICAgICB7ICdsYWJlbCc6ICdHYWxheHkgUzcnLCAncGF0dGVybic6ICdTTS1HOTMwJyB9LFxuICAgICAgeyAnbGFiZWwnOiAnR2FsYXh5IFM3IEVkZ2UnLCAncGF0dGVybic6ICdTTS1HOTM1JyB9LFxuICAgICAgJ0dvb2dsZSBUVicsXG4gICAgICAnTHVtaWEnLFxuICAgICAgJ2lQYWQnLFxuICAgICAgJ2lQb2QnLFxuICAgICAgJ2lQaG9uZScsXG4gICAgICAnS2luZGxlJyxcbiAgICAgIHsgJ2xhYmVsJzogJ0tpbmRsZSBGaXJlJywgJ3BhdHRlcm4nOiAnKD86Q2xvdWQ5fFNpbGstQWNjZWxlcmF0ZWQpJyB9LFxuICAgICAgJ05leHVzJyxcbiAgICAgICdOb29rJyxcbiAgICAgICdQbGF5Qm9vaycsXG4gICAgICAnUGxheVN0YXRpb24gVml0YScsXG4gICAgICAnUGxheVN0YXRpb24nLFxuICAgICAgJ1RvdWNoUGFkJyxcbiAgICAgICdUcmFuc2Zvcm1lcicsXG4gICAgICB7ICdsYWJlbCc6ICdXaWkgVScsICdwYXR0ZXJuJzogJ1dpaVUnIH0sXG4gICAgICAnV2lpJyxcbiAgICAgICdYYm94IE9uZScsXG4gICAgICB7ICdsYWJlbCc6ICdYYm94IDM2MCcsICdwYXR0ZXJuJzogJ1hib3gnIH0sXG4gICAgICAnWG9vbSdcbiAgICBdKTtcblxuICAgIC8qIERldGVjdGFibGUgbWFudWZhY3R1cmVycy4gKi9cbiAgICB2YXIgbWFudWZhY3R1cmVyID0gZ2V0TWFudWZhY3R1cmVyKHtcbiAgICAgICdBcHBsZSc6IHsgJ2lQYWQnOiAxLCAnaVBob25lJzogMSwgJ2lQb2QnOiAxIH0sXG4gICAgICAnQXJjaG9zJzoge30sXG4gICAgICAnQW1hem9uJzogeyAnS2luZGxlJzogMSwgJ0tpbmRsZSBGaXJlJzogMSB9LFxuICAgICAgJ0FzdXMnOiB7ICdUcmFuc2Zvcm1lcic6IDEgfSxcbiAgICAgICdCYXJuZXMgJiBOb2JsZSc6IHsgJ05vb2snOiAxIH0sXG4gICAgICAnQmxhY2tCZXJyeSc6IHsgJ1BsYXlCb29rJzogMSB9LFxuICAgICAgJ0dvb2dsZSc6IHsgJ0dvb2dsZSBUVic6IDEsICdOZXh1cyc6IDEgfSxcbiAgICAgICdIUCc6IHsgJ1RvdWNoUGFkJzogMSB9LFxuICAgICAgJ0hUQyc6IHt9LFxuICAgICAgJ0xHJzoge30sXG4gICAgICAnTWljcm9zb2Z0JzogeyAnWGJveCc6IDEsICdYYm94IE9uZSc6IDEgfSxcbiAgICAgICdNb3Rvcm9sYSc6IHsgJ1hvb20nOiAxIH0sXG4gICAgICAnTmludGVuZG8nOiB7ICdXaWkgVSc6IDEsICAnV2lpJzogMSB9LFxuICAgICAgJ05va2lhJzogeyAnTHVtaWEnOiAxIH0sXG4gICAgICAnU2Ftc3VuZyc6IHsgJ0dhbGF4eSBTJzogMSwgJ0dhbGF4eSBTMic6IDEsICdHYWxheHkgUzMnOiAxLCAnR2FsYXh5IFM0JzogMSB9LFxuICAgICAgJ1NvbnknOiB7ICdQbGF5U3RhdGlvbic6IDEsICdQbGF5U3RhdGlvbiBWaXRhJzogMSB9XG4gICAgfSk7XG5cbiAgICAvKiBEZXRlY3RhYmxlIG9wZXJhdGluZyBzeXN0ZW1zIChvcmRlciBpcyBpbXBvcnRhbnQpLiAqL1xuICAgIHZhciBvcyA9IGdldE9TKFtcbiAgICAgICdXaW5kb3dzIFBob25lJyxcbiAgICAgICdBbmRyb2lkJyxcbiAgICAgICdDZW50T1MnLFxuICAgICAgeyAnbGFiZWwnOiAnQ2hyb21lIE9TJywgJ3BhdHRlcm4nOiAnQ3JPUycgfSxcbiAgICAgICdEZWJpYW4nLFxuICAgICAgJ0ZlZG9yYScsXG4gICAgICAnRnJlZUJTRCcsXG4gICAgICAnR2VudG9vJyxcbiAgICAgICdIYWlrdScsXG4gICAgICAnS3VidW50dScsXG4gICAgICAnTGludXggTWludCcsXG4gICAgICAnT3BlbkJTRCcsXG4gICAgICAnUmVkIEhhdCcsXG4gICAgICAnU3VTRScsXG4gICAgICAnVWJ1bnR1JyxcbiAgICAgICdYdWJ1bnR1JyxcbiAgICAgICdDeWd3aW4nLFxuICAgICAgJ1N5bWJpYW4gT1MnLFxuICAgICAgJ2hwd09TJyxcbiAgICAgICd3ZWJPUyAnLFxuICAgICAgJ3dlYk9TJyxcbiAgICAgICdUYWJsZXQgT1MnLFxuICAgICAgJ1RpemVuJyxcbiAgICAgICdMaW51eCcsXG4gICAgICAnTWFjIE9TIFgnLFxuICAgICAgJ01hY2ludG9zaCcsXG4gICAgICAnTWFjJyxcbiAgICAgICdXaW5kb3dzIDk4OycsXG4gICAgICAnV2luZG93cyAnXG4gICAgXSk7XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvKipcbiAgICAgKiBQaWNrcyB0aGUgbGF5b3V0IGVuZ2luZSBmcm9tIGFuIGFycmF5IG9mIGd1ZXNzZXMuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGd1ZXNzZXMgQW4gYXJyYXkgb2YgZ3Vlc3Nlcy5cbiAgICAgKiBAcmV0dXJucyB7bnVsbHxzdHJpbmd9IFRoZSBkZXRlY3RlZCBsYXlvdXQgZW5naW5lLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldExheW91dChndWVzc2VzKSB7XG4gICAgICByZXR1cm4gcmVkdWNlKGd1ZXNzZXMsIGZ1bmN0aW9uKHJlc3VsdCwgZ3Vlc3MpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdCB8fCBSZWdFeHAoJ1xcXFxiJyArIChcbiAgICAgICAgICBndWVzcy5wYXR0ZXJuIHx8IHF1YWxpZnkoZ3Vlc3MpXG4gICAgICAgICkgKyAnXFxcXGInLCAnaScpLmV4ZWModWEpICYmIChndWVzcy5sYWJlbCB8fCBndWVzcyk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQaWNrcyB0aGUgbWFudWZhY3R1cmVyIGZyb20gYW4gYXJyYXkgb2YgZ3Vlc3Nlcy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtBcnJheX0gZ3Vlc3NlcyBBbiBvYmplY3Qgb2YgZ3Vlc3Nlcy5cbiAgICAgKiBAcmV0dXJucyB7bnVsbHxzdHJpbmd9IFRoZSBkZXRlY3RlZCBtYW51ZmFjdHVyZXIuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0TWFudWZhY3R1cmVyKGd1ZXNzZXMpIHtcbiAgICAgIHJldHVybiByZWR1Y2UoZ3Vlc3NlcywgZnVuY3Rpb24ocmVzdWx0LCB2YWx1ZSwga2V5KSB7XG4gICAgICAgIC8vIExvb2t1cCB0aGUgbWFudWZhY3R1cmVyIGJ5IHByb2R1Y3Qgb3Igc2NhbiB0aGUgVUEgZm9yIHRoZSBtYW51ZmFjdHVyZXIuXG4gICAgICAgIHJldHVybiByZXN1bHQgfHwgKFxuICAgICAgICAgIHZhbHVlW3Byb2R1Y3RdIHx8XG4gICAgICAgICAgdmFsdWVbL15bYS16XSsoPzogK1thLXpdK1xcYikqL2kuZXhlYyhwcm9kdWN0KV0gfHxcbiAgICAgICAgICBSZWdFeHAoJ1xcXFxiJyArIHF1YWxpZnkoa2V5KSArICcoPzpcXFxcYnxcXFxcdypcXFxcZCknLCAnaScpLmV4ZWModWEpXG4gICAgICAgICkgJiYga2V5O1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGlja3MgdGhlIGJyb3dzZXIgbmFtZSBmcm9tIGFuIGFycmF5IG9mIGd1ZXNzZXMuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGd1ZXNzZXMgQW4gYXJyYXkgb2YgZ3Vlc3Nlcy5cbiAgICAgKiBAcmV0dXJucyB7bnVsbHxzdHJpbmd9IFRoZSBkZXRlY3RlZCBicm93c2VyIG5hbWUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0TmFtZShndWVzc2VzKSB7XG4gICAgICByZXR1cm4gcmVkdWNlKGd1ZXNzZXMsIGZ1bmN0aW9uKHJlc3VsdCwgZ3Vlc3MpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdCB8fCBSZWdFeHAoJ1xcXFxiJyArIChcbiAgICAgICAgICBndWVzcy5wYXR0ZXJuIHx8IHF1YWxpZnkoZ3Vlc3MpXG4gICAgICAgICkgKyAnXFxcXGInLCAnaScpLmV4ZWModWEpICYmIChndWVzcy5sYWJlbCB8fCBndWVzcyk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQaWNrcyB0aGUgT1MgbmFtZSBmcm9tIGFuIGFycmF5IG9mIGd1ZXNzZXMuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGd1ZXNzZXMgQW4gYXJyYXkgb2YgZ3Vlc3Nlcy5cbiAgICAgKiBAcmV0dXJucyB7bnVsbHxzdHJpbmd9IFRoZSBkZXRlY3RlZCBPUyBuYW1lLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldE9TKGd1ZXNzZXMpIHtcbiAgICAgIHJldHVybiByZWR1Y2UoZ3Vlc3NlcywgZnVuY3Rpb24ocmVzdWx0LCBndWVzcykge1xuICAgICAgICB2YXIgcGF0dGVybiA9IGd1ZXNzLnBhdHRlcm4gfHwgcXVhbGlmeShndWVzcyk7XG4gICAgICAgIGlmICghcmVzdWx0ICYmIChyZXN1bHQgPVxuICAgICAgICAgICAgICBSZWdFeHAoJ1xcXFxiJyArIHBhdHRlcm4gKyAnKD86L1tcXFxcZC5dK3xbIFxcXFx3Ll0qKScsICdpJykuZXhlYyh1YSlcbiAgICAgICAgICAgICkpIHtcbiAgICAgICAgICByZXN1bHQgPSBjbGVhbnVwT1MocmVzdWx0LCBwYXR0ZXJuLCBndWVzcy5sYWJlbCB8fCBndWVzcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBpY2tzIHRoZSBwcm9kdWN0IG5hbWUgZnJvbSBhbiBhcnJheSBvZiBndWVzc2VzLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBndWVzc2VzIEFuIGFycmF5IG9mIGd1ZXNzZXMuXG4gICAgICogQHJldHVybnMge251bGx8c3RyaW5nfSBUaGUgZGV0ZWN0ZWQgcHJvZHVjdCBuYW1lLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldFByb2R1Y3QoZ3Vlc3Nlcykge1xuICAgICAgcmV0dXJuIHJlZHVjZShndWVzc2VzLCBmdW5jdGlvbihyZXN1bHQsIGd1ZXNzKSB7XG4gICAgICAgIHZhciBwYXR0ZXJuID0gZ3Vlc3MucGF0dGVybiB8fCBxdWFsaWZ5KGd1ZXNzKTtcbiAgICAgICAgaWYgKCFyZXN1bHQgJiYgKHJlc3VsdCA9XG4gICAgICAgICAgICAgIFJlZ0V4cCgnXFxcXGInICsgcGF0dGVybiArICcgKlxcXFxkK1suXFxcXHdfXSonLCAnaScpLmV4ZWModWEpIHx8XG4gICAgICAgICAgICAgIFJlZ0V4cCgnXFxcXGInICsgcGF0dGVybiArICcgKlxcXFx3Ky1bXFxcXHddKicsICdpJykuZXhlYyh1YSkgfHxcbiAgICAgICAgICAgICAgUmVnRXhwKCdcXFxcYicgKyBwYXR0ZXJuICsgJyg/OjsgKig/OlthLXpdK1tfLV0pP1thLXpdK1xcXFxkK3xbXiAoKTstXSopJywgJ2knKS5leGVjKHVhKVxuICAgICAgICAgICAgKSkge1xuICAgICAgICAgIC8vIFNwbGl0IGJ5IGZvcndhcmQgc2xhc2ggYW5kIGFwcGVuZCBwcm9kdWN0IHZlcnNpb24gaWYgbmVlZGVkLlxuICAgICAgICAgIGlmICgocmVzdWx0ID0gU3RyaW5nKChndWVzcy5sYWJlbCAmJiAhUmVnRXhwKHBhdHRlcm4sICdpJykudGVzdChndWVzcy5sYWJlbCkpID8gZ3Vlc3MubGFiZWwgOiByZXN1bHQpLnNwbGl0KCcvJykpWzFdICYmICEvW1xcZC5dKy8udGVzdChyZXN1bHRbMF0pKSB7XG4gICAgICAgICAgICByZXN1bHRbMF0gKz0gJyAnICsgcmVzdWx0WzFdO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBDb3JyZWN0IGNoYXJhY3RlciBjYXNlIGFuZCBjbGVhbnVwIHN0cmluZy5cbiAgICAgICAgICBndWVzcyA9IGd1ZXNzLmxhYmVsIHx8IGd1ZXNzO1xuICAgICAgICAgIHJlc3VsdCA9IGZvcm1hdChyZXN1bHRbMF1cbiAgICAgICAgICAgIC5yZXBsYWNlKFJlZ0V4cChwYXR0ZXJuLCAnaScpLCBndWVzcylcbiAgICAgICAgICAgIC5yZXBsYWNlKFJlZ0V4cCgnOyAqKD86JyArIGd1ZXNzICsgJ1tfLV0pPycsICdpJyksICcgJylcbiAgICAgICAgICAgIC5yZXBsYWNlKFJlZ0V4cCgnKCcgKyBndWVzcyArICcpWy1fLl0/KFxcXFx3KScsICdpJyksICckMSAkMicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzb2x2ZXMgdGhlIHZlcnNpb24gdXNpbmcgYW4gYXJyYXkgb2YgVUEgcGF0dGVybnMuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHBhdHRlcm5zIEFuIGFycmF5IG9mIFVBIHBhdHRlcm5zLlxuICAgICAqIEByZXR1cm5zIHtudWxsfHN0cmluZ30gVGhlIGRldGVjdGVkIHZlcnNpb24uXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0VmVyc2lvbihwYXR0ZXJucykge1xuICAgICAgcmV0dXJuIHJlZHVjZShwYXR0ZXJucywgZnVuY3Rpb24ocmVzdWx0LCBwYXR0ZXJuKSB7XG4gICAgICAgIHJldHVybiByZXN1bHQgfHwgKFJlZ0V4cChwYXR0ZXJuICtcbiAgICAgICAgICAnKD86LVtcXFxcZC5dKy98KD86IGZvciBbXFxcXHctXSspP1sgLy1dKShbXFxcXGQuXStbXiAoKTsvXy1dKiknLCAnaScpLmV4ZWModWEpIHx8IDApWzFdIHx8IG51bGw7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGBwbGF0Zm9ybS5kZXNjcmlwdGlvbmAgd2hlbiB0aGUgcGxhdGZvcm0gb2JqZWN0IGlzIGNvZXJjZWQgdG8gYSBzdHJpbmcuXG4gICAgICpcbiAgICAgKiBAbmFtZSB0b1N0cmluZ1xuICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybVxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgYHBsYXRmb3JtLmRlc2NyaXB0aW9uYCBpZiBhdmFpbGFibGUsIGVsc2UgYW4gZW1wdHkgc3RyaW5nLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRvU3RyaW5nUGxhdGZvcm0oKSB7XG4gICAgICByZXR1cm4gdGhpcy5kZXNjcmlwdGlvbiB8fCAnJztcbiAgICB9XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvLyBDb252ZXJ0IGxheW91dCB0byBhbiBhcnJheSBzbyB3ZSBjYW4gYWRkIGV4dHJhIGRldGFpbHMuXG4gICAgbGF5b3V0ICYmIChsYXlvdXQgPSBbbGF5b3V0XSk7XG5cbiAgICAvLyBEZXRlY3QgcHJvZHVjdCBuYW1lcyB0aGF0IGNvbnRhaW4gdGhlaXIgbWFudWZhY3R1cmVyJ3MgbmFtZS5cbiAgICBpZiAobWFudWZhY3R1cmVyICYmICFwcm9kdWN0KSB7XG4gICAgICBwcm9kdWN0ID0gZ2V0UHJvZHVjdChbbWFudWZhY3R1cmVyXSk7XG4gICAgfVxuICAgIC8vIENsZWFuIHVwIEdvb2dsZSBUVi5cbiAgICBpZiAoKGRhdGEgPSAvXFxiR29vZ2xlIFRWXFxiLy5leGVjKHByb2R1Y3QpKSkge1xuICAgICAgcHJvZHVjdCA9IGRhdGFbMF07XG4gICAgfVxuICAgIC8vIERldGVjdCBzaW11bGF0b3JzLlxuICAgIGlmICgvXFxiU2ltdWxhdG9yXFxiL2kudGVzdCh1YSkpIHtcbiAgICAgIHByb2R1Y3QgPSAocHJvZHVjdCA/IHByb2R1Y3QgKyAnICcgOiAnJykgKyAnU2ltdWxhdG9yJztcbiAgICB9XG4gICAgLy8gRGV0ZWN0IE9wZXJhIE1pbmkgOCsgcnVubmluZyBpbiBUdXJiby9VbmNvbXByZXNzZWQgbW9kZSBvbiBpT1MuXG4gICAgaWYgKG5hbWUgPT0gJ09wZXJhIE1pbmknICYmIC9cXGJPUGlPU1xcYi8udGVzdCh1YSkpIHtcbiAgICAgIGRlc2NyaXB0aW9uLnB1c2goJ3J1bm5pbmcgaW4gVHVyYm8vVW5jb21wcmVzc2VkIG1vZGUnKTtcbiAgICB9XG4gICAgLy8gRGV0ZWN0IElFIE1vYmlsZSAxMS5cbiAgICBpZiAobmFtZSA9PSAnSUUnICYmIC9cXGJsaWtlIGlQaG9uZSBPU1xcYi8udGVzdCh1YSkpIHtcbiAgICAgIGRhdGEgPSBwYXJzZSh1YS5yZXBsYWNlKC9saWtlIGlQaG9uZSBPUy8sICcnKSk7XG4gICAgICBtYW51ZmFjdHVyZXIgPSBkYXRhLm1hbnVmYWN0dXJlcjtcbiAgICAgIHByb2R1Y3QgPSBkYXRhLnByb2R1Y3Q7XG4gICAgfVxuICAgIC8vIERldGVjdCBpT1MuXG4gICAgZWxzZSBpZiAoL15pUC8udGVzdChwcm9kdWN0KSkge1xuICAgICAgbmFtZSB8fCAobmFtZSA9ICdTYWZhcmknKTtcbiAgICAgIG9zID0gJ2lPUycgKyAoKGRhdGEgPSAvIE9TIChbXFxkX10rKS9pLmV4ZWModWEpKVxuICAgICAgICA/ICcgJyArIGRhdGFbMV0ucmVwbGFjZSgvXy9nLCAnLicpXG4gICAgICAgIDogJycpO1xuICAgIH1cbiAgICAvLyBEZXRlY3QgS3VidW50dS5cbiAgICBlbHNlIGlmIChuYW1lID09ICdLb25xdWVyb3InICYmICEvYnVudHUvaS50ZXN0KG9zKSkge1xuICAgICAgb3MgPSAnS3VidW50dSc7XG4gICAgfVxuICAgIC8vIERldGVjdCBBbmRyb2lkIGJyb3dzZXJzLlxuICAgIGVsc2UgaWYgKChtYW51ZmFjdHVyZXIgJiYgbWFudWZhY3R1cmVyICE9ICdHb29nbGUnICYmXG4gICAgICAgICgoL0Nocm9tZS8udGVzdChuYW1lKSAmJiAhL1xcYk1vYmlsZSBTYWZhcmlcXGIvaS50ZXN0KHVhKSkgfHwgL1xcYlZpdGFcXGIvLnRlc3QocHJvZHVjdCkpKSB8fFxuICAgICAgICAoL1xcYkFuZHJvaWRcXGIvLnRlc3Qob3MpICYmIC9eQ2hyb21lLy50ZXN0KG5hbWUpICYmIC9cXGJWZXJzaW9uXFwvL2kudGVzdCh1YSkpKSB7XG4gICAgICBuYW1lID0gJ0FuZHJvaWQgQnJvd3Nlcic7XG4gICAgICBvcyA9IC9cXGJBbmRyb2lkXFxiLy50ZXN0KG9zKSA/IG9zIDogJ0FuZHJvaWQnO1xuICAgIH1cbiAgICAvLyBEZXRlY3QgU2lsayBkZXNrdG9wL2FjY2VsZXJhdGVkIG1vZGVzLlxuICAgIGVsc2UgaWYgKG5hbWUgPT0gJ1NpbGsnKSB7XG4gICAgICBpZiAoIS9cXGJNb2JpL2kudGVzdCh1YSkpIHtcbiAgICAgICAgb3MgPSAnQW5kcm9pZCc7XG4gICAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQoJ2Rlc2t0b3AgbW9kZScpO1xuICAgICAgfVxuICAgICAgaWYgKC9BY2NlbGVyYXRlZCAqPSAqdHJ1ZS9pLnRlc3QodWEpKSB7XG4gICAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQoJ2FjY2VsZXJhdGVkJyk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIERldGVjdCBQYWxlTW9vbiBpZGVudGlmeWluZyBhcyBGaXJlZm94LlxuICAgIGVsc2UgaWYgKG5hbWUgPT0gJ1BhbGVNb29uJyAmJiAoZGF0YSA9IC9cXGJGaXJlZm94XFwvKFtcXGQuXSspXFxiLy5leGVjKHVhKSkpIHtcbiAgICAgIGRlc2NyaXB0aW9uLnB1c2goJ2lkZW50aWZ5aW5nIGFzIEZpcmVmb3ggJyArIGRhdGFbMV0pO1xuICAgIH1cbiAgICAvLyBEZXRlY3QgRmlyZWZveCBPUyBhbmQgcHJvZHVjdHMgcnVubmluZyBGaXJlZm94LlxuICAgIGVsc2UgaWYgKG5hbWUgPT0gJ0ZpcmVmb3gnICYmIChkYXRhID0gL1xcYihNb2JpbGV8VGFibGV0fFRWKVxcYi9pLmV4ZWModWEpKSkge1xuICAgICAgb3MgfHwgKG9zID0gJ0ZpcmVmb3ggT1MnKTtcbiAgICAgIHByb2R1Y3QgfHwgKHByb2R1Y3QgPSBkYXRhWzFdKTtcbiAgICB9XG4gICAgLy8gRGV0ZWN0IGZhbHNlIHBvc2l0aXZlcyBmb3IgRmlyZWZveC9TYWZhcmkuXG4gICAgZWxzZSBpZiAoIW5hbWUgfHwgKGRhdGEgPSAhL1xcYk1pbmVmaWVsZFxcYi9pLnRlc3QodWEpICYmIC9cXGIoPzpGaXJlZm94fFNhZmFyaSlcXGIvLmV4ZWMobmFtZSkpKSB7XG4gICAgICAvLyBFc2NhcGUgdGhlIGAvYCBmb3IgRmlyZWZveCAxLlxuICAgICAgaWYgKG5hbWUgJiYgIXByb2R1Y3QgJiYgL1tcXC8sXXxeW14oXSs/XFwpLy50ZXN0KHVhLnNsaWNlKHVhLmluZGV4T2YoZGF0YSArICcvJykgKyA4KSkpIHtcbiAgICAgICAgLy8gQ2xlYXIgbmFtZSBvZiBmYWxzZSBwb3NpdGl2ZXMuXG4gICAgICAgIG5hbWUgPSBudWxsO1xuICAgICAgfVxuICAgICAgLy8gUmVhc3NpZ24gYSBnZW5lcmljIG5hbWUuXG4gICAgICBpZiAoKGRhdGEgPSBwcm9kdWN0IHx8IG1hbnVmYWN0dXJlciB8fCBvcykgJiZcbiAgICAgICAgICAocHJvZHVjdCB8fCBtYW51ZmFjdHVyZXIgfHwgL1xcYig/OkFuZHJvaWR8U3ltYmlhbiBPU3xUYWJsZXQgT1N8d2ViT1MpXFxiLy50ZXN0KG9zKSkpIHtcbiAgICAgICAgbmFtZSA9IC9bYS16XSsoPzogSGF0KT8vaS5leGVjKC9cXGJBbmRyb2lkXFxiLy50ZXN0KG9zKSA/IG9zIDogZGF0YSkgKyAnIEJyb3dzZXInO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBBZGQgQ2hyb21lIHZlcnNpb24gdG8gZGVzY3JpcHRpb24gZm9yIEVsZWN0cm9uLlxuICAgIGVsc2UgaWYgKG5hbWUgPT0gJ0VsZWN0cm9uJyAmJiAoZGF0YSA9ICgvXFxiQ2hyb21lXFwvKFtcXGQuXSspXFxiLy5leGVjKHVhKSB8fCAwKVsxXSkpIHtcbiAgICAgIGRlc2NyaXB0aW9uLnB1c2goJ0Nocm9taXVtICcgKyBkYXRhKTtcbiAgICB9XG4gICAgLy8gRGV0ZWN0IG5vbi1PcGVyYSAoUHJlc3RvLWJhc2VkKSB2ZXJzaW9ucyAob3JkZXIgaXMgaW1wb3J0YW50KS5cbiAgICBpZiAoIXZlcnNpb24pIHtcbiAgICAgIHZlcnNpb24gPSBnZXRWZXJzaW9uKFtcbiAgICAgICAgJyg/OkNsb3VkOXxDcmlPU3xDck1vfEVkZ2V8RnhpT1N8SUVNb2JpbGV8SXJvbnxPcGVyYSA/TWluaXxPUGlPU3xPUFJ8UmF2ZW58U2Ftc3VuZ0Jyb3dzZXJ8U2lsayg/IS9bXFxcXGQuXSskKSknLFxuICAgICAgICAnVmVyc2lvbicsXG4gICAgICAgIHF1YWxpZnkobmFtZSksXG4gICAgICAgICcoPzpGaXJlZm94fE1pbmVmaWVsZHxOZXRGcm9udCknXG4gICAgICBdKTtcbiAgICB9XG4gICAgLy8gRGV0ZWN0IHN0dWJib3JuIGxheW91dCBlbmdpbmVzLlxuICAgIGlmICgoZGF0YSA9XG4gICAgICAgICAgbGF5b3V0ID09ICdpQ2FiJyAmJiBwYXJzZUZsb2F0KHZlcnNpb24pID4gMyAmJiAnV2ViS2l0JyB8fFxuICAgICAgICAgIC9cXGJPcGVyYVxcYi8udGVzdChuYW1lKSAmJiAoL1xcYk9QUlxcYi8udGVzdCh1YSkgPyAnQmxpbmsnIDogJ1ByZXN0bycpIHx8XG4gICAgICAgICAgL1xcYig/Ok1pZG9yaXxOb29rfFNhZmFyaSlcXGIvaS50ZXN0KHVhKSAmJiAhL14oPzpUcmlkZW50fEVkZ2VIVE1MKSQvLnRlc3QobGF5b3V0KSAmJiAnV2ViS2l0JyB8fFxuICAgICAgICAgICFsYXlvdXQgJiYgL1xcYk1TSUVcXGIvaS50ZXN0KHVhKSAmJiAob3MgPT0gJ01hYyBPUycgPyAnVGFzbWFuJyA6ICdUcmlkZW50JykgfHxcbiAgICAgICAgICBsYXlvdXQgPT0gJ1dlYktpdCcgJiYgL1xcYlBsYXlTdGF0aW9uXFxiKD8hIFZpdGFcXGIpL2kudGVzdChuYW1lKSAmJiAnTmV0RnJvbnQnXG4gICAgICAgICkpIHtcbiAgICAgIGxheW91dCA9IFtkYXRhXTtcbiAgICB9XG4gICAgLy8gRGV0ZWN0IFdpbmRvd3MgUGhvbmUgNyBkZXNrdG9wIG1vZGUuXG4gICAgaWYgKG5hbWUgPT0gJ0lFJyAmJiAoZGF0YSA9ICgvOyAqKD86WEJMV1B8WnVuZVdQKShcXGQrKS9pLmV4ZWModWEpIHx8IDApWzFdKSkge1xuICAgICAgbmFtZSArPSAnIE1vYmlsZSc7XG4gICAgICBvcyA9ICdXaW5kb3dzIFBob25lICcgKyAoL1xcKyQvLnRlc3QoZGF0YSkgPyBkYXRhIDogZGF0YSArICcueCcpO1xuICAgICAgZGVzY3JpcHRpb24udW5zaGlmdCgnZGVza3RvcCBtb2RlJyk7XG4gICAgfVxuICAgIC8vIERldGVjdCBXaW5kb3dzIFBob25lIDgueCBkZXNrdG9wIG1vZGUuXG4gICAgZWxzZSBpZiAoL1xcYldQRGVza3RvcFxcYi9pLnRlc3QodWEpKSB7XG4gICAgICBuYW1lID0gJ0lFIE1vYmlsZSc7XG4gICAgICBvcyA9ICdXaW5kb3dzIFBob25lIDgueCc7XG4gICAgICBkZXNjcmlwdGlvbi51bnNoaWZ0KCdkZXNrdG9wIG1vZGUnKTtcbiAgICAgIHZlcnNpb24gfHwgKHZlcnNpb24gPSAoL1xcYnJ2OihbXFxkLl0rKS8uZXhlYyh1YSkgfHwgMClbMV0pO1xuICAgIH1cbiAgICAvLyBEZXRlY3QgSUUgMTEgaWRlbnRpZnlpbmcgYXMgb3RoZXIgYnJvd3NlcnMuXG4gICAgZWxzZSBpZiAobmFtZSAhPSAnSUUnICYmIGxheW91dCA9PSAnVHJpZGVudCcgJiYgKGRhdGEgPSAvXFxicnY6KFtcXGQuXSspLy5leGVjKHVhKSkpIHtcbiAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgIGRlc2NyaXB0aW9uLnB1c2goJ2lkZW50aWZ5aW5nIGFzICcgKyBuYW1lICsgKHZlcnNpb24gPyAnICcgKyB2ZXJzaW9uIDogJycpKTtcbiAgICAgIH1cbiAgICAgIG5hbWUgPSAnSUUnO1xuICAgICAgdmVyc2lvbiA9IGRhdGFbMV07XG4gICAgfVxuICAgIC8vIExldmVyYWdlIGVudmlyb25tZW50IGZlYXR1cmVzLlxuICAgIGlmICh1c2VGZWF0dXJlcykge1xuICAgICAgLy8gRGV0ZWN0IHNlcnZlci1zaWRlIGVudmlyb25tZW50cy5cbiAgICAgIC8vIFJoaW5vIGhhcyBhIGdsb2JhbCBmdW5jdGlvbiB3aGlsZSBvdGhlcnMgaGF2ZSBhIGdsb2JhbCBvYmplY3QuXG4gICAgICBpZiAoaXNIb3N0VHlwZShjb250ZXh0LCAnZ2xvYmFsJykpIHtcbiAgICAgICAgaWYgKGphdmEpIHtcbiAgICAgICAgICBkYXRhID0gamF2YS5sYW5nLlN5c3RlbTtcbiAgICAgICAgICBhcmNoID0gZGF0YS5nZXRQcm9wZXJ0eSgnb3MuYXJjaCcpO1xuICAgICAgICAgIG9zID0gb3MgfHwgZGF0YS5nZXRQcm9wZXJ0eSgnb3MubmFtZScpICsgJyAnICsgZGF0YS5nZXRQcm9wZXJ0eSgnb3MudmVyc2lvbicpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc01vZHVsZVNjb3BlICYmIGlzSG9zdFR5cGUoY29udGV4dCwgJ3N5c3RlbScpICYmIChkYXRhID0gW2NvbnRleHQuc3lzdGVtXSlbMF0pIHtcbiAgICAgICAgICBvcyB8fCAob3MgPSBkYXRhWzBdLm9zIHx8IG51bGwpO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBkYXRhWzFdID0gY29udGV4dC5yZXF1aXJlKCdyaW5nby9lbmdpbmUnKS52ZXJzaW9uO1xuICAgICAgICAgICAgdmVyc2lvbiA9IGRhdGFbMV0uam9pbignLicpO1xuICAgICAgICAgICAgbmFtZSA9ICdSaW5nb0pTJztcbiAgICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgIGlmIChkYXRhWzBdLmdsb2JhbC5zeXN0ZW0gPT0gY29udGV4dC5zeXN0ZW0pIHtcbiAgICAgICAgICAgICAgbmFtZSA9ICdOYXJ3aGFsJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoXG4gICAgICAgICAgdHlwZW9mIGNvbnRleHQucHJvY2VzcyA9PSAnb2JqZWN0JyAmJiAhY29udGV4dC5wcm9jZXNzLmJyb3dzZXIgJiZcbiAgICAgICAgICAoZGF0YSA9IGNvbnRleHQucHJvY2VzcylcbiAgICAgICAgKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBkYXRhLnZlcnNpb25zID09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGRhdGEudmVyc2lvbnMuZWxlY3Ryb24gPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb24ucHVzaCgnTm9kZSAnICsgZGF0YS52ZXJzaW9ucy5ub2RlKTtcbiAgICAgICAgICAgICAgbmFtZSA9ICdFbGVjdHJvbic7XG4gICAgICAgICAgICAgIHZlcnNpb24gPSBkYXRhLnZlcnNpb25zLmVsZWN0cm9uO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZGF0YS52ZXJzaW9ucy5udyA9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICBkZXNjcmlwdGlvbi5wdXNoKCdDaHJvbWl1bSAnICsgdmVyc2lvbiwgJ05vZGUgJyArIGRhdGEudmVyc2lvbnMubm9kZSk7XG4gICAgICAgICAgICAgIG5hbWUgPSAnTlcuanMnO1xuICAgICAgICAgICAgICB2ZXJzaW9uID0gZGF0YS52ZXJzaW9ucy5udztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmFtZSA9ICdOb2RlLmpzJztcbiAgICAgICAgICAgIGFyY2ggPSBkYXRhLmFyY2g7XG4gICAgICAgICAgICBvcyA9IGRhdGEucGxhdGZvcm07XG4gICAgICAgICAgICB2ZXJzaW9uID0gL1tcXGQuXSsvLmV4ZWMoZGF0YS52ZXJzaW9uKVxuICAgICAgICAgICAgdmVyc2lvbiA9IHZlcnNpb24gPyB2ZXJzaW9uWzBdIDogJ3Vua25vd24nO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChyaGlubykge1xuICAgICAgICAgIG5hbWUgPSAnUmhpbm8nO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBEZXRlY3QgQWRvYmUgQUlSLlxuICAgICAgZWxzZSBpZiAoZ2V0Q2xhc3NPZigoZGF0YSA9IGNvbnRleHQucnVudGltZSkpID09IGFpclJ1bnRpbWVDbGFzcykge1xuICAgICAgICBuYW1lID0gJ0Fkb2JlIEFJUic7XG4gICAgICAgIG9zID0gZGF0YS5mbGFzaC5zeXN0ZW0uQ2FwYWJpbGl0aWVzLm9zO1xuICAgICAgfVxuICAgICAgLy8gRGV0ZWN0IFBoYW50b21KUy5cbiAgICAgIGVsc2UgaWYgKGdldENsYXNzT2YoKGRhdGEgPSBjb250ZXh0LnBoYW50b20pKSA9PSBwaGFudG9tQ2xhc3MpIHtcbiAgICAgICAgbmFtZSA9ICdQaGFudG9tSlMnO1xuICAgICAgICB2ZXJzaW9uID0gKGRhdGEgPSBkYXRhLnZlcnNpb24gfHwgbnVsbCkgJiYgKGRhdGEubWFqb3IgKyAnLicgKyBkYXRhLm1pbm9yICsgJy4nICsgZGF0YS5wYXRjaCk7XG4gICAgICB9XG4gICAgICAvLyBEZXRlY3QgSUUgY29tcGF0aWJpbGl0eSBtb2Rlcy5cbiAgICAgIGVsc2UgaWYgKHR5cGVvZiBkb2MuZG9jdW1lbnRNb2RlID09ICdudW1iZXInICYmIChkYXRhID0gL1xcYlRyaWRlbnRcXC8oXFxkKykvaS5leGVjKHVhKSkpIHtcbiAgICAgICAgLy8gV2UncmUgaW4gY29tcGF0aWJpbGl0eSBtb2RlIHdoZW4gdGhlIFRyaWRlbnQgdmVyc2lvbiArIDQgZG9lc24ndFxuICAgICAgICAvLyBlcXVhbCB0aGUgZG9jdW1lbnQgbW9kZS5cbiAgICAgICAgdmVyc2lvbiA9IFt2ZXJzaW9uLCBkb2MuZG9jdW1lbnRNb2RlXTtcbiAgICAgICAgaWYgKChkYXRhID0gK2RhdGFbMV0gKyA0KSAhPSB2ZXJzaW9uWzFdKSB7XG4gICAgICAgICAgZGVzY3JpcHRpb24ucHVzaCgnSUUgJyArIHZlcnNpb25bMV0gKyAnIG1vZGUnKTtcbiAgICAgICAgICBsYXlvdXQgJiYgKGxheW91dFsxXSA9ICcnKTtcbiAgICAgICAgICB2ZXJzaW9uWzFdID0gZGF0YTtcbiAgICAgICAgfVxuICAgICAgICB2ZXJzaW9uID0gbmFtZSA9PSAnSUUnID8gU3RyaW5nKHZlcnNpb25bMV0udG9GaXhlZCgxKSkgOiB2ZXJzaW9uWzBdO1xuICAgICAgfVxuICAgICAgLy8gRGV0ZWN0IElFIDExIG1hc2tpbmcgYXMgb3RoZXIgYnJvd3NlcnMuXG4gICAgICBlbHNlIGlmICh0eXBlb2YgZG9jLmRvY3VtZW50TW9kZSA9PSAnbnVtYmVyJyAmJiAvXig/OkNocm9tZXxGaXJlZm94KVxcYi8udGVzdChuYW1lKSkge1xuICAgICAgICBkZXNjcmlwdGlvbi5wdXNoKCdtYXNraW5nIGFzICcgKyBuYW1lICsgJyAnICsgdmVyc2lvbik7XG4gICAgICAgIG5hbWUgPSAnSUUnO1xuICAgICAgICB2ZXJzaW9uID0gJzExLjAnO1xuICAgICAgICBsYXlvdXQgPSBbJ1RyaWRlbnQnXTtcbiAgICAgICAgb3MgPSAnV2luZG93cyc7XG4gICAgICB9XG4gICAgICBvcyA9IG9zICYmIGZvcm1hdChvcyk7XG4gICAgfVxuICAgIC8vIERldGVjdCBwcmVyZWxlYXNlIHBoYXNlcy5cbiAgICBpZiAodmVyc2lvbiAmJiAoZGF0YSA9XG4gICAgICAgICAgLyg/OlthYl18ZHB8cHJlfFthYl1cXGQrcHJlKSg/OlxcZCtcXCs/KT8kL2kuZXhlYyh2ZXJzaW9uKSB8fFxuICAgICAgICAgIC8oPzphbHBoYXxiZXRhKSg/OiA/XFxkKT8vaS5leGVjKHVhICsgJzsnICsgKHVzZUZlYXR1cmVzICYmIG5hdi5hcHBNaW5vclZlcnNpb24pKSB8fFxuICAgICAgICAgIC9cXGJNaW5lZmllbGRcXGIvaS50ZXN0KHVhKSAmJiAnYSdcbiAgICAgICAgKSkge1xuICAgICAgcHJlcmVsZWFzZSA9IC9iL2kudGVzdChkYXRhKSA/ICdiZXRhJyA6ICdhbHBoYSc7XG4gICAgICB2ZXJzaW9uID0gdmVyc2lvbi5yZXBsYWNlKFJlZ0V4cChkYXRhICsgJ1xcXFwrPyQnKSwgJycpICtcbiAgICAgICAgKHByZXJlbGVhc2UgPT0gJ2JldGEnID8gYmV0YSA6IGFscGhhKSArICgvXFxkK1xcKz8vLmV4ZWMoZGF0YSkgfHwgJycpO1xuICAgIH1cbiAgICAvLyBEZXRlY3QgRmlyZWZveCBNb2JpbGUuXG4gICAgaWYgKG5hbWUgPT0gJ0Zlbm5lYycgfHwgbmFtZSA9PSAnRmlyZWZveCcgJiYgL1xcYig/OkFuZHJvaWR8RmlyZWZveCBPUylcXGIvLnRlc3Qob3MpKSB7XG4gICAgICBuYW1lID0gJ0ZpcmVmb3ggTW9iaWxlJztcbiAgICB9XG4gICAgLy8gT2JzY3VyZSBNYXh0aG9uJ3MgdW5yZWxpYWJsZSB2ZXJzaW9uLlxuICAgIGVsc2UgaWYgKG5hbWUgPT0gJ01heHRob24nICYmIHZlcnNpb24pIHtcbiAgICAgIHZlcnNpb24gPSB2ZXJzaW9uLnJlcGxhY2UoL1xcLltcXGQuXSsvLCAnLngnKTtcbiAgICB9XG4gICAgLy8gRGV0ZWN0IFhib3ggMzYwIGFuZCBYYm94IE9uZS5cbiAgICBlbHNlIGlmICgvXFxiWGJveFxcYi9pLnRlc3QocHJvZHVjdCkpIHtcbiAgICAgIGlmIChwcm9kdWN0ID09ICdYYm94IDM2MCcpIHtcbiAgICAgICAgb3MgPSBudWxsO1xuICAgICAgfVxuICAgICAgaWYgKHByb2R1Y3QgPT0gJ1hib3ggMzYwJyAmJiAvXFxiSUVNb2JpbGVcXGIvLnRlc3QodWEpKSB7XG4gICAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQoJ21vYmlsZSBtb2RlJyk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIEFkZCBtb2JpbGUgcG9zdGZpeC5cbiAgICBlbHNlIGlmICgoL14oPzpDaHJvbWV8SUV8T3BlcmEpJC8udGVzdChuYW1lKSB8fCBuYW1lICYmICFwcm9kdWN0ICYmICEvQnJvd3NlcnxNb2JpLy50ZXN0KG5hbWUpKSAmJlxuICAgICAgICAob3MgPT0gJ1dpbmRvd3MgQ0UnIHx8IC9Nb2JpL2kudGVzdCh1YSkpKSB7XG4gICAgICBuYW1lICs9ICcgTW9iaWxlJztcbiAgICB9XG4gICAgLy8gRGV0ZWN0IElFIHBsYXRmb3JtIHByZXZpZXcuXG4gICAgZWxzZSBpZiAobmFtZSA9PSAnSUUnICYmIHVzZUZlYXR1cmVzKSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoY29udGV4dC5leHRlcm5hbCA9PT0gbnVsbCkge1xuICAgICAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQoJ3BsYXRmb3JtIHByZXZpZXcnKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQoJ2VtYmVkZGVkJyk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIERldGVjdCBCbGFja0JlcnJ5IE9TIHZlcnNpb24uXG4gICAgLy8gaHR0cDovL2RvY3MuYmxhY2tiZXJyeS5jb20vZW4vZGV2ZWxvcGVycy9kZWxpdmVyYWJsZXMvMTgxNjkvSFRUUF9oZWFkZXJzX3NlbnRfYnlfQkJfQnJvd3Nlcl8xMjM0OTExXzExLmpzcFxuICAgIGVsc2UgaWYgKCgvXFxiQmxhY2tCZXJyeVxcYi8udGVzdChwcm9kdWN0KSB8fCAvXFxiQkIxMFxcYi8udGVzdCh1YSkpICYmIChkYXRhID1cbiAgICAgICAgICAoUmVnRXhwKHByb2R1Y3QucmVwbGFjZSgvICsvZywgJyAqJykgKyAnLyhbLlxcXFxkXSspJywgJ2knKS5leGVjKHVhKSB8fCAwKVsxXSB8fFxuICAgICAgICAgIHZlcnNpb25cbiAgICAgICAgKSkge1xuICAgICAgZGF0YSA9IFtkYXRhLCAvQkIxMC8udGVzdCh1YSldO1xuICAgICAgb3MgPSAoZGF0YVsxXSA/IChwcm9kdWN0ID0gbnVsbCwgbWFudWZhY3R1cmVyID0gJ0JsYWNrQmVycnknKSA6ICdEZXZpY2UgU29mdHdhcmUnKSArICcgJyArIGRhdGFbMF07XG4gICAgICB2ZXJzaW9uID0gbnVsbDtcbiAgICB9XG4gICAgLy8gRGV0ZWN0IE9wZXJhIGlkZW50aWZ5aW5nL21hc2tpbmcgaXRzZWxmIGFzIGFub3RoZXIgYnJvd3Nlci5cbiAgICAvLyBodHRwOi8vd3d3Lm9wZXJhLmNvbS9zdXBwb3J0L2tiL3ZpZXcvODQzL1xuICAgIGVsc2UgaWYgKHRoaXMgIT0gZm9yT3duICYmIHByb2R1Y3QgIT0gJ1dpaScgJiYgKFxuICAgICAgICAgICh1c2VGZWF0dXJlcyAmJiBvcGVyYSkgfHxcbiAgICAgICAgICAoL09wZXJhLy50ZXN0KG5hbWUpICYmIC9cXGIoPzpNU0lFfEZpcmVmb3gpXFxiL2kudGVzdCh1YSkpIHx8XG4gICAgICAgICAgKG5hbWUgPT0gJ0ZpcmVmb3gnICYmIC9cXGJPUyBYICg/OlxcZCtcXC4pezIsfS8udGVzdChvcykpIHx8XG4gICAgICAgICAgKG5hbWUgPT0gJ0lFJyAmJiAoXG4gICAgICAgICAgICAob3MgJiYgIS9eV2luLy50ZXN0KG9zKSAmJiB2ZXJzaW9uID4gNS41KSB8fFxuICAgICAgICAgICAgL1xcYldpbmRvd3MgWFBcXGIvLnRlc3Qob3MpICYmIHZlcnNpb24gPiA4IHx8XG4gICAgICAgICAgICB2ZXJzaW9uID09IDggJiYgIS9cXGJUcmlkZW50XFxiLy50ZXN0KHVhKVxuICAgICAgICAgICkpXG4gICAgICAgICkgJiYgIXJlT3BlcmEudGVzdCgoZGF0YSA9IHBhcnNlLmNhbGwoZm9yT3duLCB1YS5yZXBsYWNlKHJlT3BlcmEsICcnKSArICc7JykpKSAmJiBkYXRhLm5hbWUpIHtcbiAgICAgIC8vIFdoZW4gXCJpZGVudGlmeWluZ1wiLCB0aGUgVUEgY29udGFpbnMgYm90aCBPcGVyYSBhbmQgdGhlIG90aGVyIGJyb3dzZXIncyBuYW1lLlxuICAgICAgZGF0YSA9ICdpbmcgYXMgJyArIGRhdGEubmFtZSArICgoZGF0YSA9IGRhdGEudmVyc2lvbikgPyAnICcgKyBkYXRhIDogJycpO1xuICAgICAgaWYgKHJlT3BlcmEudGVzdChuYW1lKSkge1xuICAgICAgICBpZiAoL1xcYklFXFxiLy50ZXN0KGRhdGEpICYmIG9zID09ICdNYWMgT1MnKSB7XG4gICAgICAgICAgb3MgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGRhdGEgPSAnaWRlbnRpZnknICsgZGF0YTtcbiAgICAgIH1cbiAgICAgIC8vIFdoZW4gXCJtYXNraW5nXCIsIHRoZSBVQSBjb250YWlucyBvbmx5IHRoZSBvdGhlciBicm93c2VyJ3MgbmFtZS5cbiAgICAgIGVsc2Uge1xuICAgICAgICBkYXRhID0gJ21hc2snICsgZGF0YTtcbiAgICAgICAgaWYgKG9wZXJhQ2xhc3MpIHtcbiAgICAgICAgICBuYW1lID0gZm9ybWF0KG9wZXJhQ2xhc3MucmVwbGFjZSgvKFthLXpdKShbQS1aXSkvZywgJyQxICQyJykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5hbWUgPSAnT3BlcmEnO1xuICAgICAgICB9XG4gICAgICAgIGlmICgvXFxiSUVcXGIvLnRlc3QoZGF0YSkpIHtcbiAgICAgICAgICBvcyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF1c2VGZWF0dXJlcykge1xuICAgICAgICAgIHZlcnNpb24gPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsYXlvdXQgPSBbJ1ByZXN0byddO1xuICAgICAgZGVzY3JpcHRpb24ucHVzaChkYXRhKTtcbiAgICB9XG4gICAgLy8gRGV0ZWN0IFdlYktpdCBOaWdodGx5IGFuZCBhcHByb3hpbWF0ZSBDaHJvbWUvU2FmYXJpIHZlcnNpb25zLlxuICAgIGlmICgoZGF0YSA9ICgvXFxiQXBwbGVXZWJLaXRcXC8oW1xcZC5dK1xcKz8pL2kuZXhlYyh1YSkgfHwgMClbMV0pKSB7XG4gICAgICAvLyBDb3JyZWN0IGJ1aWxkIG51bWJlciBmb3IgbnVtZXJpYyBjb21wYXJpc29uLlxuICAgICAgLy8gKGUuZy4gXCI1MzIuNVwiIGJlY29tZXMgXCI1MzIuMDVcIilcbiAgICAgIGRhdGEgPSBbcGFyc2VGbG9hdChkYXRhLnJlcGxhY2UoL1xcLihcXGQpJC8sICcuMCQxJykpLCBkYXRhXTtcbiAgICAgIC8vIE5pZ2h0bHkgYnVpbGRzIGFyZSBwb3N0Zml4ZWQgd2l0aCBhIFwiK1wiLlxuICAgICAgaWYgKG5hbWUgPT0gJ1NhZmFyaScgJiYgZGF0YVsxXS5zbGljZSgtMSkgPT0gJysnKSB7XG4gICAgICAgIG5hbWUgPSAnV2ViS2l0IE5pZ2h0bHknO1xuICAgICAgICBwcmVyZWxlYXNlID0gJ2FscGhhJztcbiAgICAgICAgdmVyc2lvbiA9IGRhdGFbMV0uc2xpY2UoMCwgLTEpO1xuICAgICAgfVxuICAgICAgLy8gQ2xlYXIgaW5jb3JyZWN0IGJyb3dzZXIgdmVyc2lvbnMuXG4gICAgICBlbHNlIGlmICh2ZXJzaW9uID09IGRhdGFbMV0gfHxcbiAgICAgICAgICB2ZXJzaW9uID09IChkYXRhWzJdID0gKC9cXGJTYWZhcmlcXC8oW1xcZC5dK1xcKz8pL2kuZXhlYyh1YSkgfHwgMClbMV0pKSB7XG4gICAgICAgIHZlcnNpb24gPSBudWxsO1xuICAgICAgfVxuICAgICAgLy8gVXNlIHRoZSBmdWxsIENocm9tZSB2ZXJzaW9uIHdoZW4gYXZhaWxhYmxlLlxuICAgICAgZGF0YVsxXSA9ICgvXFxiQ2hyb21lXFwvKFtcXGQuXSspL2kuZXhlYyh1YSkgfHwgMClbMV07XG4gICAgICAvLyBEZXRlY3QgQmxpbmsgbGF5b3V0IGVuZ2luZS5cbiAgICAgIGlmIChkYXRhWzBdID09IDUzNy4zNiAmJiBkYXRhWzJdID09IDUzNy4zNiAmJiBwYXJzZUZsb2F0KGRhdGFbMV0pID49IDI4ICYmIGxheW91dCA9PSAnV2ViS2l0Jykge1xuICAgICAgICBsYXlvdXQgPSBbJ0JsaW5rJ107XG4gICAgICB9XG4gICAgICAvLyBEZXRlY3QgSmF2YVNjcmlwdENvcmUuXG4gICAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzY3Njg0NzQvaG93LWNhbi1pLWRldGVjdC13aGljaC1qYXZhc2NyaXB0LWVuZ2luZS12OC1vci1qc2MtaXMtdXNlZC1hdC1ydW50aW1lLWluLWFuZHJvaVxuICAgICAgaWYgKCF1c2VGZWF0dXJlcyB8fCAoIWxpa2VDaHJvbWUgJiYgIWRhdGFbMV0pKSB7XG4gICAgICAgIGxheW91dCAmJiAobGF5b3V0WzFdID0gJ2xpa2UgU2FmYXJpJyk7XG4gICAgICAgIGRhdGEgPSAoZGF0YSA9IGRhdGFbMF0sIGRhdGEgPCA0MDAgPyAxIDogZGF0YSA8IDUwMCA/IDIgOiBkYXRhIDwgNTI2ID8gMyA6IGRhdGEgPCA1MzMgPyA0IDogZGF0YSA8IDUzNCA/ICc0KycgOiBkYXRhIDwgNTM1ID8gNSA6IGRhdGEgPCA1MzcgPyA2IDogZGF0YSA8IDUzOCA/IDcgOiBkYXRhIDwgNjAxID8gOCA6ICc4Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsYXlvdXQgJiYgKGxheW91dFsxXSA9ICdsaWtlIENocm9tZScpO1xuICAgICAgICBkYXRhID0gZGF0YVsxXSB8fCAoZGF0YSA9IGRhdGFbMF0sIGRhdGEgPCA1MzAgPyAxIDogZGF0YSA8IDUzMiA/IDIgOiBkYXRhIDwgNTMyLjA1ID8gMyA6IGRhdGEgPCA1MzMgPyA0IDogZGF0YSA8IDUzNC4wMyA/IDUgOiBkYXRhIDwgNTM0LjA3ID8gNiA6IGRhdGEgPCA1MzQuMTAgPyA3IDogZGF0YSA8IDUzNC4xMyA/IDggOiBkYXRhIDwgNTM0LjE2ID8gOSA6IGRhdGEgPCA1MzQuMjQgPyAxMCA6IGRhdGEgPCA1MzQuMzAgPyAxMSA6IGRhdGEgPCA1MzUuMDEgPyAxMiA6IGRhdGEgPCA1MzUuMDIgPyAnMTMrJyA6IGRhdGEgPCA1MzUuMDcgPyAxNSA6IGRhdGEgPCA1MzUuMTEgPyAxNiA6IGRhdGEgPCA1MzUuMTkgPyAxNyA6IGRhdGEgPCA1MzYuMDUgPyAxOCA6IGRhdGEgPCA1MzYuMTAgPyAxOSA6IGRhdGEgPCA1MzcuMDEgPyAyMCA6IGRhdGEgPCA1MzcuMTEgPyAnMjErJyA6IGRhdGEgPCA1MzcuMTMgPyAyMyA6IGRhdGEgPCA1MzcuMTggPyAyNCA6IGRhdGEgPCA1MzcuMjQgPyAyNSA6IGRhdGEgPCA1MzcuMzYgPyAyNiA6IGxheW91dCAhPSAnQmxpbmsnID8gJzI3JyA6ICcyOCcpO1xuICAgICAgfVxuICAgICAgLy8gQWRkIHRoZSBwb3N0Zml4IG9mIFwiLnhcIiBvciBcIitcIiBmb3IgYXBwcm94aW1hdGUgdmVyc2lvbnMuXG4gICAgICBsYXlvdXQgJiYgKGxheW91dFsxXSArPSAnICcgKyAoZGF0YSArPSB0eXBlb2YgZGF0YSA9PSAnbnVtYmVyJyA/ICcueCcgOiAvWy4rXS8udGVzdChkYXRhKSA/ICcnIDogJysnKSk7XG4gICAgICAvLyBPYnNjdXJlIHZlcnNpb24gZm9yIHNvbWUgU2FmYXJpIDEtMiByZWxlYXNlcy5cbiAgICAgIGlmIChuYW1lID09ICdTYWZhcmknICYmICghdmVyc2lvbiB8fCBwYXJzZUludCh2ZXJzaW9uKSA+IDQ1KSkge1xuICAgICAgICB2ZXJzaW9uID0gZGF0YTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gRGV0ZWN0IE9wZXJhIGRlc2t0b3AgbW9kZXMuXG4gICAgaWYgKG5hbWUgPT0gJ09wZXJhJyAmJiAgKGRhdGEgPSAvXFxiemJvdnx6dmF2JC8uZXhlYyhvcykpKSB7XG4gICAgICBuYW1lICs9ICcgJztcbiAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQoJ2Rlc2t0b3AgbW9kZScpO1xuICAgICAgaWYgKGRhdGEgPT0gJ3p2YXYnKSB7XG4gICAgICAgIG5hbWUgKz0gJ01pbmknO1xuICAgICAgICB2ZXJzaW9uID0gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5hbWUgKz0gJ01vYmlsZSc7XG4gICAgICB9XG4gICAgICBvcyA9IG9zLnJlcGxhY2UoUmVnRXhwKCcgKicgKyBkYXRhICsgJyQnKSwgJycpO1xuICAgIH1cbiAgICAvLyBEZXRlY3QgQ2hyb21lIGRlc2t0b3AgbW9kZS5cbiAgICBlbHNlIGlmIChuYW1lID09ICdTYWZhcmknICYmIC9cXGJDaHJvbWVcXGIvLmV4ZWMobGF5b3V0ICYmIGxheW91dFsxXSkpIHtcbiAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQoJ2Rlc2t0b3AgbW9kZScpO1xuICAgICAgbmFtZSA9ICdDaHJvbWUgTW9iaWxlJztcbiAgICAgIHZlcnNpb24gPSBudWxsO1xuXG4gICAgICBpZiAoL1xcYk9TIFhcXGIvLnRlc3Qob3MpKSB7XG4gICAgICAgIG1hbnVmYWN0dXJlciA9ICdBcHBsZSc7XG4gICAgICAgIG9zID0gJ2lPUyA0LjMrJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9zID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gU3RyaXAgaW5jb3JyZWN0IE9TIHZlcnNpb25zLlxuICAgIGlmICh2ZXJzaW9uICYmIHZlcnNpb24uaW5kZXhPZigoZGF0YSA9IC9bXFxkLl0rJC8uZXhlYyhvcykpKSA9PSAwICYmXG4gICAgICAgIHVhLmluZGV4T2YoJy8nICsgZGF0YSArICctJykgPiAtMSkge1xuICAgICAgb3MgPSB0cmltKG9zLnJlcGxhY2UoZGF0YSwgJycpKTtcbiAgICB9XG4gICAgLy8gQWRkIGxheW91dCBlbmdpbmUuXG4gICAgaWYgKGxheW91dCAmJiAhL1xcYig/OkF2YW50fE5vb2spXFxiLy50ZXN0KG5hbWUpICYmIChcbiAgICAgICAgL0Jyb3dzZXJ8THVuYXNjYXBlfE1heHRob24vLnRlc3QobmFtZSkgfHxcbiAgICAgICAgbmFtZSAhPSAnU2FmYXJpJyAmJiAvXmlPUy8udGVzdChvcykgJiYgL1xcYlNhZmFyaVxcYi8udGVzdChsYXlvdXRbMV0pIHx8XG4gICAgICAgIC9eKD86QWRvYmV8QXJvcmF8QnJlYWNofE1pZG9yaXxPcGVyYXxQaGFudG9tfFJla29ucXxSb2NrfFNhbXN1bmcgSW50ZXJuZXR8U2xlaXBuaXJ8V2ViKS8udGVzdChuYW1lKSAmJiBsYXlvdXRbMV0pKSB7XG4gICAgICAvLyBEb24ndCBhZGQgbGF5b3V0IGRldGFpbHMgdG8gZGVzY3JpcHRpb24gaWYgdGhleSBhcmUgZmFsc2V5LlxuICAgICAgKGRhdGEgPSBsYXlvdXRbbGF5b3V0Lmxlbmd0aCAtIDFdKSAmJiBkZXNjcmlwdGlvbi5wdXNoKGRhdGEpO1xuICAgIH1cbiAgICAvLyBDb21iaW5lIGNvbnRleHR1YWwgaW5mb3JtYXRpb24uXG4gICAgaWYgKGRlc2NyaXB0aW9uLmxlbmd0aCkge1xuICAgICAgZGVzY3JpcHRpb24gPSBbJygnICsgZGVzY3JpcHRpb24uam9pbignOyAnKSArICcpJ107XG4gICAgfVxuICAgIC8vIEFwcGVuZCBtYW51ZmFjdHVyZXIgdG8gZGVzY3JpcHRpb24uXG4gICAgaWYgKG1hbnVmYWN0dXJlciAmJiBwcm9kdWN0ICYmIHByb2R1Y3QuaW5kZXhPZihtYW51ZmFjdHVyZXIpIDwgMCkge1xuICAgICAgZGVzY3JpcHRpb24ucHVzaCgnb24gJyArIG1hbnVmYWN0dXJlcik7XG4gICAgfVxuICAgIC8vIEFwcGVuZCBwcm9kdWN0IHRvIGRlc2NyaXB0aW9uLlxuICAgIGlmIChwcm9kdWN0KSB7XG4gICAgICBkZXNjcmlwdGlvbi5wdXNoKCgvXm9uIC8udGVzdChkZXNjcmlwdGlvbltkZXNjcmlwdGlvbi5sZW5ndGggLSAxXSkgPyAnJyA6ICdvbiAnKSArIHByb2R1Y3QpO1xuICAgIH1cbiAgICAvLyBQYXJzZSB0aGUgT1MgaW50byBhbiBvYmplY3QuXG4gICAgaWYgKG9zKSB7XG4gICAgICBkYXRhID0gLyAoW1xcZC4rXSspJC8uZXhlYyhvcyk7XG4gICAgICBpc1NwZWNpYWxDYXNlZE9TID0gZGF0YSAmJiBvcy5jaGFyQXQob3MubGVuZ3RoIC0gZGF0YVswXS5sZW5ndGggLSAxKSA9PSAnLyc7XG4gICAgICBvcyA9IHtcbiAgICAgICAgJ2FyY2hpdGVjdHVyZSc6IDMyLFxuICAgICAgICAnZmFtaWx5JzogKGRhdGEgJiYgIWlzU3BlY2lhbENhc2VkT1MpID8gb3MucmVwbGFjZShkYXRhWzBdLCAnJykgOiBvcyxcbiAgICAgICAgJ3ZlcnNpb24nOiBkYXRhID8gZGF0YVsxXSA6IG51bGwsXG4gICAgICAgICd0b1N0cmluZyc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciB2ZXJzaW9uID0gdGhpcy52ZXJzaW9uO1xuICAgICAgICAgIHJldHVybiB0aGlzLmZhbWlseSArICgodmVyc2lvbiAmJiAhaXNTcGVjaWFsQ2FzZWRPUykgPyAnICcgKyB2ZXJzaW9uIDogJycpICsgKHRoaXMuYXJjaGl0ZWN0dXJlID09IDY0ID8gJyA2NC1iaXQnIDogJycpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgICAvLyBBZGQgYnJvd3Nlci9PUyBhcmNoaXRlY3R1cmUuXG4gICAgaWYgKChkYXRhID0gL1xcYig/OkFNRHxJQXxXaW58V09XfHg4Nl98eCk2NFxcYi9pLmV4ZWMoYXJjaCkpICYmICEvXFxiaTY4NlxcYi9pLnRlc3QoYXJjaCkpIHtcbiAgICAgIGlmIChvcykge1xuICAgICAgICBvcy5hcmNoaXRlY3R1cmUgPSA2NDtcbiAgICAgICAgb3MuZmFtaWx5ID0gb3MuZmFtaWx5LnJlcGxhY2UoUmVnRXhwKCcgKicgKyBkYXRhKSwgJycpO1xuICAgICAgfVxuICAgICAgaWYgKFxuICAgICAgICAgIG5hbWUgJiYgKC9cXGJXT1c2NFxcYi9pLnRlc3QodWEpIHx8XG4gICAgICAgICAgKHVzZUZlYXR1cmVzICYmIC9cXHcoPzo4NnwzMikkLy50ZXN0KG5hdi5jcHVDbGFzcyB8fCBuYXYucGxhdGZvcm0pICYmICEvXFxiV2luNjQ7IHg2NFxcYi9pLnRlc3QodWEpKSlcbiAgICAgICkge1xuICAgICAgICBkZXNjcmlwdGlvbi51bnNoaWZ0KCczMi1iaXQnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gQ2hyb21lIDM5IGFuZCBhYm92ZSBvbiBPUyBYIGlzIGFsd2F5cyA2NC1iaXQuXG4gICAgZWxzZSBpZiAoXG4gICAgICAgIG9zICYmIC9eT1MgWC8udGVzdChvcy5mYW1pbHkpICYmXG4gICAgICAgIG5hbWUgPT0gJ0Nocm9tZScgJiYgcGFyc2VGbG9hdCh2ZXJzaW9uKSA+PSAzOVxuICAgICkge1xuICAgICAgb3MuYXJjaGl0ZWN0dXJlID0gNjQ7XG4gICAgfVxuXG4gICAgdWEgfHwgKHVhID0gbnVsbCk7XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvKipcbiAgICAgKiBUaGUgcGxhdGZvcm0gb2JqZWN0LlxuICAgICAqXG4gICAgICogQG5hbWUgcGxhdGZvcm1cbiAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgKi9cbiAgICB2YXIgcGxhdGZvcm0gPSB7fTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBwbGF0Zm9ybSBkZXNjcmlwdGlvbi5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybVxuICAgICAqIEB0eXBlIHN0cmluZ3xudWxsXG4gICAgICovXG4gICAgcGxhdGZvcm0uZGVzY3JpcHRpb24gPSB1YTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBicm93c2VyJ3MgbGF5b3V0IGVuZ2luZS5cbiAgICAgKlxuICAgICAqIFRoZSBsaXN0IG9mIGNvbW1vbiBsYXlvdXQgZW5naW5lcyBpbmNsdWRlOlxuICAgICAqIFwiQmxpbmtcIiwgXCJFZGdlSFRNTFwiLCBcIkdlY2tvXCIsIFwiVHJpZGVudFwiIGFuZCBcIldlYktpdFwiXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm1cbiAgICAgKiBAdHlwZSBzdHJpbmd8bnVsbFxuICAgICAqL1xuICAgIHBsYXRmb3JtLmxheW91dCA9IGxheW91dCAmJiBsYXlvdXRbMF07XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgcHJvZHVjdCdzIG1hbnVmYWN0dXJlci5cbiAgICAgKlxuICAgICAqIFRoZSBsaXN0IG9mIG1hbnVmYWN0dXJlcnMgaW5jbHVkZTpcbiAgICAgKiBcIkFwcGxlXCIsIFwiQXJjaG9zXCIsIFwiQW1hem9uXCIsIFwiQXN1c1wiLCBcIkJhcm5lcyAmIE5vYmxlXCIsIFwiQmxhY2tCZXJyeVwiLFxuICAgICAqIFwiR29vZ2xlXCIsIFwiSFBcIiwgXCJIVENcIiwgXCJMR1wiLCBcIk1pY3Jvc29mdFwiLCBcIk1vdG9yb2xhXCIsIFwiTmludGVuZG9cIixcbiAgICAgKiBcIk5va2lhXCIsIFwiU2Ftc3VuZ1wiIGFuZCBcIlNvbnlcIlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIHBsYXRmb3JtXG4gICAgICogQHR5cGUgc3RyaW5nfG51bGxcbiAgICAgKi9cbiAgICBwbGF0Zm9ybS5tYW51ZmFjdHVyZXIgPSBtYW51ZmFjdHVyZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgYnJvd3Nlci9lbnZpcm9ubWVudC5cbiAgICAgKlxuICAgICAqIFRoZSBsaXN0IG9mIGNvbW1vbiBicm93c2VyIG5hbWVzIGluY2x1ZGU6XG4gICAgICogXCJDaHJvbWVcIiwgXCJFbGVjdHJvblwiLCBcIkZpcmVmb3hcIiwgXCJGaXJlZm94IGZvciBpT1NcIiwgXCJJRVwiLFxuICAgICAqIFwiTWljcm9zb2Z0IEVkZ2VcIiwgXCJQaGFudG9tSlNcIiwgXCJTYWZhcmlcIiwgXCJTZWFNb25rZXlcIiwgXCJTaWxrXCIsXG4gICAgICogXCJPcGVyYSBNaW5pXCIgYW5kIFwiT3BlcmFcIlxuICAgICAqXG4gICAgICogTW9iaWxlIHZlcnNpb25zIG9mIHNvbWUgYnJvd3NlcnMgaGF2ZSBcIk1vYmlsZVwiIGFwcGVuZGVkIHRvIHRoZWlyIG5hbWU6XG4gICAgICogZWcuIFwiQ2hyb21lIE1vYmlsZVwiLCBcIkZpcmVmb3ggTW9iaWxlXCIsIFwiSUUgTW9iaWxlXCIgYW5kIFwiT3BlcmEgTW9iaWxlXCJcbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybVxuICAgICAqIEB0eXBlIHN0cmluZ3xudWxsXG4gICAgICovXG4gICAgcGxhdGZvcm0ubmFtZSA9IG5hbWU7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYWxwaGEvYmV0YSByZWxlYXNlIGluZGljYXRvci5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybVxuICAgICAqIEB0eXBlIHN0cmluZ3xudWxsXG4gICAgICovXG4gICAgcGxhdGZvcm0ucHJlcmVsZWFzZSA9IHByZXJlbGVhc2U7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgcHJvZHVjdCBob3N0aW5nIHRoZSBicm93c2VyLlxuICAgICAqXG4gICAgICogVGhlIGxpc3Qgb2YgY29tbW9uIHByb2R1Y3RzIGluY2x1ZGU6XG4gICAgICpcbiAgICAgKiBcIkJsYWNrQmVycnlcIiwgXCJHYWxheHkgUzRcIiwgXCJMdW1pYVwiLCBcImlQYWRcIiwgXCJpUG9kXCIsIFwiaVBob25lXCIsIFwiS2luZGxlXCIsXG4gICAgICogXCJLaW5kbGUgRmlyZVwiLCBcIk5leHVzXCIsIFwiTm9va1wiLCBcIlBsYXlCb29rXCIsIFwiVG91Y2hQYWRcIiBhbmQgXCJUcmFuc2Zvcm1lclwiXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm1cbiAgICAgKiBAdHlwZSBzdHJpbmd8bnVsbFxuICAgICAqL1xuICAgIHBsYXRmb3JtLnByb2R1Y3QgPSBwcm9kdWN0O1xuXG4gICAgLyoqXG4gICAgICogVGhlIGJyb3dzZXIncyB1c2VyIGFnZW50IHN0cmluZy5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybVxuICAgICAqIEB0eXBlIHN0cmluZ3xudWxsXG4gICAgICovXG4gICAgcGxhdGZvcm0udWEgPSB1YTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBicm93c2VyL2Vudmlyb25tZW50IHZlcnNpb24uXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm1cbiAgICAgKiBAdHlwZSBzdHJpbmd8bnVsbFxuICAgICAqL1xuICAgIHBsYXRmb3JtLnZlcnNpb24gPSBuYW1lICYmIHZlcnNpb247XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgb3BlcmF0aW5nIHN5c3RlbS5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybVxuICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAqL1xuICAgIHBsYXRmb3JtLm9zID0gb3MgfHwge1xuXG4gICAgICAvKipcbiAgICAgICAqIFRoZSBDUFUgYXJjaGl0ZWN0dXJlIHRoZSBPUyBpcyBidWlsdCBmb3IuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIHBsYXRmb3JtLm9zXG4gICAgICAgKiBAdHlwZSBudW1iZXJ8bnVsbFxuICAgICAgICovXG4gICAgICAnYXJjaGl0ZWN0dXJlJzogbnVsbCxcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgZmFtaWx5IG9mIHRoZSBPUy5cbiAgICAgICAqXG4gICAgICAgKiBDb21tb24gdmFsdWVzIGluY2x1ZGU6XG4gICAgICAgKiBcIldpbmRvd3NcIiwgXCJXaW5kb3dzIFNlcnZlciAyMDA4IFIyIC8gN1wiLCBcIldpbmRvd3MgU2VydmVyIDIwMDggLyBWaXN0YVwiLFxuICAgICAgICogXCJXaW5kb3dzIFhQXCIsIFwiT1MgWFwiLCBcIlVidW50dVwiLCBcIkRlYmlhblwiLCBcIkZlZG9yYVwiLCBcIlJlZCBIYXRcIiwgXCJTdVNFXCIsXG4gICAgICAgKiBcIkFuZHJvaWRcIiwgXCJpT1NcIiBhbmQgXCJXaW5kb3dzIFBob25lXCJcbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm0ub3NcbiAgICAgICAqIEB0eXBlIHN0cmluZ3xudWxsXG4gICAgICAgKi9cbiAgICAgICdmYW1pbHknOiBudWxsLFxuXG4gICAgICAvKipcbiAgICAgICAqIFRoZSB2ZXJzaW9uIG9mIHRoZSBPUy5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm0ub3NcbiAgICAgICAqIEB0eXBlIHN0cmluZ3xudWxsXG4gICAgICAgKi9cbiAgICAgICd2ZXJzaW9uJzogbnVsbCxcblxuICAgICAgLyoqXG4gICAgICAgKiBSZXR1cm5zIHRoZSBPUyBzdHJpbmcuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIHBsYXRmb3JtLm9zXG4gICAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgT1Mgc3RyaW5nLlxuICAgICAgICovXG4gICAgICAndG9TdHJpbmcnOiBmdW5jdGlvbigpIHsgcmV0dXJuICdudWxsJzsgfVxuICAgIH07XG5cbiAgICBwbGF0Zm9ybS5wYXJzZSA9IHBhcnNlO1xuICAgIHBsYXRmb3JtLnRvU3RyaW5nID0gdG9TdHJpbmdQbGF0Zm9ybTtcblxuICAgIGlmIChwbGF0Zm9ybS52ZXJzaW9uKSB7XG4gICAgICBkZXNjcmlwdGlvbi51bnNoaWZ0KHZlcnNpb24pO1xuICAgIH1cbiAgICBpZiAocGxhdGZvcm0ubmFtZSkge1xuICAgICAgZGVzY3JpcHRpb24udW5zaGlmdChuYW1lKTtcbiAgICB9XG4gICAgaWYgKG9zICYmIG5hbWUgJiYgIShvcyA9PSBTdHJpbmcob3MpLnNwbGl0KCcgJylbMF0gJiYgKG9zID09IG5hbWUuc3BsaXQoJyAnKVswXSB8fCBwcm9kdWN0KSkpIHtcbiAgICAgIGRlc2NyaXB0aW9uLnB1c2gocHJvZHVjdCA/ICcoJyArIG9zICsgJyknIDogJ29uICcgKyBvcyk7XG4gICAgfVxuICAgIGlmIChkZXNjcmlwdGlvbi5sZW5ndGgpIHtcbiAgICAgIHBsYXRmb3JtLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb24uam9pbignICcpO1xuICAgIH1cbiAgICByZXR1cm4gcGxhdGZvcm07XG4gIH1cblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvLyBFeHBvcnQgcGxhdGZvcm0uXG4gIHZhciBwbGF0Zm9ybSA9IHBhcnNlKCk7XG5cbiAgLy8gU29tZSBBTUQgYnVpbGQgb3B0aW1pemVycywgbGlrZSByLmpzLCBjaGVjayBmb3IgY29uZGl0aW9uIHBhdHRlcm5zIGxpa2UgdGhlIGZvbGxvd2luZzpcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PSAnb2JqZWN0JyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gRXhwb3NlIHBsYXRmb3JtIG9uIHRoZSBnbG9iYWwgb2JqZWN0IHRvIHByZXZlbnQgZXJyb3JzIHdoZW4gcGxhdGZvcm0gaXNcbiAgICAvLyBsb2FkZWQgYnkgYSBzY3JpcHQgdGFnIGluIHRoZSBwcmVzZW5jZSBvZiBhbiBBTUQgbG9hZGVyLlxuICAgIC8vIFNlZSBodHRwOi8vcmVxdWlyZWpzLm9yZy9kb2NzL2Vycm9ycy5odG1sI21pc21hdGNoIGZvciBtb3JlIGRldGFpbHMuXG4gICAgcm9vdC5wbGF0Zm9ybSA9IHBsYXRmb3JtO1xuXG4gICAgLy8gRGVmaW5lIGFzIGFuIGFub255bW91cyBtb2R1bGUgc28gcGxhdGZvcm0gY2FuIGJlIGFsaWFzZWQgdGhyb3VnaCBwYXRoIG1hcHBpbmcuXG4gICAgZGVmaW5lKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHBsYXRmb3JtO1xuICAgIH0pO1xuICB9XG4gIC8vIENoZWNrIGZvciBgZXhwb3J0c2AgYWZ0ZXIgYGRlZmluZWAgaW4gY2FzZSBhIGJ1aWxkIG9wdGltaXplciBhZGRzIGFuIGBleHBvcnRzYCBvYmplY3QuXG4gIGVsc2UgaWYgKGZyZWVFeHBvcnRzICYmIGZyZWVNb2R1bGUpIHtcbiAgICAvLyBFeHBvcnQgZm9yIENvbW1vbkpTIHN1cHBvcnQuXG4gICAgZm9yT3duKHBsYXRmb3JtLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICBmcmVlRXhwb3J0c1trZXldID0gdmFsdWU7XG4gICAgfSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgLy8gRXhwb3J0IHRvIHRoZSBnbG9iYWwgb2JqZWN0LlxuICAgIHJvb3QucGxhdGZvcm0gPSBwbGF0Zm9ybTtcbiAgfVxufS5jYWxsKHRoaXMpKTtcbiIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3F1YXJrLWRldi9QaG9ub24tRnJhbWV3b3JrL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gJy4uL2NvbXBvbmVudCdcbmltcG9ydCBDb2xsYXBzZSBmcm9tICcuLi9jb2xsYXBzZSdcbmltcG9ydCB7IGdldEF0dHJpYnV0ZXNDb25maWcgfSBmcm9tICcuLi9jb21wb25lbnRNYW5hZ2VyJ1xuaW1wb3J0IEV2ZW50IGZyb20gJy4uLy4uL2NvcmUvZXZlbnRzJ1xuaW1wb3J0IHsgZmluZFRhcmdldEJ5Q2xhc3MgfSBmcm9tICcuLi8uLi9jb3JlL3V0aWxzJ1xuXG5jb25zdCBBY2NvcmRpb24gPSAoKCkgPT4ge1xuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENvbnN0YW50c1xuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY29uc3QgTkFNRSA9ICdhY2NvcmRpb24nXG4gIGNvbnN0IFZFUlNJT04gPSAnMi4wLjAnXG4gIGNvbnN0IERFRkFVTFRfUFJPUEVSVElFUyA9IHtcbiAgICBlbGVtZW50OiBudWxsLFxuICB9XG4gIGNvbnN0IERBVEFfQVRUUlNfUFJPUEVSVElFUyA9IFtcbiAgXVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY2xhc3MgQWNjb3JkaW9uIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgc3VwZXIoTkFNRSwgVkVSU0lPTiwgREVGQVVMVF9QUk9QRVJUSUVTLCBvcHRpb25zLCBEQVRBX0FUVFJTX1BST1BFUlRJRVMsIGZhbHNlLCBmYWxzZSlcblxuICAgICAgdGhpcy5jb2xsYXBzZXMgPSBbXVxuXG4gICAgICBjb25zdCB0b2dnbGVzID0gdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChgW2RhdGEtdG9nZ2xlPVwiJHtOQU1FfVwiXWApXG4gICAgICB0b2dnbGVzLmZvckVhY2goKHRvZ2dsZSkgPT4ge1xuICAgICAgICBjb25zdCBjb2xsYXBzZUlkID0gdG9nZ2xlLmdldEF0dHJpYnV0ZSgnaHJlZicpXG4gICAgICAgIGNvbnN0IGNvbGxhcHNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb2xsYXBzZUlkKVxuXG4gICAgICAgIGlmIChjb2xsYXBzZSkge1xuICAgICAgICAgIHRoaXMuYWRkQ29sbGFwc2UoY29sbGFwc2UpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgb25FbGVtZW50RXZlbnQoZXZlbnQpIHtcbiAgICAgIGNvbnN0IGlkID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnaHJlZicpXG4gICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpZClcblxuICAgICAgdGhpcy5zZXRDb2xsYXBzZXMoZWxlbWVudClcbiAgICB9XG5cbiAgICBhZGRDb2xsYXBzZShlbGVtZW50KSB7XG4gICAgICBjb25zdCBjb2xsYXBzZSA9IG5ldyBDb2xsYXBzZSh7XG4gICAgICAgIGVsZW1lbnQsXG4gICAgICB9KVxuICAgICAgdGhpcy5jb2xsYXBzZXMucHVzaChjb2xsYXBzZSlcblxuICAgICAgcmV0dXJuIGNvbGxhcHNlXG4gICAgfVxuXG4gICAgZ2V0Q29sbGFwc2UoZWxlbWVudCkge1xuICAgICAgbGV0IGNvbGxhcHNlID0gdGhpcy5jb2xsYXBzZXMuZmluZChjID0+IGMub3B0aW9ucy5lbGVtZW50LmdldEF0dHJpYnV0ZSgnaWQnKSA9PT0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lkJykpXG5cbiAgICAgIGlmICghY29sbGFwc2UpIHtcbiAgICAgICAgLy8gY3JlYXRlIGEgbmV3IGNvbGxhcHNlXG4gICAgICAgIGNvbGxhcHNlID0gdGhpcy5hZGRDb2xsYXBzZSgpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjb2xsYXBzZVxuICAgIH1cblxuICAgIGdldENvbGxhcHNlcygpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbGxhcHNlc1xuICAgIH1cblxuICAgIHNldENvbGxhcHNlcyhzaG93Q29sbGFwc2UpIHtcbiAgICAgIGNvbnN0IGNvbGxhcHNlID0gdGhpcy5nZXRDb2xsYXBzZShzaG93Q29sbGFwc2UpXG4gICAgICB0aGlzLmNvbGxhcHNlcy5mb3JFYWNoKChjKSA9PiB7XG4gICAgICAgIGlmIChjLm9wdGlvbnMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lkJykgIT09IHNob3dDb2xsYXBzZS5nZXRBdHRyaWJ1dGUoJ2lkJykpIHtcbiAgICAgICAgICBjLmhpZGUoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbGxhcHNlLnRvZ2dsZSgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgc2hvdyhjb2xsYXBzZUVsKSB7XG4gICAgICBsZXQgY29sbGFwc2UgPSBjb2xsYXBzZUVsXG4gICAgICBpZiAodHlwZW9mIGNvbGxhcHNlRWwgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGNvbGxhcHNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb2xsYXBzZUVsKVxuICAgICAgfVxuXG4gICAgICBpZiAoIWNvbGxhcHNlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtOQU1FfS4gVGhlIGNvbGxhcHNpYmxlICR7Y29sbGFwc2VFbH0gaXMgYW4gaW52YWxpZCBIVE1MRWxlbWVudC5gKVxuICAgICAgfVxuXG4gICAgICB0aGlzLnNldENvbGxhcHNlcyhjb2xsYXBzZSlcblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBoaWRlKGNvbGxhcHNlRWwpIHtcbiAgICAgIGxldCBjb2xsYXBzZSA9IGNvbGxhcHNlRWxcbiAgICAgIGlmICh0eXBlb2YgY29sbGFwc2VFbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgY29sbGFwc2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbGxhcHNlRWwpXG4gICAgICB9XG5cbiAgICAgIGlmICghY29sbGFwc2UpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke05BTUV9LiBUaGUgY29sbGFwc2libGUgJHtjb2xsYXBzZUVsfSBpcyBhbiBpbnZhbGlkIEhUTUxFbGVtZW50LmApXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNvbGxhcHNlT2JqID0gdGhpcy5nZXRDb2xsYXBzZShjb2xsYXBzZSlcbiAgICAgIHJldHVybiBjb2xsYXBzZU9iai5oaWRlKClcbiAgICB9XG5cbiAgICBzdGF0aWMgX0RPTUludGVyZmFjZShvcHRpb25zKSB7XG4gICAgICByZXR1cm4gc3VwZXIuX0RPTUludGVyZmFjZShBY2NvcmRpb24sIG9wdGlvbnMpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBET00gQXBpIGltcGxlbWVudGF0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cbiAgY29uc3QgY29tcG9uZW50cyA9IFtdXG5cbiAgY29uc3QgYWNjb3JkaW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke05BTUV9YClcbiAgaWYgKGFjY29yZGlvbnMpIHtcbiAgICBhY2NvcmRpb25zLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IGdldEF0dHJpYnV0ZXNDb25maWcoZWxlbWVudCwgREVGQVVMVF9QUk9QRVJUSUVTLCBEQVRBX0FUVFJTX1BST1BFUlRJRVMpXG4gICAgICBjb25maWcuZWxlbWVudCA9IGVsZW1lbnRcblxuICAgICAgY29tcG9uZW50cy5wdXNoKEFjY29yZGlvbi5fRE9NSW50ZXJmYWNlKGNvbmZpZykpXG4gICAgfSlcbiAgfVxuXG4gIGlmIChhY2NvcmRpb25zKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IGRhdGFUb2dnbGVBdHRyID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS10b2dnbGUnKVxuICAgICAgaWYgKGRhdGFUb2dnbGVBdHRyICYmIGRhdGFUb2dnbGVBdHRyID09PSBOQU1FKSB7XG4gICAgICAgIGNvbnN0IGNvbGxhcHNlSWQgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXRhcmdldCcpIHx8IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKVxuICAgICAgICBjb25zdCBjb2xsYXBzZUVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb2xsYXBzZUlkKVxuXG4gICAgICAgIGNvbnN0IGFjY29yZGlvbiA9IGZpbmRUYXJnZXRCeUNsYXNzKGV2ZW50LnRhcmdldCwgJ2FjY29yZGlvbicpXG5cbiAgICAgICAgaWYgKGFjY29yZGlvbiA9PT0gbnVsbCkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYWNjb3JkaW9uSWQgPSBhY2NvcmRpb24uZ2V0QXR0cmlidXRlKCdpZCcpXG4gICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGNvbXBvbmVudHMuZmluZChjID0+IGMuZ2V0RWxlbWVudCgpLmdldEF0dHJpYnV0ZSgnaWQnKSA9PT0gYWNjb3JkaW9uSWQpXG5cbiAgICAgICAgaWYgKCFjb21wb25lbnQpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIHRoZSBjb2xsYXBzZSBoYXMgYmVlbiBhZGRlZCBwcm9ncmFtbWF0aWNhbGx5LCB3ZSBhZGQgaXRcbiAgICAgICAgY29uc3QgdGFyZ2V0Q29sbGFwc2UgPSBjb21wb25lbnQuZ2V0Q29sbGFwc2VzKCkuZmluZChjID0+IGMuZ2V0RWxlbWVudCgpID09PSBjb2xsYXBzZUVsKVxuICAgICAgICBpZiAoIXRhcmdldENvbGxhcHNlKSB7XG4gICAgICAgICAgY29tcG9uZW50LmFkZENvbGxhcHNlKGNvbGxhcHNlRWwpXG4gICAgICAgIH1cblxuICAgICAgICBjb21wb25lbnQuc2hvdyhjb2xsYXBzZUlkKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICByZXR1cm4gQWNjb3JkaW9uXG59KSgpXG5cbmV4cG9ydCBkZWZhdWx0IEFjY29yZGlvblxuIiwiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vcXVhcmstZGV2L1Bob25vbi1GcmFtZXdvcmsvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmltcG9ydCBDb21wb25lbnQgZnJvbSAnLi4vY29tcG9uZW50J1xuaW1wb3J0IHsgZ2V0QXR0cmlidXRlc0NvbmZpZyB9IGZyb20gJy4uL2NvbXBvbmVudE1hbmFnZXInXG5pbXBvcnQgRXZlbnQgZnJvbSAnLi4vLi4vY29yZS9ldmVudHMnXG5pbXBvcnQgeyBmaW5kVGFyZ2V0QnlBdHRyIH0gZnJvbSAnLi4vLi4vY29yZS91dGlscydcblxuY29uc3QgQ29sbGFwc2UgPSAoKCkgPT4ge1xuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENvbnN0YW50c1xuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY29uc3QgTkFNRSA9ICdjb2xsYXBzZSdcbiAgY29uc3QgVkVSU0lPTiA9ICcyLjAuMCdcbiAgY29uc3QgREVGQVVMVF9QUk9QRVJUSUVTID0ge1xuICAgIGVsZW1lbnQ6IG51bGwsXG4gICAgdG9nZ2xlOiBmYWxzZSxcbiAgfVxuICBjb25zdCBEQVRBX0FUVFJTX1BST1BFUlRJRVMgPSBbXG4gICAgJ3RvZ2dsZScsXG4gIF1cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENsYXNzIERlZmluaXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNsYXNzIENvbGxhcHNlIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgc3VwZXIoTkFNRSwgVkVSU0lPTiwgREVGQVVMVF9QUk9QRVJUSUVTLCBvcHRpb25zLCBEQVRBX0FUVFJTX1BST1BFUlRJRVMsIGZhbHNlLCBmYWxzZSlcblxuICAgICAgdGhpcy5vblRyYW5zaXRpb24gPSBmYWxzZVxuXG4gICAgICAvLyB0b2dnbGUgZGlyZWN0bHlcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudG9nZ2xlKSB7XG4gICAgICAgIHRoaXMuc2hvdygpXG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0SGVpZ2h0KCkge1xuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCh0aGlzLm9wdGlvbnMuZWxlbWVudCkuaGVpZ2h0XG4gICAgfVxuXG4gICAgdG9nZ2xlKCkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnc2hvdycpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhpZGUoKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5zaG93KClcbiAgICB9XG5cbiAgICBzaG93KCkge1xuICAgICAgaWYgKHRoaXMub25UcmFuc2l0aW9uKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93JykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHRoaXMub25UcmFuc2l0aW9uID0gdHJ1ZVxuXG4gICAgICBjb25zdCBvbkNvbGxhcHNlZCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc2hvdycpXG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2NvbGxhcHNpbmcnKVxuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKEV2ZW50LlRSQU5TSVRJT05fRU5ELCBvbkNvbGxhcHNlZClcblxuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKVxuXG4gICAgICAgIHRoaXMub25UcmFuc2l0aW9uID0gZmFsc2VcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2NvbGxhcHNpbmcnKSkge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzaW5nJylcbiAgICAgIH1cblxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFdmVudC5UUkFOU0lUSU9OX0VORCwgb25Db2xsYXBzZWQpXG5cbiAgICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuZ2V0SGVpZ2h0KClcblxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gJzBweCdcblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnN0eWxlLmhlaWdodCA9IGAke2hlaWdodH1weGBcbiAgICAgIH0sIDIwKVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGhpZGUoKSB7XG4gICAgICBpZiAodGhpcy5vblRyYW5zaXRpb24pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93JykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHRoaXMub25UcmFuc2l0aW9uID0gdHJ1ZVxuXG4gICAgICBjb25zdCBvbkNvbGxhcHNlZCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY29sbGFwc2luZycpXG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnN0eWxlLmhlaWdodCA9ICdhdXRvJ1xuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKEV2ZW50LlRSQU5TSVRJT05fRU5ELCBvbkNvbGxhcHNlZClcblxuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSlcblxuICAgICAgICB0aGlzLm9uVHJhbnNpdGlvbiA9IGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnN0eWxlLmhlaWdodCA9ICcwcHgnXG5cbiAgICAgIGlmICghdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjb2xsYXBzaW5nJykpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2luZycpXG4gICAgICB9XG5cbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoRXZlbnQuVFJBTlNJVElPTl9FTkQsIG9uQ29sbGFwc2VkKVxuXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93JylcblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBzdGF0aWMgX0RPTUludGVyZmFjZShvcHRpb25zKSB7XG4gICAgICByZXR1cm4gc3VwZXIuX0RPTUludGVyZmFjZShDb2xsYXBzZSwgb3B0aW9ucylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIERPTSBBcGkgaW1wbGVtZW50YXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuICBjb25zdCBjb21wb25lbnRzID0gW11cblxuICBjb25zdCBjb2xsYXBzZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuJHtOQU1FfWApXG4gIGlmIChjb2xsYXBzZXMpIHtcbiAgICBjb2xsYXBzZXMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgLy8gY29uc3QgY29uZmlnID0ge31cbiAgICAgIGNvbnN0IGNvbmZpZyA9IGdldEF0dHJpYnV0ZXNDb25maWcoZWxlbWVudCwgREVGQVVMVF9QUk9QRVJUSUVTLCBEQVRBX0FUVFJTX1BST1BFUlRJRVMpXG4gICAgICBjb25maWcuZWxlbWVudCA9IGVsZW1lbnRcblxuICAgICAgY29tcG9uZW50cy5wdXNoKENvbGxhcHNlLl9ET01JbnRlcmZhY2UoY29uZmlnKSlcbiAgICB9KVxuICB9XG5cbiAgaWYgKGNvbGxhcHNlcykge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICBjb25zdCB0YXJnZXQgPSBmaW5kVGFyZ2V0QnlBdHRyKGV2ZW50LnRhcmdldCwgJ2RhdGEtdG9nZ2xlJylcbiAgICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjb25zdCBkYXRhVG9nZ2xlQXR0ciA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdG9nZ2xlJylcblxuICAgICAgaWYgKGRhdGFUb2dnbGVBdHRyICYmIGRhdGFUb2dnbGVBdHRyID09PSBOQU1FKSB7XG4gICAgICAgIGxldCBpZCA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGFyZ2V0JykgfHwgdGFyZ2V0LmdldEF0dHJpYnV0ZSgnaHJlZicpXG4gICAgICAgIGlkID0gaWQucmVwbGFjZSgnIycsICcnKVxuXG4gICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGNvbXBvbmVudHMuZmluZChjID0+IGMuZ2V0RWxlbWVudCgpLmdldEF0dHJpYnV0ZSgnaWQnKSA9PT0gaWQpXG5cbiAgICAgICAgaWYgKCFjb21wb25lbnQpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbXBvbmVudC50b2dnbGUoKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICByZXR1cm4gQ29sbGFwc2Vcbn0pKClcblxuZXhwb3J0IGRlZmF1bHQgQ29sbGFwc2VcbiIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3F1YXJrLWRldi9QaG9ub24tRnJhbWV3b3JrL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5pbXBvcnQgeyBkaXNwYXRjaEVsZW1lbnRFdmVudCwgZGlzcGF0Y2hXaW5Eb2NFdmVudCB9IGZyb20gJy4uL2NvcmUvZXZlbnRzL2Rpc3BhdGNoJ1xuaW1wb3J0IHsgZ2VuZXJhdGVJZCB9IGZyb20gJy4uL2NvcmUvdXRpbHMnXG5pbXBvcnQgRXZlbnQgZnJvbSAnLi4vY29yZS9ldmVudHMnXG5pbXBvcnQgQ29tcG9uZW50TWFuYWdlciwgeyBzZXRBdHRyaWJ1dGVzQ29uZmlnLCBnZXRBdHRyaWJ1dGVzQ29uZmlnIH0gZnJvbSAnLi9jb21wb25lbnRNYW5hZ2VyJ1xuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQ2xhc3MgRGVmaW5pdGlvblxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcG9uZW50IHtcblxuICBjb25zdHJ1Y3RvcihuYW1lLCB2ZXJzaW9uLCBkZWZhdWx0T3B0aW9ucyA9IHt9LCBvcHRpb25zID0ge30sIG9wdGlvbkF0dHJzID0gW10sIHN1cHBvcnREeW5hbWljRWxlbWVudCA9IGZhbHNlLCBhZGRUb1N0YWNrID0gZmFsc2UpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lXG4gICAgdGhpcy52ZXJzaW9uID0gdmVyc2lvblxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcblxuICAgIC8vIEB0b2RvIGtlZXA/XG4gICAgLy8gdGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0T3B0aW9ucywgb3B0aW9ucylcbiAgICBPYmplY3Qua2V5cyhkZWZhdWx0T3B0aW9ucykuZm9yRWFjaCgocHJvcCkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnNbcHJvcF0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRoaXMub3B0aW9uc1twcm9wXSA9IGRlZmF1bHRPcHRpb25zW3Byb3BdXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMub3B0aW9uQXR0cnMgPSBvcHRpb25BdHRyc1xuICAgIHRoaXMuc3VwcG9ydER5bmFtaWNFbGVtZW50ID0gc3VwcG9ydER5bmFtaWNFbGVtZW50XG4gICAgdGhpcy5hZGRUb1N0YWNrID0gYWRkVG9TdGFja1xuICAgIHRoaXMuaWQgPSBnZW5lcmF0ZUlkKClcblxuICAgIGNvbnN0IGNoZWNrRWxlbWVudCA9ICF0aGlzLnN1cHBvcnREeW5hbWljRWxlbWVudCB8fCB0aGlzLm9wdGlvbnMuZWxlbWVudCAhPT0gbnVsbFxuXG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMuZWxlbWVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLm9wdGlvbnMuZWxlbWVudClcbiAgICB9XG5cbiAgICBpZiAoY2hlY2tFbGVtZW50ICYmICF0aGlzLm9wdGlvbnMuZWxlbWVudCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3RoaXMubmFtZX0uIFRoZSBlbGVtZW50IGlzIG5vdCBhIEhUTUxFbGVtZW50LmApXG4gICAgfVxuXG4gICAgdGhpcy5keW5hbWljRWxlbWVudCA9IHRoaXMub3B0aW9ucy5lbGVtZW50ID09PSBudWxsXG4gICAgdGhpcy5yZWdpc3RlcmVkRWxlbWVudHMgPSBbXVxuXG4gICAgaWYgKCF0aGlzLmR5bmFtaWNFbGVtZW50KSB7XG4gICAgICAvKipcbiAgICAgICAqIGlmIHRoZSBlbGVtZW50IGV4aXN0cywgd2UgcmVhZCB0aGUgZGF0YSBhdHRyaWJ1dGVzIGNvbmZpZ1xuICAgICAgICogdGhlbiB3ZSBvdmVyd3JpdGUgZXhpc3RpbmcgY29uZmlnIGtleXMgaW4gSmF2YVNjcmlwdCwgc28gdGhhdFxuICAgICAgICogd2Uga2VlcCB0aGUgZm9sbG93aW5nIG9yZGVyXG4gICAgICAgKiBbMV0gZGVmYXVsdCBKYXZhU2NyaXB0IGNvbmZpZ3VyYXRpb24gb2YgdGhlIGNvbXBvbmVudFxuICAgICAgICogWzJdIERhdGEgYXR0cmlidXRlcyBjb25maWd1cmF0aW9uIGlmIHRoZSBlbGVtZW50IGV4aXN0cyBpbiB0aGUgRE9NXG4gICAgICAgKiBbM10gSmF2YVNjcmlwdCBjb25maWd1cmF0aW9uXG4gICAgICAgKi9cbiAgICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24odGhpcy5vcHRpb25zLCB0aGlzLmFzc2lnbkpzQ29uZmlnKHRoaXMuZ2V0QXR0cmlidXRlcygpLCBvcHRpb25zKSlcblxuICAgICAgLy8gdGhlbiwgc2V0IHRoZSBuZXcgZGF0YSBhdHRyaWJ1dGVzIHRvIHRoZSBlbGVtZW50XG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZXMoKVxuICAgIH1cblxuICAgIHRoaXMuZWxlbWVudExpc3RlbmVyID0gZXZlbnQgPT4gdGhpcy5vbkJlZm9yZUVsZW1lbnRFdmVudChldmVudCkgICAgICAgICAgXG4gIH1cblxuICBhc3NpZ25Kc0NvbmZpZyhhdHRyQ29uZmlnLCBvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25BdHRycy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGlmIChvcHRpb25zW2tleV0pIHtcbiAgICAgICAgYXR0ckNvbmZpZ1trZXldID0gb3B0aW9uc1trZXldXG4gICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiBhdHRyQ29uZmlnXG4gIH1cblxuICBnZXRWZXJzaW9uKCkge1xuICAgIHJldHVybiB0aGlzLnZlcnNpb25cbiAgfVxuXG4gIGdldEVsZW1lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy5lbGVtZW50XG4gIH1cblxuICBnZXRJZCgpIHtcbiAgICByZXR1cm4gdGhpcy5pZFxuICB9XG5cbiAgcmVnaXN0ZXJFbGVtZW50cyhlbGVtZW50cykge1xuICAgIGVsZW1lbnRzLmZvckVhY2goZWxlbWVudCA9PiB0aGlzLnJlZ2lzdGVyRWxlbWVudChlbGVtZW50KSlcbiAgfVxuXG4gIHJlZ2lzdGVyRWxlbWVudChlbGVtZW50KSB7XG4gICAgZWxlbWVudC50YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihlbGVtZW50LmV2ZW50LCB0aGlzLmVsZW1lbnRMaXN0ZW5lcilcbiAgICB0aGlzLnJlZ2lzdGVyZWRFbGVtZW50cy5wdXNoKGVsZW1lbnQpXG4gIH1cblxuICB1bnJlZ2lzdGVyRWxlbWVudHMoKSB7XG4gICAgdGhpcy5yZWdpc3RlcmVkRWxlbWVudHMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgdGhpcy51bnJlZ2lzdGVyRWxlbWVudChlbGVtZW50KVxuICAgIH0pXG4gIH1cblxuICB1bnJlZ2lzdGVyRWxlbWVudChlbGVtZW50KSB7XG4gICAgY29uc3QgcmVnaXN0ZXJlZEVsZW1lbnRJbmRleCA9IHRoaXMucmVnaXN0ZXJlZEVsZW1lbnRzXG4gICAgICAuZmluZEluZGV4KGVsID0+IGVsLnRhcmdldCA9PT0gZWxlbWVudC50YXJnZXQgJiYgZWwuZXZlbnQgPT09IGVsZW1lbnQuZXZlbnQpXG5cbiAgICBpZiAocmVnaXN0ZXJlZEVsZW1lbnRJbmRleCA+IC0xKSB7XG4gICAgICBlbGVtZW50LnRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGVsZW1lbnQuZXZlbnQsIHRoaXMuZWxlbWVudExpc3RlbmVyKVxuICAgICAgdGhpcy5yZWdpc3RlcmVkRWxlbWVudHMuc3BsaWNlKHJlZ2lzdGVyZWRFbGVtZW50SW5kZXgsIDEpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYFdhcm5pbmchIFVua25vd24gcmVnaXN0ZXJlZCBlbGVtZW50OiAke2VsZW1lbnQudGFyZ2V0fSB3aXRoIGV2ZW50OiAke2VsZW1lbnQuZXZlbnR9LmApXG4gICAgfVxuICB9XG5cbiAgdHJpZ2dlckV2ZW50KGV2ZW50TmFtZSwgZGV0YWlsID0ge30sIG9iamVjdEV2ZW50T25seSA9IGZhbHNlKSB7XG4gICAgaWYgKHR5cGVvZiBldmVudE5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBldmVudCBuYW1lIGlzIG5vdCB2YWxpZC4nKVxuICAgIH1cblxuICAgIGlmICh0aGlzLmFkZFRvU3RhY2spIHtcbiAgICAgIGlmIChldmVudE5hbWUgPT09IEV2ZW50LlNIT1cpIHtcbiAgICAgICAgQ29tcG9uZW50TWFuYWdlci5hZGQodGhpcylcbiAgICAgIH0gZWxzZSBpZiAoZXZlbnROYW1lID09PSBFdmVudC5ISURFKSB7XG4gICAgICAgIENvbXBvbmVudE1hbmFnZXIucmVtb3ZlKHRoaXMpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gZXZlbnQgbmFtZXMgY2FuIGJlIHdpdGggZG90IG5vdGF0aW9uIGxpa2UgcmVjb25uZWN0aW5nLnN1Y2Nlc3NcbiAgICBjb25zdCBldmVudE5hbWVPYmplY3QgPSBldmVudE5hbWUuc3BsaXQoJy4nKS5yZWR1Y2UoKGFjYywgY3VycmVudCwgaW5kZXgpID0+IHtcbiAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gY3VycmVudFxuICAgICAgfVxuXG4gICAgICByZXR1cm4gYWNjICsgY3VycmVudC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGN1cnJlbnQuc2xpY2UoMSlcbiAgICB9KVxuXG4gICAgY29uc3QgZXZlbnROYW1lQWxpYXMgPSBgb24ke2V2ZW50TmFtZU9iamVjdC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKX0ke2V2ZW50TmFtZU9iamVjdC5zbGljZSgxKX1gXG5cbiAgICAvLyBvYmplY3QgZXZlbnRcbiAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9uc1tldmVudE5hbWVPYmplY3RdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLm9wdGlvbnNbZXZlbnROYW1lT2JqZWN0XS5hcHBseSh0aGlzLCBbZGV0YWlsXSlcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9uc1tldmVudE5hbWVBbGlhc10gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMub3B0aW9uc1tldmVudE5hbWVBbGlhc10uYXBwbHkodGhpcywgW2RldGFpbF0pXG4gICAgfVxuXG4gICAgaWYgKG9iamVjdEV2ZW50T25seSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gZG9tIGV2ZW50XG4gICAgaWYgKHRoaXMub3B0aW9ucy5lbGVtZW50KSB7XG4gICAgICBkaXNwYXRjaEVsZW1lbnRFdmVudCh0aGlzLm9wdGlvbnMuZWxlbWVudCwgZXZlbnROYW1lLCB0aGlzLm5hbWUsIGRldGFpbClcbiAgICB9IGVsc2Uge1xuICAgICAgZGlzcGF0Y2hXaW5Eb2NFdmVudChldmVudE5hbWUsIHRoaXMubmFtZSwgZGV0YWlsKVxuICAgIH1cbiAgfVxuXG4gIHNldEF0dHJpYnV0ZXMoKSB7XG4gICAgaWYgKHRoaXMub3B0aW9uQXR0cnMubGVuZ3RoID4gMCkge1xuICAgICAgc2V0QXR0cmlidXRlc0NvbmZpZyh0aGlzLm9wdGlvbnMuZWxlbWVudCwgdGhpcy5vcHRpb25zLCB0aGlzLm9wdGlvbkF0dHJzKVxuICAgIH1cbiAgfVxuXG4gIGdldEF0dHJpYnV0ZXMoKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMub3B0aW9ucylcbiAgICByZXR1cm4gZ2V0QXR0cmlidXRlc0NvbmZpZyh0aGlzLm9wdGlvbnMuZWxlbWVudCwgb3B0aW9ucywgdGhpcy5vcHRpb25BdHRycylcbiAgfVxuXG4gIC8qKlxuICAgKiB0aGUgcHJldmVudENsb3NhYmxlIG1ldGhvZCBtYW5hZ2VzIGNvbmN1cnJlbmN5IGJldHdlZW4gYWN0aXZlIGNvbXBvbmVudHMuXG4gICAqIEZvciBleGFtcGxlLCBpZiB0aGVyZSBpcyBhIHNob3duIG9mZi1jYW52YXMgYW5kIGRpYWxvZywgdGhlIGxhc3RcbiAgICogc2hvd24gY29tcG9uZW50IGdhaW5zIHRoZSBwcm9jZXNzaW5nIHByaW9yaXR5XG4gICAqL1xuICBwcmV2ZW50Q2xvc2FibGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWRkVG9TdGFjayAmJiAhQ29tcG9uZW50TWFuYWdlci5jbG9zYWJsZSh0aGlzKVxuICB9XG5cbiAgb25CZWZvcmVFbGVtZW50RXZlbnQoZXZlbnQpIHtcbiAgICBpZiAodGhpcy5wcmV2ZW50Q2xvc2FibGUoKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy5vbkVsZW1lbnRFdmVudChldmVudClcbiAgfVxuXG4gIG9uRWxlbWVudEV2ZW50KGV2ZW50KSB7XG4gICAgLy9cbiAgfVxuXG4gIHN0YXRpYyBfRE9NSW50ZXJmYWNlKENvbXBvbmVudENsYXNzLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIG5ldyBDb21wb25lbnRDbGFzcyhvcHRpb25zKVxuICB9XG59XG4iLCJcbmNvbnN0IGdldEF0dHJpYnV0ZSA9IChmaXJzdCwgc2Vjb25kKSA9PiB7XG4gIGlmIChmaXJzdCA9PT0gJycpIHtcbiAgICByZXR1cm4gYGRhdGEtJHtzZWNvbmR9YFxuICB9XG4gIHJldHVybiBgZGF0YS0ke2ZpcnN0fS0ke3NlY29uZH1gXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRBdHRyaWJ1dGVzQ29uZmlnKGVsZW1lbnQsIG9iaiA9IHt9LCBhdHRycywgc3RhcnQgPSAnJykge1xuICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMob2JqKVxuICBcbiAga2V5cy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICBpZiAoc3RhcnQgPT09ICcnICYmIGF0dHJzLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcbiAgICAgIC8vIGNvbnRpbnVlIHdpdGggbmV4dCBpdGVyYXRpb25cbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygb2JqW2tleV0gPT09ICdvYmplY3QnICYmIG9ialtrZXldICE9PSBudWxsKSB7XG4gICAgICBsZXQga2V5U3RhcnQgPSBrZXlcbiAgICAgIGlmIChzdGFydCAhPT0gJycpIHtcbiAgICAgICAga2V5U3RhcnQgPSBgJHtzdGFydH0tJHtrZXl9YFxuICAgICAgfVxuXG4gICAgICBzZXRBdHRyaWJ1dGVzQ29uZmlnKGVsZW1lbnQsIG9ialtrZXldLCBhdHRycywga2V5U3RhcnQpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBhdHRyID0gZ2V0QXR0cmlidXRlKHN0YXJ0LCBrZXkpXG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0ciwgb2JqW2tleV0pXG4gIH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBdHRyaWJ1dGVzQ29uZmlnKGVsZW1lbnQsIG9iaiA9IHt9LCBhdHRycywgc3RhcnQgPSAnJykge1xuICBjb25zdCBuZXdPYmogPSBPYmplY3QuYXNzaWduKHt9LCBvYmopXG4gIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhvYmopXG5cbiAga2V5cy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICBpZiAoc3RhcnQgPT09ICcnICYmIGF0dHJzLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcbiAgICAgIC8vIGNvbnRpbnVlIHdpdGggbmV4dCBpdGVyYXRpb25cbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmIChvYmpba2V5XSAhPT0gbnVsbCAmJiBvYmpba2V5XS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0KSB7XG4gICAgICBsZXQga2V5U3RhcnQgPSBrZXlcbiAgICAgIGlmIChzdGFydCAhPT0gJycpIHtcbiAgICAgICAga2V5U3RhcnQgPSBgJHtzdGFydH0tJHtrZXl9YFxuICAgICAgfVxuXG4gICAgICBuZXdPYmpba2V5XSA9IGdldEF0dHJpYnV0ZXNDb25maWcoZWxlbWVudCwgb2JqW2tleV0sIGF0dHJzLCBrZXlTdGFydClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIHVwZGF0ZSB2YWx1ZVxuICAgIGxldCB2YWx1ZSA9IG9ialtrZXldIC8vIGRlZmF1bHQgdmFsdWVcbiAgICBjb25zdCB0eXBlID0gdHlwZW9mIHZhbHVlXG4gICAgY29uc3QgYXR0ciA9IGdldEF0dHJpYnV0ZShzdGFydCwga2V5KVxuICAgIGNvbnN0IGF0dHJWYWx1ZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHIpXG5cbiAgICBpZiAoYXR0clZhbHVlICE9PSBudWxsKSB7XG4gICAgICBpZiAodHlwZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIC8vIGNvbnZlcnQgc3RyaW5nIHRvIGJvb2xlYW5cbiAgICAgICAgdmFsdWUgPSBhdHRyVmFsdWUgPT09ICd0cnVlJ1xuICAgICAgfSBlbHNlIGlmICghaXNOYU4oYXR0clZhbHVlKSkge1xuICAgICAgICB2YWx1ZSA9IHBhcnNlSW50KGF0dHJWYWx1ZSwgMTApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSA9IGF0dHJWYWx1ZVxuICAgICAgfVxuICAgIH1cblxuICAgIG5ld09ialtrZXldID0gdmFsdWVcbiAgfSlcblxuICByZXR1cm4gbmV3T2JqXG59XG5cbmNvbnN0IHN0YWNrID0gW11cblxuZXhwb3J0IGRlZmF1bHQge1xuICBhZGQoY29tcG9uZW50KSB7XG4gICAgc3RhY2sucHVzaChjb21wb25lbnQpXG4gIH0sXG4gIHJlbW92ZShjb21wb25lbnQpIHtcbiAgICBjb25zdCBpbmRleCA9IHN0YWNrLmZpbmRJbmRleChjID0+IE9iamVjdC5pcyhjb21wb25lbnQsIGMpKVxuICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICBzdGFjay5zcGxpY2UoaW5kZXgsIDEpXG4gICAgfVxuICB9LFxuICBjbG9zYWJsZShjb21wb25lbnQpIHtcbiAgICByZXR1cm4gc3RhY2subGVuZ3RoID09PSAwIHx8IE9iamVjdC5pcyhzdGFja1tzdGFjay5sZW5ndGggLSAxXSwgY29tcG9uZW50KVxuICB9XG59XG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuaW1wb3J0IEV2ZW50IGZyb20gJy4uLy4uL2NvcmUvZXZlbnRzJ1xuaW1wb3J0IENvbXBvbmVudCBmcm9tICcuLi9jb21wb25lbnQnXG5pbXBvcnQgeyBnZXRBdHRyaWJ1dGVzQ29uZmlnIH0gZnJvbSAnLi4vY29tcG9uZW50TWFuYWdlcidcblxuY29uc3QgRGlhbG9nID0gKCgpID0+IHtcbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDb25zdGFudHNcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNvbnN0IE5BTUUgPSAnZGlhbG9nJ1xuICBjb25zdCBWRVJTSU9OID0gJzIuMC4wJ1xuICBjb25zdCBCQUNLRFJPUF9TRUxFQ1RPUiA9ICdkaWFsb2ctYmFja2Ryb3AnXG4gIGNvbnN0IERFRkFVTFRfUFJPUEVSVElFUyA9IHtcbiAgICBlbGVtZW50OiBudWxsLFxuICAgIHRpdGxlOiBudWxsLFxuICAgIG1lc3NhZ2U6IG51bGwsXG4gICAgY2FuY2VsYWJsZTogdHJ1ZSxcbiAgfVxuICBjb25zdCBEQVRBX0FUVFJTX1BST1BFUlRJRVMgPSBbXG4gICAgJ2NhbmNlbGFibGUnLFxuICBdXG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDbGFzcyBEZWZpbml0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjbGFzcyBEaWFsb2cgZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgICBzdXBlcihOQU1FLCBWRVJTSU9OLCBERUZBVUxUX1BST1BFUlRJRVMsIG9wdGlvbnMsIERBVEFfQVRUUlNfUFJPUEVSVElFUywgdHJ1ZSwgdHJ1ZSlcblxuICAgICAgdGhpcy50ZW1wbGF0ZSA9ICcnICtcbiAgICAgICc8ZGl2IGNsYXNzPVwiZGlhbG9nXCIgdGFiaW5kZXg9XCItMVwiIHJvbGU9XCJkaWFsb2dcIj4nICtcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJkaWFsb2ctaW5uZXJcIiByb2xlPVwiZG9jdW1lbnRcIj4nICtcbiAgICAgICAgICAnPGRpdiBjbGFzcz1cImRpYWxvZy1jb250ZW50XCI+JyArXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImRpYWxvZy1oZWFkZXJcIj4nICtcbiAgICAgICAgICAgICAgJzxoNSBjbGFzcz1cImRpYWxvZy10aXRsZVwiPjwvaDU+JyArXG4gICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImRpYWxvZy1ib2R5XCI+JyArXG4gICAgICAgICAgICAgICc8cD48L3A+JyArXG4gICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImRpYWxvZy1mb290ZXJcIj4nICtcbiAgICAgICAgICAgICAgJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCIgZGF0YS1kaXNtaXNzPVwiZGlhbG9nXCI+T2s8L2J1dHRvbj4nICtcbiAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICc8L2Rpdj4nICtcbiAgICAgICc8L2Rpdj4nXG5cbiAgICAgIGlmICh0aGlzLmR5bmFtaWNFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuYnVpbGQoKVxuICAgICAgfVxuICAgIH1cblxuICAgIGJ1aWxkKCkge1xuICAgICAgY29uc3QgYnVpbGRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cbiAgICAgIGJ1aWxkZXIuaW5uZXJIVE1MID0gdGhpcy50ZW1wbGF0ZVxuXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudCA9IGJ1aWxkZXIuZmlyc3RDaGlsZFxuXG4gICAgICAvLyB0aXRsZVxuICAgICAgaWYgKHRoaXMub3B0aW9ucy50aXRsZSAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZGlhbG9nLXRpdGxlJykuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLnRpdGxlXG4gICAgICB9XG5cbiAgICAgIC8vIG1lc3NhZ2VcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMubWVzc2FnZSAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZGlhbG9nLWJvZHknKS5maXJzdENoaWxkLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5tZXNzYWdlXG4gICAgICB9XG5cbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5vcHRpb25zLmVsZW1lbnQpXG5cbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlcygpXG4gICAgfVxuXG4gICAgYnVpbGRCYWNrZHJvcCgpIHtcbiAgICAgIGNvbnN0IGJhY2tkcm9wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgIGJhY2tkcm9wLnNldEF0dHJpYnV0ZSgnZGF0YS1pZCcsIHRoaXMuaWQpXG4gICAgICBiYWNrZHJvcC5jbGFzc0xpc3QuYWRkKEJBQ0tEUk9QX1NFTEVDVE9SKVxuXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGJhY2tkcm9wKVxuICAgIH1cblxuICAgIGdldEJhY2tkcm9wKCkge1xuICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC4ke0JBQ0tEUk9QX1NFTEVDVE9SfVtkYXRhLWlkPVwiJHt0aGlzLmlkfVwiXWApXG4gICAgfVxuXG4gICAgY2VudGVyKCkge1xuICAgICAgY29uc3QgY29tcHV0ZWRTdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMub3B0aW9ucy5lbGVtZW50KVxuICAgICAgLy8gY29uc3Qgd2lkdGggPSBjb21wdXRlZFN0eWxlLndpZHRoLnNsaWNlKDAsIGNvbXB1dGVkU3R5bGUud2lkdGgubGVuZ3RoIC0gMilcbiAgICAgIGNvbnN0IGhlaWdodCA9IGNvbXB1dGVkU3R5bGUuaGVpZ2h0LnNsaWNlKDAsIGNvbXB1dGVkU3R5bGUuaGVpZ2h0Lmxlbmd0aCAtIDIpXG5cbiAgICAgIGNvbnN0IHRvcCA9ICh3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKSAtIChoZWlnaHQgLyAyKVxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuc3R5bGUudG9wID0gYCR7dG9wfXB4YFxuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmVsZW1lbnQgPT09IG51bGwpIHtcbiAgICAgICAgLy8gYnVpbGQgYW5kIGluc2VydCBhIG5ldyBET00gZWxlbWVudFxuICAgICAgICB0aGlzLmJ1aWxkKClcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnc2hvdycpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICAvLyBhZGQgYSB0aW1lb3V0IHNvIHRoYXQgdGhlIENTUyBhbmltYXRpb24gd29ya3NcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5TSE9XKVxuICAgICAgICB0aGlzLmJ1aWxkQmFja2Ryb3AoKVxuXG4gICAgICAgIGNvbnN0IG9uU2hvd24gPSAoKSA9PiB7XG4gICAgICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuU0hPV04pXG4gICAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihFdmVudC5UUkFOU0lUSU9OX0VORCwgb25TaG93bilcblxuICAgICAgICAgIC8vIGF0dGFjaCBldmVudFxuICAgICAgICAgIHRoaXMuYXR0YWNoRXZlbnRzKClcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoRXZlbnQuVFJBTlNJVElPTl9FTkQsIG9uU2hvd24pXG5cbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc2hvdycpXG5cbiAgICAgICAgdGhpcy5jZW50ZXIoKVxuICAgICAgfSwgMTApXG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgb25FbGVtZW50RXZlbnQoZXZlbnQpIHtcbiAgICAgIGlmIChldmVudC50eXBlID09PSAna2V5dXAnICYmIGV2ZW50LmtleUNvZGUgIT09IDI3ICYmIGV2ZW50LmtleUNvZGUgIT09IDEzKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICAvLyBoaWRlIHRoZSBkaWFsb2dcbiAgICAgIHRoaXMuaGlkZSgpXG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgIGlmICghdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93JykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LkhJREUpXG5cbiAgICAgIHRoaXMuZGV0YWNoRXZlbnRzKClcblxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaGlkZScpXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93JylcblxuICAgICAgY29uc3QgYmFja2Ryb3AgPSB0aGlzLmdldEJhY2tkcm9wKClcblxuICAgICAgY29uc3Qgb25IaWRkZW4gPSAoKSA9PiB7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoYmFja2Ryb3ApXG5cbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpXG5cbiAgICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuSElEREVOKVxuXG4gICAgICAgIGJhY2tkcm9wLnJlbW92ZUV2ZW50TGlzdGVuZXIoRXZlbnQuVFJBTlNJVElPTl9FTkQsIG9uSGlkZGVuKVxuXG4gICAgICAgIC8vIHJlbW92ZSBnZW5lcmF0ZWQgZGlhbG9ncyBmcm9tIHRoZSBET01cbiAgICAgICAgaWYgKHRoaXMuZHluYW1pY0VsZW1lbnQpIHtcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRoaXMub3B0aW9ucy5lbGVtZW50KVxuICAgICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50ID0gbnVsbFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGJhY2tkcm9wLmFkZEV2ZW50TGlzdGVuZXIoRXZlbnQuVFJBTlNJVElPTl9FTkQsIG9uSGlkZGVuKVxuICAgICAgYmFja2Ryb3AuY2xhc3NMaXN0LmFkZCgnZmFkZW91dCcpXG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgYXR0YWNoRXZlbnRzKCkge1xuICAgICAgY29uc3QgZGlzbWlzc0J1dHRvbnMgPSB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1kaXNtaXNzXScpXG4gICAgICBpZiAoZGlzbWlzc0J1dHRvbnMpIHtcbiAgICAgICAgZGlzbWlzc0J1dHRvbnMuZm9yRWFjaChidXR0b24gPT4gdGhpcy5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IGJ1dHRvbiwgZXZlbnQ6ICdjbGljaycgfSkpXG4gICAgICB9XG5cbiAgICAgIC8vIGFkZCBldmVudHMgaWYgdGhlIGRpYWxvZyBpcyBjYW5jZWxhYmxlXG4gICAgICAvLyB3aGljaCBtZWFucyB0aGUgdXNlciBjYW4gaGlkZSB0aGUgZGlhbG9nXG4gICAgICAvLyBieSBwcmVzc2luZyB0aGUgRVNDIGtleSBvciBjbGljayBvdXRzaWRlIHRoZSBiYWNrZHJvcFxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5jYW5jZWxhYmxlKSB7XG4gICAgICAgIGNvbnN0IGJhY2tkcm9wID0gdGhpcy5nZXRCYWNrZHJvcCgpXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFbGVtZW50KHsgdGFyZ2V0OiBiYWNrZHJvcCwgZXZlbnQ6IEV2ZW50LlNUQVJUIH0pXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFbGVtZW50KHsgdGFyZ2V0OiBkb2N1bWVudCwgZXZlbnQ6ICdrZXl1cCcgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkZXRhY2hFdmVudHMoKSB7XG4gICAgICBjb25zdCBkaXNtaXNzQnV0dG9ucyA9IHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWRpc21pc3NdJylcbiAgICAgIGlmIChkaXNtaXNzQnV0dG9ucykge1xuICAgICAgICBkaXNtaXNzQnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB0aGlzLnVucmVnaXN0ZXJFbGVtZW50KHsgdGFyZ2V0OiBidXR0b24sIGV2ZW50OiAnY2xpY2snIH0pKVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmNhbmNlbGFibGUpIHtcbiAgICAgICAgY29uc3QgYmFja2Ryb3AgPSB0aGlzLmdldEJhY2tkcm9wKClcbiAgICAgICAgdGhpcy51bnJlZ2lzdGVyRWxlbWVudCh7IHRhcmdldDogYmFja2Ryb3AsIGV2ZW50OiBFdmVudC5TVEFSVCB9KVxuICAgICAgICB0aGlzLnVucmVnaXN0ZXJFbGVtZW50KHsgdGFyZ2V0OiBkb2N1bWVudCwgZXZlbnQ6ICdrZXl1cCcgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgX0RPTUludGVyZmFjZShvcHRpb25zKSB7XG4gICAgICByZXR1cm4gc3VwZXIuX0RPTUludGVyZmFjZShEaWFsb2csIG9wdGlvbnMpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBET00gQXBpIGltcGxlbWVudGF0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cbiAgY29uc3QgY29tcG9uZW50cyA9IFtdXG5cbiAgY29uc3QgZGlhbG9ncyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke05BTUV9YClcbiAgaWYgKGRpYWxvZ3MpIHtcbiAgICBkaWFsb2dzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IGdldEF0dHJpYnV0ZXNDb25maWcoZWxlbWVudCwgREVGQVVMVF9QUk9QRVJUSUVTLCBEQVRBX0FUVFJTX1BST1BFUlRJRVMpXG4gICAgICBjb25maWcuZWxlbWVudCA9IGVsZW1lbnRcblxuICAgICAgY29tcG9uZW50cy5wdXNoKHsgZWxlbWVudCwgZGlhbG9nOiBuZXcgRGlhbG9nKGNvbmZpZykgfSlcbiAgICB9KVxuICB9XG5cbiAgaWYgKGRpYWxvZ3MpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgY29uc3QgZGF0YVRvZ2dsZUF0dHIgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvZ2dsZScpXG4gICAgICBpZiAoZGF0YVRvZ2dsZUF0dHIgJiYgZGF0YVRvZ2dsZUF0dHIgPT09IE5BTUUpIHtcbiAgICAgICAgY29uc3QgaWQgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXRhcmdldCcpXG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGlkKVxuXG4gICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGNvbXBvbmVudHMuZmluZChjID0+IGMuZWxlbWVudCA9PT0gZWxlbWVudClcblxuICAgICAgICBpZiAoIWNvbXBvbmVudCkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgZXZlbnQudGFyZ2V0LmJsdXIoKVxuXG4gICAgICAgIGNvbXBvbmVudC5kaWFsb2cuc2hvdygpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHJldHVybiBEaWFsb2dcbn0pKClcblxuZXhwb3J0IGRlZmF1bHQgRGlhbG9nXG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuaW1wb3J0IENvbXBvbmVudCBmcm9tICcuLi9jb21wb25lbnQnXG5pbXBvcnQgRXZlbnQgZnJvbSAnLi4vLi4vY29yZS9ldmVudHMnXG5pbXBvcnQgeyBmaW5kVGFyZ2V0QnlDbGFzcyB9IGZyb20gJy4uLy4uL2NvcmUvdXRpbHMnXG5pbXBvcnQgeyBnZXRBdHRyaWJ1dGVzQ29uZmlnIH0gZnJvbSAnLi4vY29tcG9uZW50TWFuYWdlcidcblxuY29uc3QgRHJvcGRvd24gPSAoKCkgPT4ge1xuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENvbnN0YW50c1xuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY29uc3QgTkFNRSA9ICdkcm9wZG93bidcbiAgY29uc3QgVkVSU0lPTiA9ICcyLjAuMCdcbiAgY29uc3QgREVGQVVMVF9QUk9QRVJUSUVTID0ge1xuICAgIGVsZW1lbnQ6IG51bGwsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgfVxuICBjb25zdCBEQVRBX0FUVFJTX1BST1BFUlRJRVMgPSBbXG4gICAgJ2RlZmF1bHQnLFxuICBdXG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDbGFzcyBEZWZpbml0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjbGFzcyBEcm9wZG93biBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAgIHN1cGVyKE5BTUUsIFZFUlNJT04sIERFRkFVTFRfUFJPUEVSVElFUywgb3B0aW9ucywgREFUQV9BVFRSU19QUk9QRVJUSUVTLCBmYWxzZSwgZmFsc2UpXG5cbiAgICAgIGNvbnN0IHNlbGVjdGVkID0gdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtc2VsZWN0ZWRdJylcbiAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLmdldEl0ZW1EYXRhKHNlbGVjdGVkKVxuXG4gICAgICB0aGlzLnNldFNlbGVjdGVkKGl0ZW0udmFsdWUsIGl0ZW0udGV4dCwgZmFsc2UpXG4gICAgfVxuXG4gICAgc2V0UG9zaXRpb24oYnV0dG9uKSB7XG5cbiAgICB9XG5cbiAgICBzZXRTZWxlY3RlZCh2YWx1ZSA9ICcnLCB0ZXh0ID0gbnVsbCwgY2hlY2tFeGlzdHMgPSB0cnVlKSB7XG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5kZWZhdWx0KSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICBsZXQgdGV4dERpc3BsYXkgPSB0ZXh0XG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZGVmYXVsdC10ZXh0JykuaW5uZXJIVE1MID0gdGV4dFxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cImhpZGRlblwiXScpLnZhbHVlID0gdmFsdWVcblxuICAgICAgaWYgKGNoZWNrRXhpc3RzKSB7XG4gICAgICAgIGxldCBmb3VuZCA9IGZhbHNlXG4gICAgICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLml0ZW0nKVxuICAgICAgICBpZiAoaXRlbXMpIHtcbiAgICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlbXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmdldEl0ZW1EYXRhKGl0ZW0pXG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IGRhdGEudmFsdWUpIHtcbiAgICAgICAgICAgICAgLy8gdXBkYXRlIHRoZSB0ZXh0IHRvIGRpc3BsYXkgaWYgaXQgaXMgbnVsbCBvbmx5XG4gICAgICAgICAgICAgIGlmICh0ZXh0RGlzcGxheSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRleHREaXNwbGF5ID0gZGF0YS50ZXh0XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZm91bmQgPSB0cnVlXG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLmRlZmF1bHQtdGV4dCcpLmlubmVySFRNTCA9IHRleHREaXNwbGF5XG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJoaWRkZW5cIl0nKS52YWx1ZSA9IHZhbHVlXG5cbiAgICAgICAgaWYgKCFmb3VuZCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtOQU1FfS4gVGhlIHZhbHVlIFwiJHt2YWx1ZX1cIiBkb2VzIG5vdCBleGlzdCBpbiB0aGUgbGlzdCBvZiBpdGVtcy5gKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0U2VsZWN0ZWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cImhpZGRlblwiXScpLnZhbHVlXG4gICAgfVxuXG4gICAgZ2V0SXRlbURhdGEoaXRlbSA9IG51bGwpIHtcbiAgICAgIGxldCB0ZXh0ID0gJydcbiAgICAgIGxldCB2YWx1ZSA9ICcnXG5cbiAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgIHRleHQgPSBpdGVtLmdldEF0dHJpYnV0ZSgnZGF0YS10ZXh0JykgfHwgaXRlbS5pbm5lckhUTUxcblxuICAgICAgICBjb25zdCBzZWxlY3RlZFRleHROb2RlID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcudGV4dCcpXG4gICAgICAgIGlmIChzZWxlY3RlZFRleHROb2RlKSB7XG4gICAgICAgICAgdGV4dCA9IHNlbGVjdGVkVGV4dE5vZGUuaW5uZXJIVE1MXG4gICAgICAgIH1cblxuICAgICAgICB2YWx1ZSA9IGl0ZW0uZ2V0QXR0cmlidXRlKCdkYXRhLXZhbHVlJylcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHsgdGV4dCwgdmFsdWUgfVxuICAgIH1cblxuICAgIG9uRWxlbWVudEV2ZW50KGV2ZW50KSB7XG4gICAgICBpZiAoZXZlbnQudHlwZSA9PT0gRXZlbnQuU1RBUlQpIHtcbiAgICAgICAgY29uc3QgZHJvcGRvd24gPSBmaW5kVGFyZ2V0QnlDbGFzcyhldmVudC50YXJnZXQsICdkcm9wZG93bicpXG4gICAgICAgIGlmICghZHJvcGRvd24pIHtcbiAgICAgICAgICB0aGlzLmhpZGUoKVxuICAgICAgICB9XG5cbiAgICAgIH0gZWxzZSBpZiAoZXZlbnQudHlwZSA9PT0gJ2NsaWNrJykge1xuICAgICAgICBjb25zdCBpdGVtID0gZmluZFRhcmdldEJ5Q2xhc3MoZXZlbnQudGFyZ2V0LCAnaXRlbScpXG5cbiAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICBpZiAoaXRlbS5jbGFzc0xpc3QuY29udGFpbnMoJ2Rpc2FibGVkJykpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IGl0ZW1JbmZvID0gdGhpcy5nZXRJdGVtRGF0YShpdGVtKVxuICAgICAgICAgIHRoaXMuc2V0U2VsZWN0ZWQoaXRlbUluZm8udmFsdWUsIGl0ZW1JbmZvLnRleHQsIGZhbHNlKVxuXG4gICAgICAgICAgY29uc3QgZGV0YWlsID0geyBpdGVtLCB0ZXh0OiBpdGVtSW5mby50ZXh0LCB2YWx1ZTogaXRlbUluZm8udmFsdWUgfVxuICAgICAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LklURU1fU0VMRUNURUQsIGRldGFpbClcblxuICAgICAgICAgIHRoaXMuaGlkZSgpXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICAvLyBkb24ndCB0b2dnbGUgdGhlIGRyb3Bkb3duIGlmIHRoZSBldmVudCBjb25jZXJucyBoZWFkZXJzLCBkaXZpZGVyc1xuICAgICAgICBjb25zdCBkcm9wZG93bk1lbnUgPSBmaW5kVGFyZ2V0QnlDbGFzcyhldmVudC50YXJnZXQsICdkcm9wZG93bi1tZW51JylcbiAgICAgICAgaWYgKGRyb3Bkb3duTWVudSkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50b2dnbGUoKVxuICAgICAgfVxuICAgIH1cblxuICAgIHRvZ2dsZSgpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhpZGUoKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5zaG93KClcbiAgICB9XG5cbiAgICBzaG93KCkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG5cbiAgICAgIGNvbnN0IGRyb3Bkb3duTWVudSA9IHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kcm9wZG93bi1tZW51JylcblxuICAgICAgLy8gc2Nyb2xsIHRvIHRvcFxuICAgICAgZHJvcGRvd25NZW51LnNjcm9sbFRvcCA9IDBcblxuICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuU0hPVylcbiAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LlNIT1dOKVxuXG4gICAgICB0aGlzLnJlZ2lzdGVyRWxlbWVudCh7IHRhcmdldDogZHJvcGRvd25NZW51LCBldmVudDogJ2NsaWNrJyB9KSAgICAgIFxuICAgICAgdGhpcy5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IGRvY3VtZW50LmJvZHksIGV2ZW50OiBFdmVudC5TVEFSVCB9KVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGhpZGUoKSB7XG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG5cbiAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LkhJREUpXG4gICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5ISURERU4pXG5cbiAgICAgIHRoaXMudW5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kcm9wZG93bi1tZW51JyksIGV2ZW50OiAnY2xpY2snIH0pICAgICAgXG4gICAgICB0aGlzLnVucmVnaXN0ZXJFbGVtZW50KHsgdGFyZ2V0OiBkb2N1bWVudC5ib2R5LCBldmVudDogRXZlbnQuU1RBUlQgfSlcblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBzdGF0aWMgX0RPTUludGVyZmFjZShvcHRpb25zKSB7XG4gICAgICByZXR1cm4gc3VwZXIuX0RPTUludGVyZmFjZShEcm9wZG93biwgb3B0aW9ucylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIERPTSBBcGkgaW1wbGVtZW50YXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuICBjb25zdCBjb21wb25lbnRzID0gW11cblxuICBjb25zdCBkcm9wZG93bnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuJHtOQU1FfWApXG4gIGlmIChkcm9wZG93bnMpIHtcbiAgICBkcm9wZG93bnMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgY29uc3QgY29uZmlnID0gZ2V0QXR0cmlidXRlc0NvbmZpZyhlbGVtZW50LCBERUZBVUxUX1BST1BFUlRJRVMsIERBVEFfQVRUUlNfUFJPUEVSVElFUylcbiAgICAgIGNvbmZpZy5lbGVtZW50ID0gZWxlbWVudFxuXG4gICAgICBjb21wb25lbnRzLnB1c2gobmV3IERyb3Bkb3duKGNvbmZpZykpXG4gICAgfSlcbiAgfVxuXG4gIGlmIChkcm9wZG93bnMpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgY29uc3QgZHJvcGRvd25NZW51ID0gZmluZFRhcmdldEJ5Q2xhc3MoZXZlbnQudGFyZ2V0LCAnZHJvcGRvd24tbWVudScpXG4gICAgICBpZiAoZHJvcGRvd25NZW51KSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjb25zdCBkcm9wZG93biA9IGZpbmRUYXJnZXRCeUNsYXNzKGV2ZW50LnRhcmdldCwgJ2Ryb3Bkb3duJylcblxuICAgICAgaWYgKGRyb3Bkb3duKSB7XG4gICAgICAgIGNvbnN0IGRhdGFUb2dnbGVBdHRyID0gZHJvcGRvd24uZ2V0QXR0cmlidXRlKCdkYXRhLXRvZ2dsZScpXG4gICAgICAgIGlmIChkYXRhVG9nZ2xlQXR0ciAmJiBkYXRhVG9nZ2xlQXR0ciA9PT0gTkFNRSAmJiBkcm9wZG93bikge1xuICAgICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGNvbXBvbmVudHMuZmluZChjID0+IGMuZ2V0RWxlbWVudCgpID09PSBkcm9wZG93bilcblxuICAgICAgICAgIGlmICghY29tcG9uZW50KSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb21wb25lbnQudG9nZ2xlKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICByZXR1cm4gRHJvcGRvd25cbn0pKClcblxuZXhwb3J0IGRlZmF1bHQgRHJvcGRvd25cbiIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3F1YXJrLWRldi9QaG9ub24tRnJhbWV3b3JrL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gJy4uL2NvbXBvbmVudCdcblxuY29uc3QgTG9hZGVyID0gKCgpID0+IHtcbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDb25zdGFudHNcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNvbnN0IE5BTUUgPSAnbG9hZGVyJ1xuICBjb25zdCBWRVJTSU9OID0gJzIuMC4wJ1xuICBjb25zdCBERUZBVUxUX1BST1BFUlRJRVMgPSB7XG4gICAgZWxlbWVudDogbnVsbCxcbiAgICBjb2xvcjogbnVsbCxcbiAgICBzaXplOiBudWxsLFxuICB9XG4gIGNvbnN0IERBVEFfQVRUUlNfUFJPUEVSVElFUyA9IFtdXG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDbGFzcyBEZWZpbml0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjbGFzcyBMb2FkZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgICBzdXBlcihOQU1FLCBWRVJTSU9OLCBERUZBVUxUX1BST1BFUlRJRVMsIG9wdGlvbnMsIERBVEFfQVRUUlNfUFJPUEVSVElFUywgZmFsc2UsIGZhbHNlKVxuXG4gICAgICAvLyBzZXQgY29sb3JcbiAgICAgIGNvbnN0IGxvYWRlclNwaW5uZXIgPSB0aGlzLmdldFNwaW5uZXIoKVxuICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMuY29sb3IgPT09ICdzdHJpbmcnXG4gICAgICAgICYmICFsb2FkZXJTcGlubmVyLmNsYXNzTGlzdC5jb250YWlucyhgY29sb3ItJHt0aGlzLm9wdGlvbnMuY29sb3J9YCkpIHtcbiAgICAgICAgbG9hZGVyU3Bpbm5lci5jbGFzc0xpc3QuYWRkKGBjb2xvci0ke3RoaXMub3B0aW9ucy5jb2xvcn1gKVxuICAgICAgfVxuXG4gICAgICB0aGlzLmN1c3RvbVNpemUgPSB0aGlzLm9wdGlvbnMuc2l6ZSAhPT0gbnVsbFxuICAgIH1cblxuICAgIGdldENsaWVudFNpemUoKSB7XG4gICAgICBpZiAoIXRoaXMuY3VzdG9tU2l6ZSkge1xuICAgICAgICBjb25zdCBzaXplID0gdGhpcy5vcHRpb25zLmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkgICAgICAgIFxuICAgICAgICByZXR1cm4gc2l6ZS5oZWlnaHRcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5zaXplXG4gICAgfVxuXG4gICAgZ2V0U3Bpbm5lcigpIHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcubG9hZGVyLXNwaW5uZXInKVxuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRlJykpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHNpemUgPSB0aGlzLmdldENsaWVudFNpemUoKVxuICAgICAgdGhpcy5vcHRpb25zLnNpemUgPSBzaXplXG5cbiAgICAgIGlmICh0aGlzLmN1c3RvbVNpemUpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuc3R5bGUud2lkdGggPSBgJHt0aGlzLm9wdGlvbnMuc2l6ZX1weGBcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gYCR7dGhpcy5vcHRpb25zLnNpemV9cHhgXG5cbiAgICAgICAgY29uc3QgbG9hZGVyU3Bpbm5lciA9IHRoaXMuZ2V0U3Bpbm5lcigpXG4gICAgICAgIGxvYWRlclNwaW5uZXIuc3R5bGUud2lkdGggPSBgJHt0aGlzLm9wdGlvbnMuc2l6ZX1weGBcbiAgICAgICAgbG9hZGVyU3Bpbm5lci5zdHlsZS5oZWlnaHQgPSBgJHt0aGlzLm9wdGlvbnMuc2l6ZX1weGBcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBhbmltYXRlKHN0YXJ0QW5pbWF0aW9uID0gdHJ1ZSkge1xuICAgICAgaWYgKHN0YXJ0QW5pbWF0aW9uKSB7XG4gICAgICAgIHRoaXMuc2hvdygpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmhpZGUoKVxuICAgICAgfVxuXG4gICAgICBjb25zdCBsb2FkZXJTcGlubmVyID0gdGhpcy5nZXRTcGlubmVyKClcblxuICAgICAgaWYgKHN0YXJ0QW5pbWF0aW9uICYmXG4gICAgICAgICFsb2FkZXJTcGlubmVyLmNsYXNzTGlzdC5jb250YWlucygnbG9hZGVyLXNwaW5uZXItYW5pbWF0ZWQnKSkge1xuICAgICAgICBsb2FkZXJTcGlubmVyLmNsYXNzTGlzdC5hZGQoJ2xvYWRlci1zcGlubmVyLWFuaW1hdGVkJylcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cblxuICAgICAgaWYgKCFzdGFydEFuaW1hdGlvbiAmJlxuICAgICAgICBsb2FkZXJTcGlubmVyLmNsYXNzTGlzdC5jb250YWlucygnbG9hZGVyLXNwaW5uZXItYW5pbWF0ZWQnKSkge1xuICAgICAgICBsb2FkZXJTcGlubmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2xvYWRlci1zcGlubmVyLWFuaW1hdGVkJylcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZGUnKSkge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoaWRlJylcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBzdGF0aWMgX0RPTUludGVyZmFjZShvcHRpb25zKSB7XG4gICAgICByZXR1cm4gc3VwZXIuX0RPTUludGVyZmFjZShMb2FkZXIsIG9wdGlvbnMpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIExvYWRlclxufSkoKVxuXG5leHBvcnQgZGVmYXVsdCBMb2FkZXJcbiIsIi8qKlxuKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuKi9cbmltcG9ydCBFdmVudCBmcm9tICcuLi8uLi9jb3JlL2V2ZW50cydcbmltcG9ydCBDb21wb25lbnQgZnJvbSAnLi4vY29tcG9uZW50J1xuXG5jb25zdCBOb3RpZmljYXRpb24gPSAoKCkgPT4ge1xuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICogQ29uc3RhbnRzXG4gICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICovXG5cbiAgY29uc3QgTkFNRSA9ICdub3RpZmljYXRpb24nXG4gIGNvbnN0IFZFUlNJT04gPSAnMi4wLjAnXG4gIGNvbnN0IERFRkFVTFRfUFJPUEVSVElFUyA9IHtcbiAgICBlbGVtZW50OiBudWxsLFxuICAgIG1lc3NhZ2U6ICcnLFxuICAgIHNob3dCdXR0b246IHRydWUsXG4gICAgdGltZW91dDogbnVsbCxcbiAgICBiYWNrZ3JvdW5kOiAncHJpbWFyeScsXG4gIH1cbiAgY29uc3QgREFUQV9BVFRSU19QUk9QRVJUSUVTID0gW1xuICAgICd0aW1lb3V0JyxcbiAgXVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY2xhc3MgTm90aWZpY2F0aW9uIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgc3VwZXIoTkFNRSwgVkVSU0lPTiwgREVGQVVMVF9QUk9QRVJUSUVTLCBvcHRpb25zLCBEQVRBX0FUVFJTX1BST1BFUlRJRVMsIHRydWUsIGZhbHNlKVxuXG4gICAgICB0aGlzLnRlbXBsYXRlID0gJycgK1xuICAgICAgJzxkaXYgY2xhc3M9XCJub3RpZmljYXRpb25cIj4nICtcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJub3RpZmljYXRpb24taW5uZXJcIj4nICtcbiAgICAgICAgICAnPGRpdiBjbGFzcz1cIm1lc3NhZ2VcIj48L2Rpdj4nICtcbiAgICAgICAgICAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cIm5vdGlmaWNhdGlvblwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPicgK1xuICAgICAgICAgICAgJzxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZ0aW1lczs8L3NwYW4+JyArXG4gICAgICAgICAgJzwvYnV0dG9uPicgK1xuICAgICAgICAnPC9kaXY+JyArXG4gICAgICAnPC9kaXY+J1xuXG4gICAgICBpZiAodGhpcy5keW5hbWljRWxlbWVudCkge1xuICAgICAgICB0aGlzLmJ1aWxkKClcbiAgICAgIH1cblxuICAgICAgdGhpcy50aW1lb3V0Q2FsbGJhY2sgPSBudWxsXG4gICAgfVxuXG4gICAgYnVpbGQoKSB7XG4gICAgICBjb25zdCBidWlsZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcblxuICAgICAgYnVpbGRlci5pbm5lckhUTUwgPSB0aGlzLnRlbXBsYXRlXG5cbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50ID0gYnVpbGRlci5maXJzdENoaWxkXG5cbiAgICAgIC8vIHRleHQgbWVzc2FnZVxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLm1lc3NhZ2UnKS5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMubWVzc2FnZVxuXG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5zaG93QnV0dG9uKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbicpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICAgIH1cblxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLm9wdGlvbnMuZWxlbWVudClcblxuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGVzKClcbiAgICB9XG5cbiAgICBzaG93KCkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5lbGVtZW50ID09PSBudWxsKSB7XG4gICAgICAgIC8vIGJ1aWxkIGFuZCBpbnNlcnQgYSBuZXcgRE9NIGVsZW1lbnRcbiAgICAgICAgdGhpcy5idWlsZCgpXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3cnKSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgLy8gcmVzZXQgY29sb3JcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuYmFja2dyb3VuZCkge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2NsYXNzJylcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuc2V0QXR0cmlidXRlKCdjbGFzcycsICdub3RpZmljYXRpb24nKVxuXG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoYGJnLSR7dGhpcy5vcHRpb25zLmJhY2tncm91bmR9YClcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignYnV0dG9uJykuY2xhc3NMaXN0LmFkZChgYnRuLSR7dGhpcy5vcHRpb25zLmJhY2tncm91bmR9YClcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaG93QnV0dG9uKSB7XG4gICAgICAgIC8vIGF0dGFjaCB0aGUgYnV0dG9uIGhhbmRsZXJcbiAgICAgICAgY29uc3QgYnV0dG9uRWxlbWVudCA9IHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbicpXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFbGVtZW50KHsgdGFyZ2V0OiBidXR0b25FbGVtZW50LCBldmVudDogJ2NsaWNrJyB9KVxuICAgICAgfVxuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc2hvdycpXG5cbiAgICAgICAgLy8gc2V0IHBvc2l0aW9uXG4gICAgICAgIGNvbnN0IGFjdGl2ZU5vdGlmaWNhdGlvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubm90aWZpY2F0aW9uLnNob3cnKSB8fCBbXVxuICAgICAgICBsZXQgcHVzaERpc3RhbmNlID0gMFxuICAgICAgICBhY3RpdmVOb3RpZmljYXRpb25zLmZvckVhY2goKG5vdGlmaWNhdGlvbikgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZWxlbWVudCAhPT0gbm90aWZpY2F0aW9uKSB7XG4gICAgICAgICAgICBjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm90aWZpY2F0aW9uKVxuICAgICAgICAgICAgcHVzaERpc3RhbmNlICs9IG5vdGlmaWNhdGlvbi5vZmZzZXRIZWlnaHQgKyBwYXJzZUludChzdHlsZS5tYXJnaW5Cb3R0b20sIDEwKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWSgke3B1c2hEaXN0YW5jZX1weClgXG5cbiAgICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuU0hPVylcblxuICAgICAgICBjb25zdCBvblNob3duID0gKCkgPT4ge1xuICAgICAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LlNIT1dOKVxuICAgICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoRXZlbnQuVFJBTlNJVElPTl9FTkQsIG9uU2hvd24pXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKEV2ZW50LlRSQU5TSVRJT05fRU5ELCBvblNob3duKVxuXG4gICAgICB9LCAxKVxuXG4gICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcih0aGlzLm9wdGlvbnMudGltZW91dCkgJiYgdGhpcy5vcHRpb25zLnRpbWVvdXQgPiAwKSB7XG4gICAgICAgIC8vIGlmIHRoZXJlIGlzIGEgdGltZW91dCwgYXV0byBoaWRlIHRoZSBub3RpZmljYXRpb25cbiAgICAgICAgdGhpcy50aW1lb3V0Q2FsbGJhY2sgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLmhpZGUoKVxuICAgICAgICB9LCB0aGlzLm9wdGlvbnMudGltZW91dCArIDEpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgIC8qXG4gICAgICAgKiBwcmV2ZW50IHRvIGNsb3NlIGEgbm90aWZpY2F0aW9uIHdpdGggYSB0aW1lb3V0XG4gICAgICAgKiBpZiB0aGUgdXNlciBoYXMgYWxyZWFkeSBjbGlja2VkIG9uIHRoZSBidXR0b25cbiAgICAgICAqL1xuICAgICAgaWYgKHRoaXMudGltZW91dENhbGxiYWNrKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRDYWxsYmFjaylcbiAgICAgICAgdGhpcy50aW1lb3V0Q2FsbGJhY2sgPSBudWxsXG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93JykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LkhJREUpXG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0J1dHRvbikge1xuICAgICAgICBjb25zdCBidXR0b25FbGVtZW50ID0gdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignYnV0dG9uJylcbiAgICAgICAgdGhpcy51bnJlZ2lzdGVyRWxlbWVudCh7IHRhcmdldDogYnV0dG9uRWxlbWVudCwgZXZlbnQ6ICdjbGljaycgfSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoaWRlJylcblxuICAgICAgY29uc3Qgb25IaWRkZW4gPSAoKSA9PiB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoRXZlbnQuVFJBTlNJVElPTl9FTkQsIG9uSGlkZGVuKVxuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJylcblxuICAgICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5ISURERU4pXG5cbiAgICAgICAgaWYgKHRoaXMuZHluYW1pY0VsZW1lbnQpIHtcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRoaXMub3B0aW9ucy5lbGVtZW50KVxuICAgICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50ID0gbnVsbFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoRXZlbnQuVFJBTlNJVElPTl9FTkQsIG9uSGlkZGVuKVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIG9uRWxlbWVudEV2ZW50KCkge1xuICAgICAgdGhpcy5oaWRlKClcbiAgICB9XG5cbiAgICBzdGF0aWMgX0RPTUludGVyZmFjZShvcHRpb25zKSB7XG4gICAgICByZXR1cm4gc3VwZXIuX0RPTUludGVyZmFjZShOb3RpZmljYXRpb24sIG9wdGlvbnMpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIE5vdGlmaWNhdGlvblxufSkoKVxuXG5leHBvcnQgZGVmYXVsdCBOb3RpZmljYXRpb25cbiIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3F1YXJrLWRldi9QaG9ub24tRnJhbWV3b3JrL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5pbXBvcnQgRXZlbnQgZnJvbSAnLi4vLi4vY29yZS9ldmVudHMnXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gJy4uL2NvbXBvbmVudCdcbmltcG9ydCB7IGdldEF0dHJpYnV0ZXNDb25maWcgfSBmcm9tICcuLi9jb21wb25lbnRNYW5hZ2VyJ1xuaW1wb3J0IHsgZmluZFRhcmdldEJ5QXR0ciB9IGZyb20gJy4uLy4uL2NvcmUvdXRpbHMnXG5cbmNvbnN0IE9mZkNhbnZhcyA9ICgoKSA9PiB7XG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ29uc3RhbnRzXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjb25zdCBOQU1FID0gJ29mZi1jYW52YXMnXG4gIGNvbnN0IFZFUlNJT04gPSAnMi4wLjAnXG4gIGNvbnN0IEJBQ0tEUk9QX1NFTEVDVE9SID0gJ29mZi1jYW52YXMtYmFja2Ryb3AnXG4gIGNvbnN0IERFRkFVTFRfUFJPUEVSVElFUyA9IHtcbiAgICBlbGVtZW50OiBudWxsLFxuICAgIGFzaWRlOiB7XG4gICAgICBtZDogZmFsc2UsXG4gICAgICBsZzogZmFsc2UsXG4gICAgICB4bDogZmFsc2UsXG4gICAgfSxcbiAgfVxuICBjb25zdCBEQVRBX0FUVFJTX1BST1BFUlRJRVMgPSBbXG4gICAgJ2FzaWRlJyxcbiAgXVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY2xhc3MgT2ZmQ2FudmFzIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgc3VwZXIoTkFNRSwgVkVSU0lPTiwgREVGQVVMVF9QUk9QRVJUSUVTLCBvcHRpb25zLCBEQVRBX0FUVFJTX1BST1BFUlRJRVMsIGZhbHNlLCB0cnVlKVxuXG4gICAgICB0aGlzLnVzZUJhY2tkcm9wID0gdHJ1ZVxuICAgICAgdGhpcy5jdXJyZW50V2lkdGggPSBudWxsXG4gICAgICB0aGlzLmFuaW1hdGUgPSB0cnVlXG5cbiAgICAgIGNvbnN0IHNtID0geyBuYW1lOiAnc20nLCBtZWRpYTogd2luZG93Lm1hdGNoTWVkaWEoJyhtaW4td2lkdGg6IDFweCknKSB9XG4gICAgICBjb25zdCBtZCA9IHsgbmFtZTogJ21kJywgbWVkaWE6IHdpbmRvdy5tYXRjaE1lZGlhKCcobWluLXdpZHRoOiA3NjhweCknKSB9XG4gICAgICBjb25zdCBsZyA9IHsgbmFtZTogJ2xnJywgbWVkaWE6IHdpbmRvdy5tYXRjaE1lZGlhKCcobWluLXdpZHRoOiA5OTJweCknKSB9XG4gICAgICBjb25zdCB4bCA9IHsgbmFtZTogJ3hsJywgbWVkaWE6IHdpbmRvdy5tYXRjaE1lZGlhKCcobWluLXdpZHRoOiAxMjAwcHgpJykgfVxuXG4gICAgICBjb25zdCBzaXplcyA9IFtzbSwgbWQsIGxnLCB4bF0ucmV2ZXJzZSgpXG5cbiAgICAgIGNvbnN0IGNoZWNrV2lkdGggPSAoKSA9PiB7XG4gICAgICAgIGlmICghKCdtYXRjaE1lZGlhJyBpbiB3aW5kb3cpKSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBzaXplcy5ldmVyeSgoc2l6ZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IG1hdGNoID0gc2l6ZS5tZWRpYS5tZWRpYS5tYXRjaCgvW2Etel0/LXdpZHRoOlxccz8oWzAtOV0rKS8pXG5cbiAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgIGlmIChzaXplLm1lZGlhLm1hdGNoZXMpIHtcbiAgICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFdpZHRoICE9PSBzaXplLm5hbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEFzaWRlKHNpemUubmFtZSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRXaWR0aCA9IHNpemUubmFtZVxuICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBjaGVja1dpZHRoKClcblxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGNoZWNrV2lkdGgsIGZhbHNlKSAgICAgIFxuICAgIH1cblxuICAgIHByZXZlbnRDbG9zYWJsZSgpIHtcbiAgICAgIHJldHVybiBzdXBlci5wcmV2ZW50Q2xvc2FibGUoKSB8fCB0aGlzLm9wdGlvbnMuYXNpZGVbdGhpcy5jdXJyZW50V2lkdGhdID09PSB0cnVlXG4gICAgfVxuXG4gICAgc2V0QXNpZGUobmFtZSkge1xuICAgICAgY29uc3QgY29udGVudCA9IGRvY3VtZW50LmJvZHlcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5hc2lkZVtuYW1lXSA9PT0gdHJ1ZSkge1xuICAgICAgICBpZiAoIWNvbnRlbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdvZmYtY2FudmFzLWFzaWRlJykpIHtcbiAgICAgICAgICBjb250ZW50LmNsYXNzTGlzdC5hZGQoJ29mZi1jYW52YXMtYXNpZGUnKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51c2VCYWNrZHJvcCA9IGZhbHNlXG5cbiAgICAgICAgLy8gYXZvaWQgYW5pbWF0aW9uIGJ5IHNldHRpbmcgYW5pbWF0ZSB0byBmYWxzZVxuICAgICAgICB0aGlzLmFuaW1hdGUgPSBmYWxzZVxuICAgICAgICB0aGlzLnNob3coKVxuICAgICAgICAvLyByZW1vdmUgcHJldmlvdXMgYmFja2Ryb3BcbiAgICAgICAgdGhpcy5yZW1vdmVCYWNrZHJvcCgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoY29udGVudC5jbGFzc0xpc3QuY29udGFpbnMoJ29mZi1jYW52YXMtYXNpZGUnKSkge1xuICAgICAgICAgIGNvbnRlbnQuY2xhc3NMaXN0LnJlbW92ZSgnb2ZmLWNhbnZhcy1hc2lkZScpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmhpZGUoKVxuICAgICAgICB0aGlzLnVzZUJhY2tkcm9wID0gdHJ1ZVxuICAgICAgICB0aGlzLmFuaW1hdGUgPSB0cnVlXG4gICAgICB9XG4gICAgfVxuXG4gICAgb25FbGVtZW50RXZlbnQoZXZlbnQpIHtcbiAgICAgIGlmIChldmVudC50eXBlID09PSAna2V5dXAnICYmIGV2ZW50LmtleUNvZGUgIT09IDI3ICYmIGV2ZW50LmtleUNvZGUgIT09IDEzKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICAvLyBoaWRlIHRoZSBvZmYtY2FudmFzXG4gICAgICB0aGlzLmhpZGUoKVxuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93JykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIC8vIGFkZCBhIHRpbWVvdXQgc28gdGhhdCB0aGUgQ1NTIGFuaW1hdGlvbiB3b3Jrc1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LlNIT1cpXG5cbiAgICAgICAgY29uc3Qgb25TaG93biA9ICgpID0+IHtcbiAgICAgICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5TSE9XTilcblxuICAgICAgICAgIGlmICh0aGlzLmFuaW1hdGUpIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoRXZlbnQuVFJBTlNJVElPTl9FTkQsIG9uU2hvd24pXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdhbmltYXRlJylcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy51c2VCYWNrZHJvcCkge1xuICAgICAgICAgIHRoaXMuY3JlYXRlQmFja2Ryb3AoKVxuICAgICAgICB9XG5cblxuICAgICAgICBpZiAodGhpcy5hbmltYXRlKSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFdmVudC5UUkFOU0lUSU9OX0VORCwgb25TaG93bikgICAgICAgIFxuICAgICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FuaW1hdGUnKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGRpcmVjdGx5IHRyaWdnZXIgdGhlIG9uU2hvd25cbiAgICAgICAgICBvblNob3duKClcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3Nob3cnKSAgICAgICAgXG5cbiAgICAgICAgLy8gYXR0YWNoIGV2ZW50XG4gICAgICAgIHRoaXMuYXR0YWNoRXZlbnRzKClcbiAgICAgIH0sIDEpXG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgIGlmICghdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93JykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LkhJREUpXG5cbiAgICAgIHRoaXMuZGV0YWNoRXZlbnRzKClcblxuICAgICAgaWYgKHRoaXMuYW5pbWF0ZSkge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhbmltYXRlJylcbiAgICAgIH1cblxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpXG5cbiAgICAgIGlmICh0aGlzLnVzZUJhY2tkcm9wKSB7XG4gICAgICAgIGNvbnN0IGJhY2tkcm9wID0gdGhpcy5nZXRCYWNrZHJvcCgpXG5cbiAgICAgICAgY29uc3Qgb25IaWRkZW4gPSAoKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuYW5pbWF0ZSkge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnYW5pbWF0ZScpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYmFja2Ryb3AucmVtb3ZlRXZlbnRMaXN0ZW5lcihFdmVudC5UUkFOU0lUSU9OX0VORCwgb25IaWRkZW4pXG4gICAgICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuSElEREVOKSAgICAgICAgXG4gICAgICAgICAgdGhpcy5yZW1vdmVCYWNrZHJvcCgpXG4gICAgICAgIH1cblxuICAgICAgICBiYWNrZHJvcC5hZGRFdmVudExpc3RlbmVyKEV2ZW50LlRSQU5TSVRJT05fRU5ELCBvbkhpZGRlbilcbiAgICAgICAgYmFja2Ryb3AuY2xhc3NMaXN0LmFkZCgnZmFkZW91dCcpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgY3JlYXRlQmFja2Ryb3AoKSB7XG4gICAgICBjb25zdCBiYWNrZHJvcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICBiYWNrZHJvcC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnLCB0aGlzLmlkKVxuICAgICAgYmFja2Ryb3AuY2xhc3NMaXN0LmFkZChCQUNLRFJPUF9TRUxFQ1RPUilcblxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChiYWNrZHJvcClcbiAgICB9XG5cbiAgICBnZXRCYWNrZHJvcCgpIHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuJHtCQUNLRFJPUF9TRUxFQ1RPUn1bZGF0YS1pZD1cIiR7dGhpcy5pZH1cIl1gKVxuICAgIH1cblxuICAgIHJlbW92ZUJhY2tkcm9wKCkge1xuICAgICAgY29uc3QgYmFja2Ryb3AgPSB0aGlzLmdldEJhY2tkcm9wKClcbiAgICAgIGlmIChiYWNrZHJvcCkge1xuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGJhY2tkcm9wKVxuICAgICAgfVxuICAgIH1cblxuICAgIGF0dGFjaEV2ZW50cygpIHtcbiAgICAgIGNvbnN0IGRpc21pc3NCdXR0b25zID0gdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtZGlzbWlzc10nKVxuXG4gICAgICBpZiAoZGlzbWlzc0J1dHRvbnMpIHtcbiAgICAgICAgZGlzbWlzc0J1dHRvbnMuZm9yRWFjaChidXR0b24gPT4gdGhpcy5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IGJ1dHRvbiwgZXZlbnQ6ICdjbGljaycgfSkpXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnVzZUJhY2tkcm9wKSB7XG4gICAgICAgIGNvbnN0IGJhY2tkcm9wID0gdGhpcy5nZXRCYWNrZHJvcCgpICAgICAgXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFbGVtZW50KHsgdGFyZ2V0OiBiYWNrZHJvcCwgZXZlbnQ6IEV2ZW50LlNUQVJUIH0pXG4gICAgICB9XG5cbiAgICAgIHRoaXMucmVnaXN0ZXJFbGVtZW50KHsgdGFyZ2V0OiBkb2N1bWVudCwgZXZlbnQ6ICdrZXl1cCcgfSlcbiAgICB9XG5cbiAgICBkZXRhY2hFdmVudHMoKSB7XG4gICAgICBjb25zdCBkaXNtaXNzQnV0dG9ucyA9IHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWRpc21pc3NdJylcblxuICAgICAgaWYgKGRpc21pc3NCdXR0b25zKSB7XG4gICAgICAgIGRpc21pc3NCdXR0b25zLmZvckVhY2goYnV0dG9uID0+IHRoaXMudW5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IGJ1dHRvbiwgZXZlbnQ6ICdjbGljaycgfSkpXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnVzZUJhY2tkcm9wKSB7XG4gICAgICAgIGNvbnN0IGJhY2tkcm9wID0gdGhpcy5nZXRCYWNrZHJvcCgpXG4gICAgICAgIHRoaXMudW5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IGJhY2tkcm9wLCBldmVudDogRXZlbnQuU1RBUlQgfSlcbiAgICAgIH1cblxuICAgICAgdGhpcy51bnJlZ2lzdGVyRWxlbWVudCh7IHRhcmdldDogZG9jdW1lbnQsIGV2ZW50OiAna2V5dXAnIH0pXG4gICAgfVxuXG4gICAgc3RhdGljIF9ET01JbnRlcmZhY2Uob3B0aW9ucykge1xuICAgICAgcmV0dXJuIHN1cGVyLl9ET01JbnRlcmZhY2UoT2ZmQ2FudmFzLCBvcHRpb25zKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogRE9NIEFwaSBpbXBsZW1lbnRhdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG4gIGNvbnN0IGNvbXBvbmVudHMgPSBbXVxuXG4gIGNvbnN0IG9mZkNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke05BTUV9YClcbiAgaWYgKG9mZkNhbnZhcykge1xuICAgIG9mZkNhbnZhcy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBjb25zdCBjb25maWcgPSBnZXRBdHRyaWJ1dGVzQ29uZmlnKGVsZW1lbnQsIERFRkFVTFRfUFJPUEVSVElFUywgREFUQV9BVFRSU19QUk9QRVJUSUVTKVxuICAgICAgY29uZmlnLmVsZW1lbnQgPSBlbGVtZW50XG5cbiAgICAgIGNvbXBvbmVudHMucHVzaCh7IGVsZW1lbnQsIG9mZkNhbnZhczogbmV3IE9mZkNhbnZhcyhjb25maWcpIH0pXG4gICAgfSlcbiAgfVxuXG4gIGlmIChvZmZDYW52YXMpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgY29uc3QgdGFyZ2V0ID0gZmluZFRhcmdldEJ5QXR0cihldmVudC50YXJnZXQsICdkYXRhLXRvZ2dsZScpXG4gICAgICBpZiAoIXRhcmdldCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgY29uc3QgZGF0YVRvZ2dsZUF0dHIgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvZ2dsZScpXG4gICAgICBpZiAoZGF0YVRvZ2dsZUF0dHIgJiYgZGF0YVRvZ2dsZUF0dHIgPT09IE5BTUUpIHtcbiAgICAgICAgY29uc3QgaWQgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXRhcmdldCcpXG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGlkKVxuXG4gICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGNvbXBvbmVudHMuZmluZChjID0+IGMuZWxlbWVudCA9PT0gZWxlbWVudClcblxuICAgICAgICBpZiAoIWNvbXBvbmVudCkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgdGFyZ2V0LmJsdXIoKVxuXG4gICAgICAgIGNvbXBvbmVudC5vZmZDYW52YXMuc2hvdygpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHJldHVybiBPZmZDYW52YXNcbn0pKClcblxuZXhwb3J0IGRlZmF1bHQgT2ZmQ2FudmFzXG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuaW1wb3J0IENvbXBvbmVudCBmcm9tICcuLi9jb21wb25lbnQnXG5pbXBvcnQgRXZlbnQgZnJvbSAnLi4vLi4vY29yZS9ldmVudHMnXG5cbmNvbnN0IFByb2dyZXNzID0gKCgpID0+IHtcbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDb25zdGFudHNcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNvbnN0IE5BTUUgPSAncHJvZ3Jlc3MnXG4gIGNvbnN0IFZFUlNJT04gPSAnMi4wLjAnXG4gIGNvbnN0IERFRkFVTFRfUFJPUEVSVElFUyA9IHtcbiAgICBlbGVtZW50OiBudWxsLFxuICAgIGhlaWdodDogNSxcbiAgICBtaW46IDAsXG4gICAgbWF4OiAxMDAsXG4gICAgbGFiZWw6IGZhbHNlLFxuICAgIHN0cmlwZWQ6IGZhbHNlLFxuICAgIGJhY2tncm91bmQ6IG51bGwsXG4gIH1cbiAgY29uc3QgREFUQV9BVFRSU19QUk9QRVJUSUVTID0gW1xuICAgICdoZWlnaHQnLFxuICAgICdtaW4nLFxuICAgICdtYXgnLFxuICAgICdsYWJlbCcsXG4gICAgJ3N0cmlwZWQnLFxuICAgICdiYWNrZ3JvdW5kJyxcbiAgXVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY2xhc3MgUHJvZ3Jlc3MgZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgICBzdXBlcihOQU1FLCBWRVJTSU9OLCBERUZBVUxUX1BST1BFUlRJRVMsIG9wdGlvbnMsIERBVEFfQVRUUlNfUFJPUEVSVElFUywgZmFsc2UsIGZhbHNlKVxuXG4gICAgICAvLyBzZXQgdGhlIHdhbnRlZCBoZWlnaHRcbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnN0eWxlLmhlaWdodCA9IGAke3RoaXMub3B0aW9ucy5oZWlnaHR9cHhgXG5cbiAgICAgIC8vIHNldCBtaW4gYW5kIG1heCB2YWx1ZXNcbiAgICAgIGNvbnN0IHByb2dyZXNzQmFyID0gdGhpcy5nZXRQcm9ncmVzc0JhcigpXG4gICAgICBwcm9ncmVzc0Jhci5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVtaW4nLCBgJHt0aGlzLm9wdGlvbnMubWlufWApXG4gICAgICBwcm9ncmVzc0Jhci5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVtYXgnLCBgJHt0aGlzLm9wdGlvbnMubWF4fWApXG5cbiAgICAgIC8vIHNldCBzdHJpcGVkXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnN0cmlwZWRcbiAgICAgICAgJiYgIXByb2dyZXNzQmFyLmNsYXNzTGlzdC5jb250YWlucygncHJvZ3Jlc3MtYmFyLXN0cmlwZWQnKSkge1xuICAgICAgICBwcm9ncmVzc0Jhci5jbGFzc0xpc3QuYWRkKCdwcm9ncmVzcy1iYXItc3RyaXBlZCcpXG4gICAgICB9XG5cbiAgICAgIC8vIHNldCBiYWNrZ3JvdW5kXG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5iYWNrZ3JvdW5kID09PSAnc3RyaW5nJ1xuICAgICAgICAmJiAhcHJvZ3Jlc3NCYXIuY2xhc3NMaXN0LmNvbnRhaW5zKGBiZy0ke3RoaXMub3B0aW9ucy5iYWNrZ3JvdW5kfWApKSB7XG4gICAgICAgIHByb2dyZXNzQmFyLmNsYXNzTGlzdC5hZGQoYGJnLSR7dGhpcy5vcHRpb25zLmJhY2tncm91bmR9YClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRQcm9ncmVzc0JhcigpIHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcucHJvZ3Jlc3MtYmFyJylcbiAgICB9XG5cbiAgICBzZXQodmFsdWUgPSAwKSB7XG4gICAgICBjb25zdCBwcm9ncmVzc0JhciA9IHRoaXMuZ2V0UHJvZ3Jlc3NCYXIoKVxuICAgICAgY29uc3QgcHJvZ3Jlc3MgPSBNYXRoLnJvdW5kKCh2YWx1ZSAvICh0aGlzLm9wdGlvbnMubWluICsgdGhpcy5vcHRpb25zLm1heCkpICogMTAwKVxuXG4gICAgICBpZiAodmFsdWUgPCB0aGlzLm9wdGlvbnMubWluKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYCR7TkFNRX0uIFdhcm5pbmcsICR7dmFsdWV9IGlzIHVuZGVyIG1pbiB2YWx1ZS5gKVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgaWYgKHZhbHVlID4gdGhpcy5vcHRpb25zLm1heCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKGAke05BTUV9LiBXYXJuaW5nLCAke3ZhbHVlfSBpcyBhYm92ZSBtYXggdmFsdWUuYCkgICAgICAgICAgXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICBwcm9ncmVzc0Jhci5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVub3cnLCBgJHt2YWx1ZX1gKSAgICAgIFxuXG4gICAgICAvLyBzZXQgbGFiZWxcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMubGFiZWwpIHtcbiAgICAgICAgcHJvZ3Jlc3NCYXIuaW5uZXJIVE1MID0gYCR7cHJvZ3Jlc3N9JWBcbiAgICAgIH1cblxuICAgICAgLy8gc2V0IHBlcmNlbnRhZ2VcbiAgICAgIHByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gYCR7cHJvZ3Jlc3N9JWBcblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBhbmltYXRlKHN0YXJ0QW5pbWF0aW9uID0gdHJ1ZSkge1xuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuc3RyaXBlZCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKGAke05BTUV9LiBBbmltYXRpb24gd29ya3Mgb25seSB3aXRoIHN0cmlwZWQgcHJvZ3Jlc3MuYClcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHByb2dyZXNzQmFyID0gdGhpcy5nZXRQcm9ncmVzc0JhcigpXG5cbiAgICAgIGlmIChzdGFydEFuaW1hdGlvblxuICAgICAgICAmJiAhcHJvZ3Jlc3NCYXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdwcm9ncmVzcy1iYXItYW5pbWF0ZWQnKSkge1xuICAgICAgICBwcm9ncmVzc0Jhci5jbGFzc0xpc3QuYWRkKCdwcm9ncmVzcy1iYXItYW5pbWF0ZWQnKVxuICAgICAgfVxuXG4gICAgICBpZiAoIXN0YXJ0QW5pbWF0aW9uXG4gICAgICAgICYmIHByb2dyZXNzQmFyLmNsYXNzTGlzdC5jb250YWlucygncHJvZ3Jlc3MtYmFyLWFuaW1hdGVkJykpIHtcbiAgICAgICAgcHJvZ3Jlc3NCYXIuY2xhc3NMaXN0LnJlbW92ZSgncHJvZ3Jlc3MtYmFyLWFuaW1hdGVkJylcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBzaG93KCkge1xuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gYCR7dGhpcy5vcHRpb25zLmhlaWdodH1weGBcbiAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LlNIT1cpXG4gICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5TSE9XTilcblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gJzBweCdcbiAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LkhJREUpXG4gICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5ISURERU4pXG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgc3RhdGljIF9ET01JbnRlcmZhY2Uob3B0aW9ucykge1xuICAgICAgcmV0dXJuIHN1cGVyLl9ET01JbnRlcmZhY2UoUHJvZ3Jlc3MsIG9wdGlvbnMpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIFByb2dyZXNzXG59KSgpXG5cbmV4cG9ydCBkZWZhdWx0IFByb2dyZXNzXG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuaW1wb3J0IENvbXBvbmVudCBmcm9tICcuLi9jb21wb25lbnQnXG5pbXBvcnQgeyBnZXRBdHRyaWJ1dGVzQ29uZmlnIH0gZnJvbSAnLi4vY29tcG9uZW50TWFuYWdlcidcbmltcG9ydCBFdmVudCBmcm9tICcuLi8uLi9jb3JlL2V2ZW50cydcbmltcG9ydCB7IGZpbmRUYXJnZXRCeUNsYXNzIH0gZnJvbSAnLi4vLi4vY29yZS91dGlscydcblxuY29uc3QgVGFiID0gKCgpID0+IHtcbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDb25zdGFudHNcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNvbnN0IE5BTUUgPSAndGFiJ1xuICBjb25zdCBWRVJTSU9OID0gJzIuMC4wJ1xuICBjb25zdCBERUZBVUxUX1BST1BFUlRJRVMgPSB7XG5cbiAgfVxuICBjb25zdCBEQVRBX0FUVFJTX1BST1BFUlRJRVMgPSBbXG4gIF1cbiAgY29uc3QgVEFCX0NPTlRFTlRfU0VMRUNUT1IgPSAnLnRhYi1wYW5lJ1xuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY2xhc3MgVGFiIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgc3VwZXIoTkFNRSwgVkVSU0lPTiwgREVGQVVMVF9QUk9QRVJUSUVTLCBvcHRpb25zLCBEQVRBX0FUVFJTX1BST1BFUlRJRVMsIGZhbHNlLCBmYWxzZSlcbiAgICB9XG5cbiAgICBzaG93KCkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGlkID0gdGhpcy5vcHRpb25zLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJylcbiAgICAgIGNvbnN0IG5hdiA9IGZpbmRUYXJnZXRCeUNsYXNzKHRoaXMub3B0aW9ucy5lbGVtZW50LCAnbmF2JylcbiAgICAgIGNvbnN0IG5hdlRhYnMgPSBuYXYgPyBuYXYucXVlcnlTZWxlY3RvckFsbChgW2RhdGEtdG9nZ2xlPVwiJHtOQU1FfVwiXWApIDogbnVsbFxuXG4gICAgICBpZiAobmF2VGFicykge1xuICAgICAgICBuYXZUYWJzLmZvckVhY2goKHRhYikgPT4ge1xuICAgICAgICAgIGlmICh0YWIuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuICAgICAgICAgICAgdGFiLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICAgICAgfVxuICAgICAgICAgIHRhYi5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCBmYWxzZSlcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIHRydWUpXG5cbiAgICAgIGNvbnN0IHRhYkNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGlkKVxuICAgICAgY29uc3QgdGFiQ29udGVudHMgPSB0YWJDb250ZW50LnBhcmVudE5vZGUucXVlcnlTZWxlY3RvckFsbChUQUJfQ09OVEVOVF9TRUxFQ1RPUilcblxuICAgICAgaWYgKHRhYkNvbnRlbnRzKSB7XG4gICAgICAgIHRhYkNvbnRlbnRzLmZvckVhY2goKHRhYikgPT4ge1xuICAgICAgICAgIGlmICh0YWIuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuICAgICAgICAgICAgdGFiLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICB0YWJDb250ZW50LmNsYXNzTGlzdC5hZGQoJ3Nob3dpbmcnKVxuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgY29uc3Qgb25TaG93ZWQgPSAoKSA9PiB7XG4gICAgICAgICAgdGFiQ29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCdhbmltYXRlJylcbiAgICAgICAgICB0YWJDb250ZW50LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgICAgICAgdGFiQ29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93aW5nJylcbiAgICAgICAgICB0YWJDb250ZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoRXZlbnQuVFJBTlNJVElPTl9FTkQsIG9uU2hvd2VkKVxuICAgICAgICB9XG5cbiAgICAgICAgdGFiQ29udGVudC5hZGRFdmVudExpc3RlbmVyKEV2ZW50LlRSQU5TSVRJT05fRU5ELCBvblNob3dlZClcblxuICAgICAgICB0YWJDb250ZW50LmNsYXNzTGlzdC5hZGQoJ2FuaW1hdGUnKVxuXG4gICAgICB9LCAyMClcblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgfVxuXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCBmYWxzZSlcblxuICAgICAgY29uc3QgaWQgPSB0aGlzLm9wdGlvbnMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKVxuICAgICAgY29uc3QgdGFiQ29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoaWQpXG5cbiAgICAgIGlmICh0YWJDb250ZW50LmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcbiAgICAgICAgdGFiQ29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIHN0YXRpYyBfRE9NSW50ZXJmYWNlKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBzdXBlci5fRE9NSW50ZXJmYWNlKFRhYiwgb3B0aW9ucylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIERPTSBBcGkgaW1wbGVtZW50YXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuICBjb25zdCBjb21wb25lbnRzID0gW11cblxuICBjb25zdCB0YWJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgW2RhdGEtdG9nZ2xlPVwiJHtOQU1FfVwiXWApXG4gIGlmICh0YWJzKSB7XG4gICAgdGFicy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAvLyBjb25zdCBjb25maWcgPSB7fVxuICAgICAgY29uc3QgY29uZmlnID0gZ2V0QXR0cmlidXRlc0NvbmZpZyhlbGVtZW50LCBERUZBVUxUX1BST1BFUlRJRVMsIERBVEFfQVRUUlNfUFJPUEVSVElFUylcbiAgICAgIGNvbmZpZy5lbGVtZW50ID0gZWxlbWVudFxuXG4gICAgICBjb21wb25lbnRzLnB1c2goVGFiLl9ET01JbnRlcmZhY2UoY29uZmlnKSlcbiAgICB9KVxuICB9XG5cbiAgaWYgKHRhYnMpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgY29uc3QgZGF0YVRvZ2dsZUF0dHIgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvZ2dsZScpXG4gICAgICBpZiAoZGF0YVRvZ2dsZUF0dHIgJiYgZGF0YVRvZ2dsZUF0dHIgPT09IE5BTUUpIHtcbiAgICAgICAgY29uc3QgaWQgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdocmVmJylcblxuICAgICAgICBjb25zdCBjb21wb25lbnQgPSBjb21wb25lbnRzLmZpbmQoYyA9PiBjLmdldEVsZW1lbnQoKS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSA9PT0gaWQpXG5cbiAgICAgICAgaWYgKCFjb21wb25lbnQpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbXBvbmVudC5zaG93KClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgcmV0dXJuIFRhYlxufSkoKVxuXG5leHBvcnQgZGVmYXVsdCBUYWJcbiIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3F1YXJrLWRldi9QaG9ub24tRnJhbWV3b3JrL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmNvbnN0IEFqYXggPSAoKCkgPT4ge1xuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENvbnN0YW50c1xuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY29uc3QgTkFNRSA9ICdhamF4J1xuICBjb25zdCBWRVJTSU9OID0gJzIuMC4wJ1xuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY2xhc3MgQWpheCB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBBamF4LlxuICAgICAqIEBwYXJhbSB7e21ldGhvZDogc3RyaW5nLCB1cmw6IHN0cmluZywgY29tcGxldGU6IEZ1bmN0aW9uLCBzdWNjZXNzOiBGdW5jdGlvbiwgZXJyb3I6IEZ1bmN0aW9uLCBkYXRhOiBhbnksIGNyb3NzRG9tYWluOiBib29sZWFuLCBoZWFkZXJzOiB7W2hlYWRlcjogc3RyaW5nXTogc3RyaW5nfSwgdGltZW91dDogbnVtYmVyLCBjb250ZW50VHlwZTogbnVtYmVyLCBkYXRhVHlwZTogc3RyaW5nIH19IG9wdHNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICBpZiAodHlwZW9mIG9wdHMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtOQU1FfS0ke1ZFUlNJT059YClcbiAgICAgIH1cbiAgICAgIHRoaXMub3B0cyA9IG9wdHNcbiAgICAgIHRoaXMuZXJyb3JDb2RlID0gbnVsbFxuICAgIH1cblxuICAgIGNyZWF0ZVhocigpIHtcbiAgICAgIGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gICAgICBpZiAoJ3dpdGhDcmVkZW50aWFscycgaW4geGhyICYmIHRoaXMub3B0cy5jcm9zc0RvbWFpbiA9PT0gdHJ1ZSkge1xuICAgICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZVxuICAgICAgfVxuICAgICAgcmV0dXJuIHhoclxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCBoZWFkZXJzXG4gICAgICogQHBhcmFtIHt7W2hlYWRlcjogc3RyaW5nXTogc3RyaW5nfX0gaGVhZGVyc1xuICAgICAqL1xuICAgIHNldEhlYWRlcnMoaGVhZGVycyA9IHt9KSB7XG4gICAgICBmb3IgKGNvbnN0IGtleSBpbiBoZWFkZXJzKSB7XG4gICAgICAgIHRoaXMueGhyLnNldFJlcXVlc3RIZWFkZXIoa2V5LCBoZWFkZXJzW2tleV0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgb25QcmVFeGVjdXRlKCkge1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdHMuaGVhZGVycyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgdGhpcy5zZXRIZWFkZXJzKHRoaXMub3B0cy5oZWFkZXJzKVxuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0cy50aW1lb3V0ID09PSAnbnVtYmVyJykge1xuICAgICAgICB0aGlzLnhoci50aW1lb3V0ID0gdGhpcy5vcHRzLnRpbWVvdXRcbiAgICAgICAgdGhpcy54aHIub250aW1lb3V0ID0gKCkgPT4ge1xuICAgICAgICAgIHRoaXMuZXJyb3JDb2RlID0gJ1RJTUVPVVRfRVhDRUVERUQnXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdHMuY29udGVudFR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMuc2V0SGVhZGVycyh7ICdDb250ZW50LXR5cGUnOiB0aGlzLm9wdHMuY29udGVudFR5cGUgfSlcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub3B0cy5kYXRhVHlwZSA9PT0gJ3htbCcgJiYgdGhpcy54aHIub3ZlcnJpZGVNaW1lVHlwZSkge1xuICAgICAgICB0aGlzLnhoci5vdmVycmlkZU1pbWVUeXBlKCdhcHBsaWNhdGlvbi94bWw7IGNoYXJzZXQ9dXRmLTgnKVxuICAgICAgfVxuICAgIH1cblxuICAgIHBhcnNlUmVzcG9uc2UoKSB7XG4gICAgICBsZXQgcmVzcG9uc2UgPSBudWxsXG4gICAgICBpZiAodGhpcy5vcHRzLmRhdGFUeXBlID09PSAnanNvbicpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXNwb25zZSA9IEpTT04ucGFyc2UodGhpcy54aHIucmVzcG9uc2VUZXh0KVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIHRoaXMuZXJyb3JDb2RlID0gJ0pTT05fTUFMRk9STUVEJ1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMub3B0cy5kYXRhVHlwZSA9PT0gJ3htbCcpIHtcbiAgICAgICAgcmVzcG9uc2UgPSB0aGlzLnhoci5yZXNwb25zZVhNTFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzcG9uc2UgPSB0aGlzLnhoci5yZXNwb25zZVRleHRcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNwb25zZVxuICAgIH1cblxuICAgIHJ1blJlcXVlc3QoKSB7XG4gICAgICB0aGlzLnhociA9IHRoaXMuY3JlYXRlWGhyKClcbiAgICAgIHRoaXMueGhyLm9wZW4odGhpcy5vcHRzLm1ldGhvZCwgdGhpcy5vcHRzLnVybCwgdHJ1ZSlcbiAgICAgIHRoaXMub25QcmVFeGVjdXRlKClcblxuICAgICAgdGhpcy54aHIub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICBpZiAocGFyc2VJbnQodGhpcy54aHIucmVhZHlTdGF0ZSkgPT09IDQpIHtcbiAgICAgICAgICBjb25zdCBzdGF0dXMgPSB0aGlzLnhoci5zdGF0dXMudG9TdHJpbmcoKVxuXG4gICAgICAgICAgLy8gcmVzcG9uc2UgcmVjZWl2ZWRcbiAgICAgICAgICBpZiAodHlwZW9mIHRoaXMub3B0cy5jb21wbGV0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5vcHRzLmNvbXBsZXRlKHRoaXMuZXJyb3JDb2RlLCB0aGlzLnhocilcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBzdWNjZXNzIDJ4eFxuICAgICAgICAgIGlmIChzdGF0dXNbMF0gPT09ICcyJykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdHMuc3VjY2VzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICB0aGlzLm9wdHMuc3VjY2Vzcyh0aGlzLnBhcnNlUmVzcG9uc2UoKSwgdGhpcy54aHIpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBlcnJvciAoMXh4LCAyeHgsIDN4eCwgNXh4KVxuICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRzLmVycm9yID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAvLyBUaW1lb3V0IGluIG9yZGVyIHRvIHdhaXQgb24gdGhlIHRpbWVvdXQgbGltaXRcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5vcHRzLmVycm9yKHRoaXMuZXJyb3JDb2RlLCB0aGlzLnhocilcbiAgICAgICAgICAgIH0sIDEpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLnhoci5zZW5kKHRoaXMub3B0cy5kYXRhKVxuXG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIGNhbmNlbCgpIHtcbiAgICAgIHRoaXMuZXJyb3JDb2RlID0gJ0NBTkNFTEVEJ1xuICAgICAgaWYgKHRoaXMueGhyKSB7XG4gICAgICAgIHRoaXMueGhyLmFib3J0KClcbiAgICAgIH1cbiAgICAgIHRoaXMueGhyID0gbnVsbFxuICAgIH1cblxuICAgIC8vIGdldHRlcnNcblxuICAgIHN0YXRpYyBnZXQgdmVyc2lvbigpIHtcbiAgICAgIHJldHVybiBgJHtOQU1FfS4ke1ZFUlNJT059YFxuICAgIH1cblxuICAgIC8vIHB1YmxpY1xuXG4gICAgLy8gc3RhdGljXG4gICAgc3RhdGljIF9ET01JbnRlcmZhY2Uob3B0cykge1xuICAgICAgcmV0dXJuIG5ldyBBamF4KG9wdHMpLnJ1blJlcXVlc3QoKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBBamF4XG59KSgpXG5cbmV4cG9ydCBkZWZhdWx0IEFqYXhcbiIsImV4cG9ydCBmdW5jdGlvbiBkaXNwYXRjaFdpbkRvY0V2ZW50KGV2ZW50TmFtZSwgbW9kdWxlTmFtZSwgZGV0YWlsID0ge30pIHtcbiAgY29uc3QgZnVsbEV2ZW50TmFtZSA9IGAke2V2ZW50TmFtZX0ucGguJHttb2R1bGVOYW1lfWBcbiAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGZ1bGxFdmVudE5hbWUsIHsgZGV0YWlsIH0pKVxuICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChmdWxsRXZlbnROYW1lLCB7IGRldGFpbCB9KSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BhdGNoRWxlbWVudEV2ZW50KGRvbUVsZW1lbnQsIGV2ZW50TmFtZSwgbW9kdWxlTmFtZSwgZGV0YWlsID0ge30pIHtcbiAgY29uc3QgZnVsbEV2ZW50TmFtZSA9IGAke2V2ZW50TmFtZX0ucGguJHttb2R1bGVOYW1lfWBcbiAgZG9tRWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChmdWxsRXZlbnROYW1lLCB7IGRldGFpbCB9KSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BhdGNoUGFnZUV2ZW50KGV2ZW50TmFtZSwgcGFnZU5hbWUsIGRldGFpbCA9IHt9KSB7XG4gIGNvbnN0IGZ1bGxFdmVudE5hbWUgPSBgJHtwYWdlTmFtZX0uJHtldmVudE5hbWV9YFxuICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoZnVsbEV2ZW50TmFtZSwgeyBkZXRhaWwgfSkpXG4gIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGZ1bGxFdmVudE5hbWUsIHsgZGV0YWlsIH0pKVxufVxuIiwiLy8gQHRvZG8ga2VlcCA/XG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKCkgPT4ge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0FuIGVycm9yIGhhcyBvY2N1cmVkISBZb3UgY2FuIHBlbiBhbiBpc3N1ZSBoZXJlOiBodHRwczovL2dpdGh1Yi5jb20vcXVhcmstZGV2L1Bob25vbi1GcmFtZXdvcmsvaXNzdWVzJylcbiAgfSlcbn1cblxuLy8gVXNlIGF2YWlsYWJsZSBldmVudHNcbmxldCBhdmFpbGFibGVFdmVudHMgPSBbJ21vdXNlZG93bicsICdtb3VzZW1vdmUnLCAnbW91c2V1cCddXG5sZXQgdG91Y2hTY3JlZW4gPSBmYWxzZVxuXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgaWYgKCgnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cpIHx8IHdpbmRvdy5Eb2N1bWVudFRvdWNoICYmIGRvY3VtZW50IGluc3RhbmNlb2YgRG9jdW1lbnRUb3VjaCkge1xuICAgIHRvdWNoU2NyZWVuID0gdHJ1ZVxuICAgIGF2YWlsYWJsZUV2ZW50cyA9IFsndG91Y2hzdGFydCcsICd0b3VjaG1vdmUnLCAndG91Y2hlbmQnLCAndG91Y2hjYW5jZWwnXVxuICB9XG5cbiAgaWYgKHdpbmRvdy5uYXZpZ2F0b3IucG9pbnRlckVuYWJsZWQpIHtcbiAgICBhdmFpbGFibGVFdmVudHMgPSBbJ3BvaW50ZXJkb3duJywgJ3BvaW50ZXJtb3ZlJywgJ3BvaW50ZXJ1cCcsICdwb2ludGVyY2FuY2VsJ11cbiAgfSBlbHNlIGlmICh3aW5kb3cubmF2aWdhdG9yLm1zUG9pbnRlckVuYWJsZWQpIHtcbiAgICBhdmFpbGFibGVFdmVudHMgPSBbJ01TUG9pbnRlckRvd24nLCAnTVNQb2ludGVyTW92ZScsICdNU1BvaW50ZXJVcCcsICdNU1BvaW50ZXJDYW5jZWwnXVxuICB9XG59XG5cbmNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbmNvbnN0IHRyYW5zaXRpb25zID0gW1xuICB7IG5hbWU6ICd0cmFuc2l0aW9uJywgc3RhcnQ6ICd0cmFuc2l0aW9uc3RhcnQnLCBlbmQ6ICd0cmFuc2l0aW9uZW5kJyB9LFxuICB7IG5hbWU6ICdNb3pUcmFuc2l0aW9uJywgc3RhcnQ6ICd0cmFuc2l0aW9uc3RhcnQnLCBlbmQ6ICd0cmFuc2l0aW9uZW5kJyB9LFxuICB7IG5hbWU6ICdtc1RyYW5zaXRpb24nLCBzdGFydDogJ21zVHJhbnNpdGlvblN0YXJ0JywgZW5kOiAnbXNUcmFuc2l0aW9uRW5kJyB9LFxuICB7IG5hbWU6ICdXZWJraXRUcmFuc2l0aW9uJywgc3RhcnQ6ICd3ZWJraXRUcmFuc2l0aW9uU3RhcnQnLCBlbmQ6ICd3ZWJraXRUcmFuc2l0aW9uRW5kJyB9LFxuXVxuY29uc3QgYW5pbWF0aW9ucyA9IFtcbiAgeyBuYW1lOiAnYW5pbWF0aW9uJywgc3RhcnQ6ICdhbmltYXRpb25zdGFydCcsIGVuZDogJ2FuaW1hdGlvbmVuZCcgfSxcbiAgeyBuYW1lOiAnTW96QW5pbWF0aW9uJywgc3RhcnQ6ICdhbmltYXRpb25zdGFydCcsIGVuZDogJ2FuaW1hdGlvbmVuZCcgfSxcbiAgeyBuYW1lOiAnbXNBbmltYXRpb24nLCBzdGFydDogJ21zQW5pbWF0aW9uU3RhcnQnLCBlbmQ6ICdtc0FuaW1hdGlvbkVuZCcgfSxcbiAgeyBuYW1lOiAnV2Via2l0QW5pbWF0aW9uJywgc3RhcnQ6ICd3ZWJraXRBbmltYXRpb25TdGFydCcsIGVuZDogJ3dlYmtpdEFuaW1hdGlvbkVuZCcgfSxcbl1cblxuY29uc3QgdHJhbnNpdGlvblN0YXJ0ID0gdHJhbnNpdGlvbnMuZmluZCh0ID0+IGVsLnN0eWxlW3QubmFtZV0gIT09IHVuZGVmaW5lZCkuc3RhcnRcbmNvbnN0IHRyYW5zaXRpb25FbmQgPSB0cmFuc2l0aW9ucy5maW5kKHQgPT4gZWwuc3R5bGVbdC5uYW1lXSAhPT0gdW5kZWZpbmVkKS5lbmRcbmNvbnN0IGFuaW1hdGlvblN0YXJ0ID0gYW5pbWF0aW9ucy5maW5kKHQgPT4gZWwuc3R5bGVbdC5uYW1lXSAhPT0gdW5kZWZpbmVkKS5zdGFydFxuY29uc3QgYW5pbWF0aW9uRW5kID0gYW5pbWF0aW9ucy5maW5kKHQgPT4gZWwuc3R5bGVbdC5uYW1lXSAhPT0gdW5kZWZpbmVkKS5lbmRcblxuZXhwb3J0IGRlZmF1bHQge1xuICAvLyB0b3VjaCBzY3JlZW4gc3VwcG9ydFxuICBUT1VDSF9TQ1JFRU46IHRvdWNoU2NyZWVuLFxuXG4gIC8vIG5ldHdvcmtcbiAgTkVUV09SS19PTkxJTkU6ICdvbmxpbmUnLFxuICBORVRXT1JLX09GRkxJTkU6ICdvZmZsaW5lJyxcbiAgTkVUV09SS19SRUNPTk5FQ1RJTkc6ICdyZWNvbm5lY3RpbmcnLFxuICBORVRXT1JLX1JFQ09OTkVDVElOR19TVUNDRVNTOiAncmVjb25uZWN0LnN1Y2Nlc3MnLFxuICBORVRXT1JLX1JFQ09OTkVDVElOR19GQUlMVVJFOiAncmVjb25uZWN0LmZhaWx1cmUnLFxuXG4gIC8vIHVzZXIgaW50ZXJmYWNlIHN0YXRlc1xuICBTSE9XOiAnc2hvdycsXG4gIFNIT1dOOiAnc2hvd24nLFxuICBISURFOiAnaGlkZScsXG4gIEhJRERFTjogJ2hpZGRlbicsXG5cbiAgLy8gaGFzaFxuICBIQVNIOiAnaGFzaCcsXG5cbiAgLy8gdG91Y2gsIG1vdXNlIGFuZCBwb2ludGVyIGV2ZW50cyBwb2x5ZmlsbFxuICBTVEFSVDogYXZhaWxhYmxlRXZlbnRzWzBdLFxuICBNT1ZFOiBhdmFpbGFibGVFdmVudHNbMV0sXG4gIEVORDogYXZhaWxhYmxlRXZlbnRzWzJdLFxuICBDQU5DRUw6IHR5cGVvZiBhdmFpbGFibGVFdmVudHNbM10gPT09ICd1bmRlZmluZWQnID8gbnVsbCA6IGF2YWlsYWJsZUV2ZW50c1szXSxcblxuICAvLyB0cmFuc2l0aW9uc1xuICBUUkFOU0lUSU9OX1NUQVJUOiB0cmFuc2l0aW9uU3RhcnQsXG4gIFRSQU5TSVRJT05fRU5EOiB0cmFuc2l0aW9uRW5kLFxuXG4gIC8vIGFuaW1hdGlvbnNcbiAgQU5JTUFUSU9OX1NUQVJUOiBhbmltYXRpb25TdGFydCxcbiAgQU5JTUFUSU9OX0VORDogYW5pbWF0aW9uRW5kLFxuXG4gIC8vIGRyb3Bkb3duXG4gIElURU1fU0VMRUNURUQ6ICdpdGVtU2VsZWN0ZWQnLFxufSIsIi8qKlxuKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuKi9cblxuY29uc3QgQmluZGVyID0gKCgpID0+IHtcbiAgLyoqXG4gICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICogQ29uc3RhbnRzXG4gICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICovXG5cbiAgY29uc3QgTkFNRSA9ICdpbnRsLWJpbmRlcidcbiAgY29uc3QgVkVSU0lPTiA9ICcyLjAuMCdcblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENsYXNzIERlZmluaXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNsYXNzIEJpbmRlciB7XG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgZGF0YSkge1xuICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudFxuICAgICAgdGhpcy5kYXRhID0gZGF0YVxuXG4gICAgICBpZiAoIXRoaXMuaXNFbGVtZW50KHRoaXMuZWxlbWVudCkpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIC8vIGFycmF5IG9mIEhUTUxFbGVtZW50XG4gICAgICBpZiAodGhpcy5lbGVtZW50Lmxlbmd0aCAmJiB0aGlzLmVsZW1lbnQubGVuZ3RoID4gMCkge1xuICAgICAgICB0aGlzLnNldE5vZGVzKHRoaXMuZWxlbWVudClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHNpbmdsZSBIVE1MRWxlbWVudFxuICAgICAgICB0aGlzLnNldE5vZGUodGhpcy5lbGVtZW50KVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGdldHRlcnNcblxuICAgIHN0YXRpYyBnZXQgdmVyc2lvbigpIHtcbiAgICAgIHJldHVybiBgJHtOQU1FfS4ke1ZFUlNJT059YFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gYXJndW1lbnQgaXMgYSBET00gZWxlbWVudFxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRoZSBhcmd1bWVudCB0byB0ZXN0XG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgb2JqZWN0IGlzIGEgRE9NIGVsZW1lbnQsIGZhbHNlIG90aGVyd2lzZVxuICAgICAqL1xuICAgIGlzRWxlbWVudChlbGVtZW50KSB7XG4gICAgICBpZiAoZWxlbWVudCA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICAgIHJldHVybiAodHlwZW9mIE5vZGUgPT09ICdvYmplY3QnID8gZWxlbWVudCBpbnN0YW5jZW9mIE5vZGUgOiBlbGVtZW50ICYmIHR5cGVvZiBlbGVtZW50ID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgZWxlbWVudC5ub2RlVHlwZSA9PT0gJ251bWJlcicgJiYgdHlwZW9mIGVsZW1lbnQubm9kZU5hbWUgPT09ICdzdHJpbmcnKVxuICAgIH1cblxuICAgIC8qKlxuICAgICogQmluZHMgc29tZSB0ZXh0IHRvIHRoZSBnaXZlbiBET00gZWxlbWVudFxuICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgICogQHBhcmFtIHtTdHJpbmd9IHRleHRcbiAgICAqL1xuICAgIHNldFRleHQoZWxlbWVudCwgdGV4dCkge1xuICAgICAgaWYgKCEoJ3RleHRDb250ZW50JyBpbiBlbGVtZW50KSkge1xuICAgICAgICBlbGVtZW50LmlubmVyVGV4dCA9IHRleHRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW1lbnQudGV4dENvbnRlbnQgPSB0ZXh0XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQmluZHMgc29tZSBodG1sIHRvIHRoZSBnaXZlbiBET00gZWxlbWVudFxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuICAgICAqL1xuICAgIHNldEh0bWwoZWxlbWVudCwgdGV4dCkge1xuICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSB0ZXh0XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQmluZHMgY3VzdG9tIGF0dHJpYnV0ZXMgdG8gdGhlIGdpdmVuIERPTSBlbGVtZW50XG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHRleHRcbiAgICAgKi9cbiAgICBzZXRBdHRyaWJ1dGUoZWxlbWVudCwgYXR0ciwgdGV4dCkge1xuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0ciwgdGV4dClcbiAgICB9XG5cbiAgICBzZXROb2RlKGVsZW1lbnQpIHtcbiAgICAgIGxldCBhdHRyID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaTE4bicpXG4gICAgICBpZiAoIWF0dHIpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGF0dHIgPSBhdHRyLnRyaW0oKVxuXG4gICAgICBjb25zdCByID0gLyg/Olxcc3xeKShbQS1aYS16LV8wLTldKyk6XFxzKiguKj8pKD89XFxzK1xcdys6fCQpL2dcbiAgICAgIGxldCBtXG5cbiAgICAgIHdoaWxlIChtID0gci5leGVjKGF0dHIpKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IG1bMV0udHJpbSgpXG4gICAgICAgIGNvbnN0IHZhbHVlID0gbVsyXS50cmltKCkucmVwbGFjZSgnLCcsICcnKVxuICAgICAgICBsZXQgaW50bFZhbHVlID0gdGhpcy5kYXRhW3ZhbHVlXVxuXG4gICAgICAgIGlmICghdGhpcy5kYXRhW3ZhbHVlXSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGAke05BTUV9LiBXYXJuaW5nLCAke3ZhbHVlfSBkb2VzIG5vdCBleGlzdC5gKVxuICAgICAgICAgIGludGxWYWx1ZSA9IHZhbHVlXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtZXRob2ROYW1lID0gJ3NldCcgKyBrZXkuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBrZXkuc2xpY2UoMSlcblxuICAgICAgICBpZiAodGhpc1ttZXRob2ROYW1lXSkge1xuICAgICAgICAgIHRoaXNbbWV0aG9kTmFtZV0oZWxlbWVudCwgaW50bFZhbHVlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKGVsZW1lbnQsIGtleSwgaW50bFZhbHVlKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgKiBTZXQgdmFsdWVzIHRvIERPTSBub2Rlc1xuICAgICovXG4gICAgc2V0Tm9kZXMoZWxlbWVudCkge1xuICAgICAgZWxlbWVudC5mb3JFYWNoKGVsID0+IHRoaXMuc2V0Tm9kZShlbCkpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIEJpbmRlclxufSkoKVxuXG5leHBvcnQgZGVmYXVsdCBCaW5kZXJcbiIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3F1YXJrLWRldi9QaG9ub24tRnJhbWV3b3JrL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5pbXBvcnQgQmluZGVyIGZyb20gJy4vYmluZGVyJ1xuXG5jb25zdCBJbnRsID0gKCgpID0+IHtcbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDb25zdGFudHNcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNvbnN0IE5BTUUgPSAnSW50bCdcbiAgY29uc3QgVkVSU0lPTiA9ICcyLjAuMCdcbiAgY29uc3QgREVGQVVMVF9QUk9QRVJUSUVTID0ge1xuICAgIGZhbGxiYWNrTG9jYWxlOiAnZW4nLFxuICAgIGxvY2FsZTogJ2VuJyxcbiAgICBhdXRvQmluZDogdHJ1ZSxcbiAgICBkYXRhOiBudWxsLFxuICB9XG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDbGFzcyBEZWZpbml0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjbGFzcyBJbnRsIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIEludGwuXG4gICAgICogQHBhcmFtIHtmYWxsYmFja0xvY2FsZTogc3RyaW5nLCBsb2NhbGU6IHN0cmluZywgYXV0b0JpbmQ6IGJvb2xlYW4sIGRhdGE6IHtbbGFuZzogc3RyaW5nXToge1trZXk6IHN0cmluZ106IHN0cmluZ319fVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbihERUZBVUxUX1BST1BFUlRJRVMsIG9wdGlvbnMpXG5cbiAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLmZhbGxiYWNrTG9jYWxlICE9PSAnc3RyaW5nJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7TkFNRX0uIFRoZSBmYWxsYmFjayBsb2NhbGUgaXMgbWFuZGF0b3J5IGFuZCBtdXN0IGJlIGEgc3RyaW5nLmApXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGF0YSA9PT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7TkFNRX0uIFRoZXJlIGlzIG5vIHRyYW5zbGF0aW9uIGRhdGEuYClcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMuZGF0YVt0aGlzLm9wdGlvbnMuZmFsbGJhY2tMb2NhbGVdICE9PSAnb2JqZWN0Jykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7TkFNRX0uIFRoZSBmYWxsYmFjayBsb2NhbGUgbXVzdCBuZWNlc3NhcmlseSBoYXZlIHRyYW5zbGF0aW9uIGRhdGEuYClcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRMb2NhbGUodGhpcy5vcHRpb25zLmxvY2FsZSwgdGhpcy5vcHRpb25zLmF1dG9CaW5kKVxuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgdmVyc2lvbigpIHtcbiAgICAgIHJldHVybiBgJHtOQU1FfS4ke1ZFUlNJT059YFxuICAgIH1cblxuICAgIGdldExvY2FsZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMubG9jYWxlXG4gICAgfVxuXG4gICAgZ2V0RmFsbGJhY2tMb2NhbGUoKSB7XG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmZhbGxiYWNrTG9jYWxlXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IGRlZmF1bHQgbG9jYWxlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGxvY2FsZVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3VwZGF0ZUhUTUw9dHJ1ZV1cbiAgICAgKi9cbiAgICBzZXRMb2NhbGUobG9jYWxlLCB1cGRhdGVIVE1MID0gdHJ1ZSkge1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMuZGF0YVtsb2NhbGVdICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBjb25zb2xlLmVycm9yKGAke05BTUV9LiAke2xvY2FsZX0gaGFzIG5vIGRhdGEsIGZhbGxiYWNrIGluICR7dGhpcy5vcHRpb25zLmZhbGxiYWNrTG9jYWxlfS5gKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmxvY2FsZSA9IGxvY2FsZVxuICAgICAgfVxuXG4gICAgICBpZiAodXBkYXRlSFRNTCkge1xuICAgICAgICB0aGlzLnVwZGF0ZUh0bWwoKVxuICAgICAgfVxuICAgIH1cblxuICAgIGdldExhbmd1YWdlcygpIHtcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLm9wdGlvbnMuZGF0YSlcbiAgICB9XG5cbiAgICBpbnNlcnRWYWx1ZXModmFsdWUgPSBudWxsLCBpbmplY3RhYmxlVmFsdWVzID0ge30pIHtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWF0Y2ggPSB2YWx1ZS5tYXRjaCgvOihbYS16QS1aLV8wLTldKykvKVxuICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZShtYXRjaFswXSwgaW5qZWN0YWJsZVZhbHVlc1ttYXRjaFsxXV0pXG4gICAgICB9XG5cbiAgICAgIGlmICh2YWx1ZS5tYXRjaCgvOihbYS16QS1aLV8wLTldKykvKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnNlcnRWYWx1ZXModmFsdWUsIGluamVjdGFibGVWYWx1ZXMpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB2YWx1ZVxuICAgIH1cblxuICAgIHRyYW5zbGF0ZShrZXlOYW1lID0gbnVsbCwgaW5qZWN0ID0ge30pIHtcbiAgICAgIGxldCBkYXRhID0gdGhpcy5vcHRpb25zLmRhdGFbdGhpcy5vcHRpb25zLmxvY2FsZV1cbiAgICAgIGlmICghZGF0YSkge1xuICAgICAgICBkYXRhID0gdGhpcy5vcHRpb25zLmRhdGFbdGhpcy5vcHRpb25zLmZhbGxiYWNrTG9jYWxlXVxuICAgICAgfVxuXG4gICAgICBpZiAoa2V5TmFtZSA9PT0gbnVsbCB8fCBrZXlOYW1lID09PSAnKicgfHwgQXJyYXkuaXNBcnJheShrZXlOYW1lKSkge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShrZXlOYW1lKSkge1xuICAgICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhkYXRhKS5maWx0ZXIoa2V5ID0+IGtleU5hbWUuaW5kZXhPZihrZXkpID4gLTEpXG4gICAgICAgICAgY29uc3QgZmlsdGVyZWREYXRhID0ge31cbiAgICAgICAgICBrZXlzLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YVtrZXldID0gdGhpcy5pbnNlcnRWYWx1ZXMoZGF0YVtrZXldLCBpbmplY3QpXG4gICAgICAgICAgfSlcbiAgICAgICAgICBkYXRhID0gZmlsdGVyZWREYXRhXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkYXRhTWFwID0ge31cbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gZGF0YSkge1xuICAgICAgICAgIGRhdGFNYXBba2V5XSA9IHRoaXMuaW5zZXJ0VmFsdWVzKGRhdGFba2V5XSwgaW5qZWN0KVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRhdGFNYXBcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuaW5zZXJ0VmFsdWVzKGRhdGFba2V5TmFtZV0sIGluamVjdClcbiAgICB9XG5cbiAgICAvLyBhbGlhcyBvZiB0KClcbiAgICB0KGtleU5hbWUgPSBudWxsLCBpbmplY3QgPSB7fSkge1xuICAgICAgcmV0dXJuIHRoaXMudHJhbnNsYXRlKGtleU5hbWUsIGluamVjdClcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIHRoZSBIVE1MIHZpZXdzXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgICAqL1xuICAgIHVwZGF0ZUh0bWwoZWxlbWVudCkge1xuICAgICAgaWYgKHR5cGVvZiBlbGVtZW50ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtaTE4bl0nKVxuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsZW1lbnQpXG4gICAgICB9XG5cbiAgICAgIG5ldyBCaW5kZXIoZWxlbWVudCwgdGhpcy50KCkpXG4gICAgfVxuXG4gICAgLy8gc3RhdGljXG4gICAgc3RhdGljIF9ET01JbnRlcmZhY2Uob3B0aW9ucykge1xuICAgICAgcmV0dXJuIG5ldyBJbnRsKG9wdGlvbnMpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIEludGxcbn0pKClcblxuZXhwb3J0IGRlZmF1bHQgSW50bFxuIiwiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vcXVhcmstZGV2L1Bob25vbi1GcmFtZXdvcmsvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuaW1wb3J0IEV2ZW50IGZyb20gJy4uL2V2ZW50cydcbmltcG9ydCBDb21wb25lbnQgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9jb21wb25lbnQnXG5pbXBvcnQgeyBkaXNwYXRjaFdpbkRvY0V2ZW50IH0gZnJvbSAnLi4vZXZlbnRzL2Rpc3BhdGNoJ1xuXG5jb25zdCBOZXR3b3JrID0gKCgpID0+IHtcbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDb25zdGFudHNcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNvbnN0IE5BTUUgPSAnbmV0d29yaydcbiAgY29uc3QgVkVSU0lPTiA9ICcyLjAuMCdcbiAgY29uc3QgREVGQVVMVF9QUk9QRVJUSUVTID0ge1xuICAgIGVsZW1lbnQ6IG51bGwsXG4gICAgaW5pdGlhbERlbGF5OiAzMDAwLFxuICAgIGRlbGF5OiA1MDAwLFxuICB9XG4gIGNvbnN0IERBVEFfQVRUUlNfUFJPUEVSVElFUyA9IFtcbiAgXVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY2xhc3MgTmV0d29yayBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBOZXR3b3JrLlxuICAgICAqIEBwYXJhbSB7e319IFtvcHRpb25zPXt9XVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgc3VwZXIoTkFNRSwgVkVSU0lPTiwgREVGQVVMVF9QUk9QRVJUSUVTLCBvcHRpb25zLCBEQVRBX0FUVFJTX1BST1BFUlRJRVMsIHRydWUsIGZhbHNlKVxuXG4gICAgICB0aGlzLnhociA9IG51bGxcbiAgICAgIHRoaXMuY2hlY2tJbnRlcnZhbCA9IG51bGxcblxuICAgICAgdGhpcy5zZXRTdGF0dXMoRXZlbnQuTkVUV09SS19PTkxJTkUpXG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLnN0YXJ0Q2hlY2soKVxuICAgICAgfSwgdGhpcy5vcHRpb25zLmluaXRpYWxEZWxheSlcbiAgICB9XG5cbiAgICBnZXRTdGF0dXMoKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdGF0dXNcbiAgICB9XG5cbiAgICBzZXRTdGF0dXMoc3RhdHVzKSB7XG4gICAgICB0aGlzLnN0YXR1cyA9IHN0YXR1c1xuICAgIH1cblxuICAgIHN0YXJ0UmVxdWVzdCgpIHtcbiAgICAgIHRoaXMueGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgICAgIHRoaXMueGhyLm9mZmxpbmUgPSBmYWxzZVxuXG4gICAgICBjb25zdCB1cmwgPSBgL2Zhdmljb24uaWNvP189JHtuZXcgRGF0ZSgpLmdldFRpbWUoKX1gXG5cbiAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50Lk5FVFdPUktfUkVDT05ORUNUSU5HLCB7IGRhdGU6IG5ldyBEYXRlKCkgfSwgZmFsc2UpICAgICAgICAgICAgXG5cbiAgICAgIHRoaXMueGhyLm9wZW4oJ0hFQUQnLCB1cmwsIHRydWUpXG5cbiAgICAgIHRoaXMueGhyLnRpbWVvdXQgPSB0aGlzLm9wdGlvbnMuZGVsYXkgLSAxXG4gICAgICB0aGlzLnhoci5vbnRpbWVvdXQgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMueGhyLmFib3J0KClcbiAgICAgICAgdGhpcy54aHIgPSBudWxsXG4gICAgICB9XG5cbiAgICAgIHRoaXMueGhyLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5vblVwKClcbiAgICAgIH1cbiAgICAgIHRoaXMueGhyLm9uZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMub25Eb3duKClcbiAgICAgIH1cblxuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy54aHIuc2VuZCgpXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHRoaXMub25Eb3duKClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBvblVwKCkge1xuICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuTkVUV09SS19SRUNPTk5FQ1RJTkdfU1VDQ0VTUywgeyBkYXRlOiBuZXcgRGF0ZSgpIH0sIGZhbHNlKVxuXG4gICAgICBpZiAodGhpcy5nZXRTdGF0dXMoKSAhPT0gRXZlbnQuTkVUV09SS19PTkxJTkUpIHtcbiAgICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuTkVUV09SS19PTkxJTkUsIHsgZGF0ZTogbmV3IERhdGUoKSB9LCBmYWxzZSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRTdGF0dXMoRXZlbnQuTkVUV09SS19PTkxJTkUpICAgICAgXG4gICAgfVxuXG4gICAgb25Eb3duKCkge1xuICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuTkVUV09SS19SRUNPTk5FQ1RJTkdfRkFJTFVSRSwgeyBkYXRlOiBuZXcgRGF0ZSgpIH0sIGZhbHNlKVxuXG4gICAgICBpZiAodGhpcy5nZXRTdGF0dXMoKSAhPT0gRXZlbnQuTkVUV09SS19PRkZMSU5FKSB7XG4gICAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50Lk5FVFdPUktfT0ZGTElORSwgeyBkYXRlOiBuZXcgRGF0ZSgpIH0sIGZhbHNlKVxuICAgICAgfVxuXG4gICAgICB0aGlzLnNldFN0YXR1cyhFdmVudC5ORVRXT1JLX09GRkxJTkUpICAgICAgXG4gICAgfVxuXG4gICAgc3RhcnRDaGVjaygpIHtcbiAgICAgIHRoaXMuc3RvcENoZWNrKClcblxuICAgICAgdGhpcy5zdGFydFJlcXVlc3QoKSAgICAgIFxuXG4gICAgICB0aGlzLmNoZWNrSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIHRoaXMuc3RhcnRSZXF1ZXN0KClcbiAgICAgIH0sIHRoaXMub3B0aW9ucy5kZWxheSlcbiAgICB9XG5cbiAgICBzdG9wQ2hlY2soKSB7XG4gICAgICBpZiAodGhpcy5jaGVja0ludGVydmFsICE9PSBudWxsKSB7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5jaGVja0ludGVydmFsKVxuICAgICAgICB0aGlzLmNoZWNrSW50ZXJ2YWwgPSBudWxsXG4gICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIF9ET01JbnRlcmZhY2Uob3B0aW9ucykge1xuICAgICAgcmV0dXJuIHN1cGVyLl9ET01JbnRlcmZhY2UoTmV0d29yaywgb3B0aW9ucylcbiAgICB9XG4gIH1cblxuICByZXR1cm4gTmV0d29ya1xufSkoKVxuXG5leHBvcnQgZGVmYXVsdCBOZXR3b3JrXG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5pbXBvcnQgUGFnZSBmcm9tICcuL3BhZ2UnXG5pbXBvcnQgRXZlbnQgZnJvbSAnLi4vLi4vY29yZS9ldmVudHMnXG5cbmNvbnN0IFBhZ2VyID0gKCgpID0+IHtcbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDb25zdGFudHNcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNvbnN0IE5BTUUgPSAncGFnZXInXG4gIGNvbnN0IFZFUlNJT04gPSAnMi4wLjAnXG4gIGNvbnN0IERFRkFVTFRfUFJPUEVSVElFUyA9IHtcbiAgICBoYXNoUHJlZml4OiAnIyEnLFxuICAgIHVzZUhhc2g6IHRydWUsXG4gICAgZGVmYXVsdFBhZ2U6IG51bGwsXG4gICAgYW5pbWF0ZVBhZ2VzOiB0cnVlLFxuICB9XG5cbiAgbGV0IGN1cnJlbnRQYWdlXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY2xhc3MgUGFnZXIge1xuICAgIC8qKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqXG4gICAgICogQHBhcmFtIG9wdGlvbnMge09iamVjdH1cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oREVGQVVMVF9QUk9QRVJUSUVTLCBvcHRpb25zKVxuXG4gICAgICB0aGlzLnBhZ2VzID0gW11cbiAgICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlXG5cbiAgICAgIC8vIGFkZCBnbG9iYWwgbGlzdGVuZXJzIHN1Y2ggYXNoIGhhc2ggY2hhbmdlLCBuYXZpZ2F0aW9uLCBldGMuXG4gICAgICB0aGlzLmFkZFBhZ2VyRXZlbnRzKClcblxuICAgICAgLy8gZmFzdGVyIHdheSB0byBpbml0IHBhZ2VzIGJlZm9yZSB0aGUgRE9NIGlzIHJlYWR5XG4gICAgICB0aGlzLm9uRE9NTG9hZGVkKClcbiAgICB9XG5cbiAgICAvLyBwcml2YXRlXG4gICAgXyhzZWxlY3Rvcikge1xuICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpXG4gICAgfVxuXG4gICAgZ2V0SGFzaCgpIHtcbiAgICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24uaGFzaC5zcGxpdCh0aGlzLm9wdGlvbnMuaGFzaFByZWZpeClbMV1cbiAgICB9XG5cbiAgICBnZXRQYWdlRnJvbUhhc2goKSB7XG4gICAgICBjb25zdCBoYXNoID0gdGhpcy5nZXRIYXNoKClcbiAgICAgIGNvbnN0IHJlID0gbmV3IFJlZ0V4cCgnWz9cXC9dKFteXFwvXSopJylcbiAgICAgIGNvbnN0IG1hdGNoZXMgPSByZS5leGVjKGhhc2gpXG5cbiAgICAgIGlmIChtYXRjaGVzICYmIG1hdGNoZXNbMV0pIHtcbiAgICAgICAgcmV0dXJuIG1hdGNoZXNbMV1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG5cbiAgICBzZXRIYXNoKHBhZ2VOYW1lKSB7XG4gICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IGAke3RoaXMub3B0aW9ucy5oYXNoUHJlZml4fS8ke3BhZ2VOYW1lfWBcbiAgICB9XG5cbiAgICBhcmVTYW1lUGFnZShwYWdlTmFtZTEsIHBhZ2VOYW1lMikge1xuICAgICAgY29uc3QgcGFnZTEgPSB0aGlzLmdldFBhZ2VNb2RlbChwYWdlTmFtZTEpXG4gICAgICBjb25zdCBwYWdlMiA9IHRoaXMuZ2V0UGFnZU1vZGVsKHBhZ2VOYW1lMilcbiAgICAgIHJldHVybiBwYWdlMSAmJiBwYWdlMiAmJiBwYWdlMS5uYW1lID09PSBwYWdlMi5uYW1lXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXR0YWNoZXMgdGhlIG1haW4gZXZlbnRzIGZvciB0cmFja2luZyBoYXNoIGNoYW5nZXMsXG4gICAgICogY2xpY2sgb24gbmF2aWdhdGlvbiBidXR0b25zIGFuZCBsaW5rcyBhbmQgYmFjayBoaXN0b3J5XG4gICAgICovXG4gICAgYWRkUGFnZXJFdmVudHMoKSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHRoaXMub25DbGljayhldmVudCkpXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBldmVudCA9PiB0aGlzLm9uQmFja0hpc3RvcnkoZXZlbnQpKVxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCBldmVudCA9PiB0aGlzLm9uSGFzaENoYW5nZShldmVudCkpXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZXZlbnQgPT4gdGhpcy5vbkRPTUxvYWRlZChldmVudCkpXG4gICAgfVxuXG4gICAgLy8gZ2V0dGVyc1xuXG4gICAgc3RhdGljIGdldCB2ZXJzaW9uKCkge1xuICAgICAgcmV0dXJuIGAke05BTUV9LiR7VkVSU0lPTn1gXG4gICAgfVxuXG4gICAgLy8gcHVibGljXG5cbiAgICBzaG93UGFnZShwYWdlTmFtZSwgYWRkVG9IaXN0b3J5ID0gdHJ1ZSwgYmFjayA9IGZhbHNlKSB7XG4gICAgICBjb25zdCBvbGRQYWdlID0gdGhpcy5fKCcuY3VycmVudCcpXG4gICAgICBpZiAob2xkUGFnZSkge1xuICAgICAgICBjb25zdCBvbGRQYWdlTmFtZSA9IG9sZFBhZ2UuZ2V0QXR0cmlidXRlKCdkYXRhLXBhZ2UnKVxuXG4gICAgICAgIGlmICh0aGlzLmFyZVNhbWVQYWdlKHBhZ2VOYW1lLCBvbGRQYWdlTmFtZSkpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIG9sZFBhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnY3VycmVudCcpXG5cbiAgICAgICAgLy8gaGlzdG9yeVxuICAgICAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoeyBwYWdlOiBvbGRQYWdlTmFtZSB9LCBvbGRQYWdlTmFtZSwgd2luZG93LmxvY2F0aW9uLmhyZWYpXG5cbiAgICAgICAgdGhpcy50cmlnZ2VyUGFnZUV2ZW50KG9sZFBhZ2VOYW1lLCBFdmVudC5ISURFKVxuICAgICAgfVxuXG4gICAgICB0aGlzLnRyaWdnZXJQYWdlRXZlbnQocGFnZU5hbWUsIEV2ZW50LlNIT1cpXG5cbiAgICAgIGN1cnJlbnRQYWdlID0gcGFnZU5hbWVcblxuICAgICAgLy8gbmV3IHBhZ2VcbiAgICAgIGNvbnN0IG5ld1BhZ2UgPSB0aGlzLl8oYFtkYXRhLXBhZ2U9XCIke3BhZ2VOYW1lfVwiXWApXG5cbiAgICAgIG5ld1BhZ2UuY2xhc3NMaXN0LmFkZCgnY3VycmVudCcpXG5cbiAgICAgIC8vIHRlbXBsYXRlIGxvYWRlclxuICAgICAgY29uc3QgcGFnZU1vZGVsID0gdGhpcy5nZXRQYWdlTW9kZWwocGFnZU5hbWUpXG5cbiAgICAgIC8vIEB0b2RvOiB1c2UgdGVtcGxhdGUgY2FjaGU/XG4gICAgICBpZiAocGFnZU1vZGVsICYmIHBhZ2VNb2RlbC5nZXRUZW1wbGF0ZSgpKSB7XG4gICAgICAgIHBhZ2VNb2RlbC5sb2FkVGVtcGxhdGUoKVxuICAgICAgfVxuICAgICAgLy8gZW5kXG5cbiAgICAgIGlmIChvbGRQYWdlKSB7XG4gICAgICAgIGNvbnN0IG9sZFBhZ2VOYW1lID0gb2xkUGFnZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGFnZScpXG4gICAgICAgIC8vIHVzZSBvZiBwcm90b3R5cGUtb3JpZW50ZWQgbGFuZ3VhZ2VcbiAgICAgICAgb2xkUGFnZS5iYWNrID0gYmFja1xuICAgICAgICBvbGRQYWdlLnByZXZpb3VzUGFnZU5hbWUgPSBvbGRQYWdlTmFtZVxuXG4gICAgICAgIGNvbnN0IG9uUGFnZUFuaW1hdGlvbkVuZCA9ICgpID0+IHtcbiAgICAgICAgICBpZiAob2xkUGFnZS5jbGFzc0xpc3QuY29udGFpbnMoJ2FuaW1hdGUnKSkge1xuICAgICAgICAgICAgb2xkUGFnZS5jbGFzc0xpc3QucmVtb3ZlKCdhbmltYXRlJylcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBvbGRQYWdlLmNsYXNzTGlzdC5yZW1vdmUob2xkUGFnZS5iYWNrID8gJ3BvcC1wYWdlJyA6ICdwdXNoLXBhZ2UnKVxuXG4gICAgICAgICAgdGhpcy50cmlnZ2VyUGFnZUV2ZW50KGN1cnJlbnRQYWdlLCBFdmVudC5TSE9XTilcbiAgICAgICAgICB0aGlzLnRyaWdnZXJQYWdlRXZlbnQob2xkUGFnZS5wcmV2aW91c1BhZ2VOYW1lLCBFdmVudC5ISURERU4pXG5cbiAgICAgICAgICBvbGRQYWdlLnJlbW92ZUV2ZW50TGlzdGVuZXIoRXZlbnQuQU5JTUFUSU9OX0VORCwgb25QYWdlQW5pbWF0aW9uRW5kKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hbmltYXRlUGFnZXMpIHtcbiAgICAgICAgICBvbGRQYWdlLmFkZEV2ZW50TGlzdGVuZXIoRXZlbnQuQU5JTUFUSU9OX0VORCwgb25QYWdlQW5pbWF0aW9uRW5kKVxuICAgICAgICAgIG9sZFBhZ2UuY2xhc3NMaXN0LmFkZCgnYW5pbWF0ZScpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb25QYWdlQW5pbWF0aW9uRW5kKClcbiAgICAgICAgfVxuXG4gICAgICAgIG9sZFBhZ2UuY2xhc3NMaXN0LmFkZChiYWNrID8gJ3BvcC1wYWdlJyA6ICdwdXNoLXBhZ2UnKVxuICAgICAgfVxuICAgIH1cblxuICAgIGFkZFVuaXF1ZVBhZ2VNb2RlbChwYWdlTmFtZSkge1xuICAgICAgaWYgKCF0aGlzLmdldFBhZ2VNb2RlbChwYWdlTmFtZSkpIHtcbiAgICAgICAgdGhpcy5wYWdlcy5wdXNoKG5ldyBQYWdlKHBhZ2VOYW1lKSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRQYWdlTW9kZWwocGFnZU5hbWUpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhZ2VzLmZpbmQocGFnZSA9PiBwYWdlLm5hbWUgPT09IHBhZ2VOYW1lKVxuICAgIH1cblxuICAgIGdldFBhZ2VzTW9kZWwocGFnZU5hbWVzKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYWdlcy5maWx0ZXIocGFnZSA9PiBwYWdlTmFtZXMuaW5kZXhPZihwYWdlLm5hbWUpID4gLTEpXG4gICAgfVxuXG4gICAgc2VsZWN0b3JUb0FycmF5KHN0cikge1xuICAgICAgcmV0dXJuIHN0ci5zcGxpdCgnLCcpLm1hcChpdGVtID0+IGl0ZW0udHJpbSgpKVxuICAgIH1cblxuICAgIGFkZEV2ZW50cyhjYWxsYmFjaykge1xuICAgICAgaWYgKHRoaXMuY2FjaGVQYWdlU2VsZWN0b3IgPT09ICcqJykge1xuICAgICAgICAvLyBhZGQgdG8gYWxsIHBhZ2UgbW9kZWxzXG4gICAgICAgIHRoaXMucGFnZXMuZm9yRWFjaCgocGFnZSkgPT4ge1xuICAgICAgICAgIHBhZ2UuYWRkRXZlbnRDYWxsYmFjayhjYWxsYmFjaylcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHBhZ2VNb2RlbHMgPSB0aGlzLmdldFBhZ2VzTW9kZWwodGhpcy5zZWxlY3RvclRvQXJyYXkodGhpcy5jYWNoZVBhZ2VTZWxlY3RvciksIHRydWUpXG4gICAgICBwYWdlTW9kZWxzLmZvckVhY2goKHBhZ2UpID0+IHtcbiAgICAgICAgcGFnZS5hZGRFdmVudENhbGxiYWNrKGNhbGxiYWNrKVxuICAgICAgfSlcbiAgICAgIHRoaXMuY2FjaGVQYWdlU2VsZWN0b3IgPSBudWxsXG4gICAgfVxuXG4gICAgdXNlVGVtcGxhdGUodGVtcGxhdGVQYXRoLCByZW5kZXJGdW5jdGlvbiA9IG51bGwpIHtcbiAgICAgIGNvbnN0IHBhZ2VNb2RlbHMgPSB0aGlzLmdldFBhZ2VzTW9kZWwodGhpcy5zZWxlY3RvclRvQXJyYXkodGhpcy5jYWNoZVBhZ2VTZWxlY3RvciksIHRydWUpXG4gICAgICBwYWdlTW9kZWxzLmZvckVhY2goKHBhZ2UpID0+IHtcbiAgICAgICAgcGFnZS51c2VUZW1wbGF0ZSh0ZW1wbGF0ZVBhdGgpXG4gICAgICAgIGlmICh0eXBlb2YgcmVuZGVyRnVuY3Rpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBwYWdlLnVzZVRlbXBsYXRlUmVuZGVyZXIocmVuZGVyRnVuY3Rpb24pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICB0aGlzLmNhY2hlUGFnZVNlbGVjdG9yID0gbnVsbFxuICAgIH1cblxuICAgIHRyaWdnZXJQYWdlRXZlbnQocGFnZU5hbWUsIGV2ZW50TmFtZSwgZXZlbnRQYXJhbXMgPSBudWxsKSB7XG4gICAgICBjb25zdCBwYWdlTW9kZWwgPSB0aGlzLmdldFBhZ2VNb2RlbChwYWdlTmFtZSlcbiAgICAgIGlmIChwYWdlTW9kZWwpIHtcbiAgICAgICAgcGFnZU1vZGVsLnRyaWdnZXJTY29wZXMoZXZlbnROYW1lLCBldmVudFBhcmFtcylcbiAgICAgIH1cbiAgICB9XG5cbiAgICBvbkNsaWNrKGV2ZW50KSB7XG4gICAgICBjb25zdCBwYWdlTmFtZSA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbmF2aWdhdGUnKVxuICAgICAgY29uc3QgcHVzaFBhZ2UgPSAhKGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcG9wLXBhZ2UnKSA9PT0gJ3RydWUnKVxuXG4gICAgICBpZiAocGFnZU5hbWUpIHtcbiAgICAgICAgaWYgKHBhZ2VOYW1lID09PSAnJGJhY2snKSB7XG4gICAgICAgICAgLy8gdGhlIHBvcHN0YXRlIGV2ZW50IHdpbGwgYmUgdHJpZ2dlcmVkXG4gICAgICAgICAgd2luZG93Lmhpc3RvcnkuYmFjaygpXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBJZiB3ZSBoZSB1c2UgdGhlIGhhc2ggYXMgdHJpZ2dlcixcbiAgICAgICAgICogd2UgY2hhbmdlIGl0IGR5bmFtaWNhbGx5IHNvIHRoYXQgdGhlIGhhc2hjaGFuZ2UgZXZlbnQgaXMgY2FsbGVkXG4gICAgICAgICAqIE90aGVyd2lzZSwgd2Ugc2hvdyB0aGUgcGFnZVxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy51c2VIYXNoKSB7XG4gICAgICAgICAgdGhpcy5zZXRIYXNoKHBhZ2VOYW1lKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2hvd1BhZ2UocGFnZU5hbWUsIHRydWUsIHB1c2hQYWdlKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgb25CYWNrSGlzdG9yeShldmVudCA9IHt9KSB7XG4gICAgICBjb25zdCBwYWdlTmFtZSA9IGV2ZW50LnN0YXRlID8gZXZlbnQuc3RhdGUucGFnZSA6IG51bGxcbiAgICAgIGlmICghcGFnZU5hbWUpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2hvd1BhZ2UocGFnZU5hbWUsIHRydWUsIHRydWUpXG4gICAgfVxuXG4gICAgb25IYXNoQ2hhbmdlKCkge1xuICAgICAgY29uc3QgcGFyYW1zID0gKHRoaXMuZ2V0SGFzaCgpID8gdGhpcy5nZXRIYXNoKCkuc3BsaXQoJy8nKSA6IFtdKS5maWx0ZXIocCA9PiBwLmxlbmd0aCA+IDApXG4gICAgICBpZiAocGFyYW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgLy8gcmVtb3ZlIGZpcnN0IHZhbHVlIHdoaWNoIGlzIHRoZSBwYWdlIG5hbWVcbiAgICAgICAgcGFyYW1zLnNoaWZ0KClcbiAgICAgIH1cblxuICAgICAgdGhpcy50cmlnZ2VyUGFnZUV2ZW50KGN1cnJlbnRQYWdlLCBFdmVudC5IQVNILCBwYXJhbXMpXG5cbiAgICAgIGNvbnN0IG5hdlBhZ2UgPSB0aGlzLmdldFBhZ2VGcm9tSGFzaCgpXG4gICAgICBpZiAobmF2UGFnZSkge1xuICAgICAgICB0aGlzLnNob3dQYWdlKG5hdlBhZ2UpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUXVlcmllcyB0aGUgcGFnZSBub2RlcyBpbiB0aGUgRE9NXG4gICAgICovXG4gICAgb25ET01Mb2FkZWQoKSB7XG4gICAgICBjb25zdCBwYWdlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXBhZ2VdJylcblxuICAgICAgaWYgKCFwYWdlcykge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgcGFnZXMuZm9yRWFjaCgocGFnZSkgPT4ge1xuICAgICAgICBsZXQgcGFnZU5hbWUgPSBwYWdlLmdldEF0dHJpYnV0ZSgnZGF0YS1wYWdlJylcbiAgICAgICAgLypcbiAgICAgICAgICogdGhlIHBhZ2UgbmFtZSBjYW4gYmUgZ2l2ZW4gd2l0aCB0aGUgYXR0cmlidXRlIGRhdGEtcGFnZVxuICAgICAgICAgKiBvciB3aXRoIGl0cyBub2RlIG5hbWVcbiAgICAgICAgICovXG4gICAgICAgIGlmICghcGFnZU5hbWUpIHtcbiAgICAgICAgICBwYWdlTmFtZSA9IHBhZ2Uubm9kZU5hbWVcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYWRkVW5pcXVlUGFnZU1vZGVsKHBhZ2VOYW1lKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBzZWxlY3QocGFnZU5hbWUsIGFkZFBhZ2VNb2RlbCA9IHRydWUpIHtcbiAgICAgIHRoaXMuY2FjaGVQYWdlU2VsZWN0b3IgPSBwYWdlTmFtZVxuXG4gICAgICBpZiAoYWRkUGFnZU1vZGVsICYmIHBhZ2VOYW1lICE9PSAnKicpIHtcbiAgICAgICAgdGhpcy5hZGRVbmlxdWVQYWdlTW9kZWwocGFnZU5hbWUpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgc3RhcnQoZm9yY2VEZWZhdWx0UGFnZSA9IGZhbHNlKSB7XG4gICAgICAvLyBjaGVjayBpZiB0aGUgYXBwIGhhcyBiZWVuIGFscmVhZHkgc3RhcnRlZFxuICAgICAgaWYgKHRoaXMuc3RhcnRlZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7TkFNRX0uIFRoZSBhcHAgaGFzIGJlZW4gYWxyZWFkeSBzdGFydGVkLmApXG4gICAgICB9XG5cbiAgICAgIHRoaXMuc3RhcnRlZCA9IHRydWVcblxuICAgICAgLy8gZm9yY2UgZGVmYXVsdCBwYWdlIG9uIENvcmRvdmFcbiAgICAgIGlmICh3aW5kb3cuY29yZG92YSkge1xuICAgICAgICBmb3JjZURlZmF1bHRQYWdlID0gdHJ1ZVxuICAgICAgfVxuXG4gICAgICBsZXQgcGFnZU5hbWUgPSB0aGlzLmdldFBhZ2VGcm9tSGFzaCgpXG4gICAgICBpZiAoIXRoaXMuZ2V0UGFnZU1vZGVsKHBhZ2VOYW1lKSkge1xuICAgICAgICBwYWdlTmFtZSA9IHRoaXMub3B0aW9ucy5kZWZhdWx0UGFnZVxuICAgICAgfVxuXG4gICAgICBpZiAoZm9yY2VEZWZhdWx0UGFnZSAmJiAhdGhpcy5vcHRpb25zLmRlZmF1bHRQYWdlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtOQU1FfS4gVGhlIGRlZmF1bHQgcGFnZSBtdXN0IGV4aXN0IGZvciBmb3JjaW5nIGl0cyBsYXVuY2ghYClcbiAgICAgIH1cblxuICAgICAgLy8gTG9nIHRoZSBkZXZpY2UgaW5mb1xuICAgICAgaWYgKHBob25vbi5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZygnU3RhcnRpbmcgUGhvbm9uIGluICcgKyBwbGF0Zm9ybS5kZXNjcmlwdGlvbilcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5wYWdlcy5sZW5ndGggKyAnIHBhZ2VzIGZvdW5kJylcbiAgICAgICAgY29uc29sZS5sb2coJ0xvYWRpbmcgJyArIHBhZ2VOYW1lKVxuICAgICAgfVxuXG4gICAgICAvKlxuICAgICAgICogaWYgdGhlIGFwcCBpcyBjb25maWd1cmF0ZWQgdG8gdXNlIGhhc2ggdHJhY2tpbmdcbiAgICAgICAqIHdlIGFkZCB0aGUgcGFnZSBkeW5hbWljYWxseSBpbiB0aGUgdXJsXG4gICAgICAgKi9cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudXNlSGFzaCkge1xuICAgICAgICB0aGlzLnNldEhhc2gocGFnZU5hbWUpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2hvd1BhZ2UoZm9yY2VEZWZhdWx0UGFnZSA/IHRoaXMub3B0aW9ucy5kZWZhdWx0UGFnZSA6IHBhZ2VOYW1lKVxuICAgIH1cblxuICAgIC8vIHN0YXRpY1xuICAgIHN0YXRpYyBfRE9NSW50ZXJmYWNlKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBuZXcgUGFnZXIob3B0aW9ucylcbiAgICB9XG4gIH1cblxuICByZXR1cm4gUGFnZXJcbn0pKClcblxuZXhwb3J0IGRlZmF1bHQgUGFnZXJcbiIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3F1YXJrLWRldi9QaG9ub24tRnJhbWV3b3JrL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmltcG9ydCB7IGxvYWRGaWxlIH0gZnJvbSAnLi4vdXRpbHMnXG5pbXBvcnQgeyBkaXNwYXRjaFBhZ2VFdmVudCB9IGZyb20gJy4uL2V2ZW50cy9kaXNwYXRjaCdcblxuY29uc3QgUGFnZSA9ICgoKSA9PiB7XG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ29uc3RhbnRzXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjb25zdCBOQU1FID0gJ3BhZ2UnXG4gIGNvbnN0IFZFUlNJT04gPSAnMi4wLjAnXG5cbiAgY29uc3QgVEVNUExBVEVfU0VMRUNUT1IgPSAnW2RhdGEtdGVtcGxhdGVdJ1xuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY2xhc3MgUGFnZSB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBQYWdlLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYWdlTmFtZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHBhZ2VOYW1lKSB7XG4gICAgICB0aGlzLm5hbWUgPSBwYWdlTmFtZVxuICAgICAgdGhpcy5ldmVudHMgPSBbXVxuICAgICAgdGhpcy50ZW1wbGF0ZVBhdGggPSBudWxsXG4gICAgICB0aGlzLnJlbmRlckZ1bmN0aW9uID0gbnVsbFxuICAgIH1cblxuICAgIC8vIGdldHRlcnNcblxuICAgIHN0YXRpYyBnZXQgdmVyc2lvbigpIHtcbiAgICAgIHJldHVybiBgJHtOQU1FfS4ke1ZFUlNJT059YFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBldmVudHNcbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb25bXX1cbiAgICAgKi9cbiAgICBnZXRFdmVudHMoKSB7XG4gICAgICByZXR1cm4gdGhpcy5ldmVudHNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGVtcGxhdGVcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldFRlbXBsYXRlKCkge1xuICAgICAgcmV0dXJuIHRoaXMudGVtcGxhdGVQYXRoXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHJlbmRlciBmdW5jdGlvblxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn1cbiAgICAgKi9cbiAgICBnZXRSZW5kZXJGdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlckZ1bmN0aW9uXG4gICAgfVxuXG4gICAgbG9hZFRlbXBsYXRlKCkge1xuICAgICAgY29uc3QgcGFnZUVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1wYWdlPVwiJHt0aGlzLm5hbWV9XCJdYClcblxuICAgICAgbG9hZEZpbGUodGhpcy5nZXRUZW1wbGF0ZSgpLCAodGVtcGxhdGUpID0+IHtcbiAgICAgICAgbGV0IHJlbmRlciA9IGZ1bmN0aW9uIChET01QYWdlLCB0ZW1wbGF0ZSwgZWxlbWVudHMpIHtcbiAgICAgICAgICBpZiAoZWxlbWVudHMpIHtcbiAgICAgICAgICAgIGVsZW1lbnRzLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgICAgICAgIGVsLmlubmVySFRNTCA9IHRlbXBsYXRlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBET01QYWdlLmlubmVySFRNTCA9IHRlbXBsYXRlXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZ2V0UmVuZGVyRnVuY3Rpb24oKSkge1xuICAgICAgICAgIHJlbmRlciA9IHRoaXMuZ2V0UmVuZGVyRnVuY3Rpb24oKVxuICAgICAgICB9XG5cbiAgICAgICAgcmVuZGVyKHBhZ2VFbGVtZW50LCB0ZW1wbGF0ZSwgcGFnZUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChURU1QTEFURV9TRUxFQ1RPUikpXG4gICAgICB9LCBudWxsKVxuICAgIH1cblxuICAgIC8vIHB1YmxpY1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0geyp9IGNhbGxiYWNrRm5cbiAgICAgKi9cbiAgICBhZGRFdmVudENhbGxiYWNrKGNhbGxiYWNrRm4pIHtcbiAgICAgIHRoaXMuZXZlbnRzLnB1c2goY2FsbGJhY2tGbilcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVc2UgdGhlIGdpdmVuIHRlbXBsYXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdGVtcGxhdGVQYXRoXG4gICAgICovXG4gICAgdXNlVGVtcGxhdGUodGVtcGxhdGVQYXRoKSB7XG4gICAgICBpZiAodHlwZW9mIHRlbXBsYXRlUGF0aCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgdGVtcGxhdGUgcGF0aCBtdXN0IGJlIGEgc3RyaW5nLiAnICsgdHlwZW9mIHRlbXBsYXRlUGF0aCArICcgaXMgZ2l2ZW4nKVxuICAgICAgfVxuICAgICAgdGhpcy50ZW1wbGF0ZVBhdGggPSB0ZW1wbGF0ZVBhdGhcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVc2UgdGhlIGdpdmVuIHRlbXBsYXRlIHJlbmRlcmVyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gcmVuZGVyRnVuY3Rpb25cbiAgICAgKi9cbiAgICB1c2VUZW1wbGF0ZVJlbmRlcmVyKHJlbmRlckZ1bmN0aW9uKSB7XG4gICAgICBpZiAodHlwZW9mIHJlbmRlckZ1bmN0aW9uICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIGN1c3RvbSB0ZW1wbGF0ZSByZW5kZXJlciBtdXN0IGJlIGEgZnVuY3Rpb24uICcgKyB0eXBlb2YgcmVuZGVyRnVuY3Rpb24gKyAnIGlzIGdpdmVuJylcbiAgICAgIH1cbiAgICAgIHRoaXMucmVuZGVyRnVuY3Rpb24gPSByZW5kZXJGdW5jdGlvblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRyaWdnZXIgc2NvcGVzXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZVxuICAgICAqIEBwYXJhbSB7e319IFtldmVudFBhcmFtcz17fV1cbiAgICAgKi9cbiAgICB0cmlnZ2VyU2NvcGVzKGV2ZW50TmFtZSwgZXZlbnRQYXJhbXMgPSB7fSkge1xuICAgICAgY29uc3QgZXZlbnROYW1lQWxpYXMgPSBgb24ke2V2ZW50TmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKX0ke2V2ZW50TmFtZS5zbGljZSgxKX1gXG5cbiAgICAgIHRoaXMuZXZlbnRzLmZvckVhY2goKHNjb3BlKSA9PiB7XG4gICAgICAgIGNvbnN0IHNjb3BlRXZlbnQgPSBzY29wZVtldmVudE5hbWVdXG4gICAgICAgIGNvbnN0IHNjb3BlRXZlbnRBbGlhcyA9IHNjb3BlW2V2ZW50TmFtZUFsaWFzXVxuICAgICAgICBpZiAodHlwZW9mIHNjb3BlRXZlbnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBzY29wZUV2ZW50LmFwcGx5KHRoaXMsIGV2ZW50UGFyYW1zKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gdHJpZ2dlciB0aGUgZXZlbnQgYWxpYXNcbiAgICAgICAgaWYgKHR5cGVvZiBzY29wZUV2ZW50QWxpYXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBzY29wZUV2ZW50QWxpYXMuYXBwbHkodGhpcywgZXZlbnRQYXJhbXMpXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIGRpc3BhdGNoUGFnZUV2ZW50KGV2ZW50TmFtZSwgdGhpcy5uYW1lLCBldmVudFBhcmFtcylcbiAgICB9XG4gIH1cblxuICByZXR1cm4gUGFnZVxufSkoKVxuXG5leHBvcnQgZGVmYXVsdCBQYWdlXG4iLCIvKlxuICogVXNlIG9mIHBsYXRmb3JtLmpzXG4gKiBodHRwczovL2dpdGh1Yi5jb20vYmVzdGllanMvcGxhdGZvcm0uanNcbiAqIExpY2Vuc2U6IGh0dHBzOi8vZ2l0aHViLmNvbS9iZXN0aWVqcy9wbGF0Zm9ybS5qcy9ibG9iL21hc3Rlci9MSUNFTlNFXG4gKi9cbmltcG9ydCBwbGF0Zm9ybSBmcm9tICdwbGF0Zm9ybSdcblxuZXhwb3J0IGRlZmF1bHQgcGxhdGZvcm1cbiIsIlxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRGaWxlKHVybCwgZm4sIHBvc3REYXRhKSB7XG4gIGNvbnN0IHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gIGlmIChyZXEub3ZlcnJpZGVNaW1lVHlwZSkgcmVxLm92ZXJyaWRlTWltZVR5cGUoJ3RleHQvaHRtbDsgY2hhcnNldD11dGYtOCcpXG4gIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgaWYgKHJlcS5yZWFkeVN0YXRlID09PSA0ICYmIChwYXJzZUludChyZXEuc3RhdHVzKSA9PT0gMjAwIHx8ICFyZXEuc3RhdHVzICYmIHJlcS5yZXNwb25zZVRleHQubGVuZ3RoKSkge1xuICAgICAgZm4ocmVxLnJlc3BvbnNlVGV4dClcbiAgICB9XG4gIH1cblxuICBpZiAodHlwZW9mIHBvc3REYXRhICE9PSAnc3RyaW5nJykge1xuICAgIHJlcS5vcGVuKCdHRVQnLCB1cmwsIHRydWUpXG4gICAgcmVxLnNlbmQoJycpXG4gIH0gZWxzZSB7XG4gICAgcmVxLm9wZW4oJ1BPU1QnLCB1cmwsIHRydWUpXG4gICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKVxuICAgIHJlcS5zZW5kKHBvc3REYXRhKVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZUlkKCkge1xuICByZXR1cm4gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyKDIsIDEwKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZFRhcmdldEJ5Q2xhc3ModGFyZ2V0LCBwYXJlbnRDbGFzcykge1xuICBmb3IgKDsgdGFyZ2V0ICYmIHRhcmdldCAhPT0gZG9jdW1lbnQ7IHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlKSB7XG4gICAgaWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMocGFyZW50Q2xhc3MpKSB7XG4gICAgICByZXR1cm4gdGFyZ2V0XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGxcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZmluZFRhcmdldEJ5SWQodGFyZ2V0LCBwYXJlbnRJZCkge1xuICBmb3IgKDsgdGFyZ2V0ICYmIHRhcmdldCAhPT0gZG9jdW1lbnQ7IHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlKSB7XG4gICAgaWYgKHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2lkJykgPT09IHBhcmVudElkKSB7XG4gICAgICByZXR1cm4gdGFyZ2V0XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGxcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRUYXJnZXRCeUF0dHIodGFyZ2V0LCBhdHRyKSB7XG4gIGZvciAoOyB0YXJnZXQgJiYgdGFyZ2V0ICE9PSBkb2N1bWVudDsgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGUpIHtcbiAgICBpZiAodGFyZ2V0LmdldEF0dHJpYnV0ZShhdHRyKSAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRhcmdldFxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsXG59XG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vLyBjb3JlXG5pbXBvcnQgUGFnZXIgZnJvbSAnLi9jb3JlL3BhZ2VyL2luZGV4J1xuaW1wb3J0IEFqYXggZnJvbSAnLi9jb3JlL2FqYXgnXG5pbXBvcnQgcGxhdGZvcm0gZnJvbSAnLi9jb3JlL3BsYXRmb3JtJ1xuaW1wb3J0IEludGwgZnJvbSAnLi9jb3JlL2ludGwnXG5pbXBvcnQgTmV0d29yayBmcm9tICcuL2NvcmUvbmV0d29yaydcblxuLy8gY29tcG9uZW50c1xuaW1wb3J0IERpYWxvZyBmcm9tICcuL2NvbXBvbmVudHMvZGlhbG9nJ1xuaW1wb3J0IE5vdGlmaWNhdGlvbiBmcm9tICcuL2NvbXBvbmVudHMvbm90aWZpY2F0aW9uJ1xuaW1wb3J0IENvbGxhcHNlIGZyb20gJy4vY29tcG9uZW50cy9jb2xsYXBzZSdcbmltcG9ydCBBY2NvcmRpb24gZnJvbSAnLi9jb21wb25lbnRzL2FjY29yZGlvbidcbmltcG9ydCBUYWIgZnJvbSAnLi9jb21wb25lbnRzL3RhYidcbmltcG9ydCBQcm9ncmVzcyBmcm9tICcuL2NvbXBvbmVudHMvcHJvZ3Jlc3MnXG5pbXBvcnQgTG9hZGVyIGZyb20gJy4vY29tcG9uZW50cy9sb2FkZXInXG5pbXBvcnQgT2ZmQ2FudmFzIGZyb20gJy4vY29tcG9uZW50cy9vZmYtY2FudmFzJ1xuaW1wb3J0IERyb3Bkb3duIGZyb20gJy4vY29tcG9uZW50cy9kcm9wZG93bidcblxuY29uc3QgYXBpID0ge31cblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvbmZpZ3VyYXRpb25cbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5hcGkuY29uZmlnID0ge1xuICAvLyBnbG9iYWwgY29uZmlnXG4gIGRlYnVnOiB0cnVlLFxufVxuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogUGFnZXJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5hcGkucGFnZXIgPSAob3B0aW9ucykgPT4ge1xuICBpZiAodHlwZW9mIGFwaS5fcGFnZXIgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgYXBpLl9wYWdlciA9IFBhZ2VyLl9ET01JbnRlcmZhY2Uob3B0aW9ucylcbiAgfVxuICByZXR1cm4gYXBpLl9wYWdlclxufVxuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogUGxhdGZvcm1cbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmFwaS5wbGF0Zm9ybSA9IHBsYXRmb3JtXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBBamF4XG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuYXBpLmFqYXggPSBBamF4Ll9ET01JbnRlcmZhY2VcblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIEludGxcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5hcGkuaW50bCA9IEludGwuX0RPTUludGVyZmFjZVxuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogTmV0d29ya1xuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmFwaS5uZXR3b3JrID0gTmV0d29yay5fRE9NSW50ZXJmYWNlXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBOb3RpZmljYXRpb25cbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5hcGkubm90aWZpY2F0aW9uID0gTm90aWZpY2F0aW9uLl9ET01JbnRlcmZhY2VcblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIERpYWxvZ1xuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmFwaS5kaWFsb2cgPSBEaWFsb2cuX0RPTUludGVyZmFjZVxuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQ29sbGFwc2VcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5hcGkuY29sbGFwc2UgPSBDb2xsYXBzZS5fRE9NSW50ZXJmYWNlXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBBY2NvcmRpb25cbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5hcGkuYWNjb3JkaW9uID0gQWNjb3JkaW9uLl9ET01JbnRlcmZhY2VcblxuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogVGFiXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuYXBpLnRhYiA9IFRhYi5fRE9NSW50ZXJmYWNlXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBQcm9ncmVzc1xuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmFwaS5wcm9ncmVzcyA9IFByb2dyZXNzLl9ET01JbnRlcmZhY2VcblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIExvYWRlclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmFwaS5sb2FkZXIgPSBMb2FkZXIuX0RPTUludGVyZmFjZVxuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogT2ZmIGNhbnZhc1xuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmFwaS5vZmZDYW52YXMgPSBPZmZDYW52YXMuX0RPTUludGVyZmFjZVxuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogRHJvcGRvd25cbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5hcGkuZHJvcGRvd24gPSBEcm9wZG93bi5fRE9NSW50ZXJmYWNlXG5cbi8vIE1ha2UgdGhlIEFQSSBsaXZlXG53aW5kb3cucGhvbm9uID0gYXBpXG5cbmV4cG9ydCBkZWZhdWx0IGFwaVxuIl0sInByZUV4aXN0aW5nQ29tbWVudCI6Ii8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltNXZaR1ZmYlc5a2RXeGxjeTlpY205M2MyVnlMWEJoWTJzdlgzQnlaV3gxWkdVdWFuTWlMQ0p1YjJSbFgyMXZaSFZzWlhNdmNHeGhkR1p2Y20wdmNHeGhkR1p2Y20wdWFuTWlMQ0p6Y21NdmFuTXZZMjl0Y0c5dVpXNTBjeTloWTJOdmNtUnBiMjR2YVc1a1pYZ3Vhbk1pTENKemNtTXZhbk12WTI5dGNHOXVaVzUwY3k5amIyeHNZWEJ6WlM5cGJtUmxlQzVxY3lJc0luTnlZeTlxY3k5amIyMXdiMjVsYm5SekwyTnZiWEJ2Ym1WdWRDNXFjeUlzSW5OeVl5OXFjeTlqYjIxd2IyNWxiblJ6TDJOdmJYQnZibVZ1ZEUxaGJtRm5aWEl1YW5NaUxDSnpjbU12YW5NdlkyOXRjRzl1Wlc1MGN5OWthV0ZzYjJjdmFXNWtaWGd1YW5NaUxDSnpjbU12YW5NdlkyOXRjRzl1Wlc1MGN5OWtjbTl3Wkc5M2JpOXBibVJsZUM1cWN5SXNJbk55WXk5cWN5OWpiMjF3YjI1bGJuUnpMMnh2WVdSbGNpOXBibVJsZUM1cWN5SXNJbk55WXk5cWN5OWpiMjF3YjI1bGJuUnpMMjV2ZEdsbWFXTmhkR2x2Ymk5cGJtUmxlQzVxY3lJc0luTnlZeTlxY3k5amIyMXdiMjVsYm5SekwyOW1aaTFqWVc1MllYTXZhVzVrWlhndWFuTWlMQ0p6Y21NdmFuTXZZMjl0Y0c5dVpXNTBjeTl3Y205bmNtVnpjeTlwYm1SbGVDNXFjeUlzSW5OeVl5OXFjeTlqYjIxd2IyNWxiblJ6TDNSaFlpOXBibVJsZUM1cWN5SXNJbk55WXk5cWN5OWpiM0psTDJGcVlYZ3ZhVzVrWlhndWFuTWlMQ0p6Y21NdmFuTXZZMjl5WlM5bGRtVnVkSE12WkdsemNHRjBZMmd1YW5NaUxDSnpjbU12YW5NdlkyOXlaUzlsZG1WdWRITXZhVzVrWlhndWFuTWlMQ0p6Y21NdmFuTXZZMjl5WlM5cGJuUnNMMkpwYm1SbGNpNXFjeUlzSW5OeVl5OXFjeTlqYjNKbEwybHVkR3d2YVc1a1pYZ3Vhbk1pTENKemNtTXZhbk12WTI5eVpTOXVaWFIzYjNKckwybHVaR1Y0TG1weklpd2ljM0pqTDJwekwyTnZjbVV2Y0dGblpYSXZhVzVrWlhndWFuTWlMQ0p6Y21NdmFuTXZZMjl5WlM5d1lXZGxjaTl3WVdkbExtcHpJaXdpYzNKakwycHpMMk52Y21VdmNHeGhkR1p2Y20wdmFXNWtaWGd1YW5NaUxDSnpjbU12YW5NdlkyOXlaUzkxZEdsc2N5OXBibVJsZUM1cWN5SXNJbk55WXk5cWN5OXBibVJsZUM1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRVHM3UVVOQlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPenM3T3pzN096czdPenM3TzBGRE5YSkRRVHM3T3p0QlFVTkJPenM3TzBGQlEwRTdPMEZCUTBFN096czdRVUZEUVRzN096czdPenM3SzJWQlZFRTdPenM3T3pzN1FVRlhRU3hKUVVGTkxGbEJRV0VzV1VGQlRUdEJRVU4yUWpzN096czdPMEZCVFVFc1RVRkJUU3hQUVVGUExGZEJRV0k3UVVGRFFTeE5RVUZOTEZWQlFWVXNUMEZCYUVJN1FVRkRRU3hOUVVGTkxIRkNRVUZ4UWp0QlFVTjZRaXhoUVVGVE8wRkJSR2RDTEVkQlFUTkNPMEZCUjBFc1RVRkJUU3gzUWtGQmQwSXNSVUZCT1VJN08wRkJSMEU3T3pzN096dEJRV1oxUWl4TlFYRkNha0lzVTBGeVFtbENPMEZCUVVFN08wRkJkVUp5UWl4NVFrRkJNRUk3UVVGQlFTeFZRVUZrTEU5QlFXTXNkVVZCUVVvc1JVRkJTVHM3UVVGQlFUczdRVUZCUVN4M1NFRkRiRUlzU1VGRWEwSXNSVUZEV2l4UFFVUlpMRVZCUTBnc2EwSkJSRWNzUlVGRGFVSXNUMEZFYWtJc1JVRkRNRUlzY1VKQlJERkNMRVZCUTJsRUxFdEJSR3BFTEVWQlEzZEVMRXRCUkhoRU96dEJRVWQ0UWl4WlFVRkxMRk5CUVV3c1IwRkJhVUlzUlVGQmFrSTdPMEZCUlVFc1ZVRkJUU3hWUVVGVkxFMUJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1owSkJRWEpDTEc5Q1FVRjFSQ3hKUVVGMlJDeFJRVUZvUWp0QlFVTkJMR05CUVZFc1QwRkJVaXhEUVVGblFpeFZRVUZETEUxQlFVUXNSVUZCV1R0QlFVTXhRaXhaUVVGTkxHRkJRV0VzVDBGQlR5eFpRVUZRTEVOQlFXOUNMRTFCUVhCQ0xFTkJRVzVDTzBGQlEwRXNXVUZCVFN4WFFVRlhMRk5CUVZNc1lVRkJWQ3hEUVVGMVFpeFZRVUYyUWl4RFFVRnFRanM3UVVGRlFTeFpRVUZKTEZGQlFVb3NSVUZCWXp0QlFVTmFMR2RDUVVGTExGZEJRVXdzUTBGQmFVSXNVVUZCYWtJN1FVRkRSRHRCUVVOR0xFOUJVRVE3UVVGT2QwSTdRVUZqZWtJN08wRkJja052UWp0QlFVRkJPMEZCUVVFc2NVTkJkVU5PTEV0QmRrTk5MRVZCZFVORE8wRkJRM0JDTEZsQlFVMHNTMEZCU3l4TlFVRk5MRTFCUVU0c1EwRkJZU3haUVVGaUxFTkJRVEJDTEUxQlFURkNMRU5CUVZnN1FVRkRRU3haUVVGTkxGVkJRVlVzVTBGQlV5eGhRVUZVTEVOQlFYVkNMRVZCUVhaQ0xFTkJRV2hDT3p0QlFVVkJMR0ZCUVVzc1dVRkJUQ3hEUVVGclFpeFBRVUZzUWp0QlFVTkVPMEZCTlVOdlFqdEJRVUZCTzBGQlFVRXNhME5CT0VOVUxFOUJPVU5UTEVWQk9FTkJPMEZCUTI1Q0xGbEJRVTBzVjBGQlZ5eDFRa0ZCWVR0QlFVTTFRanRCUVVRMFFpeFRRVUZpTEVOQlFXcENPMEZCUjBFc1lVRkJTeXhUUVVGTUxFTkJRV1VzU1VGQlppeERRVUZ2UWl4UlFVRndRanM3UVVGRlFTeGxRVUZQTEZGQlFWQTdRVUZEUkR0QlFYSkViMEk3UVVGQlFUdEJRVUZCTEd0RFFYVkVWQ3hQUVhaRVV5eEZRWFZFUVR0QlFVTnVRaXhaUVVGSkxGZEJRVmNzUzBGQlN5eFRRVUZNTEVOQlFXVXNTVUZCWml4RFFVRnZRanRCUVVGQkxHbENRVUZMTEVWQlFVVXNUMEZCUml4RFFVRlZMRTlCUVZZc1EwRkJhMElzV1VGQmJFSXNRMEZCSzBJc1NVRkJMMElzVFVGQmVVTXNVVUZCVVN4WlFVRlNMRU5CUVhGQ0xFbEJRWEpDTEVOQlFUbERPMEZCUVVFc1UwRkJjRUlzUTBGQlpqczdRVUZGUVN4WlFVRkpMRU5CUVVNc1VVRkJUQ3hGUVVGbE8wRkJRMkk3UVVGRFFTeHhRa0ZCVnl4TFFVRkxMRmRCUVV3c1JVRkJXRHRCUVVORU96dEJRVVZFTEdWQlFVOHNVVUZCVUR0QlFVTkVPMEZCYUVWdlFqdEJRVUZCTzBGQlFVRXNjVU5CYTBWT08wRkJRMklzWlVGQlR5eExRVUZMTEZOQlFWbzdRVUZEUkR0QlFYQkZiMEk3UVVGQlFUdEJRVUZCTEcxRFFYTkZVaXhaUVhSRlVTeEZRWE5GVFR0QlFVTjZRaXhaUVVGTkxGZEJRVmNzUzBGQlN5eFhRVUZNTEVOQlFXbENMRmxCUVdwQ0xFTkJRV3BDTzBGQlEwRXNZVUZCU3l4VFFVRk1MRU5CUVdVc1QwRkJaaXhEUVVGMVFpeFZRVUZETEVOQlFVUXNSVUZCVHp0QlFVTTFRaXhqUVVGSkxFVkJRVVVzVDBGQlJpeERRVUZWTEU5QlFWWXNRMEZCYTBJc1dVRkJiRUlzUTBGQkswSXNTVUZCTDBJc1RVRkJlVU1zWVVGQllTeFpRVUZpTEVOQlFUQkNMRWxCUVRGQ0xFTkJRVGRETEVWQlFUaEZPMEZCUXpWRkxHTkJRVVVzU1VGQlJqdEJRVU5FTEZkQlJrUXNUVUZGVHp0QlFVTk1MSEZDUVVGVExFMUJRVlE3UVVGRFJEdEJRVU5HTEZOQlRrUTdRVUZQUkR0QlFTOUZiMEk3UVVGQlFUdEJRVUZCTERKQ1FXbEdhRUlzVlVGcVJtZENMRVZCYVVaS08wRkJRMllzV1VGQlNTeFhRVUZYTEZWQlFXWTdRVUZEUVN4WlFVRkpMRTlCUVU4c1ZVRkJVQ3hMUVVGelFpeFJRVUV4UWl4RlFVRnZRenRCUVVOc1F5eHhRa0ZCVnl4VFFVRlRMR0ZCUVZRc1EwRkJkVUlzVlVGQmRrSXNRMEZCV0R0QlFVTkVPenRCUVVWRUxGbEJRVWtzUTBGQlF5eFJRVUZNTEVWQlFXVTdRVUZEWWl4blFrRkJUU3hKUVVGSkxFdEJRVW9zUTBGQllTeEpRVUZpTERCQ1FVRnpReXhWUVVGMFF5eHBRMEZCVGp0QlFVTkVPenRCUVVWRUxHRkJRVXNzV1VGQlRDeERRVUZyUWl4UlFVRnNRanM3UVVGRlFTeGxRVUZQTEVsQlFWQTdRVUZEUkR0QlFUbEdiMEk3UVVGQlFUdEJRVUZCTERKQ1FXZEhhRUlzVlVGb1IyZENMRVZCWjBkS08wRkJRMllzV1VGQlNTeFhRVUZYTEZWQlFXWTdRVUZEUVN4WlFVRkpMRTlCUVU4c1ZVRkJVQ3hMUVVGelFpeFJRVUV4UWl4RlFVRnZRenRCUVVOc1F5eHhRa0ZCVnl4VFFVRlRMR0ZCUVZRc1EwRkJkVUlzVlVGQmRrSXNRMEZCV0R0QlFVTkVPenRCUVVWRUxGbEJRVWtzUTBGQlF5eFJRVUZNTEVWQlFXVTdRVUZEWWl4blFrRkJUU3hKUVVGSkxFdEJRVW9zUTBGQllTeEpRVUZpTERCQ1FVRnpReXhWUVVGMFF5eHBRMEZCVGp0QlFVTkVPenRCUVVWRUxGbEJRVTBzWTBGQll5eExRVUZMTEZkQlFVd3NRMEZCYVVJc1VVRkJha0lzUTBGQmNFSTdRVUZEUVN4bFFVRlBMRmxCUVZrc1NVRkJXaXhGUVVGUU8wRkJRMFE3UVVFMVIyOUNPMEZCUVVFN1FVRkJRU3h2UTBFNFIwRXNUMEU1UjBFc1JVRTRSMU03UVVGRE5VSXNLMGRCUVRKQ0xGTkJRVE5DTEVWQlFYTkRMRTlCUVhSRE8wRkJRMFE3UVVGb1NHOUNPenRCUVVGQk8wRkJRVUU3TzBGQmJVaDJRanM3T3pzN096dEJRVXRCTEUxQlFVMHNZVUZCWVN4RlFVRnVRanM3UVVGRlFTeE5RVUZOTEdGQlFXRXNVMEZCVXl4blFrRkJWQ3hQUVVFNFFpeEpRVUU1UWl4RFFVRnVRanRCUVVOQkxFMUJRVWtzVlVGQlNpeEZRVUZuUWp0QlFVTmtMR1ZCUVZjc1QwRkJXQ3hEUVVGdFFpeFZRVUZETEU5QlFVUXNSVUZCWVR0QlFVTTVRaXhWUVVGTkxGTkJRVk1zTWtOQlFXOUNMRTlCUVhCQ0xFVkJRVFpDTEd0Q1FVRTNRaXhGUVVGcFJDeHhRa0ZCYWtRc1EwRkJaanRCUVVOQkxHRkJRVThzVDBGQlVDeEhRVUZwUWl4UFFVRnFRanM3UVVGRlFTeHBRa0ZCVnl4SlFVRllMRU5CUVdkQ0xGVkJRVlVzWVVGQlZpeERRVUYzUWl4TlFVRjRRaXhEUVVGb1FqdEJRVU5FTEV0QlRFUTdRVUZOUkRzN1FVRkZSQ3hOUVVGSkxGVkJRVW9zUlVGQlowSTdRVUZEWkN4aFFVRlRMR2RDUVVGVUxFTkJRVEJDTEU5QlFURkNMRVZCUVcxRExGVkJRVU1zUzBGQlJDeEZRVUZYTzBGQlF6VkRMRlZCUVUwc2FVSkJRV2xDTEUxQlFVMHNUVUZCVGl4RFFVRmhMRmxCUVdJc1EwRkJNRUlzWVVGQk1VSXNRMEZCZGtJN1FVRkRRU3hWUVVGSkxHdENRVUZyUWl4dFFrRkJiVUlzU1VGQmVrTXNSVUZCSzBNN1FVRkROME1zV1VGQlRTeGhRVUZoTEUxQlFVMHNUVUZCVGl4RFFVRmhMRmxCUVdJc1EwRkJNRUlzWVVGQk1VSXNTMEZCTkVNc1RVRkJUU3hOUVVGT0xFTkJRV0VzV1VGQllpeERRVUV3UWl4TlFVRXhRaXhEUVVFdlJEdEJRVU5CTEZsQlFVMHNZVUZCWVN4VFFVRlRMR0ZCUVZRc1EwRkJkVUlzVlVGQmRrSXNRMEZCYmtJN08wRkJSVUVzV1VGQlRTeFpRVUZaTERoQ1FVRnJRaXhOUVVGTkxFMUJRWGhDTEVWQlFXZERMRmRCUVdoRExFTkJRV3hDT3p0QlFVVkJMRmxCUVVrc1kwRkJZeXhKUVVGc1FpeEZRVUYzUWp0QlFVTjBRanRCUVVORU96dEJRVVZFTEZsQlFVMHNZMEZCWXl4VlFVRlZMRmxCUVZZc1EwRkJkVUlzU1VGQmRrSXNRMEZCY0VJN1FVRkRRU3haUVVGTkxGbEJRVmtzVjBGQlZ5eEpRVUZZTEVOQlFXZENPMEZCUVVFc2FVSkJRVXNzUlVGQlJTeFZRVUZHTEVkQlFXVXNXVUZCWml4RFFVRTBRaXhKUVVFMVFpeE5RVUZ6UXl4WFFVRXpRenRCUVVGQkxGTkJRV2hDTEVOQlFXeENPenRCUVVWQkxGbEJRVWtzUTBGQlF5eFRRVUZNTEVWQlFXZENPMEZCUTJRN1FVRkRSRHM3UVVGRlJEdEJRVU5CTEZsQlFVMHNhVUpCUVdsQ0xGVkJRVlVzV1VGQlZpeEhRVUY1UWl4SlFVRjZRaXhEUVVFNFFqdEJRVUZCTEdsQ1FVRkxMRVZCUVVVc1ZVRkJSaXhQUVVGdFFpeFZRVUY0UWp0QlFVRkJMRk5CUVRsQ0xFTkJRWFpDTzBGQlEwRXNXVUZCU1N4RFFVRkRMR05CUVV3c1JVRkJjVUk3UVVGRGJrSXNiMEpCUVZVc1YwRkJWaXhEUVVGelFpeFZRVUYwUWp0QlFVTkVPenRCUVVWRUxHdENRVUZWTEVsQlFWWXNRMEZCWlN4VlFVRm1PMEZCUTBRN1FVRkRSaXhMUVROQ1JEdEJRVFJDUkRzN1FVRkZSQ3hUUVVGUExGTkJRVkE3UVVGRFJDeERRWEJMYVVJc1JVRkJiRUk3TzJ0Q1FYTkxaU3hUT3pzN096czdPenM3T3pzN08wRkROVXRtT3pzN08wRkJRMEU3TzBGQlEwRTdPenM3UVVGRFFUczdPenM3T3pzN0syVkJVa0U3T3pzN096czdRVUZWUVN4SlFVRk5MRmRCUVZrc1dVRkJUVHRCUVVOMFFqczdPenM3TzBGQlRVRXNUVUZCVFN4UFFVRlBMRlZCUVdJN1FVRkRRU3hOUVVGTkxGVkJRVlVzVDBGQmFFSTdRVUZEUVN4TlFVRk5MSEZDUVVGeFFqdEJRVU42UWl4aFFVRlRMRWxCUkdkQ08wRkJSWHBDTEZsQlFWRTdRVUZHYVVJc1IwRkJNMEk3UVVGSlFTeE5RVUZOTEhkQ1FVRjNRaXhEUVVNMVFpeFJRVVEwUWl4RFFVRTVRanM3UVVGSlFUczdPenM3TzBGQmFrSnpRaXhOUVhWQ2FFSXNVVUYyUW1kQ08wRkJRVUU3TzBGQmVVSndRaXgzUWtGQk1FSTdRVUZCUVN4VlFVRmtMRTlCUVdNc2RVVkJRVW9zUlVGQlNUczdRVUZCUVRzN1FVRkJRU3h6U0VGRGJFSXNTVUZFYTBJc1JVRkRXaXhQUVVSWkxFVkJRMGdzYTBKQlJFY3NSVUZEYVVJc1QwRkVha0lzUlVGRE1FSXNjVUpCUkRGQ0xFVkJRMmxFTEV0QlJHcEVMRVZCUTNkRUxFdEJSSGhFT3p0QlFVZDRRaXhaUVVGTExGbEJRVXdzUjBGQmIwSXNTMEZCY0VJN08wRkJSVUU3UVVGRFFTeFZRVUZKTEUxQlFVc3NUMEZCVEN4RFFVRmhMRTFCUVdwQ0xFVkJRWGxDTzBGQlEzWkNMR05CUVVzc1NVRkJURHRCUVVORU8wRkJVblZDTzBGQlUzcENPenRCUVd4RGJVSTdRVUZCUVR0QlFVRkJMR3REUVc5RFVqdEJRVU5XTEdWQlFVOHNTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeHhRa0ZCY2tJc1EwRkJNa01zUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCZUVRc1JVRkJhVVVzVFVGQmVFVTdRVUZEUkR0QlFYUkRiVUk3UVVGQlFUdEJRVUZCTEN0Q1FYZERXRHRCUVVOUUxGbEJRVWtzUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhUUVVGeVFpeERRVUVyUWl4UlFVRXZRaXhEUVVGM1F5eE5RVUY0UXl4RFFVRktMRVZCUVhGRU8wRkJRMjVFTEdsQ1FVRlBMRXRCUVVzc1NVRkJUQ3hGUVVGUU8wRkJRMFE3TzBGQlJVUXNaVUZCVHl4TFFVRkxMRWxCUVV3c1JVRkJVRHRCUVVORU8wRkJPVU50UWp0QlFVRkJPMEZCUVVFc05rSkJaMFJpTzBGQlFVRTdPMEZCUTB3c1dVRkJTU3hMUVVGTExGbEJRVlFzUlVGQmRVSTdRVUZEY2tJc2FVSkJRVThzUzBGQlVEdEJRVU5FT3p0QlFVVkVMRmxCUVVrc1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4VFFVRnlRaXhEUVVFclFpeFJRVUV2UWl4RFFVRjNReXhOUVVGNFF5eERRVUZLTEVWQlFYRkVPMEZCUTI1RUxHbENRVUZQTEV0QlFWQTdRVUZEUkRzN1FVRkZSQ3hoUVVGTExGbEJRVXdzUjBGQmIwSXNTVUZCY0VJN08wRkJSVUVzV1VGQlRTeGpRVUZqTEZOQlFXUXNWMEZCWXl4SFFVRk5PMEZCUTNoQ0xHbENRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xGTkJRWEpDTEVOQlFTdENMRWRCUVM5Q0xFTkJRVzFETEUxQlFXNURPMEZCUTBFc2FVSkJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1UwRkJja0lzUTBGQkswSXNUVUZCTDBJc1EwRkJjME1zV1VGQmRFTTdRVUZEUVN4cFFrRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4dFFrRkJja0lzUTBGQmVVTXNhVUpCUVUwc1kwRkJMME1zUlVGQkswUXNWMEZCTDBRN08wRkJSVUVzYVVKQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzV1VGQmNrSXNRMEZCYTBNc1pVRkJiRU1zUlVGQmJVUXNTVUZCYmtRN08wRkJSVUVzYVVKQlFVc3NXVUZCVEN4SFFVRnZRaXhMUVVGd1FqdEJRVU5FTEZOQlVrUTdPMEZCVlVFc1dVRkJTU3hEUVVGRExFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1UwRkJja0lzUTBGQkswSXNVVUZCTDBJc1EwRkJkME1zV1VGQmVFTXNRMEZCVEN4RlFVRTBSRHRCUVVNeFJDeGxRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xGTkJRWEpDTEVOQlFTdENMRWRCUVM5Q0xFTkJRVzFETEZsQlFXNURPMEZCUTBRN08wRkJSVVFzWVVGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhuUWtGQmNrSXNRMEZCYzBNc2FVSkJRVTBzWTBGQk5VTXNSVUZCTkVRc1YwRkJOVVE3TzBGQlJVRXNXVUZCVFN4VFFVRlRMRXRCUVVzc1UwRkJUQ3hGUVVGbU96dEJRVVZCTEdGQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzUzBGQmNrSXNRMEZCTWtJc1RVRkJNMElzUjBGQmIwTXNTMEZCY0VNN08wRkJSVUVzYlVKQlFWY3NXVUZCVFR0QlFVTm1MR2xDUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRXRCUVhKQ0xFTkJRVEpDTEUxQlFUTkNMRWRCUVhWRExFMUJRWFpETzBGQlEwUXNVMEZHUkN4RlFVVkhMRVZCUmtnN08wRkJTVUVzWlVGQlR5eEpRVUZRTzBGQlEwUTdRVUZ3Um0xQ08wRkJRVUU3UVVGQlFTdzJRa0Z6Um1JN1FVRkJRVHM3UVVGRFRDeFpRVUZKTEV0QlFVc3NXVUZCVkN4RlFVRjFRanRCUVVOeVFpeHBRa0ZCVHl4TFFVRlFPMEZCUTBRN08wRkJSVVFzV1VGQlNTeERRVUZETEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzVTBGQmNrSXNRMEZCSzBJc1VVRkJMMElzUTBGQmQwTXNUVUZCZUVNc1EwRkJUQ3hGUVVGelJEdEJRVU53UkN4cFFrRkJUeXhMUVVGUU8wRkJRMFE3TzBGQlJVUXNZVUZCU3l4WlFVRk1MRWRCUVc5Q0xFbEJRWEJDT3p0QlFVVkJMRmxCUVUwc1kwRkJZeXhUUVVGa0xGZEJRV01zUjBGQlRUdEJRVU40UWl4cFFrRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4VFFVRnlRaXhEUVVFclFpeE5RVUV2UWl4RFFVRnpReXhaUVVGMFF6dEJRVU5CTEdsQ1FVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEV0QlFYSkNMRU5CUVRKQ0xFMUJRVE5DTEVkQlFXOURMRTFCUVhCRE8wRkJRMEVzYVVKQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzYlVKQlFYSkNMRU5CUVhsRExHbENRVUZOTEdOQlFTOURMRVZCUVN0RUxGZEJRUzlFT3p0QlFVVkJMR2xDUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRmxCUVhKQ0xFTkJRV3RETEdWQlFXeERMRVZCUVcxRUxFdEJRVzVFT3p0QlFVVkJMR2xDUVVGTExGbEJRVXdzUjBGQmIwSXNTMEZCY0VJN1FVRkRSQ3hUUVZKRU96dEJRVlZCTEdGQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzUzBGQmNrSXNRMEZCTWtJc1RVRkJNMElzUjBGQmIwTXNTMEZCY0VNN08wRkJSVUVzV1VGQlNTeERRVUZETEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzVTBGQmNrSXNRMEZCSzBJc1VVRkJMMElzUTBGQmQwTXNXVUZCZUVNc1EwRkJUQ3hGUVVFMFJEdEJRVU14UkN4bFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEZOQlFYSkNMRU5CUVN0Q0xFZEJRUzlDTEVOQlFXMURMRmxCUVc1RE8wRkJRMFE3TzBGQlJVUXNZVUZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeG5Ra0ZCY2tJc1EwRkJjME1zYVVKQlFVMHNZMEZCTlVNc1JVRkJORVFzVjBGQk5VUTdPMEZCUlVFc1lVRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4VFFVRnlRaXhEUVVFclFpeE5RVUV2UWl4RFFVRnpReXhOUVVGMFF6czdRVUZGUVN4bFFVRlBMRWxCUVZBN1FVRkRSRHRCUVhSSWJVSTdRVUZCUVR0QlFVRkJMRzlEUVhkSVF5eFBRWGhJUkN4RlFYZElWVHRCUVVNMVFpdzJSMEZCTWtJc1VVRkJNMElzUlVGQmNVTXNUMEZCY2tNN1FVRkRSRHRCUVRGSWJVSTdPMEZCUVVFN1FVRkJRVHM3UVVFMlNIUkNPenM3T3pzN08wRkJTMEVzVFVGQlRTeGhRVUZoTEVWQlFXNUNPenRCUVVWQkxFMUJRVTBzV1VGQldTeFRRVUZUTEdkQ1FVRlVMRTlCUVRoQ0xFbEJRVGxDTEVOQlFXeENPMEZCUTBFc1RVRkJTU3hUUVVGS0xFVkJRV1U3UVVGRFlpeGpRVUZWTEU5QlFWWXNRMEZCYTBJc1ZVRkJReXhQUVVGRUxFVkJRV0U3UVVGRE4wSTdRVUZEUVN4VlFVRk5MRk5CUVZNc01rTkJRVzlDTEU5QlFYQkNMRVZCUVRaQ0xHdENRVUUzUWl4RlFVRnBSQ3h4UWtGQmFrUXNRMEZCWmp0QlFVTkJMR0ZCUVU4c1QwRkJVQ3hIUVVGcFFpeFBRVUZxUWpzN1FVRkZRU3hwUWtGQlZ5eEpRVUZZTEVOQlFXZENMRk5CUVZNc1lVRkJWQ3hEUVVGMVFpeE5RVUYyUWl4RFFVRm9RanRCUVVORUxFdEJUa1E3UVVGUFJEczdRVUZGUkN4TlFVRkpMRk5CUVVvc1JVRkJaVHRCUVVOaUxHRkJRVk1zWjBKQlFWUXNRMEZCTUVJc1QwRkJNVUlzUlVGQmJVTXNWVUZCUXl4TFFVRkVMRVZCUVZjN1FVRkROVU1zVlVGQlRTeFRRVUZUTERaQ1FVRnBRaXhOUVVGTkxFMUJRWFpDTEVWQlFTdENMR0ZCUVM5Q0xFTkJRV1k3UVVGRFFTeFZRVUZKTEVOQlFVTXNUVUZCVEN4RlFVRmhPMEZCUTFnN1FVRkRSRHM3UVVGRlJDeFZRVUZOTEdsQ1FVRnBRaXhQUVVGUExGbEJRVkFzUTBGQmIwSXNZVUZCY0VJc1EwRkJka0k3TzBGQlJVRXNWVUZCU1N4clFrRkJhMElzYlVKQlFXMUNMRWxCUVhwRExFVkJRU3RETzBGQlF6ZERMRmxCUVVrc1MwRkJTeXhQUVVGUExGbEJRVkFzUTBGQmIwSXNZVUZCY0VJc1MwRkJjME1zVDBGQlR5eFpRVUZRTEVOQlFXOUNMRTFCUVhCQ0xFTkJRUzlETzBGQlEwRXNZVUZCU3l4SFFVRkhMRTlCUVVnc1EwRkJWeXhIUVVGWUxFVkJRV2RDTEVWQlFXaENMRU5CUVV3N08wRkJSVUVzV1VGQlRTeFpRVUZaTEZkQlFWY3NTVUZCV0N4RFFVRm5RanRCUVVGQkxHbENRVUZMTEVWQlFVVXNWVUZCUml4SFFVRmxMRmxCUVdZc1EwRkJORUlzU1VGQk5VSXNUVUZCYzBNc1JVRkJNME03UVVGQlFTeFRRVUZvUWl4RFFVRnNRanM3UVVGRlFTeFpRVUZKTEVOQlFVTXNVMEZCVEN4RlFVRm5RanRCUVVOa08wRkJRMFE3TzBGQlJVUXNhMEpCUVZVc1RVRkJWanRCUVVORU8wRkJRMFlzUzBGd1FrUTdRVUZ4UWtRN08wRkJSVVFzVTBGQlR5eFJRVUZRTzBGQlEwUXNRMEY0UzJkQ0xFVkJRV3BDT3p0clFrRXdTMlVzVVRzN096czdPenM3TzNGcVFrTndUR1k3T3pzN096czdRVUZMUVRzN1FVRkRRVHM3UVVGRFFUczdPenRCUVVOQk96czdPenM3T3p0QlFVVkJPenM3T3pzN1NVRk5jVUlzVXp0QlFVVnVRaXh4UWtGQldTeEpRVUZhTEVWQlFXdENMRTlCUVd4Q0xFVkJRVzFKTzBGQlFVRXNVVUZCZUVjc1kwRkJkMGNzZFVWQlFYWkdMRVZCUVhWR08wRkJRVUVzVVVGQmJrWXNUMEZCYlVZc2RVVkJRWHBGTEVWQlFYbEZPMEZCUVVFc1VVRkJja1VzVjBGQmNVVXNkVVZCUVhaRUxFVkJRWFZFT3p0QlFVRkJPenRCUVVGQkxGRkJRVzVFTEhGQ1FVRnRSQ3gxUlVGQk0wSXNTMEZCTWtJN1FVRkJRU3hSUVVGd1FpeFZRVUZ2UWl4MVJVRkJVQ3hMUVVGUE96dEJRVUZCT3p0QlFVTnFTU3hUUVVGTExFbEJRVXdzUjBGQldTeEpRVUZhTzBGQlEwRXNVMEZCU3l4UFFVRk1MRWRCUVdVc1QwRkJaanRCUVVOQkxGTkJRVXNzVDBGQlRDeEhRVUZsTEU5QlFXWTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxGZEJRVThzU1VGQlVDeERRVUZaTEdOQlFWb3NSVUZCTkVJc1QwRkJOVUlzUTBGQmIwTXNWVUZCUXl4SlFVRkVMRVZCUVZVN1FVRkROVU1zVlVGQlNTeFBRVUZQTEUxQlFVc3NUMEZCVEN4RFFVRmhMRWxCUVdJc1EwRkJVQ3hMUVVFNFFpeFhRVUZzUXl4RlFVRXJRenRCUVVNM1F5eGpRVUZMTEU5QlFVd3NRMEZCWVN4SlFVRmlMRWxCUVhGQ0xHVkJRV1VzU1VGQlppeERRVUZ5UWp0QlFVTkVPMEZCUTBZc1MwRktSRHM3UVVGTlFTeFRRVUZMTEZkQlFVd3NSMEZCYlVJc1YwRkJia0k3UVVGRFFTeFRRVUZMTEhGQ1FVRk1MRWRCUVRaQ0xIRkNRVUUzUWp0QlFVTkJMRk5CUVVzc1ZVRkJUQ3hIUVVGclFpeFZRVUZzUWp0QlFVTkJMRk5CUVVzc1JVRkJUQ3hIUVVGVkxIZENRVUZXT3p0QlFVVkJMRkZCUVUwc1pVRkJaU3hEUVVGRExFdEJRVXNzY1VKQlFVNHNTVUZCSzBJc1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeExRVUY1UWl4SlFVRTNSVHM3UVVGRlFTeFJRVUZKTEU5QlFVOHNTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJjRUlzUzBGQlowTXNVVUZCY0VNc1JVRkJPRU03UVVGRE5VTXNWMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhIUVVGMVFpeFRRVUZUTEdGQlFWUXNRMEZCZFVJc1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQmNFTXNRMEZCZGtJN1FVRkRSRHM3UVVGRlJDeFJRVUZKTEdkQ1FVRm5RaXhEUVVGRExFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFXeERMRVZCUVRKRE8wRkJRM3BETEZsQlFVMHNTVUZCU1N4TFFVRktMRU5CUVdFc1MwRkJTeXhKUVVGc1FpeDVRMEZCVGp0QlFVTkVPenRCUVVWRUxGTkJRVXNzWTBGQlRDeEhRVUZ6UWl4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFdEJRWGxDTEVsQlFTOURPMEZCUTBFc1UwRkJTeXhyUWtGQlRDeEhRVUV3UWl4RlFVRXhRanM3UVVGRlFTeFJRVUZKTEVOQlFVTXNTMEZCU3l4alFVRldMRVZCUVRCQ08wRkJRM2hDT3pzN096czdPenRCUVZGQkxGZEJRVXNzVDBGQlRDeEhRVUZsTEU5QlFVOHNUVUZCVUN4RFFVRmpMRXRCUVVzc1QwRkJia0lzUlVGQk5FSXNTMEZCU3l4alFVRk1MRU5CUVc5Q0xFdEJRVXNzWVVGQlRDeEZRVUZ3UWl4RlFVRXdReXhQUVVFeFF5eERRVUUxUWl4RFFVRm1PenRCUVVWQk8wRkJRMEVzVjBGQlN5eGhRVUZNTzBGQlEwUTdPMEZCUlVRc1UwRkJTeXhsUVVGTUxFZEJRWFZDTzBGQlFVRXNZVUZCVXl4TlFVRkxMRzlDUVVGTUxFTkJRVEJDTEV0QlFURkNMRU5CUVZRN1FVRkJRU3hMUVVGMlFqdEJRVU5FT3pzN08yMURRVVZqTEZVc1JVRkJXU3hQTEVWQlFWTTdRVUZEYkVNc1YwRkJTeXhYUVVGTUxFTkJRV2xDTEU5QlFXcENMRU5CUVhsQ0xGVkJRVU1zUjBGQlJDeEZRVUZUTzBGQlEyaERMRmxCUVVrc1VVRkJVU3hIUVVGU0xFTkJRVW9zUlVGQmEwSTdRVUZEYUVJc2NVSkJRVmNzUjBGQldDeEpRVUZyUWl4UlFVRlJMRWRCUVZJc1EwRkJiRUk3UVVGRFJEdEJRVU5HTEU5QlNrUTdPMEZCVFVFc1lVRkJUeXhWUVVGUU8wRkJRMFE3T3p0cFEwRkZXVHRCUVVOWUxHRkJRVThzUzBGQlN5eFBRVUZhTzBGQlEwUTdPenRwUTBGRldUdEJRVU5ZTEdGQlFVOHNTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJjRUk3UVVGRFJEczdPelJDUVVWUE8wRkJRMDRzWVVGQlR5eExRVUZMTEVWQlFWbzdRVUZEUkRzN08zRkRRVVZuUWl4UkxFVkJRVlU3UVVGQlFUczdRVUZEZWtJc1pVRkJVeXhQUVVGVUxFTkJRV2xDTzBGQlFVRXNaVUZCVnl4UFFVRkxMR1ZCUVV3c1EwRkJjVUlzVDBGQmNrSXNRMEZCV0R0QlFVRkJMRTlCUVdwQ08wRkJRMFE3T3p0dlEwRkZaU3hQTEVWQlFWTTdRVUZEZGtJc1kwRkJVU3hOUVVGU0xFTkJRV1VzWjBKQlFXWXNRMEZCWjBNc1VVRkJVU3hMUVVGNFF5eEZRVUVyUXl4TFFVRkxMR1ZCUVhCRU8wRkJRMEVzVjBGQlN5eHJRa0ZCVEN4RFFVRjNRaXhKUVVGNFFpeERRVUUyUWl4UFFVRTNRanRCUVVORU96czdlVU5CUlc5Q08wRkJRVUU3TzBGQlEyNUNMRmRCUVVzc2EwSkJRVXdzUTBGQmQwSXNUMEZCZUVJc1EwRkJaME1zVlVGQlF5eFBRVUZFTEVWQlFXRTdRVUZETTBNc1pVRkJTeXhwUWtGQlRDeERRVUYxUWl4UFFVRjJRanRCUVVORUxFOUJSa1E3UVVGSFJEczdPM05EUVVWcFFpeFBMRVZCUVZNN1FVRkRla0lzVlVGQlRTeDVRa0ZCZVVJc1MwRkJTeXhyUWtGQlRDeERRVU0xUWl4VFFVUTBRaXhEUVVOc1FqdEJRVUZCTEdWQlFVMHNSMEZCUnl4TlFVRklMRXRCUVdNc1VVRkJVU3hOUVVGMFFpeEpRVUZuUXl4SFFVRkhMRXRCUVVnc1MwRkJZU3hSUVVGUkxFdEJRVE5FTzBGQlFVRXNUMEZFYTBJc1EwRkJMMEk3TzBGQlIwRXNWVUZCU1N4NVFrRkJlVUlzUTBGQlF5eERRVUU1UWl4RlFVRnBRenRCUVVNdlFpeG5Ra0ZCVVN4TlFVRlNMRU5CUVdVc2JVSkJRV1lzUTBGQmJVTXNVVUZCVVN4TFFVRXpReXhGUVVGclJDeExRVUZMTEdWQlFYWkVPMEZCUTBFc1lVRkJTeXhyUWtGQlRDeERRVUYzUWl4TlFVRjRRaXhEUVVFclFpeHpRa0ZCTDBJc1JVRkJkVVFzUTBGQmRrUTdRVUZEUkN4UFFVaEVMRTFCUjA4N1FVRkRUQ3huUWtGQlVTeExRVUZTTERKRFFVRnpSQ3hSUVVGUkxFMUJRVGxFTEhGQ1FVRnZSaXhSUVVGUkxFdEJRVFZHTzBGQlEwUTdRVUZEUmpzN08ybERRVVZaTEZNc1JVRkJhVVE3UVVGQlFTeFZRVUYwUXl4TlFVRnpReXgxUlVGQk4wSXNSVUZCTmtJN1FVRkJRU3hWUVVGNlFpeGxRVUY1UWl4MVJVRkJVQ3hMUVVGUE96dEJRVU0xUkN4VlFVRkpMRTlCUVU4c1UwRkJVQ3hMUVVGeFFpeFJRVUY2UWl4RlFVRnRRenRCUVVOcVF5eGpRVUZOTEVsQlFVa3NTMEZCU2l4RFFVRlZMRGhDUVVGV0xFTkJRVTQ3UVVGRFJEczdRVUZGUkN4VlFVRkpMRXRCUVVzc1ZVRkJWQ3hGUVVGeFFqdEJRVU51UWl4WlFVRkpMR05CUVdNc2FVSkJRVTBzU1VGQmVFSXNSVUZCT0VJN1FVRkROVUlzY1VOQlFXbENMRWRCUVdwQ0xFTkJRWEZDTEVsQlFYSkNPMEZCUTBRc1UwRkdSQ3hOUVVWUExFbEJRVWtzWTBGQll5eHBRa0ZCVFN4SlFVRjRRaXhGUVVFNFFqdEJRVU51UXl4eFEwRkJhVUlzVFVGQmFrSXNRMEZCZDBJc1NVRkJlRUk3UVVGRFJEdEJRVU5HT3p0QlFVVkVPMEZCUTBFc1ZVRkJUU3hyUWtGQmEwSXNWVUZCVlN4TFFVRldMRU5CUVdkQ0xFZEJRV2hDTEVWQlFYRkNMRTFCUVhKQ0xFTkJRVFJDTEZWQlFVTXNSMEZCUkN4RlFVRk5MRTlCUVU0c1JVRkJaU3hMUVVGbUxFVkJRWGxDTzBGQlF6TkZMRmxCUVVrc1ZVRkJWU3hEUVVGa0xFVkJRV2xDTzBGQlEyWXNhVUpCUVU4c1QwRkJVRHRCUVVORU96dEJRVVZFTEdWQlFVOHNUVUZCVFN4UlFVRlJMRTFCUVZJc1EwRkJaU3hEUVVGbUxFVkJRV3RDTEZkQlFXeENMRVZCUVU0c1IwRkJkME1zVVVGQlVTeExRVUZTTEVOQlFXTXNRMEZCWkN4RFFVRXZRenRCUVVORUxFOUJUblZDTEVOQlFYaENPenRCUVZGQkxGVkJRVTBzZDBKQlFYTkNMR2RDUVVGblFpeE5RVUZvUWl4RFFVRjFRaXhEUVVGMlFpeEZRVUV3UWl4WFFVRXhRaXhGUVVGMFFpeEhRVUZuUlN4blFrRkJaMElzUzBGQmFFSXNRMEZCYzBJc1EwRkJkRUlzUTBGQmRFVTdPMEZCUlVFN1FVRkRRU3hWUVVGSkxFOUJRVThzUzBGQlN5eFBRVUZNTEVOQlFXRXNaVUZCWWl4RFFVRlFMRXRCUVhsRExGVkJRVGRETEVWQlFYbEVPMEZCUTNaRUxHRkJRVXNzVDBGQlRDeERRVUZoTEdWQlFXSXNSVUZCT0VJc1MwRkJPVUlzUTBGQmIwTXNTVUZCY0VNc1JVRkJNRU1zUTBGQlF5eE5RVUZFTEVOQlFURkRPMEZCUTBRN08wRkJSVVFzVlVGQlNTeFBRVUZQTEV0QlFVc3NUMEZCVEN4RFFVRmhMR05CUVdJc1EwRkJVQ3hMUVVGM1F5eFZRVUUxUXl4RlFVRjNSRHRCUVVOMFJDeGhRVUZMTEU5QlFVd3NRMEZCWVN4alFVRmlMRVZCUVRaQ0xFdEJRVGRDTEVOQlFXMURMRWxCUVc1RExFVkJRWGxETEVOQlFVTXNUVUZCUkN4RFFVRjZRenRCUVVORU96dEJRVVZFTEZWQlFVa3NaVUZCU2l4RlFVRnhRanRCUVVOdVFqdEJRVU5FT3p0QlFVVkVPMEZCUTBFc1ZVRkJTU3hMUVVGTExFOUJRVXdzUTBGQllTeFBRVUZxUWl4RlFVRXdRanRCUVVONFFpdzBRMEZCY1VJc1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQmJFTXNSVUZCTWtNc1UwRkJNME1zUlVGQmMwUXNTMEZCU3l4SlFVRXpSQ3hGUVVGcFJTeE5RVUZxUlR0QlFVTkVMRTlCUmtRc1RVRkZUenRCUVVOTUxESkRRVUZ2UWl4VFFVRndRaXhGUVVFclFpeExRVUZMTEVsQlFYQkRMRVZCUVRCRExFMUJRVEZETzBGQlEwUTdRVUZEUmpzN08yOURRVVZsTzBGQlEyUXNWVUZCU1N4TFFVRkxMRmRCUVV3c1EwRkJhVUlzVFVGQmFrSXNSMEZCTUVJc1EwRkJPVUlzUlVGQmFVTTdRVUZETDBJc2JVUkJRVzlDTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdwRExFVkJRVEJETEV0QlFVc3NUMEZCTDBNc1JVRkJkMFFzUzBGQlN5eFhRVUUzUkR0QlFVTkVPMEZCUTBZN096dHZRMEZGWlR0QlFVTmtMRlZCUVUwc1ZVRkJWU3hQUVVGUExFMUJRVkFzUTBGQll5eEZRVUZrTEVWQlFXdENMRXRCUVVzc1QwRkJka0lzUTBGQmFFSTdRVUZEUVN4aFFVRlBMREpEUVVGdlFpeExRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRnFReXhGUVVFd1F5eFBRVUV4UXl4RlFVRnRSQ3hMUVVGTExGZEJRWGhFTEVOQlFWQTdRVUZEUkRzN1FVRkZSRHM3T3pzN096czdjME5CUzJ0Q08wRkJRMmhDTEdGQlFVOHNTMEZCU3l4VlFVRk1MRWxCUVcxQ0xFTkJRVU1zTWtKQlFXbENMRkZCUVdwQ0xFTkJRVEJDTEVsQlFURkNMRU5CUVROQ08wRkJRMFE3T3p0NVEwRkZiMElzU3l4RlFVRlBPMEZCUXpGQ0xGVkJRVWtzUzBGQlN5eGxRVUZNTEVWQlFVb3NSVUZCTkVJN1FVRkRNVUk3UVVGRFJEczdRVUZGUkN4WFFVRkxMR05CUVV3c1EwRkJiMElzUzBGQmNFSTdRVUZEUkRzN08yMURRVVZqTEVzc1JVRkJUenRCUVVOd1FqdEJRVU5FT3pzN2EwTkJSVzlDTEdNc1JVRkJaMElzVHl4RlFVRlRPMEZCUXpWRExHRkJRVThzU1VGQlNTeGpRVUZLTEVOQlFXMUNMRTlCUVc1Q0xFTkJRVkE3UVVGRFJEczdPenM3TzJ0Q1FXNU1hMElzVXpzN096czdPenM3T3pzN1VVTlNUQ3h0UWl4SFFVRkJMRzFDTzFGQmQwSkJMRzFDTEVkQlFVRXNiVUk3TzBGQkwwSm9RaXhKUVVGTkxHVkJRV1VzVTBGQlppeFpRVUZsTEVOQlFVTXNTMEZCUkN4RlFVRlJMRTFCUVZJc1JVRkJiVUk3UVVGRGRFTXNUVUZCU1N4VlFVRlZMRVZCUVdRc1JVRkJhMEk3UVVGRGFFSXNjVUpCUVdVc1RVRkJaanRCUVVORU8wRkJRMFFzYlVKQlFXVXNTMEZCWml4VFFVRjNRaXhOUVVGNFFqdEJRVU5FTEVOQlRFUTdPMEZCVDA4c1UwRkJVeXh0UWtGQlZDeERRVUUyUWl4UFFVRTNRaXhGUVVGdFJUdEJRVUZCTEUxQlFUZENMRWRCUVRaQ0xIVkZRVUYyUWl4RlFVRjFRanRCUVVGQkxFMUJRVzVDTEV0QlFXMUNPMEZCUVVFc1RVRkJXaXhMUVVGWkxIVkZRVUZLTEVWQlFVazdPMEZCUTNoRkxFMUJRVTBzVDBGQlR5eFBRVUZQTEVsQlFWQXNRMEZCV1N4SFFVRmFMRU5CUVdJN08wRkJSVUVzVDBGQlN5eFBRVUZNTEVOQlFXRXNWVUZCUXl4SFFVRkVMRVZCUVZNN1FVRkRjRUlzVVVGQlNTeFZRVUZWTEVWQlFWWXNTVUZCWjBJc1RVRkJUU3hQUVVGT0xFTkJRV01zUjBGQlpDeE5RVUYxUWl4RFFVRkRMRU5CUVRWRExFVkJRU3RETzBGQlF6ZERPMEZCUTBFN1FVRkRSRHM3UVVGRlJDeFJRVUZKTEZGQlFVOHNTVUZCU1N4SFFVRktMRU5CUVZBc1RVRkJiMElzVVVGQmNFSXNTVUZCWjBNc1NVRkJTU3hIUVVGS0xFMUJRV0VzU1VGQmFrUXNSVUZCZFVRN1FVRkRja1FzVlVGQlNTeFhRVUZYTEVkQlFXWTdRVUZEUVN4VlFVRkpMRlZCUVZVc1JVRkJaQ3hGUVVGclFqdEJRVU5vUWl4dFFrRkJZeXhMUVVGa0xGTkJRWFZDTEVkQlFYWkNPMEZCUTBRN08wRkJSVVFzTUVKQlFXOUNMRTlCUVhCQ0xFVkJRVFpDTEVsQlFVa3NSMEZCU2l4RFFVRTNRaXhGUVVGMVF5eExRVUYyUXl4RlFVRTRReXhSUVVFNVF6dEJRVU5CTzBGQlEwUTdPMEZCUlVRc1VVRkJUU3hQUVVGUExHRkJRV0VzUzBGQllpeEZRVUZ2UWl4SFFVRndRaXhEUVVGaU8wRkJRMEVzV1VGQlVTeFpRVUZTTEVOQlFYRkNMRWxCUVhKQ0xFVkJRVEpDTEVsQlFVa3NSMEZCU2l4RFFVRXpRanRCUVVORUxFZEJiRUpFTzBGQmJVSkVPenRCUVVWTkxGTkJRVk1zYlVKQlFWUXNRMEZCTmtJc1QwRkJOMElzUlVGQmJVVTdRVUZCUVN4TlFVRTNRaXhIUVVFMlFpeDFSVUZCZGtJc1JVRkJkVUk3UVVGQlFTeE5RVUZ1UWl4TFFVRnRRanRCUVVGQkxFMUJRVm9zUzBGQldTeDFSVUZCU2l4RlFVRkpPenRCUVVONFJTeE5RVUZOTEZOQlFWTXNUMEZCVHl4TlFVRlFMRU5CUVdNc1JVRkJaQ3hGUVVGclFpeEhRVUZzUWl4RFFVRm1PMEZCUTBFc1RVRkJUU3hQUVVGUExFOUJRVThzU1VGQlVDeERRVUZaTEVkQlFWb3NRMEZCWWpzN1FVRkZRU3hQUVVGTExFOUJRVXdzUTBGQllTeFZRVUZETEVkQlFVUXNSVUZCVXp0QlFVTndRaXhSUVVGSkxGVkJRVlVzUlVGQlZpeEpRVUZuUWl4TlFVRk5MRTlCUVU0c1EwRkJZeXhIUVVGa0xFMUJRWFZDTEVOQlFVTXNRMEZCTlVNc1JVRkJLME03UVVGRE4wTTdRVUZEUVR0QlFVTkVPenRCUVVWRUxGRkJRVWtzU1VGQlNTeEhRVUZLTEUxQlFXRXNTVUZCWWl4SlFVRnhRaXhKUVVGSkxFZEJRVW9zUlVGQlV5eFhRVUZVTEV0QlFYbENMRTFCUVd4RUxFVkJRVEJFTzBGQlEzaEVMRlZCUVVrc1YwRkJWeXhIUVVGbU8wRkJRMEVzVlVGQlNTeFZRVUZWTEVWQlFXUXNSVUZCYTBJN1FVRkRhRUlzYlVKQlFXTXNTMEZCWkN4VFFVRjFRaXhIUVVGMlFqdEJRVU5FT3p0QlFVVkVMR0ZCUVU4c1IwRkJVQ3hKUVVGakxHOUNRVUZ2UWl4UFFVRndRaXhGUVVFMlFpeEpRVUZKTEVkQlFVb3NRMEZCTjBJc1JVRkJkVU1zUzBGQmRrTXNSVUZCT0VNc1VVRkJPVU1zUTBGQlpEdEJRVU5CTzBGQlEwUTdPMEZCUlVRN1FVRkRRU3hSUVVGSkxGRkJRVkVzU1VGQlNTeEhRVUZLTEVOQlFWb3NRMEZxUW05Q0xFTkJhVUpETzBGQlEzSkNMRkZCUVUwc1kwRkJZeXhMUVVGa0xIbERRVUZqTEV0QlFXUXNRMEZCVGp0QlFVTkJMRkZCUVUwc1QwRkJUeXhoUVVGaExFdEJRV0lzUlVGQmIwSXNSMEZCY0VJc1EwRkJZanRCUVVOQkxGRkJRVTBzV1VGQldTeFJRVUZSTEZsQlFWSXNRMEZCY1VJc1NVRkJja0lzUTBGQmJFSTdPMEZCUlVFc1VVRkJTU3hqUVVGakxFbEJRV3hDTEVWQlFYZENPMEZCUTNSQ0xGVkJRVWtzVTBGQlV5eFRRVUZpTEVWQlFYZENPMEZCUTNSQ08wRkJRMEVzWjBKQlFWRXNZMEZCWXl4TlFVRjBRanRCUVVORUxFOUJTRVFzVFVGSFR5eEpRVUZKTEVOQlFVTXNUVUZCVFN4VFFVRk9MRU5CUVV3c1JVRkJkVUk3UVVGRE5VSXNaMEpCUVZFc1UwRkJVeXhUUVVGVUxFVkJRVzlDTEVWQlFYQkNMRU5CUVZJN1FVRkRSQ3hQUVVaTkxFMUJSVUU3UVVGRFRDeG5Ra0ZCVVN4VFFVRlNPMEZCUTBRN1FVRkRSanM3UVVGRlJDeFhRVUZQTEVkQlFWQXNTVUZCWXl4TFFVRmtPMEZCUTBRc1IwRnNRMFE3TzBGQmIwTkJMRk5CUVU4c1RVRkJVRHRCUVVORU96dEJRVVZFTEVsQlFVMHNVVUZCVVN4RlFVRmtPenRyUWtGRlpUdEJRVU5pTEV0QlJHRXNaVUZEVkN4VFFVUlRMRVZCUTBVN1FVRkRZaXhWUVVGTkxFbEJRVTRzUTBGQlZ5eFRRVUZZTzBGQlEwUXNSMEZJV1R0QlFVbGlMRkZCU21Fc2EwSkJTVTRzVTBGS1RTeEZRVWxMTzBGQlEyaENMRkZCUVUwc1VVRkJVU3hOUVVGTkxGTkJRVTRzUTBGQlowSTdRVUZCUVN4aFFVRkxMRTlCUVU4c1JVRkJVQ3hEUVVGVkxGTkJRVllzUlVGQmNVSXNRMEZCY2tJc1EwRkJURHRCUVVGQkxFdEJRV2hDTEVOQlFXUTdRVUZEUVN4UlFVRkpMRkZCUVZFc1EwRkJReXhEUVVGaUxFVkJRV2RDTzBGQlEyUXNXVUZCVFN4TlFVRk9MRU5CUVdFc1MwRkJZaXhGUVVGdlFpeERRVUZ3UWp0QlFVTkVPMEZCUTBZc1IwRlVXVHRCUVZWaUxGVkJWbUVzYjBKQlZVb3NVMEZXU1N4RlFWVlBPMEZCUTJ4Q0xGZEJRVThzVFVGQlRTeE5RVUZPTEV0QlFXbENMRU5CUVdwQ0xFbEJRWE5DTEU5QlFVOHNSVUZCVUN4RFFVRlZMRTFCUVUwc1RVRkJUU3hOUVVGT0xFZEJRV1VzUTBGQmNrSXNRMEZCVml4RlFVRnRReXhUUVVGdVF5eERRVUUzUWp0QlFVTkVPMEZCV2xrc1F6czdPenM3T3pzN096czdPenRCUTNoRlpqczdPenRCUVVOQk96czdPMEZCUTBFN096czdPenM3T3l0bFFWQkJPenM3T3pzN08wRkJVMEVzU1VGQlRTeFRRVUZWTEZsQlFVMDdRVUZEY0VJN096czdPenRCUVUxQkxFMUJRVTBzVDBGQlR5eFJRVUZpTzBGQlEwRXNUVUZCVFN4VlFVRlZMRTlCUVdoQ08wRkJRMEVzVFVGQlRTeHZRa0ZCYjBJc2FVSkJRVEZDTzBGQlEwRXNUVUZCVFN4eFFrRkJjVUk3UVVGRGVrSXNZVUZCVXl4SlFVUm5RanRCUVVWNlFpeFhRVUZQTEVsQlJtdENPMEZCUjNwQ0xHRkJRVk1zU1VGSVowSTdRVUZKZWtJc1owSkJRVms3UVVGS1lTeEhRVUV6UWp0QlFVMUJMRTFCUVUwc2QwSkJRWGRDTEVOQlF6VkNMRmxCUkRSQ0xFTkJRVGxDT3p0QlFVbEJPenM3T3pzN1FVRndRbTlDTEUxQk1FSmtMRTFCTVVKak8wRkJRVUU3TzBGQk5FSnNRaXh6UWtGQk1FSTdRVUZCUVN4VlFVRmtMRTlCUVdNc2RVVkJRVW9zUlVGQlNUczdRVUZCUVRzN1FVRkJRU3hyU0VGRGJFSXNTVUZFYTBJc1JVRkRXaXhQUVVSWkxFVkJRMGdzYTBKQlJFY3NSVUZEYVVJc1QwRkVha0lzUlVGRE1FSXNjVUpCUkRGQ0xFVkJRMmxFTEVsQlJHcEVMRVZCUTNWRUxFbEJSSFpFT3p0QlFVZDRRaXhaUVVGTExGRkJRVXdzUjBGQlowSXNTMEZEYUVJc2EwUkJSR2RDTEVkQlJXUXNORU5CUm1Nc1IwRkhXaXc0UWtGSVdTeEhRVWxXTERaQ1FVcFZMRWRCUzFJc1owTkJURkVzUjBGTlZpeFJRVTVWTEVkQlQxWXNNa0pCVUZVc1IwRlJVaXhUUVZKUkxFZEJVMVlzVVVGVVZTeEhRVlZXTERaQ1FWWlZMRWRCVjFJc2FVWkJXRkVzUjBGWlZpeFJRVnBWTEVkQllWb3NVVUZpV1N4SFFXTmtMRkZCWkdNc1IwRmxhRUlzVVVGbVFUczdRVUZwUWtFc1ZVRkJTU3hOUVVGTExHTkJRVlFzUlVGQmVVSTdRVUZEZGtJc1kwRkJTeXhMUVVGTU8wRkJRMFE3UVVGMFFuVkNPMEZCZFVKNlFqczdRVUZ1UkdsQ08wRkJRVUU3UVVGQlFTdzRRa0Z4UkZZN1FVRkRUaXhaUVVGTkxGVkJRVlVzVTBGQlV5eGhRVUZVTEVOQlFYVkNMRXRCUVhaQ0xFTkJRV2hDT3p0QlFVVkJMR2RDUVVGUkxGTkJRVklzUjBGQmIwSXNTMEZCU3l4UlFVRjZRanM3UVVGRlFTeGhRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRWRCUVhWQ0xGRkJRVkVzVlVGQkwwSTdPMEZCUlVFN1FVRkRRU3haUVVGSkxFdEJRVXNzVDBGQlRDeERRVUZoTEV0QlFXSXNTMEZCZFVJc1NVRkJNMElzUlVGQmFVTTdRVUZETDBJc1pVRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4aFFVRnlRaXhEUVVGdFF5eGxRVUZ1UXl4RlFVRnZSQ3hUUVVGd1JDeEhRVUZuUlN4TFFVRkxMRTlCUVV3c1EwRkJZU3hMUVVFM1JUdEJRVU5FT3p0QlFVVkVPMEZCUTBFc1dVRkJTU3hMUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEV0QlFYbENMRWxCUVRkQ0xFVkJRVzFETzBGQlEycERMR1ZCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNZVUZCY2tJc1EwRkJiVU1zWTBGQmJrTXNSVUZCYlVRc1ZVRkJia1FzUTBGQk9FUXNVMEZCT1VRc1IwRkJNRVVzUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCZGtZN1FVRkRSRHM3UVVGRlJDeHBRa0ZCVXl4SlFVRlVMRU5CUVdNc1YwRkJaQ3hEUVVFd1FpeExRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRjJRenM3UVVGRlFTeGhRVUZMTEdGQlFVdzdRVUZEUkR0QlFYcEZhVUk3UVVGQlFUdEJRVUZCTEhORFFUSkZSanRCUVVOa0xGbEJRVTBzVjBGQlZ5eFRRVUZUTEdGQlFWUXNRMEZCZFVJc1MwRkJka0lzUTBGQmFrSTdRVUZEUVN4cFFrRkJVeXhaUVVGVUxFTkJRWE5DTEZOQlFYUkNMRVZCUVdsRExFdEJRVXNzUlVGQmRFTTdRVUZEUVN4cFFrRkJVeXhUUVVGVUxFTkJRVzFDTEVkQlFXNUNMRU5CUVhWQ0xHbENRVUYyUWpzN1FVRkZRU3hwUWtGQlV5eEpRVUZVTEVOQlFXTXNWMEZCWkN4RFFVRXdRaXhSUVVFeFFqdEJRVU5FTzBGQmFrWnBRanRCUVVGQk8wRkJRVUVzYjBOQmJVWktPMEZCUTFvc1pVRkJUeXhUUVVGVExHRkJRVlFzVDBGQk1rSXNhVUpCUVROQ0xHdENRVUY1UkN4TFFVRkxMRVZCUVRsRUxGRkJRVkE3UVVGRFJEdEJRWEpHYVVJN1FVRkJRVHRCUVVGQkxDdENRWFZHVkR0QlFVTlFMRmxCUVUwc1owSkJRV2RDTEU5QlFVOHNaMEpCUVZBc1EwRkJkMElzUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCY2tNc1EwRkJkRUk3UVVGRFFUdEJRVU5CTEZsQlFVMHNVMEZCVXl4alFVRmpMRTFCUVdRc1EwRkJjVUlzUzBGQmNrSXNRMEZCTWtJc1EwRkJNMElzUlVGQk9FSXNZMEZCWXl4TlFVRmtMRU5CUVhGQ0xFMUJRWEpDTEVkQlFUaENMRU5CUVRWRUxFTkJRV1k3TzBGQlJVRXNXVUZCVFN4TlFVRlBMRTlCUVU4c1YwRkJVQ3hIUVVGeFFpeERRVUYwUWl4SFFVRTBRaXhUUVVGVExFTkJRV3BFTzBGQlEwRXNZVUZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeExRVUZ5UWl4RFFVRXlRaXhIUVVFelFpeEhRVUZ2UXl4SFFVRndRenRCUVVORU8wRkJPVVpwUWp0QlFVRkJPMEZCUVVFc05rSkJaMGRZTzBGQlFVRTdPMEZCUTB3c1dVRkJTU3hMUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEV0QlFYbENMRWxCUVRkQ0xFVkJRVzFETzBGQlEycERPMEZCUTBFc1pVRkJTeXhMUVVGTU8wRkJRMFE3TzBGQlJVUXNXVUZCU1N4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEZOQlFYSkNMRU5CUVN0Q0xGRkJRUzlDTEVOQlFYZERMRTFCUVhoRExFTkJRVW9zUlVGQmNVUTdRVUZEYmtRc2FVSkJRVThzUzBGQlVEdEJRVU5FT3p0QlFVVkVPMEZCUTBFc2JVSkJRVmNzV1VGQlRUdEJRVU5tTEdsQ1FVRkxMRmxCUVV3c1EwRkJhMElzYVVKQlFVMHNTVUZCZUVJN1FVRkRRU3hwUWtGQlN5eGhRVUZNT3p0QlFVVkJMR05CUVUwc1ZVRkJWU3hUUVVGV0xFOUJRVlVzUjBGQlRUdEJRVU53UWl4dFFrRkJTeXhaUVVGTUxFTkJRV3RDTEdsQ1FVRk5MRXRCUVhoQ08wRkJRMEVzYlVKQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzYlVKQlFYSkNMRU5CUVhsRExHbENRVUZOTEdOQlFTOURMRVZCUVN0RUxFOUJRUzlFT3p0QlFVVkJPMEZCUTBFc2JVSkJRVXNzV1VGQlREdEJRVU5FTEZkQlRrUTdPMEZCVVVFc2FVSkJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1owSkJRWEpDTEVOQlFYTkRMR2xDUVVGTkxHTkJRVFZETEVWQlFUUkVMRTlCUVRWRU96dEJRVVZCTEdsQ1FVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEZOQlFYSkNMRU5CUVN0Q0xFZEJRUzlDTEVOQlFXMURMRTFCUVc1RE96dEJRVVZCTEdsQ1FVRkxMRTFCUVV3N1FVRkRSQ3hUUVdwQ1JDeEZRV2xDUnl4RlFXcENTRHM3UVVGdFFrRXNaVUZCVHl4SlFVRlFPMEZCUTBRN1FVRXZTR2xDTzBGQlFVRTdRVUZCUVN4eFEwRnBTVWdzUzBGcVNVY3NSVUZwU1VrN1FVRkRjRUlzV1VGQlNTeE5RVUZOTEVsQlFVNHNTMEZCWlN4UFFVRm1MRWxCUVRCQ0xFMUJRVTBzVDBGQlRpeExRVUZyUWl4RlFVRTFReXhKUVVGclJDeE5RVUZOTEU5QlFVNHNTMEZCYTBJc1JVRkJlRVVzUlVGQk5FVTdRVUZETVVVN1FVRkRSRHM3UVVGRlJEdEJRVU5CTEdGQlFVc3NTVUZCVER0QlFVTkVPMEZCZUVscFFqdEJRVUZCTzBGQlFVRXNOa0pCTUVsWU8wRkJRVUU3TzBGQlEwd3NXVUZCU1N4RFFVRkRMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNVMEZCY2tJc1EwRkJLMElzVVVGQkwwSXNRMEZCZDBNc1RVRkJlRU1zUTBGQlRDeEZRVUZ6UkR0QlFVTndSQ3hwUWtGQlR5eExRVUZRTzBGQlEwUTdPMEZCUlVRc1lVRkJTeXhaUVVGTUxFTkJRV3RDTEdsQ1FVRk5MRWxCUVhoQ096dEJRVVZCTEdGQlFVc3NXVUZCVERzN1FVRkZRU3hoUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRk5CUVhKQ0xFTkJRU3RDTEVkQlFTOUNMRU5CUVcxRExFMUJRVzVETzBGQlEwRXNZVUZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFRRVUZ5UWl4RFFVRXJRaXhOUVVFdlFpeERRVUZ6UXl4TlFVRjBRenM3UVVGRlFTeFpRVUZOTEZkQlFWY3NTMEZCU3l4WFFVRk1MRVZCUVdwQ096dEJRVVZCTEZsQlFVMHNWMEZCVnl4VFFVRllMRkZCUVZjc1IwRkJUVHRCUVVOeVFpeHRRa0ZCVXl4SlFVRlVMRU5CUVdNc1YwRkJaQ3hEUVVFd1FpeFJRVUV4UWpzN1FVRkZRU3hwUWtGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhUUVVGeVFpeERRVUVyUWl4TlFVRXZRaXhEUVVGelF5eE5RVUYwUXpzN1FVRkZRU3hwUWtGQlN5eFpRVUZNTEVOQlFXdENMR2xDUVVGTkxFMUJRWGhDT3p0QlFVVkJMRzFDUVVGVExHMUNRVUZVTEVOQlFUWkNMR2xDUVVGTkxHTkJRVzVETEVWQlFXMUVMRkZCUVc1RU96dEJRVVZCTzBGQlEwRXNZMEZCU1N4UFFVRkxMR05CUVZRc1JVRkJlVUk3UVVGRGRrSXNjVUpCUVZNc1NVRkJWQ3hEUVVGakxGZEJRV1FzUTBGQk1FSXNUMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJka003UVVGRFFTeHRRa0ZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhIUVVGMVFpeEpRVUYyUWp0QlFVTkVPMEZCUTBZc1UwRmtSRHM3UVVGblFrRXNhVUpCUVZNc1owSkJRVlFzUTBGQk1FSXNhVUpCUVUwc1kwRkJhRU1zUlVGQlowUXNVVUZCYUVRN1FVRkRRU3hwUWtGQlV5eFRRVUZVTEVOQlFXMUNMRWRCUVc1Q0xFTkJRWFZDTEZOQlFYWkNPenRCUVVWQkxHVkJRVThzU1VGQlVEdEJRVU5FTzBGQk5VdHBRanRCUVVGQk8wRkJRVUVzY1VOQk9FdElPMEZCUVVFN08wRkJRMklzV1VGQlRTeHBRa0ZCYVVJc1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4blFrRkJja0lzUTBGQmMwTXNaMEpCUVhSRExFTkJRWFpDTzBGQlEwRXNXVUZCU1N4alFVRktMRVZCUVc5Q08wRkJRMnhDTEhsQ1FVRmxMRTlCUVdZc1EwRkJkVUk3UVVGQlFTeHRRa0ZCVlN4UFFVRkxMR1ZCUVV3c1EwRkJjVUlzUlVGQlJTeFJRVUZSTEUxQlFWWXNSVUZCYTBJc1QwRkJUeXhQUVVGNlFpeEZRVUZ5UWl4RFFVRldPMEZCUVVFc1YwRkJka0k3UVVGRFJEczdRVUZGUkR0QlFVTkJPMEZCUTBFN1FVRkRRU3haUVVGSkxFdEJRVXNzVDBGQlRDeERRVUZoTEZWQlFXcENMRVZCUVRaQ08wRkJRek5DTEdOQlFVMHNWMEZCVnl4TFFVRkxMRmRCUVV3c1JVRkJha0k3UVVGRFFTeGxRVUZMTEdWQlFVd3NRMEZCY1VJc1JVRkJSU3hSUVVGUkxGRkJRVllzUlVGQmIwSXNUMEZCVHl4cFFrRkJUU3hMUVVGcVF5eEZRVUZ5UWp0QlFVTkJMR1ZCUVVzc1pVRkJUQ3hEUVVGeFFpeEZRVUZGTEZGQlFWRXNVVUZCVml4RlFVRnZRaXhQUVVGUExFOUJRVE5DTEVWQlFYSkNPMEZCUTBRN1FVRkRSanRCUVRWTWFVSTdRVUZCUVR0QlFVRkJMSEZEUVRoTVNEdEJRVUZCT3p0QlFVTmlMRmxCUVUwc2FVSkJRV2xDTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzWjBKQlFYSkNMRU5CUVhORExHZENRVUYwUXl4RFFVRjJRanRCUVVOQkxGbEJRVWtzWTBGQlNpeEZRVUZ2UWp0QlFVTnNRaXg1UWtGQlpTeFBRVUZtTEVOQlFYVkNPMEZCUVVFc2JVSkJRVlVzVDBGQlN5eHBRa0ZCVEN4RFFVRjFRaXhGUVVGRkxGRkJRVkVzVFVGQlZpeEZRVUZyUWl4UFFVRlBMRTlCUVhwQ0xFVkJRWFpDTEVOQlFWWTdRVUZCUVN4WFFVRjJRanRCUVVORU96dEJRVVZFTEZsQlFVa3NTMEZCU3l4UFFVRk1MRU5CUVdFc1ZVRkJha0lzUlVGQk5rSTdRVUZETTBJc1kwRkJUU3hYUVVGWExFdEJRVXNzVjBGQlRDeEZRVUZxUWp0QlFVTkJMR1ZCUVVzc2FVSkJRVXdzUTBGQmRVSXNSVUZCUlN4UlFVRlJMRkZCUVZZc1JVRkJiMElzVDBGQlR5eHBRa0ZCVFN4TFFVRnFReXhGUVVGMlFqdEJRVU5CTEdWQlFVc3NhVUpCUVV3c1EwRkJkVUlzUlVGQlJTeFJRVUZSTEZGQlFWWXNSVUZCYjBJc1QwRkJUeXhQUVVFelFpeEZRVUYyUWp0QlFVTkVPMEZCUTBZN1FVRjZUV2xDTzBGQlFVRTdRVUZCUVN4dlEwRXlUVWNzVDBFelRVZ3NSVUV5VFZrN1FVRkROVUlzZVVkQlFUSkNMRTFCUVROQ0xFVkJRVzFETEU5QlFXNURPMEZCUTBRN1FVRTNUV2xDT3p0QlFVRkJPMEZCUVVFN08wRkJaMDV3UWpzN096czdPenRCUVV0QkxFMUJRVTBzWVVGQllTeEZRVUZ1UWpzN1FVRkZRU3hOUVVGTkxGVkJRVlVzVTBGQlV5eG5Ra0ZCVkN4UFFVRTRRaXhKUVVFNVFpeERRVUZvUWp0QlFVTkJMRTFCUVVrc1QwRkJTaXhGUVVGaE8wRkJRMWdzV1VGQlVTeFBRVUZTTEVOQlFXZENMRlZCUVVNc1QwRkJSQ3hGUVVGaE8wRkJRek5DTEZWQlFVMHNVMEZCVXl3eVEwRkJiMElzVDBGQmNFSXNSVUZCTmtJc2EwSkJRVGRDTEVWQlFXbEVMSEZDUVVGcVJDeERRVUZtTzBGQlEwRXNZVUZCVHl4UFFVRlFMRWRCUVdsQ0xFOUJRV3BDT3p0QlFVVkJMR2xDUVVGWExFbEJRVmdzUTBGQlowSXNSVUZCUlN4blFrRkJSaXhGUVVGWExGRkJRVkVzU1VGQlNTeE5RVUZLTEVOQlFWY3NUVUZCV0N4RFFVRnVRaXhGUVVGb1FqdEJRVU5FTEV0QlRFUTdRVUZOUkRzN1FVRkZSQ3hOUVVGSkxFOUJRVW9zUlVGQllUdEJRVU5ZTEdGQlFWTXNaMEpCUVZRc1EwRkJNRUlzVDBGQk1VSXNSVUZCYlVNc1ZVRkJReXhMUVVGRUxFVkJRVmM3UVVGRE5VTXNWVUZCVFN4cFFrRkJhVUlzVFVGQlRTeE5RVUZPTEVOQlFXRXNXVUZCWWl4RFFVRXdRaXhoUVVFeFFpeERRVUYyUWp0QlFVTkJMRlZCUVVrc2EwSkJRV3RDTEcxQ1FVRnRRaXhKUVVGNlF5eEZRVUVyUXp0QlFVTTNReXhaUVVGTkxFdEJRVXNzVFVGQlRTeE5RVUZPTEVOQlFXRXNXVUZCWWl4RFFVRXdRaXhoUVVFeFFpeERRVUZZTzBGQlEwRXNXVUZCVFN4VlFVRlZMRk5CUVZNc1lVRkJWQ3hEUVVGMVFpeEZRVUYyUWl4RFFVRm9RanM3UVVGRlFTeFpRVUZOTEZsQlFWa3NWMEZCVnl4SlFVRllMRU5CUVdkQ08wRkJRVUVzYVVKQlFVc3NSVUZCUlN4UFFVRkdMRXRCUVdNc1QwRkJia0k3UVVGQlFTeFRRVUZvUWl4RFFVRnNRanM3UVVGRlFTeFpRVUZKTEVOQlFVTXNVMEZCVEN4RlFVRm5RanRCUVVOa08wRkJRMFE3TzBGQlJVUXNZMEZCVFN4TlFVRk9MRU5CUVdFc1NVRkJZanM3UVVGRlFTeHJRa0ZCVlN4TlFVRldMRU5CUVdsQ0xFbEJRV3BDTzBGQlEwUTdRVUZEUml4TFFXaENSRHRCUVdsQ1JEczdRVUZGUkN4VFFVRlBMRTFCUVZBN1FVRkRSQ3hEUVhSUVl5eEZRVUZtT3p0clFrRjNVR1VzVFRzN096czdPenM3T3pzN096dEJRelZRWmpzN096dEJRVU5CT3pzN08wRkJRMEU3TzBGQlEwRTdPenM3T3pzN095dGxRVkpCT3pzN096czdPMEZCVlVFc1NVRkJUU3hYUVVGWkxGbEJRVTA3UVVGRGRFSTdPenM3T3p0QlFVMUJMRTFCUVUwc1QwRkJUeXhWUVVGaU8wRkJRMEVzVFVGQlRTeFZRVUZWTEU5QlFXaENPMEZCUTBFc1RVRkJUU3h4UWtGQmNVSTdRVUZEZWtJc1lVRkJVeXhKUVVSblFqdEJRVVY2UWl4aFFVRlRPMEZCUm1kQ0xFZEJRVE5DTzBGQlNVRXNUVUZCVFN4M1FrRkJkMElzUTBGRE5VSXNVMEZFTkVJc1EwRkJPVUk3TzBGQlNVRTdPenM3T3p0QlFXcENjMElzVFVGMVFtaENMRkZCZGtKblFqdEJRVUZCT3p0QlFYbENjRUlzZDBKQlFUQkNPMEZCUVVFc1ZVRkJaQ3hQUVVGakxIVkZRVUZLTEVWQlFVazdPMEZCUVVFN08wRkJRVUVzYzBoQlEyeENMRWxCUkd0Q0xFVkJRMW9zVDBGRVdTeEZRVU5JTEd0Q1FVUkhMRVZCUTJsQ0xFOUJSR3BDTEVWQlF6QkNMSEZDUVVReFFpeEZRVU5wUkN4TFFVUnFSQ3hGUVVOM1JDeExRVVI0UkRzN1FVRkhlRUlzVlVGQlRTeFhRVUZYTEUxQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzWVVGQmNrSXNRMEZCYlVNc2FVSkJRVzVETEVOQlFXcENPMEZCUTBFc1ZVRkJUU3hQUVVGUExFMUJRVXNzVjBGQlRDeERRVUZwUWl4UlFVRnFRaXhEUVVGaU96dEJRVVZCTEZsQlFVc3NWMEZCVEN4RFFVRnBRaXhMUVVGTExFdEJRWFJDTEVWQlFUWkNMRXRCUVVzc1NVRkJiRU1zUlVGQmQwTXNTMEZCZUVNN1FVRk9kMEk3UVVGUGVrSTdPMEZCYUVOdFFqdEJRVUZCTzBGQlFVRXNhME5CYTBOU0xFMUJiRU5STEVWQmEwTkJMRU5CUlc1Q08wRkJjRU50UWp0QlFVRkJPMEZCUVVFc2IwTkJjME54UXp0QlFVRkJMRmxCUVRkRExFdEJRVFpETEhWRlFVRnlReXhGUVVGeFF6dEJRVUZCTEZsQlFXcERMRWxCUVdsRExIVkZRVUV4UWl4SlFVRXdRanRCUVVGQkxGbEJRWEJDTEZkQlFXOUNMSFZGUVVGT0xFbEJRVTA3TzBGQlEzWkVMRmxCUVVrc1EwRkJReXhMUVVGTExFOUJRVXdzUTBGQllTeFBRVUZzUWl4RlFVRXlRanRCUVVONlFpeHBRa0ZCVHl4TFFVRlFPMEZCUTBRN08wRkJSVVFzV1VGQlNTeGpRVUZqTEVsQlFXeENPMEZCUTBFc1lVRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4aFFVRnlRaXhEUVVGdFF5eGxRVUZ1UXl4RlFVRnZSQ3hUUVVGd1JDeEhRVUZuUlN4SlFVRm9SVHRCUVVOQkxHRkJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1lVRkJja0lzUTBGQmJVTXNjMEpCUVc1RExFVkJRVEpFTEV0QlFUTkVMRWRCUVcxRkxFdEJRVzVGT3p0QlFVVkJMRmxCUVVrc1YwRkJTaXhGUVVGcFFqdEJRVU5tTEdOQlFVa3NVVUZCVVN4TFFVRmFPMEZCUTBFc1kwRkJUU3hSUVVGUkxFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1owSkJRWEpDTEVOQlFYTkRMRTlCUVhSRExFTkJRV1E3UVVGRFFTeGpRVUZKTEV0QlFVb3NSVUZCVnp0QlFVRkJPMEZCUVVFN1FVRkJRVHM3UVVGQlFUdEJRVU5VTEcxRFFVRnRRaXhMUVVGdVFpdzRTRUZCTUVJN1FVRkJRU3h2UWtGQlppeEpRVUZsT3p0QlFVTjRRaXh2UWtGQlRTeFBRVUZQTEV0QlFVc3NWMEZCVEN4RFFVRnBRaXhKUVVGcVFpeERRVUZpTzBGQlEwRXNiMEpCUVVrc1ZVRkJWU3hMUVVGTExFdEJRVzVDTEVWQlFUQkNPMEZCUTNoQ08wRkJRMEVzYzBKQlFVa3NaMEpCUVdkQ0xFbEJRWEJDTEVWQlFUQkNPMEZCUTNoQ0xHdERRVUZqTEV0QlFVc3NTVUZCYmtJN1FVRkRSRHRCUVVORUxEQkNRVUZSTEVsQlFWSTdRVUZEUVR0QlFVTkVPMEZCUTBZN1FVRllVVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQldWWTdPMEZCUlVRc1pVRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4aFFVRnlRaXhEUVVGdFF5eGxRVUZ1UXl4RlFVRnZSQ3hUUVVGd1JDeEhRVUZuUlN4WFFVRm9SVHRCUVVOQkxHVkJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1lVRkJja0lzUTBGQmJVTXNjMEpCUVc1RExFVkJRVEpFTEV0QlFUTkVMRWRCUVcxRkxFdEJRVzVGT3p0QlFVVkJMR05CUVVrc1EwRkJReXhMUVVGTUxFVkJRVms3UVVGRFZpeHJRa0ZCVFN4SlFVRkpMRXRCUVVvc1EwRkJZU3hKUVVGaUxIRkNRVUZwUXl4TFFVRnFReXcwUTBGQlRqdEJRVU5FTzBGQlEwWTdRVUZEUmp0QlFYWkZiVUk3UVVGQlFUdEJRVUZCTEc5RFFYbEZUanRCUVVOYUxHVkJRVThzUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhoUVVGeVFpeERRVUZ0UXl4elFrRkJia01zUlVGQk1rUXNTMEZCYkVVN1FVRkRSRHRCUVRORmJVSTdRVUZCUVR0QlFVRkJMRzlEUVRaRlN6dEJRVUZCTEZsQlFXSXNTVUZCWVN4MVJVRkJUaXhKUVVGTk96dEJRVU4yUWl4WlFVRkpMRTlCUVU4c1JVRkJXRHRCUVVOQkxGbEJRVWtzVVVGQlVTeEZRVUZhT3p0QlFVVkJMRmxCUVVrc1NVRkJTaXhGUVVGVk8wRkJRMUlzYVVKQlFVOHNTMEZCU3l4WlFVRk1MRU5CUVd0Q0xGZEJRV3hDTEV0QlFXdERMRXRCUVVzc1UwRkJPVU03TzBGQlJVRXNZMEZCVFN4dFFrRkJiVUlzUzBGQlN5eGhRVUZNTEVOQlFXMUNMRTlCUVc1Q0xFTkJRWHBDTzBGQlEwRXNZMEZCU1N4blFrRkJTaXhGUVVGelFqdEJRVU53UWl4dFFrRkJUeXhwUWtGQmFVSXNVMEZCZUVJN1FVRkRSRHM3UVVGRlJDeHJRa0ZCVVN4TFFVRkxMRmxCUVV3c1EwRkJhMElzV1VGQmJFSXNRMEZCVWp0QlFVTkVPenRCUVVWRUxHVkJRVThzUlVGQlJTeFZRVUZHTEVWQlFWRXNXVUZCVWl4RlFVRlFPMEZCUTBRN1FVRTNSbTFDTzBGQlFVRTdRVUZCUVN4eFEwRXJSa3dzUzBFdlJrc3NSVUVyUmtVN1FVRkRjRUlzV1VGQlNTeE5RVUZOTEVsQlFVNHNTMEZCWlN4cFFrRkJUU3hMUVVGNlFpeEZRVUZuUXp0QlFVTTVRaXhqUVVGTkxGZEJRVmNzT0VKQlFXdENMRTFCUVUwc1RVRkJlRUlzUlVGQlowTXNWVUZCYUVNc1EwRkJha0k3UVVGRFFTeGpRVUZKTEVOQlFVTXNVVUZCVEN4RlFVRmxPMEZCUTJJc2FVSkJRVXNzU1VGQlREdEJRVU5FTzBGQlJVWXNVMEZPUkN4TlFVMVBMRWxCUVVrc1RVRkJUU3hKUVVGT0xFdEJRV1VzVDBGQmJrSXNSVUZCTkVJN1FVRkRha01zWTBGQlRTeFBRVUZQTERoQ1FVRnJRaXhOUVVGTkxFMUJRWGhDTEVWQlFXZERMRTFCUVdoRExFTkJRV0k3TzBGQlJVRXNZMEZCU1N4SlFVRktMRVZCUVZVN1FVRkRVaXhuUWtGQlNTeExRVUZMTEZOQlFVd3NRMEZCWlN4UlFVRm1MRU5CUVhkQ0xGVkJRWGhDTEVOQlFVb3NSVUZCZVVNN1FVRkRka003UVVGRFJEczdRVUZGUkN4blFrRkJUU3hYUVVGWExFdEJRVXNzVjBGQlRDeERRVUZwUWl4SlFVRnFRaXhEUVVGcVFqdEJRVU5CTEdsQ1FVRkxMRmRCUVV3c1EwRkJhVUlzVTBGQlV5eExRVUV4UWl4RlFVRnBReXhUUVVGVExFbEJRVEZETEVWQlFXZEVMRXRCUVdoRU96dEJRVVZCTEdkQ1FVRk5MRk5CUVZNc1JVRkJSU3hWUVVGR0xFVkJRVkVzVFVGQlRTeFRRVUZUTEVsQlFYWkNMRVZCUVRaQ0xFOUJRVThzVTBGQlV5eExRVUUzUXl4RlFVRm1PMEZCUTBFc2FVSkJRVXNzV1VGQlRDeERRVUZyUWl4cFFrRkJUU3hoUVVGNFFpeEZRVUYxUXl4TlFVRjJRenM3UVVGRlFTeHBRa0ZCU3l4SlFVRk1PMEZCUTBFN1FVRkRSRHM3UVVGRlJEdEJRVU5CTEdOQlFVMHNaVUZCWlN3NFFrRkJhMElzVFVGQlRTeE5RVUY0UWl4RlFVRm5ReXhsUVVGb1F5eERRVUZ5UWp0QlFVTkJMR05CUVVrc1dVRkJTaXhGUVVGclFqdEJRVU5vUWp0QlFVTkVPenRCUVVWRUxHVkJRVXNzVFVGQlREdEJRVU5FTzBGQlEwWTdRVUZvU1cxQ08wRkJRVUU3UVVGQlFTd3JRa0ZyU1ZnN1FVRkRVQ3haUVVGSkxFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1UwRkJja0lzUTBGQkswSXNVVUZCTDBJc1EwRkJkME1zVVVGQmVFTXNRMEZCU2l4RlFVRjFSRHRCUVVOeVJDeHBRa0ZCVHl4TFFVRkxMRWxCUVV3c1JVRkJVRHRCUVVORU96dEJRVVZFTEdWQlFVOHNTMEZCU3l4SlFVRk1MRVZCUVZBN1FVRkRSRHRCUVhoSmJVSTdRVUZCUVR0QlFVRkJMRFpDUVRCSllqdEJRVU5NTEZsQlFVa3NTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFRRVUZ5UWl4RFFVRXJRaXhSUVVFdlFpeERRVUYzUXl4UlFVRjRReXhEUVVGS0xFVkJRWFZFTzBGQlEzSkVMR2xDUVVGUExFdEJRVkE3UVVGRFJEczdRVUZGUkN4aFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEZOQlFYSkNMRU5CUVN0Q0xFZEJRUzlDTEVOQlFXMURMRkZCUVc1RE96dEJRVVZCTEZsQlFVMHNaVUZCWlN4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEdGQlFYSkNMRU5CUVcxRExHZENRVUZ1UXl4RFFVRnlRanM3UVVGRlFUdEJRVU5CTEhGQ1FVRmhMRk5CUVdJc1IwRkJlVUlzUTBGQmVrSTdPMEZCUlVFc1lVRkJTeXhaUVVGTUxFTkJRV3RDTEdsQ1FVRk5MRWxCUVhoQ08wRkJRMEVzWVVGQlN5eFpRVUZNTEVOQlFXdENMR2xDUVVGTkxFdEJRWGhDT3p0QlFVVkJMR0ZCUVVzc1pVRkJUQ3hEUVVGeFFpeEZRVUZGTEZGQlFWRXNXVUZCVml4RlFVRjNRaXhQUVVGUExFOUJRUzlDTEVWQlFYSkNPMEZCUTBFc1lVRkJTeXhsUVVGTUxFTkJRWEZDTEVWQlFVVXNVVUZCVVN4VFFVRlRMRWxCUVc1Q0xFVkJRWGxDTEU5QlFVOHNhVUpCUVUwc1MwRkJkRU1zUlVGQmNrSTdPMEZCUlVFc1pVRkJUeXhKUVVGUU8wRkJRMFE3UVVFM1NtMUNPMEZCUVVFN1FVRkJRU3cyUWtFclNtSTdRVUZEVEN4WlFVRkpMRU5CUVVNc1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4VFFVRnlRaXhEUVVFclFpeFJRVUV2UWl4RFFVRjNReXhSUVVGNFF5eERRVUZNTEVWQlFYZEVPMEZCUTNSRUxHbENRVUZQTEV0QlFWQTdRVUZEUkRzN1FVRkZSQ3hoUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRk5CUVhKQ0xFTkJRU3RDTEUxQlFTOUNMRU5CUVhORExGRkJRWFJET3p0QlFVVkJMR0ZCUVVzc1dVRkJUQ3hEUVVGclFpeHBRa0ZCVFN4SlFVRjRRanRCUVVOQkxHRkJRVXNzV1VGQlRDeERRVUZyUWl4cFFrRkJUU3hOUVVGNFFqczdRVUZGUVN4aFFVRkxMR2xDUVVGTUxFTkJRWFZDTEVWQlFVVXNVVUZCVVN4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEdGQlFYSkNMRU5CUVcxRExHZENRVUZ1UXl4RFFVRldMRVZCUVdkRkxFOUJRVThzVDBGQmRrVXNSVUZCZGtJN1FVRkRRU3hoUVVGTExHbENRVUZNTEVOQlFYVkNMRVZCUVVVc1VVRkJVU3hUUVVGVExFbEJRVzVDTEVWQlFYbENMRTlCUVU4c2FVSkJRVTBzUzBGQmRFTXNSVUZCZGtJN08wRkJSVUVzWlVGQlR5eEpRVUZRTzBGQlEwUTdRVUUzUzIxQ08wRkJRVUU3UVVGQlFTeHZRMEVyUzBNc1QwRXZTMFFzUlVFclMxVTdRVUZETlVJc05rZEJRVEpDTEZGQlFUTkNMRVZCUVhGRExFOUJRWEpETzBGQlEwUTdRVUZxVEcxQ096dEJRVUZCTzBGQlFVRTdPMEZCYjB4MFFqczdPenM3T3p0QlFVdEJMRTFCUVUwc1lVRkJZU3hGUVVGdVFqczdRVUZGUVN4TlFVRk5MRmxCUVZrc1UwRkJVeXhuUWtGQlZDeFBRVUU0UWl4SlFVRTVRaXhEUVVGc1FqdEJRVU5CTEUxQlFVa3NVMEZCU2l4RlFVRmxPMEZCUTJJc1kwRkJWU3hQUVVGV0xFTkJRV3RDTEZWQlFVTXNUMEZCUkN4RlFVRmhPMEZCUXpkQ0xGVkJRVTBzVTBGQlV5d3lRMEZCYjBJc1QwRkJjRUlzUlVGQk5rSXNhMEpCUVRkQ0xFVkJRV2xFTEhGQ1FVRnFSQ3hEUVVGbU8wRkJRMEVzWVVGQlR5eFBRVUZRTEVkQlFXbENMRTlCUVdwQ096dEJRVVZCTEdsQ1FVRlhMRWxCUVZnc1EwRkJaMElzU1VGQlNTeFJRVUZLTEVOQlFXRXNUVUZCWWl4RFFVRm9RanRCUVVORUxFdEJURVE3UVVGTlJEczdRVUZGUkN4TlFVRkpMRk5CUVVvc1JVRkJaVHRCUVVOaUxHRkJRVk1zWjBKQlFWUXNRMEZCTUVJc1QwRkJNVUlzUlVGQmJVTXNWVUZCUXl4TFFVRkVMRVZCUVZjN1FVRkROVU1zVlVGQlRTeGxRVUZsTERoQ1FVRnJRaXhOUVVGTkxFMUJRWGhDTEVWQlFXZERMR1ZCUVdoRExFTkJRWEpDTzBGQlEwRXNWVUZCU1N4WlFVRktMRVZCUVd0Q08wRkJRMmhDTzBGQlEwUTdPMEZCUlVRc1ZVRkJUU3hYUVVGWExEaENRVUZyUWl4TlFVRk5MRTFCUVhoQ0xFVkJRV2RETEZWQlFXaERMRU5CUVdwQ096dEJRVVZCTEZWQlFVa3NVVUZCU2l4RlFVRmpPMEZCUTFvc1dVRkJUU3hwUWtGQmFVSXNVMEZCVXl4WlFVRlVMRU5CUVhOQ0xHRkJRWFJDTEVOQlFYWkNPMEZCUTBFc1dVRkJTU3hyUWtGQmEwSXNiVUpCUVcxQ0xFbEJRWEpETEVsQlFUWkRMRkZCUVdwRUxFVkJRVEpFTzBGQlEzcEVMR05CUVUwc1dVRkJXU3hYUVVGWExFbEJRVmdzUTBGQlowSTdRVUZCUVN4dFFrRkJTeXhGUVVGRkxGVkJRVVlzVDBGQmJVSXNVVUZCZUVJN1FVRkJRU3hYUVVGb1FpeERRVUZzUWpzN1FVRkZRU3hqUVVGSkxFTkJRVU1zVTBGQlRDeEZRVUZuUWp0QlFVTmtPMEZCUTBRN08wRkJSVVFzYjBKQlFWVXNUVUZCVmp0QlFVTkVPMEZCUTBZN1FVRkRSaXhMUVhCQ1JEdEJRWEZDUkRzN1FVRkZSQ3hUUVVGUExGRkJRVkE3UVVGRFJDeERRVGxPWjBJc1JVRkJha0k3TzJ0Q1FXZFBaU3hST3pzN096czdPenM3T3pzN08wRkRjazltT3pzN096czdPenM3T3l0bFFVeEJPenM3T3pzN08wRkJUMEVzU1VGQlRTeFRRVUZWTEZsQlFVMDdRVUZEY0VJN096czdPenRCUVUxQkxFMUJRVTBzVDBGQlR5eFJRVUZpTzBGQlEwRXNUVUZCVFN4VlFVRlZMRTlCUVdoQ08wRkJRMEVzVFVGQlRTeHhRa0ZCY1VJN1FVRkRla0lzWVVGQlV5eEpRVVJuUWp0QlFVVjZRaXhYUVVGUExFbEJSbXRDTzBGQlIzcENMRlZCUVUwN1FVRkliVUlzUjBGQk0wSTdRVUZMUVN4TlFVRk5MSGRDUVVGM1FpeEZRVUU1UWpzN1FVRkZRVHM3T3pzN08wRkJhRUp2UWl4TlFYTkNaQ3hOUVhSQ1l6dEJRVUZCT3p0QlFYZENiRUlzYzBKQlFUQkNPMEZCUVVFc1ZVRkJaQ3hQUVVGakxIVkZRVUZLTEVWQlFVazdPMEZCUVVFN08wRkJSM2hDTzBGQlNIZENMR3RJUVVOc1FpeEpRVVJyUWl4RlFVTmFMRTlCUkZrc1JVRkRTQ3hyUWtGRVJ5eEZRVU5wUWl4UFFVUnFRaXhGUVVNd1FpeHhRa0ZFTVVJc1JVRkRhVVFzUzBGRWFrUXNSVUZEZDBRc1MwRkVlRVE3TzBGQlNYaENMRlZCUVUwc1owSkJRV2RDTEUxQlFVc3NWVUZCVEN4RlFVRjBRanRCUVVOQkxGVkJRVWtzVDBGQlR5eE5RVUZMTEU5QlFVd3NRMEZCWVN4TFFVRndRaXhMUVVFNFFpeFJRVUU1UWl4SlFVTkRMRU5CUVVNc1kwRkJZeXhUUVVGa0xFTkJRWGRDTEZGQlFYaENMRmxCUVRCRExFMUJRVXNzVDBGQlRDeERRVUZoTEV0QlFYWkVMRU5CUkU0c1JVRkRkVVU3UVVGRGNrVXNjMEpCUVdNc1UwRkJaQ3hEUVVGM1FpeEhRVUY0UWl4WlFVRnhReXhOUVVGTExFOUJRVXdzUTBGQllTeExRVUZzUkR0QlFVTkVPenRCUVVWRUxGbEJRVXNzVlVGQlRDeEhRVUZyUWl4TlFVRkxMRTlCUVV3c1EwRkJZU3hKUVVGaUxFdEJRWE5DTEVsQlFYaERPMEZCVm5kQ08wRkJWM3BDT3p0QlFXNURhVUk3UVVGQlFUdEJRVUZCTEhORFFYRkRSanRCUVVOa0xGbEJRVWtzUTBGQlF5eExRVUZMTEZWQlFWWXNSVUZCYzBJN1FVRkRjRUlzWTBGQlRTeFBRVUZQTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzY1VKQlFYSkNMRVZCUVdJN1FVRkRRU3hwUWtGQlR5eExRVUZMTEUxQlFWbzdRVUZEUkRzN1FVRkZSQ3hsUVVGUExFdEJRVXNzVDBGQlRDeERRVUZoTEVsQlFYQkNPMEZCUTBRN1FVRTFRMmxDTzBGQlFVRTdRVUZCUVN4dFEwRTRRMHc3UVVGRFdDeGxRVUZQTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzWVVGQmNrSXNRMEZCYlVNc2FVSkJRVzVETEVOQlFWQTdRVUZEUkR0QlFXaEVhVUk3UVVGQlFUdEJRVUZCTERaQ1FXdEVXRHRCUVVOTUxGbEJRVWtzUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhUUVVGeVFpeERRVUVyUWl4UlFVRXZRaXhEUVVGM1F5eE5RVUY0UXl4RFFVRktMRVZCUVhGRU8wRkJRMjVFTEdWQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzVTBGQmNrSXNRMEZCSzBJc1RVRkJMMElzUTBGQmMwTXNUVUZCZEVNN1FVRkRSRHM3UVVGRlJDeFpRVUZOTEU5QlFVOHNTMEZCU3l4aFFVRk1MRVZCUVdJN1FVRkRRU3hoUVVGTExFOUJRVXdzUTBGQllTeEpRVUZpTEVkQlFXOUNMRWxCUVhCQ096dEJRVVZCTEZsQlFVa3NTMEZCU3l4VlFVRlVMRVZCUVhGQ08wRkJRMjVDTEdWQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzUzBGQmNrSXNRMEZCTWtJc1MwRkJNMElzUjBGQmMwTXNTMEZCU3l4UFFVRk1MRU5CUVdFc1NVRkJia1E3UVVGRFFTeGxRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xFdEJRWEpDTEVOQlFUSkNMRTFCUVROQ0xFZEJRWFZETEV0QlFVc3NUMEZCVEN4RFFVRmhMRWxCUVhCRU96dEJRVVZCTEdOQlFVMHNaMEpCUVdkQ0xFdEJRVXNzVlVGQlRDeEZRVUYwUWp0QlFVTkJMSGRDUVVGakxFdEJRV1FzUTBGQmIwSXNTMEZCY0VJc1IwRkJLMElzUzBGQlN5eFBRVUZNTEVOQlFXRXNTVUZCTlVNN1FVRkRRU3gzUWtGQll5eExRVUZrTEVOQlFXOUNMRTFCUVhCQ0xFZEJRV2RETEV0QlFVc3NUMEZCVEN4RFFVRmhMRWxCUVRkRE8wRkJRMFE3TzBGQlJVUXNaVUZCVHl4SlFVRlFPMEZCUTBRN1FVRndSV2xDTzBGQlFVRTdRVUZCUVN4blEwRnpSV0U3UVVGQlFTeFpRVUYyUWl4alFVRjFRaXgxUlVGQlRpeEpRVUZOT3p0QlFVTTNRaXhaUVVGSkxHTkJRVW9zUlVGQmIwSTdRVUZEYkVJc1pVRkJTeXhKUVVGTU8wRkJRMFFzVTBGR1JDeE5RVVZQTzBGQlEwd3NaVUZCU3l4SlFVRk1PMEZCUTBRN08wRkJSVVFzV1VGQlRTeG5Ra0ZCWjBJc1MwRkJTeXhWUVVGTUxFVkJRWFJDT3p0QlFVVkJMRmxCUVVrc2EwSkJRMFlzUTBGQlF5eGpRVUZqTEZOQlFXUXNRMEZCZDBJc1VVRkJlRUlzUTBGQmFVTXNlVUpCUVdwRExFTkJSRWdzUlVGRFowVTdRVUZET1VRc2QwSkJRV01zVTBGQlpDeERRVUYzUWl4SFFVRjRRaXhEUVVFMFFpeDVRa0ZCTlVJN1FVRkRRU3hwUWtGQlR5eEpRVUZRTzBGQlEwUTdPMEZCUlVRc1dVRkJTU3hEUVVGRExHTkJRVVFzU1VGRFJpeGpRVUZqTEZOQlFXUXNRMEZCZDBJc1VVRkJlRUlzUTBGQmFVTXNlVUpCUVdwRExFTkJSRVlzUlVGREswUTdRVUZETjBRc2QwSkJRV01zVTBGQlpDeERRVUYzUWl4TlFVRjRRaXhEUVVFclFpeDVRa0ZCTDBJN1FVRkRSRHM3UVVGRlJDeGxRVUZQTEVsQlFWQTdRVUZEUkR0QlFUTkdhVUk3UVVGQlFUdEJRVUZCTERaQ1FUWkdXRHRCUVVOTUxGbEJRVWtzUTBGQlF5eExRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xGTkJRWEpDTEVOQlFTdENMRkZCUVM5Q0xFTkJRWGRETEUxQlFYaERMRU5CUVV3c1JVRkJjMFE3UVVGRGNFUXNaVUZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFRRVUZ5UWl4RFFVRXJRaXhIUVVFdlFpeERRVUZ0UXl4TlFVRnVRenRCUVVORU96dEJRVVZFTEdWQlFVOHNTVUZCVUR0QlFVTkVPMEZCYmtkcFFqdEJRVUZCTzBGQlFVRXNiME5CY1VkSExFOUJja2RJTEVWQmNVZFpPMEZCUXpWQ0xIbEhRVUV5UWl4TlFVRXpRaXhGUVVGdFF5eFBRVUZ1UXp0QlFVTkVPMEZCZGtkcFFqczdRVUZCUVR0QlFVRkJPenRCUVRCSGNFSXNVMEZCVHl4TlFVRlFPMEZCUTBRc1EwRXpSMk1zUlVGQlpqczdhMEpCTmtkbExFMDdPenM3T3pzN096czdPenM3UVVNdlIyWTdPenM3UVVGRFFUczdPenM3T3pzN096c3JaVUZPUVRzN096czdPenRCUVZGQkxFbEJRVTBzWlVGQlowSXNXVUZCVFR0QlFVTXhRanM3T3pzN08wRkJUVUVzVFVGQlRTeFBRVUZQTEdOQlFXSTdRVUZEUVN4TlFVRk5MRlZCUVZVc1QwRkJhRUk3UVVGRFFTeE5RVUZOTEhGQ1FVRnhRanRCUVVONlFpeGhRVUZUTEVsQlJHZENPMEZCUlhwQ0xHRkJRVk1zUlVGR1owSTdRVUZIZWtJc1owSkJRVmtzU1VGSVlUdEJRVWw2UWl4aFFVRlRMRWxCU21kQ08wRkJTM3BDTEdkQ1FVRlpPMEZCVEdFc1IwRkJNMEk3UVVGUFFTeE5RVUZOTEhkQ1FVRjNRaXhEUVVNMVFpeFRRVVEwUWl4RFFVRTVRanM3UVVGSlFUczdPenM3TzBGQmNFSXdRaXhOUVRCQ2NFSXNXVUV4UW05Q08wRkJRVUU3TzBGQk5FSjRRaXcwUWtGQk1FSTdRVUZCUVN4VlFVRmtMRTlCUVdNc2RVVkJRVW9zUlVGQlNUczdRVUZCUVRzN1FVRkJRU3c0U0VGRGJFSXNTVUZFYTBJc1JVRkRXaXhQUVVSWkxFVkJRMGdzYTBKQlJFY3NSVUZEYVVJc1QwRkVha0lzUlVGRE1FSXNjVUpCUkRGQ0xFVkJRMmxFTEVsQlJHcEVMRVZCUTNWRUxFdEJSSFpFT3p0QlFVZDRRaXhaUVVGTExGRkJRVXdzUjBGQlowSXNTMEZEYUVJc05FSkJSR2RDTEVkQlJXUXNhME5CUm1Nc1IwRkhXaXcyUWtGSVdTeEhRVWxhTEhGR1FVcFpMRWRCUzFZc2VVTkJURlVzUjBGTldpeFhRVTVaTEVkQlQyUXNVVUZRWXl4SFFWRm9RaXhSUVZKQk96dEJRVlZCTEZWQlFVa3NUVUZCU3l4alFVRlVMRVZCUVhsQ08wRkJRM1pDTEdOQlFVc3NTMEZCVER0QlFVTkVPenRCUVVWRUxGbEJRVXNzWlVGQlRDeEhRVUYxUWl4SlFVRjJRanRCUVdwQ2QwSTdRVUZyUW5wQ096dEJRVGxEZFVJN1FVRkJRVHRCUVVGQkxEaENRV2RFYUVJN1FVRkRUaXhaUVVGTkxGVkJRVlVzVTBGQlV5eGhRVUZVTEVOQlFYVkNMRXRCUVhaQ0xFTkJRV2hDT3p0QlFVVkJMR2RDUVVGUkxGTkJRVklzUjBGQmIwSXNTMEZCU3l4UlFVRjZRanM3UVVGRlFTeGhRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRWRCUVhWQ0xGRkJRVkVzVlVGQkwwSTdPMEZCUlVFN1FVRkRRU3hoUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMR0ZCUVhKQ0xFTkJRVzFETEZWQlFXNURMRVZCUVN0RExGTkJRUzlETEVkQlFUSkVMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRWGhGT3p0QlFVVkJMRmxCUVVrc1EwRkJReXhMUVVGTExFOUJRVXdzUTBGQllTeFZRVUZzUWl4RlFVRTRRanRCUVVNMVFpeGxRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xHRkJRWEpDTEVOQlFXMURMRkZCUVc1RExFVkJRVFpETEV0QlFUZERMRU5CUVcxRUxFOUJRVzVFTEVkQlFUWkVMRTFCUVRkRU8wRkJRMFE3TzBGQlJVUXNhVUpCUVZNc1NVRkJWQ3hEUVVGakxGZEJRV1FzUTBGQk1FSXNTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJka003TzBGQlJVRXNZVUZCU3l4aFFVRk1PMEZCUTBRN1FVRnFSWFZDTzBGQlFVRTdRVUZCUVN3MlFrRnRSV3BDTzBGQlFVRTdPMEZCUTB3c1dVRkJTU3hMUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEV0QlFYbENMRWxCUVRkQ0xFVkJRVzFETzBGQlEycERPMEZCUTBFc1pVRkJTeXhMUVVGTU8wRkJRMFE3TzBGQlJVUXNXVUZCU1N4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEZOQlFYSkNMRU5CUVN0Q0xGRkJRUzlDTEVOQlFYZERMRTFCUVhoRExFTkJRVW9zUlVGQmNVUTdRVUZEYmtRc2FVSkJRVThzUzBGQlVEdEJRVU5FT3p0QlFVVkVPMEZCUTBFc1dVRkJTU3hMUVVGTExFOUJRVXdzUTBGQllTeFZRVUZxUWl4RlFVRTJRanRCUVVNelFpeGxRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xHVkJRWEpDTEVOQlFYRkRMRTlCUVhKRE8wRkJRMEVzWlVGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhaUVVGeVFpeERRVUZyUXl4UFFVRnNReXhGUVVFeVF5eGpRVUV6UXpzN1FVRkZRU3hsUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRk5CUVhKQ0xFTkJRU3RDTEVkQlFTOUNMRk5CUVhsRExFdEJRVXNzVDBGQlRDeERRVUZoTEZWQlFYUkVPMEZCUTBFc1pVRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4aFFVRnlRaXhEUVVGdFF5eFJRVUZ1UXl4RlFVRTJReXhUUVVFM1F5eERRVUYxUkN4SFFVRjJSQ3hWUVVGclJTeExRVUZMTEU5QlFVd3NRMEZCWVN4VlFVRXZSVHRCUVVORU96dEJRVVZFTEZsQlFVa3NTMEZCU3l4UFFVRk1MRU5CUVdFc1ZVRkJha0lzUlVGQk5rSTdRVUZETTBJN1FVRkRRU3hqUVVGTkxHZENRVUZuUWl4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEdGQlFYSkNMRU5CUVcxRExGRkJRVzVETEVOQlFYUkNPMEZCUTBFc1pVRkJTeXhsUVVGTUxFTkJRWEZDTEVWQlFVVXNVVUZCVVN4aFFVRldMRVZCUVhsQ0xFOUJRVThzVDBGQmFFTXNSVUZCY2tJN1FVRkRSRHM3UVVGRlJDeHRRa0ZCVnl4WlFVRk5PMEZCUTJZc2FVSkJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1UwRkJja0lzUTBGQkswSXNSMEZCTDBJc1EwRkJiVU1zVFVGQmJrTTdPMEZCUlVFN1FVRkRRU3hqUVVGTkxITkNRVUZ6UWl4VFFVRlRMR2RDUVVGVUxFTkJRVEJDTEc5Q1FVRXhRaXhMUVVGdFJDeEZRVUV2UlR0QlFVTkJMR05CUVVrc1pVRkJaU3hEUVVGdVFqdEJRVU5CTERoQ1FVRnZRaXhQUVVGd1FpeERRVUUwUWl4VlFVRkRMRmxCUVVRc1JVRkJhMEk3UVVGRE5VTXNaMEpCUVVrc1QwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeExRVUY1UWl4WlFVRTNRaXhGUVVFeVF6dEJRVU42UXl4clFrRkJUU3hSUVVGUkxHbENRVUZwUWl4WlFVRnFRaXhEUVVGa08wRkJRMEVzT0VKQlFXZENMR0ZCUVdFc1dVRkJZaXhIUVVFMFFpeFRRVUZUTEUxQlFVMHNXVUZCWml4RlFVRTJRaXhGUVVFM1FpeERRVUUxUXp0QlFVTkVPMEZCUTBZc1YwRk1SRHM3UVVGUFFTeHBRa0ZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeExRVUZ5UWl4RFFVRXlRaXhUUVVFelFpeHRRa0ZCY1VRc1dVRkJja1E3TzBGQlJVRXNhVUpCUVVzc1dVRkJUQ3hEUVVGclFpeHBRa0ZCVFN4SlFVRjRRanM3UVVGRlFTeGpRVUZOTEZWQlFWVXNVMEZCVml4UFFVRlZMRWRCUVUwN1FVRkRjRUlzYlVKQlFVc3NXVUZCVEN4RFFVRnJRaXhwUWtGQlRTeExRVUY0UWp0QlFVTkJMRzFDUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRzFDUVVGeVFpeERRVUY1UXl4cFFrRkJUU3hqUVVFdlF5eEZRVUVyUkN4UFFVRXZSRHRCUVVORUxGZEJTRVE3TzBGQlMwRXNhVUpCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNaMEpCUVhKQ0xFTkJRWE5ETEdsQ1FVRk5MR05CUVRWRExFVkJRVFJFTEU5QlFUVkVPMEZCUlVRc1UwRjRRa1FzUlVGM1FrY3NRMEY0UWtnN08wRkJNRUpCTEZsQlFVa3NUMEZCVHl4VFFVRlFMRU5CUVdsQ0xFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFUbENMRXRCUVRCRExFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNSMEZCZFVJc1EwRkJja1VzUlVGQmQwVTdRVUZEZEVVN1FVRkRRU3hsUVVGTExHVkJRVXdzUjBGQmRVSXNWMEZCVnl4WlFVRk5PMEZCUTNSRExHMUNRVUZMTEVsQlFVdzdRVUZEUkN4WFFVWnpRaXhGUVVWd1FpeExRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRWRCUVhWQ0xFTkJSa2dzUTBGQmRrSTdRVUZIUkRzN1FVRkZSQ3hsUVVGUExFbEJRVkE3UVVGRFJEdEJRVGxJZFVJN1FVRkJRVHRCUVVGQkxEWkNRV2RKYWtJN1FVRkJRVHM3UVVGRFREczdPenRCUVVsQkxGbEJRVWtzUzBGQlN5eGxRVUZVTEVWQlFUQkNPMEZCUTNoQ0xIVkNRVUZoTEV0QlFVc3NaVUZCYkVJN1FVRkRRU3hsUVVGTExHVkJRVXdzUjBGQmRVSXNTVUZCZGtJN1FVRkRSRHM3UVVGRlJDeFpRVUZKTEVOQlFVTXNTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFRRVUZ5UWl4RFFVRXJRaXhSUVVFdlFpeERRVUYzUXl4TlFVRjRReXhEUVVGTUxFVkJRWE5FTzBGQlEzQkVMR2xDUVVGUExFdEJRVkE3UVVGRFJEczdRVUZGUkN4aFFVRkxMRmxCUVV3c1EwRkJhMElzYVVKQlFVMHNTVUZCZUVJN08wRkJSVUVzV1VGQlNTeExRVUZMTEU5QlFVd3NRMEZCWVN4VlFVRnFRaXhGUVVFMlFqdEJRVU16UWl4alFVRk5MR2RDUVVGblFpeExRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xHRkJRWEpDTEVOQlFXMURMRkZCUVc1RExFTkJRWFJDTzBGQlEwRXNaVUZCU3l4cFFrRkJUQ3hEUVVGMVFpeEZRVUZGTEZGQlFWRXNZVUZCVml4RlFVRjVRaXhQUVVGUExFOUJRV2hETEVWQlFYWkNPMEZCUTBRN08wRkJSVVFzWVVGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhUUVVGeVFpeERRVUVyUWl4TlFVRXZRaXhEUVVGelF5eE5RVUYwUXp0QlFVTkJMR0ZCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNVMEZCY2tJc1EwRkJLMElzUjBGQkwwSXNRMEZCYlVNc1RVRkJia003TzBGQlJVRXNXVUZCVFN4WFFVRlhMRk5CUVZnc1VVRkJWeXhIUVVGTk8wRkJRM0pDTEdsQ1FVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEcxQ1FVRnlRaXhEUVVGNVF5eHBRa0ZCVFN4alFVRXZReXhGUVVFclJDeFJRVUV2UkR0QlFVTkJMR2xDUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRk5CUVhKQ0xFTkJRU3RDTEUxQlFTOUNMRU5CUVhORExFMUJRWFJET3p0QlFVVkJMR2xDUVVGTExGbEJRVXdzUTBGQmEwSXNhVUpCUVUwc1RVRkJlRUk3TzBGQlJVRXNZMEZCU1N4UFFVRkxMR05CUVZRc1JVRkJlVUk3UVVGRGRrSXNjVUpCUVZNc1NVRkJWQ3hEUVVGakxGZEJRV1FzUTBGQk1FSXNUMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJka003UVVGRFFTeHRRa0ZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhIUVVGMVFpeEpRVUYyUWp0QlFVTkVPMEZCUTBZc1UwRldSRHM3UVVGWlFTeGhRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xHZENRVUZ5UWl4RFFVRnpReXhwUWtGQlRTeGpRVUUxUXl4RlFVRTBSQ3hSUVVFMVJEczdRVUZGUVN4bFFVRlBMRWxCUVZBN1FVRkRSRHRCUVhaTGRVSTdRVUZCUVR0QlFVRkJMSFZEUVhsTFVEdEJRVU5tTEdGQlFVc3NTVUZCVER0QlFVTkVPMEZCTTB0MVFqdEJRVUZCTzBGQlFVRXNiME5CTmt0SUxFOUJOMHRITEVWQk5rdE5PMEZCUXpWQ0xIRklRVUV5UWl4WlFVRXpRaXhGUVVGNVF5eFBRVUY2UXp0QlFVTkVPMEZCTDB0MVFqczdRVUZCUVR0QlFVRkJPenRCUVd0TU1VSXNVMEZCVHl4WlFVRlFPMEZCUTBRc1EwRnVURzlDTEVWQlFYSkNPenRyUWtGeFRHVXNXVHM3T3pzN096czdPenM3T3p0QlEzaE1aanM3T3p0QlFVTkJPenM3TzBGQlEwRTdPMEZCUTBFN096czdPenM3T3l0bFFWSkJPenM3T3pzN08wRkJWVUVzU1VGQlRTeFpRVUZoTEZsQlFVMDdRVUZEZGtJN096czdPenRCUVUxQkxFMUJRVTBzVDBGQlR5eFpRVUZpTzBGQlEwRXNUVUZCVFN4VlFVRlZMRTlCUVdoQ08wRkJRMEVzVFVGQlRTeHZRa0ZCYjBJc2NVSkJRVEZDTzBGQlEwRXNUVUZCVFN4eFFrRkJjVUk3UVVGRGVrSXNZVUZCVXl4SlFVUm5RanRCUVVWNlFpeFhRVUZQTzBGQlEwd3NWVUZCU1N4TFFVUkRPMEZCUlV3c1ZVRkJTU3hMUVVaRE8wRkJSMHdzVlVGQlNUdEJRVWhETzBGQlJtdENMRWRCUVROQ08wRkJVVUVzVFVGQlRTeDNRa0ZCZDBJc1EwRkROVUlzVDBGRU5FSXNRMEZCT1VJN08wRkJTVUU3T3pzN096dEJRWFJDZFVJc1RVRTBRbXBDTEZOQk5VSnBRanRCUVVGQk96dEJRVGhDY2tJc2VVSkJRVEJDTzBGQlFVRXNWVUZCWkN4UFFVRmpMSFZGUVVGS0xFVkJRVWs3TzBGQlFVRTdPMEZCUVVFc2QwaEJRMnhDTEVsQlJHdENMRVZCUTFvc1QwRkVXU3hGUVVOSUxHdENRVVJITEVWQlEybENMRTlCUkdwQ0xFVkJRekJDTEhGQ1FVUXhRaXhGUVVOcFJDeExRVVJxUkN4RlFVTjNSQ3hKUVVSNFJEczdRVUZIZUVJc1dVRkJTeXhYUVVGTUxFZEJRVzFDTEVsQlFXNUNPMEZCUTBFc1dVRkJTeXhaUVVGTUxFZEJRVzlDTEVsQlFYQkNPMEZCUTBFc1dVRkJTeXhQUVVGTUxFZEJRV1VzU1VGQlpqczdRVUZGUVN4VlFVRk5MRXRCUVVzc1JVRkJSU3hOUVVGTkxFbEJRVklzUlVGQll5eFBRVUZQTEU5QlFVOHNWVUZCVUN4RFFVRnJRaXhyUWtGQmJFSXNRMEZCY2tJc1JVRkJXRHRCUVVOQkxGVkJRVTBzUzBGQlN5eEZRVUZGTEUxQlFVMHNTVUZCVWl4RlFVRmpMRTlCUVU4c1QwRkJUeXhWUVVGUUxFTkJRV3RDTEc5Q1FVRnNRaXhEUVVGeVFpeEZRVUZZTzBGQlEwRXNWVUZCVFN4TFFVRkxMRVZCUVVVc1RVRkJUU3hKUVVGU0xFVkJRV01zVDBGQlR5eFBRVUZQTEZWQlFWQXNRMEZCYTBJc2IwSkJRV3hDTEVOQlFYSkNMRVZCUVZnN1FVRkRRU3hWUVVGTkxFdEJRVXNzUlVGQlJTeE5RVUZOTEVsQlFWSXNSVUZCWXl4UFFVRlBMRTlCUVU4c1ZVRkJVQ3hEUVVGclFpeHhRa0ZCYkVJc1EwRkJja0lzUlVGQldEczdRVUZGUVN4VlFVRk5MRkZCUVZFc1EwRkJReXhGUVVGRUxFVkJRVXNzUlVGQlRDeEZRVUZUTEVWQlFWUXNSVUZCWVN4RlFVRmlMRVZCUVdsQ0xFOUJRV3BDTEVWQlFXUTdPMEZCUlVFc1ZVRkJUU3hoUVVGaExGTkJRV0lzVlVGQllTeEhRVUZOTzBGQlEzWkNMRmxCUVVrc1JVRkJSU3huUWtGQlowSXNUVUZCYkVJc1EwRkJTaXhGUVVFclFqdEJRVU0zUWp0QlFVTkVPenRCUVVWRUxHTkJRVTBzUzBGQlRpeERRVUZaTEZWQlFVTXNTVUZCUkN4RlFVRlZPMEZCUTNCQ0xHTkJRVTBzVVVGQlVTeExRVUZMTEV0QlFVd3NRMEZCVnl4TFFVRllMRU5CUVdsQ0xFdEJRV3BDTEVOQlFYVkNMREJDUVVGMlFpeERRVUZrT3p0QlFVVkJMR05CUVVrc1MwRkJTaXhGUVVGWE8wRkJRMVFzWjBKQlFVa3NTMEZCU3l4TFFVRk1MRU5CUVZjc1QwRkJaaXhGUVVGM1FqdEJRVU4wUWl4clFrRkJTU3hOUVVGTExGbEJRVXdzUzBGQmMwSXNTMEZCU3l4SlFVRXZRaXhGUVVGeFF6dEJRVU51UXl4elFrRkJTeXhSUVVGTUxFTkJRV01zUzBGQlN5eEpRVUZ1UWp0QlFVTkVPMEZCUTBRc2IwSkJRVXNzV1VGQlRDeEhRVUZ2UWl4TFFVRkxMRWxCUVhwQ08wRkJRMEVzY1VKQlFVOHNTMEZCVUR0QlFVTkVPMEZCUTBZN08wRkJSVVFzYVVKQlFVOHNTVUZCVUR0QlFVTkVMRk5CWkVRN1FVRmxSQ3hQUVhCQ1JEczdRVUZ6UWtFN08wRkJSVUVzWVVGQlR5eG5Ra0ZCVUN4RFFVRjNRaXhSUVVGNFFpeEZRVUZyUXl4VlFVRnNReXhGUVVFNFF5eExRVUU1UXp0QlFYUkRkMEk3UVVGMVEzcENPenRCUVhKRmIwSTdRVUZCUVR0QlFVRkJMSGREUVhWRlNEdEJRVU5vUWl4bFFVRlBMSGxJUVVFeVFpeExRVUZMTEU5QlFVd3NRMEZCWVN4TFFVRmlMRU5CUVcxQ0xFdEJRVXNzV1VGQmVFSXNUVUZCTUVNc1NVRkJOVVU3UVVGRFJEdEJRWHBGYjBJN1FVRkJRVHRCUVVGQkxDdENRVEpGV2l4SlFUTkZXU3hGUVRKRlRqdEJRVU5pTEZsQlFVMHNWVUZCVlN4VFFVRlRMRWxCUVhwQ096dEJRVVZCTEZsQlFVa3NTMEZCU3l4UFFVRk1MRU5CUVdFc1MwRkJZaXhEUVVGdFFpeEpRVUZ1UWl4TlFVRTJRaXhKUVVGcVF5eEZRVUYxUXp0QlFVTnlReXhqUVVGSkxFTkJRVU1zVVVGQlVTeFRRVUZTTEVOQlFXdENMRkZCUVd4Q0xFTkJRVEpDTEd0Q1FVRXpRaXhEUVVGTUxFVkJRWEZFTzBGQlEyNUVMRzlDUVVGUkxGTkJRVklzUTBGQmEwSXNSMEZCYkVJc1EwRkJjMElzYTBKQlFYUkNPMEZCUTBRN08wRkJSVVFzWlVGQlN5eFhRVUZNTEVkQlFXMUNMRXRCUVc1Q096dEJRVVZCTzBGQlEwRXNaVUZCU3l4UFFVRk1MRWRCUVdVc1MwRkJaanRCUVVOQkxHVkJRVXNzU1VGQlREdEJRVU5CTzBGQlEwRXNaVUZCU3l4alFVRk1PMEZCUTBRc1UwRmFSQ3hOUVZsUE8wRkJRMHdzWTBGQlNTeFJRVUZSTEZOQlFWSXNRMEZCYTBJc1VVRkJiRUlzUTBGQk1rSXNhMEpCUVROQ0xFTkJRVW9zUlVGQmIwUTdRVUZEYkVRc2IwSkJRVkVzVTBGQlVpeERRVUZyUWl4TlFVRnNRaXhEUVVGNVFpeHJRa0ZCZWtJN1FVRkRSRHM3UVVGRlJDeGxRVUZMTEVsQlFVdzdRVUZEUVN4bFFVRkxMRmRCUVV3c1IwRkJiVUlzU1VGQmJrSTdRVUZEUVN4bFFVRkxMRTlCUVV3c1IwRkJaU3hKUVVGbU8wRkJRMFE3UVVGRFJqdEJRVzVIYjBJN1FVRkJRVHRCUVVGQkxIRkRRWEZIVGl4TFFYSkhUU3hGUVhGSFF6dEJRVU53UWl4WlFVRkpMRTFCUVUwc1NVRkJUaXhMUVVGbExFOUJRV1lzU1VGQk1FSXNUVUZCVFN4UFFVRk9MRXRCUVd0Q0xFVkJRVFZETEVsQlFXdEVMRTFCUVUwc1QwRkJUaXhMUVVGclFpeEZRVUY0UlN4RlFVRTBSVHRCUVVNeFJUdEJRVU5FT3p0QlFVVkVPMEZCUTBFc1lVRkJTeXhKUVVGTU8wRkJRMFE3UVVFMVIyOUNPMEZCUVVFN1FVRkJRU3cyUWtFNFIyUTdRVUZCUVRzN1FVRkRUQ3haUVVGSkxFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1UwRkJja0lzUTBGQkswSXNVVUZCTDBJc1EwRkJkME1zVFVGQmVFTXNRMEZCU2l4RlFVRnhSRHRCUVVOdVJDeHBRa0ZCVHl4TFFVRlFPMEZCUTBRN08wRkJSVVE3UVVGRFFTeHRRa0ZCVnl4WlFVRk5PMEZCUTJZc2FVSkJRVXNzV1VGQlRDeERRVUZyUWl4cFFrRkJUU3hKUVVGNFFqczdRVUZGUVN4alFVRk5MRlZCUVZVc1UwRkJWaXhQUVVGVkxFZEJRVTA3UVVGRGNFSXNiVUpCUVVzc1dVRkJUQ3hEUVVGclFpeHBRa0ZCVFN4TFFVRjRRanM3UVVGRlFTeG5Ra0ZCU1N4UFFVRkxMRTlCUVZRc1JVRkJhMEk3UVVGRGFFSXNjVUpCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNiVUpCUVhKQ0xFTkJRWGxETEdsQ1FVRk5MR05CUVM5RExFVkJRU3RFTEU5QlFTOUVPMEZCUTBFc2NVSkJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1UwRkJja0lzUTBGQkswSXNUVUZCTDBJc1EwRkJjME1zVTBGQmRFTTdRVUZEUkR0QlFVTkdMRmRCVUVRN08wRkJVMEVzWTBGQlNTeFBRVUZMTEZkQlFWUXNSVUZCYzBJN1FVRkRjRUlzYlVKQlFVc3NZMEZCVER0QlFVTkVPenRCUVVkRUxHTkJRVWtzVDBGQlN5eFBRVUZVTEVWQlFXdENPMEZCUTJoQ0xHMUNRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xHZENRVUZ5UWl4RFFVRnpReXhwUWtGQlRTeGpRVUUxUXl4RlFVRTBSQ3hQUVVFMVJEdEJRVU5CTEcxQ1FVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEZOQlFYSkNMRU5CUVN0Q0xFZEJRUzlDTEVOQlFXMURMRk5CUVc1RE8wRkJRMFFzVjBGSVJDeE5RVWRQTzBGQlEwdzdRVUZEUVR0QlFVTkVPenRCUVVWRUxHbENRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xGTkJRWEpDTEVOQlFTdENMRWRCUVM5Q0xFTkJRVzFETEUxQlFXNURPenRCUVVWQk8wRkJRMEVzYVVKQlFVc3NXVUZCVER0QlFVTkVMRk5CTjBKRUxFVkJOa0pITEVOQk4wSklPenRCUVN0Q1FTeGxRVUZQTEVsQlFWQTdRVUZEUkR0QlFYQktiMEk3UVVGQlFUdEJRVUZCTERaQ1FYTktaRHRCUVVGQk96dEJRVU5NTEZsQlFVa3NRMEZCUXl4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEZOQlFYSkNMRU5CUVN0Q0xGRkJRUzlDTEVOQlFYZERMRTFCUVhoRExFTkJRVXdzUlVGQmMwUTdRVUZEY0VRc2FVSkJRVThzUzBGQlVEdEJRVU5FT3p0QlFVVkVMR0ZCUVVzc1dVRkJUQ3hEUVVGclFpeHBRa0ZCVFN4SlFVRjRRanM3UVVGRlFTeGhRVUZMTEZsQlFVdzdPMEZCUlVFc1dVRkJTU3hMUVVGTExFOUJRVlFzUlVGQmEwSTdRVUZEYUVJc1pVRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4VFFVRnlRaXhEUVVFclFpeEhRVUV2UWl4RFFVRnRReXhUUVVGdVF6dEJRVU5FT3p0QlFVVkVMR0ZCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNVMEZCY2tJc1EwRkJLMElzVFVGQkwwSXNRMEZCYzBNc1RVRkJkRU03TzBGQlJVRXNXVUZCU1N4TFFVRkxMRmRCUVZRc1JVRkJjMEk3UVVGRGNFSXNZMEZCVFN4WFFVRlhMRXRCUVVzc1YwRkJUQ3hGUVVGcVFqczdRVUZGUVN4alFVRk5MRmRCUVZjc1UwRkJXQ3hSUVVGWExFZEJRVTA3UVVGRGNrSXNaMEpCUVVrc1QwRkJTeXhQUVVGVUxFVkJRV3RDTzBGQlEyaENMSEZDUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRk5CUVhKQ0xFTkJRU3RDTEUxQlFTOUNMRU5CUVhORExGTkJRWFJETzBGQlEwUTdPMEZCUlVRc2NVSkJRVk1zYlVKQlFWUXNRMEZCTmtJc2FVSkJRVTBzWTBGQmJrTXNSVUZCYlVRc1VVRkJia1E3UVVGRFFTeHRRa0ZCU3l4WlFVRk1MRU5CUVd0Q0xHbENRVUZOTEUxQlFYaENPMEZCUTBFc2JVSkJRVXNzWTBGQlREdEJRVU5FTEZkQlVrUTdPMEZCVlVFc2JVSkJRVk1zWjBKQlFWUXNRMEZCTUVJc2FVSkJRVTBzWTBGQmFFTXNSVUZCWjBRc1VVRkJhRVE3UVVGRFFTeHRRa0ZCVXl4VFFVRlVMRU5CUVcxQ0xFZEJRVzVDTEVOQlFYVkNMRk5CUVhaQ08wRkJRMFE3TzBGQlJVUXNaVUZCVHl4SlFVRlFPMEZCUTBRN1FVRjJURzlDTzBGQlFVRTdRVUZCUVN4MVEwRjVURW83UVVGRFppeFpRVUZOTEZkQlFWY3NVMEZCVXl4aFFVRlVMRU5CUVhWQ0xFdEJRWFpDTEVOQlFXcENPMEZCUTBFc2FVSkJRVk1zV1VGQlZDeERRVUZ6UWl4VFFVRjBRaXhGUVVGcFF5eExRVUZMTEVWQlFYUkRPMEZCUTBFc2FVSkJRVk1zVTBGQlZDeERRVUZ0UWl4SFFVRnVRaXhEUVVGMVFpeHBRa0ZCZGtJN08wRkJSVUVzYVVKQlFWTXNTVUZCVkN4RFFVRmpMRmRCUVdRc1EwRkJNRUlzVVVGQk1VSTdRVUZEUkR0QlFTOU1iMEk3UVVGQlFUdEJRVUZCTEc5RFFXbE5VRHRCUVVOYUxHVkJRVThzVTBGQlV5eGhRVUZVTEU5QlFUSkNMR2xDUVVFelFpeHJRa0ZCZVVRc1MwRkJTeXhGUVVFNVJDeFJRVUZRTzBGQlEwUTdRVUZ1VFc5Q08wRkJRVUU3UVVGQlFTeDFRMEZ4VFVvN1FVRkRaaXhaUVVGTkxGZEJRVmNzUzBGQlN5eFhRVUZNTEVWQlFXcENPMEZCUTBFc1dVRkJTU3hSUVVGS0xFVkJRV003UVVGRFdpeHRRa0ZCVXl4SlFVRlVMRU5CUVdNc1YwRkJaQ3hEUVVFd1FpeFJRVUV4UWp0QlFVTkVPMEZCUTBZN1FVRXhUVzlDTzBGQlFVRTdRVUZCUVN4eFEwRTBUVTQ3UVVGQlFUczdRVUZEWWl4WlFVRk5MR2xDUVVGcFFpeExRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xHZENRVUZ5UWl4RFFVRnpReXhuUWtGQmRFTXNRMEZCZGtJN08wRkJSVUVzV1VGQlNTeGpRVUZLTEVWQlFXOUNPMEZCUTJ4Q0xIbENRVUZsTEU5QlFXWXNRMEZCZFVJN1FVRkJRU3h0UWtGQlZTeFBRVUZMTEdWQlFVd3NRMEZCY1VJc1JVRkJSU3hSUVVGUkxFMUJRVllzUlVGQmEwSXNUMEZCVHl4UFFVRjZRaXhGUVVGeVFpeERRVUZXTzBGQlFVRXNWMEZCZGtJN1FVRkRSRHM3UVVGRlJDeFpRVUZKTEV0QlFVc3NWMEZCVkN4RlFVRnpRanRCUVVOd1FpeGpRVUZOTEZkQlFWY3NTMEZCU3l4WFFVRk1MRVZCUVdwQ08wRkJRMEVzWlVGQlN5eGxRVUZNTEVOQlFYRkNMRVZCUVVVc1VVRkJVU3hSUVVGV0xFVkJRVzlDTEU5QlFVOHNhVUpCUVUwc1MwRkJha01zUlVGQmNrSTdRVUZEUkRzN1FVRkZSQ3hoUVVGTExHVkJRVXdzUTBGQmNVSXNSVUZCUlN4UlFVRlJMRkZCUVZZc1JVRkJiMElzVDBGQlR5eFBRVUV6UWl4RlFVRnlRanRCUVVORU8wRkJlazV2UWp0QlFVRkJPMEZCUVVFc2NVTkJNazVPTzBGQlFVRTdPMEZCUTJJc1dVRkJUU3hwUWtGQmFVSXNTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeG5Ra0ZCY2tJc1EwRkJjME1zWjBKQlFYUkRMRU5CUVhaQ096dEJRVVZCTEZsQlFVa3NZMEZCU2l4RlFVRnZRanRCUVVOc1FpeDVRa0ZCWlN4UFFVRm1MRU5CUVhWQ08wRkJRVUVzYlVKQlFWVXNUMEZCU3l4cFFrRkJUQ3hEUVVGMVFpeEZRVUZGTEZGQlFWRXNUVUZCVml4RlFVRnJRaXhQUVVGUExFOUJRWHBDTEVWQlFYWkNMRU5CUVZZN1FVRkJRU3hYUVVGMlFqdEJRVU5FT3p0QlFVVkVMRmxCUVVrc1MwRkJTeXhYUVVGVUxFVkJRWE5DTzBGQlEzQkNMR05CUVUwc1YwRkJWeXhMUVVGTExGZEJRVXdzUlVGQmFrSTdRVUZEUVN4bFFVRkxMR2xDUVVGTUxFTkJRWFZDTEVWQlFVVXNVVUZCVVN4UlFVRldMRVZCUVc5Q0xFOUJRVThzYVVKQlFVMHNTMEZCYWtNc1JVRkJka0k3UVVGRFJEczdRVUZGUkN4aFFVRkxMR2xDUVVGTUxFTkJRWFZDTEVWQlFVVXNVVUZCVVN4UlFVRldMRVZCUVc5Q0xFOUJRVThzVDBGQk0wSXNSVUZCZGtJN1FVRkRSRHRCUVhoUGIwSTdRVUZCUVR0QlFVRkJMRzlEUVRCUFFTeFBRVEZQUVN4RlFUQlBVenRCUVVNMVFpd3JSMEZCTWtJc1UwRkJNMElzUlVGQmMwTXNUMEZCZEVNN1FVRkRSRHRCUVRWUGIwSTdPMEZCUVVFN1FVRkJRVHM3UVVFclQzWkNPenM3T3pzN08wRkJTMEVzVFVGQlRTeGhRVUZoTEVWQlFXNUNPenRCUVVWQkxFMUJRVTBzV1VGQldTeFRRVUZUTEdkQ1FVRlVMRTlCUVRoQ0xFbEJRVGxDTEVOQlFXeENPMEZCUTBFc1RVRkJTU3hUUVVGS0xFVkJRV1U3UVVGRFlpeGpRVUZWTEU5QlFWWXNRMEZCYTBJc1ZVRkJReXhQUVVGRUxFVkJRV0U3UVVGRE4wSXNWVUZCVFN4VFFVRlRMREpEUVVGdlFpeFBRVUZ3UWl4RlFVRTJRaXhyUWtGQk4wSXNSVUZCYVVRc2NVSkJRV3BFTEVOQlFXWTdRVUZEUVN4aFFVRlBMRTlCUVZBc1IwRkJhVUlzVDBGQmFrSTdPMEZCUlVFc2FVSkJRVmNzU1VGQldDeERRVUZuUWl4RlFVRkZMR2RDUVVGR0xFVkJRVmNzVjBGQlZ5eEpRVUZKTEZOQlFVb3NRMEZCWXl4TlFVRmtMRU5CUVhSQ0xFVkJRV2hDTzBGQlEwUXNTMEZNUkR0QlFVMUVPenRCUVVWRUxFMUJRVWtzVTBGQlNpeEZRVUZsTzBGQlEySXNZVUZCVXl4blFrRkJWQ3hEUVVFd1FpeFBRVUV4UWl4RlFVRnRReXhWUVVGRExFdEJRVVFzUlVGQlZ6dEJRVU0xUXl4VlFVRk5MRk5CUVZNc05rSkJRV2xDTEUxQlFVMHNUVUZCZGtJc1JVRkJLMElzWVVGQkwwSXNRMEZCWmp0QlFVTkJMRlZCUVVrc1EwRkJReXhOUVVGTUxFVkJRV0U3UVVGRFdEdEJRVU5FT3p0QlFVVkVMRlZCUVUwc2FVSkJRV2xDTEU5QlFVOHNXVUZCVUN4RFFVRnZRaXhoUVVGd1FpeERRVUYyUWp0QlFVTkJMRlZCUVVrc2EwSkJRV3RDTEcxQ1FVRnRRaXhKUVVGNlF5eEZRVUVyUXp0QlFVTTNReXhaUVVGTkxFdEJRVXNzVDBGQlR5eFpRVUZRTEVOQlFXOUNMR0ZCUVhCQ0xFTkJRVmc3UVVGRFFTeFpRVUZOTEZWQlFWVXNVMEZCVXl4aFFVRlVMRU5CUVhWQ0xFVkJRWFpDTEVOQlFXaENPenRCUVVWQkxGbEJRVTBzV1VGQldTeFhRVUZYTEVsQlFWZ3NRMEZCWjBJN1FVRkJRU3hwUWtGQlN5eEZRVUZGTEU5QlFVWXNTMEZCWXl4UFFVRnVRanRCUVVGQkxGTkJRV2hDTEVOQlFXeENPenRCUVVWQkxGbEJRVWtzUTBGQlF5eFRRVUZNTEVWQlFXZENPMEZCUTJRN1FVRkRSRHM3UVVGRlJDeGxRVUZQTEVsQlFWQTdPMEZCUlVFc2EwSkJRVlVzVTBGQlZpeERRVUZ2UWl4SlFVRndRanRCUVVORU8wRkJRMFlzUzBGeVFrUTdRVUZ6UWtRN08wRkJSVVFzVTBGQlR5eFRRVUZRTzBGQlEwUXNRMEV4VW1sQ0xFVkJRV3hDT3p0clFrRTBVbVVzVXpzN096czdPenM3T3pzN096dEJRMnBUWmpzN096dEJRVU5CT3pzN096czdPenM3T3l0bFFVNUJPenM3T3pzN08wRkJVVUVzU1VGQlRTeFhRVUZaTEZsQlFVMDdRVUZEZEVJN096czdPenRCUVUxQkxFMUJRVTBzVDBGQlR5eFZRVUZpTzBGQlEwRXNUVUZCVFN4VlFVRlZMRTlCUVdoQ08wRkJRMEVzVFVGQlRTeHhRa0ZCY1VJN1FVRkRla0lzWVVGQlV5eEpRVVJuUWp0QlFVVjZRaXhaUVVGUkxFTkJSbWxDTzBGQlIzcENMRk5CUVVzc1EwRkliMEk3UVVGSmVrSXNVMEZCU3l4SFFVcHZRanRCUVV0NlFpeFhRVUZQTEV0QlRHdENPMEZCVFhwQ0xHRkJRVk1zUzBGT1owSTdRVUZQZWtJc1owSkJRVms3UVVGUVlTeEhRVUV6UWp0QlFWTkJMRTFCUVUwc2QwSkJRWGRDTEVOQlF6VkNMRkZCUkRSQ0xFVkJSVFZDTEV0QlJqUkNMRVZCUnpWQ0xFdEJTRFJDTEVWQlNUVkNMRTlCU2pSQ0xFVkJTelZDTEZOQlREUkNMRVZCVFRWQ0xGbEJUalJDTEVOQlFUbENPenRCUVZOQk96czdPenM3UVVFelFuTkNMRTFCYVVOb1FpeFJRV3BEWjBJN1FVRkJRVHM3UVVGdFEzQkNMSGRDUVVFd1FqdEJRVUZCTEZWQlFXUXNUMEZCWXl4MVJVRkJTaXhGUVVGSk96dEJRVUZCT3p0QlFVZDRRanRCUVVoM1FpeHpTRUZEYkVJc1NVRkVhMElzUlVGRFdpeFBRVVJaTEVWQlEwZ3NhMEpCUkVjc1JVRkRhVUlzVDBGRWFrSXNSVUZETUVJc2NVSkJSREZDTEVWQlEybEVMRXRCUkdwRUxFVkJRM2RFTEV0QlJIaEVPenRCUVVsNFFpeFpRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xFdEJRWEpDTEVOQlFUSkNMRTFCUVROQ0xFZEJRWFZETEUxQlFVc3NUMEZCVEN4RFFVRmhMRTFCUVhCRU96dEJRVVZCTzBGQlEwRXNWVUZCVFN4alFVRmpMRTFCUVVzc1kwRkJUQ3hGUVVGd1FqdEJRVU5CTEd0Q1FVRlpMRmxCUVZvc1EwRkJlVUlzWlVGQmVrSXNUMEZCTmtNc1RVRkJTeXhQUVVGTUxFTkJRV0VzUjBGQk1VUTdRVUZEUVN4clFrRkJXU3haUVVGYUxFTkJRWGxDTEdWQlFYcENMRTlCUVRaRExFMUJRVXNzVDBGQlRDeERRVUZoTEVkQlFURkVPenRCUVVWQk8wRkJRMEVzVlVGQlNTeE5RVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRWxCUTBNc1EwRkJReXhaUVVGWkxGTkJRVm9zUTBGQmMwSXNVVUZCZEVJc1EwRkJLMElzYzBKQlFTOUNMRU5CUkU0c1JVRkRPRVE3UVVGRE5VUXNiMEpCUVZrc1UwRkJXaXhEUVVGelFpeEhRVUYwUWl4RFFVRXdRaXh6UWtGQk1VSTdRVUZEUkRzN1FVRkZSRHRCUVVOQkxGVkJRVWtzVDBGQlR5eE5RVUZMTEU5QlFVd3NRMEZCWVN4VlFVRndRaXhMUVVGdFF5eFJRVUZ1UXl4SlFVTkRMRU5CUVVNc1dVRkJXU3hUUVVGYUxFTkJRWE5DTEZGQlFYUkNMRk5CUVhGRExFMUJRVXNzVDBGQlRDeERRVUZoTEZWQlFXeEVMRU5CUkU0c1JVRkRkVVU3UVVGRGNrVXNiMEpCUVZrc1UwRkJXaXhEUVVGelFpeEhRVUYwUWl4VFFVRm5ReXhOUVVGTExFOUJRVXdzUTBGQllTeFZRVUUzUXp0QlFVTkVPMEZCY2tKMVFqdEJRWE5DZWtJN08wRkJla1J0UWp0QlFVRkJPMEZCUVVFc2RVTkJNa1JJTzBGQlEyWXNaVUZCVHl4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEdGQlFYSkNMRU5CUVcxRExHVkJRVzVETEVOQlFWQTdRVUZEUkR0QlFUZEViVUk3UVVGQlFUdEJRVUZCTERSQ1FTdEVURHRCUVVGQkxGbEJRVmdzUzBGQlZ5eDFSVUZCU0N4RFFVRkhPenRCUVVOaUxGbEJRVTBzWTBGQll5eExRVUZMTEdOQlFVd3NSVUZCY0VJN1FVRkRRU3haUVVGTkxGZEJRVmNzUzBGQlN5eExRVUZNTEVOQlFWa3NVMEZCVXl4TFFVRkxMRTlCUVV3c1EwRkJZU3hIUVVGaUxFZEJRVzFDTEV0QlFVc3NUMEZCVEN4RFFVRmhMRWRCUVhwRExFTkJRVVFzUjBGQmEwUXNSMEZCTjBRc1EwRkJha0k3TzBGQlJVRXNXVUZCU1N4UlFVRlJMRXRCUVVzc1QwRkJUQ3hEUVVGaExFZEJRWHBDTEVWQlFUaENPMEZCUXpWQ0xHdENRVUZSTEV0QlFWSXNRMEZCYVVJc1NVRkJha0lzYlVKQlFXMURMRXRCUVc1RE8wRkJRMEVzYVVKQlFVOHNTMEZCVUR0QlFVTkVPenRCUVVWRUxGbEJRVWtzVVVGQlVTeExRVUZMTEU5QlFVd3NRMEZCWVN4SFFVRjZRaXhGUVVFNFFqdEJRVU0xUWl4clFrRkJVU3hMUVVGU0xFTkJRV2xDTEVsQlFXcENMRzFDUVVGdFF5eExRVUZ1UXp0QlFVTkJMR2xDUVVGUExFdEJRVkE3UVVGRFJEczdRVUZGUkN4dlFrRkJXU3haUVVGYUxFTkJRWGxDTEdWQlFYcENMRTlCUVRaRExFdEJRVGRET3p0QlFVVkJPMEZCUTBFc1dVRkJTU3hMUVVGTExFOUJRVXdzUTBGQllTeExRVUZxUWl4RlFVRjNRanRCUVVOMFFpeHpRa0ZCV1N4VFFVRmFMRWRCUVRKQ0xGRkJRVE5DTzBGQlEwUTdPMEZCUlVRN1FVRkRRU3h2UWtGQldTeExRVUZhTEVOQlFXdENMRXRCUVd4Q0xFZEJRVFpDTEZGQlFUZENPenRCUVVWQkxHVkJRVThzU1VGQlVEdEJRVU5FTzBGQmVFWnRRanRCUVVGQk8wRkJRVUVzWjBOQk1FWlhPMEZCUVVFc1dVRkJka0lzWTBGQmRVSXNkVVZCUVU0c1NVRkJUVHM3UVVGRE4wSXNXVUZCU1N4RFFVRkRMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV3hDTEVWQlFUSkNPMEZCUTNwQ0xHdENRVUZSTEV0QlFWSXNRMEZCYVVJc1NVRkJha0k3UVVGRFFTeHBRa0ZCVHl4TFFVRlFPMEZCUTBRN08wRkJSVVFzV1VGQlRTeGpRVUZqTEV0QlFVc3NZMEZCVEN4RlFVRndRanM3UVVGRlFTeFpRVUZKTEd0Q1FVTkRMRU5CUVVNc1dVRkJXU3hUUVVGYUxFTkJRWE5DTEZGQlFYUkNMRU5CUVN0Q0xIVkNRVUV2UWl4RFFVUk9MRVZCUXl0RU8wRkJRemRFTEhOQ1FVRlpMRk5CUVZvc1EwRkJjMElzUjBGQmRFSXNRMEZCTUVJc2RVSkJRVEZDTzBGQlEwUTdPMEZCUlVRc1dVRkJTU3hEUVVGRExHTkJRVVFzU1VGRFF5eFpRVUZaTEZOQlFWb3NRMEZCYzBJc1VVRkJkRUlzUTBGQkswSXNkVUpCUVM5Q0xFTkJSRXdzUlVGRE9FUTdRVUZETlVRc2MwSkJRVmtzVTBGQldpeERRVUZ6UWl4TlFVRjBRaXhEUVVFMlFpeDFRa0ZCTjBJN1FVRkRSRHM3UVVGRlJDeGxRVUZQTEVsQlFWQTdRVUZEUkR0QlFUZEhiVUk3UVVGQlFUdEJRVUZCTERaQ1FTdEhZanRCUVVOTUxHRkJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1MwRkJja0lzUTBGQk1rSXNUVUZCTTBJc1IwRkJkVU1zUzBGQlN5eFBRVUZNTEVOQlFXRXNUVUZCY0VRN1FVRkRRU3hoUVVGTExGbEJRVXdzUTBGQmEwSXNhVUpCUVUwc1NVRkJlRUk3UVVGRFFTeGhRVUZMTEZsQlFVd3NRMEZCYTBJc2FVSkJRVTBzUzBGQmVFSTdPMEZCUlVFc1pVRkJUeXhKUVVGUU8wRkJRMFE3UVVGeVNHMUNPMEZCUVVFN1FVRkJRU3cyUWtGMVNHSTdRVUZEVEN4aFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEV0QlFYSkNMRU5CUVRKQ0xFMUJRVE5DTEVkQlFXOURMRXRCUVhCRE8wRkJRMEVzWVVGQlN5eFpRVUZNTEVOQlFXdENMR2xDUVVGTkxFbEJRWGhDTzBGQlEwRXNZVUZCU3l4WlFVRk1MRU5CUVd0Q0xHbENRVUZOTEUxQlFYaENPenRCUVVWQkxHVkJRVThzU1VGQlVEdEJRVU5FTzBGQk4waHRRanRCUVVGQk8wRkJRVUVzYjBOQkswaERMRTlCTDBoRUxFVkJLMGhWTzBGQlF6VkNMRFpIUVVFeVFpeFJRVUV6UWl4RlFVRnhReXhQUVVGeVF6dEJRVU5FTzBGQmFrbHRRanM3UVVGQlFUdEJRVUZCT3p0QlFXOUpkRUlzVTBGQlR5eFJRVUZRTzBGQlEwUXNRMEZ5U1dkQ0xFVkJRV3BDT3p0clFrRjFTV1VzVVRzN096czdPenM3T3pzN096dEJRekZKWmpzN096dEJRVU5CT3p0QlFVTkJPenM3TzBGQlEwRTdPenM3T3pzN095dGxRVkpCT3pzN096czdPMEZCVlVFc1NVRkJUU3hOUVVGUExGbEJRVTA3UVVGRGFrSTdPenM3T3p0QlFVMUJMRTFCUVUwc1QwRkJUeXhMUVVGaU8wRkJRMEVzVFVGQlRTeFZRVUZWTEU5QlFXaENPMEZCUTBFc1RVRkJUU3h4UWtGQmNVSXNSVUZCTTBJN1FVRkhRU3hOUVVGTkxIZENRVUYzUWl4RlFVRTVRanRCUVVWQkxFMUJRVTBzZFVKQlFYVkNMRmRCUVRkQ096dEJRVVZCT3pzN096czdRVUZvUW1sQ0xFMUJjMEpZTEVkQmRFSlhPMEZCUVVFN08wRkJkMEptTEcxQ1FVRXdRanRCUVVGQkxGVkJRV1FzVDBGQll5eDFSVUZCU2l4RlFVRkpPenRCUVVGQk96dEJRVUZCTEhWSFFVTnNRaXhKUVVSclFpeEZRVU5hTEU5QlJGa3NSVUZEU0N4clFrRkVSeXhGUVVOcFFpeFBRVVJxUWl4RlFVTXdRaXh4UWtGRU1VSXNSVUZEYVVRc1MwRkVha1FzUlVGRGQwUXNTMEZFZUVRN1FVRkZla0k3TzBGQk1VSmpPMEZCUVVFN1FVRkJRU3cyUWtFMFFsSTdRVUZEVEN4WlFVRkpMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNVMEZCY2tJc1EwRkJLMElzVVVGQkwwSXNRMEZCZDBNc1VVRkJlRU1zUTBGQlNpeEZRVUYxUkR0QlFVTnlSQ3hwUWtGQlR5eExRVUZRTzBGQlEwUTdPMEZCUlVRc1dVRkJUU3hMUVVGTExFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1dVRkJja0lzUTBGQmEwTXNUVUZCYkVNc1EwRkJXRHRCUVVOQkxGbEJRVTBzVFVGQlRTdzRRa0ZCYTBJc1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQkwwSXNSVUZCZDBNc1MwRkJlRU1zUTBGQldqdEJRVU5CTEZsQlFVMHNWVUZCVlN4TlFVRk5MRWxCUVVrc1owSkJRVW9zYjBKQlFYTkRMRWxCUVhSRExGRkJRVTRzUjBGQmQwUXNTVUZCZUVVN08wRkJSVUVzV1VGQlNTeFBRVUZLTEVWQlFXRTdRVUZEV0N4clFrRkJVU3hQUVVGU0xFTkJRV2RDTEZWQlFVTXNSMEZCUkN4RlFVRlRPMEZCUTNaQ0xHZENRVUZKTEVsQlFVa3NVMEZCU2l4RFFVRmpMRkZCUVdRc1EwRkJkVUlzVVVGQmRrSXNRMEZCU2l4RlFVRnpRenRCUVVOd1F5eHJRa0ZCU1N4VFFVRktMRU5CUVdNc1RVRkJaQ3hEUVVGeFFpeFJRVUZ5UWp0QlFVTkVPMEZCUTBRc1owSkJRVWtzV1VGQlNpeERRVUZwUWl4bFFVRnFRaXhGUVVGclF5eExRVUZzUXp0QlFVTkVMRmRCVEVRN1FVRk5SRHM3UVVGRlJDeGhRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xGTkJRWEpDTEVOQlFTdENMRWRCUVM5Q0xFTkJRVzFETEZGQlFXNURPMEZCUTBFc1lVRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4WlFVRnlRaXhEUVVGclF5eGxRVUZzUXl4RlFVRnRSQ3hKUVVGdVJEczdRVUZGUVN4WlFVRk5MR0ZCUVdFc1UwRkJVeXhoUVVGVUxFTkJRWFZDTEVWQlFYWkNMRU5CUVc1Q08wRkJRMEVzV1VGQlRTeGpRVUZqTEZkQlFWY3NWVUZCV0N4RFFVRnpRaXhuUWtGQmRFSXNRMEZCZFVNc2IwSkJRWFpETEVOQlFYQkNPenRCUVVWQkxGbEJRVWtzVjBGQlNpeEZRVUZwUWp0QlFVTm1MSE5DUVVGWkxFOUJRVm9zUTBGQmIwSXNWVUZCUXl4SFFVRkVMRVZCUVZNN1FVRkRNMElzWjBKQlFVa3NTVUZCU1N4VFFVRktMRU5CUVdNc1VVRkJaQ3hEUVVGMVFpeFJRVUYyUWl4RFFVRktMRVZCUVhORE8wRkJRM0JETEd0Q1FVRkpMRk5CUVVvc1EwRkJZeXhOUVVGa0xFTkJRWEZDTEZGQlFYSkNPMEZCUTBRN1FVRkRSaXhYUVVwRU8wRkJTMFE3TzBGQlJVUXNiVUpCUVZjc1UwRkJXQ3hEUVVGeFFpeEhRVUZ5UWl4RFFVRjVRaXhUUVVGNlFqczdRVUZGUVN4dFFrRkJWeXhaUVVGTk8wRkJRMllzWTBGQlRTeFhRVUZYTEZOQlFWZ3NVVUZCVnl4SFFVRk5PMEZCUTNKQ0xIVkNRVUZYTEZOQlFWZ3NRMEZCY1VJc1RVRkJja0lzUTBGQk5FSXNVMEZCTlVJN1FVRkRRU3gxUWtGQlZ5eFRRVUZZTEVOQlFYRkNMRWRCUVhKQ0xFTkJRWGxDTEZGQlFYcENPMEZCUTBFc2RVSkJRVmNzVTBGQldDeERRVUZ4UWl4TlFVRnlRaXhEUVVFMFFpeFRRVUUxUWp0QlFVTkJMSFZDUVVGWExHMUNRVUZZTEVOQlFTdENMR2xDUVVGTkxHTkJRWEpETEVWQlFYRkVMRkZCUVhKRU8wRkJRMFFzVjBGTVJEczdRVUZQUVN4eFFrRkJWeXhuUWtGQldDeERRVUUwUWl4cFFrRkJUU3hqUVVGc1F5eEZRVUZyUkN4UlFVRnNSRHM3UVVGRlFTeHhRa0ZCVnl4VFFVRllMRU5CUVhGQ0xFZEJRWEpDTEVOQlFYbENMRk5CUVhwQ08wRkJSVVFzVTBGYVJDeEZRVmxITEVWQldrZzdPMEZCWTBFc1pVRkJUeXhKUVVGUU8wRkJRMFE3UVVFM1JXTTdRVUZCUVR0QlFVRkJMRFpDUVN0RlVqdEJRVU5NTEZsQlFVa3NRMEZCUXl4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEZOQlFYSkNMRU5CUVN0Q0xGRkJRUzlDTEVOQlFYZERMRkZCUVhoRExFTkJRVXdzUlVGQmQwUTdRVUZEZEVRc2FVSkJRVThzUzBGQlVEdEJRVU5FT3p0QlFVVkVMRmxCUVVrc1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4VFFVRnlRaXhEUVVFclFpeFJRVUV2UWl4RFFVRjNReXhSUVVGNFF5eERRVUZLTEVWQlFYVkVPMEZCUTNKRUxHVkJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1UwRkJja0lzUTBGQkswSXNUVUZCTDBJc1EwRkJjME1zVVVGQmRFTTdRVUZEUkRzN1FVRkZSQ3hoUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRmxCUVhKQ0xFTkJRV3RETEdWQlFXeERMRVZCUVcxRUxFdEJRVzVFT3p0QlFVVkJMRmxCUVUwc1MwRkJTeXhMUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRmxCUVhKQ0xFTkJRV3RETEUxQlFXeERMRU5CUVZnN1FVRkRRU3haUVVGTkxHRkJRV0VzVTBGQlV5eGhRVUZVTEVOQlFYVkNMRVZCUVhaQ0xFTkJRVzVDT3p0QlFVVkJMRmxCUVVrc1YwRkJWeXhUUVVGWUxFTkJRWEZDTEZGQlFYSkNMRU5CUVRoQ0xGRkJRVGxDTEVOQlFVb3NSVUZCTmtNN1FVRkRNME1zY1VKQlFWY3NVMEZCV0N4RFFVRnhRaXhOUVVGeVFpeERRVUUwUWl4UlFVRTFRanRCUVVORU96dEJRVVZFTEdWQlFVOHNTVUZCVUR0QlFVTkVPMEZCYkVkak8wRkJRVUU3UVVGQlFTeHZRMEZ2UjAwc1QwRndSMDRzUlVGdlIyVTdRVUZETlVJc2JVZEJRVEpDTEVkQlFUTkNMRVZCUVdkRExFOUJRV2hETzBGQlEwUTdRVUYwUjJNN08wRkJRVUU3UVVGQlFUczdRVUY1UjJwQ096czdPenM3TzBGQlMwRXNUVUZCVFN4aFFVRmhMRVZCUVc1Q096dEJRVVZCTEUxQlFVMHNUMEZCVHl4VFFVRlRMR2RDUVVGVUxHOUNRVUV5UXl4SlFVRXpReXhSUVVGaU8wRkJRMEVzVFVGQlNTeEpRVUZLTEVWQlFWVTdRVUZEVWl4VFFVRkxMRTlCUVV3c1EwRkJZU3hWUVVGRExFOUJRVVFzUlVGQllUdEJRVU40UWp0QlFVTkJMRlZCUVUwc1UwRkJVeXd5UTBGQmIwSXNUMEZCY0VJc1JVRkJOa0lzYTBKQlFUZENMRVZCUVdsRUxIRkNRVUZxUkN4RFFVRm1PMEZCUTBFc1lVRkJUeXhQUVVGUUxFZEJRV2xDTEU5QlFXcENPenRCUVVWQkxHbENRVUZYTEVsQlFWZ3NRMEZCWjBJc1NVRkJTU3hoUVVGS0xFTkJRV3RDTEUxQlFXeENMRU5CUVdoQ08wRkJRMFFzUzBGT1JEdEJRVTlFT3p0QlFVVkVMRTFCUVVrc1NVRkJTaXhGUVVGVk8wRkJRMUlzWVVGQlV5eG5Ra0ZCVkN4RFFVRXdRaXhQUVVFeFFpeEZRVUZ0UXl4VlFVRkRMRXRCUVVRc1JVRkJWenRCUVVNMVF5eFZRVUZOTEdsQ1FVRnBRaXhOUVVGTkxFMUJRVTRzUTBGQllTeFpRVUZpTEVOQlFUQkNMR0ZCUVRGQ0xFTkJRWFpDTzBGQlEwRXNWVUZCU1N4clFrRkJhMElzYlVKQlFXMUNMRWxCUVhwRExFVkJRU3RETzBGQlF6ZERMRmxCUVUwc1MwRkJTeXhOUVVGTkxFMUJRVTRzUTBGQllTeFpRVUZpTEVOQlFUQkNMRTFCUVRGQ0xFTkJRVmc3TzBGQlJVRXNXVUZCVFN4WlFVRlpMRmRCUVZjc1NVRkJXQ3hEUVVGblFqdEJRVUZCTEdsQ1FVRkxMRVZCUVVVc1ZVRkJSaXhIUVVGbExGbEJRV1lzUTBGQk5FSXNUVUZCTlVJc1RVRkJkME1zUlVGQk4wTTdRVUZCUVN4VFFVRm9RaXhEUVVGc1FqczdRVUZGUVN4WlFVRkpMRU5CUVVNc1UwRkJUQ3hGUVVGblFqdEJRVU5rTzBGQlEwUTdPMEZCUlVRc2EwSkJRVlVzU1VGQlZqdEJRVU5FTzBGQlEwWXNTMEZpUkR0QlFXTkVPenRCUVVWRUxGTkJRVThzUjBGQlVEdEJRVU5FTEVOQk4wbFhMRVZCUVZvN08ydENRU3RKWlN4SE96czdPenM3T3pzN096czdPenM3UVVONlNtWTdPenM3T3p0QlFVMUJMRWxCUVUwc1QwRkJVU3haUVVGTk8wRkJRMnhDT3pzN096czdRVUZOUVN4TlFVRk5MRTlCUVU4c1RVRkJZanRCUVVOQkxFMUJRVTBzVlVGQlZTeFBRVUZvUWpzN1FVRkZRVHM3T3pzN08wRkJWbXRDTEUxQlowSmFMRWxCYUVKWk8wRkJhVUpvUWpzN096dEJRVWxCTEd0Q1FVRlpMRWxCUVZvc1JVRkJhMEk3UVVGQlFUczdRVUZEYUVJc1ZVRkJTU3hSUVVGUExFbEJRVkFzZVVOQlFVOHNTVUZCVUN4UFFVRm5RaXhSUVVGd1FpeEZRVUU0UWp0QlFVTTFRaXhqUVVGTkxFbEJRVWtzUzBGQlNpeERRVUZoTEVsQlFXSXNVMEZCY1VJc1QwRkJja0lzUTBGQlRqdEJRVU5FTzBGQlEwUXNWMEZCU3l4SlFVRk1MRWRCUVZrc1NVRkJXanRCUVVOQkxGZEJRVXNzVTBGQlRDeEhRVUZwUWl4SlFVRnFRanRCUVVORU96dEJRVE5DWlR0QlFVRkJPMEZCUVVFc2EwTkJOa0pLTzBGQlExWXNXVUZCVFN4TlFVRk5MRWxCUVVrc1kwRkJTaXhGUVVGYU8wRkJRMEVzV1VGQlNTeHhRa0ZCY1VJc1IwRkJja0lzU1VGQk5FSXNTMEZCU3l4SlFVRk1MRU5CUVZVc1YwRkJWaXhMUVVFd1FpeEpRVUV4UkN4RlFVRm5SVHRCUVVNNVJDeGpRVUZKTEdWQlFVb3NSMEZCYzBJc1NVRkJkRUk3UVVGRFJEdEJRVU5FTEdWQlFVOHNSMEZCVUR0QlFVTkVPenRCUVVWRU96czdPenRCUVhKRFowSTdRVUZCUVR0QlFVRkJMRzFEUVhsRFV6dEJRVUZCTEZsQlFXUXNUMEZCWXl4MVJVRkJTaXhGUVVGSk96dEJRVU4yUWl4aFFVRkxMRWxCUVUwc1IwRkJXQ3hKUVVGclFpeFBRVUZzUWl4RlFVRXlRanRCUVVONlFpeGxRVUZMTEVkQlFVd3NRMEZCVXl4blFrRkJWQ3hEUVVFd1FpeEhRVUV4UWl4RlFVRXJRaXhSUVVGUkxFZEJRVklzUTBGQkwwSTdRVUZEUkR0QlFVTkdPMEZCTjBObE8wRkJRVUU3UVVGQlFTeHhRMEVyUTBRN1FVRkJRVHM3UVVGRFlpeFpRVUZKTEZGQlFVOHNTMEZCU3l4SlFVRk1MRU5CUVZVc1QwRkJha0lzVFVGQk5rSXNVVUZCYWtNc1JVRkJNa003UVVGRGVrTXNaVUZCU3l4VlFVRk1MRU5CUVdkQ0xFdEJRVXNzU1VGQlRDeERRVUZWTEU5QlFURkNPMEZCUTBRN08wRkJSVVFzV1VGQlNTeFBRVUZQTEV0QlFVc3NTVUZCVEN4RFFVRlZMRTlCUVdwQ0xFdEJRVFpDTEZGQlFXcERMRVZCUVRKRE8wRkJRM3BETEdWQlFVc3NSMEZCVEN4RFFVRlRMRTlCUVZRc1IwRkJiVUlzUzBGQlN5eEpRVUZNTEVOQlFWVXNUMEZCTjBJN1FVRkRRU3hsUVVGTExFZEJRVXdzUTBGQlV5eFRRVUZVTEVkQlFYRkNMRmxCUVUwN1FVRkRla0lzYTBKQlFVc3NVMEZCVEN4SFFVRnBRaXhyUWtGQmFrSTdRVUZEUkN4WFFVWkVPMEZCUjBRN08wRkJSVVFzV1VGQlNTeFBRVUZQTEV0QlFVc3NTVUZCVEN4RFFVRlZMRmRCUVdwQ0xFdEJRV2xETEZGQlFYSkRMRVZCUVN0RE8wRkJRemRETEdWQlFVc3NWVUZCVEN4RFFVRm5RaXhGUVVGRkxHZENRVUZuUWl4TFFVRkxMRWxCUVV3c1EwRkJWU3hYUVVFMVFpeEZRVUZvUWp0QlFVTkVPenRCUVVWRUxGbEJRVWtzUzBGQlN5eEpRVUZNTEVOQlFWVXNVVUZCVml4TFFVRjFRaXhMUVVGMlFpeEpRVUZuUXl4TFFVRkxMRWRCUVV3c1EwRkJVeXhuUWtGQk4wTXNSVUZCSzBRN1FVRkROMFFzWlVGQlN5eEhRVUZNTEVOQlFWTXNaMEpCUVZRc1EwRkJNRUlzWjBOQlFURkNPMEZCUTBRN1FVRkRSanRCUVd4RlpUdEJRVUZCTzBGQlFVRXNjME5CYjBWQk8wRkJRMlFzV1VGQlNTeFhRVUZYTEVsQlFXWTdRVUZEUVN4WlFVRkpMRXRCUVVzc1NVRkJUQ3hEUVVGVkxGRkJRVllzUzBGQmRVSXNUVUZCTTBJc1JVRkJiVU03UVVGRGFrTXNZMEZCU1R0QlFVTkdMSFZDUVVGWExFdEJRVXNzUzBGQlRDeERRVUZYTEV0QlFVc3NSMEZCVEN4RFFVRlRMRmxCUVhCQ0xFTkJRVmc3UVVGRFJDeFhRVVpFTEVOQlJVVXNUMEZCVHl4TFFVRlFMRVZCUVdNN1FVRkRaQ3hwUWtGQlN5eFRRVUZNTEVkQlFXbENMR2RDUVVGcVFqdEJRVU5FTzBGQlEwWXNVMEZPUkN4TlFVMVBMRWxCUVVrc1MwRkJTeXhKUVVGTUxFTkJRVlVzVVVGQlZpeExRVUYxUWl4TFFVRXpRaXhGUVVGclF6dEJRVU4yUXl4eFFrRkJWeXhMUVVGTExFZEJRVXdzUTBGQlV5eFhRVUZ3UWp0QlFVTkVMRk5CUmswc1RVRkZRVHRCUVVOTUxIRkNRVUZYTEV0QlFVc3NSMEZCVEN4RFFVRlRMRmxCUVhCQ08wRkJRMFE3UVVGRFJDeGxRVUZQTEZGQlFWQTdRVUZEUkR0QlFXeEdaVHRCUVVGQk8wRkJRVUVzYlVOQmIwWklPMEZCUVVFN08wRkJRMWdzWVVGQlN5eEhRVUZNTEVkQlFWY3NTMEZCU3l4VFFVRk1MRVZCUVZnN1FVRkRRU3hoUVVGTExFZEJRVXdzUTBGQlV5eEpRVUZVTEVOQlFXTXNTMEZCU3l4SlFVRk1MRU5CUVZVc1RVRkJlRUlzUlVGQlowTXNTMEZCU3l4SlFVRk1MRU5CUVZVc1IwRkJNVU1zUlVGQkswTXNTVUZCTDBNN1FVRkRRU3hoUVVGTExGbEJRVXc3TzBGQlJVRXNZVUZCU3l4SFFVRk1MRU5CUVZNc2EwSkJRVlFzUjBGQk9FSXNXVUZCVFR0QlFVTnNReXhqUVVGSkxGTkJRVk1zVDBGQlN5eEhRVUZNTEVOQlFWTXNWVUZCYkVJc1RVRkJhME1zUTBGQmRFTXNSVUZCZVVNN1FVRkRka01zWjBKQlFVMHNVMEZCVXl4UFFVRkxMRWRCUVV3c1EwRkJVeXhOUVVGVUxFTkJRV2RDTEZGQlFXaENMRVZCUVdZN08wRkJSVUU3UVVGRFFTeG5Ra0ZCU1N4UFFVRlBMRTlCUVVzc1NVRkJUQ3hEUVVGVkxGRkJRV3BDTEV0QlFUaENMRlZCUVd4RExFVkJRVGhETzBGQlF6VkRMSEZDUVVGTExFbEJRVXdzUTBGQlZTeFJRVUZXTEVOQlFXMUNMRTlCUVVzc1UwRkJlRUlzUlVGQmJVTXNUMEZCU3l4SFFVRjRRenRCUVVORU96dEJRVVZFTzBGQlEwRXNaMEpCUVVrc1QwRkJUeXhEUVVGUUxFMUJRV01zUjBGQmJFSXNSVUZCZFVJN1FVRkRja0lzYTBKQlFVa3NUMEZCVHl4UFFVRkxMRWxCUVV3c1EwRkJWU3hQUVVGcVFpeExRVUUyUWl4VlFVRnFReXhGUVVFMlF6dEJRVU16UXl4MVFrRkJTeXhKUVVGTUxFTkJRVlVzVDBGQlZpeERRVUZyUWl4UFFVRkxMR0ZCUVV3c1JVRkJiRUlzUlVGQmQwTXNUMEZCU3l4SFFVRTNRenRCUVVORU8wRkJRMFE3UVVGRFJEczdRVUZGUkR0QlFVTkJMR2RDUVVGSkxFOUJRVThzVDBGQlN5eEpRVUZNTEVOQlFWVXNTMEZCYWtJc1MwRkJNa0lzVlVGQkwwSXNSVUZCTWtNN1FVRkRla003UVVGRFFTeHhRa0ZCVHl4VlFVRlFMRU5CUVd0Q0xGbEJRVTA3UVVGRGRFSXNkVUpCUVVzc1NVRkJUQ3hEUVVGVkxFdEJRVllzUTBGQlowSXNUMEZCU3l4VFFVRnlRaXhGUVVGblF5eFBRVUZMTEVkQlFYSkRPMEZCUTBRc1pVRkdSQ3hGUVVWSExFTkJSa2c3UVVGSFJEdEJRVU5HTzBGQlEwWXNVMEY2UWtRN1FVRXdRa0VzWVVGQlN5eEhRVUZNTEVOQlFWTXNTVUZCVkN4RFFVRmpMRXRCUVVzc1NVRkJUQ3hEUVVGVkxFbEJRWGhDT3p0QlFVVkJMR1ZCUVU4c1NVRkJVRHRCUVVORU8wRkJkRWhsTzBGQlFVRTdRVUZCUVN3clFrRjNTRkE3UVVGRFVDeGhRVUZMTEZOQlFVd3NSMEZCYVVJc1ZVRkJha0k3UVVGRFFTeFpRVUZKTEV0QlFVc3NSMEZCVkN4RlFVRmpPMEZCUTFvc1pVRkJTeXhIUVVGTUxFTkJRVk1zUzBGQlZEdEJRVU5FTzBGQlEwUXNZVUZCU3l4SFFVRk1MRWRCUVZjc1NVRkJXRHRCUVVORU96dEJRVVZFT3p0QlFXaEpaMEk3UVVGQlFUczdPMEZCYzBsb1FqczdRVUZGUVR0QlFYaEpaMElzYjBOQmVVbExMRWxCZWtsTUxFVkJlVWxYTzBGQlEzcENMR1ZCUVU4c1NVRkJTU3hKUVVGS0xFTkJRVk1zU1VGQlZDeEZRVUZsTEZWQlFXWXNSVUZCVUR0QlFVTkVPMEZCTTBsbE8wRkJRVUU3UVVGQlFTd3dRa0ZyU1VzN1FVRkRia0lzWlVGQlZTeEpRVUZXTEZOQlFXdENMRTlCUVd4Q08wRkJRMFE3UVVGd1NXVTdPMEZCUVVFN1FVRkJRVHM3UVVFNFNXeENMRk5CUVU4c1NVRkJVRHRCUVVORUxFTkJMMGxaTEVWQlFXSTdPMnRDUVdsS1pTeEpPenM3T3pzN096dFJRM1pLUXl4dFFpeEhRVUZCTEcxQ08xRkJUVUVzYjBJc1IwRkJRU3h2UWp0UlFVdEJMR2xDTEVkQlFVRXNhVUk3UVVGWVZDeFRRVUZUTEcxQ1FVRlVMRU5CUVRaQ0xGTkJRVGRDTEVWQlFYZERMRlZCUVhoRExFVkJRV2xGTzBGQlFVRXNUVUZCWWl4TlFVRmhMSFZGUVVGS0xFVkJRVWs3TzBGQlEzUkZMRTFCUVUwc1owSkJRVzFDTEZOQlFXNUNMRmxCUVcxRExGVkJRWHBETzBGQlEwRXNVMEZCVHl4aFFVRlFMRU5CUVhGQ0xFbEJRVWtzVjBGQlNpeERRVUZuUWl4aFFVRm9RaXhGUVVFclFpeEZRVUZGTEdOQlFVWXNSVUZCTDBJc1EwRkJja0k3UVVGRFFTeFhRVUZUTEdGQlFWUXNRMEZCZFVJc1NVRkJTU3hYUVVGS0xFTkJRV2RDTEdGQlFXaENMRVZCUVN0Q0xFVkJRVVVzWTBGQlJpeEZRVUV2UWl4RFFVRjJRanRCUVVORU96dEJRVVZOTEZOQlFWTXNiMEpCUVZRc1EwRkJPRUlzVlVGQk9VSXNSVUZCTUVNc1UwRkJNVU1zUlVGQmNVUXNWVUZCY2tRc1JVRkJPRVU3UVVGQlFTeE5RVUZpTEUxQlFXRXNkVVZCUVVvc1JVRkJTVHM3UVVGRGJrWXNUVUZCVFN4blFrRkJiVUlzVTBGQmJrSXNXVUZCYlVNc1ZVRkJla003UVVGRFFTeGhRVUZYTEdGQlFWZ3NRMEZCZVVJc1NVRkJTU3hYUVVGS0xFTkJRV2RDTEdGQlFXaENMRVZCUVN0Q0xFVkJRVVVzWTBGQlJpeEZRVUV2UWl4RFFVRjZRanRCUVVORU96dEJRVVZOTEZOQlFWTXNhVUpCUVZRc1EwRkJNa0lzVTBGQk0wSXNSVUZCYzBNc1VVRkJkRU1zUlVGQk5rUTdRVUZCUVN4TlFVRmlMRTFCUVdFc2RVVkJRVW9zUlVGQlNUczdRVUZEYkVVc1RVRkJUU3huUWtGQmJVSXNVVUZCYmtJc1UwRkJLMElzVTBGQmNrTTdRVUZEUVN4VFFVRlBMR0ZCUVZBc1EwRkJjVUlzU1VGQlNTeFhRVUZLTEVOQlFXZENMR0ZCUVdoQ0xFVkJRU3RDTEVWQlFVVXNZMEZCUml4RlFVRXZRaXhEUVVGeVFqdEJRVU5CTEZkQlFWTXNZVUZCVkN4RFFVRjFRaXhKUVVGSkxGZEJRVW9zUTBGQlowSXNZVUZCYUVJc1JVRkJLMElzUlVGQlJTeGpRVUZHTEVWQlFTOUNMRU5CUVhaQ08wRkJRMFE3T3pzN096czdPMEZEWmtRN1FVRkRRU3hKUVVGSkxFOUJRVThzVFVGQlVDeExRVUZyUWl4WFFVRjBRaXhGUVVGdFF6dEJRVU5xUXl4VFFVRlBMR2RDUVVGUUxFTkJRWGRDTEU5QlFYaENMRVZCUVdsRExGbEJRVTA3UVVGRGNrTXNXVUZCVVN4TFFVRlNMRU5CUVdNc2RVZEJRV1E3UVVGRFJDeEhRVVpFTzBGQlIwUTdPMEZCUlVRN1FVRkRRU3hKUVVGSkxHdENRVUZyUWl4RFFVRkRMRmRCUVVRc1JVRkJZeXhYUVVGa0xFVkJRVEpDTEZOQlFUTkNMRU5CUVhSQ08wRkJRMEVzU1VGQlNTeGpRVUZqTEV0QlFXeENPenRCUVVWQkxFbEJRVWtzVDBGQlR5eE5RVUZRTEV0QlFXdENMRmRCUVhSQ0xFVkJRVzFETzBGQlEycERMRTFCUVVzc2EwSkJRV3RDTEUxQlFXNUNMRWxCUVRoQ0xFOUJRVThzWVVGQlVDeEpRVUYzUWl4dlFrRkJiMElzWVVGQk9VVXNSVUZCTmtZN1FVRkRNMFlzYTBKQlFXTXNTVUZCWkR0QlFVTkJMSE5DUVVGclFpeERRVUZETEZsQlFVUXNSVUZCWlN4WFFVRm1MRVZCUVRSQ0xGVkJRVFZDTEVWQlFYZERMR0ZCUVhoRExFTkJRV3hDTzBGQlEwUTdPMEZCUlVRc1RVRkJTU3hQUVVGUExGTkJRVkFzUTBGQmFVSXNZMEZCY2tJc1JVRkJjVU03UVVGRGJrTXNjMEpCUVd0Q0xFTkJRVU1zWVVGQlJDeEZRVUZuUWl4aFFVRm9RaXhGUVVFclFpeFhRVUV2UWl4RlFVRTBReXhsUVVFMVF5eERRVUZzUWp0QlFVTkVMRWRCUmtRc1RVRkZUeXhKUVVGSkxFOUJRVThzVTBGQlVDeERRVUZwUWl4blFrRkJja0lzUlVGQmRVTTdRVUZETlVNc2MwSkJRV3RDTEVOQlFVTXNaVUZCUkN4RlFVRnJRaXhsUVVGc1FpeEZRVUZ0UXl4aFFVRnVReXhGUVVGclJDeHBRa0ZCYkVRc1EwRkJiRUk3UVVGRFJEdEJRVU5HT3p0QlFVVkVMRWxCUVUwc1MwRkJTeXhUUVVGVExHRkJRVlFzUTBGQmRVSXNTMEZCZGtJc1EwRkJXRHRCUVVOQkxFbEJRVTBzWTBGQll5eERRVU5zUWl4RlFVRkZMRTFCUVUwc1dVRkJVaXhGUVVGelFpeFBRVUZQTEdsQ1FVRTNRaXhGUVVGblJDeExRVUZMTEdWQlFYSkVMRVZCUkd0Q0xFVkJSV3hDTEVWQlFVVXNUVUZCVFN4bFFVRlNMRVZCUVhsQ0xFOUJRVThzYVVKQlFXaERMRVZCUVcxRUxFdEJRVXNzWlVGQmVFUXNSVUZHYTBJc1JVRkhiRUlzUlVGQlJTeE5RVUZOTEdOQlFWSXNSVUZCZDBJc1QwRkJUeXh0UWtGQkwwSXNSVUZCYjBRc1MwRkJTeXhwUWtGQmVrUXNSVUZJYTBJc1JVRkpiRUlzUlVGQlJTeE5RVUZOTEd0Q1FVRlNMRVZCUVRSQ0xFOUJRVThzZFVKQlFXNURMRVZCUVRSRUxFdEJRVXNzY1VKQlFXcEZMRVZCU210Q0xFTkJRWEJDTzBGQlRVRXNTVUZCVFN4aFFVRmhMRU5CUTJwQ0xFVkJRVVVzVFVGQlRTeFhRVUZTTEVWQlFYRkNMRTlCUVU4c1owSkJRVFZDTEVWQlFUaERMRXRCUVVzc1kwRkJia1FzUlVGRWFVSXNSVUZGYWtJc1JVRkJSU3hOUVVGTkxHTkJRVklzUlVGQmQwSXNUMEZCVHl4blFrRkJMMElzUlVGQmFVUXNTMEZCU3l4alFVRjBSQ3hGUVVacFFpeEZRVWRxUWl4RlFVRkZMRTFCUVUwc1lVRkJVaXhGUVVGMVFpeFBRVUZQTEd0Q1FVRTVRaXhGUVVGclJDeExRVUZMTEdkQ1FVRjJSQ3hGUVVocFFpeEZRVWxxUWl4RlFVRkZMRTFCUVUwc2FVSkJRVklzUlVGQk1rSXNUMEZCVHl4elFrRkJiRU1zUlVGQk1FUXNTMEZCU3l4dlFrRkJMMFFzUlVGS2FVSXNRMEZCYmtJN08wRkJUMEVzU1VGQlRTeHJRa0ZCYTBJc1dVRkJXU3hKUVVGYUxFTkJRV2xDTzBGQlFVRXNVMEZCU3l4SFFVRkhMRXRCUVVnc1EwRkJVeXhGUVVGRkxFbEJRVmdzVFVGQmNVSXNVMEZCTVVJN1FVRkJRU3hEUVVGcVFpeEZRVUZ6UkN4TFFVRTVSVHRCUVVOQkxFbEJRVTBzWjBKQlFXZENMRmxCUVZrc1NVRkJXaXhEUVVGcFFqdEJRVUZCTEZOQlFVc3NSMEZCUnl4TFFVRklMRU5CUVZNc1JVRkJSU3hKUVVGWUxFMUJRWEZDTEZOQlFURkNPMEZCUVVFc1EwRkJha0lzUlVGQmMwUXNSMEZCTlVVN1FVRkRRU3hKUVVGTkxHbENRVUZwUWl4WFFVRlhMRWxCUVZnc1EwRkJaMEk3UVVGQlFTeFRRVUZMTEVkQlFVY3NTMEZCU0N4RFFVRlRMRVZCUVVVc1NVRkJXQ3hOUVVGeFFpeFRRVUV4UWp0QlFVRkJMRU5CUVdoQ0xFVkJRWEZFTEV0QlFUVkZPMEZCUTBFc1NVRkJUU3hsUVVGbExGZEJRVmNzU1VGQldDeERRVUZuUWp0QlFVRkJMRk5CUVVzc1IwRkJSeXhMUVVGSUxFTkJRVk1zUlVGQlJTeEpRVUZZTEUxQlFYRkNMRk5CUVRGQ08wRkJRVUVzUTBGQmFFSXNSVUZCY1VRc1IwRkJNVVU3TzJ0Q1FVVmxPMEZCUTJJN1FVRkRRU3huUWtGQll5eFhRVVpFT3p0QlFVbGlPMEZCUTBFc2EwSkJRV2RDTEZGQlRFZzdRVUZOWWl4dFFrRkJhVUlzVTBGT1NqdEJRVTlpTEhkQ1FVRnpRaXhqUVZCVU8wRkJVV0lzWjBOQlFUaENMRzFDUVZKcVFqdEJRVk5pTEdkRFFVRTRRaXh0UWtGVWFrSTdPMEZCVjJJN1FVRkRRU3hSUVVGTkxFMUJXazg3UVVGaFlpeFRRVUZQTEU5QllrMDdRVUZqWWl4UlFVRk5MRTFCWkU4N1FVRmxZaXhWUVVGUkxGRkJaa3M3TzBGQmFVSmlPMEZCUTBFc1VVRkJUU3hOUVd4Q1R6czdRVUZ2UW1JN1FVRkRRU3hUUVVGUExHZENRVUZuUWl4RFFVRm9RaXhEUVhKQ1RUdEJRWE5DWWl4UlFVRk5MR2RDUVVGblFpeERRVUZvUWl4RFFYUkNUenRCUVhWQ1lpeFBRVUZMTEdkQ1FVRm5RaXhEUVVGb1FpeERRWFpDVVR0QlFYZENZaXhWUVVGUkxFOUJRVThzWjBKQlFXZENMRU5CUVdoQ0xFTkJRVkFzUzBGQk9FSXNWMEZCT1VJc1IwRkJORU1zU1VGQk5VTXNSMEZCYlVRc1owSkJRV2RDTEVOQlFXaENMRU5CZUVJNVF6czdRVUV3UW1JN1FVRkRRU3h2UWtGQmEwSXNaVUV6UWt3N1FVRTBRbUlzYTBKQlFXZENMR0ZCTlVKSU96dEJRVGhDWWp0QlFVTkJMRzFDUVVGcFFpeGpRUzlDU2p0QlFXZERZaXhwUWtGQlpTeFpRV2hEUmpzN1FVRnJRMkk3UVVGRFFTeHBRa0ZCWlR0QlFXNURSaXhET3pzN096czdPenM3T3pzN096czdRVU16UTJZN096czdPenRCUVUxQkxFbEJRVTBzVTBGQlZTeFpRVUZOTzBGQlEzQkNPenM3T3pzN1FVRk5RU3hOUVVGTkxFOUJRVThzWVVGQllqdEJRVU5CTEUxQlFVMHNWVUZCVlN4UFFVRm9RanM3UVVGRlFUczdPenM3TzBGQlZtOUNMRTFCWjBKa0xFMUJhRUpqTzBGQmFVSnNRaXh2UWtGQldTeFBRVUZhTEVWQlFYRkNMRWxCUVhKQ0xFVkJRVEpDTzBGQlFVRTdPMEZCUTNwQ0xGZEJRVXNzVDBGQlRDeEhRVUZsTEU5QlFXWTdRVUZEUVN4WFFVRkxMRWxCUVV3c1IwRkJXU3hKUVVGYU96dEJRVVZCTEZWQlFVa3NRMEZCUXl4TFFVRkxMRk5CUVV3c1EwRkJaU3hMUVVGTExFOUJRWEJDTEVOQlFVd3NSVUZCYlVNN1FVRkRha003UVVGRFJEczdRVUZGUkR0QlFVTkJMRlZCUVVrc1MwRkJTeXhQUVVGTUxFTkJRV0VzVFVGQllpeEpRVUYxUWl4TFFVRkxMRTlCUVV3c1EwRkJZU3hOUVVGaUxFZEJRWE5DTEVOQlFXcEVMRVZCUVc5RU8wRkJRMnhFTEdGQlFVc3NVVUZCVEN4RFFVRmpMRXRCUVVzc1QwRkJia0k3UVVGRFJDeFBRVVpFTEUxQlJVODdRVUZEVER0QlFVTkJMR0ZCUVVzc1QwRkJUQ3hEUVVGaExFdEJRVXNzVDBGQmJFSTdRVUZEUkR0QlFVTkdPenRCUVVWRU96dEJRV3hEYTBJN1FVRkJRVHM3TzBGQmQwTnNRanM3T3pzN1FVRjRRMnRDTEdkRFFUWkRVaXhQUVRkRFVTeEZRVFpEUXp0QlFVTnFRaXhaUVVGSkxGbEJRVmtzU1VGQmFFSXNSVUZCYzBJN1FVRkRjRUlzYVVKQlFVOHNTMEZCVUR0QlFVTkVPMEZCUTBRc1pVRkJVU3hSUVVGUExFbEJRVkFzZVVOQlFVOHNTVUZCVUN4UFFVRm5RaXhSUVVGb1FpeEhRVUV5UWl4dFFrRkJiVUlzU1VGQk9VTXNSMEZCY1VRc1YwRkJWeXhSUVVGUExFOUJRVkFzZVVOQlFVOHNUMEZCVUN4UFFVRnRRaXhSUVVFNVFpeEpRVUV3UXl4UFFVRlBMRkZCUVZFc1VVRkJaaXhMUVVFMFFpeFJRVUYwUlN4SlFVRnJSaXhQUVVGUExGRkJRVkVzVVVGQlppeExRVUUwUWl4UlFVRXpTenRCUVVORU96dEJRVVZFT3pzN096czdRVUZ3Ukd0Q08wRkJRVUU3UVVGQlFTdzRRa0Y1UkZZc1QwRjZSRlVzUlVGNVJFUXNTVUY2UkVNc1JVRjVSRXM3UVVGRGNrSXNXVUZCU1N4RlFVRkZMR2xDUVVGcFFpeFBRVUZ1UWl4RFFVRktMRVZCUVdsRE8wRkJReTlDTEd0Q1FVRlJMRk5CUVZJc1IwRkJiMElzU1VGQmNFSTdRVUZEUkN4VFFVWkVMRTFCUlU4N1FVRkRUQ3hyUWtGQlVTeFhRVUZTTEVkQlFYTkNMRWxCUVhSQ08wRkJRMFE3UVVGRFJqczdRVUZGUkRzN096czdPMEZCYWtWclFqdEJRVUZCTzBGQlFVRXNPRUpCYzBWV0xFOUJkRVZWTEVWQmMwVkVMRWxCZEVWRExFVkJjMFZMTzBGQlEzSkNMR2RDUVVGUkxGTkJRVklzUjBGQmIwSXNTVUZCY0VJN1FVRkRSRHM3UVVGRlJEczdPenM3T3p0QlFURkZhMEk3UVVGQlFUdEJRVUZCTEcxRFFXZEdUQ3hQUVdoR1N5eEZRV2RHU1N4SlFXaEdTaXhGUVdkR1ZTeEpRV2hHVml4RlFXZEdaMEk3UVVGRGFFTXNaMEpCUVZFc1dVRkJVaXhEUVVGeFFpeEpRVUZ5UWl4RlFVRXlRaXhKUVVFelFqdEJRVU5FTzBGQmJFWnBRanRCUVVGQk8wRkJRVUVzT0VKQmIwWldMRTlCY0VaVkxFVkJiMFpFTzBGQlEyWXNXVUZCU1N4UFFVRlBMRkZCUVZFc1dVRkJVaXhEUVVGeFFpeFhRVUZ5UWl4RFFVRllPMEZCUTBFc1dVRkJTU3hEUVVGRExFbEJRVXdzUlVGQlZ6dEJRVU5VTzBGQlEwUTdPMEZCUlVRc1pVRkJUeXhMUVVGTExFbEJRVXdzUlVGQlVEczdRVUZGUVN4WlFVRk5MRWxCUVVrc2FVUkJRVlk3UVVGRFFTeFpRVUZKTEZWQlFVbzdPMEZCUlVFc1pVRkJUeXhKUVVGSkxFVkJRVVVzU1VGQlJpeERRVUZQTEVsQlFWQXNRMEZCV0N4RlFVRjVRanRCUVVOMlFpeGpRVUZOTEUxQlFVMHNSVUZCUlN4RFFVRkdMRVZCUVVzc1NVRkJUQ3hGUVVGYU8wRkJRMEVzWTBGQlRTeFJRVUZSTEVWQlFVVXNRMEZCUml4RlFVRkxMRWxCUVV3c1IwRkJXU3hQUVVGYUxFTkJRVzlDTEVkQlFYQkNMRVZCUVhsQ0xFVkJRWHBDTEVOQlFXUTdRVUZEUVN4alFVRkpMRmxCUVZrc1MwRkJTeXhKUVVGTUxFTkJRVlVzUzBGQlZpeERRVUZvUWpzN1FVRkZRU3hqUVVGSkxFTkJRVU1zUzBGQlN5eEpRVUZNTEVOQlFWVXNTMEZCVml4RFFVRk1MRVZCUVhWQ08wRkJRM0pDTEc5Q1FVRlJMRWRCUVZJc1EwRkJaU3hKUVVGbUxHMUNRVUZwUXl4TFFVRnFRenRCUVVOQkxIZENRVUZaTEV0QlFWbzdRVUZEUkRzN1FVRkZSQ3hqUVVGTkxHRkJRV0VzVVVGQlVTeEpRVUZKTEUxQlFVb3NRMEZCVnl4RFFVRllMRVZCUVdNc1YwRkJaQ3hGUVVGU0xFZEJRWE5ETEVsQlFVa3NTMEZCU2l4RFFVRlZMRU5CUVZZc1EwRkJla1E3TzBGQlJVRXNZMEZCU1N4TFFVRkxMRlZCUVV3c1EwRkJTaXhGUVVGelFqdEJRVU53UWl4cFFrRkJTeXhWUVVGTUxFVkJRV2xDTEU5QlFXcENMRVZCUVRCQ0xGTkJRVEZDTzBGQlEwUXNWMEZHUkN4TlFVVlBPMEZCUTB3c2FVSkJRVXNzV1VGQlRDeERRVUZyUWl4UFFVRnNRaXhGUVVFeVFpeEhRVUV6UWl4RlFVRm5ReXhUUVVGb1F6dEJRVU5FTzBGQlEwWTdRVUZEUmpzN1FVRkZSRHM3T3p0QlFXNUlhMEk3UVVGQlFUdEJRVUZCTEN0Q1FYTklWQ3hQUVhSSVV5eEZRWE5JUVR0QlFVRkJPenRCUVVOb1FpeG5Ra0ZCVVN4UFFVRlNMRU5CUVdkQ08wRkJRVUVzYVVKQlFVMHNUVUZCU3l4UFFVRk1MRU5CUVdFc1JVRkJZaXhEUVVGT08wRkJRVUVzVTBGQmFFSTdRVUZEUkR0QlFYaElhVUk3UVVGQlFUdEJRVUZCTERCQ1FXOURSenRCUVVOdVFpeGxRVUZWTEVsQlFWWXNVMEZCYTBJc1QwRkJiRUk3UVVGRFJEdEJRWFJEYVVJN08wRkJRVUU3UVVGQlFUczdRVUV5U0hCQ0xGTkJRVThzVFVGQlVEdEJRVU5FTEVOQk5VaGpMRVZCUVdZN08ydENRVGhJWlN4Tk96czdPenM3T3pzN096dHhha0pEY0VsbU96czdPenM3TzBGQlMwRTdPenM3T3pzN08wRkJSVUVzU1VGQlRTeFBRVUZSTEZsQlFVMDdRVUZEYkVJN096czdPenRCUVUxQkxFMUJRVTBzVDBGQlR5eE5RVUZpTzBGQlEwRXNUVUZCVFN4VlFVRlZMRTlCUVdoQ08wRkJRMEVzVFVGQlRTeHhRa0ZCY1VJN1FVRkRla0lzYjBKQlFXZENMRWxCUkZNN1FVRkZla0lzV1VGQlVTeEpRVVpwUWp0QlFVZDZRaXhqUVVGVkxFbEJTR1U3UVVGSmVrSXNWVUZCVFRzN1FVRkhVanM3T3pzN08wRkJVREpDTEVkQlFUTkNPMEZCVkd0Q0xFMUJjMEphTEVsQmRFSlpPMEZCZFVKb1FqczdPenRCUVVsQkxHOUNRVUV3UWp0QlFVRkJMRlZCUVdRc1QwRkJZeXgxUlVGQlNpeEZRVUZKT3p0QlFVRkJPenRCUVVONFFpeFhRVUZMTEU5QlFVd3NSMEZCWlN4UFFVRlBMRTFCUVZBc1EwRkJZeXhyUWtGQlpDeEZRVUZyUXl4UFFVRnNReXhEUVVGbU96dEJRVVZCTEZWQlFVa3NUMEZCVHl4TFFVRkxMRTlCUVV3c1EwRkJZU3hqUVVGd1FpeExRVUYxUXl4UlFVRXpReXhGUVVGeFJEdEJRVU51UkN4alFVRk5MRWxCUVVrc1MwRkJTaXhEUVVGaExFbEJRV0lzT0VSQlFVNDdRVUZEUkRzN1FVRkZSQ3hWUVVGSkxFdEJRVXNzVDBGQlRDeERRVUZoTEVsQlFXSXNTMEZCYzBJc1NVRkJNVUlzUlVGQlowTTdRVUZET1VJc1kwRkJUU3hKUVVGSkxFdEJRVW9zUTBGQllTeEpRVUZpTEhGRFFVRk9PMEZCUTBRN08wRkJSVVFzVlVGQlNTeFJRVUZQTEV0QlFVc3NUMEZCVEN4RFFVRmhMRWxCUVdJc1EwRkJhMElzUzBGQlN5eFBRVUZNTEVOQlFXRXNZMEZCTDBJc1EwRkJVQ3hOUVVFd1JDeFJRVUU1UkN4RlFVRjNSVHRCUVVOMFJTeGpRVUZOTEVsQlFVa3NTMEZCU2l4RFFVRmhMRWxCUVdJc2JVVkJRVTQ3UVVGRFJEczdRVUZGUkN4WFFVRkxMRk5CUVV3c1EwRkJaU3hMUVVGTExFOUJRVXdzUTBGQllTeE5RVUUxUWl4RlFVRnZReXhMUVVGTExFOUJRVXdzUTBGQllTeFJRVUZxUkR0QlFVTkVPenRCUVRORFpUdEJRVUZCTzBGQlFVRXNhME5CYVVSS08wRkJRMVlzWlVGQlR5eExRVUZMTEU5QlFVd3NRMEZCWVN4TlFVRndRanRCUVVORU8wRkJia1JsTzBGQlFVRTdRVUZCUVN3d1EwRnhSRWs3UVVGRGJFSXNaVUZCVHl4TFFVRkxMRTlCUVV3c1EwRkJZU3hqUVVGd1FqdEJRVU5FT3p0QlFVVkVPenM3T3pzN1FVRjZSR2RDTzBGQlFVRTdRVUZCUVN4blEwRTRSRTRzVFVFNVJFMHNSVUU0UkhGQ08wRkJRVUVzV1VGQmJrSXNWVUZCYlVJc2RVVkJRVTRzU1VGQlRUczdRVUZEYmtNc1dVRkJTU3hSUVVGUExFdEJRVXNzVDBGQlRDeERRVUZoTEVsQlFXSXNRMEZCYTBJc1RVRkJiRUlzUTBGQlVDeE5RVUZ4UXl4UlFVRjZReXhGUVVGdFJEdEJRVU5xUkN4clFrRkJVU3hMUVVGU0xFTkJRV2xDTEVsQlFXcENMRlZCUVRCQ0xFMUJRVEZDTEd0RFFVRTJSQ3hMUVVGTExFOUJRVXdzUTBGQllTeGpRVUV4UlR0QlFVTkVMRk5CUmtRc1RVRkZUenRCUVVOTUxHVkJRVXNzVDBGQlRDeERRVUZoTEUxQlFXSXNSMEZCYzBJc1RVRkJkRUk3UVVGRFJEczdRVUZGUkN4WlFVRkpMRlZCUVVvc1JVRkJaMEk3UVVGRFpDeGxRVUZMTEZWQlFVdzdRVUZEUkR0QlFVTkdPMEZCZUVWbE8wRkJRVUU3UVVGQlFTeHhRMEV3UlVRN1FVRkRZaXhsUVVGUExFOUJRVThzU1VGQlVDeERRVUZaTEV0QlFVc3NUMEZCVEN4RFFVRmhMRWxCUVhwQ0xFTkJRVkE3UVVGRFJEdEJRVFZGWlR0QlFVRkJPMEZCUVVFc2NVTkJPRVZyUXp0QlFVRkJMRmxCUVhKRExFdEJRWEZETEhWRlFVRTNRaXhKUVVFMlFqdEJRVUZCTEZsQlFYWkNMR2RDUVVGMVFpeDFSVUZCU2l4RlFVRkpPenRCUVVOb1JDeFpRVUZKTEU5QlFVOHNTMEZCVUN4TFFVRnBRaXhSUVVGeVFpeEZRVUVyUWp0QlFVTTNRaXhwUWtGQlR5eFRRVUZRTzBGQlEwUTdPMEZCUlVRc1dVRkJUU3hSUVVGUkxFMUJRVTBzUzBGQlRpeERRVUZaTEcxQ1FVRmFMRU5CUVdRN1FVRkRRU3haUVVGSkxFdEJRVW9zUlVGQlZ6dEJRVU5VTEd0Q1FVRlJMRTFCUVUwc1QwRkJUaXhEUVVGakxFMUJRVTBzUTBGQlRpeERRVUZrTEVWQlFYZENMR2xDUVVGcFFpeE5RVUZOTEVOQlFVNHNRMEZCYWtJc1EwRkJlRUlzUTBGQlVqdEJRVU5FT3p0QlFVVkVMRmxCUVVrc1RVRkJUU3hMUVVGT0xFTkJRVmtzYlVKQlFWb3NRMEZCU2l4RlFVRnpRenRCUVVOd1F5eHBRa0ZCVHl4TFFVRkxMRmxCUVV3c1EwRkJhMElzUzBGQmJFSXNSVUZCZVVJc1owSkJRWHBDTEVOQlFWQTdRVUZEUkRzN1FVRkZSQ3hsUVVGUExFdEJRVkE3UVVGRFJEdEJRVGRHWlR0QlFVRkJPMEZCUVVFc2EwTkJLMFoxUWp0QlFVRkJPenRCUVVGQkxGbEJRVGRDTEU5QlFUWkNMSFZGUVVGdVFpeEpRVUZ0UWp0QlFVRkJMRmxCUVdJc1RVRkJZU3gxUlVGQlNpeEZRVUZKT3p0QlFVTnlReXhaUVVGSkxFOUJRVThzUzBGQlN5eFBRVUZNTEVOQlFXRXNTVUZCWWl4RFFVRnJRaXhMUVVGTExFOUJRVXdzUTBGQllTeE5RVUV2UWl4RFFVRllPMEZCUTBFc1dVRkJTU3hEUVVGRExFbEJRVXdzUlVGQlZ6dEJRVU5VTEdsQ1FVRlBMRXRCUVVzc1QwRkJUQ3hEUVVGaExFbEJRV0lzUTBGQmEwSXNTMEZCU3l4UFFVRk1MRU5CUVdFc1kwRkJMMElzUTBGQlVEdEJRVU5FT3p0QlFVVkVMRmxCUVVrc1dVRkJXU3hKUVVGYUxFbEJRVzlDTEZsQlFWa3NSMEZCYUVNc1NVRkJkVU1zVFVGQlRTeFBRVUZPTEVOQlFXTXNUMEZCWkN4RFFVRXpReXhGUVVGdFJUdEJRVU5xUlN4alFVRkpMRTFCUVUwc1QwRkJUaXhEUVVGakxFOUJRV1FzUTBGQlNpeEZRVUUwUWp0QlFVTXhRaXhuUWtGQlRTeFBRVUZQTEU5QlFVOHNTVUZCVUN4RFFVRlpMRWxCUVZvc1JVRkJhMElzVFVGQmJFSXNRMEZCZVVJN1FVRkJRU3h4UWtGQlR5eFJRVUZSTEU5QlFWSXNRMEZCWjBJc1IwRkJhRUlzU1VGQmRVSXNRMEZCUXl4RFFVRXZRanRCUVVGQkxHRkJRWHBDTEVOQlFXSTdRVUZEUVN4blFrRkJUU3hsUVVGbExFVkJRWEpDTzBGQlEwRXNhVUpCUVVzc1QwRkJUQ3hEUVVGaExHVkJRVTg3UVVGRGJFSXNNa0pCUVdFc1IwRkJZaXhKUVVGdlFpeE5RVUZMTEZsQlFVd3NRMEZCYTBJc1MwRkJTeXhIUVVGTUxFTkJRV3hDTEVWQlFUWkNMRTFCUVRkQ0xFTkJRWEJDTzBGQlEwUXNZVUZHUkR0QlFVZEJMRzFDUVVGUExGbEJRVkE3UVVGRFJEczdRVUZGUkN4alFVRk5MRlZCUVZVc1JVRkJhRUk3UVVGRFFTeGxRVUZMTEVsQlFVMHNSMEZCV0N4SlFVRnJRaXhKUVVGc1FpeEZRVUYzUWp0QlFVTjBRaXh2UWtGQlVTeEhRVUZTTEVsQlFXVXNTMEZCU3l4WlFVRk1MRU5CUVd0Q0xFdEJRVXNzUjBGQlRDeERRVUZzUWl4RlFVRTJRaXhOUVVFM1FpeERRVUZtTzBGQlEwUTdPMEZCUlVRc2FVSkJRVThzVDBGQlVEdEJRVU5FT3p0QlFVVkVMR1ZCUVU4c1MwRkJTeXhaUVVGTUxFTkJRV3RDTEV0QlFVc3NUMEZCVEN4RFFVRnNRaXhGUVVGcFF5eE5RVUZxUXl4RFFVRlFPMEZCUTBRN08wRkJSVVE3TzBGQk1VaG5RanRCUVVGQk8wRkJRVUVzTUVKQk1raGxPMEZCUVVFc1dVRkJOMElzVDBGQk5rSXNkVVZCUVc1Q0xFbEJRVzFDTzBGQlFVRXNXVUZCWWl4TlFVRmhMSFZGUVVGS0xFVkJRVWs3TzBGQlF6ZENMR1ZCUVU4c1MwRkJTeXhUUVVGTUxFTkJRV1VzVDBGQlppeEZRVUYzUWl4TlFVRjRRaXhEUVVGUU8wRkJRMFE3TzBGQlJVUTdPenM3TzBGQkwwaG5RanRCUVVGQk8wRkJRVUVzYVVOQmJVbE1MRTlCYmtsTExFVkJiVWxKTzBGQlEyeENMRmxCUVVrc1QwRkJUeXhQUVVGUUxFdEJRVzFDTEZkQlFYWkNMRVZCUVc5RE8wRkJRMnhETEc5Q1FVRlZMRk5CUVZNc1owSkJRVlFzUTBGQk1FSXNZVUZCTVVJc1EwRkJWanRCUVVORU96dEJRVVZFTEZsQlFVa3NUMEZCVHl4UFFVRlFMRXRCUVcxQ0xGRkJRWFpDTEVWQlFXbERPMEZCUXk5Q0xHOUNRVUZWTEZOQlFWTXNZVUZCVkN4RFFVRjFRaXhQUVVGMlFpeERRVUZXTzBGQlEwUTdPMEZCUlVRc05rSkJRVmNzVDBGQldDeEZRVUZ2UWl4TFFVRkxMRU5CUVV3c1JVRkJjRUk3UVVGRFJEczdRVUZGUkRzN1FVRXZTV2RDTzBGQlFVRTdRVUZCUVN4dlEwRm5Ta3NzVDBGb1Nrd3NSVUZuU21NN1FVRkROVUlzWlVGQlR5eEpRVUZKTEVsQlFVb3NRMEZCVXl4UFFVRlVMRU5CUVZBN1FVRkRSRHRCUVd4S1pUdEJRVUZCTzBGQlFVRXNNRUpCTmtOTE8wRkJRMjVDTEdWQlFWVXNTVUZCVml4VFFVRnJRaXhQUVVGc1FqdEJRVU5FTzBGQkwwTmxPenRCUVVGQk8wRkJRVUU3TzBGQmNVcHNRaXhUUVVGUExFbEJRVkE3UVVGRFJDeERRWFJLV1N4RlFVRmlPenRyUWtGM1NtVXNTVHM3T3pzN096czdPenM3T3p0QlEzcEtaanM3T3p0QlFVTkJPenM3TzBGQlEwRTdPenM3T3pzN095dGxRVkpCT3pzN096czdRVUZWUVN4SlFVRk5MRlZCUVZjc1dVRkJUVHRCUVVOeVFqczdPenM3TzBGQlRVRXNUVUZCVFN4UFFVRlBMRk5CUVdJN1FVRkRRU3hOUVVGTkxGVkJRVlVzVDBGQmFFSTdRVUZEUVN4TlFVRk5MSEZDUVVGeFFqdEJRVU42UWl4aFFVRlRMRWxCUkdkQ08wRkJSWHBDTEd0Q1FVRmpMRWxCUmxjN1FVRkhla0lzVjBGQlR6dEJRVWhyUWl4SFFVRXpRanRCUVV0QkxFMUJRVTBzZDBKQlFYZENMRVZCUVRsQ096dEJRVWRCT3pzN096czdRVUZxUW5GQ0xFMUJkVUptTEU5QmRrSmxPMEZCUVVFN08wRkJkMEp1UWpzN096dEJRVWxCTEhWQ1FVRXdRanRCUVVGQkxGVkJRV1FzVDBGQll5eDFSVUZCU2l4RlFVRkpPenRCUVVGQk96dEJRVUZCTEc5SVFVTnNRaXhKUVVSclFpeEZRVU5hTEU5QlJGa3NSVUZEU0N4clFrRkVSeXhGUVVOcFFpeFBRVVJxUWl4RlFVTXdRaXh4UWtGRU1VSXNSVUZEYVVRc1NVRkVha1FzUlVGRGRVUXNTMEZFZGtRN08wRkJSM2hDTEZsQlFVc3NSMEZCVEN4SFFVRlhMRWxCUVZnN1FVRkRRU3haUVVGTExHRkJRVXdzUjBGQmNVSXNTVUZCY2tJN08wRkJSVUVzV1VGQlN5eFRRVUZNTEVOQlFXVXNhVUpCUVUwc1kwRkJja0k3TzBGQlJVRXNhVUpCUVZjc1dVRkJUVHRCUVVObUxHTkJRVXNzVlVGQlREdEJRVU5FTEU5QlJrUXNSVUZGUnl4TlFVRkxMRTlCUVV3c1EwRkJZU3haUVVab1FqdEJRVkozUWp0QlFWZDZRanM3UVVGMlEydENPMEZCUVVFN1FVRkJRU3hyUTBGNVExQTdRVUZEVml4bFFVRlBMRXRCUVVzc1RVRkJXanRCUVVORU8wRkJNME5yUWp0QlFVRkJPMEZCUVVFc1owTkJOa05VTEUxQk4wTlRMRVZCTmtORU8wRkJRMmhDTEdGQlFVc3NUVUZCVEN4SFFVRmpMRTFCUVdRN1FVRkRSRHRCUVM5RGEwSTdRVUZCUVR0QlFVRkJMSEZEUVdsRVNqdEJRVUZCT3p0QlFVTmlMR0ZCUVVzc1IwRkJUQ3hIUVVGWExFbEJRVWtzWTBGQlNpeEZRVUZZTzBGQlEwRXNZVUZCU3l4SFFVRk1MRU5CUVZNc1QwRkJWQ3hIUVVGdFFpeExRVUZ1UWpzN1FVRkZRU3haUVVGTkxEQkNRVUYzUWl4SlFVRkpMRWxCUVVvc1IwRkJWeXhQUVVGWUxFVkJRVGxDT3p0QlFVVkJMR0ZCUVVzc1dVRkJUQ3hEUVVGclFpeHBRa0ZCVFN4dlFrRkJlRUlzUlVGQk9FTXNSVUZCUlN4TlFVRk5MRWxCUVVrc1NVRkJTaXhGUVVGU0xFVkJRVGxETEVWQlFXOUZMRXRCUVhCRk96dEJRVVZCTEdGQlFVc3NSMEZCVEN4RFFVRlRMRWxCUVZRc1EwRkJZeXhOUVVGa0xFVkJRWE5DTEVkQlFYUkNMRVZCUVRKQ0xFbEJRVE5DT3p0QlFVVkJMR0ZCUVVzc1IwRkJUQ3hEUVVGVExFOUJRVlFzUjBGQmJVSXNTMEZCU3l4UFFVRk1MRU5CUVdFc1MwRkJZaXhIUVVGeFFpeERRVUY0UXp0QlFVTkJMR0ZCUVVzc1IwRkJUQ3hEUVVGVExGTkJRVlFzUjBGQmNVSXNXVUZCVFR0QlFVTjZRaXhwUWtGQlN5eEhRVUZNTEVOQlFWTXNTMEZCVkR0QlFVTkJMR2xDUVVGTExFZEJRVXdzUjBGQlZ5eEpRVUZZTzBGQlEwUXNVMEZJUkRzN1FVRkxRU3hoUVVGTExFZEJRVXdzUTBGQlV5eE5RVUZVTEVkQlFXdENMRmxCUVUwN1FVRkRkRUlzYVVKQlFVc3NTVUZCVER0QlFVTkVMRk5CUmtRN1FVRkhRU3hoUVVGTExFZEJRVXdzUTBGQlV5eFBRVUZVTEVkQlFXMUNMRmxCUVUwN1FVRkRka0lzYVVKQlFVc3NUVUZCVER0QlFVTkVMRk5CUmtRN08wRkJTVUVzV1VGQlNUdEJRVU5HTEdWQlFVc3NSMEZCVEN4RFFVRlRMRWxCUVZRN1FVRkRSQ3hUUVVaRUxFTkJSVVVzVDBGQlR5eERRVUZRTEVWQlFWVTdRVUZEVml4bFFVRkxMRTFCUVV3N1FVRkRSRHRCUVVOR08wRkJOMFZyUWp0QlFVRkJPMEZCUVVFc05rSkJLMFZhTzBGQlEwd3NZVUZCU3l4WlFVRk1MRU5CUVd0Q0xHbENRVUZOTERSQ1FVRjRRaXhGUVVGelJDeEZRVUZGTEUxQlFVMHNTVUZCU1N4SlFVRktMRVZCUVZJc1JVRkJkRVFzUlVGQk5FVXNTMEZCTlVVN08wRkJSVUVzV1VGQlNTeExRVUZMTEZOQlFVd3NUMEZCY1VJc2FVSkJRVTBzWTBGQkwwSXNSVUZCSzBNN1FVRkROME1zWlVGQlN5eFpRVUZNTEVOQlFXdENMR2xDUVVGTkxHTkJRWGhDTEVWQlFYZERMRVZCUVVVc1RVRkJUU3hKUVVGSkxFbEJRVW9zUlVGQlVpeEZRVUY0UXl4RlFVRTRSQ3hMUVVFNVJEdEJRVU5FT3p0QlFVVkVMR0ZCUVVzc1UwRkJUQ3hEUVVGbExHbENRVUZOTEdOQlFYSkNPMEZCUTBRN1FVRjJSbXRDTzBGQlFVRTdRVUZCUVN3clFrRjVSbFk3UVVGRFVDeGhRVUZMTEZsQlFVd3NRMEZCYTBJc2FVSkJRVTBzTkVKQlFYaENMRVZCUVhORUxFVkJRVVVzVFVGQlRTeEpRVUZKTEVsQlFVb3NSVUZCVWl4RlFVRjBSQ3hGUVVFMFJTeExRVUUxUlRzN1FVRkZRU3haUVVGSkxFdEJRVXNzVTBGQlRDeFBRVUZ4UWl4cFFrRkJUU3hsUVVFdlFpeEZRVUZuUkR0QlFVTTVReXhsUVVGTExGbEJRVXdzUTBGQmEwSXNhVUpCUVUwc1pVRkJlRUlzUlVGQmVVTXNSVUZCUlN4TlFVRk5MRWxCUVVrc1NVRkJTaXhGUVVGU0xFVkJRWHBETEVWQlFTdEVMRXRCUVM5RU8wRkJRMFE3TzBGQlJVUXNZVUZCU3l4VFFVRk1MRU5CUVdVc2FVSkJRVTBzWlVGQmNrSTdRVUZEUkR0QlFXcEhhMEk3UVVGQlFUdEJRVUZCTEcxRFFXMUhUanRCUVVGQk96dEJRVU5ZTEdGQlFVc3NVMEZCVERzN1FVRkZRU3hoUVVGTExGbEJRVXc3TzBGQlJVRXNZVUZCU3l4aFFVRk1MRWRCUVhGQ0xGbEJRVmtzV1VGQlRUdEJRVU55UXl4cFFrRkJTeXhaUVVGTU8wRkJRMFFzVTBGR2IwSXNSVUZGYkVJc1MwRkJTeXhQUVVGTUxFTkJRV0VzUzBGR1N5eERRVUZ5UWp0QlFVZEVPMEZCTTBkclFqdEJRVUZCTzBGQlFVRXNhME5CTmtkUU8wRkJRMVlzV1VGQlNTeExRVUZMTEdGQlFVd3NTMEZCZFVJc1NVRkJNMElzUlVGQmFVTTdRVUZETDBJc2QwSkJRV01zUzBGQlN5eGhRVUZ1UWp0QlFVTkJMR1ZCUVVzc1lVRkJUQ3hIUVVGeFFpeEpRVUZ5UWp0QlFVTkVPMEZCUTBZN1FVRnNTR3RDTzBGQlFVRTdRVUZCUVN4dlEwRnZTRVVzVDBGd1NFWXNSVUZ2U0ZjN1FVRkROVUlzTWtkQlFUSkNMRTlCUVROQ0xFVkJRVzlETEU5QlFYQkRPMEZCUTBRN1FVRjBTR3RDT3p0QlFVRkJPMEZCUVVFN08wRkJlVWh5UWl4VFFVRlBMRTlCUVZBN1FVRkRSQ3hEUVRGSVpTeEZRVUZvUWpzN2EwSkJORWhsTEU4N096czdPenM3T3p0eGFrSkRkRWxtT3pzN096czdRVUZOUVRzN096dEJRVU5CT3pzN096czdPenRCUVVWQkxFbEJRVTBzVVVGQlV5eFpRVUZOTzBGQlEyNUNPenM3T3pzN1FVRk5RU3hOUVVGTkxFOUJRVThzVDBGQllqdEJRVU5CTEUxQlFVMHNWVUZCVlN4UFFVRm9RanRCUVVOQkxFMUJRVTBzY1VKQlFYRkNPMEZCUTNwQ0xHZENRVUZaTEVsQlJHRTdRVUZGZWtJc1lVRkJVeXhKUVVablFqdEJRVWQ2UWl4cFFrRkJZU3hKUVVoWk8wRkJTWHBDTEd0Q1FVRmpPMEZCU2xjc1IwRkJNMEk3TzBGQlQwRXNUVUZCU1N4dlFrRkJTanRCUVVOQk96czdPenM3UVVGcVFtMUNMRTFCZFVKaUxFdEJka0poTzBGQmQwSnFRanM3T3pzN1FVRkxRU3h4UWtGQk1FSTdRVUZCUVN4VlFVRmtMRTlCUVdNc2RVVkJRVW9zUlVGQlNUczdRVUZCUVRzN1FVRkRlRUlzVjBGQlN5eFBRVUZNTEVkQlFXVXNUMEZCVHl4TlFVRlFMRU5CUVdNc2EwSkJRV1FzUlVGQmEwTXNUMEZCYkVNc1EwRkJaanM3UVVGRlFTeFhRVUZMTEV0QlFVd3NSMEZCWVN4RlFVRmlPMEZCUTBFc1YwRkJTeXhQUVVGTUxFZEJRV1VzUzBGQlpqczdRVUZGUVR0QlFVTkJMRmRCUVVzc1kwRkJURHM3UVVGRlFUdEJRVU5CTEZkQlFVc3NWMEZCVER0QlFVTkVPenRCUVVWRU96czdRVUV4UTJsQ08wRkJRVUU3UVVGQlFTeDNRa0V5UTJZc1VVRXpRMlVzUlVFeVEwdzdRVUZEVml4bFFVRlBMRk5CUVZNc1lVRkJWQ3hEUVVGMVFpeFJRVUYyUWl4RFFVRlFPMEZCUTBRN1FVRTNRMmRDTzBGQlFVRTdRVUZCUVN4blEwRXJRMUE3UVVGRFVpeGxRVUZQTEU5QlFVOHNVVUZCVUN4RFFVRm5RaXhKUVVGb1FpeERRVUZ4UWl4TFFVRnlRaXhEUVVFeVFpeExRVUZMTEU5QlFVd3NRMEZCWVN4VlFVRjRReXhGUVVGdlJDeERRVUZ3UkN4RFFVRlFPMEZCUTBRN1FVRnFSR2RDTzBGQlFVRTdRVUZCUVN4M1EwRnRSRU03UVVGRGFFSXNXVUZCVFN4UFFVRlBMRXRCUVVzc1QwRkJUQ3hGUVVGaU8wRkJRMEVzV1VGQlRTeExRVUZMTEVsQlFVa3NUVUZCU2l4RFFVRlhMR1ZCUVZnc1EwRkJXRHRCUVVOQkxGbEJRVTBzVlVGQlZTeEhRVUZITEVsQlFVZ3NRMEZCVVN4SlFVRlNMRU5CUVdoQ096dEJRVVZCTEZsQlFVa3NWMEZCVnl4UlFVRlJMRU5CUVZJc1EwRkJaaXhGUVVFeVFqdEJRVU42UWl4cFFrRkJUeXhSUVVGUkxFTkJRVklzUTBGQlVEdEJRVU5FT3p0QlFVVkVMR1ZCUVU4c1NVRkJVRHRCUVVORU8wRkJOMFJuUWp0QlFVRkJPMEZCUVVFc09FSkJLMFJVTEZGQkwwUlRMRVZCSzBSRE8wRkJRMmhDTEdWQlFVOHNVVUZCVUN4RFFVRm5RaXhKUVVGb1FpeEhRVUV3UWl4TFFVRkxMRTlCUVV3c1EwRkJZU3hWUVVGMlF5eFRRVUZ4UkN4UlFVRnlSRHRCUVVORU8wRkJha1ZuUWp0QlFVRkJPMEZCUVVFc2EwTkJiVVZNTEZOQmJrVkxMRVZCYlVWTkxGTkJia1ZPTEVWQmJVVnBRanRCUVVOb1F5eFpRVUZOTEZGQlFWRXNTMEZCU3l4WlFVRk1MRU5CUVd0Q0xGTkJRV3hDTEVOQlFXUTdRVUZEUVN4WlFVRk5MRkZCUVZFc1MwRkJTeXhaUVVGTUxFTkJRV3RDTEZOQlFXeENMRU5CUVdRN1FVRkRRU3hsUVVGUExGTkJRVk1zUzBGQlZDeEpRVUZyUWl4TlFVRk5MRWxCUVU0c1MwRkJaU3hOUVVGTkxFbEJRVGxETzBGQlEwUTdPMEZCUlVRN096czdPMEZCZWtWcFFqdEJRVUZCTzBGQlFVRXNkVU5CTmtWQk8wRkJRVUU3TzBGQlEyWXNhVUpCUVZNc1owSkJRVlFzUTBGQk1FSXNUMEZCTVVJc1JVRkJiVU03UVVGQlFTeHBRa0ZCVXl4TlFVRkxMRTlCUVV3c1EwRkJZU3hMUVVGaUxFTkJRVlE3UVVGQlFTeFRRVUZ1UXp0QlFVTkJMR1ZCUVU4c1owSkJRVkFzUTBGQmQwSXNWVUZCZUVJc1JVRkJiME03UVVGQlFTeHBRa0ZCVXl4TlFVRkxMR0ZCUVV3c1EwRkJiVUlzUzBGQmJrSXNRMEZCVkR0QlFVRkJMRk5CUVhCRE8wRkJRMEVzWlVGQlR5eG5Ra0ZCVUN4RFFVRjNRaXhaUVVGNFFpeEZRVUZ6UXp0QlFVRkJMR2xDUVVGVExFMUJRVXNzV1VGQlRDeERRVUZyUWl4TFFVRnNRaXhEUVVGVU8wRkJRVUVzVTBGQmRFTTdRVUZEUVN4cFFrRkJVeXhuUWtGQlZDeERRVUV3UWl4clFrRkJNVUlzUlVGQk9FTTdRVUZCUVN4cFFrRkJVeXhOUVVGTExGZEJRVXdzUTBGQmFVSXNTMEZCYWtJc1EwRkJWRHRCUVVGQkxGTkJRVGxETzBGQlEwUTdPMEZCUlVRN08wRkJjRVpwUWp0QlFVRkJPenM3UVVFd1JtcENPenRCUVRGR2FVSXNLMEpCTkVaU0xGRkJOVVpSTEVWQk5FWnhRenRCUVVGQk96dEJRVUZCTEZsQlFXNURMRmxCUVcxRExIVkZRVUZ3UWl4SlFVRnZRanRCUVVGQkxGbEJRV1FzU1VGQll5eDFSVUZCVUN4TFFVRlBPenRCUVVOd1JDeFpRVUZOTEZWQlFWVXNTMEZCU3l4RFFVRk1MRU5CUVU4c1ZVRkJVQ3hEUVVGb1FqdEJRVU5CTEZsQlFVa3NUMEZCU2l4RlFVRmhPMEZCUTFnc1kwRkJUU3hqUVVGakxGRkJRVkVzV1VGQlVpeERRVUZ4UWl4WFFVRnlRaXhEUVVGd1FqczdRVUZGUVN4alFVRkpMRXRCUVVzc1YwRkJUQ3hEUVVGcFFpeFJRVUZxUWl4RlFVRXlRaXhYUVVFelFpeERRVUZLTEVWQlFUWkRPMEZCUXpORE8wRkJRMFE3TzBGQlJVUXNhMEpCUVZFc1UwRkJVaXhEUVVGclFpeE5RVUZzUWl4RFFVRjVRaXhUUVVGNlFqczdRVUZGUVR0QlFVTkJMR2xDUVVGUExFOUJRVkFzUTBGQlpTeFpRVUZtTEVOQlFUUkNMRVZCUVVVc1RVRkJUU3hYUVVGU0xFVkJRVFZDTEVWQlFXMUVMRmRCUVc1RUxFVkJRV2RGTEU5QlFVOHNVVUZCVUN4RFFVRm5RaXhKUVVGb1JqczdRVUZGUVN4bFFVRkxMR2RDUVVGTUxFTkJRWE5DTEZkQlFYUkNMRVZCUVcxRExHbENRVUZOTEVsQlFYcERPMEZCUTBRN08wRkJSVVFzWVVGQlN5eG5Ra0ZCVEN4RFFVRnpRaXhSUVVGMFFpeEZRVUZuUXl4cFFrRkJUU3hKUVVGMFF6czdRVUZGUVN4elFrRkJZeXhSUVVGa096dEJRVVZCTzBGQlEwRXNXVUZCVFN4VlFVRlZMRXRCUVVzc1EwRkJUQ3hyUWtGQmMwSXNVVUZCZEVJc1VVRkJhRUk3TzBGQlJVRXNaMEpCUVZFc1UwRkJVaXhEUVVGclFpeEhRVUZzUWl4RFFVRnpRaXhUUVVGMFFqczdRVUZGUVR0QlFVTkJMRmxCUVUwc1dVRkJXU3hMUVVGTExGbEJRVXdzUTBGQmEwSXNVVUZCYkVJc1EwRkJiRUk3TzBGQlJVRTdRVUZEUVN4WlFVRkpMR0ZCUVdFc1ZVRkJWU3hYUVVGV0xFVkJRV3BDTEVWQlFUQkRPMEZCUTNoRExHOUNRVUZWTEZsQlFWWTdRVUZEUkR0QlFVTkVPenRCUVVWQkxGbEJRVWtzVDBGQlNpeEZRVUZoTzBGQlExZ3NZMEZCVFN4bFFVRmpMRkZCUVZFc1dVRkJVaXhEUVVGeFFpeFhRVUZ5UWl4RFFVRndRanRCUVVOQk8wRkJRMEVzYTBKQlFWRXNTVUZCVWl4SFFVRmxMRWxCUVdZN1FVRkRRU3hyUWtGQlVTeG5Ra0ZCVWl4SFFVRXlRaXhaUVVFelFqczdRVUZGUVN4alFVRk5MSEZDUVVGeFFpeFRRVUZ5UWl4clFrRkJjVUlzUjBGQlRUdEJRVU12UWl4blFrRkJTU3hSUVVGUkxGTkJRVklzUTBGQmEwSXNVVUZCYkVJc1EwRkJNa0lzVTBGQk0wSXNRMEZCU2l4RlFVRXlRenRCUVVONlF5eHpRa0ZCVVN4VFFVRlNMRU5CUVd0Q0xFMUJRV3hDTEVOQlFYbENMRk5CUVhwQ08wRkJRMFE3TzBGQlJVUXNiMEpCUVZFc1UwRkJVaXhEUVVGclFpeE5RVUZzUWl4RFFVRjVRaXhSUVVGUkxFbEJRVklzUjBGQlpTeFZRVUZtTEVkQlFUUkNMRmRCUVhKRU96dEJRVVZCTEcxQ1FVRkxMR2RDUVVGTUxFTkJRWE5DTEZkQlFYUkNMRVZCUVcxRExHbENRVUZOTEV0QlFYcERPMEZCUTBFc2JVSkJRVXNzWjBKQlFVd3NRMEZCYzBJc1VVRkJVU3huUWtGQk9VSXNSVUZCWjBRc2FVSkJRVTBzVFVGQmRFUTdPMEZCUlVFc2IwSkJRVkVzYlVKQlFWSXNRMEZCTkVJc2FVSkJRVTBzWVVGQmJFTXNSVUZCYVVRc2EwSkJRV3BFTzBGQlEwUXNWMEZZUkRzN1FVRmhRU3hqUVVGSkxFdEJRVXNzVDBGQlRDeERRVUZoTEZsQlFXcENMRVZCUVN0Q08wRkJRemRDTEc5Q1FVRlJMR2RDUVVGU0xFTkJRWGxDTEdsQ1FVRk5MR0ZCUVM5Q0xFVkJRVGhETEd0Q1FVRTVRenRCUVVOQkxHOUNRVUZSTEZOQlFWSXNRMEZCYTBJc1IwRkJiRUlzUTBGQmMwSXNVMEZCZEVJN1FVRkRSQ3hYUVVoRUxFMUJSMDg3UVVGRFREdEJRVU5FT3p0QlFVVkVMR3RDUVVGUkxGTkJRVklzUTBGQmEwSXNSMEZCYkVJc1EwRkJjMElzVDBGQlR5eFZRVUZRTEVkQlFXOUNMRmRCUVRGRE8wRkJRMFE3UVVGRFJqdEJRVE5LWjBJN1FVRkJRVHRCUVVGQkxIbERRVFpLUlN4UlFUZEtSaXhGUVRaS1dUdEJRVU16UWl4WlFVRkpMRU5CUVVNc1MwRkJTeXhaUVVGTUxFTkJRV3RDTEZGQlFXeENMRU5CUVV3c1JVRkJhME03UVVGRGFFTXNaVUZCU3l4TFFVRk1MRU5CUVZjc1NVRkJXQ3hEUVVGblFpeHRRa0ZCVXl4UlFVRlVMRU5CUVdoQ08wRkJRMFE3UVVGRFJqdEJRV3BMWjBJN1FVRkJRVHRCUVVGQkxHMURRVzFMU2l4UlFXNUxTU3hGUVcxTFRUdEJRVU55UWl4bFFVRlBMRXRCUVVzc1MwRkJUQ3hEUVVGWExFbEJRVmdzUTBGQlowSTdRVUZCUVN4cFFrRkJVU3hMUVVGTExFbEJRVXdzUzBGQll5eFJRVUYwUWp0QlFVRkJMRk5CUVdoQ0xFTkJRVkE3UVVGRFJEdEJRWEpMWjBJN1FVRkJRVHRCUVVGQkxHOURRWFZMU0N4VFFYWkxSeXhGUVhWTFVUdEJRVU4yUWl4bFFVRlBMRXRCUVVzc1MwRkJUQ3hEUVVGWExFMUJRVmdzUTBGQmEwSTdRVUZCUVN4cFFrRkJVU3hWUVVGVkxFOUJRVllzUTBGQmEwSXNTMEZCU3l4SlFVRjJRaXhKUVVFclFpeERRVUZETEVOQlFYaERPMEZCUVVFc1UwRkJiRUlzUTBGQlVEdEJRVU5FTzBGQmVrdG5RanRCUVVGQk8wRkJRVUVzYzBOQk1rdEVMRWRCTTB0RExFVkJNa3RKTzBGQlEyNUNMR1ZCUVU4c1NVRkJTU3hMUVVGS0xFTkJRVlVzUjBGQlZpeEZRVUZsTEVkQlFXWXNRMEZCYlVJN1FVRkJRU3hwUWtGQlVTeExRVUZMTEVsQlFVd3NSVUZCVWp0QlFVRkJMRk5CUVc1Q0xFTkJRVkE3UVVGRFJEdEJRVGRMWjBJN1FVRkJRVHRCUVVGQkxHZERRU3RMVUN4UlFTOUxUeXhGUVN0TFJ6dEJRVU5zUWl4WlFVRkpMRXRCUVVzc2FVSkJRVXdzUzBGQk1rSXNSMEZCTDBJc1JVRkJiME03UVVGRGJFTTdRVUZEUVN4bFFVRkxMRXRCUVV3c1EwRkJWeXhQUVVGWUxFTkJRVzFDTEZWQlFVTXNTVUZCUkN4RlFVRlZPMEZCUXpOQ0xHbENRVUZMTEdkQ1FVRk1MRU5CUVhOQ0xGRkJRWFJDTzBGQlEwUXNWMEZHUkR0QlFVZEJPMEZCUTBRN08wRkJSVVFzV1VGQlRTeGhRVUZoTEV0QlFVc3NZVUZCVEN4RFFVRnRRaXhMUVVGTExHVkJRVXdzUTBGQmNVSXNTMEZCU3l4cFFrRkJNVUlzUTBGQmJrSXNSVUZCYVVVc1NVRkJha1VzUTBGQmJrSTdRVUZEUVN4dFFrRkJWeXhQUVVGWUxFTkJRVzFDTEZWQlFVTXNTVUZCUkN4RlFVRlZPMEZCUXpOQ0xHVkJRVXNzWjBKQlFVd3NRMEZCYzBJc1VVRkJkRUk3UVVGRFJDeFRRVVpFTzBGQlIwRXNZVUZCU3l4cFFrRkJUQ3hIUVVGNVFpeEpRVUY2UWp0QlFVTkVPMEZCTjB4blFqdEJRVUZCTzBGQlFVRXNhME5CSzB4TUxGbEJMMHhMTEVWQksweG5RenRCUVVGQkxGbEJRWFpDTEdOQlFYVkNMSFZGUVVGT0xFbEJRVTA3TzBGQlF5OURMRmxCUVUwc1lVRkJZU3hMUVVGTExHRkJRVXdzUTBGQmJVSXNTMEZCU3l4bFFVRk1MRU5CUVhGQ0xFdEJRVXNzYVVKQlFURkNMRU5CUVc1Q0xFVkJRV2xGTEVsQlFXcEZMRU5CUVc1Q08wRkJRMEVzYlVKQlFWY3NUMEZCV0N4RFFVRnRRaXhWUVVGRExFbEJRVVFzUlVGQlZUdEJRVU16UWl4bFFVRkxMRmRCUVV3c1EwRkJhVUlzV1VGQmFrSTdRVUZEUVN4alFVRkpMRTlCUVU4c1kwRkJVQ3hMUVVFd1FpeFZRVUU1UWl4RlFVRXdRenRCUVVONFF5eHBRa0ZCU3l4dFFrRkJUQ3hEUVVGNVFpeGpRVUY2UWp0QlFVTkVPMEZCUTBZc1UwRk1SRHRCUVUxQkxHRkJRVXNzYVVKQlFVd3NSMEZCZVVJc1NVRkJla0k3UVVGRFJEdEJRWGhOWjBJN1FVRkJRVHRCUVVGQkxIVkRRVEJOUVN4UlFURk5RU3hGUVRCTlZTeFRRVEZOVml4RlFUQk5lVU03UVVGQlFTeFpRVUZ3UWl4WFFVRnZRaXgxUlVGQlRpeEpRVUZOT3p0QlFVTjRSQ3haUVVGTkxGbEJRVmtzUzBGQlN5eFpRVUZNTEVOQlFXdENMRkZCUVd4Q0xFTkJRV3hDTzBGQlEwRXNXVUZCU1N4VFFVRktMRVZCUVdVN1FVRkRZaXh2UWtGQlZTeGhRVUZXTEVOQlFYZENMRk5CUVhoQ0xFVkJRVzFETEZkQlFXNURPMEZCUTBRN1FVRkRSanRCUVM5TlowSTdRVUZCUVR0QlFVRkJMRGhDUVdsT1ZDeExRV3BPVXl4RlFXbE9SanRCUVVOaUxGbEJRVTBzVjBGQlZ5eE5RVUZOTEUxQlFVNHNRMEZCWVN4WlFVRmlMRU5CUVRCQ0xHVkJRVEZDTEVOQlFXcENPMEZCUTBFc1dVRkJUU3hYUVVGWExFVkJRVVVzVFVGQlRTeE5RVUZPTEVOQlFXRXNXVUZCWWl4RFFVRXdRaXhsUVVFeFFpeE5RVUVyUXl4TlFVRnFSQ3hEUVVGcVFqczdRVUZGUVN4WlFVRkpMRkZCUVVvc1JVRkJZenRCUVVOYUxHTkJRVWtzWVVGQllTeFBRVUZxUWl4RlFVRXdRanRCUVVONFFqdEJRVU5CTEcxQ1FVRlBMRTlCUVZBc1EwRkJaU3hKUVVGbU8wRkJRMEU3UVVGRFJEczdRVUZGUkRzN096czdRVUZMUVN4alFVRkpMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV3BDTEVWQlFUQkNPMEZCUTNoQ0xHbENRVUZMTEU5QlFVd3NRMEZCWVN4UlFVRmlPMEZCUTBRc1YwRkdSQ3hOUVVWUE8wRkJRMHdzYVVKQlFVc3NVVUZCVEN4RFFVRmpMRkZCUVdRc1JVRkJkMElzU1VGQmVFSXNSVUZCT0VJc1VVRkJPVUk3UVVGRFJEdEJRVU5HTzBGQlEwWTdRVUYyVDJkQ08wRkJRVUU3UVVGQlFTeHpRMEY1VDFNN1FVRkJRU3haUVVGYUxFdEJRVmtzZFVWQlFVb3NSVUZCU1RzN1FVRkRlRUlzV1VGQlRTeFhRVUZYTEUxQlFVMHNTMEZCVGl4SFFVRmpMRTFCUVUwc1MwRkJUaXhEUVVGWkxFbEJRVEZDTEVkQlFXbERMRWxCUVd4RU8wRkJRMEVzV1VGQlNTeERRVUZETEZGQlFVd3NSVUZCWlR0QlFVTmlPMEZCUTBRN08wRkJSVVFzWVVGQlN5eFJRVUZNTEVOQlFXTXNVVUZCWkN4RlFVRjNRaXhKUVVGNFFpeEZRVUU0UWl4SlFVRTVRanRCUVVORU8wRkJhRkJuUWp0QlFVRkJPMEZCUVVFc2NVTkJhMUJHTzBGQlEySXNXVUZCVFN4VFFVRlRMRU5CUVVNc1MwRkJTeXhQUVVGTUxFdEJRV2xDTEV0QlFVc3NUMEZCVEN4SFFVRmxMRXRCUVdZc1EwRkJjVUlzUjBGQmNrSXNRMEZCYWtJc1IwRkJOa01zUlVGQk9VTXNSVUZCYTBRc1RVRkJiRVFzUTBGQmVVUTdRVUZCUVN4cFFrRkJTeXhGUVVGRkxFMUJRVVlzUjBGQlZ5eERRVUZvUWp0QlFVRkJMRk5CUVhwRUxFTkJRV1k3UVVGRFFTeFpRVUZKTEU5QlFVOHNUVUZCVUN4SFFVRm5RaXhEUVVGd1FpeEZRVUYxUWp0QlFVTnlRanRCUVVOQkxHbENRVUZQTEV0QlFWQTdRVUZEUkRzN1FVRkZSQ3hoUVVGTExHZENRVUZNTEVOQlFYTkNMRmRCUVhSQ0xFVkJRVzFETEdsQ1FVRk5MRWxCUVhwRExFVkJRU3RETEUxQlFTOURPenRCUVVWQkxGbEJRVTBzVlVGQlZTeExRVUZMTEdWQlFVd3NSVUZCYUVJN1FVRkRRU3haUVVGSkxFOUJRVW9zUlVGQllUdEJRVU5ZTEdWQlFVc3NVVUZCVEN4RFFVRmpMRTlCUVdRN1FVRkRSRHRCUVVOR096dEJRVVZFT3pzN08wRkJhbEZwUWp0QlFVRkJPMEZCUVVFc2IwTkJiMUZJTzBGQlFVRTdPMEZCUTFvc1dVRkJUU3hSUVVGUkxGTkJRVk1zWjBKQlFWUXNRMEZCTUVJc1lVRkJNVUlzUTBGQlpEczdRVUZGUVN4WlFVRkpMRU5CUVVNc1MwRkJUQ3hGUVVGWk8wRkJRMVk3UVVGRFJEczdRVUZGUkN4alFVRk5MRTlCUVU0c1EwRkJZeXhWUVVGRExFbEJRVVFzUlVGQlZUdEJRVU4wUWl4alFVRkpMRmRCUVZjc1MwRkJTeXhaUVVGTUxFTkJRV3RDTEZkQlFXeENMRU5CUVdZN1FVRkRRVHM3T3p0QlFVbEJMR05CUVVrc1EwRkJReXhSUVVGTUxFVkJRV1U3UVVGRFlpeDFRa0ZCVnl4TFFVRkxMRkZCUVdoQ08wRkJRMFE3TzBGQlJVUXNhVUpCUVVzc2EwSkJRVXdzUTBGQmQwSXNVVUZCZUVJN1FVRkRSQ3hUUVZoRU8wRkJXVVE3UVVGMlVtZENPMEZCUVVFN1FVRkJRU3cyUWtGNVVsWXNVVUY2VWxVc1JVRjVVbkZDTzBGQlFVRXNXVUZCY2tJc1dVRkJjVUlzZFVWQlFVNHNTVUZCVFRzN1FVRkRjRU1zWVVGQlN5eHBRa0ZCVEN4SFFVRjVRaXhSUVVGNlFqczdRVUZGUVN4WlFVRkpMR2RDUVVGblFpeGhRVUZoTEVkQlFXcERMRVZCUVhORE8wRkJRM0JETEdWQlFVc3NhMEpCUVV3c1EwRkJkMElzVVVGQmVFSTdRVUZEUkRzN1FVRkZSQ3hsUVVGUExFbEJRVkE3UVVGRFJEdEJRV3BUWjBJN1FVRkJRVHRCUVVGQkxEaENRVzFUWlR0QlFVRkJMRmxCUVRGQ0xHZENRVUV3UWl4MVJVRkJVQ3hMUVVGUE96dEJRVU01UWp0QlFVTkJMRmxCUVVrc1MwRkJTeXhQUVVGVUxFVkJRV3RDTzBGQlEyaENMR2RDUVVGTkxFbEJRVWtzUzBGQlNpeERRVUZoTEVsQlFXSXNlVU5CUVU0N1FVRkRSRHM3UVVGRlJDeGhRVUZMTEU5QlFVd3NSMEZCWlN4SlFVRm1PenRCUVVWQk8wRkJRMEVzV1VGQlNTeFBRVUZQTEU5QlFWZ3NSVUZCYjBJN1FVRkRiRUlzTmtKQlFXMUNMRWxCUVc1Q08wRkJRMFE3TzBGQlJVUXNXVUZCU1N4WFFVRlhMRXRCUVVzc1pVRkJUQ3hGUVVGbU8wRkJRMEVzV1VGQlNTeERRVUZETEV0QlFVc3NXVUZCVEN4RFFVRnJRaXhSUVVGc1FpeERRVUZNTEVWQlFXdERPMEZCUTJoRExIRkNRVUZYTEV0QlFVc3NUMEZCVEN4RFFVRmhMRmRCUVhoQ08wRkJRMFE3TzBGQlJVUXNXVUZCU1N4dlFrRkJiMElzUTBGQlF5eExRVUZMTEU5QlFVd3NRMEZCWVN4WFFVRjBReXhGUVVGdFJEdEJRVU5xUkN4blFrRkJUU3hKUVVGSkxFdEJRVW9zUTBGQllTeEpRVUZpTERKRVFVRk9PMEZCUTBRN08wRkJSVVE3UVVGRFFTeFpRVUZKTEU5QlFVOHNTMEZCV0N4RlFVRnJRanRCUVVOb1FpeHJRa0ZCVVN4SFFVRlNMRU5CUVZrc2QwSkJRWGRDTEZOQlFWTXNWMEZCTjBNN1FVRkRRU3hyUWtGQlVTeEhRVUZTTEVOQlFWa3NTMEZCU3l4TFFVRk1MRU5CUVZjc1RVRkJXQ3hIUVVGdlFpeGpRVUZvUXp0QlFVTkJMR3RDUVVGUkxFZEJRVklzUTBGQldTeGhRVUZoTEZGQlFYcENPMEZCUTBRN08wRkJSVVE3T3pzN1FVRkpRU3haUVVGSkxFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFXcENMRVZCUVRCQ08wRkJRM2hDTEdWQlFVc3NUMEZCVEN4RFFVRmhMRkZCUVdJN1FVRkRSRHM3UVVGRlJDeGhRVUZMTEZGQlFVd3NRMEZCWXl4dFFrRkJiVUlzUzBGQlN5eFBRVUZNTEVOQlFXRXNWMEZCYUVNc1IwRkJPRU1zVVVGQk5VUTdRVUZEUkRzN1FVRkZSRHM3UVVFelZXbENPMEZCUVVFN1FVRkJRU3h2UTBFMFZVa3NUMEUxVlVvc1JVRTBWV0U3UVVGRE5VSXNaVUZCVHl4SlFVRkpMRXRCUVVvc1EwRkJWU3hQUVVGV0xFTkJRVkE3UVVGRFJEdEJRVGxWWjBJN1FVRkJRVHRCUVVGQkxEQkNRWE5HU1R0QlFVTnVRaXhsUVVGVkxFbEJRVllzVTBGQmEwSXNUMEZCYkVJN1FVRkRSRHRCUVhoR1owSTdPMEZCUVVFN1FVRkJRVHM3UVVGcFZtNUNMRk5CUVU4c1MwRkJVRHRCUVVORUxFTkJiRlpoTEVWQlFXUTdPMnRDUVc5V1pTeExPenM3T3pzN096czdPenR4YWtKRE4xWm1PenM3T3pzN1FVRk5RVHM3UVVGRFFUczdPenRCUVVWQkxFbEJRVTBzVDBGQlVTeFpRVUZOTzBGQlEyeENPenM3T3pzN1FVRk5RU3hOUVVGTkxFOUJRVThzVFVGQllqdEJRVU5CTEUxQlFVMHNWVUZCVlN4UFFVRm9RanM3UVVGRlFTeE5RVUZOTEc5Q1FVRnZRaXhwUWtGQk1VSTdPMEZCUlVFN096czdPenRCUVZwclFpeE5RV3RDV2l4SlFXeENXVHRCUVcxQ2FFSTdPenM3UVVGSlFTeHJRa0ZCV1N4UlFVRmFMRVZCUVhOQ08wRkJRVUU3TzBGQlEzQkNMRmRCUVVzc1NVRkJUQ3hIUVVGWkxGRkJRVm83UVVGRFFTeFhRVUZMTEUxQlFVd3NSMEZCWXl4RlFVRmtPMEZCUTBFc1YwRkJTeXhaUVVGTUxFZEJRVzlDTEVsQlFYQkNPMEZCUTBFc1YwRkJTeXhqUVVGTUxFZEJRWE5DTEVsQlFYUkNPMEZCUTBRN08wRkJSVVE3TzBGQk9VSm5RanRCUVVGQk96czdRVUZ2UTJoQ096czdPMEZCY0VOblFpeHJRMEYzUTBvN1FVRkRWaXhsUVVGUExFdEJRVXNzVFVGQldqdEJRVU5FT3p0QlFVVkVPenM3T3p0QlFUVkRaMEk3UVVGQlFUdEJRVUZCTEc5RFFXZEVSanRCUVVOYUxHVkJRVThzUzBGQlN5eFpRVUZhTzBGQlEwUTdPMEZCUlVRN096czdPMEZCY0VSblFqdEJRVUZCTzBGQlFVRXNNRU5CZDBSSk8wRkJRMnhDTEdWQlFVOHNTMEZCU3l4alFVRmFPMEZCUTBRN1FVRXhSR1U3UVVGQlFUdEJRVUZCTEhGRFFUUkVSRHRCUVVGQk96dEJRVU5pTEZsQlFVMHNZMEZCWXl4VFFVRlRMR0ZCUVZRc2EwSkJRWE5ETEV0QlFVc3NTVUZCTTBNc1VVRkJjRUk3TzBGQlJVRXNOa0pCUVZNc1MwRkJTeXhYUVVGTUxFVkJRVlFzUlVGQk5rSXNWVUZCUXl4UlFVRkVMRVZCUVdNN1FVRkRla01zWTBGQlNTeFRRVUZUTEdkQ1FVRlZMRTlCUVZZc1JVRkJiVUlzVVVGQmJrSXNSVUZCTmtJc1VVRkJOMElzUlVGQmRVTTdRVUZEYkVRc1owSkJRVWtzVVVGQlNpeEZRVUZqTzBGQlExb3NkVUpCUVZNc1QwRkJWQ3hEUVVGcFFpeFZRVUZETEVWQlFVUXNSVUZCVVR0QlFVTjJRaXh0UWtGQlJ5eFRRVUZJTEVkQlFXVXNVVUZCWmp0QlFVTkVMR1ZCUmtRN1FVRkhSQ3hoUVVwRUxFMUJTVTg3UVVGRFRDeHpRa0ZCVVN4VFFVRlNMRWRCUVc5Q0xGRkJRWEJDTzBGQlEwUTdRVUZEUml4WFFWSkVPenRCUVZWQkxHTkJRVWtzVFVGQlN5eHBRa0ZCVEN4RlFVRktMRVZCUVRoQ08wRkJRelZDTEhGQ1FVRlRMRTFCUVVzc2FVSkJRVXdzUlVGQlZEdEJRVU5FT3p0QlFVVkVMR2xDUVVGUExGZEJRVkFzUlVGQmIwSXNVVUZCY0VJc1JVRkJPRUlzV1VGQldTeG5Ra0ZCV2l4RFFVRTJRaXhwUWtGQk4wSXNRMEZCT1VJN1FVRkRSQ3hUUVdoQ1JDeEZRV2RDUnl4SlFXaENTRHRCUVdsQ1JEczdRVUZGUkRzN1FVRkZRVHM3T3pzN1FVRndSbWRDTzBGQlFVRTdRVUZCUVN4MVEwRjNSa01zVlVGNFJrUXNSVUYzUm1FN1FVRkRNMElzWVVGQlN5eE5RVUZNTEVOQlFWa3NTVUZCV2l4RFFVRnBRaXhWUVVGcVFqdEJRVU5FT3p0QlFVVkVPenM3T3pzN1FVRTFSbWRDTzBGQlFVRTdRVUZCUVN4clEwRnBSMG9zV1VGcVIwa3NSVUZwUjFVN1FVRkRlRUlzV1VGQlNTeFBRVUZQTEZsQlFWQXNTMEZCZDBJc1VVRkJOVUlzUlVGQmMwTTdRVUZEY0VNc1owSkJRVTBzU1VGQlNTeExRVUZLTEVOQlFWVXNhVVJCUVdkRUxGbEJRV2hFTEhsRFFVRm5SQ3haUVVGb1JDeExRVUVyUkN4WFFVRjZSU3hEUVVGT08wRkJRMFE3UVVGRFJDeGhRVUZMTEZsQlFVd3NSMEZCYjBJc1dVRkJjRUk3UVVGRFJEczdRVUZGUkRzN096czdRVUY0UjJkQ08wRkJRVUU3UVVGQlFTd3dRMEUwUjBrc1kwRTFSMG9zUlVFMFIyOUNPMEZCUTJ4RExGbEJRVWtzVDBGQlR5eGpRVUZRTEV0QlFUQkNMRlZCUVRsQ0xFVkJRVEJETzBGQlEzaERMR2RDUVVGTkxFbEJRVWtzUzBGQlNpeERRVUZWTERoRVFVRTJSQ3hqUVVFM1JDeDVRMEZCTmtRc1kwRkJOMFFzUzBGQk9FVXNWMEZCZUVZc1EwRkJUanRCUVVORU8wRkJRMFFzWVVGQlN5eGpRVUZNTEVkQlFYTkNMR05CUVhSQ08wRkJRMFE3TzBGQlJVUTdPenM3T3p0QlFXNUlaMEk3UVVGQlFUdEJRVUZCTEc5RFFYZElSaXhUUVhoSVJTeEZRWGRJTWtJN1FVRkJRVHM3UVVGQlFTeFpRVUZzUWl4WFFVRnJRaXgxUlVGQlNpeEZRVUZKT3p0QlFVTjZReXhaUVVGTkxIZENRVUZ6UWl4VlFVRlZMRTFCUVZZc1EwRkJhVUlzUTBGQmFrSXNSVUZCYjBJc1YwRkJjRUlzUlVGQmRFSXNSMEZCTUVRc1ZVRkJWU3hMUVVGV0xFTkJRV2RDTEVOQlFXaENMRU5CUVdoRk96dEJRVVZCTEdGQlFVc3NUVUZCVEN4RFFVRlpMRTlCUVZvc1EwRkJiMElzVlVGQlF5eExRVUZFTEVWQlFWYzdRVUZETjBJc1kwRkJUU3hoUVVGaExFMUJRVTBzVTBGQlRpeERRVUZ1UWp0QlFVTkJMR05CUVUwc2EwSkJRV3RDTEUxQlFVMHNZMEZCVGl4RFFVRjRRanRCUVVOQkxHTkJRVWtzVDBGQlR5eFZRVUZRTEV0QlFYTkNMRlZCUVRGQ0xFVkJRWE5ETzBGQlEzQkRMSFZDUVVGWExFdEJRVmdzVTBGQmRVSXNWMEZCZGtJN1FVRkRSRHM3UVVGRlJEdEJRVU5CTEdOQlFVa3NUMEZCVHl4bFFVRlFMRXRCUVRKQ0xGVkJRUzlDTEVWQlFUSkRPMEZCUTNwRExEUkNRVUZuUWl4TFFVRm9RaXhUUVVFMFFpeFhRVUUxUWp0QlFVTkVPMEZCUTBZc1UwRllSRHM3UVVGaFFTeDVRMEZCYTBJc1UwRkJiRUlzUlVGQk5rSXNTMEZCU3l4SlFVRnNReXhGUVVGM1F5eFhRVUY0UXp0QlFVTkVPMEZCZWtsbE8wRkJRVUU3UVVGQlFTd3dRa0ZuUTBzN1FVRkRia0lzWlVGQlZTeEpRVUZXTEZOQlFXdENMRTlCUVd4Q08wRkJRMFE3UVVGc1EyVTdPMEZCUVVFN1FVRkJRVHM3UVVFMFNXeENMRk5CUVU4c1NVRkJVRHRCUVVORUxFTkJOMGxaTEVWQlFXSTdPMnRDUVN0SlpTeEpPenM3T3pzN096czdRVU51U21ZN096czdPenR6UTBGTVFUczdPenM3T3pzN096czdPMUZEUTJkQ0xGRXNSMEZCUVN4Uk8xRkJiVUpCTEZVc1IwRkJRU3hWTzFGQlNVRXNhVUlzUjBGQlFTeHBRanRSUVZkQkxHTXNSMEZCUVN4ak8xRkJWVUVzWjBJc1IwRkJRU3huUWp0QlFUVkRWQ3hUUVVGVExGRkJRVlFzUTBGQmEwSXNSMEZCYkVJc1JVRkJkVUlzUlVGQmRrSXNSVUZCTWtJc1VVRkJNMElzUlVGQmNVTTdRVUZETVVNc1RVRkJUU3hOUVVGTkxFbEJRVWtzWTBGQlNpeEZRVUZhTzBGQlEwRXNUVUZCU1N4SlFVRkpMR2RDUVVGU0xFVkJRVEJDTEVsQlFVa3NaMEpCUVVvc1EwRkJjVUlzTUVKQlFYSkNPMEZCUXpGQ0xFMUJRVWtzYTBKQlFVb3NSMEZCZVVJc1dVRkJUVHRCUVVNM1FpeFJRVUZKTEVsQlFVa3NWVUZCU2l4TFFVRnRRaXhEUVVGdVFpeExRVUY1UWl4VFFVRlRMRWxCUVVrc1RVRkJZaXhOUVVGNVFpeEhRVUY2UWl4SlFVRm5ReXhEUVVGRExFbEJRVWtzVFVGQlRDeEpRVUZsTEVsQlFVa3NXVUZCU2l4RFFVRnBRaXhOUVVGNlJpeERRVUZLTEVWQlFYTkhPMEZCUTNCSExGTkJRVWNzU1VGQlNTeFpRVUZRTzBGQlEwUTdRVUZEUml4SFFVcEVPenRCUVUxQkxFMUJRVWtzVDBGQlR5eFJRVUZRTEV0QlFXOUNMRkZCUVhoQ0xFVkJRV3RETzBGQlEyaERMRkZCUVVrc1NVRkJTaXhEUVVGVExFdEJRVlFzUlVGQlowSXNSMEZCYUVJc1JVRkJjVUlzU1VGQmNrSTdRVUZEUVN4UlFVRkpMRWxCUVVvc1EwRkJVeXhGUVVGVU8wRkJRMFFzUjBGSVJDeE5RVWRQTzBGQlEwd3NVVUZCU1N4SlFVRktMRU5CUVZNc1RVRkJWQ3hGUVVGcFFpeEhRVUZxUWl4RlFVRnpRaXhKUVVGMFFqdEJRVU5CTEZGQlFVa3NaMEpCUVVvc1EwRkJjVUlzWTBGQmNrSXNSVUZCY1VNc2JVTkJRWEpETzBGQlEwRXNVVUZCU1N4SlFVRktMRU5CUVZNc1VVRkJWRHRCUVVORU8wRkJRMFk3TzBGQlJVMHNVMEZCVXl4VlFVRlVMRWRCUVhOQ08wRkJRek5DTEZOQlFVOHNTMEZCU3l4TlFVRk1MRWRCUVdNc1VVRkJaQ3hEUVVGMVFpeEZRVUYyUWl4RlFVRXlRaXhOUVVFelFpeERRVUZyUXl4RFFVRnNReXhGUVVGeFF5eEZRVUZ5UXl4RFFVRlFPMEZCUTBRN08wRkJSVTBzVTBGQlV5eHBRa0ZCVkN4RFFVRXlRaXhOUVVFelFpeEZRVUZ0UXl4WFFVRnVReXhGUVVGblJEdEJRVU55UkN4VFFVRlBMRlZCUVZVc1YwRkJWeXhSUVVFMVFpeEZRVUZ6UXl4VFFVRlRMRTlCUVU4c1ZVRkJkRVFzUlVGQmEwVTdRVUZEYUVVc1VVRkJTU3hQUVVGUExGTkJRVkFzUTBGQmFVSXNVVUZCYWtJc1EwRkJNRUlzVjBGQk1VSXNRMEZCU2l4RlFVRTBRenRCUVVNeFF5eGhRVUZQTEUxQlFWQTdRVUZEUkR0QlFVTkdPenRCUVVWRUxGTkJRVThzU1VGQlVEdEJRVU5FT3p0QlFVZE5MRk5CUVZNc1kwRkJWQ3hEUVVGM1FpeE5RVUY0UWl4RlFVRm5ReXhSUVVGb1F5eEZRVUV3UXp0QlFVTXZReXhUUVVGUExGVkJRVlVzVjBGQlZ5eFJRVUUxUWl4RlFVRnpReXhUUVVGVExFOUJRVThzVlVGQmRFUXNSVUZCYTBVN1FVRkRhRVVzVVVGQlNTeFBRVUZQTEZsQlFWQXNRMEZCYjBJc1NVRkJjRUlzVFVGQk9FSXNVVUZCYkVNc1JVRkJORU03UVVGRE1VTXNZVUZCVHl4TlFVRlFPMEZCUTBRN1FVRkRSanM3UVVGRlJDeFRRVUZQTEVsQlFWQTdRVUZEUkRzN1FVRkZUU3hUUVVGVExHZENRVUZVTEVOQlFUQkNMRTFCUVRGQ0xFVkJRV3RETEVsQlFXeERMRVZCUVhkRE8wRkJRemRETEZOQlFVOHNWVUZCVlN4WFFVRlhMRkZCUVRWQ0xFVkJRWE5ETEZOQlFWTXNUMEZCVHl4VlFVRjBSQ3hGUVVGclJUdEJRVU5vUlN4UlFVRkpMRTlCUVU4c1dVRkJVQ3hEUVVGdlFpeEpRVUZ3UWl4TlFVRTRRaXhKUVVGc1F5eEZRVUYzUXp0QlFVTjBReXhoUVVGUExFMUJRVkE3UVVGRFJEdEJRVU5HT3p0QlFVVkVMRk5CUVU4c1NVRkJVRHRCUVVORU96czdPenM3T3pzN1FVTTVRMFE3T3pzN1FVRkRRVHM3T3p0QlFVTkJPenM3TzBGQlEwRTdPenM3UVVGRFFUczdPenRCUVVkQk96czdPMEZCUTBFN096czdRVUZEUVRzN096dEJRVU5CT3pzN08wRkJRMEU3T3pzN1FVRkRRVHM3T3p0QlFVTkJPenM3TzBGQlEwRTdPenM3UVVGRFFUczdPenM3TzBGQmRFSkJPenM3T3pzN1FVRk5RVHRCUVd0Q1FTeEpRVUZOTEUxQlFVMHNSVUZCV2pzN1FVRkZRVHM3T3pzN096dEJRV0pCTzBGQmEwSkJMRWxCUVVrc1RVRkJTaXhIUVVGaE8wRkJRMWc3UVVGRFFTeFRRVUZQT3p0QlFVZFVPenM3T3p0QlFVeGhMRU5CUVdJc1EwRlZRU3hKUVVGSkxFdEJRVW9zUjBGQldTeFZRVUZETEU5QlFVUXNSVUZCWVR0QlFVTjJRaXhOUVVGSkxFOUJRVThzU1VGQlNTeE5RVUZZTEV0QlFYTkNMRmRCUVRGQ0xFVkJRWFZETzBGQlEzSkRMRkZCUVVrc1RVRkJTaXhIUVVGaExHZENRVUZOTEdGQlFVNHNRMEZCYjBJc1QwRkJjRUlzUTBGQllqdEJRVU5FTzBGQlEwUXNVMEZCVHl4SlFVRkpMRTFCUVZnN1FVRkRSQ3hEUVV4RU96dEJRVTlCT3pzN096czdRVUZOUVN4SlFVRkpMRkZCUVVvN08wRkJSVUU3T3pzN08wRkJTMEVzU1VGQlNTeEpRVUZLTEVkQlFWY3NaVUZCU3l4aFFVRm9RanM3UVVGRlFUczdPenM3UVVGTFFTeEpRVUZKTEVsQlFVb3NSMEZCVnl4bFFVRkxMR0ZCUVdoQ096dEJRVVZCT3pzN096dEJRVXRCTEVsQlFVa3NUMEZCU2l4SFFVRmpMR3RDUVVGUkxHRkJRWFJDT3p0QlFVVkJPenM3T3p0QlFVdEJMRWxCUVVrc1dVRkJTaXhIUVVGdFFpeDFRa0ZCWVN4aFFVRm9RenM3UVVGRlFUczdPenM3UVVGTFFTeEpRVUZKTEUxQlFVb3NSMEZCWVN4cFFrRkJUeXhoUVVGd1FqczdRVUZGUVRzN096czdRVUZMUVN4SlFVRkpMRkZCUVVvc1IwRkJaU3h0UWtGQlV5eGhRVUY0UWpzN1FVRkZRVHM3T3pzN1FVRkxRU3hKUVVGSkxGTkJRVW9zUjBGQlowSXNiMEpCUVZVc1lVRkJNVUk3TzBGQlIwRTdPenM3TzBGQlMwRXNTVUZCU1N4SFFVRktMRWRCUVZVc1kwRkJTU3hoUVVGa096dEJRVVZCT3pzN096dEJRVXRCTEVsQlFVa3NVVUZCU2l4SFFVRmxMRzFDUVVGVExHRkJRWGhDT3p0QlFVVkJPenM3T3p0QlFVdEJMRWxCUVVrc1RVRkJTaXhIUVVGaExHbENRVUZQTEdGQlFYQkNPenRCUVVWQk96czdPenRCUVV0QkxFbEJRVWtzVTBGQlNpeEhRVUZuUWl4dlFrRkJWU3hoUVVFeFFqczdRVUZGUVRzN096czdRVUZMUVN4SlFVRkpMRkZCUVVvc1IwRkJaU3h0UWtGQlV5eGhRVUY0UWpzN1FVRkZRVHRCUVVOQkxFOUJRVThzVFVGQlVDeEhRVUZuUWl4SFFVRm9RanM3YTBKQlJXVXNSeUlzSW1acGJHVWlPaUpuWlc1bGNtRjBaV1F1YW5NaUxDSnpiM1Z5WTJWU2IyOTBJam9pSWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaUtHWjFibU4wYVc5dUlHVW9kQ3h1TEhJcGUyWjFibU4wYVc5dUlITW9ieXgxS1h0cFppZ2hibHR2WFNsN2FXWW9JWFJiYjEwcGUzWmhjaUJoUFhSNWNHVnZaaUJ5WlhGMWFYSmxQVDFjSW1aMWJtTjBhVzl1WENJbUpuSmxjWFZwY21VN2FXWW9JWFVtSm1FcGNtVjBkWEp1SUdFb2J5d2hNQ2s3YVdZb2FTbHlaWFIxY200Z2FTaHZMQ0V3S1R0MllYSWdaajF1WlhjZ1JYSnliM0lvWENKRFlXNXViM1FnWm1sdVpDQnRiMlIxYkdVZ0oxd2lLMjhyWENJblhDSXBPM1JvY205M0lHWXVZMjlrWlQxY0lrMVBSRlZNUlY5T1QxUmZSazlWVGtSY0lpeG1mWFpoY2lCc1BXNWJiMTA5ZTJWNGNHOXlkSE02ZTMxOU8zUmJiMTFiTUYwdVkyRnNiQ2hzTG1WNGNHOXlkSE1zWm5WdVkzUnBiMjRvWlNsN2RtRnlJRzQ5ZEZ0dlhWc3hYVnRsWFR0eVpYUjFjbTRnY3lodVAyNDZaU2w5TEd3c2JDNWxlSEJ2Y25SekxHVXNkQ3h1TEhJcGZYSmxkSFZ5YmlCdVcyOWRMbVY0Y0c5eWRITjlkbUZ5SUdrOWRIbHdaVzltSUhKbGNYVnBjbVU5UFZ3aVpuVnVZM1JwYjI1Y0lpWW1jbVZ4ZFdseVpUdG1iM0lvZG1GeUlHODlNRHR2UEhJdWJHVnVaM1JvTzI4ckt5bHpLSEpiYjEwcE8zSmxkSFZ5YmlCemZTa2lMQ0l2S2lGY2JpQXFJRkJzWVhSbWIzSnRMbXB6SUR4b2RIUndjem92TDIxMGFITXVZbVV2Y0d4aGRHWnZjbTArWEc0Z0tpQkRiM0I1Y21sbmFIUWdNakF4TkMweU1ERTJJRUpsYm1waGJXbHVJRlJoYmlBOGFIUjBjSE02THk5a1pXMXZibVZoZFhndVoybDBhSFZpTG1sdkx6NWNiaUFxSUVOdmNIbHlhV2RvZENBeU1ERXhMVEl3TVRNZ1NtOW9iaTFFWVhacFpDQkVZV3gwYjI0Z1BHaDBkSEE2THk5aGJHeDViM1ZqWVc1c1pXVjBMbU52YlM4K1hHNGdLaUJCZG1GcGJHRmliR1VnZFc1a1pYSWdUVWxVSUd4cFkyVnVjMlVnUEdoMGRIQnpPaTh2YlhSb2N5NWlaUzl0YVhRK1hHNGdLaTljYmpzb1puVnVZM1JwYjI0b0tTQjdYRzRnSUNkMWMyVWdjM1J5YVdOMEp6dGNibHh1SUNBdktpb2dWWE5sWkNCMGJ5QmtaWFJsY20xcGJtVWdhV1lnZG1Gc2RXVnpJR0Z5WlNCdlppQjBhR1VnYkdGdVozVmhaMlVnZEhsd1pTQmdUMkpxWldOMFlDNGdLaTljYmlBZ2RtRnlJRzlpYW1WamRGUjVjR1Z6SUQwZ2UxeHVJQ0FnSUNkbWRXNWpkR2x2YmljNklIUnlkV1VzWEc0Z0lDQWdKMjlpYW1WamRDYzZJSFJ5ZFdWY2JpQWdmVHRjYmx4dUlDQXZLaW9nVlhObFpDQmhjeUJoSUhKbFptVnlaVzVqWlNCMGJ5QjBhR1VnWjJ4dlltRnNJRzlpYW1WamRDNGdLaTljYmlBZ2RtRnlJSEp2YjNRZ1BTQW9iMkpxWldOMFZIbHdaWE5iZEhsd1pXOW1JSGRwYm1SdmQxMGdKaVlnZDJsdVpHOTNLU0I4ZkNCMGFHbHpPMXh1WEc0Z0lDOHFLaUJDWVdOcmRYQWdjRzl6YzJsaWJHVWdaMnh2WW1Gc0lHOWlhbVZqZEM0Z0tpOWNiaUFnZG1GeUlHOXNaRkp2YjNRZ1BTQnliMjkwTzF4dVhHNGdJQzhxS2lCRVpYUmxZM1FnWm5KbFpTQjJZWEpwWVdKc1pTQmdaWGh3YjNKMGMyQXVJQ292WEc0Z0lIWmhjaUJtY21WbFJYaHdiM0owY3lBOUlHOWlhbVZqZEZSNWNHVnpXM1I1Y0dWdlppQmxlSEJ2Y25SelhTQW1KaUJsZUhCdmNuUnpPMXh1WEc0Z0lDOHFLaUJFWlhSbFkzUWdabkpsWlNCMllYSnBZV0pzWlNCZ2JXOWtkV3hsWUM0Z0tpOWNiaUFnZG1GeUlHWnlaV1ZOYjJSMWJHVWdQU0J2WW1wbFkzUlVlWEJsYzF0MGVYQmxiMllnYlc5a2RXeGxYU0FtSmlCdGIyUjFiR1VnSmlZZ0lXMXZaSFZzWlM1dWIyUmxWSGx3WlNBbUppQnRiMlIxYkdVN1hHNWNiaUFnTHlvcUlFUmxkR1ZqZENCbWNtVmxJSFpoY21saFlteGxJR0JuYkc5aVlXeGdJR1p5YjIwZ1RtOWtaUzVxY3lCdmNpQkNjbTkzYzJWeWFXWnBaV1FnWTI5a1pTQmhibVFnZFhObElHbDBJR0Z6SUdCeWIyOTBZQzRnS2k5Y2JpQWdkbUZ5SUdaeVpXVkhiRzlpWVd3Z1BTQm1jbVZsUlhod2IzSjBjeUFtSmlCbWNtVmxUVzlrZFd4bElDWW1JSFI1Y0dWdlppQm5iRzlpWVd3Z1BUMGdKMjlpYW1WamRDY2dKaVlnWjJ4dlltRnNPMXh1SUNCcFppQW9abkpsWlVkc2IySmhiQ0FtSmlBb1puSmxaVWRzYjJKaGJDNW5iRzlpWVd3Z1BUMDlJR1p5WldWSGJHOWlZV3dnZkh3Z1puSmxaVWRzYjJKaGJDNTNhVzVrYjNjZ1BUMDlJR1p5WldWSGJHOWlZV3dnZkh3Z1puSmxaVWRzYjJKaGJDNXpaV3htSUQwOVBTQm1jbVZsUjJ4dlltRnNLU2tnZTF4dUlDQWdJSEp2YjNRZ1BTQm1jbVZsUjJ4dlltRnNPMXh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUZWelpXUWdZWE1nZEdobElHMWhlR2x0ZFcwZ2JHVnVaM1JvSUc5bUlHRnVJR0Z5Y21GNUxXeHBhMlVnYjJKcVpXTjBMbHh1SUNBZ0tpQlRaV1VnZEdobElGdEZVellnYzNCbFkxMG9hSFIwY0RvdkwzQmxiM0JzWlM1dGIzcHBiR3hoTG05eVp5OSthbTl5Wlc1a2IzSm1aaTlsY3pZdFpISmhablF1YUhSdGJDTnpaV010ZEc5c1pXNW5kR2dwWEc0Z0lDQXFJR1p2Y2lCdGIzSmxJR1JsZEdGcGJITXVYRzRnSUNBcUwxeHVJQ0IyWVhJZ2JXRjRVMkZtWlVsdWRHVm5aWElnUFNCTllYUm9MbkJ2ZHlneUxDQTFNeWtnTFNBeE8xeHVYRzRnSUM4cUtpQlNaV2QxYkdGeUlHVjRjSEpsYzNOcGIyNGdkRzhnWkdWMFpXTjBJRTl3WlhKaExpQXFMMXh1SUNCMllYSWdjbVZQY0dWeVlTQTlJQzljWEdKUGNHVnlZUzg3WEc1Y2JpQWdMeW9xSUZCdmMzTnBZbXhsSUdkc2IySmhiQ0J2WW1wbFkzUXVJQ292WEc0Z0lIWmhjaUIwYUdselFtbHVaR2x1WnlBOUlIUm9hWE03WEc1Y2JpQWdMeW9xSUZWelpXUWdabTl5SUc1aGRHbDJaU0J0WlhSb2IyUWdjbVZtWlhKbGJtTmxjeTRnS2k5Y2JpQWdkbUZ5SUc5aWFtVmpkRkJ5YjNSdklEMGdUMkpxWldOMExuQnliM1J2ZEhsd1pUdGNibHh1SUNBdktpb2dWWE5sWkNCMGJ5QmphR1ZqYXlCbWIzSWdiM2R1SUhCeWIzQmxjblJwWlhNZ2IyWWdZVzRnYjJKcVpXTjBMaUFxTDF4dUlDQjJZWElnYUdGelQzZHVVSEp2Y0dWeWRIa2dQU0J2WW1wbFkzUlFjbTkwYnk1b1lYTlBkMjVRY205d1pYSjBlVHRjYmx4dUlDQXZLaW9nVlhObFpDQjBieUJ5WlhOdmJIWmxJSFJvWlNCcGJuUmxjbTVoYkNCZ1cxdERiR0Z6YzExZFlDQnZaaUIyWVd4MVpYTXVJQ292WEc0Z0lIWmhjaUIwYjFOMGNtbHVaeUE5SUc5aWFtVmpkRkJ5YjNSdkxuUnZVM1J5YVc1bk8xeHVYRzRnSUM4cUxTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHFMMXh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkRZWEJwZEdGc2FYcGxjeUJoSUhOMGNtbHVaeUIyWVd4MVpTNWNiaUFnSUNwY2JpQWdJQ29nUUhCeWFYWmhkR1ZjYmlBZ0lDb2dRSEJoY21GdElIdHpkSEpwYm1kOUlITjBjbWx1WnlCVWFHVWdjM1J5YVc1bklIUnZJR05oY0dsMFlXeHBlbVV1WEc0Z0lDQXFJRUJ5WlhSMWNtNXpJSHR6ZEhKcGJtZDlJRlJvWlNCallYQnBkR0ZzYVhwbFpDQnpkSEpwYm1jdVhHNGdJQ0FxTDF4dUlDQm1kVzVqZEdsdmJpQmpZWEJwZEdGc2FYcGxLSE4wY21sdVp5a2dlMXh1SUNBZ0lITjBjbWx1WnlBOUlGTjBjbWx1WnloemRISnBibWNwTzF4dUlDQWdJSEpsZEhWeWJpQnpkSEpwYm1jdVkyaGhja0YwS0RBcExuUnZWWEJ3WlhKRFlYTmxLQ2tnS3lCemRISnBibWN1YzJ4cFkyVW9NU2s3WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ1FTQjFkR2xzYVhSNUlHWjFibU4wYVc5dUlIUnZJR05zWldGdUlIVndJSFJvWlNCUFV5QnVZVzFsTGx4dUlDQWdLbHh1SUNBZ0tpQkFjSEpwZG1GMFpWeHVJQ0FnS2lCQWNHRnlZVzBnZTNOMGNtbHVaMzBnYjNNZ1ZHaGxJRTlUSUc1aGJXVWdkRzhnWTJ4bFlXNGdkWEF1WEc0Z0lDQXFJRUJ3WVhKaGJTQjdjM1J5YVc1bmZTQmJjR0YwZEdWeWJsMGdRU0JnVW1WblJYaHdZQ0J3WVhSMFpYSnVJRzFoZEdOb2FXNW5JSFJvWlNCUFV5QnVZVzFsTGx4dUlDQWdLaUJBY0dGeVlXMGdlM04wY21sdVozMGdXMnhoWW1Wc1hTQkJJR3hoWW1Wc0lHWnZjaUIwYUdVZ1QxTXVYRzRnSUNBcUwxeHVJQ0JtZFc1amRHbHZiaUJqYkdWaGJuVndUMU1vYjNNc0lIQmhkSFJsY200c0lHeGhZbVZzS1NCN1hHNGdJQ0FnTHk4Z1VHeGhkR1p2Y20wZ2RHOXJaVzV6SUdGeVpTQmtaV1pwYm1Wa0lHRjBPbHh1SUNBZ0lDOHZJR2gwZEhBNkx5OXRjMlJ1TG0xcFkzSnZjMjltZEM1amIyMHZaVzR0ZFhNdmJHbGljbUZ5ZVM5dGN6VXpOelV3TXloV1V5NDROU2t1WVhOd2VGeHVJQ0FnSUM4dklHaDBkSEE2THk5M1pXSXVZWEpqYUdsMlpTNXZjbWN2ZDJWaUx6SXdNRGd4TVRJeU1EVXpPVFV3TDJoMGRIQTZMeTl0YzJSdUxtMXBZM0p2YzI5bWRDNWpiMjB2Wlc0dGRYTXZiR2xpY21GeWVTOXRjelV6TnpVd015aFdVeTQ0TlNrdVlYTndlRnh1SUNBZ0lIWmhjaUJrWVhSaElEMGdlMXh1SUNBZ0lDQWdKekV3TGpBbk9pQW5NVEFuTEZ4dUlDQWdJQ0FnSnpZdU5DYzZJQ0FuTVRBZ1ZHVmphRzVwWTJGc0lGQnlaWFpwWlhjbkxGeHVJQ0FnSUNBZ0p6WXVNeWM2SUNBbk9DNHhKeXhjYmlBZ0lDQWdJQ2MyTGpJbk9pQWdKemduTEZ4dUlDQWdJQ0FnSnpZdU1TYzZJQ0FuVTJWeWRtVnlJREl3TURnZ1VqSWdMeUEzSnl4Y2JpQWdJQ0FnSUNjMkxqQW5PaUFnSjFObGNuWmxjaUF5TURBNElDOGdWbWx6ZEdFbkxGeHVJQ0FnSUNBZ0p6VXVNaWM2SUNBblUyVnlkbVZ5SURJd01ETWdMeUJZVUNBMk5DMWlhWFFuTEZ4dUlDQWdJQ0FnSnpVdU1TYzZJQ0FuV0ZBbkxGeHVJQ0FnSUNBZ0p6VXVNREVuT2lBbk1qQXdNQ0JUVURFbkxGeHVJQ0FnSUNBZ0p6VXVNQ2M2SUNBbk1qQXdNQ2NzWEc0Z0lDQWdJQ0FuTkM0d0p6b2dJQ2RPVkNjc1hHNGdJQ0FnSUNBbk5DNDVNQ2M2SUNkTlJTZGNiaUFnSUNCOU8xeHVJQ0FnSUM4dklFUmxkR1ZqZENCWGFXNWtiM2R6SUhabGNuTnBiMjRnWm5KdmJTQndiR0YwWm05eWJTQjBiMnRsYm5NdVhHNGdJQ0FnYVdZZ0tIQmhkSFJsY200Z0ppWWdiR0ZpWld3Z0ppWWdMMTVYYVc0dmFTNTBaWE4wS0c5ektTQW1KaUFoTDE1WGFXNWtiM2R6SUZCb2IyNWxJQzlwTG5SbGMzUW9iM01wSUNZbVhHNGdJQ0FnSUNBZ0lDaGtZWFJoSUQwZ1pHRjBZVnN2VzF4Y1pDNWRLeVF2TG1WNFpXTW9iM01wWFNrcElIdGNiaUFnSUNBZ0lHOXpJRDBnSjFkcGJtUnZkM01nSnlBcklHUmhkR0U3WEc0Z0lDQWdmVnh1SUNBZ0lDOHZJRU52Y25KbFkzUWdZMmhoY21GamRHVnlJR05oYzJVZ1lXNWtJR05zWldGdWRYQWdjM1J5YVc1bkxseHVJQ0FnSUc5eklEMGdVM1J5YVc1bktHOXpLVHRjYmx4dUlDQWdJR2xtSUNod1lYUjBaWEp1SUNZbUlHeGhZbVZzS1NCN1hHNGdJQ0FnSUNCdmN5QTlJRzl6TG5KbGNHeGhZMlVvVW1WblJYaHdLSEJoZEhSbGNtNHNJQ2RwSnlrc0lHeGhZbVZzS1R0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0J2Y3lBOUlHWnZjbTFoZENoY2JpQWdJQ0FnSUc5ekxuSmxjR3hoWTJVb0x5QmpaU1F2YVN3Z0p5QkRSU2NwWEc0Z0lDQWdJQ0FnSUM1eVpYQnNZV05sS0M5Y1hHSm9jSGN2YVN3Z0ozZGxZaWNwWEc0Z0lDQWdJQ0FnSUM1eVpYQnNZV05sS0M5Y1hHSk5ZV05wYm5SdmMyaGNYR0l2TENBblRXRmpJRTlUSnlsY2JpQWdJQ0FnSUNBZ0xuSmxjR3hoWTJVb0wxOVFiM2RsY2xCRFhGeGlMMmtzSUNjZ1QxTW5LVnh1SUNBZ0lDQWdJQ0F1Y21Wd2JHRmpaU2d2WEZ4aUtFOVRJRmdwSUZ0ZUlGeGNaRjByTDJrc0lDY2tNU2NwWEc0Z0lDQWdJQ0FnSUM1eVpYQnNZV05sS0M5Y1hHSk5ZV01nS0U5VElGZ3BYRnhpTHl3Z0p5UXhKeWxjYmlBZ0lDQWdJQ0FnTG5KbGNHeGhZMlVvTDF4Y0x5aGNYR1FwTHl3Z0p5QWtNU2NwWEc0Z0lDQWdJQ0FnSUM1eVpYQnNZV05sS0M5ZkwyY3NJQ2N1SnlsY2JpQWdJQ0FnSUNBZ0xuSmxjR3hoWTJVb0x5Zy9PaUJDWlZCRGZGc2dMbDBxWm1OYklGeGNaQzVkS3lra0wya3NJQ2NuS1Z4dUlDQWdJQ0FnSUNBdWNtVndiR0ZqWlNndlhGeGllRGcyWEZ3dU5qUmNYR0l2WjJrc0lDZDRPRFpmTmpRbktWeHVJQ0FnSUNBZ0lDQXVjbVZ3YkdGalpTZ3ZYRnhpS0ZkcGJtUnZkM01nVUdodmJtVXBJRTlUWEZ4aUx5d2dKeVF4SnlsY2JpQWdJQ0FnSUNBZ0xuSmxjR3hoWTJVb0wxeGNZaWhEYUhKdmJXVWdUMU1nWEZ4M0t5a2dXMXhjWkM1ZEsxeGNZaThzSUNja01TY3BYRzRnSUNBZ0lDQWdJQzV6Y0d4cGRDZ25JRzl1SUNjcFd6QmRYRzRnSUNBZ0tUdGNibHh1SUNBZ0lISmxkSFZ5YmlCdmN6dGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJCYmlCcGRHVnlZWFJwYjI0Z2RYUnBiR2wwZVNCbWIzSWdZWEp5WVhseklHRnVaQ0J2WW1wbFkzUnpMbHh1SUNBZ0tseHVJQ0FnS2lCQWNISnBkbUYwWlZ4dUlDQWdLaUJBY0dGeVlXMGdlMEZ5Y21GNWZFOWlhbVZqZEgwZ2IySnFaV04wSUZSb1pTQnZZbXBsWTNRZ2RHOGdhWFJsY21GMFpTQnZkbVZ5TGx4dUlDQWdLaUJBY0dGeVlXMGdlMFoxYm1OMGFXOXVmU0JqWVd4c1ltRmpheUJVYUdVZ1puVnVZM1JwYjI0Z1kyRnNiR1ZrSUhCbGNpQnBkR1Z5WVhScGIyNHVYRzRnSUNBcUwxeHVJQ0JtZFc1amRHbHZiaUJsWVdOb0tHOWlhbVZqZEN3Z1kyRnNiR0poWTJzcElIdGNiaUFnSUNCMllYSWdhVzVrWlhnZ1BTQXRNU3hjYmlBZ0lDQWdJQ0FnYkdWdVozUm9JRDBnYjJKcVpXTjBJRDhnYjJKcVpXTjBMbXhsYm1kMGFDQTZJREE3WEc1Y2JpQWdJQ0JwWmlBb2RIbHdaVzltSUd4bGJtZDBhQ0E5UFNBbmJuVnRZbVZ5SnlBbUppQnNaVzVuZEdnZ1BpQXRNU0FtSmlCc1pXNW5kR2dnUEQwZ2JXRjRVMkZtWlVsdWRHVm5aWElwSUh0Y2JpQWdJQ0FnSUhkb2FXeGxJQ2dySzJsdVpHVjRJRHdnYkdWdVozUm9LU0I3WEc0Z0lDQWdJQ0FnSUdOaGJHeGlZV05yS0c5aWFtVmpkRnRwYm1SbGVGMHNJR2x1WkdWNExDQnZZbXBsWTNRcE8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0JtYjNKUGQyNG9iMkpxWldOMExDQmpZV3hzWW1GamF5azdYRzRnSUNBZ2ZWeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRlJ5YVcwZ1lXNWtJR052Ym1ScGRHbHZibUZzYkhrZ1kyRndhWFJoYkdsNlpTQnpkSEpwYm1jZ2RtRnNkV1Z6TGx4dUlDQWdLbHh1SUNBZ0tpQkFjSEpwZG1GMFpWeHVJQ0FnS2lCQWNHRnlZVzBnZTNOMGNtbHVaMzBnYzNSeWFXNW5JRlJvWlNCemRISnBibWNnZEc4Z1ptOXliV0YwTGx4dUlDQWdLaUJBY21WMGRYSnVjeUI3YzNSeWFXNW5mU0JVYUdVZ1ptOXliV0YwZEdWa0lITjBjbWx1Wnk1Y2JpQWdJQ292WEc0Z0lHWjFibU4wYVc5dUlHWnZjbTFoZENoemRISnBibWNwSUh0Y2JpQWdJQ0J6ZEhKcGJtY2dQU0IwY21sdEtITjBjbWx1WnlrN1hHNGdJQ0FnY21WMGRYSnVJQzllS0Q4NmQyVmlUMU44YVNnL09rOVRmRkFwS1M4dWRHVnpkQ2h6ZEhKcGJtY3BYRzRnSUNBZ0lDQS9JSE4wY21sdVoxeHVJQ0FnSUNBZ09pQmpZWEJwZEdGc2FYcGxLSE4wY21sdVp5azdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nU1hSbGNtRjBaWE1nYjNabGNpQmhiaUJ2WW1wbFkzUW5jeUJ2ZDI0Z2NISnZjR1Z5ZEdsbGN5d2daWGhsWTNWMGFXNW5JSFJvWlNCZ1kyRnNiR0poWTJ0Z0lHWnZjaUJsWVdOb0xseHVJQ0FnS2x4dUlDQWdLaUJBY0hKcGRtRjBaVnh1SUNBZ0tpQkFjR0Z5WVcwZ2UwOWlhbVZqZEgwZ2IySnFaV04wSUZSb1pTQnZZbXBsWTNRZ2RHOGdhWFJsY21GMFpTQnZkbVZ5TGx4dUlDQWdLaUJBY0dGeVlXMGdlMFoxYm1OMGFXOXVmU0JqWVd4c1ltRmpheUJVYUdVZ1puVnVZM1JwYjI0Z1pYaGxZM1YwWldRZ2NHVnlJRzkzYmlCd2NtOXdaWEowZVM1Y2JpQWdJQ292WEc0Z0lHWjFibU4wYVc5dUlHWnZjazkzYmlodlltcGxZM1FzSUdOaGJHeGlZV05yS1NCN1hHNGdJQ0FnWm05eUlDaDJZWElnYTJWNUlHbHVJRzlpYW1WamRDa2dlMXh1SUNBZ0lDQWdhV1lnS0doaGMwOTNibEJ5YjNCbGNuUjVMbU5oYkd3b2IySnFaV04wTENCclpYa3BLU0I3WEc0Z0lDQWdJQ0FnSUdOaGJHeGlZV05yS0c5aWFtVmpkRnRyWlhsZExDQnJaWGtzSUc5aWFtVmpkQ2s3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUVkbGRITWdkR2hsSUdsdWRHVnlibUZzSUdCYlcwTnNZWE56WFYxZ0lHOW1JR0VnZG1Gc2RXVXVYRzRnSUNBcVhHNGdJQ0FxSUVCd2NtbDJZWFJsWEc0Z0lDQXFJRUJ3WVhKaGJTQjdLbjBnZG1Gc2RXVWdWR2hsSUhaaGJIVmxMbHh1SUNBZ0tpQkFjbVYwZFhKdWN5QjdjM1J5YVc1bmZTQlVhR1VnWUZ0YlEyeGhjM05kWFdBdVhHNGdJQ0FxTDF4dUlDQm1kVzVqZEdsdmJpQm5aWFJEYkdGemMwOW1LSFpoYkhWbEtTQjdYRzRnSUNBZ2NtVjBkWEp1SUhaaGJIVmxJRDA5SUc1MWJHeGNiaUFnSUNBZ0lEOGdZMkZ3YVhSaGJHbDZaU2gyWVd4MVpTbGNiaUFnSUNBZ0lEb2dkRzlUZEhKcGJtY3VZMkZzYkNoMllXeDFaU2t1YzJ4cFkyVW9PQ3dnTFRFcE8xeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRWh2YzNRZ2IySnFaV04wY3lCallXNGdjbVYwZFhKdUlIUjVjR1VnZG1Gc2RXVnpJSFJvWVhRZ1lYSmxJR1JwWm1abGNtVnVkQ0JtY205dElIUm9aV2x5SUdGamRIVmhiRnh1SUNBZ0tpQmtZWFJoSUhSNWNHVXVJRlJvWlNCdlltcGxZM1J6SUhkbElHRnlaU0JqYjI1alpYSnVaV1FnZDJsMGFDQjFjM1ZoYkd4NUlISmxkSFZ5YmlCdWIyNHRjSEpwYldsMGFYWmxYRzRnSUNBcUlIUjVjR1Z6SUc5bUlGd2liMkpxWldOMFhDSXNJRndpWm5WdVkzUnBiMjVjSWl3Z2IzSWdYQ0oxYm10dWIzZHVYQ0l1WEc0Z0lDQXFYRzRnSUNBcUlFQndjbWwyWVhSbFhHNGdJQ0FxSUVCd1lYSmhiU0I3S24wZ2IySnFaV04wSUZSb1pTQnZkMjVsY2lCdlppQjBhR1VnY0hKdmNHVnlkSGt1WEc0Z0lDQXFJRUJ3WVhKaGJTQjdjM1J5YVc1bmZTQndjbTl3WlhKMGVTQlVhR1VnY0hKdmNHVnlkSGtnZEc4Z1kyaGxZMnN1WEc0Z0lDQXFJRUJ5WlhSMWNtNXpJSHRpYjI5c1pXRnVmU0JTWlhSMWNtNXpJR0IwY25WbFlDQnBaaUIwYUdVZ2NISnZjR1Z5ZEhrZ2RtRnNkV1VnYVhNZ1lTQnViMjR0Y0hKcGJXbDBhWFpsTENCbGJITmxJR0JtWVd4elpXQXVYRzRnSUNBcUwxeHVJQ0JtZFc1amRHbHZiaUJwYzBodmMzUlVlWEJsS0c5aWFtVmpkQ3dnY0hKdmNHVnlkSGtwSUh0Y2JpQWdJQ0IyWVhJZ2RIbHdaU0E5SUc5aWFtVmpkQ0FoUFNCdWRXeHNJRDhnZEhsd1pXOW1JRzlpYW1WamRGdHdjbTl3WlhKMGVWMGdPaUFuYm5WdFltVnlKenRjYmlBZ0lDQnlaWFIxY200Z0lTOWVLRDg2WW05dmJHVmhibnh1ZFcxaVpYSjhjM1J5YVc1bmZIVnVaR1ZtYVc1bFpDa2tMeTUwWlhOMEtIUjVjR1VwSUNZbVhHNGdJQ0FnSUNBb2RIbHdaU0E5UFNBbmIySnFaV04wSnlBL0lDRWhiMkpxWldOMFczQnliM0JsY25SNVhTQTZJSFJ5ZFdVcE8xeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRkJ5WlhCaGNtVnpJR0VnYzNSeWFXNW5JR1p2Y2lCMWMyVWdhVzRnWVNCZ1VtVm5SWGh3WUNCaWVTQnRZV3RwYm1jZ2FIbHdhR1Z1Y3lCaGJtUWdjM0JoWTJWeklHOXdkR2x2Ym1Gc0xseHVJQ0FnS2x4dUlDQWdLaUJBY0hKcGRtRjBaVnh1SUNBZ0tpQkFjR0Z5WVcwZ2UzTjBjbWx1WjMwZ2MzUnlhVzVuSUZSb1pTQnpkSEpwYm1jZ2RHOGdjWFZoYkdsbWVTNWNiaUFnSUNvZ1FISmxkSFZ5Ym5NZ2UzTjBjbWx1WjMwZ1ZHaGxJSEYxWVd4cFptbGxaQ0J6ZEhKcGJtY3VYRzRnSUNBcUwxeHVJQ0JtZFc1amRHbHZiaUJ4ZFdGc2FXWjVLSE4wY21sdVp5a2dlMXh1SUNBZ0lISmxkSFZ5YmlCVGRISnBibWNvYzNSeWFXNW5LUzV5WlhCc1lXTmxLQzhvV3lBdFhTa29QeUVrS1M5bkxDQW5KREUvSnlrN1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRU0JpWVhKbExXSnZibVZ6SUdCQmNuSmhlU055WldSMVkyVmdJR3hwYTJVZ2RYUnBiR2wwZVNCbWRXNWpkR2x2Ymk1Y2JpQWdJQ3BjYmlBZ0lDb2dRSEJ5YVhaaGRHVmNiaUFnSUNvZ1FIQmhjbUZ0SUh0QmNuSmhlWDBnWVhKeVlYa2dWR2hsSUdGeWNtRjVJSFJ2SUdsMFpYSmhkR1VnYjNabGNpNWNiaUFnSUNvZ1FIQmhjbUZ0SUh0R2RXNWpkR2x2Ym4wZ1kyRnNiR0poWTJzZ1ZHaGxJR1oxYm1OMGFXOXVJR05oYkd4bFpDQndaWElnYVhSbGNtRjBhVzl1TGx4dUlDQWdLaUJBY21WMGRYSnVjeUI3S24wZ1ZHaGxJR0ZqWTNWdGRXeGhkR1ZrSUhKbGMzVnNkQzVjYmlBZ0lDb3ZYRzRnSUdaMWJtTjBhVzl1SUhKbFpIVmpaU2hoY25KaGVTd2dZMkZzYkdKaFkyc3BJSHRjYmlBZ0lDQjJZWElnWVdOamRXMTFiR0YwYjNJZ1BTQnVkV3hzTzF4dUlDQWdJR1ZoWTJnb1lYSnlZWGtzSUdaMWJtTjBhVzl1S0haaGJIVmxMQ0JwYm1SbGVDa2dlMXh1SUNBZ0lDQWdZV05qZFcxMWJHRjBiM0lnUFNCallXeHNZbUZqYXloaFkyTjFiWFZzWVhSdmNpd2dkbUZzZFdVc0lHbHVaR1Y0TENCaGNuSmhlU2s3WEc0Z0lDQWdmU2s3WEc0Z0lDQWdjbVYwZFhKdUlHRmpZM1Z0ZFd4aGRHOXlPMXh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUZKbGJXOTJaWE1nYkdWaFpHbHVaeUJoYm1RZ2RISmhhV3hwYm1jZ2QyaHBkR1Z6Y0dGalpTQm1jbTl0SUdFZ2MzUnlhVzVuTGx4dUlDQWdLbHh1SUNBZ0tpQkFjSEpwZG1GMFpWeHVJQ0FnS2lCQWNHRnlZVzBnZTNOMGNtbHVaMzBnYzNSeWFXNW5JRlJvWlNCemRISnBibWNnZEc4Z2RISnBiUzVjYmlBZ0lDb2dRSEpsZEhWeWJuTWdlM04wY21sdVozMGdWR2hsSUhSeWFXMXRaV1FnYzNSeWFXNW5MbHh1SUNBZ0tpOWNiaUFnWm5WdVkzUnBiMjRnZEhKcGJTaHpkSEpwYm1jcElIdGNiaUFnSUNCeVpYUjFjbTRnVTNSeWFXNW5LSE4wY21sdVp5a3VjbVZ3YkdGalpTZ3ZYaUFyZkNBckpDOW5MQ0FuSnlrN1hHNGdJSDFjYmx4dUlDQXZLaTB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0S2k5Y2JseHVJQ0F2S2lwY2JpQWdJQ29nUTNKbFlYUmxjeUJoSUc1bGR5QndiR0YwWm05eWJTQnZZbXBsWTNRdVhHNGdJQ0FxWEc0Z0lDQXFJRUJ0WlcxaVpYSlBaaUJ3YkdGMFptOXliVnh1SUNBZ0tpQkFjR0Z5WVcwZ2UwOWlhbVZqZEh4emRISnBibWQ5SUZ0MVlUMXVZWFpwWjJGMGIzSXVkWE5sY2tGblpXNTBYU0JVYUdVZ2RYTmxjaUJoWjJWdWRDQnpkSEpwYm1jZ2IzSmNiaUFnSUNvZ0lHTnZiblJsZUhRZ2IySnFaV04wTGx4dUlDQWdLaUJBY21WMGRYSnVjeUI3VDJKcVpXTjBmU0JCSUhCc1lYUm1iM0p0SUc5aWFtVmpkQzVjYmlBZ0lDb3ZYRzRnSUdaMWJtTjBhVzl1SUhCaGNuTmxLSFZoS1NCN1hHNWNiaUFnSUNBdktpb2dWR2hsSUdWdWRtbHliMjV0Wlc1MElHTnZiblJsZUhRZ2IySnFaV04wTGlBcUwxeHVJQ0FnSUhaaGNpQmpiMjUwWlhoMElEMGdjbTl2ZER0Y2JseHVJQ0FnSUM4cUtpQlZjMlZrSUhSdklHWnNZV2NnZDJobGJpQmhJR04xYzNSdmJTQmpiMjUwWlhoMElHbHpJSEJ5YjNacFpHVmtMaUFxTDF4dUlDQWdJSFpoY2lCcGMwTjFjM1J2YlVOdmJuUmxlSFFnUFNCMVlTQW1KaUIwZVhCbGIyWWdkV0VnUFQwZ0oyOWlhbVZqZENjZ0ppWWdaMlYwUTJ4aGMzTlBaaWgxWVNrZ0lUMGdKMU4wY21sdVp5YzdYRzVjYmlBZ0lDQXZMeUJLZFdkbmJHVWdZWEpuZFcxbGJuUnpMbHh1SUNBZ0lHbG1JQ2hwYzBOMWMzUnZiVU52Ym5SbGVIUXBJSHRjYmlBZ0lDQWdJR052Ym5SbGVIUWdQU0IxWVR0Y2JpQWdJQ0FnSUhWaElEMGdiblZzYkR0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2S2lvZ1FuSnZkM05sY2lCdVlYWnBaMkYwYjNJZ2IySnFaV04wTGlBcUwxeHVJQ0FnSUhaaGNpQnVZWFlnUFNCamIyNTBaWGgwTG01aGRtbG5ZWFJ2Y2lCOGZDQjdmVHRjYmx4dUlDQWdJQzhxS2lCQ2NtOTNjMlZ5SUhWelpYSWdZV2RsYm5RZ2MzUnlhVzVuTGlBcUwxeHVJQ0FnSUhaaGNpQjFjMlZ5UVdkbGJuUWdQU0J1WVhZdWRYTmxja0ZuWlc1MElIeDhJQ2NuTzF4dVhHNGdJQ0FnZFdFZ2ZId2dLSFZoSUQwZ2RYTmxja0ZuWlc1MEtUdGNibHh1SUNBZ0lDOHFLaUJWYzJWa0lIUnZJR1pzWVdjZ2QyaGxiaUJnZEdocGMwSnBibVJwYm1kZ0lHbHpJSFJvWlNCYlRXOWtkV3hsVTJOdmNHVmRMaUFxTDF4dUlDQWdJSFpoY2lCcGMwMXZaSFZzWlZOamIzQmxJRDBnYVhORGRYTjBiMjFEYjI1MFpYaDBJSHg4SUhSb2FYTkNhVzVrYVc1bklEMDlJRzlzWkZKdmIzUTdYRzVjYmlBZ0lDQXZLaW9nVlhObFpDQjBieUJrWlhSbFkzUWdhV1lnWW5KdmQzTmxjaUJwY3lCc2FXdGxJRU5vY205dFpTNGdLaTljYmlBZ0lDQjJZWElnYkdsclpVTm9jbTl0WlNBOUlHbHpRM1Z6ZEc5dFEyOXVkR1Y0ZEZ4dUlDQWdJQ0FnUHlBaElXNWhkaTVzYVd0bFEyaHliMjFsWEc0Z0lDQWdJQ0E2SUM5Y1hHSkRhSEp2YldWY1hHSXZMblJsYzNRb2RXRXBJQ1ltSUNFdmFXNTBaWEp1WVd4OFhGeHVMMmt1ZEdWemRDaDBiMU4wY21sdVp5NTBiMU4wY21sdVp5Z3BLVHRjYmx4dUlDQWdJQzhxS2lCSmJuUmxjbTVoYkNCZ1cxdERiR0Z6YzExZFlDQjJZV3gxWlNCemFHOXlkR04xZEhNdUlDb3ZYRzRnSUNBZ2RtRnlJRzlpYW1WamRFTnNZWE56SUQwZ0owOWlhbVZqZENjc1hHNGdJQ0FnSUNBZ0lHRnBjbEoxYm5ScGJXVkRiR0Z6Y3lBOUlHbHpRM1Z6ZEc5dFEyOXVkR1Y0ZENBL0lHOWlhbVZqZEVOc1lYTnpJRG9nSjFOamNtbHdkRUp5YVdSbmFXNW5VSEp2ZUhsUFltcGxZM1FuTEZ4dUlDQWdJQ0FnSUNCbGJuWnBjbTlEYkdGemN5QTlJR2x6UTNWemRHOXRRMjl1ZEdWNGRDQS9JRzlpYW1WamRFTnNZWE56SURvZ0owVnVkbWx5YjI1dFpXNTBKeXhjYmlBZ0lDQWdJQ0FnYW1GMllVTnNZWE56SUQwZ0tHbHpRM1Z6ZEc5dFEyOXVkR1Y0ZENBbUppQmpiMjUwWlhoMExtcGhkbUVwSUQ4Z0owcGhkbUZRWVdOcllXZGxKeUE2SUdkbGRFTnNZWE56VDJZb1kyOXVkR1Y0ZEM1cVlYWmhLU3hjYmlBZ0lDQWdJQ0FnY0doaGJuUnZiVU5zWVhOeklEMGdhWE5EZFhOMGIyMURiMjUwWlhoMElEOGdiMkpxWldOMFEyeGhjM01nT2lBblVuVnVkR2x0WlU5aWFtVmpkQ2M3WEc1Y2JpQWdJQ0F2S2lvZ1JHVjBaV04wSUVwaGRtRWdaVzUyYVhKdmJtMWxiblJ6TGlBcUwxeHVJQ0FnSUhaaGNpQnFZWFpoSUQwZ0wxeGNZa3BoZG1FdkxuUmxjM1FvYW1GMllVTnNZWE56S1NBbUppQmpiMjUwWlhoMExtcGhkbUU3WEc1Y2JpQWdJQ0F2S2lvZ1JHVjBaV04wSUZKb2FXNXZMaUFxTDF4dUlDQWdJSFpoY2lCeWFHbHVieUE5SUdwaGRtRWdKaVlnWjJWMFEyeGhjM05QWmloamIyNTBaWGgwTG1WdWRtbHliMjV0Wlc1MEtTQTlQU0JsYm5acGNtOURiR0Z6Y3p0Y2JseHVJQ0FnSUM4cUtpQkJJR05vWVhKaFkzUmxjaUIwYnlCeVpYQnlaWE5sYm5RZ1lXeHdhR0V1SUNvdlhHNGdJQ0FnZG1GeUlHRnNjR2hoSUQwZ2FtRjJZU0EvSUNkaEp5QTZJQ2RjWEhVd00ySXhKenRjYmx4dUlDQWdJQzhxS2lCQklHTm9ZWEpoWTNSbGNpQjBieUJ5WlhCeVpYTmxiblFnWW1WMFlTNGdLaTljYmlBZ0lDQjJZWElnWW1WMFlTQTlJR3BoZG1FZ1B5QW5ZaWNnT2lBblhGeDFNRE5pTWljN1hHNWNiaUFnSUNBdktpb2dRbkp2ZDNObGNpQmtiMk4xYldWdWRDQnZZbXBsWTNRdUlDb3ZYRzRnSUNBZ2RtRnlJR1J2WXlBOUlHTnZiblJsZUhRdVpHOWpkVzFsYm5RZ2ZId2dlMzA3WEc1Y2JpQWdJQ0F2S2lwY2JpQWdJQ0FnS2lCRVpYUmxZM1FnVDNCbGNtRWdZbkp2ZDNObGNpQW9VSEpsYzNSdkxXSmhjMlZrS1M1Y2JpQWdJQ0FnS2lCb2RIUndPaTh2ZDNkM0xtaHZkM1J2WTNKbFlYUmxMbU52TG5WckwyOXdaWEpoVTNSMVptWXZiM0JsY21GUFltcGxZM1F1YUhSdGJGeHVJQ0FnSUNBcUlHaDBkSEE2THk5a1pYWXViM0JsY21FdVkyOXRMMkZ5ZEdsamJHVnpMM1pwWlhjdmIzQmxjbUV0YldsdWFTMTNaV0l0WTI5dWRHVnVkQzFoZFhSb2IzSnBibWN0WjNWcFpHVnNhVzVsY3k4amIzQmxjbUZ0YVc1cFhHNGdJQ0FnSUNvdlhHNGdJQ0FnZG1GeUlHOXdaWEpoSUQwZ1kyOXVkR1Y0ZEM1dmNHVnlZVzFwYm1rZ2ZId2dZMjl1ZEdWNGRDNXZjR1Z5WVR0Y2JseHVJQ0FnSUM4cUtpQlBjR1Z5WVNCZ1cxdERiR0Z6YzExZFlDNGdLaTljYmlBZ0lDQjJZWElnYjNCbGNtRkRiR0Z6Y3lBOUlISmxUM0JsY21FdWRHVnpkQ2h2Y0dWeVlVTnNZWE56SUQwZ0tHbHpRM1Z6ZEc5dFEyOXVkR1Y0ZENBbUppQnZjR1Z5WVNrZ1B5QnZjR1Z5WVZzblcxdERiR0Z6YzExZEoxMGdPaUJuWlhSRGJHRnpjMDltS0c5d1pYSmhLU2xjYmlBZ0lDQWdJRDhnYjNCbGNtRkRiR0Z6YzF4dUlDQWdJQ0FnT2lBb2IzQmxjbUVnUFNCdWRXeHNLVHRjYmx4dUlDQWdJQzhxTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0S2k5Y2JseHVJQ0FnSUM4cUtpQlVaVzF3YjNKaGNua2dkbUZ5YVdGaWJHVWdkWE5sWkNCdmRtVnlJSFJvWlNCelkzSnBjSFFuY3lCc2FXWmxkR2x0WlM0Z0tpOWNiaUFnSUNCMllYSWdaR0YwWVR0Y2JseHVJQ0FnSUM4cUtpQlVhR1VnUTFCVklHRnlZMmhwZEdWamRIVnlaUzRnS2k5Y2JpQWdJQ0IyWVhJZ1lYSmphQ0E5SUhWaE8xeHVYRzRnSUNBZ0x5b3FJRkJzWVhSbWIzSnRJR1JsYzJOeWFYQjBhVzl1SUdGeWNtRjVMaUFxTDF4dUlDQWdJSFpoY2lCa1pYTmpjbWx3ZEdsdmJpQTlJRnRkTzF4dVhHNGdJQ0FnTHlvcUlGQnNZWFJtYjNKdElHRnNjR2hoTDJKbGRHRWdhVzVrYVdOaGRHOXlMaUFxTDF4dUlDQWdJSFpoY2lCd2NtVnlaV3hsWVhObElEMGdiblZzYkR0Y2JseHVJQ0FnSUM4cUtpQkJJR1pzWVdjZ2RHOGdhVzVrYVdOaGRHVWdkR2hoZENCbGJuWnBjbTl1YldWdWRDQm1aV0YwZFhKbGN5QnphRzkxYkdRZ1ltVWdkWE5sWkNCMGJ5QnlaWE52YkhabElIUm9aU0J3YkdGMFptOXliUzRnS2k5Y2JpQWdJQ0IyWVhJZ2RYTmxSbVZoZEhWeVpYTWdQU0IxWVNBOVBTQjFjMlZ5UVdkbGJuUTdYRzVjYmlBZ0lDQXZLaW9nVkdobElHSnliM2R6WlhJdlpXNTJhWEp2Ym0xbGJuUWdkbVZ5YzJsdmJpNGdLaTljYmlBZ0lDQjJZWElnZG1WeWMybHZiaUE5SUhWelpVWmxZWFIxY21WeklDWW1JRzl3WlhKaElDWW1JSFI1Y0dWdlppQnZjR1Z5WVM1MlpYSnphVzl1SUQwOUlDZG1kVzVqZEdsdmJpY2dKaVlnYjNCbGNtRXVkbVZ5YzJsdmJpZ3BPMXh1WEc0Z0lDQWdMeW9xSUVFZ1pteGhaeUIwYnlCcGJtUnBZMkYwWlNCcFppQjBhR1VnVDFNZ1pXNWtjeUIzYVhSb0lGd2lMeUJXWlhKemFXOXVYQ0lnS2k5Y2JpQWdJQ0IyWVhJZ2FYTlRjR1ZqYVdGc1EyRnpaV1JQVXp0Y2JseHVJQ0FnSUM4cUlFUmxkR1ZqZEdGaWJHVWdiR0Y1YjNWMElHVnVaMmx1WlhNZ0tHOXlaR1Z5SUdseklHbHRjRzl5ZEdGdWRDa3VJQ292WEc0Z0lDQWdkbUZ5SUd4aGVXOTFkQ0E5SUdkbGRFeGhlVzkxZENoYlhHNGdJQ0FnSUNCN0lDZHNZV0psYkNjNklDZEZaR2RsU0ZSTlRDY3NJQ2R3WVhSMFpYSnVKem9nSjBWa1oyVW5JSDBzWEc0Z0lDQWdJQ0FuVkhKcFpHVnVkQ2NzWEc0Z0lDQWdJQ0I3SUNkc1lXSmxiQ2M2SUNkWFpXSkxhWFFuTENBbmNHRjBkR1Z5YmljNklDZEJjSEJzWlZkbFlrdHBkQ2NnZlN4Y2JpQWdJQ0FnSUNkcFEyRmlKeXhjYmlBZ0lDQWdJQ2RRY21WemRHOG5MRnh1SUNBZ0lDQWdKMDVsZEVaeWIyNTBKeXhjYmlBZ0lDQWdJQ2RVWVhOdFlXNG5MRnh1SUNBZ0lDQWdKMHRJVkUxTUp5eGNiaUFnSUNBZ0lDZEhaV05yYnlkY2JpQWdJQ0JkS1R0Y2JseHVJQ0FnSUM4cUlFUmxkR1ZqZEdGaWJHVWdZbkp2ZDNObGNpQnVZVzFsY3lBb2IzSmtaWElnYVhNZ2FXMXdiM0owWVc1MEtTNGdLaTljYmlBZ0lDQjJZWElnYm1GdFpTQTlJR2RsZEU1aGJXVW9XMXh1SUNBZ0lDQWdKMEZrYjJKbElFRkpVaWNzWEc0Z0lDQWdJQ0FuUVhKdmNtRW5MRnh1SUNBZ0lDQWdKMEYyWVc1MElFSnliM2R6WlhJbkxGeHVJQ0FnSUNBZ0owSnlaV0ZqYUNjc1hHNGdJQ0FnSUNBblEyRnRhVzV2Snl4Y2JpQWdJQ0FnSUNkRmJHVmpkSEp2Ymljc1hHNGdJQ0FnSUNBblJYQnBjR2hoYm5rbkxGeHVJQ0FnSUNBZ0owWmxibTVsWXljc1hHNGdJQ0FnSUNBblJteHZZMnNuTEZ4dUlDQWdJQ0FnSjBkaGJHVnZiaWNzWEc0Z0lDQWdJQ0FuUjNKbFpXNUNjbTkzYzJWeUp5eGNiaUFnSUNBZ0lDZHBRMkZpSnl4Y2JpQWdJQ0FnSUNkSlkyVjNaV0Z6Wld3bkxGeHVJQ0FnSUNBZ0owc3RUV1ZzWlc5dUp5eGNiaUFnSUNBZ0lDZExiMjV4ZFdWeWIzSW5MRnh1SUNBZ0lDQWdKMHgxYm1GelkyRndaU2NzWEc0Z0lDQWdJQ0FuVFdGNGRHaHZiaWNzWEc0Z0lDQWdJQ0I3SUNkc1lXSmxiQ2M2SUNkTmFXTnliM052Wm5RZ1JXUm5aU2NzSUNkd1lYUjBaWEp1SnpvZ0owVmtaMlVuSUgwc1hHNGdJQ0FnSUNBblRXbGtiM0pwSnl4Y2JpQWdJQ0FnSUNkT2IyOXJJRUp5YjNkelpYSW5MRnh1SUNBZ0lDQWdKMUJoYkdWTmIyOXVKeXhjYmlBZ0lDQWdJQ2RRYUdGdWRHOXRTbE1uTEZ4dUlDQWdJQ0FnSjFKaGRtVnVKeXhjYmlBZ0lDQWdJQ2RTWld0dmJuRW5MRnh1SUNBZ0lDQWdKMUp2WTJ0TlpXeDBKeXhjYmlBZ0lDQWdJSHNnSjJ4aFltVnNKem9nSjFOaGJYTjFibWNnU1c1MFpYSnVaWFFuTENBbmNHRjBkR1Z5YmljNklDZFRZVzF6ZFc1blFuSnZkM05sY2ljZ2ZTeGNiaUFnSUNBZ0lDZFRaV0ZOYjI1clpYa25MRnh1SUNBZ0lDQWdleUFuYkdGaVpXd25PaUFuVTJsc2F5Y3NJQ2R3WVhSMFpYSnVKem9nSnlnL09rTnNiM1ZrT1h4VGFXeHJMVUZqWTJWc1pYSmhkR1ZrS1NjZ2ZTeGNiaUFnSUNBZ0lDZFRiR1ZwY0c1cGNpY3NYRzRnSUNBZ0lDQW5VMnhwYlVKeWIzZHpaWEluTEZ4dUlDQWdJQ0FnZXlBbmJHRmlaV3duT2lBblUxSlhZWEpsSUVseWIyNG5MQ0FuY0dGMGRHVnliaWM2SUNkSmNtOXVKeUI5TEZ4dUlDQWdJQ0FnSjFOMWJuSnBjMlVuTEZ4dUlDQWdJQ0FnSjFOM2FXWjBabTk0Snl4Y2JpQWdJQ0FnSUNkWFlYUmxjbVp2ZUNjc1hHNGdJQ0FnSUNBblYyVmlVRzl6YVhScGRtVW5MRnh1SUNBZ0lDQWdKMDl3WlhKaElFMXBibWtuTEZ4dUlDQWdJQ0FnZXlBbmJHRmlaV3duT2lBblQzQmxjbUVnVFdsdWFTY3NJQ2R3WVhSMFpYSnVKem9nSjA5UWFVOVRKeUI5TEZ4dUlDQWdJQ0FnSjA5d1pYSmhKeXhjYmlBZ0lDQWdJSHNnSjJ4aFltVnNKem9nSjA5d1pYSmhKeXdnSjNCaGRIUmxjbTRuT2lBblQxQlNKeUI5TEZ4dUlDQWdJQ0FnSjBOb2NtOXRaU2NzWEc0Z0lDQWdJQ0I3SUNkc1lXSmxiQ2M2SUNkRGFISnZiV1VnVFc5aWFXeGxKeXdnSjNCaGRIUmxjbTRuT2lBbktEODZRM0pwVDFOOFEzSk5ieWtuSUgwc1hHNGdJQ0FnSUNCN0lDZHNZV0psYkNjNklDZEdhWEpsWm05NEp5d2dKM0JoZEhSbGNtNG5PaUFuS0Q4NlJtbHlaV1p2ZUh4TmFXNWxabWxsYkdRcEp5QjlMRnh1SUNBZ0lDQWdleUFuYkdGaVpXd25PaUFuUm1seVpXWnZlQ0JtYjNJZ2FVOVRKeXdnSjNCaGRIUmxjbTRuT2lBblJuaHBUMU1uSUgwc1hHNGdJQ0FnSUNCN0lDZHNZV0psYkNjNklDZEpSU2NzSUNkd1lYUjBaWEp1SnpvZ0owbEZUVzlpYVd4bEp5QjlMRnh1SUNBZ0lDQWdleUFuYkdGaVpXd25PaUFuU1VVbkxDQW5jR0YwZEdWeWJpYzZJQ2ROVTBsRkp5QjlMRnh1SUNBZ0lDQWdKMU5oWm1GeWFTZGNiaUFnSUNCZEtUdGNibHh1SUNBZ0lDOHFJRVJsZEdWamRHRmliR1VnY0hKdlpIVmpkSE1nS0c5eVpHVnlJR2x6SUdsdGNHOXlkR0Z1ZENrdUlDb3ZYRzRnSUNBZ2RtRnlJSEJ5YjJSMVkzUWdQU0JuWlhSUWNtOWtkV04wS0Z0Y2JpQWdJQ0FnSUhzZ0oyeGhZbVZzSnpvZ0owSnNZV05yUW1WeWNua25MQ0FuY0dGMGRHVnliaWM2SUNkQ1FqRXdKeUI5TEZ4dUlDQWdJQ0FnSjBKc1lXTnJRbVZ5Y25rbkxGeHVJQ0FnSUNBZ2V5QW5iR0ZpWld3bk9pQW5SMkZzWVhoNUlGTW5MQ0FuY0dGMGRHVnliaWM2SUNkSFZDMUpPVEF3TUNjZ2ZTeGNiaUFnSUNBZ0lIc2dKMnhoWW1Wc0p6b2dKMGRoYkdGNGVTQlRNaWNzSUNkd1lYUjBaWEp1SnpvZ0owZFVMVWs1TVRBd0p5QjlMRnh1SUNBZ0lDQWdleUFuYkdGaVpXd25PaUFuUjJGc1lYaDVJRk16Snl3Z0ozQmhkSFJsY200bk9pQW5SMVF0U1Rrek1EQW5JSDBzWEc0Z0lDQWdJQ0I3SUNkc1lXSmxiQ2M2SUNkSFlXeGhlSGtnVXpRbkxDQW5jR0YwZEdWeWJpYzZJQ2RIVkMxSk9UVXdNQ2NnZlN4Y2JpQWdJQ0FnSUhzZ0oyeGhZbVZzSnpvZ0owZGhiR0Y0ZVNCVE5TY3NJQ2R3WVhSMFpYSnVKem9nSjFOTkxVYzVNREFuSUgwc1hHNGdJQ0FnSUNCN0lDZHNZV0psYkNjNklDZEhZV3hoZUhrZ1V6WW5MQ0FuY0dGMGRHVnliaWM2SUNkVFRTMUhPVEl3SnlCOUxGeHVJQ0FnSUNBZ2V5QW5iR0ZpWld3bk9pQW5SMkZzWVhoNUlGTTJJRVZrWjJVbkxDQW5jR0YwZEdWeWJpYzZJQ2RUVFMxSE9USTFKeUI5TEZ4dUlDQWdJQ0FnZXlBbmJHRmlaV3duT2lBblIyRnNZWGg1SUZNM0p5d2dKM0JoZEhSbGNtNG5PaUFuVTAwdFJ6a3pNQ2NnZlN4Y2JpQWdJQ0FnSUhzZ0oyeGhZbVZzSnpvZ0owZGhiR0Y0ZVNCVE55QkZaR2RsSnl3Z0ozQmhkSFJsY200bk9pQW5VMDB0Unprek5TY2dmU3hjYmlBZ0lDQWdJQ2RIYjI5bmJHVWdWRlluTEZ4dUlDQWdJQ0FnSjB4MWJXbGhKeXhjYmlBZ0lDQWdJQ2RwVUdGa0p5eGNiaUFnSUNBZ0lDZHBVRzlrSnl4Y2JpQWdJQ0FnSUNkcFVHaHZibVVuTEZ4dUlDQWdJQ0FnSjB0cGJtUnNaU2NzWEc0Z0lDQWdJQ0I3SUNkc1lXSmxiQ2M2SUNkTGFXNWtiR1VnUm1seVpTY3NJQ2R3WVhSMFpYSnVKem9nSnlnL09rTnNiM1ZrT1h4VGFXeHJMVUZqWTJWc1pYSmhkR1ZrS1NjZ2ZTeGNiaUFnSUNBZ0lDZE9aWGgxY3ljc1hHNGdJQ0FnSUNBblRtOXZheWNzWEc0Z0lDQWdJQ0FuVUd4aGVVSnZiMnNuTEZ4dUlDQWdJQ0FnSjFCc1lYbFRkR0YwYVc5dUlGWnBkR0VuTEZ4dUlDQWdJQ0FnSjFCc1lYbFRkR0YwYVc5dUp5eGNiaUFnSUNBZ0lDZFViM1ZqYUZCaFpDY3NYRzRnSUNBZ0lDQW5WSEpoYm5ObWIzSnRaWEluTEZ4dUlDQWdJQ0FnZXlBbmJHRmlaV3duT2lBblYybHBJRlVuTENBbmNHRjBkR1Z5YmljNklDZFhhV2xWSnlCOUxGeHVJQ0FnSUNBZ0oxZHBhU2NzWEc0Z0lDQWdJQ0FuV0dKdmVDQlBibVVuTEZ4dUlDQWdJQ0FnZXlBbmJHRmlaV3duT2lBbldHSnZlQ0F6TmpBbkxDQW5jR0YwZEdWeWJpYzZJQ2RZWW05NEp5QjlMRnh1SUNBZ0lDQWdKMWh2YjIwblhHNGdJQ0FnWFNrN1hHNWNiaUFnSUNBdktpQkVaWFJsWTNSaFlteGxJRzFoYm5WbVlXTjBkWEpsY25NdUlDb3ZYRzRnSUNBZ2RtRnlJRzFoYm5WbVlXTjBkWEpsY2lBOUlHZGxkRTFoYm5WbVlXTjBkWEpsY2loN1hHNGdJQ0FnSUNBblFYQndiR1VuT2lCN0lDZHBVR0ZrSnpvZ01Td2dKMmxRYUc5dVpTYzZJREVzSUNkcFVHOWtKem9nTVNCOUxGeHVJQ0FnSUNBZ0owRnlZMmh2Y3ljNklIdDlMRnh1SUNBZ0lDQWdKMEZ0WVhwdmJpYzZJSHNnSjB0cGJtUnNaU2M2SURFc0lDZExhVzVrYkdVZ1JtbHlaU2M2SURFZ2ZTeGNiaUFnSUNBZ0lDZEJjM1Z6SnpvZ2V5QW5WSEpoYm5ObWIzSnRaWEluT2lBeElIMHNYRzRnSUNBZ0lDQW5RbUZ5Ym1WeklDWWdUbTlpYkdVbk9pQjdJQ2RPYjI5ckp6b2dNU0I5TEZ4dUlDQWdJQ0FnSjBKc1lXTnJRbVZ5Y25rbk9pQjdJQ2RRYkdGNVFtOXZheWM2SURFZ2ZTeGNiaUFnSUNBZ0lDZEhiMjluYkdVbk9pQjdJQ2RIYjI5bmJHVWdWRlluT2lBeExDQW5UbVY0ZFhNbk9pQXhJSDBzWEc0Z0lDQWdJQ0FuU0ZBbk9pQjdJQ2RVYjNWamFGQmhaQ2M2SURFZ2ZTeGNiaUFnSUNBZ0lDZElWRU1uT2lCN2ZTeGNiaUFnSUNBZ0lDZE1SeWM2SUh0OUxGeHVJQ0FnSUNBZ0owMXBZM0p2YzI5bWRDYzZJSHNnSjFoaWIzZ25PaUF4TENBbldHSnZlQ0JQYm1Vbk9pQXhJSDBzWEc0Z0lDQWdJQ0FuVFc5MGIzSnZiR0VuT2lCN0lDZFliMjl0SnpvZ01TQjlMRnh1SUNBZ0lDQWdKMDVwYm5SbGJtUnZKem9nZXlBblYybHBJRlVuT2lBeExDQWdKMWRwYVNjNklERWdmU3hjYmlBZ0lDQWdJQ2RPYjJ0cFlTYzZJSHNnSjB4MWJXbGhKem9nTVNCOUxGeHVJQ0FnSUNBZ0oxTmhiWE4xYm1jbk9pQjdJQ2RIWVd4aGVIa2dVeWM2SURFc0lDZEhZV3hoZUhrZ1V6SW5PaUF4TENBblIyRnNZWGg1SUZNekp6b2dNU3dnSjBkaGJHRjRlU0JUTkNjNklERWdmU3hjYmlBZ0lDQWdJQ2RUYjI1NUp6b2dleUFuVUd4aGVWTjBZWFJwYjI0bk9pQXhMQ0FuVUd4aGVWTjBZWFJwYjI0Z1ZtbDBZU2M2SURFZ2ZWeHVJQ0FnSUgwcE8xeHVYRzRnSUNBZ0x5b2dSR1YwWldOMFlXSnNaU0J2Y0dWeVlYUnBibWNnYzNsemRHVnRjeUFvYjNKa1pYSWdhWE1nYVcxd2IzSjBZVzUwS1M0Z0tpOWNiaUFnSUNCMllYSWdiM01nUFNCblpYUlBVeWhiWEc0Z0lDQWdJQ0FuVjJsdVpHOTNjeUJRYUc5dVpTY3NYRzRnSUNBZ0lDQW5RVzVrY205cFpDY3NYRzRnSUNBZ0lDQW5RMlZ1ZEU5VEp5eGNiaUFnSUNBZ0lIc2dKMnhoWW1Wc0p6b2dKME5vY205dFpTQlBVeWNzSUNkd1lYUjBaWEp1SnpvZ0owTnlUMU1uSUgwc1hHNGdJQ0FnSUNBblJHVmlhV0Z1Snl4Y2JpQWdJQ0FnSUNkR1pXUnZjbUVuTEZ4dUlDQWdJQ0FnSjBaeVpXVkNVMFFuTEZ4dUlDQWdJQ0FnSjBkbGJuUnZieWNzWEc0Z0lDQWdJQ0FuU0dGcGEzVW5MRnh1SUNBZ0lDQWdKMHQxWW5WdWRIVW5MRnh1SUNBZ0lDQWdKMHhwYm5WNElFMXBiblFuTEZ4dUlDQWdJQ0FnSjA5d1pXNUNVMFFuTEZ4dUlDQWdJQ0FnSjFKbFpDQklZWFFuTEZ4dUlDQWdJQ0FnSjFOMVUwVW5MRnh1SUNBZ0lDQWdKMVZpZFc1MGRTY3NYRzRnSUNBZ0lDQW5XSFZpZFc1MGRTY3NYRzRnSUNBZ0lDQW5RM2xuZDJsdUp5eGNiaUFnSUNBZ0lDZFRlVzFpYVdGdUlFOVRKeXhjYmlBZ0lDQWdJQ2RvY0hkUFV5Y3NYRzRnSUNBZ0lDQW5kMlZpVDFNZ0p5eGNiaUFnSUNBZ0lDZDNaV0pQVXljc1hHNGdJQ0FnSUNBblZHRmliR1YwSUU5VEp5eGNiaUFnSUNBZ0lDZFVhWHBsYmljc1hHNGdJQ0FnSUNBblRHbHVkWGduTEZ4dUlDQWdJQ0FnSjAxaFl5QlBVeUJZSnl4Y2JpQWdJQ0FnSUNkTllXTnBiblJ2YzJnbkxGeHVJQ0FnSUNBZ0owMWhZeWNzWEc0Z0lDQWdJQ0FuVjJsdVpHOTNjeUE1T0RzbkxGeHVJQ0FnSUNBZ0oxZHBibVJ2ZDNNZ0oxeHVJQ0FnSUYwcE8xeHVYRzRnSUNBZ0x5b3RMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHFMMXh1WEc0Z0lDQWdMeW9xWEc0Z0lDQWdJQ29nVUdsamEzTWdkR2hsSUd4aGVXOTFkQ0JsYm1kcGJtVWdabkp2YlNCaGJpQmhjbkpoZVNCdlppQm5kV1Z6YzJWekxseHVJQ0FnSUNBcVhHNGdJQ0FnSUNvZ1FIQnlhWFpoZEdWY2JpQWdJQ0FnS2lCQWNHRnlZVzBnZTBGeWNtRjVmU0JuZFdWemMyVnpJRUZ1SUdGeWNtRjVJRzltSUdkMVpYTnpaWE11WEc0Z0lDQWdJQ29nUUhKbGRIVnlibk1nZTI1MWJHeDhjM1J5YVc1bmZTQlVhR1VnWkdWMFpXTjBaV1FnYkdGNWIzVjBJR1Z1WjJsdVpTNWNiaUFnSUNBZ0tpOWNiaUFnSUNCbWRXNWpkR2x2YmlCblpYUk1ZWGx2ZFhRb1ozVmxjM05sY3lrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUhKbFpIVmpaU2huZFdWemMyVnpMQ0JtZFc1amRHbHZiaWh5WlhOMWJIUXNJR2QxWlhOektTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQnlaWE4xYkhRZ2ZId2dVbVZuUlhod0tDZGNYRnhjWWljZ0t5QW9YRzRnSUNBZ0lDQWdJQ0FnWjNWbGMzTXVjR0YwZEdWeWJpQjhmQ0J4ZFdGc2FXWjVLR2QxWlhOektWeHVJQ0FnSUNBZ0lDQXBJQ3NnSjF4Y1hGeGlKeXdnSjJrbktTNWxlR1ZqS0hWaEtTQW1KaUFvWjNWbGMzTXViR0ZpWld3Z2ZId2daM1ZsYzNNcE8xeHVJQ0FnSUNBZ2ZTazdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ0x5b3FYRzRnSUNBZ0lDb2dVR2xqYTNNZ2RHaGxJRzFoYm5WbVlXTjBkWEpsY2lCbWNtOXRJR0Z1SUdGeWNtRjVJRzltSUdkMVpYTnpaWE11WEc0Z0lDQWdJQ3BjYmlBZ0lDQWdLaUJBY0hKcGRtRjBaVnh1SUNBZ0lDQXFJRUJ3WVhKaGJTQjdRWEp5WVhsOUlHZDFaWE56WlhNZ1FXNGdiMkpxWldOMElHOW1JR2QxWlhOelpYTXVYRzRnSUNBZ0lDb2dRSEpsZEhWeWJuTWdlMjUxYkd4OGMzUnlhVzVuZlNCVWFHVWdaR1YwWldOMFpXUWdiV0Z1ZFdaaFkzUjFjbVZ5TGx4dUlDQWdJQ0FxTDF4dUlDQWdJR1oxYm1OMGFXOXVJR2RsZEUxaGJuVm1ZV04wZFhKbGNpaG5kV1Z6YzJWektTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z2NtVmtkV05sS0dkMVpYTnpaWE1zSUdaMWJtTjBhVzl1S0hKbGMzVnNkQ3dnZG1Gc2RXVXNJR3RsZVNrZ2UxeHVJQ0FnSUNBZ0lDQXZMeUJNYjI5cmRYQWdkR2hsSUcxaGJuVm1ZV04wZFhKbGNpQmllU0J3Y205a2RXTjBJRzl5SUhOallXNGdkR2hsSUZWQklHWnZjaUIwYUdVZ2JXRnVkV1poWTNSMWNtVnlMbHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdjbVZ6ZFd4MElIeDhJQ2hjYmlBZ0lDQWdJQ0FnSUNCMllXeDFaVnR3Y205a2RXTjBYU0I4ZkZ4dUlDQWdJQ0FnSUNBZ0lIWmhiSFZsV3k5ZVcyRXRlbDByS0Q4NklDdGJZUzE2WFN0Y1hHSXBLaTlwTG1WNFpXTW9jSEp2WkhWamRDbGRJSHg4WEc0Z0lDQWdJQ0FnSUNBZ1VtVm5SWGh3S0NkY1hGeGNZaWNnS3lCeGRXRnNhV1o1S0d0bGVTa2dLeUFuS0Q4NlhGeGNYR0o4WEZ4Y1hIY3FYRnhjWEdRcEp5d2dKMmtuS1M1bGVHVmpLSFZoS1Z4dUlDQWdJQ0FnSUNBcElDWW1JR3RsZVR0Y2JpQWdJQ0FnSUgwcE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUM4cUtseHVJQ0FnSUNBcUlGQnBZMnR6SUhSb1pTQmljbTkzYzJWeUlHNWhiV1VnWm5KdmJTQmhiaUJoY25KaGVTQnZaaUJuZFdWemMyVnpMbHh1SUNBZ0lDQXFYRzRnSUNBZ0lDb2dRSEJ5YVhaaGRHVmNiaUFnSUNBZ0tpQkFjR0Z5WVcwZ2UwRnljbUY1ZlNCbmRXVnpjMlZ6SUVGdUlHRnljbUY1SUc5bUlHZDFaWE56WlhNdVhHNGdJQ0FnSUNvZ1FISmxkSFZ5Ym5NZ2UyNTFiR3g4YzNSeWFXNW5mU0JVYUdVZ1pHVjBaV04wWldRZ1luSnZkM05sY2lCdVlXMWxMbHh1SUNBZ0lDQXFMMXh1SUNBZ0lHWjFibU4wYVc5dUlHZGxkRTVoYldVb1ozVmxjM05sY3lrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUhKbFpIVmpaU2huZFdWemMyVnpMQ0JtZFc1amRHbHZiaWh5WlhOMWJIUXNJR2QxWlhOektTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQnlaWE4xYkhRZ2ZId2dVbVZuUlhod0tDZGNYRnhjWWljZ0t5QW9YRzRnSUNBZ0lDQWdJQ0FnWjNWbGMzTXVjR0YwZEdWeWJpQjhmQ0J4ZFdGc2FXWjVLR2QxWlhOektWeHVJQ0FnSUNBZ0lDQXBJQ3NnSjF4Y1hGeGlKeXdnSjJrbktTNWxlR1ZqS0hWaEtTQW1KaUFvWjNWbGMzTXViR0ZpWld3Z2ZId2daM1ZsYzNNcE8xeHVJQ0FnSUNBZ2ZTazdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ0x5b3FYRzRnSUNBZ0lDb2dVR2xqYTNNZ2RHaGxJRTlUSUc1aGJXVWdabkp2YlNCaGJpQmhjbkpoZVNCdlppQm5kV1Z6YzJWekxseHVJQ0FnSUNBcVhHNGdJQ0FnSUNvZ1FIQnlhWFpoZEdWY2JpQWdJQ0FnS2lCQWNHRnlZVzBnZTBGeWNtRjVmU0JuZFdWemMyVnpJRUZ1SUdGeWNtRjVJRzltSUdkMVpYTnpaWE11WEc0Z0lDQWdJQ29nUUhKbGRIVnlibk1nZTI1MWJHeDhjM1J5YVc1bmZTQlVhR1VnWkdWMFpXTjBaV1FnVDFNZ2JtRnRaUzVjYmlBZ0lDQWdLaTljYmlBZ0lDQm1kVzVqZEdsdmJpQm5aWFJQVXlobmRXVnpjMlZ6S1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnY21Wa2RXTmxLR2QxWlhOelpYTXNJR1oxYm1OMGFXOXVLSEpsYzNWc2RDd2daM1ZsYzNNcElIdGNiaUFnSUNBZ0lDQWdkbUZ5SUhCaGRIUmxjbTRnUFNCbmRXVnpjeTV3WVhSMFpYSnVJSHg4SUhGMVlXeHBabmtvWjNWbGMzTXBPMXh1SUNBZ0lDQWdJQ0JwWmlBb0lYSmxjM1ZzZENBbUppQW9jbVZ6ZFd4MElEMWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ1VtVm5SWGh3S0NkY1hGeGNZaWNnS3lCd1lYUjBaWEp1SUNzZ0p5Zy9PaTliWEZ4Y1hHUXVYU3Q4V3lCY1hGeGNkeTVkS2lrbkxDQW5hU2NwTG1WNFpXTW9kV0VwWEc0Z0lDQWdJQ0FnSUNBZ0lDQXBLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2NtVnpkV3gwSUQwZ1kyeGxZVzUxY0U5VEtISmxjM1ZzZEN3Z2NHRjBkR1Z5Yml3Z1ozVmxjM011YkdGaVpXd2dmSHdnWjNWbGMzTXBPMXh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJ5WlhOMWJIUTdYRzRnSUNBZ0lDQjlLVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQXZLaXBjYmlBZ0lDQWdLaUJRYVdOcmN5QjBhR1VnY0hKdlpIVmpkQ0J1WVcxbElHWnliMjBnWVc0Z1lYSnlZWGtnYjJZZ1ozVmxjM05sY3k1Y2JpQWdJQ0FnS2x4dUlDQWdJQ0FxSUVCd2NtbDJZWFJsWEc0Z0lDQWdJQ29nUUhCaGNtRnRJSHRCY25KaGVYMGdaM1ZsYzNObGN5QkJiaUJoY25KaGVTQnZaaUJuZFdWemMyVnpMbHh1SUNBZ0lDQXFJRUJ5WlhSMWNtNXpJSHR1ZFd4c2ZITjBjbWx1WjMwZ1ZHaGxJR1JsZEdWamRHVmtJSEJ5YjJSMVkzUWdibUZ0WlM1Y2JpQWdJQ0FnS2k5Y2JpQWdJQ0JtZFc1amRHbHZiaUJuWlhSUWNtOWtkV04wS0dkMVpYTnpaWE1wSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJ5WldSMVkyVW9aM1ZsYzNObGN5d2dablZ1WTNScGIyNG9jbVZ6ZFd4MExDQm5kV1Z6Y3lrZ2UxeHVJQ0FnSUNBZ0lDQjJZWElnY0dGMGRHVnliaUE5SUdkMVpYTnpMbkJoZEhSbGNtNGdmSHdnY1hWaGJHbG1lU2huZFdWemN5azdYRzRnSUNBZ0lDQWdJR2xtSUNnaGNtVnpkV3gwSUNZbUlDaHlaWE4xYkhRZ1BWeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCU1pXZEZlSEFvSjF4Y1hGeGlKeUFySUhCaGRIUmxjbTRnS3lBbklDcGNYRnhjWkN0YkxseGNYRngzWDEwcUp5d2dKMmtuS1M1bGVHVmpLSFZoS1NCOGZGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCU1pXZEZlSEFvSjF4Y1hGeGlKeUFySUhCaGRIUmxjbTRnS3lBbklDcGNYRnhjZHlzdFcxeGNYRngzWFNvbkxDQW5hU2NwTG1WNFpXTW9kV0VwSUh4OFhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUZKbFowVjRjQ2duWEZ4Y1hHSW5JQ3NnY0dGMGRHVnliaUFySUNjb1B6bzdJQ29vUHpwYllTMTZYU3RiWHkxZEtUOWJZUzE2WFN0Y1hGeGNaQ3Q4VzE0Z0tDazdMVjBxS1Njc0lDZHBKeWt1WlhobFl5aDFZU2xjYmlBZ0lDQWdJQ0FnSUNBZ0lDa3BJSHRjYmlBZ0lDQWdJQ0FnSUNBdkx5QlRjR3hwZENCaWVTQm1iM0ozWVhKa0lITnNZWE5vSUdGdVpDQmhjSEJsYm1RZ2NISnZaSFZqZENCMlpYSnphVzl1SUdsbUlHNWxaV1JsWkM1Y2JpQWdJQ0FnSUNBZ0lDQnBaaUFvS0hKbGMzVnNkQ0E5SUZOMGNtbHVaeWdvWjNWbGMzTXViR0ZpWld3Z0ppWWdJVkpsWjBWNGNDaHdZWFIwWlhKdUxDQW5hU2NwTG5SbGMzUW9aM1ZsYzNNdWJHRmlaV3dwS1NBL0lHZDFaWE56TG14aFltVnNJRG9nY21WemRXeDBLUzV6Y0d4cGRDZ25MeWNwS1ZzeFhTQW1KaUFoTDF0Y1hHUXVYU3N2TG5SbGMzUW9jbVZ6ZFd4MFd6QmRLU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdjbVZ6ZFd4MFd6QmRJQ3M5SUNjZ0p5QXJJSEpsYzNWc2RGc3hYVHRjYmlBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lDQWdMeThnUTI5eWNtVmpkQ0JqYUdGeVlXTjBaWElnWTJGelpTQmhibVFnWTJ4bFlXNTFjQ0J6ZEhKcGJtY3VYRzRnSUNBZ0lDQWdJQ0FnWjNWbGMzTWdQU0JuZFdWemN5NXNZV0psYkNCOGZDQm5kV1Z6Y3p0Y2JpQWdJQ0FnSUNBZ0lDQnlaWE4xYkhRZ1BTQm1iM0p0WVhRb2NtVnpkV3gwV3pCZFhHNGdJQ0FnSUNBZ0lDQWdJQ0F1Y21Wd2JHRmpaU2hTWldkRmVIQW9jR0YwZEdWeWJpd2dKMmtuS1N3Z1ozVmxjM01wWEc0Z0lDQWdJQ0FnSUNBZ0lDQXVjbVZ3YkdGalpTaFNaV2RGZUhBb0p6c2dLaWcvT2ljZ0t5Qm5kV1Z6Y3lBcklDZGJYeTFkS1Q4bkxDQW5hU2NwTENBbklDY3BYRzRnSUNBZ0lDQWdJQ0FnSUNBdWNtVndiR0ZqWlNoU1pXZEZlSEFvSnlnbklDc2daM1ZsYzNNZ0t5QW5LVnN0WHk1ZFB5aGNYRnhjZHlrbkxDQW5hU2NwTENBbkpERWdKREluS1NrN1hHNGdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlISmxjM1ZzZER0Y2JpQWdJQ0FnSUgwcE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUM4cUtseHVJQ0FnSUNBcUlGSmxjMjlzZG1WeklIUm9aU0IyWlhKemFXOXVJSFZ6YVc1bklHRnVJR0Z5Y21GNUlHOW1JRlZCSUhCaGRIUmxjbTV6TGx4dUlDQWdJQ0FxWEc0Z0lDQWdJQ29nUUhCeWFYWmhkR1ZjYmlBZ0lDQWdLaUJBY0dGeVlXMGdlMEZ5Y21GNWZTQndZWFIwWlhKdWN5QkJiaUJoY25KaGVTQnZaaUJWUVNCd1lYUjBaWEp1Y3k1Y2JpQWdJQ0FnS2lCQWNtVjBkWEp1Y3lCN2JuVnNiSHh6ZEhKcGJtZDlJRlJvWlNCa1pYUmxZM1JsWkNCMlpYSnphVzl1TGx4dUlDQWdJQ0FxTDF4dUlDQWdJR1oxYm1OMGFXOXVJR2RsZEZabGNuTnBiMjRvY0dGMGRHVnlibk1wSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJ5WldSMVkyVW9jR0YwZEdWeWJuTXNJR1oxYm1OMGFXOXVLSEpsYzNWc2RDd2djR0YwZEdWeWJpa2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdjbVZ6ZFd4MElIeDhJQ2hTWldkRmVIQW9jR0YwZEdWeWJpQXJYRzRnSUNBZ0lDQWdJQ0FnSnlnL09pMWJYRnhjWEdRdVhTc3ZmQ2cvT2lCbWIzSWdXMXhjWEZ4M0xWMHJLVDliSUM4dFhTa29XMXhjWEZ4a0xsMHJXMTRnS0NrN0wxOHRYU29wSnl3Z0oya25LUzVsZUdWaktIVmhLU0I4ZkNBd0tWc3hYU0I4ZkNCdWRXeHNPMXh1SUNBZ0lDQWdmU2s3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdMeW9xWEc0Z0lDQWdJQ29nVW1WMGRYSnVjeUJnY0d4aGRHWnZjbTB1WkdWelkzSnBjSFJwYjI1Z0lIZG9aVzRnZEdobElIQnNZWFJtYjNKdElHOWlhbVZqZENCcGN5QmpiMlZ5WTJWa0lIUnZJR0VnYzNSeWFXNW5MbHh1SUNBZ0lDQXFYRzRnSUNBZ0lDb2dRRzVoYldVZ2RHOVRkSEpwYm1kY2JpQWdJQ0FnS2lCQWJXVnRZbVZ5VDJZZ2NHeGhkR1p2Y20xY2JpQWdJQ0FnS2lCQWNtVjBkWEp1Y3lCN2MzUnlhVzVuZlNCU1pYUjFjbTV6SUdCd2JHRjBabTl5YlM1a1pYTmpjbWx3ZEdsdmJtQWdhV1lnWVhaaGFXeGhZbXhsTENCbGJITmxJR0Z1SUdWdGNIUjVJSE4wY21sdVp5NWNiaUFnSUNBZ0tpOWNiaUFnSUNCbWRXNWpkR2x2YmlCMGIxTjBjbWx1WjFCc1lYUm1iM0p0S0NrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTXVaR1Z6WTNKcGNIUnBiMjRnZkh3Z0p5YzdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ0x5b3RMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHFMMXh1WEc0Z0lDQWdMeThnUTI5dWRtVnlkQ0JzWVhsdmRYUWdkRzhnWVc0Z1lYSnlZWGtnYzI4Z2QyVWdZMkZ1SUdGa1pDQmxlSFJ5WVNCa1pYUmhhV3h6TGx4dUlDQWdJR3hoZVc5MWRDQW1KaUFvYkdGNWIzVjBJRDBnVzJ4aGVXOTFkRjBwTzF4dVhHNGdJQ0FnTHk4Z1JHVjBaV04wSUhCeWIyUjFZM1FnYm1GdFpYTWdkR2hoZENCamIyNTBZV2x1SUhSb1pXbHlJRzFoYm5WbVlXTjBkWEpsY2lkeklHNWhiV1V1WEc0Z0lDQWdhV1lnS0cxaGJuVm1ZV04wZFhKbGNpQW1KaUFoY0hKdlpIVmpkQ2tnZTF4dUlDQWdJQ0FnY0hKdlpIVmpkQ0E5SUdkbGRGQnliMlIxWTNRb1cyMWhiblZtWVdOMGRYSmxjbDBwTzF4dUlDQWdJSDFjYmlBZ0lDQXZMeUJEYkdWaGJpQjFjQ0JIYjI5bmJHVWdWRll1WEc0Z0lDQWdhV1lnS0Noa1lYUmhJRDBnTDF4Y1lrZHZiMmRzWlNCVVZseGNZaTh1WlhobFl5aHdjbTlrZFdOMEtTa3BJSHRjYmlBZ0lDQWdJSEJ5YjJSMVkzUWdQU0JrWVhSaFd6QmRPMXh1SUNBZ0lIMWNiaUFnSUNBdkx5QkVaWFJsWTNRZ2MybHRkV3hoZEc5eWN5NWNiaUFnSUNCcFppQW9MMXhjWWxOcGJYVnNZWFJ2Y2x4Y1lpOXBMblJsYzNRb2RXRXBLU0I3WEc0Z0lDQWdJQ0J3Y205a2RXTjBJRDBnS0hCeWIyUjFZM1FnUHlCd2NtOWtkV04wSUNzZ0p5QW5JRG9nSnljcElDc2dKMU5wYlhWc1lYUnZjaWM3WEc0Z0lDQWdmVnh1SUNBZ0lDOHZJRVJsZEdWamRDQlBjR1Z5WVNCTmFXNXBJRGdySUhKMWJtNXBibWNnYVc0Z1ZIVnlZbTh2Vlc1amIyMXdjbVZ6YzJWa0lHMXZaR1VnYjI0Z2FVOVRMbHh1SUNBZ0lHbG1JQ2h1WVcxbElEMDlJQ2RQY0dWeVlTQk5hVzVwSnlBbUppQXZYRnhpVDFCcFQxTmNYR0l2TG5SbGMzUW9kV0VwS1NCN1hHNGdJQ0FnSUNCa1pYTmpjbWx3ZEdsdmJpNXdkWE5vS0NkeWRXNXVhVzVuSUdsdUlGUjFjbUp2TDFWdVkyOXRjSEpsYzNObFpDQnRiMlJsSnlrN1hHNGdJQ0FnZlZ4dUlDQWdJQzh2SUVSbGRHVmpkQ0JKUlNCTmIySnBiR1VnTVRFdVhHNGdJQ0FnYVdZZ0tHNWhiV1VnUFQwZ0owbEZKeUFtSmlBdlhGeGliR2xyWlNCcFVHaHZibVVnVDFOY1hHSXZMblJsYzNRb2RXRXBLU0I3WEc0Z0lDQWdJQ0JrWVhSaElEMGdjR0Z5YzJVb2RXRXVjbVZ3YkdGalpTZ3ZiR2xyWlNCcFVHaHZibVVnVDFNdkxDQW5KeWtwTzF4dUlDQWdJQ0FnYldGdWRXWmhZM1IxY21WeUlEMGdaR0YwWVM1dFlXNTFabUZqZEhWeVpYSTdYRzRnSUNBZ0lDQndjbTlrZFdOMElEMGdaR0YwWVM1d2NtOWtkV04wTzF4dUlDQWdJSDFjYmlBZ0lDQXZMeUJFWlhSbFkzUWdhVTlUTGx4dUlDQWdJR1ZzYzJVZ2FXWWdLQzllYVZBdkxuUmxjM1FvY0hKdlpIVmpkQ2twSUh0Y2JpQWdJQ0FnSUc1aGJXVWdmSHdnS0c1aGJXVWdQU0FuVTJGbVlYSnBKeWs3WEc0Z0lDQWdJQ0J2Y3lBOUlDZHBUMU1uSUNzZ0tDaGtZWFJoSUQwZ0x5QlBVeUFvVzF4Y1pGOWRLeWt2YVM1bGVHVmpLSFZoS1NsY2JpQWdJQ0FnSUNBZ1B5QW5JQ2NnS3lCa1lYUmhXekZkTG5KbGNHeGhZMlVvTDE4dlp5d2dKeTRuS1Z4dUlDQWdJQ0FnSUNBNklDY25LVHRjYmlBZ0lDQjlYRzRnSUNBZ0x5OGdSR1YwWldOMElFdDFZblZ1ZEhVdVhHNGdJQ0FnWld4elpTQnBaaUFvYm1GdFpTQTlQU0FuUzI5dWNYVmxjbTl5SnlBbUppQWhMMkoxYm5SMUwya3VkR1Z6ZENodmN5a3BJSHRjYmlBZ0lDQWdJRzl6SUQwZ0owdDFZblZ1ZEhVbk8xeHVJQ0FnSUgxY2JpQWdJQ0F2THlCRVpYUmxZM1FnUVc1a2NtOXBaQ0JpY205M2MyVnljeTVjYmlBZ0lDQmxiSE5sSUdsbUlDZ29iV0Z1ZFdaaFkzUjFjbVZ5SUNZbUlHMWhiblZtWVdOMGRYSmxjaUFoUFNBblIyOXZaMnhsSnlBbUpseHVJQ0FnSUNBZ0lDQW9LQzlEYUhKdmJXVXZMblJsYzNRb2JtRnRaU2tnSmlZZ0lTOWNYR0pOYjJKcGJHVWdVMkZtWVhKcFhGeGlMMmt1ZEdWemRDaDFZU2twSUh4OElDOWNYR0pXYVhSaFhGeGlMeTUwWlhOMEtIQnliMlIxWTNRcEtTa2dmSHhjYmlBZ0lDQWdJQ0FnS0M5Y1hHSkJibVJ5YjJsa1hGeGlMeTUwWlhOMEtHOXpLU0FtSmlBdlhrTm9jbTl0WlM4dWRHVnpkQ2h1WVcxbEtTQW1KaUF2WEZ4aVZtVnljMmx2Ymx4Y0x5OXBMblJsYzNRb2RXRXBLU2tnZTF4dUlDQWdJQ0FnYm1GdFpTQTlJQ2RCYm1SeWIybGtJRUp5YjNkelpYSW5PMXh1SUNBZ0lDQWdiM01nUFNBdlhGeGlRVzVrY205cFpGeGNZaTh1ZEdWemRDaHZjeWtnUHlCdmN5QTZJQ2RCYm1SeWIybGtKenRjYmlBZ0lDQjlYRzRnSUNBZ0x5OGdSR1YwWldOMElGTnBiR3NnWkdWemEzUnZjQzloWTJObGJHVnlZWFJsWkNCdGIyUmxjeTVjYmlBZ0lDQmxiSE5sSUdsbUlDaHVZVzFsSUQwOUlDZFRhV3hySnlrZ2UxeHVJQ0FnSUNBZ2FXWWdLQ0V2WEZ4aVRXOWlhUzlwTG5SbGMzUW9kV0VwS1NCN1hHNGdJQ0FnSUNBZ0lHOXpJRDBnSjBGdVpISnZhV1FuTzF4dUlDQWdJQ0FnSUNCa1pYTmpjbWx3ZEdsdmJpNTFibk5vYVdaMEtDZGtaWE5yZEc5d0lHMXZaR1VuS1R0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0FnSUdsbUlDZ3ZRV05qWld4bGNtRjBaV1FnS2owZ0tuUnlkV1V2YVM1MFpYTjBLSFZoS1NrZ2UxeHVJQ0FnSUNBZ0lDQmtaWE5qY21sd2RHbHZiaTUxYm5Ob2FXWjBLQ2RoWTJObGJHVnlZWFJsWkNjcE8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JpQWdJQ0F2THlCRVpYUmxZM1FnVUdGc1pVMXZiMjRnYVdSbGJuUnBabmxwYm1jZ1lYTWdSbWx5WldadmVDNWNiaUFnSUNCbGJITmxJR2xtSUNodVlXMWxJRDA5SUNkUVlXeGxUVzl2YmljZ0ppWWdLR1JoZEdFZ1BTQXZYRnhpUm1seVpXWnZlRnhjTHloYlhGeGtMbDByS1Z4Y1lpOHVaWGhsWXloMVlTa3BLU0I3WEc0Z0lDQWdJQ0JrWlhOamNtbHdkR2x2Ymk1d2RYTm9LQ2RwWkdWdWRHbG1lV2x1WnlCaGN5QkdhWEpsWm05NElDY2dLeUJrWVhSaFd6RmRLVHRjYmlBZ0lDQjlYRzRnSUNBZ0x5OGdSR1YwWldOMElFWnBjbVZtYjNnZ1QxTWdZVzVrSUhCeWIyUjFZM1J6SUhKMWJtNXBibWNnUm1seVpXWnZlQzVjYmlBZ0lDQmxiSE5sSUdsbUlDaHVZVzFsSUQwOUlDZEdhWEpsWm05NEp5QW1KaUFvWkdGMFlTQTlJQzljWEdJb1RXOWlhV3hsZkZSaFlteGxkSHhVVmlsY1hHSXZhUzVsZUdWaktIVmhLU2twSUh0Y2JpQWdJQ0FnSUc5eklIeDhJQ2h2Y3lBOUlDZEdhWEpsWm05NElFOVRKeWs3WEc0Z0lDQWdJQ0J3Y205a2RXTjBJSHg4SUNod2NtOWtkV04wSUQwZ1pHRjBZVnN4WFNrN1hHNGdJQ0FnZlZ4dUlDQWdJQzh2SUVSbGRHVmpkQ0JtWVd4elpTQndiM05wZEdsMlpYTWdabTl5SUVacGNtVm1iM2d2VTJGbVlYSnBMbHh1SUNBZ0lHVnNjMlVnYVdZZ0tDRnVZVzFsSUh4OElDaGtZWFJoSUQwZ0lTOWNYR0pOYVc1bFptbGxiR1JjWEdJdmFTNTBaWE4wS0hWaEtTQW1KaUF2WEZ4aUtEODZSbWx5WldadmVIeFRZV1poY21rcFhGeGlMeTVsZUdWaktHNWhiV1VwS1NrZ2UxeHVJQ0FnSUNBZ0x5OGdSWE5qWVhCbElIUm9aU0JnTDJBZ1ptOXlJRVpwY21WbWIzZ2dNUzVjYmlBZ0lDQWdJR2xtSUNodVlXMWxJQ1ltSUNGd2NtOWtkV04wSUNZbUlDOWJYRnd2TEYxOFhsdGVLRjByUDF4Y0tTOHVkR1Z6ZENoMVlTNXpiR2xqWlNoMVlTNXBibVJsZUU5bUtHUmhkR0VnS3lBbkx5Y3BJQ3NnT0NrcEtTQjdYRzRnSUNBZ0lDQWdJQzh2SUVOc1pXRnlJRzVoYldVZ2IyWWdabUZzYzJVZ2NHOXphWFJwZG1WekxseHVJQ0FnSUNBZ0lDQnVZVzFsSUQwZ2JuVnNiRHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQWdJQzh2SUZKbFlYTnphV2R1SUdFZ1oyVnVaWEpwWXlCdVlXMWxMbHh1SUNBZ0lDQWdhV1lnS0Noa1lYUmhJRDBnY0hKdlpIVmpkQ0I4ZkNCdFlXNTFabUZqZEhWeVpYSWdmSHdnYjNNcElDWW1YRzRnSUNBZ0lDQWdJQ0FnS0hCeWIyUjFZM1FnZkh3Z2JXRnVkV1poWTNSMWNtVnlJSHg4SUM5Y1hHSW9QenBCYm1SeWIybGtmRk41YldKcFlXNGdUMU44VkdGaWJHVjBJRTlUZkhkbFlrOVRLVnhjWWk4dWRHVnpkQ2h2Y3lrcEtTQjdYRzRnSUNBZ0lDQWdJRzVoYldVZ1BTQXZXMkV0ZWwwcktEODZJRWhoZENrL0wya3VaWGhsWXlndlhGeGlRVzVrY205cFpGeGNZaTh1ZEdWemRDaHZjeWtnUHlCdmN5QTZJR1JoZEdFcElDc2dKeUJDY205M2MyVnlKenRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzRnSUNBZ0x5OGdRV1JrSUVOb2NtOXRaU0IyWlhKemFXOXVJSFJ2SUdSbGMyTnlhWEIwYVc5dUlHWnZjaUJGYkdWamRISnZiaTVjYmlBZ0lDQmxiSE5sSUdsbUlDaHVZVzFsSUQwOUlDZEZiR1ZqZEhKdmJpY2dKaVlnS0dSaGRHRWdQU0FvTDF4Y1lrTm9jbTl0WlZ4Y0x5aGJYRnhrTGwwcktWeGNZaTh1WlhobFl5aDFZU2tnZkh3Z01DbGJNVjBwS1NCN1hHNGdJQ0FnSUNCa1pYTmpjbWx3ZEdsdmJpNXdkWE5vS0NkRGFISnZiV2wxYlNBbklDc2daR0YwWVNrN1hHNGdJQ0FnZlZ4dUlDQWdJQzh2SUVSbGRHVmpkQ0J1YjI0dFQzQmxjbUVnS0ZCeVpYTjBieTFpWVhObFpDa2dkbVZ5YzJsdmJuTWdLRzl5WkdWeUlHbHpJR2x0Y0c5eWRHRnVkQ2t1WEc0Z0lDQWdhV1lnS0NGMlpYSnphVzl1S1NCN1hHNGdJQ0FnSUNCMlpYSnphVzl1SUQwZ1oyVjBWbVZ5YzJsdmJpaGJYRzRnSUNBZ0lDQWdJQ2NvUHpwRGJHOTFaRGw4UTNKcFQxTjhRM0pOYjN4RlpHZGxmRVo0YVU5VGZFbEZUVzlpYVd4bGZFbHliMjU4VDNCbGNtRWdQMDFwYm1sOFQxQnBUMU44VDFCU2ZGSmhkbVZ1ZkZOaGJYTjFibWRDY205M2MyVnlmRk5wYkdzb1B5RXZXMXhjWEZ4a0xsMHJKQ2twSnl4Y2JpQWdJQ0FnSUNBZ0oxWmxjbk5wYjI0bkxGeHVJQ0FnSUNBZ0lDQnhkV0ZzYVdaNUtHNWhiV1VwTEZ4dUlDQWdJQ0FnSUNBbktEODZSbWx5WldadmVIeE5hVzVsWm1sbGJHUjhUbVYwUm5KdmJuUXBKMXh1SUNBZ0lDQWdYU2s3WEc0Z0lDQWdmVnh1SUNBZ0lDOHZJRVJsZEdWamRDQnpkSFZpWW05eWJpQnNZWGx2ZFhRZ1pXNW5hVzVsY3k1Y2JpQWdJQ0JwWmlBb0tHUmhkR0VnUFZ4dUlDQWdJQ0FnSUNBZ0lHeGhlVzkxZENBOVBTQW5hVU5oWWljZ0ppWWdjR0Z5YzJWR2JHOWhkQ2gyWlhKemFXOXVLU0ErSURNZ0ppWWdKMWRsWWt0cGRDY2dmSHhjYmlBZ0lDQWdJQ0FnSUNBdlhGeGlUM0JsY21GY1hHSXZMblJsYzNRb2JtRnRaU2tnSmlZZ0tDOWNYR0pQVUZKY1hHSXZMblJsYzNRb2RXRXBJRDhnSjBKc2FXNXJKeUE2SUNkUWNtVnpkRzhuS1NCOGZGeHVJQ0FnSUNBZ0lDQWdJQzljWEdJb1B6cE5hV1J2Y21sOFRtOXZhM3hUWVdaaGNta3BYRnhpTDJrdWRHVnpkQ2gxWVNrZ0ppWWdJUzllS0Q4NlZISnBaR1Z1ZEh4RlpHZGxTRlJOVENra0x5NTBaWE4wS0d4aGVXOTFkQ2tnSmlZZ0oxZGxZa3RwZENjZ2ZIeGNiaUFnSUNBZ0lDQWdJQ0FoYkdGNWIzVjBJQ1ltSUM5Y1hHSk5VMGxGWEZ4aUwya3VkR1Z6ZENoMVlTa2dKaVlnS0c5eklEMDlJQ2ROWVdNZ1QxTW5JRDhnSjFSaGMyMWhiaWNnT2lBblZISnBaR1Z1ZENjcElIeDhYRzRnSUNBZ0lDQWdJQ0FnYkdGNWIzVjBJRDA5SUNkWFpXSkxhWFFuSUNZbUlDOWNYR0pRYkdGNVUzUmhkR2x2Ymx4Y1lpZy9JU0JXYVhSaFhGeGlLUzlwTG5SbGMzUW9ibUZ0WlNrZ0ppWWdKMDVsZEVaeWIyNTBKMXh1SUNBZ0lDQWdJQ0FwS1NCN1hHNGdJQ0FnSUNCc1lYbHZkWFFnUFNCYlpHRjBZVjA3WEc0Z0lDQWdmVnh1SUNBZ0lDOHZJRVJsZEdWamRDQlhhVzVrYjNkeklGQm9iMjVsSURjZ1pHVnphM1J2Y0NCdGIyUmxMbHh1SUNBZ0lHbG1JQ2h1WVcxbElEMDlJQ2RKUlNjZ0ppWWdLR1JoZEdFZ1BTQW9MenNnS2lnL09saENURmRRZkZwMWJtVlhVQ2tvWEZ4a0t5a3ZhUzVsZUdWaktIVmhLU0I4ZkNBd0tWc3hYU2twSUh0Y2JpQWdJQ0FnSUc1aGJXVWdLejBnSnlCTmIySnBiR1VuTzF4dUlDQWdJQ0FnYjNNZ1BTQW5WMmx1Wkc5M2N5QlFhRzl1WlNBbklDc2dLQzljWENza0x5NTBaWE4wS0dSaGRHRXBJRDhnWkdGMFlTQTZJR1JoZEdFZ0t5QW5MbmduS1R0Y2JpQWdJQ0FnSUdSbGMyTnlhWEIwYVc5dUxuVnVjMmhwWm5Rb0oyUmxjMnQwYjNBZ2JXOWtaU2NwTzF4dUlDQWdJSDFjYmlBZ0lDQXZMeUJFWlhSbFkzUWdWMmx1Wkc5M2N5QlFhRzl1WlNBNExuZ2daR1Z6YTNSdmNDQnRiMlJsTGx4dUlDQWdJR1ZzYzJVZ2FXWWdLQzljWEdKWFVFUmxjMnQwYjNCY1hHSXZhUzUwWlhOMEtIVmhLU2tnZTF4dUlDQWdJQ0FnYm1GdFpTQTlJQ2RKUlNCTmIySnBiR1VuTzF4dUlDQWdJQ0FnYjNNZ1BTQW5WMmx1Wkc5M2N5QlFhRzl1WlNBNExuZ25PMXh1SUNBZ0lDQWdaR1Z6WTNKcGNIUnBiMjR1ZFc1emFHbG1kQ2duWkdWemEzUnZjQ0J0YjJSbEp5azdYRzRnSUNBZ0lDQjJaWEp6YVc5dUlIeDhJQ2gyWlhKemFXOXVJRDBnS0M5Y1hHSnlkam9vVzF4Y1pDNWRLeWt2TG1WNFpXTW9kV0VwSUh4OElEQXBXekZkS1R0Y2JpQWdJQ0I5WEc0Z0lDQWdMeThnUkdWMFpXTjBJRWxGSURFeElHbGtaVzUwYVdaNWFXNW5JR0Z6SUc5MGFHVnlJR0p5YjNkelpYSnpMbHh1SUNBZ0lHVnNjMlVnYVdZZ0tHNWhiV1VnSVQwZ0owbEZKeUFtSmlCc1lYbHZkWFFnUFQwZ0oxUnlhV1JsYm5RbklDWW1JQ2hrWVhSaElEMGdMMXhjWW5KMk9paGJYRnhrTGwwcktTOHVaWGhsWXloMVlTa3BLU0I3WEc0Z0lDQWdJQ0JwWmlBb2JtRnRaU2tnZTF4dUlDQWdJQ0FnSUNCa1pYTmpjbWx3ZEdsdmJpNXdkWE5vS0NkcFpHVnVkR2xtZVdsdVp5QmhjeUFuSUNzZ2JtRnRaU0FySUNoMlpYSnphVzl1SUQ4Z0p5QW5JQ3NnZG1WeWMybHZiaUE2SUNjbktTazdYRzRnSUNBZ0lDQjlYRzRnSUNBZ0lDQnVZVzFsSUQwZ0owbEZKenRjYmlBZ0lDQWdJSFpsY25OcGIyNGdQU0JrWVhSaFd6RmRPMXh1SUNBZ0lIMWNiaUFnSUNBdkx5Qk1aWFpsY21GblpTQmxiblpwY205dWJXVnVkQ0JtWldGMGRYSmxjeTVjYmlBZ0lDQnBaaUFvZFhObFJtVmhkSFZ5WlhNcElIdGNiaUFnSUNBZ0lDOHZJRVJsZEdWamRDQnpaWEoyWlhJdGMybGtaU0JsYm5acGNtOXViV1Z1ZEhNdVhHNGdJQ0FnSUNBdkx5QlNhR2x1YnlCb1lYTWdZU0JuYkc5aVlXd2dablZ1WTNScGIyNGdkMmhwYkdVZ2IzUm9aWEp6SUdoaGRtVWdZU0JuYkc5aVlXd2diMkpxWldOMExseHVJQ0FnSUNBZ2FXWWdLR2x6U0c5emRGUjVjR1VvWTI5dWRHVjRkQ3dnSjJkc2IySmhiQ2NwS1NCN1hHNGdJQ0FnSUNBZ0lHbG1JQ2hxWVhaaEtTQjdYRzRnSUNBZ0lDQWdJQ0FnWkdGMFlTQTlJR3BoZG1FdWJHRnVaeTVUZVhOMFpXMDdYRzRnSUNBZ0lDQWdJQ0FnWVhKamFDQTlJR1JoZEdFdVoyVjBVSEp2Y0dWeWRIa29KMjl6TG1GeVkyZ25LVHRjYmlBZ0lDQWdJQ0FnSUNCdmN5QTlJRzl6SUh4OElHUmhkR0V1WjJWMFVISnZjR1Z5ZEhrb0oyOXpMbTVoYldVbktTQXJJQ2NnSnlBcklHUmhkR0V1WjJWMFVISnZjR1Z5ZEhrb0oyOXpMblpsY25OcGIyNG5LVHRjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNCcFppQW9hWE5OYjJSMWJHVlRZMjl3WlNBbUppQnBjMGh2YzNSVWVYQmxLR052Ym5SbGVIUXNJQ2R6ZVhOMFpXMG5LU0FtSmlBb1pHRjBZU0E5SUZ0amIyNTBaWGgwTG5ONWMzUmxiVjBwV3pCZEtTQjdYRzRnSUNBZ0lDQWdJQ0FnYjNNZ2ZId2dLRzl6SUQwZ1pHRjBZVnN3WFM1dmN5QjhmQ0J1ZFd4c0tUdGNiaUFnSUNBZ0lDQWdJQ0IwY25rZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnWkdGMFlWc3hYU0E5SUdOdmJuUmxlSFF1Y21WeGRXbHlaU2duY21sdVoyOHZaVzVuYVc1bEp5a3VkbVZ5YzJsdmJqdGNiaUFnSUNBZ0lDQWdJQ0FnSUhabGNuTnBiMjRnUFNCa1lYUmhXekZkTG1wdmFXNG9KeTRuS1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJRzVoYldVZ1BTQW5VbWx1WjI5S1V5YzdYRzRnSUNBZ0lDQWdJQ0FnZlNCallYUmphQ2hsS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0JwWmlBb1pHRjBZVnN3WFM1bmJHOWlZV3d1YzNsemRHVnRJRDA5SUdOdmJuUmxlSFF1YzNsemRHVnRLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJRzVoYldVZ1BTQW5UbUZ5ZDJoaGJDYzdYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUdWc2MyVWdhV1lnS0Z4dUlDQWdJQ0FnSUNBZ0lIUjVjR1Z2WmlCamIyNTBaWGgwTG5CeWIyTmxjM01nUFQwZ0oyOWlhbVZqZENjZ0ppWWdJV052Ym5SbGVIUXVjSEp2WTJWemN5NWljbTkzYzJWeUlDWW1YRzRnSUNBZ0lDQWdJQ0FnS0dSaGRHRWdQU0JqYjI1MFpYaDBMbkJ5YjJObGMzTXBYRzRnSUNBZ0lDQWdJQ2tnZTF4dUlDQWdJQ0FnSUNBZ0lHbG1JQ2gwZVhCbGIyWWdaR0YwWVM1MlpYSnphVzl1Y3lBOVBTQW5iMkpxWldOMEp5a2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLSFI1Y0dWdlppQmtZWFJoTG5abGNuTnBiMjV6TG1Wc1pXTjBjbTl1SUQwOUlDZHpkSEpwYm1jbktTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lHUmxjMk55YVhCMGFXOXVMbkIxYzJnb0owNXZaR1VnSnlBcklHUmhkR0V1ZG1WeWMybHZibk11Ym05a1pTazdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lHNWhiV1VnUFNBblJXeGxZM1J5YjI0bk8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCMlpYSnphVzl1SUQwZ1pHRjBZUzUyWlhKemFXOXVjeTVsYkdWamRISnZianRjYmlBZ0lDQWdJQ0FnSUNBZ0lIMGdaV3h6WlNCcFppQW9kSGx3Wlc5bUlHUmhkR0V1ZG1WeWMybHZibk11Ym5jZ1BUMGdKM04wY21sdVp5Y3BJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdaR1Z6WTNKcGNIUnBiMjR1Y0hWemFDZ25RMmh5YjIxcGRXMGdKeUFySUhabGNuTnBiMjRzSUNkT2IyUmxJQ2NnS3lCa1lYUmhMblpsY25OcGIyNXpMbTV2WkdVcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCdVlXMWxJRDBnSjA1WExtcHpKenRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdkbVZ5YzJsdmJpQTlJR1JoZEdFdWRtVnljMmx2Ym5NdWJuYzdYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUc1aGJXVWdQU0FuVG05a1pTNXFjeWM3WEc0Z0lDQWdJQ0FnSUNBZ0lDQmhjbU5vSUQwZ1pHRjBZUzVoY21Ob08xeHVJQ0FnSUNBZ0lDQWdJQ0FnYjNNZ1BTQmtZWFJoTG5Cc1lYUm1iM0p0TzF4dUlDQWdJQ0FnSUNBZ0lDQWdkbVZ5YzJsdmJpQTlJQzliWEZ4a0xsMHJMeTVsZUdWaktHUmhkR0V1ZG1WeWMybHZiaWxjYmlBZ0lDQWdJQ0FnSUNBZ0lIWmxjbk5wYjI0Z1BTQjJaWEp6YVc5dUlEOGdkbVZ5YzJsdmJsc3dYU0E2SUNkMWJtdHViM2R1Snp0Y2JpQWdJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnWld4elpTQnBaaUFvY21ocGJtOHBJSHRjYmlBZ0lDQWdJQ0FnSUNCdVlXMWxJRDBnSjFKb2FXNXZKenRjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnZlZ4dUlDQWdJQ0FnTHk4Z1JHVjBaV04wSUVGa2IySmxJRUZKVWk1Y2JpQWdJQ0FnSUdWc2MyVWdhV1lnS0dkbGRFTnNZWE56VDJZb0tHUmhkR0VnUFNCamIyNTBaWGgwTG5KMWJuUnBiV1VwS1NBOVBTQmhhWEpTZFc1MGFXMWxRMnhoYzNNcElIdGNiaUFnSUNBZ0lDQWdibUZ0WlNBOUlDZEJaRzlpWlNCQlNWSW5PMXh1SUNBZ0lDQWdJQ0J2Y3lBOUlHUmhkR0V1Wm14aGMyZ3VjM2x6ZEdWdExrTmhjR0ZpYVd4cGRHbGxjeTV2Y3p0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0FnSUM4dklFUmxkR1ZqZENCUWFHRnVkRzl0U2xNdVhHNGdJQ0FnSUNCbGJITmxJR2xtSUNoblpYUkRiR0Z6YzA5bUtDaGtZWFJoSUQwZ1kyOXVkR1Y0ZEM1d2FHRnVkRzl0S1NrZ1BUMGdjR2hoYm5SdmJVTnNZWE56S1NCN1hHNGdJQ0FnSUNBZ0lHNWhiV1VnUFNBblVHaGhiblJ2YlVwVEp6dGNiaUFnSUNBZ0lDQWdkbVZ5YzJsdmJpQTlJQ2hrWVhSaElEMGdaR0YwWVM1MlpYSnphVzl1SUh4OElHNTFiR3dwSUNZbUlDaGtZWFJoTG0xaGFtOXlJQ3NnSnk0bklDc2daR0YwWVM1dGFXNXZjaUFySUNjdUp5QXJJR1JoZEdFdWNHRjBZMmdwTzF4dUlDQWdJQ0FnZlZ4dUlDQWdJQ0FnTHk4Z1JHVjBaV04wSUVsRklHTnZiWEJoZEdsaWFXeHBkSGtnYlc5a1pYTXVYRzRnSUNBZ0lDQmxiSE5sSUdsbUlDaDBlWEJsYjJZZ1pHOWpMbVJ2WTNWdFpXNTBUVzlrWlNBOVBTQW5iblZ0WW1WeUp5QW1KaUFvWkdGMFlTQTlJQzljWEdKVWNtbGtaVzUwWEZ3dktGeGNaQ3NwTDJrdVpYaGxZeWgxWVNrcEtTQjdYRzRnSUNBZ0lDQWdJQzh2SUZkbEozSmxJR2x1SUdOdmJYQmhkR2xpYVd4cGRIa2diVzlrWlNCM2FHVnVJSFJvWlNCVWNtbGtaVzUwSUhabGNuTnBiMjRnS3lBMElHUnZaWE51SjNSY2JpQWdJQ0FnSUNBZ0x5OGdaWEYxWVd3Z2RHaGxJR1J2WTNWdFpXNTBJRzF2WkdVdVhHNGdJQ0FnSUNBZ0lIWmxjbk5wYjI0Z1BTQmJkbVZ5YzJsdmJpd2daRzlqTG1SdlkzVnRaVzUwVFc5a1pWMDdYRzRnSUNBZ0lDQWdJR2xtSUNnb1pHRjBZU0E5SUN0a1lYUmhXekZkSUNzZ05Da2dJVDBnZG1WeWMybHZibHN4WFNrZ2UxeHVJQ0FnSUNBZ0lDQWdJR1JsYzJOeWFYQjBhVzl1TG5CMWMyZ29KMGxGSUNjZ0t5QjJaWEp6YVc5dVd6RmRJQ3NnSnlCdGIyUmxKeWs3WEc0Z0lDQWdJQ0FnSUNBZ2JHRjViM1YwSUNZbUlDaHNZWGx2ZFhSYk1WMGdQU0FuSnlrN1hHNGdJQ0FnSUNBZ0lDQWdkbVZ5YzJsdmJsc3hYU0E5SUdSaGRHRTdYRzRnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnZG1WeWMybHZiaUE5SUc1aGJXVWdQVDBnSjBsRkp5QS9JRk4wY21sdVp5aDJaWEp6YVc5dVd6RmRMblJ2Um1sNFpXUW9NU2twSURvZ2RtVnljMmx2Ymxzd1hUdGNiaUFnSUNBZ0lIMWNiaUFnSUNBZ0lDOHZJRVJsZEdWamRDQkpSU0F4TVNCdFlYTnJhVzVuSUdGeklHOTBhR1Z5SUdKeWIzZHpaWEp6TGx4dUlDQWdJQ0FnWld4elpTQnBaaUFvZEhsd1pXOW1JR1J2WXk1a2IyTjFiV1Z1ZEUxdlpHVWdQVDBnSjI1MWJXSmxjaWNnSmlZZ0wxNG9QenBEYUhKdmJXVjhSbWx5WldadmVDbGNYR0l2TG5SbGMzUW9ibUZ0WlNrcElIdGNiaUFnSUNBZ0lDQWdaR1Z6WTNKcGNIUnBiMjR1Y0hWemFDZ25iV0Z6YTJsdVp5QmhjeUFuSUNzZ2JtRnRaU0FySUNjZ0p5QXJJSFpsY25OcGIyNHBPMXh1SUNBZ0lDQWdJQ0J1WVcxbElEMGdKMGxGSnp0Y2JpQWdJQ0FnSUNBZ2RtVnljMmx2YmlBOUlDY3hNUzR3Snp0Y2JpQWdJQ0FnSUNBZ2JHRjViM1YwSUQwZ1d5ZFVjbWxrWlc1MEoxMDdYRzRnSUNBZ0lDQWdJRzl6SUQwZ0oxZHBibVJ2ZDNNbk8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2IzTWdQU0J2Y3lBbUppQm1iM0p0WVhRb2IzTXBPMXh1SUNBZ0lIMWNiaUFnSUNBdkx5QkVaWFJsWTNRZ2NISmxjbVZzWldGelpTQndhR0Z6WlhNdVhHNGdJQ0FnYVdZZ0tIWmxjbk5wYjI0Z0ppWWdLR1JoZEdFZ1BWeHVJQ0FnSUNBZ0lDQWdJQzhvUHpwYllXSmRmR1J3ZkhCeVpYeGJZV0pkWEZ4a0szQnlaU2tvUHpwY1hHUXJYRndyUHlrL0pDOXBMbVY0WldNb2RtVnljMmx2YmlrZ2ZIeGNiaUFnSUNBZ0lDQWdJQ0F2S0Q4NllXeHdhR0Y4WW1WMFlTa29Qem9nUDF4Y1pDay9MMmt1WlhobFl5aDFZU0FySUNjN0p5QXJJQ2gxYzJWR1pXRjBkWEpsY3lBbUppQnVZWFl1WVhCd1RXbHViM0pXWlhKemFXOXVLU2tnZkh4Y2JpQWdJQ0FnSUNBZ0lDQXZYRnhpVFdsdVpXWnBaV3hrWEZ4aUwya3VkR1Z6ZENoMVlTa2dKaVlnSjJFblhHNGdJQ0FnSUNBZ0lDa3BJSHRjYmlBZ0lDQWdJSEJ5WlhKbGJHVmhjMlVnUFNBdllpOXBMblJsYzNRb1pHRjBZU2tnUHlBblltVjBZU2NnT2lBbllXeHdhR0VuTzF4dUlDQWdJQ0FnZG1WeWMybHZiaUE5SUhabGNuTnBiMjR1Y21Wd2JHRmpaU2hTWldkRmVIQW9aR0YwWVNBcklDZGNYRnhjS3o4a0p5a3NJQ2NuS1NBclhHNGdJQ0FnSUNBZ0lDaHdjbVZ5Wld4bFlYTmxJRDA5SUNkaVpYUmhKeUEvSUdKbGRHRWdPaUJoYkhCb1lTa2dLeUFvTDF4Y1pDdGNYQ3MvTHk1bGVHVmpLR1JoZEdFcElIeDhJQ2NuS1R0Y2JpQWdJQ0I5WEc0Z0lDQWdMeThnUkdWMFpXTjBJRVpwY21WbWIzZ2dUVzlpYVd4bExseHVJQ0FnSUdsbUlDaHVZVzFsSUQwOUlDZEdaVzV1WldNbklIeDhJRzVoYldVZ1BUMGdKMFpwY21WbWIzZ25JQ1ltSUM5Y1hHSW9QenBCYm1SeWIybGtmRVpwY21WbWIzZ2dUMU1wWEZ4aUx5NTBaWE4wS0c5ektTa2dlMXh1SUNBZ0lDQWdibUZ0WlNBOUlDZEdhWEpsWm05NElFMXZZbWxzWlNjN1hHNGdJQ0FnZlZ4dUlDQWdJQzh2SUU5aWMyTjFjbVVnVFdGNGRHaHZiaWR6SUhWdWNtVnNhV0ZpYkdVZ2RtVnljMmx2Ymk1Y2JpQWdJQ0JsYkhObElHbG1JQ2h1WVcxbElEMDlJQ2ROWVhoMGFHOXVKeUFtSmlCMlpYSnphVzl1S1NCN1hHNGdJQ0FnSUNCMlpYSnphVzl1SUQwZ2RtVnljMmx2Ymk1eVpYQnNZV05sS0M5Y1hDNWJYRnhrTGwwckx5d2dKeTU0SnlrN1hHNGdJQ0FnZlZ4dUlDQWdJQzh2SUVSbGRHVmpkQ0JZWW05NElETTJNQ0JoYm1RZ1dHSnZlQ0JQYm1VdVhHNGdJQ0FnWld4elpTQnBaaUFvTDF4Y1lsaGliM2hjWEdJdmFTNTBaWE4wS0hCeWIyUjFZM1FwS1NCN1hHNGdJQ0FnSUNCcFppQW9jSEp2WkhWamRDQTlQU0FuV0dKdmVDQXpOakFuS1NCN1hHNGdJQ0FnSUNBZ0lHOXpJRDBnYm5Wc2JEdGNiaUFnSUNBZ0lIMWNiaUFnSUNBZ0lHbG1JQ2h3Y205a2RXTjBJRDA5SUNkWVltOTRJRE0yTUNjZ0ppWWdMMXhjWWtsRlRXOWlhV3hsWEZ4aUx5NTBaWE4wS0hWaEtTa2dlMXh1SUNBZ0lDQWdJQ0JrWlhOamNtbHdkR2x2Ymk1MWJuTm9hV1owS0NkdGIySnBiR1VnYlc5a1pTY3BPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lIMWNiaUFnSUNBdkx5QkJaR1FnYlc5aWFXeGxJSEJ2YzNSbWFYZ3VYRzRnSUNBZ1pXeHpaU0JwWmlBb0tDOWVLRDg2UTJoeWIyMWxmRWxGZkU5d1pYSmhLU1F2TG5SbGMzUW9ibUZ0WlNrZ2ZId2dibUZ0WlNBbUppQWhjSEp2WkhWamRDQW1KaUFoTDBKeWIzZHpaWEo4VFc5aWFTOHVkR1Z6ZENodVlXMWxLU2tnSmlaY2JpQWdJQ0FnSUNBZ0tHOXpJRDA5SUNkWGFXNWtiM2R6SUVORkp5QjhmQ0F2VFc5aWFTOXBMblJsYzNRb2RXRXBLU2tnZTF4dUlDQWdJQ0FnYm1GdFpTQXJQU0FuSUUxdlltbHNaU2M3WEc0Z0lDQWdmVnh1SUNBZ0lDOHZJRVJsZEdWamRDQkpSU0J3YkdGMFptOXliU0J3Y21WMmFXVjNMbHh1SUNBZ0lHVnNjMlVnYVdZZ0tHNWhiV1VnUFQwZ0owbEZKeUFtSmlCMWMyVkdaV0YwZFhKbGN5a2dlMXh1SUNBZ0lDQWdkSEo1SUh0Y2JpQWdJQ0FnSUNBZ2FXWWdLR052Ym5SbGVIUXVaWGgwWlhKdVlXd2dQVDA5SUc1MWJHd3BJSHRjYmlBZ0lDQWdJQ0FnSUNCa1pYTmpjbWx3ZEdsdmJpNTFibk5vYVdaMEtDZHdiR0YwWm05eWJTQndjbVYyYVdWM0p5azdYRzRnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJSDBnWTJGMFkyZ29aU2tnZTF4dUlDQWdJQ0FnSUNCa1pYTmpjbWx3ZEdsdmJpNTFibk5vYVdaMEtDZGxiV0psWkdSbFpDY3BPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lIMWNiaUFnSUNBdkx5QkVaWFJsWTNRZ1FteGhZMnRDWlhKeWVTQlBVeUIyWlhKemFXOXVMbHh1SUNBZ0lDOHZJR2gwZEhBNkx5OWtiMk56TG1Kc1lXTnJZbVZ5Y25rdVkyOXRMMlZ1TDJSbGRtVnNiM0JsY25NdlpHVnNhWFpsY21GaWJHVnpMekU0TVRZNUwwaFVWRkJmYUdWaFpHVnljMTl6Wlc1MFgySjVYMEpDWDBKeWIzZHpaWEpmTVRJek5Ea3hNVjh4TVM1cWMzQmNiaUFnSUNCbGJITmxJR2xtSUNnb0wxeGNZa0pzWVdOclFtVnljbmxjWEdJdkxuUmxjM1FvY0hKdlpIVmpkQ2tnZkh3Z0wxeGNZa0pDTVRCY1hHSXZMblJsYzNRb2RXRXBLU0FtSmlBb1pHRjBZU0E5WEc0Z0lDQWdJQ0FnSUNBZ0tGSmxaMFY0Y0Nod2NtOWtkV04wTG5KbGNHeGhZMlVvTHlBckwyY3NJQ2NnS2ljcElDc2dKeThvV3k1Y1hGeGNaRjByS1Njc0lDZHBKeWt1WlhobFl5aDFZU2tnZkh3Z01DbGJNVjBnZkh4Y2JpQWdJQ0FnSUNBZ0lDQjJaWEp6YVc5dVhHNGdJQ0FnSUNBZ0lDa3BJSHRjYmlBZ0lDQWdJR1JoZEdFZ1BTQmJaR0YwWVN3Z0wwSkNNVEF2TG5SbGMzUW9kV0VwWFR0Y2JpQWdJQ0FnSUc5eklEMGdLR1JoZEdGYk1WMGdQeUFvY0hKdlpIVmpkQ0E5SUc1MWJHd3NJRzFoYm5WbVlXTjBkWEpsY2lBOUlDZENiR0ZqYTBKbGNuSjVKeWtnT2lBblJHVjJhV05sSUZOdlpuUjNZWEpsSnlrZ0t5QW5JQ2NnS3lCa1lYUmhXekJkTzF4dUlDQWdJQ0FnZG1WeWMybHZiaUE5SUc1MWJHdzdYRzRnSUNBZ2ZWeHVJQ0FnSUM4dklFUmxkR1ZqZENCUGNHVnlZU0JwWkdWdWRHbG1lV2x1Wnk5dFlYTnJhVzVuSUdsMGMyVnNaaUJoY3lCaGJtOTBhR1Z5SUdKeWIzZHpaWEl1WEc0Z0lDQWdMeThnYUhSMGNEb3ZMM2QzZHk1dmNHVnlZUzVqYjIwdmMzVndjRzl5ZEM5cllpOTJhV1YzTHpnME15OWNiaUFnSUNCbGJITmxJR2xtSUNoMGFHbHpJQ0U5SUdadmNrOTNiaUFtSmlCd2NtOWtkV04wSUNFOUlDZFhhV2tuSUNZbUlDaGNiaUFnSUNBZ0lDQWdJQ0FvZFhObFJtVmhkSFZ5WlhNZ0ppWWdiM0JsY21FcElIeDhYRzRnSUNBZ0lDQWdJQ0FnS0M5UGNHVnlZUzh1ZEdWemRDaHVZVzFsS1NBbUppQXZYRnhpS0Q4NlRWTkpSWHhHYVhKbFptOTRLVnhjWWk5cExuUmxjM1FvZFdFcEtTQjhmRnh1SUNBZ0lDQWdJQ0FnSUNodVlXMWxJRDA5SUNkR2FYSmxabTk0SnlBbUppQXZYRnhpVDFNZ1dDQW9QenBjWEdRclhGd3VLWHN5TEgwdkxuUmxjM1FvYjNNcEtTQjhmRnh1SUNBZ0lDQWdJQ0FnSUNodVlXMWxJRDA5SUNkSlJTY2dKaVlnS0Z4dUlDQWdJQ0FnSUNBZ0lDQWdLRzl6SUNZbUlDRXZYbGRwYmk4dWRHVnpkQ2h2Y3lrZ0ppWWdkbVZ5YzJsdmJpQStJRFV1TlNrZ2ZIeGNiaUFnSUNBZ0lDQWdJQ0FnSUM5Y1hHSlhhVzVrYjNkeklGaFFYRnhpTHk1MFpYTjBLRzl6S1NBbUppQjJaWEp6YVc5dUlENGdPQ0I4ZkZ4dUlDQWdJQ0FnSUNBZ0lDQWdkbVZ5YzJsdmJpQTlQU0E0SUNZbUlDRXZYRnhpVkhKcFpHVnVkRnhjWWk4dWRHVnpkQ2gxWVNsY2JpQWdJQ0FnSUNBZ0lDQXBLVnh1SUNBZ0lDQWdJQ0FwSUNZbUlDRnlaVTl3WlhKaExuUmxjM1FvS0dSaGRHRWdQU0J3WVhKelpTNWpZV3hzS0dadmNrOTNiaXdnZFdFdWNtVndiR0ZqWlNoeVpVOXdaWEpoTENBbkp5a2dLeUFuT3ljcEtTa2dKaVlnWkdGMFlTNXVZVzFsS1NCN1hHNGdJQ0FnSUNBdkx5QlhhR1Z1SUZ3aWFXUmxiblJwWm5scGJtZGNJaXdnZEdobElGVkJJR052Ym5SaGFXNXpJR0p2ZEdnZ1QzQmxjbUVnWVc1a0lIUm9aU0J2ZEdobGNpQmljbTkzYzJWeUozTWdibUZ0WlM1Y2JpQWdJQ0FnSUdSaGRHRWdQU0FuYVc1bklHRnpJQ2NnS3lCa1lYUmhMbTVoYldVZ0t5QW9LR1JoZEdFZ1BTQmtZWFJoTG5abGNuTnBiMjRwSUQ4Z0p5QW5JQ3NnWkdGMFlTQTZJQ2NuS1R0Y2JpQWdJQ0FnSUdsbUlDaHlaVTl3WlhKaExuUmxjM1FvYm1GdFpTa3BJSHRjYmlBZ0lDQWdJQ0FnYVdZZ0tDOWNYR0pKUlZ4Y1lpOHVkR1Z6ZENoa1lYUmhLU0FtSmlCdmN5QTlQU0FuVFdGaklFOVRKeWtnZTF4dUlDQWdJQ0FnSUNBZ0lHOXpJRDBnYm5Wc2JEdGNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0JrWVhSaElEMGdKMmxrWlc1MGFXWjVKeUFySUdSaGRHRTdYRzRnSUNBZ0lDQjlYRzRnSUNBZ0lDQXZMeUJYYUdWdUlGd2liV0Z6YTJsdVoxd2lMQ0IwYUdVZ1ZVRWdZMjl1ZEdGcGJuTWdiMjVzZVNCMGFHVWdiM1JvWlhJZ1luSnZkM05sY2lkeklHNWhiV1V1WEc0Z0lDQWdJQ0JsYkhObElIdGNiaUFnSUNBZ0lDQWdaR0YwWVNBOUlDZHRZWE5ySnlBcklHUmhkR0U3WEc0Z0lDQWdJQ0FnSUdsbUlDaHZjR1Z5WVVOc1lYTnpLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2JtRnRaU0E5SUdadmNtMWhkQ2h2Y0dWeVlVTnNZWE56TG5KbGNHeGhZMlVvTHloYllTMTZYU2tvVzBFdFdsMHBMMmNzSUNja01TQWtNaWNwS1R0Y2JpQWdJQ0FnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUNBZ0lDQnVZVzFsSUQwZ0owOXdaWEpoSnp0Y2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQnBaaUFvTDF4Y1lrbEZYRnhpTHk1MFpYTjBLR1JoZEdFcEtTQjdYRzRnSUNBZ0lDQWdJQ0FnYjNNZ1BTQnVkV3hzTzF4dUlDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lHbG1JQ2doZFhObFJtVmhkSFZ5WlhNcElIdGNiaUFnSUNBZ0lDQWdJQ0IyWlhKemFXOXVJRDBnYm5Wc2JEdGNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdmVnh1SUNBZ0lDQWdiR0Y1YjNWMElEMGdXeWRRY21WemRHOG5YVHRjYmlBZ0lDQWdJR1JsYzJOeWFYQjBhVzl1TG5CMWMyZ29aR0YwWVNrN1hHNGdJQ0FnZlZ4dUlDQWdJQzh2SUVSbGRHVmpkQ0JYWldKTGFYUWdUbWxuYUhSc2VTQmhibVFnWVhCd2NtOTRhVzFoZEdVZ1EyaHliMjFsTDFOaFptRnlhU0IyWlhKemFXOXVjeTVjYmlBZ0lDQnBaaUFvS0dSaGRHRWdQU0FvTDF4Y1lrRndjR3hsVjJWaVMybDBYRnd2S0Z0Y1hHUXVYU3RjWENzL0tTOXBMbVY0WldNb2RXRXBJSHg4SURBcFd6RmRLU2tnZTF4dUlDQWdJQ0FnTHk4Z1EyOXljbVZqZENCaWRXbHNaQ0J1ZFcxaVpYSWdabTl5SUc1MWJXVnlhV01nWTI5dGNHRnlhWE52Ymk1Y2JpQWdJQ0FnSUM4dklDaGxMbWN1SUZ3aU5UTXlMalZjSWlCaVpXTnZiV1Z6SUZ3aU5UTXlMakExWENJcFhHNGdJQ0FnSUNCa1lYUmhJRDBnVzNCaGNuTmxSbXh2WVhRb1pHRjBZUzV5WlhCc1lXTmxLQzljWEM0b1hGeGtLU1F2TENBbkxqQWtNU2NwS1N3Z1pHRjBZVjA3WEc0Z0lDQWdJQ0F2THlCT2FXZG9kR3g1SUdKMWFXeGtjeUJoY21VZ2NHOXpkR1pwZUdWa0lIZHBkR2dnWVNCY0lpdGNJaTVjYmlBZ0lDQWdJR2xtSUNodVlXMWxJRDA5SUNkVFlXWmhjbWtuSUNZbUlHUmhkR0ZiTVYwdWMyeHBZMlVvTFRFcElEMDlJQ2NySnlrZ2UxeHVJQ0FnSUNBZ0lDQnVZVzFsSUQwZ0oxZGxZa3RwZENCT2FXZG9kR3g1Snp0Y2JpQWdJQ0FnSUNBZ2NISmxjbVZzWldGelpTQTlJQ2RoYkhCb1lTYzdYRzRnSUNBZ0lDQWdJSFpsY25OcGIyNGdQU0JrWVhSaFd6RmRMbk5zYVdObEtEQXNJQzB4S1R0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0FnSUM4dklFTnNaV0Z5SUdsdVkyOXljbVZqZENCaWNtOTNjMlZ5SUhabGNuTnBiMjV6TGx4dUlDQWdJQ0FnWld4elpTQnBaaUFvZG1WeWMybHZiaUE5UFNCa1lYUmhXekZkSUh4OFhHNGdJQ0FnSUNBZ0lDQWdkbVZ5YzJsdmJpQTlQU0FvWkdGMFlWc3lYU0E5SUNndlhGeGlVMkZtWVhKcFhGd3ZLRnRjWEdRdVhTdGNYQ3MvS1M5cExtVjRaV01vZFdFcElIeDhJREFwV3pGZEtTa2dlMXh1SUNBZ0lDQWdJQ0IyWlhKemFXOXVJRDBnYm5Wc2JEdGNiaUFnSUNBZ0lIMWNiaUFnSUNBZ0lDOHZJRlZ6WlNCMGFHVWdablZzYkNCRGFISnZiV1VnZG1WeWMybHZiaUIzYUdWdUlHRjJZV2xzWVdKc1pTNWNiaUFnSUNBZ0lHUmhkR0ZiTVYwZ1BTQW9MMXhjWWtOb2NtOXRaVnhjTHloYlhGeGtMbDByS1M5cExtVjRaV01vZFdFcElIeDhJREFwV3pGZE8xeHVJQ0FnSUNBZ0x5OGdSR1YwWldOMElFSnNhVzVySUd4aGVXOTFkQ0JsYm1kcGJtVXVYRzRnSUNBZ0lDQnBaaUFvWkdGMFlWc3dYU0E5UFNBMU16Y3VNellnSmlZZ1pHRjBZVnN5WFNBOVBTQTFNemN1TXpZZ0ppWWdjR0Z5YzJWR2JHOWhkQ2hrWVhSaFd6RmRLU0ErUFNBeU9DQW1KaUJzWVhsdmRYUWdQVDBnSjFkbFlrdHBkQ2NwSUh0Y2JpQWdJQ0FnSUNBZ2JHRjViM1YwSUQwZ1d5ZENiR2x1YXlkZE8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0x5OGdSR1YwWldOMElFcGhkbUZUWTNKcGNIUkRiM0psTGx4dUlDQWdJQ0FnTHk4Z2FIUjBjRG92TDNOMFlXTnJiM1psY21ac2IzY3VZMjl0TDNGMVpYTjBhVzl1Y3k4Mk56WTRORGMwTDJodmR5MWpZVzR0YVMxa1pYUmxZM1F0ZDJocFkyZ3RhbUYyWVhOamNtbHdkQzFsYm1kcGJtVXRkamd0YjNJdGFuTmpMV2x6TFhWelpXUXRZWFF0Y25WdWRHbHRaUzFwYmkxaGJtUnliMmxjYmlBZ0lDQWdJR2xtSUNnaGRYTmxSbVZoZEhWeVpYTWdmSHdnS0NGc2FXdGxRMmh5YjIxbElDWW1JQ0ZrWVhSaFd6RmRLU2tnZTF4dUlDQWdJQ0FnSUNCc1lYbHZkWFFnSmlZZ0tHeGhlVzkxZEZzeFhTQTlJQ2RzYVd0bElGTmhabUZ5YVNjcE8xeHVJQ0FnSUNBZ0lDQmtZWFJoSUQwZ0tHUmhkR0VnUFNCa1lYUmhXekJkTENCa1lYUmhJRHdnTkRBd0lEOGdNU0E2SUdSaGRHRWdQQ0ExTURBZ1B5QXlJRG9nWkdGMFlTQThJRFV5TmlBL0lETWdPaUJrWVhSaElEd2dOVE16SUQ4Z05DQTZJR1JoZEdFZ1BDQTFNelFnUHlBbk5Dc25JRG9nWkdGMFlTQThJRFV6TlNBL0lEVWdPaUJrWVhSaElEd2dOVE0zSUQ4Z05pQTZJR1JoZEdFZ1BDQTFNemdnUHlBM0lEb2daR0YwWVNBOElEWXdNU0EvSURnZ09pQW5PQ2NwTzF4dUlDQWdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJQ0FnYkdGNWIzVjBJQ1ltSUNoc1lYbHZkWFJiTVYwZ1BTQW5iR2xyWlNCRGFISnZiV1VuS1R0Y2JpQWdJQ0FnSUNBZ1pHRjBZU0E5SUdSaGRHRmJNVjBnZkh3Z0tHUmhkR0VnUFNCa1lYUmhXekJkTENCa1lYUmhJRHdnTlRNd0lEOGdNU0E2SUdSaGRHRWdQQ0ExTXpJZ1B5QXlJRG9nWkdGMFlTQThJRFV6TWk0d05TQS9JRE1nT2lCa1lYUmhJRHdnTlRNeklEOGdOQ0E2SUdSaGRHRWdQQ0ExTXpRdU1ETWdQeUExSURvZ1pHRjBZU0E4SURVek5DNHdOeUEvSURZZ09pQmtZWFJoSUR3Z05UTTBMakV3SUQ4Z055QTZJR1JoZEdFZ1BDQTFNelF1TVRNZ1B5QTRJRG9nWkdGMFlTQThJRFV6TkM0eE5pQS9JRGtnT2lCa1lYUmhJRHdnTlRNMExqSTBJRDhnTVRBZ09pQmtZWFJoSUR3Z05UTTBMak13SUQ4Z01URWdPaUJrWVhSaElEd2dOVE0xTGpBeElEOGdNVElnT2lCa1lYUmhJRHdnTlRNMUxqQXlJRDhnSnpFekt5Y2dPaUJrWVhSaElEd2dOVE0xTGpBM0lEOGdNVFVnT2lCa1lYUmhJRHdnTlRNMUxqRXhJRDhnTVRZZ09pQmtZWFJoSUR3Z05UTTFMakU1SUQ4Z01UY2dPaUJrWVhSaElEd2dOVE0yTGpBMUlEOGdNVGdnT2lCa1lYUmhJRHdnTlRNMkxqRXdJRDhnTVRrZ09pQmtZWFJoSUR3Z05UTTNMakF4SUQ4Z01qQWdPaUJrWVhSaElEd2dOVE0zTGpFeElEOGdKekl4S3ljZ09pQmtZWFJoSUR3Z05UTTNMakV6SUQ4Z01qTWdPaUJrWVhSaElEd2dOVE0zTGpFNElEOGdNalFnT2lCa1lYUmhJRHdnTlRNM0xqSTBJRDhnTWpVZ09pQmtZWFJoSUR3Z05UTTNMak0ySUQ4Z01qWWdPaUJzWVhsdmRYUWdJVDBnSjBKc2FXNXJKeUEvSUNjeU55Y2dPaUFuTWpnbktUdGNiaUFnSUNBZ0lIMWNiaUFnSUNBZ0lDOHZJRUZrWkNCMGFHVWdjRzl6ZEdacGVDQnZaaUJjSWk1NFhDSWdiM0lnWENJclhDSWdabTl5SUdGd2NISnZlR2x0WVhSbElIWmxjbk5wYjI1ekxseHVJQ0FnSUNBZ2JHRjViM1YwSUNZbUlDaHNZWGx2ZFhSYk1WMGdLejBnSnlBbklDc2dLR1JoZEdFZ0t6MGdkSGx3Wlc5bUlHUmhkR0VnUFQwZ0oyNTFiV0psY2ljZ1B5QW5MbmduSURvZ0wxc3VLMTB2TG5SbGMzUW9aR0YwWVNrZ1B5QW5KeUE2SUNjckp5a3BPMXh1SUNBZ0lDQWdMeThnVDJKelkzVnlaU0IyWlhKemFXOXVJR1p2Y2lCemIyMWxJRk5oWm1GeWFTQXhMVElnY21Wc1pXRnpaWE11WEc0Z0lDQWdJQ0JwWmlBb2JtRnRaU0E5UFNBblUyRm1ZWEpwSnlBbUppQW9JWFpsY25OcGIyNGdmSHdnY0dGeWMyVkpiblFvZG1WeWMybHZiaWtnUGlBME5Ta3BJSHRjYmlBZ0lDQWdJQ0FnZG1WeWMybHZiaUE5SUdSaGRHRTdYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVJQ0FnSUM4dklFUmxkR1ZqZENCUGNHVnlZU0JrWlhOcmRHOXdJRzF2WkdWekxseHVJQ0FnSUdsbUlDaHVZVzFsSUQwOUlDZFBjR1Z5WVNjZ0ppWWdJQ2hrWVhSaElEMGdMMXhjWW5waWIzWjhlblpoZGlRdkxtVjRaV01vYjNNcEtTa2dlMXh1SUNBZ0lDQWdibUZ0WlNBclBTQW5JQ2M3WEc0Z0lDQWdJQ0JrWlhOamNtbHdkR2x2Ymk1MWJuTm9hV1owS0Nka1pYTnJkRzl3SUcxdlpHVW5LVHRjYmlBZ0lDQWdJR2xtSUNoa1lYUmhJRDA5SUNkNmRtRjJKeWtnZTF4dUlDQWdJQ0FnSUNCdVlXMWxJQ3M5SUNkTmFXNXBKenRjYmlBZ0lDQWdJQ0FnZG1WeWMybHZiaUE5SUc1MWJHdzdYRzRnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQnVZVzFsSUNzOUlDZE5iMkpwYkdVbk8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2IzTWdQU0J2Y3k1eVpYQnNZV05sS0ZKbFowVjRjQ2duSUNvbklDc2daR0YwWVNBcklDY2tKeWtzSUNjbktUdGNiaUFnSUNCOVhHNGdJQ0FnTHk4Z1JHVjBaV04wSUVOb2NtOXRaU0JrWlhOcmRHOXdJRzF2WkdVdVhHNGdJQ0FnWld4elpTQnBaaUFvYm1GdFpTQTlQU0FuVTJGbVlYSnBKeUFtSmlBdlhGeGlRMmh5YjIxbFhGeGlMeTVsZUdWaktHeGhlVzkxZENBbUppQnNZWGx2ZFhSYk1WMHBLU0I3WEc0Z0lDQWdJQ0JrWlhOamNtbHdkR2x2Ymk1MWJuTm9hV1owS0Nka1pYTnJkRzl3SUcxdlpHVW5LVHRjYmlBZ0lDQWdJRzVoYldVZ1BTQW5RMmh5YjIxbElFMXZZbWxzWlNjN1hHNGdJQ0FnSUNCMlpYSnphVzl1SUQwZ2JuVnNiRHRjYmx4dUlDQWdJQ0FnYVdZZ0tDOWNYR0pQVXlCWVhGeGlMeTUwWlhOMEtHOXpLU2tnZTF4dUlDQWdJQ0FnSUNCdFlXNTFabUZqZEhWeVpYSWdQU0FuUVhCd2JHVW5PMXh1SUNBZ0lDQWdJQ0J2Y3lBOUlDZHBUMU1nTkM0ekt5YzdYRzRnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQnZjeUE5SUc1MWJHdzdYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVJQ0FnSUM4dklGTjBjbWx3SUdsdVkyOXljbVZqZENCUFV5QjJaWEp6YVc5dWN5NWNiaUFnSUNCcFppQW9kbVZ5YzJsdmJpQW1KaUIyWlhKemFXOXVMbWx1WkdWNFQyWW9LR1JoZEdFZ1BTQXZXMXhjWkM1ZEt5UXZMbVY0WldNb2IzTXBLU2tnUFQwZ01DQW1KbHh1SUNBZ0lDQWdJQ0IxWVM1cGJtUmxlRTltS0Njdkp5QXJJR1JoZEdFZ0t5QW5MU2NwSUQ0Z0xURXBJSHRjYmlBZ0lDQWdJRzl6SUQwZ2RISnBiU2h2Y3k1eVpYQnNZV05sS0dSaGRHRXNJQ2NuS1NrN1hHNGdJQ0FnZlZ4dUlDQWdJQzh2SUVGa1pDQnNZWGx2ZFhRZ1pXNW5hVzVsTGx4dUlDQWdJR2xtSUNoc1lYbHZkWFFnSmlZZ0lTOWNYR0lvUHpwQmRtRnVkSHhPYjI5cktWeGNZaTh1ZEdWemRDaHVZVzFsS1NBbUppQW9YRzRnSUNBZ0lDQWdJQzlDY205M2MyVnlmRXgxYm1GelkyRndaWHhOWVhoMGFHOXVMeTUwWlhOMEtHNWhiV1VwSUh4OFhHNGdJQ0FnSUNBZ0lHNWhiV1VnSVQwZ0oxTmhabUZ5YVNjZ0ppWWdMMTVwVDFNdkxuUmxjM1FvYjNNcElDWW1JQzljWEdKVFlXWmhjbWxjWEdJdkxuUmxjM1FvYkdGNWIzVjBXekZkS1NCOGZGeHVJQ0FnSUNBZ0lDQXZYaWcvT2tGa2IySmxmRUZ5YjNKaGZFSnlaV0ZqYUh4TmFXUnZjbWw4VDNCbGNtRjhVR2hoYm5SdmJYeFNaV3R2Ym5GOFVtOWphM3hUWVcxemRXNW5JRWx1ZEdWeWJtVjBmRk5zWldsd2JtbHlmRmRsWWlrdkxuUmxjM1FvYm1GdFpTa2dKaVlnYkdGNWIzVjBXekZkS1NrZ2UxeHVJQ0FnSUNBZ0x5OGdSRzl1SjNRZ1lXUmtJR3hoZVc5MWRDQmtaWFJoYVd4eklIUnZJR1JsYzJOeWFYQjBhVzl1SUdsbUlIUm9aWGtnWVhKbElHWmhiSE5sZVM1Y2JpQWdJQ0FnSUNoa1lYUmhJRDBnYkdGNWIzVjBXMnhoZVc5MWRDNXNaVzVuZEdnZ0xTQXhYU2tnSmlZZ1pHVnpZM0pwY0hScGIyNHVjSFZ6YUNoa1lYUmhLVHRjYmlBZ0lDQjlYRzRnSUNBZ0x5OGdRMjl0WW1sdVpTQmpiMjUwWlhoMGRXRnNJR2x1Wm05eWJXRjBhVzl1TGx4dUlDQWdJR2xtSUNoa1pYTmpjbWx3ZEdsdmJpNXNaVzVuZEdncElIdGNiaUFnSUNBZ0lHUmxjMk55YVhCMGFXOXVJRDBnV3ljb0p5QXJJR1JsYzJOeWFYQjBhVzl1TG1wdmFXNG9KenNnSnlrZ0t5QW5LU2RkTzF4dUlDQWdJSDFjYmlBZ0lDQXZMeUJCY0hCbGJtUWdiV0Z1ZFdaaFkzUjFjbVZ5SUhSdklHUmxjMk55YVhCMGFXOXVMbHh1SUNBZ0lHbG1JQ2h0WVc1MVptRmpkSFZ5WlhJZ0ppWWdjSEp2WkhWamRDQW1KaUJ3Y205a2RXTjBMbWx1WkdWNFQyWW9iV0Z1ZFdaaFkzUjFjbVZ5S1NBOElEQXBJSHRjYmlBZ0lDQWdJR1JsYzJOeWFYQjBhVzl1TG5CMWMyZ29KMjl1SUNjZ0t5QnRZVzUxWm1GamRIVnlaWElwTzF4dUlDQWdJSDFjYmlBZ0lDQXZMeUJCY0hCbGJtUWdjSEp2WkhWamRDQjBieUJrWlhOamNtbHdkR2x2Ymk1Y2JpQWdJQ0JwWmlBb2NISnZaSFZqZENrZ2UxeHVJQ0FnSUNBZ1pHVnpZM0pwY0hScGIyNHVjSFZ6YUNnb0wxNXZiaUF2TG5SbGMzUW9aR1Z6WTNKcGNIUnBiMjViWkdWelkzSnBjSFJwYjI0dWJHVnVaM1JvSUMwZ01WMHBJRDhnSnljZ09pQW5iMjRnSnlrZ0t5QndjbTlrZFdOMEtUdGNiaUFnSUNCOVhHNGdJQ0FnTHk4Z1VHRnljMlVnZEdobElFOVRJR2x1ZEc4Z1lXNGdiMkpxWldOMExseHVJQ0FnSUdsbUlDaHZjeWtnZTF4dUlDQWdJQ0FnWkdGMFlTQTlJQzhnS0Z0Y1hHUXVLMTByS1NRdkxtVjRaV01vYjNNcE8xeHVJQ0FnSUNBZ2FYTlRjR1ZqYVdGc1EyRnpaV1JQVXlBOUlHUmhkR0VnSmlZZ2IzTXVZMmhoY2tGMEtHOXpMbXhsYm1kMGFDQXRJR1JoZEdGYk1GMHViR1Z1WjNSb0lDMGdNU2tnUFQwZ0p5OG5PMXh1SUNBZ0lDQWdiM01nUFNCN1hHNGdJQ0FnSUNBZ0lDZGhjbU5vYVhSbFkzUjFjbVVuT2lBek1peGNiaUFnSUNBZ0lDQWdKMlpoYldsc2VTYzZJQ2hrWVhSaElDWW1JQ0ZwYzFOd1pXTnBZV3hEWVhObFpFOVRLU0EvSUc5ekxuSmxjR3hoWTJVb1pHRjBZVnN3WFN3Z0p5Y3BJRG9nYjNNc1hHNGdJQ0FnSUNBZ0lDZDJaWEp6YVc5dUp6b2daR0YwWVNBL0lHUmhkR0ZiTVYwZ09pQnVkV3hzTEZ4dUlDQWdJQ0FnSUNBbmRHOVRkSEpwYm1jbk9pQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ0lDQWdJQ0FnSUNCMllYSWdkbVZ5YzJsdmJpQTlJSFJvYVhNdWRtVnljMmx2Ymp0Y2JpQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z2RHaHBjeTVtWVcxcGJIa2dLeUFvS0habGNuTnBiMjRnSmlZZ0lXbHpVM0JsWTJsaGJFTmhjMlZrVDFNcElEOGdKeUFuSUNzZ2RtVnljMmx2YmlBNklDY25LU0FySUNoMGFHbHpMbUZ5WTJocGRHVmpkSFZ5WlNBOVBTQTJOQ0EvSUNjZ05qUXRZbWwwSnlBNklDY25LVHRjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnZlR0Y2JpQWdJQ0I5WEc0Z0lDQWdMeThnUVdSa0lHSnliM2R6WlhJdlQxTWdZWEpqYUdsMFpXTjBkWEpsTGx4dUlDQWdJR2xtSUNnb1pHRjBZU0E5SUM5Y1hHSW9QenBCVFVSOFNVRjhWMmx1ZkZkUFYzeDRPRFpmZkhncE5qUmNYR0l2YVM1bGVHVmpLR0Z5WTJncEtTQW1KaUFoTDF4Y1ltazJPRFpjWEdJdmFTNTBaWE4wS0dGeVkyZ3BLU0I3WEc0Z0lDQWdJQ0JwWmlBb2IzTXBJSHRjYmlBZ0lDQWdJQ0FnYjNNdVlYSmphR2wwWldOMGRYSmxJRDBnTmpRN1hHNGdJQ0FnSUNBZ0lHOXpMbVpoYldsc2VTQTlJRzl6TG1aaGJXbHNlUzV5WlhCc1lXTmxLRkpsWjBWNGNDZ25JQ29uSUNzZ1pHRjBZU2tzSUNjbktUdGNiaUFnSUNBZ0lIMWNiaUFnSUNBZ0lHbG1JQ2hjYmlBZ0lDQWdJQ0FnSUNCdVlXMWxJQ1ltSUNndlhGeGlWMDlYTmpSY1hHSXZhUzUwWlhOMEtIVmhLU0I4ZkZ4dUlDQWdJQ0FnSUNBZ0lDaDFjMlZHWldGMGRYSmxjeUFtSmlBdlhGeDNLRDg2T0RaOE16SXBKQzh1ZEdWemRDaHVZWFl1WTNCMVEyeGhjM01nZkh3Z2JtRjJMbkJzWVhSbWIzSnRLU0FtSmlBaEwxeGNZbGRwYmpZME95QjROalJjWEdJdmFTNTBaWE4wS0hWaEtTa3BYRzRnSUNBZ0lDQXBJSHRjYmlBZ0lDQWdJQ0FnWkdWelkzSnBjSFJwYjI0dWRXNXphR2xtZENnbk16SXRZbWwwSnlrN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dUlDQWdJQzh2SUVOb2NtOXRaU0F6T1NCaGJtUWdZV0p2ZG1VZ2IyNGdUMU1nV0NCcGN5QmhiSGRoZVhNZ05qUXRZbWwwTGx4dUlDQWdJR1ZzYzJVZ2FXWWdLRnh1SUNBZ0lDQWdJQ0J2Y3lBbUppQXZYazlUSUZndkxuUmxjM1FvYjNNdVptRnRhV3g1S1NBbUpseHVJQ0FnSUNBZ0lDQnVZVzFsSUQwOUlDZERhSEp2YldVbklDWW1JSEJoY25ObFJteHZZWFFvZG1WeWMybHZiaWtnUGowZ016bGNiaUFnSUNBcElIdGNiaUFnSUNBZ0lHOXpMbUZ5WTJocGRHVmpkSFZ5WlNBOUlEWTBPMXh1SUNBZ0lIMWNibHh1SUNBZ0lIVmhJSHg4SUNoMVlTQTlJRzUxYkd3cE8xeHVYRzRnSUNBZ0x5b3RMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHFMMXh1WEc0Z0lDQWdMeW9xWEc0Z0lDQWdJQ29nVkdobElIQnNZWFJtYjNKdElHOWlhbVZqZEM1Y2JpQWdJQ0FnS2x4dUlDQWdJQ0FxSUVCdVlXMWxJSEJzWVhSbWIzSnRYRzRnSUNBZ0lDb2dRSFI1Y0dVZ1QySnFaV04wWEc0Z0lDQWdJQ292WEc0Z0lDQWdkbUZ5SUhCc1lYUm1iM0p0SUQwZ2UzMDdYRzVjYmlBZ0lDQXZLaXBjYmlBZ0lDQWdLaUJVYUdVZ2NHeGhkR1p2Y20wZ1pHVnpZM0pwY0hScGIyNHVYRzRnSUNBZ0lDcGNiaUFnSUNBZ0tpQkFiV1Z0WW1WeVQyWWdjR3hoZEdadmNtMWNiaUFnSUNBZ0tpQkFkSGx3WlNCemRISnBibWQ4Ym5Wc2JGeHVJQ0FnSUNBcUwxeHVJQ0FnSUhCc1lYUm1iM0p0TG1SbGMyTnlhWEIwYVc5dUlEMGdkV0U3WEc1Y2JpQWdJQ0F2S2lwY2JpQWdJQ0FnS2lCVWFHVWdibUZ0WlNCdlppQjBhR1VnWW5KdmQzTmxjaWR6SUd4aGVXOTFkQ0JsYm1kcGJtVXVYRzRnSUNBZ0lDcGNiaUFnSUNBZ0tpQlVhR1VnYkdsemRDQnZaaUJqYjIxdGIyNGdiR0Y1YjNWMElHVnVaMmx1WlhNZ2FXNWpiSFZrWlRwY2JpQWdJQ0FnS2lCY0lrSnNhVzVyWENJc0lGd2lSV1JuWlVoVVRVeGNJaXdnWENKSFpXTnJiMXdpTENCY0lsUnlhV1JsYm5SY0lpQmhibVFnWENKWFpXSkxhWFJjSWx4dUlDQWdJQ0FxWEc0Z0lDQWdJQ29nUUcxbGJXSmxjazltSUhCc1lYUm1iM0p0WEc0Z0lDQWdJQ29nUUhSNWNHVWdjM1J5YVc1bmZHNTFiR3hjYmlBZ0lDQWdLaTljYmlBZ0lDQndiR0YwWm05eWJTNXNZWGx2ZFhRZ1BTQnNZWGx2ZFhRZ0ppWWdiR0Y1YjNWMFd6QmRPMXh1WEc0Z0lDQWdMeW9xWEc0Z0lDQWdJQ29nVkdobElHNWhiV1VnYjJZZ2RHaGxJSEJ5YjJSMVkzUW5jeUJ0WVc1MVptRmpkSFZ5WlhJdVhHNGdJQ0FnSUNwY2JpQWdJQ0FnS2lCVWFHVWdiR2x6ZENCdlppQnRZVzUxWm1GamRIVnlaWEp6SUdsdVkyeDFaR1U2WEc0Z0lDQWdJQ29nWENKQmNIQnNaVndpTENCY0lrRnlZMmh2YzF3aUxDQmNJa0Z0WVhwdmJsd2lMQ0JjSWtGemRYTmNJaXdnWENKQ1lYSnVaWE1nSmlCT2IySnNaVndpTENCY0lrSnNZV05yUW1WeWNubGNJaXhjYmlBZ0lDQWdLaUJjSWtkdmIyZHNaVndpTENCY0lraFFYQ0lzSUZ3aVNGUkRYQ0lzSUZ3aVRFZGNJaXdnWENKTmFXTnliM052Wm5SY0lpd2dYQ0pOYjNSdmNtOXNZVndpTENCY0lrNXBiblJsYm1SdlhDSXNYRzRnSUNBZ0lDb2dYQ0pPYjJ0cFlWd2lMQ0JjSWxOaGJYTjFibWRjSWlCaGJtUWdYQ0pUYjI1NVhDSmNiaUFnSUNBZ0tseHVJQ0FnSUNBcUlFQnRaVzFpWlhKUFppQndiR0YwWm05eWJWeHVJQ0FnSUNBcUlFQjBlWEJsSUhOMGNtbHVaM3h1ZFd4c1hHNGdJQ0FnSUNvdlhHNGdJQ0FnY0d4aGRHWnZjbTB1YldGdWRXWmhZM1IxY21WeUlEMGdiV0Z1ZFdaaFkzUjFjbVZ5TzF4dVhHNGdJQ0FnTHlvcVhHNGdJQ0FnSUNvZ1ZHaGxJRzVoYldVZ2IyWWdkR2hsSUdKeWIzZHpaWEl2Wlc1MmFYSnZibTFsYm5RdVhHNGdJQ0FnSUNwY2JpQWdJQ0FnS2lCVWFHVWdiR2x6ZENCdlppQmpiMjF0YjI0Z1luSnZkM05sY2lCdVlXMWxjeUJwYm1Oc2RXUmxPbHh1SUNBZ0lDQXFJRndpUTJoeWIyMWxYQ0lzSUZ3aVJXeGxZM1J5YjI1Y0lpd2dYQ0pHYVhKbFptOTRYQ0lzSUZ3aVJtbHlaV1p2ZUNCbWIzSWdhVTlUWENJc0lGd2lTVVZjSWl4Y2JpQWdJQ0FnS2lCY0lrMXBZM0p2YzI5bWRDQkZaR2RsWENJc0lGd2lVR2hoYm5SdmJVcFRYQ0lzSUZ3aVUyRm1ZWEpwWENJc0lGd2lVMlZoVFc5dWEyVjVYQ0lzSUZ3aVUybHNhMXdpTEZ4dUlDQWdJQ0FxSUZ3aVQzQmxjbUVnVFdsdWFWd2lJR0Z1WkNCY0lrOXdaWEpoWENKY2JpQWdJQ0FnS2x4dUlDQWdJQ0FxSUUxdlltbHNaU0IyWlhKemFXOXVjeUJ2WmlCemIyMWxJR0p5YjNkelpYSnpJR2hoZG1VZ1hDSk5iMkpwYkdWY0lpQmhjSEJsYm1SbFpDQjBieUIwYUdWcGNpQnVZVzFsT2x4dUlDQWdJQ0FxSUdWbkxpQmNJa05vY205dFpTQk5iMkpwYkdWY0lpd2dYQ0pHYVhKbFptOTRJRTF2WW1sc1pWd2lMQ0JjSWtsRklFMXZZbWxzWlZ3aUlHRnVaQ0JjSWs5d1pYSmhJRTF2WW1sc1pWd2lYRzRnSUNBZ0lDcGNiaUFnSUNBZ0tpQkFiV1Z0WW1WeVQyWWdjR3hoZEdadmNtMWNiaUFnSUNBZ0tpQkFkSGx3WlNCemRISnBibWQ4Ym5Wc2JGeHVJQ0FnSUNBcUwxeHVJQ0FnSUhCc1lYUm1iM0p0TG01aGJXVWdQU0J1WVcxbE8xeHVYRzRnSUNBZ0x5b3FYRzRnSUNBZ0lDb2dWR2hsSUdGc2NHaGhMMkpsZEdFZ2NtVnNaV0Z6WlNCcGJtUnBZMkYwYjNJdVhHNGdJQ0FnSUNwY2JpQWdJQ0FnS2lCQWJXVnRZbVZ5VDJZZ2NHeGhkR1p2Y20xY2JpQWdJQ0FnS2lCQWRIbHdaU0J6ZEhKcGJtZDhiblZzYkZ4dUlDQWdJQ0FxTDF4dUlDQWdJSEJzWVhSbWIzSnRMbkJ5WlhKbGJHVmhjMlVnUFNCd2NtVnlaV3hsWVhObE8xeHVYRzRnSUNBZ0x5b3FYRzRnSUNBZ0lDb2dWR2hsSUc1aGJXVWdiMllnZEdobElIQnliMlIxWTNRZ2FHOXpkR2x1WnlCMGFHVWdZbkp2ZDNObGNpNWNiaUFnSUNBZ0tseHVJQ0FnSUNBcUlGUm9aU0JzYVhOMElHOW1JR052YlcxdmJpQndjbTlrZFdOMGN5QnBibU5zZFdSbE9seHVJQ0FnSUNBcVhHNGdJQ0FnSUNvZ1hDSkNiR0ZqYTBKbGNuSjVYQ0lzSUZ3aVIyRnNZWGg1SUZNMFhDSXNJRndpVEhWdGFXRmNJaXdnWENKcFVHRmtYQ0lzSUZ3aWFWQnZaRndpTENCY0ltbFFhRzl1WlZ3aUxDQmNJa3RwYm1Sc1pWd2lMRnh1SUNBZ0lDQXFJRndpUzJsdVpHeGxJRVpwY21WY0lpd2dYQ0pPWlhoMWMxd2lMQ0JjSWs1dmIydGNJaXdnWENKUWJHRjVRbTl2YTF3aUxDQmNJbFJ2ZFdOb1VHRmtYQ0lnWVc1a0lGd2lWSEpoYm5ObWIzSnRaWEpjSWx4dUlDQWdJQ0FxWEc0Z0lDQWdJQ29nUUcxbGJXSmxjazltSUhCc1lYUm1iM0p0WEc0Z0lDQWdJQ29nUUhSNWNHVWdjM1J5YVc1bmZHNTFiR3hjYmlBZ0lDQWdLaTljYmlBZ0lDQndiR0YwWm05eWJTNXdjbTlrZFdOMElEMGdjSEp2WkhWamREdGNibHh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRlJvWlNCaWNtOTNjMlZ5SjNNZ2RYTmxjaUJoWjJWdWRDQnpkSEpwYm1jdVhHNGdJQ0FnSUNwY2JpQWdJQ0FnS2lCQWJXVnRZbVZ5VDJZZ2NHeGhkR1p2Y20xY2JpQWdJQ0FnS2lCQWRIbHdaU0J6ZEhKcGJtZDhiblZzYkZ4dUlDQWdJQ0FxTDF4dUlDQWdJSEJzWVhSbWIzSnRMblZoSUQwZ2RXRTdYRzVjYmlBZ0lDQXZLaXBjYmlBZ0lDQWdLaUJVYUdVZ1luSnZkM05sY2k5bGJuWnBjbTl1YldWdWRDQjJaWEp6YVc5dUxseHVJQ0FnSUNBcVhHNGdJQ0FnSUNvZ1FHMWxiV0psY2s5bUlIQnNZWFJtYjNKdFhHNGdJQ0FnSUNvZ1FIUjVjR1VnYzNSeWFXNW5mRzUxYkd4Y2JpQWdJQ0FnS2k5Y2JpQWdJQ0J3YkdGMFptOXliUzUyWlhKemFXOXVJRDBnYm1GdFpTQW1KaUIyWlhKemFXOXVPMXh1WEc0Z0lDQWdMeW9xWEc0Z0lDQWdJQ29nVkdobElHNWhiV1VnYjJZZ2RHaGxJRzl3WlhKaGRHbHVaeUJ6ZVhOMFpXMHVYRzRnSUNBZ0lDcGNiaUFnSUNBZ0tpQkFiV1Z0WW1WeVQyWWdjR3hoZEdadmNtMWNiaUFnSUNBZ0tpQkFkSGx3WlNCUFltcGxZM1JjYmlBZ0lDQWdLaTljYmlBZ0lDQndiR0YwWm05eWJTNXZjeUE5SUc5eklIeDhJSHRjYmx4dUlDQWdJQ0FnTHlvcVhHNGdJQ0FnSUNBZ0tpQlVhR1VnUTFCVklHRnlZMmhwZEdWamRIVnlaU0IwYUdVZ1QxTWdhWE1nWW5WcGJIUWdabTl5TGx4dUlDQWdJQ0FnSUNwY2JpQWdJQ0FnSUNBcUlFQnRaVzFpWlhKUFppQndiR0YwWm05eWJTNXZjMXh1SUNBZ0lDQWdJQ29nUUhSNWNHVWdiblZ0WW1WeWZHNTFiR3hjYmlBZ0lDQWdJQ0FxTDF4dUlDQWdJQ0FnSjJGeVkyaHBkR1ZqZEhWeVpTYzZJRzUxYkd3c1hHNWNiaUFnSUNBZ0lDOHFLbHh1SUNBZ0lDQWdJQ29nVkdobElHWmhiV2xzZVNCdlppQjBhR1VnVDFNdVhHNGdJQ0FnSUNBZ0tseHVJQ0FnSUNBZ0lDb2dRMjl0Ylc5dUlIWmhiSFZsY3lCcGJtTnNkV1JsT2x4dUlDQWdJQ0FnSUNvZ1hDSlhhVzVrYjNkelhDSXNJRndpVjJsdVpHOTNjeUJUWlhKMlpYSWdNakF3T0NCU01pQXZJRGRjSWl3Z1hDSlhhVzVrYjNkeklGTmxjblpsY2lBeU1EQTRJQzhnVm1semRHRmNJaXhjYmlBZ0lDQWdJQ0FxSUZ3aVYybHVaRzkzY3lCWVVGd2lMQ0JjSWs5VElGaGNJaXdnWENKVlluVnVkSFZjSWl3Z1hDSkVaV0pwWVc1Y0lpd2dYQ0pHWldSdmNtRmNJaXdnWENKU1pXUWdTR0YwWENJc0lGd2lVM1ZUUlZ3aUxGeHVJQ0FnSUNBZ0lDb2dYQ0pCYm1SeWIybGtYQ0lzSUZ3aWFVOVRYQ0lnWVc1a0lGd2lWMmx1Wkc5M2N5QlFhRzl1WlZ3aVhHNGdJQ0FnSUNBZ0tseHVJQ0FnSUNBZ0lDb2dRRzFsYldKbGNrOW1JSEJzWVhSbWIzSnRMbTl6WEc0Z0lDQWdJQ0FnS2lCQWRIbHdaU0J6ZEhKcGJtZDhiblZzYkZ4dUlDQWdJQ0FnSUNvdlhHNGdJQ0FnSUNBblptRnRhV3g1SnpvZ2JuVnNiQ3hjYmx4dUlDQWdJQ0FnTHlvcVhHNGdJQ0FnSUNBZ0tpQlVhR1VnZG1WeWMybHZiaUJ2WmlCMGFHVWdUMU11WEc0Z0lDQWdJQ0FnS2x4dUlDQWdJQ0FnSUNvZ1FHMWxiV0psY2s5bUlIQnNZWFJtYjNKdExtOXpYRzRnSUNBZ0lDQWdLaUJBZEhsd1pTQnpkSEpwYm1kOGJuVnNiRnh1SUNBZ0lDQWdJQ292WEc0Z0lDQWdJQ0FuZG1WeWMybHZiaWM2SUc1MWJHd3NYRzVjYmlBZ0lDQWdJQzhxS2x4dUlDQWdJQ0FnSUNvZ1VtVjBkWEp1Y3lCMGFHVWdUMU1nYzNSeWFXNW5MbHh1SUNBZ0lDQWdJQ3BjYmlBZ0lDQWdJQ0FxSUVCdFpXMWlaWEpQWmlCd2JHRjBabTl5YlM1dmMxeHVJQ0FnSUNBZ0lDb2dRSEpsZEhWeWJuTWdlM04wY21sdVozMGdWR2hsSUU5VElITjBjbWx1Wnk1Y2JpQWdJQ0FnSUNBcUwxeHVJQ0FnSUNBZ0ozUnZVM1J5YVc1bkp6b2dablZ1WTNScGIyNG9LU0I3SUhKbGRIVnliaUFuYm5Wc2JDYzdJSDFjYmlBZ0lDQjlPMXh1WEc0Z0lDQWdjR3hoZEdadmNtMHVjR0Z5YzJVZ1BTQndZWEp6WlR0Y2JpQWdJQ0J3YkdGMFptOXliUzUwYjFOMGNtbHVaeUE5SUhSdlUzUnlhVzVuVUd4aGRHWnZjbTA3WEc1Y2JpQWdJQ0JwWmlBb2NHeGhkR1p2Y20wdWRtVnljMmx2YmlrZ2UxeHVJQ0FnSUNBZ1pHVnpZM0pwY0hScGIyNHVkVzV6YUdsbWRDaDJaWEp6YVc5dUtUdGNiaUFnSUNCOVhHNGdJQ0FnYVdZZ0tIQnNZWFJtYjNKdExtNWhiV1VwSUh0Y2JpQWdJQ0FnSUdSbGMyTnlhWEIwYVc5dUxuVnVjMmhwWm5Rb2JtRnRaU2s3WEc0Z0lDQWdmVnh1SUNBZ0lHbG1JQ2h2Y3lBbUppQnVZVzFsSUNZbUlDRW9iM01nUFQwZ1UzUnlhVzVuS0c5ektTNXpjR3hwZENnbklDY3BXekJkSUNZbUlDaHZjeUE5UFNCdVlXMWxMbk53YkdsMEtDY2dKeWxiTUYwZ2ZId2djSEp2WkhWamRDa3BLU0I3WEc0Z0lDQWdJQ0JrWlhOamNtbHdkR2x2Ymk1d2RYTm9LSEJ5YjJSMVkzUWdQeUFuS0NjZ0t5QnZjeUFySUNjcEp5QTZJQ2R2YmlBbklDc2diM01wTzF4dUlDQWdJSDFjYmlBZ0lDQnBaaUFvWkdWelkzSnBjSFJwYjI0dWJHVnVaM1JvS1NCN1hHNGdJQ0FnSUNCd2JHRjBabTl5YlM1a1pYTmpjbWx3ZEdsdmJpQTlJR1JsYzJOeWFYQjBhVzl1TG1wdmFXNG9KeUFuS1R0Y2JpQWdJQ0I5WEc0Z0lDQWdjbVYwZFhKdUlIQnNZWFJtYjNKdE8xeHVJQ0I5WEc1Y2JpQWdMeW90TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFNvdlhHNWNiaUFnTHk4Z1JYaHdiM0owSUhCc1lYUm1iM0p0TGx4dUlDQjJZWElnY0d4aGRHWnZjbTBnUFNCd1lYSnpaU2dwTzF4dVhHNGdJQzh2SUZOdmJXVWdRVTFFSUdKMWFXeGtJRzl3ZEdsdGFYcGxjbk1zSUd4cGEyVWdjaTVxY3l3Z1kyaGxZMnNnWm05eUlHTnZibVJwZEdsdmJpQndZWFIwWlhKdWN5QnNhV3RsSUhSb1pTQm1iMnhzYjNkcGJtYzZYRzRnSUdsbUlDaDBlWEJsYjJZZ1pHVm1hVzVsSUQwOUlDZG1kVzVqZEdsdmJpY2dKaVlnZEhsd1pXOW1JR1JsWm1sdVpTNWhiV1FnUFQwZ0oyOWlhbVZqZENjZ0ppWWdaR1ZtYVc1bExtRnRaQ2tnZTF4dUlDQWdJQzh2SUVWNGNHOXpaU0J3YkdGMFptOXliU0J2YmlCMGFHVWdaMnh2WW1Gc0lHOWlhbVZqZENCMGJ5QndjbVYyWlc1MElHVnljbTl5Y3lCM2FHVnVJSEJzWVhSbWIzSnRJR2x6WEc0Z0lDQWdMeThnYkc5aFpHVmtJR0o1SUdFZ2MyTnlhWEIwSUhSaFp5QnBiaUIwYUdVZ2NISmxjMlZ1WTJVZ2IyWWdZVzRnUVUxRUlHeHZZV1JsY2k1Y2JpQWdJQ0F2THlCVFpXVWdhSFIwY0RvdkwzSmxjWFZwY21WcWN5NXZjbWN2Wkc5amN5OWxjbkp2Y25NdWFIUnRiQ050YVhOdFlYUmphQ0JtYjNJZ2JXOXlaU0JrWlhSaGFXeHpMbHh1SUNBZ0lISnZiM1F1Y0d4aGRHWnZjbTBnUFNCd2JHRjBabTl5YlR0Y2JseHVJQ0FnSUM4dklFUmxabWx1WlNCaGN5QmhiaUJoYm05dWVXMXZkWE1nYlc5a2RXeGxJSE52SUhCc1lYUm1iM0p0SUdOaGJpQmlaU0JoYkdsaGMyVmtJSFJvY205MVoyZ2djR0YwYUNCdFlYQndhVzVuTGx4dUlDQWdJR1JsWm1sdVpTaG1kVzVqZEdsdmJpZ3BJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQndiR0YwWm05eWJUdGNiaUFnSUNCOUtUdGNiaUFnZlZ4dUlDQXZMeUJEYUdWamF5Qm1iM0lnWUdWNGNHOXlkSE5nSUdGbWRHVnlJR0JrWldacGJtVmdJR2x1SUdOaGMyVWdZU0JpZFdsc1pDQnZjSFJwYldsNlpYSWdZV1JrY3lCaGJpQmdaWGh3YjNKMGMyQWdiMkpxWldOMExseHVJQ0JsYkhObElHbG1JQ2htY21WbFJYaHdiM0owY3lBbUppQm1jbVZsVFc5a2RXeGxLU0I3WEc0Z0lDQWdMeThnUlhod2IzSjBJR1p2Y2lCRGIyMXRiMjVLVXlCemRYQndiM0owTGx4dUlDQWdJR1p2Y2s5M2JpaHdiR0YwWm05eWJTd2dablZ1WTNScGIyNG9kbUZzZFdVc0lHdGxlU2tnZTF4dUlDQWdJQ0FnWm5KbFpVVjRjRzl5ZEhOYmEyVjVYU0E5SUhaaGJIVmxPMXh1SUNBZ0lIMHBPMXh1SUNCOVhHNGdJR1ZzYzJVZ2UxeHVJQ0FnSUM4dklFVjRjRzl5ZENCMGJ5QjBhR1VnWjJ4dlltRnNJRzlpYW1WamRDNWNiaUFnSUNCeWIyOTBMbkJzWVhSbWIzSnRJRDBnY0d4aGRHWnZjbTA3WEc0Z0lIMWNibjB1WTJGc2JDaDBhR2x6S1NrN1hHNGlMQ0l2S2lwY2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0tpQk1hV05sYm5ObFpDQjFibVJsY2lCTlNWUWdLR2gwZEhCek9pOHZaMmwwYUhWaUxtTnZiUzl4ZFdGeWF5MWtaWFl2VUdodmJtOXVMVVp5WVcxbGQyOXlheTlpYkc5aUwyMWhjM1JsY2k5TVNVTkZUbE5GS1Z4dUlDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBcUwxeHVhVzF3YjNKMElFTnZiWEJ2Ym1WdWRDQm1jbTl0SUNjdUxpOWpiMjF3YjI1bGJuUW5YRzVwYlhCdmNuUWdRMjlzYkdGd2MyVWdabkp2YlNBbkxpNHZZMjlzYkdGd2MyVW5YRzVwYlhCdmNuUWdleUJuWlhSQmRIUnlhV0oxZEdWelEyOXVabWxuSUgwZ1puSnZiU0FuTGk0dlkyOXRjRzl1Wlc1MFRXRnVZV2RsY2lkY2JtbHRjRzl5ZENCRmRtVnVkQ0JtY205dElDY3VMaTh1TGk5amIzSmxMMlYyWlc1MGN5ZGNibWx0Y0c5eWRDQjdJR1pwYm1SVVlYSm5aWFJDZVVOc1lYTnpJSDBnWm5KdmJTQW5MaTR2TGk0dlkyOXlaUzkxZEdsc2N5ZGNibHh1WTI5dWMzUWdRV05qYjNKa2FXOXVJRDBnS0NncElEMCtJSHRjYmlBZ0x5b3FYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2lCRGIyNXpkR0Z1ZEhOY2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFMMXh1WEc0Z0lHTnZibk4wSUU1QlRVVWdQU0FuWVdOamIzSmthVzl1SjF4dUlDQmpiMjV6ZENCV1JWSlRTVTlPSUQwZ0p6SXVNQzR3SjF4dUlDQmpiMjV6ZENCRVJVWkJWVXhVWDFCU1QxQkZVbFJKUlZNZ1BTQjdYRzRnSUNBZ1pXeGxiV1Z1ZERvZ2JuVnNiQ3hjYmlBZ2ZWeHVJQ0JqYjI1emRDQkVRVlJCWDBGVVZGSlRYMUJTVDFCRlVsUkpSVk1nUFNCYlhHNGdJRjFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUlFTnNZWE56SUVSbFptbHVhWFJwYjI1Y2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFMMXh1WEc0Z0lHTnNZWE56SUVGalkyOXlaR2x2YmlCbGVIUmxibVJ6SUVOdmJYQnZibVZ1ZENCN1hHNWNiaUFnSUNCamIyNXpkSEoxWTNSdmNpaHZjSFJwYjI1eklEMGdlMzBwSUh0Y2JpQWdJQ0FnSUhOMWNHVnlLRTVCVFVVc0lGWkZVbE5KVDA0c0lFUkZSa0ZWVEZSZlVGSlBVRVZTVkVsRlV5d2diM0IwYVc5dWN5d2dSRUZVUVY5QlZGUlNVMTlRVWs5UVJWSlVTVVZUTENCbVlXeHpaU3dnWm1Gc2MyVXBYRzVjYmlBZ0lDQWdJSFJvYVhNdVkyOXNiR0Z3YzJWeklEMGdXMTFjYmx4dUlDQWdJQ0FnWTI5dWMzUWdkRzluWjJ4bGN5QTlJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSkJiR3dvWUZ0a1lYUmhMWFJ2WjJkc1pUMWNJaVI3VGtGTlJYMWNJbDFnS1Z4dUlDQWdJQ0FnZEc5bloyeGxjeTVtYjNKRllXTm9LQ2gwYjJkbmJHVXBJRDArSUh0Y2JpQWdJQ0FnSUNBZ1kyOXVjM1FnWTI5c2JHRndjMlZKWkNBOUlIUnZaMmRzWlM1blpYUkJkSFJ5YVdKMWRHVW9KMmh5WldZbktWeHVJQ0FnSUNBZ0lDQmpiMjV6ZENCamIyeHNZWEJ6WlNBOUlHUnZZM1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0lvWTI5c2JHRndjMlZKWkNsY2JseHVJQ0FnSUNBZ0lDQnBaaUFvWTI5c2JHRndjMlVwSUh0Y2JpQWdJQ0FnSUNBZ0lDQjBhR2x6TG1Ga1pFTnZiR3hoY0hObEtHTnZiR3hoY0hObEtWeHVJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQjlLVnh1SUNBZ0lIMWNibHh1SUNBZ0lHOXVSV3hsYldWdWRFVjJaVzUwS0dWMlpXNTBLU0I3WEc0Z0lDQWdJQ0JqYjI1emRDQnBaQ0E5SUdWMlpXNTBMblJoY21kbGRDNW5aWFJCZEhSeWFXSjFkR1VvSjJoeVpXWW5LVnh1SUNBZ0lDQWdZMjl1YzNRZ1pXeGxiV1Z1ZENBOUlHUnZZM1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0lvYVdRcFhHNWNiaUFnSUNBZ0lIUm9hWE11YzJWMFEyOXNiR0Z3YzJWektHVnNaVzFsYm5RcFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnWVdSa1EyOXNiR0Z3YzJVb1pXeGxiV1Z1ZENrZ2UxeHVJQ0FnSUNBZ1kyOXVjM1FnWTI5c2JHRndjMlVnUFNCdVpYY2dRMjlzYkdGd2MyVW9lMXh1SUNBZ0lDQWdJQ0JsYkdWdFpXNTBMRnh1SUNBZ0lDQWdmU2xjYmlBZ0lDQWdJSFJvYVhNdVkyOXNiR0Z3YzJWekxuQjFjMmdvWTI5c2JHRndjMlVwWEc1Y2JpQWdJQ0FnSUhKbGRIVnliaUJqYjJ4c1lYQnpaVnh1SUNBZ0lIMWNibHh1SUNBZ0lHZGxkRU52Ykd4aGNITmxLR1ZzWlcxbGJuUXBJSHRjYmlBZ0lDQWdJR3hsZENCamIyeHNZWEJ6WlNBOUlIUm9hWE11WTI5c2JHRndjMlZ6TG1acGJtUW9ZeUE5UGlCakxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1blpYUkJkSFJ5YVdKMWRHVW9KMmxrSnlrZ1BUMDlJR1ZzWlcxbGJuUXVaMlYwUVhSMGNtbGlkWFJsS0NkcFpDY3BLVnh1WEc0Z0lDQWdJQ0JwWmlBb0lXTnZiR3hoY0hObEtTQjdYRzRnSUNBZ0lDQWdJQzh2SUdOeVpXRjBaU0JoSUc1bGR5QmpiMnhzWVhCelpWeHVJQ0FnSUNBZ0lDQmpiMnhzWVhCelpTQTlJSFJvYVhNdVlXUmtRMjlzYkdGd2MyVW9LVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0J5WlhSMWNtNGdZMjlzYkdGd2MyVmNiaUFnSUNCOVhHNWNiaUFnSUNCblpYUkRiMnhzWVhCelpYTW9LU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkR2hwY3k1amIyeHNZWEJ6WlhOY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J6WlhSRGIyeHNZWEJ6WlhNb2MyaHZkME52Ykd4aGNITmxLU0I3WEc0Z0lDQWdJQ0JqYjI1emRDQmpiMnhzWVhCelpTQTlJSFJvYVhNdVoyVjBRMjlzYkdGd2MyVW9jMmh2ZDBOdmJHeGhjSE5sS1Z4dUlDQWdJQ0FnZEdocGN5NWpiMnhzWVhCelpYTXVabTl5UldGamFDZ29ZeWtnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQnBaaUFvWXk1dmNIUnBiMjV6TG1Wc1pXMWxiblF1WjJWMFFYUjBjbWxpZFhSbEtDZHBaQ2NwSUNFOVBTQnphRzkzUTI5c2JHRndjMlV1WjJWMFFYUjBjbWxpZFhSbEtDZHBaQ2NwS1NCN1hHNGdJQ0FnSUNBZ0lDQWdZeTVvYVdSbEtDbGNiaUFnSUNBZ0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDQWdJQ0JqYjJ4c1lYQnpaUzUwYjJkbmJHVW9LVnh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0I5S1Z4dUlDQWdJSDFjYmx4dUlDQWdJSE5vYjNjb1kyOXNiR0Z3YzJWRmJDa2dlMXh1SUNBZ0lDQWdiR1YwSUdOdmJHeGhjSE5sSUQwZ1kyOXNiR0Z3YzJWRmJGeHVJQ0FnSUNBZ2FXWWdLSFI1Y0dWdlppQmpiMnhzWVhCelpVVnNJRDA5UFNBbmMzUnlhVzVuSnlrZ2UxeHVJQ0FnSUNBZ0lDQmpiMnhzWVhCelpTQTlJR1J2WTNWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNJb1kyOXNiR0Z3YzJWRmJDbGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdhV1lnS0NGamIyeHNZWEJ6WlNrZ2UxeHVJQ0FnSUNBZ0lDQjBhSEp2ZHlCdVpYY2dSWEp5YjNJb1lDUjdUa0ZOUlgwdUlGUm9aU0JqYjJ4c1lYQnphV0pzWlNBa2UyTnZiR3hoY0hObFJXeDlJR2x6SUdGdUlHbHVkbUZzYVdRZ1NGUk5URVZzWlcxbGJuUXVZQ2xjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnZEdocGN5NXpaWFJEYjJ4c1lYQnpaWE1vWTI5c2JHRndjMlVwWEc1Y2JpQWdJQ0FnSUhKbGRIVnliaUIwY25WbFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYUdsa1pTaGpiMnhzWVhCelpVVnNLU0I3WEc0Z0lDQWdJQ0JzWlhRZ1kyOXNiR0Z3YzJVZ1BTQmpiMnhzWVhCelpVVnNYRzRnSUNBZ0lDQnBaaUFvZEhsd1pXOW1JR052Ykd4aGNITmxSV3dnUFQwOUlDZHpkSEpwYm1jbktTQjdYRzRnSUNBZ0lDQWdJR052Ykd4aGNITmxJRDBnWkc5amRXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNpaGpiMnhzWVhCelpVVnNLVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0JwWmlBb0lXTnZiR3hoY0hObEtTQjdYRzRnSUNBZ0lDQWdJSFJvY205M0lHNWxkeUJGY25KdmNpaGdKSHRPUVUxRmZTNGdWR2hsSUdOdmJHeGhjSE5wWW14bElDUjdZMjlzYkdGd2MyVkZiSDBnYVhNZ1lXNGdhVzUyWVd4cFpDQklWRTFNUld4bGJXVnVkQzVnS1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCamIyNXpkQ0JqYjJ4c1lYQnpaVTlpYWlBOUlIUm9hWE11WjJWMFEyOXNiR0Z3YzJVb1kyOXNiR0Z3YzJVcFhHNGdJQ0FnSUNCeVpYUjFjbTRnWTI5c2JHRndjMlZQWW1vdWFHbGtaU2dwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdjM1JoZEdsaklGOUVUMDFKYm5SbGNtWmhZMlVvYjNCMGFXOXVjeWtnZTF4dUlDQWdJQ0FnY21WMGRYSnVJSE4xY0dWeUxsOUVUMDFKYm5SbGNtWmhZMlVvUVdOamIzSmthVzl1TENCdmNIUnBiMjV6S1Z4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ29nUkU5TklFRndhU0JwYlhCc1pXMWxiblJoZEdsdmJseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ292WEc0Z0lHTnZibk4wSUdOdmJYQnZibVZ1ZEhNZ1BTQmJYVnh1WEc0Z0lHTnZibk4wSUdGalkyOXlaR2x2Ym5NZ1BTQmtiMk4xYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5UVd4c0tHQXVKSHRPUVUxRmZXQXBYRzRnSUdsbUlDaGhZMk52Y21ScGIyNXpLU0I3WEc0Z0lDQWdZV05qYjNKa2FXOXVjeTVtYjNKRllXTm9LQ2hsYkdWdFpXNTBLU0E5UGlCN1hHNGdJQ0FnSUNCamIyNXpkQ0JqYjI1bWFXY2dQU0JuWlhSQmRIUnlhV0oxZEdWelEyOXVabWxuS0dWc1pXMWxiblFzSUVSRlJrRlZURlJmVUZKUFVFVlNWRWxGVXl3Z1JFRlVRVjlCVkZSU1UxOVFVazlRUlZKVVNVVlRLVnh1SUNBZ0lDQWdZMjl1Wm1sbkxtVnNaVzFsYm5RZ1BTQmxiR1Z0Wlc1MFhHNWNiaUFnSUNBZ0lHTnZiWEJ2Ym1WdWRITXVjSFZ6YUNoQlkyTnZjbVJwYjI0dVgwUlBUVWx1ZEdWeVptRmpaU2hqYjI1bWFXY3BLVnh1SUNBZ0lIMHBYRzRnSUgxY2JseHVJQ0JwWmlBb1lXTmpiM0prYVc5dWN5a2dlMXh1SUNBZ0lHUnZZM1Z0Wlc1MExtRmtaRVYyWlc1MFRHbHpkR1Z1WlhJb0oyTnNhV05ySnl3Z0tHVjJaVzUwS1NBOVBpQjdYRzRnSUNBZ0lDQmpiMjV6ZENCa1lYUmhWRzluWjJ4bFFYUjBjaUE5SUdWMlpXNTBMblJoY21kbGRDNW5aWFJCZEhSeWFXSjFkR1VvSjJSaGRHRXRkRzluWjJ4bEp5bGNiaUFnSUNBZ0lHbG1JQ2hrWVhSaFZHOW5aMnhsUVhSMGNpQW1KaUJrWVhSaFZHOW5aMnhsUVhSMGNpQTlQVDBnVGtGTlJTa2dlMXh1SUNBZ0lDQWdJQ0JqYjI1emRDQmpiMnhzWVhCelpVbGtJRDBnWlhabGJuUXVkR0Z5WjJWMExtZGxkRUYwZEhKcFluVjBaU2duWkdGMFlTMTBZWEpuWlhRbktTQjhmQ0JsZG1WdWRDNTBZWEpuWlhRdVoyVjBRWFIwY21saWRYUmxLQ2RvY21WbUp5bGNiaUFnSUNBZ0lDQWdZMjl1YzNRZ1kyOXNiR0Z3YzJWRmJDQTlJR1J2WTNWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNJb1kyOXNiR0Z3YzJWSlpDbGNibHh1SUNBZ0lDQWdJQ0JqYjI1emRDQmhZMk52Y21ScGIyNGdQU0JtYVc1a1ZHRnlaMlYwUW5sRGJHRnpjeWhsZG1WdWRDNTBZWEpuWlhRc0lDZGhZMk52Y21ScGIyNG5LVnh1WEc0Z0lDQWdJQ0FnSUdsbUlDaGhZMk52Y21ScGIyNGdQVDA5SUc1MWJHd3BJSHRjYmlBZ0lDQWdJQ0FnSUNCeVpYUjFjbTVjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lHTnZibk4wSUdGalkyOXlaR2x2Ymtsa0lEMGdZV05qYjNKa2FXOXVMbWRsZEVGMGRISnBZblYwWlNnbmFXUW5LVnh1SUNBZ0lDQWdJQ0JqYjI1emRDQmpiMjF3YjI1bGJuUWdQU0JqYjIxd2IyNWxiblJ6TG1acGJtUW9ZeUE5UGlCakxtZGxkRVZzWlcxbGJuUW9LUzVuWlhSQmRIUnlhV0oxZEdVb0oybGtKeWtnUFQwOUlHRmpZMjl5WkdsdmJrbGtLVnh1WEc0Z0lDQWdJQ0FnSUdsbUlDZ2hZMjl0Y0c5dVpXNTBLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2NtVjBkWEp1WEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQXZMeUJwWmlCMGFHVWdZMjlzYkdGd2MyVWdhR0Z6SUdKbFpXNGdZV1JrWldRZ2NISnZaM0poYlcxaGRHbGpZV3hzZVN3Z2QyVWdZV1JrSUdsMFhHNGdJQ0FnSUNBZ0lHTnZibk4wSUhSaGNtZGxkRU52Ykd4aGNITmxJRDBnWTI5dGNHOXVaVzUwTG1kbGRFTnZiR3hoY0hObGN5Z3BMbVpwYm1Rb1l5QTlQaUJqTG1kbGRFVnNaVzFsYm5Rb0tTQTlQVDBnWTI5c2JHRndjMlZGYkNsY2JpQWdJQ0FnSUNBZ2FXWWdLQ0YwWVhKblpYUkRiMnhzWVhCelpTa2dlMXh1SUNBZ0lDQWdJQ0FnSUdOdmJYQnZibVZ1ZEM1aFpHUkRiMnhzWVhCelpTaGpiMnhzWVhCelpVVnNLVnh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ1kyOXRjRzl1Wlc1MExuTm9iM2NvWTI5c2JHRndjMlZKWkNsY2JpQWdJQ0FnSUgxY2JpQWdJQ0I5S1Z4dUlDQjlYRzVjYmlBZ2NtVjBkWEp1SUVGalkyOXlaR2x2Ymx4dWZTa29LVnh1WEc1bGVIQnZjblFnWkdWbVlYVnNkQ0JCWTJOdmNtUnBiMjVjYmlJc0lpOHFLbHh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxSUV4cFkyVnVjMlZrSUhWdVpHVnlJRTFKVkNBb2FIUjBjSE02THk5bmFYUm9kV0l1WTI5dEwzRjFZWEpyTFdSbGRpOVFhRzl1YjI0dFJuSmhiV1YzYjNKckwySnNiMkl2YldGemRHVnlMMHhKUTBWT1UwVXBYRzRnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ292WEc1cGJYQnZjblFnUTI5dGNHOXVaVzUwSUdaeWIyMGdKeTR1TDJOdmJYQnZibVZ1ZENkY2JtbHRjRzl5ZENCN0lHZGxkRUYwZEhKcFluVjBaWE5EYjI1bWFXY2dmU0JtY205dElDY3VMaTlqYjIxd2IyNWxiblJOWVc1aFoyVnlKMXh1YVcxd2IzSjBJRVYyWlc1MElHWnliMjBnSnk0dUx5NHVMMk52Y21VdlpYWmxiblJ6SjF4dWFXMXdiM0owSUhzZ1ptbHVaRlJoY21kbGRFSjVRWFIwY2lCOUlHWnliMjBnSnk0dUx5NHVMMk52Y21VdmRYUnBiSE1uWEc1Y2JtTnZibk4wSUVOdmJHeGhjSE5sSUQwZ0tDZ3BJRDArSUh0Y2JpQWdMeW9xWEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpQkRiMjV6ZEdGdWRITmNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxTDF4dVhHNGdJR052Ym5OMElFNUJUVVVnUFNBblkyOXNiR0Z3YzJVblhHNGdJR052Ym5OMElGWkZVbE5KVDA0Z1BTQW5NaTR3TGpBblhHNGdJR052Ym5OMElFUkZSa0ZWVEZSZlVGSlBVRVZTVkVsRlV5QTlJSHRjYmlBZ0lDQmxiR1Z0Wlc1ME9pQnVkV3hzTEZ4dUlDQWdJSFJ2WjJkc1pUb2dabUZzYzJVc1hHNGdJSDFjYmlBZ1kyOXVjM1FnUkVGVVFWOUJWRlJTVTE5UVVrOVFSVkpVU1VWVElEMGdXMXh1SUNBZ0lDZDBiMmRuYkdVbkxGeHVJQ0JkWEc1Y2JpQWdMeW9xWEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpQkRiR0Z6Y3lCRVpXWnBibWwwYVc5dVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaTljYmx4dUlDQmpiR0Z6Y3lCRGIyeHNZWEJ6WlNCbGVIUmxibVJ6SUVOdmJYQnZibVZ1ZENCN1hHNWNiaUFnSUNCamIyNXpkSEoxWTNSdmNpaHZjSFJwYjI1eklEMGdlMzBwSUh0Y2JpQWdJQ0FnSUhOMWNHVnlLRTVCVFVVc0lGWkZVbE5KVDA0c0lFUkZSa0ZWVEZSZlVGSlBVRVZTVkVsRlV5d2diM0IwYVc5dWN5d2dSRUZVUVY5QlZGUlNVMTlRVWs5UVJWSlVTVVZUTENCbVlXeHpaU3dnWm1Gc2MyVXBYRzVjYmlBZ0lDQWdJSFJvYVhNdWIyNVVjbUZ1YzJsMGFXOXVJRDBnWm1Gc2MyVmNibHh1SUNBZ0lDQWdMeThnZEc5bloyeGxJR1JwY21WamRHeDVYRzRnSUNBZ0lDQnBaaUFvZEdocGN5NXZjSFJwYjI1ekxuUnZaMmRzWlNrZ2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TG5Ob2IzY29LVnh1SUNBZ0lDQWdmVnh1SUNBZ0lIMWNibHh1SUNBZ0lHZGxkRWhsYVdkb2RDZ3BJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVuWlhSQ2IzVnVaR2x1WjBOc2FXVnVkRkpsWTNRb2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXBMbWhsYVdkb2RGeHVJQ0FnSUgxY2JseHVJQ0FnSUhSdloyZHNaU2dwSUh0Y2JpQWdJQ0FnSUdsbUlDaDBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVqYkdGemMweHBjM1F1WTI5dWRHRnBibk1vSjNOb2IzY25LU2tnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnZEdocGN5NW9hV1JsS0NsY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTXVjMmh2ZHlncFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYzJodmR5Z3BJSHRjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbTl1VkhKaGJuTnBkR2x2YmlrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z1ptRnNjMlZjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnYVdZZ0tIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbU5zWVhOelRHbHpkQzVqYjI1MFlXbHVjeWduYzJodmR5Y3BLU0I3WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJtWVd4elpWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQjBhR2x6TG05dVZISmhibk5wZEdsdmJpQTlJSFJ5ZFdWY2JseHVJQ0FnSUNBZ1kyOXVjM1FnYjI1RGIyeHNZWEJ6WldRZ1BTQW9LU0E5UGlCN1hHNGdJQ0FnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbU5zWVhOelRHbHpkQzVoWkdRb0ozTm9iM2NuS1Z4dUlDQWdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNWpiR0Z6YzB4cGMzUXVjbVZ0YjNabEtDZGpiMnhzWVhCemFXNW5KeWxjYmlBZ0lDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdWNtVnRiM1psUlhabGJuUk1hWE4wWlc1bGNpaEZkbVZ1ZEM1VVVrRk9VMGxVU1U5T1gwVk9SQ3dnYjI1RGIyeHNZWEJ6WldRcFhHNWNiaUFnSUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1YzJWMFFYUjBjbWxpZFhSbEtDZGhjbWxoTFdWNGNHRnVaR1ZrSnl3Z2RISjFaU2xjYmx4dUlDQWdJQ0FnSUNCMGFHbHpMbTl1VkhKaGJuTnBkR2x2YmlBOUlHWmhiSE5sWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUdsbUlDZ2hkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1WTJ4aGMzTk1hWE4wTG1OdmJuUmhhVzV6S0NkamIyeHNZWEJ6YVc1bkp5a3BJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdVkyeGhjM05NYVhOMExtRmtaQ2duWTI5c2JHRndjMmx1WnljcFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbUZrWkVWMlpXNTBUR2x6ZEdWdVpYSW9SWFpsYm5RdVZGSkJUbE5KVkVsUFRsOUZUa1FzSUc5dVEyOXNiR0Z3YzJWa0tWeHVYRzRnSUNBZ0lDQmpiMjV6ZENCb1pXbG5hSFFnUFNCMGFHbHpMbWRsZEVobGFXZG9kQ2dwWEc1Y2JpQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExuTjBlV3hsTG1obGFXZG9kQ0E5SUNjd2NIZ25YRzVjYmlBZ0lDQWdJSE5sZEZScGJXVnZkWFFvS0NrZ1BUNGdlMXh1SUNBZ0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1emRIbHNaUzVvWldsbmFIUWdQU0JnSkh0b1pXbG5hSFI5Y0hoZ1hHNGdJQ0FnSUNCOUxDQXlNQ2xjYmx4dUlDQWdJQ0FnY21WMGRYSnVJSFJ5ZFdWY2JpQWdJQ0I5WEc1Y2JpQWdJQ0JvYVdSbEtDa2dlMXh1SUNBZ0lDQWdhV1lnS0hSb2FYTXViMjVVY21GdWMybDBhVzl1S1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCbVlXeHpaVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0JwWmlBb0lYUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbU5zWVhOelRHbHpkQzVqYjI1MFlXbHVjeWduYzJodmR5Y3BLU0I3WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJtWVd4elpWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQjBhR2x6TG05dVZISmhibk5wZEdsdmJpQTlJSFJ5ZFdWY2JseHVJQ0FnSUNBZ1kyOXVjM1FnYjI1RGIyeHNZWEJ6WldRZ1BTQW9LU0E5UGlCN1hHNGdJQ0FnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbU5zWVhOelRHbHpkQzV5WlcxdmRtVW9KMk52Ykd4aGNITnBibWNuS1Z4dUlDQWdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNXpkSGxzWlM1b1pXbG5hSFFnUFNBbllYVjBieWRjYmlBZ0lDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdWNtVnRiM1psUlhabGJuUk1hWE4wWlc1bGNpaEZkbVZ1ZEM1VVVrRk9VMGxVU1U5T1gwVk9SQ3dnYjI1RGIyeHNZWEJ6WldRcFhHNWNiaUFnSUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1YzJWMFFYUjBjbWxpZFhSbEtDZGhjbWxoTFdWNGNHRnVaR1ZrSnl3Z1ptRnNjMlVwWEc1Y2JpQWdJQ0FnSUNBZ2RHaHBjeTV2YmxSeVlXNXphWFJwYjI0Z1BTQm1ZV3h6WlZ4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNXpkSGxzWlM1b1pXbG5hSFFnUFNBbk1IQjRKMXh1WEc0Z0lDQWdJQ0JwWmlBb0lYUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbU5zWVhOelRHbHpkQzVqYjI1MFlXbHVjeWduWTI5c2JHRndjMmx1WnljcEtTQjdYRzRnSUNBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1Oc1lYTnpUR2x6ZEM1aFpHUW9KMk52Ykd4aGNITnBibWNuS1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNWhaR1JGZG1WdWRFeHBjM1JsYm1WeUtFVjJaVzUwTGxSU1FVNVRTVlJKVDA1ZlJVNUVMQ0J2YmtOdmJHeGhjSE5sWkNsY2JseHVJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25jMmh2ZHljcFhHNWNiaUFnSUNBZ0lISmxkSFZ5YmlCMGNuVmxYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MzUmhkR2xqSUY5RVQwMUpiblJsY21aaFkyVW9iM0IwYVc5dWN5a2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlITjFjR1Z5TGw5RVQwMUpiblJsY21aaFkyVW9RMjlzYkdGd2MyVXNJRzl3ZEdsdmJuTXBYRzRnSUNBZ2ZWeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpQkVUMDBnUVhCcElHbHRjR3hsYldWdWRHRjBhVzl1WEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpOWNiaUFnWTI5dWMzUWdZMjl0Y0c5dVpXNTBjeUE5SUZ0ZFhHNWNiaUFnWTI5dWMzUWdZMjlzYkdGd2MyVnpJRDBnWkc5amRXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNrRnNiQ2hnTGlSN1RrRk5SWDFnS1Z4dUlDQnBaaUFvWTI5c2JHRndjMlZ6S1NCN1hHNGdJQ0FnWTI5c2JHRndjMlZ6TG1admNrVmhZMmdvS0dWc1pXMWxiblFwSUQwK0lIdGNiaUFnSUNBZ0lDOHZJR052Ym5OMElHTnZibVpwWnlBOUlIdDlYRzRnSUNBZ0lDQmpiMjV6ZENCamIyNW1hV2NnUFNCblpYUkJkSFJ5YVdKMWRHVnpRMjl1Wm1sbktHVnNaVzFsYm5Rc0lFUkZSa0ZWVEZSZlVGSlBVRVZTVkVsRlV5d2dSRUZVUVY5QlZGUlNVMTlRVWs5UVJWSlVTVVZUS1Z4dUlDQWdJQ0FnWTI5dVptbG5MbVZzWlcxbGJuUWdQU0JsYkdWdFpXNTBYRzVjYmlBZ0lDQWdJR052YlhCdmJtVnVkSE11Y0hWemFDaERiMnhzWVhCelpTNWZSRTlOU1c1MFpYSm1ZV05sS0dOdmJtWnBaeWtwWEc0Z0lDQWdmU2xjYmlBZ2ZWeHVYRzRnSUdsbUlDaGpiMnhzWVhCelpYTXBJSHRjYmlBZ0lDQmtiMk4xYldWdWRDNWhaR1JGZG1WdWRFeHBjM1JsYm1WeUtDZGpiR2xqYXljc0lDaGxkbVZ1ZENrZ1BUNGdlMXh1SUNBZ0lDQWdZMjl1YzNRZ2RHRnlaMlYwSUQwZ1ptbHVaRlJoY21kbGRFSjVRWFIwY2lobGRtVnVkQzUwWVhKblpYUXNJQ2RrWVhSaExYUnZaMmRzWlNjcFhHNGdJQ0FnSUNCcFppQW9JWFJoY21kbGRDa2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNWNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdZMjl1YzNRZ1pHRjBZVlJ2WjJkc1pVRjBkSElnUFNCMFlYSm5aWFF1WjJWMFFYUjBjbWxpZFhSbEtDZGtZWFJoTFhSdloyZHNaU2NwWEc1Y2JpQWdJQ0FnSUdsbUlDaGtZWFJoVkc5bloyeGxRWFIwY2lBbUppQmtZWFJoVkc5bloyeGxRWFIwY2lBOVBUMGdUa0ZOUlNrZ2UxeHVJQ0FnSUNBZ0lDQnNaWFFnYVdRZ1BTQjBZWEpuWlhRdVoyVjBRWFIwY21saWRYUmxLQ2RrWVhSaExYUmhjbWRsZENjcElIeDhJSFJoY21kbGRDNW5aWFJCZEhSeWFXSjFkR1VvSjJoeVpXWW5LVnh1SUNBZ0lDQWdJQ0JwWkNBOUlHbGtMbkpsY0d4aFkyVW9KeU1uTENBbkp5bGNibHh1SUNBZ0lDQWdJQ0JqYjI1emRDQmpiMjF3YjI1bGJuUWdQU0JqYjIxd2IyNWxiblJ6TG1acGJtUW9ZeUE5UGlCakxtZGxkRVZzWlcxbGJuUW9LUzVuWlhSQmRIUnlhV0oxZEdVb0oybGtKeWtnUFQwOUlHbGtLVnh1WEc0Z0lDQWdJQ0FnSUdsbUlDZ2hZMjl0Y0c5dVpXNTBLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2NtVjBkWEp1WEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQmpiMjF3YjI1bGJuUXVkRzluWjJ4bEtDbGNiaUFnSUNBZ0lIMWNiaUFnSUNCOUtWeHVJQ0I5WEc1Y2JpQWdjbVYwZFhKdUlFTnZiR3hoY0hObFhHNTlLU2dwWEc1Y2JtVjRjRzl5ZENCa1pXWmhkV3gwSUVOdmJHeGhjSE5sWEc0aUxDSXZLaXBjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2lCTWFXTmxibk5sWkNCMWJtUmxjaUJOU1ZRZ0tHaDBkSEJ6T2k4dloybDBhSFZpTG1OdmJTOXhkV0Z5YXkxa1pYWXZVR2h2Ym05dUxVWnlZVzFsZDI5eWF5OWliRzlpTDIxaGMzUmxjaTlNU1VORlRsTkZLVnh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxTDF4dWFXMXdiM0owSUhzZ1pHbHpjR0YwWTJoRmJHVnRaVzUwUlhabGJuUXNJR1JwYzNCaGRHTm9WMmx1Ukc5alJYWmxiblFnZlNCbWNtOXRJQ2N1TGk5amIzSmxMMlYyWlc1MGN5OWthWE53WVhSamFDZGNibWx0Y0c5eWRDQjdJR2RsYm1WeVlYUmxTV1FnZlNCbWNtOXRJQ2N1TGk5amIzSmxMM1YwYVd4ekoxeHVhVzF3YjNKMElFVjJaVzUwSUdaeWIyMGdKeTR1TDJOdmNtVXZaWFpsYm5SekoxeHVhVzF3YjNKMElFTnZiWEJ2Ym1WdWRFMWhibUZuWlhJc0lIc2djMlYwUVhSMGNtbGlkWFJsYzBOdmJtWnBaeXdnWjJWMFFYUjBjbWxpZFhSbGMwTnZibVpwWnlCOUlHWnliMjBnSnk0dlkyOXRjRzl1Wlc1MFRXRnVZV2RsY2lkY2JseHVMeW9xWEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxSUVOc1lYTnpJRVJsWm1sdWFYUnBiMjVjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ292WEc1Y2JtVjRjRzl5ZENCa1pXWmhkV3gwSUdOc1lYTnpJRU52YlhCdmJtVnVkQ0I3WEc1Y2JpQWdZMjl1YzNSeWRXTjBiM0lvYm1GdFpTd2dkbVZ5YzJsdmJpd2daR1ZtWVhWc2RFOXdkR2x2Ym5NZ1BTQjdmU3dnYjNCMGFXOXVjeUE5SUh0OUxDQnZjSFJwYjI1QmRIUnljeUE5SUZ0ZExDQnpkWEJ3YjNKMFJIbHVZVzFwWTBWc1pXMWxiblFnUFNCbVlXeHpaU3dnWVdSa1ZHOVRkR0ZqYXlBOUlHWmhiSE5sS1NCN1hHNGdJQ0FnZEdocGN5NXVZVzFsSUQwZ2JtRnRaVnh1SUNBZ0lIUm9hWE11ZG1WeWMybHZiaUE5SUhabGNuTnBiMjVjYmlBZ0lDQjBhR2x6TG05d2RHbHZibk1nUFNCdmNIUnBiMjV6WEc1Y2JpQWdJQ0F2THlCQWRHOWtieUJyWldWd1AxeHVJQ0FnSUM4dklIUm9hWE11YjNCMGFXOXVjeUE5SUU5aWFtVmpkQzVoYzNOcFoyNG9aR1ZtWVhWc2RFOXdkR2x2Ym5Nc0lHOXdkR2x2Ym5NcFhHNGdJQ0FnVDJKcVpXTjBMbXRsZVhNb1pHVm1ZWFZzZEU5d2RHbHZibk1wTG1admNrVmhZMmdvS0hCeWIzQXBJRDArSUh0Y2JpQWdJQ0FnSUdsbUlDaDBlWEJsYjJZZ2RHaHBjeTV2Y0hScGIyNXpXM0J5YjNCZElEMDlQU0FuZFc1a1pXWnBibVZrSnlrZ2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk5iY0hKdmNGMGdQU0JrWldaaGRXeDBUM0IwYVc5dWMxdHdjbTl3WFZ4dUlDQWdJQ0FnZlZ4dUlDQWdJSDBwWEc1Y2JpQWdJQ0IwYUdsekxtOXdkR2x2YmtGMGRISnpJRDBnYjNCMGFXOXVRWFIwY25OY2JpQWdJQ0IwYUdsekxuTjFjSEJ2Y25SRWVXNWhiV2xqUld4bGJXVnVkQ0E5SUhOMWNIQnZjblJFZVc1aGJXbGpSV3hsYldWdWRGeHVJQ0FnSUhSb2FYTXVZV1JrVkc5VGRHRmpheUE5SUdGa1pGUnZVM1JoWTJ0Y2JpQWdJQ0IwYUdsekxtbGtJRDBnWjJWdVpYSmhkR1ZKWkNncFhHNWNiaUFnSUNCamIyNXpkQ0JqYUdWamEwVnNaVzFsYm5RZ1BTQWhkR2hwY3k1emRYQndiM0owUkhsdVlXMXBZMFZzWlcxbGJuUWdmSHdnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RZ0lUMDlJRzUxYkd4Y2JseHVJQ0FnSUdsbUlDaDBlWEJsYjJZZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUWdQVDA5SUNkemRISnBibWNuS1NCN1hHNGdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDQTlJR1J2WTNWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNJb2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXBYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2FXWWdLR05vWldOclJXeGxiV1Z1ZENBbUppQWhkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblFwSUh0Y2JpQWdJQ0FnSUhSb2NtOTNJRzVsZHlCRmNuSnZjaWhnSkh0MGFHbHpMbTVoYldWOUxpQlVhR1VnWld4bGJXVnVkQ0JwY3lCdWIzUWdZU0JJVkUxTVJXeGxiV1Z1ZEM1Z0tWeHVJQ0FnSUgxY2JseHVJQ0FnSUhSb2FYTXVaSGx1WVcxcFkwVnNaVzFsYm5RZ1BTQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQ0E5UFQwZ2JuVnNiRnh1SUNBZ0lIUm9hWE11Y21WbmFYTjBaWEpsWkVWc1pXMWxiblJ6SUQwZ1cxMWNibHh1SUNBZ0lHbG1JQ2doZEdocGN5NWtlVzVoYldsalJXeGxiV1Z1ZENrZ2UxeHVJQ0FnSUNBZ0x5b3FYRzRnSUNBZ0lDQWdLaUJwWmlCMGFHVWdaV3hsYldWdWRDQmxlR2x6ZEhNc0lIZGxJSEpsWVdRZ2RHaGxJR1JoZEdFZ1lYUjBjbWxpZFhSbGN5QmpiMjVtYVdkY2JpQWdJQ0FnSUNBcUlIUm9aVzRnZDJVZ2IzWmxjbmR5YVhSbElHVjRhWE4wYVc1bklHTnZibVpwWnlCclpYbHpJR2x1SUVwaGRtRlRZM0pwY0hRc0lITnZJSFJvWVhSY2JpQWdJQ0FnSUNBcUlIZGxJR3RsWlhBZ2RHaGxJR1p2Ykd4dmQybHVaeUJ2Y21SbGNseHVJQ0FnSUNBZ0lDb2dXekZkSUdSbFptRjFiSFFnU21GMllWTmpjbWx3ZENCamIyNW1hV2QxY21GMGFXOXVJRzltSUhSb1pTQmpiMjF3YjI1bGJuUmNiaUFnSUNBZ0lDQXFJRnN5WFNCRVlYUmhJR0YwZEhKcFluVjBaWE1nWTI5dVptbG5kWEpoZEdsdmJpQnBaaUIwYUdVZ1pXeGxiV1Z1ZENCbGVHbHpkSE1nYVc0Z2RHaGxJRVJQVFZ4dUlDQWdJQ0FnSUNvZ1d6TmRJRXBoZG1GVFkzSnBjSFFnWTI5dVptbG5kWEpoZEdsdmJseHVJQ0FnSUNBZ0lDb3ZYRzRnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk1nUFNCUFltcGxZM1F1WVhOemFXZHVLSFJvYVhNdWIzQjBhVzl1Y3l3Z2RHaHBjeTVoYzNOcFoyNUtjME52Ym1acFp5aDBhR2x6TG1kbGRFRjBkSEpwWW5WMFpYTW9LU3dnYjNCMGFXOXVjeWtwWEc1Y2JpQWdJQ0FnSUM4dklIUm9aVzRzSUhObGRDQjBhR1VnYm1WM0lHUmhkR0VnWVhSMGNtbGlkWFJsY3lCMGJ5QjBhR1VnWld4bGJXVnVkRnh1SUNBZ0lDQWdkR2hwY3k1elpYUkJkSFJ5YVdKMWRHVnpLQ2xjYmlBZ0lDQjlYRzVjYmlBZ0lDQjBhR2x6TG1Wc1pXMWxiblJNYVhOMFpXNWxjaUE5SUdWMlpXNTBJRDArSUhSb2FYTXViMjVDWldadmNtVkZiR1Z0Wlc1MFJYWmxiblFvWlhabGJuUXBJQ0FnSUNBZ0lDQWdJRnh1SUNCOVhHNWNiaUFnWVhOemFXZHVTbk5EYjI1bWFXY29ZWFIwY2tOdmJtWnBaeXdnYjNCMGFXOXVjeWtnZTF4dUlDQWdJSFJvYVhNdWIzQjBhVzl1UVhSMGNuTXVabTl5UldGamFDZ29hMlY1S1NBOVBpQjdYRzRnSUNBZ0lDQnBaaUFvYjNCMGFXOXVjMXRyWlhsZEtTQjdYRzRnSUNBZ0lDQWdJR0YwZEhKRGIyNW1hV2RiYTJWNVhTQTlJRzl3ZEdsdmJuTmJhMlY1WFZ4dUlDQWdJQ0FnZlZ4dUlDQWdJSDBwWEc1Y2JpQWdJQ0J5WlhSMWNtNGdZWFIwY2tOdmJtWnBaMXh1SUNCOVhHNWNiaUFnWjJWMFZtVnljMmx2YmlncElIdGNiaUFnSUNCeVpYUjFjbTRnZEdocGN5NTJaWEp6YVc5dVhHNGdJSDFjYmx4dUlDQm5aWFJGYkdWdFpXNTBLQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkRnh1SUNCOVhHNWNiaUFnWjJWMFNXUW9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlIUm9hWE11YVdSY2JpQWdmVnh1WEc0Z0lISmxaMmx6ZEdWeVJXeGxiV1Z1ZEhNb1pXeGxiV1Z1ZEhNcElIdGNiaUFnSUNCbGJHVnRaVzUwY3k1bWIzSkZZV05vS0dWc1pXMWxiblFnUFQ0Z2RHaHBjeTV5WldkcGMzUmxja1ZzWlcxbGJuUW9aV3hsYldWdWRDa3BYRzRnSUgxY2JseHVJQ0J5WldkcGMzUmxja1ZzWlcxbGJuUW9aV3hsYldWdWRDa2dlMXh1SUNBZ0lHVnNaVzFsYm5RdWRHRnlaMlYwTG1Ga1pFVjJaVzUwVEdsemRHVnVaWElvWld4bGJXVnVkQzVsZG1WdWRDd2dkR2hwY3k1bGJHVnRaVzUwVEdsemRHVnVaWElwWEc0Z0lDQWdkR2hwY3k1eVpXZHBjM1JsY21Wa1JXeGxiV1Z1ZEhNdWNIVnphQ2hsYkdWdFpXNTBLVnh1SUNCOVhHNWNiaUFnZFc1eVpXZHBjM1JsY2tWc1pXMWxiblJ6S0NrZ2UxeHVJQ0FnSUhSb2FYTXVjbVZuYVhOMFpYSmxaRVZzWlcxbGJuUnpMbVp2Y2tWaFkyZ29LR1ZzWlcxbGJuUXBJRDArSUh0Y2JpQWdJQ0FnSUhSb2FYTXVkVzV5WldkcGMzUmxja1ZzWlcxbGJuUW9aV3hsYldWdWRDbGNiaUFnSUNCOUtWeHVJQ0I5WEc1Y2JpQWdkVzV5WldkcGMzUmxja1ZzWlcxbGJuUW9aV3hsYldWdWRDa2dlMXh1SUNBZ0lHTnZibk4wSUhKbFoybHpkR1Z5WldSRmJHVnRaVzUwU1c1a1pYZ2dQU0IwYUdsekxuSmxaMmx6ZEdWeVpXUkZiR1Z0Wlc1MGMxeHVJQ0FnSUNBZ0xtWnBibVJKYm1SbGVDaGxiQ0E5UGlCbGJDNTBZWEpuWlhRZ1BUMDlJR1ZzWlcxbGJuUXVkR0Z5WjJWMElDWW1JR1ZzTG1WMlpXNTBJRDA5UFNCbGJHVnRaVzUwTG1WMlpXNTBLVnh1WEc0Z0lDQWdhV1lnS0hKbFoybHpkR1Z5WldSRmJHVnRaVzUwU1c1a1pYZ2dQaUF0TVNrZ2UxeHVJQ0FnSUNBZ1pXeGxiV1Z1ZEM1MFlYSm5aWFF1Y21WdGIzWmxSWFpsYm5STWFYTjBaVzVsY2lobGJHVnRaVzUwTG1WMlpXNTBMQ0IwYUdsekxtVnNaVzFsYm5STWFYTjBaVzVsY2lsY2JpQWdJQ0FnSUhSb2FYTXVjbVZuYVhOMFpYSmxaRVZzWlcxbGJuUnpMbk53YkdsalpTaHlaV2RwYzNSbGNtVmtSV3hsYldWdWRFbHVaR1Y0TENBeEtWeHVJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0JqYjI1emIyeGxMbVZ5Y205eUtHQlhZWEp1YVc1bklTQlZibXR1YjNkdUlISmxaMmx6ZEdWeVpXUWdaV3hsYldWdWREb2dKSHRsYkdWdFpXNTBMblJoY21kbGRIMGdkMmwwYUNCbGRtVnVkRG9nSkh0bGJHVnRaVzUwTG1WMlpXNTBmUzVnS1Z4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUhSeWFXZG5aWEpGZG1WdWRDaGxkbVZ1ZEU1aGJXVXNJR1JsZEdGcGJDQTlJSHQ5TENCdlltcGxZM1JGZG1WdWRFOXViSGtnUFNCbVlXeHpaU2tnZTF4dUlDQWdJR2xtSUNoMGVYQmxiMllnWlhabGJuUk9ZVzFsSUNFOVBTQW5jM1J5YVc1bkp5a2dlMXh1SUNBZ0lDQWdkR2h5YjNjZ2JtVjNJRVZ5Y205eUtDZFVhR1VnWlhabGJuUWdibUZ0WlNCcGN5QnViM1FnZG1Gc2FXUXVKeWxjYmlBZ0lDQjlYRzVjYmlBZ0lDQnBaaUFvZEdocGN5NWhaR1JVYjFOMFlXTnJLU0I3WEc0Z0lDQWdJQ0JwWmlBb1pYWmxiblJPWVcxbElEMDlQU0JGZG1WdWRDNVRTRTlYS1NCN1hHNGdJQ0FnSUNBZ0lFTnZiWEJ2Ym1WdWRFMWhibUZuWlhJdVlXUmtLSFJvYVhNcFhHNGdJQ0FnSUNCOUlHVnNjMlVnYVdZZ0tHVjJaVzUwVG1GdFpTQTlQVDBnUlhabGJuUXVTRWxFUlNrZ2UxeHVJQ0FnSUNBZ0lDQkRiMjF3YjI1bGJuUk5ZVzVoWjJWeUxuSmxiVzkyWlNoMGFHbHpLVnh1SUNBZ0lDQWdmVnh1SUNBZ0lIMWNibHh1SUNBZ0lDOHZJR1YyWlc1MElHNWhiV1Z6SUdOaGJpQmlaU0IzYVhSb0lHUnZkQ0J1YjNSaGRHbHZiaUJzYVd0bElISmxZMjl1Ym1WamRHbHVaeTV6ZFdOalpYTnpYRzRnSUNBZ1kyOXVjM1FnWlhabGJuUk9ZVzFsVDJKcVpXTjBJRDBnWlhabGJuUk9ZVzFsTG5Od2JHbDBLQ2N1SnlrdWNtVmtkV05sS0NoaFkyTXNJR04xY25KbGJuUXNJR2x1WkdWNEtTQTlQaUI3WEc0Z0lDQWdJQ0JwWmlBb2FXNWtaWGdnUFQwOUlEQXBJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJR04xY25KbGJuUmNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdjbVYwZFhKdUlHRmpZeUFySUdOMWNuSmxiblF1WTJoaGNrRjBLREFwTG5SdlZYQndaWEpEWVhObEtDa2dLeUJqZFhKeVpXNTBMbk5zYVdObEtERXBYRzRnSUNBZ2ZTbGNibHh1SUNBZ0lHTnZibk4wSUdWMlpXNTBUbUZ0WlVGc2FXRnpJRDBnWUc5dUpIdGxkbVZ1ZEU1aGJXVlBZbXBsWTNRdVkyaGhja0YwS0RBcExuUnZWWEJ3WlhKRFlYTmxLQ2w5Skh0bGRtVnVkRTVoYldWUFltcGxZM1F1YzJ4cFkyVW9NU2w5WUZ4dVhHNGdJQ0FnTHk4Z2IySnFaV04wSUdWMlpXNTBYRzRnSUNBZ2FXWWdLSFI1Y0dWdlppQjBhR2x6TG05d2RHbHZibk5iWlhabGJuUk9ZVzFsVDJKcVpXTjBYU0E5UFQwZ0oyWjFibU4wYVc5dUp5a2dlMXh1SUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6VzJWMlpXNTBUbUZ0WlU5aWFtVmpkRjB1WVhCd2JIa29kR2hwY3l3Z1cyUmxkR0ZwYkYwcFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYVdZZ0tIUjVjR1Z2WmlCMGFHbHpMbTl3ZEdsdmJuTmJaWFpsYm5ST1lXMWxRV3hwWVhOZElEMDlQU0FuWm5WdVkzUnBiMjRuS1NCN1hHNGdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTmJaWFpsYm5ST1lXMWxRV3hwWVhOZExtRndjR3g1S0hSb2FYTXNJRnRrWlhSaGFXeGRLVnh1SUNBZ0lIMWNibHh1SUNBZ0lHbG1JQ2h2WW1wbFkzUkZkbVZ1ZEU5dWJIa3BJSHRjYmlBZ0lDQWdJSEpsZEhWeWJseHVJQ0FnSUgxY2JseHVJQ0FnSUM4dklHUnZiU0JsZG1WdWRGeHVJQ0FnSUdsbUlDaDBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQ2tnZTF4dUlDQWdJQ0FnWkdsemNHRjBZMmhGYkdWdFpXNTBSWFpsYm5Rb2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXNJR1YyWlc1MFRtRnRaU3dnZEdocGN5NXVZVzFsTENCa1pYUmhhV3dwWEc0Z0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lHUnBjM0JoZEdOb1YybHVSRzlqUlhabGJuUW9aWFpsYm5ST1lXMWxMQ0IwYUdsekxtNWhiV1VzSUdSbGRHRnBiQ2xjYmlBZ0lDQjlYRzRnSUgxY2JseHVJQ0J6WlhSQmRIUnlhV0oxZEdWektDa2dlMXh1SUNBZ0lHbG1JQ2gwYUdsekxtOXdkR2x2YmtGMGRISnpMbXhsYm1kMGFDQStJREFwSUh0Y2JpQWdJQ0FnSUhObGRFRjBkSEpwWW5WMFpYTkRiMjVtYVdjb2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXNJSFJvYVhNdWIzQjBhVzl1Y3l3Z2RHaHBjeTV2Y0hScGIyNUJkSFJ5Y3lsY2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNCblpYUkJkSFJ5YVdKMWRHVnpLQ2tnZTF4dUlDQWdJR052Ym5OMElHOXdkR2x2Ym5NZ1BTQlBZbXBsWTNRdVlYTnphV2R1S0h0OUxDQjBhR2x6TG05d2RHbHZibk1wWEc0Z0lDQWdjbVYwZFhKdUlHZGxkRUYwZEhKcFluVjBaWE5EYjI1bWFXY29kR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblFzSUc5d2RHbHZibk1zSUhSb2FYTXViM0IwYVc5dVFYUjBjbk1wWEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ2RHaGxJSEJ5WlhabGJuUkRiRzl6WVdKc1pTQnRaWFJvYjJRZ2JXRnVZV2RsY3lCamIyNWpkWEp5Wlc1amVTQmlaWFIzWldWdUlHRmpkR2wyWlNCamIyMXdiMjVsYm5SekxseHVJQ0FnS2lCR2IzSWdaWGhoYlhCc1pTd2dhV1lnZEdobGNtVWdhWE1nWVNCemFHOTNiaUJ2Wm1ZdFkyRnVkbUZ6SUdGdVpDQmthV0ZzYjJjc0lIUm9aU0JzWVhOMFhHNGdJQ0FxSUhOb2IzZHVJR052YlhCdmJtVnVkQ0JuWVdsdWN5QjBhR1VnY0hKdlkyVnpjMmx1WnlCd2NtbHZjbWwwZVZ4dUlDQWdLaTljYmlBZ2NISmxkbVZ1ZEVOc2IzTmhZbXhsS0NrZ2UxeHVJQ0FnSUhKbGRIVnliaUIwYUdsekxtRmtaRlJ2VTNSaFkyc2dKaVlnSVVOdmJYQnZibVZ1ZEUxaGJtRm5aWEl1WTJ4dmMyRmliR1VvZEdocGN5bGNiaUFnZlZ4dVhHNGdJRzl1UW1WbWIzSmxSV3hsYldWdWRFVjJaVzUwS0dWMlpXNTBLU0I3WEc0Z0lDQWdhV1lnS0hSb2FYTXVjSEpsZG1WdWRFTnNiM05oWW14bEtDa3BJSHRjYmlBZ0lDQWdJSEpsZEhWeWJseHVJQ0FnSUgxY2JseHVJQ0FnSUhSb2FYTXViMjVGYkdWdFpXNTBSWFpsYm5Rb1pYWmxiblFwWEc0Z0lIMWNibHh1SUNCdmJrVnNaVzFsYm5SRmRtVnVkQ2hsZG1WdWRDa2dlMXh1SUNBZ0lDOHZYRzRnSUgxY2JseHVJQ0J6ZEdGMGFXTWdYMFJQVFVsdWRHVnlabUZqWlNoRGIyMXdiMjVsYm5SRGJHRnpjeXdnYjNCMGFXOXVjeWtnZTF4dUlDQWdJSEpsZEhWeWJpQnVaWGNnUTI5dGNHOXVaVzUwUTJ4aGMzTW9iM0IwYVc5dWN5bGNiaUFnZlZ4dWZWeHVJaXdpWEc1amIyNXpkQ0JuWlhSQmRIUnlhV0oxZEdVZ1BTQW9abWx5YzNRc0lITmxZMjl1WkNrZ1BUNGdlMXh1SUNCcFppQW9abWx5YzNRZ1BUMDlJQ2NuS1NCN1hHNGdJQ0FnY21WMGRYSnVJR0JrWVhSaExTUjdjMlZqYjI1a2ZXQmNiaUFnZlZ4dUlDQnlaWFIxY200Z1lHUmhkR0V0Skh0bWFYSnpkSDB0Skh0elpXTnZibVI5WUZ4dWZWeHVYRzVsZUhCdmNuUWdablZ1WTNScGIyNGdjMlYwUVhSMGNtbGlkWFJsYzBOdmJtWnBaeWhsYkdWdFpXNTBMQ0J2WW1vZ1BTQjdmU3dnWVhSMGNuTXNJSE4wWVhKMElEMGdKeWNwSUh0Y2JpQWdZMjl1YzNRZ2EyVjVjeUE5SUU5aWFtVmpkQzVyWlhsektHOWlhaWxjYmlBZ1hHNGdJR3RsZVhNdVptOXlSV0ZqYUNnb2EyVjVLU0E5UGlCN1hHNGdJQ0FnYVdZZ0tITjBZWEowSUQwOVBTQW5KeUFtSmlCaGRIUnljeTVwYm1SbGVFOW1LR3RsZVNrZ1BUMDlJQzB4S1NCN1hHNGdJQ0FnSUNBdkx5QmpiMjUwYVc1MVpTQjNhWFJvSUc1bGVIUWdhWFJsY21GMGFXOXVYRzRnSUNBZ0lDQnlaWFIxY201Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0JwWmlBb2RIbHdaVzltSUc5aWFsdHJaWGxkSUQwOVBTQW5iMkpxWldOMEp5QW1KaUJ2WW1wYmEyVjVYU0FoUFQwZ2JuVnNiQ2tnZTF4dUlDQWdJQ0FnYkdWMElHdGxlVk4wWVhKMElEMGdhMlY1WEc0Z0lDQWdJQ0JwWmlBb2MzUmhjblFnSVQwOUlDY25LU0I3WEc0Z0lDQWdJQ0FnSUd0bGVWTjBZWEowSUQwZ1lDUjdjM1JoY25SOUxTUjdhMlY1ZldCY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2MyVjBRWFIwY21saWRYUmxjME52Ym1acFp5aGxiR1Z0Wlc1MExDQnZZbXBiYTJWNVhTd2dZWFIwY25Nc0lHdGxlVk4wWVhKMEtWeHVJQ0FnSUNBZ2NtVjBkWEp1WEc0Z0lDQWdmVnh1WEc0Z0lDQWdZMjl1YzNRZ1lYUjBjaUE5SUdkbGRFRjBkSEpwWW5WMFpTaHpkR0Z5ZEN3Z2EyVjVLVnh1SUNBZ0lHVnNaVzFsYm5RdWMyVjBRWFIwY21saWRYUmxLR0YwZEhJc0lHOWlhbHRyWlhsZEtWeHVJQ0I5S1Z4dWZWeHVYRzVsZUhCdmNuUWdablZ1WTNScGIyNGdaMlYwUVhSMGNtbGlkWFJsYzBOdmJtWnBaeWhsYkdWdFpXNTBMQ0J2WW1vZ1BTQjdmU3dnWVhSMGNuTXNJSE4wWVhKMElEMGdKeWNwSUh0Y2JpQWdZMjl1YzNRZ2JtVjNUMkpxSUQwZ1QySnFaV04wTG1GemMybG5iaWg3ZlN3Z2IySnFLVnh1SUNCamIyNXpkQ0JyWlhseklEMGdUMkpxWldOMExtdGxlWE1vYjJKcUtWeHVYRzRnSUd0bGVYTXVabTl5UldGamFDZ29hMlY1S1NBOVBpQjdYRzRnSUNBZ2FXWWdLSE4wWVhKMElEMDlQU0FuSnlBbUppQmhkSFJ5Y3k1cGJtUmxlRTltS0d0bGVTa2dQVDA5SUMweEtTQjdYRzRnSUNBZ0lDQXZMeUJqYjI1MGFXNTFaU0IzYVhSb0lHNWxlSFFnYVhSbGNtRjBhVzl1WEc0Z0lDQWdJQ0J5WlhSMWNtNWNiaUFnSUNCOVhHNWNiaUFnSUNCcFppQW9iMkpxVzJ0bGVWMGdJVDA5SUc1MWJHd2dKaVlnYjJKcVcydGxlVjB1WTI5dWMzUnlkV04wYjNJZ1BUMDlJRTlpYW1WamRDa2dlMXh1SUNBZ0lDQWdiR1YwSUd0bGVWTjBZWEowSUQwZ2EyVjVYRzRnSUNBZ0lDQnBaaUFvYzNSaGNuUWdJVDA5SUNjbktTQjdYRzRnSUNBZ0lDQWdJR3RsZVZOMFlYSjBJRDBnWUNSN2MzUmhjblI5TFNSN2EyVjVmV0JjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnYm1WM1QySnFXMnRsZVYwZ1BTQm5aWFJCZEhSeWFXSjFkR1Z6UTI5dVptbG5LR1ZzWlcxbGJuUXNJRzlpYWx0clpYbGRMQ0JoZEhSeWN5d2dhMlY1VTNSaGNuUXBYRzRnSUNBZ0lDQnlaWFIxY201Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2THlCMWNHUmhkR1VnZG1Gc2RXVmNiaUFnSUNCc1pYUWdkbUZzZFdVZ1BTQnZZbXBiYTJWNVhTQXZMeUJrWldaaGRXeDBJSFpoYkhWbFhHNGdJQ0FnWTI5dWMzUWdkSGx3WlNBOUlIUjVjR1Z2WmlCMllXeDFaVnh1SUNBZ0lHTnZibk4wSUdGMGRISWdQU0JuWlhSQmRIUnlhV0oxZEdVb2MzUmhjblFzSUd0bGVTbGNiaUFnSUNCamIyNXpkQ0JoZEhSeVZtRnNkV1VnUFNCbGJHVnRaVzUwTG1kbGRFRjBkSEpwWW5WMFpTaGhkSFJ5S1Z4dVhHNGdJQ0FnYVdZZ0tHRjBkSEpXWVd4MVpTQWhQVDBnYm5Wc2JDa2dlMXh1SUNBZ0lDQWdhV1lnS0hSNWNHVWdQVDA5SUNkaWIyOXNaV0Z1SnlrZ2UxeHVJQ0FnSUNBZ0lDQXZMeUJqYjI1MlpYSjBJSE4wY21sdVp5QjBieUJpYjI5c1pXRnVYRzRnSUNBZ0lDQWdJSFpoYkhWbElEMGdZWFIwY2xaaGJIVmxJRDA5UFNBbmRISjFaU2RjYmlBZ0lDQWdJSDBnWld4elpTQnBaaUFvSVdselRtRk9LR0YwZEhKV1lXeDFaU2twSUh0Y2JpQWdJQ0FnSUNBZ2RtRnNkV1VnUFNCd1lYSnpaVWx1ZENoaGRIUnlWbUZzZFdVc0lERXdLVnh1SUNBZ0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDQWdkbUZzZFdVZ1BTQmhkSFJ5Vm1Gc2RXVmNiaUFnSUNBZ0lIMWNiaUFnSUNCOVhHNWNiaUFnSUNCdVpYZFBZbXBiYTJWNVhTQTlJSFpoYkhWbFhHNGdJSDBwWEc1Y2JpQWdjbVYwZFhKdUlHNWxkMDlpYWx4dWZWeHVYRzVqYjI1emRDQnpkR0ZqYXlBOUlGdGRYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJSHRjYmlBZ1lXUmtLR052YlhCdmJtVnVkQ2tnZTF4dUlDQWdJSE4wWVdOckxuQjFjMmdvWTI5dGNHOXVaVzUwS1Z4dUlDQjlMRnh1SUNCeVpXMXZkbVVvWTI5dGNHOXVaVzUwS1NCN1hHNGdJQ0FnWTI5dWMzUWdhVzVrWlhnZ1BTQnpkR0ZqYXk1bWFXNWtTVzVrWlhnb1l5QTlQaUJQWW1wbFkzUXVhWE1vWTI5dGNHOXVaVzUwTENCaktTbGNiaUFnSUNCcFppQW9hVzVrWlhnZ1BpQXRNU2tnZTF4dUlDQWdJQ0FnYzNSaFkyc3VjM0JzYVdObEtHbHVaR1Y0TENBeEtWeHVJQ0FnSUgxY2JpQWdmU3hjYmlBZ1kyeHZjMkZpYkdVb1kyOXRjRzl1Wlc1MEtTQjdYRzRnSUNBZ2NtVjBkWEp1SUhOMFlXTnJMbXhsYm1kMGFDQTlQVDBnTUNCOGZDQlBZbXBsWTNRdWFYTW9jM1JoWTJ0YmMzUmhZMnN1YkdWdVozUm9JQzBnTVYwc0lHTnZiWEJ2Ym1WdWRDbGNiaUFnZlZ4dWZWeHVJaXdpTHlvcVhHNGdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDb2dUR2xqWlc1elpXUWdkVzVrWlhJZ1RVbFVJQ2hvZEhSd2N6b3ZMMmRwZEdoMVlpNWpiMjB2Y1hWaGNtc3RaR1YyTDFCb2IyNXZiaTFHY21GdFpYZHZjbXN2WW14dllpOXRZWE4wWlhJdlRFbERSVTVUUlNsY2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0tpOWNibWx0Y0c5eWRDQkZkbVZ1ZENCbWNtOXRJQ2N1TGk4dUxpOWpiM0psTDJWMlpXNTBjeWRjYm1sdGNHOXlkQ0JEYjIxd2IyNWxiblFnWm5KdmJTQW5MaTR2WTI5dGNHOXVaVzUwSjF4dWFXMXdiM0owSUhzZ1oyVjBRWFIwY21saWRYUmxjME52Ym1acFp5QjlJR1p5YjIwZ0p5NHVMMk52YlhCdmJtVnVkRTFoYm1GblpYSW5YRzVjYm1OdmJuTjBJRVJwWVd4dlp5QTlJQ2dvS1NBOVBpQjdYRzRnSUM4cUtseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ29nUTI5dWMzUmhiblJ6WEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpOWNibHh1SUNCamIyNXpkQ0JPUVUxRklEMGdKMlJwWVd4dlp5ZGNiaUFnWTI5dWMzUWdWa1ZTVTBsUFRpQTlJQ2N5TGpBdU1DZGNiaUFnWTI5dWMzUWdRa0ZEUzBSU1QxQmZVMFZNUlVOVVQxSWdQU0FuWkdsaGJHOW5MV0poWTJ0a2NtOXdKMXh1SUNCamIyNXpkQ0JFUlVaQlZVeFVYMUJTVDFCRlVsUkpSVk1nUFNCN1hHNGdJQ0FnWld4bGJXVnVkRG9nYm5Wc2JDeGNiaUFnSUNCMGFYUnNaVG9nYm5Wc2JDeGNiaUFnSUNCdFpYTnpZV2RsT2lCdWRXeHNMRnh1SUNBZ0lHTmhibU5sYkdGaWJHVTZJSFJ5ZFdVc1hHNGdJSDFjYmlBZ1kyOXVjM1FnUkVGVVFWOUJWRlJTVTE5UVVrOVFSVkpVU1VWVElEMGdXMXh1SUNBZ0lDZGpZVzVqWld4aFlteGxKeXhjYmlBZ1hWeHVYRzRnSUM4cUtseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ29nUTJ4aGMzTWdSR1ZtYVc1cGRHbHZibHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvdlhHNWNiaUFnWTJ4aGMzTWdSR2xoYkc5bklHVjRkR1Z1WkhNZ1EyOXRjRzl1Wlc1MElIdGNibHh1SUNBZ0lHTnZibk4wY25WamRHOXlLRzl3ZEdsdmJuTWdQU0I3ZlNrZ2UxeHVJQ0FnSUNBZ2MzVndaWElvVGtGTlJTd2dWa1ZTVTBsUFRpd2dSRVZHUVZWTVZGOVFVazlRUlZKVVNVVlRMQ0J2Y0hScGIyNXpMQ0JFUVZSQlgwRlVWRkpUWDFCU1QxQkZVbFJKUlZNc0lIUnlkV1VzSUhSeWRXVXBYRzVjYmlBZ0lDQWdJSFJvYVhNdWRHVnRjR3hoZEdVZ1BTQW5KeUFyWEc0Z0lDQWdJQ0FuUEdScGRpQmpiR0Z6Y3oxY0ltUnBZV3h2WjF3aUlIUmhZbWx1WkdWNFBWd2lMVEZjSWlCeWIyeGxQVndpWkdsaGJHOW5YQ0krSnlBclhHNGdJQ0FnSUNBZ0lDYzhaR2wySUdOc1lYTnpQVndpWkdsaGJHOW5MV2x1Ym1WeVhDSWdjbTlzWlQxY0ltUnZZM1Z0Wlc1MFhDSStKeUFyWEc0Z0lDQWdJQ0FnSUNBZ0p6eGthWFlnWTJ4aGMzTTlYQ0prYVdGc2IyY3RZMjl1ZEdWdWRGd2lQaWNnSzF4dUlDQWdJQ0FnSUNBZ0lDQWdKenhrYVhZZ1kyeGhjM005WENKa2FXRnNiMmN0YUdWaFpHVnlYQ0krSnlBclhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNjOGFEVWdZMnhoYzNNOVhDSmthV0ZzYjJjdGRHbDBiR1ZjSWo0OEwyZzFQaWNnSzF4dUlDQWdJQ0FnSUNBZ0lDQWdKend2WkdsMlBpY2dLMXh1SUNBZ0lDQWdJQ0FnSUNBZ0p6eGthWFlnWTJ4aGMzTTlYQ0prYVdGc2IyY3RZbTlrZVZ3aVBpY2dLMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQW5QSEErUEM5d1BpY2dLMXh1SUNBZ0lDQWdJQ0FnSUNBZ0p6d3ZaR2wyUGljZ0sxeHVJQ0FnSUNBZ0lDQWdJQ0FnSnp4a2FYWWdZMnhoYzNNOVhDSmthV0ZzYjJjdFptOXZkR1Z5WENJK0p5QXJYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDYzhZblYwZEc5dUlIUjVjR1U5WENKaWRYUjBiMjVjSWlCamJHRnpjejFjSW1KMGJpQmlkRzR0Y0hKcGJXRnllVndpSUdSaGRHRXRaR2x6YldsemN6MWNJbVJwWVd4dloxd2lQazlyUEM5aWRYUjBiMjQrSnlBclhHNGdJQ0FnSUNBZ0lDQWdJQ0FuUEM5a2FYWStKeUFyWEc0Z0lDQWdJQ0FnSUNBZ0p6d3ZaR2wyUGljZ0sxeHVJQ0FnSUNBZ0lDQW5QQzlrYVhZK0p5QXJYRzRnSUNBZ0lDQW5QQzlrYVhZK0oxeHVYRzRnSUNBZ0lDQnBaaUFvZEdocGN5NWtlVzVoYldsalJXeGxiV1Z1ZENrZ2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TG1KMWFXeGtLQ2xjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzVjYmlBZ0lDQmlkV2xzWkNncElIdGNiaUFnSUNBZ0lHTnZibk4wSUdKMWFXeGtaWElnUFNCa2IyTjFiV1Z1ZEM1amNtVmhkR1ZGYkdWdFpXNTBLQ2RrYVhZbktWeHVYRzRnSUNBZ0lDQmlkV2xzWkdWeUxtbHVibVZ5U0ZSTlRDQTlJSFJvYVhNdWRHVnRjR3hoZEdWY2JseHVJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUWdQU0JpZFdsc1pHVnlMbVpwY25OMFEyaHBiR1JjYmx4dUlDQWdJQ0FnTHk4Z2RHbDBiR1ZjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbTl3ZEdsdmJuTXVkR2wwYkdVZ0lUMDlJRzUxYkd3cElIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNpZ25MbVJwWVd4dlp5MTBhWFJzWlNjcExtbHVibVZ5U0ZSTlRDQTlJSFJvYVhNdWIzQjBhVzl1Y3k1MGFYUnNaVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0F2THlCdFpYTnpZV2RsWEc0Z0lDQWdJQ0JwWmlBb2RHaHBjeTV2Y0hScGIyNXpMbTFsYzNOaFoyVWdJVDA5SUc1MWJHd3BJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZjaWduTG1ScFlXeHZaeTFpYjJSNUp5a3VabWx5YzNSRGFHbHNaQzVwYm01bGNraFVUVXdnUFNCMGFHbHpMbTl3ZEdsdmJuTXViV1Z6YzJGblpWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQmtiMk4xYldWdWRDNWliMlI1TG1Gd2NHVnVaRU5vYVd4a0tIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBLVnh1WEc0Z0lDQWdJQ0IwYUdsekxuTmxkRUYwZEhKcFluVjBaWE1vS1Z4dUlDQWdJSDFjYmx4dUlDQWdJR0oxYVd4a1FtRmphMlJ5YjNBb0tTQjdYRzRnSUNBZ0lDQmpiMjV6ZENCaVlXTnJaSEp2Y0NBOUlHUnZZM1Z0Wlc1MExtTnlaV0YwWlVWc1pXMWxiblFvSjJScGRpY3BYRzRnSUNBZ0lDQmlZV05yWkhKdmNDNXpaWFJCZEhSeWFXSjFkR1VvSjJSaGRHRXRhV1FuTENCMGFHbHpMbWxrS1Z4dUlDQWdJQ0FnWW1GamEyUnliM0F1WTJ4aGMzTk1hWE4wTG1Ga1pDaENRVU5MUkZKUFVGOVRSVXhGUTFSUFVpbGNibHh1SUNBZ0lDQWdaRzlqZFcxbGJuUXVZbTlrZVM1aGNIQmxibVJEYUdsc1pDaGlZV05yWkhKdmNDbGNiaUFnSUNCOVhHNWNiaUFnSUNCblpYUkNZV05yWkhKdmNDZ3BJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQmtiMk4xYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5S0dBdUpIdENRVU5MUkZKUFVGOVRSVXhGUTFSUFVuMWJaR0YwWVMxcFpEMWNJaVI3ZEdocGN5NXBaSDFjSWwxZ0tWeHVJQ0FnSUgxY2JseHVJQ0FnSUdObGJuUmxjaWdwSUh0Y2JpQWdJQ0FnSUdOdmJuTjBJR052YlhCMWRHVmtVM1I1YkdVZ1BTQjNhVzVrYjNjdVoyVjBRMjl0Y0hWMFpXUlRkSGxzWlNoMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDbGNiaUFnSUNBZ0lDOHZJR052Ym5OMElIZHBaSFJvSUQwZ1kyOXRjSFYwWldSVGRIbHNaUzUzYVdSMGFDNXpiR2xqWlNnd0xDQmpiMjF3ZFhSbFpGTjBlV3hsTG5kcFpIUm9MbXhsYm1kMGFDQXRJRElwWEc0Z0lDQWdJQ0JqYjI1emRDQm9aV2xuYUhRZ1BTQmpiMjF3ZFhSbFpGTjBlV3hsTG1obGFXZG9kQzV6YkdsalpTZ3dMQ0JqYjIxd2RYUmxaRk4wZVd4bExtaGxhV2RvZEM1c1pXNW5kR2dnTFNBeUtWeHVYRzRnSUNBZ0lDQmpiMjV6ZENCMGIzQWdQU0FvZDJsdVpHOTNMbWx1Ym1WeVNHVnBaMmgwSUM4Z01pa2dMU0FvYUdWcFoyaDBJQzhnTWlsY2JpQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExuTjBlV3hsTG5SdmNDQTlJR0FrZTNSdmNIMXdlR0JjYmlBZ0lDQjlYRzVjYmlBZ0lDQnphRzkzS0NrZ2UxeHVJQ0FnSUNBZ2FXWWdLSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwSUQwOVBTQnVkV3hzS1NCN1hHNGdJQ0FnSUNBZ0lDOHZJR0oxYVd4a0lHRnVaQ0JwYm5ObGNuUWdZU0J1WlhjZ1JFOU5JR1ZzWlcxbGJuUmNiaUFnSUNBZ0lDQWdkR2hwY3k1aWRXbHNaQ2dwWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUdsbUlDaDBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVqYkdGemMweHBjM1F1WTI5dWRHRnBibk1vSjNOb2IzY25LU2tnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnWm1Gc2MyVmNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdMeThnWVdSa0lHRWdkR2x0Wlc5MWRDQnpieUIwYUdGMElIUm9aU0JEVTFNZ1lXNXBiV0YwYVc5dUlIZHZjbXR6WEc0Z0lDQWdJQ0J6WlhSVWFXMWxiM1YwS0NncElEMCtJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NTBjbWxuWjJWeVJYWmxiblFvUlhabGJuUXVVMGhQVnlsY2JpQWdJQ0FnSUNBZ2RHaHBjeTVpZFdsc1pFSmhZMnRrY205d0tDbGNibHh1SUNBZ0lDQWdJQ0JqYjI1emRDQnZibE5vYjNkdUlEMGdLQ2tnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQWdJSFJvYVhNdWRISnBaMmRsY2tWMlpXNTBLRVYyWlc1MExsTklUMWRPS1Z4dUlDQWdJQ0FnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbkpsYlc5MlpVVjJaVzUwVEdsemRHVnVaWElvUlhabGJuUXVWRkpCVGxOSlZFbFBUbDlGVGtRc0lHOXVVMmh2ZDI0cFhHNWNiaUFnSUNBZ0lDQWdJQ0F2THlCaGRIUmhZMmdnWlhabGJuUmNiaUFnSUNBZ0lDQWdJQ0IwYUdsekxtRjBkR0ZqYUVWMlpXNTBjeWdwWEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVoWkdSRmRtVnVkRXhwYzNSbGJtVnlLRVYyWlc1MExsUlNRVTVUU1ZSSlQwNWZSVTVFTENCdmJsTm9iM2R1S1Z4dVhHNGdJQ0FnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbU5zWVhOelRHbHpkQzVoWkdRb0ozTm9iM2NuS1Z4dVhHNGdJQ0FnSUNBZ0lIUm9hWE11WTJWdWRHVnlLQ2xjYmlBZ0lDQWdJSDBzSURFd0tWeHVYRzRnSUNBZ0lDQnlaWFIxY200Z2RISjFaVnh1SUNBZ0lIMWNibHh1SUNBZ0lHOXVSV3hsYldWdWRFVjJaVzUwS0dWMlpXNTBLU0I3WEc0Z0lDQWdJQ0JwWmlBb1pYWmxiblF1ZEhsd1pTQTlQVDBnSjJ0bGVYVndKeUFtSmlCbGRtVnVkQzVyWlhsRGIyUmxJQ0U5UFNBeU55QW1KaUJsZG1WdWRDNXJaWGxEYjJSbElDRTlQU0F4TXlrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY201Y2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0x5OGdhR2xrWlNCMGFHVWdaR2xoYkc5blhHNGdJQ0FnSUNCMGFHbHpMbWhwWkdVb0tWeHVJQ0FnSUgxY2JseHVJQ0FnSUdocFpHVW9LU0I3WEc0Z0lDQWdJQ0JwWmlBb0lYUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbU5zWVhOelRHbHpkQzVqYjI1MFlXbHVjeWduYzJodmR5Y3BLU0I3WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJtWVd4elpWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQjBhR2x6TG5SeWFXZG5aWEpGZG1WdWRDaEZkbVZ1ZEM1SVNVUkZLVnh1WEc0Z0lDQWdJQ0IwYUdsekxtUmxkR0ZqYUVWMlpXNTBjeWdwWEc1Y2JpQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExtTnNZWE56VEdsemRDNWhaR1FvSjJocFpHVW5LVnh1SUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1WTJ4aGMzTk1hWE4wTG5KbGJXOTJaU2duYzJodmR5Y3BYRzVjYmlBZ0lDQWdJR052Ym5OMElHSmhZMnRrY205d0lEMGdkR2hwY3k1blpYUkNZV05yWkhKdmNDZ3BYRzVjYmlBZ0lDQWdJR052Ym5OMElHOXVTR2xrWkdWdUlEMGdLQ2tnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQmtiMk4xYldWdWRDNWliMlI1TG5KbGJXOTJaVU5vYVd4a0tHSmhZMnRrY205d0tWeHVYRzRnSUNBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvSjJocFpHVW5LVnh1WEc0Z0lDQWdJQ0FnSUhSb2FYTXVkSEpwWjJkbGNrVjJaVzUwS0VWMlpXNTBMa2hKUkVSRlRpbGNibHh1SUNBZ0lDQWdJQ0JpWVdOclpISnZjQzV5WlcxdmRtVkZkbVZ1ZEV4cGMzUmxibVZ5S0VWMlpXNTBMbFJTUVU1VFNWUkpUMDVmUlU1RUxDQnZia2hwWkdSbGJpbGNibHh1SUNBZ0lDQWdJQ0F2THlCeVpXMXZkbVVnWjJWdVpYSmhkR1ZrSUdScFlXeHZaM01nWm5KdmJTQjBhR1VnUkU5TlhHNGdJQ0FnSUNBZ0lHbG1JQ2gwYUdsekxtUjVibUZ0YVdORmJHVnRaVzUwS1NCN1hHNGdJQ0FnSUNBZ0lDQWdaRzlqZFcxbGJuUXVZbTlrZVM1eVpXMXZkbVZEYUdsc1pDaDBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQ2xjYmlBZ0lDQWdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDQTlJRzUxYkd4Y2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQmlZV05yWkhKdmNDNWhaR1JGZG1WdWRFeHBjM1JsYm1WeUtFVjJaVzUwTGxSU1FVNVRTVlJKVDA1ZlJVNUVMQ0J2YmtocFpHUmxiaWxjYmlBZ0lDQWdJR0poWTJ0a2NtOXdMbU5zWVhOelRHbHpkQzVoWkdRb0oyWmhaR1Z2ZFhRbktWeHVYRzRnSUNBZ0lDQnlaWFIxY200Z2RISjFaVnh1SUNBZ0lIMWNibHh1SUNBZ0lHRjBkR0ZqYUVWMlpXNTBjeWdwSUh0Y2JpQWdJQ0FnSUdOdmJuTjBJR1JwYzIxcGMzTkNkWFIwYjI1eklEMGdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNrRnNiQ2duVzJSaGRHRXRaR2x6YldsemMxMG5LVnh1SUNBZ0lDQWdhV1lnS0dScGMyMXBjM05DZFhSMGIyNXpLU0I3WEc0Z0lDQWdJQ0FnSUdScGMyMXBjM05DZFhSMGIyNXpMbVp2Y2tWaFkyZ29ZblYwZEc5dUlEMCtJSFJvYVhNdWNtVm5hWE4wWlhKRmJHVnRaVzUwS0hzZ2RHRnlaMlYwT2lCaWRYUjBiMjRzSUdWMlpXNTBPaUFuWTJ4cFkyc25JSDBwS1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBdkx5QmhaR1FnWlhabGJuUnpJR2xtSUhSb1pTQmthV0ZzYjJjZ2FYTWdZMkZ1WTJWc1lXSnNaVnh1SUNBZ0lDQWdMeThnZDJocFkyZ2diV1ZoYm5NZ2RHaGxJSFZ6WlhJZ1kyRnVJR2hwWkdVZ2RHaGxJR1JwWVd4dloxeHVJQ0FnSUNBZ0x5OGdZbmtnY0hKbGMzTnBibWNnZEdobElFVlRReUJyWlhrZ2IzSWdZMnhwWTJzZ2IzVjBjMmxrWlNCMGFHVWdZbUZqYTJSeWIzQmNiaUFnSUNBZ0lHbG1JQ2gwYUdsekxtOXdkR2x2Ym5NdVkyRnVZMlZzWVdKc1pTa2dlMXh1SUNBZ0lDQWdJQ0JqYjI1emRDQmlZV05yWkhKdmNDQTlJSFJvYVhNdVoyVjBRbUZqYTJSeWIzQW9LVnh1SUNBZ0lDQWdJQ0IwYUdsekxuSmxaMmx6ZEdWeVJXeGxiV1Z1ZENoN0lIUmhjbWRsZERvZ1ltRmphMlJ5YjNBc0lHVjJaVzUwT2lCRmRtVnVkQzVUVkVGU1ZDQjlLVnh1SUNBZ0lDQWdJQ0IwYUdsekxuSmxaMmx6ZEdWeVJXeGxiV1Z1ZENoN0lIUmhjbWRsZERvZ1pHOWpkVzFsYm5Rc0lHVjJaVzUwT2lBbmEyVjVkWEFuSUgwcFhHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dVhHNGdJQ0FnWkdWMFlXTm9SWFpsYm5SektDa2dlMXh1SUNBZ0lDQWdZMjl1YzNRZ1pHbHpiV2x6YzBKMWRIUnZibk1nUFNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5UVd4c0tDZGJaR0YwWVMxa2FYTnRhWE56WFNjcFhHNGdJQ0FnSUNCcFppQW9aR2x6YldsemMwSjFkSFJ2Ym5NcElIdGNiaUFnSUNBZ0lDQWdaR2x6YldsemMwSjFkSFJ2Ym5NdVptOXlSV0ZqYUNoaWRYUjBiMjRnUFQ0Z2RHaHBjeTUxYm5KbFoybHpkR1Z5Uld4bGJXVnVkQ2g3SUhSaGNtZGxkRG9nWW5WMGRHOXVMQ0JsZG1WdWREb2dKMk5zYVdOckp5QjlLU2xjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnYVdZZ0tIUm9hWE11YjNCMGFXOXVjeTVqWVc1alpXeGhZbXhsS1NCN1hHNGdJQ0FnSUNBZ0lHTnZibk4wSUdKaFkydGtjbTl3SUQwZ2RHaHBjeTVuWlhSQ1lXTnJaSEp2Y0NncFhHNGdJQ0FnSUNBZ0lIUm9hWE11ZFc1eVpXZHBjM1JsY2tWc1pXMWxiblFvZXlCMFlYSm5aWFE2SUdKaFkydGtjbTl3TENCbGRtVnVkRG9nUlhabGJuUXVVMVJCVWxRZ2ZTbGNiaUFnSUNBZ0lDQWdkR2hwY3k1MWJuSmxaMmx6ZEdWeVJXeGxiV1Z1ZENoN0lIUmhjbWRsZERvZ1pHOWpkVzFsYm5Rc0lHVjJaVzUwT2lBbmEyVjVkWEFuSUgwcFhHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYzNSaGRHbGpJRjlFVDAxSmJuUmxjbVpoWTJVb2IzQjBhVzl1Y3lrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUhOMWNHVnlMbDlFVDAxSmJuUmxjbVpoWTJVb1JHbGhiRzluTENCdmNIUnBiMjV6S1Z4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ29nUkU5TklFRndhU0JwYlhCc1pXMWxiblJoZEdsdmJseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ292WEc0Z0lHTnZibk4wSUdOdmJYQnZibVZ1ZEhNZ1BTQmJYVnh1WEc0Z0lHTnZibk4wSUdScFlXeHZaM01nUFNCa2IyTjFiV1Z1ZEM1eGRXVnllVk5sYkdWamRHOXlRV3hzS0dBdUpIdE9RVTFGZldBcFhHNGdJR2xtSUNoa2FXRnNiMmR6S1NCN1hHNGdJQ0FnWkdsaGJHOW5jeTVtYjNKRllXTm9LQ2hsYkdWdFpXNTBLU0E5UGlCN1hHNGdJQ0FnSUNCamIyNXpkQ0JqYjI1bWFXY2dQU0JuWlhSQmRIUnlhV0oxZEdWelEyOXVabWxuS0dWc1pXMWxiblFzSUVSRlJrRlZURlJmVUZKUFVFVlNWRWxGVXl3Z1JFRlVRVjlCVkZSU1UxOVFVazlRUlZKVVNVVlRLVnh1SUNBZ0lDQWdZMjl1Wm1sbkxtVnNaVzFsYm5RZ1BTQmxiR1Z0Wlc1MFhHNWNiaUFnSUNBZ0lHTnZiWEJ2Ym1WdWRITXVjSFZ6YUNoN0lHVnNaVzFsYm5Rc0lHUnBZV3h2WnpvZ2JtVjNJRVJwWVd4dlp5aGpiMjVtYVdjcElIMHBYRzRnSUNBZ2ZTbGNiaUFnZlZ4dVhHNGdJR2xtSUNoa2FXRnNiMmR6S1NCN1hHNGdJQ0FnWkc5amRXMWxiblF1WVdSa1JYWmxiblJNYVhOMFpXNWxjaWduWTJ4cFkyc25MQ0FvWlhabGJuUXBJRDArSUh0Y2JpQWdJQ0FnSUdOdmJuTjBJR1JoZEdGVWIyZG5iR1ZCZEhSeUlEMGdaWFpsYm5RdWRHRnlaMlYwTG1kbGRFRjBkSEpwWW5WMFpTZ25aR0YwWVMxMGIyZG5iR1VuS1Z4dUlDQWdJQ0FnYVdZZ0tHUmhkR0ZVYjJkbmJHVkJkSFJ5SUNZbUlHUmhkR0ZVYjJkbmJHVkJkSFJ5SUQwOVBTQk9RVTFGS1NCN1hHNGdJQ0FnSUNBZ0lHTnZibk4wSUdsa0lEMGdaWFpsYm5RdWRHRnlaMlYwTG1kbGRFRjBkSEpwWW5WMFpTZ25aR0YwWVMxMFlYSm5aWFFuS1Z4dUlDQWdJQ0FnSUNCamIyNXpkQ0JsYkdWdFpXNTBJRDBnWkc5amRXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNpaHBaQ2xjYmx4dUlDQWdJQ0FnSUNCamIyNXpkQ0JqYjIxd2IyNWxiblFnUFNCamIyMXdiMjVsYm5SekxtWnBibVFvWXlBOVBpQmpMbVZzWlcxbGJuUWdQVDA5SUdWc1pXMWxiblFwWEc1Y2JpQWdJQ0FnSUNBZ2FXWWdLQ0ZqYjIxd2IyNWxiblFwSUh0Y2JpQWdJQ0FnSUNBZ0lDQnlaWFIxY201Y2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJR1YyWlc1MExuUmhjbWRsZEM1aWJIVnlLQ2xjYmx4dUlDQWdJQ0FnSUNCamIyMXdiMjVsYm5RdVpHbGhiRzluTG5Ob2IzY29LVnh1SUNBZ0lDQWdmVnh1SUNBZ0lIMHBYRzRnSUgxY2JseHVJQ0J5WlhSMWNtNGdSR2xoYkc5blhHNTlLU2dwWEc1Y2JtVjRjRzl5ZENCa1pXWmhkV3gwSUVScFlXeHZaMXh1SWl3aUx5b3FYRzRnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ29nVEdsalpXNXpaV1FnZFc1a1pYSWdUVWxVSUNob2RIUndjem92TDJkcGRHaDFZaTVqYjIwdmNYVmhjbXN0WkdWMkwxQm9iMjV2YmkxR2NtRnRaWGR2Y21zdllteHZZaTl0WVhOMFpYSXZURWxEUlU1VFJTbGNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaTljYm1sdGNHOXlkQ0JEYjIxd2IyNWxiblFnWm5KdmJTQW5MaTR2WTI5dGNHOXVaVzUwSjF4dWFXMXdiM0owSUVWMlpXNTBJR1p5YjIwZ0p5NHVMeTR1TDJOdmNtVXZaWFpsYm5SekoxeHVhVzF3YjNKMElIc2dabWx1WkZSaGNtZGxkRUo1UTJ4aGMzTWdmU0JtY205dElDY3VMaTh1TGk5amIzSmxMM1YwYVd4ekoxeHVhVzF3YjNKMElIc2daMlYwUVhSMGNtbGlkWFJsYzBOdmJtWnBaeUI5SUdaeWIyMGdKeTR1TDJOdmJYQnZibVZ1ZEUxaGJtRm5aWEluWEc1Y2JtTnZibk4wSUVSeWIzQmtiM2R1SUQwZ0tDZ3BJRDArSUh0Y2JpQWdMeW9xWEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpQkRiMjV6ZEdGdWRITmNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxTDF4dVhHNGdJR052Ym5OMElFNUJUVVVnUFNBblpISnZjR1J2ZDI0blhHNGdJR052Ym5OMElGWkZVbE5KVDA0Z1BTQW5NaTR3TGpBblhHNGdJR052Ym5OMElFUkZSa0ZWVEZSZlVGSlBVRVZTVkVsRlV5QTlJSHRjYmlBZ0lDQmxiR1Z0Wlc1ME9pQnVkV3hzTEZ4dUlDQWdJR1JsWm1GMWJIUTZJSFJ5ZFdVc1hHNGdJSDFjYmlBZ1kyOXVjM1FnUkVGVVFWOUJWRlJTVTE5UVVrOVFSVkpVU1VWVElEMGdXMXh1SUNBZ0lDZGtaV1poZFd4MEp5eGNiaUFnWFZ4dVhHNGdJQzhxS2x4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb2dRMnhoYzNNZ1JHVm1hVzVwZEdsdmJseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ292WEc1Y2JpQWdZMnhoYzNNZ1JISnZjR1J2ZDI0Z1pYaDBaVzVrY3lCRGIyMXdiMjVsYm5RZ2UxeHVYRzRnSUNBZ1kyOXVjM1J5ZFdOMGIzSW9iM0IwYVc5dWN5QTlJSHQ5S1NCN1hHNGdJQ0FnSUNCemRYQmxjaWhPUVUxRkxDQldSVkpUU1U5T0xDQkVSVVpCVlV4VVgxQlNUMUJGVWxSSlJWTXNJRzl3ZEdsdmJuTXNJRVJCVkVGZlFWUlVVbE5mVUZKUFVFVlNWRWxGVXl3Z1ptRnNjMlVzSUdaaGJITmxLVnh1WEc0Z0lDQWdJQ0JqYjI1emRDQnpaV3hsWTNSbFpDQTlJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSW9KMXRrWVhSaExYTmxiR1ZqZEdWa1hTY3BYRzRnSUNBZ0lDQmpiMjV6ZENCcGRHVnRJRDBnZEdocGN5NW5aWFJKZEdWdFJHRjBZU2h6Wld4bFkzUmxaQ2xjYmx4dUlDQWdJQ0FnZEdocGN5NXpaWFJUWld4bFkzUmxaQ2hwZEdWdExuWmhiSFZsTENCcGRHVnRMblJsZUhRc0lHWmhiSE5sS1Z4dUlDQWdJSDFjYmx4dUlDQWdJSE5sZEZCdmMybDBhVzl1S0dKMWRIUnZiaWtnZTF4dVhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYzJWMFUyVnNaV04wWldRb2RtRnNkV1VnUFNBbkp5d2dkR1Y0ZENBOUlHNTFiR3dzSUdOb1pXTnJSWGhwYzNSeklEMGdkSEoxWlNrZ2UxeHVJQ0FnSUNBZ2FXWWdLQ0YwYUdsekxtOXdkR2x2Ym5NdVpHVm1ZWFZzZENrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z1ptRnNjMlZjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnYkdWMElIUmxlSFJFYVhOd2JHRjVJRDBnZEdWNGRGeHVJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVjWFZsY25sVFpXeGxZM1J2Y2lnbkxtUmxabUYxYkhRdGRHVjRkQ2NwTG1sdWJtVnlTRlJOVENBOUlIUmxlSFJjYmlBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSW9KMmx1Y0hWMFczUjVjR1U5WENKb2FXUmtaVzVjSWwwbktTNTJZV3gxWlNBOUlIWmhiSFZsWEc1Y2JpQWdJQ0FnSUdsbUlDaGphR1ZqYTBWNGFYTjBjeWtnZTF4dUlDQWdJQ0FnSUNCc1pYUWdabTkxYm1RZ1BTQm1ZV3h6WlZ4dUlDQWdJQ0FnSUNCamIyNXpkQ0JwZEdWdGN5QTlJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSkJiR3dvSnk1cGRHVnRKeWxjYmlBZ0lDQWdJQ0FnYVdZZ0tHbDBaVzF6S1NCN1hHNGdJQ0FnSUNBZ0lDQWdabTl5SUNoamIyNXpkQ0JwZEdWdElHOW1JR2wwWlcxektTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCamIyNXpkQ0JrWVhSaElEMGdkR2hwY3k1blpYUkpkR1Z0UkdGMFlTaHBkR1Z0S1Z4dUlDQWdJQ0FnSUNBZ0lDQWdhV1lnS0haaGJIVmxJRDA5UFNCa1lYUmhMblpoYkhWbEtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDOHZJSFZ3WkdGMFpTQjBhR1VnZEdWNGRDQjBieUJrYVhOd2JHRjVJR2xtSUdsMElHbHpJRzUxYkd3Z2IyNXNlVnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQnBaaUFvZEdWNGRFUnBjM0JzWVhrZ1BUMDlJRzUxYkd3cElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjBaWGgwUkdsemNHeGhlU0E5SUdSaGRHRXVkR1Y0ZEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJR1p2ZFc1a0lEMGdkSEoxWlZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0JpY21WaGExeHVJQ0FnSUNBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0lvSnk1a1pXWmhkV3gwTFhSbGVIUW5LUzVwYm01bGNraFVUVXdnUFNCMFpYaDBSR2x6Y0d4aGVWeHVJQ0FnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eUtDZHBibkIxZEZ0MGVYQmxQVndpYUdsa1pHVnVYQ0pkSnlrdWRtRnNkV1VnUFNCMllXeDFaVnh1WEc0Z0lDQWdJQ0FnSUdsbUlDZ2habTkxYm1RcElIdGNiaUFnSUNBZ0lDQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9ZQ1I3VGtGTlJYMHVJRlJvWlNCMllXeDFaU0JjSWlSN2RtRnNkV1Y5WENJZ1pHOWxjeUJ1YjNRZ1pYaHBjM1FnYVc0Z2RHaGxJR3hwYzNRZ2IyWWdhWFJsYlhNdVlDbGNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdmVnh1SUNBZ0lIMWNibHh1SUNBZ0lHZGxkRk5sYkdWamRHVmtLQ2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSW9KMmx1Y0hWMFczUjVjR1U5WENKb2FXUmtaVzVjSWwwbktTNTJZV3gxWlZ4dUlDQWdJSDFjYmx4dUlDQWdJR2RsZEVsMFpXMUVZWFJoS0dsMFpXMGdQU0J1ZFd4c0tTQjdYRzRnSUNBZ0lDQnNaWFFnZEdWNGRDQTlJQ2NuWEc0Z0lDQWdJQ0JzWlhRZ2RtRnNkV1VnUFNBbkoxeHVYRzRnSUNBZ0lDQnBaaUFvYVhSbGJTa2dlMXh1SUNBZ0lDQWdJQ0IwWlhoMElEMGdhWFJsYlM1blpYUkJkSFJ5YVdKMWRHVW9KMlJoZEdFdGRHVjRkQ2NwSUh4OElHbDBaVzB1YVc1dVpYSklWRTFNWEc1Y2JpQWdJQ0FnSUNBZ1kyOXVjM1FnYzJWc1pXTjBaV1JVWlhoMFRtOWtaU0E5SUdsMFpXMHVjWFZsY25sVFpXeGxZM1J2Y2lnbkxuUmxlSFFuS1Z4dUlDQWdJQ0FnSUNCcFppQW9jMlZzWldOMFpXUlVaWGgwVG05a1pTa2dlMXh1SUNBZ0lDQWdJQ0FnSUhSbGVIUWdQU0J6Wld4bFkzUmxaRlJsZUhST2IyUmxMbWx1Ym1WeVNGUk5URnh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ2RtRnNkV1VnUFNCcGRHVnRMbWRsZEVGMGRISnBZblYwWlNnblpHRjBZUzEyWVd4MVpTY3BYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSEpsZEhWeWJpQjdJSFJsZUhRc0lIWmhiSFZsSUgxY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J2YmtWc1pXMWxiblJGZG1WdWRDaGxkbVZ1ZENrZ2UxeHVJQ0FnSUNBZ2FXWWdLR1YyWlc1MExuUjVjR1VnUFQwOUlFVjJaVzUwTGxOVVFWSlVLU0I3WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJR1J5YjNCa2IzZHVJRDBnWm1sdVpGUmhjbWRsZEVKNVEyeGhjM01vWlhabGJuUXVkR0Z5WjJWMExDQW5aSEp2Y0dSdmQyNG5LVnh1SUNBZ0lDQWdJQ0JwWmlBb0lXUnliM0JrYjNkdUtTQjdYRzRnSUNBZ0lDQWdJQ0FnZEdocGN5NW9hV1JsS0NsY2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQjlJR1ZzYzJVZ2FXWWdLR1YyWlc1MExuUjVjR1VnUFQwOUlDZGpiR2xqYXljcElIdGNiaUFnSUNBZ0lDQWdZMjl1YzNRZ2FYUmxiU0E5SUdacGJtUlVZWEpuWlhSQ2VVTnNZWE56S0dWMlpXNTBMblJoY21kbGRDd2dKMmwwWlcwbktWeHVYRzRnSUNBZ0lDQWdJR2xtSUNocGRHVnRLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2FXWWdLR2wwWlcwdVkyeGhjM05NYVhOMExtTnZiblJoYVc1ektDZGthWE5oWW14bFpDY3BLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY201Y2JpQWdJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnSUNCamIyNXpkQ0JwZEdWdFNXNW1ieUE5SUhSb2FYTXVaMlYwU1hSbGJVUmhkR0VvYVhSbGJTbGNiaUFnSUNBZ0lDQWdJQ0IwYUdsekxuTmxkRk5sYkdWamRHVmtLR2wwWlcxSmJtWnZMblpoYkhWbExDQnBkR1Z0U1c1bWJ5NTBaWGgwTENCbVlXeHpaU2xjYmx4dUlDQWdJQ0FnSUNBZ0lHTnZibk4wSUdSbGRHRnBiQ0E5SUhzZ2FYUmxiU3dnZEdWNGREb2dhWFJsYlVsdVptOHVkR1Y0ZEN3Z2RtRnNkV1U2SUdsMFpXMUpibVp2TG5aaGJIVmxJSDFjYmlBZ0lDQWdJQ0FnSUNCMGFHbHpMblJ5YVdkblpYSkZkbVZ1ZENoRmRtVnVkQzVKVkVWTlgxTkZURVZEVkVWRUxDQmtaWFJoYVd3cFhHNWNiaUFnSUNBZ0lDQWdJQ0IwYUdsekxtaHBaR1VvS1Z4dUlDQWdJQ0FnSUNBZ0lISmxkSFZ5Ymx4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdMeThnWkc5dUozUWdkRzluWjJ4bElIUm9aU0JrY205d1pHOTNiaUJwWmlCMGFHVWdaWFpsYm5RZ1kyOXVZMlZ5Ym5NZ2FHVmhaR1Z5Y3l3Z1pHbDJhV1JsY25OY2JpQWdJQ0FnSUNBZ1kyOXVjM1FnWkhKdmNHUnZkMjVOWlc1MUlEMGdabWx1WkZSaGNtZGxkRUo1UTJ4aGMzTW9aWFpsYm5RdWRHRnlaMlYwTENBblpISnZjR1J2ZDI0dGJXVnVkU2NwWEc0Z0lDQWdJQ0FnSUdsbUlDaGtjbTl3Wkc5M2JrMWxiblVwSUh0Y2JpQWdJQ0FnSUNBZ0lDQnlaWFIxY201Y2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJSFJvYVhNdWRHOW5aMnhsS0NsY2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc1Y2JpQWdJQ0IwYjJkbmJHVW9LU0I3WEc0Z0lDQWdJQ0JwWmlBb2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVZMnhoYzNOTWFYTjBMbU52Ym5SaGFXNXpLQ2RoWTNScGRtVW5LU2tnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnZEdocGN5NW9hV1JsS0NsY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTXVjMmh2ZHlncFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYzJodmR5Z3BJSHRjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNWpiR0Z6YzB4cGMzUXVZMjl1ZEdGcGJuTW9KMkZqZEdsMlpTY3BLU0I3WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJtWVd4elpWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVqYkdGemMweHBjM1F1WVdSa0tDZGhZM1JwZG1VbktWeHVYRzRnSUNBZ0lDQmpiMjV6ZENCa2NtOXdaRzkzYmsxbGJuVWdQU0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1eGRXVnllVk5sYkdWamRHOXlLQ2N1WkhKdmNHUnZkMjR0YldWdWRTY3BYRzVjYmlBZ0lDQWdJQzh2SUhOamNtOXNiQ0IwYnlCMGIzQmNiaUFnSUNBZ0lHUnliM0JrYjNkdVRXVnVkUzV6WTNKdmJHeFViM0FnUFNBd1hHNWNiaUFnSUNBZ0lIUm9hWE11ZEhKcFoyZGxja1YyWlc1MEtFVjJaVzUwTGxOSVQxY3BYRzRnSUNBZ0lDQjBhR2x6TG5SeWFXZG5aWEpGZG1WdWRDaEZkbVZ1ZEM1VFNFOVhUaWxjYmx4dUlDQWdJQ0FnZEdocGN5NXlaV2RwYzNSbGNrVnNaVzFsYm5Rb2V5QjBZWEpuWlhRNklHUnliM0JrYjNkdVRXVnVkU3dnWlhabGJuUTZJQ2RqYkdsamF5Y2dmU2tnSUNBZ0lDQmNiaUFnSUNBZ0lIUm9hWE11Y21WbmFYTjBaWEpGYkdWdFpXNTBLSHNnZEdGeVoyVjBPaUJrYjJOMWJXVnVkQzVpYjJSNUxDQmxkbVZ1ZERvZ1JYWmxiblF1VTFSQlVsUWdmU2xjYmx4dUlDQWdJQ0FnY21WMGRYSnVJSFJ5ZFdWY2JpQWdJQ0I5WEc1Y2JpQWdJQ0JvYVdSbEtDa2dlMXh1SUNBZ0lDQWdhV1lnS0NGMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNWpiR0Z6YzB4cGMzUXVZMjl1ZEdGcGJuTW9KMkZqZEdsMlpTY3BLU0I3WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJtWVd4elpWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVqYkdGemMweHBjM1F1Y21WdGIzWmxLQ2RoWTNScGRtVW5LVnh1WEc0Z0lDQWdJQ0IwYUdsekxuUnlhV2RuWlhKRmRtVnVkQ2hGZG1WdWRDNUlTVVJGS1Z4dUlDQWdJQ0FnZEdocGN5NTBjbWxuWjJWeVJYWmxiblFvUlhabGJuUXVTRWxFUkVWT0tWeHVYRzRnSUNBZ0lDQjBhR2x6TG5WdWNtVm5hWE4wWlhKRmJHVnRaVzUwS0hzZ2RHRnlaMlYwT2lCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5S0NjdVpISnZjR1J2ZDI0dGJXVnVkU2NwTENCbGRtVnVkRG9nSjJOc2FXTnJKeUI5S1NBZ0lDQWdJRnh1SUNBZ0lDQWdkR2hwY3k1MWJuSmxaMmx6ZEdWeVJXeGxiV1Z1ZENoN0lIUmhjbWRsZERvZ1pHOWpkVzFsYm5RdVltOWtlU3dnWlhabGJuUTZJRVYyWlc1MExsTlVRVkpVSUgwcFhHNWNiaUFnSUNBZ0lISmxkSFZ5YmlCMGNuVmxYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MzUmhkR2xqSUY5RVQwMUpiblJsY21aaFkyVW9iM0IwYVc5dWN5a2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlITjFjR1Z5TGw5RVQwMUpiblJsY21aaFkyVW9SSEp2Y0dSdmQyNHNJRzl3ZEdsdmJuTXBYRzRnSUNBZ2ZWeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpQkVUMDBnUVhCcElHbHRjR3hsYldWdWRHRjBhVzl1WEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpOWNiaUFnWTI5dWMzUWdZMjl0Y0c5dVpXNTBjeUE5SUZ0ZFhHNWNiaUFnWTI5dWMzUWdaSEp2Y0dSdmQyNXpJRDBnWkc5amRXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNrRnNiQ2hnTGlSN1RrRk5SWDFnS1Z4dUlDQnBaaUFvWkhKdmNHUnZkMjV6S1NCN1hHNGdJQ0FnWkhKdmNHUnZkMjV6TG1admNrVmhZMmdvS0dWc1pXMWxiblFwSUQwK0lIdGNiaUFnSUNBZ0lHTnZibk4wSUdOdmJtWnBaeUE5SUdkbGRFRjBkSEpwWW5WMFpYTkRiMjVtYVdjb1pXeGxiV1Z1ZEN3Z1JFVkdRVlZNVkY5UVVrOVFSVkpVU1VWVExDQkVRVlJCWDBGVVZGSlRYMUJTVDFCRlVsUkpSVk1wWEc0Z0lDQWdJQ0JqYjI1bWFXY3VaV3hsYldWdWRDQTlJR1ZzWlcxbGJuUmNibHh1SUNBZ0lDQWdZMjl0Y0c5dVpXNTBjeTV3ZFhOb0tHNWxkeUJFY205d1pHOTNiaWhqYjI1bWFXY3BLVnh1SUNBZ0lIMHBYRzRnSUgxY2JseHVJQ0JwWmlBb1pISnZjR1J2ZDI1ektTQjdYRzRnSUNBZ1pHOWpkVzFsYm5RdVlXUmtSWFpsYm5STWFYTjBaVzVsY2lnblkyeHBZMnNuTENBb1pYWmxiblFwSUQwK0lIdGNiaUFnSUNBZ0lHTnZibk4wSUdSeWIzQmtiM2R1VFdWdWRTQTlJR1pwYm1SVVlYSm5aWFJDZVVOc1lYTnpLR1YyWlc1MExuUmhjbWRsZEN3Z0oyUnliM0JrYjNkdUxXMWxiblVuS1Z4dUlDQWdJQ0FnYVdZZ0tHUnliM0JrYjNkdVRXVnVkU2tnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTVjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnWTI5dWMzUWdaSEp2Y0dSdmQyNGdQU0JtYVc1a1ZHRnlaMlYwUW5sRGJHRnpjeWhsZG1WdWRDNTBZWEpuWlhRc0lDZGtjbTl3Wkc5M2JpY3BYRzVjYmlBZ0lDQWdJR2xtSUNoa2NtOXdaRzkzYmlrZ2UxeHVJQ0FnSUNBZ0lDQmpiMjV6ZENCa1lYUmhWRzluWjJ4bFFYUjBjaUE5SUdSeWIzQmtiM2R1TG1kbGRFRjBkSEpwWW5WMFpTZ25aR0YwWVMxMGIyZG5iR1VuS1Z4dUlDQWdJQ0FnSUNCcFppQW9aR0YwWVZSdloyZHNaVUYwZEhJZ0ppWWdaR0YwWVZSdloyZHNaVUYwZEhJZ1BUMDlJRTVCVFVVZ0ppWWdaSEp2Y0dSdmQyNHBJSHRjYmlBZ0lDQWdJQ0FnSUNCamIyNXpkQ0JqYjIxd2IyNWxiblFnUFNCamIyMXdiMjVsYm5SekxtWnBibVFvWXlBOVBpQmpMbWRsZEVWc1pXMWxiblFvS1NBOVBUMGdaSEp2Y0dSdmQyNHBYRzVjYmlBZ0lDQWdJQ0FnSUNCcFppQW9JV052YlhCdmJtVnVkQ2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdVhHNGdJQ0FnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUNBZ1kyOXRjRzl1Wlc1MExuUnZaMmRzWlNncFhHNGdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lIMWNiaUFnSUNCOUtWeHVJQ0I5WEc1Y2JpQWdjbVYwZFhKdUlFUnliM0JrYjNkdVhHNTlLU2dwWEc1Y2JtVjRjRzl5ZENCa1pXWmhkV3gwSUVSeWIzQmtiM2R1WEc0aUxDSXZLaXBjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2lCTWFXTmxibk5sWkNCMWJtUmxjaUJOU1ZRZ0tHaDBkSEJ6T2k4dloybDBhSFZpTG1OdmJTOXhkV0Z5YXkxa1pYWXZVR2h2Ym05dUxVWnlZVzFsZDI5eWF5OWliRzlpTDIxaGMzUmxjaTlNU1VORlRsTkZLVnh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxTDF4dWFXMXdiM0owSUVOdmJYQnZibVZ1ZENCbWNtOXRJQ2N1TGk5amIyMXdiMjVsYm5RblhHNWNibU52Ym5OMElFeHZZV1JsY2lBOUlDZ29LU0E5UGlCN1hHNGdJQzhxS2x4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb2dRMjl1YzNSaGJuUnpYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2k5Y2JseHVJQ0JqYjI1emRDQk9RVTFGSUQwZ0oyeHZZV1JsY2lkY2JpQWdZMjl1YzNRZ1ZrVlNVMGxQVGlBOUlDY3lMakF1TUNkY2JpQWdZMjl1YzNRZ1JFVkdRVlZNVkY5UVVrOVFSVkpVU1VWVElEMGdlMXh1SUNBZ0lHVnNaVzFsYm5RNklHNTFiR3dzWEc0Z0lDQWdZMjlzYjNJNklHNTFiR3dzWEc0Z0lDQWdjMmw2WlRvZ2JuVnNiQ3hjYmlBZ2ZWeHVJQ0JqYjI1emRDQkVRVlJCWDBGVVZGSlRYMUJTVDFCRlVsUkpSVk1nUFNCYlhWeHVYRzRnSUM4cUtseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ29nUTJ4aGMzTWdSR1ZtYVc1cGRHbHZibHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvdlhHNWNiaUFnWTJ4aGMzTWdURzloWkdWeUlHVjRkR1Z1WkhNZ1EyOXRjRzl1Wlc1MElIdGNibHh1SUNBZ0lHTnZibk4wY25WamRHOXlLRzl3ZEdsdmJuTWdQU0I3ZlNrZ2UxeHVJQ0FnSUNBZ2MzVndaWElvVGtGTlJTd2dWa1ZTVTBsUFRpd2dSRVZHUVZWTVZGOVFVazlRUlZKVVNVVlRMQ0J2Y0hScGIyNXpMQ0JFUVZSQlgwRlVWRkpUWDFCU1QxQkZVbFJKUlZNc0lHWmhiSE5sTENCbVlXeHpaU2xjYmx4dUlDQWdJQ0FnTHk4Z2MyVjBJR052Ykc5eVhHNGdJQ0FnSUNCamIyNXpkQ0JzYjJGa1pYSlRjR2x1Ym1WeUlEMGdkR2hwY3k1blpYUlRjR2x1Ym1WeUtDbGNiaUFnSUNBZ0lHbG1JQ2gwZVhCbGIyWWdkR2hwY3k1dmNIUnBiMjV6TG1OdmJHOXlJRDA5UFNBbmMzUnlhVzVuSjF4dUlDQWdJQ0FnSUNBbUppQWhiRzloWkdWeVUzQnBibTVsY2k1amJHRnpjMHhwYzNRdVkyOXVkR0ZwYm5Nb1lHTnZiRzl5TFNSN2RHaHBjeTV2Y0hScGIyNXpMbU52Ykc5eWZXQXBLU0I3WEc0Z0lDQWdJQ0FnSUd4dllXUmxjbE53YVc1dVpYSXVZMnhoYzNOTWFYTjBMbUZrWkNoZ1kyOXNiM0l0Skh0MGFHbHpMbTl3ZEdsdmJuTXVZMjlzYjNKOVlDbGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdkR2hwY3k1amRYTjBiMjFUYVhwbElEMGdkR2hwY3k1dmNIUnBiMjV6TG5OcGVtVWdJVDA5SUc1MWJHeGNiaUFnSUNCOVhHNWNiaUFnSUNCblpYUkRiR2xsYm5SVGFYcGxLQ2tnZTF4dUlDQWdJQ0FnYVdZZ0tDRjBhR2x6TG1OMWMzUnZiVk5wZW1VcElIdGNiaUFnSUNBZ0lDQWdZMjl1YzNRZ2MybDZaU0E5SUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExtZGxkRUp2ZFc1a2FXNW5RMnhwWlc1MFVtVmpkQ2dwSUNBZ0lDQWdJQ0JjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJSE5wZW1VdWFHVnBaMmgwWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhKbGRIVnliaUIwYUdsekxtOXdkR2x2Ym5NdWMybDZaVnh1SUNBZ0lIMWNibHh1SUNBZ0lHZGxkRk53YVc1dVpYSW9LU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNpZ25MbXh2WVdSbGNpMXpjR2x1Ym1WeUp5bGNiaUFnSUNCOVhHNWNiaUFnSUNCemFHOTNLQ2tnZTF4dUlDQWdJQ0FnYVdZZ0tIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbU5zWVhOelRHbHpkQzVqYjI1MFlXbHVjeWduYUdsa1pTY3BLU0I3WEc0Z0lDQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExtTnNZWE56VEdsemRDNXlaVzF2ZG1Vb0oyaHBaR1VuS1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCamIyNXpkQ0J6YVhwbElEMGdkR2hwY3k1blpYUkRiR2xsYm5SVGFYcGxLQ2xjYmlBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1emFYcGxJRDBnYzJsNlpWeHVYRzRnSUNBZ0lDQnBaaUFvZEdocGN5NWpkWE4wYjIxVGFYcGxLU0I3WEc0Z0lDQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExuTjBlV3hsTG5kcFpIUm9JRDBnWUNSN2RHaHBjeTV2Y0hScGIyNXpMbk5wZW1WOWNIaGdYRzRnSUNBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG5OMGVXeGxMbWhsYVdkb2RDQTlJR0FrZTNSb2FYTXViM0IwYVc5dWN5NXphWHBsZlhCNFlGeHVYRzRnSUNBZ0lDQWdJR052Ym5OMElHeHZZV1JsY2xOd2FXNXVaWElnUFNCMGFHbHpMbWRsZEZOd2FXNXVaWElvS1Z4dUlDQWdJQ0FnSUNCc2IyRmtaWEpUY0dsdWJtVnlMbk4wZVd4bExuZHBaSFJvSUQwZ1lDUjdkR2hwY3k1dmNIUnBiMjV6TG5OcGVtVjljSGhnWEc0Z0lDQWdJQ0FnSUd4dllXUmxjbE53YVc1dVpYSXVjM1I1YkdVdWFHVnBaMmgwSUQwZ1lDUjdkR2hwY3k1dmNIUnBiMjV6TG5OcGVtVjljSGhnWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhKbGRIVnliaUIwY25WbFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnWVc1cGJXRjBaU2h6ZEdGeWRFRnVhVzFoZEdsdmJpQTlJSFJ5ZFdVcElIdGNiaUFnSUNBZ0lHbG1JQ2h6ZEdGeWRFRnVhVzFoZEdsdmJpa2dlMXh1SUNBZ0lDQWdJQ0IwYUdsekxuTm9iM2NvS1Z4dUlDQWdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NW9hV1JsS0NsY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ1kyOXVjM1FnYkc5aFpHVnlVM0JwYm01bGNpQTlJSFJvYVhNdVoyVjBVM0JwYm01bGNpZ3BYRzVjYmlBZ0lDQWdJR2xtSUNoemRHRnlkRUZ1YVcxaGRHbHZiaUFtSmx4dUlDQWdJQ0FnSUNBaGJHOWhaR1Z5VTNCcGJtNWxjaTVqYkdGemMweHBjM1F1WTI5dWRHRnBibk1vSjJ4dllXUmxjaTF6Y0dsdWJtVnlMV0Z1YVcxaGRHVmtKeWtwSUh0Y2JpQWdJQ0FnSUNBZ2JHOWhaR1Z5VTNCcGJtNWxjaTVqYkdGemMweHBjM1F1WVdSa0tDZHNiMkZrWlhJdGMzQnBibTVsY2kxaGJtbHRZWFJsWkNjcFhHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCMGNuVmxYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR2xtSUNnaGMzUmhjblJCYm1sdFlYUnBiMjRnSmlaY2JpQWdJQ0FnSUNBZ2JHOWhaR1Z5VTNCcGJtNWxjaTVqYkdGemMweHBjM1F1WTI5dWRHRnBibk1vSjJ4dllXUmxjaTF6Y0dsdWJtVnlMV0Z1YVcxaGRHVmtKeWtwSUh0Y2JpQWdJQ0FnSUNBZ2JHOWhaR1Z5VTNCcGJtNWxjaTVqYkdGemMweHBjM1F1Y21WdGIzWmxLQ2RzYjJGa1pYSXRjM0JwYm01bGNpMWhibWx0WVhSbFpDY3BYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSEpsZEhWeWJpQjBjblZsWEc0Z0lDQWdmVnh1WEc0Z0lDQWdhR2xrWlNncElIdGNiaUFnSUNBZ0lHbG1JQ2doZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdVkyeGhjM05NYVhOMExtTnZiblJoYVc1ektDZG9hV1JsSnlrcElIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1WTJ4aGMzTk1hWE4wTG1Ga1pDZ25hR2xrWlNjcFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lISmxkSFZ5YmlCMGNuVmxYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MzUmhkR2xqSUY5RVQwMUpiblJsY21aaFkyVW9iM0IwYVc5dWN5a2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlITjFjR1Z5TGw5RVQwMUpiblJsY21aaFkyVW9URzloWkdWeUxDQnZjSFJwYjI1ektWeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lISmxkSFZ5YmlCTWIyRmtaWEpjYm4wcEtDbGNibHh1Wlhod2IzSjBJR1JsWm1GMWJIUWdURzloWkdWeVhHNGlMQ0l2S2lwY2Jpb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlvZ1RHbGpaVzV6WldRZ2RXNWtaWElnVFVsVUlDaG9kSFJ3Y3pvdkwyZHBkR2gxWWk1amIyMHZjWFZoY21zdFpHVjJMMUJvYjI1dmJpMUdjbUZ0WlhkdmNtc3ZZbXh2WWk5dFlYTjBaWEl2VEVsRFJVNVRSU2xjYmlvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaW92WEc1cGJYQnZjblFnUlhabGJuUWdabkp2YlNBbkxpNHZMaTR2WTI5eVpTOWxkbVZ1ZEhNblhHNXBiWEJ2Y25RZ1EyOXRjRzl1Wlc1MElHWnliMjBnSnk0dUwyTnZiWEJ2Ym1WdWRDZGNibHh1WTI5dWMzUWdUbTkwYVdacFkyRjBhVzl1SUQwZ0tDZ3BJRDArSUh0Y2JpQWdMeW9xWEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBcUlFTnZibk4wWVc1MGMxeHVJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQXFMMXh1WEc0Z0lHTnZibk4wSUU1QlRVVWdQU0FuYm05MGFXWnBZMkYwYVc5dUoxeHVJQ0JqYjI1emRDQldSVkpUU1U5T0lEMGdKekl1TUM0d0oxeHVJQ0JqYjI1emRDQkVSVVpCVlV4VVgxQlNUMUJGVWxSSlJWTWdQU0I3WEc0Z0lDQWdaV3hsYldWdWREb2diblZzYkN4Y2JpQWdJQ0J0WlhOellXZGxPaUFuSnl4Y2JpQWdJQ0J6YUc5M1FuVjBkRzl1T2lCMGNuVmxMRnh1SUNBZ0lIUnBiV1Z2ZFhRNklHNTFiR3dzWEc0Z0lDQWdZbUZqYTJkeWIzVnVaRG9nSjNCeWFXMWhjbmtuTEZ4dUlDQjlYRzRnSUdOdmJuTjBJRVJCVkVGZlFWUlVVbE5mVUZKUFVFVlNWRWxGVXlBOUlGdGNiaUFnSUNBbmRHbHRaVzkxZENjc1hHNGdJRjFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUlFTnNZWE56SUVSbFptbHVhWFJwYjI1Y2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFMMXh1WEc0Z0lHTnNZWE56SUU1dmRHbG1hV05oZEdsdmJpQmxlSFJsYm1SeklFTnZiWEJ2Ym1WdWRDQjdYRzVjYmlBZ0lDQmpiMjV6ZEhKMVkzUnZjaWh2Y0hScGIyNXpJRDBnZTMwcElIdGNiaUFnSUNBZ0lITjFjR1Z5S0U1QlRVVXNJRlpGVWxOSlQwNHNJRVJGUmtGVlRGUmZVRkpQVUVWU1ZFbEZVeXdnYjNCMGFXOXVjeXdnUkVGVVFWOUJWRlJTVTE5UVVrOVFSVkpVU1VWVExDQjBjblZsTENCbVlXeHpaU2xjYmx4dUlDQWdJQ0FnZEdocGN5NTBaVzF3YkdGMFpTQTlJQ2NuSUN0Y2JpQWdJQ0FnSUNjOFpHbDJJR05zWVhOelBWd2libTkwYVdacFkyRjBhVzl1WENJK0p5QXJYRzRnSUNBZ0lDQWdJQ2M4WkdsMklHTnNZWE56UFZ3aWJtOTBhV1pwWTJGMGFXOXVMV2x1Ym1WeVhDSStKeUFyWEc0Z0lDQWdJQ0FnSUNBZ0p6eGthWFlnWTJ4aGMzTTlYQ0p0WlhOellXZGxYQ0krUEM5a2FYWStKeUFyWEc0Z0lDQWdJQ0FnSUNBZ0p6eGlkWFIwYjI0Z2RIbHdaVDFjSW1KMWRIUnZibHdpSUdOc1lYTnpQVndpWTJ4dmMyVmNJaUJrWVhSaExXUnBjMjFwYzNNOVhDSnViM1JwWm1sallYUnBiMjVjSWlCaGNtbGhMV3hoWW1Wc1BWd2lRMnh2YzJWY0lqNG5JQ3RjYmlBZ0lDQWdJQ0FnSUNBZ0lDYzhjM0JoYmlCaGNtbGhMV2hwWkdSbGJqMWNJblJ5ZFdWY0lqNG1kR2x0WlhNN1BDOXpjR0Z1UGljZ0sxeHVJQ0FnSUNBZ0lDQWdJQ2M4TDJKMWRIUnZiajRuSUN0Y2JpQWdJQ0FnSUNBZ0p6d3ZaR2wyUGljZ0sxeHVJQ0FnSUNBZ0p6d3ZaR2wyUGlkY2JseHVJQ0FnSUNBZ2FXWWdLSFJvYVhNdVpIbHVZVzFwWTBWc1pXMWxiblFwSUh0Y2JpQWdJQ0FnSUNBZ2RHaHBjeTVpZFdsc1pDZ3BYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSFJvYVhNdWRHbHRaVzkxZEVOaGJHeGlZV05ySUQwZ2JuVnNiRnh1SUNBZ0lIMWNibHh1SUNBZ0lHSjFhV3hrS0NrZ2UxeHVJQ0FnSUNBZ1kyOXVjM1FnWW5WcGJHUmxjaUE5SUdSdlkzVnRaVzUwTG1OeVpXRjBaVVZzWlcxbGJuUW9KMlJwZGljcFhHNWNiaUFnSUNBZ0lHSjFhV3hrWlhJdWFXNXVaWEpJVkUxTUlEMGdkR2hwY3k1MFpXMXdiR0YwWlZ4dVhHNGdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDQTlJR0oxYVd4a1pYSXVabWx5YzNSRGFHbHNaRnh1WEc0Z0lDQWdJQ0F2THlCMFpYaDBJRzFsYzNOaFoyVmNiaUFnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNJb0p5NXRaWE56WVdkbEp5a3VhVzV1WlhKSVZFMU1JRDBnZEdocGN5NXZjSFJwYjI1ekxtMWxjM05oWjJWY2JseHVJQ0FnSUNBZ2FXWWdLQ0YwYUdsekxtOXdkR2x2Ym5NdWMyaHZkMEoxZEhSdmJpa2dlMXh1SUNBZ0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1eGRXVnllVk5sYkdWamRHOXlLQ2RpZFhSMGIyNG5LUzV6ZEhsc1pTNWthWE53YkdGNUlEMGdKMjV2Ym1VblhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lHUnZZM1Z0Wlc1MExtSnZaSGt1WVhCd1pXNWtRMmhwYkdRb2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXBYRzVjYmlBZ0lDQWdJSFJvYVhNdWMyVjBRWFIwY21saWRYUmxjeWdwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdjMmh2ZHlncElIdGNiaUFnSUNBZ0lHbG1JQ2gwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZENBOVBUMGdiblZzYkNrZ2UxeHVJQ0FnSUNBZ0lDQXZMeUJpZFdsc1pDQmhibVFnYVc1elpYSjBJR0VnYm1WM0lFUlBUU0JsYkdWdFpXNTBYRzRnSUNBZ0lDQWdJSFJvYVhNdVluVnBiR1FvS1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCcFppQW9kR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1WTJ4aGMzTk1hWE4wTG1OdmJuUmhhVzV6S0NkemFHOTNKeWtwSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUdaaGJITmxYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQzh2SUhKbGMyVjBJR052Ykc5eVhHNGdJQ0FnSUNCcFppQW9kR2hwY3k1dmNIUnBiMjV6TG1KaFkydG5jbTkxYm1RcElIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1Y21WdGIzWmxRWFIwY21saWRYUmxLQ2RqYkdGemN5Y3BYRzRnSUNBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG5ObGRFRjBkSEpwWW5WMFpTZ25ZMnhoYzNNbkxDQW5ibTkwYVdacFkyRjBhVzl1SnlsY2JseHVJQ0FnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVqYkdGemMweHBjM1F1WVdSa0tHQmlaeTBrZTNSb2FYTXViM0IwYVc5dWN5NWlZV05yWjNKdmRXNWtmV0FwWEc0Z0lDQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0lvSjJKMWRIUnZiaWNwTG1Oc1lYTnpUR2x6ZEM1aFpHUW9ZR0owYmkwa2UzUm9hWE11YjNCMGFXOXVjeTVpWVdOclozSnZkVzVrZldBcFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lHbG1JQ2gwYUdsekxtOXdkR2x2Ym5NdWMyaHZkMEoxZEhSdmJpa2dlMXh1SUNBZ0lDQWdJQ0F2THlCaGRIUmhZMmdnZEdobElHSjFkSFJ2YmlCb1lXNWtiR1Z5WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJR0oxZEhSdmJrVnNaVzFsYm5RZ1BTQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eUtDZGlkWFIwYjI0bktWeHVJQ0FnSUNBZ0lDQjBhR2x6TG5KbFoybHpkR1Z5Uld4bGJXVnVkQ2g3SUhSaGNtZGxkRG9nWW5WMGRHOXVSV3hsYldWdWRDd2daWFpsYm5RNklDZGpiR2xqYXljZ2ZTbGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdjMlYwVkdsdFpXOTFkQ2dvS1NBOVBpQjdYRzRnSUNBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1Oc1lYTnpUR2x6ZEM1aFpHUW9KM05vYjNjbktWeHVYRzRnSUNBZ0lDQWdJQzh2SUhObGRDQndiM05wZEdsdmJseHVJQ0FnSUNBZ0lDQmpiMjV6ZENCaFkzUnBkbVZPYjNScFptbGpZWFJwYjI1eklEMGdaRzlqZFcxbGJuUXVjWFZsY25sVFpXeGxZM1J2Y2tGc2JDZ25MbTV2ZEdsbWFXTmhkR2x2Ymk1emFHOTNKeWtnZkh3Z1cxMWNiaUFnSUNBZ0lDQWdiR1YwSUhCMWMyaEVhWE4wWVc1alpTQTlJREJjYmlBZ0lDQWdJQ0FnWVdOMGFYWmxUbTkwYVdacFkyRjBhVzl1Y3k1bWIzSkZZV05vS0NodWIzUnBabWxqWVhScGIyNHBJRDArSUh0Y2JpQWdJQ0FnSUNBZ0lDQnBaaUFvZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RZ0lUMDlJRzV2ZEdsbWFXTmhkR2x2YmlrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnWTI5dWMzUWdjM1I1YkdVZ1BTQm5aWFJEYjIxd2RYUmxaRk4wZVd4bEtHNXZkR2xtYVdOaGRHbHZiaWxjYmlBZ0lDQWdJQ0FnSUNBZ0lIQjFjMmhFYVhOMFlXNWpaU0FyUFNCdWIzUnBabWxqWVhScGIyNHViMlptYzJWMFNHVnBaMmgwSUNzZ2NHRnljMlZKYm5Rb2MzUjViR1V1YldGeVoybHVRbTkwZEc5dExDQXhNQ2xjYmlBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lIMHBYRzVjYmlBZ0lDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdWMzUjViR1V1ZEhKaGJuTm1iM0p0SUQwZ1lIUnlZVzV6YkdGMFpWa29KSHR3ZFhOb1JHbHpkR0Z1WTJWOWNIZ3BZRnh1WEc0Z0lDQWdJQ0FnSUhSb2FYTXVkSEpwWjJkbGNrVjJaVzUwS0VWMlpXNTBMbE5JVDFjcFhHNWNiaUFnSUNBZ0lDQWdZMjl1YzNRZ2IyNVRhRzkzYmlBOUlDZ3BJRDArSUh0Y2JpQWdJQ0FnSUNBZ0lDQjBhR2x6TG5SeWFXZG5aWEpGZG1WdWRDaEZkbVZ1ZEM1VFNFOVhUaWxjYmlBZ0lDQWdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNXlaVzF2ZG1WRmRtVnVkRXhwYzNSbGJtVnlLRVYyWlc1MExsUlNRVTVUU1ZSSlQwNWZSVTVFTENCdmJsTm9iM2R1S1Z4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1WVdSa1JYWmxiblJNYVhOMFpXNWxjaWhGZG1WdWRDNVVVa0ZPVTBsVVNVOU9YMFZPUkN3Z2IyNVRhRzkzYmlsY2JseHVJQ0FnSUNBZ2ZTd2dNU2xjYmx4dUlDQWdJQ0FnYVdZZ0tFNTFiV0psY2k1cGMwbHVkR1ZuWlhJb2RHaHBjeTV2Y0hScGIyNXpMblJwYldWdmRYUXBJQ1ltSUhSb2FYTXViM0IwYVc5dWN5NTBhVzFsYjNWMElENGdNQ2tnZTF4dUlDQWdJQ0FnSUNBdkx5QnBaaUIwYUdWeVpTQnBjeUJoSUhScGJXVnZkWFFzSUdGMWRHOGdhR2xrWlNCMGFHVWdibTkwYVdacFkyRjBhVzl1WEc0Z0lDQWdJQ0FnSUhSb2FYTXVkR2x0Wlc5MWRFTmhiR3hpWVdOcklEMGdjMlYwVkdsdFpXOTFkQ2dvS1NBOVBpQjdYRzRnSUNBZ0lDQWdJQ0FnZEdocGN5NW9hV1JsS0NsY2JpQWdJQ0FnSUNBZ2ZTd2dkR2hwY3k1dmNIUnBiMjV6TG5ScGJXVnZkWFFnS3lBeEtWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQnlaWFIxY200Z2RISjFaVnh1SUNBZ0lIMWNibHh1SUNBZ0lHaHBaR1VvS1NCN1hHNGdJQ0FnSUNBdktseHVJQ0FnSUNBZ0lDb2djSEpsZG1WdWRDQjBieUJqYkc5elpTQmhJRzV2ZEdsbWFXTmhkR2x2YmlCM2FYUm9JR0VnZEdsdFpXOTFkRnh1SUNBZ0lDQWdJQ29nYVdZZ2RHaGxJSFZ6WlhJZ2FHRnpJR0ZzY21WaFpIa2dZMnhwWTJ0bFpDQnZiaUIwYUdVZ1luVjBkRzl1WEc0Z0lDQWdJQ0FnS2k5Y2JpQWdJQ0FnSUdsbUlDaDBhR2x6TG5ScGJXVnZkWFJEWVd4c1ltRmpheWtnZTF4dUlDQWdJQ0FnSUNCamJHVmhjbFJwYldWdmRYUW9kR2hwY3k1MGFXMWxiM1YwUTJGc2JHSmhZMnNwWEc0Z0lDQWdJQ0FnSUhSb2FYTXVkR2x0Wlc5MWRFTmhiR3hpWVdOcklEMGdiblZzYkZ4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCcFppQW9JWFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1Oc1lYTnpUR2x6ZEM1amIyNTBZV2x1Y3lnbmMyaHZkeWNwS1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCbVlXeHpaVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0IwYUdsekxuUnlhV2RuWlhKRmRtVnVkQ2hGZG1WdWRDNUlTVVJGS1Z4dVhHNGdJQ0FnSUNCcFppQW9kR2hwY3k1dmNIUnBiMjV6TG5Ob2IzZENkWFIwYjI0cElIdGNiaUFnSUNBZ0lDQWdZMjl1YzNRZ1luVjBkRzl1Uld4bGJXVnVkQ0E5SUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0lvSjJKMWRIUnZiaWNwWEc0Z0lDQWdJQ0FnSUhSb2FYTXVkVzV5WldkcGMzUmxja1ZzWlcxbGJuUW9leUIwWVhKblpYUTZJR0oxZEhSdmJrVnNaVzFsYm5Rc0lHVjJaVzUwT2lBblkyeHBZMnNuSUgwcFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbU5zWVhOelRHbHpkQzV5WlcxdmRtVW9KM05vYjNjbktWeHVJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVZMnhoYzNOTWFYTjBMbUZrWkNnbmFHbGtaU2NwWEc1Y2JpQWdJQ0FnSUdOdmJuTjBJRzl1U0dsa1pHVnVJRDBnS0NrZ1BUNGdlMXh1SUNBZ0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1eVpXMXZkbVZGZG1WdWRFeHBjM1JsYm1WeUtFVjJaVzUwTGxSU1FVNVRTVlJKVDA1ZlJVNUVMQ0J2YmtocFpHUmxiaWxjYmlBZ0lDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdVkyeGhjM05NYVhOMExuSmxiVzkyWlNnbmFHbGtaU2NwWEc1Y2JpQWdJQ0FnSUNBZ2RHaHBjeTUwY21sbloyVnlSWFpsYm5Rb1JYWmxiblF1U0VsRVJFVk9LVnh1WEc0Z0lDQWdJQ0FnSUdsbUlDaDBhR2x6TG1SNWJtRnRhV05GYkdWdFpXNTBLU0I3WEc0Z0lDQWdJQ0FnSUNBZ1pHOWpkVzFsYm5RdVltOWtlUzV5WlcxdmRtVkRhR2xzWkNoMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDbGNiaUFnSUNBZ0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZENBOUlHNTFiR3hjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNWhaR1JGZG1WdWRFeHBjM1JsYm1WeUtFVjJaVzUwTGxSU1FVNVRTVlJKVDA1ZlJVNUVMQ0J2YmtocFpHUmxiaWxjYmx4dUlDQWdJQ0FnY21WMGRYSnVJSFJ5ZFdWY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J2YmtWc1pXMWxiblJGZG1WdWRDZ3BJSHRjYmlBZ0lDQWdJSFJvYVhNdWFHbGtaU2dwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdjM1JoZEdsaklGOUVUMDFKYm5SbGNtWmhZMlVvYjNCMGFXOXVjeWtnZTF4dUlDQWdJQ0FnY21WMGRYSnVJSE4xY0dWeUxsOUVUMDFKYm5SbGNtWmhZMlVvVG05MGFXWnBZMkYwYVc5dUxDQnZjSFJwYjI1ektWeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lISmxkSFZ5YmlCT2IzUnBabWxqWVhScGIyNWNibjBwS0NsY2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ1RtOTBhV1pwWTJGMGFXOXVYRzRpTENJdktpcGNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaUJNYVdObGJuTmxaQ0IxYm1SbGNpQk5TVlFnS0doMGRIQnpPaTh2WjJsMGFIVmlMbU52YlM5eGRXRnlheTFrWlhZdlVHaHZibTl1TFVaeVlXMWxkMjl5YXk5aWJHOWlMMjFoYzNSbGNpOU1TVU5GVGxORktWeHVJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQXFMMXh1YVcxd2IzSjBJRVYyWlc1MElHWnliMjBnSnk0dUx5NHVMMk52Y21VdlpYWmxiblJ6SjF4dWFXMXdiM0owSUVOdmJYQnZibVZ1ZENCbWNtOXRJQ2N1TGk5amIyMXdiMjVsYm5RblhHNXBiWEJ2Y25RZ2V5Qm5aWFJCZEhSeWFXSjFkR1Z6UTI5dVptbG5JSDBnWm5KdmJTQW5MaTR2WTI5dGNHOXVaVzUwVFdGdVlXZGxjaWRjYm1sdGNHOXlkQ0I3SUdacGJtUlVZWEpuWlhSQ2VVRjBkSElnZlNCbWNtOXRJQ2N1TGk4dUxpOWpiM0psTDNWMGFXeHpKMXh1WEc1amIyNXpkQ0JQWm1aRFlXNTJZWE1nUFNBb0tDa2dQVDRnZTF4dUlDQXZLaXBjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUlFTnZibk4wWVc1MGMxeHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ292WEc1Y2JpQWdZMjl1YzNRZ1RrRk5SU0E5SUNkdlptWXRZMkZ1ZG1GekoxeHVJQ0JqYjI1emRDQldSVkpUU1U5T0lEMGdKekl1TUM0d0oxeHVJQ0JqYjI1emRDQkNRVU5MUkZKUFVGOVRSVXhGUTFSUFVpQTlJQ2R2Wm1ZdFkyRnVkbUZ6TFdKaFkydGtjbTl3SjF4dUlDQmpiMjV6ZENCRVJVWkJWVXhVWDFCU1QxQkZVbFJKUlZNZ1BTQjdYRzRnSUNBZ1pXeGxiV1Z1ZERvZ2JuVnNiQ3hjYmlBZ0lDQmhjMmxrWlRvZ2UxeHVJQ0FnSUNBZ2JXUTZJR1poYkhObExGeHVJQ0FnSUNBZ2JHYzZJR1poYkhObExGeHVJQ0FnSUNBZ2VHdzZJR1poYkhObExGeHVJQ0FnSUgwc1hHNGdJSDFjYmlBZ1kyOXVjM1FnUkVGVVFWOUJWRlJTVTE5UVVrOVFSVkpVU1VWVElEMGdXMXh1SUNBZ0lDZGhjMmxrWlNjc1hHNGdJRjFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUlFTnNZWE56SUVSbFptbHVhWFJwYjI1Y2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFMMXh1WEc0Z0lHTnNZWE56SUU5bVprTmhiblpoY3lCbGVIUmxibVJ6SUVOdmJYQnZibVZ1ZENCN1hHNWNiaUFnSUNCamIyNXpkSEoxWTNSdmNpaHZjSFJwYjI1eklEMGdlMzBwSUh0Y2JpQWdJQ0FnSUhOMWNHVnlLRTVCVFVVc0lGWkZVbE5KVDA0c0lFUkZSa0ZWVEZSZlVGSlBVRVZTVkVsRlV5d2diM0IwYVc5dWN5d2dSRUZVUVY5QlZGUlNVMTlRVWs5UVJWSlVTVVZUTENCbVlXeHpaU3dnZEhKMVpTbGNibHh1SUNBZ0lDQWdkR2hwY3k1MWMyVkNZV05yWkhKdmNDQTlJSFJ5ZFdWY2JpQWdJQ0FnSUhSb2FYTXVZM1Z5Y21WdWRGZHBaSFJvSUQwZ2JuVnNiRnh1SUNBZ0lDQWdkR2hwY3k1aGJtbHRZWFJsSUQwZ2RISjFaVnh1WEc0Z0lDQWdJQ0JqYjI1emRDQnpiU0E5SUhzZ2JtRnRaVG9nSjNOdEp5d2diV1ZrYVdFNklIZHBibVJ2ZHk1dFlYUmphRTFsWkdsaEtDY29iV2x1TFhkcFpIUm9PaUF4Y0hncEp5a2dmVnh1SUNBZ0lDQWdZMjl1YzNRZ2JXUWdQU0I3SUc1aGJXVTZJQ2R0WkNjc0lHMWxaR2xoT2lCM2FXNWtiM2N1YldGMFkyaE5aV1JwWVNnbktHMXBiaTEzYVdSMGFEb2dOelk0Y0hncEp5a2dmVnh1SUNBZ0lDQWdZMjl1YzNRZ2JHY2dQU0I3SUc1aGJXVTZJQ2RzWnljc0lHMWxaR2xoT2lCM2FXNWtiM2N1YldGMFkyaE5aV1JwWVNnbktHMXBiaTEzYVdSMGFEb2dPVGt5Y0hncEp5a2dmVnh1SUNBZ0lDQWdZMjl1YzNRZ2VHd2dQU0I3SUc1aGJXVTZJQ2Q0YkNjc0lHMWxaR2xoT2lCM2FXNWtiM2N1YldGMFkyaE5aV1JwWVNnbktHMXBiaTEzYVdSMGFEb2dNVEl3TUhCNEtTY3BJSDFjYmx4dUlDQWdJQ0FnWTI5dWMzUWdjMmw2WlhNZ1BTQmJjMjBzSUcxa0xDQnNaeXdnZUd4ZExuSmxkbVZ5YzJVb0tWeHVYRzRnSUNBZ0lDQmpiMjV6ZENCamFHVmphMWRwWkhSb0lEMGdLQ2tnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQnBaaUFvSVNnbmJXRjBZMmhOWldScFlTY2dhVzRnZDJsdVpHOTNLU2tnZTF4dUlDQWdJQ0FnSUNBZ0lISmxkSFZ5Ymx4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdjMmw2WlhNdVpYWmxjbmtvS0hOcGVtVXBJRDArSUh0Y2JpQWdJQ0FnSUNBZ0lDQmpiMjV6ZENCdFlYUmphQ0E5SUhOcGVtVXViV1ZrYVdFdWJXVmthV0V1YldGMFkyZ29MMXRoTFhwZFB5MTNhV1IwYURwY1hITS9LRnN3TFRsZEt5a3ZLVnh1WEc0Z0lDQWdJQ0FnSUNBZ2FXWWdLRzFoZEdOb0tTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCcFppQW9jMmw2WlM1dFpXUnBZUzV0WVhSamFHVnpLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJR2xtSUNoMGFHbHpMbU4xY25KbGJuUlhhV1IwYUNBaFBUMGdjMmw2WlM1dVlXMWxLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZEdocGN5NXpaWFJCYzJsa1pTaHphWHBsTG01aGJXVXBYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ2RHaHBjeTVqZFhKeVpXNTBWMmxrZEdnZ1BTQnphWHBsTG01aGJXVmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUdaaGJITmxYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUhSeWRXVmNiaUFnSUNBZ0lDQWdmU2xjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnWTJobFkydFhhV1IwYUNncFhHNWNiaUFnSUNBZ0lIZHBibVJ2ZHk1aFpHUkZkbVZ1ZEV4cGMzUmxibVZ5S0NkeVpYTnBlbVVuTENCamFHVmphMWRwWkhSb0xDQm1ZV3h6WlNrZ0lDQWdJQ0JjYmlBZ0lDQjlYRzVjYmlBZ0lDQndjbVYyWlc1MFEyeHZjMkZpYkdVb0tTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z2MzVndaWEl1Y0hKbGRtVnVkRU5zYjNOaFlteGxLQ2tnZkh3Z2RHaHBjeTV2Y0hScGIyNXpMbUZ6YVdSbFczUm9hWE11WTNWeWNtVnVkRmRwWkhSb1hTQTlQVDBnZEhKMVpWeHVJQ0FnSUgxY2JseHVJQ0FnSUhObGRFRnphV1JsS0c1aGJXVXBJSHRjYmlBZ0lDQWdJR052Ym5OMElHTnZiblJsYm5RZ1BTQmtiMk4xYldWdWRDNWliMlI1WEc1Y2JpQWdJQ0FnSUdsbUlDaDBhR2x6TG05d2RHbHZibk11WVhOcFpHVmJibUZ0WlYwZ1BUMDlJSFJ5ZFdVcElIdGNiaUFnSUNBZ0lDQWdhV1lnS0NGamIyNTBaVzUwTG1Oc1lYTnpUR2x6ZEM1amIyNTBZV2x1Y3lnbmIyWm1MV05oYm5aaGN5MWhjMmxrWlNjcEtTQjdYRzRnSUNBZ0lDQWdJQ0FnWTI5dWRHVnVkQzVqYkdGemMweHBjM1F1WVdSa0tDZHZabVl0WTJGdWRtRnpMV0Z6YVdSbEp5bGNiaUFnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUhSb2FYTXVkWE5sUW1GamEyUnliM0FnUFNCbVlXeHpaVnh1WEc0Z0lDQWdJQ0FnSUM4dklHRjJiMmxrSUdGdWFXMWhkR2x2YmlCaWVTQnpaWFIwYVc1bklHRnVhVzFoZEdVZ2RHOGdabUZzYzJWY2JpQWdJQ0FnSUNBZ2RHaHBjeTVoYm1sdFlYUmxJRDBnWm1Gc2MyVmNiaUFnSUNBZ0lDQWdkR2hwY3k1emFHOTNLQ2xjYmlBZ0lDQWdJQ0FnTHk4Z2NtVnRiM1psSUhCeVpYWnBiM1Z6SUdKaFkydGtjbTl3WEc0Z0lDQWdJQ0FnSUhSb2FYTXVjbVZ0YjNabFFtRmphMlJ5YjNBb0tWeHVJQ0FnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUNBZ2FXWWdLR052Ym5SbGJuUXVZMnhoYzNOTWFYTjBMbU52Ym5SaGFXNXpLQ2R2Wm1ZdFkyRnVkbUZ6TFdGemFXUmxKeWtwSUh0Y2JpQWdJQ0FnSUNBZ0lDQmpiMjUwWlc1MExtTnNZWE56VEdsemRDNXlaVzF2ZG1Vb0oyOW1aaTFqWVc1MllYTXRZWE5wWkdVbktWeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnZEdocGN5NW9hV1JsS0NsY2JpQWdJQ0FnSUNBZ2RHaHBjeTUxYzJWQ1lXTnJaSEp2Y0NBOUlIUnlkV1ZjYmlBZ0lDQWdJQ0FnZEdocGN5NWhibWx0WVhSbElEMGdkSEoxWlZ4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmx4dUlDQWdJRzl1Uld4bGJXVnVkRVYyWlc1MEtHVjJaVzUwS1NCN1hHNGdJQ0FnSUNCcFppQW9aWFpsYm5RdWRIbHdaU0E5UFQwZ0oydGxlWFZ3SnlBbUppQmxkbVZ1ZEM1clpYbERiMlJsSUNFOVBTQXlOeUFtSmlCbGRtVnVkQzVyWlhsRGIyUmxJQ0U5UFNBeE15a2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNWNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdMeThnYUdsa1pTQjBhR1VnYjJabUxXTmhiblpoYzF4dUlDQWdJQ0FnZEdocGN5NW9hV1JsS0NsY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J6YUc5M0tDa2dlMXh1SUNBZ0lDQWdhV1lnS0hSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExtTnNZWE56VEdsemRDNWpiMjUwWVdsdWN5Z25jMmh2ZHljcEtTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQm1ZV3h6WlZ4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBdkx5QmhaR1FnWVNCMGFXMWxiM1YwSUhOdklIUm9ZWFFnZEdobElFTlRVeUJoYm1sdFlYUnBiMjRnZDI5eWEzTmNiaUFnSUNBZ0lITmxkRlJwYldWdmRYUW9LQ2tnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TG5SeWFXZG5aWEpGZG1WdWRDaEZkbVZ1ZEM1VFNFOVhLVnh1WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJRzl1VTJodmQyNGdQU0FvS1NBOVBpQjdYRzRnSUNBZ0lDQWdJQ0FnZEdocGN5NTBjbWxuWjJWeVJYWmxiblFvUlhabGJuUXVVMGhQVjA0cFhHNWNiaUFnSUNBZ0lDQWdJQ0JwWmlBb2RHaHBjeTVoYm1sdFlYUmxLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzV5WlcxdmRtVkZkbVZ1ZEV4cGMzUmxibVZ5S0VWMlpXNTBMbFJTUVU1VFNWUkpUMDVmUlU1RUxDQnZibE5vYjNkdUtWeHVJQ0FnSUNBZ0lDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdVkyeGhjM05NYVhOMExuSmxiVzkyWlNnbllXNXBiV0YwWlNjcFhHNGdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ2FXWWdLSFJvYVhNdWRYTmxRbUZqYTJSeWIzQXBJSHRjYmlBZ0lDQWdJQ0FnSUNCMGFHbHpMbU55WldGMFpVSmhZMnRrY205d0tDbGNiaUFnSUNBZ0lDQWdmVnh1WEc1Y2JpQWdJQ0FnSUNBZ2FXWWdLSFJvYVhNdVlXNXBiV0YwWlNrZ2UxeHVJQ0FnSUNBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1Ga1pFVjJaVzUwVEdsemRHVnVaWElvUlhabGJuUXVWRkpCVGxOSlZFbFBUbDlGVGtRc0lHOXVVMmh2ZDI0cElDQWdJQ0FnSUNCY2JpQWdJQ0FnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVqYkdGemMweHBjM1F1WVdSa0tDZGhibWx0WVhSbEp5bGNiaUFnSUNBZ0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDQWdJQ0F2THlCa2FYSmxZM1JzZVNCMGNtbG5aMlZ5SUhSb1pTQnZibE5vYjNkdVhHNGdJQ0FnSUNBZ0lDQWdiMjVUYUc5M2JpZ3BYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNWpiR0Z6YzB4cGMzUXVZV1JrS0NkemFHOTNKeWtnSUNBZ0lDQWdJRnh1WEc0Z0lDQWdJQ0FnSUM4dklHRjBkR0ZqYUNCbGRtVnVkRnh1SUNBZ0lDQWdJQ0IwYUdsekxtRjBkR0ZqYUVWMlpXNTBjeWdwWEc0Z0lDQWdJQ0I5TENBeEtWeHVYRzRnSUNBZ0lDQnlaWFIxY200Z2RISjFaVnh1SUNBZ0lIMWNibHh1SUNBZ0lHaHBaR1VvS1NCN1hHNGdJQ0FnSUNCcFppQW9JWFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1Oc1lYTnpUR2x6ZEM1amIyNTBZV2x1Y3lnbmMyaHZkeWNwS1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCbVlXeHpaVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0IwYUdsekxuUnlhV2RuWlhKRmRtVnVkQ2hGZG1WdWRDNUlTVVJGS1Z4dVhHNGdJQ0FnSUNCMGFHbHpMbVJsZEdGamFFVjJaVzUwY3lncFhHNWNiaUFnSUNBZ0lHbG1JQ2gwYUdsekxtRnVhVzFoZEdVcElIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1WTJ4aGMzTk1hWE4wTG1Ga1pDZ25ZVzVwYldGMFpTY3BYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvSjNOb2IzY25LVnh1WEc0Z0lDQWdJQ0JwWmlBb2RHaHBjeTUxYzJWQ1lXTnJaSEp2Y0NrZ2UxeHVJQ0FnSUNBZ0lDQmpiMjV6ZENCaVlXTnJaSEp2Y0NBOUlIUm9hWE11WjJWMFFtRmphMlJ5YjNBb0tWeHVYRzRnSUNBZ0lDQWdJR052Ym5OMElHOXVTR2xrWkdWdUlEMGdLQ2tnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQWdJR2xtSUNoMGFHbHpMbUZ1YVcxaGRHVXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbU5zWVhOelRHbHpkQzV5WlcxdmRtVW9KMkZ1YVcxaGRHVW5LVnh1SUNBZ0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQWdJR0poWTJ0a2NtOXdMbkpsYlc5MlpVVjJaVzUwVEdsemRHVnVaWElvUlhabGJuUXVWRkpCVGxOSlZFbFBUbDlGVGtRc0lHOXVTR2xrWkdWdUtWeHVJQ0FnSUNBZ0lDQWdJSFJvYVhNdWRISnBaMmRsY2tWMlpXNTBLRVYyWlc1MExraEpSRVJGVGlrZ0lDQWdJQ0FnSUZ4dUlDQWdJQ0FnSUNBZ0lIUm9hWE11Y21WdGIzWmxRbUZqYTJSeWIzQW9LVnh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ1ltRmphMlJ5YjNBdVlXUmtSWFpsYm5STWFYTjBaVzVsY2loRmRtVnVkQzVVVWtGT1UwbFVTVTlPWDBWT1JDd2diMjVJYVdSa1pXNHBYRzRnSUNBZ0lDQWdJR0poWTJ0a2NtOXdMbU5zWVhOelRHbHpkQzVoWkdRb0oyWmhaR1Z2ZFhRbktWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQnlaWFIxY200Z2RISjFaVnh1SUNBZ0lIMWNibHh1SUNBZ0lHTnlaV0YwWlVKaFkydGtjbTl3S0NrZ2UxeHVJQ0FnSUNBZ1kyOXVjM1FnWW1GamEyUnliM0FnUFNCa2IyTjFiV1Z1ZEM1amNtVmhkR1ZGYkdWdFpXNTBLQ2RrYVhZbktWeHVJQ0FnSUNBZ1ltRmphMlJ5YjNBdWMyVjBRWFIwY21saWRYUmxLQ2RrWVhSaExXbGtKeXdnZEdocGN5NXBaQ2xjYmlBZ0lDQWdJR0poWTJ0a2NtOXdMbU5zWVhOelRHbHpkQzVoWkdRb1FrRkRTMFJTVDFCZlUwVk1SVU5VVDFJcFhHNWNiaUFnSUNBZ0lHUnZZM1Z0Wlc1MExtSnZaSGt1WVhCd1pXNWtRMmhwYkdRb1ltRmphMlJ5YjNBcFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnWjJWMFFtRmphMlJ5YjNBb0tTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z1pHOWpkVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZjaWhnTGlSN1FrRkRTMFJTVDFCZlUwVk1SVU5VVDFKOVcyUmhkR0V0YVdROVhDSWtlM1JvYVhNdWFXUjlYQ0pkWUNsY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J5WlcxdmRtVkNZV05yWkhKdmNDZ3BJSHRjYmlBZ0lDQWdJR052Ym5OMElHSmhZMnRrY205d0lEMGdkR2hwY3k1blpYUkNZV05yWkhKdmNDZ3BYRzRnSUNBZ0lDQnBaaUFvWW1GamEyUnliM0FwSUh0Y2JpQWdJQ0FnSUNBZ1pHOWpkVzFsYm5RdVltOWtlUzV5WlcxdmRtVkRhR2xzWkNoaVlXTnJaSEp2Y0NsY2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc1Y2JpQWdJQ0JoZEhSaFkyaEZkbVZ1ZEhNb0tTQjdYRzRnSUNBZ0lDQmpiMjV6ZENCa2FYTnRhWE56UW5WMGRHOXVjeUE5SUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0pCYkd3b0oxdGtZWFJoTFdScGMyMXBjM05kSnlsY2JseHVJQ0FnSUNBZ2FXWWdLR1JwYzIxcGMzTkNkWFIwYjI1ektTQjdYRzRnSUNBZ0lDQWdJR1JwYzIxcGMzTkNkWFIwYjI1ekxtWnZja1ZoWTJnb1luVjBkRzl1SUQwK0lIUm9hWE11Y21WbmFYTjBaWEpGYkdWdFpXNTBLSHNnZEdGeVoyVjBPaUJpZFhSMGIyNHNJR1YyWlc1ME9pQW5ZMnhwWTJzbklIMHBLVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0JwWmlBb2RHaHBjeTUxYzJWQ1lXTnJaSEp2Y0NrZ2UxeHVJQ0FnSUNBZ0lDQmpiMjV6ZENCaVlXTnJaSEp2Y0NBOUlIUm9hWE11WjJWMFFtRmphMlJ5YjNBb0tTQWdJQ0FnSUZ4dUlDQWdJQ0FnSUNCMGFHbHpMbkpsWjJsemRHVnlSV3hsYldWdWRDaDdJSFJoY21kbGREb2dZbUZqYTJSeWIzQXNJR1YyWlc1ME9pQkZkbVZ1ZEM1VFZFRlNWQ0I5S1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCMGFHbHpMbkpsWjJsemRHVnlSV3hsYldWdWRDaDdJSFJoY21kbGREb2daRzlqZFcxbGJuUXNJR1YyWlc1ME9pQW5hMlY1ZFhBbklIMHBYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1pHVjBZV05vUlhabGJuUnpLQ2tnZTF4dUlDQWdJQ0FnWTI5dWMzUWdaR2x6YldsemMwSjFkSFJ2Ym5NZ1BTQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eVFXeHNLQ2RiWkdGMFlTMWthWE50YVhOelhTY3BYRzVjYmlBZ0lDQWdJR2xtSUNoa2FYTnRhWE56UW5WMGRHOXVjeWtnZTF4dUlDQWdJQ0FnSUNCa2FYTnRhWE56UW5WMGRHOXVjeTVtYjNKRllXTm9LR0oxZEhSdmJpQTlQaUIwYUdsekxuVnVjbVZuYVhOMFpYSkZiR1Z0Wlc1MEtIc2dkR0Z5WjJWME9pQmlkWFIwYjI0c0lHVjJaVzUwT2lBblkyeHBZMnNuSUgwcEtWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQnBaaUFvZEdocGN5NTFjMlZDWVdOclpISnZjQ2tnZTF4dUlDQWdJQ0FnSUNCamIyNXpkQ0JpWVdOclpISnZjQ0E5SUhSb2FYTXVaMlYwUW1GamEyUnliM0FvS1Z4dUlDQWdJQ0FnSUNCMGFHbHpMblZ1Y21WbmFYTjBaWEpGYkdWdFpXNTBLSHNnZEdGeVoyVjBPaUJpWVdOclpISnZjQ3dnWlhabGJuUTZJRVYyWlc1MExsTlVRVkpVSUgwcFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lIUm9hWE11ZFc1eVpXZHBjM1JsY2tWc1pXMWxiblFvZXlCMFlYSm5aWFE2SUdSdlkzVnRaVzUwTENCbGRtVnVkRG9nSjJ0bGVYVndKeUI5S1Z4dUlDQWdJSDFjYmx4dUlDQWdJSE4wWVhScFl5QmZSRTlOU1c1MFpYSm1ZV05sS0c5d2RHbHZibk1wSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJ6ZFhCbGNpNWZSRTlOU1c1MFpYSm1ZV05sS0U5bVprTmhiblpoY3l3Z2IzQjBhVzl1Y3lsY2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxSUVSUFRTQkJjR2tnYVcxd2JHVnRaVzUwWVhScGIyNWNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxTDF4dUlDQmpiMjV6ZENCamIyMXdiMjVsYm5SeklEMGdXMTFjYmx4dUlDQmpiMjV6ZENCdlptWkRZVzUyWVhNZ1BTQmtiMk4xYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5UVd4c0tHQXVKSHRPUVUxRmZXQXBYRzRnSUdsbUlDaHZabVpEWVc1MllYTXBJSHRjYmlBZ0lDQnZabVpEWVc1MllYTXVabTl5UldGamFDZ29aV3hsYldWdWRDa2dQVDRnZTF4dUlDQWdJQ0FnWTI5dWMzUWdZMjl1Wm1sbklEMGdaMlYwUVhSMGNtbGlkWFJsYzBOdmJtWnBaeWhsYkdWdFpXNTBMQ0JFUlVaQlZVeFVYMUJTVDFCRlVsUkpSVk1zSUVSQlZFRmZRVlJVVWxOZlVGSlBVRVZTVkVsRlV5bGNiaUFnSUNBZ0lHTnZibVpwWnk1bGJHVnRaVzUwSUQwZ1pXeGxiV1Z1ZEZ4dVhHNGdJQ0FnSUNCamIyMXdiMjVsYm5SekxuQjFjMmdvZXlCbGJHVnRaVzUwTENCdlptWkRZVzUyWVhNNklHNWxkeUJQWm1aRFlXNTJZWE1vWTI5dVptbG5LU0I5S1Z4dUlDQWdJSDBwWEc0Z0lIMWNibHh1SUNCcFppQW9iMlptUTJGdWRtRnpLU0I3WEc0Z0lDQWdaRzlqZFcxbGJuUXVZV1JrUlhabGJuUk1hWE4wWlc1bGNpZ25ZMnhwWTJzbkxDQW9aWFpsYm5RcElEMCtJSHRjYmlBZ0lDQWdJR052Ym5OMElIUmhjbWRsZENBOUlHWnBibVJVWVhKblpYUkNlVUYwZEhJb1pYWmxiblF1ZEdGeVoyVjBMQ0FuWkdGMFlTMTBiMmRuYkdVbktWeHVJQ0FnSUNBZ2FXWWdLQ0YwWVhKblpYUXBJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR052Ym5OMElHUmhkR0ZVYjJkbmJHVkJkSFJ5SUQwZ2RHRnlaMlYwTG1kbGRFRjBkSEpwWW5WMFpTZ25aR0YwWVMxMGIyZG5iR1VuS1Z4dUlDQWdJQ0FnYVdZZ0tHUmhkR0ZVYjJkbmJHVkJkSFJ5SUNZbUlHUmhkR0ZVYjJkbmJHVkJkSFJ5SUQwOVBTQk9RVTFGS1NCN1hHNGdJQ0FnSUNBZ0lHTnZibk4wSUdsa0lEMGdkR0Z5WjJWMExtZGxkRUYwZEhKcFluVjBaU2duWkdGMFlTMTBZWEpuWlhRbktWeHVJQ0FnSUNBZ0lDQmpiMjV6ZENCbGJHVnRaVzUwSUQwZ1pHOWpkVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZjaWhwWkNsY2JseHVJQ0FnSUNBZ0lDQmpiMjV6ZENCamIyMXdiMjVsYm5RZ1BTQmpiMjF3YjI1bGJuUnpMbVpwYm1Rb1l5QTlQaUJqTG1Wc1pXMWxiblFnUFQwOUlHVnNaVzFsYm5RcFhHNWNiaUFnSUNBZ0lDQWdhV1lnS0NGamIyMXdiMjVsYm5RcElIdGNiaUFnSUNBZ0lDQWdJQ0J5WlhSMWNtNWNiaUFnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUhSaGNtZGxkQzVpYkhWeUtDbGNibHh1SUNBZ0lDQWdJQ0JqYjIxd2IyNWxiblF1YjJabVEyRnVkbUZ6TG5Ob2IzY29LVnh1SUNBZ0lDQWdmVnh1SUNBZ0lIMHBYRzRnSUgxY2JseHVJQ0J5WlhSMWNtNGdUMlptUTJGdWRtRnpYRzU5S1NncFhHNWNibVY0Y0c5eWRDQmtaV1poZFd4MElFOW1aa05oYm5aaGMxeHVJaXdpTHlvcVhHNGdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDb2dUR2xqWlc1elpXUWdkVzVrWlhJZ1RVbFVJQ2hvZEhSd2N6b3ZMMmRwZEdoMVlpNWpiMjB2Y1hWaGNtc3RaR1YyTDFCb2IyNXZiaTFHY21GdFpYZHZjbXN2WW14dllpOXRZWE4wWlhJdlRFbERSVTVUUlNsY2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0tpOWNibWx0Y0c5eWRDQkRiMjF3YjI1bGJuUWdabkp2YlNBbkxpNHZZMjl0Y0c5dVpXNTBKMXh1YVcxd2IzSjBJRVYyWlc1MElHWnliMjBnSnk0dUx5NHVMMk52Y21VdlpYWmxiblJ6SjF4dVhHNWpiMjV6ZENCUWNtOW5jbVZ6Y3lBOUlDZ29LU0E5UGlCN1hHNGdJQzhxS2x4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb2dRMjl1YzNSaGJuUnpYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2k5Y2JseHVJQ0JqYjI1emRDQk9RVTFGSUQwZ0ozQnliMmR5WlhOekoxeHVJQ0JqYjI1emRDQldSVkpUU1U5T0lEMGdKekl1TUM0d0oxeHVJQ0JqYjI1emRDQkVSVVpCVlV4VVgxQlNUMUJGVWxSSlJWTWdQU0I3WEc0Z0lDQWdaV3hsYldWdWREb2diblZzYkN4Y2JpQWdJQ0JvWldsbmFIUTZJRFVzWEc0Z0lDQWdiV2x1T2lBd0xGeHVJQ0FnSUcxaGVEb2dNVEF3TEZ4dUlDQWdJR3hoWW1Wc09pQm1ZV3h6WlN4Y2JpQWdJQ0J6ZEhKcGNHVmtPaUJtWVd4elpTeGNiaUFnSUNCaVlXTnJaM0p2ZFc1a09pQnVkV3hzTEZ4dUlDQjlYRzRnSUdOdmJuTjBJRVJCVkVGZlFWUlVVbE5mVUZKUFVFVlNWRWxGVXlBOUlGdGNiaUFnSUNBbmFHVnBaMmgwSnl4Y2JpQWdJQ0FuYldsdUp5eGNiaUFnSUNBbmJXRjRKeXhjYmlBZ0lDQW5iR0ZpWld3bkxGeHVJQ0FnSUNkemRISnBjR1ZrSnl4Y2JpQWdJQ0FuWW1GamEyZHliM1Z1WkNjc1hHNGdJRjFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUlFTnNZWE56SUVSbFptbHVhWFJwYjI1Y2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFMMXh1WEc0Z0lHTnNZWE56SUZCeWIyZHlaWE56SUdWNGRHVnVaSE1nUTI5dGNHOXVaVzUwSUh0Y2JseHVJQ0FnSUdOdmJuTjBjblZqZEc5eUtHOXdkR2x2Ym5NZ1BTQjdmU2tnZTF4dUlDQWdJQ0FnYzNWd1pYSW9Ua0ZOUlN3Z1ZrVlNVMGxQVGl3Z1JFVkdRVlZNVkY5UVVrOVFSVkpVU1VWVExDQnZjSFJwYjI1ekxDQkVRVlJCWDBGVVZGSlRYMUJTVDFCRlVsUkpSVk1zSUdaaGJITmxMQ0JtWVd4elpTbGNibHh1SUNBZ0lDQWdMeThnYzJWMElIUm9aU0IzWVc1MFpXUWdhR1ZwWjJoMFhHNGdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNXpkSGxzWlM1b1pXbG5hSFFnUFNCZ0pIdDBhR2x6TG05d2RHbHZibk11YUdWcFoyaDBmWEI0WUZ4dVhHNGdJQ0FnSUNBdkx5QnpaWFFnYldsdUlHRnVaQ0J0WVhnZ2RtRnNkV1Z6WEc0Z0lDQWdJQ0JqYjI1emRDQndjbTluY21WemMwSmhjaUE5SUhSb2FYTXVaMlYwVUhKdlozSmxjM05DWVhJb0tWeHVJQ0FnSUNBZ2NISnZaM0psYzNOQ1lYSXVjMlYwUVhSMGNtbGlkWFJsS0NkaGNtbGhMWFpoYkhWbGJXbHVKeXdnWUNSN2RHaHBjeTV2Y0hScGIyNXpMbTFwYm4xZ0tWeHVJQ0FnSUNBZ2NISnZaM0psYzNOQ1lYSXVjMlYwUVhSMGNtbGlkWFJsS0NkaGNtbGhMWFpoYkhWbGJXRjRKeXdnWUNSN2RHaHBjeTV2Y0hScGIyNXpMbTFoZUgxZ0tWeHVYRzRnSUNBZ0lDQXZMeUJ6WlhRZ2MzUnlhWEJsWkZ4dUlDQWdJQ0FnYVdZZ0tIUm9hWE11YjNCMGFXOXVjeTV6ZEhKcGNHVmtYRzRnSUNBZ0lDQWdJQ1ltSUNGd2NtOW5jbVZ6YzBKaGNpNWpiR0Z6YzB4cGMzUXVZMjl1ZEdGcGJuTW9KM0J5YjJkeVpYTnpMV0poY2kxemRISnBjR1ZrSnlrcElIdGNiaUFnSUNBZ0lDQWdjSEp2WjNKbGMzTkNZWEl1WTJ4aGMzTk1hWE4wTG1Ga1pDZ25jSEp2WjNKbGMzTXRZbUZ5TFhOMGNtbHdaV1FuS1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBdkx5QnpaWFFnWW1GamEyZHliM1Z1WkZ4dUlDQWdJQ0FnYVdZZ0tIUjVjR1Z2WmlCMGFHbHpMbTl3ZEdsdmJuTXVZbUZqYTJkeWIzVnVaQ0E5UFQwZ0ozTjBjbWx1WnlkY2JpQWdJQ0FnSUNBZ0ppWWdJWEJ5YjJkeVpYTnpRbUZ5TG1Oc1lYTnpUR2x6ZEM1amIyNTBZV2x1Y3loZ1ltY3RKSHQwYUdsekxtOXdkR2x2Ym5NdVltRmphMmR5YjNWdVpIMWdLU2tnZTF4dUlDQWdJQ0FnSUNCd2NtOW5jbVZ6YzBKaGNpNWpiR0Z6YzB4cGMzUXVZV1JrS0dCaVp5MGtlM1JvYVhNdWIzQjBhVzl1Y3k1aVlXTnJaM0p2ZFc1a2ZXQXBYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1oyVjBVSEp2WjNKbGMzTkNZWElvS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZjaWduTG5CeWIyZHlaWE56TFdKaGNpY3BYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MyVjBLSFpoYkhWbElEMGdNQ2tnZTF4dUlDQWdJQ0FnWTI5dWMzUWdjSEp2WjNKbGMzTkNZWElnUFNCMGFHbHpMbWRsZEZCeWIyZHlaWE56UW1GeUtDbGNiaUFnSUNBZ0lHTnZibk4wSUhCeWIyZHlaWE56SUQwZ1RXRjBhQzV5YjNWdVpDZ29kbUZzZFdVZ0x5QW9kR2hwY3k1dmNIUnBiMjV6TG0xcGJpQXJJSFJvYVhNdWIzQjBhVzl1Y3k1dFlYZ3BLU0FxSURFd01DbGNibHh1SUNBZ0lDQWdhV1lnS0haaGJIVmxJRHdnZEdocGN5NXZjSFJwYjI1ekxtMXBiaWtnZTF4dUlDQWdJQ0FnSUNCamIyNXpiMnhsTG1WeWNtOXlLR0FrZTA1QlRVVjlMaUJYWVhKdWFXNW5MQ0FrZTNaaGJIVmxmU0JwY3lCMWJtUmxjaUJ0YVc0Z2RtRnNkV1V1WUNsY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUdaaGJITmxYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR2xtSUNoMllXeDFaU0ErSUhSb2FYTXViM0IwYVc5dWN5NXRZWGdwSUh0Y2JpQWdJQ0FnSUNBZ1kyOXVjMjlzWlM1bGNuSnZjaWhnSkh0T1FVMUZmUzRnVjJGeWJtbHVaeXdnSkh0MllXeDFaWDBnYVhNZ1lXSnZkbVVnYldGNElIWmhiSFZsTG1BcElDQWdJQ0FnSUNBZ0lGeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z1ptRnNjMlZjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnY0hKdlozSmxjM05DWVhJdWMyVjBRWFIwY21saWRYUmxLQ2RoY21saExYWmhiSFZsYm05M0p5d2dZQ1I3ZG1Gc2RXVjlZQ2tnSUNBZ0lDQmNibHh1SUNBZ0lDQWdMeThnYzJWMElHeGhZbVZzWEc0Z0lDQWdJQ0JwWmlBb2RHaHBjeTV2Y0hScGIyNXpMbXhoWW1Wc0tTQjdYRzRnSUNBZ0lDQWdJSEJ5YjJkeVpYTnpRbUZ5TG1sdWJtVnlTRlJOVENBOUlHQWtlM0J5YjJkeVpYTnpmU1ZnWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUM4dklITmxkQ0J3WlhKalpXNTBZV2RsWEc0Z0lDQWdJQ0J3Y205bmNtVnpjMEpoY2k1emRIbHNaUzUzYVdSMGFDQTlJR0FrZTNCeWIyZHlaWE56ZlNWZ1hHNWNiaUFnSUNBZ0lISmxkSFZ5YmlCMGNuVmxYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1lXNXBiV0YwWlNoemRHRnlkRUZ1YVcxaGRHbHZiaUE5SUhSeWRXVXBJSHRjYmlBZ0lDQWdJR2xtSUNnaGRHaHBjeTV2Y0hScGIyNXpMbk4wY21sd1pXUXBJSHRjYmlBZ0lDQWdJQ0FnWTI5dWMyOXNaUzVsY25KdmNpaGdKSHRPUVUxRmZTNGdRVzVwYldGMGFXOXVJSGR2Y210eklHOXViSGtnZDJsMGFDQnpkSEpwY0dWa0lIQnliMmR5WlhOekxtQXBYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQm1ZV3h6WlZ4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCamIyNXpkQ0J3Y205bmNtVnpjMEpoY2lBOUlIUm9hWE11WjJWMFVISnZaM0psYzNOQ1lYSW9LVnh1WEc0Z0lDQWdJQ0JwWmlBb2MzUmhjblJCYm1sdFlYUnBiMjVjYmlBZ0lDQWdJQ0FnSmlZZ0lYQnliMmR5WlhOelFtRnlMbU5zWVhOelRHbHpkQzVqYjI1MFlXbHVjeWduY0hKdlozSmxjM010WW1GeUxXRnVhVzFoZEdWa0p5a3BJSHRjYmlBZ0lDQWdJQ0FnY0hKdlozSmxjM05DWVhJdVkyeGhjM05NYVhOMExtRmtaQ2duY0hKdlozSmxjM010WW1GeUxXRnVhVzFoZEdWa0p5bGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdhV1lnS0NGemRHRnlkRUZ1YVcxaGRHbHZibHh1SUNBZ0lDQWdJQ0FtSmlCd2NtOW5jbVZ6YzBKaGNpNWpiR0Z6YzB4cGMzUXVZMjl1ZEdGcGJuTW9KM0J5YjJkeVpYTnpMV0poY2kxaGJtbHRZWFJsWkNjcEtTQjdYRzRnSUNBZ0lDQWdJSEJ5YjJkeVpYTnpRbUZ5TG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvSjNCeWIyZHlaWE56TFdKaGNpMWhibWx0WVhSbFpDY3BYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSEpsZEhWeWJpQjBjblZsWEc0Z0lDQWdmVnh1WEc0Z0lDQWdjMmh2ZHlncElIdGNiaUFnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbk4wZVd4bExtaGxhV2RvZENBOUlHQWtlM1JvYVhNdWIzQjBhVzl1Y3k1b1pXbG5hSFI5Y0hoZ1hHNGdJQ0FnSUNCMGFHbHpMblJ5YVdkblpYSkZkbVZ1ZENoRmRtVnVkQzVUU0U5WEtWeHVJQ0FnSUNBZ2RHaHBjeTUwY21sbloyVnlSWFpsYm5Rb1JYWmxiblF1VTBoUFYwNHBYRzVjYmlBZ0lDQWdJSEpsZEhWeWJpQjBjblZsWEc0Z0lDQWdmVnh1WEc0Z0lDQWdhR2xrWlNncElIdGNiaUFnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbk4wZVd4bExtaGxhV2RvZENBOUlDY3djSGduWEc0Z0lDQWdJQ0IwYUdsekxuUnlhV2RuWlhKRmRtVnVkQ2hGZG1WdWRDNUlTVVJGS1Z4dUlDQWdJQ0FnZEdocGN5NTBjbWxuWjJWeVJYWmxiblFvUlhabGJuUXVTRWxFUkVWT0tWeHVYRzRnSUNBZ0lDQnlaWFIxY200Z2RISjFaVnh1SUNBZ0lIMWNibHh1SUNBZ0lITjBZWFJwWXlCZlJFOU5TVzUwWlhKbVlXTmxLRzl3ZEdsdmJuTXBJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQnpkWEJsY2k1ZlJFOU5TVzUwWlhKbVlXTmxLRkJ5YjJkeVpYTnpMQ0J2Y0hScGIyNXpLVnh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJSEpsZEhWeWJpQlFjbTluY21WemMxeHVmU2tvS1Z4dVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCUWNtOW5jbVZ6YzF4dUlpd2lMeW9xWEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvZ1RHbGpaVzV6WldRZ2RXNWtaWElnVFVsVUlDaG9kSFJ3Y3pvdkwyZHBkR2gxWWk1amIyMHZjWFZoY21zdFpHVjJMMUJvYjI1dmJpMUdjbUZ0WlhkdmNtc3ZZbXh2WWk5dFlYTjBaWEl2VEVsRFJVNVRSU2xjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2k5Y2JtbHRjRzl5ZENCRGIyMXdiMjVsYm5RZ1puSnZiU0FuTGk0dlkyOXRjRzl1Wlc1MEoxeHVhVzF3YjNKMElIc2daMlYwUVhSMGNtbGlkWFJsYzBOdmJtWnBaeUI5SUdaeWIyMGdKeTR1TDJOdmJYQnZibVZ1ZEUxaGJtRm5aWEluWEc1cGJYQnZjblFnUlhabGJuUWdabkp2YlNBbkxpNHZMaTR2WTI5eVpTOWxkbVZ1ZEhNblhHNXBiWEJ2Y25RZ2V5Qm1hVzVrVkdGeVoyVjBRbmxEYkdGemN5QjlJR1p5YjIwZ0p5NHVMeTR1TDJOdmNtVXZkWFJwYkhNblhHNWNibU52Ym5OMElGUmhZaUE5SUNnb0tTQTlQaUI3WEc0Z0lDOHFLbHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvZ1EyOXVjM1JoYm5SelhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaTljYmx4dUlDQmpiMjV6ZENCT1FVMUZJRDBnSjNSaFlpZGNiaUFnWTI5dWMzUWdWa1ZTVTBsUFRpQTlJQ2N5TGpBdU1DZGNiaUFnWTI5dWMzUWdSRVZHUVZWTVZGOVFVazlRUlZKVVNVVlRJRDBnZTF4dVhHNGdJSDFjYmlBZ1kyOXVjM1FnUkVGVVFWOUJWRlJTVTE5UVVrOVFSVkpVU1VWVElEMGdXMXh1SUNCZFhHNGdJR052Ym5OMElGUkJRbDlEVDA1VVJVNVVYMU5GVEVWRFZFOVNJRDBnSnk1MFlXSXRjR0Z1WlNkY2JseHVJQ0F2S2lwY2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFJRU5zWVhOeklFUmxabWx1YVhScGIyNWNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxTDF4dVhHNGdJR05zWVhOeklGUmhZaUJsZUhSbGJtUnpJRU52YlhCdmJtVnVkQ0I3WEc1Y2JpQWdJQ0JqYjI1emRISjFZM1J2Y2lodmNIUnBiMjV6SUQwZ2UzMHBJSHRjYmlBZ0lDQWdJSE4xY0dWeUtFNUJUVVVzSUZaRlVsTkpUMDRzSUVSRlJrRlZURlJmVUZKUFVFVlNWRWxGVXl3Z2IzQjBhVzl1Y3l3Z1JFRlVRVjlCVkZSU1UxOVFVazlRUlZKVVNVVlRMQ0JtWVd4elpTd2dabUZzYzJVcFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYzJodmR5Z3BJSHRjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNWpiR0Z6YzB4cGMzUXVZMjl1ZEdGcGJuTW9KMkZqZEdsMlpTY3BLU0I3WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJtWVd4elpWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQmpiMjV6ZENCcFpDQTlJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1kbGRFRjBkSEpwWW5WMFpTZ25hSEpsWmljcFhHNGdJQ0FnSUNCamIyNXpkQ0J1WVhZZ1BTQm1hVzVrVkdGeVoyVjBRbmxEYkdGemN5aDBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQ3dnSjI1aGRpY3BYRzRnSUNBZ0lDQmpiMjV6ZENCdVlYWlVZV0p6SUQwZ2JtRjJJRDhnYm1GMkxuRjFaWEo1VTJWc1pXTjBiM0pCYkd3b1lGdGtZWFJoTFhSdloyZHNaVDFjSWlSN1RrRk5SWDFjSWwxZ0tTQTZJRzUxYkd4Y2JseHVJQ0FnSUNBZ2FXWWdLRzVoZGxSaFluTXBJSHRjYmlBZ0lDQWdJQ0FnYm1GMlZHRmljeTVtYjNKRllXTm9LQ2gwWVdJcElEMCtJSHRjYmlBZ0lDQWdJQ0FnSUNCcFppQW9kR0ZpTG1Oc1lYTnpUR2x6ZEM1amIyNTBZV2x1Y3lnbllXTjBhWFpsSnlrcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUhSaFlpNWpiR0Z6YzB4cGMzUXVjbVZ0YjNabEtDZGhZM1JwZG1VbktWeHVJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnSUNCMFlXSXVjMlYwUVhSMGNtbGlkWFJsS0NkaGNtbGhMWE5sYkdWamRHVmtKeXdnWm1Gc2MyVXBYRzRnSUNBZ0lDQWdJSDBwWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExtTnNZWE56VEdsemRDNWhaR1FvSjJGamRHbDJaU2NwWEc0Z0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1elpYUkJkSFJ5YVdKMWRHVW9KMkZ5YVdFdGMyVnNaV04wWldRbkxDQjBjblZsS1Z4dVhHNGdJQ0FnSUNCamIyNXpkQ0IwWVdKRGIyNTBaVzUwSUQwZ1pHOWpkVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZjaWhwWkNsY2JpQWdJQ0FnSUdOdmJuTjBJSFJoWWtOdmJuUmxiblJ6SUQwZ2RHRmlRMjl1ZEdWdWRDNXdZWEpsYm5ST2IyUmxMbkYxWlhKNVUyVnNaV04wYjNKQmJHd29WRUZDWDBOUFRsUkZUbFJmVTBWTVJVTlVUMUlwWEc1Y2JpQWdJQ0FnSUdsbUlDaDBZV0pEYjI1MFpXNTBjeWtnZTF4dUlDQWdJQ0FnSUNCMFlXSkRiMjUwWlc1MGN5NW1iM0pGWVdOb0tDaDBZV0lwSUQwK0lIdGNiaUFnSUNBZ0lDQWdJQ0JwWmlBb2RHRmlMbU5zWVhOelRHbHpkQzVqYjI1MFlXbHVjeWduWVdOMGFYWmxKeWtwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFJoWWk1amJHRnpjMHhwYzNRdWNtVnRiM1psS0NkaFkzUnBkbVVuS1Z4dUlDQWdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdmU2xjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnZEdGaVEyOXVkR1Z1ZEM1amJHRnpjMHhwYzNRdVlXUmtLQ2R6YUc5M2FXNW5KeWxjYmx4dUlDQWdJQ0FnYzJWMFZHbHRaVzkxZENnb0tTQTlQaUI3WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJRzl1VTJodmQyVmtJRDBnS0NrZ1BUNGdlMXh1SUNBZ0lDQWdJQ0FnSUhSaFlrTnZiblJsYm5RdVkyeGhjM05NYVhOMExuSmxiVzkyWlNnbllXNXBiV0YwWlNjcFhHNGdJQ0FnSUNBZ0lDQWdkR0ZpUTI5dWRHVnVkQzVqYkdGemMweHBjM1F1WVdSa0tDZGhZM1JwZG1VbktWeHVJQ0FnSUNBZ0lDQWdJSFJoWWtOdmJuUmxiblF1WTJ4aGMzTk1hWE4wTG5KbGJXOTJaU2duYzJodmQybHVaeWNwWEc0Z0lDQWdJQ0FnSUNBZ2RHRmlRMjl1ZEdWdWRDNXlaVzF2ZG1WRmRtVnVkRXhwYzNSbGJtVnlLRVYyWlc1MExsUlNRVTVUU1ZSSlQwNWZSVTVFTENCdmJsTm9iM2RsWkNsY2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJSFJoWWtOdmJuUmxiblF1WVdSa1JYWmxiblJNYVhOMFpXNWxjaWhGZG1WdWRDNVVVa0ZPVTBsVVNVOU9YMFZPUkN3Z2IyNVRhRzkzWldRcFhHNWNiaUFnSUNBZ0lDQWdkR0ZpUTI5dWRHVnVkQzVqYkdGemMweHBjM1F1WVdSa0tDZGhibWx0WVhSbEp5bGNibHh1SUNBZ0lDQWdmU3dnTWpBcFhHNWNiaUFnSUNBZ0lISmxkSFZ5YmlCMGNuVmxYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2FHbGtaU2dwSUh0Y2JpQWdJQ0FnSUdsbUlDZ2hkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1WTJ4aGMzTk1hWE4wTG1OdmJuUmhhVzV6S0NkaFkzUnBkbVVuS1NrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z1ptRnNjMlZjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnYVdZZ0tIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbU5zWVhOelRHbHpkQzVqYjI1MFlXbHVjeWduWVdOMGFYWmxKeWtwSUh0Y2JpQWdJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25ZV04wYVhabEp5bGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1YzJWMFFYUjBjbWxpZFhSbEtDZGhjbWxoTFhObGJHVmpkR1ZrSnl3Z1ptRnNjMlVwWEc1Y2JpQWdJQ0FnSUdOdmJuTjBJR2xrSUQwZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVaMlYwUVhSMGNtbGlkWFJsS0Nkb2NtVm1KeWxjYmlBZ0lDQWdJR052Ym5OMElIUmhZa052Ym5SbGJuUWdQU0JrYjJOMWJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eUtHbGtLVnh1WEc0Z0lDQWdJQ0JwWmlBb2RHRmlRMjl1ZEdWdWRDNWpiR0Z6YzB4cGMzUXVZMjl1ZEdGcGJuTW9KMkZqZEdsMlpTY3BLU0I3WEc0Z0lDQWdJQ0FnSUhSaFlrTnZiblJsYm5RdVkyeGhjM05NYVhOMExuSmxiVzkyWlNnbllXTjBhWFpsSnlsY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2NtVjBkWEp1SUhSeWRXVmNiaUFnSUNCOVhHNWNiaUFnSUNCemRHRjBhV01nWDBSUFRVbHVkR1Z5Wm1GalpTaHZjSFJwYjI1ektTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z2MzVndaWEl1WDBSUFRVbHVkR1Z5Wm1GalpTaFVZV0lzSUc5d2RHbHZibk1wWEc0Z0lDQWdmVnh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaUJFVDAwZ1FYQnBJR2x0Y0d4bGJXVnVkR0YwYVc5dVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaTljYmlBZ1kyOXVjM1FnWTI5dGNHOXVaVzUwY3lBOUlGdGRYRzVjYmlBZ1kyOXVjM1FnZEdGaWN5QTlJR1J2WTNWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNKQmJHd29ZRnRrWVhSaExYUnZaMmRzWlQxY0lpUjdUa0ZOUlgxY0lsMWdLVnh1SUNCcFppQW9kR0ZpY3lrZ2UxeHVJQ0FnSUhSaFluTXVabTl5UldGamFDZ29aV3hsYldWdWRDa2dQVDRnZTF4dUlDQWdJQ0FnTHk4Z1kyOXVjM1FnWTI5dVptbG5JRDBnZTMxY2JpQWdJQ0FnSUdOdmJuTjBJR052Ym1acFp5QTlJR2RsZEVGMGRISnBZblYwWlhORGIyNW1hV2NvWld4bGJXVnVkQ3dnUkVWR1FWVk1WRjlRVWs5UVJWSlVTVVZUTENCRVFWUkJYMEZVVkZKVFgxQlNUMUJGVWxSSlJWTXBYRzRnSUNBZ0lDQmpiMjVtYVdjdVpXeGxiV1Z1ZENBOUlHVnNaVzFsYm5SY2JseHVJQ0FnSUNBZ1kyOXRjRzl1Wlc1MGN5NXdkWE5vS0ZSaFlpNWZSRTlOU1c1MFpYSm1ZV05sS0dOdmJtWnBaeWtwWEc0Z0lDQWdmU2xjYmlBZ2ZWeHVYRzRnSUdsbUlDaDBZV0p6S1NCN1hHNGdJQ0FnWkc5amRXMWxiblF1WVdSa1JYWmxiblJNYVhOMFpXNWxjaWduWTJ4cFkyc25MQ0FvWlhabGJuUXBJRDArSUh0Y2JpQWdJQ0FnSUdOdmJuTjBJR1JoZEdGVWIyZG5iR1ZCZEhSeUlEMGdaWFpsYm5RdWRHRnlaMlYwTG1kbGRFRjBkSEpwWW5WMFpTZ25aR0YwWVMxMGIyZG5iR1VuS1Z4dUlDQWdJQ0FnYVdZZ0tHUmhkR0ZVYjJkbmJHVkJkSFJ5SUNZbUlHUmhkR0ZVYjJkbmJHVkJkSFJ5SUQwOVBTQk9RVTFGS1NCN1hHNGdJQ0FnSUNBZ0lHTnZibk4wSUdsa0lEMGdaWFpsYm5RdWRHRnlaMlYwTG1kbGRFRjBkSEpwWW5WMFpTZ25hSEpsWmljcFhHNWNiaUFnSUNBZ0lDQWdZMjl1YzNRZ1kyOXRjRzl1Wlc1MElEMGdZMjl0Y0c5dVpXNTBjeTVtYVc1a0tHTWdQVDRnWXk1blpYUkZiR1Z0Wlc1MEtDa3VaMlYwUVhSMGNtbGlkWFJsS0Nkb2NtVm1KeWtnUFQwOUlHbGtLVnh1WEc0Z0lDQWdJQ0FnSUdsbUlDZ2hZMjl0Y0c5dVpXNTBLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2NtVjBkWEp1WEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQmpiMjF3YjI1bGJuUXVjMmh2ZHlncFhHNGdJQ0FnSUNCOVhHNGdJQ0FnZlNsY2JpQWdmVnh1WEc0Z0lISmxkSFZ5YmlCVVlXSmNibjBwS0NsY2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ1ZHRmlYRzRpTENJdktpcGNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaUJNYVdObGJuTmxaQ0IxYm1SbGNpQk5TVlFnS0doMGRIQnpPaTh2WjJsMGFIVmlMbU52YlM5eGRXRnlheTFrWlhZdlVHaHZibTl1TFVaeVlXMWxkMjl5YXk5aWJHOWlMMjFoYzNSbGNpOU1TVU5GVGxORktWeHVJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQXFMMXh1WEc1amIyNXpkQ0JCYW1GNElEMGdLQ2dwSUQwK0lIdGNiaUFnTHlvcVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaUJEYjI1emRHRnVkSE5jYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUwxeHVYRzRnSUdOdmJuTjBJRTVCVFVVZ1BTQW5ZV3BoZUNkY2JpQWdZMjl1YzNRZ1ZrVlNVMGxQVGlBOUlDY3lMakF1TUNkY2JseHVJQ0F2S2lwY2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFJRU5zWVhOeklFUmxabWx1YVhScGIyNWNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxTDF4dVhHNGdJR05zWVhOeklFRnFZWGdnZTF4dUlDQWdJQzhxS2x4dUlDQWdJQ0FxSUVOeVpXRjBaWE1nWVc0Z2FXNXpkR0Z1WTJVZ2IyWWdRV3BoZUM1Y2JpQWdJQ0FnS2lCQWNHRnlZVzBnZTN0dFpYUm9iMlE2SUhOMGNtbHVaeXdnZFhKc09pQnpkSEpwYm1jc0lHTnZiWEJzWlhSbE9pQkdkVzVqZEdsdmJpd2djM1ZqWTJWemN6b2dSblZ1WTNScGIyNHNJR1Z5Y205eU9pQkdkVzVqZEdsdmJpd2daR0YwWVRvZ1lXNTVMQ0JqY205emMwUnZiV0ZwYmpvZ1ltOXZiR1ZoYml3Z2FHVmhaR1Z5Y3pvZ2UxdG9aV0ZrWlhJNklITjBjbWx1WjEwNklITjBjbWx1WjMwc0lIUnBiV1Z2ZFhRNklHNTFiV0psY2l3Z1kyOXVkR1Z1ZEZSNWNHVTZJRzUxYldKbGNpd2daR0YwWVZSNWNHVTZJSE4wY21sdVp5QjlmU0J2Y0hSelhHNGdJQ0FnSUNvdlhHNGdJQ0FnWTI5dWMzUnlkV04wYjNJb2IzQjBjeWtnZTF4dUlDQWdJQ0FnYVdZZ0tIUjVjR1Z2WmlCdmNIUnpJQ0U5UFNBbmIySnFaV04wSnlrZ2UxeHVJQ0FnSUNBZ0lDQjBhSEp2ZHlCdVpYY2dSWEp5YjNJb1lDUjdUa0ZOUlgwdEpIdFdSVkpUU1U5T2ZXQXBYRzRnSUNBZ0lDQjlYRzRnSUNBZ0lDQjBhR2x6TG05d2RITWdQU0J2Y0hSelhHNGdJQ0FnSUNCMGFHbHpMbVZ5Y205eVEyOWtaU0E5SUc1MWJHeGNiaUFnSUNCOVhHNWNiaUFnSUNCamNtVmhkR1ZZYUhJb0tTQjdYRzRnSUNBZ0lDQmpiMjV6ZENCNGFISWdQU0J1WlhjZ1dFMU1TSFIwY0ZKbGNYVmxjM1FvS1Z4dUlDQWdJQ0FnYVdZZ0tDZDNhWFJvUTNKbFpHVnVkR2xoYkhNbklHbHVJSGhvY2lBbUppQjBhR2x6TG05d2RITXVZM0p2YzNORWIyMWhhVzRnUFQwOUlIUnlkV1VwSUh0Y2JpQWdJQ0FnSUNBZ2VHaHlMbmRwZEdoRGNtVmtaVzUwYVdGc2N5QTlJSFJ5ZFdWY2JpQWdJQ0FnSUgxY2JpQWdJQ0FnSUhKbGRIVnliaUI0YUhKY2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2S2lwY2JpQWdJQ0FnS2lCVFpYUWdhR1ZoWkdWeWMxeHVJQ0FnSUNBcUlFQndZWEpoYlNCN2UxdG9aV0ZrWlhJNklITjBjbWx1WjEwNklITjBjbWx1WjMxOUlHaGxZV1JsY25OY2JpQWdJQ0FnS2k5Y2JpQWdJQ0J6WlhSSVpXRmtaWEp6S0dobFlXUmxjbk1nUFNCN2ZTa2dlMXh1SUNBZ0lDQWdabTl5SUNoamIyNXpkQ0JyWlhrZ2FXNGdhR1ZoWkdWeWN5a2dlMXh1SUNBZ0lDQWdJQ0IwYUdsekxuaG9jaTV6WlhSU1pYRjFaWE4wU0dWaFpHVnlLR3RsZVN3Z2FHVmhaR1Z5YzF0clpYbGRLVnh1SUNBZ0lDQWdmVnh1SUNBZ0lIMWNibHh1SUNBZ0lHOXVVSEpsUlhobFkzVjBaU2dwSUh0Y2JpQWdJQ0FnSUdsbUlDaDBlWEJsYjJZZ2RHaHBjeTV2Y0hSekxtaGxZV1JsY25NZ1BUMDlJQ2R2WW1wbFkzUW5LU0I3WEc0Z0lDQWdJQ0FnSUhSb2FYTXVjMlYwU0dWaFpHVnljeWgwYUdsekxtOXdkSE11YUdWaFpHVnljeWxjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnYVdZZ0tIUjVjR1Z2WmlCMGFHbHpMbTl3ZEhNdWRHbHRaVzkxZENBOVBUMGdKMjUxYldKbGNpY3BJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NTRhSEl1ZEdsdFpXOTFkQ0E5SUhSb2FYTXViM0IwY3k1MGFXMWxiM1YwWEc0Z0lDQWdJQ0FnSUhSb2FYTXVlR2h5TG05dWRHbHRaVzkxZENBOUlDZ3BJRDArSUh0Y2JpQWdJQ0FnSUNBZ0lDQjBhR2x6TG1WeWNtOXlRMjlrWlNBOUlDZFVTVTFGVDFWVVgwVllRMFZGUkVWRUoxeHVJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR2xtSUNoMGVYQmxiMllnZEdocGN5NXZjSFJ6TG1OdmJuUmxiblJVZVhCbElEMDlQU0FuYzNSeWFXNW5KeWtnZTF4dUlDQWdJQ0FnSUNCMGFHbHpMbk5sZEVobFlXUmxjbk1vZXlBblEyOXVkR1Z1ZEMxMGVYQmxKem9nZEdocGN5NXZjSFJ6TG1OdmJuUmxiblJVZVhCbElIMHBYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbTl3ZEhNdVpHRjBZVlI1Y0dVZ1BUMDlJQ2Q0Yld3bklDWW1JSFJvYVhNdWVHaHlMbTkyWlhKeWFXUmxUV2x0WlZSNWNHVXBJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NTRhSEl1YjNabGNuSnBaR1ZOYVcxbFZIbHdaU2duWVhCd2JHbGpZWFJwYjI0dmVHMXNPeUJqYUdGeWMyVjBQWFYwWmkwNEp5bGNiaUFnSUNBZ0lIMWNiaUFnSUNCOVhHNWNiaUFnSUNCd1lYSnpaVkpsYzNCdmJuTmxLQ2tnZTF4dUlDQWdJQ0FnYkdWMElISmxjM0J2Ym5ObElEMGdiblZzYkZ4dUlDQWdJQ0FnYVdZZ0tIUm9hWE11YjNCMGN5NWtZWFJoVkhsd1pTQTlQVDBnSjJwemIyNG5LU0I3WEc0Z0lDQWdJQ0FnSUhSeWVTQjdYRzRnSUNBZ0lDQWdJQ0FnY21WemNHOXVjMlVnUFNCS1UwOU9MbkJoY25ObEtIUm9hWE11ZUdoeUxuSmxjM0J2Ym5ObFZHVjRkQ2xjYmlBZ0lDQWdJQ0FnZlNCallYUmphQ0FvWlhKeWIzSXBJSHRjYmlBZ0lDQWdJQ0FnSUNCMGFHbHpMbVZ5Y205eVEyOWtaU0E5SUNkS1UwOU9YMDFCVEVaUFVrMUZSQ2RjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnZlNCbGJITmxJR2xtSUNoMGFHbHpMbTl3ZEhNdVpHRjBZVlI1Y0dVZ1BUMDlJQ2Q0Yld3bktTQjdYRzRnSUNBZ0lDQWdJSEpsYzNCdmJuTmxJRDBnZEdocGN5NTRhSEl1Y21WemNHOXVjMlZZVFV4Y2JpQWdJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0FnSUhKbGMzQnZibk5sSUQwZ2RHaHBjeTU0YUhJdWNtVnpjRzl1YzJWVVpYaDBYRzRnSUNBZ0lDQjlYRzRnSUNBZ0lDQnlaWFIxY200Z2NtVnpjRzl1YzJWY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J5ZFc1U1pYRjFaWE4wS0NrZ2UxeHVJQ0FnSUNBZ2RHaHBjeTU0YUhJZ1BTQjBhR2x6TG1OeVpXRjBaVmhvY2lncFhHNGdJQ0FnSUNCMGFHbHpMbmhvY2k1dmNHVnVLSFJvYVhNdWIzQjBjeTV0WlhSb2IyUXNJSFJvYVhNdWIzQjBjeTUxY213c0lIUnlkV1VwWEc0Z0lDQWdJQ0IwYUdsekxtOXVVSEpsUlhobFkzVjBaU2dwWEc1Y2JpQWdJQ0FnSUhSb2FYTXVlR2h5TG05dWNtVmhaSGx6ZEdGMFpXTm9ZVzVuWlNBOUlDZ3BJRDArSUh0Y2JpQWdJQ0FnSUNBZ2FXWWdLSEJoY25ObFNXNTBLSFJvYVhNdWVHaHlMbkpsWVdSNVUzUmhkR1VwSUQwOVBTQTBLU0I3WEc0Z0lDQWdJQ0FnSUNBZ1kyOXVjM1FnYzNSaGRIVnpJRDBnZEdocGN5NTRhSEl1YzNSaGRIVnpMblJ2VTNSeWFXNW5LQ2xjYmx4dUlDQWdJQ0FnSUNBZ0lDOHZJSEpsYzNCdmJuTmxJSEpsWTJWcGRtVmtYRzRnSUNBZ0lDQWdJQ0FnYVdZZ0tIUjVjR1Z2WmlCMGFHbHpMbTl3ZEhNdVkyOXRjR3hsZEdVZ1BUMDlJQ2RtZFc1amRHbHZiaWNwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFJvYVhNdWIzQjBjeTVqYjIxd2JHVjBaU2gwYUdsekxtVnljbTl5UTI5a1pTd2dkR2hwY3k1NGFISXBYRzRnSUNBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lDQWdMeThnYzNWalkyVnpjeUF5ZUhoY2JpQWdJQ0FnSUNBZ0lDQnBaaUFvYzNSaGRIVnpXekJkSUQwOVBTQW5NaWNwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJR2xtSUNoMGVYQmxiMllnZEdocGN5NXZjSFJ6TG5OMVkyTmxjM01nUFQwOUlDZG1kVzVqZEdsdmJpY3BJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdkR2hwY3k1dmNIUnpMbk4xWTJObGMzTW9kR2hwY3k1d1lYSnpaVkpsYzNCdmJuTmxLQ2tzSUhSb2FYTXVlR2h5S1Z4dUlDQWdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1WEc0Z0lDQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJQ0FnTHk4Z1pYSnliM0lnS0RGNGVDd2dNbmg0TENBemVIZ3NJRFY0ZUNsY2JpQWdJQ0FnSUNBZ0lDQnBaaUFvZEhsd1pXOW1JSFJvYVhNdWIzQjBjeTVsY25KdmNpQTlQVDBnSjJaMWJtTjBhVzl1SnlrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z1ZHbHRaVzkxZENCcGJpQnZjbVJsY2lCMGJ5QjNZV2wwSUc5dUlIUm9aU0IwYVcxbGIzVjBJR3hwYldsMFhHNGdJQ0FnSUNBZ0lDQWdJQ0IzYVc1a2IzY3VjMlYwVkdsdFpXOTFkQ2dvS1NBOVBpQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lIUm9hWE11YjNCMGN5NWxjbkp2Y2loMGFHbHpMbVZ5Y205eVEyOWtaU3dnZEdocGN5NTRhSElwWEc0Z0lDQWdJQ0FnSUNBZ0lDQjlMQ0F4S1Z4dUlDQWdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdmVnh1SUNBZ0lDQWdkR2hwY3k1NGFISXVjMlZ1WkNoMGFHbHpMbTl3ZEhNdVpHRjBZU2xjYmx4dUlDQWdJQ0FnY21WMGRYSnVJSFJvYVhOY2JpQWdJQ0I5WEc1Y2JpQWdJQ0JqWVc1alpXd29LU0I3WEc0Z0lDQWdJQ0IwYUdsekxtVnljbTl5UTI5a1pTQTlJQ2REUVU1RFJVeEZSQ2RjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbmhvY2lrZ2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TG5ob2NpNWhZbTl5ZENncFhHNGdJQ0FnSUNCOVhHNGdJQ0FnSUNCMGFHbHpMbmhvY2lBOUlHNTFiR3hjYmlBZ0lDQjlYRzVjYmlBZ0lDQXZMeUJuWlhSMFpYSnpYRzVjYmlBZ0lDQnpkR0YwYVdNZ1oyVjBJSFpsY25OcGIyNG9LU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdZQ1I3VGtGTlJYMHVKSHRXUlZKVFNVOU9mV0JjYmlBZ0lDQjlYRzVjYmlBZ0lDQXZMeUJ3ZFdKc2FXTmNibHh1SUNBZ0lDOHZJSE4wWVhScFkxeHVJQ0FnSUhOMFlYUnBZeUJmUkU5TlNXNTBaWEptWVdObEtHOXdkSE1wSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJ1WlhjZ1FXcGhlQ2h2Y0hSektTNXlkVzVTWlhGMVpYTjBLQ2xjYmlBZ0lDQjlYRzRnSUgxY2JseHVJQ0J5WlhSMWNtNGdRV3BoZUZ4dWZTa29LVnh1WEc1bGVIQnZjblFnWkdWbVlYVnNkQ0JCYW1GNFhHNGlMQ0psZUhCdmNuUWdablZ1WTNScGIyNGdaR2x6Y0dGMFkyaFhhVzVFYjJORmRtVnVkQ2hsZG1WdWRFNWhiV1VzSUcxdlpIVnNaVTVoYldVc0lHUmxkR0ZwYkNBOUlIdDlLU0I3WEc0Z0lHTnZibk4wSUdaMWJHeEZkbVZ1ZEU1aGJXVWdQU0JnSkh0bGRtVnVkRTVoYldWOUxuQm9MaVI3Ylc5a2RXeGxUbUZ0WlgxZ1hHNGdJSGRwYm1SdmR5NWthWE53WVhSamFFVjJaVzUwS0c1bGR5QkRkWE4wYjIxRmRtVnVkQ2htZFd4c1JYWmxiblJPWVcxbExDQjdJR1JsZEdGcGJDQjlLU2xjYmlBZ1pHOWpkVzFsYm5RdVpHbHpjR0YwWTJoRmRtVnVkQ2h1WlhjZ1EzVnpkRzl0UlhabGJuUW9ablZzYkVWMlpXNTBUbUZ0WlN3Z2V5QmtaWFJoYVd3Z2ZTa3BYRzU5WEc1Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCa2FYTndZWFJqYUVWc1pXMWxiblJGZG1WdWRDaGtiMjFGYkdWdFpXNTBMQ0JsZG1WdWRFNWhiV1VzSUcxdlpIVnNaVTVoYldVc0lHUmxkR0ZwYkNBOUlIdDlLU0I3WEc0Z0lHTnZibk4wSUdaMWJHeEZkbVZ1ZEU1aGJXVWdQU0JnSkh0bGRtVnVkRTVoYldWOUxuQm9MaVI3Ylc5a2RXeGxUbUZ0WlgxZ1hHNGdJR1J2YlVWc1pXMWxiblF1WkdsemNHRjBZMmhGZG1WdWRDaHVaWGNnUTNWemRHOXRSWFpsYm5Rb1puVnNiRVYyWlc1MFRtRnRaU3dnZXlCa1pYUmhhV3dnZlNrcFhHNTlYRzVjYm1WNGNHOXlkQ0JtZFc1amRHbHZiaUJrYVhOd1lYUmphRkJoWjJWRmRtVnVkQ2hsZG1WdWRFNWhiV1VzSUhCaFoyVk9ZVzFsTENCa1pYUmhhV3dnUFNCN2ZTa2dlMXh1SUNCamIyNXpkQ0JtZFd4c1JYWmxiblJPWVcxbElEMGdZQ1I3Y0dGblpVNWhiV1Y5TGlSN1pYWmxiblJPWVcxbGZXQmNiaUFnZDJsdVpHOTNMbVJwYzNCaGRHTm9SWFpsYm5Rb2JtVjNJRU4xYzNSdmJVVjJaVzUwS0daMWJHeEZkbVZ1ZEU1aGJXVXNJSHNnWkdWMFlXbHNJSDBwS1Z4dUlDQmtiMk4xYldWdWRDNWthWE53WVhSamFFVjJaVzUwS0c1bGR5QkRkWE4wYjIxRmRtVnVkQ2htZFd4c1JYWmxiblJPWVcxbExDQjdJR1JsZEdGcGJDQjlLU2xjYm4xY2JpSXNJaTh2SUVCMGIyUnZJR3RsWlhBZ1AxeHVhV1lnS0hSNWNHVnZaaUIzYVc1a2IzY2dJVDA5SUNkMWJtUmxabWx1WldRbktTQjdYRzRnSUhkcGJtUnZkeTVoWkdSRmRtVnVkRXhwYzNSbGJtVnlLQ2RsY25KdmNpY3NJQ2dwSUQwK0lIdGNiaUFnSUNCamIyNXpiMnhsTG1WeWNtOXlLQ2RCYmlCbGNuSnZjaUJvWVhNZ2IyTmpkWEpsWkNFZ1dXOTFJR05oYmlCd1pXNGdZVzRnYVhOemRXVWdhR1Z5WlRvZ2FIUjBjSE02THk5bmFYUm9kV0l1WTI5dEwzRjFZWEpyTFdSbGRpOVFhRzl1YjI0dFJuSmhiV1YzYjNKckwybHpjM1ZsY3ljcFhHNGdJSDBwWEc1OVhHNWNiaTh2SUZWelpTQmhkbUZwYkdGaWJHVWdaWFpsYm5SelhHNXNaWFFnWVhaaGFXeGhZbXhsUlhabGJuUnpJRDBnV3lkdGIzVnpaV1J2ZDI0bkxDQW5iVzkxYzJWdGIzWmxKeXdnSjIxdmRYTmxkWEFuWFZ4dWJHVjBJSFJ2ZFdOb1UyTnlaV1Z1SUQwZ1ptRnNjMlZjYmx4dWFXWWdLSFI1Y0dWdlppQjNhVzVrYjNjZ0lUMDlJQ2QxYm1SbFptbHVaV1FuS1NCN1hHNGdJR2xtSUNnb0oyOXVkRzkxWTJoemRHRnlkQ2NnYVc0Z2QybHVaRzkzS1NCOGZDQjNhVzVrYjNjdVJHOWpkVzFsYm5SVWIzVmphQ0FtSmlCa2IyTjFiV1Z1ZENCcGJuTjBZVzVqWlc5bUlFUnZZM1Z0Wlc1MFZHOTFZMmdwSUh0Y2JpQWdJQ0IwYjNWamFGTmpjbVZsYmlBOUlIUnlkV1ZjYmlBZ0lDQmhkbUZwYkdGaWJHVkZkbVZ1ZEhNZ1BTQmJKM1J2ZFdOb2MzUmhjblFuTENBbmRHOTFZMmh0YjNabEp5d2dKM1J2ZFdOb1pXNWtKeXdnSjNSdmRXTm9ZMkZ1WTJWc0oxMWNiaUFnZlZ4dVhHNGdJR2xtSUNoM2FXNWtiM2N1Ym1GMmFXZGhkRzl5TG5CdmFXNTBaWEpGYm1GaWJHVmtLU0I3WEc0Z0lDQWdZWFpoYVd4aFlteGxSWFpsYm5SeklEMGdXeWR3YjJsdWRHVnlaRzkzYmljc0lDZHdiMmx1ZEdWeWJXOTJaU2NzSUNkd2IybHVkR1Z5ZFhBbkxDQW5jRzlwYm5SbGNtTmhibU5sYkNkZFhHNGdJSDBnWld4elpTQnBaaUFvZDJsdVpHOTNMbTVoZG1sbllYUnZjaTV0YzFCdmFXNTBaWEpGYm1GaWJHVmtLU0I3WEc0Z0lDQWdZWFpoYVd4aFlteGxSWFpsYm5SeklEMGdXeWROVTFCdmFXNTBaWEpFYjNkdUp5d2dKMDFUVUc5cGJuUmxjazF2ZG1VbkxDQW5UVk5RYjJsdWRHVnlWWEFuTENBblRWTlFiMmx1ZEdWeVEyRnVZMlZzSjExY2JpQWdmVnh1ZlZ4dVhHNWpiMjV6ZENCbGJDQTlJR1J2WTNWdFpXNTBMbU55WldGMFpVVnNaVzFsYm5Rb0oyUnBkaWNwWEc1amIyNXpkQ0IwY21GdWMybDBhVzl1Y3lBOUlGdGNiaUFnZXlCdVlXMWxPaUFuZEhKaGJuTnBkR2x2Ymljc0lITjBZWEowT2lBbmRISmhibk5wZEdsdmJuTjBZWEowSnl3Z1pXNWtPaUFuZEhKaGJuTnBkR2x2Ym1WdVpDY2dmU3hjYmlBZ2V5QnVZVzFsT2lBblRXOTZWSEpoYm5OcGRHbHZiaWNzSUhOMFlYSjBPaUFuZEhKaGJuTnBkR2x2Ym5OMFlYSjBKeXdnWlc1a09pQW5kSEpoYm5OcGRHbHZibVZ1WkNjZ2ZTeGNiaUFnZXlCdVlXMWxPaUFuYlhOVWNtRnVjMmwwYVc5dUp5d2djM1JoY25RNklDZHRjMVJ5WVc1emFYUnBiMjVUZEdGeWRDY3NJR1Z1WkRvZ0oyMXpWSEpoYm5OcGRHbHZia1Z1WkNjZ2ZTeGNiaUFnZXlCdVlXMWxPaUFuVjJWaWEybDBWSEpoYm5OcGRHbHZiaWNzSUhOMFlYSjBPaUFuZDJWaWEybDBWSEpoYm5OcGRHbHZibE4wWVhKMEp5d2daVzVrT2lBbmQyVmlhMmwwVkhKaGJuTnBkR2x2YmtWdVpDY2dmU3hjYmwxY2JtTnZibk4wSUdGdWFXMWhkR2x2Ym5NZ1BTQmJYRzRnSUhzZ2JtRnRaVG9nSjJGdWFXMWhkR2x2Ymljc0lITjBZWEowT2lBbllXNXBiV0YwYVc5dWMzUmhjblFuTENCbGJtUTZJQ2RoYm1sdFlYUnBiMjVsYm1RbklIMHNYRzRnSUhzZ2JtRnRaVG9nSjAxdmVrRnVhVzFoZEdsdmJpY3NJSE4wWVhKME9pQW5ZVzVwYldGMGFXOXVjM1JoY25RbkxDQmxibVE2SUNkaGJtbHRZWFJwYjI1bGJtUW5JSDBzWEc0Z0lIc2dibUZ0WlRvZ0oyMXpRVzVwYldGMGFXOXVKeXdnYzNSaGNuUTZJQ2R0YzBGdWFXMWhkR2x2YmxOMFlYSjBKeXdnWlc1a09pQW5iWE5CYm1sdFlYUnBiMjVGYm1RbklIMHNYRzRnSUhzZ2JtRnRaVG9nSjFkbFltdHBkRUZ1YVcxaGRHbHZiaWNzSUhOMFlYSjBPaUFuZDJWaWEybDBRVzVwYldGMGFXOXVVM1JoY25RbkxDQmxibVE2SUNkM1pXSnJhWFJCYm1sdFlYUnBiMjVGYm1RbklIMHNYRzVkWEc1Y2JtTnZibk4wSUhSeVlXNXphWFJwYjI1VGRHRnlkQ0E5SUhSeVlXNXphWFJwYjI1ekxtWnBibVFvZENBOVBpQmxiQzV6ZEhsc1pWdDBMbTVoYldWZElDRTlQU0IxYm1SbFptbHVaV1FwTG5OMFlYSjBYRzVqYjI1emRDQjBjbUZ1YzJsMGFXOXVSVzVrSUQwZ2RISmhibk5wZEdsdmJuTXVabWx1WkNoMElEMCtJR1ZzTG5OMGVXeGxXM1F1Ym1GdFpWMGdJVDA5SUhWdVpHVm1hVzVsWkNrdVpXNWtYRzVqYjI1emRDQmhibWx0WVhScGIyNVRkR0Z5ZENBOUlHRnVhVzFoZEdsdmJuTXVabWx1WkNoMElEMCtJR1ZzTG5OMGVXeGxXM1F1Ym1GdFpWMGdJVDA5SUhWdVpHVm1hVzVsWkNrdWMzUmhjblJjYm1OdmJuTjBJR0Z1YVcxaGRHbHZia1Z1WkNBOUlHRnVhVzFoZEdsdmJuTXVabWx1WkNoMElEMCtJR1ZzTG5OMGVXeGxXM1F1Ym1GdFpWMGdJVDA5SUhWdVpHVm1hVzVsWkNrdVpXNWtYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJSHRjYmlBZ0x5OGdkRzkxWTJnZ2MyTnlaV1Z1SUhOMWNIQnZjblJjYmlBZ1ZFOVZRMGhmVTBOU1JVVk9PaUIwYjNWamFGTmpjbVZsYml4Y2JseHVJQ0F2THlCdVpYUjNiM0pyWEc0Z0lFNUZWRmRQVWt0ZlQwNU1TVTVGT2lBbmIyNXNhVzVsSnl4Y2JpQWdUa1ZVVjA5U1MxOVBSa1pNU1U1Rk9pQW5iMlptYkdsdVpTY3NYRzRnSUU1RlZGZFBVa3RmVWtWRFQwNU9SVU5VU1U1SE9pQW5jbVZqYjI1dVpXTjBhVzVuSnl4Y2JpQWdUa1ZVVjA5U1MxOVNSVU5QVGs1RlExUkpUa2RmVTFWRFEwVlRVem9nSjNKbFkyOXVibVZqZEM1emRXTmpaWE56Snl4Y2JpQWdUa1ZVVjA5U1MxOVNSVU5QVGs1RlExUkpUa2RmUmtGSlRGVlNSVG9nSjNKbFkyOXVibVZqZEM1bVlXbHNkWEpsSnl4Y2JseHVJQ0F2THlCMWMyVnlJR2x1ZEdWeVptRmpaU0J6ZEdGMFpYTmNiaUFnVTBoUFZ6b2dKM05vYjNjbkxGeHVJQ0JUU0U5WFRqb2dKM05vYjNkdUp5eGNiaUFnU0VsRVJUb2dKMmhwWkdVbkxGeHVJQ0JJU1VSRVJVNDZJQ2RvYVdSa1pXNG5MRnh1WEc0Z0lDOHZJR2hoYzJoY2JpQWdTRUZUU0RvZ0oyaGhjMmduTEZ4dVhHNGdJQzh2SUhSdmRXTm9MQ0J0YjNWelpTQmhibVFnY0c5cGJuUmxjaUJsZG1WdWRITWdjRzlzZVdacGJHeGNiaUFnVTFSQlVsUTZJR0YyWVdsc1lXSnNaVVYyWlc1MGMxc3dYU3hjYmlBZ1RVOVdSVG9nWVhaaGFXeGhZbXhsUlhabGJuUnpXekZkTEZ4dUlDQkZUa1E2SUdGMllXbHNZV0pzWlVWMlpXNTBjMXN5WFN4Y2JpQWdRMEZPUTBWTU9pQjBlWEJsYjJZZ1lYWmhhV3hoWW14bFJYWmxiblJ6V3pOZElEMDlQU0FuZFc1a1pXWnBibVZrSnlBL0lHNTFiR3dnT2lCaGRtRnBiR0ZpYkdWRmRtVnVkSE5iTTEwc1hHNWNiaUFnTHk4Z2RISmhibk5wZEdsdmJuTmNiaUFnVkZKQlRsTkpWRWxQVGw5VFZFRlNWRG9nZEhKaGJuTnBkR2x2YmxOMFlYSjBMRnh1SUNCVVVrRk9VMGxVU1U5T1gwVk9SRG9nZEhKaGJuTnBkR2x2YmtWdVpDeGNibHh1SUNBdkx5QmhibWx0WVhScGIyNXpYRzRnSUVGT1NVMUJWRWxQVGw5VFZFRlNWRG9nWVc1cGJXRjBhVzl1VTNSaGNuUXNYRzRnSUVGT1NVMUJWRWxQVGw5RlRrUTZJR0Z1YVcxaGRHbHZia1Z1WkN4Y2JseHVJQ0F2THlCa2NtOXdaRzkzYmx4dUlDQkpWRVZOWDFORlRFVkRWRVZFT2lBbmFYUmxiVk5sYkdWamRHVmtKeXhjYm4waUxDSXZLaXBjYmlvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaW9nVEdsalpXNXpaV1FnZFc1a1pYSWdUVWxVSUNob2RIUndjem92TDJkcGRHaDFZaTVqYjIwdmNYVmhjbXN0WkdWMkwxQm9iMjV2YmkxR2NtRnRaWGR2Y21zdllteHZZaTl0WVhOMFpYSXZURWxEUlU1VFJTbGNiaW9nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2Jpb3ZYRzVjYm1OdmJuTjBJRUpwYm1SbGNpQTlJQ2dvS1NBOVBpQjdYRzRnSUM4cUtseHVJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQXFJRU52Ym5OMFlXNTBjMXh1SUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FxTDF4dVhHNGdJR052Ym5OMElFNUJUVVVnUFNBbmFXNTBiQzFpYVc1a1pYSW5YRzRnSUdOdmJuTjBJRlpGVWxOSlQwNGdQU0FuTWk0d0xqQW5YRzVjYmlBZ0x5b3FYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2lCRGJHRnpjeUJFWldacGJtbDBhVzl1WEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpOWNibHh1SUNCamJHRnpjeUJDYVc1a1pYSWdlMXh1SUNBZ0lHTnZibk4wY25WamRHOXlLR1ZzWlcxbGJuUXNJR1JoZEdFcElIdGNiaUFnSUNBZ0lIUm9hWE11Wld4bGJXVnVkQ0E5SUdWc1pXMWxiblJjYmlBZ0lDQWdJSFJvYVhNdVpHRjBZU0E5SUdSaGRHRmNibHh1SUNBZ0lDQWdhV1lnS0NGMGFHbHpMbWx6Uld4bGJXVnVkQ2gwYUdsekxtVnNaVzFsYm5RcEtTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJseHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQXZMeUJoY25KaGVTQnZaaUJJVkUxTVJXeGxiV1Z1ZEZ4dUlDQWdJQ0FnYVdZZ0tIUm9hWE11Wld4bGJXVnVkQzVzWlc1bmRHZ2dKaVlnZEdocGN5NWxiR1Z0Wlc1MExteGxibWQwYUNBK0lEQXBJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NXpaWFJPYjJSbGN5aDBhR2x6TG1Wc1pXMWxiblFwWEc0Z0lDQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdJQ0F2THlCemFXNW5iR1VnU0ZSTlRFVnNaVzFsYm5SY2JpQWdJQ0FnSUNBZ2RHaHBjeTV6WlhST2IyUmxLSFJvYVhNdVpXeGxiV1Z1ZENsY2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2THlCblpYUjBaWEp6WEc1Y2JpQWdJQ0J6ZEdGMGFXTWdaMlYwSUhabGNuTnBiMjRvS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnWUNSN1RrRk5SWDB1Skh0V1JWSlRTVTlPZldCY2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2S2lwY2JpQWdJQ0FnS2lCRGFHVmphM01nYVdZZ2RHaGxJR2RwZG1WdUlHRnlaM1Z0Wlc1MElHbHpJR0VnUkU5TklHVnNaVzFsYm5SY2JpQWdJQ0FnS2lCQWNHRnlZVzBnZTBoVVRVeEZiR1Z0Wlc1MGZTQjBhR1VnWVhKbmRXMWxiblFnZEc4Z2RHVnpkRnh1SUNBZ0lDQXFJRUJ5WlhSMWNtNGdlMkp2YjJ4bFlXNTlJSFJ5ZFdVZ2FXWWdkR2hsSUc5aWFtVmpkQ0JwY3lCaElFUlBUU0JsYkdWdFpXNTBMQ0JtWVd4elpTQnZkR2hsY25kcGMyVmNiaUFnSUNBZ0tpOWNiaUFnSUNCcGMwVnNaVzFsYm5Rb1pXeGxiV1Z1ZENrZ2UxeHVJQ0FnSUNBZ2FXWWdLR1ZzWlcxbGJuUWdQVDA5SUc1MWJHd3BJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJR1poYkhObFhHNGdJQ0FnSUNCOVhHNGdJQ0FnSUNCeVpYUjFjbTRnS0hSNWNHVnZaaUJPYjJSbElEMDlQU0FuYjJKcVpXTjBKeUEvSUdWc1pXMWxiblFnYVc1emRHRnVZMlZ2WmlCT2IyUmxJRG9nWld4bGJXVnVkQ0FtSmlCMGVYQmxiMllnWld4bGJXVnVkQ0E5UFQwZ0oyOWlhbVZqZENjZ0ppWWdkSGx3Wlc5bUlHVnNaVzFsYm5RdWJtOWtaVlI1Y0dVZ1BUMDlJQ2R1ZFcxaVpYSW5JQ1ltSUhSNWNHVnZaaUJsYkdWdFpXNTBMbTV2WkdWT1lXMWxJRDA5UFNBbmMzUnlhVzVuSnlsY2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2S2lwY2JpQWdJQ0FxSUVKcGJtUnpJSE52YldVZ2RHVjRkQ0IwYnlCMGFHVWdaMmwyWlc0Z1JFOU5JR1ZzWlcxbGJuUmNiaUFnSUNBcUlFQndZWEpoYlNCN1NGUk5URVZzWlcxbGJuUjlJR1ZzWlcxbGJuUmNiaUFnSUNBcUlFQndZWEpoYlNCN1UzUnlhVzVuZlNCMFpYaDBYRzRnSUNBZ0tpOWNiaUFnSUNCelpYUlVaWGgwS0dWc1pXMWxiblFzSUhSbGVIUXBJSHRjYmlBZ0lDQWdJR2xtSUNnaEtDZDBaWGgwUTI5dWRHVnVkQ2NnYVc0Z1pXeGxiV1Z1ZENrcElIdGNiaUFnSUNBZ0lDQWdaV3hsYldWdWRDNXBibTVsY2xSbGVIUWdQU0IwWlhoMFhHNGdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNCbGJHVnRaVzUwTG5SbGVIUkRiMjUwWlc1MElEMGdkR1Y0ZEZ4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmx4dUlDQWdJQzhxS2x4dUlDQWdJQ0FxSUVKcGJtUnpJSE52YldVZ2FIUnRiQ0IwYnlCMGFHVWdaMmwyWlc0Z1JFOU5JR1ZzWlcxbGJuUmNiaUFnSUNBZ0tpQkFjR0Z5WVcwZ2UwaFVUVXhGYkdWdFpXNTBmU0JsYkdWdFpXNTBYRzRnSUNBZ0lDb2dRSEJoY21GdElIdHpkSEpwYm1kOUlIUmxlSFJjYmlBZ0lDQWdLaTljYmlBZ0lDQnpaWFJJZEcxc0tHVnNaVzFsYm5Rc0lIUmxlSFFwSUh0Y2JpQWdJQ0FnSUdWc1pXMWxiblF1YVc1dVpYSklWRTFNSUQwZ2RHVjRkRnh1SUNBZ0lIMWNibHh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRUpwYm1SeklHTjFjM1J2YlNCaGRIUnlhV0oxZEdWeklIUnZJSFJvWlNCbmFYWmxiaUJFVDAwZ1pXeGxiV1Z1ZEZ4dUlDQWdJQ0FxSUVCd1lYSmhiU0I3U0ZSTlRFVnNaVzFsYm5SOUlHVnNaVzFsYm5SY2JpQWdJQ0FnS2lCQWNHRnlZVzBnZTFOMGNtbHVaMzBnWVhSMGNseHVJQ0FnSUNBcUlFQndZWEpoYlNCN1UzUnlhVzVuZlNCMFpYaDBYRzRnSUNBZ0lDb3ZYRzRnSUNBZ2MyVjBRWFIwY21saWRYUmxLR1ZzWlcxbGJuUXNJR0YwZEhJc0lIUmxlSFFwSUh0Y2JpQWdJQ0FnSUdWc1pXMWxiblF1YzJWMFFYUjBjbWxpZFhSbEtHRjBkSElzSUhSbGVIUXBYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MyVjBUbTlrWlNobGJHVnRaVzUwS1NCN1hHNGdJQ0FnSUNCc1pYUWdZWFIwY2lBOUlHVnNaVzFsYm5RdVoyVjBRWFIwY21saWRYUmxLQ2RrWVhSaExXa3hPRzRuS1Z4dUlDQWdJQ0FnYVdZZ0tDRmhkSFJ5S1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5Ymx4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCaGRIUnlJRDBnWVhSMGNpNTBjbWx0S0NsY2JseHVJQ0FnSUNBZ1kyOXVjM1FnY2lBOUlDOG9QenBjWEhOOFhpa29XMEV0V21FdGVpMWZNQzA1WFNzcE9seGNjeW9vTGlvL0tTZy9QVnhjY3l0Y1hIY3JPbndrS1M5blhHNGdJQ0FnSUNCc1pYUWdiVnh1WEc0Z0lDQWdJQ0IzYUdsc1pTQW9iU0E5SUhJdVpYaGxZeWhoZEhSeUtTa2dlMXh1SUNBZ0lDQWdJQ0JqYjI1emRDQnJaWGtnUFNCdFd6RmRMblJ5YVcwb0tWeHVJQ0FnSUNBZ0lDQmpiMjV6ZENCMllXeDFaU0E5SUcxYk1sMHVkSEpwYlNncExuSmxjR3hoWTJVb0p5d25MQ0FuSnlsY2JpQWdJQ0FnSUNBZ2JHVjBJR2x1ZEd4V1lXeDFaU0E5SUhSb2FYTXVaR0YwWVZ0MllXeDFaVjFjYmx4dUlDQWdJQ0FnSUNCcFppQW9JWFJvYVhNdVpHRjBZVnQyWVd4MVpWMHBJSHRjYmlBZ0lDQWdJQ0FnSUNCamIyNXpiMnhsTG14dlp5aGdKSHRPUVUxRmZTNGdWMkZ5Ym1sdVp5d2dKSHQyWVd4MVpYMGdaRzlsY3lCdWIzUWdaWGhwYzNRdVlDbGNiaUFnSUNBZ0lDQWdJQ0JwYm5Sc1ZtRnNkV1VnUFNCMllXeDFaVnh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ1kyOXVjM1FnYldWMGFHOWtUbUZ0WlNBOUlDZHpaWFFuSUNzZ2EyVjVMbU5vWVhKQmRDZ3dLUzUwYjFWd2NHVnlRMkZ6WlNncElDc2dhMlY1TG5Oc2FXTmxLREVwWEc1Y2JpQWdJQ0FnSUNBZ2FXWWdLSFJvYVhOYmJXVjBhRzlrVG1GdFpWMHBJSHRjYmlBZ0lDQWdJQ0FnSUNCMGFHbHpXMjFsZEdodlpFNWhiV1ZkS0dWc1pXMWxiblFzSUdsdWRHeFdZV3gxWlNsY2JpQWdJQ0FnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUNBZ0lDQjBhR2x6TG5ObGRFRjBkSEpwWW5WMFpTaGxiR1Z0Wlc1MExDQnJaWGtzSUdsdWRHeFdZV3gxWlNsY2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JseHVJQ0FnSUM4cUtseHVJQ0FnSUNvZ1UyVjBJSFpoYkhWbGN5QjBieUJFVDAwZ2JtOWtaWE5jYmlBZ0lDQXFMMXh1SUNBZ0lITmxkRTV2WkdWektHVnNaVzFsYm5RcElIdGNiaUFnSUNBZ0lHVnNaVzFsYm5RdVptOXlSV0ZqYUNobGJDQTlQaUIwYUdsekxuTmxkRTV2WkdVb1pXd3BLVnh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJSEpsZEhWeWJpQkNhVzVrWlhKY2JuMHBLQ2xjYmx4dVpYaHdiM0owSUdSbFptRjFiSFFnUW1sdVpHVnlYRzRpTENJdktpcGNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaUJNYVdObGJuTmxaQ0IxYm1SbGNpQk5TVlFnS0doMGRIQnpPaTh2WjJsMGFIVmlMbU52YlM5eGRXRnlheTFrWlhZdlVHaHZibTl1TFVaeVlXMWxkMjl5YXk5aWJHOWlMMjFoYzNSbGNpOU1TVU5GVGxORktWeHVJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQXFMMXh1YVcxd2IzSjBJRUpwYm1SbGNpQm1jbTl0SUNjdUwySnBibVJsY2lkY2JseHVZMjl1YzNRZ1NXNTBiQ0E5SUNnb0tTQTlQaUI3WEc0Z0lDOHFLbHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvZ1EyOXVjM1JoYm5SelhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaTljYmx4dUlDQmpiMjV6ZENCT1FVMUZJRDBnSjBsdWRHd25YRzRnSUdOdmJuTjBJRlpGVWxOSlQwNGdQU0FuTWk0d0xqQW5YRzRnSUdOdmJuTjBJRVJGUmtGVlRGUmZVRkpQVUVWU1ZFbEZVeUE5SUh0Y2JpQWdJQ0JtWVd4c1ltRmphMHh2WTJGc1pUb2dKMlZ1Snl4Y2JpQWdJQ0JzYjJOaGJHVTZJQ2RsYmljc1hHNGdJQ0FnWVhWMGIwSnBibVE2SUhSeWRXVXNYRzRnSUNBZ1pHRjBZVG9nYm5Wc2JDeGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb2dRMnhoYzNNZ1JHVm1hVzVwZEdsdmJseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ292WEc1Y2JpQWdZMnhoYzNNZ1NXNTBiQ0I3WEc0Z0lDQWdMeW9xWEc0Z0lDQWdJQ29nUTNKbFlYUmxjeUJoYmlCcGJuTjBZVzVqWlNCdlppQkpiblJzTGx4dUlDQWdJQ0FxSUVCd1lYSmhiU0I3Wm1Gc2JHSmhZMnRNYjJOaGJHVTZJSE4wY21sdVp5d2diRzlqWVd4bE9pQnpkSEpwYm1jc0lHRjFkRzlDYVc1a09pQmliMjlzWldGdUxDQmtZWFJoT2lCN1cyeGhibWM2SUhOMGNtbHVaMTA2SUh0YmEyVjVPaUJ6ZEhKcGJtZGRPaUJ6ZEhKcGJtZDlmWDFjYmlBZ0lDQWdLaTljYmlBZ0lDQmpiMjV6ZEhKMVkzUnZjaWh2Y0hScGIyNXpJRDBnZTMwcElIdGNiaUFnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeUE5SUU5aWFtVmpkQzVoYzNOcFoyNG9SRVZHUVZWTVZGOVFVazlRUlZKVVNVVlRMQ0J2Y0hScGIyNXpLVnh1WEc0Z0lDQWdJQ0JwWmlBb2RIbHdaVzltSUhSb2FYTXViM0IwYVc5dWN5NW1ZV3hzWW1GamEweHZZMkZzWlNBaFBUMGdKM04wY21sdVp5Y3BJSHRjYmlBZ0lDQWdJQ0FnZEdoeWIzY2dibVYzSUVWeWNtOXlLR0FrZTA1QlRVVjlMaUJVYUdVZ1ptRnNiR0poWTJzZ2JHOWpZV3hsSUdseklHMWhibVJoZEc5eWVTQmhibVFnYlhWemRDQmlaU0JoSUhOMGNtbHVaeTVnS1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCcFppQW9kR2hwY3k1dmNIUnBiMjV6TG1SaGRHRWdQVDA5SUc1MWJHd3BJSHRjYmlBZ0lDQWdJQ0FnZEdoeWIzY2dibVYzSUVWeWNtOXlLR0FrZTA1QlRVVjlMaUJVYUdWeVpTQnBjeUJ1YnlCMGNtRnVjMnhoZEdsdmJpQmtZWFJoTG1BcFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lHbG1JQ2gwZVhCbGIyWWdkR2hwY3k1dmNIUnBiMjV6TG1SaGRHRmJkR2hwY3k1dmNIUnBiMjV6TG1aaGJHeGlZV05yVEc5allXeGxYU0FoUFQwZ0oyOWlhbVZqZENjcElIdGNiaUFnSUNBZ0lDQWdkR2h5YjNjZ2JtVjNJRVZ5Y205eUtHQWtlMDVCVFVWOUxpQlVhR1VnWm1Gc2JHSmhZMnNnYkc5allXeGxJRzExYzNRZ2JtVmpaWE56WVhKcGJIa2dhR0YyWlNCMGNtRnVjMnhoZEdsdmJpQmtZWFJoTG1BcFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lIUm9hWE11YzJWMFRHOWpZV3hsS0hSb2FYTXViM0IwYVc5dWN5NXNiMk5oYkdVc0lIUm9hWE11YjNCMGFXOXVjeTVoZFhSdlFtbHVaQ2xjYmlBZ0lDQjlYRzVjYmlBZ0lDQnpkR0YwYVdNZ1oyVjBJSFpsY25OcGIyNG9LU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdZQ1I3VGtGTlJYMHVKSHRXUlZKVFNVOU9mV0JjYmlBZ0lDQjlYRzVjYmlBZ0lDQm5aWFJNYjJOaGJHVW9LU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkR2hwY3k1dmNIUnBiMjV6TG14dlkyRnNaVnh1SUNBZ0lIMWNibHh1SUNBZ0lHZGxkRVpoYkd4aVlXTnJURzlqWVd4bEtDa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlIUm9hWE11YjNCMGFXOXVjeTVtWVd4c1ltRmphMHh2WTJGc1pWeHVJQ0FnSUgxY2JseHVJQ0FnSUM4cUtseHVJQ0FnSUNBcUlGTmxkQ0JrWldaaGRXeDBJR3h2WTJGc1pWeHVJQ0FnSUNBcUlFQndZWEpoYlNCN2MzUnlhVzVuZlNCc2IyTmhiR1ZjYmlBZ0lDQWdLaUJBY0dGeVlXMGdlMkp2YjJ4bFlXNTlJRnQxY0dSaGRHVklWRTFNUFhSeWRXVmRYRzRnSUNBZ0lDb3ZYRzRnSUNBZ2MyVjBURzlqWVd4bEtHeHZZMkZzWlN3Z2RYQmtZWFJsU0ZSTlRDQTlJSFJ5ZFdVcElIdGNiaUFnSUNBZ0lHbG1JQ2gwZVhCbGIyWWdkR2hwY3k1dmNIUnBiMjV6TG1SaGRHRmJiRzlqWVd4bFhTQWhQVDBnSjI5aWFtVmpkQ2NwSUh0Y2JpQWdJQ0FnSUNBZ1kyOXVjMjlzWlM1bGNuSnZjaWhnSkh0T1FVMUZmUzRnSkh0c2IyTmhiR1Y5SUdoaGN5QnVieUJrWVhSaExDQm1ZV3hzWW1GamF5QnBiaUFrZTNSb2FYTXViM0IwYVc5dWN5NW1ZV3hzWW1GamEweHZZMkZzWlgwdVlDbGNiaUFnSUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVzYjJOaGJHVWdQU0JzYjJOaGJHVmNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdhV1lnS0hWd1pHRjBaVWhVVFV3cElIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1MWNHUmhkR1ZJZEcxc0tDbGNiaUFnSUNBZ0lIMWNiaUFnSUNCOVhHNWNiaUFnSUNCblpYUk1ZVzVuZFdGblpYTW9LU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdUMkpxWldOMExtdGxlWE1vZEdocGN5NXZjSFJwYjI1ekxtUmhkR0VwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdhVzV6WlhKMFZtRnNkV1Z6S0haaGJIVmxJRDBnYm5Wc2JDd2dhVzVxWldOMFlXSnNaVlpoYkhWbGN5QTlJSHQ5S1NCN1hHNGdJQ0FnSUNCcFppQW9kSGx3Wlc5bUlIWmhiSFZsSUNFOVBTQW5jM1J5YVc1bkp5a2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdkVzVrWldacGJtVmtYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR052Ym5OMElHMWhkR05vSUQwZ2RtRnNkV1V1YldGMFkyZ29Mem9vVzJFdGVrRXRXaTFmTUMwNVhTc3BMeWxjYmlBZ0lDQWdJR2xtSUNodFlYUmphQ2tnZTF4dUlDQWdJQ0FnSUNCMllXeDFaU0E5SUhaaGJIVmxMbkpsY0d4aFkyVW9iV0YwWTJoYk1GMHNJR2x1YW1WamRHRmliR1ZXWVd4MVpYTmJiV0YwWTJoYk1WMWRLVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0JwWmlBb2RtRnNkV1V1YldGMFkyZ29Mem9vVzJFdGVrRXRXaTFmTUMwNVhTc3BMeWtwSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTXVhVzV6WlhKMFZtRnNkV1Z6S0haaGJIVmxMQ0JwYm1wbFkzUmhZbXhsVm1Gc2RXVnpLVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkbUZzZFdWY2JpQWdJQ0I5WEc1Y2JpQWdJQ0IwY21GdWMyeGhkR1VvYTJWNVRtRnRaU0E5SUc1MWJHd3NJR2x1YW1WamRDQTlJSHQ5S1NCN1hHNGdJQ0FnSUNCc1pYUWdaR0YwWVNBOUlIUm9hWE11YjNCMGFXOXVjeTVrWVhSaFczUm9hWE11YjNCMGFXOXVjeTVzYjJOaGJHVmRYRzRnSUNBZ0lDQnBaaUFvSVdSaGRHRXBJSHRjYmlBZ0lDQWdJQ0FnWkdGMFlTQTlJSFJvYVhNdWIzQjBhVzl1Y3k1a1lYUmhXM1JvYVhNdWIzQjBhVzl1Y3k1bVlXeHNZbUZqYTB4dlkyRnNaVjFjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnYVdZZ0tHdGxlVTVoYldVZ1BUMDlJRzUxYkd3Z2ZId2dhMlY1VG1GdFpTQTlQVDBnSnlvbklIeDhJRUZ5Y21GNUxtbHpRWEp5WVhrb2EyVjVUbUZ0WlNrcElIdGNiaUFnSUNBZ0lDQWdhV1lnS0VGeWNtRjVMbWx6UVhKeVlYa29hMlY1VG1GdFpTa3BJSHRjYmlBZ0lDQWdJQ0FnSUNCamIyNXpkQ0JyWlhseklEMGdUMkpxWldOMExtdGxlWE1vWkdGMFlTa3VabWxzZEdWeUtHdGxlU0E5UGlCclpYbE9ZVzFsTG1sdVpHVjRUMllvYTJWNUtTQStJQzB4S1Z4dUlDQWdJQ0FnSUNBZ0lHTnZibk4wSUdacGJIUmxjbVZrUkdGMFlTQTlJSHQ5WEc0Z0lDQWdJQ0FnSUNBZ2EyVjVjeTVtYjNKRllXTm9LR3RsZVNBOVBpQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCbWFXeDBaWEpsWkVSaGRHRmJhMlY1WFNBOUlIUm9hWE11YVc1elpYSjBWbUZzZFdWektHUmhkR0ZiYTJWNVhTd2dhVzVxWldOMEtWeHVJQ0FnSUNBZ0lDQWdJSDBwWEc0Z0lDQWdJQ0FnSUNBZ1pHRjBZU0E5SUdacGJIUmxjbVZrUkdGMFlWeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdaR0YwWVUxaGNDQTlJSHQ5WEc0Z0lDQWdJQ0FnSUdadmNpQW9ZMjl1YzNRZ2EyVjVJR2x1SUdSaGRHRXBJSHRjYmlBZ0lDQWdJQ0FnSUNCa1lYUmhUV0Z3VzJ0bGVWMGdQU0IwYUdsekxtbHVjMlZ5ZEZaaGJIVmxjeWhrWVhSaFcydGxlVjBzSUdsdWFtVmpkQ2xjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCa1lYUmhUV0Z3WEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhKbGRIVnliaUIwYUdsekxtbHVjMlZ5ZEZaaGJIVmxjeWhrWVhSaFcydGxlVTVoYldWZExDQnBibXBsWTNRcFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnTHk4Z1lXeHBZWE1nYjJZZ2RDZ3BYRzRnSUNBZ2RDaHJaWGxPWVcxbElEMGdiblZzYkN3Z2FXNXFaV04wSUQwZ2UzMHBJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQjBhR2x6TG5SeVlXNXpiR0YwWlNoclpYbE9ZVzFsTENCcGJtcGxZM1FwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdMeW9xWEc0Z0lDQWdJQ29nVlhCa1lYUmxjeUIwYUdVZ1NGUk5UQ0IyYVdWM2MxeHVJQ0FnSUNBcUlFQndZWEpoYlNCN1NGUk5URVZzWlcxbGJuUjlJR1ZzWlcxbGJuUmNiaUFnSUNBZ0tpOWNiaUFnSUNCMWNHUmhkR1ZJZEcxc0tHVnNaVzFsYm5RcElIdGNiaUFnSUNBZ0lHbG1JQ2gwZVhCbGIyWWdaV3hsYldWdWRDQTlQVDBnSjNWdVpHVm1hVzVsWkNjcElIdGNiaUFnSUNBZ0lDQWdaV3hsYldWdWRDQTlJR1J2WTNWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNKQmJHd29KMXRrWVhSaExXa3hPRzVkSnlsY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2FXWWdLSFI1Y0dWdlppQmxiR1Z0Wlc1MElEMDlQU0FuYzNSeWFXNW5KeWtnZTF4dUlDQWdJQ0FnSUNCbGJHVnRaVzUwSUQwZ1pHOWpkVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZjaWhsYkdWdFpXNTBLVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0J1WlhjZ1FtbHVaR1Z5S0dWc1pXMWxiblFzSUhSb2FYTXVkQ2dwS1Z4dUlDQWdJSDFjYmx4dUlDQWdJQzh2SUhOMFlYUnBZMXh1SUNBZ0lITjBZWFJwWXlCZlJFOU5TVzUwWlhKbVlXTmxLRzl3ZEdsdmJuTXBJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQnVaWGNnU1c1MGJDaHZjSFJwYjI1ektWeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lISmxkSFZ5YmlCSmJuUnNYRzU5S1NncFhHNWNibVY0Y0c5eWRDQmtaV1poZFd4MElFbHVkR3hjYmlJc0lpOHFLbHh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxSUV4cFkyVnVjMlZrSUhWdVpHVnlJRTFKVkNBb2FIUjBjSE02THk5bmFYUm9kV0l1WTI5dEwzRjFZWEpyTFdSbGRpOVFhRzl1YjI0dFJuSmhiV1YzYjNKckwySnNiMkl2YldGemRHVnlMMHhKUTBWT1UwVXBYRzRnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ292WEc1Y2JtbHRjRzl5ZENCRmRtVnVkQ0JtY205dElDY3VMaTlsZG1WdWRITW5YRzVwYlhCdmNuUWdRMjl0Y0c5dVpXNTBJR1p5YjIwZ0p5NHVMeTR1TDJOdmJYQnZibVZ1ZEhNdlkyOXRjRzl1Wlc1MEoxeHVhVzF3YjNKMElIc2daR2x6Y0dGMFkyaFhhVzVFYjJORmRtVnVkQ0I5SUdaeWIyMGdKeTR1TDJWMlpXNTBjeTlrYVhOd1lYUmphQ2RjYmx4dVkyOXVjM1FnVG1WMGQyOXlheUE5SUNnb0tTQTlQaUI3WEc0Z0lDOHFLbHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvZ1EyOXVjM1JoYm5SelhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaTljYmx4dUlDQmpiMjV6ZENCT1FVMUZJRDBnSjI1bGRIZHZjbXNuWEc0Z0lHTnZibk4wSUZaRlVsTkpUMDRnUFNBbk1pNHdMakFuWEc0Z0lHTnZibk4wSUVSRlJrRlZURlJmVUZKUFVFVlNWRWxGVXlBOUlIdGNiaUFnSUNCbGJHVnRaVzUwT2lCdWRXeHNMRnh1SUNBZ0lHbHVhWFJwWVd4RVpXeGhlVG9nTXpBd01DeGNiaUFnSUNCa1pXeGhlVG9nTlRBd01DeGNiaUFnZlZ4dUlDQmpiMjV6ZENCRVFWUkJYMEZVVkZKVFgxQlNUMUJGVWxSSlJWTWdQU0JiWEc0Z0lGMWNibHh1SUNBdktpcGNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxSUVOc1lYTnpJRVJsWm1sdWFYUnBiMjVjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUwxeHVYRzRnSUdOc1lYTnpJRTVsZEhkdmNtc2daWGgwWlc1a2N5QkRiMjF3YjI1bGJuUWdlMXh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRU55WldGMFpYTWdZVzRnYVc1emRHRnVZMlVnYjJZZ1RtVjBkMjl5YXk1Y2JpQWdJQ0FnS2lCQWNHRnlZVzBnZTN0OWZTQmJiM0IwYVc5dWN6MTdmVjFjYmlBZ0lDQWdLaTljYmlBZ0lDQmpiMjV6ZEhKMVkzUnZjaWh2Y0hScGIyNXpJRDBnZTMwcElIdGNiaUFnSUNBZ0lITjFjR1Z5S0U1QlRVVXNJRlpGVWxOSlQwNHNJRVJGUmtGVlRGUmZVRkpQVUVWU1ZFbEZVeXdnYjNCMGFXOXVjeXdnUkVGVVFWOUJWRlJTVTE5UVVrOVFSVkpVU1VWVExDQjBjblZsTENCbVlXeHpaU2xjYmx4dUlDQWdJQ0FnZEdocGN5NTRhSElnUFNCdWRXeHNYRzRnSUNBZ0lDQjBhR2x6TG1Ob1pXTnJTVzUwWlhKMllXd2dQU0J1ZFd4c1hHNWNiaUFnSUNBZ0lIUm9hWE11YzJWMFUzUmhkSFZ6S0VWMlpXNTBMazVGVkZkUFVrdGZUMDVNU1U1RktWeHVYRzRnSUNBZ0lDQnpaWFJVYVcxbGIzVjBLQ2dwSUQwK0lIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1emRHRnlkRU5vWldOcktDbGNiaUFnSUNBZ0lIMHNJSFJvYVhNdWIzQjBhVzl1Y3k1cGJtbDBhV0ZzUkdWc1lYa3BYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1oyVjBVM1JoZEhWektDa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlIUm9hWE11YzNSaGRIVnpYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MyVjBVM1JoZEhWektITjBZWFIxY3lrZ2UxeHVJQ0FnSUNBZ2RHaHBjeTV6ZEdGMGRYTWdQU0J6ZEdGMGRYTmNiaUFnSUNCOVhHNWNiaUFnSUNCemRHRnlkRkpsY1hWbGMzUW9LU0I3WEc0Z0lDQWdJQ0IwYUdsekxuaG9jaUE5SUc1bGR5QllUVXhJZEhSd1VtVnhkV1Z6ZENncFhHNGdJQ0FnSUNCMGFHbHpMbmhvY2k1dlptWnNhVzVsSUQwZ1ptRnNjMlZjYmx4dUlDQWdJQ0FnWTI5dWMzUWdkWEpzSUQwZ1lDOW1ZWFpwWTI5dUxtbGpiejlmUFNSN2JtVjNJRVJoZEdVb0tTNW5aWFJVYVcxbEtDbDlZRnh1WEc0Z0lDQWdJQ0IwYUdsekxuUnlhV2RuWlhKRmRtVnVkQ2hGZG1WdWRDNU9SVlJYVDFKTFgxSkZRMDlPVGtWRFZFbE9SeXdnZXlCa1lYUmxPaUJ1WlhjZ1JHRjBaU2dwSUgwc0lHWmhiSE5sS1NBZ0lDQWdJQ0FnSUNBZ0lGeHVYRzRnSUNBZ0lDQjBhR2x6TG5ob2NpNXZjR1Z1S0NkSVJVRkVKeXdnZFhKc0xDQjBjblZsS1Z4dVhHNGdJQ0FnSUNCMGFHbHpMbmhvY2k1MGFXMWxiM1YwSUQwZ2RHaHBjeTV2Y0hScGIyNXpMbVJsYkdGNUlDMGdNVnh1SUNBZ0lDQWdkR2hwY3k1NGFISXViMjUwYVcxbGIzVjBJRDBnS0NrZ1BUNGdlMXh1SUNBZ0lDQWdJQ0IwYUdsekxuaG9jaTVoWW05eWRDZ3BYRzRnSUNBZ0lDQWdJSFJvYVhNdWVHaHlJRDBnYm5Wc2JGeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQjBhR2x6TG5ob2NpNXZibXh2WVdRZ1BTQW9LU0E5UGlCN1hHNGdJQ0FnSUNBZ0lIUm9hWE11YjI1VmNDZ3BYRzRnSUNBZ0lDQjlYRzRnSUNBZ0lDQjBhR2x6TG5ob2NpNXZibVZ5Y205eUlEMGdLQ2tnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TG05dVJHOTNiaWdwWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhSeWVTQjdYRzRnSUNBZ0lDQWdJSFJvYVhNdWVHaHlMbk5sYm1Rb0tWeHVJQ0FnSUNBZ2ZTQmpZWFJqYUNBb1pTa2dlMXh1SUNBZ0lDQWdJQ0IwYUdsekxtOXVSRzkzYmlncFhHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYjI1VmNDZ3BJSHRjYmlBZ0lDQWdJSFJvYVhNdWRISnBaMmRsY2tWMlpXNTBLRVYyWlc1MExrNUZWRmRQVWt0ZlVrVkRUMDVPUlVOVVNVNUhYMU5WUTBORlUxTXNJSHNnWkdGMFpUb2dibVYzSUVSaGRHVW9LU0I5TENCbVlXeHpaU2xjYmx4dUlDQWdJQ0FnYVdZZ0tIUm9hWE11WjJWMFUzUmhkSFZ6S0NrZ0lUMDlJRVYyWlc1MExrNUZWRmRQVWt0ZlQwNU1TVTVGS1NCN1hHNGdJQ0FnSUNBZ0lIUm9hWE11ZEhKcFoyZGxja1YyWlc1MEtFVjJaVzUwTGs1RlZGZFBVa3RmVDA1TVNVNUZMQ0I3SUdSaGRHVTZJRzVsZHlCRVlYUmxLQ2tnZlN3Z1ptRnNjMlVwWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhSb2FYTXVjMlYwVTNSaGRIVnpLRVYyWlc1MExrNUZWRmRQVWt0ZlQwNU1TVTVGS1NBZ0lDQWdJRnh1SUNBZ0lIMWNibHh1SUNBZ0lHOXVSRzkzYmlncElIdGNiaUFnSUNBZ0lIUm9hWE11ZEhKcFoyZGxja1YyWlc1MEtFVjJaVzUwTGs1RlZGZFBVa3RmVWtWRFQwNU9SVU5VU1U1SFgwWkJTVXhWVWtVc0lIc2daR0YwWlRvZ2JtVjNJRVJoZEdVb0tTQjlMQ0JtWVd4elpTbGNibHh1SUNBZ0lDQWdhV1lnS0hSb2FYTXVaMlYwVTNSaGRIVnpLQ2tnSVQwOUlFVjJaVzUwTGs1RlZGZFBVa3RmVDBaR1RFbE9SU2tnZTF4dUlDQWdJQ0FnSUNCMGFHbHpMblJ5YVdkblpYSkZkbVZ1ZENoRmRtVnVkQzVPUlZSWFQxSkxYMDlHUmt4SlRrVXNJSHNnWkdGMFpUb2dibVYzSUVSaGRHVW9LU0I5TENCbVlXeHpaU2xjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnZEdocGN5NXpaWFJUZEdGMGRYTW9SWFpsYm5RdVRrVlVWMDlTUzE5UFJrWk1TVTVGS1NBZ0lDQWdJRnh1SUNBZ0lIMWNibHh1SUNBZ0lITjBZWEowUTJobFkyc29LU0I3WEc0Z0lDQWdJQ0IwYUdsekxuTjBiM0JEYUdWamF5Z3BYRzVjYmlBZ0lDQWdJSFJvYVhNdWMzUmhjblJTWlhGMVpYTjBLQ2tnSUNBZ0lDQmNibHh1SUNBZ0lDQWdkR2hwY3k1amFHVmphMGx1ZEdWeWRtRnNJRDBnYzJWMFNXNTBaWEoyWVd3b0tDa2dQVDRnZTF4dUlDQWdJQ0FnSUNCMGFHbHpMbk4wWVhKMFVtVnhkV1Z6ZENncFhHNGdJQ0FnSUNCOUxDQjBhR2x6TG05d2RHbHZibk11WkdWc1lYa3BYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MzUnZjRU5vWldOcktDa2dlMXh1SUNBZ0lDQWdhV1lnS0hSb2FYTXVZMmhsWTJ0SmJuUmxjblpoYkNBaFBUMGdiblZzYkNrZ2UxeHVJQ0FnSUNBZ0lDQmpiR1ZoY2tsdWRHVnlkbUZzS0hSb2FYTXVZMmhsWTJ0SmJuUmxjblpoYkNsY2JpQWdJQ0FnSUNBZ2RHaHBjeTVqYUdWamEwbHVkR1Z5ZG1Gc0lEMGdiblZzYkZ4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmx4dUlDQWdJSE4wWVhScFl5QmZSRTlOU1c1MFpYSm1ZV05sS0c5d2RHbHZibk1wSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJ6ZFhCbGNpNWZSRTlOU1c1MFpYSm1ZV05sS0U1bGRIZHZjbXNzSUc5d2RHbHZibk1wWEc0Z0lDQWdmVnh1SUNCOVhHNWNiaUFnY21WMGRYSnVJRTVsZEhkdmNtdGNibjBwS0NsY2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ1RtVjBkMjl5YTF4dUlpd2lMeW9xWEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvZ1RHbGpaVzV6WldRZ2RXNWtaWElnVFVsVUlDaG9kSFJ3Y3pvdkwyZHBkR2gxWWk1amIyMHZjWFZoY21zdFpHVjJMMUJvYjI1dmJpMUdjbUZ0WlhkdmNtc3ZZbXh2WWk5dFlYTjBaWEl2VEVsRFJVNVRSU2xjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2k5Y2JseHVhVzF3YjNKMElGQmhaMlVnWm5KdmJTQW5MaTl3WVdkbEoxeHVhVzF3YjNKMElFVjJaVzUwSUdaeWIyMGdKeTR1THk0dUwyTnZjbVV2WlhabGJuUnpKMXh1WEc1amIyNXpkQ0JRWVdkbGNpQTlJQ2dvS1NBOVBpQjdYRzRnSUM4cUtseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ29nUTI5dWMzUmhiblJ6WEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpOWNibHh1SUNCamIyNXpkQ0JPUVUxRklEMGdKM0JoWjJWeUoxeHVJQ0JqYjI1emRDQldSVkpUU1U5T0lEMGdKekl1TUM0d0oxeHVJQ0JqYjI1emRDQkVSVVpCVlV4VVgxQlNUMUJGVWxSSlJWTWdQU0I3WEc0Z0lDQWdhR0Z6YUZCeVpXWnBlRG9nSnlNaEp5eGNiaUFnSUNCMWMyVklZWE5vT2lCMGNuVmxMRnh1SUNBZ0lHUmxabUYxYkhSUVlXZGxPaUJ1ZFd4c0xGeHVJQ0FnSUdGdWFXMWhkR1ZRWVdkbGN6b2dkSEoxWlN4Y2JpQWdmVnh1WEc0Z0lHeGxkQ0JqZFhKeVpXNTBVR0ZuWlZ4dUlDQXZLaXBjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUlFTnNZWE56SUVSbFptbHVhWFJwYjI1Y2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFMMXh1WEc0Z0lHTnNZWE56SUZCaFoyVnlJSHRjYmlBZ0lDQXZLaXBjYmlBZ0lDQWdLaUJBWTI5dWMzUnlkV04wYjNKY2JpQWdJQ0FnS2x4dUlDQWdJQ0FxSUVCd1lYSmhiU0J2Y0hScGIyNXpJSHRQWW1wbFkzUjlYRzRnSUNBZ0lDb3ZYRzRnSUNBZ1kyOXVjM1J5ZFdOMGIzSW9iM0IwYVc5dWN5QTlJSHQ5S1NCN1hHNGdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTWdQU0JQWW1wbFkzUXVZWE56YVdkdUtFUkZSa0ZWVEZSZlVGSlBVRVZTVkVsRlV5d2diM0IwYVc5dWN5bGNibHh1SUNBZ0lDQWdkR2hwY3k1d1lXZGxjeUE5SUZ0ZFhHNGdJQ0FnSUNCMGFHbHpMbk4wWVhKMFpXUWdQU0JtWVd4elpWeHVYRzRnSUNBZ0lDQXZMeUJoWkdRZ1oyeHZZbUZzSUd4cGMzUmxibVZ5Y3lCemRXTm9JR0Z6YUNCb1lYTm9JR05vWVc1blpTd2dibUYyYVdkaGRHbHZiaXdnWlhSakxseHVJQ0FnSUNBZ2RHaHBjeTVoWkdSUVlXZGxja1YyWlc1MGN5Z3BYRzVjYmlBZ0lDQWdJQzh2SUdaaGMzUmxjaUIzWVhrZ2RHOGdhVzVwZENCd1lXZGxjeUJpWldadmNtVWdkR2hsSUVSUFRTQnBjeUJ5WldGa2VWeHVJQ0FnSUNBZ2RHaHBjeTV2YmtSUFRVeHZZV1JsWkNncFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnTHk4Z2NISnBkbUYwWlZ4dUlDQWdJRjhvYzJWc1pXTjBiM0lwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJrYjJOMWJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eUtITmxiR1ZqZEc5eUtWeHVJQ0FnSUgxY2JseHVJQ0FnSUdkbGRFaGhjMmdvS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnZDJsdVpHOTNMbXh2WTJGMGFXOXVMbWhoYzJndWMzQnNhWFFvZEdocGN5NXZjSFJwYjI1ekxtaGhjMmhRY21WbWFYZ3BXekZkWEc0Z0lDQWdmVnh1WEc0Z0lDQWdaMlYwVUdGblpVWnliMjFJWVhOb0tDa2dlMXh1SUNBZ0lDQWdZMjl1YzNRZ2FHRnphQ0E5SUhSb2FYTXVaMlYwU0dGemFDZ3BYRzRnSUNBZ0lDQmpiMjV6ZENCeVpTQTlJRzVsZHlCU1pXZEZlSEFvSjFzL1hGd3ZYU2hiWGx4Y0wxMHFLU2NwWEc0Z0lDQWdJQ0JqYjI1emRDQnRZWFJqYUdWeklEMGdjbVV1WlhobFl5aG9ZWE5vS1Z4dVhHNGdJQ0FnSUNCcFppQW9iV0YwWTJobGN5QW1KaUJ0WVhSamFHVnpXekZkS1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCdFlYUmphR1Z6V3pGZFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lISmxkSFZ5YmlCdWRXeHNYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MyVjBTR0Z6YUNod1lXZGxUbUZ0WlNrZ2UxeHVJQ0FnSUNBZ2QybHVaRzkzTG14dlkyRjBhVzl1TG1oaGMyZ2dQU0JnSkh0MGFHbHpMbTl3ZEdsdmJuTXVhR0Z6YUZCeVpXWnBlSDB2Skh0d1lXZGxUbUZ0WlgxZ1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnWVhKbFUyRnRaVkJoWjJVb2NHRm5aVTVoYldVeExDQndZV2RsVG1GdFpUSXBJSHRjYmlBZ0lDQWdJR052Ym5OMElIQmhaMlV4SUQwZ2RHaHBjeTVuWlhSUVlXZGxUVzlrWld3b2NHRm5aVTVoYldVeEtWeHVJQ0FnSUNBZ1kyOXVjM1FnY0dGblpUSWdQU0IwYUdsekxtZGxkRkJoWjJWTmIyUmxiQ2h3WVdkbFRtRnRaVElwWEc0Z0lDQWdJQ0J5WlhSMWNtNGdjR0ZuWlRFZ0ppWWdjR0ZuWlRJZ0ppWWdjR0ZuWlRFdWJtRnRaU0E5UFQwZ2NHRm5aVEl1Ym1GdFpWeHVJQ0FnSUgxY2JseHVJQ0FnSUM4cUtseHVJQ0FnSUNBcUlFRjBkR0ZqYUdWeklIUm9aU0J0WVdsdUlHVjJaVzUwY3lCbWIzSWdkSEpoWTJ0cGJtY2dhR0Z6YUNCamFHRnVaMlZ6TEZ4dUlDQWdJQ0FxSUdOc2FXTnJJRzl1SUc1aGRtbG5ZWFJwYjI0Z1luVjBkRzl1Y3lCaGJtUWdiR2x1YTNNZ1lXNWtJR0poWTJzZ2FHbHpkRzl5ZVZ4dUlDQWdJQ0FxTDF4dUlDQWdJR0ZrWkZCaFoyVnlSWFpsYm5SektDa2dlMXh1SUNBZ0lDQWdaRzlqZFcxbGJuUXVZV1JrUlhabGJuUk1hWE4wWlc1bGNpZ25ZMnhwWTJzbkxDQmxkbVZ1ZENBOVBpQjBhR2x6TG05dVEyeHBZMnNvWlhabGJuUXBLVnh1SUNBZ0lDQWdkMmx1Wkc5M0xtRmtaRVYyWlc1MFRHbHpkR1Z1WlhJb0ozQnZjSE4wWVhSbEp5d2daWFpsYm5RZ1BUNGdkR2hwY3k1dmJrSmhZMnRJYVhOMGIzSjVLR1YyWlc1MEtTbGNiaUFnSUNBZ0lIZHBibVJ2ZHk1aFpHUkZkbVZ1ZEV4cGMzUmxibVZ5S0Nkb1lYTm9ZMmhoYm1kbEp5d2daWFpsYm5RZ1BUNGdkR2hwY3k1dmJraGhjMmhEYUdGdVoyVW9aWFpsYm5RcEtWeHVJQ0FnSUNBZ1pHOWpkVzFsYm5RdVlXUmtSWFpsYm5STWFYTjBaVzVsY2lnblJFOU5RMjl1ZEdWdWRFeHZZV1JsWkNjc0lHVjJaVzUwSUQwK0lIUm9hWE11YjI1RVQwMU1iMkZrWldRb1pYWmxiblFwS1Z4dUlDQWdJSDFjYmx4dUlDQWdJQzh2SUdkbGRIUmxjbk5jYmx4dUlDQWdJSE4wWVhScFl5Qm5aWFFnZG1WeWMybHZiaWdwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJnSkh0T1FVMUZmUzRrZTFaRlVsTkpUMDU5WUZ4dUlDQWdJSDFjYmx4dUlDQWdJQzh2SUhCMVlteHBZMXh1WEc0Z0lDQWdjMmh2ZDFCaFoyVW9jR0ZuWlU1aGJXVXNJR0ZrWkZSdlNHbHpkRzl5ZVNBOUlIUnlkV1VzSUdKaFkyc2dQU0JtWVd4elpTa2dlMXh1SUNBZ0lDQWdZMjl1YzNRZ2IyeGtVR0ZuWlNBOUlIUm9hWE11WHlnbkxtTjFjbkpsYm5RbktWeHVJQ0FnSUNBZ2FXWWdLRzlzWkZCaFoyVXBJSHRjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdiMnhrVUdGblpVNWhiV1VnUFNCdmJHUlFZV2RsTG1kbGRFRjBkSEpwWW5WMFpTZ25aR0YwWVMxd1lXZGxKeWxjYmx4dUlDQWdJQ0FnSUNCcFppQW9kR2hwY3k1aGNtVlRZVzFsVUdGblpTaHdZV2RsVG1GdFpTd2diMnhrVUdGblpVNWhiV1VwS1NCN1hHNGdJQ0FnSUNBZ0lDQWdjbVYwZFhKdVhHNGdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0J2YkdSUVlXZGxMbU5zWVhOelRHbHpkQzV5WlcxdmRtVW9KMk4xY25KbGJuUW5LVnh1WEc0Z0lDQWdJQ0FnSUM4dklHaHBjM1J2Y25sY2JpQWdJQ0FnSUNBZ2QybHVaRzkzTG1ocGMzUnZjbmt1Y21Wd2JHRmpaVk4wWVhSbEtIc2djR0ZuWlRvZ2IyeGtVR0ZuWlU1aGJXVWdmU3dnYjJ4a1VHRm5aVTVoYldVc0lIZHBibVJ2ZHk1c2IyTmhkR2x2Ymk1b2NtVm1LVnh1WEc0Z0lDQWdJQ0FnSUhSb2FYTXVkSEpwWjJkbGNsQmhaMlZGZG1WdWRDaHZiR1JRWVdkbFRtRnRaU3dnUlhabGJuUXVTRWxFUlNsY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2RHaHBjeTUwY21sbloyVnlVR0ZuWlVWMlpXNTBLSEJoWjJWT1lXMWxMQ0JGZG1WdWRDNVRTRTlYS1Z4dVhHNGdJQ0FnSUNCamRYSnlaVzUwVUdGblpTQTlJSEJoWjJWT1lXMWxYRzVjYmlBZ0lDQWdJQzh2SUc1bGR5QndZV2RsWEc0Z0lDQWdJQ0JqYjI1emRDQnVaWGRRWVdkbElEMGdkR2hwY3k1ZktHQmJaR0YwWVMxd1lXZGxQVndpSkh0d1lXZGxUbUZ0WlgxY0lsMWdLVnh1WEc0Z0lDQWdJQ0J1WlhkUVlXZGxMbU5zWVhOelRHbHpkQzVoWkdRb0oyTjFjbkpsYm5RbktWeHVYRzRnSUNBZ0lDQXZMeUIwWlcxd2JHRjBaU0JzYjJGa1pYSmNiaUFnSUNBZ0lHTnZibk4wSUhCaFoyVk5iMlJsYkNBOUlIUm9hWE11WjJWMFVHRm5aVTF2WkdWc0tIQmhaMlZPWVcxbEtWeHVYRzRnSUNBZ0lDQXZMeUJBZEc5a2J6b2dkWE5sSUhSbGJYQnNZWFJsSUdOaFkyaGxQMXh1SUNBZ0lDQWdhV1lnS0hCaFoyVk5iMlJsYkNBbUppQndZV2RsVFc5a1pXd3VaMlYwVkdWdGNHeGhkR1VvS1NrZ2UxeHVJQ0FnSUNBZ0lDQndZV2RsVFc5a1pXd3ViRzloWkZSbGJYQnNZWFJsS0NsY2JpQWdJQ0FnSUgxY2JpQWdJQ0FnSUM4dklHVnVaRnh1WEc0Z0lDQWdJQ0JwWmlBb2IyeGtVR0ZuWlNrZ2UxeHVJQ0FnSUNBZ0lDQmpiMjV6ZENCdmJHUlFZV2RsVG1GdFpTQTlJRzlzWkZCaFoyVXVaMlYwUVhSMGNtbGlkWFJsS0Nka1lYUmhMWEJoWjJVbktWeHVJQ0FnSUNBZ0lDQXZMeUIxYzJVZ2IyWWdjSEp2ZEc5MGVYQmxMVzl5YVdWdWRHVmtJR3hoYm1kMVlXZGxYRzRnSUNBZ0lDQWdJRzlzWkZCaFoyVXVZbUZqYXlBOUlHSmhZMnRjYmlBZ0lDQWdJQ0FnYjJ4a1VHRm5aUzV3Y21WMmFXOTFjMUJoWjJWT1lXMWxJRDBnYjJ4a1VHRm5aVTVoYldWY2JseHVJQ0FnSUNBZ0lDQmpiMjV6ZENCdmJsQmhaMlZCYm1sdFlYUnBiMjVGYm1RZ1BTQW9LU0E5UGlCN1hHNGdJQ0FnSUNBZ0lDQWdhV1lnS0c5c1pGQmhaMlV1WTJ4aGMzTk1hWE4wTG1OdmJuUmhhVzV6S0NkaGJtbHRZWFJsSnlrcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUc5c1pGQmhaMlV1WTJ4aGMzTk1hWE4wTG5KbGJXOTJaU2duWVc1cGJXRjBaU2NwWEc0Z0lDQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJQ0FnYjJ4a1VHRm5aUzVqYkdGemMweHBjM1F1Y21WdGIzWmxLRzlzWkZCaFoyVXVZbUZqYXlBL0lDZHdiM0F0Y0dGblpTY2dPaUFuY0hWemFDMXdZV2RsSnlsY2JseHVJQ0FnSUNBZ0lDQWdJSFJvYVhNdWRISnBaMmRsY2xCaFoyVkZkbVZ1ZENoamRYSnlaVzUwVUdGblpTd2dSWFpsYm5RdVUwaFBWMDRwWEc0Z0lDQWdJQ0FnSUNBZ2RHaHBjeTUwY21sbloyVnlVR0ZuWlVWMlpXNTBLRzlzWkZCaFoyVXVjSEpsZG1sdmRYTlFZV2RsVG1GdFpTd2dSWFpsYm5RdVNFbEVSRVZPS1Z4dVhHNGdJQ0FnSUNBZ0lDQWdiMnhrVUdGblpTNXlaVzF2ZG1WRmRtVnVkRXhwYzNSbGJtVnlLRVYyWlc1MExrRk9TVTFCVkVsUFRsOUZUa1FzSUc5dVVHRm5aVUZ1YVcxaGRHbHZia1Z1WkNsY2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJR2xtSUNoMGFHbHpMbTl3ZEdsdmJuTXVZVzVwYldGMFpWQmhaMlZ6S1NCN1hHNGdJQ0FnSUNBZ0lDQWdiMnhrVUdGblpTNWhaR1JGZG1WdWRFeHBjM1JsYm1WeUtFVjJaVzUwTGtGT1NVMUJWRWxQVGw5RlRrUXNJRzl1VUdGblpVRnVhVzFoZEdsdmJrVnVaQ2xjYmlBZ0lDQWdJQ0FnSUNCdmJHUlFZV2RsTG1Oc1lYTnpUR2x6ZEM1aFpHUW9KMkZ1YVcxaGRHVW5LVnh1SUNBZ0lDQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdJQ0FnSUc5dVVHRm5aVUZ1YVcxaGRHbHZia1Z1WkNncFhHNGdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0J2YkdSUVlXZGxMbU5zWVhOelRHbHpkQzVoWkdRb1ltRmpheUEvSUNkd2IzQXRjR0ZuWlNjZ09pQW5jSFZ6YUMxd1lXZGxKeWxjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzVjYmlBZ0lDQmhaR1JWYm1seGRXVlFZV2RsVFc5a1pXd29jR0ZuWlU1aGJXVXBJSHRjYmlBZ0lDQWdJR2xtSUNnaGRHaHBjeTVuWlhSUVlXZGxUVzlrWld3b2NHRm5aVTVoYldVcEtTQjdYRzRnSUNBZ0lDQWdJSFJvYVhNdWNHRm5aWE11Y0hWemFDaHVaWGNnVUdGblpTaHdZV2RsVG1GdFpTa3BYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1oyVjBVR0ZuWlUxdlpHVnNLSEJoWjJWT1lXMWxLU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkR2hwY3k1d1lXZGxjeTVtYVc1a0tIQmhaMlVnUFQ0Z2NHRm5aUzV1WVcxbElEMDlQU0J3WVdkbFRtRnRaU2xjYmlBZ0lDQjlYRzVjYmlBZ0lDQm5aWFJRWVdkbGMwMXZaR1ZzS0hCaFoyVk9ZVzFsY3lrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTXVjR0ZuWlhNdVptbHNkR1Z5S0hCaFoyVWdQVDRnY0dGblpVNWhiV1Z6TG1sdVpHVjRUMllvY0dGblpTNXVZVzFsS1NBK0lDMHhLVnh1SUNBZ0lIMWNibHh1SUNBZ0lITmxiR1ZqZEc5eVZHOUJjbkpoZVNoemRISXBJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQnpkSEl1YzNCc2FYUW9KeXduS1M1dFlYQW9hWFJsYlNBOVBpQnBkR1Z0TG5SeWFXMG9LU2xjYmlBZ0lDQjlYRzVjYmlBZ0lDQmhaR1JGZG1WdWRITW9ZMkZzYkdKaFkyc3BJSHRjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbU5oWTJobFVHRm5aVk5sYkdWamRHOXlJRDA5UFNBbktpY3BJSHRjYmlBZ0lDQWdJQ0FnTHk4Z1lXUmtJSFJ2SUdGc2JDQndZV2RsSUcxdlpHVnNjMXh1SUNBZ0lDQWdJQ0IwYUdsekxuQmhaMlZ6TG1admNrVmhZMmdvS0hCaFoyVXBJRDArSUh0Y2JpQWdJQ0FnSUNBZ0lDQndZV2RsTG1Ga1pFVjJaVzUwUTJGc2JHSmhZMnNvWTJGc2JHSmhZMnNwWEc0Z0lDQWdJQ0FnSUgwcFhHNGdJQ0FnSUNBZ0lISmxkSFZ5Ymx4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCamIyNXpkQ0J3WVdkbFRXOWtaV3h6SUQwZ2RHaHBjeTVuWlhSUVlXZGxjMDF2WkdWc0tIUm9hWE11YzJWc1pXTjBiM0pVYjBGeWNtRjVLSFJvYVhNdVkyRmphR1ZRWVdkbFUyVnNaV04wYjNJcExDQjBjblZsS1Z4dUlDQWdJQ0FnY0dGblpVMXZaR1ZzY3k1bWIzSkZZV05vS0Nod1lXZGxLU0E5UGlCN1hHNGdJQ0FnSUNBZ0lIQmhaMlV1WVdSa1JYWmxiblJEWVd4c1ltRmpheWhqWVd4c1ltRmpheWxjYmlBZ0lDQWdJSDBwWEc0Z0lDQWdJQ0IwYUdsekxtTmhZMmhsVUdGblpWTmxiR1ZqZEc5eUlEMGdiblZzYkZ4dUlDQWdJSDFjYmx4dUlDQWdJSFZ6WlZSbGJYQnNZWFJsS0hSbGJYQnNZWFJsVUdGMGFDd2djbVZ1WkdWeVJuVnVZM1JwYjI0Z1BTQnVkV3hzS1NCN1hHNGdJQ0FnSUNCamIyNXpkQ0J3WVdkbFRXOWtaV3h6SUQwZ2RHaHBjeTVuWlhSUVlXZGxjMDF2WkdWc0tIUm9hWE11YzJWc1pXTjBiM0pVYjBGeWNtRjVLSFJvYVhNdVkyRmphR1ZRWVdkbFUyVnNaV04wYjNJcExDQjBjblZsS1Z4dUlDQWdJQ0FnY0dGblpVMXZaR1ZzY3k1bWIzSkZZV05vS0Nod1lXZGxLU0E5UGlCN1hHNGdJQ0FnSUNBZ0lIQmhaMlV1ZFhObFZHVnRjR3hoZEdVb2RHVnRjR3hoZEdWUVlYUm9LVnh1SUNBZ0lDQWdJQ0JwWmlBb2RIbHdaVzltSUhKbGJtUmxja1oxYm1OMGFXOXVJRDA5UFNBblpuVnVZM1JwYjI0bktTQjdYRzRnSUNBZ0lDQWdJQ0FnY0dGblpTNTFjMlZVWlcxd2JHRjBaVkpsYm1SbGNtVnlLSEpsYm1SbGNrWjFibU4wYVc5dUtWeHVJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQjlLVnh1SUNBZ0lDQWdkR2hwY3k1allXTm9aVkJoWjJWVFpXeGxZM1J2Y2lBOUlHNTFiR3hjYmlBZ0lDQjlYRzVjYmlBZ0lDQjBjbWxuWjJWeVVHRm5aVVYyWlc1MEtIQmhaMlZPWVcxbExDQmxkbVZ1ZEU1aGJXVXNJR1YyWlc1MFVHRnlZVzF6SUQwZ2JuVnNiQ2tnZTF4dUlDQWdJQ0FnWTI5dWMzUWdjR0ZuWlUxdlpHVnNJRDBnZEdocGN5NW5aWFJRWVdkbFRXOWtaV3dvY0dGblpVNWhiV1VwWEc0Z0lDQWdJQ0JwWmlBb2NHRm5aVTF2WkdWc0tTQjdYRzRnSUNBZ0lDQWdJSEJoWjJWTmIyUmxiQzUwY21sbloyVnlVMk52Y0dWektHVjJaVzUwVG1GdFpTd2daWFpsYm5SUVlYSmhiWE1wWEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1WEc0Z0lDQWdiMjVEYkdsamF5aGxkbVZ1ZENrZ2UxeHVJQ0FnSUNBZ1kyOXVjM1FnY0dGblpVNWhiV1VnUFNCbGRtVnVkQzUwWVhKblpYUXVaMlYwUVhSMGNtbGlkWFJsS0Nka1lYUmhMVzVoZG1sbllYUmxKeWxjYmlBZ0lDQWdJR052Ym5OMElIQjFjMmhRWVdkbElEMGdJU2hsZG1WdWRDNTBZWEpuWlhRdVoyVjBRWFIwY21saWRYUmxLQ2RrWVhSaExYQnZjQzF3WVdkbEp5a2dQVDA5SUNkMGNuVmxKeWxjYmx4dUlDQWdJQ0FnYVdZZ0tIQmhaMlZPWVcxbEtTQjdYRzRnSUNBZ0lDQWdJR2xtSUNod1lXZGxUbUZ0WlNBOVBUMGdKeVJpWVdOckp5a2dlMXh1SUNBZ0lDQWdJQ0FnSUM4dklIUm9aU0J3YjNCemRHRjBaU0JsZG1WdWRDQjNhV3hzSUdKbElIUnlhV2RuWlhKbFpGeHVJQ0FnSUNBZ0lDQWdJSGRwYm1SdmR5NW9hWE4wYjNKNUxtSmhZMnNvS1Z4dUlDQWdJQ0FnSUNBZ0lISmxkSFZ5Ymx4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdMeXBjYmlBZ0lDQWdJQ0FnSUNvZ1NXWWdkMlVnYUdVZ2RYTmxJSFJvWlNCb1lYTm9JR0Z6SUhSeWFXZG5aWElzWEc0Z0lDQWdJQ0FnSUNBcUlIZGxJR05vWVc1blpTQnBkQ0JrZVc1aGJXbGpZV3hzZVNCemJ5QjBhR0YwSUhSb1pTQm9ZWE5vWTJoaGJtZGxJR1YyWlc1MElHbHpJR05oYkd4bFpGeHVJQ0FnSUNBZ0lDQWdLaUJQZEdobGNuZHBjMlVzSUhkbElITm9iM2NnZEdobElIQmhaMlZjYmlBZ0lDQWdJQ0FnSUNvdlhHNGdJQ0FnSUNBZ0lHbG1JQ2gwYUdsekxtOXdkR2x2Ym5NdWRYTmxTR0Z6YUNrZ2UxeHVJQ0FnSUNBZ0lDQWdJSFJvYVhNdWMyVjBTR0Z6YUNod1lXZGxUbUZ0WlNsY2JpQWdJQ0FnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUNBZ0lDQjBhR2x6TG5Ob2IzZFFZV2RsS0hCaFoyVk9ZVzFsTENCMGNuVmxMQ0J3ZFhOb1VHRm5aU2xjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmx4dUlDQWdJRzl1UW1GamEwaHBjM1J2Y25rb1pYWmxiblFnUFNCN2ZTa2dlMXh1SUNBZ0lDQWdZMjl1YzNRZ2NHRm5aVTVoYldVZ1BTQmxkbVZ1ZEM1emRHRjBaU0EvSUdWMlpXNTBMbk4wWVhSbExuQmhaMlVnT2lCdWRXeHNYRzRnSUNBZ0lDQnBaaUFvSVhCaFoyVk9ZVzFsS1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5Ymx4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCMGFHbHpMbk5vYjNkUVlXZGxLSEJoWjJWT1lXMWxMQ0IwY25WbExDQjBjblZsS1Z4dUlDQWdJSDFjYmx4dUlDQWdJRzl1U0dGemFFTm9ZVzVuWlNncElIdGNiaUFnSUNBZ0lHTnZibk4wSUhCaGNtRnRjeUE5SUNoMGFHbHpMbWRsZEVoaGMyZ29LU0EvSUhSb2FYTXVaMlYwU0dGemFDZ3BMbk53YkdsMEtDY3ZKeWtnT2lCYlhTa3VabWxzZEdWeUtIQWdQVDRnY0M1c1pXNW5kR2dnUGlBd0tWeHVJQ0FnSUNBZ2FXWWdLSEJoY21GdGN5NXNaVzVuZEdnZ1BpQXdLU0I3WEc0Z0lDQWdJQ0FnSUM4dklISmxiVzkyWlNCbWFYSnpkQ0IyWVd4MVpTQjNhR2xqYUNCcGN5QjBhR1VnY0dGblpTQnVZVzFsWEc0Z0lDQWdJQ0FnSUhCaGNtRnRjeTV6YUdsbWRDZ3BYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSFJvYVhNdWRISnBaMmRsY2xCaFoyVkZkbVZ1ZENoamRYSnlaVzUwVUdGblpTd2dSWFpsYm5RdVNFRlRTQ3dnY0dGeVlXMXpLVnh1WEc0Z0lDQWdJQ0JqYjI1emRDQnVZWFpRWVdkbElEMGdkR2hwY3k1blpYUlFZV2RsUm5KdmJVaGhjMmdvS1Z4dUlDQWdJQ0FnYVdZZ0tHNWhkbEJoWjJVcElIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1emFHOTNVR0ZuWlNodVlYWlFZV2RsS1Z4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmx4dUlDQWdJQzhxS2x4dUlDQWdJQ0FxSUZGMVpYSnBaWE1nZEdobElIQmhaMlVnYm05a1pYTWdhVzRnZEdobElFUlBUVnh1SUNBZ0lDQXFMMXh1SUNBZ0lHOXVSRTlOVEc5aFpHVmtLQ2tnZTF4dUlDQWdJQ0FnWTI5dWMzUWdjR0ZuWlhNZ1BTQmtiMk4xYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5UVd4c0tDZGJaR0YwWVMxd1lXZGxYU2NwWEc1Y2JpQWdJQ0FnSUdsbUlDZ2hjR0ZuWlhNcElIdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdVhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lIQmhaMlZ6TG1admNrVmhZMmdvS0hCaFoyVXBJRDArSUh0Y2JpQWdJQ0FnSUNBZ2JHVjBJSEJoWjJWT1lXMWxJRDBnY0dGblpTNW5aWFJCZEhSeWFXSjFkR1VvSjJSaGRHRXRjR0ZuWlNjcFhHNGdJQ0FnSUNBZ0lDOHFYRzRnSUNBZ0lDQWdJQ0FxSUhSb1pTQndZV2RsSUc1aGJXVWdZMkZ1SUdKbElHZHBkbVZ1SUhkcGRHZ2dkR2hsSUdGMGRISnBZblYwWlNCa1lYUmhMWEJoWjJWY2JpQWdJQ0FnSUNBZ0lDb2diM0lnZDJsMGFDQnBkSE1nYm05a1pTQnVZVzFsWEc0Z0lDQWdJQ0FnSUNBcUwxeHVJQ0FnSUNBZ0lDQnBaaUFvSVhCaFoyVk9ZVzFsS1NCN1hHNGdJQ0FnSUNBZ0lDQWdjR0ZuWlU1aGJXVWdQU0J3WVdkbExtNXZaR1ZPWVcxbFhHNGdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0IwYUdsekxtRmtaRlZ1YVhGMVpWQmhaMlZOYjJSbGJDaHdZV2RsVG1GdFpTbGNiaUFnSUNBZ0lIMHBYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MyVnNaV04wS0hCaFoyVk9ZVzFsTENCaFpHUlFZV2RsVFc5a1pXd2dQU0IwY25WbEtTQjdYRzRnSUNBZ0lDQjBhR2x6TG1OaFkyaGxVR0ZuWlZObGJHVmpkRzl5SUQwZ2NHRm5aVTVoYldWY2JseHVJQ0FnSUNBZ2FXWWdLR0ZrWkZCaFoyVk5iMlJsYkNBbUppQndZV2RsVG1GdFpTQWhQVDBnSnlvbktTQjdYRzRnSUNBZ0lDQWdJSFJvYVhNdVlXUmtWVzVwY1hWbFVHRm5aVTF2WkdWc0tIQmhaMlZPWVcxbEtWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQnlaWFIxY200Z2RHaHBjMXh1SUNBZ0lIMWNibHh1SUNBZ0lITjBZWEowS0dadmNtTmxSR1ZtWVhWc2RGQmhaMlVnUFNCbVlXeHpaU2tnZTF4dUlDQWdJQ0FnTHk4Z1kyaGxZMnNnYVdZZ2RHaGxJR0Z3Y0NCb1lYTWdZbVZsYmlCaGJISmxZV1I1SUhOMFlYSjBaV1JjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbk4wWVhKMFpXUXBJSHRjYmlBZ0lDQWdJQ0FnZEdoeWIzY2dibVYzSUVWeWNtOXlLR0FrZTA1QlRVVjlMaUJVYUdVZ1lYQndJR2hoY3lCaVpXVnVJR0ZzY21WaFpIa2djM1JoY25SbFpDNWdLVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0IwYUdsekxuTjBZWEowWldRZ1BTQjBjblZsWEc1Y2JpQWdJQ0FnSUM4dklHWnZjbU5sSUdSbFptRjFiSFFnY0dGblpTQnZiaUJEYjNKa2IzWmhYRzRnSUNBZ0lDQnBaaUFvZDJsdVpHOTNMbU52Y21SdmRtRXBJSHRjYmlBZ0lDQWdJQ0FnWm05eVkyVkVaV1poZFd4MFVHRm5aU0E5SUhSeWRXVmNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdiR1YwSUhCaFoyVk9ZVzFsSUQwZ2RHaHBjeTVuWlhSUVlXZGxSbkp2YlVoaGMyZ29LVnh1SUNBZ0lDQWdhV1lnS0NGMGFHbHpMbWRsZEZCaFoyVk5iMlJsYkNod1lXZGxUbUZ0WlNrcElIdGNiaUFnSUNBZ0lDQWdjR0ZuWlU1aGJXVWdQU0IwYUdsekxtOXdkR2x2Ym5NdVpHVm1ZWFZzZEZCaFoyVmNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdhV1lnS0dadmNtTmxSR1ZtWVhWc2RGQmhaMlVnSmlZZ0lYUm9hWE11YjNCMGFXOXVjeTVrWldaaGRXeDBVR0ZuWlNrZ2UxeHVJQ0FnSUNBZ0lDQjBhSEp2ZHlCdVpYY2dSWEp5YjNJb1lDUjdUa0ZOUlgwdUlGUm9aU0JrWldaaGRXeDBJSEJoWjJVZ2JYVnpkQ0JsZUdsemRDQm1iM0lnWm05eVkybHVaeUJwZEhNZ2JHRjFibU5vSVdBcFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDOHZJRXh2WnlCMGFHVWdaR1YyYVdObElHbHVabTljYmlBZ0lDQWdJR2xtSUNod2FHOXViMjR1WkdWaWRXY3BJSHRjYmlBZ0lDQWdJQ0FnWTI5dWMyOXNaUzVzYjJjb0oxTjBZWEowYVc1bklGQm9iMjV2YmlCcGJpQW5JQ3NnY0d4aGRHWnZjbTB1WkdWelkzSnBjSFJwYjI0cFhHNGdJQ0FnSUNBZ0lHTnZibk52YkdVdWJHOW5LSFJvYVhNdWNHRm5aWE11YkdWdVozUm9JQ3NnSnlCd1lXZGxjeUJtYjNWdVpDY3BYRzRnSUNBZ0lDQWdJR052Ym5OdmJHVXViRzluS0NkTWIyRmthVzVuSUNjZ0t5QndZV2RsVG1GdFpTbGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdMeXBjYmlBZ0lDQWdJQ0FxSUdsbUlIUm9aU0JoY0hBZ2FYTWdZMjl1Wm1sbmRYSmhkR1ZrSUhSdklIVnpaU0JvWVhOb0lIUnlZV05yYVc1blhHNGdJQ0FnSUNBZ0tpQjNaU0JoWkdRZ2RHaGxJSEJoWjJVZ1pIbHVZVzFwWTJGc2JIa2dhVzRnZEdobElIVnliRnh1SUNBZ0lDQWdJQ292WEc0Z0lDQWdJQ0JwWmlBb2RHaHBjeTV2Y0hScGIyNXpMblZ6WlVoaGMyZ3BJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NXpaWFJJWVhOb0tIQmhaMlZPWVcxbEtWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQjBhR2x6TG5Ob2IzZFFZV2RsS0dadmNtTmxSR1ZtWVhWc2RGQmhaMlVnUHlCMGFHbHpMbTl3ZEdsdmJuTXVaR1ZtWVhWc2RGQmhaMlVnT2lCd1lXZGxUbUZ0WlNsY2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2THlCemRHRjBhV05jYmlBZ0lDQnpkR0YwYVdNZ1gwUlBUVWx1ZEdWeVptRmpaU2h2Y0hScGIyNXpLU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdibVYzSUZCaFoyVnlLRzl3ZEdsdmJuTXBYRzRnSUNBZ2ZWeHVJQ0I5WEc1Y2JpQWdjbVYwZFhKdUlGQmhaMlZ5WEc1OUtTZ3BYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJRkJoWjJWeVhHNGlMQ0l2S2lwY2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0tpQk1hV05sYm5ObFpDQjFibVJsY2lCTlNWUWdLR2gwZEhCek9pOHZaMmwwYUhWaUxtTnZiUzl4ZFdGeWF5MWtaWFl2VUdodmJtOXVMVVp5WVcxbGQyOXlheTlpYkc5aUwyMWhjM1JsY2k5TVNVTkZUbE5GS1Z4dUlDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBcUwxeHVYRzVwYlhCdmNuUWdleUJzYjJGa1JtbHNaU0I5SUdaeWIyMGdKeTR1TDNWMGFXeHpKMXh1YVcxd2IzSjBJSHNnWkdsemNHRjBZMmhRWVdkbFJYWmxiblFnZlNCbWNtOXRJQ2N1TGk5bGRtVnVkSE12WkdsemNHRjBZMmduWEc1Y2JtTnZibk4wSUZCaFoyVWdQU0FvS0NrZ1BUNGdlMXh1SUNBdktpcGNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxSUVOdmJuTjBZVzUwYzF4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb3ZYRzVjYmlBZ1kyOXVjM1FnVGtGTlJTQTlJQ2R3WVdkbEoxeHVJQ0JqYjI1emRDQldSVkpUU1U5T0lEMGdKekl1TUM0d0oxeHVYRzRnSUdOdmJuTjBJRlJGVFZCTVFWUkZYMU5GVEVWRFZFOVNJRDBnSjF0a1lYUmhMWFJsYlhCc1lYUmxYU2RjYmx4dUlDQXZLaXBjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUlFTnNZWE56SUVSbFptbHVhWFJwYjI1Y2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFMMXh1WEc0Z0lHTnNZWE56SUZCaFoyVWdlMXh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRU55WldGMFpYTWdZVzRnYVc1emRHRnVZMlVnYjJZZ1VHRm5aUzVjYmlBZ0lDQWdLaUJBY0dGeVlXMGdlM04wY21sdVozMGdjR0ZuWlU1aGJXVmNiaUFnSUNBZ0tpOWNiaUFnSUNCamIyNXpkSEoxWTNSdmNpaHdZV2RsVG1GdFpTa2dlMXh1SUNBZ0lDQWdkR2hwY3k1dVlXMWxJRDBnY0dGblpVNWhiV1ZjYmlBZ0lDQWdJSFJvYVhNdVpYWmxiblJ6SUQwZ1cxMWNiaUFnSUNBZ0lIUm9hWE11ZEdWdGNHeGhkR1ZRWVhSb0lEMGdiblZzYkZ4dUlDQWdJQ0FnZEdocGN5NXlaVzVrWlhKR2RXNWpkR2x2YmlBOUlHNTFiR3hjYmlBZ0lDQjlYRzVjYmlBZ0lDQXZMeUJuWlhSMFpYSnpYRzVjYmlBZ0lDQnpkR0YwYVdNZ1oyVjBJSFpsY25OcGIyNG9LU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdZQ1I3VGtGTlJYMHVKSHRXUlZKVFNVOU9mV0JjYmlBZ0lDQjlYRzVjYmlBZ0lDQXZLaXBjYmlBZ0lDQWdLaUJIWlhRZ1pYWmxiblJ6WEc0Z0lDQWdJQ29nUUhKbGRIVnlibk1nZTBaMWJtTjBhVzl1VzExOVhHNGdJQ0FnSUNvdlhHNGdJQ0FnWjJWMFJYWmxiblJ6S0NrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTXVaWFpsYm5SelhHNGdJQ0FnZlZ4dVhHNGdJQ0FnTHlvcVhHNGdJQ0FnSUNvZ1IyVjBJSFJsYlhCc1lYUmxYRzRnSUNBZ0lDb2dRSEpsZEhWeWJuTWdlM04wY21sdVozMWNiaUFnSUNBZ0tpOWNiaUFnSUNCblpYUlVaVzF3YkdGMFpTZ3BJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQjBhR2x6TG5SbGJYQnNZWFJsVUdGMGFGeHVJQ0FnSUgxY2JseHVJQ0FnSUM4cUtseHVJQ0FnSUNBcUlFZGxkQ0J5Wlc1a1pYSWdablZ1WTNScGIyNWNiaUFnSUNBZ0tpQkFjbVYwZFhKdWN5QjdSblZ1WTNScGIyNTlYRzRnSUNBZ0lDb3ZYRzRnSUNBZ1oyVjBVbVZ1WkdWeVJuVnVZM1JwYjI0b0tTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z2RHaHBjeTV5Wlc1a1pYSkdkVzVqZEdsdmJseHVJQ0FnSUgxY2JseHVJQ0FnSUd4dllXUlVaVzF3YkdGMFpTZ3BJSHRjYmlBZ0lDQWdJR052Ym5OMElIQmhaMlZGYkdWdFpXNTBJRDBnWkc5amRXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNpaGdXMlJoZEdFdGNHRm5aVDFjSWlSN2RHaHBjeTV1WVcxbGZWd2lYV0FwWEc1Y2JpQWdJQ0FnSUd4dllXUkdhV3hsS0hSb2FYTXVaMlYwVkdWdGNHeGhkR1VvS1N3Z0tIUmxiWEJzWVhSbEtTQTlQaUI3WEc0Z0lDQWdJQ0FnSUd4bGRDQnlaVzVrWlhJZ1BTQm1kVzVqZEdsdmJpQW9SRTlOVUdGblpTd2dkR1Z0Y0d4aGRHVXNJR1ZzWlcxbGJuUnpLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2FXWWdLR1ZzWlcxbGJuUnpLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQmxiR1Z0Wlc1MGN5NW1iM0pGWVdOb0tDaGxiQ2tnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCbGJDNXBibTVsY2toVVRVd2dQU0IwWlcxd2JHRjBaVnh1SUNBZ0lDQWdJQ0FnSUNBZ2ZTbGNiaUFnSUNBZ0lDQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdJQ0FnSUNBZ1JFOU5VR0ZuWlM1cGJtNWxja2hVVFV3Z1BTQjBaVzF3YkdGMFpWeHVJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lHbG1JQ2gwYUdsekxtZGxkRkpsYm1SbGNrWjFibU4wYVc5dUtDa3BJSHRjYmlBZ0lDQWdJQ0FnSUNCeVpXNWtaWElnUFNCMGFHbHpMbWRsZEZKbGJtUmxja1oxYm1OMGFXOXVLQ2xjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lISmxibVJsY2lod1lXZGxSV3hsYldWdWRDd2dkR1Z0Y0d4aGRHVXNJSEJoWjJWRmJHVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSkJiR3dvVkVWTlVFeEJWRVZmVTBWTVJVTlVUMUlwS1Z4dUlDQWdJQ0FnZlN3Z2JuVnNiQ2xjYmlBZ0lDQjlYRzVjYmlBZ0lDQXZMeUJ3ZFdKc2FXTmNibHh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFYRzRnSUNBZ0lDb2dRSEJoY21GdElIc3FmU0JqWVd4c1ltRmphMFp1WEc0Z0lDQWdJQ292WEc0Z0lDQWdZV1JrUlhabGJuUkRZV3hzWW1GamF5aGpZV3hzWW1GamEwWnVLU0I3WEc0Z0lDQWdJQ0IwYUdsekxtVjJaVzUwY3k1d2RYTm9LR05oYkd4aVlXTnJSbTRwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdMeW9xWEc0Z0lDQWdJQ29nVlhObElIUm9aU0JuYVhabGJpQjBaVzF3YkdGMFpWeHVJQ0FnSUNBcVhHNGdJQ0FnSUNvZ1FIQmhjbUZ0SUh0emRISnBibWQ5SUhSbGJYQnNZWFJsVUdGMGFGeHVJQ0FnSUNBcUwxeHVJQ0FnSUhWelpWUmxiWEJzWVhSbEtIUmxiWEJzWVhSbFVHRjBhQ2tnZTF4dUlDQWdJQ0FnYVdZZ0tIUjVjR1Z2WmlCMFpXMXdiR0YwWlZCaGRHZ2dJVDA5SUNkemRISnBibWNuS1NCN1hHNGdJQ0FnSUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2lnblZHaGxJSFJsYlhCc1lYUmxJSEJoZEdnZ2JYVnpkQ0JpWlNCaElITjBjbWx1Wnk0Z0p5QXJJSFI1Y0dWdlppQjBaVzF3YkdGMFpWQmhkR2dnS3lBbklHbHpJR2RwZG1WdUp5bGNiaUFnSUNBZ0lIMWNiaUFnSUNBZ0lIUm9hWE11ZEdWdGNHeGhkR1ZRWVhSb0lEMGdkR1Z0Y0d4aGRHVlFZWFJvWEc0Z0lDQWdmVnh1WEc0Z0lDQWdMeW9xWEc0Z0lDQWdJQ29nVlhObElIUm9aU0JuYVhabGJpQjBaVzF3YkdGMFpTQnlaVzVrWlhKbGNseHVJQ0FnSUNBcUlFQndZWEpoYlNCN1JuVnVZM1JwYjI1OUlISmxibVJsY2taMWJtTjBhVzl1WEc0Z0lDQWdJQ292WEc0Z0lDQWdkWE5sVkdWdGNHeGhkR1ZTWlc1a1pYSmxjaWh5Wlc1a1pYSkdkVzVqZEdsdmJpa2dlMXh1SUNBZ0lDQWdhV1lnS0hSNWNHVnZaaUJ5Wlc1a1pYSkdkVzVqZEdsdmJpQWhQVDBnSjJaMWJtTjBhVzl1SnlrZ2UxeHVJQ0FnSUNBZ0lDQjBhSEp2ZHlCdVpYY2dSWEp5YjNJb0oxUm9aU0JqZFhOMGIyMGdkR1Z0Y0d4aGRHVWdjbVZ1WkdWeVpYSWdiWFZ6ZENCaVpTQmhJR1oxYm1OMGFXOXVMaUFuSUNzZ2RIbHdaVzltSUhKbGJtUmxja1oxYm1OMGFXOXVJQ3NnSnlCcGN5Qm5hWFpsYmljcFhHNGdJQ0FnSUNCOVhHNGdJQ0FnSUNCMGFHbHpMbkpsYm1SbGNrWjFibU4wYVc5dUlEMGdjbVZ1WkdWeVJuVnVZM1JwYjI1Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2S2lwY2JpQWdJQ0FnS2lCVWNtbG5aMlZ5SUhOamIzQmxjMXh1SUNBZ0lDQXFJRUJ3WVhKaGJTQjdjM1J5YVc1bmZTQmxkbVZ1ZEU1aGJXVmNiaUFnSUNBZ0tpQkFjR0Z5WVcwZ2UzdDlmU0JiWlhabGJuUlFZWEpoYlhNOWUzMWRYRzRnSUNBZ0lDb3ZYRzRnSUNBZ2RISnBaMmRsY2xOamIzQmxjeWhsZG1WdWRFNWhiV1VzSUdWMlpXNTBVR0Z5WVcxeklEMGdlMzBwSUh0Y2JpQWdJQ0FnSUdOdmJuTjBJR1YyWlc1MFRtRnRaVUZzYVdGeklEMGdZRzl1Skh0bGRtVnVkRTVoYldVdVkyaGhja0YwS0RBcExuUnZWWEJ3WlhKRFlYTmxLQ2w5Skh0bGRtVnVkRTVoYldVdWMyeHBZMlVvTVNsOVlGeHVYRzRnSUNBZ0lDQjBhR2x6TG1WMlpXNTBjeTVtYjNKRllXTm9LQ2h6WTI5d1pTa2dQVDRnZTF4dUlDQWdJQ0FnSUNCamIyNXpkQ0J6WTI5d1pVVjJaVzUwSUQwZ2MyTnZjR1ZiWlhabGJuUk9ZVzFsWFZ4dUlDQWdJQ0FnSUNCamIyNXpkQ0J6WTI5d1pVVjJaVzUwUVd4cFlYTWdQU0J6WTI5d1pWdGxkbVZ1ZEU1aGJXVkJiR2xoYzExY2JpQWdJQ0FnSUNBZ2FXWWdLSFI1Y0dWdlppQnpZMjl3WlVWMlpXNTBJRDA5UFNBblpuVnVZM1JwYjI0bktTQjdYRzRnSUNBZ0lDQWdJQ0FnYzJOdmNHVkZkbVZ1ZEM1aGNIQnNlU2gwYUdsekxDQmxkbVZ1ZEZCaGNtRnRjeWxjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lDOHZJSFJ5YVdkblpYSWdkR2hsSUdWMlpXNTBJR0ZzYVdGelhHNGdJQ0FnSUNBZ0lHbG1JQ2gwZVhCbGIyWWdjMk52Y0dWRmRtVnVkRUZzYVdGeklEMDlQU0FuWm5WdVkzUnBiMjRuS1NCN1hHNGdJQ0FnSUNBZ0lDQWdjMk52Y0dWRmRtVnVkRUZzYVdGekxtRndjR3g1S0hSb2FYTXNJR1YyWlc1MFVHRnlZVzF6S1Z4dUlDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNCOUtWeHVYRzRnSUNBZ0lDQmthWE53WVhSamFGQmhaMlZGZG1WdWRDaGxkbVZ1ZEU1aGJXVXNJSFJvYVhNdWJtRnRaU3dnWlhabGJuUlFZWEpoYlhNcFhHNGdJQ0FnZlZ4dUlDQjlYRzVjYmlBZ2NtVjBkWEp1SUZCaFoyVmNibjBwS0NsY2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ1VHRm5aVnh1SWl3aUx5cGNiaUFxSUZWelpTQnZaaUJ3YkdGMFptOXliUzVxYzF4dUlDb2dhSFIwY0hNNkx5OW5hWFJvZFdJdVkyOXRMMkpsYzNScFpXcHpMM0JzWVhSbWIzSnRMbXB6WEc0Z0tpQk1hV05sYm5ObE9pQm9kSFJ3Y3pvdkwyZHBkR2gxWWk1amIyMHZZbVZ6ZEdsbGFuTXZjR3hoZEdadmNtMHVhbk12WW14dllpOXRZWE4wWlhJdlRFbERSVTVUUlZ4dUlDb3ZYRzVwYlhCdmNuUWdjR3hoZEdadmNtMGdabkp2YlNBbmNHeGhkR1p2Y20wblhHNWNibVY0Y0c5eWRDQmtaV1poZFd4MElIQnNZWFJtYjNKdFhHNGlMQ0pjYm1WNGNHOXlkQ0JtZFc1amRHbHZiaUJzYjJGa1JtbHNaU2gxY213c0lHWnVMQ0J3YjNOMFJHRjBZU2tnZTF4dUlDQmpiMjV6ZENCeVpYRWdQU0J1WlhjZ1dFMU1TSFIwY0ZKbGNYVmxjM1FvS1Z4dUlDQnBaaUFvY21WeExtOTJaWEp5YVdSbFRXbHRaVlI1Y0dVcElISmxjUzV2ZG1WeWNtbGtaVTFwYldWVWVYQmxLQ2QwWlhoMEwyaDBiV3c3SUdOb1lYSnpaWFE5ZFhSbUxUZ25LVnh1SUNCeVpYRXViMjV5WldGa2VYTjBZWFJsWTJoaGJtZGxJRDBnS0NrZ1BUNGdlMXh1SUNBZ0lHbG1JQ2h5WlhFdWNtVmhaSGxUZEdGMFpTQTlQVDBnTkNBbUppQW9jR0Z5YzJWSmJuUW9jbVZ4TG5OMFlYUjFjeWtnUFQwOUlESXdNQ0I4ZkNBaGNtVnhMbk4wWVhSMWN5QW1KaUJ5WlhFdWNtVnpjRzl1YzJWVVpYaDBMbXhsYm1kMGFDa3BJSHRjYmlBZ0lDQWdJR1p1S0hKbGNTNXlaWE53YjI1elpWUmxlSFFwWEc0Z0lDQWdmVnh1SUNCOVhHNWNiaUFnYVdZZ0tIUjVjR1Z2WmlCd2IzTjBSR0YwWVNBaFBUMGdKM04wY21sdVp5Y3BJSHRjYmlBZ0lDQnlaWEV1YjNCbGJpZ25SMFZVSnl3Z2RYSnNMQ0IwY25WbEtWeHVJQ0FnSUhKbGNTNXpaVzVrS0NjbktWeHVJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lISmxjUzV2Y0dWdUtDZFFUMU5VSnl3Z2RYSnNMQ0IwY25WbEtWeHVJQ0FnSUhKbGNTNXpaWFJTWlhGMVpYTjBTR1ZoWkdWeUtDZERiMjUwWlc1MExYUjVjR1VuTENBbllYQndiR2xqWVhScGIyNHZlQzEzZDNjdFptOXliUzExY214bGJtTnZaR1ZrSnlsY2JpQWdJQ0J5WlhFdWMyVnVaQ2h3YjNOMFJHRjBZU2xjYmlBZ2ZWeHVmVnh1WEc1bGVIQnZjblFnWm5WdVkzUnBiMjRnWjJWdVpYSmhkR1ZKWkNncElIdGNiaUFnY21WMGRYSnVJRTFoZEdndWNtRnVaRzl0S0NrdWRHOVRkSEpwYm1jb016WXBMbk4xWW5OMGNpZ3lMQ0F4TUNsY2JuMWNibHh1Wlhod2IzSjBJR1oxYm1OMGFXOXVJR1pwYm1SVVlYSm5aWFJDZVVOc1lYTnpLSFJoY21kbGRDd2djR0Z5Wlc1MFEyeGhjM01wSUh0Y2JpQWdabTl5SUNnN0lIUmhjbWRsZENBbUppQjBZWEpuWlhRZ0lUMDlJR1J2WTNWdFpXNTBPeUIwWVhKblpYUWdQU0IwWVhKblpYUXVjR0Z5Wlc1MFRtOWtaU2tnZTF4dUlDQWdJR2xtSUNoMFlYSm5aWFF1WTJ4aGMzTk1hWE4wTG1OdmJuUmhhVzV6S0hCaGNtVnVkRU5zWVhOektTa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlIUmhjbWRsZEZ4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUhKbGRIVnliaUJ1ZFd4c1hHNTlYRzVjYmx4dVpYaHdiM0owSUdaMWJtTjBhVzl1SUdacGJtUlVZWEpuWlhSQ2VVbGtLSFJoY21kbGRDd2djR0Z5Wlc1MFNXUXBJSHRjYmlBZ1ptOXlJQ2c3SUhSaGNtZGxkQ0FtSmlCMFlYSm5aWFFnSVQwOUlHUnZZM1Z0Wlc1ME95QjBZWEpuWlhRZ1BTQjBZWEpuWlhRdWNHRnlaVzUwVG05a1pTa2dlMXh1SUNBZ0lHbG1JQ2gwWVhKblpYUXVaMlYwUVhSMGNtbGlkWFJsS0NkcFpDY3BJRDA5UFNCd1lYSmxiblJKWkNrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUhSaGNtZGxkRnh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJSEpsZEhWeWJpQnVkV3hzWEc1OVhHNWNibVY0Y0c5eWRDQm1kVzVqZEdsdmJpQm1hVzVrVkdGeVoyVjBRbmxCZEhSeUtIUmhjbWRsZEN3Z1lYUjBjaWtnZTF4dUlDQm1iM0lnS0RzZ2RHRnlaMlYwSUNZbUlIUmhjbWRsZENBaFBUMGdaRzlqZFcxbGJuUTdJSFJoY21kbGRDQTlJSFJoY21kbGRDNXdZWEpsYm5ST2IyUmxLU0I3WEc0Z0lDQWdhV1lnS0hSaGNtZGxkQzVuWlhSQmRIUnlhV0oxZEdVb1lYUjBjaWtnSVQwOUlHNTFiR3dwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUIwWVhKblpYUmNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQnlaWFIxY200Z2JuVnNiRnh1ZlZ4dUlpd2lMeW9xWEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvZ1RHbGpaVzV6WldRZ2RXNWtaWElnVFVsVUlDaG9kSFJ3Y3pvdkwyZHBkR2gxWWk1amIyMHZjWFZoY21zdFpHVjJMMUJvYjI1dmJpMUdjbUZ0WlhkdmNtc3ZZbXh2WWk5dFlYTjBaWEl2VEVsRFJVNVRSU2xjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2k5Y2JseHVMeThnWTI5eVpWeHVhVzF3YjNKMElGQmhaMlZ5SUdaeWIyMGdKeTR2WTI5eVpTOXdZV2RsY2k5cGJtUmxlQ2RjYm1sdGNHOXlkQ0JCYW1GNElHWnliMjBnSnk0dlkyOXlaUzloYW1GNEoxeHVhVzF3YjNKMElIQnNZWFJtYjNKdElHWnliMjBnSnk0dlkyOXlaUzl3YkdGMFptOXliU2RjYm1sdGNHOXlkQ0JKYm5Sc0lHWnliMjBnSnk0dlkyOXlaUzlwYm5Sc0oxeHVhVzF3YjNKMElFNWxkSGR2Y21zZ1puSnZiU0FuTGk5amIzSmxMMjVsZEhkdmNtc25YRzVjYmk4dklHTnZiWEJ2Ym1WdWRITmNibWx0Y0c5eWRDQkVhV0ZzYjJjZ1puSnZiU0FuTGk5amIyMXdiMjVsYm5SekwyUnBZV3h2WnlkY2JtbHRjRzl5ZENCT2IzUnBabWxqWVhScGIyNGdabkp2YlNBbkxpOWpiMjF3YjI1bGJuUnpMMjV2ZEdsbWFXTmhkR2x2YmlkY2JtbHRjRzl5ZENCRGIyeHNZWEJ6WlNCbWNtOXRJQ2N1TDJOdmJYQnZibVZ1ZEhNdlkyOXNiR0Z3YzJVblhHNXBiWEJ2Y25RZ1FXTmpiM0prYVc5dUlHWnliMjBnSnk0dlkyOXRjRzl1Wlc1MGN5OWhZMk52Y21ScGIyNG5YRzVwYlhCdmNuUWdWR0ZpSUdaeWIyMGdKeTR2WTI5dGNHOXVaVzUwY3k5MFlXSW5YRzVwYlhCdmNuUWdVSEp2WjNKbGMzTWdabkp2YlNBbkxpOWpiMjF3YjI1bGJuUnpMM0J5YjJkeVpYTnpKMXh1YVcxd2IzSjBJRXh2WVdSbGNpQm1jbTl0SUNjdUwyTnZiWEJ2Ym1WdWRITXZiRzloWkdWeUoxeHVhVzF3YjNKMElFOW1aa05oYm5aaGN5Qm1jbTl0SUNjdUwyTnZiWEJ2Ym1WdWRITXZiMlptTFdOaGJuWmhjeWRjYm1sdGNHOXlkQ0JFY205d1pHOTNiaUJtY205dElDY3VMMk52YlhCdmJtVnVkSE12WkhKdmNHUnZkMjRuWEc1Y2JtTnZibk4wSUdGd2FTQTlJSHQ5WEc1Y2JpOHFLbHh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaUJEYjI1bWFXZDFjbUYwYVc5dVhHNGdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBcUwxeHVZWEJwTG1OdmJtWnBaeUE5SUh0Y2JpQWdMeThnWjJ4dlltRnNJR052Ym1acFoxeHVJQ0JrWldKMVp6b2dkSEoxWlN4Y2JuMWNibHh1THlvcVhHNGdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBcUlGQmhaMlZ5WEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxTDF4dVlYQnBMbkJoWjJWeUlEMGdLRzl3ZEdsdmJuTXBJRDArSUh0Y2JpQWdhV1lnS0hSNWNHVnZaaUJoY0drdVgzQmhaMlZ5SUQwOVBTQW5kVzVrWldacGJtVmtKeWtnZTF4dUlDQWdJR0Z3YVM1ZmNHRm5aWElnUFNCUVlXZGxjaTVmUkU5TlNXNTBaWEptWVdObEtHOXdkR2x2Ym5NcFhHNGdJSDFjYmlBZ2NtVjBkWEp1SUdGd2FTNWZjR0ZuWlhKY2JuMWNibHh1THlvcVhHNGdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBcUlGQnNZWFJtYjNKdFhHNGdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBcUwxeHVYRzVoY0drdWNHeGhkR1p2Y20wZ1BTQndiR0YwWm05eWJWeHVYRzR2S2lwY2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvZ1FXcGhlRnh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaTljYm1Gd2FTNWhhbUY0SUQwZ1FXcGhlQzVmUkU5TlNXNTBaWEptWVdObFhHNWNiaThxS2x4dUlDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2lCSmJuUnNYRzRnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQXFMMXh1WVhCcExtbHVkR3dnUFNCSmJuUnNMbDlFVDAxSmJuUmxjbVpoWTJWY2JseHVMeW9xWEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxSUU1bGRIZHZjbXRjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ292WEc1aGNHa3VibVYwZDI5eWF5QTlJRTVsZEhkdmNtc3VYMFJQVFVsdWRHVnlabUZqWlZ4dVhHNHZLaXBjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ29nVG05MGFXWnBZMkYwYVc5dVhHNGdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBcUwxeHVZWEJwTG01dmRHbG1hV05oZEdsdmJpQTlJRTV2ZEdsbWFXTmhkR2x2Ymk1ZlJFOU5TVzUwWlhKbVlXTmxYRzVjYmk4cUtseHVJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0tpQkVhV0ZzYjJkY2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvdlhHNWhjR2t1WkdsaGJHOW5JRDBnUkdsaGJHOW5MbDlFVDAxSmJuUmxjbVpoWTJWY2JseHVMeW9xWEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxSUVOdmJHeGhjSE5sWEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxTDF4dVlYQnBMbU52Ykd4aGNITmxJRDBnUTI5c2JHRndjMlV1WDBSUFRVbHVkR1Z5Wm1GalpWeHVYRzR2S2lwY2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvZ1FXTmpiM0prYVc5dVhHNGdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBcUwxeHVZWEJwTG1GalkyOXlaR2x2YmlBOUlFRmpZMjl5WkdsdmJpNWZSRTlOU1c1MFpYSm1ZV05sWEc1Y2JseHVMeW9xWEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxSUZSaFlseHVJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0tpOWNibUZ3YVM1MFlXSWdQU0JVWVdJdVgwUlBUVWx1ZEdWeVptRmpaVnh1WEc0dktpcGNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDb2dVSEp2WjNKbGMzTmNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDb3ZYRzVoY0drdWNISnZaM0psYzNNZ1BTQlFjbTluY21WemN5NWZSRTlOU1c1MFpYSm1ZV05sWEc1Y2JpOHFLbHh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaUJNYjJGa1pYSmNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDb3ZYRzVoY0drdWJHOWhaR1Z5SUQwZ1RHOWhaR1Z5TGw5RVQwMUpiblJsY21aaFkyVmNibHh1THlvcVhHNGdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBcUlFOW1aaUJqWVc1MllYTmNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDb3ZYRzVoY0drdWIyWm1RMkZ1ZG1GeklEMGdUMlptUTJGdWRtRnpMbDlFVDAxSmJuUmxjbVpoWTJWY2JseHVMeW9xWEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxSUVSeWIzQmtiM2R1WEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxTDF4dVlYQnBMbVJ5YjNCa2IzZHVJRDBnUkhKdmNHUnZkMjR1WDBSUFRVbHVkR1Z5Wm1GalpWeHVYRzR2THlCTllXdGxJSFJvWlNCQlVFa2diR2wyWlZ4dWQybHVaRzkzTG5Cb2IyNXZiaUE5SUdGd2FWeHVYRzVsZUhCdmNuUWdaR1ZtWVhWc2RDQmhjR2xjYmlKZGZRPT0ifQ==
