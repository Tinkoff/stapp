import { APP_KEY } from 'stapp/lib/helpers/constants'

// Models
import { Module, Event } from 'stapp'

/**
 * @private
 */
export const loggerModule = ({
  ignore = new RegExp(`^${APP_KEY}`)
}: {
  ignore?: RegExp | null
}): Module<{}, { eventLog: Array<Event<any, any>> }> => ({
  name: `${APP_KEY}/logger`,
  state: {
    eventLog: (state: Array<Event<any, any>> = [], event: Event<any, any>) => {
      if (event.type.startsWith('@@redux')) {
        return state
      }

      if (ignore && ignore.test(event.type)) {
        return state
      }

      return state.concat(event)
    }
  }
})
