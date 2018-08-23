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
 * Indicates about completing initialization
 * @private
 */
export const disconnectEvent: EmptyEventCreator = createEvent(
  `${APP_KEY}: Disconnect`
)
