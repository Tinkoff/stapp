import { createReducer } from '../../core/createReducer/createReducer'
import { resetForm } from '../../../../stapp-formBase/src/events'
import { asyncValidationEnd, asyncValidationStart } from './events'

// tslint:disable-next-line no-unused-variable
import { Observable } from 'rxjs'
// tslint:disable-next-line no-unused-variable
import { Reducer } from '../../core/createReducer/createReducer.h'

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
