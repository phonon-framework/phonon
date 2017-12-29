/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
import Dialog from './index'
import { getAttributesConfig } from '../componentManager'

const Prompt = (() => {

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'prompt'
  const DEFAULT_PROPERTIES = {
    element: null,
    title: null,
    message: null,
    cancelable: true,
    type: NAME,
    buttons: [
      {
        event: 'cancel',
        text: 'Cancel',
        dismiss: true,
        class: 'btn btn-secondary',
      },
      {
        event: 'confirm',
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

  class Prompt extends Dialog {

    constructor(options = {}) {
      const template = '' +
      '<div class="dialog" tabindex="-1" role="dialog">' +
        '<div class="dialog-inner" role="document">' +
          '<div class="dialog-content">' +
            '<div class="dialog-header">' +
              '<h5 class="dialog-title"></h5>' +
            '</div>' +
            '<div class="dialog-body">' +
              '<p></p>' +
              '<input class="form-control" type="text" value="">' +
            '</div>' +
            '<div class="dialog-footer">' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>'

      if (!Array.isArray(options.buttons)) {
        options.buttons = DEFAULT_PROPERTIES.buttons
      }

      super(options, template)
    }

    show() {
      super.show()
      this.attachInputEvent()
    }

    hide() {
      super.hide()   
      this.detachInputEvent()   
    }

    getInput() {
      return this.options.element.querySelector('.form-control')
    }

    attachInputEvent() {
      this.registerElement({ target: this.getInput(), event: 'keyup' })
    }

    detachInputEvent() {
      this.unregisterElement({ target: this.getInput(), event: 'keyup' })         
    }

    onElementEvent(event) {
      if (event.target === this.getInput()) {
        return
      }

      super.onElementEvent(event)
    }

    setInputValue(value = '') {
      this.getInput().value = value
    }

    getInputValue() {
      return this.getInput().value
    }

    static identifier() {
      return NAME
    }

    static _DOMInterface(options) {
      return new Prompt(options)
    }
  }

  /**
   * ------------------------------------------------------------------------
   * DOM Api implementation
   * ------------------------------------------------------------------------
   */
  const components = []
  const dialogs = document.querySelectorAll(`.${Dialog.identifier()}`)

  if (dialogs) {
    Array.from(dialogs).forEach((element) => {
      const config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES)
      config.element = element

      if (config.type === NAME) {
        // prompt
        components.push(new Prompt(config))
      }
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

  return Prompt
})()

export default Prompt
