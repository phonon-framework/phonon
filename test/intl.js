// load Unit.js module
import { JSDOM } from 'jsdom'
import test from 'unit.js'
import Intl from '../src/js/hybrid-apps/intl'

const dom = new JSDOM('<body></body>', { pretendToBeVisual: true })

global.window = dom.window
global.document = dom.window.document
global.CustomEvent = window.CustomEvent

describe('Intl', () => {

  it('Invalid configuration test', () => {

    // test with empty configuration
    test.exception(() => {
      new Intl()
    }).isError().hasMessage(/There is no translation data/)

    // test with missing fallback locale
    test.exception(() => {
      new Intl({
        fallbackLocale: null,
        locale: 'es',
      })
    }).isError().hasMessage(/The fallback locale is mandatory/)

    // test with missing data for the fallback locale
    test.exception(() => {
      new Intl({
        fallbackLocale: 'es',
        data: {},
      })
    }).isError().hasMessage(/The fallback locale must necessarily have translation data/)

    const intl = new Intl({
      locale: 'es',
      data: {
        en: {
          welcome: 'Hola',
        },
        es: {
          welcome: 'Hello',
        }
      }
    })

    intl.setLocale('en')
  })

  it('Working configuration test', () => {
    const intl = new Intl({
      fallbackLocale: 'es',
      locale: 'es',
      data: {
        en: {
          welcome: 'Hola',
        },
        es: {
          welcome: 'Hello',
        }
      }
    })

    intl.setLocale('en')

    test.string(intl.getLocale()).is('en')
  })

  it('Automatic locale fallback test', () => {
    const intl = new Intl({
      fallbackLocale: 'es',
      locale: 'es',
      data: {
        en: {
          welcome: 'Hello',
        },
        es: {
          welcome: 'Hola',
        }
      }
    })

    intl.setLocale('invalid')

    test.string(intl.getLocale()).is('es')
  })

  it('Language collection test', () => {
    const intl = new Intl({
      fallbackLocale: 'es',
      locale: 'es',
      data: {
        en: {
          welcome: 'Hola',
        },
        es: {
          welcome: 'Hello',
        }
      }
    })

    test.array(intl.getLanguages())
  })

  it('Translations test', () => {
    const intl = new Intl({
      fallbackLocale: 'es',
      locale: 'es',
      data: {
        en: {
          welcome: 'Hola',
          welcomePerson: 'Hola :name',
        },
        es: {
          welcome: 'Hello',
          welcomePerson: 'Hello :name',
        }
      }
    })

    test.object(intl.translate()).hasLength(2)

    test.object(intl.translate(['undefined'])).hasLength(0)

    test.object(intl.translate(['undefined', 'welcome'])).hasLength(1)

    test.string(intl.translate('welcome')).is('Hello')

    test.undefined(intl.translate('undefined'))

    test.string(intl.translate('welcomePerson', {name: 'Ben'})).is('Hello Ben')
  })

  it('Html update test', () => {
    const intl = new Intl({
      fallbackLocale: 'es',
      locale: 'es',
      data: {
        en: {
          welcome: 'Hola',
          welcomePerson: 'Hola :name',
        },
        es: {
          welcome: 'Hello',
          welcomePerson: 'Hello :name',
        }
      }
    })

    test.undefined(intl.updateHtml(null))
    test.undefined(intl.updateHtml(document.body))
    test.undefined(intl.updateHtml(document.querySelector('.invalid')))
  })
})
