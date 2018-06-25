import { Store } from 'redux'

/**
 * @private
 */
const bindFunction = (actionCreator: (...args: any[]) => any, store: Store<any>) => {
  return (...args: any[]) => store.dispatch(actionCreator(...args))
}

/**
 * @private
 */
export const bindApi = <T>(api: T, store: Store<any>): T => {
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
