import { Middleware } from 'redux'
import { PartialObserver, Subscription } from 'rxjs'
import $$observable from 'symbol-observable'
import { disconnectEvent, initEvent, readyEvent } from '../../events/lifecycle'
import { APP_KEY } from '../../helpers/constants'
import { isModule } from '../../helpers/is/isModule/isModule'
import { uniqify } from '../../helpers/uniqueId/uniqify'
import { bindApi } from './bindApi'
import {
  AnyModule,
  CreateApp,
  DevtoolsConfig,
  Module,
  Stapp,
  WaitFor
} from './createApp.h'
import { getReadyPromise } from './getReadyPromise'
import { getStore } from './getStore'
import { getConfig } from './setObservableConfig'

/**
 * Creates an application and returns a [[Stapp]].
 * Stage I
 *  1) Get module (call ModuleFactory if needed)
 *  2) Collect dependencies
 *  3) Combine reducers
 *  4) Collect waitFor
 * Stage II
 *  1) Check dependencies
 *  2) Create store
 * Stage II
 *  1) Connect epics
 *  2) Connect api
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
  devtools?: false | DevtoolsConfig
  handleEpicsErrors?: (errorCb: (error: any) => void) => void
}): Stapp<State, Api> => {
  const appName = config.name || uniqify('Stapp')
  const devtools =
    config.devtools !== false
      ? Object.assign(
          {
            name: appName
          },
          config.devtools
        )
      : false

  const anyModules = config.modules
  const dependencies = config.dependencies || {}
  const initialState = config.rehydrate || {}
  const middlewares = config.middlewares || []
  const handleEpicsErrors = config.handleEpicsErrors

  const modules: Array<Module<Partial<Api>, Partial<State>, State>> = []
  const moduleNames = new Set<string>()
  const moduleDependencies = new Set<string>()
  const reducers: any = {}
  const api: any = {}
  let waitFor: WaitFor<State> = []

  const subscriptions: Subscription[] = []

  for (const anyModule of anyModules) {
    const module = isModule(anyModule) ? anyModule : anyModule(dependencies)
    modules.push(module)

    if (!module.name) {
      throw new Error(`${APP_KEY} error: Module name is not provided`)
    }

    if (moduleNames.has(module.name)) {
      throw new Error(`${APP_KEY} error: Module name should be unique`)
    }

    moduleNames.add(module.name)

    if (module.dependencies) {
      module.dependencies.forEach((dependency) =>
        moduleDependencies.add(dependency)
      )
    }

    const moduleState: any = module.state || module.reducers
    if (moduleState) {
      Object.keys(moduleState).forEach((stateKey) => {
        reducers[stateKey] = moduleState[stateKey]
      })
    }

    if (module.waitFor) {
      waitFor = waitFor.concat(module.waitFor)
    }
  }

  moduleNames.forEach((moduleName) => moduleDependencies.delete(moduleName))
  if (moduleDependencies.size !== 0) {
    throw new Error(
      `${APP_KEY} error: Please, provide dependencies: ${Array.from(
        moduleDependencies
      ).join(', ')}`
    )
  }

  const store = getStore<State>(reducers, initialState, middlewares, devtools)

  for (const module of modules) {
    const epics = module.epic || module.epics
    const events = module.api || module.events

    if (!epics && !events) {
      continue
    }

    const dispatch = store.createDispatch(module.name)

    if (epics) {
      const epicsArray = Array.isArray(epics) ? epics : [epics]
      const { fromESObservable, toESObservable } = getConfig(module)

      epicsArray
        .map((epic) =>
          epic(fromESObservable(store.event$), fromESObservable(store.state$), {
            dispatch,
            getState: store.getState,
            fromESObservable,
            toESObservable
          })
        )
        .filter((epicStream) => !!epicStream)
        .forEach((epicStream) => {
          subscriptions.push(
            toESObservable(epicStream).subscribe(dispatch, handleEpicsErrors)
          )
        })
    }

    if (events) {
      const moduleApi: any = bindApi(events, dispatch)
      Object.keys(moduleApi).forEach((apiKey) => {
        api[apiKey] = moduleApi[apiKey]
      })
    }
  }

  const readyPromise = getReadyPromise(store.event$, store.getState, waitFor)
  const rootDispatch = store.createDispatch('root')

  store.flushQueue()
  rootDispatch(initEvent())

  const disconnect = () => {
    rootDispatch(disconnectEvent())
    store.disconnect()
    subscriptions.forEach((subscription) => {
      subscription.unsubscribe()
    })
  }

  // tslint:disable-next-line no-floating-promises
  readyPromise.then(() => rootDispatch(readyEvent()))

  return Object.freeze({
    name: appName,
    subscribe(next?: PartialObserver<State> | ((value: State) => void)) {
      return store.state$.subscribe(next as PartialObserver<State>)
    },
    dispatch: rootDispatch,
    getState: store.getState,
    ready: readyPromise,
    api,
    disconnect,
    [$$observable]() {
      return this
    }
  })
}
