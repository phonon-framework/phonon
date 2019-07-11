/* ========================================================================
 * Phonon: floating-actions.js v0.0.5
 * http://phonon.quarkdev.com
 * ========================================================================
 * Licensed under MIT (http://phonon.quarkdev.com)
 * ======================================================================== */
(function (window, phonon) {
  let lastPosition = 0;
  let lastContentHeight = 0;

  const onContentScroll = function (evt) {
    evt = evt.originalEvent || evt;
    const pageContent = evt.target;

    lastContentHeight = pageContent.offsetHeight;

    const actions = document.querySelectorAll('.app-active .floating-action');
    if (!actions) return;

    const size = actions.length; let
      i = size - 1;
    for (; i >= 0; i--) {
      const action = actions[i];

      if (lastPosition > pageContent.scrollTop) {
        if (!action.classList.contains('active')) {
          action.classList.add('active');
        }
      } else if (action.classList.contains('active')) {
        action.classList.remove('active');
      }
    }

    lastPosition = pageContent.scrollTop;
  };

  const isElement = function (o) {
    return (typeof Node === 'object' ? o instanceof Node : o && typeof o === 'object' && typeof o.nodeType === 'number' && typeof o.nodeName === 'string');
  };

  /**
     * Event listener for a floating action
     * @param {DOMElement} page
    */
  function listenTo(page) {
    if (isElement(page)) {
      const c = page.querySelector('.content');
      if (c) {
        c.on('scroll', onContentScroll, false);
      } else {
        console.error('The given page does not contain any .content node');
      }
    } else {
      throw new Error(`The page must be a DOMElement not a ${typeof page}`);
    }
  }

  document.on('pagecreated', (evt) => {
    const flas = document.querySelectorAll(`${evt.detail.page} .floating-action`); let
      i = flas.length - 1;
    for (; i >= 0; i--) {
      const pages = document.querySelectorAll('.app-page');
      let j = pages.length - 1;
      for (; j >= 0; j--) {
        const page = pages[j];
        if (page.tagName.toLowerCase() === evt.detail.page) {
          listenTo(page);
          break;
        }
      }
    }
  });
}(typeof window !== 'undefined' ? window : this, window.phonon || {}));
