import { of } from 'light-observable/observable'
import { wait } from '../wait/wait'
import { collectEvents } from './collectEvents'

// Models
import { Thunk } from 'stapp'

describe('collectEvents', () => {
  it('should return event if event is provided', async () => {
    const event = { type: 'test' }
    expect(await collectEvents(event)).toEqual([event])
  })

  it('should collect events from provided thunk function', async () => {
    const thunk: Thunk<any, void> = async (getState, dispatch) => {
      dispatch({ type: 'a' })
      dispatch({ type: 'b' })

      await wait(100)

      dispatch({ type: 'c' })
    }

    expect(await collectEvents(thunk)).toEqual([
      { type: 'a' },
      { type: 'b' },
      { type: 'c' }
    ])
  })

  it('should collect events from stream', async () => {
    const epic = of({ type: 'a' }, { type: 'b' }, { type: 'c' })

    expect(await collectEvents(epic)).toEqual([
      { type: 'a' },
      { type: 'b' },
      { type: 'c' }
    ])
  })

  it('should collect events from mixed source', async () => {
    const epic = of({ type: 'c' }, { type: 'd' })

    const thunk: Thunk<any, void> = async (getState, dispatch) => {
      dispatch({ type: 'a' })
      dispatch({ type: 'b' })

      await wait(10)
      await dispatch(epic)
    }

    expect(await collectEvents(thunk)).toEqual([
      { type: 'a' },
      { type: 'b' },
      { type: 'c' },
      { type: 'd' }
    ])
  })

  it('should provided mock state to the thunk', async () => {
    expect.assertions(1)
    const mock = {}
    const thunk: Thunk<any, void> = async (getState) => {
      expect(getState()).toBe(mock)
    }

    await collectEvents(thunk, mock)
  })
})
