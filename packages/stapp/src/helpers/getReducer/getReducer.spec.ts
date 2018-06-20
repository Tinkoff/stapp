import { createEvent } from '../../core/createEvent/createEvent'
import { createReducer } from '../../core/createReducer/createReducer'
import { dangerouslyReplaceState, dangerouslyResetState } from '../../events/dangerous'
import { getReducer } from './getReducer'

describe('getReducer', () => {
  const event = createEvent()

  it('should create reducer from provided modules', () => {
    const moduleA = {
      name: 'test',
      reducers: {
        test: createReducer({}).on(event, () => ({ called: true }))
      }
    }

    const rootReducer = getReducer([moduleA])
    const state = rootReducer({}, event())

    expect(state).toEqual({
      test: {
        called: true
      }
    })
  })

  it('should provide ability to replace state', () => {
    const moduleA = {
      name: 'test',
      reducers: {
        test: createReducer({}).on(event, () => ({ called: true }))
      }
    }

    const rootReducer = getReducer([moduleA])
    const state = rootReducer({}, event())
    const newState = rootReducer(state, dangerouslyReplaceState({ test: { called: false } }))

    expect(newState).toEqual({
      test: {
        called: false
      }
    })
  })

  it('should provide ability to reset state', () => {
    const moduleA = {
      name: 'test',
      reducers: {
        test: createReducer({}).on(event, () => ({ called: true }))
      }
    }

    const rootReducer = getReducer([moduleA])
    const state = rootReducer({}, event())
    const newState = rootReducer(state, dangerouslyResetState())

    expect(newState).toEqual({
      test: {}
    })
  })
})
