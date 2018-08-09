import { APP_KEY } from 'stapp/lib/helpers/constants'

// Models
import { Module, Event } from 'stapp'

const stappPattern = new RegExp(`^${APP_KEY}`)

/**
 * @private
 */
export const loggerModule = ({
  ignore,
  ignoreInnerEvents = true,
  clearMeta = true
}: {
  ignore?: RegExp
  ignoreInnerEvents?: boolean
  clearMeta?: boolean
} = {}): Module<{}, { eventLog: Array<Event<any, any>> }> => ({
  name: `${APP_KEY}/logger`,
  state: {
    eventLog: (state: Array<Event<any, any>> = [], event: Event<any, any>) => {
      if (event.type.startsWith('@@redux')) {
        return state
      }

      if (ignoreInnerEvents && stappPattern.test(event.type)) {
        return state
      }

      if (ignore && ignore.test(event.type)) {
        return state
      }

      if (clearMeta) {
        delete event.meta
      }

      return state.concat(event)
    }
  }
})
