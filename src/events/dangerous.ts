/**
 * This events can be used in epics. But should not.
 */
import { createEvent } from '../core/createEvent/createEvent'
import { APP_KEY } from '../helpers/constants'

// Models
import { EmptyEventCreator, EventCreator1 } from '../core/createEvent/createEvent.h'

/**
 * Can be used to replace state completely
 */
export const dangerouslyReplaceState: EventCreator1<any> = createEvent<any>(
  `${APP_KEY}: Replace state`
)

/**
 * Can be used to reinitialize state
 */
export const dangerouslyResetState: EmptyEventCreator = createEvent(`${APP_KEY}: Reset state`)
