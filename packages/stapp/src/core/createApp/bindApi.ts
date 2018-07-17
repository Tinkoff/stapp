import { Dispatch } from './createApp.h'

/**
 * @private
 */
const bindFunction = (
  actionCreator: (...args: any[]) => any,
  dispatch: Dispatch<any>
) => {
  return (...args: any[]) => dispatch(actionCreator(...args))
}

/**
 * @private
 * @internal
 */
export function bindApi<T>(api: T, dispatch: Dispatch<any>): T {
  const keys = Object.keys(api)
  const result: any = {}

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const element = (api as any)[key]

    if (typeof element === 'function') {
      result[key] = bindFunction(element, dispatch)
    }

    if (typeof element === 'object' && element !== null) {
      result[key] = bindApi(element, dispatch)
    }
  }
  return result as T
}
