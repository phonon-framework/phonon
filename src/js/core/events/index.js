
window.addEventListener('error', event => {
  console.error('An error has occured! You can pen an issue here: https://github.com/quark-dev/Phonon-Framework/issues')
})

// Use available events
let availableEvents = ['mousedown', 'mousemove', 'mouseup']
let touchScreen = false

if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
  touchScreen = true
  availableEvents = ['touchstart', 'touchmove', 'touchend', 'touchcancel']
}

if (window.navigator.pointerEnabled) {
  availableEvents = ['pointerdown', 'pointermove', 'pointerup', 'pointercancel']
} else if (window.navigator.msPointerEnabled) {
  availableEvents = ['MSPointerDown', 'MSPointerMove', 'MSPointerUp', 'MSPointerCancel']
}

export default {
  // network
  NETWORK_ONLINE: 'online',
  NETWORK_OFFLINE: 'offline',

  // states
  SHOW: 'show',
  SHOWN: 'shown',
  HIDE: 'hide',
  HIDDEN: 'hidden',

  // touch, mouse or pointer events polyfill
  START: availableEvents[0],
  MOVE: availableEvents[1],
  END: availableEvents[2],
  CANCEL: typeof availableEvents[3] === 'undefined' ? null : availableEvents[3],
  TOUCH_SCREEN: touchScreen
}