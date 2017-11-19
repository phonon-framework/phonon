# Phonon v2

[WIP]

## Versioning

Phonon Framework is maintained under the [Semantic Versioning guidelines](http://semver.org/).

## Contributing

Moreover, if your pull request contains JavaScript patches or features, you must include relevant unit tests.
Editor preferences are available in the [editor config](https://github.com/quark-dev/Phonon-Framework/blob/master/.editorconfig) for easy use in common text editors.

## Copyright and license

Code released under the [MIT License](https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE).



## Core

### Pager


### i18n

const intl = new i18n('en', {
  en: {
    welcome: 'Hello',
    bye: 'Bye'
  },
  fr: {
    welcome: 'Bonjour',
    bye: 'Au revoir'
  }
}, 'es')

console.log(intl.getLanguages())
console.log(intl.get('welcome'))
intl.setDefaultLocale('fr', true)
console.log(intl.getAll(['welcome', 'bye']))
intl.bind(document.querySelector('.test'))


## UI Components

### Panels

Panels are now `modals`
[https://getbootstrap.com/docs/4.0/components/modal/](https://getbootstrap.com/docs/4.0/components/modal/)

### Side Panels

[WIP]

### Dialogs

Dialogs are now `modals`.
[https://getbootstrap.com/docs/4.0/components/modal/](https://getbootstrap.com/docs/4.0/components/modal/)


### Notifications

@todo

### Floating actions

@todo

### Preloaders

@todo

### Popovers

Popovers are now `dropdowns`.
[https://getbootstrap.com/docs/4.0/components/dropdowns/](https://getbootstrap.com/docs/4.0/components/dropdowns/)

### Tabs

Tabs are now `navs`.
[https://getbootstrap.com/docs/4.0/components/navs/](https://getbootstrap.com/docs/4.0/components/navs/)

### Tables

Tables docs: [https://getbootstrap.com/docs/4.0/content/tables/](https://getbootstrap.com/docs/4.0/content/tables/)

### Accordion lists

Accordion lists are `collapse`.
[https://getbootstrap.com/docs/4.0/components/collapse/](https://getbootstrap.com/docs/4.0/components/collapse/)

### Grid

Grid docs: [https://getbootstrap.com/docs/4.0/layout/grid/](https://getbootstrap.com/docs/4.0/layout/grid/)
