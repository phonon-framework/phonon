---
title: Custom builds
---

## CSS

```scss
// required
@import 'scss/functions';
@import 'scss/variables';
@import 'scss/mixins';
```

## JavaScript

This can be useful if you want to include **only** some components.

For example, for the dialog component:

```js
import Dialog from 'phonon/src/js/components/dialog'

// instead of using phonon.dialog(...), you must use the component as an object:
const dialog = new Dialog({
  title: 'Dialog title',
  message: 'Dialog body text goes here.',
  cancelable: true
})

dialog.show()
```
