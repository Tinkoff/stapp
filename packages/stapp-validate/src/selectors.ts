import { createSelector } from 'reselect'

// Models
// tslint:disable-next-line
import { OutputSelector } from 'reselect'
import { ValidationState } from './validate.h'

export const isValidatingSelector = () =>
  createSelector(
    <State extends ValidationState>(state: State) => state.validating,
    (validating) => Object.keys(validating).some((key) => validating[key])
  )
