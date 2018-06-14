import invariant from 'fbjs/lib/invariant'
import { diffSet } from '../diffSet/diffSet'
import { isArray } from '../isArray/isArray'

// Models
import { AnyModule, Module } from '../../core/createApp/createApp.h'

/**
 * Collects modules and checks dependencies
 * @typeparam Extra Module dependency
 * @param maybeModules
 * @param extraArgument Dependency injection
 * @returns {Array<Module<any, any, E>>}
 * @private
 */
export const getModules = <Extra>(
  maybeModules: Array<AnyModule<any, any, any, Extra>> = [],
  extraArgument: Extra
) => {
  const moduleNames = new Set()
  const dependencies = new Set()
  const modules: Array<Module<any, any, Extra>> = []

  maybeModules.forEach((maybeModule) => {
    const module = typeof maybeModule === 'function' ? maybeModule(extraArgument) : maybeModule

    invariant(module.name, 'Stapp error: Module name is not provided')

    moduleNames.add(module.name)

    if (isArray(module.dependencies)) {
      module.dependencies.forEach((dependency) => dependencies.add(dependency))
    }

    modules.push(module)
  })

  const unmetDependencies = diffSet(moduleNames, dependencies)

  invariant(
    unmetDependencies.size === 0,
    `Stapp error: Please, provide dependencies: ${Array.from(unmetDependencies).join(', ')}`
  )

  return modules
}
