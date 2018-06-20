import { filter } from 'rxjs/operators/filter'
import { getEventType } from '../../helpers/getEventType/getEventType'

// Models
import { Observable } from 'rxjs/Observable'
import { AnyEventCreator, Event } from '../../core/createEvent/createEvent.h'

/**
 * Filters stream of events by type of provided event creator
 * @typeparam Payload Event payload
 * @typeparam Meta Event meta data
 * @param eventCreator Any event creator
 * @param source$ Stream of events
 * @returns filtered stream of provided event type
 */
export function select<Payload = any, Meta = any>(
  eventCreator: string | AnyEventCreator<Payload, Meta>,
  source$: Observable<Event<any, any>>
): Observable<Event<Payload, Meta>> {
  const eventType = getEventType(eventCreator)

  return source$.pipe(filter(({ type }) => !!type && type === eventType))
}

/**
 * Filters stream of events by provided event types
 * @param eventCreators  Array of any event creators and/or strings representing event types
 * @param source$ Stream of events
 * @returns filtered stream of provided event types
 */
export function selectArray(
  eventCreators: Array<AnyEventCreator | string>,
  source$: Observable<Event<any, any>>
): Observable<Event<any, any>> {
  const eventTypes = eventCreators.map(getEventType)

  return source$.pipe(
    filter(({ type }) => !!type && eventTypes.some((eventType) => type === eventType))
  )
}
