import { AnyEventCreator, Event } from '../../core/createEvent/createEvent.h'
import { getEventType } from '../getEventType/getEventType'
import { isArray } from '../is/isArray/isArray'

export function select(
  eventCreator: AnyEventCreator | string | Array<AnyEventCreator | string>
) {
  if (isArray(eventCreator)) {
    return selectArray(eventCreator) // tslint:disable-line deprecation
  }

  const type = getEventType(eventCreator)
  return (event: Event<any, any>) => type === event.type
}

/**
 * @deprecated
 * @param eventCreators
 */
export function selectArray(eventCreators: Array<AnyEventCreator | string>) {
  const types = eventCreators.map((eventCreator) => getEventType(eventCreator))

  return (event: Event<any, any>) => types.indexOf(event.type) >= 0
}
