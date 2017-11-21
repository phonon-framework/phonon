/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
import Binder from './binder'

const Intl = (() => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'Intl'
  const VERSION = '2.0.0'
  const DEFAULT_PROPERTIES = {
    fallbackLocale: 'en',
    locale: 'en',
    autoBind: true,
    data: null
  }

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Intl {
    /**
     * Creates an instance of Intl.
     * @param {fallbackLocale: string, locale: string, autoBind: boolean, data: {[lang: string]: {[key: string]: string}}}
     */
    constructor(options) {
      options = Object.assign(DEFAULT_PROPERTIES, options)
      
      this.fallbackLocale = options.fallbackLocale
      this.locale = options.locale
      this.autoBind = options.autoBind
      this.data = options.data

      if (typeof this.fallbackLocale !== 'string') {
        throw new Error(`${NAME}. Fallback locale is mandatory and must be a string.`)
      }

      this.setLocale(this.locale, this.autoBind)
    }

    // getters

    static get version() {
      return `${NAME}.${VERSION}`
    }

    /**
     * Set default locale
     * @param {string} locale
     * @param {boolean} [bind=true]
     */
    setLocale(locale, bind = true) {
      if (typeof this.data[locale] !== 'object') {
        console.error(`${NAME}. ${locale} has no data, fallback in ${this.fallbackLocale}.`)
      } else {
        this.locale = locale
      }

      if (bind) {
        this.bind()
      }
    }

    getLanguages() {
      return Object.keys(this.data)
    }

    insertValues(value = null, injectableValues = {}) {
      if (typeof value !== 'string') {
        return ''
      }

      const match = value.match(/:([a-zA-Z-_0-9]+)/)
      if (match) {
        value = value.replace(match[0], injectableValues[match[1]])
      }

      if (value.match(/:([a-zA-Z-_0-9]+)/)) {
        return this.insertValues(value, injectableValues)
      }

      return value
    }

    translate(keyName = null, inject = {}) {
      let data = this.data[this.locale]
      if (!data) {
        data = this.data[this.fallbackLocale]
      }

      if (keyName === null || keyName === '*' || Array.isArray(keyName)) {
        if (Array.isArray(keyName)) {
          const keys = Object.keys(data).filter(key => keyName.indexOf(key) > -1)
          const filteredData = {}
          keys.forEach(key => {
            filteredData[key] = this.insertValues(data[key], inject)
          })
          data = filteredData
        }

        const dataMap = {}
        for (const key in data) {
          dataMap[key] = this.insertValues(data[key], inject)
        }

        return dataMap
      }

      return this.insertValues(data[keyName], inject)
    }

    // alias of t()
    t(keyName = null, inject = {}) {
      return this.translate(keyName, inject)
    }

    /**
     * Bind
     * @param {HTMLElement} element
     */
    bind(element) {
      if (typeof element === 'undefined') {
        element = document.querySelectorAll('[data-i18n]')
      }

      if (typeof element === 'string') {
        element = document.querySelector(element)
      }

      new Binder(element, this.t())
    }

    // static
    static _DOMInterface(options) {
      return new Intl(options)
    }
  }

  return Intl
})()

export default Intl
