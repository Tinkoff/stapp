import { has } from './has'

describe('has', () => {
  it('checks if passed object has property', () => {
    expect(has('a', null)).toBe(false)
    expect(has('a', undefined)).toBe(false)
    expect(has('a', 'test')).toBe(false)
    expect(has('a', { a: 5 })).toBe(true)
    expect(has('a', {})).toBe(false)
    expect(has('a', 'a')).toBe(false)
  })

  it('ignores prototype', () => {
    class C {
      a() {
        return
      }
    }

    expect(has('a', new C())).toBe(false)
  })
})
