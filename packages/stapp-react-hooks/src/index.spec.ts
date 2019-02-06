import { identity } from 'stapp/lib/helpers/identity/identity'

describe('template', () => {
  it('should work', () => {
    expect(identity('World')).toBe('World!')
  })
})
