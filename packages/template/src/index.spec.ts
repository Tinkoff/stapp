import { hello } from './'

describe('template', () => {
  it('should work', () => {
    expect(hello('World')).toBe('hello, World!')
  })
})
