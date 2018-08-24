import { Observable } from 'light-observable'
import { EMPTY, merge } from 'light-observable/observable'
import { from as RxFrom, Observable as rxObservable } from 'rxjs'

// Models
import { Dispatch, Epic as StappEpic, Event } from 'stapp'

export type Epic<State> = (
  event$: rxObservable<Event<any, any>>,
  state$: rxObservable<State>,
  staticApi: {
    dispatch: Dispatch<State>
    getState(): State
  }
) => rxObservable<any> | void

const fromOrEmpty = <T>(stream: rxObservable<T> | void): Observable<T> => {
  if (!stream) {
    return EMPTY
  }
  return Observable.from(stream as any)
}

/**
 * @deprecated since version 2.3.0. Will be removed in 2.5.0
 * To convert es observables to rxjs use `setObservableConfig(observableConfig)`.
 * To combine rxjs epics use standard combineEpics from 'stapp' package.
 *
 * @param epics
 */
export function combineEpics(epics: Array<Epic<any>>): StappEpic<any> {
  if (!epics.length) {
    return () => EMPTY
  }

  return (event$, state$, staticApi): Observable<any> => {
    const rxEvent$: any = RxFrom(event$)
    const rxState$: any = RxFrom(state$)

    if (epics.length === 1) {
      return fromOrEmpty(epics[0](rxEvent$, rxState$, staticApi))
    }

    const streams = epics.map((epic) =>
      fromOrEmpty(epic(rxEvent$, rxState$, staticApi))
    )
    return (merge as any)(...streams)
  }
}
