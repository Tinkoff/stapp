import { createEvent, createReducer, combineEpics, selectArray } from 'stapp'
import { filter, map } from 'light-observable/operators'
import { PICK } from './constants'

// Models
import { Epic, Module } from 'stapp/lib/core/createApp/createApp.h'
import { PickConfig, PickState } from './pick.h'

export const picked = createEvent<string>(`${PICK}: State was picked`)

const pickReducer = createReducer<PickState>([]).on(
  picked,
  (pickState, pickResult) => pickResult || pickState
)

/**
 * Pick module.
 * @typeparam State Application state shape
 * @param on Set of event creators on which module should dispatch react events with select result
 * @param select Selector to pick data from state
 * @param react Set of event creators which should be dispatched with select result
 * @returns Module
 */
export const pick = <State>({
  on,
  select,
  react
}: PickConfig): Module<{}, { pick: PickState }> => {
  const pickEpic: Epic<State> = (events$, _, { getState }) =>
    events$.pipe(
      filter(selectArray(on)),
      map(() => select(getState())),
      map(picked)
    )

  const reactEpic: Epic<State> = picked.epic((picked$) =>
    picked$.pipe(map(({ payload: pickResult }) => react(pickResult)))
  )

  return {
    name: PICK,
    state: {
      pick: pickReducer
    },
    epic: combineEpics([pickEpic, reactEpic])
  }
}
