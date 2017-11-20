# Upgrade guide

Upgrading to 2.0 from 1.x.

**Estimated time**: 4 hours.
**Prepare a coffee** and start it right now!

## Table of contents

* Core features
* phonon.options()
* Page events
* Page templates
* Navigation between pages
* Ajax
* Internationalisation (i18n)
* Components
* Utility

## Core features

### phonon.options() <i>Removed</i>

Options are now passed in:

```js
const pager = phonon.pager({
  hashPrefix: '#!',
  useHash: true,
  defaultPage: 'one',
  animatePages: false,
})
```

### Page events <i>Changed</i>

For a given page `myPage` for example.
Assuming this page is present in the DOM like the following: `<div data-page></div>`

```js
pager.select('myPage').addEvents({
  show: function () {
    console.log('myPage: show')
  },
  shown: function () {
    console.log('myPage: shown')
  },
  hide: function () {
    console.log('myPage: hide')
  },
  hidden: function () {
    console.log('myPage: hidden')
  },
  hash: function () {
    console.log('myPage: hash')
  }
})
```

For any pages: use a star as a selector.

```js
pager.select('*').addEvents({
  show: function () {
    console.log('global: show')
  },
  shown: function () {
    console.log('global: shown')
  },
  hide: function () {
    console.log('global: hide')
  },
  hidden: function () {
    console.log('global: hidden')
  },
  hash: function () {
    console.log('global: hash')
  }
})
```

You can also add DOM events:

```js
window.addEventListener('myPage.show', function () {
  console.log('myPage: show (DOM event)')
})
```

### Page templates <i>Changed</i>

You need to use `useTemplate()`.

```js
pager.select('myPage').useTemplate('templates/template.html')
```

It is now possible to use custom template renderers.
For example, if you want to use [Mustache](https://mustache.github.io).
```js
pager.select('myPage').useTemplate('template.html', function (page, template, elements) {
  page.querySelector('[data-render]').innerHTML = template
})
```

### Navigation between pages

Replace `data-navigation` by `data-navigate`.
Note: `data-navigate="$back"` works.
Use `data-pop-page` for back animation if you want to force the back animation.

### Ajax <i>nothing changed</i>

```js
const request = phonon.ajax({
  method: 'GET',
  url: 'http://url.com',
  crossDomain: true,
  dataType: 'json',
  //contentType: '',
  //data: {key1: 'val1', key2: 'val2'}, (will be converted in string format)
  timeout: 1,
  headers: {
      'Access-Control-Allow-Origin': '*'
  },
  success: function (res, xhr) {
    console.log(res)
  },
  error: function(flagError, xhr) {
    console.error(flagError)
  }
})
```

### Internationalisation (i18n)

For the internationalisation, there are many changes.
Now, you need to pass all the data directly.
It is no longer possible to load JSON by doing Ajax requests.
If you need to keep this feature, you can execute load JSON language files and then
pass everything as the second argument.

```
phonon.intl('en', {
  en: {
    welcome: 'Hello (default)'
  },
  'en_US': {
    welcome: 'Hello US'
  },
  fr: {
    welcome: 'Bonjour'
  }
})
```

## Components

### Utility

#### Padding

More information can be found here: [https://getbootstrap.com/docs/4.0/utilities/spacing/](https://getbootstrap.com/docs/4.0/utilities/spacing/)

Replace **.padded-full** by **.p-1**.
Replace **.padded-top** by **.pt-1**.
Replace **.padded-left** by **.pl-1**.
Replace **.padded-right** by **.pr-1**.
Replace **.padded-bottom** by **.pb-1**.

#### Show/Hide Elements

Replace **.show-for-phone-only** by **.d-sm-none**.
Replace **.show-for-tablet-only** by **?**.
Replace **.show-for-tablet-up** by **?**.
Replace **.show-for-large-only** by **?**.
Replace **.show-for-android-only** by **?**.
Replace **.show-for-ios-only** by **?**.
Replace **.show-for-web-only** by **?**.

#### Text Alignment

More information can be found here: [https://getbootstrap.com/docs/4.0/utilities/text/#text-alignment](https://getbootstrap.com/docs/4.0/utilities/text/#text-alignment)

Replace **.padded-full** by **.p-1**.
Replace **.padded-top** by **.pt-1**.
Replace **.padded-left** by **.pl-1**.
Replace **.padded-right** by **.pr-1**.
Replace **.padded-bottom** by **.pb-1**.

#### Float

Replace **.pull-left** by **.float-left**.
Replace **.pull-right** by **.float-right**.

#### Expand Width

Replace **.fit-parent** by **.w-100**.
