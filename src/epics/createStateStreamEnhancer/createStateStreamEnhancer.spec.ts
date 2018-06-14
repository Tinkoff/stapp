import { Action, applyMiddleware, compose, createStore } from 'redux'
import { Observable } from 'rxjs/Observable'
import { empty } from 'rxjs/observable/empty'
import { merge } from 'rxjs/observable/merge'
import { of } from 'rxjs/observable/of'
import { mapTo } from 'rxjs/operators/mapTo'
import { createEvent } from '../../core/createEvent/createEvent'
import { epicEnd } from '../../events/epicEnd'
import { select } from '../select/select'
import { createStateStreamEnhancer } from './createStateStreamEnhancer'

// Models
import { Epic } from '../../core/createApp/createApp.h'

describe('createStateStreamEnhancer', () => {
  const reducer = (state: Action[] = [], event: Action) => state.concat(event)
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
  const init = { type: '@@redux/INIT' }

  it('should provide epics a stream of event$ and stream of state$', (done) => {
    expect.assertions(3)

    const epic = jest.fn()
    epic.mockReturnValue(empty())

    const mockMiddleware = () => () => () => {
      expect(epic).toBeCalled()
      expect(epic.mock.calls[0][0]).toBeInstanceOf(Observable)
      expect(epic.mock.calls[0][1]).toBeInstanceOf(Observable)
      done()
    }

    const { stateStreamEnhancer } = createStateStreamEnhancer<Action[]>(epic)
    const store = createStore(
      reducer,
      compose(stateStreamEnhancer, applyMiddleware(mockMiddleware as any))
    )
    store.dispatch({ type: 'FIRST_ACTION_TO_TRIGGER_MIDDLEWARE' })
  })

  it('should accept an epic that wires up event$ input to event$ out', () => {
    const epic: Epic<Action[]> = (event$) =>
      merge(
        select(fire1, event$).pipe(mapTo(event1())),
        select(fire2, event$).pipe(mapTo(event2()))
      )

    const { stateStreamEnhancer } = createStateStreamEnhancer<Action[]>(epic)
    const store = createStore(reducer, stateStreamEnhancer)

    store.dispatch(fire1())
    store.dispatch(fire2())

    expect(store.getState()).toEqual([init, fire1(), event1(), fire2(), event2()])
  })

  it('should allow you to replace the root epic with middleware.replaceEpic(epic)', () => {
    const epic1: Epic<Action[]> = (event$) =>
      merge(
        of(epicStart1()),
        select(fire1, event$).pipe(mapTo(event1())),
        select(fire2, event$).pipe(mapTo(event2())),
        select(fireGeneric, event$).pipe(mapTo(epicGeneric1())),
        select(epicEnd, event$).pipe(mapTo(cleanUp()))
      )

    const epic2: Epic<Action[]> = (event$) =>
      merge(
        of(epicStart2()),
        select(fire3, event$).pipe(mapTo(event3())),
        select(fire4, event$).pipe(mapTo(event4())),
        select(fireGeneric, event$).pipe(mapTo(epicGeneric2()))
      )

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
      init,
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
      merge(
        select(fire1, event$).pipe(mapTo(event1())),
        select(fire2, event$).pipe(mapTo(event2()))
      )

    const { stateStreamEnhancer } = createStateStreamEnhancer<Action[]>(epic)
    const store = createStore(reducer, stateStreamEnhancer)
    const stream$ = of(fire1(), fire2())

    await store.dispatch(stream$ as any)

    expect(store.getState()).toEqual([init, fire1(), event1(), fire2(), event2()])
  })

  it('should handle empty events', () => {
    const { stateStreamEnhancer } = createStateStreamEnhancer<any>(() => of(null))
    const store = createStore(reducer, stateStreamEnhancer)

    expect(store.getState()).toEqual([init])
  })

  it('should handle functions as events', () => {
    const { stateStreamEnhancer } = createStateStreamEnhancer<any>(() => of(null))
    const store = createStore(reducer, stateStreamEnhancer) as any

    store.dispatch((getState: () => any, dispatch: any) => {
      expect(getState()).toEqual([init])

      dispatch(fire1())
      expect(getState()).toEqual([init, fire1()])

      dispatch(of(fire2()))
      expect(getState()).toEqual([init, fire1(), fire2()])
    })
  })

  it('should filter other types', async () => {
    const epic: Epic<Action[]> = () => of(event1())
    const stream$ = of(event2())

    const { stateStreamEnhancer } = createStateStreamEnhancer<Action[]>(epic)
    const store = createStore(reducer, stateStreamEnhancer)

    await store.dispatch(stream$ as any)
    store.dispatch(event3())
    store.dispatch({ test: 1 } as any)

    expect(store.getState()).toEqual([init, event1(), event2(), event3()])
  })
})
