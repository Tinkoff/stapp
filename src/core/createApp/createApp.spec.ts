import { compose, Middleware } from 'redux'
import { createEvent } from '../createEvent/createEvent'
import { createReducer } from '../createReducer/createReducer'
import { createApp } from './createApp'

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
    expect(typeof app.state$.subscribe).toBe('function')
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
    app.state$.subscribe((s) => (state = s))

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
    app.state$.subscribe((s) => (state = s))

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
