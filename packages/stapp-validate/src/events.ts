import { createEvent } from 'stapp'
import { VALIDATE } from './constants'

/**
 * @private
 */
export const asyncValidationStart = createEvent<string>(
  `${VALIDATE}: async validation started`
)

/**
 * @private
 */
export const asyncValidationEnd = createEvent<string>(
  `${VALIDATE}: async validation finished`
)

/**
 * Start revalidating all fields
 */
export const revalidate = createEvent<void | string[]>(
  `${VALIDATE}: force validation`
)
