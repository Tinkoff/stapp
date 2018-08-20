import { from } from 'light-observable/observable'
import { filter, map, mergeMap } from 'light-observable/operators'
import { createEvent, createReducer, initDone, selectArray } from 'stapp'
import { SELECT } from './constants'

// Models
import { Epic, Module } from 'stapp/lib/core/createApp/createApp.h'
import { SelectConfig } from './select.h'

export const select = <State, Result, Name extends string>({
  name,
  selector,
  reactOn,
  reactWith = []
}: SelectConfig<State, Result, Name>): Module<
  {},
  { [K in Name]: Result | null }
> => {
  const selected = createEvent<Result>(`${SELECT}/${name}: State was selected`)
  const selectReducer = createReducer<Result | null>(null).on(
    selected,
    (state, selectResult) => selectResult || state
  )

  const eventFilter = selectArray(reactOn.concat(initDone))
  const events = reactWith.concat(selected)

  const reactEpic: Epic<State> = (event$, _, { getState }) => {
    return event$.pipe(
      filter(eventFilter),
      map(() => selector(getState())),
      mergeMap((result) =>
        from(events.map((eventCreator) => eventCreator(result)))
      )
    )
  }

  return {
    name: `${SELECT}/${name}`,
    state: {
      [name]: selectReducer
    },
    epic: reactEpic
  } as any
}
