# Pager

## Introduction

The pager is Phonon's basic module for designing an **SPA**-like application. It connects pages together by providing **page navigation** and allows you to listen to **page events**.
It also offers a light and simple **router** for recovering parameters with the `hash` event.

If your website or web application will not be designed in SPA mode, the pager will only be useful for its router.

## Configuration

```js
const pager = phonon.pager({
  hashPrefix: '#!',
  useHash: true,
  defaultPage: 'myPage',
  animatePages: true
})
```

## HTML Markup

A SPA page is defined by setting up the `app-page` class and a unique data-page attribute.

```html
<div class="app-page" data-page="myPage"></div>
<div class="app-page" data-page="mySecondPage"></div>
<div class="app-page" data-page="myThirdPage"></div>
```

## Page Selector

To work with pages, it is essential to use the `select()` method. Indeed, the new Phonon Pager allows you to work with both a single page and a set of pages.

```js
pager.select('myPage') // one specific page
pager.select('*') // all the pages
pager.select('myPage, mySecondPage') // two specific pages
```

Once you selected pages programatically, you can **use a template** or **listen to events**.

## Page Template

By default, Pager will load the file and set it where the attribute `data-template` is present
in the HTML view.

```js
pager.select('myPage').useTemplate('path/to/template.html')
```

You may want to use a template engine or change the initial behavior of Pager. In this case, the second argument is necessary.

```js
pager.select('myPage').useTemplate('path/to/template.html', (page, template, elements) => {
  page.querySelector('[data-template]').innerHTML = template
})
```

## Events

|     Event Type     |     Description      |
|--------------------|----------------------|
|  show    |   This event fires immediately when the <code>show</code> instance method is called. If caused by a click, the clicked element is available as the <code>relatedTarget</code> property of the event.   |
|  shown   |  This event is fired when the dialog has been made visible to the user (will wait for CSS transitions to complete). If caused by a click, the clicked element is available as the <code>relatedTarget</code> property of the event.    |
|  hide    |    This event is fired immediately when the <code>hide</code> instance method has been called.   |
|  hidden  |   This event is fired when the dialog has finished being hidden from the user (will wait for CSS transitions to complete).    |
|  hash  |   This event is fired when the hash has changed.    |


### Object Events

```js
pager.select('myPage').addEvents({
  show: () => {
    console.log('It works!')
  },
  shown: () => {
    console.log('It works!')
  },
  hide: () => {
    console.log('It works!')
  },
  hidden: () => {
    console.log('It works!')
  },
  hash: (param1, param2) => {
    console.log('It works!')
  }
})
```

### DOM Events

For DOM events, you must specify the name of the page followed by a dot and then the event in question.
Note that DOM events are dispatched in both `window` and `document`.

```js
window.addEventListener('myPage.show', () => {
  console.log('It works!')
})

window.addEventListener('myPage.shown', () => {
  console.log('It works!')
})

window.addEventListener('myPage.hide', () => {
  console.log('It works!')
})

window.addEventListener('myPage.hidden', () => {
  console.log('It works!')
})

window.addEventListener('myPage.hash', event => {
  console.log('It works!')
  const firstParam = event.detail[0]
  const secondParam = event.detail[1]
})
```
