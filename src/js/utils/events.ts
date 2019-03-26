// Use available events
let availableEvents = ['mousedown', 'mousemove', 'mouseup'];
let touchScreen: boolean = false;

if (typeof window !== 'undefined') {
  if (('ontouchstart' in window) || (window as any).DocumentTouch
    && document instanceof (window as any).DocumentTouch) {
    touchScreen = true;
    availableEvents = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
  }

  if (window.navigator.pointerEnabled) {
    availableEvents = ['pointerdown', 'pointermove', 'pointerup', 'pointercancel'];
  } else if (window.navigator.msPointerEnabled) {
    availableEvents = ['MSPointerDown', 'MSPointerMove', 'MSPointerUp', 'MSPointerCancel'];
  }
}

interface IEventTypes {
  name: string;
  start: string;
  end: string;
}

const transitions: IEventTypes[] = [
  { name: 'transition', start: 'transitionstart', end: 'transitionend' },
  { name: 'MozTransition', start: 'transitionstart', end: 'transitionend' },
  { name: 'msTransition', start: 'msTransitionStart', end: 'msTransitionEnd' },
  { name: 'WebkitTransition', start: 'webkitTransitionStart', end: 'webkitTransitionEnd' },
];
const animations: IEventTypes[] = [
  { name: 'animation', start: 'animationstart', end: 'animationend' },
  { name: 'MozAnimation', start: 'animationstart', end: 'animationend' },
  { name: 'msAnimation', start: 'msAnimationStart', end: 'msAnimationEnd' },
  { name: 'WebkitAnimation', start: 'webkitAnimationStart', end: 'webkitAnimationEnd' },
];

const el: HTMLElement = window.document.createElement('div');

const transition = transitions.find(t => typeof el.style[t.name] !== 'undefined');
const animation = animations.find(t => typeof el.style[t.name] !== 'undefined');

const transitionStart = transition ? transition.start : 'transitionstart';
const transitionEnd = transition ? transition.end : 'transitionend';
const animationStart = animation ? animation.start : 'animationstart';
const animationEnd = animation ? animation.end : 'animationend';

export default {
  // touch screen support
  TOUCH_SCREEN: touchScreen,

  // network
  NETWORK_ONLINE: 'online',
  NETWORK_OFFLINE: 'offline',
  NETWORK_RECONNECTING: 'reconnecting',
  NETWORK_RECONNECTING_SUCCESS: 'reconnect.success',
  NETWORK_RECONNECTING_FAILURE: 'reconnect.failure',

  // component states
  SHOW: 'show',
  SHOWN: 'shown',
  HIDE: 'hide',
  HIDDEN: 'hidden',

  // hash
  HASH: 'hash',

  // touch, mouse and pointer events polyfill
  START: availableEvents[0],
  MOVE: availableEvents[1],
  END: availableEvents[2],
  CANCEL: typeof availableEvents[3] === 'undefined' ? null : availableEvents[3],

  // click
  CLICK: 'click',

  // transitions
  TRANSITION_START: transitionStart,
  TRANSITION_END: transitionEnd,

  // animations
  ANIMATION_START: animationStart,
  ANIMATION_END: animationEnd,

  // selectbox
  ITEM_SELECTED: 'itemSelected',
};
