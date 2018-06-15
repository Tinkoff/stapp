import { awaitStore, whenReady } from './awaitStore'

describe('awaitStore', () => {
  it('should collect promises', (done) => {
    expect.assertions(3)

    const p1 = new Promise((resolve) => setTimeout(resolve, 25, 1))
    const p2 = new Promise((resolve) => setTimeout(resolve, 50, 2))
    const p3 = new Promise((resolve) => setTimeout(resolve, 75, 3))

    let result: any

    awaitStore('test1', p1)
    awaitStore('test2', p2)
    awaitStore('test3', p3)

    whenReady().then((r) => {
      result = r
    })

    expect(result).not.toBeDefined()

    setTimeout(() => {
      expect(result).toEqual({
        test1: 1,
        test2: 2,
        test3: 3
      })
      done()
    }, 100)
  })
})
