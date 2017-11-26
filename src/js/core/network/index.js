/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import Event from '../events'
import Component from '../../components/component'
import { dispatchWinDocEvent } from '../events/dispatch'

const Network = (() => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'network'
  const VERSION = '2.0.0'
  const DEFAULT_PROPERTIES = {}

  window.addEventListener('online', () => {
    dispatchWinDocEvent(Event.NETWORK_ONLINE, NAME, { date: new Date() })
  })

  window.addEventListener('offline', () => {
    dispatchWinDocEvent(Event.NETWORK_OFFLINE, NAME, { date: new Date() })
  })

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Network extends Component {
    /**
     * Creates an instance of Network.
     * @param {{}} [options={}]
     */
    constructor(options = {}) {
      super(NAME, VERSION, DEFAULT_PROPERTIES, options, true)
      this.addEvents()
    }

    addEvents() {
      window.addEventListener('online.ph.network', () => {
        this.triggerEvent(Event.NETWORK_ONLINE, { date: new Date() }, true)
      })

      window.addEventListener('offline.ph.network', () => {
        this.triggerEvent(Event.NETWORK_OFFLINE, { date: new Date() }, true)
      })
    }

    static _DOMInterface(options) {
      return super._DOMInterface(Network, options)
    }
  }

  return Network
})()

export default Network
