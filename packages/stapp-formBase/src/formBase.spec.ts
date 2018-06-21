import { getInitialState } from 'stapp/lib/helpers/testHelpers/getInitialState/getInitialState'
import { formBase } from './formBase'

describe('formBase', () => {
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
