/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Loader = (() => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'loader'
  const VERSION = '2.0.0'
  const DEFAULT_PROPERTIES = {
    element: null,
    color: null,
    size: null,
  }

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Loader {

    constructor(options = {}) {
      this.options = Object.assign(DEFAULT_PROPERTIES, options)

      if (typeof this.options.element === 'string') {
        this.options.element = document.querySelector(this.options.element)
      }

      if (this.options.element === null) {
        throw new Error(`${NAME}. The element is not a HTMLElement.`)
      }

      // set color
      const loaderSpinner = this.getSpinner()
      if (typeof this.options.color === 'string'
        && !loaderSpinner.classList.contains(`color-${this.options.color}`)) {
        loaderSpinner.classList.add(`color-${this.options.color}`)
      }

      this.customSize = this.options.size !== null
    }

    getClientSize() {
      if (!this.customSize) {
        const size = this.options.element.getBoundingClientRect()        
        return size.height
      }

      return this.options.size
    }

    getSpinner() {
      return this.options.element.querySelector('.loader-spinner')
    }

    show() {
      if (this.options.element.classList.contains('hide')) {
        this.options.element.classList.remove('hide')
      }

      const size = this.getClientSize()
      this.options.size = size

      if (this.customSize) {
        this.options.element.style.width = `${this.options.size}px`
        this.options.element.style.height = `${this.options.size}px`

        const loaderSpinner = this.getSpinner()
        loaderSpinner.style.width = `${this.options.size}px`
        loaderSpinner.style.height = `${this.options.size}px`
      }
    }

    animate(startAnimation = true) {
      if (startAnimation) {
        this.show()
      } else {
        this.hide()
      }

      const loaderSpinner = this.getSpinner()

      if (startAnimation &&
        !loaderSpinner.classList.contains('loader-spinner-animated')) {
        loaderSpinner.classList.add('loader-spinner-animated')
        return true
      }

      if (!startAnimation &&
        loaderSpinner.classList.contains('loader-spinner-animated')) {
        loaderSpinner.classList.remove('loader-spinner-animated')
      }

      return true
    }

    hide() {
      if (!this.options.element.classList.contains('hide')) {
        this.options.element.classList.add('hide')
      }
    }

    static get version() {
      return `${NAME}.${VERSION}`
    }

    static _DOMInterface(options) {
      return new Loader(options)
    }
  }

  return Loader
})()

export default Loader
