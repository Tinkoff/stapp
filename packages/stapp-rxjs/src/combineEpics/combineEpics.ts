import { Observable, Subscribable } from 'light-observable'
import { EMPTY, merge } from 'light-observable/observable'
import { from as RxFrom } from 'rxjs'

// Models
import { Epic } from 'stapp'

const fromOrEmpty = <T>(stream: Subscribable<T> | void): Observable<T> => {
  return Observable.from(stream || EMPTY)
}

export function combineEpics<S>(epics: [Epic<S>]): Epic<S>
export function combineEpics<S1, S2>(epics: [Epic<S1>, Epic<S2>]): Epic<S1 & S2>
export function combineEpics<S1, S2, S3>(
  epics: [Epic<S1>, Epic<S2>, Epic<S3>]
): Epic<S1 & S2 & S3>
export function combineEpics<S1, S2, S3, S4>(
  epics: [Epic<S1>, Epic<S2>, Epic<S3>, Epic<S4>]
): Epic<S1 & S2 & S3 & S4>
export function combineEpics<S1, S2, S3, S4, S5>(
  epics: [Epic<S1>, Epic<S2>, Epic<S3>, Epic<S4>, Epic<S5>]
): Epic<S1 & S2 & S3 & S4 & S5>
export function combineEpics<S1, S2, S3, S4, S5, S6>(
  epics: [Epic<S1>, Epic<S2>, Epic<S3>, Epic<S4>, Epic<S5>, Epic<S6>]
): Epic<S1 & S2 & S3 & S4 & S5 & S6>
export function combineEpics(epics: Array<Epic<any>>): Epic<any> {
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
