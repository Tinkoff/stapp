import { createEvent } from '../../core/createEvent/createEvent'
import { select, selectArray } from './select'

describe('select', () => {
  it('should return a filter function', () => {
    const a = createEvent()
    const b = createEvent()
    const c = createEvent()
    const values = [a(), b(), c(), a(), b(), c()]
    const filterFn = select(a)

    expect(values.filter(filterFn)).toEqual([a(), a()])
  })

  it('should filter stream by type', () => {
    const a = createEvent()
    const b = createEvent()
    const c = createEvent()
    const values = [a(), b(), c(), a(), b(), c()]
    const filterFn = select(a.getType())

    expect(values.filter(filterFn)).toEqual([a(), a()])
  })
})

describe('selectArray', () => {
  it('should filter stream by event creators', () => {
    const a = createEvent()
    const b = createEvent()
    const c = createEvent()
    const values = [a(), b(), c(), a(), b(), c()]
    const filterFn = selectArray([a, b])

    expect(values.filter(filterFn)).toEqual([a(), b(), a(), b()])
  })

  it('should filter stream by types', () => {
    const a = createEvent()
    const b = createEvent()
    const c = createEvent()
    const values = [a(), b(), c(), a(), b(), c()]
    const filterFn = selectArray([a.getType(), b.getType()])

    expect(values.filter(filterFn)).toEqual([a(), b(), a(), b()])
  })
})
