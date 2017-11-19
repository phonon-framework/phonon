/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

// core
import Pager from './core/pager/index'
import Ajax from './core/ajax'
import { platform } from './core/platform'
import Intl from './core/intl'
import './core/network'
import './core/events'

// visual components (ui)
import './ui/alert'
import Notification from './ui/notification'

const api = {}

/**
 * ------------------------------------------------------------------------
 * Configuration
 * ------------------------------------------------------------------------
 */
api.config = {
  // global config
  debug: true
}

/**
 * ------------------------------------------------------------------------
 * Pager
 * ------------------------------------------------------------------------
 */
api.pager = (options = {}) => {
  if (typeof api._pager === 'undefined') {
    api._pager = Pager._DOMInterface(options.hashPrefix, options.useHash, options.defaultPage, options.animatePages)
  }
  return api._pager
}

/**
 * ------------------------------------------------------------------------
 * Platform
 * ------------------------------------------------------------------------
 */

api.platform = platform()

/**
 * ------------------------------------------------------------------------
 * Ajax
 * ------------------------------------------------------------------------
 */
api.ajax = Ajax._DOMInterface

/**
 * ------------------------------------------------------------------------
 * Intl
 * ------------------------------------------------------------------------
 */
api.intl = Intl._DOMInterface

/**
 * ------------------------------------------------------------------------
 * Notification
 * ------------------------------------------------------------------------
 */
api.notification = Notification._DOMInterface

// Make the API live
window.phonon = api

export default api
