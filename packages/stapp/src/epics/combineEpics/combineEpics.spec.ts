import { marbles } from 'rxjs-marbles'
import { merge } from 'rxjs/observable/merge'
import { Epic } from '../../core/createApp/createApp.h'
import { combineEpics } from './combineEpics'

// Models

describe('combineEpics', () => {
  it(
    'should combine epics',
    marbles((m) => {
      const epic: Epic<any> = (event$, state$) => merge(event$, state$)
      const tripledEpic = combineEpics([epic, epic, epic])

      const eventSource$ = m.cold('--a--')
      const stateSource$ = m.cold('--b--')
      const expected$ = m.cold('--(ababab)--')

      const result$ = tripledEpic(eventSource$, stateSource$)

      m.expect(result$).toBeObservable(expected$)
    })
  )
})
