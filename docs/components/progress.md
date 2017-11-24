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

@todo
