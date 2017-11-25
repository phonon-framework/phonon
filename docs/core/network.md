# Network

## Introduction
Network is a simple module to know the status of the network, i. e. whether the user has a working connection or not.

## Events

### DOM Events

```js
window.addEventListener('online.ph.network', (event) => {
  console.log(`online ${event.detail.date}`)
})

window.addEventListener('offline.ph.network', (event) => {
  console.log(`offline ${event.detail.date}`)
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
  }
})
```
