import { omit } from 'stapp/lib/helpers/omit/omit'
import { pick as corePick } from 'stapp/lib/helpers/pick/pick'

// Models
import { Transform } from './persist.h'

/**
 * @private
 */
export const defaultSerialize = (data: any) => JSON.stringify(data)

/**
 * @private
 */
export const defaultDeserialize = (data: string) => JSON.parse(data)

/**
 * @private
 */
export const pick = (blackList?: string[], whiteList?: string[]) => (
  data: any
): any => {
  if (whiteList) {
    return corePick(data, whiteList)
  }

  if (blackList) {
    return omit(data, blackList)
  }

  return data
}

/**
 * @private
 */
export const mapTransform = (transforms: Transform[]) => (data: any) => {
  return Object.keys(data).reduce(
    (result, key) => {
      result[key] = transforms.reduce((subState, transform) => {
        return transform.in(subState, key, data)
      }, data[key])

      return result
    },
    {} as any
  )
}

/**
 * @private
 */
export const mapTransformRight = (transforms: Transform[]) => (data: any) => {
  return Object.keys(data).reduce(
    (result, key) => {
      result[key] = transforms.reduceRight((subState, transform) => {
        return transform.out(subState, key, data)
      }, data[key])

      return result
    },
    {} as any
  )
}

/**
 * @private
 */
export const defaultMerge = (restoredState: any, originalState: any) =>
  Object.assign({}, originalState, restoredState)
