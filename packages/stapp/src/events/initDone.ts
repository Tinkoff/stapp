import { createEvent } from '../core/createEvent/createEvent'
import { APP_KEY } from '../helpers/constants'

// Model
import { EmptyEventCreator } from '../core/createEvent/createEvent.h'

/**
 * Indicates about completing initialization
 * @private
 */
export const initDone: EmptyEventCreator = createEvent(`${APP_KEY}: Initialization complete`)
