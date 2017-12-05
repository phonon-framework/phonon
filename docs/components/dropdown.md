# Dropdown

## Introduction

[WIP]

## Markup

```html

```

For the selected item, add `data-selected`.
For each item, you must add `data-value`.
By default, the module will try to find the text node otherwise, it will check if the attribute `data-text` is present.

Add the class `dropdown-lg` to increase the size.

```html

```


Add the class `dropdown-sm` to reduce the size.

```html

```

## JavaScript

```js
const dropdown = phonon.dropdown({
  element: '.dropdown'
})
```

## Options

## Methods

### getSelected()

Returns the selected value.

### setSelected(value: string, text: string)

Set the current value.

```js
dropdown.setSelected('green')
```

it is possible to display a custom text with the second parameter.

```js
dropdown.setSelected('green', 'Current text')
```

### show()

...

### hide()

...

### toggle()

...

## Events

### Object Events

```js
phonon.dropdown({
  element: '.dropdown',
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
  },
  itemSelected(selected) { // or onItemSelected
    console.log('It works!')
    console.log(selected.item)
    console.log(selected.text)
    console.log(selected.value)
  }
})
```
