import { Observable, Subscription } from 'light-observable'
import { initDone } from '../../events/initDone'
import { controlledPromise } from '../../helpers/controlledPromise/controlledPromise'
import { getEventType } from '../../helpers/getEventType/getEventType'
import { AnyEventCreator, Event } from '../createEvent/createEvent.h'

export const getReadyPromise = <State>(
  event$: Observable<Event<any, any>>,
  getState: () => Partial<State>,
  waitFor: Array<AnyEventCreator | string>
): Promise<Partial<State>> => {
  const [promise, resolve] = controlledPromise<Partial<State>>()
  const toWait = new Set<string>(
    waitFor.map(getEventType).concat(initDone.getType())
  )
  let ready = false
  let subscription: Subscription

  event$.subscribe({
    start(s) {
      subscription = s
    },
    next(event) {
      if (ready) {
        return
      }

      toWait.delete(event.type)

      if (toWait.size === 0) {
        ready = true
        resolve(getState())
      }
    }
  })

  return promise
}
