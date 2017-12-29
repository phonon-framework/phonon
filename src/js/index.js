/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import Pager from './hybrid-apps/pager/index'
import Intl from './hybrid-apps/intl'
import Network from './common/network'

// components
import Dialog from './components/dialog'
import Prompt from './components/dialog/prompt'
import Confirm from './components/dialog/confirm'
import DialogLoader from './components/dialog/loader'
import Notification from './components/notification'
import Collapse from './components/collapse'
import Accordion from './components/accordion'
import Tab from './components/tab'
import Progress from './components/progress'
import Loader from './components/loader'
import OffCanvas from './components/off-canvas'
import Dropdown from './components/dropdown'
import DropdownSearch from './components/dropdown/search'

const api = {}

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
api.dialog = (options) => {
  if (options.type === Prompt.identifier()) {
    // prompt dialog
    return Prompt._DOMInterface(options)
  }

  if (options.type === Confirm.identifier()) {
    // confirm dialog
    return Confirm._DOMInterface(options)
  }

  if (options.type === DialogLoader.identifier()) {
    // confirm dialog
    return DialogLoader._DOMInterface(options)
  }

  // generic dialog
  return Dialog._DOMInterface(options)
}

/**
 * ------------------------------------------------------------------------
 * Collapse
 * ------------------------------------------------------------------------
 */
api.collapse = Collapse._DOMInterface

/**
 * ------------------------------------------------------------------------
 * Accordion
 * ------------------------------------------------------------------------
 */
api.accordion = Accordion._DOMInterface


/**
 * ------------------------------------------------------------------------
 * Tab
 * ------------------------------------------------------------------------
 */
api.tab = Tab._DOMInterface

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

/**
 * ------------------------------------------------------------------------
 * Dropdown
 * ------------------------------------------------------------------------
 */
api.dropdown = (options) => {
  if (options.search) {
    // search dropdown
    return DropdownSearch._DOMInterface(options)
  }

  // generic dropdown
  return Dropdown._DOMInterface(options)
}

// Make the API live
window.phonon = api

export default api
