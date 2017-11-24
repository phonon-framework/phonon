/**
* --------------------------------------------------------------------------
* Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
* --------------------------------------------------------------------------
*/
import Event from '../../core/events'

const Notification = (() => {
  /**
   * ------------------------------------------------------------------------
  * Constants
  * ------------------------------------------------------------------------
  */

  const NAME = 'notification'
  const VERSION = '2.0.0'
  const DEFAULT_PROPERTIES = {
    element: null,
    message: '',
    showButton: true,
    timeout: null,
    background: 'primary',
  }

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Notification {
    constructor(options = {}) {
      this.options = Object.assign(DEFAULT_PROPERTIES, options)

      if (typeof this.options.element === 'string') {
        this.options.element = document.querySelector(this.options.element)
      }

      this.dynamicElement = this.options.element === null
      this.timeoutCallback = null

      this.template = '' +
        '<div class="notification-inner">' +
          '<div class="message"></div>' +
          '<button class="btn">X</button>' +
        '</div>'

      if (this.dynamicElement) {
        this.build()
      }

      this.onButtonHandler = event => {
        this.onButton(event)
      }

      this.onHiddenTransitionHandler = event => {
        this.onHidden(event)
      }
    }

    build() {
      const div = document.createElement('div')
      div.classList.add('notification')

      div.innerHTML = this.template

      // text message
      div.querySelector('.message').innerHTML = this.options.message

      if (!this.options.showButton) {
        div.querySelector('.btn').style.display = 'none'
      }

      this.options.element = div

      document.body.appendChild(this.options.element)
    }

    show() {
      if (this.options.element === null) {
        // build and insert a new DOM element
        this.build()
      }

      if (this.options.element.classList.contains('show')) {
        console.error(`${NAME}. The notification is already visible.`)
        return
      }

      // reset color
      if (this.options.background) {
        this.options.element.removeAttribute('class')
        this.options.element.setAttribute('class', 'notification')

        this.options.element.classList.add(`bg-${this.options.background}`)
        this.options.element.querySelector('.btn').classList.add(`btn-${this.options.background}`)
      }

      // attach the button handler
      if (this.options.showButton) {
        this.options.element.querySelector('.btn').addEventListener('click', this.onButtonHandler)
      }

      setTimeout(() => {
        this.options.element.classList.add('show')
      }, 1)

      if (Number.isInteger(this.options.timeout) && this.options.timeout > 0) {
        // if there is a timeout, auto hide the notification
        this.timeoutCallback = setTimeout(() => {
          this.hide()
        }, this.options.timeout + 1)
      }
    }

    hide() {
      /*
       * prevent to close a notification with a timeout
       * if the user has already clicked on the button
       */
      if (this.timeoutCallback) {
        clearTimeout(this.timeoutCallback)
        this.timeoutCallback = null
      }

      if (!this.options.element.classList.contains('show')) {
        console.error(`${NAME}. The notification is not visible.`)
        return
      }

      this.options.element.classList.remove('show')
      this.options.element.classList.add('hide')
      this.options.element.addEventListener(Event.TRANSITION_END, this.onHiddenTransitionHandler)
    }

    onButton(event) {
      this.hide()
    }

    onHidden() {
      // detach the button handler
      if (this.options.showButton) {
        this.options.element.querySelector('.btn').removeEventListener('click', this.onButtonHandler)
      }

      this.options.element.removeEventListener(Event.TRANSITION_END, this.onHiddenTransitionHandler)

      if (this.dynamicElement) {
        document.body.removeChild(this.options.element)
        this.options.element = null
      }
    }

    static get version() {
      return `${NAME}.${VERSION}`
    }

    static _DOMInterface(options) {
      return new Notification(options)
    }
  }

  return Notification
})()

export default Notification
