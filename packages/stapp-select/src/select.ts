import { from } from 'light-observable/observable'
import { filter, map, mergeMap } from 'light-observable/operators'
import { combineEpics, createEvent, createReducer, selectArray } from 'stapp'
import { SELECT } from './constants'

// Models
import { Epic, Module } from 'stapp/lib/core/createApp/createApp.h'
import { SelectConfig } from './select.h'

/**
 * Select module.
 * @typeparam State Application state shape
 * @param name Name of reducer
 * @param reactOn Set of event creators on which module should dispatch react events with select result
 * @param selector Selector to pick data from state
 * @param reactWith Set of event creators which should be dispatched with select result
 * @returns Module
 */
export const select = <State, Result, Name extends string>(
  config: SelectConfig<State, Result, Name>
): Module<{}, { [K in Name]: Result }> => {
  const selected = createEvent<any>(`${SELECT}: State was selected`)
  const selectReducer = createReducer<any>(null).on(
    selected,
    (state: any, selectResult: any) => selectResult || state
  )

  const { name, selector, reactOn, reactWith = [] } = config
  const eventFilter = selectArray(reactOn)

  // always dispatch selected even if reactWith is empty
  reactWith.push(selected)

  const reactEpic: Epic<State> = (event$, _, { getState }) =>
    event$.pipe(
      filter(eventFilter),
      map(() => selector(getState())),
      mergeMap((result) =>
        from(reactWith.map((eventCreator) => eventCreator(result)))
      )
    )

  return {
    name: SELECT,
    state: {
      [name]: selectReducer
    },
    epic: combineEpics([reactEpic])
  } as any
}
