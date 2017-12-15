---
title: Loader
---

## Introduction

[WIP]

## Markup

```html
<div class="loader">
  <div class="loader-spinner"></div>
</div>
```

it may be useful not to show the loader, but after a while. For this, we add the `hide` class.

```html
<div class="loader hide">
  <div class="loader-spinner"></div>
</div>
```

## JavaScript

```js
const loader = phonon.loader({
  element: '.loader'
})
```

## Options

- color
- size

## Methods

### animate(startAnimation: boolean)

Animates the loader.
In most cases, it is preferable to use this method to display and hide the loader. If the passed argument is true, it will display the loader and start the animation. Conversely, false will hide and finish the animation.

```js
loader.animate() // show and start the animation
loader.animate(false) // hide and stop the animation
```

### show()

Any loader can be shown with JavaScript. For this, we call the `show()` method:

```js
loader.show()
```

### hide()

Any loader can be hidden with JavaScript. For this, we call the `hide()` method:

```js
loader.hide()
```

## Events

@todo
