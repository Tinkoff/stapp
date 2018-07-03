// Models
import { EMPTY, merge, Subscribable } from 'light-observable'
import { Epic } from '../../core/createApp/createApp.h'

/**
 * Combines epics into one
 * @param epics An array of epics to combine
 * @returns {Epic}
 */
// prettier-ignore
export const combineEpics = <
  S1, S2, S3, S4, S5, S6, S7, S8, S9, S10,
  State = S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8 & S9 & S10
>(epics:
    [
      Epic<S1>
    ] |  [
      Epic<S1>, Epic<S2>
    ] | [
      Epic<S1>, Epic<S2>,
      Epic<S3>
    ] | [
      Epic<S1>, Epic<S2>,
      Epic<S3>, Epic<S4>
    ] | [
      Epic<S1>, Epic<S2>,
      Epic<S3>, Epic<S4>,
      Epic<S5>
    ] | [
      Epic<S1>, Epic<S2>,
      Epic<S3>, Epic<S4>,
      Epic<S5>, Epic<S6>
    ] | [
      Epic<S1>, Epic<S2>,
      Epic<S3>, Epic<S4>,
      Epic<S5>, Epic<S6>,
      Epic<S7>
    ] | [
      Epic<S1>, Epic<S2>,
      Epic<S3>, Epic<S4>,
      Epic<S5>, Epic<S6>,
      Epic<S7>, Epic<S8>
    ] | [
      Epic<S1>, Epic<S2>,
      Epic<S3>, Epic<S4>,
      Epic<S5>, Epic<S6>,
      Epic<S7>, Epic<S8>,
      Epic<S9>
    ] | [
      Epic<S1>, Epic<S2>,
      Epic<S3>, Epic<S4>,
      Epic<S5>, Epic<S6>,
      Epic<S7>, Epic<S8>,
      Epic<S9>, Epic<S10>
    ]
): Epic<State> => {
  if (!epics.length) {
    return () => EMPTY
  }

  if (epics.length === 1) {
    return epics[0] as Epic<State>
  }

  return (event$, state$): Subscribable<any> => {
    const streams = (epics as any).map((epic: Epic<State>) => epic(event$, state$))
    return (merge as any)(...streams.slice(1))(streams[0])
  }
}
