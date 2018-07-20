import { Observable } from 'light-observable'
import { createSubject, forEach } from 'light-observable/observable'
import { applyMiddleware, compose, createStore, Middleware, Store } from 'redux'
import { SOURCE_MODULE } from '../../helpers/constants'
import { isEvent } from '../../helpers/is/isEvent/isEvent'
import { isSubscribable } from '../../helpers/is/isSubscribable/isSubscribable'
import { Event } from '../createEvent/createEvent.h'
import { Dispatch } from './createApp.h'
import { getRootReducer } from './getRootReducer'

/**
 * @private
 */
const getReduxEnhancer = (appName: string) => {
  if (
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' && // tslint:disable-line strict-type-predicates
    typeof (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'function'
  ) {
    return (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      name: appName
    })
  }

  return compose
}

/**
 * @private
 */
const addMeta = (name: string, event: Event<any, any>) => {
  event.meta = event.meta || {}
  event.meta[SOURCE_MODULE] = name
}

/**
 * @private
 * @internal
 */
export const getStore = <State>(
  appName: string,
  reducers: any,
  initialState: Partial<State>,
  middlewares: Middleware[]
): {
  state$: Observable<State>
  event$: Observable<Event<any, any>>
  createDispatch: (moduleName: string) => Dispatch<State>
  flushQueue: () => void
  getState: () => State
} => {
  let initializing = true
  let queue: Array<Event<any, any>> | null = []
  const store: Store<State> = createStore(
    getRootReducer(reducers, initialState),
    initialState as any,
    getReduxEnhancer(appName)(applyMiddleware(...middlewares))
  )

  const state$ = Observable.from<State>(store as any)
  const [event$, eventInput$] = createSubject<Event<any, any>>()

  const createDispatch = (moduleName: string) => {
    const dispatch: Dispatch<State> = (event?: any) => {
      if (event == null) {
        return event
      }

      if (isEvent(event)) {
        addMeta(moduleName, event)
        if (initializing) {
          queue!.push(event)
          return event
        }

        const result = store.dispatch(event)
        eventInput$.next(event)
        return result
      }

      if (isSubscribable(event)) {
        return forEach(dispatch, event)
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

  return {
    state$,
    event$,
    createDispatch,
    flushQueue,
    getState: store.getState
  }
}
