import { Reducer } from 'redux'

/**
 * @private
 */
export function getInitialState(reducer: Reducer<any>) {
  // @ts-ignore
  return reducer(undefined, { type: '@@init' })
}
