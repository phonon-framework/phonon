/**
* --------------------------------------------------------------------------
* Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
* --------------------------------------------------------------------------
*/

const Binder = (() => {
  /**
  * ------------------------------------------------------------------------
  * Constants
  * ------------------------------------------------------------------------
  */

  const NAME = 'intl-binder'
  const VERSION = '2.0.0'

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Binder {
    constructor(element, data) {
      this.element = element
      this.data = data
      this.setNodes()
    }

    // getters

    static get version() {
      return `${NAME}.${VERSION}`
    }

    /**
     * Checks if the given argument is a DOM element
     * @param {DOMObject} o the argument to test
     * @return {boolean} true if the object is a DOM element, false otherwise
     */
    isElement() {
      return (typeof Node === 'object' ? this.element instanceof Node : this.element && typeof this.element === 'object' && typeof this.element.nodeType === 'number' && typeof this.element.nodeName === 'string')
    }

    /**
    * Binds some text to the given DOM element
    * @param {any} element
    * @param {String} text
    */
    setText(element, text) {
      if (!('textContent' in element)) {
        element.innerText = text
      } else {
        element.textContent = text
      }
    }

    /**
     * Binds some html to the given DOM element
     * @param {any} element
     * @param {string} text
     */
    setHtml(element, text) {
      element.innerHTML = text
    }

    /**
    * Binds custom attributes to the given DOM element
    * @param {String} attr
    * @param {String} text
    */
    setAttribute(element, attr, text) {
      element.setAttribute(attr, text)
    }

    /**
    * Set values to DOM nodes
    */
    setNodes() {
      const elements = this.element
      elements.forEach((el) => {
        const attr = el.getAttribute('data-i18n').trim()
        const r = /(?:\s|^)([A-Za-z-_0-9]+):\s*(.*?)(?=\s+\w+:|$)/g
        let m

        while (m = r.exec(attr)) {
          let key = m[1].trim()
          let value = m[2].trim().replace(',', '')
          let intlValue = this.data[value]

          if (!this.data[value]) {
            console.log(`${NAME}. Warning, ${value} does not exist.`)
            intlValue = value
          }

          const methodName = 'set' + key.charAt(0).toUpperCase() + key.slice(1)

          if (this[methodName]) {
            this[methodName](el, intlValue)
          } else {
            this.setAttribute(el, key, intlValue)
          }
        }
      })
    }
  }

  return Binder
})()

export default Binder
