# Off Canvas

## Introduction

[WIP]

## Markup

```html
<!-- Button trigger off-canvas -->
<button class="btn btn-primary" data-toggle="off-canvas" data-target="#exampleOffCanvas">Launch demo off-canvas</button>

<!-- Off-canvas -->
<div class="off-canvas" id="exampleOffCanvas" role="navigation" aria-hidden="true" aria-labelledby="exampleOffCanvasTitle">
  <div class="off-canvas-inner">
    <div class="off-canvas-content">
      <div class="off-canvas-header">
        <h1 class="off-canvas-title">Title</h1>
        <button type="button" class="close" data-dismiss="off-canvas" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="off-canvas-body">
        <p>Content</p>
      </div>
      <div class="off-canvas-footer">
        <p>Footer</p>
      </div>
    </div>
  </div>
</div>
```

Then, you can work with it by using the correct `element` property.

Note that you can add the class `off-canvas-aside` in the body element so that the correct view in CSS is already ready before the JavaScript API adds it.

```js
const offCanvas = phonon.offCanvas({
  element: '#myOffCanvas'
})

offCanvas.show()
```

## Options

- aside

## Methods

### show()

Any off canvas can be shown with JavaScript. For this, we call the `show()` method:

```js
offCanvas.show()
```


### hide()

Any off canvas can be hidden with JavaScript, not only by clicking on its buttons. For this, we call the `hide()` method:

```js
offCanvas.hide()
```


## Events

It may be useful to use the events that affect your off-canvas.
To do this, you can use object and DOM events.


|     Event Type     |     Description      |
|--------------------|----------------------|
|  show    |   This event fires immediately when the <code>show</code> instance method is called. If caused by a click, the clicked element is available as the <code>relatedTarget</code> property of the event.   |
|  shown   |  This event is fired when the off-canvas has been made visible to the user (will wait for CSS transitions to complete). If caused by a click, the clicked element is available as the <code>relatedTarget</code> property of the event.    |
|  hide    |    This event is fired immediately when the <code>hide</code> instance method has been called.   |
|  hidden  |   This event is fired when the off-canvas has finished being hidden from the user (will wait for CSS transitions to complete).    |


### Object Events

```js
phonon.offCanvas({
  element: '#exampleOffCanvas',
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
document.querySelector('.off-canvas').addEventListener('show.ph.off-canvas', () => {
  console.log('It works!')
})

document.querySelector('.off-canvas').addEventListener('shown.ph.off-canvas', () => {
  console.log('It works!')
})

document.querySelector('.off-canvas').addEventListener('hide.ph.off-canvas', () => {
  console.log('It works!')
})

document.querySelector('.off-canvas').addEventListener('hidden.ph.off-canvas', () => {
  console.log('It works!')
})
```
