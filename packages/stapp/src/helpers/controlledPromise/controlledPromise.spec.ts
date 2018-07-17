import { controlledPromise } from './controlledPromise'

describe('controlledPromise', () => {
  it('should return a new Promise and resolve callback', () => {
    const [promise, resolve] = controlledPromise()

    expect(promise).toBeInstanceOf(Promise)
    expect(typeof resolve).toBe('function')
  })

  it('should resolve when resolve callback is called', (done) => {
    expect.assertions(1)

    const [promise, resolve] = controlledPromise()
    const payload = {}

    promise.then((x) => {
      expect(x).toBe(payload)
      done()
    })

    resolve(payload)
  })
})
