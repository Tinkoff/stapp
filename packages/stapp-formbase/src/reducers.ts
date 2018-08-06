import { createReducer } from 'stapp'
import { omit } from 'stapp/lib/utils/omit/omit'
import { pick } from 'stapp/lib/utils/pick/pick'
import {
  clearFields,
  pickFields,
  resetForm,
  setActive,
  setError,
  setReady,
  setSubmitting,
  setTouched,
  setValue
} from './events'
import { mapObject, mergeIfChanged, replace } from './helpers'

// tslint:disable-next-line
import { Reducer } from 'stapp/lib/core/createReducer/createReducer.h'

/**
 * @private
 */
export const createFormBaseReducers = (initialState: any) => {
  const valuesReducer = createReducer<any>(initialState)
    .on(setValue, mergeIfChanged)
    .on(clearFields, omit)
    .on(pickFields, pick)
    .reset(resetForm)

  const dirtyReducer = createReducer<any>({})
    .on(setValue, (dirty, values) =>
      mergeIfChanged(
        dirty,
        mapObject(
          (element, key) => element !== (initialState[key] || ''),
          values
        )
      )
    )
    .on(clearFields, omit)
    .on(pickFields, pick)
    .reset(resetForm)

  const errorsReducer = createReducer<any>({})
    .on(setError, mergeIfChanged)
    .on(clearFields, omit)
    .on(pickFields, pick)
    .reset(resetForm)

  const touchedReducer = createReducer<any>({})
    .on(setTouched, mergeIfChanged)
    .on(clearFields, omit)
    .on(pickFields, pick)
    .reset(resetForm)

  const readyReducer = createReducer<any>({})
    .on(setReady, mergeIfChanged)
    .reset(resetForm)

  const activeReducer = createReducer<any>(null)
    .on(setActive, replace)
    .on(
      clearFields,
      (state, payload) => (payload.includes(state as string) ? null : state)
    )
    .on(
      pickFields,
      (state, payload) => (payload.includes(state as string) ? state : null)
    )
    .reset(resetForm)

  const pristineReducer = createReducer(true)
    .on([setValue, setTouched], () => false)
    .reset(resetForm)

  const submittingReducer = createReducer(false)
    .on(setSubmitting, replace)
    .reset(resetForm)

  return {
    values: valuesReducer,
    errors: errorsReducer,
    touched: touchedReducer,
    ready: readyReducer,
    active: activeReducer,
    dirty: dirtyReducer,
    pristine: pristineReducer,
    submitting: submittingReducer
  }
}
