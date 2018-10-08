import {
  dangerouslyReplaceState,
  dangerouslyResetState
} from '../../events/dangerous'
import { combineReducers } from '../../helpers/combineReducers/combineReducers'
import { ReducerFunction, ReducersMap } from '../createReducer/createReducer.h'

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
 * @internal
 */
export function getRootReducer<State>(
  reducers: ReducersMap<State>,
  initialState: Partial<State>
): ReducerFunction<State> {
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
