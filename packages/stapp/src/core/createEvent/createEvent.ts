import { filter } from 'light-observable/observable'
import { identity } from '../../helpers/identity/identity'
import { uniqueId } from '../../helpers/uniqueId/uniqueId'

// Models
import { Epic } from '../createApp/createApp.h'
import {
  AnyEventCreator,
  AnyPayloadTransformer,
  EmptyEventCreator,
  Event,
  EventCreator0,
  EventCreator1,
  EventCreator2,
  EventCreator3,
  PayloadTransformer0,
  PayloadTransformer1,
  PayloadTransformer2,
  PayloadTransformer3
} from './createEvent.h'
import { createEpic } from '../createEpic/createEpic'

/**
 * Checks if provided value is an instance of Error
 * @private
 */
const isError = (a: any): a is Error => a instanceof Error

/**
 * Creates an event creator that accepts no arguments ([[EmptyEventCreator]]). Description is optional.
 *
 * @param description Event description
 */
export function createEvent(description?: string): EmptyEventCreator

/**
 * Creates an event creator, that accepts single argument and passes it to an event as a payload ([[EventCreator1]]). Description is optional.
 *
 * @typeparam Payload Type of event creator argument (and payload)
 * @typeparam Meta Type of event meta
 * @param description Event description
 */
export function createEvent<Payload>(
  description?: string
): EventCreator1<Payload, Payload>

/**
 * Creates an event creator that accepts no arguments ([[EventCreator0]]).
 *
 * @typeparam Payload Type of event payload
 * @typeparam Meta Type of event meta
 * @param description Event description
 * @param payloadCreator Optional payload creator
 * @param metaCreator Optional meta creator
 */
export function createEvent<Payload, Meta = void>(
  description: string,
  payloadCreator: PayloadTransformer0<Payload>,
  metaCreator?: PayloadTransformer0<Meta>
): EventCreator0<Payload, Meta>

/**
 * Creates an event creator that accepts and transforms single argument ([[EventCreator1]]).
 *
 * @typeparam A1 Type of event creator argument
 * @typeparam Payload Type of event payload
 * @typeparam Meta Type of event meta
 * @param description Event description
 * @param payloadCreator Payload creator
 * @param metaCreator Optional meta creator
 */
export function createEvent<A1, Payload, Meta = void>(
  description: string,
  payloadCreator: PayloadTransformer1<A1, Payload>,
  metaCreator?: PayloadTransformer1<A1, Meta>
): EventCreator1<A1, Payload, Meta>

/**
 * Creates an event creator that accepts and transforms two arguments ([[EventCreator2]]).
 *
 * @typeparam A1 Type of event creator first argument
 * @typeparam A2 Type of event creator second argument
 * @typeparam Payload Type of event payload
 * @typeparam Meta Type of event meta
 * @param description Event description
 * @param payloadCreator Payload creator
 * @param metaCreator Optional meta creator
 */
export function createEvent<A1, A2, Payload, Meta = void>(
  description: string,
  payloadCreator: PayloadTransformer2<A1, A2, Payload>,
  metaCreator?: PayloadTransformer2<A1, A2, Meta>
): EventCreator2<A1, A2, Payload, Meta>

/**
 * Creates an event creator that accepts and transforms three arguments ([[EventCreator2]]).
 *
 * @typeparam A1 Type of event creator first argument
 * @typeparam A2 Type of event creator second argument
 * @typeparam A3 Type of event creator third argument
 * @typeparam Payload Type of event payload
 * @typeparam Meta Type of event meta
 * @param description Event description
 * @param payloadCreator Payload creator
 * @param metaCreator Optional meta creator
 */
export function createEvent<A1, A2, A3, Payload, Meta = void>(
  description: string,
  payloadCreator: PayloadTransformer3<A1, A2, A3, Payload>,
  metaCreator?: PayloadTransformer3<A1, A2, A3, Meta>
): EventCreator3<A1, A2, A3, Payload, Meta>
export function createEvent(
  description?: string,
  payloadCreator: AnyPayloadTransformer = identity,
  metaCreator?: AnyPayloadTransformer
): AnyEventCreator {
  const type = description
    ? `${description} [${uniqueId()}]`
    : `[${uniqueId()}]`

  const eventCreator: any = (...args: any[]) => {
    const event: any = {
      type
    }

    try {
      event.payload = isError(args[0])
        ? args[0]
        : (payloadCreator as any)(...args)
    } catch (error) {
      event.payload = error
    }

    event.error = isError(event.payload)

    if (metaCreator) {
      event.meta = (metaCreator as any)(...args)
    }

    return event
  }

  eventCreator.getType = () => type
  eventCreator.is = (event: Event<any, any>) => event.type === type

  eventCreator.epic = <State>(fn: Epic<State>): Epic<State> =>
    createEpic(eventCreator, fn)

  return eventCreator
}
