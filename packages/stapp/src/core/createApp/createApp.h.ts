import { Middleware } from 'redux'
import { Observable, Subscribable } from 'rxjs'
import { AnyEventCreator, Event } from '../createEvent/createEvent.h'
import { ReducersMap } from '../createReducer/createReducer.h'

/**
 * ### Example
 *
 * @typeparam Payload Event payload
 * @typeparam Meta Event meta
 * @typeparam State Application state shape
 * @param event$ Stream of events
 * @param state$ Stream of state
 */
export type EventEpic<Payload, Meta, State> = (
  event$: Observable<Event<Payload, Meta>>,
  state$: Observable<State>,
  staticApi: {
    dispatch: Dispatch<State>
    getState(): State
    fromESObservable(innerStream: Observable<any>): any
    toESObservable(outerStream: any): Subscribable<any>
  }
) => Subscribable<any> | void

/**
 * Epic is a function, that must return an Observable.
 * An observable may emit any value, but only valid events will be passed to dispatch.
 *
 *
 * @typeparam State Application state shape
 * @param event$ Stream of events
 * @param state$ Stream of state
 */
export type Epic<State> = EventEpic<any, any, State>

export type WaitFor = Array<
  | AnyEventCreator
  | string
  | {
      event: AnyEventCreator | string
      timeout?: number
      condition?: () => boolean
    }
>

/**
 * A module is a plain object that consists of several fields. The only required field
 * is `name`. It will be used in development mode for debugging.
 * *
 * @see [[ModuleFactory]]
 * @typeparam Api Event creators
 * @typeparam State Module state
 * @typeparam Full Full application state
 */
export type Module<Api, State, Full extends Partial<State> = State> = {
  name: string
  dependencies?: string[]

  // Api
  events?: Api
  api?: Api
  waitFor?: WaitFor

  // State
  reducers?: ReducersMap<State>
  state?: ReducersMap<State>

  // Epics
  epic?: Epic<Partial<Full>> | Array<Epic<Partial<Full>>>
  epics?: Epic<Partial<Full>> | Array<Epic<Partial<Full>>>
  useGlobalObservableConfig?: boolean
  observableConfig?: ObservableConfig<any>
}

/**
 * ModuleFactory is a function that must return a [[Module]].
 * It will be called with any extra dependencies passed to [[createApp]].
 *
 * @typeparam Extra Dependencies needed by module factory
 * @typeparam Api Event creators
 * @typeparam State Module state
 * @typeparam Full Full application state
 */
export type ModuleFactory<
  Api,
  State,
  Full extends Partial<State> = {},
  Extra = {}
> = (extraArgument: Extra) => Module<Api, State, Full>

/**
 * @typeparam Extra Dependencies needed by module factory
 * @typeparam Api Event creators
 * @typeparam State Module state
 * @typeparam Full Full application state
 * @private
 */
export type AnyModule<Api, State, Full extends Partial<State>, Extra> =
  | ModuleFactory<Api, State, Full, Extra>
  | Module<Api, State, Full>

// prettier-ignore
export type Dispatch<State> = <T>(
  event: T
) =>
  T extends Subscribable<any> ? Promise<void> :
  T extends Promise<infer P> ? P :
  T extends Thunk<State, infer R> ? R : T

export type Thunk<State, Result> = (
  getState: () => State,
  dispatch: Dispatch<State>
) => Result

export type ObservableConfig<Stream> = {
  fromESObservable?: (innerStream: Observable<any>) => Stream
  toESObservable?: (outerStream: Stream) => Observable<any>
}

/**
 * An app created by [[createApp]] is another core concept of Stapp. See README.md for details.
 * @typeparam State Application state shape
 * @typeparam Api Application api interface
 */
export type Stapp<State, Api> = Subscribable<State> & {
  name: string
  api: Api
  dispatch: Dispatch<State>
  getState: () => State
  ready: Promise<Partial<State>>
  disconnect: () => void
}

export type StappApi<T extends Stapp<any, any>> = T extends Stapp<
  any,
  infer Api
>
  ? Api
  : any

export type StappState<T extends Stapp<any, any>> = T extends Stapp<
  infer State,
  any
>
  ? State
  : any

export type DevtoolsConfig = {
  name?: string
  actionCreators?:
    | Array<() => Event<any, any>>
    | { [K: string]: () => Event<any, any> }
  latency?: number
  maxAge?: number
  serialize?: {
    options: {
      date?: boolean
      regex?: boolean
      undefined?: boolean
      nan?: boolean
      infinity?: boolean
      error?: boolean
      symbol?: boolean
      map?: boolean
      set?: boolean
      function?: (fn: Function) => string // tslint:disable-line ban-types
    }
    replacer?: (key: string, value: any) => any
    reviver?: (key: string, value: any) => any
    immutable?: object
    refs?: object[]
  }
  actionSanitizer?: (event: Event<any, any>) => Event<any, any>
  stateSanitizer?: (state: any) => any
  actionsBlacklist?: string | string[]
  actionsWhitelist?: string | string[]
  predicate?: (state: any, event: Event<any, any>) => true
  shouldRecordChanges?: boolean
  pauseActionType?: string
  autoPause?: boolean
  shouldStartLocked?: boolean
  shouldHotReload?: boolean
  shouldCatchErrors?: string
  features?: {
    pause?: boolean
    lock?: boolean
    persist?: boolean
    export?: boolean | 'custom'
    import?: boolean | 'custom'
    jump?: boolean
    skip?: boolean
    reorder?: boolean
    dispatch?: boolean
    test?: boolean
  }
}

/**
 * Yes, it takes hundreds of loc, but it works as expected.
 * @hidden
 */
// prettier-ignore
export type CreateApp = {
  <
    A1, S1, E1
    >(config: {
    name?: string
    modules:
      [
        AnyModule<A1, S1, S1, E1>
        ]
    dependencies?: E1
    rehydrate?: Partial<S1>
    middlewares?: Middleware[]
    devtools?: false | DevtoolsConfig
  }): Stapp<S1, A1>

  <
    A1, S1, E1,
    A2, S2, E2,
    Extra extends E1 & E2,
    State extends S1 & S2,
    Api extends A1 & A2
    >(config: {
    name?: string
    modules:
      [
        AnyModule<A1, S1, State, E1>,
        AnyModule<A2, S2, State, E2>
        ]
    dependencies?: Extra
    rehydrate?: Partial<State>
    middlewares?: Middleware[]
    devtools?: false | DevtoolsConfig
  }): Stapp<State, Api>

  <
    A1, S1, E1,
    A2, S2, E2,
    A3, S3, E3,
    Extra extends E1 & E2 & E3,
    State extends S1 & S2 & S3,
    Api extends A1 & A2 & A3
    >(config: {
    name?: string
    modules:
      [
        AnyModule<A1, S1, State, E1>,
        AnyModule<A2, S2, State, E2>,
        AnyModule<A3, S3, State, E3>
        ]
    dependencies?: Extra
    rehydrate?: Partial<State>
    middlewares?: Middleware[]
    devtools?: false | DevtoolsConfig
  }): Stapp<State, Api>

  <
    A1, S1, E1,
    A2, S2, E2,
    A3, S3, E3,
    A4, S4, E4,
    Extra extends E1 & E2 & E3 & E4,
    State extends S1 & S2 & S3 & S4,
    Api extends A1 & A2 & A3 & A4
    >(config: {
    name?: string
    modules: [
      AnyModule<A1, S1, State, E1>,
      AnyModule<A2, S2, State, E2>,
      AnyModule<A3, S3, State, E3>,
      AnyModule<A4, S4, State, E4>
      ]
    dependencies?: Extra
    rehydrate?: Partial<State>
    middlewares?: Middleware[]
    devtools?: false | DevtoolsConfig
  }): Stapp<State, Api>

  <
    A1, S1, E1,
    A2, S2, E2,
    A3, S3, E3,
    A4, S4, E4,
    A5, S5, E5,
    Extra extends E1 & E2 & E3 & E4 & E5,
    State extends S1 & S2 & S3 & S4 & S5,
    Api extends A1 & A2 & A3 & A4 & A5
    >(config: {
    name?: string
    modules: [
      AnyModule<A1, S1, State, E1>,
      AnyModule<A2, S2, State, E2>,
      AnyModule<A3, S3, State, E3>,
      AnyModule<A4, S4, State, E4>,
      AnyModule<A5, S5, State, E5>
      ]
    dependencies?: Extra
    rehydrate?: Partial<State>
    middlewares?: Middleware[]
    devtools?: false | DevtoolsConfig
  }): Stapp<State, Api>

  <
    A1, S1, E1,
    A2, S2, E2,
    A3, S3, E3,
    A4, S4, E4,
    A5, S5, E5,
    A6, S6, E6,
    Extra extends E1 & E2 & E3 & E4 & E5 & E6,
    State extends S1 & S2 & S3 & S4 & S5 & S6,
    Api extends A1 & A2 & A3 & A4 & A5 & A6
    >(config: {
    name?: string
    modules: [
      AnyModule<A1, S1, State, E1>,
      AnyModule<A2, S2, State, E2>,
      AnyModule<A3, S3, State, E3>,
      AnyModule<A4, S4, State, E4>,
      AnyModule<A5, S5, State, E5>,
      AnyModule<A6, S6, State, E6>
      ]
    dependencies?: Extra
    rehydrate?: Partial<State>
    middlewares?: Middleware[]
    devtools?: false | DevtoolsConfig
  }): Stapp<State, Api>

  <
    A1, S1, E1,
    A2, S2, E2,
    A3, S3, E3,
    A4, S4, E4,
    A5, S5, E5,
    A6, S6, E6,
    A7, S7, E7,
    Extra extends E1 & E2 & E3 & E4 & E5 & E6 & E7,
    State extends S1 & S2 & S3 & S4 & S5 & S6 & S7,
    Api extends A1 & A2 & A3 & A4 & A5 & A6 & A7
    >(config: {
    name?: string
    modules: [
      AnyModule<A1, S1, State, E1>,
      AnyModule<A2, S2, State, E2>,
      AnyModule<A3, S3, State, E3>,
      AnyModule<A4, S4, State, E4>,
      AnyModule<A5, S5, State, E5>,
      AnyModule<A6, S6, State, E6>,
      AnyModule<A7, S7, State, E7>
      ]
    dependencies?: Extra
    rehydrate?: Partial<State>
    middlewares?: Middleware[]
    devtools?: false | DevtoolsConfig
  }): Stapp<State, Api>

  <
    A1, S1, E1,
    A2, S2, E2,
    A3, S3, E3,
    A4, S4, E4,
    A5, S5, E5,
    A6, S6, E6,
    A7, S7, E7,
    A8, S8, E8,
    Extra extends E1 & E2 & E3 & E4 & E5 & E6 & E7 & E8,
    State extends S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8,
    Api extends A1 & A2 & A3 & A4 & A5 & A6 & A7 & A8
    >(config: {
    name?: string
    modules: [
      AnyModule<A1, S1, State, E1>,
      AnyModule<A2, S2, State, E2>,
      AnyModule<A3, S3, State, E3>,
      AnyModule<A4, S4, State, E4>,
      AnyModule<A5, S5, State, E5>,
      AnyModule<A6, S6, State, E6>,
      AnyModule<A7, S7, State, E7>,
      AnyModule<A8, S8, State, E8>
      ]
    dependencies?: Extra
    rehydrate?: Partial<State>
    middlewares?: Middleware[]
    devtools?: false | DevtoolsConfig
  }): Stapp<State, Api>

  <
    A1, S1, E1,
    A2, S2, E2,
    A3, S3, E3,
    A4, S4, E4,
    A5, S5, E5,
    A6, S6, E6,
    A7, S7, E7,
    A8, S8, E8,
    A9, S9, E9,
    Extra extends E1 & E2 & E3 & E4 & E5 & E6 & E7 & E8 & E9,
    State extends S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8 & S9,
    Api extends A1 & A2 & A3 & A4 & A5 & A6 & A7 & A8 & A9
    >(config: {
    name?: string
    modules: [
      AnyModule<A1, S1, State, E1>,
      AnyModule<A2, S2, State, E2>,
      AnyModule<A3, S3, State, E3>,
      AnyModule<A4, S4, State, E4>,
      AnyModule<A5, S5, State, E5>,
      AnyModule<A6, S6, State, E6>,
      AnyModule<A7, S7, State, E7>,
      AnyModule<A8, S8, State, E8>,
      AnyModule<A9, S9, State, E9>
      ]
    dependencies?: Extra
    rehydrate?: Partial<State>
    middlewares?: Middleware[]
    devtools?: false | DevtoolsConfig
  }): Stapp<State, Api>

  <
    A1, S1, E1,
    A2, S2, E2,
    A3, S3, E3,
    A4, S4, E4,
    A5, S5, E5,
    A6, S6, E6,
    A7, S7, E7,
    A8, S8, E8,
    A9, S9, E9,
    A10, S10, E10,
    Extra extends E1 & E2 & E3 & E4 & E5 & E6 & E7 & E8 & E9 & E10,
    State extends S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8 & S9 & S10,
    Api extends A1 & A2 & A3 & A4 & A5 & A6 & A7 & A8 & A9 & A10
    >(config: {
    name?: string
    modules:
      [
        AnyModule<A1, S1, State, E1>,
        AnyModule<A2, S2, State, E2>,
        AnyModule<A3, S3, State, E3>,
        AnyModule<A4, S4, State, E4>,
        AnyModule<A5, S5, State, E5>,
        AnyModule<A6, S6, State, E6>,
        AnyModule<A7, S7, State, E7>,
        AnyModule<A8, S8, State, E8>,
        AnyModule<A9, S9, State, E9>,
        AnyModule<A10, S10, State, E10>
        ]
    dependencies?: Extra
    rehydrate?: Partial<State>
    middlewares?: Middleware[]
    devtools?: false | DevtoolsConfig
  }): Stapp<State, Api>
}
