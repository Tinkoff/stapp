import { applyMiddleware, compose, createStore, Middleware } from 'redux'
import { from } from 'rxjs/observable/from'
import { createAsyncMiddleware } from '../../async/createAsyncMiddleware/createAsyncMiddleware'
import { createStateStreamEnhancer } from '../../epics/createStateStreamEnhancer/createStateStreamEnhancer'
import { initDone } from '../../events/initDone'
import { awaitStore } from '../../helpers/awaitStore/awaitStore'
import { uniqueId } from '../../helpers/uniqueId/uniqueId'
import { bindApi } from './bindApi'
import { AnyModule, CreateApp, Stapp } from './createApp.h'
import { prepareModules } from './prepareModules'

/**
 * @private
 * @returns {boolean}
 */
const useReduxEnhancer = () =>
  process.env.NODE_ENV !== 'production' &&
  typeof window === 'object' && // tslint:disable-line strict-type-predicates
  !!(window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__

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
  modules: Array<AnyModule<Partial<Api>, Partial<State>, State, Partial<Extra>>>
  dependencies?: Extra
  rehydrate?: Partial<State>
  middlewares?: Middleware[]
}): Stapp<State, Api> => {
  const name = config.name || `Stapp [${uniqueId()}]`
  const dependencies: Extra = Object.assign({}, config.dependencies)
  const middlewares = config.middlewares || []

  // Modules
  const { rootReducer, rootEpic, events, waitFor } = prepareModules(config.modules, dependencies)

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
