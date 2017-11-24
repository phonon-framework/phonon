/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Collapse = (() => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'collapse'
  const VERSION = '2.0.0'
  const DEFAULT_PROPERTIES = {
    element: null,
    toggle: false,
  }

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Collapse {

    constructor(options = {}) {
      this.options = Object.assign(DEFAULT_PROPERTIES, options)

      if (typeof this.options.element === 'string') {
        this.options.element = document.querySelector(this.options.element)
      }

      if (this.options.element === null) {
        throw new Error(`${NAME}. The element is not a HTMLElement.`)
      }

      this.clickTargetHandler = (event) => {
        this.toggle(event)
      }

      // buttons

      // [1] href
      document.querySelector('[href="#collapseExample"]').addEventListener('click', this.clickTargetHandler)

      // [2] data-target
      document.querySelector('[data-target="#collapseExample"]').addEventListener('click', this.clickTargetHandler)      
    }

    toggle() {
      document.querySelector('#collapseExample').classList.add('collapsing')

      setTimeout(() => {
        document.querySelector('#collapseExample').classList.remove('collapsing')
        document.querySelector('#collapseExample').classList.toggle('show')
      }, 600)
    }

    static get version() {
      return `${NAME}.${VERSION}`
    }

    static _DOMInterface(options) {
      return new Collapse(options)
    }
  }

  return Collapse
})()

export default Collapse
