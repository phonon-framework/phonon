# Network

Network is a simple module to know the status of the network, i. e. whether the user has a working connection or not.

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
