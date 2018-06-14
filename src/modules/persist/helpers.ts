import { has } from '../../helpers/has/has'

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
export const pick = (blackList?: string[], whiteList?: string[]) => (data: any): any => {
  if (whiteList) {
    return whiteList.reduce(
      (result, key) => {
        if (has(key, data)) {
          result[key] = (data as any)[key]
        }

        return result
      },
      {} as any
    )
  }

  if (blackList) {
    return Object.keys(data).reduce(
      (result, key) => {
        if (blackList.indexOf(key) === -1) {
          result[key] = data[key]
        }

        return result
      },
      {} as any
    )
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
