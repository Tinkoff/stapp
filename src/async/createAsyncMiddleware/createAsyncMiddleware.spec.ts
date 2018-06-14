import { Action, applyMiddleware, createStore } from 'redux'
import { createEvent } from '../../core/createEvent/createEvent'
import { initDone } from '../../events/initDone'
import { COMPLETE } from '../../helpers/constants'
import { createAsyncMiddleware } from './createAsyncMiddleware'

describe('createAsyncMiddleware', () => {
  const reducer = (state: Action[] = [], event: Action) => state.concat(event)
  const eventB = createEvent()
  const eventC = createEvent()
  const eventA = createEvent('', () => undefined, () => ({ [COMPLETE]: eventB.getType() }))
  const eventBC = createEvent(
    '',
    () => undefined,
    () => ({
      [COMPLETE]: [eventB.getType(), eventC.getType()]
    })
  )

  const wait = () => new Promise((resolve) => setTimeout(resolve, 25))

  const prepare = async (list?: any) => {
    const { ready, asyncMiddleware } = createAsyncMiddleware(list)
    const next = jest.fn()
    const store = createStore(reducer, applyMiddleware(asyncMiddleware))

    ready.then(next)

    await wait()

    return {
      ready,
      next,
      store
    }
  }

  it('should resolve on initDone', async () => {
    const { ready, store, next } = await prepare()

    expect(next).not.toBeCalled()

    store.dispatch(initDone())
    await ready

    expect(next).toBeCalled()
  })

  it('should collect meta from events', async () => {
    const { next, store } = await prepare()

    store.dispatch(eventA())
    await wait()
    expect(next).not.toBeCalled()

    store.dispatch(initDone())
    await wait()
    expect(next).not.toBeCalled()

    store.dispatch(eventB())
    await wait()
    expect(next).toBeCalled()
  })

  it('should collect meta from events', async () => {
    const { next, store } = await prepare()

    store.dispatch(eventBC())
    await wait()
    expect(next).not.toBeCalled()

    store.dispatch(initDone())
    await wait()
    expect(next).not.toBeCalled()

    store.dispatch(eventB())
    await wait()
    expect(next).not.toBeCalled()

    store.dispatch(eventC())
    await wait()
    expect(next).toBeCalled()
  })

  it('should ignore former events', async () => {
    const { next, store } = await prepare()
    store.dispatch(eventA())
    store.dispatch(eventB())
    store.dispatch(initDone())
    store.dispatch(eventA())
    store.dispatch(eventB())

    await wait()
    expect(next.mock.calls).toHaveLength(1)
  })

  it('should take events list as an argument', async () => {
    const { next, store } = await prepare(['test', 'test2'])

    store.dispatch(initDone())
    await wait()

    expect(next).not.toBeCalled()

    store.dispatch({
      type: 'test'
    })
    await wait()

    expect(next).not.toBeCalled()

    store.dispatch({
      type: 'test2'
    })
    await wait()

    expect(next).toBeCalled()
  })
})
