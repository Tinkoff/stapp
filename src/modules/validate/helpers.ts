import { concat } from 'rxjs/observable/concat'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { of } from 'rxjs/observable/of'
import { catchError } from 'rxjs/operators/catchError'
import { switchMap } from 'rxjs/operators/switchMap'
import { isPromise } from '../../helpers/isPromise/isPromise'
import { setError, setReady } from '../formBase/events'
import { asyncValidationEnd, asyncValidationStart } from './events'

// Models
import { Observable } from 'rxjs'
import { Event } from '../../core/createEvent/createEvent.h'
import { FormBaseState } from '../formBase/formBase.h'
import { ValidationFlags, ValidationRule } from './validate.h'

/**
 * @private
 */
export const normalizeResult = (
  fieldName: string,
  result: any
): Observable<Event<any, any>> => {
  // if it's a promise, unwrap
  if (isPromise(result)) {
    return fromPromise(result).pipe(
      switchMap((promiseResult) => normalizeResult(fieldName, promiseResult)),
      catchError((error) => of(setError({ [fieldName]: error })))
    )
  }

  // if it's a plain object, return
  if (result != null && typeof result === 'object') {
    return of(setError(result))
  }

  // in all other cases wrap to an object
  return of(
    setError({
      [fieldName]: result
    })
  )
}

/**
 * @private
 */
export const runValidation = <State extends FormBaseState>(
  state: State,
  fieldName: string,
  rule: ValidationRule<State>,
  flags: ValidationFlags
): Observable<Event<any, any>> => {
  let result: any

  try {
    result = rule(state.values[fieldName], fieldName, state, flags)
  } catch (error) {
    result = error
  }

  const syncMode = !isPromise(result)
  const result$ = normalizeResult(fieldName, result)

  return syncMode
    ? result$
    : concat(
        of<Event<any, any>>(asyncValidationStart(fieldName), setReady({ [fieldName]: false })),
        result$,
        of<Event<any, any>>(asyncValidationEnd(fieldName), setReady({ [fieldName]: true }))
      )
}
