---
title: Accordion
---

## Introduction

[WIP]

## Markup

```html
<div class="accordion" id="exampleAccordion" role="tablist">
  <a class="d-block" data-toggle="accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
    Collapsible Group Item #1
  </a>

  <div id="collapseOne" class="collapse" role="tabpanel" aria-labelledby="headingOne">
    <div class="card-body">
      This is the content of the group item #1.
    </div>
  </div>

  <a class="d-block" data-toggle="accordion" href="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
    Collapsible Group Item #2
  </a>

  <div id="collapseTwo" class="collapse" role="tabpane2" aria-labelledby="headingTwo">
    <div class="card-body">
      This is the content of the group item #2.
    </div>
  </div>
</div>
```

## JavaScript

```js
const accordion = phonon.accordion({
  element: '#exampleAccordion',
})
```

## Methods

### show(collapse: any)

```js
accordion.show('#myCollapse')
```

### hide(collapse: any)

```js
accordion.hide('#myCollapse')
```

## Events

@todo
