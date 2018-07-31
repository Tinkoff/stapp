import { EMPTY, from, merge } from 'light-observable/observable'
import {
  filter,
  groupBy,
  map,
  mergeMap,
  switchMap
} from 'light-observable/operators'
import { combineEpics, select } from 'stapp'
import { FORM_BASE, setTouched, setValue, submit } from 'stapp-formbase'
import { initDone } from 'stapp/lib/events/initDone'
import { VALIDATE } from './constants'
import { revalidate } from './events'
import { runValidation } from './helpers'
import { validateReducer } from './reducers'

// Models
import { FormBaseState } from 'stapp-formbase/lib/formBase.h'
import { Epic, Module } from 'stapp/lib/core/createApp/createApp.h'
import {
  ValidateConfig,
  ValidationFlags,
  ValidationRules,
  ValidationState
} from './validate.h'

const emptyEpic = () => EMPTY

export const validate = <State extends FormBaseState>({
  validateOnInit = true,
  setTouchedOnSubmit = true,
  rules
}: ValidateConfig<State>): Module<{}, ValidationState> => {
  const getRules = (state: State): ValidationRules<State> => {
    return typeof rules === 'function' ? rules(state) : rules
  }

  const mapValues = (
    state: State,
    flags: ValidationFlags,
    fields?: string[]
  ) => {
    const nextRules = getRules(state)
    const nextFields = fields || Object.keys(nextRules)

    return from(
      nextFields.map((field) => ({
        field,
        value: state.values[field],
        rule: nextRules[field],
        flags
      }))
    )
  }

  type Res = ReturnType<typeof mapValues>

  const validateEpic: Epic<State> = (event$, state$, { getState }) => {
    const setValue$: Res = event$.pipe(
      filter(select(setValue)),
      mergeMap((event) => {
        return mapValues(
          getState(),
          { onChange: true },
          Object.keys(event.payload)
        )
      }),
      filter(({ rule }) => !!rule)
    )

    const initDone$: Res = validateOnInit
      ? event$.pipe(
          filter(select(initDone)),
          mergeMap(() => {
            return mapValues(getState(), { onInit: true })
          })
        )
      : EMPTY

    const revalidate$: Res = event$.pipe(
      filter(select(revalidate)),
      mergeMap(() => {
        return mapValues(getState(), { onRevalidate: true })
      })
    )

    return merge(setValue$, revalidate$, initDone$).pipe(
      groupBy((res) => res.field),
      mergeMap((field$) =>
        field$.pipe(
          switchMap((res) =>
            runValidation(getState(), res.field, res.rule, res.flags)
          )
        )
      )
    )
  }

  // Set all fields that have validation rules as touched
  const setTouchedOnSubmitEpic = setTouchedOnSubmit
    ? submit.epic<State>((submit$, _, { getState }) => {
        return submit$.pipe(
          map(() => {
            const fields = Object.keys(getRules(getState()))
            return setTouched(
              fields.reduce((result: { [K: string]: true }, field) => {
                result[field] = true
                return result
              }, {})
            )
          })
        )
      })
    : emptyEpic

  return {
    name: VALIDATE,
    state: {
      validating: validateReducer
    },
    epic: combineEpics([validateEpic, setTouchedOnSubmitEpic]) as any,
    dependencies: [FORM_BASE]
  }
}
