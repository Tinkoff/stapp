import { createReducer } from 'stapp'
import { resetForm } from 'stapp-formbase'
import { asyncValidationEnd, asyncValidationStart } from './events'

/**
 * @private
 */
export const validateReducer = createReducer<{ [K: string]: boolean }>({})
  .on(
    asyncValidationStart,
    /* istanbul ignore next */
    (validating, name) =>
      validating[name]
        ? validating
        : {
            ...validating,
            [name]: true
          }
  )
  .on(
    asyncValidationEnd,
    /* istanbul ignore next */
    (validating, name) =>
      !validating[name]
        ? validating
        : {
            ...validating,
            [name]: false
          }
  )
  .reset(resetForm)
