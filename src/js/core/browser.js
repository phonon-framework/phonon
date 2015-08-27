phonon.browser = (function () {

    /**
     * Browser detection
     * Source: http://jsfiddle.net/ChristianL/AVyND/
     */

    var ua = navigator.userAgent;
    var browser = navigator.appName;
    var version = '' + parseFloat(navigator.appVersion);
    var majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;

    // Opera
    if ((verOffset = ua.indexOf('Opera')) != -1) {
        browser = 'Opera';
        version = ua.substring(verOffset + 6);
        if ((verOffset = ua.indexOf('Version')) != -1) {
            version = ua.substring(verOffset + 8);
        }
    }
    // Opera Next
    if ((verOffset = ua.indexOf('OPR')) != -1) {
        browser = 'Opera';
        version = ua.substring(verOffset + 4);
    }
    // MSIE
    else if ((verOffset = ua.indexOf('MSIE')) != -1) {
        browser = 'Microsoft Internet Explorer';
        version = ua.substring(verOffset + 5);
    }
    // Chrome
    else if ((verOffset = ua.indexOf('Chrome')) != -1) {
        browser = 'Chrome';
        version = ua.substring(verOffset + 7);
    }
    // Safari
    else if ((verOffset = ua.indexOf('Safari')) != -1) {
        browser = 'Safari';
        version = ua.substring(verOffset + 7);
        if ((verOffset = ua.indexOf('Version')) != -1) {
            version = ua.substring(verOffset + 8);
        }
    }
    // Firefox
    else if ((verOffset = ua.indexOf('Firefox')) != -1) {
        browser = 'Firefox';
        version = ua.substring(verOffset + 8);
    }
    // MSIE 11+
    else if (ua.indexOf('Trident/') != -1) {
        browser = 'Microsoft Internet Explorer';
        version = ua.substring(ua.indexOf('rv:') + 3);
    }
    // Other browsers
    else if ((nameOffset = ua.lastIndexOf(' ') + 1) < (verOffset = ua.lastIndexOf('/'))) {
        browser = ua.substring(nameOffset, verOffset);
        version = ua.substring(verOffset + 1);
        if (browser.toLowerCase() == browser.toUpperCase()) {
            browser = navigator.appName;
        }
    }
    // trim the version string
    if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
    if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);
    if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix);

    majorVersion = parseInt('' + version, 10);
    if (isNaN(majorVersion)) {
        version = '' + parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion, 10);
    }

    return {
        name: browser,
        version: version
    };

})();