# Notification

## Introduction

[WIP]

## Dynamically Created Notifications

By not using the `element` property, it will create a notification's HTMLElement dynamically.
This is particularly useful if you want to set up a notification without worrying about its HTML code.

```js
const notif = phonon.notification({
  message: 'Hello'
})

notif.show()
```

## Custom Notification

Conversely, you can create your own notification by specifying the `element` property.

```html
<div class="notification" id="myNotification">
  <div class="notification-inner">
    <div class="message">You have 2 messages in your inbox</div>
    <button class="btn">X</button>
  </div>
</div>
```

Then, you can work with it by using the correct `element` property.

```js
const notif = phonon.notification({
  element: '#myNotification',
  message: 'Hello'
})

notif.show()
```

## Methods

### show()

Any notification can be shown with JavaScript. For this, we call the `show()` method:

```js
notif.show()
```

### hide()

Any notification can be hidden with JavaScript, not only by clicking on its buttons. For this, we call the `hide()` method:

```js
notif.hide()
```

## Events

@todo
