import { has } from '../has/has'

// Models
import { AnyEventCreator } from '../../core/createEvent/createEvent.h'

/**
 * Gets type from an eventCreator
 * @private
 */
export function getEventType(eventCreator: AnyEventCreator | string) {
  return has('getType', eventCreator) ? eventCreator.getType() : eventCreator
}
