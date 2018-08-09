import { createApp } from 'stapp'
import { initDone } from 'stapp'
import { SOURCE } from 'stapp/lib/helpers/constants'
import { loggerModule } from './loggerModule'

describe('loggerModule', () => {
  const testEvent = () => ({ type: 'testEvent', meta: { myMeta: true } })

  it('should log events', () => {
    const app = createApp({
      modules: [loggerModule()]
    })

    expect(app.getState().eventLog).toEqual([])

    app.dispatch(testEvent())
    expect(app.getState().eventLog).toEqual([{ type: 'testEvent' }])
  })

  it('should accept custom ignore pattern', () => {
    const app = createApp({
      modules: [loggerModule({ ignore: /^test/ })]
    })

    expect(app.getState().eventLog).toEqual([])

    app.dispatch(testEvent())
    expect(app.getState().eventLog).toEqual([])
  })

  it('should filter inner events by default', () => {
    const app = createApp({
      modules: [loggerModule({ ignoreInnerEvents: false })]
    })

    expect(app.getState().eventLog).toEqual([initDone()])
  })

  it('should clear meta by default', () => {
    const app = createApp({
      name: 'test',
      modules: [
        loggerModule({
          clearMeta: false
        })
      ]
    })

    app.dispatch(testEvent())
    expect(app.getState().eventLog).toEqual([
      { type: 'testEvent', meta: { myMeta: true, [SOURCE]: ['root'] } }
    ])
  })
})
