import { EMPTY } from 'light-observable/observable'
import { forEach } from 'light-observable/operators'

// Models
import { Subscribable } from 'light-observable'
import { Thunk } from '../../../core/createApp/createApp.h'

/**
 * @private
 */
export async function collectData<T>(stream: Subscribable<T> | void): Promise<T[]> {
  const result: T[] = []

  return forEach((x: T) => result.push(x))(stream || EMPTY).then(() => result)
}

/**
 * @private
 */
export async function collectThunkData(thunk: Thunk<any, any>, state?: any) {
  const dispatch = jest.fn()
  await thunk(() => state, dispatch)

  return dispatch.mock.calls.map((call) => call[0])
}
