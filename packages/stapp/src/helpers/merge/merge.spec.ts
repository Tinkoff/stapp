import { merge } from './merge'

describe('merge', () => {
  it('should merge values', () => {
    const A = { a: { testA: 1 } }
    const B = { a: { testB: 2 } }

    expect(merge(['a'], [A, B])).toEqual({
      testA: 1,
      testB: 2
    })
  })

  it('throws if objects have same fields', () => {
    const A = { a: { test: 1 } }
    const B = { a: { test: 2 } }

    expect(() => merge(['a'], [A, B])).toThrow()
  })

  it("should not fail on objects, that does't have required field", () => {
    const A = { a: { testA: 1 } }
    const B = { a: { testB: 2 } }
    const C = { c: { testC: 3 } }

    expect(merge(['a'], [A, B, C as any])).toEqual({
      testA: 1,
      testB: 2
    })
  })
})
