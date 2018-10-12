import { simpleMemoize } from './simpleMemoize'

describe('simpleMemoize', () => {
  it('should memoize provided function', () => {
    const rand = () => Math.random()
    const memoizedRand = simpleMemoize(rand)

    expect(memoizedRand(1)).toEqual(memoizedRand(1))
  })

  it('should rememoize if argument changes', () => {
    const rand = () => Math.random()
    const memoizedRand = simpleMemoize(rand)

    expect(memoizedRand(1)).not.toEqual(memoizedRand(2))
  })
})
