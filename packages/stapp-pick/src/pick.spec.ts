import { createApp, createEvent } from 'stapp'
import { loggerModule } from 'stapp/lib/helpers/testHelpers/loggerModule/loggerModule'
import { picked, pickModule } from './pick'

describe('pick module', () => {
  const event1 = createEvent('Api event 1')
  const event2 = createEvent('Api event 2')
  const event3 = createEvent('Api event 3')

  const reactEvent1 = createEvent<Array<string | void>>('React event 1')

  const pickResult = ['1', '2', '3']
  const pickMock = jest.fn(() => pickResult)

  const someModule = {
    name: 'someModule',
    api: {
      event1,
      event2,
      event3
    }
  }
  const getApp = ({
    on = [event1, event2],
    pick = pickMock,
    react = [reactEvent1]
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
      expect.objectContaining(reactEvent1(pickResult))
    )

    app.api.event1()
    expect(pickMock).toHaveBeenCalledTimes(2)
  })

  it('should not dispatch picked on events from on', () => {
    app.api.event3()
    expect(pickMock).toHaveBeenCalledTimes(2)
  })
})
