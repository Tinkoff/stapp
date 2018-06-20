import { marbles } from 'rxjs-marbles'
import { createEvent } from '../../core/createEvent/createEvent'
import { select, selectArray } from './select'

describe('select', () => {
  it(
    'should filter stream by event creator',
    marbles((m) => {
      const a = createEvent()
      const b = createEvent()
      const c = createEvent()
      const values = { a: a(), b: b(), c: c() }
      const source = m.cold('--a-b-c--a-c-b-a', values)
      const expected = m.cold('--a------a-----a', values)

      const destination = select(a, source)

      m.expect(destination).toBeObservable(expected)
    })
  )

  it(
    'should filter stream by type',
    marbles((m) => {
      const a = createEvent()
      const b = createEvent()
      const c = createEvent()
      const values = { a: a(), b: b(), c: c() }
      const source = m.cold('--a-b-c--a-c-b-a', values)
      const expected = m.cold('--a------a-----a', values)

      const destination = select(a.getType(), source)

      m.expect(destination).toBeObservable(expected)
    })
  )
})

describe('selectArray', () => {
  it(
    'should filter stream by event creators',
    marbles((m) => {
      const a = createEvent()
      const b = createEvent()
      const c = createEvent()
      const values = { a: a(), b: b(), c: c() }
      const source = m.cold('--a-b-c--a-c-b-a', values)
      const expected = m.cold('--a-b----a---b-a', values)

      const destination = selectArray([a, b], source)

      m.expect(destination).toBeObservable(expected)
    })
  )

  it(
    'should filter stream by types',
    marbles((m) => {
      const a = createEvent()
      const b = createEvent()
      const c = createEvent()
      const values = { a: a(), b: b(), c: c() }
      const source = m.cold('--a-b-c--a-c-b-a', values)
      const expected = m.cold('--a-b----a---b-a', values)

      const destination = selectArray([a.getType(), b.getType()], source)

      m.expect(destination).toBeObservable(expected)
    })
  )

  it(
    'should filter stream by combination of event creators and types',
    marbles((m) => {
      const a = createEvent()
      const b = createEvent()
      const c = createEvent()
      const values = { a: a(), b: b(), c: c() }
      const source = m.cold('--a-b-c--a-c-b-a', values)
      const expected = m.cold('--a-b----a---b-a', values)

      const destination = selectArray([a, b.getType()], source)

      m.expect(destination).toBeObservable(expected)
    })
  )
})
