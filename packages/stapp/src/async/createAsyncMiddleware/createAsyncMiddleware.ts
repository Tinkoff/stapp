import { Middleware } from 'redux'
import { initDone } from '../../events/initDone'
import { COMPLETE } from '../../helpers/constants'
import { controlledPromise } from '../../helpers/controlledPromise/controlledPromise'
import { getEventType } from '../../helpers/getEventType/getEventType'
import { has } from '../../helpers/has/has'
import { isArray } from '../../helpers/is/isArray/isArray'

// Models
import { AnyEventCreator, Event } from '../../core/createEvent/createEvent.h'
import { CompleteMeta } from './createAsyncMiddleware.h'

/**
 * @private
 */
export function createAsyncMiddleware<State>(
  eventCreators: Array<AnyEventCreator | string> = []
): {
  asyncMiddleware: Middleware
  ready: Promise<State>
} {
  const { resolve, promise } = controlledPromise<State>()
  const eventTypes = eventCreators.map(getEventType)
  const toWait = new Set<string>([...eventTypes, initDone.getType()])
  let ready = false

  const asyncMiddleware: Middleware = (middlewareApi) => {
    return (next) => {
      return (event) => {
        const result = next(event)

        if (ready) {
          return result
        }

        toWait.delete(event.type)

        if (has<'meta', Event<any, CompleteMeta>>('meta', event) && event.meta[COMPLETE]) {
          const complete = event.meta[COMPLETE]

          isArray<string>(complete)
            ? complete.forEach((type) => toWait.add(type))
            : toWait.add(complete)
        }

        if (toWait.size === 0) {
          ready = true
          resolve(middlewareApi.getState())
        }

        return result
      }
    }
  }

  return {
    asyncMiddleware,
    ready: promise
  }
}
