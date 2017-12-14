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

      if (!this.isElement(this.element)) {
        return
      }

      // array of HTMLElement
      if (this.element.length && this.element.length > 0) {
        this.setNodes(this.element)
      } else {
        // single HTMLElement
        this.setNode(this.element)
      }
    }

    // getters

    static get version() {
      return `${NAME}.${VERSION}`
    }

    /**
     * Checks if the given argument is a DOM element
     * @param {HTMLElement} the argument to test
     * @return {boolean} true if the object is a DOM element, false otherwise
     */
    isElement(element) {
      if (element === null) {
        return false
      }
      return (typeof Node === 'object' ? element instanceof Node : element && typeof element === 'object' && typeof element.nodeType === 'number' && typeof element.nodeName === 'string')
    }

    /**
    * Binds some text to the given DOM element
    * @param {HTMLElement} element
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
     * @param {HTMLElement} element
     * @param {string} text
     */
    setHtml(element, text) {
      element.innerHTML = text
    }

    /**
     * Binds custom attributes to the given DOM element
     * @param {HTMLElement} element
     * @param {String} attr
     * @param {String} text
     */
    setAttribute(element, attr, text) {
      element.setAttribute(attr, text)
    }

    setNode(element) {
      let attr = element.getAttribute('data-i18n')
      if (!attr) {
        return
      }

      attr = attr.trim()

      const r = /(?:\s|^)([A-Za-z-_0-9]+):\s*(.*?)(?=\s+\w+:|$)/g
      let m

      while (m = r.exec(attr)) {
        const key = m[1].trim()
        const value = m[2].trim().replace(',', '')
        let intlValue = this.data[value]

        if (!this.data[value]) {
          console.log(`${NAME}. Warning, ${value} does not exist.`)
          intlValue = value
        }

        const methodName = 'set' + key.charAt(0).toUpperCase() + key.slice(1)

        if (this[methodName]) {
          this[methodName](element, intlValue)
        } else {
          this.setAttribute(element, key, intlValue)
        }
      }
    }

    /**
    * Set values to DOM nodes
    */
    setNodes(element) {
      Array.from(element).forEach(el => this.setNode(el))
    }
  }

  return Binder
})()

export default Binder
