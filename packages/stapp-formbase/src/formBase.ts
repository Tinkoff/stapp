import { FORM_BASE } from './constants'
import {
  clearFields,
  pickFields,
  resetForm,
  setActive,
  setError,
  setMeta,
  setReady,
  setSubmitting,
  setTouched,
  setValue,
  submit
} from './events'
import { FormBaseConfig, FormBaseState } from './formBase.h'
import { createFormBaseReducers } from './reducers'

// Models
import { Module } from 'stapp'

/**
 * Base form module
 * @typeparam FormValues Application state shape
 * @typeparam ReadyKeys List of fields used for readiness reducer
 */
export const formBase = <
  FormValues extends { [K: string]: any },
  ErrorType = any
>(
  config: FormBaseConfig<FormValues> = {}
): Module<
  {
    formBase: {
      clearFields: (fields: Array<keyof FormValues>) => void
      pickFields: (fields: Array<keyof FormValues>) => void
      resetForm: () => void
      setActive: (field: keyof FormValues) => void
      setError: (errors: { [K in keyof FormValues]?: ErrorType }) => void
      setReady: (ready: { [K: string]: boolean }) => void
      setSubmitting: (isSubmitting: boolean) => void
      setTouched: (touched: { [K in keyof FormValues]?: boolean }) => void
      setValue: (values: Partial<FormValues>) => void
      setMeta: (meta: Partial<FormValues>) => void
      submit: () => void
    }
  },
  FormBaseState<FormValues>
> => ({
  name: FORM_BASE,
  state: createFormBaseReducers(config.initialValues || {}),
  api: {
    formBase: {
      clearFields,
      pickFields,
      resetForm,
      setActive,
      setError,
      setReady,
      setSubmitting,
      setTouched,
      setValue,
      setMeta,
      submit
    }
  },
  useGlobalObservableConfig: false
})
