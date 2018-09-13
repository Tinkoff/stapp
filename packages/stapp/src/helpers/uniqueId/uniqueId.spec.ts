import { uniqify } from './uniqify'
import { uniqueId } from './uniqueId'

describe('uniqueId', () => {
  it('should generate unique id', () => {
    const array = Array(100)
      .fill(0)
      .map(uniqueId)
    const set = new Set(array)

    expect(array.length).toEqual(set.size)
  })

  it('should uniqify ids', () => {
    expect(uniqify('unique_test')).toEqual('unique_test')
    expect(uniqify('unique_test').length >= 7).toBe(true)
    expect(uniqify().length >= 3).toBe(true)
  })
})
