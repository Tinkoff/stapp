import { createSelector, Selector } from 'reselect'

// Models
import { ValidationState } from './validate.h'

export const isValidatingSelector: <
  State extends ValidationState
>() => Selector<State, boolean> = () => {
  return createSelector(
    <State extends ValidationState>(state: State) => state.validating,
    (validating) =>
      validating
        ? Object.keys(validating).some((key) => validating[key])
        : false
  )
}
