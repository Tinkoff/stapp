import { createReducer } from 'stapp'
import { has } from 'stapp/lib/helpers/has/has'
import {
  clearFields,
  resetForm,
  setActive,
  setError,
  setReady,
  setSubmitting,
  setTouched,
  setValue
} from './events'

// tslint:disable-next-line
import { Reducer } from 'stapp/lib/core/createReducer/createReducer.h'

/**
 * @private
 */
const mergeIfChanged = <T, K extends keyof T>(o: T, n: Partial<T>) => {
  const keys = Object.keys(n) as K[]
  const changedFields = keys.filter((field) => o[field] !== n[field])

  return changedFields.length !== 0 ? Object.assign({}, o, n) : o
}

/**
 * @private
 */
const replace = <P>(_: any, payload: P) => payload

/**
 * @private
 */
const omit = <S extends { [K: string]: any }>(
  state: S,
  payload: string[]
): S => {
  const result: { [K: string]: any } = {}

  for (const key in state) {
    if (has(key, state) && !payload.includes(key)) {
      result[key] = state[key]
    }
  }

  return result as S
}
/**
 * @private
 */
const mapObject = <T, R, O extends { [K: string]: T }>(
  fn: (element: T, key: string, index: number) => R,
  obj: O
): { [K in keyof O]: R } => {
  return Object.keys(obj).reduce(
    (result, key, index) => {
      result[key] = fn(obj[key], key, index)
      return result
    },
    {} as any
  )
}

/**
 * @private
 */
export const createFormBaseReducers = (initialState: any) => {
  const valuesReducer = createReducer<any>(initialState)
    .on(setValue, mergeIfChanged)
    .on(clearFields, omit)
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
    .reset(resetForm)

  const errorsReducer = createReducer<any>({})
    .on(setError, mergeIfChanged)
    .on(clearFields, omit)
    .reset(resetForm)

  const touchedReducer = createReducer<any>({})
    .on(setTouched, mergeIfChanged)
    .on(clearFields, omit)
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
