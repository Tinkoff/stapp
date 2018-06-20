import { Reducer } from 'redux'

export const getInitialState = (reducer: Reducer<any>) =>
  // @ts-ignore
  reducer(undefined, { type: '@@init' })
