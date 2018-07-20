import 'symbol-observable'
import { Observable } from 'light-observable'
import { of } from 'light-observable/observable'
import { of as RxOf, EMPTY, Observable as RxObservable } from 'rxjs'
import { collectData } from 'stapp/lib/helpers/testHelpers/collectData/collectData'
import { combineEpics } from './combineEpics'

// Models

describe('combineEpics + RxJS', () => {
  it('should return empty epic if no epics provided', async () => {
    // @ts-ignore
    const epic = combineEpics([])
    const data = await collectData(epic())

    expect(data.length).toBe(0)
  })

  it('should combine epics', async () => {
    const epicA = () => RxOf(1)
    const epicB = () => RxOf(2)
    const epicC = () => RxOf(3, 4, 5)
    const epic: any = combineEpics([epicA, epicB, epicC])

    const result = await collectData(epic(of(1), of(1)))

    expect(result).toEqual([1, 2, 3, 4, 5])
  })

  it('should accept epics, that do not return stream', async () => {
    const epicA = () => undefined
    const epicB = () => RxOf(1)

    const epic: any = combineEpics([epicA, epicB])

    const result = await collectData(epic(of(1), of(1)))

    expect(result).toEqual([1])
  })

  it('should wrap light-observable with rxjs from and vice versa', async () => {
    expect.assertions(4)
    const epic = (event$, state$) => {
      expect(event$).toBeInstanceOf(RxObservable)
      expect(state$).toBeInstanceOf(RxObservable)

      return RxOf(1, 2, 3)
    }

    const combined: any = combineEpics([epic])
    const resultStream = combined(of(1), of(2))

    expect(resultStream).toBeInstanceOf(Observable)

    const result = await collectData(resultStream)
    expect(result).toEqual([1, 2, 3])
  })

  it('should provide third argument to epic', () => {
    expect.assertions(1)
    const staticApi: any = {}

    const epic = (_, __, third) => {
      expect(third).toBe(staticApi)
    }

    const combined: any = combineEpics([epic])
    combined(of(1), of(2), staticApi)
  })
})
