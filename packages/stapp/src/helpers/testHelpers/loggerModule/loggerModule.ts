import { Module } from '../../../core/createApp/createApp.h'
import { Event } from '../../../core/createEvent/createEvent.h'
import { APP_KEY } from '../../constants'

/**
 * @private
 */
export const loggerModule: Module<{}, { eventLog: Array<Event<any, any>> }> = {
  name: 'logger',
  reducers: {
    eventLog: (state: Array<Event<any, any>> = [], event: Event<any, any>) => {
      if (event.type.startsWith('@@redux')) {
        return state
      }

      if (event.type.startsWith(APP_KEY)) {
        return state
      }

      return state.concat(event)
    }
  }
}
