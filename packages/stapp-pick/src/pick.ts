import { from } from 'light-observable/observable'
import { filter, map, mergeMap } from 'light-observable/operators'
import { combineEpics, createEvent, createReducer, selectArray } from 'stapp'
import { PICK } from './constants'

// Models
import { Epic, Module } from 'stapp/lib/core/createApp/createApp.h'
import { PickConfig, PickState } from './pick.h'

export const picked = createEvent<Array<string | void>>(
  `${PICK}: State was picked`
)

const pickReducer = createReducer<PickState>([]).on(
  picked,
  (pickState: PickState, pickResult: Array<string | void>) =>
    pickResult || pickState
)

/**
 * Pick module.
 * @typeparam State Application state shape
 * @param on Set of event creators on which module should dispatch react events with select result
 * @param pick Selector to pick data from state
 * @param react Set of event creators which should be dispatched with select result
 * @returns Module
 */
export const pickModule = <State>({
  on,
  pick,
  react
}: PickConfig): Module<{}, { pick: PickState }> => {
  const eventFilter = selectArray(on)

  const pickEpic: Epic<State> = (event$, _, { getState }) =>
    event$.pipe(
      filter(eventFilter),
      map(() => getState()),
      map((state) => pick(state)),
      map(picked)
    )

  const reactEpic: Epic<State> = picked.epic((picked$) =>
    picked$.pipe(
      mergeMap(({ payload }) => from(
        react.map(event => event(payload))
      ))
    )
  )

  return {
    name: PICK,
    state: {
      pick: pickReducer
    },
    epic: combineEpics([pickEpic, reactEpic])
  }
}
