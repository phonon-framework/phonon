/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import Event from '../events'
import { dispatchWinDocEvent } from '../events/dispatch'

const Network = (() => {
  const NAME = 'network'

  window.addEventListener('online', () => {
    dispatchWinDocEvent(Event.NETWORK_ONLINE, NAME, { date: new Date() })
  })

  window.addEventListener('offline', () => {
    dispatchWinDocEvent(Event.NETWORK_OFFLINE, NAME, { date: new Date() })
  })
})()

export default Network
