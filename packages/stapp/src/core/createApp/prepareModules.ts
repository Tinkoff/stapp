import { Reducer } from 'redux'
import { combineEpics } from '../../epics/combineEpics/combineEpics'
import { diffSet } from '../../helpers/diffSet/diffSet'
import { isModule } from '../../helpers/isModule/isModule'
import { AnyEventCreator } from '../createEvent/createEvent.h'
import { AnyModule, Epic, Module } from './createApp.h'
import { getRootReducer } from './getRootReducer'

/**
 * @private
 */
export const prepareModules = <Api, State, Extra>(
  modules: Array<AnyModule<Partial<Api>, Partial<State>, State, Partial<Extra>>>,
  initialState: Partial<State>,
  dependencies: Extra
): {
  rootReducer: Reducer<State>
  rootEpic: Epic<State>
  events: { [K in keyof Api]: Api[K] }
  waitFor: Array<AnyEventCreator | string>
} => {
  const moduleNames = new Set()
  const moduleDependencies = new Set()
  const api: any = {}
  const state: any = {}
  let epics: any = []
  let waitFor: any = []

  for (const anyModule of modules) {
    const module: Module<any, Partial<State>, State> = isModule(anyModule)
      ? anyModule
      : anyModule(dependencies)
    const moduleApi: any = module.api || module.events
    const moduleState: any = module.state || module.reducers

    if (!module.name) {
      throw new Error('Stapp error: Module name is not provided')
    }

    moduleNames.add(module.name)

    if (module.dependencies) {
      module.dependencies.forEach((dependency) => moduleDependencies.add(dependency))
    }

    if (moduleApi) {
      Object.keys(moduleApi).forEach((apiKey) => {
        api[apiKey] = moduleApi[apiKey]
      })
    }

    if (moduleState) {
      Object.keys(moduleState).forEach((stateKey) => {
        state[stateKey] = moduleState[stateKey]
      })
    }

    if (module.epic) {
      epics = epics.concat(module.epic)
    }

    /* istanbul ignore next */
    if (module.waitFor) {
      /* istanbul ignore next */
      waitFor = waitFor.concat(waitFor)
    }
  }

  const unmetDependencies = diffSet(moduleNames, moduleDependencies)

  if (unmetDependencies.size !== 0) {
    throw new Error(
      `Stapp error: Please, provide dependencies: ${Array.from(unmetDependencies).join(', ')}`
    )
  }

  return {
    rootReducer: getRootReducer(state, initialState),
    rootEpic: combineEpics(epics),
    events: api,
    waitFor
  }
}
