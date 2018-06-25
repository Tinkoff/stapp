/* tslint:disable strict-type-predicates */
import $$observable from 'symbol-observable'

type Listener<T> = (value: T) => void
type Unsubscribe = {
  unsubscribe (): void
}
type Observer<T> = {
  next: Listener<T>
  [K: string]: any
  [K: number]: any
}

type Subject<T> = {
  closed: boolean
  subscribe (observer: Observer<T> | Listener<T>): Unsubscribe
  next (value: T): void
  error (reason: any): void
  complete (): void
}

export const behaviorSubject = <T>(initialValue: T): Subject<T> => {
  const observers: Array<Observer<T>> = []
  let closed = false
  let lastValue: T = initialValue

  return {
    get closed () {
      return closed
    },
    subscribe(_observer: Observer<T> | Listener<T>) {
      if (closed) {
        return {
          // tslint:disable-next-line no-empty
          unsubscribe () {}
        }
      }

      if (
        (typeof _observer !== 'object'
        && typeof _observer !== 'function')
        || _observer === null
      ) {
        throw new TypeError('Expected the observer to be an object or a function.')
      }

      const observer: Observer<T> = typeof _observer === 'function' ? {
        next: _observer
      } : _observer

      observer.next(lastValue)
      observers.push(observer)

      return {
        unsubscribe () {
          observers.splice(observers.indexOf(observer), 1)
        }
      }
    },

    next(value: T) {
      lastValue = value
      observers.forEach(observer => observer.next && observer.next(lastValue))
    },

    error(reason: any) {
      closed = true
      observers.forEach(observer => observer.error && observer.error(reason))
    },

    complete() {
      closed = true
      observers.forEach(observer => observer.complete && observer.complete())
    },

    [$$observable] () {
      return this
    }
  }
}