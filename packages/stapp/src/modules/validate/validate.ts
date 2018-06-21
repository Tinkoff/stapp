import { empty } from 'rxjs/observable/empty'
import { merge } from 'rxjs/observable/merge'
import { filter } from 'rxjs/operators/filter'
import { map } from 'rxjs/operators/map'
import { mapTo } from 'rxjs/operators/mapTo'
import { share } from 'rxjs/operators/share'
import { switchMap } from 'rxjs/operators/switchMap'
import { withLatestFrom } from 'rxjs/operators/withLatestFrom'
import { combineEpics } from '../../epics/combineEpics/combineEpics'
import { select } from '../../epics/select/select'
import { initDone } from '../../events/initDone'
import { FORM_BASE } from '../../../../stapp-formBase/src/constants'
import { setTouched, setValue, submit } from '../../../../stapp-formBase/src/events'
import { VALIDATE } from './constants'
import { revalidate } from './events'
import { runValidation } from './helpers'
import { validateReducer } from './reducers'

// Models
import { Observable } from 'rxjs/Observable'
import { Epic, Module } from '../../core/createApp/createApp.h'
import { FormBaseState } from '../../../../stapp-formBase/src/formBase.h'
import { ValidateConfig, ValidationFlags } from './validate.h'

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
}: ValidateConfig<State>): Module<{}, { validating: { [K: string]: boolean } }> => {
  const fieldNames = Object.keys(rules).filter(
    // tslint:disable-next-line strict-type-predicates
    (fieldName) => typeof rules[fieldName] === 'function'
  )
  const allFields = getFieldsObject(fieldNames)
  const setTouchedEvent = setTouched(allFields)

  const validateEpic: Epic<State> = (event$, state$) => {
    const setValue$: Observable<{ fields: { [K: string]: true }; flags: ValidationFlags }> = select(
      setValue,
      event$
    ).pipe(
      map(({ payload }) => ({
        fields: getFieldsObject(Object.keys(payload)),
        flags: { onChange: true }
      }))
    )

    const initDone$: Observable<{ fields: { [K: string]: true }; flags: ValidationFlags }> = select(
      initDone,
      event$
    ).pipe(
      mapTo({
        fields: allFields,
        flags: { onInit: true }
      })
    )

    const revalidate$: Observable<{
      fields: { [K: string]: true }
      flags: ValidationFlags
    }> = select(revalidate, event$).pipe(
      mapTo({
        fields: allFields,
        flags: { onRevalidate: true }
      })
    )

    const toValidate$ = merge(
      setValue$,
      validateOnInit ? initDone$ : empty<any>(),
      revalidate$
    ).pipe(
      withLatestFrom(state$),
      map(([{ fields, flags }, state]) => ({
        fields,
        state,
        flags
      })),
      share()
    )

    return merge(
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
      return empty()
    }

    return submit$.pipe(mapTo(setTouchedEvent))
  })

  return {
    name: VALIDATE,
    state: {
      validating: validateReducer
    },
    epic: combineEpics([validateEpic, setTouchedOnSubmitEpic]),
    dependencies: [FORM_BASE]
  }
}
