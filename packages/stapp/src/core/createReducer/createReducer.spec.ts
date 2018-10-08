import { bindActionCreators, createStore } from 'redux'
import { combineReducers } from '../../helpers/combineReducers/combineReducers'
import { identity } from '../../helpers/identity/identity'
import { isEvent } from '../../helpers/is/isEvent/isEvent'
import { createEvent } from '../createEvent/createEvent'
import { createReducer } from './createReducer'

describe('createReducer', () => {
  it('should create a valid reducer', () => {
    const increment = createEvent()
    const add = createEvent<number>()

    const firstReducer = createReducer(0, {
      [increment.getType()]: (state) => state + 1,
      [add.getType()]: (state, payload) => state + payload
    })

    expect(typeof firstReducer).toBe('function')
  })

  it('should return the default state with wrong or empty event', () => {
    const defaultState = 0
    const reducer: any = createReducer(defaultState, {})

    expect(reducer()).toEqual(defaultState)
    expect(reducer(undefined)).toEqual(defaultState)
    expect(reducer(undefined, {})).toEqual(defaultState)
    expect(reducer(undefined, null)).toEqual(defaultState)
    expect(reducer(undefined, undefined)).toEqual(defaultState)
    expect(reducer(undefined, { type: 1 })).toEqual(defaultState)
    expect(reducer(undefined, { type: '' })).toEqual(defaultState)
    expect(reducer(undefined, { type: true })).toEqual(defaultState)
    expect(reducer(undefined, { type: null })).toEqual(defaultState)
    expect(reducer(undefined, { type: undefined })).toEqual(defaultState)
    expect(reducer(undefined, { type: {} })).toEqual(defaultState)
  })

  it('should update a store', () => {
    const increment = createEvent()
    const add = createEvent<number>()

    const firstReducer = createReducer(0, {
      [increment.getType()]: (state) => state + 1,
      [add.getType()]: (state, payload) => state + payload
    })

    const store = createStore(firstReducer, 0)
    store.dispatch(increment())
    expect(store.getState()).toEqual(1)
    store.dispatch(increment())
    expect(store.getState()).toEqual(2)
    store.dispatch(add(40))
    expect(store.getState()).toEqual(42)
  })

  it('should support on and off methods', () => {
    const reducer = createReducer(0, {})
    const store = createStore(reducer)
    const inc = createEvent()
    const bindedInc = bindActionCreators(inc, store.dispatch)

    reducer.on(inc, (state) => state + 1)

    bindedInc()
    expect(store.getState()).toEqual(1)
    bindedInc()
    expect(store.getState()).toEqual(2)
    bindedInc()
    expect(store.getState()).toEqual(3)

    reducer.off(inc)

    bindedInc()
    expect(store.getState()).toEqual(3)
    bindedInc()
    expect(store.getState()).toEqual(3)
  })

  it('should accept arrays in on, off and reset methods', () => {
    const reducer = createReducer(0, {})
    const store = createStore(reducer)
    const inc = createEvent()
    const inc2 = createEvent()
    const reset = createEvent()
    const reset2 = createEvent()

    reducer.on([inc, inc2], (state) => state + 1)
    reducer.reset([reset, reset2])

    store.dispatch(inc())
    store.dispatch(inc())
    store.dispatch(inc2())
    store.dispatch(inc2())
    expect(store.getState()).toEqual(4)

    store.dispatch(reset())
    expect(store.getState()).toEqual(0)

    reducer.off([inc, inc2])

    store.dispatch(inc())
    expect(store.getState()).toEqual(0)

    store.dispatch(inc2())
    expect(store.getState()).toEqual(0)
  })

  it('should chain on, off and reset methods', () => {
    const inc = createEvent()
    const dec = createEvent()
    const reset = createEvent()
    const add = createEvent<number>()
    const reducer = createReducer(0, {})
      .on(inc, (state) => state + 1)
      .on(dec, (state) => state - 1)
      .on(add, (state, payload) => state + payload)
      .off(add)
      .reset(reset)

    const store = createStore(reducer)

    store.dispatch(inc())
    expect(store.getState()).toEqual(1)

    store.dispatch(inc())
    expect(store.getState()).toEqual(2)

    store.dispatch(dec())
    expect(store.getState()).toEqual(1)

    store.dispatch(add(3))
    expect(store.getState()).toEqual(1)

    store.dispatch(reset())
    expect(store.getState()).toEqual(0)
  })

  it('should support meta', () => {
    const add = createEvent('test', identity, (arg: number) => arg * 2)
    const reducer = createReducer(0, {
      [add.getType()]: (state, payload, meta) => state + payload * meta
    })
    const store = createStore(reducer)
    const bindedAdd = bindActionCreators(add, store.dispatch)

    bindedAdd(3)
    expect(store.getState()).toEqual(18)
  })

  it('should support empty handlers', () => {
    const event = createEvent()
    const reducer = createReducer({})
    const store = createStore(reducer)
    store.dispatch(event())
    expect(store.getState()).toEqual({})
  })

  it('should test if it has a handler', () => {
    const a1 = createEvent()
    const a2 = createEvent()
    const reducer = createReducer(0, {
      [a1.getType()]: () => 1,
      [a2.getType()]: () => 2
    })

    expect(reducer.has(a1)).toBe(true)
    expect(reducer.has(a2)).toBe(true)

    reducer.off(a2)

    expect(reducer.has(a1)).toBe(true)
    expect(reducer.has(a2)).toBe(false)

    reducer.off(a1)

    expect(reducer.has(a1)).toBe(false)
    expect(reducer.has(a2)).toBe(false)

    reducer.on(a2, () => 2)

    expect(reducer.has(a1)).toBe(false)
    expect(reducer.has(a2)).toBe(true)
  })

  it('should create eventCreators', () => {
    const reducer = createReducer(0)
    const actions = reducer.createEvents({
      add: (state: number, payload: number) => state + payload
    })

    expect(typeof actions.add).toBe('function')
    expect(isEvent(actions.add(1))).toBe(true)

    expect(reducer(0, actions.add(2))).toBe(2)
  })

  it('should be compatible', () => {
    const TYPE = 'TYPE'
    const a1 = () => ({ type: TYPE })
    const a2 = createEvent()

    const reducer1 = createReducer(0, {
      [TYPE]: () => 1,
      [a2.getType()]: () => 2
    })

    const reducer2 = createReducer(0)
      .on(TYPE, () => 1)
      .on(a2, () => 2)

    function reducer3(state = 0, event: any) {
      switch (event.type) {
        case TYPE:
          return 1

        case a2.getType():
          return 2

        default:
          return state
      }
    }

    const store = createStore(
      combineReducers({
        one: reducer1,
        two: reducer2,
        three: reducer3
      })
    )

    expect(reducer1.has(TYPE)).toBe(true)
    expect(reducer1.has(a2)).toBe(true)
    expect(reducer2.has(TYPE)).toBe(true)
    expect(reducer2.has(a2)).toBe(true)

    expect(store.getState()).toEqual({ one: 0, two: 0, three: 0 })
    store.dispatch(a1())
    expect(store.getState()).toEqual({ one: 1, two: 1, three: 1 })
    store.dispatch(a1())
    expect(store.getState()).toEqual({ one: 1, two: 1, three: 1 })
    store.dispatch(a2())
    expect(store.getState()).toEqual({ one: 2, two: 2, three: 2 })

    reducer1.off(TYPE)
    reducer2.off(TYPE)
    store.dispatch(a1())
    expect(store.getState()).toEqual({ one: 2, two: 2, three: 1 })

    reducer1.on(TYPE, () => 3)
    reducer2.on(TYPE, () => 3)
    store.dispatch(a1())
    expect(store.getState()).toEqual({ one: 3, two: 3, three: 1 })
  })
})
