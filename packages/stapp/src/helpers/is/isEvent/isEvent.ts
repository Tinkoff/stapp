import { has } from '../../has/has'

// Models
import { Event } from '../../../core/createEvent/createEvent.h'

/**
 * Checks if provided argument is a valid Redux action / event
 * @param arg any value
 * @private
 */
export const isEvent = <P = {}, M = {}>(arg?: any): arg is Event<P, M> => {
  return arg != null && typeof arg === 'object' && has('type', arg) && typeof arg.type === 'string'
}
