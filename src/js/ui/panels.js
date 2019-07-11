/* ========================================================================
* Phonon: panels.js v0.1.3
* http://phonon.quarkdev.com
* ========================================================================
* Licensed under MIT (http://phonon.quarkdev.com)
* ======================================================================== */
(function (window, document, phonon, undefined) {
  const _activeObjects = [];

  const createBackdrop = function (id) {
    const backdrop = document.createElement('div');
    backdrop.classList.add('backdrop-panel');
    backdrop.setAttribute('data-backdrop-for', id);
    return backdrop;
  };

  const findTrigger = function (target) {
    const triggers = document.querySelectorAll('[data-panel-id], [data-panel-close]'); let
      i;
    for (; target && target !== document; target = target.parentNode) {
      for (i = triggers.length; i--;) {
        if (triggers[i] === target) {
          return target;
        }
      }
    }
  };

  const getPanel = function (event) {
    const panelToggle = findTrigger(event.target);
    if (panelToggle) {
      const panelId = panelToggle.getAttribute('data-panel-id');
      if (panelId) {
        return document.querySelector(`#${panelId}`);
      }
      return findDOMPanel(event.target);
    }
  };

  const findObject = function (panelId) {
    const { length } = _activeObjects;
    let i = 0;
    for (; i < length; i++) {
      if (_activeObjects[i].panel.getAttribute('id') === panelId) {
        const found = _activeObjects[i];
        found.index = i;
        return found;
      }
    }
    return null;
  };

  var findDOMPanel = function (target) {
    const panels = document.querySelectorAll('.panel, .panel-full'); let
      i;

    for (; target && target !== document; target = target.parentNode) {
      for (i = panels.length; i--;) {
        if (panels[i] === target && target.classList.contains('active')) {
          return target;
        }
      }
    }
  };

  /**
	* Used to find an opened dialog or an opened popover
	* in front of a panel
	* @todo clean this
	*/
  const onDialog = function (target) {
    for (; target && target !== document; target = target.parentNode) {
      if (target.classList.contains('dialog') || target.classList.contains('backdrop-dialog')
			|| target.classList.contains('popover') || target.classList.contains('backdrop-popover')) {
        return true;
      }
    }
    return false;
  };

  document.on(phonon.event.start, (evt) => {
    evt = evt.originalEvent || evt;

    // don't close panels if notifications are pressed
    if (evt.target.classList.contains('notification') || evt.parentNode && evt.target.parentNode.classList.contains('notification')) return;
    // don't close panels if a dialog is opened
    if (onDialog(evt.target)) return;

    if (_activeObjects.length > 0) {
      const previousPanel = _activeObjects[_activeObjects.length - 1].panel; const
        p = findDOMPanel(evt.target);

      if (!p) {
        close(previousPanel);
      }

      if (p && p !== previousPanel) {
        // Case where there are two active panels
        if (p.id !== previousPanel.id) {
          close(previousPanel);
        }
      }
    }
  });

  document.on(phonon.event.tap, (evt) => {
    // don't close panels if notifications are pressed
    if (evt.target.classList.contains('notification') || evt.parentNode && evt.target.parentNode.classList.contains('notification')) return;
    // don't close panels if a dialog is opened
    if (onDialog(evt.target)) return;

    const trigger = findTrigger(evt.target); let
      panel = null;

    if (trigger) {
      panel = getPanel(evt);

      if (panel) {
        panel.classList.contains('active') ? close(panel) : open(panel);
      }
    }

    panel = findDOMPanel(evt.target);

    if (!panel && !trigger) {
      if (_activeObjects.length > 0) {
        const previousPanel = _activeObjects[_activeObjects.length - 1].panel; const
          p = findDOMPanel(evt.target);
        close(previousPanel);
      }
    }
  });

  function onHide() {
    document.body.removeChild(this);

    const object = findObject(this.getAttribute('data-backdrop-for'));

    _activeObjects.splice(object.index, 1);

    this.off(phonon.event.transitionEnd, onHide, false);
  }

  /**
	* Public API
	*/

  function open(panel) {
    if (!panel.classList.contains('active')) {
      panel.style.display = 'block';

      window.setTimeout(() => {
        panel.classList.add('active');
      }, 10);

      const backdrop = createBackdrop(panel.getAttribute('id'));

      document.body.appendChild(backdrop);

      _activeObjects.push({ panel, backdrop });
    }
  }

  function close(panel) {
    if (panel.classList.contains('active')) {
      panel.classList.remove('active');
      panel.classList.add('panel-closing');

      var closePanel = function () {
        panel.classList.remove('panel-closing');
        panel.style.display = 'none';
        panel.off(phonon.event.transitionEnd, closePanel);
      };

      panel.on(phonon.event.transitionEnd, closePanel);

      const pObject = findObject(panel.getAttribute('id'));

      if (pObject) {
        pObject.backdrop.classList.add('fadeout');
        pObject.backdrop.on(phonon.event.transitionEnd, onHide, false);
      }
    }
  }

  function closeActive() {
    const closable = (_activeObjects.length > 0);
    if (closable) {
      close(_activeObjects[_activeObjects.length - 1].panel);
    }
    return closable;
  }

  phonon.panel = function (el) {
    const panel = (typeof el === 'string' ? document.querySelector(el) : el);
    if (panel === null) {
      throw new Error(`The panel with ID ${el} does not exist`);
    }

    return {
      open() {
        open(panel);
      },
      close() {
        close(panel);
      },
    };
  };

  phonon.panelUtil = {
    closeActive,
  };

  window.phonon = phonon;

  if (typeof exports === 'object') {
    module.exports = phonon.panel;
  } else if (typeof define === 'function' && define.amd) {
    define(() => phonon.panel);
  }
}(window, document, window.phonon || {}));
