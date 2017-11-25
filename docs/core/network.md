# Network

## Introduction
Network is a simple module to know the status of the network, i. e. whether the user has a working connection or not.

## Events

### DOM Events

```js
window.addEventListener('online.ph.network', function (event) {
  console.log('online')
  console.log(event.detail.date)
})

window.addEventListener('offline.ph.network', function (event) {
  console.log('offline')
  console.log(event.detail.date)
})
```

### Object Events

```js
const network = phonon.network({
  online: (event) => {
    console.log(`online ${event.date}`)
  },
  offline: (event) => {
    console.log(`offline ${event.date}`)
  }
})
```
