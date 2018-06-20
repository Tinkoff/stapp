import isObservable from 'is-observable'
import { from } from 'rxjs/observable/from'
import { map } from 'rxjs/operators/map'
import { switchAll } from 'rxjs/operators/switchAll'
import { Subject } from 'rxjs/Subject'
import { isEvent } from '../../helpers/isEvent/isEvent'

// Events
import { epicEnd } from '../../events/epicEnd'

// Models
import { StoreEnhancer } from 'redux'
import { Observable } from 'rxjs/Observable'
import { Epic } from '../../core/createApp/createApp.h'
import { Event } from '../../core/createEvent/createEvent.h'

/**
 * Used to pass a stream of state to the middleware. Also, allows to dispatch observables instead of events.
 * @typeparam State Application state shape
 * @param rootEpic
 * @private
 */
export const createStateStreamEnhancer = <State>(rootEpic: Epic<State>) => {
  const eventInput$ = new Subject<Event<any, any>>()
  const event$ = from(eventInput$)
  const epic$ = new Subject<Epic<State>>()
  let dispatch: any // Dispatch<State>

  const stateStreamEnhancer: StoreEnhancer<State> = (createStore) => {
    return (reducer, preloadedState) => {
      const store = createStore(reducer, preloadedState)
      const state$: Observable<State> = from(store as any)
      const callNextEpic = (nextEpic: Epic<State>) => nextEpic(event$, state$)

      dispatch = (event: any) => {
        if (!event) {
          return
        }

        if (isEvent<{}, any>(event)) {
          const result = store.dispatch(event)

          eventInput$.next(event)
          return result
        }

        if (isObservable(event)) {
          return event.forEach(dispatch)
        }

        if (typeof event === 'function') {
          return event(store.getState, dispatch)
        }
      }

      epic$.pipe(map(callNextEpic), switchAll()).subscribe(dispatch)

      // Setup initial root epic
      epic$.next(rootEpic)

      return Object.assign({}, store, { dispatch })
    }
  }

  const replaceEpic = (newRootEpic: Epic<State>) => {
    // gives the previous root Epic a last chance
    // to do some clean up
    dispatch(epicEnd())
    // switches to the new root Epic, synchronously terminating
    // the previous one
    epic$.next(newRootEpic)
  }

  return {
    stateStreamEnhancer,
    replaceEpic
  }
}
