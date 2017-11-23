// @todo keep ?
if (typeof window !== 'undefined') {
  window.addEventListener('error', () => {
    console.error('An error has occured! You can pen an issue here: https://github.com/quark-dev/Phonon-Framework/issues')
  })
}

// Use available events
let availableEvents = ['mousedown', 'mousemove', 'mouseup']
let touchScreen = false

if (typeof window !== 'undefined') {
  if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
    touchScreen = true
    availableEvents = ['touchstart', 'touchmove', 'touchend', 'touchcancel']
  }

  if (window.navigator.pointerEnabled) {
    availableEvents = ['pointerdown', 'pointermove', 'pointerup', 'pointercancel']
  } else if (window.navigator.msPointerEnabled) {
    availableEvents = ['MSPointerDown', 'MSPointerMove', 'MSPointerUp', 'MSPointerCancel']
  }
}

const el = document.createElement('div')
const transitions = [
  { name: 'transition', start: 'transitionstart', end: 'transitionend' },
  { name: 'MozTransition', start: 'transitionstart', end: 'transitionend' },
  { name: 'msTransition', start: 'msTransitionStart', end: 'msTransitionEnd' },
  { name: 'WebkitTransition', start: 'webkitTransitionStart', end: 'webkitTransitionEnd' },
]
const animations = [
  { name: 'animation', start: 'animationstart', end: 'animationend' },
  { name: 'MozAnimation', start: 'animationstart', end: 'animationend' },
  { name: 'msAnimation', start: 'msAnimationStart', end: 'msAnimationEnd' },
  { name: 'WebkitAnimation', start: 'webkitAnimationStart', end: 'webkitAnimationEnd' },
]

const transitionStart = transitions.find(t => el.style[t.name] !== undefined).start
const transitionEnd = transitions.find(t => el.style[t.name] !== undefined).end
const animationStart = animations.find(t => el.style[t.name] !== undefined).start
const animationEnd = animations.find(t => el.style[t.name] !== undefined).end

export default {
  // touch screen support
  TOUCH_SCREEN: touchScreen,

  // network
  NETWORK_ONLINE: 'online',
  NETWORK_OFFLINE: 'offline',

  // user interface states
  SHOW: 'show',
  SHOWN: 'shown',
  HIDE: 'hide',
  HIDDEN: 'hidden',

  // touch, mouse and pointer events polyfill
  START: availableEvents[0],
  MOVE: availableEvents[1],
  END: availableEvents[2],
  CANCEL: typeof availableEvents[3] === 'undefined' ? null : availableEvents[3],

  // transitions
  TRANSITION_START: transitionStart,
  TRANSITION_END: transitionEnd,

  // animations
  ANIMATION_START: animationStart,
  ANIMATION_END: animationEnd,
}