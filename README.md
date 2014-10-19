# [Phonon: the tiny but powerful Cordova framework](http://phonon.quarkdev.com)

Phonon is a lightweight & scalable Javascript/CSS3/HTML5 framework to develop a single page application based on Apache Cordova (Phonegap).
This mobile framework offers quality UI components made in CSS and Javascript that operate as native components and modules to meet several known problems in the design of hybrid applications.
In addition, some extra features are operational with Apache Cordova.

If you are new to Apache:
Apache Cordova is a platform for building native mobile applications using HTML, CSS and JavaScript.
[Learn more](http://cordova.apache.org/)

By quality we mean:

* Management of the page's state (onCreate, onReady, OnQuit, etc) to better perform the app processes and update the user interface. For example, updating a list after the user navigates on another page after the page transition is completed. Like this we keep the rendering quality. We also thought to consider the physical "back" button on Android thanks to the Apache Cordova's event.
* Management of languages ​​available for the application: LinguisticJS is the module to internationalize your application.
* Speed ​​at the launch of the application.
* Modern UI components: made in CSS and Javascript

<img src="http://phonon.quarkdev.com/App/public/assets/img/phonon-logo.png" alt="Phonon" height="180px">

# Why use Phonon

## Scalability

Javascript: Phonon plugins are independent each other.
It is fine to use only one Phonon feature or component, but you will fall in love with all the features. :)

CSS: Phonon works perfectly with [Ratchet components](https://github.com/twbs/ratchet), but if you don't want to use this beautiful framework, it is okay. Just include phonon-minimal.css.

Additionally, you can choose your pattern in order to bind your UI dynamically.
Phonon is very open to the world of patterns.

## (A)synchronous Javascript

Navigator permits you to manage asynchronous and synchronous pages so that it becomes easy to organize your app tasks or processes as you desire.
[Learn more](http://phonon.quarkdev.com/docs/navigator)

## Internalization

A Phonon app is almost perfect, but an internationalized Phonon application, it's even better! 
The Linguistic plugin permits to manage your language files and to bind the correct language values inside your HTML view with attributes.
[Learn more](http://phonon.quarkdev.com/docs/linguistic)

## Light-weight framework
The Phonon framework is really light, because its components can be loaded independently.

## 100% modular

**Do you love RequireJS? We do.**
Using a modular script loader like RequireJS will improve the speed and quality of your code. 
Each Phonon component is compatible with asynchronous module definition (AMD).

## Cordova based plugins

Some plugins work with the Phonegap - Apache Cordova API such as Navigator, FileSystem & Notifications.

# Documentation & Getting started

Please, visit the [website of Phonon](http://phonon.quarkdev.com).

# License

Phonon is licensed under the MIT License.
