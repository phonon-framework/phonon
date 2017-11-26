/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
import Event from '../../core/events'
import Component from '../component'

const Dialog = (() => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'dialog'
  const VERSION = '2.0.0'
  const BACKDROP_SELECTOR = 'dialog-backdrop'
  const DEFAULT_PROPERTIES = {
    element: null,
    title: null,
    message: null,
    cancelable: true,
  }

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Dialog extends Component {

    constructor(options = {}) {
      super(NAME, VERSION, DEFAULT_PROPERTIES, options, true)

      this.template = '' +
      '<div class="dialog-inner" role="document">' +
        '<div class="dialog-content">' +
          '<div class="dialog-header">' +
            '<h5 class="dialog-title"></h5>' +
          '</div>' +
          '<div class="dialog-body">' +
            '<p></p>' +
          '</div>' +
          '<div class="dialog-footer">' +
            '<button type="button" class="btn btn-primary" data-dismiss="dialog">Ok</button>' +
          '</div>' +
        '</div>' +
      '</div>'

      if (this.dynamicElement) {
        this.build()
      }
    }

    build() {
      const div = document.createElement('div')
      div.classList.add('dialog')

      div.setAttribute('data-id', this.id)
      div.setAttribute('tabindex', '-1')
      div.setAttribute('role', 'dialog')

      div.innerHTML = this.template

      // title
      if (this.options.title !== null) {
        div.querySelector('.dialog-title').innerHTML = this.options.title
      }

      // message
      if (this.options.message !== null) {
        div.querySelector('.dialog-body').firstChild.innerHTML = this.options.message
      }

      this.options.element = div

      document.body.appendChild(this.options.element)
    }

    buildBackdrop() {
      const backdrop = document.createElement('div')
      backdrop.setAttribute('data-id', this.id)
      backdrop.classList.add(BACKDROP_SELECTOR)

      document.body.appendChild(backdrop)
    }

    getBackdrop() {
      return document.querySelector(`.${BACKDROP_SELECTOR}[data-id="${this.id}"]`)
    }

    center() {
      const computedStyle = window.getComputedStyle(this.options.element)
      // const width = computedStyle.width.slice(0, computedStyle.width.length - 2)
      const height = computedStyle.height.slice(0, computedStyle.height.length - 2)

      const top = (window.innerHeight / 2) - (height / 2)
      this.options.element.style.top = `${top}px`
    }

    show() {
      if (this.options.element === null) {
        // build and insert a new DOM element
        this.build()
      }

      if (this.options.element.classList.contains('show')) {
        console.error(`${NAME}. The dialog is already visible.`)
        return false
      }

      // add a timeout so that the CSS animation works
      setTimeout(() => {
        this.triggerEvent(Event.SHOW)
        this.buildBackdrop()

        const onShown = () => {
          this.triggerEvent(Event.SHOWN)
          this.options.element.removeEventListener(Event.TRANSITION_END, onShown)
        }

        this.options.element.addEventListener(Event.TRANSITION_END, onShown)

        this.options.element.classList.add('show')
        this.center()

        // attach event
        this.attachEvents()
      }, 1)

      return true
    }

    onElementEvent(event) {
      if (event.type === 'keyup' && event.keyCode !== 27 && event.keyCode !== 13) {
        return
      }

      if (!this.closable()) {
        return
      }

      // hide the dialog
      this.hide()
    }

    hide() {
      if (!this.options.element.classList.contains('show')) {
        console.error(`${NAME}. The dialog is not visible.`)
        return false
      }

      this.triggerEvent(Event.HIDE)

      this.detachEvents()

      this.options.element.classList.add('hide')
      this.options.element.classList.remove('show')

      const backdrop = this.getBackdrop()

      const onHidden = () => {
        document.body.removeChild(backdrop)

        this.options.element.classList.remove('hide')

        this.triggerEvent(Event.HIDDEN)

        backdrop.removeEventListener(Event.TRANSITION_END, onHidden)

        // remove generated dialogs from the DOM
        if (this.dynamicElement) {
          document.body.removeChild(this.options.element)
          this.options.element = null
        }
      }

      backdrop.addEventListener(Event.TRANSITION_END, onHidden)
      backdrop.classList.add('fadeout')

      return true
    }

    attachEvents() {
      const dismissButtons = this.options.element.querySelectorAll('[data-dismiss]')
      if (dismissButtons) {
        dismissButtons.forEach(button => this.registerElement({ target: button, event: 'click' }))
      }

      // add events if the dialog is cancelable
      // which means the user can hide the dialog
      // by pressing the ESC key or click outside the backdrop
      if (this.options.cancelable) {
        const backdrop = this.getBackdrop()
        this.registerElement({ target: backdrop, event: Event.START })
        this.registerElement({ target: document, event: 'keyup' })
      }
    }

    detachEvents() {
      const dismissButtons = this.options.element.querySelectorAll('[data-dismiss]')
      if (dismissButtons) {
        dismissButtons.forEach(button => this.unregisterElement({ target: button, event: 'click' }))
      }

      if (this.options.cancelable) {
        const backdrop = this.getBackdrop()
        this.unregisterElement({ target: backdrop, event: Event.START })
        this.unregisterElement({ target: document, event: 'keyup' })
      }
    }

    /**
     * Closable d
     */
    closable() {
      return super.closable()
    }

    static _DOMInterface(options) {
      return super._DOMInterface(Dialog, options)
    }
  }

  return Dialog
})()

export default Dialog
