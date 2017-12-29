/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
import Dialog from './index'
import { getAttributesConfig } from '../componentManager'

const Confirm = (() => {

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'confirm'
  const DEFAULT_PROPERTIES = {
    element: null,
    title: null,
    message: null,
    cancelable: true,
    type: NAME,
    buttons: [
      {
        text: 'Cancel',
        dismiss: true,
        class: 'btn btn-secondary',
      },
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

  class Confirm extends Dialog {

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

    static identifier() {
      return NAME
    }

    static _DOMInterface(options) {
      return new Confirm(options)
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
        // confirm
        components.push(new Confirm(config))
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

  return Confirm
})()

export default Confirm
