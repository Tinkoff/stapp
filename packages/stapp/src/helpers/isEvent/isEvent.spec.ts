import { createEvent } from '../../core/createEvent/createEvent'
import { isEvent } from './isEvent'

describe('isEvent', () => {
  const type = 'TYPE'

  it('requires a type', () => {
    expect(isEvent({ type })).toBe(true)
    expect(isEvent()).toBe(false)
    expect(isEvent({})).toBe(false)
    expect(isEvent({ type: undefined })).toBe(false)
  })

  it('only accepts plain objects', () => {
    const event: any = () => undefined
    event.type = type
    expect(isEvent(event)).toBe(false)
  })

  it('only returns true if type is a string', () => {
    expect(isEvent({ type: true })).toBe(false)
    expect(isEvent({ type: 123 })).toBe(false)
  })

  it('works with createEvent', () => {
    expect(isEvent(createEvent()())).toBe(true)
  })
})
