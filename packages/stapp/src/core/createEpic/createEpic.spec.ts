import { EMPTY, of } from 'rxjs'
import { identity } from '../../helpers/identity/identity'
import { collectData } from '../../helpers/testHelpers/collectData/collectData'
import { createEvent } from '../createEvent/createEvent'
import { createEpic } from './createEpic'

describe('createEpic', () => {
  it('should create a filtered epic', async () => {
    const a = createEvent()
    const b = createEvent()
    const aEpic = createEpic(a, (event$) => event$)
    const events$ = of(a(), b())
    const result = await collectData(
      aEpic(events$, EMPTY, {
        getState: () => ({}),
        dispatch: (x: any) => x,
        fromESObservable: identity,
        toESObservable: identity
      } as any)
    )

    expect(result).toEqual([a()])
  })

  it('should create a filtered epic from an array of eventCreators', async () => {
    const a = createEvent()
    const b = createEvent()
    const c = createEvent()
    const aEpic = createEpic([a, b], (event$) => event$)
    const events$ = of(a(), b(), c())
    const result = await collectData(
      aEpic(events$, EMPTY, {
        getState: () => ({}),
        dispatch: (x: any) => x,
        fromESObservable: identity,
        toESObservable: identity
      } as any)
    )

    expect(result).toEqual([a(), b()])
  })
})
