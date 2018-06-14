import { AnyEventCreator, Event, EventCreator1 } from '../createEvent/createEvent.h'

/**
 * Event handler. Accepts current state, event payload and event meta. Should return new state.
 *
 * @typeparam State Application state shape
 * @typeparam Payload Event payload
 * @typeparam Meta Event meta data
 */
export type EventHandler<State, Payload = void, Meta = void> = (
  state: State,
  payload: Payload,
  meta: Meta
) => State

/**
 * Basically, a reducer is a function, that accepts a state and an event, and returns a new state.
 * Stapp [[createReducer]] creates a reducer on steroids. See examples below.
 * @typeparam State Reducer's state interface
 */
export type Reducer<State> = {
  /**
   * @param state Reducer's state
   * @param event Any event
   * @returns new state
   */
  (state: State, event: Event<any, any>): State

  /**
   * Attaches EventHandler to the reducer. Adding handlers of already existing event type will override previous handlers.
   * Returns reducer.
   *
   * @typeparam Payload Event payload
   * @typeparam Meta Event meta data
   * @param event Event creator, a string representing event type or an array of event creators or types
   * @param handler EventHandler
   * @returns same reducer
   */
  on<Payload, Meta>(
    event: AnyEventCreator<Payload, Meta> | string | Array<AnyEventCreator | string>,
    handler: EventHandler<State, Payload, Meta>
  ): Reducer<State>

  /**
   * Detaches EventHandler from the reducer. Returns reducer.
   *
   * @param event Event creator, a string representing event type or an array of event creators or types
   * @returns {Reducer} Same reducer
   */
  off(event: AnyEventCreator | string | Array<AnyEventCreator | string>): Reducer<State>

  /**
   * Assigns reset handler to provided event types. Reset handler always returns initialState.
   *
   * @param event Event creator, a string representing event type or an array of event creators or types
   * @returns Same reducer
   */
  reset(event: AnyEventCreator | string | Array<AnyEventCreator | string>): Reducer<State>

  /**
   * Checks if the reducer has a handler for provided event creator or event type.
   *
   * @param event Any event creator or a string representing event type
   */
  has(event: AnyEventCreator | string): boolean

  /**
   * Creates an object of eventCreators from passed eventHandlers.
   *
   * @typeparam T List of eventCreators names
   * @param model Object of event handlers
   */
  createEvents<T extends string>(
    model: { [K in T]: EventHandler<State, any> }
  ): { [K in T]: EventCreator1<any> }
}

/**
 * An object with various event handlers as values
 * @typeparam State Reducer state
 * @typeparam Handlers Array of handler names
 */
export type EventHandlers<State, Handlers extends string> = {
  [K in Handlers]: EventHandler<State, any, any>
}
