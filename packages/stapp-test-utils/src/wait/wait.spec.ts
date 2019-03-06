import { wait } from './wait'

jest.useFakeTimers()

describe('wait', () => {
  it('should resolve in provided amount of time', async () => {
    let resolved = false
    wait(100).then(() => (resolved = true))

    expect(resolved).toBe(false)

    jest.runTimersToTime(99)
    await null
    expect(resolved).toBe(false)

    jest.runTimersToTime(100)
    await null
    expect(resolved).toBe(true)
  })

  it('should resolve with the provided vale', async () => {
    let result: any

    wait(10, 'resolve').then((r) => (result = r))

    jest.runAllTimers()
    await null
    expect(result).toBe('resolve')
  })

  it('should reject if error provided', async () => {
    let result: any

    wait(10, undefined, 'reject').catch((r) => (result = r))

    jest.runAllTimers()
    await null
    expect(result).toBe('reject')
  })

  it('should resolve immediately if clear called', async () => {
    let result: any
    const promise = wait(100, 'test')
    promise.then((r) => (result = r))

    promise.clear()
    await null
    expect(result).toBe('test')

    promise.clear()
  })
})
