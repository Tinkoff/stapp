import { createSubject, forEach, Observable, pipe, Subscription } from 'light-observable'
import { StoreEnhancer } from 'redux'
import { Dispatch, Epic } from '../../core/createApp/createApp.h'
import { Event } from '../../core/createEvent/createEvent.h'
import { epicEnd } from '../../events/epicEnd'
import { isEvent } from '../../helpers/isEvent/isEvent'
import { isSubscribable } from '../../helpers/isSubscribable/isSubscribable'

/**
 * Used to pass a stream of state to the middleware. Also, allows to dispatch observables instead of events.
 * @typeparam State Application state shape
 * @param rootEpic
 * @private
 */
export const createStateStreamEnhancer = <State>(rootEpic: Epic<State>) => {
  const [event$, eventInput$] = createSubject<Event<any, any>>()

  const [epic$, epicInput$] = createSubject<Epic<State>>()
  let dispatch: Dispatch<State>

  const stateStreamEnhancer: StoreEnhancer<State> = (createStore) => {
    return (reducer, preloadedState) => {
      const store = createStore(reducer, preloadedState)
      const state$ = Observable.from(store as any)
      const callNextEpic = (nextEpic: Epic<State>) => nextEpic(event$, state$)
      let epicSubscription: Subscription

      dispatch = (event?: any) => {
        if (!event) {
          return undefined
        }

        if (isEvent<{}, any>(event)) {
          const result = store.dispatch(event)

          eventInput$.next(event)
          return result
        }

        if (isSubscribable(event)) {
          return pipe(forEach(dispatch))(event)
        }

        if (typeof event === 'function') {
          return event(store.getState, dispatch)
        }
      }

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
