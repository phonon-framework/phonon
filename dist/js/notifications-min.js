"use strict";!function(t,n,e){function i(){var n=this;n.classList.add("showing");var e=new CustomEvent("phonon-notif:opened",{detail:{target:n},bubbles:!0,cancelable:!0});n.dispatchEvent(e);var o=n.getAttribute("data-timeout");o&&(isNaN(parseInt(o))?console.error("Attribute data-timeout must be a number"):t.setTimeout(function(){s(n)},o)),n.removeEventListener(a,i,!1)}function o(){var t=this;t.classList.remove("showing");var n=new CustomEvent("phonon-notif:hidden",{detail:{target:t},bubbles:!0,cancelable:!0});t.dispatchEvent(n),t.style.visibility="hidden",t.removeEventListener(a,o,!1)}function r(t){var e="string"==typeof t?n.querySelector(t):t;if(null===e)throw new Error("The notification with ID "+t+" does not exist");e.classList.contains("show")||(e.classList.add("show"),e.style.visibility="visible",e.addEventListener(a,i,!1))}function s(t){var e="string"==typeof t?n.querySelector(t):t;if(null===e)throw new Error("The notification with ID "+t+" does not exist");e.classList.contains("show")&&(e.classList.remove("showing"),e.classList.remove("show"),e.addEventListener(a,o,!1))}var a="webkitTransitionEnd";e.animationEnd&&(a=""===e.animationPrefix?"transitionend":"webkitTransitionEnd");var u=function(t){for(;t&&t!==n;t=t.parentNode)if(t.classList.contains("notification"))return t};t.addEventListener("touchend",function(t){var n=t.target;if("true"===n.getAttribute("data-hide-notif")){var e=u(n);e&&s(e)}}),e.Notification=function(t){var e="string"==typeof t?n.querySelector(t):t;if(null===e)throw new Error("The notification with ID "+t+" does not exist");return{show:function(t){var n=function(){return t.apply(this,arguments)};return n.toString=function(){return t.toString()},n}(function(){return r(e),this}),hide:function(t){var n=function(){return t.apply(this,arguments)};return n.toString=function(){return t.toString()},n}(function(){return s(e),this})}},t.Phonon=e,"function"==typeof define&&define.amd?define(function(){return e.returnGlobalNamespace===!0?e:e.Notification}):"object"==typeof module&&module.exports&&(module.exports=e.returnGlobalNamespace===!0?e:e.Notification)}(window,document,window.Phonon||{});