/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
import Component from '../component'
import { getAttributesConfig } from '../componentManager'
import Event from '../../common/events'
import { findTargetByClass } from '../../common/utils'

const Tab = (() => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'tab'
  const VERSION = '2.0.0'
  const DEFAULT_PROPERTIES = {

  }
  const DATA_ATTRS_PROPERTIES = [
  ]
  const TAB_CONTENT_SELECTOR = '.tab-pane'

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Tab extends Component {

    constructor(options = {}) {
      super(NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false)
    }

    show() {
      if (this.options.element.classList.contains('active')) {
        return false
      }

      const id = this.options.element.getAttribute('href')
      const nav = findTargetByClass(this.options.element, 'nav')
      const navTabs = nav ? nav.querySelectorAll(`[data-toggle="${NAME}"]`) : null

      if (navTabs) {
        Array.from(navTabs).forEach((tab) => {
          if (tab.classList.contains('active')) {
            tab.classList.remove('active')
          }
          tab.setAttribute('aria-selected', false)
        })
      }

      this.options.element.classList.add('active')
      this.options.element.setAttribute('aria-selected', true)

      const tabContent = document.querySelector(id)
      const tabContents = tabContent.parentNode.querySelectorAll(TAB_CONTENT_SELECTOR)

      if (tabContents) {
        Array.from(tabContents).forEach((tab) => {
          if (tab.classList.contains('active')) {
            tab.classList.remove('active')
          }
        })
      }

      tabContent.classList.add('showing')

      setTimeout(() => {
        const onShowed = () => {
          tabContent.classList.remove('animate')
          tabContent.classList.add('active')
          tabContent.classList.remove('showing')
          tabContent.removeEventListener(Event.TRANSITION_END, onShowed)
        }

        tabContent.addEventListener(Event.TRANSITION_END, onShowed)

        tabContent.classList.add('animate')

      }, 20)

      return true
    }

    hide() {
      if (!this.options.element.classList.contains('active')) {
        return false
      }

      if (this.options.element.classList.contains('active')) {
        this.options.element.classList.remove('active')
      }

      this.options.element.setAttribute('aria-selected', false)

      const id = this.options.element.getAttribute('href')
      const tabContent = document.querySelector(id)

      if (tabContent.classList.contains('active')) {
        tabContent.classList.remove('active')
      }

      return true
    }

    static identifier() {
      return NAME
    }

    static _DOMInterface(options) {
      return super._DOMInterface(Tab, options)
    }
  }

  /**
   * ------------------------------------------------------------------------
   * DOM Api implementation
   * ------------------------------------------------------------------------
   */
  const components = []

  const tabs = document.querySelectorAll(`[data-toggle="${NAME}"]`)
  if (tabs) {
    Array.from(tabs).forEach((element) => {
      // const config = {}
      const config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES)
      config.element = element

      components.push(Tab._DOMInterface(config))
    })
  }

  if (tabs) {
    document.addEventListener('click', (event) => {
      const dataToggleAttr = event.target.getAttribute('data-toggle')
      if (dataToggleAttr && dataToggleAttr === NAME) {
        const id = event.target.getAttribute('href')

        const component = components.find(c => c.getElement().getAttribute('href') === id)

        if (!component) {
          return
        }

        component.show()
      }
    })
  }

  return Tab
})()

export default Tab
