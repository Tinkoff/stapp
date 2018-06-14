import { Module } from '../../../core/createApp/createApp.h'
import { Event } from '../../../core/createEvent/createEvent.h'

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

      return state.concat(event)
    }
  }
}
