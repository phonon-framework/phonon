# Nav

## Introduction

[WIP]

## Tabs

### Markup

```html
<ul class="nav nav-tabs" role="tablist">
  <li class="nav-item">
    <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Home</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Profile</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" id="messages-tab" data-toggle="tab" href="#messages" role="tab" aria-controls="messages" aria-selected="false">Messages</a>
  </li>
</ul>

<div class="tab-content">
  <div class="tab-pane active" id="home" role="tabpanel" aria-labelledby="home-tab">First content.</div>
  <div class="tab-pane" id="profile" role="tabpanel" aria-labelledby="profile-tab">Second content.</div>
  <div class="tab-pane" id="messages" role="tabpanel" aria-labelledby="messages-tab">Third content.</div>
</div>
```

### JavaScript

```js
const tab = phonon.tab({
  element: '[href="#profile"]'
})
```

### Methods

#### show()

#### hide()
