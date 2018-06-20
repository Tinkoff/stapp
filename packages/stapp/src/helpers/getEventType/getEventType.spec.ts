import { createEvent } from '../../core/createEvent/createEvent'
import { getEventType } from './getEventType'

describe('getEventType', () => {
  it('should get string representing event type from event creator', () => {
    const event = createEvent()
    expect(getEventType(event)).toEqual(event().type)
  })

  it('should return string, if string passed', () => {
    const str = 'STRING'
    expect(getEventType(str)).toEqual(str)
  })
})
