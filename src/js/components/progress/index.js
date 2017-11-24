/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Progress = (() => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'progress'
  const VERSION = '2.0.0'
  const DEFAULT_PROPERTIES = {
    element: null,
    height: 5,
    min: 0,
    max: 100,
    label: false,
    striped: false,
    background: null,
  }

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Progress {

    constructor(options = {}) {
      this.options = Object.assign(DEFAULT_PROPERTIES, options)

      if (typeof this.options.element === 'string') {
        this.options.element = document.querySelector(this.options.element)
      }

      if (this.options.element === null) {
        throw new Error(`${NAME}. The element is not a HTMLElement.`)
      }

      // set the correct height
      this.options.element.style.height = `${this.options.height}px`

      // set min and max values
      const progressBar = this.getProgressBar()
      progressBar.setAttribute('aria-valuemin', `${this.options.min}`)
      progressBar.setAttribute('aria-valuemax', `${this.options.max}`)

      // set striped
      if (this.options.striped
        && !progressBar.classList.contains('progress-bar-striped')) {
        progressBar.classList.add('progress-bar-striped')
      }

      // set background
      if (typeof this.options.background === 'string'
        && !progressBar.classList.contains(`bg-${this.options.background}`)) {
        progressBar.classList.add(`bg-${this.options.background}`)
      }
    }

    getProgressBar () {
      return this.options.element.querySelector('.progress-bar')
    }

    set(value = 0) {
      const progressBar = this.getProgressBar()
      const progress = Math.round((value / (this.options.min + this.options.max)) * 100)

      if (value < this.options.min) {
        console.error(`${NAME}. Warning, ${value} is under min value.`)
        return false
      }

      if (value > this.options.max) {
        console.error(`${NAME}. Warning, ${value} is above max value.`)          
        return false
      }

      progressBar.setAttribute('aria-valuenow', `${value}`)      

      // set label
      if (this.options.label) {
        progressBar.innerHTML = `${progress}%`
      }

      // set percentage
      progressBar.style.width = `${progress}%`
    }

    animate(startAnimation = true) {
      if (!this.options.striped) {
        console.error(`${NAME}. Animation works only with striped progress.`)
        return false
      }

      const progressBar = this.getProgressBar()

      if (startAnimation
        && !progressBar.classList.contains('progress-bar-animated')) {
        progressBar.classList.add('progress-bar-animated')
      }

      if (!startAnimation
        && progressBar.classList.contains('progress-bar-animated')) {
        progressBar.classList.remove('progress-bar-animated')
      }

      return true
    }

    show() {
      this.options.element.style.height = `${this.options.height}px`
    }

    hide() {
      this.options.element.style.height = '0px'
    }

    static get version() {
      return `${NAME}.${VERSION}`
    }

    static _DOMInterface(options) {
      return new Progress(options)
    }
  }

  return Progress
})()

export default Progress
