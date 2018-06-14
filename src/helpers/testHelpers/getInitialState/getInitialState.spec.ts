import { createReducer } from '../../../core/createReducer/createReducer'
import { getInitialState } from './getInitialState'

describe('getInitialState', () => {
  it('should return initial state from reducer', () => {
    const initialState = { test: 123 }
    const reducer = createReducer(initialState)

    expect(getInitialState(reducer)).toBe(initialState)
  })
})
