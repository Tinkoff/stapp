import { createApp } from '../../core/createApp/createApp'
import { createEvent } from '../../core/createEvent/createEvent'
import { createReducer } from '../../core/createReducer/createReducer'
import { wait } from '../../helpers/testHelpers/wait/wait'
import { PERSIST } from './constants'
import { persist } from './persist'
import { toAsync } from './toAsync'

describe('persist module', () => {
  const getLS = (initial = {}) => {
    const store: any = initial

    return {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: any) => (store[key] = value)),
      removeItem: jest.fn((key: string) => {
        delete store[key]
      }),

      getParsed: (key: string) => JSON.parse(store[key] || null),
      get store() {
        return store
      }
    }
  }

  const e1 = createEvent<any>()
  const r1 = createReducer<any>('').on(e1, (_, payload) => payload)
  const persistKey = 'test'
  const defaultKey = `${PERSIST}:${persistKey}`

  const n1 = createReducer(0).on(e1, (state, payload) => state + payload)
  const nTransform1 = {
    in: (state: number) => {
      return state + 100
    },
    out: (state: number) => {
      return state - 100
    }
  }

  const nTransform2 = {
    in: (state: number) => {
      return state * 2
    },
    out: (state: number) => {
      return state / 2
    }
  }

  it('should store data in localStorage', async () => {
    const storage = getLS()

    const app = createApp({
      modules: [
        {
          name: 'test',
          api: { e1 },
          state: { r1 }
        },
        persist({
          key: persistKey,
          storage: toAsync(storage)
        })
      ]
    })

    await wait(20)
    expect(storage.getParsed(defaultKey)).toEqual(app.getState())

    app.api.e1('test2')
    expect(app.getState().r1).toEqual('test2') // just checking
    await wait(20)
    expect(storage.getParsed(defaultKey)).toEqual(app.getState())

    app.api.clearStorage()
    expect(storage.getItem(defaultKey)).toEqual(null)
  })

  it('should debounce changes and skip same values', async () => {
    const storage = getLS()

    const app = createApp({
      modules: [
        {
          name: 'test',
          api: { e1 },
          state: { r1 }
        },
        persist({
          key: persistKey,
          storage: toAsync(storage),
          throttle: 10
        })
      ]
    })

    // After init storage should stay empty
    expect(storage.getParsed(defaultKey)).toEqual(null)
    expect(storage.setItem.mock.calls).toHaveLength(0)

    // After throttle time storage should be equal to app state
    await wait(20)
    expect(storage.getParsed(defaultKey)).toEqual(app.getState())
    expect(storage.setItem.mock.calls).toHaveLength(1)

    // After state change storage should state same
    app.api.e1('test')
    expect(storage.getParsed(defaultKey)).toEqual({ r1: '' })
    expect(storage.setItem.mock.calls).toHaveLength(1)

    // After throttle time storage should be equal to app state
    await wait(20)
    expect(storage.getParsed(defaultKey)).toEqual(app.getState())
    expect(storage.setItem.mock.calls).toHaveLength(2)

    // It shpuld ignore same values
    app.api.e1('test2')
    await wait(20)
    expect(storage.getParsed(defaultKey)).toEqual(app.getState())
    expect(storage.setItem.mock.calls).toHaveLength(3)

    app.api.e1('test1')
    expect(storage.setItem.mock.calls).toHaveLength(3)

    app.api.e1('test2')
    expect(storage.setItem.mock.calls).toHaveLength(3)
    await wait(20)
    expect(storage.getParsed(defaultKey)).toEqual(app.getState())
    expect(storage.setItem.mock.calls).toHaveLength(3)
  })

  it('should use whitelist to pick values', async () => {
    const storage = getLS()

    const app = createApp({
      modules: [
        {
          name: 'test',
          api: { e1 },
          state: { r1 }
        },
        {
          name: 'test',
          state: { r2: r1 }
        },
        {
          name: 'test',
          state: { r3: r1 }
        },
        persist({
          key: persistKey,
          storage: toAsync(storage),
          whiteList: ['r1', 'r2', 'r4'],
          throttle: 10
        })
      ]
    })

    // Just checking
    expect(app.getState()).toEqual({
      r1: '',
      r2: '',
      r3: ''
    })

    await wait(20)
    expect(storage.getParsed(defaultKey)).toEqual({
      r1: '',
      r2: ''
    })

    app.api.e1('test')
    await wait(20)
    expect(app.getState()).toEqual({
      r1: 'test',
      r2: 'test',
      r3: 'test'
    })
    expect(storage.getParsed(defaultKey)).toEqual({
      r1: 'test',
      r2: 'test'
    })
  })

  it('should use blacklist to pick values', async () => {
    const storage = getLS()

    const app = createApp({
      modules: [
        {
          name: 'test',
          api: { e1 },
          state: { r1 }
        },
        {
          name: 'test',
          state: { r2: r1 }
        },
        {
          name: 'test',
          state: { r3: r1 }
        },
        persist({
          key: persistKey,
          storage: toAsync(storage),
          blackList: ['r3'],
          throttle: 10
        })
      ]
    })

    await wait(20)
    expect(storage.getParsed(defaultKey)).toEqual({
      r1: '',
      r2: ''
    })

    app.api.e1('test')
    await wait(20)
    expect(storage.getParsed(defaultKey)).toEqual({
      r1: 'test',
      r2: 'test'
    })
  })

  it('should apply tranformations when storing value', async () => {
    const storage = getLS()

    const app = createApp({
      modules: [
        {
          name: 'test',
          api: { e1 },
          state: { n1 }
        },
        persist({
          key: persistKey,
          storage: toAsync(storage),
          transforms: [nTransform1, nTransform1, nTransform2]
        })
      ]
    })

    // Check
    expect(app.getState()).toEqual({
      n1: 0
    })

    await wait(20)
    expect(storage.getParsed(defaultKey)).toEqual({
      n1: 400
    })

    app.api.e1(1)
    await wait(20)
    expect(storage.getParsed(defaultKey)).toEqual({
      n1: 402
    })
  })

  it('should not use serializer if told not to', async () => {
    const storage = getLS()

    const app = createApp({
      modules: [
        {
          name: 'test',
          api: { e1 },
          state: { r1 }
        },
        persist({
          key: persistKey,
          storage: toAsync(storage),
          serialize: false
        })
      ]
    })

    await wait(20)
    expect(storage.getItem(defaultKey)).toEqual({
      r1: ''
    })
  })

  it('should restore data from storage', async () => {
    const storage = getLS()
    const initialState = {
      test1: {
        test: 123
      },
      test2: {
        test: '321'
      }
    }
    storage.setItem(defaultKey, JSON.stringify(initialState))

    const app = createApp({
      modules: [
        {
          name: 'test',
          state: {
            test1: createReducer({}),
            test2: createReducer({})
          }
        },
        persist({
          key: persistKey,
          storage: toAsync(storage)
        })
      ]
    })

    await wait(10)
    expect(app.getState()).toEqual(initialState)
  })

  it('should apply transforms on restore', async () => {
    const storage = getLS()
    storage.setItem(
      defaultKey,
      JSON.stringify({
        n1: 402
      })
    )

    const app = createApp({
      modules: [
        {
          name: 'test',
          api: { e1 },
          state: { n1 }
        },
        persist({
          key: persistKey,
          storage: toAsync(storage),
          transforms: [nTransform1, nTransform1, nTransform2]
        })
      ]
    })

    await wait(10)
    expect(app.getState()).toEqual({ n1: 1 })
  })

  it('should use custom reconsiler', async () => {
    expect.assertions(3)

    const storage = getLS()
    storage.setItem(
      defaultKey,
      JSON.stringify({
        n1: 1
      })
    )

    const app = createApp({
      modules: [
        {
          name: 'test',
          api: { e1 },
          state: { n1 }
        },
        persist({
          key: persistKey,
          storage: toAsync(storage),
          stateReconciler: (restoredState, currentState) => {
            expect(restoredState).toEqual({
              n1: 1
            })

            expect(currentState).toEqual({
              n1: 0
            })

            return {
              n1: 100
            }
          }
        })
      ]
    })

    await wait(10)
    expect(app.getState()).toEqual({ n1: 100 })
  })

  it('should abort on timeout', async () => {
    const storage = {
      async getItem() {
        await wait(100)
        return JSON.stringify({ r1: 'test' })
      },
      async setItem() {
        return undefined
      },
      async removeItem() {
        return undefined
      }
    }

    const app = createApp({
      modules: [
        {
          name: 'test',
          api: { e1 },
          state: { r1 }
        },
        persist({
          key: persistKey,
          storage,
          timeout: 50
        })
      ]
    })

    await wait(150)
    expect(app.getState()).toEqual({ r1: '' })
  })

  it('should ignore errors on saving value to storage', async () => {
    const storage = {
      async getItem() {
        return null
      },
      setItem: jest.fn(async () => {
        throw new Error('Error')
      }),
      async removeItem() {
        return undefined
      }
    }

    const app = createApp({
      modules: [
        {
          name: 'test',
          api: { e1 },
          state: { r1 }
        },
        persist({
          key: persistKey,
          storage
        })
      ]
    })

    await wait(150)
    expect(app.getState()).toEqual({ r1: '' })
    expect(storage.setItem).toBeCalled()
  })

  it('should use blacklist and whitelist when restoring state', async () => {
    const storage = getLS()
    const initialState = {
      test1: {
        test: 123
      },
      test2: {
        test: '321'
      }
    }

    storage.setItem(defaultKey, JSON.stringify(initialState))
    storage.setItem = (() => undefined) as any

    const app1 = createApp({
      modules: [
        {
          name: 'test',
          state: {
            test1: createReducer({}),
            test2: createReducer({})
          }
        },
        persist({
          key: persistKey,
          storage: toAsync(storage),
          whiteList: ['test1']
        })
      ]
    })

    const app2 = createApp({
      modules: [
        {
          name: 'test',
          state: {
            test1: createReducer({}),
            test2: createReducer({})
          }
        },
        persist({
          key: persistKey,
          storage: toAsync(storage),
          blackList: ['test1']
        })
      ]
    })

    await wait(20)
    expect(app1.getState()).toEqual({
      test1: {
        test: 123
      },
      test2: {}
    })

    expect(app2.getState()).toEqual({
      test1: {},
      test2: {
        test: '321'
      }
    })
  })
})
