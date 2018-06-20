import { createEvent } from '../../core/createEvent/createEvent'
import { VALIDATE } from './constants'

// tslint:disable-next-line no-unused-variable
import { Observable } from 'rxjs'

/**
 * @private
 */
export const asyncValidationStart = createEvent<string>(`${VALIDATE}: async validation started`)

/**
 * @private
 */
export const asyncValidationEnd = createEvent<string>(`${VALIDATE}: async validation finished`)

/**
 * Start revalidating all fields
 */
export const revalidate = createEvent(`${VALIDATE}: force validation`)
