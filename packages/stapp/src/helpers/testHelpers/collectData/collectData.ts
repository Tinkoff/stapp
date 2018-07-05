import { EMPTY, forEach, Subscribable } from 'light-observable'
import { Thunk } from '../../../core/createApp/createApp.h'

/**
 * @private
 */
export const collectData = async <T>(stream: Subscribable<T> | void): Promise<T[]> => {
  const result: T[] = []

  return forEach((x: T) => result.push(x))(stream || EMPTY).then(() => result)
}

/**
 * @private
 */
export const collectThunkData = async (thunk: Thunk<any, any>, state?: any) => {
  const dispatch = jest.fn()
  await thunk(() => state, dispatch)

  return dispatch.mock.calls.map((call) => call[0])
}
