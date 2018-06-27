import { createSelector, createStructuredSelector } from 'reselect'
import { FormBaseState } from './formBase.h'

export const isValidSelector = () =>
  createSelector(
    <State extends FormBaseState>(state: State) => state.errors,
    (errors) => Object.keys(errors).every((key) => !errors[key])
  )

export const isReadySelector = () =>
  createSelector(
    <State extends FormBaseState>(state: State) => state.ready,
    (ready) => Object.keys(ready).every((key) => !!ready[key])
  )

export const isDirtySelector = () =>
  createSelector(
    <State extends FormBaseState>(state: State) => state.dirty,
    (dirty) => Object.keys(dirty).some((key) => !!dirty[key])
  )

export const isPristineSelector = () => <State extends FormBaseState>(state: State) =>
  state.pristine

const noop = () => undefined

export const fieldSelector = <State extends FormBaseState, Extra = undefined>(
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
    value: (state: State) => state.values[name],
    error: (state: State) => state.errors[name],
    dirty: (state: State) => !!state.dirty[name],
    touched: (state: State) => !!state.touched[name],
    active: (state: State) => state.active === name,
    extra: extraSelector
  })

export const formSelector = () =>
  createStructuredSelector({
    submitting: (state: any) => !!state.submitting,
    valid: isValidSelector(),
    ready: isReadySelector(),
    dirty: isDirtySelector(),
    pristine: isPristineSelector()
  })
