/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

// core
import Pager from './core/pager/index'
import Ajax from './core/ajax'
import platform from './core/platform'
import Intl from './core/intl'
import Network from './core/network'

// components
import Dialog from './components/dialog'
import Notification from './components/notification'
import Collapse from './components/collapse'
import Progress from './components/progress'
import Loader from './components/loader'
import OffCanvas from './components/off-canvas'

const api = {}

/**
 * ------------------------------------------------------------------------
 * Configuration
 * ------------------------------------------------------------------------
 */
api.config = {
  // global config
  debug: true,
}

/**
 * ------------------------------------------------------------------------
 * Pager
 * ------------------------------------------------------------------------
 */
api.pager = (options) => {
  if (typeof api._pager === 'undefined') {
    api._pager = Pager._DOMInterface(options)
  }
  return api._pager
}

/**
 * ------------------------------------------------------------------------
 * Platform
 * ------------------------------------------------------------------------
 */

api.platform = platform

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
 * Network
 * ------------------------------------------------------------------------
 */
api.network = Network._DOMInterface

/**
 * ------------------------------------------------------------------------
 * Notification
 * ------------------------------------------------------------------------
 */
api.notification = Notification._DOMInterface

/**
 * ------------------------------------------------------------------------
 * Dialog
 * ------------------------------------------------------------------------
 */
api.dialog = Dialog._DOMInterface

/**
 * ------------------------------------------------------------------------
 * Collapse
 * ------------------------------------------------------------------------
 */
api.collapse = Collapse._DOMInterface

/**
 * ------------------------------------------------------------------------
 * Progress
 * ------------------------------------------------------------------------
 */
api.progress = Progress._DOMInterface

/**
 * ------------------------------------------------------------------------
 * Loader
 * ------------------------------------------------------------------------
 */
api.loader = Loader._DOMInterface

/**
 * ------------------------------------------------------------------------
 * Off canvas
 * ------------------------------------------------------------------------
 */
api.offCanvas = OffCanvas._DOMInterface

// Make the API live
window.phonon = api

export default api
