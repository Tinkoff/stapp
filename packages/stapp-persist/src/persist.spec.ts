import { createApp, createEvent, createReducer } from 'stapp'
import { wait } from 'stapp/lib/helpers/testHelpers/wait/wait'
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

  const stringModule = {
    name: 'test',
    api: { e1 },
    state: { r1 }
  }

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

  describe('saving and restoring', () => {
    it('should store data in provided storage', async () => {
      const storage = getLS()

      const app = createApp({
        modules: [
          stringModule,
          persist({
            key: persistKey,
            storage: toAsync(storage)
          })
        ]
      })

      // wait until restore does its job
      await null
      expect(storage.getParsed(defaultKey)).toEqual({ r1: '' })

      app.api.e1('test2')

      await wait(20)
      expect(storage.getParsed(defaultKey)).toEqual({ r1: 'test2' })

      app.api.clearStorage()
      expect(storage.getItem(defaultKey)).toEqual(null)
    })

    it('should debounce changes and skip same values', async () => {
      const storage = getLS()

      const app = createApp({
        modules: [
          stringModule,
          persist({
            key: persistKey,
            storage: toAsync(storage),
            throttle: 10
          })
        ]
      })

      // wait until restore does its job
      await null

      // After state change storage should state same
      app.api.e1('test')
      expect(storage.getParsed(defaultKey)).toEqual(null)
      expect(storage.setItem.mock.calls).toHaveLength(0)

      // After throttle time storage should be equal to app state
      await wait(20)
      expect(storage.getParsed(defaultKey)).toEqual({ r1: 'test' })
      expect(storage.setItem.mock.calls).toHaveLength(1)

      // // It shpuld ignore same values
      app.api.e1('test2')
      await wait(20)
      expect(storage.getParsed(defaultKey)).toEqual({ r1: 'test2' })
      expect(storage.setItem.mock.calls).toHaveLength(2)

      app.api.e1('test1')
      expect(storage.setItem.mock.calls).toHaveLength(2)
      expect(storage.getParsed(defaultKey)).toEqual({ r1: 'test2' })

      app.api.e1('test2')
      expect(storage.setItem.mock.calls).toHaveLength(2)
      await wait(20)
      expect(storage.getParsed(defaultKey)).toEqual({ r1: 'test2' })
      expect(storage.setItem.mock.calls).toHaveLength(2)
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

      await null
      expect(app.getState()).toEqual(initialState)
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

    it('should ignore state updates until data is loaded from storage', async () => {
      const storage = {
        async getItem() {
          await wait(25)
          return JSON.stringify({ r1: 'test666' })
        },
        setItem: jest.fn(() => Promise.resolve()),
        async removeItem() {
          return undefined
        }
      }

      const app = createApp({
        modules: [
          stringModule,
          persist({
            storage,
            key: persistKey,
            timeout: 50,
            stateReconciler: (a, b) => Object.assign({}, b, a)
          })
        ]
      })

      await null
      app.api.e1('test1')

      await null
      app.api.e1('test2')

      await null
      app.api.e1('test3')

      expect(storage.setItem).not.toBeCalled()

      await wait(50)
      expect(app.getState()).toEqual({ r1: 'test666' })
      expect(storage.setItem.mock.calls.length).toBe(1)

      app.api.e1('test777')
      await null
      expect(storage.setItem.mock.calls.length).toBe(2)
    })
  })

  describe('white and black lists', () => {
    it('should use whitelist to pick values', async () => {
      const storage = getLS()

      const app = createApp({
        modules: [
          stringModule,
          {
            name: 'test2',
            state: { r2: r1 }
          },
          {
            name: 'test3',
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

      await null

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
          stringModule,
          {
            name: 'test2',
            state: { r2: r1 }
          },
          {
            name: 'test3',
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

      await null

      app.api.e1('test')
      await wait(20)
      expect(storage.getParsed(defaultKey)).toEqual({
        r1: 'test',
        r2: 'test'
      })
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

  describe('transformers', () => {
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

      await null

      app.api.e1(0)
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
  })

  describe('serializing', () => {
    it('should use default serializer', async () => {
      const storage = getLS()

      const app = createApp({
        modules: [
          stringModule,
          persist({
            key: persistKey,
            storage: toAsync(storage)
          })
        ]
      })

      await null

      app.api.e1('test')
      expect(storage.getItem(defaultKey)).toEqual(
        JSON.stringify(app.getState())
      )
    })

    it('should not use serializer if told not to', async () => {
      const storage = getLS()

      const app = createApp({
        modules: [
          stringModule,
          persist({
            key: persistKey,
            storage: toAsync(storage),
            serialize: false
          })
        ]
      })

      await null

      app.api.e1('test')
      await wait(20)
      expect(storage.getItem(defaultKey)).toEqual({
        r1: 'test'
      })
    })
  })

  describe('handling errors', () => {
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
          stringModule,
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
          stringModule,
          persist({
            key: persistKey,
            storage
          })
        ]
      })

      await null
      expect(app.getState()).toEqual({ r1: '' })

      app.api.e1('test2')
      expect(storage.setItem).toBeCalled()
    })
  })
})
