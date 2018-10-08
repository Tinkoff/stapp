import { createStore } from 'redux'
import { createEvent } from '../../core/createEvent/createEvent'
import { createReducer } from '../../core/createReducer/createReducer'
import { combineReducers } from './combineReducers'

describe('combineReducers', () => {
  it('should combine reducers', () => {
    const increment = createEvent()
    const decrement = createEvent()
    const add = createEvent<number>()
    const sub = createEvent<number>()

    const firstReducer = createReducer(0, {
      [increment.getType()]: (state) => state + 1,
      [add.getType()]: (state, payload) => state + payload
    })

    const secondReducer = createReducer(42, {
      [decrement.getType()]: (state) => state - 1,
      [sub.getType()]: (state, payload) => state - payload
    })

    const ultimateReducer = combineReducers({
      up: firstReducer,
      down: secondReducer
    })

    const store = createStore(ultimateReducer)

    store.dispatch(increment())
    expect(store.getState()).toEqual({ up: 1, down: 42 })
    store.dispatch(increment())
    expect(store.getState()).toEqual({ up: 2, down: 42 })
    store.dispatch(decrement())
    expect(store.getState()).toEqual({ up: 2, down: 41 })
    store.dispatch(sub(30))
    expect(store.getState()).toEqual({ up: 2, down: 11 })
    store.dispatch(add(40))
    expect(store.getState()).toEqual({ up: 42, down: 11 })
    store.dispatch(decrement())
    expect(store.getState()).toEqual({ up: 42, down: 10 })
    store.dispatch(sub(10))
    expect(store.getState()).toEqual({ up: 42, down: 0 })
  })

  it('should combine nested reducers', () => {
    const increment = createEvent()
    const decrement = createEvent()
    const add = createEvent<number>()
    const sub = createEvent<number>()

    const firstReducer = createReducer(0, {
      [increment.getType()]: (state) => state + 1,
      [add.getType()]: (state, payload) => state + payload
    })

    const secondReducer = createReducer(42, {
      [decrement.getType()]: (state) => state - 1,
      [sub.getType()]: (state, payload) => state - payload
    })

    const ultimateReducer = combineReducers({
      nested: {
        nested: {
          nested: {
            up: firstReducer,
            down: secondReducer
          }
        }
      }
    })

    const store = createStore(ultimateReducer)

    store.dispatch(increment())
    expect(store.getState().nested.nested.nested).toEqual({ up: 1, down: 42 })
    store.dispatch(increment())
    expect(store.getState().nested.nested.nested).toEqual({ up: 2, down: 42 })
    store.dispatch(decrement())
    expect(store.getState().nested.nested.nested).toEqual({ up: 2, down: 41 })
    store.dispatch(sub(30))
    expect(store.getState().nested.nested.nested).toEqual({ up: 2, down: 11 })
    store.dispatch(add(40))
    expect(store.getState().nested.nested.nested).toEqual({ up: 42, down: 11 })
    store.dispatch(decrement())
    expect(store.getState().nested.nested.nested).toEqual({ up: 42, down: 10 })
    store.dispatch(sub(10))
    expect(store.getState().nested.nested.nested).toEqual({ up: 42, down: 0 })
  })
})
