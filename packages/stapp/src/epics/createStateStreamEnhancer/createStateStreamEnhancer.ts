import { pipe } from 'light-observable/helpers/pipe'
import { createSubject, EMPTY } from 'light-observable/observable'
import { forEach } from 'light-observable/operators'
import { epicEnd } from '../../events/epicEnd'
import { isEvent } from '../../helpers/is/isEvent/isEvent'
import { isSubscribable } from '../../helpers/is/isSubscribable/isSubscribable'

// Models
import { Observable, Subscribable, Subscription } from 'light-observable'
import { DeepPartial, Reducer, StoreEnhancerStoreCreator } from 'redux'
import { Dispatch, Epic } from '../../core/createApp/createApp.h'
import { Event } from '../../core/createEvent/createEvent.h'

/**
 * Used to pass a stream of state to the middleware. Also, allows to dispatch observables instead of events.
 * @typeparam State Application state shape
 * @param rootEpic
 * @private
 * @internal
 */
export function createStateStreamEnhancer<State>(rootEpic: Epic<State>) {
  const [event$, eventInput$] = createSubject<Event<any, any>>()

  const [epic$, epicInput$] = createSubject<Epic<State>>()
  let dispatch: Dispatch<State>

  const stateStreamEnhancer = (createStore: StoreEnhancerStoreCreator) => {
    return (reducer: Reducer<State, Event<any, any>>, preloadedState: DeepPartial<State>) => {
      const store = createStore(reducer, preloadedState)
      const state$ = Observable.from<State>(store as any)
      let epicSubscription: Subscription

      dispatch = (event?: any) => {
        if (!event) {
          return event
        }

        if (isEvent(event)) {
          const result = store.dispatch(event)

          eventInput$.next(event)
          return result
        }

        if (isSubscribable(event)) {
          return pipe(forEach(dispatch))(event)
        }

        // tslint:disable-next-line strict-type-predicates
        if (typeof event === 'function') {
          return event(store.getState, dispatch)
        }

        return event
      }

      const callNextEpic = (nextEpic: Epic<State>): Subscribable<any> =>
        nextEpic(event$, state$, {
          dispatch,
          getState: store.getState
        }) || EMPTY

      epic$.subscribe((epic) => {
        const nextEpic = callNextEpic(epic)
        epicSubscription && epicSubscription.unsubscribe()
        epicSubscription = nextEpic.subscribe(dispatch)
      })

      // Setup initial root epic
      epicInput$.next(rootEpic)

      return Object.assign({}, store, { dispatch })
    }
  }

  const replaceEpic = (newRootEpic: Epic<State>) => {
    // gives the previous root Epic a last chance
    // to do some clean up
    dispatch(epicEnd())
    // switches to the new root Epic, synchronously terminating
    // the previous one
    epicInput$.next(newRootEpic)
  }

  return {
    stateStreamEnhancer,
    replaceEpic
  }
}
