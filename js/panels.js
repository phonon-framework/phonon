/* ========================================================================
* Phonon: panels.js v0.0.1
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
  
  var previousPanel = false;
  var isOpened = false;
  var backdrop = document.createElement('div');
  backdrop.classList.add('backdrop-panel');

  var findTrigger = function (target) {
    var i;
    var triggers = document.querySelectorAll('a[data-panel-id], a[data-panel-close], button[data-panel-id], button[data-panel-close]');
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
    var i;
    var panels = document.querySelectorAll('.panel, .panel-expanded');

    for (; target && target !== document; target = target.parentNode) {
      for (i = panels.length; i--;) {
        if (panels[i] === target && target.classList.contains('active')) {
          return target;
        }
      }
    }
  };

  var findPage = function (target) {
    for (; target && target !== document; target = target.parentNode) {
      if(target.classList.contains('app-page')) {
        return target;
      }
    }
  };

  window.addEventListener('touchstart', function (e) {
    e = e.originalEvent || e;

    var p = findPanel(e.target);

    if (!p && isOpened) {
      close(previousPanel);
    }
  });

  window.addEventListener('touchend', function (event) {

    var trigger = findTrigger(event.target);

    if (trigger) {
      var panel = getPanel(event);

      if(panel) {
        if(panel.classList.contains('active')) {
          close(panel);
        } else {
          open(panel);
        }
      }
    }
  });

  function onHide() {

    var page = findPage(previousPanel);
    if(page.querySelector('div.backdrop-panel') !== null) {
      backdrop.classList.remove('fadeout');
      page.removeChild(backdrop);
    }

    previousPanel.style.visibility = 'hidden';
    this.removeEventListener(transitionEnd, onHide, false);
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

    isOpened = true;

    panel.style.visibility = 'visible';

    previousPanel = panel;
    if(!panel.classList.contains('active')) {
      panel.classList.toggle('active');
      var page = findPage(panel);
      page.appendChild(backdrop);
    }
  }
  api.open = open;

  function close (el) {
    var panel = (typeof el === 'string' ? document.querySelector(el) : el);
    if(panel === null) {
      throw new Error('The panel with ID ' + el + ' does not exist');
    }

    isOpened = false;
    previousPanel = panel;

    if(panel.classList.contains('active')) {
      panel.classList.toggle('active');

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