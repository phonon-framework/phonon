# [Phonon: the light weight, scalable, flexible and customizable HTML5 Web - Mobile Framework ](http://phonon.quarkdev.com)

Originally, **Phonon** has been created for **building hybrid apps** with **Apache Cordova** by using **web technologies such as HTML, CSS and JavaScript**. Phonon gives an intuitive and amuzing way of building apps. For example, the app's workflow can be defined with page events. This framework is also an **UI framework** proposing many features that are generic, which means they don't differ from mobile platforms. On the other hand, you can define your style according to the platform, because Phonon adds the OS class in the body tag.
The main JavaScript file called **phonon-core.js** is **only 23 kB**! This file is the minimal file for running Phonon with basic CSS only components. Then you can load each component that you need.
Since the version **1.0.0** released in August 2015, Phonon became **browser-friendly** which means you can build hybrid apps with Cordova or web apps!

## Quick Start

The best place to start with Phonon is the [Getting Started section](http://phonon.quarkdev.com/#getting-started)

## Documentation

Please, visit [the website](http://phonon.quarkdev.com/docs/).

## Demos

Code examples can be found in [the docs](http://phonon.quarkdev.com/docs/) or in the **examples** folder in this repository.

 - Try the [kitchen sink](http://phonon.quarkdev.com/App/public/phonon/kitchen-sink/).

## Installation

Ready to use files are available in the **dist folder**. You only need to copy/paste them.
On the other hand, if you want to compile your own CSS/JS files with Gulp (the streaming build system) please install **npm** and **gulp**.

 - `npm install` to install all modules
 - `gulp build` to compile and minimify all sources

## Compatibility

For more information, please see the [compatibility section](http://phonon.quarkdev.com/#compatibility).

 - Android 4.1+
 - iOS 7+
 - IE10+ (IE9 is partially supported)
 - Chrome 30+
 - Firefox 10+
 - Opera 12+

# Why use Phonon

## Scalability

Javascript: Phonon modules are independent each other.
It is fine to use only one Phonon feature or component, but you will fall in love with all the features. :)


## Library Agnostic

Use your favorite design pattern (MVW, MVVM, MVC, ...) or a module loader with Phonon! For example, Phonon plays well with **RiotJS**, **AngularJS**, **RequireJS** and **VueJS**.

 - [Code example with RiotJS](https://github.com/quark-dev/Phonon-Framework/tree/master/examples/pizza-app-with-riot)
 - [Code example with AngularJS](https://github.com/quark-dev/Phonon-Framework/tree/master/examples/pizza-app-with-angular)
 - [Code example with RequireJS](https://github.com/quark-dev/Phonon-Framework/tree/master/examples/pizza-app-with-require)
 - [Code example with VueJS](https://github.com/quark-dev/Phonon-Framework/tree/master/examples/pizza-app-with-vue)


## Internationalization

A Phonon app is almost perfect, but an **internationalized Phonon application**, it's even better!
The **i18n module** permits to manage your language files and to bind the correct language values inside your HTML templates with attributes.
[Learn more](http://phonon.quarkdev.com/docs/i18n/)

## Light-weight framework

The Phonon framework is very light (phonon-core.js is only **23 kB**!).
