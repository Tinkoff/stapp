import shallowEqual from 'fbjs/lib/shallowEqual'
import { defer, EMPTY } from 'light-observable/observable'
import {
  auditTime,
  catchError,
  filter,
  map,
  skipRepeats,
  tap,
  timeout
} from 'light-observable/operators'
import { combineEpics, dangerouslyReplaceState } from 'stapp'
import { identity } from 'stapp/lib/helpers/identity/identity'
import { logError } from 'stapp/lib/helpers/logError/logError'
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
import { Epic, Module } from 'stapp/lib/core/createApp/createApp.h'
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
  const serialize: (data: any) => string = _serialize === false ? identity : defaultSerialize
  const deserialize = _serialize === false ? identity : defaultDeserialize
  const merge = stateReconciler || defaultMerge

  const clearStorage = () => {
    return storage.removeItem(storageKey)
  }

  let loaded = false

  const setEpic: Epic<State> = (_, state$) => {
    return state$.pipe(
      filter(() => loaded),
      throttle > 0 ? auditTime(throttle) : identity,
      map(pick(blackList, whiteList)),
      skipRepeats(shallowEqual),
      map(mapTransform(transforms)),
      tap((state) => {
        storage.setItem(storageKey, serialize(state)).catch((error) => logError(PERSIST, error))
      }),
      map(() => null)
    )
  }

  const getEpic: Epic<State> = (_, state$, { getState }) => {
    return defer(() => storage.getItem(storageKey)).pipe(
      tap(() => (loaded = true)),
      timeout(_timeout),
      filter(Boolean),
      map(deserialize),
      map(mapTransformRight(transforms)),
      map(pick(blackList, whiteList)),
      map((restoredState) => merge(restoredState, getState())),
      map(dangerouslyReplaceState),
      catchError((error) => {
        logError(PERSIST, error)
        return EMPTY
      })
    )
  }

  return {
    name: PERSIST,
    api: {
      clearStorage
    },
    epic: combineEpics([setEpic, getEpic])
  }
}
