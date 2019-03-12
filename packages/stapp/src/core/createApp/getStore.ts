import { applyMiddleware, compose, createStore, Middleware, Store } from 'redux'
import { from, Observable, Subject } from 'rxjs'
import { SOURCE } from '../../helpers/constants'
import { isEvent } from '../../helpers/is/isEvent/isEvent'
import { isSubscribable } from '../../helpers/is/isSubscribable/isSubscribable'
import { Event } from '../createEvent/createEvent.h'
import { DevtoolsConfig, Dispatch } from './createApp.h'
import { getRootReducer } from './getRootReducer'

/**
 * @private
 */
const defaultEnableDevTools = () => process.env.NODE_ENV !== 'production'

const getReduxEnhancer = (config: false | DevtoolsConfig) => {
  if (!config) {
    return compose
  }

  const { enableDevTools = defaultEnableDevTools } = config

  if (
    enableDevTools() &&
    typeof window === 'object' && // tslint:disable-line strict-type-predicates
    typeof (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'function'
  ) {
    return (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(config)
  }

  return compose
}

/**
 * @private
 */
const updateMeta = (name: string, event: Event<any, any>) => {
  event.meta = event.meta || {}
  event.meta[SOURCE] = (event.meta[SOURCE] || []).concat(name)
}

/**
 * @private
 * @internal
 */
export const getStore = <State>(
  reducers: any,
  initialState: Partial<State>,
  middlewares: Middleware[],
  devtools: false | DevtoolsConfig
): {
  state$: Observable<State>
  event$: Observable<Event<any, any>>
  createDispatch: (moduleName: string) => Dispatch<State>
  flushQueue: () => void
  getState: () => State
  disconnect: () => void
} => {
  let initializing = true
  let queue: Array<Event<any, any>> | null = []
  let completed = false
  const store: Store<State> = createStore(
    getRootReducer(reducers, initialState),
    initialState as any,
    getReduxEnhancer(devtools)(applyMiddleware(...middlewares))
  )

  const state$ = from<State>(store as any)
  const eventInput$ = new Subject<Event<any, any>>()
  const event$ = from(eventInput$)

  const createDispatch = (moduleName: string) => {
    const dispatch: Dispatch<State> = (event?: any) => {
      if (completed) {
        return
      }

      if (event == null) {
        return event
      }

      if (isEvent(event)) {
        updateMeta(moduleName, event)
        if (initializing) {
          queue!.push(event)
          return event
        }

        const result = store.dispatch(event)
        eventInput$.next(event)
        return result
      }

      if (isSubscribable(event)) {
        return new Promise((resolve, reject) =>
          event.subscribe({
            next: dispatch,
            complete: resolve,
            error: reject
          })
        )
      }

      // tslint:disable-next-line strict-type-predicates
      if (typeof event === 'function') {
        return event(store.getState, dispatch)
      }

      return event
    }

    return dispatch
  }

  const flushQueue = () => {
    initializing = false
    for (const event of queue!) {
      store.dispatch(event)
      eventInput$.next(event)
    }

    queue = null
  }

  const disconnect = () => {
    eventInput$.complete()
    completed = true
  }

  return {
    state$,
    event$,
    getState: store.getState,
    createDispatch,
    flushQueue,
    disconnect
  }
}
