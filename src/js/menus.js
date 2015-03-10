/* ========================================================================
* Phonon: menus.js v0.0.5
* http://phonon.quarkdev.com
* ========================================================================
* Licensed under MIT (http://phonon.quarkdev.com)
* ======================================================================== */
;(function (window, document, Phonon, undefined) {

  'use strict';

  var touchMove = false;
  var previousMenu = false;
  var isOpened = false;
  var backdrop = document.createElement('div');
  backdrop.classList.add('backdrop-menu');

  var findTrigger = function (target) {

  var res = { target : null, id: null, direction : null };

  for (; target && target !== document; target = target.parentNode) {
    if(target.getAttribute('data-menu-id') !== null) {

      res.target = target;
      res.id = target.getAttribute('data-menu-id');
      res.direction = 'left';

      if(target.classList.contains('pull-right')) {
        res.direction = 'right';
      }
      if(target.classList.contains('title')) {
        res.direction = 'title';
      }
      break;
    }
  }
  return res;
  };

  var findPanel = function (target) {
    var i;
    var panels = document.querySelectorAll('.menu');

    for (; target && target !== document; target = target.parentNode) {
      for (i = panels.length; i--;) {
        if (panels[i] === target && target.classList.contains('active')) {
          return target;
        }
      }
    }
  };

  window.addEventListener('touchstart', function (e) {
    e = e.originalEvent || e;

    var p = findPanel(e.target);

    if (!p && isOpened) {
      close(previousMenu);
    }
    touchMove = false;
  });

  window.addEventListener('touchmove', function (e) {
    e = e.originalEvent || e;
    touchMove = true;
  });

  window.addEventListener('touchend', function (evt) {

    var target = evt.target ? evt.target : evt.toElement, trigger = findTrigger(evt.target);

    if (trigger.target) {
      
      var menu = document.querySelector('#'+trigger.id);

      if(menu) {

        if(menu.classList.contains('active') && !touchMove) {
          close(menu);
        } else {
          open(menu, trigger.direction);
        }
      }
    }
    if (previousMenu === target.parentNode.parentNode && !touchMove) {
      close(previousMenu);
    }
  });

  function onHide() {

    var page = document.querySelector('.app-page.app-active');
    if(page.querySelector('div.backdrop-menu') !== null) {
      page.removeChild(backdrop);
    }
    previousMenu.style.visibility = 'hidden';
  }

  /**
   * Public API
  */

  function open (el, direction) {
    var menu = (typeof el === 'string' ? document.querySelector(el) : el);
    if(menu === null) {
      throw new Error('The menu with ID ' + el + ' does not exist');
    }
    if(direction === undefined || (direction !== 'left' && direction !== 'title' && direction !== 'right')) {
      direction = 'left';
    }

    isOpened = true;

    menu.style.visibility = 'visible';

    previousMenu = menu;
    if(!menu.classList.contains('active')) {

      var page = document.querySelector('.app-page.app-active');

      if(direction === 'title') {
        var hb = page.querySelector('.header-bar');
        menu.style.top = (hb ? hb.clientHeight : 48)+'px';
        menu.style.left = ((document.body.clientWidth/2) - (menu.clientWidth/2)) + 'px';
        menu.setAttribute('class', 'menu on-title');
      } else {
        menu.style.top = '12px';
        if(direction === 'left') {
          menu.style.left = '16px';
        } else {
          menu.style.left = 'auto';
          menu.style.right = '16px';
        }
      }
      
      menu.classList.toggle('active');

      page.appendChild(backdrop);
    }
  }

  function close (el) {
    var menu = (typeof el === 'string' ? document.querySelector(el) : el);
    if(menu === null) {
      throw new Error('The menu with ID ' + el + ' does not exist');
    }

    isOpened = false;
    previousMenu = menu;

    if(menu.classList.contains('active')) {
      menu.classList.toggle('active');

      window.setTimeout(function() {
        onHide();
      }, 250);
    }
  }

  function toggle(el) {
    var menu = (typeof el === 'string' ? document.querySelector(el) : el);
    if(menu === null) {
      throw new Error('The menu with ID ' + el + ' does not exist');
    }

    if(menu.classList.contains('active')) {
      close(menu);
    } else {
      open(menu);
    }
  }

  Phonon.Menu = function (el) {
    var menu = (typeof el === 'string' ? document.querySelector(el) : el);
    if(menu === null) {
      throw new Error('The menu with ID ' + el + ' does not exist');
    }

    return {
      open: function () {
        open(menu);
        return this;
      },
      close: function () {
        close(menu);
        return this;
      },
      toggle: function () {
        toggle(menu);
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
              return Phonon.Menu;
          }
      });
  } else if (typeof module === 'object' && module.exports) {
      if(Phonon.returnGlobalNamespace === true) {
          module.exports = Phonon;
      } else {
          module.exports = Phonon.Menu;
      }
  }

}(window, document, window.Phonon || {}));