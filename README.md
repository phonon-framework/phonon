# [Phonon](http://phonon.quarkdev.com)

> Phonon: the light weight, scalable, flexible and customizable HTML5 Web - Mobile Framework.

[![npm](https://img.shields.io/npm/v/phonon.svg?style=flat-square)]()
[![license](https://img.shields.io/github/license/quark-dev/phonon.svg?style=flat-square)]()
[![GitHub contributors](https://img.shields.io/github/contributors/quark-dev/phonon.svg?style=flat-square)]()

Originally, **Phonon** has been created for **building hybrid apps** with **Apache Cordova** by using **web technologies such as HTML, CSS and JavaScript**. Phonon gives an intuitive and amuzing way of building apps. For example, the app's workflow can be defined with page events. This framework is also an **UI framework** proposing many features that are generic, which means they don't differ from mobile platforms. On the other hand, you can define your style according to the platform, because Phonon adds the OS class in the body tag.
The main JavaScript file called **phonon-core.js** is **only 23 kB**! This file is the minimal file for running Phonon with basic CSS only components. Then you can load each component that you need.
Since the version **1.0.0** released in August 2015, Phonon became **browser-friendly** which means you can build hybrid apps with Cordova or web apps!

## Table of contents

- [Quick start](#quick-start)
- [Documentation](#documentation)
- [Demos](#demos)
- [Compatibility](#compatibility)
- [Why use Phonon](#why-use-phonon)

## Quick start

Several quick start options are available:

 - [Download the latest release](https://github.com/quark-dev/Phonon-Framework/releases) and use dist files.
 - Clone the repo: `git clone https://github.com/quark-dev/Phonon-Framework.git`. Do not forget to run `npm install`.
 - Install with [npm](https://www.npmjs.com): `npm install phonon`.
 - Install with [Bower](https://bower.io): `bower install phonon`.
 - Use [CDNJS](https://cdnjs.com/libraries/PhononJs).

The best place to start with Phonon is the [Getting Started section](http://phonon.quarkdev.com/#getting-started).

## Documentation

Please, visit [the website](http://phonon.quarkdev.com/docs/).

## Demos

Code examples can be found in [the docs](http://phonon.quarkdev.com/docs/) or in the **examples** folder in this repository.

 - Try the [kitchen sink](http://phonon.quarkdev.com/App/public/phonon/kitchen-sink/).

## Compatibility

For more information, please see the [compatibility section](http://phonon.quarkdev.com/#compatibility).

 - Android 4.1+
 - iOS 7+
 - IE10+ (IE9 is partially supported)
 - Chrome 30+
 - Firefox 10+
 - Opera 12+

## Why use Phonon

### Scalability

Javascript: Phonon modules are independent each other.
It is fine to use only one Phonon feature or component, but you will fall in love with all the features. :)


### Library Agnostic

Use your favorite design pattern (MVW, MVVM, MVC, ...) or a module loader with Phonon! For example, Phonon plays well with **RiotJS**, **AngularJS**, **RequireJS** and **VueJS**.

 - [Code example with RiotJS](https://github.com/quark-dev/Phonon-Framework/tree/master/examples/pizza-app-with-riot)
 - [Code example with AngularJS](https://github.com/quark-dev/Phonon-Framework/tree/master/examples/pizza-app-with-angular)
 - [Code example with RequireJS](https://github.com/quark-dev/Phonon-Framework/tree/master/examples/pizza-app-with-require)
 - [Code example with VueJS](https://github.com/quark-dev/Phonon-Framework/tree/master/examples/pizza-app-with-vue)


### Internationalization

A Phonon app is almost perfect, but an **internationalized Phonon application**, it's even better!
The **i18n module** permits to manage your language files and to bind the correct language values inside your HTML templates with attributes.
[Learn more](http://phonon.quarkdev.com/docs/i18n/)

### Light-weight framework

The Phonon framework is very light (phonon-core.js is only **23 kB**!).
