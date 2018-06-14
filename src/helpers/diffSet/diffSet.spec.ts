import { diffSet } from './diffSet'

describe('diffSet', () => {
  it('should collect entries from second Set, if they are not present in first', () => {
    const setA = new Set([1, 2, 3, 4])
    const setB = new Set([1, 2, 3, 4, 5, 6])

    expect(Array.from(diffSet(setA, setB))).toEqual([5, 6])
  })
})
