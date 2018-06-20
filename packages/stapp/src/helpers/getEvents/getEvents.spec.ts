import { getEvents } from './getEvents'

describe('getEvents', () => {
  it('should get events from modules', () => {
    const m1 = {
      name: 'm1',
      events: {
        test: 123
      }
    }
    const m2 = {
      name: 'm2',
      events: {
        test2: 123
      }
    }

    expect(getEvents([m1, m2])).toEqual({
      test: 123,
      test2: 123
    })
  })
})
