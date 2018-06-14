import shallowEqual from 'fbjs/lib/shallowEqual'
import { empty } from 'rxjs/observable/empty'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { catchError } from 'rxjs/operators/catchError'
import { debounceTime } from 'rxjs/operators/debounceTime'
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged'
import { filter } from 'rxjs/operators/filter'
import { map } from 'rxjs/operators/map'
import { mergeMapTo } from 'rxjs/operators/mergeMapTo'
import { switchMap } from 'rxjs/operators/switchMap'
import { timeout } from 'rxjs/operators/timeout'
import { withLatestFrom } from 'rxjs/operators/withLatestFrom'
import { combineEpics } from '../../epics/combineEpics/combineEpics'
import { dangerouslyReplaceState } from '../../events/dangerous'
import { identity } from '../../helpers/identity/identity'
import { logError } from '../../helpers/logError/logError'
import { DEFAULT_TIMEOUT, PERSIST } from './constants'
import {
  defaultDeserialize,
  defaultMerge,
  defaultSerialize,
  mapTransform,
  mapTransformRight,
  pick
} from './helpers'

// Models
// tslint:disable-next-line no-unused-variable // Needed for declarations
import { Observable } from 'rxjs/Observable'
import { Epic, Module } from '../../core/createApp/createApp.h'
import { PersistConfig } from './persist.h'

/**
 * Persistence module.
 * @typeparam State Application state shape
 * @param config Configuration object
 * @param config.key Key, used to store data in a storage.
 * @param config.storage Storage to use.
 * @returns Module
 */
export const persist = <State>({
  key,
  storage,
  blackList,
  whiteList,
  transforms = [],
  throttle = 0,
  serialize: _serialize,
  stateReconciler,
  timeout: _timeout = DEFAULT_TIMEOUT
}: PersistConfig): Module<
  {
    clearStorage: () => void
  },
  {}
> => {
  const storageKey = `${PERSIST}:${key}`
  const serialize = _serialize === false ? identity : defaultSerialize
  const deserialize = _serialize === false ? identity : defaultDeserialize
  const merge = stateReconciler || defaultMerge

  const clearStorage = () => {
    return storage.removeItem(storageKey)
  }

  const setEpic: Epic<State> = (_, state$) =>
    state$.pipe(
      debounceTime(throttle),
      map(pick(blackList, whiteList)),
      distinctUntilChanged(shallowEqual),
      map(mapTransform(transforms)),
      switchMap((data) =>
        storage
          .setItem(storageKey, (serialize as any)(data))
          .catch((error) => logError(PERSIST, error))
      ),
      mergeMapTo(empty())
    )

  const getEpic: Epic<State> = (_, state$) =>
    fromPromise(storage.getItem(storageKey)).pipe(
      timeout(_timeout),
      filter(Boolean),
      map(deserialize),
      map(mapTransformRight(transforms)),
      map(pick(blackList, whiteList)),
      withLatestFrom(state$),
      map(([restoredState, currentState]) => merge(restoredState, currentState)),
      map(dangerouslyReplaceState),
      catchError((error) => {
        logError(PERSIST, error)
        return empty()
      })
    )

  return {
    name: PERSIST,
    api: {
      clearStorage
    },
    epic: combineEpics([setEpic, getEpic])
  }
}
