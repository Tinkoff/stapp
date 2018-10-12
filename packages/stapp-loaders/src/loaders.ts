import { createSelector } from 'reselect'
import { createEvent, createReducer } from 'stapp'
import { LOADERS } from './constants'

// Models
import { Module } from 'stapp/lib/core/createApp/createApp.h'
import { LoadersState } from './loaders.h'
// tslint:disable-next-line
import { OutputSelector } from 'reselect'
// tslint:disable-next-line
import { EventCreator1 } from 'stapp/lib/core/createEvent/createEvent.h'

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
    <State extends { loaders?: LoadersState }>(state: State) =>
      state.loaders || {},
    (loadersState) =>
      Object.keys(loadersState).filter((name) => loadersState[name]).length > 0
  )

export const loaders = (): Module<{}, { loaders: LoadersState }> => ({
  name: LOADERS,
  state: {
    loaders: loadersReducer
  }
})
