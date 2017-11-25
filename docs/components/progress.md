# Progress

## Introduction

[WIP]

## Markup

```html
<div class="progress" id="myProgress">
  <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
</div>
```

## JavaScript

```js
const progress = phonon.progress({
  element: '#myProgress',
  height: 5,
  min: 0,
  max: 100,
  label: false,
  striped: false,
  background: null,
})
```

## Methods

### set(value: int)

Updates the current value of the progress bar.

### animate(startAnimation: boolean)

Animates the striped progress. The `striped` option must be true otherwise it won't work.

### show()

Any progress can be shown with JavaScript. For this, we call the `show()` method:

```js
progress.show()
```

### hide()

Any progress can be hidden with JavaScript. For this, we call the `hide()` method:

```js
progress.hide()
```

## Events

It may be useful to use the events that affect your progress.
To do this, you can use object and DOM events.


|     Event Type     |     Description      |
|--------------------|----------------------|
|  show    |   This event fires immediately when the <code>show</code> instance method is called. If caused by a click, the clicked element is available as the <code>relatedTarget</code> property of the event.   |
|  shown   |  This event is fired when the progress has been made visible to the user (will wait for CSS transitions to complete). If caused by a click, the clicked element is available as the <code>relatedTarget</code> property of the event.    |
|  hide    |    This event is fired immediately when the <code>hide</code> instance method has been called.   |
|  hidden  |   This event is fired when the progress has finished being hidden from the user (will wait for CSS transitions to complete).    |


### Object Events

```js
phonon.offCanvas({
  element: '#exampleProgress',
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
document.querySelector('.progress').addEventListener('show.ph.progress', () => {
  console.log('It works!')
})

document.querySelector('.progress').addEventListener('shown.ph.progress', () => {
  console.log('It works!')
})

document.querySelector('.progress').addEventListener('hide.ph.progress', () => {
  console.log('It works!')
})

document.querySelector('.progress').addEventListener('hidden.ph.progress', () => {
  console.log('It works!')
})
```
