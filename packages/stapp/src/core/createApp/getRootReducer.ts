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
export const getRootReducer = <State>(
  reducers: { [K in keyof State]: Reducer<State[K]> },
  initialState: Partial<State>
): Reducer<State> => {
  const rootReducer = combineReducers<State>(reducers)

  return (oldState: any, event) => {
    let state = oldState

    if (event.type === dangerouslyReplaceStateType) {
      state = event.payload
    }

    if (event.type === dangerouslyResetStateType) {
      state = initialState
    }

    return rootReducer(state, event)
  }
}
