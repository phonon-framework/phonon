/* ========================================================================
* Ratchet: popovers.js v2.0.2
* http://goratchet.com/components#popovers
* ========================================================================
* Copyright 2014 Connor Sears
* Licensed under MIT (https://github.com/twbs/ratchet/blob/master/LICENSE)
*
* Forked by the Phonon team
* Phonon: popovers.js v0.0.2
* http://phonon.quarkdev.com
* ======================================================================== */
!(function () {
  
  'use strict';

  var transitionEnd = 'webkitTransitionEnd';
  var isCordova = typeof window.cordova !== 'undefined' ? true : false;
  if (!('webkitTransitionEnd' in window) && !isCordova) {
      transitionEnd = 'transitionend';
  }
    
  var popover;

  var findPopovers = function (target) {
    for (; target && target !== document; target = target.parentNode) {
      if (target.hash) {
        return target;
      }
    }
  };

  var onPopoverHidden = function () {
    popover.style.display = 'none';
    popover.removeEventListener(transitionEnd, onPopoverHidden);

    backdrop.classList.add('fadeout');
    backdrop.addEventListener(transitionEnd, popoverHidden);
  };

  var popoverHidden = function () {
    backdrop.classList.remove('fadeout');
    popover.parentNode.removeChild(backdrop);

    backdrop.removeEventListener(transitionEnd, popoverHidden);
  };

  var backdrop = (function () {

    var element = document.createElement('div');

    element.classList.add('backdrop');

    element.addEventListener('touchstart', function () {
      if(popover.classList.contains('visible')) {
        popover.addEventListener(transitionEnd, onPopoverHidden);
      }
      popover.classList.remove('visible');
    });
    return element;
  }());

  var getPopover = function (e) {
    var anchor = findPopovers(e.target);

    if (!anchor || !anchor.hash || (anchor.hash.indexOf('/') > 0)) {
      return;
    }

    try {
      popover = document.querySelector(anchor.hash);
    }
    catch (error) {
      popover = null;
    }

    if (popover === null) {
      return;
    }

    if (!popover || !popover.classList.contains('popover')) {
      return;
    }

    return popover;
  };

  var showHidePopover = function (e) {


    var p = getPopover(e);

    if (!p) {
      if (e.target.nodeName === 'LI' && popover) {
        popover.addEventListener(transitionEnd, onPopoverHidden);
        popover.classList.remove('visible');
      }
      return;
    }

    popover = p;

    if(!popover.classList.contains('visible')) {
      popover.style.display = 'block';
      popover.offsetHeight;
      popover.classList.add('visible');
      
      popover.parentNode.appendChild(backdrop);
    }
  };

  window.addEventListener('touchend', showHidePopover);

}());