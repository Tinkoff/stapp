import { collectData } from '../../helpers/testHelpers/collectData/collectData'
import { createEffect } from './createEffect'

describe('createEffect', () => {
  type P = { test: number }

  it('should create effect', () => {
    const effect = createEffect('test')

    expect(effect.getType().includes('test')).toBe(true)
    expect(effect.success).toBeDefined()
    expect(effect.fail).toBeDefined()
    expect(effect.start).toBeDefined()
    expect(effect.use).toBeDefined()
  })

  it('should fail, if no effect function provided', () => {
    const effect = createEffect('test')

    expect(() => effect(1)).toThrow()
  })

  it('should change the effect function use method called', async () => {
    const effect = createEffect('test')
    const effectFnA = jest.fn()
    const effectFnB = jest.fn()

    effect.use(effectFnA)
    await collectData(effect(1))
    expect(effectFnA.mock.calls).toHaveLength(1)
    expect(effectFnA).toBeCalledWith(1)

    effect.use(effectFnB)
    await collectData(effect(2))
    expect(effectFnA.mock.calls).toHaveLength(1)
    expect(effectFnB.mock.calls).toHaveLength(1)
    expect(effectFnB).toBeCalledWith(2)
  })

  it('should create a stream of events', async () => {
    const effect = createEffect<{ test: number }, { test: number }>(
      'test',
      (x) => ({
        test: x.test + 1
      })
    )
    const payload = { test: 1 }

    const events = await collectData(effect(payload))

    const start = events[0]
    const success = events[1]

    // Check order
    expect(events).toEqual([
      effect.start(payload),
      effect.success({ test: 2 }),
      effect.complete()
    ])

    // Check payload
    expect(start.payload).toBe(payload)
    expect(success.payload).toEqual({ test: 2 })
  })

  it('should return empty stream if condition not met', async () => {
    const effect = createEffect('test', (x) => x, (x) => x === 'ok')

    const eventsA = await collectData(effect('not ok'))
    expect(eventsA.length).toBe(0)

    const eventsB = await collectData(effect('ok'))
    expect(eventsB.length).toBe(3)
  })

  it('should work with promise-resolving effect function', async () => {
    const effect = createEffect<P, P>('test', (x) =>
      Promise.resolve({ test: x.test + 1 })
    )
    const payload = { test: 1 }

    const events = await collectData(effect(payload))
    expect(events.length).toBe(3)

    const start = events[0]
    const success = events[1]

    expect(success.payload).toEqual({ test: 2 })
  })

  it('should work with promise-rejecting effect function', async () => {
    const effect = createEffect<P, P>('test', (x) =>
      Promise.reject({ test: x.test - 1 })
    )
    const payload = { test: 1 }

    const events = await collectData(effect(payload))
    expect(events.length).toBe(3)

    const start = events[0]
    const fail = events[1]

    expect(fail.type.includes('test')).toBe(true)
    expect(fail.type.includes('FAIL')).toBe(true)

    expect(fail.payload).toEqual({ test: 0 })
  })

  it('should work with throwing sync effect function', async () => {
    const effect = createEffect<P, P>('test', (x) => {
      throw new Error('whoooa')
    })
    const payload = { test: 1 }

    const events = await collectData(effect(payload))
    expect(events.length).toBe(3)

    const start = events[0]
    const fail = events[1]

    expect(fail.payload).toEqual(new Error('whoooa'))
  })
})
