import { createEvent } from '../core/createEvent/createEvent'
import { APP_KEY } from '../helpers/constants'

// Models
import { EmptyEventCreator } from '../core/createEvent/createEvent.h'

/**
 * Event signaling about epic completing
 */
export const epicEnd: EmptyEventCreator = createEvent(`${APP_KEY}: Epic enc`)
