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

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Intl {

    constructor (localeDefault = null, data = {}, localePreferred = null) {
      if (typeof localeDefault !== 'string') {
        throw new Error('Locale default is mandatory and must be a string.')
      }

      if (typeof data[localeDefault] !== 'object') {
        throw new Error('Locale default has not data.')
      }

      this.data = data
      this.setDefaultLocale(localeDefault, true)            
      this.localePreferred = localePreferred || (navigator.language || navigator.userLanguage)      
    }

    // getters

    static get version () {
      return VERSION
    }

    setDefaultLocale (localeDefault, silentMode = true) {
      if (typeof this.data[localeDefault] !== 'object') {
        throw new Error('Locale default has not data.')
      }

      this.localeDefault = localeDefault

      if (!silentMode) {
        this.bind()
      }
    }

    getLanguages () {
      return Object.keys(this.data)
    }

    getAll (keys = null) {
      let data = this.data[this.localePreferred]
      if (!data) {
        data = this.data[this.localeDefault]
      }

      if (Array.isArray(keys)) {
        const mapData = {}
        for (let key in data) {
          if (keys.indexOf(key) > -1) {
            mapData[key] = data[key]
          }
        }
        data = mapData
      }

      return data
    }

    get (key) {
      const data = this.getAll()
      return data[key]
    }

    bind (element) {
      if (typeof element === 'undefined') {
        element = document.querySelectorAll('[data-i18n]')
      }

      new Binder(element, this.getAll())
    }

    // static
    static _DOMInterface (localeDefault, data, localePreferred) {
      return new Intl(localeDefault, data, localePreferred)
    }
  }

  return Intl
})()

export default Intl
