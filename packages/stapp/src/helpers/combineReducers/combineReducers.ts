import { combineReducers as reduxCombine } from 'redux'
import {
  ReducerFunction,
  ReducersMap
} from '../../core/createReducer/createReducer.h'

export const combineReducers = <State>(
  reducers: ReducersMap<State>
): ReducerFunction<State> => {
  const keys = Object.keys(reducers)
  const result: any = {}

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const element = (reducers as any)[key]

    if (typeof element === 'function') {
      result[key] = element
    }

    if (typeof element === 'object' && element !== null) {
      result[key] = combineReducers(element)
    }
  }

  return reduxCombine(result)
}
