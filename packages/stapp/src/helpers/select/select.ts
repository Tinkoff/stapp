import { AnyEventCreator, Event } from '../../core/createEvent/createEvent.h'
import { getEventType } from '../getEventType/getEventType'

export function select(eventCreator: AnyEventCreator | string) {
  const type = getEventType(eventCreator)
  return (event: Event<any, any>) => type === event.type
}

export function selectArray(eventCreators: Array<AnyEventCreator | string>) {
  const types = eventCreators.map((eventCreator) => getEventType(eventCreator))

  return (event: Event<any, any>) => types.indexOf(event.type) >= 0
}
