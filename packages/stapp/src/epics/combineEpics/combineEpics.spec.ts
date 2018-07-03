import { EMPTY, Observable } from 'light-observable'
import { Epic } from '../../core/createApp/createApp.h'
import { collectData } from '../../helpers/testHelpers/collectData/collectData'
import { combineEpics } from './combineEpics'

// Models

describe('combineEpics', () => {
  it('should return empty epic if no epics provided', async () => {
    // @ts-ignore
    const epic = combineEpics([])
    const data = await collectData(epic())

    expect(data.length).toBe(0)
  })

  it('should return first epic, if only one provided', () => {
    const epic = () => EMPTY
    expect(combineEpics([epic])).toBe(epic)
  })

  it('should combine epics', async () => {
    const epicA = () => Observable.of(1)
    const epicB = () => Observable.of(2)
    const epicC = () => Observable.of(3, 4, 5)
    const epic: any = combineEpics([epicA, epicB, epicC])

    const result = await collectData(epic())

    expect(result).toEqual([1, 2, 3, 4, 5])
  })

  it('should pass arguments to epics', async () => {
    const epicA = (event$: any, state$: any) => {
      event$('epicA: event$')
      state$('epicA: state$')
      return Observable.of(1)
    }
    const epicB = (event$: any, state$: any) => {
      event$('epicB: event$')
      state$('epicB: state$')
      return Observable.of(1)
    }
    const combined = combineEpics([epicA, epicB])
    const e = jest.fn()
    const s = jest.fn()

    await collectData(combined(e as any, s as any))

    expect(e.mock.calls).toEqual([['epicA: event$'], ['epicB: event$']])
    expect(s.mock.calls).toEqual([['epicA: state$'], ['epicB: state$']])
  })
})
