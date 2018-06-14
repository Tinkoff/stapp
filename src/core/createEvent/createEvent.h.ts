import { Epic, EventEpic } from '../createApp/createApp.h'

export type Event<Payload = void, Meta = void> = {
  readonly type: string
  readonly payload: Payload
  meta: Meta
  readonly error: boolean
}

export type BaseEventCreator<Payload, Meta> = {
  getType(): string
  is(event: Event<any, any>): event is Event<Payload, Meta>
  epic<State>(fn: EventEpic<Payload, Meta, State>): Epic<State>
}

export type EmptyEventCreator = BaseEventCreator<void, void> & (() => Event<void, void>)

export type EventCreator0<Payload, Meta = void> = BaseEventCreator<Payload, Meta> &
  (() => Event<Payload, Meta>)

export type EventCreator1<A1, Payload = A1, Meta = void> = BaseEventCreator<Payload, Meta> &
  ((arg1: A1) => Event<Payload, Meta>)

export type EventCreator2<A1, A2, Payload = A1, Meta = void> = BaseEventCreator<Payload, Meta> &
  ((arg1: A1, arg2: A2) => Event<Payload, Meta>)

export type EventCreator3<A1, A2, A3, Payload = A1, Meta = void> = BaseEventCreator<Payload, Meta> &
  ((arg1: A1, arg2: A2, arg3: A3) => Event<Payload, Meta>)

/**
 * @typeparam Payload Type of returned value
 */
export type PayloadTransformer0<Payload> = () => Payload

/**
 * @typeparam A1 Type of payload transformer argument
 * @typeparam Payload Type of returned value
 */
export type PayloadTransformer1<A1, Payload> = (arg1: A1) => Payload

/**
 * @typeparam A1 Type of payload transformer first argument
 * @typeparam A2 Type of payload transformer second argument
 * @typeparam Payload Type of returned value
 */
export type PayloadTransformer2<A1, A2, Payload> = (arg1: A1, arg2: A2) => Payload

/**
 * @typeparam A1 Type of payload transformer first argument
 * @typeparam A2 Type of payload transformer second argument
 * @typeparam A3 Type of payload transformer third argument
 * @typeparam Payload Type of returned value
 */
export type PayloadTransformer3<A1, A2, A3, Payload> = (arg1: A1, arg2: A2, arg3: A3) => Payload

/**
 * @private
 */
export type AnyEventCreator<Payload = any, Meta = any> =
  | EmptyEventCreator
  | EventCreator1<any, Payload, Meta>
  | EventCreator2<any, any, Payload, Meta>
  | EventCreator3<any, any, any, Payload, Meta>

/**
 * @private
 */
export type AnyPayloadTransformer =
  | PayloadTransformer0<any>
  | PayloadTransformer1<any, any>
  | PayloadTransformer2<any, any, any>
  | PayloadTransformer3<any, any, any, any>

/**
 * An object with various event creators as values
 */
export type EventCreators = {
  [K: string]: AnyEventCreator
}
