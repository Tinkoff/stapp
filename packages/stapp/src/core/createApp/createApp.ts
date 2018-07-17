import { PartialObserver } from 'light-observable/core/types.h'
import { Middleware } from 'redux'
import $$observable from 'symbol-observable'
import { initDone } from '../../events/initDone'
import { APP_KEY } from '../../helpers/constants'
import { isModule } from '../../helpers/is/isModule/isModule'
import { uniqueId } from '../../helpers/uniqueId/uniqueId'
import { AnyEventCreator } from '../createEvent/createEvent.h'
import { bindApi } from './bindApi'
import { AnyModule, CreateApp, Module, Stapp } from './createApp.h'
import { getReadyPromise } from './getReadyPromise'
import { getStore } from './getStore'

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
}): Stapp<State, Api> => {
  const appName = config.name || `Stapp [${uniqueId()}]`
  const anyModules = config.modules
  const dependencies = config.dependencies || {}
  const initialState = config.rehydrate || {}
  const middlewares = config.middlewares || []

  const modules: Array<Module<Partial<Api>, Partial<State>, State>> = []
  const moduleNames = new Set<string>()
  const moduleDependencies = new Set<string>()
  const reducers: any = {}
  const api: any = {}
  let waitFor: Array<AnyEventCreator | string> = []

  for (const anyModule of anyModules) {
    const module = isModule(anyModule) ? anyModule : anyModule(dependencies)
    modules.push(module)

    if (!module.name) {
      throw new Error(`${APP_KEY} error: Module name is not provided`)
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

  const { state$, event$, createDispatch, getState } = getStore<State>(
    appName,
    reducers,
    initialState,
    middlewares
  )

  for (const module of modules) {
    if (!module.epic && !module.api && !module.events) {
      continue
    }

    const dispatch = createDispatch(module.name)

    const epic = module.epic
    if (epic) {
      const epicStream = epic(event$, state$, { dispatch, getState })

      if (epicStream) {
        epicStream.subscribe(dispatch)
      }
    }

    const moduleApi: any = bindApi(module.api || module.events || {}, dispatch)
    Object.keys(moduleApi).forEach((apiKey) => {
      api[apiKey] = moduleApi[apiKey]
    })
  }

  const readyPromise = getReadyPromise(event$, getState, waitFor)
  const rootDispatch = createDispatch(appName)
  rootDispatch(initDone())

  return {
    name: appName,
    subscribe(next?: PartialObserver<State> | ((value: State) => void)) {
      return state$.subscribe(next)
    },
    dispatch: rootDispatch,
    getState,
    ready: readyPromise,
    api,
    [$$observable]() {
      return this
    }
  }
}
