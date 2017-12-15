---
title: Dialog
---

## Introduction

[WIP]


## Dynamically Created Dialogs

By not using the `element` property, it will create a dialog's HTMLElement dynamically.
This is particularly useful if you want to set up a dialog without worrying about its HTML code.

```js
const dialog = phonon.dialog({
  title: 'Dialog title',
  message: 'Dialog body text goes here.'
})

dialog.show()
```

## Custom Dialogs

Conversely, you can create your own dialog by specifying the `element` property.

```html
<!-- Button trigger dialog -->
<button class="btn btn-primary" data-toggle="dialog" data-target="#exampleDialog">Launch demo dialog</button>

<!-- Dialog -->
<div class="dialog" id="exampleDialog" tabindex="-1" role="dialog">
  <div class="dialog-inner" role="document">
    <div class="dialog-content">
      <div class="dialog-header">
        <h5 class="dialog-title">Dialog title</h5>
      </div>
      <div class="dialog-body">
        <p>Dialog body text goes here.</p>
      </div>
      <div class="dialog-footer">
        <div class="btn-group float-right" role="group" aria-label="Basic example">
          <button type="button" class="btn btn-primary" data-dismiss="dialog">Close</button>
        </div>
      </div>
    </div>
  </div>
</div>
```

Then, you can work with it by using the correct `element` property.

```js
const dialog = phonon.dialog({
  element: '#exampleDialog'
})

dialog.show()
```

## Options

- title
- message
- cancelable

## Methods

### show()

Any dialog can be shown with JavaScript. For this, we call the `show()` method:

```js
dialog.show()
```


### hide()

Any dialog can be hidden with JavaScript, not only by clicking on its buttons. For this, we call the `hide()` method:

```js
dialog.hide()
```


## Events

It may be useful to use the events that affect your dialog.
To do this, you can use object and DOM events.


|     Event Type     |     Description      |
|--------------------|----------------------|
|  show    |   This event fires immediately when the <code>show</code> instance method is called. If caused by a click, the clicked element is available as the <code>relatedTarget</code> property of the event.   |
|  shown   |  This event is fired when the dialog has been made visible to the user (will wait for CSS transitions to complete). If caused by a click, the clicked element is available as the <code>relatedTarget</code> property of the event.    |
|  hide    |    This event is fired immediately when the <code>hide</code> instance method has been called.   |
|  hidden  |   This event is fired when the dialog has finished being hidden from the user (will wait for CSS transitions to complete).    |


### Object Events

```js
phonon.dialog({
  title: 'Dialog title',
  message: 'Dialog body text goes here.',
  show: () => { // or onShow
    console.log('It works!')
  },
  shown: () => { // or onShown
    console.log('It works!')
  },
  hide: () => { // or onHide
    console.log('It works!')
  },
  hidden: () => { // or onHidden
    console.log('It works!')
  }
})
```

### DOM Events

```js
document.querySelector('.dialog').addEventListener('show.ph.dialog', () => {
  console.log('It works!')
})

document.querySelector('.dialog').addEventListener('shown.ph.dialog', () => {
  console.log('It works!')
})

document.querySelector('.dialog').addEventListener('hide.ph.dialog', () => {
  console.log('It works!')
})

document.querySelector('.dialog').addEventListener('hidden.ph.dialog', () => {
  console.log('It works!')
})
```
