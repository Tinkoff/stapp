import { createApp, createEvent } from 'stapp'
import { pick } from './pick'

describe('pick module', () => {
  const event1 = createEvent('Test event 1')
  const event2 = createEvent('Test event 2')
  const event3 = createEvent('Test event 3')
  const event4 = createEvent('Test event 4')

  const pickResult = ['1', '2', '3']
  const pickMock = jest.fn(() => pickResult)
  const getApp = () =>
    createApp({
      modules: [
        pick({
          on: [event1, event2],
          pick: pickMock,
          react: [event3]
        })
      ]
    })

  it('should dispatch picked on events from on', () => {
    const app = getApp()

    app.dispatch(event2)

    let state
    app.subscribe((s) => (state = s))

    expect(pickMock).toBeCalledWith(pickResult)
    expect(state).toEqual(
      expect.objectContaining({
        pick: pickResult
      })
    )
  })

  it('should not dispatch picked on events from on', () => {
    const app = getApp()

    app.dispatch(event4)

    let state
    app.subscribe((s) => (state = s))

    expect(pickMock).not.toBeCalledWith(pickResult)
    expect(state).not.toEqual(
      expect.objectContaining({
        pick: pickResult
      })
    )
  })
})
