import { Module } from '../../../core/createApp/createApp.h'
import { Event } from '../../../core/createEvent/createEvent.h'
import { APP_KEY } from '../../constants'

/**
 * @private
 */
export const loggerModule = ({
  pattern = new RegExp(`^${APP_KEY}`)
}: {
  pattern?: RegExp | null
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

export const logger = ({
  ignoreRedux = true,
  ignoreInternal = true,
  ignorePattern
}: {
  ignoreInternal?: boolean
  ignoreRedux?: boolean
  ignorePattern?: RegExp
}): Module<
  {},
  {
    logger: {
      events: Array<Event<any, any>>
      allEvents: Array<Event<any, any>>
      last: Event<any, any>
    }
  }
> => ({
  name: 'logger',
  state: {
    logger: {
      events: (state: Array<Event<any, any>> = [], event: Event<any, any>) => {
        if (ignoreRedux && event.type.startsWith('@@redux')) {
          return state
        }

        if (ignoreInternal && event.type.startsWith(APP_KEY)) {
          return state
        }

        if (ignorePattern && ignorePattern.test(event.type)) {
          return state
        }

        return state.concat(event)
      },
      allEvents: (
        state: Array<Event<any, any>> = [],
        event: Event<any, any>
      ) => {
        return state.concat(event)
      },
      last: (_, event: Event<any, any>) => event
    }
  }
})
