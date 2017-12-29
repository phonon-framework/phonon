/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
import Dialog from './index'
import Spinner from '../loader/index'
import { getAttributesConfig } from '../componentManager'

const Loader = (() => {

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'loader'
  const DEFAULT_PROPERTIES = {
    element: null,
    title: null,
    message: null,
    cancelable: true,
    type: NAME,
    buttons: [],
  }
  const DATA_ATTRS_PROPERTIES = [
    'cancelable',
  ]

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Loader extends Dialog {

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
              '<div class="mx-auto text-center">' +
                '<div class="loader mx-auto d-block">' +
                  '<div class="loader-spinner"></div>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div class="dialog-footer">' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>'

      if (!Array.isArray(options.buttons)) {
        options.buttons = options.cancelable ? DEFAULT_PROPERTIES.buttons : []
      }

      super(options, template)

      this.spinner = null
    }

    show() {
      super.show()

      this.spinner = new Spinner({element: this.getElement().querySelector('.loader')})
      this.spinner.animate(true)
    }

    hide() {
      super.hide()

      this.spinner.animate(false)
      this.spinner = null
    }

    static identifier() {
      return NAME
    }

    static _DOMInterface(options) {
      return new Loader(options)
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
        // loader
        components.push(new Loader(config))
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

  return Loader
})()

export default Loader
