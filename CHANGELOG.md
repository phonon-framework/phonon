### 1.0.6 (2015-10-17)

#### Bug Fixes

* page navigation with $previous-page and parameters [#26](https://github.com/quark-dev/Phonon-Framework/issues/26)

### 1.0.5 (2015-10-01)

#### Bug Fixes

* page navigation with links when the browser's back-button is disabled [#21](https://github.com/quark-dev/Phonon-Framework/issues/21)

#### Features

##### Parameters

Parameters are now passed as arguments in the onHashChanged callback, instead of onHashChanged(req). In other words, parameters are directly accessible. For example, with the given URL: http://localhost/myapp/#!mypage/hello/world, parameters can be accessed like this:

```javascript
onHashChanged(function(req1, req2) {
	// req1 = hello
	// req2 = world
});

```

Thanks to *jsantari* for this [suggestion](https://github.com/quark-dev/Phonon-Framework/issues/23).


### Using URLs - parameters

it is now possible to use URLs - parameters to access other pages directly (without accessing the default page with a page redirection). Thanks to *HugoCrd* for the [discussion](https://github.com/quark-dev/Phonon-Framework/issues/19).


### 1.0.4 (2015-09-25)

#### Bug Fixes

* fixes navigator defensive condition before changing page
* use JSON.stringify to process xhr's body when content-type is application/json

### 1.0.3 (2015-09-21)

#### Bug Fixes

* unable to call changePage() when a dialog is active [#9](https://github.com/quark-dev/Phonon-Framework/issues/9)

### 1.0.2 (2015-09-10)

#### Bug Fixes

* unable to fill inputs on Safari [#12](https://github.com/quark-dev/Phonon-Framework/issues/12)
* update dev dependencies (packages.json)

### 1.0.1 (2015-09-10)

#### Features

* hash routing is now an option
* i18n module uses cache

### 1.0.0 (2015-08-24)

#### Features

* 65% rewritten
* works well on modern browsers and on cordova
* Gulp and Stylus preprocessors
* customize your app with variables
* new notifications. The old notification plugin has been renamed to Cordova Notifications. Note that this plugin is now depreciated
* dialogs
* tap event
* side panels
* tabs
* floating labels
* RiotJS support for tags
* AngularJS support [#3](https://github.com/quark-dev/Phonon-Framework/issues/3)
* flexible side panels [#2](https://github.com/quark-dev/Phonon-Framework/issues/2)

**For older releases**: please visit the [old website](http://phonon.quarkdev.com/0.9/).
