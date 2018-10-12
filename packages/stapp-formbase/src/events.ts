import { createEvent } from 'stapp'
import { FORM_BASE } from './constants'

// tslint:disable-next-line
import {
  EmptyEventCreator,
  EventCreator0,
  EventCreator1
} from 'stapp/lib/core/createEvent/createEvent.h'

const u = () => undefined

/**
 * Used to set values for fields
 */
export const setValue = createEvent<{ [K: string]: any }>(
  `${FORM_BASE}: Set field value`
)

/**
 * Used to set meta for fields
 */
export const setMeta = createEvent<{ [K: string]: any }>(
  `${FORM_BASE}: Set field meta`
)

/**
 * Used to set errors for fields
 */
export const setError = createEvent<{ [K: string]: any }>(
  `${FORM_BASE}: Set field error`
)

/**
 * Used to set field as touched
 */
export const setTouched = createEvent<{ [K: string]: void | boolean }>(
  `${FORM_BASE}: Set field as touched`
)

/**
 * Set field as active
 */
export const setActive = createEvent<string | number | symbol | null>(
  `${FORM_BASE}: Set field as active`
)

/**
 * Used to set readiness state
 */
export const setReady = createEvent<{ [K: string]: boolean }>(
  `${FORM_BASE}: Set readiness`
)

/**
 * Used to clear fields data
 */
export const clearFields = createEvent<string[]>(`${FORM_BASE}: clear fields`)

/**
 * Used to clear fields data
 */
export const pickFields = createEvent<string[]>(`${FORM_BASE}: pick fields`)

/**
 * Used to reset form state
 */
export const resetForm = createEvent(`${FORM_BASE}: Reset form state`, u)

/**
 * Used to indicate form submission
 */
export const submit = createEvent(`${FORM_BASE}: Submit`, u)

export const setSubmitting = createEvent<boolean>(
  `${FORM_BASE}: Set submitting`
)
