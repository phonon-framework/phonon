/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
import Dialog from './index'
import { findTargetByClass } from '../../common/utils'
import { getAttributesConfig } from '../componentManager'

const Prompt = (() => {

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'dialog'
  const BACKDROP_SELECTOR = 'dialog-backdrop'
  const DEFAULT_PROPERTIES = {
    element: null,
    title: null,
    message: null,
    cancelable: true,
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
              '<input class="form-control" type="text" value="">' +
            '</div>' +
            '<div class="dialog-footer">' +
              '<button type="button" class="btn btn-primary" data-dismiss="dialog">Ok</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>'

      super(options, template)
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
  const dialogs = document.querySelectorAll(`.${NAME}`)

  if (dialogs) {
    Array.from(dialogs).forEach((element) => {
      const config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES)
      config.element = element

      if (config.type === 'alert') {
        // prompt
        components.push(new Prompt(config))
      }
    })
  }

  document.addEventListener('click', (event) => {
    const dropdownMenu = findTargetByClass(event.target, 'dropdown-menu')
    if (dropdownMenu) {
      return
    }

    const dropdown = findTargetByClass(event.target, 'dropdown')

    if (dropdown) {
      const dataToggleAttr = dropdown.getAttribute('data-toggle')
      if (dataToggleAttr && dataToggleAttr === NAME && dropdown) {
        const component = components.find(c => c.getElement() === dropdown)

        if (!component) {
          return
        }

        component.toggle()
      }
    }
  })

  return Prompt
})()

export default Prompt
