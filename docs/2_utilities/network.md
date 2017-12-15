---
title: Network
---

## Introduction

Network is a simple module to know the status of the network, i. e. whether the user has a working connection or not.

```js
const network = phonon.network({
  initialDelay: 3000,
  delay: 5000
})
```

## Options

- initialDelay
- delay

## Events

### DOM Events

```js
window.addEventListener('online.ph.network', (event) => {
  console.log(`online ${event.detail.date}`)
})

window.addEventListener('offline.ph.network', (event) => {
  console.log(`offline ${event.detail.date}`)
})

window.addEventListener('reconnecting.ph.network', (event) => {
  console.log(`reconnecting ${event.detail.date}`)
})

window.addEventListener('reconnect.success.ph.network', (event) => {
  console.log(`reconnect success ${event.detail.date}`)
})

window.addEventListener('reconnect.failure.ph.network', (event) => {
  console.log(`reconnect failure ${event.detail.date}`)
})
```

### Object Events

```js
phonon.network({
  online: (event) => {
    console.log(`online ${event.date}`)
  },
  offline: (event) => {
    console.log(`offline ${event.date}`)
  },
  reconnecting: (event) => {
    console.log(`reconnecting ${event.date}`)
  },
  reconnectSuccess: (event) => {
    console.log(`reconnect success ${event.date}`)
  },
  reconnectFailure: (event) => {
    console.log(`reconnect failure ${event.date}`)
  }
})
```

## Use Case

It can be useful to notify the user of a network change with a notification.

```js
window.addEventListener('online.ph.network', (event) => {
  phonon.notification({
    message: 'You are now online.'
  }).show()
})

window.addEventListener('offline.ph.network', (event) => {
  phonon.notification({
    message: 'You are now offline.'
  }).show()
})
```
