import { combineReducers, Reducer } from 'redux'
import { dangerouslyReplaceState, dangerouslyResetState } from '../../events/dangerous'
import { merge } from '../merge/merge'

// Models
import { Module } from '../../core/createApp/createApp.h'

/**
 * @private
 */
const dangerouslyReplaceStateType = dangerouslyReplaceState.getType()

/**
 * @private
 */
const dangerouslyResetStateType = dangerouslyResetState.getType()

/**
 * Creates root reducer with some superpowers.
 * And remember, Pete, great power comes with great responsibility.
 * @param {Array<Module<any, any, any>>} modules
 * @returns {Reducer<any>}
 * @private
 */
export const getReducer = (modules: Array<Module<any, any, any>>): Reducer<any> => {
  const rootReducer = combineReducers(merge(['reducers', 'state'], modules))

  return (oldState, event) => {
    let state = oldState

    if (event.type === dangerouslyReplaceStateType) {
      state = event.payload
    }

    if (event.type === dangerouslyResetStateType) {
      state = {}
    }

    return rootReducer(state, event)
  }
}
