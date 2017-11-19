/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import { dispatchEvent } from './utils.js'

const Network = (() => {
  const NAME = 'network'

  const Event = {
    NETWORK_ONLINE: `online.ph.${NAME}`,
    NETWORK_OFFLINE: `offline.ph.${NAME}`
  }

  window.addEventListener('online', () => {
    dispatchEvent(Event.NETWORK_ONLINE, { date: new Date() })
  })

  window.addEventListener('offline', () => {
    dispatchEvent(Event.NETWORK_OFFLINE, { date: new Date() })
  })
})()

export default Network
