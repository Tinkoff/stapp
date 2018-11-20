import { concat, EMPTY, from, of } from 'rxjs'
import { APP_KEY } from '../../helpers/constants'
import { isPromise } from '../../helpers/is/isPromise/isPromise'
import { createEvent } from '../createEvent/createEvent'

// Models
import { EffectCreator } from './createEffect.h'

/**
 * @private
 */
const run = <Payload, Result>(
  params: Payload,
  effect: (payload: Payload) => Promise<Result> | Result
): Promise<Result> => {
  let response: any
  try {
    response = effect(params)
  } catch (err) {
    return Promise.reject(err)
  }

  if (isPromise(response)) {
    return response
  }

  return Promise.resolve(response)
}

/**
 * @private
 */
const T = () => true

/**
 * Creates an effect creator. Effect is a stream, that uses provided function, and emits start, success, error and complete types.
 *
 * @param description
 * @param effect Side effect performing function, should return a Promise.
 * @param condition Function, that defines if an effect should run. Must return boolean. T by default. E.g. can be used to separate server-side effects.
 * @returns
 */
export const createEffect = <Payload, Result, Error = any>(
  description: string,
  effect?: (payload: Payload) => Promise<Result> | Result,
  condition: (payload?: Payload) => boolean = T
): EffectCreator<Payload, Result, Error> => {
  const success = createEvent<Result>(`${description}: SUCCESS`)
  const fail = createEvent<any>(`${description}: FAIL`)
  const start = createEvent<Payload>(`${description}: START`)
  const complete = createEvent(`${description}: COMPLETE`)

  let _effect = effect

  const runEffect: any = (payload: Payload) => {
    if (!_effect) {
      throw new Error(`${APP_KEY} error: Effect is not provided!`)
    }

    if (!condition(payload)) {
      return EMPTY
    }

    return concat(
      of(start(payload)),
      from(
        run(payload, _effect)
          .then((result) => success(result))
          .catch((error) => fail(error))
      ),
      of(complete())
    )
  }

  return Object.assign(runEffect, {
    start,
    success,
    fail,
    complete,
    getType: () => start.getType(),
    use(fn: (payload: Payload) => Promise<Result> | Result) {
      _effect = fn
      return runEffect
    }
  })
}
