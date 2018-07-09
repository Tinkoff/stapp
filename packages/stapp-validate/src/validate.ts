import { EMPTY, merge } from 'light-observable/observable'
import { filter, map, mapTo } from 'light-observable/operators'
import { switchMap } from 'light-observable/operators/switchMap'
import { combineEpics, select } from 'stapp'
import { FORM_BASE, setTouched, setValue, submit } from 'stapp-formBase'
import { initDone } from 'stapp/lib/events/initDone'
import { VALIDATE } from './constants'
import { revalidate } from './events'
import { runValidation } from './helpers'
import { validateReducer } from './reducers'

// Models
import { Observable } from 'light-observable'
import { FormBaseState } from 'stapp-formBase/lib/formBase.h'
import { Epic, Module } from 'stapp/lib/core/createApp/createApp.h'
import { ValidateConfig, ValidationFlags, ValidationState } from './validate.h'

/**
 * @private
 */
const getFieldsObject = (fields: string[]) =>
  fields.reduce((result: { [K: string]: true }, field) => {
    result[field] = true
    return result
  }, {})

export const validate = <State extends FormBaseState>({
  validateOnInit = true,
  setTouchedOnSubmit = true,
  rules
}: ValidateConfig<State>): Module<{}, ValidationState> => {
  const fieldNames = Object.keys(rules).filter(
    // tslint:disable-next-line strict-type-predicates
    (fieldName) => typeof rules[fieldName] === 'function'
  )
  const allFields = getFieldsObject(fieldNames)
  const setTouchedEvent = setTouched(allFields)

  const validateEpic: Epic<State> = (event$, state$, { getState }) => {
    const setValue$: Observable<{
      fields: { [K: string]: true }
      flags: ValidationFlags
    }> = event$.pipe(
      filter(select(setValue)),
      map(({ payload }) => ({
        fields: getFieldsObject(Object.keys(payload)),
        flags: { onChange: true }
      }))
    )

    const initDone$: Observable<{
      fields: { [K: string]: true }
      flags: ValidationFlags
    }> = event$.pipe(
      filter(select(initDone)),
      mapTo({
        fields: allFields,
        flags: { onInit: true }
      })
    )

    const revalidate$: Observable<{
      fields: { [K: string]: true }
      flags: ValidationFlags
    }> = event$.pipe(
      filter(select(revalidate)),
      mapTo({
        fields: allFields,
        flags: { onRevalidate: true }
      })
    )

    const toValidate$ = merge(setValue$, revalidate$, validateOnInit ? initDone$ : EMPTY).pipe(
      // TODO: add share operator after it becomes available
      map(({ fields, flags }) => ({
        fields,
        state: getState(),
        flags
      }))
    )

    return (merge as any)(
      ...fieldNames.map((fieldName) => {
        const fieldRule = rules[fieldName]

        return toValidate$.pipe(
          filter(({ fields }) => !!fields[fieldName]),
          switchMap(({ state, flags }) => runValidation(state, fieldName, fieldRule, flags))
        )
      })
    )
  }
  // Set all fields that have validation rules as touched
  const setTouchedOnSubmitEpic: Epic<State> = submit.epic((submit$) => {
    if (!setTouchedOnSubmit) {
      return EMPTY
    }

    return submit$.pipe(mapTo(setTouchedEvent))
  })

  return {
    name: VALIDATE,
    state: {
      validating: validateReducer
    },
    epic: combineEpics([validateEpic, setTouchedOnSubmitEpic]) as any,
    dependencies: [FORM_BASE]
  }
}
