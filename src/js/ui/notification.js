/**
* --------------------------------------------------------------------------
* Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
* --------------------------------------------------------------------------
*/

const Notification = (() => {
  /**
   * ------------------------------------------------------------------------
  * Constants
  * ------------------------------------------------------------------------
  */

  const NAME = 'notification'
  const VERSION = '2.0.0'

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Notification {
    constructor(notification = null, message, showButton = true, timeout = 0, color = 'dark') {
      this.notification = notification
      this.message = message
      this.showButton = showButton
      this.timeout = timeout
      this.color = color

      this.template = '' +
        '<div class="notification-inner">' +
          '<div class="message"></div>' +
          '<button class="btn">X</button>' +
        '</div>'

      this.onButtonHandler = (event) => {
        this.onButton(event)
      }

      this.onHiddenTransitionHandler = (event) => {
        this.onHidden(event)
      }
    }

    build() {
      const div = document.createElement('div')
      div.classList.add('notification')

      div.innerHTML = this.template

      // color
      div.classList.add(`bg-${this.color}`)
      div.querySelector('.btn').classList.add(`btn-${this.color}`)

      // text message
      div.querySelector('.message').innerHTML = this.message

      if (this.showButton) {
        div.querySelector('.btn').addEventListener('click', this.onButtonHandler)
      } else {
        div.querySelector('.btn').style.display = 'none'
      }

      this.notification = div

      document.body.appendChild(this.notification)

      return this
    }

    show() {
      window.setTimeout(() => {
        this.notification.classList.add('show')
      }, 1)

      if (Number.isInteger(this.timeout) && this.timeout > 0) {
        window.setTimeout(() => {
          this.hide()
        }, this.timeout)
      }
    }

    hide() {
      this.notification.classList.remove('show')
      this.notification.classList.add('hide')
      this.notification.addEventListener('transitionend', this.onHiddenTransitionHandler)
    }

    onButton(event) {
      this.hide()
      event.target.removeEventListener('click', this.onButtonHandler)
    }

    onHidden() {
      this.notification.removeEventListener('transitionend', this.onHiddenTransitionHandler)
      this.destroy()
    }

    destroy() {
      this.notification.querySelector('.btn').removeEventListener('click', this.onButtonHandler)
      document.body.removeChild(this.notification)
      this.notification = null
    }

    static get version() {
      return VERSION
    }

    static _DOMInterface(notification, message, showButton, timeout, color) {
      return new Notification(notification, message, showButton, timeout, color)
    }
  }

  return Notification
})()

export default Notification
