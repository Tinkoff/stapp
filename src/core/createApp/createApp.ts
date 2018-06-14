import { applyMiddleware, compose, createStore, Middleware, Store } from 'redux'
import { from } from 'rxjs/observable/from'
import { createAsyncMiddleware } from '../../async/createAsyncMiddleware/createAsyncMiddleware'
import { combineEpics } from '../../epics/combineEpics/combineEpics'
import { createStateStreamEnhancer } from '../../epics/createStateStreamEnhancer/createStateStreamEnhancer'
import { initDone } from '../../events/initDone'
import { awaitStore } from '../../helpers/awaitStore/awaitStore'
import { getEpics } from '../../helpers/getEpics/getEpics'
import { getEvents } from '../../helpers/getEvents/getEvents'
import { getModules } from '../../helpers/getModules/getModules'
import { getReducer } from '../../helpers/getReducer/getReducer'
import { uniqueId } from '../../helpers/uniqueId/uniqueId'

// Models
import { AnyEventCreator } from '../createEvent/createEvent.h'
import { AnyModule, CreateApp, Stapp } from './createApp.h'

/**
 * @private
 * @returns {boolean}
 */
const useReduxEnhancer = () =>
  process.env.NODE_ENV !== 'production' &&
  typeof window === 'object' && // tslint:disable-line strict-type-predicates
  !!(window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__

/**
 * @private
 */
const bindFunction = (actionCreator: (...args: any[]) => any, store: Store<any>) => {
  return (...args: any[]) => store.dispatch(actionCreator(...args))
}

/**
 * @private
 */
const bindApi = <T>(api: T, store: Store<any>): T => {
  const keys = Object.keys(api)
  const result: any = {}

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const element = (api as any)[key]

    if (typeof element === 'function') {
      result[key] = bindFunction(element, store)
    }

    if (typeof element === 'object' && element !== null) {
      result[key] = bindApi(element, store)
    }
  }
  return result as T
}

/**
 * Creates an application and returns a [[Stapp]].
 * @param config createApp config
 * @param config.name Application name
 * @param config.modules Array of modules or module factories
 * @param config.dependencies Argument that will be passed to every module factory
 * @param config.rehydrate Value will be passed as an initialState to redux createStore
 */
export const createApp: CreateApp = <Api, State, Extra>(config: {
  name?: string
  modules: Array<AnyModule<any, Partial<State>, State, Partial<Extra>>>
  dependencies?: Extra
  rehydrate?: Partial<State>
  middlewares?: Middleware[]
}): Stapp<State, Api> => {
  const name = config.name || `Stapp [${uniqueId()}]`
  const dependencies: Extra = Object.assign({}, config.dependencies)
  const middlewares = config.middlewares || []

  // Modules
  const modules = getModules(config.modules, dependencies)
  const rootReducer = getReducer(modules)
  const rootEpic = combineEpics(getEpics(modules) as any)
  const events = getEvents<Api>(modules)
  const waitFor = modules.reduce(
    (result: Array<AnyEventCreator | string>, module) => result.concat(module.waitFor || []),
    []
  )

  // Epics
  const { stateStreamEnhancer } = createStateStreamEnhancer(rootEpic)

  // Async
  const { ready, asyncMiddleware } = createAsyncMiddleware<State>(waitFor)

  // Store
  const composeEnhancers = useReduxEnhancer()
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        name
      })
    : compose

  const store = createStore<State>(
    rootReducer,
    config.rehydrate || ({} as any),
    composeEnhancers(applyMiddleware(...middlewares, asyncMiddleware), stateStreamEnhancer)
  )

  awaitStore(name, ready)

  store.dispatch(initDone())

  return {
    name,
    state$: from(store as any),
    dispatch: store.dispatch,
    getState: store.getState,
    api: bindApi(events, store)
  }
}
