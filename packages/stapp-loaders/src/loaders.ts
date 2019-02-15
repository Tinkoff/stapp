import { createSelector } from 'reselect'
import { createEvent, createReducer } from 'stapp'
import { LOADERS } from './constants'

// Models
// tslint:disable-next-line
import { Module, EventCreator1 } from 'stapp'
import { LoadersState } from './loaders.h'
// tslint:disable-next-line
import { OutputSelector } from 'reselect'

export const loaderStart = createEvent<string>(`${LOADERS}: Loading start`)
export const loaderEnd = createEvent<string>(`${LOADERS}: Loading end`)

const loadersReducer = createReducer<LoadersState>({})
  .on(loaderStart, (loadersState, name) =>
    loadersState[name]
      ? loadersState
      : {
          ...loadersState,
          [name]: true
        }
  )
  .on(loaderEnd, (loadersState, name) =>
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
