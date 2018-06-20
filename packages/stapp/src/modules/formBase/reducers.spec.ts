import { getInitialState } from '../../helpers/testHelpers/getInitialState/getInitialState'
import { setActive, setError, setReady, setSubmitting, setTouched, setValue } from './events'
import { createFormBaseReducers } from './reducers'

describe('formBase reducers', () => {
  const { values, errors, touched, ready, active, submitting } = createFormBaseReducers({})
  const cases = [
    {
      name: 'values',
      reducer: values,
      payload: { test: 123 },
      event: setValue
    },
    {
      name: 'errors',
      reducer: errors,
      payload: { test: 'testError' },
      event: setError
    },
    {
      name: 'touched',
      reducer: touched,
      payload: { test: true },
      event: setTouched
    },
    {
      name: 'ready',
      reducer: ready,
      payload: { test: true },
      event: setReady
    },
    {
      name: 'active',
      reducer: active,
      payload: 'test',
      event: setActive
    },
    {
      name: 'submitting',
      reducer: submitting,
      payload: false,
      event: setSubmitting
    }
  ]

  cases.forEach((t) => {
    const { name, reducer, payload, event }: any = t
    const initialState = getInitialState(reducer)

    it(`should process it's event: ${name}`, () => {
      expect(reducer(initialState, event(payload))).toEqual(payload)
    })

    it('should return same state if nothing changed', () => {
      const state = reducer(initialState, event(payload))

      expect(reducer(state, event(payload))).toBe(state)
    })
  })

  test('errors reducer should handle setValue event', () => {
    const initialState = getInitialState(errors)
    const error = { test: 'testError' }
    const value = { test: 123 }
    const expected = { test: false }
    const nextState = errors(initialState, setError(error))

    expect(errors(nextState, setValue(value))).toEqual(expected)
  })

  test('dirty reducer', () => {
    const { dirty } = createFormBaseReducers({
      name: 'Batman',
      age: 49
    })

    const initialState = getInitialState(dirty)

    expect(!!initialState.name).toBe(false)
    expect(!!initialState.age).toBe(false)

    const stateA = dirty(
      initialState,
      setValue({
        name: 'Joker',
        username: 'Bane'
      })
    )

    expect(!!stateA.name).toBe(true)
    expect(!!stateA.age).toBe(false)
    expect(!!stateA.username).toBe(true)

    const stateB = dirty(
      stateA,
      setValue({
        name: 'Batman',
        username: '',
        age: 50
      })
    )

    expect(!!stateB.name).toBe(false)
    expect(!!stateB.age).toBe(true)
    expect(!!stateB.username).toBe(false)
  })
})
