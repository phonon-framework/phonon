/* ========================================================================
* Phonon: panels.js v0.0.3
* http://phonon.quarkdev.com
* ========================================================================
* Licensed under MIT (http://phonon.quarkdev.com)
* ======================================================================== */
(function (window, document) {

  'use strict';

  var transitionEnd = 'webkitTransitionEnd';
  var isCordova = typeof window.cordova !== 'undefined' ? true : false;
  if (!('webkitTransitionEnd' in window) && !isCordova) {
      transitionEnd = 'transitionend';
  }
  
  var lastTrigger = false;
  var moved = false;
  var panels = [];

  var createBackdrop = function () {
    var backdrop = document.createElement('div');
    backdrop.classList.add('backdrop-panel');
    return backdrop;
  };

  var findTrigger = function (target) {
    var triggers = document.querySelectorAll('[data-panel-id], [data-panel-close]'), i;
    for (; target && target !== document; target = target.parentNode) {
      for (i = triggers.length; i--;) {
        if (triggers[i] === target) {
          return target;
        }
      }
    }
  };

  var getPanel = function (event) {
    var panelToggle = findTrigger(event.target);
    if (panelToggle) {
      var panelId = panelToggle.getAttribute('data-panel-id');
      if(panelId) {
        return document.querySelector('#'+panelId);
      } else {
        return findPanel(event.target);
      }
    }
  };

  var findPanel = function (target) {
    var panels = document.querySelectorAll('.panel, .panel-expanded'), i;

    for (; target && target !== document; target = target.parentNode) {
      for (i = panels.length; i--;) {
        if (panels[i] === target && target.classList.contains('active')) {
          return target;
        }
      }
    }
  };

  var onItem = function (target) {
    for (; target && target !== document; target = target.parentNode) {
      if(target.nodeName === 'LI') {
        return target;
      }
    }
  };

  window.addEventListener('touchstart', function (evt) {
    evt = evt.originalEvent || evt;

    if(panels.length > 0) {
      var previousPanel = panels[panels.length - 1].panel, p = findPanel(evt.target);

      if (!p) close(previousPanel);

      if (p && p !== previousPanel) {
        // Case where there are two active panels
        if (p.id !== previousPanel.id) {
          close(previousPanel);
        }
      } 
    }
  });

  window.addEventListener('touchmove', function (evt) {
    evt = evt.originalEvent || evt;
    moved = true;
  });

  window.addEventListener('touchend', function (evt) {

    var trigger = findTrigger(evt.target);

    if (trigger) {
      var panel = getPanel(evt);

      lastTrigger = trigger;

      if(panel) {
        if(panel.classList.contains('active')) {
          close(panel);
        } else {
          open(panel);
        }
      }
    }

    var panel = findPanel(evt.target);
    var item = onItem(evt.target);

    if(panel && item && !moved) {
      if(item.getAttribute('selectable') !== null) {
        
        close(panel);

        evt = new CustomEvent('select', {
          detail: { item: item.textContent, target: evt.target },
          bubbles: true,
          cancelable: true
        });

        lastTrigger.textContent = item.textContent;

        panel.dispatchEvent(evt);
      }
    }
    moved = false;
  });

  function onHide() {

    var page = document.querySelector('.app-page.app-active');
    if(page.querySelector('div.backdrop-panel') !== null) {

      var backdrop = panels[panels.length - 1].backdrop;
      backdrop.classList.remove('fadeout');

      page.removeChild(backdrop);

      var previousPanel = panels[panels.length - 1].panel;
      previousPanel.style.visibility = 'hidden';

      panels.pop();

      this.removeEventListener(transitionEnd, onHide, false);
    }
  }

  /**
   * Public API
  */

  var api = {};

  function open (el) {
    var panel = (typeof el === 'string' ? document.querySelector(el) : el);
    if(panel === null) {
      throw new Error('The panel with ID ' + el + ' does not exist');
    }

    panel.style.visibility = 'visible';


    if(!panel.classList.contains('active')) {
      panel.classList.toggle('active');

      var backdrop = createBackdrop();

      panels.push( {panel: panel, backdrop: backdrop} );

      document.querySelector('.app-page.app-active').appendChild(backdrop);
    }
  }
  api.open = open;

  function close (el) {
    var panel = (typeof el === 'string' ? document.querySelector(el) : el);
    if(panel === null) {
      throw new Error('The panel with ID ' + el + ' does not exist');
    }

    if(panel.classList.contains('active')) {
      panel.classList.toggle('active');

      var backdrop = panels[panels.length - 1].backdrop;

      backdrop.classList.add('fadeout');

      backdrop.addEventListener(transitionEnd, onHide, false);
    }
  }
  api.close = close;

  function toggle(el) {
    var panel = (typeof el === 'string' ? document.querySelector(el) : el);
    if(panel === null) {
      throw new Error('The panel with ID ' + el + ' does not exist');
    }
    panel.classList.contains('active') ? close(panel) : open(panel);
  }
  api.toggle = toggle;

  // Expose the Router either via AMD, CommonJS or the global object
  if (typeof define === 'function' && define.amd) {
    define(function () {
        return api;
    });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else {
    if(window.Phonon === undefined) {
        window.Phonon = {};
    }
    window.Phonon.Panel = api;
  }

}(window, document));