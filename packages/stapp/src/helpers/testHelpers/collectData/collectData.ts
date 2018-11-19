import { EMPTY, Subscribable } from 'rxjs'
import { Thunk } from '../../../core/createApp/createApp.h'

/**
 * @private
 */
export async function collectData<T>(
  stream: Subscribable<T> = EMPTY
): Promise<T[]> {
  const result: T[] = []

  return new Promise((res, rej) =>
    stream.subscribe({
      next: (x: T) => result.push(x),
      complete: res,
      error: rej
    })
  ).then(() => result)
}

/**
 * @private
 */
export async function collectThunkData(thunk: Thunk<any, any>, state?: any) {
  const dispatch = jest.fn()
  await thunk(() => state, dispatch)

  return dispatch.mock.calls.map((call) => call[0])
}
