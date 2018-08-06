import { pick } from './pick'

describe('utils/object/pick', () => {
  it('return new object with picked properties', () => {
    expect(pick({ a: 3, b: 2, c: 1 }, ['a', 'b'])).toEqual({ a: 3, b: 2 })
    expect(pick({}, ['a', 'b'] as any)).toEqual({})
    expect(pick({ a: 1, b: 2 }, ['a', 'b', 'c'] as any)).toEqual({ a: 1, b: 2 })
  })
})
