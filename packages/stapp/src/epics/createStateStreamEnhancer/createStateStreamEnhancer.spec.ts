import { EMPTY, filter, map, merge, Observable, pipe, Subscribable } from 'light-observable'
import { Action, applyMiddleware, compose, createStore } from 'redux'
import { Epic } from '../../core/createApp/createApp.h'
import { createEvent } from '../../core/createEvent/createEvent'
import { AnyEventCreator, Event } from '../../core/createEvent/createEvent.h'
import { epicEnd } from '../../events/epicEnd'
import { createStateStreamEnhancer } from './createStateStreamEnhancer'

const select = (
  ec: AnyEventCreator,
  stream: Subscribable<Event<any, any>>
): Subscribable<Event<any, any>> => {
  return pipe(filter<Event<any, any>>((e) => e.type === ec.getType()))(stream)
}

describe('createStateStreamEnhancer', () => {
  const reducer = (state: Action[] = [], event: Action) => {
    if (event.type.startsWith('@@redux')) {
      return state
    }
    return state.concat(event)
  }
  const fire1 = createEvent('fire1')
  const fire2 = createEvent('fire2')
  const fire3 = createEvent('fire3')
  const fire4 = createEvent('fire4')
  const event1 = createEvent('event1')
  const event2 = createEvent('event2')
  const event3 = createEvent('event3')
  const event4 = createEvent('event4')
  const epicStart1 = createEvent('epicStart1')
  const epicStart2 = createEvent('epicStart2')
  const fireGeneric = createEvent('fireGeneric')
  const epicGeneric1 = createEvent('epicGeneric1')
  const epicGeneric2 = createEvent('epicGeneric2')
  const cleanUp = createEvent('cleanUp')

  it('should provide epics a stream of event$ and stream of state$', (done) => {
    expect.assertions(5)

    const epic = jest.fn()
    epic.mockReturnValue(EMPTY)

    const mockMiddleware = () => () => () => {
      expect(epic).toBeCalled()
      expect(epic.mock.calls[0][0]).toBeInstanceOf(Observable)
      expect(epic.mock.calls[0][1]).toBeInstanceOf(Observable)
      expect(typeof epic.mock.calls[0][2].getState).toBe('function')
      expect(typeof epic.mock.calls[0][2].dispatch).toBe('function')
      done()
    }

    const { stateStreamEnhancer } = createStateStreamEnhancer<Action[]>(epic)
    const store = createStore(
      reducer,
      compose(
        stateStreamEnhancer,
        applyMiddleware(mockMiddleware as any)
      )
    )
    store.dispatch({ type: 'FIRST_ACTION_TO_TRIGGER_MIDDLEWARE' })
  })

  it('should accept an epic that wires up event$ input to event$ out', () => {
    const epic: Epic<Action[]> = (event$) =>
      merge(pipe(map(() => event1()))(select(fire1, event$)))(
        pipe(map(() => event2()))(select(fire2, event$))
      )

    const { stateStreamEnhancer } = createStateStreamEnhancer<Action[]>(epic)
    const store = createStore(reducer, stateStreamEnhancer)

    store.dispatch(fire1())
    store.dispatch(fire2())

    expect(store.getState()).toEqual([fire1(), event1(), fire2(), event2()])
  })

  it('should allow you to replace the root epic with middleware.replaceEpic(epic)', () => {
    const epic1: Epic<Action[]> = (event$) =>
      merge(
        pipe(map(() => event1()))(select(fire1, event$)),
        pipe(map(() => event2()))(select(fire2, event$)),
        pipe(map(() => epicGeneric1()))(select(fireGeneric, event$)),
        pipe(map(() => cleanUp()))(select(epicEnd, event$))
      )(Observable.of(epicStart1()))

    const epic2: Epic<Action[]> = (event$) =>
      merge(
        pipe(map(() => event3()))(select(fire3, event$)),
        pipe(map(() => event4()))(select(fire4, event$)),
        pipe(map(() => epicGeneric2()))(select(fireGeneric, event$))
      )(Observable.of(epicStart2()))

    const { replaceEpic, stateStreamEnhancer } = createStateStreamEnhancer<Action[]>(epic1)
    const store = createStore(reducer, stateStreamEnhancer)

    store.dispatch(fire1())
    store.dispatch(fire2())
    store.dispatch(fireGeneric())

    replaceEpic(epic2)

    store.dispatch(fire3())
    store.dispatch(fire4())
    store.dispatch(fireGeneric())

    expect(store.getState()).toEqual([
      epicStart1(),
      fire1(),
      event1(),
      fire2(),
      event2(),
      fireGeneric(),
      epicGeneric1(),
      epicEnd(),
      cleanUp(),
      epicStart2(),
      fire3(),
      event3(),
      fire4(),
      event4(),
      fireGeneric(),
      epicGeneric2()
    ])
  })

  it('should accepts streams at dispatch', async () => {
    const epic: Epic<Action[]> = (event$) =>
      merge(pipe(map(() => event1()))(select(fire1, event$)))(
        pipe(map(() => event2()))(select(fire2, event$))
      )

    const { stateStreamEnhancer } = createStateStreamEnhancer<Action[]>(epic)
    const store = createStore(reducer, stateStreamEnhancer)
    const stream$ = Observable.of(fire1(), fire2())

    await store.dispatch(stream$ as any)

    expect(store.getState()).toEqual([fire1(), event1(), fire2(), event2()])
  })

  it('should handle empty events', () => {
    const { stateStreamEnhancer } = createStateStreamEnhancer<any>(() => Observable.of(null))
    const store = createStore(reducer, stateStreamEnhancer)

    expect(store.getState()).toEqual([])
  })

  it('should handle functions as events', () => {
    expect.assertions(3)
    const { stateStreamEnhancer } = createStateStreamEnhancer<any>(() => Observable.of(null))
    const store = createStore(reducer, stateStreamEnhancer) as any

    store.dispatch((getState: () => any, dispatch: any) => {
      expect(getState()).toEqual([])

      dispatch(fire1())
      expect(getState()).toEqual([fire1()])

      dispatch(Observable.of(fire2()))
      expect(getState()).toEqual([fire1(), fire2()])
    })
  })

  it('should filter other types', async () => {
    const epic: Epic<Action[]> = () => Observable.of(event1())
    const stream$ = Observable.of(event2())

    const { stateStreamEnhancer } = createStateStreamEnhancer<Action[]>(epic)
    const store = createStore(reducer, stateStreamEnhancer)

    await store.dispatch(stream$ as any)
    store.dispatch(event3())
    store.dispatch({ test: 1 } as any)

    expect(store.getState()).toEqual([event1(), event2(), event3()])
  })
})
