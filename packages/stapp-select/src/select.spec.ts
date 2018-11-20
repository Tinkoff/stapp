import { tap } from 'rxjs/operators'
import { createApp, createEvent } from 'stapp'
import { EventCreator1 } from 'stapp/lib/core/createEvent/createEvent.h'
import { loggerModule } from 'stapp/lib/helpers/testHelpers/loggerModule/loggerModule'
import { select } from './select'
import { SelectConfig } from './select.h'

const SELECT_NAME = 'pick'

describe('select module', () => {
  const event1 = createEvent('Test event 1')
  const event2 = createEvent('Test event 2')
  const event3 = createEvent('Test event 3')

  const reactEvent: EventCreator1<any> = createEvent('Refactor event')

  const selectResult = ['1', '2', '3']
  const selectMock = jest.fn(() => selectResult)

  const someModuleSelectorMock = jest.fn()
  const someModule = () => {
    const epic = reactEvent.epic((events$, _, { getState }) =>
      events$.pipe(
        tap(() => {
          const state: any = getState()

          someModuleSelectorMock(state[SELECT_NAME])
        })
      )
    )

    return {
      name: 'someModule',
      api: {
        event1,
        event2,
        event3
      },
      epic
    }
  }
  const getApp = (config: SelectConfig<any, any, any>) =>
    createApp({
      modules: [
        select(config),
        someModule,
        loggerModule({
          pattern: new RegExp('^$')
        })
      ]
    })

  describe('with correct selector and with reactWith', () => {
    const app = getApp({
      name: SELECT_NAME,
      reactOn: [event1, event2],
      selector: selectMock,
      reactWith: [reactEvent]
    })

    it('should react on init event', () => {
      expect(selectMock).toHaveBeenCalledTimes(1)
    })

    it('should react on events listed in reactOn', () => {
      app.api.event2()

      expect(selectMock).toHaveBeenCalledTimes(2)
      expect(app.getState()).toEqual(
        expect.objectContaining({
          pick: selectResult
        })
      )
      expect(app.getState().eventLog).toContainEqual(
        expect.objectContaining(reactEvent(selectResult))
      )

      app.api.event1()
      expect(selectMock).toHaveBeenCalledTimes(3)
    })

    it('should not react on events not listed in reactOn', () => {
      app.api.event3()
      expect(selectMock).toHaveBeenCalledTimes(3)
    })

    it('should dispatch selected event before events from reactWith', () => {
      app.api.event1()

      expect(someModuleSelectorMock).toHaveBeenCalledWith(selectResult)
    })
  })

  describe('with selector which return undefined', () => {
    it('should store initial state when selector returns nothing', () => {
      const appEmptySelector = getApp({
        name: 'pick',
        reactOn: [event1],
        selector: () => undefined,
        reactWith: [reactEvent]
      })

      const initialState = appEmptySelector.getState().pick

      appEmptySelector.api.event1()

      expect(appEmptySelector.getState().pick).toEqual(initialState)
    })
  })

  describe('with correct selector and empty reactWith', () => {
    it('should store initial state when selector return nothing', () => {
      const appWithoutReactWith = getApp({
        name: 'pick',
        reactOn: [event1],
        selector: selectMock
      })

      appWithoutReactWith.api.event1()

      expect(appWithoutReactWith.getState().eventLog).not.toContainEqual(
        expect.objectContaining(reactEvent(selectResult))
      )
    })
  })
})
