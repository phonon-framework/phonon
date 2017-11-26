# Internationalization (i18n)

## Introduction

The internationalization plugin is meant to be simple and light to internationalize your application. You put the texts in each language as an object, the default language (fallback) as well as the user's preferred language and the plugin will display the text in the correct language in your views.

## Configuration

```js
const intl = phonon.intl({
  fallbackLocale: 'en',
  locale: 'en',
  data: {
    en: {
      welcome: 'Hello (default)'
    },
    en_US: {
      welcome: 'Hello US'
    },
    fr: {
      welcome: 'Bonjour'
    }
  }
})
```

## HTML Markup

The HTML elements with the `data-i18n` attribute will be modified by the module. For example, **text** will insert the internationalized text into the element.

```html
<h1 data-i18n="text: welcome"></h1>
<input type="text" class="form-control" data-i18n="value: welcome" value="">
<input type="text" class="form-control" data-i18n="data-attr: welcome, placeholder: welcome" value="">
```

If the locale is `en`, the result would be:

```html
<h1 data-i18n="text: welcome">Welcome</h1>
<input type="text" class="form-control" data-i18n="value: welcome" value="Welcome">
<input type="text" class="form-control" data-attr="Welcome" placeholder="Welcome" data-i18n="data-attr: welcome, placeholder: welcome" value="">
```

## Methods

### getLocale()

Returns the current locale.

### getFallbackLocale()

Returns the fallback locale.

### getLanguages()

Returns the available languages.

### setLocale(locale: string, updateHTML: boolean)

Updates the current locale with a new `locale`. By default, it will update the HTML,
put false if you don't want to.

```js
intl.setLocale('fr')
```

### updateHtml(HTMLElement?)

Updates the HTML. If no argument is passed, it will update all the nodes containing the attribute `data-i18n`.
On the contrary, you can pass a desired HTML node.

```js
intl.updateHtml() // update all the elements (nodes) containing data-i18n
intl.updateHtml('.my-element') // update the node .my-element
```

### translate(keyName:string | array, values?)

This method returns the desired internationalized text in the current language by providing its key.

```js
intl.translate('welcome') // one translation
intl.translate('*') // all available translations
intl.translate(['welcome', 'other']) // two translations
```

If the locale is `fr`, the result would be:

```
Bonjour
{welcome: 'Bonjour', other: 'Autre', ...}
{welcome: 'Bonjour', other: 'Autre'}
```

### t (alias of translate)

The code below is identical to the one displayed in `translate()`.

```js
intl.t('welcome')
intl.t('*')
intl.t(['welcome', 'other'])
```

### Advanced

You can also retrieve internationalized text by injecting values. For this, you need to add the prefix
**:** following the name.
In this example, we will show Hello following two names (name1 and name2).
We need to add **:name1** and **:name2** in our data configuration.

```js
const intl = phonon.intl({
  fallbackLocale: 'en',
  locale: 'fr',
  data: {
    en: {
      welcome: 'Hello :name1 and :name2'
    },
    fr: {
      welcome: 'Bonjour :name1 et :name2'
    }
  }
})

intl.translate('welcome', {name1: 'Fabien', name2: 'Ben'})
```

If the locale is `fr`, the result would be:

```
Bonjour Fabien et Ben
```