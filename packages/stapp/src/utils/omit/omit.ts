import { has } from '../../helpers/has/has'
import { Omit } from '../../types/omit'

export const omit = <T, K extends keyof T>(obj: T, props: K[]): Omit<T, K> => {
  const result: { [K: string]: any } = {}

  for (const key in obj) {
    if (has(key, obj) && !props.includes(key as any)) {
      result[key] = obj[key]
    }
  }

  return result as Omit<T, K>
}
