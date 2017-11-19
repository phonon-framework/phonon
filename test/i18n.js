// load Unit.js module
const test = require('unit.js')
require('jsdom-global')()
require('../dist/js/phonon')

const phonon = window.phonon

describe('i18n', function () {
  it('Test initializing i18n', function () {

    let error = () => {
      new phonon.Intl()
    }

    test.exception(error).isError().hasMessage(/Locale default/)

    error = () => {
      new phonon.Intl('es')
    }

    test.exception(error).isError().hasMessage(/data/)

    const intl = new phonon.Intl('es', {
      en: {
        welcome: 'Hola'
      },
      es: {
        welcome: 'Hello'
      }
    })

    intl.setDefaultLocale('en')
  })

  it('Test with basic configuration', function () {
    const intl = new phonon.Intl('es', {
      en: {
        welcome: 'Hola'
      },
      es: {
        welcome: 'Hello'
      }
    })

    intl.setDefaultLocale('en')
  })

  it('Test with invalid language', function () {
    const intl = new phonon.Intl('es', {
      en: {
        welcome: 'Hello'
      },
      es: {
        welcome: 'Hola'
      }
    })

    const error = () => {
      intl.setDefaultLocale('ge')
    }

    test.exception(error).match(/data/)
  })

  it('Test fetching languages', function () {
    const intl = new phonon.Intl('es', {
      en: {
        welcome: 'Hola'
      },
      es: {
        welcome: 'Hello'
      }
    })

    test.array(intl.getLanguages())    
  })

  it('Test fetching language data', function () {
    const intl = new phonon.Intl('es', {
      en: {
        welcome: 'Hola'
      },
      es: {
        welcome: 'Hello'
      }
    })

    test.object(intl.getAll()).hasLength(1)

    test.object(intl.getAll(['a'])).hasLength(0)

    test.object(intl.getAll(['a', 'welcome'])).hasLength(1)
    
    test.string(intl.get('welcome'))

    test.undefined(intl.get('a'))    
  })
})