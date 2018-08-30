import { createSelector, createStructuredSelector } from 'reselect'

// Models
import { FormBaseState } from './formBase.h'

export const isValidSelector = () => {
  return createSelector(
    <State extends FormBaseState>(state: State) => state.errors,
    (errors) =>
      errors ? Object.keys(errors).every((key) => !errors[key]) : true
  )
}

export const isReadySelector = () => {
  return createSelector(
    <State extends FormBaseState>(state: State) => state.ready,
    (ready) => (ready ? Object.keys(ready).every((key) => !!ready[key]) : true)
  )
}

export const isDirtySelector = () => {
  return createSelector(
    <State extends FormBaseState>(state: State) => state.dirty,
    (dirty) => (dirty ? Object.keys(dirty).some((key) => !!dirty[key]) : false)
  )
}

export const isPristineSelector = () => <
  State extends Pick<FormBaseState, 'pristine'>
>(
  state: State
) => state.pristine

const noop = () => undefined

export const fieldSelector = <State extends FormBaseState, Extra>(
  name: string,
  extraSelector: ((state: State) => Extra) = noop as any
) =>
  createStructuredSelector<
    State,
    {
      value: any
      error: any
      dirty: boolean
      touched: boolean
      active: boolean
      extra: Extra
    }
  >({
    value: (state: State) => (state.values ? state.values[name] : undefined),
    error: (state: State) => (state.errors ? state.errors[name] : undefined),
    dirty: (state: State) => (state.dirty ? !!state.dirty[name] : false),
    touched: (state: State) => (state.touched ? !!state.touched[name] : false),
    active: (state: State) => state.active === name,
    extra: extraSelector
  })

export const formSelector = () =>
  createStructuredSelector({
    submitting: <State extends FormBaseState>(state: State) =>
      !!state.submitting,
    valid: isValidSelector(),
    ready: isReadySelector(),
    dirty: isDirtySelector(),
    pristine: isPristineSelector()
  })
