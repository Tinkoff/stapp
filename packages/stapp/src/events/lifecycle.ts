import { createEvent } from '../core/createEvent/createEvent'
import { APP_KEY } from '../helpers/constants'

// Model
import { EmptyEventCreator } from '../core/createEvent/createEvent.h'

/**
 * Indicates about completing initialization
 * @private
 */
export const initEvent: EmptyEventCreator = createEvent(
  `${APP_KEY}: Initialization complete`
)

/**
 * Indicates ready event
 * @private
 */
export const readyEvent: EmptyEventCreator = createEvent(`${APP_KEY}: Ready`)

/**
 * @deprecated
 */
export const initDone = initEvent

/**
 * Indicates about completing initialization
 * @private
 */
export const disconnectEvent: EmptyEventCreator = createEvent(
  `${APP_KEY}: Disconnect`
)
