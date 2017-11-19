/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import { dispatchEvent } from '../utils.js'

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

    constructor (pageName) {
      this.name = pageName
      this.events = []
      this.templatePath = null
      this.renderFunction = null
    }

    // getters

    static get version () {
      return VERSION
    }

    getEvents () {
      return this.events
    }

    getTemplate () {
      return this.templatePath
    }

    getRenderFunction () {
      return this.renderFunction
    }

    // public

    addEventCallback (callbackFn) {
      this.events.push(callbackFn)
    }

    useTemplate (templatePath) {
      if (typeof templatePath !== 'string') {
        throw new Error('The template path must be a string. ' + typeof templatePath + ' is given')
      }
      this.templatePath = templatePath
    }

    useTemplateRenderer (renderFunction) {
      if (typeof renderFunction !== 'function') {
        throw new Error('The custom template renderer must be a function. ' + typeof renderFunction + ' is given')
      }
      this.renderFunction = renderFunction
    }

    triggerScopes (eventName, eventParams = {}) {
      this.events.forEach(scope => {
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
