import { createSelector } from 'reselect'

// Models
import { ValidationState } from './validate.h'

export const isValidatingSelector = () => {
  return createSelector(
    <State extends ValidationState>(state: State) => state.validating,
    (validating) =>
      validating
        ? Object.keys(validating).some((key) => validating[key])
        : false
  )
}
