import { AnyModule, Module } from '../../core/createApp/createApp.h'

/**
 * @private
 */
export const isModule = <Api, State>(
  module: AnyModule<Partial<Api>, Partial<State>, State, any>
): module is Module<Partial<Api>, Partial<State>, State> => {
  return typeof module !== 'function'
}
