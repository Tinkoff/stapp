import { identity } from './identity'

describe('identity', () => {
  it('should return passed value', () => {
    const values = ['test', 1, false, {}, [], () => undefined]

    values.forEach((value) => {
      expect(identity(value)).toBe(value)
    })
  })

  it('should ignore any arguments except the first', () => {
    expect(identity(1, 2, 3)).toBe(1)
  })
})
