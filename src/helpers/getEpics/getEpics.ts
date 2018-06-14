import { map } from 'rxjs/operators/map'
import { SOURCE_MODULE } from '../constants'
import { isEvent } from '../isEvent/isEvent'

// Models
import { Observable } from 'rxjs/Observable'
import { Epic, Module } from '../../core/createApp/createApp.h'
import { EventCreators } from '../../core/createEvent/createEvent.h'

/**
 * Gets epics from modules
 * Incoming module should be guaranteed to have an epic
 * In development mode extends event meta with info about module name to keep track on it in devtools
 * @typeparam Api Event creators
 * @typeparam State Module state
 * @typeparam Full Expected full state of application
 * @param module
 * @returns epic
 * @private
 */
export const mapModule = <
  Api extends EventCreators,
  State = void,
  Full extends Partial<State> = State
>(
  module: Module<Api, State, Full>
): Epic<State> => {
  if (process.env.NODE_ENV !== 'production') {
    return (event$, state$) => {
      const result$: Observable<any> = module.epic!(event$, state$)

      return result$.pipe(
        map((event: any) => {
          if (isEvent<{}, any>(event)) {
            event.meta = event.meta || {}
            event.meta[SOURCE_MODULE] = module.name
          }

          return event
        })
      )
    }
  }

  return module.epic!
}

/**
 * Gets epics from an array of passed modules
 * @private
 */
export const getEpics = (modules: Array<Module<any, any>>) => {
  return modules.filter((module) => !!module.epic).map(mapModule)
}
