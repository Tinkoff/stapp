import invariant from 'fbjs/lib/invariant'
import { has } from '../has/has'

/**
 * Ensures modules not to overwrite properties, set by other modules
 * @param {T} result
 * @param {T} fieldData
 * @private
 */
const checkDuplications = <T = any>(result: T, fieldData: T) => {
  Object.keys(fieldData).forEach((key) =>
    invariant(!has(key, result), `Stapp error: Duplicate field: ${key}`)
  )
}

/**
 * Merges values of provided objects into one
 * @param fields array of fields names
 * @param objects
 * @returns
 * @private
 */
export const merge = <F extends string, T, O extends { [K in F]?: T }>(
  fields: F[],
  objects: O[]
): T => {
  return objects.reduce(
    (result, object) => {
      for (const field of fields) {
        if (object[field]) {
          checkDuplications(result, object[field])
          return Object.assign(result, object[field])
        }
      }

      return result
    },
    {} as T // tslint:disable-line no-object-literal-type-assertion
  )
}
