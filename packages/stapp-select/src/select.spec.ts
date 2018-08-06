import { createApp, createEvent } from 'stapp'
import { EventCreator1 } from 'stapp/lib/core/createEvent/createEvent.h'
import { loggerModule } from 'stapp/lib/helpers/testHelpers/loggerModule/loggerModule'
import { select } from './select'

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
  const getApp = (name: any, reactOn: any, selector: any, reactWith: any) =>
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

  describe('with correct selector and with reactWith', () => {
    const app = getApp('pick', [event1, event2], selectMock, [reactEvent])

    it('should dispatch selected on events from on', () => {
      app.api.event2()

      expect(selectMock).toHaveBeenCalledTimes(1)
      expect(app.getState()).toEqual(
        expect.objectContaining({
          pick: selectResult
        })
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

  describe('with selector which return undefined', () => {
    it('should store initial state when selector return nothing', () => {
      const appEmptySelector = getApp('pick', [event1], () => undefined, [
        reactEvent
      ])

      const initialState = appEmptySelector.getState().pick

      appEmptySelector.api.event1()

      expect(appEmptySelector.getState().pick).toEqual(initialState)
    })
  })

  describe('with correct selector and empty reactWith', () => {
    it('should store initial state when selector return nothing', () => {
      const appWithoutReactWith = getApp(
        'pick',
        [event1],
        selectMock,
        undefined
      )

      appWithoutReactWith.api.event1()

      expect(appWithoutReactWith.getState().eventLog).not.toContainEqual(
        expect.objectContaining(reactEvent(selectResult))
      )
    })
  })
})
