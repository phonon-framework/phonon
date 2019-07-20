/*
 * Snap.js
 *
 * Copyright 2013, Jacob Kelley - http://jakiestfu.com/
 * Released under the MIT Licence
 * http://opensource.org/licenses/MIT
 *
 * Github:  http://github.com/jakiestfu/Snap.js/
 * Version: 1.9.3
 */
/* jslint browser: true */
/* global define, module */
(function (win, doc) {
  let backdrop = null;

  var Snap = Snap || function (userOpts) {
    const settings = {
      element: null,
      dragger: null,
      disable: 'none',
      addBodyClasses: true,
      hyperextensible: true,
      resistance: 0.5,
      flickThreshold: 50,
      transitionSpeed: 0.3,
      easing: 'ease',
      maxPosition: 266,
      minPosition: -266,
      tapToClose: true,
      touchToDrag: true,
      slideIntent: 40, // degrees
      minDragDistance: 5,
    };
    const cache = {
      simpleStates: {
        opening: null,
        towards: null,
        hyperExtending: null,
        halfway: null,
        flick: null,
        translation: {
          absolute: 0,
          relative: 0,
          sinceDirectionChange: 0,
          percentage: 0,
        },
      },
    };
    const eventList = {};
    var utils = {
      hasTouch: ('ontouchstart' in doc.documentElement || win.navigator.msPointerEnabled),
      eventType(action) {
        const eventTypes = {
          down: (utils.hasTouch ? 'touchstart' : 'mousedown'),
          move: (utils.hasTouch ? 'touchmove' : 'mousemove'),
          up: (utils.hasTouch ? 'touchend' : 'mouseup'),
          out: (utils.hasTouch ? 'touchcancel' : 'mouseout'),
        };
        return eventTypes[action];
      },
      page(t, e) {
        return (utils.hasTouch && e.touches.length && e.touches[0]) ? e.touches[0][`page${t}`] : e[`page${t}`];
      },
      klass: {
        has(el, name) {
          return (el.className).indexOf(name) !== -1;
        },
        add(el, name) {
          if (!utils.klass.has(el, name) && settings.addBodyClasses) {
            el.className += ` ${name}`;
          }
        },
        remove(el, name) {
          if (settings.addBodyClasses) {
            el.className = (el.className).replace(name, '').replace(/^\s+|\s+$/g, '');
          }
        },
      },
      dispatchEvent(type) {
        if (typeof eventList[type] === 'function') {
          return eventList[type].call();
        }
      },
      // @phonon
      createBackdrop() {
        if (!backdrop) {
          // Create backdrop element
          const bd = document.createElement('div');
          bd.classList.add('backdrop-panel');
          bd.classList.add('backdrop-side-panel');
          backdrop = bd;

          document.body.appendChild(backdrop);
        }
      },
      removeBackdrop() {
        if (!backdrop) {
          return;
        }

        var closed = function () {
          // can be removed just before this handler
          if (!backdrop) {
            return;
          }

          backdrop.classList.remove('fadeout');

          document.body.removeChild(backdrop);

          backdrop.off(phonon.event.transitionEnd, closed);
          backdrop = null;
        };

        backdrop.classList.add('fadeout');
        backdrop.on(phonon.event.transitionEnd, closed);
      },
      vendor() {
        const tmp = doc.createElement('div');
        const prefixes = 'webkit Moz O ms'.split(' ');
        let i;
        for (i in prefixes) {
          if (typeof tmp.style[`${prefixes[i]}Transition`] !== 'undefined') {
            return prefixes[i];
          }
        }
      },
      transitionCallback() {
        return (cache.vendor === 'Moz' || cache.vendor === 'ms') ? 'transitionend' : `${cache.vendor}TransitionEnd`;
      },
      canTransform() {
        return typeof settings.element.style[`${cache.vendor}Transform`] !== 'undefined';
      },
      deepExtend(destination, source) {
        let property;
        for (property in source) {
          if (source[property] && source[property].constructor && source[property].constructor === Object) {
            destination[property] = destination[property] || {};
            utils.deepExtend(destination[property], source[property]);
          } else {
            destination[property] = source[property];
          }
        }
        return destination;
      },
      angleOfDrag(x, y) {
        let degrees; let
          theta;
        // Calc Theta
        theta = Math.atan2(-(cache.startDragY - y), (cache.startDragX - x));
        if (theta < 0) {
          theta += 2 * Math.PI;
        }
        // Calc Degrees
        degrees = Math.floor(theta * (180 / Math.PI) - 180);
        if (degrees < 0 && degrees > -180) {
          degrees = 360 - Math.abs(degrees);
        }
        return Math.abs(degrees);
      },
      events: {
        addEvent: function addEvent(element, eventName, func) {
          if (element.addEventListener) {
            return element.addEventListener(eventName, func, false);
          } if (element.attachEvent) {
            return element.attachEvent(`on${eventName}`, func);
          }
        },
        removeEvent: function addEvent(element, eventName, func) {
          if (element.addEventListener) {
            return element.removeEventListener(eventName, func, false);
          } if (element.attachEvent) {
            return element.detachEvent(`on${eventName}`, func);
          }
        },
        prevent(e) {
          if (e.preventDefault) {
            e.preventDefault();
          } else {
            e.returnValue = false;
          }
        },
      },
      parentUntil(el, attr) {
        const isStr = typeof attr === 'string';
        while (el.parentNode) {
          if (isStr && el.getAttribute && el.getAttribute(attr)) {
            return el;
          } if (!isStr && el === attr) {
            return el;
          }
          el = el.parentNode;
        }
        return null;
      },
    };
    var action = {
      translate: {
        get: {
          matrix(index) {
            if (!utils.canTransform()) {
              return parseInt(settings.element.style.left, 10);
            }
            let matrix = win.getComputedStyle(settings.element)[`${cache.vendor}Transform`].match(/\((.*)\)/);
            const ieOffset = 8;
            if (matrix) {
              matrix = matrix[1].split(',');
              if (matrix.length === 16) {
                index += ieOffset;
              }
              return parseInt(matrix[index], 10);
            }
            return 0;
          },
        },
        easeCallback() {
          settings.element.style[`${cache.vendor}Transition`] = '';
          cache.translation = action.translate.get.matrix(4);
          cache.easing = false;
          clearInterval(cache.animatingInterval);

          if (cache.easingTo === 0) {
            utils.klass.remove(doc.body, 'snapjs-right');
            utils.klass.remove(doc.body, 'snapjs-left');
          }

          utils.dispatchEvent('animated');
          utils.events.removeEvent(settings.element, utils.transitionCallback(), action.translate.easeCallback);
        },
        easeTo(n) {
          // @phonon
          if (n === 0) {
            utils.removeBackdrop();
          }

          if (!utils.canTransform()) {
            cache.translation = n;
            action.translate.x(n);
          } else {
            cache.easing = true;
            cache.easingTo = n;

            settings.element.style[`${cache.vendor}Transition`] = `all ${settings.transitionSpeed}s ${settings.easing}`;

            cache.animatingInterval = setInterval(() => {
              utils.dispatchEvent('animating');
            }, 1);

            utils.events.addEvent(settings.element, utils.transitionCallback(), action.translate.easeCallback);
            action.translate.x(n);
          }
          if (n === 0) {
						   settings.element.style[`${cache.vendor}Transform`] = '';
					   }
        },
        x(n) {
          if ((settings.disable === 'left' && n > 0)
						|| (settings.disable === 'right' && n < 0)
          ) { return; }

          if (!settings.hyperextensible) {
            if (n === settings.maxPosition || n > settings.maxPosition) {
              n = settings.maxPosition;
            } else if (n === settings.minPosition || n < settings.minPosition) {
              n = settings.minPosition;
            }
          }

          n = parseInt(n, 10);
          if (isNaN(n)) {
            n = 0;
          }

          if (utils.canTransform()) {
            const theTranslate = `translate3d(${n}px, 0,0)`;
            settings.element.style[`${cache.vendor}Transform`] = theTranslate;
          } else {
            settings.element.style.width = `${win.innerWidth || doc.documentElement.clientWidth}px`;

            settings.element.style.left = `${n}px`;
            settings.element.style.right = '';
          }
        },
      },
      drag: {
        listen() {
          cache.translation = 0;
          cache.easing = false;
          utils.events.addEvent(settings.element, utils.eventType('down'), action.drag.startDrag);
          utils.events.addEvent(settings.element, utils.eventType('move'), action.drag.dragging);
          utils.events.addEvent(settings.element, utils.eventType('up'), action.drag.endDrag);
        },
        stopListening() {
          utils.events.removeEvent(settings.element, utils.eventType('down'), action.drag.startDrag);
          utils.events.removeEvent(settings.element, utils.eventType('move'), action.drag.dragging);
          utils.events.removeEvent(settings.element, utils.eventType('up'), action.drag.endDrag);
        },
        startDrag(e) {
          // No drag on ignored elements
          const target = e.target ? e.target : e.srcElement;
          const ignoreParent = utils.parentUntil(target, 'data-snap-ignore');

          if (ignoreParent) {
            utils.dispatchEvent('ignore');
            return;
          }


          if (settings.dragger) {
            const dragParent = utils.parentUntil(target, settings.dragger);

            // Only use dragger if we're in a closed state
            if (!dragParent
							&& (cache.translation !== settings.minPosition
							&& cache.translation !== settings.maxPosition
							)) {
              return;
            }
          }

          utils.dispatchEvent('start');
          settings.element.style[`${cache.vendor}Transition`] = '';
          cache.isDragging = true;
          cache.hasIntent = null;
          cache.intentChecked = false;
          cache.startDragX = utils.page('X', e);
          cache.startDragY = utils.page('Y', e);
          cache.dragWatchers = {
            current: 0,
            last: 0,
            hold: 0,
            state: '',
          };
          cache.simpleStates = {
            opening: null,
            towards: null,
            hyperExtending: null,
            halfway: null,
            flick: null,
            translation: {
              absolute: 0,
              relative: 0,
              sinceDirectionChange: 0,
              percentage: 0,
            },
          };
        },
        dragging(e) {
          if (cache.isDragging && settings.touchToDrag) {
            const thePageX = utils.page('X', e);
            const thePageY = utils.page('Y', e);
            const translated = cache.translation;
            const absoluteTranslation = action.translate.get.matrix(4);
            const whileDragX = thePageX - cache.startDragX;
            const openingLeft = absoluteTranslation > 0;
            var translateTo = whileDragX;
            let diff;

            // Shown no intent already
            if ((cache.intentChecked && !cache.hasIntent)) {
              return;
            }

            if (settings.addBodyClasses) {
              if ((absoluteTranslation) > 0) {
                utils.klass.add(doc.body, 'snapjs-left');
                utils.klass.remove(doc.body, 'snapjs-right');
              } else if ((absoluteTranslation) < 0) {
                utils.klass.add(doc.body, 'snapjs-right');
                utils.klass.remove(doc.body, 'snapjs-left');
              }
            }

            if (cache.hasIntent === false || cache.hasIntent === null) {
              const deg = utils.angleOfDrag(thePageX, thePageY);
              const inRightRange = (deg >= 0 && deg <= settings.slideIntent) || (deg <= 360 && deg > (360 - settings.slideIntent));
              const inLeftRange = (deg >= 180 && deg <= (180 + settings.slideIntent)) || (deg <= 180 && deg >= (180 - settings.slideIntent));
              if (!inLeftRange && !inRightRange) {
                cache.hasIntent = false;
              } else {
                cache.hasIntent = true;
              }
              cache.intentChecked = true;
            }

            if (
              (settings.minDragDistance >= Math.abs(thePageX - cache.startDragX)) // Has user met minimum drag distance?
							|| (cache.hasIntent === false)
            ) {
              return;
            }

            utils.events.prevent(e);
            utils.dispatchEvent('drag');

            cache.dragWatchers.current = thePageX;
            // Determine which direction we are going
            if (cache.dragWatchers.last > thePageX) {
              if (cache.dragWatchers.state !== 'left') {
                cache.dragWatchers.state = 'left';
                cache.dragWatchers.hold = thePageX;
              }
              cache.dragWatchers.last = thePageX;
            } else if (cache.dragWatchers.last < thePageX) {
              if (cache.dragWatchers.state !== 'right') {
                cache.dragWatchers.state = 'right';
                cache.dragWatchers.hold = thePageX;
              }
              cache.dragWatchers.last = thePageX;
            }
            if (openingLeft) {
              // Pulling too far to the right
              if (settings.maxPosition < absoluteTranslation) {
                diff = (absoluteTranslation - settings.maxPosition) * settings.resistance;
                translateTo = whileDragX - diff;
              }
              cache.simpleStates = {
                opening: 'left',
                towards: cache.dragWatchers.state,
                hyperExtending: settings.maxPosition < absoluteTranslation,
                halfway: absoluteTranslation > (settings.maxPosition / 2),
                flick: Math.abs(cache.dragWatchers.current - cache.dragWatchers.hold) > settings.flickThreshold,
                translation: {
                  absolute: absoluteTranslation,
                  relative: whileDragX,
                  sinceDirectionChange: (cache.dragWatchers.current - cache.dragWatchers.hold),
                  percentage: (absoluteTranslation / settings.maxPosition) * 100,
                },
              };
            } else {
              // Pulling too far to the left
              if (settings.minPosition > absoluteTranslation) {
                diff = (absoluteTranslation - settings.minPosition) * settings.resistance;
                translateTo = whileDragX - diff;
              }
              cache.simpleStates = {
                opening: 'right',
                towards: cache.dragWatchers.state,
                hyperExtending: settings.minPosition > absoluteTranslation,
                halfway: absoluteTranslation < (settings.minPosition / 2),
                flick: Math.abs(cache.dragWatchers.current - cache.dragWatchers.hold) > settings.flickThreshold,
                translation: {
                  absolute: absoluteTranslation,
                  relative: whileDragX,
                  sinceDirectionChange: (cache.dragWatchers.current - cache.dragWatchers.hold),
                  percentage: (absoluteTranslation / settings.minPosition) * 100,
                },
              };
            }
            action.translate.x(translateTo + translated);
          }

          // @phonon
          if (translateTo > 5) {
            utils.createBackdrop();
          }
        },
        endDrag(e) {
          if (cache.isDragging) {
            utils.dispatchEvent('end');
            const translated = action.translate.get.matrix(4);

            // Tap Close
            if (cache.dragWatchers.current === 0 && translated !== 0 && settings.tapToClose) {
              utils.dispatchEvent('close');
              utils.events.prevent(e);
              action.translate.easeTo(0);
              cache.isDragging = false;
              cache.startDragX = 0;
              return;
            }

            // Revealing Left
            if (cache.simpleStates.opening === 'left') {
              // Halfway, Flicking, or Too Far Out
              if ((cache.simpleStates.halfway || cache.simpleStates.hyperExtending || cache.simpleStates.flick)) {
                if (cache.simpleStates.flick && cache.simpleStates.towards === 'left') { // Flicking Closed
                  action.translate.easeTo(0);
                } else if (
                  (cache.simpleStates.flick && cache.simpleStates.towards === 'right') // Flicking Open OR
									|| (cache.simpleStates.halfway || cache.simpleStates.hyperExtending) // At least halfway open OR hyperextending
                ) {
                  action.translate.easeTo(settings.maxPosition); // Open Left
                }
              } else {
                action.translate.easeTo(0); // Close Left
              }

              // Revealing Right
            } else if (cache.simpleStates.opening === 'right') {
              // Halfway, Flicking, or Too Far Out
              if ((cache.simpleStates.halfway || cache.simpleStates.hyperExtending || cache.simpleStates.flick)) {
                if (cache.simpleStates.flick && cache.simpleStates.towards === 'right') { // Flicking Closed
                  action.translate.easeTo(0);
                } else if (
                  (cache.simpleStates.flick && cache.simpleStates.towards === 'left') // Flicking Open OR
									|| (cache.simpleStates.halfway || cache.simpleStates.hyperExtending) // At least halfway open OR hyperextending
                ) {
                  action.translate.easeTo(settings.minPosition); // Open Right
                }
              } else {
                action.translate.easeTo(0); // Close Right
              }
            }

            cache.isDragging = false;
            cache.startDragX = utils.page('X', e);
          }
        },
      },
    };
    const init = function (opts) {
      if (opts.element) {
        utils.deepExtend(settings, opts);
        cache.vendor = utils.vendor();
        action.drag.listen();
      }
    };
    /*
		 * Public
		 */
    this.open = function (side) {
      // @phonon
      utils.createBackdrop();

      utils.dispatchEvent('open');
      utils.klass.remove(doc.body, 'snapjs-expand-left');
      utils.klass.remove(doc.body, 'snapjs-expand-right');

      if (side === 'left') {
        cache.simpleStates.opening = 'left';
        cache.simpleStates.towards = 'right';
        utils.klass.add(doc.body, 'snapjs-left');
        utils.klass.remove(doc.body, 'snapjs-right');
        action.translate.easeTo(settings.maxPosition);
      } else if (side === 'right') {
        cache.simpleStates.opening = 'right';
        cache.simpleStates.towards = 'left';
        utils.klass.remove(doc.body, 'snapjs-left');
        utils.klass.add(doc.body, 'snapjs-right');
        action.translate.easeTo(settings.minPosition);
      }
    };
    this.close = function () {
      utils.dispatchEvent('close');
      action.translate.easeTo(0);
    };
    this.expand = function (side) {
      let to = win.innerWidth || doc.documentElement.clientWidth;

      if (side === 'left') {
        utils.dispatchEvent('expandLeft');
        utils.klass.add(doc.body, 'snapjs-expand-left');
        utils.klass.remove(doc.body, 'snapjs-expand-right');
      } else {
        utils.dispatchEvent('expandRight');
        utils.klass.add(doc.body, 'snapjs-expand-right');
        utils.klass.remove(doc.body, 'snapjs-expand-left');
        to *= -1;
      }
      action.translate.easeTo(to);
    };

    this.on = function (evt, fn) {
      eventList[evt] = fn;
      return this;
    };
    this.off = function (evt) {
      if (eventList[evt]) {
        eventList[evt] = false;
      }
    };

    this.enable = function () {
      utils.dispatchEvent('enable');
      action.drag.listen();
    };
    this.disable = function () {
      utils.dispatchEvent('disable');
      action.drag.stopListening();
    };

    this.settings = function (opts) {
      utils.deepExtend(settings, opts);
    };

    this.state = function () {
      let state;
      const fromLeft = action.translate.get.matrix(4);
      if (fromLeft === settings.maxPosition) {
        state = 'left';
      } else if (fromLeft === settings.minPosition) {
        state = 'right';
      } else {
        state = 'closed';
      }
      return {
        state,
        info: cache.simpleStates,
      };
    };
    init(userOpts);
  };
  if ((typeof module !== 'undefined') && module.exports) {
    module.exports = Snap;
  }
  if ((typeof define === 'function') && define.amd) {
    define('snap', [], () => Snap);
  }

  if (win) {
    win.Snap = Snap;
  }
}).call(this, window, document);


/* ========================================================================
 * Phonon: side-panels.js v0.0.1
 * http://phonon.quarkdev.com
 * ========================================================================
 * Licensed under MIT (http://phonon.quarkdev.com)
 * ======================================================================== */
(function (window, phonon, Snap) {
  let isPhone = !matchMedia('only screen and (min-width: 641px)').matches;
  const sidePanels = [];
  let sidePanelActive = null;

  function findSidePanel(id) {
    let i = sidePanels.length - 1;
    for (; i >= 0; i--) {
      if (sidePanels[i].el.id === id) {
        return sidePanels[i];
      }
    }
    return null;
  }

  /**
	 * Render the sidebar of the current page
	*/
  function render(evt) {
    const currentPage = (typeof evt !== 'undefined' ? evt.detail.page : phonon.navigator().currentPage);
    const pageEl = document.querySelector(currentPage);
    const tabs = pageEl.querySelector('[data-tab-contents="true"]');

    let i = sidePanels.length - 1;

    for (; i >= 0; i--) {
      const sb = sidePanels[i];
      const exposeAside = sb.el.getAttribute('data-expose-aside');

      if (sb.pages.indexOf(currentPage) === -1) {
        sb.el.style.display = 'none';
        sb.el.style.visibility = 'hidden';
      } else {
        // Is this page drag disabled
        const dragDisabled = sb.nodrag.indexOf(currentPage) >= 0;

        // #90: update the snapper according to the page
        sb.snapper.settings({ element: pageEl });

        sb.el.style.display = 'block';
        sb.el.style.visibility = 'visible';

        // If tabs are present, disable drag, then setup
        if (tabs) {
          sidePanels[i].snapper.disable();
        }

        // Expose side bar
        if (exposeAside === 'left' || exposeAside === 'right') {
          if (!pageEl.classList.contains(`expose-aside-${exposeAside}`)) {
            pageEl.classList.add(`expose-aside-${exposeAside}`);
          }
        }

        // On tablet, the sidebar is draggable only if it is not exposed on a side
        if (!isPhone) {
          if (!tabs && exposeAside !== 'left' && exposeAside !== 'right') {
            sb.snapper.settings({ touchToDrag: !dragDisabled });
            sb.snapper.enable();
          } else {
            sb.snapper.settings({ touchToDrag: false });
            sb.snapper.disable();
          }
        }

        // On phone, the sidebar is draggable only if tabs are not present
        if (!tabs && isPhone) {
          sb.snapper.settings({ touchToDrag: !dragDisabled });
          sb.snapper.enable();
        }
      }
    }
  }

  /**
	 * When the window is resized, update the width of sidebars
	*/
  function resize() {
    const oldValue = isPhone;
    isPhone = !matchMedia('only screen and (min-width: 641px)').matches;

    if (oldValue !== isPhone) {
      // Update the min/max position for drag
      window.setTimeout(() => {
        let i = sidePanels.length - 1;
        for (; i >= 0; i--) {
          const sb = sidePanels[i];
          sb.snapper.settings({
            maxPosition: sb.el.clientWidth,
            minPosition: -(sb.el.clientWidth),
          });
        }
      }, 500);

      // finaly update settings
      render();
    }
  }

  phonon.onReady(() => {
    const spEls = document.querySelectorAll('.side-panel');
    let i = spEls.length - 1;

    for (; i >= 0; i--) {
      const el = spEls[i];
      const disable = el.getAttribute('data-disable');
      const pages = el.getAttribute('data-page');
      const nodrags = el.getAttribute('data-nodrag');

      const _pages = [];

      const page = pages.split(',');
      var j = 0;
      var l = page.length;

      for (; j < l; j++) {
        var _page = page[j].trim();
        if (j == 0) {
          var pageEl = document.querySelector(_page);
          if (!pageEl) {
            console.error(`SidePanel issue: The page: ${_page} does not exist. Please see data-page attribute.`);
          }
        }
        _pages.push(_page);
      }

      // Determine the page to disable dragging
      const _noDragPages = [];
      let noDragPage = [];
      if (nodrags) {
        noDragPage = nodrags.split(',');
      }

      var j = 0;
      var l = noDragPage.length;

      for (; j < l; j++) {
        var _page = noDragPage[j].trim();
        if (j == 0) {
          var pageEl = document.querySelector(_page);
          if (!pageEl) {
            console.error(`SidePanel issue: The page: ${_page} does not exist. Please see data-page attribute.`);
          } else if (_pages.indexOf(_page) === -1) { // If the page is not panelled
            // Is the panel active for the page
            console.error(`SidePanel issue: The page: ${_page} is not panel enabled. Please see data-page attribute.`);
          }
        }
        _noDragPages.push(_page);
      }

      // Options
      const options = {
        element: pageEl,
        disable: (disable === null ? 'none' : disable),
        hyperextensible: false,
        touchToDrag: false,
        maxPosition: el.clientWidth,
        minPosition: -(el.clientWidth),
      };

      const snapper = new Snap(options);
      sidePanels.push({
        snapper, el, pages: _pages, nodrag: _noDragPages, direction: (el.classList.contains('side-panel-left') ? 'left' : 'right'),
      });
    }
  });

  function open(sb) {
    sidePanelActive = sb;
    sb.snapper.open(sb.direction);
    document.on(phonon.event.end, onBackdrop);
  }

  function close(sb) {
    sb.snapper.close();
    sidePanelActive = null;
    document.off(phonon.event.end, onBackdrop);
  }

  function isShown(sb) {
    const { state } = sb.snapper.state();
    return state !== 'closed';
  }

  function onSidebar(target) {
    let isSidebar = false;
    for (; target && target !== document; target = target.parentNode) {
      if (target.classList.contains('side-panel')) {
        isSidebar = true;
        break;
      }
    }
    return isSidebar;
  }

  document.on(phonon.event.tap, (evt) => {
    const { target } = evt;
    const sidebarId = target.getAttribute('data-side-panel-id');
    const sidebarClose = target.getAttribute('data-side-panel-close');

    if (sidebarClose === 'true') {
      if (sidePanelActive) {
        close(sidePanelActive);
      } else if (sidebarId !== null) {
        var sb = findSidePanel(sidebarId);
        if (sb) {
          close(sb);
        }
      }
      return;
    }

    if (sidebarId !== null) {
      var sb = findSidePanel(sidebarId);

      if (sb) {
        const data = sb.snapper.state();

        // /!\ if not exposed
        const exposeAside = sb.el.getAttribute('data-expose-aside');

        // Toggle
        if (data.state === 'closed') {
          if (exposeAside !== 'left' && exposeAside !== 'right' || isPhone) open(sb);
        } else if (exposeAside !== 'left' && exposeAside !== 'right' || isPhone) close(sb);
      }
    }
  });

  var onBackdrop = function (evt) {
    let { target } = evt;
    let onSidebar = false;

    if (sidePanelActive === null) return;

    for (; target && target !== document; target = target.parentNode) {
      if (target.classList.contains('side-panel')) {
        onSidebar = true;
        break;
      }
    }

    if (sidePanelActive && !onSidebar) {
      close(sidePanelActive);
      sidePanelActive = null;
    }
  };

  function closeActive() {
    const { currentPage } = phonon.navigator();
    let i = sidePanels.length - 1;

    for (; i >= 0; i--) {
      const sb = sidePanels[i];
      const exposeAside = sb.el.getAttribute('data-expose-aside');
      if (sb.pages.indexOf(currentPage) !== -1) {
        const data = sb.snapper.state();

        if (data.state !== 'closed') {
          if (isPhone) {
            close(sb);
            return true;
          }
          if (!isPhone && exposeAside !== 'left' && exposeAside !== 'right') {
            close(sb);
            return true;
          }
        }

        return false;
      }
    }
    return false;
  }

  phonon.sidePanel = function (sidePanelId) {
    sidePanelId = sidePanelId.replace('#', '');
    const sidePanel = findSidePanel(sidePanelId);
    if (sidePanel === null) {
      throw new Error(`The side panel with id [${sidePanelId}] does not exists`);
    }

    return {
      open() {
        return open(sidePanel);
      },
      close() {
        return close(sidePanel);
      },
      isShown() {
        return isShown(sidePanel);
      },
    };
  };

  phonon.sidePanelUtil = {
    closeActive,
  };

  window.on('resize', resize);
  document.on('pageopened', render);
}(typeof window !== 'undefined' ? window : this, window.phonon || {}, window.Snap || undefined));
