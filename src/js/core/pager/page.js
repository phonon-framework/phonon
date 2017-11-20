/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import { dispatchEvent } from '../utils'

const Page = (() => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'page'
  const VERSION = '2.0.0'

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
      this.events.forEach((scope) => {
        const scopeEvent = scope[eventName]
        if (typeof scopeEvent === 'function') {
          scopeEvent.apply(this, eventParams)
        }
      })

      dispatchEvent(`${this.name}.${eventName}`, eventParams)
    }
  }

  return Page
})()

export default Page
