import { marbles } from 'rxjs-marbles'
import { empty } from 'rxjs/observable/empty'
import { createEvent } from '../../core/createEvent/createEvent'
import { SOURCE_MODULE } from '../constants'
import { identity } from '../identity/identity'
import { getEpics, mapModule } from './getEpics'

describe('mapModule', () => {
  afterEach(() => {
    process.env.NODE_ENV = undefined
  })

  it('should get an epic from module in production mode', () => {
    process.env.NODE_ENV = 'production'

    const module = {
      epic: {}
    }

    // @ts-ignore
    expect(mapModule(module)).toBe(module.epic)
  })

  it('should return new epic, which calls module epic on init', () => {
    const epic = jest.fn()
    epic.mockReturnValue(empty())

    const module = {
      name: 'test',
      epic
    }

    const mappedEpic = mapModule(module)
    const event$ = {}
    const state$ = {}

    // @ts-ignore
    mappedEpic(event$, state$)

    expect(epic).toBeCalledWith(event$, state$)
  })

  it(
    'returned epic should filter and map events',
    marbles((m) => {
      const a = createEvent()
      const b = createEvent()
      const values = {
        a: a(),
        b: b()
      }
      const valuesWithMeta = {
        a: {
          ...a(),
          meta: { [SOURCE_MODULE]: 'test' }
        },
        b: {
          ...b(),
          meta: { [SOURCE_MODULE]: 'test' }
        }
      }

      const module = {
        name: 'test',
        epic: identity
      }

      const mappedEpic = mapModule(module)
      const event$ = m.cold('--a--b--c--a', values)
      const expected$ = m.cold('--a--b--c--a', valuesWithMeta)
      const state$ = {}

      // @ts-ignore
      const mapped$ = mappedEpic(event$, state$)

      m.expect(mapped$).toBeObservable(expected$)
    })
  )
})

describe('getEpics', () => {
  it('should filter modules without epics', () => {
    const epic = () => undefined
    const modules = [{}, {}, { epic }, {}, { epic }]

    // @ts-ignore
    expect(getEpics(modules)).toHaveLength(2)
  })
})
