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
import Pager from './core/pager/index'
import Dialog from 'phonon/src/js/components/dialog'

const pager = new Pager({
  hashPrefix: '#!',
  useHash: true,
  defaultPage: 'one',
  animatePages: true
})

// instead of using phonon.dialog(...), you must use the component as an object:
const dialog = new Dialog({
  title: 'Dialog title',
  message: 'Dialog body text goes here.',
  cancelable: true
})

dialog.show()
```
