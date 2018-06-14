import { createSelector } from 'reselect'
import { createEvent } from '../../core/createEvent/createEvent'
import { createReducer } from '../../core/createReducer/createReducer'
import { LOADERS } from './constants'

// Models
// tslint:disable-next-line no-unused-variable // needed for declarations
import { Observable } from 'rxjs/Observable'
import { Module } from '../../core/createApp/createApp.h'
import { LoadersState } from './loaders.h'

export const loaderStart = createEvent<string>(`${LOADERS}: Loading start`)
export const loaderEnd = createEvent<string>(`${LOADERS}: Loading end`)

const loadersReducer = createReducer<LoadersState>({})
  .on(
    loaderStart,
    (loadersState, name) =>
      loadersState[name]
        ? loadersState
        : {
            ...loadersState,
            [name]: true
          }
  )
  .on(
    loaderEnd,
    (loadersState, name) =>
      !loadersState[name]
        ? loadersState
        : {
            ...loadersState,
            [name]: false
          }
  )

export const isLoadingSelector = () =>
  createSelector(
    <State extends { loaders: LoadersState }>(state: State) => state.loaders,
    (loadersState) => Object.keys(loadersState).filter((name) => loadersState[name]).length > 0
  )

export const loaders = (): Module<{}, { loaders: LoadersState }> => ({
  name: 'loaders',
  state: {
    loaders: loadersReducer
  }
})
