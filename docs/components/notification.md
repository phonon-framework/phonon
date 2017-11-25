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
    <button type="button" class="close" data-dismiss="notification" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
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

## Options

- showButton
- timeout
- background

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

It may be useful to use the events that affect your notification.
To do this, you can use object and DOM events.


|     Event Type     |     Description      |
|--------------------|----------------------|
|  show    |   This event fires immediately when the <code>show</code> instance method is called. If caused by a click, the clicked element is available as the <code>relatedTarget</code> property of the event.   |
|  shown   |  This event is fired when the notification has been made visible to the user (will wait for CSS transitions to complete). If caused by a click, the clicked element is available as the <code>relatedTarget</code> property of the event.    |
|  hide    |    This event is fired immediately when the <code>hide</code> instance method has been called.   |
|  hidden  |   This event is fired when the notification has finished being hidden from the user (will wait for CSS transitions to complete).    |


### Object Events

```js
phonon.notification({
  element: '#myNotification',
  message: 'Hello',
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
  }
})
```

### DOM Events

```js
document.querySelector('.notification').addEventListener('show.ph.notification', () => {
  console.log('It works!')
})

document.querySelector('.notification').addEventListener('shown.ph.notification', () => {
  console.log('It works!')
})

document.querySelector('.notification').addEventListener('hide.ph.notification', () => {
  console.log('It works!')
})

document.querySelector('.notification').addEventListener('hidden.ph.notification', () => {
  console.log('It works!')
})
```

