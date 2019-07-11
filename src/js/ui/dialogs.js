/* ========================================================================
 * Phonon: dialogs.js v0.0.6
 * http://phonon.quarkdev.com
 * ========================================================================
 * Licensed under MIT (http://phonon.quarkdev.com)
 * ======================================================================== */
(function (window, phonon) {
  let lastTrigger = false;
  const dialogs = [];
  let fireEvent = null;

  function addCancelCallback(dialog, cancelCallback) {
    for (let i = 0; i < dialogs.length; i++) {
      if (dialogs[i].dialog === dialog) {
        dialogs[i].cancelCallback = cancelCallback;
        break;
      }
    }
  }

  const createBackdrop = function (id) {
    const backdrop = document.createElement('div');
    backdrop.setAttribute('data-id', id);
    backdrop.classList.add('backdrop-dialog');
    return backdrop;
  };

  const findTrigger = function (target) {
    const triggers = document.querySelectorAll('[data-dialog-id], [data-dialog-close]'); let
      i;
    for (; target && target !== document; target = target.parentNode) {
      for (i = triggers.length; i--;) {
        if (triggers[i] === target) {
          return target;
        }
      }
    }
  };

  const getDialog = function (event) {
    const dialogToggle = findTrigger(event.target);
    if (dialogToggle) {
      const dialogId = dialogToggle.getAttribute('data-dialog-id');
      if (dialogId) {
        return document.querySelector(`#${dialogId}`);
      }
      return findDialog(event.target);
    }
  };

  var findDialog = function (target) {
    const dialogs = document.querySelectorAll('.dialog'); let
      i;

    for (; target && target !== document; target = target.parentNode) {
      for (i = dialogs.length; i--;) {
        if (dialogs[i] === target && target.classList.contains('active')) {
          return target;
        }
      }
    }
  };

  const findDialogObject = function (id) {
    let i = dialogs.length - 1;
    for (; i >= 0; i--) {
      if (dialogs[i].dialog.id === id) {
        const d = dialogs[i];
        d.index = i;
        return d;
      }
    }
    return false;
  };

  let dialogId = 0;

  const buildDialog = function (type, text, title, cancelable, textOk, textCancel) {
    text = (typeof text === 'string' ? `<p>${text}</p>` : '');
    const noTitle = typeof title;
    title = (noTitle === 'string' ? title : type);
    cancelable = (typeof cancelable === 'boolean' ? cancelable : true);
    textOk = (typeof textOk === 'string' ? textOk : 'Ok');
    textCancel = (typeof textCancel === 'string' ? textCancel : 'Cancel');

    const id = `auto-gen-${type}-${dialogId++}`;

    const div = document.createElement('div');
    div.setAttribute('class', 'dialog');
    div.setAttribute('data-cancelable', cancelable);
    div.setAttribute('data-auto', 'true');
    div.id = id;

    const nodeTitle = (noTitle === undefined ? '' : `<h3>${title}</h3>`);
    let btnCancel = `<li><a class="btn btn-flat btn-cancel" data-dialog-close="true">${textCancel}</a></li>`;
    let input = '';
    let indicator = '';

    if (type === 'alert') {
      btnCancel = '';
    } else if (type === 'prompt') {
      input = '<input type="text" placeholder="">';
    } else if (type === 'passPrompt') {
      input = '<input type="password" placeholder="Password">';
    } else if (type === 'indicator') {
      text = '';
      indicator = '<div class="circle-progress active padded-bottom"><div class="spinner"></div></div>';
    }

    const actions = (type === 'indicator' ? '' : `<ul class="buttons">${
      btnCancel
    }<li><a class="btn btn-flat primary btn-confirm" data-dialog-close="true">${textOk}</a></li>`
		+ '</ul>');

    const alert = `${'<div class="content">'
			+ '<div class="padded-full">'}${
      nodeTitle
    }${text
    }${input
    }${indicator
    }</div>`
		+ `</div>${actions}`;

    div.innerHTML = alert;

    document.body.appendChild(div);

    return div;
  };


  document.on(phonon.event.start, (evt) => {
    if (dialogs.length > 0) {
      const previous = dialogs[dialogs.length - 1]; const
        p = findDialog(evt.target);

      if (!p) {
        if (previous.dialog.getAttribute('data-cancelable') !== 'false') {
          // close the previous active dialog
          close(previous.dialog);

          // call the cancel callback
          if (typeof previous.cancelCallback === 'function') previous.cancelCallback();
        }
      }

      if (p && p !== previous.dialog) {
        // Case where there are two active dialogs
        if (p.id !== previous.dialog.id) {
          close(previous.dialog);
        }
      }
    }
  });

  document.on('tap', (evt) => {
    const trigger = findTrigger(evt.target); let
      dialog = null;

    if (trigger) {
      dialog = getDialog(evt);

      lastTrigger = trigger;

      if (dialog) {
        if (dialog.classList.contains('active')) {
          close(dialog);
        } else {
          open(dialog);
        }
      }
    }
  });

  document.on('keypress', (evt) => {
    if (dialogs.length > 0) {
      if (evt.which == 13 || evt.keyCode == 13) {
        const previous = dialogs[dialogs.length - 1];
        const btnConfirm = previous.dialog.querySelector('.btn-confirm');
        if (btnConfirm && typeof btnConfirm.fireConfirm !== 'undefined') {
          btnConfirm.fireConfirm();
        }
        close(previous.dialog);

        return false;
      }
    }

    return true;
  });

  function onHide() {
    const obj = findDialogObject(this.getAttribute('data-id'));
    const { backdrop } = obj;

    backdrop.classList.remove('fadeout');
    document.body.removeChild(backdrop);

    const { dialog } = obj;
    dialog.style.visibility = 'hidden';
    dialog.style.display = 'none';

    dialog.classList.remove('close');

    // remove autogenerated dialogs, see: #199
    if (dialog.getAttribute('data-auto')) {
      document.body.removeChild(dialog);
    }

    dialogs.splice(obj.index, 1);

    this.off(phonon.event.transitionEnd, onHide, false);
  }

  function center(target) {
    const computedStyle = getComputedStyle(target);
    let { width } = computedStyle;
    let { height } = computedStyle;

    width = width.slice(0, width.length - 2);
    height = height.slice(0, height.length - 2);

    const top = (window.innerHeight / 2) - (height / 2);
    target.style.top = `${top}px`;
  }

  function open(dialog) {
    dialog.style.visibility = 'visible';
    dialog.style.display = 'block';

    if (!dialog.classList.contains('active')) {
      center(dialog);

      dialog.classList.add('active');

      const preloader = dialog.querySelector('.circle-progress');

      if (preloader) phonon.preloader(preloader).show();

      const backdrop = createBackdrop(dialog.id);
      dialogs.push({ dialog, backdrop });

      document.body.appendChild(backdrop);
    }
  }

  function close(dialog) {
    off(dialog);

    if (dialog.classList.contains('active')) {
      dialog.classList.remove('active');
      dialog.classList.add('close');

      const preloader = dialog.querySelector('.circle-progress');
      if (preloader) phonon.preloader(preloader).hide();

      const obj = findDialogObject(dialog.id);

      const { backdrop } = obj;

      backdrop.on(phonon.event.transitionEnd, onHide, false);

      // fix issue #62
      window.setTimeout(() => {
        backdrop.classList.add('fadeout');
      }, 1);
    }
  }

  function on(dialog, eventName, callback) {
    fireEvent = function () {
      const input = dialog.querySelector('input');
      let inputValue; // undefined by default
      if (input) {
        inputValue = input.value;
      }

      callback(inputValue);
    };

    if (eventName === 'confirm') {
      const btnConfirm = dialog.querySelector('.btn-confirm');
      if (btnConfirm) {
        btnConfirm.fireConfirm = fireEvent;
        btnConfirm.on('tap', fireEvent);
      }
    } else {
      // keep cancel callback for backdrop taps
      addCancelCallback(dialog, callback);

      const btnCancel = dialog.querySelector('.btn-cancel');
      if (btnCancel) {
        btnCancel.on('tap', fireEvent);
      }
    }
  }

  /**
	 * Resets tap events when the dialog is closed
	 */
  function off(dialog) {
    if (typeof fireEvent !== 'function') return;

    const buttons = dialog.querySelectorAll('.btn-confirm, .btn-cancel');
    if (buttons) {
      let i = 0;
      const l = buttons.length;
      for (; i < l; i++) {
        buttons[i].off('tap', fireEvent);
      }
    }
  }

  function closeActive() {
    const closable = (dialogs.length > 0);
    if (closable) {
      const { dialog } = dialogs[dialogs.length - 1];
      if (dialog.getAttribute('data-cancelable') !== 'false') {
        close(dialog);
      }
    }
    return closable;
  }

  phonon.dialog = function (el) {
    if (typeof el === 'undefined') {
      return {
        alert(text, title, cancelable, textOk) {
          const dialog = buildDialog('alert', text, title, cancelable, textOk);
          open(dialog);
          return {
            on(eventName, callback) {
              on(dialog, eventName, callback);
            },
          };
        },
        confirm(text, title, cancelable, textOk, textCancel) {
          const dialog = buildDialog('confirm', text, title, cancelable, textOk, textCancel);
          open(dialog);
          return {
            on(eventName, callback) {
              on(dialog, eventName, callback);
            },
          };
        },
        prompt(text, title, cancelable, textOk, textCancel) {
          const dialog = buildDialog('prompt', text, title, cancelable, textOk, textCancel);
          open(dialog);
          return {
            on(eventName, callback) {
              on(dialog, eventName, callback);
            },
          };
        },
        passPrompt(text, title, cancelable, textOk, textCancel) {
          const dialog = buildDialog('passPrompt', text, title, cancelable, textOk, textCancel);
          open(dialog);
          return {
            on(eventName, callback) {
              on(dialog, eventName, callback);
            },
          };
        },
        indicator(title, cancelable) {
          const dialog = buildDialog('indicator', '', title, cancelable);
          open(dialog);
          return {
            on(eventName, callback) {
              on(dialog, eventName, callback);
              return this;
            },
            open() {
              open(dialog);
              return this;
            },
            close() {
              close(dialog);
              return this;
            },
          };
        },
      };
    }

    const dialog = (typeof el === 'string' ? document.querySelector(el) : el);
    if (dialog === null) {
      throw new Error(`The following element ${el} does not exists`);
    }

    return {
      open() {
        open(dialog);
        return this;
      },
      close() {
        close(dialog);
        return this;
      },
      on(eventName, callback) {
        on(dialog, eventName, callback);
        return this;
      },
      isActive() {
        return (!!dialog.classList.contains('active'));
      },
    };
  };

  phonon.dialogUtil = {
    closeActive,
  };

  window.phonon = phonon;

  if (typeof exports === 'object') {
    module.exports = phonon.dialog;
  } else if (typeof define === 'function' && define.amd) {
    define(() => phonon.dialog);
  }
}(typeof window !== 'undefined' ? window : this, window.phonon || {}));
