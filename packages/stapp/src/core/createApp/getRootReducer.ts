import { combineReducers, Reducer } from 'redux'
import { dangerouslyReplaceState, dangerouslyResetState } from '../../events/dangerous'

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
 * @private
 */
export const getRootReducer = (reducers: {[K: string]: Reducer<any>}): Reducer<any> => {
  const rootReducer = combineReducers(reducers)

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
