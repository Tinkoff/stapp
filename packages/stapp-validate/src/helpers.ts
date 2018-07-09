import { Observable } from 'light-observable'
import { concat, fromPromise, of } from 'light-observable/observable'
import { catchError, switchMap } from 'light-observable/operators'
import { setError, setReady } from 'stapp-formBase'
import { isPromise } from 'stapp/lib/helpers/is/isPromise/isPromise'
import { asyncValidationEnd, asyncValidationStart } from './events'

// Models
import { FormBaseState } from 'stapp-formBase/lib/formBase.h'
import { Event } from 'stapp/lib/core/createEvent/createEvent.h'
import { ValidationFlags, ValidationRule } from './validate.h'

/**
 * @private
 */
export const normalizeResult = (fieldName: string, result: any): Observable<Event<any, any>> => {
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
        of(asyncValidationStart(fieldName), setReady({ [fieldName]: false })),
        result$,
        of(asyncValidationEnd(fieldName), setReady({ [fieldName]: true }))
      )
}
