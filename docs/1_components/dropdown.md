---
title: Dropdown
---

## Introduction

[WIP]

## Markup

```html
<div class="dropdown" data-toggle="dropdown">
  <input type="hidden" name="color">
  <i class="dropdown-icon"></i>
  <div class="default-text">Blue</div>
  <div class="dropdown-menu">
    <div class="item" data-value="blue" data-selected="true">Blue</div>
    <div class="item" data-value="red">Red</div>
    <div class="item selected" data-value="green">
      <span class="description">Best one!</span>
      <span class="text">Green</span>
    </div>
  </div>
</div>
```

### Dropdown with invalid item

Add the class `disabled` to the item.

```html
<div class="dropdown" data-toggle="dropdown">
  <input type="hidden" name="color">
  <i class="dropdown-icon"></i>
  <div class="default-text">Blue</div>
  <div class="dropdown-menu">
    <div class="item" data-value="blue" data-selected="true">Blue</div>
    <div class="item" data-value="red">Red</div>
    <div class="item disabled">Invalid item</div> 
  </div>
</div>
```

### Dropdown with header

```html
<div class="dropdown" data-toggle="dropdown">
  <input type="hidden" name="color">
  <i class="dropdown-icon"></i>
  <div class="default-text">Blue</div>
  <div class="dropdown-menu">
    <div class="header">Header</div>
    <div class="item" data-value="blue" data-selected=true>Blue</div>
    <div class="item" data-value="red">Red</div>
  </div>
</div>
```

### Dropdown with divider

```html
<div class="dropdown" data-toggle="dropdown">
  <input type="hidden" name="color">
  <i class="dropdown-icon"></i>
  <div class="default-text">Blue</div>
  <div class="dropdown-menu">
    <div class="item" data-value="blue" data-selected=true>Blue</div>
    <div class="item" data-value="red">Red</div>
    <div class="divider"></div>
    <div class="item" data-value="orange">Orange</div>
    <div class="item" data-value="yellow">Yellow</div>
  </div>
</div>
```

### Dropdown with search input

```html
<div class="dropdown" data-search="true" data-toggle="dropdown">
  <input type="hidden" name="color">
  <i class="dropdown-icon"></i>
  <div class="default-text">Blue</div>
  <div class="dropdown-menu">
    <div class="input-search-container">
      <input class="form-control" type="text" name="search">    
    </div>          
    <div class="item" data-value="blue" data-selected=true>Blue</div>
    <div class="item" data-value="red">Red</div>
    <div class="item" data-value="green">Green</div>
  </div>
</div>
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

// or for a search dropdown
const searchDropdown = phonon.dropdown({
  element: '.dropdown-search',
  search: true
})
```

## Options

- search
- filterItem(search, item)

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
