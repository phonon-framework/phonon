/* ========================================================================
* Phonon: alerts.js v0.0.1
* http://phonon.quarkdev.com
* ========================================================================
* Licensed under MIT (http://phonon.quarkdev.com)
* ======================================================================== */

'use strict';

;(function (window, document, Phonon, undefined) {

  var transitionEnd = 'webkitTransitionEnd';
  
  if (Phonon.animationEnd) {
      transitionEnd = (Phonon.animationPrefix === '' ? 'transitionend' : 'webkitTransitionEnd');
  }
  
  var lastTrigger = false;
  var moved = false;
  var alerts = [];
  var busy = false;

  var createBackdrop = function () {
    var backdrop = document.createElement('div');
    backdrop.classList.add('backdrop-alert');
    return backdrop;
  };

  var findTrigger = function (target) {
    var triggers = document.querySelectorAll('[data-alert-id], [data-alert-close]'), i;
    for (; target && target !== document; target = target.parentNode) {
      for (i = triggers.length; i--;) {
        if (triggers[i] === target) {
          return target;
        }
      }
    }
  };

  var getAlert = function (event) {
    var alertToggle = findTrigger(event.target);
    if (alertToggle) {
      var alertId = alertToggle.getAttribute('data-alert-id');
      if(alertId) {
        return document.querySelector('#'+alertId);
      } else {
        return findAlert(event.target);
      }
    }
  };

  var findAlert = function (target) {
    var alerts = document.querySelectorAll('.alert'), i;

    for (; target && target !== document; target = target.parentNode) {
      for (i = alerts.length; i--;) {
        if (alerts[i] === target && target.classList.contains('active')) {
          return target;
        }
      }
    }
  };

  var onItem = function (target) {
    for (; target && target !== document; target = target.parentNode) {
      if(target.getAttribute('selectable') === 'true') {
        return target;
      }
    }
  };

  window.addEventListener('touchstart', function (evt) {
    evt = evt.originalEvent || evt;

    if(alerts.length > 0) {
      var previousAlert = alerts[alerts.length - 1].alert, p = findAlert(evt.target);

      if (!p) {
        if(previousAlert.getAttribute('data-cancelable') !== 'false') close(previousAlert);
      }

      if (p && p !== previousAlert) {
        // Case where there are two active alerts
        if (p.id !== previousAlert.id) {
          close(previousAlert);
        }
      } 
    }
  });

  window.addEventListener('touchmove', function (evt) {
    evt = evt.originalEvent || evt;
    moved = true;
  });

  window.addEventListener('touchend', function (evt) {

    var trigger = findTrigger(evt.target), alert = null;

    if (trigger) {
      alert = getAlert(evt);

      lastTrigger = trigger;

      if(alert) {
        if(alert.classList.contains('active')) {
          close(alert);
        } else {
          open(alert);
        }
      }
    }

    alert = findAlert(evt.target);
    var item = onItem(evt.target);

    if(alert && item && !moved) {
        
      close(alert);

      evt = new CustomEvent('select', {
        detail: { item: item.textContent, target: evt.target },
        bubbles: true,
        cancelable: true
      });

      lastTrigger.textContent = item.textContent;

      alert.dispatchEvent(evt);
    }
    moved = false;
  });

  function onHide() {

    var page = document.querySelector('.app-page.app-active');
    if(page.querySelector('div.backdrop-alert') !== null) {

      var backdrop = alerts[alerts.length - 1].backdrop;
      backdrop.classList.remove('fadeout');

      page.removeChild(backdrop);

      var previousAlert = alerts[alerts.length - 1].alert;
      previousAlert.style.visibility = 'hidden';
      previousAlert.classList.remove('close');

      alerts.pop();

      busy = false;

      this.removeEventListener(transitionEnd, onHide, false);
    }
  }

  function center (target) {

    var computedStyle = getComputedStyle(target),
    width = computedStyle.width,
    height = computedStyle.height;

    width = width.slice(0, width.length - 2);
    height = height.slice(0, height.length - 2);

    var left = (window.innerWidth / 2) - (width / 2),
        top = (window.innerHeight / 2) - (height / 2);

    target.style.marginLeft = left + 'px';
    target.style.marginTop = top + 'px';
  }

  /**
   * Public API
  */

  function open (el) {
    var alert = (typeof el === 'string' ? document.querySelector(el) : el);
    
    if(alert === null) {
      throw new Error('The alert with ID ' + el + ' does not exist');
    }

    if(busy) {
      return;
    }

    alert.style.visibility = 'visible';


    if(!alert.classList.contains('active')) {

      center(alert);

      alert.classList.add('active');


      var backdrop = createBackdrop();

      alerts.push( {alert: alert, backdrop: backdrop} );

      document.querySelector('.app-page.app-active').appendChild(backdrop);
    }
  }

  function close (el) {
    var alert = (typeof el === 'string' ? document.querySelector(el) : el);
    if(alert === null) {
      throw new Error('The alert with ID ' + el + ' does not exist');
    }

    if(busy) {
      return;
    }

    if(alert.classList.contains('active') && !busy) {
      
      busy = true;

      alert.classList.remove('active');
      alert.classList.add('close');

      var backdrop = alerts[alerts.length - 1].backdrop;

      backdrop.classList.add('fadeout');

      backdrop.addEventListener(transitionEnd, onHide, false);
    }
  }

  function toggle(el) {
    var alert = (typeof el === 'string' ? document.querySelector(el) : el);
    if(alert === null) {
      throw new Error('The alert with ID ' + el + ' does not exist');
    }
    
    if(alert.classList.contains('active')) {
      close(alert);
    } else {
      open(alert);
    }
  }


  Phonon.Alert = function (el) {
    var alert = (typeof el === 'string' ? document.querySelector(el) : el);
    if(alert === null) {
      throw new Error('The alert with ID ' + el + ' does not exist');
    }

    return {
      open: function () {
        open(alert);
        return this;
      },
      close: function () {
        close(alert);
        return this;
      },
      toggle: function () {
        toggle(alert);
        return this;
      }
    };
  };
  window.Phonon = Phonon;

  if (typeof define === 'function' && define.amd) {
      define(function () {
          if(Phonon.returnGlobalNamespace === true) {
              return Phonon;
          } else {
              return Phonon.Alert;
          }
      });
  } else if (typeof module === 'object' && module.exports) {
      if(Phonon.returnGlobalNamespace === true) {
          module.exports = Phonon;
      } else {
          module.exports = Phonon.Alert;
      }
  }

}(window, document, window.Phonon || {}));