import { omit } from './omit'

describe('omit', () => {
  it('should omit props', () => {
    expect(omit({ a: 1, b: 2 }, ['a'])).toEqual({ b: 2 })
    expect(omit({ a: 2 }, ['a', 'c', 'd'] as any)).toEqual({})
    expect(omit({ a: 3 }, [])).toEqual({ a: 3 })
  })
})
