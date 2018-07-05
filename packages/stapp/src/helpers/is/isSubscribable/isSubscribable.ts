import { Subscribable } from 'light-observable'

export const isSubscribable = <T>(value: any): value is Subscribable<T> => {
  return Boolean(value && value.subscribe && typeof value.subscribe === 'function')
}
