import { getInitialState } from 'stapp/lib/helpers/testHelpers/getInitialState/getInitialState'
import {
  submit,
  setActive,
  setError,
  setReady,
  setSubmitting,
  setTouched,
  setValue
} from './events'
import { formBase } from './formBase'
import {
  fieldSelector,
  formSelector,
  isDirtySelector,
  isPristineSelector,
  isReadySelector,
  isValidSelector
} from './selectors'
import { createFormBaseReducers } from './reducers'

describe('formBase', () => {
  describe('module', () => {
    it('creates module with reducers and events', () => {
      const module = formBase()

      expect(typeof module.reducers).toBe('object')
      expect(typeof module.name).toBe('string')
    })

    it('accepts initial values', () => {
      const module = formBase({
        initialValues: {
          test: 123
        }
      })

      expect(getInitialState(module.reducers!.values)).toEqual({
        test: 123
      })
    })
  })

  describe('events', () => {
    test('submit event should always have empty payload', () => {
      expect(submit().payload).toEqual(undefined)

      // @ts-ignore
      expect(submit({ test: 123 }).payload).toEqual(undefined)

      // @ts-ignore
      expect(submit(123).payload).toEqual(undefined)
    })
  })

  describe('selectors', () => {
    test('isValidSelector', () => {
      const selector = isValidSelector()

      expect(
        selector({
          errors: {}
        })
      ).toEqual(true)

      expect(
        selector({
          errors: {
            test: 'some error'
          }
        })
      ).toEqual(false)
    })

    test('isReadySelector', () => {
      const selector = isReadySelector()

      expect(
        selector({
          ready: {}
        })
      ).toEqual(true)

      expect(
        selector({
          ready: {
            test: true
          }
        })
      ).toEqual(true)

      expect(
        selector({
          ready: {
            test: false
          }
        })
      ).toEqual(false)
    })

    test('isDirtySelector', () => {
      const selector = isDirtySelector()

      expect(
        selector({
          dirty: {}
        })
      ).toEqual(false)

      expect(
        selector({
          dirty: {
            test: true
          }
        })
      ).toEqual(true)

      expect(
        selector({
          dirty: {
            test: false
          }
        })
      ).toEqual(false)
    })

    test('isPristineSelector', () => {
      const selector = isPristineSelector()
      expect(
        selector({
          pristine: true
        })
      ).toBe(true)

      expect(
        selector({
          pristine: false
        })
      ).toBe(false)
    })

    test('fieldSelector', () => {
      expect(
        fieldSelector('test')({
          values: {
            test: 123
          },
          errors: {
            test: null
          },
          dirty: {
            test: false
          },
          touched: {}
        })
      ).toEqual({
        value: 123,
        error: null,
        touched: false,
        active: false,
        dirty: false
      })

      expect(
        fieldSelector('test')({
          values: {},
          errors: {
            test: 'Some error'
          },
          touched: {
            test: true
          },
          dirty: {
            test: true
          },
          active: 'test'
        })
      ).toEqual({
        value: undefined,
        error: 'Some error',
        touched: true,
        dirty: true,
        active: true
      })
    })

    test('formSelector', () => {
      const selector = formSelector()

      expect(
        selector({
          pristine: true,
          values: {
            test: 123
          },
          ready: {},
          errors: {
            test: null
          },
          dirty: {
            test: false
          },
          touched: {}
        })
      ).toEqual({
        submitting: false,
        valid: true,
        ready: true,
        dirty: false,
        pristine: true
      })

      expect(
        selector({
          pristine: true,
          values: {
            test: 123
          },
          ready: {},
          errors: {
            test: 'test'
          },
          dirty: {
            test: false
          },
          touched: {}
        })
      ).toEqual({
        submitting: false,
        valid: false,
        ready: true,
        dirty: false,
        pristine: true
      })

      expect(
        selector({
          pristine: false,
          values: {
            test: 123
          },
          ready: {},
          errors: {
            test: null
          },
          dirty: {
            test: false
          },
          touched: {}
        })
      ).toEqual({
        submitting: false,
        valid: true,
        ready: true,
        dirty: false,
        pristine: false
      })
    })
  })

  describe('reducers', () => {
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

    test('pristine reducer should react to any setValue or setTouched event', () => {
      const { pristine } = createFormBaseReducers({
        name: 'Batman'
      })

      const initialState = getInitialState(pristine)
      expect(initialState).toBe(true)

      // should set false on setValue
      const stateA = pristine(
        true,
        setValue({
          name: 'Jocker'
        })
      )
      expect(stateA).toBe(false)

      // should set false on setTouched
      const stateB = pristine(
        true,
        setTouched({
          name: true
        })
      )
      expect(stateB).toBe(false)

      const stateC = pristine(
        false,
        setValue({
          name: 'Batman'
        })
      )
      expect(stateC).toBe(false)
    })
  })
})
