/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import { loadFile } from '../utils'
import { dispatchPageEvent } from '../events/dispatch'

const Page = (() => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'page'
  const VERSION = '2.0.0'

  const TEMPLATE_SELECTOR = '[data-template]'

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Page {
    /**
     * Creates an instance of Page.
     * @param {string} pageName
     */
    constructor(pageName) {
      this.name = pageName
      this.events = []
      this.templatePath = null
      this.renderFunction = null
    }

    // getters

    static get version() {
      return `${NAME}.${VERSION}`
    }

    /**
     * Get events
     * @returns {Function[]}
     */
    getEvents() {
      return this.events
    }

    /**
     * Get template
     * @returns {string}
     */
    getTemplate() {
      return this.templatePath
    }

    /**
     * Get render function
     * @returns {Function}
     */
    getRenderFunction() {
      return this.renderFunction
    }

    loadTemplate() {
      const pageElement = document.querySelector(`[data-page="${this.name}"]`)

      loadFile(this.getTemplate(), template => {
        let render = function (DOMPage, template, elements) {
          if (elements) {
            elements.forEach((el) => {
              el.innerHTML = template
            })
          } else {
            DOMPage.innerHTML = template
          }
        }

        if (this.getRenderFunction()) {
          render = this.getRenderFunction()
        }

        render(pageElement, template, pageElement.querySelectorAll(TEMPLATE_SELECTOR))
      }, null)
    }

    // public

    /**
     *
     * @param {*} callbackFn
     */
    addEventCallback(callbackFn) {
      this.events.push(callbackFn)
    }

    /**
     * Use the given template
     *
     * @param {string} templatePath
     */
    useTemplate(templatePath) {
      if (typeof templatePath !== 'string') {
        throw new Error('The template path must be a string. ' + typeof templatePath + ' is given')
      }
      this.templatePath = templatePath
    }

    /**
     * Use the given template renderer
     * @param {Function} renderFunction
     */
    useTemplateRenderer(renderFunction) {
      if (typeof renderFunction !== 'function') {
        throw new Error('The custom template renderer must be a function. ' + typeof renderFunction + ' is given')
      }
      this.renderFunction = renderFunction
    }

    /**
     * Trigger scopes
     * @param {string} eventName
     * @param {{}} [eventParams={}]
     */
    triggerScopes(eventName, eventParams = {}) {
      const eventNameAlias = `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`

      this.events.forEach(scope => {
        const scopeEvent = scope[eventName]
        const scopeEventAlias = scope[eventNameAlias]
        if (typeof scopeEvent === 'function') {
          scopeEvent.apply(this, eventParams)
        }

        // trigger the event alias
        if (typeof scopeEventAlias === 'function') {
          scopeEventAlias.apply(this, eventParams)
        }
      })

      dispatchPageEvent(eventName, this.name, eventParams)
    }
  }

  return Page
})()

export default Page
