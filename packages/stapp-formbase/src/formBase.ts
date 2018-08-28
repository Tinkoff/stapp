import { FORM_BASE } from './constants'
import { FormBaseConfig, FormBaseState } from './formBase.h'
import { createFormBaseReducers } from './reducers'

// Models
import { Module } from 'stapp/lib/core/createApp/createApp.h'

/**
 * Base form module
 * @typeparam FormValues Application state shape
 * @typeparam ReadyKeys List of fields used for readiness reducer
 */
export const formBase = <FormValues, ReadyKeys extends string = any>(
  config: FormBaseConfig<FormValues> = {}
): Module<{}, FormBaseState<FormValues, ReadyKeys>> => ({
  name: FORM_BASE,
  state: createFormBaseReducers(config.initialValues || {}),
  useGlobalObservableConfig: false
})
