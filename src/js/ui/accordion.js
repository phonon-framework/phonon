/* ========================================================================
* Phonon: accordion.js v0.0.1
* http://phonon.quarkdev.com
* ========================================================================
* Licensed under MIT (http://phonon.quarkdev.com)
* ======================================================================== */
(function (window) {
  /**
	 * Show the accordion content
	 * @param {DOMNode} defaultTarget
	 * @param {DOMNode} accordionContent
	 */
  function show(defaultTarget, accordionContent) {
	    accordionContent.style.display = 'block';
    const height = accordionContent.offsetHeight;
    accordionContent.style.maxHeight = '0px';

    window.setTimeout(() => {
      var onShow = function () {
        accordionContent.off(phonon.event.transitionEnd, onShow);

        const icon = defaultTarget.parentNode.querySelector('.icon-expand-more');

        if (icon) {
          icon.classList.remove('icon-expand-more');
          icon.classList.add('icon-expand-less');
        }
      };

      accordionContent.on(phonon.event.transitionEnd, onShow);

      accordionContent.style.maxHeight = `${height}px`;
      accordionContent.classList.add('accordion-active');
    }, 100);
  }

  /**
	 * Hide the accordion content
	 * @param {DOMNode} defaultTarget
	 * @param {DOMNode} accordionContent
	 */
  function hide(defaultTarget, accordionContent) {
    var onHide = function () {
		    accordionContent.style.display = 'none';
      accordionContent.classList.remove('accordion-active');
      accordionContent.style.maxHeight = 'none';

      const icon = defaultTarget.parentNode.querySelector('.icon-expand-less');

      if (icon) {
        icon.classList.remove('icon-expand-less');
        icon.classList.add('icon-expand-more');
      }

      accordionContent.off(phonon.event.transitionEnd, onHide);
    };

    accordionContent.style.maxHeight = '0px';
    accordionContent.on(phonon.event.transitionEnd, onHide);
  }

  // fix #96
  function getAccordion(target) {
    for (; target && target !== document; target = target.parentNode) {
      if (target.nextElementSibling && target.nextElementSibling.classList.contains('accordion-content')) {
        return { defaultTarget: target, accordionContent: target.nextElementSibling };
      }
    }

    return null;
  }

  /**
	 *
	 */
  function fromPage(target) {
    for (; target && target !== document; target = target.parentNode) {
      if (target.getAttribute('data-page') === 'true') return true;
    }

    return false;
  }

  function onPage(evt) {
    const target = getAccordion(evt.target);
    if (target === null) return;

    if (target.accordionContent.classList.contains('accordion-active')) {
      hide(target.defaultTarget, target.accordionContent);
    } else {
      show(target.defaultTarget, target.accordionContent);
    }
  }

  /*
	 * Attachs event once
	 */
  document.on('pagecreated', (evt) => {
    const page = document.querySelector(evt.detail.page);

    /*
		 * Accordion lists are in:
		 * [1] pages
		 * [2] components such as side panels are found when Phonon is ready
		 */

    // 1
    const lists = page.querySelectorAll('.list');
    if (lists) {
      let i = 0;
      const l = lists.length;
      for (; i < l; i++) {
        const list = lists[i];
        if (list.querySelector('.accordion-content')) {
          list.on('tap', onPage);
        }
      }
    }
  });

  document.on('pageclosed', (evt) => {
    const page = document.querySelector(evt.detail.page);
    const accordionLists = page.querySelectorAll('.accordion-active');
    const l = accordionLists.length;
    let i = 0;

    for (; i < accordionLists.length; i++) {
      const fakeDefaultTarget = accordionLists[i].previousElementSibling;
      onPage({ target: fakeDefaultTarget });
    }
  });

  phonon.onReady(() => {
    // 2
    const lists = document.body.querySelectorAll('.list');
    if (lists) {
      let i = 0;
      const l = lists.length;
      for (; i < l; i++) {
        const list = lists[i];
        if (list.querySelector('.accordion-content') && !fromPage(list)) {
          list.on('tap', onPage);
        }
      }
    }
  });
}(typeof window !== 'undefined' ? window : this));
