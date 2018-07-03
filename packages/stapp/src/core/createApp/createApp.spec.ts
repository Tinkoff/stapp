import { EMPTY } from 'light-observable'
import { compose, Middleware } from 'redux'
import { dangerouslyReplaceState, dangerouslyResetState } from '../../events/dangerous'
import { createEvent } from '../createEvent/createEvent'
import { createReducer } from '../createReducer/createReducer'
import { createApp } from './createApp'
import { Epic } from './createApp.h'

describe('createApp', () => {
  const mockReducer = createReducer({})

  it('should create an app', () => {
    const m1 = {
      name: 'm1',
      reducers: { mockReducer }
    }

    const app = createApp({
      name: 'test',
      modules: [m1]
    })

    expect(app.api).toEqual({})
    expect(typeof app.subscribe).toBe('function')
  })

  it('should call module factory with passed extraArgument', () => {
    const module = jest.fn()
    module.mockReturnValue({
      name: 'test',
      reducers: { mockReducer }
    })

    const extraValue = { test: 123 }

    createApp({
      name: 'test',
      modules: [module],
      dependencies: extraValue
    })

    expect(module).toBeCalledWith(extraValue)
  })

  it("should throw if passed module doesn't have a name", () => {
    const module = {}
    const moduleFactory = () => ({})

    expect(() => createApp({ modules: [module as any] })).toThrow()
    expect(() => createApp({ modules: [moduleFactory] })).toThrow()
  })

  it('should check dependencies', () => {
    const moduleA = {
      name: 'testA',
      reducers: { a: mockReducer },
      dependencies: ['testB']
    }

    const moduleB = {
      name: 'testB',
      reducers: { b: mockReducer },
      dependencies: ['testC']
    }

    const circular = {
      name: 'testC',
      reducers: { c: mockReducer },
      dependencies: ['testA', 'testB']
    }

    expect(() => createApp({ modules: [moduleA, moduleB] })).toThrow()
    expect(() => createApp({ modules: [moduleA, moduleB, circular] })).not.toThrow()
  })

  it('should collect api from passed modules', () => {
    const m1 = {
      name: 'm1',
      events: {
        a1: createEvent()
      },
      reducers: { mockReducer }
    }

    const m2 = {
      name: 'm2',
      events: {
        a2: createEvent()
      }
    }

    const app = createApp({
      name: 'test',
      modules: [m1, m2]
    })

    expect(typeof app.api.a1).toBe('function')
    expect(typeof app.api.a2).toBe('function')
  })

  it('should support nested api', () => {
    const m1 = {
      name: 'm1',
      events: {
        a1: {
          a11: createEvent(),
          a12: createEvent()
        }
      },
      reducers: { mockReducer }
    }

    const m2 = {
      name: 'm2',
      events: {
        a2: createEvent()
      }
    }

    const app = createApp({
      name: 'test',
      modules: [m1, m2]
    })

    expect(typeof app.api.a1.a11).toBe('function')
    expect(typeof app.api.a1.a12).toBe('function')
    expect(typeof app.api.a2).toBe('function')
  })

  test('collected api should work', () => {
    const a1 = createEvent<number>()
    const r1 = createReducer(0).on(a1, (_, payload) => payload)
    const m1 = {
      name: 'm1',
      api: { a1 },
      state: { r1 }
    }

    const app = createApp({
      modules: [m1]
    })

    expect(app.getState().r1).toEqual(0)

    app.api.a1(1)
    expect(app.getState().r1).toEqual(1)
  })

  it('should work with provided epics', () => {
    const events = jest.fn()
    const state = jest.fn()
    const m1: { epic: Epic<any>; name: string; state: any } = {
      name: 'm1',
      state: { m: mockReducer },
      epic: (event$, state$) => {
        event$.subscribe(events)
        state$.subscribe(state)

        return EMPTY
      }
    }

    const app = createApp({
      modules: [m1]
    })

    // Ignore initializing events
    const eventsInitialLength = events.mock.calls.length
    const stateInitialLength = state.mock.calls.length

    app.dispatch({ type: 'test' })
    expect(events.mock.calls).toHaveLength(1 + eventsInitialLength)
    expect(state.mock.calls).toHaveLength(1 + stateInitialLength)
    expect(events.mock.calls[events.mock.calls.length - 1][0]).toEqual({ type: 'test' })
    expect(state.mock.calls[state.mock.calls.length - 1][0]).toEqual(app.getState())

    app.dispatch({ type: 'test2' })
    expect(events.mock.calls).toHaveLength(2 + eventsInitialLength)
    expect(state.mock.calls).toHaveLength(2 + stateInitialLength)
    expect(events.mock.calls[events.mock.calls.length - 1][0]).toEqual({ type: 'test2' })
    expect(state.mock.calls[state.mock.calls.length - 1][0]).toEqual(app.getState())
  })

  it('should use rootReducer from passed modules', () => {
    const a1 = createEvent()
    const a2 = createEvent()

    const r1 = createReducer<{ called?: boolean }>({}).on(a1, () => ({ called: true }))
    const r2 = createReducer({}).on(a2, () => ({ called: true }))

    const m1 = {
      name: 'm1',
      events: { a1 },
      reducers: { r1 }
    }

    const m2 = {
      name: 'm2',
      events: { a2 },
      reducers: { r2 }
    }

    const app = createApp({
      name: 'test',
      modules: [m1, m2]
    })

    let state: any
    app.subscribe((s) => (state = s))

    expect(state).toEqual({
      r1: {},
      r2: {}
    })

    app.api.a1()

    expect(state).toEqual({
      r1: { called: true },
      r2: {}
    })

    app.api.a2()

    expect(state).toEqual({
      r1: { called: true },
      r2: { called: true }
    })
  })

  it('should use rehydrate param of config to set initial state', () => {
    const r1 = createReducer({})

    const m1 = {
      name: 'm1',
      reducers: { r1 }
    }

    const app = createApp({
      name: 'test',
      modules: [m1],
      rehydrate: {
        r1: {
          test: 123
        }
      }
    })

    let state: any
    app.subscribe((s) => (state = s))

    expect(state).toEqual({
      r1: {
        test: 123
      }
    })
  })

  it('should use __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ if available', () => {
    const rdec = jest.fn().mockImplementation(() => compose)
    ;(window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ = rdec

    const m1 = {
      name: 'm1',
      reducers: { mockReducer }
    }

    createApp({
      name: 'testApp',
      modules: [m1]
    })

    expect(rdec).toBeCalledWith({ name: 'testApp' })

    createApp({
      modules: [m1]
    } as any)

    expect(rdec.mock.calls[1][0]).toHaveProperty('name')
  })

  it('should support custom middleware', () => {
    let mock: any
    const middleware: Middleware = () => (next) => {
      mock = jest.fn((action: any) => {
        return next(action)
      })

      return mock
    }

    const m1 = {
      name: 'm1',
      reducers: { mockReducer }
    }

    createApp({
      name: 'testApp',
      modules: [m1],
      middlewares: [middleware]
    })

    expect(mock).toBeDefined()
    expect(mock).toBeCalled()
  })
})

describe('app root reducer', () => {
  it('should react to special events', () => {
    const m1 = {
      name: 'm1',
      reducers: { r1: createReducer({}) }
    }

    const app = createApp({
      name: 'testApp',
      modules: [m1]
    })

    expect(app.getState()).toEqual({ r1: {} })

    app.dispatch(dangerouslyReplaceState({ r1: { test: 123 } }))
    expect(app.getState()).toEqual({ r1: { test: 123 } })

    app.dispatch(dangerouslyResetState())
    expect(app.getState()).toEqual({ r1: {} })
  })
})
