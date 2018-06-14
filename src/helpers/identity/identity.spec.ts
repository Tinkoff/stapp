import { identity } from './identity'

describe('identity', () => {
  it('should return passed value', () => {
    const values = ['test', 1, false, {}, [], () => undefined]

    values.forEach((value) => {
      expect(identity(value)).toBe(value)
    })
  })
})
