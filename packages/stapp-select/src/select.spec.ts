import { createApp, createEvent } from 'stapp'
import { EventCreator1 } from 'stapp/lib/core/createEvent/createEvent.h'
import { loggerModule } from 'stapp/lib/helpers/testHelpers/loggerModule/loggerModule'
import { select, selected } from './select'

describe('select module', () => {
  const event1 = createEvent('Test event 1')
  const event2 = createEvent('Test event 2')
  const event3 = createEvent('Test event 3')

  const reactEvent: EventCreator1<any> = createEvent('Refactor event')

  const selectResult = ['1', '2', '3']
  const selectMock = jest.fn(() => selectResult)
  const someModule = {
    name: 'someModule',
    api: {
      event1,
      event2,
      event3
    }
  }
  const getApp = ({
    name = 'pick',
    reactOn = [event1, event2],
    selector = selectMock,
    reactWith = [reactEvent]
  } = {}) =>
    createApp({
      modules: [
        select({
          name,
          reactOn,
          selector,
          reactWith
        }),
        someModule,
        loggerModule({
          pattern: new RegExp('^$')
        })
      ]
    })
  const app = getApp()

  it('should dispatch selected on events from on', () => {
    app.api.event2()

    expect(selectMock).toHaveBeenCalledTimes(1)
    expect(app.getState()).toEqual(
      expect.objectContaining({
        pick: selectResult
      })
    )
    expect(app.getState().eventLog).toContainEqual(
      expect.objectContaining(selected(selectResult))
    )
    expect(app.getState().eventLog).toContainEqual(
      expect.objectContaining(reactEvent(selectResult))
    )

    app.api.event1()
    expect(selectMock).toHaveBeenCalledTimes(2)
  })

  it('should not dispatch selected on events from on', () => {
    app.api.event3()
    expect(selectMock).toHaveBeenCalledTimes(2)
  })
})
