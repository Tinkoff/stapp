import { uniqueId } from './uniqueId'

describe('uniqueId', () => {
  it('should generate unique id', () => {
    const array = Array(100)
      .fill(0)
      .map(uniqueId)
    const set = new Set(array)

    expect(array.length).toEqual(set.size)
  })
})
