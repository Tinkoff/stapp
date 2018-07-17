import { Module } from '../../../core/createApp/createApp.h'
import { Event } from '../../../core/createEvent/createEvent.h'
import { APP_KEY } from '../../constants'

/**
 * @private
 */
export const loggerModule = ({
  pattern = new RegExp(`^${APP_KEY}`)
}: {
  pattern: RegExp | void
}): Module<{}, { eventLog: Array<Event<any, any>> }> => ({
  name: 'logger',
  reducers: {
    eventLog: (state: Array<Event<any, any>> = [], event: Event<any, any>) => {
      if (event.type.startsWith('@@redux')) {
        return state
      }

      if (pattern && pattern.test(event.type)) {
        return state
      }

      return state.concat(event)
    }
  }
})
