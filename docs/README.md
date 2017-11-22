# Documentation [WIP]

Phonon builds are ready to use components.
They provide convenient solutions that can be installed with no effort and that satisfy the most common editing use cases.

## Ready to use builds

Ready to use builds are located in the `dist/` directory.

```js
import 'phonon/dist/js/phonon'
// that's it!
```

## Build customization

This can be useful if you want to include specific Phonon components.
You can import the components you want to use in this way:

```js
// core
import Pager from './core/pager/index'
import Intl from './core/intl'

// components
import Dialog from 'phonon/src/js/components/dialog'

const pager = new Pager({
  hashPrefix: '#!',
  useHash: true,
  defaultPage: 'one',
  animatePages: true
})

const intl = new Intl({
  fallbackLocale: 'en',
  locale: 'en',
  data: {
    en: {
      welcome: 'Hello (default)',
      welcomePerson: 'Hello :name'
    },
    en_US: {
      welcome: 'Hello US',
      welcomePerson: 'Hello :name'
    },
    fr: {
      welcome: 'Bonjour',
      welcomePerson: 'Bonjour :name'
    }
  }
})

// instead of using phonon.dialog(...), you must use the component as an object:
const dialog = new Dialog({
  title: 'Dialog title',
  message: 'Dialog body text goes here.',
  cancelable: true
})

dialog.show()
```
