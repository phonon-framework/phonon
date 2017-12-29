/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
import Event from '../../common/events'
import Component from '../component'
import { getAttributesConfig } from '../componentManager'

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
    buttons: [
      {
        text: 'Ok',
        dismiss: true,
        class: 'btn btn-primary',
      },
    ],
  }
  const DATA_ATTRS_PROPERTIES = [
    'cancelable',
  ]

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Dialog extends Component {

    constructor(options = {}, template = null) {
      super(NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, true, true)

      this.template = template || '' +
      '<div class="dialog" tabindex="-1" role="dialog">' +
        '<div class="dialog-inner" role="document">' +
          '<div class="dialog-content">' +
            '<div class="dialog-header">' +
              '<h5 class="dialog-title"></h5>' +
            '</div>' +
            '<div class="dialog-body">' +
              '<p></p>' +
            '</div>' +
            '<div class="dialog-footer">' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>'

      if (this.dynamicElement) {
        this.build()
      }
    }

    build() {
      const builder = document.createElement('div')

      builder.innerHTML = this.template

      this.options.element = builder.firstChild

      // title
      if (this.options.title !== null) {
        this.options.element.querySelector('.dialog-title').innerHTML = this.options.title
      }

      // message
      if (this.options.message !== null) {
        this.options.element.querySelector('.dialog-body').firstChild.innerHTML = this.options.message
      } else {
        // remove paragraph node
        this.removeTextBody()
      }

      // buttons
      if (this.options.buttons !== null && Array.isArray(this.options.buttons)) {
        if (this.options.buttons.length > 0) {
          this.options.buttons.forEach((button) => {
            this.options.element.querySelector('.dialog-footer').appendChild(this.buildButton(button))
          })
        } else {
          this.removeFooter()
        }
      } else {
        this.removeFooter()
      }

      document.body.appendChild(this.options.element)

      this.setAttributes()
    }

    buildButton(buttonInfo = {}) {
      const button = document.createElement('button')
      button.setAttribute('type', 'button')
      button.setAttribute('class', buttonInfo.class || 'btn')
      button.innerHTML = buttonInfo.text

      if (buttonInfo.dismiss) {
        button.setAttribute('data-dismiss', NAME)
      }

      return button
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

    removeTextBody() {
      this.options.element.querySelector('.dialog-body').removeChild(this.options.element.querySelector('.dialog-body').firstChild)      
    }

    removeFooter() {
      const footer = this.options.element.querySelector('.dialog-footer')      
      this.options.element.querySelector('.dialog-content').removeChild(footer)
    }

    center() {
      const computedStyle = window.getComputedStyle(this.options.element)
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
        return false
      }

      // add a timeout so that the CSS animation works
      setTimeout(() => {
        this.triggerEvent(Event.SHOW)
        this.buildBackdrop()

        const onShown = () => {
          this.triggerEvent(Event.SHOWN)
          this.options.element.removeEventListener(Event.TRANSITION_END, onShown)

          // attach event
          this.attachEvents()
        }

        this.options.element.addEventListener(Event.TRANSITION_END, onShown)

        this.options.element.classList.add('show')

        this.center()
      }, 10)

      return true
    }

    onElementEvent(event) {
      if (event.type === 'keyup' && event.keyCode !== 27 && event.keyCode !== 13) {
        return
      }

      // hide the dialog
      this.hide()
    }

    hide() {
      if (!this.options.element.classList.contains('show')) {
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
        Array.from(dismissButtons).forEach(button => this.registerElement({ target: button, event: 'click' }))
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
        Array.from(dismissButtons).forEach(button => this.unregisterElement({ target: button, event: 'click' }))
      }

      if (this.options.cancelable) {
        const backdrop = this.getBackdrop()
        this.unregisterElement({ target: backdrop, event: Event.START })
        this.unregisterElement({ target: document, event: 'keyup' })
      }
    }

    static identifier() {
      return NAME
    }

    static _DOMInterface(options) {
      return super._DOMInterface(Dialog, options)
    }
  }

  /**
   * ------------------------------------------------------------------------
   * DOM Api implementation
   * ------------------------------------------------------------------------
   */
  const components = []

  const dialogs = document.querySelectorAll(`.${NAME}`)
  if (dialogs) {
    Array.from(dialogs).forEach((element) => {
      const config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES)
      config.element = element

      components.push({ element, dialog: new Dialog(config) })
    })
  }

  document.addEventListener('click', (event) => {
    const dataToggleAttr = event.target.getAttribute('data-toggle')
    if (dataToggleAttr && dataToggleAttr === NAME) {
      const id = event.target.getAttribute('data-target')
      const element = document.querySelector(id)

      const component = components.find(c => c.element === element)

      if (!component) {
        return
      }

      // remove the focus state of the trigger
      event.target.blur()

      component.dialog.show()
    }
  })

  return Dialog
})()

export default Dialog
