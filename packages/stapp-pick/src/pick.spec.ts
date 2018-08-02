import { createApp, createEvent } from 'stapp'
import { loggerModule } from 'stapp/lib/helpers/testHelpers/loggerModule/loggerModule'
import { pick as pickModule, picked } from './pick'

describe('pick module', () => {
  const event1 = createEvent('Test event 1')
  const event2 = createEvent('Test event 2')
  const event3 = createEvent('Test event 3')
  const event4 = createEvent('Test event 4')

  const pickResult = ['1', '2', '3']
  const pickMock = jest.fn(() => pickResult)
  const someModule = {
    name: 'someModule',
    api: {
      event1,
      event2,
      event4
    }
  }
  const getApp = ({
    on = [event1, event2],
    pick = pickMock,
    react = [event3]
  } = {}) =>
    createApp({
      modules: [
        pickModule({
          on,
          pick,
          react
        }),
        someModule,
        loggerModule({
          pattern: new RegExp('^$')
        })
      ]
    })
  const app = getApp()

  it('should dispatch picked on events from on', () => {
    app.api.event2()

    expect(pickMock).toHaveBeenCalledTimes(1)
    expect(app.getState()).toEqual(
      expect.objectContaining({
        pick: pickResult
      })
    )
    expect(app.getState().eventLog).toContainEqual(
      expect.objectContaining(picked(pickResult))
    )
    expect(app.getState().eventLog).toContainEqual(
      expect.objectContaining(event3(pickResult))
    )

    app.api.event1()
    expect(pickMock).toHaveBeenCalledTimes(2)
  })

  it('should not dispatch picked on events from on', () => {
    app.api.event4()
    expect(pickMock).toHaveBeenCalledTimes(2)
  })
})
