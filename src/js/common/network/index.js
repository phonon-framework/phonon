/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import Event from '../../common/events'
import Component from '../../components/component'

const Network = (() => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'network'
  const VERSION = '2.0.0'
  const DEFAULT_PROPERTIES = {
    element: null,
    initialDelay: 3000,
    delay: 5000,
  }
  const DATA_ATTRS_PROPERTIES = [
  ]

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
      super(NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, true, false)

      this.xhr = null
      this.checkInterval = null

      this.setStatus(Event.NETWORK_ONLINE)

      setTimeout(() => {
        this.startCheck()
      }, this.options.initialDelay)
    }

    getStatus() {
      return this.status
    }

    setStatus(status) {
      this.status = status
    }

    startRequest() {
      this.xhr = new XMLHttpRequest()
      this.xhr.offline = false

      const url = `/favicon.ico?_=${new Date().getTime()}`

      this.triggerEvent(Event.NETWORK_RECONNECTING, { date: new Date() }, false)            

      this.xhr.open('HEAD', url, true)

      this.xhr.timeout = this.options.delay - 1
      this.xhr.ontimeout = () => {
        this.xhr.abort()
        this.xhr = null
      }

      this.xhr.onload = () => {
        this.onUp()
      }
      this.xhr.onerror = () => {
        this.onDown()
      }

      try {
        this.xhr.send()
      } catch (e) {
        this.onDown()
      }
    }

    onUp() {
      this.triggerEvent(Event.NETWORK_RECONNECTING_SUCCESS, { date: new Date() }, false)

      if (this.getStatus() !== Event.NETWORK_ONLINE) {
        this.triggerEvent(Event.NETWORK_ONLINE, { date: new Date() }, false)
      }

      this.setStatus(Event.NETWORK_ONLINE)      
    }

    onDown() {
      this.triggerEvent(Event.NETWORK_RECONNECTING_FAILURE, { date: new Date() }, false)

      if (this.getStatus() !== Event.NETWORK_OFFLINE) {
        this.triggerEvent(Event.NETWORK_OFFLINE, { date: new Date() }, false)
      }

      this.setStatus(Event.NETWORK_OFFLINE)      
    }

    startCheck() {
      this.stopCheck()

      this.startRequest()      

      this.checkInterval = setInterval(() => {
        this.startRequest()
      }, this.options.delay)
    }

    stopCheck() {
      if (this.checkInterval !== null) {
        clearInterval(this.checkInterval)
        this.checkInterval = null
      }
    }

    static _DOMInterface(options) {
      return super._DOMInterface(Network, options)
    }
  }

  return Network
})()

export default Network
