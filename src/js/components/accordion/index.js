/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
import Component from '../component'
import Collapse from '../collapse'
import { getAttributesConfig } from '../componentManager'
import { findTargetByClass } from '../../common/utils'

const Accordion = (() => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'accordion'
  const VERSION = '2.0.0'
  const DEFAULT_PROPERTIES = {
    element: null,
  }
  const DATA_ATTRS_PROPERTIES = [
  ]

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Accordion extends Component {

    constructor(options = {}) {
      super(NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false)

      this.collapses = []

      const toggles = this.options.element.querySelectorAll(`[data-toggle="${NAME}"]`)
      Array.from(toggles).forEach((toggle) => {
        const collapseId = toggle.getAttribute('href')
        const collapse = document.querySelector(collapseId)

        if (collapse) {
          this.addCollapse(collapse)
        }
      })
    }

    onElementEvent(event) {
      const id = event.target.getAttribute('href')
      const element = document.querySelector(id)

      this.setCollapses(element)
    }

    addCollapse(element) {
      const collapse = new Collapse({
        element,
      })
      this.collapses.push(collapse)

      return collapse
    }

    getCollapse(element) {
      let collapse = this.collapses.find(c => c.options.element.getAttribute('id') === element.getAttribute('id'))

      if (!collapse) {
        // create a new collapse
        collapse = this.addCollapse()
      }

      return collapse
    }

    getCollapses() {
      return this.collapses
    }

    setCollapses(showCollapse) {
      const collapse = this.getCollapse(showCollapse)
      this.collapses.forEach((c) => {
        if (c.options.element.getAttribute('id') !== showCollapse.getAttribute('id')) {
          c.hide()
        } else {
          collapse.toggle()
        }
      })
    }

    show(collapseEl) {
      let collapse = collapseEl
      if (typeof collapseEl === 'string') {
        collapse = document.querySelector(collapseEl)
      }

      if (!collapse) {
        throw new Error(`${NAME}. The collapsible ${collapseEl} is an invalid HTMLElement.`)
      }

      this.setCollapses(collapse)

      return true
    }

    hide(collapseEl) {
      let collapse = collapseEl
      if (typeof collapseEl === 'string') {
        collapse = document.querySelector(collapseEl)
      }

      if (!collapse) {
        throw new Error(`${NAME}. The collapsible ${collapseEl} is an invalid HTMLElement.`)
      }

      const collapseObj = this.getCollapse(collapse)
      return collapseObj.hide()
    }

    static identifier() {
      return NAME
    }

    static _DOMInterface(options) {
      return super._DOMInterface(Accordion, options)
    }
  }

  /**
   * ------------------------------------------------------------------------
   * DOM Api implementation
   * ------------------------------------------------------------------------
   */
  const components = []

  const accordions = document.querySelectorAll(`.${NAME}`)
  if (accordions) {
    Array.from(accordions).forEach((element) => {
      const config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES)
      config.element = element

      components.push(Accordion._DOMInterface(config))
    })
  }

  if (accordions) {
    document.addEventListener('click', (event) => {
      const dataToggleAttr = event.target.getAttribute('data-toggle')
      if (dataToggleAttr && dataToggleAttr === NAME) {
        const collapseId = event.target.getAttribute('data-target') || event.target.getAttribute('href')
        const collapseEl = document.querySelector(collapseId)

        const accordion = findTargetByClass(event.target, 'accordion')

        if (accordion === null) {
          return
        }

        const accordionId = accordion.getAttribute('id')
        const component = components.find(c => c.getElement().getAttribute('id') === accordionId)

        if (!component) {
          return
        }

        // if the collapse has been added programmatically, we add it
        const targetCollapse = component.getCollapses().find(c => c.getElement() === collapseEl)
        if (!targetCollapse) {
          component.addCollapse(collapseEl)
        }

        component.show(collapseId)
      }
    })
  }

  return Accordion
})()

export default Accordion
