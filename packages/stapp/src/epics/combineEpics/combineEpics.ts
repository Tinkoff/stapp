import { Observable } from 'light-observable'
import { EMPTY, merge } from 'light-observable/observable'

// Models
import { Epic } from '../../core/createApp/createApp.h'

export function combineEpics<S>(epics: [Epic<S>]): Epic<S>
export function combineEpics<S1, S2>(epics: [Epic<S1>, Epic<S2>]): Epic<S1 & S2>
export function combineEpics<S1, S2, S3>(epics: [Epic<S1>, Epic<S2>, Epic<S3>]): Epic<S1 & S2 & S3>
export function combineEpics<S1, S2, S3, S4>(
  epics: [Epic<S1>, Epic<S2>, Epic<S3>, Epic<S4>]
): Epic<S1 & S2 & S3 & S4>
export function combineEpics<S1, S2, S3, S4, S5>(
  epics: [Epic<S1>, Epic<S2>, Epic<S3>, Epic<S4>, Epic<S5>]
): Epic<S1 & S2 & S3 & S4 & S5>
export function combineEpics(epics: Array<Epic<any>>): Epic<any> {
  if (!epics.length) {
    return () => EMPTY
  }

  if (epics.length === 1) {
    return epics[0]
  }

  return (event$, state$, staticApi): Observable<any> => {
    const streams = epics.map((epic) => epic(event$, state$, staticApi) || EMPTY)
    return (merge as any)(...streams)
  }
}
