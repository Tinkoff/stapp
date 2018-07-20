import { createEvent } from 'stapp'
import { FORM_BASE } from './constants'

// tslint:disable-next-line
import {
  EmptyEventCreator,
  EventCreator0,
  EventCreator1
} from 'stapp/lib/core/createEvent/createEvent.h'

/**
 * Used to set values for fields
 */
export const setValue = createEvent<{ [K: string]: any }>(
  `${FORM_BASE}: Set field value`
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
export const setTouched = createEvent<{ [K: string]: boolean }>(
  `${FORM_BASE}: Set field as touched`
)

/**
 * Set field as active
 */
export const setActive = createEvent<string | null>(
  `${FORM_BASE}: Set field as active`
)

/**
 * Used to set readiness state
 */
export const setReady = createEvent<{ [K: string]: boolean }>(
  `${FORM_BASE}: Set readiness`
)

/**
 * Used to reset form state
 */
export const resetForm = createEvent(`${FORM_BASE}: Reset form state`)

/**
 * Used to indicate form submission
 */
export const submit = createEvent(`${FORM_BASE}: Submit`, () => undefined)

export const setSubmitting = createEvent<boolean>(
  `${FORM_BASE}: Set submitting`
)
