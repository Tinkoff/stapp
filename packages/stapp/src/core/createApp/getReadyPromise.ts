// tslint:disable no-use-before-declare
import { Observable, Subscription } from 'light-observable'
import { initEvent } from '../../events/lifecycle'
import { controlledPromise } from '../../helpers/controlledPromise/controlledPromise'
import { getEventType } from '../../helpers/getEventType/getEventType'
import { AnyEventCreator, Event } from '../createEvent/createEvent.h'
import { WaitFor } from './createApp.h'

const isEvent = (ev: any): ev is AnyEventCreator | string => {
  return typeof ev === 'string' || typeof ev === 'function'
}

export const getReadyPromise = <State>(
  event$: Observable<Event<any, any>>,
  getState: () => Partial<State>,
  waitFor: WaitFor<State>
): Promise<Partial<State>> => {
  const initialState = getState()
  const [promise, resolve] = controlledPromise<Partial<State>>()
  const toWait = new Set<string>(
    waitFor.reduce(
      (result, event) => {
        if (isEvent(event)) {
          result.push(getEventType(event))
          return result
        }

        if (event.condition && !event.condition(initialState)) {
          return result
        }

        const type = getEventType(event.event)

        if (event.timeout) {
          setTimeout(() => {
            removeEvent(type)
          }, event.timeout)
        }

        result.push(type)
        return result
      },
      [initEvent.getType()]
    )
  )
  const removeEvent = (type: string) => {
    // We shouldn't get here due to the unsubscribing, just in case
    /* istanbul ignore next */
    if (ready) {
      return
    }

    toWait.delete(type)

    if (toWait.size === 0) {
      ready = true
      resolve(getState())
      subscription.unsubscribe()
    }
  }

  let ready = false
  let subscription: Subscription

  event$.subscribe({
    start(s) {
      subscription = s
    },
    next(event) {
      removeEvent(event.type)
    }
  })

  return promise
}
