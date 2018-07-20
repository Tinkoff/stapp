import { getEventType } from '../../helpers/getEventType/getEventType'
import { has } from '../../helpers/has/has'
import { isArray } from '../../helpers/is/isArray/isArray'
import { createEvent } from '../createEvent/createEvent'

// Models
import { AnyEventCreator, Event, EventCreators } from '../createEvent/createEvent.h'
import { EventHandler, EventHandlers, Reducer } from './createReducer.h'

/**
 * Creates reducer with some additional methods
 * @typeparam S Reducer's state interface
 * @param initialState Initial state for the reducer
 * @param handlers Object with event types as keys and EventHandlers as values
 * @returns {Reducer}
 */
export const createReducer = <S = {}>(
  initialState: S,
  handlers: EventHandlers<S, any> = {}
): Reducer<S> => {
  const innerHandlers = Object.assign({}, handlers)
  const reducer: any = (state = initialState, event?: Event) => {
    if (!event) {
      return state
    }

    if (!has(event.type, innerHandlers)) {
      return state
    }

    return innerHandlers[event.type](state, event.payload, event.meta)
  }

  const resetHandler = () => initialState

  reducer.has = (eventOrType: AnyEventCreator | string) =>
    has(getEventType(eventOrType), innerHandlers)

  reducer.on = <P, M>(
    eventOrType: AnyEventCreator<P, M> | string | Array<AnyEventCreator | string>,
    handler: EventHandler<S, P, M>
  ) => {
    if (isArray(eventOrType)) {
      eventOrType.forEach((event) => reducer.on(event, handler))
      return reducer
    }

    innerHandlers[getEventType(eventOrType)] = handler
    return reducer
  }

  reducer.off = (eventOrType: AnyEventCreator | string | Array<AnyEventCreator | string>) => {
    if (isArray(eventOrType)) {
      eventOrType.forEach((event) => reducer.off(event))
      return reducer
    }

    delete innerHandlers[getEventType(eventOrType)]
    return reducer
  }

  reducer.reset = (eventOrType: AnyEventCreator | string | Array<AnyEventCreator | string>) => {
    if (isArray(eventOrType)) {
      eventOrType.forEach((event) => reducer.reset(event))
      return reducer
    }

    innerHandlers[getEventType(eventOrType)] = resetHandler
    return reducer
  }

  reducer.createEvents = <T extends string, P>(model: { [K in T]: EventHandler<S, P, any> }) => {
    const eventNames = Object.keys(model) as T[]
    const events: EventCreators = {}

    eventNames.forEach((eventName) => {
      const handler: EventHandler<S, P> = model[eventName]
      const eventCreator = createEvent<any>(`${eventName}`)

      events[eventName] = eventCreator
      reducer.on(eventCreator, handler)
    })

    return events
  }

  return reducer
}
